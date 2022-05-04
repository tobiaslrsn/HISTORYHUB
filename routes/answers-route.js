const express = require("express");
const { forceAuthorize } = require("../middlewares/auth.js");
const AnswersModel = require("../models/AnswersModel.js");
const PostsModel = require("../models/PostsModel.js");
const UsersModel = require("../models/UsersModel.js");
const router = express.Router();

router.get("/", async (req, res) => {
  const answers = await AnswersModel.find()
    .populate("answeredBy", "answeredOn")
    .lean();
  const users = await UsersModel.find().lean();
  const posts = await PostsModel.find().lean();

  res.render("posts-answer/answer-list", { answers, users, posts });
});

router.get("/post/:id", async (req, res) => {
  const post = await PostsModel.findById(req.params.id).lean();
  const answers = await AnswersModel.find({ answeredOnPost: post._id })
    .populate("answeredBy")
    .lean();

  res.render("posts-questions/posts-single", { post, answers });
});

router.post("/new-answer/:id", async (req, res) => {
  const newAnswer = new AnswersModel({
    answeredOnPost: req.params.id,
    answeredOn: req.body.answeredOn,
    answer: req.body.answer,
    answeredBy: res.locals.userId,
  });

  if (newAnswer.answer.length <= 10 || newAnswer.answer.length >= 500) {
    res.render("posts-questions/posts-single", {
      answerEmpty:
        "Answers need to be more than 10 and less than 500 Characters",
    });
    res.render("posts-questions/posts-single");
  } else {
    await newAnswer.save();
    res.redirect("back");
  }
});

router.get("/new-answer/:id/change", forceAuthorize, async (req, res) => {
  const id = req.params.id;
  const answers = await AnswersModel.findOne({ _id: id });

  res.render("posts-answer/answer-change", answers);
});

router.post("/new-answer/:id/change", forceAuthorize, async (req, res) => {
  const id = req.params.id;
  const originalAnswer = await AnswersModel.findOne({ _id: id });

  const answers = {
    answer: req.body.answer,
  };
  if (id) {
    if (answers) {
      AnswersModel.updateOne({ _id: id }, { $set: answers }, (err, result) => {
        res.redirect("/");
      });
    } else {
      res.render("post-answer/answer-change", {
        error: "Du måste skriva något",
        answer: originalAnswer.answer,
        _id: originalAnswer._id,
      });
    }
  } else {
    res.sendStatus(403);
  }
});

router.get("/answer/:id/delete", forceAuthorize, async (req, res) => {
  const answer = await AnswersModel.findById(req.params.id).lean();

  res.render("posts-answer/answer-delete", { answer });
});

router.post("/answer/:id/delete", forceAuthorize, async (req, res) => {
  await AnswersModel.findByIdAndDelete(req.params.id);

  res.redirect("/");
});

module.exports = router;
