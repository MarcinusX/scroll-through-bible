// Łk 23,1–7a — the curtains open on Pilate's hall in the early morning (Mark 15's hall). The whole council rises
// and comes in, the guard leading Jesus bound; a Roman soldier takes the rope. The accusations fly up as three
// grey cards: He stirs up the nation, He forbids the tax to Caesar, He calls Himself Christ, a king. Pilate asks
// about the crown; Jesus answers, and a soft light grows behind Him. Pilate rises: an empty, level balance hangs
// down — no guilt. They insist: the map of the land comes down and a light runs along the road from Galilee to
// Jerusalem. "Galilee!" — Pilate asks whether He is a Galilean; Herod's crown drops onto Galilee on the map.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, curtains } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { crossX } from '../mark6/lib.js';
import { kf, moving, hand, headAt, speech, GLYPH, crown, priest, elder, scribe, guard, soldier, pilate, bonds, ropeLine, hallSet, lampSet, noGuilt, caesarCoin, landMap, mapRoad, MAP, herodCrown, bubble, strip, chargeCard, stirIcon, tr, PI } from './lib.js';

const JX = 800, JY = 690;
let MX = 700;                                   // the map's centre (set in build: a phone has it a step to the right)
const MY = 330, MS = 0.66;                      // the map: centre and scale
const mapPt = ([x, y]) => [MX + x * MS, MY + y * MS];
/** a point along the map's road (the same curve mapRoad draws), u 0 = Jerusalem → 1 = Galilee */
function roadAt(u) {
  const [p0, p1, p2, p3] = [MAP.road[0], MAP.road[1], MAP.road[3], MAP.road[5]];
  const v = 1 - u;
  const x = v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0];
  const y = v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1];
  return mapPt([x, y]);
}

export default {
  id: 'lk23-pilate',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3, text: 'Piłat zapytał Go: «Czy Ty jesteś Królem żydowskim?»' },
    { v: 3, cont: true, text: 'Jezus odpowiedział mu: «Tak, Ja Nim jestem».' },
    { v: 4 },
    { v: 5 },
    { v: 6 },
    { v: 7, text: 'A gdy się upewnił, że jest spod władzy Heroda,' },
  ],
  cam: { x: [-60, 240], y: [-30, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    MX = S.portrait ? 750 : 700;   // phone: the whole map inside the frame
    const H = hallSet(S);
    if (S.portrait) { const std = H.props.el.querySelector('g[transform="translate(1236 612)"]'); if (std) std.style.display = 'none'; }   // phone: the eagle standard right of the seat would only peep out under the thread
    const P = H.charL;
    const shine = P.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);
    /* the council: three chief priests, two elders, a scribe */
    const council = [
      { el: priest(c, 0), x: 600 }, { el: priest(c, 1), x: 520 }, { el: elder(c, 1), x: 445 },
      { el: priest(c, 2), x: 370 }, { el: scribe(c, 1), x: 300 }, { el: elder(c, 2), x: 228 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(P.add(m.el)), seed: c.rr(0, 9), y: 690 + (i % 2) * 8 }));
    if (S.portrait) council.forEach((m, i) => { m.x = [680, 615, 440, 370, 300, 228][i]; });   // phone: two stand whole in the frame, the rest wait clear of its edge
    const gd = S.puppet(P.add(guard(c, 0)));
    const sol = S.puppet(P.add(soldier(c, 0)));
    const sol2 = S.puppet(P.add(soldier(c, 1)));
    const pSit = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const pSt = S.puppet(P.add(pilate(c)));
    const jes = S.puppet(P.add(person(c, { ...CAST.jesus, holdF: bonds(c) })));
    const fx = H.fxL;
    const rope = fx.add(`<g>${ropeLine(c)}</g>`);

    /* v2 — three cards of accusation */
    const people = stirIcon(c);
    const tax = `<g transform="scale(.3)">${caesarCoin(c, 90)}</g><g transform="scale(.7)">${crossX(c, 26)}</g>`;
    const king = `<g transform="translate(0 18) scale(1.3)">${crown(c)}</g>`;
    const cards = [
      [people, tr('podburza naród', 'perverting the nation')],
      [tax, tr('nie płacić Cezarowi', 'no taxes to Caesar')],
      [king, tr('Mesjasz – Król', 'Christ, a king')],
    ].map(([inner, label], i) => ({ i, el: fx.add(chargeCard(c, inner, label)), from: council[i].x, to: (S.portrait ? [[640, 310], [775, 245], [910, 310]] : [[560, 300], [680, 250], [800, 300]])[i] }));   // phone: all three cards inside the frame

    /* bubbles */
    const askB = fx.add(`<g>${speech(c, `<g transform="translate(-12 22) scale(.9)">${crown(c)}</g><g transform="translate(20 2) scale(1.1)">${GLYPH.q(c)}</g>`, { w: 96, h: 64, flip: true })}</g>`);
    const yesB = fx.add(`<g>${speech(c, `<circle r="34" fill="url(#halo-glow)"/><g transform="translate(0 22)">${crown(c)}</g>`, { w: 80, h: 62 })}</g>`);
    const galM = `<g>${bubble(c, tr('Galilejczyk?', 'A Galilean?'), { size: 21, dir: 1 })}</g>`;
    let galB = S.portrait ? null : fx.add(galM);

    /* v4 — no guilt: an empty, level balance */
    const flies = S.layer({ par: 0.3, sh: 5 });
    const bal = flies.add(`<g><path d="M0 -1500V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.4" fill="none"/><circle r="90" fill="url(#halo-glow)" opacity=".6"/><g transform="scale(3.4)">${noGuilt(c, 22)}</g></g>`);
    const balTag = flies.add(`<g>${strip(c, tr('żadnej winy', 'no basis for a charge'), { size: 17 })}</g>`);

    /* v5–7 — the map of the land */
    const mapL = S.layer({ par: 0.3, sh: 6 });
    const map = mapL.add(`<g><path d="M${-MAP.w * 0.36} ${-MAP.h / 2}V-1600M${MAP.w * 0.36} ${-MAP.h / 2}V-1600" stroke="rgba(74,54,34,.55)" stroke-width="2" fill="none"/>${landMap(c)}${mapRoad(c, mix(C.clay, C.parchment, 0.45))}</g>`);
    const trail = Array.from({ length: 9 }, (_, i) => ({ i, el: mapL.add(`<g><path d="${c.cut(c.circ(0, 0, 4, 8), 0.2, 2)}" fill="${C.terracotta}"/></g>`) }));
    const walker = mapL.add(`<g><circle r="26" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 9, 3, 4, 0))}" fill="${C.star}"/></g>`);
    const galRing = mapL.add(`<g><path d="${c.ribbon(c.arc(0, 0, 70, 34, 0, PI * 2, 30), 3.4)}" fill="${C.terracotta}"/></g>`);
    const hCrown = mapL.add(`<g><circle r="44" fill="url(#warm-glow)"/><g transform="translate(0 34) scale(2.6)">${herodCrown(c)}</g></g>`);
    const hTag = mapL.add(`<g>${strip(c, tr('Herod', 'Herod'), { size: 17 })}</g>`);

    if (S.portrait) galB = S.layer({ par: 0.58, sh: 4 }).add(galM);   // phone: the map reaches Pilate's words, so they are laid over it
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      H.lamps.forEach((l) => lampSet(l, 0, T));
      pose(H.orb, { x: 690, y: 400 - es(t, 0, 9) * 100 });
      pose(H.cl, { x: 610 + Math.sin(T * 0.1) * 20, y: 250 });
      H.sk.blend(H.pal, ['#b7cbd0', '#efdcc0', '#f6e0c0'], es(t, 0.5, 9) * 0.7);

      /* v1 — the whole company comes in, leading Jesus */
      const jK = [[1.0, [440, JY]], [1.7, [JX, JY]]];
      const [jx, jy] = kf(t, jK);
      const gK = [[1.0, [300, JY + 2]], [1.7, [660, JY + 2]], [1.85, [660, JY + 2]], [2.1, [150, JY + 6]]];
      const [gx, gy] = kf(t, gK);
      const handed = es(t, 1.72, 1.8);
      const gArm = 50 - handed * 40;
      gd.set({ x: gx, y: gy, s: 1, flip: t > 1.85, walk: moving(t, gK) ? gx * 0.06 : undefined, armF: gArm, armB: 8, o: (t > 0.95 ? 1 : 0) * (1 - es(t, 2.05, 2.15)), blink: blinkAt(T, 3) });
      const sK = [[1.4, [1010, JY]], [1.72, [920, JY]]];
      const [sx, sy] = kf(t, sK);
      const sArm = 34 + bump(t, 1.5, 1.8) * 20;
      sol.set({ x: sx, y: sy, s: 1, flip: true, walk: moving(t, sK) ? sx * 0.06 : undefined, armF: sArm, armB: 20 + handed * 20, blink: blinkAt(T, 6) });
      sol2.set({ x: 1350, y: 668, s: 0.98, flip: true, armF: 34, armB: 6, blink: blinkAt(T, 7) });
      const answer = es(t, 4.05, 4.35) * (1 - es(t, 4.95, 5.2));
      jes.set({ x: jx, y: jy, s: 1.02, flip: false, walk: moving(t, jK) ? jx * 0.05 : undefined, amt: 0.6, armF: 30, armB: 28, head: 3 - answer * 8, o: t > 0.95 ? 1 : 0, blink: blinkAt(T) });
      pose(shine, { x: jx, y: jy - 170, s: 0.6 + answer * 0.5 + es(t, 5.05, 5.4) * 0.15, o: answer * 0.85 + es(t, 5.05, 5.4) * 0.3 });
      const [ax, ay] = hand(jx, jy, 1.02, false, 30);
      const [g1, g2] = hand(gx, gy, 1, t > 1.85, gArm);
      const [s1, s2] = hand(sx, sy, 1, true, sArm);
      const bx = lerp(g1, s1, handed), by = lerp(g2, s2, handed);
      const d = Math.hypot(bx - ax, by - ay);
      pose(rope, { x: ax, y: ay, r: (Math.atan2(by - ay, bx - ax) * 180) / PI, sx: d / 100, o: t > 0.95 ? 1 : 0 });

      /* the council: accuse (v2), insist (v5) */
      const acc = es(t, 2.02, 2.25) * (1 - es(t, 2.95, 3.2));
      const ins = es(t, 6.02, 6.25) * (1 - es(t, 6.95, 7.2));
      council.forEach((m) => {
        const K = [[1.0 + m.i * 0.05, [m.x - 560, m.y]], [1.75 + m.i * 0.05, [m.x, m.y]]];
        const [x, y] = kf(t, K);
        const loud = acc + ins;
        const shake = T ? Math.sin(T * 7 + m.i * 2) * 14 * loud : 0;
        m.p.set({ x: x + loud * 30, y, s: 0.96, flip: false, walk: moving(t, K) ? x * 0.05 : undefined, armF: 24 + loud * (60 + (m.i % 3) * 14) + shake, armB: 10 + loud * (30 + (m.i % 2) * 60), head: -3 - loud * 4, lean: loud * 4, o: t > 0.95 ? 1 : 0, blink: blinkAt(T, m.seed) });
      });
      cards.forEach((cd) => {
        const k = es(t, 2.05 + cd.i * 0.17, 2.4 + cd.i * 0.17, ease.out);
        const [tx, ty] = cd.to;
        const x = lerp(cd.from + 30, tx, k), y = lerp(520, ty, k) - Math.sin(k * PI) * 70;
        pose(cd.el, { x, y: y + (T ? Math.sin(T * 1.3 + cd.i) * 3 : 0), s: 0.5 + k * 0.5, r: lerp(-30, [-6, 3, 7][cd.i], k), o: k > 0.01 ? 1 - es(t, 2.95, 3.15) : 0 });
      });

      /* Pilate: sits and asks; rises to speak to them (v4) */
      const rise = es(t, 5.0, 5.08);
      const q1 = es(t, 3.05, 3.35) * (1 - es(t, 3.95, 4.2));
      pSit.set({ x: 1116, y: 566, s: 1, flip: true, o: 1 - rise, armF: 30 + q1 * 50, armB: 10 + q1 * 20, lean: q1 * -6, head: -4 + bump(t, 4.1, 4.9) * 6, blink: blinkAt(T, 1) });
      const decl = es(t, 5.1, 5.35) * (1 - es(t, 5.9, 6.1));
      const ask2 = es(t, 7.1, 7.35) * (1 - es(t, 7.95, 8.1));
      const nod = bump(t, 8.3, 8.7);
      pSt.set({ x: 1060, y: 600, s: 1, flip: true, o: rise, armF: 30 + decl * 40 + ask2 * 50, armB: 10 + decl * 130 + ask2 * 20, lean: -decl * 3, head: -2 - decl * 4 + nod * 10 - ask2 * 4, blink: blinkAt(T, 1) });

      const [phx, phy] = headAt(1116, 566, 1, true, 62);
      const b1 = es(t, 3.1, 3.35, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(askB, { x: phx - 26, y: phy - 20, s: b1, o: b1 > 0.02 ? 1 : 0 });
      const [jhx, jhy] = headAt(jx, jy, 1.02, false);
      const b2 = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.9, 5.05));
      pose(yesB, { x: jhx + 26, y: jhy - 24, s: b2, o: b2 > 0.02 ? 1 : 0 });
      const [p2x, p2y] = headAt(1060, 600, 1, true);
      const b3 = es(t, 7.12, 7.35, ease.back) * (1 - es(t, 7.9, 8.05));
      pose(galB, { x: p2x - 30, y: p2y - 16, s: b3, o: b3 > 0.02 ? 1 : 0 });

      /* v4 — the balance comes down between them */
      const bk = es(t, 5.1, 5.45, ease.out) * (1 - es(t, 5.95, 6.2, ease.in));
      pose(bal, { x: 930, y: lerp(-400, 300, bk), r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: bk > 0.01 ? 1 : 0 });
      const tk = es(t, 5.3, 5.5, ease.back) * (1 - es(t, 5.95, 6.1));
      pose(balTag, { x: 930, y: 390, s: tk, o: tk > 0.02 ? 1 : 0 });

      /* v5 — the map: from Galilee even to this place */
      const mk = es(t, 6.0, 6.35, ease.out) * (1 - es(t, 8.85, 9.0, ease.in));
      pose(map, { x: MX, y: lerp(-1000, MY, mk), s: MS, o: mk > 0.005 ? 1 : 0 });
      const run = es(t, 6.3, 6.85);
      const [wx, wy] = roadAt(1 - run);
      pose(walker, { x: wx, y: wy, s: 0.7 + bump(t, 6.3, 6.85) * 0.3, o: mk >= 0.99 && t < 7.1 ? 1 - es(t, 6.95, 7.1) : 0 });
      trail.forEach((tr_) => {
        const u = 1 - (tr_.i + 0.5) / trail.length;
        const [x, y] = roadAt(u);
        const on = run > 1 - u ? 1 : 0;
        pose(tr_.el, { x, y, o: mk >= 0.99 ? on : 0 });
      });
      /* v6 — "Galilee!": the word is ringed */
      const gk = es(t, 7.05, 7.3) * (1 - es(t, 8.05, 8.2));
      const [grx, gry] = mapPt([MAP.lake[0] + 105, MAP.lake[1] - 6]);
      pose(galRing, { x: grx, y: gry, s: MS * (0.8 + gk * 0.2), o: mk >= 0.99 ? gk : 0 });
      /* v7a — Herod's crown drops onto Galilee */
      const ck = es(t, 8.05, 8.35, ease.out);
      const [crx, cry] = mapPt([MAP.lake[0] + 10, MAP.lake[1] - 10]);
      pose(hCrown, { x: crx, y: lerp(cry - 240, cry, ck), s: MS * (1 + bump(t, 8.3, 8.45) * 0.2), o: ck > 0.01 && mk > 0.99 ? 1 : 0 });
      const htk = es(t, 8.3, 8.5, ease.back);
      pose(hTag, { x: crx, y: cry + 30, s: htk * 0.9, o: htk > 0.02 && mk > 0.99 ? 1 : 0 });

      S.cam.x = 20 + es(t, 2.0, 2.4) * -40 * (1 - es(t, 2.9, 3.2)) + es(t, 3.0, 3.4) * 40 * (1 - es(t, 4.0, 4.4)) - es(t, 5.9, 6.3) * 30;
      S.cam.z = 1.02 + es(t, 1.8, 2.3) * 0.03 + es(t, 2.9, 3.3) * 0.04 * (1 - es(t, 5.9, 6.3));
      S.cam.y = 10 + es(t, 2.9, 3.3) * 20 - es(t, 5.9, 6.3) * 30;
      if (S.portrait) S.cam.x += 150;   // phone: Pilate on his seat clear of the thread
    };
  },
};
