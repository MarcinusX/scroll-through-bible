// Mt 15,28b — "And her daughter was healed from that very hour": far away in the house in Tyre, in the same moment,
// the grey storm over the little girl's bed shrinks and slips out of the window, turning into sparks of light; the
// sun comes in, a bird lands on the sill, and the child opens her eyes and sits up in bed, well.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import { bed, bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { L7, MUREX, spiritCloud, spark, heart, PI } from './lib.js';

const FLOOR = 690;
const BED = { x: 760, y: 680, s: 1.1 };
const GIRL = { x: 790, y: 610, s: 0.62 };
const WIN0 = { x: 500, y: 400 };

export default {
  id: 'mt15-daughter',
  beats: [
    { v: 28, cont: true, text: 'Od tej chwili jej córka była zdrowa.' },
  ],
  cam: { x: [-60, 40], y: [0, 120], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const WIN = { ...WIN0, x: S.portrait ? 548 : WIN0.x };   // phone: the window (where the spirit leaves, the sun comes in) inside the screen
    sky(S, ['#b9b3d2', '#ead2c2', '#f3dfca']);
    const day = sky(S, ['#d7e7e6', '#f8ead0', '#fdf2dc'], { name: 'day', rise: 0 }).layer;
    day.fade(0);
    const out = S.layer({ par: 0.1, sh: 1 });
    out.add(sheet().p(c.ridge(c.wave(450, [3, 1], [200, 70]), -900, 2500, 1700, 10, 0.6), mix(C.lake, C.skyBlue2, 0.3)).out());
    const sunEl = out.add(`<g>${sun(c, 40)}</g>`);
    const sunRays = out.add(`<g>${rays(c, { n: 12, r0: 50, r1: 400, color: '#fff3cf' })}</g>`);

    /* ---------- the girl's room ---------- */
    const roomL = S.layer({ par: 0.3, sh: 3 });
    const wcol = mix(C.plaster, C.plaster2, 0.3);
    const win = [[WIN.x - 70, WIN.y + 80], [WIN.x - 70, WIN.y - 20], ...c.arc(WIN.x, WIN.y - 20, 70, 64, PI, 2 * PI, 12), [WIN.x + 70, WIN.y + 80]];
    const w = sheet();
    w.p(c.cut([[-900, -1200], [2500, -1200], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6), wcol);
    let blotch = '';
    for (let i = 0; i < 12; i++) blotch += c.cut(c.blob(c.rr(-300, 1900), c.rr(200, FLOOR - 70), c.rr(24, 64), c.rr(10, 24), 10, 0.2), 0.8, 6);
    w.x(blotch, shade(wcol, -0.06), 'opacity=".55"');
    w.p(c.ribbon([[WIN.x - 76, WIN.y + 82], [WIN.x + 76, WIN.y + 82]], 9) + c.ribbon([[WIN.x, WIN.y - 84], [WIN.x, WIN.y + 80]], 5), C.wood2);
    w.p(c.cut([[960, 300], [1140, 300], [1132, 520], [968, 520]], 0.8, 10), C.dustyBlue);
    let st = '';
    for (let y = 330; y < 520; y += 44) for (let x = 986; x < 1120; x += 40) st += c.cut(c.star(x + (y % 88 ? 20 : 0), y, 7, 3, 4, 0), 0.2, 3);
    w.x(st, C.cream, 'opacity=".7"');
    w.p(c.ribbon([[950, 298], [1150, 298]], 6), C.wood2);
    w.p(c.cut(c.rect(620, 330, 120, 7), 0.3, 6), C.wood2);
    w.p(c.cut([[634, 330], [630, 308], [640, 298], [650, 308], [646, 330]], 0.3, 4), C.pot);
    w.p(c.cut(c.circ(696, 310, 8, 10), 0.3, 3) + c.cut([[686, 330], [690, 316], [702, 316], [706, 330]], 0.3, 3), C.roseRobe);
    w.p(c.cut([[-900, FLOOR - 46], [2500, FLOOR - 46], [2500, FLOOR + 6], [-900, FLOOR + 6]], 0.8, 14), shade(wcol, -0.05));
    roomL.add(w.out());
    roomL.add(sheet().p(c.cut([[-900, FLOOR], [2500, FLOOR], [2500, 1700], [-900, 1700]], 1, 30), mix(C.clay, C.sand2, 0.55)).out());
    const beam = roomL.add(`<path d="M${WIN.x - 60} ${WIN.y - 40}L${WIN.x + 70} ${WIN.y - 40}L${BED.x + 180} ${FLOOR + 30}L${BED.x - 120} ${FLOOR + 30}Z" fill="#fff1c4" opacity=".1"/>`);
    const sill = roomL.add(`<g>${bird(c, { color: C.dusk, belly: C.cream })}</g>`);

    /* ---------- the bed and the child ---------- */
    const bedL = S.layer({ par: 0.5, sh: 5 });
    bedL.add(`<g transform="translate(${BED.x} ${BED.y}) scale(${BED.s})">${bed(c, 220)}</g>`);
    const asleep = bedL.add(`<g>${person(c, { ...L7.girl, eyes: 'closed' })}</g>`);
    const cover = sheet();
    const cp = [[BED.x - 44, 600], [BED.x + 20, 592], [BED.x + 116, 594], [BED.x + 128, 612], [BED.x + 128, 632], [BED.x - 44, 632]];
    cover.p(c.cut(cp, 0.5, 6), MUREX);
    let cs = '';
    for (let x = BED.x - 30; x < BED.x + 120; x += 24) cs += c.cut(c.star(x, 614, 5, 2.2, 4, 0), 0.2, 3);
    cover.x(cs, C.cream, 'opacity=".75"');
    const coverEl = bedL.add(cover.out());
    const awake = S.puppet(bedL.add(person(c, { ...L7.girl, pose: 'sit' })));

    /* ---------- the spirit goes; light comes ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const cloud = fx.add(`<g>${spiritCloud(c)}</g>`);
    const glints = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g>${spark(c, c.rr(7, 11))}</g>`), a: (i / 8) * PI * 2, r: c.rr(20, 60) }));
    const love = fx.add(`<g>${heart(c, 16)}</g>`);

    return (t, time) => {
      const T = time;
      const go = es(t, 0.1, 0.5, ease.in);
      const bright = es(t, 0.35, 0.65);
      day.fade(bright);
      pose(sunEl, { x: WIN.x - 20, y: WIN.y - 10 - bright * 40 });
      pose(sunRays, { x: WIN.x - 20, y: WIN.y - 10 - bright * 40, r: t * 6, o: 0.2 + bright * 0.6 });
      fade(beam, 0.1 + bright * 0.35);
      pose(sill, { x: WIN.x + 44, y: WIN.y + 72 - (T ? Math.max(0, Math.sin(T * 5)) * 3 : 0) * bright - (1 - es(t, 0.5, 0.65)) * 80, s: 1.1, o: es(t, 0.5, 0.6) });

      /* the grey storm shrinks and slips out of the window, turning to sparks */
      const cx = lerp(GIRL.x - 10, WIN.x, go), cy = lerp(GIRL.y - 110, WIN.y - 10, go) - Math.sin(go * PI) * 50;
      pose(cloud, { x: cx, y: cy + (T ? Math.sin(T * 2) * 3 : 0), s: 1.2 - go * 0.8, r: T ? Math.sin(T * 1.2) * 6 : 0, o: 0.95 * (1 - seg(t, 0.44, 0.52)) });
      glints.forEach((g) => {
        const k = seg(t, 0.48, 0.95);
        pose(g.el, { x: WIN.x + Math.cos(g.a) * g.r * (0.4 + k), y: WIN.y - 10 + Math.sin(g.a) * g.r * (0.4 + k) - k * 30, s: bump(t, 0.48, 1.0) * 1.2, o: bump(t, 0.48, 1.0) });
      });

      /* the child wakes and sits up, well */
      const up = es(t, 0.55, 0.62);
      pose(asleep, { x: GIRL.x, y: GIRL.y, r: -90, s: GIRL.s, o: 1 - up });
      const joy = es(t, 0.62, 0.8);
      awake.set({ x: BED.x + 10, y: 606, s: 0.66, o: up, armF: 30 + joy * 60, armB: 20 + joy * 120, head: -joy * 10, blink: blinkAt(T, 5) });
      pose(coverEl, { x: 0, y: up * 8, o: 1 });
      const lk = es(t, 0.7, 0.85, ease.back);
      pose(love, { x: BED.x + 60, y: 470 - lk * 16 + (T ? Math.sin(T * 2) * 3 : 0), s: lk, o: lk > 0.02 ? 1 : 0 });

      S.cam.z = 1.1 + es(t, 0.0, 0.7) * 0.08;
      S.cam.x = lerp(20, -40, es(t, 0, 0.6));
      S.cam.y = 50 + es(t, 0, 0.7) * 50;
    };
  },
};
