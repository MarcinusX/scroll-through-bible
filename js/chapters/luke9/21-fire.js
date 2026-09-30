// Łk 9,54–56 — the same road, the Samaritan village shut behind its gate. James and John, back from it, turn to Jesus
// and point: "Lord, do you want us to command fire to come down from the sky and destroy them?" — and over the village
// the thing they are thinking of gathers: a dark cloud with flames licking beneath it (kept small, hanging, not falling).
// "But He turned and rebuked them": Jesus, walking ahead, turns round to them and lifts His hand; the dark cloud
// shrinks away to nothing, the brothers' arms drop and they hang their heads. "And they went to another village": they
// all turn off along a side path, where another village on the hill lights its windows and a figure waves them in.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { town } from '../../assets/nature.js';
import { stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { roadSet, ROAD9, TW9, SAMARITAN, bubble, flame, withFace, faceBits, halo, kf, headAt, tr, PI } from './lib.js';

const { JY } = ROAD9;
const JX = 820;

export default {
  id: 'lk9-fire',
  beats: [
    { v: 54 },
    { v: 55 },
    { v: 56 },
  ],
  cam: { x: [-20, 130], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const R = roadSet(S);
    const c = S.c;
    pose(R.gateL, { x: ROAD9.GATE[0] - 30, y: ROAD9.GATE[1] + 2 });
    pose(R.gateR, { x: ROAD9.GATE[0] + 30, y: ROAD9.GATE[1] + 2 });
    /* another village further on, lighting its windows */
    const v2L = S.layer({ par: 0.2, sh: 3 });
    v2L.el.parentNode.insertBefore(v2L.el, R.mid.el.nextSibling);
    v2L.add(sheet().p(c.ribbon(c.qbez([640, 700], [520, 640], [560, 560], 12), (u) => 30 - u * 22), mix(C.sand, C.cream, 0.35)).out() + town(c, { x: 560, y: 552, n: 5, spread: 150, sc: 0.46 }));
    const lit = v2L.add(`<g opacity="0"><circle cx="560" cy="532" r="90" fill="url(#warm-glow)" opacity=".8"/>${Array.from({ length: 5 }, () => `<rect x="${(c.rr(500, 610)).toFixed(0)}" y="${(c.rr(514, 540)).toFixed(0)}" width="5" height="5" fill="${C.lampGlow}"/>`).join('')}</g>`);
    const waver = S.puppet(v2L.add(person(c, SAMARITAN(1))));

    /* the fire they imagine, over the village */
    const fireL = S.layer({ par: 0.25, sh: 5 });
    const fireCloud = hanging(fireL, `<g>${stormCloud(c, 300, C.storm, C.storm2)}</g>${[-90, -30, 30, 90].map((x, i) => `<g transform="translate(${x} ${20 + (i % 2) * 6}) rotate(180) scale(${1.1 + (i % 2) * 0.3})">${flame(c)}</g>`).join('')}`, { x: 0, y: -1500, len: 1200 });

    /* people */
    const act = S.layer({ par: 0.45, sh: 5 });
    const BRO = [{ k: 'james', x: 680, y: 734 }, { k: 'john', x: 610, y: 750 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(withFace(person(c, TW9[d.k]), faceBits(c)))) }));
    BRO.forEach((d) => { d.sad = d.p.el.querySelector('[data-part="sad"]'); d.angry = d.p.el.querySelector('[data-part="angry"]'); });
    const REST = [{ k: 'peter', x: 540, y: 770 }, { k: 'andrew', x: 470, y: 792 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const jesus = S.puppet(act.add(withFace(person(c, { ...CAST.jesus }), faceBits(c))));
    const jSad = jesus.el.querySelector('[data-part="sad"]');
    const fx = S.layer({ par: 0.45, sh: 4 });
    const ask = fx.add(`<g opacity="0">${bubble(c, [tr('Panie, ogień z nieba?', 'Lord, fire from the sky?')], { size: 19, tail: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, { eveK: 0.35 + es(t, 2.0, 3.0) * 0.3 });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, s: 1.1, o: 0.8 });
      pose(R.rays, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 30, o: 0.6 });

      /* v54 — "fire from heaven?" */
      const want = es(t, 0.1, 0.3) * (1 - es(t, 1.2, 1.5));
      const fk = es(t, 0.3, 0.7) * (1 - es(t, 1.25, 1.7));
      pose(fireCloud, { x: 1120, y: lerp(-1500, 505, es(t, 0.3, 0.7, ease.out)), s: 0.4 + fk * 0.6, r: Math.sin(T * 0.9) * 1.5, oy: 0, o: fk > 0.01 ? Math.min(1, fk * 1.5) : 0 });
      /* v55 — He turns and rebukes them */
      const turn = es(t, 1.05, 1.12);
      const rebuke = bump(t, 1.1, 1.95);
      /* v56 — on to another village */
      const go = es(t, 2.05, 2.95, (u) => u);
      const walking = go > 0 && go < 1;
      const jx = JX - go * 130, jy = JY - go * 10;
      jesus.set({ x: jx, y: jy, s: 1.04 - go * 0.04, flip: turn > 0.5, walk: walking ? t * 16 : undefined, armF: 20 + rebuke * 90, armB: 10 + rebuke * 20, head: -2, blink: blinkAt(T, 1) });
      pose(jSad, { o: rebuke * 0.7 });
      BRO.forEach((d) => {
        const x = d.x - go * 130, y = d.y - go * 10;
        const ashamed = es(t, 1.3, 1.6) * (1 - es(t, 2.1, 2.4));
        d.p.set({ x, y, s: 0.98 - go * 0.04, flip: go > 0, walk: walking ? t * 16 + d.i : undefined, armF: 20 + want * (d.i ? 120 : 90), armB: want * (d.i ? 40 : 150), head: -want * 14 + ashamed * 16, lean: ashamed * 5, blink: blinkAt(T, d.seed) });
        pose(d.angry, { o: want * 0.8 });
        pose(d.sad, { o: ashamed });
      });
      REST.forEach((d) => d.p.set({ x: d.x - go * 130, y: d.y - go * 10, s: 1.0 - go * 0.04, flip: go > 0, walk: walking ? t * 16 + d.i + 2 : undefined, armF: 20, head: -4, blink: blinkAt(T, d.seed) }));
      const [bhx, bhy] = headAt(BRO[0].x, BRO[0].y, 0.98, false);
      const ak = es(t, 0.12, 0.28, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(ask, { x: bhx + 30, y: bhy - 40, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* another village */
      const lk = es(t, 2.3, 2.7);
      pose(lit, { o: lk });
      waver.set({ x: 620, y: 560, s: 0.32, flip: false, o: lk, armF: 30, armB: 120 + Math.sin(t * 20) * 20 * lk, blink: 0 });

      S.cam.x = kf(t, [[0, 0], [2.0, 0], [2.9, -20]]);
      S.cam.z = kf(t, [[0, 1.06], [2.0, 1.06], [2.9, 1.1]]);
      S.cam.y = kf(t, [[0, 20], [2.9, 10]]);
    };
  },
};
