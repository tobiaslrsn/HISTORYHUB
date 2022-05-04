const mongoose = require("mongoose");

let DATABASE = process.env.MONGOOSE_CONNECTION_STRING;
mongoose.connect(DATABASE, {}).then(() => {
  console.log("\x1b[36m%s\x1b[0m", "Server is working.");
});
