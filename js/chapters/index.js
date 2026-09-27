// All chapters of the Gospel.
export const CHAPTER_COUNT = 16;
// Chapters that are drawn, reviewed and published. Only the chapter being read is loaded,
// so the page never pays for the other fifteen. (tools/check.mjs keeps this list honest.)
export const READY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16];
// (explicit imports so any static host / bundler can see them)
const LOADERS = {
  1: () => import('./mark1/index.js'),
  2: () => import('./mark2/index.js'),
  3: () => import('./mark3/index.js'),
  4: () => import('./mark4/index.js'),
  5: () => import('./mark5/index.js'),
  6: () => import('./mark6/index.js'),
  7: () => import('./mark7/index.js'),
  8: () => import('./mark8/index.js'),
  9: () => import('./mark9/index.js'),
  10: () => import('./mark10/index.js'),
  11: () => import('./mark11/index.js'),
  12: () => import('./mark12/index.js'),
  13: () => import('./mark13/index.js'),
  14: () => import('./mark14/index.js'),
  15: () => import('./mark15/index.js'),
  16: () => import('./mark16/index.js'),
};
// resolves to the chapter module, or null if it is missing or fails to load
export async function loadChapter(n) {
  if (!LOADERS[n]) return null;
  try { return await LOADERS[n](); } catch (err) { console.error(`Mark ${n} failed to load`, err); return null; }
}
