# Nezvi WoW Extension — Project notes

Internal documentation: what the extension does, how it's built, why things are the way they are, and how to release it. For installation and the user-facing feature list, see the [README](../README.md).

## Status (October 2026)

| Item | State |
| --- | --- |
| Version 1.1 | Submitted to Microsoft Edge Add-ons and Chrome Web Store, in review |
| Version 1.2 | Finished on the `v1.2` branch, not submitted yet |
| `main` branch | Still at 1.1 on purpose (see [Branches and releases](#branches-and-releases)) |
| Repository | https://github.com/nicolasvillacorta/nezvi-wow-links |
| Donations | https://cafecito.app/nezvi |

## Features (v1.2)

**Your character**
- Region, realm and name. The guild is detected from Raider.io, including guilds on another realm of a connected group.
- Header with the in-game avatar, class color, realm and guild.
- Stats: Mythic+ score (in Raider.io's score color), equipped item level and current raid progress.
- Best keys panel (click the M+ chip): best key per season dungeon with upgrades, plus the distance to the season title cutoff (top 0.1% of the region).
- Multiple characters (alts): switcher on the name with class color, realm and score; add, edit and remove; `←` `→` rotate.
- Remove character; with none left the extension goes back to an empty setup.

**Links**
- Character: Raider.io, Warcraft Logs, Armory and WoWProgress on by default; Simple Armory and Data for Azeroth optional.
- Guild: Raider.io and Warcraft Logs on by default; WoWProgress and Armory optional.
- Keys `1`–`9` open links. Optional "open in background".
- Copy `Name-Realm` in the in-game format for `/invite` or `/w`.

**Player lookup**
- Magnifier button in the header opens a search box. `Ctrl+V` anywhere in the popup also works, even with the box closed.
- Accepts `Name-Realm` as copied in game (`Nezvi-MoonGuard`), with spaces, or just `Name` (your own realm). Opens that character's Raider.io page.
- Last 5 searches, local to the device, with a clear button.
- `Alt+Shift+R` opens the popup (manifest `commands`). Flow: copy a name in game → `Alt+Shift+R` → `Ctrl+V`.

**Setup**
- Realm autocomplete from the bundled official realm list, any spelling ("moonguard" finds Moon Guard). On save the realm snaps to its official name.

**Appearance** (Options → Appearance)
- Size: Small (300px), Medium (400px, links in two columns), Large (620px, two panels with the best keys always visible).
- Style: Modern, Classic (in-game look: serif font, gold frame, red buttons) or Minimal (flat list).
- Color: Gold, Arcane, Frost or Fel. Combines with any style.
- Compact mode (links as a grid of tags) and faction colors (Horde/Alliance glow).

**Other**
- English and Spanish.
- Options grouped into General, Appearance and Links.

## Architecture

Manifest V3, plain HTML/CSS/JS, no build step and no dependencies.

| File | Role |
| --- | --- |
| `manifest.json` | Permissions `storage` and host `https://raider.io/*`. `commands` for `Alt+Shift+R`. No background worker. |
| `popup.html` | Markup and all CSS: palette variables, the Classic/Minimal style layers, size layouts. |
| `popup.js` | UI logic: views, texts (ES/EN), links, settings, lookup, autocomplete. |
| `raiderio.js` | Raider.io API calls, cached JSON, realm slugs. |
| `realms.js` | Official realm names per region (`REALMS`), `realmKey` normalization and `matchRealms`. |
| `icons/` | `icon.svg` (32–128px) and `icon-small.svg` (16px) sources, plus the PNGs. |
| `store/` | Store listing texts, permission justifications, screenshots and promo images. |
| `PRIVACY.md` | Privacy policy linked from both stores. |

Scripts load in order `realms.js` → `raiderio.js` → `popup.js` and share globals.

### Views

`popup.js` switches between three views with `show(view)`: `config` (character setup), `links` (main) and `settings` (options). The header, stats and lookup live outside the views.

Layout wrappers: `.cols > .side` (stats, best keys) and `.cols > .main` (lookup, views). In Small and Medium they use `display: contents`, so the popup is a single column. In Large they become a two-column grid.

### Raider.io API

| Endpoint | Used for | Cache |
| --- | --- | --- |
| `/api/v1/characters/profile` with `guild, gear, raid_progression, mythic_plus_scores_by_season:current, mythic_plus_best_runs` | Guild, class, avatar, faction, score, item level, raid, best keys | Stored as `profile`, refreshed each time the popup opens |
| `/api/v1/raiding/static-data?expansion_id=N` | Which raid is current: live in the region now, with the most bosses | 1 day (`raidCache`) |
| `/api/v1/mythic-plus/static-data?expansion_id=N` | Season dungeons, to list the ones not done yet | 1 day (`mplusCache`) |
| `/api/v1/mythic-plus/season-cutoffs?season=S&region=R` | Title cutoff (`p999`) | 1 day (`cutoff:<season>:<region>`) |

The expansion comes from the newest `expansion_id` in the character's raid progress. All calls happen only while the popup is open.

### Realm slugs

Sites disagree on realm slugs, so `raiderio.js` has two:
- `slug()`: Raider.io style. Lowercase, hyphens, no apostrophes or parentheses, **keeps accents** (`aggra-português`).
- `blizzSlug()`: same, **without accents** (`aggra-portugues`), for the Armory, Warcraft Logs and the rest.

### Storage

| Key | Area | Content |
| --- | --- | --- |
| `chars`, `active` | sync | List of `{ region, realm, name }` and the index shown. Up to 1.1 a single `char` was saved; it's migrated on first open. |
| `settings` | sync | `lang, links{}, background, shortcuts, compact, theme, style, size, faction, runsOpen`. Merged with defaults on load, so new options and sites get their default value. |
| `profiles` | local | Raider.io profile per character key (`region/realm/name`), with a `fetched` time. Alts older than 15 minutes refresh when the switcher opens. |
| `recent` | local | Last 5 player lookups |
| `raidCache`, `mplusCache`, `cutoff:*` | local | API caches |
| `look` | `localStorage` | Copy of theme, style and size, read synchronously so the popup doesn't flash the defaults on open |

## Design decisions

- **No background worker.** An M+ score badge on the icon was built and removed: it overlapped the icon, and the worker was the only code running with the popup closed. Two testers reported high CPU around that version, which couldn't be reproduced, so the extension now does nothing while closed. This also removed the `alarms` permission.
- **No clipboard permission.** Reading the clipboard on open needs `clipboardRead`, which shows a scary install warning. Pressing `Ctrl+V` in the popup gives the same flow without it.
- **Bundled realm list.** Raider.io's site search (undocumented) matched word by word and returned few realms, so "moong" didn't find Moon Guard. The list in `realms.js` comes from Blizzard's realm status pages and is matched locally. It needs a manual update if Blizzard opens new realms.
- **No Great Vault.** Only the Mythic+ row is available from public APIs. The raid row needs Blizzard's API with a client secret (it can't ship inside an extension), and the world row isn't exposed at all. A partial vault was built and removed.
- **No manual guild field.** The guild always comes from Raider.io.
- **No light theme.** Character names use class colors, and some (Priest white, Rogue yellow) are unreadable on light backgrounds.
- **Sizes change the layout, not a zoom.** Medium and Large show more content instead of the same content bigger. Chrome caps popups at 600px high, so Large options scroll a little.

## Branches and releases

- Both stores link the privacy policy from `main`. While 1.1 is in review, `main` must describe 1.1, so 1.2 lives on the `v1.2` branch.
- When both stores approve 1.1:
  1. Merge `v1.2` into `main`.
  2. Refresh the screenshots in `store/` (they still show 1.1).
  3. Upload `dist/nezvi-wow-extension-1.2.zip` to each store as an update. 1.2 needs no new permissions compared with 1.1.
- Every release needs a higher `version` in `manifest.json`, and each upload goes through review again.

### Building the ZIP

The package must have `manifest.json` at the root and only the runtime files: `manifest.json`, `popup.html`, `popup.js`, `raiderio.js`, `realms.js` and `icons/*.png`. Build it with .NET's `ZipFile` (or any tool that writes real ZIPs with `/` separators). Windows' `tar -a` produced a TAR with a `.zip` name, and PowerShell 5's `Compress-Archive` can write `\` separators. `dist/` is ignored by git.

### Store submission

Everything to paste is in [`store/LISTING.md`](../store/LISTING.md): descriptions (EN/ES), search terms, single purpose, permission justifications and testing notes. Developer accounts: Edge (Partner Center, free) and Chrome (one-time USD 5, non-trader).

## Testing

There are no automated tests. Changes were checked by:
- Running `raiderio.js` in Node with a fake `chrome.storage`, against the live Raider.io API.
- Rendering the real `popup.html` with a stubbed `chrome` API in headless Edge (`--screenshot`), for every view, style, color and size.
- Loading the unpacked extension in an isolated headless Edge (`--load-extension`, `--remote-debugging-port`) and driving the popup over the DevTools protocol: setup, save, autocomplete, options, console errors and CPU usage.

Manual check before a release: load it unpacked, set up a character, open each link, try the lookup with `Name-Realm`, and switch sizes, styles and colors.

## Changelog

**1.2** (branch `v1.2`)
- Stats (M+ score, item level, current raid) and the best keys panel with the title cutoff.
- Player lookup with recent searches and `Alt+Shift+R`.
- Realm autocomplete from the official realm list; realm slugs per site, fixing realms with accents.
- Styles, colors, sizes and compact mode; faction colors; options grouped.
- Removed the manual guild field; added "Remove character".
- Built and then removed: M+ score badge with a background worker, "Open all" button, Great Vault row.

**1.1** (in review)
- Rename to Nezvi WoW Extension, icon, English docs, privacy policy, store kit.
- Options: language, visible links, open in background, keyboard shortcuts.
- Guild, class and avatar from Raider.io; guild links use the guild's realm.
- Copy Name-Realm, Cafecito donation button.

**1.0**
- First popup with links to Raider.io, Warcraft Logs, Armory and WoWProgress for one character.

## Ideas not built yet

- Player preview: show the looked-up player's stats in the popup instead of opening Raider.io.
- Right-click "View on Raider.io" for selected `Name-Realm` text.
- Highlight the dungeon with the lowest score in the best keys panel.
- Guides for the character's spec (Wowhead, Icy Veins, Murlok).
- Weekly affixes, Firefox version, automatic store publishing with a GitHub Action.
