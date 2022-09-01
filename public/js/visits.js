const modalBodyStore = document.querySelector("#modal-body-text-store");
const modalBodyUser = document.querySelector("#modal-body-text-user");
const deleteForm = document.querySelector("#deleteForm");
document.addEventListener("click", (e) => {
  if (e.target.id === "deleteButton") {
    e.preventDefault();
    const store = e.target.getAttribute("data-store-name");
    const name = e.target.getAttribute("data-user-name");
    const id = e.target.getAttribute("data-visit-id");
    const url = "/admin/visit/delete/";
    modalBodyStore.textContent = store.toUpperCase();
    modalBodyUser.textContent = name.toUpperCase();
    deleteForm.action = `${url}${id}`;
  }
});
