// J 4,27–30 — the disciples come back down from the town with their baskets and stop short: He is talking with a
// woman! Question-bubbles pop up over them — and fold shut again, unasked. She leaves her water jar standing on the
// rim of the well (it stays there) and runs up the road to Sychar. A picture of the town square comes down: doors
// open, people come out; "Come, see a man who told me everything I ever did — can this be the Christ?" The picture
// goes up, and out of the town gate a stream of people comes down the road towards Him.
import { C, person, blinkAt, lerp, sheet, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { house } from '../../assets/nature.js';
import { wellSet, wellCast, G, NOON, AFTER, DISC, SAM, samaritan, basket, say, bang, qmark, speech, thought, GLYPH, panel, vis, kf, headAt, along } from './lib.js';

const PAN0 = { x: 1080, y: 110, w: 560, h: 300 };
const ROAD = [[1640, 640], [1500, 652], [1360, 668], [1230, 684], [1110, 700], [1040, 712]];

export default {
  id: 'j4-jar',
  beats: [
    { v: 27, text: 'Na to przyszli Jego uczniowie i dziwili się, że rozmawiał z kobietą.' },
    { v: 27, cont: true, text: 'Jednakże żaden nie powiedział: «Czego od niej chcesz? - lub: - Czemu z nią rozmawiasz?»' },
    { v: 28, text: 'Kobieta zaś zostawiła swój dzban i odeszła do miasta.' },
    { v: 28, cont: true, text: 'I mówiła tam ludziom:' },
    { v: 29, text: '«Pójdźcie, zobaczcie człowieka, który mi powiedział wszystko, co uczyniłam:' },
    { v: 29, cont: true, text: 'Czyż On nie jest Mesjaszem?»' },
    { v: 30 },
  ],
  cam: { x: [-60, 340], y: [-60, 100], z: [0.9, 1.3] },
  build(S) {
    const c = S.c;
    // phone: the disciples stand closer to the well and the camera looks between Him and them; the picture of the
    // town hangs in the middle of the screen
    const PH = S.portrait;
    const PAN = PH ? { ...PAN0, x: 916, y: 20 } : PAN0;
    const W = wellSet(S, { skyCols: NOON, sunAt: [860, 140], behind: (S) => S.layer({ par: 0.55, sh: 0, flat: true }) });
    const jarGlow = W.behind.add(`<circle r="90" fill="url(#halo-glow)"/>`);
    const L = W.actL;
    const disc = DISC.map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...o, holdB: i < 3 ? `<g transform="translate(0 4) scale(.8)">${basket(c, { w: 40, h: 24, full: true })}</g>` : '' }))), x: PH ? 1085 + i * 48 : 1150 + i * 58, y: G.floor - 12 + (i % 2) * 6 }));
    const K = wellCast(S, W);
    // the stream of townsfolk (v30)
    const folk = Array.from({ length: 12 }, (_, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, samaritan(c, i + 40)))), d: i * 0.045 + c.rr(0, 0.02) }));
    const fx = S.layer({ par: 0.55, sh: 5 });
    const bangs = [0, 1, 2, 3].map(() => fx.add(`<g>${bang(c, C.terracotta, 1.2)}</g>`));
    const qs = [0, 1].map((i) => fx.add(`<g>${thought(c, `<g transform="translate(-10 0)">${GLYPH.q(c)}</g><g transform="translate(12 0)">${GLYPH.q(c)}</g>`, { w: 70, h: 50 })}</g>`));

    /* ---------- the town square (a picture on strings) ---------- */
    const pl = S.layer({ par: 0.4, sh: 6 });
    const sq = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-PAN.w / 2, 0, PAN.w, PAN.h), 0, 40), mix(C.skyBlue, C.cream, 0.4));
      let hs = '';
      [[-270, 90, 120, 150], [-150, 70, 110, 170], [-30, 96, 130, 150], [110, 80, 110, 170], [210, 100, 100, 150]].forEach(([x, y, w, h]) => { hs += house(c, x, y + h - 10, w, h - 10, { stairs: false }); });
      s.p(c.ridge(c.wave(262, [2, 1], [200, 60]), -PAN.w / 2 - 10, PAN.w / 2 + 10, PAN.h + 10, 10, 0.8), mix(C.sand, C.sand2, 0.5));
      return s.out() + hs + `<g transform="translate(0 262)">${sheet().p(c.cut(c.ell(0, -10, 34, 10, 16), 0.4, 5), C.stone2).out()}</g>`;
    })();
    const panEl = pl.add(`<g>${panel(S, sq, { w: PAN.w, h: PAN.h, k: 'square' })}</g>`);
    const wMini = S.puppet(pl.add(person(c, SAM)));
    const town = [0, 1, 2, 3, 4, 5].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(pl.add(person(c, samaritan(c, i + 60)))), x: [-230, -120, -40, 70, 150, 230][i], from: [-240, -110, -20, 60, 150, 240][i] }));
    const call = pl.add(`<g>${say(c, tr('Pójdźcie, zobaczcie!', 'Come, see!'), { size: 22, side: 1 })}</g>`);
    const crownQ = pl.add(`<g>${speech(c, `<g transform="translate(-14 4)"><circle r="18" fill="url(#halo-glow)"/><path d="${c.cut([[-14, 8], [-16, -8], [-8, 0], [0, -14], [8, 0], [16, -8], [14, 8]], 0.3, 3)}" fill="${C.sun}"/></g><g transform="translate(16 0)">${GLYPH.q(c)}</g>`, { w: 76, h: 52 })}</g>`);
    const heads = [0, 1, 2].map(() => pl.add(`<g>${qmark(c, C.terracotta, 0.8)}</g>`));

    return (t, time) => {
      const T = time;
      W.update(t, T, { sunX: 860, sunY: 140, glow: 0.8 });
      W.sk.blend(NOON, AFTER, es(t, 4, 7) * 0.5);
      /* v27 — the disciples return and marvel */
      const arrive = es(t, -0.3, 0.45, ease.out);
      const marvel = es(t, 0.45, 0.6);
      disc.forEach((d) => {
        const x = lerp(1700 + d.i * 70, d.x, arrive);
        d.p.set({ x, y: d.y, s: 0.94, flip: true, walk: arrive > 0 && arrive < 1 ? x * 0.05 : undefined, armF: marvel * 20 + es(t, 0.45, 0.6) * 30 * (1 - es(t, 1.5, 1.8)), armB: marvel * 20, head: -marvel * 6 + (d.i % 2) * marvel * 8 + es(t, 1.6, 1.9) * 8, lean: -marvel * 3, blink: blinkAt(T, d.seed) });
      });
      bangs.forEach((b, i) => {
        const d = disc[i];
        const [hx, hy] = headAt(d.x, d.y, 0.94, true);
        const k = es(t, 0.5 + i * 0.05, 0.65 + i * 0.05, ease.back) * (1 - es(t, 0.95, 1.05));
        vis(b, { x: hx, y: hy - 50, s: k, r: (i - 1.5) * 8, o: k > 0.01 ? 1 : 0 });
      });
      qs.forEach((q, i) => {
        const d = disc[i * 2];
        const [hx, hy] = headAt(d.x, d.y, 1.0, true);
        const k = es(t, 1.1 + i * 0.1, 1.3 + i * 0.1, ease.back);
        const shut = es(t, 1.9, 2.0);
        vis(q, { x: hx - 6, y: hy - 18, s: k * (1 - shut), o: k > 0.01 && shut < 0.99 ? 1 : 0 });
      });
      /* v28a — she leaves her jar and goes to the town */
      const run = es(t, 2.2, 2.95, ease.in);
      const wx = lerp(G.wx, 1720, run);
      K.set({
        T, jF: 22, jB: 12, jH: -2 + bump(t, 0.4, 1.8) * -6 + run * 4,
        wx, wWalk: run > 0 && run < 1 ? wx * 0.05 : undefined, wo: 1 - es(t, 2.9, 2.95),
        wF: 26 + bump(t, 0.3, 1.9) * 20 + bump(t, 2.05, 2.3) * 60, wB: 16 + run * 20, wH: bump(t, 2.05, 2.3) * 10 - run * 4, wFlip: t < 2.18,
      });
      vis(jarGlow, { x: K.RIM.x, y: K.RIM.y - 40, s: 1, o: bump(t, 2.3, 3.2) * 0.9 });
      /* v28b–29 — the town square */
      const pk = es(t, 3.0, 3.35, ease.out) * (1 - es(t, 5.9, 6.25, ease.in));
      const py = PAN.y - (1 - pk) * 700;
      const on = pk > 0.01 ? 1 : 0;
      vis(panEl, { x: PAN.x, y: py, o: on });
      const G2 = py + 262;
      const wIn = es(t, 3.1, 3.5, ease.out);
      const beckon = Math.max(bump(t, 4.05, 4.95), 0) + es(t, 5.05, 5.3) * 0.4;
      const mx = lerp(PAN.x + 300, PAN.x - 20, wIn);
      wMini.set({ x: mx, y: G2 + 4, s: 0.5, flip: t < 3.6 || t > 4.05, o: on, walk: wIn > 0 && wIn < 1 ? mx * 0.08 : undefined, armF: 30 + beckon * 90, armB: 20 + beckon * 120, head: -beckon * 6, blink: blinkAt(T, 3) });
      town.forEach((f) => {
        const k = es(t, 3.45 + f.i * 0.07, 3.75 + f.i * 0.07);
        const look = es(t, 5.1, 5.3);
        f.p.set({ x: PAN.x + lerp(f.from, f.x, k), y: G2 - 2 + k * 6 + (f.i % 2) * 4, s: 0.44, flip: f.x > -20 ? true : false, o: on * k, armF: bump(t, 4.3, 4.9) * 40, head: look * (f.i % 2 ? 10 : -10), blink: blinkAt(T, f.seed) });
      });
      const [mhx, mhy] = headAt(mx, G2 + 4, 0.5, false);
      const ck = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.9, 5.0));
      vis(call, { x: mhx + 10, y: mhy - 16, s: ck * 0.9, o: on * ck > 0.01 ? 1 : 0 });
      const qk = es(t, 5.05, 5.25, ease.back) * (1 - es(t, 5.85, 5.95));
      vis(crownQ, { x: mhx + 10, y: mhy - 16, s: qk * 0.8, o: on * qk > 0.01 ? 1 : 0 });
      heads.forEach((h, i) => {
        const f = town[[0, 3, 5][i]];
        const k = es(t, 5.3 + i * 0.08, 5.45 + i * 0.08, ease.back) * (1 - es(t, 5.85, 5.95));
        vis(h, { x: PAN.x + f.x, y: G2 - 110, s: k, o: on * k > 0.01 ? 1 : 0 });
      });
      /* v30 — out of the town and down the road to Him */
      folk.forEach((f) => {
        const u = seg(t, 6.05 + f.d, 6.75 + f.d * 0.5);
        const [x, y] = along(ROAD, ease.out(u));
        const sc = lerp(0.42, 0.92, u);
        f.p.set({ x: x + (f.i % 4) * 44 * u, y: y + (f.i % 3) * 10 * u, s: sc * 0.95, flip: true, o: u > 0 ? Math.min(1, u * 6) : 0, walk: u > 0 && u < 1 ? T * 7 + f.i : undefined, head: -2, blink: blinkAt(T, f.seed) });
      });

      S.cam.x = PH ? kf(t, [[-0.5, 330], [2.3, 330], [3.4, 290], [7, 290]]) : kf(t, [[-0.5, 120], [0.5, 110], [1.8, 80], [2.3, 120], [2.95, 180], [3.4, 160], [5.9, 160], [6.3, 60]]);
      S.cam.y = kf(t, [[-0.5, 40], [0.5, 40], [1.8, 40], [2.95, 30], [3.4, -40], [5.9, -40], [6.3, 30]]);
      S.cam.z = PH ? kf(t, [[-0.5, 0.96], [2.9, 0.96], [3.4, 1], [5.9, 1], [6.3, 0.96]]) : kf(t, [[-0.5, 1.12], [0.5, 1.1], [1.8, 1.16], [2.3, 1.08], [3.4, 1.12], [5.9, 1.12], [6.3, 0.96]]);
    };
  },
};
