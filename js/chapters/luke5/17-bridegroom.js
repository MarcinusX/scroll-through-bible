// Łk 5,34–35 — a painted wedding at night flies down: under a garlanded canopy the bridegroom in his wreath lifts his
// cup, the lanterns glow and his friends dance round him with a tambourine. A sour-faced man comes offering them an
// empty bowl turned upside down — fast now? — and they only laugh and point to the bridegroom. But then a cloud slides
// over the moon, two shadows come and lead the bridegroom away; the lanterns go out one by one, and the friends sit
// down on the ground, their bowls turned over, heads bowed: then, in those days, they will fast.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { moon, stars, cloud, grass, house, palm } from '../../assets/nature.js';
import { shadowPerson } from '../mark3/lib.js';
import {
  canopy, garland, lantern, wreath, tambourine, cup, bowl, loaf, grapes, lowTable, addToHead, townsfolk, scribe, kf, moving, headAt,
  NIGHT, es, ease, bump, seg, fade, PI,
} from './lib.js';

const FLOOR = 704, CX = 800;
const GROOM = { robe: C.linen, mantle: C.ochre, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.sun };
const RING_L = [[600, 0], [680, 1], [920, 2], [1000, 3], [1080, 4]];
const RING_P = [[615, 0], [690, 1], [910, 2], [975, 3], [1040, 4]];   // phone: the last dancer clear of the thread

/** an upturned empty bowl (fasting); origin: its rim */
function upBowl(c, w = 30) {
  return sheet().p(c.cut([[-w / 2, 0], [w / 2, 0], [w * 0.3, -w * 0.34], [-w * 0.3, -w * 0.34]], 0.3, 4), C.pot).x(c.ribbon([[-w * 0.4, -4], [w * 0.4, -4]], 1.4), shade(C.pot, -0.2), 'opacity=".6"').out();
}

export default {
  id: 'lk5-bridegroom',
  enter: 'fly',
  beats: [
    { v: 34 },
    { v: 35 },
  ],
  cam: { x: [-80, 80], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const RING = S.portrait ? RING_P : RING_L;
    const MX = S.portrait ? 1020 : 1180;   // phone: the moon (and the cloud that covers it) inside the screen, not under the thread
    sky(S, ['#2b2f5c', '#5c5487', '#a2789a']);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -900, x1: 2500, y0: -500, y1: 360, n: 110 }));
    const hangL = S.layer({ par: 0.04, sh: 5, rise: 0 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 36)}`, { x: 1180, y: 150, len: 1200 });
    const cl = hanging(hangL, cloud(c, 240, mix(C.storm, C.duskViolet, 0.4), C.storm2), { x: 1500, y: 150, len: 1200 });
    const far = S.layer({ par: 0.12, sh: 2 });
    let hs = '';
    [[-300, 140, 110], [-120, 120, 90], [60, 150, 120], [1400, 130, 100], [1580, 150, 120], [1760, 120, 90]].forEach(([x, w, h], i) => { hs += house(c, x, 600, w, h, { stairs: i % 2 === 0, lit: true }); });
    far.add(sheet().p(c.ridge(c.wave(600, [4, 2], [700, 200]), -1400, 3000, 1700, 12, 1), mix(C.hillMid, C.indigo, 0.35)).out() + hs + palm(c, 250, 606, 170, { trunk: mix(C.wood3, C.indigo, 0.3), frond: mix(C.moss, C.indigo, 0.3), frond2: mix(C.leaf, C.indigo, 0.3) }));
    const ground = S.layer({ par: 0.5, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(FLOOR, [2, 1], [700, 180]), -1400, 3000, 1700, 12, 0.8), mix(C.sand, C.duskViolet, 0.25)).out() + grass(c, { x0: -900, x1: 2400, y: FLOOR + 30, n: 30, h: 12, color: mix(C.olive, C.indigo, 0.2) }));

    /* the canopy with garlands, the lanterns */
    const canL = S.layer({ par: 0.5, sh: 5 });
    const posts = sheet().p(c.cut(c.rect(CX - 250, 360, 14, FLOOR - 360), 0.3, 6) + c.cut(c.rect(CX + 236, 360, 14, FLOOR - 360), 0.3, 6), C.wood2).out();
    canL.add(posts + `<g transform="translate(${CX} 352)">${canopy(c, 540, 50)}</g><g transform="translate(${CX - 250} 410)">${garland(c, 500, 40)}</g>`);
    const LCOL = [C.apricot, C.roseRobe, C.halo, C.apricot];
    const lamps = [CX - 200, CX - 70, CX + 70, CX + 200].map((x, i) => ({ i, x, dark: canL.add(`<g><path d="M0 -30V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${lantern(c, { col: mix(LCOL[i], C.night, 0.55) })}</g>`), el: canL.add(`<g><path d="M0 -30V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${lantern(c, { col: LCOL[i] })}</g>`) }));
    lamps.forEach((l) => { l.glow = l.el.querySelector('.glow'); fade(l.dark.querySelector('.glow'), 0); });
    const table = canL.add(`<g transform="translate(${CX} ${FLOOR - 6}) scale(.8)">${lowTable(c, 360)}<g transform="translate(-120 -44)">${bowl(c, { food: 'fruit' })}</g><g transform="translate(-50 -44)">${loaf(c, 16)}</g><g transform="translate(30 -44) scale(1.2)">${grapes(c)}</g><g transform="translate(110 -44)">${cup(c)}</g></g>`);

    /* the friends of the bridegroom: dancing (standing), then sitting with bowls turned over */
    const A = S.layer({ par: 0.5, sh: 5 });
    const looks = RING.map(() => townsfolk(c, { man: true }));
    const dancers = RING.map(([x, i]) => ({ i, x, p: S.puppet(A.add(person(c, { ...looks[i], holdF: i === 1 ? `<g transform="translate(0 4)">${tambourine(c)}</g>` : '' }))), seed: c.rr(0, 9) }));
    const sitters = RING.map(([x, i]) => ({ i, x, p: S.puppet(A.add(person(c, { ...looks[i], pose: 'sit', holdF: `<g transform="translate(2 10)">${upBowl(c, 36)}</g>` }))) }));
    const groom = S.puppet(A.add(addToHead(person(c, { ...GROOM, holdF: `<g transform="translate(1 10)">${cup(c, C.sun)}</g>` }), wreath(c))));
    const sour = S.puppet(A.add(scribe(c, 3, { holdF: `<g transform="translate(4 6)">${upBowl(c, 40)}</g>` })));
    const shadows = [0, 1].map(() => S.puppet(A.add(shadowPerson(c, { ...townsfolk(c, { man: true }), hairStyle: 'wrap' }, mix(C.night2, C.storm2, 0.4)))));
    const sparks = [0, 1, 2, 3].map(() => A.add(`<path d="${c.cut(c.star(0, 0, 8, 3, 4, 0), 0.2, 2)}" fill="${C.halo}"/>`));

    return (t, time) => {
      const T = time;
      /* v35 — a cloud covers the moon, the lanterns go out */
      const dark = es(t, 1.15, 1.6);
      pose(moonEl, { x: MX, y: 150, r: T ? Math.sin(T * 0.6) * 0.8 : 0 });
      pose(cl, { x: lerp(MX + 380, MX + 10, es(t, 1.02, 1.4)), y: 150, r: T ? Math.sin(T * 0.6 + 1) : 0 });
      starL.fade(1 - dark * 0.6);
      lamps.forEach((l) => {
        const off = es(t, 1.4 + l.i * 0.07, 1.5 + l.i * 0.07);
        const r = T ? Math.sin(T * 0.9 + l.i) * 2 : 0;
        pose(l.el, { x: l.x, y: 372, r, o: 1 - off });
        pose(l.dark, { x: l.x, y: 372, r, o: off > 0.01 ? 1 : 0 });
        fade(l.glow, 0.85);
      });

      /* v34 — the dance round the bridegroom; the sour man offers an upturned bowl, and they laugh */
      const dance = 1 - es(t, 1.4, 1.55);
      const takenK = es(t, 1.15, 1.7);
      const gx = lerp(CX, 1500, es(t, 1.2, 1.75, ease.in));
      groom.set({ x: gx, y: FLOOR, s: 1.04, flip: takenK > 0.02, walk: takenK > 0.02 && takenK < 1 ? gx * 0.05 : undefined, armF: 40 + 20 * dance, armB: 20 + 100 * dance * (1 - takenK), head: -6 * dance + takenK * 16, o: 1 - es(t, 1.7, 1.8), blink: blinkAt(T) });
      shadows.forEach((sh, i) => {
        const x = gx + (i ? 90 : -80);
        sh.set({ x, y: FLOOR + 4, s: 1.06, flip: true, o: es(t, 1.08, 1.18) * (1 - es(t, 1.7, 1.8)), walk: takenK > 0 && takenK < 1 ? x * 0.05 + i : undefined, armF: 60, armB: 20, head: 4 });
      });
      const sitK = es(t, 1.55, 1.62);
      const bowK = es(t, 1.62, 1.8);
      dancers.forEach((d) => {
        const ph = T * 2.4 + d.i * 1.3;
        const hop = dance * (T ? Math.abs(Math.sin(ph)) * 10 : 0);
        const laugh = es(t, 0.55, 0.75) * (1 - es(t, 1.1, 1.3));
        const refuse = d.i === 1 ? laugh : 0;
        const x = d.x + (T ? Math.sin(ph * 0.5) * 16 * dance : 0);
        // the dance moves each cut-out as a whole (hop and sway): no limb repaint per frame
        d.p.set({ x, y: FLOOR + 4 - hop, s: 0.98, flip: d.x > CX, o: 1 - sitK, r: T ? Math.sin(ph) * 3 * dance : 0, armF: 18 + dance * (d.i % 2 ? 10 : 40) + refuse * 60, armB: 14 + dance * (d.i % 2 ? 150 : 40) + (d.i === 3 ? laugh * 60 : 0), head: -dance * 6 + (takenK > 0.3 ? takenK * 12 : 0), blink: blinkAt(T, d.seed) });
      });
      sitters.forEach((s) => {
        s.p.set({ x: s.x + (s.x < CX ? -20 : 20), y: FLOOR + 10, s: 0.98, flip: s.x > CX, o: sitK, armF: 60 - bowK * 10, armB: 20, head: bowK * 22, lean: bowK * 8, blink: 0 });
      });
      const SX = S.portrait ? 520 : 470;
      const sk = [[0.05, -200], [0.5, SX], [1.0, SX], [1.25, -200]];
      const sx = kf(t, sk, ease.sine);
      sour.set({ x: sx, y: FLOOR + 8, s: 1.0, flip: t > 1.0, walk: moving(t, sk) ? sx * 0.05 : undefined, armF: 30 + es(t, 0.45, 0.6) * 60 * (1 - es(t, 0.95, 1.05)), armB: 10, head: 6, blink: blinkAt(T, 9) });
      sparks.forEach((sp, i) => { const k = ((T * 0.8 + i / 4) % 1); pose(sp, { x: CX - 120 + i * 80, y: 520 - k * 60, s: bump(k, 0, 1), r: T * 50, o: dance * bump(k, 0, 1) * (1 - takenK) }); });

      S.cam.x = kf(t, [[0, -40], [0.5, -60], [1.0, 0], [1.4, 60], [2, 20]]);
      S.cam.y = kf(t, [[0, 40], [1, 50], [2, 40]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.08], [2, 1.06]]);
    };
  },
};
