const errorhandler = (msg, type) => {
  let alert;
  let dismissible;
  if (type === "danger") {
    alert = "Error!";
    dismissible = false;
  }
  if (type === "success") {
    alert = "Success!";
    dismissible = true;
  }
  return { alert, msg, type, dismissible };
};

module.exports = errorhandler;
