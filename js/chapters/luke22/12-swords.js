// Łk 22,35–38 — "When I sent you out without purse, bag or sandals, did you lack anything?" Three round plates come
// down with the purse, the bag and the sandals, each struck through; "Nothing," they say — and a green tick. "But now":
// the purse and the bag are taken up again, and the cloak on the third plate is traded for a sword. "It is written: He
// was counted with the transgressors" — a scroll with those words; "what concerns me has an end" — an hourglass runs
// out. "Lord, look, here are two swords" — two of them hold them up. "That is enough": He lifts a quiet hand, and they
// lower them.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, NIGHTROOM, TW, kf, hand, headAt, discPlate, purse, bag, sandals, crossX, tick, sword, foldedCloth, hourglassParts, withFace, faceBits,
  person, speech, sheet, hanging, vis, pose, fade, lerp, mix, blinkAt, tr, C, PI, FONT,
} from './lib.js';

export default {
  id: 'lk22-swords',
  beats: [
    { v: 35, text: 'I rzekł do nich: «Czy brak wam było czego, kiedy was posyłałem bez trzosa, bez torby i bez sandałów?»' },
    { v: 35, cont: true, text: 'Oni odpowiedzieli: «Niczego».' },
    { v: 36 },
    { v: 37, text: 'Albowiem powiadam wam: to, co jest napisane, musi się spełnić na Mnie: Zaliczony został do złoczyńców.' },
    { v: 37, cont: true, text: 'To bowiem, co się do Mnie odnosi, dochodzi kresu».' },
    { v: 38, text: 'Oni rzekli: «Panie, tu są dwa miecze».' },
    { v: 38, cont: true, text: 'Odpowiedział im: «Wystarczy».' },
  ],
  cam: { x: [-40, 40], y: [0, 200], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: NIGHTROOM });
    const { R, at, by, SEAT, TOP } = T0;
    if (S.portrait) at.forEach((m) => { m.x = 800 + (m.x - 800) * 0.76; });   // phone: the thirteen sit closer so the table fits
    const J = by.jesus;
    // Peter and James holding up the two swords (in front of the diners, behind the table)
    const SW = ['peter', 'james'].map((k) => {
      const m = by[k];
      const el = T0.midL.add(withFace(person(c, { ...TW[k], pose: 'sit', holdF: `<g transform="rotate(180)">${sword(c, 54)}</g>` }), faceBits(c)));
      return { k, m, p: S.puppet(el) };
    });
    const fx = S.layer({ par: 0.58, sh: 4 });
    const kit = [
      { icon: `<g transform="translate(0 2) scale(.95)">${purse(c)}</g>`, x: 620 },
      { icon: `<g transform="translate(0 -4) scale(1.1)">${bag(c)}</g>`, x: 800 },
      { icon: `<g class="sd" transform="translate(0 -4) scale(1.2)">${sandals(c)}</g><g class="cloak" opacity="0" transform="translate(0 12)">${foldedCloth(c, 64, 20, C.clayMantle)}</g><g class="sw" opacity="0" transform="translate(0 30) rotate(-40) scale(1.1)">${sword(c, 56)}</g>`, x: 980 },
    ].map((d, i) => {
      const el = hanging(fx, discPlate(c, `${d.icon}<g class="x">${crossX(c, 30)}</g>`, { r: 54, rim: C.ochre }), { x: 0, y: -1500, len: 700 });
      return { ...d, i, el, x_: el.querySelector('.x'), cloak: el.querySelector('.cloak'), sw: el.querySelector('.sw'), sd: el.querySelector('.sd') };
    });
    const tickEl = hanging(fx, discPlate(c, tick(c, 30), { r: 40, rim: C.moss }), { x: 0, y: -1500, len: 700 });
    // the scroll of Isaiah with the words
    const scrollM = (() => {
      const w = 360, h = 120, s = sheet();
      s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 0.5, 8), C.parchment);
      s.p(c.cut(c.rect(-w / 2 - 12, -h / 2 - 8, 14, h + 16), 0.3, 5) + c.cut(c.rect(w / 2 - 2, -h / 2 - 8, 14, h + 16), 0.3, 5), C.wood2);
      const tx = (y, str, size, col) => `<text x="0" y="${y}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${col}">${str}</text>`;
      return `${s.out()}${tx(-22, tr('Iz 53,12', 'Isaiah 53:12'), 15, C.terracotta)}${tx(10, tr('«Zaliczony został', '“He was counted'), 22, C.ink)}${tx(38, tr('do złoczyńców»', 'with transgressors”'), 22, C.ink)}`;
    })();
    const scroll = hanging(fx, scrollM, { x: 0, y: -1500, len: 700 });
    const hg = hourglassParts(c, 110);
    const glass = hanging(fx, `<circle r="80" fill="url(#halo-glow)" opacity=".4"/>${hg.frame}<g class="top">${hg.top}</g><g class="bot" transform="translate(0 ${hg.h / 2 - 12})">${hg.bottom}</g><g class="st">${hg.stream}</g>`, { x: 0, y: -1500, len: 700 });
    const gTop = glass.querySelector('.top'), gBot = glass.querySelector('.bot'), gSt = glass.querySelector('.st');
    const enough = fx.add(`<g>${speech(c, `<path d="${c.cut([[-12, 14], [-12, -2], [-16, -10], [-12, -14], [-8, -6], [-8, -20], [-4, -22], [-2, -8], [0, -24], [4, -24], [5, -8], [8, -22], [12, -20], [10, -2], [12, 14]], 0.3, 3)}" fill="${C.skin}"/>`, { w: 56, h: 50 })}</g>`);

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0.15);
      R.stars.fade(1);

      /* v35 — without purse, bag, sandals; "Nothing" */
      const kIn = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 2.9, 3.15, ease.in));
      kit.forEach((k) => {
        const kk = es(t, 0.1 + k.i * 0.08, 0.45 + k.i * 0.08, ease.out) * (1 - es(t, 2.9, 3.15, ease.in));
        vis(k.el, { x: k.x, y: 300 - (1 - kk) * 700, r: T ? Math.sin(T * 0.8 + k.i) * 2 : 0, o: kk > 0.01 ? 1 : 0 });
        fade(k.x_, es(t, 0.5 + k.i * 0.1, 0.6 + k.i * 0.1) * (1 - es(t, 2.1 + k.i * 0.12, 2.2 + k.i * 0.12)));
      });
      const tk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(tickEl, { x: 800, y: 430 - (1 - tk) * 700, r: T ? Math.sin(T) * 2 : 0, o: tk > 0.01 ? 1 : 0 });
      // v36 — the cloak for a sword
      const k3 = kit[2];
      const trade = es(t, 2.35, 2.5), sw = es(t, 2.55, 2.7);
      fade(k3.sd, 1 - trade);
      fade(k3.cloak, trade * (1 - sw));
      fade(k3.sw, sw);

      /* v37 — the words of Isaiah; the hourglass runs out */
      const sIn = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.9, 4.15, ease.in));
      vis(scroll, { x: 800, y: 330 - (1 - sIn) * 700, r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: sIn > 0.01 ? 1 : 0 });
      const gIn = es(t, 4.05, 4.35, ease.out) * (1 - es(t, 4.9, 5.15, ease.in));
      vis(glass, { x: 800, y: 330 - (1 - gIn) * 700, s: 1.6, r: T ? Math.sin(T * 0.7) * 1.5 : 0, o: gIn > 0.01 ? 1 : 0 });
      const sand2 = seg(t, 4.3, 4.8);
      pose(gTop, { x: 0, y: -4, sy: Math.max(0.02, 1 - sand2), oy: -4 });
      pose(gBot, { x: 0, y: hg.h / 2 - 12, sy: 0.2 + sand2 * 0.8 });
      fade(gSt, sand2 > 0 && sand2 < 1 ? 1 : 0);

      /* v38 — two swords; "It is enough" */
      const show = es(t, 5.05, 5.25);
      const lower = es(t, 6.2, 6.45);
      SW.forEach((s, i) => {
        s.p.set({ x: s.m.x, y: SEAT + (s.m.i % 2) * 3, s: s.m.s, flip: s.m.flip, o: show, armF: 60 + (1 - lower) * 80 + lower * 10, armB: 14, head: -10 * (1 - lower) + lower * 10, blink: blinkAt(T, s.m.seed) });
      });
      const calm = es(t, 6.05, 6.3);
      const eb = es(t, 6.1, 6.3, ease.back);
      const [jhx, jhy] = headAt(800, SEAT, J.s, false, 62);
      vis(enough, { x: jhx + 16, y: jhy - 22, s: eb * 0.9, o: eb > 0.01 ? 1 : 0 });

      at.forEach((m) => {
        if (m.k === 'jesus') {
          T0.sit(m, T, { armF: 36 + bump(t, 0.1, 0.9) * 30 + bump(t, 2.1, 2.9) * 30, armB: 14 + calm * 110, head: -bump(t, 3.1, 3.9) * 10 + es(t, 4.1, 4.4) * 12 * (1 - calm) + calm * 6 });
          fade(m.sad, es(t, 3.1, 3.4) * 0.8);
          return;
        }
        const hasSword = s0(m.k);
        const no = bump(t, 1.05, 1.9);
        const shake = T ? Math.sin(T * 7 + m.seed) * 8 * no : 0;
        T0.sit(m, T, { o: hasSword ? 1 - show : 1, head: shake - es(t, 3.1, 3.4) * 4 + es(t, 4.1, 4.4) * 6, armF: 36 + no * 10 });
        fade(m.sad, es(t, 3.3, 3.6) * 0.6);
      });
      function s0(k) { return k === 'peter' || k === 'james'; }

      S.cam.x = 0 + (S.portrait ? 16 : 0);   // phone: the row sits clear of the progress thread
      const zk = kf(t, [[-0.3, 1.04], [4.9, 1.04], [5.2, 1.3], [6.9, 1.3]]);
      S.cam.z = S.portrait ? Math.max(1, zk - 0.12) : zk;   // phone: a little wider, so the whole table shows
      S.cam.y = kf(t, [[-0.3, 20], [4.9, 20], [5.2, 130], [6.9, 130]]);
    };
  },
};
