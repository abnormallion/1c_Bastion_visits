const cron = require("node-cron");
const bodyParser = require("body-parser");
const express = require("express");
const io = require("socket.io")();

const config = require("./config/config");
const files = require("./routes/files");
const db = require("./routes/db");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

cron.schedule(config.cronScheduler, async () => {
  await files.getDataFromBastion();
});

app.get("/allvisits", async (req, res) => {
  var data1C = files.getDataFrom1C();
  var dataFinal = await db.getDbRecords(data1C);
  if (!dataFinal) {
    res.status(400).send({ err: "Нет данных!" });
  }
  res.status(200).send(dataFinal);
});

// test route
app.get("/test", (req, res) => {
  res.status(200).send({ result: "GET: /test" });
});

// FRONTEND
app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(config.port, async () => {
  console.log(`Server running (port: ${config.port})`);
});

io.on("connection", client => {
  client.on("subscribeToStatsData", interval => {
    console.log("client is subscribing to stats data with interval ", interval);
    setInterval(async () => {
      var data1C = files.getDataFrom1C();
      var dataFinal = await db.getDbRecords(data1C);
      if (dataFinal) {
        client.emit("StatsData", dataFinal);
      }
    }, interval);
  });

  client.on("subscribeToStatsDataOnce", async () => {
    console.log("client is subscribing to stats data Once");

    var data1C = files.getDataFrom1C();
    var dataFinal = await db.getDbRecords(data1C);
    if (dataFinal) {
      client.emit("StatsData", dataFinal);
    }
  });
});

const portIO = 8000;
io.listen(portIO);
console.log("listening on port IO ", portIO);
