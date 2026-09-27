// Mk 13,14–18 — Judea: the city in the middle, mountains left and right. A dark, ragged shape rises
// where it ought not stand (a small scroll swings down: let the reader understand). People stream out
// and up into the mountains; the man on the roof does not go down into his house; the man in the field
// leaves his cloak on the post; a pregnant woman and a mother with her baby, slow on the path, helped
// along; and a grey winter cloud comes down on its strings — someone kneels and prays, and it is
// hauled back up.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, grass, sun } from '../../assets/nature.js';
import { stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { jerusalem, along, woman, man, addToBody, flake, scrollOpen, INK, PI } from './lib.js';

const GY = 690;
const ML = [[640, 470], [520, 430], [420, 390], [330, 330], [260, 270], [200, 222]];     // path up the left mountain (far layer)
const MR = [[960, 470], [1080, 432], [1180, 384], [1270, 320], [1340, 262], [1400, 220]]; // …and the right

/** a tall paper mountain with a zig-zag path; origin at the middle of its foot */
function peak(c, w, h, col) {
  const s = sheet();
  const pts = [[-w / 2, 0]];
  for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([-w / 2 + u * w, -h * Math.pow(Math.sin(u * PI), 1.3) + c.rr(-10, 10)]); }
  pts.push([w / 2, 0]);
  s.p(c.cut(pts, 1.2, 10), col);
  s.p(c.cut([[-w * 0.05, -h * 0.98], [w * 0.12, -h * 0.84], [w * 0.2, -h * 0.55], [w * 0.04, -h * 0.66]], 0.8, 6), shade(col, 0.2));
  s.p(c.cut([[w * 0.2, -h * 0.5], [w * 0.36, -h * 0.28], [w * 0.4, -h * 0.05], [w * 0.2, -h * 0.12]], 0.8, 6), shade(col, -0.12));
  return s.out();
}
/** the flat-roofed house with an outside stair, built against the hill; origin world */
function roofHouse(c) {
  const s = sheet();
  const x0 = 360, x1 = 560, top = 528;
  s.p(c.cut([[x0, GY + 4], [x0, top], [x1, top], [x1, GY + 4]], 0.5, 8), mix(C.plaster, C.sand, 0.2));
  s.p(c.cut([[x0 - 6, top - 8], [x1 + 6, top - 8], [x1 + 6, top + 2], [x0 - 6, top + 2]], 0.3, 8), C.roof);
  // parapet
  s.p(c.cut(c.rect(x0 - 2, top - 20, 30, 12), 0.3, 5) + c.cut(c.rect(x1 - 30, top - 20, 32, 12), 0.3, 5), C.plaster2);
  // the door, open: things inside
  s.p(c.cut([[440, GY + 2], [440, 610], ...c.arc(462, 610, 22, 18, PI, 2 * PI, 8), [484, GY + 2]], 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
  s.p(c.cut([[448, GY], [448, 664], [456, 656], [464, 664], [464, GY]], 0.3, 4), C.pot);
  s.p(c.cut(c.ell(474, 672, 8, 12, 10), 0.3, 3), C.basket);
  s.x(c.poly(c.rect(390, 580, 22, 18)) + c.poly(c.rect(510, 580, 22, 18)), mix(C.soilDark, C.wood2, 0.3));
  // outside stair down the right side
  let st = '';
  for (let i = 0; i < 8; i++) st += c.cut(c.rect(x1 + i * 11, top + 4 + i * 20, 22, 20), 0.3, 4);
  s.p(st, C.plaster2);
  return s.out();
}
/** the field with furrows and a post; origin world */
function field(c) {
  const s = sheet();
  s.p(c.cut([[980, 646], [1480, 640], [1520, 730], [960, 734]], 0.8, 10), mix(C.soil, C.sand2, 0.35));
  let fur = '';
  for (let i = 0; i < 6; i++) fur += c.ribbon([[990 - i * 4, 656 + i * 13], [1486 + i * 5, 650 + i * 13]], 2.2);
  s.x(fur, shade(C.soil, -0.15), 'opacity=".6"');
  let sp = '';
  for (let i = 0; i < 40; i++) { const x = c.rr(1000, 1470), y = c.rr(652, 722); sp += c.poly([[x, y], [x - 2, y - 8], [x + 1, y - 10], [x + 2, y]]); }
  s.x(sp, C.wheatGreen);
  s.p(c.cut(c.rect(1012, 598, 9, 94), 0.3, 5), C.wood2);
  return s.out();
}
/** the cloak left on the post; origin at the top of the post */
function postCloak(c, col) {
  const s = sheet();
  s.p(c.cut([[-10, -4], [16, -6], [30, 10], [26, 60], [34, 88], [8, 80], [-6, 90], [-20, 78], [-14, 40], [-18, 8]], 1, 6), col);
  s.x(c.ribbon([[0, 6], [2, 80]], 2) + c.ribbon([[14, 8], [18, 74]], 2), shade(col, -0.2), 'opacity=".5"');
  return s.out();
}

export default {
  id: 'm13-flee',
  beats: [
    { v: 14, text: 'A gdy ujrzycie ohydę spustoszenia, zalegającą tam, gdzie być nie powinna - kto czyta, niech rozumie -' },
    { v: 14, cont: true, text: 'wtedy ci, którzy będą w Judei, niech uciekają w góry.' },
    { v: 15 },
    { v: 16 },
    { v: 17 },
    { v: 18 },
  ],
  cam: { x: [-120, 120], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#b7b3a8', '#dccdb0', '#eadcc0'];
    const WINTER = ['#9fa7b3', '#c9ccd0', '#e3e3e0'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: mix(C.sunRay, C.stone2, 0.4), disc: mix(C.sun, C.stone, 0.3) }), { x: 1230, y: 170, len: 700 });

    /* the mountains of Judea with their paths */
    const mts = S.layer({ par: 0.08, sh: 3 });
    mts.add(peak(c, 900, 420, mix(C.rock, C.dune, 0.35)).replace(/^/, '<g transform="translate(170 500)">') + '</g>');
    mts.add(peak(c, 880, 440, mix(C.rock2, C.dune, 0.3)).replace(/^/, '<g transform="translate(1440 500)">') + '</g>');
    const pathD = (P) => c.ribbon(P, (u) => 10 - u * 6);
    mts.add(`<path d="${pathD(ML)}" fill="${mix(C.sand, C.cream, 0.4)}" opacity=".9"/><path d="${pathD(MR)}" fill="${mix(C.sand, C.cream, 0.4)}" opacity=".9"/>`);

    /* the city in the middle; the dark thing that rises where it ought not stand */
    const cityL = S.layer({ par: 0.12, sh: 3 });
    cityL.add(band(c, { y: 486, amps: [8, 4, 2], lens: [900, 300, 120], color: mix(C.hillFar, C.dune, 0.3), x0: -1400, x1: 3000 }).markup);
    cityL.add(`<g transform="translate(700 474)">${jerusalem(c, 0.36, { tglow: false })}</g>`);
    const TX = 700 + 280 * 0.36, TY = 474 - 0.36 * 210;
    const dark = cityL.add(`<g>${abomination(c)}</g>`);
    const runners = Array.from({ length: 12 }, (_, i) => ({ i, side: i % 2 ? MR : ML, d: Math.floor(i / 2) * 0.09, seed: c.rr(0, 9), p: S.puppet(cityL.add(person(c, crowdPerson(c)))) }));

    /* a small scroll swings down: let the reader understand */
    const readL = S.layer({ par: 0.2, sh: 5 });
    const scroll = readL.add(`<g><path d="M0 -1500V-30" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><circle r="60" fill="url(#warm-glow)"/>${scrollOpen(c, 70, 46)}<path d="${c.cut(c.ell(0, 0, 11, 6, 12), 0.3, 3)}" fill="${C.cream}"/><path d="${c.poly(c.circ(0, 0, 3.6, 8))}" fill="${INK}"/></g>`);

    /* the near land: the house against the hill, the field, the path */
    const midL = S.layer({ par: 0.3, sh: 3 });
    midL.add(hillsWith(c, { y: 560, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.sand2, 0.3), trees: 16, treeColor: C.olive, treeH: 20, x0: -1400, x1: 3000 }).markup);
    const near = S.layer({ par: 0.45, sh: 4 });
    const gfn = c.wave(640, [5, 2], [700, 170]);
    near.add(sheet().p(c.ridge(gfn, -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sand, 0.3)).out());
    // the hill behind the house, rising to the roof
    near.add(sheet().p(c.cut([[-1400, GY], [-1400, 470], [100, 470], [250, 500], [340, 530], [360, 540], [360, GY]], 1, 10), mix(C.hillNear, C.rock, 0.35)).out() + olive(c, 140, 478, 0.8));
    near.add(roofHouse(c));
    near.add(field(c));
    near.add(sheet().p(c.cut([[560, GY + 6], [700, 676], [900, 672], [1000, 680], [1000, 716], [900, 706], [700, 712], [560, GY + 34]], 1, 10), mix(C.sand, C.cream, 0.3)).out());
    near.add(grass(c, { x0: -600, x1: 2200, y: 640, fn: gfn, n: 30, h: 12, color: C.olive }));
    const cloakEl = near.add(`<g>${postCloak(c, C.clayMantle)}</g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const roofMan = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, man(c, { robe: C.tealRobe })))) };
    const HOE = `<g transform="translate(0 -6) rotate(10)">${sheet().p(c.ribbon([[0, -40], [2, 70]], 4), C.wood3).p(c.cut([[-12, 66], [14, 64], [12, 86], [-10, 86]], 0.3, 4), mix(C.stone2, C.rock3, 0.4)).out()}</g>`;
    const farmer = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin4, belt: C.rope }))) };
    const hoeHeld = S.puppet(P.add(person(c, { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin4, belt: C.rope, holdF: HOE })));
    const hoeDown = P.add(`<g>${HOE}</g>`);
    // the pregnant woman and the mother with her baby, and a man who helps
    const belly = `<path d="${c.cut(c.ell(22, -84, 16, 26, 16), 0.4, 5)}" fill="${C.roseRobe}"/>`;
    const baby = `<g transform="translate(6 -6)"><path d="${c.cut(c.ell(0, 0, 16, 10, 14), 0.4, 4)}" fill="${C.linen}"/><path d="${c.cut(c.circ(12, -4, 6.5, 10), 0.3, 3)}" fill="${C.skin}"/></g>`;
    const preg = { seed: c.rr(0, 9), p: S.puppet(P.add(addToBody(person(c, { robe: C.roseRobe, mantle: C.blushVeil, hairStyle: 'veil', veil: C.blushVeil, skin: C.skin2 }), belly))) };
    const mom = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { robe: C.skyVeil, mantle: C.dustyBlue, hairStyle: 'veil', veil: C.dustyBlue, skin: C.skin3, holdF: baby }))) };
    const helper = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, man(c, { robe: C.sageRobe })))) };
    const pray = { seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...woman(c, { robe: C.mauve, veil: C.linen2 }), pose: 'kneel' }))) };
    const glowL = P.add(`<g><ellipse rx="170" ry="110" fill="url(#warm-glow)"/></g>`);

    /* winter: a grey cloud on strings, snow */
    const winter = S.layer({ par: 0.2, sh: 5 });
    const wcl = [[580, 230, 520], [1080, 200, 560]].map(([x, y, w], i) => ({ x, y, i, el: hanging(winter, stormCloud(c, w, mix(C.stone2, C.skyBlue2, 0.4), mix(C.rock2, C.skyBlue2, 0.3)), { x, y, len: 600 }) }));
    const snow = S.layer({ par: 0.6, sh: 1, flat: true, pad: 300 });
    let fl = '';
    for (let i = 0; i < 420; i++) fl += `<g transform="translate(${c.rr(-1400, 3000).toFixed(0)} ${c.rr(-900, 1700).toFixed(0)}) rotate(${c.rr(0, 60).toFixed(0)}) scale(${c.rr(0.6, 1.3).toFixed(2)})">${flake(c, 6)}</g>`;
    snow.add(fl);
    const prayUp = P.add(`<g><path d="M-6 0L6 0L30 -700L-30 -700Z" fill="${C.lampGlow}" opacity=".3"/></g>`);

    return (t, time) => {
      const T = time;
      const cold = es(t, 5.0, 5.35) * (1 - es(t, 5.6, 5.95));
      sk.blend(SKY, WINTER, cold);
      pose(sunEl, { x: 1230, y: 170 + cold * 40, r: Math.sin(T * 0.7), o: 1 - cold * 0.6 });

      /* the dark thing rises over the Temple (beat 0) */
      const dk = es(t, 0.05, 0.5, ease.out);
      pose(dark, { x: TX, y: TY + 34, sy: Math.max(0.001, dk), s: 0.62 + Math.sin(T * 0.9) * 0.01 * dk, o: dk > 0.01 ? 1 : 0 });
      const rd = es(t, 0.5, 0.8, ease.back) * (1 - es(t, 1.05, 1.3));
      pose(scroll, { x: 1010, y: lerp(-300, 230, rd), r: Math.sin(T * 1.2) * 4, o: rd > 0.01 ? 1 : 0 });

      /* people stream out and up the mountains (beat 1, and they keep going) */
      runners.forEach((r) => {
        const u = seg(t, 1.05 + r.d, 2.6 + r.d * 2);
        const [x, y, d] = along(r.side, u);
        r.p.set({ x, y, s: 0.2 - u * 0.07, flip: d < 0, o: u > 0 && u < 0.98 ? 1 : 0, walk: u > 0 && u < 1 ? x * 0.35 : undefined, lean: 8 });
      });

      /* v15: on the roof — a step toward the stair, a look down at the door, then away over the hill */
      const toStair = es(t, 2.05, 2.3), away = seg(t, 2.45, 2.95);
      const rx = away > 0 ? lerp(lerp(430, 548, toStair), 120, ease.in(away)) : lerp(430, 548, toStair);
      const ry = 520 - away * 60;
      roofMan.p.set({ x: rx, y: ry, s: 0.82, flip: away > 0, walk: (toStair > 0 && toStair < 1) || (away > 0 && away < 1) ? rx * 0.06 : undefined, amt: away > 0 ? 1.4 : 1, head: bump(t, 2.28, 2.5) * 16, armF: away > 0 ? 40 : 10, lean: away > 0 ? -6 : 0, o: away < 0.98 ? 1 : 0, blink: blinkAt(T, roofMan.seed) });

      /* v16: in the field — the hoe drops, he runs for the mountains; the cloak stays on its post */
      const drop = es(t, 3.05, 3.2), run = seg(t, 3.25, 4.05);
      const fx = lerp(1120, 1540, ease.in(run));
      hoeHeld.set({ x: 1120, y: 700, s: 0.9, flip: true, o: 1 - drop, armF: 40 + Math.sin(T * 2) * 6 * (1 - drop), blink: blinkAt(T, farmer.seed) });
      farmer.p.set({ x: fx, y: 700 - run * 40, s: 0.9, flip: false, o: drop > 0 && run < 0.97 ? 1 : 0, walk: run > 0 ? fx * 0.06 : undefined, amt: 1.4, lean: -6, armF: 30, armB: 20, blink: blinkAt(T, farmer.seed) });
      pose(hoeDown, { x: 1100, y: lerp(640, 700, drop), r: lerp(-10, -80, drop), o: drop > 0 ? 1 : 0 });
      const wind = 1 + cold * 1.5;
      pose(cloakEl, { x: 1016, y: 600, r: Math.sin(T * 1.8) * 5 * wind + 4, sx: 1 + Math.sin(T * 2.3) * 0.04 });

      /* v17: slow on the path, helped along; a gentle light round them */
      const w = seg(t, 4.02, 5.0);
      const px = lerp(1010, 640, w);
      const slow = w > 0 && w < 1;
      preg.p.set({ x: px, y: 694, s: 0.92, flip: true, walk: slow ? px * 0.035 : undefined, amt: 0.5, lean: 4, armF: 30, armB: 26, o: w > 0 ? 1 : 0, blink: blinkAt(T, preg.seed) });
      mom.p.set({ x: px + 90, y: 700, s: 0.92, flip: true, walk: slow ? px * 0.035 + 1 : undefined, amt: 0.5, armF: 72, armB: 40, head: 10, o: w > 0 ? 1 : 0, blink: blinkAt(T, mom.seed) });
      helper.p.set({ x: px - 80, y: 692, s: 0.94, flip: true, walk: slow ? px * 0.035 + 2 : undefined, amt: 0.6, armB: 60 + bump(t, 4.2, 4.9) * 20, head: 8, o: w > 0 ? 1 : 0, blink: blinkAt(T, helper.seed) });
      pose(glowL, { x: px + 40, y: 600, o: es(t, 4.1, 4.4) * (1 - es(t, 5.8, 6)) * 0.9 });

      /* v18: the winter cloud comes down; someone prays; it is hauled back up */
      const pr = es(t, 5.15, 5.35);
      pray.p.set({ x: 920, y: 704, s: 0.9, flip: true, armB: pr * 150, armF: pr * 70, head: -pr * 12, o: pr > 0.01 ? 1 : 0, blink: blinkAt(T, pray.seed) });
      pose(prayUp, { x: 916, y: 560, o: pr * es(t, 5.4, 5.6) * (1 - es(t, 5.9, 6)) });
      wcl.forEach((cl) => {
        const down = es(t, 4.95 + cl.i * 0.08, 5.3 + cl.i * 0.08, ease.out), up = es(t, 5.55, 5.9, ease.in);
        pose(cl.el, { x: cl.x, y: lerp(-400, cl.y, down) - up * 600, r: (1 - down) * 4 + up * 4 * (cl.i ? 1 : -1), o: down > 0.01 ? 1 : 0 });
      });
      snow.fade(cold);
      snow.shift(Math.sin(T * 0.4) * 30, ((T * 60) % 600) - 300);

      /* the camera: the city, the roof, the field, the path */
      S.cam.x = -es(t, 1.9, 2.2) * 110 * (1 - es(t, 2.9, 3.1)) + es(t, 2.95, 3.2) * 110 * (1 - es(t, 3.9, 4.15));
      S.cam.z = 1 + es(t, -0.2, 0.4) * 0.08 * (1 - es(t, 0.9, 1.3)) + es(t, 1.9, 2.2) * 0.05 * (1 - es(t, 3.9, 4.15));
      S.cam.y = -es(t, -0.2, 0.4) * 30 * (1 - es(t, 0.9, 1.3)) + es(t, 1.9, 2.2) * 20 * (1 - es(t, 3.9, 4.15));
    };
  },
};

/** the "abomination": an abstract, ragged column of dark torn paper with wisps (origin: its foot) */
function abomination(c) {
  const s = sheet();
  const L = [], R = [];
  const n = 9;
  for (let i = 0; i <= n; i++) {
    const u = i / n, y = -u * 150, w = 34 * (1 - u * 0.45) + c.rr(-6, 6);
    L.push([-w + c.rr(-8, 4), y]); R.push([w + c.rr(-4, 8), y]);
  }
  const top = [[R[n][0] - 6, -164], [8, -176], [-6, -168], [L[n][0] + 4, -160]];
  s.p(c.cut([...L, ...top, ...R.reverse()], 2.2, 4), mix(INK, C.night2, 0.3));
  let wisps = '';
  for (let i = 0; i < 5; i++) { const x = c.rr(-40, 40), y = c.rr(-150, -30), d = i % 2 ? 1 : -1; wisps += c.ribbon(c.qbez([x, y], [x + d * 40, y - 20], [x + d * 70, y - 60], 8), (u) => 6 * (1 - u) + 0.5); }
  s.p(wisps, mix(INK, C.plumRobe, 0.3));
  s.x(c.cut(c.blob(0, -96, 10, 16, 9, 0.3), 0.8, 3), mix(INK, C.night, 0.5));
  return s.out();
}
