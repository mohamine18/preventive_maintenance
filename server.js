require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // change it with debug package in production
});

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successful"); // change it with debug package in production
  });
