// Mt 8,14–15 — Peter's house (the same room as in Mark 1). Jesus comes in through the sunny doorway with Peter and
// the others and sees Peter's mother-in-law lying in a fever — a red glow and heat ribbons over her bed. He takes her
// hand; the heat ribbons fly off and cool sparkles fall. She gets up and serves Him: bread and a jug on a tray.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MIL, bedCut, heatWave, tray, sparkle, headAt, voiceRings, PI } from './lib.js';

const P = 0.45, FEET = 744, BEDX = 965, BEDY = 738, DOOR = 310;

export default {
  id: 'mt8-fever',
  beats: [
    { v: 14 },
    { v: 15, text: 'Ujął ją za rękę, a gorączka ją opuściła.' },
    { v: 15, cont: true, text: 'Wstała i usługiwała Mu.' },
  ],
  cam: { x: [-20, 40], y: [0, 160], z: [1, 1.45] },
  build(S) {
    const c = S.c;
    const fid = S.id('fever');
    S.defs(`<radialGradient id="${fid}"><stop offset="0" stop-color="#e86a4f" stop-opacity=".55"/><stop offset=".5" stop-color="#ef8a62" stop-opacity=".25"/><stop offset="1" stop-color="#ef8a62" stop-opacity="0"/></radialGradient>`);

    /* ---------- the room ---------- */
    S.layer({ par: 0, sky: true }).add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#cfe2dc"/>`);
    const room = S.layer({ par: 0.2, sh: 3 });
    const win = [[1120, 330], [1120, 250], ...c.arc(1170, 250, 50, 40, PI, 2 * PI, 10), [1220, 330]];
    const door = [[DOOR - 60, 604], [DOOR - 60, 400], ...c.arc(DOOR, 400, 60, 60, PI, 2 * PI, 12), [DOOR + 60, 604]];
    const wall = sheet();
    wall.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 620], [-1200, 620]], 1, 30) + c.hole(win, 0.5, 6) + c.hole(door, 0.5, 6), C.plaster);
    let patch = '';
    for (let i = 0; i < 12; i++) patch += c.cut(c.blob(c.rr(-200, 1800), c.rr(160, 560), c.rr(30, 80), c.rr(14, 30), 10, 0.2), 0.8, 6);
    wall.x(patch, C.plaster2, 'opacity=".5"');
    wall.p(c.cut([[-1200, 560], [2800, 560], [2800, 620], [-1200, 620]], 0.8, 14), C.plaster2);
    wall.p(c.ribbon([[1116, 332], [1224, 332]], 10) + c.ribbon([[1170, 212], [1170, 330]], 5), C.wood2);
    wall.p(c.ribbon([[DOOR - 64, 604], [DOOR - 64, 400]], 10) + c.ribbon([[DOOR + 64, 604], [DOOR + 64, 400]], 10) + c.ribbon(c.arc(DOOR, 400, 64, 64, PI, 2 * PI, 12), 10), C.wood2);
    wall.p(c.cut([[560, 360], [760, 360], [760, 370], [560, 370]], 0.4, 7), C.wood2);
    wall.p(c.cut(c.arc(600, 360, 22, 26, PI, 2 * PI, 8).concat([[622, 360], [578, 360]]), 0.4, 5) + c.cut([[650, 360], [654, 320], [670, 312], [686, 320], [690, 360]], 0.4, 5), C.pot);
    wall.p(c.cut(c.arc(730, 360, 20, 14, PI, 2 * PI, 8).concat([[750, 360], [710, 360]]), 0.4, 5), C.clay);
    // the net hanging on its peg: a fisherman's house
    let net = '';
    for (let i = 0; i < 6; i++) net += c.ribbon([[440 + i * 12, 250], [436 + i * 14, 340]], 1.4) + c.ribbon([[436, 262 + i * 14], [514, 262 + i * 14]], 1.4);
    wall.x(net, C.rope, 'opacity=".8"');
    wall.p(c.cut(c.circ(476, 246, 6, 8), 0.2, 3), C.wood2);
    room.add(wall.out());
    // daylight in the doorway: the street beyond
    const beyond = S.layer({ par: 0.18, sh: 1 });
    beyond.add(sheet().p(c.cut(c.rect(DOOR - 70, 330, 140, 280), 0.4, 8), '#e9efe0').p(c.cut(c.rect(DOOR - 70, 540, 140, 70), 0.4, 8), C.sand).out());
    const beamL = S.layer({ par: 0.2, sh: 1, flat: true });
    beamL.add(`<path d="${c.poly([[1120, 330], [1220, 330], [1100, 700], [960, 700]])}" fill="#fff6d8" opacity=".25"/>`);
    const floor = S.layer({ par: P, sh: 3 });
    const F = sheet();
    F.p(c.cut([[-1200, 604], [2800, 604], [2800, 1700], [-1200, 1700]], 1, 30), mix(C.sand2, C.clay, 0.2));
    let boards = '';
    for (let i = 0; i < 6; i++) { const y = 624 + i * i * 10 + i * 12; boards += c.ribbon([[-1200, y], [2800, y + c.rr(-2, 2)]], 1.6); }
    F.x(boards, shade(C.sand2, -0.2), 'opacity=".45"');
    F.p(c.cut([[380, 690], [780, 686], [804, 760], [356, 764]], 0.8, 10), C.dustyBlue);
    F.x(c.ribbon([[380, 700], [780, 696]], 3) + c.ribbon([[364, 752], [796, 750]], 3), C.cream, 'opacity=".6"');
    floor.add(F.out());

    /* ---------- the sick woman on her bed ---------- */
    const B = S.layer({ par: P, sh: 4 });
    const fever = B.add(`<ellipse rx="170" ry="110" fill="url(#${fid})"/>`);
    B.add(`<g transform="translate(${BEDX} ${BEDY})">${bedCut(c, 250)}</g>`);
    const lying = S.puppet(B.add(person(c, { ...MIL, eyes: 'closed' })));
    const blanket = B.add(sheet().p(c.cut([[925, 646], [1075, 640], [1086, 692], [918, 694]], 0.8, 8), C.skyVeil).x(c.ribbon([[930, 660], [1076, 654]], 3), C.cream, 'opacity=".6"').out());
    const sitting = S.puppet(B.add(person(c, { ...MIL, pose: 'sit' })));
    const waves = [0, 1, 2, 3].map((i) => ({ el: B.add(`<g opacity="0">${heatWave(c, 60 + (i % 2) * 20)}</g>`), x: 905 + i * 42, i }));
    const cool = [0, 1, 2, 3, 4].map((i) => B.add(`<g opacity="0">${sparkle(c, 12 + (i % 2) * 6, '#e8f3f1')}</g>`));

    /* ---------- people ---------- */
    const PL = S.layer({ par: P, sh: 5 });
    const dis = [CAST.peter, CAST.andrew, CAST.james, CAST.john].map((cast, i) => ({ cast, i, p: S.puppet(PL.add(person(c, cast))), x: 580 - i * 88, seed: c.rr(0, 9) }));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const standing = S.puppet(PL.add(person(c, { ...MIL, holdF: `<g data-k="tray" transform="translate(4 -2)">${tray(c)}</g>` })));
    const trayEl = S.$('tray');
    const talk = voiceRings(PL, c, { n: 2, color: C.clay, r: 28, w: 4 });

    return (t, time) => {
      const T = time;
      /* v14 — He comes into Peter's house and sees her lying in a fever */
      const inK = es(t, 0.02, 0.6);
      const go = es(t, 1.0, 1.3);
      const back = es(t, 2.05, 2.4);
      const jx = lerp(DOOR, 700, inK) + go * 130 - back * 130;
      const lift = es(t, 1.3, 1.6);
      jesus.set({
        x: jx, y: FEET, s: 1.05, o: seg(t, 0, 0.08), flip: back > 0 && back < 0.97,
        walk: (inK > 0 && inK < 1) || (go > 0 && go < 1) || (back > 0 && back < 1) ? jx * 0.045 : undefined,
        armF: 14 + bump(t, 0.6, 1.0) * 30 + es(t, 1.2, 1.3) * 56 * (1 - lift) + lift * 90 * (1 - es(t, 1.8, 2.05)) + es(t, 2.6, 2.8) * 40,
        armB: 10 + es(t, 1.6, 1.8) * 30 * (1 - back),
        lean: es(t, 1.2, 1.3) * 14 * (1 - lift), head: bump(t, 0.55, 1.0) * 6 + es(t, 1.2, 1.3) * 10 * (1 - lift) - es(t, 2.6, 2.8) * 4, blink: blinkAt(T),
      });
      dis.forEach((d) => {
        const k = es(t, 0.1 + d.i * 0.07, 0.65 + d.i * 0.07);
        const x = lerp(DOOR - 20, d.x, k);
        const glad = es(t, 1.6, 1.9);
        const reach = d.i === 0 ? es(t, 2.55, 2.8) : 0;
        const tell = d.i === 0 ? bump(t, 0.55, 1.0) : 0;
        d.p.set({ x: x - back * 30, y: FEET + (d.i % 2) * 6, s: 1, o: seg(t, 0.08 + d.i * 0.07, 0.16 + d.i * 0.07), walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 12 + tell * 70 + glad * (d.i % 2 ? 30 : 50) * (1 - reach) + reach * 70, armB: glad * (d.i % 2 ? 100 : 10), head: -glad * 6, blink: blinkAt(T, d.seed) });
      });
      const [phx, phy] = headAt(dis[0].x, FEET, 1);
      talk(phx, phy, bump(t, 0.6, 1.0), T, { dir: 1, spread: 1.6 });

      /* the fever, and it leaves her */
      const up = es(t, 1.4, 1.46);
      const stand = es(t, 2.04, 2.1);
      const hot = 1 - es(t, 1.45, 1.85);
      lying.set({ x: 1062, y: 648 + (T ? Math.sin(T * 2.2) * 0.8 : 0), s: 0.95, r: -90, o: 1 - up, armF: 10 });
      fade(blanket, 1 - up);
      pose(fever, { x: 990, y: 640, s: 1 + (T ? Math.sin(T * 3) * 0.05 : 0), o: hot * 0.9 });
      waves.forEach((w) => {
        const k = T ? ((T * 0.5 + w.i * 0.27) % 1) : (w.i + 0.5) / 4;
        const fly = es(t, 1.45, 1.85);
        pose(w.el, { x: w.x + (T ? Math.sin(T * 2 + w.i) * 4 : 0) + fly * (w.i - 1.5) * 60, y: 630 - k * 40 - fly * 240, s: 0.8 + k * 0.4, o: hot * (1 - k) * 0.9 + (fly > 0 && fly < 1 ? (1 - fly) * 0.6 : 0) });
      });
      cool.forEach((cl, i) => { const k = bump(t, 1.5 + i * 0.05, 2.0 + i * 0.05); pose(cl, { x: 900 + i * 32, y: 600 - (i % 2) * 40 - seg(t, 1.5, 2.0) * 40, s: k, r: T * 40 + i * 30, o: k }); });
      sitting.set({ x: 928, y: 690, s: 0.95, flip: true, o: up * (1 - stand), armF: 30 + lift * 60, armB: 10, head: -lift * 6, blink: blinkAt(T, 3) });

      /* v15b — she gets up and serves Him */
      const serve = es(t, 2.1, 2.5);
      const sx = lerp(905, 790, serve);
      const offer = es(t, 2.5, 2.7);
      const sArm = 20 + es(t, 2.05, 2.15) * 50 + offer * 25;
      pose(trayEl, { x: 4, y: -2, r: sArm });
      standing.set({ x: sx, y: FEET, s: 0.95, flip: true, o: stand, walk: serve > 0 && serve < 1 ? sx * 0.05 : undefined, armF: sArm, armB: 10, head: -4, blink: blinkAt(T, 3) });
      fade(trayEl, stand);

      S.cam.z = 1.12 + es(t, 0.6, 1.0) * 0.14 + es(t, 1.0, 1.4) * 0.08 - es(t, 2.0, 2.4) * 0.1;
      S.cam.x = es(t, 0.6, 1.2) * 40 * (1 - es(t, 2.0, 2.4) * 0.6);
      S.cam.y = 60 + es(t, 0.6, 1.0) * 60;
    };
  },
};
