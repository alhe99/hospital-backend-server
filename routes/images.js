var express = require("express");
var app = express();
var fs = require("fs");
var mdAuth = require("../middlewares/authentication");

//Routes
app.get("/:type/:img", (request, response, next) => {
  var type = request.params.type;
  var img = request.params.img;

  var folder = `./uploads/${type}/${img}`;
  var path;

  fs.exists(folder, (exist) => {
    if (!exist) path = "/assets/noimage.jpg";
    else path = `/uploads/${type}/${img}`;

    response.sendFile(`${process.cwd()}${path}`);
  });
});

module.exports = app;
