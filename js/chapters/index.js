// All chapters of the Gospel. A chapter is "ready" once its folder has scenes.
export const CHAPTER_COUNT = 16;
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
export const loadChapter = (n) => (LOADERS[n] ? LOADERS[n]() : Promise.resolve(null));
export async function readyChapters() {
  const list = await Promise.all(Object.keys(LOADERS).map(async (n) => ((await LOADERS[n]()).SCENES.length ? +n : 0)));
  return list.filter(Boolean);
}
