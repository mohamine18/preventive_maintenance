const modalBody = document.querySelector("#modal-body-text");
const closeForm = document.querySelector("#closeForm");
document.addEventListener("click", (e) => {
  if (e.target.id === "closeButton") {
    e.preventDefault();
    const name = e.target.getAttribute("data-visit-name");
    const id = e.target.getAttribute("data-visit-id");
    const url = "/visit/close/";
    modalBody.textContent = name.toUpperCase();
    closeForm.action = `${url}${id}`;
  }
});
