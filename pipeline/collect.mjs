// RSS/Atomフィードを巡回し、新着の記事候補を data/inbox.json に追記する
// 実行: npm run collect（環境変数 COLLECT_DAYS で遡る日数を変更、既定7日）
// 取得は fetch を使用（NODE_USE_ENV_PROXY=1 でサンドボックスのプロキシにも対応）
import Parser from 'rss-parser';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, 'data');
const feedsPath = path.join(root, 'pipeline', 'feeds.json');
const seenPath = path.join(dataDir, 'seen.json');
const inboxPath = path.join(dataDir, 'inbox.json');

const DAYS = Number(process.env.COLLECT_DAYS ?? 7);
const SEEN_LIMIT = 5000; // 既読IDの保持上限
const USER_AGENT = 'cg-tech-notes-collector/0.1';

const feeds = JSON.parse(readFileSync(feedsPath, 'utf8'));
mkdirSync(dataDir, { recursive: true });

const seenList = existsSync(seenPath)
  ? JSON.parse(readFileSync(seenPath, 'utf8'))
  : [];
const seen = new Set(seenList);
const inbox = existsSync(inboxPath)
  ? JSON.parse(readFileSync(inboxPath, 'utf8'))
  : [];

const parser = new Parser();
const cutoff = Date.now() - DAYS * 24 * 60 * 60 * 1000;
let added = 0;
const failed = [];

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': USER_AGENT, accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
    signal: AbortSignal.timeout(20000),
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parser.parseString(await res.text());
}

for (const [software, list] of Object.entries(feeds)) {
  for (const feed of list) {
    try {
      const result = await fetchFeed(feed.url);
      for (const item of result.items ?? []) {
        const link = item.link ?? item.guid;
        if (!link) continue;
        const id = createHash('sha256').update(link).digest('hex').slice(0, 16);
        const date = item.isoDate ? Date.parse(item.isoDate) : Date.now();
        if (seen.has(id) || date < cutoff) continue;
        seen.add(id);
        inbox.push({
          id,
          software,
          source: feed.name,
          title: (item.title ?? '').trim(),
          url: link,
          date: new Date(date).toISOString(),
          summary: (item.contentSnippet ?? '').replace(/\s+/g, ' ').slice(0, 500),
        });
        added++;
      }
      console.log(`ok   ${feed.name}`);
    } catch (err) {
      failed.push(feed.name);
      console.error(`fail ${feed.name}: ${err.message}`);
    }
    // レート制限（特にReddit）対策の待機
    await new Promise((r) => setTimeout(r, 3000));
  }
}

writeFileSync(seenPath, JSON.stringify([...seen].slice(-SEEN_LIMIT), null, 2));
writeFileSync(inboxPath, JSON.stringify(inbox, null, 2));

console.log(`\n新規候補 ${added} 件を data/inbox.json に追加（未処理 合計 ${inbox.length} 件）`);
if (failed.length) {
  console.log(`取得失敗: ${failed.join(', ')}`);
  console.log('（サンドボックス実行時は .claude/settings.json の許可ホストを確認）');
}
