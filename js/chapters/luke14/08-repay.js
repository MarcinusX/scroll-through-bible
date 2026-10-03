// Łk 14,12–14 — a painted flat of the host's own courtyard under a vine arbour; the ruler of the Pharisees, "you",
// stands at the head of his table. At it sit his friend, his brother, a kinswoman and a rich neighbour, and little tags
// come down over them on strings: friends, brothers, relatives, rich neighbours. Each of them lifts an invitation of his
// own, and the four scrolls fly back into the host's hands: he has been paid back. Then they are gone, and through the
// gate come the poor, a man with his arm in a sling, a lame man on his crutch, a blind man feeling his way with a stick;
// they sit down at the table. They open their empty hands — they have nothing to repay him with — and a warm light rises
// behind him: happy is he. Then dawn comes up over the hills, a great sun rises, little figures in white rise on the far
// slope — the resurrection of the just — and a golden wreath comes down onto the host's head.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  courtFlat, courtRow, CF, KIN, RULER, POOR, MAIMED, LAMEM, BLINDM, invitation, tagOnString, label, heart, sparkle, wreath, sling, wrap, crutchHeld, stickHeld,
  pose3, headAt, hand, kf, moving, popAt, flyTo, addToBody, makeCutter, tr, mix, sheet,
} from './lib.js';

const TAGS1 = [['przyjaciele', 'friends'], ['bracia', 'brothers'], ['krewni', 'kinsmen'], ['bogaci sąsiedzi', 'rich neighbors']];
const TAGS2 = [['ubodzy', 'the poor'], ['ułomni', 'the maimed'], ['chromi', 'the lame'], ['niewidomi', 'the blind']];
const PSEATS = [586, 690, 902, 1006];

export default {
  id: 'lk14-repay',
  enter: 'fly',
  beats: [
    { v: 12, cont: true, text: 'nie zapraszaj swoich przyjaciół ani braci, ani krewnych, ani zamożnych sąsiadów,' },
    { v: 12, cont: true, text: 'aby cię i oni nawzajem nie zaprosili, i miałbyś odpłatę.' },
    { v: 13 },
    { v: 14, text: 'A będziesz szczęśliwy, ponieważ nie mają czym tobie się odwdzięczyć;' },
    { v: 14, cont: true, text: 'odpłatę bowiem otrzymasz przy zmartwychwstaniu sprawiedliwych».' },
  ],
  cam: { x: [-60, 100], y: [-40, 120], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const F = courtFlat(S);
    const kinRest = F.seatL.sprite(courtRow(makeCutter('lk14-kin'), KIN, { seats: PSEATS }), 800, CF.SEAT);
    const kinInv = F.seatL.sprite(courtRow(makeCutter('lk14-kin'), KIN, { seats: PSEATS, arms: 'invite' }), 800, CF.SEAT);
    const POORS = [POOR, MAIMED, LAMEM, BLINDM];
    const poorLooks = POORS.map((o, i) => (i === 1 ? { ...o } : o));
    const poorSit = F.seatL.sprite(courtRow(makeCutter('lk14-poor'), poorLooks, { seats: PSEATS }), 800, CF.SEAT);
    const poorOpen = F.seatL.sprite(courtRow(makeCutter('lk14-poor'), poorLooks, { seats: PSEATS, arms: 'open' }), 800, CF.SEAT);
    // the poor coming in through the gate
    const walkers = POORS.map((o, i) => {
      let m = person(c, { ...o, holdF: i === 2 ? crutchHeld(c) : i === 3 ? stickHeld(c) : i === 1 ? wrap(c) : '' });
      if (i === 1) m = addToBody(m, sling(c));
      return S.puppet(F.frontL.add(m));
    });
    const glow = F.seatL.add(`<g opacity="0"><ellipse rx="120" ry="170" fill="url(#warm-glow)"/></g>`);
    const host = S.puppet(F.frontL.add(person(c, RULER)));
    const invs = [0, 1, 2, 3].map(() => F.fx.add(`<g opacity="0">${invitation(c, 30)}</g>`));
    const stack = F.fx.add(`<g opacity="0">${[0, 1, 2, 3].map((k) => `<g transform="translate(${k % 2 ? 3 : -2} ${-k * 7}) rotate(${k % 2 ? 4 : -3})">${invitation(c, 30)}</g>`).join('')}</g>`);
    const repaid = F.fx.add(`<g opacity="0">${label(c, tr('odpłata', 'paid back'), { size: 18 })}</g>`);
    const tags1 = TAGS1.map(([p, e]) => F.tagL.add(`<g opacity="0">${tagOnString(c, tr(p, e), { size: 16 })}</g>`));
    const tags2 = TAGS2.map(([p, e]) => F.tagL.add(`<g opacity="0">${tagOnString(c, tr(p, e), { size: 16 })}</g>`));
    const hrt = F.fx.add(`<g opacity="0">${heart(c, 18)}</g>`);
    const happy = F.fx.add(`<g opacity="0">${label(c, tr('szczęśliwy', 'blessed'), { size: 18, fill: C.halo })}</g>`);
    const wr = F.fx.add(`<g opacity="0"><g transform="scale(-1 1)">${wreathGold(c)}</g></g>`);
    const risen = F.risenL.sprite(pose3(makeCutter('lk14-risen'), Array.from({ length: 11 }, (_, i) => ({ x: -300 + i * 60 + (i % 2) * 14, y: (i % 3) * 8, s: 0.3, flip: i > 5, head: -12, armF: 20, armB: 150, o: { robe: C.linen, mantle: null, hairStyle: i % 2 ? 'veil' : 'short', veil: C.linen, hair: [C.hair, C.hair2, C.greyHair][i % 3], beard: i % 2 ? 'none' : 'short', skin: [C.skin, C.skin2, C.skin3][i % 3] } }))), 800, 492);
    const sparks = [0, 1, 2, 3].map((i) => F.fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      const HX = S.portrait ? 1060 : CF.HX, FL = CF.FL;   // phone: the host stands inside the screen
      /* v12b — friends, brothers, relatives, rich neighbours */
      const gone = es(t, 2.0, 2.12);
      const lift = es(t, 1.06, 1.16) * (1 - es(t, 1.5, 1.56));
      kinRest.set({ o: (1 - lift) * (1 - gone) });
      kinInv.set({ o: lift * (1 - gone) });
      tags1.forEach((e, i) => {
        const k = es(t, 0.14 + i * 0.12, 0.32 + i * 0.12, ease.out) * (1 - es(t, 1.9, 2.06, ease.in));
        const [hx, hy] = headAt(PSEATS[i], CF.SEAT, 0.96, false, 62);
        flyTo(e, k, hx, hy - 96, T, i, 1);
      });
      /* v12c — the invitations come back to him */
      const [hhx, hhy] = hand(HX, FL, 1.02, true, 70);
      invs.forEach((e, i) => {
        const [sx, sy] = hand(PSEATS[i], CF.SEAT, 0.96, false, 110, 0, 62);
        const u = es(t, 1.36 + i * 0.07, 1.62 + i * 0.07);
        pose(e, { x: lerp(sx, hhx, u), y: lerp(sy - 20, hhy - 10, u) - Math.sin(u * Math.PI) * 90, r: u * 200, o: u > 0 && u < 1 ? 1 : 0 });
      });
      const got = es(t, 1.62, 1.9);
      pose(stack, { x: hhx, y: hhy - 6, o: seg(t, 1.6, 1.64) * (1 - es(t, 2.0, 2.1)) });
      popAt(repaid, t, 1.72, 2.08, HX - 20, 500, { d: 0.12 });
      /* v13 — the poor, the maimed, the lame, the blind come in and sit down */
      const inK = [[2.08, 250], [2.44, 0]];
      walkers.forEach((p, i) => {
        const dx = kf(t, inK);
        const x = PSEATS[i] - 40 - dx - (3 - i) * 30 + 0;
        const walking = moving(t, inK);
        const seated = es(t, 2.46, 2.5);
        p.set({ x: x - 0, y: FL + (i % 2) * 6, s: 0.98, o: seg(t, 2.06, 2.12) * (1 - seated), walk: walking ? x * 0.04 + i : undefined, amt: i === 2 ? 0.4 : 0.7, armF: i === 3 ? 40 : i === 2 ? 12 : 16, armB: i === 3 ? 30 : 8, head: i === 3 ? -4 : 4, lean: i === 0 ? 6 : 0, blink: blinkAt(T, i + 3) });
      });
      const open = es(t, 3.1, 3.2);
      const seatedPoor = es(t, 2.46, 2.5);
      poorSit.set({ o: seatedPoor * (1 - open) });
      poorOpen.set({ o: open });
      tags2.forEach((e, i) => {
        const k = es(t, 2.2 + i * 0.06, 2.4 + i * 0.06, ease.out) * (1 - es(t, 3.9, 4.06, ease.in));
        const [hx, hy] = headAt(PSEATS[i], CF.SEAT, 0.96, false, 62);
        flyTo(e, k, hx, hy - 96, T, i + 4, 1);
      });
      /* the host */
      const serve = bump(t, 2.5, 3.0);
      const joy = es(t, 3.2, 3.4);
      const crown = es(t, 4.3, 4.55, ease.out);
      host.set({ x: HX, y: FL, s: 1.02, flip: true, armF: 30 + bump(t, 0.1, 0.9) * 30 + got * 40 * (1 - gone) + serve * 50 + joy * 40, armB: 10 + bump(t, 2.1, 2.6) * 110 + joy * 30, head: 4 - crown * 8, blink: blinkAt(T, 3) });
      /* v14a — they have nothing to repay: blessed */
      pose(glow, { x: HX, y: FL - 110, o: joy * 0.9 });
      const [hdx, hdy] = headAt(HX, FL, 1.02, true);
      popAt(hrt, t, 3.3, undefined, hdx - 4, hdy - 62 + (T ? Math.sin(T * 2) * 3 : 0), { d: 0.12 });
      popAt(happy, t, 3.4, 4.2, hdx + (S.portrait ? 6 : -20), hdy - (S.portrait ? 150 : 110), { d: 0.12 });   // phone: clear of the tags
      /* v14b — the resurrection of the just */
      const dawn = es(t, 4.02, 4.4);
      F.dawnL.fade(dawn);
      pose(F.sunUp, { x: 820, y: lerp(640, 430, es(t, 4.05, 4.6)), s: 1, o: dawn });
      risen.set({ x: 800, y: 492 - es(t, 4.2, 4.6) * 24, o: es(t, 4.2, 4.4) });
      pose(wr, { x: hdx, y: lerp(hdy - 200, hdy + 1, crown), o: crown > 0.01 ? 1 : 0 });
      sparks.forEach((e, i) => {
        const a = -Math.PI / 2 + (i - 1.5) * 0.6, u = seg(t, 4.5 + i * 0.04, 4.9 + i * 0.04);
        pose(e, { x: hdx + Math.cos(a) * (30 + u * 50), y: hdy + Math.sin(a) * (30 + u * 50), s: Math.sin(u * Math.PI), r: u * 90, o: u > 0 && u < 1 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 0], [0.9, 0], [1.3, 40], [2.0, 30], [2.2, -30], [2.6, 0], [3.0, 30], [4.0, 20], [4.3, 0]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.5, 80], [4.0, 80], [4.4, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [0.5, 1.1], [4.0, 1.1], [4.4, 1.02]]);
      if (S.portrait) { S.cam.x = kf(t, [[0, 0], [0.9, 0], [1.3, 100], [2.0, 60], [2.2, -60], [2.6, 0], [3.0, 100], [4.0, 90], [4.4, 40]]); S.cam.z = 1.0; }
      void mix; void sheet; void wreath;
    };
  },
};
function wreathGold(c) {
  let d = '', fl = '';
  for (let i = 0; i < 11; i++) {
    const a = Math.PI * (1.0 + i * 0.1);
    d += c.cut(c.ell(Math.cos(a) * 20, Math.sin(a) * 20 - 2, 7, 3.6, 8, a + Math.PI / 2), 0.2, 3);
    if (i % 2 === 0) fl += c.cut(c.circ(Math.cos(a) * 21, Math.sin(a) * 21 - 3, 3, 8), 0.2, 2);
  }
  return sheet().p(d, C.leaf).p(fl, C.sun).out();
}
