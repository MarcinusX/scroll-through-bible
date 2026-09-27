// Mk 12,35–37 — "How can the scribes say the Messiah is the son of David?" A painted panel comes down:
// King David with his harp, the dove of the Spirit over him. A throne of light: "Sit at my right hand" —
// dark shards (the enemies) fold themselves into a footstool. David bows his crowned head to him: "my Lord".
// The great crowd listens gladly.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix, shade } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, scribe, LOOK, davidPuppet, voiceRings, bubble, dove, harp, throne, footstool, shard, glory, sparkle, strip, crown, bigQuestion, sheet } from './lib.js';

const JX = 720;
const PX0 = 560, PX1 = 1040, PY0 = 150, PY1 = 430;
const GROUND = 414;

export default {
  id: 'm12-david',
  beats: [
    { v: 35 },
    { v: 36, text: 'Wszak sam Dawid mówi w Duchu Świętym:' },
    { v: 36, cont: true, text: 'Rzekł Pan do Pana mego: Siądź po prawicy mojej, aż położę nieprzyjaciół Twoich pod stopy Twoje.' },
    { v: 37, text: 'Sam Dawid nazywa Go Panem, skądże więc jest [tylko] jego synem?»' },
    { v: 37, cont: true, text: 'A wielki tłum chętnie Go słuchał.' },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 5, x0: 380, x1: 640, pose: 'sit' }, { y: 604, s: 0.66, n: 4, x0: 960, x1: 1220, pose: 'sit' }]);

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
    const lord = S.puppet(pan.add(person(c, { robe: '#fff6dc', mantle: C.halo, skin: '#fbe9c8', hair: '#f3dca4', hairStyle: 'long', beard: 'short', beardColor: '#f3dca4', halo: true, pose: 'sit' })));
    const stool = pan.add(`<g>${footstool(c, 70)}</g>`);
    const shards = Array.from({ length: 6 }, (_, i) => ({ el: pan.add(`<g>${shard(c, 14 + (i % 3) * 4)}</g>`), i, from: [[PX1 + 60, 200], [PX0 - 60, 260], [PX1 + 80, 380], [620, 120], [1080, 130], [PX0 - 80, 400]][i] }));
    const nameD = pan.add(`<g>${strip(c, tr('Dawid', 'David'), { size: 16 })}</g>`);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const crowdS = crowd(S, pl, [{ y: F + 8, s: 0.86, n: 3, x0: 300, x1: 470 }, { y: F + 12, s: 0.86, n: 3, x0: 1130, x1: 1300 }]);
    const late = crowd(S, pl, [{ y: F + 18, s: 0.88, n: 4, x0: 300, x1: 560 }, { y: F + 20, s: 0.88, n: 4, x0: 1000, x1: 1260 }]);
    late.forEach((m) => { m.from = m.x < 800 ? m.x - 500 : m.x + 500; });
    const scribes = [0, 1].map((i) => ({ i, p: S.puppet(pl.add(person(c, scribe(c, i + 1)))), x: 960 + i * 64, seed: c.rr(0, 9) }));
    const dis = [CAST.peter, CAST.john].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 600 - i * 56, i }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const sonTag = pl.add(`<g>${bubble(c, tr(['Mesjasz', 'jest Synem Dawida'], ['The Christ is', 'the son of David']), { size: 18, tail: -1 })}</g>`);
    const q = pl.add(`<g>${bigQuestion(c, 30, C.cream)}</g>`);
    const glad = [0, 1, 2, 3, 4].map(() => pl.add(`<g>${sparkle(c, 10)}</g>`));

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v35 — the scribes' saying, and his question */
      const sk = es(t, 0.15, 0.3, ease.back) * (1 - es(t, 0.8, 0.9));
      pose(sonTag, { x: 940, y: F - 208, s: sk, o: sk > 0.02 ? 1 : 0 });
      const qk = Math.max(es(t, 0.55, 0.7, ease.back) * (1 - es(t, 0.95, 1.05)), es(t, 3.3, 3.45, ease.back) * (1 - es(t, 3.85, 3.95)));
      pose(q, { x: JX + 60, y: F - 250, s: qk, r: Math.sin(T * 1.5) * 6, o: qk > 0.02 ? 1 : 0 });

      /* v36 — the panel: David and the Spirit, the throne, the footstool */
      const pd = es(t, 1.05, 1.45, ease.out) * (1 - es(t, 4.05, 4.4, ease.in));
      const dy = lerp(-900, 0, pd);
      pose(panelEl, { y: dy });
      const sp = es(t, 1.35, 1.7);
      pose(spirit, { x: 660 + Math.sin(T * 0.8) * 6, y: 210 + dy + Math.sin(T * 1.1) * 5, s: 0.7 * sp, o: sp > 0.01 ? 1 - es(t, 2.2, 2.5) * 0.6 : 0 });
      const bow = es(t, 3.05, 3.35);
      david.set({ x: 660, y: GROUND - 2 + dy, s: 0.64, armF: 70 + Math.sin(T * 3) * 4 * (1 - bow), armB: 50 + bow * 60, head: -bump(t, 1.4, 2.0) * 16 + bow * 22, lean: bow * 14, blink: blinkAt(T, 4) });
      pose(nameD, { x: 650, y: GROUND + 4 + dy });
      const tk = es(t, 2.05, 2.35);
      pose(tLight, { x: 910, y: 300 + dy, r: T * 2, o: tk * 0.9 });
      pose(thr, { x: 910, y: GROUND - 6 + dy, s: 0.7 * (0.3 + 0.7 * es(t, 2.05, 2.3, ease.back)), o: tk > 0.01 ? 1 : 0 });
      const sit = es(t, 2.25, 2.45);
      lord.set({ x: 900, y: GROUND - 36 + dy - (1 - sit) * 20, s: 0.6, flip: true, o: sit, armF: 30, blink: blinkAt(T, 6) });
      shards.forEach((s) => {
        const k = es(t, 2.45 + s.i * 0.04, 2.75 + s.i * 0.04, ease.in);
        pose(s.el, { x: lerp(s.from[0], 870 + (s.i - 2.5) * 10, k), y: lerp(s.from[1], GROUND - 12, k) + dy, r: k * 200 + s.i * 30, s: 1 - k * 0.4, o: (k > 0 ? 1 : 0) * (1 - es(t, 2.78, 2.86)) });
      });
      const fs = es(t, 2.78, 2.9, ease.back);
      pose(stool, { x: 866, y: GROUND - 2 + dy, s: fs, o: fs > 0.01 ? 1 : 0 });

      /* Jesus teaching; the crowd grows and listens gladly */
      const speak = 1;
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), armF: 40 + speak * 30 + bump(t, 0.5, 1.0) * 20 + bump(t, 2.1, 2.9) * 60 + bump(t, 3.1, 3.9) * 40, armB: 16 + bump(t, 1.1, 1.9) * 110, head: -bump(t, 1.05, 3.9) * 10 });
      voice(JX + 26, F - 176, 1, T, { dir: 1 });
      scribes.forEach((s) => s.p.set({ x: s.x, y: F + 4 + s.i * 8, s: 0.92, flip: true, head: -bump(t, 1.05, 3.9) * 10 + bump(t, 3.2, 3.9) * 10, armF: 30 + bump(t, 0.1, 0.9) * 40, armB: bump(t, 3.3, 3.9) * 60, blink: blinkAt(T, s.seed) }));
      const gladK = es(t, 4.05, 4.4);
      late.forEach((m) => {
        const k = es(t, 4.02 + m.delay * 0.3, 4.4 + m.delay * 0.3);
        const x = lerp(m.from, m.x, k);
        m.p.set({ x, y: m.y, s: m.s, flip: m.x > 800, walk: k > 0 && k < 1 ? x * 0.05 : undefined, head: -4, armF: gladK * (m.i % 3 === 0 ? 40 : 0), blink: blinkAt(T, m.seed), o: k > 0 ? 1 : 0 });
      });
      [...crowdS, ...sitters].forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -bump(t, 1.05, 3.9) * 14 - 4 + gladK * 4, armF: gladK * (m.i % 2 ? 50 : 0), blink: blinkAt(T, m.seed) }));
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + d.i * 8, s: 0.9, head: -bump(t, 1.05, 3.9) * 12, blink: blinkAt(T, d.i + 3) }));
      glad.forEach((el, i) => {
        const k = ((T * 0.35 + i / 5) % 1);
        pose(el, { x: 380 + i * 200 + Math.sin(k * 6) * 10, y: F - 230 - k * 60, s: 0.7, o: gladK * Math.sin(k * Math.PI) });
      });

      S.cam.z = 1 + es(t, 1.0, 1.5) * 0.04 * (1 - es(t, 4.0, 4.5));
      S.cam.y = -es(t, 1.0, 1.5) * 24 * (1 - es(t, 4.0, 4.5));
    };
  },
};
