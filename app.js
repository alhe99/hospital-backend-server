//Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Init variables
var app = express();

//ENABLE CORS

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, PUT,GET,DELETE, OPTIONS");
  next();
});

//Routes
var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");
var loginRoutes = require("./routes/login");
var hospitalRoutes = require("./routes/hospital");
var doctorRoutes = require("./routes/doctor");
var searchingRoutes = require("./routes/searching");
var uploadRoutes = require("./routes/upload");
var imageRoutes = require("./routes/images");

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Connection
mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  (err, res) => {
    if (err) throw err;

    console.log("Connection With MongoDB Succesfull");
  }
);

//Listen Request
app.listen(3000, () => {
  console.log("Express Server Live Now On Port: 3000");
});

app.use("/", appRoutes);
app.use("/user", userRoutes);
app.use("/login", loginRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/doctor", doctorRoutes);
app.use("/search", searchingRoutes);
app.use("/image", imageRoutes);
