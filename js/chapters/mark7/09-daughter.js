// Mk 7,30 — the mother comes home and finds her little girl lying peacefully on the bed.
// The last grey wisp slips out of the window and turns into sparks of light; the child opens her
// eyes and reaches up to her mother.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { bed, bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { woman, LOOK, PURPLE, MUREX, SEA, DARK, spark, heart } from './lib.js';

const PI = Math.PI;
const FLOOR = 690;
const BED = { x: 720, y: 680, s: 1.1 };
const GIRL = { x: 750, y: 610, s: 0.62 };
const WIN0 = { x: 480, y: 400 };

export default {
  id: 'm7-daughter',
  beats: [
    { v: 30, text: 'Gdy wróciła do domu, zastała dziecko leżące na łóżku,' },
    { v: 30, cont: true, text: 'a zły duch wyszedł.' },
  ],
  cam: { x: [-60, 40], y: [0, 120], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    // phone: the window (where the spirit leaves and the light comes in) moves inward, the shelf with it
    const WIN = S.portrait ? { x: 565, y: 400 } : WIN0;
    const SH = S.portrait ? 85 : 0;
    const SKY = ['#cbd9e0', '#f3e2cc', '#f9ecd8'];
    const sk = sky(S, SKY);
    const out = S.layer({ par: 0.1, sh: 1 });
    out.add(sheet().p(c.ridge(c.wave(450, [3, 1], [200, 70]), -900, 2500, 1700, 10, 0.6), SEA).out());
    const sunEl = out.add(`<g>${sun(c, 40)}</g>`);
    const sunRays = out.add(`<g>${rays(c, { n: 12, r0: 50, r1: 400, color: '#fff3cf' })}</g>`);

    /* ---------- the girl's room ---------- */
    const roomL = S.layer({ par: 0.3, sh: 3 });
    const wcol = mix(C.plaster, C.plaster2, 0.3);
    const win = [[WIN.x - 70, WIN.y + 80], [WIN.x - 70, WIN.y - 20], ...c.arc(WIN.x, WIN.y - 20, 70, 64, PI, 2 * PI, 12), [WIN.x + 70, WIN.y + 80]];
    const door = [[1240, FLOOR + 4], [1240, 500], ...c.arc(1295, 500, 55, 50, PI, 2 * PI, 12), [1350, FLOOR + 4]];
    const w = sheet();
    w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6) + c.hole(door, 0.5, 6), wcol);
    let blotch = '';
    for (let i = 0; i < 12; i++) blotch += c.cut(c.blob(c.rr(-300, 1900), c.rr(200, FLOOR - 70), c.rr(24, 64), c.rr(10, 24), 10, 0.2), 0.8, 6);
    w.x(blotch, shade(wcol, -0.06), 'opacity=".55"');
    w.p(c.ribbon([[WIN.x - 76, WIN.y + 82], [WIN.x + 76, WIN.y + 82]], 9) + c.ribbon([[WIN.x, WIN.y - 84], [WIN.x, WIN.y + 80]], 5), C.wood2);
    w.p(c.ribbon([[1236, FLOOR + 4], [1236, 498]], 9) + c.ribbon([[1354, FLOOR + 4], [1354, 498]], 9) + c.ribbon(c.arc(1295, 500, 60, 55, PI, 2 * PI, 12), 9), C.wood2);
    // her blue hanging, a shelf with a doll and a little jug
    w.p(c.cut([[960, 300], [1140, 300], [1132, 520], [968, 520]], 0.8, 10), C.dustyBlue);
    let st = '';
    for (let y = 330; y < 520; y += 44) for (let x = 986; x < 1120; x += 40) st += c.cut(c.star(x + (y % 88 ? 20 : 0), y, 7, 3, 4, 0), 0.2, 3);
    w.x(st, C.cream, 'opacity=".7"');
    w.p(c.ribbon([[950, 298], [1150, 298]], 6), C.wood2);
    w.p(c.cut(c.rect(600 + SH, 330, 120, 7), 0.3, 6), C.wood2);
    w.p(c.cut([[614 + SH, 330], [610 + SH, 308], [620 + SH, 298], [630 + SH, 308], [626 + SH, 330]], 0.3, 4), C.pot);
    w.p(c.cut(c.circ(676 + SH, 310, 8, 10), 0.3, 3) + c.cut([[666 + SH, 330], [670 + SH, 316], [682 + SH, 316], [686 + SH, 330]], 0.3, 3), C.roseRobe);
    w.p(c.cut([[-900, FLOOR - 46], [2500, FLOOR - 46], [2500, FLOOR + 6], [-900, FLOOR + 6]], 0.8, 14) + c.hole(door.map(([x, y]) => [x, Math.max(y, FLOOR - 46)]), 0.3, 6), shade(wcol, -0.05));
    roomL.add(w.out());
    roomL.add(sheet().p(c.cut([[-900, FLOOR], [2500, FLOOR], [2500, 1700], [-900, 1700]], 1, 30), mix(C.clay, C.sand2, 0.55)).out());
    const beam = roomL.add(`<path d="M${WIN.x - 60} ${WIN.y - 40}L${WIN.x + 70} ${WIN.y - 40}L${BED.x + 180} ${FLOOR + 30}L${BED.x - 120} ${FLOOR + 30}Z" fill="#fff1c4" opacity=".2"/>`);
    const sill = roomL.add(`<g>${bird(c, { color: C.dusk, belly: C.cream })}</g>`);

    /* ---------- the bed, the child, her mother ---------- */
    const bedL = S.layer({ par: 0.5, sh: 5 });
    bedL.add(`<g transform="translate(${BED.x} ${BED.y}) scale(${BED.s})">${bed(c, 220)}</g>`);
    const girlAsleep = bedL.add(`<g>${person(c, { ...LOOK.girl, eyes: 'closed' })}</g>`);
    const girlAwake = S.puppet(bedL.add(person(c, LOOK.girl)));
    const cover = sheet();
    const cp = [[BED.x - 44, 600], [BED.x + 20, 592], [BED.x + 116, 594], [BED.x + 128, 612], [BED.x + 128, 632], [BED.x - 44, 632]];
    cover.p(c.cut(cp, 0.5, 6), MUREX);
    let cs = '';
    for (let x = BED.x - 30; x < BED.x + 120; x += 24) cs += c.cut(c.star(x, 614, 5, 2.2, 4, 0), 0.2, 3);
    cover.x(cs, C.cream, 'opacity=".75"');
    bedL.add(cover.out());
    const wStand = S.puppet(bedL.add(woman(c)));
    const wKneel = S.puppet(bedL.add(woman(c, { pose: 'kneel' })));

    /* ---------- the last of the darkness goes; light comes ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const wisp = fx.add(`<g>${wispCloud(c)}</g>`);
    const glints = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g>${spark(c, c.rr(7, 11))}</g>`), a: (i / 8) * PI * 2, r: c.rr(20, 60) }));
    const love = fx.add(`<g>${heart(c, 16)}</g>`);

    return (t, time) => {
      const T = time;
      const bright = es(t, 1.1, 1.6);
      sk.blend(SKY, ['#d7e7e6', '#f8ead0', '#fdf2dc'], bright);
      pose(sunEl, { x: WIN.x - 20, y: WIN.y - 10 - bright * 40 });
      pose(sunRays, { x: WIN.x - 20, y: WIN.y - 10 - bright * 40, r: t * 6, o: 0.3 + bright * 0.5 });
      fade(beam, 0.18 + bright * 0.3);
      pose(sill, { x: WIN.x + 44, y: WIN.y + 72 - Math.max(0, Math.sin(T * 5)) * 3 * bright, s: 1.1, o: es(t, 1.2, 1.4) });

      /* v30a — she comes in and finds her lying on the bed */
      const wx = lerp(1300, 930, es(t, 0.0, 0.55, ease.out));
      const kneel = es(t, 1.2, 1.28);
      wStand.set({ x: wx, y: FLOOR, s: 1.0, flip: true, o: 1 - kneel, walk: t < 0.55 ? wx * 0.06 : undefined, armF: bump(t, 0.5, 1.0) * 40, head: es(t, 0.5, 0.8) * 16, blink: blinkAt(T, 3) });
      const hug = es(t, 1.35, 1.6);
      wKneel.set({ x: 884, y: FLOOR + 4, s: 1.0, flip: true, o: kneel, armF: 50 + hug * 30, armB: 30 + hug * 50, head: 10 - hug * 4, lean: -hug * 6, blink: blinkAt(T, 3) });
      const awake = es(t, 1.3, 1.4);
      pose(girlAsleep, { x: GIRL.x, y: GIRL.y, r: -90, s: GIRL.s, o: 1 - awake });
      girlAwake.set({ x: GIRL.x, y: GIRL.y, r: -90, s: GIRL.s, o: awake, armF: hug * 60, head: -awake * 10, blink: blinkAt(T, 5) });

      /* v30b — the spirit is gone: the last wisp flies out of the window and turns to light */
      const go = es(t, 0.85, 1.35, ease.in);
      const wxp = lerp(730, WIN.x, go), wyp = lerp(540, WIN.y - 10, go) - Math.sin(go * PI) * 40;
      pose(wisp, { x: wxp, y: wyp + Math.sin(T * 2) * 3, s: 0.8 - go * 0.5, r: Math.sin(T * 1.2) * 6, o: (t < 1.35 ? 0.9 : 0) * (1 - seg(t, 1.25, 1.35)) });
      glints.forEach((g) => {
        const k = seg(t, 1.3, 1.9);
        pose(g.el, { x: WIN.x + Math.cos(g.a) * g.r * (0.4 + k), y: WIN.y - 10 + Math.sin(g.a) * g.r * (0.4 + k) - k * 30, s: bump(t, 1.3, 1.95) * 1.2, o: bump(t, 1.3, 1.95) });
      });
      const lk = es(t, 1.5, 1.7, ease.back);
      pose(love, { x: 830, y: 500 - lk * 16 + Math.sin(T * 2) * 3, s: lk, o: lk > 0.02 ? 1 : 0 });

      S.cam.z = 1.06 + es(t, 0.4, 1.3) * 0.14;
      S.cam.x = lerp(40, -60, es(t, 0.3, 1.2));
      S.cam.y = 40 + es(t, 0.4, 1.3) * 80;
    };
  },
};

function wispCloud(c) {
  const s = sheet();
  s.p(c.cut([...c.arc(-14, 0, 16, 13, PI, 2 * PI, 8), ...c.arc(6, -6, 19, 18, PI, 2 * PI, 9), ...c.arc(24, 2, 13, 11, PI * 1.1, 2 * PI, 6), [36, 10], [-30, 10]], 0.8, 5), mix(DARK, C.lavender, 0.35));
  s.x(c.ribbon(c.cbez([-14, 10], [-22, 22], [-4, 26], [-14, 38], 10), (u) => 3.4 - u * 2.6), mix(DARK, C.lavender, 0.35), 'opacity=".8"');
  return s.out();
}
