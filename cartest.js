const startButton = document.querySelector(".start-btn");
const beginning = document.querySelector(".beginning");
const container = document.querySelector(".container");

startButton.addEventListener("click", () => {
  beginning.classList.add("hide");
  container.classList.remove("hide");
});
