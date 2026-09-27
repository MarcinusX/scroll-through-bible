// Mk 9,33–37 — Capernaum, the house by the lake. "What were you arguing about on the way?" — silence;
// they had argued who is the greatest (paper crowns bob up over their heads, a measuring rod on the wall).
// He sits, calls the Twelve: the first must be last and servant of all (the crowns tumble to the floor,
// a basin and towel appear). He sets a child in the middle and embraces him: whoever receives such a
// child receives me — and the One who sent me (light pours down from above).
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, hillsWith, palm, cloud, sun, olive, rock } from '../../assets/nature.js';
import { boat, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { houseSection, TWELVE, LOOK, speech, GLYPH, paperCrown, measureRod, basinTowel, heart, kf, strip } from './lib.js';

const PI = Math.PI;
const PAR = 0.4;
const X0 = 480, X1 = 1120, FLOOR = 650, CEIL = 300;
const SEATS = [[534, 0.76], [572, 0.78], [610, 0.8], [648, 0.8], [690, 0.82], [910, 0.82], [952, 0.8], [990, 0.8], [1028, 0.78], [1066, 0.76]];

export default {
  id: 'm9-greatest',
  beats: [
    { v: 33, text: 'Tak przyszli do Kafarnaum.' },
    { v: 33, cont: true, text: 'Gdy był w domu, zapytał ich: «O czym to rozprawialiście w drodze?»' },
    { v: 34, text: 'Lecz oni milczeli,' },
    { v: 34, cont: true, text: 'w drodze bowiem posprzeczali się między sobą o to, kto z nich jest największy.' },
    { v: 35, text: 'On usiadł, przywołał Dwunastu i rzekł do nich:' },
    { v: 35, cont: true, text: '«Jeśli kto chce być pierwszym, niech będzie ostatnim ze wszystkich i sługą wszystkich!».' },
    { v: 36 },
    { v: 37, text: '«Kto przyjmuje jedno z tych dzieci w imię moje, Mnie przyjmuje;' },
    { v: 37, cont: true, text: 'a kto Mnie przyjmuje, nie przyjmuje Mnie, lecz Tego, który Mnie posłał».' },
  ],
  cam: { x: [-160, 20], y: [-40, 50], z: [0.98, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, ['#c6dcda', '#ebe6d0', '#f4e6cc']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: 140, len: 800 });
    const cl = hanging(hangL, cloud(c, 170), { x: 420, y: 150, len: 700 });

    // the lake of Galilee behind Capernaum
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [14, 6, 2], lens: [1000, 340, 120], color: C.hillFar }).markup);
    const lakeL = S.layer({ par: 0.16, sh: 2 });
    lakeL.add(waterBand(c, { y: 470, color: C.lake, foamN: 20 }).markup);
    const b = boat(c, { mast: true });
    lakeL.add(`<g transform="translate(250 500) scale(.3)">${b.back}${b.front}</g><g transform="translate(1350 492) scale(.24)">${b.back}${b.front}</g>`);
    const shoreL = S.layer({ par: 0.3, sh: 3 });
    shoreL.add(sheet().p(c.cut([[-900, 548], [2500, 548], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.3)).out());
    shoreL.add(palm(c, 250, 560, 190) + palm(c, 1330, 562, 170) + olive(c, 1460, 566, 0.8) + rock(c, 380, 600, 50, 20));
    // a little sign: Capernaum
    const signL = S.layer({ par: PAR, sh: 4 });
    signL.add(`<g transform="translate(250 ${FLOOR - 40})">${sheet().p(c.cut(c.rect(-4, -120, 8, 122), 0.3, 6), C.wood2).p(c.cut([[-70, -118], [70, -118], [84, -100], [70, -82], [-70, -82]], 0.4, 6), C.wood3).out()}<text x="4" y="-93" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="21" font-style="italic" fill="${C.ink}">${tr('Kafarnaum', 'Capernaum')}</text></g>`);

    /* ---------- the house ---------- */
    const H = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL, doorX: 60 });
    const houseL = S.layer({ par: PAR, sh: 4 });
    houseL.add(H.back);
    houseL.add(`<g transform="translate(${X1 - 70} ${FLOOR + 4})">${measureRod(c, 220)}</g>`);
    // light from above (the One who sent me)
    const beamL = S.layer({ par: PAR, sh: 1, flat: true });
    const beam = beamL.add(`<g opacity="0"><path d="${c.poly([[760, CEIL - 40], [840, CEIL - 40], [960, FLOOR + 30], [640, FLOOR + 30]])}" fill="#fff1c4" opacity=".55"/><circle cx="800" cy="${CEIL}" r="160" fill="url(#halo-glow)"/></g>`);

    /* ---------- inside ---------- */
    const inL = S.layer({ par: PAR, sh: 4 });
    const TEN = TWELVE.slice(0, 10);
    const dx = (H.door[0] + H.door[1]) / 2;
    const dis = TEN.map((d, i) => ({ ...d, i, x: SEATS[i][0], s: SEATS[i][1], flip: SEATS[i][0] > 800, seed: c.rr(0, 9), st: S.puppet(inL.add(person(c, d.o))), kn: S.puppet(inL.add(person(c, { ...d.o, pose: 'kneel' }))) }));
    const jesus = S.puppet(inL.add(person(c, CAST.jesus)));
    const jSit = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jKneel = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const child = S.puppet(inL.add(person(c, LOOK.child)));
    const crowns = dis.map((d) => ({ d, el: inL.add(`<g opacity="0">${paperCrown(c, 32, [C.sun, C.ochre, C.wheat][d.i % 3])}</g>`) }));
    const basin = inL.add(`<g opacity="0">${basinTowel(c, 84)}</g>`);
    const askB = inL.add(`<g opacity="0">${speech(c, GLYPH.q(c), { w: 56, h: 44 })}</g>`);
    const hush = inL.add(`<g opacity="0">${strip(c, '…', { size: 26, w: 60 })}</g>`);
    const love = inL.add(`<g opacity="0">${heart(c, 22)}</g>`);
    const ring = inL.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/></g>`);

    /* outside: the group arriving (beat 0) */
    const outL = S.layer({ par: PAR, sh: 5 });
    const ARR = [CAST.jesus, CAST.peter, CAST.john, CAST.james, CAST.andrew].map((o, i) => ({ i, o, p: S.puppet(outL.add(person(c, o))), seed: c.rr(0, 9) }));
    const frontL = S.layer({ par: PAR, sh: 5 });
    frontL.add(H.front + H.stairs);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1240, 140, T, 1, 0.6);
      swing(cl, 420 + Math.sin(T * 0.1) * 20, 150, T, 1.3, 0.6, 1);

      /* beat 0: they come along the shore road to the house */
      const arr = es(t, 0, 0.85);
      ARR.forEach((a) => {
        const x = lerp(-80 - a.i * 70, 440 - a.i * 70, arr);
        a.p.set({ x, y: FLOOR + 40 + (a.i % 2) * 6, s: 0.86, o: 1 - es(t, 0.9, 1.02), walk: arr > 0 && arr < 1 ? x * 0.05 + a.i : undefined, amt: 0.8, blink: blinkAt(T, a.seed) });
      });

      /* inside */
      const inside = es(t, 0.95, 1.05);
      const jw = es(t, 1, 1.3);
      const sit = es(t, 4.05, 4.12);
      const kneelJ = es(t, 6.35, 6.42);
      const ask = bump(t, 1.35, 1.97);
      jesus.set({ x: lerp(dx, 800, jw), y: lerp(FLOOR - 6, 628, jw), s: lerp(0.8, 0.92, jw), o: inside * (1 - sit), walk: jw > 0 && jw < 1 ? jw * 30 : undefined, armF: 14 + ask * 50, armB: 10 + ask * 30, head: -2 + es(t, 2.1, 2.4) * 6, blink: blinkAt(T, 1) });
      const call = bump(t, 4.2, 4.95);
      const teach = es(t, 5.05, 5.3) * (1 - es(t, 6, 6.2));
      jSit.set({ x: 800, y: 628, s: 0.92, o: sit * (1 - kneelJ), armF: 20 + call * 60 + teach * (40 + Math.sin(T * 1.4) * 10), armB: 10 + call * 20 + teach * 30 + es(t, 6.1, 6.3) * 60, head: -2, blink: blinkAt(T, 1) });
      const hug = es(t, 6.5, 6.8);
      jKneel.set({ x: 790, y: 632, s: 0.94, o: kneelJ, armF: 30 + hug * 26 + es(t, 7.1, 7.3) * 10, armB: 20 + hug * 40 + es(t, 8.05, 8.4) * 100, head: 6 + hug * 6 - es(t, 8.1, 8.4) * 14, blink: blinkAt(T, 1) });
      pose(askB, { x: 820, y: 400, s: es(t, 1.4, 1.6, ease.back), o: ask > 0.05 ? 1 : 0 });

      const crownOn = es(t, 3.05, 3.4) * (1 - es(t, 5.1, 5.3));
      const fall = es(t, 5.1, 5.6);
      dis.forEach((d) => {
        const w = es(t, 1 + d.i * 0.04, 1.35 + d.i * 0.04);
        const kn = es(t, 4.3 + d.i * 0.03, 4.36 + d.i * 0.03);
        const silent = es(t, 2.05, 2.35) * (1 - es(t, 3, 3.2));
        const tiptoe = crownOn * (Math.sin(t * PI * 3 + d.i * 1.3) * 0.5 + 0.5) * (d.i % 2 ? 1 : 0.5);
        const x = lerp(dx, d.x, w);
        const y = lerp(FLOOR - 6, 640, w);
        const faceIn = d.flip;
        const common = { flip: w < 1 ? d.x < dx : faceIn, blink: blinkAt(T, d.seed) };
        d.st.set({ ...common, x, y: y - tiptoe * 10, s: lerp(0.7, d.s, w), o: inside * es(t, 0.98 + d.i * 0.04, 1.05 + d.i * 0.04) * (1 - kn), walk: w > 0 && w < 1 ? w * 30 : undefined, head: -2 + silent * 16 - tiptoe * 6, armF: 10 + crownOn * (d.i % 3 === 0 ? 70 : 20) + bump(t, 1.4, 2) * 10, armB: silent * 10 + tiptoe * 30 });
        const look = es(t, 6.2, 6.5);
        d.kn.set({ ...common, x: d.x + (faceIn ? -1 : 1) * 10, y: 648, s: d.s, o: kn, head: -4 + look * 6 + es(t, 8.05, 8.4) * -8, armF: 20 + es(t, 8.1, 8.5) * (d.i % 2 ? 40 : 10), armB: es(t, 8.1, 8.5) * (d.i % 3 === 0 ? 80 : 0), blink: blinkAt(T, d.seed) });
        d.cx = x; d.cy = y - tiptoe * 10; d.cs = lerp(0.7, d.s, w);
      });
      crowns.forEach(({ d, el }) => {
        const hx = d.cx + (d.flip ? -2 : 2) * d.cs, hy = d.cy - 190 * d.cs;
        const fx = d.x + (d.flip ? -1 : 1) * 30, fy = 652;
        const pop = es(t, 3.05 + d.i * 0.04, 3.3 + d.i * 0.04, ease.back);
        const x = lerp(hx, fx, fall), y = lerp(hy - 10, fy, fall) - Math.sin(fall * PI) * 40;
        pose(el, { x, y, s: pop, sy: pop * (1 - fall * 0.6), r: fall * (d.i % 2 ? 80 : -80) + Math.sin(t * PI * 2 + d.i) * 6 * crownOn, o: (crownOn + fall) > 0.01 ? 1 - es(t, 5.8, 6.1) : 0 });
      });
      pose(hush, { x: 800, y: 420, s: es(t, 2.1, 2.3, ease.back), o: bump(t, 2.05, 2.97) > 0.05 ? 1 : 0 });
      pose(basin, { x: 800, y: 664, s: es(t, 5.2, 5.45, ease.back), o: es(t, 5.15, 5.25) * (1 - es(t, 6.2, 6.4)) });

      /* beat 6: the child comes in; Jesus stands him in the middle and embraces him */
      const cw = es(t, 6.02, 6.45);
      child.set({ x: lerp(dx, 820, cw), y: lerp(FLOOR - 6, 646, cw), s: lerp(0.5, 0.58, cw), o: es(t, 6, 6.06), flip: cw > 0.95, walk: cw > 0 && cw < 1 ? cw * 30 : undefined, head: -4 + es(t, 6.8, 7.2) * 6, armF: es(t, 7.2, 7.5) * 30, blink: blinkAt(T, 7) });
      pose(love, { x: lerp(840, 800, es(t, 7.2, 7.8)), y: lerp(500, 440, es(t, 7.2, 7.8)), s: es(t, 7.1, 7.35, ease.back) * (1 + Math.sin(T * 2.4) * 0.05), o: es(t, 7.05, 7.2) });
      pose(ring, { x: 805, y: 560, s: 0.6 + es(t, 7.1, 7.6) * 0.5, o: es(t, 7.1, 7.5) * 0.45 });
      fade(beam, es(t, 8.05, 8.5));

      /* camera: from the road to the room */
      S.cam.x = kf(t, [[0, -150], [0.85, -100], [1.2, 0]]);
      S.cam.z = kf(t, [[0, 1], [1.2, 1.06], [6, 1.06], [6.6, 1.14]]);
      S.cam.y = kf(t, [[0, 30], [1.2, 20], [6, 20], [6.6, 40]]);
    };
  },
};
