async function getMaterials(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log("error when fetching materials");
  }
}

document.addEventListener("change", async (e) => {
  e.preventDefault();
  if (e.target.id === "store") {
    const storeId = e.target.value;
    const url = `${JSON.parse(materialUrl)}?storeId=${storeId}`;
    const materials = await getMaterials(url);
    const selectMaterials = document.getElementById("material");
    selectMaterials.innerHTML = "";
    materials.forEach((material) => {
      const option = document.createElement("option");
      option.text = material.name;
      option.value = material._id;
      selectMaterials.add(option);
    });
  }
});
