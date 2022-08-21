const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");

// const bcrypt = require("bcrypt");
// bcrypt.hash("xxxxxxxx", 12).then((hash) => console.log(hash));

const authRouter = require("./routes/authentication");
const homeRouter = require("./routes/home");
const adminRouter = require("./routes/admin");

const { isLoggedIn } = require("./controllers/authentication");
const { notFound } = require("./controllers/home");

const app = express();

const sessionMongoDB = new mongoDBStore({
  uri: process.env.DATABASE_LOCAL,
  databaseName: "Pmaintenance",
  collection: "sessions",
});

const csrfProtection = csurf();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SECRET_SALT_SESSION,
    resave: false,
    saveUninitialized: false,
    store: sessionMongoDB,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(csrfProtection);

app.use("/auth", authRouter);
app.use(isLoggedIn);
app.use("/", homeRouter);
app.use("/admin", adminRouter);
app.use(notFound);

module.exports = app;
