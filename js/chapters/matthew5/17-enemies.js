// Mt 5,43–45 — a painted flat: two small farms before dawn with a stone wall between them. "Love your neighbour
// and hate your enemy": the old tablet; a man embraces his neighbour, and glares over the wall at the man on the
// other farm, who glares back (the scene in old sepia). "But I tell you, love your enemies and pray for those who
// persecute you": the wall comes down stone by stone, the man kneels and prays, and a thread of light goes from
// him to his enemy. "So you will be children of your Father in heaven": light comes down on him. "He makes His
// sun rise on the evil and the good": the sun comes up over both farms and both fields turn gold. "And sends rain
// on the just and the unjust": a cloud rains on both, and both fields grow green.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, olive, cypress, grass, sun, stars } from '../../assets/nature.js';
import { rain } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { SKY, LOOK, oldTablet, goldAnswer, heart, beam, greyCloud, man, tr, PI } from './lib.js';

const G = 690;
const MX = 640, NX = 500, EX = 980;
const DAWN = ['#8d8fb5', '#e3b3a6', '#f4d2ae'];

function field(c, x0, x1, y, col, col2) {
  const s = sheet();
  s.p(c.cut([[x0 + 40, y], [x0 + (x1 - x0) * 0.5, y - 5], [x1 - 40, y - 2], [x1, y + 34], [x0 + (x1 - x0) * 0.5, y + 38], [x0, y + 36]], 0.8, 10), col);
  let rows = '';
  const n = 16, mid = (x0 + x1) / 2;
  for (let i = 1; i < n; i++) {
    const xt = x0 + 40 + (i / n) * (x1 - x0 - 80), xb = x0 + (i / n) * (x1 - x0);
    rows += c.ribbon([[xt, y + 2], [xb + (xb - mid) * 0.02, y + 33]], 2.4);
  }
  s.x(rows, col2, 'opacity=".7"');
  return s.out();
}

export default {
  id: 'mt5-enemies',
  enter: 'fly',
  beats: [
    { v: 43 },
    { v: 44 },
    { v: 45, text: 'tak będziecie synami Ojca waszego, który jest w niebie;' },
    { v: 45, cont: true, text: 'ponieważ On sprawia, że słońce Jego wschodzi nad złymi i nad dobrymi,' },
    { v: 45, cont: true, text: 'i On zsyła deszcz na sprawiedliwych i niesprawiedliwych.' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const sk = sky(S, DAWN);
    const skDay = sky(S, SKY.day, { name: 'sky2' });
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -900, x1: 2500, y0: -600, y1: 300, n: 80 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, `<circle r="140" fill="url(#warm-glow)"/>${sun(c, 48)}`, { x: 800, y: 200, len: 900 });
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 480, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.lavender, 0.3), x0: -1400, x1: 3000 }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    mid.add(hillsWith(c, { y: 540, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 18, x0: -1400, x1: 3000 }).markup);
    /* the two farms */
    const ground = S.layer({ par: 0.3, sh: 3 });
    ground.add(sheet().p(c.cut([[-1400, 600], [3000, 592], [3000, 1800], [-1400, 1800]], 1, 14), mix(C.sand, C.hillNear, 0.35)).out());
    ground.add(house(c, 250, 610, 110, 80) + house(c, 1250, 606, 110, 80, { wall: mix(C.plaster, C.stone2, 0.4) }) + olive(c, 120, 640, 0.8) + cypress(c, 1420, 620, 110));
    const F = [[140, 600, 604], [1030, 1460, 600]];
    const fields = (col, col2) => F.map(([a, b, y]) => field(makeCutter('mt5-field' + a), a, b, y, col, col2)).join('');
    ground.add(fields(mix(C.sand2, C.soil, 0.35), mix(C.soil, C.sand2, 0.2)));
    const gold = ground.add(`<g>${fields(C.wheat, C.wheat2)}</g>`);
    const green = ground.add(`<g>${fields(mix(C.wheatGreen, C.hillNear, 0.3), C.leaf)}</g>`);
    ground.add(grass(c, { x0: -600, x1: 2200, y: 600, n: 40, h: 12, color: C.olive }));

    /* the wall between them, stone by stone */
    const P = S.layer({ par: 0.34, sh: 5 });
    const STONES = [];
    for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) {
      const x = 760 + k * 40 + (r % 2) * 18 - 9, y = G - 14 - r * 30;
      STONES.push({ x, y, r, k, el: P.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 22, 15, 9, 0.2), 0.8, 5), mix(C.stone2, C.rock, 0.3 + ((r + k) % 3) * 0.1)).out()}</g>`), dx: c.rr(-60, 60), rot: c.rr(-90, 90) });
    }
    /* people */
    const N = S.puppet(P.add(person(c, man(c, { robe: C.ochreRobe, mantle: null }))));
    const M = S.puppet(P.add(person(c, LOOK.shepherd)));
    const Mk = S.puppet(P.add(person(c, { ...LOOK.shepherd, pose: 'kneel' })));
    const E = S.puppet(P.add(person(c, { robe: mix(C.storm2, C.plumRobe, 0.4), mantle: mix(C.storm2, C.ink, 0.2), hair: C.hair3, hairStyle: 'wrap', veil: mix(C.storm2, C.ink, 0.1), beard: 'full', skin: C.skin3, belt: C.leather })));
    const ht = P.add(`<g>${heart(c, 12)}</g>`);
    const thread = P.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [500, -260], [1000, 0], 24), 3)}" fill="${C.halo}"/></g>`);
    const glowE = P.add(`<g><circle r="90" fill="url(#halo-glow)"/></g>`);
    const bm = P.add(`<g>${beam(c, 60, 180, 560)}</g>`);

    /* the rain (v45c) */
    const rainL = S.layer({ par: 0.3, sh: 3 });
    const cl = rainL.add(`<g>${greyCloud(c, 520, mix(C.stone2, C.lavender, 0.35))}</g>`);
    const rn = rainL.add(`<g>${rain(c, { x0: -700, x1: 700, y0: 0, y1: 300, n: 220, slant: -14 })}</g>`);

    /* the night, the old wash, the tablet, the answer */
    const nightL = S.layer({ par: 0, sh: 1, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night}"/>`);
    const wash = S.layer({ par: 0, sh: 1, flat: true });
    wash.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#c9ae86"/>`);
    const top = S.layer({ par: 0.3, sh: 6 });
    const tab = top.add(`<g>${oldTablet(c, tr(['Będziesz miłował bliźniego,', 'a nieprzyjaciela nienawidził'], ['You shall love your neighbor', 'and hate your enemy']), { w: 420, size: 22 })}</g>`);
    const ans = top.add(`<g>${goldAnswer(c, tr('Miłujcie waszych nieprzyjaciół', 'Love your enemies'), { size: 24 })}</g>`);

    return (t, time) => {
      const T = time;
      /* the day comes (v45b) */
      const dawn = es(t, 3.05, 3.6);
      skDay.layer.fade(dawn);
      starL.fade(0.7 * (1 - dawn));
      nightL.fade(0.22 * (1 - dawn));
      pose(sunEl, { x: 800, y: lerp(620, 200, es(t, 3.05, 3.55, ease.out)), r: Math.sin(T * 0.6) });
      pose(gold, { o: es(t, 3.3, 3.62) * (1 - es(t, 4.4, 4.7)) });
      pose(green, { o: es(t, 4.4, 4.7) });
      /* the rain (v45c) */
      const ck = es(t, 4.05, 4.35);
      pose(cl, { x: lerp(-300, 800, ck), y: 350, o: ck > 0.01 ? 0.95 : 0 });
      pose(rn, { x: 800, y: 340 + (T ? (T * 160) % 40 : 0), o: es(t, 4.3, 4.45) * 0.9 });

      /* v43 — the old saying; neighbour embraced, enemy glared at */
      wash.fade(0.3 * (1 - es(t, 0.9, 1.2)));
      const tk = es(t, -0.1, 0.3, ease.out) * (1 - es(t, 1.0, 1.2));
      pose(tab, { x: 800, y: lerp(-500, 140, tk) - es(t, 1.0, 1.2) * 300, r: Math.sin(T * 0.8) * 1.2, o: tk > 0.01 ? 1 : 0 });
      const ak = es(t, 1.06, 1.3, ease.out) * (1 - es(t, 1.9, 2.1));
      pose(ans, { x: 800, y: lerp(-300, 170, ak) - es(t, 1.9, 2.1) * 300, r: Math.sin(T * 0.9) * 1.2, o: ak > 0.01 ? 1 : 0 });
      const hug = es(t, 0.15, 0.35) * (1 - es(t, 1.0, 1.2));
      const glare = es(t, 0.4, 0.6) * (1 - es(t, 1.2, 1.4));
      pose(ht, { x: (MX + NX) / 2 + 10, y: G - 220, s: es(t, 0.3, 0.45, ease.back) * (1 - es(t, 1.0, 1.2)), o: t < 1.2 ? 1 : 0 });

      /* v44 — the wall comes down; he kneels and prays; a thread of light to his enemy */
      STONES.forEach((st) => {
        const k = es(t, 1.2 + (3 - st.r) * 0.06 + st.k * 0.03, 1.46 + (3 - st.r) * 0.06 + st.k * 0.03, ease.in);
        pose(st.el, { x: st.x + st.dx * k, y: lerp(st.y, G + 6 - (st.k % 2) * 6, k), r: st.rot * k, s: 1 - k * 0.2 });
      });
      const kneel = es(t, 1.5, 1.57);
      const pray = es(t, 1.55, 1.75);
      const up = es(t, 2.1, 2.4);
      M.set({ x: MX, y: G + 6, s: 1.0, armF: 20 + hug * 70, armB: hug * 40 + glare * 0, head: -glare * 2, o: 1 - kneel, blink: blinkAt(T, 1) });
      Mk.set({ x: MX + 20, y: G + 6, s: 1.0, armF: 40 + pray * 70, armB: 30 + pray * 110, head: -pray * 8 - up * 8, o: kneel, blink: blinkAt(T, 1) });
      N.set({ x: NX, y: G + 10, s: 0.98, armF: 20 + hug * 70, head: 4, blink: blinkAt(T, 2) });
      const soften = es(t, 1.8, 2.2);
      E.set({ x: EX, y: G + 8, s: 1.0, flip: true, armB: glare * 110 * (1 - soften), armF: 20 + glare * 40 * (1 - soften) + soften * 30, head: 4 - soften * 8, blink: blinkAt(T, 3) });
      const th = es(t, 1.62, 1.9);
      pose(thread, { x: MX + 40, y: G - 140, sx: th * (EX - MX - 80) / 1000, sy: th * 0.6, o: th > 0.01 ? 0.85 : 0 });
      pose(glowE, { x: EX, y: G - 110, s: 0.6 + th * 0.6, o: th * 0.8 });

      /* v45a — children of the Father in heaven: light comes down on him */
      const bk = es(t, 2.12, 2.4);
      pose(bm, { x: MX + 20, y: -40, sx: 0.8, o: bk * 0.8 * (1 - es(t, 3.2, 3.5) * 0.6) });

      S.cam.y = -16 + es(t, 3.0, 3.5) * 10;
      S.cam.z = 1.02;
    };
  },
};
