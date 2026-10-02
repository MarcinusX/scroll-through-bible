// Mt 15,1–3 — the curtains open on the courtyard by the lake of Gennesaret: Jesus sits on the ground with His
// disciples, and they are eating bread. Far off, little figures come down the road from Jerusalem; then the Pharisees
// and scribes walk in. "Why do your disciples break the tradition of the elders?" — the paper tag of the tradition
// comes down; "they don't wash their hands when they eat" — a plate with a dusty hand holding bread, the copper basin
// standing unused. Jesus rises: "Why do you break the commandment of God for your tradition?" — the stone tablets come
// down, and a rule-scroll flies from the tradition's tag and is pasted over them.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, bush, rock } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  kf, hand, headAt, thought, GLYPH, loaf, cup, jug, pharisee, stoneJar, basin, farCity, nameTag, plate, bigHand, scrollOpen,
  ruleScroll, tablets, bubble, voiceRings, LAKE, tr, PI,
} from './lib.js';

const FLOOR = 652;          // standing feet
const MATY = 700;           // the disciples sit here
const JX = 800;
const BASIN = { x: 520, y: 648 };
const TAB = { x: 800, y: 140 };

export default {
  id: 'mt15-washing',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: '«Dlaczego Twoi uczniowie postępują wbrew tradycji starszych?' },
    { v: 2, cont: true, text: 'Bo nie myją sobie rąk przed jedzeniem».' },
    { v: 3 },
  ],
  cam: { x: [-40, 60], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, LAKE);

    /* ---------- the flies: sun, clouds, birds ---------- */
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1230, y: 120, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 800, y: 130, len: 600 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 40, scale: 0.5 });

    /* ---------- far hills with Jerusalem on the right, the road coming down ---------- */
    const P = S.portrait;
    const far = S.layer({ par: 0.1, sh: 2 });
    const h1 = band(c, { y: 360, amps: [30, 10, 3], lens: [1300, 420, 140], color: C.hillFar });
    far.add(h1.markup);
    const CX = P ? 1050 : 1150;   // phone: Jerusalem and its tag inside the screen
    const CITY = { x: CX, y: h1.fn(CX) + 8 };
    far.add(`<g transform="translate(${CITY.x} ${CITY.y})">${farCity(c, 0.62)}</g>`);
    const road = [[CITY.x - 10, CITY.y + 2], [1080, 392], [1170, 408], [1040, 424], [990, 440]].map(([x, y], i) => [i && P ? x - 90 : x, y]);
    far.add(sheet().p(c.ribbon(road, (u) => 4 + u * 7), mix(C.sand, C.hillFar, 0.3)).out());
    const walkers = [0, 1, 2, 3].map((i) => ({ i, p: S.puppet(far.add(person(c, { robe: [C.linen2, C.stone, C.linen, C.wheatRobe][i], mantle: [C.dustyBlue, C.skyVeil, C.tealRobe, C.dustyBlue][i], hairStyle: 'wrap', veil: C.linen, beard: 'full' }))) }));
    const jTag = hanging(far, nameTag(c, tr('Jerozolima', 'Jerusalem'), { size: 16 }), { x: CITY.x, y: 250, len: 600 });

    /* ---------- the lake of Gennesaret and the near hills ---------- */
    S.layer({ par: 0.14, sh: 1 }).add(waterBand(c, { y: 432, color: C.lake, foamN: 16, bottom: 900 }).markup);
    const hills = S.layer({ par: 0.24, sh: 3 });
    const h2 = hillsWith(c, { y: 486, amps: [10, 5, 2], lens: [900, 300, 120], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup + palm(c, 1290, h2.fn(1290) + 16, 150) + palm(c, 170, h2.fn(170) + 16, 140) + olive(c, 1440, h2.fn(1440) + 14, 0.7));

    /* ---------- the courtyard wall and floor ---------- */
    const yard = S.layer({ par: 0.45, sh: 3 });
    const ws = sheet();
    ws.p(c.cut([[-900, 520], [2500, 520], [2500, 606], [-900, 606]], 1, 20), mix(C.plaster, C.sand, 0.25));
    ws.p(c.cut([[-900, 512], [2500, 512], [2500, 524], [-900, 524]], 0.6, 12), C.stone2);
    let blotch = '';
    for (let i = 0; i < 14; i++) blotch += c.cut(c.blob(c.rr(-300, 1900), c.rr(540, 590), c.rr(18, 40), c.rr(6, 12), 9, 0.2), 0.6, 5);
    ws.x(blotch, C.plaster2, 'opacity=".6"');
    yard.add(olive(c, 960, 520, 0.95, { leaf: C.moss, leaf2: C.leaf }));
    yard.add(ws.out());
    yard.add(bush(c, 1120, 606, 90, C.sage, C.moss) + bush(c, 300, 606, 80, C.sage, C.moss));
    const floorL = S.layer({ par: 0.6, sh: 3 });
    const fl = sheet();
    fl.p(c.cut([[-900, 600], [2500, 600], [2500, 1700], [-900, 1700]], 1, 30), mix(C.sand, C.sand2, 0.4));
    let flags = '';
    for (let r = 0; r < 6; r++) { const y = 616 + r * r * 8 + r * 16; flags += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.4); for (let x = -900 + (r % 2) * 40; x < 2500; x += c.rr(70, 110) + r * 14) flags += c.ribbon([[x, y], [x + c.rr(-3, 3), y + 16 + r * 12]], 1.2); }
    fl.x(flags, shade(C.sand2, -0.15), 'opacity=".5"');
    floorL.add(fl.out());
    // the washing corner: stone jars on a ledge, the copper basin with its jug — standing unused
    floorL.add(sheet().p(c.cut(c.rect(346, 604, 124, 20), 0.5, 8), C.stone2).out());
    floorL.add(`<g transform="translate(372 606)">${stoneJar(c, 86)}</g><g transform="translate(436 610)">${stoneJar(c, 70, C.stone2)}</g>`);
    floorL.add(`<g transform="translate(${BASIN.x} ${BASIN.y})">${basin(c, 80)}</g><g transform="translate(${BASIN.x + 48} ${BASIN.y}) scale(.62)">${jug(c, C.pot)}</g>`);
    const basinGlow = floorL.add(`<g><ellipse rx="80" ry="46" fill="url(#halo-glow)"/></g>`);

    /* ---------- the Pharisees and scribes ---------- */
    const standL = S.layer({ par: 0.6, sh: 5 });
    const PH = [
      { i: 0, x: 1030, from: 1560 }, { i: 3, x: 1086, from: 1620 }, { i: 1, x: 1138, from: 1680 },
      { i: 4, x: 1186, from: 1740 }, { i: 2, x: 1236, from: 1800 },
    ].map((m, j) => (P ? { ...m, x: 930 + j * 33 } : m)).map((m, j) => ({ ...m, j, seed: c.rr(0, 9), p: S.puppet(standL.add(pharisee(c, m.i))) }));

    /* ---------- the disciples at their bread, Jesus in the middle ---------- */
    const eatL = S.layer({ par: 0.6, sh: 5 });
    const D = [
      { o: CAST.thomas, x: 604, flip: false }, { o: CAST.peter, x: 668, flip: false }, { o: CAST.andrew, x: 730, flip: false },
      { o: CAST.james, x: 872, flip: true }, { o: CAST.john, x: 934, flip: true },
    ].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(eatL.add(person(c, { ...d.o, pose: 'sit' }))) }));
    const jSit = S.puppet(eatL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jStand = S.puppet(eatL.add(person(c, { ...CAST.jesus })));
    const cl = sheet();
    cl.p(c.cut([[640, MATY + 4], [960, MATY + 2], [980, MATY + 30], [620, MATY + 32]], 0.6, 8), C.cream);
    let pat = '';
    for (let x = 650; x < 960; x += 30) pat += c.cut(c.star(x, MATY + 22, 4, 1.8, 4, 0), 0.2, 3);
    cl.x(pat, C.terracotta, 'opacity=".5"');
    eatL.add(cl.out());
    eatL.add(`<g transform="translate(760 ${MATY + 14})">${loaf(c, 16)}</g><g transform="translate(850 ${MATY + 16})">${loaf(c, 14)}</g><g transform="translate(806 ${MATY + 18})">${cup(c)}</g>`);
    const bits = D.map(() => eatL.add(`<g>${loaf(c, 8)}</g>`));

    /* ---------- the flies: the tradition's tag, the hand plate, the tablets ---------- */
    const fx = S.layer({ par: 0.6, sh: 6 });
    const ask = fx.add(`<g>${bubble(c, tr('Dlaczego…?', 'Why…?'), { size: 24, dir: 1 })}</g>`);
    const TX = P ? 990 : 1030;   // the tradition's tag
    const tradTag = hanging(fx, `<g>${nameTag(c, tr(['tradycja', 'starszych'], ['the tradition', 'of the elders']), { size: 17 })}</g><g transform="translate(0 -40) scale(.55)">${scrollOpen(c, 80, 50)}</g>`, { x: TX, y: 290, len: 700 });
    const handPlate = hanging(fx, `<g>${plate(c, `<g transform="translate(-8 4) scale(.9)">${bigHand(c, { dirty: true })}</g><g transform="translate(40 -10)">${loaf(c, 14)}</g>`, { r: 62 })}</g>`, { x: 620, y: 250, len: 700 });
    const frowns = [1, 3].map((j) => ({ j, el: fx.add(`<g>${thought(c, GLYPH.frown(c))}</g>`) }));
    const tab = hanging(fx, `<g transform="translate(0 150)">${tablets(c, { w: 84, h: 118 })}</g>`, { x: TAB.x, y: TAB.y, len: 700 });
    const tabObj = tab.querySelector('.obj');
    const paste = fx.add(`<g>${ruleScroll(c, C.terracotta, 2.6)}</g>`);
    const paste2 = fx.add(`<g>${ruleScroll(c, C.teal2, 2.4)}</g>`);
    const voice = voiceRings(fx, c, { n: 3, r: 30, color: shade(C.ochre, 0.3) });

    /* ---------- foreground ---------- */
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1330, 860, 200, C.sage, C.moss) + bush(c, 170, 870, 220, C.moss, C.sage) + rock(c, 1200, 880, 150, 50, C.rock2));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      swing(sunEl, 1230, 120 - es(t, 0, 4) * 20, T, 1.1, 0.7);
      swing(cl1, 800 + Math.sin(T * 0.1) * 26, 130, T, 1.4, 0.6, 1);
      birds(T, 1);

      /* v1 — little figures come down the road from Jerusalem, then the men themselves walk in */
      const tagIn = es(t, 0.95, 1.3, ease.back) * (1 - es(t, 2.0, 2.4));
      swing(jTag, CITY.x, 250 - (1 - tagIn) * 1150, T, 1.5, 0.9, 3);
      const rp = road.map((p, i) => [i / (road.length - 1), p]);
      walkers.forEach((w) => {
        const u = seg(t, 0.95 + w.i * 0.06, 1.55 + w.i * 0.06);
        const [x, y] = kf(u, rp, (q) => q);
        w.p.set({ x: x - 3 + w.i * 6, y, s: 0.1, flip: x < kf(Math.min(1, u + 0.02), rp, (q) => q)[0], o: u > 0 && u < 1 ? 1 : 0, walk: u * 90 });
      });
      const point = es(t, 2.05, 2.3) * (1 - es(t, 3.9, 4.1));
      const shrink = es(t, 4.1, 4.4);
      PH.forEach((m) => {
        const pr = seg(t, 1.3 + m.j * 0.07, 1.85 + m.j * 0.07);
        const x = lerp(m.from, m.x, ease.out(pr)) + (m.j === 0 ? es(t, 2.0, 2.25) * -24 * (1 - shrink) : 0) + shrink * 10;
        const lead = m.j === 0;
        m.p.set({
          x, y: FLOOR + (m.j % 2) * 6, s: 0.86, flip: true, walk: pr > 0 && pr < 1 ? x * 0.05 : undefined,
          armF: lead ? point * 92 : m.j === 2 ? bump(t, 3.1, 3.9) * 70 : 0, armB: m.j === 1 ? bump(t, 3.2, 3.9) * 60 : 0,
          head: -point * 4 + shrink * 6, lean: -shrink * 3, blink: blinkAt(T, m.seed),
        });
      });
      const [ax, ay] = headAt(PH[0].x - 24, FLOOR, 0.86, true);
      const askK = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.95, 3.1));
      pose(ask, { x: ax - 34, y: ay - 26, s: askK, o: askK > 0.02 ? 1 : 0 });

      /* the disciples eat; Peter freezes with his bread when they point */
      const caught = es(t, 2.2, 2.4) * (1 - es(t, 4.4, 4.7));
      D.forEach((d) => {
        const bite = t > 0.3 && t < 2.2 ? Math.max(0, Math.sin((t - d.i * 0.13) * 8)) : 0;
        const armF = 40 + bite * 70 + caught * 30;
        d.p.set({ x: d.x, y: MATY, s: 0.84, flip: d.flip, armF, armB: 10, head: 4 - bite * 6 - caught * (d.flip ? -8 : 8) * 0.6, blink: blinkAt(T, d.seed) });
        const [hx, hy] = hand(d.x, MATY, 0.84, d.flip, armF, 0, 62);
        pose(bits[d.i], { x: hx + (d.flip ? -4 : 4), y: hy + 4, o: 1 });
      });

      /* v2a — the tradition of the elders */
      const tagK = es(t, 2.2, 2.55, ease.back) * (1 - es(t, 4.75, 5.1));
      swing(tradTag, TX, 290 - (1 - tagK) * 1150, T, 1.3, 0.8, 2);

      /* v2b — hands not washed: a dusty hand with bread; the basin stands by, unused */
      const plK = es(t, 3.05, 3.4, ease.back) * (1 - es(t, 4.0, 4.3));
      swing(handPlate, 620, 250 - (1 - plK) * 1150, T, 1.2, 0.8, 1);
      pose(basinGlow, { x: BASIN.x, y: BASIN.y - 30, o: bump(t, 3.2, 4.0) * 0.9 });
      frowns.forEach((f, i) => {
        const m = PH[f.j];
        const k = es(t, 3.2 + i * 0.1, 3.4 + i * 0.1, ease.back) * (1 - es(t, 3.95, 4.1));
        const [hx, hy] = headAt(m.x, FLOOR, 0.86, true);
        pose(f.el, { x: hx - 12, y: hy - 26, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      /* v3 — Jesus rises: "Why do you break the commandment of God for your tradition?" */
      const up = es(t, 4.02, 4.08);
      const speak = es(t, 4.05, 4.25);
      const toTab = es(t, 4.2, 4.45);
      jSit.set({ x: JX, y: MATY + 2, s: 0.9, armF: 26 + bump(t, 0.9, 1.9) * 20, armB: 10, head: t < 2 ? 4 : 0, o: 1 - up, blink: blinkAt(T, 2) });
      jStand.set({ x: JX, y: FLOOR + 30, s: 0.94, flip: false, armF: 20 + speak * 30 + bump(t, 4.6, 4.95) * 20, armB: 10 + toTab * 115, head: -toTab * 8, o: up, blink: blinkAt(T, 2) });
      const [jhx, jhy] = headAt(JX, FLOOR + 30, 0.94, false);
      voice(jhx + 8, jhy + 4, speak * (1 - es(t, 4.85, 5)), T, { dir: 1 });
      const tk = es(t, 4.05, 4.4, ease.out);
      swing(tab, TAB.x, TAB.y - (1 - tk) * 1150, T, 0.7, 0.6);
      fade(tabObj.querySelector('[data-g="iv"]'), es(t, 4.3, 4.5) * 0.7);
      // a rule-scroll flies from the tradition's tag and is pasted over the tablets
      const pk = es(t, 4.45, 4.72);
      pose(paste, { x: lerp(TX, TAB.x - 38, pk), y: lerp(250, TAB.y + 100, pk) - Math.sin(pk * PI) * 90, r: lerp(20, 88, pk), o: pk > 0.01 ? 1 : 0 });
      const pk2 = es(t, 4.55, 4.82);
      pose(paste2, { x: lerp(TX, TAB.x + 40, pk2), y: lerp(250, TAB.y + 80, pk2) - Math.sin(pk2 * PI) * 70, r: lerp(-20, 96, pk2), o: pk2 > 0.01 ? 1 : 0 });

      S.cam.x = (P ? 0.5 : 1) * es(t, 0.8, 1.6) * 40 * (1 - es(t, 2.9, 3.4)) - es(t, 2.9, 3.4) * 20 + es(t, 4.0, 4.4) * (P ? 30 : 10);
      S.cam.y = es(t, 0.7, 1.6) * 20 - es(t, 4.0, 4.4) * 50;
      S.cam.z = 1 + es(t, 0.7, 1.6) * 0.05 - es(t, 4.0, 4.4) * 0.04;
    };
  },
};
