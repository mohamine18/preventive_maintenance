exports.percentage = (val1, val2) => {
  const percentage = Math.ceil((val1 / val2) * 100) || 0;
  return percentage;
};

exports.progress = (val) => {
  let progressColor;
  if (val <= 100 && val > 70) {
    progressColor = "success";
  } else if (val <= 70 && val > 40) {
    progressColor = "warning";
  } else if (val <= 40 && val >= 0) {
    progressColor = "danger";
  }
  return progressColor;
};
