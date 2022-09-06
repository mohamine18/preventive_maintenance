const cleanElement = document.getElementById("clean");
const physicalStateElement = document.getElementById("physicalState");
const inverterElement = document.getElementById("inverter");
const antivirusElement = document.getElementById("antivirus");
const antivirusUpdateElement = document.getElementById("antivirusUpdate");
const antivirusLicenseElement = document.getElementById("antivirusLicense");
const diskStatusElement = document.getElementById("diskStatus");
const chkdskElement = document.getElementById("chkdsk");
const fragmentationElement = document.getElementById("fragmentation");
const sfcElement = document.getElementById("sfc");
const networkStateElement = document.getElementById("networkState");
const windowsLicenseElement = document.getElementById("windowsLicense");
const officeLicenseElement = document.getElementById("officeLicense");
const WindowsRestorePointElement = document.getElementById(
  "WindowsRestorePoint"
);
const ProductionSoftwareElement = document.getElementById("ProductionSoftware");
const ShareAndBackupElement = document.getElementById("ShareAndBackup");
const commentElement = document.getElementById("comment");

const cleanData = cleanElement.getAttribute("data-value");
const physicalStateData = physicalStateElement.getAttribute("data-value");
const inverterData = inverterElement.getAttribute("data-value");
const antivirusData = antivirusElement.getAttribute("data-value");
const antivirusUpdateData = antivirusUpdateElement.getAttribute("data-value");
const antivirusLicenseData = antivirusLicenseElement.getAttribute("data-value");
const diskStatusData = diskStatusElement.getAttribute("data-value");
const chkdskData = chkdskElement.getAttribute("data-value");
const fragmentationData = fragmentationElement.getAttribute("data-value");
const sfcData = sfcElement.getAttribute("data-value");
const networkStateData = networkStateElement.getAttribute("data-value");
const windowsLicenseData = windowsLicenseElement.getAttribute("data-value");
const officeLicenseData = officeLicenseElement.getAttribute("data-value");
const WindowsRestorePointData =
  WindowsRestorePointElement.getAttribute("data-value");
const ProductionSoftwareData =
  ProductionSoftwareElement.getAttribute("data-value");
const ShareAndBackupData = ShareAndBackupElement.getAttribute("data-value");
const commentValue = commentElement.getAttribute("data-value");

if (cleanData) {
  cleanElement.value = cleanData;
}

if (physicalStateData) {
  physicalStateElement.value = physicalStateData;
}

if (inverterData) {
  inverterElement.value = inverterData;
}

if (antivirusData) {
  antivirusElement.value = antivirusData;
}

if (antivirusUpdateData) {
  antivirusUpdateElement.value = antivirusUpdateData;
}

if (antivirusLicenseData) {
  antivirusLicenseElement.value = antivirusLicenseData;
}

if (diskStatusData) {
  diskStatusElement.value = diskStatusData;
}

if (chkdskData) {
  chkdskElement.value = chkdskData;
}

if (fragmentationData) {
  fragmentationElement.value = fragmentationData;
}

if (sfcData) {
  sfcElement.value = sfcData;
}

if (networkStateData) {
  networkStateElement.value = networkStateData;
}

if (windowsLicenseData) {
  windowsLicenseElement.value = windowsLicenseData;
}

if (officeLicenseData) {
  officeLicenseElement.value = officeLicenseData;
}

if (WindowsRestorePointData) {
  WindowsRestorePointElement.value = WindowsRestorePointData;
}

if (ProductionSoftwareData) {
  ProductionSoftwareElement.value = ProductionSoftwareData;
}

if (ShareAndBackupData) {
  ShareAndBackupElement.value = ShareAndBackupData;
}

if (commentValue) {
  commentElement.value = commentValue;
}
