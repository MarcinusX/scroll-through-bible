// Mt 10,11–13 — James and John come into a village and ask an old woman at the square who is worthy; she points to
// a house where a host is already opening his door. They stay there: night falls and the window glows, the day
// comes back. Going out to the houses they greet each one — "Peace to this house!" — and the peace goes out from
// their hands as a white dove: over the worthy house it settles on the roof and the house lights up; the other
// door slams, and the dove flies back into James's hands.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { village, DAY, openHouse, bubble, question, dove, flapWings, heart, sparkle, kf, moving, hand, headAt, folk, tr, PI } from './lib.js';

const GY = 704;
const LH0 = { x0: 380, w: 240, h: 250 }, RH0 = { x0: 962, w: 236, h: 244 };
const HB = 690;   // house base

export default {
  id: 'mt10-house',
  beats: [
    { v: 11, text: 'A gdy przyjdziecie do jakiegoś miasta albo wsi, wywiedzcie się, kto tam jest godny,' },
    { v: 11, cont: true, text: 'i u niego zatrzymajcie się, dopóki nie wyjdziecie.' },
    { v: 12 },
    { v: 13, text: 'Jeśli dom na to zasługuje, niech zstąpi na niego pokój wasz;' },
    { v: 13, cont: true, text: 'jeśli zaś nie zasługuje, niech pokój wasz powróci do was!' },
  ],
  cam: { x: [-60, 60], y: [-40, 20], z: [1, 1.1] },
  build(S) {
    // phone: the two houses stand closer together, both whole on the screen (they were cut by the frame)
    const PH = S.portrait;
    const LH = PH ? { ...LH0, x0: 452 } : LH0, RH = PH ? { ...RH0, x0: 912 } : RH0;
    const V = village(S, { skyCols: DAY, night: true, sunAt: [1250, 150] });
    const c = S.c;

    /* the two houses */
    const HL = S.layer({ par: 0.45, sh: 4 });
    const mk = (H, wall) => {
      const o = openHouse(c, { w: H.w, h: H.h, dw: 68, dh: 144, wall });
      const g = { ...H, o, door: [H.x0 + o.door[0], o.door[1], o.door[2]] };
      g.dark = HL.add(`<g transform="translate(${H.x0} ${HB})">${o.inside}</g>`);
      g.glow = HL.add(`<g opacity="0"><g transform="translate(${H.x0} ${HB})">${o.glow}</g></g>`);
      g.wall = HL.add(`<g transform="translate(${H.x0} ${HB})">${o.wall}</g>`);
      return g;
    };
    const L = mk(LH, C.plaster), R = mk(RH, mix(C.plaster2, C.stone2, 0.4));
    const roofGlow = HL.add(`<g opacity="0"><ellipse rx="190" ry="120" fill="url(#warm-glow)"/></g>`);

    /* the people at the doors (inside the doorways) */
    const D = S.layer({ par: 0.45, sh: 4 });
    const HOST = { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather };
    const host = S.puppet(D.add(person(c, HOST)));
    const hostW = S.puppet(D.add(person(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.cream, veil2: C.linen2, skin: C.skin, beard: 'none' })));
    const sour = S.puppet(D.add(person(c, { robe: C.plumRobe, mantle: shade(C.plumRobe, -0.2), hair: C.hair3, hairStyle: 'wrap', veil: C.stone2, beard: 'full', skin: C.skin3, belt: C.leather })));
    // door leaves in front of them
    const leafL = D.add(`<g>${L.o.leaf}</g>`), leafR = D.add(`<g>${R.o.leaf}</g>`);

    /* the square */
    const P = S.layer({ par: 0.5, sh: 5 });
    const old = S.puppet(P.add(person(c, { robe: C.stone2, mantle: C.dustyBlue, hairStyle: 'veil', veil: C.linen2, veil2: C.stone, hair: C.greyHair, skin: C.skin3, beard: 'none' })));
    const john = S.puppet(P.add(person(c, CAST.john)));
    const james = S.puppet(P.add(person(c, CAST.james)));

    const W = S.layer({ par: 0.52, sh: 4 });
    const q = W.add(`<g>${question(c)}</g>`);
    const greetL = W.add(`<g>${bubble(c, tr('Pokój temu domowi!', 'Peace to this house!'), { size: 20, dir: 1 })}</g>`);
    const greetR = W.add(`<g>${bubble(c, tr('Pokój temu domowi!', 'Peace to this house!'), { size: 20, dir: -1 })}</g>`);
    const hHeart = W.add(`<g>${heart(c, 11)}</g>`);
    const doveL = W.add(`<g><circle r="46" fill="url(#halo-glow)"/>${dove(c)}</g>`);
    const doveR = W.add(`<g><circle r="46" fill="url(#halo-glow)"/>${dove(c)}</g>`);
    const hearts = [0, 1].map(() => W.add(`<g>${heart(c, 10)}</g>`));
    const stars = [0, 1, 2].map(() => W.add(`<g>${sparkle(c, 12)}</g>`));

    // John and James: arrive, ask, go in, stay, come out, greet
    const MJ = PH ? 680 : 700, MA = PH ? 750 : 770;   // where they meet the old woman (phone: a little to the left)
    const JK = [[-0.3, -150], [0.32, MJ], [1.0, MJ], [1.28, L.door[0] + 34], [1.98, L.door[0] + 34], [2.12, L.door[0] + 110]];
    const AK = [[-0.26, -220], [0.36, MA], [1.0, MA], [1.3, L.door[0] + 80], [1.98, L.door[0] + 80], [2.14, 800], [2.42, R.door[0] - 50]];

    return (t, time) => {
      const T = time;
      /* the nights they stay */
      const nk = Math.max(0, Math.sin(seg(t, 1.42, 1.98) * PI));
      V.update(t, T, { night: Math.min(1, nk * 1.5), moonX: 1180, sunO: 1 - Math.min(1, nk * 3) });

      const OLDX = PH ? 840 : 880;
      const ask = bump(t, 0.34, 0.62), point = es(t, 0.5, 0.65) * (1 - es(t, 1.0, 1.15));
      old.set({ x: OLDX, y: GY - 6, s: 0.84, flip: true, o: 1 - es(t, 1.3, 1.45) + es(t, 2.0, 2.15), armF: 20 + point * 90, armB: 10, head: -point * 4, blink: blinkAt(T, 5) });
      pose(q, { x: PH ? 730 : 760, y: GY - 210, s: es(t, 0.34, 0.46, ease.back) * (1 - es(t, 0.62, 0.7)), o: t > 0.34 && t < 0.7 ? 1 : 0 });

      const jx = kf(t, JK), ax = kf(t, AK);
      const inside = es(t, 1.3, 1.4) * (1 - es(t, 1.98, 2.06));
      const give = es(t, 3.05, 3.25), giveR = es(t, 4.05, 4.25);
      john.set({ x: jx, y: GY + 4, s: 0.9, flip: t > 0.9 && t < 2.05, o: 1 - inside, walk: moving(t, JK) ? jx * 0.06 : undefined, armF: 20 + ask * 50 + bump(t, 2.3, 3.0) * 60 + give * 80 * (1 - es(t, 3.6, 3.8)), armB: 10 + bump(t, 2.3, 3.0) * 100, head: -give * 6, blink: blinkAt(T, 1) });
      james.set({ x: ax, y: GY + 12, s: 0.9, flip: t > 0.9 && t < 2.0, o: 1 - inside, walk: moving(t, AK) ? ax * 0.06 : undefined, armF: 20 + bump(t, 2.45, 3.0) * 60 + giveR * 60 + es(t, 4.6, 4.8) * 30, armB: 10 + bump(t, 2.45, 3.0) * 90 + es(t, 4.6, 4.8) * 40, head: -es(t, 4.6, 4.8) * 10, blink: blinkAt(T, 2) });

      /* the host opens his door (v11a), welcomes, and the house glows at night */
      const openL = es(t, 0.55, 0.75) * (1 - es(t, 1.4, 1.5)) + es(t, 1.98, 2.1) * (1 - es(t, 4.2, 4.4) * 0);
      pose(leafL, { x: L.door[0], y: HB, sx: Math.max(0.06, 1 - Math.min(1, openL) * 0.94), o: 1 });
      const hostOn = es(t, 0.6, 0.75) * (1 - es(t, 1.36, 1.44)) + es(t, 2.0, 2.1);
      host.set({ x: L.door[0] + 38, y: HB, s: 0.74, flip: false, o: Math.min(1, hostOn), armF: 20 + bump(t, 0.7, 1.35) * 70 + es(t, 3.3, 3.5) * 110, armB: 10 + es(t, 3.3, 3.5) * 140, head: -es(t, 3.3, 3.5) * 8, blink: blinkAt(T, 3) });
      hostW.set({ x: L.door[0] + 78, y: HB - 2, s: 0.7, flip: true, o: es(t, 3.2, 3.35), armF: es(t, 3.3, 3.5) * 110, armB: es(t, 3.3, 3.5) * 130, blink: blinkAt(T, 4) });
      pose(hHeart, { x: L.door[0] + 40, y: HB - 170, s: es(t, 0.7, 0.85, ease.back) * (1 - es(t, 1.2, 1.3)), o: t > 0.7 && t < 1.3 ? 1 : 0 });
      const lit = Math.max(nk > 0.2 ? Math.min(1, nk * 1.6) : 0, es(t, 3.3, 3.55));
      fade(L.glow, lit);

      /* v12 — "Peace to this house!" at both doors */
      const gl = es(t, 2.2, 2.35, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(greetL, { x: L.door[0] + 118, y: GY - 180, s: gl, o: gl > 0.01 ? 1 : 0 });
      const openR = es(t, 2.46, 2.6) * (1 - es(t, 4.05, 4.15));
      pose(leafR, { x: R.door[0], y: HB, sx: Math.max(0.06, 1 - openR * 0.94), o: 1 });
      sour.set({ x: R.door[0] + 36, y: HB, s: 0.72, flip: true, o: openR > 0.3 ? 1 : 0, armF: 20 + bump(t, 3.9, 4.1) * 60, head: 6, blink: blinkAt(T, 6) });
      const gr = es(t, 2.45, 2.6, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(greetR, { x: R.door[0] - 60, y: GY - 180, s: gr, o: gr > 0.01 ? 1 : 0 });

      /* v13a — the peace comes down on the worthy house */
      const fl = es(t, 3.05, 3.45);
      const [jhx, jhy] = hand(L.door[0] + 110, GY + 4, 0.9, true, 100);
      const dxL = lerp(jhx, L.x0 + L.w / 2, fl), dyL = lerp(jhy - 10, HB - L.h - 26, fl) - Math.sin(fl * PI) * 90;
      pose(doveL, { x: dxL, y: dyL, s: 0.8, sx: -1, o: fl > 0.01 ? 1 : 0 });
      flapWings(doveL, fl < 1 ? T * 1.4 + t * 20 : 0, fl < 1 ? 34 : 6, 7);
      pose(roofGlow, { x: L.x0 + L.w / 2, y: HB - L.h * 0.6, o: es(t, 3.35, 3.6) * (1 - es(t, 4.0, 4.3) * 0.4) });
      hearts.forEach((h, i) => {
        const k = es(t, 3.45 + i * 0.1, 3.65 + i * 0.1, ease.back);
        pose(h, { x: L.door[0] + 38 + i * 40, y: HB - 150 - i * 6, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v13b — the other door shuts, and the peace comes back */
      const go = seg(t, 4.1, 4.75);
      const [ahx, ahy] = hand(R.door[0] - 50, GY + 12, 0.9, false, 80);
      // out to the door, a bump, then home to James's hands
      const px = go < 0.45 ? lerp(ahx, R.door[0] + 20, go / 0.45) : lerp(R.door[0] + 20, ahx + 6, (go - 0.45) / 0.55);
      const py = go < 0.45 ? lerp(ahy - 20, HB - 110, go / 0.45) - Math.sin((go / 0.45) * PI) * 50 : lerp(HB - 110, ahy - 16, ease.io((go - 0.45) / 0.55)) - Math.sin(((go - 0.45) / 0.55) * PI) * 70;
      pose(doveR, { x: px, y: py, s: 0.8, sx: go < 0.45 ? 1 : -1, o: t > 4.05 ? 1 : 0 });
      flapWings(doveR, go > 0 && go < 1 ? T * 1.4 + t * 20 : 0, go > 0 && go < 1 ? 34 : 6, 7);
      stars.forEach((st, i) => {
        const k = bump(t, 4.6 + i * 0.05, 5.0);
        pose(st, { x: ahx - 20 + i * 22, y: ahy - 50 - (i % 2) * 14, s: k, r: T * 40, o: k });
      });

      S.cam.x = kf(t, [[0, 0], [1.0, -30], [1.3, -60], [2.0, -60], [2.3, 0], [3.0, -50], [3.9, -50], [4.2, 50]]) * (PH ? 0.4 : 1);
      S.cam.z = 1 + bump(t, 1.2, 2.1) * 0.05 + es(t, 3.0, 3.3) * 0.05 * (1 - es(t, 4.9, 5)) ;
      S.cam.y = -bump(t, 3.0, 4.0) * 30;
    };
  },
};
