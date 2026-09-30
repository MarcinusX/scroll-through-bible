// Łk 16,19–21 — the second parable flies in: the palace of a rich man at evening. On the right, where the high wall is
// cut away, the banquet court: purple hangings between the columns, lamps on chains, a long table. On the left the
// street along the outer wall and the great gate. "There was a rich man who was clothed in purple and fine linen and
// feasted splendidly every day": he takes his place at the head of the table in his purple mantle over white linen,
// servants bring dish after dish, the guests lift their cups — and over the roofs the sun and the moon and the sun
// again go round: day after day. "At his gate lay a beggar named Lazarus, covered with sores": two men carry a poor
// man on a mat along the street and lay him down at the gate, and a name comes down on its string: Lazarus. "He
// longed to be fed with what fell from the rich man's table": inside, crumbs and scraps drop under the table; outside
// Lazarus props himself up against the wall and holds out his bowl towards the gate. "Even the dogs came and licked
// his sores": two thin street dogs come trotting up to him and nuzzle his arm; he lets them.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { sun, moon } from '../../assets/nature.js';
import { palaceSet, PAL, PURPLE, RICHMAN, LAZARUS, lazarus, lying, streetDog, beggarBowl, loaf, cup, bowl, crumb, thought, label, handAt, headAt, kf, moving, tr, es, ease, bump, seg, PI, STRING, FEAST } from './lib.js';
import { platter } from '../mark6/lib.js';

const GY = PAL.GY, FL = PAL.FLOOR, TOP = PAL.TOP;
const RX = 868;
const PURPLE_C = PURPLE;                      // the rich man at the head of the table
const LX = 570;                      // Lazarus, at the gate
const GUESTS = [[1060, { robe: C.linen2, mantle: C.ochre, hair: C.hair2, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.sun }], [1180, { robe: C.skyVeil, mantle: C.plumRobe, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.sun }]];
const SERVANT = { robe: C.linen2, mantle: null, hair: C.hair, hairStyle: 'short', beard: 'none', skin: C.skin4, belt: C.terracotta };
const BEARER = (i) => ({ robe: [C.stone2, C.wheatRobe][i], mantle: null, hair: C.hair3, hairStyle: ['short', 'wrap'][i], veil: C.stone, veil2: C.rock2, beard: 'short', skin: [C.skin3, C.skin4][i], belt: C.rope });

/** Lazarus lying on his mat (origin: the mat's right end on the ground) */
function onMat(c) {
  const m = sheet().p(c.cut([[-190, -4], [6, -6], [8, 6], [-192, 8]], 0.6, 8), mix(C.basket, C.wood3, 0.3)).x(c.ribbon([[-180, 0], [0, -1]], 1.2), shade(C.basket, -0.25), 'opacity=".6"').out();
  return m;
}
const lyingLaz = (c) => `<g transform="translate(-14 -4)">${lying(lazarus(c, { eyes: 'closed' }), 0.86)}</g>`;

export default {
  id: 'lk16-purple',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 19 },
    { v: 20 },
    { v: 21, text: 'Pragnął on nasycić się odpadkami ze stołu bogacza;' },
    { v: 21, cont: true, text: 'nadto i psy przychodziły i lizały jego wrzody.' },
  ],
  cam: { x: [-80, 60], y: [-30, 40], z: [1, 1.14] },
  build(S) {
    const P = palaceSet(S, { skyCols: FEAST });
    const c = P.c;
    /* day after day: sun, moon, sun over the roofs */
    const suns = [0, 1].map(() => P.skyFx.add(`<g opacity="0">${sun(c, 30)}</g>`));
    const mn = P.skyFx.add(`<g opacity="0">${moon(c, 26)}</g>`);
    /* the feast */
    const guests = GUESTS.map(([x, o], i) => ({ i, x, p: S.puppet(P.hall.add(person(c, { ...o, pose: 'sit' }))) }));
    const cushion = P.act.add(`<g>${sheet().p(c.cut(c.blob(0, -8, 56, 12, 12, 0.1), 0.4, 4), PURPLE_C).x(c.ribbon([[-50, -6], [50, -6]], 2), C.sun, 'opacity=".8"').out()}</g>`);
    const rich = S.puppet(P.act.add(person(c, { ...RICHMAN, pose: 'sit', holdF: `<g transform="rotate(-90) translate(0 2)">${cup(c, C.sun)}</g>` })));
    const dishes = [[970, platter(c, { w: 60 })], [1010, `<g transform="scale(1.2)">${bowl(c, { food: 'fruit', color: C.skyVeil })}</g>`], [1110, loaf(c, 16)], [1130, cup(c, C.sun)], [1200, platter(c, { w: 50 })], [1235, loaf(c, 13)]]
      .map(([x, m], i) => ({ i, x, el: P.table.add(`<g opacity="0">${m}</g>`) }));
    const servant = S.puppet(P.act.add(person(c, { ...SERVANT, holdF: `<g transform="rotate(-80) translate(-4 -6)">${platter(c, { w: 60, covered: true })}</g>` })));
    const crumbs = [0, 1, 2, 3, 4].map((i) => ({ i, el: P.act.add(`<g opacity="0">${crumb(c, 6 + (i % 2) * 2)}</g>`) }));
    /* Lazarus: carried in on his mat and laid at the gate; then propped against the wall with his bowl */
    const bearers = [0, 1].map((i) => S.puppet(P.act.add(person(c, BEARER(i)))));
    const mat = P.act.add(`<g>${onMat(c)}</g>`);
    const body = P.act.add(`<g>${lyingLaz(c)}</g>`);
    const laz = S.puppet(P.act.add(lazarus(c, { pose: 'sit', holdF: `<g transform="translate(4 4)">${beggarBowl(c)}</g>` })));
    const dogs = [0, 1].map((i) => ({ i, el: P.act.add(`<g>${streetDog(c, { col: [mix(C.wood3, C.dune, 0.4), mix(C.stone2, C.wood2, 0.4)][i] })}</g>`) }));
    const name = P.W.add(`<g opacity="0"><path d="M0 -1600V-14" stroke="${STRING}" stroke-width="1.2" fill="none"/>${label(c, tr('Łazarz', 'Lazarus'), { size: 20 })}</g>`);
    const want = P.W.add(`<g opacity="0">${thought(c, `<g transform="translate(-10 6)">${crumb(c, 9)}</g><g transform="translate(12 2)">${loaf(c, 11)}</g>`, { w: 70, h: 46 })}</g>`);

    return (t, time) => {
      const T = time;
      P.update(t, T, { lit: 1, open: 0.25 });
      /* v19 — purple and linen; dish after dish; day after day */
      const DAYS = [[0.12, 0.42, suns[0]], [0.42, 0.7, mn], [0.7, 1.0, suns[1]]];
      DAYS.forEach(([a, b, el]) => { const k = seg(t, a, b); pose(el, { x: lerp(430, 720, k), y: 320 - Math.sin(k * PI) * 150, o: k > 0 && k < 1 ? Math.sin(k * PI) * 1.4 : 0 }); });
      const toast = bump(t, 0.5, 0.9) + bump(t, 1.5, 1.9) * 0.6;
      pose(cushion, { x: RX, y: FL + 18 });
      rich.set({ x: RX, y: FL + 10, s: 1.0, armF: 40 + toast * 60, armB: 10, head: -4 - toast * 6, blink: blinkAt(T, 1) });
      guests.forEach((g) => g.p.set({ x: g.x, y: FL, s: 0.94, flip: true, armF: 30 + toast * 50, armB: 10, head: -2, blink: blinkAt(T, 3 + g.i) }));
      dishes.forEach((d) => { const k = es(t, 0.15 + d.i * 0.08, 0.25 + d.i * 0.08, ease.back); pose(d.el, { x: d.x, y: TOP - 6, s: k, o: k > 0.01 ? 1 : 0 }); });
      const SK = [[0, 1500], [0.12, 1260], [0.6, 1260], [0.75, 1420], [0.9, 1260]];
      const svx = kf(t, SK);
      servant.set({ x: svx, y: FL + 20, s: 0.98, flip: !(t > 0.62 && t < 0.76), walk: moving(t, SK) ? svx * 0.06 : undefined, armF: 80, armB: 10, head: -2, blink: blinkAt(T, 5) });
      /* v20 — carried in and laid at the gate */
      const BK = [[1.0, 180], [1.35, LX + 40], [1.5, LX + 40], [1.9, 120]];
      const bx = kf(t, BK);
      const carry = t < 1.42 ? 1 : 0;
      const down = es(t, 1.35, 1.45);
      bearers.forEach((b, i) => {
        const x = bx - (i ? 250 : 20) * (t < 1.5 ? 1 : 0) - (t >= 1.5 ? i * 70 : 0);
        b.set({ x, y: GY + 4, s: 0.94, flip: t > 1.5, walk: moving(t, BK) ? x * 0.06 : undefined, armF: carry ? 70 - down * 40 : 10, armB: carry ? 50 : 6, head: 2, blink: blinkAt(T, 6 + i), o: es(t, 1.0, 1.05) * (1 - es(t, 1.85, 1.9)) });
      });
      const onGround = t >= 1.45 || t < 1.0;
      const matX = onGround ? LX + 150 : bx - 10, matY = onGround ? GY + 6 : lerp(GY - 60, GY + 6, down);
      const up = seg(t, 2.05, 2.1);
      pose(mat, { x: matX, y: matY, o: t < 1.0 ? 0 : 1 });
      pose(body, { x: matX, y: matY, o: t < 1.0 ? 0 : 1 - up });
      const hold = es(t, 2.2, 2.35);
      laz.set({ x: LX + 40, y: GY + 2, s: 0.92, flip: false, o: up, armF: 30 + hold * 50 - es(t, 3.3, 3.45) * 30, armB: 10, head: -hold * 10 + es(t, 3.3, 3.5) * 14, blink: blinkAt(T, 7) });
      // hide the lying figure once he sits up: the mat stays, the sitting man covers it
      const nk = es(t, 1.45, 1.7, ease.out) * (1 - es(t, 2.9, 3.0));
      pose(name, { x: LX + 30, y: lerp(-400, 470, nk), o: nk > 0.004 ? 1 : 0 });
      /* v21a — crumbs fall under the table; he holds out his bowl */
      crumbs.forEach((cr) => {
        const a = 2.1 + cr.i * 0.1;
        const k = seg(t, a, a + 0.25);
        pose(cr.el, { x: 960 + cr.i * 60, y: lerp(TOP + 20, FL - 4, k * k), r: k * 200, o: t > a ? 1 : 0 });
      });
      const wk = es(t, 2.3, 2.42, ease.back) * (1 - es(t, 3.2, 3.3));
      const [lhx, lhy] = headAt(LX + 40, GY + 2, 0.92, false, 'sit');
      pose(want, { x: lhx + 10, y: lhy - 20, s: wk, o: wk > 0.01 ? 1 : 0 });
      /* v21b — the dogs */
      dogs.forEach((d) => {
        const DK = [[3.02 + d.i * 0.06, -150 - d.i * 80], [3.35 + d.i * 0.06, LX - 20 - d.i * 60]];
        const dx = kf(t, DK);
        const lick = t > 3.4 ? Math.sin(t * 50 + d.i) : 0;
        pose(d.el, { x: dx, y: GY + 10 + d.i * 8, s: 0.9 - d.i * 0.08, r: lick * 3, o: t > 3.0 ? 1 : 0 });
        const hd = d.el.querySelector('.hd');
        pose(hd, { x: 34, y: -50, r: t > 3.4 ? 14 + lick * 6 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 50], [0.9, 50], [1.3, -60], [2.0, -60], [2.1, -30], [2.6, -30], [3.0, -60]]);
      S.cam.y = kf(t, [[-0.5, -10], [0.3, 10], [3, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.02], [0.4, 1.08], [1.3, 1.1]]);
    };
  },
};
