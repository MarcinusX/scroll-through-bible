// Łk 10,30 — a painted flat of the steep desert road that goes down from Jerusalem, on its hill far up on the left, to
// the green palms of Jericho far below on the right; the midday sun beats down on the bare rocks. "A man was going down
// from Jerusalem to Jericho": a traveller comes down the road with his cloak and a bundle on a stick. "And he fell among
// robbers": out from behind the great rocks spring three dark figures, cut from shadow. "They stripped him and beat him
// and went away, leaving him half dead": a cloud of dust swallows them all — only the shadows of their arms rise and
// fall above it — and when it clears the robbers are running off with his cloak and his bundle, and the man lies by
// the side of the road, his tunic torn, not moving.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { jerichoSet, ROAD, lying, shadowPerson, dust, glow, kf, moving, handAt, HOT, TRAVELLER, STRIPPED, es, ease, bump, seg, PI } from './lib.js';
import { cloak } from '../mark2/lib.js';

const SH = '#3a3040';
const ROBBERS = [
  { robe: C.stone, hair: C.hair, hairStyle: 'wrap', veil: C.stone, beard: 'wild' },
  { robe: C.stone, hair: C.hair, hairStyle: 'wild', beard: 'full' },
  { robe: C.stone, hair: C.hair, hairStyle: 'short', beard: 'short', belt: C.leather },
];

export default {
  id: 'lk10-robbers',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 30, text: 'Jezus nawiązując do tego, rzekł: «Pewien człowiek schodził z Jerozolimy do Jerycha i wpadł w ręce zbójców.' },
    { v: 30, cont: true, text: 'Ci nie tylko że go obdarli, lecz jeszcze rany mu zadali i zostawiwszy na pół umarłego, odeszli.' },
  ],
  cam: { x: [-20, 60], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const V = jerichoSet(S, { skyCols: HOT });
    const c = S.c;

    /* the robbers, hidden behind the rocks (on the road sheet, behind the rock sheet) */
    const robbers = ROBBERS.map((o, i) => ({ i, p: S.puppet(V.road.add(shadowPerson(c, o, SH))), x0: 1120 + i * 90, x1: 900 + i * 60 }));
    const bundleSil = V.road.add(`<g transform="scale(.7)">${sheet().p(c.cut(c.blob(0, -10, 22, 16, 10, 0.2), 0.5, 4), SH).p(c.ribbon([[-30, 20], [26, -24]], 4), SH).out()}</g>`);
    const cloakSil = V.road.add(`<g transform="scale(.5)">${cloak(c, { col: SH })}</g>`);

    /* the traveller */
    const P = S.layer({ par: 0.44, sh: 5 });
    const bundle = `<g transform="rotate(-150) translate(0 -10)">${sheet().p(c.ribbon([[0, 30], [0, -50]], 3.4), C.wood2).out()}<g transform="translate(0 -56)">${sheet().p(c.cut(c.blob(0, -8, 18, 13, 10, 0.2), 0.5, 4), C.linen2).out()}</g></g>`;
    const man = S.puppet(P.add(person(c, { ...TRAVELLER, holdB: bundle })));
    const down = P.add(`<g>${lying(person(c, { ...STRIPPED, eyes: 'closed' }), 0.95)}</g>`);
    const fx = S.layer({ par: 0.46, sh: 4 });
    const puffs = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g>${dust(c, 60, mix(C.sand2, C.dune, 0.5))}</g>`), a: (i / 8) * PI * 2 }));
    const arms = [0, 1, 2].map(() => fx.add(`<g><path d="${c.ribbon([[0, 0], [0, -70]], (u) => 8 + u * 4)}" fill="${SH}"/></g>`));
    V.front();

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v30a — down the road; the robbers spring out */
      const wK = [[0.02, 260], [0.55, 800]];
      const mx = kf(t, wK, (x) => x);
      const beat = es(t, 1.0, 1.05);
      man.set({ x: mx, y: ROAD.MID, s: 0.96, flip: false, walk: moving(t, wK) ? mx * 0.05 : undefined, armF: 14 + es(t, 0.7, 0.85) * 60, armB: 20, head: es(t, 0.62, 0.75) * -8, lean: -es(t, 0.7, 0.85) * 8, o: 1 - beat, blink: blinkAt(T, 2) });
      robbers.forEach((r) => {
        const out = es(t, 0.58 + r.i * 0.05, 0.85 + r.i * 0.05, ease.out);
        const run = es(t, 1.4 + r.i * 0.04, 1.9 + r.i * 0.04, ease.in);
        const x = lerp(r.x0, r.x1, out) + run * (700 + r.i * 60);
        const y = lerp(ROAD.FAR + 2, ROAD.MID - 4 + r.i * 6, out);
        const hide = seg(t, 1.0, 1.04) * (1 - seg(t, 1.32, 1.38));
        r.p.set({ x, y, s: 0.98, flip: out > 0 && run < 0.02, walk: (out > 0 && out < 1) || (run > 0 && run < 1) ? x * 0.06 : undefined, armF: 60 + out * 60 * (1 - run), armB: 30 + out * 110 * (1 - run) + run * 40, head: 4, o: 1 - hide });
      });

      /* v30b — the dust; then he lies there and they run off with his things */
      const cloud = bump(t, 1.0, 1.4);
      puffs.forEach((p) => {
        const w = time ? Math.sin(T * 9 + p.i) * 8 : 0;
        pose(p.el, { x: 830 + Math.cos(p.a) * 80 * cloud + w, y: ROAD.MID - 90 + Math.sin(p.a) * 60 * cloud, s: 0.6 + cloud * 1.5, o: Math.min(1, cloud * 1.6) });
      });
      arms.forEach((a, i) => {
        const k = bump(t, 1.04 + i * 0.03, 1.36);
        const swingA = time ? Math.sin(T * 12 + i * 2) * 30 : (i - 1) * 20;
        pose(a, { x: 800 + i * 50, y: ROAD.MID - 150, r: swingA, o: k });
      });
      const lie = es(t, 1.3, 1.36);
      pose(down, { x: ROAD.LIE[0] + 80, y: ROAD.LIE[1], o: lie });
      const r0 = robbers[0], r1 = robbers[1];
      const run0 = es(t, 1.4, 1.9, ease.in), run1 = es(t, 1.44, 1.94, ease.in);
      pose(cloakSil, { x: lerp(r0.x1, r0.x1 + 700, run0) + 20, y: ROAD.MID - 130, r: 20, o: seg(t, 1.36, 1.4) * (1 - seg(t, 1.88, 1.92)) });
      pose(bundleSil, { x: lerp(r1.x1, r1.x1 + 760, run1) + 30, y: ROAD.MID - 170, o: seg(t, 1.36, 1.4) * (1 - seg(t, 1.9, 1.94)) });

      S.cam.x = kf(t, [[0, 0], [0.55, 30], [1, 40], [2, 20]]);
      S.cam.y = kf(t, [[0, 0], [1, 20], [2, 30]]);
      S.cam.z = kf(t, [[0, 1.0], [0.6, 1.06], [1.4, 1.08], [2, 1.08]]);
    };
  },
};
