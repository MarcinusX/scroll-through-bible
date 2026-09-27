// J 9,35–38 — Act five: evening at the gate. The man sits alone on the pavement where he once begged, cast out.
// Jesus hears of it — John tells Him, a little picture of the barred door between them — and He comes to find
// him. "Do you believe in the Son of Man?" — His voice goes out in the same rings the man once heard in the
// dark. "Who is He, Lord, that I may believe?" — he stands; an empty frame with a question. "You have seen
// Him, and it is He who is speaking with you" — a thread of light runs from his eyes to Jesus. "Lord, I
// believe!" — and he kneels before Him and bows down; light pours down over them both.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  gateSet, G, EVE, SEER, DISC, manPuppet, iconBubble, say, thought, barredDoor, hungGold, qmark, heart, spark, soundRings, glory, rayBurst,
  hanging, drop, kf, moving, headAt, vis, tr, pose, mix, sheet, PI, DY,
} from './lib.js';

const JX = 800, MANX = 930;

export default {
  id: 'j9-believe',
  beats: [
    { v: 35, text: 'Jezus usłyszał, że wyrzucili go precz,' },
    { v: 35, cont: true, text: 'i spotkawszy go rzekł do niego: «Czy ty wierzysz w Syna Człowieczego?»' },
    { v: 36 },
    { v: 37 },
    { v: 38, text: 'On zaś odpowiedział: «Wierzę, Panie!»' },
    { v: 38, cont: true, text: 'i oddał Mu pokłon.' },
  ],
  cam: { x: [-80, 120], y: [-80, 60], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const set = gateSet(S, { skyCols: EVE, sunAt: [1290, 300], sunR: 50 });
    /* the light that pours down at the end (flat) */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const pour = lightL.add(`<g opacity=".45">${glory(c, 400, 24)}</g>`);
    lightL.fade(0);

    const act = S.layer({ par: 0.52, sh: 5 });
    const dis = DISC.slice(0, 3).map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, o))) }));
    const sit = manPuppet(S, act, SEER, { pose: 'sit' });
    const stand = manPuppet(S, act, SEER, {});
    const kneel = manPuppet(S, act, SEER, { pose: 'kneel' });
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));
    const jGlow = act.add(`<g opacity="0"><circle r="90" fill="url(#halo-glow)"/></g>`);

    const fx = S.layer({ par: 0.54, sh: 5 });
    const whisper = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(0 30) scale(.6)">${barredDoor(c, { w: 56, h: 84 })}</g><g transform="translate(26 26) scale(.3)">${person(c, { ...SEER })}</g>`, { w: 110, h: 90, side: 1 })}</g>`);
    const rings = soundRings(fx, c, { n: 3, r: 16, w: 2.8, col: mix(C.halo, C.ochre, 0.3) });
    const who = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-16 0)"><path d="${c.cut(c.circ(0, 0, 22, 20), 0.3, 3)}" fill="none" stroke="${C.wood3}" stroke-width="4"/><path d="${c.cut(c.circ(0, 0, 18, 18), 0.3, 3)}" fill="${C.parchment}"/></g><g transform="translate(28 2)">${qmark(c, C.terracotta, 1.3)}</g>`, { w: 116, h: 76, side: -1 })}</g>`);
    const believe = fx.add(`<g opacity="0">${say(c, tr('Wierzę, Panie!', 'Lord, I believe!'), { size: 22, side: -1 })}</g>`);
    const hrt = fx.add(`<g opacity="0">${heart(c, 13)}</g>`);
    const thread = Array.from({ length: 9 }, (_, i) => ({ i, el: fx.add(`<g opacity="0"><circle r="3.4" fill="${C.halo}"/><circle r="9" fill="url(#halo-glow)"/></g>`) }));
    const eyeSp = fx.add(`<g opacity="0">${spark(c, 10)}</g>`);
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const son = hanging(hangL, hungGold(c, tr('Syn Człowieczy', 'the Son of God'), { size: 28 }), { x: 0, y: 0, len: 900 });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(T, { sunY: 300 + es(t, 0, 6) * 60 });

      /* v35a — John tells Him; He turns to go */
      const JK = [[0, 470], [0.75, 470], [1.45, JX]];
      const jx = kf(t, JK, ease.io);
      const jw = moving(t, JK, 1);
      const ask = bump(t, 1.4, 1.98), speak37 = bump(t, 3.05, 3.95), bless = es(t, 5.15, 5.5);
      jesus.set({ x: jx, y: G.FLOOR + 8, s: 1.02, flip: t < 0.55, walk: jw ? jx * 0.07 : undefined, armF: 16 + ask * 50 + speak37 * 40 + bless * 50, armB: 10 + speak37 * 20 + bless * 20, head: -bless * 4 + (t < 0.55 ? 6 : 0), blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(jx, G.FLOOR + 8, 1.02, false);
      rings(jhx + 18, jhy + 6, Math.max(ask, speak37), T, { speed: 0.7, spread: 2.4 });
      vis(jGlow, { x: jhx, y: jhy, s: 1 + speak37 * 0.4 + bless * 0.6, o: Math.max(speak37, bless) * 0.9 });
      dis.forEach((d) => {
        const x = 380 - d.i * 64 + (d.i === 0 ? 0 : 0);
        const tell = d.i === 1 ? bump(t, 0.05, 0.75) : 0;
        d.p.set({ x: d.i === 1 ? 410 : x, y: G.FLOOR + 12 - d.i * 6, s: 0.96 - d.i * 0.03, armF: 18 + tell * 50, head: -tell * 4 + bless * 10, lean: bless * 4, blink: blinkAt(T, d.seed) });
      });
      const [dhx, dhy] = headAt(410, G.FLOOR + 6, 0.93, false);
      const wk = es(t, 0.12, 0.32, ease.back) * (1 - es(t, 0.85, 0.95));
      vis(whisper, { x: dhx + 16, y: dhy - 26, s: wk, o: wk > 0.01 ? 1 : 0 });

      /* the man: sitting, head bowed (cast out) → looks up → stands (v36) → kneels and bows (v38b) */
      const up = es(t, 2.05, 2.12);
      const down = es(t, 5.08, 5.16);
      const lookUp = es(t, 1.3, 1.6);
      sit.p.set({ x: MANX + 30, y: G.FLOOR + 4, s: 1, flip: true, o: 1 - up, armF: 30, armB: 10, head: 14 - lookUp * 20, blink: blinkAt(T, 3) });
      fade(sit.sad, 0.8 * (1 - lookUp));
      const sx = lerp(MANX + 20, MANX, es(t, 2.1, 2.5));
      const who_ = bump(t, 2.1, 2.95);
      stand.p.set({ x: sx, y: G.FLOOR + 8, s: 1.02, flip: true, o: up * (1 - down), armF: 20 + who_ * 50 + bump(t, 4.05, 4.95) * 40, armB: 12 + who_ * 40 + bump(t, 4.05, 4.95) * 60, head: (who_ > 0.3 && t < 2.6 ? Math.sin(T * 3) * 8 : 0) - bump(t, 3.2, 3.95) * 4, blink: blinkAt(T, 3) });
      kneel.p.set({ x: MANX - 16, y: G.FLOOR + 8, s: 1.02, flip: true, o: down, armF: 60 + es(t, 5.2, 5.5) * 20, armB: 40, head: 16 * es(t, 5.2, 5.5), lean: es(t, 5.2, 5.6) * 16, blink: 0 });

      /* v35b — the Son of Man */
      drop(son, 860, 250, es(t, 1.45, 1.8, ease.out) * (1 - es(t, 2.05, 2.3, ease.in)), T, { amp: 1 });
      /* v36 — who is He? */
      const [mhx, mhy] = headAt(MANX, G.FLOOR + 8, 1.02, true);
      const k2 = es(t, 2.15, 2.35, ease.back) * (1 - es(t, 2.92, 3.0));
      vis(who, { x: mhx - 14, y: mhy - 26, s: k2, o: k2 > 0.01 ? 1 : 0 });
      /* v37 — the thread of light from his eyes to Him */
      const th = es(t, 3.15, 3.5) * (1 - es(t, 3.95, 4.1));
      const ex = mhx - 10, ey = mhy - 3;
      thread.forEach((p) => {
        const u = (p.i + 0.5) / thread.length;
        const k = th > 0 ? seg(th * 1.2 - u * 0.2, 0, 1) : 0;
        vis(p.el, { x: lerp(ex, jhx + 12, u), y: lerp(ey, jhy - 2, u) - Math.sin(u * PI) * 16, s: 0.7 + Math.sin(T * 4 + p.i) * 0.2, o: k });
      });
      vis(eyeSp, { x: ex, y: ey, s: bump(t, 3.1, 3.6), r: T * 40, o: t > 3.1 && t < 3.6 ? 1 : 0 });
      /* v38a — I believe */
      const k4 = es(t, 4.12, 4.32, ease.back) * (1 - es(t, 4.92, 5.0));
      vis(believe, { x: mhx - 16, y: mhy - 28, s: k4, o: k4 > 0.01 ? 1 : 0 });
      vis(hrt, { x: mhx + 4, y: mhy + 56, s: k4, o: k4 > 0.01 ? 1 : 0 });
      /* v38b — worship; light pours down */
      lightL.fade(es(t, 5.15, 5.6));
      pose(pour, { x: (JX + MANX) / 2 - 20, y: 60, s: 0.9 + es(t, 5.15, 5.9) * 0.2 });

      S.cam.x = kf(t, [[0, -60], [0.8, -60], [1.5, 40], [2, 60], [2.2, 80], [3, 70], [4, 70], [5, 60], [6, 50]]);
      S.cam.y = kf(t, [[0, 20], [1.4, 10], [1.6, -40], [2.1, 20], [4, 40], [5, 40], [5.2, 0], [6, -10]]);
      S.cam.z = kf(t, [[0, 1.06], [1.4, 1.08], [2.2, 1.18], [4, 1.26], [5, 1.24], [5.3, 1.08], [6, 1.06]]);
    };
  },
};
