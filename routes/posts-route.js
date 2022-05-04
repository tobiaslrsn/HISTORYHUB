const express = require("express");
const { forceAuthorize } = require("../middlewares/auth.js");

const PostsModel = require("../models/PostsModel.js");
const UsersModel = require("../models/UsersModel.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await PostsModel.find().populate("askedBy").lean();
  const users = await UsersModel.find().lean();

  res.render("home", { posts, users });
});

router.get("/posts", async (req, res) => {
  const posts = await PostsModel.find().populate("askedBy").lean();
  const users = await UsersModel.find().lean();

  res.render("posts-questions/posts-list", { posts, users });
});

router.post("/new-post", async (req, res) => {
  const newPost = new PostsModel({
    postDate: req.body.postDate,
    title: req.body.title,
    question: req.body.question,
    askedBy: res.locals.userId,
    answeredBy: res.locals.userId,
    answeredOn: req.body.answeredOn,
  });

  if (newPost.question.length <= 10 || newPost.question.length >= 140) {
    res.render("users/user-dashboard", {
      questionError: "Question need to be more than 10 and less than 140", // FIXA sÅ DEN RENDERAR ALLT ORDENTLIGT
    });
  } else if (newPost.title.length <= 5 || newPost.title.length >= 25) {
    res.render("users/user-dashboard", {
      titleError: "title need to be more than 5 and less than 25", // FIXA sÅ DEN RENDERAR ALLT ORDENTLIGT
    });
    res.render("users/user-dashboard");
  } else {
    await newPost.save();

    res.redirect("/user/dashboard");
  }
});

router.get("/post/:id/edit", forceAuthorize, async (req, res) => {
  const posts = await PostsModel.findById(req.params.id).lean();

  res.render("posts-questions/posts-change", posts);
});

router.post("/post/:id/edit", forceAuthorize, async (req, res) => {
  const post = await PostsModel.findByIdAndUpdate(req.params.id);

  post.title = req.body.title;
  post.question = req.body.question;
  await post.save();

  res.redirect("/post/" + req.params.id);
});

router.post("/post/:id/delete", async (req, res) => {
  await PostsModel.findByIdAndDelete(req.params.id).lean();

  res.redirect("/");
});

module.exports = router;
