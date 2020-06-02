var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var app = express();
var User = require("../models/usuario");
var SEED = require('../config/config').SEED;

app.post("/", (request, response) => {
  var body = request.body;

  User.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return response.status(500).json({
        ok: false,
        message: "Internal Server Error",
        errors: err,
      });
    }

    if (!user) {
      return response.status(400).json({
        ok: false,
        message: "Invalid Credentials",
        errors: err,
      });
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      return response.status(400).json({
        ok: false,
        message: "Invalid Credentials",
        errors: err,
      });
    }

    //CREATE TOKEN
    user.password = ":)";

    var token = jwt.sign({ user: user }, SEED, {
      expiresIn: 14400,
    });

    response.status(200).json({
      ok: true,
      message: "OK",
      body: user,
      id: user.id,
      token: token,
    });
  });
});

module.exports = app;
