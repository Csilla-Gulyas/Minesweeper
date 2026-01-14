# Minesweeper – Neon Edition

**Live demo:** [https://csilla-gulyas.github.io/Minesweeper/](https://csilla-gulyas.github.io/Minesweeper/)

## Projektleírás

A Minesweeper – Neon Edition egy klasszikus Aknakereső játék modern, neon-fényű, futurisztikus cyberpunk stílusban.  
A cél egy látványos, mégis áttekinthető felület, ahol a játékos különböző nehézségi szinteken teheti próbára logikai készségeit. 

A teljes játék a böngészőben fut, minden logikai működés JavaScriptben lett megvalósítva.

## Fő funkciók

- Három választható nehézségi szint:
    - **Kezdő:** 9×9 mező, 10 bomba
    - **Haladó:** 16×16 mező, 40 bomba
    - **Szakértő:** 16×30 mező, 99 bomba
- Interaktív, neon stílusú játékfelület
- **Bal kattintás:** mezők felfedése
- **Jobb kattintás:** zászló kihelyezése / eltávolítása
- Időmérő
- Bomba-/zászlószámláló
- Újraindító emoji gomb
- Háttérzene indítása/megszakítása
- Beépített játékszabályzat (animált modal, ugyanabban az oldalon jelenik meg)

## Felhasznált technológiák

- **HTML5** – játékstruktúra
- **CSS3** – neon fényhatások, színek, animációk
- **JavaScript (Vanilla)** – játékmenet teljes logikája
- **Ikonok:**
    - Font Awesome
    - AI-generált ikonok + saját szerkesztés
- **Betűtípusok:** Google Fonts (ha használtál)

## A projekt felépítése

| Fájl        | Funkció |
|------------|---------|
| `index.html` | A játék teljes felülete és a beépített szabályzat |
| `style.css`  | Neon designelemek, animációk, reszponzív elrendezés |
| `script.js`  | Pályagenerálás, logika, kattintáskezelés, győzelem/vesztés |

## Játékmenet összefoglaló

### Kattintások

- **Bal gomb:** mező felfedése
- **Jobb gomb:** zászló kihelyezése / levétele
- Az üres mezők automatikusan „terjednek”, több szomszédos mező is felfedődik.

### Biztonsági szabályok

- Az első kattintás mindig garantáltan biztonságos.
- A zászlók száma megegyezik a pályán elhelyezett bombákkal.

### Győzelem

A játék akkor ér véget sikeresen, ha:

1. minden bomba jelölve van, vagy
2. az összes nem aknás mezőt felfeded.

## Felhasználói felület és neon design

- **Mezők:** sötétebb tónusúak, világos, fénylő keretekkel emelve a neon hatást.
- **Hover effekt:** letisztult animáció, nem vibráló.
- **Fő színkódok:** `#00ffff`, `#da2784`, `#033237`, `FF6B00CC`
- **Játéktábla:** fényes kontúrok a neon-hatás kiemelésére.
- **Modalok:** animációval jelennek meg (pl. játékszabályzat, értesítések)
- **Háttérzene:** aktiválható egy animált kazetta ikon segítségével; a kazetta kerekei forognak, amikor a zene szól.
- **Ikonok:** Font Awesome, AI-generált képek és saját szerkesztés kombinációja.

## Készítette

**Név**  
Gulyás Csilla
Frontend játékprojekt, 2024
