// Mk 9,2a — six days go by (six little suns drop in on their strings); Jesus takes Peter, James
// and John apart from the others and leads them up a zig-zag path to the top of a high mountain.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, olive, town, sun, cloud, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { TWELVE, along, nameTag } from './lib.js';
import { tr } from '../../core/i18n.js';

const PI = Math.PI;
const PAR = 0.45;
const FOOT = 724;
const PATH = [[640, FOOT + 2], [700, 690], [860, 650], [690, 590], [930, 520], [760, 440], [930, 360], [840, 290], [900, 226]];

export default {
  id: 'm9-ascent',
  beats: [
    { v: 2, text: 'Po sześciu dniach Jezus wziął z sobą Piotra, Jakuba i Jana' },
    { v: 2, cont: true, text: 'i zaprowadził ich samych osobno na górę wysoką.' },
  ],
  cam: { x: [-20, 60], y: [-160, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const MORN = ['#c3d8d8', '#e8e6d2', '#f4e2c6'];
    sky(S, MORN);

    // six days: six little suns come down one by one on their strings
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const suns = Array.from({ length: 6 }, (_, i) => ({ i, x: 640 + i * 64, el: hanging(hangL, sun(c, 17), { x: 640 + i * 64, y: 150, len: 700 }) }));
    const clouds = [[520, 250, 220], [1210, 190, 170]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, cloud(c, w), { x, y, len: 800 }) }));

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 520, amps: [24, 10, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.lavender, 0.3) }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 590, amps: [16, 7, 3], lens: [900, 300, 110], color: mix(C.hillMid, C.hillFar, 0.3), trees: 20, treeColor: C.sage, treeH: 20 });
    hills.add(h2.markup);
    hills.add(town(c, { x: 260, y: h2.fn(260) + 8, n: 6, spread: 220, sc: 0.5 }));

    /* ---------- the high mountain ---------- */
    const mt = S.layer({ par: PAR, sh: 4 });
    const s = sheet();
    const prof = [[-900, 1700], [-900, 760], [300, 740], [480, 660], [600, 560], [700, 430], [780, 300], [850, 212], [900, 196], [950, 214], [1010, 290], [1100, 400], [1220, 520], [1360, 640], [1560, 720], [2500, 750], [2500, 1700]];
    s.p(c.cut(prof, 1.6, 12), mix(C.hillNear, C.rock, 0.3));
    s.p(c.cut([[600, 560], [700, 430], [780, 300], [850, 212], [880, 260], [800, 400], [720, 560], [640, 700], [480, 700]], 1.2, 10), shade(mix(C.hillNear, C.rock, 0.3), -0.08), 'opacity=".8"');
    s.p(c.cut([[950, 214], [1010, 290], [1100, 400], [1220, 520], [1180, 560], [1060, 470], [980, 330]], 1.2, 10), shade(mix(C.hillNear, C.rock, 0.3), 0.12), 'opacity=".7"');
    // a crown of pale rock and snow at the top
    s.p(c.cut([[790, 290], [850, 212], [900, 196], [950, 214], [1000, 280], [968, 268], [940, 290], [912, 262], [880, 294], [846, 270], [820, 300]], 0.8, 8), C.cream);
    s.p(c.ribbon(PATH.map(([x, y]) => [x, y + 3]), 10, 2), mix(C.sand, C.hillNear, 0.3));
    mt.add(s.out());
    mt.add(rock(c, 640, 600, 60, 26, C.rock2) + rock(c, 1080, 470, 70, 30, C.rock) + rock(c, 980, 610, 50, 20) + cypress(c, 560, 650, 90, C.moss2) + cypress(c, 1160, 560, 100, C.moss2) + cypress(c, 1190, 570, 80, C.moss2));
    // the foot of the mountain
    const foot = sheet().p(c.cut([[-900, FOOT + 4], [2500, FOOT + 4], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sage2, C.sand, 0.4)).out();
    mt.add(foot);
    mt.add(olive(c, 220, FOOT + 10, 0.9) + olive(c, 1400, FOOT + 12, 0.8) + grass(c, { x0: -200, x1: 1800, y: FOOT + 6, n: 30, h: 12, color: C.olive }));

    // a veil of cloud around the mountain's shoulder (in front of it)
    const mist = S.layer({ par: PAR + 0.02, sh: 3 });
    const mists = [[600, 500, 260], [1160, 430, 220]].map(([x, y, w], i) => ({ x, y, i, el: mist.add(`<g transform="scale(1 .7)">${cloud(c, w, '#f7f1e4', '#ece3d3')}</g>`) }));

    /* ---------- the people ---------- */
    const pL = S.layer({ par: PAR, sh: 4 });
    const REST = TWELVE.filter((d) => !['peter', 'james', 'john'].includes(d.k));
    const others = REST.map((d, i) => ({ i, x: 190 + i * 44 + (i % 2) * 8, y: FOOT + 6 + (i % 2) * 8, s: 0.6 + (i % 3) * 0.02, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, d.o))) }));
    const THREE = [CAST.peter, CAST.james, CAST.john].map((o, i) => ({ i, o, xe: 700 + i * 62, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, o))) }));
    THREE.forEach((d) => { d.path = [[d.xe, FOOT + 8], ...PATH.slice(1)]; });
    const jesus = S.puppet(pL.add(person(c, CAST.jesus)));
    const NAMES = [tr('Piotr', 'Peter'), tr('Jakub', 'James'), tr('Jan', 'John')];
    const tags = THREE.map((d) => pL.add(`<g opacity="0">${nameTag(c, NAMES[d.i], { size: 15 })}</g>`));
    const summitGlow = pL.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(rock(c, 180, 980, 260, 90, C.rock2) + rock(c, 1440, 990, 220, 80, C.rock));

    return (t, time) => {
      const T = time;
      suns.forEach((sn) => {
        const d = es(t, 0.02 + sn.i * 0.07, 0.14 + sn.i * 0.07, ease.back);
        swing(sn.el, sn.x, lerp(-1000, 150, d), T, 1.6, 0.9, sn.i);
      });
      clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.3, 0.6, cl.i));
      mists.forEach((m) => pose(m.el, { x: m.x + (m.i ? -1 : 1) * es(t, 1, 2) * 30, y: m.y, o: 0.6 }));

      // the nine stay below and watch them go
      others.forEach((m) => {
        const watch = es(t, 0.6, 1.1);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, head: -watch * 12, armF: watch * (m.i % 3 === 0 ? 60 : 10), blink: blinkAt(T, m.seed) });
      });

      // beat 0: he calls the three out of the group; beat 1: they climb the zig-zag path
      const call = es(t, 0.2, 0.45);
      const climb = seg(t, 1.02, 1.95);
      const [jx0, jy0] = [640, FOOT + 2];
      if (climb <= 0) {
        jesus.set({ x: jx0, y: jy0, s: 0.66, flip: t < 0.9, armF: call * 70 * (1 - es(t, 0.8, 0.95)) + es(t, 0.9, 1) * 40, armB: 10, head: -call * 4, blink: blinkAt(T, 1) });
      } else {
        const [x, y, dir] = along(PATH, climb);
        jesus.set({ x, y, s: lerp(0.66, 0.3, (FOOT - y) / (FOOT - 226)), flip: dir < 0, walk: climb < 1 ? climb * 90 : undefined, amt: 0.8, blink: blinkAt(T, 1) });
      }
      THREE.forEach((d) => {
        const step = es(t, 0.3 + d.i * 0.07, 0.62 + d.i * 0.07);
        if (climb <= 0.002 + d.i * 0.035) {
          const x = lerp(430 + d.i * 50, d.xe, step);
          d.cx = x;
          d.p.set({ x, y: FOOT + 8 + (1 - step) * 6, s: 0.64, flip: step > 0.97 && t > 0.9 ? true : false, walk: step > 0 && step < 1 ? x * 0.06 : undefined, head: step * -4, blink: blinkAt(T, d.seed) });
        } else {
          const u = Math.max(0, climb - 0.035 * (d.i + 1));
          const [x, y, dir] = along(d.path, u);
          d.p.set({ x, y: y + 2, s: lerp(0.64, 0.29, (FOOT - y) / (FOOT - 226)), flip: dir < 0, walk: u < 1 && climb < 1 ? u * 90 + d.i : undefined, amt: 0.8, blink: blinkAt(T, d.seed) });
        }
      });
      THREE.forEach((d, i) => {
        const on = es(t, 0.45 + i * 0.08, 0.65 + i * 0.08, ease.back) * (1 - es(t, 1.02, 1.12));
        pose(tags[i], { x: (d.cx ?? d.xe) + 4, y: FOOT - 176 + Math.sin(T * 1.3 + i) * 2, s: on, o: on });
      });
      pose(summitGlow, { x: 900, y: 190, s: 0.6 + es(t, 1.7, 2) * 0.6, o: es(t, 1.6, 2) * 0.8 });

      S.cam.z = 1 + es(t, 1.1, 1.95) * 0.12;
      S.cam.y = 20 - es(t, 1.05, 1.95) * 170;
      S.cam.x = es(t, 1.05, 1.95) * 50;
    };
  },
};
