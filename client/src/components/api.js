import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:8000");
function subscribeToStatsData(cb) {
  socket.on("StatsData", StatsData => cb(null, StatsData));
  socket.emit("subscribeToStatsData", 5000);
}
export { subscribeToStatsData };
