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

storeSchema.methods.editMaterial = function (material) {
  const existingArray = this.materials;
  const { _id, name } = material;
  const newArray = existingArray.filter(
    (elem) => elem.materialId.toString() !== _id.toString()
  );
  newArray.push({
    materialId: _id,
    materialName: name,
  });
  this.materials = newArray;
  return this.save();
};

storeSchema.methods.removeMaterial = function (materialId) {
  const existingArray = this.materials;
  const newArray = existingArray.filter(
    (elem) => elem.materialId.toString() !== materialId.toString()
  );
  this.materials = newArray;
  return this.save();
};

module.exports = mongoose.model("Store", storeSchema);
