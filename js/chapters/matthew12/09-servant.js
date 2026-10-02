// Mt 12,17–19 — the prophecy of the Servant. Evening light over the hills at the edge of a town: on a rock to the
// left stands Isaiah of old, faded like an old picture, unrolling his scroll, and his words float across as golden
// slips to Jesus, who stands quietly in the middle. "Behold my servant, my beloved": light pours down on Him from
// above (no figure — only light) and a golden word hangs in it. "I will put my Spirit on Him": the dove comes down
// and rests over Him, and on the far hills the peoples of every land appear, turning to Him, while golden scales —
// justice — hang shining. "He will not quarrel or cry out": in the street to the right two men shout at each other,
// jagged bubbles flying; Jesus only stands, hands at rest, and speaks no word in the streets.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, house, olive, cypress, rock, grass, cloud, sun } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { ISAIAH, WARM, GOLDEN, scrollOpen, dove1, flapWings, handAt, headAt, kf, manOf, shout, bang, nationsMarkup, scalesParts, poseScales, rayBurst, hungWord, glow, sparkle, tr, PI } from './lib.js';

const Y = 700;
const JX = 800;

export default {
  id: 'mt12-servant',
  enter: 'fly',
  beats: [
    { v: 17 },
    { v: 18, text: 'Oto mój Sługa; którego wybrałem, Umiłowany mój, w którym moje serce ma upodobanie.' },
    { v: 18, cont: true, text: 'Położę ducha mojego na Nim, a On zapowie prawo narodom.' },
    { v: 19 },
  ],
  cam: { x: [-30, 40], y: [-20, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const IX = P ? 545 : 470;      // Isaiah on his rock (phone: inside the screen)
    sky(S, GOLDEN, { rise: 0 });
    const hangL = S.layer({ par: 0.05, sh: 5, rise: 0 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: C.sunDeep, disc: '#f0b060', inner: '#f5ca8a' }), { x: S.portrait ? 1060 : 1240, y: 250, len: 800 });
    const cl = hanging(hangL, cloud(c, 170, C.cream, C.peach), { x: 1010, y: 190, len: 800 });
    const far = S.layer({ par: 0.1, sh: 2 });
    const fb = hillsWith(c, { y: 470, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.2), trees: 12, treeColor: mix(C.sage2, C.duskViolet, 0.2), treeH: 18 });
    far.add(fb.markup);
    /* the peoples of the nations on the far hills (sprites, hidden until v18b) */
    const natL = S.layer({ par: 0.16, sh: 3 });
    const NAT = [[400, 'mt12-nat-a', false], [640, 'mt12-nat-b', false]].map(([x, seed, flip], i) => ({ i, x, sp: natL.sprite(nationsMarkup(seed, 6, { s: 0.42, spread: 32, flip }), x, fb.fn(x) + 30) }));
    const mid = S.layer({ par: 0.2, sh: 3 });
    const mb = band(c, { y: 560, amps: [12, 5, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.sand, 0.25) });
    let hs = '';
    [[1000, 110, 90], [1120, 140, 110], [1280, 120, 96], [1420, 150, 120]].forEach(([x, w, h]) => { hs += house(c, x, mb.fn(x) + 14, w, h, { stairs: false }); });
    mid.add(mb.markup + hs + olive(c, 300, mb.fn(300) + 8, 0.7) + cypress(c, 940, mb.fn(940) + 12, 120));
    /* the ground, Isaiah's rock, the street on the right (phone: it tapers off to the left like a road, instead of
       ending in a square-cut grey slab in the middle of the screen) */
    const G = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(640, [4, 2], [700, 180]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.hillNear, 0.3)).p(c.cut(S.portrait ? [[640, 742], [900, 700], [2500, 690], [2500, 760], [900, 770]] : [[900, 700], [2500, 690], [2500, 760], [900, 770]], 0.8, 12), mix(C.stone, C.sand, 0.4)).out());
    G.add(rock(c, IX, 660, 190, 70, C.rock2) + grass(c, { x0: -600, x1: 900, y: 650, fn: gfn, n: 24, h: 12, color: C.moss }));

    /* light from above (a second sheet, faded in) */
    const lightL = S.layer({ par: 0.3, sh: 1, flat: true, rise: 0 });
    const beam = lightL.add(`<g opacity="0"><path d="${c.poly([[JX - 60, -900], [JX + 60, -900], [JX + 200, Y + 20], [JX - 200, Y + 20]])}" fill="#fff4d6" opacity=".5"/></g>`);
    const burst = lightL.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 40, r1: 300, spread: 0.05, color: '#fff3cf', o: 0.55 })}</g>`);

    /* people */
    const act = S.layer({ par: 0.45, sh: 5 });
    const isaAura = act.add(`<g>${glow(150, 0.7)}</g>`);
    const SEP = (col) => mix(col, C.parchment, 0.55);
    const isaO = { ...ISAIAH, robe: SEP(ISAIAH.robe), mantle: SEP(ISAIAH.mantle), veil: SEP(ISAIAH.veil), veil2: SEP(ISAIAH.veil2), skin: SEP(ISAIAH.skin), beardColor: SEP(ISAIAH.beardColor), belt: SEP(ISAIAH.belt), hair: SEP(ISAIAH.hair) };
    const isaiah = S.puppet(act.add(person(c, { ...isaO, holdF: `<g transform="rotate(-90) translate(-6 -6) scale(.62)" data-k="isc">${scrollOpen(c, 90, 64)}</g>` })));
    const MEN = [{ x: 990, flip: false, o: manOf(c, { robe: C.clayMantle }) }, { x: 1075, flip: true, o: manOf(c, { robe: C.tealRobe }) }].map((m, i) => ({ ...m, i, p: S.puppet(act.add(person(c, m.o))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const doveEl = act.add(dove1(c));

    /* words */
    const fx = S.layer({ par: 0.5, sh: 4 });
    const slips = [0, 1, 2, 3].map((i) => fx.add(`<g opacity="0">${sheet().p(c.cut([[-18, -7], [18, -8], [19, 7], [-18, 8]], 0.4, 5), C.halo).x(c.ribbon([[-12, -1], [12, -2]], 1.2), C.ochre).out()}</g>`));
    const word = hanging(fx, hungWord(c, tr('Umiłowany', 'Beloved'), { size: 26, fill: C.halo }).replace(/<path d="M[^"]*" stroke[^>]*\/>/, ''), { x: JX, y: -300, len: 900 });
    const sc = scalesParts(c, { arm: 90, drop: 60, col: C.sun });
    const scl = { frame: fx.add(`<g>${sc.frame}</g>`), beam: fx.add(`<g>${sc.beam}</g>`), panL: fx.add(`<g>${sc.pan}</g>`), panR: fx.add(`<g>${sc.pan}</g>`) };
    const shouts = [0, 1, 2].map((i) => fx.add(`<g opacity="0">${shout(c, bang(c, 26), { w: 60, h: 48, flip: i === 1 })}</g>`));
    const hushSp = fx.add(`<g opacity="0">${glow(120, 0.7)}</g>`);

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: S.portrait ? 1060 : 1240, y: 250, r: Math.sin(T * 0.6) });
      pose(cl, { x: 1010 + Math.sin(T * 0.1) * 20, y: 190, r: Math.sin(T * 0.6 + 1) * 1.1 });

      /* v17 — Isaiah and his scroll */
      const unroll = es(t, 0.05, 0.3);
      const fadeIsa = 1 - es(t, 1.9, 2.3) * 0.65;
      isaiah.set({ x: IX, y: 628, s: 1.0, flip: false, armF: 70 + bump(t, 0.4, 1.0) * 10, armB: 20 + bump(t, 0.3, 0.9) * 60, head: -4, o: fadeIsa, blink: blinkAt(T, 4) });
      pose(S.$('isc'), { x: -6, y: -6, s: 0.62, sx: 0.15 + 0.85 * unroll, r: -90 });
      pose(isaAura, { x: IX, y: 520, o: 0.7 * fadeIsa });
      const [ihx, ihy] = handAt(IX, 628, 1.0, false, 70);
      const [jhx, jhy] = headAt(JX, Y, 1.06, false);
      slips.forEach((sl, i) => {
        const k = seg(t, 0.3 + i * 0.12, 0.75 + i * 0.12);
        const x = lerp(ihx + 20, jhx - 30, k), y = lerp(ihy - 10, jhy - 40, k) - Math.sin(k * PI) * 80;
        pose(sl, { x, y, r: Math.sin(k * 6 + i) * 20, s: 0.8 + Math.sin(k * PI) * 0.4, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v18a — light from above; "my beloved" */
      const lit = es(t, 1.05, 1.4);
      pose(beam, { o: lit * (1 - es(t, 3.0, 3.3) * 0.75) });
      pose(burst, { x: JX, y: jhy, s: 0.7 + lit * 0.5, r: T * 4, o: lit * (1 - es(t, 3.0, 3.3) * 0.85) });
      const wd = es(t, 1.25, 1.55, ease.back) * (1 - es(t, 2.95, 3.2));
      pose(word, { x: JX, y: lerp(-300, 250, wd), r: Math.sin(T * 0.9) * 0.8, oy: 0, o: wd > 0.01 ? 1 : 0 });

      /* v18b — the dove; the nations; justice */
      const dv = es(t, 2.02, 2.5);
      const [dx, dy] = [lerp(JX + 260, JX + 4, dv), lerp(120, jhy - 70, dv) + Math.sin(dv * PI) * -40];
      pose(doveEl, { x: dx, y: dy, s: 0.9, sx: -1, r: -8 * (1 - dv), o: dv > 0.001 ? 1 : 0 });
      flapWings(doveEl, time ? T : 0.3, dv < 1 ? 34 : 14, dv < 1 ? 7 : 2.4);
      const nk = es(t, 2.3, 2.6);
      NAT.forEach((n) => n.sp.set({ x: n.x - (1 - nk) * 60, y: fb.fn(n.x) + 30 + (1 - nk) * 40, o: nk }));
      const jd = es(t, 2.45, 2.75, ease.back) * (1 - es(t, 3.0, 3.2));
      poseScales(scl, JX + (P ? 170 : 250), lerp(-300, 300, jd), Math.sin(T * 0.8) * 1.5, jd > 0.01 ? 1 : 0, 1, 90);

      /* v19 — two men quarrel in the street; He stays quiet */
      const q = es(t, 3.05, 3.2);
      MEN.forEach((m) => m.p.set({ x: m.x, y: 728, s: 0.94, flip: m.flip, o: q, armF: 40 + bump(t, 3.15 + m.i * 0.1, 3.5 + m.i * 0.1) * 60 + q * 20, armB: q * (m.i ? 110 : 40), lean: q * 5, head: -q * 6, blink: 0 }));
      shouts.forEach((sh, i) => {
        const k = bump(t, 3.12 + i * 0.12, 3.6 + i * 0.12) > 0 ? es(t, 3.12 + i * 0.12, 3.25 + i * 0.12, ease.back) : 0;
        const m = MEN[i % 2];
        const [hx, hy] = headAt(m.x, 728, 0.94, m.flip);
        pose(sh, { x: hx + (m.flip ? -14 : 14), y: hy - 20 - (i === 2 ? 40 : 0), s: k * (i === 2 ? 1.2 : 1), r: Math.sin(t * 30 + i) * 4 * k, o: k > 0.01 ? 1 : 0 });
      });
      pose(hushSp, { x: JX, y: Y - 110, o: es(t, 3.3, 3.5) * 0.8 });
      jesus.set({ x: JX, y: Y, s: 1.06, flip: false, armF: 12 + bump(t, 1.1, 1.8) * 10 + es(t, 2.4, 2.7) * (1 - es(t, 2.95, 3.1)) * 50, armB: 8 + es(t, 2.4, 2.7) * (1 - es(t, 2.95, 3.1)) * 70, head: -2 - lit * 6 * (1 - es(t, 2.9, 3.1)) + es(t, 3.3, 3.5) * 5, blink: blinkAt(T, 2) });

      S.cam.x = kf(t, [[-0.5, -30], [0.9, -20], [1.2, 0], [2.9, 0], [3.2, 40]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.9, 1.1], [1.2, 1.1], [2.9, 1.08], [3.2, 1.12]]);
      S.cam.y = kf(t, [[-0.5, 20], [1.2, 34], [2.9, 20], [3.2, 40]]);
    };
  },
};
