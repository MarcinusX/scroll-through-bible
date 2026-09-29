// Mt 17,14–16 — at the foot of the mountain the crowd is waiting. Jesus comes down with the three; a man steps out
// of the crowd and falls on his knees before Him: "Lord, have mercy on my son!" — the boy beside him, a dark wisp
// about him. "He is epileptic and suffers terribly; he often falls into the fire, and often into the water" (two
// small plates: a tiny figure tumbling towards the flames, and into the waves). "I brought him to your disciples,
// and they could not heal him" — he turns to the nine, who stand with empty hands and lowered heads.
import { C, person, CAST, blinkAt, pose, lerp, swing, hanging, sheet, mix } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { plainStage, L9, bubble, withFace, faceBits, wisp, dangerPlate, kf, tr } from './lib.js';

const JX = 770, FX = 900, BX = 986;

export default {
  id: 'mt17-father',
  beats: [
    { v: 14 },
    { v: 15, text: 'prosił: «Panie, zlituj się nad moim synem!' },
    { v: 15, cont: true, text: 'Jest epileptykiem i bardzo cierpi; bo często wpada w ogień, a często w wodę.' },
    { v: 16 },
  ],
  cam: { x: [-60, 80], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const ST = plainStage(S);
    const FEET = ST.FEET;

    /* ---------- the plates: into the fire, into the water ---------- */
    const plL = S.layer({ par: 0.1, sh: 5 });
    const tumble = (r) => `<g data-k="tb${r}"><g transform="scale(.3)">${person(c, { ...L9.boy, eyes: 'closed' })}</g></g>`;
    const fireP = hanging(plL, `<g transform="scale(1.3)">${dangerPlate(c, 'fire', 56)}</g>${tumble(0)}`, { x: 680, y: 250, len: 900 });
    const waterP = hanging(plL, `<g transform="scale(1.3)">${dangerPlate(c, 'water', 56)}</g>${tumble(1)}`, { x: 920, y: 262, len: 900 });
    const tb = [S.$('tb0'), S.$('tb1')];

    /* ---------- the main group ---------- */
    const mainL = S.layer({ par: 0.5, sh: 5 });
    const THREE = [CAST.john, CAST.james, CAST.peter].map((o, i) => ({ i, o, seed: c.rr(0, 9), p: S.puppet(mainL.add(person(c, o))) }));
    const jesus = S.puppet(mainL.add(withFace(person(c, CAST.jesus), faceBits(c))));
    const jSad = jesus.el.querySelector('[data-part="sad"]');
    const boy = S.puppet(mainL.add(person(c, L9.boy)));
    const boyWisp = mainL.add(`<g opacity="0">${wisp(c, 1.1, '#463a52')}</g>`);
    const fStand = S.puppet(mainL.add(withFace(person(c, L9.father), faceBits(c))));
    const fKneel = S.puppet(mainL.add(withFace(person(c, { ...L9.father, pose: 'kneel' }), faceBits(c))));
    const fParts = (p, k) => p.el.querySelector(`[data-part="${k}"]`);
    const plea = mainL.add(`<g opacity="0">${bubble(c, [tr('Panie, zlituj się', 'Lord, have mercy'), tr('nad moim synem!', 'on my son!')], { size: 19, tail: -1 })}</g>`);
    const couldnt = mainL.add(`<g opacity="0">${bubble(c, tr('…nie mogli.', '…they could not.'), { size: 19, tail: 1 })}</g>`);

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(sheet().p(c.cut(c.blob(160, 970, 220, 90, 14, 0.15), 1.4, 8), C.rock2).p(c.cut(c.blob(1480, 980, 200, 80, 14, 0.15), 1.4, 8), C.rock).out());

    return (t, time) => {
      const T = time;
      ST.set.clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.3, 0.6, cl.i));
      ST.groups.forEach((g) => { g.a.set({ x: g.x, y: g.y }); g.b.set({ x: g.x, y: g.y, o: 0 }); });
      const shrug = es(t, 3.1, 3.25);
      ST.nine.a.set({ o: 1 - shrug });
      ST.nine.b.set({ o: shrug });

      /* Jesus and the three come in from the left */
      const jx = kf(t, [[0, 300], [0.7, JX]]);
      const jWalk = t > 0.02 && t < 0.7;
      const mercy = es(t, 1.3, 1.6);
      jesus.set({ x: jx, y: FEET, s: 1.1, walk: jWalk ? jx * 0.05 : undefined, amt: 0.9, armF: 14 + mercy * 40 + es(t, 2.2, 2.5) * 10, armB: 10 + mercy * 20, head: -2 + mercy * 6, blink: blinkAt(T, 1) });
      pose(jSad, { o: es(t, 2.1, 2.5) });
      THREE.forEach((d) => {
        const x = kf(t, [[0, 170 - d.i * 70], [0.8, 650 - d.i * 66]]);
        d.p.set({ x, y: FEET - 16 - d.i * 5, s: 0.96, walk: t > 0.02 && t < 0.8 ? x * 0.05 + d.i : undefined, amt: 0.9, head: -4 + es(t, 2.1, 2.5) * 6, blink: blinkAt(T, d.seed) });
      });

      /* the father: out of the crowd, down on his knees; the boy beside him */
      const out = es(t, 0.1, 0.55);
      const kneel = es(t, 0.55, 0.62);
      const fx = lerp(1080, FX, out);
      const turnToNine = es(t, 3.05, 3.2);
      fStand.set({ x: fx, y: FEET + 4, s: 1.04, flip: true, o: 1 - kneel, walk: out > 0 && out < 1 ? fx * 0.06 : undefined, armF: 20, blink: blinkAt(T, 3) });
      const plead = es(t, 1.05, 1.3) * (1 - es(t, 3.0, 3.1) * 0.6);
      const point = es(t, 3.1, 3.3);
      fKneel.set({ x: FX, y: FEET + 4, s: 1.04, flip: turnToNine < 0.5, o: kneel, armF: 30 + plead * 70 + bump(t, 2.1, 2.9) * 20 + point * 40, armB: 20 + plead * 100 - point * 60, head: -10 + plead * 2 + point * 4, lean: -plead * 4, blink: blinkAt(T, 3) });
      [fStand, fKneel].forEach((p) => { pose(fParts(p, 'sad'), { o: es(t, 0.8, 1.2) }); pose(fParts(p, 'tear'), { o: es(t, 2.2, 2.5) }); });
      const bx = lerp(1150, BX, out);
      boy.set({ x: bx, y: FEET + 8, s: 0.66, flip: true, walk: out > 0 && out < 1 ? bx * 0.07 : undefined, head: 8, armF: 6, blink: 0 });
      pose(boyWisp, { x: bx + 16 + Math.sin(T * 1.3) * 4, y: FEET - 108 + Math.sin(T * 1.7) * 3, s: 0.9 + Math.sin(T * 2) * 0.06, r: Math.sin(T * 1.1) * 10, o: es(t, 1.9, 2.3) * 0.85 + es(t, 0.3, 0.8) * 0.4 * (1 - es(t, 1.9, 2.3)) });

      pose(plea, { x: FX + 60, y: FEET - 196, s: es(t, 1.1, 1.3, ease.back), o: bump(t, 1.05, 1.97) > 0.05 ? 1 : 0 });
      pose(couldnt, { x: FX + 120, y: FEET - 214, s: es(t, 3.3, 3.5, ease.back), o: es(t, 3.25, 3.35) });

      /* the plates (v15b): he tumbles towards the flames and into the waves */
      const fp = es(t, 2.05, 2.3, ease.back) * (1 - es(t, 2.95, 3.15));
      swing(fireP, 680, lerp(-1000, 250, fp), T, 1.3, 0.9, 2);
      const wp = es(t, 2.15, 2.4, ease.back) * (1 - es(t, 2.95, 3.15));
      swing(waterP, 920, lerp(-1000, 262, wp), T, 1.3, 0.9, 3);
      const fall = es(t, 2.3, 2.7);
      pose(tb[0], { x: lerp(-40, -6, fall), y: lerp(-64, 20, fall), r: lerp(-20, -110, fall) });
      pose(tb[1], { x: lerp(40, 6, fall), y: lerp(-64, 20, fall), r: lerp(20, 110, fall) });

      S.cam.x = kf(t, [[0, -40], [0.8, 0], [2.9, 20], [3.3, 60]]);
      S.cam.z = 1.04 + es(t, 1.0, 1.4) * 0.05 * (1 - es(t, 1.95, 2.2)) + es(t, 3.1, 3.4) * 0.03;
      S.cam.y = 24 + es(t, 1.0, 1.4) * 16 * (1 - es(t, 1.95, 2.2));
    };
  },
};
