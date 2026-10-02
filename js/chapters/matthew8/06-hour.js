// Mt 8,13 — the street again. "Go; let it be done for you as you have believed": the centurion gets up and goes
// home. At that very hour — a sundial hangs over the street with its shadow standing still — the front of his house
// lifts away and inside the servant sits up, stands and throws up his arms; his master comes to the door.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { capStreet, HOUSE, centurion, soldier, SERVANT, mob, painMarks, bubble, headAt, voiceRings, sparkle, sundial, hangAt, rayBurst, tr, PI } from './lib.js';

const FEET = HOUSE.FEET, JX = 700, CX = 905;

export default {
  id: 'mt8-hour',
  beats: [
    { v: 13, text: 'Do setnika zaś Jezus rzekł: «Idź, niech ci się stanie, jak uwierzyłeś».' },
    { v: 13, cont: true, text: 'I o tej godzinie jego sługa odzyskał zdrowie.' },
  ],
  cam: { x: [0, 200], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const st = capStreet(S);
    const c = st.c;
    const B = HOUSE.BEDX;
    const burst = st.houseL.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/>${rayBurst(c, { n: 14, r0: 20, r1: 150, spread: 0.07, o: 0.8 })}</g>`);
    const lying = S.puppet(st.houseL.add(person(c, { ...SERVANT, eyes: 'closed' })));
    const sitting = S.puppet(st.houseL.add(person(c, { ...SERVANT, pose: 'sit' })));
    const standing = S.puppet(st.houseL.add(person(c, SERVANT)));
    const pain = st.houseL.add(`<g opacity="0">${painMarks(c, 46)}</g>`);
    const sparks = [0, 1, 2, 3].map(() => st.houseL.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const H = st.addFront();

    const crowdL = S.layer({ par: 0.4, sh: 4 });
    [0, 1].forEach((i) => crowdL.sprite(mob(makeCutter('mt8-cen-c' + i), 5, { s: 0.82, spread: 44 }), 250 - i * 230, 716 - i * 10).set({ s: 1 - i * 0.1 }));
    const P = S.layer({ par: 0.4, sh: 5 });
    const SOLD = (S.portrait ? [[1250, 1], [1330, 2]] : [[1150, 1], [1235, 2]]).map(([x, i]) => ({ x, i, p: S.puppet(P.add(soldier(c, i, { spear: 30 }))) }));
    const DIS = [CAST.peter, CAST.andrew, CAST.john, CAST.james].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const talk = voiceRings(P, c, { n: 3, color: C.sun, r: 36, w: 5 });
    const cenK = S.puppet(P.add(centurion(c, { pose: 'kneel' })));
    const cen = S.puppet(P.add(centurion(c)));
    const W = S.layer({ par: 0.42, sh: 3 });
    const goW = W.add(`<g opacity="0">${bubble(c, [tr('Idź, niech ci się stanie,', 'Go your way. Let it be done'), tr('jak uwierzyłeś', 'for you as you have believed')], { size: 21, fill: C.halo, dir: -1 })}</g>`);
    const flyL = S.layer({ par: 0.2, sh: 6 });
    const dial = flyL.add(`<g class="hang"><path d="M0 -1600V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${sundial(c, 56, 7)}</g></g>`);

    return (t, time) => {
      const T = time;
      st.update(T);

      /* v13a — "Go; be it done for you as you have believed" */
      const speak = es(t, 0.08, 0.25) * (1 - es(t, 0.85, 0.98));
      jesus.set({ x: JX, y: FEET, s: 1.04, armF: 14 + speak * 70 + es(t, 1.3, 1.6) * 20, armB: 10 + speak * 30, head: -es(t, 1.3, 1.6) * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, FEET, 1.04);
      talk(hx, hy, speak, T, { dir: 1, spread: 2 });
      const gb = es(t, 0.12, 0.3, ease.back) * (1 - es(t, 0.9, 1.0));
      pose(goW, { x: hx + 24, y: hy - 64, s: gb, o: gb > 0.02 ? 1 : 0 });
      DIS.forEach((d) => d.p.set({ x: 560 - d.i * 82, y: FEET + (d.i % 2 ? 8 : -2), s: 0.98, armF: 12 + es(t, 1.4, 1.7) * (d.i % 2 ? 30 : 60), armB: es(t, 1.4, 1.7) * (d.i % 2 ? 100 : 20), head: -es(t, 1.4, 1.7) * 6, blink: blinkAt(T, d.seed) }));
      SOLD.forEach((sd) => sd.p.set({ x: sd.x + es(t, 0.6, 0.9) * (S.portrait ? 80 : 40),   // phone: the guards stand past the edge (as in mt8-centurion) and step further out
        y: FEET - 8 + sd.i * 4, s: 0.96, flip: true, armF: 30, blink: blinkAt(T, sd.i + 7) }));

      // he gets up and goes home
      const rise = es(t, 0.5, 0.56);
      const go = es(t, 0.6, 1.25);
      const cx = lerp(CX, HOUSE.DOOR - (S.portrait ? 72 : 50), go);     // phone: he stops short of the progress thread
      cenK.set({ x: CX, y: FEET + 2, s: 1.02, flip: true, o: 1 - rise, armF: 70, armB: 40, head: -8, blink: blinkAt(T, 4) });
      const joy = es(t, 1.55, 1.8);
      cen.set({ x: cx, y: FEET + 2, s: 1.02, flip: go < 0.02, o: rise, walk: go > 0 && go < 1 ? cx * 0.05 : undefined, armF: 14 + joy * 70, armB: 10 + joy * 120, head: -joy * 8, blink: blinkAt(T, 4) });

      /* v13b — at that very hour the servant is healed */
      const dk = es(t, 1.0, 1.3, ease.out);
      hangAt(dial, 830, lerp(-500, 200, dk), T, 0.8, 0.6);
      const open = es(t, 1.1, 1.35);
      pose(H.front, { y: -open * 140, o: 1 - open });
      const sitK = es(t, 1.32, 1.38), standK = es(t, 1.52, 1.58);
      lying.set({ x: B + 88, y: HOUSE.BASE - 90, s: 0.84, r: -90, o: 1 - sitK, armF: 10 });
      pose(pain, { x: B - 30, y: HOUSE.BASE - 110, s: 1, o: open * (1 - sitK) * 0.9 });
      sitting.set({ x: B - 20, y: HOUSE.BASE - 50, s: 0.84, o: sitK * (1 - standK), armF: 50, armB: 20, head: -6, blink: blinkAt(T, 6) });
      const hurrah = es(t, 1.58, 1.8);
      standing.set({ x: B + (S.portrait ? -10 : 30), y: HOUSE.BASE - 8, s: 0.86, flip: false, o: standK, armF: 40 + hurrah * 90, armB: 30 + hurrah * 120, head: -hurrah * 10, blink: blinkAt(T, 6) });
      pose(burst, { x: B, y: HOUSE.BASE - 110, s: 0.5 + bump(t, 1.3, 1.9) * 0.8, r: T * 10, o: bump(t, 1.3, 1.95) });
      sparks.forEach((sp, i) => { const k = bump(t, 1.35 + i * 0.06, 1.95); pose(sp, { x: B - 60 + i * 44, y: HOUSE.BASE - 150 - (i % 2) * 40, s: k, r: T * 50, o: k }); });

      S.cam.z = 1.05 + es(t, 0.9, 1.3) * 0.03;
      S.cam.x = 30 + es(t, 0.8, 1.3) * (S.portrait ? 160 : 50);
      S.cam.y = 30;
    };
  },
};
