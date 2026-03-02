import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { createRssXml } from "../../libs/rss";

export const GET: APIRoute = async ({ site, url }) => {
  const koPosts = await getCollection("koBlog", ({ data }) => !data.draft);
  const entries = koPosts.map((post) => ({ locale: "ko" as const, post }));

  const xml = createRssXml({
    site,
    pathname: url.pathname,
    channel: {
      title: "Naviary Tech Blog (Korean)",
      description: "나비어리 기술 아카이브 한국어 피드입니다.",
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
