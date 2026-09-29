// Łk 20,37–40 — "That the dead are raised, even Moses showed in the passage about the bush, where he calls the Lord the
// God of Abraham, the God of Isaac and the God of Jacob": a painted panel of the desert comes down — Moses kneeling,
// his sandals off, before the thorn bush that burns and is not burnt up — and three oval portraits come down over it:
// Abraham, Isaac and Jacob, faded to the brown of old paint. "He is not the God of the dead, but of the living":
// colour floods back into the three faces, one after another. "For all live to Him": little lamp-flames light up one by
// one all across the court above the people, until the whole court is starred with them. "Then some of the scribes
// answered: Teacher, You have spoken well": the panel goes up; a scribe on the right nods and lifts his hand. "For they
// no longer dared to ask Him anything": the paper "?" each of them had brought is drawn up into the flies, and they
// step back.
import { C, person, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { fade } from '../../core/anim.js';
import { courtSet, CQ, SADDUCEES, LEADERS, LOOK, panel, panelSky, panelGround, figure, burningBush, flipPortrait, label, tinyFlame, bubble, question, popAt, dropIn, oppHead, kf, tr, es, ease, bump, seg } from './lib.js';

const PW = 360, PH = 230, PY = 300;
const SEPIA = '#b9a78c';
const sepia = (o) => { const r = {}; for (const [k, v] of Object.entries(o)) r[k] = typeof v === 'string' && v[0] === '#' ? mix(v, SEPIA, 0.72) : v; return r; };
const LAMPS = [[470, 200], [560, 150], [650, 120], [950, 120], [1040, 150], [1130, 200], [440, 330], [1160, 330], [520, 430], [1080, 430], [610, 470], [990, 470], [700, 110], [900, 110]];

function desertInner(S, c) {
  let m = panelSky(S, PW, PH, ['#e8d2b0', '#f6e2c0']);
  m += sheet().p(c.cut([[-PW / 2 - 10, 50], [-90, 20], [-10, 34], [70, 10], [PW / 2 + 10, 30], [PW / 2 + 10, 120], [-PW / 2 - 10, 120]], 0.8, 10), mix(C.dune, C.clay, 0.2)).out();
  m += panelGround(c, PW, 84, mix(C.sand, C.dune, 0.35), 2);
  m += figure(c, { ...LOOK.moses, pose: 'kneel' }, { x: -64, y: 92, s: 0.5, head: 10, armF: 80, armB: 120, lean: 8 });
  m += sheet().p(c.cut(c.ell(-140, 90, 9, 3.4, 10), 0.3, 3) + c.cut(c.ell(-122, 92, 9, 3.4, 10), 0.3, 3), C.sandal).out();
  return m;
}

export default {
  id: 'lk20-bush',
  beats: [
    { v: 37 },
    { v: 38, text: 'Bóg nie jest [Bogiem] umarłych, lecz żywych;' },
    { v: 38, cont: true, text: 'wszyscy bowiem dla Niego żyją».' },
    { v: 39 },
    { v: 40 },
  ],
  cam: { x: [-20, 60], y: [-80, 30], z: [1, 1.1] },
  build(S) {
    const Q = courtSet(S, { opp: [SADDUCEES[0], SADDUCEES[1], LEADERS[1]] });
    const c = Q.c;
    const pan = Q.flyL.add(panel(S, desertInner(S, c), { w: PW, h: PH, word: tr('krzak', 'the bush') }));
    const bp = burningBush(c, 64, true);
    const bushEl = Q.flyL.add(`<g><g transform="scale(.6)">${bp.glow}</g>${bp.bush}</g>`);
    const fl = bp.flames.map((f) => Q.flyL.add(`<g>${f}</g>`));
    const names = [tr('Abraham', 'Abraham'), tr('Izaak', 'Isaac'), tr('Jakub', 'Jacob')];
    const pats = [LOOK.abraham, LOOK.isaac, LOOK.jacob].map((o, i) => {
      const alive = flipPortrait(c, S.id('pa' + i), o, { w: 56, h: 70 });
      const dead = flipPortrait(c, S.id('pd' + i), sepia(o), { w: 56, h: 70, frame: mix(C.ochre, SEPIA, 0.7) });
      const el = Q.flyL.add(`<g><path d="M0 -1600V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${alive.defs}${dead.defs}<g data-part="alive" opacity="0">${alive.front}</g><g data-part="dead">${dead.front}</g><g transform="translate(0 52)">${label(c, names[i], { size: 13 })}</g></g>`);
      return { i, el, alive: el.querySelector('[data-part="alive"]'), dead: el.querySelector('[data-part="dead"]'), x: [700, 800, 900][i] };
    });
    const lamps = LAMPS.map(([x, y], i) => ({ i, x, y, el: Q.rayFx.add(`<g opacity="0">${tinyFlame(c, 22)}</g>`) }));
    const well = Q.W.add(`<g opacity="0">${bubble(c, [tr('Nauczycielu,', 'Teacher,'), tr('dobrze powiedziałeś!', 'You speak well!')], { size: 18, tail: 1 })}</g>`);
    const qs = [0, 1, 2].map(() => Q.W.add(`<g opacity="0">${question(c)}</g>`));

    return (t, time) => {
      const T = time;
      /* v37 — Moses at the bush; the three fathers */
      const pk = dropIn(pan, t, 0.02, 3.3, CQ.JX, PY, { d: 0.25 });
      const py = lerp(-1500, PY, pk);
      pose(bushEl, { x: CQ.JX + 70, y: py + 88, o: pk > 0.002 ? 1 : 0 });
      fl.forEach((f, i) => { const k = 1 + (T ? Math.sin(T * (7 + i * 2) + i) * 0.06 : 0); pose(f, { x: CQ.JX + 70, y: py + 88 - 18, sx: 0.64 / k, sy: 0.64 * k, oy: -30, o: pk > 0.002 ? 1 : 0 }); });
      pats.forEach((p) => {
        const k = es(t, 0.3 + p.i * 0.08, 0.5 + p.i * 0.08, ease.out) * (1 - es(t, 3.0, 3.3, ease.in));
        pose(p.el, { x: p.x, y: lerp(-1500, py - 52, k) + (k < 1 ? 0 : 0), r: T ? Math.sin(T * 0.9 + p.i) * 1.2 : 0, o: k > 0.002 ? 1 : 0 });
        /* v38a — the living */
        const life = es(t, 1.1 + p.i * 0.15, 1.35 + p.i * 0.15);
        fade(p.alive, life); fade(p.dead, 1 - life);
      });
      /* v38b — all live to Him: the lamps light across the court */
      lamps.forEach((l) => {
        const k = es(t, 2.05 + l.i * 0.04, 2.15 + l.i * 0.04) * (1 - es(t, 3.4, 3.7));
        pose(l.el, { x: l.x, y: l.y + (T ? Math.sin(T * 1.3 + l.i) * 3 : 0), s: 0.6 + k * 0.4, o: k });
      });
      /* v39 — "you have spoken well"; v40 — no more questions */
      const nod = bump(t, 3.2, 3.8);
      const [sx, sy] = oppHead(2);
      popAt(well, t, 3.18, 3.95, sx - 100, sy - 20, { d: 0.1 });
      const back = es(t, 4.3, 4.65);
      qs.forEach((el, i) => {
        const [hx, hy] = oppHead(i);
        const on = es(t, 4.02, 4.1, ease.back);
        const up = es(t, 4.5 + i * 0.07, 4.95 + i * 0.03, ease.in);
        pose(el, { x: hx + back * 20, y: lerp(hy - 44, -700, up), s: Math.max(0.001, on), o: on > 0.01 ? 1 : 0 });
      });
      const look = bump(t, 0.1, 3.0);
      Q.pose(t, T,
        { armF: 16 + look * 40, armB: 8 + bump(t, 2.0, 2.9) * 110, head: -look * 8, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - look * 10, blink: blinkAt(T, d.seed) }),
        (m) => ({ x: m.x + back * 30, head: -look * 10 + (m.i === 2 ? nod * 14 : 0) + back * 12, armF: 8 + (m.i === 2 ? nod * 80 : 0), lean: back * 4, blink: blinkAt(T, m.seed) }));
      Q.amaze(es(t, 2.05, 2.3) * (1 - es(t, 3.2, 3.5) * 0.6));
      void person; void seg;

      S.cam.x = kf(t, [[0, 0], [3.0, 0], [3.3, 30]]);
      S.cam.y = kf(t, [[0, -50], [1.9, -50], [2.2, -30], [3.0, -30], [3.3, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [3.0, 1.02], [3.3, 1.06]]);
    };
  },
};
