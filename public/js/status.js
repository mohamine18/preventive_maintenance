const selectMaterial = document.getElementById("material");
const linkButton = document.getElementById("createStatus");

selectMaterial.addEventListener("change", (e) => {
  e.preventDefault();
  const visitId = linkButton.getAttribute("data-visit-id");
  const materialId = e.target.value;
  linkButton.href = `/status/${visitId}/${materialId}/register`;
  linkButton.className = "btn btn-primary";
});
