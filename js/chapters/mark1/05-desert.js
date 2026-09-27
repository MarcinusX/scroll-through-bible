// Mk 1,12–13 — the Spirit leads Jesus into the wilderness: forty days swing past as sun and moon on strings
// while tally marks fill a stone; a shadowy tempter offers a stone for bread and melts away; wild animals
// lie down in peace around Him; at dawn angels come down on their strings with bread and water.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, sun, moon, stars } from '../../assets/nature.js';
import { paperLabel } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { dove, flapWings, scrub, acacia, lion, ibex, fox, hare, snake, wings, breadBasket, jug, tallyStone } from './lib.js';

const PI = Math.PI;
const P = 0.5;
const GY = 742;               // ground where people stand
const SEAT = 724;             // Jesus sitting on his rock
const JX = 800;
const TEMPTER = { robe: '#3d3650', fur: true, hairStyle: 'wrap', veil: '#2b2640', veil2: '#211c33', skin: '#a39cb0', hair: '#211c33', beard: 'none', eyes: 'open' };
const ANGEL = { robe: C.linen, mantle: C.skyVeil, hairStyle: 'long', hair: C.wheat2, skin: C.skin, beard: 'none' };

export default {
  id: 'm1-desert',
  beats: [
    { v: 12 },
    { v: 13, text: 'Czterdzieści dni przebył na pustyni,' },
    { v: 13, cont: true, text: 'kuszony przez szatana.' },
    { v: 13, cont: true, text: 'Żył tam wśród zwierząt,' },
    { v: 13, cont: true, text: 'aniołowie zaś usługiwali Mu.' },
  ],
  cam: { x: [-60, 40], y: [-40, 60], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    sky(S, ['#d7dccf', '#f1dcb5', '#f5dcb2']);
    const nightSky = sky(S, [C.night2, C.night, '#4a4f86'], { name: 'night' }).layer;
    const dawnSky = sky(S, ['#b8a9c9', '#f0bfa2', '#f7d9b4'], { name: 'dawn' }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 520, n: 150 }));

    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1200, y: 170, len: 900 });
    const moonEl = hanging(hangL, `<circle r="110" fill="url(#halo-glow)" opacity=".45"/>${moon(c, 36)}`, { x: 800, y: -300, len: 900 });

    /* ---------- dunes and rocky hills ---------- */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [30, 12, 4], lens: [800, 300, 110], color: mix(C.dune, C.duskViolet, 0.35) }).markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    mid.add(band(c, { y: 560, amps: [26, 10, 3], lens: [700, 260, 100], color: C.dune }).markup);
    mid.add(rock(c, 260, 566, 180, 90, C.rock2) + rock(c, 1400, 570, 160, 70, C.rock3) + acacia(c, 1180, 575, 0.7));
    const G = S.layer({ par: P, sh: 3 });
    const gfn = c.wave(640, [10, 4], [700, 200]);
    const gs = sheet();
    gs.p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand);
    let peb = '';
    for (let i = 0; i < 40; i++) peb += c.cut(c.blob(c.rr(-600, 2200), c.rr(660, 900), c.rr(3, 8), c.rr(2, 4), 7, 0.2), 0.3, 3);
    gs.x(peb, C.rock2, 'opacity=".6"');
    G.add(gs.out());
    G.add(scrub(c, 470, 660, 34) + scrub(c, 1110, 668, 30) + rock(c, 1260, 700, 120, 54, C.rock));
    const tally = G.add(`<g transform="translate(1070 722)">${tallyStone(c, 190, 70)}</g>`);
    const marks = Array.from(tally.querySelectorAll('.tally'));
    const forty = G.add(`<g opacity="0">${paperLabel('40', { size: 30 })}</g>`);

    /* ---------- the tempter, the animals ---------- */
    const A = S.layer({ par: P, sh: 4 });
    const aura = A.add(`<g opacity="0"><path d="${c.cut(c.star(0, -110, 130, 80, 13, 0.2), 3, 8)}" fill="#1e1a2e" opacity=".45"/></g>`);
    const stone = sheet().p(c.cut(c.blob(0, 0, 11, 9, 9, 0.2), 0.4, 3), C.rock2).out();
    const bread = sheet().p(c.cut(c.blob(0, 0, 13, 9, 10, 0.1), 0.4, 3), C.wheat2).x(c.ribbon([[-6, -2], [6, -3]], 1.6), shade(C.wheat2, -0.25)).out();
    const tempter = S.puppet(A.add(person(c, { ...TEMPTER, holdF: `<g data-k="stone">${stone}</g><g data-k="bread" opacity="0">${bread}</g>` })));
    const stoneEl = S.$('stone'), breadEl = S.$('bread');
    const beasts = [
      { m: lion(c), x: 1010, y: GY + 6, from: 1700, s: 1.05, flip: true, d: 0 },
      { m: ibex(c), x: 560, y: GY - 6, from: -300, s: 1, flip: false, d: 0.1 },
      { m: fox(c), x: 660, y: GY + 14, from: -250, s: 0.9, flip: false, d: 0.2 },
      { m: hare(c), x: 1230, y: GY - 4, from: 1700, s: 0.9, flip: true, d: 0.25 },
      { m: snake(c), x: 900, y: GY + 16, from: 1000, s: 0.8, flip: true, d: 0.3 },
    ].map((b, i) => ({ ...b, el: A.add(`<g>${b.m}</g>`), i }));

    /* ---------- Jesus ---------- */
    const J = S.puppet;
    const JL = S.layer({ par: P, sh: 5 });
    const seatRock = JL.add(rock(c, JX - 6, SEAT + 20, 120, 46, C.rock2));
    const jWalk = J(JL.add(person(c, { ...CAST.jesus })));
    const jSit = J(JL.add(person(c, { ...CAST.jesus, pose: 'sit', eyes: 'open' })));
    const jStand = J(JL.add(person(c, { ...CAST.jesus })));
    const doveEl = JL.add(dove(c));

    /* ---------- angels on strings ---------- */
    const angels = [
      { x: 620, y: GY - 60, hold: `<g transform="translate(0 6)">${breadBasket(c)}</g>`, flip: false },
      { x: 990, y: GY - 70, hold: `<g transform="translate(2 12)">${jug(c)}</g>`, flip: true },
    ].map((a, i) => {
      const el = hanging(JL, `<g transform="translate(0 176)"><g class="wbox">${wings(c)}</g>${person(c, { ...ANGEL, mantle: i ? C.blushVeil : C.skyVeil, holdF: a.hold })}</g>`, { x: a.x, y: a.y - 176, len: 900 });
      return { ...a, el, p: S.puppet(el.querySelector('.fig')), wbox: el.querySelector('.wbox'), wF: el.querySelector('.wingFr'), wB: el.querySelector('.wingBk'), i };
    });

    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(rock(c, 120, 980, 280, 120, C.rock3) + rock(c, 1500, 975, 260, 110, C.rock2) + scrub(c, 330, 950, 60) + scrub(c, 1300, 955, 56));

    return (t, time) => {
      /* ---------- day and night: four swings of sun and moon while the stone fills with marks ---------- */
      const cyc = seg(t, 1.05, 1.95) * 3.75;
      const ph = cyc % 1;
      let night = 0, sunF = -1, moonF = -1;
      if (t < 1.05) { sunF = 0.35 + t * 0.12; }
      else if (t < 1.95) {
        night = es(ph, 0.42, 0.56) * (1 - es(ph, 0.9, 1.0));
        if (ph < 0.5) sunF = ph / 0.5; else moonF = (ph - 0.5) / 0.5;
      } else { night = 1 - es(t, 4.0, 4.45); moonF = lerp(0.5, 0.72, seg(t, 1.95, 4)) + es(t, 4.0, 4.5) * 0.3; sunF = es(t, 4.05, 4.6) * 0.18; }
      nightSky.fade(night);
      dawnSky.fade(bump(t, 3.9, 5.2) * 0.9);
      starL.fade(night);
      const arc = (f, y0) => [lerp(260, 1340, f), y0 - Math.sin(Math.max(0, Math.min(1, f)) * PI) * 300];
      let sunXY;
      if (t < 1.05) sunXY = arc(0.3 + seg(t, 0, 1.05) * 0.15, 480);
      else if (t < 1.95) sunXY = ph < 0.5 ? arc(ph / 0.5, 480) : [1340, 820];
      else if (t < 4.0) sunXY = [260, 820];
      else sunXY = [300, lerp(640, 330, es(t, 4.05, 4.7))];
      swing(sunEl, sunXY[0], sunXY[1], time, 1, 0.6);
      const [mx, my] = moonF >= 0 ? arc(moonF, 470) : [260, 820];
      swing(moonEl, mx, my, time, 0.8, 0.5, 1);

      const shown = Math.floor(seg(t, 1.05, 1.9) * 40 + 0.001);
      marks.forEach((m, i) => fade(m, i < shown ? 1 : 0));
      const f40 = es(t, 1.85, 2.0, ease.back);
      pose(forty, { x: 1070, y: 626 + Math.sin(time * 1.5) * 3, s: f40, r: Math.sin(time) * 3, o: f40 > 0 ? 1 - es(t, 2.6, 2.9) * 0.6 : 0 });

      /* ---------- v12: the Spirit leads Him out ---------- */
      const w = es(t, 0.02, 0.9);
      const jx = lerp(430, JX, w);
      const sitK = es(t, 1.0, 1.07) * (1 - es(t, 2.4, 2.47)) + es(t, 3.0, 3.07);
      const standK = es(t, 2.4, 2.47) * (1 - es(t, 3.0, 3.07));
      jWalk.set({ x: jx, y: GY, s: 1.05, o: 1 - es(t, 1.0, 1.07), walk: w > 0 && w < 1 ? jx * 0.045 : undefined, armF: 14, head: -4, blink: blinkAt(time) });
      const pray = es(t, 1.1, 1.3) * (1 - es(t, 1.9, 2.2));
      const recv = es(t, 4.3, 4.6);
      jSit.set({ x: JX - 20, y: SEAT, s: 1.05, o: sitK, armF: 40 - pray * 10 + recv * 40 + es(t, 3.3, 3.6) * 10, armB: 20 + pray * 20, head: pray * 12 - recv * 4, blink: blinkAt(time, 2) });
      const refuse = es(t, 2.48, 2.65);
      jStand.set({ x: JX, y: GY, s: 1.05, flip: true, o: standK, armF: 20 + refuse * 70, armB: 10 + refuse * 20, head: -refuse * 4, blink: blinkAt(time, 2) });
      const df = es(t, 0.0, 0.95);
      pose(doveEl, { x: lerp(560, 1040, df), y: lerp(430, 380, df) - Math.sin(df * PI * 2) * 30 - es(t, 0.8, 1.1) * 500, s: 1.1, o: 1 - seg(t, 0.95, 1.1) });
      flapWings(doveEl, time, 30, 7);

      /* ---------- v13b: the tempter ---------- */
      const tin = es(t, 2.03, 2.3), tout = es(t, 2.7, 2.95);
      const tx = lerp(420, 610, tin) - tout * 60;
      const offer = es(t, 2.25, 2.45);
      tempter.set({ x: tx, y: GY, s: 1.08 - tout * 0.4, o: tin * (1 - tout), armF: 20 + offer * 70, armB: 10 + bump(t, 2.3, 2.7) * 40, head: offer * 6, lean: offer * 8 - tout * 10, blink: blinkAt(time, 5) });
      const tb = es(t, 2.36, 2.44);
      fade(stoneEl, 1 - tb); fade(breadEl, tb);
      pose(aura, { x: tx - 6, y: GY + 10, s: (1.08 - tout * 0.4) * (1 + Math.sin(time * 2) * 0.03), r: Math.sin(time * 0.7) * 4, o: tin * (1 - tout) * 0.9 });

      /* ---------- v13c: the wild animals come and lie down ---------- */
      beasts.forEach((b) => {
        const k = es(t, 3.05 + b.d, 3.5 + b.d);
        const x = lerp(b.from, b.x, k);
        const moving = k > 0 && k < 1;
        pose(b.el, { x, y: b.y - (moving ? Math.abs(Math.sin(x * 0.05)) * 5 : 0), s: b.s, sx: (b.flip ? -1 : 1) * b.s, sy: b.s + (moving ? 0 : Math.sin(time * 1.2 + b.i) * 0.01), o: seg(t, 3.0 + b.d, 3.1 + b.d) });
      });

      /* ---------- v13d: angels come down with bread and water ---------- */
      angels.forEach((a) => {
        const k = es(t, 4.1 + a.i * 0.12, 4.5 + a.i * 0.12, ease.out);
        swing(a.el, a.x, lerp(-700, a.y - 176, k) + Math.sin(time * 1.4 + a.i) * 4 * k, time, 1.2, 0.8, a.i);
        fade(a.el, k > 0 ? 1 : 0);
        a.p.set({ x: 0, y: 0, s: 0.98, flip: a.flip, armF: 60 + es(t, 4.45, 4.7) * 20, armB: 30, head: 6, blink: blinkAt(time, a.i + 3) });
        pose(a.wbox, { sx: a.flip ? -0.98 : 0.98, sy: 0.98 });
        const f = Math.sin(time * 3 + a.i) * 10;
        pose(a.wF, { x: -8, y: -126, r: f });
        pose(a.wB, { x: -6, y: -128, r: -f * 0.8 });
      });

      S.cam.z = 1.04 + es(t, 1.0, 1.3) * 0.06 - es(t, 2.0, 2.3) * 0.04 + es(t, 3.0, 3.4) * 0.06 - es(t, 4.0, 4.4) * 0.08;
      S.cam.x = -es(t, 2.0, 2.3) * 40 * (1 - es(t, 2.9, 3.2));
      S.cam.y = 30 + es(t, 3.0, 3.4) * 20 - es(t, 4.0, 4.4) * 40;
    };
  },
};
