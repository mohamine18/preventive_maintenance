const mongoose = require("mongoose");

const { Schema } = mongoose;

const visitSchema = new Schema(
  {
    comment: String,
    state: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    closingDate: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
    duration: { type: String, default: null },
    user: {
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: String,
    },
    store: {
      storeId: {
        type: mongoose.Types.ObjectId,
        ref: "Store",
        required: true,
      },
      storeName: String,
    },
    status: [
      {
        statusId: {
          type: mongoose.Types.ObjectId,
          ref: "Status",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visit", visitSchema);
