// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages（プロジェクトページ）向け設定
// リポジトリ名を変える場合は base も合わせて変更する
export default defineConfig({
  site: 'https://masakiyy.github.io',
  base: '/cg-tech-notes',
  integrations: [mdx(), sitemap()],
});
