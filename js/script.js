import "./byeie"; // loučíme se s IE

/*
// snadné načtení souboru pro každého!
fetch("https://blabla.cz/blabla.json")
  .then(response => response.json()) // nebo .text(), když to není json
  .then(data => {
    // tady jde provést s daty cokoliv
  });
*/

$(document).on('click', 'a[href^="#"]', function (event) {
  event.preventDefault();

  $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
  }, 500);
});