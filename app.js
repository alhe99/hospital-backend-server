//Requires
var express = require("express");
var mongoose = require("mongoose");
//Init variables
var app = express();

//DB Connection
mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  (err, res) => {
    if (err) throw err;

    console.log("Connection With MongoDB Succesfull");
  }
);

//Routes
app.get("/", (request, response, next) => {
  response.status(200).json({
    ok: true,
    message: "OK",
  });
});

//Listen Request
app.listen(3000, () => {
  console.log("Express Server Live Now On Port: 3000");
});
