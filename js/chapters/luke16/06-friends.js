// Łk 16,9 — a painted flat: a road through the evening country. "And I tell you: make friends for yourselves by means
// of unrighteous mammon": a man with a full purse walks along the road and gives — a coin into the beggar's bowl, into
// the widow's hand, into the child's — and each of them looks up at him. "So that when it fails": his purse hangs
// empty, the last coins crumble to dust, and the day goes dim; he comes to the end of the road. "They may receive you
// into the eternal dwellings": on the golden height beyond the road the tents of light open, and there in their
// doorways, clothed in white, stand the three he gave to — beckoning him in.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, cloud, grass } from '../../assets/nature.js';
import { coin, purse, beggarBowl, glow, handAt, headAt, kf, moving, tr, es, ease, bump, seg, PI, GOLDSKY } from './lib.js';
import { BEGGAR } from '../matthew6/lib.js';
import { dust as dustM } from '../mark2/lib.js';

const GY = 716;
const POOR = [[520, 'beggar'], [620, 'widow'], [710, 'child']];
const TENTS = [[880, 566], [990, 548], [1100, 572]];
const GIVER = { robe: C.linen2, mantle: C.tealRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, veil2: C.teal2, beard: 'full', skin: C.skin2, belt: C.sun };
const WIDOW = { robe: C.stone2, hairStyle: 'veil', veil: mix(C.stone, C.rock2, 0.4), veil2: C.rock2, hair: C.greyHair, skin: C.skin3, beard: 'none' };
const CHILD = { robe: C.skyVeil, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.ochre };
const WHITE = (o) => ({ ...o, robe: C.linen, mantle: mix(C.halo, C.cream, 0.4), veil: o.hairStyle === 'veil' ? C.linen2 : o.veil, belt: C.haloRim });

/** a tent of light (origin: base centre) */
function lightTent(c, w = 120, h = 100) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w * 0.3, -h], [w * 0.3, -h * 0.94], [w / 2, 0]], 0.5, 8), mix(C.linen, C.halo, 0.35));
  s.x(c.poly([[-w * 0.14, 0], [-w * 0.02, -h * 0.72], [w * 0.14, 0]]), '#fff6d8');
  s.x(c.ribbon([[-w * 0.3, -h], [-w * 0.44, -6]], 2) + c.ribbon([[w * 0.3, -h * 0.94], [w * 0.44, -6]], 2), C.haloRim, 'opacity=".8"');
  s.p(c.ribbon([[-w * 0.3, -h - 8], [-w * 0.3, 4]], 4) + c.ribbon([[w * 0.3, -h * 0.94 - 8], [w * 0.3, 4]], 4), C.sun);
  return s.out();
}

export default {
  id: 'lk16-friends',
  enter: 'fly',
  beats: [
    { v: 9 },
  ],
  cam: { x: [-20, 60], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ['#b9a8c2', '#ecc4a2', '#f6dcb4']);
    const sk2 = sky(S, ['#5f5a82', '#b9918f', '#d9b39a'], { name: 'dim', rise: 0 });
    sk2.layer.fade(0);
    const goldL = S.layer({ par: 0.06, sh: 0, flat: true, rise: 0 });
    const gold = goldL.add(`<g><ellipse cx="990" cy="440" rx="560" ry="360" fill="url(#halo-glow)"/></g>`);
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 470, amps: [16, 6, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
    const mid = S.layer({ par: 0.15, sh: 3 });
    mid.add(hillsWith(c, { y: 560, amps: [14, 6, 2], lens: [800, 260, 100], color: mix(C.hillNear, C.wheat, 0.25), trees: 12, treeColor: C.olive, treeH: 18 }).markup);
    /* the golden height with the tents */
    const hL = S.layer({ par: 0.2, sh: 4, rise: 0 });
    const height = hL.add(`<g>${sheet().p(c.cut([[780, 760], [810, 600], [860, 572], [960, 556], [1080, 560], [1180, 580], [1260, 620], [1300, 760]], 1.2, 10), mix(C.halo, C.cream, 0.3)).x(c.cut(c.blob(880, 600, 60, 20, 10, 0.3), 1, 6) + c.cut(c.blob(1180, 610, 50, 18, 10, 0.3), 1, 6), '#fff6dc', 'opacity=".8"').out()}</g>`);
    const tents = TENTS.map(([x, y], i) => ({ i, x, y, el: hL.add(`<g>${lightTent(c, 110 - i * 6, 96 - i * 6)}</g>`) }));
    /* the road */
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-1100, GY - 16], [2700, GY - 16], [2700, 1900], [-1100, 1900]], 0.6, 16), mix(C.sand, C.hillMid, 0.3)).p(c.cut([[-1100, GY - 4], [880, GY - 6], [960, GY + 30], [-1100, GY + 40]], 0.6, 16), mix(C.sand2, C.dune, 0.3)).out() + grass(c, { x0: -600, x1: 2200, y: GY + 60, n: 30, h: 12, color: C.olive }));
    const back = S.layer({ par: 0.36, sh: 0, flat: true });
    const act = S.layer({ par: 0.38, sh: 5 });
    const poor = POOR.map(([x, k], i) => {
      const o = k === 'beggar' ? BEGGAR : k === 'widow' ? WIDOW : CHILD;
      const P = k === 'child' ? 'stand' : 'sit';
      return {
        i, x, k, s: k === 'child' ? 0.66 : 0.88, P,
        p: S.puppet(act.add(person(c, { ...o, pose: P, holdF: k === 'beggar' ? `<g transform="translate(4 4)">${beggarBowl(c)}</g>` : '' }))),
        w: S.puppet(act.add(person(c, { ...WHITE(o) }))),
        wy: TENTS[i][1] + 6,
      };
    });
    const giver = S.puppet(act.add(person(c, GIVER)));
    const bag = act.add(`<g>${purse(c)}</g>`);
    const coins = POOR.map(() => act.add(`<g opacity="0">${coin(c, 7)}</g>`));
    const crumble = act.add(`<g opacity="0">${dustM(c, 20, C.sun)}</g>`);
    const glows = TENTS.map(() => back.add(`<g opacity="0">${glow(80, 0.9, 'halo-glow')}</g>`));

    return (t, time) => {
      const T = time;
      /* giving along the road */
      const GK = [[-0.3, 380], [0.08, 450], [0.14, 450], [0.2, 550], [0.26, 550], [0.32, 640], [0.4, 640], [0.52, 760], [0.62, 780], [0.8, 870], [0.95, 940]];
      const gx = kf(t, GK);
      const giveA = (a) => bump(t, a, a + 0.08);
      const give = giveA(0.08) + giveA(0.2) + giveA(0.33);
      const up = gx > 780 ? es(gx, 780, 940) : 0;
      giver.set({ x: gx, y: GY - up * 150, s: 1.0 - up * 0.3, walk: moving(t, GK) ? gx * 0.06 : undefined, armF: 20 + give * 50, armB: 10, head: give * 10, blink: blinkAt(T, 2), o: 1 - es(t, 0.92, 1.0) });
      const empty = es(t, 0.42, 0.5);
      const [bx, by] = [gx - 20, GY - 96 - up * 150];
      pose(bag, { x: bx, y: by, s: (1 - up * 0.3) * (1 - empty * 0.4), sy: 1 - empty * 0.4, o: 1 - es(t, 0.6, 0.66) });
      pose(crumble, { x: bx + 30, y: by + 50 + es(t, 0.44, 0.56) * 20, s: 0.5 + es(t, 0.44, 0.56), o: bump(t, 0.44, 0.58) });
      coins.forEach((cn, i) => {
        const a = [0.08, 0.2, 0.33][i];
        const k = es(t, a, a + 0.06);
        const [hx, hy] = handAt(gx, GY, 1, false, 70);
        const tx = POOR[i][0] + 40, ty = GY - (i === 2 ? 70 : 60);
        pose(cn.el ?? cn, { x: lerp(hx, tx, k), y: lerp(hy, ty, k) - Math.sin(k * PI) * 20, o: k > 0 && t < a + 0.3 ? 1 : 0 });
      });
      sk2.layer.fade(es(t, 0.42, 0.55) * 0.8 * (1 - es(t, 0.58, 0.72) * 0.6));
      /* the poor: look up to him; then, in white, at the tents' doors */
      const tentsOpen = es(t, 0.56, 0.7);
      poor.forEach((m) => {
        const got = es(t, [0.1, 0.22, 0.35][m.i], [0.16, 0.28, 0.41][m.i]);
        m.p.set({ x: m.x, y: GY + (m.k === 'child' ? 0 : -2), s: m.s, o: 1 - es(t, 0.5, 0.58), armF: 40 + got * 30, armB: 10 + got * 20, head: -8 * got, blink: blinkAt(T, 3 + m.i) });
        const inK = es(t, 0.6 + m.i * 0.04, 0.72 + m.i * 0.04);
        const beck = Math.sin(Math.max(0, t - 0.7) * 40 + m.i) * 0.5 + 0.5;
        m.w.set({ x: TENTS[m.i][0] - 30, y: m.wy, s: 0.7, flip: true, o: inK, armF: 60 + beck * 30 * inK, armB: 20, head: -4, blink: blinkAt(T, 5 + m.i) });
      });
      pose(gold, { o: 0.5 + tentsOpen * 0.5 });
      tents.forEach((tn) => pose(tn.el, { x: tn.x, y: tn.y, s: 0.8 + tentsOpen * 0.2 }));
      glows.forEach((g, i) => pose(g, { x: TENTS[i][0], y: TENTS[i][1] - 40, o: tentsOpen }));
      pose(height, { o: 0.6 + tentsOpen * 0.4 });

      S.cam.x = kf(t, [[-0.5, -10], [0.4, 0], [0.7, 20]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.5, 20], [0.7, -20]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.7, 1.06]]);
    };
  },
};
