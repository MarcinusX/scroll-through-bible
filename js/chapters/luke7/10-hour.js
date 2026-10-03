// Łk 7,20–21 — a meadow by the lake full of the sick. John's two disciples come up the road, bow and give their
// message: "John the Baptist has sent us to ask: Are you the one who is to come, or shall we look for another?" And in
// that very hour, while they stand and watch, Jesus heals: the dark spirit tears itself out of the tormented man and
// flies off; the woman on the mat gets up; the band falls from the blind man's eyes and the blind woman looks up —
// they see.
import { C, person, CAST, blinkAt, pose, lerp, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  hillsSet, JD, BLIND, POSSESSED, mat, spirit, blindBand, addToHead, folkGroup, bubble, sparkle, painMarks, rayBurst, headAt, voiceRings, kf, moving, tr, PI,
} from './lib.js';

const GY = 742, JX = 800;
const B1 = 450, B2 = 540, MATX = 650, PX = 945, M1 = 1065, M2 = 1155;
const BLIND2 = { robe: mix(C.mauve, C.stone2, 0.4), hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.hair, skin: C.skin3, beard: 'none' };
const SICK = { robe: C.skyVeil, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair2, skin: mix(C.skin2, C.stone2, 0.3), beard: 'none' };

export default {
  id: 'lk7-hour',
  beats: [
    { v: 20 },
    { v: 21 },
  ],
  cam: { x: [-20, 170], y: [0, 50], z: [1, 1.18] },
  build(S) {
    const H = hillsSet(S, { gy: 700 });
    // phone: the two messengers stop a little further in, and the camera looks a little further right while they speak
    const MX = S.portrait ? [1030, 1092] : [M1, M2];
    const c = S.c;
    const backL = S.layer({ par: 0.5, sh: 4 });
    backL.sprite(folkGroup(makeCutter('lk7-hr-a'), 6, { s: 0.62 }), 300, 680);
    backL.sprite(folkGroup(makeCutter('lk7-hr-b'), 6, { s: 0.62, flip: true }), 1330, 680);
    const LL = S.layer({ par: 0.5, sh: 0, flat: true });
    const glow = LL.add(`<circle r="200" fill="url(#halo-glow)" opacity="0"/>`);
    const halos = [0, 1, 2, 3].map(() => LL.add(`<circle r="90" fill="url(#halo-glow)" opacity="0"/>`));
    const burst = LL.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 30, r1: 300, spread: 0.04, o: 0.4 })}</g>`);
    const P = S.layer({ par: 0.5, sh: 5 });
    // the blind: a man with a band over his eyes, a woman with closed eyes
    const bl1 = S.puppet(P.add(addToHead(person(c, { ...BLIND, eyes: 'closed' }), blindBand(c))));
    const sees1 = S.puppet(P.add(person(c, BLIND)));
    const band = P.add(`<g>${blindBand(c)}</g>`);
    const bl2 = S.puppet(P.add(person(c, { ...BLIND2, eyes: 'closed' })));
    const sees2 = S.puppet(P.add(person(c, BLIND2)));
    // the tormented man and the spirit on him
    const pos = S.puppet(P.add(person(c, { ...POSSESSED, pose: 'kneel' })));
    const freed = S.puppet(P.add(person(c, { ...POSSESSED, hairStyle: 'short', pose: 'kneel' })));
    const spEl = P.add(`<g>${spirit(c, 1.6, mix(C.storm2, C.plumRobe, 0.3))}</g>`);
    // John's messengers and Jesus
    const dis = JD.map((o, i) => ({ i, p: S.puppet(P.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    // the sick woman on her mat (in front)
    const F = S.layer({ par: 0.5, sh: 5 });
    F.add(`<g transform="translate(${MATX} ${GY + 16})">${mat(c, 150)}</g>`);
    const lying = S.puppet(F.add(person(c, { ...SICK, eyes: 'closed', pose: 'sit' })));
    const pain = F.add(`<g opacity="0">${painMarks(c, 40)}</g>`);
    const upW = S.puppet(F.add(person(c, { ...SICK, skin: C.skin2 })));
    const voice = voiceRings(P, c, { n: 2, color: C.clay, r: 26, w: 4 });
    const W = S.layer({ par: 0.52, sh: 3 });
    const msg = W.add(`<g opacity="0">${bubble(c, [tr('Jan Chrzciciel przysyła nas do Ciebie:', 'John the Baptizer has sent us to you:'), tr('Czy Ty jesteś Tym, który ma przyjść,', 'Are you he who comes,'), tr('czy też innego mamy oczekiwać?', 'or should we look for another?')], { size: 19, dir: 1 })}</g>`);
    const sparks = [0, 1, 2, 3].map((i) => W.add(`<g opacity="0">${sparkle(c, 14, i % 2 ? C.halo : C.star)}</g>`));

    return (t, time) => {
      const T = time;
      H.update(T);
      /* v20 — John's messengers come and ask */
      dis.forEach((d) => {
        const K = [[0, 1500 + d.i * 110], [0.34 + d.i * 0.03, MX[d.i]]];
        const x = kf(t, K);
        const bow = bump(t, 0.32, 0.5);
        const wonder = es(t, 1.2, 1.4);
        d.p.set({ x, y: GY + d.i * 6, s: 1.0, flip: true, walk: moving(t, K) ? x * 0.05 + d.i : undefined, armF: 16 + (d.i === 0 ? bump(t, 0.45, 1.0) * 60 : 0) + wonder * 40, armB: 10 + (d.i === 0 ? bump(t, 0.45, 1.0) * 90 : 0) + wonder * (d.i ? 110 : 60), head: bow * 18 - wonder * 6, lean: bow * 8, blink: blinkAt(T, d.seed) });
      });
      const [mhx, mhy] = headAt(MX[0], GY, 1.0, true);
      voice(mhx, mhy, bump(t, 0.4, 1.0) > 0.05 ? 0.8 : 0, T, { dir: -1, spread: 1.6 });
      const mb = es(t, 0.42, 0.55, ease.back) * (1 - es(t, 0.96, 1.02));
      pose(msg, { x: mhx - 30, y: mhy - 40, s: mb, o: mb > 0.02 ? 1 : 0 });

      /* v21 — in that hour He heals many */
      const toPos = bump(t, 1.04, 1.36);
      const toMat = bump(t, 1.3, 1.56);
      const toBlind = bump(t, 1.5, 1.8);
      const faceL = t > 1.28 && t < 1.95;
      jesus.set({ x: JX, y: GY, s: 1.06, flip: faceL, armF: 16 + toPos * 70 + toMat * 60 + toBlind * 70 + es(t, 0.3, 0.5) * 10 * (1 - es(t, 1.0, 1.1)), armB: 10 + toPos * 40 + toBlind * 60, head: es(t, 0.3, 0.5) * 4 * (1 - es(t, 1.0, 1.1)), blink: blinkAt(T) });
      const power = bump(t, 1.04, 1.9);
      pose(glow, { x: JX, y: GY - 120, s: 1, o: 0.2 + power * 0.6 });
      pose(burst, { x: JX, y: GY - 130, s: 0.6 + power * 0.5, r: t * 10, o: power * 0.7 });
      // the spirit is driven out
      const out = es(t, 1.1, 1.4, ease.in);
      pose(spEl, { x: PX + 10 + out * 260, y: GY - 170 - out * 320 + (T ? Math.sin(T * 5) * 4 : 0), r: out * 60 + (T ? Math.sin(T * 3) * 8 : 0), s: 1 - out * 0.4, o: 1 - seg(t, 1.3, 1.4) });
      const fr = es(t, 1.2, 1.26);
      pos.set({ x: PX, y: GY + 4, s: 0.96, flip: true, o: 1 - fr, armF: 150, armB: 140, head: 20 + Math.sin(t * 30) * 5, lean: 10, blink: 1 });
      freed.set({ x: PX, y: GY + 4, s: 0.96, flip: true, o: fr, armF: 70, armB: 110 + es(t, 1.3, 1.5) * 40, head: -10, blink: blinkAt(T, 7) });
      // the sick woman gets up
      const rise = es(t, 1.44, 1.5);
      lying.set({ x: MATX, y: GY + 12, s: 0.9, o: 1 - rise, armF: 70, armB: 40, head: 22, lean: 14, blink: 1 });
      pose(pain, { x: MATX - 20, y: GY - 120, o: (1 - rise) * 0.8 });
      upW.set({ x: MATX, y: GY + 14, s: 0.9, o: rise, armF: 40 + es(t, 1.5, 1.7) * 60, armB: 30 + es(t, 1.5, 1.7) * 120, head: -10, blink: blinkAt(T, 3) });
      // the blind see
      const see = es(t, 1.64, 1.7);
      const joy = es(t, 1.7, 1.86);
      bl1.set({ x: B1, y: GY - 6, s: 0.96, o: 1 - see, armF: 50, armB: 10, head: -4 });
      sees1.set({ x: B1, y: GY - 6, s: 0.96, o: see, armF: 40 + joy * 60, armB: 20 + joy * 130, head: -joy * 14, blink: blinkAt(T, 4) });
      const bf = seg(t, 1.66, 1.95);
      const [bhx, bhy] = headAt(B1, GY - 6, 0.96);
      pose(band, { x: bhx - bf * 40, y: bhy + bf * bf * 150, r: -bf * 200, s: 0.96, o: see * (1 - seg(t, 1.88, 1.96)) });
      bl2.set({ x: B2, y: GY + 4, s: 0.92, o: 1 - see, armF: 60, armB: 30, head: 6, blink: 0 });
      sees2.set({ x: B2, y: GY + 4, s: 0.92, o: see, armF: 50 + joy * 40, armB: 40 + joy * 90, head: -joy * 16, blink: blinkAt(T, 6) });
      const SP = [[PX, GY - 200, 1.2], [MATX, GY - 190, 1.46], [B1, GY - 210, 1.66], [B2, GY - 190, 1.7]];
      halos.forEach((h, i) => { const [x, , a] = SP[i]; const k = es(t, a, a + 0.15); pose(h, { x, y: GY - 110, s: 0.8 + k * 0.4, o: k * 0.7 }); });
      sparks.forEach((sp, i) => { const [x, y, a] = SP[i]; const k = bump(t, a, a + 0.4); pose(sp, { x, y, s: k, r: T * 40 + i * 30, o: k }); });

      S.cam.x = kf(t, S.portrait ? [[0, 160], [0.9, 170], [1.2, 70], [2, 55]] : [[0, 90], [0.9, 100], [1.2, 30], [2, 10]]);
      S.cam.z = kf(t, [[0, 1.12], [1.0, 1.12], [1.3, 1.06]]);
      S.cam.y = 30;
    };
  },
};
