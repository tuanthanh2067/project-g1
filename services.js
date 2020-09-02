const blocks = document.querySelectorAll(".block");

blocks.forEach((block, index) => {
  block.addEventListener("click", () => {
    if (index === 0) {
      window.location.href = "./cartest.html";
    }
  });
});
