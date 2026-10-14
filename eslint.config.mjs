/**
 * Flat config (ESLint 9). The ignore list is read from .gitignore rather than
 * retyped, so a generated directory can't be linted by accident.
 */
import { readFileSync } from "node:fs";
import next from "eslint-config-next/core-web-vitals";

const gitignored = readFileSync(new URL(".gitignore", import.meta.url), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#") && !line.startsWith("!"))
  .map((line) => (line.endsWith("/") ? `${line}**` : line));

const config = [{ ignores: [...gitignored] }, ...next];

export default config;
