const mongoose = require("mongoose");

const { Schema } = mongoose;

const materialSchema = new Schema(
  {
    category: String,
    name: String,
    inventoryCode: String,
    acquisitionDate: Date,
    comment: String,
    active: {
      type: Boolean,
      default: true,
    },
    used: { type: Boolean, default: true },
    store: {
      storeId: {
        type: mongoose.Types.ObjectId,
        ref: "Store",
        required: true,
      },
      storeName: String,
    },
    lastStatus: {
      type: mongoose.Types.ObjectId,
      ref: "Status",
    },
  },
  { timestamps: true }
);

materialSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

materialSchema.methods.addLastStatus = function (statusId) {
  this.lastStatus = statusId;
  this.save();
};

module.exports = mongoose.model("Material", materialSchema);
