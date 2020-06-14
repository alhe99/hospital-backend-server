var express = require("express");
var app = express();
var fileUpload = require("express-fileupload");
var fs = require("fs");

app.use(fileUpload());

var User = require("../models/user");
var Doctor = require("../models/doctor");
var Hospital = require("../models/hospital");

//Routes
app.post("/:type/:id", (request, response) => {
  var type = request.params.type;
  var id = request.params.id;

  //Collection types
  var collections = ["users", "hospitals", "doctors"];
  if (collections.indexOf(type) < 0) {
    return response.status(400).json({
      ok: false,
      message: "Collection type is invalid",
      errors: { message: "The type of image is invalid" },
    });
  }

  if (!request.files) {
    return response.status(400).json({
      ok: false,
      message: "No file was selected",
      errors: { message: "File is required to upload" },
    });
  }

  //get file name
  var file = request.files.image;
  var shortName = file.name.split(".");
  var extensionFile = shortName[shortName.length - 1];

  //validate extensions
  var extensions = ["png", "jpg", "gif", "jpeg"];

  if (extensions.indexOf(extensionFile) < 0) {
    return response.status(400).json({
      ok: false,
      message: "Extension invalid",
      errors: { message: "The valid extension are: " + extensions.join(", ") },
    });
  }

  //created personlized file name
  var fileName = `${id}-${new Date().getMilliseconds()}.${extensionFile}`;

  //Move dile to tmp file
  var path = `./uploads/${type}/${fileName}`;

  file.mv(path, (err) => {
    if (err) {
      return response.status(400).json({
        ok: false,
        message: "Error in file upload",
        errors: err,
      });
    }
    uploadByType(type, id, fileName, response);
  });
});

function uploadByType(type, id, filename, response) {
  switch (String(type).toUpperCase()) {
    case "USERS":
      User.findById(id, (err, user) => {
        var oldPath = "./uploads/users/" + user.img;

        //Delete old image
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }

        user.img = filename;
        user.save((err, userUpdated) => {
          return response.status(200).json({
            ok: true,
            message: "User image updated succesfull",
            user: userUpdated,
          });
        });
      });
      break;
    case "DOCTORS":
      Doctor.findById(id, (err, doctor) => {
        var oldPath = "./uploads/doctors/" + doctor.img;

        //Delete old image
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }

        doctor.img = filename;
        doctor.save((err, doctorUpdated) => {
          return response.status(200).json({
            ok: true,
            message: "Doctor image updated succesfull",
            user: doctorUpdated,
          });
        });
      });
      break;
    case "HOSPITALS":
      Hospital.findById(id, (err, hospital) => {
        var oldPath =
          "./uploads/hospitals/" + (hospital.img == "" ? null : hospital.img);

        //Delete old image
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }

        hospital.img = filename;
        hospital.save((err, hospitalUpdated) => {
          return response.status(200).json({
            ok: true,
            message: "Hospital image updated succesfull",
            user: hospitalUpdated,
          });
        });
      });
      break;
  }
}

module.exports = app;
