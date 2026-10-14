# RootAtlas

**Your spine, your nerves, your evidence.** An interactive, bilingual (EN/ES)
guide for anyone in chiropractic, physiotherapy or osteopathic care — built
from one real case: a trapped nerve in the neck, 18 chiropractic adjustments
prepaid for S/ 1,550, and a five-page posture report nobody explained.

It answers three questions a patient can check for themselves:

1. **Which nerve, and how would anyone know?** — tap where you feel it; see the
   roots that usually serve that area and what a proper exam checks.
2. **Do these posture numbers mean anything?** — enter the scan; RootAtlas checks
   the report against itself and gives its real margin of error.
3. **Is this working, or just costing?** — weekly pain and function scores,
   judged against published thresholds, with cost per point of improvement and
   checkpoints that say when to ask questions.

Working name. The domain shortlist is unverified — see [Domains](#domains).

## Pages

| Route | What it does |
|---|---|
| `/en/spine/` | C1 to coccyx along the real S-curve. Tap a vertebra or root: exits, disc levels, what each root supplies, autonomic wiring (with an honest caveat). Region zoom for phones. Spanish shows D1-D12, as Lima clinic posters do. |
| `/en/map/` | Front, back and hand. Tap areas by side and pick symptoms; roots ranked by fit; saddle numbness, both-sided symptoms and weakness escalate. "Did your clinician check these?" exam checklist. |
| `/en/report/` | PostureScreen-style decoder. Right-vs-left and front-vs-back photo agreement, the scan's own noise floor, averages that add opposite shifts, the "effective head weight" model, re-scan comparison against noise. |
| `/en/tracker/` | Plan, weekly check-ins, MCID-based verdicts, progress chart, cost per session and per point, proactive checkpoints, export/import, print for clinician. |
| `/en/warning-signs/` | Red-flag triage: emergency / within 1-2 days / coming weeks, with why each matters. |
| `/en/who-to-see/` | GP, physiatrist, physio, chiropractor, osteopath, neurologist, surgeon, massage — who can diagnose, prescribe, order scans. Questions to ask any of them. |
| `/en/what-works/` | 13 treatments graded Supported / May help / Unclear / Not supported, each with harms and sources. |
| `/en/about/` | Scope, privacy, how evidence is chosen, every source. |

Every route exists under `/es/` too. `/` sends a Spanish browser to `/es/`.

## What the sample report shows

The report decoder ships with the real (anonymised) PostureScreen report that
started this. Run against itself, it shows:

- The two side photos disagree on **direction** for the shoulder (4.75 cm back vs
  1.12 cm forward) and the hip (4.02 cm forward vs 0.87 cm back).
- The printed "averaged" shoulder value, 2.93 cm, is the average of the two
  **sizes**. Keeping direction, it is about 1.8 cm backward.
- The right-photo total is 20.6 cm, the left 11.3 cm — the same person, minutes
  apart. Median photo-to-photo gap: **±1.9 cm**, which is larger than most
  changes a re-scan could show.

`__tests__/posture.test.ts` pins all of this.

## Architecture decisions

- **Static export, no server.** Everything typed is health data. No server means
  no breach surface, no account, no data-protection registration for v1.
  Storage is `localStorage` via `useSyncExternalStore`, with an in-memory
  fallback when a browser blocks storage. Export/import is zod-validated.
- **Both languages or neither.** All copy lives in `lib/` as `{ en, es }`. A
  compile-time type check and `__tests__/bilingual.test.ts` (700+ pairs) reject
  a missing side, mismatched `{placeholders}`, or an untranslated copy-paste.
- **Every claim has a source.** `lib/sources.ts` holds 20 citations; tests fail
  if a treatment has none, cites an unknown id, or a source is cited nowhere.
- **Guarantees are structural.** Tests ban `dangerouslySetInnerHTML` and inline
  phrases in components, and check that pages and the nav agree.
- **Thresholds are named, not buried.** MCIDs (`mcidFor`), the trial-of-care
  window (`TRIAL_SESSIONS`, `TRIAL_DAYS`) and the agreement bands in
  `lib/posture.ts` are constants with the reasoning beside them.

## Commands

```
npm install
npm run dev              # http://localhost:3000
npm run validate         # typecheck + lint + 717 tests
npm run build            # static site in out/
npm run verify           # drives out/ in Chromium: 36 renders + 12 tool checks
npm run check-domains    # RDAP lookups for the name shortlist
```

`verify` uses Playwright's Chromium; set `CHROMIUM_PATH` to use another.

## Deploying

Netlify: `netlify.toml` builds and publishes `out/`, with a strict CSP and no
third-party scripts. Any static host works.

## Domains

Not verified. The build environment's network blocked the registries' RDAP
endpoints, so no availability claim is made here. Run `npm run check-domains`
locally and confirm at a registrar before buying.

## Known limits

- Evidence summaries are written from the cited sources but **have not been
  reviewed by a licensed clinician**. That review is a launch blocker.
- Dermatome maps vary between sources and people; results say "commonly
  associated with", never "you have".
- The tracker's verdict is about change, not cause: most nerve-root problems
  improve with time whatever the treatment, and the app says so.
