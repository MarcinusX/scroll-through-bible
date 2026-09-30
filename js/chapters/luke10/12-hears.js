// Łk 10,16 — the knoll in the golden afternoon, the Father's light high above (only light, never a figure). On the
// slope to the left the elder of the two speaks to a villager who listens, a hand behind his ear; on the right the young
// one speaks to a man who scoffs and pushes him away. "Whoever listens to you listens to me": little golden lights go
// from the listener's ear to the one who speaks, and on to Jesus. "And whoever rejects you rejects me": dark scraps fly
// from the scoffer, strike the young one and go on to Jesus. "And whoever rejects me rejects Him who sent me": they fly
// on up toward the light above — and fall back, dimming only the man who threw them; the light stays.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { countrySet, KN, barefoot, glow, lightFall, kf, headAt, handAt, voiceRings, GOLDEN, SENT_A, SENT_B, es, ease, bump, seg, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';
import { stormCloud } from '../../assets/things.js';

const JX = KN.X, JY = 688;
const AX = 600, LX = 490;            // the elder and the listener
const BX = 1000, RX = 1110;          // the young one and the scoffer
const GY2 = 738;
const LISTENER = { robe: C.roseRobe, mantle: C.sageRobe, hairStyle: 'veil', veil: C.cream, veil2: C.linen2, hair: C.hair2, skin: C.skin, beard: 'none', belt: C.ochre };
const SCOFFER = { robe: mix(C.plumRobe, C.storm, 0.2), mantle: C.clayMantle, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.ochre };

/** a point along a quadratic arc from a to b bowed up by h */
const arc = (a, b, h, u) => { const mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - h; const v = 1 - u; return [v * v * a[0] + 2 * v * u * mx + u * u * b[0], v * v * a[1] + 2 * v * u * my + u * u * b[1]]; };

export default {
  id: 'lk10-hears',
  beats: [
    { v: 16, text: 'Kto was słucha, Mnie słucha, a kto wami gardzi, Mną gardzi;' },
    { v: 16, cont: true, text: 'lecz kto Mną gardzi, gardzi Tym, który Mnie posłał».' },
  ],
  cam: { x: [-30, 30], y: [-120, 30], z: [1, 1.1] },
  build(S) {
    let light;
    const K = countrySet(S, {
      skyCols: GOLDEN, sunAt: [1260, 200],
      behind: (S2) => { const L = S2.layer({ par: 0.03, sh: 1, flat: true, rise: 0 }); light = L.add(`<g>${lightFall(S2.c, { n: 13, len: 1200, spread: 0.45 })}</g>`); return L; },
    });
    const c = S.c;
    K.lampsOn([1, 1, 1, 1, 1, 1]);
    K.trails.forEach((el) => pose(el, { o: 0.8 }));

    const P = S.layer({ par: 0.45, sh: 5 });
    const aura = P.add(`<g>${glow(170, 0.6)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const shadowOn = P.add(`<g>${stormCloud(makeCutter('lk10-scoff'), 150)}</g>`);
    const listener = S.puppet(P.add(person(c, LISTENER)));
    const A = S.puppet(P.add(barefoot(person(c, SENT_A), SENT_A.skin)));
    const B = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));
    const scoffer = S.puppet(P.add(person(c, SCOFFER)));
    const vA = voiceRings(P, c, { n: 3, color: C.ochre, r: 30, w: 4, both: false });
    const vB = voiceRings(P, c, { n: 3, color: C.ochre, r: 30, w: 4, both: false });

    const fx = S.layer({ par: 0.47, sh: 4 });
    const golds = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${glow(24, 0.9)}<path d="${c.cut(c.star(0, 0, 9, 4, 5), 0.2, 2)}" fill="${C.sun}"/></g>`) }));
    const scrap = (i) => `<path d="${c.cut(c.star(0, 0, 11, 5, 5, c.rr(0, 3)), 0.6, 3)}" fill="#3e3448"/>`;
    const darks = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${scrap(i)}</g>`) }));

    return (t, time) => {
      const T = time;
      K.update(T, { sunY: 200 });
      pose(light, { x: 800, y: -200, o: 0.85 });

      const [lhx, lhy] = headAt(LX, GY2, 0.96, false);
      const [ahx, ahy] = headAt(AX, GY2, 0.98, true);
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      const [bhx, bhy] = headAt(BX, GY2, 0.98, false);
      const [rhx, rhy] = headAt(RX, GY2, 0.98, true);

      /* v16a — the listener and the scoffer */
      const talkA = es(t, 0.02, 0.1) * (1 - es(t, 0.5, 0.6));
      const talkB = es(t, 0.4, 0.5) * (1 - es(t, 0.9, 1.0));
      A.set({ x: AX, y: GY2, s: 0.98, flip: true, armF: 20 + talkA * 50, armB: 10 + talkA * 20, head: 2, blink: blinkAt(T, 2) });
      listener.set({ x: LX, y: GY2, s: 0.94, flip: false, armF: 20 + es(t, 0.08, 0.2) * 140, armB: 10, head: 6 + Math.sin(t * 30) * 4 * bump(t, 0.1, 0.4), blink: blinkAt(T, 4) });
      vA(ahx - 18, ahy + 4, talkA, T, { dir: -1, spread: 1.6 });
      const push = es(t, 0.56, 0.66);
      const hit = bump(t, 0.72, 0.84);
      B.set({ x: BX - hit * 12, y: GY2, s: 0.98, flip: false, armF: 20 + talkB * 50, armB: 10, head: -hit * 12, lean: -hit * 6, blink: blinkAt(T, 3) });
      scoffer.set({ x: RX, y: GY2, s: 0.98, flip: true, armF: 20 + push * 70, armB: 20 + push * 60, head: -push * 14, lean: push * 4, blink: blinkAt(T, 5) });
      vB(bhx + 18, bhy + 4, talkB, T, { dir: 1, spread: 1.6 });

      // the golden lights: listener → the elder → Jesus
      golds.forEach((g) => {
        const u = seg(t, 0.14 + g.i * 0.05, 0.48 + g.i * 0.05);
        const [x, y] = u < 0.4 ? arc([lhx + 16, lhy - 4], [ahx, ahy - 10], 40, u / 0.4) : arc([ahx, ahy - 10], [jhx - 16, jhy + 20], 80, (u - 0.4) / 0.6);
        pose(g.el, { x, y, s: 0.8 + Math.sin(u * PI) * 0.4, o: u > 0 && u < 1 ? 1 : 0 });
      });
      // the dark scraps: scoffer → the young one → Jesus → up toward the light, and back down
      darks.forEach((d) => {
        const u = seg(t, 0.6 + d.i * 0.05, 1.0 + d.i * 0.05);
        const up = seg(t, 1.1 + d.i * 0.05, 1.45 + d.i * 0.05);
        const back = seg(t, 1.45 + d.i * 0.05, 1.8 + d.i * 0.05);
        let x, y;
        if (up <= 0) [x, y] = u < 0.4 ? arc([rhx - 14, rhy], [bhx, bhy], 30, u / 0.4) : arc([bhx, bhy], [jhx + 18, jhy + 20], 80, (u - 0.4) / 0.6);
        else if (back <= 0) [x, y] = arc([jhx + 18, jhy + 20], [800 + (d.i - 2) * 30, 120], 30, up);
        else [x, y] = arc([800 + (d.i - 2) * 30, 120], [rhx + (d.i - 2) * 16, rhy - 20], 60, back);
        pose(d.el, { x, y, r: t * 200 + d.i * 40, s: 1 - up * 0.2, o: (u > 0 ? 1 : 0) * (1 - seg(t, 1.76 + d.i * 0.05, 1.8 + d.i * 0.05)) });
      });

      /* Jesus: He receives both; then He lifts His eyes to the One who sent Him */
      const lift = es(t, 1.05, 1.3);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: t > 0.55, armF: 20 + bump(t, 0.3, 0.6) * 40 + lift * 50, armB: 10 + lift * 110, head: -lift * 20, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 120, s: 1 + lift * 0.3, o: 0.5 + lift * 0.3 });
      const sc = es(t, 1.7, 1.95, ease.back);
      pose(shadowOn, { x: RX + 6, y: GY2 - 236, s: sc * 0.8, o: sc > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -20], [0.5, -20], [0.6, 20], [1.0, 20], [1.2, 0], [2, 0]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.3, -80], [1.6, -80], [1.85, 0], [2, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [1.3, 1.0], [2, 1.02]]);
    };
  },
};
