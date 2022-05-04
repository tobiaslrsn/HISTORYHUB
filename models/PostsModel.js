const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  postDate: {
    /*  type: Date,
    default: () => Date.now(), */
    type: Number,
    default: Date.now(),
  },
  title: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    // required: true,
  },
  askedBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    // required: true,
  },
});

const PostsModel = model("Posts", postSchema);

module.exports = PostsModel;
