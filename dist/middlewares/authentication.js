var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

exports.verifyToken = function (request, response, next) {
  if (!request.headers.authorization) {
    return response.status(403).send({ message: "Authentication is required" });
  }

  var token = request.headers.authorization.split(" ")[1];
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return response.status(401).json({
        ok: false,
        message: "Invalid Token",
        errors: err
      });
    }
    request.user = decoded.user;
    next();
  });
};