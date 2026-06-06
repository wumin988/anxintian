export default function sitemap() {
  const now = new Date();

  return [
    "/",
    "/products",
    "/traceability",
    "/membership",
    "/trust",
    "/about",
    "/join",
    "/admin"
  ].map((path) => ({
    url: `http://localhost:3000${path}`,
    lastModified: now
  }));
}
