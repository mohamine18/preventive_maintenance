const modalBody = document.querySelector("#modal-body-text");
const deleteForm = document.querySelector("#deleteForm");
document.addEventListener("click", (e) => {
  if (e.target.id === "deleteButton") {
    e.preventDefault();
    const name = e.target.getAttribute("data-store-name");
    const id = e.target.getAttribute("data-store-id");
    const url = "/admin/store/delete/";
    modalBody.textContent = name.toUpperCase();
    deleteForm.action = `${url}${id}`;
  }
});
