export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: "https://rahulengineerings.com/sitemap.xml",
    host: "https://rahulengineerings.com",
  };
}
