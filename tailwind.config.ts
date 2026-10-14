import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./standalone/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS vars so light and dark resolve as a set.
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        raised: "rgb(var(--raised) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-2": "rgb(var(--ink-2) / <alpha-value>)",
        "ink-3": "rgb(var(--ink-3) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-ink": "rgb(var(--accent-ink) / <alpha-value>)",
        // Spine regions. Same order as the wall posters patients already know:
        // cervical, thoracic, lumbar, sacrum, coccyx.
        cervical: "rgb(var(--cervical) / <alpha-value>)",
        thoracic: "rgb(var(--thoracic) / <alpha-value>)",
        lumbar: "rgb(var(--lumbar) / <alpha-value>)",
        sacral: "rgb(var(--sacral) / <alpha-value>)",
        coccyx: "rgb(var(--coccyx) / <alpha-value>)",
        good: "rgb(var(--good) / <alpha-value>)",
        warn: "rgb(var(--warn) / <alpha-value>)",
        bad: "rgb(var(--bad) / <alpha-value>)",
        // Autonomic systems and anatomy figures.
        symp: "rgb(var(--symp) / <alpha-value>)",
        parasymp: "rgb(var(--parasymp) / <alpha-value>)",
        bone: "rgb(var(--bone) / <alpha-value>)",
        nerve: "rgb(var(--nerve) / <alpha-value>)",
        disc: "rgb(var(--disc) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
};
export default config;
