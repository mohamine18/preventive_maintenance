const Store = require("../../models/store");
const Material = require("../../models/material");
const Status = require("../../models/status");

const catchAsync = require("../../util/catchAsync");

exports.getDashboard = catchAsync(async (req, res) => {
  const stores = await Store.find().select("_id name");
  const storeMaterials = await Promise.all(
    stores.map(async (store) => {
      // material number of each material category per store
      const material = await Material.aggregate([
        { $match: { "store.storeId": store._id, active: true, used: true } },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
      ]);
      const selectedMaterials = await Material.find({
        "store.storeId": store._id,
        active: true,
        used: true,
      }).select("lastStatus");

      const selectedStatus = selectedMaterials
        .map((elem) => elem.lastStatus)
        .filter((elem) => elem !== undefined);

      const selectedLastStatus = await Promise.all(
        selectedStatus.map(async (status) => {
          const lastStatus = await Status.findOne({
            _id: status,
            cleanliness: "clean",
            physicalState: "good",
          }).select("cleanliness physicalState");
          return lastStatus;
        })
      );

      const filteredSelectedStatus = selectedLastStatus.filter(
        (elem) => elem !== null
      );

      return {
        store: store.name,
        materials: material,
        cleanlinessFilter: {
          nbrMaterial: selectedStatus.length,
          goodMaterials: filteredSelectedStatus.length,
        },
      };
    })
  );

  // TODO: count how many PC's with status fixed/good on each store for categories (laptop, pc , all in one , server)

  res.send(JSON.stringify(storeMaterials));
});
