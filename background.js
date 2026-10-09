// Keeps the toolbar badge showing the character's current M+ score
importScripts("raiderio.js");

const REFRESH_MINUTES = 120;

// Draw the badge from cached data
async function renderBadge() {
  const [{ char, settings }, { profile }] = await Promise.all([
    chrome.storage.sync.get(["char", "settings"]),
    chrome.storage.local.get("profile"),
  ]);
  const show = !settings || settings.badge !== false;
  const p = char && profile && profile.key === charKey(char) ? profile : null;
  const text = show && p && p.score ? String(p.score) : "";
  await chrome.action.setBadgeText({ text });
  if (text) {
    await chrome.action.setBadgeBackgroundColor({ color: "#15171c" });
    // Score in Raider.io's color for that score range
    if (chrome.action.setBadgeTextColor) await chrome.action.setBadgeTextColor({ color: p.scoreColor || "#f2c45a" });
  }
}

// Fetch fresh data from Raider.io; storing it triggers renderBadge via onChanged
async function refresh() {
  const { char } = await chrome.storage.sync.get("char");
  if (!char) return renderBadge();
  const profile = await fetchProfile(char);
  if (profile) await chrome.storage.local.set({ profile });
  else await renderBadge();
}

chrome.alarms.get("refresh", alarm => {
  if (!alarm) chrome.alarms.create("refresh", { periodInMinutes: REFRESH_MINUTES });
});
chrome.alarms.onAlarm.addListener(refresh);
chrome.runtime.onInstalled.addListener(refresh);
chrome.runtime.onStartup.addListener(refresh);
chrome.storage.onChanged.addListener(renderBadge);
