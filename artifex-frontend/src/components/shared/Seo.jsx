import { useEffect } from "react";

function setOrCreateMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

const SITE_NAME = "Artifex";
const BASE_URL = "https://artifex-9c6.pages.dev";

export function Seo({ title, description, image, path }) {
  useEffect(() => {
    const fullTitle = title.includes("Artifex") ? title : `${title} — ${SITE_NAME}`;
    const url = path ? `${BASE_URL}${path}` : BASE_URL;

    document.title = fullTitle;
    if (description) setOrCreateMeta("name", "description", description);
    setOrCreateMeta("property", "og:title", fullTitle);
    setOrCreateMeta("property", "og:site_name", SITE_NAME);
    setOrCreateMeta("property", "og:type", "website");
    setOrCreateMeta("property", "og:url", url);
    if (description) setOrCreateMeta("property", "og:description", description);
    if (image) setOrCreateMeta("property", "og:image", image);
    setCanonical(url);
  }, [title, description, image, path]);

  return null;
}
