// Łk 11,5–8 — the parable flies in as a painted flat: a village street at midnight under the moon, two little houses
// cut open on either side of it. In the left one a traveller has just arrived — dusty, his staff and bundle beside
// him — and sits at an empty table. His host takes his lantern and crosses the dark street to his friend's house and
// knocks: "Friend, lend me three loaves" (three loaves in his bubble). "For a friend of mine has come from a journey
// and I have nothing to set before him": the lantern turns back to the left house — the traveller at the table, the
// bread basket empty. In the right house the whole family lies asleep on one mat; the father lifts his head: "Don't
// bother me!" "The door is already shut, my children are with me in bed": the bar across the door glows, the children
// sleep on. "I cannot get up and give you anything": he lies down again. But the knocking goes on and on — and at last
// he gets up, lights his lamp, lifts the bar, opens the door and hands out the loaves, a whole basket of them.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, moon, stars, house } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { ASKER, TRAVELLER, SLEEPER, SLEEPWIFE, loaf, bowl, basket, basketEmpty, smallLamp, lanternHeld, knockMarks, zzz, say, speech, sparkle, headP, handAt, kf, moving, tr, PI, NIGHT } from './lib.js';

const GY = 700;
const LH = { x0: 350, x1: 636, ceil: 452 };      // the asker's house
const RH = { x0: 872, x1: 1236, ceil: 440 };     // the friend's house
const DOOR = { top: 546, x: RH.x0 };             // the friend's door, in the street wall of his house
const KX = 792;                                  // where the asker stands to knock
const MAT = { x0: 936, x1: 1190, y: GY - 12 };

/** a house cut open: back wall, floor, roof slab and the side wall on the street with a doorway; side: 1 = door on the right */
function openHouse(c, { x0, x1, ceil }, side, { wall = C.plaster, shadowCol = C.plaster2 } = {}) {
  const s = sheet();
  s.p(c.cut([[x0, ceil], [x1, ceil], [x1, GY + 4], [x0, GY + 4]], 0.6, 10), mix(wall, C.night, 0.28));
  let patch = '';
  for (let i = 0; i < 5; i++) patch += c.cut(c.blob(c.rr(x0 + 30, x1 - 30), c.rr(ceil + 30, GY - 60), c.rr(20, 44), c.rr(10, 20), 10, 0.2), 0.6, 6);
  s.x(patch, mix(shadowCol, C.night, 0.3), 'opacity=".6"');
  s.p(c.cut([[x0 - 10, GY - 6], [x1 + 10, GY - 6], [x1 + 14, GY + 30], [x0 - 14, GY + 30]], 0.5, 10), mix(C.sand2, C.night, 0.25));
  // the roof slab with a parapet
  s.p(c.cut([[x0 - 30, ceil - 30], [x1 + 30, ceil - 30], [x1 + 30, ceil + 4], [x0 - 30, ceil + 4]], 0.5, 10), mix(C.wood2, C.night, 0.2));
  s.p(c.cut([[x0 - 34, ceil - 50], [x1 + 34, ceil - 50], [x1 + 34, ceil - 30], [x0 - 34, ceil - 30]], 0.5, 10), mix(wall, C.night, 0.2));
  // the far side wall (no door) and the street wall with a doorway
  const far = side > 0 ? x0 : x1, near = side > 0 ? x1 : x0;
  s.p(c.cut([[far - 16, ceil - 30], [far + 16, ceil - 30], [far + 16, GY + 30], [far - 16, GY + 30]], 0.5, 8), mix(C.stone, C.night, 0.15));
  s.p(c.cut([[near - 14, ceil - 30], [near + 14, ceil - 30], [near + 14, DOOR.top], [near - 14, DOOR.top]], 0.5, 8), mix(C.stone, C.night, 0.15));
  s.p(c.cut([[near - 18, DOOR.top - 10], [near + 18, DOOR.top - 10], [near + 18, DOOR.top + 2], [near - 18, DOOR.top + 2]], 0.3, 6), C.wood2);
  return s.out();
}

export default {
  id: 'lk11-midnight',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 5 },
    { v: 6 },
    { v: 7, text: 'Lecz tamten odpowie z wewnątrz: "Nie naprzykrzaj mi się!' },
    { v: 7, cont: true, text: 'Drzwi są już zamknięte i moje dzieci leżą ze mną w łóżku.' },
    { v: 7, cont: true, text: 'Nie mogę wstać i dać tobie".' },
    { v: 8 },
  ],
  cam: { x: [-90, 110], y: [-20, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    sky(S, NIGHT);
    const skyL = S.layer({ par: 0.04, sh: 2 });
    skyL.add(stars(c, { x0: -600, x1: 2200, y0: -600, y1: 420, n: 110 }));
    const mn = hanging(skyL, moon(c, 40), { x: 0, y: -1500, len: 900 });
    const far = S.layer({ par: 0.12, sh: 2 });
    far.add(band(c, { y: 500, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.night, 0.55) }).markup);
    const mid = S.layer({ par: 0.22, sh: 3 });
    let hs = '';
    [[-300, 90, 70], [-120, 110, 60], [80, 90, 80], [250, 120, 70], [1330, 110, 80], [1500, 90, 60], [1700, 120, 70]].forEach(([x, w, h]) => { hs += house(c, x, 600, w, h, { stairs: false, wall: mix(C.plaster, C.night, 0.45), shadow: mix(C.plaster2, C.night, 0.55) }); });
    mid.add(hs);
    /* the street */
    const G = S.layer({ par: 0.36, sh: 3 });
    G.add(sheet().p(c.cut([[-1100, GY - 20], [2700, GY - 20], [2700, 1900], [-1100, 1900]], 0.6, 16), mix(C.sand, C.night, 0.4)).out());

    /* the two houses */
    const HL_ = S.layer({ par: 0.4, sh: 4 });
    HL_.add(openHouse(c, LH, 1) + openHouse(c, RH, -1));
    HL_.add(`<g transform="translate(${LH.x0 + 80} ${LH.ceil + 110})">${sheet().p(c.cut(c.rect(-50, 0, 100, 7), 0.3, 5), C.wood).out()}</g>`);
    const shelfBasket = HL_.add(`<g>${basketEmpty(c)}</g>`);
    const glowL = S.layer({ par: 0.4, sh: 0, flat: true });
    const leftLamp = glowL.add(`<g>${smallLamp(c)}<circle cx="26" cy="-22" r="170" fill="url(#warm-glow)" opacity=".45"/></g>`);
    const rightLamp = glowL.add(`<g opacity="0">${smallLamp(c)}<circle cx="26" cy="-22" r="200" fill="url(#warm-glow)" opacity=".5"/></g>`);

    /* inside the left house: the traveller at the empty table */
    const P = S.layer({ par: 0.42, sh: 5 });
    P.add(`<g transform="translate(540 ${GY + 4})">${sheet().p(c.cut([[-60, -44], [60, -44], [56, -32], [-56, -32]], 0.4, 6), C.wood).p(c.cut(c.rect(-50, -34, 10, 34), 0.3, 4) + c.cut(c.rect(40, -34, 10, 34), 0.3, 4), C.wood2).out()}</g>`);
    P.add(`<g transform="translate(560 ${GY - 40})">${bowl(c, { w: 36, food: null, color: C.pot })}</g>`);
    P.add(`<g transform="translate(410 ${GY - 4})">${sheet().p(c.ribbon([[0, 0], [30, -150]], 5), C.wood2).p(c.cut(c.blob(-14, -14, 26, 16, 10, 0.2), 0.6, 5), C.stone2).out()}</g>`);
    const trav = S.puppet(P.add(person(c, { ...TRAVELLER, pose: 'sit' })));
    /* the asker with his lantern */
    const asker = S.puppet(P.add(person(c, { ...ASKER, holdF: `<g data-k="lantern">${lanternHeld(c, 40)}</g>` })));
    const lantern = S.$('lantern');
    const basketHeld = P.add(`<g opacity="0">${basket(c, { w: 58, h: 34, full: true })}</g>`);

    /* inside the right house: the family on one mat */
    const bedL = S.layer({ par: 0.42, sh: 4 });
    bedL.add(sheet().p(c.cut([[MAT.x0, MAT.y], [MAT.x1, MAT.y - 2], [MAT.x1 + 6, MAT.y + 12], [MAT.x0 - 6, MAT.y + 12]], 0.5, 8), C.basket).out());
    // the wife and the two children, heads on the pillow at the left end, bodies under the blanket
    bedL.add(sheet().p(c.cut(c.blob(1100, MAT.y - 40, 90, 16, 12, 0.12), 0.5, 5), mix(C.linen2, C.skyVeil, 0.4)).out());
    const heads = [[1150, MAT.y - 56, 0.7, SLEEPWIFE], [1052, MAT.y - 52, 0.56, { robe: C.sageRobe, hair: C.hair2, hairStyle: 'curly', skin: C.skin2 }], [1100, MAT.y - 50, 0.52, { robe: C.roseRobe, hairStyle: 'veil', veil: C.wheat, veil2: C.ochre, hair: C.hair3, skin: C.skin }]];
    heads.forEach(([x, y, sc, o], i) => { const id = S.id('hd' + i); bedL.add(`<g transform="translate(${x} ${y}) rotate(-8) scale(${sc})"><clipPath id="${id}"><rect x="-50" y="-60" width="100" height="86"/></clipPath><g clip-path="url(#${id})"><g transform="translate(0 167)">${person(c, { ...o, eyes: 'closed', beard: 'none' })}</g></g></g>`); });
    const lying = S.puppet(bedL.add(person(c, { ...SLEEPER, eyes: 'closed' })));
    const blanketL = S.layer({ par: 0.42, sh: 5 });
    const blanket = blanketL.add(`<g>${sheet().p(c.cut([[1016, MAT.y - 40], [1060, MAT.y - 50], [MAT.x1 - 30, MAT.y - 50], [MAT.x1 - 4, MAT.y - 30], [MAT.x1, MAT.y + 4], [1010, MAT.y + 6], [1002, MAT.y - 20]], 0.8, 8), mix(C.plumRobe, C.dustyBlue, 0.4)).x(c.ribbon([[1030, MAT.y - 30], [MAT.x1 - 10, MAT.y - 26]], 3) + c.ribbon([[1024, MAT.y - 12], [MAT.x1 - 10, MAT.y - 10]], 3), C.wheat, 'opacity=".7"').out()}</g>`);
    const sit = S.puppet(blanketL.add(person(c, { ...SLEEPER, pose: 'sit' })));
    const stand = S.puppet(blanketL.add(person(c, SLEEPER)));
    const give = blanketL.add(`<g opacity="0">${basket(c, { w: 58, h: 34, full: true })}</g>`);
    const flyLoaves = [0, 1, 2].map(() => blanketL.add(`<g opacity="0">${loaf(c, 14)}</g>`));
    /* the door leaf and its bar (the street wall of the right house) */
    const doorL = S.layer({ par: 0.44, sh: 5 });
    const leaf = doorL.add(`<g>${sheet().p(c.cut(c.rect(0, -(GY - DOOR.top), 26, GY - DOOR.top), 0.4, 6), mix(C.wood, C.night, 0.15)).x(c.ribbon([[13, -(GY - DOOR.top) + 8], [13, -6]], 1.6), shade(C.wood, -0.3), 'opacity=".6"').out()}</g>`);
    const bar = doorL.add(`<g><path d="${c.cut(c.rect(-6, -8, 76, 14), 0.4, 5)}" fill="${C.wood2}"/></g>`);
    const barGlow = doorL.add(`<g opacity="0"><ellipse cx="32" cy="0" rx="70" ry="30" fill="url(#halo-glow)"/>${sparkle(c, 12)}</g>`);

    /* words, knocks, sleep */
    const W = S.layer({ par: 0.46, sh: 3 });
    const three = `<g transform="translate(-40 6)">${loaf(c, 13)}</g><g transform="translate(-6 6)">${loaf(c, 13)}</g><g transform="translate(28 6)">${loaf(c, 13)}</g>`;
    const askB = W.add(`<g opacity="0">${say(c, [tr('Przyjacielu,', 'Friend,'), tr('użycz mi trzy chleby!', 'lend me three loaves!')], { size: 18, side: -1 })}<g transform="translate(-100 -12)">${three}</g></g>`);
    const whyB = W.add(`<g opacity="0">${speech(c, `<g transform="translate(-18 14)">${basketEmpty(c)}</g><g transform="translate(24 -2) scale(.7)">${bowl(c, { w: 36, food: null })}</g><text x="4" y="-12" font-family="EB Garamond, Georgia, serif" font-size="30" fill="${C.terracotta}">?</text>`, { w: 110, h: 70, flip: true })}</g>`);
    const noB = W.add(`<g opacity="0">${say(c, tr('Nie naprzykrzaj mi się!', 'Don’t bother me!'), { size: 19, side: -1, jag: true })}</g>`);
    const cantB = W.add(`<g opacity="0">${say(c, tr('Nie mogę wstać…', 'I can’t get up…'), { size: 18, side: -1 })}</g>`);
    const knocks = [0, 1, 2, 3].map((i) => W.add(`<g opacity="0">${knockMarks(c, -1, C.cream)}</g>`));
    const zs = [0, 1, 2].map(() => W.add(`<g opacity="0">${zzz(c, 16, C.cream)}</g>`));
    const shine = W.add(`<g opacity="0">${sparkle(c, 16)}</g>`);

    return (t, time) => {
      const T = time;
      pose(mn, { x: 740, y: 190, r: T ? Math.sin(T * 0.5) * 1.2 : 0 });

      /* the left house: the traveller, tired, at the empty table; the lamp and the empty basket */
      const tired = 1 - es(t, 5.8, 6.0);
      trav.set({ x: 450, y: GY + 4, s: 0.96, armF: 30 + bump(t, 1.2, 1.9) * 16, armB: 20, head: 10 * tired - es(t, 5.8, 6.0) * 8, lean: 6 * tired, blink: blinkAt(T, 3) });
      pose(leftLamp, { x: 500, y: GY - 44, o: 1 });
      pose(shelfBasket, { x: LH.x0 + 80, y: LH.ceil + 110 });

      /* v5 — the asker takes his lantern and crosses to his friend's door; he knocks and asks */
      const AK = [[-0.3, 590], [0.4, KX], [5.7, KX], [5.95, 700]];
      const ax = kf(t, AK);
      const back = bump(t, 1.1, 1.95);
      const knockA = (k0, k1) => (t > k0 && t < k1 ? Math.abs(Math.sin((t - k0) * 40)) : 0);
      const kn = knockA(0.42, 0.72) + knockA(4.3, 4.9) + knockA(5.0, 5.35) * 1.4;
      const home = es(t, 5.62, 5.72);
      asker.set({ x: ax, y: GY + 2, s: 1.0, flip: t > 5.72, walk: moving(t, AK) ? ax * 0.06 : undefined, armF: 40 - kn * 10, armB: 20 + kn * 60 + back * 0 + home * 40, head: -2 - back * 0, blink: blinkAt(T, 2) });
      pose(lantern, { r: -(40 - kn * 10) + 40 });
      knocks.forEach((k, i) => {
        const on = i < 2 ? bump(t, 0.45 + i * 0.12, 0.7 + i * 0.12) : bump(t, 4.3 + (i - 2) * 0.2, 4.6 + (i - 2) * 0.2) + bump(t, 5.0 + (i - 2) * 0.1, 5.3 + (i - 2) * 0.1);
        pose(k, { x: DOOR.x - 20, y: 600 + (i % 2) * 30, s: 0.8 + Math.min(1, on) * 0.4, o: Math.min(1, on) });
      });
      const ab = es(t, 0.5, 0.62, ease.back) * (1 - es(t, 1.9, 2.02));
      const [ahx, ahy] = headP(KX, GY + 2, 1.0);
      pose(askB, { x: ahx - 10, y: ahy - 24, s: ab, o: ab > 0.01 ? 1 : 0 });

      /* v6 — he has nothing to set before him: the lantern turns back, the empty basket, the traveller */
      const wk = es(t, 1.08, 1.2, ease.back) * (1 - es(t, 1.9, 2.02));
      pose(whyB, { x: ahx - 30, y: ahy - 130, s: wk, o: wk > 0.01 ? 1 : 0 });
      pose(shine, { x: LH.x0 + 80, y: LH.ceil + 80, s: bump(t, 1.2, 1.9), r: T * 30, o: bump(t, 1.2, 1.9) });

      /* the friend: asleep; lifts his head (v7a); the bar, the children (v7b); lies down (v7c); gets up (v8) */
      const sitUp = seg(t, 2.05, 2.1) * (1 - seg(t, 4.2, 4.25)) + seg(t, 5.25, 5.3) * (1 - seg(t, 5.36, 5.4));
      const standUp = seg(t, 5.36, 5.4);
      const asleep = 1 - Math.max(sitUp, standUp);
      lying.set({ x: MAT.x0 + 196, y: MAT.y - 2, s: 0.84, r: -88, o: asleep, armF: 10, blink: 0 });
      const point = es(t, 3.1, 3.3) * (1 - es(t, 3.9, 4.1));
      sit.set({ x: MAT.x0 + 40, y: MAT.y + 4, s: 0.9, flip: true, o: sitUp, armF: 30 + bump(t, 2.15, 2.9) * 60 + point * 30, armB: 10 + point * 80, head: -6 + bump(t, 2.15, 2.9) * -6, lean: -4, blink: blinkAt(T, 5) });
      const SK = [[5.36, MAT.x0 + 30], [5.5, DOOR.x + 64]];
      const sx = kf(t, SK);
      const hands = es(t, 5.62, 5.72);
      stand.set({ x: sx, y: GY, s: 0.96, flip: true, o: standUp, walk: moving(t, SK) ? sx * 0.07 : undefined, armF: 30 + hands * 50, armB: 10 + bump(t, 5.44, 5.56) * 90, head: 4, blink: blinkAt(T, 5) });
      pose(blanket, { x: 0, y: -standUp * 4 });
      pose(rightLamp, { x: 1000, y: GY - 30, o: es(t, 5.38, 5.44) });
      const nk = es(t, 2.05, 2.18, ease.back) * (1 - es(t, 2.9, 3.0));
      const [shx, shy] = headP(MAT.x0 + 40, MAT.y + 4, 0.9, true, 'sit');
      pose(noB, { x: shx - 20, y: shy - 22, s: nk, o: nk > 0.01 ? 1 : 0 });
      const ck = es(t, 4.05, 4.16, ease.back) * (1 - es(t, 4.4, 4.5));
      pose(cantB, { x: shx - 20, y: shy - 22, s: ck, o: ck > 0.01 ? 1 : 0 });
      zs.forEach((z, i) => {
        const on = i === 0 ? asleep * (1 - es(t, 5.1, 5.2)) : Math.max(1 - es(t, 5.3, 5.5), 0) * es(t, -0.2, 0.2);
        const kk = T ? (T * 0.3 + i / 3) % 1 : 0.5;
        pose(z, { x: [MAT.x0 + 20, 1070, 1140][i] + kk * 10, y: MAT.y - 60 - kk * 30, s: 0.8 + kk * 0.3, o: on * (0.4 + (1 - kk) * 0.6) * (i === 0 ? 1 : 0.9) });
      });
      /* the door: barred; the bar lifts; the door opens */
      const lift = es(t, 5.44, 5.54);
      const open = es(t, 5.52, 5.62);
      pose(leaf, { x: DOOR.x - 13, y: GY, sx: Math.max(0.12, 1 - open) });
      pose(bar, { x: DOOR.x + 2, y: 622 - lift * 60, r: -lift * 70, o: 1 - es(t, 5.56, 5.62) });
      pose(barGlow, { x: DOOR.x + 2, y: 622, s: 1, o: bump(t, 3.05, 3.9) });
      /* he hands out the loaves — as many as he needs */
      const [gx, gy] = handAt(DOOR.x + 64, GY, 0.96, true, 80);
      const [rx, ry] = handAt(KX, GY + 2, 1.0, false, 60);
      flyLoaves.forEach((l, i) => {
        const k = es(t, 5.62 + i * 0.05, 5.72 + i * 0.05);
        pose(l, { x: lerp(gx, rx + 10, k), y: lerp(gy - 6, ry - 30, k) - Math.sin(k * PI) * 30, r: k * 90, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const bk = es(t, 5.78, 5.86);
      pose(give, { x: lerp(gx - 6, rx + 10, bk), y: lerp(gy + 10, ry + 10, bk), o: es(t, 5.62, 5.7) * (1 - seg(t, 5.84, 5.86)) });
      pose(basketHeld, { x: kf(t, [[5.86, rx + 10], [5.95, 700 - 30]]), y: ry + 12, o: seg(t, 5.84, 5.86) });

      S.cam.x = kf(t, [[-0.5, 0], [0.4, 20], [1.05, 20], [1.3, -60], [1.9, -60], [2.1, 90], [4.9, 90], [5.2, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.4, 1.1], [1.3, 1.14], [1.9, 1.14], [2.1, 1.18], [4.9, 1.18], [5.2, 1.08]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.4, 30], [2.1, 50], [4.9, 50], [5.2, 30]]);
    };
  },
};
