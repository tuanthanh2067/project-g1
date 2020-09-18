const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");
const navLinks = document.querySelectorAll(".nav-links li");
const exploreBtn = document.querySelector(".explore");

const navAnimation = () => {
  burger.addEventListener("click", () => {
    nav.classList.toggle("active");

    navLinks.forEach((one, index) => {
      if (one.style.animation) {
        one.style.animation = "";
      } else {
        one.style.animation = `navLink 0.25s ease forwards ${
          index / 7 + 0.35
        }s`;
      }
    });

    burger.classList.toggle("onClicked");
  });
};

const app = () => {
  navAnimation();
};

app();
