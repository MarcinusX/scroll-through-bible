// Mt 18,15–16 — a street in Capernaum. One brother (the two of Matthew 7) shoulders past the other at the well and
// knocks his water jar to the ground; it breaks. The wronged one goes after him and takes him aside into a quiet
// doorway: a soft ring of light holds just the two of them while the neighbours walk on. He speaks gently, the broken
// jar in his bubble. If he listens: the other bows his head, and they embrace — a heart. But if he will not listen,
// he steps back, turns away and folds his arms; so the brother fetches two neighbours, and the three stand before
// him and say the same thing, three bubbles alike, three small seals over them — every word made firm.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { townSet, BRO_A, BRO_B, man, woman, speech, heart, crossX, withFace, faceBits, kf, hand, headAt, PI } from './lib.js';

const P = 0.45, GY = 690;
const AX = 930, BX = 800;              // where the talk happens

function jar(c) {
  const s = sheet();
  s.p(c.cut([[-8, -46], [8, -46], [8, -40], [18, -30], [22, -14], [16, 0], [-16, 0], [-22, -14], [-18, -30], [-8, -40]], 0.4, 4), C.pot);
  s.p(c.ribbon(c.qbez([16, -38], [30, -34], [20, -18], 6), 3) + c.ribbon(c.qbez([-16, -38], [-30, -34], [-20, -18], 6), 3), shade(C.pot, -0.15));
  s.x(c.ribbon([[-20, -18], [20, -18]], 2), C.cream, 'opacity=".5"');
  return s.out();
}
function shards(c) {
  const s = sheet();
  s.p(c.cut([[-26, 0], [-20, -16], [-8, -20], [-4, -6], [-12, 0]], 0.3, 3) + c.cut([[2, 0], [6, -14], [18, -18], [24, -4], [16, 0]], 0.3, 3) + c.cut([[-4, 2], [0, -6], [6, -2], [4, 3]], 0.2, 2), C.pot);
  return s.out();
}
/** a small round wax seal (a word made firm); origin centre */
function seal(c, r = 12) {
  return sheet().p(c.cut(c.blob(0, 0, r, r * 0.92, 10, 0.12), 0.4, 3), C.terracotta).x(c.poly(c.star(0, 0, r * 0.55, r * 0.25, 6, 0)), shade(C.terracotta, 0.3)).out();
}

export default {
  id: 'mt18-brother',
  beats: [
    { v: 15, text: 'Gdy brat twój zgrzeszy, idź i upomnij go w cztery oczy.' },
    { v: 15, cont: true, text: 'Jeśli cię usłucha, pozyskasz swego brata.' },
    { v: 16 },
  ],
  cam: { x: [-40, 80], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const V = townSet(S, { gy: GY - 30, par: P });
    const c = S.c;

    const ring = S.layer({ par: P, sh: 1, flat: true });
    const quiet = ring.add(`<g opacity="0"><ellipse cx="0" cy="-90" rx="170" ry="150" fill="url(#halo-glow)"/><ellipse cx="0" cy="0" rx="150" ry="22" fill="#fff4d6" opacity=".45"/></g>`);

    const L = S.layer({ par: P, sh: 5 });
    const nb = [0, 1].map((i) => S.puppet(L.add(person(c, i ? woman(c, { robe: C.mauve }) : man(c, { robe: C.sageRobe })))));
    const wit = [0, 1].map((i) => S.puppet(L.add(person(c, i ? man(c, { robe: C.wheatRobe, hairStyle: 'bald', beard: 'full', hair: C.greyHair, beardColor: C.greyHair }) : woman(c, { robe: C.dustyBlue })))));
    const A = S.puppet(L.add(withFace(person(c, BRO_A), faceBits(c))));
    const aAngry = A.el.querySelector('[data-part="angry"]'), aSad = A.el.querySelector('[data-part="sad"]');
    const B = S.puppet(L.add(withFace(person(c, { ...BRO_B }), faceBits(c))));
    const bSad = B.el.querySelector('[data-part="sad"]');
    const jarEl = L.add(`<g>${jar(c)}</g>`);
    const broken = L.add(`<g opacity="0">${shards(c)}</g>`);

    const fx = S.layer({ par: P, sh: 4 });
    const icon = `<g transform="translate(0 10) scale(.8)">${shards(c)}</g>`;
    const talk = fx.add(`<g opacity="0">${speech(c, icon, { w: 60, h: 44 })}</g>`);
    const love = fx.add(`<g opacity="0">${heart(c, 18)}</g>`);
    const says = [0, 1, 2].map(() => fx.add(`<g opacity="0">${speech(c, icon, { w: 56, h: 42 })}</g>`));
    const seals = [0, 1, 2].map(() => fx.add(`<g opacity="0">${seal(c, 12)}</g>`));
    const no = fx.add(`<g opacity="0">${speech(c, crossX(c, 14), { w: 44, h: 38 })}</g>`);

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v15a — the jar knocked down; the talk in private */
      const push = kf(t, [[0, 470], [0.32, 930]], (u) => u);
      const bump1 = bump(t, 0.12, 0.3);
      const fall = es(t, 0.16, 0.3, ease.in);
      const [jx, jy] = hand(760, GY, 0.92, false, 40, -bump1 * 10);
      pose(jarEl, { x: lerp(jx + 8, 740, fall), y: lerp(jy + 24, GY + 4, fall), r: fall * -90, o: 1 - es(t, 0.3, 0.32) });
      fade(broken, es(t, 0.3, 0.32));
      pose(broken, { x: 736, y: GY + 6 });
      const goTo = es(t, 0.35, 0.6);
      const turnAway = es(t, 2.05, 2.25);
      const hugK = es(t, 1.3, 1.55) * (1 - es(t, 2.0, 2.15));
      const bow = es(t, 1.08, 1.3) * (1 - turnAway);
      A.set({ x: push + hugK * -40, y: GY + 2, s: 0.92, flip: t > 0.5 && turnAway < 0.5, walk: t < 0.32 ? push * 0.06 : undefined, lean: bump1 * 8, armF: 14 + bump1 * 40 + hugK * 70 - turnAway * 4, armB: hugK * 90 + bump(t, 2.1, 2.5) * 60 + bump(t, 2.6, 3.0) * 60, head: bow * 16 - turnAway * 10, blink: blinkAt(T, 2) });
      fade(aAngry, es(t, 0.1, 0.2) * (1 - es(t, 0.9, 1.1)) + turnAway);
      fade(aSad, bow);
      const bx = lerp(760, BX, goTo) + hugK * 36;
      const bw = es(t, 2.12, 2.3), bBack = es(t, 2.3, 2.5);
      B.set({ x: lerp(bx, lerp(560, 700, bBack), bw), y: GY + 2, s: 0.92, flip: bw > 0.05 && bBack < 0.5, walk: (goTo > 0 && goTo < 1) || (bw > 0 && bw < 1) || (bBack > 0 && bBack < 1) ? bx * 0.06 + bw * 30 : undefined, lean: -bump1 * 10, armF: 40 - bump1 * 20 + bump(t, 0.6, 0.98) * 40 + hugK * 70 + bump(t, 2.5, 2.9) * 40, armB: bump1 * 50 + hugK * 90, head: -bump1 * 10, blink: blinkAt(T, 3) });
      fade(bSad, es(t, 0.2, 0.3) * (1 - hugK));
      const nk = Math.max(es(t, 2.1, 2.2, ease.back) * (1 - es(t, 2.45, 2.5)), es(t, 2.72, 2.82, ease.back));
      const [ahx, ahy] = headAt(930, GY + 2, 0.92, false);
      pose(no, { x: ahx + 18, y: ahy - 16, s: nk, o: nk > 0.01 ? 1 : 0 });
      pose(quiet, { x: 866, y: GY, o: es(t, 0.45, 0.65) * (1 - es(t, 2.0, 2.2)) });
      const tk = bump(t, 0.6, 0.98);
      const [bhx, bhy] = headAt(BX, GY + 2, 0.92, false);
      pose(talk, { x: bhx + 18, y: bhy - 18, s: es(t, 0.6, 0.7, ease.back), o: tk > 0.05 ? 1 : 0 });
      // the neighbours walk on out of the ring
      nb.forEach((p, i) => {
        const nx = kf(t, [[0, 600 - i * 70], [0.6, 520 - i * 70], [1.0, 300 - i * 90]], (u) => u);
        p.set({ x: nx, y: GY - 10 - i * 6, s: 0.84, flip: true, walk: t < 1.0 ? nx * 0.06 : undefined, head: bump(t, 0.12, 0.4) * 10, blink: blinkAt(T, 4 + i) });
      });

      /* v15b — he listens: they embrace */
      const lv = es(t, 1.45, 1.65, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(love, { x: 866, y: GY - 200 + Math.sin(T * 1.8) * 3, s: lv, o: lv > 0.01 ? 1 : 0 });

      /* v16 — he won't: one or two more, three who say the same */
      wit.forEach((p, i) => {
        const wx = kf(t, [[2.25, 380 - i * 60], [2.52, 640 - i * 70]], (u) => u);
        p.set({ x: wx, y: GY - 6 - i * 8, s: 0.88, flip: false, o: es(t, 2.2, 2.28), walk: t > 2.25 && t < 2.52 ? wx * 0.06 : undefined, armF: 20 + es(t, 2.55, 2.7) * 60, blink: blinkAt(T, 6 + i) });
      });
      const sayers = [[700, GY + 2, 0.92], [640, GY - 6, 0.88], [570, GY - 14, 0.88]];
      says.forEach((el, i) => {
        const [x, y, s] = sayers[i];
        const k = es(t, 2.52 + i * 0.05, 2.64 + i * 0.05, ease.back);
        const [hx, hy] = headAt(x, y, s, false);
        pose(el, { x: hx + 16, y: hy - 16, s: k * 0.9, o: k > 0.01 ? 1 : 0 });
        pose(seals[i], { x: hx + 36, y: hy - 96, s: es(t, 2.6 + i * 0.05, 2.7 + i * 0.05, ease.back), r: -10 + i * 10, o: t > 2.6 + i * 0.05 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 0], [0.5, 40], [1.9, 40], [2.3, 0], [2.9, -20]]);
      S.cam.z = kf(t, [[0, 1.02], [0.6, 1.07], [1.9, 1.08], [2.3, 1.03]]);
      S.cam.y = kf(t, [[0, 20], [0.6, 30], [2.3, 20]]);
    };
  },
};
