const { User } = require("../models/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "SECRET_KEY";
exports.createUser = async (req, res) => {
  //todo: password hash
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (!checkUser) {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          const user = await User.create({
            ...req.body,
            password: hashedPassword,
            salt,
          });
          req.login(sanitizeUser(user), (err) => {
            if (err) {
              res.status(400).json(err);
            } else {
              const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
              res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201).json(sanitizeUser(user));
            }
          });
        }
      );
    } else {
      res.status(401).json({
        message: "user already exist",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

exports.checkAuth = async (req, res) => {
   if(req.user){
    res.json(req.user);
   }
   else{
    res.sendStatus(401);
   }
};

exports.loginUser = async (req, res) => {
  //before serialised data
  res.cookie("jwt", req.user.token, {
    expires: new Date(Date.now() + 3600000),
    httpOnly: true,
  }).
  status(201).json(req.user.token);
};
