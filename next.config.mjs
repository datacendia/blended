/**
 * Static export, on purpose. Everything a person types into RootAtlas is health
 * data, and the cheapest way to never leak it is to never receive it: there is
 * no server, no database and no account. Pages are HTML files; the tracker and
 * report decoder keep their data in the browser that typed it.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true }
};
export default nextConfig;
