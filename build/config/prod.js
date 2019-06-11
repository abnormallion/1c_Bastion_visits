module.exports = {
  port: process.env.PORT || 5000,
  pathFileWithWorkMode: "file:///D:/work/parsing_files/files_1c/mode.csv",
  pathFileWithPlanInformation: "file:///D:/work/parsing_files/files_1c/planinformation.csv",
  pathFolderWithFilesBastion: "file:///D:/work/parsing_files/files/",
  dbconfig: {
    user: "",
    password: "",
    server: "",
    database: ""
  },
  cronScheduler: "* * * * *"
};