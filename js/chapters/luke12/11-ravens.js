// Łk 12,24–26 — a painted flat of a valley with fields. "Consider the ravens": black ravens come flapping in and settle
// on a bare old tree on its rock; "they do not sow, they do not reap": down in the fields a man sows and another reaps,
// and the ravens only sit and look. "They have no cellar or barn, and God feeds them": on the right the farmer's barn
// swallows sack after sack — up in the tree there is only a nest of twigs with three gaping chicks; a shaft of light
// falls on it and berries and grain drop into their beaks. "How much more valuable are you than birds!": a father walks
// by with his little daughter, and a far wider light than the ravens' falls round the two of them; he looks up. "Which of
// you by being anxious can add a moment to his life?": a great hourglass comes down; frowning, he pinches sand from the
// ground and drops it on the glass — it slides off, and the sand inside runs on just the same. "If you cannot do even the
// least, why be anxious about the rest?": grey worry-clouds pile up over him — then they are drawn up on their strings,
// and he lifts his daughter onto his shoulder.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, cloud, rock, grass, flowers, olive } from '../../assets/nature.js';
import { bird, sickle, sheaf, seedPath } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tunic } from '../mark6/lib.js';
import { loaf as loafI, coin as coinI, bowl as bowlI } from '../mark2/lib.js';
import { DAY, wheatRow, barn, flourSack, hourglass, careCloud, heart, halo, warm, beam, flapWings, headAt, hand, kf, PI } from './lib.js';

const GY = 712;
const TREE = [560, 690], NEST = [672, 436];
const FAM = 760;

function deadTree(c) {
  const s = sheet();
  const col = mix(C.wood2, C.rock3, 0.35);
  s.p(c.cut([[-18, 0], [-14, -120], [-30, -210], [-20, -214], [-4, -140], [2, -230], [14, -228], [12, -150], [40, -250], [52, -244], [22, -150], [20, 0]], 0.8, 6), col);
  s.p(c.ribbon([[6, -170], [60, -210], [120, -254]], (u) => 8 - u * 5) + c.ribbon([[-8, -120], [-60, -150], [-100, -150]], (u) => 7 - u * 5) + c.ribbon([[14, -226], [30, -300], [22, -330]], (u) => 6 - u * 4), col);
  return s.out();
}
function nest(c) {
  const s = sheet();
  s.p(c.cut([[-34, -6], [-30, 10], [0, 18], [30, 10], [34, -6], [20, 0], [-20, 0]], 0.8, 4), mix(C.wood2, C.soil, 0.4));
  let tw = '';
  for (let i = 0; i < 7; i++) tw += c.ribbon([[-32 + i * 9, c.rr(-4, 4)], [-20 + i * 9, c.rr(4, 12)]], 1.6);
  s.x(tw, C.wood3, 'opacity=".8"');
  return s.out();
}
function chick(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, 0, 9, 11, 12), 0.3, 3), mix(C.crow, C.storm, 0.3));
  s.p(c.cut([[4, -6], [16, -14], [8, -2], [16, 4], [4, 0]], 0.2, 2), C.ochre);
  s.x(c.poly(c.circ(2, -4, 1.4, 6)), C.cream);
  return s.out();
}

export default {
  id: 'lk12-ravens',
  enter: 'fly',
  beats: [
    { v: 24, text: 'Przypatrzcie się krukom: nie sieją ani żną;' },
    { v: 24, cont: true, text: 'nie mają piwnic ani spichlerzy, a Bóg je żywi.' },
    { v: 24, cont: true, text: 'O ileż ważniejsi jesteście wy niż ptaki!' },
    { v: 25 },
    { v: 26 },
  ],
  cam: { x: [-80, 120], y: [-60, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 900, y: 140, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [16, 7, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup);
    const fields = S.layer({ par: 0.2, sh: 3 });
    const hw = hillsWith(c, { y: 520, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 10, treeColor: C.sage, treeH: 18 });
    const f = sheet();
    const pl = (x) => 588 + Math.sin(x * 0.01) * 5;
    f.p(c.cut([[600, pl(600)], ...Array.from({ length: 12 }, (_, i) => { const x = 620 + i * 32; return [x, pl(x)]; }), [1000, 590], [1010, 700], [590, 700]], 0.8, 10), mix(C.soil, C.sand2, 0.45));
    let furrows = '';
    for (let y = 600; y < 700; y += 14) furrows += c.ribbon([[610, y], [1000, y + 2]], 1.6);
    f.x(furrows, shade(C.soil, -0.2), 'opacity=".5"');
    fields.add(hw.markup + f.out());
    fields.add(wheatRow(c, 604, { x0: 990, x1: 1500, h: 44 }) + wheatRow(c, 640, { x0: 980, x1: 1500, h: 50 }));
    const barnL = S.layer({ par: 0.26, sh: 4 });
    const B = barn(c, { w: 190, h: 140 });
    barnL.add(`<g transform="translate(1180 640)">${B.body}</g>`);
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(690, [4, 2], [600, 180]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4)).out() + rock(c, TREE[0], TREE[1] + 12, 190, 60, C.rock2) + grass(c, { x0: -800, x1: 2400, y: 690, fn: gfn, n: 40, h: 12, color: C.moss }) + flowers(c, { x0: 620, x1: 1400, y: 700, fn: gfn, n: 12 }));
    G.add(`<g transform="translate(${TREE[0]} ${TREE[1] - 20})">${deadTree(c)}</g>`);
    G.add(`<g transform="translate(${NEST[0]} ${NEST[1]})">${nest(c)}</g>`);

    /* the workers in the fields */
    const W = S.layer({ par: 0.26, sh: 4 });
    const sower = S.puppet(W.add(person(c, { robe: C.linen2, hair: C.hair2, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3, belt: C.rope })));
    const reaper = S.puppet(W.add(person(c, { robe: C.sageRobe, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.rope, holdF: `<g transform="translate(4 0) rotate(-30) scale(.7)">${sickle(c)}</g>` })));
    const carrier = S.puppet(W.add(person(c, { robe: C.dustyBlue, hair: C.hair, hairStyle: 'curly', beard: 'none', skin: C.skin2, belt: C.leather })));
    const sack = W.add(`<g>${flourSack(c, 34, 40)}</g>`);
    const seeds = [0, 1, 2, 3].map(() => W.add(`<g opacity="0"><path d="${seedPath(c, 0, 0, 2.6, 0.5)}" fill="${C.wheat2}"/></g>`));
    const sheaves = [0, 1].map((i) => W.add(`<g opacity="0">${sheaf(c, 50)}</g>`));

    /* the light for the nest, the chicks, the ravens, the food */
    const lightL = S.layer({ par: 0.4, sh: 0, flat: true });
    const nestBeam = lightL.add(`<g opacity="0">${beam(c, 20, 90, 700)}<g transform="translate(0 700)">${warm(90, 0.9)}</g></g>`);
    const famBeam = lightL.add(`<g opacity="0">${beam(c, 40, 130, 620)}</g>`);
    const B2 = S.layer({ par: 0.4, sh: 5 });
    const chicks = [-16, 0, 16].map((dx, i) => ({ i, dx, el: B2.add(`<g>${chick(c)}</g>`) }));
    const ravens = [0, 1, 2].map((i) => ({ i, el: B2.add(bird(c, { color: C.crow, belly: shade(C.crow, 0.25) })), perch: [[490, 404], [616, 470], [530, 540]][i], from: [[-200, 200], [-300, 120], [-160, 300]][i] }));
    const food = [0, 1, 2, 3, 4].map((i) => B2.add(`<g opacity="0"><path d="${c.cut(c.circ(0, 0, 4.5, 8), 0.2, 2)}" fill="${i % 2 ? C.plumRobe : C.wheat2}"/></g>`));

    /* the father and his daughter */
    const P = S.layer({ par: 0.45, sh: 5 });
    const father = S.puppet(P.add(person(c, { robe: C.tealRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather })));
    const girl = S.puppet(P.add(person(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.12), hair: C.hair2, skin: C.skin2, beard: 'none', belt: C.ochre })));
    const love = P.add(`<g opacity="0">${heart(c, 12)}</g>`);
    const fx = S.layer({ par: 0.3, sh: 6 });
    const glass = fx.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-72" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${hourglass(c, 120)}</g>`);
    const sandT = glass.querySelector('.sandT'), sandB = glass.querySelector('.sandB');
    const pinch = fx.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 6, 4, 8, 0.3), 0.3, 2)}" fill="${C.wheat2}"/></g>`);
    const ICONS = [`<g transform="translate(0 6)">${loafI(c, 13)}</g>`, `<g transform="translate(0 4) scale(.56)">${tunic(c)}</g>`, `<g transform="translate(0 8)">${coinI(c, 8)}</g>`, `<g transform="translate(0 8) scale(.8)">${bowlI(c, { w: 28 })}</g>`];
    const clouds = [0, 1, 2, 3].map((i) => fx.add(`<g opacity="0">${careCloud(c, ICONS[i], 76 + i * 6)}</g>`));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1240, 150, T, 1, 0.6);
      swing(cl, 900 + Math.sin(T * 0.1) * 20, 140, T, 1.2, 0.6, 1);
      /* v24a — the ravens come; men sow and reap below */
      ravens.forEach((r) => {
        const k = es(t, 0.05 + r.i * 0.1, 0.45 + r.i * 0.1);
        const [px, py] = r.perch, [fx0, fy0] = r.from;
        const x = lerp(fx0, px, k), y = lerp(fy0, py, k) - Math.sin(k * PI) * 60;
        const peck = r.i === 1 ? bump(t, 1.55, 1.8) : 0;
        pose(r.el, { x, y: y + peck * 10, s: 1.2, r: peck * 30, sx: 1, o: 1 });
        flapWings(r.el, k < 1 ? T * 1.2 + t * 20 + r.i : 0, k < 1 ? 30 : 4, 8);
      });
      const sw = t * 9;
      sower.set({ x: 760 + es(t, 0, 2, (u) => u) * 80, y: 650, s: 0.62, walk: sw, armF: 40 + Math.sin(sw) * 50, armB: 10, blink: blinkAt(T, 1) });
      seeds.forEach((sd, i) => { const k = (t * 2.2 + i / 4) % 1; const [hx, hy] = hand(760 + es(t, 0, 2, (u) => u) * 80, 650, 0.62, false, 60); pose(sd, { x: hx + k * 40, y: hy + k * 50, o: (1 - k) * (1 - es(t, 2.0, 2.2)) }); });
      const swing2 = Math.sin(t * 9);
      reaper.set({ x: 1060, y: 656, s: 0.62, armF: 60 + swing2 * 40, armB: 20, lean: 12, head: 10, blink: blinkAt(T, 2) });
      sheaves.forEach((s, i) => pose(s, { x: 1110 + i * 34, y: 660, s: es(t, 0.3 + i * 0.2, 0.5 + i * 0.2, ease.back) * 0.8, o: es(t, 0.3 + i * 0.2, 0.32 + i * 0.2) }));

      /* v24b — no barn: God feeds them */
      const carry = es(t, 1.02, 1.5, (u) => u);
      const cx = lerp(1060, 1170, carry);
      carrier.set({ x: cx, y: 646, s: 0.62, walk: carry > 0 && carry < 1 ? cx * 0.08 : undefined, o: seg(t, 0.95, 1.0) * (1 - es(t, 1.45, 1.52)), armF: 90, armB: 110, blink: blinkAt(T, 3) });
      const [chx, chy] = headAt(cx, 646, 0.62, false);
      pose(sack, { x: chx, y: chy - 4, s: 0.9, o: seg(t, 0.95, 1.0) * (1 - es(t, 1.45, 1.52)) });
      const nb = es(t, 1.4, 1.6) * (1 - es(t, 2.05, 2.3));
      pose(nestBeam, { x: NEST[0], y: NEST[1] + 10 - 700, o: nb });
      chicks.forEach((ch) => { const gape = bump(t, 1.2 + ch.i * 0.05, 1.9 + ch.i * 0.04); pose(ch.el, { x: NEST[0] + ch.dx, y: NEST[1] - 8 - gape * 6, r: -gape * 20, s: 1.1 }); });
      food.forEach((fd, i) => { const k = seg(t, 1.45 + i * 0.06, 1.7 + i * 0.06); pose(fd, { x: NEST[0] - 16 + (i % 3) * 16, y: lerp(NEST[1] - 200, NEST[1] - 14, k), o: k > 0 && k < 1 ? 1 : 0 }); });

      /* v24c — worth far more than birds */
      const walk = es(t, 1.9, 2.3);
      const fx1 = lerp(1200, FAM, walk);
      const look = es(t, 2.3, 2.5);
      const fret = es(t, 3.05, 3.25) * (1 - es(t, 4.4, 4.6));
      const lift = es(t, 4.7, 4.95);
      const pinchA = bump(t, 3.35, 3.85);
      father.set({ x: fx1, y: GY, s: 1.0, flip: t < 3.0 || t > 4.5, o: seg(t, 1.88, 1.92), walk: walk > 0 && walk < 1 ? fx1 * 0.05 : undefined, armF: 20 + pinchA * 110 + lift * 60, armB: 10 + fret * 110 * (1 - lift) + lift * 100, head: -look * 14 * (1 - fret) + fret * 12 - lift * 6, blink: blinkAt(T, 4) });
      const gx = lerp(fx1 - 70, fx1 - 20, lift), gy = lerp(GY + 6, GY - 150, lift);
      girl.set({ x: gx, y: gy, s: 0.6, flip: true, o: seg(t, 1.88, 1.92), walk: walk > 0 && walk < 1 ? fx1 * 0.07 : undefined, armF: 20 + look * 60 + lift * 60, armB: 10 + lift * 120, head: -look * 16, blink: blinkAt(T, 5) });
      const fb = es(t, 2.2, 2.45) * (1 - es(t, 2.95, 3.1));
      pose(famBeam, { x: fx1 - 30, y: GY - 210 - 620, o: fb * 0.9 });
      const [fhx, fhy] = headAt(fx1, GY, 1.0, true);
      const hk = es(t, 2.4, 2.6, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(love, { x: fhx - 40, y: fhy - 60, s: hk, o: hk > 0.01 ? 1 : 0 });

      /* v25 — can anxiety add a moment to his life? */
      const gk = es(t, 3.02, 3.3, ease.out) * (1 - es(t, 4.3, 4.6, ease.in));
      const GX = FAM + 170, GY2 = 380;
      pose(glass, { x: GX, y: lerp(-1500, GY2, gk), r: time ? Math.sin(T * 0.7) * 1 : 0, oy: 0, o: gk > 0.01 ? 1 : 0 });
      const run = es(t, 3.0, 5.0, (u) => u);
      pose(sandT, { x: 0, y: -3, sy: Math.max(0.05, 1 - run * 0.7) });
      pose(sandB, { x: 0, y: 60, sy: 0.4 + run * 0.9 });
      const pk = seg(t, 3.5, 3.95);
      const [phx, phy] = hand(FAM, GY, 1.0, false, 130);
      pose(pinch, { x: lerp(phx, GX + 10, Math.min(1, pk * 1.6)) + (pk > 0.62 ? (pk - 0.62) * 120 : 0), y: lerp(phy, GY2 - 70, Math.min(1, pk * 1.6)) + (pk > 0.62 ? (pk - 0.62) * 320 : 0), o: pk > 0 && pk < 1 ? 1 : 0 });

      /* v26 — the least, and the rest */
      clouds.forEach((cl2, i) => {
        const k = es(t, 4.02 + i * 0.06, 4.22 + i * 0.06, ease.back);
        const up = es(t, 4.6 + i * 0.03, 4.98, ease.in);
        pose(cl2, { x: fhx + [-80, 40, -30, 90][i], y: fhy - 80 - i * 40 - up * 700, s: k, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, -60], [1.0, -40], [1.3, 60], [1.95, 0], [2.3, 0], [3.0, -20]]);
      S.cam.y = kf(t, [[-0.5, -20], [1.0, -20], [1.3, -30], [1.9, 0], [3.0, 10], [3.3, -20], [4.0, -40]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [1.0, 1.1], [1.3, 1.08], [2.3, 1.1], [3.0, 1.06]]);
    };
  },
};
