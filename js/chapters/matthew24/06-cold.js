// Mt 24,11–13 — a winter night on a village road that runs off to a far gate of light. People walk the road, each
// carrying a small warm heart. "Many false prophets will arise and lead many astray": masked figures with glittering
// lanterns rise by the roadside and beckon, and many turn off after them into the dark wood. "Because lawlessness
// will increase, the love of many will grow cold": a bitter wind and snow, dark knots blowing across; the hearts go
// grey with frost and the people hunch. "But the one who endures to the end will be saved": one walker, her heart
// still warm and her lamp still lit, keeps on through the snow to the gate — it opens, and the light takes her in.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, moon, stars, cypress, rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mask, addToHead, lantern, sparkle, heart, handLamp, flake, hand, along, folk, WINTERN, PI } from './lib.js';
import { darkKnot } from '../matthew9/lib.js';

const ROAD_W = [[60, 800], [300, 730], [520, 690], [760, 650], [920, 612], [1040, 568], [1110, 530]];
const GATE_W = [1126, 520];
// phone: the far end of the road and the gate of light come in from under the thread
const ROAD_P = [[60, 800], [300, 730], [520, 690], [740, 650], [880, 612], [975, 568], [1034, 530]];
const GATE_P = [1050, 520];
const OFF = [[640, 670], [540, 630], [440, 608], [330, 598], [220, 594]];   // the turning into the dark wood

export default {
  id: 'mt24-cold',
  enter: 'fly',
  beats: [
    { v: 11 },
    { v: 12 },
    { v: 13 },
  ],
  cam: { x: [-40, 60], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const ROAD = S.portrait ? ROAD_P : ROAD_W, GATE = S.portrait ? GATE_P : GATE_W;
    sky(S, WINTERN);
    const sk2 = sky(S, ['#1a1e34', '#2e3349', '#444a5e'], { name: 'sky2' });
    sk2.layer.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 380, n: 80 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, moon(c, 34), { x: 440, y: -1500, len: 700 });

    /* the far gate of light at the end of the road */
    const farL = S.layer({ par: 0.12, sh: 2 });
    const far = band(c, { y: 470, amps: [14, 6, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.night2, 0.55), x0: -1400, x1: 3000 });
    farL.add(far.markup);
    const gateL = S.layer({ par: 0.14, sh: 3 });
    const gGlow = gateL.add(`<g transform="translate(0 -1500)"><circle r="260" fill="url(#halo-glow)"/></g>`);
    const gs = sheet();
    gs.p(c.cut([[-40, 0], [-40, -80], ...c.arc(0, -80, 40, 34, PI, 2 * PI, 12), [40, -80], [40, 0], [28, 0], [28, -78], ...c.arc(0, -78, 28, 22, 2 * PI, PI, 10), [-28, -78], [-28, 0]], 0.5, 6), mix(C.stone, C.night2, 0.3));
    gateL.add(`<g transform="translate(${GATE[0]} ${GATE[1]})"><path d="${c.cut([[-28, 0], [-28, -78], ...c.arc(0, -78, 28, 22, PI, 2 * PI, 10), [28, -78], [28, 0]], 0.3, 5)}" fill="${C.lampGlow}"/>${gs.out()}</g>`);
    const gRays = gateL.add(`<g transform="translate(0 -1500)"><path d="${Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * PI * 2; return c.poly([[Math.cos(a - 0.03) * 40, Math.sin(a - 0.03) * 40], [Math.cos(a - 0.08) * 380, Math.sin(a - 0.08) * 380], [Math.cos(a + 0.08) * 380, Math.sin(a + 0.08) * 380], [Math.cos(a + 0.03) * 40, Math.sin(a + 0.03) * 40]]); }).join('')}" fill="#fff3cf" opacity=".1"/></g>`);
    const door = gateL.add(`<g transform="translate(0 -1500)">${sheet().p(c.cut(c.rect(0, -96, 56, 96), 0.3, 5), mix(C.wood, C.night2, 0.35)).x(c.ribbon([[18, -90], [18, -4]], 1.4) + c.ribbon([[38, -90], [38, -4]], 1.4), mix(C.wood2, C.night2, 0.4), 'opacity=".6"').out()}</g>`);

    /* the village and the wood */
    const midL = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 540, amps: [16, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.night2, 0.5), trees: 10, treeColor: mix(C.moss2, C.night2, 0.5), treeH: 22, x0: -1400, x1: 3000 });
    midL.add(h2.markup + town(c, { x: 760, y: h2.fn(760) + 8, n: 7, spread: 300, sc: 0.62, wall: mix(C.plaster, C.night2, 0.45), shadow: mix(C.plaster2, C.night2, 0.5), lit: true }));
    const woodL = S.layer({ par: 0.34, sh: 3 });
    let wood = '';
    for (let i = 0; i < 14; i++) wood += cypress(c, -60 + i * 42 + c.rr(-10, 10), 606 + c.rr(-10, 10), c.rr(150, 240), mix(C.moss2, C.night2, 0.62));
    woodL.add(wood);

    /* the snowy ground and the road */
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(600, [6, 2], [700, 170]);
    const snowCol = mix('#e9edf0', C.skyBlue2, 0.35);
    G.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(snowCol, C.night2, 0.25)).out());
    G.add(sheet().p(c.ribbon(ROAD, (u) => 110 - u * 90), mix(C.sand2, C.night2, 0.35)).p(c.ribbon(OFF, (u) => 50 - u * 30), mix(C.sand2, C.night2, 0.5)).out());
    let drifts = '';
    for (let i = 0; i < 20; i++) { const x = c.rr(-400, 2000), y = c.rr(620, 1000); drifts += c.cut(c.blob(x, y, c.rr(30, 80), c.rr(5, 10), 10, 0.2), 0.5, 5); }
    G.add(sheet().x(drifts, '#f4f7fa', 'opacity=".35"').out() + rock(c, 1300, 700, 120, 40, mix(C.rock2, C.night2, 0.3)));

    /* the people on the road, each with a little heart */
    const P = S.layer({ par: 0.45, sh: 5 });
    const WALK = [
      { u0: 0.3, off: 1 }, { u0: 0.35, off: 1 }, { u0: 0.4, off: 0 }, { u0: 0.45, off: 1 }, { u0: 0.51, off: 1 }, { u0: 0.57, off: 0 }, { u0: 0.63, off: 0 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...folk(c), mantle: c.pick([C.stone, C.dustyBlue, C.clayMantle]) }))) }));
    const hearts = WALK.map((m) => ({ warm: P.add(`<g transform="translate(0 -1500)">${heart(c, 16)}</g>`), cold: P.add(`<g transform="translate(0 -1500)">${heart(c, 16, mix(C.skyVeil, C.storm, 0.55)).replace('url(#warm-glow)', 'none')}${`<path d="${c.poly(c.star(-4, -4, 7, 1.6, 6, 0)) + c.poly(c.star(5, 2, 5, 1.2, 6, 0.4))}" fill="#f4f7fa"/>`}</g>`) }));
    /* the one who endures: a woman with a lamp */
    const ENDURE = { robe: C.roseRobe, mantle: C.clayMantle, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin2, belt: C.rope };
    const lone = S.puppet(P.add(person(c, { ...ENDURE, holdB: `<g transform="translate(-4 4)">${handLamp(c, { glowR: 130 })}</g>` })));
    const loneHeart = P.add(`<g transform="translate(0 -1500)">${heart(c, 10)}</g>`);
    const loneFlame = lone.el.querySelector('.flame');

    /* false prophets with glittering lanterns */
    const PROPH = [[C.plumRobe, C.sun, S.portrait ? 680 : 600, 640], [C.indigo, C.halo, S.portrait ? 580 : 486, 620]].map(([robe, gold, x, y], i) => ({
      i, x, y, p: S.puppet(P.add(addToHead(person(c, { robe, mantle: gold, hairStyle: 'wrap', veil: robe, veil2: gold, beard: 'none', skin: C.skin2, belt: gold, holdF: `<g transform="translate(0 2)">${lantern(c, { col: gold })}</g>` }), `<g transform="translate(6 0)">${mask(c, { col: gold, r: 22, stick: false })}</g>`))),
      bursts: [0, 1, 2].map((k) => P.add(`<g transform="translate(0 -1500)">${sparkle(c, 13, k % 2 ? C.halo : C.star)}</g>`)),
    }));

    /* the cold wind: snow and dark knots (sheets that slide) */
    const snow = S.layer({ par: 0.6, sh: 1, flat: true, pad: 400 });
    let fl = '';
    for (let i = 0; i < 360; i++) fl += `<g transform="translate(${c.rr(-1400, 3000).toFixed(0)} ${c.rr(-900, 1700).toFixed(0)}) rotate(${c.rr(0, 60).toFixed(0)}) scale(${c.rr(0.6, 1.3).toFixed(2)})">${flake(c, 6)}</g>`;
    snow.add(fl);
    const knots = S.layer({ par: 0.5, sh: 3, pad: 600 });
    knots.add(Array.from({ length: 9 }, (_, i) => `<g transform="translate(${(c.rr(-300, 1900)).toFixed(0)} ${c.rr(200, 560).toFixed(0)}) scale(${c.rr(0.6, 1.1).toFixed(2)})">${darkKnot(c, 20)}</g>`).join(''));

    return (t, time) => {
      const T = time;
      pose(moonEl, { x: S.portrait ? 560 : 440, y: 150, r: Math.sin(T * 0.6) });   // phone: the moon hangs inside the screen, not half off its left edge

      /* v11 — prophets rise, beckon; many turn off after them */
      const rise = (i) => es(t, 0.1 + i * 0.12, 0.45 + i * 0.12, ease.out);
      const lead = es(t, 0.55, 0.95);
      PROPH.forEach((m) => {
        const up = rise(m.i);
        const x = m.x - lead * 90, y = m.y - lead * 12;
        m.p.set({ x, y: y + (1 - up) * 60, s: 0.82, flip: lead > 0.02, o: Math.min(1, up * 3) * (1 - es(t, 0.95, 1.2)), walk: lead > 0 && lead < 1 ? x * 0.06 : undefined, armB: 40 + up * 60 + Math.sin(T * 3 + m.i) * 12 * up, armF: 70, blink: blinkAt(T, m.i + 3) });
        m.bursts.forEach((b, j) => {
          const ph = T ? (T * 0.9 + j / 3 + m.i * 0.2) % 1 : (j + 0.5) / 3;
          pose(b, { x: x + (lead > 0.02 ? -1 : 1) * (40 + j * 14), y: y - 150 - ph * 50 - j * 10, s: (0.4 + ph) * up * (1 - es(t, 0.95, 1.2)), r: T * 60 + j * 30, o: up * (1 - ph) });
        });
      });

      /* v12 — the wind and the snow, the hearts go cold */
      const cold = es(t, 1.05, 1.6);
      snow.fade(cold);
      snow.shift(T ? Math.sin(T * 0.4) * 30 - cold * 60 : 0, T ? ((T * 70) % 600) - 300 : 0);
      knots.fade(bump(t, 1.05, 2.3) * 0.9);
      knots.shift(lerp(-500, 500, seg(t, 1.0, 2.2)) + (T ? Math.sin(T * 0.8) * 20 : 0), 0);
      sk2.layer.fade(cold * 0.7);
      starL.fade(1 - cold * 0.7);

      WALK.forEach((m, i) => {
        let u = m.u0 + es(t, -0.2, 0.5) * 0.05, pt = along(ROAD, u), walking = t < 0.5, dir = 1, gone = 0;
        if (m.off) {
          const w = es(t, 0.6 + i * 0.03, 1.0 + i * 0.03);
          if (w > 0) { const q = along(OFF, Math.min(1, w * 1.1)); const k = Math.min(1, w * 3); pt = [lerp(pt[0], q[0], k), lerp(pt[1], q[1], k)]; dir = -1; walking = w < 1; gone = es(t, 0.9 + i * 0.03, 1.1 + i * 0.03); }
        }
        const hunch = cold * (m.off ? 0 : 1);
        const s = Math.max(0.5, Math.min(0.95, (pt[1] - 470) / 280));
        const flip = dir < 0;
        const aF = 55 - hunch * 15;
        m.p.set({ x: pt[0], y: pt[1], s, flip, o: 1 - gone, walk: walking ? pt[0] * 0.07 : undefined, armF: aF, head: hunch * 16, lean: hunch * 8, blink: blinkAt(T, m.seed) });
        const [hx, hy] = hand(pt[0], pt[1], s, flip, aF, hunch * 8);
        const ck = m.off ? 0 : es(t, 1.2 + i * 0.06, 1.55 + i * 0.06);
        pose(hearts[i].warm, { x: hx, y: hy - 12 * s, s: s * 1.1, o: (1 - gone) * (1 - ck) * (1 - es(t, 2.05, 2.3) * 0.4) });
        pose(hearts[i].cold, { x: hx, y: hy - 12 * s, s: s * 1.1, o: (1 - gone) * ck * (1 - es(t, 2.05, 2.3) * 0.4) });
      });

      /* v13 — she walks on through the snow to the gate; it opens; the light takes her in */
      const w = seg(t, 1.05, 2.72);
      const [lx, ly] = along(ROAD, lerp(0.02, 0.985, ease.sine(w)));
      const ls = Math.max(0.46, Math.min(1.02, (ly - 470) / 280));
      const inside = es(t, 2.7, 2.9);
      const aB = 90;
      lone.set({ x: lx, y: ly, s: ls, o: es(t, 0.95, 1.1) * (1 - inside), walk: w > 0 && w < 1 ? lx * 0.07 : undefined, amt: 0.8, armB: aB, armF: 50, lean: -3 * cold * (1 - es(t, 2.0, 2.4)), head: -4, blink: blinkAt(T, 5) });
      pose(loneFlame, { x: 27, y: -12, sy: 1 + (T ? Math.sin(T * 7) * 0.1 : 0) });
      const [hx, hy] = hand(lx, ly, ls, false, 50);
      pose(loneHeart, { x: hx, y: hy - 12 * ls, s: ls * 1.2, o: es(t, 0.95, 1.1) * (1 - inside) });
      const open = es(t, 2.2, 2.6);
      pose(door, { x: GATE[0] - 28, y: GATE[1], sx: Math.max(0.05, 1 - open), o: 1 });
      pose(gGlow, { x: GATE[0], y: GATE[1] - 40, s: 0.5 + open * 1.1, o: 0.35 + open * 0.65 });
      pose(gRays, { x: GATE[0], y: GATE[1] - 50, r: T * 2, s: 0.35 + open * 0.55, o: open });

      S.cam.x = es(t, 1.8, 2.6) * 50;
      S.cam.z = 1 + es(t, 1.8, 2.6) * 0.06;
      S.cam.y = -es(t, 1.8, 2.6) * 20;
    };
  },
};
