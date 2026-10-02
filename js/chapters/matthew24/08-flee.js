// Mt 24,15–20 — Judea (Mark 13's set): the city in the middle, mountains left and right. A dark, ragged shape rises
// over the Temple, in the holy place, and a small scroll swings down with Daniel's name on it — let the reader
// understand. People stream out of the gates and up the mountain paths. The man on the roof does not go down into his
// house; the man in the field leaves his cloak on its post; a pregnant woman and a mother with her baby, slow on the
// path, are helped along. "Pray that your flight will not be in winter, nor on a Sabbath": a grey winter cloud and a
// Sabbath tag with its two candles come down on their strings — a woman kneels and prays, and they are hauled back up.
import { C, person, crowdPerson, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, grass, sun } from '../../assets/nature.js';
import { stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { jerusalem, along, woman, man, addToBody, flake, scrollOpen, word, sabbathTag, peak, roofHouse, fieldPatch, postCloak, abomination, INK, JG, tr, PI } from './lib.js';

const GY = JG;
const ML = [[640, 470], [520, 430], [420, 390], [330, 330], [260, 270], [200, 222]];
const MR = [[960, 470], [1080, 432], [1180, 384], [1270, 320], [1340, 262], [1400, 220]];

export default {
  id: 'mt24-flee',
  beats: [
    { v: 15 },
    { v: 16 },
    { v: 17 },
    { v: 18 },
    { v: 19 },
    { v: 20 },
  ],
  cam: { x: [-120, 150], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#b7b3a8', '#dccdb0', '#eadcc0'];
    const WINTER = ['#9fa7b3', '#c9ccd0', '#e3e3e0'];
    sky(S, SKY);
    const sk2 = sky(S, WINTER, { name: 'sky2' });
    sk2.layer.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: mix(C.sunRay, C.stone2, 0.4), disc: mix(C.sun, C.stone, 0.3) }), { x: 1230, y: -1500, len: 700 });

    /* the mountains of Judea with their paths */
    const mts = S.layer({ par: 0.08, sh: 3 });
    mts.add(`<g transform="translate(170 500)">${peak(c, 900, 420, mix(C.rock, C.dune, 0.35))}</g>`);
    mts.add(`<g transform="translate(1440 500)">${peak(c, 880, 440, mix(C.rock2, C.dune, 0.3))}</g>`);
    const pathD = (P) => c.ribbon(P, (u) => 10 - u * 6);
    mts.add(`<path d="${pathD(ML)}" fill="${mix(C.sand, C.cream, 0.4)}" opacity=".9"/><path d="${pathD(MR)}" fill="${mix(C.sand, C.cream, 0.4)}" opacity=".9"/>`);

    /* the city; the dark thing that rises in the holy place */
    const cityL = S.layer({ par: 0.12, sh: 3 });
    cityL.add(band(c, { y: 486, amps: [8, 4, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.dune, 0.3), x0: -1400, x1: 3000 }).markup);
    cityL.add(`<g transform="translate(700 474)">${jerusalem(c, 0.36, { tglow: false })}</g>`);
    const TX = 700 + 280 * 0.36, TY = 474 - 0.36 * 210;
    const dark = cityL.add(`<g transform="translate(0 -1500)">${abomination(c)}</g>`);
    const runners = Array.from({ length: 12 }, (_, i) => ({ i, side: i % 2 ? MR : ML, d: Math.floor(i / 2) * 0.09, seed: c.rr(0, 9), p: S.puppet(cityL.add(person(c, crowdPerson(c)))) }));

    /* Daniel's scroll swings down: let the reader understand */
    const readL = S.layer({ par: 0.2, sh: 5 });
    const scroll = readL.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V-30" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><circle r="70" fill="url(#warm-glow)"/>${scrollOpen(c, 84, 52)}<path d="${c.cut(c.ell(0, 0, 12, 6.5, 12), 0.3, 3)}" fill="${C.cream}"/><path d="${c.poly(c.circ(0, 0, 3.8, 8))}" fill="${INK}"/><g transform="translate(0 50)">${word(c, tr('prorok Daniel', 'Daniel the prophet'), { size: 16 })}</g></g>`);

    /* the near land: the house against the hill, the field, the path */
    const midL = S.layer({ par: 0.3, sh: 3 });
    midL.add(hillsWith(c, { y: 560, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.sand2, 0.3), trees: 16, treeColor: C.olive, treeH: 20, x0: -1400, x1: 3000 }).markup);
    const near = S.layer({ par: 0.45, sh: 4 });
    const gfn = c.wave(640, [5, 2], [700, 170]);
    near.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sand, 0.3)).out());
    near.add(sheet().p(c.cut([[-1400, GY], [-1400, 470], [100, 470], [250, 500], [340, 530], [360, 540], [360, GY]], 1, 10), mix(C.hillNear, C.rock, 0.35)).out() + olive(c, 140, 478, 0.8));
    near.add(roofHouse(c));
    near.add(fieldPatch(c));
    near.add(sheet().p(c.cut([[560, GY + 6], [700, 676], [900, 672], [1000, 680], [1000, 716], [900, 706], [700, 712], [560, GY + 34]], 1, 10), mix(C.sand, C.cream, 0.3)).out());
    near.add(grass(c, { x0: -600, x1: 2200, y: 640, fn: gfn, n: 30, h: 12, color: C.olive }));
    const cloakEl = near.add(`<g transform="translate(1016 600)">${postCloak(c, C.clayMantle)}</g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const roofMan = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, man(c, { robe: C.tealRobe })))) };
    const HOE = `<g transform="translate(0 -6) rotate(10)">${sheet().p(c.ribbon([[0, -40], [2, 70]], 4), C.wood3).p(c.cut([[-12, 66], [14, 64], [12, 86], [-10, 86]], 0.3, 4), mix(C.stone2, C.rock3, 0.4)).out()}</g>`;
    const FARMER = { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin4, belt: C.rope };
    const farmer = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, FARMER))) };
    const hoeHeld = S.puppet(P.add(person(c, { ...FARMER, holdF: HOE })));
    const hoeDown = P.add(`<g transform="translate(0 -1500)">${HOE}</g>`);
    const belly = `<path d="${c.cut(c.ell(22, -84, 16, 26, 16), 0.4, 5)}" fill="${C.roseRobe}"/>`;
    const baby = `<g transform="translate(6 -6)"><path d="${c.cut(c.ell(0, 0, 16, 10, 14), 0.4, 4)}" fill="${C.linen}"/><path d="${c.cut(c.circ(12, -4, 6.5, 10), 0.3, 3)}" fill="${C.skin}"/></g>`;
    const preg = { seed: c.rr(0, 9), p: S.puppet(P.add(addToBody(person(c, { robe: C.roseRobe, mantle: C.blushVeil, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin2 }), belly))) };
    const mom = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { robe: C.skyVeil, mantle: C.dustyBlue, hairStyle: 'veil', veil: C.dustyBlue, skin: C.skin3, holdF: baby }))) };
    const helper = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, man(c, { robe: C.sageRobe })))) };
    const pray = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...woman(c, { robe: C.mauve, veil: C.linen2 }), pose: 'kneel' }))) };
    const glowL = P.add(`<g transform="translate(0 -1500)"><ellipse rx="170" ry="110" fill="url(#warm-glow)"/></g>`);
    const prayUp = P.add(`<g transform="translate(0 -1500)"><path d="M-6 0L6 0L30 -700L-30 -700Z" fill="${C.lampGlow}" opacity=".3"/></g>`);

    /* winter and the Sabbath, on strings; snow */
    const winter = S.layer({ par: 0.2, sh: 5 });
    const wcl = [[540, 330, 460], [1080, 300, 500]].map(([x, y, w], i) => ({ x, y, i, el: hanging(winter, stormCloud(c, w, mix(C.stone2, C.skyBlue2, 0.4), mix(C.rock2, C.skyBlue2, 0.3)), { x, y: -1500, len: 600 }) }));
    const sab = hanging(winter, `<g transform="translate(0 -20) scale(1.25)">${sabbathTag(c, tr('szabat', 'Sabbath'))}</g>`, { x: 800, y: -1500, len: 500 });
    const snow = S.layer({ par: 0.6, sh: 1, flat: true, pad: 300 });
    let fl = '';
    for (let i = 0; i < 380; i++) fl += `<g transform="translate(${c.rr(-1400, 3000).toFixed(0)} ${c.rr(-900, 1700).toFixed(0)}) rotate(${c.rr(0, 60).toFixed(0)}) scale(${c.rr(0.6, 1.3).toFixed(2)})">${flake(c, 6)}</g>`;
    snow.add(fl);

    return (t, time) => {
      const T = time;
      const cold = es(t, 5.0, 5.35) * (1 - es(t, 5.82, 6.05));
      sk2.layer.fade(cold);
      pose(sunEl, { x: 1230, y: 170 + cold * 40, r: Math.sin(T * 0.7), o: 1 - cold * 0.6 });

      /* v15 — the dark thing rises in the holy place; Daniel's scroll */
      const dk = es(t, 0.05, 0.5, ease.out);
      pose(dark, { x: TX, y: TY + 34, sy: Math.max(0.001, dk), s: 0.62 + (T ? Math.sin(T * 0.9) * 0.01 * dk : 0), o: dk > 0.01 ? 1 : 0 });
      const rd = es(t, 0.4, 0.7, ease.back) * (1 - es(t, 1.05, 1.3));
      pose(scroll, { x: S.portrait ? 990 : 1030, y: lerp(-300, 220, rd), r: Math.sin(T * 1.2) * 4, o: rd > 0.01 ? 1 : 0 });

      /* v16 — out of the city and up into the mountains (they keep going) */
      runners.forEach((r) => {
        const u = seg(t, 1.05 + r.d, 2.6 + r.d * 2);
        const [x, y, d] = along(r.side, u);
        r.p.set({ x, y, s: 0.2 - u * 0.07, flip: d < 0, o: u > 0 && u < 0.98 ? 1 : 0, walk: u > 0 && u < 1 ? x * 0.35 : undefined, lean: 8 });
      });

      /* v17 — on the roof: a step toward the stair, a look down at the door, then away over the hill */
      const toStair = es(t, 2.05, 2.3), away = seg(t, 2.45, 2.95);
      const rx = away > 0 ? lerp(lerp(430, 548, toStair), 120, ease.in(away)) : lerp(430, 548, toStair);
      const ry = 520 - away * 60;
      roofMan.p.set({ x: rx, y: ry, s: 0.82, flip: away > 0, walk: (toStair > 0 && toStair < 1) || (away > 0 && away < 1) ? rx * 0.06 : undefined, amt: away > 0 ? 1.4 : 1, head: bump(t, 2.28, 2.5) * 16, armF: away > 0 ? 40 : 10, lean: away > 0 ? -6 : 0, o: away < 0.98 ? 1 : 0, blink: blinkAt(T, roofMan.seed) });

      /* v18 — in the field: the hoe drops, he runs for the mountains; the cloak stays on its post */
      const drop = es(t, 3.05, 3.2), run = seg(t, 3.22, 4.05);
      const fx = lerp(S.portrait ? 1085 : 1120, S.portrait ? 1115 : 1210, seg(t, 3.22, 3.75)) + seg(t, 3.75, 4.05) * 340;   // phone: he is still in sight at the end of his beat
      // phone: he only steps into his field as the camera turns to it (before that he stood half under the thread)
      hoeHeld.set({ x: S.portrait ? 1085 : 1120, y: 700, s: 0.9, flip: true, o: (1 - drop) * (S.portrait ? es(t, 2.85, 3.0) : 1), armF: 40 + (T ? Math.sin(T * 2) * 6 : 0) * (1 - drop), blink: blinkAt(T, farmer.seed) });
      farmer.p.set({ x: fx, y: 700 - run * 40, s: 0.9, flip: false, o: drop > 0 && run < 0.97 ? 1 : 0, walk: run > 0 ? fx * 0.06 : undefined, amt: 1.4, lean: -6, armF: 30, armB: 20, blink: blinkAt(T, farmer.seed) });
      pose(hoeDown, { x: S.portrait ? 1065 : 1100, y: lerp(640, 700, drop), r: lerp(-10, -80, drop), o: drop > 0 ? 1 : 0 });
      const wind = 1 + cold * 1.5;
      pose(cloakEl, { x: 1016, y: 600, r: (T ? Math.sin(T * 1.8) * 5 : 0) * wind + 4 + bump(t, 3.1, 3.6) * 8 });

      /* v19 — slow on the path, helped along; a gentle light round them */
      const w = seg(t, 4.02, 5.0);
      const px = lerp(1010, 640, w);
      const slow = w > 0 && w < 1;
      preg.p.set({ x: px, y: 694, s: 0.92, flip: true, walk: slow ? px * 0.035 : undefined, amt: 0.5, lean: 4, armF: 30, armB: 26, o: w > 0 ? 1 : 0, blink: blinkAt(T, preg.seed) });
      mom.p.set({ x: px + 90, y: 700, s: 0.92, flip: true, walk: slow ? px * 0.035 + 1 : undefined, amt: 0.5, armF: 72, armB: 40, head: 10, o: w > 0 ? 1 : 0, blink: blinkAt(T, mom.seed) });
      helper.p.set({ x: px - 80, y: 692, s: 0.94, flip: true, walk: slow ? px * 0.035 + 2 : undefined, amt: 0.6, armB: 60 + bump(t, 4.2, 4.9) * 20, head: 8, o: w > 0 ? 1 : 0, blink: blinkAt(T, helper.seed) });
      pose(glowL, { x: px + 40, y: 600, o: es(t, 4.1, 4.4) * (1 - es(t, 5.8, 6)) * 0.9 });

      /* v20 — the winter cloud and the Sabbath come down; she prays; they are hauled back up */
      const pr = es(t, 5.12, 5.3);
      pray.p.set({ x: 920, y: 704, s: 0.9, flip: true, armB: pr * 150, armF: pr * 70, head: -pr * 12, o: pr > 0.01 ? 1 : 0, blink: blinkAt(T, pray.seed) });
      pose(prayUp, { x: 916, y: 560, o: pr * es(t, 5.4, 5.6) * (1 - es(t, 6.0, 6.1)) });
      const up = es(t, 5.8, 6.05, ease.in);
      wcl.forEach((cl) => {
        const down = es(t, 4.95 + cl.i * 0.08, 5.3 + cl.i * 0.08, ease.out);
        pose(cl.el, { x: cl.x, y: lerp(-400, cl.y, down) - up * 700, r: (1 - down) * 4 + up * 4 * (cl.i ? 1 : -1), o: down > 0.01 ? 1 : 0 });
      });
      const sd = es(t, 5.08, 5.4, ease.back);
      pose(sab, { x: 800, y: lerp(-400, 200, sd) - up * 700, r: Math.sin(T * 1.1) * 3 * sd, o: sd > 0.01 ? 1 : 0 });
      snow.fade(cold);
      snow.shift(T ? Math.sin(T * 0.4) * 30 : 0, T ? ((T * 60) % 600) - 300 : 0);

      /* the camera: the city, the roof, the field, the path */
      S.cam.x = -es(t, 1.9, 2.2) * 110 * (1 - es(t, 2.9, 3.1)) + es(t, 2.95, 3.2) * (S.portrait ? 145 : 110) * (1 - es(t, 3.9, 4.15));
      S.cam.z = 1 + es(t, -0.2, 0.4) * 0.08 * (1 - es(t, 0.9, 1.3)) + es(t, 1.9, 2.2) * 0.05 * (1 - es(t, 3.9, 4.15));
      S.cam.y = -es(t, -0.2, 0.4) * 30 * (1 - es(t, 0.9, 1.3)) + es(t, 1.9, 2.2) * 20 * (1 - es(t, 3.9, 4.15));
    };
  },
};
