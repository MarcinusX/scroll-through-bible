// Łk 8,8b–10 — back on the plain. Jesus lifts both arms and calls out, "He who has ears to hear, let him hear!",
// and over every knot of people a little paper ear pops open. The Twelve come up the rise to ask what the parable
// means. "To you it has been given to know the mysteries of the kingdom of God": a small casket with a crown opens
// in His hands and its light falls on them. "But to the rest in parables": a gauze veil painted with the sower comes
// down before the crowd — they look and do not see, they hear and do not understand.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  plainSet, plainCrowd, RISE, earTag, eyeIcon, casket, gauze, sowerPlate, discPlate, bubble, voiceRings, headAt, hand, hangAt, question, sparkle, tr, PI,
} from './lib.js';

const JX = 800;
const DIS = [['peter', 900], ['john', 960], ['andrew', 1020], ['james', 1080]];

export default {
  id: 'lk8-ears',
  beats: [
    { v: 8, cont: true, text: 'Przy tych słowach wołał: «Kto ma uszy do słuchania, niechaj słucha!»' },
    { v: 9 },
    { v: 10, text: 'On rzekł: «Wam dano poznać tajemnice królestwa Bożego,' },
    { v: 10, cont: true, text: 'innym zaś w przypowieściach, aby patrząc nie widzieli i słuchając nie rozumieli.' },
  ],
  cam: { x: [-40, 80], y: [-40, 60], z: [0.98, 1.2] },
  build(S) {
    const P = plainSet(S, { sky2: ['#b9a8c2', '#eec2a2', '#f6dcb6'] });
    const c = P.c;
    const crowd = plainCrowd(P.crowdL);
    const ears = crowd.map((g) => ({ g, el: P.fx.add(`<g opacity="0">${earTag(c, 20)}</g>`) }));

    /* the veil comes down in front of the crowd, painted with the sower */
    const veilL = P.crowdL;
    const veils = [[470, 520], [1130, 520]].map(([x, w], i) => ({ i, x, el: veilL.add(`<g transform="translate(0 -1500)">${gauze(c, w, 250, C.lavender, 0.62)}<g transform="translate(${S.portrait ? (i ? -120 : 110) : 0} 120) scale(.85)">${discPlate(c, sowerPlate(c), { r: 62 })}</g></g>`) }));
    const blind = [[330, 400], [470, 380], [600, 400], [1000, 400], [1130, 380], [1260, 400]].map(([x, y], i) => ({ i, x, y, eye: veilL.add(`<g opacity="0">${eyeIcon(c, true, 18)}</g>`), q: veilL.add(`<g opacity="0">${question(c)}</g>`) }));

    /* Jesus, the disciples, the casket */
    const L = P.act;
    const dis = DIS.map(([k, x], i) => ({ i, x, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...CAST[k] }))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(L, c, { n: 4, color: C.sun, r: 44, w: 6 });
    const box = L.add(`<g opacity="0">${casket(c)}</g>`);
    const lid = box.querySelector('.lid'), boxGlow = box.querySelector('.glow'), boxRays = box.querySelector('.rays');
    const dl = P.crowdL.add(`<g opacity="0"><ellipse cx="990" cy="${RISE - 90}" rx="190" ry="140" fill="url(#warm-glow)"/></g>`);
    const shout = P.fx.add(`<g opacity="0">${bubble(c, [tr('Kto ma uszy do słuchania,', 'He who has ears to hear,'), tr('niechaj słucha!', 'let him hear!')], { size: 21, dir: -1 })}</g>`);
    const ask = P.fx.add(`<g opacity="0">${bubble(c, [tr('Co oznacza', 'What does'), tr('ta przypowieść?', 'this parable mean?')], { size: 19, dir: 1 })}</g>`);
    const plate = P.hangL.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-72" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${discPlate(c, sowerPlate(c), { r: 62 })}</g>`);
    const sparks = [0, 1, 2, 3, 4].map(() => P.fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      P.update(T);
      P.sk2.layer.fade(es(t, 1.2, 3.6) * 0.8);
      crowd.forEach((g) => g.sp.set({ x: g.x, y: g.y }));

      /* v8b — He cries out; ears open over the crowd */
      const call = es(t, 0.02, 0.2) * (1 - es(t, 0.9, 1.1));
      const casketHold = es(t, 2.05, 2.3) * (1 - es(t, 3.05, 3.3));
      const toCrowd = es(t, 3.1, 3.3);
      jesus.set({ x: JX, y: RISE, s: 1.04, flip: t < 1.1 ? false : toCrowd > 0.5, armF: 20 + call * 110 + casketHold * 26 + toCrowd * 70 + bump(t, 1.4, 2.0) * 20, armB: 10 + call * 140 + toCrowd * 40, head: -call * 8 + casketHold * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, RISE, 1.04, false);
      voice(hx, hy, call, T, { spread: 3.6 });
      const sb = es(t, 0.08, 0.25, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(shout, { x: hx - 40, y: hy - 40, s: sb, o: sb > 0.02 ? 1 : 0 });
      ears.forEach((e) => {
        const d = Math.abs(e.g.x - JX) / 700 * 0.4;
        const k = es(t, 0.3 + d, 0.45 + d, ease.back) * (1 - es(t, 1.2, 1.4));
        pose(e.el, { x: e.g.x, y: e.g.y - 190 * e.g.s - 30, s: k * (0.6 + e.g.s * 0.5), o: k > 0.02 ? 1 : 0 });
      });

      /* v9 — the disciples come up and ask */
      dis.forEach((d) => {
        const k = es(t, 1.05 + d.i * 0.06, 1.5 + d.i * 0.06);
        const x = lerp(d.x + 360, d.x, k);
        const bow = casketHold;
        d.p.set({ x, y: RISE + 12 + (d.i % 2) * 6, s: 0.96, flip: true, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 14 + (d.i === 0 ? bump(t, 1.4, 2.0) * 70 : 0) + bow * 30, armB: 8, head: bow * 8 - 2, lean: bow * 5, blink: blinkAt(T, d.seed) });
      });
      const ab = es(t, 1.45, 1.6, ease.back) * (1 - es(t, 1.95, 2.05));
      const [px, py] = headAt(DIS[0][1], RISE + 12, 0.96, true);
      pose(ask, { x: px + 20, y: py - 34, s: ab, o: ab > 0.02 ? 1 : 0 });
      const pk = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 2.0, 2.2));
      hangAt(plate, S.portrait ? 950 : 1000, lerp(-1500, S.portrait ? 270 : 300, pk), T, 1.2, 0.7);

      /* v10a — the mysteries of the kingdom, given to you */
      const [bx, by] = hand(JX, RISE, 1.04, false, 20 + casketHold * 26);
      const bo = es(t, 2.05, 2.2) * (1 - es(t, 3.1, 3.3));
      pose(box, { x: bx + 28, y: by + 10, s: 0.9, o: bo });
      const open = es(t, 2.25, 2.5);
      pose(lid, { x: -37, y: -38, r: -open * 110 });
      fade(boxGlow, 0);
      fade(boxRays, open * 0.8);
      pose(boxRays, { x: 0, y: -40, r: T * 6, s: 0.35 + open * 0.2 });
      fade(dl, open * (1 - es(t, 3.3, 3.6) * 0.5));
      sparks.forEach((sp, i) => { const k = bump(t, 2.35 + i * 0.05, 2.9 + i * 0.03); pose(sp, { x: 900 + i * 45, y: 430 - (i % 2) * 30, s: k, r: T * 50, o: k }); });

      /* v10b — to the rest in parables: seeing they do not see */
      veils.forEach((v) => {
        const k = es(t, 3.1 + v.i * 0.08, 3.45 + v.i * 0.08, ease.out);
        hangAt(v.el, v.x, lerp(-1500, 420, k), T, 0.8, 0.6, v.i);
      });
      blind.forEach((b) => {
        const k = es(t, 3.4 + b.i * 0.04, 3.55 + b.i * 0.04, ease.back);
        pose(b.eye, { x: b.x - 14, y: b.y, s: k, o: k > 0.02 ? 0.95 : 0 });
        pose(b.q, { x: b.x + 20, y: b.y - 10, s: k * 0.8, r: Math.sin(T * 2 + b.i) * 6, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.z = 1.0 + es(t, 1.0, 1.5) * 0.14 - es(t, 3.0, 3.4) * 0.14;
      S.cam.x = es(t, 1.0, 1.5) * 60 - es(t, 3.0, 3.4) * 60;
      S.cam.y = es(t, 1.0, 1.5) * 30 - es(t, 3.0, 3.4) * 30;
    };
  },
};
