# Strona Krzysztofa — psychoterapia, warsztaty, teksty

Statyczna strona (HTML + CSS + odrobina JavaScriptu). Bez frameworków, bez budowania,
bez bazy danych. Wystarczy wrzucić folder na hosting.

---

## Pliki

| Plik | Co to jest |
|---|---|
| `index.html` | Strona główna: hero, o mnie w skrócie, pytanie, trzy ścieżki, newsletter, ostatnie wpisy, kontakt |
| `o-mnie.html` | Pełna historia + kwalifikacje i standardy pracy |
| `blog.html` | Lista wszystkich wpisów |
| `wpis-przyklad.html` | Szablon pojedynczego wpisu (treść w środku jest przykładowa) |
| `newsletter.html` | Landing newslettera: co jest w środku, zapis, archiwum |
| `prywatnosc.html` | Szkielet polityki prywatności do uzupełnienia |
| `style.css` | Cały wygląd — kolory i typografia w jednym miejscu, na górze pliku |
| `script.js` | Menu mobilne, pojawianie się sekcji, obsługa formularza |
| `favicon.svg` | Monogram „K” |
| `img/` | Zdjęcia (oryginał oczyszczony z zabudowań + cztery kadry) |

---

## Do uzupełnienia przed publikacją

Przeszukaj pliki i podmień:

- `[Nazwisko]` — nazwisko (występuje w stopkach i w polityce prywatności)
- `kontakt@przyklad.pl` — prawdziwy adres e-mail
- `+48 000 000 000` — prawdziwy telefon
- link do Instagrama w stopce (`href="#"`)
- `img/krzysztof-szeroki.jpg` w `og:image` — po wgraniu na serwer zamień na pełny adres,
  np. `https://twojadomena.pl/img/krzysztof-szeroki.jpg` (inaczej podgląd nie zadziała
  przy udostępnianiu na Facebooku i LinkedInie)
- treść wpisów na blogu — teraz są zaślepki

---

## Podłączenie newslettera

Formularze mają atrybut `data-newsletter` i **nie wysyłają nigdzie danych** — pokazują tylko
komunikat. Żeby zapis działał naprawdę, wybierz dostawcę i podmień formularz.

Polecane, bo obsługują podwójne potwierdzenie (double opt-in) wymagane w Polsce:

- **MailerLite** — darmowy do 1000 subskrybentów, polskie faktury, prosty edytor
- **Buttondown** — bardzo prosty, dla piszących listy tekstem
- **beehiiv / ConvertKit** — więcej możliwości, drożej

### Jak to zrobić (na przykładzie MailerLite)

1. Załóż konto, stwórz grupę odbiorców i włącz double opt-in.
2. W panelu wejdź w *Forms → Embedded form* i skopiuj adres z pola `action`
   (wygląda jak `https://assets.mailerlite.com/jsonp/XXXX/forms/YYYY/subscribe`).
3. W plikach HTML znajdź `<form class="formularz" data-newsletter novalidate>` i zmień na:

```html
<form class="formularz" method="post"
      action="TU_WKLEJ_ADRES_Z_MAILERLITE">
```

4. Usuń atrybut `data-newsletter` (dzięki temu `script.js` przestanie przechwytywać wysyłkę).
5. Upewnij się, że pola mają nazwy, których oczekuje dostawca — w MailerLite zwykle
   `fields[email]` i `fields[name]`. Zmień `name="email"` i `name="imie"` odpowiednio.
6. Wyślij testowy zapis na własny adres i sprawdź, czy przychodzi mail z potwierdzeniem.

Formularze są w czterech miejscach: `index.html`, `blog.html`, `newsletter.html`
i `wpis-przyklad.html` (a więc w każdym nowym wpisie).

---

## Dodawanie nowego wpisu

1. Skopiuj `wpis-przyklad.html` i nazwij po tytule, np. `zlosc-nie-jest-wrogiem.html`
   (małe litery, bez polskich znaków, myślniki zamiast spacji).
2. W nowym pliku podmień: `<title>`, `<meta name="description">`, `og:title`,
   datę w `<time datetime="RRRR-MM-DD">`, tytuł `<h1>`, lead i akapity.
3. W `blog.html` skopiuj jeden blok `<li class="wpis">` i wstaw **na górze** listy,
   podmieniając datę, tytuł, link i zajawkę.
4. To samo w `index.html` w sekcji „Blog” — tam trzymaj tylko trzy najnowsze,
   najstarszy usuwaj.

Czas czytania licz orientacyjnie: około 200 słów na minutę.

---

## Publikacja

Najprościej i za darmo:

- **Netlify** — przeciągnij folder `strona` na app.netlify.com/drop, gotowe.
- **Cloudflare Pages** albo **GitHub Pages** — jeśli chcesz trzymać pliki w repozytorium.

Potem podepnij własną domenę w panelu dostawcy. Certyfikat HTTPS zakładają automatycznie.

---

## Wygląd — gdzie co zmienić

Wszystkie kolory i rozmiary czcionek są w `style.css` w bloku `:root` na samej górze:

```css
--granit:  #15181A;   /* atrament, ciemne sekcje */
--mgla:    #EAEBE7;   /* tło strony */
--swierk:  #26332C;   /* blok newslettera, cień pod portretem */
--khaki:   #B29566;   /* jedyny akcent — kreski, znaki */
```

Zmiana jednej wartości przebuduje kolor w całym serwisie.

Kroje pisma: **Archivo** (nagłówki, interfejs) i **Newsreader** (tekst ciągły),
oba z Google Fonts, oba z pełnym zestawem polskich znaków.

---

## Zdjęcia

W `img/` leżą cztery kadry wycięte z oczyszczonego zdjęcia:

- `krzysztof-hero.jpg` — pion na stronę główną
- `krzysztof-portret.jpg` — portret 4:5 na podstrony
- `krzysztof-szeroki.jpg` — kadr poziomy, używany jako `og:image`
- `beskidy.jpg` — sam krajobraz, bez postaci

Plik `krzysztof-oryginal-bez-zabudowan.jpg` (w folderze nadrzędnym) to pełna rozdzielczość
po retuszu — z niego można wycinać kolejne kadry.

---

## Dostępność

Zadbane: pomijanie do treści, widoczny focus, kontrast, opisy alternatywne obrazów,
`aria-live` przy komunikatach formularza, wyłączenie animacji przy
`prefers-reduced-motion`. Warto to zachować przy dalszych zmianach.
