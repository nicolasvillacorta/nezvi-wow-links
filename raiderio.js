// Raider.io helpers shared by the popup and the background worker

// Sites expect the realm lowercase, hyphenated and without apostrophes
const slug = s => s.trim().toLowerCase().replace(/'/g, "").replace(/\s+/g, "-");
const charKey = c => [c.region, slug(c.realm), c.name.trim().toLowerCase()].join("/");

const RIO = "https://raider.io/api";
const DAY = 24 * 60 * 60 * 1000;

// Raids of an expansion with their per-region start/end dates, cached for a day
async function raidData(expansion) {
  const { raidCache } = await chrome.storage.local.get("raidCache");
  if (raidCache && raidCache.expansion === expansion && Date.now() - raidCache.fetched < DAY) return raidCache.raids;
  const res = await fetch(`${RIO}/v1/raiding/static-data?expansion_id=${expansion}`);
  if (!res.ok) return raidCache ? raidCache.raids : [];
  const raids = (await res.json()).raids || [];
  await chrome.storage.local.set({ raidCache: { expansion, fetched: Date.now(), raids } });
  return raids;
}

// Progress in the current raid: the one running now in the region with the most bosses
async function currentRaid(progress, region) {
  const entries = Object.entries(progress || {});
  if (!entries.length) return "";
  const expansion = Math.max(...entries.map(([, p]) => p.expansion_id));
  const now = Date.now();
  const live = (await raidData(expansion))
    .filter(r => progress[r.slug] && new Date(r.starts[region]) <= now && now < new Date(r.ends[region]))
    .sort((a, b) => b.encounters.length - a.encounters.length)[0];
  const summary = live && progress[live.slug].summary;
  return summary ? `${live.short_name} ${summary}` : "";
}

// Character profile. Returns null on network errors so callers keep the cached one
async function fetchProfile(c) {
  const key = charKey(c);
  const q = new URLSearchParams({
    region: c.region, realm: slug(c.realm), name: c.name.trim(),
    fields: "guild,gear,raid_progression,mythic_plus_scores_by_season:current",
  });
  try {
    const res = await fetch(`${RIO}/v1/characters/profile?${q}`);
    if (!res.ok) return { key, notFound: res.status === 400 || res.status === 404 };
    const d = await res.json();
    const season = (d.mythic_plus_scores_by_season || [])[0];
    let raid = "";
    try { raid = await currentRaid(d.raid_progression, c.region); } catch {}
    return {
      key,
      guild: d.guild ? d.guild.name : "", guildRealm: d.guild ? d.guild.realm : "",
      cls: d.class, thumb: d.thumbnail_url,
      score: season ? Math.round(season.scores.all) : 0,
      scoreColor: season && season.segments ? season.segments.all.color : "",
      ilvl: d.gear ? Math.floor(d.gear.item_level_equipped) : 0,
      raid,
    };
  } catch { return null; }
}

// Realm suggestions for a region. Uses Raider.io's site search (undocumented), so failures just mean no suggestions
async function searchRealms(term, region) {
  try {
    const res = await fetch(`${RIO}/search?term=${encodeURIComponent(term)}`);
    if (!res.ok) return [];
    const { matches = [] } = await res.json();
    return [...new Set(matches
      .filter(m => m.type === "realm" && m.data.region.slug === region)
      .map(m => m.data.realm.name))];
  } catch { return []; }
}
