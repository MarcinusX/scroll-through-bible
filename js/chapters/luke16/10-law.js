// Łk 16,16–17 — the village square. "The Law and the Prophets lasted until John": over the square a long strip unrolls
// from left to right like the ages — the tablets of the Law, the scrolls of the Prophets, the prophets one after
// another — and at its end, John at the Jordan with his hand raised. "Since then the good news of the kingdom of God is
// preached, and everyone forces his way into it": past John the strip ends in gold; behind Jesus a golden gate comes
// down on the hill and opens, and from both sides the people press in towards it. "But it is easier for heaven and
// earth to pass away than for one stroke of a letter of the Law to fall": the strip rises away; a great page of the
// Law hangs there, heaven (sun, moon and stars) on one side and the round earth on the other; heaven and earth pale and
// drift away on their strings — and on the page one tiny stroke of one letter shines, and stays.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { sun, moon } from '../../assets/nature.js';
import { villageSet, VQ, lawTablets, scrollParts, kingdomGate, gateDoor, rayBurst, label, figure, glow, JOHN_B, headAt, kf, tr, es, ease, bump, seg, PI, AFTER, STRING } from './lib.js';
import { globe } from '../mark8/lib.js';

const F = VQ.FEET;
const X0 = 440, X1 = 1160, TY = 250;   // the strip of the ages
const GX = 800, GY = 470;               // the gate of the kingdom on the hill behind

/** the strip (origin: its left end, centre line; length L) */
function strip(c, L) {
  const s = sheet();
  s.p(c.cut([[0, -44], [L, -46], [L + 2, 44], [0, 46]], 0.5, 10), mix(C.parchment, C.cream, 0.3));
  s.p(c.cut([[L * 0.8, -46], [L, -46], [L + 2, 44], [L * 0.8, 46]], 0.4, 8), mix(C.halo, C.sun, 0.2));
  s.x(c.ribbon([[6, -38], [L - 6, -40]], 1.2) + c.ribbon([[6, 38], [L - 6, 38]], 1.2), C.wood3, 'opacity=".6"');
  return `<path d="M${L * 0.2} -1600V-46M${L * 0.8} -1600V-46" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}`;
}
/** a prophet bust with a scroll (small, origin: the feet) */
const prophet = (c, o, flip = false) => figure(c, { ...o, holdF: `<g transform="rotate(-80)">${sheet().p(c.cut(c.rect(-4, -14, 8, 28), 0.2, 3), C.parchment).out()}</g>` }, { s: 0.36, flip, armF: 70, armB: 10, head: -4 });
/** a page of the Law with square letters (origin centre); the loose stroke is kept apart */
function page(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-150, -110, 300, 220), 0.5, 10), mix(C.parchment, C.cream, 0.25));
  s.p(c.cut(c.rect(-162, -118, 12, 236), 0.3, 6) + c.cut(c.rect(150, -118, 12, 236), 0.3, 6), C.wood2);
  // neutral writing: short ink dashes in lines, like the scrolls elsewhere (no letters)
  let ink = '';
  for (let r = 0; r < 7; r++) {
    let x = r === 0 ? 108 : 126;
    const y = -80 + r * 28;
    while (x > -126) { const w = c.rr(16, 46); if (x - w < -126) break; ink += c.ribbon([[x, y], [x - w, y + c.rr(-1, 1)]], 3.2); x -= w + c.rr(8, 14); }
  }
  s.x(ink, C.ink, 'opacity=".7"');
  return s.out();
}

export default {
  id: 'lk16-law',
  beats: [
    { v: 16, text: 'Aż do Jana sięgało Prawo i Prorocy;' },
    { v: 16, cont: true, text: 'odtąd głosi się Dobrą Nowinę o królestwie Bożym, i każdy gwałtem wdziera się do niego.' },
    { v: 17 },
  ],
  cam: { x: [-20, 20], y: [-90, 40], z: [1, 1.1] },
  build(S) {
    const Q = villageSet(S, { skyCols: AFTER, dis: ['peter', 'john'], ph: 3, crowdSeeds: ['lk16-vL', 'lk16-vR'], sunAt: [1250, 190] });
    const c = Q.c;
    const L = X1 - X0;
    /* the gate of the kingdom */
    const gk = kingdomGate(c, 120, 170);
    const gLight = Q.flyL.add(`<g opacity="0"><circle cy="-80" r="110" fill="url(#halo-glow)"/>${gk.light}</g>`);
    const gFrame = Q.flyL.add(`<g opacity="0">${gk.frame}</g>`);
    const dL = Q.flyL.add(`<g opacity="0">${gateDoor(c, 60, 116)}</g>`);
    const dR = Q.flyL.add(`<g opacity="0"><g transform="scale(-1 1)">${gateDoor(c, 60, 116)}</g></g>`);
    const spill = Q.rayFx.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 70, r1: 104, spread: 0.05, color: '#fff3cf', o: 0.4 })}</g>`);
    /* the strip of the ages and what is on it */
    const hang = Q.W;
    const stripEl = hang.add(`<g>${strip(c, L)}</g>`);
    const items = [
      [60, `<g transform="translate(0 30) scale(.62)">${lawTablets(c)}</g>`],
      [150, `<g transform="translate(0 22)">${prophet(c, { robe: C.stone2, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: C.greyHair, skin: C.skin3 })}</g>`],
      [230, `<g transform="translate(0 8)">${scrollParts ? sheet().p(c.cut(c.rect(-30, -14, 60, 28), 0.3, 5), C.parchment).p(c.cut(c.ell(-32, 0, 6, 16, 10), 0.2, 3) + c.cut(c.ell(32, 0, 6, 16, 10), 0.2, 3), C.wood2).x(c.ribbon([[-22, -5], [22, -5]], 1.4) + c.ribbon([[-22, 3], [18, 3]], 1.4), C.ink, 'opacity=".5"').out() : ''}</g>`],
      [310, `<g transform="translate(0 22)">${prophet(c, { robe: C.dustyBlue, mantle: C.stone, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, veil2: C.rock2, beard: 'full', skin: C.skin2 })}</g>`],
      [390, `<g transform="translate(0 22)">${prophet(c, { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'bald', beard: 'full', beardColor: C.greyHair, skin: C.skin })}</g>`],
      [480, `<g transform="translate(0 30)">${sheet().p(c.cut([[-40, 0], [-30, -10], [40, -8], [40, 12], [-40, 12]], 0.4, 5), C.lake2).out()}${figure(c, JOHN_B, { s: 0.38, armF: 20, armB: 150, head: -6 })}</g>`],
    ].map(([dx, m], i) => ({ i, dx, el: hang.add(`<g opacity="0">${m}</g>`) }));
    const labLaw = hang.add(`<g opacity="0">${label(c, tr('Prawo i Prorocy', 'the Law and the Prophets'), { size: 16 })}</g>`);
    const labJohn = hang.add(`<g opacity="0">${label(c, tr('Jan', 'John'), { size: 16 })}</g>`);
    const labKing = hang.add(`<g opacity="0">${label(c, tr('królestwo Boże', 'the Kingdom of God'), { size: 16 })}</g>`);
    /* heaven, earth and the page of the Law */
    const pageEl = hang.add(`<g opacity="0"><path d="M-100 -1600V-110M100 -1600V-110" stroke="${STRING}" stroke-width="1.2" fill="none"/>${page(c)}</g>`);
    const strokeGlow = Q.W.add(`<g opacity="0">${glow(34, 1, 'halo-glow')}</g>`);
    const stroke = Q.W.add(`<g opacity="0"><path d="${c.cut([[-4, -12], [5, -13], [6, -7], [1, -2], [-2, 4], [-4, 3], [-2, -4], [-5, -6]], 0.2, 2)}" fill="${C.ink}"/></g>`);
    const strokeGold = Q.W.add(`<g opacity="0"><path d="${c.cut([[-4, -12], [5, -13], [6, -7], [1, -2], [-2, 4], [-4, 3], [-2, -4], [-5, -6]], 0.2, 2)}" fill="${C.sun}"/></g>`);
    const heaven = hang.add(`<g opacity="0"><path d="M0 -1600V-60" stroke="${STRING}" stroke-width="1.2" fill="none"/>${sheet().p(c.cut(c.circ(0, 0, 62, 30), 0.4, 5), mix(C.night, C.indigo, 0.4)).out()}<g transform="translate(-18 -14) scale(.4)">${sun(c, 40)}</g><g transform="translate(22 18) scale(.5)">${moon(c, 30)}</g>${[[20, -30], [-30, 26], [36, -6], [-8, 36]].map(([x, y]) => `<path d="${c.poly(c.star(x, y, 5, 2, 4, 0))}" fill="${C.star}"/>`).join('')}</g>`);
    const earth = hang.add(`<g opacity="0"><path d="M0 -1600V-60" stroke="${STRING}" stroke-width="1.2" fill="none"/>${globe(c, 60)}</g>`);

    return (t, time) => {
      const T = time;
      /* v16a — the strip of the ages unrolls to John */
      const un = es(t, 0.05, 0.6);
      const up = es(t, 2.02, 2.25, ease.in);
      const sy = lerp(TY, -500, up);
      pose(stripEl, { x: X0, y: sy, sx: Math.max(0.01, un), o: un > 0.01 ? 1 : 0 });
      items.forEach((it) => {
        const k = es(t, 0.1 + it.dx / L * 0.5, 0.18 + it.dx / L * 0.5, ease.back);
        pose(it.el, { x: X0 + it.dx, y: sy, s: k, o: k > 0.01 ? 1 : 0 });
      });
      const l1 = es(t, 0.45, 0.6) * (1 - up);
      pose(labLaw, { x: X0 + 190, y: sy + 66, o: l1 });
      pose(labJohn, { x: X0 + 480, y: sy + 66, o: es(t, 0.55, 0.7) * (1 - up) });
      pose(labKing, { x: X0 + 640, y: sy + 66, o: es(t, 1.1, 1.25) * (1 - up) });
      /* v16b — the gate; the people press in */
      const gd = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.9, 3.0));
      const gy = lerp(-200, GY, gd);
      const open = es(t, 1.35, 1.5);
      const gOn = gd > 0.004 ? 1 : 0;
      pose(gFrame, { x: GX, y: gy, o: gOn });
      pose(gLight, { x: GX, y: gy, o: gOn });
      pose(dL, { x: GX - 60, y: gy, sx: 1 - open * 0.85, o: gOn });
      pose(dR, { x: GX + 60, y: gy, sx: 1 - open * 0.85, o: gOn });
      pose(spill, { x: GX, y: GY - 90, s: 0.6 + open * 0.4, r: T * 3, o: open * 0.8 * (1 - es(t, 2.0, 2.3)) });
      const press = es(t, 1.4, 1.8) * (1 - es(t, 2.1, 2.4));
      Q.CROWD.forEach((g) => { const dx = (g.x < 800 ? 1 : -1) * press * 70; g.calm.set({ x: g.x + dx, y: g.y - press * 16, o: 1 - press }); g.wow.set({ x: g.x + dx, y: g.y - press * 16, o: press }); });
      Q.pose(t, T,
        { armF: 16 + es(t, 0.05, 0.2) * 40 + press * 40, armB: 8 + press * 100, head: -4 - es(t, 2.1, 2.3) * 6, blink: blinkAt(T, 2) },
        (d) => ({ head: -8, blink: blinkAt(T, d.seed) }),
        (m) => ({ head: 4, lean: -press * 4, blink: blinkAt(T, m.seed) }));
      /* v17 — heaven and earth pass; the stroke stays */
      const pk = es(t, 2.1, 2.4, ease.out);
      const py = lerp(-500, 280, pk);
      pose(pageEl, { x: 800, y: py, o: pk > 0.004 ? 1 : 0 });
      const pass = es(t, 2.5, 2.95);
      const hk = es(t, 2.15, 2.4, ease.out);
      pose(heaven, { x: 560, y: lerp(-500, 260, hk) - pass * 140, r: pass * -20, s: 1 - pass * 0.3, o: hk > 0.004 ? 1 - pass * 0.8 : 0 });
      pose(earth, { x: 1040, y: lerp(-500, 300, hk) - pass * 140, r: pass * 20, s: 1 - pass * 0.3, o: hk > 0.004 ? 1 - pass * 0.8 : 0 });
      const sk = es(t, 2.45, 2.6);
      const SXp = 800 + 122, SYp = py - 80;
      pose(stroke, { x: SXp, y: SYp, s: 1.3, o: pk > 0.98 ? 1 - sk : 0 });
      pose(strokeGold, { x: SXp, y: SYp, s: 1.3 + sk * 0.3, o: pk > 0.98 ? sk : 0 });
      pose(strokeGlow, { x: SXp, y: SYp - 4, s: 0.6 + sk * 0.5, o: sk });

      S.cam.x = kf(t, [[-0.5, 0], [3, 0]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.1, -40], [1.0, -40], [1.3, -10], [2.0, -10], [2.3, -50]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.3, 1.02], [2.2, 1.02]]);
    };
  },
};
