// Mt 11,2 — dusk over the fortress of Machaerus. John stands in his cell behind the barred window. Two of his
// disciples come to the wall and tell him what Christ is doing: a cloud of little pictures rises from them (an eye
// that opens, a crutch thrown away, a leper made clean) and drifts in through the bars. John lifts his head, grips
// the bars — then he points out along the road: a small "?" comes down to the first disciple's hand, and the two
// of them bow and set off along the road with John's question.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, rock } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { PRISON, JOHN_B, JD, prisonWall, bars, crutch, eyeGlyph, sparkle, question, headAt, kf, moving, scrub, PI } from './lib.js';

const GY = 748;
const WX = 800, WY = 400, WW = 250, WH = 210;   // the window (centre, size)
const JY = 610, JS = 1.3;                        // John's feet (behind the wall) and scale

export default {
  id: 'mt11-prison',
  beats: [
    { v: 2 },
  ],
  cam: { x: [-20, 280], y: [-180, 40], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    sky(S, PRISON);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 1330, y: 330, len: 900 });
    const cl = hanging(hangL, cloud(c, 160, mix(C.cream, C.dusk, 0.3), mix(C.dusk, C.duskViolet, 0.3)), { x: 250, y: 220, len: 900 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 500, amps: [26, 10, 3], lens: [900, 330, 120], color: mix(C.duskViolet, C.dune, 0.4) }).markup);
    S.layer({ par: 0.16, sh: 3 }).add(band(c, { y: 580, amps: [16, 6, 2], lens: [800, 300, 110], color: mix(C.dune, C.clay, 0.3) }).markup + scrub(c, 150, 596, 24) + scrub(c, 1500, 600, 28));

    /* the cell behind the window, and John in it */
    const cell = S.layer({ par: 0.4, sh: 2 });
    cell.add(sheet().p(c.cut(c.rect(WX - WW / 2 - 20, WY - WH / 2 - 20, WW + 40, WH + 60), 0.4, 8), mix(C.soilDark, C.plumRobe, 0.3)).out());
    const patch = cell.add(`<g><path d="${c.poly([[WX - 110, WY - 110], [WX - 40, WY - 110], [WX + 60, WY + 130], [WX - 20, WY + 130]])}" fill="#f7e2a6" opacity=".16"/></g>`);
    const jL = S.layer({ par: 0.4, sh: 4 });
    const hope = jL.add(`<circle r="110" fill="url(#warm-glow)" opacity="0"/>`);
    const john = S.puppet(jL.add(person(c, { ...JOHN_B })));

    /* the fortress wall */
    const wallL = S.layer({ par: 0.4, sh: 5 });
    const W = sheet();
    const top = 240, X0 = 430, X1 = 1170;
    let cren = '';
    for (let x = X0; x < X1 - 10; x += 50) cren += c.cut(c.rect(x, top - 34, 30, 40), 0.5, 6);
    W.p(cren, mix(C.stone2, C.dune, 0.25));
    wallL.add(W.out());
    wallL.add(`<g transform="translate(${(X0 + X1) / 2} ${top + 300})">${prisonWall(c, { w: X1 - X0, h: 600, win: { x: WX - (X0 + X1) / 2, y: WY - top - 300, w: WW, h: WH } })}</g>`);
    // a tower on the left
    const T = sheet();
    const tw = mix(C.stone2, C.dune, 0.3);
    T.p(c.cut(c.rect(250, 150, 190, 700), 0.8, 12), tw);
    let tc = '';
    for (let x = 244; x < 440; x += 44) tc += c.cut(c.rect(x, 116, 26, 40), 0.4, 5);
    T.p(tc, tw);
    let tb = '';
    for (let y = 170; y < 740; y += 44) for (let x = 256 + (Math.round(y / 44) % 2) * 30; x < 430; x += 62) tb += c.cut(c.rect(x, y, 54, 36), 0.6, 8);
    T.x(tb, shade(tw, 0.12), 'opacity=".7"');
    T.p(c.cut([[325, 330], [325, 280], ...c.arc(345, 280, 20, 18, PI, 2 * PI, 8), [365, 330]], 0.3, 4), mix(C.soilDark, C.plumRobe, 0.3));
    wallL.add(T.out());
    wallL.add(`<g transform="translate(${WX} ${WY + WH / 2})">${bars(c, WW, WH, 5)}</g>`);

    /* the ground and the road in front */
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(GY - 20, [3, 1.5], [600, 170]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.dune, 0.35)).p(c.ribbon([[300, 790], [800, 780], [1300, 776], [2500, 770]], 50, 2), mix(C.sand, C.cream, 0.3)).out());
    G.add(rock(c, 330, GY + 10, 90, 30, C.rock2) + scrub(c, 470, GY - 6, 22));

    /* the two disciples */
    const act = S.layer({ par: 0.45, sh: 5 });
    const dis = JD.map((o, i) => ({ i, p: S.puppet(act.add(person(c, o))), seed: c.rr(0, 9) }));

    /* the works of Christ: a cloud of pictures that drifts in; John's question */
    const fx = S.layer({ par: 0.42, sh: 4 });
    const cloudPts = [];
    for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; cloudPts.push(...c.arc(Math.cos(a) * 118, Math.sin(a) * 62, 34, 30, a - 1.1, a + 1.1, 5)); }
    const news = fx.add(`<g>${sheet().p(c.cut(cloudPts, 0.6, 6), C.cream).p(c.cut(c.circ(40, 90, 13, 12), 0.3, 4) + c.cut(c.circ(66, 116, 8, 10), 0.3, 3), C.cream).out()}<g transform="translate(-78 0)">${eyeGlyph(c, 24)}</g><g transform="translate(4 -44) rotate(38) scale(.62)">${crutch(c)}</g><g transform="translate(84 -6)">${sparkle(c, 24, C.halo)}</g></g>`);
    const q = fx.add(`<g>${question(c)}</g>`);

    return (t, time) => {
      const T_ = time;
      pose(sunEl, { x: 1330, y: 330, r: T_ ? Math.sin(T_ * 0.6) : 0 });
      pose(cl, { x: 250 + (T_ ? Math.sin(T_ * 0.1) * 20 : 0), y: 220, r: T_ ? Math.sin(T_ * 0.6 + 1) : 0 });

      /* the disciples come to the wall, tell him, then go */
      const tellK = bump(t, 0.12, 0.42);
      const bow = bump(t, 0.6, 0.72);
      dis.forEach((d) => {
        const KX = d.i === 0 ? [[-0.2, 1300], [0.12, 1000], [0.62, 1000], [0.95, 1500]] : [[-0.2, 1400], [0.14, 880], [0.64, 880], [0.97, 1400]];
        const x = kf(t, KX);
        const leaving = t > 0.64;
        d.p.set({
          x, y: GY + d.i * 8, s: d.i ? 1.06 : 1.1, flip: !leaving, walk: moving(t, KX) ? x * 0.05 + d.i : undefined,
          armF: d.i === 0 ? 30 + tellK * 80 + (leaving ? 70 : 0) : 20 + tellK * 50, armB: d.i === 0 ? 10 + tellK * 110 : 10 + tellK * 30,
          head: -18 * (1 - es(t, 0.6, 0.66)) + bow * 16, lean: bow * 10, blink: blinkAt(T_, d.seed),
        });
      });
      // the pictures rise from them and drift in through the bars
      const up = es(t, 0.14, 0.34, ease.out), inK = es(t, 0.38, 0.52);
      pose(news, { x: lerp(1000, WX + 40, inK), y: lerp(560, 250, up) + inK * 90, s: (0.3 + up * 0.7) * (1 - inK * 0.75), r: T_ ? Math.sin(T_ * 1.2) * 2 : 0, o: up > 0.01 ? 1 - seg(inK, 0.7, 1) : 0 });

      /* John hears: he lifts his head and grips the bars; then points out along the road */
      const hear = es(t, 0.34, 0.5);
      const send = es(t, 0.5, 0.6) * (1 - es(t, 0.88, 0.98) * 0.5);
      john.set({ x: WX - 10, y: JY, s: JS, armF: 20 + hear * 50 + send * 20, armB: 10 + send * 60, head: 14 - hear * 22 - send * 4, lean: -hear * 4, blink: blinkAt(T_, 2) });
      pose(hope, { x: WX, y: WY - 10, s: 0.8 + hear * 0.5, o: hear * 0.8 });
      pose(patch, { o: 0.4 + hear * 0.6 });
      // the question goes with them
      const qk = es(t, 0.54, 0.64, ease.back);
      const dx0 = kf(t, [[-0.2, 1300], [0.12, 1000], [0.62, 1000], [0.95, 1500]]);
      const [qx, qy] = headAt(dx0, GY, 1.1, true);
      const follow = es(t, 0.62, 0.66);
      pose(q, { x: lerp(WX + 70, qx + 30, follow), y: lerp(WY - 70, qy - 70, follow), s: qk * 1.1, r: T_ ? Math.sin(T_ * 2) * 6 : 0, o: qk > 0.02 ? 1 : 0 });

      S.cam.z = 1.3 + es(t, 0.2, 0.45) * 0.2 - es(t, 0.6, 0.85) * 0.2;
      S.cam.y = -40 - es(t, 0.2, 0.45) * 50 + es(t, 0.6, 0.85) * 70;
      S.cam.x = es(t, 0.62, 0.95) * 260;
    };
  },
};
