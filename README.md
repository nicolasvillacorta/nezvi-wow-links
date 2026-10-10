# Nezvi WoW Extension

A browser extension (Chrome, Edge and other Chromium browsers) for **World of Warcraft** players: save your character once and get one-click access to its profiles on Raider.io, Warcraft Logs, the Armory, WoWProgress and more. Available in English and Spanish.

## Features

- **Character links:** Raider.io, Warcraft Logs, Armory and WoWProgress are enabled on install. Simple Armory and Data for Azeroth can be turned on in the options.
- **Automatic guild detection:** the guild is looked up on Raider.io from your character, so you don't need to type it. Guild links use the guild's own realm, which works with connected realms.
- **Guild links:** Raider.io and Warcraft Logs are enabled by default (WoWProgress and the Armory are optional).
- **Character card:** shows your in-game avatar and class color, fetched from Raider.io.
- **Stats at a glance:** your current Mythic+ score (in Raider.io's score color), equipped item level, progress in the current raid, right in the popup.
- **Best keys:** click the M+ chip to see your best key per dungeon this season and how far you are from the season title.
- **Realm autocomplete:** suggests realms of the selected region from Blizzard's official realm list while you type, however you spell them ("moonguard" finds Moon Guard).
- **Options (⚙):**
  - Language: English or Spanish (the Armory opens in the same language).
  - Theme: Gold, Arcane, Frost or Fel.
  - Choose which links to show or hide.
  - Open links in the background.
  - Show or hide keyboard shortcuts.
- **Player lookup:** paste a name copied in game (`Name-Realm`, or just `Name` for your own realm) and Raider.io opens right away. Press `Ctrl+V` as soon as the popup opens, or use the magnifier button to type a name. Your last 5 searches are listed there to reopen them in one click.
- **Open the popup from the keyboard:** `Alt+Shift+R` (change it at `chrome://extensions/shortcuts` or `edge://extensions/shortcuts`). Copy a name in game, press `Alt+Shift+R`, then `Ctrl+V`.
- **Keyboard shortcuts:** with the popup open, keys `1`–`9` open each link.
- **Copy Name-Realm:** copies your character in the in-game format, ready for `/invite` or `/w`.
- Settings are saved with `chrome.storage.sync`, so they follow you to any browser where you're signed in with the same account.

## Installation

The extension isn't on the Chrome Web Store or Edge Add-ons yet, so for now it's installed manually. It takes about a minute.

### 1. Download it

1. [Download the ZIP](https://github.com/nicolasvillacorta/nezvi-wow-links/archive/refs/heads/main.zip) (or click **Code → Download ZIP** at the top of this page).
2. Extract it somewhere permanent, for example `Documents
ezvi-wow-extension`.

> **Don't delete or move that folder afterwards.** The browser loads the extension from it, so if the folder disappears, the extension stops working.

### 2. Load it in your browser

**Google Chrome**

1. Go to `chrome://extensions`.
2. Turn on **Developer mode** (top-right corner).
3. Click **Load unpacked** and select the extracted folder (the one that contains `manifest.json`).

**Microsoft Edge**

1. Go to `edge://extensions`.
2. Turn on **Developer mode** (left sidebar).
3. Click **Load unpacked** and select the extracted folder (the one that contains `manifest.json`).

Other Chromium browsers (Brave, Opera, Vivaldi) work the same way from their extensions page.

### 3. Pin it to the toolbar

Click the puzzle-piece icon in the toolbar and pin **Nezvi WoW Extension** so it's always one click away.

The browser may show a warning about developer-mode extensions. That's expected for extensions installed outside the store.

## How to use it

1. Click the extension icon.
2. Pick your **region**, type your **realm** and **character name**, and click **Save**. Your guild is detected automatically.
   To remove your character, click the pencil and then **Remove character**.
3. Click any link, or press its number key (`1`, `2`, `3`…) to open it.
4. Use the icons at the top to **copy Name-Realm** (copy icon), **change character** (pencil) or open the **options** (⚙).

## Updating

Until the extension is published, updates are manual:

1. Download the ZIP again and replace the contents of your existing folder with the new files.
2. Go to `chrome://extensions` (or `edge://extensions`) and click the **reload** icon on the extension's card.

Your character and options are kept.

If you cloned the repository with Git, run `git pull` instead of downloading the ZIP, then reload.

## Project structure

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension definition (Manifest V3). |
| `popup.html` | Popup markup and styles. |
| `popup.js` | Popup logic: sites, languages, options and link building. |
| `raiderio.js` | Raider.io API helpers (profile, current raid, best keys, title cutoff). |
| `realms.js` | Official realm list per region, used for the autocomplete. |
| `icons/` | Extension icons. `icon.svg` is the source for 32–128 px and `icon-small.svg` a simplified version for 16 px. |

To add a new site, add an entry to the `SITES` list in `popup.js`.

Store listing texts and images live in [`store/`](store/LISTING.md).

## Privacy

The extension has no accounts, tracking or ads. See the [privacy policy](PRIVACY.md).

## Support the project

If you find it useful, you can buy me a coffee on [Cafecito](https://cafecito.app/nezvi) or from the ♥ button in the extension.
