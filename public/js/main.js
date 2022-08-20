const roleElement = document.getElementById("role");
const functionElement = document.getElementById("function");

const roleData = roleElement.getAttribute("data-value");
const functionData = functionElement.getAttribute("data-value");

if (roleData) {
  roleElement.value = roleData;
}
if (functionData) {
  functionElement.value = functionData;
}
