const sql = require("mssql");
const moment = require("moment");

const config = require("../config/config");
const files = require("./files");

var executeQuery = (query, cb) => {
  sql.connect(config.dbconfig, err => {
    if (err) {
      console.log("Error while connecting database: ", err);
      cb(err);
    } else {
      // create Request object
      var request = new sql.Request();
      // query to the database
      request.query(query, (err, rs) => {
        if (err) {
          console.log("Error while querying database: " + err);
          cb(err);
          sql.close();
        } else {
          cb(null, rs);
          sql.close();
        }
      });
    }
  });
};

var getDbRecords = async data => {
  var dateNow = moment(new Date()).format("YYYY.MM.DD");
  var date1 = moment(
    new Date(`${dateNow} ${data.breakfast.start}`)
  ).toISOString();
  var date2 = moment(
    new Date(`${dateNow} ${data.breakfast.end}`)
  ).toISOString();
  var date3 = moment(new Date(`${dateNow} ${data.dinner.start}`)).toISOString();
  var date4 = moment(new Date(`${dateNow} ${data.dinner.end}`)).toISOString();
  var date5 = moment(new Date(`${dateNow} ${data.supper.start}`)).toISOString();
  var date6 = moment(new Date(`${dateNow} ${data.supper.end}`)).toISOString();

  //   console.log("date1: ", date1);
  //   console.log("date2: ", date2);
  //   console.log("date3: ", date3);
  //   console.log("date4: ", date4);
  //   console.log("date5: ", date5);
  //   console.log("date6: ", date6);

  try {
    await sql.connect(config.dbconfig);
    //var result = await sql.query`select * from mytable where id = ${value}`;
    var result = await sql.query`select
    SUM(CASE WHEN period BETWEEN ${date1} AND ${date2} THEN 1 ELSE 0 END) as breakfast,
    SUM(CASE WHEN period BETWEEN ${date3} AND ${date4} THEN 1 ELSE 0 END) as dinner,
    SUM(CASE WHEN period BETWEEN ${date5} AND ${date6} THEN 1 ELSE 0 END) as supper
    from TableTest2`;

    if (result.recordsets.length > 0 && result.recordset.length > 0) {
      var dbresults = result.recordset[0];
      data.breakfast.factVisit = dbresults.breakfast;
      data.dinner.factVisit = dbresults.dinner;
      data.supper.factVisit = dbresults.supper;
    }

    console.log("final: ", data);
    sql.close();
  } catch (err) {
    console.log("sql err: ", err);
  } finally {
    sql.close(); //closing connection after request is finished.
  }
  return data;
};

var checkAndAddRecord = async (record, i) => {
  var field1 = record[0];
  var period = moment(record[1], "DD-MM-YYYY HH:mm:ss").toISOString();
  // console.log("Try connect: ", i);

  const pool = new sql.ConnectionPool(config.dbconfig);
  pool.on("error", err => {
    console.log("sql connection pool error: ", err);
  });

  try {
    await pool.connect();
    var request = await pool.request();

    result = await request.query`SELECT * From TableTest2 Where period = ${period} AND CONVERT(VARCHAR, field1) = ${field1}`;
    // console.log("result checkRecord: ", result);
    if (result.recordsets.length > 0 && result.recordsets[0].length) {
      return true;
    } else {
      var periodinsertion = new Date(
        moment(record[1], "DD-MM-YYYY HH:mm:ss")
      ).toISOString();
      console.log("periodinsertion: ", periodinsertion);

      request.input("field1", record[0]);
      request.input("period", periodinsertion);
      request.input("field3", record[2]);
      request.input("field4", record[3]);
      request.input("field5", record[4]);
      request.input("field6", record[5]);

      var isertion = await request.query(
        "Insert INTO TableTest2 (field1, period, field3, field4, field5, field6) VALUES (@field1, @period, @field3, @field4, @field5, @field6)"
      );

      // console.log("isertion checkRecord: ", isertion);
      return true;
    }
  } catch (err) {
    console.log("err checkRecord: ", err);
    return false;
  } finally {
    // console.log("finally checkRecord :)");
    pool.close(); //closing connection after request is finished.
    return true;
  }
};

var addRecords = async dataArray => {
  // var dataArray = files.getDataFromBastion();
  for (var i = 0; i < dataArray.length; i++) {
    var isSuccess = await checkAndAddRecord(dataArray[i], i);
    if (!isSuccess) {
      return false;
    }
  }
  return true;
};

module.exports = { executeQuery, getDbRecords, addRecords };
