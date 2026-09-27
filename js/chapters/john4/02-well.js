// J 4,6b–8 — Jacob's well below Sychar. Jesus comes in tired from the road and sits down on the stone bench by the
// well while the disciples go on up to the town. The sun climbs to the top of the sky — a day-arc comes down from
// the flies and its little sun reaches the sixth hour; the heat shimmers. A woman comes down from Sychar with her
// jar on her shoulder to draw water. "Give me a drink." (Meanwhile, in a roundel: the disciples buy bread in town.)
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  wellSet, womanRig, jarOnShoulder, bucketRope, G, DISC, NOON, MORN, dayArc, hourAt, sunToken, kf, moving, headAt, say, cupJ, loaf, basket, roundel, sychar, samaritan, vis, hanging, swing, PI,
} from './lib.js';

const AR0 = { x: 1110, y: 330, r: 100 };

export default {
  id: 'j4-well',
  beats: [
    { v: 6, cont: true, text: 'Jezus zmęczony drogą siedział sobie przy studni.' },
    { v: 6, cont: true, text: 'Było to około szóstej godziny.' },
    { v: 7, text: 'Nadeszła [tam] kobieta z Samarii, aby zaczerpnąć wody.' },
    { v: 7, cont: true, text: 'Jezus rzekł do niej: «Daj Mi pić!»' },
    { v: 8 },
  ],
  cam: { x: [-80, 80], y: [-60, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const AR = S.portrait ? { ...AR0, x: 960, y: 250 } : AR0;
    const RX = S.portrait ? 820 : 1120, RY = S.portrait ? 60 : 290;
    const W = wellSet(S, { skyCols: MORN, sunAt: [1180, 230] });
    const L = W.actL;
    // heat shimmer over the plaza
    const heat = [0, 1, 2, 3].map((i) => W.groundL.add(`<path d="${c.ribbon(c.cbez([0, 0], [14, -30], [-14, -60], [0, -90], 16), 3)}" fill="${C.apricot}" opacity="0"/>`));

    // people
    const jWalk = S.puppet(L.add(person(c, CAST.jesus)));
    const jSit = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const disc = DISC.map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...o, holdB: i === 1 ? `<g transform="translate(0 4) scale(.8)">${basket(c, { w: 40, h: 24 })}</g>` : '' }))) }));
    const W8 = womanRig(S, L);
    const bucket = L.add(`<g>${bucketRope(c)}</g>`);
    const ask = L.add(`<g>${say(c, tr('Daj Mi pić!', 'Give me a drink.'), { size: 24, side: 1 })}</g>`);
    const askCup = L.add(`<g>${cupJ(c)}</g>`);

    // the day-arc
    const fly = S.layer({ par: 0.2, sh: 5 });
    const arc = fly.add(`<g>${dayArc(c, AR.r, { label: tr('godziny dnia', 'hours of the day'), marks: [1, 6, 12] })}</g>`);
    const tok = fly.add(`<g>${sunToken(c, 12)}</g>`);

    // meanwhile in the town: the disciples at the baker's stall (a hanging roundel)
    const inner = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-160, -160, 320, 320), 0, 40), mix(C.skyBlue, C.cream, 0.5));
      const town = `<g transform="translate(0 40) scale(.7)">${sychar(c, 1)}</g>`;
      const stall = sheet();
      stall.p(c.cut(c.rect(-10, 40, 120, 70), 0.5, 6), C.wood3);
      stall.p(c.cut([[-24, -30], [124, -30], [112, 0], [-12, 0]], 0.5, 6), C.terracotta);
      stall.p(c.cut(c.rect(-4, 0, 6, 40), 0.2, 3) + c.cut(c.rect(98, 0, 6, 40), 0.2, 3), C.wood2);
      let lv = '';
      for (let i = 0; i < 5; i++) lv += `<g transform="translate(${10 + i * 22} ${36 - (i % 2) * 6})">${loaf(c, 11)}</g>`;
      return `${s.out()}${town}<path d="${c.ridge(c.wave(110, [3, 1], [200, 60]), -170, 170, 170, 8, 0.6)}" fill="${mix(C.sand, C.sand2, 0.4)}"/><g transform="translate(-10 0)">${stall.out()}${lv}</g><g data-k="baker"></g>`;
    })();
    const rEl = hanging(fly, roundel(S, inner, { r: 150, k: 'town' }), { x: RX, y: RY, len: 500 });
    const baker = S.puppet(fly.add(person(c, { ...samaritan(c, 0), mantle: null, robe: C.linen2 })));
    const buyers = [0, 2].map((k, i) => ({ i, p: S.puppet(fly.add(person(c, { ...DISC[k], holdB: i ? `<g transform="translate(0 4) scale(.8)">${basket(c, { w: 40, h: 24, full: true })}</g>` : '' }))) }));
    const coins = [0, 1, 2].map((i) => fly.add(`<circle r="5" fill="${C.sun}" stroke="${shade(C.sun, -0.3)}" stroke-width="1.4"/>`));

    return (t, time) => {
      const T = time;
      /* v6c — the sun climbs to the sixth hour */
      const noon = es(t, 1.0, 1.7);
      W.sk.blend(MORN, NOON, noon);
      W.update(t, T, { sunX: lerp(1180, 830, noon), sunY: lerp(230, 150, noon), glow: 0.4 + noon * 0.5 });
      pose(W.treeShadow, { x: 470, y: 652, sx: 1 - noon * 0.4, ox: 470, oy: 652 });
      heat.forEach((h, i) => {
        const on = noon * (1 - es(t, 4.1, 4.4) * 0.5);
        pose(h, { x: 560 + i * 170, y: 640 - ((T * 18 + i * 20) % 22), o: on * 0.5 });
      });
      const aK = es(t, 0.95, 1.35, ease.out) * (1 - es(t, 2.1, 2.5, ease.in));
      vis(arc, { x: AR.x, y: AR.y - (1 - aK) * 700, o: aK > 0.01 ? 1 : 0 });
      const hr = lerp(3.4, 6, es(t, 1.2, 1.75));
      const [hx, hy] = hourAt(AR.r, hr);
      vis(tok, { x: AR.x + hx, y: AR.y - (1 - aK) * 700 + hy, s: 1 + bump(t, 1.7, 1.95) * 0.3, o: aK > 0.01 ? 1 : 0 });

      /* v6b — Jesus arrives tired and sits; the disciples go on to the town */
      const jk = [[-0.5, -260], [0.0, 60], [0.45, G.jx]];
      const jx = kf(t, jk, ease.out);
      const sit = es(t, 0.5, 0.57);
      jWalk.set({ x: jx, y: G.floor, s: 1.05, o: 1 - sit, walk: moving(t, jk) ? jx * 0.035 : undefined, amt: 0.7, head: 8, lean: 4, armF: bump(t, 0.3, 0.5) * 150, blink: blinkAt(T) });
      const speak = es(t, 3.05, 3.25) * (1 - es(t, 3.85, 4.0));
      jSit.set({
        x: G.jx, y: G.floor - 28, s: 1.05, o: sit, head: lerp(10, 0, es(t, 0.9, 1.5)) - speak * 4 + es(t, 2.2, 2.5) * -2, lean: lerp(4, 0, es(t, 0.9, 1.5)),
        armF: 22 + speak * 60 + bump(t, 1.4, 1.9) * 40, armB: 12 + speak * 16, blink: blinkAt(T),
      });
      disc.forEach((d) => {
        const dk = [[-0.5, 200 - d.i * 70], [0.0, 520 - d.i * 70], [0.6, 1760 - d.i * 70]];
        const x = kf(t, dk, ease.sine);
        d.p.set({ x, y: G.floor + 12 + (d.i % 2) * 6, s: 1.0, walk: moving(t, dk) ? x * 0.05 : undefined, o: x < 1700 ? 1 : 0, head: d.i === 0 ? bump(t, 0.45, 0.8) * -8 : 0, armF: d.i === 0 ? bump(t, 0.45, 0.8) * 60 : 0, blink: blinkAt(T, d.seed) });
      });

      /* v7a — the woman comes down from the town with her jar */
      const wk = [[1.9, 1500], [2.55, G.wx]];
      const wx = kf(t, wk, ease.out);
      const walking = moving(t, wk);
      const down = es(t, 2.6, 2.85);         // she lifts the jar down onto the well's rim
      const startle = es(t, 3.15, 3.35);
      W8.p.set({
        x: wx, y: G.floor, s: 1.05, flip: true, o: t > 1.9 ? 1 : 0, walk: walking ? wx * 0.035 : undefined,
        armB: lerp(-150, 30, down) + bump(t, 2.7, 2.95) * 40, armF: bump(t, 2.65, 2.95) * 90 + es(t, 2.9, 3.1) * 40 + startle * 20,
        head: -startle * 10 + es(t, 3.6, 3.9) * 4, lean: -startle * 4, blink: blinkAt(T, 3),
      });
      const sh = jarOnShoulder(wx, G.floor, 1.05, true, walking ? -Math.abs(Math.cos(wx * 0.035)) * 3.5 : 0);
      const rim = { x: G.well + 44, y: G.floor - 48, s: 0.78, r: 0 };
      vis(W8.jar, { x: lerp(sh.x, rim.x, down), y: lerp(sh.y, rim.y, down) - Math.sin(down * PI) * 20, s: sh.s, r: lerp(sh.r, 0, down), o: t > 1.9 ? 1 : 0 });
      const bk = es(t, 2.85, 3.05);
      vis(bucket, { x: wx - 44, y: G.floor - 88 + (1 - bk) * 30, s: 1.1, o: bk });

      /* v7b — "Give me a drink" */
      const [jhx, jhy] = headAt(G.jx, G.floor - 28, 1.05, false, 62);
      const b = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      vis(ask, { x: jhx + 20, y: jhy - 34, s: b, o: b > 0.01 ? 1 : 0 });
      vis(askCup, { x: jhx + 215, y: jhy - 50, s: b * 1.1, r: Math.sin(T * 2) * 6, o: b > 0.01 ? 1 : 0 });

      /* v8 — meanwhile, in the town */
      const rk = es(t, 4.0, 4.35, ease.out);
      const ry = RY - (1 - rk) * 800;
      swing(rEl, RX, ry, T * rk, 0.8, 0.6);
      fade(rEl, rk > 0.01 ? 1 : 0);
      const on = rk > 0.01 ? 1 : 0;
      baker.set({ x: RX + 58, y: ry + 104, s: 0.46, flip: true, o: on, armF: 40 + bump(t, 4.4, 4.8) * 40, blink: blinkAt(T, 8) });
      buyers.forEach((d) => d.p.set({ x: RX - 80 + d.i * 44, y: ry + 116, s: 0.5, o: on, armF: d.i ? 10 : 50 + bump(t, 4.45, 4.75) * 30, head: -2, blink: blinkAt(T, d.i + 2) }));
      coins.forEach((cn, i) => {
        const k = seg(t, 4.4 + i * 0.06, 4.62 + i * 0.06);
        vis(cn, { x: lerp(RX - 50, RX + 30, k), y: ry + 40 - Math.sin(k * PI) * 30, sx: Math.cos(k * 12), o: on && k > 0 && k < 1 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, -30], [0.5, -50], [1.0, -10], [1.8, 10], [2.4, 20], [3.1, -10], [4.0, 30]]);
      S.cam.y = kf(t, [[-0.5, 70], [0.5, 80], [1.2, 30], [1.8, 30], [2.6, 80], [4.0, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.16], [0.5, 1.22], [1.2, 1.06], [1.8, 1.06], [2.6, 1.2], [3.3, 1.24], [4.0, 1.08]]);
    };
  },
};
