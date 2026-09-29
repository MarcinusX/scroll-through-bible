// Mt 21,4–5 — "that the word of the prophet might be fulfilled": a painted flat of the old prophecy flies in.
// Zechariah unrolls his scroll (a king on a donkey drawn on it) and golden threads run from it into the scene; the
// Daughter of Zion, crowned with the towers of her city, waits at the gate. "Behold, your King comes to you":
// a crown comes down on its string — and the King rides in, gentle, on a colt, the foal of a donkey, with the
// she-donkey walking beside Him; she lifts her hands in welcome.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, cloud, olive, cypress, palm, grass, flowers, bush } from '../../assets/nature.js';
import { es, ease, bump, fade, seg } from '../../core/anim.js';
import { colt, jenny, coltRig, saddleCloaks, riderLeg, cityWall, sanctuary, kingCrown, towerCirclet, ZION, addToHead, scrollOpen, strip, sparkle, headAt, hand, tr, PROPHET, PI } from './lib.js';

const G = 664;
const GATE = 1150;
const JX = 780;

/** Zechariah: an old prophet with a white beard, a blue mantle */
const ZECH = { robe: mix(C.stone2, C.linen2, 0.4), mantle: shade(C.dustyBlue, -0.1), hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: '#e9e2d6', skin: C.skin3, belt: C.rope };

/** the prophet's scroll with a little drawing of the king on a donkey (origin: top centre) */
function prophecyScroll(c) {
  const w = 190, h = 118;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 8), C.parchment);
  s.p(c.cut(c.rect(-w / 2 - 10, -6, 10, h + 12), 0.3, 5) + c.cut(c.rect(w / 2, -6, 10, h + 12), 0.3, 5), C.wood2);
  let ln = '';
  for (let i = 0; i < 3; i++) { let x = -w / 2 + 14; const y = 86 + i * 9; while (x < w / 2 - 18) { const l = c.rr(10, 30); ln += c.ribbon([[x, y], [Math.min(x + l, w / 2 - 14), y]], 1.5); x += l + 6; } }
  s.x(ln, C.ink, 'opacity=".35"');
  // the picture: a king on a little donkey, a crown over him
  const rider = `<g transform="translate(-16 -106) scale(.95)">${person(c, { ...CAST.jesus, pose: 'sit', halo: false })}</g>${riderLeg(c)}`;
  return s.out() + `<g transform="translate(-6 74) scale(.27)">${colt(c, { rider, halter: false })}</g><g transform="translate(-10 4) scale(.3)">${kingCrown(c, 30)}</g>`;
}

export default {
  id: 'mt21-prophet',
  enter: 'fly',
  beats: [
    { v: 4 },
    { v: 5 },
  ],
  cam: { x: [-30, 40], y: [-40, 30], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, PROPHET);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 420, y: 140, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 1180, y: 110, len: 700 });

    /* ---------- the land of the prophecy: hills, Jerusalem's wall and gate on the right ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 8, 3], lens: [1100, 400, 140], color: mix(C.hillFar, C.dune, 0.3), x0: -1400, x1: 3000 }).markup);
    const cityL = S.layer({ par: 0.2, sh: 4 });
    const WT = 420;
    cityL.add(`<g transform="translate(${GATE + 150} ${WT - 10})">${sanctuary(c, 0.7, { glow: false })}</g>`);
    let hd = '';
    for (let x = GATE - 240; x < GATE + 900; x += c.rr(34, 58)) { if (Math.abs(x - GATE - 150) < 70) continue; const h = c.rr(26, 60); hd += c.cut(c.rect(x, WT - h, c.rr(34, 54), h + 10), 0.4, 6); }
    cityL.add(sheet().p(hd, mix(C.plaster, C.sand, 0.3)).out());
    cityL.add(cityWall(c, GATE - 260, GATE + 1000, WT, G - 4, { towers: [{ x: GATE - 80, w: 70, h: 54 }, { x: GATE + 80, w: 70, h: 54 }], gate: { x: GATE, w: 96, h: 160 }, merlon: 11 }));
    const midL = S.layer({ par: 0.26, sh: 3 });
    const mb = hillsWith(c, { y: 560, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 10, treeColor: C.olive, treeH: 18, x0: -1400, x1: GATE - 250 });
    midL.add(mb.markup);
    midL.add(olive(c, 300, mb.fn(300) + 10, 0.8) + cypress(c, 620, mb.fn(620) + 6, 110) + palm(c, GATE - 440, 640, 220));

    /* ---------- the road ---------- */
    const roadL = S.layer({ par: 0.45, sh: 3 });
    const rs = sheet();
    rs.p(c.ridge(c.wave(628, [5, 2], [800, 200]), -1400, 3000, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.35));
    rs.p(c.cut([[-1400, 650], [GATE - 60, 640], [GATE + 60, 640], [3000, 650], [3000, 740], [-1400, 744]], 1.2, 14), mix(C.sand, C.sand2, 0.4));
    roadL.add(rs.out());
    roadL.add(grass(c, { x0: -900, x1: 2500, y: 640, n: 36, h: 13, color: C.olive }) + flowers(c, { x0: -600, x1: 2200, y: 642, n: 18 }));

    /* ---------- the prophet and his scroll ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const zech = S.puppet(P.add(person(c, { ...ZECH, holdF: `<g transform="translate(2 14) rotate(90) scale(.5)">${scrollOpen(c, 90, 60)}</g>` })));
    const zTag = hanging(P, strip(c, tr('prorok Zachariasz', 'the prophet Zechariah'), { size: 17 }), { x: 0, y: 0, len: 900 });
    const scrollGlow = P.add(`<g><circle r="200" fill="url(#warm-glow)"/></g>`);
    const bigScroll = hanging(P, `<g transform="scale(1.45)">${prophecyScroll(c)}</g>`, { x: 0, y: 0, len: 900 });

    /* ---------- the Daughter of Zion at the gate ---------- */
    const zion = S.puppet(P.add(addToHead(person(c, { ...ZION }), `<g transform="translate(0 -4)">${towerCirclet(c)}</g>`)));
    const zTag2 = hanging(P, strip(c, tr('Córa Syjońska', 'the daughter of Zion'), { size: 17 }), { x: 0, y: 0, len: 900 });

    /* ---------- the King on the colt, the she-donkey beside ---------- */
    const jenL = S.layer({ par: 0.48, sh: 5 });
    const kL = S.layer({ par: 0.5, sh: 5 });
    const jen = coltRig(jenL.add(jenny(c, { over: saddleCloaks(c, [C.ochreRobe, C.dustyBlue]) })));
    const cEl = kL.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]), rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g>${riderLeg(c)}` }));
    const cRig = coltRig(cEl);
    const rider = S.puppet(S.$('rider').firstElementChild);
    const fx = S.layer({ par: 0.5, sh: 6 });
    const crown = hanging(fx, `<g transform="scale(1.2)">${kingCrown(c, 30)}</g>`, { x: 0, y: 0, len: 900 });
    const gentle = hanging(fx, strip(c, tr('łagodny', 'humble'), { size: 20 }), { x: 0, y: 0, len: 900 });
    const stars = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 11)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 180, 900, 230, C.sage, C.moss) + bush(c, 1440, 890, 210, C.moss, C.sage) + olive(c, -20, 930, 1.3));

    return (t, time) => {
      const T = time;
      swing(cl1, 420 + Math.sin(T * 0.1) * 24, 140, T, 1.2, 0.6, 1);
      swing(cl2, 1180 + Math.sin(T * 0.12) * 24, 110, T, 1.2, 0.7, 2);

      /* v4 — the prophet unrolls his word; golden threads run from it into the present */
      const read = es(t, 0.1, 0.4);
      const aside = es(t, 1.0, 1.35);
      const zx = lerp(560, 420, aside);
      zech.set({ x: zx, y: G, s: 1.0, flip: false, walk: aside > 0 && aside < 1 ? zx * 0.05 : undefined, armF: 60 + read * 20 - aside * 20 + bump(t, 1.5, 1.95) * 30, armB: bump(t, 0.4, 0.9) * 110 + bump(t, 1.5, 1.95) * 60, head: -bump(t, 0.4, 0.9) * 12, blink: blinkAt(T, 2) });
      const tk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 1.0, 1.25));
      swing(zTag, zx, lerp(-600, 390, tk), T, 1.2, 0.8, 1);
      const sk = es(t, 0.25, 0.6, ease.back) * (1 - es(t, 1.0, 1.3, ease.in));
      swing(bigScroll, 800, lerp(-700, 190, sk), T, 1, 0.7, 2);
      // "that it might be fulfilled": the little drawing on the scroll lights up
      const lit = es(t, 0.55, 0.85) * (1 - es(t, 1.0, 1.2));
      pose(scrollGlow, { x: 800, y: 300, s: 0.6 + lit * 0.5, o: lit });

      /* v5 — "Tell the daughter of Zion": she steps out of the gate */
      const zin = es(t, 0.6, 1.1);
      const welcome = es(t, 1.45, 1.7);
      const zX = lerp(GATE, GATE - 150, zin);
      zion.set({ x: zX, y: G - 2, s: 0.96, flip: true, walk: zin > 0 && zin < 1 ? zX * 0.05 : undefined, o: seg(t, 0.55, 0.65), armF: welcome * 70, armB: welcome * 130, head: -welcome * 6, blink: blinkAt(T, 5) });
      const z2 = es(t, 0.9, 1.2, ease.out) * (1 - es(t, 1.4, 1.6));
      swing(zTag2, GATE - 150, lerp(-600, 330, z2), T, 1.2, 0.8, 3);

      /* "your King comes to you, humble, on a colt" */
      const ride = es(t, 1.05, 1.6, ease.out);
      const cx = lerp(160, JX, ride);
      const walking = ride > 0 && ride < 1;
      cRig.set({ x: cx, y: G + 8, s: 1, walk: walking ? cx * 0.06 : undefined, nod: Math.sin(T * 0.8) * 1.5, ear: Math.sin(T * 1.3) * 6, tail: Math.sin(T * 1.7) * 8, o: seg(t, 1.02, 1.08) });
      jen.set({ x: cx - 170, y: G - 22, s: 1.02, walk: walking ? cx * 0.06 + 1.2 : undefined, nod: Math.sin(T * 0.7 + 1) * 1.5, ear: Math.sin(T * 1.1) * 6, tail: Math.sin(T * 1.5) * 8, o: seg(t, 1.02, 1.08) });
      rider.set({ x: 0, y: 0, s: 1, armF: 30 + es(t, 1.55, 1.8) * 50, armB: 20, head: -2, blink: blinkAt(T) });
      const ck = es(t, 1.12, 1.45, ease.back);
      const hy = G + 8 - 106 - 105 * 0.95;   // the rider's head
      swing(crown, cx - 12, lerp(-700, hy - 56, ck) + bump(t, 1.6, 2) * 6, T, 1.4, 0.8, 4);
      const gk = es(t, 1.5, 1.72, ease.back);
      swing(gentle, cx - 12, lerp(-700, hy - 130, gk), T, 1.2, 0.8, 5);
      stars.forEach((st, i) => {
        const k = ((T * 0.3 + i / 4) % 1);
        pose(st, { x: cx - 12 + Math.cos(i * 1.6 + 1) * 70, y: hy - 30 + Math.sin(i * 1.6 + 1) * 40 - k * 20, s: 0.8, r: T * 40, o: es(t, 1.4, 1.6) * Math.sin(k * PI) });
      });

      S.cam.x = -20 + es(t, 0.9, 1.5) * 40;
      S.cam.y = -20 + es(t, 0.9, 1.5) * 30;
      S.cam.z = 1.06 - es(t, 0.9, 1.5) * 0.04;
    };
  },
};
