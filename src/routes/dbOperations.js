const fs = require("fs");
const async = require("async");
const mssql = require("mssql");
const moment = require("moment");

const config = require("../config/config");

var dateNow = moment(new Date()).format("YYYY_MM_DD");
var path = config.pathFolderWithFilesBastion + dateNow;
var dbconfig = config.dbconfig;

function getVisitsBreakfast(workMode, result, callback) {
  if (workMode.breakfast != undefined) {
    timeStart = workMode.breakfast.periodWith;
    timeFinish = workMode.breakfast.periodBy;
    getRecords(timeStart, timeFinish, objectResult => {
      console.log("breakfast");
      if (objectResult.err) {
        // console.log(objectResult.err);
        callback({ err: objectResult.err });
      } else {
        console.log(objectResult.recordsNumber);
        result.breakfast.factVisit = objectResult.recordsNumber;
        callback();
      }
    });
  } else {
    callback();
  }
}

function getVisitsDinner(workMode, result, callback) {
  if (workMode.dinner != undefined) {
    timeStart = workMode.dinner.periodWith;
    timeFinish = workMode.dinner.periodBy;
    getRecords(timeStart, timeFinish, objectResult => {
      console.log("dinner");
      if (objectResult.err) {
        console.log(objectResult.err);
        callback({ err: objectResult.err });
      } else {
        console.log(objectResult.recordsNumber);
        result.dinner.factVisit = objectResult.recordsNumber;
        callback();
      }
    });
  } else {
    callback();
  }
}

function getVisitsSupper(workMode, result, callback) {
  if (workMode.supper != undefined) {
    timeStart = workMode.supper.periodWith;
    timeFinish = workMode.supper.periodBy;
    getRecords(timeStart, timeFinish, objectResult => {
      console.log("supper");
      if (objectResult.err) {
        console.log(objectResult.err);
        callback({ err: objectResult.err });
      } else {
        console.log(objectResult.recordsNumber);
        result.supper.factVisit = objectResult.recordsNumber;
        callback();
      }
    });
  } else {
    callback();
  }
}

var getVisitsFromDB = function(workMode, result, callback) {
  getVisitsBreakfast(workMode, result, obj => {
    //console.log("obj", obj);
    if (obj != undefined && obj.err) {
      callback(obj, obj.err);
      return;
    }

    // console.log("late");
    getVisitsDinner(workMode, result, obj => {
      if (obj != undefined && obj.err) {
        callback(obj, obj.err);
        return;
      }
      getVisitsSupper(workMode, result, obj => {
        console.log("callback");
        callback(obj, null);
      });
    });
  });
};

var addRecord = function(fileRecords, pathFile) {
  var array = pathFile.split("/");
  var fileName = "";
  if (array.length > 0) fileName = array[array.length - 1];

  async.each(
    fileRecords,
    (jsonData, callback) => {
      var conn = new mssql.ConnectionPool(dbconfig);
      conn
        .connect()
        .then(() => {
          var request = new mssql.Request(conn);

          field1Value = jsonData.field1;
          periodValue = new Date(
            moment(jsonData.period, "DD-MM-YYYY HH:mm:ss")
          ).toISOString();
          console.log(periodValue);
          request.input("param1", field1Value);
          request.input("param2", periodValue);

          request
            .query(
              "SELECT * From TableTest2 Where period = @param2 AND CONVERT(VARCHAR, field1) = @param1"
            )
            .then(recordset => {
              console.log(recordset.recordset.length);
              if (recordset != undefined && recordset.recordset.length > 0) {
                console.log("Don't insert row - this record yet exists");
                callback();
              } else {
                console.log("Can insert row");
                periodValue = new Date(
                  moment(jsonData.period, "DD-MM-YYYY HH:mm:ss")
                ).toISOString();
                var textQuery =
                  "Insert INTO TableTest2 (field1, period, field3, field4, field5, field6) VALUES ";
                textQuery +=
                  "('" +
                  jsonData.field1 +
                  "', '" +
                  periodValue +
                  "', '" +
                  jsonData.field3 +
                  "', '" +
                  jsonData.field4 +
                  "', '" +
                  jsonData.field5 +
                  "', '" +
                  jsonData.field6 +
                  "')";
                console.log(textQuery);
                request
                  .query(textQuery)
                  .then(recordset => {
                    console.log("Success add new order to db");
                    console.log(recordset);
                    callback();
                  })
                  .catch(err => {
                    console.log(err);
                    callback(err);
                  });
              }
            })
            .catch(err => {
              console.log(err);
              callback(err);
            });
        })
        .catch(err => {
          console.log(err);
          callback(err);
        });
    },
    err => {
      if (err) {
        console.log("Error", err);
      } else {
        //rename file
        console.log(pathFile);
        fs.rename(new URL(pathFile), new URL(path + "/$$_" + fileName), err => {
          if (err) throw err;
          console.log("Rename complete!");
        });
      }
    }
  );
};

var getRecords = function(periodHoursWith, periodHoursBy, callback) {
  var conn = new mssql.ConnectionPool(dbconfig);
  conn
    .connect()
    .then(() => {
      console.log("Connect to MSSQL");

      // create Request object
      var request = new mssql.Request(conn);
      var dateNowFormatted = moment(new Date()).format("DD.MM.YYYY");
      //var dateNowFormatted = "30.05.2019";

      //var periodHoursWith = "15:00:00";
      var periodWith = dateNowFormatted + " " + periodHoursWith;
      var periodWithValue = new Date(
        moment(periodWith, "DD-MM-YYYY HH:mm:ss")
      ).toISOString();
      //var periodHoursBy = "18:00:00";
      var periodBy = dateNowFormatted + " " + periodHoursBy;
      var periodByValue = new Date(
        moment(periodBy, "DD-MM-YYYY HH:mm:ss")
      ).toISOString();
      console.log("Period with " + periodWithValue + " by " + periodByValue);
      request.input("param1", periodWithValue);
      request.input("param2", periodByValue);
      request
        .query(
          "select * from TableTest2 WHERE period BETWEEN @param1 AND @param2"
        )
        .then(recordset => {
          console.log(recordset.recordset.length);
          console.log(recordset);
          callback({ recordsNumber: recordset.recordset.length });
        })
        .catch(err => {
          console.log(err);
          callback({ err });
        });
    })
    .catch(err => {
      console.log(err);
      callback({ err });
    });
};

module.exports = { addRecord, getRecords, getVisitsFromDB };
