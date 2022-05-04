const express = require("express");

const router = express.Router();

const UsersModel = require("../models/UsersModel.js");
const PostsModel = require("../models/PostsModel.js");
const jwt = require("jsonwebtoken");

const { forceAuthorize } = require("../middlewares/auth.js");
const { ObjectId } = require("mongodb");

/* let newUser = new UsersModel({
  username: "ey12",
  hashedPassword: "hejhejhej",
  email: "hejhej123@hotmail.com",
});
newUser.save(); */

router.get("/", async (req, res) => {
  const users = await UsersModel.find().lean();

  res.render("home", { users });
});

router.get("/user/dashboard", forceAuthorize, async (req, res) => {
  const user = await UsersModel.findById(res.locals.userId).lean();
  const posts = await PostsModel.find({ askedBy: ObjectId(res.locals.userId) })
    .populate("askedBy")
    .lean();

  const users = await UsersModel.find().lean();

  res.render("users/user-dashboard", { user, posts, users });
});

router.get("/user/:username", forceAuthorize, async (req, res) => {
  const user = await UsersModel.findOne({
    username: req.params.username,
  }).lean();

  const posts = await PostsModel.find({
    askedBy: ObjectId(user._id),
  }).lean();

  res.render("users/user-public", { user, posts });
});

router.get("/user/dashboard/settings", forceAuthorize, async (req, res) => {
  const user = await UsersModel.findById(res.locals.userId).lean();

  res.render("users/user-settings", { user });
});

router.get("/user/dashboard/change", forceAuthorize, async (req, res) => {
  const user = await UsersModel.findById(res.locals.userId).lean();

  res.render("users/user-change", { user });
});

router.post("/user/dashboard/change", forceAuthorize, async (req, res) => {
  const user = await UsersModel.findByIdAndUpdate(res.locals.userId);

  user.username = req.body.username;
  user.email = req.body.email;
  await user.save();

  const userData = { userId: res.locals.userId, username: user.username };
  const accessToken = jwt.sign(userData, process.env.JWTSECRET);

  res.cookie("token", accessToken);
  res.redirect("/user/" + user.username);
});

router.get("/user/dashboard/delete", forceAuthorize, async (req, res) => {
  const user = await UsersModel.findById(res.locals.userId).lean();

  res.render("users/users-delete", { user });
});

router.post("/user/dashboard/delete", forceAuthorize, async (req, res) => {
  await UsersModel.findByIdAndDelete(res.locals.userId);
  await PostsModel.deleteMany({ askedBy: res.locals.userId });

  res.cookie("token", "", { maxAge: 0 });

  res.redirect("/");
});

module.exports = router;
