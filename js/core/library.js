// The home page: the books stand as paper cards in front of the closed curtains. Tapping one lifts it
// to the middle, // the card lifts to the side and a parchment scroll of its chapters unrolls beneath it, each chapter with the
// line from its title page. Picking a chapter hands it to onPick.
import { makeCutter, sheet } from './paper.js';
import { band } from '../assets/nature.js';
import { EMBLEMS } from '../assets/emblems.js';

const AW = 240, AH = 170; // the little diorama at the top of each card

// the card's picture: a sky, a paper sun, two bands of hills and the evangelist's creature hanging on a thread
function cardArt(id, look) {
  const c = makeCutter('card-' + id);
  const win = c.cut(c.rect(0, 0, AW, AH), 1, 14);
  const lay = (k, markup) => `<g class="cut" style="--k:${k}">${markup}</g>`;
  let stars = '';
  if (look.stars) for (let i = 0; i < 16; i++) stars += c.cut(c.star(c.rr(10, AW - 10), c.rr(8, 92), c.rr(2.2, 3.6), c.rr(0.9, 1.4), 4, c.rr(0, 1)), 0.1, 3);
  const far = band(c, { y: 132, amps: [5, 2.5], lens: [260, 90], x0: -20, x1: AW + 20, bottom: AH + 20, color: look.hills[0], step: 8, j: 0.6 });
  const near = band(c, { y: 152, amps: [4, 2], lens: [200, 70], x0: -20, x1: AW + 20, bottom: AH + 20, color: look.hills[1], step: 8, j: 0.6 });
  const sun = sheet().p(c.cut(c.circ(AW / 2, 74, 60, 48), 0.6, 6), look.sun).out();
  const S = 0.9, EY = 78;
  return `<svg viewBox="0 0 ${AW} ${AH}" aria-hidden="true" focusable="false">
    <defs><clipPath id="win-${id}"><path d="${win}"/></clipPath>
      <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${look.sky[0]}"/><stop offset="1" stop-color="${look.sky[1]}"/></linearGradient></defs>
    <g clip-path="url(#win-${id})">
      <rect width="${AW}" height="${AH}" fill="url(#sky-${id})"/><path d="${win}" class="grain"/>
      ${stars ? `<path d="${stars}" fill="#fff4d6" opacity=".85"/>` : ''}
      <circle cx="${AW / 2}" cy="74" r="84" fill="url(#halo-glow)" opacity=".7"/>
      ${lay(2, sun)}
      ${lay(3, far.markup)}
      <path d="M${AW / 2} -4V${EY - 50 * S}" stroke="rgba(74,54,34,.5)" stroke-width=".8"/>
      <g transform="translate(${AW / 2} ${EY}) scale(${S})">${lay(6, EMBLEMS[look.emblem](c))}</g>
      ${lay(4, near.markup)}
    </g>
    <path d="${win}" fill="none" stroke="rgba(74,54,34,.28)" stroke-width="1.2"/>
  </svg>`;
}

// the card's paper outline: a slightly uneven rectangle, a little different for every book
function deckle(id) {
  const c = makeCutter('deckle-' + id);
  const pts = [[0, 0], [33, 0], [67, 0], [100, 0], [100, 34], [100, 67], [100, 100], [66, 100], [33, 100], [0, 100], [0, 66], [0, 33]]
    .map(([x, y]) => [x + (x === 0 ? 1 : x === 100 ? -1 : 0) * c.rr(0, 1.2), y + (y === 0 ? 1 : y === 100 ? -1 : 0) * c.rr(0, 1)]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(', ')})`;
}

export function createLibrary({ el, ui, lang, books, groups, loadMeta, here, onPick, onHide }) {
  const $ = (sel) => el.querySelector(sel);
  const root = document.documentElement;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const multi = groups.length > 1;

  el.innerHTML = `
    <header class="lib-head">
      <span class="lib-strings" aria-hidden="true"></span>
      <div class="lib-banner">
        <svg class="grain-fill" aria-hidden="true" focusable="false"><rect width="100%" height="100%" fill="url(#grain)"/></svg>
        <p class="lib-kicker">${ui.libKicker}</p>
        <h1 class="lib-title">${multi ? ui.libBible : groups[0].name[lang]}</h1>
        <p class="lib-sub">${ui.libSub}</p>
      </div>
    </header>
    <div class="shelves"></div>
    <div class="booklet" hidden>
      <div class="bk-cover"></div>
      <div class="bk-scroll" role="dialog" aria-modal="false">
        <span class="rod" aria-hidden="true"></span>
        <div class="bk-sheet">
          <svg class="grain-fill" aria-hidden="true" focusable="false"><rect width="100%" height="100%" fill="url(#grain)"/></svg>
          <div class="bk-head"><p class="bk-kicker"></p><button type="button" class="chip bk-close">${ui.libBack}</button></div>
          <ol class="toc"></ol>
        </div>
        <span class="rod rod-end" aria-hidden="true"></span>
      </div>
    </div>`;
  const shelvesEl = $('.shelves'), booklet = $('.booklet'), coverEl = $('.bk-cover'), pagesEl = $('.bk-scroll'), sheetEl = $('.bk-sheet'), rodEnd = $('.rod-end'), toc = $('.toc');

  /* ---------- the shelves: one card per book ---------- */
  const cards = {};
  for (const gr of groups) {
    const shelf = document.createElement('section');
    shelf.className = 'shelf';
    shelf.setAttribute('aria-label', gr.name[lang]);
    if (multi) shelf.innerHTML = `<h2 class="shelf-name">${gr.name[lang]}</h2>`;
    const row = document.createElement('div');
    row.className = 'cards';
    for (const id of gr.books) {
      const b = books[id], nm = b.name[lang], ready = b.READY.length > 0;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'book-card';
      card.disabled = !ready;
      card.style.setProperty('--accent', b.look.accent);
      card.style.setProperty('--tilt', `${(makeCutter('tilt-' + id).rr(-1.4, 1.4)).toFixed(2)}deg`);
      card.setAttribute('aria-label', `${nm.plain} · ${ui.chapterCount(b.count)}`);
      card.innerHTML = `<span class="bc-paper" style="clip-path:${deckle(id)}">
          <svg class="grain-fill" aria-hidden="true" focusable="false"><rect width="100%" height="100%" fill="url(#grain)"/></svg>
          <span class="bc-art">${cardArt(id, b.look)}</span>
          <span class="bc-kicker">${nm.card[0]}</span>
          <span class="bc-name">${nm.card[1]}</span>
          <span class="bc-count">${ui.chapterCount(b.count)}</span>
        </span>${here && here.book === id ? `<span class="bc-ribbon" aria-hidden="true"></span>` : ''}`;
      card.addEventListener('pointerenter', () => metas(id), { once: true });
      card.addEventListener('click', () => unfold(id));
      row.appendChild(card);
      cards[id] = card;
    }
    shelf.appendChild(row);
    shelvesEl.appendChild(shelf);
  }

  /* ---------- chapter lines, fetched per book the first time it is looked at ---------- */
  const metaCache = {};
  function metas(id) {
    const b = books[id];
    return (metaCache[id] ||= Promise.all(Array.from({ length: b.count }, (_, i) => (b.READY.includes(i + 1) ? loadMeta(id, i + 1) : null))));
  }
  const line = (m) => (m ? m[lang].coverSub.replace(/<br\s*\/?>/g, ' ') : '');

  function fillToc(id) {
    const b = books[id];
    toc.innerHTML = '';
    toc.style.setProperty('--accent', b.look.accent);
    const rows = [];
    for (let n = 1; n <= b.count; n++) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toc-row';
      btn.style.setProperty('--i', n - 1);
      btn.innerHTML = `<span class="toc-n" aria-hidden="true">${n}</span><span class="toc-t"><span class="sr">${ui.chapterName(n)}: </span><span class="toc-line"></span></span>`;
      if (!b.READY.includes(n)) btn.disabled = true;
      else btn.addEventListener('click', () => pick(id, n, btn));
      if (here && here.book === id && here.ch === n) { btn.classList.add('here'); btn.setAttribute('aria-current', 'true'); }
      li.appendChild(btn);
      toc.appendChild(li);
      rows.push(btn);
    }
    metas(id).then((ms) => { if (openId === id) ms.forEach((m, i) => { rows[i].querySelector('.toc-line').textContent = line(m); }); });
  }

  /* ---------- unfolding a book ---------- */
  let openId = null, busy = false;
  const EASE = 'cubic-bezier(.3, .7, .2, 1)';
  const flyFrom = (from, to) => `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;

  function unfold(id, { instant = false } = {}) {
    if (busy || openId) return;
    const card = cards[id], b = books[id];
    openId = id;
    const quick = instant || reduced();
    el.classList.add('unfolded');
    root.classList.add('lib-book');
    booklet.hidden = false;
    booklet.style.setProperty('--accent', b.look.accent);
    coverEl.innerHTML = card.innerHTML.replace(/(win|sky)-/g, 'bk$1-'); // its own svg ids
    coverEl.style.setProperty('--tilt', '0deg');
    $('.bk-kicker').textContent = `${ui.chapters} · ${b.count}`;
    pagesEl.setAttribute('aria-label', `${b.name[lang].plain} · ${ui.chapters}`);
    fillToc(id);
    const here_ = toc.querySelector('.here');
    toc.scrollTop = 0; el.scrollTop = 0;
    if (quick) { card.style.visibility = 'hidden'; focusIn(here_); return; }
    busy = true;
    const from = card.getBoundingClientRect(), to = coverEl.getBoundingClientRect();
    card.style.visibility = 'hidden';
    coverEl.animate([{ transform: flyFrom(from, to) + ` rotate(${card.style.getPropertyValue('--tilt')})` }, { transform: 'none' }], { duration: 480, easing: EASE });
    shelvesEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in' });
    roll(true, 320).then((anims) => { anims.forEach((x) => x.cancel()); busy = false; focusIn(here_); });
  }
  // the scroll unrolls: its lower rod travels down and the parchment shows behind it (or rolls back up)
  function roll(open, delay = 0) {
    const h = sheetEl.offsetHeight;
    const shut = [{ clipPath: 'inset(0 0 100% 0)' }, { transform: `translateY(${-h}px)` }], full = [{ clipPath: 'inset(0 0 0 0)' }, { transform: 'none' }];
    const [a, b] = open ? [shut, full] : [full, shut];
    const o = open ? { duration: 720, delay: delay + 140, easing: 'cubic-bezier(.3, .75, .25, 1)', fill: 'both' } : { duration: 380, delay, easing: 'cubic-bezier(.55, 0, .8, .45)', fill: 'forwards' };
    const anims = [
      sheetEl.animate([a[0], b[0]], o),
      rodEnd.animate([a[1], b[1]], o),
      pagesEl.animate(open ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 1, offset: 0.85 }, { opacity: 0 }], open ? { duration: 180, delay, fill: 'backwards' } : o),
    ];
    return anims[1].finished.then(() => anims);
  }
  function focusIn(hereRow) {
    if (hereRow) hereRow.scrollIntoView({ block: 'center' });
    (hereRow || toc.querySelector('.toc-row:not(:disabled)'))?.focus({ preventScroll: true });
  }

  function fold({ instant = false } = {}) {
    if (!openId || busy) return Promise.resolve();
    const id = openId, card = cards[id];
    const done = () => {
      booklet.hidden = true;
      el.classList.remove('unfolded');
      root.classList.remove('lib-book');
      card.style.visibility = '';
      openId = null; busy = false;
      card.focus({ preventScroll: true });
    };
    if (instant || reduced()) { done(); return Promise.resolve(); }
    busy = true;
    return roll(false).then((rolled) => {
      const to = card.getBoundingClientRect(), from = coverEl.getBoundingClientRect();
      el.classList.remove('unfolded');
      root.classList.remove('lib-book');
      shelvesEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 340, delay: 120, easing: 'ease-out', fill: 'backwards' });
      const fly = coverEl.animate([{ transform: 'none' }, { transform: flyFrom(to, from) + ` rotate(${card.style.getPropertyValue('--tilt')})` }], { duration: 420, easing: EASE, fill: 'forwards' });
      return fly.finished.then(() => { rolled.forEach((x) => x.cancel()); fly.cancel(); done(); });
    });
  }

  /* ---------- picking a chapter ---------- */
  function pick(id, n, btn) {
    if (busy) return;
    btn.classList.add('picked');
    onPick(id, n);
  }

  /* ---------- showing / hiding the whole library ---------- */
  function show(id) {
    root.classList.add('lib-on');
    el.inert = false;
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced() ? 0 : 380, easing: 'ease-out' });
    if (id && books[id]) requestAnimationFrame(() => unfold(id));
    else cards[Object.keys(cards)[0]]?.focus({ preventScroll: true });
  }
  function hide() {
    if (!root.classList.contains('lib-on')) return Promise.resolve();
    const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduced() ? 0 : 320, easing: 'ease-in', fill: 'forwards' });
    return a.finished.then(() => {
      root.classList.remove('lib-on');
      el.inert = true;
      a.cancel();
      fold({ instant: true });
      onHide?.();
    });
  }

  // tapping the curtain around the open book, the back chip or Escape folds it up again
  $('.bk-close').addEventListener('click', () => fold());
  el.addEventListener('click', (ev) => { if (openId && !ev.target.closest('.bk-scroll, .bk-cover')) fold(); });
  addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && openId && root.classList.contains('lib-on')) fold(); });

  return { show, hide, unfold, fold, get open() { return root.classList.contains('lib-on'); } };
}
