var express = require("express");
var app = express();

var Hospital = require("../models/hospital");
var Doctor = require("../models/doctor");
var User = require("../models/user");

//Routes
app.get("/every/:query", (request, response, next) => {
  var query = request.params.query;
  var regex = new RegExp(query, "i");

  Promise.all([
    searchHospitals(regex),
    searchDoctors(regex),
    searchUsers(regex),
  ]).then((data) => {
    response.status(200).json({
      ok: true,
      hospitals: data[0],
      doctors: data[1],
      users: data[2],
      message: "OK",
    });
  });
});

app.get("/collection/:table/:query", (request, response) => {
  var table = request.params.table;
  var query = request.params.query;
  var regex = new RegExp(query, "i");

  var promise;

  switch (table.toUpperCase()) {
    case "DOCTORS":
      promise = searchDoctors(regex);
      break;

    case "USERS":
      promise = searchUsers(regex);
      break;

    case "HOSPITALS":
      promise = searchHospitals(regex);
      break;
    default:
      response.status(400).json({
        ok: false,
        message: "The table in query does not exits :(",
      });
      break;
  }

  promise.then((data) => {
    response.status(200).json({
      ok: true,
      [table]: data,
      message: "OK",
    });
  });
});

function searchHospitals(regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ name: regex })
      .populate("user", "name email")
      .exec((err, hospitals) => {
        if (err) {
          reject("Error in loading Hospitals", err);
        } else {
          resolve(hospitals);
        }
      });
  });
}

function searchDoctors(regex) {
  return new Promise((resolve, reject) => {
    Doctor.find({ name: regex })
      .populate("user", "name, email")
      .populate("hospital", "name")
      .exec((err, doctors) => {
        if (err) {
          reject("Error in loading Doctors", err);
        } else {
          resolve(doctors);
        }
      });
  });
}
function searchUsers(regex) {
  return new Promise((resolve, reject) => {
    User.find({}, "name email")
      .or([{ name: regex }, { email: regex }])
      .exec((err, users) => {
        if (err) {
          reject("Error in loading Users", err);
        } else {
          resolve(users);
        }
      });
  });
}

module.exports = app;
