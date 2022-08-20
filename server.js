const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB connection successful");
  });
