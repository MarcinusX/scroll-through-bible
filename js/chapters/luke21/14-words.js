// Łk 21,32–33 — back in the Temple court. "Truly I tell you, this generation will not pass away until all things are
// accomplished": a painted flat comes down with the people of this generation on it — a grandfather, parents, a youth,
// a child — and over their heads, one after another, the things He has foretold come down on threads: a fallen stone,
// a legion's standard, a comet, the cloud of His coming. "Heaven and earth will pass away, but my words will by no
// means pass away": a second flat — the sky with its sun, moon and stars over the hills of the earth: the sky rolls up
// into the top of the frame like a scroll, the earth sinks away below, the frame stands empty and dark — and in the
// middle of it a scroll of His words unrolls, glowing, and stays.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, flat, flatSky, flatHills, crowdKnot, still, stoneBlock, eagleStandard, comet, cloud, sun, moon, stars, warm, inkLine, headAt, STRING,
  es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const { GY, JX, JS } = TT;
const W = 580, H = 280, FX = 800, FY = 300;

export default {
  id: 'lk21-words',
  beats: [
    { v: 32 },
    { v: 33 },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const B = T0.bits;

    /* flat A — this generation */
    const GEN = [
      { robe: C.linen2, mantle: C.clayMantle, hair: '#ece6da', hairStyle: 'wrap', veil: C.linen, beard: 'wild', beardColor: '#ece6da', skin: C.skin3, belt: C.rope },
      { robe: C.roseRobe, mantle: C.plumRobe, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.14), hair: C.hair3, skin: C.skin2, belt: null },
      { robe: C.tealRobe, mantle: C.ochreRobe, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather },
      { robe: C.sageRobe, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin, belt: C.rope },
    ];
    const people = GEN.map((o, i) => `<g transform="translate(${-150 + i * 84} 118)">${still(c, o, { s: [0.6, 0.6, 0.64, 0.56][i], armF: i === 1 ? 20 : 0, head: -6 })}</g>`).join('') + `<g transform="translate(${-150 + 4 * 84 - 30} 118)">${still(c, { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.rope }, { s: 0.38, head: -10, armB: 40 })}</g>`;
    const innerA = flatSky(S, W, H, ['#d6dfda', '#f3e8cd']) + flatHills(c, W, 60, mix(C.hillMid, C.sage, 0.3), 10) + sheet().p(c.cut([[-W / 2 - 4, 118], [W / 2 + 4, 116], [W / 2 + 4, H / 2 + 4], [-W / 2 - 4, H / 2 + 4]], 0.5, 8), mix(C.hillNear, C.sand, 0.2)).out() + people;
    const flatA = T0.FL.add(flat(S, innerA, { w: W, h: H }));
    const ICONS = [
      `<g transform="rotate(-18)">${stoneBlock(c, 50, 32)}</g>`,
      `<g transform="scale(.2)">${eagleStandard(c, 300)}</g>`,
      `<g transform="scale(.45)">${comet(c, 160)}</g>`,
      `<g transform="scale(.5)">${cloud(c, 140)}</g>`,
    ];
    const icons = ICONS.map((m, i) => ({ i, el: B.add(`<g><path d="M0 -1600V-26" stroke="${STRING}" stroke-width="1.2"/>${m}</g>`) }));

    /* flat B — heaven and earth; the words */
    const frameB = T0.FL.add(flat(S, `<rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" fill="${mix(C.night2, C.soilDark, 0.3)}"/>`, { w: W, h: H, face: mix(C.night2, C.soilDark, 0.3) }));
    const skyId = S.id('hsky');
    S.defs(`<linearGradient id="${skyId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb8c8"/><stop offset="1" stop-color="#f1e6cb"/></linearGradient>`);
    const skyPiece = B.add(`<g><rect x="${-W / 2}" y="0" width="${W}" height="${H * 0.62}" fill="url(#${skyId})"/>${stars(c, { x0: -W / 2 + 20, x1: W / 2 - 20, y0: 14, y1: 80, n: 14 })}<g transform="translate(-180 60)">${sun(c, 26)}</g><g transform="translate(190 48)">${moon(c, 18)}</g><g transform="translate(20 90)">${cloud(c, 120)}</g></g>`);
    const earthPiece = B.add(`<g>${sheet().p(c.cut([[-W / 2, -H * 0.38], [-160, -H * 0.38 - 20], [-40, -H * 0.38 - 6], [90, -H * 0.38 - 26], [W / 2, -H * 0.38 - 8], [W / 2, 0], [-W / 2, 0]], 0.8, 8), mix(C.hillMid, C.sage, 0.3)).p(c.cut([[-W / 2, -H * 0.18], [-60, -H * 0.18 - 14], [120, -H * 0.18 - 4], [W / 2, -H * 0.18 - 16], [W / 2, 0], [-W / 2, 0]], 0.8, 8), C.hillNear).out()}</g>`);
    const SW = 240, SHh = 150;
    const glowEl = B.add(`<g>${warm(130, 0.8)}</g>`);
    const scrollEl = B.add(`<g>${sheet().p(c.cut(c.rect(-SW / 2, 0, SW, SHh), 0.5, 8), mix(C.parchment, C.halo, 0.25)).x(Array.from({ length: 6 }, (_, k) => inkLine(c, -SW / 2 + 20, SW / 2 - 20 - (k === 5 ? 70 : 0), 22 + k * 21, 2.2)).join(''), C.ochre, 'opacity=".85"').out()}</g>`);
    const rod = () => sheet().p(c.cut(c.rect(-SW / 2 - 12, -7, SW + 24, 14), 0.3, 6), C.wood2).p(c.cut(c.circ(-SW / 2 - 16, 0, 8, 10), 0.2, 3) + c.cut(c.circ(SW / 2 + 16, 0, 8, 10), 0.2, 3), C.ochre).out();
    const rodT = B.add(`<g>${rod()}</g>`), rodB = B.add(`<g>${rod()}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T, { look: es(t, 0.1, 0.4) });

      /* Jesus */
      const say = es(t, 0.02, 0.2);
      const lift = es(t, 1.55, 1.75);
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + say * 60 * (1 - lift) + lift * 80, armB: 10 + bump(t, 0.05, 0.9) * 50 + lift * 110, head: -say * 6 - lift * 6, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, 0.7 * (bump(t, 0.02, 0.9) + es(t, 1.02, 1.2)), T, { spread: 1.8 });

      /* flat A */
      const kA = es(t, 0.0, 0.22, ease.out) * (1 - es(t, 0.95, 1.12, ease.in));
      const ay = lerp(-1300, FY, kA), onA = kA > 0.002 ? 1 : 0;
      pose(flatA, { x: FX, y: ay, o: onA });
      icons.forEach((ic) => {
        const k = es(t, 0.25 + ic.i * 0.12, 0.42 + ic.i * 0.12, ease.back);
        pose(ic.el, { x: FX - 180 + ic.i * 120, y: ay - 60 + (ic.i % 2) * 18 - (1 - k) * 200, r: T ? Math.sin(T * 1.1 + ic.i) * 3 : 0, o: onA * (k > 0.02 ? 1 : 0) });
      });

      /* flat B */
      const kB = es(t, 1.02, 1.2, ease.out);
      const by = lerp(-1300, FY, kB), onB = kB > 0.002 ? 1 : 0;
      pose(frameB, { x: FX, y: by, o: onB });
      const roll = es(t, 1.22, 1.45);
      const sink = es(t, 1.25, 1.5);
      pose(skyPiece, { x: FX, y: by - H / 2, sy: Math.max(0.001, 1 - roll), o: onB * (roll < 0.99 ? 1 : 0) });
      pose(earthPiece, { x: FX, y: by + H / 2, sy: Math.max(0.001, 1 - sink), o: onB * (sink < 0.99 ? 1 : 0) });
      const un = es(t, 1.45, 1.7);
      const sy0 = by - SHh / 2;
      pose(glowEl, { x: FX, y: by, s: 0.6 + un * 0.4, o: onB * un });
      pose(rodT, { x: FX, y: sy0, o: onB * es(t, 1.4, 1.45) });
      pose(scrollEl, { x: FX, y: sy0, sy: Math.max(0.001, un), o: onB * (un > 0.002 ? 1 : 0) });
      pose(rodB, { x: FX, y: sy0 + SHh * un, o: onB * es(t, 1.4, 1.45) });

      S.cam.y = -es(t, 0.0, 0.4) * 30;
      S.cam.z = 1 + es(t, 0.0, 0.4) * 0.04;
      void seg; void fade; void crowdKnot; void tr;
    };
  },
};
