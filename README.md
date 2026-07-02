# CG Tech Notes

Blender / Houdini / Unreal Engine の「知られていない機能」と「非公式の現場テクニック」を
検証してまとめる自動更新型サイト。GitHub Pages（無料）でホスティング。

## 仕組み

```
RSS/フィード巡回（毎日・Macローカル）
        │  pipeline/collect.mjs
        ▼
data/inbox.json（記事候補）
        │  Claude が draft-guidelines.md に従って下書き生成
        ▼
drafts/（承認待ち・非公開）
        │  人間がレビュー → npm run publish:post -- <slug>
        ▼
src/content/posts/（公開記事）
        │  git push
        ▼
GitHub Actions が自動ビルド → GitHub Pages 公開
```

- **全自動なのは収集と下書きまで。** 公開は必ず人間の承認を通す（品質・著作権対策）
- 記事は一次情報を確認し自分の言葉で再構成、出典を必ず記載する
- 未承認の下書き・収集データは gitignore され公開リポジトリに含まれない

## 初回セットアップ（残作業）

1. **GitHub 再認証**（トークン失効中）: `gh auth login -h github.com`
2. **リポジトリ作成と push**:
   ```sh
   cd ~/claude_masa/01_mydata/cg-tech-notes
   gh repo create cg-tech-notes --public --source=. --push
   ```
3. **GitHub Pages を有効化**（ソースを GitHub Actions に）:
   ```sh
   gh api repos/masakiyy/cg-tech-notes/pages -X POST -f build_type=workflow
   ```
   （またはリポジトリの Settings → Pages → Source: GitHub Actions）
4. push すると自動デプロイされ、`https://masakiyy.github.io/cg-tech-notes/` で公開される

リポジトリ名を変える場合は `astro.config.mjs` の `base` も合わせて変更する。

## 日常の運用

| 操作 | コマンド |
|------|---------|
| 候補収集（自動でも実行される） | `npm run collect` |
| 承認待ち一覧 | `npm run publish:post` |
| 下書きをプレビュー | `drafts/*.mdx` を確認、必要なら posts へ移して `npm run dev` |
| 承認して公開キューへ | `npm run publish:post -- <slug>` |
| 公開 | `git add -A && git commit && git push` |

## 情報源の追加

`pipeline/feeds.json` にフィードを追加する。追加したホストは `.claude/settings.json` の
`sandbox.network.allowedHosts` にも追加すること（サンドボックス実行時の接続許可）。

- X（旧Twitter）は API 有料化のため自動収集の対象外。有用な投稿は URL を
  `data/inbox.json` に手動で追記するか、直接 Claude に渡して下書き化する
- 未検証のフィード URL（80.lv、Unreal Forum 等）は初回実行で失敗したら修正する

## 注意（著作権・品質）

- 他者の投稿・記事を元にする場合、**逐語コピーは不可**。自分の言葉での再構成＋出典明記が必須
- 画像は自分で作成したスクリーンショットのみ使用する（他者の画像の転載は不可）
- 詳細ルール: [pipeline/draft-guidelines.md](pipeline/draft-guidelines.md)
