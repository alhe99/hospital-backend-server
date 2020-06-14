var express = require("express");
var app = express();

var Hospital = require("../models/hospital");
var mdAuth = require("../middlewares/authentication");

//Routes
//===============================
//GET HOSTPITALS
//===============================
app.get("/", mdAuth.verifyToken, (request, response, next) => {
  var from = Number(request.query.from) || 0;

  Hospital.find({})
    .skip(from)
    .limit(5)
    .populate("user", "name email")
    .exec((err, hospitals) => {
      if (err) {
        return response.status(500).json({
          ok: false,
          message: "Internal Server Error",
          errors: err,
        });
      }

      Hospital.count({}, (err, count) => {
        response.status(200).json({
          ok: true,
          users: hospitals,
          total: count,
          message: "OK",
        });
      });
    });
});

//===============================
//CREATE HOSPITAL
//===============================

app.post("/", mdAuth.verifyToken, (request, response) => {
  var body = request.body;
  var hospital = new Hospital({
    name: body.name,
    img: body.img,
    user: body.user,
  });

  hospital.save((err, newHospital) => {
    if (err) {
      return response.status(400).json({
        ok: false,
        message: "Internal Server Error",
        errors: err,
      });
    }

    response.status(201).json({
      ok: true,
      body: newHospital,
      message: "OK",
    });
  });
});

//===============================
//UPDATE HOSPITAL
//===============================

app.put("/:id", mdAuth.verifyToken, (request, response) => {
  var id = request.params.id;

  Hospital.findById(id, (err, hospital) => {
    var body = request.body;

    if (err) {
      return response.status(500).json({
        ok: false,
        message: "Error in search hospital",
        errors: err,
      });
    }

    if (!hospital) {
      return response.status(400).json({
        ok: false,
        message: `Hospital ${id}, not found!`,
        errors: { message: "Hospital not found" },
      });
    }

    hospital.name = body.name;
    hospital.img = body.img;
    hospital.user = body.user;

    hospital.save((err, hospitalUpdated) => {
      if (err) {
        return response.status(400).json({
          ok: false,
          message: "Error in update hospital",
          errors: err,
        });
      }

      response.status(200).json({
        ok: true,
        body: hospitalUpdated,
        message: "OK",
      });
    });
  });
});

//===============================
//DELETE HOSPITAL
//===============================

app.delete("/:id", mdAuth.verifyToken, (request, response) => {
  var id = request.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {
    if (err) {
      return response.status(500).json({
        ok: false,
        message: "Internal Server Error",
        errors: err,
      });
    }

    if (!hospitalDeleted) {
      return response.status(400).json({
        ok: false,
        message: "Hospital not found",
        errors: { message: "Hospital not found" },
      });
    }

    response.status(200).json({
      ok: true,
      body: hospitalDeleted,
      message: "OK",
    });
  });
});

module.exports = app;
