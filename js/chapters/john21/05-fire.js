// J 21,9–11 — They step off the boat onto the sand and see it: a charcoal fire glowing on the ground (sparks rise —
// the same kind of fire as on the night of the denial), and on it fish laid out, and bread beside. "Bring some of the
// fish you have just caught." Simon Peter goes and drags the net up the beach, heavy with big fish — and they are
// counted: a card flicks up to 153 as the fish glint one by one. So many — and yet the net is not torn: a thread of
// light runs round its rim, knot by knot.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  beachSet, hungPlate, coalFire, onTheCoals, flatLoaf, FIRE, JFIRE, SEVEN, JESUS, PETER, SUNRISE, MORNING, fullNet, speech, fishIcon, numberCard, sparkle, tick, heart, spark,
  withFace, faceBits, skyKeys, kf, moving, headAt, vis, pose, fade, person, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const GY = 686;                                 // where the disciples stand
const SPOTS = { peter: 910, john: 980, james: 1050, nathanael: 1120, thomas: 1190, other1: 1260, other2: 1330 };
const NET0 = [1230, 650], NET1 = [860, 742];    // the net: at the water's edge → up on the sand (its left end)

export default {
  id: 'j21-fire',
  beats: [
    { v: 9, text: 'A kiedy zeszli na ląd, ujrzeli żarzące się na ziemi węgle,' },
    { v: 9, cont: true, text: 'a na nich ułożoną rybę oraz chleb.' },
    { v: 10 },
    { v: 11, text: 'Poszedł Szymon Piotr i wyciągnął na brzeg sieć pełną wielkich ryb' },
    { v: 11, cont: true, text: 'w liczbie stu pięćdziesięciu trzech.' },
    { v: 11, cont: true, text: 'A pomimo tak wielkiej ilości, sieć się nie rozerwała.' },
  ],
  cam: { x: [-40, 200], y: [0, 160], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const BS = beachSet(S, { skyCols: SUNRISE, sunY: 300 });
    const { K } = BS;

    /* the net on the sand (in front of the people) */
    const PL = S.layer({ par: 0.55, sh: 5 });
    const jesus = S.puppet(PL.add(person(c, JESUS)));
    const M = SEVEN.map((m, i) => ({ ...m, i, x: SPOTS[m.k], seed: c.rr(0, 9) }));
    [...M].sort((a, b) => b.x - a.x).forEach((m) => { m.p = S.puppet(PL.add(withFace(person(c, m.k === 'peter' ? PETER : m.o), faceBits(c)))); });
    const P = M[0];
    const netL = S.layer({ par: 0.62, sh: 4 });
    const net = netL.add(`<g>${fullNet(c, { w: 300, h: 110, n: 40 })}</g>`);
    const fish = Array.from(net.querySelectorAll('.fish'));
    const rope = netL.add(`<path d="M0 0H1" stroke="${C.rope}" stroke-width="3.4" vector-effect="non-scaling-stroke" fill="none"/>`);
    const rim = netL.add(`<path d="${c.ribbon(Array.from({ length: 13 }, (_, i) => { const x = (i / 12) * 300; return [x, -Math.sin((i / 12) * PI) * 8]; }), 3)}" fill="${C.halo}"/>`);
    const knots = [0, 1, 2, 3, 4].map(() => netL.add(`<g>${sparkle(c, 10)}</g>`));

    /* words */
    const fx = S.layer({ par: 0.6, sh: 3 });
    const sparks = Array.from({ length: 6 }, (_, i) => ({ i, a: c.rr(0, 1), dx: c.rr(-40, 40), el: fx.add(`<path d="${c.cut(c.circ(0, 0, 2.6, 6), 0.1, 2)}" fill="${C.lampGlow}"/>`) }));
    const bring = fx.add(`<g>${speech(c, `<g transform="translate(-14 0)">${fishIcon(c, 2, 0.75)}</g><path d="${c.ribbon([[12, 2], [30, 2]], 2.6)}" fill="${C.terracotta}"/><path d="${c.poly([[20, -5], [11, 2], [20, 9]])}" fill="${C.terracotta}"/>`, { w: 90, h: 52, flip: false })}</g>`);
    const count = fx.add(`<g><circle r="90" fill="url(#halo-glow)"/>${numberCard(c, '153', { size: 46 })}</g>`);
    const countTxt = count.querySelector('text');
    const ok = fx.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 26, 20), 0.3, 3), C.cream).out()}<g transform="scale(.8)">${tick(c, 22)}</g></g>`);
    const glowCoal = fx.add(`<g><circle r="140" fill="url(#warm-glow)"/></g>`);
    const platePL = fx.add(hungPlate(c, `<circle r="60" cy="10" fill="url(#warm-glow)"/><g transform="translate(-8 34) scale(1.5)">${coalFire(c, 60).base}${onTheCoals(c)}</g><g transform="translate(40 26)">${flatLoaf(c, 14)}</g><g transform="translate(28 12)">${flatLoaf(c, 12)}</g>`, { r: 74, face: mix(C.dawn, C.peach, 0.4) }));

    return (t, time) => {
      const T = time;
      skyKeys(K.sk, t, [[0, SUNRISE], [6, MORNING]]);
      K.idle(T, { sunY: lerp(300, 250, es(t, 0, 6)) });
      pose(K.sunPath, { x: 1250, y: 450, o: 0.6 });
      BS.idle(T, 0.55 + bump(t, 0.3, 1.2) * 0.4, { fishO: 1, breadO: 1 });

      /* v9a — they come up from the boat and see the coals */
      const see = es(t, 0.45, 0.7);
      const bring1 = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      M.forEach((m) => {
        const a = 0.02 + m.i * 0.05;
        let keys = [[a, m.x + 260], [a + 0.5, m.x]];
        if (m.k === 'peter') keys = [[a, m.x + 260], [a + 0.5, m.x], [3.05, m.x], [3.3, 1250], [3.45, 1250], [3.95, 1180]];
        const x = kf(t, keys);
        const walking = moving(t, keys);
        const isP = m.k === 'peter';
        const hauling = isP ? es(t, 3.4, 3.5) * (1 - es(t, 3.95, 4.05)) : 0;
        const flip = walking ? kf(t + 0.02, keys) < x : isP ? (t > 3.05 && t < 3.45 ? false : true) : true;
        m.p.set({
          x, y: GY + (m.i % 2) * 8, s: 0.9, flip,
          walk: walking ? x * 0.06 : undefined,
          armF: 12 + see * (m.i % 3 === 1 ? 40 : 10) * (1 - es(t, 1.9, 2.1)) + hauling * 80 + (isP ? 0 : bump(t, 4.1, 4.9) * 30), armB: 8 + hauling * 60 + (m.i % 2 ? see * 20 : 0),
          lean: hauling * 12, head: see * 6 * (1 - es(t, 1.9, 2.2)) - (isP ? 0 : es(t, 3.1, 3.4) * 4), blink: blinkAt(T, m.seed),
        });
        m.cx = x;
      });

      /* Jesus beside the fire */
      jesus.set({ x: JFIRE.x, y: JFIRE.y, s: 1.0, flip: false, armF: 16 + bump(t, 0.2, 0.9) * 30 + bring1 * 70 + es(t, 5.1, 5.4) * 30, armB: 10 + bump(t, 1.05, 1.9) * 60 + bring1 * 20, head: bring1 * -4, blink: blinkAt(T) });

      /* glowing coals, sparks rise */
      const coalK = bump(t, 0.3, 1.5);
      pose(glowCoal, { x: FIRE.x, y: FIRE.y - 10, s: 0.8 + coalK * 0.5, o: coalK * 0.6 });
      sparks.forEach((sp) => {
        const k = ((T * 0.45 + sp.a) % 1);
        vis(sp.el, { x: FIRE.x + sp.dx + Math.sin(k * 6 + sp.i) * 10, y: FIRE.y - 30 - k * 170, s: 1 - k * 0.5, o: (1 - k) * (0.4 + coalK * 0.6) });
      });

      const plk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      vis(platePL, { x: FIRE.x + 10, y: lerp(-400, 420, plk), r: T ? Math.sin(T * 0.8) * 1.5 : 0, o: plk > 0.01 ? 1 : 0 });

      /* v10 — "bring some of the fish" */
      const [jx, jy] = headAt(JFIRE.x, JFIRE.y, 1.0, false);
      const bk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.05));
      vis(bring, { x: jx + 24, y: jy - 22, s: bk, o: bk > 0.01 ? 1 : 0 });

      /* v11a — Peter drags the net up the sand */
      const drag = es(t, 3.45, 3.95);
      const nx = lerp(NET0[0], NET1[0], drag), ny = lerp(NET0[1], NET1[1], drag);
      const ns = lerp(0.62, 0.86, drag);
      vis(net, { x: nx, y: ny, s: ns, o: 1 });
      const px = P.cx, [hx, hy] = [px + 30, GY - 90];
      const rk = es(t, 3.3, 3.45) * 1;
      vis(rope, { x: nx, y: ny, sx: Math.hypot(hx - nx, hy - ny), r: Math.atan2(hy - ny, hx - nx) * 180 / PI, o: rk * (1 - es(t, 4.0, 4.1)) });

      /* v11b — counted: 153 */
      const ck = es(t, 4.05, 4.25, ease.back);
      const n = Math.round(lerp(1, 153, es(t, 4.1, 4.6, (u) => u)));
      if (countTxt && countTxt.textContent !== String(n)) countTxt.textContent = String(n);
      vis(count, { x: 1030, y: 450, s: ck * (1 + bump(t, 4.58, 4.75) * 0.15), r: T ? Math.sin(T * 1.2) * 1.5 : 0, o: ck > 0.01 ? 1 - es(t, 5.0, 5.2) * 0.2 : 0 });
      const lit = Math.floor(es(t, 4.1, 4.6, (u) => u) * fish.length);
      fish.forEach((f, i) => { const on = i < lit && t < 5.2 ? 1 : 0; if (f.__on !== on) { f.__on = on; f.style.filter = on ? 'brightness(1.25)' : ''; } });

      /* v11c — the net holds: a thread of light round its rim */
      const hold = es(t, 5.05, 5.5);
      vis(rim, { x: nx, y: ny, s: ns, o: hold * 0.95 });
      knots.forEach((k2, i) => {
        const kk = bump(t, 5.1 + i * 0.08, 5.55 + i * 0.08);
        vis(k2, { x: nx + (30 + i * 60) * ns, y: ny - 4 + (i % 2) * 40 * ns, s: kk * 1.1, r: T * 40, o: kk });
      });
      const okk = es(t, 5.35, 5.55, ease.back);
      vis(ok, { x: 1030, y: 530, s: okk, o: okk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 120], [0.8, 60], [1.2, 20], [1.9, 20], [2.2, 40], [3.1, 110], [4.1, 100], [5, 90], [6, 80]]);
      S.cam.y = kf(t, [[0, 100], [0.8, 120], [1.2, 140], [1.9, 140], [2.2, 120], [3.1, 120], [4.1, 110], [6, 120]]);
      S.cam.z = kf(t, [[0, 1.08], [0.8, 1.14], [1.2, 1.3], [1.9, 1.3], [2.2, 1.14], [3.1, 1.12], [4.1, 1.1], [6, 1.14]]);
    };
  },
};
