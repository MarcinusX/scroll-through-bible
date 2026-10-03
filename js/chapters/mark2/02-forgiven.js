// Mk 2,5–12 — inside the house: "Son, your sins are forgiven." The scribes' dark thoughts,
// the balance "which is easier?", and the man who gets up, rolls his mat and walks out.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { sun, cloud, hang } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, hand, headAt, townsfolk, scribe, pallet, blanket, rolledMat, thought, speech, spark, heart, scrap, GLYPH } from './lib.js';

const PI = Math.PI;
const FLOOR = 640, CEIL = 300, ROOFTOP = 262;
const HOLE0 = 690, HOLE1 = 910;
const MAT = { x: 780, y: 700, s: 1.2 };   // the mat's top surface on the floor
const JX = 836;                           // where Jesus stands

export default {
  id: 'm2-forgiven',
  beats: [
    { v: 5, text: 'Jezus, widząc ich wiarę,' },
    { v: 5, cont: true, text: 'rzekł do paralityka: «Synu, odpuszczają ci się twoje grzechy».' },
    { v: 6 },
    { v: 7, text: '«Czemu On tak mówi? On bluźni.' },
    { v: 7, cont: true, text: 'Któż może odpuszczać grzechy, oprócz jednego Boga?»' },
    { v: 8, text: 'Jezus poznał zaraz w swym duchu, że tak myślą,' },
    { v: 8, cont: true, text: 'i rzekł do nich: «Czemu nurtują te myśli w waszych sercach?' },
    { v: 9, text: 'Cóż jest łatwiej: powiedzieć do paralityka: Odpuszczają ci się twoje grzechy,' },
    { v: 9, cont: true, text: 'czy też powiedzieć: Wstań, weź swoje łoże i chodź?' },
    { v: 10 },
    { v: 11 },
    { v: 12, text: 'On wstał, wziął zaraz swoje łoże i wyszedł na oczach wszystkich.' },
    { v: 12, cont: true, text: 'Zdumieli się wszyscy i wielbili Boga mówiąc: «Jeszcze nigdy nie widzieliśmy czegoś podobnego».' },
  ],
  cam: { x: [-240, 110], y: [-60, 40], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ['#c9dfdc', '#e9e6cf', '#f5ead4']);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1210, y: 120, len: 600 });
    const cl = hanging(hangL, cloud(c, 170), { x: 430, y: 120, len: 600 });

    /* ---------- the room ---------- */
    const room = S.layer({ par: 0.3, sh: 3 });
    const wall = sheet();
    const win = [[520, 420], [520, 360], ...c.arc(560, 360, 40, 36, PI, 2 * PI, 10), [600, 420]];
    const door = [[1190, FLOOR + 4], [1190, 470], ...c.arc(1245, 470, 55, 52, PI, 2 * PI, 12), [1300, FLOOR + 4]];
    wall.p(c.cut([[-900, CEIL - 10], [2500, CEIL - 10], [2500, FLOOR + 6], [-900, FLOOR + 6]], 1, 30) + c.hole(win, 0.5, 6) + c.hole(door, 0.5, 6), mix(C.plaster, C.plaster2, 0.35));
    let blotch = '';
    for (let i = 0; i < 16; i++) blotch += c.cut(c.blob(c.rr(-200, 1800), c.rr(CEIL + 40, FLOOR - 70), c.rr(26, 70), c.rr(12, 26), 10, 0.2), 0.8, 6);
    wall.x(blotch, C.plaster2, 'opacity=".55"');
    wall.p(c.cut([[-900, FLOOR - 50], [2500, FLOOR - 50], [2500, FLOOR + 6], [-900, FLOOR + 6]], 0.8, 14) + c.hole(door.map(([x, y]) => [x, Math.max(y, FLOOR - 50)]), 0.3, 6), shade(C.plaster2, -0.04));
    wall.p(c.ribbon([[514, 422], [606, 422]], 8) + c.ribbon([[560, 324], [560, 420]], 5), C.wood2);
    wall.p(c.ribbon([[1186, FLOOR + 4], [1186, 468]], 9) + c.ribbon([[1304, FLOOR + 4], [1304, 468]], 9) + c.ribbon(c.arc(1245, 470, 60, 57, PI, 2 * PI, 12), 9), C.wood2);
    // shelf with jars, a niche with a lamp, herbs
    wall.p(c.cut(c.rect(930, 420, 150, 8), 0.3, 6), C.wood2);
    wall.p(c.cut([[946, 420], [940, 396], [952, 380], [964, 396], [958, 420]], 0.4, 4) + c.cut(c.arc(1002, 420, 18, 16, PI, 2 * PI, 8), 0.4, 4) + c.cut([[1040, 420], [1036, 390], [1054, 382], [1062, 420]], 0.4, 4), C.pot);
    wall.p(c.cut([[300, 470], [300, 430], ...c.arc(330, 430, 30, 26, PI, 2 * PI, 8), [360, 470]], 0.4, 5), shade(C.plaster2, -0.16));
    wall.p(c.cut([[312, 470], [316, 460], [336, 460], [346, 465], [342, 470]], 0.2, 3), C.pot);
    wall.x(`M344 460C340 455 340 450 344 442C348 450 348 455 344 460Z`, C.lampFlame);
    wall.p(c.ribbon([[680, CEIL], [682, 330]], 2.4) + c.ribbon([[700, CEIL], [698, 338]], 2.4), C.moss);
    wall.p(c.cut(c.blob(682, 336, 12, 20, 8, 0.2), 0.4, 4) + c.cut(c.blob(698, 346, 11, 18, 8, 0.2), 0.4, 4), C.olive);
    room.add(wall.out());
    const floor = sheet();
    floor.p(c.cut([[-900, FLOOR], [2500, FLOOR], [2500, 1700], [-900, 1700]], 1, 30), mix(C.clay, C.sand2, 0.55));
    let lines = '';
    for (let i = 0; i < 6; i++) { const y = FLOOR + 14 + i * i * 10 + i * 12; lines += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.5); }
    floor.x(lines, shade(C.sand2, -0.2), 'opacity=".45"');
    room.add(floor.out());

    /* ---------- ceiling with the hole, the friends peering down ---------- */
    const ceil = S.layer({ par: 0.36, sh: 5 });
    const slab = (x0, x1) => {
      const s = sheet();
      s.p(c.cut([[x0, ROOFTOP + 2], [x1, ROOFTOP + 2], [x1, CEIL + 4], [x0, CEIL + 4]], 0.8, 10), C.wood3);
      s.p(c.cut([[x0 - 2, ROOFTOP], [x1 + 2, ROOFTOP], [x1 + 2, ROOFTOP + 14], [x0 - 2, ROOFTOP + 14]], 1.2, 7), mix(C.clay, C.sand2, 0.4));
      let reeds = '';
      for (let x = x0 + 4; x < x1 - 4; x += 7) reeds += c.ribbon([[x, ROOFTOP + 15], [x + 2, ROOFTOP + 24]], 2);
      s.x(reeds, C.wheat2, 'opacity=".8"');
      let beams = '';
      for (let x = x0 + 20; x < x1 - 10; x += 70) beams += c.cut(c.rect(x, CEIL - 6, 16, 30), 0.3, 5);
      s.p(beams, C.wood2);
      // ragged broken edge at the hole
      return s.out();
    };
    const FR = [
      { x: HOLE0 - 58, flip: false, o: townsfolk(c, { man: true, robe: C.tealRobe, mantle: null, belt: C.leather }) },
      { x: HOLE0 - 6, flip: false, o: townsfolk(c, { man: true, robe: C.clayMantle, mantle: null, hairStyle: 'curly' }) },
      { x: HOLE1 + 6, flip: true, o: townsfolk(c, { man: true, robe: C.ochreRobe, mantle: C.sageRobe }) },
      { x: HOLE1 + 58, flip: true, o: townsfolk(c, { man: true, robe: C.roseRobe, mantle: null, belt: C.leather, hairStyle: 'wrap', veil: C.linen2 }) },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 9), p: S.puppet(ceil.add(person(c, { ...f.o, pose: 'kneel' }))) }));
    ceil.add(slab(-900, HOLE0) + slab(HOLE1, 2500));
    // bits of broken roof piled at the edges of the hole
    ceil.add(sheet().p(c.cut(c.blob(HOLE0 - 100, ROOFTOP - 6, 26, 10, 9, 0.3), 0.8, 5) + c.cut(c.blob(HOLE1 + 110, ROOFTOP - 5, 22, 9, 9, 0.3), 0.8, 5) + c.cut(c.blob(HOLE1 + 132, ROOFTOP - 12, 14, 8, 8, 0.3), 0.8, 5), mix(C.clay, C.sand2, 0.4)).out());
    const hearts = FR.map((f) => ceil.add(`<g>${heart(c, 11)}</g>`));
    const ropes = FR.map((f) => ceil.add(`<path d="${c.ribbon([[0, 0], [1, 60], [0, 120]], 2.2)}" fill="${C.rope}"/>`));

    /* ---------- light from the hole ---------- */
    const lightL = S.layer({ par: 0.4, sh: 1, flat: true });
    const shaft = lightL.add(`<path d="M${HOLE0 + 12} ${CEIL}L${HOLE1 - 12} ${CEIL}L${HOLE1 + 70} ${FLOOR + 80}L${HOLE0 - 60} ${FLOOR + 80}Z" fill="#fff3cf" opacity=".32"/>`);
    const beam = lightL.add(`<g opacity="0"><path d="M${JX - 40} ${-400}L${JX + 40} ${-400}L${JX + 110} ${FLOOR}L${JX - 110} ${FLOOR}Z" fill="#fff1c4" opacity=".55"/><circle cx="${JX}" cy="460" r="200" fill="url(#halo-glow)"/></g>`);

    /* ---------- people along the back wall ---------- */
    const backP = S.layer({ par: 0.45, sh: 4 });
    const BACK = [[606, 0.8], [668, 0.82], [966, 0.82], [1030, 0.8], [1100, 0.78], [540, 0.78]].map(([x, s], i) => ({ x, s, y: FLOOR - 26, i, flip: x > JX, seed: c.rr(0, 9), p: S.puppet(backP.add(person(c, townsfolk(c)))) }));

    /* ---------- scribes on a bench, Jesus, the crowd on the right ---------- */
    const mid = S.layer({ par: 0.55, sh: 5 });
    const bench = sheet();
    bench.p(c.cut(c.rect(330, FLOOR - 22, 300, 10), 0.4, 8), C.wood);
    bench.p(c.cut(c.rect(346, FLOOR - 12, 10, 34), 0.3, 5) + c.cut(c.rect(600, FLOOR - 12, 10, 34), 0.3, 5), C.wood2);
    mid.add(bench.out());
    const SCR = [390, 480, 570].map((x, i) => {
      const p = S.puppet(mid.add(scribe(c, i, { pose: 'sit' })));
      const [hx, hy] = headAt(x, FLOOR - 20, 0.95, false, 62);
      return { x, y: FLOOR - 20, s: 0.95, i, p, hx, hy, seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(mid.add(person(c, { ...CAST.jesus })));
    const RIGHT = [[1010, 668, 0.95], [1090, 664, 0.93], [1170, 670, 0.96], [1236, 664, 0.92]].map(([x, y, s], i) => ({ x, y, s, i, seed: c.rr(0, 9), p: S.puppet(mid.add(person(c, townsfolk(c)))) }));

    /* ---------- the man on his mat ---------- */
    const matL = S.layer({ par: 0.6, sh: 6 });
    const matEl = matL.add(`<g transform="translate(${MAT.x} ${MAT.y}) scale(${MAT.s})">${pallet(c)}</g>`);
    const MAN = { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3 };
    const lying = S.puppet(matL.add(person(c, MAN)));
    const blanketEl = matL.add(`<g transform="translate(${MAT.x} ${MAT.y}) scale(${MAT.s})">${blanket(c)}</g>`);
    const sins = Array.from({ length: 9 }, (_, i) => {
      const u = i / 8;
      return { i, x: MAT.x + lerp(-60, 90, u) * MAT.s + c.rr(-8, 8), y: MAT.y - c.rr(30, 58) * MAT.s, r: c.rr(0, 360), el: matL.add(`<g>${scrap(c, c.rr(10, 15))}</g>`), sp: matL.add(`<g>${spark(c, 9)}</g>`), drift: c.rr(-60, 60) };
    });
    // two people in the way, who step aside
    const PATH = [[1060, 708, 0.98], [1170, 712, 1.0]].map(([x, y, s], i) => ({ x, y, s, i, seed: c.rr(0, 9), p: S.puppet(matL.add(person(c, townsfolk(c)))) }));
    // the man standing up, the rolled mat on his shoulder
    const standing = S.puppet(matL.add(person(c, MAN)));
    const kneeling = S.puppet(matL.add(person(c, { ...MAN, pose: 'kneel' })));
    const roll = matL.add(`<g>${rolledMat(c, 130)}</g>`);
    // sparks falling in the light from heaven
    const fall = Array.from({ length: 7 }, (_, i) => ({ i, el: matL.add(`<g>${spark(c, c.rr(7, 11))}</g>`), x: JX + c.rr(-70, 70), ph: c.rr(0, 1) }));

    /* ---------- thoughts, the balance, sparks of joy ---------- */
    const fx = S.layer({ par: 0.6, sh: 5 });
    SCR.forEach((m) => {
      m.bub = fx.add(`<g>${thought(c, `<g data-g="frown">${GLYPH.frown(c)}</g><g data-g="storm" opacity="0">${GLYPH.storm(c)}</g><g data-g="star" opacity="0">${GLYPH.star(c)}</g>`)}<g data-g="glow" opacity="0"><circle cx="16" cy="-58" r="46" fill="url(#halo-glow)"/></g></g>`);
      m.g = {};
      ['frown', 'storm', 'star', 'glow'].forEach((k) => { m.g[k] = m.bub.querySelector(`[data-g="${k}"]`); });
      m.dark = fx.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 10, 8, 9, 0.3), 0.6, 3), C.storm2).x(c.ribbon(c.arc(0, 0, 13, 10, 0, PI * 1.6, 10), 1.6), C.storm).out()}</g>`);
    });
    const rays = SCR.map(() => fx.add(`<path d="${c.ribbon([[0, 0], [0, -100]], 3)}" fill="#fff1c4" opacity=".8"/>`));
    const jSpeech = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 46, h: 44, flip: true })}</g>`);
    // the balance "which is easier?"
    const BAL = { x: 800, y: 350, L: 118 };
    const balBeam = fx.add(`<g>${hang(sheet().p(c.cut([[-BAL.L - 6, -4], [BAL.L + 6, -4], [BAL.L + 6, 4], [-BAL.L - 6, 4]], 0.4, 8), C.ochre).p(c.cut(c.circ(0, 0, 10, 12), 0.3, 3), shade(C.ochre, -0.2)).p(c.cut(c.star(0, -18, 12, 6, 6), 0.3, 3), C.sun).out(), 800)}</g>`);
    const pan = (icon) => {
      const s = sheet();
      s.x(c.ribbon([[0, 0], [-34, 64]], 1.1) + c.ribbon([[0, 0], [34, 64]], 1.1), C.ink, 'opacity=".55"');
      s.p(c.cut([[-40, 64], [40, 64], ...c.arc(0, 64, 40, 20, 0, PI, 10)], 0.4, 5), C.ochre);
      s.p(c.cut(c.ell(0, 64, 40, 5, 16), 0.2, 4), shade(C.ochre, -0.2));
      return `${s.out()}<g data-g="icon" opacity="0">${icon}</g>`;
    };
    const iconWords = `<g transform="translate(-12 54) scale(.8)">${speech(c, spark(c, 10), { w: 48, h: 40 })}</g>`;
    let feet = '';
    for (let i = 0; i < 4; i++) feet += c.cut(c.ell(-22 + i * 13, 58 - (i % 2) * 6, 5, 3, 8, 0.2), 0.2, 3);
    const iconWalk = `<g transform="translate(0 34) scale(.52)">${rolledMat(c, 100)}</g><path d="${feet}" fill="${C.sandal}"/>`;
    const panL = fx.add(`<g>${pan(iconWords)}</g>`), panR = fx.add(`<g>${pan(iconWalk)}</g>`);
    const iconL = panL.querySelector('[data-g="icon"]'), iconR = panR.querySelector('[data-g="icon"]');
    const qMark = fx.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 22, 18), 0.4, 4), C.cream).out()}<g transform="translate(0 -1)">${GLYPH.q(c)}</g></g>`);
    // amazement
    const JOY = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(`<g>${i % 3 === 0 ? speech(c, GLYPH.bang(c), { w: 36, h: 36, flip: i % 2 === 0 }) : spark(c, c.rr(9, 14))}</g>`), x: lerp(380, 1240, i / 9) + c.rr(-20, 20), y: c.rr(380, 470), seed: c.rr(0, 6) }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1210, 120, T, 1, 0.6);
      swing(cl, 430 + Math.sin(T * 0.1) * 20, 120, T, 1.2, 0.7, 1);

      /* the friends above: faith, then joy */
      const cheer = es(t, 12.05, 12.35);
      FR.forEach((f, i) => {
        const [hx, hy] = headAt(f.x, ROOFTOP + 2, 0.6, f.flip, 46);
        f.p.set({ x: f.x, y: ROOFTOP + 2, s: 0.6, flip: f.flip, head: 26 * (1 - cheer) - cheer * 8, lean: (f.flip ? -1 : 1) * 10 * (1 - cheer), armF: 40 * (1 - cheer) + cheer * (130 + Math.sin(T * 6 + i) * 12), armB: 20 + cheer * 150, blink: blinkAt(T, f.seed) });
        const h = es(t, 0.1 + i * 0.07, 0.45 + i * 0.07, ease.back) * (1 - es(t, 1.6, 2.0));
        pose(hearts[i], { x: hx + (f.flip ? -6 : 6), y: hy - 40 - h * 16 + Math.sin(T * 2 + i) * 3, s: h, o: h > 0.01 ? 1 : 0 });
        // ropes still hang from their hands down into the room
        const [rx, ry] = hand(f.x, ROOFTOP + 2, 0.6, f.flip, 40 * (1 - cheer), (f.flip ? -1 : 1) * 10 * (1 - cheer), 46);
        pose(ropes[i], { x: rx, y: ry, sy: 1 - es(t, 0.5, 1.2) * 0.6, o: 1 - cheer });
      });

      /* Jesus */
      const lookUp = es(t, 0.05, 0.3) * (1 - es(t, 0.95, 1.2));
      const toMan = es(t, 1.0, 1.3) * (1 - es(t, 4.9, 5.2)) + es(t, 9.3, 9.6);
      const toScribes = es(t, 5.0, 5.3) * (1 - es(t, 9.3, 9.6));
      const speak = es(t, 6.0, 6.25) * (1 - es(t, 6.9, 7.1));
      const heaven = es(t, 9.0, 9.3) * (1 - es(t, 10.0, 10.3));
      const command = es(t, 10.02, 10.3) * (1 - es(t, 11.6, 12));
      const praise = es(t, 12.05, 12.4);
      jesus.set({
        x: JX, y: FLOOR + 22, s: 1.08, flip: toScribes > 0.5 || toMan > 0.5,
        armF: 12 + lookUp * 20 + toMan * (1 - command) * 50 + toScribes * (30 + speak * 50) + heaven * 30 + command * 90 + praise * 60,
        armB: 8 + lookUp * 10 + heaven * 150 + praise * 110 + bump(t, 7.05, 8.9) * 50,
        head: -lookUp * 22 + toMan * 14 * (1 - command) - heaven * 10 + command * 6 - praise * 8, lean: toMan * 5 * (1 - command),
        blink: blinkAt(T),
      });
      fade(beam, heaven * 0.9 + command * 0.45 + praise * 0.4);
      fade(shaft, 0.24 + es(t, 0.1, 0.5) * 0.12 - heaven * 0.16);

      /* the man on the mat: sins lifted off; then he rises, rolls up the mat and walks out */
      const rise = es(t, 11.02, 11.08);        // lying → kneeling (quick swap)
      const stand = es(t, 11.2, 11.26);        // kneeling → standing
      const rolled = es(t, 11.26, 11.4);
      const walkK = [[11.42, MAT.x - 40], [11.95, 1480]];
      const mx = kf(t, walkK, (u) => u);
      const twitch = es(t, 10.3, 10.6);
      lying.set({ x: MAT.x + 61 * MAT.s, y: MAT.y - 28.8 * MAT.s, s: 0.72 * MAT.s, r: -90, o: 1 - rise, armF: twitch * 40 + Math.sin(T * 3) * 4 * twitch, armB: twitch * 20, head: -bump(t, 1.2, 1.9) * 10 - twitch * 14, blink: blinkAt(T, 4) });
      kneeling.set({ x: MAT.x - 30, y: MAT.y - 4, s: 0.9, o: rise * (1 - stand), armF: 60, armB: 40, head: -10, blink: blinkAt(T, 4) });
      const walking = t > 11.42 && t < 11.95;
      standing.set({ x: mx, y: MAT.y + 14, s: 1.0, o: stand * (1 - es(t, 11.93, 11.98)), walk: walking ? mx * 0.05 : undefined, armB: 150 * rolled, armF: 30 + praise * 0, head: -4, blink: blinkAt(T, 4) });
      pose(matEl, { x: MAT.x, y: MAT.y, s: MAT.s, o: 1 - rolled });
      pose(blanketEl, { x: MAT.x, y: MAT.y, s: MAT.s, o: 1 - rise });
      const [shx, shy] = [mx - 8, MAT.y + 14 - 150];
      pose(roll, { x: lerp(MAT.x, shx, es(t, 11.26, 11.42)), y: lerp(MAT.y - 10, shy, es(t, 11.26, 11.42)) + (walking ? -Math.abs(Math.cos(mx * 0.05)) * 3 : 0), r: -12 * es(t, 11.26, 11.42), s: lerp(1.1, 0.8, rolled), o: rolled * (1 - es(t, 11.93, 11.98)) });
      sins.forEach((sn) => {
        const t0 = 1.2 + sn.i * 0.045;
        const lift = es(t, t0, t0 + 0.4);
        const x = sn.x + sn.drift * lift, y = lerp(sn.y, CEIL + 40, lift) + Math.sin(lift * PI) * -30;
        const gold = seg(t, t0 + 0.22, t0 + 0.42);
        pose(sn.el, { x, y, r: sn.r + lift * 200, s: 1 - gold * 0.6, o: 1 - gold });
        pose(sn.sp, { x, y, s: gold * (1 - seg(t, t0 + 0.5, t0 + 0.75)) * 1.1, r: T * 40, o: gold > 0.01 ? 1 : 0 });
      });

      fall.forEach((f) => {
        const k = (T * 0.35 + f.ph) % 1;
        const on = Math.max(heaven, command * 0.6);
        pose(f.el, { x: f.x + Math.sin(T + f.i) * 8, y: lerp(CEIL - 40, 600, k), s: 0.8, o: on * Math.sin(k * PI) });
      });

      /* the people along the back */
      const amazed = praise;
      BACK.forEach((m) => {
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, head: -bump(t, 1.2, 2) * 10 + amazed * -10, armF: amazed * (m.i % 2 ? 150 : 60), armB: amazed * (m.i % 2 ? 40 : 160), blink: blinkAt(T, m.seed) });
      });
      RIGHT.forEach((m) => {
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, head: -amazed * 10 + bump(t, 11.4, 11.95) * 6, armF: amazed * (m.i % 2 ? 140 : 80), armB: amazed * (m.i % 2 ? 60 : 150), blink: blinkAt(T, m.seed) });
      });
      PATH.forEach((m) => {
        const pass = 11.42 + ((m.x - (MAT.x - 40)) / (1480 - (MAT.x - 40))) * 0.53;
        const aside = es(t, pass - 0.12, pass - 0.02) * (1 - es(t, pass + 0.1, pass + 0.25));
        m.p.set({ x: m.x + aside * (m.i ? 40 : -30), y: m.y - aside * 40, s: m.s * (1 - aside * 0.08), flip: true, head: -amazed * 10, armF: aside * 40 + amazed * (m.i ? 150 : 90), armB: amazed * 140, blink: blinkAt(T, m.seed) });
      });

      /* scribes: sitting, thinking, found out */
      const think = es(t, 2.1, 2.45);
      const known = es(t, 5.1, 5.4);
      const sink = es(t, 6.15, 6.6);
      SCR.forEach((m, i) => {
        const whisper = bump(t, 3.1 + i * 0.05, 3.9);
        const point = i === 1 ? bump(t, 4.05, 4.95) : 0;
        const startle = bump(t, 6.1, 6.9) + es(t, 12.1, 12.4) * 0.8;
        m.p.set({
          x: m.x, y: m.y, s: m.s, flip: i === 2 ? whisper > 0.5 : false,
          armF: 55 * think * (1 - startle) + whisper * 20 + point * 20 + startle * 70, armB: 50 * think * (1 - startle) + point * 150 + startle * 90,
          head: -4 + whisper * 10 * (i === 1 ? -1 : 1) - point * 16 - startle * 10, lean: whisper * (i === 2 ? -6 : 6) - startle * 6,
          blink: blinkAt(T, m.seed),
        });
        const b = es(t, 2.2 + i * 0.1, 2.5 + i * 0.1, ease.back) * (1 - sink);
        const bx = m.hx + 8, by = m.hy - 26 + Math.sin(T * 1.6 + m.seed) * 3;
        pose(m.bub, { x: lerp(bx, m.hx + 6, sink), y: lerp(by, m.hy + 70, sink), s: b * 1.05 * (1 + bump(t, 5.2, 5.9) * 0.08 * Math.sin(T * 20)), o: b > 0.01 ? 1 : 0 });
        fade(m.g.frown, 1 - es(t, 3.05, 3.2));
        fade(m.g.storm, es(t, 3.05, 3.2) * (1 - es(t, 4.05, 4.2)));
        fade(m.g.star, es(t, 4.05, 4.2));
        fade(m.g.glow, known);
        // the thought sinks down into the heart
        const d = es(t, 6.35, 6.7) * (1 - es(t, 8.9, 9.3));
        pose(m.dark, { x: m.x + 8, y: m.y - 62 + Math.sin(T * 2 + i) * 1.5, s: d * 0.9, r: T * 30, o: d > 0.01 ? 0.9 : 0 });
        // Jesus' insight reaches every thought
        const [jhx, jhy] = headAt(JX, FLOOR + 22, 1.08, true);
        const tx = bx + 16, ty = by - 58, dx = tx - jhx, dy = ty - jhy;
        const ray = es(t, 5.15 + i * 0.06, 5.45 + i * 0.06) * (1 - es(t, 6.05, 6.3));
        pose(rays[i], { x: jhx, y: jhy, r: (Math.atan2(dx, -dy) * 180) / PI, sy: (Math.hypot(dx, dy) / 100) * ray, o: ray * 0.8 });
      });
      pose(jSpeech, { x: JX - 40, y: 440, s: es(t, 6.05, 6.25, ease.back) * (1 - es(t, 6.85, 7.0)), o: t > 6 && t < 7 ? 1 : 0 });

      /* the balance comes down: which is easier? */
      const bIn = es(t, 6.9, 7.25, ease.out) * (1 - es(t, 9.0, 9.35));
      const tilt = es(t, 7.35, 7.6) * 9 - es(t, 8.3, 8.6) * 9 + (t > 8.6 && t < 9.2 ? Math.sin(T * 1.8) * 4 * es(t, 8.6, 8.8) : 0);
      const by0 = lerp(-260, BAL.y, bIn);
      const th = (tilt * PI) / 180;
      pose(balBeam, { x: BAL.x, y: by0, r: tilt, o: bIn > 0.01 ? 1 : 0 });
      const lx = BAL.x - Math.cos(th) * BAL.L, ly = by0 - Math.sin(th) * BAL.L, rx = BAL.x + Math.cos(th) * BAL.L, ry = by0 + Math.sin(th) * BAL.L;
      pose(panL, { x: lx, y: ly, r: Math.sin(T * 1.3) * 1.5, o: bIn > 0.01 ? 1 : 0 });
      pose(panR, { x: rx, y: ry, r: Math.sin(T * 1.3 + 1) * 1.5, o: bIn > 0.01 ? 1 : 0 });
      const iL = es(t, 7.15, 7.4, ease.back), iR = es(t, 8.05, 8.3, ease.back);
      pose(iconL, { y: (1 - iL) * -80, o: iL });
      pose(iconR, { y: (1 - iR) * -80, o: iR });
      const q = es(t, 8.4, 8.6, ease.back) * (1 - es(t, 9.0, 9.2));
      pose(qMark, { x: BAL.x, y: by0 + 62, s: q, r: Math.sin(T * 2) * 6, o: q > 0.01 ? 1 : 0 });

      /* amazement */
      JOY.forEach((j) => {
        const k = es(t, 12.1 + j.i * 0.04, 12.35 + j.i * 0.04, ease.back);
        pose(j.el, { x: j.x, y: j.y - k * 30 + Math.sin(T * 1.7 + j.seed) * 4, s: k, r: Math.sin(T + j.seed) * 8, o: k > 0.01 ? 1 : 0 });
      });

      /* camera */
      // phone: further left while the scribes on their bench (x 330–630) are the subject
      const SL = S.portrait ? -230 : -120, SM = S.portrait ? -200 : -60;
      S.cam.x = kf(t, [[1.6, 0], [2.1, SL], [4.9, SL], [5.3, SM], [6.9, SM], [7.2, 0], [11.3, 0], [11.7, 90], [12.05, 90], [12.4, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.6, 1.08], [1.6, 1.1], [2.1, 1.12], [4.9, 1.12], [5.3, 1.04], [6.9, 1.04], [7.2, 1.0], [9.0, 1.0], [9.4, 1.06], [11.3, 1.06], [11.7, 1.04], [12.05, 1.04], [12.4, 0.98]]);
      S.cam.y = kf(t, [[-0.5, 0], [0.6, -30], [1.1, 10], [2.1, 20], [4.9, 20], [6.9, 10], [7.2, -40], [9.0, -40], [9.4, 10], [12.05, 10], [12.4, -20]]);
    };
  },
};
