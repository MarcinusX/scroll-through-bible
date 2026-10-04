// Mk 9,30–32 — through Galilee by the back roads, unnoticed, at dusk. By the wayside Jesus teaches them:
// the Son of Man will be handed over into the hands of men (a small figure of light, hands reaching up
// around it); they will kill him (the light goes out, night falls, three moons pass on their strings) —
// and after three days he will rise (a sunrise). They do not understand, and are afraid to ask.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, olive, town, sun, moon, stars, cypress, bush } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { TWELVE, plate, reachingHand, thought, GLYPH, kf, silhouette } from './lib.js';

const PI = Math.PI;
const P = 0.45;
const ROAD = 668;
const SPOTS_L = [[690, -1, 1], [630, -1, 1], [560, -1, 0], [500, -1, 0], [910, 1, 1], [970, 1, 1], [1040, 1, 0], [1100, 1, 0]];
const SPOTS_P = [[700, -1, 1], [648, -1, 1], [595, -1, 0], [545, -1, 0], [900, 1, 1], [952, 1, 1], [1003, 1, 0], [1053, 1, 0]];   // phone: the circle drawn in

export default {
  id: 'm9-galilee',
  beats: [
    { v: 30, text: 'Po wyjściu stamtąd podróżowali przez Galileę,' },
    { v: 30, cont: true, text: 'On jednak nie chciał, żeby kto wiedział o tym.' },
    { v: 31, text: 'Pouczał bowiem swoich uczniów i mówił im: «Syn Człowieczy będzie wydany w ręce ludzi.' },
    { v: 31, cont: true, text: 'Ci Go zabiją, lecz zabity po trzech dniach zmartwychwstanie».' },
    { v: 32 },
  ],
  cam: { x: [-40, 40], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const DUSK = ['#8f86ad', '#e3a58e', '#f3c79e'];
    const NIGHT = ['#141a3d', '#26306a', '#4b5791'];
    const DAWN = ['#a9b8d6', '#f4cfa8', '#f9dcb4'];
    const sk = sky(S, DUSK);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 120 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    // phone: the setting sun and the third moon inside the screen, clear of the progress thread
    const PH = S.portrait;
    const SUNX = PH ? 1020 : 1180;
    const MOONX = (i) => (PH ? 830 + i * 120 : 860 + i * 150);
    const sunDown = hanging(hangL, sun(c, 40, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: SUNX, y: 330, len: 900 });
    const moons = [0, 1, 2].map((i) => ({ i, x: MOONX(i), el: hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 30)}`, { x: MOONX(i), y: 170, len: 900 }) }));
    const dawnL = S.layer({ par: 0.05, sh: 1, flat: true });
    const dawnRays = dawnL.add(`<g opacity="0"><circle r="300" fill="url(#warm-glow)"/>${rays(c, { n: 18, r0: 60, r1: 700, spread: 0.05, color: '#fff1c8' })}</g>`);
    const risingSun = hanging(hangL, sun(c, 50), { x: 1000, y: 470, len: 1000 });

    /* ---------- Galilee: far hills, a village on the right ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [22, 9, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.duskViolet, 0.35) }).markup);
    const hills = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 530, amps: [18, 8, 3], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.2), trees: 22, treeColor: mix(C.sage, C.duskViolet, 0.2), treeH: 20 });
    hills.add(h2.markup);
    const villageL = S.layer({ par: 0.3, sh: 3 });
    // phone: the village (and the villagers who must not notice them) inside the screen, not under the thread
    villageL.add(town(c, { x: PH ? 1030 : 1260, y: 600, n: 7, spread: PH ? 220 : 300, sc: 0.8, lit: true }));
    const villagers = (PH ? [[945, 604], [1025, 606], [1090, 600]] : [[1130, 604], [1330, 606], [1410, 600]]).map(([x, y], i) => ({ x, y, i, seed: c.rr(0, 9), p: S.puppet(villageL.add(person(c, { ...TWELVE[(i * 5) % 12].o, robe: [C.roseRobe, C.ochreRobe, C.sageRobe][i], mantle: null, hairStyle: i === 1 ? 'veil' : 'wrap', veil: C.linen2, beard: i === 1 ? 'none' : 'short' }))) }));

    /* ---------- the road and the hedge that hides them ---------- */
    const roadL = S.layer({ par: P, sh: 3 });
    const g = sheet();
    g.p(c.cut([[-900, 620], [2500, 620], [2500, 1700], [-900, 1700]], 1, 20), mix(C.hillNear, C.duskViolet, 0.15));
    g.p(c.ribbon([[-900, ROAD + 8], [300, ROAD + 4], [800, ROAD + 10], [1300, ROAD + 2], [2500, ROAD + 6]], 26, 2), mix(C.sand, C.duskViolet, 0.18));
    roadL.add(g.out());
    roadL.add(olive(c, 200, 640, 0.9) + cypress(c, 1500, 640, 130, C.moss2) + rock(c, 800, ROAD - 6, 90, 22, C.rock2));

    /* ---------- Jesus and the disciples ---------- */
    const pL = S.layer({ par: P, sh: 5 });
    const DIS = [0, 3, 1, 2, 4, 6, 7, 10].map((k, i) => ({ ...TWELVE[k], i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, TWELVE[k].o))), q: S.puppet(pL.add(person(c, { ...TWELVE[k].o, pose: 'sit' }))) }));
    const jesus = S.puppet(pL.add(person(c, CAST.jesus)));
    const jSit = S.puppet(pL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const qs = DIS.slice(0, 5).map((d, i) => ({ d, el: pL.add(`<g opacity="0">${thought(c, GLYPH.q(c), { w: 46, h: 38 })}</g>`) }));

    // a hedge in front of the road: on the back roads they pass half hidden
    const hedgeL = S.layer({ par: P + 0.05, sh: 4 });
    const hedge = sheet();
    for (let x = -300; x < 1900; x += 46) hedge.p(c.cut(c.blob(x, 716, 44, 26, 10, 0.2), 1, 6), x % 92 ? mix(C.moss, C.duskViolet, 0.2) : mix(C.sage, C.duskViolet, 0.2));
    hedge.p(c.cut([[-300, 716], [1900, 716], [1900, 1700], [-300, 1700]], 1, 20), mix(C.hillNear, C.duskViolet, 0.25));
    hedgeL.add(hedge.out());

    /* ---------- the plate: handed over into the hands of men ---------- */
    const plL = S.layer({ par: 0.12, sh: 5 });
    const light = `<g transform="translate(0 44) scale(.42)">${person(c, { ...silhouette(CAST.jesus, '#fff6dc'), halo: false })}</g>`;
    const handCols = [C.skin2, C.skin3, C.skin4, C.skin, C.skin3, C.skin2];
    const hands = handCols.map((col, i) => `<g class="hnd" transform="translate(${-56 + i * 22} ${96 + (i % 2) * 8}) rotate(${(i - 2.5) * 8})">${reachingHand(c, col)}</g>`).join('');
    S.defs(`<clipPath id="${S.id('pl')}"><circle r="84"/></clipPath>`);
    const handPlate = hanging(plL, `${plate(c, '', { r: 84, fill: C.parchment })}<g clip-path="url(#${S.id('pl')})"><g data-k="lightfig"><circle cy="-10" r="60" fill="url(#halo-glow)"/>${light}</g><g data-k="hands">${hands}</g><rect data-k="plshade" x="-90" y="-90" width="180" height="180" fill="#2a2446" opacity="0"/></g>`, { x: 640, y: 250, len: 900 });
    const handsEl = S.$('hands'), lightFig = S.$('lightfig'), plShade = S.$('plshade');

    return (t, time) => {
      const T = time;
      /* the sky: dusk → night (three nights) → dawn */
      const night = es(t, 3.02, 3.25) * (1 - es(t, 3.72, 3.95));
      const dawn = es(t, 3.72, 3.95);
      if (dawn > 0) sk.blend(NIGHT, DAWN, dawn); else sk.blend(DUSK, NIGHT, night * 0.9 + es(t, 0, 2.8) * 0.2);
      starL.fade(night);
      swing(sunDown, SUNX, 330 + es(t, 0, 3.1) * 400, T, 1, 0.6);
      moons.forEach((m) => {
        const on = es(t, 3.18 + m.i * 0.16, 3.3 + m.i * 0.16, ease.back) * (1 - es(t, 3.7, 3.85));
        swing(m.el, m.x, lerp(-1000, 170, on), T, 1, 0.6, m.i);
      });
      const up = es(t, 3.75, 4.1, ease.out);
      swing(risingSun, 1000, lerp(620, 300, up), T, 0.8, 0.5, 4);
      pose(dawnRays, { x: 1000, y: lerp(620, 300, up), s: 0.5 + up * 0.6, r: t * 6, o: up * (1 - es(t, 4.4, 4.9) * 0.6) });

      /* beat 0–1: walking along the road; beat 1: past the village, half hidden */
      // phone: the walk starts nearer, so the little band is on the screen while they travel
      const walkX = kf(t, PH ? [[0, 640], [1.9, 790], [2.1, 800]] : [[0, 120], [1.9, 720], [2.1, 800]], (x) => x);
      const walking = t < 2.05;
      const hush = bump(t, 1.1, 1.95);
      jesus.set({ x: walkX, y: ROAD, s: 0.9, o: 1 - es(t, 2.08, 2.14), walk: walking ? walkX * 0.05 : undefined, amt: 0.8, armF: 12 + hush * 30, head: -2 + hush * 4, blink: blinkAt(T, 1) });
      const teach = es(t, 2.1, 2.4) * (1 - es(t, 4.1, 4.3));
      jSit.set({ x: 800, y: ROAD - 16, s: 0.98, o: es(t, 2.08, 2.14), armF: 20 + teach * (30 + Math.sin(T * 1.4) * 12) + es(t, 3.05, 3.3) * 20 * (1 - es(t, 3.7, 3.9)) + es(t, 3.75, 4) * 70 * (1 - es(t, 4.3, 4.6)), armB: 10 + teach * 20 + es(t, 3.75, 4) * 90 * (1 - es(t, 4.3, 4.6)), head: -2 + es(t, 3.1, 3.4) * 8 * (1 - es(t, 3.7, 3.9)) - es(t, 3.75, 4) * 6, blink: blinkAt(T, 1) });
      const SPOTS = PH ? SPOTS_P : SPOTS_L;
      DIS.forEach((d, i) => {
        const trail = walkX - 70 - i * (PH ? 32 : 58);
        const [sx, side, sits] = SPOTS[i];
        const settle = es(t, 1.95 + i * 0.03, 2.4 + i * 0.03);
        const seated = sits ? es(t, 2.4 + i * 0.03, 2.46 + i * 0.03) : 0;
        const x = lerp(trail, sx, settle);
        const fear = es(t, 4.05, 4.4);
        const backOff = fear * (d.i % 2 ? 14 : 8) * side;
        const pose_ = {
          x: x + backOff, y: ROAD + (i % 2) * 6 - settle * 4 + (sits ? 10 : -8) * settle, s: 0.84 + (i % 3) * 0.02, flip: settle > 0.5 ? side > 0 : false,
          walk: (t < 1.95 || (settle > 0 && settle < 1)) ? x * 0.05 + i : undefined, amt: 0.8,
          head: -4 + fear * 12 - es(t, 3.1, 3.5) * 4 * (1 - es(t, 3.7, 3.9)), armF: 10 + bump(t, 4.3, 4.9) * (i === 0 ? 50 : 0) + (i % 3 === 0 ? es(t, 3.8, 4) * 30 * (1 - fear) : 0), lean: fear * 4, blink: blinkAt(T, d.seed),
        };
        d.p.set({ ...pose_, o: 1 - seated });
        d.q.set({ ...pose_, walk: undefined, o: seated });
        d.x = x + backOff;
      });
      qs.forEach(({ d, el }, i) => {
        const on = es(t, 4.08 + i * 0.07, 4.28 + i * 0.07, ease.back);
        pose(el, { x: d.x + 4, y: ROAD - (SPOTS[d.i][2] ? 130 : 186), s: on * 0.9, o: on > 0.01 ? 1 : 0 });
      });
      // the villagers look away, busy at their doors; nobody notices (phone: then they go in, out of the way of the circle)
      villagers.forEach((v) => v.p.set({ x: v.x, y: v.y, s: 0.5, o: PH ? 1 - es(t, 1.95, 2.2) : 1, flip: v.i !== 1, head: -6, armF: 30 + Math.sin(T * 1.2 + v.seed) * 10 * es(t, 0.9, 1.2) , blink: blinkAt(T, v.seed) }));

      /* the plate: into the hands of men; the light goes out; then rises again */
      const pl = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 4.05, 4.3));
      swing(handPlate, 640, lerp(-1000, 250, pl), T, 1, 0.7, 2);
      pose(handsEl, { x: 0, y: -es(t, 2.3, 2.8) * 34 });
      const dark = es(t, 3.05, 3.3) * (1 - es(t, 3.75, 3.95));
      fade(plShade, dark * 0.75);
      pose(lightFig, { x: 0, y: -es(t, 3.75, 4) * 16, s: 1 + es(t, 3.75, 4) * 0.08 });

      S.cam.x = kf(t, [[0, -30], [1.5, 20], [2.2, 0]]);
      S.cam.z = 1.03 + es(t, 2.1, 2.6) * 0.06;
      S.cam.y = 20 + es(t, 2.1, 2.6) * 16;
    };
  },
};
