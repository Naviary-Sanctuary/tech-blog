import { defineCollection } from "astro:content";
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const schema = z.object({
  // basic information
  title: z.string(),
  description: z.string(),
  author: z.string().default("Naviary"),

  // date (only "2026-02-27")
  date: z.string(),
  updatedDate: z.string().optional(),

  // for series
  series: z.string().optional(),
  seriesOrder: z.number().optional(),

  // classification
  category: z.string(),
  tags: z.array(z.string()),

  // etc
  heroImage: z.string().optional(),
  draft: z.boolean().default(false),

})

const koBlog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/ko" }),
  schema,
})

const enBlog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/en" }),
  schema,
})

export const collections = { koBlog, enBlog }