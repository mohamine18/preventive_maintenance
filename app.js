const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const authRouter = require("./routes/authentication");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/authentication", authRouter);

module.exports = app;
