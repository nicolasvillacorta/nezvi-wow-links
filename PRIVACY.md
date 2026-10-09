# Privacy Policy — Nezvi WoW Extension

*Last updated: October 9, 2026 (version 1.2)*

Nezvi WoW Extension ("the extension") is a browser extension that gives World of Warcraft players quick links to their character's public profiles. This policy explains what data the extension handles.

## Summary

- The extension **does not collect, sell or share** any personal data with the developer.
- There are **no accounts, analytics, tracking or ads**.
- The only data the extension handles is the World of Warcraft character you enter, and it stays in your browser.

## Data the extension stores

When you set up the extension, you enter:

- Region, realm and character name (all public in-game information).
- Your preferences (language, which links to show and similar options).

This data is saved with the browser's built-in extension storage (`chrome.storage`). If you're signed in to your browser with sync enabled, your browser provider (Google or Microsoft) syncs it across your devices under their own privacy policies. The developer never receives it.

## Data sent to third parties

To show your character's guild, class, avatar, Mythic+ score, item level and raid progress, the extension sends your **region, realm and character name** to the public [Raider.io](https://raider.io) API. This happens when you open the popup and in the background about every 2 hours, to keep the score on the toolbar icon up to date. No other data is sent, and no identifier for you or your browser is included.
 Raider.io's handling of requests is covered by its own privacy policy.

When you click a link, the browser opens that website (Raider.io, Warcraft Logs, the World of Warcraft Armory, WoWProgress, Simple Armory or Data for Azeroth). Those sites are independent and have their own privacy policies.

## Permissions

- **storage:** saves your character and preferences.
- **alarms:** schedules the periodic refresh of the M+ score shown on the toolbar icon.
- **Access to raider.io:** looks up your character's guild, class, avatar, score, item level and raid progress.

## Removing your data

Uninstalling the extension deletes all the data it stored. You can also change or remove your character at any time from the extension.

## Changes

If this policy changes, the updated version will be published at this address with a new date.

## Contact

Questions or concerns: open an issue at [github.com/nicolasvillacorta/nezvi-wow-links/issues](https://github.com/nicolasvillacorta/nezvi-wow-links/issues).

*World of Warcraft and Warcraft are trademarks of Blizzard Entertainment, Inc. This extension is not affiliated with or endorsed by Blizzard Entertainment, Raider.io, Warcraft Logs or the other sites it links to.*
