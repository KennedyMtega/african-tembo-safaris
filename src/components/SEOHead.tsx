import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const SITE_NAME = "African Tembo Safari";
const DEFAULT_DESC = "Curated safari experiences through Tanzania's most iconic wildlife destinations. Serengeti, Ngorongoro, Kilimanjaro, Zanzibar and more.";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

function setMeta(name: string, content: string, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Authentic Tanzania Safari Experiences`;
    const desc = description || DEFAULT_DESC;
    const image = ogImage || DEFAULT_OG_IMAGE;
    const url = canonical || window.location.href;

    document.title = fullTitle;

    setMeta("description", desc);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:image", image, "property");
    setMeta("og:url", url, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", "en_US", "property");

    // Twitter
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", image);

    // Canonical
    setCanonical(url);
  }, [title, description, canonical, ogImage, ogType, noIndex]);

  return null;
}
