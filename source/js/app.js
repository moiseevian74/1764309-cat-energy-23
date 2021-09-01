const btnToggle = document.querySelector(".page-header__toggle");
const mainNav = document.querySelector(".main-nav");
const btnBack = document.querySelector(".slider__toggle--back");
const btnNext = document.querySelector(".slider__toggle--next");
const sliderMobile = document.querySelector(".slider__mobile");

mainNav.classList.add("main-nav--closed");

btnToggle.addEventListener("click", function (evt) {
  btnToggle.classList.toggle("page-header__toggle--close");
  mainNav.classList.toggle("main-nav--closed");
});

btnNext.addEventListener("click", function (evt) {
  sliderMobile.classList.add("slider__mobile--scale");
});
btnBack.addEventListener("click", function (evt) {
  sliderMobile.classList.remove("slider__mobile--scale");
});
