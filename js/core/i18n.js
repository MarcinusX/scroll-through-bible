// Language: ?lang=en|pl → saved choice → browser language. Polish is the home language.
const hasDom = typeof window !== 'undefined';
function pickLang() {
  if (!hasDom) return 'pl';
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'pl' || q === 'en') return q;
  try { const s = localStorage.getItem('lang'); if (s === 'pl' || s === 'en') return s; } catch (e) { /* storage blocked */ }
  return (navigator.language || 'pl').toLowerCase().startsWith('pl') ? 'pl' : 'en';
}
export const LANG = pickLang();

/** tr('Polish', 'English') — for words drawn inside scenes (labels on paper tags). */
export const tr = (pl, en) => (LANG === 'en' ? en : pl);

export const UI = {
  pl: {
    htmlLang: 'pl',
    title: (plain) => `${plain} — papierowy teatr`,
    description: 'Ewangelie jako przewijany papierowy teatr: każde zdanie ożywa w wycinance.',
    coverKicker: (plate) => `Plansza ${plate} · Papierowy teatr`,
    hint: 'Przewijaj powoli',
    endKicker: (n, last, plain) => (last ? `Koniec — ${plain}` : `Koniec rozdziału ${n}`),
    books: 'Ewangelie',
    next: (n) => `Rozdział ${n} →`,
    chapters: 'Rozdziały',
    chapterName: (n) => `Rozdział ${n}`,
    again: 'Od początku',
    chapter: 'Rozdział',
    parable: 'przypowieść',
    parableMark: 'przypowieść · ',
    stage: 'Papierowy teatr: ilustracje do czytanego tekstu',
    rail: 'Części rozdziału',
    langLabel: 'Język',
    home: 'Strona tytułowa',
    ref: (abbr, ch, a, b) => `${abbr} ${ch},${a}${b && b !== a ? '–' + b : ''}`,
  },
  en: {
    htmlLang: 'en',
    title: (plain) => `${plain} — a paper theatre`,
    description: 'The Gospels as a scroll-driven paper theatre: every sentence comes alive in cut paper.',
    coverKicker: (plate) => `Plate ${plate} · Paper theatre`,
    hint: 'Scroll slowly',
    endKicker: (n, last, plain) => (last ? `The end — ${plain}` : `End of chapter ${n}`),
    books: 'Gospels',
    next: (n) => `Chapter ${n} →`,
    chapters: 'Chapters',
    chapterName: (n) => `Chapter ${n}`,
    again: 'From the beginning',
    chapter: 'Chapter',
    parable: 'parable',
    parableMark: 'parable · ',
    stage: 'Paper theatre: illustrations for the text being read',
    rail: 'Parts of the chapter',
    langLabel: 'Language',
    home: 'Home — title page',
    ref: (abbr, ch, a, b) => `${abbr} ${ch}:${a}${b && b !== a ? '–' + b : ''}`,
  },
}[LANG];
