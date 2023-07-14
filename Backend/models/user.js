const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    required: [true, 'A passowrd is required.'], 
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  phone: {
    type: String,
    require: true,
  },
  birthDate: {
    type: Date,
    require: true,
  },
  address: {
    type: String,
  },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
