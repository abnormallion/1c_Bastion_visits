const fs = require("fs");
var path = require("path");
const moment = require("moment");
var os = require("os");
var EOL = os.EOL;

const config = require("../config/config");
const db = require("./db");

var readCSV = file => {
  var array = [];
  try {
    var fileContents = fs.readFileSync(file);
    var lines = fileContents.toString().split(EOL);

    for (var i = 0; i < lines.length; i++) {
      array.push(lines[i].toString().split(";"));
    }
  } catch (err) {
    console.log(err);
  }
  return array;
};

var readJSON = file => {
  try {
    const jsonString = fs.readFileSync(file, "utf8");
    const jsonData = JSON.parse(jsonString);
    return jsonData;
  } catch (err) {
    console.log(err);
    return null;
  }
};

var getDataFrom1C = () => {
  var workMode = readJSON(config.WorkModeFile);
  var planDataArray = readCSV(config.PlanInformationFile);

  if (!workMode) {
    return null;
  }

  console.log("workMode: ", workMode);
  console.log("planDataArray: ", planDataArray);

  planDataArray.forEach((item, i) => {
    if (item.length <= 1) return;
    var typeVisit = item[0];
    var planVisit = item[1];

    workMode[typeVisit].planVisit = planVisit;
    workMode[typeVisit].factVisit = 0;
  });

  console.log("finalData: ", workMode);
  return workMode;
};

var getDataFromBastion = async () => {
  var dir = config.BastionFolder;
  var suDir = dir + moment(new Date()).format("YYYY_MM_DD");
  console.log("Bastion folder: ", suDir);
  if (!fs.existsSync(suDir)) {
    console.log("Bastion folder doesn't exist! ", suDir);
    return null;
  }
  var DataArray = [];
  var FilesArray = [];
  fs.readdirSync(suDir).forEach(file => {
    if (file.substring(0, 2) === "$$") return;

    console.log(file);
    var filePath = path.join(suDir, file);
    var partOfDataArray = readCSV(filePath);
    console.log("partOfDataArray: ", partOfDataArray);
    FilesArray.push(filePath);

    partOfDataArray.forEach((item, i) => {
      if (item.length <= 1) return;
      DataArray.push(item);
    });
  });
  console.log("DataArray: ", DataArray);

  // store to DB
  var isStoreSuccess = await db.addRecords(DataArray);
  if (isStoreSuccess) {
    // if everything stored success - rename files
    console.log("All stored!");
    FilesArray.forEach(file => {
      var newFullName = path.join(suDir, "$$_" + path.basename(file));
      try {
        fs.renameSync(file, newFullName);
      } catch (err) {
        console.log(err);
        console.log("current filename: ", file);
        console.log("new filename: ", newFullName);
      }
    });
    console.log("All renamed!");
  }
};

module.exports = { readCSV, readJSON, getDataFrom1C, getDataFromBastion };