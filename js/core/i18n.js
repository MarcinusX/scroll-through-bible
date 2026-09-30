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
    back: 'Powrót',
    libKicker: 'Papierowy teatr',
    libBible: 'Biblia',
    libSub: 'Wybierz księgę, a potem rozdział',
    libBack: '← Wszystkie księgi',
    toc: 'Spis rozdziałów',
    // 1 rozdział, 2–4 rozdziały (but 12–14 rozdziałów), 5+ rozdziałów
    chapterCount: (n) => `${n} ${n === 1 ? 'rozdział' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'rozdziały' : 'rozdziałów'}`,
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
    back: 'Home',
    libKicker: 'A paper theatre',
    libBible: 'The Bible',
    libSub: 'Pick a book, then a chapter',
    libBack: '← All books',
    toc: 'All chapters',
    chapterCount: (n) => `${n} chapter${n === 1 ? '' : 's'}`,
    ref: (abbr, ch, a, b) => `${abbr} ${ch}:${a}${b && b !== a ? '–' + b : ''}`,
  },
}[LANG];
