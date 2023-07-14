const User = require("../models/user");
const formidable = require("formidable");
const moment = require("moment");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const salt = Number(process.env.SALT_KEY);

const usersCreaet = async (req, res, next) => {
  const userMockUp = {
    username: "admin",
    password: "1234",
  };
  try {
    const hash = await bcrypt.hash(userMockUp.password, salt);
    const checkUser = await User.findOne({ username: userMockUp.username });
    if (checkUser) {
      res.json({
        status: true,
        message: "Success",
        data: userMockUp,
      });
      return;
    }
    const user = User({
      username: userMockUp.username,
      password: hash,
      name: "Cynthia Jenkins",
      email: "zofi@okwuhif.zm",
      phone: "1234567890",
      birthDate: moment("1909-09-09").local().format("YYYY-MM-DD"),
      address: "522 Gubwi Manor",
    });
    const data = await user.save();
    res.json({
      status: true,
      message: "Success",
      data: userMockUp,
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Can't create user",
    });
  }
};
module.exports.usersCreaet = usersCreaet;

const usersAll = async (req, res, next) => {
  try {
    const user = await User.find().select({ password: 0, username: 0 });
    res.json({
      status: true,
      message: "Success",
      data: user,
      loginStatus: true,
    });
  } catch (error) {
    res.json({
      status: false,
      message: "find not found",
    });
  }
};
module.exports.usersAll = usersAll;

const getUser = async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      const user = await User.findOne({ _id: id }).select({
        password: 0,
        username: 0,
      });
      if (user) {
        res.json({
          status: true,
          message: "Success",
          data: user,
          loginStatus: true,
        });
      } else {
        res.json({
          status: false,
          message: "find not found",
          data: user,
        });
      }
    } catch (error) {
      res.json({
        status: false,
        message: "find not found",
      });
    }
  } else {
    res.json({
      status: false,
      message: "require id",
    });
  }
};
module.exports.getUser = getUser;

const updateUser = async (dataObj) => {
  if (dataObj.id) {
    const user = await User.findOneAndUpdate(
      { _id: dataObj.id },
      {
        $set: {
          name: dataObj.name,
          email: dataObj.email,
          phone: dataObj.phone,
          birthDate: dataObj.birthDate,
          address: dataObj.address,
        },
      },
      { new: true }
    );
    return {
      status: true,
      data: user,
    };
  } else {
    return {
      status: false,
      message: "require data",
    };
  }
};

const editUser = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (error, fields, files) => {
    const id = fields.id ? fields.id[0] : "";
    const name = fields.name ? fields.name[0] : "";
    const email = fields.email ? fields.email[0] : "";
    const phone = fields.phone ? fields.phone[0] : "";
    const birthDate = fields.birthDate ? fields.birthDate[0] : "";
    const address = fields.address ? fields.address[0] : "";
    if (name && email && phone && birthDate) {
      const userObj = {
        id: id,
        name: name,
        email: email,
        phone: phone,
        birthDate: moment(req.body.birthDate).local().format("YYYY-MM-DD"),
        address: address,
      };
      updateUser(userObj)
        .then((result) => {
          if (result.status) {
            const success = `Update ${userObj.name} Success`;
            res.json({
              status: true,
              message: success,
            });
          } else {
            res.json({
              status: false,
              message: result.message,
            });
          }
        })
        .catch((err) => {
          res.json({
            status: false,
            message: err,
          });
        });
    } else {
      res.status(400).json({
        status: false,
        message: `require ${username ? "" : "username"} ${
          password ? "" : ",password"
        } ${name ? "" : ",name"} ${email ? "" : ",email"} ${
          phone ? "" : ",phone"
        } ${birthDate ? "" : ",birthDate"}`,
      });
    }
  });
};
module.exports.editUser = editUser;

// async function deleteStudentByStudentID(studentID) {
//   const result = await Student.deleteOne({ id: studentID });
//   console.log('result',result);
// }

const deleteUser = async (req, res) => {
  const id = req.params.id;
  if (id) {
    try {
      const user = await User.findOne({ _id: id });
      if (user) {
        const result = await User.deleteOne({ _id: id });
        res.json({
          status: true,
          message: "Success",
          data: result,
        });
      } else {
        res.json({
          status: false,
          message: "Data cannot be deleted.",
        });
      }
    } catch (error) {
      res.json({
        status: false,
        message: "Data cannot be deleted.",
      });
    }
  } else {
    res.json({
      status: false,
      message: "require id",
    });
  }
};

module.exports.deleteUser = deleteUser;
