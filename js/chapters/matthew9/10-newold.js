// Mt 9,16–17 — a painted flat of a household workroom. On the left a woman sits sewing a bright patch of new,
// unshrunk cloth over the hole in an old grey cloak; she washes it in the basin — the new patch shrinks, pulls,
// and tears a worse hole. On the right the vintner pours new, fizzing wine into an old cracked wineskin: it swells
// and bursts, the wine spills across the floor and the skin is ruined. Then he fills two fresh skins — they hang
// plump and whole, and both the wine and the skins are kept.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { cloak, CLOAK_HOLE, patch, needle, wineskin, skinHalf, jug, splash, WINE, spark, townsfolk, hand, kf, moving, PI } from './lib.js';

const P = 0.5;
const camFor = (x) => (x - 800) / P;
const FLOOR = 706;
const CL = { x: 560, y: 456 };              // the cloak hangs from the rod here
const HX = CL.x + CLOAK_HOLE[0], HY = CL.y + CLOAK_HOLE[1];
const PEG = 420;                            // wineskins hang from pegs at this height

export default {
  id: 'mt9-newold',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 16, text: 'Nikt nie przyszywa łaty z surowego sukna do starego ubrania,' },
    { v: 16, cont: true, text: 'gdyż łata obrywa ubranie, i gorsze robi się przedarcie.' },
    { v: 17, text: 'Nie wlewa się też młodego wina do starych bukłaków.' },
    { v: 17, cont: true, text: 'W przeciwnym razie bukłaki pękają, wino wycieka, a bukłaki się psują.' },
    { v: 17, cont: true, text: 'Raczej młode wino wlewa się do nowych bukłaków, a tak jedno i drugie się zachowuje».' },
  ],
  cam: { x: [camFor(580), camFor(1120)], y: [0, 70], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    /* the room: plastered back wall with a window and a shelf, the floor */
    const room = S.layer({ par: 0.2, sh: 2, rise: 0 });
    const r = sheet();
    r.p(c.cut([[-1400, -900], [3000, -900], [3000, 1800], [-1400, 1800]], 1, 40), mix(C.plaster, C.dawn, 0.25));
    let sp = '';
    for (let i = 0; i < 26; i++) sp += c.cut(c.blob(c.rr(-400, 2000), c.rr(120, 640), c.rr(14, 34), c.rr(6, 12), 8, 0.2), 0.5, 4);
    r.x(sp, C.plaster2, 'opacity=".55"');
    r.p(c.cut([[760, 330], [760, 250], ...c.arc(810, 250, 50, 46, PI, 2 * PI, 10), [860, 330]], 0.4, 6), mix(C.skyBlue, C.cream, 0.3));
    r.p(c.ribbon([[754, 334], [866, 334]], 7) + c.ribbon([[810, 206], [810, 330]], 4), C.wood2);
    r.p(c.cut(c.rect(-600, 90, 3200, 20), 0.4, 10), C.wood2);
    let beams = '';
    for (let x = -560; x < 2600; x += 90) beams += c.cut(c.circ(x, 118, 7, 10), 0.3, 3);
    r.p(beams, C.wood);
    // a shelf with jars, a lamp niche, a big wine jar by the pegs
    r.p(c.cut(c.rect(520, 300, 200, 10), 0.3, 6), C.wood2);
    r.p(c.cut([[540, 300], [536, 276], [548, 262], [560, 276], [556, 300]], 0.3, 4) + c.cut(c.arc(600, 300, 18, 16, PI, 2 * PI, 8), 0.3, 4) + c.cut([[650, 300], [646, 268], [662, 260], [676, 268], [672, 300]], 0.3, 4), C.pot);
    r.p(c.cut(c.rect(700, 270, 16, 30), 0.3, 4), C.skyVeil);
    r.p(c.cut([[1000, 330], [1000, 290], ...c.arc(1020, 290, 20, 18, PI, 2 * PI, 8), [1040, 330]], 0.3, 5), shade(C.plaster2, -0.2));
    r.p(c.cut([[1008, 330], [1012, 322], [1028, 322], [1034, 326], [1030, 330]], 0.2, 3), C.pot);
    r.x(`M1032 322C1029 318 1029 314 1032 308C1035 314 1035 318 1032 322Z`, C.lampFlame);
    room.add(r.out());
    const floorL = S.layer({ par: P, sh: 3 });
    const f = sheet().p(c.cut([[-1200, FLOOR - 6], [2800, FLOOR - 6], [2800, 1800], [-1200, 1800]], 0.8, 20), mix(C.clay, C.sand2, 0.55));
    // a basket of cloth by the stool, a tall jar of new wine
    f.p(c.cut([[300, FLOOR], [292, FLOOR - 40], [368, FLOOR - 40], [360, FLOOR]], 0.4, 5), C.basket);
    f.p(c.cut(c.blob(318, FLOOR - 46, 20, 10, 8, 0.2), 0.4, 4), C.terracotta).p(c.cut(c.blob(346, FLOOR - 48, 22, 11, 8, 0.2), 0.4, 4), mix(C.dustyBlue, C.stone, 0.5));
    f.p(c.cut([[1380, FLOOR], [1350, FLOOR - 60], [1356, FLOOR - 120], [1376, FLOOR - 150], [1374, FLOOR - 170], [1410, FLOOR - 170], [1408, FLOOR - 150], [1428, FLOOR - 120], [1434, FLOOR - 60], [1404, FLOOR]], 0.5, 6), C.pot);
    let boards = '';
    for (let i = 0; i < 40; i++) { const x = c.rr(-900, 2400), y = c.rr(FLOOR + 20, 1100); boards += c.cut(c.blob(x, y, c.rr(20, 40), c.rr(4, 8), 8, 0.2), 0.4, 4); }
    f.x(boards, shade(C.clay, -0.1), 'opacity=".4"');
    floorL.add(f.out());

    /* the tailoring corner: a rod on two posts, the cloak, the stool, the basin */
    const tailL = S.layer({ par: P, sh: 4 });
    const posts = sheet();
    posts.p(c.cut(c.rect(416, CL.y - 30, 10, FLOOR - CL.y + 30), 0.4, 8) + c.cut(c.rect(696, CL.y - 30, 10, FLOOR - CL.y + 30), 0.4, 8), C.wood2);
    posts.p(c.ribbon([[410, CL.y - 2], [712, CL.y + 2]], 5), C.wood);
    tailL.add(posts.out());
    const cloakOld = tailL.add(`<g>${cloak(c)}</g>`);
    const cloakTorn = tailL.add(`<g>${cloak(c, { big: true })}</g>`);
    const pNew = tailL.add(`<g>${patch(c)}</g>`);
    const pFlap = tailL.add(`<g>${patch(c, { flap: true })}</g>`);
    const basin = sheet().p(c.cut([[-46, -30], [46, -30], [36, 0], [-36, 0]], 0.5, 6), C.stone2).p(c.cut(c.ell(0, -30, 42, 6, 16), 0.4, 4), C.lake2).out();
    tailL.add(`<g transform="translate(760 ${FLOOR})">${basin}</g>`);
    const drops = Array.from({ length: 6 }, (_, i) => ({ i, el: tailL.add(`<path d="${c.cut([[0, -5], [2.6, 1], [0, 3.4], [-2.6, 1]], 0.1, 2)}" fill="${C.lake2}"/>`), a: c.rr(-1, 1) }));
    const stool = sheet().p(c.cut(c.rect(-30, -40, 60, 10), 0.3, 5), C.wood).p(c.cut(c.rect(-24, -30, 8, 30), 0.2, 4) + c.cut(c.rect(16, -30, 8, 30), 0.2, 4), C.wood2).out();
    tailL.add(`<g transform="translate(470 ${FLOOR})">${stool}</g>`);
    const SEW = { robe: C.roseRobe, mantle: C.lavender, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.greyHair, skin: C.skin2 };
    const sewer = S.puppet(tailL.add(person(c, { ...SEW, pose: 'sit', holdF: `<g transform="translate(0 0) rotate(-40)">${needle(c)}</g>` })));
    const washer = S.puppet(tailL.add(person(c, { ...SEW })));

    /* the vintner's corner: pegs, the old skin, new skins, the jug */
    const wineL = S.layer({ par: P, sh: 4 });
    const pegs = sheet();
    pegs.p(c.cut(c.rect(900, PEG - 14, 440, 12), 0.4, 8), C.wood2);
    [960, 1100, 1240].forEach((x) => pegs.p(c.cut(c.rect(x - 4, PEG - 8, 8, 14), 0.2, 3), C.wood));
    wineL.add(pegs.out());
    const oldSkin = wineL.add(`<g>${wineskin(c, { old: true, w: 78, h: 120 })}</g>`);
    const halves = [-1, 1].map((d) => ({ d, el: wineL.add(`<g>${skinHalf(c, d, 78, 120)}</g>`) }));
    const newSkins = [1100, 1240].map((x, i) => ({ i, x, el: wineL.add(`<g>${wineskin(c, { w: 78, h: 120 })}</g>`) }));
    const spl = wineL.add(`<g>${splash(c, 50)}</g>`);
    const puddle = wineL.add(`<path d="${c.cut(c.blob(0, 0, 90, 12, 14, 0.25), 0.6, 5)}" fill="${WINE}" opacity=".85"/>`);
    const bubbles = Array.from({ length: 7 }, (_, i) => ({ i, el: wineL.add(`<circle r="${c.rr(2, 4).toFixed(1)}" fill="${mix(WINE, C.cream, 0.5)}"/>`), dx: c.rr(-10, 10) }));
    const stream = wineL.add(`<path d="${c.ribbon([[0, 0], [2, 40], [0, 80]], 5)}" fill="${WINE}"/>`);
    const glows = newSkins.map((s) => wineL.add(`<g><circle r="90" fill="url(#warm-glow)"/></g>`));
    const sparks = [0, 1, 2].map(() => wineL.add(`<g>${spark(c, 10)}</g>`));
    const VIN = townsfolk(c, { man: true, robe: C.plumRobe, mantle: C.wheatRobe, hairStyle: 'curly', beard: 'full', belt: C.leather });
    const vintner = S.puppet(wineL.add(person(c, { ...VIN, holdF: `<g transform="translate(-4 4) rotate(-20) scale(.8)">${jug(c)}</g>` })));

    return (t, time) => {
      const T = time;
      /* v16a — she sews the new patch over the hole */
      const sew = es(t, 0.15, 0.9);
      const stitch = t > 0.15 && t < 0.9 ? Math.sin(t * 40) : 0;
      const wash = es(t, 1.05, 1.2) * (1 - es(t, 1.5, 1.65));
      const back = es(t, 1.65, 1.75);
      sewer.set({ x: 470, y: FLOOR - 40, s: 1, o: 1 - es(t, 1.0, 1.05), armF: 112 + stitch * 14, armB: 60, head: -6, blink: blinkAt(T, 4) });
      washer.set({ x: lerp(600, 690, es(t, 1.0, 1.1)), y: FLOOR, s: 1, o: es(t, 1.0, 1.05) * (1 - es(t, 1.9, 2.05)), armF: 60 + wash * 20, armB: 40 + wash * 20, lean: wash * 16, head: 10, blink: blinkAt(T, 4) });
      // the cloak: on the rod → dipped in the basin → back on the rod, torn worse
      const cx = lerp(CL.x, 760, wash), cy = lerp(CL.y, FLOOR - 190, wash);
      const torn = es(t, 1.55, 1.65);
      pose(cloakOld, { x: cx, y: cy, r: wash * -20, o: 1 - torn });
      pose(cloakTorn, { x: cx, y: cy, r: wash * -20, o: torn });
      const pk = es(t, 0.2, 0.5);
      const shrink = es(t, 1.4, 1.6);
      pose(pNew, { x: lerp(470, HX, pk) + (cx - CL.x), y: lerp(FLOOR - 110, HY, pk) + (cy - CL.y), r: wash * -20, s: 1 - shrink * 0.2, o: seg(t, 0.15, 0.2) * (1 - torn) });
      pose(pFlap, { x: HX + (cx - CL.x) + 6, y: HY + (cy - CL.y) + 4, r: wash * -20 + torn * 8, s: 0.8, o: torn });
      drops.forEach((d) => {
        const k = seg(t, 1.3 + d.i * 0.02, 1.6 + d.i * 0.02);
        pose(d.el, { x: 760 + d.a * 50 * k, y: FLOOR - 36 - Math.sin(k * PI) * 60, o: bump(t, 1.28 + d.i * 0.02, 1.62 + d.i * 0.02) });
      });

      /* v17a — new wine into an old skin */
      const VK = [[1.9, 1400], [2.25, 1030], [3.9, 1030], [4.15, 1170], [4.6, 1300]];
      const vx = kf(t, VK);
      const pour1 = es(t, 2.3, 2.45) * (1 - es(t, 2.95, 3.05));
      const pour2 = es(t, 4.2, 4.3) * (1 - es(t, 4.55, 4.62));
      vintner.set({ x: vx, y: FLOOR, s: 1.02, flip: true, walk: moving(t, VK) ? vx * 0.05 : undefined, armF: 40 + (pour1 + pour2) * 80 + bump(t, 3.05, 3.4) * 60, armB: 20 + bump(t, 3.05, 3.4) * 120, lean: -bump(t, 3.05, 3.4) * 8, blink: blinkAt(T, 2) });
      const swell = es(t, 2.4, 3.05);
      const burst = es(t, 3.05, 3.12);
      pose(oldSkin, { x: 960, y: PEG, sx: 1 + swell * 0.28 + (T ? Math.sin(T * 30) * 0.02 * swell : 0), sy: 1 + swell * 0.12, o: 1 - burst });
      halves.forEach((h) => {
        const k = es(t, 3.08, 3.45, ease.out);
        pose(h.el, { x: 960 + h.d * k * 60, y: PEG + k * (FLOOR - PEG - 110), r: h.d * k * 70, o: burst });
      });
      pose(spl, { x: 960, y: PEG + 80 + es(t, 3.08, 3.4) * 120, s: 0.6 + es(t, 3.05, 3.3) * 1.2, o: bump(t, 3.05, 3.6) });
      pose(puddle, { x: 960, y: FLOOR + 14, sx: es(t, 3.2, 3.6), o: seg(t, 3.15, 3.2) });
      bubbles.forEach((b) => {
        const k = T ? ((T * 0.8 + b.i / 7) % 1) : b.i / 7;
        const on = bump(t, 2.3, 3.05) + es(t, 4.25, 4.4) * 0.8;
        pose(b.el, { x: (t < 3.5 ? 960 : 1170) + b.dx, y: PEG + 30 - k * 60, o: on * Math.sin(k * PI) });
      });
      const [jhx, jhy] = hand(vx, FLOOR, 1.02, true, 40 + (pour1 + pour2) * 80);
      pose(stream, { x: jhx - 28, y: jhy + 10, sy: 0.4 + (pour1 + pour2) * 0.5, o: (pour1 + pour2) > 0.4 ? 1 : 0 });

      /* v17c — new wine into new skins: both are kept */
      newSkins.forEach((s, i) => {
        const fill = es(t, 4.25 + i * 0.12, 4.55 + i * 0.12);
        pose(s.el, { x: s.x, y: PEG, sx: 0.7 + fill * 0.3, sy: 0.85 + fill * 0.15, o: seg(t, 3.9, 4.0) });
        pose(glows[i], { x: s.x, y: PEG + 60, s: 1, o: es(t, 4.5 + i * 0.1, 4.75 + i * 0.1) * 0.8 });
      });
      sparks.forEach((sp, i) => {
        const k = es(t, 4.55 + i * 0.08, 4.85 + i * 0.08, ease.back);
        pose(sp, { x: 1100 + i * 70, y: PEG + 20 - k * 30, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 });
      });

      /* camera: the tailor → the vintner → both */
      S.cam.x = kf(t, [[0, camFor(600)], [1.8, camFor(640)], [2.2, camFor(1060)], [3.9, camFor(1060)], [4.4, camFor(1110)]]);
      S.cam.z = 1.2 - es(t, 1.8, 2.2) * 0.04 + es(t, 2.2, 2.6) * 0.04;
      S.cam.y = 50;
    };
  },
};
