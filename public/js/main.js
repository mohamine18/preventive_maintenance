const roleElement = document.getElementById("role");
const functionElement = document.getElementById("function");
const storeElement = document.getElementById("store");

const roleData = roleElement.getAttribute("data-value");
const functionData = functionElement.getAttribute("data-value");
const storeData = storeElement.getAttribute("data-value");

if (roleData) {
  roleElement.value = roleData;
}
if (functionData) {
  functionElement.value = functionData;
}
if (storeData) {
  storeElement.value = storeData;
}
