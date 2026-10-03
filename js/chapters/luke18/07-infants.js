// Łk 18,15–17 — the wayside under the terebinth. "They were bringing their babies to Him, that He might touch them":
// mothers come down the road with swaddled babies in their arms, a father leading two little ones by the hand.
// "But when the disciples saw it, they rebuked them": the disciples step across the way, hands up — not now!
// "Jesus summoned them, saying": He beckons; the disciples draw back. "Allow the little children to come to me, and
// don't hinder them": the children run to Him, a mother lays her baby in His arms and He kneels among them. "For
// God's Kingdom belongs to such as these": the round golden sign of the Kingdom comes down over the children, and a
// little light rests on every head. "Whoever doesn't receive God's Kingdom like a little child will in no way enter
// into it": a small copy of the sign floats down into the open hands of the littlest girl, held up to take it.
import { C, CAST, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { waySet, WY, PARENTS, child, babyHeld, disciples, kingdomDisc, sparkle, words, onString, headAt, handAt, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const { GY } = WY;
const JX = 740;
const DK = ['peter', 'andrew', 'james', 'john', 'philip'];

export default {
  id: 'lk18-infants',
  beats: [
    { v: 15, text: 'Przynosili Mu również niemowlęta, żeby na nie ręce włożył,' },
    { v: 15, cont: true, text: 'lecz uczniowie, widząc to, szorstko zabraniali im.' },
    { v: 16, text: 'Jezus zaś przywołał je do siebie i rzekł:' },
    { v: 16, cont: true, text: '«Pozwólcie dzieciom przychodzić do Mnie i nie przeszkadzajcie im:' },
    { v: 16, cont: true, text: 'do takich bowiem należy królestwo Boże.' },
    { v: 17 },
  ],
  cam: { x: [-20, 60], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const W = waySet(S, { jesus: false });
    const c = S.c;
    const L = W.crowdL;
    // the disciples: calm, and stepping in the way with their hands up (two sprites of the same group)
    const calm = L.sprite(disciples(c, DK, { s: 0.86, spread: 46, rows: 2, arms: [10, 20, 14] }), 520, GY + 2);
    const stop = L.sprite(disciples(c, DK, { s: 0.86, spread: 46, rows: 2, arms: [100, 120, 90], heads: [8, 4, 10] }), 520, GY + 2);
    const A = W.act;
    const moms = [0, 1, 3].map((k, i) => ({ i, p: S.puppet(A.add(person(c, { ...PARENTS[k], holdF: babyHeld(c, { band: [C.skyVeil, C.roseRobe, C.wheat][i] }) }))), give: S.puppet(A.add(person(c, PARENTS[k]))), seed: c.rr(0, 9) }));
    const dad = S.puppet(A.add(person(c, PARENTS[2])));
    const kids = [0, 1, 2].map((i) => ({ i, p: S.puppet(A.add(person(c, child(c, i + 1)))), seed: c.rr(0, 9) }));
    const J = S.puppet(A.add(person(c, { ...CAST.jesus })));
    const JK = S.puppet(A.add(person(c, { ...CAST.jesus, pose: 'kneel', holdF: babyHeld(c, { band: C.skyVeil }) })));
    const voice = W.voice;
    const fx = W.fx;
    const no = fx.add(`<g opacity="0">${words(c, tr('Nie teraz!', 'Not now!'), { size: 19, side: 1 })}</g>`);
    const come = fx.add(`<g opacity="0">${words(c, tr(['Pozwólcie dzieciom', 'przychodzić do Mnie!'], ['Let the little children', 'come to me!']), { size: 18, side: -1 })}</g>`);
    const K = fx.add(`<g>${onString(kingdomDisc(c, 40), 1600)}</g>`);
    const lights = [0, 1, 2, 3].map((i) => fx.add(`<g opacity="0">${sparkle(c, 10, C.halo)}</g>`));
    const small = fx.add(`<g opacity="0">${kingdomDisc(c, 14)}</g>`);

    // where they end up around Him
    const P = S.portrait;   // phone: the families arrive and gather closer in, inside the screen
    const KID_AT = [[JX - 100, GY + 6], [JX + 96, GY + 8], [JX + 164, GY + 14]];
    const MOM_AT = P ? [[JX + 236, GY - 8], [JX + 290, GY - 2], [JX + 130, GY - 16]] : [[JX + 270, GY - 8], [JX + 350, GY - 2], [JX + 130, GY - 16]];
    const PUSH = P ? 20 : 40, BLOCK = P ? 850 : 930;

    return (t, time) => {
      const T = time;
      W.update(T);

      /* v15a — in they come from the road */
      const inK = es(t, -0.1, 0.8);
      /* v15b — the disciples step across; v16a — they draw back */
      const block = es(t, 1.05, 1.35) * (1 - es(t, 2.2, 2.6));
      const dx = lerp(520, BLOCK, block);
      const angry = es(t, 1.2, 1.3) * (1 - es(t, 2.1, 2.2));
      calm.set({ x: dx, y: GY + 2 - block * 10, o: 1 - angry });
      stop.set({ x: dx, y: GY + 2 - block * 10, o: angry });
      pose(no, { x: dx + 60, y: GY - 230, s: es(t, 1.3, 1.45, ease.back), o: t > 1.3 && t < 2.1 ? 1 - es(t, 2.0, 2.1) : 0 });

      /* the families */
      const run = (i) => es(t, 3.05 + i * 0.08, 3.5 + i * 0.08);
      moms.forEach((m) => {
        const x0 = P ? 950 + m.i * 50 : 1080 + m.i * 90;
        let x = lerp(x0 + 520, x0, inK) + block * PUSH;
        const step = es(t, 3.1, 3.6);
        const [ax, ay] = MOM_AT[m.i];
        x = lerp(x, m.i === 2 ? ax : ax, step);
        const walking = (inK > 0 && inK < 1) || (step > 0 && step < 1);
        const gave = m.i === 2 ? es(t, 3.55, 3.62) : 0;
        const hold = { x, y: lerp(GY - 4 + m.i * 6, ay, step), s: 0.9, flip: true, walk: walking ? x * 0.05 + m.i : undefined, armF: 70 + bump(t, 0.5, 1.0) * 20 - block * 20, armB: 20 + block * 40, head: 6, blink: blinkAt(T, m.seed) };
        m.p.set({ ...hold, o: 1 - gave });
        m.give.set({ ...hold, armF: 30, armB: 20, head: 0, o: gave });
      });
      const dadX = lerp(1720, P ? 1060 : 1240, inK) + block * PUSH;
      dad.set({ x: lerp(dadX, JX + (P ? 305 : 420), es(t, 3.1, 3.6)), y: GY - 14, s: 0.9, flip: true, walk: inK > 0 && inK < 1 ? dadX * 0.05 : undefined, armF: 40, armB: 20 + bump(t, 3.0, 3.4) * 60, head: 4, blink: blinkAt(T, 4) });
      kids.forEach((k) => {
        const r = run(k.i);
        const x0 = lerp(1640 - k.i * 60, P ? 1035 - k.i * 45 : 1180 - k.i * 56, inK) + block * PUSH;
        const [ex, ey] = KID_AT[k.i];
        const x = lerp(x0, ex, r), y = lerp(GY + 4 + k.i * 6, ey, r);
        const reach = k.i === 0 ? es(t, 5.05, 5.25) : 0;
        const walking = (inK > 0 && inK < 1) || (r > 0 && r < 1);
        k.p.set({ x, y, s: 0.56, flip: r < 0.6 ? true : x > JX, walk: walking ? x * 0.1 + k.i : undefined, bob: walking ? -Math.abs(Math.sin(x * 0.1)) * 5 : 0, armF: 20 + r * 40 + reach * 90 - block * 10, armB: 10 + r * 70 + reach * 110, head: 8 * block - r * 10 - reach * 8, blink: blinkAt(T, k.seed) });
        const [hx, hy] = headAt(x, y, 0.56, x > JX);
        pose(lights[k.i], { x: hx, y: hy - 22, s: es(t, 4.25 + k.i * 0.06, 4.45 + k.i * 0.06, ease.back) * 0.9, o: t > 4.25 ? 1 : 0 });
      });

      /* Jesus: beckons (v16a), speaks (v16b), kneels with a baby in His arms among them (from the end of v16b) */
      const beckon = es(t, 2.05, 2.25) * (1 - es(t, 3.4, 3.5));
      const kneel = es(t, 3.55, 3.62);
      J.set({ x: JX, y: GY, s: 1.04, flip: false, armF: 20 + beckon * 60 + bump(t, 0.3, 1.0) * 20, armB: 10 + beckon * (110 + Math.sin(t * 24) * 16 * bump(t, 2.1, 2.9)), head: -beckon * 4, o: 1 - kneel, blink: blinkAt(T) });
      JK.set({ x: JX + 6, y: GY + 6, s: 1.04, flip: false, armF: 80, armB: 110 + bump(t, 4.2, 4.9) * 40, head: 8, o: kneel, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(JX, GY, 1.04, false);
      voice(jhx, jhy, bump(t, 2.05, 3.5) * 0.8, T, { spread: 1.8 });
      pose(come, { x: jhx - 30, y: jhy - 40, s: es(t, 3.05, 3.22, ease.back), o: t > 3.05 && t < 4.05 ? 1 - es(t, 3.95, 4.05) : 0 });

      /* v16c, v17 — the sign of the Kingdom over them; a small one into the littlest's hands */
      const kk = es(t, 4.05, 4.3, ease.out);
      const ky = lerp(-1500, 330, kk) + (T ? Math.sin(T * 0.8) * 2 : 0);
      pose(K, { x: JX, y: ky, r: T ? Math.sin(T * 0.6) * 1.2 : 0 });
      const [kx0, ky0] = KID_AT[0];
      const fl = seg(t, 5.25, 5.7);
      const [hx, hy] = handAt(kx0, ky0, 0.56, false, 20 + 40 + 90);
      pose(small, { x: lerp(JX, hx - 4, ease.io(fl)), y: lerp(ky + 20, hy - 12, ease.io(fl)), s: 0.6 + fl * 0.5, o: t > 5.25 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 60], [1.0, 60], [2.0, 30], [3.0, 20], [4.0, 0]]);
      S.cam.y = kf(t, [[0, 0], [3.0, 0], [3.5, 16], [4.0, 10], [5.0, 10], [5.6, 20]]);
      S.cam.z = kf(t, [[0, 1.02], [3.5, 1.04], [5.0, 1.06], [5.8, 1.08]]);
      void shade; void mix; void sheet; void PI;
    };
  },
};
