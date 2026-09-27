// J 20,30–31 — The first epilogue, the Evangelist's. The seven sign-medallions of this Gospel hang in an arc — the
// wine at Cana, the official's son, the man at the pool, the loaves, the walking on the water, the man born blind,
// Lazarus — and beyond them, fainter and fainter into the distance, many more signs without names; a few disciples
// stand at either side and look up at them. Below lies an open book. "But these are written": the seven fly down
// into its pages and the pages fill with lines; the faint ones fade. "So that you may believe that Jesus is the
// Christ, the Son of God": the book lifts and turns towards us, golden words above it. "And that believing you may
// have life in His name": light pours out of the book towards the reader, flowers open round it and small flames rise.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { TW, sevenSigns, faintSign, openBook, goldWord, strip, rayBurst, glowDisc, soulLight, blooms, skyKeys, tr, sky, PI } from './lib.js';

const DUSK = ['#2a2f60', '#6a5f8e', '#c9a2a0'];
const GOLDEN = ['#e8c98f', '#f6dfb0', '#fbefd4'];
const ROSE = ['#9f8cb8', '#e1b1a6', '#f6d6b8'];
const BOOK = { x: 800, y: 700 };

export default {
  id: 'j20-book',
  beats: [
    { v: 30 },
    { v: 31, text: 'Te zaś zapisano,' },
    { v: 31, cont: true, text: 'abyście wierzyli, że Jezus jest Mesjaszem, Synem Bożym,' },
    { v: 31, cont: true, text: 'i abyście wierząc mieli życie w imię Jego.' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DUSK);
    // many other signs, far away and faint
    const far = S.layer({ par: 0.12, sh: 1 });
    let fm = '';
    for (let i = 0; i < 46; i++) {
      const x = c.rr(-500, 2100), y = c.rr(40, 520), r = c.rr(10, 20), o = c.rr(0.25, 0.6);
      if (x > 380 && x < 1220 && y > 180 && y < 380) continue;
      fm += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})" opacity="${o.toFixed(2)}"><path d="M0 -1400V${-r - 4}" stroke="rgba(74,54,34,.35)" stroke-width="1" fill="none"/>${faintSign(c, r)}</g>`;
    }
    const faint = far.add(`<g>${fm}</g>`);
    // the light behind the book
    const back = S.layer({ par: 0.45, sh: 0, flat: true });
    const rays = back.add(`<g>${glowDisc(360, 'halo-glow', 1)}${rayBurst(c, { n: 28, r0: 60, r1: 1200, spread: 0.04, o: 0.5 })}</g>`);
    // the disciples, three on each side, looking up
    const PL = S.layer({ par: 0.5, sh: 5 });
    const DIS = [['peter', 470], ['john', 540], ['andrew', 405], ['thomas', 1130], ['james', 1060], ['matthew', 1195]].map(([k, x], i) => ({ x, i, p: S.puppet(PL.add(person(c, { ...(k === 'thomas' ? CAST.thomas : TW[k]) }))), seed: c.rr(0, 9) }));
    // the book
    const bL = S.layer({ par: 0.55, sh: 7 });
    const bloomEls = [-230, -170, 170, 230, -120, 120].map((dx, i) => ({ dx, i, el: bL.add(`<g>${blooms(c, 70, 5)}</g>`) }));
    const book = bL.add(`<g>${openBook(c, 340, 210)}</g>`);
    const glowB = book.querySelector('.glow'), linesL = book.querySelector('.linesL'), linesR = book.querySelector('.linesR');
    // the seven signs
    const sL = S.layer({ par: 0.52, sh: 5 });
    const SEVEN = sevenSigns(c, 40).map((m, i) => {
      const a = PI * (1.14 + (i / 6) * 0.72);
      const R = S.portrait ? 250 : 360;
      return { i, x: 800 + Math.cos(a) * R, y: 520 + Math.sin(a) * 300, el: hanging(sL, m, { x: 0, y: 0, len: 700 }) };
    });
    const fx = S.layer({ par: 0.6, sh: 4 });
    const more = fx.add(`<g>${strip(c, tr('…i wiele innych znaków', '…and many other signs'), { size: 18 })}</g>`);
    const title = fx.add(`<g>${goldWord(c, tr('Jezus – Mesjasz, Syn Boży', 'Jesus – the Christ, the Son of God'), { size: 30 })}</g>`);
    const life = fx.add(`<g>${goldWord(c, tr('życie w imię Jego', 'life in His name'), { size: 26, fill: C.cream, ink: C.terracotta })}</g>`);
    const flames = Array.from({ length: 12 }, (_, i) => ({ i, dx: c.rr(-150, 150), el: fx.add(`<g>${soulLight(c, 8 + (i % 3) * 2)}</g>`), sp: c.rr(0.8, 1.2) }));

    return (t, T) => {
      skyKeys(sk, t, [[0.9, DUSK], [1.7, ROSE], [2.5, GOLDEN]]);
      /* v30: the seven signs, and many more beyond, not written */
      fade(faint, es(t, 0.05, 0.4) * (1 - es(t, 1.2, 1.6)));
      const mk = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(more, { x: 800, y: 395, s: mk, r: -2, o: mk > 0.01 ? 1 : 0 });
      const into = es(t, 1.05, 1.6, ease.in);
      SEVEN.forEach((m) => {
        const k = es(t, 0.02 + m.i * 0.05, 0.3 + m.i * 0.05, ease.back);
        const d = seg(into, m.i * 0.06, 0.6 + m.i * 0.06);
        const x = lerp(m.x, BOOK.x + (m.i - 3) * 30, d), y = lerp(lerp(-700, m.y, k), BOOK.y - 110, d);
        swing(m.el, x, y, k > 0.001 && d < 0.01 ? T : 0, 1.2, 0.8, m.i);
        pose(m.el.querySelector('.obj'), { s: 1 - d * 0.85 });
        fade(m.el, d < 0.98 ? 1 : 0);
      });
      /* v31a: these are written — the pages fill */
      const wr = es(t, 1.3, 1.8);
      attr(linesL, 'opacity', wr); attr(linesR, 'opacity', es(t, 1.5, 1.95));
      /* v31b: so that you may believe — the book turns to us */
      const lift = es(t, 2.05, 2.5);
      const pourK = es(t, 3.05, 3.6);
      pose(book, { x: BOOK.x, y: BOOK.y - lift * 60, s: 1.1 + lift * 0.35 + pourK * 0.1, r: 0 });
      attr(glowB, 'opacity', Math.min(1, wr * 0.5 + lift * 0.5 + pourK * 0.3));
      const tk = es(t, 2.2, 2.45, ease.back) * (1 - es(t, 2.95, 3.1) * 0.0);
      pose(title, { x: 800, y: 170 + pourK * 0, s: tk * (1 - pourK * 0.15), o: tk > 0.01 ? 1 : 0 });
      /* v31c: life in His name — the light pours out towards us */
      pose(rays, { x: BOOK.x, y: BOOK.y - 160 - lift * 40, s: 0.3 + lift * 0.4 + pourK * 0.8, r: T * 2, o: 0.2 + wr * 0.2 + lift * 0.3 + pourK * 0.3 });
      bloomEls.forEach((b) => {
        const k = es(t, 3.1 + b.i * 0.06, 3.35 + b.i * 0.06, ease.back);
        pose(b.el, { x: BOOK.x + b.dx * (1 + pourK * 0.3), y: BOOK.y + 20 + (b.i > 3 ? 18 : 0), s: k * 1.6, o: k > 0.01 ? 1 : 0 });
      });
      flames.forEach((f) => {
        const k = seg(t, 3.15 + f.i * 0.05, 3.9 + f.i * 0.03);
        pose(f.el, { x: BOOK.x + f.dx * (0.4 + k), y: BOOK.y - 200 - k * 380 * f.sp, s: 0.6 + k * 0.6, o: k > 0 && k < 1 ? Math.sin(k * PI) : 0 });
      });
      const lk = es(t, 3.25, 3.5, ease.back);
      pose(life, { x: 800, y: 250, s: lk, r: 1, o: lk > 0.01 ? 1 : 0 });
      /* the disciples look up at the signs, then at the book */
      DIS.forEach((d) => {
        const flip = d.x > 800;
        d.p.set({ x: d.x, y: 760 - (d.i % 3 === 2 ? 14 : 0), s: 0.82, flip, armF: 20 + bump(t, 0.3, 1.0) * 40 + pourK * 30, armB: 10 + pourK * 60, head: -12 * (1 - into) + into * 8 - pourK * 8, blink: blinkAt(T, d.seed), o: 1 - es(t, 2.1, 2.4) * 0.999 });
      });

      S.cam.x = 0;
      S.cam.y = 20 - es(t, 2, 2.5) * 30;
      S.cam.z = (1.02 + es(t, 3.0, 3.7) * 0.08) * (S.portrait ? 0.92 : 1);
    };
  },
};
