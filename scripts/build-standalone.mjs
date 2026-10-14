#!/usr/bin/env node
/**
 * Builds RootAtlas as one self-contained HTML file: every page, both
 * languages, the CSS and the JavaScript inline, no network needed.
 *
 *   npm run standalone              # dist-standalone/rootatlas.html (a full document)
 *   npm run standalone -- --fragment   # body content only, for hosts that add their own <html> wrapper
 *
 * The Next.js build stays the real site. This file exists for the places a
 * folder of static pages can't go: an email attachment, a phone with no
 * signal, or a preview that hosts a single page. It renders the same
 * components; only next/link and next/navigation are swapped for an
 * in-memory router (standalone/shims).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build, transform } from "esbuild";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const ROOT = process.cwd();
const OUT = join(ROOT, "dist-standalone");
const fragment = process.argv.includes("--fragment");

const js = await build({
  entryPoints: [join(ROOT, "standalone/main.tsx")],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  minify: true,
  jsx: "automatic",
  legalComments: "none",
  logLevel: "warning",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: {
    "next/link": join(ROOT, "standalone/shims/link.tsx"),
    "next/navigation": join(ROOT, "standalone/shims/navigation.ts")
  },
  metafile: true
});

// Every page in the nav must be routable here, or the file has dead links.
const app = readFileSync(join(ROOT, "standalone/App.tsx"), "utf8");
const nav = readFileSync(join(ROOT, "lib/nav.ts"), "utf8");
const slugs = [...nav.matchAll(/slug: "([a-z-]*)"/g)].map((m) => m[1]);
const missing = slugs.filter((s) => !app.includes(s === "" ? '"": {' : `${s.includes("-") ? `"${s}"` : s}: {`));
if (missing.length) {
  console.error(`standalone/App.tsx has no page for: ${missing.map((s) => s || "(home)").join(", ")}`);
  process.exit(1);
}

const css = await postcss([tailwindcss({ config: join(ROOT, "tailwind.config.ts") }), autoprefixer]).process(
  readFileSync(join(ROOT, "app/globals.css"), "utf8"),
  { from: join(ROOT, "app/globals.css") }
);
const minCss = (await transform(css.css, { loader: "css", minify: true })).code;

// Inline scripts end at the first "</script" the HTML parser sees, even inside
// a JS string, so escape it. "<\/" is the same string to JavaScript.
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
if (script.includes("<!--")) console.warn("note: bundle contains '<!--'; check the file renders");

const body = `<div id="root"></div>
<noscript><p style="padding:16px">RootAtlas needs JavaScript to run. / RootAtlas necesita JavaScript.</p></noscript>
<script>${script}</script>`;

// Hosts that wrap the page set the body to 14px; the site is designed at 16px.
// A fragment goes into an embedded viewer, which blocks downloads and
// printing: hide the buttons that would do nothing there.
const embedOnly = fragment ? "[data-embed-hide]{display:none!important}" : "";
const styles = `<style>${minCss}</style>\n<style>body{font-size:16px;margin:0}${embedOnly}</style>`;

const html = fragment
  ? `<title>RootAtlas</title>\n${styles}\n${body}\n`
  : `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>RootAtlas</title>
${styles}
</head>
<body>
${body}
</body>
</html>
`;

mkdirSync(OUT, { recursive: true });
const file = join(OUT, fragment ? "rootatlas-fragment.html" : "rootatlas.html");
writeFileSync(file, html);
console.log(`${file}  ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB (JS ${(script.length / 1024).toFixed(0)} KB, CSS ${(minCss.length / 1024).toFixed(0)} KB)`);
