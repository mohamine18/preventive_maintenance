const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    func: {
      type: String,
      enum: ["technician", "engineer", "collaborator"],
    },
    password: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

module.exports = mongoose.model("User", userSchema);
