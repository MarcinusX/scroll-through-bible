// Mt 27,34–38 — Golgotha (Mark 15's hill, seen from afar). Up close a soldier offers wine mixed with gall; Jesus
// tastes it — and gently pushes the cup away. Then the camera draws back and everything is seen quietly, from far
// away: the cross is raised on the bare hill, a small dark silhouette with a thin ring of light. In the foreground
// four soldiers kneel round His garments and throw dice; then they sit down with their spears and keep watch,
// looking up. The charge is fixed above His head and a big board hangs beside it: THIS IS JESUS, THE KING OF THE
// JEWS; and two more crosses rise, one on the right and one on the left.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { kf, moving, headAt, hand, addToHead, soldier, thornWreath, wineCup, garments, dice, board, golgothaSet, setCrosses, driftClouds, hang2, GOL, SKIES, tr, PI } from './lib.js';

const JX = 800, JY = 690;

export default {
  id: 'mt27-golgotha',
  beats: [
    { v: 34, text: 'dali Mu pić wino zaprawione goryczą.' },
    { v: 34, cont: true, text: 'Skosztował, ale nie chciał pić.' },
    { v: 35, text: 'Gdy Go ukrzyżowali,' },
    { v: 35, cont: true, text: 'rozdzielili między siebie Jego szaty, rzucając o nie losy.' },
    { v: 36 },
    { v: 37 },
    { v: 38 },
  ],
  cam: { x: [-30, 30], y: [-60, 150], z: [0.96, 1.3] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { dial: false });
    const P = G.P;
    const wr = thornWreath(c);
    const jes = S.puppet(P.add(addToHead(person(c, CAST.jesus), wr)));
    const offer = S.puppet(P.add(soldier(c, 2, { spear: false })));
    const cup = G.fx.add(`<g>${wineCup(c)}</g>`);
    const POS = [[610, 700, false], [700, 712, false], [900, 712, true], [990, 700, true]];
    const kneel = POS.map(([x, y, f], i) => ({ x, y, f, i, p: S.puppet(P.add(soldier(c, i, { pose: 'kneel', spear: false }))), seed: c.rr(0, 9) }));
    const sit = POS.map(([x, y, f], i) => ({ x: x + (f ? 60 : -60), y: y + 4, f, i, p: S.puppet(P.add(soldier(c, i, { pose: 'sit', spear: 26 }))), seed: c.rr(0, 9) }));
    const g = garments(c);
    const fx = G.fx;
    const cloth = fx.add(`<g>${sheet().p(c.cut([[-110, -8], [104, -12], [118, 10], [-114, 12]], 0.8, 8), C.stone2).out()}</g>`);
    const tunic = fx.add(`<g>${g.tunic}</g>`);
    const mantle = fx.add(`<g>${g.mantle}</g>`);
    const dz = fx.add(`<g>${dice(c)}</g>`);
    const d0 = dz.querySelector('.d0'), d1 = dz.querySelector('.d1');
    const small = G.hillL.add(`<g>${board(c, tr('KRÓL ŻYDOWSKI', 'KING OF THE JEWS'), { size: 7, w: 54 })}</g>`);
    const bigL = S.layer({ par: 0.12, sh: 5 });
    const big = bigL.add(`<g>${hang2(`${board(c, tr(['TO JEST JEZUS,', 'KRÓL ŻYDOWSKI'], ['THIS IS JESUS,', 'THE KING OF THE JEWS']), { size: 22 })}`, 60, 900)}</g>`);
    const ptr = bigL.add(`<path d="M0 0L100 0" stroke="${C.cream}" stroke-width="1.6" stroke-dasharray="4 4" fill="none" opacity=".8"/>`);
    const light = G.onHill.add(`<g><circle r="160" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      G.sk.blend(SKIES.storm, SKIES.grey, es(t, 2, 3) * 0.5);
      driftClouds(G, T);

      /* v34 — wine mixed with gall: tasted, refused */
      const reach = es(t, 0.1, 0.45);
      const taste = es(t, 1.02, 1.25) * (1 - es(t, 1.3, 1.45));
      const refuse = es(t, 1.35, 1.55);
      const gone = es(t, 1.95, 2.2);
      const oK = [[-0.3, [1180, JY + 4]], [0.3, [930, JY + 4]], [1.7, [930, JY + 4]], [2.4, [1260, JY + 8]]];
      const [ox, oy] = kf(t, oK);
      const oArm = 20 + reach * 70 * (1 - es(t, 1.6, 1.9));
      offer.set({ x: ox, y: oy, s: 1, flip: t < 1.75, walk: moving(t, oK) ? ox * 0.06 : undefined, armF: oArm, armB: 8, head: refuse * 6, o: 1 - es(t, 2.3, 2.5), blink: blinkAt(T, 3) });
      const jArm = 10 + taste * 60 + refuse * 55 * (1 - es(t, 1.8, 2.1));
      jes.set({ x: JX, y: JY, s: 1.02, flip: false, o: 1 - gone, armF: jArm, armB: 6, head: -taste * 8 - refuse * 12, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, JY, 1.02, false);
      const [ohx, ohy] = hand(ox, oy, 1, true, oArm);
      pose(cup, { x: lerp(ohx, hx + 18, taste), y: lerp(ohy - 4, hy + 10, taste), r: taste * -30, o: reach > 0.02 && gone < 0.9 ? 1 : 0 });

      /* v35a — crucified: seen from far away, the cross is raised */
      const up = es(t, 2.15, 2.75);
      setCrosses(G, up, es(t, 6.05, 6.6), es(t, 6.2, 6.75));
      pose(light, { x: GOL.x, y: GOL.top - GOL.H + 60, s: 0.5 + up * 0.5, o: up * 0.45 });
      /* v35b — the garments divided, lots cast; v36 — they sit and keep watch */
      const div = es(t, 3.0, 3.25);
      const sat = es(t, 4.05, 4.12);
      kneel.forEach((k) => {
        const lean = bump(t, 3.2 + k.i * 0.08, 3.7 + k.i * 0.08);
        k.p.set({ x: k.x, y: k.y, s: 0.95, flip: k.f, o: div * (1 - sat), armF: 50 + lean * 40 + (k.i === 1 ? bump(t, 3.3, 3.6) * 60 : 0), armB: 20 + (k.i === 3 ? es(t, 3.6, 3.9) * 90 : 0), lean: 8 + lean * 6, head: 12, blink: blinkAt(T, k.seed) });
      });
      sit.forEach((k) => k.p.set({ x: k.x, y: k.y, s: 0.95, flip: k.f, o: sat, armF: 30, armB: 10, head: -14, blink: blinkAt(T, k.seed) }));
      const off = es(t, 4.05, 4.3);
      pose(cloth, { x: 800, y: 700, o: div * (1 - off) });
      pose(tunic, { x: 770, y: 688, o: div * (1 - off) });
      const lift = es(t, 3.6, 3.9);
      pose(mantle, { x: lerp(830, 950, lift), y: lerp(690, 600, lift), r: lift * -20, o: div * (1 - off) });
      const roll = seg(t, 3.25, 3.65);
      pose(d0, { x: lerp(-60, -12, roll), y: -Math.sin(roll * PI) * 70, r: roll * 540 });
      pose(d1, { x: lerp(-50, 14, roll), y: -Math.sin(roll * PI) * 90 + 4, r: -roll * 480 });
      pose(dz, { x: 800, y: 690, o: roll > 0 ? div * (1 - off) : 0 });

      /* v37 — the charge over His head */
      const ik = es(t, 5.05, 5.4);
      const topY = GOL.top - GOL.H - 10;
      pose(small, { x: GOL.x, y: topY, o: ik });
      const bx = S.portrait ? 960 : 1110, by = (S.portrait ? 20 : 118) - (1 - ik) * 700;
      pose(big, { x: bx, y: by, r: Math.sin(T * 0.8) * 1.2 * ik, o: ik > 0.01 ? 1 : 0 });
      const d = Math.hypot(bx - 60 - GOL.x, by + 40 - topY);
      pose(ptr, { x: GOL.x + 20, y: topY + 6, r: (Math.atan2(by + 40 - topY - 6, bx - 70 - GOL.x - 20) * 180) / PI, sx: Math.max(0.01, (d - 60) / 100), o: es(t, 5.35, 5.5) });

      S.cam.z = lerp(1.2, 1.0, es(t, 1.9, 2.8)) + es(t, 3.9, 4.3) * 0.04 - es(t, 4.9, 5.3) * 0.04;
      S.cam.y = lerp(110, -10, es(t, 1.9, 2.8)) + es(t, 2.9, 3.3) * 40 - es(t, 4.9, 5.3) * 40;
    };
  },
};
