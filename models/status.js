const mongoose = require("mongoose");

const { Schema } = mongoose;

const statusSchema = new Schema(
  {
    cleanliness: { type: String, enum: ["clean", "dirty"] },
    physicalState: { type: String, enum: ["good", "bad"] },
    inverterAutonomy: { type: String, enum: ["good", "fixed", "to fix"] },
    antivirusStatus: { type: String, enum: ["good", "fixed", "to fix"] },
    diskStatus: { type: String, enum: ["good", "fixed", "to fix"] },
    osState: { type: String, enum: ["good", "fixed", "to fix"] },
    networkState: { type: String, enum: ["100Mb", "1Gb", "bad"] },
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

statusSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

statusSchema.pre("countDocuments", function (next) {
  this.countDocuments({ active: true });
  next();
});

module.exports = mongoose.model("Status", statusSchema);
