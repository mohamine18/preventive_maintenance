const mongoose = require("mongoose");

const { Schema } = mongoose;

const statusSchema = new Schema(
  {
    cleanliness: { type: String, enum: ["clean", "dirty"] },
    physicalState: { type: String, enum: ["good", "bad"] },
    inverterAutonomy: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    antivirusStatus: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    antivirusUpdate: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    antivirusLicense: {
      type: String,
      enum: ["active", "inactive", "ignored"],
      default: "ignored",
    },
    diskStatus: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    chkdsk: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    fragmentation: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    sfc: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    networkState: {
      type: String,
      enum: ["100Mb", "1Gb", "Bad", "ignored"],
      default: "ignored",
    },
    windowsLicense: {
      type: String,
      enum: ["active", "inactive", "ignored"],
      default: "ignored",
    },
    officeLicense: {
      type: String,
      enum: ["active", "inactive", "ignored"],
      default: "ignored",
    },
    WindowsRestorePoint: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    ProductionSoftware: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
    ShareAndBackup: {
      type: String,
      enum: ["good", "fixed", "to fix", "ignored"],
      default: "ignored",
    },
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
    store: {
      type: mongoose.Types.ObjectId,
      ref: "Store",
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
