document.addEventListener("DOMContentLoaded", function () {
  const selectedDrink = document.getElementById("selectedDrink");
  const customDrinkSection = document.querySelector(".custom-drink-section");

  customDrinkSection.style.display = "none";

  selectedDrink.addEventListener("change", function () {
    if (selectedDrink.value === "Custom") {
      customDrinkSection.style.display = "block";
    } else {
      customDrinkSection.style.display = "none";
    }
  });

  //A filter function that displays only drinks with the first letter of the first letter of the drink.
  const filterText = document.getElementById("filterText");
  // Filter dropdown when text input changes
  filterText.addEventListener("input", () => {
    const filter = filterText.value.toLowerCase();
    for (let option of selectedDrink.options) {
      if (option.value === "select" || option.value === "Custom") {
        continue;
      }
      if (option.value.toLowerCase().startsWith(filter)) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    }
  });
});
