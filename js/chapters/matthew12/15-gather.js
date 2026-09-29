// Mt 12,30 — a painted flat of the evening pasture with a stone sheepfold (John 10's). Jesus stands at the gate with
// his staff; two men are out on the meadow. "Whoever is not with me is against me": one comes and stands beside Him,
// a warm light joining them; the other folds his arms, turns his back and walks off the other way. "Whoever does not
// gather with me, scatters": Jesus and His helper bring the flock home — the sheep trot in through the gate — while
// the few sheep near the one who went his own way bolt in every direction and are lost over the hill.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { pastureSet, foldParts, ewe, sheepRig, WOOLS, manOf, handAt, headAt, kf, glow, sparkle, tr, PI } from './lib.js';

const Y = 712;
const JX = 800;

export default {
  id: 'mt12-gather',
  enter: 'fly',
  beats: [
    { v: 30, text: 'Kto nie jest ze Mną, jest przeciwko Mnie;' },
    { v: 30, cont: true, text: 'i kto nie zbiera ze Mną, rozprasza.' },
  ],
  cam: { x: [-30, 40], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = pastureSet(S, { skyCols: ['#d8c3b4', '#f1cf9f', '#f7dfb4'], sunAt: [1230, 250], groundY: 690, meadow: mix(C.hillNear, C.wheat, 0.2) });
    const F = foldParts(c, { cx: JX, gy: 650, w: 520, d: 130, h: 40, gw: 110 });
    const foldBack = S.layer({ par: 0.34, sh: 3 });
    foldBack.add(F.floor + F.back);
    /* the sheep (all in one layer between the back and the front walls of the fold) */
    const sheepL = S.layer({ par: 0.36, sh: 4 });
    const FLOCK = [
      [520, Y + 10, 1], [590, Y + 30, 1], [440, Y + 24, 1], [660, Y + 44, 1], [360, Y + 14, 1], [980, Y + 40, 0], [1060, Y + 18, 0], [1130, Y + 36, 0], [930, Y + 6, 1],
    ].map(([x, y, gather], i) => {
      const inside = F.G.inside(((i * 0.37) % 1) * 1.7 - 0.85, ((i * 0.61) % 1) * 0.8 - 0.6);
      return { i, x, y, gather, inside, rig: sheepRig(sheepL.add(ewe(c, { wool: WOOLS[i % WOOLS.length], patch: i % 4 === 2 }))), seed: c.rr(0, 6), run: c.rr(-1, 1) };
    });
    const foldFront = S.layer({ par: 0.36, sh: 4 });
    foldFront.add(F.front);

    /* people */
    const act = S.layer({ par: 0.45, sh: 5 });
    const link = act.add(`<g opacity="0">${glow(150, 0.9)}</g>`);
    const withO = manOf(c, { robe: C.sageRobe, mantle: C.wheatRobe, belt: C.leather, beard: 'short' });
    const againstO = manOf(c, { robe: C.plumRobe, mantle: null, belt: C.ochre, beard: 'full', hairStyle: 'wrap', veil: C.stone });
    const withM = S.puppet(act.add(person(c, withO)));
    const against = S.puppet(act.add(person(c, againstO)));
    const staff = `<g transform="rotate(-8)"><path d="${c.ribbon([[0, -60], [2, 120]], 5)}" fill="${C.wood2}"/><path d="${c.ribbon(c.arc(-10, -60, 12, 14, PI * 1.05, PI * 2.1, 8), 5)}" fill="${C.wood2}"/></g>`;
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus, holdB: staff })));
    const sp = [0, 1, 2].map(() => act.add(`<g opacity="0">${sparkle(c, 11)}</g>`));

    const wK = [[-0.5, 470], [0.5, 690]];
    const aK = [[0.15, 930], [0.9, 1190]];

    return (t, time) => {
      const T = time;
      P.update(T, { sunX: 1230, sunY: 250, glow: 0.6 });

      /* v30a — one comes to His side, the other turns away */
      const wx = kf(t, wK);
      const walkW = t > -0.5 && t < 0.5;
      const gatherK = es(t, 1.05, 1.7);
      withM.set({ x: wx + gatherK * 0, y: Y + 4, s: 0.96, flip: false, walk: walkW ? wx * 0.06 : undefined, armF: 14 + bump(t, 1.05, 1.6) * 60, armB: 10 + bump(t, 1.1, 1.65) * 40, head: -2, blink: blinkAt(T, 3) });
      const turn = es(t, 0.1, 0.16);
      const ax = kf(t, aK);
      const cross = es(t, 0.05, 0.2);
      against.set({ x: ax, y: Y + 10, s: 0.96, flip: turn < 0.5, walk: t > 0.15 && t < 0.9 ? ax * 0.06 : undefined, armF: 20 + cross * 60, armB: 20 + cross * 60 + bump(t, 1.05, 1.5) * 50, head: 4 + cross * 6, blink: blinkAt(T, 5) });
      pose(link, { x: (wx + JX) / 2 + 10, y: Y - 110, sx: 1.4, o: es(t, 0.45, 0.65) });
      jesus.set({ x: JX, y: Y, s: 1.06, flip: t < 0.5 && t > 0.05 ? true : false, armF: 14 + es(t, 0.3, 0.5) * (1 - es(t, 1.0, 1.1)) * 50 + bump(t, 1.05, 1.6) * 50, armB: 30, head: -2, blink: blinkAt(T, 2) });
      sp.forEach((s_, i) => {
        const k = es(t, 0.5 + i * 0.05, 0.65 + i * 0.05, ease.back) * (1 - es(t, 1.0, 1.1));
        pose(s_, { x: 720 + i * 30, y: 470 - (i % 2) * 20, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      /* v30b — gathered in, or scattered */
      FLOCK.forEach((sh) => {
        let x = sh.x, y = sh.y, flip = sh.i % 2 === 0, hop = 0, o = 1, head = (sh.seed - 3) * 5;
        if (sh.gather) {
          const k = es(t, 1.05 + sh.i * 0.05, 1.55 + sh.i * 0.05);
          const gateX = JX, gateY = 650;
          const k1 = Math.min(1, k * 1.6), k2 = Math.max(0, k * 1.6 - 0.6) / 1;
          x = lerp(lerp(sh.x, gateX, k1), sh.inside[0], Math.min(1, k2));
          y = lerp(lerp(sh.y, gateY + 20, k1), sh.inside[1] + 8, Math.min(1, k2));
          flip = k > 0 && k < 1 ? x > sh.inside[0] : flip;
          hop = Math.abs(Math.sin(k * PI * 5)) * 6 * (k > 0 && k < 1 ? 1 : 0);
          head = 0;
        } else {
          const k = es(t, 1.05 + sh.i * 0.04, 1.65 + sh.i * 0.04, ease.in);
          const dir = sh.i % 2 ? 1 : -1;
          x = sh.x + k * (240 + sh.i * 20) * (sh.i === 6 ? 1 : dir < 0 && sh.i === 5 ? 0.3 : 1);
          y = sh.y - k * (sh.i === 7 ? -40 : 90) * (sh.i === 5 ? 1.4 : 1);
          flip = false;
          hop = Math.abs(Math.sin(k * PI * 6)) * 10 * (k > 0 && k < 1 ? 1 : 0);
          o = 1 - es(t, 1.55 + sh.i * 0.04, 1.75 + sh.i * 0.04) * 0.7;
          head = -k * 20;
        }
        sh.rig.set({ x, y, s: 0.95, flip, hop, head, o });
      });

      S.cam.x = kf(t, [[-0.5, -20], [0.5, 0], [1.0, 10]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.5, 1.08], [1.0, 1.08]]);
      S.cam.y = kf(t, [[-0.5, 26], [1.0, 30]]);
    };
  },
};
