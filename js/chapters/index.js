// The Gospels in the theatre. Each book lists which chapters are drawn, reviewed and published
// (READY) and how to load a chapter; only the chapter being read is ever loaded.
// (Explicit import() calls so any static host / bundler can see them. tools/check.mjs keeps READY honest.)

export const BOOKS = {
  matthew: {
    look: { emblem: 'angel', sky: ['#f1c794', '#f8e6c4'], sun: '#fbeed2', hills: ['#e6c48e', '#cf9a63'], accent: '#a8572a' },
    id: 'matthew', count: 28, prefix: 'mt',
    READY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    text: { pl: () => import('../../data/matthew.js').then((m) => m.MATTHEW), en: () => import('../../data/matthew-en.js').then((m) => m.MATTHEW_EN) },
    name: {
      pl: { short: 'Mateusz', abbr: 'Mt', title: 'Ewangelia <em>według św. Mateusza</em>', plain: 'Ewangelia według św. Mateusza', card: ['Ewangelia według św.', 'Mateusza'] },
      en: { short: 'Matthew', abbr: 'Matthew', title: 'The Gospel <em>according to Matthew</em>', plain: 'The Gospel according to Matthew', card: ['The Gospel according to', 'Matthew'] },
    },
    chapters: {
      1: () => import('./matthew1/index.js'), 2: () => import('./matthew2/index.js'), 3: () => import('./matthew3/index.js'), 4: () => import('./matthew4/index.js'),
      5: () => import('./matthew5/index.js'), 6: () => import('./matthew6/index.js'), 7: () => import('./matthew7/index.js'), 8: () => import('./matthew8/index.js'),
      9: () => import('./matthew9/index.js'), 10: () => import('./matthew10/index.js'), 11: () => import('./matthew11/index.js'), 12: () => import('./matthew12/index.js'),
      13: () => import('./matthew13/index.js'), 14: () => import('./matthew14/index.js'), 15: () => import('./matthew15/index.js'), 16: () => import('./matthew16/index.js'),
      17: () => import('./matthew17/index.js'), 18: () => import('./matthew18/index.js'), 19: () => import('./matthew19/index.js'), 20: () => import('./matthew20/index.js'),
      21: () => import('./matthew21/index.js'), 22: () => import('./matthew22/index.js'), 23: () => import('./matthew23/index.js'), 24: () => import('./matthew24/index.js'),
      25: () => import('./matthew25/index.js'), 26: () => import('./matthew26/index.js'), 27: () => import('./matthew27/index.js'), 28: () => import('./matthew28/index.js'),
    },
  },
  mark: {
    look: { emblem: 'lion', sky: ['#d98e7c', '#f1cfae'], sun: '#f6dcb4', hills: ['#e2bf8a', '#bf8a57'], accent: '#a34a32' },
    id: 'mark', count: 16, prefix: 'm',
    READY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    text: { pl: () => import('../../data/mark.js').then((m) => m.MARK), en: () => import('../../data/mark-en.js').then((m) => m.MARK_EN) },
    name: {
      pl: { short: 'Marek', abbr: 'Mk', title: 'Ewangelia <em>według św. Marka</em>', plain: 'Ewangelia według św. Marka', card: ['Ewangelia według św.', 'Marka'] },
      en: { short: 'Mark', abbr: 'Mark', title: 'The Gospel <em>according to Mark</em>', plain: 'The Gospel according to Mark', card: ['The Gospel according to', 'Mark'] },
    },
    chapters: {
      1: () => import('./mark1/index.js'), 2: () => import('./mark2/index.js'), 3: () => import('./mark3/index.js'), 4: () => import('./mark4/index.js'),
      5: () => import('./mark5/index.js'), 6: () => import('./mark6/index.js'), 7: () => import('./mark7/index.js'), 8: () => import('./mark8/index.js'),
      9: () => import('./mark9/index.js'), 10: () => import('./mark10/index.js'), 11: () => import('./mark11/index.js'), 12: () => import('./mark12/index.js'),
      13: () => import('./mark13/index.js'), 14: () => import('./mark14/index.js'), 15: () => import('./mark15/index.js'), 16: () => import('./mark16/index.js'),
    },
  },
  luke: {
    look: { emblem: 'ox', sky: ['#abcfcb', '#e4ecd6'], sun: '#f6efd6', hills: ['#b9cfa9', '#7c9f6b'], accent: '#4f7249' },
    id: 'luke', count: 24, prefix: 'lk',
    READY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    text: { pl: () => import('../../data/luke.js').then((m) => m.LUKE), en: () => import('../../data/luke-en.js').then((m) => m.LUKE_EN) },
    name: {
      pl: { short: 'Łukasz', abbr: 'Łk', title: 'Ewangelia <em>według św. Łukasza</em>', plain: 'Ewangelia według św. Łukasza', card: ['Ewangelia według św.', 'Łukasza'] },
      en: { short: 'Luke', abbr: 'Luke', title: 'The Gospel <em>according to Luke</em>', plain: 'The Gospel according to Luke', card: ['The Gospel according to', 'Luke'] },
    },
    chapters: {
      1: () => import('./luke1/index.js'), 2: () => import('./luke2/index.js'), 3: () => import('./luke3/index.js'), 4: () => import('./luke4/index.js'),
      5: () => import('./luke5/index.js'), 6: () => import('./luke6/index.js'), 7: () => import('./luke7/index.js'), 8: () => import('./luke8/index.js'),
      9: () => import('./luke9/index.js'), 10: () => import('./luke10/index.js'), 11: () => import('./luke11/index.js'), 12: () => import('./luke12/index.js'),
      13: () => import('./luke13/index.js'), 14: () => import('./luke14/index.js'), 15: () => import('./luke15/index.js'), 16: () => import('./luke16/index.js'),
      17: () => import('./luke17/index.js'), 18: () => import('./luke18/index.js'), 19: () => import('./luke19/index.js'), 20: () => import('./luke20/index.js'),
      21: () => import('./luke21/index.js'), 22: () => import('./luke22/index.js'), 23: () => import('./luke23/index.js'), 24: () => import('./luke24/index.js'),
    },
  },
  john: {
    look: { emblem: 'eagle', sky: ['#3d437e', '#a893bd'], sun: '#efe0c4', hills: ['#6c6795', '#44466f'], accent: '#3d437e', stars: true },
    id: 'john', count: 21, prefix: 'j',
    READY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    text: { pl: () => import('../../data/john.js').then((m) => m.JOHN), en: () => import('../../data/john-en.js').then((m) => m.JOHN_EN) },
    name: {
      pl: { short: 'Jan', abbr: 'J', title: 'Ewangelia <em>według św. Jana</em>', plain: 'Ewangelia według św. Jana', card: ['Ewangelia według św.', 'Jana'] },
      en: { short: 'John', abbr: 'John', title: 'The Gospel <em>according to John</em>', plain: 'The Gospel according to John', card: ['The Gospel according to', 'John'] },
    },
    chapters: {
      1: () => import('./john1/index.js'), 2: () => import('./john2/index.js'), 3: () => import('./john3/index.js'), 4: () => import('./john4/index.js'),
      5: () => import('./john5/index.js'), 6: () => import('./john6/index.js'), 7: () => import('./john7/index.js'), 8: () => import('./john8/index.js'),
      9: () => import('./john9/index.js'), 10: () => import('./john10/index.js'), 11: () => import('./john11/index.js'), 12: () => import('./john12/index.js'),
      13: () => import('./john13/index.js'), 14: () => import('./john14/index.js'), 15: () => import('./john15/index.js'), 16: () => import('./john16/index.js'),
      17: () => import('./john17/index.js'), 18: () => import('./john18/index.js'), 19: () => import('./john19/index.js'), 20: () => import('./john20/index.js'),
      21: () => import('./john21/index.js'),
    },
  },
};
export const BOOK_ORDER = ['matthew', 'mark', 'luke', 'john'];
// the shelves of the home page, in order (more books join as they are drawn)
export const GROUPS = [
  { id: 'gospels', name: { pl: 'Ewangelie', en: 'The Gospels' }, books: ['matthew', 'mark', 'luke', 'john'] },
];

// what a chapter is about (its meta.js: the title-page line and the closing words), without its scenes
export async function loadMeta(book, n) {
  try { return (await import(`./${book}${n}/meta.js`)).META; } catch { return null; }
}

// resolves to the chapter module, or null if it is missing or fails to load
export async function loadChapter(book, n) {
  const b = BOOKS[book];
  if (!b || !b.chapters[n]) return null;
  try { return await b.chapters[n](); } catch (err) { console.error(`${book} ${n} failed to load`, err); return null; }
}
