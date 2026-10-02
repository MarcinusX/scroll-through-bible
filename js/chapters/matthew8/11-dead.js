// Mt 8,21–22 — the same shore. Another disciple comes: "Lord, let me first go and bury my father", pointing back to
// the town, where a little funeral procession carries a bier up the hillside to the tombs. Jesus answers him: "Follow
// me" — He turns to the boat and beckons; the young man turns his back on the grey procession, which fades away up the
// hill, and follows Him down to the water.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { boat } from '../../assets/things.js';
import { capShore, MOURNER, mob, pose3, folk4, bubble, headAt, voiceRings, tr, PI, MORNING } from './lib.js';

const FEET = 742, JX = 760, MX = 890;

/** a bier with a body wrapped in linen (origin: centre of the plank) */
function bier(c, w = 150) {
  return sheet().p(c.cut(c.rect(-w / 2 - 14, -4, w + 28, 8), 0.3, 6), C.wood2)
    .p(c.cut([[-w / 2, -4], [-w / 2 + 6, -22], [w / 2 - 20, -24], [w / 2, -12], [w / 2 - 2, -4]], 0.6, 6), C.linen)
    .x(c.ribbon([[-w / 2 + 30, -20], [-w / 2 + 34, -4]], 2) + c.ribbon([[0, -22], [4, -4]], 2) + c.ribbon([[w / 2 - 40, -22], [w / 2 - 36, -4]], 2), C.stone2).out();
}

export default {
  id: 'mt8-dead',
  beats: [
    { v: 21 },
    { v: 22, text: 'Lecz Jezus mu odpowiedział:' },
    { v: 22, cont: true, text: '«Pójdź za Mną, a zostaw umarłym grzebanie ich umarłych!»' },
  ],
  cam: { x: [-60, 40], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const st = capShore(S, { skyCols: MORNING, sunAt: [1260, 150] });
    const c = S.c;
    const P_ = S.portrait;   // phone: the procession inside the screen, and a shorter walk towards the boat

    /* the tombs on the hill above the town, and the procession */
    const pc = makeCutter('mt8-proc');
    const bearers = pose3(pc, [-60, -20, 20, 60].map((x, i) => ({ x, y: (i % 2) * 3, s: 1, head: 6, armF: 150, o: folk4(pc, true, { robe: mix(C.stone2, C.storm, 0.2 + (i % 2) * 0.1) }) })));
    const mourn = pose3(pc, [-150, -115].map((x, i) => ({ x, y: 2, s: 0.96, head: 14, armF: 120, o: folk4(pc, false, { robe: mix(C.storm, C.stone2, 0.4), veil: mix(C.storm2, C.stone2, 0.4) }) })));
    const procM = `${mourn}${bearers}<g transform="translate(0 -222)">${bier(c, 160)}</g>`;
    const procL = S.layer({ par: 0.2, sh: 3 });
    const proc = procL.sprite(`<g transform="scale(.46)">${procM}</g>`, 1000, 600);

    /* the boat at the water's edge, with Peter and Andrew in it */
    const boatL = S.layer({ par: 0.36, sh: 4 });
    const B = boat(c, { mast: true });
    boatL.add(`<g transform="translate(330 668) scale(.8)">${B.back}</g>`);
    [CAST.peter, CAST.andrew].forEach((o, i) => S.puppet(boatL.add(person(c, o))).set({ x: 330 + (i ? -48 : 40), y: 646, s: 0.78, flip: i === 0, armF: 30, armB: 20 }));
    boatL.add(`<g transform="translate(330 668) scale(.8)">${B.front}</g>`);

    const crowdL = S.layer({ par: 0.4, sh: 4 });
    [[1420, 734, true]].forEach(([x, y, flip], i) => crowdL.sprite(mob(makeCutter('mt8-dd' + i), 3, { s: 0.8, spread: 40, flip }), x, y));

    const P = S.layer({ par: 0.4, sh: 5 });
    const DIS = [CAST.john, CAST.james].map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const man = S.puppet(P.add(person(c, MOURNER)));
    const talk = voiceRings(P, c, { n: 3, color: C.sun, r: 36, w: 5 });
    const W = S.layer({ par: 0.42, sh: 3 });
    const ask = W.add(`<g opacity="0">${bubble(c, [tr('Panie, pozwól mi najpierw', 'Lord, allow me first'), tr('pogrzebać mojego ojca!', 'to go and bury my father')], { size: 20, dir: -1 })}</g>`);
    const follow = W.add(`<g opacity="0">${bubble(c, tr('Pójdź za Mną!', 'Follow me!'), { size: 26, fill: C.halo, dir: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      st.update(T);

      /* the procession goes slowly up the hill; later it greys and fades away */
      const pk = es(t, 0.1, 2.9, (u) => u);
      const px = P_ ? lerp(900, 1000, pk) : lerp(990, 1110, pk);
      proc.set({ x: px, y: 596 - pk * 20 - Math.abs(Math.sin(px * 0.06)) * 1.5, s: 1, o: seg(t, 0.1, 0.3) * (1 - es(t, 2.4, 2.95) * 0.85) });

      /* v21 — "Lord, let me first go and bury my father" */
      const come = es(t, 0.0, 0.4);
      const mx0 = lerp(1250, MX, come);
      const point = es(t, 0.45, 0.65) * (1 - es(t, 1.9, 2.1));
      const turn = es(t, 2.12, 2.2);
      const go = es(t, 2.25, 2.95);
      const mx = mx0 - go * (P_ ? 200 : 300);
      man.set({ x: mx, y: FEET + 2, s: 1, flip: turn < 0.5 ? true : true, walk: (come > 0 && come < 1) || (go > 0 && go < 1) ? mx * 0.05 : undefined, armF: 14 + bump(t, 0.4, 1.0) * 50, armB: 10 + point * 120, head: point * 10 - es(t, 1.2, 1.5) * 8 * (1 - turn), blink: blinkAt(T, 5) });
      const ab = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(ask, { x: S.portrait ? mx0 - 170 : mx0 + 12, y: FEET - 196, s: ab, o: ab > 0.02 ? 1 : 0 });

      /* v22 — He answers; "Follow me" — and turns to the boat */
      const ans = es(t, 1.05, 1.3);
      const jgo = es(t, 2.2, 2.9);
      const jx = JX - jgo * (P_ ? 120 : 220);
      const beck = es(t, 2.1, 2.3);
      jesus.set({ x: jx, y: FEET, s: 1.04, flip: jgo > 0.02, walk: jgo > 0 && jgo < 1 ? jx * 0.045 : undefined, armF: 14 + ans * 40 * (1 - beck), armB: 10 + ans * 30 + beck * 80, head: -ans * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(jx, FEET, 1.04, jgo > 0.02);
      talk(hx, hy, bump(t, 1.1, 2.9), T, { spread: 1.8 });
      const fb = es(t, 2.08, 2.25, ease.back);
      pose(follow, { x: hx + 16, y: hy - 64, s: fb, o: fb > 0.02 ? 1 : 0 });
      DIS.forEach((d) => { const x = P_ ? 600 - d.i * 64 - jgo * 80 : 620 - d.i * 70 - jgo * 150; d.p.set({ x, y: FEET + 6 + d.i * 4, s: 0.98, flip: jgo > 0.02, walk: jgo > 0 && jgo < 1 ? x * 0.05 : undefined, armF: 14, head: -2, blink: blinkAt(T, d.i + 2) }); });

      S.cam.z = 1.05 + es(t, 0.3, 0.8) * 0.03;
      S.cam.x = 10 - es(t, 2.1, 2.9) * (P_ ? 30 : 50);
      S.cam.y = 30;
    };
  },
};
