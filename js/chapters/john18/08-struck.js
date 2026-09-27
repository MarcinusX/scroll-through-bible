// J 18,22–24 — the same lamp-lit hall. One of the officers standing by lifts his hand: we see only his shadow on the
// lit wall — a big dark arm swinging up across the screen — and the lamps jolt on their chains; Jesus does not move.
// "Is that how You answer the high priest?" (an angry grey bubble). "If I have spoken evil, testify of the evil": an
// empty scroll hangs between them — nothing written on it. "But if well, why do you beat Me?": a question mark hangs
// over the shadow hand, and the shadow sinks away; the officer lowers his eyes. "Annas sent Him bound to Caiaphas":
// Annas waves his hand, the guards lead Him out across the hall, and a tag points the way — to Caiaphas.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  courtyard, courtIdle, CY, fireCircle, annas, guardOpts, priest, ropeHands, say, question, nameTag, scrollOpen, shadowPerson, shadowHand, leadRope,
  hanging, vis, kf, moving, headAt, hand, withFace, faceBits, person, pose, fade, lerp, mix, sheet, tr, blinkAt, C, JESUS, PI, nt,
} from './lib.js';

const { YARD, HALL, JXH, ANX, HTOP } = CY;
const MID = (JXH + ANX) / 2;
const SH = '#3a2a3e';

export default {
  id: 'j18-struck',
  beats: [
    { v: 22, text: 'Gdy to powiedział, jeden ze sług obok stojących spoliczkował Jezusa,' },
    { v: 22, cont: true, text: 'mówiąc: «Tak odpowiadasz arcykapłanowi?»' },
    { v: 23, text: 'Odrzekł mu Jezus: «Jeżeli źle powiedziałem, udowodnij, co było złego.' },
    { v: 23, cont: true, text: 'A jeżeli dobrze, to dlaczego Mnie bijesz?»' },
    { v: 24 },
  ],
  cam: { x: [300, 720], y: [-160, 40], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const R = courtyard(S);
    // the officer's shadow on the lit wall (shadow play)
    const gOpts = guardOpts(c);
    const shHand = R.shadowL.add(`<g><path d="${c.ribbon([[0, 6], [-40, 90], [-70, 200]], (u) => 20 + u * 10, 3)}" fill="${SH}"/>${shadowHand(c, SH, 2.2)}</g>`);
    const hallL = S.layer({ par: CY.P, sh: 5 });
    const an = S.puppet(hallL.add(annas(c, { pose: 'sit' })));
    const pr = S.puppet(hallL.add(priest(c, 1)));
    const gEl = hallL.add(withFace(person(c, gOpts), faceBits(c)));
    const officer = S.puppet(gEl);
    const gAngry = gEl.querySelector('[data-part="angry"]'), gSad = gEl.querySelector('[data-part="sad"]');
    const g2 = S.puppet(hallL.add(person(c, guardOpts(c))));
    const jEl = hallL.add(withFace(person(c, { ...JESUS, holdF: ropeHands(c) }), faceBits(c)));
    const jesus = S.puppet(jEl);
    const rope = hallL.add(`<g>${leadRope(c)}</g>`);
    R.front();
    const Y = R.yard();
    const yardL = S.layer({ par: CY.P, sh: 5 });
    const F = fireCircle(S, yardL);

    const fx = S.layer({ par: CY.P, sh: 4 });
    const angry = fx.add(`<g>${say(c, tr('Tak odpowiadasz arcykapłanowi?', 'Do you answer the high priest like that?'), { size: 18, side: 1, fill: mix(C.stone2, C.storm, 0.25) })}</g>`);
    const blank = hanging(fx, `<g transform="scale(1.5)"><circle r="60" fill="url(#halo-glow)" opacity=".5"/>${sheet().p(c.cut(c.rect(-50, -28, 100, 56), 0.4, 6), C.parchment).p(c.cut(c.rect(-59, -34, 10, 68), 0.3, 5) + c.cut(c.rect(49, -34, 10, 68), 0.3, 5), C.wood2).out()}</g><g transform="translate(0 56)">${nameTag(c, tr('co było złego?', 'what was evil?'), { size: 15 })}</g>`, { x: 0, y: 0, len: 800 });
    const why = fx.add(`<g transform="scale(1.4)">${question(c)}</g>`);
    const toC = hanging(fx, nameTag(c, tr('do Kajfasza →', 'to Caiaphas →'), { size: 18 }), { x: 0, y: 0, len: 800 });

    return (t, time) => {
      const T = time;
      courtIdle(R, Y, T, 0);
      R.dawn.fade(0);
      F.set(T, { warm: 1 });
      F.peter.p.set({ x: F.peter.x, y: YARD + 12, s: 0.92, flip: false, armF: 74, armB: 48, head: 6, lean: 4, blink: blinkAt(T, 3) });
      // the lamps jolt when the hand goes up
      const jolt = bump(t, 0.35, 0.9);
      R.hallLamps.forEach((l, i) => pose(l.el, { x: l.x, y: l.y, r: Math.sin(t * 22 + i) * jolt * 6 + (T ? Math.sin(T * 0.7 + i) * 0.8 : 0) }));

      /* v22 — the raised hand: only its shadow on the wall */
      const raise = es(t, 0.3, 0.55) * (1 - es(t, 3.3, 3.8));
      const lower = es(t, 3.3, 3.8);
      fade(gAngry, es(t, 0.3, 0.5) * (1 - lower));
      fade(gSad, lower * 0.6);
      const sw = es(t, 0.3, 0.6, ease.out);
      vis(shHand, { x: JXH - 100 + sw * 50, y: HTOP + 330 - sw * 90, r: -40 + sw * 50, s: 1, o: raise * 0.55 });

      /* Jesus — unmoved; then led out, down the steps, towards Caiaphas */
      const path = (d) => [[4.15, [JXH + d, HALL]], [4.98, [JXH + 470 + d, HALL]]];
      const jK = path(0), oK = path(-100), gK = path(110);
      const [jx, jy] = kf(t, jK, ease.sine);
      const [ox, oy] = kf(t, oK, ease.sine);
      const [gx, gy] = kf(t, gK, ease.sine);
      const going = t > 4.15;
      jesus.set({ x: jx, y: jy, s: 1.0, flip: false, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, amt: 0.7, armF: 26, armB: 12 + bump(t, 2.05, 3.9) * 20, head: -bump(t, 2.1, 3.9) * 3, blink: blinkAt(T) });
      fade(jEl.querySelector('[data-part="sad"]'), 0.2);
      officer.set({ x: going ? ox : JXH - 96, y: going ? oy : HALL, s: 0.92, flip: false, walk: moving(t, oK, 1) ? ox * 0.05 : undefined, armF: 16 + bump(t, 1.05, 1.9) * 40, armB: 6 + raise * 40, head: -bump(t, 1.05, 1.9) * 4 + lower * 12, lean: -raise * 2, blink: blinkAt(T, 7) });
      g2.set({ x: going ? gx : JXH + 110, y: going ? gy : HALL, s: 0.92, flip: !going, walk: moving(t, gK, 1) ? gx * 0.05 : undefined, armF: 30, armB: 8, blink: blinkAt(T, 4) });
      const [hx, hy] = hand(jx, jy, 1.0, false, 26);
      const [ghx, ghy] = hand(gx, gy, 0.92, false, 30);
      const tie = es(t, 4.05, 4.2);
      const dx = ghx - hx, dy = ghy - hy;
      vis(rope, { x: hx, y: hy, r: (Math.atan2(dy, dx) * 180) / PI, sx: (Math.hypot(dx, dy) / 100) * tie, sy: 1, o: tie > 0.01 && going ? 1 : 0 });
      const wave = bump(t, 4.05, 4.6);
      an.set({ x: ANX, y: HALL, s: 0.92, flip: true, armF: 30 + wave * 60, armB: 20, head: -bump(t, 1.1, 1.9) * 4, blink: blinkAt(T, 5) });
      pr.set({ x: ANX + 120 - es(t, 4.05, 4.35) * 190, y: HALL - es(t, 4.05, 4.35) * 16, s: 0.88 - es(t, 4.1, 4.4) * 0.05, flip: true, armF: 14, armB: 6, head: 4, blink: blinkAt(T, 9) });

      /* words */
      const [ohx, ohy] = headAt(JXH - 96, HALL, 0.92, false);
      const ak = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(angry, { x: ohx + 14, y: ohy - 20, s: ak, o: ak > 0.01 ? 1 : 0, r: T ? Math.sin(T * 10) * 1.2 * ak : 0 });
      const bk = es(t, 2.1, 2.45, ease.out) * (1 - es(t, 2.9, 3.05, ease.in));
      vis(blank, { x: MID - 20, y: 300 - (1 - bk) * 800, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: bk > 0.01 ? 1 : 0 });
      const wk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(why, { x: JXH - 60, y: HTOP + 150, s: 1.4 * wk, o: wk > 0.01 ? 1 : 0 });
      const ck = es(t, 4.3, 4.6, ease.out);
      vis(toC, { x: JXH + 420, y: 300 - (1 - ck) * 800, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: ck > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 460], [0.5, 380], [1, 380], [2, 520], [3, 480], [4, 480], [5, 700]]);
      S.cam.y = kf(t, [[0, -90], [0.5, -110], [2, -100], [4, -100], [5, -90]]);
      S.cam.z = kf(t, [[0, 1.3], [0.5, 1.42], [1, 1.36], [2, 1.2], [3, 1.3], [4, 1.24], [5, 1.16]]);
    };
  },
};
