# CG Tech Notes

Blender / Houdini / Unreal Engine の「知られていない機能」「非公式の現場テクニック」をまとめる
自動更新型サイト。GitHub Pages でホスティング。

## 構成

- `src/content/posts/` — 公開記事（MDX）。**承認済みのものだけ**がここに入る
- `drafts/` — 承認待ちの下書き（gitignore済・非公開）
- `data/` — 収集した候補（inbox.json）と既読管理（seen.json）（gitignore済）
- `pipeline/collect.mjs` — RSS収集（`npm run collect`）
- `pipeline/publish.mjs` — 下書きの承認公開（`npm run publish:post -- <slug>`）
- `pipeline/draft-guidelines.md` — 下書き生成のルール。**下書きを書く前に必ず読む**

## 運用ルール

- 下書き生成は必ず `pipeline/draft-guidelines.md` に従う
- `src/content/posts/` への直接書き込み・git push は人間の承認後のみ
- 記事の frontmatter スキーマは `src/content.config.ts` を参照
- Before/After 比較には `src/components/BeforeAfter.astro` を使う

## コマンド

- `npm run dev` — ローカルプレビュー
- `npm run build` — ビルド検証
- `npm run collect` — フィード巡回・候補収集
- `npm run publish:post -- <slug>` — 下書きを公開キューへ移動
