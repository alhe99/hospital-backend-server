var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

exports.verifyToken = function (request, response, next) {
  var token = request.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return response.status(401).json({
        ok: false,
        message: "Invalid Token",
        errors: err,
      });
    }
    request.user = decoded.user;
    next();
  });
};
