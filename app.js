const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");

// const bcrypt = require("bcrypt");
// bcrypt.hash("xxxxxxxx", 12).then((hash) => console.log(hash));

const authRouter = require("./routes/authentication");
const homeRouter = require("./routes/main");
const adminRouter = require("./routes/admin");
const visitRouter = require("./routes/visit");
const statusRouter = require("./routes/status");
const apiRouter = require("./routes/api");

const { isLoggedIn } = require("./controllers/authentication");
const { hasPermission } = require("./controllers/authorization");
const { pageNotFound, globalErrorhandler } = require("./controllers/error");

const app = express();

const sessionMongoDB = new MongoDBStore({
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
app.use(flash());

app.use("/api/v1", apiRouter);
app.use("/auth", authRouter);
app.use(isLoggedIn);
app.use(hasPermission);
app.use("/", homeRouter);
app.use("/visit", visitRouter);
app.use("/status", statusRouter);
app.use("/admin", adminRouter);
app.use("*", pageNotFound);
app.use(globalErrorhandler);

module.exports = app;
