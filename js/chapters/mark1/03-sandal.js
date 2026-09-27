// Mk 1,7–8 — "One mightier than I is coming": footprints approach, a huge sandal comes down on its strings
// and John kneels by it, not daring to untie the thong; then water (John's shell) and the Spirit (tongues of fire).
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, reeds, rock, sun, cloud, grass } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, hand, headAt, voiceRings, sandalBig, footprint, flame, plate, shell, drops, hang2 } from './lib.js';

const PI = Math.PI;
const GY = 742;            // where people stand / sit
const JX = 700;
const SX = 1000;           // the sandal
const KX = 830;            // John kneeling by it

export default {
  id: 'm1-sandal',
  beats: [
    { v: 7, text: 'I tak głosił: «Idzie za mną mocniejszy ode mnie,' },
    { v: 7, cont: true, text: 'a ja nie jestem godzien, aby się schylić i rozwiązać rzemyk u Jego sandałów.' },
    { v: 8, text: 'Ja chrzciłem was wodą,' },
    { v: 8, cont: true, text: 'On zaś chrzcić was będzie Duchem Świętym».' },
  ],
  cam: { x: [-40, 60], y: [0, 80], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const SKY = ['#d4dfd6', '#f3e2c2', '#f6e3c4'];
    sky(S, SKY);
    const goldSky = sky(S, ['#f3cf8f', '#f8dfae', '#fbecc9'], { name: 'gold' }).layer;
    goldSky.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const horizonGlow = hangL.add(`<circle r="300" fill="url(#warm-glow)" opacity="0"/>`);
    const sunEl = hanging(hangL, sun(c, 44), { x: 1190, y: 230, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 430, y: 170, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 120), { x: 1000, y: 120, len: 700 });

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [1000, 340, 130], color: mix(C.duskViolet, C.dune, 0.5) }).markup);
    const river = S.layer({ par: 0.25, sh: 2 });
    river.add(band(c, { y: 530, amps: [8, 4], lens: [800, 200], color: mix(C.sand, C.sage3, 0.4) }).markup);
    river.add(waterBand(c, { y: 566, color: C.lake, foamN: 20 }).markup);
    river.add(reeds(c, 330, 600, 9, 70) + reeds(c, 1300, 604, 10, 80));

    /* ---------- light from above (behind the bank and the people) ---------- */
    const light = S.layer({ par: 0.3, sky: true });
    light.add(`<g transform="translate(900 -80)">${rays(c, { n: 16, r0: 40, r1: 1200, spread: 0.045, color: '#fff3cf' })}</g><circle cx="900" cy="80" r="700" fill="url(#warm-glow)" opacity=".5"/>`);
    light.fade(0);
    /* ---------- the bank, footprints ---------- */
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(622, [5, 2], [700, 180]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.sand2).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: 622, fn: gfn, n: 34, h: 14, color: C.olive }) + rock(c, 250, 760, 90, 34, C.rock2));
    const PRINTS = Array.from({ length: 7 }, (_, i) => {
      const u = i / 6;
      return { x: lerp(1250, 950, u) + (i % 2 ? 14 : -14), y: lerp(640, 760, Math.pow(u, 1.3)), s: lerp(0.5, 1.35, u), left: i % 2 === 0, i };
    });
    PRINTS.forEach((p) => { p.el = G.add(`<g>${footprint(c, p.left)}</g>`); });

    /* ---------- the sandal on its strings ---------- */
    const SL = S.layer({ par: 0.5, sh: 7 });
    const sGlow = SL.add(`<ellipse rx="260" ry="120" fill="url(#halo-glow)" opacity="0"/>`);
    const sandalEl = SL.add(hang2(`<g>${sandalBig(c, 400)}</g>`, 60, 900));
    const thong = sandalEl.querySelector('.thong');

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const LIS = [
      { robe: C.mauve, hairStyle: 'veil', veil: C.skyVeil, skin: C.skin, pose: 'sit', x: 400, y: GY + 4 },
      { robe: C.sageRobe, hairStyle: 'curly', hair: C.hair3, beard: 'full', skin: C.skin4, pose: 'sit', x: 492, y: GY + 10 },
      { robe: C.ochreRobe, hairStyle: 'short', hair: C.hair, beard: 'short', skin: C.skin2, pose: 'sit', x: 580, y: GY + 2 },
      { robe: C.tealRobe, mantle: C.stone, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3, pose: 'stand', x: 318, y: GY - 6, s: 0.92 },
    ].map((o, i) => ({ ...o, p: S.puppet(P.add(person(c, o))), i, seed: c.rr(0, 9) }));
    const shellM = `<g data-k="shell" transform="rotate(-20)">${shell(c, 15)}</g>`;
    const john = S.puppet(P.add(person(c, { ...JOHN_B, holdF: shellM })));
    const shellEl = S.$('shell');
    const johnK = S.puppet(P.add(person(c, { ...JOHN_B, pose: 'kneel' })));
    const voice = voiceRings(P, c, { n: 3, color: C.clay, r: 38, w: 5 });
    const water = Array.from({ length: 9 }, (_, i) => ({ el: P.add(`<g>${drops(c, 1, i % 2 ? C.lake2 : C.lake)}</g>`), i, tx: 390 + (i % 4) * 70 + c.rr(-20, 20), ty: GY - 110 + c.rr(-10, 10) }));
    const flames = LIS.map((l) => ({ el: P.add(`<g>${flame(c, 28)}</g>`), l }));
    const jFlame = P.add(`<g>${flame(c, 30)}</g>`);

    /* ---------- the two plates: water and Spirit ---------- */
    const PL = S.layer({ par: 0.2, sh: 6 });
    const waterIcon = `<path d="${c.cut([[0, -30], [16, -4], [14, 12], [0, 20], [-14, 12], [-16, -4]], 0.4, 4)}" fill="${C.lake2}"/><path d="${c.ribbon([[-32, 26], [-16, 22], [0, 26], [16, 22], [32, 26]], 4)}" fill="${C.lake}"/><path d="${c.cut(c.ell(-5, -2, 4, 7, 8), 0.2, 3)}" fill="${C.foam}"/>`;
    const waterPlate = hanging(PL, plate(c, waterIcon, { r: 50, fill: '#e7f0ec', rim: C.lake }), { x: 560, y: 240, len: 700 });
    const spiritIcon = `<g opacity=".9">${rays(c, { n: 12, r0: 34, r1: 54, spread: 0.08, color: C.sun })}</g><g transform="translate(0 30)">${flame(c, 64, C.sunRay, C.lampFlame)}</g>`;
    const spiritPlate = hanging(PL, `<circle r="130" fill="url(#halo-glow)"/>${plate(c, spiritIcon, { r: 58, fill: C.halo, rim: C.sun })}`, { x: 1000, y: 230, len: 700 });

    const wind = S.layer({ par: 0.6, sh: 1, flat: true, pad: 500 });
    let wd = '';
    for (let i = 0; i < 14; i++) { const x = c.rr(-900, 2400), y = c.rr(260, 700); wd += c.ribbon(c.cbez([x, y], [x + 60, y - 30], [x + 140, y + 20], [x + 220, y - 6], 14), (u) => Math.sin(u * PI) * 5 + 0.5); }
    wind.add(`<path d="${wd}" fill="${C.halo}" opacity=".6"/>`);
    wind.fade(0);

    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(reeds(c, 110, 960, 14, 240, C.moss) + reeds(c, 1500, 960, 12, 220, C.moss) + rock(c, 1400, 985, 220, 90, C.rock));

    return (t, time) => {
      swing(sunEl, 1190, 230, time, 1, 0.6);
      swing(cl1, 430 + Math.sin(time * 0.1) * 20, 170, time, 1.2, 0.6, 1);
      swing(cl2, 1000 + Math.sin(time * 0.12 + 1) * 20, 120 - es(t, 2.9, 3.3) * 400, time, 1.2, 0.7, 2);

      /* v7a: someone mightier is coming — footprints arrive out of a glow */
      const glowK = es(t, 0.2, 0.8) * (1 - es(t, 2.0, 2.4));
      pose(horizonGlow, { x: 1260, y: 560, s: 0.6 + glowK * 0.7, o: glowK * 0.9 });
      PRINTS.forEach((p) => {
        const k = es(t, 0.3 + p.i * 0.08, 0.4 + p.i * 0.08, ease.back);
        pose(p.el, { x: p.x, y: p.y, s: p.s * k, sy: p.s * k * 0.5, o: k > 0 ? 1 - es(t, 2.0, 2.3) : 0 });
      });

      /* v7b: the sandal comes down; John kneels, reaches — and draws back */
      const down = es(t, 1.02, 1.32, ease.out), up = es(t, 2.0, 2.3, ease.in);
      const sy = lerp(-420, 744, down) - up * 1200;
      pose(sandalEl, { x: SX, y: sy, r: Math.sin(time * 0.8) * 0.6 * (1 - down) + bump(t, 1.28, 1.45) * 1.5 });
      pose(thong, { x: -400 * 0.4 * 0.46, y: -400 * 0.4, r: Math.sin(time * 1.6) * 5 + bump(t, 1.5, 1.72) * 22 });
      pose(sGlow, { x: SX, y: sy - 200, s: 1, sx: 0.8, sy: 1.8, o: down * (1 - up) * 0.7 });

      const toSandal = es(t, 1.08, 1.34), back = es(t, 2.02, 2.3);
      const kneel = es(t, 1.36, 1.42) * (1 - es(t, 2.0, 2.06));
      const jx = lerp(JX, KX, toSandal) - back * 20;
      const preach = es(t, -0.2, 0.15) * (1 - es(t, 0.3, 0.45));
      const point = es(t, 0.35, 0.6) * (1 - es(t, 1.05, 1.2));
      const pour = es(t, 2.15, 2.4) * (1 - es(t, 2.95, 3.1));
      const spirit = es(t, 3.1, 3.4);
      const faceLeft = t < 0.4 || (t > 2.05 && t < 3.0);
      john.set({
        x: jx, y: GY, s: 1.05, flip: faceLeft, o: 1 - kneel,
        walk: toSandal > 0 && toSandal < 1 ? jx * 0.05 : undefined,
        armF: 20 + preach * 60 + point * 70 + pour * 95 + spirit * 60,
        armB: 10 + preach * 120 + point * 30 + spirit * 140,
        head: -point * 4 + pour * 6 - spirit * 16, blink: blinkAt(time),
      });
      fade(shellEl, es(t, 2.05, 2.15) * (1 - es(t, 3.0, 3.1)));
      const reach = es(t, 1.45, 1.62) * (1 - es(t, 1.68, 1.85));
      const bow = es(t, 1.7, 1.9);
      johnK.set({ x: KX, y: GY, s: 1.05, o: kneel, armF: 30 + reach * 50 - bow * 10, armB: 10 + bow * 50, head: bow * 20 - reach * 10, lean: bow * 8, blink: blinkAt(time, 2) });
      const [hx, hy] = headAt(jx, GY, 1.05, faceLeft);
      voice(hx, hy, Math.max(preach, point * 0.8) * seg(t, -0.2, 0), time);

      /* v8a: water — the shell sprinkles the listeners */
      const [sx, sy2] = hand(jx, GY, 1.05, true, 20 + pour * 95);
      water.forEach((w) => {
        const k = time ? (time * 0.9 + w.i / water.length) % 1 : (w.i + 0.5) / water.length;
        const on = pour * seg(t, 2.3, 2.4);
        pose(w.el, { x: lerp(sx - 8, w.tx, k), y: lerp(sy2, w.ty, k) - Math.sin(k * PI) * 70, s: 2.2, o: on * (1 - k * 0.5) });
      });
      const wIn = es(t, 1.95, 2.3, ease.out), wDim = es(t, 3.05, 3.4);
      swing(waterPlate, 560, lerp(-380, 250, wIn), time, 1.4, 0.8);
      fade(waterPlate, (wIn > 0 ? 1 : 0) * (1 - wDim * 0.45));

      /* v8b: the Spirit — golden light, wind and tongues of fire */
      const sIn = es(t, 3.0, 3.35, ease.out);
      swing(spiritPlate, 1000, lerp(-380, 230, sIn), time, 1.2, 0.7, 1);
      fade(spiritPlate, sIn > 0 ? 1 : 0);
      goldSky.fade(spirit * 0.75);
      light.fade(spirit * 0.55);
      wind.fade(spirit * 0.7);
      wind.shift(((time * 60) % 500) - 250, Math.sin(time * 0.7) * 10);
      flames.forEach((f, i) => {
        const k = es(t, 3.3 + i * 0.07, 3.45 + i * 0.07, ease.back);
        const [fx, fy] = f.l.pose === 'sit' ? [f.l.x + 2 * 0.9, f.l.y - (167 - 62) * 0.9 - 32] : [f.l.x + 2 * 0.92, f.l.y - 167 * 0.92 - 32];
        const fl = 1 + Math.sin(time * 11 + i) * 0.08;
        pose(f.el, { x: fx, y: fy, sx: k / fl, sy: k * fl, o: k > 0 ? 1 : 0 });
      });
      const kj = es(t, 3.5, 3.65, ease.back);
      pose(jFlame, { x: hx, y: hy - 30, sx: kj, sy: kj * (1 + Math.sin(time * 10) * 0.08), o: kj > 0 ? 1 : 0 });

      /* listeners: attentive, heads turn to the footprints, sprinkled, then look up at the light */
      LIS.forEach((l) => {
        const look = es(t, 0.45, 0.7) * (1 - es(t, 1.9, 2.1));
        l.p.set({
          x: l.x, y: l.y, s: l.s || 0.9, flip: false,
          armF: (l.pose === 'sit' ? 40 : 10) + bump(t, 2.4 + l.i * 0.1, 2.9) * 30 + spirit * (l.i % 2 ? 60 : 30), armB: spirit * (l.i % 2 ? 20 : 120),
          head: -look * 6 + bump(t, 2.3, 2.9) * 8 - spirit * 12, blink: blinkAt(time, l.seed),
        });
      });

      S.cam.z = 1.12 + es(t, 1.0, 1.4) * 0.08 - es(t, 1.95, 2.3) * 0.08 + spirit * 0.02;
      S.cam.x = es(t, 1.0, 1.4) * 50 * (1 - es(t, 1.95, 2.3));
      S.cam.y = 70 - es(t, 1.0, 1.4) * 30 * (1 - es(t, 1.95, 2.3)) - spirit * 20;
    };
  },
};
