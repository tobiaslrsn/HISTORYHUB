const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  name: { type: String },

  imageUrl: {
    type: String,
    /* required: true */
  },

  hashedPassword: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    // unique: true,
  },

  /*   dateOfBirth: {
    type: Date,
    required: true,
  },
 */
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

const UsersModel = model("Users", userSchema);

module.exports = UsersModel;
