/* ---------------------------------------------------------
   Krzysztof — obsługa nawigacji, animacji i formularza
   --------------------------------------------------------- */

(function () {
  "use strict";

  /* --- menu mobilne --- */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var otwarte = menu.classList.toggle("otwarte");
      burger.setAttribute("aria-expanded", otwarte ? "true" : "false");
      burger.textContent = otwarte ? "Zamknij" : "Menu";
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && window.innerWidth <= 880) {
        menu.classList.remove("otwarte");
        burger.setAttribute("aria-expanded", "false");
        burger.textContent = "Menu";
      }
    });
  }

  /* --- cienka linia pod paskiem po przewinięciu --- */
  var gora = document.querySelector(".gora");
  if (gora) {
    var przewin = function () {
      gora.classList.toggle("przypieta", window.scrollY > 8);
    };
    przewin();
    window.addEventListener("scroll", przewin, { passive: true });
  }

  /* --- delikatne pojawianie się sekcji --- */
  var mniejRuchu = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var elementy = document.querySelectorAll(".zjawia");
  if (!mniejRuchu && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (wpisy) {
        wpisy.forEach(function (w) {
          if (w.isIntersecting) {
            w.target.classList.add("widac");
            obs.unobserve(w.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    elementy.forEach(function (el) { obs.observe(el); });
  } else {
    elementy.forEach(function (el) { el.classList.add("widac"); });
  }

  /* --- formularz newslettera ---------------------------------
     Wersja demonstracyjna: nie wysyła danych nigdzie.
     Podłączenie prawdziwego dostawcy — patrz README.md
     ---------------------------------------------------------- */
  document.querySelectorAll("form[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]');
      var zgoda = form.querySelector('input[type="checkbox"]');
      var komunikat = form.querySelector(".komunikat");

      if (!email.value || !email.checkValidity()) {
        pokaz(komunikat, "Sprawdź adres e-mail — coś się w nim nie zgadza.");
        email.focus();
        return;
      }
      if (zgoda && !zgoda.checked) {
        pokaz(komunikat, "Potrzebuję jeszcze Twojej zgody na wysyłkę listu.");
        zgoda.focus();
        return;
      }

      pokaz(
        komunikat,
        "Dziękuję. Na " + email.value + " poszła prośba o potwierdzenie — kliknij link w wiadomości i jesteśmy umówieni."
      );
      form.querySelectorAll("input, button").forEach(function (p) { p.disabled = true; });
    });
  });

  function pokaz(el, tekst) {
    if (!el) return;
    el.textContent = tekst;
    el.classList.add("widoczny");
  }
})();
