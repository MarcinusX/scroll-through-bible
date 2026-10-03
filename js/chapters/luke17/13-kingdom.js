// Łk 17,20–21 — the road by the village, later in the day. "Being asked by the Pharisees when God's Kingdom would
// come": three Pharisees come out of the village gate and stand before Him; the first asks, an hourglass in his
// bubble. "God's Kingdom doesn't come with observation": one of them lifts a long watcher's tube to the sky, and a
// round spyglass view sweeps over the heavens — cloud, sun, empty blue — and finds nothing. "Neither will they say,
// 'Look, here!' or, 'Look, there!'": two signposts spring up, one pointing left, one right — and each is struck
// through. "For behold, God's Kingdom is within you": Jesus opens His hands, and a warm ring of light spreads over the
// ground under them all, the four and the Pharisees too, and little lights rise from it.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { roadSet, ROAD9, roadFour, LEP, lepPhone, pharisee, bubble, hourglass, strung, flyIn, crossX, question, lightMote, voiceRings, headAt, hand, halo, behindOf, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { JX, JY } = LEP;
const PH = [[900, 722, 0], [980, 712, 2], [1060, 718, 4]];

export default {
  id: 'lk17-kingdom',
  beats: [
    { v: 20, text: 'Zapytany przez faryzeuszów, kiedy przyjdzie królestwo Boże, odpowiedział im:' },
    { v: 20, cont: true, text: '«Królestwo Boże nie przyjdzie dostrzegalnie;' },
    { v: 21, text: 'i nie powiedzą: "Oto tu jest" albo: "Tam".' },
    { v: 21, cont: true, text: 'Oto bowiem królestwo Boże pośród was jest».' },
  ],
  cam: { x: [0, 120], y: [-60, 60], z: [0.98, 1.12] },
  build(S) {
    const { DIS } = lepPhone(S);   // phone: the four closer behind Him
    const R = roadSet(S, { village: true });
    const c = S.c;
    /* the spyglass view sweeping the sky */
    const skyFx = S.layer({ par: 0.06, sh: 3 });
    behindOf(skyFx, R.far);
    const view = skyFx.add(`<g opacity="0"><circle r="80" fill="${mix(C.skyBlue, C.cream, 0.4)}" opacity=".55"/><path d="${c.ribbon(c.arc(0, 0, 80, 80, 0, PI * 2, 40), 6)}" fill="${C.ochre}"/><path d="M-80 0H-60M60 0H80M0 -80V-60M0 60V80" stroke="${C.ochre}" stroke-width="3"/></g>`);
    const empty = skyFx.add(`<g opacity="0">${question(c)}</g>`);
    /* the ring of light on the ground (behind them all) */
    const ringL = S.layer({ par: 0.45, sh: 0, flat: true });
    const ring = ringL.add(`<g opacity="0"><ellipse rx="440" ry="80" fill="url(#warm-glow)"/><ellipse rx="300" ry="50" fill="url(#warm-glow)"/></g>`);
    const band = S.layer({ par: 0.45, sh: 2 });
    const hoop = band.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 400, 56, 0, PI * 2, 60), 5)}" fill="${C.sun}" opacity=".9"/></g>`);
    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const act = S.layer({ par: 0.45, sh: 5 });
    const aura = glowL.add(`<g>${halo(130, 0.6)}</g>`);
    const F = roadFour(S, act, c);
    const TUBE = `<g transform="rotate(170) translate(0 4)">${sheet().p(c.ribbon([[0, -10], [0, 70]], 7), C.ochre).p(c.ribbon([[0, 62], [0, 78]], 10), shade2(C.ochre)).out()}</g>`;
    const ph = PH.map(([x, y, i], k) => ({ x, y, k, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...pharisee(i), holdF: k === 1 ? TUBE : '' }))) }));
    const posts = [[610, 420, -1, tr('Oto tu!', 'Look, here!')], [S.portrait ? 1000 : 1080, 416, 1, tr('Tam!', 'There!')]].map(([x, y, d, txt], i) => ({ x, y, d, i, el: act.add(`<g transform="translate(0 -1500)">${strung(arrowBoard(c, txt, d), 0, 2400, [-24, 24])}</g>`), X: act.add(`<g opacity="0">${crossX(c, 30)}</g>`) }));
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 38, w: 5 });
    const fx = S.layer({ par: 0.45, sh: 5 });
    const ask = fx.add(`<g opacity="0">${bubble(c, [tr('Kiedy przyjdzie', 'When will'), tr('królestwo Boże?', "God's Kingdom come?")], { size: 18, tail: 1 })}</g>`);
    const glass = fx.add(`<g opacity="0"><g transform="translate(0 -30) scale(.5)">${hourglass(c)}</g></g>`);
    const motes = Array.from({ length: 9 }, (_, i) => ({ i, x: lerp(460, 1100, i / 8) + c.rr(-20, 20), el: fx.add(`<g opacity="0">${lightMote(c, 4)}</g>`) }));

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.2 + es(t, 0, 4) * 0.2, sunK: 0.1 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, o: 0.5 });

      /* v20a — the Pharisees come from the gate and ask when */
      ph.forEach((m) => {
        const k = es(t, 0.02 + m.k * 0.08, 0.5 + m.k * 0.08, (x) => x);
        const x = lerp(LEP.GATE[0] + m.k * 10, m.x, k), y = lerp(LEP.GATE[1] + 4, m.y, k);
        const s = lerp(0.62, 0.98, k);
        const tube = m.k === 1 ? es(t, 1.1, 1.3) * (1 - es(t, 1.85, 2.0)) : 0;
        const asking = m.k === 0 ? bump(t, 0.5, 1.0) : 0;
        m.p.set({ x, y, s, flip: true, walk: k > 0 && k < 1 ? x * 0.06 : undefined, o: seg(t, 0.0 + m.k * 0.08, 0.05 + m.k * 0.08), armF: 20 + asking * 50 + tube * 110, armB: 8 + asking * 40, head: -tube * 20 + es(t, 3.1, 3.4) * 6, lean: -tube * 4, blink: blinkAt(T, m.seed) });
      });
      const [p0x, p0y] = headAt(PH[0][0], PH[0][1], 0.98, true);
      const ak = es(t, 0.55, 0.7, ease.back) * (1 - es(t, 1.0, 1.08));
      pose(ask, { x: p0x - 60, y: p0y - 40, s: ak, o: ak > 0.01 ? 1 : 0 });
      pose(glass, { x: p0x - 60 + 70 * ak, y: p0y - 120, s: ak * 0.9, o: ak > 0.01 ? 1 : 0 });

      /* v20b — the watcher's tube; the spyglass view finds nothing */
      const sweep = seg(t, 1.2, 1.85);
      const vk = es(t, 1.15, 1.25) * (1 - es(t, 1.85, 1.95));
      pose(view, { x: lerp(1200, 520, sweep), y: 200 + Math.sin(sweep * PI * 2) * 40, o: vk });
      const qk = es(t, 1.62, 1.78, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(empty, { x: 620, y: 150, s: Math.max(0.001, qk) * 1.4, o: qk > 0.01 ? 1 : 0 });

      /* v21a — "Look, here!" "There!" — and both struck through */
      posts.forEach((p, i) => {
        const k = es(t, 2.05 + i * 0.12, 2.3 + i * 0.12, ease.back) * (1 - es(t, 3.05, 3.3));
        flyIn(p.el, k, p.x, p.y, T, i, 1.4);
        const xk = es(t, 2.5 + i * 0.1, 2.65 + i * 0.1, ease.back) * (1 - es(t, 3.0, 3.1));
        pose(p.X, { x: p.x, y: p.y + 22, s: Math.max(0.001, xk), o: xk > 0.01 ? 1 : 0 });
      });

      /* v21b — the Kingdom among you: a ring of light on the ground under them all */
      const open = es(t, 3.05, 3.3);
      F.jesus.set({ x: JX, y: JY, s: 1.04, armF: 16 + bump(t, 1.05, 1.9) * 40 + bump(t, 2.05, 2.9) * 30 + open * 50, armB: 8 + bump(t, 2.05, 2.9) * 80 + open * 60, head: open * 4, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 150 });
      const [jhx, jhy] = headAt(JX, JY, 1.04, false);
      voice(jhx + 14, jhy, es(t, 1.02, 1.12) * (1 - es(t, 1.8, 1.9)) + es(t, 2.02, 2.1) * (1 - es(t, 2.8, 2.9)) + es(t, 3.02, 3.1) * (1 - es(t, 3.7, 3.8)), T, { dir: 1, spread: 2 });
      const rk = es(t, 3.1, 3.6);
      pose(ring, { x: 760, y: 736, sx: 0.2 + rk * 0.9, sy: 0.3 + rk * 0.7, o: rk });
      pose(hoop, { x: 760, y: 740, sx: 0.2 + rk * 0.8, sy: 0.2 + rk * 0.8, o: rk });
      motes.forEach((m) => {
        const k = (T ? (T * 0.25 + m.i / 9) % 1 : (m.i + 1) / 10);
        pose(m.el, { x: m.x + Math.sin(k * 6 + m.i) * 8, y: 720 - k * 120, s: 0.8 + k * 0.3, o: rk * (1 - k) });
      });
      F.ds.forEach((d) => {
        const [, x, y] = DIS.find((e) => e[0] === d.k);
        d.p.set({ x, y, s: 0.96, armF: 20 + es(t, 3.3, 3.6) * 20, armB: 6, head: -4 + es(t, 3.3, 3.6) * 8, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = kf(t, [[0, 70], [1, 60], [1.3, 60], [1.9, 40], [2.2, 50], [3, 50], [3.5, 40]]);
      S.cam.y = kf(t, [[0, 20], [1, 30], [1.3, -40], [1.9, -40], [2.2, 30], [4, 30]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.08], [1.3, 1.0], [1.9, 1.0], [2.2, 1.04], [4, 1.06]]);
    };
  },
};
function shade2(col) { return mix(col, '#2a1d12', 0.2); }
/** a hanging arrow board: "look, here!" (origin: top centre; dir -1 points left) */
function arrowBoard(c, text, dir) {
  const w = 40 + text.length * 11;
  const pts = dir > 0 ? [[-w / 2, 0], [w / 2, 0], [w / 2 + 22, 22], [w / 2, 44], [-w / 2, 44]] : [[w / 2, 0], [-w / 2, 0], [-w / 2 - 22, 22], [-w / 2, 44], [w / 2, 44]];
  const s = sheet().p(c.cut(pts, 0.5, 6), C.wood3);
  return `${s.out()}<text x="${dir * 6}" y="30" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="22" font-style="italic" fill="${C.ink}">${text}</text>`;
}
