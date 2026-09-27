// All chapters of the Gospel. A chapter is "ready" once its folder has scenes.
export const CHAPTER_COUNT = 16;
const LOADERS = {
  1: () => import('./mark1/index.js'),
  2: () => import('./mark2/index.js'),
  3: () => import('./mark3/index.js'),
  4: () => import('./mark4/index.js'),
};
export const loadChapter = (n) => (LOADERS[n] ? LOADERS[n]() : Promise.resolve(null));
export async function readyChapters() {
  const list = await Promise.all(Object.keys(LOADERS).map(async (n) => ((await LOADERS[n]()).SCENES.length ? +n : 0)));
  return list.filter(Boolean);
}
