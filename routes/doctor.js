var express = require("express");
var app = express();

var Doctor = require("../models/doctor");
var mdAuth = require("../middlewares/authentication");

//Routes
//===============================
//GET DOCTORS
//===============================
app.get("/", mdAuth.verifyToken, (request, response, next) => {
  var from = Number(request.query.from) || 0;

  Doctor.find({})
    .skip(from)
    .limit(5)
    .populate("user", "name email")
    .populate("hospital")
    .exec((err, doctors) => {
      if (err) {
        return response.status(500).json({
          ok: false,
          message: "Internal Server Error",
          errors: err,
        });
      }

      Doctor.count({}, (err, count) => {
        response.status(200).json({
          ok: true,
          doctors: doctors,
          total: count,
          message: "OK",
        });
      });
    });
});

//===============================
//CREATE DOCTOR
//===============================

app.post("/", mdAuth.verifyToken, (request, response) => {
  var body = request.body;
  var doctor = new Doctor({
    name: body.name,
    img: body.img,
    user: body.user,
    hospital: body.hospital,
  });

  doctor.save((err, newDoctor) => {
    if (err) {
      return response.status(400).json({
        ok: false,
        message: "Internal Server Error",
        errors: err,
      });
    }

    response.status(201).json({
      ok: true,
      body: newDoctor,
      message: "OK",
    });
  });
});

//===============================
//UPDATE HOSPITAL
//===============================

app.put("/:id", mdAuth.verifyToken, (request, response) => {
  var id = request.params.id;

  Doctor.findById(id, (err, doctor) => {
    var body = request.body;

    if (err) {
      return response.status(500).json({
        ok: false,
        message: "Error in search Doctor",
        errors: err,
      });
    }

    if (!doctor) {
      return response.status(400).json({
        ok: false,
        message: `Doctor ${id}, not found!`,
        errors: { message: "Doctor not found" },
      });
    }

    doctor.name = body.name;
    doctor.img = body.img;
    doctor.user = body.user;
    doctor.hospital = body.hospital;

    doctor.save((err, doctorUpdated) => {
      if (err) {
        return response.status(400).json({
          ok: false,
          message: "Error in update Doctor",
          errors: err,
        });
      }

      response.status(200).json({
        ok: true,
        body: doctorUpdated,
        message: "OK",
      });
    });
  });
});

//===============================
//DELETE DOCTOR
//===============================

app.delete("/:id", mdAuth.verifyToken, (request, response) => {
  var id = request.params.id;

  Doctor.findOneAndDelete(id, (err, doctorDeleted) => {
    if (err) {
      return response.status(500).json({
        ok: false,
        message: "Internal Server Error",
        errors: err,
      });
    }

    if (!doctorDeleted) {
      return response.status(400).json({
        ok: false,
        message: "Doctor not found",
        errors: { message: "Doctor not found" },
      });
    }

    response.status(200).json({
      ok: true,
      body: doctorDeleted,
      message: "OK",
    });
  });
});

module.exports = app;
