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
    materials: [
      {
        materialId: {
          type: mongoose.Types.ObjectId,
          ref: "material",
          required: true,
        },
        materialName: { type: String },
      },
    ],
  },
  { timestamps: true }
);

storeSchema.methods.addMaterial = function (material) {
  const { _id, name } = material;
  this.materials.push({
    materialId: _id,
    materialName: name,
  });
  return this.save();
};
storeSchema.methods.removeMaterial = function (materialId) {
  // if the status of material set to inactive delete the material from the array of materials
};

module.exports = mongoose.model("Store", storeSchema);
