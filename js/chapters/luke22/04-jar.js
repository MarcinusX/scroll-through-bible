// Łk 22,10–13 — as He says it, it happens: inside the city gate a man fills his water jar at the fountain and lifts
// it to his shoulder; Peter and John follow him up the street to a house. At the door they give the Teacher's words to
// the master of the house — "Where is the guest room?" — and he points upstairs: the front of the upper floor folds
// down on a large room, spread with cushions. They found it just as He had told them, and prepared the Passover:
// the table set, the lamb brought, the lamps lit.
import { es, ease, bump, seg } from '../../core/anim.js';
import { sun, cloud } from '../../assets/nature.js';
import {
  streetSet, HOUSE, TW, LOOK14, kf, moving, headAt, speech, say, waterJar, drop, oilLamp, lowTable, bowl, loaf, cup, matzah, lamb, person,
  hanging, swing, vis, pose, fade, lerp, mix, shade, sheet, blinkAt, tr, C, PI,
} from './lib.js';

const { GY, HX, H1 } = HOUSE;
const FX0 = 450;      // the fountain

export default {
  id: 'lk22-jar',
  beats: [
    { v: 10, text: 'Odpowiedział im: «Oto gdy wejdziecie do miasta, spotka się z wami człowiek niosący dzban wody.' },
    { v: 10, cont: true, text: 'Idźcie za nim do domu, do którego wejdzie,' },
    { v: 11 },
    { v: 12 },
    { v: 13 },
  ],
  cam: { x: [-380, 670], y: [-60, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const P_ = S.portrait;
    const FX = P_ ? FX0 + 150 : FX0;   // phone: the fountain, the man and the two who meet him come in where the screen sees them
    const R = streetSet(S, { skyCols: ['#c3d8d8', '#efe5cb', '#f7e6c8'] });
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1500, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 160), { x: 700, y: 170, len: 600 });
    const X0 = R.X0, DOORX = R.DOORX;

    // the fountain in the street
    const fnL = S.layer({ par: 0.4, sh: 4 });
    const fnt = sheet();
    fnt.p(c.cut([[FX - 70, GY - 6], [FX - 70, GY - 70], [FX + 70, GY - 70], [FX + 70, GY - 6]], 0.5, 6), C.stone);
    fnt.p(c.cut(c.rect(FX - 78, GY - 80, 156, 14), 0.4, 6), C.stone2);
    fnt.p(c.cut([[FX - 10, GY - 80], [FX - 10, GY - 150], [FX + 10, GY - 150], [FX + 10, GY - 80]], 0.4, 5), C.stone2);
    fnt.p(c.cut(c.circ(FX, GY - 156, 12, 12), 0.3, 4), C.stone);
    fnt.x(c.cut(c.ell(FX, GY - 74, 64, 5, 16), 0.2, 4), C.lake);
    fnL.add(fnt.out());
    const spout = fnL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [16, 4], [22, 60], 10), 3)}" fill="${C.lake2}" opacity=".8"/></g>`);

    // the room upstairs
    const roomL = S.layer({ par: 0.42, sh: 4 });
    const pIn = S.puppet(roomL.add(person(c, TW.peter)));
    const jIn = S.puppet(roomL.add(person(c, TW.john)));
    roomL.add(`<g transform="translate(${HX} ${H1})">${lowTable(c, 240, 34)}</g>`);
    const dishes = [[HX - 90, loaf(c, 14)], [HX - 50, cup(c)], [HX - 10, matzah(c, 18)], [HX + 36, bowl(c, { food: 'stew' })], [HX + 84, cup(c, C.clay)]]
      .map(([x, m], i) => ({ i, x, el: roomL.add(`<g>${m}</g>`) }));
    const lamps = [HX - 150, HX + 150].map((x) => { const el = roomL.add(`<g>${oilLamp(c, { r: 110 })}</g>`); return { el, x, fl: el.querySelector('.flame'), gl: el.querySelector('.glow') }; });
    const lambDish = roomL.add(`<g>${sheet().p(c.cut(c.ell(0, -4, 34, 5, 16), 0.3, 4), C.stone2).out()}<g transform="translate(0 -6) scale(.42)">${lamb(c)}</g></g>`);
    const F = R.facade();

    // people in the street
    const P = S.layer({ par: 0.42, sh: 5 });
    const water = S.puppet(P.add(person(c, LOOK14.waterman)));
    const host = S.puppet(P.add(person(c, LOOK14.host)));
    const peter = S.puppet(P.add(person(c, TW.peter)));
    const john = S.puppet(P.add(person(c, TW.john)));
    const jarEl = P.add(`<g>${waterJar(c)}</g>`);
    const drops = Array.from({ length: 4 }, (_, i) => ({ i, el: P.add(`<g>${drop(c, 3)}</g>`) }));
    const fx = S.layer({ par: 0.43, sh: 4 });
    const askB = fx.add(`<g>${say(c, [tr('«Nauczyciel pyta:', '“The Teacher says:'), tr('gdzie jest izba?»', 'where is the guest room?”')], { size: 18, side: 1 })}</g>`);
    const upArrow = fx.add(`<g><path d="${c.cut([[-6, 0], [-6, -40], [-16, -40], [0, -62], [16, -40], [6, -40], [6, 0]], 0.4, 4)}" fill="${C.cream}"/></g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1500, 150, T, 1.2, 0.7);
      swing(cl, 700 + Math.sin(T * 0.1) * 30, 170, T, 1.5, 0.6, 1);
      pose(spout, { x: FX + 12, y: GY - 150 });

      /* the man with the water jar: fills it, lifts it, walks up the street, goes in at the door */
      const wK = [[1.05, [FX + 70, GY]], [1.85, [DOORX + 60, GY]], [2.0, [DOORX, GY - 4]]];
      const [wx, wy] = kf(t, wK, ease.sine);
      const ww = moving(t, wK, 1);
      const lift = es(t, 0.3, 0.6);
      const inside = es(t, 1.95, 2.1);
      water.set({ x: wx, y: wy, s: 0.98, flip: false, o: 1 - inside, walk: ww ? wx * 0.05 : undefined, armF: 30 * (1 - lift), armB: lerp(60, 165, lift), head: -lift * 4 + (t < 0.3 ? 14 : 0), blink: blinkAt(T, 1) });
      const shoulder = headAt(wx, wy, 0.98, false);
      const jx = lerp(FX + 16, shoulder[0] - 22, lift), jy = lerp(GY - 96, shoulder[1] + 4, lift);
      vis(jarEl, { x: jx, y: jy + (ww ? -Math.abs(Math.cos(wx * 0.05)) * 3.5 : 0), s: 0.95, r: -lift * 10, o: 1 - inside });
      drops.forEach((d) => {
        const k = T ? ((T * 0.9 + d.i / 4) % 1) : d.i / 4;
        vis(d.el, { x: jx + 4, y: jy - 30 + k * 10, o: (1 - lift) * es(t, -0.2, 0.1) * (1 - k) });
      });

      /* Peter and John: in at the gate, they meet him, follow, ask, climb, prepare */
      const pK = [[-0.4, [110, GY]], [0.55, [P_ ? 490 : 300, GY]], [1.0, [P_ ? 510 : 320, GY]], [1.9, [DOORX - 150, GY]], [3.85, [DOORX - 150, GY]], [4.05, [X0 - 150, GY - 60]], [4.28, [X0 - 20, H1 + 4]], [4.34, [X0 + 20, H1]]];
      const jK = pK.map(([tt, [x, y]], i) => [tt + (i > 4 ? 0.1 : 0.06), [x - (i > 4 ? 20 : 70), y + (i > 4 ? 2 : 6)]]);
      const [px, py] = kf(t, pK, ease.sine), [jx2, jy2] = kf(t, jK, ease.sine);
      const inRoom = es(t, 4.36, 4.42);
      const talk = es(t, 2.1, 2.35) * (1 - es(t, 2.95, 3.1));
      const up = es(t, 3.1, 3.4) * (1 - es(t, 4.0, 4.3));
      peter.set({ x: px, y: py, s: 0.98, flip: false, o: 1 - inRoom, walk: moving(t, pK, 1) ? px * 0.05 : undefined, armF: 20 + talk * 60 + bump(t, 0.5, 0.95) * 50, armB: 8, head: -up * 16, blink: blinkAt(T, 3) });
      john.set({ x: jx2, y: jy2, s: 0.94, flip: false, o: 1 - inRoom, walk: moving(t, jK, 1) ? jx2 * 0.05 : undefined, armF: 14 + bump(t, 0.55, 1.0) * 30, head: -up * 18, blink: blinkAt(T, 5) });
      const [phx, phy] = headAt(DOORX - 150, GY, 0.98, false);
      const ab = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(askB, { x: phx + 20, y: phy - 18, s: ab, o: ab > 0.01 ? 1 : 0 });

      // the master of the house at his door: points upstairs
      const hOn = es(t, 2.05, 2.25);
      const point = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      host.set({ x: DOORX + 10, y: GY - 4, s: 0.96, flip: true, o: hOn * (1 - es(t, 4.3, 4.45)), armF: 20 + point * 60, armB: 10 + point * 150, head: -point * 12, blink: blinkAt(T, 7) });
      const ua = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.95, 4.1));
      vis(upArrow, { x: DOORX + 60, y: H1 + 60 - (T ? Math.sin(T * 3) * 6 : 0), s: ua, o: ua > 0.01 ? 1 : 0 });

      // v12 — the front folds down: a large room, spread
      const open = es(t, 3.15, 3.6, ease.out);
      vis(F.flap, { x: 0, y: H1, sy: Math.max(0.02, 1 - open), o: 1 - es(t, 3.55, 3.65) });
      fade(R.roomGlow, open * 0.5 + es(t, 4.55, 4.72) * 0.5);

      // v13 — they found it, and prepared the Passover
      const prep = seg(t, 4.42, 5.4);
      pIn.set({ x: HX - 60 + Math.sin(prep * PI * 2) * 40, y: H1 - 6, s: 0.72, flip: prep > 0.5, o: inRoom, armF: 50, armB: 20, head: 10, blink: blinkAt(T, 3) });
      jIn.set({ x: HX + 80 - Math.sin(prep * PI * 2) * 30, y: H1 - 4, s: 0.7, flip: true, o: inRoom, armF: 50, armB: 20, head: 8, blink: blinkAt(T, 5) });
      dishes.forEach((d) => {
        const k = es(t, 4.42 + d.i * 0.05, 4.54 + d.i * 0.05, ease.back);
        vis(d.el, { x: d.x, y: H1 - 34 - (1 - k) * 20, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const lk = es(t, 4.56, 4.66, ease.back);
      vis(lambDish, { x: HX + 4, y: H1 - 34, s: lk * 0.9, o: lk > 0.01 ? 1 : 0 });
      lamps.forEach((l, i) => {
        const lit = es(t, 4.6 + i * 0.06, 4.7 + i * 0.06);
        vis(l.el, { x: l.x, y: H1 - 22, s: 0.7, o: es(t, 3.45, 3.6) });
        pose(l.fl, { x: 35, y: -16, s: lit, sx: lit * (1 + (T ? Math.sin(T * 7 + i) * 0.08 : 0)), sy: lit * (1 + (T ? Math.sin(T * 5.3 + i) * 0.1 : 0)) });
        fade(l.gl, lit * 0.8);
      });

      R.sky.blend(['#c3d8d8', '#efe5cb', '#f7e6c8'], ['#d2c8d6', '#f0d9bf', '#f5dcbf'], es(t, 4.3, 5.8));
      S.cam.x = P_   // phone: the meeting at the fountain in the middle; the large room upstairs whole, clear of the thread
        ? kf(t, [[-0.5, -360], [0.3, -360], [1.0, -320], [1.9, 250], [2.6, 330], [3.2, 640], [4.1, 650], [5.0, 650]])
        : kf(t, [[-0.5, -260], [0.3, -200], [1.0, -100], [1.9, 250], [2.6, 330], [3.2, 400], [4.1, 440], [5.0, 440]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.3, 1.14], [1.0, 1.1], [1.9, 1.08], [2.6, 1.14], [3.2, 1.06], [5.0, 1.2]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.3, 40], [1.9, 30], [3.2, -30], [4.1, -20], [5.0, -50]]);
    };
  },
};
