# Nezvi WoW Extension

A Chrome extension for **World of Warcraft** players: save your character once and get one-click access to its profiles on Raider.io, Warcraft Logs, the Armory, WoWProgress and more. Available in English and Spanish.

## Features

- **Character links:** Raider.io, Warcraft Logs, Armory and WoWProgress are enabled on install. Simple Armory and Data for Azeroth can be turned on in the options.
- **Guild links:** if you add a guild, its Raider.io and Warcraft Logs pages show up too (WoWProgress and the Armory are optional).
- **Options (⚙):**
  - Language: English or Spanish (the Armory opens in the same language).
  - Choose which links to show or hide.
  - Open links in the background.
  - Show or hide keyboard shortcuts.
- **Keyboard shortcuts:** with the popup open, keys `1`–`9` open each link.
- **Open all:** opens every visible link at once.
- **Copy Name-Realm:** copies your character in the in-game format, ready for `/invite` or `/w`.
- Settings are saved with `chrome.storage.sync`, so they follow you to any Chrome where you're signed in.

## Installation (developer mode)

1. Download or clone this repository.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the project folder.
4. Pin the extension to the toolbar and set up your character.

## Project structure

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension definition (Manifest V3). |
| `popup.html` | Popup markup and styles. |
| `popup.js` | Logic: sites, languages, options and link building. |

To add a new site, add an entry to the `SITES` list in `popup.js`.

## Support the project

If you find it useful, you can buy me a coffee on [Cafecito](https://cafecito.app/nezvi) or from the ♥ button in the extension.
