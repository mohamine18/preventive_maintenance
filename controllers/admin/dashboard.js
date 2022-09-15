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
            _id: {
              category: "$category",
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id.category",
            count: "$count",
          },
        },
        {
          $sort: { category: 1 },
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
      const averageCleanliness =
        Math.ceil(
          (filteredSelectedStatus.length / selectedStatus.length) * 100
        ) || 0;

      let progressColor = "";
      if (averageCleanliness <= 100 && averageCleanliness > 70) {
        progressColor = "success";
      } else if (averageCleanliness <= 70 && averageCleanliness > 40) {
        progressColor = "warning";
      } else if (averageCleanliness <= 40 && averageCleanliness >= 0) {
        progressColor = "danger";
      }

      return {
        store: store.name,
        materials: material,
        cleanlinessFilter: {
          nbrMaterial: selectedStatus.length,
          goodMaterials: filteredSelectedStatus.length,
          averageCleanliness,
          progressColor,
        },
      };
    })
  );

  // TODO: count how many PC's with status fixed/good on each store for categories (laptop, pc , all in one , server)

  const storeComputerStatus = await Promise.all(
    stores.map(async (store) => {
      const material = await Material.aggregate([
        // {
        //   $match: {
        //     "store.storeId": store._id,
        //     active: true,
        //     used: true,
        //     category: { $in: ["PC", "Laptop", "Server", "All in one"] },
        //   },
        // },
        {
          $lookup: {
            from: "Status",
            localField: "lastStatus",
            foreignField: "_id",
            pipeline: [
              { $match: { cleanliness: "dirty", physicalState: "bad" } },
            ],
            as: "status",
          },
        },
        // {
        //   $group: {
        //     _id: {
        //       name: "$name",
        //       lastStatus: "$lastStatus",
        //     },
        //   },
        // },
        // {
        //   $project: {
        //     _id: 0,
        //     name: "$_id.name",
        //     lastStatus: "$_id.lastStatus",
        //   },
        // },
      ]);
      // console.log(material);

      return { storeName: store.name, material };
    })
  );

  // console.log(storeComputerStatus);

  // res.render("admin/dashboard/dashboard", {
  //   pageTitle: "Dashboard",
  //   url: "/admin",
  //   data: storeMaterials,
  // });

  res.send(JSON.stringify(storeComputerStatus));
});
