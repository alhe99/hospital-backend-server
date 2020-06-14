var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var validRoles = {
  values: ["ADMIN_ROLE", "USER_ROLE"],
  message: "{VALUE} is a invalid role!"
};

var userSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, unique: true, required: [true, "Email is required"] },
  password: { type: String, required: [true, "Password is required"] },
  img: { type: String },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
    enum: validRoles
  }
});

userSchema.plugin(uniqueValidator, { message: "{PATH} can not be duplicated" });

module.exports = mongoose.model("User", userSchema);