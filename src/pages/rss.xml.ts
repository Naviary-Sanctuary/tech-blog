import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { createRssXml } from "../libs/rss";

export const GET: APIRoute = async ({ site, url }) => {
  const [koPosts, enPosts] = await Promise.all([
    getCollection("koBlog", ({ data }) => !data.draft),
    getCollection("enBlog", ({ data }) => !data.draft),
  ]);

  const entries = [
    ...koPosts.map((post) => ({ locale: "ko" as const, post })),
    ...enPosts.map((post) => ({ locale: "en" as const, post })),
  ];

  const xml = createRssXml({
    site,
    pathname: url.pathname,
    channel: {
      title: "Naviary Tech Blog",
      description:
        "Naviary technical posts about building a data-driven breeding platform.",
      language: "ko-KR",
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
