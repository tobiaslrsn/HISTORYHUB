const { Schema, model } = require("mongoose");

const answerSchema = new Schema({
  answeredOn: {
    type: Date,
    default: () => Date.now(),
  },
  answer: {
    type: String,
    // required: true,
  },
  answeredBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    // required: true,
  },
  answeredOnPost: {
    type: Schema.Types.ObjectId,
    ref: "Posts",
  },
});

const AnswersModel = model("Answers", answerSchema);

module.exports = AnswersModel;
