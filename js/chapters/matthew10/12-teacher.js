// Mt 10,24–25 — before the house where Jesus is master. John (a little comic) climbs onto a stone to stand taller
// than his Teacher: the height mark on the doorpost, a wobble, a red cross — and down he comes. Then he stands at
// Jesus' side and does just as He does, both hands lifted the same way, two shadows alike on the ground, and the
// servant at the door does as his master. Then Pharisees come round the corner shouting; a dark tag "Beelzebul"
// is slapped on the master's door, and smaller dark tags come flying at those of his household.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { village, DAY, openHouse, crossX, nameTag, cry, withFace, faceBits, kf, moving, hand, headAt, sparkle, jug, tr, PI } from './lib.js';
import { scribe as scribeM } from '../mark2/lib.js';

const GY = 704, HB = 700;
const HX = 880, HW = 300, HH = 280;
const JX = 800, DX = 690;

export default {
  id: 'mt10-teacher',
  beats: [
    { v: 24 },
    { v: 25, text: 'Wystarczy, jeśli uczeń będzie jak jego nauczyciel, a sługa jak pan jego.' },
    { v: 25, cont: true, text: 'Jeśli pana domu przezwali Belzebubem, o ileż bardziej jego domowników tak nazwą.' },
  ],
  cam: { x: [-30, 40], y: [-30, 30], z: [1, 1.16] },
  build(S) {
    // phone: the Pharisees stop further in and shout from inside the screen (the cry and the first of them were cut)
    const PH = S.portrait, SHX = PH ? 600 : 470;
    const V = village(S, { skyCols: DAY, sunAt: [1250, 150] });
    const c = S.c;

    /* the master's house, with height marks on the doorpost */
    const HL = S.layer({ par: 0.45, sh: 4 });
    const o = openHouse(c, { w: HW, h: HH, dw: 76, dh: 170 });
    HL.add(`<g transform="translate(${HX} ${HB})">${o.inside}</g>`);
    HL.add(`<g transform="translate(${HX} ${HB})">${o.glow}</g>`);
    HL.add(`<g transform="translate(${HX} ${HB})">${o.wall}</g>`);
    const DOOR = HX + o.door[0];
    let marks = '';
    [0, 1, 2, 3].forEach((i) => { marks += c.ribbon([[DOOR - 22, HB - 150 - i * 14], [DOOR - 8, HB - 150 - i * 14]], 2); });
    HL.add(sheet().x(marks, C.wood2).out());
    const tall = HL.add(`<g><path d="${c.ribbon([[-18, 0], [18, 0]], 3)}" fill="${C.terracotta}"/></g>`);
    const stone = HL.add(`<g>${rock(c, 0, 0, 64, 26, C.rock2)}</g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const shadowJ = P.add(`<g><ellipse rx="46" ry="9" fill="${C.soilDark}" opacity=".25"/></g>`);
    const shadowD = P.add(`<g><ellipse rx="40" ry="8" fill="${C.soilDark}" opacity=".25"/></g>`);
    const servant = S.puppet(P.add(person(c, { robe: C.linen2, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin4, belt: C.rope, holdF: `<g transform="rotate(180) translate(0 -6)">${jug(c)}</g>` })));
    const peter = S.puppet(P.add(person(c, CAST.peter)));
    const andrew = S.puppet(P.add(person(c, CAST.andrew)));
    const john = S.puppet(P.add(withFace(person(c, CAST.john), faceBits(c))));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const phar = [0, 1, 2].map((i) => ({ i, p: S.puppet(P.add(scribeM(c, i))), seed: c.rr(0, 9) }));
    const jGlow = P.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);

    const W = S.layer({ par: 0.52, sh: 4 });
    const no = W.add(`<g>${crossX(c, 26)}</g>`);
    const alike = [0, 1, 2].map(() => W.add(`<g>${sparkle(c, 12)}</g>`));
    const shout = W.add(`<g>${cry(c, tr('Belzebub!', 'Beelzebul!'), { size: 24, dir: -1 })}</g>`);
    const bigTag = W.add(`<g><path d="M0 0V-40" stroke="rgba(40,30,40,.6)" stroke-width="1.2"/>${nameTag(c, tr('Belzebub', 'Beelzebul'), { size: 20, dark: true })}</g>`);
    const small = [0, 1, 2, 3].map(() => W.add(`<g>${nameTag(c, tr('Belzebub', 'Beelzebul'), { size: 12, dark: true })}</g>`));

    return (t, time) => {
      const T = time;
      V.update(t, T);

      /* v24 — not above the teacher */
      const climb = es(t, 0.1, 0.3) * (1 - es(t, 0.8, 0.95));
      const wob = bump(t, 0.35, 0.75) * Math.sin(T * 9) * 5;
      const dy = climb * 30;
      const along = es(t, 1.05, 1.3);
      const dx = lerp(DX, JX - 96, along);
      const same = es(t, 1.25, 1.45) * (1 - es(t, 2.2, 2.4));
      const bz = es(t, 2.2, 2.4);
      john.set({ x: dx, y: GY + 4 - dy, s: 0.9, flip: false, walk: along > 0.01 && along < 0.99 ? dx * 0.06 : undefined, armF: 20 + climb * 50 + same * 100, armB: 10 + climb * 130 + same * 110, lean: wob, head: -climb * 8 - same * 4 + bz * 10, blink: blinkAt(T, 2) });
      pose(stone, { x: DX, y: GY + 8, o: 1 - es(t, 0.95, 1.05) });
      pose(tall, { x: DOOR - 15, y: HB - 150 - 42 - bump(t, 0.2, 0.9) * 0, o: bump(t, 0.2, 0.95) });
      const nk = es(t, 0.45, 0.6, ease.back) * (1 - es(t, 0.85, 0.95));
      const [dhx, dhy] = headAt(DX, GY + 4 - dy, 0.9, false);
      pose(no, { x: dhx + 4, y: dhy - 60, s: nk, o: nk > 0.01 ? 1 : 0 });

      /* v25a — like his teacher; the servant like his master */
      jesus.set({ x: JX, y: GY + 10, s: 1.04, flip: bz > 0.5 ? true : false, armF: 20 + bump(t, 0.3, 0.9) * 30 + same * 100, armB: 10 + same * 110, head: -same * 4, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: GY - 170, o: 0.45 + same * 0.3 });
      pose(shadowJ, { x: JX + 6, y: GY + 12, sx: 1 + same * 0.3, o: 1 });
      pose(shadowD, { x: dx + 6, y: GY + 6, sx: 1 + same * 0.3, o: 1 });
      alike.forEach((a, i) => {
        const k = bump(t, 1.3 + i * 0.08, 1.95);
        pose(a, { x: lerp(dx, JX, 0.5) + (i - 1) * 40, y: GY - 230 - (i % 2) * 20, s: k, r: T * 30, o: k });
      });
      const servIn = es(t, 1.2, 1.5);
      const sx = lerp(DOOR + 38, JX + 110, servIn);
      servant.set({ x: sx, y: GY + 2, s: 0.86, flip: servIn > 0.9 ? false : true, walk: servIn > 0.01 && servIn < 0.99 ? sx * 0.06 : undefined, o: es(t, 1.1, 1.2), armF: 30 + same * 50, armB: same * 110, head: -same * 4, blink: blinkAt(T, 3) });

      /* v25b — "Beelzebul!" */
      phar.forEach((ph) => {
        const k = es(t, 2.0 + ph.i * 0.05, 2.3 + ph.i * 0.05);
        const x = lerp(-150 - ph.i * 60, (PH ? 580 : 440) - ph.i * (PH ? 46 : 64), k);
        ph.p.set({ x, y: GY + (ph.i % 2) * 8, s: 0.92, flip: false, walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: 20 + es(t, 2.3, 2.45) * (ph.i === 0 ? 90 : 60), armB: es(t, 2.3, 2.45) * (ph.i === 1 ? 140 : 20), head: -4, blink: blinkAt(T, ph.seed) });
      });
      const sh = es(t, 2.3, 2.42, ease.back);
      pose(shout, { x: SHX - 4, y: GY - 196, s: sh, o: sh > 0.01 ? 1 : 0 });
      const bk = es(t, 2.36, 2.55);
      pose(bigTag, { x: lerp(SHX, DOOR + 38, bk), y: lerp(GY - 150, HB - 200, bk) - Math.sin(bk * PI) * 100, r: (1 - bk) * 360 + Math.sin(T) * 2, o: bk > 0.01 ? 1 : 0 });
      const HH2 = [[dx, GY + 4, 0.9], [sx, GY + 2, 0.86], [1000, GY + 8, 0.86], [PH ? 1050 : 1070, GY + 12, 0.84]];
      small.forEach((el, i) => {
        const k = es(t, 2.55 + i * 0.06, 2.75 + i * 0.06);
        const [hx, hy] = headAt(HH2[i][0], HH2[i][1], HH2[i][2], false);
        pose(el, { x: lerp(SHX, hx, k), y: lerp(GY - 160, hy - 64, k) - Math.sin(k * PI) * 70, r: (1 - k) * 300 + Math.sin(T + i) * 4, o: k > 0.01 ? 1 : 0 });
      });
      const hh = es(t, 2.1, 2.35);
      const pxx = lerp(DOOR + 38, 1000, hh), axx = lerp(DOOR + 38, PH ? 1050 : 1070, es(t, 2.18, 2.45));
      peter.set({ x: pxx, y: lerp(HB, GY + 8, hh), s: lerp(0.8, 0.86, hh), flip: true, walk: hh > 0 && hh < 1 ? t * 30 : undefined, o: es(t, 2.08, 2.16), head: es(t, 2.5, 2.7) * 8, blink: blinkAt(T, 4) });
      andrew.set({ x: axx, y: lerp(HB, GY + 12, es(t, 2.18, 2.45)), s: 0.84, flip: true, walk: t > 2.18 && t < 2.45 ? t * 30 + 1 : undefined, o: es(t, 2.18, 2.26), head: es(t, 2.5, 2.7) * 8, blink: blinkAt(T, 5) });

      S.cam.x = -es(t, 2.0, 2.4) * 30;
      S.cam.y = 20;
      S.cam.z = 1.1 + bump(t, 0, 1.0) * 0.04 - es(t, 2.0, 2.4) * 0.04;
    };
  },
};
