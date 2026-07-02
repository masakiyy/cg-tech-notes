// drafts/ の下書きを承認し、公開記事 (src/content/posts/) へ移動する
// 実行: npm run publish:post -- <slug>
import { renameSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const draftsDir = path.join(root, 'drafts');
const postsDir = path.join(root, 'src', 'content', 'posts');

const slug = process.argv[2];

if (!slug) {
  console.log('使い方: npm run publish:post -- <slug>\n');
  const drafts = existsSync(draftsDir)
    ? readdirSync(draftsDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    : [];
  if (drafts.length === 0) {
    console.log('承認待ちの下書きはありません。');
  } else {
    console.log('承認待ちの下書き:');
    for (const d of drafts) console.log(`  - ${d.replace(/\.(mdx|md)$/, '')}`);
  }
  process.exit(1);
}

const candidates = [`${slug}.mdx`, `${slug}.md`];
const found = candidates.find((f) => existsSync(path.join(draftsDir, f)));

if (!found) {
  console.error(`drafts/${slug}.mdx が見つかりません。`);
  process.exit(1);
}

const dest = path.join(postsDir, found);
if (existsSync(dest)) {
  console.error(`同名の公開記事が既に存在します: ${dest}`);
  process.exit(1);
}

renameSync(path.join(draftsDir, found), dest);
console.log(`公開キューへ移動しました: src/content/posts/${found}`);
console.log('次の手順: git add -A && git commit -m "feat: 記事追加" && git push');
console.log('push すると GitHub Actions が自動でサイトを更新します。');
