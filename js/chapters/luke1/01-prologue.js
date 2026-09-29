// Łk 1,1–4 — the prologue. The curtains open on Luke's writing room by lamplight. Many have set down the things
// fulfilled among us: round pictures of them come down from the flies, in no order (the star over the manger, the boat,
// the loaves, the cross, the open tomb). The eyewitnesses and servants of the word come in, each handing over a small
// scroll. Luke searches it all from the first and writes it in order: the pictures line up in a row and the lines run
// across his scroll — for the most excellent Theophilus, whose name is hung up. Theophilus comes in and receives the
// scroll: the loose words he was taught settle onto it, and a golden seal of certainty shines.
import { C, CAST, person, blinkAt, pose, lerp, sky, curtains, sheet, shade, mix } from '../kit.js';
import { fish } from '../../assets/things.js';
import {
  LUKE, THEOPHILUS, MARY, MAGD, glowDisc, scrollParts, hang2, sparkle, wordSlip, loaf, hand, lowTable,
  tr, es, ease, bump, seg, PI, FONT,
} from './lib.js';

const FY = 712;                    // the floor
const DX = 860, DY = FY;           // the low desk (floor centre)
const LX = 700;                    // Luke, seated, facing right
const SP_H = 176;

/** a picture plate on a string: origin at the plate centre */
function plate(c, icon, r = 46) {
  const s = sheet().p(c.cut(c.circ(0, 0, r + 6, 30), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, 0, r, 30), 0.4, 4), C.parchment);
  return `<g transform="translate(800 -1500)"><path d="M0 -1800V${-r - 6}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${icon}</g>`;
}
const ICONS = {
  star: (c) => sheet().p(c.cut([[-26, 18], [26, 18], [20, 32], [-20, 32]], 0.3, 3), C.wood).p(c.cut(c.blob(0, 16, 18, 6, 10, 0.1), 0.3, 3), C.wheat).p(c.cut(c.circ(9, 10, 5, 8), 0.2, 2), C.skin).out()
    + `<path d="${c.poly(c.star(0, -16, 16, 6, 5))}" fill="${C.sun}"/><path d="${c.ribbon([[0, -2], [0, 8]], 1.4)}" fill="${C.sun}" opacity=".6"/>`,
  boat: (c) => sheet().p(c.cut([[-30, 8], [30, 8], [22, 22], [-22, 22]], 0.3, 3), C.wood).p(c.ribbon([[-40, 26], [40, 26]], 6), C.lake2).p(c.ribbon([[0, 8], [0, -30]], 2.4), C.wood2).p(c.cut([[2, -28], [22, 2], [2, 4]], 0.3, 3), C.sail).out(),
  bread: (c) => `<g transform="translate(-16 4)">${loaf(c, 14)}</g><g transform="translate(14 -2)">${loaf(c, 13)}</g><g transform="translate(0 18) scale(.7)">${fish(c)}</g>`,
  cross: (c) => sheet().p(c.cut([[-40, 30], [-20, 12], [0, 6], [20, 12], [40, 30]], 0.4, 4), mix(C.sand2, C.dune, 0.4)).p(c.ribbon([[0, 8], [0, -32]], 5) + c.ribbon([[-13, -18], [13, -18]], 5), C.wood2).out(),
  tomb: (c) => sheet().p(c.cut([[-38, 30], [-36, -10], [-20, -26], [20, -28], [36, -12], [38, 30]], 0.4, 4), C.rock2).x(c.poly([[-10, 30], [-10, 2], [0, -8], [10, 2], [10, 30]]), '#fff3cf').p(c.cut(c.circ(24, 16, 14, 14), 0.3, 3), C.rock).out(),
};

export default {
  id: 'lk1-prologue',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3 },
    { v: 4 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ['#6e5a6e', '#b98f86', '#e7c7a3']);

    /* ---------- the room: back wall with a window and shelves of scrolls ---------- */
    const wall = S.layer({ par: 0.08, sh: 3 });
    const wc = mix(C.plaster2, C.clay, 0.2);
    const ws = sheet();
    const WX = 1150, WY = 300;
    ws.p(c.cut([[-1200, -1400], [2800, -1400], [2800, FY + 10], [-1200, FY + 10]], 0.8, 40) + c.hole(c.rect(WX - 70, WY - 90, 140, 180), 0.6, 10), wc);
    ws.p(c.cut([[WX - 82, WY + 90], [WX + 82, WY + 90], [WX + 88, WY + 104], [WX - 88, WY + 104]], 0.4, 6), C.wood2);
    ws.x(c.ribbon([[WX, WY - 90], [WX, WY + 90]], 5) + c.ribbon([[WX - 70, WY - 10], [WX + 70, WY - 10]], 5), C.wood2);
    // shelves of scroll jars
    ws.p(c.cut(c.rect(300, 380, 240, 10), 0.3, 6) + c.cut(c.rect(300, 470, 240, 10), 0.3, 6), C.wood2);
    let jars = '', rolls = '';
    [320, 370, 420, 470, 510].forEach((x, i) => { jars += c.cut([[x - 14, 380], [x - 16, 350], [x - 10, 340], [x + 10, 340], [x + 16, 350], [x + 14, 380]], 0.3, 4); rolls += c.cut(c.rect(x - 8, 322 - (i % 2) * 6, 16, 22), 0.2, 3); });
    [330, 385, 440, 500].forEach((x) => { rolls += c.cut(c.ell(x, 456, 20, 13, 12), 0.3, 3); });
    ws.p(jars, mix(C.stone, C.clay, 0.3)).p(rolls, C.parchment);
    wall.add(ws.out());
    const winL = S.layer({ par: 0.05, sh: 1, flat: true });
    winL.add(`<g transform="translate(${WX} ${WY + 40})">${glowDisc(120, 'warm-glow', 0.5)}</g>`);

    /* ---------- the pictures of what was fulfilled among us ---------- */
    const hangL = S.layer({ par: 0.12, sh: 5 });
    const order = ['star', 'boat', 'bread', 'cross', 'tomb'];
    const scattered = { tomb: [540, 250], star: [985, 165], bread: [680, 150], cross: [1100, 255], boat: [830, 225] };
    const plates = order.map((k, i) => ({ k, i, el: hangL.add(plate(c, ICONS[k](c))), from: scattered[k], to: [560 + i * 120, 200], at: [1.08, 1.28, 1.18, 1.38, 1.48][i] }));
    const orderGlow = S.layer({ par: 0.12, sh: 1, flat: true });
    const thread = orderGlow.add(`<g><path d="${c.ribbon([[540, 200], [1060, 200]], 3)}" fill="${C.haloRim}"/></g>`);

    /* ---------- the witnesses behind the desk ---------- */
    const back = S.layer({ par: 0.26, sh: 5 });
    const small = (x) => `<g transform="translate(18 20) rotate(-80)"><path d="${c.cut(c.rect(-5, -14, 10, 28), 0.2, 3)}" fill="${C.parchment}"/><path d="${c.cut(c.ell(0, -15, 6, 3, 8), 0.2, 2) + c.cut(c.ell(0, 15, 6, 3, 8), 0.2, 2)}" fill="${C.wood2}"/></g>`;
    const W = [
      { o: CAST.peter, x: 490, flip: false, from: -120 },
      { o: MARY, x: 560, flip: false, from: -200 },
      { o: CAST.john, x: 1060, flip: true, from: 1720 },
      { o: MAGD, x: 1130, flip: true, from: 1800 },
    ].map((w, i) => ({ ...w, i, p: S.puppet(back.add(person(c, { ...w.o, holdF: small() }))), e: S.puppet(back.add(person(c, { ...w.o }))) }));
    const given = W.map((w, i) => back.add(`<g>${small()}</g>`));

    /* ---------- the desk, the scroll and the lamp; Luke at his writing ---------- */
    const G = S.layer({ par: 0.3, sh: 1, flat: true });
    const lampGlow = G.add(`<g>${glowDisc(230, 'warm-glow', 0.9)}</g>`);
    const desk = S.layer({ par: 0.3, sh: 5 });
    desk.add(sheet().p(c.cut([[-1200, FY - 4], [2800, FY - 4], [2800, 1900], [-1200, 1900]], 0.6, 30), mix(C.wood3, C.sand2, 0.5)).out());
    desk.add(sheet().p(c.cut([[LX - 90, FY + 4], [LX - 80, FY - 8], [LX + 60, FY - 10], [LX + 70, FY + 4]], 0.5, 6), C.terracotta).out());
    const luke = S.puppet(desk.add(person(c, { ...LUKE, pose: 'sit', holdF: `<g transform="translate(0 4) rotate(20)"><path d="${c.ribbon([[0, -6], [0, 26]], 2)}" fill="${C.wood2}"/></g>` })));
    desk.add(`<g transform="translate(${DX} ${DY})">${lowTable(c, 230)}</g>`);
    const TOP = DY - 44;
    // the open scroll on the desk: two rolls and the sheet between; its lines are uncovered as he writes
    const sheetS = sheet().p(c.cut([[DX - 86, TOP - 4], [DX + 86, TOP - 6], [DX + 86, TOP - 30], [DX - 86, TOP - 28]], 0.4, 6), C.parchment);
    const openScroll = desk.add(`<g>${sheetS.out()}${sheet().p(c.cut(c.ell(DX - 92, TOP - 16, 9, 15, 10), 0.3, 3) + c.cut(c.ell(DX + 92, TOP - 18, 9, 15, 10), 0.3, 3), C.parchment).p(c.cut(c.rect(DX - 95, TOP - 38, 6, 8), 0.2, 2) + c.cut(c.rect(DX + 89, TOP - 40, 6, 8), 0.2, 2), C.wood2).out()}</g>`);
    let lines = '';
    for (let i = 0; i < 3; i++) { let x = DX - 76; while (x < DX + 70) { const l = Math.min(DX + 72 - x, c.rr(10, 26)); lines += c.ribbon([[x, TOP - 24 + i * 7], [x + l, TOP - 24 + i * 7]], 1.6); x += l + 5; } }
    const lineEl = desk.add(`<g><path d="${lines}" fill="${C.ink}" opacity=".55"/></g>`);
    // the pile of the witnesses' scrolls, the inkpot, the lamp
    const pile = desk.add(`<g>${[[-10, 0], [8, -2], [0, -9], [16, 4]].map(([x, y]) => `<g transform="translate(${x} ${y}) rotate(${c.rr(-10, 10).toFixed(0)})"><path d="${c.cut(c.rect(-14, -5, 28, 10), 0.2, 3)}" fill="${C.parchment}"/><path d="${c.cut(c.ell(-15, 0, 3, 6, 8), 0.2, 2) + c.cut(c.ell(15, 0, 3, 6, 8), 0.2, 2)}" fill="${C.wood2}"/></g>`).join('')}</g>`);
    desk.add(`<g transform="translate(${DX + 104} ${TOP})">${sheet().p(c.cut([[-9, 0], [-10, -14], [10, -14], [9, 0]], 0.3, 3), C.soilDark).out()}</g>`);
    const lamp = desk.add(`<g>${sheet().p(c.cut([[-18, 0], [-22, -6], [-12, -12], [8, -12], [18, -9], [26, -12], [29, -9], [20, -2], [10, 1], [-12, 1]], 0.3, 4), C.pot).out()}<path d="M27 -12C22 -18 23 -26 27 -34C31 -26 32 -18 27 -12Z" fill="${C.lampFlame}"/></g>`);

    /* ---------- the great scroll Luke writes, addressed to Theophilus; Theophilus, the rolled scroll and its seal ---------- */
    const fly = S.layer({ par: 0.2, sh: 6 });
    const SP = scrollParts(c, { w: 340, h: 176, title: tr('Dostojny Teofilu', 'Most excellent Theophilus'), lines: 5 });
    const SY = 300;
    const topRod = fly.add(`<g transform="translate(800 -1500)">${hang2(SP.rod, 150, 400)}</g>`);
    const scrSheet = fly.add(`<g transform="translate(800 -1500)">${SP.sheet}</g>`);
    const botRod = fly.add(`<g transform="translate(800 -1500)">${SP.rod}</g>`);
    const P = S.layer({ par: 0.34, sh: 5 });
    const theo = S.puppet(P.add(person(c, { ...THEOPHILUS })));
    const theoR = S.puppet(P.add(person(c, { ...THEOPHILUS })));
    const rolled = P.add(`<g>${sheet().p(c.cut(c.rect(-8, -26, 16, 52), 0.3, 3), C.parchment).p(c.cut(c.ell(0, -28, 10, 4, 10), 0.2, 2) + c.cut(c.ell(0, 28, 10, 4, 10), 0.2, 2), C.wood2).p(c.ribbon([[-9, 0], [9, 0]], 3), C.terracotta).out()}</g>`);
    const seal = P.add(`<g>${glowDisc(46, 'halo-glow', 1)}${sheet().p(c.cut(c.star(0, 0, 15, 12, 12, 0), 0.3, 3), C.terracotta).p(c.cut(c.circ(0, 0, 9, 12), 0.2, 3), shade(C.terracotta, 0.2)).out()}<path d="${c.ribbon([[-5, 0], [-1, 4], [6, -5]], 2.2)}" fill="${C.cream}"/></g>`);
    const slips = [0, 1, 2, 3, 4].map((i) => ({ i, el: P.add(wordSlip(c, 34 + (i % 2) * 8)) }));
    const sparks = [0, 1, 2, 3].map((i) => P.add(`<g>${sparkle(c, 10 + (i % 2) * 4)}</g>`));
    const tGlow = G.add(`<g>${glowDisc(150, 'halo-glow', 1)}</g>`);
    const beams = plates.map((p) => P.add(`<g>${glowDisc(26, 'halo-glow', 1)}${sparkle(c, 12)}</g>`));

    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);
      const flick = time ? 1 + Math.sin(time * 6.1) * 0.04 : 1;
      pose(lamp, { x: DX + 60, y: TOP });
      pose(lampGlow, { x: DX + 80, y: TOP - 30, s: flick });

      /* v1: many accounts — the pictures come down, in no order */
      /* v3: … and they line up in order */
      const ord = es(t, 3.05, 3.45);
      plates.forEach((p) => {
        const k = es(t, p.at, p.at + 0.3, ease.out);
        const [fx, fy] = p.from, [tx, ty] = p.to;
        const x = lerp(fx, tx, ord), y = lerp(fy, ty, ord);
        pose(p.el, { x, y: lerp(-1500, y, k), r: Math.sin((time || 0) * 0.7 + p.i * 1.4) * 1.2 * (1 - ord) * k, s: lerp(1, 0.9, ord), o: k > 0.002 ? 1 : 0 });
      });
      pose(thread, { x: 0, y: 0, sx: 1, o: es(t, 3.35, 3.55) });

      /* v2: the eyewitnesses and servants of the word hand over what they saw */
      W.forEach((w) => {
        const a = 2.02 + w.i * 0.08;
        const inK = es(t, a, a + 0.3);
        const gv = seg(t, a + 0.34, a + 0.62);
        const out = es(t, 3.0, 3.3);
        const x = lerp(w.from, w.x, inK) + (w.flip ? 1 : -1) * out * 420;
        const walking = (inK > 0 && inK < 1) || (out > 0 && out < 1);
        const flip = out > 0.02 ? !w.flip : w.flip;
        const held = gv < 0.01;
        const common = { x, y: FY - 16, s: 0.86, flip, walk: walking ? t * 26 + w.i : undefined, armF: 20 + bump(t, a + 0.3, a + 0.7) * 50, armB: 6, blink: blinkAt(time, w.i) };
        w.p.set({ ...common, o: held ? 1 : 0 });
        w.e.set({ ...common, o: held ? 0 : 1 });
        const [hx, hy] = hand(x, FY - 16, 0.86, flip, 20 + bump(t, a + 0.3, a + 0.7) * 50);
        const land = [DX - 30 + w.i * 14, TOP - 10];
        const e = ease.io(gv);
        pose(given[w.i], { x: lerp(hx, land[0], e), y: lerp(hy, land[1], e) - Math.sin(e * PI) * 60, r: e * 90, o: gv > 0 && gv < 1 ? 1 : 0 });
      });
      pose(pile, { x: DX - 20, y: TOP - 10, s: 0.4 + es(t, 2.3, 2.9) * 0.6, o: es(t, 2.3, 2.4) * (1 - es(t, 3.5, 3.7)) });

      /* v3: Luke searches it all and writes it in order, for Theophilus */
      const write = seg(t, 3.25, 3.85);
      const wr = t > 3.2 && t < 3.9 ? Math.sin(t * 60) * 8 : 0;
      luke.set({ x: LX, y: FY - 4, s: 1, flip: false, armF: 40 + (t > 3.1 ? 20 : bump(t, 1.2, 1.9) * 10) + wr, armB: 10, head: t > 4.1 ? -6 : t > 3.1 ? 12 : -8 + bump(t, 2.1, 2.9) * 10, blink: blinkAt(time, 2) });
      // the great scroll comes down and unrolls as he writes; in v4 it rolls up again
      const down = es(t, 3.02, 3.3, ease.out);
      const unroll = ease.io(write) * (1 - es(t, 4.0, 4.14));
      const rolledUp = t > 4.14;
      const sw = Math.sin((time || 0) * 0.7) * 0.8;
      const sy = lerp(-1500, SY, down) - es(t, 4.14, 4.4, ease.in) * 1900;
      pose(topRod, { x: 800, y: sy, r: sw, o: down > 0.002 ? 1 : 0 });
      pose(scrSheet, { x: 800, y: SY + 9, sy: Math.max(0.001, unroll), o: unroll > 0.01 ? 1 : 0 });
      pose(botRod, { x: 800, y: SY + 18 + unroll * SP_H, o: down > 0.002 && !rolledUp ? 1 : 0 });

      /* v4: Theophilus receives it; what he was taught settles on it; the seal of certainty shines */
      const come = es(t, 4.0, 4.3);
      const rec = es(t, 4.3, 4.34);
      const TX = lerp(1500, 1070, come);
      theo.set({ x: TX, y: FY - 6, s: 1, flip: true, walk: come > 0 && come < 1 ? t * 26 : undefined, o: 1 - rec, armF: 10, armB: 6, blink: blinkAt(time, 3) });
      theoR.set({ x: TX, y: FY - 6, s: 1, flip: true, o: rec, armF: 70, armB: 20, head: 8, blink: blinkAt(time, 3) });
      const [rx, ry] = hand(TX, FY - 6, 1, true, 70);
      const mv = es(t, 4.14, 4.36);
      pose(rolled, { x: lerp(800, rx, mv), y: lerp(SY + 12, ry - 6, mv), r: 90 - mv * 80, o: rolledUp ? 1 : 0 });
      slips.forEach((s) => {
        const set = es(t, 4.42 + s.i * 0.04, 4.62 + s.i * 0.04);
        const a = s.i * 1.3 + (time || 0) * 0.5;
        const fx = TX - 20 + Math.cos(a) * 70, fy = FY - 250 + Math.sin(a * 1.2) * 30;
        pose(s.el, { x: lerp(fx, rx, set), y: lerp(fy, ry - 6, set), r: (1 - set) * Math.sin(a) * 30, s: 1 - set * 0.6, o: es(t, 4.3, 4.42) * (1 - es(t, 4.6 + s.i * 0.04, 4.64 + s.i * 0.04)) });
      });
      beams.forEach((b, i) => {
        const kk = seg(t, 4.42 + i * 0.05, 4.7 + i * 0.05), e = ease.io(kk);
        const [px, py] = plates[i].to;
        pose(b, { x: lerp(px, rx, e), y: lerp(py + 40, ry - 10, e) - Math.sin(e * PI) * 40, r: t * 80, s: 1 - e * 0.4, o: kk > 0 && kk < 1 ? 1 : 0 });
      });
      pose(tGlow, { x: TX - 20, y: FY - 130, s: 0.6 + es(t, 4.5, 4.8) * 0.5, o: es(t, 4.5, 4.8) * 0.9 });
      const sk2 = es(t, 4.6, 4.8, ease.back);
      pose(seal, { x: rx - 16, y: ry - 34, s: Math.max(0.001, sk2), o: sk2 > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => { const kk = seg(t, 4.6 + i * 0.05, 5.0 + i * 0.05); pose(sp, { x: rx - 16 + Math.cos(i * 1.7) * (30 + kk * 40), y: ry - 34 + Math.sin(i * 1.7) * (20 + kk * 30), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 4.6 + i * 0.05, 5.0 + i * 0.05) }); });

      S.cam.z = 1.04 + es(t, 2.9, 3.4) * 0.04 - es(t, 3.9, 4.3) * 0.04;
      S.cam.y = 10;
      S.cam.x = es(t, 3.9, 4.3) * 20;
    };
  },
};
