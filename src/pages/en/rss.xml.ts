import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { createRssXml } from "../../libs/rss";

export const GET: APIRoute = async ({ site, url }) => {
  const enPosts = await getCollection("enBlog", ({ data }) => !data.draft);
  const entries = enPosts.map((post) => ({ locale: "en" as const, post }));

  const xml = createRssXml({
    site,
    pathname: url.pathname,
    channel: {
      title: "Naviary Tech Blog (English)",
      description: "English feed for the Naviary technical archive.",
      language: "en-US",
    },
    entries,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
