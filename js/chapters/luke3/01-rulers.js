// Łk 3,1–2a — "In the fifteenth year…": the powers of the world hang one by one over the land like a gallery.
// First Tiberius Caesar in his laurel, with the tally of his fifteen years; then he rises to the top and a map
// of the land comes down beneath him. Each ruler's medallion drops beside it and a red thread runs from him
// to his country, which is coloured in: Pilate — Judea, Herod — Galilee, Philip — Ituraea and Trachonitis,
// Lysanias — Abilene. Last, the high priests Annas and Caiaphas hang together over Jerusalem and the Temple.
import { C, sky, hanging, swing, curtains, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, cypress, olive } from '../../assets/nature.js';
import {
  ROMAN, TIBERIUS, PILATE, HEROD, PHILIP_T, LYSANIAS, ANNAS_O, CAIAPHAS, laurel, medalHead, kingHead, priestHead, circlet,
  landOfRulers, MAP, numberCard, strip, glowStar, ICON, lightDisc, tr, es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const MX = 800, MY = 470, MS = 0.74;                 // the map: centre and scale
const at = ([x, y]) => [MX + x * MS, MY + y * MS];

export default {
  id: 'lk3-rulers',
  beats: [
    { cover: true },
    { v: 1, text: 'Było to w piętnastym roku rządów Tyberiusza Cezara.' },
    { v: 1, cont: true, text: 'Gdy Poncjusz Piłat był namiestnikiem Judei,' },
    { v: 1, cont: true, text: 'Herod tetrarchą Galilei,' },
    { v: 1, cont: true, text: 'brat jego Filip tetrarchą Iturei i kraju Trachonu,' },
    { v: 1, cont: true, text: 'Lizaniasz tetrarchą Abileny;' },
    { v: 2, text: 'za najwyższych kapłanów Annasza i Kajfasza' },
  ],
  cam: { x: [-30, 30], y: [-20, 30], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: a slightly smaller map, and the rulers hung nearer to it, clear of the edge and the thread
    const ms = PH ? 0.7 : MS, at = ([x, y]) => [MX + x * ms, MY + y * ms];
    const LX = PH ? 590 : 548, RX = PH ? 1012 : 1055;
    sky(S, ROMAN);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1250, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 420, y: 200, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 1180, y: 330, len: 700 });

    /* the land: far mountains, green hills with towns, the near fields */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 520, amps: [20, 8, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.hillFar, 0.45) }).markup);
    S.layer({ par: 0.16, sh: 3 }).add(hillsWith(c, { y: 600, amps: [16, 7, 3], lens: [900, 320, 120], color: C.hillMid, trees: 22, treeColor: C.sage, treeH: 20, houses: 10, houseColor: C.plaster }).markup);
    const near = S.layer({ par: 0.3, sh: 3 });
    near.add(sheet().p(c.ridge(c.wave(690, [6, 3], [700, 200]), -1100, 2700, 1900, 14, 1), mix(C.hillNear, C.sand, 0.35)).out());
    near.add(cypress(c, 250, 700, 150) + cypress(c, 300, 706, 110) + olive(c, 1400, 704, 0.9) + cypress(c, 1330, 700, 130));

    /* the map, and its countries (coloured in one by one) */
    const mapL = S.layer({ par: 0.2, sh: 5 });
    const LM = landOfRulers(c);
    const mapEl = mapL.add(`<g><path d="M${-MAP.w * 0.3} ${-1600}V${-MAP.h / 2}M${MAP.w * 0.3} ${-1600}V${-MAP.h / 2}" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/>${LM.base}</g>`);
    const REG = {};
    Object.entries(LM.regions).forEach(([k, m]) => { REG[k] = mapL.add(`<g>${m}</g>`); });
    const templeEl = mapL.add(`<g><circle r="46" fill="url(#halo-glow)"/><g transform="scale(1.3)">${ICON.temple(c)}</g></g>`);

    /* the gallery: medallions on strings, with red threads to their countries */
    const glowL = S.layer({ par: 0.2, sh: 1, flat: true });
    const galL = S.layer({ par: 0.2, sh: 6 });
    const thrL = S.layer({ par: 0.2, sh: 2 });
    const thread = () => thrL.add(`<g><path d="${c.ribbon([[0, 0], [50, 1.5], [100, 0]], 2.4)}" fill="${C.terracotta}"/><path d="${c.cut(c.circ(100, 0, 5, 8), 0.2, 2)}" fill="${shade(C.terracotta, -0.2)}"/></g>`);
    const P = (o, head, name, opts = {}) => hanging(galL, medalHead(S, o, head, { r: 46, name, size: 19, ...opts }), { x: 0, y: -1500, len: 700 });

    const tib = P(TIBERIUS, laurel(c), tr('Tyberiusz Cezar', 'Tiberius Caesar'), { r: 58, rim: C.sun, back: mix(C.plumRobe, C.cream, 0.55), size: 22 });
    const tibGlow = glowL.add(`<g>${lightDisc(c, 150)}</g>`);
    const plaque = galL.add(`<g><path d="M0 -1600V-44" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${numberCard(c, 'XV', { size: 56 })}<g transform="translate(0 70)">${strip(c, tr('rok panowania', 'year of his reign'), { size: 17 })}</g></g>`);
    const years = Array.from({ length: 15 }, (_, i) => ({ i, el: galL.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 6.5, 10), 0.2, 2), i === 14 ? C.terracotta : C.sun).out()}</g>`) }));

    const R = [
      { key: 'pilate', el: P(PILATE, '', tr('Poncjusz Piłat', 'Pontius Pilate'), { rim: C.stone2, back: mix(C.curtain, C.cream, 0.5), size: 18 }), x: LX, y: 510, regs: ['judea'], pins: [[-130, 84]], b: 2 },
      { key: 'herod', el: P(HEROD, kingHead(c), tr('Herod', 'Herod'), { rim: C.sun, back: mix(C.sageRobe, C.cream, 0.45) }), x: LX, y: 285, regs: ['galilee'], pins: [[-110, -150]], b: 3 },
      { key: 'philip', el: P(PHILIP_T, `<g transform="translate(0 1)">${circlet(c)}</g>`, tr('Filip', 'Philip'), { rim: C.haloRim, back: mix(C.mauve, C.cream, 0.5), flip: true }), x: RX, y: 450, regs: ['iturea', 'trachon'], pins: [[62, -180], [128, -108]], b: 4 },
      { key: 'lys', el: P(LYSANIAS, `<g transform="translate(0 1)">${circlet(c)}</g>`, tr('Lizaniasz', 'Lysanias'), { rim: C.haloRim, back: mix(C.tealRobe, C.cream, 0.55), flip: true }), x: RX, y: 235, regs: ['abilene'], pins: [[76, -250]], b: 5 },
    ];
    R.forEach((r) => { r.thr = r.pins.map(() => thread()); });
    const PR = [
      { el: P(ANNAS_O, priestHead(c), tr('Annasz', 'Annas'), { r: 40, rim: C.sun, back: mix(C.plumRobe, C.cream, 0.6), size: 18 }), x: 712, y: 600 },
      { el: P(CAIAPHAS, priestHead(c), tr('Kajfasz', 'Caiaphas'), { r: 40, rim: C.sun, back: mix(C.dustyBlue, C.cream, 0.5), size: 18, flip: true }), x: 888, y: 600 },
    ];

    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);
      swing(sunEl, 1250, 150, time, 1, 0.6);
      swing(cl1, 420 + Math.sin(time * 0.1) * 20, 200, time, 1.2, 0.6, 1);
      swing(cl2, 1180 + Math.sin(time * 0.12 + 2) * 20, 330, time, 1.2, 0.7, 2);

      /* v1a — Tiberius Caesar, and his fifteen years */
      const tIn = es(t, 1.04, 1.4, ease.out), tUp = es(t, 2.0, 2.4);
      const tx = lerp(PH ? 715 : 740, 800, tUp), ty = lerp(lerp(-600, 330, tIn), 168, tUp), ts = lerp(1.2, 0.74, tUp);
      pose(tib, { x: tx, y: ty, s: ts, r: Math.sin(time * 0.6) * 1.2 * (1 - tUp), o: tIn > 0.001 ? 1 : 0 });
      pose(tibGlow, { x: tx, y: ty, s: ts, o: es(t, 1.3, 1.6) * (1 - tUp * 0.5) });
      const pIn = es(t, 1.12, 1.45, ease.out);
      const px = lerp(PH ? 978 : 1030, 648, tUp), py = lerp(lerp(-600, 310, pIn), 160, tUp), ps = lerp(1, 0.62, tUp);
      pose(plaque, { x: px, y: py, s: ps, r: Math.sin(time * 0.7 + 1) * 1.4 * (1 - tUp), o: pIn > 0.001 ? 1 : 0 });
      years.forEach((y) => {
        const k = es(t, 1.4 + y.i * 0.022, 1.48 + y.i * 0.022, ease.back);
        const row = y.i < 8 ? 0 : 1, col = y.i < 8 ? y.i : y.i - 8;
        const bx = (col - (row ? 3 : 3.5)) * 17, by = 108 + row * 17;
        pose(y.el, { x: px + bx * ps, y: py + by * ps, s: k * ps * (y.i === 14 ? 1.3 : 1), o: k > 0.01 ? 1 : 0 });
      });

      /* v1b… — the map comes down; each ruler hangs beside his country and a thread runs to it */
      const mIn = es(t, 0.15, 0.7, ease.out);
      pose(mapEl, { x: MX, y: lerp(-700, MY, mIn), s: ms, r: Math.sin(time * 0.5) * 0.4 * mIn, o: mIn > 0.001 ? 1 : 0 });
      Object.values(REG).forEach((el) => pose(el, { x: MX, y: lerp(-700, MY, mIn), s: ms, o: 0 }));
      R.forEach((r) => {
        const k = es(t, r.b + (r.b === 2 ? 0.3 : 0.05), r.b + (r.b === 2 ? 0.62 : 0.4), ease.out);
        swing(r.el, r.x, lerp(-700, r.y, k), time, 1.2 * k, 0.7, r.b);
        fade(r.el, k > 0.001 ? 1 : 0);
        const col = es(t, r.b + (r.b === 2 ? 0.55 : 0.35), r.b + (r.b === 2 ? 0.72 : 0.55));
        r.regs.forEach((g) => pose(REG[g], { x: MX, y: lerp(-700, MY, mIn), s: ms, o: col }));
        r.pins.forEach((pin, j) => {
          const [x1, y1] = at(pin);
          const x0 = r.x + (r.x < MX ? 50 : -50), y0 = r.y + 6;
          const len = Math.hypot(x1 - x0, y1 - y0), ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / PI;
          const g = es(t, r.b + (r.b === 2 ? 0.5 : 0.3) + j * 0.08, r.b + (r.b === 2 ? 0.72 : 0.52) + j * 0.08);
          pose(r.thr[j], { x: x0, y: y0, r: ang, sx: Math.max(0.001, g) * (len / 100), sy: 1, o: g > 0.01 ? 1 : 0 });
        });
      });

      /* v2a — the high priests Annas and Caiaphas, over Jerusalem and the Temple */
      PR.forEach((p, i) => {
        const k = es(t, 6.05 + i * 0.12, 6.42 + i * 0.12, ease.out);
        swing(p.el, p.x, lerp(-700, p.y, k), time, 1 * k, 0.8, i + 7);
        fade(p.el, k > 0.001 ? 1 : 0);
      });
      const tk = es(t, 6.35, 6.6, ease.back);
      const [jx, jy] = at([-40, 110]);
      pose(templeEl, { x: jx + 0, y: jy - 4, s: tk * 1.1, o: tk > 0.01 ? 1 : 0 });

      /* the camera leans towards whoever is being named */
      const side = (t < 2 ? 0 : 0) - bump(t, 2.1, 4.0) * 16 + bump(t, 4.0, 5.9) * 16;
      S.cam.x = side;
      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.03 - es(t, 2.0, 2.4) * 0.03;
      S.cam.y = 10;
    };
  },
};
