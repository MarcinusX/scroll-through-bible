import { startTheatre } from './core/engine.js';
import { makeCutter } from './core/paper.js';
import { LANG, UI as BASE_UI } from './core/i18n.js';
import { BOOKS, BOOK_ORDER, loadChapter } from './chapters/index.js';

// the box frame goes up first, so the loading screen already sits inside the theatre
drawFrame();
let frameRaf = 0;
addEventListener('resize', () => { cancelAnimationFrame(frameRaf); frameRaf = requestAnimationFrame(drawFrame); });

/* ---------- which book and chapter? ?book=john&ch=N (drafts with scenes can be previewed), else Mark 1 ---------- */
const params = new URLSearchParams(location.search);
// paper shadows: soft (the default) / step / none, or blur — the old svg-filter shadows, very slow to paint in Safari
document.documentElement.dataset.shadow = ['blur', 'soft', 'step', 'none'].includes(params.get('shadow')) ? params.get('shadow') : 'soft';
let BOOK = BOOKS[params.get('book')] ? params.get('book') : 'mark';
if (!BOOKS[BOOK].READY.length && !params.get('ch')) BOOK = 'mark';
const book = BOOKS[BOOK];
const name = book.name[LANG];
let CH = +params.get('ch') || book.READY[0] || 1;
let mod = await loadChapter(BOOK, CH);
if (!mod || !mod.SCENES.length) {
  // nothing drawn here yet: fall back to the book's first published chapter, or to Mark 1
  const fb = book.READY[0] ? [BOOK, book.READY[0]] : ['mark', 1];
  location.replace(`${location.pathname}?${new URLSearchParams({ ...Object.fromEntries(params), book: fb[0], ch: fb[1] })}`);
  await new Promise(() => {});
}
const { SCENES, BEATS_EN, META } = mod;
const meta = META[LANG];
const READY = book.READY;
const UI = { ...BASE_UI, ref: (ch, a, b) => BASE_UI.ref(name.abbr, ch, a, b) };

/* ---------- words on the page ---------- */
document.documentElement.lang = UI.htmlLang;
document.title = UI.title(name.plain);
document.querySelector('meta[name="description"]').setAttribute('content', UI.description);
document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = UI[el.dataset.i18n]; });
document.getElementById('cover-kicker').textContent = UI.coverKicker(META.plate);
document.getElementById('cover-title').innerHTML = name.title;
document.getElementById('cover-ch').textContent = UI.chapterName(CH);
document.getElementById('cover-sub').innerHTML = meta.coverSub;
document.getElementById('end-kicker').textContent = UI.endKicker(CH, CH === book.count, name.plain);
document.getElementById('end-q').innerHTML = meta.endQ;
const chapterUrl = (n, b = BOOK) => { const q = new URLSearchParams(location.search); q.set('book', b); q.set('ch', n); q.delete('only'); return `${location.pathname}?${q}`; };

/* ---------- book tabs on the title page (only books with a published chapter) ---------- */
const bookNav = document.getElementById('books');
bookNav.setAttribute('aria-label', UI.books);
const shown = BOOK_ORDER.filter((id) => BOOKS[id].READY.length || id === BOOK);
if (shown.length > 1) shown.forEach((id) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'book-tab';
  b.textContent = BOOKS[id].name[LANG].short;
  b.setAttribute('aria-label', BOOKS[id].name[LANG].plain);
  if (id === BOOK) b.setAttribute('aria-current', 'true');
  else b.addEventListener('click', () => { location.href = chapterUrl(BOOKS[id].READY[0] || 1, id); });
  bookNav.appendChild(b);
});

/* ---------- chapter tabs on the title page ---------- */
const tabs = document.getElementById('chapters');
tabs.setAttribute('aria-label', UI.chapters);
for (let n = 1; n <= book.count; n++) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'ch-tab';
  b.textContent = n;
  b.setAttribute('aria-label', UI.chapterName(n));
  if (n === CH) b.setAttribute('aria-current', 'true');
  if (!READY.includes(n)) b.disabled = true;
  else if (n !== CH) b.addEventListener('click', () => { location.href = chapterUrl(n); });
  tabs.appendChild(b);
}
// the closing card offers the next chapter when it is ready
const nextBtn = document.getElementById('next');
if (READY.includes(CH + 1)) {
  nextBtn.hidden = false;
  nextBtn.textContent = UI.next(CH + 1);
  nextBtn.addEventListener('click', () => { location.href = chapterUrl(CH + 1); });
}
document.getElementById('stage').setAttribute('aria-label', UI.stage);
document.getElementById('rail').setAttribute('aria-label', UI.rail);

/* ---------- the box frame: dark board + deckle-edged mat ---------- */
function drawFrame() {
  const svg = document.getElementById('frame');
  const W = innerWidth, H = innerHeight;
  const f = Math.max(10, Math.min(24, W * 0.016));
  const c = makeCutter(7);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const rr = (x, y, w, h, r, n = 6) => {
    const p = [];
    const corner = (cx, cy, a0) => { for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * Math.PI / 2; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI);
    return p;
  };
  const outer = `M-10 -10H${W + 10}V${H + 10}H-10Z`;
  const r = Math.min(W, H) * 0.035;
  const mat = c.hole(rr(f + 7, f + 7, W - 2 * f - 14, H - 2 * f - 14, r), 1.2, 6);
  const board = c.hole(rr(f, f, W - 2 * f, H - 2 * f, r + 6), 0.8, 10);
  svg.innerHTML = `<path d="${outer}${mat}" fill="#efe3c9"/><path d="${outer}${mat}" class="grain"/><path d="${outer}${board}" fill="#1f3a3c"/><path d="${outer}${board}" class="grain" opacity=".5"/>`;
  document.documentElement.style.setProperty('--frame', f + 7 + 'px');
}

/* ---------- the play ---------- */
// ?only=lamp,measure — render just these scenes (handy while drawing a new one)
const only = params.get('only');
const scenes = only ? SCENES.filter((s) => only.split(',').includes(s.id)) : SCENES;
const theatre = startTheatre({
  book: await book.text[LANG](),
  chapter: CH,
  scenes,
  ui: UI,
  beatText: LANG === 'en' ? (id, i) => BEATS_EN[id]?.[i] : () => undefined,
});
// home: the eyelet of the hanging tag (and "From the beginning") turn the page back to the title
function goHome() {
  if (theatre.g < 0.4) scrollTo({ top: 0, behavior: 'smooth' });
  else theatre.turnTo(0, { title: name.plain, ref: UI.chapterName(CH) });
}
const homeBtn = document.getElementById('home');
homeBtn.setAttribute('aria-label', UI.home);
homeBtn.title = UI.home;
homeBtn.addEventListener('click', goHome);
const backBtn = document.getElementById('back');
backBtn.title = UI.home;
backBtn.addEventListener('click', goHome);
document.getElementById('again').addEventListener('click', goHome);
window.__theatre = theatre;

/* ---------- language picker: two little paper flags ---------- */
function paperFlag(lang) {
  const c = makeCutter('flag-' + lang);
  const edge = c.cut([[0, 0], [60, 0], [60, 38], [0, 38]], 0.9, 6);
  const clipId = 'flagclip-' + lang;
  let body;
  if (lang === 'pl') {
    body = `<rect width="60" height="19" fill="#f8f2e4"/><rect y="19" width="60" height="19" fill="#c9574c"/>`;
  } else {
    const blue = '#415f8f', red = '#c9574c', white = '#f8f2e4';
    body = `<rect width="60" height="38" fill="${blue}"/>
      <path d="M0 0L60 38M60 0L0 38" stroke="${white}" stroke-width="8"/>
      <path d="M0 0L60 38M60 0L0 38" stroke="${red}" stroke-width="2.6"/>
      <path d="M30 0V38M0 19H60" stroke="${white}" stroke-width="11"/>
      <path d="M30 0V38M0 19H60" stroke="${red}" stroke-width="6.5"/>`;
  }
  return `<svg viewBox="-1 -1 62 40" aria-hidden="true" focusable="false"><defs><clipPath id="${clipId}"><path d="${edge}"/></clipPath></defs>
    <g clip-path="url(#${clipId})">${body}<path d="${edge}" fill="url(#grain)"/></g><path d="${edge}" fill="none" stroke="#b9a684" stroke-width="1.2" opacity=".8"/></svg>`;
}
const langNav = document.getElementById('lang');
langNav.setAttribute('aria-label', UI.langLabel);
[['pl', 'Polski'], ['en', 'English']].forEach(([code, name]) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'flag';
  b.setAttribute('aria-pressed', String(code === LANG));
  b.setAttribute('aria-label', name);
  b.innerHTML = `${paperFlag(code)}<span>${code.toUpperCase()}</span>`;
  b.addEventListener('click', () => {
    if (code === LANG) return;
    try { localStorage.setItem('lang', code); } catch (e) { /* storage blocked — the URL still carries it */ }
    const q = new URLSearchParams(location.search);
    q.set('lang', code);
    location.href = `${location.pathname}?${q}`; // the picker lives on the home page — reopen it there
  });
  langNav.appendChild(b);
});

/* ---------- everything is filled in: lift the loading state ---------- */
document.documentElement.classList.remove('loading');
document.documentElement.classList.add('ready');
