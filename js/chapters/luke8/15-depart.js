// Łk 8,37–39 — the people of the whole district, full of fear, point Him away: "Go away from us!" So He walks to the
// boat, steps in, and they push off. The man who had the demons runs to the water's edge and kneels, begging to go
// with Him — but Jesus turns in the boat: "Return to your home and tell how much God has done for you." The boat
// slips away over the lake, and the man goes up to the town on the hill, and wherever he goes little slips of good
// news fly from him into the houses, and window after window lights up.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { boat } from '../../assets/things.js';
import { cypress, house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { gerasaShore, HEALED, knot, walledTown, bubble, headAt, hand, still, newsSlip, sparkle, kf, tr, PI } from './lib.js';

const JX = 660, FEET = 704;
const TX0 = 1130, TY = 520;

export default {
  id: 'lk8-depart',
  beats: [
    { v: 37, text: 'Wtedy cała ludność okoliczna Gergezeńczyków prosiła Go, żeby odszedł od nich, ponieważ wielkim strachem byli przejęci.' },
    { v: 37, cont: true, text: 'On więc wsiadł do łodzi i odpłynął z powrotem.' },
    { v: 38 },
    { v: 39, text: '«Wracaj do domu i opowiadaj wszystko, co Bóg uczynił z tobą».' },
    { v: 39, cont: true, text: 'Poszedł więc i głosił po całym mieście wszystko, co Jezus mu uczynił.' },
  ],
  cam: { x: [-80, 110], y: [-50, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    // phone: the town and its people drawn in from the right edge (as in lk8-town), the boat and the man further right
    const P = S.portrait, TX = P ? 1020 : TX0, HX = P ? 900 : 960, KX = P ? 700 : 650;
    const set = gerasaShore(S, { skyCols: ['#c0cdd6', '#f0dcc0', '#f6dbb4'], sunAt: [1320, 210], sunR: 40 });
    const hillL = S.layer({ par: 0.3, sh: 3 });
    hillL.add(walledTown(c, TX, TY, 0.62) + house(c, HX, 566, 50, 36, { stairs: false }) + house(c, 1330, 470, 56, 40, { stairs: false }) + cypress(c, HX + 50, 560, 80));
    const WIN = [[TX - 60, TY - 30], [TX - 20, TY - 38], [TX + 30, TY - 34], [TX + 70, TY - 28], [HX, 552], [1330, 456]].map(([x, y], i) => ({ i, x, y, el: hillL.add(`<g opacity="0"><circle cx="${x}" cy="${y}" r="26" fill="url(#warm-glow)"/><path d="${c.cut(c.rect(x - 4, y - 5, 8, 10), 0.2, 3)}" fill="#f7d58e"/></g>`) }));

    /* the boat, with the disciples baked in and Jesus as a puppet */
    const boatL = S.layer({ par: 0.45, sh: 4 });
    const B = boat(c, {});
    const disM = still(c, [CAST.james, CAST.andrew, CAST.john, CAST.peter].map((o, i) => ({ x: -110 + i * 56, y: 2, s: 0.92, flip: false, armF: 14 + (i % 2) * 20, armB: 8, head: -2, o })));
    const boatG = boatL.add(`<g><g>${B.back}</g>${disM}<g data-k="jin">${person(c, { ...CAST.jesus })}</g><g>${B.front}</g></g>`);
    const jIn = S.puppet(S.$('jin').firstElementChild);

    /* the townspeople */
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    const GROUPS = (P ? [[905, 690, 'a', 4], [990, 716, 'b', 4], [1045, 676, 'c', 3], [840, 716, 'd', 3]] : [[1010, 690, 'a', 4], [1120, 716, 'b', 4], [1200, 676, 'c', 3], [930, 716, 'd', 3]]).map(([x, y, k, n], i) => ({
      i, x, y,
      sp: crowdL.sprite(knot('lk8-town-' + k, n, { s: 0.9, spread: 38, rows: 1, flip: true, arms: [70, 96], armB: [20, 60], head: [0, 8] }), x, y),
    }));

    /* Jesus on the shore, the man */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const manSit = S.puppet(pL.add(person(c, { ...HEALED, pose: 'sit' })));
    const manKneel = S.puppet(pL.add(person(c, { ...HEALED, pose: 'kneel' })));
    const manWalk = S.puppet(pL.add(person(c, { ...HEALED })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const away = fx.add(`<g opacity="0">${bubble(c, tr('Odejdź od nas!', 'Depart from us!'), { size: 22, dir: 1 })}</g>`);
    const home = fx.add(`<g opacity="0">${bubble(c, [tr('Wracaj do domu i opowiadaj', 'Return to your house, and declare'), tr('wszystko, co Bóg uczynił z tobą', 'what great things God has done for you')], { size: 18, dir: -1, fill: C.halo })}</g>`);
    const slips = WIN.map((w) => ({ w, el: fx.add(`<g opacity="0">${newsSlip(c, 34)}</g>`) }));
    const sparks = WIN.map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    const BK = P ? [[1.4, 490], [1.95, 475], [4.02, 475], [4.8, -300]] : [[1.4, 470], [1.95, 430], [4.02, 430], [4.8, -300]];

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* v37a — the whole district asks Him to go away */
      GROUPS.forEach((g) => { const back = es(t, 4.0 + g.i * 0.05, 4.6 + g.i * 0.05); g.sp.set({ x: lerp(g.x + es(t, 1.2, 1.9) * (P ? 15 : 30), TX + 30, back), y: lerp(g.y, TY + 20, back), s: 1 - back * 0.5, o: 1 - seg(t, 4.5 + g.i * 0.05, 4.6 + g.i * 0.05) }); });
      const ab = es(t, 0.15, 0.35, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(away, { x: P ? 900 : 1000, y: 470, s: ab, o: ab > 0.02 ? 1 : 0 });

      /* v37b — He gets into the boat and goes back */
      const bx = kf(t, BK);
      const afloat = es(t, 1.4, 1.5);
      pose(boatG, { x: bx, y: 730 + (T ? Math.sin(T * 1.3) * 2 * afloat : 0), s: 0.88, sx: -1, r: T ? Math.sin(T * 1.1) * 0.8 * afloat : 0 });
      const board = es(t, 1.3, 1.36);
      const JK = [[1.02, JX], [1.3, bx + 128 * 0.88]];
      const jx = kf(t, JK);
      jesus.set({ x: jx, y: FEET - es(t, 1.2, 1.3) * 20, s: 1.02, flip: t > 1.0, o: 1 - board, walk: t > 1.02 && t < 1.3 ? jx * 0.06 : undefined, armF: 16 + bump(t, 0.2, 0.9) * 20, armB: 8, head: 4, blink: blinkAt(T) });
      const turn = es(t, 3.05, 3.2);
      const speak = es(t, 3.1, 3.3) * (1 - es(t, 3.95, 4.1));
      jIn.set({ x: -128, y: -2, s: 0.98, o: board, flip: turn > 0.5, armF: 16 + speak * 60, armB: 8 + speak * 30, head: -speak * 4, blink: blinkAt(T) });
      const [bhx, bhy] = [bx + 128 * 0.88, 730 - 167 * 0.88];
      const hb = es(t, 3.15, 3.3, ease.back) * (1 - es(t, 3.92, 4.0));
      pose(home, { x: bhx + 30, y: bhy - 40, s: hb, o: hb > 0.02 ? 1 : 0 });

      /* v38 — the man begs to go with Him */
      const up = es(t, 2.02, 2.08);
      const runK = es(t, 2.05, 2.5);
      const kneel = es(t, 2.5, 2.56) * (1 - es(t, 4.02, 4.08));
      const MK = [[2.05, 740], [2.5, KX]];
      const mx = kf(t, MK);
      manSit.set({ x: 740, y: FEET + 6, s: 1.0, flip: true, o: 1 - up, armF: 24 + bump(t, 0.1, 1.9) * 20, armB: 14, head: -4, blink: blinkAt(T, 4) });
      /* v39b — he goes and proclaims it through the whole town */
      const go = es(t, 4.05, 4.75, (u) => u);
      const walkX = t < 4.02 ? mx : lerp(KX, P ? 960 : 990, go), walkY = t < 4.02 ? FEET + 4 : lerp(FEET + 4, 612, go);
      manWalk.set({ x: walkX, y: walkY, s: t < 4.02 ? 1 : lerp(1, 0.72, go), flip: t < 4.02, o: up * (1 - kneel), walk: (runK > 0 && runK < 1) || (go > 0 && go < 1) ? walkX * 0.06 : undefined, armF: 30 + (t > 4 ? bump(t, 4.3, 5.0) * 80 : 20), armB: 20 + (t > 4 ? bump(t, 4.3, 5.0) * 90 : 0), head: -4, blink: blinkAt(T, 4) });
      manKneel.set({ x: KX, y: FEET + 6, s: 1.0, flip: true, o: kneel, armF: 90 + (T ? Math.sin(T * 2) * 4 : 0), armB: 110, head: -10, lean: -6, blink: blinkAt(T, 4) });
      slips.forEach((s, i) => {
        const a = 4.3 + i * 0.08, k = seg(t, a, a + 0.3);
        const x = lerp(walkX, s.w.x, ease.out(k)), y = lerp(walkY - 90, s.w.y, k) - Math.sin(k * PI) * 60;
        pose(s.el, { x, y, r: Math.sin(k * 7 + i) * 18, s: 0.9 - k * 0.3, o: k > 0 && k < 1 ? 1 : 0 });
        pose(s.w.el, { o: es(t, a + 0.26, a + 0.36) });
        const sp = bump(t, a + 0.26, a + 0.6);
        pose(sparks[i], { x: s.w.x, y: s.w.y - 20, s: sp, r: T * 40, o: sp });
      });

      S.cam.x = -40 + es(t, 1.0, 1.4) * -30 + es(t, 2.0, 2.4) * 30 + es(t, 4.0, 4.5) * 140;
      S.cam.z = 1.04 + es(t, 2.9, 3.2) * 0.06 + es(t, 4.0, 4.5) * 0.04;
      S.cam.y = -es(t, 4.0, 4.5) * 50;
    };
  },
};
