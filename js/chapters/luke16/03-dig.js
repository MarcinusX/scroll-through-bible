// Łk 16,3–4 — the same court, later in the morning; the master has gone in. "The manager said to himself: What shall
// I do, now that my master is taking the management from me?": he stands alone by the garden bed, a hand to his
// chin, and a thought cloud rises over him: the key of the house, struck through, and a question. "I am not strong
// enough to dig; I am ashamed to beg": he takes up the gardener's mattock and strikes the bed once — and doubles over
// with his hand at his back, and lets it fall; then he sees the beggar sitting in the gateway with his bowl, half
// holds out his own hand — and hides his face in his arm. "I know what I will do, so that when I am removed from
// management, people will receive me into their houses": he straightens up with his hand raised — a little flame of
// an idea over his head — and the cloud shows a row of houses with their doors open and their owners beckoning him in.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { estateSet, ES, thought, bigKey, crossX, qMark, mattock, beggarBowl, handAt, headAt, kf, moving, tr, es, ease, bump, seg, PI, STEWARD } from './lib.js';
import { BEGGAR } from '../matthew6/lib.js';
import { house } from '../../assets/nature.js';

const GY = ES.GY;
const SX = 740;                          // where he stands, by the garden bed
const BX = 496;                          // the beggar in the gateway
const MX = 730;                          // where the mattock lies in the bed
const DX = MX - 135;                     // where he stands to dig

/** the idea: a row of little houses with open doors and their owners beckoning (thought coords) */
function welcomeRow(c) {
  let m = '';
  [-40, 0, 40].forEach((x, i) => {
    const s = sheet();
    s.p(c.cut(c.rect(x - 17, -20, 34, 30), 0.3, 4), mix(C.plaster, C.sand, 0.2));
    s.p(c.cut(c.rect(x - 19, -24, 38, 5), 0.2, 4), C.roof);
    s.p(c.cut([[x - 6, 10], [x - 6, -6], [x + 6, -6], [x + 6, 10]], 0.2, 3), mix(C.lampGlow, C.sun, 0.3));
    s.p(c.cut(c.circ(x + 11, -6, 3.2, 8), 0.1, 2), [C.skin2, C.skin3, C.skin][i]);
    s.p(c.cut([[x + 8, -3], [x + 14, -3], [x + 15, 10], [x + 7, 10]], 0.2, 2), [C.sageRobe, C.roseRobe, C.dustyBlue][i]);
    s.p(c.ribbon([[x + 9, -1], [x + 2, -6]], 2), [C.skin2, C.skin3, C.skin][i]);
    m += s.out();
  });
  return m;
}
/** a little flame of an idea (origin: its foot) */
function ideaFlame(c) {
  return `<circle cy="-10" r="30" fill="url(#warm-glow)"/>${sheet().p(c.cut([[0, 0], [-7, -8], [-4, -18], [0, -26], [4, -18], [7, -8]], 0.2, 3), C.lampFlame).x(c.poly([[0, -3], [-3, -9], [0, -15], [3, -9]]), '#fff4d2').out()}`;
}

export default {
  id: 'lk16-dig',
  parable: true,
  beats: [
    { v: 3, text: 'Na to rządca rzekł sam do siebie: Co ja pocznę, skoro mój pan pozbawia mię zarządu?' },
    { v: 3, cont: true, text: 'Kopać nie mogę, żebrać się wstydzę.' },
    { v: 4 },
  ],
  cam: { x: [-180, 10], y: [-20, 40], z: [1, 1.14] },
  build(S) {
    const E = estateSet(S);
    const c = E.c;
    const beggar = S.puppet(E.act.add(person(c, { ...BEGGAR, pose: 'sit', holdF: `<g transform="translate(4 4)">${beggarBowl(c)}</g>` })));
    const mat = E.act.add(`<g>${mattock(c)}</g>`);
    const stew = S.puppet(E.act.add(person(c, STEWARD)));
    const think = E.W.add(`<g opacity="0">${thought(c, `<g transform="translate(-16 2) scale(.9)">${bigKey(c)}</g><g transform="translate(4 0)">${crossX(c, 20)}</g><g transform="translate(32 4)">${qMark(c, 30)}</g>`, { w: 110, h: 64 })}</g>`);
    const welcome = E.W.add(`<g opacity="0">${thought(c, `<g transform="translate(0 4)">${welcomeRow(c)}</g>`, { w: 150, h: 70 })}</g>`);
    const idea = E.W.add(`<g opacity="0">${ideaFlame(c)}</g>`);
    const sweat = [0, 1, 2].map(() => E.W.add(`<g opacity="0"><path d="${c.cut([[0, -8], [3, -2], [2.5, 2], [0, 3.5], [-2.5, 2], [-3, -2]], 0.1, 2)}" fill="${C.lake2}"/></g>`));
    const pain = E.W.add(`<g opacity="0">${sheet().p(c.ribbon([[-10, -6], [10, 6]], 3) + c.ribbon([[-10, 6], [10, -6]], 3) + c.ribbon([[0, -12], [0, 12]], 3), C.terracotta).out()}</g>`);

    return (t, time) => {
      const T = time;
      E.update(T);
      beggar.set({ x: BX, y: GY - 2, s: 0.9, armF: 50 + bump(t, 1.5, 1.9) * 16, armB: 10, head: 6, blink: blinkAt(T, 5) });

      /* v3a — alone: what shall I do? */
      const chin = es(t, 0.1, 0.3) * (1 - es(t, 0.95, 1.05));
      /* v3b — the mattock: raised, struck — it sticks, and he doubles over; the beggar, and shame */
      const lift = es(t, 1.08, 1.12);
      const raise = es(t, 1.1, 1.18);
      const strike = es(t, 1.18, 1.24, ease.in);
      const ache = es(t, 1.26, 1.34) * (1 - es(t, 1.46, 1.52));
      const hasM = lift > 0.5 && t < 1.26;
      const offer = es(t, 1.5, 1.6) * (1 - es(t, 1.62, 1.68));
      const hide = es(t, 1.64, 1.74) * (1 - es(t, 2.05, 2.15));
      /* v4 — the idea; the houses that will take him in */
      const up = es(t, 2.08, 2.2);
      const SK = [[1.0, SX], [1.08, DX], [1.46, DX], [1.5, DX - 10], [2.2, DX - 10], [2.9, 760]];
      const sx = kf(t, SK);
      const walk = moving(t, SK) ? sx * 0.06 : undefined;
      const flip = t > 1.6 && t < 2.1;
      const aM = lerp(20, lerp(150, 60, strike), raise);
      stew.set({
        x: sx, y: GY, s: 1.0, flip, walk,
        armF: (hasM ? aM : 20 - ache * 10) + offer * 55 + hide * 100,
        armB: 10 + chin * 120 - ache * 50 + up * 140 * (1 - es(t, 2.6, 2.8)),
        head: chin * 10 + ache * -6 + hide * 24 - up * 8 + offer * 6,
        lean: ache * 18 + hide * 10 + strike * 6 * (1 - ache),
        blink: hide > 0.5 || ache > 0.5 ? 0.8 : blinkAt(T, 3),
      });
      const [hx, hy] = headAt(sx, GY, 1.0, flip);
      const tk = es(t, 0.25, 0.4, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(think, { x: hx + 6, y: hy - 16, s: tk, o: tk > 0.01 ? 1 : 0 });
      // the mattock: in the bed, in his hands, fallen
      if (hasM) {
        const [mx, my] = handAt(sx, GY, 1.0, false, aM);
        const r = lerp(-10, lerp(-150, -20, strike), raise), rr = (r * PI) / 180;
        const px = -40 * Math.cos(rr) + 118 * Math.sin(rr), py = -40 * Math.sin(rr) - 118 * Math.cos(rr);
        pose(mat, { x: mx - px, y: my - py, r, s: 1 });
      } else if (t >= 1.26) pose(mat, { x: MX, y: GY - 12, r: -20, s: 1 });
      else pose(mat, { x: MX - 60, y: GY - 12, r: 0, s: 1 });
      sweat.forEach((d, i) => { const k = seg(t, 1.28 + i * 0.04, 1.48 + i * 0.04); pose(d, { x: hx + 20 + i * 10, y: hy - 10 + k * 40, o: k > 0 && k < 1 ? 1 : 0 }); });
      const pk = bump(t, 1.28, 1.5);
      pose(pain, { x: sx - 34, y: GY - 96, s: pk, r: T * 30, o: pk > 0.02 ? 1 : 0 });
      // v4: the idea
      const ik = es(t, 2.12, 2.24, ease.back) * (1 - es(t, 2.9, 2.98));
      pose(idea, { x: hx - 2, y: hy - 30, s: ik, o: ik > 0.01 ? 1 : 0 });
      const wk = es(t, 2.25, 2.4, ease.back) * (1 - es(t, 2.93, 3.0));
      pose(welcome, { x: hx + 30, y: hy - 40, s: wk * 1.45, o: wk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -20], [1.0, -30], [1.5, -60], [2.2, -40], [2.9, -10]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.4, 30], [2.2, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.4, 1.12], [1.5, 1.1], [2.2, 1.12]]);
      if (S.portrait) S.cam.x -= 100;   // phone: the beggar in the gateway and the dug bed in from the left edge
    };
  },
};
