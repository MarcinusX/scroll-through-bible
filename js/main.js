import { startTheatre } from './core/engine.js';
import { makeCutter, shade } from './core/paper.js';
import { C } from './assets/palette.js';
import { LANG, UI as BASE_UI } from './core/i18n.js';
import { BOOKS, BOOK_ORDER, GROUPS, loadChapter, loadMeta } from './chapters/index.js';
import { createLibrary } from './core/library.js';

// the box frame and the stage curtain go up first, so the loading screen already sits inside the theatre
drawFrame(); drawDrape();
let frameRaf = 0;
addEventListener('resize', () => { cancelAnimationFrame(frameRaf); frameRaf = requestAnimationFrame(() => { drawFrame(); drawDrape(); }); });

/* ---------- which book and chapter? ?book=john&ch=N (drafts with scenes can be previewed) ----------
   Without ?book= this is the home page: the library of books, standing in front of the curtains of the
   chapter read last (or the first one there is). */
const params = new URLSearchParams(location.search);
// paper shadows: soft (the default) / step / none, or blur — the old svg-filter shadows, very slow to paint in Safari
document.documentElement.dataset.shadow = ['blur', 'soft', 'step', 'none'].includes(params.get('shadow')) ? params.get('shadow') : 'soft';
const store = {
  get(k, s = localStorage) { try { return s.getItem(k); } catch (e) { return null; } }, // storage can be blocked
  set(k, v, s = localStorage) { try { if (v == null) s.removeItem(k); else s.setItem(k, v); } catch (e) { /* the page works without it */ } },
};
const readSpot = (v) => { const [b, n] = (v || '').split(':'); return BOOKS[b]?.READY.includes(+n) ? { book: b, ch: +n } : null; };
const LAST = readSpot(store.get('last'));
const LIB = !params.get('book');
if (LIB) document.documentElement.classList.add('lib-on');
const first = BOOK_ORDER.find((id) => BOOKS[id].READY.length);
let BOOK = LIB ? LAST?.book || first : BOOKS[params.get('book')] ? params.get('book') : first;
if (!BOOKS[BOOK].READY.length && !params.get('ch')) BOOK = first;
const book = BOOKS[BOOK];
const name = book.name[LANG];
let CH = (LIB ? LAST?.ch : +params.get('ch')) || book.READY[0] || 1;
// a chapter picked on the home page opens straight on its first scene (the flag lives for one page load only;
// the page's head script has already set html.entering from it, so the title card never shows)
const AUTO = store.get('autostart', sessionStorage) === `${BOOK}:${CH}`;
store.set('autostart', null, sessionStorage);
if (!AUTO) document.documentElement.classList.remove('entering');
let mod = await loadChapter(BOOK, CH);
if (!mod || !mod.SCENES.length) {
  // nothing drawn here yet: fall back to the book's first published chapter, or to Mark 1
  const fb = book.READY[0] ? [BOOK, book.READY[0]] : [first, 1];
  location.replace(`${location.pathname}?${new URLSearchParams({ ...Object.fromEntries(params), book: fb[0], ch: fb[1] })}`);
  await new Promise(() => {});
}
const { SCENES, BEATS_EN, META } = mod;
const meta = META[LANG];
const READY = book.READY;
const UI = { ...BASE_UI, ref: (ch, a, b) => BASE_UI.ref(name.abbr, ch, a, b) };

/* ---------- words on the page ---------- */
document.documentElement.lang = UI.htmlLang;
document.title = UI.title(LIB ? GROUPS[0].name[LANG] : name.plain);
document.querySelector('meta[name="description"]').setAttribute('content', UI.description);
document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = UI[el.dataset.i18n]; });
document.getElementById('cover-kicker').textContent = UI.coverKicker(META.plate);
document.getElementById('cover-title').innerHTML = name.title;
document.getElementById('cover-ch').textContent = UI.chapterName(CH);
document.getElementById('cover-sub').innerHTML = meta.coverSub;
document.getElementById('end-kicker').textContent = UI.endKicker(CH, CH === book.count, name.plain);
document.getElementById('end-q').innerHTML = meta.endQ;
const chapterUrl = (n, b = BOOK) => { const q = new URLSearchParams(location.search); q.set('book', b); q.set('ch', n); q.delete('only'); return `${location.pathname}?${q}`; };
const homeUrl = () => { const q = new URLSearchParams(location.search); ['book', 'ch', 'only'].forEach((k) => q.delete(k)); const qs = q.toString(); return location.pathname + (qs ? '?' + qs : ''); };

// the closing card offers the next chapter when it is ready
const nextBtn = document.getElementById('next');
if (READY.includes(CH + 1)) {
  nextBtn.hidden = false;
  nextBtn.textContent = UI.next(CH + 1);
  nextBtn.addEventListener('click', () => goToChapter(BOOK, CH + 1));
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

/* ---------- the stage curtain: closed in front of the library, parting on a chapter's first scene ---------- */
function drawDrape() {
  const W = innerWidth, H = innerHeight, c = makeCutter(11), hw = Math.ceil(W / 2) + 24;
  const half = (dir) => {
    let folds = '';
    for (let x = 30; x < hw; x += 64) folds += c.ribbon([[x, -20], [x + c.rr(-5, 5), H + 20]], c.rr(12, 24));
    const body = c.cut([[0, -20], [hw, -20], [hw, H + 20], [0, H + 20]], 1, 40);
    const hem = dir < 0 ? c.cut([[hw - 30, -20], [hw, -20], [hw, H + 20], [hw - 30, H + 20]], 1, 30) : c.cut([[0, -20], [30, -20], [30, H + 20], [0, H + 20]], 1, 30);
    return `<svg viewBox="0 0 ${hw} ${H}" preserveAspectRatio="none"><path d="${body}" fill="${C.curtain}"/><path d="${folds}" fill="${C.curtain2}" opacity=".45"/>
      <path d="${hem}" fill="${shade(C.curtain, 0.18)}"/><path d="${body}" class="grain"/></svg>`;
  };
  const vy = Math.min(90, H * 0.1);
  const pts = [[-10, -10], [W + 10, -10], [W + 10, vy]];
  for (let x = W + 10; x > -60; x -= 80) pts.push(...c.arc(x - 40, vy, 40, 26, 0, Math.PI, 6));
  let tassels = '';
  for (let x = -30; x < W + 40; x += 80) tassels += c.cut(c.circ(x, vy + 38, 5, 8), 0.2, 3);
  const val = c.cut(pts, 0.6, 12);
  const el = document.getElementById('drape');
  el.querySelector('.dr-l').innerHTML = half(-1);
  el.querySelector('.dr-r').innerHTML = half(1);
  el.querySelector('.dr-val').innerHTML = `<svg viewBox="0 0 ${W} ${vy + 50}"><path d="${val}" fill="${C.curtain2}"/><path d="${tassels}" fill="${C.ochre}"/><path d="${val}" class="grain"/></svg>`;
}
const drapeEl = document.getElementById('drape');
const root = document.documentElement;
let drapeT = 0;
// close: the two halves swing in from the wings (the caption, tag and thread step back first)
function closeDrape(ms = 850) {
  clearTimeout(drapeT); clearTimeout(furnT);
  root.classList.add('drape-on');
  if (!drapeEl.classList.contains('on')) { drapeEl.classList.add('snap', 'open', 'on'); void drapeEl.offsetWidth; drapeEl.classList.remove('snap'); }
  drapeEl.classList.remove('open');
  return new Promise((r) => { drapeT = setTimeout(r, ms); });
}
// open: the halves draw back to the wings and the valance lifts, revealing the scene
// (the caption and the tag come back once the gap is wide, not over the closed curtain)
let furnT = 0;
function openDrape() {
  clearTimeout(drapeT); clearTimeout(furnT);
  drapeEl.classList.add('open');
  furnT = setTimeout(() => root.classList.remove('drape-on'), 750);
  drapeT = setTimeout(() => drapeEl.classList.remove('on'), 1500);
}
if (LIB || AUTO) { drapeEl.classList.add('on'); root.classList.add('drape-on'); }

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
// "From the beginning" turns the page back to the chapter's title
function goHome() {
  if (theatre.g < 0.4) scrollTo({ top: 0, behavior: 'smooth' });
  else theatre.turnTo(0, { title: name.plain, ref: UI.chapterName(CH) });
}
const homeBtn = document.getElementById('home');
homeBtn.setAttribute('aria-label', UI.home);
homeBtn.title = UI.home;
const backBtn = document.getElementById('back');
backBtn.title = UI.home;
document.getElementById('again').addEventListener('click', goHome);
window.__theatre = theatre;

/* ---------- the library (home page) ---------- */
const library = createLibrary({
  el: document.getElementById('library'), ui: UI, lang: LANG, books: BOOKS, groups: GROUPS, loadMeta,
  here: LIB ? LAST : { book: BOOK, ch: CH },
  onPick: goToChapter,
});
document.getElementById('library').setAttribute('aria-label', UI.books);
// from a chapter back to the library, with this book already open
let resumeAt = 0; // where the reader was, for the browser's back button
// the curtain falls, and the library comes up in front of it
function toLibrary(id) {
  closeDrape().then(() => { theatre.seek(0); library.show(id); });
}
function openLibrary() {
  if (library.open) return;
  resumeAt = theatre.g;
  history.pushState(null, '', homeUrl());
  toLibrary(BOOK);
}
// the eyelet of the hanging tag, its "Home" chip and the title card's chip all lead to the library
homeBtn.addEventListener('click', openLibrary);
backBtn.addEventListener('click', openLibrary);
document.getElementById('cover-toc').addEventListener('click', openLibrary);

// into the play: behind the closed curtain the stage is set at the first sentence, then the curtain parts
function enterPlay() {
  root.classList.add('entering');
  theatre.enter();
  setTimeout(openDrape, 250);
  setTimeout(() => root.classList.remove('entering'), 1600);
}
function goToChapter(b, n) {
  if (b === BOOK && n === CH) {
    history.pushState(null, '', chapterUrl(n));
    library.hide().then(enterPlay);
    return;
  }
  store.set('autostart', `${b}:${n}`, sessionStorage);
  root.classList.add('leaving');
  // from the library the curtain is already closed; from a chapter's closing card it falls first
  (drapeEl.classList.contains('on') && !drapeEl.classList.contains('open') ? new Promise((r) => setTimeout(r, 320)) : closeDrape())
    .then(() => { location.href = chapterUrl(n, b); });
}
// the browser's back / forward buttons move between the library and the chapter
addEventListener('popstate', () => {
  const q = new URLSearchParams(location.search);
  if (!q.get('book')) { if (!library.open) toLibrary(); return; }
  if (q.get('book') !== BOOK || +q.get('ch') !== CH) { location.reload(); return; }
  if (library.open) library.hide().then(() => { theatre.seek(resumeAt > 0.5 ? resumeAt : 0); openDrape(); });
});
// coming back to a page kept in memory after leaving it for another chapter
addEventListener('pageshow', (ev) => { if (ev.persisted) root.classList.remove('leaving'); });
// remember the chapter once the reader is into it: the library marks it, and home stands in front of it
if (!LIB) addEventListener('scroll', function mark() {
  if (theatre.g < 1) return;
  store.set('last', `${BOOK}:${CH}`);
  removeEventListener('scroll', mark);
}, { passive: true });

// the narrator: only chapters with recorded narration (audio/<book>/<ch>/<lang>.json) get the controls
import('./core/voice.js').then((m) => m.startNarrator(theatre, { book: BOOK, ch: CH, lang: LANG, title: `${name.plain} · ${UI.chapterName(CH)}` }))
  .then((n) => { window.__narrator = n; }).catch((err) => console.warn('narrator unavailable', err));

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
if (LIB) library.show();
else if (AUTO && !location.hash) enterPlay();
