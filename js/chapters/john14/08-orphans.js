// J 14,18–20 — a night street. "I will not leave you orphans": a little one sits alone on a dark doorstep, knees
// drawn up, a cold lamp beside him. "I will come to you": Jesus comes down the street with a lamp, kneels, lights the
// little lamp from His own; the house window glows and the child stands and takes His hand. "Yet a little while and
// the world will see Me no more": an hourglass runs, and a grey veil comes down over the passers-by of the world.
// "But you will see Me; because I live, you too will live": the disciples on this side see Him still, and a small
// flame of life kindles over each of them. "On that day you will know that I am in My Father, and you in Me, and I
// in you": circles of light, one inside another — the great ring round them all, a ring round Him, and in each of
// them a small ring with His light inside.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { stars, moon, band, house as houseN } from '../../assets/nature.js';
import {
  TW, NIGHT, CHILD, darkSheet, withFace, faceBits, smallHouse, handLamp, clayLamp, lightLamp, hourglassRig, passerOpts, eternityRing, drawRing, soulLight,
  glowDisc, hanging, swing, kf, vis, headAt, hand, PI,
} from './lib.js';

const G = 690, HX = 610, JX = 800;

export default {
  id: 'j14-orphans',
  beats: [
    { v: 18, text: 'Nie zostawię was sierotami:' },
    { v: 18, cont: true, text: 'Przyjdę do was.' },
    { v: 19, text: 'Jeszcze chwila, a świat nie będzie już Mnie oglądał.' },
    { v: 19, cont: true, text: 'Ale wy Mnie widzicie, ponieważ Ja żyję i wy żyć będziecie.' },
    { v: 20 },
  ],
  cam: { x: [-120, 60], y: [-60, 120], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const sk = sky(S, NIGHT);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 480, n: 110 }));
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="90" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 30)}`, { x: 1180, y: 170, len: 700 });
    // the town behind
    const far = S.layer({ par: 0.15, sh: 2 });
    let town = '';
    for (let i = 0; i < 14; i++) town += houseN(c, 300 + i * 90 + c.rr(-20, 20), 560 + c.rr(-8, 8), c.rr(60, 90), c.rr(40, 70), { wall: mix(C.plaster2, C.indigo, 0.55), shadow: mix(C.plaster2, C.night, 0.6), roofEdge: mix(C.roof, C.night, 0.5), win: mix(C.night2, C.indigo, 0.2), stairs: false });
    far.add(band(c, { y: 560, amps: [6, 3, 1], lens: [800, 300, 100], color: mix(C.hillFar, C.indigo, 0.6), x0: -1400, x1: 3200 }).markup + town);
    // the street
    const street = S.layer({ par: 0.4, sh: 3 });
    const ss = sheet();
    ss.p(c.cut([[-1400, G - 20], [3200, G - 20], [3200, 1800], [-1400, 1800]], 1, 20), mix(C.sand2, C.indigo, 0.5));
    let cob = '';
    for (let i = 0; i < 70; i++) cob += c.cut(c.ell(c.rr(-200, 1800), c.rr(G - 10, 900), c.rr(10, 22), c.rr(4, 7), 8), 0.3, 3);
    ss.x(cob, mix(C.sand, C.indigo, 0.45), 'opacity=".6"');
    street.add(ss.out());
    // the world on the right, and the veil that falls over it
    const worldL = S.layer({ par: 0.42, sh: 4 });
    const folk = [0, 1, 2, 3].map((i) => ({ i, x: 1030 + i * 62, p: S.puppet(worldL.add(person(c, { ...passerOpts(i), eyes: 'open' }))) }));
    const veilL = S.layer({ par: 0.44, sh: 2, pad: 700 });
    veilL.add(`<g transform="translate(975 ${G - 500}) " opacity=".86">${darkSheet(c, 1, { w: 1600, h: 1100, col: '#262852' })}</g>`);
    // the house and the doorstep
    const houseL = S.layer({ par: 0.45, sh: 4 });
    houseL.add(`<g transform="translate(${HX} ${G})">${smallHouse(c)}</g>`);
    const winGlow = houseL.add(`<g><rect x="${HX - 58}" y="${G - 92}" width="40" height="34" fill="${C.lampFlame}"/><circle cx="${HX - 38}" cy="${G - 75}" r="60" fill="url(#warm-glow)"/></g>`);
    const lampC = houseL.add(`<g>${clayLamp(c)}</g>`);
    // the hourglass
    const hgL = S.layer({ par: 0.3, sh: 4 });
    const hgString = hgL.add(`<g><path d="M0 -1400V-66" stroke="rgba(74,54,34,.55)" stroke-width="1.3"/></g>`);
    const hg = hourglassRig(hgL, c, 110);
    // circles of light (v20)
    const ringL = S.layer({ par: 0.46, sh: 2 });
    const big = ringL.add(`<g>${eternityRing(c, 330, 8, 36, C.haloRim)}</g>`);
    const mid = ringL.add(`<g>${eternityRing(c, 120, 6, 20, C.halo)}</g>`);
    // people
    const act = S.layer({ par: 0.5, sh: 5 });
    const D = [['peter', 420], ['john', 490], ['andrew', 560]].map(([k, x], i) => ({ k, x, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW[k]))) }));
    const childSitEl = act.add(withFace(person(c, { ...CHILD, pose: 'sit' }), faceBits(c)));
    const childSit = S.puppet(childSitEl);
    const childSad = childSitEl.querySelector('[data-part="sad"]');
    const childUp = S.puppet(act.add(person(c, CHILD)));
    const lampM = handLamp(c, { glowR: 90 });
    const jWalk = S.puppet(act.add(person(c, { ...CAST.jesus, holdF: `<g transform="translate(-4 4) scale(.7)">${lampM}</g>` })));
    const jKneel = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'kneel', holdF: `<g transform="translate(-4 4) scale(.7)">${lampM}</g>` })));
    const jStand = S.puppet(act.add(person(c, CAST.jesus)));
    const fx = S.layer({ par: 0.52, sh: 3 });
    const small = [...D.map(() => 0), 0].map(() => ({ ring: fx.add(`<g>${eternityRing(c, 30, 3, 12, C.halo)}</g>`), soul: fx.add(`<g>${soulLight(c, 8)}</g>`) }));
    const glowJ = fx.add(`<g>${glowDisc(150, 'halo-glow', 1)}</g>`);

    return (t, time) => {
      const T = time;
      swing(moonEl, 1180, 170, T, 0.8, 0.6);
      /* v18a — alone on the doorstep */
      const come = es(t, 1.02, 1.45, ease.out);
      const kneel = es(t, 1.45, 1.52) * (1 - es(t, 2.02, 2.09));
      const up = es(t, 2.02, 2.09);
      const lit = es(t, 1.55, 1.7);
      const childStands = es(t, 1.78, 1.85);
      lightLamp(lampC, lit, T, 1);
      fade(childSad, 1 - es(t, 1.4, 1.6));
      pose(lampC, { x: HX + 80, y: G + 2, s: 1.1 });
      fade(winGlow, es(t, 1.6, 1.8));
      childSit.set({ x: HX + 40, y: G + 2, s: 0.6, o: 1 - childStands, armF: 30 + lit * 10, armB: 20, head: 14 * (1 - come) - come * 6, lean: 6 * (1 - come), blink: blinkAt(T, 3) });
      const cx = lerp(HX + 50, 724, es(t, 2.05, 2.4));
      childUp.set({ x: cx, y: G + 4, s: 0.58, o: childStands, armF: 40 + es(t, 1.85, 2.0) * 30, armB: 10, head: -12, walk: es(t, 2.05, 2.4) > 0 && es(t, 2.05, 2.4) < 1 ? t * 30 : undefined, blink: blinkAt(T, 3) });
      /* v18b — He comes with a lamp and kneels */
      const jx = lerp(1260, 740, come);
      jWalk.set({ x: jx, y: G + 6, s: 1.02, flip: true, o: (t > 1 ? 1 : 0) * (1 - kneel) * (1 - up), walk: come > 0 && come < 1 ? t * 26 : undefined, armF: 60, blink: blinkAt(T) });
      jKneel.set({ x: 740, y: G + 6, s: 1.02, flip: true, o: kneel, armF: 60 + lit * 10, armB: 10 + es(t, 1.72, 1.9) * 40, head: 8, blink: blinkAt(T) });
      const jxs = lerp(740, JX, es(t, 2.05, 2.4));
      const see = es(t, 3.05, 3.35);
      jStand.set({ x: jxs, y: G + 6, s: 1.08, flip: t < 2.5, o: up, armF: 14 + es(t, 2.05, 2.3) * 16 + see * 40 * (1 - es(t, 4.1, 4.3)), armB: 10 + see * 60 + es(t, 4.1, 4.3) * 110, head: -2, walk: es(t, 2.05, 2.4) > 0 && es(t, 2.05, 2.4) < 1 ? t * 30 : undefined, blink: blinkAt(T) });
      /* v19a — the hourglass; the veil falls over the world */
      const hk = es(t, 2.02, 2.25, ease.out) * (1 - es(t, 3.0, 3.25, ease.in));
      const hy = 190 - (1 - hk) * 700;
      pose(hg.el, { x: 800, y: hy, r: T ? Math.sin(T * 0.8) * 1.2 : 0 });
      pose(hgString, { x: 800, y: hy });
      hg.set(1 - seg(t, 2.1, 2.95), seg(t, 2.1, 2.2) * (1 - seg(t, 2.9, 2.95)));
      const veil = es(t, 2.3, 2.75, ease.inOut);
      veilL.shift(0, -(1 - veil) * 700);
      veilL.fade(veil > 0.001 ? 1 : 0);
      const fo = es(t, 1.05, 1.35);
      folk.forEach((f) => { f.p.set({ x: f.x + (1 - fo) * 120, y: G + 8, s: 0.92, flip: true, o: fo, walk: fo > 0 && fo < 1 ? t * 24 + f.i : undefined, head: -4 + veil * 14, armF: 10 + (1 - veil) * es(t, 1.4, 1.6) * 30, blink: blinkAt(T, f.i) }); });
      /* v19b — you see Me; flames of life over them; v20 — rings within rings */
      const look = es(t, 3.05, 3.3);
      const enter = es(t, 2.85, 3.2, ease.out);
      D.forEach((m) => { const x = m.x - (1 - enter) * 260; m.x_ = x; m.p.set({ x, y: G + 10, s: 0.95, o: enter > 0 ? 1 : 0, walk: enter > 0 && enter < 1 ? t * 28 + m.i : undefined, armF: 16 + look * 30, armB: 8, head: -look * 6, blink: blinkAt(T, m.seed) }); });
      const ringK = es(t, 4.05, 4.5);
      drawRing(big, ringK); drawRing(mid, es(t, 4.2, 4.55));
      vis(big, { x: 790, y: 520, s: 1, sx: 1.32, o: ringK > 0 ? 1 : 0 });
      const jhx = jxs + 2, jhy = G + 6 - 130 * 1.08;
      vis(mid, { x: jhx, y: jhy - 14, s: 1, o: ringK > 0 ? 1 : 0 });
      vis(glowJ, { x: jhx, y: jhy - 30, s: 0.6 + see * 0.4 + ringK * 0.3, o: es(t, 1.2, 1.5) * 0.6 + see * 0.4 });
      const who = [...D.map((m) => [m.x_ ?? m.x, G + 10, 0.95]), [cx, G + 4, 0.58]];
      small.forEach((sm, i) => {
        const [x, y, s] = who[i];
        const [hx, hy2] = headAt(x, y, s, false);
        const kin = es(t, 3.15 + i * 0.07, 3.35 + i * 0.07, ease.back);
        const into = es(t, 4.35 + i * 0.05, 4.6 + i * 0.05, ease.inOut);
        const chest = [x + 3 * s, y - 118 * s];
        vis(sm.soul, { x: lerp(hx, chest[0], into), y: lerp(hy2 - 44 * s - 8, chest[1], into) + (T ? Math.sin(T * 2 + i) * 1.5 : 0), s: kin * (1 - into * 0.3), o: kin > 0.01 ? 1 : 0 });
        drawRing(sm.ring, es(t, 4.3 + i * 0.05, 4.55 + i * 0.05));
        vis(sm.ring, { x: chest[0], y: chest[1], s: s * 1.1, o: into > 0 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, -120], [0.9, -110], [1.5, -60], [2, -40], [2.3, 40], [3, 40], [3.2, -40], [4, -40], [4.3, 0], [5, 0]]);
      S.cam.y = kf(t, [[0, 100], [0.9, 90], [1.5, 60], [2.1, 0], [3, 0], [4, 20], [5, 0]]);
      S.cam.z = kf(t, [[0, 1.45], [0.9, 1.4], [1.5, 1.3], [2.1, 1.05], [3, 1.05], [3.3, 1.12], [4, 1.12], [4.4, 1.0], [5, 1.0]]);
    };
  },
};
