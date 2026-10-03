// Łk 7,13–15 — at the gate of Nain. The Lord sees the widow and His heart goes out to her: a warm heart glows before
// Him — "Do not weep" — and her hands come down from her face; the tears stop. He steps up and lays His hand on the
// bier; the bearers stand still. "Young man, I say to you, arise!": light breaks out behind the bier. The dead man
// sits up and begins to speak; the bier is lowered, he stands, and Jesus takes him by the hand and gives him to his
// mother, who holds him.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  nainSet, NAIN, NP, BEARERS, WIDOW, YOUTH, carriedBier, wrapped, mournerGroup, folkGroup, tear, heart, bubble, rayBurst, sparkle, headAt, hand,
  voiceRings, kf, moving, tr,
} from './lib.js';

const FEET = NAIN.FEET;
const RISEN = { ...YOUTH, robe: C.linen, belt: C.linen2 };

export default {
  id: 'lk7-arise',
  beats: [
    { v: 13 },
    { v: 14 },
    { v: 15 },
  ],
  cam: { x: [0, 160], y: [0, 60], z: [1, 1.24] },
  build(S) {
    const N = nainSet(S);
    // phone: the widow and the town crowd stand further in (as at the end of the scene before)
    const WX0 = S.portrait ? 1030 : NP.WX;
    const TOWN = S.portrait ? [1170, 1370] : [1260, 1470];
    const c = S.c;
    /* light behind the bier (behind every person) */
    const LL = S.layer({ par: 0.4, sh: 0, flat: true });
    const burst = LL.add(`<g opacity="0">${rayBurst(c, { n: 16, r0: 40, r1: 260, spread: 0.04, o: 0.3 })}</g>`);
    const glow = LL.add(`<circle r="130" fill="url(#halo-glow)" opacity="0"/>`);
    const TL = S.layer({ par: 0.4, sh: 4 });
    const town = [0, 1].map((i) => TL.sprite(mournerGroup(makeCutter('lk7-mourn' + i), 6, { s: 0.86, seed: i * 2 }), TOWN[i], FEET - 4 - i * 6));
    const P = S.layer({ par: 0.4, sh: 5 });
    const bear = BEARERS.map((o, i) => ({ i, far: i < 2, o, p: null }));
    bear.filter((b) => b.far).forEach((b) => { b.p = S.puppet(P.add(person(c, b.o))); });
    const bierEl = P.add(`<g>${carriedBier(c, NP.BW)}</g>`);
    const body = P.add(`<g>${wrapped(c, YOUTH, NP.BW - 16)}</g>`);
    const sitUp = S.puppet(P.add(person(c, { ...RISEN, pose: 'sit' })));
    bear.filter((b) => !b.far).forEach((b) => { b.p = S.puppet(P.add(person(c, b.o))); });
    const son = S.puppet(P.add(person(c, RISEN)));
    const widow = S.puppet(P.add(person(c, WIDOW)));
    const tears = [0, 1, 2].map(() => P.add(`<g opacity="0">${tear(c, 4.4)}</g>`));
    N.addFront();
    const JL = S.layer({ par: 0.4, sh: 5 });
    const follow = [0, 1].map((i) => JL.sprite(folkGroup(makeCutter('lk7-nf' + i), 6, { s: 0.86 }), 170 - i * 250, FEET - 6 - i * 8));
    const DIS = [CAST.peter, CAST.john, CAST.james, CAST.andrew].map((o, i) => ({ i, p: S.puppet(JL.add(person(c, o))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(JL.add(person(c, { ...CAST.jesus })));
    const love = JL.add(`<g opacity="0">${heart(c, 19)}</g>`);
    const jv = voiceRings(JL, c, { n: 3, color: C.sun, r: 34, w: 5 });
    const sv = voiceRings(JL, c, { n: 2, color: C.clay, r: 22, w: 4 });
    const W = S.layer({ par: 0.42, sh: 3 });
    const noWeep = W.add(`<g opacity="0">${bubble(c, tr('Nie płacz!', 'Don’t cry!'), { size: 24, dir: -1, fill: C.halo })}</g>`);
    const arise = W.add(`<g opacity="0">${bubble(c, [tr('Młodzieńcze, tobie mówię,', 'Young man, I tell you,'), tr('wstań!', 'arise!')], { size: 22, dir: -1, fill: C.halo })}</g>`);
    const sparks = [0, 1, 2, 3, 4].map((i) => W.add(`<g opacity="0">${sparkle(c, 12 + (i % 2) * 6, C.halo)}</g>`));

    return (t, time) => {
      const T = time;
      N.update(T);
      town.forEach((g, i) => g.set({ x: TOWN[i], y: FEET - 4 - i * 6, s: 1 - i * 0.06 }));
      follow.forEach((g, i) => g.set({ x: 170 - i * 250, y: FEET - 6 - i * 8, s: 1 - i * 0.08 }));
      DIS.forEach((d) => d.p.set({ x: NP.DIS[Math.min(2, d.i)] - (d.i === 3 ? 80 : 0), y: FEET + (d.i % 2 ? 8 : -3), s: 0.98, armF: 12 + es(t, 2.1, 2.4) * 40, armB: es(t, 2.1, 2.4) * (d.i % 2 ? 90 : 20), head: 5 - es(t, 2.1, 2.4) * 10, blink: blinkAt(T, d.seed) }));

      /* the procession: still moving slowly until He touches the bier */
      const stop = es(t, 1.3, 1.36);
      const bx = lerp(NP.BX, NP.BX - 10, es(t, 0, 1.33));
      const walking = t < 1.33;
      const lower = es(t, 2.36, 2.56);
      const by = NP.BY + lower * 52 - (walking ? Math.abs(Math.sin(bx * 0.6)) * 2 : 0);
      bear.forEach((b) => {
        const x = bx + (b.i % 2 ? 108 : -108) + (b.far ? 10 : 0);
        b.p.set({ x, y: FEET + (b.far ? -8 : 4), s: 0.94, flip: true, walk: walking ? bx * 0.6 + b.i * 1.3 : undefined, amt: 0.4, armF: b.far ? 20 : 26, armB: 164 - lower * 90, head: 8 - stop * 14 - es(t, 2.0, 2.2) * 6, blink: blinkAt(T, b.i + 2) });
      });
      pose(bierEl, { x: bx, y: by });
      const sat = es(t, 2.02, 2.08);
      pose(body, { x: bx + 4, y: by - 2, o: 1 - sat });
      const stand = es(t, 2.5, 2.56);
      const look = bump(t, 2.1, 2.45);
      sitUp.set({ x: bx - 40, y: by - 2, s: 0.78, flip: true, o: sat * (1 - stand), armF: 30 + es(t, 2.08, 2.25) * 50, armB: 20 + look * 60, head: -8 + look * -6, lean: -6, blink: blinkAt(T, 3) });
      const [shx, shy] = headAt(bx - 40, by - 2, 0.78, true, 62);
      sv(shx, shy, bump(t, 2.12, 2.45), T, { dir: -1, spread: 1.4 });

      /* v13 — He sees her, has compassion: "Do not weep" */
      const toBier = es(t, 1.04, 1.28);
      const take = es(t, 2.56, 2.72);
      const jx = lerp(NP.JX, 646, toBier) + take * 34;
      const touch = es(t, 1.2, 1.34) * (1 - es(t, 2.0, 2.2));
      const call = es(t, 1.42, 1.56) * (1 - es(t, 1.95, 2.05));
      const give = es(t, 2.6, 2.8);
      jesus.set({
        x: jx, y: FEET, s: 1.04, walk: (toBier > 0 && toBier < 1) || (take > 0 && take < 1) ? jx * 0.045 : undefined, amt: 0.6,
        armF: 14 + bump(t, 0.35, 0.95) * 40 + touch * 66 + give * 60, armB: 8 + call * 130, head: 6 - call * 10 + bump(t, 0.1, 0.9) * 6, blink: blinkAt(T),
      });
      const [jhx, jhy] = headAt(jx, FEET, 1.04);
      const lk = bump(t, 0.1, 0.9);
      pose(love, { x: jhx + 26, y: jhy + 62 + (T ? Math.sin(T * 2) * 2 : 0), s: lk * (1 + (T ? Math.sin(T * 3) * 0.05 : 0)), o: lk > 0.02 ? 1 : 0 });
      jv(jhx, jhy, bump(t, 0.35, 0.95) + call, T, { dir: 1, spread: 2 });
      const nb = es(t, 0.4, 0.52, ease.back) * (1 - es(t, 0.95, 1.02));
      pose(noWeep, { x: jhx + 40, y: jhy - 40, s: nb, o: nb > 0.02 ? 1 : 0 });
      const ab = es(t, 1.45, 1.58, ease.back) * (1 - es(t, 1.97, 2.02));
      pose(arise, { x: jhx + 40, y: jhy - 44, s: ab, o: ab > 0.02 ? 1 : 0 });
      const lightK = es(t, 1.5, 1.9) * (1 - es(t, 2.3, 2.55));
      pose(burst, { x: bx, y: NP.BY - 20, s: 0.5 + lightK * 0.6, r: t * 8, o: lightK * 0.8 });
      pose(glow, { x: bx, y: NP.BY - 60, s: 0.6 + lightK * 0.5, o: lightK * 0.6 });

      /* the widow: her hands come down, the tears stop; at the end she holds her son */
      const calm = es(t, 0.55, 0.75);
      const come = [[2.6, WX0], [2.82, 930]];
      const wx = kf(t, come);
      const hug = es(t, 2.72, 2.86);
      widow.set({ x: wx, y: FEET + 2, s: 1.0, flip: true, walk: moving(t, come) ? wx * 0.05 : undefined, amt: 0.6, armF: 146 - calm * 110 + hug * 60, armB: 60 - calm * 40 + hug * 70, head: 18 - calm * 26 + hug * 6, lean: 6 - calm * 6, blink: calm < 0.5 ? 1 : blinkAt(T, 5) });
      const [whx, why] = headAt(wx, FEET + 2, 1.0, true);
      tears.forEach((e, i) => {
        const k = T ? ((T * 0.8 + i / 3) % 1) : (i + 0.5) / 3;
        pose(e, { x: whx - 16 + i * 6, y: why + 26 + k * 70, o: (1 - calm) * (1 - k) * 0.95 });
      });

      /* v15 — he stands; Jesus gives him to his mother */
      const sx = lerp(bx - 60, 866, es(t, 2.62, 2.84));
      son.set({ x: sx, y: FEET + 6, s: 0.96, o: stand, walk: t > 2.62 && t < 2.84 ? sx * 0.05 : undefined, amt: 0.6, armF: 40 + hug * 50, armB: 20 + hug * 60, head: -4, blink: blinkAt(T, 3) });
      sparks.forEach((sp, i) => { const k = bump(t, 2.05 + i * 0.07, 2.6 + i * 0.07); pose(sp, { x: bx - 60 + i * 40, y: NP.BY - 110 - (i % 2) * 30, s: k, r: T * 40 + i * 30, o: k }); });
      void hand;

      S.cam.x = kf(t, [[0, 120], [0.9, 110], [1.3, 70], [2.0, 80], [2.6, 90]]);
      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.14], [1.4, 1.18], [2.0, 1.2], [2.6, 1.16]]);
      S.cam.y = kf(t, [[0, 20], [1.4, 40], [2.6, 30]]);
    };
  },
};
