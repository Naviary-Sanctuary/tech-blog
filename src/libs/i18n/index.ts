import { locales } from "../constants";

export function withLang(href: string, currentLang: string) {
  if (!href) return href;

  const isExternal = /^(https?:\/\/|\/\/|mailto:|tel:|sms:)/i.test(href);
  const isHashOnly = href.startsWith("#");

  if (isExternal || isHashOnly) return href;

  const [pathWithQuery, hash = ""] = href.split("#");
  const [rawPath, query = ""] = pathWithQuery.split("?");

  const path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  const alreadyLocalized = locales.some((locale) => path === `/${locale}` || path === `/${locale}/`)

  const localizedPath = alreadyLocalized ? path : `/${currentLang}${path}`;
  const withQuery = query ? `${localizedPath}?${query}` : localizedPath;

  return hash ? `${withQuery}#${hash}` : withQuery;
}