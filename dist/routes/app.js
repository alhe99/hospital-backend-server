var express = require("express");
var app = express();

//Routes
app.get("/", (request, response, next) => {
  response.status(200).json({
    ok: true,
    message: "OK"
  });
});

module.exports = app;