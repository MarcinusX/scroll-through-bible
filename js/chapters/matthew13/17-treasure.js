// Mt 13,44–46 — one long painted flat: a field on the left, a market on the right. The field's front edge is cut
// open and under the soil lies a chest, glowing. A man hoeing strikes it, kneels, lifts the lid on the gold — and
// covers it up again, glancing round. Wild with joy he sells all he has (his jar, his rolled rug, his basket go to a
// buyer for a bag of coins), pays the owner, takes the deed and plants his staff in the field. The camera walks on to
// the market: a merchant goes along the stalls peering at pearls through his glass, none fine enough — until one
// great pearl glows in its shell. He sells all his bales, pays, and holds the pearl up in the light.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, flowers, sun, cloud, house, town, palm } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  chest, stall, pearlTray, pearl, magnifier, storeJar, basket, coin, oldScroll, DIGGER, MERCHANT, manOf, storyFrame, headAt, kf, moving, arcAt, PI,
} from './lib.js';

const PAR = 0.6;
const camFor = (x) => (x - 800) / PAR;
const GY = 652;                // ground surface (field and market)
const FACE = 700;              // the field's cut front edge
const CX = 470, CY = 760;      // the buried chest

function hoe(c) {
  return sheet().p(c.ribbon([[0, 30], [0, -96]], 4.4), C.wood2).p(c.cut([[-2, -98], [24, -102], [26, -90], [-2, -88]], 0.3, 3), C.stone2).out();
}
function bale(c, col = C.linen2) {
  return sheet().p(c.cut(c.rect(-26, -40, 52, 40), 0.6, 5), col).p(c.ribbon([[-26, -26], [26, -26]], 3) + c.ribbon([[-26, -12], [26, -12]], 3), C.rope).out();
}
function rug(c) {
  return sheet().p(c.cut(c.rect(-40, -14, 80, 28), 0.4, 5), C.terracotta).x(c.ribbon([[-30, -14], [-30, 14]], 3) + c.ribbon([[30, -14], [30, 14]], 3), C.ochre).out();
}
function shell(c) {
  const s = sheet();
  s.p(c.cut([[-40, 0], ...c.arc(0, 0, 40, 30, PI, 2 * PI, 12), [40, 0], [30, 8], [-30, 8]], 0.4, 5), mix(C.linen, C.blush, 0.3));
  let ribs = '';
  for (let i = -3; i <= 3; i++) ribs += c.ribbon([[0, 4], [i * 12, -26 + Math.abs(i) * 3]], 1.4);
  s.x(ribs, shade(mix(C.linen, C.blush, 0.3), -0.15));
  return s.out();
}

export default {
  id: 'mt13-treasure',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 44, text: 'Królestwo niebieskie podobne jest do skarbu ukrytego w roli.' },
    { v: 44, cont: true, text: 'Znalazł go pewien człowiek i ukrył ponownie.' },
    { v: 44, cont: true, text: 'Uradowany poszedł, sprzedał wszystko, co miał, i kupił tę rolę.' },
    { v: 45 },
    { v: 46 },
  ],
  cam: { x: [camFor(420) - 20, camFor(1450) + 20], y: [0, 110], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    sky(S, ['#cfe1db', '#f1e8cf', '#f8ebd2']);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1100, y: 150, len: 800 });
    const cl = hanging(hangL, cloud(c, 190), { x: 520, y: 160, len: 800 });
    S.layer({ par: 0.12, sh: 2 }).add(band(c, { y: 440, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    const mid = S.layer({ par: 0.3, sh: 3 });
    const m2 = hillsWith(c, { y: 520, amps: [14, 6, 2], lens: [900, 300, 110], color: C.hillMid, trees: 24, treeColor: C.sage, treeH: 22, x0: -900, x1: 2600 });
    mid.add(m2.markup + town(c, { x: 1320, y: m2.fn(1320) + 8, n: 9, spread: 360, sc: 0.62 }));

    /* the ground: field (left) with its cut face, the market square (right) */
    const ground = S.layer({ par: PAR, sh: 4 });
    const G = sheet();
    G.p(c.ridge(c.wave(GY - 20, [4, 2], [700, 170]), -900, 2600, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.5));
    G.p(c.cut([[290, GY - 22], [760, GY - 26], [770, FACE], [280, FACE]], 0.8, 10), mix(C.soil, C.clay, 0.5));
    let fur = '';
    for (let i = 0; i < 4; i++) fur += c.ribbon([[290, GY - 12 + i * 12], [760, GY - 14 + i * 12]], 2);
    G.x(fur, shade(C.soil, -0.1), 'opacity=".6"');
    G.p(c.cut([[280, FACE], [770, FACE], [770, 860], [280, 860]], 0.6, 10), C.soil);
    G.p(c.cut([[280, 800], [770, 800], [770, 1700], [280, 1700]], 0.6, 10), shade(C.soil, -0.2));
    G.p(c.cut([[900, GY - 26], [1760, GY - 26], [1760, 1700], [900, 1700]], 0.8, 16), mix(C.stone, C.sand, 0.4));
    let cob = '';
    for (let i = 0; i < 70; i++) cob += c.cut(c.blob(c.rr(910, 1750), c.rr(GY - 10, 900), c.rr(8, 16), c.rr(4, 7), 8, 0.2), 0.3, 4);
    G.x(cob, C.stone2, 'opacity=".6"');
    ground.add(G.out());
    ground.add(house(c, 90, GY - 30, 120, 90, { stairs: false }) + olive(c, 820, GY - 24, 0.8) + cypress(c, 870, GY - 22, 120) + bush(c, 40, GY - 20, 60, C.sage, C.moss));
    // the stalls
    ground.add(`<g transform="translate(1180 ${GY + 4})">${stall(c, { w: 240, awn: C.dustyBlue })}</g><g transform="translate(1570 ${GY + 4})">${stall(c, { w: 220, awn: C.terracotta })}</g>`);
    ground.add(`<g transform="translate(1130 ${GY - 76})">${pearlTray(c, 70, 8)}</g><g transform="translate(1230 ${GY - 76})">${pearlTray(c, 70, 7)}</g><g transform="translate(1520 ${GY - 76})">${pearlTray(c, 60, 6)}</g>`);
    // the chest under the soil, the hole, the mound
    const props = S.layer({ par: PAR, sh: 5 });
    const box = props.add(`<g>${chest(c, { w: 90, h: 50 })}</g>`);
    const lid = box.querySelector('.lid'), boxGlow = box.querySelector('.glow');
    const pulse = props.add(`<circle r="80" fill="url(#warm-glow)" opacity="0"/>`);
    const mound = props.add(`<g>${sheet().p(c.cut([[-50, 0], ...c.arc(0, 0, 50, 18, PI, 2 * PI, 10), [50, 0]], 0.6, 5), mix(C.soil, C.clay, 0.4)).out()}</g>`);
    // the great pearl in its shell
    const bigPearl = props.add(`<g><circle r="60" fill="url(#halo-glow)"/><g transform="translate(0 18)">${shell(c)}</g><g transform="translate(0 2)">${pearl(15)}</g></g>`);

    /* people */
    const ppl = S.layer({ par: PAR, sh: 6 });
    const OWNER = { robe: C.stone, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.dustyBlue, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather };
    const owner = S.puppet(ppl.add(person(c, { ...OWNER, holdF: `<g data-k="deed">${oldScroll(c, 40)}</g>` })));
    const deed = S.$('deed');
    const buyer = S.puppet(ppl.add(person(c, manOf(c, { robe: C.ochreRobe, mantle: C.wood3, belt: C.leather }))));
    const digger = S.puppet(ppl.add(person(c, { ...DIGGER, holdF: `<g transform="translate(0 2) rotate(170)">${hoe(c)}</g>` })));
    const kneel = S.puppet(ppl.add(person(c, { ...DIGGER, pose: 'kneel' })));
    const free = S.puppet(ppl.add(person(c, DIGGER)));
    const staff = ppl.add(`<g>${sheet().p(c.ribbon([[0, 0], [0, -150]], 5), C.wood2).p(c.cut([[0, -150], [44, -140], [0, -126]], 0.3, 4), C.jesusMantle).out()}</g>`);
    const goods = [
      { m: `<g transform="translate(0 0)">${storeJar(c, 50)}</g>` },
      { m: `<g transform="translate(0 -10)">${rug(c)}</g>` },
      { m: `<g>${basket(c, { w: 50, h: 30, full: true })}</g>` },
    ].map((g, i) => ({ i, el: ppl.add(`<g>${g.m}</g>`) }));
    const coins = Array.from({ length: 6 }, (_, i) => ({ i, el: ppl.add(`<g>${coin(c, 9)}</g>`) }));
    const seller = S.puppet(ppl.add(person(c, manOf(c, { robe: C.tealRobe, mantle: C.ochre, hairStyle: 'wrap', veil: C.cream }))));
    const merchant = S.puppet(ppl.add(person(c, { ...MERCHANT, holdF: `<g transform="translate(0 2) scale(.3) rotate(-40)">${magnifier(c, '')}</g>` })));
    const merchantUp = S.puppet(ppl.add(person(c, { ...MERCHANT, holdF: `<g transform="translate(0 6)"><circle r="30" fill="url(#halo-glow)"/>${pearl(11)}</g>` })));
    const bales = [0, 1].map((i) => ({ i, el: ppl.add(`<g>${bale(c, i ? C.wheatRobe : C.linen2)}</g>`) }));
    const lookQ = ppl.add(`<g><circle r="16" fill="${C.cream}"/><text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="20" fill="${C.terracotta}">…</text></g>`);
    storyFrame(S);

    const CAMX = [[0, camFor(420)], [2.9, camFor(420)], [3.3, camFor(S.portrait ? 1450 : 1380)]];   // phone: the pearl seller stays on the screen

    return (t, time) => {
      const T = time;
      swing(sunEl, 1100, 150, T, 1, 0.6);
      swing(cl, 520 + Math.sin(T * 0.1) * 20, 160, T, 1.2, 0.6, 1);

      /* v44a — the treasure hidden in the field */
      const hoeing = t < 1.1 ? Math.abs(Math.sin(t * PI * 3)) : 0;
      const dx = kf(t, [[0, 330], [0.9, 400]]);
      const kn = seg(t, 1.1, 1.18) * (1 - seg(t, 1.9, 1.98));
      const joy = es(t, 2.0, 2.15) * (1 - es(t, 2.9, 3.0));
      digger.set({ x: dx, y: GY, s: 1.0, o: t < 1.1 ? 1 : 0, walk: t < 0.9 ? dx * 0.04 : undefined, armF: 40 + hoeing * 80, armB: 20 + hoeing * 30, head: 10, lean: hoeing * 6, blink: blinkAt(T) });
      kneel.set({ x: 420, y: GY, s: 1.0, o: kn, armF: 70 + bump(t, 1.5, 1.85) * 40, armB: 50, head: 14 - bump(t, 1.6, 1.9) * 30, blink: blinkAt(T, 1) });
      const FK = [[1.95, 420], [2.1, 540], [2.36, 540], [2.5, 290], [2.62, 290], [2.72, 420]];
      const fx = kf(t, FK);
      const hop = t > 1.98 && t < 2.2 ? Math.abs(Math.sin((t - 1.98) * PI * 8)) * 14 : 0;
      free.set({ x: fx, y: GY - hop, s: 1.0, flip: t > 2.36 && t < 2.62, o: seg(t, 1.9, 1.98), walk: moving(t, FK) ? fx * 0.05 : undefined, armF: 30 + joy * 110 + bump(t, 2.48, 2.62) * 40, armB: 20 + joy * 130, head: -joy * 10, blink: blinkAt(T, 2) });
      pose(box, { x: CX, y: CY, s: 1 });
      const lidK = es(t, 1.35, 1.55) * (1 - es(t, 1.7, 1.85));
      pose(lid, { x: -46, y: -50, r: -lidK * 80 });
      fade(boxGlow, lidK);
      pose(pulse, { x: CX, y: CY - 26, s: 1 + Math.sin(T * 2.4) * 0.06, o: 0.55 + lidK * 0.4 });
      const cover = es(t, 1.72, 1.92);
      pose(mound, { x: 470, y: GY + 2, s: 0.4 + cover * 0.6, o: cover > 0.01 ? 1 : 0 });

      /* v44c — sells all, buys the field */
      goods.forEach((g) => {
        const k = seg(t, 2.1 + g.i * 0.05, 2.28 + g.i * 0.05);
        const [x, y] = arcAt(ease.io(k), [560 + g.i * 40, GY - 4], [700, GY - 60], 80);
        pose(g.el, { x, y, o: k < 0.98 && t > 2.0 ? 1 : 0 });
      });
      const buyIn = es(t, 2.0, 2.15) * (1 - es(t, 2.45, 2.6));
      buyer.set({ x: lerp(1000, 720, buyIn), y: GY, s: 0.98, flip: true, o: buyIn > 0.01 ? 1 : 0, armF: 40 + bump(t, 2.2, 2.5) * 50, blink: blinkAt(T, 3) });
      coins.forEach((cn) => {
        const k1 = seg(t, 2.24 + cn.i * 0.015, 2.34 + cn.i * 0.015);
        const k2 = seg(t, 2.5 + cn.i * 0.015, 2.6 + cn.i * 0.015);
        let [x, y] = arcAt(ease.io(k1), [720, GY - 150], [560, GY - 130], 40);
        if (k2 > 0) [x, y] = arcAt(ease.io(k2), [320, GY - 130], [200, GY - 120], 50);
        pose(cn.el, { x, y, r: T * 60, o: (k1 > 0 && k1 < 1) || (k2 > 0 && k2 < 1) ? 1 : 0 });
      });
      const give = es(t, 2.56, 2.66);
      owner.set({ x: 180, y: GY, s: 1.0, armF: 20 + give * 70 * (1 - es(t, 2.64, 2.7)), armB: 10 + bump(t, 2.5, 2.62) * 40, head: -4, blink: blinkAt(T, 4) });
      fade(deed, give * (1 - seg(t, 2.64, 2.66)));
      const plant = es(t, 2.64, 2.76, ease.back);
      pose(staff, { x: 480, y: GY + 4 - (1 - plant) * 60, s: 1, o: plant > 0.01 ? 1 : 0 });

      /* v45 — the merchant seeking fine pearls */
      const mk = [[3.0, 1020], [3.35, 1140], [3.7, 1230], [4.0, 1480]];
      const mx = kf(t, mk);
      const up = es(t, 4.45, 4.6);
      merchant.set({ x: mx, y: GY, s: 1.02, o: 1 - up, walk: moving(t, mk) ? mx * 0.05 : undefined, armF: 70 + bump(t, 3.35, 3.7) * 40, armB: 10 + es(t, 4.1, 4.3) * 40, head: 8 - bump(t, 3.55, 3.7) * 16, blink: blinkAt(T, 5) });
      pose(lookQ, { x: mx + 30, y: GY - 250, s: bump(t, 3.4, 3.9), o: bump(t, 3.4, 3.9) > 0.05 ? 1 : 0 });
      /* v46 — the pearl of great price; he sells all and buys it */
      const found = es(t, 4.0, 4.2);
      pose(bigPearl, { x: 1580, y: GY - 96 - found * 10, s: 0.8 + found * 0.35 + Math.sin(T * 2) * 0.02, o: 1 });
      bales.forEach((b) => {
        const k = seg(t, 4.12 + b.i * 0.08, 4.35 + b.i * 0.08);
        const [x, y] = arcAt(ease.io(k), [1420 - b.i * 50, GY], [S.portrait ? 1690 : 1740, GY - 20], 70);
        pose(b.el, { x, y, o: k < 0.98 && t > 3.0 ? 1 : 0 });
      });
      seller.set({ x: 1650, y: GY, s: 0.98, flip: true, armF: 30 + bump(t, 4.2, 4.5) * 60, blink: blinkAt(T, 6) });
      merchantUp.set({ x: 1500, y: GY, s: 1.02, o: up, armF: 150, armB: 30, head: -14, blink: blinkAt(T, 5) });

      S.cam.x = kf(t, CAMX);
      S.cam.z = kf(t, [[0, 1.16], [0.9, 1.2], [1.1, 1.26], [1.95, 1.26], [2.2, 1.14], [2.95, 1.14], [3.3, 1.18], [4.0, 1.24]]);
      S.cam.y = kf(t, [[0, 80], [0.9, 100], [1.1, 110], [1.95, 110], [2.2, 70], [2.95, 70], [3.3, 60], [4.0, 80]]);
    };
  },
};
