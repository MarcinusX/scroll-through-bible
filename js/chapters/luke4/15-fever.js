// Łk 4,38–39 — out of the synagogue along the street to Simon's house (Mark 1's house); the street drop flies up
// to show the room. Simon's mother-in-law lies burning with a high fever, red heat rising from her bed. Simon,
// Andrew and Simon's wife kneel and beg Him for her. He stands over her, bends down and rebukes the fever — and the
// heat tears away out of the window, the red glow goes out, cool sparks settle. At once she gets up and serves
// them bread.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { bed } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MIL, headAt, hand, voiceRings, houseFacade, tray, heatWave, sparkle, womanO, tr, PI } from './lib.js';

const P = 0.45;
const FEET = 744;
const BEDX = 985, BEDY = 738;
const WIFE = { robe: C.sageRobe, hairStyle: 'veil', veil: C.blushVeil, veil2: shade(C.blushVeil, -0.1), hair: C.hair2, skin: C.skin2, beard: 'none', belt: null };

export default {
  id: 'lk4-fever',
  beats: [
    { v: 38, text: 'Po opuszczeniu synagogi przyszedł do domu Szymona.' },
    { v: 38, cont: true, text: 'A wysoka gorączka trawiła teściową Szymona.' },
    { v: 38, cont: true, text: 'I prosili Go za nią.' },
    { v: 39, text: 'On stanąwszy nad nią rozkazał gorączce, i opuściła ją.' },
    { v: 39, cont: true, text: 'Zaraz też wstała i usługiwała im.' },
  ],
  cam: { x: [-20, 40], y: [0, 160], z: [1, 1.5] },
  build(S) {
    const c = S.c;
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
    wall.p(c.cut([[250, 600], [250, 400], ...c.arc(310, 400, 60, 60, PI, 2 * PI, 12), [370, 600]], 0.5, 6), '#e9efe0');
    wall.p(c.ribbon([[246, 602], [246, 400]], 10) + c.ribbon([[374, 602], [374, 400]], 10) + c.ribbon(c.arc(310, 400, 64, 64, PI, 2 * PI, 12), 10), C.wood2);
    wall.p(c.cut([[560, 360], [760, 360], [760, 370], [560, 370]], 0.4, 7), C.wood2);
    wall.p(c.cut(c.arc(600, 360, 22, 26, PI, 2 * PI, 8).concat([[622, 360], [578, 360]]), 0.4, 5) + c.cut([[650, 360], [654, 320], [670, 312], [686, 320], [690, 360]], 0.4, 5), C.pot);
    wall.p(c.ribbon([[470, 200], [476, 320]], 3) + c.ribbon([[500, 200], [494, 330]], 3), C.moss);
    wall.p(c.cut(c.blob(475, 330, 14, 24, 9, 0.2), 0.6, 5) + c.cut(c.blob(494, 344, 12, 22, 9, 0.2), 0.6, 5), C.olive);
    room.add(wall.out());
    const floor = S.layer({ par: P, sh: 3 });
    const F = sheet();
    F.p(c.cut([[-1200, 604], [2800, 604], [2800, 1700], [-1200, 1700]], 1, 30), mix(C.sand2, C.clay, 0.2));
    let boards = '';
    for (let i = 0; i < 6; i++) { const y = 624 + i * i * 10 + i * 12; boards += c.ribbon([[-1200, y], [2800, y + c.rr(-2, 2)]], 1.6); }
    F.x(boards, shade(C.sand2, -0.2), 'opacity=".45"');
    F.p(c.cut([[380, 690], [780, 686], [804, 760], [356, 764]], 0.8, 10), C.dustyBlue);
    floor.add(F.out());

    /* ---------- the sick woman ---------- */
    const B = S.layer({ par: P, sh: 4 });
    const fever = B.add(`<ellipse rx="190" ry="120" fill="url(#${fid})"/>`);
    B.add(`<g transform="translate(${BEDX} ${BEDY})">${bed(c, 250)}</g>`);
    const lying = S.puppet(B.add(person(c, { ...MIL, eyes: 'closed' })));
    const blanket = B.add(sheet().p(c.cut([[945, 646], [1095, 640], [1106, 692], [938, 694]], 0.8, 8), C.skyVeil).x(c.ribbon([[950, 660], [1096, 654]], 3), C.cream, 'opacity=".6"').out());
    const waves = [0, 1, 2, 3, 4].map((i) => ({ el: B.add(`<g opacity="0">${heatWave(c, 60 + (i % 2) * 24)}</g>`), x: 915 + i * 40, i }));
    const cool = [0, 1, 2, 3, 4].map((i) => B.add(`<g opacity="0">${sparkle(c, 12 + (i % 2) * 6, '#e8f3f1')}</g>`));

    /* ---------- people ---------- */
    const PL = S.layer({ par: P, sh: 5 });
    const kneel = [{ o: CAST.peter, x: 470 }, { o: WIFE, x: 560 }, { o: CAST.andrew, x: 650 }].map((k, i) => ({ ...k, i, st: S.puppet(PL.add(person(c, k.o))), kn: S.puppet(PL.add(person(c, { ...k.o, pose: 'kneel' }))) }));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const standing = S.puppet(PL.add(person(c, { ...MIL, holdF: `<g data-k="lk4-tray" transform="translate(4 -2)">${tray(c)}</g>` })));
    const trayEl = S.$('lk4-tray');
    const jVoice = voiceRings(PL, c, { n: 3, color: C.sun, r: 38, w: 5 });
    const beg = voiceRings(PL, c, { n: 2, color: C.clay, r: 28, w: 4 });

    /* ---------- the street drop ---------- */
    S.layer = mkLayer;
    const drop = S.layer({ par: 0.3, sh: 8, pad: 1500 });
    drop.add(houseFacade(S));
    const walkers = [CAST.jesus, CAST.peter, CAST.andrew].map((cast, i) => ({ p: S.puppet(drop.add(person(c, cast))), i }));

    return (t, time) => {
      roomLs.forEach((Ly) => Ly.fade(seg(t, 0.44, 0.5)));
      /* v38a: from the synagogue to Simon's house */
      walkers.forEach((w) => {
        const k = es(t, 0.0 + w.i * 0.03, 0.34 + w.i * 0.02);
        const x = lerp(-80 - w.i * 110, 900 - w.i * 100, k);
        const inK = es(t, 0.32 + w.i * 0.03, 0.42 + w.i * 0.03);
        w.p.set({ x: x + inK * (950 - x), y: lerp(730 + (w.i % 2) * 10, 664, inK), s: lerp(1, 0.84, inK), o: 1 - es(t, 0.4 + w.i * 0.02, 0.46 + w.i * 0.02), walk: (k > 0 && k < 1) || (inK > 0 && inK < 1) ? x * 0.05 : undefined, armF: 12, blink: blinkAt(time, w.i) });
      });
      drop.shift(0, -es(t, 0.48, 0.66, ease.in) * 1450);
      drop.fade(1 - seg(t, 0.62, 0.66));

      /* v38b: the high fever */
      const up = es(t, 4.1, 4.16);
      const hot = es(t, 1.05, 1.3) * (1 - es(t, 3.3, 3.7));
      lying.set({ x: 1082, y: 648 + Math.sin(time * 2.2) * 0.8, s: 0.95, r: -90, o: 1 - up, armF: 10, head: 0 });
      fade(blanket, 1 - up);
      pose(fever, { x: 1010, y: 630, s: (0.7 + hot * 0.4) * (1 + Math.sin(time * 3) * 0.05), o: hot * 0.95 });
      const fly = es(t, 3.3, 3.7);
      waves.forEach((w) => {
        const k = time ? ((time * 0.5 + w.i * 0.23) % 1) : (w.i + 0.5) / 5;
        pose(w.el, { x: w.x + Math.sin(time * 2 + w.i) * 4 + fly * (220 + w.i * 20), y: 630 - k * 40 - fly * (340 - w.i * 20), s: 0.8 + k * 0.5 + es(t, 1.05, 1.3) * 0.2, r: fly * 40, o: hot > 0.01 ? hot * (1 - k) * 0.95 : fly > 0 && fly < 1 ? (1 - fly) * 0.8 : 0 });
      });
      cool.forEach((cl, i) => { const k = bump(t, 3.5 + i * 0.05, 4.1 + i * 0.05); pose(cl, { x: 930 + i * 34, y: 600 - (i % 2) * 40 - seg(t, 3.5, 4.1) * 40, s: k, r: time * 40 + i * 30, o: k }); });

      /* v38c: they beg Him for her */
      const ask = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2));
      kneel.forEach((k) => {
        const inK = es(t, 0.7 + k.i * 0.05, 1.1 + k.i * 0.05);
        const kx = lerp(k.x - 260, k.x, inK);
        k.st.set({ x: kx, y: FEET + (k.i % 2) * 4, s: 1.0, o: 1 - ask, walk: inK > 0 && inK < 1 ? kx * 0.05 : undefined, armF: 14 + es(t, 4.4, 4.7) * 50, armB: es(t, 4.4, 4.7) * (k.i === 1 ? 100 : 30), head: -es(t, 4.4, 4.7) * 6, blink: blinkAt(time, k.i + 1) });
        k.kn.set({ x: k.x, y: FEET + (k.i % 2) * 4, s: 1.0, o: ask, armF: 90, armB: 110, head: -8, blink: blinkAt(time, k.i + 1) });
      });
      const [phx, phy] = headAt(650, FEET, 1.0, false, 46);
      beg(phx, phy, ask, time, { dir: 1, spread: 1.6 });

      /* v39a: He stands over her and rebukes the fever */
      const go = es(t, 3.02, 3.3);
      const back = es(t, 4.4, 4.7);
      const jx = lerp(780, 850, go) - back * 110;
      const bend = es(t, 3.2, 3.4) * (1 - es(t, 3.9, 4.2));
      jesus.set({ x: jx, y: FEET, s: 1.05, flip: t > 1.6 && t < 3.02, walk: (go > 0 && go < 1) || (back > 0 && back < 1) ? jx * 0.045 : undefined, armF: 14 + ask * 30 + bend * 70, armB: 10 + bend * 140, lean: bend * 16, head: bend * 14, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(jx, FEET, 1.05, false);
      jVoice(jhx + 20, jhy + 30, bend, time, { dir: 1, spread: 2.2 });

      /* v39b: she gets up at once and serves them */
      const stand = up;
      const serve = es(t, 4.25, 4.75);
      const sx = lerp(935, 760, serve);
      const offer = es(t, 4.75, 4.95);
      const sArm = 20 + es(t, 4.2, 4.4) * 40 + offer * 25;
      pose(trayEl, { x: 4, y: -2, r: sArm });
      standing.set({ x: sx, y: FEET, s: 0.95, flip: true, o: stand, walk: serve > 0 && serve < 1 ? sx * 0.05 : undefined, armF: sArm, armB: 10, head: -4, blink: blinkAt(time, 3) });

      const inside = es(t, 0.5, 0.9);
      S.cam.z = 1.04 + inside * 0.34 - es(t, 1.9, 2.3) * 0.08 + es(t, 3.0, 3.4) * 0.06 - es(t, 4.2, 4.6) * 0.06;
      S.cam.x = -es(t, 1.9, 2.3) * 20 * (1 - es(t, 3.0, 3.3)) + es(t, 3.0, 3.4) * 30 * (1 - es(t, 4.2, 4.6));
      S.cam.y = 20 + inside * 110;
    };
  },
};
