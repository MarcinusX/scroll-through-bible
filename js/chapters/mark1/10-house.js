// Mk 1,29–31 — from the synagogue to the house of Simon and Andrew: the street drop flies up to show the room;
// Simon's mother-in-law lies in a fever (red heat waves); they tell Jesus; He takes her hand and raises her,
// the fever flies off, and she gets up to serve them bread.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { bed } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MIL, hand, headAt, voiceRings, houseFacade, tray, heatWave, sparkle } from './lib.js';

const PI = Math.PI;
const P = 0.45;
const FEET = 744;
const BEDX = 965, BEDY = 738;

export default {
  id: 'm1-house',
  beats: [
    { v: 29 },
    { v: 30, text: 'Teściowa zaś Szymona leżała w gorączce.' },
    { v: 30, cont: true, text: 'Zaraz powiedzieli Mu o niej.' },
    { v: 31, text: 'On podszedł do niej i podniósł ją ująwszy za rękę,' },
    { v: 31, cont: true, text: 'gorączka ją opuściła.' },
    { v: 31, cont: true, text: 'A ona im usługiwała.' },
  ],
  cam: { x: [-20, 40], y: [0, 160], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    // while the street drop hangs in front, the room behind it stays hidden (so it never flashes through during the set change)
    const roomLs = [];
    const mkLayer = S.layer;
    S.layer = (o) => { const Ly = mkLayer(o); roomLs.push(Ly); return Ly; };
    const fid = S.id('fever');
    S.defs(`<radialGradient id="${fid}"><stop offset="0" stop-color="#e86a4f" stop-opacity=".55"/><stop offset=".5" stop-color="#ef8a62" stop-opacity=".25"/><stop offset="1" stop-color="#ef8a62" stop-opacity="0"/></radialGradient>`);

    /* ---------- the room ---------- */
    const skyL = S.layer({ par: 0, sky: true });
    skyL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#cfe2dc"/>`);
    const room = S.layer({ par: 0.2, sh: 3 });
    const win = [[1120, 330], [1120, 250], ...c.arc(1170, 250, 50, 40, PI, 2 * PI, 10), [1220, 330]];
    const wall = sheet();
    wall.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 620], [-1200, 620]], 1, 30) + c.hole(win, 0.5, 6), C.plaster);
    let patch = '';
    for (let i = 0; i < 12; i++) patch += c.cut(c.blob(c.rr(-200, 1800), c.rr(160, 560), c.rr(30, 80), c.rr(14, 30), 10, 0.2), 0.8, 6);
    wall.x(patch, C.plaster2, 'opacity=".5"');
    wall.p(c.cut([[-1200, 560], [2800, 560], [2800, 620], [-1200, 620]], 0.8, 14), C.plaster2);
    wall.p(c.ribbon([[1116, 332], [1224, 332]], 10) + c.ribbon([[1170, 212], [1170, 330]], 5), C.wood2);
    // doorway on the left with daylight, shelf with jars, herbs
    wall.p(c.cut([[250, 600], [250, 400], ...c.arc(310, 400, 60, 60, PI, 2 * PI, 12), [370, 600]], 0.5, 6), '#e9efe0');
    wall.p(c.ribbon([[246, 602], [246, 400]], 10) + c.ribbon([[374, 602], [374, 400]], 10) + c.ribbon(c.arc(310, 400, 64, 64, PI, 2 * PI, 12), 10), C.wood2);
    wall.p(c.cut([[560, 360], [760, 360], [760, 370], [560, 370]], 0.4, 7), C.wood2);
    wall.p(c.cut(c.arc(600, 360, 22, 26, PI, 2 * PI, 8).concat([[622, 360], [578, 360]]), 0.4, 5) + c.cut([[650, 360], [654, 320], [670, 312], [686, 320], [690, 360]], 0.4, 5), C.pot);
    wall.p(c.cut(c.arc(730, 360, 20, 14, PI, 2 * PI, 8).concat([[750, 360], [710, 360]]), 0.4, 5), C.clay);
    wall.p(c.ribbon([[470, 200], [476, 320]], 3) + c.ribbon([[500, 200], [494, 330]], 3), C.moss);
    wall.p(c.cut(c.blob(475, 330, 14, 24, 9, 0.2), 0.6, 5) + c.cut(c.blob(494, 344, 12, 22, 9, 0.2), 0.6, 5), C.olive);
    room.add(wall.out());
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
    B.add(`<g transform="translate(${BEDX} ${BEDY})">${bed(c, 250)}</g>`);
    const lying = S.puppet(B.add(person(c, { ...MIL, eyes: 'closed' })));
    const blanket = B.add(sheet().p(c.cut([[925, 646], [1075, 640], [1086, 692], [918, 694]], 0.8, 8), C.skyVeil).x(c.ribbon([[930, 660], [1076, 654]], 3), C.cream, 'opacity=".6"').out());
    const sitting = S.puppet(B.add(person(c, { ...MIL, pose: 'sit' })));
    const waves = [0, 1, 2, 3].map((i) => ({ el: B.add(`<g opacity="0">${heatWave(c, 60 + (i % 2) * 20)}</g>`), x: 905 + i * 42, i }));
    const cool = [0, 1, 2, 3, 4].map((i) => B.add(`<g opacity="0">${sparkle(c, 12 + (i % 2) * 6, '#e8f3f1')}</g>`));

    /* ---------- people ---------- */
    const PL = S.layer({ par: P, sh: 5 });
    const dis = [
      { cast: CAST.john, x: 300 }, { cast: CAST.james, x: 390 }, { cast: CAST.andrew, x: 480 }, { cast: CAST.peter, x: 570 },
    ].map((d, i) => ({ ...d, p: S.puppet(PL.add(person(c, d.cast))), i }));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const standing = S.puppet(PL.add(person(c, { ...MIL, holdF: `<g data-k="tray" transform="translate(4 -2)">${tray(c)}</g>` })));
    const trayEl = S.$('tray');
    const talk = voiceRings(PL, c, { n: 2, color: C.clay, r: 28, w: 4 });

    /* ---------- the street drop ---------- */
    S.layer = mkLayer;
    const drop = S.layer({ par: 0.3, sh: 8, pad: 1500 });
    drop.add(houseFacade(S));
    const walkers = [CAST.jesus, CAST.peter, CAST.andrew, CAST.james, CAST.john].map((cast, i) => ({ p: S.puppet(drop.add(person(c, cast))), i }));

    return (t, time) => {
      roomLs.forEach((Ly) => Ly.fade(seg(t, 0.86, 0.93)));
      /* v29: out of the synagogue, along the street, into Simon's house */
      walkers.forEach((w) => {
        const k = es(t, 0.02 + w.i * 0.04, 0.7 + w.i * 0.03);
        const x = lerp(-80 - w.i * 105, 900 - w.i * 100, k);
        const inK = es(t, 0.74 + w.i * 0.04, 0.88 + w.i * 0.04);
        w.p.set({ x: x + inK * (950 - x), y: lerp(730 + (w.i % 2) * 10, 664, inK), s: lerp(1, 0.84, inK), o: 1 - es(t, 0.82 + w.i * 0.04, 0.9 + w.i * 0.04), walk: (k > 0 && k < 1) || (inK > 0 && inK < 1) ? x * 0.05 : undefined, armF: 12, blink: blinkAt(time, w.i) });
      });
      drop.shift(0, -es(t, 0.92, 1.16, ease.in) * 1450);
      drop.fade(1 - seg(t, 1.12, 1.16));

      /* v30: the fever */
      const up = es(t, 3.42, 3.5);          // lying → sitting
      const stand = es(t, 3.78, 3.86);      // sitting → standing
      const hot = 1 - es(t, 4.05, 4.5);
      lying.set({ x: 1062, y: 648 + Math.sin(time * 2.2) * 0.8, s: 0.95, r: -90, o: 1 - up, armF: 10, armB: 0, head: 0 });
      fade(blanket, 1 - up);
      pose(fever, { x: 990, y: 640, s: 1 + Math.sin(time * 3) * 0.05, o: hot * 0.9 });
      waves.forEach((w) => {
        const k = time ? ((time * 0.5 + w.i * 0.27) % 1) : (w.i + 0.5) / 4;
        const fly = es(t, 4.05, 4.45);
        pose(w.el, { x: w.x + Math.sin(time * 2 + w.i) * 4 + fly * (w.i - 1.5) * 60, y: 630 - k * 40 - fly * 240, s: 0.8 + k * 0.4, o: hot * (1 - k) * 0.9 + (fly > 0 && fly < 1 ? (1 - fly) * 0.6 : 0) });
      });
      cool.forEach((cl, i) => {
        const k = bump(t, 4.2 + i * 0.05, 4.9 + i * 0.05);
        pose(cl, { x: 900 + i * 32, y: 600 - (i % 2) * 40 - seg(t, 4.2, 4.9) * 40, s: k, r: time * 40 + i * 30, o: k });
      });

      /* Jesus: listens, goes to her, takes her hand and raises her */
      const go = es(t, 3.02, 3.38);
      const back = es(t, 4.95, 5.3);
      const jx = lerp(700, 830, go) - back * 130;
      const lift = es(t, 3.4, 3.85);
      jesus.set({
        x: jx, y: FEET, s: 1.05, flip: back > 0 && back < 0.97,
        walk: (go > 0 && go < 1) || (back > 0 && back < 1) ? jx * 0.045 : undefined,
        armF: 14 + bump(t, 2.05, 2.9) * 20 + es(t, 3.3, 3.42) * 56 * (1 - lift) + lift * 90 * (1 - es(t, 3.9, 4.2)) + es(t, 5.4, 5.7) * 40,
        armB: 10 + es(t, 4.2, 4.5) * 30 * (1 - back),
        lean: es(t, 3.3, 3.42) * 14 * (1 - lift), head: es(t, 3.3, 3.42) * 10 * (1 - lift) - es(t, 5.4, 5.7) * 4, blink: blinkAt(time),
      });
      sitting.set({ x: 928, y: 690, s: 0.95, flip: true, o: up * (1 - stand), armF: 30 + lift * 60, armB: 10, head: -lift * 6, blink: blinkAt(time, 3) });

      /* v31c: she gets up and serves them */
      const serve = es(t, 5.05, 5.55);
      const sx = lerp(905, 815, serve);
      const offer = es(t, 5.55, 5.8);
      const sArm = 20 + es(t, 4.4, 4.7) * 30 + es(t, 5.0, 5.1) * 40 + offer * 25;
      pose(trayEl, { x: 4, y: -2, r: sArm });
      standing.set({ x: sx, y: FEET, s: 0.95, flip: true, o: stand, walk: serve > 0 && serve < 1 ? sx * 0.05 : undefined, armF: sArm, armB: 10 + es(t, 4.4, 4.7) * 40 * (1 - es(t, 5.0, 5.1)), head: -es(t, 4.4, 4.7) * 6, blink: blinkAt(time, 3) });
      fade(trayEl, es(t, 5.0, 5.1));

      /* the disciples: waiting, then telling Him about her, then fed */
      const tell = es(t, 2.05, 2.3) * (1 - es(t, 2.9, 3.1));
      const glad = es(t, 4.1, 4.4);
      dis.forEach((d) => {
        const teller = d.cast === CAST.peter || d.cast === CAST.andrew;
        const shift = back * -30;
        const reach = d.cast === CAST.peter ? offer : 0;
        d.p.set({ x: d.x + shift, y: FEET + (d.i % 2) * 6, s: 1.0, flip: false, armF: 12 + (teller ? tell * 80 : 0) + glad * (d.i % 2 ? 30 : 60) * (1 - reach) + reach * 70, armB: teller ? tell * 40 : glad * (d.i % 2 ? 100 : 0), head: teller ? -tell * 4 : -glad * 6, walk: back > 0 && back < 1 ? (d.x + shift) * 0.05 : undefined, blink: blinkAt(time, d.i + 1) });
      });
      const [phx, phy] = headAt(570, FEET, 1.0);
      talk(phx, phy, tell, time, { dir: 1, spread: 1.6 });

      const inside = es(t, 0.95, 1.4);
      S.cam.z = 1.04 + inside * 0.4 + es(t, 3.0, 3.5) * 0.1 - es(t, 4.9, 5.4) * 0.1;
      S.cam.x = es(t, 3.0, 3.5) * 30 * (1 - es(t, 4.9, 5.4));
      S.cam.y = 20 + inside * 120;
    };
  },
};
