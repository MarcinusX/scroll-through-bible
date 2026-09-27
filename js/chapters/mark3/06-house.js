// Mk 3,20–21 — a house cut open like a doll's house: Jesus comes in, the crowd pours after him and
// packs the room, the door, the window, the stairs and the roof — there is no room even to eat.
// Up on the hill his family hear of it and set out to take him home: "He is out of his mind."
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, sun, cloud, olive, house, town, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { houseSection, loaf, spiral, bubble, handAt, headAt, man, woman, along, withFace, faceBits } from './lib.js';

const PI = Math.PI;
const PAR = 0.4;
const X0 = 540, X1 = 1060, FLOOR = 640, CEIL = 330;
const ROAD = [[470, 332], [500, 352], [488, 380], [520, 404], [548, 418]];
const KINLOOK = [
  { robe: C.tealRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather },
  { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2 },
  { robe: C.sageRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3, belt: C.leather },
];

export default {
  id: 'm3-house',
  beats: [
    { v: 20 },
    { v: 21, text: 'Gdy to posłyszeli Jego bliscy, wybrali się, żeby Go powstrzymać.' },
    { v: 21, cont: true, text: 'Mówiono bowiem: «Odszedł od zmysłów».' },
  ],
  cam: { x: [-60, 10], y: [-60, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#cfe0dc', '#efe4cb', '#f6e7cf']);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, cloud(c, 130), { x: 1180, y: 110, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 700, y: 140, len: 600 });

    /* the hill with his home village, and the road down */
    const hill = S.layer({ par: 0.14, sh: 2 });
    const hb = band(c, { y: 420, amps: [30, 10, 3], lens: [900, 300, 110], color: C.hillFar });
    hill.add(hb.markup);
    hill.add(sheet().p(c.cut(c.blob(470, 380, 160, 60, 14, 0.12).map(([x, y]) => [x, Math.min(y, 440)]), 1, 8), mix(C.hillMid, C.hillFar, 0.4)).out());
    hill.add(town(c, { x: 450, y: 334, n: 5, spread: 110, sc: 0.5 }));
    hill.add(`<path d="${c.ribbon(ROAD, 5)}" fill="${C.sand}" opacity=".8"/>`);

    /* behind the house: people pressing at the door and the window */
    const behind = S.layer({ par: PAR, sh: 3 });
    behind.add(sheet().p(c.cut([[-900, 560], [2500, 560], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.3)).out());
    behind.add(olive(c, 330, 600, 1) + olive(c, 1300, 606, 0.9));
    const BACKFOLK = [[650, 604, 0.72], [610, 596, 0.7], [690, 598, 0.7], [900, 590, 0.72], [950, 594, 0.74]].map(([x, y, s], i) => ({ x, y, s, i, seed: c.rr(0, 9), p: S.puppet(behind.add(person(c, crowdPerson(c)))) }));

    /* the house itself */
    const H = houseSection(c, { x0: X0, x1: X1, floor: FLOOR, ceil: CEIL });
    const houseL = S.layer({ par: PAR, sh: 4 });
    houseL.add(H.back);

    /* inside */
    const inL = S.layer({ par: PAR, sh: 4 });
    const INSIDE = [575, 640, 700, 760, 842, 900, 960, 1020].map((x, i) => ({ x, y: 612 + (i % 2) * 6, s: 0.74 + (i % 3) * 0.02, i, seed: c.rr(0, 9), flip: x > 800, p: S.puppet(inL.add(person(c, crowdPerson(c)))) }));
    const jWalk = S.puppet(inL.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(inL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const DIS = [
      { o: CAST.james, x: 636, s: 0.84 }, { o: CAST.peter, x: 704, s: 0.88 },
      { o: CAST.john, x: 900, s: 0.86 }, { o: CAST.andrew, x: 966, s: 0.84 },
    ].map((d, i) => ({ ...d, i, y: 652, flip: d.x > 800, seed: c.rr(0, 9), walk: S.puppet(inL.add(person(c, { ...d.o }))), sit: S.puppet(inL.add(person(c, { ...d.o, pose: 'sit' }))) }));
    // the low table, bread and a bowl
    const tb = sheet();
    tb.p(c.cut([[730, 660], [870, 660], [866, 668], [734, 668]], 0.4, 6), C.wood);
    tb.p(c.cut([[742, 668], [750, 668], [750, 688], [742, 688]], 0.2, 4) + c.cut([[850, 668], [858, 668], [858, 688], [850, 688]], 0.2, 4), C.wood2);
    tb.p(c.cut(c.arc(820, 660, 22, 14, 0, PI, 10), 0.4, 5), C.pot);
    inL.add(tb.out() + `<g transform="translate(772 660)">${loaf(c, 13)}</g>`);
    const steam = inL.add(`<g>${[0, 1].map((i) => `<path d="${c.ribbon(c.cbez([0, 0], [-6, -10], [6, -18], [0, -30], 10), (u) => 3 - u * 2)}" fill="${C.cream}" opacity=".6" transform="translate(${i * 10 - 5} 0)"/>`).join('')}</g>`);
    const bread = inL.add(`<g>${loaf(c, 12)}</g>`);

    /* the cut edges of the house, the stairs */
    const frontL = S.layer({ par: PAR, sh: 5 });
    frontL.add(H.front + H.stairs);

    /* outside: at the left, on the stairs, on the roof */
    const outL = S.layer({ par: PAR, sh: 4 });
    // his family, come down from the village to take him home
    const rope = `<g transform="translate(0 8)">${sheet().p(c.ribbon(c.arc(0, 0, 12, 12, 0, PI * 2, 16), 4) + c.ribbon(c.arc(1, 2, 8, 8, 0, PI * 2, 12), 3.4), C.rope).out()}</g>`;
    const KIN = [
      { o: { ...KINLOOK[0], holdF: rope }, x: 470, s: 0.9 },
      { o: KINLOOK[1], x: 540, s: 0.86 },
      { o: KINLOOK[2], x: 405, s: 0.88 },
    ].map((k, i) => ({ ...k, i, y: 704, seed: c.rr(0, 9), p: S.puppet(outL.add(withFace(person(c, k.o), i === 0 ? faceBits(c) : ''))) }));
    KIN.forEach((k) => { k.angry = k.p.el.querySelector('[data-part="angry"]'); });
    const messenger = S.puppet(outL.add(person(c, man(c, { robe: C.roseRobe, beard: 'none' }))));
    const bang = outL.add(`<g opacity="0">${bubble(c, '!', { size: 30, w: 44 })}</g>`);
    const STAIR = [0.2, 0.48].map((u, i) => ({ u, i, seed: c.rr(0, 9), p: S.puppet(outL.add(person(c, crowdPerson(c)))) }));
    const ROOF = [[660, 0.62], [780, 0.6], [900, 0.62]].map(([x, s], i) => ({ x, s, i, seed: c.rr(0, 9), p: S.puppet(outL.add(person(c, { ...crowdPerson(c), pose: 'kneel' }))) }));
    const gossip = [
      { x: 560, y: 478, el: outL.add(`<g opacity="0">${bubble(c, tr('Odszedł od zmysłów!', 'He is insane!'), { size: 18, tail: -1 })}<g transform="translate(0 -84)">${spiral(c, 13)}</g></g>`) },
      { x: 1000, y: 214, el: outL.add(`<g opacity="0">${bubble(c, tr('Odszedł od zmysłów!', 'He is insane!'), { size: 18, tail: -1 })}<g transform="translate(0 -84)">${spiral(c, 13)}</g></g>`) },
    ];

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(bush(c, 200, 980, 220, C.sage, C.moss) + rock(c, 1400, 985, 180, 60, C.rock2));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1180 - t * 8, 110, T, 1.4, 0.6, 2);
      swing(cl1, 700 + t * 12, 140, T, 1.4, 0.6, 1);

      /* beat 0: Jesus comes in through the door and sits; the room fills */
      const [dx] = [(H.door[0] + H.door[1]) / 2];
      const jw = es(t, 0.02, 0.3);
      const jsit = es(t, 0.3, 0.36);
      jWalk.set({ x: lerp(dx, 800, jw), y: lerp(FLOOR - 6, 632, jw), s: lerp(0.84, 0.94, jw), o: es(t, -0.1, 0.04) * (1 - jsit), walk: jw > 0 && jw < 1 ? jw * 30 : undefined, blink: blinkAt(T, 2) });
      const teach = es(t, 0.4, 0.7);
      jSit.set({ x: 800, y: 632, s: 0.94, o: jsit, flip: t > 1.9 ? true : false, armF: 20 + teach * 40 + bump(t, 0.4, 0.8) * 20 + es(t, 1.9, 2.2) * 20, armB: 10 + teach * 20, head: -2 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2) });
      DIS.forEach((d) => {
        const w = es(t, 0.08 + d.i * 0.05, 0.34 + d.i * 0.05);
        const sit = es(t, 0.34 + d.i * 0.05, 0.4 + d.i * 0.05);
        d.walk.set({ x: lerp(dx, d.x, w), y: lerp(FLOOR - 6, d.y, w), s: lerp(0.78, d.s, w), flip: d.x < dx, o: es(t, 0.02 + d.i * 0.05, 0.1 + d.i * 0.05) * (1 - sit), walk: w > 0 && w < 1 ? w * 30 : undefined, blink: blinkAt(T, d.seed) });
        const squeeze = es(t, 0.55, 0.8);
        const reach = d.i === 1 ? es(t, 0.5, 0.62) * (1 - es(t, 0.7, 0.76)) : 0;
        d.sit.set({ x: d.x + (d.flip ? -1 : 1) * squeeze * 6, y: d.y, s: d.s, flip: d.flip, o: sit, lean: (d.flip ? 1 : -1) * squeeze * 4, armF: 20 + reach * 70 + (d.i === 1 ? bump(t, 0.74, 1.2) * 40 : 0), armB: (d.i === 1 ? bump(t, 0.74, 1.2) * 80 : 0), head: -4 + squeeze * (d.i % 2 ? 6 : -4), blink: blinkAt(T, d.seed) });
      });
      // Peter lifts the bread — and it is knocked out of his hand by the press
      const P = DIS[1];
      const lift = es(t, 0.5, 0.62);
      const knock = es(t, 0.72, 0.95);
      const [phx, phy] = handAt(P.x, P.y, P.s, false, 20 + lift * 70 * (1 - es(t, 0.7, 0.76)), 'sit');
      const bx = knock > 0 ? lerp(phx, 1000, knock) : lerp(772, phx, lift), by = knock > 0 ? lerp(phy, 700, knock) - Math.sin(knock * PI) * 90 : lerp(652, phy + 4, lift);
      pose(bread, { x: bx, y: by, r: knock * 400, o: t > 0.48 && knock < 1 ? 1 : 0 });
      pose(steam, { x: 820, y: 650, sy: 0.8 + Math.sin(T * 2) * 0.1, o: 0.8 * (1 - es(t, 0.6, 0.9) * 0.5) });

      INSIDE.forEach((m) => {
        const come = es(t, 0.25 + m.i * 0.05, 0.55 + m.i * 0.05);
        const x = lerp(dx, m.x, come);
        const shove = m.i === 2 ? bump(t, 0.66, 0.9) : 0;
        m.p.set({ x: x - shove * 14, y: lerp(FLOOR - 8, m.y, come), s: m.s, flip: come < 1 ? m.x < dx : m.flip, o: es(t, 0.22 + m.i * 0.05, 0.3 + m.i * 0.05), walk: come > 0 && come < 1 ? x * 0.08 : undefined, lean: shove * -8, head: es(t, 2.1, 2.4) * (m.i % 2 ? 8 : -6), armF: es(t, 2.1 + m.i * 0.03, 2.3 + m.i * 0.03) * (m.i % 3 === 0 ? 150 : 0) + bump(t, 0.6, 1) * 20, blink: blinkAt(T, m.seed) });
      });
      BACKFOLK.forEach((m) => m.p.set({ x: m.x + Math.sin(m.i) * 4 * es(t, 0.4, 0.9), y: m.y, s: m.s, flip: m.x > 800, o: es(t, 0.35 + m.i * 0.06, 0.55 + m.i * 0.06), head: -6, blink: blinkAt(T, m.seed) }));
      STAIR.forEach((m) => {
        const up = es(t, 0.45 + m.i * 0.1, 0.9 + m.i * 0.05);
        const [sx, sy] = H.stepAt(m.u * up);
        m.p.set({ x: sx + 20, y: sy, s: 0.72, flip: true, o: up > 0 ? 1 : 0, walk: up > 0 && up < 1 ? up * 50 : undefined, armF: 30, head: -4, blink: blinkAt(T, m.seed) });
      });
      ROOF.forEach((m) => {
        const on = es(t, 0.6 + m.i * 0.08, 0.8 + m.i * 0.08);
        m.p.set({ x: m.x, y: H.roofY + 2 + (1 - on) * 30, s: m.s, flip: m.x > 800, o: on, lean: (m.x > 800 ? -1 : 1) * 10, head: 14, blink: blinkAt(T, m.seed) });
      });

      /* beat 1: news runs out to his family; they come down to take hold of him */
      const run = es(t, 0.95, 1.3);
      const mxx = lerp(620, 250, run);
      messenger.set({ x: mxx, y: 712, s: 0.7, flip: true, o: bump(t, 0.9, 1.6) > 0 ? Math.min(1, bump(t, 0.9, 1.6) * 4) : 0, walk: run > 0 && run < 1 ? mxx * 0.1 : undefined, armF: 40 + es(t, 1.3, 1.4) * 50, blink: 0 });
      pose(bang, { x: 380, y: 470, s: es(t, 1.2, 1.35, ease.back), o: t > 1.2 && t < 1.9 ? 1 : 0 });
      KIN.forEach((k) => {
        const go = es(t, 1.35 + k.i * 0.06, 1.8 + k.i * 0.06);
        const x = lerp(k.x - 420, k.x, go);
        const tap = es(t, 2.12 + k.i * 0.05, 2.3 + k.i * 0.05);
        k.p.set({ x, y: k.y, s: k.s, flip: false, o: go > 0 ? 1 : 0, walk: go > 0 && go < 1 ? x * 0.07 : undefined, lean: go < 1 ? 5 : 0, armF: k.i === 0 ? 30 + go * 30 : 20 + tap * (k.i === 1 ? 140 : 0) + (k.i === 2 ? go * 60 : 0), armB: tap * (k.i === 2 ? 160 : 0), head: tap * (k.i === 1 ? 14 : -6) + Math.sin(T * 5) * 4 * tap * (k.i === 2 ? 1 : 0), blink: blinkAt(T, k.seed) });
        if (k.angry) fade(k.angry, es(t, 1.5, 1.8));
      });

      /* beat 2: the whispering: "He is out of his mind" */
      gossip.forEach((g, i) => {
        const on = es(t, 2.12 + i * 0.12, 2.32 + i * 0.12, ease.back);
        pose(g.el, { x: g.x, y: g.y + Math.sin(T * 2 + i) * 2, s: Math.max(0.01, on), r: Math.sin(T * 1.5 + i) * 3, o: on > 0.01 ? 1 : 0 });
        const sp = g.el.lastElementChild;
        pose(sp, { x: 0, y: -84, r: T * 90 * on });
      });

      S.cam.x = -es(t, 0.9, 1.3) * 50 + es(t, 1.95, 2.3) * 40;
      S.cam.y = -es(t, 0.9, 1.3) * 50 + es(t, 1.95, 2.3) * 40;
      S.cam.z = 1 + es(t, 0.9, 1.3) * 0.06 - es(t, 1.95, 2.3) * 0.06;
    };
  },
};
