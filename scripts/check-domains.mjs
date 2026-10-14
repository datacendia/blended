#!/usr/bin/env node
/**
 * Checks whether candidate domains are registered, using RDAP — the registries'
 * own lookup service, not a reseller that might front-run the search.
 *
 *   npm run check-domains                       # the shortlist below
 *   npm run check-domains -- rootatlas.app foo.com
 *
 * 404 from the registry means unregistered. Always confirm at a registrar
 * before paying: availability changes hourly and premium names can be
 * unregistered yet still cost far more than list price.
 */
const SHORTLIST = [
  "rootatlas.com", "rootatlas.app", "rootatlas.health", "rootatlas.pe",
  "atlasroot.com", "raizatlas.com", "nervemap.app", "spinecheck.app",
  "c1tococcyx.com", "isitworking.health", "ajustometro.com", "provecare.app"
];

// .com and .net go straight to Verisign. Everything else goes via rdap.org,
// which redirects to whichever registry IANA's bootstrap list names — safer
// than hard-coding endpoints that registries move.
const RDAP = {
  com: "https://rdap.verisign.com/com/v1/domain/",
  net: "https://rdap.verisign.com/net/v1/domain/"
};

async function check(domain) {
  const tld = domain.split(".").pop();
  const url = `${RDAP[tld] ?? "https://rdap.org/domain/"}${domain}`;
  try {
    const res = await fetch(url, { redirect: "follow", headers: { accept: "application/rdap+json" } });
    if (res.status === 404) return { domain, status: "available" };
    if (res.ok) {
      const body = await res.json();
      const created = body.events?.find((e) => e.eventAction === "registration")?.eventDate?.slice(0, 10);
      return { domain, status: "taken", detail: created ? `registered ${created}` : "" };
    }
    return { domain, status: "unknown", detail: `HTTP ${res.status}` };
  } catch (error) {
    return { domain, status: "unknown", detail: String(error.cause?.code ?? error.message) };
  }
}

const domains = process.argv.slice(2).length ? process.argv.slice(2) : SHORTLIST;
const results = await Promise.all(domains.map(check));
const width = Math.max(...results.map((r) => r.domain.length));
for (const r of results) {
  const mark = r.status === "available" ? "✓" : r.status === "taken" ? "✗" : "?";
  console.log(`${mark} ${r.domain.padEnd(width)}  ${r.status}${r.detail ? `  (${r.detail})` : ""}`);
}
if (results.some((r) => r.status === "unknown")) {
  console.log("\n? = the registry could not be reached from this network. .pe has no public RDAP; check punto.pe directly.");
}
