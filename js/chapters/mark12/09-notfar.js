// Mk 12,32–34 — the scribe agrees: "He is One." To love like this is more than every burnt offering:
// the altar's smoke thins away while a heart grows bright. "You are not far from the Kingdom of God" —
// a golden gate stands open, only a few steps from him. And the questions stop: the "?" tags that hung over
// the questioners are drawn up into the flies, one by one.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, scribe, pharisee, sadducee, herodian, voiceRings, bubble, altar, puff, glowHeart, kingdomGate, gateDoor, question, sparkle, disc, strip } from './lib.js';

const JX = 700;

export default {
  id: 'm12-notfar',
  beats: [
    { v: 32 },
    { v: 33 },
    { v: 34, text: 'Jezus widząc, że rozumnie odpowiedział, rzekł do niego: «Niedaleko jesteś od królestwa Bożego».' },
    { v: 34, cont: true, text: 'I nikt już nie odważył się więcej Go pytać.' },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    // phone: the gate stands inside the screen (the scribe a few steps short of it), the altar in from the edge,
    // and the questioners' "?" tags hang in the sky where they can be seen going up
    const SCX = P ? 870 : 930, GX = P ? 1040 : 1110, AX = P ? 515 : 440, WALK = P ? 60 : 70;
    const QTAG = [[520, 120], [1000, 150], [1080, 110], [600, 160]];
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 4, x0: 520, x1: 700, pose: 'sit' }]);

    /* the altar of burnt offering, left, with its smoke */
    const altL = S.layer({ par: 0.47, sh: 5 });
    const alt = altL.add(`<g transform="translate(${AX} ${F - 8})">${altar(c, 150, 86)}</g>`);
    const fire = altL.add(`<g><path d="M-30 0C-36 -14 -24 -30 -18 -46C-12 -30 -6 -20 0 -34C6 -20 16 -30 18 -48C26 -30 36 -14 30 0Z" fill="${C.lampFlame}"/><path d="M-14 0C-18 -10 -10 -18 -6 -28C0 -18 6 -12 10 -24C16 -12 18 -6 14 0Z" fill="#fff4d2"/></g>`);
    const puffs = Array.from({ length: 7 }, (_, i) => ({ el: altL.add(`<g>${puff(c, 26 + i * 2)}</g>`), i }));
    const heartEl = altL.add(`<g>${glowHeart(c, 30)}</g>`);

    /* the questioners at the edges, each with a "?" hanging over them */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const Q = [
      { o: pharisee(c, 2), x: 300 }, { o: sadducee(1), x: 1236 }, { o: herodian(c, 1), x: 1306 }, { o: pharisee(c, 3), x: 236 },
    ].map((q, i) => ({ ...q, i, p: S.puppet(pl.add(person(c, q.o))), seed: c.rr(0, 9) }));
    const qTags = Q.map((q) => hanging(pl, question(c), { x: q.x, y: 0, len: 600 }));

    /* the Kingdom gate */
    const gateL = S.layer({ par: 0.5, sh: 6 });
    const kg = kingdomGate(c, 130, 230);
    const gLight = gateL.add(`<g><circle cy="-110" r="170" fill="url(#halo-glow)"/>${kg.light}</g>`);
    const doorL = gateL.add(`<g>${gateDoor(c, 65, 180)}</g>`);
    const doorR = gateL.add(`<g transform="scale(-1 1)">${gateDoor(c, 65, 180)}</g>`);
    const gFrame = gateL.add(`<g>${kg.frame}</g>`);
    const sparks = [0, 1, 2, 3].map(() => gateL.add(`<g>${sparkle(c, 9)}</g>`));

    const pp = S.layer({ par: 0.52, sh: 5 });
    const dis = [CAST.peter, CAST.john].map((o, i) => ({ p: S.puppet(pp.add(person(c, o))), x: 640 - i * 50, i }));
    const jesus = S.puppet(pp.add(person(c, { ...CAST.jesus })));
    const sc = S.puppet(pp.add(person(c, scribe(c, 0))));
    const voice = voiceRings(pp, c, { n: 3, r: 26, w: 4 });
    const agree = pp.add(`<g>${bubble(c, tr(['Bardzo dobrze,', 'Nauczycielu! On jest Jeden'], ['Truly, teacher —', 'he is one']), { size: 18, tail: -1 })}</g>`);
    const more = pp.add(`<g>${bubble(c, tr(['…więcej niż', 'wszystkie ofiary'], ['…more than all', 'the sacrifices']), { size: 18, tail: -1 })}</g>`);
    const near = pp.add(`<g>${bubble(c, tr(['Niedaleko jesteś', 'od królestwa Bożego'], ['You are not far', 'from God’s Kingdom']), { size: 18, tail: 1 })}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v32 — the scribe agrees */
      const bub = (el, a, b, x, y) => { const k = es(t, a, a + 0.15, ease.back) * (1 - es(t, b - 0.1, b)); pose(el, { x, y, s: k, o: k > 0.02 ? 1 : 0 }); };
      bub(agree, 0.1, 0.95, SCX - 20, F - 210);
      bub(more, 1.5, 1.95, SCX - 20, F - 210);
      bub(near, 2.2, 2.95, JX + 40, F - 212);
      const walkG = es(t, 2.55, 2.95);
      const scx = lerp(SCX, SCX + WALK, walkG);
      sc.set({ x: scx, y: F + 6, s: 0.95, flip: t < 2.5, walk: walkG > 0 && walkG < 1 ? scx * 0.05 : undefined, blink: blinkAt(T, 3), head: bump(t, 0.1, 0.9) * 14 - bump(t, 1.0, 1.9) * 8 + bump(t, 2.3, 3.5) * -6, armF: 26 + bump(t, 0.2, 0.9) * 40 + bump(t, 1.1, 1.9) * 30, armB: bump(t, 1.1, 1.9) * 70 });

      /* v33 — the smoke thins, the heart grows */
      const thin = es(t, 1.1, 1.8);
      puffs.forEach((p) => {
        const k = ((T * 0.18 + p.i / 7) % 1);
        pose(p.el, { x: AX + Math.sin(k * 5 + p.i) * 12, y: F - 110 - k * 330, s: 0.5 + k * 0.9, o: (1 - k) * 0.8 * (1 - thin) });
      });
      pose(fire, { x: AX, y: F - 100, sy: (1 - thin * 0.85) * (1 + Math.sin(T * 9) * 0.05), sx: 1 - thin * 0.5 });
      const hk = es(t, 1.15, 1.6, ease.back) * (1 - es(t, 2.2, 2.5));
      pose(heartEl, { x: lerp(SCX - 110, 820, 0.5), y: F - 290 - hk * 20, s: 0.4 + hk * 0.9, o: hk > 0.02 ? 1 : 0 });
      fade(alt, 1 - thin * 0.35);

      /* v34a — the gate of the Kingdom, just a few steps away */
      const gk = es(t, 2.1, 2.4, ease.back);
      const open = es(t, 2.35, 2.7);
      pose(gFrame, { x: GX, y: F + 10, s: gk, o: gk > 0.01 ? 1 : 0 });
      pose(gLight, { x: GX, y: F + 10, s: gk, o: gk > 0.01 ? 0.3 + open * 0.7 : 0 });
      pose(doorL, { x: GX - 65, y: F + 10, sx: Math.max(0.05, 1 - open * 0.75) * gk, sy: gk, o: gk > 0.01 ? 1 : 0 });
      pose(doorR, { x: GX + 65, y: F + 10, sx: -Math.max(0.05, 1 - open * 0.75) * gk, sy: gk, o: gk > 0.01 ? 1 : 0 });
      sparks.forEach((el, i) => { const k = ((T * 0.4 + i / 4) % 1); pose(el, { x: GX - 40 + i * 26, y: F - 60 - k * 140, s: 0.6 + (1 - k) * 0.4, o: open * Math.sin(k * Math.PI) }); });

      /* v34b — nobody dares ask any more */
      Q.forEach((q, i) => {
        const turn = es(t, 3.2 + i * 0.1, 3.4 + i * 0.1);
        q.p.set({ x: q.x, y: F + 8 + (i % 2) * 8, s: 0.9, flip: q.x > 800 ? turn < 0.5 : turn > 0.5, blink: blinkAt(T, q.seed), armF: 30 + (1 - turn) * 20, head: turn * 10 - 4 });
        const up = es(t, 3.1 + i * 0.1, 3.45 + i * 0.1, ease.in);
        pose(qTags[i], { x: P ? QTAG[i][0] : q.x + (q.x > 800 ? -20 : 20), y: lerp(P ? QTAG[i][1] : F - 250, -500, up), r: Math.sin(T + i) * 3 * (1 - up) });
      });

      /* Jesus */
      const speak = bump(t, 2.02, 2.95);
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), armF: 30 + speak * 60, armB: 16 + speak * 30, head: -bump(t, 1.1, 1.9) * 8 });
      voice(JX + 26, F - 176, speak, T, { dir: 1 });
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + (d.i % 2) * 8, s: 0.9, head: -bump(t, 1.1, 2.9) * 10, blink: blinkAt(T, d.i + 3) }));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -3, blink: blinkAt(T, m.seed) }));
    };
  },
};
