// Mt 22,29–33 — Jesus answers the Sadducees. Two plates come down: the Scriptures and the power of God.
// Heaven opens a little: angels on strings, and the two wedding rings float away — no marrying there.
// A painted panel: Moses before the burning bush; three portraits hang above it — Abraham, Isaac, Jacob —
// sepia, like the dead, until colour floods back into them: God of the living. The Sadducees' sealed tomb
// bursts, and the crowds, astonished, crowd in to listen.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix, shade } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { templeCourt, LOOK, sadducee, moodPuppet, voiceRings, thought, scrollOpen, disc, angel, ring, burningBush, flipPortrait, strip, glory, sparkle, tr, sheet } from './lib.js';

const JX = 640;
const SX = [900, 972, 1044];
const PX0 = 560, PX1 = 1040, PY0 = 150, PY1 = 430;
const SEPIA = mix(C.parchment, C.wood3, 0.45);
const sepia = (o) => { const r = {}; for (const [k, v] of Object.entries(o)) r[k] = typeof v === 'string' && v[0] === '#' ? mix(v, SEPIA, 0.72) : v; return r; };

export default {
  id: 'mt22-living',
  beats: [
    { v: 29 },
    { v: 30 },
    { v: 31 },
    { v: 32, text: 'Ja jestem Bóg Abrahama, Bóg Izaaka i Bóg Jakuba?' },
    { v: 32, cont: true, text: 'Bóg nie jest [Bogiem] umarłych, lecz żywych».' },
    { v: 33 },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 4, x0: 380, x1: 600, pose: 'sit' }, { y: 604, s: 0.66, n: 3, x0: 1080, x1: 1240, pose: 'sit' }]);

    /* heaven: light and angels on strings, two rings floating away */
    const heav = S.layer({ par: 0.2, sh: 5 });
    const light = heav.add(`<g opacity="0">${glory(c, 520, 24)}</g>`);
    const angels = [0, 1, 2].map((i) => {
      const el = heav.add(`<g><path d="M0 -1400V-190" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${angel(c, { k: 'ang' + i })}</g>`);
      return { el, p: S.puppet(el.querySelector('.fig')), x: [520, 800, 1080][i], y: [300, 250, 300][i], i };
    });
    const rings = [0, 1].map(() => heav.add(`<g>${ring(c, 22)}</g>`));

    /* the two plates: Scriptures, power of God */
    const plates = S.layer({ par: 0.3, sh: 6 });
    const scrollIcon = `<g transform="scale(.62)">${scrollOpen(c, 90, 60)}</g>`;
    let burst = '';
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; burst += c.poly([[Math.cos(a - 0.12) * 14, Math.sin(a - 0.12) * 14], [Math.cos(a) * 40, Math.sin(a) * 40], [Math.cos(a + 0.12) * 14, Math.sin(a + 0.12) * 14]]); }
    const powerIcon = `<path d="${burst}" fill="${C.sun}"/><path d="${c.cut(c.circ(0, 0, 16, 18), 0.3, 4)}" fill="${C.halo}"/>`;
    const plA = hanging(plates, `${disc(c, 56)}${scrollIcon}<g transform="translate(0 74)">${strip(c, tr('Pismo', 'the Scriptures'), { size: 16 })}</g>`, { x: 540, y: -300, len: 500 });
    const plB = hanging(plates, `${disc(c, 56)}${powerIcon}<g transform="translate(0 74)">${strip(c, tr('moc Boża', 'the power of God'), { size: 16 })}</g>`, { x: 1060, y: -300, len: 500 });

    /* the painted panel: Moses and the bush */
    const pan = S.layer({ par: 0.3, sh: 6 });
    const ps = sheet();
    ps.p(c.cut([[PX0 - 10, PY0 - 10], [PX1 + 10, PY0 - 12], [PX1 + 12, PY1 + 10], [PX0 - 12, PY1 + 12]], 0.6, 10), C.wood3);
    ps.p(c.cut([[PX0, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.dawn, C.parchment, 0.4));
    ps.p(c.ridge((x) => 300 + 70 * Math.cos((x - PX0 - 240) / 150) * Math.exp(-Math.pow((x - PX0 - 200) / 260, 2)) * -1 + 40 * Math.sin((x - PX0) / 55), PX0, PX1 - 12, PY1, 10, 1.5), mix(C.dune, C.clay, 0.25));
    ps.p(c.ridge(c.wave(350, [16, 6], [240, 80]), PX0, PX1 - 12, PY1, 10, 1), mix(C.dune, C.sand2, 0.5));
    ps.p(c.cut([[PX0, 404], [PX1, 398], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.sand, C.dune, 0.35));
    const panelEl = pan.add(`<g><path d="M${PX0 + 20} -1400V${PY0 - 10}M${PX1 - 20} -1400V${PY0 - 10}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${ps.out()}</g>`);
    const bp = burningBush(c, 90, true);
    const bush = pan.add(`<g>${bp.glow}${bp.bush}</g>`);
    const fl = bp.flames.map((f) => pan.add(`<g>${f}</g>`));
    const moses = S.puppet(pan.add(person(c, { ...LOOK.moses, pose: 'kneel' })));
    const pats = [LOOK.abraham, LOOK.isaac, LOOK.jacob].map((o, i) => {
      const alive = flipPortrait(c, S.id('pa' + i), o, { w: 64, h: 80 });
      const dead = flipPortrait(c, S.id('pd' + i), sepia(o), { w: 64, h: 80, frame: mix(C.ochre, SEPIA, 0.7) });
      const name = [tr('Abraham', 'Abraham'), tr('Izaak', 'Isaac'), tr('Jakub', 'Jacob')][i];
      const el = pan.add(`<g><path d="M0 -1400V-46" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${alive.defs}${dead.defs}<g data-part="glow" opacity="0"><circle r="80" fill="url(#warm-glow)"/></g><g data-part="alive" opacity="0">${alive.front}</g><g data-part="dead">${dead.front}</g><g transform="translate(0 58)">${strip(c, name, { size: 15 })}</g></g>`);
      return { el, alive: el.querySelector('[data-part="alive"]'), dead: el.querySelector('[data-part="dead"]'), glow: el.querySelector('[data-part="glow"]'), x: [690, 800, 910][i], i };
    });
    const sparks = [0, 1, 2, 3, 4, 5].map(() => pan.add(`<g>${sparkle(c, 9)}</g>`));

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const more = crowd(S, pl, [{ y: F + 16, s: 0.88, n: 3, x0: 300, x1: 450 }, { y: F + 18, s: 0.88, n: 3, x0: 1130, x1: 1300 }]);
    more.forEach((m) => { m.from = m.x < 800 ? m.x - 460 : m.x + 460; });
    const dis = [CAST.peter, CAST.john].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 500 - i * 60, i }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const sad = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, sadducee(i)), seed: c.rr(0, 9) }));
    const tomb = sheet().p(c.cut([[-26, 16], [-26, -6], ...c.arc(0, -6, 26, 22, Math.PI, 2 * Math.PI, 10), [26, 16]], 0.6, 5), C.rock2).p(c.cut(c.circ(6, 4, 13, 14), 0.4, 4), C.rock).x(c.ribbon([[-24, -22], [22, 18]], 5) + c.ribbon([[22, -22], [-24, 18]], 5), C.terracotta).out();
    const noRes = pl.add(`<g>${thought(c, tomb, { w: 90, h: 72 })}</g>`);
    const glad = [0, 1, 2, 3, 4].map(() => pl.add(`<g>${sparkle(c, 10)}</g>`));

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v29 — the two plates */
      const pk = es(t, 0.15, 0.55, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      pose(plA, { x: 540, y: lerp(-800, 250, pk), r: Math.sin(T * 0.9) * 1.5 });
      pose(plB, { x: 1060, y: lerp(-800, 250, es(t, 0.3, 0.7, ease.out) * (1 - es(t, 0.95, 1.2, ease.in))), r: Math.sin(T * 0.8 + 1) * 1.5 });

      /* v30 — angels, the light of heaven; rings float away */
      const hv = es(t, 1.05, 1.45) * (1 - es(t, 1.9, 2.15));
      pose(light, { x: 800, y: 120, r: T * 1.5, o: hv * 0.8 });
      angels.forEach((a) => {
        const k = es(t, 1.1 + a.i * 0.08, 1.5 + a.i * 0.08, ease.out) * (1 - es(t, 1.9, 2.2, ease.in));
        pose(a.el, { x: a.x, y: lerp(-800, a.y, k) + Math.sin(T * 1.2 + a.i) * 4 * k });
        a.p.set({ x: 0, y: 0, s: 0.72, flip: a.i === 2, armF: 60, armB: 140, head: -6, blink: blinkAt(T, a.i) });
      });
      const rk = seg(t, 1.2, 1.9);
      rings.forEach((el, i) => pose(el, { x: 800 + (i ? 1 : -1) * (8 + rk * 70), y: 470 - 60 - rk * 120, r: rk * (i ? 90 : -90), o: bump(t, 1.2, 1.9) }));

      /* v31 — the panel: Moses at the bush */
      const pd = es(t, 2.05, 2.45, ease.out) * (1 - es(t, 4.9, 5.3, ease.in));
      const dy = lerp(-900, 0, pd);
      pose(panelEl, { y: dy });
      pose(bush, { x: 880, y: 404 + dy });
      fl.forEach((f, i) => { const k = 1 + Math.sin(T * (7 + i * 2) + i) * 0.06; pose(f, { x: 880, y: 404 + dy - 30, sx: 1 / k, sy: k, oy: -30, o: pd > 0.01 ? 1 : 0 }); });
      moses.set({ x: 700, y: 408 + dy, s: 0.62, head: 10, armF: 60 + bump(t, 2.4, 3.0) * 20, armB: 120, lean: 8, blink: blinkAt(T, 5) });
      /* v32 — Abraham, Isaac, Jacob: sepia, then alive */
      pats.forEach((p) => {
        const k = es(t, 3.05 + p.i * 0.12, 3.35 + p.i * 0.12, ease.out);
        pose(p.el, { x: p.x, y: lerp(-800, 236, k) + dy });
        const life = es(t, 4.05 + p.i * 0.15, 4.35 + p.i * 0.15);
        fade(p.alive, life); fade(p.dead, 1 - life); fade(p.glow, life * 0.9);
      });
      sparks.forEach((el, i) => {
        const p = pats[i % 3], a = 4.2 + (i % 3) * 0.15;
        const k = seg(t, a, a + 0.7);
        pose(el, { x: p.x + (i < 3 ? -1 : 1) * (26 + k * 30), y: 236 + dy - 20 - k * 40, s: 1 - k * 0.5, o: bump(t, a, a + 0.7) });
      });

      /* Jesus and the Sadducees */
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), head: -bump(t, 1.0, 5.0) * 10, armF: 40 + 30 + bump(t, 2.1, 4.9) * 60, armB: 20 + bump(t, 1.1, 1.9) * 100 + bump(t, 4.1, 4.9) * 40 });
      voice(JX + 26, F - 176, 1 - es(t, 4.9, 5.1), T, { dir: 1 });
      const wrong = es(t, 4.1, 4.4);
      const leave = es(t, 5.05, 5.6, ease.in);
      sad.forEach((m) => {
        const x = lerp(SX[m.i], 1500 + m.i * 60, leave);
        m.p.set({ x, y: F + 4 + (m.i % 2) * 8, s: 0.93, flip: leave < 0.02, walk: leave > 0 && leave < 1 ? x * 0.05 + m.i : undefined, blink: blinkAt(T, m.seed), armF: 26 + wrong * 20, armB: bump(t, 3.3, 3.9) * (m.i === 1 ? 70 : 0), head: -bump(t, 1.0, 4.0) * 12 + wrong * 14, lean: wrong * 4 });
        m.p.mood({ sad: es(t, 0.3, 0.6) * (1 - es(t, 1.0, 1.2)) + wrong, angry: 0 });
      });
      const nk = es(t, 4.05, 4.2, ease.back);
      const pop = es(t, 4.45, 4.75, ease.in);
      pose(noRes, { x: SX[1] - 6, y: F - 204 + pop * 160, s: nk * (1 - pop * 0.5), r: pop * 40, o: nk > 0.02 ? 1 - pop : 0 });
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + d.i * 8, s: 0.9, head: -bump(t, 1.0, 5.0) * 14, armF: es(t, 5.1, 5.4) * 50, blink: blinkAt(T, d.i + 3) }));
      /* v33 — the crowds are astonished */
      const aw = es(t, 5.1, 5.4);
      more.forEach((m) => {
        const k = es(t, 5.02 + m.delay * 0.3, 5.45 + m.delay * 0.3);
        const x = lerp(m.from, m.x, k);
        m.p.set({ x, y: m.y, s: m.s, flip: m.x > JX, walk: k > 0 && k < 1 ? x * 0.05 : undefined, head: -4, armF: aw * (m.i % 2 ? 60 : 20), armB: aw * (m.i % 3 === 0 ? 120 : 0), blink: blinkAt(T, m.seed), o: k > 0 ? 1 : 0 });
      });
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -bump(t, 1.0, 5.0) * 16 - 3, armF: aw * (m.i % 2 ? 60 : 20), blink: blinkAt(T, m.seed) }));
      glad.forEach((el, i) => {
        const k = ((T * 0.35 + i / 5) % 1);
        pose(el, { x: 380 + i * 200 + Math.sin(k * 6) * 10, y: F - 230 - k * 60, s: 0.7, o: aw * Math.sin(k * Math.PI) });
      });

      S.cam.z = 1 + es(t, 2.0, 2.5) * 0.04 * (1 - es(t, 4.9, 5.4));
      S.cam.y = -es(t, 2.0, 2.5) * 24 * (1 - es(t, 4.9, 5.4));
    };
  },
};
