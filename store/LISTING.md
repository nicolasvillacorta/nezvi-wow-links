# Store submission kit

Copy-paste material for the Microsoft Edge Add-ons and Chrome Web Store submissions.

- **Package:** build `dist/nezvi-wow-extension-<version>.zip` (only `manifest.json`, `popup.html`, `popup.js` and `icons/*.png`, with `manifest.json` at the root).
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

## Description — English

```text
Nezvi WoW gives World of Warcraft players one-click access to their character's profiles on the sites they check every day.

Set up your character once (region, realm and name) and the extension builds the links for you:

• Raider.io
• Warcraft Logs
• World of Warcraft Armory
• WoWProgress
• Simple Armory and Data for Azeroth (optional)

FEATURES
• Automatic guild detection: your guild is looked up on Raider.io, including guilds on connected realms.
• Guild links to Raider.io and Warcraft Logs (WoWProgress and the Armory are optional).
• Your in-game avatar and class color in the popup.
• Keyboard shortcuts: press 1–9 to open a link.
• Open all links at once.
• Copy your Name-Realm in the in-game format, ready for /invite or /w.
• Choose which links to show and open them in the background if you prefer.
• Available in English and Spanish.
• Settings sync across your browsers.

PRIVACY
No accounts, no tracking, no ads. Your character is stored in your browser, and only your region, realm and character name are sent to the public Raider.io API to detect your guild.

Nezvi WoW is a fan-made project and isn't affiliated with or endorsed by Blizzard Entertainment, Raider.io, Warcraft Logs or the other linked sites. World of Warcraft is a trademark of Blizzard Entertainment, Inc.
```

## Descripción — Español

```text
Nezvi WoW te da acceso con un click a los perfiles de tu personaje de World of Warcraft en los sitios que revisás todos los días.

Configurás tu personaje una sola vez (región, reino y nombre) y la extensión arma los links por vos:

• Raider.io
• Warcraft Logs
• Armería de World of Warcraft
• WoWProgress
• Simple Armory y Data for Azeroth (opcionales)

FUNCIONES
• Detección automática de la guild desde Raider.io, incluso en reinos conectados.
• Links de la guild a Raider.io y Warcraft Logs (WoWProgress y la Armería son opcionales).
• El avatar y el color de clase de tu personaje en el popup.
• Atajos de teclado: apretá 1–9 para abrir un link.
• Abrí todos los links de una vez.
• Copiá tu Nombre-Reino en el formato del juego, listo para /invite o /w.
• Elegí qué links mostrar y abrilos en segundo plano si preferís.
• Disponible en español e inglés.
• La configuración se sincroniza entre tus navegadores.

PRIVACIDAD
Sin cuentas, sin rastreo y sin publicidad. Tu personaje se guarda en tu navegador, y solo se envían tu región, reino y nombre a la API pública de Raider.io para detectar tu guild.

Nezvi WoW es un proyecto hecho por fans y no está afiliado ni respaldado por Blizzard Entertainment, Raider.io, Warcraft Logs ni los demás sitios enlazados. World of Warcraft es una marca registrada de Blizzard Entertainment, Inc.
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
Gives World of Warcraft players quick links to their character's and guild's public profiles on sites like Raider.io, Warcraft Logs and the WoW Armory.
```

**Permission justification — storage**

```text
Saves the character the user enters (region, realm, name and optional guild) and the user's preferences (language, visible links), so they don't need to be entered every time the popup opens.
```

**Permission justification — host permission (https://raider.io/*)**

```text
Used only to call the public Raider.io API (raider.io/api/v1/characters/profile) with the character's region, realm and name, to detect the character's guild, guild realm, class and avatar. No other site is accessed and no page content is read or modified.
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
2. Choose region "US", realm "<YOUR REALM>" and character "<YOUR CHARACTER>", leave Guild empty and click Save.
3. The popup shows links to Raider.io, Warcraft Logs, Armory and WoWProgress. The guild, class color and avatar are detected automatically from the Raider.io API.
4. Press 1–6 or click a link to open it. The gear icon opens the options (language, visible links, open in background).
```
