// Łk 14,5 — a painted flat comes down: a field at noon, and the sabbath tag with its two candles hangs over it. On the
// left a boy has fallen into the well — only his arms wave above the dark water — and his father throws himself on the
// rope over the pulley and hauls him up, hand over hand, until the boy is out and in his arms. On the right an ox has
// fallen into a cistern in the field — only its horns show — and its owner pulls it up the bank by a rope round the
// horns. Which of you would not pull them out at once, even on the sabbath?
import { C, person, blinkAt, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, olive, cypress, grass, flowers, bush, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { wellParts, pitParts, ropeUnit, ropeBetween, ox, childPerson, sabbathTag, storyFrame, hand, headAt, kf, tr, mix, sheet, shade, NOON, PI } from './lib.js';

const GY = 716;
const WX0 = 560, PX0 = 950;          // the well, the cistern
const FX0 = 450, OX0 = 1168;         // the father, the ox's owner
const FATHER = { robe: C.dustyBlue, mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather };
const OWNER = { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.hair, hairStyle: 'curly', beard: 'full', skin: C.skin2, belt: C.rope };
const BOY = { robe: C.roseRobe, hair: C.hair2, hairStyle: 'curly', skin: C.skin2, belt: C.ochre };

export default {
  id: 'lk14-well',
  enter: 'fly',
  beats: [
    { v: 5 },
  ],
  cam: { x: [-40, 40], y: [0, 180], z: [1, 1.26] },
  build(S) {
    const c = S.c;
    // phone: the well and the cistern, the father and the owner closer together, inside the screen
    const P_ = S.portrait;
    const WX = P_ ? 650 : WX0, PX = P_ ? 925 : PX0, FX = P_ ? 555 : FX0, OX = P_ ? 1055 : OX0;
    sky(S, NOON);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1230, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 150), { x: 380, y: 140, len: 800 });
    const far = S.layer({ par: 0.12, sh: 2 });
    const h1 = hillsWith(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillMid, C.hillFar, 0.3), trees: 18, treeColor: C.sage, treeH: 18 });
    far.add(h1.markup + town(c, { x: 820, y: h1.fn(820) + 12, n: 7, spread: 300, sc: 0.5 }));
    const mid = S.layer({ par: 0.25, sh: 3 });
    mid.add(band(c, { y: 560, amps: [8, 3], lens: [700, 220], color: C.hillNear }).markup + olive(c, 300, 566, 0.8) + cypress(c, 760, 560, 120) + olive(c, 1300, 566, 0.7));
    const G = S.layer({ par: 0.46, sh: 3 });
    const gfn = c.wave(GY - 40, [4, 2], [700, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.sand, 0.3)).out() + grass(c, { x0: -600, x1: 2200, y: GY - 40, fn: gfn, n: 40, h: 12, color: C.moss }) + flowers(c, { x0: 620, x1: 900, y: GY - 20, fn: (x) => gfn(x) + 24, n: 8 }) + bush(c, 250, GY - 10, 70, C.sage, C.moss));
    const W = wellParts(c);
    const P = pitParts(c, 190);
    void P.lip;
    const back = S.layer({ par: 0.48, sh: 4 });
    back.add(`<g transform="translate(${WX} ${GY})">${W.back}</g><g transform="translate(${PX} ${GY - 6})">${P.hole}</g>`);
    // the boy in the well, and the ox in the cistern (behind the drum / the lip)
    const inL = S.layer({ par: 0.48, sh: 4 });
    const cid1 = S.id('wellclip'), cid2 = S.id('pitclip');
    const PW = 190;
    const arcF = c.arc(PX, GY - 6, PW / 2, 22, 0, PI, 16);
    S.defs(`<clipPath id="${cid1}" clipPathUnits="userSpaceOnUse"><rect x="-900" y="-2000" width="3400" height="${2000 + GY - 12}"/></clipPath><clipPath id="${cid2}" clipPathUnits="userSpaceOnUse"><path d="${c.poly([[-900, -2000], [2500, -2000], [2500, GY + 14], [PX + PW / 2 + 4, GY + 14], [PX + PW / 2, GY - 6], ...arcF, [PX - PW / 2, GY - 6], [PX - PW / 2 - 4, GY + 14], [-900, GY + 14]])}"/></clipPath>`);
    const boyWrap = inL.add(`<g clip-path="url(#${cid1})">${childPerson(c, BOY)}</g>`);
    const boy = S.puppet(boyWrap.querySelector('.fig'));
    const oxWrap = inL.add(`<g clip-path="url(#${cid2})"><g>${ox(c)}</g></g>`);
    const oxEl = oxWrap.firstElementChild;
    const splash = inL.add(`<g opacity="0">${sheet().p(c.cut(c.star(0, 0, 40, 18, 9, 0.2), 0.6, 4), mix(C.lake, C.foam, 0.5)).out()}</g>`);
    const front = S.layer({ par: 0.48, sh: 5 });
    front.add(`<g transform="translate(${WX} ${GY})">${W.front}</g>`);
    // the people and the ropes
    const L = S.layer({ par: 0.5, sh: 5 });
    const r1 = L.add(`<g>${ropeUnit(c, 3.2)}</g>`), r2 = L.add(`<g>${ropeUnit(c, 3.2)}</g>`), r3 = L.add(`<g>${ropeUnit(c, 3.6)}</g>`);
    const father = S.puppet(L.add(person(c, FATHER)));
    const boyOut = S.puppet(L.add(childPerson(c, BOY)));
    const owner = S.puppet(L.add(person(c, OWNER)));
    const hangTag = S.layer({ par: 0.36, sh: 5 });
    const tag = hanging(hangTag, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 800, y: 0, len: 1400 });
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 150, T, 1, 0.6);
      swing(cl, 380 + Math.sin(T * 0.1) * 16, 140, T, 1.2, 0.6, 1);
      pose(tag, { x: 800, y: lerp(-300, 330, es(t, -0.2, 0.3)), r: T ? Math.sin(T * 0.8) * 1.5 : 0, oy: 0 });
      /* the boy: waving in the water, hauled up, out and in his father's arms */
      const haul = es(t, 0.12, 0.58);
      const out = es(t, 0.6, 0.66);
      const wave = T ? Math.sin(T * 7) * 16 : 0;
      const by = lerp(GY + 90, GY - 34, haul);
      boy.set({ x: WX + 6, y: by, s: 0.62, o: 1 - out, armF: 160 + (1 - haul) * wave * 0.6, armB: 150 - (1 - haul) * wave * 0.6, head: -10, blink: 0 });
      pose(splash, { x: WX + 6, y: GY - 50, s: 0.6 + (T ? Math.sin(T * 6) * 0.08 : 0), o: (1 - es(t, 0.1, 0.3)) * 0.9 });
      const [bhx, bhy] = hand(WX + 6, by, 0.62, false, 160);
      const pulley = [WX, GY - 52 - 108];
      const pull = Math.sin(t * 40) * 6 * (haul > 0 && haul < 1 ? 1 : 0);
      father.set({ x: FX + (1 - out) * 0, y: GY + 6, s: 1.0, lean: -12 * (1 - out) + pull * 0.4, armF: lerp(150, 60, out) + pull, armB: lerp(140, 80, out) - pull, head: -10 + out * 16, blink: blinkAt(T, 2) });
      const [fhx, fhy] = hand(FX, GY + 6, 1.0, false, 150 + pull, -12 + pull * 0.4);
      ropeBetween(r1, pulley, [bhx, bhy], 1 - out);
      ropeBetween(r2, [pulley[0] - 12, pulley[1]], [fhx, fhy], 1 - out);
      boyOut.set({ x: FX + 44, y: GY + 8, s: 0.62, o: out, flip: true, armF: 120, armB: 110, head: -6, blink: blinkAt(T, 5) });
      /* the ox: only the horns in the cistern, pulled up the bank by a rope round its horns */
      const rise = es(t, 0.2, 0.62);
      const ox_x = lerp(PX - 30, PX + 30, rise) + es(t, 0.62, 0.8) * (P_ ? 10 : 50), ox_y = lerp(GY + 92, GY - 2, rise);
      pose(oxEl, { x: ox_x, y: ox_y, s: 0.8, r: -rise * (1 - es(t, 0.6, 0.7)) * 14 });
      const tug = Math.sin(t * 36) * 5 * (rise > 0 && rise < 1 ? 1 : 0);
      owner.set({ x: OX, y: GY + 6, s: 1.0, flip: true, lean: -14 * (1 - es(t, 0.66, 0.76)) + tug * 0.3, armF: 100 + tug, armB: 90 - tug, head: 6, blink: blinkAt(T, 7) });
      const [ohx, ohy] = hand(OX, GY + 6, 1.0, true, 100 + tug, -14 + tug * 0.3);
      const horn = [ox_x + (58 + 18) * 0.8, ox_y - (80 + 26) * 0.8];
      ropeBetween(r3, horn, [ohx, ohy], 1);

      S.cam.x = kf(t, [[-0.5, 0], [1, 0]]);
      S.cam.y = kf(t, [[-0.5, 120], [0.3, 170], [1, 170]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.3, 1.24], [1, 1.24]]);
      if (S.portrait) { S.cam.x = 0; S.cam.z = 1.0; }
      void headAt; void bump; void seg; void shade; void PI;
    };
  },
};
