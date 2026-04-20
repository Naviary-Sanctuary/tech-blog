import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
export async function getStaticPaths() {
  const posts = await getCollection("koBlog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
export const GET: APIRoute = async ({ props, site, params }) => {
  const post = props.post;
  if (!post) {
    return new Response("Not found", { status: 404 });
  }
  const siteUrl = (site?.toString() ?? "https://tech.naviary.io").replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/en/articles/post/${params.slug}/`;
  const text = [
    `Title: ${post.data.title}`,
    `Description: ${post.data.description}`,
    `Date: ${post.data.date}`,
    post.data.updatedDate ? `Updated: ${post.data.updatedDate}` : null,
    `Category: ${post.data.category}`,
    `Tags: ${post.data.tags.join(", ")}`,
    `Canonical: ${canonicalUrl}`,
    "",
    post.body ?? "",
  ]
    .filter(Boolean)
    .join("\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};