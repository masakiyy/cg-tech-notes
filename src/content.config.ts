import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    software: z.array(z.enum(['blender', 'houdini', 'unreal'])),
    category: z.enum(['official-hidden', 'community-tip', 'news']),
    // 出典。SNS・記事を元にした場合は必ず記載する
    sources: z
      .array(z.object({ title: z.string(), url: z.string().url() }))
      .default([]),
  }),
});

export const collections = { posts };
