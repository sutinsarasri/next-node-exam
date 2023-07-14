const bcrypt = require("bcryptjs");
const User = require("../models/user");
const formidable = require("formidable");
const moment = require("moment");
require("dotenv").config();
const salt = Number(process.env.SALT_KEY);

const createUser = async (userObj) => {
  const hash = await bcrypt.hash(userObj.password, salt);
  const user = new User({
    username: userObj.username,
    password: hash,
    name: userObj.name,
    email: userObj.email,
    phone: userObj.phone,
    birthDate: userObj.birthDate,
    address: userObj.address,
  });
  const data = await user.save();
  return data;
};

const postRegister = (req, res, next) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
      const username = fields.username ? fields.username[0] : "";
      const password = fields.password ? fields.password[0] : "";
      const name = fields.name ? fields.name[0] : "";
      const email = fields.email ? fields.email[0] : "";
      const phone = fields.phone ? fields.phone[0] : "";
      const birthDate = fields.birthDate ? fields.birthDate[0] : "";
      const address = fields.address ? fields.address[0] : "";
      if (name && email && phone && birthDate) {
        if (moment(birthDate).isValid()) {
          if (moment().year() - moment(birthDate).year() > 20) {
            const userObj = {
              username: username ? username : email,
              password: password ? password : phone,
              name: name,
              email: email,
              phone: phone,
              birthDate: birthDate,
              address: address,
            };
            createUser(userObj)
              .then(() => {
                const success = `Register ${userObj.username} Success`;
                res.json({
                  status: true,
                  message: success,
                });
              })
              .catch((err) => {
                res.json({
                  status: false,
                  message: err,
                });
              });
          } else {
            res.json({
              status: false,
              message: "Age must be over 20 years old",
            });
          }
        } else {
          res.json({
            status: false,
            message: "Invalid date format",
          });
        }
      } else {
        res.json({
          status: false,
          message: `require ${username ? "" : "username"} ${
            password ? "" : ",password"
          } ${name ? "" : ",name"} ${email ? "" : ",email"} ${
            phone ? "" : ",phone"
          } ${birthDate ? "" : ",birthDate"}`,
        });
      }
    });
  } catch (error) {
    res.json({ result: constants.kResultNok, message: JSON.stringify(error) });
  }
};

module.exports.postRegister = postRegister;
