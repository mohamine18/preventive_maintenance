const cleanElement = document.getElementById("clean");
const physicalStateElement = document.getElementById("physicalState");
const inverterElement = document.getElementById("inverter");
const antivirusElement = document.getElementById("antivirus");
const diskStatusElement = document.getElementById("diskStatus");
const osStateElement = document.getElementById("osState");
const networkStateElement = document.getElementById("networkState");
const windowsLicenseElement = document.getElementById("windowsLicense");
const officeLicenseElement = document.getElementById("officeLicense");
const commentElement = document.getElementById("comment");

const cleanData = cleanElement.getAttribute("data-value");
const physicalStateData = physicalStateElement.getAttribute("data-value");
const inverterData = inverterElement.getAttribute("data-value");
const antivirusData = antivirusElement.getAttribute("data-value");
const diskStatusData = diskStatusElement.getAttribute("data-value");
const osStateData = osStateElement.getAttribute("data-value");
const networkStateData = networkStateElement.getAttribute("data-value");
const windowsLicenseData = windowsLicenseElement.getAttribute("data-value");
const officeLicenseData = officeLicenseElement.getAttribute("data-value");
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

if (diskStatusData) {
  diskStatusElement.value = diskStatusData;
}

if (osStateData) {
  osStateElement.value = osStateData;
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

if (commentValue) {
  commentElement.value = commentValue;
}
