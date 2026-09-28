// Mt 3,3 — Isaiah's word: the prophet's portrait and his scroll come down from the flies over a wide
// valley of the wilderness. John stands high on a ledge and cries out; his voice rolls over the valley
// and echoes from the far cliffs. "Prepare the way of the Lord": people below lift the stones from the
// crooked track, it is pulled straight, and a line of light runs along it towards the horizon.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, rock, sun, cloud } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, headAt, hand, voiceRings, hang2, scrollParts, acacia, scrub, portrait, sparkle, badlands, manOf, womanOf, MORNING, tr } from './lib.js';

const PI = Math.PI;
const HY = 486;                                    // where the track meets the horizon
const ry = (u) => HY + 600 * Math.pow(u, 1.7);     // depth u (0 far … 1 near) → y
const rw = (u) => 4 + 300 * Math.pow(u, 1.5);
const bendX = (u) => 700 + (24 + 250 * Math.pow(u, 1.3)) * Math.sin(2.4 * PI * u + 0.3);
const sAt = (y) => Math.max(0.08, (y - 470) / 300);
const LX = 1040, LY = 548;                         // John on the ledge
const ISAIAH = { robe: mix(C.plumRobe, C.stone, 0.35), mantle: C.ochreRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, veil2: C.terracotta, beard: 'wild', beardColor: '#e6dfd2', skin: C.skin2, belt: C.leather };

function track(c, xf, color, edge) {
  const L = [], R = [];
  for (let i = 0; i <= 60; i++) { const u = i / 60, x = xf(u), y = ry(u), w = rw(u) / 2; L.push([x - w, y]); R.push([x + w, y]); }
  const s = sheet();
  s.p(c.cut([...L, ...R.reverse()], 0.8, 10), color);
  let d = '';
  for (let i = 0; i < 20; i++) { const u = c.rr(0.1, 1), x = xf(u) + c.rr(-0.35, 0.35) * rw(u), y = ry(u); d += c.cut(c.ell(x, y, 2 + u * 6, 1 + u * 2.5, 8), 0.2, 3); }
  s.x(d, edge, 'opacity=".55"');
  return s.out();
}

export default {
  id: 'mt3-voice',
  beats: [
    { v: 3, text: 'Do niego to odnosi się słowo proroka Izajasza, gdy mówi:' },
    { v: 3, cont: true, text: 'Głos wołającego na pustyni:' },
    { v: 3, cont: true, text: 'Przygotujcie drogę Panu, Dla Niego prostujcie ścieżki!' },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, MORNING);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const glow = hangL.add(`<circle r="300" fill="url(#warm-glow)"/>`);
    const burst = hangL.add(`<g>${rays(c, { n: 18, r0: 50, r1: 900, spread: 0.05, color: '#fff1cc' })}</g>`);
    const sunEl = hanging(hangL, sun(c, 46), { x: 1230, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 1000, y: 110, len: 700 });

    /* mountains, badlands, and the valley floor */
    S.layer({ par: 0.07, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [900, 330, 120], color: mix(C.duskViolet, C.dune, 0.45) }).markup);
    const cliffs = S.layer({ par: 0.14, sh: 3 });
    cliffs.add(badlands(c, [[-900, 440], [-400, 400], [0, 370], [240, 400], [380, 470], [520, 520]], mix(C.dune, C.clay, 0.25)));
    const echoL = S.layer({ par: 0.14, sh: 2 });
    const ground = S.layer({ par: 0.3, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(HY - 2, [2, 1], [400, 120]), -900, 2500, 1700, 14, 0.6), C.sand);
    gs.p(c.ridge(c.wave(600, [12, 5], [700, 220]), -900, 2500, 1700, 14, 1), mix(C.sand, C.sand2, 0.5));
    gs.p(c.ridge(c.wave(760, [16, 7], [800, 260]), -900, 2500, 1700, 14, 1), C.sand2);
    ground.add(gs.out());
    ground.add(scrub(c, 470, 540, 26) + scrub(c, 940, 600, 34) + rock(c, 330, 600, 90, 34, C.rock2) + acacia(c, 200, 700, 1.2));

    const bent = S.layer({ par: 0.3, sh: 2 });
    bent.add(track(c, bendX, mix(C.sand, C.cream, 0.45), C.dune));
    const straight = S.layer({ par: 0.3, sh: 2 });
    straight.add(track(c, () => 700, mix(C.sand, C.cream, 0.55), C.dune));
    straight.fade(0);
    const goldL = S.layer({ par: 0.3, sh: 1, flat: true });
    const goldLine = goldL.add(`<g><path d="${c.poly([[696, HY], [704, HY], [720, 1100], [680, 1100]])}" fill="#fff3cf" opacity=".85"/><path d="${c.poly([[690, HY], [710, HY], [780, 1100], [620, 1100]])}" fill="#fff3cf" opacity=".35"/></g>`);

    /* stones on the crooked track, and the people who clear it */
    const act = S.layer({ par: 0.3, sh: 4 });
    const STONES = [0.26, 0.36, 0.46, 0.56].map((u, i) => {
      const w = 20 + u * 60, h = 12 + u * 26;
      return { u, i, w, h, x: bendX(u) + (i % 2 ? 0.2 : -0.15) * rw(u), y: ry(u), dx: (i % 2 ? 1 : -1) * (120 + u * 140), el: act.add(`<g>${rock(c, 0, 0, w, h, i % 2 ? C.rock : C.rock2)}</g>`) };
    });
    const WORK = [
      { o: manOf(c, { belt: C.leather }), u: 0.46, side: -1 },
      { o: womanOf(c, { robe: C.tealRobe }), u: 0.58, side: 1 },
      { o: manOf(c, { robe: C.ochreRobe }), u: 0.7, side: -1 },
    ].map((m, i) => ({ ...m, i, p: S.puppet(act.add(person(c, m.o))), seed: c.rr(0, 9) }));
    const dust = [0, 1, 2, 3, 4].map((i) => act.add(`<g opacity="0">${sparkle(c, 14 + (i % 3) * 4)}</g>`));

    /* John on the ledge */
    const ledge = S.layer({ par: 0.42, sh: 5 });
    const ls = sheet();
    ls.p(c.cut([[900, 1400], [930, 700], [960, 600], [990, LY - 4], [1110, LY - 10], [1180, 580], [1260, 700], [1400, 820], [1600, 900], [2500, 900], [2500, 1400]], 1.4, 10), mix(C.clay, C.dune, 0.35));
    ls.x(c.ribbon([[1000, LY + 30], [1060, LY + 90]], 4) + c.ribbon([[1120, LY + 40], [1180, LY + 130]], 4) + c.ribbon([[980, 700], [1010, 800]], 5), shade(C.clay, -0.2), 'opacity=".5"');
    ledge.add(ls.out());
    ledge.add(scrub(c, 1200, 610, 40, C.olive));
    const john = S.puppet(ledge.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(ledge, c, { n: 4, color: C.clay, r: 46, w: 6, both: false });
    const echoes = [[360, 430], [150, 400], [560, 470]].map(([x, y], i) => ({ x, y, i, el: echoL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 26, 26, PI - 0.6, PI + 0.6, 8), 4)}" fill="${C.clay}"/><path d="${c.ribbon(c.arc(0, 0, 40, 40, PI - 0.55, PI + 0.55, 8), 3)}" fill="${C.clay}"/></g>`) }));

    /* from the flies: Isaiah and his scroll */
    const fly = S.layer({ par: 0.1, sh: 6 });
    const isaiah = hanging(fly, portrait(S, ISAIAH, tr('Izajasz', 'Isaiah'), { w: 120, h: 150 }), { x: 0, y: 0, len: 800 });
    const sp = scrollParts(c, { w: 330, h: 170, title: tr('Izajasz 40,3', 'Isaiah 40:3'), lines: 5 });
    const scrollEl = fly.add(hang2(`<g data-k="v-sheet">${sp.sheet}</g><g data-k="v-rodB">${sp.rod}</g><g>${sp.rod}</g><g data-k="v-mark"><path d="${c.ribbon([[-44, 0], [44, 0]], 5)}" fill="${C.sun}" opacity=".7"/></g>`, 150, 600));
    const sheetEl = S.$('v-sheet'), rodB = S.$('v-rodB'), mark = S.$('v-mark');

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(rock(c, 160, 970, 260, 110, C.rock2) + scrub(c, 330, 950, 70, C.olive) + rock(c, 1500, 980, 200, 90, C.rock));

    return (t, time) => {
      swing(sunEl, 1230, 150, time, 1, 0.6);
      swing(cl1, 1000 + Math.sin(time * 0.1) * 20, 110, time, 1.2, 0.6, 1);

      /* v3a — Isaiah's portrait and scroll come down */
      const pk = es(t, 0.05, 0.4, ease.out), pUp = es(t, 1.9, 2.2, ease.in);
      swing(isaiah, 1010, lerp(-420, 250, pk) - pUp * 700, time, 1.2, 0.7);
      fade(isaiah, pk > 0.01 && pUp < 1 ? 1 : 0);
      const down = es(t, 0.2, 0.55, ease.out), unroll = es(t, 0.5, 0.8), up = es(t, 2.9, 3.3, ease.in);
      pose(scrollEl, { x: 700, y: lerp(-420, 110, down) - up * 700, r: Math.sin(time * 0.6) * 0.6 });
      pose(sheetEl, { sy: 0.03 + unroll * 0.97 });
      pose(rodB, { y: unroll * 170 });
      const line = t < 1 ? 0 : t < 2 ? 1 : 2;
      pose(mark, { x: -90 + seg(t, line + 0.08, line + 0.7) * 150, y: [74, 100, 126][line] + 4, o: unroll > 0.95 ? 0.9 : 0 });

      /* v3b — the voice crying in the wilderness */
      const cry = es(t, 1.05, 1.3);
      const point = es(t, 2.05, 2.3);
      john.set({
        x: LX, y: LY, s: 0.86, flip: true,
        armF: 20 + cry * 70 * (1 - point) + point * 85, armB: 10 + cry * 140 * (1 - point * 0.6),
        head: -cry * 12 + point * 8, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(LX, LY, 0.86, true);
      voice(hx - 14, hy + 2, cry * (1 - es(t, 2.9, 3.1)) * seg(t, 1.1, 1.25), time, { spread: 5.5, s0: 0.6, speed: 0.35, dir: -1, off: 4 });
      echoes.forEach((e) => {
        const k = time ? ((time * 0.5 + e.i * 0.33) % 1) : 0.5;
        const on = es(t, 1.4 + e.i * 0.12, 1.6 + e.i * 0.12) * (1 - es(t, 2.2, 2.5));
        pose(e.el, { x: e.x - k * 20, y: e.y, s: 0.8 + k * 0.8, o: on * (1 - k) });
      });

      /* v3c — the stones are lifted, the crooked way is pulled straight, light runs along it */
      WORK.forEach((m) => {
        const st = STONES[m.i + 1];
        const come = es(t, 2.02 + m.i * 0.04, 2.2 + m.i * 0.04);
        const x = lerp(st.x + m.side * 220, st.x - m.side * 30, come), y = st.y + 4;
        const lift = es(t, 2.2 + m.i * 0.05, 2.3 + m.i * 0.05) * (1 - es(t, 2.36 + m.i * 0.05, 2.44 + m.i * 0.05));
        m.p.set({ x, y, s: sAt(y), flip: m.side > 0, o: seg(t, 1.98, 2.04), walk: come > 0 && come < 1 ? x * 0.08 : undefined, armF: 20 + lift * 70 + es(t, 2.6, 2.75) * 30, lean: lift * 8, head: lift * 12 - es(t, 2.6, 2.75) * 12, blink: blinkAt(time, m.seed) });
      });
      STONES.forEach((st) => {
        const k = es(t, 2.24 + st.i * 0.05, 2.44 + st.i * 0.05);
        pose(st.el, { x: st.x + k * st.dx, y: st.y - st.h * 0.4 - Math.sin(k * PI) * 26, r: k * (st.dx > 0 ? 200 : -200), ox: 0, oy: -st.h * 0.4 });
      });
      const sk = es(t, 2.42, 2.6);
      straight.fade(sk);
      bent.fade(1 - es(t, 2.5, 2.66));
      dust.forEach((d, i) => {
        const u = 0.25 + i * 0.14, k = bump(t, 2.4 + i * 0.03, 2.68 + i * 0.03);
        pose(d, { x: lerp(bendX(u), 700, sk) + (i % 2 ? 1 : -1) * rw(u) * 0.4, y: ry(u) - 8, s: k * (0.6 + u), r: time * 30 + i * 40, o: k });
      });
      const run = es(t, 2.55, 2.74);
      pose(goldLine, { x: 700, y: HY, sy: run, ox: 700, oy: HY, o: run > 0.01 ? 1 : 0 });
      const dawn = es(t, 2.55, 2.8);
      pose(glow, { x: 700, y: HY - 10, s: 0.5 + dawn * 0.9, o: dawn * 0.9 });
      pose(burst, { x: 700, y: HY - 10, s: 0.5 + dawn * 0.5, r: t * 5, o: dawn * 0.4 });

      S.cam.z = 1.04 + es(t, 0.9, 1.4) * 0.08 - es(t, 1.9, 2.3) * 0.1;
      S.cam.x = es(t, 0.9, 1.4) * 30 * (1 - es(t, 1.9, 2.3));
      S.cam.y = -30 + es(t, 0.9, 1.4) * 40 - es(t, 1.9, 2.3) * 30;
    };
  },
};
