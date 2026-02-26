import { defineCollection } from "astro:content";
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    // basic information
    title: z.string(),
    description: z.string(),
    author: z.string().default("Naviary"),

    // date (allow "2026-02-27")
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    // for series
    series: z.string().optional(),
    seriesOrder: z.number().optional(),

    // etc
    heroImage: z.string().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),

  })
})