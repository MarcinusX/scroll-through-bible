// J 11,7–8 — morning after the two days. Jesus rises from His stone and the disciples gather: "Let us go to Judea
// again!" — He points west, across the river, to the far hills where Jerusalem stands; a signpost drops and the city
// glows. The disciples crowd in, alarmed; Peter throws up his hands. "Rabbi, they were just trying to stone You!" — a
// sepia plate recalls Solomon's Porch: dark shadow-figures lifting stones against a small ring of light.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { shadowPerson } from '../mark3/lib.js';
import { portico } from '../mark11/lib.js';
import { jordanSet, DAY, DAWN, DISC, signpost, framed, question, hang2, strip, vis, kf, moving, pose, sheet, shade, mix, lerp, tr, PI } from './lib.js';

const F = 700;

export default {
  id: 'j11-judea',
  beats: [
    { v: 7, text: 'Dopiero potem powiedział do swoich uczniów:' },
    { v: 7, cont: true, text: '«Chodźmy znów do Judei!»' },
    { v: 8, text: 'Rzekli do Niego uczniowie:' },
    { v: 8, cont: true, text: '«Rabbi, dopiero co Żydzi usiłowali Cię ukamienować i znów tam idziesz?»' },
  ],
  cam: { x: [-80, 40], y: [-80, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = jordanSet(S, { skyCols: DAWN, sunAt: [1250, 300] });
    const cityGlow = S.layer({ par: 0.08, sh: 0, flat: true }).add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/></g>`);
    const A = S.layer({ par: 0.52, sh: 5 });
    // peter, andrew, james, john, matthew, thomas: from (their places) → around Jesus
    const PL = [[1000, 900, 1], [520, 610, 0], [1150, 1080, 1], [1075, 990, 1], [440, 470, 0], [590, 540, 0]];
    const disc = DISC.map((o, i) => ({ i, x0: PL[i][0], x1: PL[i][1], flip: !!PL[i][2], p: S.puppet(A.add(person(c, o))) }));
    const seat = A.add(`<g><path d="${c.cut(c.blob(0, -18, 40, 20, 12, 0.1), 0.8, 5)}" fill="${C.rock2}"/></g>`);
    const jSit = S.puppet(A.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    set.front();

    const X = S.layer({ par: 0.56, sh: 6 });
    const post = X.add(`<g>${signpost(c, tr('Judea', 'Judea'), { size: 26, dir: -1 })}</g>`);
    // the plate: Solomon's Porch, stones lifted
    const PW = 440, PH = 250;
    const SEP = mix(C.parchment, C.dune, 0.4), ink = mix(C.soilDark, C.dune, 0.25);
    let figs = '', stones = '';
    [[-150, 0], [-80, 1], [90, 1], [160, 0]].forEach(([x, f], i) => {
      const m = shadowPerson(c, { hairStyle: i % 2 ? 'wrap' : 'short', beard: 'full', pose: 'stand' }, ink).replace('class="armFr"', 'class="armFr" transform="rotate(-150)"').replace('class="armBr"', 'class="armBr" transform="rotate(-160)"');
      figs += `<g transform="translate(${x} ${PH / 2 - 26}) scale(${f ? -0.62 : 0.62} .62)">${m}</g>`;
      const sx = f ? -1 : 1;
      stones += c.cut(c.blob(x + sx * 34 * 0.62, PH / 2 - 26 - 196 * 0.62, 10, 8, 8, 0.2), 0.6, 4);
    });
    const inner = `<rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}" fill="${SEP}"/>` +
      `<g transform="translate(0 ${PH / 2 - 20})">${portico(c, -PW / 2 - 20, PW / 2 + 20, 0, 190, { col: mix(C.stone, C.dune, 0.35), back: mix(C.plaster2, C.dune, 0.4), roof: mix(C.roof, C.dune, 0.4) })}</g>` +
      `<rect x="${-PW / 2}" y="${PH / 2 - 26}" width="${PW}" height="30" fill="${mix(C.sand2, C.dune, 0.4)}"/>` +
      `<g transform="translate(0 ${PH / 2 - 70})"><circle r="46" fill="url(#halo-glow)"/><circle r="15" fill="${C.halo}"/></g>` + figs + `<path d="${stones}" fill="${mix(C.rock3, C.dune, 0.2)}"/>`;
    const plate = X.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, k: 'stones' })}</g>`);
    const cap = X.add(`<g>${strip(c, tr('krużganek Salomona', "Solomon's Porch"), { size: 16 })}</g>`);
    const q = X.add(`<g>${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      set.sk.blend(DAWN, DAY, es(t, 0, 1.2));
      pose(set.sunEl, { x: 1250, y: lerp(300, 180, es(t, 0, 1.5)), r: Math.sin(T * 0.6) * 1.5 });
      pose(set.cl, { x: 700 + Math.sin(T * 0.1) * 20, y: 150, r: 0 });

      /* v7a — Jesus rises; the disciples gather */
      const up = seg(t, 0.35, 0.42);
      jSit.set({ x: 820, y: F - 8, s: 1.04, flip: true, armF: 30, head: 4, blink: blinkAt(T, 1), o: 1 - up });
      pose(seat, { x: 820, y: F + 10 });
      const point = es(t, 1.05, 1.35) * (1 - es(t, 2.1, 2.4));
      const calm = es(t, 3.3, 3.7);
      jesus.set({ x: 800, y: F + 12, s: 1.04, flip: true, armF: 20 + point * 70 + calm * 30, armB: 10 + calm * 20, head: -point * 4 + es(t, 2.1, 2.4) * 4, blink: blinkAt(T, 1), o: up });

      disc.forEach((d) => {
        const K = [[0.3 + d.i * 0.05, d.x0], [0.9 + d.i * 0.05, d.x1]];
        const x = kf(t, K);
        const alarm = es(t, 2.05 + (d.i % 3) * 0.08, 2.35 + (d.i % 3) * 0.08) * (1 - es(t, 3.6, 3.95));
        const toJ = d.x1 < 800;
        const fl = toJ ? (t > 1.2 && t < 2.0 ? true : false) : true;
        const isPeter = d.i === 0;
        d.p.set({ x: x + alarm * (toJ ? 18 : -18), y: F + 14 + (d.i % 2) * 6, s: 0.94, flip: fl, walk: moving(t, K) ? x * 0.1 : undefined, armF: 10 + alarm * (isPeter ? 80 : 50), armB: 6 + alarm * (isPeter ? 140 : 40), head: alarm * -6 + (t > 1.2 && t < 2.0 ? -4 : 0), lean: alarm * (toJ ? -4 : 4), blink: blinkAt(T, d.i + 5) });
      });

      /* v7b — to Judea: the signpost, the far city glows */
      const pk = es(t, 1.1, 1.4, ease.back) * (1 - es(t, 2.2, 2.45));
      vis(post, { x: 560, y: 520 - (1 - pk) * 560, r: Math.sin(T * 0.7) * 1.2, o: pk > 0.01 ? 1 : 0 });
      pose(cityGlow, { x: 470, y: 380, s: 0.8 + Math.sin(T * 1.5) * 0.05, o: es(t, 1.2, 1.5) * (1 - es(t, 2.3, 2.6)) });

      /* v8b — the memory of the stones */
      const pl = es(t, 3.0, 3.35, ease.out) * (1 - es(t, 3.95, 4.2));
      vis(plate, { x: 800, y: 290 - (1 - pl) * 600, r: Math.sin(T * 0.6) * 0.6, o: pl > 0.01 ? 1 : 0 });
      vis(cap, { x: 800, y: 290 + PH / 2 + 26 - (1 - pl) * 600, o: pl > 0.01 ? es(t, 3.3, 3.45) : 0 });
      const qk = es(t, 3.4, 3.6, ease.back) * (1 - es(t, 3.95, 4.1));
      vis(q, { x: 930, y: 440 + Math.sin(T * 2) * 3, s: qk * 1.4, o: qk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 20], [1, 0], [1.5, -60], [2.2, 0], [3, 0], [4, 0]]);
      S.cam.y = kf(t, [[0, 10], [1, 0], [2, 10], [3, -60], [4, -60]]);
      S.cam.z = kf(t, [[0, 1.06], [1, 1.02], [2, 1.08], [3, 1.0], [4, 1.02]]);
    };
  },
};
