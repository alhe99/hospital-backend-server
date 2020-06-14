var express = require("express");
var bcrypt = require("bcryptjs");
var mdAuth = require("../middlewares/authentication");
var app = express();
var User = require("../models/usuario");

//Routes
//===============================
//GET USERS
//===============================
app.get("/", (request, response, next) => {
  User.find({}, "name email img role").exec((err, users) => {
    if (err) {
      return response.status(500).json({
        ok: false,
        message: "Internal Server Error",
        errors: err
      });
    }

    response.status(200).json({
      ok: true,
      users: users,
      message: "OK"
    });
  });
});

//===============================
//UPDATE USER
//===============================

app.put("/:id", mdAuth.verifyToken, (request, response) => {
  var id = request.params.id;

  User.findById(id, (err, user) => {
    var body = request.body;

    if (err) {
      return response.status(500).json({
        ok: false,
        message: "Error in search user",
        errors: err
      });
    }

    if (!user) {
      return response.status(400).json({
        ok: false,
        message: `User ${id}, not found!`,
        errors: { message: "User not found" }
      });
    }

    user.name = body.name;
    user.email = body.email;
    user.role = body.role;

    user.save((err, userUpdated) => {
      if (err) {
        return response.status(400).json({
          ok: false,
          message: "Error in update user",
          errors: err
        });
      }

      userUpdated.password = ":)";

      response.status(200).json({
        ok: true,
        body: userUpdated,
        message: "OK"
      });
    });
  });
});

//===============================
//CREATE USER
//===============================

app.post("/", mdAuth.verifyToken, (request, response) => {
  var body = request.body;
  var user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  user.save((err, newUser) => {
    if (err) {
      return response.status(400).json({
        ok: false,
        message: "Internal Server Error",
        errors: err
      });
    }

    response.status(201).json({
      ok: true,
      body: newUser,
      message: "OK"
    });
  });
});

//===============================
//DELETE USER
//===============================

app.delete("/:id", mdAuth.verifyToken, (request, response) => {
  var id = request.params.id;

  User.findByIdAndRemove(id, (err, userDeleted) => {
    if (err) {
      return response.status(500).json({
        ok: false,
        message: "Internal Server Error",
        errors: err
      });
    }

    if (!userDeleted) {
      return response.status(400).json({
        ok: false,
        message: "User not found",
        errors: { message: "User not found" }
      });
    }

    response.status(200).json({
      ok: true,
      body: userDeleted,
      message: "OK"
    });
  });
});

module.exports = app;