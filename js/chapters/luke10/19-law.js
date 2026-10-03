// Łk 10,27–29 — still under the terebinth. The lawyer reads the Law aloud: "You shall love the Lord your God with all
// your heart, with all your soul, with all your strength and with all your mind": the scroll rises, and out of it come
// four golden plates one after another — a heart, a flame of the soul, a pillar of strength, a thinking head — and
// climb in an arch toward the light above. "And your neighbour as yourself": a little painted card comes down between
// them — two figures facing each other, the same size, a heart between them. "You have answered right": Jesus nods and
// a golden tick is set on the card. "Do this, and you will live": at the lawyer's feet a green shoot comes up and grows
// into a small tree of life, blossoming. "But he, wanting to justify himself, said: And who is my neighbour?": the
// lawyer draws a circle in the dust round himself with the tip of his scroll; outside it, beyond the edge of the
// shade, three strangers stand in grey — a beggar, a leper, a Samaritan — and a big question mark hangs over him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { shadeSet, SHADE, lawyer, lawScroll, stillGroup, folk, figure, loveIcon, disc, heart, tick, question, glow, silhouette, kf, handAt, headAt, MORNING, LAWYER, SAMARITAN, STRING, es, ease, bump, seg, PI } from './lib.js';
import { scrollRolled } from '../mark2/lib.js';

const { JX, JY } = SHADE;
const LX = 1000, LY = 716;
const ARCH = [[520, 250], [610, 196], [720, 172], [830, 186]];
const ARCH_P = [[552, 262], [626, 210], [712, 182], [800, 190]];   // phone: the arch clear of the card and of the left frame

export default {
  id: 'lk10-law',
  beats: [
    { v: 27, text: 'On rzekł: Będziesz miłował Pana, Boga swego, całym swoim sercem, całą swoją duszą, całą swoją mocą i całym swoim umysłem;' },
    { v: 27, cont: true, text: 'a swego bliźniego jak siebie samego.' },
    { v: 28, text: 'Jezus rzekł do niego: «Dobrześ odpowiedział.' },
    { v: 28, cont: true, text: 'To czyń, a będziesz żył».' },
    { v: 29 },
  ],
  cam: { x: [-30, 80], y: [-100, 40], z: [1, 1.1] },
  build(S) {
    // phone: the card of the neighbour, the tick, the tree and the strangers come in from the edges
    const PT = S.portrait;
    const V = shadeSet(S, { skyCols: MORNING });
    const c = S.c;
    const pc = makeCutter('lk10-shade-people');

    /* the light above the arch, the scroll, the four plates */
    const flies = S.layer({ par: 0.3, sh: 6 });
    const top = flies.add(`<g>${glow(200, 0.9)}</g>`);
    const law = flies.add(`<g>${lawScroll(c, 280, 150)}</g>`);
    const PLATES = ['heart', 'soul', 'strength', 'mind'].map((k, i) => ({ i, el: flies.add(`<g>${disc(c, 34, { fill: C.cream, rim: C.sun })}<g transform="scale(.9)">${loveIcon(c, k)}</g></g>`) }));
    // the card of the neighbour: two figures the same size, a heart between them
    const cardW = 250, cardH = 170;
    const card = sheet().p(c.cut(c.rect(-cardW / 2, 0, cardW, cardH), 0.6, 8), C.cream).p(c.cut(c.rect(-cardW / 2 + 9, 9, cardW - 18, cardH - 18), 0.4, 8), mix(C.skyBlue, C.cream, 0.4)).p(c.cut([[-cardW / 2 + 9, cardH - 50], [cardW / 2 - 9, cardH - 56], [cardW / 2 - 9, cardH - 9], [-cardW / 2 + 9, cardH - 9]], 0.4, 8), mix(C.hillNear, C.sand, 0.3)).out();
    const pair = figure(pc, { ...LAWYER, mantle: C.linen }, { x: -60, y: cardH - 30, s: 0.56, armF: 60, armB: 10 }) + figure(pc, { robe: C.wheatRobe, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.leather }, { x: 60, y: cardH - 30, s: 0.56, flip: true, armF: 60, armB: 10 });
    const cardEl = flies.add(`<g><path d="M${-cardW / 2 + 20} 0V-2000M${cardW / 2 - 20} 0V-2000" stroke="${STRING}" stroke-width="1.2"/>${card}${pair}<g transform="translate(0 ${cardH - 110})">${heart(c, 16)}</g><path d="${c.ribbon([[-12, 40], [12, 40]], 4) + c.ribbon([[-12, 50], [12, 50]], 4)}" fill="${C.ochre}"/></g>`);
    const tk = flies.add(`<g>${tick(c, 34)}</g>`);

    /* the listeners, Jesus, the lawyer */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    [[330, 752, false], [1290, 756, true]].forEach(([x, y, flip]) => {
      crowdL.sprite(stillGroup(pc, [0, 1].map((k) => ({ x: (k - 0.5) * 60, y: k * 6, s: 0.9, flip, o: { ...folk(pc), pose: 'sit' }, armF: 30, armB: 10, head: -4 }))), x, y);
    });
    // the strangers outside the circle, beyond the shade
    const SL = S.layer({ par: 0.4, sh: 4 });
    const BEGGAR = { robe: mix(C.stone2, C.sand2, 0.4), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope };
    const LEPER = { robe: mix(C.stone, C.linen2, 0.5), hairStyle: 'wrap', veil: C.stone2, hair: C.hair, beard: 'short', skin: mix(C.skin2, C.stone2, 0.3) };
    const grey = (o) => ({ ...o, robe: mix(o.robe, C.stone2, 0.55), mantle: o.mantle ? mix(o.mantle, C.stone2, 0.55) : null, veil: o.veil ? mix(o.veil, C.stone2, 0.4) : o.veil });
    const strangers = (PT ? [[545, BEGGAR, 0.9, false], [630, LEPER, 0.92, false], [1095, SAMARITAN, 0.96, true]] : [[480, BEGGAR, 0.9, false], [575, LEPER, 0.92, false], [1170, SAMARITAN, 0.96, true]]).map(([x, o, s, flip], i) => ({ i, x, s, flip, p: S.puppet(SL.add(person(c, grey(o)))) }));
    const P = S.layer({ par: 0.42, sh: 5 });
    const aura = P.add(`<g>${glow(160, 0.5)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const ring = P.add(`<g><path d="${c.ribbon(c.arc(0, 0, 110, 26, 0, PI * 2, 48), 4)}" fill="${shade(C.sand2, -0.2)}"/></g>`);
    // the tree of life that grows at his feet
    const life = sheet();
    life.p(c.ribbon(c.qbez([0, 0], [-6, -50], [4, -110], 10), (u) => 8 - u * 5), C.wood2);
    life.p(c.cut(c.blob(0, -120, 50, 36, 14, 0.15), 0.8, 6) + c.cut(c.blob(-30, -96, 26, 20, 10, 0.2), 0.6, 5) + c.cut(c.blob(30, -98, 26, 20, 10, 0.2), 0.6, 5), C.leaf);
    let fr = '';
    for (let i = 0; i < 7; i++) fr += c.cut(c.circ(c.rr(-40, 40), -120 + c.rr(-26, 22), 5, 8), 0.2, 2);
    life.p(fr, C.sun);
    const tree = P.add(`<g>${glow(80, 0.6)}${life.out()}</g>`);
    const held = `<g transform="rotate(80) translate(0 -6)">${scrollRolled(c, 40)}</g>`;
    const lw = S.puppet(P.add(lawyer(c, { holdF: held })));
    const qm = P.add(`<g transform="scale(1.6)">${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      V.update(T);
      const [lhx, lhy] = headAt(LX, LY, 1.0, true);

      /* v27a — the four plates climb toward the light */
      const lift = es(t, 0.02, 0.3);
      pose(law, { x: 930, y: lerp(250, -600, lift), o: 1 - seg(t, 0.28, 0.3) });
      pose(top, { x: 680, y: 110, s: 1 + es(t, 0.2, 0.8) * 0.4, o: es(t, 0.1, 0.4) });
      PLATES.forEach((p) => {
        const k = es(t, 0.15 + p.i * 0.12, 0.4 + p.i * 0.12, ease.out);
        const [ax, ay] = (PT ? ARCH_P : ARCH)[p.i];
        pose(p.el, { x: lerp(930, ax, k), y: lerp(330, ay, k), s: 0.4 + k * 0.6, o: k > 0.01 ? 1 : 0 });
      });

      /* v27b — the neighbour as yourself */
      const ck = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 3.9, 4.1));
      pose(cardEl, { x: PT ? 968 : 1040, y: lerp(-400, 180, ck), r: T ? Math.sin(T * 0.8) * ck : 0, o: ck > 0.01 ? 1 : 0 });

      /* v28a — "You have answered right" */
      const tt = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 3.9, 4.1));
      pose(tk, { x: PT ? 1050 : 1150, y: 214, s: tt, r: -8, o: tt > 0.01 ? 1 : 0 });
      const nod = bump(t, 2.05, 2.4);

      /* v28b — "Do this and you will live" */
      const grow = es(t, 3.05, 3.6, ease.out) * (1 - es(t, 3.95, 4.05));
      pose(tree, { x: LX + (PT ? -78 : 90), y: LY + 2, s: Math.max(0.01, grow), o: grow > 0.01 ? 1 : 0 });
      const open = es(t, 3.2, 3.5) * (1 - es(t, 3.95, 4.05));

      /* v29 — "And who is my neighbour?": the circle in the dust; the strangers outside it */
      const draw = es(t, 4.1, 4.4);
      pose(ring, { x: LX - 6, y: LY + 2, sx: Math.max(0.01, draw), o: draw > 0.01 ? 1 : 0 });
      strangers.forEach((st) => {
        const k = es(t, 4.2 + st.i * 0.06, 4.4 + st.i * 0.06);
        st.p.set({ x: st.x, y: 724, s: st.s, flip: st.flip, o: k, armF: 20 + st.i * 10, armB: 10, head: 4, blink: blinkAt(T, st.i + 6) });
      });
      const q = es(t, 4.45, 4.6, ease.back);
      pose(qm, { x: lhx - 10, y: lhy - 70, s: q, o: q > 0.01 ? 1 : 0 });
      const tip = es(t, 4.1, 4.2) * (1 - es(t, 4.45, 4.55));
      lw.set({ x: LX, y: LY, s: 1.0, flip: true, armF: 40 + (1 - lift) * 0 + bump(t, 0.1, 0.95) * 40 + open * 50 - tip * 20, armB: 20 + bump(t, 0.2, 0.9) * 60 + bump(t, 1.1, 1.8) * 40 + es(t, 4.5, 4.7) * 60, head: -14 * bump(t, 0.1, 0.95) + open * 10 + tip * 20, lean: tip * 10, blink: blinkAt(T, 5) });

      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 30 + bump(t, 3.05, 3.9) * 50, armB: 10, head: -2 + nod * 12, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 110, o: 0.5 });

      S.cam.x = kf(t, [[0, 20], [1, 20], [2, 40], [3, 40], [4, 30], [4.4, 70], [5, 70]]);
      S.cam.y = kf(t, [[0, -60], [1.0, -60], [1.4, -30], [2.9, -30], [3.2, 20], [4, 20], [4.4, 10], [5, 10]]);
      S.cam.z = kf(t, [[0, 1.0], [2.9, 1.0], [3.2, 1.06], [4, 1.06], [4.4, 1.02], [5, 1.02]]);
    };
  },
};
