import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

const PAGE_SIZE = 5;
const DEFAULT_SITE_URL = "https://tech.naviary.io";

const toSiteUrl = (site?: URL) =>
  (site?.toString() ?? DEFAULT_SITE_URL).replace(/\/$/, "");

const toAbsoluteUrl = (siteUrl: string, path: string) =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const toValidIsoDate = (value: string) => {
  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.valueOf()) ? undefined : parsedDate.toISOString();
};

const getLatestLastModified = (
  posts: Array<{ data: { date: string; updatedDate?: string } }>,
) =>
  posts.reduce<string | undefined>((latest, post) => {
    const candidate = toValidIsoDate(post.data.updatedDate ?? post.data.date);
    if (!candidate) return latest;
    if (!latest) return candidate;
    return new Date(candidate).valueOf() > new Date(latest).valueOf()
      ? candidate
      : latest;
  }, undefined);

const buildArticlePagePaths = (locale: "ko" | "en", postCount: number) => {
  const lastPage = Math.max(1, Math.ceil(postCount / PAGE_SIZE));
  return Array.from({ length: lastPage }, (_, index) => {
    const pageNumber = index + 1;
    return pageNumber === 1
      ? `/${locale}/articles/`
      : `/${locale}/articles/${pageNumber}/`;
  });
};

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = toSiteUrl(site);
  const [koPosts, enPosts] = await Promise.all([
    getCollection("koBlog", ({ data }) => !data.draft),
    getCollection("enBlog", ({ data }) => !data.draft),
  ]);

  const koLastmod = getLatestLastModified(koPosts);
  const enLastmod = getLatestLastModified(enPosts);

  const staticEntries: SitemapEntry[] = [
    { loc: toAbsoluteUrl(siteUrl, "/rss.xml") },
    { loc: toAbsoluteUrl(siteUrl, "/ko/"), lastmod: koLastmod },
    { loc: toAbsoluteUrl(siteUrl, "/en/"), lastmod: enLastmod },
    { loc: toAbsoluteUrl(siteUrl, "/ko/open-source/"), lastmod: koLastmod },
    { loc: toAbsoluteUrl(siteUrl, "/en/open-source/"), lastmod: enLastmod },
    { loc: toAbsoluteUrl(siteUrl, "/ko/rss.xml"), lastmod: koLastmod },
    { loc: toAbsoluteUrl(siteUrl, "/en/rss.xml"), lastmod: enLastmod },
    ...buildArticlePagePaths("ko", koPosts.length).map((path) => ({
      loc: toAbsoluteUrl(siteUrl, path),
      lastmod: koLastmod,
    })),
    ...buildArticlePagePaths("en", enPosts.length).map((path) => ({
      loc: toAbsoluteUrl(siteUrl, path),
      lastmod: enLastmod,
    })),
  ];

  const dynamicEntries: SitemapEntry[] = [
    ...koPosts.map((post) => ({
      loc: toAbsoluteUrl(siteUrl, `/ko/articles/post/${post.id}/`),
      lastmod: toValidIsoDate(post.data.updatedDate ?? post.data.date),
    })),
    ...enPosts.map((post) => ({
      loc: toAbsoluteUrl(siteUrl, `/en/articles/post/${post.id}/`),
      lastmod: toValidIsoDate(post.data.updatedDate ?? post.data.date),
    })),
  ];

  const entries = [...staticEntries, ...dynamicEntries].reduce<
    Map<string, SitemapEntry>
  >((entryMap, entry) => {
    entryMap.set(entry.loc, entry);
    return entryMap;
  }, new Map<string, SitemapEntry>());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...entries.values()]
      .sort((a, b) => a.loc.localeCompare(b.loc))
      .map((entry) => {
        const lastmodTag = entry.lastmod
          ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
          : "";
        return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmodTag}\n  </url>`;
      })
      .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
