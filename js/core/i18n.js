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
    title: 'Ewangelia wg św. Marka — papierowy teatr',
    description: 'Ewangelia według św. Marka jako przewijany papierowy teatr: każde zdanie rozdziału 4 — przypowieści nad jeziorem i uciszenie burzy — ożywa w wycinance.',
    coverKicker: 'Plansza IV · Papierowy teatr',
    coverTitle: 'Ewangelia <em>według św. Marka</em>',
    coverSub: 'Rozdział 4 — przypowieści nad jeziorem<br>i cisza po burzy',
    hint: 'Przewijaj powoli',
    endKicker: 'Koniec rozdziału 4',
    endQ: '«Kim właściwie On jest?»',
    again: 'Od początku',
    credit: 'Styl zainspirowany pracą <a href="https://miaai-lab.github.io/Claude-Opus-5.5-100-HTML-Files/" target="_blank" rel="noopener">Mia’s AI Lab</a> · tekst: Biblia Tysiąclecia',
    chapter: 'Rozdział',
    parable: 'przypowieść',
    parableMark: 'przypowieść · ',
    stage: 'Papierowy teatr: ilustracje do czytanego tekstu',
    rail: 'Części rozdziału',
    langLabel: 'Język',
    ref: (ch, a, b) => `Mk ${ch},${a}${b && b !== a ? '–' + b : ''}`,
  },
  en: {
    htmlLang: 'en',
    title: 'The Gospel of Mark — a paper theatre',
    description: 'The Gospel of Mark as a scroll-driven paper theatre: every sentence of chapter 4 — the parables by the lake and the calming of the storm — comes alive in cut paper.',
    coverKicker: 'Plate IV · Paper theatre',
    coverTitle: 'The Gospel <em>according to Mark</em>',
    coverSub: 'Chapter 4 — parables by the lake<br>and the calm after the storm',
    hint: 'Scroll slowly',
    endKicker: 'End of chapter 4',
    endQ: '“Who then is this?”',
    again: 'From the beginning',
    credit: 'Style inspired by the work of <a href="https://miaai-lab.github.io/Claude-Opus-5.5-100-HTML-Files/" target="_blank" rel="noopener">Mia’s AI Lab</a> · text: World English Bible',
    chapter: 'Chapter',
    parable: 'parable',
    parableMark: 'parable · ',
    stage: 'Paper theatre: illustrations for the text being read',
    rail: 'Parts of the chapter',
    langLabel: 'Language',
    ref: (ch, a, b) => `Mark ${ch}:${a}${b && b !== a ? '–' + b : ''}`,
  },
}[LANG];
