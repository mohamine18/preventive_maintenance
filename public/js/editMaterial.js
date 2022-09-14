const dateElement = document.getElementById("acquisitionDate");
const categoryElement = document.getElementById("category");
const commentElement = document.getElementById("comment");
const usedElement = document.getElementById("used");

const dateValue = dateElement.getAttribute("data-date");
const categoryValue = categoryElement.getAttribute("data-value");
const commentValue = commentElement.getAttribute("data-value");
const usedValue = usedElement.getAttribute("data-value");

if (dateValue) {
  dateElement.value = new Date(dateValue).toISOString().split("T")[0];
}

if (categoryValue) {
  categoryElement.value = categoryValue;
}

if (commentValue) {
  commentElement.value = commentValue;
}

if (usedValue) {
  usedElement.value = usedValue;
}
