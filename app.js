const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

const authRouter = require("./routes/authentication");
const homeRouter = require("./routes/home");
const adminRouter = require("./routes/admin");

const app = express();

const sessionMongoDB = new mongoDBStore({
  uri: process.env.DATABASE_LOCAL,
  databaseName: "Pmaintenance",
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SECRET_SALT_SESSION,
    resave: false,
    saveUninitialized: false,
    store: sessionMongoDB,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

module.exports = app;
