// J 19,1–3 — the curtains open on the praetorium courtyard: a great linen screen lit from behind, Pilate,
// Jesus between two soldiers. Pilate gives the order and turns away; a dark red cloth is lowered over the
// screen and only the shadow of a column appears on it — nothing more is shown. The cloth is raised: the
// soldiers are shadows on the screen now; one of them twists thorns into a ring, and a crown of thorns comes
// down onto Jesus' head, then a purple cloak on its strings. "Hail, King of the Jews!" — the shadows salute,
// and for a moment the thorns catch a thread of gold: He is the King. They strike (only shadows swinging on
// the screen); Jesus stands upright and still, in full colour.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix, curtains } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, headAt, addToHead, soldier, soldierSil, pilate, thornWreath, purpleCloak, PURPLE, taunt, column, hanging, voiceRings, tr, INK, J19, PI } from './lib.js';

const JX = 800, JY = 690, JS = 1.04;
const SX0 = 540, SX1 = 1060, SY0 = 160, SY1 = 552, FL = 538;

export default {
  id: 'j19-crown',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'A żołnierze uplótłszy koronę z cierni, włożyli Mu ją na głowę' },
    { v: 2, cont: true, text: 'i okryli Go płaszczem purpurowym.' },
    { v: 3, text: 'Potem podchodzili do Niego i mówili: «Witaj, Królu Żydowski!»' },
    { v: 3, cont: true, text: 'I policzkowali Go.' },
  ],
  cam: { x: [-40, 40], y: [-30, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;
    const sk = sky(S, J19.court);

    /* ---------- the courtyard wall with the screen ---------- */
    const wallL = S.layer({ par: 0.25, sh: 4 });
    const W = sheet();
    W.p(c.cut([[-900, 96], [2500, 96], [2500, 610], [-900, 610]], 0.6, 20) + c.hole(c.rect(SX0 - 6, SY0 - 6, SX1 - SX0 + 12, SY1 - SY0 + 12), 0.3, 8), mix(C.stone, C.plaster2, 0.4));
    let blocks = '';
    for (let y = 120; y < 600; y += 40) for (let x = -900 + ((y / 40) % 2) * 50; x < 2500; x += 100) if (x + 96 < SX0 - 10 || x > SX1 + 10 || y + 36 < SY0 - 10 || y > SY1 + 10) blocks += c.cut(c.rect(x + 3, y + 3, 92, 34), 0.4, 8);
    W.x(blocks, shade(C.stone, 0.12), 'opacity=".5"');
    W.p(c.cut([[-900, 82], [2500, 82], [2500, 110], [-900, 110]], 0.5, 12), C.stone2);
    wallL.add(W.out());
    const gid = S.id('scr');
    S.defs(`<radialGradient id="${gid}" cx="50%" cy="58%" r="70%"><stop offset="0" stop-color="#fbe8bd"/><stop offset=".7" stop-color="#f1d29b"/><stop offset="1" stop-color="#d9a970"/></radialGradient>`);
    const scrL = S.layer({ par: 0.25, sh: 2, flat: true });
    scrL.add(`<rect x="${SX0}" y="${SY0}" width="${SX1 - SX0}" height="${SY1 - SY0}" fill="url(#${gid})"/><path class="grain" d="M${SX0} ${SY0}H${SX1}V${SY1}H${SX0}Z"/>`);
    const cid = S.id('clip');
    S.defs(`<clipPath id="${cid}" clipPathUnits="userSpaceOnUse"><rect x="${SX0}" y="${SY0}" width="${SX1 - SX0}" height="${SY1 - SY0}"/></clipPath>`);
    const shL = S.layer({ par: 0.25, sh: 1, flat: true });
    const clipAdd = (inner) => shL.add(`<g clip-path="url(#${cid})"><g>${inner}</g></g>`).firstElementChild;
    // the soldiers as shadows
    const XS = [612, 694, 906, 988];
    const sh = XS.map((x, i) => { const g = clipAdd(soldierSil(c, i, { spear: i === 0 || i === 3 })); return { x, i, g, p: S.puppet(g.querySelector('.fig')), flip: x > JX }; });
    // thorns twisted into a ring, as a shadow
    let th = c.ribbon(c.arc(0, 0, 24, 24, 0, PI * 2, 30), 3.6) + c.ribbon(c.arc(0, 1.5, 21, 22, 0.4, PI * 2 + 0.4, 30), 2.4);
    for (let i = 0; i < 16; i++) { const a = (i / 16) * PI * 2; th += c.poly([[Math.cos(a) * 22, Math.sin(a) * 22], [Math.cos(a + 0.09) * 34, Math.sin(a + 0.09) * 34], [Math.cos(a + 0.18) * 22, Math.sin(a + 0.18) * 22]]); }
    const ringSh = clipAdd(`<path d="${th}" fill="${INK}"/>`);
    const strands = clipAdd(`<path d="${c.ribbon(c.qbez([-40, 0], [0, -30], [40, 0], 12), 3)}" fill="${INK}"/><path d="${c.ribbon(c.qbez([-36, 6], [0, 30], [36, 6], 12), 2.4)}" fill="${INK}"/>`);
    // the lowered cloth and the column's shadow on it (only this is shown of the scourging)
    const cloth = clipAdd(sheet().p(c.cut([[SX0 - 10, -420], [SX1 + 10, -420], [SX1 + 10, 0], ...Array.from({ length: 11 }, (_, i) => [SX1 - i * ((SX1 - SX0) / 10), i % 2 ? 10 : 0]), [SX0 - 10, 0]], 0.6, 10), mix(C.curtain, C.lampGlow, 0.25)).x(Array.from({ length: 9 }, (_, i) => c.ribbon([[SX0 + 30 + i * 56, -410], [SX0 + 34 + i * 56, -6]], 7)).join(''), shade(C.curtain, -0.12), 'opacity=".5"').out() + `<circle cx="800" cy="-200" r="260" fill="url(#warm-glow)" opacity=".55"/>`);
    const colSh = clipAdd(`<g>${column(c, 800, FL + 4, 330, 52, '#3a1c24')}<path d="${c.ribbon(c.qbez([786, 330], [772, 380], [792, 420], 10), 2.4) + c.ribbon(c.arc(800, 330, 16, 6, 0, PI * 2, 14), 2.4)}" fill="#3a1c24"/></g>`);
    const dimScr = shL.add(`<rect x="${SX0}" y="${SY0}" width="${SX1 - SX0}" height="${SY1 - SY0}" fill="#2a1f2c" opacity="0"/>`);
    // posts and columns framing the screen
    const frameL = S.layer({ par: 0.27, sh: 5 });
    frameL.add(sheet().p(c.cut(c.rect(SX0 - 16, SY0 - 18, SX1 - SX0 + 32, 16), 0.4, 8) + c.cut(c.rect(SX0 - 16, SY0 - 18, 14, SY1 - SY0 + 36), 0.4, 8) + c.cut(c.rect(SX1 + 2, SY0 - 18, 14, SY1 - SY0 + 36), 0.4, 8), C.wood2).out());
    frameL.add(column(c, 420, 610, 500, 50, C.stone) + column(c, 1180, 610, 500, 50, C.stone) + column(c, 240, 610, 500, 50, C.stone) + column(c, 1360, 610, 500, 50, C.stone));
    const floorL = S.layer({ par: 0.35, sh: 2 });
    const F = sheet().p(c.cut([[-900, 606], [2500, 606], [2500, 1700], [-900, 1700]], 0.5, 20), mix(C.stone, C.sand, 0.35));
    let lines = '';
    [650, 710, 790, 890].forEach((y) => { lines += c.ribbon([[-900, y], [2500, y]], 1.2); });
    F.x(lines, shade(C.stone2, -0.12), 'opacity=".45"');
    floorL.add(F.out());

    /* ---------- the people ---------- */
    const P = S.layer({ par: 0.55, sh: 5 });
    const shine = P.add(`<g><circle r="170" fill="url(#halo-glow)"/></g>`);
    const pil = S.puppet(P.add(pilate(c)));
    const solA = S.puppet(P.add(soldier(c, 0)));
    const solB = S.puppet(P.add(soldier(c, 1)));
    const wr = thornWreath(c);
    const glint = `<g class="glint" opacity="0"><path d="${c.ribbon(c.arc(0, -13, 22, 7, PI * 0.95, PI * 2.05, 20), 2.4)}" fill="${C.sun}"/></g>`;
    const jOwn = S.puppet(P.add(person(c, CAST.jesus)));
    const jOwnQ = S.puppet(P.add(person(c, { ...CAST.jesus, eyes: 'closed' })));
    const crE = P.add(addToHead(person(c, CAST.jesus), wr + glint));
    const purE = P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE }), wr + glint));
    const purQE = P.add(addToHead(person(c, { ...CAST.jesus, mantle: PURPLE, eyes: 'closed' }), wr + glint));
    const jCr = S.puppet(crE), jPur = S.puppet(purE), jPurQ = S.puppet(purQE);
    const glints = [crE, purE, purQE].map((e) => e.querySelector('.glint'));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const cloak = hanging(fx, purpleCloak(c), { x: JX, y: -600, len: 900 });
    const crownF = fx.add(`<g>${wr}</g>`);
    const hail = fx.add(`<g>${taunt(c, tr('Witaj, Królu Żydowski!', 'Hail, King of the Jews!'), { size: 20, side: 1 })}</g>`);
    const rings = voiceRings(fx, c, { n: 3, color: '#6b5a66', r: 16, w: 3, both: false });
    const fg = S.layer({ par: 0.95, sh: 7 });
    fg.add(column(c, -80, 1100, 1300, 90, shade(C.stone, -0.04)) + column(c, 1680, 1100, 1300, 90, shade(C.stone, -0.04)));
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* v1 — Pilate orders it and turns away; a cloth is lowered, and on it only the shadow of a column */
      const order = bump(t, 1.05, 1.6);
      const pK = [[1.45, [560, JY + 2]], [2.0, [300, JY + 2]]];
      const [px, py] = kf(t, pK);
      pil.set({ x: px, y: py, s: 1, flip: t > 1.45, walk: moving(t, pK) ? px * 0.05 : undefined, armF: 20 + order * 70, armB: 8 + order * 20, head: -order * 4, blink: blinkAt(T, 2), o: 1 - es(t, 1.85, 2.0) });
      const lower = es(t, 1.15, 1.55) * (1 - es(t, 2.02, 2.35));
      pose(cloth, { x: 0, y: SY0 + lower * (SY1 - SY0 + 10) - 10 });
      const colK = es(t, 1.45, 1.75) * (1 - es(t, 1.98, 2.15));
      fade(colSh, colK * 0.8);
      const dimK = es(t, 1.2, 1.6) * (1 - es(t, 2.0, 2.3));
      scrL.fade(1 - dimK * 0.35);
      sk.blend(J19.court, J19.still, dimK * 0.5 + es(t, 4.9, 5.6) * 0.2);

      /* the shadow soldiers: in (v2a), weaving, saluting (v3a), striking (v3b) */
      const salute = es(t, 4.05, 4.3) * (1 - es(t, 4.85, 5.05));
      sh.forEach((m) => {
        const inK = es(t, 2.05 + m.i * 0.07, 2.35 + m.i * 0.07);
        const x = lerp(m.x < JX ? SX0 - 70 : SX1 + 70, m.x, inK);
        const weave = m.i === 1 ? bump(t, 2.3, 2.75) : 0;
        const strike = bump(t, 5.08 + (m.i % 2) * 0.18 + (m.i > 1 ? 0.08 : 0), 5.5 + (m.i % 2) * 0.18 + (m.i > 1 ? 0.08 : 0));
        m.p.set({ x, y: FL, s: 0.95, flip: m.flip, walk: inK > 0 && inK < 1 ? x * 0.08 : undefined, armF: 30 + weave * 80 + salute * 60 + strike * 100, armB: 10 + salute * 140 + weave * 60, head: -salute * 6 + strike * 4, lean: strike * 6, o: inK > 0.01 ? 1 : 0 });
      });
      // thorns twisted into a ring on the screen
      const tw = es(t, 2.3, 2.62);
      pose(strands, { x: 760, y: 360, r: tw * 90, s: 1 - tw * 0.4, o: bump(t, 2.25, 2.6) });
      pose(ringSh, { x: 760, y: 360, s: tw, r: tw * 40, o: tw > 0.05 ? 1 - es(t, 2.62, 2.8) : 0 });

      /* v2a — the crown of thorns comes down onto His head */
      const [hx, hy] = headAt(JX, JY, JS, false);
      const lay = es(t, 2.55, 2.88);
      const crowned = es(t, 2.87, 2.93);
      pose(crownF, { x: hx, y: lerp(hy - 360, hy - 13 * JS, lay), s: JS, o: lay > 0.01 && crowned < 1 ? 1 : 0 });
      /* v2b — the purple cloak on its strings */
      const cl = es(t, 3.05, 3.6);
      const purple = es(t, 3.58, 3.64);
      pose(cloak, { x: JX - 4, y: lerp(hy - 560, hy + 18, cl), r: Math.sin(T * 0.9) * 1.4 * (1 - cl), o: cl > 0.001 && purple < 1 ? 1 : 0 });

      /* Jesus: upright and still in the middle, whatever happens around Him */
      const quiet = es(t, 1.3, 1.4) * (1 - es(t, 2.0, 2.1)) + es(t, 5.1, 5.18);
      const bow = es(t, 1.3, 1.7) * (1 - es(t, 2.0, 2.4)) * 8 + bump(t, 5.1, 5.9) * 8 + es(t, 5.6, 5.95) * 4;
      const common = { x: JX, y: JY, s: JS, armF: 8 + Math.sin(T * 0.7) * 1.5, armB: 4, head: 2 + bow, blink: blinkAt(T) };
      const q = Math.min(1, quiet);
      jOwn.set({ ...common, o: (1 - crowned) * (1 - q) });
      jOwnQ.set({ ...common, o: (1 - crowned) * q });
      jCr.set({ ...common, o: crowned * (1 - purple) });
      jPur.set({ ...common, o: purple * (1 - q) });
      jPurQ.set({ ...common, o: purple * q });
      const g = es(t, 4.3, 4.6) * (1 - es(t, 5.6, 5.95) * 0.5);
      glints.forEach((e) => fade(e, g));
      pose(shine, { x: JX + 4, y: JY - 150, s: 0.75 + g * 0.35 + dimK * 0.2, o: 0.3 + dimK * 0.4 + g * 0.4 });

      /* soldiers in colour at His sides (phone: both inside the screen) */
      solA.set({ x: ph ? 985 : 1040, y: JY + 4, s: 1, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 3) });
      solB.set({ x: ph ? 1075 : 1170, y: JY + 6, s: 1, flip: true, armF: 34, armB: 8, blink: blinkAt(T, 4) });

      /* v3a — "Hail, King of the Jews!" */
      const hk = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.9, 5.05));
      pose(hail, { x: 610, y: 300, s: hk, o: hk > 0.02 ? 1 : 0, r: -3 });
      rings(700, 380, bump(t, 5.1, 5.9) * 0.8, T, { dir: 1, spread: 1.6 });
      dimScr && fade(dimScr, dimK * 0.3);

      S.cam.x = -es(t, 1.0, 1.4) * 30 * (1 - es(t, 2.0, 2.4));
      S.cam.y = 10 - es(t, 2.2, 2.6) * 30 + es(t, 3.0, 3.6) * 30;
      S.cam.z = 1.02 + es(t, 1.1, 1.6) * 0.06 * (1 - es(t, 2.0, 2.4)) + es(t, 4.1, 4.6) * 0.05 + es(t, 5.1, 5.9) * 0.04;
    };
  },
};
