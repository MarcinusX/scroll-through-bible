// Mt 26,17–19 — the first day of Unleavened Bread, a street inside the city gate. The disciples ask where to prepare
// the Passover; He sends them to "a certain man": Peter and John go up the street to a house. At its door they give
// the Teacher's message — "My time is at hand; I will keep the Passover at your house" — the master of the house bows
// and points upstairs. They did as Jesus told them: the front of the upper floor folds down — a room spread and
// ready — and they set the table, bring the lamb and light the lamps.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  streetSet, HOUSE, TW, LOOK, kf, moving, headAt, speech, say, GLYPH, oilLamp, lowTable, bowl, loaf, cup, matzah, lamb, hourglassParts,
  withFace, faceBits, tr, vis, PI,
} from './lib.js';

const { GY, HX, H1 } = HOUSE;
const JX = 640;

export default {
  id: 'mt26-prepare',
  beats: [
    { v: 17 },
    { v: 18, text: 'On odrzekł: «Idźcie do miasta, do znanego nam człowieka, i powiedzcie mu:' },
    { v: 18, cont: true, text: '"Nauczyciel mówi: Czas mój jest bliski; u ciebie chcę urządzić Paschę z moimi uczniami"».' },
    { v: 19 },
  ],
  cam: { x: [-300, 480], y: [-60, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const R = streetSet(S);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1500, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 160), { x: 700, y: 170, len: 600 });
    const X0 = R.X0, DOORX = R.DOORX;

    // the room upstairs: Peter and John inside, the table, dishes, lamps
    const roomL = S.layer({ par: 0.42, sh: 4 });
    const pIn = S.puppet(roomL.add(person(c, TW.peter)));
    const jIn = S.puppet(roomL.add(person(c, TW.john)));
    roomL.add(`<g transform="translate(${HX} ${H1})">${lowTable(c, 240, 34)}</g>`);
    const dishes = [[HX - 90, loaf(c, 14)], [HX - 50, cup(c)], [HX - 10, matzah(c, 18)], [HX + 36, bowl(c, { food: 'stew' })], [HX + 84, cup(c, C.clay)]]
      .map(([x, m], i) => ({ i, x, el: roomL.add(`<g>${m}</g>`) }));
    const lamps = (S.portrait ? [HX - 140, HX + 115] : [HX - 150, HX + 150]).map(   // phone: the right lamp clear of the thread
      (x) => { const el = roomL.add(`<g>${oilLamp(c, { r: 110 })}</g>`); return { el, x, fl: el.querySelector('.flame'), gl: el.querySelector('.glow') }; });
    const lambDish = roomL.add(`<g>${sheet().p(c.cut(c.ell(0, -4, 34, 5, 16), 0.3, 4), C.stone2).out()}<g transform="translate(0 -6) scale(.42)">${lamb(c)}</g></g>`);
    const F = R.facade();

    // people in the street
    const P = S.layer({ par: 0.42, sh: 5 });
    const host = S.puppet(P.add(person(c, LOOK.host)));
    const REST = [{ k: 'andrew', x: 500 }, { k: 'james', x: 554 }, { k: 'judas', x: 720 }, { k: 'thomas', x: 772 }, { k: 'matthew', x: 460 }]
      .map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, TW[d.k]))) }));
    const jesus = S.puppet(P.add(withFace(person(c, CAST.jesus), faceBits(c))));
    const peter = S.puppet(P.add(person(c, TW.peter)));
    const john = S.puppet(P.add(person(c, TW.john)));
    const fx = S.layer({ par: 0.43, sh: 4 });
    const askB = fx.add(`<g>${speech(c, `<g transform="translate(-18 10)">${sheet().p(c.cut(c.ell(0, -4, 22, 4, 12), 0.3, 3), C.stone2).out()}<g transform="translate(0 -6) scale(.36)">${lamb(c)}</g></g><g transform="translate(22 0) scale(.9)">${GLYPH.q(c)}</g>`, { w: 90, h: 58, flip: true })}</g>`);
    const hg = hourglassParts(c, 40);
    const msg = fx.add(`<g>${say(c, [tr('«Nauczyciel mówi:', '“The Teacher says,'), tr('Czas mój jest bliski»', 'My time is at hand”')], { size: 19, side: 1 })}<g transform="translate(-6 -120) scale(.8)">${hg.frame}${hg.top}${hg.stream}</g></g>`);
    const upArrow = fx.add(`<g><path d="${c.cut([[-6, 0], [-6, -40], [-16, -40], [0, -62], [16, -40], [6, -40], [6, 0]], 0.4, 4)}" fill="${C.cream}"/></g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1500, 150, T, 1.2, 0.7);
      swing(cl, 700 + Math.sin(T * 0.1) * 30, 170, T, 1.5, 0.6, 1);

      /* v17 — they ask Him */
      const asking = es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.1));
      const send = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      jesus.set({ x: JX, y: GY, s: 1.04, flip: false, armF: 20 + send * 70 + bump(t, 0.4, 0.95) * 20, armB: 10 + send * 20, head: -send * 4, blink: blinkAt(T) });
      REST.forEach((d) => {
        const toJ = d.x > JX;
        d.p.set({ x: d.x, y: GY + (d.i % 2) * 8 - 10, s: 0.94, flip: toJ, armF: 14 + asking * (d.k === 'judas' ? 10 : 30), armB: 4, head: -asking * 6, blink: blinkAt(T, d.seed) });
      });
      const a = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 0.9, 1.0));
      const [ax, ay] = headAt(720, GY - 10, 0.94, true);
      vis(askB, { x: ax - 14, y: ay - 24, s: a, o: a > 0.01 ? 1 : 0 });

      /* v18a — Peter and John go up the street to the house; v18b — the message; v19 — up and inside */
      const pK = [[-0.5, [830, GY + 6]], [1.3, [830, GY + 6]], [2.05, [DOORX - 140, GY]], [2.95, [DOORX - 140, GY]], [3.1, [X0 - 150, GY - 60]], [3.28, [X0 - 20, H1 + 4]], [3.33, [X0 + 20, H1]]];
      const jK = pK.map(([tt, [x, y]], i) => [tt + (i > 3 ? 0.04 : 0.05), [x - (i > 3 ? 20 : 64), y + (i > 3 ? 2 : 6)]]);
      const [px, py] = kf(t, pK, ease.sine), [jx2, jy2] = kf(t, jK, ease.sine);
      const inRoom = es(t, 3.32, 3.38);
      const talk = es(t, 2.05, 2.3) * (1 - es(t, 2.85, 3.0));
      peter.set({ x: px, y: py, s: 0.98, flip: t < 1.25, o: 1 - inRoom, walk: moving(t, pK, 1) ? px * 0.05 : undefined, armF: 20 + talk * 60, armB: 8, head: -es(t, 2.9, 3.05) * 16, blink: blinkAt(T, 3) });
      john.set({ x: jx2, y: jy2, s: 0.94, flip: t < 1.25, o: 1 - inRoom, walk: moving(t, jK, 1) ? jx2 * 0.05 : undefined, armF: 14, head: -es(t, 2.9, 3.05) * 18, blink: blinkAt(T, 5) });
      const hOn = es(t, 1.8, 2.0);
      const bowK = bump(t, 2.3, 2.8);
      const point = es(t, 2.75, 2.95) * (1 - es(t, 3.1, 3.3));
      host.set({ x: DOORX + 10, y: GY - 4, s: 0.96, flip: true, o: hOn * (1 - es(t, 3.25, 3.4)), armF: 20 + point * 60 + bowK * 30, armB: 10 + point * 150, head: bowK * 16 - point * 12, lean: bowK * 8, blink: blinkAt(T, 7) });
      const [phx, phy] = headAt(DOORX - 140, GY, 0.98, false);
      const mb = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.85, 2.95));
      vis(msg, { x: phx + 22, y: phy - 16, s: mb, o: mb > 0.01 ? 1 : 0 });
      const ua = es(t, 2.85, 3.0, ease.back) * (1 - es(t, 3.1, 3.2));
      vis(upArrow, { x: DOORX + 60, y: H1 + 60 - Math.sin(T * 3) * 6, s: ua, o: ua > 0.01 ? 1 : 0 });

      // the front folds down: a room spread and ready; they set it and light the lamps
      const open = es(t, 3.02, 3.3, ease.out);
      vis(F.flap, { x: 0, y: H1, sy: Math.max(0.02, 1 - open), o: 1 - es(t, 3.27, 3.33) });
      fade(R.roomGlow, open * 0.5 + es(t, 3.55, 3.7) * 0.5);
      const prep = seg(t, 3.35, 3.95);
      pIn.set({ x: HX - 60 + Math.sin(prep * PI * 2) * 40, y: H1 - 6, s: 0.72, flip: prep > 0.5, o: inRoom, armF: 50, armB: 20, head: 10, blink: blinkAt(T, 3) });
      jIn.set({ x: HX + (S.portrait ? 50 : 80) - Math.sin(prep * PI * 2) * 30, y: H1 - 4, s: 0.7, flip: true, o: inRoom, armF: 50, armB: 20, head: 8, blink: blinkAt(T, 5) });
      dishes.forEach((d) => {
        const k = es(t, 3.38 + d.i * 0.04, 3.48 + d.i * 0.04, ease.back);
        vis(d.el, { x: d.x, y: H1 - 34 - (1 - k) * 20, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const lk = es(t, 3.5, 3.6, ease.back);
      vis(lambDish, { x: HX + 4, y: H1 - 34, s: lk * 0.9, o: lk > 0.01 ? 1 : 0 });
      lamps.forEach((l, i) => {
        const lit = es(t, 3.55 + i * 0.06, 3.63 + i * 0.06);
        vis(l.el, { x: l.x, y: H1 - 22, s: 0.7, o: es(t, 3.2, 3.3) });
        pose(l.fl, { x: 35, y: -16, s: lit, sx: lit * (1 + Math.sin(T * 7 + i) * 0.08), sy: lit * (1 + Math.sin(T * 5.3 + i) * 0.1) });
        fade(l.gl, lit * 0.8);
      });

      S.cam.x = kf(t, [[-0.5, -280], [0.9, -280], [1.3, -200], [2.0, 250], [2.9, 290], [3.2, 400], [3.5, S.portrait ? 480 : 440]]);   // phone: a little further, so John upstairs is clear of the thread
      S.cam.z = kf(t, [[-0.5, 1.04], [0.9, 1.1], [1.3, 1.06], [2.0, 1.12], [2.9, 1.14], [3.2, 1.08], [3.5, 1.2]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.9, 40], [2.0, 30], [2.9, 20], [3.2, -30], [3.5, -50]]);
    };
  },
};
