// Mt 10,14–15 — the other kind of town. Thomas and Matthew speak in the square, but people turn their backs, the
// doors and shutters bang shut, and their words bounce back to them. So they walk out to the edge of the town and
// shake the dust off their feet. Then, under a reddening sky, a great balance comes down: on one pan the ruins of
// Sodom and Gomorrah, on the other this town — and the town's pan sinks: it will go more lightly for Sodom.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { town } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { village, DAY, EVENING, openHouse, wordSlip, dust, balance, ruinsIcon, strip, kf, moving, hand, headAt, folk, tr, PI } from './lib.js';

const GY = 704, HB = 690;
const LH = { x0: 380, w: 240, h: 250 }, RH = { x0: 962, w: 236, h: 244 };

export default {
  id: 'mt10-dust',
  beats: [
    { v: 14, text: 'Gdyby was gdzie nie chciano przyjąć i nie chciano słuchać słów waszych,' },
    { v: 14, cont: true, text: 'wychodząc z takiego domu albo miasta, strząśnijcie proch z nóg waszych!' },
    { v: 15 },
  ],
  cam: { x: [-80, 20], y: [-60, 20], z: [1, 1.1] },
  build(S) {
    const V = village(S, { skyCols: DAY, sunAt: [1250, 150] });
    const c = S.c;
    const EV = [mix(EVENING[0], C.dusk, 0.3), EVENING[1], EVENING[2]];

    /* the two houses, doors and shutters */
    const HL = S.layer({ par: 0.45, sh: 4 });
    const houses = [[LH, C.plaster2], [RH, mix(C.plaster2, C.stone2, 0.4)]].map(([H, wall]) => {
      const o = openHouse(c, { w: H.w, h: H.h, dw: 68, dh: 144, wall });
      HL.add(`<g transform="translate(${H.x0} ${HB})">${o.inside}</g>`);
      HL.add(`<g transform="translate(${H.x0} ${HB})">${o.wall}</g>`);
      const leaf = HL.add(`<g>${o.leaf}</g>`);
      const [wx, wy, ww, wh] = o.win;
      const shut = HL.add(`<g>${sheet().p(c.cut(c.rect(0, 0, ww + 4, wh + 4), 0.3, 4), C.wood2).x(c.ribbon([[ww / 2 + 2, 2], [ww / 2 + 2, wh + 2]], 1.6), shade(C.wood2, -0.25)).out()}</g>`);
      return { ...H, o, leaf, shut, door: H.x0 + o.door[0], win: [H.x0 + wx - 2, HB + wy - 2] };
    });

    /* the people of the town */
    const P = S.layer({ par: 0.5, sh: 5 });
    const FOLK = [[520, 0.8, 0], [590, 0.82, 1], [650, 0.8, 2], [920, 0.82, 3], [990, 0.8, 4], [1060, 0.82, 5]].map(([x, s, i]) => ({ x, s, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, folk(c)))) }));
    const thomas = S.puppet(P.add(person(c, CAST.thomas)));
    const matthew = S.puppet(P.add(person(c, CAST.matthew)));
    const W = S.layer({ par: 0.52, sh: 4 });
    const slips = [0, 1, 2, 3, 4].map(() => W.add(wordSlip(c, 30)));
    const dusts = [0, 1, 2, 3].map(() => W.add(`<g>${dust(c, 30, mix(C.clay, C.sand2, 0.45))}</g>`));

    /* the balance of the day of judgement */
    const flies = S.layer({ par: 0.2, sh: 6 });
    const B = balance(c, { arm: 190, drop: 120, pan: 120, col: C.ochre });
    const PIV = [800, 250];
    const frame = flies.add(`<g><path d="M0 -80V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${B.frame}</g>`);
    const beam = flies.add(`<g>${B.beam}</g>`);
    const panL = flies.add(`<g>${B.panL}<g transform="translate(0 ${120 - 26}) scale(.62)">${ruinsIcon(c, 150, 90)}</g><g transform="translate(0 ${120 + 44})">${strip(c, tr('Sodoma i Gomora', 'Sodom and Gomorrah'), { size: 17 })}</g></g>`);
    const panR = flies.add(`<g>${B.panR}<g transform="translate(-40 ${120 - 2})">${town(c, { x: 40, y: 0, n: 5, spread: 80, sc: 0.5 })}</g><g transform="translate(0 ${120 + 44})">${strip(c, tr('to miasto', 'that city'), { size: 17 })}</g></g>`);

    const TK = [[-0.3, -160], [0.3, 740], [1.05, 740], [1.5, 540], [2.2, 540]];

    return (t, time) => {
      const T = time;
      V.sk.blend(DAY, EV, es(t, 2.0, 2.4) * 0.8);
      V.update(t, T, { sunY: 150 + es(t, 2.0, 2.4) * 90 });

      /* v14a — no welcome, no listening */
      const tx = kf(t, TK);
      const speak = bump(t, 0.25, 0.95);
      thomas.set({ x: tx + 30, y: GY + 12, s: 0.92, flip: t > 1.02 && t < 2.0, walk: moving(t, TK) ? tx * 0.06 : undefined, armF: 20 + speak * 40, armB: 10 + speak * 120, head: -speak * 4, blink: blinkAt(T, 1) });
      const shake = t > 1.55 && t < 1.95 ? Math.sin(t * 150) : 0;
      matthew.set({ x: tx - 34, y: GY + 4, s: 0.9, flip: t > 1.0 && t < 2.0, walk: moving(t, TK) ? tx * 0.06 + 1 : shake ? t * 120 : undefined, amt: shake ? 1.8 : 1, bob: -Math.abs(shake) * 6, lean: shake * 3, armF: 20 + speak * 30, blink: blinkAt(T, 2) });
      FOLK.forEach((f) => {
        const away = es(t, 0.35 + f.i * 0.07, 0.5 + f.i * 0.07);
        const inDoor = f.i === 2 || f.i === 3 ? es(t, 0.65, 0.85) : 0;
        f.p.set({ x: f.x + (f.x < 800 ? -1 : 1) * inDoor * 40, y: GY - 14, s: f.s, flip: (f.x > 800) !== (away > 0.5), o: 1 - inDoor, armF: 14 + away * (f.i === 1 ? 150 : 20), armB: away * (f.i === 1 ? 140 : 30), head: away * 10, blink: blinkAt(T, f.seed) });
      });
      houses.forEach((h, i) => {
        const shut = es(t, 0.7 + i * 0.1, 0.8 + i * 0.1);
        pose(h.leaf, { x: h.door, y: HB, sx: Math.max(0.06, 0.06 + shut * 0.94), o: 1 });
        const sh = es(t, 0.6 + i * 0.12, 0.7 + i * 0.12, ease.back);
        pose(h.shut, { x: h.win[0], y: h.win[1], sy: Math.max(0.05, sh), o: sh > 0.01 ? 1 : 0 });
      });
      slips.forEach((w, i) => {
        const k = seg(t, 0.3 + i * 0.1, 0.72 + i * 0.1);
        const dir = i % 2 ? 1 : -1;
        const x = tx + 20 + dir * (k * 200 - Math.max(0, k - 0.55) * 460), y = GY - 200 - i * 12 - Math.sin(k * PI) * 40;
        pose(w, { x, y, r: k * 260 * dir, s: 0.9, o: bump(t, 0.3 + i * 0.1, 0.72 + i * 0.1) });
      });

      /* v14b — shake off the dust at the edge of the town */
      dusts.forEach((d, i) => {
        const k = seg(t, 1.58 + (i % 2) * 0.06, 2.0 + (i % 2) * 0.06);
        const x0 = i < 2 ? tx - 34 : tx + 30;
        pose(d, { x: x0 + k * 34 * (i % 2 ? 1 : -1), y: GY - k * 60, s: 0.5 + k * 1.3, o: Math.sin(k * PI) });
      });

      /* v15 — the balance: it will go more lightly for Sodom */
      const dk = es(t, 2.05, 2.4, ease.back);
      const py = lerp(-500, PIV[1], dk);
      const tilt = es(t, 2.4, 2.75, ease.back) * 13 + Math.sin(T * 1.2) * 0.6 * dk;
      pose(frame, { x: PIV[0], y: py, o: dk > 0.002 ? 1 : 0 });
      pose(beam, { x: PIV[0], y: py, r: tilt, o: dk > 0.002 ? 1 : 0 });
      const a = (tilt * PI) / 180;
      pose(panL, { x: PIV[0] - Math.cos(a) * 190, y: py - Math.sin(a) * 190, o: dk > 0.002 ? 1 : 0 });
      pose(panR, { x: PIV[0] + Math.cos(a) * 190, y: py + Math.sin(a) * 190, o: dk > 0.002 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1.05, 0], [1.5, -30], [2.0, -30], [2.3, 0]]);
      S.cam.y = -es(t, 2.0, 2.4) * 50;
      S.cam.z = 1 + bump(t, 1.4, 2.1) * 0.06;
    };
  },
};
