const visitParams = {
  "store.storeId": "Store",
  "user.userId": "User",
  state: "State",
  createdAt: "Creation Date",
};

const statusesParams = {
  store: "Store",
  "material.materialId": "Material",
  cleanliness: "Cleanliness",
  physicalState: "Physical State",
  inverterAutonomy: "Battery Autonomy",
  antivirusStatus: "Antivirus Status",
  antivirusUpdate: "Antivirus Update",
  antivirusLicense: "Antivirus License",
  diskStatus: "Disk Status",
  chkdsk: "CHKDSK",
  fragmentation: "Fragmentation",
  sfc: "SFC",
  networkState: "Network State",
  windowsLicense: "Windows License",
  officeLicense: "Office License",
  WindowsRestorePoint: "Windows Restore Point",
  ProductionSoftware: "Production Software",
  ShareAndBackup: "Share And Backup",
};

exports.getBadge = (body, type) => {
  const checkedFilters = [];
  Object.keys(body).forEach((elem) => {
    if (type === "visit") {
      checkedFilters.push(visitParams[elem]);
    }
    if (type === "statuses") {
      checkedFilters.push(statusesParams[elem]);
    }
  });
  return checkedFilters;
};
