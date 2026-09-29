// Mt 16,8–12 — ashore at golden hour, the disciples sit on the sand round Jesus by the empty basket. "You of little
// faith": a small grey fog settles over each head. "Don't you remember?" — two sepia memory cards are let down: five
// loaves for five thousand, and the baskets taken up; seven loaves for four thousand, and their baskets. "I did not
// speak to you about bread — beware the leaven": the kneading bowls come down again. Then they understood: out of
// each bowl rises not dough but a scroll of teaching, the fog lifts and a little light comes on over every head.
import { C, person, crowdPerson, CAST, blinkAt, pose, hanging, sheet, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { loaf, speech, GLYPH, spark, basket, memoryCard, doughBowl, phylactery, templeIcon, bubbleDot, tag, headAt, hangAt, magadan, magadanFront, MG, GOLDEN, tr, PI } from './lib.js';

const GY = MG.GY + 10, JX = 800;
const SEAT = [
  { o: CAST.thomas, x: 545 }, { o: CAST.john, x: 615 }, { o: CAST.andrew, x: 685, k: 'andrew' },
  { o: CAST.peter, x: 915, k: 'peter' }, { o: CAST.james, x: 985 }, { o: CAST.matthew, x: 1055 },
];

/** a scroll of teaching rising out of a bowl (origin: its bottom centre) */
function teachScroll(c, w = 84, h = 70) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h, w, h), 0.4, 6), C.parchment);
  s.p(c.cut(c.rect(-w / 2 - 6, -h - 8, w + 12, 10), 0.3, 5) + c.cut(c.rect(-w / 2 - 6, -4, w + 12, 10), 0.3, 5), C.wood3);
  let ln = '';
  for (let i = 0; i < 5; i++) ln += c.ribbon([[-w / 2 + 10, -h + 12 + i * 11], [w / 2 - 10 - c.rr(0, 16), -h + 12 + i * 11]], 1.6);
  s.x(ln, C.ink, 'opacity=".55"');
  return s.out();
}

export default {
  id: 'mt16-remember',
  beats: [
    { v: 8 },
    { v: 9 },
    { v: 10 },
    { v: 11 },
    { v: 12 },
  ],
  cam: { x: [-20, 20], y: [-80, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const M = magadan(S, { skies: [GOLDEN], sunAt: [1250, 320] });

    /* ---------- two memory cards ---------- */
    const cardL = S.layer({ par: 0.07, sh: 7 });
    const CW = 330, CH = 230;
    const mkCard = (nLoaves, crowdN, label, nBaskets) => {
      let crowdM = '';
      for (let i = 0; i < crowdN; i++) {
        const row = i % 3, x = -CW / 2 + 16 + ((i * 37) % (CW - 30)), y = 124 + row * 16;
        crowdM += `<g transform="translate(${x} ${y}) scale(${(0.17 + row * 0.02) * (x > 0 ? -1 : 1)} ${0.17 + row * 0.02})">${person(c, { ...crowdPerson(c), pose: 'sit' })}</g>`;
      }
      const hill = sheet().p(c.ridge(c.wave(104, [6, 2], [240, 80]), -CW / 2, CW / 2, CH, 10, 0.6), mix(C.sand, C.hillMid, 0.4)).out();
      const clip = S.id('mc' + nLoaves);
      return `${memoryCard(c, CW, CH)}<defs><clipPath id="${clip}"><rect x="${-CW / 2}" y="0" width="${CW}" height="${CH}"/></clipPath></defs><g clip-path="url(#${clip})" opacity=".85">${hill}${crowdM}</g><g transform="translate(${CW / 2 - 50} 12)">${tag(c, label, { size: 18, w: 76, fill: C.parchment })}</g>`;
    };
    const cards = [
      { x: 610, n: 5, nb: 12, el: hanging(cardL, mkCard(5, 24, '5000', 12), { x: 610, y: 170, len: 900 }) },
      { x: 1000, n: 7, nb: 7, el: hanging(cardL, mkCard(7, 18, '4000', 7), { x: 1000, y: 170, len: 900 }) },
    ].map((cd, j) => ({
      ...cd, j,
      lf: Array.from({ length: cd.n }, () => cardL.add(`<g>${loaf(c, 11)}</g>`)),
      bk: Array.from({ length: cd.nb }, () => cardL.add(`<g>${basket(c, { w: 22, h: 16, full: true })}</g>`)),
    }));

    /* ---------- the kneading bowls, and the scrolls of teaching ---------- */
    const plL = S.layer({ par: 0.08, sh: 7 });
    const plate = (icon, word) => {
      const s = sheet().p(c.cut(c.circ(0, 0, 104, 44), 0.6, 6), C.ochre).p(c.cut(c.circ(0, 0, 96, 44), 0.6, 6), C.cream).out();
      return `${s}<g transform="translate(0 44)">${doughBowl(c, { w: 120 })}</g><g transform="translate(58 -56)">${icon}</g><g transform="translate(0 104)">${tag(c, word, { size: 17 })}</g>`;
    };
    const PX = S.portrait ? [620, 980] : [570, 1030];
    const plates = [
      { x: PX[0], el: hanging(plL, plate(`<g transform="scale(1.3)">${phylactery(c)}</g>`, tr('faryzeusze', 'Pharisees')), { x: PX[0], y: 270, len: 900 }) },
      { x: PX[1], el: hanging(plL, plate(templeIcon(c, 1.1), tr('saduceusze', 'Sadducees')), { x: PX[1], y: 270, len: 900 }) },
    ].map((p, i) => ({ ...p, i, dough: p.el.querySelector('.dough'), scroll: plL.add(`<g>${teachScroll(c)}</g>`), word: plL.add(`<g>${tag(c, tr('nauka', 'teaching'), { size: 18, fill: C.halo })}</g>`) }));
    const bubsL = plL;
    const bubs = plates.map(() => Array.from({ length: 4 }, (_, i) => bubsL.add(`<g>${bubbleDot(c, 4 + (i % 3) * 2)}</g>`)));

    /* ---------- people on the sand ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    P.add(`<g transform="translate(${JX - 90} ${GY + 30})">${basket(c, { w: 50, h: 34 })}</g>`);
    const dis = SEAT.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, { ...d.o, pose: 'sit' }))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 3 });
    const fogs = dis.map((d) => fx.add(`<g>${cloud(c, 58, '#9f978f', '#857d75')}</g>`));
    const lights = dis.map(() => fx.add(`<g>${spark(c, 12)}</g>`));
    const qs = [0, 1].map((i) => fx.add(`<g>${speech(c, GLYPH.q(c), { w: 44, h: 44, flip: i === 1 })}</g>`));
    const noLoaf = fx.add(`<g><circle r="44" fill="${C.cream}" opacity=".0"/>${loaf(c, 26)}<path d="M-34 -30L34 22" stroke="${C.terracotta}" stroke-width="6" stroke-linecap="round"/></g>`);
    magadanFront(S);

    return (t, time) => {
      const T = time;
      M.extra[0].fade(1);
      M.update(T, { sunY: 320 + es(t, 0, 5) * 60 });

      /* v9, v10 — the memory cards; loaves, then the baskets taken up */
      cards.forEach((cd) => {
        const t0 = cd.j === 0 ? 1.05 : 2.05;
        const down = es(t, t0, t0 + 0.35, ease.back) * (1 - es(t, 3.05, 3.4));
        const cy = 170 - (1 - down) * 700;
        const sw = T ? Math.sin(T * 0.7 + cd.j) * 1 : 0;
        hangAt(cd.el, cd.x, cy, T, 0.6, 0.7, cd.j);
        const vis = cy > -200 ? 1 : 0;
        cd.lf.forEach((l, i) => {
          const k = es(t, t0 + 0.2 + i * 0.05, t0 + 0.34 + i * 0.05, ease.back);
          pose(l, { x: cd.x + (i - (cd.n - 1) / 2) * 30 + sw, y: cy + 76, s: k, o: vis * (k > 0.01 ? 1 : 0) });
        });
        const nB = cd.bk.length, per = cd.j === 0 ? 6 : 7;
        cd.bk.forEach((b, i) => {
          const k = es(t, t0 + 0.45 + i * (0.3 / nB), t0 + 0.55 + i * (0.3 / nB), ease.back);
          const row = Math.floor(i / per), col = i % per;
          pose(b, { x: cd.x + (col - (per - 1) / 2) * 34 + sw, y: cy + 200 + row * 22 - (cd.j === 0 ? 11 : 0), s: k, o: vis * (k > 0.01 ? 1 : 0) });
        });
      });

      /* v11 — "not about bread": the bowls again; v12 — their dough becomes teaching */
      const pl = es(t, 3.3, 3.65, ease.back);
      const teach = es(t, 4.08, 4.45);
      plates.forEach((p) => {
        const y = 270 - (1 - pl) * 700;
        hangAt(p.el, p.x, y, T, 1, 0.8, p.i * 2);
        const rise = es(t, 3.45 + p.i * 0.08, 3.9) * (1 - teach);
        pose(p.dough, { x: 0, y: -31, sx: 1 + rise * 0.28, sy: 1 + rise * 1.3 });
        bubs[p.i].forEach((b, j) => {
          const k = T ? ((T * 0.5 + j / 4) % 1) : 0.5;
          pose(b, { x: p.x - 30 + j * 20, y: y + 44 - rise * 60 - k * 40, s: 0.5 + k * 0.7, o: y > -200 ? rise * Math.sin(k * PI) : 0 });
        });
        pose(p.scroll, { x: p.x, y: y + 20 - teach * 60, s: 0.4 + teach * 0.6, o: y > -200 && teach > 0.01 ? 1 : 0 });
        const wk = es(t, 4.3, 4.55, ease.back);
        pose(p.word, { x: p.x, y: y + 150, s: wk, o: y > -200 && wk > 0.02 ? 1 : 0, r: T ? Math.sin(T + p.i) * 2 : 0 });
      });

      /* Jesus */
      const speak = bump(t, 0.05, 0.95);
      const remember = es(t, 1.05, 1.3) * (1 - es(t, 2.95, 3.1));
      const warn = es(t, 3.1, 3.3) * (1 - es(t, 3.95, 4.1));
      const glad = es(t, 4.1, 4.4);
      jesus.set({ x: JX, y: GY, s: 1, flip: false, armF: 16 + speak * 50 + remember * 30 + warn * 50 + glad * 40, armB: 8 + speak * 30 + remember * 110 + warn * 150 + glad * 60, head: -remember * 8 + glad * 4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, GY, 1, false);
      const nl = es(t, 3.08, 3.25, ease.back) * (1 - es(t, 3.5, 3.6));
      pose(noLoaf, { x: jhx + 70, y: jhy - 60, s: nl, o: nl > 0.02 ? 1 : 0 });

      /* the disciples: fog of little faith; they look up at the cards; then understand */
      dis.forEach((d) => {
        const up = es(t, 1.1, 1.4) * (1 - es(t, 3.1, 3.3));
        const look = d.x < JX ? (t < 2 ? 1 : 0.4) : (t >= 2 ? 1 : 0.4);
        const nod = bump(t, 4.3, 4.9);
        d.p.set({ x: d.x, y: GY + 6, s: 0.86, flip: d.x > JX, armF: 30 + bump(t, 0.05, 0.6) * 20 + up * look * 40 + es(t, 4.2, 4.5) * 30, armB: 20 + nod * 40, head: 6 - up * look * 22 + nod * 10, blink: blinkAt(T, d.seed) });
        const [hx, hy] = headAt(d.x, GY + 6, 0.86, d.x > JX, 62);
        const fog = es(t, 0.15 + d.i * 0.05, 0.4 + d.i * 0.05) * (1 - es(t, 4.05 + d.i * 0.03, 4.35 + d.i * 0.03));
        pose(fogs[d.i], { x: hx + (T ? Math.sin(T * 0.9 + d.i) * 4 : 0), y: hy - 42, s: fog * 0.9, o: fog > 0.02 ? fog : 0 });
        const li = es(t, 4.25 + d.i * 0.05, 4.45 + d.i * 0.05, ease.back);
        pose(lights[d.i], { x: hx, y: hy - 52, s: li * (T ? 1 + Math.sin(T * 4 + d.i) * 0.08 : 1), o: li > 0.02 ? 1 : 0 });
      });
      qs.forEach((q, i) => {
        const t0 = i === 0 ? 1.55 : 2.55;
        const k = es(t, t0, t0 + 0.15, ease.back) * (1 - es(t, t0 + 0.4, t0 + 0.45));
        pose(q, { x: jhx + (i ? -30 : 30), y: jhy - 30, s: k, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.06 + es(t, 0.1, 0.5) * 0.06 - es(t, 1.0, 1.3) * 0.06 + es(t, 4.1, 4.5) * 0.04;
      S.cam.y = 20 + es(t, 0.1, 0.5) * 30 - es(t, 1.0, 1.3) * 90 + es(t, 4.1, 4.5) * 20;
    };
  },
};
