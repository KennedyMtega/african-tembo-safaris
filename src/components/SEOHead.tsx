import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const SITE_NAME = "African Tembo Safaris";
const BASE_URL = "https://africantembosafaris.com";
const DEFAULT_DESC = "Book expert-led Tanzania safari packages to Serengeti, Ngorongoro Crater, Kilimanjaro & Zanzibar. Family, luxury & budget wildlife safaris from Arusha. Free personalised quotes.";
const DEFAULT_KEYWORDS = "Tanzania safari, African safari tours, Serengeti safari, Ngorongoro Crater, Kilimanjaro trek, Zanzibar holidays, wildlife safari, safari packages Tanzania, East Africa safari, Arusha safari operator";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

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

function injectStructuredData(id: string, data: object) {
  let el = document.querySelector(`script[data-sd="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-sd", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeStructuredData(id: string) {
  document.querySelector(`script[data-sd="${id}"]`)?.remove();
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
  structuredData,
}: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | Authentic Tanzania Safari Experiences`;
    const desc = description || DEFAULT_DESC;
    const kw = keywords || DEFAULT_KEYWORDS;
    const image = ogImage || DEFAULT_OG_IMAGE;
    const url = canonical ? `${BASE_URL}${canonical}` : window.location.href;

    document.title = fullTitle;

    setMeta("description", desc);
    setMeta("keywords", kw);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Open Graph
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:image", image, "property");
    setMeta("og:image:width", "1920", "property");
    setMeta("og:image:height", "1080", "property");
    setMeta("og:url", url, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", "en_US", "property");

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", image);

    // Canonical
    setCanonical(url);

    // Structured data
    if (structuredData) {
      injectStructuredData("page-sd", structuredData);
    }

    return () => {
      if (structuredData) removeStructuredData("page-sd");
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noIndex, structuredData]);

  return null;
}
