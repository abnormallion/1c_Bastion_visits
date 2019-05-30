const cron = require("node-cron");
const bodyParser = require("body-parser");
const express = require("express");

const config = require("./src/config/config");
const filesOperations = require("./src/filesOperations/filesOperations");
const dbOperations = require("./src/dbOperations/dbOperations");
const oneCOperations = require("./src/1cOperations/1cOperations");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

var workMode = {
  breakfast: {
    periodWith: "",
    periodBy: ""
  },
  dinner: {
    periodWith: "",
    periodBy: ""
  },
  supper: {
    periodWith: "",
    periodBy: ""
  }
};

var objectResult = {
  breakfast: {
    planVisit: 0,
    factVisit: 0,
    periodWith: "",
    periodBy: ""
  },
  dinner: {
    planVisit: 0,
    factVisit: 0,
    periodWith: "",
    periodBy: ""
  },
  supper: {
    planVisit: 0,
    factVisit: 0,
    periodWith: "",
    periodBy: ""
  }
};

//test
//filesOperations.checkFiles();

// oneCOperations.getWorkMode(workMode);
// oneCOperations.getPlanVisit(result);

cron.schedule("* * * * *", () => {
  filesOperations.checkFiles();
});

app.get("/allvisits", (req, res) => {
  oneCOperations.getDataFromOneC(workMode, objectResult, () => {
    //if (err) res.status(400).send(err);

    dbOperations.getVisitsFromDB(workMode, objectResult, () => {
      // if (err) res.status(400).send(err);
      // else
      res.status(200).send(objectResult);
    });
  });
});

// test route
app.get("/test", (req, res) => {
  res.status(200).send({ result: "GET: /test" });
});

app.listen(config.port, () =>
  console.log(`Server running (port: ${config.port})`)
);
