const Store = require("../../models/store");
const Material = require("../../models/material");
const Status = require("../../models/status");

const catchAsync = require("../../util/catchAsync");
const { percentage, progress } = require("../../util/dashboard");

exports.getDashboard = catchAsync(async (req, res) => {
  const stores = await Store.find().select("_id name");
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
      // Number of material of categories ['pc', 'laptop', 'server','all in one'] in each store
      const NbrMaterials = await Material.aggregate([
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
      // number of good materials of categories ['pc', 'laptop', 'server','all in one'] in each store
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
      let nbrGoodPc = 0;
      if (material.length === 0) {
        nbrGoodPc = 0;
      } else {
        nbrGoodPc = Object.values(...material)[0];
      }
      const nbrAllPc = Object.values(...NbrMaterials)[0];
      return {
        store: store.name,
        materials: materialCategory,
        cleanlinessFilter: {
          nbrMaterial: selectedStatus.length,
          goodMaterials: filteredSelectedStatus.length,
          averageCleanliness: percentage(
            filteredSelectedStatus.length,
            selectedStatus.length
          ),
          progressColor: progress(
            percentage(filteredSelectedStatus.length, selectedStatus.length)
          ),
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
