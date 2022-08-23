const mongoose = require("mongoose");

const { Schema } = mongoose;

const storeSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    address: String,
    province: {
      code: { type: String },
      name: { type: String },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
