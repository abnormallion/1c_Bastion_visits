const fs = require("fs");
const moment = require("moment");

const dbOperations = require("../dbOperations/dbOperations");
const config = require("../config/config");

var dateNow = moment(new Date()).format("YYYY_MM_DD");
//var dateNow = "2019_05_29";
var path = config.pathFolderWithFilesBastion + dateNow;

console.log(path);

function getFile(filename) {
  //console.log(filename);
  return fs.readFileAsync(filename, "utf8");
}

function isDataFile(filename) {
  return filename.substring(0, 2) !== "$$";
}

fs.readdirAsync = dirname => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) reject(err);
      else resolve(filenames);
    });
  });
};

fs.readFileAsync = (filename, enc) => {
  return new Promise((resolve, reject) => {
    var fullFileName = path + "/" + filename;

    fs.readFile(new URL(fullFileName), enc, (err, data) => {
      if (err) reject(err);
      else {
        var object = {
          data: data,
          fileName: fullFileName
        };
        //console.log(object);
        resolve(object);
        // console.log(fullFileName);
      }
    });
  });
};

var checkFiles = function() {
  fs.readdirAsync(new URL(path))
    .then(filenames => {
      filenames = filenames.filter(isDataFile);
      //console.log(filenames);
      return Promise.all(filenames.map(getFile));
    })
    .then(files => {
      //console.log(objectFiles);
      //console.log(fileName);
      files.forEach(objectFile => {
        var file = objectFile.data;
        var fileName = objectFile.fileName;

        //console.log(file);

        var fileRecords = [];
        var arrayString = file.split("\r");
        //console.log(arrayString);
        arrayString.forEach(elementString => {
          elementString = elementString.replace(/\r?\n/g, "");
          var arrayElements = elementString.split(";");

          //console.log(elementString);
          var recordObject = {
            field1: "",
            period: "",
            field3: "",
            field4: "",
            field5: "",
            field6: ""
          };

          isPushed = false;
          for (let i = 0; i < arrayElements.length; i++) {
            var element = arrayElements[i];
            if (element === "") continue;
            isPushed = true;
            if (i === 0) {
              recordObject.field1 = element;
            }
            if (i === 1) {
              recordObject.period = element;
            }
            if (i === 2) {
              recordObject.field3 = element;
            }
            if (i === 3) {
              recordObject.field4 = element;
            }
            if (i === 4) {
              recordObject.field5 = element;
            }
            if (i === 5) {
              recordObject.field6 = element;
            }
          }

          if (isPushed) fileRecords.push(recordObject);
        });
        // console.log(fileRecords.length);
        // console.log(fileName);
        dbOperations.addRecord(fileRecords, fileName);
      });
    })
    .catch(err => {
      if (err) console.log(err);
    });
};

module.exports = { checkFiles };
