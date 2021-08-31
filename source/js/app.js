const btnToggle = document.querySelector(".page-header__toggle");
const mainNav = document.querySelector(".main-nav");

mainNav.classList.add("main-nav--closed");

btnToggle.addEventListener("click", function (evt) {
  btnToggle.classList.toggle("page-header__toggle--close");
  mainNav.classList.toggle("main-nav--closed");
});
