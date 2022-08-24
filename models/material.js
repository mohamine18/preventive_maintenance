const mongoose = require("mongoose");

const { Schema } = mongoose;

const materialSchema = new Schema(
  {
    category: { type: String, enum: ["PC & Laptop", "Others"] },
    name: String,
    inventoryCode: String,
    acquisitionDate: Date,
    comment: String,
    active: {
      type: Boolean,
      default: true,
    },
    store: {
      storeId: {
        type: mongoose.Types.ObjectId,
        ref: "Store",
        required: true,
      },
      storeName: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
