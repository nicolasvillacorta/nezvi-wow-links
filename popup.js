const $ = id => document.getElementById(id);
// slug, blizzSlug, charKey and fetchProfile come from raiderio.js; REALMS, realmKey and matchRealms from realms.js

// Replace with your donation link (Cafecito, Ko-fi, PayPal, etc.)
const DONATE_URL = "https://cafecito.app/nezvi";
const VERSION = "v" + chrome.runtime.getManifest().version;

const T = {
  es: {
    setup: "Configurá tu personaje", region: "Región", realm: "Reino", realmPh: "ej: Ragnaros",
    name: "Personaje", namePh: "Nombre", guild: "Guild", removeChar: "Quitar personaje",
    save: "Guardar", error: "Completá el reino y el personaje.",
    language: "Idioma", charLinks: "Links del personaje", guildLinks: "Links de la guild",
    prefs: "Preferencias", background: "Abrir links en segundo plano", shortcuts: "Mostrar atajos de teclado",
    score: "Puntaje Mítica+", ilvl: "Nivel de objeto equipado", raid: "Progreso en la raid actual",
    compact: "Modo compacto", faction: "Colores de facción", runs: "Ver mejores llaves",
    titleCut: "Título (top 0,1%)", titleLeft: n => `te faltan ${n}`, titleIn: "¡en rango!",
    depleted: "Fuera de tiempo", notDone: "Sin completar",
    done: "Listo", reset: "Restablecer opciones", donate: "Invitame un café", settings: "Opciones",
    copy: "Copiar Nombre-Reino", edit: "Cambiar personaje", copied: "¡Copiado!",
    lookupPh: "Buscar en Raider.io: Nombre-Reino", lookupNeedRealm: "Agregá el reino: Nombre-Reino",
    lookupNoRealm: r => `No encontramos el reino "${r}"`, search: "Buscar jugador en Raider.io (o pegá con Ctrl+V)",
    recent: "Búsquedas recientes", clear: "Borrar",
    hint: n => `Tip: usá las teclas 1–${n}`, noLinks: "No hay links activos. Activalos en ⚙.",
    armory: "Armería", notFound: "No encontramos el personaje en Raider.io",
  },
  en: {
    setup: "Set up your character", region: "Region", realm: "Realm", realmPh: "e.g. Ragnaros",
    name: "Character", namePh: "Name", guild: "Guild", removeChar: "Remove character",
    save: "Save", error: "Enter a realm and a character.",
    language: "Language", charLinks: "Character links", guildLinks: "Guild links",
    prefs: "Preferences", background: "Open links in background", shortcuts: "Show keyboard shortcuts",
    score: "Mythic+ score", ilvl: "Equipped item level", raid: "Current raid progress",
    compact: "Compact mode", faction: "Faction colors", runs: "Show best keys",
    titleCut: "Title (top 0.1%)", titleLeft: n => `${n} to go`, titleIn: "in range!",
    depleted: "Over time", notDone: "Not completed",
    done: "Done", reset: "Reset options", donate: "Buy me a coffee", settings: "Options",
    copy: "Copy Name-Realm", edit: "Change character", copied: "Copied!",
    lookupPh: "Search Raider.io: Name-Realm", lookupNeedRealm: "Add the realm: Name-Realm",
    lookupNoRealm: r => `Realm "${r}" not found`, search: "Search a player on Raider.io (or paste with Ctrl+V)",
    recent: "Recent searches", clear: "Clear",
    hint: n => `Tip: press keys 1–${n}`, noLinks: "No links enabled. Turn them on in ⚙.",
    armory: "Armory", notFound: "Character not found on Raider.io",
  },
};

// Official class colors, keyed by the class name Raider.io returns
const CLASS_COLORS = {
  "Death Knight": "#C41E3A", "Demon Hunter": "#A330C9", "Druid": "#FF7C0A", "Evoker": "#33937F",
  "Hunter": "#AAD372", "Mage": "#3FC7EB", "Monk": "#00FF98", "Paladin": "#F48CBA", "Priest": "#FFFFFF",
  "Rogue": "#FFF468", "Shaman": "#0070DD", "Warlock": "#8788EE", "Warrior": "#C69B6D",
};

// Armory locale based on language and region
const armoryLocale = (lang, r) => lang === "es" ? (r === "us" ? "es-mx" : "es-es") : (r === "eu" ? "en-gb" : "en-us");

// Available sites. on = enabled by default on install
const SITES = [
  { id: "rio", scope: "char", tag: "RIO", color: "#e8762b", name: "Raider.io", on: true,
    url: c => `https://raider.io/characters/${c.r}/${c.rio}/${c.n}` },
  { id: "wcl", scope: "char", tag: "WCL", color: "#a3742c", name: "Warcraft Logs", on: true,
    url: c => `https://www.warcraftlogs.com/character/${c.r}/${c.realm}/${c.n}` },
  { id: "armory", scope: "char", tag: "ARM", color: "#1f6fd1", name: t => t.armory, on: true,
    url: c => `https://worldofwarcraft.blizzard.com/${armoryLocale(c.lang, c.r)}/character/${c.r}/${c.realm}/${c.n}` },
  { id: "wp", scope: "char", tag: "WP", color: "#4b8f3a", name: "WoWProgress", on: true,
    url: c => `https://www.wowprogress.com/character/${c.r}/${c.realm}/${c.n}` },
  { id: "sa", scope: "char", tag: "SA", color: "#7a5cc4", name: "Simple Armory", on: false,
    url: c => `https://simplearmory.com/#/${c.r}/${c.realm}/${c.n}` },
  { id: "dfa", scope: "char", tag: "DFA", color: "#2a9d8f", name: "Data for Azeroth", on: false,
    url: c => `https://www.dataforazeroth.com/characters/${c.r}/${c.realm}/${c.n}` },
  { id: "g-rio", scope: "guild", tag: "RIO", color: "#e8762b", name: "Raider.io", on: true,
    url: c => `https://raider.io/guilds/${c.r}/${c.gRio}/${c.g}` },
  { id: "g-wcl", scope: "guild", tag: "WCL", color: "#a3742c", name: "Warcraft Logs", on: true,
    url: c => `https://www.warcraftlogs.com/guild/${c.r}/${c.gRealm}/${c.g}` },
  { id: "g-wp", scope: "guild", tag: "WP", color: "#4b8f3a", name: "WoWProgress", on: false,
    url: c => `https://www.wowprogress.com/guild/${c.r}/${c.gRealm}/${c.g}` },
  { id: "g-armory", scope: "guild", tag: "ARM", color: "#1f6fd1", name: t => t.armory, on: false,
    url: c => `https://worldofwarcraft.blizzard.com/${armoryLocale(c.lang, c.r)}/guild/${c.r}/${c.gRealm}/${blizzSlug(c.guild)}` },
];

const defaults = () => ({
  lang: (chrome.i18n.getUILanguage() || "es").startsWith("es") ? "es" : "en",
  links: Object.fromEntries(SITES.map(s => [s.id, s.on])),
  background: false,
  shortcuts: true,
  compact: false,
  faction: true,
  runsOpen: false,
});

let settings = defaults();
let char = null;
let profile = null; // Raider.io data for char, see fetchProfile in raiderio.js
let view = "config"; // config | links | settings
let prevView = "config";
const t = () => T[settings.lang];
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
const siteName = s => typeof s.name === "function" ? s.name(t()) : s.name;

// ---------- Text ----------
function applyLang() {
  document.documentElement.lang = settings.lang;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t()[el.dataset.i18n]);
  document.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t()[el.dataset.i18nPh]);
  $("searchBtn").title = t().search; $("copy").title = t().copy; $("edit").title = t().edit; $("settingsBtn").title = t().settings;
  document.querySelectorAll("#lang button").forEach(b => b.classList.toggle("on", b.dataset.lang === settings.lang));
}

// ---------- Views ----------
function show(v) {
  view = v;
  $("config").hidden = v !== "config";
  $("linksView").hidden = v !== "links";
  $("settings").hidden = v !== "settings";
  $("settingsBtn").classList.toggle("active", v === "settings");
  $("edit").hidden = $("copy").hidden = !char || v !== "links";
  renderHeader();
  if (v === "links") renderLinks();
  if (v === "settings") renderSettings();
  if (v === "config") { $("hint").textContent = VERSION; $("removeChar").hidden = !char; $("realm").focus(); }
  // The lookup box stays folded behind the magnifier button
  $("searchBtn").hidden = v === "settings";
  if (v === "settings") toggleLookup(false);
  $("stats").hidden = v !== "links" || !$("stats").childElementCount;
  $("runs").hidden = v !== "links" || !settings.runsOpen || !$("runs").childElementCount;
}

// ---------- Raider.io profile ----------
const currentProfile = () => profile && char && profile.key === charKey(char) ? profile : null;

// Guild as reported by Raider.io (it may be on another realm of the connected group)
function guildOf() {
  const p = currentProfile();
  return p && p.guild ? { name: p.guild, realm: p.guildRealm } : null;
}

async function refreshProfile() {
  if (!char) return;
  const p = await fetchProfile(char);
  if (!p || !char || p.key !== charKey(char)) return;
  profile = p;
  chrome.storage.local.set({ profile });
  if (view !== "config") show(view);
}

// ---------- Header ----------
function renderHeader() {
  const crest = $("crest");
  crest.classList.remove("avatar"); crest.style.backgroundImage = crest.style.boxShadow = "";
  $("title").style.color = "";
  $("guildLine").hidden = true;
  $("stats").innerHTML = $("runs").innerHTML = "";
  document.body.dataset.faction = "";
  if (!char) {
    crest.textContent = "N"; $("title").textContent = "Nezvi WoW"; $("subtitle").textContent = t().setup;
    return;
  }
  const name = char.name.trim(), guild = guildOf(), p = currentProfile();
  crest.textContent = name[0].toUpperCase();
  $("title").textContent = name;
  $("subtitle").textContent = `${char.realm.trim()} · ${char.region.toUpperCase()}`;
  // Own line so long guild names don't get cut by the header buttons
  if (guild) { $("guildLine").textContent = `<${guild.name}>`; $("guildLine").title = guild.name; $("guildLine").hidden = false; }
  if (p) renderStats(p);
  if (p && p.faction && settings.faction) document.body.dataset.faction = p.faction;
  if (p && p.thumb) { crest.classList.add("avatar"); crest.style.backgroundImage = `url("${p.thumb}")`; }
  const color = p && CLASS_COLORS[p.cls];
  if (color) { $("title").style.color = color; crest.style.boxShadow = `0 0 0 2px ${color}, 0 2px 10px ${color}44`; }
}

// M+ score, item level and current raid progress
function renderStats(p) {
  const chip = (label, value, title, color) =>
    `<span class="stat" title="${title}"><b>${label}</b><span${color ? ` style="color:${color}"` : ""}>${value}</span></span>`;
  const [raidName, ...raidProgress] = (p.raid || "").split(" ");
  const hasRuns = p.runs && p.runs.length;
  const mplus = !p.score ? "" : !hasRuns ? chip("M+", p.score, t().score, p.scoreColor)
    : `<button class="stat toggle${settings.runsOpen ? " open" : ""}" id="mplusBtn" title="${t().runs}">
         <b>M+ <i>▾</i></b><span style="color:${p.scoreColor}">${p.score}</span></button>`;
  if (hasRuns) renderRuns(p);
  $("stats").innerHTML = [
    mplus,
    p.ilvl ? chip("iLvl", p.ilvl, t().ilvl) : "",
    p.raid ? chip(raidName, raidProgress.join(" "), t().raid) : "",
  ].join("");
}

// Best key per dungeon this season, plus the distance to the title cutoff
function renderRuns(p) {
  const row = r => {
    const lvl = !r.lvl ? `<span class="lvl muted" title="${t().notDone}">—</span>`
      : `<span class="lvl${r.up ? "" : " muted"}"${r.up ? "" : ` title="${t().depleted}"`}>+${r.lvl}<i>${"★".repeat(r.up)}</i></span>`;
    return `<div class="run"><span class="d" title="${r.name}">${r.d}</span>${lvl}<span class="sc">${r.score || ""}</span></div>`;
  };
  const title = !p.title ? ""
    : `<div class="title-cut">${t().titleCut}: <b>${p.title}</b> · ${p.score >= p.title ? t().titleIn : t().titleLeft(p.title - p.score)}</div>`;
  $("runs").innerHTML = `<div class="runs-grid">${p.runs.map(row).join("")}</div>${title}`;
}

function visibleSites() {
  return SITES.filter(s => settings.links[s.id] && (s.scope === "char" || guildOf()));
}

function renderLinks() {
  const guild_ = guildOf() || { name: "", realm: "" };
  const c = { r: char.region, n: encodeURIComponent(char.name.trim()), lang: settings.lang,
              realm: blizzSlug(char.realm), rio: encodeURIComponent(slug(char.realm)),
              g: encodeURIComponent(guild_.name), guild: guild_.name,
              gRealm: blizzSlug(guild_.realm), gRio: encodeURIComponent(slug(guild_.realm)) };
  const sites = visibleSites();
  const item = (s, i) =>
    `<a class="link" href="${s.url(c)}" target="_blank" title="${siteName(s)}">
       <span class="tag" style="background:${s.color}">${s.tag}</span>
       <span class="name">${siteName(s)}</span><kbd>${i + 1}</kbd>
     </a>`;
  const char_ = sites.filter(s => s.scope === "char"), guild = sites.filter(s => s.scope === "guild");
  let html = "";
  if (char_.length) html += `<div class="section">${t().name}</div>` + char_.map(item).join("");
  if (guild.length) html += `<div class="section">${t().guild}</div>`
    + guild.map((s, i) => item(s, i + char_.length)).join("");
  $("links").innerHTML = html || `<p class="empty">${t().noLinks}</p>`;
  $("links").classList.toggle("no-kbd", !settings.shortcuts);
  $("links").classList.toggle("compact", settings.compact);
  const p = currentProfile();
  $("hint").textContent = p && p.notFound ? t().notFound
    : settings.shortcuts && sites.length ? t().hint(Math.min(sites.length, 9)) : VERSION;
}

function renderSettings() {
  const row = s => `<label class="opt">
      <span class="tag" style="background:${s.color}">${s.tag}</span>
      <span class="txt">${siteName(s)}</span>
      <span class="switch"><input type="checkbox" data-site="${s.id}" ${settings.links[s.id] ? "checked" : ""}><span></span></span>
    </label>`;
  $("charOpts").innerHTML = SITES.filter(s => s.scope === "char").map(row).join("");
  $("guildOpts").innerHTML = SITES.filter(s => s.scope === "guild").map(row).join("");
  $("background").checked = settings.background;
  $("shortcuts").checked = settings.shortcuts;
  $("compact").checked = settings.compact;
  $("faction").checked = settings.faction;
  $("hint").textContent = VERSION;
}

// ---------- Actions ----------
const saveSettings = () => chrome.storage.sync.set({ settings });
const open = url => chrome.tabs.create({ url, active: !settings.background });

$("settingsBtn").onclick = () => {
  if (view === "settings") show(prevView);
  else { prevView = view; show("settings"); }
};
$("done").onclick = () => show(prevView);
$("reset").onclick = () => { settings = defaults(); saveSettings(); applyLang(); show("settings"); };

$("lang").onclick = e => {
  const lang = e.target.dataset.lang;
  if (!lang) return;
  settings.lang = lang; saveSettings(); applyLang(); renderHeader(); renderSettings();
};
$("settings").addEventListener("change", e => {
  const el = e.target;
  if (el.dataset.site) settings.links[el.dataset.site] = el.checked;
  else if (["background", "shortcuts", "compact", "faction"].includes(el.id)) settings[el.id] = el.checked;
  saveSettings();
});

$("edit").onclick = () => show("config");

// The M+ chip expands the best keys panel; the choice is remembered
$("stats").addEventListener("click", e => {
  if (!e.target.closest(".toggle")) return;
  settings.runsOpen = !settings.runsOpen; saveSettings(); show(view);
});

$("copy").onclick = async () => {
  // In-game format: Name-Realm without spaces (works with /invite or /whisper)
  await navigator.clipboard.writeText(`${char.name.trim()}-${char.realm.trim().replace(/\s+/g, "")}`);
  $("hint").textContent = t().copied;
  setTimeout(() => view === "links" && renderLinks(), 1500);
};


// Plain click: honors the "open in background" option
$("links").addEventListener("click", e => {
  const a = e.target.closest(".link");
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault(); open(a.href);
});

// Forget the character and go back to an empty setup
$("removeChar").onclick = async () => {
  await chrome.storage.sync.remove("char");
  await chrome.storage.local.remove("profile");
  char = profile = null;
  $("realm").value = $("name").value = "";
  show("config");
};

$("save").onclick = () => {
  const c = { region: $("region").value, realm: $("realm").value.trim(), name: $("name").value.trim() };
  if (!c.realm || !c.name) { $("error").textContent = t().error; return; }
  const official = (REALMS[c.region] || []).find(r => realmKey(r) === realmKey(c.realm));
  if (official) c.realm = $("realm").value = official;
  $("error").textContent = "";
  chrome.storage.sync.set({ char: c }, () => { char = c; show("links"); refreshProfile(); });
};

// Realm suggestions while typing, filtered by the selected region.
// A custom list instead of <datalist>, which doesn't open by itself when results arrive late
let realmTimer, realmActive = -1;
const suggest = $("realmSuggest");
const suggestItems = () => [...suggest.children];

function closeSuggest() { suggest.hidden = true; suggest.innerHTML = ""; realmActive = -1; }

function highlight(i) {
  realmActive = i;
  suggestItems().forEach((li, j) => li.classList.toggle("on", j === i));
}

function pickRealm(name) { $("realm").value = name; closeSuggest(); $("name").focus(); }

$("realm").addEventListener("input", () => {
  clearTimeout(realmTimer);
  const term = $("realm").value.trim();
  if (!term) return closeSuggest();
  realmTimer = setTimeout(() => {
    const options = matchRealms(term, $("region").value).filter(r => realmKey(r) !== realmKey(term)).slice(0, 6);
    if (!options.length) return closeSuggest();
    suggest.innerHTML = options.map(r => `<li>${r.replace(/</g, "&lt;")}</li>`).join("");
    suggest.hidden = false;
    realmActive = -1;
  }, 60);
});

$("realm").addEventListener("keydown", e => {
  if (suggest.hidden) return;
  const n = suggestItems().length;
  if (e.key === "ArrowDown") { e.preventDefault(); highlight((realmActive + 1) % n); }
  else if (e.key === "ArrowUp") { e.preventDefault(); highlight((realmActive - 1 + n) % n); }
  else if (e.key === "Enter" && realmActive >= 0) {
    e.preventDefault(); e.stopPropagation(); // Pick the realm instead of saving the form
    pickRealm(suggestItems()[realmActive].textContent);
  } else if (e.key === "Escape") { e.preventDefault(); closeSuggest(); }
});

// mousedown runs before the input's blur, so the click isn't lost
suggest.addEventListener("mousedown", e => {
  const li = e.target.closest("li");
  if (li) { e.preventDefault(); pickRealm(li.textContent); }
});
$("realm").addEventListener("blur", closeSuggest);
$("region").addEventListener("change", closeSuggest);

// Enter saves from any field
$("config").addEventListener("keydown", e => { if (e.key === "Enter") $("save").click(); });

// ---------- Player lookup ----------
// "Name-Realm" as copied in game ("Nezvi-MoonGuard"), or just "Name" for someone on your own realm
function parsePlayer(text) {
  const raw = text.trim().replace(/\s+/g, " ");
  const dash = raw.indexOf("-");
  const name = (dash < 0 ? raw : raw.slice(0, dash)).trim();
  const realmText = dash < 0 ? "" : raw.slice(dash + 1).trim();
  if (!name) return null;
  if (!realmText) return char ? { name, region: char.region, realm: char.realm } : { error: t().lookupNeedRealm };
  // Your own region first, so realms that exist in several regions resolve to yours
  const home = char ? char.region : "us";
  for (const region of [home, ...Object.keys(REALMS).filter(r => r !== home)]) {
    const realm = REALMS[region].find(r => realmKey(r) === realmKey(realmText));
    if (realm) return { name, region, realm };
  }
  return { error: t().lookupNoRealm(realmText) };
}

function toggleLookup(open = $("lookup").hidden) {
  $("lookup").hidden = !open;
  $("searchBtn").classList.toggle("active", open);
  $("lookupError").hidden = true;
  if (open) { $("lookupInput").focus(); renderRecent(); } else $("lookupInput").value = "";
}

// Last 5 players you looked up, kept only in this browser
const playerKey = p => [p.region, slug(p.realm), p.name.toLowerCase()].join("/");

async function rememberPlayer(p) {
  const { recent = [] } = await chrome.storage.local.get("recent");
  const entry = { name: p.name, region: p.region, realm: p.realm };
  await chrome.storage.local.set({ recent: [entry, ...recent.filter(r => playerKey(r) !== playerKey(p))].slice(0, 5) });
}

async function renderRecent() {
  const { recent = [] } = await chrome.storage.local.get("recent");
  $("recent").hidden = !recent.length;
  $("recent").innerHTML = !recent.length ? "" :
    `<div class="recent-head"><span>${t().recent}</span><button id="clearRecent">${t().clear}</button></div>`
    + recent.map((r, i) => `<button class="recent-item" data-i="${i}">
        <span>${esc(r.name)}</span><small>${esc(r.realm)} · ${r.region.toUpperCase()}</small></button>`).join("");
}

// Save to the history first: opening a tab in the foreground closes the popup
async function openPlayer(p) {
  await rememberPlayer(p);
  chrome.tabs.create({ url: `https://raider.io/characters/${p.region}/${encodeURIComponent(slug(p.realm))}/${encodeURIComponent(p.name)}` });
}

function lookup() {
  const p = parsePlayer($("lookupInput").value);
  if (!p) return;
  if (p.error) { $("lookupError").textContent = p.error; $("lookupError").hidden = false; return; }
  $("lookupInput").value = "";
  openPlayer(p);
}

$("recent").addEventListener("click", async e => {
  if (e.target.closest("#clearRecent")) { await chrome.storage.local.remove("recent"); return renderRecent(); }
  const item = e.target.closest(".recent-item");
  if (!item) return;
  const { recent = [] } = await chrome.storage.local.get("recent");
  if (recent[item.dataset.i]) openPlayer(recent[item.dataset.i]);
});

$("searchBtn").onclick = () => toggleLookup();
$("lookupInput").addEventListener("keydown", e => {
  if (e.key === "Enter") lookup();
  if (e.key === "Escape" && !$("lookupInput").value) { e.preventDefault(); toggleLookup(false); }
});
// Pasting opens Raider.io right away, no Enter needed
$("lookupInput").addEventListener("paste", () => setTimeout(lookup));
$("lookupInput").addEventListener("input", () => { $("lookupError").hidden = true; });
// Ctrl+V anywhere in the popup (outside other fields) looks up the pasted name, even with the box folded
document.addEventListener("paste", e => {
  if (view === "settings" || e.target.tagName === "INPUT") return;
  e.preventDefault();
  toggleLookup(true);
  $("lookupInput").value = e.clipboardData.getData("text");
  lookup();
});

// Shortcuts: keys 1–9 open the matching link
document.addEventListener("keydown", e => {
  if (view !== "links" || !settings.shortcuts) return;
  // Digits are shortcuts unless you're typing in a field (an empty lookup box still counts as not typing)
  if (e.target.tagName === "INPUT" && (e.target.id !== "lookupInput" || e.target.value)) return;
  const a = document.querySelectorAll(".link")[Number(e.key) - 1];
  if (a) { e.preventDefault(); open(a.href); }
});

// ---------- Startup ----------
$("donate").href = DONATE_URL;
chrome.storage.sync.get(["char", "settings"], async data => {
  const d = defaults();
  // Merge with defaults so newly added sites show up with their default value
  settings = { ...d, ...data.settings, links: { ...d.links, ...(data.settings && data.settings.links) } };
  char = data.char || null;
  // Show the cached profile right away, then refresh it from Raider.io
  ({ profile = null } = await chrome.storage.local.get("profile"));
  if (char) ["region", "realm", "name"].forEach(k => $(k).value = char[k] || "");
  applyLang();
  show(char ? "links" : "config");
  refreshProfile();
});
