// Mt 3,1–2 — the curtains open on the Wilderness of Judea. John comes over the rocks and climbs a flat stone
// to preach; travellers on the desert road are walking away from him. "Repent": they stop, turn round and
// come back. "The kingdom of heaven is near": the sky turns to gold and a crown of light comes down low,
// right over their heads.
import { C, person, blinkAt, pose, lerp, sky, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, sun, cloud } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, headAt, voiceRings, acacia, scrub, hungWord, paperCrown, strip, sparkle, standRock, badlands, manOf, womanOf, DESERT, KINGDOM, tr } from './lib.js';

const PI = Math.PI;
const RX = 800, RY = 688;        // John's stone (its top)
const GY = 742;                  // the ground in front
const ROAD = (x) => 606 + Math.sin(x / 260) * 5;

export default {
  id: 'mt3-desert',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: '«Nawróćcie się,' },
    { v: 2, cont: true, text: 'bo bliskie jest królestwo niebieskie».' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DESERT);
    const gold = sky(S, KINGDOM, { name: 'gold' }).layer;
    gold.fade(0);

    /* sun & clouds on strings */
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1210, y: 170, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 500, y: 170, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1010, y: 120, len: 700 });

    /* the light of the kingdom, rising behind the mountains */
    const burstL = S.layer({ par: 0.05, sh: 1, flat: true });
    burstL.add(`<g transform="translate(800 430)">${rays(c, { n: 22, r0: 40, r1: 1300, spread: 0.045, color: '#fff3cf' })}</g><circle cx="800" cy="430" r="520" fill="url(#halo-glow)"/>`);
    burstL.fade(0);

    /* the mountains of Moab, the badlands of the wilderness */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 452, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.dune, 0.5) }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    mid.add(badlands(c, [[-900, 430], [-500, 390], [-150, 350], [120, 330], [290, 372], [420, 452], [560, 520]], mix(C.dune, C.clay, 0.3)));
    mid.add(badlands(c, [[1030, 520], [1160, 440], [1300, 380], [1480, 350], [1800, 380], [2500, 410]], mix(C.dune, C.clay, 0.42)));

    /* the desert floor and the road */
    const ground = S.layer({ par: 0.3, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(508, [4, 2], [600, 160]), -900, 2500, 1700, 14, 1), mix(C.sand, C.sand2, 0.35));
    gs.p(c.ribbon(Array.from({ length: 36 }, (_, i) => { const x = -900 + i * 100; return [x, ROAD(x) + 10]; }), 36, 2), mix(C.sand, C.cream, 0.4));
    let peb = '';
    for (let i = 0; i < 50; i++) { const y = c.rr(530, 700), x = c.rr(-300, 1900); peb += c.cut(c.blob(x, y, 2 + (y - 500) * 0.02, 1 + (y - 500) * 0.01, 7, 0.2), 0.3, 3); }
    gs.x(peb, C.rock2, 'opacity=".55"');
    ground.add(gs.out());
    ground.add(acacia(c, 250, 560, 1.05) + acacia(c, 1390, 552, 0.8) + scrub(c, 520, 560, 30) + scrub(c, 1100, 566, 34) + rock(c, 1240, 570, 90, 34, C.rock2) + rock(c, 360, 580, 70, 26, C.rock));

    /* the travellers on the road */
    const PH = S.portrait;   // phone: the travellers come back to places inside the screen
    const road = S.layer({ par: 0.3, sh: 4 });
    const TR = [
      { o: manOf(c, { belt: C.leather }), x0: 690, x1: 380, back: PH ? 650 : 590, dir: -1 },
      { o: womanOf(c), x0: 610, x1: 300, back: PH ? 585 : 520, dir: -1 },
      { o: manOf(c, { mantle: C.clayMantle }), x0: 540, x1: 200, back: PH ? 515 : 440, dir: -1 },
      { o: womanOf(c, { robe: C.tealRobe }), x0: 940, x1: 1250, back: PH ? 975 : 1010, dir: 1 },
      { o: manOf(c, { robe: C.wheatRobe }), x0: 1010, x1: 1340, back: PH ? 1045 : 1090, dir: 1 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(road.add(person(c, m.o))), seed: c.rr(0, 9) }));

    /* John and his stone */
    const act = S.layer({ par: 0.5, sh: 5 });
    act.add(`<g transform="translate(${RX} ${RY})">${standRock(c, 230, 110)}</g>`);
    const john = S.puppet(act.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 44, w: 6 });

    /* from the flies: the name of the place, the crown of the kingdom */
    const fly = S.layer({ par: 0.2, sh: 6 });
    const name = fly.add(hungWord(c, tr('Pustynia Judzka', 'the wilderness of Judea'), { size: 24 }));
    const crownEl = hanging(fly, `<circle r="190" fill="url(#halo-glow)"/><g transform="translate(0 -50)">${rays(c, { n: 16, r0: 60, r1: 150, spread: 0.07, color: '#fff3cf' })}</g><g transform="translate(0 -8)">${paperCrown(c, 130)}</g><g transform="translate(0 26)">${strip(c, tr('królestwo niebieskie', 'the Kingdom of Heaven'), { size: 18 })}</g>`, { x: 800, y: 0, len: 900 });
    const sparks = [0, 1, 2, 3, 4].map((i) => fly.add(`<g opacity="0">${sparkle(c, 12 + (i % 2) * 5, C.halo)}</g>`));

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(rock(c, 150, 970, 260, 110, C.rock2) + rock(c, 1470, 960, 240, 120, C.rock) + scrub(c, 330, 945, 70, C.olive) + scrub(c, 1290, 950, 60, C.moss));

    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);
      swing(sunEl, 1210, 170, time, 1, 0.6);
      swing(cl1, 500 + Math.sin(time * 0.1) * 20, 170, time, 1.2, 0.6, 1);
      swing(cl2, 1010 + Math.sin(time * 0.12 + 2) * 20, 120, time, 1.2, 0.7, 2);

      /* v1 — John comes out of the wilderness, climbs his stone and begins to preach */
      const walkIn = es(t, 1.02, 1.42), climb = es(t, 1.42, 1.58);
      const jx = lerp(lerp(1330, 880, walkIn), RX, climb);
      const jy = lerp(GY, RY, climb) - Math.sin(climb * PI) * 14;
      const preach = es(t, 1.62, 1.85);
      const cry = es(t, 2.05, 2.25) * (1 - es(t, 2.95, 3.1));
      const up = es(t, 3.05, 3.35);
      john.set({
        x: jx, y: jy, s: 1.1, flip: true, o: seg(t, 0.98, 1.02),
        walk: (walkIn > 0 && walkIn < 1) || (climb > 0 && climb < 1) ? jx * 0.05 : undefined,
        armF: 12 + preach * 58 * (1 - cry) + cry * 80 - up * 20, armB: 10 + preach * 60 * (1 - up) + cry * 60 + up * 140,
        head: -preach * 4 - cry * 8 - up * 16, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(jx, jy, 1.1, true);
      voice(hx - 10, hy, Math.max(preach * (1 - es(t, 1.9, 2.05)) * 0.6, cry), time, { spread: 3, s0: 0.7 });

      const nk = es(t, 1.12, 1.42, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      swing(name, 800, lerp(-380, 250, nk), time, 1.2, 0.8);
      fade(name, nk > 0.01 ? 1 : 0);

      /* the travellers: walking away … stop, turn round, and come back (v2a); look up at the kingdom (v2b) */
      TR.forEach((m) => {
        const away = seg(t, 0.9, 2.15);
        const stop = es(t, 2.12, 2.2);
        const turn = t > 2.3 + m.i * 0.03;
        const back = es(t, 2.36 + m.i * 0.04, 2.9 + m.i * 0.02);
        const xAway = lerp(m.x0, m.x1, away * (PH ? 0.15 : 0.55));   // phone: they walk a shorter way, not out through the frame
        const x = lerp(xAway, m.back, back);
        const walking = (away > 0 && away < 1 && stop < 1) || (back > 0 && back < 1);
        const look = es(t, 3.15 + m.i * 0.04, 3.45 + m.i * 0.04);
        const flip = turn ? m.dir > 0 : m.dir < 0;
        m.p.set({
          x, y: ROAD(x) + 12, s: 0.62, flip, walk: walking ? x * 0.07 + m.i : undefined,
          head: bump(t, 2.1, 2.35) * (m.dir < 0 ? -1 : 1) * 8 * (turn ? 0 : 1) - look * 14,
          armF: 10 + bump(t, 2.1, 2.4) * 30 + look * (m.i % 2 ? 110 : 70), armB: look * (m.i % 2 ? 40 : 130),
          blink: blinkAt(time, m.seed),
        });
      });

      /* v2b — the kingdom of heaven is near: gold light and a crown hanging low */
      const kg = es(t, 3.02, 3.5);
      gold.fade(kg * 0.85);
      burstL.fade(kg);
      const ck = es(t, 3.05, 3.55, ease.out);
      swing(crownEl, 800, lerp(-420, 350, ck), time, 1, 0.7);
      fade(crownEl, ck > 0.01 ? 1 : 0);
      sparks.forEach((sp, i) => {
        const k = es(t, 3.35 + i * 0.05, 3.55 + i * 0.05);
        const a = i * 1.25 + time * 0.4;
        pose(sp, { x: 800 + Math.cos(a) * 130, y: 310 + Math.sin(a) * 50, s: k * (0.8 + Math.sin(time * 2 + i) * 0.15), r: time * 30, o: k * 0.9 });
      });

      /* camera: in on John as he preaches, back up for the kingdom */
      S.cam.z = 1 + es(t, 1.0, 1.7) * 0.1 - es(t, 2.9, 3.4) * 0.08;
      S.cam.y = es(t, 1.0, 1.7) * 30 - es(t, 2.9, 3.4) * 70;
      S.cam.x = es(t, 1.0, 1.7) * 10 - es(t, 2.9, 3.4) * 10;
    };
  },
};
