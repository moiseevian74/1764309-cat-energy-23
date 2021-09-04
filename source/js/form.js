const btnToggle = document.querySelector(".page-header__toggle");
const mainNav = document.querySelector(".main-nav");
const form = document.querySelector(".program-form");
const input = document.getElementById("cat-name");

mainNav.classList.add("main-nav--closed");

btnToggle.addEventListener("click", function (evt) {
  btnToggle.classList.toggle("page-header__toggle--close");
  mainNav.classList.toggle("main-nav--closed");
});

form.addEventListener("submit", function (evt) {
  if (!input.value === '') {
    input.classList.toggle("program-form__input--error");
  };
  evt.preventDefault();
});
