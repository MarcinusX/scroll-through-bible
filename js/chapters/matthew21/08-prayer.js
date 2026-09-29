// Mt 21,13–14 — in the cleared court: "It is written: My house shall be called a house of prayer" — the prophet's
// scroll comes down and worshippers kneel before the gleaming sanctuary; "but you make it a den of robbers" — a dark
// cave drops over the wrecked market, eyes glinting inside. Then the blind and the lame come to Him in the Temple and
// He heals them: the blind man's band falls and he looks up into the light, the lame man flings his crutch away.
import { C, person, CAST, blinkAt, pose, lerp, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, courtFront, changerTable, coin, cage, townsfolk, TWELVE_O, headAt, hand, hang2, psalmScroll, shadowPerson, crutch, blindBand, addToHead, BLIND, LAME, sparkle, spark, folk4, tr, DAY, PI } from './lib.js';

const FLOOR = 676;
const JX = 800;

/** a dark cave mouth hung as a painted flat, with the shadows of robbers inside */
function cave(c) {
  const s = sheet();
  const W = 460, H = 330;
  const outer = [[-W / 2, 0], [-W / 2 + 20, -H * 0.5], [-W / 2 + 70, -H * 0.86], [-W * 0.12, -H], [W * 0.18, -H * 0.97], [W / 2 - 60, -H * 0.8], [W / 2 - 16, -H * 0.46], [W / 2, 0]];
  const inner = [[-W / 2 + 70, 0], [-W / 2 + 90, -H * 0.46], [-W * 0.2, -H * 0.74], [W * 0.14, -H * 0.76], [W / 2 - 100, -H * 0.5], [W / 2 - 76, 0]];
  s.p(c.cut(outer, 3, 12) + c.hole(inner, 2, 10), mix(C.rock3, C.storm2, 0.45));
  let cr = '';
  for (let i = 0; i < 10; i++) { const x = c.rr(-W / 2 + 10, W / 2 - 10), y = c.rr(-H + 30, -20); cr += c.ribbon([[x, y], [x + c.rr(-20, 20), y + c.rr(10, 30)]], 2); }
  s.x(cr, shade(C.storm2, -0.2), 'opacity=".6"');
  const back = sheet().p(c.cut(inner, 2, 10), mix(C.night2, C.soilDark, 0.4)).out();
  return { back, rim: s.out() };
}

export default {
  id: 'mt21-prayer',
  beats: [
    { v: 13, text: 'I rzekł do nich: «Napisane jest: Mój dom ma być domem modlitwy,' },
    { v: 13, cont: true, text: 'a wy czynicie z niego jaskinię zbójców».' },
    { v: 14 },
  ],
  cam: { x: [-80, 230], y: [-60, 40], z: [0.95, 1.12] },
  build(S) {
    const c = S.c;
    const { sunEl, cl1 } = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 150] });
    const sGlow = S.layer({ par: 0.16, sh: 1, flat: true }).add(`<g><circle r="300" fill="url(#halo-glow)"/></g>`);

    /* ---------- the wrecked market on the right ---------- */
    const wreck = S.layer({ par: 0.44, sh: 4 });
    wreck.add(`<g transform="translate(1180 ${FLOOR - 6}) rotate(94) translate(-75 0)">${changerTable(c, 150)}</g><g transform="translate(1290 ${FLOOR - 24}) rotate(-70)">${cage(c, 60, 52)}</g>`);
    let cs = '';
    for (let i = 0; i < 9; i++) cs += `<g transform="translate(${1060 + i * 34 + c.rr(-10, 10)} ${FLOOR + c.rr(0, 30)}) scale(1 .5)">${coin(c, 7)}</g>`;
    wreck.add(cs);
    // the den of robbers: a cave that comes down over it
    const cv = cave(c);
    const caveL = S.layer({ par: 0.46, sh: 6 });
    const robbers = [0, 1, 2].map((i) => shadowPerson(c, townsfolk(c, { man: true, hairStyle: i === 1 ? 'wrap' : 'short', veil: C.stone }), '#2b2533'));
    const eyes = (x, y) => `<g class="eyes"><circle cx="${x}" cy="${y}" r="2.6" fill="${C.lampFlame}"/><circle cx="${x + 9}" cy="${y}" r="2.4" fill="${C.lampFlame}"/></g>`;
    const caveM = `${cv.back}${robbers.map((r, i) => `<g transform="translate(${-100 + i * 90} 4) scale(${0.62 + (i % 2) * 0.08})${i === 2 ? ' scale(-1 1)' : ''}">${r}</g>${eyes(-96 + i * 90, -100 - (i % 2) * 12)}`).join('')}<g transform="translate(20 -20)">${sheet().p(c.cut(c.blob(0, 0, 26, 20, 10, 0.2), 0.6, 4), C.wood3).p(c.ribbon([[-10, -18], [10, -18]], 5), C.rope).out()}${[0, 1, 2].map((k) => `<g transform="translate(${-20 + k * 16} 10)">${coin(c, 6)}</g>`).join('')}</g>${cv.rim}`;
    const caveEl = caveL.add(`<g>${hang2(caveM, 180, 900)}</g>`);
    const eyeEls = Array.from(caveEl.querySelectorAll('.eyes'));

    /* ---------- worshippers, the disciples, the blind and the lame ---------- */
    const P = S.layer({ par: 0.48, sh: 4 });
    const PRAY = [[560, 0], [650, 1], [960, 2], [1050, 3]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...folk4(c, i % 2 === 0), pose: 'kneel' }))) }));
    const DIS = [0, 2, 1, 3].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, TWELVE_O[k]))) }));
    const L = S.layer({ par: 0.5, sh: 5 });
    const blind = S.puppet(L.add(addToHead(person(c, { ...BLIND, eyes: 'closed', holdF: `<g transform="scale(.6)">${crutch(c).replace(C.wood2, C.wood3)}</g>` }), blindBand(c))));
    const seen = S.puppet(L.add(person(c, { ...BLIND })));
    const bandEl = L.add(`<g>${sheet().p(c.ribbon([[-20, 0], [20, 0]], 7), C.stone2).out()}</g>`);
    const lame = S.puppet(L.add(person(c, { ...LAME, holdF: `<g transform="scale(.56)">${crutch(c)}</g>` })));
    const leap = S.puppet(L.add(person(c, { ...LAME })));
    const crutchEl = L.add(`<g><g transform="translate(0 -70)">${crutch(c)}</g></g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const scrollEl = fx.add(`<g>${hang2(psalmScroll(c, tr('Mój dom ma być|domem modlitwy', 'My house shall be called|a house of prayer'), { w: 320, size: 22 }), 150, 800)}</g>`);
    const heals = [0, 1].map(() => fx.add(`<g>${spark(c, 14)}</g>`));
    const stars = [0, 1, 2, 3, 4, 5].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));
    courtFront(S);
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2a2656"/>`);

    return (t, time) => {
      const T = time;
      const den = es(t, 1.05, 1.35) * (1 - es(t, 1.9, 2.1));
      tint.fade(den * 0.16);
      swing(sunEl, 1230, 150, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v13a — "my house shall be called a house of prayer": the scroll, the worshippers */
      const sd = es(t, 0.1, 0.4, ease.back) * (1 - es(t, 0.95, 1.15));
      swing(scrollEl, 800, 150 - (1 - sd) * 700, T, 0.8, 0.7);
      const prayK = es(t, 0.3, 0.7) * (1 - den * 0.8) * (1 - es(t, 1.95, 2.1));
      pose(sGlow, { x: 800, y: 400, s: 0.8 + prayK * 0.3, o: prayK * 0.8 });
      PRAY.forEach((n) => {
        const k = es(t, 0.25 + n.i * 0.06, 0.6 + n.i * 0.06, ease.out);
        const x = lerp(n.x < 800 ? n.x - 300 : n.x + 300, n.x, k);
        n.p.set({ x, y: FLOOR - 16 - (n.i % 2) * 8, s: 0.86, flip: n.x > 800, o: seg(t, 0.25 + n.i * 0.06, 0.32 + n.i * 0.06) * (1 - es(t, 0.95, 1.15)), armB: 140 * es(t, 0.55, 0.8), armF: 90 * es(t, 0.55, 0.8), head: -14 * es(t, 0.55, 0.8), blink: blinkAt(T, n.seed) });
      });
      /* v13b — the den of robbers comes down over the wrecked market */
      swing(caveEl, 1150, FLOOR + 4 - (1 - es(t, 1.05, 1.35, ease.out)) * 900 - es(t, 1.9, 2.1, ease.in) * 900, T, 0.5, 0.7);
      eyeEls.forEach((e) => fade(e, den * (0.6 + 0.4 * Math.abs(Math.sin(T * 1.3)))));

      /* v14 — the blind and the lame come to Him, and He heals them */
      const bIn = es(t, 2.0, 2.35, ease.out), lIn = es(t, 2.02, 2.38, ease.out);
      const touch = es(t, 2.36, 2.46);
      const healed = seg(t, 2.46, 2.52);
      const bx = lerp(1300, 930, bIn), lx = lerp(260, 650, lIn);
      const bWalk = bIn > 0 && bIn < 1, lWalk = lIn > 0 && lIn < 1;
      const joy = es(t, 2.52, 2.7);
      blind.set({ x: bx, y: FLOOR + 6, s: 0.96, flip: true, walk: bWalk ? bx * 0.04 : undefined, armF: 30, armB: 70, head: 6, o: seg(t, 1.98, 2.02) * (1 - healed), blink: 0 });
      seen.set({ x: bx, y: FLOOR + 6, s: 0.96, flip: true, armF: 60 + joy * 40, armB: joy * 150, head: -joy * 18, o: healed, blink: blinkAt(T, 3) });
      const [bhx, bhy] = headAt(bx, FLOOR + 6, 0.96, true);
      const fall = es(t, 2.5, 2.75, ease.in);
      pose(bandEl, { x: bhx + 2, y: lerp(bhy - 4, FLOOR + 10, fall), r: fall * 70, o: healed * (1 - es(t, 2.9, 3)) });
      const hop = Math.abs(Math.sin((t - 2.5) * 12)) * 20 * es(t, 2.52, 2.6);
      lame.set({ x: lx, y: FLOOR + 10, s: 0.96, walk: lWalk ? lx * 0.03 : undefined, amt: 0.6, armF: 20, lean: 6, head: 4, o: seg(t, 1.98, 2.02) * (1 - healed), blink: blinkAt(T, 4) });
      leap.set({ x: lx, y: FLOOR + 10 - hop, s: 0.96, armF: 60 + joy * 60, armB: joy * 140, head: -joy * 10, o: healed, blink: blinkAt(T, 4) });
      // the crutch flies away from the healed man's hand and clatters to the floor
      const toss = es(t, 2.5, 2.9);
      const [chx, chy] = hand(lx, FLOOR + 10, 0.96, false, 20);
      pose(crutchEl, { x: lerp(chx, lx - 140, toss), y: lerp(chy, FLOOR - 20, toss) - Math.sin(toss * PI) * 150, r: toss * -250, s: 0.56, o: healed });
      heals.forEach((h, i) => {
        const [x, y] = i ? [bhx, bhy] : headAt(lx, FLOOR + 10, 0.96, false);
        const k = bump(t, 2.42, 2.8);
        pose(h, { x, y: y - 10, s: k * 1.5 + 0.001, r: t * 90, o: k });
      });
      stars.forEach((st, i) => {
        const k = ((T * 0.3 + i / 6) % 1);
        const base = i % 2 ? [bx, FLOOR - 200] : [lx, FLOOR - 200];
        pose(st, { x: base[0] + Math.cos(i * 2.1) * 60, y: base[1] - k * 80, s: 0.8, r: T * 40, o: joy * Math.sin(k * PI) });
      });

      const reach = touch * (1 - es(t, 2.55, 2.7));
      const teach = es(t, 0.05, 0.3) * (1 - es(t, 1.9, 2.05));
      jesus.set({ x: JX, y: FLOOR, s: 1.04, armF: teach * 50 + bump(t, 1.1, 1.9) * 80 + reach * 80 + joy * 20, armB: teach * 30 + reach * 130 + joy * 20, head: -prayK * 6 + reach * 4, blink: blinkAt(T) });
      DIS.forEach((d) => { const x = 460 - d.i * 56 + (d.i % 2) * 10; d.p.set({ x: x - es(t, 1.9, 2.2) * 200, y: FLOOR - 26 + (d.i % 2) * 8, s: 0.84, head: -prayK * 4 - joy * 8, armF: joy * (d.i % 2 ? 60 : 0), blink: blinkAt(T, d.seed) }); });

      S.cam.x = es(t, 1.0, 1.3) * 90 * (1 - es(t, 1.9, 2.2)) - es(t, 2.0, 2.3) * 10;
      if (S.portrait) S.cam.x = es(t, 1.0, 1.3) * 220 * (1 - es(t, 1.9, 2.2));
      S.cam.z = 1.02 - sd * 0.04 + es(t, 2.1, 2.4) * 0.06;
      S.cam.y = -sd * 40 + es(t, 2.1, 2.4) * 20;
    };
  },
};
