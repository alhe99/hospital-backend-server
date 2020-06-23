var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var app = express();
var User = require("../models/user");
var SEED = require("../config/config").SEED;

var GOOGLE_CLIENT_ID = require("../config/config").GOOGLE_CLIENT_ID;
var GOOGLE_SECRET_KEY = require("../config/config").GOOGLE_SECRET_KEY;

const { OAuth2Client } = require("google-auth-library");
var client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, "");

//======================================
//GOOGLE AUTH
//======================================

app.post("/google", (request, response) => {
  var token = request.body.token || "";
  client
    .verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    })
    .then((data) => {
      var payload = data.getPayload();

      User.findOne({ email: payload.email }, (err, user) => {
        if (err) {
          response.status(500).json({
            ok: false,
            message: "Error in search user",
            errors: err,
          });
        }

        if (user) {
          if (!user.google) {
            response.status(400).json({
              ok: false,
              message: "Please, used the normal auth",
            });
          } else {
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
          }
        } else {
          var newUser = new User();

          newUser.name = payload.name;
          newUser.email = payload.email;
          newUser.password = ":)";
          newUser.img = payload.picture;
          newUser.google = true;

          newUser.save((err, savedUser) => {
            if (err) {
              response.status(500).json({
                ok: false,
                message: "Error in create user",
                errors: err,
              });
            }

            var token = jwt.sign({ user: savedUser }, SEED, {
              expiresIn: 14400,
            });

            response.status(200).json({
              ok: true,
              message: "OK",
              body: savedUser,
              id: savedUser.id,
              token: token,
            });
          });
        }
      });
    })
    .catch((err) => {
      response.status(400).json({
        ok: false,
        message: "Invalid Token",
        errors: err,
      });
    });
});

//======================================
//SIMPLE AUTH
//======================================
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

var mdAuth = require("../middlewares/authentication");

app.post("/token/refresh", mdAuth.verifyToken, (request, response) => {
  var token = jwt.sign({ user: request.user }, SEED, {
    expiresIn: 14400,
  });

  response.status(200).json({
    ok: true,
    token: token,
  });
});
module.exports = app;
