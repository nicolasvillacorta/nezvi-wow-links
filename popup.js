const $ = id => document.getElementById(id);
// Sites expect the realm lowercase, hyphenated and without apostrophes
const slug = s => s.trim().toLowerCase().replace(/'/g, "").replace(/\s+/g, "-");

// Replace with your donation link (Cafecito, Ko-fi, PayPal, etc.)
const DONATE_URL = "https://cafecito.app/nezvi";
const VERSION = "v" + chrome.runtime.getManifest().version;

const T = {
  es: {
    setup: "Configurá tu personaje", region: "Región", realm: "Reino", realmPh: "ej: Ragnaros",
    name: "Personaje", namePh: "Nombre", guild: "Guild", optional: "(opcional)", guildPh: "Nombre de la guild",
    save: "Guardar", error: "Completá el reino y el personaje.", openAll: "Abrir todos",
    language: "Idioma", charLinks: "Links del personaje", guildLinks: "Links de la guild",
    prefs: "Preferencias", background: "Abrir links en segundo plano", shortcuts: "Mostrar atajos de teclado",
    done: "Listo", reset: "Restablecer opciones", donate: "Invitame un café", settings: "Opciones",
    copy: "Copiar Nombre-Reino", edit: "Cambiar personaje", copied: "¡Copiado!",
    hint: n => `Tip: usá las teclas 1–${n}`, noLinks: "No hay links activos. Activalos en ⚙.",
    armory: "Armería",
  },
  en: {
    setup: "Set up your character", region: "Region", realm: "Realm", realmPh: "e.g. Ragnaros",
    name: "Character", namePh: "Name", guild: "Guild", optional: "(optional)", guildPh: "Guild name",
    save: "Save", error: "Enter a realm and a character.", openAll: "Open all",
    language: "Language", charLinks: "Character links", guildLinks: "Guild links",
    prefs: "Preferences", background: "Open links in background", shortcuts: "Show keyboard shortcuts",
    done: "Done", reset: "Reset options", donate: "Buy me a coffee", settings: "Options",
    copy: "Copy Name-Realm", edit: "Change character", copied: "Copied!",
    hint: n => `Tip: press keys 1–${n}`, noLinks: "No links enabled. Turn them on in ⚙.",
    armory: "Armory",
  },
};

// Armory locale based on language and region
const armoryLocale = (lang, r) => lang === "es" ? (r === "us" ? "es-mx" : "es-es") : (r === "eu" ? "en-gb" : "en-us");

// Available sites. on = enabled by default on install
const SITES = [
  { id: "rio", scope: "char", tag: "RIO", color: "#e8762b", name: "Raider.io", on: true,
    url: c => `https://raider.io/characters/${c.r}/${c.realm}/${c.n}` },
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
    url: c => `https://raider.io/guilds/${c.r}/${c.realm}/${c.g}` },
  { id: "g-wcl", scope: "guild", tag: "WCL", color: "#a3742c", name: "Warcraft Logs", on: true,
    url: c => `https://www.warcraftlogs.com/guild/${c.r}/${c.realm}/${c.g}` },
  { id: "g-wp", scope: "guild", tag: "WP", color: "#4b8f3a", name: "WoWProgress", on: false,
    url: c => `https://www.wowprogress.com/guild/${c.r}/${c.realm}/${c.g}` },
  { id: "g-armory", scope: "guild", tag: "ARM", color: "#1f6fd1", name: t => t.armory, on: false,
    url: c => `https://worldofwarcraft.blizzard.com/${armoryLocale(c.lang, c.r)}/guild/${c.r}/${c.realm}/${slug(c.guild)}` },
];

const defaults = () => ({
  lang: (chrome.i18n.getUILanguage() || "es").startsWith("es") ? "es" : "en",
  links: Object.fromEntries(SITES.map(s => [s.id, s.on])),
  background: false,
  shortcuts: true,
});

let settings = defaults();
let char = null;
let view = "config"; // config | links | settings
let prevView = "config";
const t = () => T[settings.lang];
const siteName = s => typeof s.name === "function" ? s.name(t()) : s.name;

// ---------- Text ----------
function applyLang() {
  document.documentElement.lang = settings.lang;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t()[el.dataset.i18n]);
  document.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t()[el.dataset.i18nPh]);
  $("copy").title = t().copy; $("edit").title = t().edit; $("settingsBtn").title = t().settings;
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
  if (v === "config") { $("hint").textContent = VERSION; $("realm").focus(); }
}

function renderHeader() {
  if (!char) {
    $("crest").textContent = "N"; $("title").textContent = "Nezvi WoW"; $("subtitle").textContent = t().setup;
    return;
  }
  const name = char.name.trim(), guild = char.guild.trim();
  $("crest").textContent = name[0].toUpperCase();
  $("title").textContent = name;
  $("subtitle").textContent = `${char.realm.trim()} · ${char.region.toUpperCase()}` + (guild ? ` · <${guild}>` : "");
}

function visibleSites() {
  return SITES.filter(s => settings.links[s.id] && (s.scope === "char" || char.guild.trim()));
}

function renderLinks() {
  const c = { r: char.region, realm: slug(char.realm), n: encodeURIComponent(char.name.trim()),
              g: encodeURIComponent(char.guild.trim()), guild: char.guild, lang: settings.lang };
  const sites = visibleSites();
  const item = (s, i) =>
    `<a class="link" href="${s.url(c)}" target="_blank">
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
  $("openAll").hidden = sites.length < 2;
  $("hint").textContent = settings.shortcuts && sites.length
    ? t().hint(Math.min(sites.length, 9)) : VERSION;
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
  else if (el.id === "background" || el.id === "shortcuts") settings[el.id] = el.checked;
  saveSettings();
});

$("edit").onclick = () => show("config");

$("copy").onclick = async () => {
  // In-game format: Name-Realm without spaces (works with /invite or /whisper)
  await navigator.clipboard.writeText(`${char.name.trim()}-${char.realm.trim().replace(/\s+/g, "")}`);
  $("hint").textContent = t().copied;
  setTimeout(() => view === "links" && renderLinks(), 1500);
};

$("openAll").onclick = () => document.querySelectorAll(".link").forEach(a => open(a.href));

// Plain click: honors the "open in background" option
$("links").addEventListener("click", e => {
  const a = e.target.closest(".link");
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault(); open(a.href);
});

$("save").onclick = () => {
  const c = { region: $("region").value, realm: $("realm").value,
              name: $("name").value, guild: $("guild").value };
  if (!c.realm.trim() || !c.name.trim()) { $("error").textContent = t().error; return; }
  $("error").textContent = "";
  chrome.storage.sync.set({ char: c }, () => { char = c; show("links"); });
};

// Enter saves from any field
$("config").addEventListener("keydown", e => { if (e.key === "Enter") $("save").click(); });

// Shortcuts: keys 1–9 open the matching link
document.addEventListener("keydown", e => {
  if (view !== "links" || !settings.shortcuts) return;
  const a = document.querySelectorAll(".link")[Number(e.key) - 1];
  if (a) open(a.href);
});

// ---------- Startup ----------
$("donate").href = DONATE_URL;
chrome.storage.sync.get(["char", "settings"], data => {
  const d = defaults();
  // Merge with defaults so newly added sites show up with their default value
  settings = { ...d, ...data.settings, links: { ...d.links, ...(data.settings && data.settings.links) } };
  char = data.char || null;
  if (char) Object.keys(char).forEach(k => $(k).value = char[k]);
  applyLang();
  show(char ? "links" : "config");
});
