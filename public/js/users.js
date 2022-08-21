const buttons = document.querySelectorAll("#deleteButton");
const modalBody = document.querySelector("#modal-body-text");
const deleteForm = document.querySelector("#deleteForm");
document.addEventListener("click", (e) => {
  if (e.target.id === "deleteButton") {
    e.preventDefault();
    const name = e.target.getAttribute("data-user-name");
    const id = e.target.getAttribute("data-user-id");
    const url = "/admin/user/delete/";
    modalBody.textContent = name.toUpperCase();
    deleteForm.action = `${url}${id}`;
  }
});
