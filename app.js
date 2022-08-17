const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const authRouter = require("./routes/authentication");
const homeRouter = require("./routes/home");
const adminRouter = require("./routes/admin");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

module.exports = app;
