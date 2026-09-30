// J 8,56–59 — "Abraham rejoiced to see My day" — a great plate comes down: Abraham by his tent under the stars,
// looking toward a far light on the horizon; the light grows and he lifts his arms for joy. "You are not yet fifty,
// and have You seen Abraham?" — a card "50" is held up beside a little faraway portrait. "Amen, amen" — a hush; the
// lamps sink low. "Before Abraham came to be, I AM" — a dial of the hours comes down and its hand spins faster and
// faster until the dial dissolves into a ring without end; the I AM blazes and light floods the court. They snatch up
// stones (held, never thrown) — but Jesus is hidden in the light, and a small figure goes out through the gate.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { stars } from '../../assets/nature.js';
import { nightStage, DC, LC, NIGHT, voiceRings, framed, ABRAHAM, tentMamre, sepia, numberCard, question, iAm, glory, eternityRing, drawRing, stone, hand, kf, vis, tr, PI, FONT } from './lib.js';

const PW = 520, PH = 300;

/** a dial of the twelve hours (origin centre); the hand is a separate piece */
function dial(c, r = 90) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 12, 40), 0.5, 6), C.wood3).p(c.cut(c.circ(0, 0, r, 40), 0.4, 6), C.parchment);
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; ticks += c.ribbon([[Math.cos(a) * (r - 14), Math.sin(a) * (r - 14)], [Math.cos(a) * (r - 4), Math.sin(a) * (r - 4)]], i % 3 ? 2 : 3.6); }
  s.x(ticks, C.inkSoft, 'opacity=".7"');
  const N = ['XII', 'III', 'VI', 'IX'];
  const txt = N.map((n, i) => { const a = -PI / 2 + i * PI / 2; return `<text x="${(Math.cos(a) * (r - 30)).toFixed(1)}" y="${(Math.sin(a) * (r - 30) + 6).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.terracotta}">${n}</text>`; }).join('');
  return `<path d="M0 -1600V${-r - 12}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${txt}`;
}

export default {
  id: 'j8-iam',
  beats: [
    { v: 56 },
    { v: 57 },
    { v: 58, text: 'Rzekł do nich Jezus: «Zaprawdę, zaprawdę, powiadam wam:' },
    { v: 58, cont: true, text: 'Zanim Abraham stał się, JA JESTEM».' },
    { v: 59, text: 'Porwali więc kamienie, aby je rzucić na Niego.' },
    { v: 59, cont: true, text: 'Jezus jednak ukrył się i wyszedł ze świątyni.' },
  ],
  cam: { x: [-40, 80], y: [-120, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    const fx = st.fx;
    const rings = voiceRings(fx, c, { n: 3, r: 36, w: 5, both: false, color: shade(C.halo, -0.05) });
    // Abraham under the stars (sepia night)
    const SK = mix('#3a3a5e', C.dune, 0.25);
    const inner = `<rect width="${PW}" height="${PH}" fill="${SK}"/>${stars(c, { x0: 10, x1: PW - 10, y0: 10, y1: PH - 90, n: 70, color: mix(C.star, C.dune, 0.2) })}<path d="M0 ${PH - 60}Q${PW / 2} ${PH - 74} ${PW} ${PH - 60}V${PH}H0Z" fill="${mix(C.dune, SK, 0.35)}"/><g transform="translate(110 ${PH - 58})">${tentMamre(c, 150, 110, mix(C.wheatRobe, SK, 0.35))}</g>`;
    const plate = fx.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, k: 'stars' })}</g>`);
    const far = fx.add(`<g><circle r="70" fill="url(#halo-glow)"/><circle r="30" fill="url(#warm-glow)"/><path d="${c.cut(c.star(0, 0, 14, 5, 4, 0), 0.2, 3)}" fill="${C.star}"/></g>`);
    const abr = S.puppet(fx.add(person(c, { ...sepia(ABRAHAM, 0.35), halo: false })));
    // "not yet fifty" and a faraway Abraham
    const fifty = fx.add(`<g>${numberCard(c, '50', { size: 34 })}</g>`);
    const tiny = fx.add(`<g><rect x="-24" y="-30" width="48" height="58" fill="${C.wood3}"/><rect x="-20" y="-26" width="40" height="50" fill="${mix(C.parchment, C.dune, 0.3)}"/><g transform="translate(0 22) scale(.2)">${person(c, sepia({ ...ABRAHAM, halo: false }, 0.5))}</g></g>`);
    const q = fx.add(`<g>${question(c)}</g>`);
    // the dial, the endless ring, the I AM, the light
    const dialEl = fx.add(`<g>${dial(c, 90)}</g>`);
    const handEl = fx.add(`<g><path d="${c.ribbon([[0, 10], [0, -74]], (u) => 6 - u * 4)}" fill="${C.inkSoft}"/><circle r="6" fill="${C.wood2}"/></g>`);
    const ring = fx.add(`<g><circle r="150" fill="url(#halo-glow)"/>${eternityRing(c, 110, 8, 28)}</g>`);
    const lightL = S.layer({ par: 0.5, sh: 1 });
    const glo = lightL.add(`<g>${glory(c, 520, 26)}</g>`);
    const fx2 = S.layer({ par: 0.62, sh: 6 });
    const am = fx2.add(`<g>${iAm(c, tr('JA JESTEM', 'I AM'), { size: 44 })}</g>`);
    const hide = fx2.add(`<g><circle r="170" fill="url(#halo-glow)"/><circle r="90" fill="url(#warm-glow)"/></g>`);
    // the stones, picked up and never thrown
    const stones = K.lead.slice(0, 4).map(() => fx2.add(`<g>${stone(c, 14, mix(C.rock2, C.rock3, 0.35))}</g>`));
    // the small figure going out through the gate
    const goer = S.puppet(st.back.add(person(c, CAST.jesus)));

    return (t, time) => {
      const T = time;
      const hush = es(t, 2.05, 2.4) * (1 - es(t, 3.1, 3.4));
      st.set.update(t, T, { lit: 1 - hush * 0.6, moonY: 150, glowO: 0.7, gate: 0.6 + es(t, 5.1, 5.4) * 0.4 });
      /* v56 — Abraham under the stars */
      const pk = es(t, 0.05, 0.4, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      const PX = 800, PY = 90 - (1 - pk) * 700;
      vis(plate, { x: PX, y: PY, o: pk > 0.001 ? 1 : 0 });
      const glow = es(t, 0.35, 0.8);
      vis(far, { x: PX + PW / 2 - 80, y: PY + PH - 72, s: 0.4 + glow * 0.9 + (T ? Math.sin(T * 2) * 0.03 : 0), o: pk > 0.001 ? 0.3 + glow * 0.7 : 0 });
      const joy = es(t, 0.55, 0.85);
      abr.set({ x: PX - PW / 2 + 250, y: PY + PH - 60, s: 0.6, o: pk > 0.001 ? 1 : 0, armF: 20 + joy * 70, armB: 10 + joy * 150, head: -joy * 12, blink: 0 });
      /* v57 — fifty, and Abraham so far away */
      const fk = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      const [lx, ly] = hand(K.lead[0].x, K.lead[0].y, K.lead[0].s, true, 20 + fk * 100);
      vis(fifty, { x: lx - 10, y: ly - 30, s: fk, r: -6, o: fk > 0.01 ? 1 : 0 });
      const tk = es(t, 1.3, 1.5) * (1 - es(t, 1.9, 2.05));
      vis(tiny, { x: S.portrait ? 570 : 400, y: 330, s: 0.7 + tk * 0.3, o: tk });
      vis(q, { x: S.portrait ? 680 : 520, y: 330, s: tk, o: tk > 0.01 ? 1 : 0 });
      /* v58b — the dial spins into eternity; the I AM; the light */
      const dk = es(t, 2.2, 2.5, ease.out) * (1 - es(t, 3.35, 3.55));
      const DX = 800, DY = 230 - (1 - es(t, 2.2, 2.5, ease.out)) * 700;
      vis(dialEl, { x: DX, y: DY, o: dk });
      const spin = t < 3 ? (t - 2.2) * 60 : 48 + Math.pow(Math.max(0, t - 3), 2) * 4000;
      vis(handEl, { x: DX, y: DY, r: spin, o: dk });
      const rk = es(t, 3.3, 3.6);
      vis(ring, { x: DX, y: 230, o: rk * (1 - es(t, 4.1, 4.4) * 0.6) });
      drawRing(ring, es(t, 3.3, 3.7));
      const ak = es(t, 3.35, 3.6, ease.back) * (1 - es(t, 4.1, 4.3) * 0.7);
      vis(am, { x: 800, y: 380, s: ak, o: ak > 0.01 ? 1 : 0 });
      const gk = es(t, 3.3, 3.7) * (1 - es(t, 4.05, 4.4) * 0.7);
      vis(glo, { x: DC.JX, y: 330, s: 0.7 + gk * 0.3, o: gk * 0.6 });
      /* v59a — the stones; v59b — hidden in the light, and gone out */
      const grab = es(t, 4.1, 4.45);
      const lift = es(t, 4.45, 4.7);
      const lower = es(t, 5.4, 5.8);
      const hk = bump(t, 5.05, 5.5);
      vis(hide, { x: DC.JX, y: DC.FLOOR - 110, s: 0.6 + hk * 0.8, o: hk });
      const jo = 1 - es(t, 5.15, 5.3);
      const out = es(t, 5.3, 5.95);
      goer.set({ x: 800, y: lerp(LC.STEP0 - 10, LC.STEP1 + 10, out), s: lerp(0.62, 0.45, out), walk: out > 0 && out < 1 ? t * 40 : undefined, flip: false, o: out > 0 ? 1 - es(t, 5.85, 5.98) : 0, armF: 10, blink: 0 });

      const talk = Math.max(bump(t, 0.05, 0.95), bump(t, 2.05, 3.95));
      K.set(T, {
        j: { o: jo, armF: 16 + talk * 24, armB: 10 + bump(t, 2.1, 2.9) * 150 + es(t, 3.2, 3.5) * 60 * (1 - es(t, 4.1, 4.4)), head: -es(t, 3.2, 3.5) * 8 * (1 - es(t, 4.1, 4.4)) },
        lisF: (m) => ({ head: -4 - gk * 8 + es(t, 5.3, 5.6) * -10 }),
        leadF: (m) => {
          const bend = m.i < 4 ? bump(t, 4.1, 4.45) : 0;
          const look = es(t, 5.3, 5.6);
          return {
            armF: 20 + (m.i === 0 ? fk * 100 : 0) + (m.i < 4 ? (grab * 20 + lift * 80) * (1 - lower * 0.7) : 0), armB: 10 + (m.i === 1 ? bump(t, 1.2, 1.9) * 60 : 0),
            lean: bend * 18, head: bend * 20 - look * 10 * (m.i % 2 ? 1 : -1), flip: !(look > 0.5 && m.i % 2 === 0), angry: 0.5 + es(t, 4.0, 4.3) * 0.5 - lower * 0.3,
          };
        },
      });
      K.lead.slice(0, 4).forEach((m, i) => {
        const look = es(t, 5.3, 5.6);
        const fl = !(look > 0.5 && m.i % 2 === 0);
        const a = 20 + (grab * 20 + lift * 80) * (1 - lower * 0.7);
        const [hx, hy] = hand(m.x, m.y, m.s, fl, a, bump(t, 4.1, 4.45) * 18);
        vis(stones[i], { x: hx, y: hy + 4, s: m.s, o: es(t, 4.3, 4.4) });
      });
      rings(DC.JX + 6, DC.FLOOR - 172, talk * jo, T, { dir: 1, s0: 0.7, spread: 1.8 });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.3, 40], [2.0, 30], [2.3, 0], [4.0, 0], [4.3, 50], [5.0, 50], [5.3, 0]]);
      S.cam.y = kf(t, [[0, -110], [1.0, -100], [1.3, -20], [2.0, -20], [2.3, -80], [3.6, -90], [4.1, -10], [5.0, -10], [5.3, -30]]);
      S.cam.z = kf(t, [[0, 1.0], [1.3, 1.08], [2.3, 1.02], [3.6, 1.0], [4.3, 1.1], [5.0, 1.1], [5.3, 1.0]]);
    };
  },
};
