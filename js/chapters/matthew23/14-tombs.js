// Mt 23,27–28 — the sixth woe, a painted flat: the slope of the Kidron valley, grey rock-cut tombs. The scribe and a
// workman brush lime over the biggest façade and it turns dazzling white, with a garland at its door. "Beautiful on
// the outside": it gleams — then its rolling stone slides aside and inside, in the dark, lie dust, cobwebs and a few
// pale bones (no more than that). "So you too": the Pharisee in his white robes stands before the white tomb and holds a
// smiling mask up before his face; the passers-by bow to him. But the low sun throws his shadow on the white wall, and
// the shadow is crooked, hunched and grasping.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass, rock, olive, cypress } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { vain, PH, SC, woeDrop, folk, tombFacade, tombInside, brush, limeBucket, garland, maskOnStick, sparkle, shadowPerson, bakeArms, cityWall, PI } from './lib.js';

const GY = 650;
const TX = 820;                  // the whitewashed tomb
const TW = 300, TH = 290;

export default {
  id: 'mt23-tombs',
  enter: 'fly',
  beats: [
    { v: 27, text: 'Biada wam, uczeni w Piśmie i faryzeusze, obłudnicy!' },
    { v: 27, cont: true, text: 'Bo podobni jesteście do grobów pobielanych, które z zewnątrz wyglądają pięknie, lecz wewnątrz pełne są kości trupich i wszelkiego plugastwa.' },
    { v: 28 },
  ],
  cam: { x: [-20, 40], y: [-40, 10], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#cddcd6', '#eee3c9', '#f5ddb8']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 360, y: 170, len: 800 });
    const cl = hanging(hangL, cloud(c, 150), { x: 1100, y: 130, len: 800 });
    // the city wall across the valley, the far slope
    const far = S.layer({ par: 0.08, sh: 2 });
    const fb = band(c, { y: 360, amps: [10, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.dune, 0.3) });
    far.add(`<g>${cityWall(c, -200, 1800, 330, 380, { towers: [{ x: 300 }, { x: 700 }, { x: 1150 }, { x: 1500 }] })}${fb.markup}</g>`);
    const valley = S.layer({ par: 0.14, sh: 3 });
    valley.add(band(c, { y: 440, amps: [14, 6, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.sand, 0.3) }).markup + olive(c, 300, 460, 0.5) + olive(c, 1300, 452, 0.55));

    /* the rocky hillside with its tombs */
    const hill = S.layer({ par: 0.25, sh: 3 });
    const hs = sheet();
    const RC = mix(C.rock, C.sand2, 0.35);
    hs.p(c.cut([[-900, 1700], [-900, 380], [200, 340], [500, 320], [800, 300], [1100, 312], [1400, 340], [2500, 360], [2500, 1700]], 2, 14), RC);
    let cracks = '';
    for (let i = 0; i < 18; i++) { const x = c.rr(-400, 2000), y = c.rr(360, 620); cracks += c.ribbon([[x, y], [x + c.rr(-20, 20), y + c.rr(20, 50)]], 2); }
    hs.x(cracks, shade(RC, -0.15), 'opacity=".6"');
    hill.add(hs.out());
    hill.add(`<g><g transform="translate(420 ${GY - 30}) scale(.55)">${tombFacade(c, { w: 260, h: 260 })}</g><g transform="translate(1210 ${GY - 34}) scale(.6)">${tombFacade(c, { w: 240, h: 280 })}</g></g>`);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-900, GY - 6], [2500, GY - 10], [2500, 1700], [-900, 1700]], 1, 16), mix(C.sand, C.rock, 0.3)).out() + grass(c, { x0: -700, x1: 2300, y: GY - 6, n: 26, h: 12, color: C.olive }) + rock(c, 560, GY + 10, 70, 24, C.rock2));

    /* the big tomb: inside (behind), the grey façade, the white one over it, the stone, the garland */
    const T = S.layer({ par: 0.3, sh: 4 });
    T.add(`<g transform="translate(${TX} ${GY})">${tombInside(c, 84, 133)}</g>`);
    const grey = T.add(`<g transform="translate(${TX} ${GY})">${tombFacade(makeCutter('mt23-bigtomb'), { w: TW, h: TH, door: 'hole' })}</g>`);
    const white = T.add(`<g>${tombFacade(makeCutter('mt23-bigtomb'), { w: TW, h: TH, col: '#fbf8f0', door: 'hole' })}</g>`);
    const strokes = Array.from({ length: 6 }, (_, i) => ({ i, el: T.add(`<g><path d="${c.ribbon([[0, 0], [70, -6], [140, 2]], 26, 3)}" fill="#fbf8f0"/></g>`) }));
    const stone = T.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 64, 26), 0.8, 5), mix(C.rock, C.stone2, 0.3)).x(c.ribbon(c.arc(0, 0, 46, 46, PI * 1.1, PI * 1.6, 6), 2), C.rock3, 'opacity=".6"').out()}</g>`);
    const wreath = T.add(`<g>${garland(c, 110, 24)}</g>`);
    const shadowEl = T.add(`<g><g transform="skewX(-14)">${bakeArms(shadowPerson(c, { ...PH, holdF: '' }, mix('#3b2a22', C.plumRobe, 0.25)), 105, 60)}</g></g>`);
    const glints = Array.from({ length: 6 }, (_, i) => ({ i, el: T.add(`<g>${sparkle(c, 12)}</g>`) }));

    /* the people */
    const P = S.layer({ par: 0.4, sh: 5 });
    P.add(`<g transform="translate(${TX - 190} ${GY + 6})">${limeBucket(c)}</g>`);
    const worker = S.puppet(P.add(person(c, folk(c, true, { robe: C.stone2, belt: C.rope, holdF: brush(c) }))));
    const scribe = S.puppet(P.add(vain(c, SC, { holdF: brush(c) })));
    const passers = [0, 1].map((i) => ({ i, p: S.puppet(P.add(person(c, folk(c, i === 0)))) }));
    const phar = S.puppet(P.add(vain(c, PH)));
    const maskEl = P.add(`<g>${maskOnStick(c)}</g>`);
    const woe = woeDrop(P, c, 6, { x: S.portrait ? 1005 : 1230, y: 150 });   // phone: the woe-tag inside the screen

    return (t, time) => {
      const Tm = time;
      swing(sunEl, 360, 170 + es(t, 1.9, 2.4) * 110, Tm, 1, 0.6);
      swing(cl, 1100 + (Tm ? Math.sin(Tm * 0.1) * 20 : 0), 130, Tm, 1.2, 0.7, 1);
      woe(es(t, 0.02, 0.25, ease.out) * (1 - es(t, 0.9, 1.05)), Tm);

      /* v27a — whitewashing: brush strokes, then the whole façade white */
      const wash = es(t, 0.15, 0.85);
      strokes.forEach((s) => {
        const k = es(t, 0.15 + s.i * 0.1, 0.25 + s.i * 0.1);
        pose(s.el, { x: TX - 150 + (s.i % 2) * 150 - 70 * (s.i % 2), y: GY - 40 - s.i * 34, sx: k, sy: 1, o: (k > 0.02 ? 1 : 0) * (1 - es(t, 0.8, 0.95)) });
      });
      pose(white, { x: TX, y: GY, o: es(t, 0.7, 0.95) });
      const brushing = es(t, 0.1, 0.2) * (1 - es(t, 0.9, 1.0));
      const bw = Math.sin(t * 30) * 20 * brushing;
      worker.set({ x: TX - 150, y: GY + 4, s: 0.96, armF: 60 + bw + brushing * 30, armB: 20, head: -6, lean: 4, o: 1 - es(t, 1.9, 2.05), blink: blinkAt(Tm, 1) });
      scribe.set({ x: TX + 150, y: GY + 6, s: 0.96, flip: true, armF: 60 - bw + brushing * 30, armB: 20, head: -8, lean: 4, o: 1 - es(t, 1.9, 2.05), blink: blinkAt(Tm, 3) });
      pose(wreath, { x: TX - 55, y: lerp(-400, GY - TH * 0.5 + 6, es(t, 0.75, 0.95, ease.out)), o: es(t, 0.74, 0.8) });

      /* v27b — it gleams; then the stone rolls aside: dust, cobwebs, bones */
      const roll = es(t, 1.35, 1.6);
      pose(stone, { x: TX + lerp(0, 118, roll), y: GY - 62, r: roll * 120 });
      glints.forEach((g) => {
        const k = Tm ? (Tm * 0.6 + g.i / 6) % 1 : 0.5;
        pose(g.el, { x: TX - 130 + g.i * 52, y: GY - 200 - (g.i % 2) * 60, s: 0.8, o: bump(t, 1.0, 1.9) * Math.sin(k * PI) + (t > 2 ? 0 : 0) });
      });

      /* v28 — the Pharisee in white before the white tomb, his mask up; bows; his crooked shadow */
      const walkIn = es(t, 1.95, 2.3);
      const px = lerp(1250, TX - 30, walkIn);
      const mask = es(t, 2.3, 2.42);
      phar.set({ x: px, y: GY + 8, s: 1, flip: true, walk: walkIn > 0.02 && walkIn < 0.98 ? px * 0.05 : undefined, armF: 20 + mask * 50, armB: 10, head: -mask * 4, o: es(t, 1.9, 2.0), blink: blinkAt(Tm, 5) });
      passers.forEach((pp) => {
        const bow = bump(t, 2.4 + pp.i * 0.08, 3.0);
        pp.p.set({ x: (S.portrait ? [545, 1075] : [470, 1150])[pp.i],   // phone: the passers-by who bow are on the screen
           y: GY + 14, s: 0.94, flip: pp.i === 1, lean: bow * 22, head: bow * 16, armF: bow * 40, o: es(t, 1.95, 2.1), blink: blinkAt(Tm, pp.i + 7) });
      });
      pose(maskEl, { x: px - 26, y: lerp(GY - 60, GY + 8 - 110, mask), sx: -1, sy: 1, o: mask > 0.02 ? 1 : 0 });
      const sh = es(t, 2.45, 2.7);
      pose(shadowEl, { x: px + 70, y: GY - 6, s: 1.2, sx: -1, sy: 1, r: 4, o: sh * 0.5 });

      S.cam.x = 10;
      S.cam.z = 1.04 + es(t, 1.2, 1.5) * 0.04;
      S.cam.y = -10;
    };
  },
};
