// J 11,54 — dusk. Jesus draws His mantle over His head and no longer goes about openly; Jerusalem falls behind on the
// far hills. With the disciples He walks out into the country by the wilderness — dunes, scrub, an acacia — toward a
// small town on a hill, and its name comes down on a tag: Ephraim. There He stays with His disciples: they sit round
// a little fire at the edge of the town while the first stars come out and lamps are lit in the windows.
import { C, person, CAST, blinkAt, sky, hanging } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { band, hillsWith, house, grass, stars, moon, bush, rock } from '../../assets/nature.js';
import { walledCity, acacia, scrub, flame } from '../mark1/lib.js';
import { JESUS_HOODED, DISC, DUSK, NIGHT, hungWord, vis, kf, moving, pose, attr, sheet, shade, mix, lerp, tr, PI } from './lib.js';

const F = 712;
const FX = 1010;            // the little fire

export default {
  id: 'j11-ephraim',
  beats: [
    { v: 54, text: 'Odtąd Jezus już nie występował wśród Żydów publicznie,' },
    { v: 54, cont: true, text: 'tylko odszedł stamtąd do krainy w pobliżu pustyni, do miasteczka, zwanego Efraim,' },
    { v: 54, cont: true, text: 'i tam przebywał ze swymi uczniami.' },
  ],
  cam: { x: [-60, 310], y: [-60, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const EV = ['#8f7fa8', '#dca58c', '#f0c79a'];
    const sk = sky(S, EV);
    const starL = S.layer({ par: 0.02, sh: 0, flat: true });
    starL.add(stars(c, { x0: -200, x1: 2000, y0: -200, y1: 430, n: 70 }));
    const hangL = S.layer({ par: 0.04, sh: 3 });
    const moonEl = hanging(hangL, moon(c, 30), { x: 1280, y: 190, len: 400 });
    const far = S.layer({ par: 0.08, sh: 2 });
    const f1 = band(c, { y: 470, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.35) });
    far.add(f1.markup + walledCity(c, 330, f1.fn(330) + 8, 0.5, { wall: mix(C.stone, C.duskViolet, 0.4), wall2: mix(C.stone2, C.duskViolet, 0.45), temple: mix(C.cream, C.duskViolet, 0.3) }));
    const mid = S.layer({ par: 0.18, sh: 3 });
    const m1 = band(c, { y: 540, amps: [26, 10, 3], lens: [700, 260, 90], color: mix(C.dune, C.dusk, 0.25) });
    let town = '';
    [[1040, 1], [1090, 0.8], [1130, 1.1], [1185, 0.9], [1230, 1]].forEach(([x, s], i) => { town += house(c, x, m1.fn(x) + 10 - (i % 2) * 8, 44 * s, 34 * s, { wall: mix(C.plaster, C.dune, 0.3), shadow: mix(C.plaster2, C.dune, 0.4), stairs: i % 2 === 0 }); });
    mid.add(m1.markup + town + acacia(c, 640, m1.fn(640) + 8, 0.8) + scrub(c, 880, m1.fn(880) + 4, 36));
    const winL = S.layer({ par: 0.18, sh: 0, flat: true });
    let wins = '';
    [[1040, 1], [1090, 0.8], [1130, 1.1], [1185, 0.9], [1230, 1]].forEach(([x, s], i) => { const w = 44 * s, h = 34 * s, y = m1.fn(x) + 10 - (i % 2) * 8; wins += c.poly(c.rect(x + w * 0.6, y - h * 0.72, w * 0.16, h * 0.18)); });
    winL.add(`<path d="${wins}" fill="${C.lampFlame}"/>`);
    const ground = S.layer({ par: 0.42, sh: 3 });
    const g1 = band(c, { y: 646, amps: [7, 3], lens: [600, 200], color: mix(C.sand, C.dune, 0.4) });
    const path = c.cbez([-900, 760], [0, 700], [700, 720], [2400, 690], 40);
    ground.add(g1.markup + sheet().p(c.ribbon(path, 90, 2), mix(C.sand, C.cream, 0.3)).out() + scrub(c, 300, 668, 40) + scrub(c, 1350, 664, 50) + rock(c, 520, 700, 70, 26, C.rock2) + grass(c, { x0: -800, x1: 2400, y: 646, fn: g1.fn, n: 26, h: 12, color: C.olive }));
    const fireL = S.layer({ par: 0.48, sh: 2 });
    const fireGlow = fireL.add(`<g><circle r="220" fill="url(#warm-glow)"/></g>`);
    const logs = fireL.add(`<g>${sheet().p(c.ribbon([[-24, 0], [22, -8]], 7) + c.ribbon([[-20, -8], [24, 0]], 7), C.wood2).out()}</g>`);
    const fl = fireL.add(`<g>${flame(c, 40)}</g>`);

    const A = S.layer({ par: 0.52, sh: 5 });
    const hoodJ = { ...JESUS_HOODED, halo: true };
    const WALK = [-70, -130, -190, -250, -310, -370];
    const walkers = DISC.map((o, i) => ({ i, dx: WALK[i], p: S.puppet(A.add(person(c, o))) }));
    const jOpen = S.puppet(A.add(person(c, CAST.jesus)));
    const jHood = S.puppet(A.add(person(c, hoodJ)));
    const SIT = [[860, 0], [800, 0], [1090, 1], [1150, 1], [1210, 1], [740, 0]];
    const sitters = DISC.map((o, i) => ({ i, x: SIT[i][0], flip: !!SIT[i][1], p: S.puppet(A.add(person(c, { ...o, pose: 'sit' }))) }));
    const jSit = S.puppet(A.add(person(c, { ...hoodJ, pose: 'sit' })));
    const X = S.layer({ par: 0.56, sh: 6 });
    const name = X.add(hungWord(c, tr('Efraim', 'Ephraim'), { size: 28 }));
    const wild = X.add(hungWord(c, tr('pustynia', 'the wilderness'), { size: 20 }));

    const JK = [[0, 700], [1.0, 770], [2.1, 1010], [2.15, 1010]];
    return (t, time) => {
      const T = time;
      const nk = es(t, 1.2, 3.0);
      sk.blend(EV, NIGHT, nk * 0.85);
      starL.fade(es(t, 1.8, 2.8));
      pose(moonEl, { x: 1280, y: 190 + (1 - es(t, 1.5, 2.6)) * 60, r: Math.sin(T * 0.6) * 1.5, o: es(t, 1.5, 1.8) });
      winL.fade(es(t, 2.1, 2.5));

      /* v54a — the mantle drawn over His head; He no longer goes about openly */
      const hood = seg(t, 0.35, 0.42);
      const sit = seg(t, 2.15, 2.22);
      const jx = kf(t, JK);
      const walking = moving(t, JK);
      jOpen.set({ x: jx, y: F, s: 1.02, walk: walking ? jx * 0.1 : undefined, armF: 14 + bump(t, 0.1, 0.45) * 130, armB: 10 + bump(t, 0.1, 0.45) * 120, head: 4, blink: blinkAt(T, 1), o: 1 - hood });
      jHood.set({ x: jx, y: F, s: 1.02, walk: walking ? jx * 0.1 : undefined, armF: 14, head: 4 - es(t, 1.0, 1.3) * 6, blink: blinkAt(T, 1), o: hood * (1 - sit) });
      walkers.forEach((w) => {
        const x = jx + w.dx;
        w.p.set({ x, y: F + (w.i % 2) * 10, s: 0.92, walk: walking ? x * 0.1 + w.i : undefined, armF: 10, head: 4, blink: blinkAt(T, w.i + 4), o: 1 - sit });
      });

      /* v54b — into the wilderness, to Ephraim */
      const nm = es(t, 1.25, 1.6, ease.back);
      vis(name, { x: 1135, y: 380 - (1 - nm) * 420, r: Math.sin(T * 0.7) * 1.2, o: nm > 0.01 ? 1 : 0 });
      const wd = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.9, 2.1));
      vis(wild, { x: 700, y: 360 - (1 - wd) * 420, r: Math.sin(T * 0.8 + 1) * 1.2, o: wd > 0.01 ? 1 : 0 });

      /* v54c — they stay there: a fire at the edge of the town */
      const fk = es(t, 2.2, 2.45);
      vis(fireGlow, { x: FX, y: F - 10, s: 0.9 + Math.sin(T * 5) * 0.03, o: fk * 0.9 });
      vis(logs, { x: FX, y: F + 8, o: fk });
      vis(fl, { x: FX, y: F + 2, sx: 1 + Math.sin(T * 7) * 0.08, sy: fk * (1 + Math.sin(T * 5.3) * 0.12), o: fk });
      jSit.set({ x: 930, y: F - 4, s: 1.0, armF: 30 + bump(t, 2.4, 3.0) * 20, head: 6, blink: blinkAt(T, 1), o: sit });
      sitters.forEach((d) => d.p.set({ x: d.x, y: F + 4 + (d.i % 2) * 8, s: 0.9, flip: d.flip, armF: 30, head: 4, blink: blinkAt(T, d.i + 4), o: sit }));

      // phone: the whole circle round the fire, the town and its name in view
      S.cam.x = S.portrait ? kf(t, [[0, -30], [1, 0], [2, 260], [3, 300]]) : kf(t, [[0, -30], [1, 0], [2, 160], [3, 180]]);
      S.cam.y = kf(t, [[0, 0], [1, -40], [2, -20], [3, 10]]);
      S.cam.z = S.portrait ? kf(t, [[0, 1.02], [1, 1.0], [3, 1.03]]) : kf(t, [[0, 1.02], [1, 1.0], [2, 1.04], [3, 1.12]]);
    };
  },
};
