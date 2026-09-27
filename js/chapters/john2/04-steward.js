// J 2,9–10 — the steward of the feast tastes: his eyes close, sparks and little hearts rise. He wonders
// where it came from — the servants who drew the water know (their thought: the six jars, now red).
// He calls the bridegroom: "Everyone serves the good wine first, and the worse later — but you have kept
// the good wine until now!" — two hanging boards show the usual order, and then the surprise.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { canaSet, canaIdle, LOOK, DISC, SERVANTS, EVENING, AFTERNOON, groomPuppet, bridePuppet, guest, goblet, lowTable, thought, iconBubble, stoneJar, strip, heart, sparkle, voiceRings, miniHead, WINE_A, WATER, loaf, grapes, bowl, hand, tr, PI } from './lib.js';

const FLOOR = 700;
const BACK = 632;

/** a board with two cups and an arrow between them (origin at the string) */
function cupBoard(c, left, right, l1, l2) {
  const s = sheet().p(c.cut(c.rect(-190, 0, 380, 150), 0.5, 8), C.parchment);
  s.x(c.ribbon([[-176, 12], [176, 12]], 1.2) + c.ribbon([[-176, 138], [176, 138]], 1.2), C.terracotta, 'opacity=".35"');
  const lab = (x, t) => `<text x="${x}" y="136" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="20" font-style="italic" fill="${C.inkSoft}">${t}</text>`;
  return `${s.out()}<g transform="translate(-110 108)">${left}</g><g transform="translate(110 108)">${right}</g><path d="M-36 76H30M18 64L34 76L18 88" stroke="${C.terracotta}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${lab(-100, l1)}${lab(100, l2)}`;
}

export default {
  id: 'j2-steward',
  beats: [
    { v: 9, text: 'A gdy starosta weselny skosztował wody, która stała się winem' },
    { v: 9, cont: true, text: '- nie wiedział bowiem, skąd ono pochodzi, ale słudzy, którzy czerpali wodę, wiedzieli -' },
    { v: 9, cont: true, text: 'przywołał pana młodego' },
    { v: 10, text: 'i powiedział do niego: «Każdy człowiek stawia najpierw dobre wino, a gdy się napiją, wówczas gorsze.' },
    { v: 10, cont: true, text: 'Ty zachowałeś dobre wino aż do tej pory».' },
  ],
  cam: { x: [-60, 60], y: [0, 110], z: [1, 1.26] },
  build(S) {
    const c = S.c;
    const set = canaSet(S, { floorY: FLOOR, doorX: 300, lanterns: [340, 500, 660, 940, 1100, 1260] });

    /* Jesus with His disciples at the table at the back; the bride with the guests */
    const backL = S.layer({ par: 0.4, sh: 4 });
    const backSeat = [
      { o: DISC[2], x: 660 }, { o: DISC[0], x: 725 }, { o: CAST.jesus, x: 800, j: true }, { o: DISC[1], x: 875, f: true }, { o: DISC[3], x: 940, f: true },
    ].map((b, i) => ({ ...b, i, seed: c.rr(0, 9) }));
    backSeat.forEach((b) => { b.p = S.puppet(backL.add(person(c, { ...b.o, pose: 'sit' }))); });
    backL.add(`<g transform="translate(800 ${BACK + 16}) scale(.8)">${lowTable(c, 420, 44)}</g><g transform="translate(760 ${BACK - 20}) scale(.8)">${loaf(c, 16)}</g><g transform="translate(850 ${BACK - 20}) scale(.8)">${grapes(c)}</g>`);
    const jGlow = backL.add(`<g><circle r="140" fill="url(#halo-glow)"/></g>`);
    const bride = S.puppet(backL.add(bridePuppet(c)));
    const guests = [[1120, true], [1200, false], [480, false], [410, true]].map(([x, man], i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(backL.add(person(c, guest(c, man)))) }));

    /* the steward, the servants, the bridegroom */
    const L = S.layer({ par: 0.56, sh: 6 });
    const serv = SERVANTS.slice(0, 2).map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, o))) }));
    const steward = S.puppet(L.add(person(c, { ...LOOK.steward })));
    const cup = L.add(`<g>${goblet(c, { r: 1.7 })}</g>`);
    const groom = S.puppet(L.add(groomPuppet(c)));
    const rings = voiceRings(L, c, { n: 3, r: 34, both: false });

    const fxL = S.layer({ par: 0.62, sh: 5 });
    const hearts = Array.from({ length: 5 }, (_, i) => ({ i, el: fxL.add(`<g>${heart(c, 9, i % 2 ? C.roseRobe : C.jesusMantle)}</g>`), dx: (i - 2) * 22, ph: i * 0.19 }));
    const sparks = Array.from({ length: 6 }, (_, i) => ({ i, el: fxL.add(`<g>${sparkle(c, 12)}</g>`), a: (i / 6) * PI * 2 }));
    const qThought = fxL.add(`<g>${thought(c, `<g transform="translate(-14 4) scale(.8)"><text x="0" y="12" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="40" font-style="italic" fill="${C.terracotta}">?</text></g><g transform="translate(14 14) scale(.9)">${goblet(c)}</g>`, { w: 96, h: 72 })}</g>`);
    const jarsIcon = [0, 1, 2, 3, 4, 5].map((i) => `<g transform="translate(${-50 + i * 20} 14) scale(.2)">${stoneJar(c).back}<g transform="translate(0 ${-24})"><path d="M-15 0V-72H15V0Z" fill="${WINE_A}"/></g>${stoneJar(c).front}</g>`).join('');
    const sThought = fxL.add(`<g>${thought(c, jarsIcon + `<g transform="translate(46 -18)">${sparkle(c, 9)}</g>`, { w: 160, h: 76 })}</g>`);

    /* the two boards: the usual order, and the surprise */
    const boardL = S.layer({ par: 0.12, sh: 6 });
    const good = (big = false) => `<g transform="scale(${big ? 2.6 : 2.1})">${goblet(c, { fill: WINE_A })}</g>${big ? `<circle cx="0" cy="-40" r="70" fill="url(#warm-glow)"/><g transform="translate(30 -62)">${sparkle(c, 14)}</g><g transform="translate(-32 -50)">${sparkle(c, 10)}</g>` : `<g transform="translate(24 -48)">${sparkle(c, 10)}</g>`}`;
    const poor = `<g transform="scale(2.1)">${goblet(c, { fill: mix(WINE_A, WATER, 0.55), col: mix(C.sun, C.stone2, 0.6) })}</g>`;
    const board1 = hanging(boardL, cupBoard(c, good(), poor, tr('najpierw dobre', 'good first'), tr('potem gorsze', 'then worse')), { x: 800, y: 150, len: 700 });
    const board2 = hanging(boardL, cupBoard(c, poor, good(true), tr('najpierw…', 'first…'), tr('aż do tej pory!', 'until now!')), { x: 800, y: 150, len: 700 });

    return (t, time) => {
      const T = time;
      set.sk.blend(AFTERNOON, EVENING, 0.75 + es(t, 0, 5) * 0.25);
      canaIdle(set, T, { lit: 1, sunY: 230 + es(t, 0, 5) * 60 });

      /* the back: Jesus quietly at the centre */
      backSeat.forEach((b) => b.p.set({ x: b.x, y: BACK + 14, s: 0.78, flip: !!b.f, armF: b.j ? 30 + es(t, 4.2, 4.6) * 30 : 30, armB: 20, head: b.j ? es(t, 4.2, 4.6) * -4 : 0, blink: blinkAt(T, b.seed) }));
      pose(jGlow, { x: 800, y: BACK - 60, o: 0.3 + bump(t, 4.1, 5.2) * 0.55 });
      bride.set({ x: 1040, y: BACK + 2, s: 0.8, flip: true, armF: 30 + es(t, 2.2, 2.5) * 30, head: es(t, 2.2, 2.5) * 6, blink: blinkAt(T, 3) });
      guests.forEach((g) => g.p.set({ x: g.x, y: BACK + 6, s: 0.8, flip: g.x > 800 ? true : false, armF: 30 + (g.i % 2) * 20, blink: blinkAt(T, g.seed) }));

      /* v9a — the cup is handed over; he tastes */
      const bring = es(t, -0.3, 0.3, ease.out);
      const sx = 620;
      serv.forEach((s) => {
        const x = lerp(260 - s.i * 90, 505 - s.i * 90, bring);
        const knowing = bump(t, 1.1, 2.1);
        s.p.set({ x, y: FLOOR - 4 - s.i * 10, s: 1.04, flip: false, walk: bring > 0.01 && bring < 0.99 ? x * 0.1 : undefined, armF: s.i === 0 ? 70 * (1 - es(t, 0.2, 0.35)) + 20 : 20, armB: 10 + knowing * 40, head: knowing * (s.i ? -10 : 10), lean: knowing * (s.i ? 4 : -4), blink: blinkAt(T, s.seed) });
      });
      const lift = es(t, 0.25, 0.45) * (1 - es(t, 1.0, 1.2)) + es(t, 4.2, 4.45) * 1.1;
      const taste = bump(t, 0.4, 1.05);
      const turnR = es(t, 2.0, 2.15);
      const call = bump(t, 2.1, 2.9);
      const talk = es(t, 3.0, 3.2);
      const armF = 40 + lift * 60 + talk * 20 * (1 - es(t, 4.2, 4.4));
      steward.set({ x: sx, y: FLOOR + 10, s: 1.12, flip: false, armF, armB: 10 + call * 150 + talk * (50 + Math.sin(t * 8) * 10) * (1 - es(t, 4.2, 4.4)), head: -taste * 14 + es(t, 1.05, 1.3) * 8 * (1 - turnR), blink: taste > 0.3 ? 1 : blinkAt(T, 5), lean: -taste * 4 });
      const [hx, hy] = hand(sx, FLOOR + 10, 1.12, false, armF);
      const pass = es(t, 0.2, 0.35);
      const [px, py] = hand(505, FLOOR - 4, 1.04, false, 90);
      pose(cup, { x: lerp(px, hx, pass), y: lerp(py, hy, pass) + 6, r: -taste * 30 + es(t, 4.2, 4.45) * -10, o: 1 });
      hearts.forEach((h) => {
        const k = seg(t, 0.55 + h.ph, 1.25 + h.ph);
        pose(h.el, { x: sx + 20 + h.dx + Math.sin(k * 5 + h.i) * 8, y: FLOOR - 220 - k * 110, s: 0.6 + Math.sin(k * PI) * 0.6, o: Math.sin(k * PI) });
      });
      sparks.forEach((sp) => {
        const k = bump(t, 0.4, 1.2) + bump(t, 4.25, 5);
        pose(sp.el, { x: hx + Math.cos(sp.a + T * 0.8) * 46 * k, y: hy - 30 + Math.sin(sp.a + T * 0.8) * 34 * k, s: k, r: T * 40, o: k });
      });

      /* v9b — he does not know where it came from; the servants know */
      const q = es(t, 1.05, 1.3, ease.back) * (1 - es(t, 1.85, 2.0));
      pose(qThought, { x: sx + 14, y: FLOOR - 215, s: (0.3 + 0.7 * q) * 1.25, o: q });
      const sk = es(t, 1.3, 1.55, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(sThought, { x: 400, y: FLOOR - 205, s: (0.3 + 0.7 * sk) * 1.25, o: sk });

      /* v9c — he calls the bridegroom, who comes over */
      rings(sx + 30, FLOOR - 200, call, T, { dir: 1, spread: 2 });
      const come = es(t, 2.3, 2.95);
      const gx = lerp(1140, 930, come), gy = lerp(BACK + 4, FLOOR + 4, come);
      const wow = es(t, 4.25, 4.5);
      groom.set({ x: gx, y: gy, s: lerp(0.8, 1.1, come), flip: true, walk: come > 0.02 && come < 0.98 ? gx * 0.1 : undefined, armF: 30 + es(t, 3.2, 3.5) * 20 + wow * 60, armB: 20 + wow * 110, head: -es(t, 3.2, 3.5) * 6 + wow * -8, blink: blinkAt(T, 6) });

      /* v10 — the boards */
      const b1 = es(t, 3.1, 3.45, ease.out) * (1 - es(t, 3.95, 4.15));
      const b2 = es(t, 4.1, 4.45, ease.out);
      pose(board1, { x: 800, y: 178 - (1 - b1) * 520, r: Math.sin(T * 0.7) * 1.2 });
      pose(board2, { x: 800, y: 178 - (1 - b2) * 520, r: Math.sin(T * 0.7 + 1) * 1.2 });

      S.cam.x = -40 + es(t, 1.9, 2.8) * 50;
      S.cam.z = 1.24 - es(t, 2.9, 3.3) * 0.1;
      S.cam.y = 100 - es(t, 2.9, 3.3) * 50;
    };
  },
};
