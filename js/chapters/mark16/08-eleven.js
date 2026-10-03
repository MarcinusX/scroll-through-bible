// Mk 16,14 — The same upper room, evening, the lamps lit: the Eleven at table. In the empty place at the
// middle, light — and Jesus is there. He rebukes their unbelief and hardness of heart: stone hearts hang
// over them. On strings come down the faces of those who had seen Him — Mary Magdalene and the two from the
// road. The disciples bow their heads; at the end the stone hearts crack and warm.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { ELEVEN, MAGD, WALKERS, upperRoom, ROOM, headAt, lowTable, bowl, loaf, cup, glory, stoneHeart, heart, medallion, GLYPH, nameTag, tr, PI } from './lib.js';

const F = ROOM.floor;
const SEAT = F + 14;
const TABLE_Y = F + 58;
const JX = 800;

export default {
  id: 'm16-eleven',
  beats: [
    { v: 14, text: 'W końcu ukazał się samym Jedenastu, gdy siedzieli za stołem,' },
    { v: 14, cont: true, text: 'i wyrzucał im brak wiary i upór,' },
    { v: 14, cont: true, text: 'że nie wierzyli tym, którzy widzieli Go zmartwychwstałego.' },
  ],
  cam: { x: [-20, 20], y: [0, 60], z: [0.88, 1.12] },
  build(S) {
    const c = S.c;
    const R = upperRoom(S, { dusk: 0.75, lamps: [[610, 250], [990, 250]] });
    // the door is shut and fastened
    pose(R.door, { x: ROOM.doorX + ROOM.doorW, y: ROOM.doorTop });
    R.floorL.add(`<path d="${c.ribbon([[ROOM.doorX - 6, 590], [ROOM.doorX + ROOM.doorW + 6, 590]], 9)}" fill="${C.wood2}"/>`);

    /* the Eleven seated behind the table, a space in the middle */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const gl = PL.add(`<g opacity="0">${glory(c, 160, 18)}</g>`);
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    // phone: the table row drawn closer (and a touch smaller), so all eleven are on the screen
    const XS = S.portrait ? [498, 544, 590, 636, 682, 728, 892, 938, 984, 1030, 1076] : [420, 490, 560, 630, 700, 900, 970, 1040, 1110, 1180, 1250];
    const order = [4, 5, 3, 6, 2, 7, 1, 8, 0, 9, 10]; // Peter nearest the middle
    const M = ELEVEN.map((m, i) => {
      const x = XS[order[i]];
      return { ...m, i, x, flip: x > JX, s: S.portrait ? 0.84 : 0.9, y: SEAT - (order[i] % 2) * 6, seed: c.rr(0, 9), p: S.puppet(PL.add(person(c, { ...m.o, pose: 'sit' }))) };
    }).sort((a, b) => a.y - b.y);
    const tabL = S.layer({ par: 0.52, sh: 5 });
    tabL.add(`<g transform="translate(${JX} ${TABLE_Y})">${lowTable(c, 920, 50)}</g>`);
    const TOP = TABLE_Y - 50;
    tabL.add([[420, bowl(c, { food: 'bread' })], [520, cup(c)], [610, loaf(c, 16)], [700, bowl(c, { food: 'fruit', color: C.skyVeil })], [890, cup(c, C.clay)], [980, bowl(c, { food: 'stew' })], [1080, loaf(c, 15)], [1170, cup(c)]].map(([x, m]) => `<g transform="translate(${x} ${TOP + 2})">${m}</g>`).join(''));

    /* hardness of heart; the witnesses they did not believe */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const hearts = M.map((m) => ({ m, st: fx.add(`<g>${stoneHeart(c, 15)}</g>`), wm: fx.add(`<g>${heart(c, 15, C.jesusMantle)}</g>`), q: fx.add(`<g>${GLYPH.q(c)}</g>`) }));
    const WIT = [
      { o: MAGD, x: 640, y: 270, name: () => tr(['Maria', 'Magdalena'], ['Mary', 'Magdalene']) },
      { o: WALKERS[0], x: 950, y: 262 },
      { o: WALKERS[1], x: 1030, y: 280 },
    ].map((w, i) => ({ ...w, i, el: hanging(fx, medallion(c, w.o, { r: 36, back: mix(C.halo, C.parchment, 0.4) }), { x: w.x, y: w.y, len: 700 }) }));
    const magTag = fx.add(`<g>${nameTag(c, WIT[0].name(), { size: 14 })}</g>`);
    const twoTag = fx.add(`<g>${nameTag(c, tr(['dwaj', 'z drogi'], ['the two', 'from the road']), { size: 14 })}</g>`);

    return (t, time) => {
      R.lamps.forEach((l, i) => {
        pose(l.flame, { x: 35, y: -16, sx: 1 + Math.sin(time * 7 + i) * 0.08, sy: 1 + Math.sin(time * 5.3 + i) * 0.1 });
        fade(l.glow, 0.85);
      });
      /* v14a: light in the empty place — He is there */
      const come = es(t, 0.3, 0.8);
      pose(gl, { x: JX, y: SEAT - 110, s: 0.5 + come * 0.5 + bump(t, 0.3, 1.2) * 0.2, r: t * 5, o: come * (0.7 - es(t, 1.0, 1.4) * 0.3) });
      const rebuke = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const point = es(t, 2.1, 2.35);
      const soft = es(t, 2.7, 2.95);
      jesus.set({
        x: JX, y: SEAT - 4, s: 1.04, flip: false, o: es(t, 0.45, 0.8),
        armF: 20 + rebuke * 80 + point * 60 * (1 - soft) + soft * 40, armB: 10 + rebuke * 40 + point * 110 * (1 - soft) + soft * 50,
        head: -rebuke * 3 - point * 6 * (1 - soft) + soft * 4, blink: blinkAt(time),
      });
      const shame = es(t, 1.3, 1.6) * (1 - soft * 0.4);
      M.forEach((m) => {
        const startle = bump(t, 0.5, 1.1);
        const toJ = m.flip;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: toJ, lean: -startle * 10, armF: 40 + startle * 60 + soft * 20, armB: 20 + startle * 70, head: -startle * 10 + shame * 14 - point * 8 * (1 - shame), blink: blinkAt(time, m.seed) });
      });
      /* v14b: unbelief (a question mark) and hardness of heart (a stone heart) over each of them */
      hearts.forEach((h, i) => {
        const [hx, hy] = headAt(h.m.x, h.m.y, h.m.s, h.m.flip, 62);
        const k = es(t, 1.2 + (i % 5) * 0.06, 1.45 + (i % 5) * 0.06, ease.back);
        const warm = es(t, 2.72 + i * 0.02, 2.9 + i * 0.02);
        const bob = Math.sin(time * 1.3 + i) * 2;
        pose(h.st, { x: hx + 2, y: hy - 48 + bob, s: k * (1 + bump(t, 2.6, 2.75) * 0.15), r: Math.sin(time * 9 + i) * 8 * bump(t, 2.55, 2.75), o: k > 0.01 ? 1 - warm : 0 });
        pose(h.wm, { x: hx + 2, y: hy - 48 + bob, s: warm, o: warm > 0.01 ? 1 : 0 });
        const q = es(t, 1.35 + (i % 4) * 0.05, 1.55 + (i % 4) * 0.05, ease.back) * (1 - es(t, 2.0, 2.2));
        pose(h.q, { x: hx + (h.m.flip ? -22 : 22), y: hy - 72, s: q * 0.9, o: q > 0.01 ? 1 : 0 });
      });
      /* v14c: those who had seen Him risen */
      WIT.forEach((w) => {
        const k = es(t, 2.05 + w.i * 0.1, 2.35 + w.i * 0.1, ease.back);
        swing(w.el, w.x, lerp(-1000, w.y, k), time, 1.4, 0.8, w.i);
      });
      const tg = es(t, 2.3, 2.5, ease.back);
      pose(magTag, { x: WIT[0].x, y: WIT[0].y + 42, s: tg, o: tg > 0.01 ? 1 : 0 });
      pose(twoTag, { x: 990, y: 318, s: tg, o: tg > 0.01 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.y = 50 + es(t, 1.0, 1.4) * 10 - es(t, 2.0, 2.4) * 20;
      S.cam.z = (1.06 + es(t, 0.2, 1.0) * 0.05) * (S.portrait ? 0.86 : 1);
    };
  },
};
