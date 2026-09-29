// Mt 14,32–33 — Jesus and Peter climb into the boat, and the wind drops: the streaks blow away, the clouds lift,
// the waves lie down and the first light of dawn comes up over the lake. Those in the boat kneel before Him:
// "Truly you are the Son of God."
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { boat, rays } from '../../assets/things.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, hungGold, nightLake, spark, TW, tr, PI } from './lib.js';

const BX = 760, BY = 712;
const JY = 716;

export default {
  id: 'mt14-worship',
  beats: [
    { v: 32 },
    { v: 33 },
  ],
  cam: { x: [-20, 60], y: [-20, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const N = nightLake(S);

    const boatL = S.layer({ par: 0.6, sh: 5 });
    const B = boat(c, { mast: true });
    const glow = boatL.add(`<g>${rays(c, { n: 18, r0: 30, r1: 420, spread: 0.035, color: '#fff3cf' })}<circle r="170" fill="url(#halo-glow)"/></g>`);
    const IN = [{ o: TW.andrew, x: -140 }, { o: TW.john, x: -84 }, { o: TW.peter, x: 116, peter: true }, { o: TW.james, x: 160 }, { o: TW.thomas, x: -30 }];
    const boatG = boatL.add(`<g><g>${B.back}</g>${IN.map((d, i) => `<g data-k="s${i}">${person(c, d.o)}</g><g data-k="k${i}">${person(c, { ...d.o, pose: 'kneel' })}</g>`).join('')}<g data-k="jin">${person(c, { ...CAST.jesus })}</g><g>${B.front}</g></g>`);
    const dis = IN.map((d, i) => ({ ...d, i, st: S.puppet(S.$('s' + i).firstElementChild), kn: S.puppet(S.$('k' + i).firstElementChild), seed: c.rr(0, 6) }));
    const jIn = S.puppet(S.$('jin').firstElementChild);
    // the two still on the water at first
    const jesus = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const peter = S.puppet(boatL.add(person(c, TW.peter)));

    const fx = S.layer({ par: 0.62, sh: 4 });
    const son = fx.add(hungGold(c, tr('Prawdziwie jesteś Synem Bożym', 'You are truly the Son of God!'), { size: 34 }));
    const sparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${spark(c, 10)}</g>`));
    N.front();

    return (t, time) => {
      const T = time;
      const calm = es(t, 0.3, 0.95);
      const dawnK = es(t, 0.4, 1.8);
      const { rock, heave } = N.update(t, T, { wind: 0.6 * (1 - calm), dawnK, moonX: 1130, moonY: 190 });
      pose(boatG, { x: BX, y: BY + heave, s: 1.02, r: rock });

      /* v32 — they get into the boat; the wind ceases */
      const climb = es(t, 0.02, 0.3);
      const inK = es(t, 0.28, 0.33);
      jesus.set({ x: lerp(BX + 300, BX + 250, climb), y: JY - climb * 40, s: 1.0, flip: true, o: 1 - inK, walk: climb > 0 && climb < 1 ? climb * 12 : undefined, armF: 30, blink: blinkAt(T) });
      peter.set({ x: lerp(BX + 220, BX + 118, climb), y: JY + 4 - climb * 30, s: 0.97, flip: true, o: 1 - inK, walk: climb > 0 && climb < 1 ? climb * 12 : undefined, armF: 40, lean: 6, blink: blinkAt(T, 2) });
      jIn.set({ x: 36, y: -10, s: 1.0, flip: false, o: inK, armF: 20 + bump(t, 0.35, 0.95) * 60 + es(t, 1.2, 1.5) * 30, armB: bump(t, 0.35, 0.95) * 130 + es(t, 1.2, 1.5) * 40, blink: blinkAt(T) });

      /* v33 — they worship Him: "Truly you are the Son of God" */
      dis.forEach((d) => {
        const kneel = es(t, 1.05 + d.i * 0.04, 1.11 + d.i * 0.04);
        const vis = d.peter ? inK : 1;
        const faceIn = d.x < 36;
        d.st.set({ x: d.x, y: 4, s: 0.95, flip: !faceIn, o: vis * (1 - kneel), armF: 30 + bump(t, 0.4, 0.95) * 30, armB: bump(t, 0.4, 0.95) * 40, head: -bump(t, 0.4, 0.95) * 6, blink: blinkAt(T, d.seed) });
        d.kn.set({ x: d.x + (faceIn ? -6 : 6), y: 6, s: 0.95, flip: !faceIn, o: vis * kneel, armF: 60 + (d.i % 2) * 20, armB: 120 + (d.i % 2) * 30, head: -8, lean: 10, blink: 0 });
      });
      const sk = es(t, 1.15, 1.45, ease.out);
      pose(son, { x: 800, y: lerp(-500, 230, sk), r: Math.sin(T * 0.8) * 1.2, o: sk > 0.01 ? 1 : 0 });
      const shine = es(t, 1.1, 1.4);
      pose(glow, { x: BX + 36, y: BY - 140, s: 0.4 + shine * 0.8, r: T * 4, o: 0.08 + shine * 0.24 });
      sparks.forEach((sp, i) => {
        const k = es(t, 1.3 + i * 0.06, 1.5 + i * 0.06);
        const a = i * 1.26 + T * 0.4;
        pose(sp, { x: BX + 36 + Math.cos(a) * 150, y: BY - 170 + Math.sin(a) * 60, s: k * 0.8, r: T * 40, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 40], [0.5, 20], [1.2, 0]]);
      S.cam.z = kf(t, [[0, 1.1], [0.6, 1.06], [1.2, 1.1], [1.6, 1.06]]);
      S.cam.y = kf(t, [[0, 40], [1.2, 40], [1.6, 30]]);
    };
  },
};
