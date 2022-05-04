require("dotenv").config();
require("../mongoose.js");

const express = require("express");
const router = express.Router();

const UsersModel = require("../models/UsersModel.js");
const utils = require("../utils.js");

router.get("/register", (req, res) => {
  res.render("users/users-register");
});

router.get("/", (req, res) => {
  res.send("HALLO");
});

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;

  UsersModel.findOne({ username }, async (err, user) => {
    if (user) {
      res.render("users/users-register", {
        userTakenError: "Username is already taken!",
      });
    } else if (password !== confirmPassword) {
      res.render("users/users-register", {
        confirmPassError: "Passwords do not match!",
      });
    } else if (password.length <= 5) {
      res.render("users/users-register", {
        passLengthError: "Passwords need to be longer than 5 characters.",
      });
    } else if (email !== " " && utils.validateEmailAddress(email) === -1) {
      res.render("users/users-register", {
        emailNotValid: "Enter a correct email.",
      });
    } else {
      if (req.files && req.files.image) {
        const image = req.files.image;
        const filename = utils.getUniqueFilename(image.name);
        const uploadPath = __dirname + "/../public/uploads/" + filename;
        await image.mv(uploadPath);

        const newUser = new UsersModel({
          username,
          hashedPassword: utils.hashedPassword(password),
          email,
          imageUrl: "/uploads/" + filename,
        });

        if (utils.validateUsername(newUser.username)) {
          await newUser.save();
          res.redirect("/");
        } else {
          res.render("users/users-register", {
            usernameLengthError: "Username needs to be more than 3 characters.",
          });
        }
      } else {
        res.render("users/users-register", {
          imageReq: "Profile image is required to join.",
        });
      }
    }
  });
});

module.exports = router;
