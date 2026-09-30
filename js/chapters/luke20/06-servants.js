// Łk 20,11–12 — the same vineyard, heavy with grapes, the tenants among the vines with their full baskets. "He sent yet
// another servant": in the far land the owner points again, and a second servant comes in at the gate with his empty
// basket. "But they beat him too, treated him shamefully, and sent him away empty": a blow, his head-cloth knocked off
// into the dust, the tenants pointing and laughing — and he goes out bare-headed with nothing in his basket. "And he sent
// yet a third; this one also they wounded and threw out": the third comes in; blows; a bandage round his head; two of
// them take him by the arms and throw him out over the gate, where he lands in the road outside.
import { person, blinkAt, pose, lerp } from '../kit.js';
import { vineyardSet, vineBack, vineFront, VY, tenant, servant, hoe, basketCut, burst, headBandage, headCloth, moodPuppet, bubble, addToHead, kf, tr, es, ease, bump, seg } from './lib.js';

const G = VY.G;
const STOP = 952;
const TX = [724, 792, 860];

export default {
  id: 'lk20-servants',
  parable: true,
  beats: [
    { v: 11, text: 'Ponownie posłał drugiego sługę.' },
    { v: 11, cont: true, text: 'Lecz i tego obili, znieważyli i odesłali z niczym.' },
    { v: 12 },
  ],
  cam: { x: [-20, 60], y: [0, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = vineyardSet(S);
    vineBack(set);
    const pl = S.layer({ par: 0.5, sh: 5 });
    const ten = [0, 1, 2].map((i) => ({ i, p: moodPuppet(S, pl, c, { ...tenant(i), holdF: i === 1 ? hoe(c) : '' }), seed: c.rr(0, 9) }));
    const baskets = [0, 2].map((i) => ({ i, el: pl.add(`<g>${basketCut(c, { full: true })}</g>`) }));
    const sv2 = moodPuppet(S, pl, c, { ...servant(1) });
    const sv2bare = moodPuppet(S, pl, c, { ...servant(1), hairStyle: 'short' });
    const b2 = pl.add(`<g>${basketCut(c)}</g>`);
    const cloth = pl.add(`<g>${headCloth(c)}</g>`);
    const sv3 = moodPuppet(S, pl, c, { ...servant(2) });
    const b3 = pl.add(`<g>${basketCut(c)}</g>`);
    const sv3w = S.puppet(pl.add(addToHead(person(c, { ...servant(2) }), headBandage(c))));
    const bursts = [0, 1, 2, 3].map(() => pl.add(`<g>${burst(c, 22)}</g>`));
    const laugh = [0, 1].map((i) => pl.add(`<g>${bubble(c, tr('Ha, ha!', 'Ha, ha!'), { size: 17, tail: i ? 1 : -1 })}</g>`));
    const fr = set.front();
    vineFront(fr);

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunX: 710, sunY: 150 });
      pose(set.plateEl, { x: VY.ABROAD[0], y: VY.ABROAD[1], r: T ? Math.sin(T * 0.8) * 1.2 : 0 });
      const send = Math.max(bump(t, 0.05, 0.45), bump(t, 2.0, 2.3));
      set.pOwner.set({ x: 0, y: 0, s: 1, flip: true, armF: 30 + send * 70, head: send * 6, blink: blinkAt(T, 4) });
      set.pSon.set({ x: 0, y: 0, s: 1, o: 0 });

      /* the tenants: step up to strike, laugh, grab and throw */
      const atk2 = bump(t, 0.95, 1.9), atk3 = bump(t, 2.3, 2.95);
      const grab = es(t, 2.5, 2.6) * (1 - es(t, 2.72, 2.8));
      ten.forEach((m) => {
        const x = TX[m.i] + atk2 * [60, 90, 50][m.i] + atk3 * [70, 100, 40][m.i];
        const strike = Math.max(bump(t, 1.05, 1.25), bump(t, 2.3, 2.5)) * (m.i === 1 ? 1 : 0.5);
        const jeer = bump(t, 1.3, 1.95);
        m.p.set({
          x, y: G + (m.i === 1 ? 6 : 0), s: 0.96, flip: false, blink: blinkAt(T, m.seed),
          armF: 20 + strike * 110 + jeer * (m.i === 0 ? 70 : 0) + grab * (m.i < 2 ? 80 : 0), armB: 10 + (m.i !== 1 ? 34 : 0) + jeer * 50 + grab * 40,
          head: jeer * (m.i === 1 ? -12 : 10), lean: -strike * 6 - jeer * 4, walk: undefined,
        });
        m.p.mood({ angry: 1 });
      });
      baskets.forEach((b) => {
        const m = ten[b.i];
        const x = TX[m.i] + atk2 * [60, 90, 50][m.i] + atk3 * [70, 100, 40][m.i];
        pose(b.el, { x: x - 22, y: G - 88, s: 0.9 });
      });

      /* v11a/b — the second servant: in, beaten, mocked, out bare-headed */
      const in2 = es(t, 0.2, 0.6);
      const hit2 = bump(t, 1.05, 1.3);
      const off = seg(t, 1.12, 1.16);
      const out2 = es(t, 1.45, 1.95);
      let x2 = lerp(1440, STOP, in2);
      if (t > 1.45) x2 = lerp(STOP, 1420, out2);
      const face = out2 <= 0;
      const pose2 = { x: x2 + hit2 * 12, y: G + 2, s: 1, flip: face, walk: (in2 > 0 && in2 < 1) || (out2 > 0 && out2 < 1) ? x2 * 0.06 : undefined, armF: 20 + es(t, 0.6, 0.72) * (1 - es(t, 1.0, 1.1)) * 60 + (out2 > 0 ? 60 : 0), armB: 10 + hit2 * 70, head: hit2 * 12 + (out2 > 0 ? 12 : 0), lean: -hit2 * 10 + out2 * 6, blink: blinkAt(T, 3) };
      const vis2 = (in2 > 0 ? 1 : 0) * (1 - seg(t, 1.94, 1.98));
      sv2.set({ ...pose2, o: vis2 * (1 - off) });
      sv2bare.set({ ...pose2, o: vis2 * off });
      sv2.mood({ sad: es(t, 1.0, 1.1) }); sv2bare.mood({ sad: 1 });
      const hold2 = es(t, 0.6, 0.72) * (1 - es(t, 1.0, 1.1));
      pose(b2, { x: x2 + hit2 * 12 + (face ? -1 : 1) * (hold2 * 44 + (out2 > 0 ? 40 : 18)), y: G - 94 - hold2 * 30 - (out2 > 0 ? 30 : 0), r: out2 > 0 ? 180 : 0, s: 0.95, o: vis2 });
      const ck = es(t, 1.14, 1.4, ease.in);
      pose(cloth, { x: STOP + 10 + ck * 50, y: lerp(G - 172, G - 6, ck) - Math.sin(ck * Math.PI) * 60, r: ck * 200, o: t > 1.13 && t < 2.05 ? 1 : 0 });
      laugh.forEach((b, i) => {
        const k = es(t, 1.3 + i * 0.1, 1.42 + i * 0.1, ease.back) * (1 - es(t, 1.9, 2.0));
        pose(b, { x: TX[i * 2] + 60 + i * 40, y: G - 210 - i * 10, s: k, r: T ? Math.sin(T * 3 + i) * 4 : 0, o: k > 0.02 ? 1 : 0 });
      });

      /* v12 — the third: wounded, thrown out over the gate */
      const in3 = es(t, 2.02, 2.3);
      const hit3 = Math.max(bump(t, 2.3, 2.45), bump(t, 2.4, 2.55));
      const fly = es(t, 2.6, 2.78);
      const land = es(t, 2.78, 2.86);
      let x3 = lerp(1440, STOP, in3), y3 = G + 2, r3 = 0;
      if (t > 2.6) { x3 = lerp(STOP, 1250, fly); y3 = G + 2 - Math.sin(fly * Math.PI) * 190; r3 = fly * 100 - land * 10; }
      const vis3 = in3 > 0 ? 1 : 0;
      const bk = seg(t, 2.47, 2.5);
      const p3 = { x: x3 + hit3 * 10, y: y3 + land * 4, s: 1, flip: true, r: r3, walk: in3 > 0 && in3 < 1 ? x3 * 0.06 : undefined, armF: 20 + es(t, 2.28, 2.36) * 50 + fly * 60, armB: 10 + hit3 * 90 + fly * 80, head: hit3 * 14, lean: -hit3 * 10, blink: blinkAt(T, 5) };
      sv3.set({ ...p3, o: vis3 * (1 - bk) });
      sv3w.set({ ...p3, o: vis3 * bk });
      sv3.mood({ sad: es(t, 2.3, 2.4) });
      pose(b3, { x: t > 2.6 ? lerp(STOP - 30, 1180, fly) : x3 - 30, y: t > 2.6 ? lerp(G - 100, G - 20, fly) - Math.sin(fly * Math.PI) * 120 : G - 100, r: fly * 260, s: 0.95, o: vis3 });
      const bursts3 = [[1.05, 1.28, STOP - 10, G - 150], [1.12, 1.34, STOP + 18, G - 120], [2.3, 2.46, STOP - 6, G - 146], [2.38, 2.54, STOP + 20, G - 118]];
      bursts.forEach((b, i) => {
        const [a, z, x, y] = bursts3[i];
        const k = bump(t, a, z);
        pose(b, { x, y, s: 0.4 + k * 0.8, r: k * 40, o: k > 0.02 ? k : 0 });
      });

      S.cam.z = 1.12;
      S.cam.y = 40;
      S.cam.x = kf(t, [[0, 10], [2.5, 20], [2.8, 50]]);
    };
  },
};
