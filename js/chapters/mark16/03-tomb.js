// Mk 16,5–7 — Inside the tomb. Morning light falls through the low doorway; on the right side a young man
// in a white robe sits, shining. The women start back in fear. "Don't be afraid!" A disc on a string:
// the cross on its hill ("crucified") turns over to the sunrise over an empty tomb ("He has risen").
// The ledge is empty, the linen folded: "See the place where they laid him." Then: go, tell his disciples
// — and Peter — and a map flies in: a road of light runs from Jerusalem up to Galilee, He goes before them.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { WOMEN, YOUTH, ELEVEN, spiceJar, linenCloths, medallion, discFaces, landMap, MAP, headAt, hand, voiceRings, strip, nameTag, sparkle, along, upright, tr, PI } from './lib.js';
import { CAST } from '../kit.js';

const FLOOR = 700;
const DOOR_X = 470;
const LEDGE = { x0: 790, x1: 1290, top: 610 };
const YX0 = 1150;          // the young man sits on the right
const PLACE = 930;         // where they laid him

export default {
  id: 'm16-tomb',
  beats: [
    { v: 5, text: 'Weszły więc do grobu i ujrzały młodzieńca siedzącego po prawej stronie, ubranego w białą szatę;' },
    { v: 5, cont: true, text: 'i bardzo się przestraszyły.' },
    { v: 6, text: 'Lecz on rzekł do nich: «Nie bójcie się!' },
    { v: 6, cont: true, text: 'Szukacie Jezusa z Nazaretu, ukrzyżowanego;' },
    { v: 6, cont: true, text: 'powstał, nie ma Go tu.' },
    { v: 6, cont: true, text: 'Oto miejsce, gdzie Go złożyli.' },
    { v: 7, text: 'Lecz idźcie, powiedzcie Jego uczniom i Piotrowi:' },
    { v: 7, cont: true, text: 'Idzie przed wami do Galilei, tam Go ujrzycie, jak wam powiedział».' },
  ],
  cam: { x: [-40, 120], y: [-30, 60], z: [0.84, 1.18] },
  build(S) {
    const c = S.c;
    // phone: the young man sits further in from the right edge (under the progress thread at 1150),
    // the women stand a little further from the doorway's edge
    const YX = S.portrait ? 1050 : YX0;
    /* the cave: back wall, floor, doorway with the morning outside */
    const back = S.layer({ par: 0, sky: true });
    const wall = mix(C.rock2, C.soilDark, 0.3);
    back.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${wall}"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
    const cave = S.layer({ par: 0.3, sh: 3 });
    const cs = sheet();
    let blots = '';
    for (let i = 0; i < 26; i++) blots += c.cut(c.blob(c.rr(-600, 2200), c.rr(-400, 660), c.rr(60, 160), c.rr(30, 70), 10, 0.3), 1, 8);
    cs.x(blots, shade(wall, 0.1), 'opacity=".6"');
    cave.add(cs.out());
    const outside = S.layer({ par: 0.45, sh: 2 });
    const os = sheet();
    const doorPts = [[DOOR_X - 70, FLOOR], [DOOR_X - 70, 520], ...c.arc(DOOR_X, 520, 70, 60, PI, 2 * PI, 12), [DOOR_X + 70, 520], [DOOR_X + 70, FLOOR]];
    os.p(c.cut(doorPts, 0.5, 6), mix(C.skyBlue, C.dawn, 0.4));
    os.p(c.cut([[DOOR_X - 70, 640], [DOOR_X - 20, 620], [DOOR_X + 70, 630], [DOOR_X + 70, FLOOR], [DOOR_X - 70, FLOOR]], 0.6, 6), C.sage);
    os.p(c.cut(c.blob(DOOR_X + 30, 600, 26, 40, 9, 0.2), 0.6, 5), C.moss);
    outside.add(os.out());
    const room = S.layer({ par: 0.5, sh: 5 });
    const rs = sheet();
    // the rock around the doorway (the wall we are looking along), floor
    const ceil = [];
    for (let x = 2500; x > 360; x -= 70) ceil.push([x, 330 + Math.sin(x / 130) * 26 + c.rr(-10, 10) + (x < 700 ? (700 - x) * 0.12 : 0)]);
    rs.p(c.cut([[-900, -600], [2500, -600], ...ceil, [330, 440], [300, 480], [300, FLOOR + 10], [-900, FLOOR + 10]], 2, 14) + c.hole(doorPts.map(([x, y]) => [x, y + (y >= FLOOR ? 10 : 0)]), 0.5, 6), mix(C.rock3, C.soilDark, 0.45));
    rs.p(c.cut([[-900, FLOOR - 6], [2500, FLOOR - 10], [2500, 1700], [-900, 1700]], 1.2, 20), mix(C.rock2, C.soilDark, 0.25));
    // the ledge cut into the rock on the right
    rs.p(c.cut([[LEDGE.x0, LEDGE.top], [LEDGE.x1 + 200, LEDGE.top - 6], [LEDGE.x1 + 200, FLOOR - 6], [LEDGE.x0 + 10, FLOOR - 6]], 0.8, 10), mix(C.rock, C.soilDark, 0.1));
    rs.p(c.cut([[LEDGE.x0 - 10, LEDGE.top - 8], [LEDGE.x1 + 200, LEDGE.top - 14], [LEDGE.x1 + 200, LEDGE.top + 4], [LEDGE.x0, LEDGE.top + 6]], 0.6, 10), mix(C.rock, C.cream, 0.15));
    room.add(rs.out());
    // a shaft of morning light across the floor
    const shaft = room.add(`<path d="${c.poly([[DOOR_X - 60, FLOOR - 2], [DOOR_X + 70, FLOOR - 2], [DOOR_X + 420, FLOOR + 140], [DOOR_X + 120, FLOOR + 150]])}" fill="${C.lampGlow}" opacity=".35"/>`);
    // the place where they laid him: the folded linen, a soft light
    const placeGlow = room.add(`<g opacity="0"><ellipse cx="0" cy="-10" rx="170" ry="60" fill="url(#halo-glow)"/></g>`);
    room.add(`<g transform="translate(${PLACE} ${LEDGE.top - 6})">${linenCloths(c)}</g>`);
    const placeSpark = [0, 1, 2].map((i) => room.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    /* the young man in white */
    const youthL = S.layer({ par: 0.52, sh: 5 });
    const aura = youthL.add(`<g><circle r="260" fill="url(#halo-glow)"/></g>`);
    const youth = S.puppet(youthL.add(person(c, { ...YOUTH, pose: 'sit' })));
    const voice = voiceRings(youthL, c, { n: 3, color: C.halo, r: 36, w: 5, both: false });

    /* the three women */
    const PL = S.layer({ par: 0.55, sh: 5 });
    const W = WOMEN.map((w, i) => {
      const holdF = `<g transform="translate(2 8)">${spiceJar(c, [C.cream, C.blushVeil, C.linen2][i], [C.clay, C.plumRobe, C.teal2][i])}</g>`;
      return { ...w, i, x: (S.portrait ? [750, 655, 560] : [720, 620, 520])[i], seed: c.rr(0, 9), p: S.puppet(PL.add(person(c, { ...w.o, holdF }))) };
    });
    const fear = W.map(() => PL.add(`<g>${[-1, 1].map((d) => `<path d="${c.ribbon([[d * 16, -4], [d * 22, -12], [d * 18, -18], [d * 24, -26]], 2.2)}" fill="${C.cream}"/>`).join('')}</g>`));

    /* the disc: crucified → risen */
    const fx = S.layer({ par: 0.6, sh: 6 });
    const faces = discFaces(c, 96);
    const disc = hanging(fx, `<g data-k="discF">${faces.front}</g><g data-k="discB" opacity="0">${faces.back}</g>`, { x: 0, y: 0, len: 700 });
    const discF = S.$('discF'), discB = S.$('discB');
    const nameStrip = fx.add(`<g>${strip(c, tr('Jezus z Nazaretu', 'Jesus the Nazarene'), { size: 20 })}</g>`);
    const risen = fx.add(`<g>${strip(c, tr('Powstał!', 'He has risen!'), { size: 24, fill: C.halo })}</g>`);

    /* the disciples — and Peter */
    const MED = ELEVEN.map((m, i) => ({ el: hanging(fx, medallion(c, m.o, { r: i === 0 ? 34 : 22 }), { x: 0, y: 0, len: 700 }), i }));
    const peterTag = fx.add(`<g>${nameTag(c, tr('Piotr', 'Peter'), { size: 16 })}</g>`);

    /* the map: He goes before you into Galilee */
    const mapL = S.layer({ par: 0.7, sh: 8 });
    const mapEl = mapL.add(`<g>${landMap(c)}</g>`);
    const roadPts = c.cbez(MAP.road[0], MAP.road[1], MAP.road[3], MAP.road[5], 40);
    const roadEl = mapL.add(`<path d="${c.line(roadPts)}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" stroke="${C.halo}" stroke-width="9" stroke-linecap="round" fill="none"/>`);
    const leader = mapL.add(`<g><circle r="40" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.circ(0, 0, 13, 16), 0.3, 3), C.halo).p(c.cut(c.circ(0, 0, 8, 12), 0.2, 3), C.jesusMantle).out()}</g>`);
    const followers = Array.from({ length: 11 }, (_, i) => mapL.add(`<path d="${c.cut(c.circ(0, 0, 5, 8), 0.2, 2)}" fill="${[C.ochre, C.dustyBlue, C.mauve, C.sageRobe, C.roseRobe, C.ochreRobe, C.plumRobe, C.tealRobe, C.linen2, C.lavender, C.clayMantle][i]}"/>`));
    const seeYou = mapL.add(`<g>${sparkle(c, 22)}</g>`);

    return (t, time) => {
      const MX = 800, MY = 380;
      /* v5a: they enter, stooping, and see him sitting on the right */
      const glow = es(t, 0.3, 0.9);
      const calm = es(t, 2.0, 2.5);
      pose(aura, { x: YX, y: 520, s: 0.5 + glow * 0.6 + calm * 0.4 + Math.sin(time * 1.2) * 0.02, o: glow });
      fade(shaft, 0.25 + Math.sin(time * 0.5) * 0.03);
      const speak = es(t, 2.02, 2.2);
      const toPlace = es(t, 4.05, 4.3) * (1 - es(t, 6.0, 6.2));
      const toDoor = es(t, 6.05, 6.3);
      youth.set({
        x: YX, y: LEDGE.top, s: 1.02, flip: true, o: glow,
        armF: 10 + speak * 60 + bump(t, 2.0, 2.9) * 20 + toPlace * 10 + toDoor * 30, armB: 10 + bump(t, 2.0, 3.0) * 70 + es(t, 4.0, 4.2) * (1 - es(t, 4.9, 5.1)) * 110,
        head: -es(t, 4.05, 4.3) * 6 + toPlace * 10 * (1 - toDoor), blink: blinkAt(time, 2),
      });
      const [yhx, yhy] = headAt(YX, LEDGE.top, 1.02, true, 62);
      voice(yhx - 20, yhy, (bump(t, 2.0, 3.0) + es(t, 3.0, 3.2) * (1 - es(t, 7.8, 8))) * 0.9, time, { spread: 2, dir: -1 });

      W.forEach((w) => {
        const d = w.i * 0.16;
        const enter = es(t, 0.05 + d, 0.7 + d, ease.out);
        const recoil = es(t, 1.02, 1.2, ease.out) * (1 - calm);
        const tremble = recoil * Math.sin(time * 38 + w.i) * 2;
        const near = es(t, 5.05, 5.4) * (1 - es(t, 6.2, 6.5));
        const go = es(t, 6.4, 6.9);
        const x = lerp(DOOR_X - 20, w.x, enter) - recoil * 40 + near * 70 + tremble - go * 30;
        const armF = 26 + recoil * 60 - near * 6;
        w.p.set({ x, y: FLOOR, s: 1.02, flip: go > 0.5 && t > 7.5 ? false : false, walk: enter > 0 && enter < 1 ? x * 0.05 : undefined, amt: 0.8, lean: (1 - enter) * 16 - recoil * 6 + near * 8, armF, armB: 8 + recoil * 120 + bump(t, 4.1, 4.9) * 80, head: recoil * -8 + near * 12 - bump(t, 3.2, 4.8) * 10, blink: recoil > 0.3 ? 0 : blinkAt(time, w.seed), o: seg(t, 0 + d, 0.08 + d) });
        upright(w.p, 'F', armF);
        const [hx, hy] = headAt(x, FLOOR, 1.02, false);
        pose(fear[w.i], { x: hx, y: hy - 4, s: 1 + recoil * 0.2, o: recoil });
      });

      /* v6b–c: the disc on its string: the cross; then it turns over — the sunrise, the empty tomb */
      const dIn = es(t, 3.02, 3.35, ease.back) * (1 - es(t, 5.9, 6.15));
      const flip = es(t, 4.02, 4.3);
      const sx = Math.cos(flip * PI);
      swing(disc, MX, lerp(-1000, 300, dIn), time, 1, 0.7);
      pose(disc.querySelector('.obj'), { sx: Math.max(0.03, Math.abs(sx)) });
      fade(discF, sx >= 0 ? 1 : 0);
      fade(discB, sx < 0 ? 1 : 0);
      const ns = es(t, 3.3, 3.5, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(nameStrip, { x: MX, y: 440, s: ns, r: -2, o: ns > 0.01 ? 1 : 0 });
      const rs2 = es(t, 4.3, 4.5, ease.back) * (1 - es(t, 5.9, 6.1));
      pose(risen, { x: MX, y: 440, s: rs2, r: 2, o: rs2 > 0.01 ? 1 : 0 });

      /* v6d: the place where they laid him */
      const here = es(t, 4.4, 4.8) + es(t, 5.02, 5.3) * 0.6;
      pose(placeGlow, { x: PLACE + 10, y: LEDGE.top - 6, o: Math.min(1, here), s: 0.8 + here * 0.2 });
      placeSpark.forEach((el, i) => {
        const b = bump(t, 5.1 + i * 0.12, 5.8 + i * 0.12);
        pose(el, { x: PLACE - 50 + i * 60, y: LEDGE.top - 40 - i * 8, s: b, r: time * 30 + i * 40, o: b });
      });

      /* v7a: go, tell his disciples — and Peter */
      MED.forEach((m) => {
        const k = es(t, 6.1 + m.i * 0.04, 6.4 + m.i * 0.04, ease.back) * (1 - es(t, 7.0, 7.2));
        const x = m.i === 0 ? 800 : 800 + (m.i % 2 ? -1 : 1) * (40 + Math.ceil(m.i / 2) * (S.portrait ? 46 : 58));   // phone: the row fits the screen
        const y = m.i === 0 ? 230 : 250 + Math.ceil(m.i / 2) * 6;
        swing(m.el, x, lerp(-1000, y, k), time, 1.4, 0.8, m.i);
        const pk = m.i === 0 ? 1 + bump(t, 6.5, 6.95) * 0.25 : 1;
        pose(m.el.querySelector('.obj'), { s: pk });
      });
      const pt = es(t, 6.5, 6.7, ease.back) * (1 - es(t, 7.0, 7.15));
      pose(peterTag, { x: 800, y: 266, s: pt, o: pt > 0.01 ? 1 : 0 });

      /* v7b: the map comes down: a road of light, He goes before them into Galilee */
      const mIn = es(t, 7.0, 7.3, ease.out);
      const MK = S.portrait ? 0.8 : 1;   // phone: a smaller map, all of it on the screen
      mapL.shift(0, (1 - mIn) * -900);
      mapL.fade(mIn > 0.001 ? 1 : 0);
      pose(mapEl, { x: MX, y: MY, r: -1.2, s: MK });
      const road = es(t, 7.25, 7.75);
      pose(roadEl, { x: MX, y: MY, r: -1.2, s: MK });
      attr(roadEl, 'stroke-dashoffset', (1 - road).toFixed(3));
      const [lx, ly] = along(roadPts, es(t, 7.25, 7.8));
      pose(leader, { x: MX + lx * MK, y: MY + ly * MK, s: 1 + Math.sin(time * 3) * 0.06, o: seg(t, 7.2, 7.3) });
      followers.forEach((f, i) => {
        const [fx2, fy] = along(roadPts, Math.max(0, es(t, 7.35, 7.95) - 0.1 - i * 0.012));
        pose(f, { x: MX + fx2 * MK + ((i % 3) - 1) * 6, y: MY + fy * MK + ((i % 2) * 6 - 3), o: seg(t, 7.35, 7.45) });
      });
      const see = es(t, 7.75, 7.95, ease.back);
      pose(seeYou, { x: MX + (MAP.lake[0] + 60) * MK, y: MY + (MAP.lake[1] - 50) * MK, s: see * 1.3, r: time * 25, o: see });

      S.cam.x = es(t, 0, 0.8) * 60 + es(t, 4.4, 5.0) * 60 * (1 - es(t, 5.9, 6.3)) - es(t, 5.9, 6.3) * 60 * (1 - es(t, 6.9, 7.2));
      S.cam.y = 20 + es(t, 4.4, 5.0) * 30 * (1 - es(t, 5.9, 6.3)) - es(t, 5.9, 6.3) * 40;
      S.cam.z = (1.04 + es(t, 4.4, 5.0) * 0.14 * (1 - es(t, 5.9, 6.3))) * (S.portrait ? 0.82 : 1);
    };
  },
};
