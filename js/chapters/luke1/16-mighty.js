// Łk 1,51–55 — the Magnificat goes on as dusk falls; Mary sings with open hands and the flats come down over her.
// He has shown strength with his arm — a great sweep of light crosses a stormy sky; he has scattered the proud in the
// thoughts of their hearts — three strutting men with swollen thought-towers are blown away like paper. He has put down
// the mighty from their thrones — the king slides off his high throne and his crown falls — and lifted up the lowly — a
// poor woman rises to the top of the steps in the light. He has filled the hungry with good things — bread and fruit fall
// into the empty baskets of a poor family — and sent the rich away empty — the rich man walks off with his empty purse.
// He has helped his servant Israel — the heavy load on a bowed servant's back floats up and away and he stands straight;
// as he promised to our fathers, to Abraham and his children for ever — Abraham under a sky where the stars keep coming.
import { C, person, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  MARY, ELIZABETH, ABRAHAM, HILLEVE, hillHome, homeLight, hillFront, HGY, glowDisc, rayBurst, sparkle, flat, flatSky, flatHills, fig, flatText,
  crown, throne, loaf, dropK, folk, tr, es, ease, bump, seg, PI,
} from './lib.js';
import { basket as basketCut } from '../mark8/lib.js';
import { thought } from '../mark2/lib.js';

const MX = 800, EX = 585;
const FX = 800, FY = 285, W = 360, H = 230, K = 1.1;
const X = (dx) => FX + dx * K;

export default {
  id: 'lk1-mighty',
  beats: [
    { v: 51, text: 'On przejawia moc ramienia swego,' },
    { v: 51, cont: true, text: 'rozprasza [ludzi] pyszniących się zamysłami serc swoich.' },
    { v: 52, text: 'Strąca władców z tronu,' },
    { v: 52, cont: true, text: 'a wywyższa pokornych.' },
    { v: 53, text: 'Głodnych nasyca dobrami,' },
    { v: 53, cont: true, text: 'a bogatych z niczym odprawia.' },
    { v: 54 },
    { v: 55 },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const EVE2 = ['#9d8fb6', '#e6b49e', '#f3d2b0'], DUSK = ['#5e5a8c', '#c08f98', '#e9b595'];
    const Wd = hillHome(S, EVE2);
    const mGlow = Wd.G.add(`<g>${glowDisc(170, 'halo-glow', 1)}</g>`);
    const P = Wd.P;
    const e = S.puppet(P.add(person(c, { ...ELIZABETH, pose: 'sit' })));
    const m = S.puppet(P.add(person(c, MARY)));
    const L = S.layer({ par: 0.3, sh: 6 });
    const bits = S.layer({ par: 0.3, sh: 5 });
    const cut = (o) => `<g>${person(c, { holdF: '', holdB: '', ...o })}</g>`;

    /* 1 — the strength of his arm; the proud scattered */
    const f1 = L.add(flat(S, flatSky(S, W, H, [mix(C.storm, C.indigo, 0.3), mix(C.storm, C.dusk, 0.4)]) + flatHills(c, W, 88, mix(C.hillMid, C.storm, 0.4), 6), { w: W, h: H }));
    const sweep = bits.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [150, -90], [310, -20], 24), (u) => 4 + Math.sin(u * PI) * 20)}" fill="#fff3cf" opacity=".9"/><circle cx="150" cy="-50" r="80" fill="url(#halo-glow)"/></g>`);
    const proud = [0, 1, 2].map((i) => ({ i, el: bits.add(cut({ ...folk(c, true), robe: [C.plumRobe, C.terracotta, C.teal2][i], mantle: C.sun, belt: C.sun })), th: bits.add(`<g>${thought(c, `<path d="${c.cut([[-12, 14], [-10, -14], [-4, -20], [0, -14], [4, -22], [10, -14], [12, 14]], 0.4, 3)}" fill="${C.stone2}"/>`, { w: 60, h: 56 })}</g>`) }));
    /* 2 — the mighty put down from their thrones; the lowly lifted */
    let steps = '';
    for (let i = 0; i < 4; i++) steps += c.cut(c.rect(-60 + i * 14, 110 - (i + 1) * 20, 120 - i * 28, 20), 0.3, 4);
    const f2 = L.add(flat(S, flatSky(S, W, H, [mix(C.duskViolet, C.skyVeil, 0.3), mix(C.dawn, C.cream, 0.4)]) + flatHills(c, W, 96, mix(C.sand2, C.dune, 0.3), 5)
      + `<path d="${steps}" fill="${mix(C.stone, C.sand2, 0.4)}"/><g transform="translate(0 30) scale(.5)">${throne(c)}</g>`, { w: W, h: H }));
    const king = bits.add(cut({ ...folk(c, true), robe: C.plumRobe, mantle: C.terracotta, belt: C.sun, pose: 'sit' }));
    const kCrown = bits.add(`<g>${crown(c)}</g>`);
    const lowly = bits.add(cut({ ...folk(c, false), robe: C.linen2, mantle: null, veil: C.stone }));
    const lowGlow = bits.add(`<g>${glowDisc(70, 'halo-glow', 1)}</g>`);
    /* 3 — the hungry filled; the rich sent away */
    const f3 = L.add(flat(S, flatSky(S, W, H, [mix(C.skyVeil, C.cream, 0.3), mix(C.peach, C.cream, 0.4)]) + flatHills(c, W, 96, mix(C.hillMid, C.sand, 0.35), 5)
      + fig(c, { ...folk(c, true), robe: '#b7ad9b' }, -120, 112, 0.5) + fig(c, { ...folk(c, false), robe: '#c2b6a2' }, -70, 112, 0.46) + fig(c, { ...folk(c, true), robe: C.stone2, beard: 'none' }, -30, 112, 0.3), { w: W, h: H }));
    const bask = bits.add(`<g>${basketCut(c, { w: 56, h: 34 })}</g>`);
    const food = [0, 1, 2, 3, 4, 5].map((i) => bits.add(i % 3 === 0 ? `<g>${loaf(c, 11)}</g>` : `<g>${sheet().p(c.cut(c.circ(0, 0, 7, 10), 0.3, 3), i % 3 === 1 ? C.plumRobe : C.sun).out()}</g>`));
    const rich = bits.add(cut({ ...folk(c, true), robe: C.plumRobe, mantle: C.sun, belt: C.sun, holdF: `<g transform="translate(0 6)">${sheet().p(c.cut([[-8, 0], [8, 0], [10, 10], [0, 14], [-10, 10]], 0.4, 3), C.leather).out()}</g>` }));
    /* 4 — Israel his servant helped */
    const f4 = L.add(flat(S, flatSky(S, W, H, [mix(C.skyVeil, C.halo, 0.3), mix(C.dawn, C.cream, 0.4)]) + flatHills(c, W, 96, mix(C.hillMid, C.sand, 0.35), 5)
      + `<circle cx="0" cy="-120" r="130" fill="url(#halo-glow)"/>` + flatText(120, -80, tr('Izrael', 'Israel'), 24), { w: W, h: H }));
    const bowed = bits.add(`<g>${person(c, { ...folk(c, true), robe: C.dustyBlue, holdF: '', holdB: '' }).replace('<g class="body">', '<g class="body" transform="rotate(24)">')}</g>`);
    const stand = bits.add(cut({ ...folk(c, true), robe: C.dustyBlue }));
    const load = bits.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 34, 26, 12, 0.2), 0.8, 5), C.soilDark).p(c.ribbon([[-30, -4], [30, 4]], 3), C.rope).out()}</g>`);
    /* 5 — Abraham and his children for ever */
    const f5 = L.add(flat(S, flatSky(S, W, H, [C.night2, mix(C.indigo, C.night, 0.3)]) + flatHills(c, W, 90, mix(C.indigo, C.soilDark, 0.4), 6)
      + fig(c, ABRAHAM, -60, 112, 0.66), { w: W, h: H }));
    const starSets = [0, 1, 2, 3].map((k) => { let d = ''; for (let i = 0; i < 26; i++) d += c.poly(c.star(c.rr(-170, 170), c.rr(-110, 60), c.rr(2, 4), 1, 4, 0)); return bits.add(`<g><path d="${d}" fill="${C.star}"/></g>`); });

    const flats = [f1, f2, f3, f4, f5];
    const spans = [[0, 2.1], [2, 4.1], [4, 6.1], [6, 7.1], [7, 99]];
    hillFront(S);

    return (t, time) => {
      const T = time;
      const dusk = es(t, 0, 8);
      Wd.sk.blend(EVE2, DUSK, dusk);
      Wd.dim.fade(dusk * 0.5);
      homeLight(Wd.H, { open: 0.6, lit: 0.6 + dusk * 0.4 });
      const sing = Math.max(0, Math.sin(t * PI * 2)) * 0.3;
      m.set({ x: MX, y: HGY, s: 1, flip: false, armF: 50 + sing * 30, armB: 60 + sing * 40, head: -10, blink: blinkAt(T, 3) });
      e.set({ x: EX, y: HGY, s: 0.96, flip: false, armF: 30, armB: 10, head: -8, blink: blinkAt(T, 1) });
      pose(mGlow, { x: MX, y: HGY - 130, s: 1, o: 0.9 });

      const KK = flats.map((f, i) => dropK(t, spans[i][0], spans[i][1], 0.28));
      const Y = KK.map((k) => lerp(-1500, FY, k));
      const YY = (i, dy) => Y[i] + dy * K;
      const on = (i, v = 1) => (KK[i] > 0.002 ? v : 0);
      flats.forEach((f, i) => pose(f, { x: FX, y: Y[i], s: K, o: KK[i] > 0.002 ? 1 : 0 }));

      /* v51a: the arm of his strength — a sweep of light; v51b: the proud blown away */
      const sw = es(t, 0.2, 0.7);
      pose(sweep, { x: X(-160), y: YY(0, 20), sx: K * Math.max(0.001, sw), sy: K, o: on(0, sw > 0.01 ? 1 : 0) });
      proud.forEach((p) => {
        const blow = es(t, 1.3 + p.i * 0.06, 1.95 + p.i * 0.06, ease.in);
        const px = -100 + p.i * 90;
        pose(p.el, { x: X(px + blow * (150 - p.i * 40)), y: YY(0, 108 - blow * 90), r: blow * 160, s: 0.5 * K * (1 - blow * 0.4), o: on(0, 1 - es(t, 1.9 + p.i * 0.04, 1.99 + p.i * 0.01)) });
        pose(p.th, { x: X(px + 6), y: YY(0, 20), s: K * 0.8 * (1 - blow), o: on(0, t > 0.4 ? 1 - es(t, 1.25, 1.35) : 0) });
      });

      /* v52a: the king slides off his throne; v52b: the lowly woman rises to the top */
      const fall = es(t, 2.2, 2.6, ease.in);
      pose(king, { x: X(lerp(0, 36, fall)), y: YY(1, lerp(30, 104, fall)), r: fall * 84, s: 0.5 * K, o: on(1) });
      const cf = es(t, 2.2, 2.55, ease.in);
      pose(kCrown, { x: X(lerp(2, -60, cf)), y: YY(1, lerp(-52, 96, cf)), r: cf * -200, s: 0.7 * K, o: on(1) });
      const rise = es(t, 3.1, 3.55);
      pose(lowly, { x: X(lerp(-150, 0, rise)), y: YY(1, lerp(110, 30, rise)), s: 0.46 * K, o: on(1) });
      pose(lowGlow, { x: X(0), y: YY(1, -20), s: K, o: on(1, es(t, 3.4, 3.7)) });

      /* v53a: the hungry filled; v53b: the rich sent away empty */
      pose(bask, { x: X(-70), y: YY(2, 112), s: K, o: on(2) });
      food.forEach((f, i) => { const k = es(t, 4.2 + i * 0.07, 4.5 + i * 0.07, ease.in); pose(f, { x: X(-86 + (i % 3) * 16), y: YY(2, lerp(-130, 72 - (i > 2 ? 10 : 0), k)), r: k * 90, s: K, o: on(2, t > 4.18 + i * 0.07 ? 1 : 0) }); });
      const leave = es(t, 5.1, 5.7);
      pose(rich, { x: X(80 + leave * 70), y: YY(2, 112), sx: (leave > 0.02 ? 1 : -1) * 0.5 * K, sy: 0.5 * K, o: on(2) });

      /* v54: Israel his servant — the load lifted, he stands up */
      const lift = es(t, 6.2, 6.7);
      const upright = es(t, 6.45, 6.52);
      pose(bowed, { x: X(-30), y: YY(3, 112), s: 0.5 * K, o: on(3, 1 - upright) });
      pose(stand, { x: X(-30), y: YY(3, 112), s: 0.5 * K, o: on(3, upright) });
      pose(load, { x: X(-40 + lift * 30), y: YY(3, lerp(34, -80, lift)), r: lift * 30, s: K, o: on(3, 1 - es(t, 6.85, 6.98)) });

      /* v55: Abraham and his children for ever — the stars keep coming */
      starSets.forEach((s, i) => pose(s, { x: FX, y: Y[4], s: K, o: on(4, es(t, 7.1 + i * 0.12, 7.25 + i * 0.12)) }));

      S.cam.z = 1.04;
      S.cam.y = 10;
    };
  },
};
