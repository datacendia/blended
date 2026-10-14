# RootAtlas

Bilingual (EN/ES) static site for people in chiropractic, physio or
osteopathic care: spine explorer, body map, posture-report decoder, outcome
tracker, warning signs, who-to-see, evidence board. Next.js 16 App Router with
`output: "export"`, TypeScript strict, Tailwind via CSS-variable tokens.

## Rules that matter

**No server, ever, for health data.** Everything a person types stays in their
browser (`lib/storage.ts`, read through `components/useStored.ts` with
`useSyncExternalStore`). Do not add analytics, third-party scripts or a backend
that receives scores; `netlify.toml` ships a CSP that would block them anyway.

**Both languages or neither.** Every phrase is an `L` (`{ en, es }`) in `lib/`.
Components hold no strings; `__tests__/safety.test.ts` fails on an inline
`en: "..."` under `app/` or `components/`. `__tests__/bilingual.test.ts` walks
every structure and checks both sides exist, share `{placeholders}`, and
aren't identical copy-paste. Spanish uses Peruvian usage (D1-D12 for thoracic,
"tecnólogo médico en terapia física", soles as `S/`).

**Every claim has a source.** Add the citation to `lib/sources.ts` first,
then cite its id. No DOIs or URLs: a wrong DOI looks authoritative. Tests
reject uncited treatments, unknown ids and sources nobody cites.

**Never diagnose.** Results say "commonly associated with". Warning signs err
toward sending people to a doctor. Thresholds (MCID, trial window, agreement
bands) are named constants with the reasoning beside them — change them on
purpose, with the source.

**Anatomy is pinned by tests.** Seven cervical vertebrae, eight cervical roots;
C1-C7 exit above their vertebra, C8 below C7, everything after below its own.
`__tests__/anatomy.test.ts` holds these.

## Commands

```
npm run validate   # typecheck + lint + tests — before every commit
npm run build      # static site → out/
npm run verify     # drive out/ in Chromium, both languages, 390px and 1280px
npm run standalone && npm run verify:standalone   # the one-file build, driven
```

Page bodies live in `components/pages/` so the Next routes and the single-file
build (`standalone/`) render the same components. A new page needs its
`app/[locale]/<slug>/page.tsx`, an entry in `lib/nav.ts`, and an entry in
`standalone/App.tsx` (the standalone build fails without it). Mark it
`primary` in `lib/nav.ts` only if it belongs in the desktop header (seven
fit). The guides under `who-to-see/<id>/` (professions and practices, listed
in `GUIDE_PAGES`) are the one nested route; the standalone router reads the
same list. Components may
use `next/link` and `usePathname` only; anything else from Next needs a shim.

## Conventions

- Comments explain why, especially where the obvious approach is wrong.
- Money as `formatMoney` (`S/ 86.11`); `tnum` for numbers in columns.
- Both colour schemes always; chart colours are validated, not eyeballed.
- `AGENTS.md` is written by `next dev`; keep it committed.
