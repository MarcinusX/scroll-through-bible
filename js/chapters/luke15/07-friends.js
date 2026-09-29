// Łk 15,9–10 — the street outside her house at night, the moon up. "And when she has found it, she calls together
// her friends and neighbours": she steps out of her lit doorway with the lamp and the coin, and calls to the right
// and to the left — the doors light up one after another and out they come with their little lamps, three women
// and a girl. "…saying, 'Rejoice with me, for I have found the drachma that I had lost'": she holds up the coin,
// it sparkles; they throw up their hands and dance round her, a tambourine rattling. "In the same way, I tell you,
// there is joy before the angels of God over one sinner who repents": the view rises to the night sky: a warm light
// opens in it and the angels come down on their strings, singing and playing round a round picture of the one who
// turned back — the tax collector kneeling at Jesus' feet — while below the women still dance.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import {
  villageStreet, VS, WOMAN, PENITENT, JESUS, coinBand, drachma, lampHold, lamp, say, tambourine, sparkle, glow, choirAngel, roundel, figure, voiceRings, addToHead,
  headP, handP, flyAt, kf, moving, es, ease, bump, seg, fade, tr, PI, STRING,
} from './lib.js';
import { childPerson } from '../matthew2/lib.js';

const GY = VS.GY;
const HX = 700;         // where she stands
const FR = [
  { h: 0, x: 520, o: { robe: C.sageRobe, mantle: C.wheatRobe, hairStyle: 'veil', veil: C.skyVeil, hair: C.hair2, skin: C.skin, beard: 'none', belt: C.ochre }, t0: 0.4 },
  { h: 2, x: 868, flip: true, o: { robe: C.mauve, hairStyle: 'veil', veil: C.wheat, veil2: C.ochre, hair: C.hair3, skin: C.skin3, beard: 'none', belt: C.plumRobe }, t0: 0.5, tamb: true },
  { h: 3, x: 960, flip: true, o: { robe: C.ochreRobe, mantle: C.clayMantle, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.greyHair, skin: C.skin2, beard: 'none' }, t0: 0.62 },
];
const ANG = [[560, 330, 0], [676, 250, 1], [924, 250, 2], [1040, 330, 3], [450, 450, 2], [1150, 450, 1]];

/** the tax collector kneeling at Jesus' feet, for a round picture (plate coords, r 70) */
function penitentPlate(c, id) {
  const inner = `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.halo, C.cream, 0.4)}"/>`
    + sheet().p(c.cut([[-90, 40], [90, 36], [90, 90], [-90, 90]], 0.6, 8), mix(C.sand, C.sand2, 0.4)).out()
    + figure(c, { ...JESUS, halo: true }, { x: -24, y: 58, s: 0.52, armF: 50, armB: 20, head: 6 })
    + figure(c, { ...PENITENT, pose: 'kneel' }, { x: 40, y: 60, s: 0.5, flip: true, armF: 80, armB: 70, head: 20, lean: -14 });
  return roundel(c, inner, { r: 70, id });
}

export default {
  id: 'lk15-friends',
  parable: true,
  beats: [
    { v: 9, text: 'A znalazłszy ją, sprasza przyjaciółki i sąsiadki' },
    { v: 9, cont: true, text: 'i mówi: "Cieszcie się ze mną, bo znalazłam drachmę, którą zgubiłam".' },
    { v: 10 },
  ],
  cam: { x: [-40, 40], y: [-260, 40], z: [1, 1.08] },
  build(S) {
    const V = villageStreet(S);
    const c = V.c;
    const L = V.people;

    /* the sky opening with angels (behind the moon's layer: rise 0, parked up in the flies) */
    const heav = S.layer({ par: 0.05, sh: 0, flat: true, rise: 0 });
    V.hangL.el.parentNode.insertBefore(heav.el, V.hangL.el);
    const heavGlow = heav.add(`<g opacity="0">${glow(420, 0.9)}</g>`);
    const angL = S.layer({ par: 0.12, sh: 5 });
    const angels = ANG.map(([x, y, k], i) => ({ x, y, i, flip: x > 800, el: angL.add(`<g transform="translate(0 -1500)"><path d="M0 -1900V-120" stroke="${STRING}" stroke-width="1.2" fill="none"/><g transform="scale(${x > 800 ? -1.1 : 1.1} 1.1)">${choirAngel(c, i + 1, k)}</g></g>`) }));
    const plate = angL.add(`<g transform="translate(0 -1500)"><path d="M0 -1900V-76" stroke="${STRING}" stroke-width="1.2" fill="none"/>${penitentPlate(c, S.id('pen'))}</g>`);

    /* the women */
    const her = S.puppet(L.add(addToHead(person(c, { ...WOMAN, holdF: `<g transform="translate(0 4)">${drachma(c, 8)}</g>`, holdB: lampHold(c) }), coinBand(c, 9))));
    const herGlow = V.glowL.add(`<g>${glow(100, 0.7)}</g>`);
    const friends = FR.map((f, i) => ({ ...f, i, p: S.puppet(L.add(person(c, { ...f.o, holdF: f.tamb ? `<g transform="translate(2 6)">${tambourine(c)}</g>` : lampHold(c) }))), g: V.glowL.add(`<g opacity="0">${glow(90, 0.7)}</g>`) }));
    const girl = S.puppet(L.add(childPerson(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair2, skin: C.skin2 })));
    const call = voiceRings(V.fx, c, { n: 3, color: shade(C.ochre, 0.3), r: 30 });
    const shineG = V.glowL.add(`<g opacity="0">${glow(80, 0.9)}</g>`);
    const shine = V.fx.add(`<g opacity="0">${sparkle(c, 18)}</g>`);
    const joyB = V.fx.add(`<g opacity="0">${say(c, [tr('Cieszcie się ze mną,', 'Rejoice with me,'), tr('znalazłam drachmę!', 'I have found the drachma!')], { size: 20, side: -1 })}</g>`);
    const twinkles = Array.from({ length: 8 }, (_, i) => ({ i, x: c.rr(420, 1180), y: c.rr(80, 420), el: V.fx.add(`<g opacity="0">${sparkle(c, 11)}</g>`) }));

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v9a — she comes out and calls them; the doors light, out they come */
      V.light(1, 1);
      const HK = [[0.0, V.houses[1].door], [0.24, HX]];
      const hx = kf(t, HK);
      const calling = bump(t, 0.28, 0.62);
      const dir = t < 0.44 ? -1 : 1;
      const show = es(t, 1.08, 1.22);
      const dance = es(t, 1.3, 1.45);
      her.set({ x: hx, y: GY, s: 1.0, flip: dir < 0 && t < 0.6, o: 1, walk: moving(t, HK) ? hx * 0.07 : undefined, armF: 30 + calling * 30 + show * 110, armB: 20 + calling * 60, head: -show * 10, bob: -dance * Math.abs(Math.sin(t * PI * 5)) * 5, blink: blinkAt(T, 1) });
      const [hh, hy] = headP(hx, GY, 1.0, dir < 0 && t < 0.6);
      call(hh + dir * 20, hy, calling, T, { dir });
      const [bx, by] = handP(hx, GY, 1.0, true, 20 + calling * 60);
      pose(herGlow, { x: bx, y: by + 10 });
      friends.forEach((f) => {
        V.light(f.h, es(t, f.t0 - 0.1, f.t0));
        const door = V.houses[f.h].door;
        const K = [[f.t0, door], [f.t0 + 0.24, f.x]];
        const x = kf(t, K);
        const cheer = es(t, 1.3 + f.i * 0.05, 1.45 + f.i * 0.05);
        const armF = f.tamb ? 40 + cheer * 70 : 46 + cheer * 20;
        f.p.set({ x, y: GY, s: 0.94, flip: f.flip, o: es(t, f.t0 - 0.02, f.t0 + 0.04), walk: moving(t, K) ? x * 0.06 : undefined, armF, armB: 10 + cheer * 140, head: -cheer * 8, bob: -cheer * Math.abs(Math.sin(t * PI * 5 + f.i * 1.3)) * 6, blink: blinkAt(T, f.i + 3) });
        const [gx, gy] = handP(x, GY, 0.94, f.flip, armF);
        pose(f.g, { x: gx, y: gy + 8, o: f.tamb ? 0 : es(t, f.t0 - 0.02, f.t0 + 0.06) });
      });
      const GK = [[0.56, V.houses[2].door], [0.84, 790]];
      const gx = kf(t, GK);
      girl.set({ x: gx, y: GY, s: 0.6, flip: true, o: es(t, 0.54, 0.58), walk: moving(t, GK) ? gx * 0.08 : undefined, armF: 20 + dance * 140, armB: 10 + dance * 150, bob: -dance * Math.abs(Math.sin(t * PI * 6)) * 8, blink: blinkAt(T, 7) });

      /* v9b — the coin held up, the joy */
      const [cx, cy] = handP(hx, GY, 1.0, false, 30 + show * 110);
      pose(shine, { x: cx, y: cy - 4, s: show, r: T * 30, o: show });
      pose(shineG, { x: cx, y: cy - 4, o: show });
      const jb = es(t, 1.14, 1.28, ease.back) * (1 - es(t, 2.1, 2.2));
      pose(joyB, { x: hh - 30, y: hy - 40, s: Math.max(0.001, jb), o: jb > 0.01 ? 1 : 0 });

      /* v10 — joy before the angels of God */
      const up = es(t, 2.04, 2.4);
      fade(heavGlow, up);
      pose(heavGlow, { x: 800, y: 330, o: up });
      angels.forEach((a) => flyAt(a.el, es(t, 2.1 + a.i * 0.05, 2.45 + a.i * 0.05, ease.out), a.x, a.y, T, a.i, 1.6));
      flyAt(plate, es(t, 2.2, 2.55, ease.out), 800, 370, T, 9, 1);
      twinkles.forEach((w) => {
        const k = es(t, 2.2 + w.i * 0.04, 2.4 + w.i * 0.04);
        pose(w.el, { x: w.x, y: w.y, s: k * (0.7 + 0.3 * Math.abs(Math.sin(T * 2 + w.i))), r: T * 20 + w.i * 10, o: k });
      });

      S.cam.x = kf(t, [[0, -20], [0.5, 0], [1.2, 0]]);
      S.cam.y = kf(t, [[0, 30], [1.2, 30], [2.0, 20], [2.5, -240]]);
      S.cam.z = kf(t, [[0, 1.04], [1.2, 1.06], [2.5, 1.0]]);
    };
  },
};
