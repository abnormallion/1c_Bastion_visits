const fs = require("fs");

const config = require("../config/config");
var { pathFileWithWorkMode, pathFileWithPlanInformation } = config;

var getWorkMode = function(workMode, result, callback) {
  fs.readFile(new URL(pathFileWithWorkMode), "utf8", (err, data) => {
    if (err) {
      console.log(err);
      callback({ err });
    } else {
      var arrayString = data.split("\r");
      arrayString.forEach(elementString => {
        elementString = elementString.replace(/\r?\n/g, "");
        var arrayElements = elementString.split(";");
        //console.log(arrayElements)
        if (arrayElements.length > 0) {
          //console.log(arrayElements[0]);
          if (arrayElements.length >= 1) {
            try {
              workMode[arrayElements[0]].periodWith = arrayElements[1];
              result[arrayElements[0]].periodWith = arrayElements[1];
            } catch {
              console.log(err);
            }
          }
          if (arrayElements.length >= 2) {
            try {
              workMode[arrayElements[0]].periodBy = arrayElements[2];
              result[arrayElements[0]].periodBy = arrayElements[2];
            } catch {
              console.log(err);
            }
          }
        }
      });
      console.log("workMode", workMode);
      callback();
    }
  });
};

var getPlanVisit = function(result, callback) {
  //   if (result.breakfast != undefined) result.breakfast.planVisit = 10;
  //   if (result.dinner != undefined) result.dinner.planVisit = 10;
  //   if (result.supper != undefined) result.supper.planVisit = 10;

  result.breakfast.planVisit = 0;
  result.dinner.planVisit = 0;
  result.supper.planVisit = 0;

  fs.readFile(new URL(pathFileWithPlanInformation), "utf8", (err, data) => {
    if (err) {
      console.log(err);
      callback();
    } else {
      var arrayString = data.split("\r");
      arrayString.forEach(elementString => {
        elementString = elementString.replace(/\r?\n/g, "");
        var arrayElements = elementString.split(";");
        if (arrayElements.length > 0) {
          if (arrayElements.length >= 1) {
            try {
              result[arrayElements[0]].planVisit = parseInt(arrayElements[1]);
            } catch {
              console.log(err);
              //callback();
            }
          }
        }
      });
      console.log(result);
      callback();
    }
  });
};

var getDataFromOneC = function(workMode, result, callback) {
  getWorkMode(workMode, result, obj => {
    if (obj != undefined && obj.err) {
      callback(obj);
      return;
    }

    getPlanVisit(result, () => {
      callback();
    });
  });
};

module.exports = { getWorkMode, getPlanVisit, getDataFromOneC };
