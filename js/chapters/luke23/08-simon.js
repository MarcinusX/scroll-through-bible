// Łk 23,26–27 — outside the city gate under a grey sky (Mark 15's road): the bare hill small in the distance.
// They lead Him out: Jesus walks bowed under the cross between two soldiers. A man coming in from the fields
// with his hoe is stopped by a spear: Simon of Cyrene, his name comes down. He lays the hoe down and the cross is
// laid on his shoulder, and he walks on behind Jesus. Out of the gate a great crowd follows, and in front of it
// the women, their hands to their faces, mourning and lamenting Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { kf, moving, soldier, carriedCross, hoe, nameTag, strip, hanging, swing, roadSet, pose3, folkO, RGY, LOOK, SKIES, tr } from './lib.js';

const GY = RGY;

export default {
  id: 'lk23-simon',
  beats: [
    { v: 26, text: 'Gdy Go wyprowadzili, zatrzymali niejakiego Szymona z Cyreny, który wracał z pola,' },
    { v: 26, cont: true, text: 'i włożyli na niego krzyż, aby go niósł za Jezusem.' },
    { v: 27 },
  ],
  cam: { x: [-60, 200], y: [-40, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const R = roadSet(S);
    /* the crowd following out of the gate: groups as sprites; the women in front, weeping */
    const mk = (n, women, sc) => {
      const mem = [];
      for (let i = 0; i < n; i++) {
        const w = women || i % 3 === 1;
        mem.push({ x: i * 46 + c.rr(-6, 6) - (n * 23), y: (i % 2) * 14, s: sc * c.rr(0.94, 1.04), flip: false, o: folkO(c, !w), armF: w ? 140 + c.rr(-8, 8) : c.rr(6, 30), armB: w ? 30 : 8, head: w ? 14 : c.rr(-6, 2) });
      }
      return pose3(c, mem);
    };
    const back = [0, 1, 2, 3].map((i) => { const x1 = [480, 300, 130, -40][i], y = GY - 30 + (i % 2) * 8; return { i, sp: R.P2.sprite(mk(5, false, 0.78), x1, y), y, x0: -500 - i * 230, x1 }; });
    const women = [0, 1].map((i) => { const x1 = [500, 300][i], y = GY + 26 + i * 6; return { i, sp: R.P.sprite(mk(4, true, 0.94), x1, y), y, x0: -460 - i * 240, x1 }; });

    const P = R.P;
    const simon = S.puppet(P.add(person(c, { ...LOOK.simon, holdF: hoe(c) })));
    const simon2 = S.puppet(P.add(person(c, LOOK.simon)));
    const solB = S.puppet(P.add(soldier(c, 1)));
    const jes = S.puppet(P.add(person(c, CAST.jesus)));
    const solA = S.puppet(P.add(soldier(c, 0)));
    const crossL = S.layer({ par: 0.55, sh: 6 });
    const cross = crossL.add(`<g>${carriedCross(c)}</g>`);
    const hoeDown = crossL.add(`<g>${hoe(c)}</g>`);
    const tagL = S.layer({ par: 0.58, sh: 5 });
    const simTag = hanging(tagL, `${nameTag(c, tr(['Szymon', 'z Cyreny'], ['Simon', 'of Cyrene']), { size: 18 })}<g transform="translate(0 78)">${strip(c, tr('wracał z pola', 'coming from the country'), { size: 14, fill: C.stone })}</g>`, { x: 0, y: -1500, len: 800 });

    return (t, time) => {
      const T = time;
      R.sk.blend(SKIES.storm, SKIES.grey, 0.3 + es(t, 0, 3) * 0.3);
      R.clouds.forEach((cl, i) => swing(cl.el, cl.x + Math.sin(T * 0.08 + i) * 30, cl.y, T, 1, 0.5, i));

      const jK = [[-0.3, [260, GY]], [0.8, [720, GY]], [1.1, [740, GY]], [1.45, [760, GY]], [2.9, [900, GY]]];
      const sK = [[-0.3, [1460, GY + 4]], [0.6, [1030, GY + 4]], [1.05, [1030, GY + 4]], [1.4, [690, GY - 4]], [1.55, [640, GY - 4]], [2.9, [760, GY - 4]]];
      const aK = [[-0.3, [420, GY + 8]], [0.55, [910, GY + 8]], [1.5, [910, GY + 8]], [2.9, [1090, GY + 8]]];
      const bK = [[-0.3, [100, GY + 6]], [0.9, [560, GY + 6]], [1.3, [560, GY + 6]], [1.5, [480, GY + 6]], [2.9, [590, GY + 6]]];
      const [jx, jy] = kf(t, jK), [sx, sy] = kf(t, sK), [ax, ay] = kf(t, aK), [bx, by] = kf(t, bK);
      const taken = es(t, 1.2, 1.5);
      const halt = es(t, 0.45, 0.6) * (1 - es(t, 1.35, 1.5));
      jes.set({ x: jx, y: jy, s: 1.02, flip: false, walk: moving(t, jK, 0.2) ? jx * 0.04 : undefined, amt: 0.6, lean: lerp(12, 3, taken), head: lerp(14, 4, taken), armF: lerp(70, 14, taken), armB: lerp(40, 8, taken), blink: blinkAt(T) });
      solA.set({ x: ax, y: ay, s: 1, flip: halt > 0.5, walk: moving(t, aK) ? ax * 0.06 : undefined, armF: 34 + halt * 40, armB: 10 + halt * 60 + bump(t, 1.0, 1.3) * 40, blink: blinkAt(T, 3) });
      solB.set({ x: bx, y: by, s: 1, flip: false, walk: moving(t, bK) ? bx * 0.06 : undefined, armF: 34, armB: 10, blink: blinkAt(T, 4) });
      const hasHoe = 1 - es(t, 1.05, 1.12);
      const sw = moving(t, sK) ? sx * 0.05 : undefined;
      const flipS = t < 1.5;
      simon.set({ x: sx, y: sy, s: 1.04, flip: flipS, o: hasHoe, walk: sw, armF: 24, armB: 10 + bump(t, 0.6, 1.0) * 30, head: bump(t, 0.6, 1.0) * -8, blink: blinkAt(T, 2) });
      simon2.set({ x: sx, y: sy, s: 1.04, flip: flipS, o: 1 - hasHoe, walk: sw, amt: 0.7, armF: lerp(20, 70, taken), armB: lerp(10, 40, taken), lean: taken * 8, head: taken * 8, blink: blinkAt(T, 2) });
      const hd = es(t, 1.05, 1.3, ease.in);
      pose(hoeDown, { x: 1060 + hd * 30, y: GY - 58 + hd * 44, r: hd * 80, o: hasHoe < 1 ? 1 - es(t, 1.8, 2) : 0 });
      const jsx = jx - 12, jsy = jy - 138 * 1.02 + 22;
      const ssx = sx + (flipS ? 12 : -12), ssy = sy - 140 * 1.04 + 22;
      const lift = bump(t, 1.2, 1.5) * 30;
      pose(cross, { x: lerp(jsx, ssx, taken), y: lerp(jsy, ssy, taken) - lift, r: 60 });
      const st = es(t, 0.3, 0.6) * (1 - es(t, 1.9, 2.1));
      swing(simTag, t < 1.5 ? 1030 : sx, 280 - (1 - st) * 900, T, 1.2, 0.9, 1);

      /* v27 — a great crowd follows, and the women mourning */
      const fk = es(t, 1.9, 2.8, ease.out);
      back.forEach((b) => b.sp.set({ x: lerp(b.x0, b.x1, fk), y: b.y + (T ? Math.abs(Math.sin(t * 12 + b.i)) * -2 * (fk < 1 ? 1 : 0) : 0), o: fk > 0.001 ? 1 : 0 }));
      women.forEach((w) => w.sp.set({ x: lerp(w.x0, w.x1, fk), y: w.y, o: fk > 0.001 ? 1 : 0 }));

      S.cam.x = 60 + es(t, 0.2, 0.9) * 40 - es(t, 1.9, 2.6) * 60;
      S.cam.y = 10 + es(t, 0.3, 1.0) * 20;
      S.cam.z = 1.02 + es(t, 0.3, 1.0) * 0.04 - es(t, 1.9, 2.6) * 0.03;
    };
  },
};
