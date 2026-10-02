// Mt 18,17 — a courtyard under a vine, where the brothers and sisters are gathered: the assembly, sitting in rows.
// The wronged brother comes in and tells them all, his bubble showing the broken jar; they raise their hands and
// turn to the other brother by the gate — the eldest speaks to him. If he will not listen even to the assembly: he
// shakes his head, turns and walks out through the open gate into the street, to stand by a Greek in his pinned
// cloak and a tax collector at his booth. The assembly bows its heads; the gate is left open, the lamp still lit.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, cloud, sun, olive } from '../../assets/nature.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { DAY, BRO_A, BRO_B, folk, group, man, woman, speech, crossX, withFace, faceBits, greek, taxBooth, TAXMEN, smallLamp, kf, headAt, PI } from './lib.js';

const P = 0.45, GY = 700;
const GATE = [1010, 1090];            // the gate opening in the courtyard wall
const WT = 430;                       // wall top

function shardsIcon(c) {
  return sheet().p(c.cut([[-26, 0], [-20, -16], [-8, -20], [-4, -6], [-12, 0]], 0.3, 3) + c.cut([[2, 0], [6, -14], [18, -18], [24, -4], [16, 0]], 0.3, 3), C.pot).out();
}

export default {
  id: 'mt18-church',
  beats: [
    { v: 17, text: 'Jeśli i tych nie usłucha, donieś Kościołowi!' },
    { v: 17, cont: true, text: 'A jeśli nawet Kościoła nie usłucha, niech ci będzie jak poganin i celnik!' },
  ],
  cam: { x: [0, 240], y: [0, 40], z: [1, 1.06] },
  build(S) {
    const c = S.c;
    sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 130, len: 800 });
    const cl = hanging(hangL, cloud(c, 160), { x: 520, y: 150, len: 700 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [14, 6, 2], lens: [1000, 340, 120], color: C.hillFar }).markup);

    /* the courtyard wall with its gate, the vine, the street beyond */
    const wallL = S.layer({ par: 0.4, sh: 4 });
    const w = sheet();
    w.p(c.cut([[-900, 620], [2500, 620], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.stone, 0.35));
    w.p(c.cut([[-900, WT + 6], [GATE[0], WT], [GATE[0], 660], [-900, 660]], 0.8, 12), C.plaster);
    w.p(c.cut([[GATE[1], WT + 4], [2500, WT + 10], [2500, 660], [GATE[1], 660]], 0.8, 12), C.plaster);
    let patch = '';
    for (let i = 0; i < 14; i++) patch += c.cut(c.blob(c.rr(-300, 1900), c.rr(WT + 30, 620), c.rr(20, 50), c.rr(10, 20), 10, 0.2), 0.6, 6);
    w.x(patch, C.plaster2, 'opacity=".6"');
    w.p(c.cut([[-900, WT - 8], [GATE[0] + 8, WT - 10], [GATE[0] + 8, WT + 8], [-900, WT + 8]], 0.5, 12) + c.cut([[GATE[1] - 8, WT - 6], [2500, WT - 2], [2500, WT + 12], [GATE[1] - 8, WT + 12]], 0.5, 12), C.plaster2);
    // gate posts and the open leaf
    w.p(c.cut(c.rect(GATE[0] - 12, WT - 30, 16, 250), 0.4, 6) + c.cut(c.rect(GATE[1] - 4, WT - 30, 16, 250), 0.4, 6), C.wood2);
    w.p(c.cut([[GATE[1] + 12, WT + 20], [GATE[1] + 52, WT + 34], [GATE[1] + 52, 668], [GATE[1] + 12, 662]], 0.4, 6), C.wood);
    // the vine pergola over the gathering
    let posts = '';
    [420, 880].forEach((x) => { posts += c.cut(c.rect(x - 6, WT - 40, 12, 300), 0.4, 6); });
    w.p(posts + c.cut([[360, WT - 52], [940, WT - 56], [940, WT - 40], [360, WT - 38]], 0.4, 10), C.wood2);
    let leaves = '', grapes = '';
    for (let i = 0; i < 34; i++) { const x = c.rr(340, 960), y = WT - 50 + c.rr(-24, 20); leaves += c.cut(c.blob(x, y, c.rr(14, 24), c.rr(10, 16), 9, 0.25), 0.6, 5); }
    for (let i = 0; i < 6; i++) { const x = c.rr(400, 900), y = WT - 20; for (let k = 0; k < 6; k++) grapes += c.cut(c.circ(x + (k % 3 - 1) * 5, y + Math.floor(k / 3) * 6 + (k % 2) * 2, 3.4, 8), 0.1, 2); }
    w.p(leaves, C.leaf).p(grapes, C.plumRobe);
    wallL.add(w.out());
    wallL.add(olive(c, 1400, 624, 0.8));
    const lamp = wallL.add(`<g>${smallLamp(c)}</g>`);
    // phone: the brother, the Greek and the tax collector's booth stand closer, out from under the thread
    const TX = S.portrait ? 1138 : 1188, AX = S.portrait ? 1096 : 1116, GX = S.portrait ? 1030 : 1046;
    const booth = taxBooth(c, 200, 200);
    const outL = S.layer({ par: 0.42, sh: 4 });
    outL.add(`<g transform="translate(${TX} ${GY - 30}) scale(.6)">${booth.back}</g>`);
    const taxman = S.puppet(outL.add(person(c, TAXMEN[0])));
    outL.add(`<g transform="translate(${TX} ${GY - 30}) scale(.6)">${booth.front}</g>`);

    /* the assembly: a still back row, and a front row of puppets */
    const L = S.layer({ par: P, sh: 5 });
    const back = [];
    for (let i = 0; i < 9; i++) back.push({ x: 440 + i * 52 + c.rr(-8, 8), y: c.rr(-4, 4), s: 0.74, flip: true, o: { ...folk(c), pose: 'sit' } });
    L.sprite(`<g>${group(c, back.map((m) => ({ ...m, x: m.x - 650 })))}</g>`, 650, GY - 50);
    const FRONT = [[470, woman(c, { robe: C.roseRobe })], [560, { robe: C.linen2, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.leather }], [650, man(c, { robe: C.ochreRobe })], [740, woman(c, { robe: C.skyVeil })]];
    const front = FRONT.map(([x, o], i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(L.add(withFace(person(c, { ...o, pose: 'sit' }), faceBits(c)))) }));
    front.forEach((f) => { f.sad = f.p.el.querySelector('[data-part="sad"]'); });
    const B = S.puppet(L.add(person(c, BRO_B)));
    const A = S.puppet(L.add(withFace(person(c, BRO_A), faceBits(c))));
    const aAngry = A.el.querySelector('[data-part="angry"]');
    const gentile = S.puppet(L.add(greek(c, 1)));

    const fx = S.layer({ par: P, sh: 4 });
    const tell = fx.add(`<g opacity="0">${speech(c, `<g transform="translate(0 10) scale(.8)">${shardsIcon(c)}</g>`, { w: 60, h: 44, flip: true })}</g>`);
    const elder = fx.add(`<g opacity="0">${speech(c, `<g transform="translate(0 10) scale(.8)">${shardsIcon(c)}</g>`, { w: 60, h: 44 })}</g>`);
    const no = fx.add(`<g opacity="0">${speech(c, crossX(c, 14), { w: 44, h: 38, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1260, 130, T, 1, 0.6);
      swing(cl, 520 + Math.sin(T * 0.1) * 20, 150, T, 1.3, 0.6, 1);
      pose(lamp.querySelector('.fl'), { x: 22, y: -11, sy: 1 + Math.sin(T * 9) * 0.08 });
      pose(lamp, { x: 960, y: 560 });

      /* v17a — he tells the assembly */
      const bin = es(t, 0.0, 0.3);
      const bx = lerp(1000, 830, bin);
      const talk = bump(t, 0.3, 0.95);
      B.set({ x: bx, y: GY + 4, s: 0.92, flip: true, walk: bin > 0 && bin < 1 ? bx * 0.06 : undefined, armF: 20 + talk * 60, armB: talk * 20 + es(t, 1.0, 1.2) * 10, head: es(t, 1.6, 1.9) * 10, blink: blinkAt(T, 3) });
      const [bhx, bhy] = headAt(830, GY + 4, 0.92, true);
      pose(tell, { x: bhx - 18, y: bhy - 16, s: es(t, 0.3, 0.42, ease.back), o: talk > 0.05 ? 1 : 0 });
      const turn = es(t, 0.6, 0.85);
      const grief = es(t, 1.55, 1.85);
      front.forEach((f) => {
        f.p.set({ x: f.x, y: GY + (f.i % 2) * 4, s: 0.84, flip: turn < 0.5 ? true : false, armF: 20 + (f.i === 1 ? bump(t, 0.95, 1.4) * 70 : es(t, 0.55, 0.8) * (f.i % 2 ? 50 : 30) * (1 - grief)), armB: f.i === 1 ? bump(t, 0.95, 1.4) * 30 : 0, head: -turn * 6 + grief * 16, blink: blinkAt(T, f.seed) });
        fade(f.sad, grief);
      });
      const [ehx, ehy] = headAt(560, GY + 4, 0.84, false, 62);
      const ek = bump(t, 1.0, 1.4);
      pose(elder, { x: ehx + 16, y: ehy - 14, s: es(t, 1.0, 1.1, ease.back), o: ek > 0.05 ? 1 : 0 });

      /* v17b — he will not listen: out through the gate, among the Gentile and the tax collector */
      const out = es(t, 1.4, 1.78, (x) => x);
      const ax = lerp(950, AX, out);
      const shake = bump(t, 0.7, 0.95) + bump(t, 1.2, 1.4);
      A.set({ x: ax, y: GY - 2 - out * 8, s: 0.92 - out * 0.04, flip: false, walk: out > 0 && out < 1 ? ax * 0.06 : undefined, head: Math.sin(t * 40) * 6 * shake - es(t, 0.3, 0.6) * 6, armF: 10, armB: 10 + shake * 40, blink: blinkAt(T, 2) });
      fade(aAngry, es(t, 0.3, 0.5));
      const nk = Math.max(bump(t, 0.7, 0.98), bump(t, 1.18, 1.45));
      const [ahx, ahy] = headAt(950, GY - 2, 0.92, false);
      pose(no, { x: ahx + 20, y: ahy - 16, s: nk > 0.05 ? 1 : 0, o: nk > 0.05 ? 1 : 0 });
      gentile.set({ x: GX, y: GY - 16, s: 0.88, flip: false, head: -4 + es(t, 1.7, 1.9) * 6, armF: 10 + es(t, 1.7, 1.9) * 20, blink: blinkAt(T, 7) });
      taxman.set({ x: TX, y: GY - 36, s: 0.84, flip: true, armF: 40 + es(t, 1.7, 1.9) * 20, blink: blinkAt(T, 8) });

      S.cam.x = S.portrait ? kf(t, [[0, 20], [1.0, 20], [1.4, 150], [1.7, 240]]) : kf(t, [[0, 20], [1.0, 20], [1.5, 100], [1.9, 150]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.04], [1.9, 1.04]]);
    };
  },
};
