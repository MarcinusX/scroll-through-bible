// Łk 1,8–10 — the Temple court. The priests of Abijah's division stand in a row before the sanctuary, Zechariah among
// them: it is their turn to serve before God. The lots are cast from an urn — the white one leaps out to Zechariah; he
// is given the golden censer and goes up the steps into the sanctuary of the Lord. The whole people gather in the
// court below and pray, hands lifted, while the smoke of the incense rises over the roof.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  ZECHARIAH, templeCourt, priest, group, folk, lotStone, censer, glowDisc, sparkle, hungWord, puff,
  tr, es, ease, bump, seg, PI, hand,
} from './lib.js';

const FLOOR = 716, ROW = 704;
const XS = [560, 680, 800, 920, 1040];   // the division in a row; Zechariah in the middle

export default {
  id: 'lk1-lot',
  beats: [
    { v: 8 },
    { v: 9 },
    { v: 10 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the praying people stand closer, inside the screen
    const DAY = ['#d6e2d8', '#f2e4c4', '#f8e8cc'], GOLD = ['#dcc3a3', '#f2d3a2', '#f7e2bd'];
    const { sk, sunEl, cl1 } = templeCourt(S, { skyCols: DAY, floorY: FLOOR, sanctX: 800, sunAt: [1230, 150] });
    const DOOR = [800, FLOOR - 150];

    /* the smoke of the incense over the sanctuary roof */
    const smokeL = S.layer({ par: 0.16, sh: 1 });
    const puffs = [0, 1, 2, 3, 4, 5, 6].map((i) => ({ i, el: smokeL.add(`<g>${puff(c, 20 + (i % 3) * 6, mix('#ece4f0', C.lavender, 0.3))}</g>`) }));

    /* the division: four priests and Zechariah */
    const P = S.layer({ par: 0.34, sh: 5 });
    const G = S.layer({ par: 0.34, sh: 1, flat: true });
    const zGlow = G.add(`<g>${glowDisc(90, 'halo-glow', 1)}</g>`);
    const pri = XS.filter((x) => x !== 800).map((x, i) => ({ x, i, el: S.puppet(P.add(priest(c, i + 1))) }));
    const z = S.puppet(P.add(person(c, ZECHARIAH)));
    const zC = S.puppet(P.add(person(c, { ...ZECHARIAH, holdF: censer(c) })));
    // the urn of lots, held by the priest on the right
    const urn = P.add(`<g>${sheet().p(c.cut([[-18, -40], [18, -40], [14, -32], [24, -18], [22, 0], [-22, 0], [-24, -18], [-14, -32]], 0.4, 4), C.pot).x(c.ribbon([[-20, -16], [20, -16]], 2), C.cream, 'opacity=".5"').out()}</g>`);
    const lots = [0, 1, 2, 3].map((i) => ({ i, el: P.add(`<g>${lotStone(c, i === 0)}</g>`) }));
    const lotGlow = G.add(`<g>${glowDisc(40, 'halo-glow', 1)}</g>`);
    const fly = S.layer({ par: 0.2, sh: 6 });
    const tag = fly.add(hungWord(c, tr('oddział Abiasza', 'the division of Abijah'), { size: 22 }));

    /* the people praying outside (whole groups, as sprites) */
    const crowdL = S.layer({ par: 0.55, sh: 5 });
    const mk = (n, x0, dir, seed) => {
      const mem = [];
      for (let i = 0; i < n; i++) mem.push({ x: i * (PH ? 48 : 62) + c.rr(-10, 10), y: (i % 2) * 22 + c.rr(-4, 4), s: 0.92 * c.rr(0.94, 1.04), flip: dir < 0, o: folk(c, null, { armB: 0 }) });
      return mem;
    };
    // their hands are lifted: an arm raised inside each still figure (the raise is baked into the cut-out)
    const raise = (m) => m.replace(/class="armBr"/, 'class="armBr" transform="rotate(-150)"').replace(/class="armFr"/, 'class="armFr" transform="rotate(-70)"');
    const groupM = (mem) => mem.slice().sort((a, b) => a.y - b.y).map((m) => `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.flip ? -m.s : m.s} ${m.s})">${raise(person(c, m.o))}</g>`).join('');
    const left = crowdL.sprite(groupM(mk(4, 0, 1, 1)), 340, 790);
    const right = crowdL.sprite(groupM(mk(4, 0, -1, 2)), 1020, 790);

    return (t, time) => {
      const T = time;
      sk.blend(DAY, GOLD, es(t, 2.0, 2.8));
      pose(sunEl, { x: 1230, y: 150 + es(t, 2.0, 2.8) * 60, r: Math.sin(T * 0.6) });
      pose(cl1, { x: 470 + Math.sin(T * 0.1) * 24, y: 140, r: Math.sin(T * 0.6 + 1) * 1.2 });

      /* v8: the division serves before God in its turn */
      const tk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      pose(tag, { x: 800, y: lerp(-1100, 330, tk), r: Math.sin(T * 0.8) * 1.2, o: tk > 0.002 ? 1 : 0 });
      pri.forEach((p) => {
        const watch = es(t, 1.35, 1.6);
        const flipTo = p.x > 800;
        p.el.set({ x: p.x, y: ROW, s: 0.94, flip: watch > 0.5 ? flipTo : p.i % 2 === 1, armF: p.x === 920 ? 40 + bump(t, 1.0, 1.4) * 40 : 10, armB: 6, head: watch * -6, blink: blinkAt(T, p.i + 2) });
      });

      /* v9: the lot falls to him; the censer; up into the sanctuary */
      const [ux, uy] = hand(920, ROW, 0.94, true, 40);
      pose(urn, { x: ux, y: uy + 30, r: -bump(t, 1.05, 1.35) * 20 });
      lots.forEach((l) => {
        const k = seg(t, 1.0 + l.i * 0.03, 1.3 + l.i * 0.03);
        const win = l.i === 0;
        const tx = win ? 820 : ux + (l.i - 2) * 40, ty = win ? ROW - 110 : ROW - 6;
        const e = ease.out(k);
        pose(l.el, { x: lerp(ux, tx, e), y: lerp(uy + 10, ty, e) - Math.sin(k * PI) * (win ? 120 : 70), r: k * 360, o: k > 0 && (win ? t < 1.42 : t < 1.9) ? 1 : 0 });
      });
      pose(lotGlow, { x: 820, y: ROW - 110, s: 1, o: bump(t, 1.25, 1.5) });
      const go = es(t, 1.45, 1.92, ease.io);
      const gc = es(t, 1.4, 1.45);
      const zx = 800, zy = lerp(ROW, DOOR[1] + 4, go), zs = lerp(1, 0.6, go);
      z.set({ x: zx, y: ROW, s: 1, flip: false, o: 1 - gc, armF: 20 + bump(t, 1.2, 1.6) * 60, armB: 10, head: -bump(t, 1.2, 1.6) * 10, blink: blinkAt(T, 1) });
      zC.set({ x: zx, y: zy, s: zs, flip: false, o: gc * (1 - es(t, 1.92, 1.99)), walk: go > 0 && go < 1 ? t * 30 : undefined, armF: 50, armB: 8, blink: blinkAt(T, 1) });
      pose(zGlow, { x: zx, y: zy - 100 * zs, s: zs, o: bump(t, 1.2, 1.7) * 0.8 });

      /* v10: all the people pray outside; the smoke of the incense rises */
      const up = es(t, 2.0, 2.4, ease.out);
      left.set({ x: (PH ? 495 : 340) + up * 40, y: 790 + (1 - up) * 260, o: up > 0.01 ? 1 : 0 });
      right.set({ x: (PH ? 920 : 1020) - up * 40, y: 790 + (1 - up) * 260, o: up > 0.01 ? 1 : 0 });
      const sm = es(t, 1.95, 2.3);
      puffs.forEach((p) => {
        const k = T ? (T * 0.07 + p.i / puffs.length) % 1 : (p.i + 0.5) / puffs.length;
        pose(p.el, { x: 800 + Math.sin(k * 5 + p.i) * (14 + k * 50), y: DOOR[1] - 300 - k * 220, s: 0.7 + k * 1.6, o: sm * Math.min(1, k * 5) * (1 - k) * 0.9 });
      });

      S.cam.z = 1.05 - es(t, 1.9, 2.4) * 0.04;
      S.cam.y = 10 + es(t, 1.9, 2.4) * 20;
    };
  },
};
