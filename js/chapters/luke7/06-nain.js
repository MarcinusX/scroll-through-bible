// Łk 7,11–12 — the road climbs to Nain on the slope of its hill, Mount Tabor far off behind. Jesus comes up the road
// with His disciples and a great crowd. Just as He nears the town gate, a dead man is carried out: four bearers come
// out of the archway with the bier on their shoulders — her only son — and behind it walks his mother, a widow, her
// hands over her face. Then the people of the town pour out of the gate after her: women wailing with raised arms,
// a piper, men with bowed heads. The two crowds meet on the road.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  nainSet, NAIN, NP, BEARERS, WIDOW, YOUTH, carriedBier, wrapped, mournerGroup, folkGroup, tear, nameTag, hungWord, hangAt, headAt, kf, moving, tr,
} from './lib.js';

const FEET = NAIN.FEET, GATE = NAIN.GATE;
// the procession: where the bier's centre is at t (it comes out of the gate and walks slowly down the road)
const BK = [[1.0, GATE + 260], [1.85, NP.BX + 14], [3.0, NP.BX]];
const WK = [[1.25, GATE + 180], [1.95, NP.WX]];

export default {
  id: 'lk7-nain',
  beats: [
    { v: 11 },
    { v: 12, text: 'Gdy zbliżył się do bramy miejskiej, właśnie wynoszono umarłego - jedynego syna matki, a ta była wdową.' },
    { v: 12, cont: true, text: 'Towarzyszył jej spory tłum z miasta.' },
  ],
  cam: { x: [-60, 160], y: [-20, 50], z: [1, 1.16] },
  build(S) {
    const N = nainSet(S);
    // phone: the widow stops further in and arrives sooner, and the town crowd comes up closer behind her (clear of the thread)
    const PH = S.portrait;
    const WKp = PH ? [[1.25, GATE + 180], [1.7, 1030]] : WK;
    const TOWN = PH ? [1170, 1370] : [1260, 1470];
    const c = S.c;

    /* the town crowd (behind the gate's front wall, so it comes out of the archway) */
    const TL = S.layer({ par: 0.4, sh: 4 });
    const town = [0, 1].map((i) => TL.sprite(mournerGroup(makeCutter('lk7-mourn' + i), 6, { s: 0.86, seed: i * 2 }), 1500, FEET - 4));
    /* the procession: far bearers, the bier with the dead man, near bearers, the widow */
    const P = S.layer({ par: 0.4, sh: 5 });
    const bear = BEARERS.map((o, i) => ({ i, far: i < 2, p: null, o }));
    bear.filter((b) => b.far).forEach((b) => { b.p = S.puppet(P.add(person(c, b.o))); });
    const bierEl = P.add(`<g>${carriedBier(c, NP.BW)}</g>`);
    const body = P.add(`<g>${wrapped(c, YOUTH, NP.BW - 16)}</g>`);
    bear.filter((b) => !b.far).forEach((b) => { b.p = S.puppet(P.add(person(c, b.o))); });
    const widow = S.puppet(P.add(person(c, WIDOW)));
    const tears = [0, 1, 2].map((i) => P.add(`<g opacity="0">${tear(c, 4.4)}</g>`));
    const front = N.addFront();

    /* Jesus, His disciples and the great crowd with Him */
    const JL = S.layer({ par: 0.4, sh: 5 });
    const follow = [0, 1].map((i) => JL.sprite(folkGroup(makeCutter('lk7-nf' + i), 6, { s: 0.86 }), -600, FEET - 6 - i * 8));
    const DIS = [CAST.peter, CAST.john, CAST.james, CAST.andrew].map((o, i) => ({ i, p: S.puppet(JL.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(JL.add(person(c, { ...CAST.jesus })));

    /* words */
    const W = S.layer({ par: 0.3, sh: 6 });
    const sign = W.add(hungWord(c, 'Nain', { size: 28 }));
    const TG = S.layer({ par: 0.42, sh: 3 });
    const tSon = TG.add(`<g opacity="0">${nameTag(c, tr('jedyny syn matki', 'the only son of his mother'), { size: 16 })}</g>`);
    const tWid = TG.add(`<g opacity="0">${nameTag(c, tr('wdowa', 'a widow'), { size: 16 })}</g>`);

    return (t, time) => {
      const T = time;
      N.update(T);

      /* v11 — up the road to Nain, the disciples and a great crowd with Him */
      const JK = [[0.0, -140], [0.92, NP.JX]];
      const jx = kf(t, JK), jm = moving(t, JK);
      const sees = es(t, 1.5, 1.8);
      jesus.set({ x: jx, y: FEET, s: 1.04, walk: jm ? jx * 0.045 : undefined, amt: 0.8, armF: 12 + sees * 20, armB: 8, head: sees * 6, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const K = [[0.0, -320 - d.i * 90], [0.95, NP.DIS[Math.min(2, d.i)] - (d.i === 3 ? 80 : 0)]];
        const x = kf(t, K);
        d.p.set({ x, y: FEET + (d.i % 2 ? 8 : -3), s: 0.98, walk: moving(t, K) ? x * 0.05 + d.i : undefined, amt: 0.8, armF: 12, head: sees * 5, blink: blinkAt(T, d.seed) });
      });
      follow.forEach((f, i) => {
        const x = kf(t, [[0, -900 - i * 280], [1.0, 170 - i * 250]]);
        f.set({ x, y: FEET - 6 - i * 8 - (t < 1 ? Math.abs(Math.sin(x * 0.04 + i)) * 3 : 0), s: 1 - i * 0.08 });
      });
      const sk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      hangAt(sign, 1000, lerp(-500, 250, sk), T, 1.2, 0.7);

      /* v12a — a dead man carried out of the gate: the only son of a widow */
      const bx = kf(t, BK), bm = moving(t, BK, 0.2) || t < 3;
      const step = bm && t > 1 ? bx * 0.06 : undefined;
      const bob = step !== undefined ? Math.abs(Math.sin(bx * 0.06)) * 3 : 0;
      const by = NP.BY - bob;
      bear.forEach((b) => {
        const x = bx + (b.i % 2 ? 108 : -108) + (b.far ? 10 : 0);
        b.p.set({ x, y: FEET + (b.far ? -8 : 4), s: 0.94, flip: true, walk: step !== undefined ? step + b.i * 1.3 : undefined, amt: 0.6, armF: b.far ? 20 : 26, armB: 164, head: 8, blink: blinkAt(T, b.i + 2) });
      });
      pose(bierEl, { x: bx, y: by });
      pose(body, { x: bx + 4, y: by - 2 });
      const wx = kf(t, WKp);
      widow.set({ x: wx, y: FEET + 2, s: 1.0, flip: true, o: seg(t, 1.2, 1.3), walk: moving(t, WKp) ? wx * 0.05 : undefined, amt: 0.6, armF: 146, armB: 60, head: 18, lean: 6, blink: 1 });
      const [whx, why] = headAt(wx, FEET + 2, 1.0, true);
      tears.forEach((e, i) => {
        const k = T ? ((T * 0.8 + i / 3) % 1) : (i + 0.5) / 3;
        pose(e, { x: whx - 16 + i * 6, y: why + 26 + k * 70, s: 1, o: t > 1.4 ? (1 - k) * 0.95 : 0 });
      });
      const tk = es(t, 1.45, 1.62, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(tSon, { x: bx, y: by - 92, s: tk, o: tk > 0.02 ? 1 : 0 });
      const tw = es(t, 1.6, 1.76, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(tWid, { x: wx + 4, y: why - 58, s: tw, o: tw > 0.02 ? 1 : 0 });

      /* v12b — a large crowd from the town with her */
      town.forEach((g, i) => {
        const x = kf(t, [[2.0 + i * 0.12, GATE + 330 + i * 120], [2.7 + i * 0.1, TOWN[i]]]);
        g.set({ x, y: FEET - 4 - i * 6 - (t > 2 && t < 2.8 ? Math.abs(Math.sin(x * 0.04 + i)) * 3 : 0), s: 1 - i * 0.06 });
      });

      S.cam.x = kf(t, [[0, -40], [0.9, 20], [1.4, 80], [2.1, 100], [2.6, 150]]);
      S.cam.z = kf(t, [[0, 1.0], [1.2, 1.06], [2.1, 1.08], [2.6, 1.04]]);
      S.cam.y = kf(t, [[0, 0], [1.2, 20]]);
    };
  },
};
