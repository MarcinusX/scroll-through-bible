// Łk 6,6–7 — another Sabbath, the synagogue (the same hall as in Mark 1 and Matthew 12). Jesus comes in with Peter and
// John, walks to the middle and teaches; rings of His voice go out and the benches turn to Him. On the front bench a man
// holds his right hand close — withered; a soft light finds him. On the other bench the scribes and Pharisees are
// watching: their eyes narrow, dotted lines of looking run from each of them to Jesus, one writes on his wax tablet,
// and over their heads a thought hangs — the accuser's pointing finger: will He heal on the Sabbath?
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, WITHERED, witheredHand, phOpts, scribeOpts, waxTablet, handAt, headAt, kf, moving, thought, sabbathTag, voiceRings, glow, pointHand, tr, PI } from './lib.js';

const FEET = 742;
const JX = 800;
export const PHX = [1030, 1110, 1190];
export const PHX_P = [1028, 1076, 1124];   // phone: the watchers sit closer, at the near end of their bench

export default {
  id: 'lk6-synagogue',
  beats: [
    { v: 6, text: 'W inny szabat wszedł do synagogi i nauczał.' },
    { v: 6, cont: true, text: 'A był tam człowiek, który miał uschłą prawą rękę.' },
    { v: 7 },
  ],
  cam: { x: [-40, 160], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const X = S.portrait ? PHX_P : PHX;
    const I = synagogueInterior(S);
    const L = S.layer({ par: I.P, sh: 4 });
    const [, FRONT] = I.benchY;
    const folk = I.congregation(L);
    const manGlow = L.add(`<g opacity="0">${glow(120, 0.9)}</g>`);
    const man = S.puppet(L.add(person(c, { ...WITHERED, pose: 'sit', holdF: witheredHand(c) })));
    const handRing = L.add(`<g opacity="0"><circle r="40" fill="url(#warm-glow)"/><path d="${c.ribbon(c.arc(0, 0, 30, 30, 0, PI * 2, 30), 3)}" fill="${C.sun}" opacity=".8"/></g>`);
    const PH = [phOpts(0), { ...scribeOpts(1), holdF: `<g transform="translate(8 -4) rotate(-20)">${waxTablet(c)}</g>` }, phOpts(2)]
      .map((o, i) => ({ o, i, x: X[i], seed: c.rr(0, 9), p: S.puppet(L.add(person(c, { ...o, pose: 'sit' }))) }));

    const act = S.layer({ par: 0.5, sh: 5 });
    const DIS = [{ k: 'peter', x: 400 }, { k: 'john', x: 478 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...CAST[d.k] }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, r: 36 });

    /* the looks of the watchers, the thought over them, the Sabbath tag */
    const fx = S.layer({ par: 0.5, sh: 2, flat: true });
    const looks = PH.map(() => fx.add(`<g opacity="0"><path d="${Array.from({ length: 14 }, (_, k) => c.poly(c.circ(k * 16, 0, 2.2, 6))).join('')}" fill="${C.terracotta}"/></g>`));
    const fx2 = S.layer({ par: 0.3, sh: 6 });
    const accuse = fx2.add(`<g opacity="0">${thought(c, `<g transform="translate(-4 2) scale(.72) rotate(180)">${pointHand(c)}</g>`, { w: 96, h: 64 })}</g>`);
    const tag = hanging(fx2, sabbathTag(c, tr('szabat', 'Sabbath')), { x: 880, y: -300, len: 800 });
    const writing = act.add(`<g opacity="0">${sheet().p(c.ribbon([[0, 0], [14, -3]], 1.4) + c.ribbon([[0, 6], [10, 4]], 1.4), C.ink).out()}</g>`);

    const jK = [[-0.7, 250], [0.55, JX]];
    const dK = [[-0.5, 180], [0.7, 0]];

    return (t, time) => {
      const T = time;
      I.flicker(T);
      const turn = es(t, 0.2, 0.6);
      folk.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, head: turn * (m.flip ? -4 : 4), blink: blinkAt(T, m.seed) }));

      /* v6a — He comes in and teaches */
      const jx = kf(t, jK, (u) => ease.sine(u));
      const toMan = es(t, 1.1, 1.3) * (1 - es(t, 2.05, 2.2));
      const teach = es(t, 0.55, 0.7) * (1 - es(t, 1.05, 1.15));
      jesus.set({ x: jx, y: FEET, s: 1.06, flip: toMan > 0.5, walk: moving(t, jK) ? jx * 0.055 : undefined, armF: 12 + teach * 50 + toMan * 20, armB: 8 + teach * 30, head: -2 + toMan * 6, blink: blinkAt(T, 2) });
      const [jhx, jhy] = headAt(JX, FEET, 1.06, false);
      voice(jhx, jhy, teach, T, { spread: 2.2 });
      const dOff = kf(t, dK);
      DIS.forEach((d) => {
        const x = d.x - dOff * (1 + d.i * 0.2);
        d.p.set({ x, y: FEET + (d.i ? 6 : -2), s: 0.96, flip: false, walk: moving(t, dK) ? x * 0.055 + d.i : undefined, armF: 8, armB: 6, head: -2, blink: blinkAt(T, d.seed) });
      });
      const td = es(t, 0.2, 0.55, ease.back);
      pose(tag, { x: 880, y: lerp(-300, 170, td), r: Math.sin(T * 0.8) * 0.8, oy: 0, o: td > 0.01 ? 1 : 0 });

      /* v6b — the man with the withered right hand */
      const shy = es(t, 1.15, 1.4) * (1 - es(t, 2.3, 2.5) * 0.6);
      man.set({ x: 610, y: FRONT, s: 0.92, flip: false, armF: 26 + shy * 40, head: 6 + shy * 6, lean: shy * 3, blink: blinkAt(T, 5) });
      const [mhx, mhy] = headAt(610, FRONT, 0.92, false, 'sit');
      pose(manGlow, { x: mhx, y: mhy + 60, o: bump(t, 1.05, 2.3) * 0.95 + es(t, 2.3, 2.6) * 0.3 });
      const [mhx2, mhy2] = handAt(610, FRONT, 0.92, false, 26 + shy * 40, 'sit');
      pose(handRing, { x: mhx2, y: mhy2, s: 0.8 + shy * 0.3, o: bump(t, 1.2, 2.2) });

      /* v7 — the scribes and Pharisees watch Him, to accuse Him */
      const watch = es(t, 2.05, 2.3);
      PH.forEach((m) => {
        const narrow = es(t, 2.0 + m.i * 0.05, 2.2 + m.i * 0.05);
        const write = m.i === 1 ? es(t, 2.45, 2.55) : 0;
        m.p.set({ x: m.x, y: FRONT, s: 0.9, flip: true, armF: 10 + write * (50 + Math.sin(t * 40) * 6) + (m.i === 0 ? narrow * 20 : 0), head: -narrow * 3 + write * 8, lean: narrow * 3, blink: Math.max(narrow * 0.55, blinkAt(T, m.seed)) });
        const [ex, ey] = headAt(m.x, FRONT, 0.9, true, 'sit');
        const dx = jhx - ex, dy = jhy + 10 - ey, len = Math.hypot(dx, dy);
        const k = es(t, 2.1 + m.i * 0.08, 2.35 + m.i * 0.08);
        pose(looks[m.i], { x: ex - 16, y: ey - 3, r: (Math.atan2(dy, dx) * 180) / PI, sx: (len / 224) * k, sy: 1, o: k > 0.01 ? 0.75 : 0 });
      });
      const ac = es(t, 2.35, 2.6, ease.back);
      pose(accuse, { x: S.portrait ? 990 : X[1] - 40, y: 500, s: ac * 1.5, o: ac > 0.01 ? 1 : 0 });
      const [whx, why] = handAt(X[1], FRONT, 0.9, true, 60, 'sit');
      pose(writing, { x: whx - 8, y: why - 6, o: es(t, 2.5, 2.6) });

      S.cam.x = kf(t, [[-0.5, -30], [0.6, 0], [1.1, -40], [1.9, -40], [2.2, S.portrait ? 160 : 30]]);   // phone: the camera goes on to the watchers
      S.cam.z = kf(t, [[-0.5, 1.0], [0.6, 1.03], [1.1, 1.14], [1.9, 1.14], [2.2, 1.06]]);
      S.cam.y = kf(t, [[-0.5, 10], [1.1, 40], [1.9, 40], [2.2, 30]]);
    };
  },
};
