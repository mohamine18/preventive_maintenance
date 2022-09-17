const Store = require("../../models/store");
const Material = require("../../models/material");

const catchAsync = require("../../util/catchAsync");
const { percentage, progress } = require("../../util/dashboard");

exports.getDashboard = catchAsync(async (req, res) => {
  const stores = await Store.find().select("_id name").sort("name");
  const storeMaterials = await Promise.all(
    stores.map(async (store) => {
      // material number of each material category per store
      const materialCategory = await Material.aggregate([
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
      // count materials where active:true, used:true, and has lastStatus
      const countMaterialsAllCategories = await Material.aggregate([
        [
          {
            $match: {
              "store.storeId": store._id,
              active: true,
              used: true,
              lastStatus: {
                $exists: true,
              },
            },
          },
          {
            $count: "totalMaterials",
          },
        ],
      ]);
      // count materials where in lastStatus: cleanliness is clean and physicalState is good
      const countGoodStateMaterials = await Material.aggregate([
        [
          {
            $match: {
              "store.storeId": store._id,
              active: true,
              used: true,
              lastStatus: {
                $exists: true,
              },
            },
          },
          {
            $lookup: {
              from: "status",
              localField: "lastStatus",
              foreignField: "_id",
              as: "status",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  {
                    $arrayElemAt: ["$status", 0],
                  },
                  "$$ROOT",
                ],
              },
            },
          },
          {
            $match: {
              cleanliness: "clean",
              physicalState: "good",
            },
          },
          {
            $count: "goodStateMaterials",
          },
        ],
      ]);
      // Number of material of categories ['pc', 'laptop', 'server','all in one'] in each store
      const countMaterialsSelectedCategories = await Material.aggregate([
        {
          $match: {
            "store.storeId": store._id,
            active: true,
            used: true,
            category: {
              $in: ["PC", "Laptop", "Server", "All in one"],
            },
          },
        },
        { $count: "nbrAllPc" },
      ]);
      // number of good materials of categories ['pc', 'laptop', 'server','all in one'] in each store based on lastStatus
      const material = await Material.aggregate([
        {
          $match: {
            "store.storeId": store._id,
            active: true,
            used: true,
            category: {
              $in: ["PC", "Laptop", "Server", "All in one"],
            },
          },
        },
        {
          $lookup: {
            from: "status",
            localField: "lastStatus",
            foreignField: "_id",
            as: "state",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ["$state", 0],
                },
                "$$ROOT",
              ],
            },
          },
        },
        {
          $match: {
            $and: [
              {
                cleanliness: "clean",
              },
              {
                physicalState: "good",
              },
              {
                antivirusStatus: {
                  $in: ["fixed", "good"],
                },
              },
              {
                antivirusUpdate: {
                  $in: ["fixed", "good"],
                },
              },
              {
                antivirusLicense: "active",
              },
              {
                diskStatus: {
                  $in: ["fixed", "good"],
                },
              },
              {
                chkdsk: {
                  $in: ["fixed", "good"],
                },
              },
              {
                fragmentation: {
                  $in: ["fixed", "good"],
                },
              },
              {
                sfc: {
                  $in: ["fixed", "good"],
                },
              },
              {
                networkState: "1Gb",
              },
              {
                windowsLicense: "active",
              },
              {
                officeLicense: "active",
              },
              {
                WindowsRestorePoint: {
                  $in: ["fixed", "good"],
                },
              },
              {
                ProductionSoftware: {
                  $in: ["fixed", "good"],
                },
              },
              {
                ShareAndBackup: {
                  $in: ["fixed", "good"],
                },
              },
            ],
          },
        },
        {
          $count: "nbrGoodPC",
        },
      ]);

      const nbrMaterial =
        countMaterialsAllCategories.length !== 0
          ? Object.values(...countMaterialsAllCategories)[0]
          : 0;

      const goodMaterials =
        countGoodStateMaterials.length !== 0
          ? Object.values(...countGoodStateMaterials)[0]
          : 0;

      const nbrGoodPc =
        material.length !== 0 ? Object.values(...material)[0] : 0;

      const nbrAllPc =
        countMaterialsSelectedCategories.length !== 0
          ? Object.values(...countMaterialsSelectedCategories)[0]
          : 0;

      return {
        store: store.name,
        materials: materialCategory,
        cleanlinessFilter: {
          nbrMaterial: nbrMaterial,
          goodMaterials: goodMaterials,
          averageCleanliness: percentage(goodMaterials, nbrMaterial),
          progressColor: progress(percentage(goodMaterials, nbrMaterial)),
        },
        pcStatus: {
          nbrGoodPc,
          nbrAllPc,
          avgGoodPcStatus: percentage(nbrGoodPc, nbrAllPc),
          progressColor: progress(percentage(nbrGoodPc, nbrAllPc)),
        },
      };
    })
  );

  res.render("admin/dashboard/dashboard", {
    pageTitle: "Dashboard",
    url: "/admin",
    data: storeMaterials,
  });
});
