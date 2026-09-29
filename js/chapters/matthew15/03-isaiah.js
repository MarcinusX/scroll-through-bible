// Mt 15,7–9 — "Hypocrites! Well did Isaiah prophesy of you": the prophet's oval portrait comes down on its strings,
// his scroll open beneath it. "This people honours me with their lips, but their heart is far from me" — a big paper
// face in profile talks towards the light (never a figure: only light), sparks of praise flying from its lips, while
// its heart drifts away across the sky. "In vain they worship me, teaching human rules" — the sparks fall as grey
// scraps, and little rule-scrolls fly out of the mouth into the Pharisees' hands, which close on them.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  hand, headAt, pharisee, portrait, ISAIAH, scrollOpen, profileFace, heart, spark, scrap, ruleScroll, voiceRings, LAKE, tr, PI,
} from './lib.js';

const FLOOR = 690;
const JX = 820;
const GLOW = { x: 930, y: 190 };   // "Me": the light the lips speak towards
const FACE = { x: 640, y: 300 };   // the paper face (origin at its mouth)
const TIES = [C.terracotta, C.teal2, C.ochre, C.plumRobe, C.moss];

export default {
  id: 'mt15-isaiah',
  beats: [
    { v: 7 },
    { v: 8 },
    { v: 9 },
  ],
  cam: { x: [-60, 40], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, LAKE);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1230, y: 140, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 150), { x: 1040, y: 110, len: 700 });

    /* ---------- the same lakeside courtyard, closer ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 380, amps: [26, 9, 3], lens: [1200, 400, 140], color: C.hillFar }).markup);
    S.layer({ par: 0.14, sh: 1 }).add(waterBand(c, { y: 440, color: C.lake, foamN: 14, bottom: 900 }).markup);
    const hills = S.layer({ par: 0.24, sh: 3 });
    const h2 = hillsWith(c, { y: 494, amps: [10, 5, 2], lens: [900, 300, 120], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup + palm(c, 1330, h2.fn(1330) + 16, 150) + palm(c, 250, h2.fn(250) + 16, 130));
    const yard = S.layer({ par: 0.45, sh: 3 });
    const ws = sheet();
    ws.p(c.cut([[-900, 540], [2500, 540], [2500, 626], [-900, 626]], 1, 20), mix(C.plaster, C.sand, 0.25));
    ws.p(c.cut([[-900, 532], [2500, 532], [2500, 544], [-900, 544]], 0.6, 12), C.stone2);
    let blotch = '';
    for (let i = 0; i < 12; i++) blotch += c.cut(c.blob(c.rr(-300, 1900), c.rr(560, 610), c.rr(18, 40), c.rr(6, 12), 9, 0.2), 0.6, 5);
    ws.x(blotch, C.plaster2, 'opacity=".6"');
    yard.add(olive(c, 1100, 540, 1, { leaf: C.moss, leaf2: C.leaf }));
    yard.add(ws.out());
    yard.add(bush(c, 380, 626, 90, C.sage, C.moss) + bush(c, 1240, 626, 100, C.sage, C.moss));
    const floor = S.layer({ par: 0.55, sh: 3 });
    const fl = sheet();
    fl.p(c.cut([[-900, 620], [2500, 620], [2500, 1700], [-900, 1700]], 1, 30), mix(C.sand, C.sand2, 0.4));
    let flags = '';
    for (let r = 0; r < 5; r++) { const y = 636 + r * r * 9 + r * 18; flags += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.4); }
    fl.x(flags, shade(C.sand2, -0.15), 'opacity=".5"');
    floor.add(fl.out());

    /* ---------- people ---------- */
    const ppl = S.layer({ par: 0.6, sh: 5 });
    const PH = [{ i: 3, x: 440 }, { i: 4, x: 494 }, { i: 1, x: 552 }, { i: 2, x: 608 }, { i: 0, x: 664 }]
      .map((m, j) => ({ ...m, j, seed: c.rr(0, 9), p: S.puppet(ppl.add(pharisee(c, m.i))) }));
    const DS = [{ o: CAST.peter, x: 960 }, { o: CAST.andrew, x: 1016 }, { o: CAST.john, x: 1074 }, { o: CAST.james, x: 1130 }]
      .map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(ppl.add(person(c, d.o))) }));
    const jesus = S.puppet(ppl.add(person(c, { ...CAST.jesus })));
    const held = PH.map((m, j) => ppl.add(`<g>${ruleScroll(c, TIES[j], 1.1)}</g>`));
    const voice = voiceRings(ppl, c, { n: 3, r: 30, color: shade(C.ochre, 0.3) });

    /* ---------- the prophet, the face, the light, the heart ---------- */
    const fx = S.layer({ par: 0.6, sh: 6 });
    const prophet = hanging(fx, `<g transform="translate(0 70)">${portrait(S, ISAIAH, tr('Izajasz', 'Isaiah'), { w: 120, h: 150 })}</g><g transform="translate(0 196)">${scrollOpen(c, 200, 70)}</g>`, { x: 720, y: 150, len: 700 });
    const glow = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.star(0, 0, 30, 12, 8, 0), 0.4, 4), C.halo).p(c.cut(c.circ(0, 0, 11, 12), 0.3, 3), C.star).out()}</g>`);
    const pf = profileFace(c, 1.15);
    const face = hanging(fx, `${pf.face}<g data-g="lipU">${pf.lipU}</g><g data-g="lipL">${pf.lipL}</g>`, { x: FACE.x, y: FACE.y, len: 600 });
    const lipU = face.querySelector('[data-g="lipU"]'), lipL = face.querySelector('[data-g="lipL"]');
    const heartEl = hanging(fx, `<g transform="translate(0 30)">${heart(c, 30)}</g>`, { x: FACE.x, y: FACE.y + 60, len: 700 });
    const heartObj = heartEl.querySelector('.obj');
    const praise = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${spark(c, 9)}</g>`), ph: i / 6 }));
    const vain = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${scrap(c, 8)}</g>`), ph: i / 6, dx: c.rr(-30, 30) }));
    const rules = PH.map((m, i) => ({ i, el: fx.add(`<g>${ruleScroll(c, TIES[i], 1.6)}</g>`) }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 140, T, 1, 0.6);
      swing(cl1, 1040 + Math.sin(T * 0.1) * 20, 110, T, 1.2, 0.7, 1);

      /* v7 — "Hypocrites!" — Jesus faces the Pharisees; Isaiah's portrait comes down */
      const speak = es(t, 0.05, 0.3);
      const toHeaven = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const cling = es(t, 2.35, 2.6);
      jesus.set({
        x: JX, y: FLOOR + 6, s: 1.02, flip: true,
        armF: 16 + speak * (44 + Math.sin(t * 9) * 6) * (1 - toHeaven) + toHeaven * 30 + bump(t, 2.1, 2.9) * 20,
        armB: 8 + bump(t, 0.05, 0.9) * 40 + toHeaven * 115, head: -toHeaven * 12 + bump(t, 0.05, 0.9) * 4, blink: blinkAt(T),
      });
      const [jhx, jhy] = headAt(JX, FLOOR + 6, 1.02, true);
      voice(jhx - 8, jhy + 4, bump(t, 0.05, 0.95), T, { dir: -1 });
      PH.forEach((m, j) => {
        const back = es(t, 0.15, 0.45) * (6 + j * 3);
        const armF = cling * 66;
        const hug = es(t, 2.7, 2.95);
        const x = m.x - back;
        m.p.set({ x, y: FLOOR - 4 + (j % 2) * 6, s: 0.92, armF: armF - hug * 14, armB: hug * 60, head: es(t, 0.15, 0.45) * 4 - toHeaven * 6 + hug * 6, lean: -es(t, 0.15, 0.45) * 4, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(x, FLOOR - 4 + (j % 2) * 6, 0.92, false, armF - hug * 14);
        pose(held[j], { x: hx + 2, y: hy - 6, r: 70 - hug * 60, o: es(t, 2.5 + j * 0.06, 2.56 + j * 0.06) });
      });
      DS.forEach((d) => {
        const look = es(t, 0.1 + d.i * 0.05, 0.4 + d.i * 0.05);
        d.p.set({ x: d.x, y: FLOOR + 4 - (d.i % 2) * 8, s: 0.9, flip: true, armF: bump(t, 1.2, 1.9) * (d.i === 0 ? 40 : 0), head: look * 6 - toHeaven * 10, blink: blinkAt(T, d.seed) });
      });
      const pK = es(t, 0.15, 0.5, ease.out) * (1 - es(t, 0.95, 1.25, ease.in));
      swing(prophet, 720, 150 - (1 - pK) * 1150, T, 0.8, 0.6, 3);

      /* v8 — lips near, heart far */
      const faceK = es(t, 1.0, 1.35, ease.out) * (1 - es(t, 2.9, 3.2, ease.in));
      swing(face, FACE.x, FACE.y - (1 - faceK) * 1150, T, 0.8, 0.6, 1);
      const talk = faceK > 0.5 ? Math.max(0, Math.sin(T * 7)) * es(t, 1.2, 1.4) * (1 - es(t, 2.85, 2.95)) : 0;
      pose(lipU, { y: -talk * 3 });
      pose(lipL, { y: talk * 5 });
      const glowK = es(t, 1.0, 1.3);
      pose(glow, { x: GLOW.x, y: GLOW.y + Math.sin(T * 0.9) * 3, s: 0.7 + glowK * 0.3, o: glowK });
      const away = es(t, 1.35, 1.9, ease.io);
      swing(heartEl, lerp(FACE.x - 20, 470, away), lerp(FACE.y + 90, 400, away) - (1 - faceK) * 1150, T, 2.2, 0.9, 2);
      pose(heartObj, { s: 1 - away * 0.3, o: faceK > 0.01 ? 1 : 0 });
      const mouth = [FACE.x + 12, FACE.y - (1 - faceK) * 1150];
      praise.forEach((p) => {
        const on = es(t, 1.3, 1.5) * (1 - es(t, 2.0, 2.15));
        const k = ((T * 0.35 + p.ph) % 1);
        const x = lerp(mouth[0], GLOW.x - 30, k), y = lerp(mouth[1], GLOW.y + 20, k) - Math.sin(k * PI) * 40;
        pose(p.el, { x, y, s: 0.6 + k * 0.3, o: on * Math.min(1, k * 6) * (1 - k * 0.3) });
      });

      /* v9 — worship in vain: praise falls as scraps; human rules fly into their hands */
      vain.forEach((p) => {
        const on = es(t, 2.0, 2.15) * (1 - es(t, 2.9, 3.0));
        const k = ((T * 0.4 + p.ph) % 1);
        const x = mouth[0] + 20 + k * 90 + p.dx * k, y = mouth[1] - 30 + k * k * 260 - Math.sin(k * PI) * 60;
        pose(p.el, { x, y, r: k * 200, s: 0.8, o: on * Math.min(1, k * 6) * (1 - k) });
      });
      rules.forEach((r) => {
        const k = es(t, 2.1 + r.i * 0.08, 2.45 + r.i * 0.08);
        const m = PH[r.i];
        const [tx, ty] = headAt(m.x, FLOOR, 0.92, false);
        const x = lerp(mouth[0] + 10, tx + 10, k), y = lerp(mouth[1], ty - 30, k) - Math.sin(k * PI) * 80;
        pose(r.el, { x, y, r: k * 340, o: k > 0.01 && k < 0.99 ? 1 : 0 });
      });

      S.cam.z = 1 + es(t, 0.0, 0.8) * 0.03 + es(t, 1.0, 1.4) * 0.03 - es(t, 2.3, 2.8) * 0.02;
      S.cam.y = -es(t, 0.1, 0.6) * 40 + es(t, 2.3, 2.8) * 30;
      S.cam.x = -es(t, 2.2, 2.8) * 30;
    };
  },
};
