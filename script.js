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

  /* --- pop-up newslettera ---------------------------------
     Pokazuje się raz: decyzja zapamiętana w localStorage.
     ---------------------------------------------------------- */
  var KLUCZ_POPUP = "kb-newsletter-v1";
  var KLUCZ_COOKIES = "kb-cookies-v1";
  var popup = document.getElementById("popup-newsletter");
  var pasek = document.getElementById("cookies");

  function czytaj(klucz) {
    try { return localStorage.getItem(klucz); } catch (e) { return null; }
  }
  function zapisz(klucz, wartosc) {
    try { localStorage.setItem(klucz, wartosc); } catch (e) {}
  }

  var popupMozliwy = popup && !czytaj(KLUCZ_POPUP);
  var licznik = null;

  function odliczPopup(ms) {
    if (!popupMozliwy) return;
    clearTimeout(licznik);
    licznik = setTimeout(function () {
      popup.hidden = false;
      var pierwsze = popup.querySelector('input[type="email"]');
      if (pierwsze) pierwsze.focus();
    }, ms);
  }

  function zamknijPopup() {
    if (!popup) return;
    clearTimeout(licznik);
    popup.hidden = true;
    zapisz(KLUCZ_POPUP, "zamkniety");
    popupMozliwy = false;
  }

  if (popup) {
    popup.querySelectorAll("[data-popup-zamknij]").forEach(function (b) {
      b.addEventListener("click", zamknijPopup);
    });
    popup.addEventListener("click", function (e) {
      if (e.target === popup) zamknijPopup();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !popup.hidden) zamknijPopup();
    });
    var formPopup = popup.querySelector("[data-popup-form]");
    if (formPopup) {
      formPopup.addEventListener("submit", function () {
        zapisz(KLUCZ_POPUP, "zapisany");
        popupMozliwy = false;
      });
    }
  }

  /* --- zgoda na cookies --- */
  if (pasek) {
    var zgodaZapisana = czytaj(KLUCZ_COOKIES);
    if (!zgodaZapisana) {
      pasek.hidden = false;
    } else {
      odliczPopup(9000);
    }

    var panel = pasek.querySelector(".cookies__panel");
    var przelacznik = pasek.querySelector("[data-cookies-ustawienia]");
    if (przelacznik && panel) {
      przelacznik.addEventListener("click", function () {
        panel.hidden = !panel.hidden;
      });
    }

    pasek.querySelectorAll("[data-cookies]").forEach(function (b) {
      b.addEventListener("click", function () {
        var tryb = b.getAttribute("data-cookies");
        var wybor = { analityka: true, marketing: true, mailing: true };
        if (tryb === "niezbedne") {
          wybor = { analityka: false, marketing: false, mailing: false };
        } else if (tryb === "wybor") {
          pasek.querySelectorAll(".cookies__kategorie input").forEach(function (p) {
            wybor[p.name] = p.checked;
          });
        }
        wybor.data = new Date().toISOString();
        zapisz(KLUCZ_COOKIES, JSON.stringify(wybor));
        pasek.hidden = true;
        odliczPopup(4000);
      });
    });
  } else {
    odliczPopup(9000);
  }

  function pokaz(el, tekst) {
    if (!el) return;
    el.textContent = tekst;
    el.classList.add("widoczny");
  }
})();
