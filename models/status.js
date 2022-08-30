const mongoose = require("mongoose");

const { Schema } = mongoose;

const statusSchema = new Schema(
  {
    cleanliness: { type: String, enum: ["clean", "average", "dirty"] },
    physicalState: { type: String, enum: ["good", "average", "bad"] },
    inverterAutonomy: { type: String, enum: ["good", "average", "bad"] },
    antivirusStatus: { type: String, enum: ["on", "off", "outdated"] },
    diskStatus: { type: String, enum: ["good", "average", "bad"] },
    osState: { type: String, enum: ["good", "average", "bad"] },
    networkState: { type: String, enum: ["good", "average", "bad"] },
    windowsLicense: { type: String, enum: ["active", "inactive"] },
    officeLicense: { type: String, enum: ["active", "inactive"] },
    comment: String,
    active: {
      type: Boolean,
      default: true,
    },
    material: {
      materialId: {
        type: mongoose.Types.ObjectId,
        ref: "Material",
        required: true,
      },
      materialName: String,
    },
    visit: {
      type: mongoose.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Status", statusSchema);
