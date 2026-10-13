# Store submission kit

Copy-paste material for the Microsoft Edge Add-ons and Chrome Web Store submissions.

- **Package:** build `dist/nezvi-wow-extension-<version>.zip` (only `manifest.json`, `popup.html`, `popup.js`, `raiderio.js`, `realms.js` and `icons/*.png`, with `manifest.json` at the root).
- **Privacy policy URL:** https://github.com/nicolasvillacorta/nezvi-wow-links/blob/main/PRIVACY.md
- **Website:** https://github.com/nicolasvillacorta/nezvi-wow-links
- **Support:** https://github.com/nicolasvillacorta/nezvi-wow-links/issues

## Images

| File | Size | Edge | Chrome |
| --- | --- | --- | --- |
| `logo-300x300.png` | 300×300 | Store logo | — |
| `../icons/icon-128.png` | 128×128 | — | Store icon |
| `screenshot-1-en.png` | 1280×800 | Screenshot (English) | Screenshot |
| `screenshot-2-en.png` | 1280×800 | Screenshot (English) | Screenshot |
| `screenshot-3-es.png` | 1280×800 | Screenshot (Spanish) | Screenshot |
| `promo-small-440x280.png` | 440×280 | Small promotional tile | Small promo tile |
| `promo-marquee-1400x560.png` | 1400×560 | Large promotional tile | Marquee promo tile |

## Category

Productivity (alternative: Entertainment).

## Short description

Taken from `manifest.json` (read-only in the store):

> Your character's Raider.io, Warcraft Logs, Armory and more, one click away.

> **Chrome rule (keyword stuffing):** the description may name at most 5 brands or sites. Version 1.2 was rejected for listing every supported site. Name only a few and link to the README for the full list (the screenshots can show the rest).

## Description — English

```text
Nezvi WoW gives World of Warcraft players one-click access to their characters' profiles on the sites they check every day, like Raider.io and Warcraft Logs.

Set up your character once (region, realm and name) and the extension builds the links for you. You choose which sites to show; see the full list at https://github.com/nicolasvillacorta/nezvi-wow-links#features

FEATURES
• Automatic guild detection, including guilds on connected realms, with links to your guild's pages.
• Your in-game avatar and class color in the popup.
• Save all your alts and switch between them in one click (or with the arrow keys).
• Your Mythic+ score, item level and current raid progress at a glance.
• Best keys panel: your best key per dungeon this season and how far you are from the title.
• Realm autocomplete while you set up your character.
• Player lookup: paste Name-Realm copied in game and their profile opens instantly, with your recent searches one click away.
• Open the popup with Alt+Shift+R.
• Keyboard shortcuts: press 1–9 to open a link.
• Copy your Name-Realm in the in-game format, ready for /invite or /w.
• Open links in the background if you prefer.
• Three styles (Modern, Classic in-game look, Minimal), four colors and three sizes, plus a compact mode.
• Available in English and Spanish.
• Settings sync across your browsers.

PRIVACY
No accounts, no tracking, no ads. Your characters are stored in your browser, and only their region, realm and name are sent to the public Raider.io API to show their guild and stats.

Nezvi WoW is a fan-made project and isn't affiliated with or endorsed by Blizzard Entertainment or the sites it links to.
```

## Descripción — Español

```text
Nezvi WoW te da acceso con un click a los perfiles de tus personajes de World of Warcraft en los sitios que revisás todos los días, como Raider.io y Warcraft Logs.

Configurás tu personaje una sola vez (región, reino y nombre) y la extensión arma los links por vos. Vos elegís qué sitios mostrar; la lista completa está en https://github.com/nicolasvillacorta/nezvi-wow-links#features

FUNCIONES
• Detección automática de la guild, incluso en reinos conectados, con links a las páginas de tu guild.
• El avatar y el color de clase de tu personaje en el popup.
• Guardá todos tus alters y cambiá entre ellos con un clic (o con las flechas del teclado).
• Tu puntaje de Mítica+, nivel de objeto y progreso en la raid actual de un vistazo.
• Panel de mejores llaves: tu mejor llave por mazmorra en la temporada y cuánto te falta para el título.
• Autocompletado de reinos al configurar tu personaje.
• Buscador de jugadores: pegá Nombre-Reino copiado del juego y se abre su perfil al instante, con tus búsquedas recientes a un clic.
• Abrí el popup con Alt+Shift+R.
• Atajos de teclado: apretá 1–9 para abrir un link.
• Copiá tu Nombre-Reino en el formato del juego, listo para /invite o /w.
• Abrí los links en segundo plano si preferís.
• Tres estilos (Moderno, Clásico al estilo del juego, Minimal), cuatro colores y tres tamaños, más un modo compacto.
• Disponible en español e inglés.
• La configuración se sincroniza entre tus navegadores.

PRIVACIDAD
Sin cuentas, sin rastreo y sin publicidad. Tus personajes se guardan en tu navegador, y solo se envían su región, reino y nombre a la API pública de Raider.io para mostrar su guild y sus estadísticas.

Nezvi WoW es un proyecto hecho por fans y no está afiliado ni respaldado por Blizzard Entertainment ni por los sitios que enlaza.
```

## Search terms (Edge, up to 7)

```text
World of Warcraft
WoW
Raider.io
Warcraft Logs
Mythic Plus
WoW Armory
WoW guild
```

## Privacy tab

**Single purpose / extension purpose**

```text
Gives World of Warcraft players quick access to the public profiles of their characters, their guild and players they look up, on sites like Raider.io, Warcraft Logs and the WoW Armory.
```

**Permission justification — storage**

```text
Saves the characters the user enters (region, realm and name), their preferences (language, visible links, appearance) and their last 5 player lookups, so they don't need to be entered every time the popup opens. Cached Raider.io data is kept locally to show it instantly.
```

**Permission justification — host permission (https://raider.io/*)**

```text
Used only to call the Raider.io API: the character profile (region, realm and name) to show the guild, class, avatar, Mythic+ score, item level and raid progress; and the raid and Mythic+ static data to know the current raid, the season's dungeons and the title score cutoff. No other site is accessed and no page content is read or modified.
```

**Remote code:** No. All code is included in the package; the extension only fetches JSON data from the Raider.io API.

**Data usage:**
- Data collected by the developer: none. Leave every data type unchecked.
- Certify: data isn't sold to third parties, isn't used for purposes unrelated to the single purpose, and isn't used for creditworthiness or lending.

## Notes for certification (testers)

Replace the character with your own before submitting:

```text
No account or login is needed.
1. Click the extension icon in the toolbar.
2. Choose region "US", realm "<YOUR REALM>" and character "<YOUR CHARACTER>", and click Save.
3. The popup shows links to Raider.io, Warcraft Logs, Armory and WoWProgress. The guild, class color and avatar are detected automatically from the Raider.io API.
4. Press 1–6 or click a link to open it. The gear icon opens the options (language, visible links, appearance).
5. Player lookup: click the magnifier and type or paste a character as Name-Realm (for example the same character you set up); its Raider.io page opens.
6. Alts: click the character name in the header, choose "+ Add character" and save another one; switch between them from that menu or with the left/right arrow keys.
```
