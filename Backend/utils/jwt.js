const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret_key = process.env.JWT_KEY;

module.exports = {
  sign: (payload) => {
    return jwt.sign(payload, secret_key);
  },
  verify: (req, res, next) => {
    var token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    if (!token)
      return res
        .status(403)
        .json({ auth: false, message: "No token provided." });

    jwt.verify(token, secret_key, function (err, decoded) {
      if (err) {
        if (err.name == "TokenExpiredError") {
          return res
            .status(401)
            .json({ auth: false, message: "token expired" });
        } else {
          return res.status(500).json({ auth: false, message: err });
        }
      }
      req.username = decoded.username;
      req.level = decoded.level;
      next();
    });
  },
};
