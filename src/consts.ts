export const SITE_TITLE = 'CG Tech Notes';
export const SITE_DESCRIPTION =
  'Blender / Houdini / Unreal Engine の「知られていない機能」と現場の使い方を、検証してまとめるノート';

export const SOFTWARE = {
  blender: 'Blender',
  houdini: 'Houdini',
  unreal: 'Unreal Engine',
} as const;

export type Software = keyof typeof SOFTWARE;

export const CATEGORIES = {
  'official-hidden': '公式の隠れ機能',
  'community-tip': '非公式・現場の使い方',
  news: '最先端テック',
} as const;

export type Category = keyof typeof CATEGORIES;

/** base を考慮したサイト内リンクを生成する */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** YYYY-MM-DD 形式の日付文字列 */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
