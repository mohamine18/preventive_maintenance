const selectMaterial = document.getElementById("material");
const linkButton = document.getElementById("createStatus");

selectMaterial.addEventListener("change", (e) => {
  e.preventDefault();
  const visitId = linkButton.getAttribute("data-visit-id");
  const materialId = e.target.value;
  linkButton.href = `/status/${visitId}/${materialId}/register`;
  linkButton.className = "btn btn-primary";
});

const modalBody = document.querySelector("#modal-body-text");
const closeForm = document.querySelector("#closeForm");
const closeButton = document.getElementById("closeButton");

closeButton.addEventListener("click", (e) => {
  e.preventDefault();
  const name = closeButton.getAttribute("data-visit-name");
  const id = closeButton.getAttribute("data-visit-id");
  const url = "/visit/close/";
  modalBody.textContent = name.toUpperCase();
  closeForm.action = `${url}${id}`;
});
