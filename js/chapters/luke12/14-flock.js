// Łk 12,32–34 — evening on the rise. The disciples sit close round Jesus, a little flock of sheep huddled among them.
// "Do not be afraid, little flock, for it is your Father's good pleasure to give you the Kingdom": behind them on the
// hill a golden gate is let down, its two doors swing open and light pours out through it over the little flock.
// "Sell what you have and give alms": Matthew hands his fine mantle and a silver jug to a merchant, who counts coins into
// his palm — and he pours them straight into a beggar's bowl. "Make yourselves purses that do not grow old, a treasure in
// the heavens that does not fail, where no thief comes near and no moth destroys": the coins rise out of the bowl as
// little golden purses into a chest on a cloud high above, which opens to take them; a thief's shadow reaches up after
// them and cannot touch them, a moth flutters up and falls back. "For where your treasure is, there will your heart be
// also": a small red heart rises from Matthew up to the chest.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { sheep } from '../mark6/lib.js';
import { cloud } from '../../assets/nature.js';
import { behindOf, plainSet, RISE, EVENING, seatDisciples, poseSeated, moneyBag, coin, chest, heart, emptyBowl, figure, newMantle, headAt, hand, voiceRings, halo, warm, manO, silh, PI } from './lib.js';

const JX = 800;
const GATE = [800, 470];
const MT = { x: 540, y: 716 }, MER = 450, BEG = 1110, MT2 = 1030;
const SH = [[655, 726, 0.8], [750, 722, 0.78], [852, 726, 0.8], [945, 728, 0.8], [575, 724, 0.72], [1030, 724, 0.74]];

function gateLeaf(c, dir) {
  const s = sheet();
  s.p(c.cut([[0, 0], [0, -150], [dir * 30, -176], [dir * 56, -150], [dir * 56, 0]].map(([x, y]) => [x, y]), 0.4, 6), mix(C.sun, C.ochre, 0.3));
  s.x(c.ribbon([[dir * 12, -10], [dir * 12, -140]], 2) + c.ribbon([[dir * 40, -10], [dir * 40, -140]], 2), shade(C.sun, -0.25), 'opacity=".6"');
  return s.out();
}
function gateFrame(c) {
  const s = sheet();
  s.p(c.cut([[-80, 0], [-80, -160], [-60, -200], [0, -226], [60, -200], [80, -160], [80, 0], [58, 0], [58, -150], [0, -178], [-58, -150], [-58, 0]], 0.4, 6), mix(C.sun, C.haloRim, 0.4));
  s.p(c.cut(c.star(0, -236, 12, 5, 6, 0), 0.2, 3), C.sun);
  return `<path d="${c.poly([[-58, 0], [-58, -150], [0, -178], [58, -150], [58, 0]])}" fill="#fff4d2"/>${s.out()}`;
}
function moth(c) {
  return sheet().p(c.cut(c.ell(-7, -4, 9, 6, 10, -0.5), 0.3, 3) + c.cut(c.ell(7, -4, 9, 6, 10, 0.5), 0.3, 3), mix(C.stone2, C.wood3, 0.4)).p(c.cut(c.ell(0, 0, 2.4, 8, 8), 0.2, 2), C.wood2).out();
}

export default {
  id: 'lk12-flock',
  beats: [
    { v: 32 },
    { v: 33, text: 'Sprzedajcie wasze mienie i dajcie jałmużnę!' },
    { v: 33, cont: true, text: 'Sprawcie sobie trzosy, które nie niszczeją, skarb niewyczerpany w niebie, gdzie złodziej się nie dostaje ani mól nie niszczy.' },
    { v: 34 },
  ],
  cam: { x: [-40, 40], y: [-90, 40], z: [1, 1.12] },
  build(S) {
    const P = plainSet(S, { skyCols: EVENING, crowd: false, near: false });
    const c = S.c;
    /* the gate of the Kingdom, behind them on the hill */
    const gL = behindOf(S.layer({ par: 0.4, sh: 4 }), P.crowdL);
    const gLight = behindOf(S.layer({ par: 0.4, sh: 0, flat: true }), gL);
    const glow = gLight.add(`<g opacity="0">${halo(190, 1)}</g>`);
    const frame = gL.add(`<g transform="translate(0 -1500)"><path d="M-60 -2400V-200M60 -2400V-200" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${gateFrame(c)}</g>`);
    const leaves = [-1, 1].map((d) => ({ d, el: gL.add(`<g>${gateLeaf(c, -d)}</g>`) }));
    /* the flock: the disciples and the sheep */
    const dis = seatDisciples(S, P).filter((d) => d.k !== 'matthew' && d.k !== 'thomas');
    const flock = SH.map(([x, y, s], i) => ({ i, x, y, s, el: P.act.add(`<g>${sheep(c)}</g>`) }));
    const matt = S.puppet(P.act.add(person(c, { ...CAST.matthew, mantle: C.sun, mantleArm: true })));
    const matt2 = S.puppet(P.act.add(person(c, { ...CAST.matthew })));
    const merchant = S.puppet(P.act.add(person(c, { robe: C.linen2, mantle: C.tealRobe, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.terracotta, beard: 'full', skin: C.skin3, belt: C.leather })));
    const beggar = S.puppet(P.act.add(person(c, { robe: mix(C.stone2, C.sand2, 0.4), hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.rope, pose: 'sit' })));
    const bowlEl = P.act.add(`<g>${emptyBowl(c, 30)}</g>`);
    const coins = [0, 1, 2, 3].map(() => P.fx.add(`<g opacity="0">${coin(c, 6)}</g>`));
    const voice = voiceRings(P.act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    /* the treasure in heaven */
    const hv = P.hangL;
    const store = hv.add(`<g transform="translate(0 -1500)"><path d="M-50 -2400V-60M50 -2400V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${halo(150, 1)}<g transform="translate(0 16)">${cloud(c, 240, '#fbf1d8', '#efd9a8')}</g><g transform="scale(1.1)">${chest(c, { w: 80, h: 44 })}</g></g>`);
    const lid = store.querySelector('.lid'), sGlow = store.querySelector('.glow');
    const purses = [0, 1, 2, 3].map(() => P.fx.add(`<g opacity="0"><g transform="scale(.6)">${moneyBag(c)}</g></g>`));
    const thief = P.fx.add(`<g opacity="0">${silh(figure(c, manO(c), { armF: 150, armB: 120, head: -20 }), '#3b2a22')}</g>`);
    const cloakEl = P.fx.add(`<g opacity="0"><g transform="scale(.36)">${newMantle(c, C.sun)}</g></g>`);
    const mothEl = P.fx.add(`<g opacity="0">${moth(c)}</g>`);
    const love = P.fx.add(`<g opacity="0">${heart(c, 13)}</g>`);

    return (t, time) => {
      const T = time;
      P.update(T);
      /* v32 — fear not, little flock: the gate of the Kingdom opens */
      const gk = es(t, 0.1, 0.4, ease.out);
      const gy = lerp(-1500, GATE[1], gk);
      pose(frame, { x: GATE[0], y: gy });
      const open = es(t, 0.45, 0.75);
      leaves.forEach((l) => pose(l.el, { x: GATE[0] + l.d * 58, y: gy, sx: 1 - open * 0.8 }));
      pose(glow, { x: GATE[0], y: GATE[1] - 90, o: open });
      const bless = bump(t, 0.05, 0.95);
      const teach = bump(t, 1.05, 1.9) * 0.6 + bump(t, 3.05, 3.8);
      P.jesus.set({ x: JX, y: RISE, s: P.J.s, armF: 16 + bless * 60 + teach * 40, armB: 8 + bless * 90 + teach * 30, head: -bless * 6, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, RISE, P.J.s, false);
      voice(jhx, jhy, bless * 0.8 + teach * 0.6, T, { spread: 2 });
      poseSeated(dis, T, (d) => ({ head: -6 - open * 10 * (1 - es(t, 1.0, 1.2)), armF: 22 + open * 20 }));
      flock.forEach((f) => pose(f.el, { x: f.x, y: f.y, s: f.s, sx: f.x > 800 ? -1 : 1 }));

      /* v33a — sell, and give alms */
      const come = es(t, 1.02, 1.3), hand1 = es(t, 1.3, 1.5), pay = es(t, 1.45, 1.65), give = es(t, 1.7, 1.9);
      const mx = lerp(200, MER, come);
      merchant.set({ x: mx, y: 712, s: 0.96, o: seg(t, 1.0, 1.04), walk: come > 0 && come < 1 ? mx * 0.05 : undefined, armF: 20 + hand1 * 50 + pay * 20, armB: 10 + hand1 * 60, head: 4, blink: blinkAt(T, 3) });
      const bx = lerp(1300, BEG, es(t, 1.05, 1.35));
      beggar.set({ x: bx, y: 716, s: 0.92, flip: true, o: seg(t, 1.0, 1.04), armF: 50 + give * 20, armB: 10, head: 6 - give * 10, blink: blinkAt(T, 4) });
      pose(bowlEl, { x: bx - 40, y: 712 - 52, s: 1, o: seg(t, 1.0, 1.04) });
      const gone = es(t, 1.35, 1.45);
      const walkToB = es(t, 1.65, 1.8);
      const mtx = lerp(MT.x, MT2, walkToB);
      const mset = { x: mtx, y: MT.y, s: 0.96, flip: walkToB < 0.5 && t > 1.2 && t < 1.65, walk: walkToB > 0 && walkToB < 1 ? mtx * 0.05 : undefined, armF: 20 + hand1 * 60 * (1 - gone) + give * 70, armB: 10, head: 4 - es(t, 3.1, 3.4) * 14, blink: blinkAt(T, 1) };
      matt.set({ ...mset, o: 1 - gone });
      matt2.set({ ...mset, o: gone });
      const [mhx, mhy] = hand(MT.x, MT.y, 0.96, true, 80);
      const [ahx, ahy] = hand(mx, 712, 0.96, false, 70);
      pose(cloakEl, { x: lerp(mhx, ahx, hand1), y: lerp(mhy - 20, ahy - 10, hand1), r: -20 * hand1, o: hand1 > 0.02 ? 1 : 0 });
      coins.forEach((co, i) => {
        const a = seg(t, 1.46 + i * 0.03, 1.6 + i * 0.03), b = seg(t, 1.8 + i * 0.03, 1.92 + i * 0.03);
        const [ex, ey] = [bx - 40, 712 - 60];
        const x = b > 0 ? lerp(mtx + 50, ex, b) : lerp(mx + 50, mhx, a), y = b > 0 ? lerp(mhy - 10, ey, b) - Math.sin(b * PI) * 30 : lerp(mhy - 20, mhy - 6, a);
        pose(co, { x, y, o: a > 0 && b < 1 ? 1 : 0 });
      });

      /* v33b — purses that do not wear out, a treasure in heaven */
      const SX = 1000, SY = 220;
      const sk = es(t, 2.02, 2.3, ease.out);
      pose(store, { x: SX, y: lerp(-1500, SY, sk), r: time ? Math.sin(T * 0.6) * 0.8 : 0, oy: 0 });
      pose(lid, { x: -45, y: -44, r: -es(t, 2.3, 2.45) * 100 });
      fade(sGlow, es(t, 2.35, 2.6));
      purses.forEach((p, i) => {
        const k = es(t, 2.2 + i * 0.08, 2.6 + i * 0.08);
        pose(p, { x: lerp(bx - 40, SX + (i - 1.5) * 12, k) + Math.sin(k * PI) * (i - 1.5) * 30, y: lerp(640, SY - 60, k), s: 0.8 + k * 0.3, o: k > 0 && k < 0.97 ? 1 : 0 });
      });
      const reach = bump(t, 2.5, 3.0);
      pose(thief, { x: 1150, y: 724 - reach * 40, s: 1, sx: -1, o: reach * 0.75 });
      const mk = seg(t, 2.55, 2.98);
      pose(mothEl, { x: SX - 120 + mk * 60, y: lerp(560, SY + 10, Math.sin(mk * PI) * 0.9) + (time ? Math.sin(T * 12) * 4 : 0), r: Math.sin(mk * 20) * 20, o: mk > 0 && mk < 1 ? 1 : 0 });

      /* v34 — where your treasure is, there your heart */
      const hk = es(t, 3.15, 3.7);
      const [mx2, my2] = headAt(MT2, MT.y, 0.96, false);
      pose(love, { x: lerp(mx2 + 4, SX, hk), y: lerp(my2 + 60, SY - 40, hk), s: es(t, 3.05, 3.15, ease.back) * (1 + hk * 0.3), o: es(t, 3.05, 3.1) });

      S.cam.x = lerp(0, -20, es(t, 1.0, 1.3)) + es(t, 2.0, 2.3) * 40;
      S.cam.y = 20 - es(t, 2.0, 2.3) * 100;
      S.cam.z = 1.06 - es(t, 2.0, 2.3) * 0.05;
    };
  },
};
