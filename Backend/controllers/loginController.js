const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("../utils/jwt");
require("dotenv").config();
const secret_key = process.env.JWT_KEY;

const getUserData = async (dataObj) => {
  const user = await User.findOne({
    username: dataObj.username,
  });
  if (!user) {
    return { id: null, username: null, loginStatus: false };
  } else {
    const result = await bcrypt.compare(dataObj.password, user.password);
    return {
      id: user._id,
      user: user,
      loginStatus: result,
    };
  }
};
const login = (req, res, next) => {
  if (req.body.username && req.body.password) {
    const dataObj = {
      username: req.body.username,
      password: req.body.password,
    };

    getUserData(dataObj).then((result) => {
      if (result.loginStatus === true) {
        const payload = {
          id: result.id,
          user: result.user,
          loginStatus: true,
        };
        const token = jwt.sign(payload);
        res.json({
          token: token,
          message: "",
          loginStatus: true,
        });
      } else {
        res.json({
          pageName: "Login",
          message: "Usernaem or password incorrect",
          username: result.username,
          loginStatus: false,
        });
      }
    });
  } else {
    res.json({
      loginStatus: false,
      message: "Please enter you username and passowrd.",
    });
  }
};

module.exports.login = login;
