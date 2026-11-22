import { useEffect } from "react";

const SITE_URL = "https://hastnirmit.netlify.app";
const DEFAULT_IMAGE = `${SITE_URL}/images/hastnirmit_logo.png`;

function upsertMeta(selector, attrName, attrValue, content) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function SEO({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noIndex = false,
  schema = null,
}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Hastnirmit`
      : "Hastnirmit | Handmade Jewellery, Gifts & Custom Crafts";
    const fullUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    const metaDesc =
      description ||
      "Discover handcrafted seashell jewellery, crochet hats, and personalized handmade gifts crafted with love at Hastnirmit.";

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', "name", "description", metaDesc);
    upsertMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow"
    );

    // Open Graph
    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", metaDesc);
    upsertMeta('meta[property="og:url"]', "property", "og:url", fullUrl);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image || DEFAULT_IMAGE);

    // Twitter / WhatsApp summary card
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", metaDesc);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image || DEFAULT_IMAGE);

    // Canonical URL
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);

    // Optional JSON-LD Structured Data
    const existingScript = document.getElementById("hastnirmit-jsonld");
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement("script");
      script.id = "hastnirmit-jsonld";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const cleanupScript = document.getElementById("hastnirmit-jsonld");
      if (cleanupScript) cleanupScript.remove();
    };
  }, [title, description, path, image, type, noIndex, schema]);

  return null;
}

export default SEO;