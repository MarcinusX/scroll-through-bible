// Mk 8,10–13 — across the lake to Dalmanutha. Pharisees argue and demand a sign from heaven:
// a dark "heaven" flat is let down on its lines with a big question mark — and nothing appears.
// He sighs deeply; no sign will be given; He leaves them and sails to the other side.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, reeds, rock, town, sun, cloud, grass } from '../../assets/nature.js';
import { boat, bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, speech, GLYPH, wordSlip, pharisee, heavenPanel, bigQuestion, sighPuff, signpost, headAt, PI } from './lib.js';

const SHORE = 600;        // the beach edge
const BY = 652;           // boat waterline
const BX = 400;           // where the boat lands
const JX = 790, JY = 680;

export default {
  id: 'm8-sign',
  beats: [
    { v: 10 },
    { v: 11, text: 'Nadeszli faryzeusze i zaczęli rozprawiać z Nim,' },
    { v: 11, cont: true, text: 'a chcąc wystawić Go na próbę, domagali się od Niego znaku.' },
    { v: 12, text: 'On zaś westchnął głęboko w duszy i rzekł: «Czemu to plemię domaga się znaku?' },
    { v: 12, cont: true, text: 'Zaprawdę powiadam wam: żaden znak nie będzie dany temu plemieniu».' },
    { v: 13 },
  ],
  cam: { x: [-120, 80], y: [-60, 90], z: [0.96, 1.2] },
  build(S) {
    const c = S.c;
    const SKY = ['#c9dfdc', '#eee6cf', '#f6ead3'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 150, len: 800 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 460, y: 150, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 150), { x: 1040, y: 220, len: 700 });

    /* ---------- the dark flat of "heaven" with its question mark ---------- */
    const heavL = S.layer({ par: 0.06, sh: 8 });
    const heav = hanging(heavL, `${heavenPanel(c, 440, 250)}<g class="q" transform="translate(0 125)">${bigQuestion(c, 58, C.halo)}</g>`, { x: 800, y: 110, len: 900 });
    const qMark = heav.querySelector('.q');

    /* ---------- far shore, lake, the beach of Dalmanutha ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [16, 7, 3], lens: [1100, 380, 140], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.16, sh: 2 });
    const h2 = hillsWith(c, { y: 468, amps: [12, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20, x0: -900, x1: 2500 });
    hills.add(h2.markup);
    const water = S.layer({ par: 0.2, sh: 2 });
    water.add(waterBand(c, { y: 500, color: C.lake, foamN: 30 }).markup);
    const wv = S.layer({ par: 0.26, sh: 3, pad: 140 });
    wv.add(waveStrip(c, { y: 560, len: 130, amp: 7, color: C.lake2 }));
    // the boat on the water (people inside)
    const boatL = S.layer({ par: 0.3, sh: 5 });
    const B = boat(c, { mast: false });
    const boatG = boatL.add(`<g>${B.back}<g data-k="bj">${person(c, { ...CAST.jesus })}</g><g data-k="bp">${person(c, CAST.peter)}</g><g data-k="bn">${person(c, CAST.john)}</g><g data-k="ba">${person(c, CAST.andrew)}</g>${B.front}</g>`);
    const bj = S.puppet(S.$('bj').firstElementChild), bp = S.puppet(S.$('bp').firstElementChild), bn = S.puppet(S.$('bn').firstElementChild), ba = S.puppet(S.$('ba').firstElementChild);
    const wv2 = S.layer({ par: 0.32, sh: 3, pad: 160 });
    wv2.add(waveStrip(c, { y: 640, len: 160, amp: 8, color: C.lake3 }));
    // the beach
    const beachL = S.layer({ par: 0.34, sh: 3 });
    const bpts = [];
    for (let x = 2500; x >= 200; x -= 12) { const u = Math.max(0, (640 - x) / 280); bpts.push([x, SHORE + Math.sin(x * 0.013) * 3 + u * u * 170 + c.rr(-1, 1)]); }
    bpts.push([-900, 1700], [2500, 1700]);
    beachL.add(sheet().p(c.poly([[2500, 1700], ...bpts.slice(0, -2), [200, 1700]]), C.sand).out());
    beachL.add(palm(c, 1330, SHORE + 20, 230) + palm(c, 1460, SHORE + 30, 190) + rock(c, 1180, SHORE + 30, 60, 22, C.rock2));
    beachL.add(grass(c, { x0: 900, x1: 2000, y: SHORE + 8, n: 20, h: 12, color: C.olive }));
    beachL.add(`<g transform="translate(1210 ${SHORE + 64})">${signpost(c, tr('Dalmanuta', 'Dalmanutha'), { size: 20, dir: 1 })}</g>`);
    beachL.add(town(c, { x: 1650, y: SHORE + 10, n: 5, spread: 260, sc: 0.8 }));

    /* ---------- people on the beach ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const phs = [0, 1, 2].map((i) => ({ i, p: S.puppet(P.add(person(c, pharisee(i)))), x: 960 + i * 78, from: 1560 + i * 90, seed: c.rr(0, 9) }));
    const peter = S.puppet(P.add(person(c, CAST.peter)));
    const john = S.puppet(P.add(person(c, CAST.john)));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const bubL = S.layer({ par: 0.5, sh: 4 });
    const slips = Array.from({ length: 7 }, (_, i) => ({ i, el: bubL.add(wordSlip(c, c.rr(26, 36))) }));
    const bangs = phs.map((ph, i) => ({ ph, el: bubL.add(`<g>${speech(c, i === 1 ? GLYPH.q(c) : GLYPH.bang(c), { w: 40, h: 40, flip: true })}</g>`) }));
    const puff = bubL.add(`<g>${sighPuff(c)}</g>`);
    const whyB = bubL.add(`<g>${speech(c, GLYPH.q(c), { w: 42, h: 42 })}</g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(reeds(c, 150, 900, 14, 220, C.moss) + rock(c, 1400, 930, 220, 90, C.rock2) + reeds(c, 1500, 920, 10, 180, C.olive));

    return (t, time) => {
      const T = time;
      sk.blend(SKY, ['#d5dcd6', '#efe2c8', '#f4dcc0'], es(t, 2, 4));
      swing(sunEl, 1230, 150 + es(t, 0, 6) * 60, T, 1.1, 0.7);
      swing(cl1, 460 + Math.sin(T * 0.1) * 26, 150 - bump(t, 1.8, 5) * 300, T, 1.4, 0.6, 1);
      swing(cl2, 1040 + Math.sin(T * 0.13 + 2) * 26, 220 - bump(t, 1.8, 5) * 300, T, 1.4, 0.8, 2);
      wv.shift(((T * 16) % 130) - 65); wv2.shift(80 - ((T * 12) % 160));

      /* the heaven flat: let down on the demand, nothing in it, flown out on "no sign" */
      const down = es(t, 2.1, 2.55) * (1 - es(t, 4.25, 4.75));
      swing(heav, 800, 110 - (1 - down) * 560, T, 0.7, 0.6, 1);
      const wait = seg(t, 2.6, 4.2);
      pose(qMark, { x: 0, y: 125, s: 1 + Math.sin(T * 2.2) * 0.04, r: Math.sin(T * 1.3) * 6, o: 1 - wait * 0.55 });

      /* v10 — the boat crosses and lands; v13 — it leaves for the other side */
      const arrive = es(t, 0.02, 0.62);
      const leave = es(t, 5.4, 5.95);
      const bx = lerp(-260, BX, arrive) - leave * 150, by = BY - leave * 80, bs = 0.86 - leave * 0.36;
      pose(boatG, { x: bx, y: by + Math.sin(T * 1.4) * 2, s: bs, r: Math.sin(T * 1.1) * 0.8 });
      const ashore = es(t, 0.68, 0.74) * (1 - es(t, 5.3, 5.36));
      bj.set({ x: 20, y: -10, s: 1, o: 1 - ashore, armF: 30 + bump(t, 0.2, 0.7) * 40, blink: blinkAt(T), flip: leave > 0 });
      bp.set({ x: 90, y: -8, s: 0.95, o: 1 - ashore, armF: 50 + Math.sin(T * 1.2) * 4, armB: 40 });
      bn.set({ x: -60, y: -8, s: 0.95, o: 1 - ashore, armF: 40, blink: blinkAt(T, 2) });
      ba.set({ x: -120, y: -6, s: 0.95, armF: 55 + Math.sin(T * 1.3 + 1) * 5, armB: 45, flip: false, blink: blinkAt(T, 4) });

      // Jesus steps onto the beach, meets them; later walks back to the boat
      const jKeys = [[0.7, [BX + 170, SHORE + 40]], [0.98, [JX, JY]], [5.0, [JX, JY]], [5.3, [BX + 170, SHORE + 40]]];
      const [jx, jy] = kf(t, jKeys);
      const jWalk = moving(t, jKeys, 1);
      const sigh = bump(t, 3.02, 3.85);
      const firm = es(t, 4.05, 4.3) * (1 - es(t, 4.85, 5));
      const js = 0.96;
      jesus.set({
        x: jx, y: jy, s: js, o: ashore, flip: t > 4.95,
        walk: jWalk ? (jx + jy) * 0.05 : undefined,
        armF: 16 + bump(t, 1.2, 1.95) * 30 + firm * 80 + sigh * 12, armB: 8 + firm * 30 + sigh * 6,
        head: sigh * 16 - firm * 4 + bump(t, 2.3, 2.9) * -10, bob: sigh * 5, lean: sigh * 3,
        blink: sigh > 0.4 ? 0.85 : blinkAt(T),
      });
      [[peter, 0], [john, 1]].forEach(([p, i]) => {
        const keys = [[0.72 + i * 0.05, [BX + 180, SHORE + 40]], [1.0 + i * 0.05, [640 - i * 60, JY - 10 + i * 12]], [5.05 + i * 0.05, [640 - i * 60, JY - 10 + i * 12]], [5.3, [BX + 180, SHORE + 40]]];
        const [x, y] = kf(t, keys);
        const w = moving(t, keys, 1);
        p.set({ x, y, s: 0.9, o: ashore, flip: w ? kf(t + 0.02, keys)[0] < x : false, walk: w ? (x + y) * 0.05 : undefined, head: bump(t, 2.2, 3) * -14, armF: bump(t, 1.3, 2.4) * 20, blink: blinkAt(T, 3 + i) });
      });

      /* the Pharisees come, argue, demand a sign; recoil; stay behind */
      phs.forEach((ph) => {
        const keys = [[0.85 + ph.i * 0.07, ph.from], [1.5 + ph.i * 0.07, ph.x]];
        const x = kf(t, keys, ease.out);
        const w = moving(t, keys, 1);
        const argue = es(t, 1.4, 1.6) * (1 - es(t, 2.0, 2.1));
        const demand = es(t, 2.05, 2.3) * (1 - es(t, 3.9, 4.1));
        const recoil = bump(t, 4.05, 4.9);
        const cross = es(t, 5.1, 5.4);
        ph.p.set({
          x: x + recoil * 18, y: JY - 6 + ph.i * 6, s: 0.92, flip: true, walk: w ? x * 0.05 : undefined,
          armF: argue * (60 + Math.sin(T * 5 + ph.i * 2) * 30) + demand * (ph.i === 1 ? 140 : 70) + cross * 55,
          armB: demand * (ph.i === 1 ? 20 : 150) + argue * 30 + cross * 50,
          head: -demand * 18 + recoil * 8, lean: -recoil * 6, blink: blinkAt(T, ph.seed),
        });
      });
      bangs.forEach((b, i) => {
        const k = es(t, 1.35 + i * 0.1, 1.5 + i * 0.1, ease.back) * (1 - es(t, 2.0, 2.1));
        pose(b.el, { x: b.ph.x - 30, y: JY - 222, s: k * 0.95, r: Math.sin(T * 3 + i) * 6, o: k > 0.02 ? 1 : 0 });
      });
      slips.forEach((sl) => {
        const k = ((T * 0.35 + sl.i / slips.length) % 1);
        const on = es(t, 1.35, 1.55) * (1 - es(t, 2.0, 2.15));
        const sx = 1000 + (sl.i % 3) * 70;
        pose(sl.el, { x: lerp(sx, JX + 40, k), y: JY - 170 - Math.sin(k * PI) * 50 - (sl.i % 2) * 20, r: Math.sin(T * 2 + sl.i) * 14, s: 0.7, o: on * Math.min(1, k * 5) * (1 - k * 0.7) });
      });
      // the deep sigh
      const [hx, hy] = headAt(jx, jy, js, false);
      const pk = seg(t, 3.1, 3.9);
      pose(puff, { x: hx + 14 + pk * 60, y: hy + 10 - pk * 30, s: 0.6 + pk * 0.8, o: bump(t, 3.1, 3.9) * 0.9 });
      const why = es(t, 3.35, 3.5, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(whyB, { x: hx + 20, y: hy - 30, s: why, o: why > 0.02 ? 1 : 0 });

      S.cam.x = lerp(-120, 0, es(t, 0, 0.8)) + es(t, 5.2, 5.9) * -110;
      S.cam.z = 1.02 + es(t, 0.7, 1.4) * 0.12 - es(t, 2.0, 2.4) * 0.12 + es(t, 2.95, 3.3) * 0.12 - es(t, 4.2, 4.6) * 0.08 - es(t, 5.2, 5.9) * 0.06;
      S.cam.y = es(t, 0.7, 1.4) * 60 - es(t, 2.0, 2.4) * 110 + es(t, 2.95, 3.3) * 110 - es(t, 4.2, 4.6) * 40 - es(t, 5.2, 5.9) * 20;
    };
  },
};
