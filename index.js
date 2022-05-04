// TOBIAS LARSSON, SIMON HALVORSEN & FELIX CANBERGER

require("dotenv").config();
require("./mongoose.js");

const express = require("express");
const exphbs = require("express-handlebars");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const registerRoute = require("./routes/register-route.js");
const loginRoute = require("./routes/login-route.js");
const postsRoute = require("./routes/posts-route.js");
const answersRoute = require("./routes/answers-route.js");
const userRoute = require("./routes/users-route.js");
const data = require("./data.js");
const fileUpload = require("express-fileupload");

const PostsModel = require("./models/PostsModel.js");
const UsersModel = require("./models/UsersModel.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      formatDate: (postDate) => {
        const date = new Date(postDate);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
      },
    },
  })
);

app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(cookieParser());

// IF LOGGED IN
app.use(async (req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.userId = tokenData.userId;
    res.locals.username = tokenData.username;

    const user = await UsersModel.findById(tokenData.userId);
    res.locals.imageUrl = user.imageUrl; // Denna strular till och från.
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

app.use("/users", registerRoute);
app.use("/", postsRoute);
app.use("/", loginRoute);
app.use("/", answersRoute);
app.use("/", userRoute);

app.get("/", async (req, res) => {
  const post = await PostsModel.find()
    .sort([["postDate", "desc"]])
    .lean();

  res.render("home", { post });
});

app.use("/", (req, res) => {
  res.status(404).render("errors/something-went-wrong");
});

let PORT = process.env.PORT_NR || 8080;

app.listen(PORT, () => {
  console.log(
    "\x1b[33m%s\x1b[0m",
    ` /// RUNNING ON: http://localhost:${PORT}/`
  );
});
