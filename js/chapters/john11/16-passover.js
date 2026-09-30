// J 11,55–57 — the Temple court. "The Passover of the Jews was near": a round plate with the Passover lamb comes down
// and a nearly full moon rises in the afternoon sky. Pilgrims come up from the country to purify themselves: at a
// stone basin one pours water over his hands, drops fall, rings spread. They look for Jesus, turning this way and that
// in the court, a small portrait of Him with a question mark drifting over their heads — "What do you think? Will He
// not come to the feast?" Two of them shrug to each other. Then a priest, with a guard beside him, nails up the chief
// priests' order on a pillar — anyone who knows where He is must report it; the light cools, and the chapter closes.
import { C, person, crowdPerson, blinkAt, hanging } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { moon } from '../../assets/nature.js';
import { courtFront, portico } from '../mark11/lib.js';
import { guardOpts, priest as priest14 } from '../mark14/lib.js';
import { templeCourt, lamb, notice, medallion, question, hungPlate, hungWord, speech, ripple, CAST, vis, kf, moving, hand, pose, attr, sheet, shade, mix, lerp, tr, PI } from './lib.js';

const F = 712;

/** a stone washing basin on a pedestal (origin: foot) */
function basin(c) {
  const s = sheet();
  s.p(c.cut([[-18, 0], [-12, -60], [12, -60], [18, 0]], 0.4, 6), C.stone2);
  s.p(c.cut([[-70, -62], [70, -62], [58, -92], [-58, -92]].reverse(), 0.5, 8), C.stone);
  s.p(c.cut(c.ell(0, -92, 60, 9, 18), 0.4, 6), mix(C.lake, C.skyBlue, 0.4));
  return s.out();
}

export default {
  id: 'j11-passover',
  beats: [
    { v: 55, text: 'A była blisko Pascha żydowska.' },
    { v: 55, cont: true, text: 'Wielu przed Paschą udawało się z tej okolicy do Jerozolimy, aby się oczyścić.' },
    { v: 56, text: 'Oni więc szukali Jezusa i gdy stanęli w świątyni, mówili jeden do drugiego:' },
    { v: 56, cont: true, text: '«Cóż wam się zdaje? Czyżby nie miał przyjść na święto?»' },
    { v: 57 },
  ],
  cam: { x: [-210, 210], y: [-80, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const SKY = ['#cfe0dc', '#eee6cc', '#f6ead2'], DUSKC = ['#7d7aa6', '#d7a893', '#efc7a1'];
    const T0 = templeCourt(S, { skyCols: SKY, floorY: 660, sunAt: [1230, 170] });
    const moonEl = hanging(T0.hangL, moon(c, 26), { x: 560, y: 300, len: 500 });
    // a pillar for the notice (left) and the basin (right)
    const propL = S.layer({ par: 0.46, sh: 4 });
    propL.add(`<g transform="translate(470 ${F + 6})">${sheet().p(c.cut([[-34, 0], [-30, -330], [30, -330], [34, 0]], 0.5, 10), mix(C.stone, C.cream, 0.3)).p(c.cut(c.rect(-46, -350, 92, 22), 0.4, 8), C.stone2).p(c.cut(c.rect(-44, -12, 88, 14), 0.4, 8), C.stone2).out()}</g>`);
    propL.add(`<g transform="translate(1110 ${F + 6})">${basin(c)}</g>`);
    const drops = [0, 1, 2, 3].map(() => propL.add(`<g><path d="${c.cut([[0, -5], [3, 1], [2, 4], [-2, 4], [-3, 1]], 0.1, 2)}" fill="${C.lake2}"/></g>`));
    const rip = propL.add(`<g>${ripple(c, 30, C.foam, 2.4)}</g>`);
    const note = propL.add(`<g>${notice(c)}</g>`);

    const A = S.layer({ par: 0.52, sh: 5 });
    const PIL = [
      { x: 1040, from: 1600, y: F + 4, f: 1 }, { x: 900, from: 1680, y: F + 16, f: 1 }, { x: 760, from: -100, y: F + 8, f: 0 },
      { x: 640, from: -180, y: F + 18, f: 0 }, { x: 830, from: 1760, y: F - 4, f: 1 }, { x: 700, from: -260, y: F - 2, f: 0 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(A.add(person(c, { ...crowdPerson(c), hairStyle: i % 3 === 2 ? 'veil' : 'wrap', beard: i % 3 === 2 ? 'none' : 'short', veil: [C.linen2, C.stone, C.skyVeil][i % 3], holdB: '' }))) }));
    const washer = S.puppet(A.add(person(c, { ...crowdPerson(c), hairStyle: 'short', beard: 'full', mantle: null, holdF: `<g transform="rotate(150) translate(0 -8)"><path d="${c.cut([[-8, -14], [8, -14], [10, 4], [6, 10], [-6, 10], [-10, 4]], 0.3, 4)}" fill="${C.pot}"/></g>` })));
    const pr = S.puppet(A.add(priest14(c, 1)));
    const guard = S.puppet(A.add(person(c, guardOpts(c))));
    courtFront(S, { xs: [200, 1400] });

    const X = S.layer({ par: 0.6, sh: 6 });
    const pesach = X.add(`<g>${hungPlate(c, `<g transform="translate(-2 24) scale(.9)">${lamb(c)}</g>`, { r: 60 })}</g>`);
    const pesT = X.add(hungWord(c, tr('Pascha', 'the Passover'), { size: 24 }));
    const clean = X.add(hungWord(c, tr('aby się oczyścić', 'to purify themselves'), { size: 20 }));
    const seek = X.add(`<g><circle r="46" fill="url(#halo-glow)"/>${medallion(c, CAST.jesus, { r: 26, rim: C.haloRim, back: C.halo })}<g transform="translate(34 -30) scale(.7)">${question(c)}</g></g>`);
    const q1 = X.add(`<g>${speech(c, `<g transform="scale(.7)">${question(c)}</g>`, { w: 56, h: 46 })}</g>`);
    const q2 = X.add(`<g>${speech(c, `<g transform="translate(-4 0) scale(.5)">${lamb(c)}</g><g transform="translate(16 -4) scale(.5)">${question(c)}</g>`, { w: 80, h: 50, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      const dusk = es(t, 4.0, 4.9);
      T0.sk.blend(SKY, DUSKC, dusk * 0.8);
      pose(T0.sunEl, { x: 1230, y: 170 + dusk * 140, r: Math.sin(T * 0.6) * 1.5 });
      pose(T0.cl1, { x: 470 + Math.sin(T * 0.1) * 20, y: 140, r: 0 });

      /* v55a — the Passover near: the lamb, a nearly full moon */
      const pk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 0.95, 1.15));
      vis(pesach, { x: 800, y: 290 - (1 - pk) * 480, r: Math.sin(T * 0.8) * 1.5, o: pk > 0.01 ? 1 : 0 });
      vis(pesT, { x: 800, y: 390 - (1 - pk) * 480, r: Math.sin(T * 0.7 + 1) * 1.2, o: pk > 0.01 ? 1 : 0 });
      const mk = es(t, 0.2, 0.8, ease.out);
      pose(moonEl, { x: 560, y: 300 - mk * 90, r: Math.sin(T * 0.6) * 1.5, o: mk });

      /* v55b — pilgrims come up and purify themselves */
      PIL.forEach((m) => {
        const K = [[1.0 + m.i * 0.06, m.from], [1.6 + m.i * 0.06, m.x]];
        const x = kf(t, K, ease.out);
        const look = es(t, 2.05 + m.i * 0.04, 2.3 + m.i * 0.04) * (1 - es(t, 4.05, 4.3));
        const turnAround = look > 0.2 && Math.sin(T * 0.7 + m.i * 1.3) > 0.4;
        const talk = m.i === 1 || m.i === 2 ? es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.1)) : 0;
        const toNote = es(t, 4.35, 4.7);
        m.p.set({ x, y: m.y, s: 0.92, flip: t < 1.7 ? m.f === 1 : m.i === 2 ? talk > 0.5 ? false : turnAround ? !m.f : !!m.f : (toNote > 0.5 ? true : turnAround ? !m.f : !!m.f), walk: moving(t, K) ? x * 0.1 : undefined, armF: 12 + look * 30 + talk * 50, armB: 8 + look * 20 + talk * 40, head: -look * 8 + toNote * 4, blink: blinkAt(T, m.i + 3), o: t > 1.0 ? 1 : 0 });
      });
      const wk = es(t, 1.2, 1.5);
      washer.set({ x: 1180, y: F + 10, s: 0.92, flip: true, armF: 40 + wk * 60, armB: 30 + wk * 40, lean: -wk * 8, head: 8, blink: blinkAt(T, 2), o: 1 });
      const pour = wk * (1 - es(t, 2.1, 2.3));
      const [hx, hy] = hand(1180, F + 10, 0.92, true, 40 + wk * 60, -wk * 8);
      drops.forEach((d, i) => {
        const u = T ? (T * 1.3 + i / 4) % 1 : (i + 0.5) / 4;
        vis(d, { x: hx - 6 + Math.sin(i) * 3, y: hy + 10 + u * 60, o: pour * (1 - u) });
      });
      vis(rip, { x: 1106, y: F + 6 - 92, s: 0.6 + ((T * 0.8) % 1) * 1.2, o: pour * (1 - ((T * 0.8) % 1)) });
      const ck = es(t, 1.15, 1.45, ease.back) * (1 - es(t, 1.95, 2.15));
      vis(clean, { x: 1100, y: 380 - (1 - ck) * 420, r: Math.sin(T * 0.8) * 1.2, o: ck > 0.01 ? 1 : 0 });

      /* v56 — they seek Him in the Temple */
      const sk = es(t, 2.15, 2.45, ease.back) * (1 - es(t, 3.95, 4.15));
      vis(seek, { x: 820 + Math.sin(T * 0.5) * 60, y: 380 + Math.sin(T * 0.9) * 10, s: sk, o: sk > 0.01 ? 1 : 0 });
      const b1 = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.95, 4.1)), b2 = es(t, 3.35, 3.55, ease.back) * (1 - es(t, 3.95, 4.1));
      vis(q1, { x: 900 - 20, y: F + 16 - 205, s: b1, o: b1 > 0.01 ? 1 : 0 });
      vis(q2, { x: 760 + 20, y: F + 8 - 205, s: b2, o: b2 > 0.01 ? 1 : 0 });

      /* v57 — the order is posted */
      const PK = [[4.0, 180], [4.35, 540]];
      const px = kf(t, PK, ease.out);
      const nail = es(t, 4.4, 4.6);
      pr.set({ x: px, y: F + 10, s: 0.96, flip: t > 4.4, walk: moving(t, PK) ? px * 0.1 : undefined, armF: 14 + nail * 90 * (1 - es(t, 4.75, 4.9)) + es(t, 4.8, 5) * 40, armB: 8 + bump(t, 4.45, 4.75) * 60, head: -nail * 6, blink: blinkAt(T, 5), o: t > 3.95 ? 1 : 0 });
      const GK = [[4.05, 120], [4.45, 390]];
      const gx = kf(t, GK, ease.out);
      guard.set({ x: gx, y: F + 4, s: 0.94, walk: moving(t, GK) ? gx * 0.1 : undefined, armF: 12, head: 4, blink: blinkAt(T, 6), o: t > 4.0 ? 1 : 0 });
      vis(note, { x: 470, y: lerp(F - 300, F - 280, nail), r: -2 + (1 - nail) * 6, o: nail > 0.01 ? 1 : 0 });

      // phone: pan to the basin for v55b and to the pillar with the order for v57
      S.cam.x = S.portrait ? kf(t, [[0, 0], [1, 0], [1.5, 200], [2, 200], [2.5, 20], [3, 0], [4, 0], [4.6, -200], [5, -200]])
        : kf(t, [[0, 0], [1, 0], [1.6, 60], [2, 20], [3, 0], [4, 0], [5, -60]]);
      S.cam.y = kf(t, [[0, -60], [1, -40], [2, -10], [3, 0], [4, -10], [5, -20]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.02], [3, 1.06], [4, 1.02], [5, 1.12]]);
    };
  },
};
