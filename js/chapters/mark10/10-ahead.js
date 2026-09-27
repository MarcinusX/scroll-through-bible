// Mk 10,32 — on the road going up to Jerusalem (the city is big now on its hill). Jesus strides on ahead;
// the Twelve behind him are amazed; those who follow further back are afraid and huddle together.
// He stops, turns, and takes the Twelve aside — they gather round him as the light goes golden.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, crowdPerson } from '../kit.js';
import { bush, rock, olive, cypress, grass } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, TWELVE, withFace, faceBits, face, bang, headAt } from './lib.js';

// the road climbs from bottom-left to the right
const RY = (x) => 790 - (x - 200) * 0.2;
const SC = (x) => 1.02 - (x - 200) * 0.00022;

export default {
  id: 'm10-ahead',
  beats: [
    { v: 32, text: 'A kiedy byli w drodze, zdążając do Jerozolimy, Jezus wyprzedzał ich, tak że się dziwili;' },
    { v: 32, cont: true, text: 'ci zaś, którzy szli za Nim, byli strwożeni.' },
    { v: 32, cont: true, text: 'Wziął znowu Dwunastu i zaczął mówić im o tym, co miało Go spotkać:' },
  ],
  cam: { x: [-120, 120], y: [-20, 60], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const EVE = ['#cdbfc4', '#efcfae', '#f5dcbd'];
    const R = roadSet(S, { skyCols: EVE, road: false, jer: 0.62, jerX: 1210, farY: 410, hillY: 480, groundY: 560, sunAt: [1300, 330], sunR: 46, clouds: [[420, 150, 190], [880, 110, 140]], hillCol: mix(C.hillMid, C.dune, 0.3), trees: 12, treeCol: C.olive, groundCol: mix(C.sand, C.dune, 0.3) });
    const G = R.groundL;
    // the road climbing towards the city
    const road = [];
    for (let i = 0; i <= 24; i++) { const x = -700 + i * 110; road.push([x, RY(x) + 16]); }
    G.add(sheet().p(c.ribbon(road, 90), mix(C.sand2, C.dune, 0.15)).out());
    let st = '';
    for (let i = 0; i < 30; i++) { const x = c.rr(-500, 2000); st += c.cut(c.blob(x, RY(x) + c.rr(-20, 50), c.rr(4, 9), c.rr(2, 4), 7, 0.2), 0.3, 3); }
    G.add(sheet().p(st, C.rock2).out());
    G.add(olive(c, 120, 640, 0.9) + cypress(c, 1080, 560, 120) + cypress(c, 1130, 556, 100) + bush(c, 1420, 560, 60, C.olive, C.moss) + rock(c, 360, 800, 70, 26));

    const pL = S.layer({ par: 0.5, sh: 5 });
    const FOL = Array.from({ length: 6 }, (_, i) => {
      const el = pL.add(withFace(person(c, crowdPerson(c)), faceBits(c)));
      return { i, el, p: S.puppet(el), seed: c.rr(0, 9) };
    });
    const DIS = TWELVE.map((d, i) => {
      const el = pL.add(withFace(person(c, d.o), faceBits(c)));
      return { i, el, p: S.puppet(el), seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const fxL = S.layer({ par: 0.5, sh: 6 });
    const bangs = [0, 2, 5, 8].map((k) => ({ k, el: fxL.add(`<g opacity="0">${bang(c)}</g>`) }));
    const warm = fxL.add(`<g opacity="0"><ellipse rx="260" ry="120" fill="url(#warm-glow)"/></g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 180, 1000, 230, C.olive, C.moss) + rock(c, 1440, 990, 200, 66, C.rock2) + grass(c, { x0: -200, x1: 1800, y: 980, n: 20, h: 30, color: C.olive }));

    // where the Twelve gather round him (a ring on the road)
    const JSTOP = 1000;
    const RING = TWELVE.map((_, i) => {
      const front = i >= 6, k = i % 6;
      const x = front ? 690 + k * 44 : 720 + k * 46;
      return [x, RY(x) + (front ? 30 : -22), front ? 0.94 : 0.84];
    });

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 3) * 50 });
      R.sk.blend(EVE, ['#b8a6b5', '#e9bf9c', '#f1cfa9'], es(t, 1.8, 3));

      /* beat 0: he goes on ahead — they are amazed */
      const go = es(t, -0.3, 1.9, ease.sine);
      const stop = es(t, 1.9, 2.1);
      const jx = lerp(700, JSTOP, go);
      const walkingJ = go > 0.01 && go < 0.99;
      jesus.set({ x: jx, y: RY(jx) + stop * 12, s: SC(jx) * 1.04, flip: stop > 0.5, walk: walkingJ ? jx * 0.055 : undefined, lean: walkingJ ? 3 : 0, armF: stop * (30 + es(t, 2.2, 2.5) * 40), armB: stop * 60 * es(t, 2.2, 2.5), head: walkingJ ? -4 : -2 + Math.sin(T * 0.6), blink: blinkAt(T) });

      const gather = es(t, 2.05, 2.7);
      DIS.forEach((d) => {
        const row = Math.floor(d.i / 3), col = d.i % 3;
        const trail = lerp(470, 800, go * 0.9) - row * 62 - col * 20;
        const x = lerp(trail, RING[d.i][0], gather);
        const y = lerp(RY(trail) - col * 14 + 6, RING[d.i][1], gather);
        const moving = (go > 0.01 && go < 0.99) || (gather > 0.01 && gather < 0.99);
        const amazed = es(t, 0.3, 0.6) * (1 - gather);
        d.p.set({ x, y, s: lerp(SC(x) * 0.9, RING[d.i][2], gather), flip: false, walk: moving ? x * 0.06 + d.i : undefined, armF: amazed * (d.i % 3 === 0 ? 60 : 20) + gather * 14, armB: amazed * (d.i % 3 === 0 ? 100 : 0), head: -amazed * 6 - gather * 4, blink: blinkAt(T, d.seed) });
        face(d.el, 'sad', gather * 0.5);
      });
      bangs.forEach((b) => {
        const d = DIS[b.k];
        const row = Math.floor(b.k / 3), col = b.k % 3;
        const trail = lerp(470, 800, go * 0.9) - row * 62 - col * 20;
        const [hx, hy] = headAt(trail, RY(trail) - col * 14 + 6, SC(trail) * 0.9, false);
        const on = bump(t, 0.3 + b.k * 0.04, 1.05);
        pose(b.el, { x: hx + 8, y: hy - 40, s: Math.min(1, on * 2) * 0.9, r: 8, o: on > 0.02 ? 1 : 0 });
        void d;
      });

      /* beat 1: those following behind are afraid — they huddle and hang back */
      const afraid = es(t, 1.02, 1.3);
      FOL.forEach((f) => {
        const base = lerp(230, 520, go * 0.8) - f.i * 32 - afraid * 30;
        const x = base + afraid * Math.sin(f.i) * 6;
        const shiver = 0;
        const moving = go > 0.01 && go < 0.8 && afraid < 0.5;
        f.p.set({ x: x + shiver, y: RY(x) + 18 + (f.i % 2) * 12, s: SC(x) * 0.88, flip: false, walk: moving ? x * 0.06 + f.i : undefined, armF: afraid * (f.i % 2 ? 150 : 70), armB: afraid * (f.i % 3 === 0 ? 120 : 30), head: afraid * 12, lean: -afraid * 5, blink: blinkAt(T, f.seed) });
        face(f.el, 'sad', afraid);
      });

      /* beat 2: he takes the Twelve aside — a warm ring round them */
      pose(warm, { x: 880, y: RY(880) - 60, s: 0.6 + gather * 0.5, o: gather * 0.5 });

      S.cam.x = lerp(-110, 90, go) + gather * 30;
      S.cam.y = 40 - go * 30;
      S.cam.z = 1 + es(t, 1.9, 2.6) * 0.06;
    };
  },
};
