// Raider.io helpers shared by the popup and the background worker

// Realm slugs: lowercase, hyphenated, without apostrophes or parentheses.
// Raider.io keeps accents ("aggra-português"); Blizzard and most other sites drop them ("aggra-portugues")
const slug = s => s.trim().toLowerCase().replace(/['()]/g, "").replace(/\s+/g, "-");
const blizzSlug = s => slug(s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
const charKey = c => [c.region, slug(c.realm), c.name.trim().toLowerCase()].join("/");

const RIO = "https://raider.io/api";
const DAY = 24 * 60 * 60 * 1000;

// JSON from the API, kept in local storage for maxAge. Falls back to the stale copy on errors
async function cachedJson(key, url, maxAge) {
  const { [key]: hit } = await chrome.storage.local.get(key);
  if (hit && Date.now() - hit.fetched < maxAge) return hit.data;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    await chrome.storage.local.set({ [key]: { fetched: Date.now(), data } });
    return data;
  } catch (e) {
    if (hit) return hit.data;
    throw e;
  }
}

// Newest expansion the character has raid progress in
const expansionOf = progress => Math.max(0, ...Object.values(progress || {}).map(p => p.expansion_id));

// Progress in the current raid: the one running now in the region with the most bosses
async function currentRaid(progress, region, expansion) {
  if (!expansion) return "";
  const { raids = [] } = await cachedJson("raidCache", `${RIO}/v1/raiding/static-data?expansion_id=${expansion}`, DAY);
  const now = Date.now();
  const live = raids
    .filter(r => progress[r.slug] && new Date(r.starts[region]) <= now && now < new Date(r.ends[region]))
    .sort((a, b) => b.encounters.length - a.encounters.length)[0];
  const summary = live && progress[live.slug].summary;
  return summary ? `${live.short_name} ${summary}` : "";
}

// Best run per season dungeon, including dungeons not done yet (level 0)
async function seasonRuns(bestRuns, season, expansion) {
  const runs = (bestRuns || []).map(r => ({
    d: r.short_name, name: r.dungeon, lvl: r.mythic_level, up: r.num_keystone_upgrades, score: Math.round(r.score),
  }));
  if (expansion && season) {
    const { seasons = [] } = await cachedJson("mplusCache", `${RIO}/v1/mythic-plus/static-data?expansion_id=${expansion}`, DAY);
    const s = seasons.find(x => x.slug === season);
    for (const d of s ? s.dungeons : []) {
      if (!runs.some(r => r.d === d.short_name)) runs.push({ d: d.short_name, name: d.name, lvl: 0, up: 0, score: 0 });
    }
  }
  return runs.sort((a, b) => b.score - a.score || a.d.localeCompare(b.d));
}

// Minimum score of the top 0.1% in the region, which is what the season title requires
async function titleScore(season, region) {
  const d = await cachedJson(`cutoff:${season}:${region}`, `${RIO}/v1/mythic-plus/season-cutoffs?season=${season}&region=${region}`, DAY);
  const p = (d.cutoffs || d).p999;
  return p && p.all ? Math.round(p.all.quantileMinValue) : 0;
}

// Great Vault Mythic+ row: runs this week (timed or not) and the key level behind each reward,
// which come from your 1st, 4th and 8th highest runs of the week
function vaultOf(weekly) {
  const levels = (weekly || []).map(r => r.mythic_level).sort((a, b) => b - a);
  return { done: levels.length, slots: [levels[0] || 0, levels[3] || 0, levels[7] || 0] };
}

// Character profile. Returns null on network errors so callers keep the cached one
async function fetchProfile(c) {
  const key = charKey(c);
  const q = new URLSearchParams({
    region: c.region, realm: slug(c.realm), name: c.name.trim(),
    fields: "guild,gear,raid_progression,mythic_plus_scores_by_season:current,mythic_plus_best_runs,mythic_plus_weekly_highest_level_runs",
  });
  try {
    const res = await fetch(`${RIO}/v1/characters/profile?${q}`);
    if (!res.ok) return { key, notFound: res.status === 400 || res.status === 404 };
    const d = await res.json();
    const season = (d.mythic_plus_scores_by_season || [])[0];
    const expansion = expansionOf(d.raid_progression);
    // Extras are optional: if one of them fails, show the rest
    const safe = (p, fallback) => p.catch(() => fallback);
    const [raid, runs, title] = await Promise.all([
      safe(currentRaid(d.raid_progression, c.region, expansion), ""),
      safe(seasonRuns(d.mythic_plus_best_runs, season && season.season, expansion), []),
      season ? safe(titleScore(season.season, c.region), 0) : 0,
    ]);
    return {
      key,
      guild: d.guild ? d.guild.name : "", guildRealm: d.guild ? d.guild.realm : "",
      cls: d.class, thumb: d.thumbnail_url, faction: d.faction,
      score: season ? Math.round(season.scores.all) : 0,
      scoreColor: season && season.segments ? season.segments.all.color : "",
      ilvl: d.gear ? Math.floor(d.gear.item_level_equipped) : 0,
      raid, runs, title,
      vault: vaultOf(d.mythic_plus_weekly_highest_level_runs),
    };
  } catch { return null; }
}
