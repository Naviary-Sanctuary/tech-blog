import type { CollectionEntry } from "astro:content";

type FeedLocale = "ko" | "en";

type FeedPost = CollectionEntry<"koBlog"> | CollectionEntry<"enBlog">;

type FeedEntry = {
  locale: FeedLocale;
  post: FeedPost;
};

type FeedChannel = {
  title: string;
  description: string;
  language: string;
};

type CreateRssXmlParams = {
  site?: URL;
  pathname: string;
  channel: FeedChannel;
  entries: FeedEntry[];
};

const DEFAULT_SITE_URL = "https://tech.naviary.io";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const parseDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.valueOf())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date;
};

const toSiteUrl = (site?: URL) =>
  (site?.toString() ?? DEFAULT_SITE_URL).replace(/\/$/, "");

export const createRssXml = ({
  site,
  pathname,
  channel,
  entries,
}: CreateRssXmlParams) => {
  const siteUrl = toSiteUrl(site);
  const feedUrl = `${siteUrl}${pathname}`;

  const items = entries
    .map(({ locale, post }) => {
      const pubDate = parseDate(post.data.date);
      const updatedDate = post.data.updatedDate
        ? parseDate(post.data.updatedDate)
        : pubDate;

      return {
        title: post.data.title,
        description: post.data.description,
        category: post.data.category,
        tags: post.data.tags,
        link: `${siteUrl}/${locale}/articles/post/${post.id}`,
        pubDate,
        updatedDate,
        locale,
      };
    })
    .sort((a, b) => b.updatedDate.valueOf() - a.updatedDate.valueOf());

  const lastBuildDate = items[0]?.updatedDate ?? new Date();

  const itemXml = items
    .map(
      (item) => `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${escapeXml(item.link)}</link>
  <guid isPermaLink="true">${escapeXml(item.link)}</guid>
  <description>${escapeXml(item.description)}</description>
  <pubDate>${item.pubDate.toUTCString()}</pubDate>
  <category>${escapeXml(item.locale)}</category>
  <category>${escapeXml(item.category)}</category>
  ${item.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n  ")}
</item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(channel.title)}</title>
  <description>${escapeXml(channel.description)}</description>
  <link>${escapeXml(siteUrl)}</link>
  <language>${escapeXml(channel.language)}</language>
  <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
  <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
  ${itemXml}
</channel>
</rss>`;
};
