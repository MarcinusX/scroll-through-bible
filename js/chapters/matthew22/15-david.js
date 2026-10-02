// Mt 22,41–45 — now Jesus asks the gathered Pharisees: "What do you think of the Christ? Whose son is he?" —
// "David's!" (a roundel with David's crown and harp). A painted panel comes down: King David with his harp, the
// dove of the Spirit over him. A throne of light: "Sit at my right hand" — dark shards, the enemies, fold
// themselves into a footstool. David bows his crowned head to him, "my Lord": how then is he his son?
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, pharisee, moodPuppet, davidPuppet, voiceRings, bubble, dove, harp, throne, footstool, shard, glory, strip, disc, crown, bigQuestion, popBubble, tr, sheet } from './lib.js';

const JX = 720;
const PX0 = 560, PX1 = 1040, PY0 = 150, PY1 = 430;
const GROUND = 414;

export default {
  id: 'mt22-david',
  beats: [
    { v: 41 },
    { v: 42, text: '«Co sądzicie o Mesjaszu? Czyim jest synem?»' },
    { v: 42, cont: true, text: 'Odpowiedzieli Mu: «Dawida».' },
    { v: 43 },
    { v: 44 },
    { v: 45 },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the Pharisees stand closer together, clear of the right edge
    const GX = S.portrait ? [925, 970, 1015, 1060] : [1000, 1060, 1120, 1180];
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 5, x0: 380, x1: 640, pose: 'sit' }, { y: 604, s: 0.66, n: 3, x0: 860, x1: 1000, pose: 'sit' }]);

    /* David's roundel: crown and harp */
    const rL = S.layer({ par: 0.3, sh: 6 });
    const roundel = hanging(rL, `${disc(c, 56, { fill: C.cream, rim: C.sun })}<g transform="translate(6 34) scale(.72)">${harp(c)}</g><g transform="translate(-4 -18)">${crown(c, 44)}</g><g transform="translate(0 76)">${strip(c, tr('syn Dawida', 'son of David'), { size: 16 })}</g>`, { x: 1040, y: -300, len: 500 });

    /* the painted panel */
    const pan = S.layer({ par: 0.3, sh: 6 });
    const ps = sheet();
    ps.p(c.cut([[PX0 - 10, PY0 - 10], [PX1 + 10, PY0 - 12], [PX1 + 12, PY1 + 10], [PX0 - 12, PY1 + 12]], 0.6, 10), C.wood3);
    ps.p(c.cut([[PX0, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.lavender, C.parchment, 0.45));
    ps.p(c.ridge(c.wave(360, [14, 5], [260, 90]), PX0, PX1 - 12, PY1, 10, 1), mix(C.hillMid, C.parchment, 0.35));
    ps.p(c.cut([[PX0, GROUND + 2], [PX1, GROUND - 2], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.sage2, C.sand, 0.4));
    ps.p(c.cut(c.blob(650, GROUND - 6, 40, 16, 10, 0.2), 0.6, 5), C.rock2);
    const panelEl = pan.add(`<g><path d="M${PX0 + 20} -1400V${PY0 - 10}M${PX1 - 20} -1400V${PY0 - 10}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${ps.out()}</g>`);
    const spirit = pan.add(`<g><g transform="translate(0 40)">${glory(c, 110, 14)}</g>${dove(c)}</g>`);
    const david = S.puppet(pan.add(davidPuppet(c, { pose: 'sit', holdF: `<g transform="translate(6 -8) rotate(-20) scale(.9)">${harp(c)}</g>` })));
    const tLight = pan.add(`<g opacity="0">${glory(c, 200, 20)}</g>`);
    const thr = pan.add(`<g>${throne(c)}</g>`);
    const lord = S.puppet(pan.add(person(c, { robe: C.star, mantle: C.halo, skin: mix(C.skin, C.cream, 0.45), hair: mix(C.wheat, C.cream, 0.45), hairStyle: 'long', beard: 'short', beardColor: mix(C.wheat, C.cream, 0.45), halo: true, pose: 'sit' })));
    const stool = pan.add(`<g>${footstool(c, 70)}</g>`);
    const shards = Array.from({ length: 6 }, (_, i) => ({ el: pan.add(`<g>${shard(c, 14 + (i % 3) * 4)}</g>`), i, from: [[PX1 + 60, 200], [PX0 - 60, 260], [PX1 + 80, 380], [620, 120], [1080, 130], [PX0 - 80, 400]][i] }));
    const nameD = pan.add(`<g>${strip(c, tr('Dawid', 'David'), { size: 16 })}</g>`);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const phar = [0, 1, 4, 3].map((k, i) => ({ i, p: moodPuppet(S, pl, c, pharisee(c, k)), seed: c.rr(0, 9) }));
    const dis = [CAST.peter, CAST.john].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 600 - i * 56, i }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const ask = pl.add(`<g>${bubble(c, tr(['Co sądzicie o Mesjaszu?', 'Czyim jest synem?'], ['What do you think of the Christ?', 'Whose son is he?']), { size: 17, tail: 1 })}</g>`);
    const ans = pl.add(`<g>${bubble(c, tr('Dawida!', 'David’s!'), { size: 22, tail: -1 })}</g>`);
    const q = pl.add(`<g>${bigQuestion(c, 30, C.cream)}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v41 — the Pharisees gathered; he turns to them with a question */
      const qk = Math.max(es(t, 0.45, 0.6, ease.back) * (1 - es(t, 0.9, 1.0)), es(t, 5.3, 5.45, ease.back));
      pose(q, { x: JX + 70, y: F - 250, s: qk, r: Math.sin(T * 1.5) * 6, o: qk > 0.02 ? 1 : 0 });
      popBubble(ask, t, 1.1, 1.95, JX + 40, F - 212);
      popBubble(ans, t, 2.12, 2.95, GX[0] - 16, F - 206);
      const rd = es(t, 2.2, 2.55, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      pose(roundel, { x: 1000, y: lerp(-800, 200, rd), r: Math.sin(T * 0.8) * 1.5 });

      /* v43 — the panel: David and the Spirit; v44 — the throne, the footstool; v45 — David bows */
      const pd = es(t, 3.05, 3.45, ease.out);
      const dy = lerp(-900, 0, pd);
      pose(panelEl, { y: dy });
      const sp = es(t, 3.35, 3.7);
      pose(spirit, { x: 660 + Math.sin(T * 0.8) * 6, y: 210 + dy + Math.sin(T * 1.1) * 5, s: 0.7 * sp, o: sp > 0.01 ? 1 - es(t, 4.2, 4.5) * 0.6 : 0 });
      const bow = es(t, 5.05, 5.35);
      david.set({ x: 660, y: GROUND - 2 + dy, s: 0.64, armF: 70, armB: 50 + bow * 60, head: -bump(t, 3.4, 4.0) * 16 + bow * 22, lean: bow * 14, blink: blinkAt(T, 4) });
      pose(nameD, { x: 650, y: GROUND + 4 + dy });
      const tk = es(t, 4.05, 4.35);
      pose(tLight, { x: 910, y: 300 + dy, r: T * 2, o: tk * 0.9 });
      pose(thr, { x: 910, y: GROUND - 6 + dy, s: 0.7 * (0.3 + 0.7 * es(t, 4.05, 4.3, ease.back)), o: tk > 0.01 ? 1 : 0 });
      const sit = es(t, 4.25, 4.45);
      lord.set({ x: 900, y: GROUND - 36 + dy - (1 - sit) * 20, s: 0.6, flip: true, o: sit, armF: 30, blink: blinkAt(T, 6) });
      shards.forEach((s) => {
        const k = es(t, 4.45 + s.i * 0.04, 4.75 + s.i * 0.04, ease.in);
        pose(s.el, { x: lerp(s.from[0], 870 + (s.i - 2.5) * 10, k), y: lerp(s.from[1], GROUND - 12, k) + dy, r: k * 200 + s.i * 30, s: 1 - k * 0.4, o: (k > 0 ? 1 : 0) * (1 - es(t, 4.78, 4.86)) });
      });
      const fs = es(t, 4.78, 4.9, ease.back);
      pose(stool, { x: 866, y: GROUND - 2 + dy, s: fs, o: fs > 0.01 ? 1 : 0 });

      /* Jesus asks; the Pharisees answer, then fall silent */
      const turn = es(t, 0.05, 0.3);
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), armF: 30 + turn * 30 + bump(t, 1.05, 1.95) * 40 + bump(t, 4.1, 4.9) * 60 + bump(t, 5.1, 5.9) * 40, armB: 16 + bump(t, 3.1, 3.9) * 110, head: -bump(t, 3.05, 5.9) * 10 });
      voice(JX + 26, F - 176, 1 - bump(t, 2.0, 3.0), T, { dir: 1 });
      phar.forEach((p) => {
        const k = es(t, 0.02 + p.i * 0.04, 0.3 + p.i * 0.04);
        const x = lerp(GX[p.i] + 200, GX[p.i], k);
        p.p.set({ x, y: F + 2 + (p.i % 2) * 10, s: 0.9, flip: true, walk: k > 0 && k < 1 ? x * 0.05 + p.i : undefined, head: -bump(t, 3.05, 5.9) * 10 + es(t, 5.3, 5.6) * 12, armF: 26 + (p.i === 0 ? bump(t, 2.05, 2.95) * 60 : 0), armB: bump(t, 5.2, 5.9) * (p.i === 1 ? 60 : 0), blink: blinkAt(T, p.seed) });
        p.p.mood({ angry: 0.4 * (1 - es(t, 5.0, 5.4)), sad: es(t, 5.2, 5.5) * 0.7 });
      });
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + d.i * 8, s: 0.9, head: -bump(t, 3.05, 5.9) * 12, blink: blinkAt(T, d.i + 3) }));
      sitters.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, head: -bump(t, 3.05, 5.9) * 14 - 4, blink: blinkAt(T, m.seed) }));

      S.cam.z = 1 + es(t, 3.0, 3.5) * 0.04;
      S.cam.y = -es(t, 3.0, 3.5) * 24;
    };
  },
};
