// J 9,1–2 — the curtains open on a street under the great Temple wall. By the double gate, at the foot of the
// steps, a man blind from birth sits on his spread cloak with a bowl, face lifted to the sounds. People go past
// him and up into the gate without a glance; Jesus, passing by, stops and sees him — a tag comes down: "blind
// from birth". The disciples ask: who sinned? Two plates come down — the man himself, his old parents — each with
// a dark scrap of "sin?" hanging beneath, and the disciples point from one to the other.
import { C, person, CAST, blinkAt, lerp, curtains } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  gateSet, beggarPlace, G, DAY, BLIND, FATHER, MOTHER, DISC, manPuppet, neighbour, nameTag, hungPlate, iconWord, medallion, question, darkScrap,
  hanging, drop, kf, moving, headAt, vis, tr, pose, PI,
} from './lib.js';

export default {
  id: 'j9-passing',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Uczniowie Jego zadali Mu pytanie:' },
    { v: 2, cont: true, text: '«Rabbi, kto zgrzeszył, że się urodził niewidomym - on czy jego rodzice?»' },
  ],
  cam: { x: [-40, 120], y: [-70, 30], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = gateSet(S, { skyCols: DAY });

    /* passers-by going up into the gate (they never look) */
    const backL = S.layer({ par: 0.46, sh: 4 });
    const pass = [0, 1, 2].map((i) => ({ i, p: S.puppet(backL.add(person(c, neighbour(c, i + 3)))), seed: c.rr(0, 9) }));

    /* the beggar's place */
    const act = S.layer({ par: 0.52, sh: 5 });
    const warm = act.add(`<g opacity="0"><circle r="110" fill="url(#warm-glow)"/></g>`);
    beggarPlace(S, act);
    const man = manPuppet(S, act, BLIND, { pose: 'sit' });

    /* Jesus and the disciples */
    const dis = DISC.slice(0, 3).map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, o))) }));
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));

    /* tags & plates */
    const fx = S.layer({ par: 0.2, sh: 5 });
    const tag = hanging(fx, nameTag(c, tr(['niewidomy', 'od urodzenia'], ['blind', 'from birth']), { size: 18 }), { x: 0, y: 0, len: 900 });
    const pl1 = hanging(fx, hungPlate(c, iconWord(`<g transform="translate(0 -6)">${medallion(c, BLIND, { r: 30 })}</g>`, tr('on?', 'this man?'), { y: 44 }), { r: 64 }), { x: 0, y: 0, len: 900 });
    const pl2 = hanging(fx, hungPlate(c, iconWord(`<g transform="translate(-22 -6)">${medallion(c, FATHER, { r: 22 })}</g><g transform="translate(22 -6)">${medallion(c, MOTHER, { r: 22 })}</g>`, tr('rodzice?', 'his parents?'), { y: 44 }), { r: 64 }), { x: 0, y: 0, len: 900 });
    const scr1 = fx.add(`<g opacity="0"><path d="M0 -60V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${darkScrap(c, 16)}</g>`);
    const scr2 = fx.add(`<g opacity="0"><path d="M0 -60V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${darkScrap(c, 15)}</g>`);
    const fx2 = S.layer({ par: 0.52, sh: 5 });
    const ask = fx2.add(`<g opacity="0">${question(c)}</g>`);
    const bigQ = fx.add(`<g opacity="0" transform="scale(1.8)">${question(c)}</g>`);

    set.front();
    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      set.update(T);

      /* the man, begging: an open hand, face lifted */
      const turnTo = es(t, 1.35, 1.7);
      man.p.set({ x: G.BEGX, y: G.FLOOR + 4, s: 1, flip: true, armF: 34 + Math.sin(T * 0.9) * 2 + turnTo * 14, armB: 10, head: -10 + turnTo * 6, blink: 0 });
      fade(man.sad, 0.35 * (1 - turnTo));

      /* passers-by: along the street and up the steps into the gate */
      pass.forEach((m) => {
        const a = 0.15 + m.i * 0.2;
        const k = seg(t, a, a + 1.05);
        const x = lerp(260, 1170, k);
        const up = seg(x, 1000, 1150);
        const gone = seg(x, 1120, 1170);
        m.p.set({ x, y: G.FLOOR - 2 - up * 86 - m.i * 3, s: 0.92 - up * 0.1, flip: false, walk: k > 0 && k < 1 ? x * 0.07 : undefined, armF: 16, head: 2, blink: blinkAt(T, m.seed), o: (k > 0 ? 1 : 0) * (1 - gone) });
      });

      /* v1 — Jesus passes by, stops, sees him */
      const JK = [[1.0, -120], [1.6, G.JX]];
      const jx = kf(t, JK, ease.out);
      const jw = moving(t, JK, 1);
      const see = es(t, 1.5, 1.75);
      const raise = bump(t, 3.05, 3.95);
      jesus.set({ x: jx, y: G.FLOOR + 8, s: 1.02, walk: jw ? jx * 0.07 : undefined, armF: 16 + see * 26 - raise * 10, armB: 8 + es(t, 2.1, 2.4) * 10, head: see * 8 - es(t, 2.2, 2.5) * 10, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(G.BEGX, G.FLOOR + 4 + 62, 1, true);
      vis(warm, { x: hx, y: hy + 20, s: 0.6 + see * 0.5, o: see * (1 - es(t, 3.0, 3.4)) * 0.45 });

      /* the disciples follow; v2a — they ask; v2b — they point from plate to plate */
      dis.forEach((d) => {
        const keys = [[1.05 + d.i * 0.06, -230 - d.i * 70], [1.66 + d.i * 0.06, 690 - d.i * 64], [2.1, 690 - d.i * 64], [2.5, 704 - d.i * 60]];
        const x = kf(t, keys, ease.out);
        const w = moving(t, keys, 1);
        const pointA = d.i === 0 ? bump(t, 3.1, 3.95) : 0;
        const pointB = d.i === 1 ? bump(t, 3.2, 3.95) : 0;
        const pointC = d.i === 2 ? bump(t, 3.3, 3.95) : 0;
        const ask_ = d.i === 0 ? bump(t, 2.1, 2.95) : 0;
        d.p.set({ x, y: G.FLOOR + 12 - d.i * 6, s: 0.96 - d.i * 0.03, walk: w ? x * 0.07 : undefined, armF: 18 + ask_ * 50, armB: 8 + pointA * 140 + pointB * 160 + pointC * 165, head: -pointA * 12 - pointB * 16 - pointC * 14 + ask_ * -4, blink: blinkAt(T, d.seed) });
      });
      const [ph, pv] = headAt(704, G.FLOOR + 12, 0.96, false);
      const ak = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(ask, { x: ph + 30, y: pv - 44, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* the tag: "blind from birth" */
      const tk = es(t, 1.45, 1.85, ease.out) * (1 - es(t, 2.9, 3.15, ease.in));
      drop(tag, G.BEGX + 10, 360, tk, T, { amp: 1.2 });

      /* v2b — the two plates, each with a dark scrap, and a question between */
      const p1 = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 4.1, 4.4));
      const p2 = es(t, 3.15, 3.5, ease.out) * (1 - es(t, 4.1, 4.4));
      drop(pl1, 960, 250, p1, T, { amp: 1.4, seed: 1 });
      drop(pl2, 610, 250, p2, T, { amp: 1.4, seed: 2 });
      const sk = es(t, 3.35, 3.6, ease.back) * p1;
      vis(scr1, { x: 960, y: 386 + Math.sin(T * 1.3) * 3, s: sk, o: sk > 0.01 ? 1 : 0 });
      vis(scr2, { x: 610, y: 386 + Math.sin(T * 1.3 + 1) * 3, s: sk, o: sk > 0.01 ? 1 : 0 });
      const qk = es(t, 3.45, 3.7, ease.back) * p1;
      vis(bigQ, { x: 800, y: 250 + Math.sin(T * 1.1) * 4, s: qk * 1.6, o: qk > 0.01 ? 1 : 0 });

      /* camera */
      S.cam.x = kf(t, [[0, 60], [1.0, 20], [1.6, 60], [2.2, 20], [3.0, 30], [4, 30]]);
      S.cam.y = kf(t, [[0, 10], [1.6, 10], [2.2, 20], [3.0, -50], [4, -50]]);
      S.cam.z = kf(t, [[0, 1.05], [1.0, 1.02], [1.7, 1.1], [2.3, 1.14], [3.0, 1.03], [4, 1.03]]);
    };
  },
};
