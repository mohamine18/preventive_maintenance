const changePasswordElement = document.getElementById("changPassword");
const passwordElement = document.getElementById("password");
const confirmPasswordElement = document.getElementById("confirmPassword");

const roleElement = document.getElementById("role");
const functionElement = document.getElementById("function");
const storeElement = document.getElementById("store");

const roleData = roleElement.getAttribute("data-value");
const functionData = functionElement.getAttribute("data-value");
const storeData = storeElement.getAttribute("data-value");

document.addEventListener("change", (e) => {
  e.preventDefault();
  if (changePasswordElement.checked) {
    passwordElement.disabled = false;
    confirmPasswordElement.disabled = false;
  }
  if (!changePasswordElement.checked) {
    passwordElement.disabled = true;
    confirmPasswordElement.disabled = true;
  }
});

if (roleData) {
  roleElement.value = roleData;
}
if (functionData) {
  functionElement.value = functionData;
}
if (storeData) {
  storeElement.value = storeData;
}
