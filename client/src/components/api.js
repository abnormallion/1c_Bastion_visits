import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:8000");
function subscribeToStatsData(cb) {
  socket.on("StatsData", StatsData => cb(null, StatsData));
  socket.emit("subscribeToStatsData", 10000);
}

function subscribeToStatsDataOnce(cb) {
  socket.on("StatsDataOnce", StatsData => cb(null, StatsData));
  socket.emit("subscribeToStatsDataOnce");
}

export { subscribeToStatsData, subscribeToStatsDataOnce };
