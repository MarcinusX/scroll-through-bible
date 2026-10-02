// Mt 7,6 — a painted flat of a lane at the edge of the village. A man carries a golden dish with the holy bread;
// street dogs come snarling and jump at it — he lifts it high and sets it in the niche of the wall, out of their
// reach. Further on is a pigsty: he scatters pearls from his pouch into the mud, the pigs trample them in,
// then turn round and charge at him; he runs, and a torn scrap of his cloak flutters behind.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, grass, bush, olive, town, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { VILLAGE, manOf, handAt, streetDog, pig, pearl, pouch, holyDish, mud, rag, storyFrame, PI } from './lib.js';

const GY = 704;
const NICHE = [470, 470];

export default {
  id: 'mt7-pearls',
  enter: 'fly',
  beats: [
    { v: 6, text: 'Nie dawajcie psom tego, co święte,' },
    { v: 6, cont: true, text: 'i nie rzucajcie swych pereł przed świnie, by ich nie podeptały nogami, i obróciwszy się, was nie poszarpały.' },
  ],
  cam: { x: [-40, 90], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the pigsty moves left and the camera pans further right, so all three pigs stay clear of the thread
    const SX = S.portrait ? -60 : 0;
    sky(S, VILLAGE);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1230, y: 150, len: 700 });
    const cl = hanging(hangL, cloud(c, 180), { x: 700, y: 140, len: 700 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [16, 7, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.15) }).markup);
    const hills = S.layer({ par: 0.14, sh: 3 });
    const hb = band(c, { y: 500, amps: [12, 5, 2], lens: [800, 300, 110], color: C.hillMid });
    hills.add(hb.markup + town(c, { x: 1000, y: hb.fn(1000) + 14, n: 6, spread: 300, sc: 0.6 }) + olive(c, 1300, 520, 0.6) + olive(c, 1480, 530, 0.5) + cypress(c, 760, 520, 90));

    /* the village wall on the left with its niche */
    const wall = S.layer({ par: 0.3, sh: 3 });
    const ws = sheet();
    ws.p(c.cut([[-900, 380], [600, 380], [600, GY], [-900, GY]], 1, 12), mix(C.plaster, C.parchment, 0.3));
    ws.p(c.cut([[600, 380], [648, 392], [648, GY], [600, GY]], 0.6, 10), C.plaster2);
    ws.p(c.cut([[-900, 368], [606, 368], [656, 382], [654, 394], [600, 386], [-900, 386]], 0.6, 12), C.roof);
    let bricks = '';
    for (let i = 0; i < 16; i++) { const x = c.rr(-200, 560), y = c.rr(410, 660); bricks += c.cut(c.rect(x, y, c.rr(30, 60), 14), 0.4, 6); }
    ws.x(bricks, C.plaster2, 'opacity=".5"');
    ws.p(c.cut([[NICHE[0] - 50, NICHE[1] + 6], [NICHE[0] - 50, NICHE[1] - 60], ...c.arc(NICHE[0], NICHE[1] - 60, 50, 40, PI, 2 * PI, 10), [NICHE[0] + 50, NICHE[1] + 6]], 0.4, 6), mix(C.plaster2, C.wood3, 0.3));
    ws.p(c.cut([[NICHE[0] - 60, NICHE[1] + 4], [NICHE[0] + 60, NICHE[1] + 4], [NICHE[0] + 64, NICHE[1] + 16], [NICHE[0] - 64, NICHE[1] + 16]], 0.3, 6), C.stone2);
    ws.p(c.cut([[180, GY], [180, 540], ...c.arc(230, 540, 50, 40, PI, 2 * PI, 10), [280, 540], [280, GY]], 0.5, 6), C.wood2);
    wall.add(ws.out());
    const nicheGlow = wall.add(`<circle r="90" fill="url(#halo-glow)"/>`);

    /* the lane and the pigsty on the right */
    const ground = S.layer({ par: 0.4, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(GY - 20, [3, 1], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.35)).out());
    ground.add(`<g transform="translate(${1090 + SX} ${GY + 8})">${mud(c, 360, 50)}</g>` + grass(c, { x0: -300, x1: 1900, y: GY - 16, n: 30, h: 12, color: C.olive }));
    const fenceBack = sheet();
    let posts = '';
    for (let x = 900 + SX; x <= 1300 + SX; x += 50) posts += c.cut([[x - 5, GY - 20], [x - 4, GY - 96], [x + 4, GY - 98], [x + 5, GY - 20]], 0.4, 6);
    fenceBack.p(posts, C.wood2).p(c.ribbon([[896 + SX, GY - 80], [1304 + SX, GY - 84]], 7) + c.ribbon([[896 + SX, GY - 50], [1304 + SX, GY - 52]], 7), C.wood);
    ground.add(fenceBack.out());

    /* pearls, pigs, dogs, the man */
    const act = S.layer({ par: 0.5, sh: 5 });
    const pearls = Array.from({ length: 9 }, (_, i) => ({ i, x: (S.portrait ? 950 : 990) + SX + i * 26 + c.rr(-8, 8), y: GY + 8 + c.rr(-6, 10), el: act.add(`<g>${pearl(8)}</g>`) }));
    const PIGS = (S.portrait ? [[950, 0.95], [1035, 1.05], [1110, 0.9]] : [[1030, 0.95], [1150, 1.05], [1250, 0.9]]).map(([x, s], i) => ({ i, x: x + SX, s, el: act.add(`<g>${pig(c, { col: [mix(C.roseRobe, C.blushVeil, 0.3), mix(C.roseRobe, C.clay, 0.2), C.blushVeil][i], down: i !== 1 })}</g>`) }));
    const DOGS = [[520, 0], [610, 1]].map(([x, i]) => { const el = act.add(streetDog(c, { col: [mix(C.wood3, C.dune, 0.4), mix(C.rock3, C.wood2, 0.5)][i] })); return { x, i, el, hd: el.querySelector('.hd'), jaw: el.querySelector('.jaw') }; });
    const MO = manOf(c, { robe: C.dustyBlue, mantle: C.clayMantle, hairStyle: 'wrap', veil: C.ochreRobe, beard: 'short', skin: C.skin2, belt: C.leather });
    const man = S.puppet(act.add(person(c, MO)));
    const dish = act.add(`<g>${holyDish(c)}</g>`);
    const bag = act.add(`<g>${pouch(c)}</g>`);
    const flying = Array.from({ length: 9 }, (_, i) => act.add(`<g>${pearl(8)}</g>`));
    const scrap = act.add(`<g>${rag(c, C.clayMantle, 16)}</g>`);

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(bush(c, 110, 980, 260, C.moss, C.sage) + bush(c, 1530, 990, 240, C.sage, C.moss));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 150, T, 1, 0.6);
      swing(cl, 700 + Math.sin(T * 0.1) * 20, 140, T, 1.2, 0.6, 1);

      /* v6a — the dish, the dogs, the niche */
      const come = es(t, 0.0, 0.25);
      const lower = es(t, 0.18, 0.36) * (1 - es(t, 0.46, 0.6));
      const lift = es(t, 0.48, 0.66);
      const place = es(t, 0.7, 0.86);
      // v6b: he walks to the sty, scatters the pearls, then runs from the pigs
      const walk2 = es(t, 1.02, 1.22);
      const toss = es(t, 1.2, 1.36);
      const flee = es(t, 1.62, 1.95, (u) => u);
      const mx = lerp(760, 690, come) + place * -40 + walk2 * (230 + SX) - flee * 420;
      const left = t < 1.0 || t > 1.62;
      const walking = (come > 0 && come < 1) || (walk2 > 0 && walk2 < 1) || flee > 0;
      const armF = 40 + lower * 30 + lift * 100 * (1 - place * 0.2) - place * 50 * seg(t, 0.86, 1) + toss * 80 * (1 - es(t, 1.45, 1.6)) + flee * 40;
      const armB = 20 + lift * 100 * (1 - es(t, 0.9, 1.0)) + bump(t, 1.62, 1.9) * 120;
      man.set({ x: mx, y: GY, s: 1.1, flip: left, walk: walking ? mx * 0.06 : undefined, amt: flee > 0 ? 1.6 : 1, armF, armB, head: -lift * 12 * (1 - es(t, 0.9, 1.0)) + lower * 6 + toss * 8, lean: flee > 0 ? 8 : 0, blink: blinkAt(T, 3) });
      const [hx, hy] = handAt(mx, GY, 1.1, left, armF);
      const inNiche = seg(t, 0.84, 0.86);
      pose(dish, { x: inNiche ? NICHE[0] : hx - 10, y: inNiche ? NICHE[1] + 4 : hy + 10, s: 1, o: 1 });
      pose(nicheGlow, { x: NICHE[0], y: NICHE[1] - 30, o: inNiche });
      DOGS.forEach((d) => {
        const run = es(t, 0.05 + d.i * 0.05, 0.3 + d.i * 0.05);
        const jump = bump(t, 0.4 + d.i * 0.06, 0.62 + d.i * 0.06) + bump(t, 0.7 + d.i * 0.05, 0.86 + d.i * 0.05) * 0.6;
        const x = lerp(200 - d.i * 60, d.x, run);
        pose(d.el, { x, y: GY + 4 - jump * 50, s: 1.4, r: -jump * 16, o: 1 - es(t, 1.2, 1.4) });
        const snap = time ? Math.max(0, Math.sin(T * 9 + d.i * 2)) : 0.6;
        pose(d.hd, { x: 34, y: -50, r: -jump * 12 - 6 * es(t, 0.3, 0.4) });
        pose(d.jaw, { x: 4, y: 2, r: (es(t, 0.3, 0.4) * (1 - es(t, 1.0, 1.1))) * (8 + snap * 16) });
      });

      /* v6b — the pearls into the mud, the pigs trample, turn and charge */
      pose(bag, { x: hx + 4, y: hy + 12, o: seg(t, 1.0, 1.05) * (1 - seg(t, 1.55, 1.6)) });
      flying.forEach((p, i) => {
        const k = seg(t, 1.24 + i * 0.012, 1.42 + i * 0.012);
        const P = pearls[i];
        pose(p, { x: lerp(hx + 6, P.x, k), y: lerp(hy, P.y, k) - Math.sin(k * PI) * 60, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const tr = es(t, 1.42, 1.62);
      pearls.forEach((P) => pose(P.el, { x: P.x, y: P.y + tr * 5, sy: 1 - tr * 0.35, o: seg(t, 1.41, 1.44) * (1 - tr * 0.2) }));
      PIGS.forEach((p) => {
        const trample = time ? Math.abs(Math.sin(T * 8 + p.i)) : 0.5;
        const tk = bump(t, 1.4, 1.64);
        const turn = t > 1.6 + p.i * 0.03;
        const charge = es(t, 1.64 + p.i * 0.03, 1.95, (u) => u);
        const x = lerp(p.x, p.x - 300, charge);
        pose(p.el, { x: x + (turn ? 0 : Math.sin(t * 20 + p.i) * 6 * tk), y: GY + 6 - trample * 6 * tk - (charge > 0 && charge < 1 ? Math.abs(Math.sin(charge * 18 + p.i)) * 8 : 0), s: 3.1 * p.s, sx: turn ? -1 : 1, o: 1 });
      });
      const sk = seg(t, 1.72, 2.0);
      pose(scrap, { x: mx + 40 + sk * 120, y: GY - 110 - Math.sin(sk * PI) * 60 + sk * 30, r: sk * 300, o: sk > 0 && sk < 1 ? 1 : 0 });

      S.cam.x = lerp(S.portrait ? -10 : -30, S.portrait ? 80 : 40, es(t, 0.95, 1.25));
      S.cam.z = 1.03 + bump(t, 0.3, 0.95) * (S.portrait ? 0 : 0.04);
      S.cam.y = 24;
    };
  },
};
