// Mk 6,30–31 — back in colour: the Twelve come home in pairs and tell Jesus everything; "come away and rest
// a while" — but the courtyard never empties, and the bread in the bowl goes untouched.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, waterBand, palm, olive, bush, rock, grass, flowers, town, sun, cloud } from '../../assets/nature.js';
import { bird, boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, hand, speech, heart, scrap, spark, wordSlip, oilFlask, loaf, bowl, cup, staff, disc, labelTag, TWELVE, PAIRS, man, woman, DY } from './lib.js';

const PI = Math.PI;
const Y = 700;
const GATE = 1090;
const PAIR_X_ = [470, 580, 690, 910, 1020, 1130];

export default {
  id: 'm6-return',
  beats: [
    { v: 30 },
    { v: 31, text: 'A On rzekł do nich: «Pójdźcie wy sami osobno na miejsce pustynne i wypocznijcie nieco!».' },
    { v: 31, cont: true, text: 'Tak wielu bowiem przychodziło i odchodziło, że nawet na posiłek nie mieli czasu.' },
  ],
  cam: { x: [-60, 60], y: [0, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the outer pairs and the sun stay inside the screen
    const PAIR_X = S.portrait ? [565, 642, 720, 880, 958, 1035] : PAIR_X_;
    const SUNX = S.portrait ? 1000 : 1180;
    const SKY = ['#c3dcdc', '#ebe6cf', '#f6ead3'];
    sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: SUNX, y: 160, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 620, y: 140, len: 600 });
    const birds = flock(S, hangL, 3, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 40, scale: 0.5 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [16, 7, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    const lakeL = S.layer({ par: 0.14, sh: 1 });
    lakeL.add(waterBand(c, { y: 430, color: C.lake, foamN: 20, bottom: 900 }).markup);
    const bt = boat(c, { mast: true });
    lakeL.add(`<g transform="translate(1180 470) scale(.34)">${bt.back}${bt.front}</g>`);

    /* ---------- the courtyard ---------- */
    const wall = S.layer({ par: 0.35, sh: 3 });
    const Wl = sheet();
    const gate = [[GATE - 70, 640], [GATE - 70, 470], ...c.arc(GATE, 470, 70, 60, PI, 2 * PI, 12), [GATE + 70, 640]];
    Wl.p(c.cut([[-900, 640], [-900, 440], [2500, 440], [2500, 640]], 1, 14) + c.hole(gate, 0.5, 6), C.plaster);
    Wl.p(c.cut([[-900, 440], [2500, 440], [2500, 426], [-900, 426]], 0.6, 14), C.roof);
    let sp = '';
    for (let i = 0; i < 10; i++) sp += c.cut(c.blob(c.rr(-300, 1900), c.rr(470, 610), c.rr(10, 26), c.rr(5, 12), 8, 0.2), 0.5, 4);
    Wl.x(sp, C.plaster2, 'opacity=".6"');
    Wl.p(c.ribbon(c.arc(GATE, 470, 76, 66, PI, 2 * PI, 12), 10), C.stone2);
    // the house on the left with its door and stairs to the roof
    Wl.p(c.cut([[180, 640], [180, 330], [540, 330], [540, 640]], 0.8, 10), C.plaster2);
    Wl.p(c.cut([[170, 330], [550, 330], [550, 318], [170, 318]], 0.4, 8), C.roof);
    Wl.p(c.cut([[300, 640], [300, 540], ...c.arc(340, 540, 40, 36, PI, 2 * PI, 8), [380, 640]], 0.4, 6), C.wood2);
    Wl.p(c.cut(c.rect(440, 400, 40, 36), 0.3, 5), C.soilDark);
    wall.add(Wl.out());
    wall.add(olive(c, 1360, 640, 1.1) + palm(c, 620, 640, 260));
    const ground = S.layer({ par: 0.45, sh: 3 });
    ground.add(sheet().p(c.cut([[-900, 630], [2500, 630], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.sand, C.stone, 0.35)).out());
    ground.add(grass(c, { x0: -400, x1: 2000, y: 640, n: 24, h: 10, color: C.olive }));

    /* ---------- the crowd that keeps coming and going ---------- */
    const PASSN = 7;
    const passQ = [];
    const PASS = Array.from({ length: PASSN }, (_, i) => ({ i, dir: i % 2 ? 1 : -1, off: i / PASSN, seed: c.rr(0, 6), o: i % 3 ? man(c) : woman(c) }));

    /* ---------- Jesus, the Twelve, the table ---------- */
    const act = S.layer({ par: 0.55, sh: 5 });
    const tbl = sheet();
    tbl.p(c.cut(c.rect(250, Y - 46, 150, 10), 0.3, 5), C.wood);
    tbl.p(c.cut(c.rect(262, Y - 36, 8, 40), 0.2, 4) + c.cut(c.rect(380, Y - 36, 8, 40), 0.2, 4), C.wood2);
    act.add(tbl.out());
    act.add(`<g transform="translate(290 ${Y - 46})">${cup(c)}</g><g transform="translate(372 ${Y - 46})">${cup(c, C.sun)}</g>`);
    act.add(`<g transform="translate(330 ${Y - 46})">${bowl(c, { w: 50, food: null })}</g>`);
    const bread = act.add(`<g>${loaf(c, 15)}</g>`);
    const twelve = TWELVE.map((a, i) => {
      const pi = PAIRS.findIndex((p) => p.includes(i));
      const second = PAIRS[pi][1] === i;
      const left = PAIR_X[pi] < 800;
      return { ...a, i, pi, second, left, x: PAIR_X[pi] + (second ? 1 : -1) * (S.portrait ? 16 : 22) * (left ? 1 : -1), y: Y + (second ? 10 : -4), seed: c.rr(0, 6) };
    }).sort((a, b) => a.y - b.y);
    twelve.forEach((m) => { m.p = S.puppet(act.add(person(c, { ...m.o, holdF: staff(c, 200, 20) }))); });
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));

    /* ---------- their reports ---------- */
    const fx = S.layer({ par: 0.6, sh: 4 });
    const icons = [
      `<g transform="scale(.8)">${heart(c, 12)}</g>`, `<g transform="scale(.9)">${scrap(c, 10)}</g><g transform="translate(8 -6) scale(.5)">${spark(c, 10)}</g>`,
      `<g transform="translate(0 14) scale(.7)">${oilFlask(c)}</g>`, `<g transform="scale(.7)">${wordSlip(c, 34)}</g>`,
      `<g transform="scale(.8)">${heart(c, 12)}</g>`, `<g transform="translate(0 14) scale(.7)">${oilFlask(c)}</g>`,
    ];
    const reports = PAIRS.map((pr, i) => ({ i, el: fx.add(`<g>${speech(c, icons[i], { w: 52, h: 46, flip: PAIR_X[i] > 800 })}</g>`) }));
    const rest = hanging(fx, disc(c, `<g transform="translate(-6 10) scale(.36)">${palm(c, 0, 40, 150)}</g><path d="${c.cut(c.blob(0, 34, 40, 10, 12, 0.1), 0.4, 4)}" fill="${C.sand}"/><path d="${c.ribbon(c.arc(24, -14, 8, 8, PI * 0.6, PI * 1.9, 8), 3)}" fill="${C.sun}"/>`, { r: 50 }) + `<g transform="translate(0 74)">${labelTag(tr('odpocznijcie', 'rest awhile'), 18)}</g>`, { x: 0, y: 0, len: 600 });
    const yawns = [0, 1, 2].map(() => fx.add(`<g>${speech(c, `<text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="20" font-style="italic" fill="${C.ink}">z</text>`, { w: 30, h: 28 })}</g>`));

    const passL = S.layer({ par: 0.6, sh: 5 });
    PASS.forEach((p) => { p.p = S.puppet(passL.add(person(c, p.o))); });
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 60, 880, 240, C.sage, C.moss) + bush(c, 1560, 880, 240, C.moss, C.sage) + rock(c, 1300, 900, 130, 50, C.rock2) + flowers(c, { x0: 120, x1: 460, y: 862, n: 12 }));

    return (t, time) => {
      const T = time;
      swing(sunEl, SUNX, 160, T, 1.1, 0.6);
      swing(cl1, 620 + Math.sin(T * 0.1) * 30, 140, T, 1.4, 0.6, 1);
      birds(T, 1);

      /* v30 — the pairs come home and tell him all they did and taught */
      const listen = es(t, 0.3, 0.5) * (1 - es(t, 0.95, 1.05));
      const send = bump(t, 1.05, 1.95);
      jesus.set({ x: 800, y: Y - 2, s: 1.0, flip: listen > 0.5 && Math.sin(t * 9) > 0, armF: 20 + listen * 20 + send * 70 + bump(t, 2.1, 2.9) * 30, armB: 10 + send * 40, head: listen * 4 + Math.sin(t * 20) * 3 * listen, blink: blinkAt(T) });
      twelve.forEach((m) => {
        const k0 = -0.4 + m.pi * 0.09;
        const from = m.pi === 2 || m.pi === 3 ? [GATE, 640] : [m.left ? -250 : 1850, m.y];
        const k = es(t, k0, k0 + 0.4);
        const x = lerp(from[0], m.x, k), y = lerp(from[1], m.y, k);
        const tell = bump(t, 0.15 + m.pi * 0.12, 0.55 + m.pi * 0.12) * (m.second ? 0.4 : 1);
        const tired = es(t, 1.1, 1.4) * (1 - es(t, 1.7, 1.9));
        const reach = m.k === 'peter' ? bump(t, 2.15, 2.5) : 0;
        m.p.set({ x: x - reach * 20, y, s: 0.84, flip: !m.left, o: seg(t, k0, k0 + 0.05), walk: k > 0 && k < 1 ? x * 0.05 + m.i : undefined, armF: 20, armB: tell * (100 + Math.sin(T * 5 + m.i) * 20) + reach * 60, head: -tired * 12 + es(t, 1.7, 1.9) * 4 * (1 - es(t, 2.0, 2.2)) + es(t, 2.1, 2.3) * (m.left ? 10 : -10) * 0, lean: tired * 5 * (m.left ? 1 : -1), blink: tired > 0.5 ? 1 : blinkAt(T, m.seed) });
      });
      reports.forEach((r) => {
        const k = es(t, 0.2 + r.i * 0.12, 0.35 + r.i * 0.12, ease.back) * (1 - es(t, 0.9, 1.0));
        const lead = twelve.find((m) => m.pi === r.i && !m.second);
        const [hx, hy] = headAt(lead.x, lead.y, 0.84, !lead.left);
        pose(r.el, { x: hx + (lead.left ? 16 : -16), y: hy - 24, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v31a — "come apart into a deserted place, and rest awhile" */
      const rk = es(t, 1.2, 1.45, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(rest, { x: 800, y: lerp(-500, 210, rk), r: Math.sin(T * 1.1) * 2.5, o: rk > 0.01 ? 1 : 0 });
      yawns.forEach((y, i) => {
        const k = bump(t, 1.1 + i * 0.1, 1.75);
        const m = twelve[[2, 7, 10][i]];
        const [hx, hy] = headAt(m.x, m.y, 0.84, !m.left);
        pose(y, { x: hx + 14, y: hy - 20 - k * 10, s: k * 0.8, o: k > 0.02 ? 1 : 0 });
      });

      /* v31b — people coming and going; no time even to eat */
      const busy = es(t, 1.95, 2.15);
      PASS.forEach((p) => {
        const u = (((t - 1.9) * 0.8 + p.off) % 1 + 1) % 1;
        const x = p.dir > 0 ? lerp(-100, 1700, u) : lerp(1700, -100, u);
        const nearGate = Math.abs(x - GATE) < 60;
        p.p.set({ x, y: 736 + (p.i % 3) * 8, s: 0.9, flip: p.dir < 0, o: busy * (1 - es(t, 2.95, 3.1)), walk: x * 0.06, armF: nearGate ? 60 : 10, blink: blinkAt(T, p.seed) });
      });
      // Peter reaches for the bread… and puts it back
      const up = bump(t, 2.15, 2.6);
      pose(bread, { x: 330 + up * 70, y: Y - 60 - up * 50, o: 1 });

      S.cam.z = kf(t, S.portrait ? [[0, 1.03], [1.0, 1.05], [1.9, 1.05], [2.2, 1.02]] : [[0, 1.06], [1.0, 1.1], [1.9, 1.1], [2.2, 1.02]]);   // phone: a smaller push-in keeps the outer pairs off the frame and the thread
      S.cam.y = kf(t, [[0, 30], [1.0, 40], [2.2, 20]]);
    };
  },
};
