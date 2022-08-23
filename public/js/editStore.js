const provinceElement = document.getElementById("province");
const provinceData = provinceElement.getAttribute("data-value");

if (provinceData) {
  provinceElement.value = provinceData;
}
