// J 21,24–25 — The end of the Gospel. Night, a small room, an oil lamp: the beloved disciple, grown old, sits at his
// desk. "This is the disciple who testifies to these things": little plates of what he saw hang round him — the jars
// of Cana, the loaves, the lamb, the empty tomb, the net full of fish. "And he wrote them": the plates drift down into
// his page, and the lines of writing appear one by one (this very book of paper). "We know that his testimony is true":
// the brothers look in at the door and a seal is pressed on the scroll. "There are many other things that Jesus did":
// the walls melt away into a sky full of little lights, each a deed. "If they were written one by one, the world could
// not hold the books": books and scrolls rise in stacks everywhere, row behind row to the horizon, round the whole
// world hung in the middle — and the theatre curtains close.
import { curtains } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { band, stars, cloud } from '../../assets/nature.js';
import { waterJar } from '../mark14/lib.js';
import { tombIcon } from '../mark16/lib.js';
import {
  JOHN_OLD, CAST, LAMPLIT, writingDesk, writtenSheet, reedPen, oilLamp, seal, hungPlate, hungGold, silverFish, flatLoaf, fullNet, ewe, lightHeart, lightDrop,
  bookStack, scrollLying, openBook, BOOK_COLS, globe, sparkle, rayBurst, crowdPerson, sky, hanging,
  skyKeys, kf, headAt, hand, vis, pose, fade, attr, person, sheet, shade, mix, C, lerp, blinkAt, tr, FONT, PI,
} from './lib.js';

const GOLDEN = ['#e7cfa4', '#f3dcb0', '#f9ebcc'];
const DESK = { x: 880, y: 720 }, JN = { x: 760, y: 724 };
const FLOOR = 724;

export default {
  id: 'j21-books',
  beats: [
    { v: 24, text: 'Ten właśnie uczeń daje świadectwo o tych sprawach' },
    { v: 24, cont: true, text: 'i on je opisał.' },
    { v: 24, cont: true, text: 'A wiemy, że świadectwo jego jest prawdziwe.' },
    { v: 25, text: 'Jest ponadto wiele innych rzeczy, których Jezus dokonał,' },
    { v: 25, cont: true, text: 'a które, gdyby je szczegółowo opisać, to sądzę, że cały świat nie pomieściłby ksiąg, które by trzeba napisać.' },
  ],
  cam: { x: [-40, 60], y: [-140, 160], z: [0.92, 1.3] },
  build(S) {
    const c = S.c;
    /* outside (revealed when the walls melt): a golden sky, far hills, stars that turn into lights */
    const sk = sky(S, LAMPLIT);
    const gold = sky(S, GOLDEN, { name: 'gold' });
    const starL = S.layer({ par: 0.03, sh: 1, flat: true });
    starL.add(stars(c, { x0: -900, x1: 2500, y0: -700, y1: 520, n: 160 }));
    const hillsL = S.layer({ par: 0.12, sh: 2 });
    hillsL.add(band(c, { y: 556, amps: [14, 6, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup + band(c, { y: 640, amps: [8, 4, 2], lens: [900, 300, 120], color: mix(C.hillNear, C.sand, 0.4) }).markup);
    const globeL = S.layer({ par: 0.15, sh: 4 });
    const onWorld = [[-40, -70, 5, -14], [8, -80, 7, 4], [52, -58, 4, 18], [-70, -30, 3, -40], [74, -18, 3, 44]].map(([x, y, n, r]) => `<g class="ow" transform="translate(${x} ${y}) rotate(${r})"><g class="owk">${bookStack(c, n, { w: 46 })}</g></g>`).join('');
    const world = hanging(globeL, `<circle r="170" fill="url(#halo-glow)"/>${globe(c, 78)}${onWorld}`, { x: 0, y: 0, len: 1600 });
    const owk = Array.from(world.querySelectorAll('.owk'));

    /* rows of books, from the horizon to the front */
    const rows = [
      { par: 0.14, y: 566, n: 56, s: 0.36, x0: -800, x1: 2400, h: [4, 12] },
      { par: 0.22, y: 610, n: 40, s: 0.52, x0: -700, x1: 2300, h: [4, 12] },
      { par: 0.32, y: 664, n: 28, s: 0.72, x0: -500, x1: 2100, h: [5, 14] },
      { par: 0.42, y: 730, n: 18, s: 0.95, x0: -400, x1: 2000, h: [6, 16], gap: [600, 1060] },
      { par: 0.7, y: 900, n: 10, s: 1.5, x0: -300, x1: 1900, h: [8, 18], gap: [520, 1080] },
    ];
    const stacks = [];
    rows.forEach((r, ri) => {
      const L = S.layer({ par: r.par, sh: 3 });
      const ground = sheet().p(c.cut([[r.x0 - 800, r.y + 4], [r.x1 + 800, r.y + 4], [r.x1 + 800, r.y + 40], [r.x0 - 800, r.y + 40]], 0.6, 20), mix(C.sand, C.hillNear, 0.25 + ri * 0.1)).out();
      void ground;
      for (let i = 0; i < r.n; i++) {
        const x = lerp(r.x0, r.x1, (i + c.rr(0.2, 0.8)) / r.n);
        if (r.gap && x > r.gap[0] && x < r.gap[1]) continue;
        const kind = c.rr(0, 1);
        const m = kind < 0.72 ? bookStack(c, c.ri(r.h[0], r.h[1]), { w: c.rr(56, 80) }) : kind < 0.88 ? `${scrollLying(c, 70)}<g transform="translate(4 -14)">${scrollLying(c, 64, mix(C.parchment, C.linen, 0.4))}</g><g transform="translate(-2 -28)">${scrollLying(c, 58)}</g>` : `${bookStack(c, 3, { w: 76 })}<g transform="translate(0 -44)">${openBook(c, 70, c.pick(BOOK_COLS))}</g>`;
        const el = L.add(`<g>${m}</g>`);
        stacks.push({ el, x, y: r.y + c.rr(-4, 6), s: r.s * c.rr(0.85, 1.15), ri, d: Math.abs(x - 800) / 1500 + c.rr(0, 0.25) });
      }
      r.L = L;
    });

    /* the room: back wall with a window, the floor — it melts away */
    const room = S.layer({ par: 0.45, sh: 4 });
    const wall = sheet();
    const WIN = { x: 520, y: 330, w: 150, h: 170 };
    wall.p(c.cut([[-1600, -1400], [3200, -1400], [3200, FLOOR - 4], [-1600, FLOOR - 4]], 0.4, 40) + c.hole(c.rect(WIN.x, WIN.y, WIN.w, WIN.h), 0.5, 8), mix(mix(C.plaster2, C.clay, 0.25), C.night, 0.5));
    wall.p(c.cut(c.rect(1150, 470, 160, FLOOR - 470), 0.4, 8), mix(C.lampGlow, C.dusk, 0.35));
    wall.x(c.ribbon([[1144, FLOOR], [1144, 464], [1316, 464], [1316, FLOOR]], 8), mix(C.wood2, C.night, 0.3));
    wall.x(c.ribbon([[WIN.x - 6, WIN.y + WIN.h + 6], [WIN.x + WIN.w + 6, WIN.y + WIN.h + 6]], 8), mix(C.wood2, C.night, 0.3));
    room.add(wall.out());
    room.add(sheet().p(c.cut([[-1600, FLOOR - 6], [3200, FLOOR - 6], [3200, 1800], [-1600, 1800]], 0.5, 30), mix(C.wood3, C.night, 0.45)).out());
    const shelf = room.add(`<g transform="translate(1110 480)">${sheet().p(c.cut(c.rect(-90, 0, 180, 8), 0.3, 6), mix(C.wood2, C.night, 0.3)).out()}<g transform="translate(-50 0) scale(.6)">${scrollLying(c, 70)}</g><g transform="translate(20 0) scale(.6)">${bookStack(c, 3, { w: 60 })}</g></g>`);
    void shelf;
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const lampGlow = glowL.add(`<circle r="420" fill="url(#warm-glow)"/>`);

    /* the brothers at the door (the "we") */
    const doorL = S.layer({ par: 0.5, sh: 4 });
    const bros = [0, 1, 2].map((i) => ({ i, p: S.puppet(doorL.add(person(c, { ...crowdPerson(c), robe: mix(C.stone2, C.night, 0.3) }))), seed: c.rr(0, 9) }));

    /* John at his desk */
    const DL = S.layer({ par: 0.55, sh: 5 });
    const john = S.puppet(DL.add(person(c, { ...JOHN_OLD, pose: 'sit', holdF: reedPen(c) })));
    DL.add(`<g transform="translate(${DESK.x} ${DESK.y})">${writingDesk(c, 210)}</g>`);
    const page = DL.add(`<g transform="translate(${DESK.x - 66} ${DESK.y - 60}) rotate(-3)">${writtenSheet(c, 112, 40, 5)}</g>`);
    const lines = Array.from(page.querySelectorAll('.ln'));
    const lamp = DL.add(`<g transform="translate(${DESK.x + 80} ${DESK.y - 70}) scale(.7)">${oilLamp(c, { r: 0 })}</g>`);
    const flame = lamp.querySelector('.flame');
    const sealEl = DL.add(`<g>${seal(c, 14)}</g>`);

    /* "these things": plates of the Gospel round him */
    const hangL = S.layer({ par: 0.5, sh: 4 });
    const lambM = `<g transform="translate(-4 16) scale(.62)">${ewe(c, { lamb: true })}</g>`;
    const THINGS = [
      `<g transform="translate(-10 4) scale(.8)">${waterJar(c)}</g><g transform="translate(14 8) scale(.6)">${waterJar(c, C.clay)}</g>`,
      `<g transform="translate(-10 4)">${flatLoaf(c, 14)}</g><g transform="translate(10 -6)">${flatLoaf(c, 12)}</g><g transform="translate(4 14) scale(.5)">${silverFish(c, 1)}</g>`,
      lambM,
      `<g transform="translate(0 8) scale(.8)">${tombIcon(c, { open: true })}</g>`,
      `<g transform="translate(-30 -10) scale(.2)">${fullNet(c, { w: 300, h: 110, n: 14 })}</g>`,
    ];
    const SPOTS = [[560, 430], [660, 360], [790, 330], [920, 360], [1020, 430]];
    const plates = THINGS.map((icon, i) => ({ i, el: hangL.add(hungPlate(c, icon, { r: 42, face: mix(C.cream, C.dawn, 0.3) })) }));
    const trueW = hangL.add(hungGold(c, tr('świadectwo prawdziwe', 'his witness is true'), { size: 26 }));

    /* many other things: little lights, each a deed */
    const fxL = S.layer({ par: 0.3, sh: 2 });
    const ICONS = [
      (cc) => lightHeart(cc, 10), (cc) => sparkle(cc, 12), (cc) => lightDrop(cc, 8),
      (cc) => `<g transform="scale(.5)">${silverFish(cc, 2)}</g>`, (cc) => `<g transform="scale(.7)">${flatLoaf(cc, 12)}</g>`,
    ];
    const deeds = Array.from({ length: 40 }, (_, i) => ({ i, x: c.rr(-200, 1800), y: c.rr(-160, 500), a: c.rr(0, 1), el: fxL.add(`<g><circle r="34" fill="url(#halo-glow)"/><g transform="scale(1.5)">${ICONS[i % ICONS.length](c)}</g></g>`) }));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      /* the walls melt at v25a; the sky turns gold at v25b */
      const melt = es(t, 3.05, 3.45);
      room.fade(1 - melt);
      glowL.fade(1 - melt * 0.7);
      gold.layer.fade(es(t, 3.9, 4.4));
      starL.fade(0.9 * (1 - es(t, 4.0, 4.4) * 0.8));
      hillsL.fade(melt);
      const lit = es(t, 0.02, 0.2);
      pose(lampGlow, { x: DESK.x + 100, y: DESK.y - 110, s: 1 + (T ? Math.sin(T * 3) * 0.02 : 0), o: 0.55 * lit });
      if (flame) pose(flame, { x: 35, y: -16, sy: 1 + (T ? Math.sin(T * 7) * 0.08 : 0) });

      /* John writes */
      const writing = es(t, 1.05, 1.2) * (1 - es(t, 2.9, 3.0) * 0.5);
      const pen = T ? Math.sin(T * 5) * 6 * writing : 0;
      const look = es(t, 0.1, 0.3) * (1 - es(t, 1.0, 1.1));
      john.set({ x: JN.x, y: JN.y, s: 0.95, flip: false, armF: 70 + writing * 10 + pen - look * 20, armB: 30 + look * 60, head: 6 * writing - look * 14 + es(t, 2.1, 2.3) * -6 * (1 - es(t, 2.8, 3)), lean: writing * 6, blink: blinkAt(T, 4) });
      lines.forEach((el, i) => fade(el, es(t, 1.15 + i * 0.12, 1.25 + i * 0.12)));

      /* v24a — the plates of what he saw; v24b — they go into the page */
      plates.forEach((p) => {
        const k = es(t, 0.1 + p.i * 0.1, 0.45 + p.i * 0.1, ease.out);
        const into = es(t, 1.1 + p.i * 0.1, 1.45 + p.i * 0.1, ease.in);
        const [sx, sy] = SPOTS[p.i];
        vis(p.el, { x: lerp(sx, DESK.x - 10, into), y: lerp(lerp(-300, sy, k), DESK.y - 90, into), s: 1 - into * 0.85, r: T ? Math.sin(T * 0.8 + p.i) * 2 : 0, o: k > 0.01 && into < 0.98 ? 1 : 0 });
      });

      /* v24c — the brothers look in; the seal; "true" */
      bros.forEach((b) => {
        const k = es(t, 2.05 + b.i * 0.08, 2.35 + b.i * 0.08);
        b.p.set({ x: 1180 + b.i * 70, y: FLOOR - 4 + b.i * 4, s: 0.9, flip: true, o: k * (1 - melt), armF: 20 + b.i * 10, armB: 10 + (b.i === 1 ? bump(t, 2.4, 2.9) * 110 : 0), head: bump(t, 2.4, 2.7) * 8 + bump(t, 2.6, 2.9) * 8, blink: blinkAt(T, b.seed) });
      });
      const sk2 = es(t, 2.3, 2.45, ease.back);
      vis(sealEl, { x: DESK.x + 40, y: DESK.y - 74 - (1 - sk2) * 40, s: 0.6 + sk2 * 0.4 + bump(t, 2.42, 2.55) * 0.2, o: sk2 > 0.01 ? 1 : 0 });
      const tk = es(t, 2.4, 2.7, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      vis(trueW, { x: 800, y: lerp(-300, 330, tk), r: T ? Math.sin(T * 0.8) : 0, o: tk > 0.01 ? 1 : 0 });

      /* v25a — many other things: lights appear all over the sky */
      deeds.forEach((d) => {
        const k = es(t, 3.1 + d.a * 0.6, 3.3 + d.a * 0.6, ease.back);
        vis(d.el, { x: d.x, y: d.y + (T ? Math.sin(T * 0.9 + d.i) * 5 : 0), s: k * (1 + (T ? Math.sin(T * 2 + d.i) * 0.08 : 0)), o: k > 0.01 ? 1 - es(t, 4.4, 4.8) * 0.5 : 0 });
      });

      /* v25b — the books rise, row upon row, round the world */
      stacks.forEach((b) => {
        const k = es(t, 4.05 + b.d * 0.45, 4.3 + b.d * 0.45, ease.back);
        vis(b.el, { x: b.x, y: b.y, s: b.s, sy: k, o: k > 0.01 ? 1 : 0 });
      });
      const wk = es(t, 4.0, 4.35, ease.out);
      pose(world, { x: 800, y: lerp(-500, 300, wk), r: T ? Math.sin(T * 0.5) * 1.2 : 0, o: wk > 0.01 ? 1 : 0 });
      owk.forEach((el, i) => pose(el, { sy: es(t, 4.3 + i * 0.06, 4.5 + i * 0.06, ease.back) + 0.001 }));

      /* the end: the curtains close */
      cur.set(1 - es(t, 4.62, 4.98), T);

      S.cam.x = kf(t, [[0, 20], [1, 30], [2, 40], [3, 20], [4, 0], [5, 0]]);
      S.cam.y = kf(t, [[0, 140], [1, 150], [2, 140], [3, 60], [4, -10], [4.6, -30], [5, -30]]);
      S.cam.z = kf(t, [[0, 1.26], [1, 1.3], [2, 1.18], [3, 1.04], [4, 0.96], [4.6, 0.94], [5, 0.94]]);
    };
  },
};
