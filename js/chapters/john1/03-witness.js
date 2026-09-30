// J 1,6–8 — A man sent from God: a shaft of light falls on the desert road and John steps into it; his name
// comes down on a string. At the far end of the road the true Light rises; John points to it, the people come.
// A halo floats down to crown John — he shakes his head and sends it on to the Light. He is only the witness.
import { C, person, crowd, blinkAt, pose, attr, lerp, sky, hanging, sheet, mix } from '../kit.js';
import { band, rock, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { JOHN_B, hand, headAt, scrub, acacia, nameTag, wordFlame, glowDisc, rayBurst, sparkle, PI } from './lib.js';

const HY = 470, LX = 820, LY = 436;       // horizon; the true Light at the far end of the road
const ry = (u) => HY + 700 * Math.pow(u, 1.8);
const rw = (u) => 4 + 380 * Math.pow(u, 1.5);
const JX = 610, JY = 742;

export default {
  id: 'j1-witness',
  beats: [
    { v: 6, text: 'Pojawił się człowiek posłany przez Boga -' },
    { v: 6, cont: true, text: 'Jan mu było na imię.' },
    { v: 7 },
    { v: 8, text: 'Nie był on światłością,' },
    { v: 8, cont: true, text: 'lecz [posłanym], aby zaświadczyć o światłości.' },
  ],
  cam: { x: [-30, 30], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PRE = ['#8f89b4', '#d8b3ad', '#efcfb3'];
    const DAWN = ['#c6d8d6', '#f3dcbc', '#f8e5c6'];
    const sk = sky(S, PRE);
    const hangL = S.layer({ par: 0.03, sh: 5 });
    const cl1 = hanging(hangL, cloud(c, 190, '#f6e3d2', '#e8cdb8'), { x: 460, y: 180, len: 700 });
    const cl2 = hanging(hangL, cloud(c, 140, '#f6e3d2', '#e8cdb8'), { x: 1170, y: 130, len: 700 });

    /* ---------- the true Light at the end of the road (behind the hills' edge) ---------- */
    const lightG = S.layer({ par: 0.05, sh: 1, flat: true });
    const tGlow = lightG.add(`<g>${glowDisc(360, 'warm-glow', 1)}</g>`);
    const tRays = lightG.add(`<g>${rayBurst(c, { n: 22, r0: 40, r1: 900, spread: 0.03, o: 0.45 })}</g>`);
    const lightL = S.layer({ par: 0.05, sh: 4 });
    const tFlame = lightL.add(`<g>${wordFlame(c, 70)}</g>`);

    S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 458, amps: [14, 6, 3], lens: [900, 330, 120], color: mix(C.duskViolet, C.dune, 0.45) }).markup);
    const hills = S.layer({ par: 0.14, sh: 3 });
    const hs = sheet();
    hs.p(c.cut([[-900, 520], [-900, 390], [-300, 320], [150, 280], [380, 330], [560, 410], [700, 520]], 1.4, 12), mix(C.dune, C.clay, 0.25));
    hs.p(c.cut([[940, 520], [1080, 380], [1260, 300], [1440, 270], [1800, 340], [2500, 390], [2500, 520]], 1.4, 12), mix(C.dune, C.clay, 0.35));
    hills.add(hs.out());

    const ground = S.layer({ par: 0.3, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(HY - 2, [2, 1], [400, 120]), -900, 2500, 1700, 14, 0.6), C.sand);
    gs.p(c.ridge(c.wave(570, [14, 6], [700, 220]), -900, 2500, 1700, 14, 1), mix(C.sand, C.sand2, 0.5));
    gs.p(c.ridge(c.wave(700, [18, 8], [800, 260]), -900, 2500, 1700, 14, 1), C.sand2);
    // the road to the Light
    const L = [], R = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40; L.push([LX + (800 - LX) * u - rw(u) / 2, ry(u)]); R.push([LX + (800 - LX) * u + rw(u) / 2, ry(u)]); }
    gs.p(c.cut([...L, ...R.reverse()], 0.8, 10), mix(C.sand, C.cream, 0.5));
    ground.add(gs.out());
    ground.add(rock(c, 330, 520, 90, 40, C.rock2) + rock(c, 1270, 530, 110, 46, C.rock) + scrub(c, 520, 505, 30) + scrub(c, 1110, 508, 34) + acacia(c, 1360, 570, 1.1) + scrub(c, 240, 600, 50));

    /* ---------- the shaft of light: sent from God ---------- */
    const shaftL = S.layer({ par: 0.3, sh: 1, flat: true });
    const shaft = shaftL.add(`<g><path d="${c.poly([[JX - 60, -700], [JX + 140, -700], [JX + 110, JY + 10], [JX - 110, JY + 10]])}" fill="#fff1c4" opacity=".55"/><ellipse cx="${JX}" cy="${JY + 2}" rx="130" ry="18" fill="#fff4d2" opacity=".7"/></g>`);
    const motes = [0, 1, 2, 3, 4].map((i) => shaftL.add(`<g>${sparkle(c, 8 + (i % 3) * 3)}</g>`));

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.3, sh: 4 });
    const PT = S.portrait;               // phone: the people gather closer to the road, the name hangs over John's head
    const people = crowd(S, P, PT ? [{ y: 770, s: 0.84, n: 4, x0: 860, x1: 1140 }, { y: 800, s: 0.9, n: 2, x0: 420, x1: 530 }] : [{ y: 770, s: 0.84, n: 4, x0: 880, x1: 1260 }, { y: 800, s: 0.9, n: 2, x0: 330, x1: 470 }]);
    const NX = PT ? JX + 4 : JX - 118, NY = PT ? 452 : 470;
    people.forEach((m) => { m.from = m.x < 800 ? m.x - 700 : m.x + 700; });
    const john = S.puppet(P.add(person(c, { ...JOHN_B })));
    const nameEl = hanging(P, nameTag(c, tr('Jan', 'John'), { size: 22 }), { x: JX - 110, y: 420, len: 800 });
    // the halo that is not his
    const haloL = S.layer({ par: 0.3, sh: 5 });
    const halo = haloL.add(`<g>${glowDisc(90, 'halo-glow', 1)}<path d="${c.cut(c.star(0, 0, 36, 32, 18, 0), 0.3, 4)}" fill="${C.haloRim}"/><path d="${c.cut(c.circ(0, 0, 30, 28), 0.3, 4)}" fill="${C.halo}"/></g>`);
    // the pointing line from John's finger to the Light
    const pointer = haloL.add(`<path d="M0 0L1 0" stroke="${C.haloRim}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" fill="none"/>`);

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(rock(c, 150, 960, 260, 110, C.rock2) + rock(c, 1460, 950, 240, 120, C.rock) + scrub(c, 300, 940, 70, C.olive) + scrub(c, 1300, 945, 60, C.moss));

    return (t, time) => {
      const dawn = es(t, 1.9, 2.8);
      sk.blend(PRE, DAWN, dawn);
      pose(cl1, { x: 460 + Math.sin(time * 0.1) * 20, y: 180, r: Math.sin(time * 0.6) * 1.2 });
      pose(cl2, { x: 1170 + Math.sin(time * 0.12 + 2) * 20, y: 130, r: Math.sin(time * 0.7 + 1) * 1.2 });

      /* v6a: the shaft of light, and John steps into it */
      const sh = es(t, 0.05, 0.4) * (1 - es(t, 2.2, 2.7) * 0.75);
      pose(shaft, { o: sh });
      motes.forEach((m, i) => {
        if (sh < 0.01) { pose(m, { o: 0 }); return; }
        const k = time ? ((time * 0.25 + i / 5) % 1) : (i + 0.5) / 5;
        pose(m, { x: JX - 40 + i * 22 + Math.sin(k * 6 + i) * 10, y: lerp(120, JY - 20, k), s: 0.8, r: sh > 0.01 ? time * 20 : 0, o: sh * Math.sin(k * PI) });
      });
      const walk = es(t, 0.2, 0.92);
      const jx = lerp(1060, JX, walk);
      /* v6b: his name */
      const greet = bump(t, 1.2, 1.9);
      /* v7: he turns and points to the Light */
      const turn = es(t, 2.1, 2.25);
      const pointA = es(t, 2.2, 2.5) * (1 - es(t, 3.1, 3.3)) + es(t, 4.1, 4.4);
      /* v8a: he is not the light — a halo comes to crown him; he shakes his head and sends it on */
      const hk = es(t, 3.05, 3.45, ease.out);
      const shake = bump(t, 3.4, 3.95) * Math.sin(seg(t, 3.4, 3.95) * PI * 6) * 12;
      const away = es(t, 3.7, 4.2);
      john.set({
        x: jx, y: JY, s: 1.02, flip: turn < 0.5, o: seg(t, 0.18, 0.22),
        walk: walk > 0 && walk < 1 ? jx * 0.05 : undefined,
        armF: 12 + greet * 60 + pointA * 88 + bump(t, 3.35, 3.9) * 50,
        armB: greet * 120 + bump(t, 3.35, 3.9) * 70 + es(t, 4.2, 4.5) * 40,
        head: shake - pointA * 6 + bump(t, 3.05, 3.35) * -10, blink: blinkAt(time),
      });
      pose(nameEl, { x: NX, y: lerp(-300, NY, es(t, 1.05, 1.4, ease.out)) - es(t, 2.9, 3.2, ease.in) * 800, r: Math.sin(t * 3.6) * 1.6, o: t > 1 && t < 3.3 ? 1 : 0 });
      const [hx, hy] = headAt(JX, JY, 1.02, false);
      const hTarget = [lerp(hx, LX, away), lerp(hy - 44, LY - 34, away)];
      pose(halo, { x: lerp(hx + 80, hTarget[0], hk), y: lerp(-120, hTarget[1], hk), s: lerp(1, 0.6, away), r: t * 30, o: hk * (1 - es(t, 4.05, 4.25)) });

      /* the true Light rises at the end of the road (v7) and shines brighter (v8b) */
      const rise = es(t, 2.05, 2.6, ease.out);
      const more = es(t, 4.15, 4.6);
      const flick = time ? Math.sin(time * 7.3) * 0.03 : 0;
      pose(tFlame, { x: LX, y: LY + 36 - rise * 20, s: rise * (1 + more * 0.3), sx: rise * (1 + more * 0.3) * (1 + flick), o: rise > 0.01 ? 1 : 0 });
      pose(tGlow, { x: LX, y: LY, s: rise * (0.9 + more * 0.5), o: rise });
      pose(tRays, { x: LX, y: LY, s: 0.4 + rise * 0.6 + more * 0.3, r: t * 3, o: rise * (0.6 + more * 0.4) });

      // the dotted line from his finger to the Light
      const [fx, fy] = hand(JX, JY, 1.02, false, 12 + pointA * 88);
      const pl = pointA * seg(t, 2.35, 2.7) * (1 - es(t, 3.0, 3.1)) + es(t, 4.3, 4.6);
      pose(pointer, { x: fx + 6, y: fy - 2, o: pl > 0.01 ? 0.9 : 0 });
      attr(pointer, 'd', `M0 0L${((LX - fx - 40) * Math.min(1, pl)).toFixed(0)} ${((LY - fy + 10) * Math.min(1, pl)).toFixed(0)}`);

      /* the people come because of him (v7) and look where he points */
      people.forEach((m) => {
        const k = es(t, 2.2 + m.delay * 0.3, 2.8 + m.delay * 0.3);
        const x = lerp(m.from, m.x, k);
        const look = es(t, 2.6, 2.9) + es(t, 4.2, 4.5) * 0.5;
        m.p.set({ x, y: m.y, s: m.s, flip: m.x > LX ? true : false, o: seg(t, 2.15, 2.25), walk: k > 0 && k < 1 ? x * 0.05 : undefined, head: -look * 10, armF: es(t, 4.25, 4.6) * (m.i % 2 ? 70 : 20), armB: es(t, 4.25, 4.6) * (m.i % 2 ? 20 : 130), blink: blinkAt(time, m.seed) });
      });

      S.cam.z = 1.06 - es(t, 1.9, 2.5) * 0.06 + es(t, 3.0, 3.4) * 0.05 - es(t, 4.0, 4.4) * 0.05;
      S.cam.x = -40 * es(t, 0, 0.9) * (1 - es(t, 1.9, 2.5));
      S.cam.y = 20 * (1 - es(t, 1.9, 2.5));
    };
  },
};
