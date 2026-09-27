// J 21,23 — Among the brothers (a village in the afternoon light) a little paper slip goes from mouth to ear, copying
// itself as it goes: "he will not die" — heads lean together, a whisper hops along the row; the beloved disciple in
// their midst only smiles. Then the correction: each slip is struck through and falls away, and from the flies comes
// the Lord's own word on a strip of gold beside His portrait: "If I want him to remain until I come, what is that
// to you?" — the saying as He said it.
import { es, ease, bump, seg } from '../../core/anim.js';
import { band, hillsWith, town, olive, cypress, grass, flowers, sun } from '../../assets/nature.js';
import { talkDots } from '../mark16/lib.js';
import {
  JESUS, JOHN_OLD, CAST, crowdPerson, portraitPlate, goldWord, strip, lightHeart, sky, hanging,
  withFace, faceBits, skyKeys, kf, headAt, vis, pose, fade, person, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const GOLD = ['#d9c9a6', '#f2d7a8', '#f8e6c2'];
const GY = 704;
const ROW = [440, 520, 600, 680, 920, 1000, 1080, 1160];
const JO = { x: 800, y: 680 };

export default {
  id: 'j21-rumour',
  beats: [
    { v: 23, text: 'Rozeszła się wśród braci wieść, że uczeń ów nie umrze.' },
    { v: 23, cont: true, text: 'Ale Jezus nie powiedział mu, że nie umrze, lecz: «Jeśli Ja chcę, aby pozostał aż przyjdę, co tobie do tego?»' },
  ],
  cam: { x: [-30, 30], y: [-60, 120], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, `<circle r="130" fill="url(#warm-glow)" opacity=".7"/>${sun(c, 40)}`, { x: 1220, y: 200, len: 1200 });
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 440, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    const h = hillsWith(c, { y: 520, amps: [18, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 22 });
    mid.add(h.markup + town(c, { x: 800, y: h.fn(800) + 16, n: 9, spread: 520, sc: 0.62 }) + cypress(c, 380, h.fn(380) + 20, 110) + cypress(c, 1240, h.fn(1240) + 20, 120));
    const ground = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(640, [5, 2], [600, 170]);
    ground.add(sheet().p(c.ridge(gfn, -1400, 2800, 1800, 12, 1), mix(C.sand, C.hillNear, 0.3)).out() + olive(c, 250, gfn(250) + 40, 1.0) + olive(c, 1380, gfn(1380) + 40, 0.9) + grass(c, { x0: -600, x1: 2200, y: 0, fn: (x) => gfn(x) + 6, n: 50, h: 12, color: C.olive }) + flowers(c, { x0: 300, x1: 1300, y: 0, fn: () => c.rr(760, 900), n: 20, h: 14 }));

    const PL = S.layer({ par: 0.55, sh: 5 });
    const john = S.puppet(PL.add(withFace(person(c, JOHN_OLD), faceBits(c))));
    const bros = ROW.map((x, i) => ({ i, x, y: GY + (i % 2) * 8, seed: c.rr(0, 9), flip: x > 800, p: S.puppet(PL.add(person(c, crowdPerson(c)))) }));

    /* the slips: one travelling, copies left with each brother */
    const fx = S.layer({ par: 0.6, sh: 3 });
    const slipM = () => `<g>${strip(c, tr('on nie umrze', 'he won’t die'), { size: 14 })}<path class="x" opacity="0" d="${c.ribbon([[-46, 4], [46, -4]], 3)}" fill="${C.terracotta}"/></g>`;
    const slips = bros.map(() => fx.add(slipM()));
    const xs = slips.map((el) => el.querySelector('.x'));
    const dots = bros.map(() => fx.add(`<g>${talkDots(c)}</g>`));
    const heartJ = fx.add(`<g>${lightHeart(c, 10)}</g>`);
    const plate = fx.add(portraitPlate(S, JESUS, { r: 60, sc: 1.05, dy: 8 }));
    const gold = fx.add(`<g><path d="M0 -1600V-30" stroke="rgba(233,196,111,.6)" stroke-width="1.2"/>${goldWord(c, tr('«Jeśli Ja chcę, aby pozostał aż przyjdę…»', '“If I desire that he stay until I come…”'), { size: 22 })}</g>`);
    const gold2 = fx.add(`<g><path d="M0 -1600V-26" stroke="rgba(233,196,111,.6)" stroke-width="1.2"/>${goldWord(c, tr('«…co tobie do tego?»', '“…what is that to you?”'), { size: 20 })}</g>`);

    // the order the whisper travels: left row → right row
    const ORDER = [0, 1, 2, 3, 4, 5, 6, 7];
    return (t, time) => {
      const T = time;
      skyKeys(sk, t, [[0, GOLD], [2, GOLD]]);
      pose(sunEl, { x: 1220, y: 200 + es(t, 0, 2) * 20, r: T ? Math.sin(T * 0.5) : 0 });

      /* v23a — the whisper travels, copying itself */
      const hopAt = (j) => 0.1 + j * 0.09;
      bros.forEach((b) => {
        const j = ORDER.indexOf(b.i);
        const a = hopAt(j);
        const lean = bump(t, a - 0.02, a + 0.14);
        const toward = b.i < 4 ? 1 : -1;
        const surprised = es(t, a + 0.05, a + 0.12) * (1 - es(t, 1.2, 1.5));
        b.p.set({ x: b.x, y: b.y, s: 0.88, flip: b.flip, armF: 14 + lean * 40 + surprised * 20, armB: 8 + surprised * (b.i % 2 ? 90 : 30), lean: lean * 8 * toward * (b.i < 4 ? 1 : -1), head: lean * 6 - es(t, 1.2, 1.5) * 8, blink: blinkAt(T, b.seed) });
        const [hx, hy] = headAt(b.x, b.y, 0.88, b.flip);
        const k = es(t, a, a + 0.1, ease.back);
        const cross = es(t, 1.05 + j * 0.03, 1.15 + j * 0.03);
        const fall = es(t, 1.25 + j * 0.03, 1.5 + j * 0.03);
        vis(slips[b.i], { x: hx + (b.i < 4 ? 14 : -14), y: hy - 48 - (j % 2) * 16 + fall * 160, r: (j % 2 ? -5 : 5) + fall * 40 + (T ? Math.sin(T * 1.6 + j) * 2 * (1 - fall) : 0), s: k, o: k > 0.01 ? 1 - fall : 0 });
        fade(xs[b.i], cross);
        const dk = bump(t, a - 0.04, a + 0.1);
        vis(dots[b.i], { x: hx + (b.i < 4 ? 30 : -30), y: hy - 6, s: dk, o: dk });
      });
      john.set({ x: JO.x, y: JO.y, s: 0.92, flip: false, armF: 16 + es(t, 1.4, 1.7) * 20, armB: 10, head: -4 + (T ? Math.sin(T * 0.6) * 2 : 0), blink: blinkAt(T, 3) });
      const [jx, jy] = headAt(JO.x, JO.y, 0.92, false);
      const hk = es(t, 0.3, 0.55, ease.back);
      vis(heartJ, { x: jx, y: jy - 48 + (T ? Math.sin(T * 2) * 3 : 0), s: hk * (1 - es(t, 1.2, 1.4) * 0.3), o: hk > 0.01 ? 1 : 0 });

      /* v23b — the correction: the Lord's own words */
      const pk = es(t, 1.2, 1.45, ease.out);
      vis(plate, { x: 800, y: lerp(-400, 200, pk), r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: pk > 0.01 ? 1 : 0 });
      const gk = es(t, 1.3, 1.55, ease.out);
      vis(gold, { x: 800, y: lerp(-400, 318, gk), r: T ? Math.sin(T * 0.8 + 1) * 1 : 0, o: gk > 0.01 ? 1 : 0 });
      const g2 = es(t, 1.4, 1.65, ease.out);
      vis(gold2, { x: 800, y: lerp(-400, 372, g2), r: T ? Math.sin(T * 0.8 + 2) * 1 : 0, o: g2 > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -20], [0.5, 0], [1, 20], [1.3, 0], [2, 0]]);
      S.cam.y = kf(t, [[0, 90], [1, 80], [1.4, -20], [2, -30]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.14], [1.4, 1.04], [2, 1.06]]);
    };
  },
};
