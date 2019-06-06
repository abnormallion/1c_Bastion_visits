const cron = require("node-cron");
const bodyParser = require("body-parser");
const express = require("express");
const io = require("socket.io")();

const config = require("./config/config");
const filesOperations = require("./routes/filesOperations");
const dbOperations = require("./routes/dbOperations");
const oneCOperations = require("./routes/1cOperations");

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

cron.schedule(config.cronScheduler, () => {
  filesOperations.checkFiles();
});

// app.get("/allvisits", (req, res) => {
//   oneCOperations.getDataFromOneC(workMode, objectResult, obj => {
//     if (obj != undefined && obj.err != undefined && obj.err) {
//       res.status(400).send({ err: obj.err });
//     } else {
//       dbOperations.getVisitsFromDB(workMode, objectResult, obj => {
//         if (obj != undefined && obj.err != undefined && obj.err) {
//           //console.log("123", obj.err);
//           res.status(400).send({ err: obj.err });
//         } else res.status(200).send(objectResult);
//       });
//     }
//   });
// });

// test route
app.get("/test", (req, res) => {
  res.status(200).send({ result: "GET: /test" });
});

app.listen(config.port, () =>
  console.log(`Server running (port: ${config.port})`)
);

io.on("connection", client => {
  client.on("subscribeToStatsData", interval => {
    console.log("client is subscribing to stats data with interval ", interval);
    setInterval(() => {
      oneCOperations.getDataFromOneC(workMode, objectResult, (obj1, err1) => {
        if (!err1) {
          dbOperations.getVisitsFromDB(workMode, objectResult, (obj2, err2) => {
            if (!err2) {
              console.log("objectResult ", objectResult);
              client.emit("StatsData", objectResult);
            } else {
              console.log("getVisitsFromDB err2: ", err2);
            }
          });
        } else {
          console.log("getDataFromOneC err1: ", err1);
        }
      });
    }, interval);
  });
});

const portIO = 8000;
io.listen(portIO);
console.log("listening on port IO ", portIO);
