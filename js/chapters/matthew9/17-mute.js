// Mt 9,31–34 — the two men burst out of the door, seeing, and run down the street telling everyone ("!" at every
// door). As they go, two men lead in a mute man: a dark cloth over his mouth and a little shadow-spirit clinging
// over his head. Jesus casts it out — it flies off and fades — the cloth falls, and the man speaks: golden words
// pour out. The crowd lifts its hands: "Nothing like this has ever been seen in Israel!" But on the side the
// Pharisees mutter darkly: "By the prince of demons he casts out demons."
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { streetSet, BLIND, MUTE, gag, onFace, spirit, mob, bubble, glyphTag, scribe, wordSlip, spark, kf, moving, tr, DAY, PI } from './lib.js';
import { doorHouse } from '../john1/lib.js';

const FEET = 722;
const HX = 1040, HW = 300;
const DOORX = HX + HW * 0.18 + 45;

export default {
  id: 'mt9-mute',
  beats: [
    { v: 31 },
    { v: 32 },
    { v: 33, text: 'Po wyrzuceniu złego ducha niemy odzyskał mowę,' },
    { v: 33, cont: true, text: 'a tłumy pełne podziwu wołały: «Jeszcze się nigdy nic podobnego nie pojawiło w Izraelu!»' },
    { v: 34 },
  ],
  cam: { x: [-160, 200], y: [0, 50], z: [0.96, 1.14] },
  build(S) {
    const set = streetSet(S, { skyCols: DAY, sunAt: [420, 150] });
    const c = S.c;
    const hL = S.layer({ par: 0.5, sh: 4 });
    const H = doorHouse(c, { w: HW, h: 270, dw: 90, dh: 200 });
    hL.add(`<g transform="translate(${HX} ${FEET - 30})">${H.wall}${H.inside}</g>`);

    /* the crowd: calm, then amazed (still sprites) */
    const back = S.layer({ par: 0.5, sh: 4 });
    const CR = [[420, -40, 'a', 5], [700, -44, 'b', 4], [1400, -36, 'c', 4]].map(([x, dy, k, n], i) => {
      const calm = mob(makeCutter('mt9-mute-' + k), n, { s: 0.88, spread: 44, rows: 2, flip: x > 900, arms: 10 });
      const awe = mob(makeCutter('mt9-mute-' + k), n, { s: 0.88, spread: 44, rows: 2, flip: x > 900, arms: 0 }).replace(/<g class="armFr"[^>]*>/g, '<g class="armFr" transform="rotate(-150)">').replace(/<g class="armBr"[^>]*>/g, '<g class="armBr" transform="rotate(-120)">');
      return { i, x, y: FEET + dy, calm: back.sprite(calm, x, FEET + dy), awe: back.sprite(awe, x, FEET + dy) };
    });

    const L = S.layer({ par: 0.5, sh: 5 });
    const PH = [0, 1].map((i) => ({ i, p: S.puppet(L.add(scribe(c, i + 2))), seed: c.rr(0, 9) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const seers = BLIND.map((o, i) => ({ i, p: S.puppet(L.add(person(c, { ...o, mantle: i === 0 ? C.tealRobe : C.clayMantle }))), seed: c.rr(0, 9) }));
    const bearers = [0, 1].map((i) => ({ i, p: S.puppet(L.add(person(c, { robe: [C.sageRobe, C.ochreRobe][i], hair: C.hair, hairStyle: i ? 'curly' : 'short', beard: 'short', skin: [C.skin2, C.skin4][i], belt: C.leather }))), seed: c.rr(0, 9) }));
    const muteM = S.puppet(L.add(onFace(person(c, MUTE), `<g class="gag">${gag(c)}</g>`)));
    const freeM = S.puppet(L.add(person(c, { ...MUTE, hairStyle: 'short', robe: C.linen2, mantle: C.sageRobe })));

    const fx = S.layer({ par: 0.5, sh: 6 });
    const bangs = [[180, 560], [560, 540], [1320, 546], [1560, 560]].map(([x, y], i) => ({ i, x, y, el: fx.add(`<g opacity="0">${glyphTag(c, '!', { size: 22 })}</g>`) }));
    const shout = fx.add(`<g opacity="0">${bubble(c, [tr('Widzimy!', 'We can see!')], { size: 22, dir: -1 })}</g>`);
    const sp = fx.add(`<g>${spirit(c, 1.6, '#3b3148')}</g>`);
    const cloth = fx.add(`<g>${gag(c)}</g>`);
    const words = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g><circle r="30" fill="url(#warm-glow)"/>${wordSlip(c, 40)}</g>`) }));
    const burst = fx.add(`<g>${spark(c, 18)}</g>`);
    const marvel = fx.add(`<g opacity="0">${bubble(c, [tr('Jeszcze nic podobnego', 'Nothing like this'), tr('nie było w Izraelu!', 'has ever been seen in Israel!')], { size: 21, dir: 1 })}</g>`);
    const mutter = fx.add(`<g opacity="0">${bubble(c, [tr('Mocą przywódcy', 'By the prince'), tr('złych duchów…', 'of the demons…')], { size: 20, dir: -1, fill: mix(C.storm2, C.night2, 0.3), ink: C.cream })}</g>`);

    const MX = 820;          // where the mute man stands before Jesus
    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v31 — the two who see run out and tell everybody */
      seers.forEach((s) => {
        const K = [[0.02 + s.i * 0.08, DOORX], [0.9 + s.i * 0.06, s.i ? 280 : 1500]];
        const x = kf(t, K, (u) => u);
        const k = seg(t, 0.02 + s.i * 0.08, 0.9 + s.i * 0.06);
        s.p.set({ x, y: FEET + 6 - s.i * 10, s: 0.98, flip: s.i === 1, walk: k > 0 && k < 1 ? x * 0.06 + s.i : undefined, amt: 1.4, armF: 90 + s.i * 30, armB: 140, head: -8, lean: 6, o: seg(t, 0.02, 0.08) * (1 - es(t, 0.85, 1.0)), blink: blinkAt(T, s.seed) });
      });
      bangs.forEach((b) => {
        const k = es(t, 0.3 + b.i * 0.1, 0.45 + b.i * 0.1, ease.back) * (1 - es(t, 1.1, 1.2));
        pose(b.el, { x: b.x, y: b.y, s: k, r: k > 0.02 && T ? Math.sin(T * 6 + b.i) * 6 : 0, o: k > 0.02 ? 1 : 0 });
      });
      const shk = es(t, 0.15, 0.3, ease.back) * (1 - es(t, 0.8, 0.9));
      pose(shout, { x: DOORX - 80, y: FEET - 240, s: shk, o: shk > 0.02 ? 1 : 0 });

      /* v32 — the mute man is brought to Him */
      const JK = [[0.4, DOORX], [0.9, 940]];
      const jx = kf(t, JK);
      const cast_ = es(t, 2.02, 2.25);
      jesus.set({ x: jx, y: FEET - 26 * (1 - seg(t, 0.4, 0.5)), s: 1.04, flip: true, walk: moving(t, JK) ? jx * 0.05 : undefined, armF: 16 + cast_ * 80 * (1 - es(t, 2.9, 3.2)), armB: 10 + cast_ * 30, blink: blinkAt(T) });
      const BK = [[1.0, 260], [1.7, MX]];
      const bx = kf(t, BK);
      const walking = moving(t, BK);
      bearers.forEach((b) => b.p.set({ x: bx - (b.i ? 64 : 116), y: FEET + (b.i ? 16 : -12), s: 0.98, walk: walking ? bx * 0.05 + b.i : undefined, armF: 50, armB: 20 + es(t, 3.05, 3.3) * 120, head: -es(t, 3.05, 3.3) * 8, o: seg(t, 0.95, 1.05), blink: blinkAt(T, b.seed) }));
      const freed = es(t, 2.3, 2.37);
      muteM.set({ x: bx, y: FEET + 4, s: 1, walk: walking ? bx * 0.05 + 2 : undefined, armF: 10, armB: 10, head: 8, lean: 4, o: seg(t, 0.95, 1.05) * (1 - freed), blink: blinkAt(T, 4) });
      const speak = es(t, 2.4, 2.6);
      freeM.set({ x: MX, y: FEET + 4, s: 1, o: freed, armF: 40 + speak * 60, armB: 30 + speak * 100, head: -speak * 10, blink: blinkAt(T, 4) });

      /* v33a — the spirit is cast out; he speaks */
      const [hx, hy] = [bx + 4, FEET + 4 - 176];
      const out = es(t, 2.1, 2.5, ease.in);
      pose(sp, { x: hx - out * 200, y: hy - 50 - out * 360, r: -out * 60 + (T ? Math.sin(T * 4) * 8 : 0), s: 1 - out * 0.4, o: seg(t, 0.95, 1.05) * (1 - es(t, 2.35, 2.5)) });
      const fall = es(t, 2.3, 2.6, ease.in);
      pose(cloth, { x: MX + 6 - fall * 20, y: FEET + 4 - 168 + fall * 160, r: fall * 120, o: freed * (1 - es(t, 2.7, 2.9)) });
      pose(burst, { x: hx - 40, y: hy - 70, s: 0.6 + es(t, 2.2, 2.5), r: T * 30, o: bump(t, 2.2, 2.7) });
      words.forEach((w) => {
        const k = T ? ((T * 0.45 + w.i / 5) % 1) : (w.i + 0.5) / 5;
        pose(w.el, { x: MX + 30 + k * 120, y: FEET - 176 - k * 90 + Math.sin(k * 5 + w.i) * 12, r: -20 + k * 30, s: 0.9 + k * 0.5, o: es(t, 2.45, 2.6) * Math.sin(k * PI) * (1 - es(t, 3.9, 4.1)) });
      });

      /* v33b — the crowds marvel */
      const awe = es(t, 3.05, 3.15);
      CR.forEach((g) => { g.calm.set({ x: g.x, y: g.y, o: 1 - awe }); g.awe.set({ x: g.x, y: g.y - 3, o: awe }); });
      const mk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(marvel, { x: 660, y: FEET - 250, s: mk, o: mk > 0.02 ? 1 : 0 });

      /* v34 — the Pharisees mutter */
      PH.forEach((ph) => {
        const K = [[3.3, 60 - ph.i * 60], [3.9, 470 - ph.i * 64]];
        const x = kf(t, K);
        ph.p.set({ x, y: FEET + 20 + ph.i * 4, s: 1, flip: es(t, 4.1, 4.2) > 0.5 && ph.i === 1, walk: moving(t, K) ? x * 0.05 + ph.i : undefined, armF: 20 + es(t, 4.1, 4.3) * (ph.i ? 30 : 60), armB: 10, head: 6, o: seg(t, 3.3, 3.4), blink: blinkAt(T, ph.seed) });
      });
      const pk = es(t, 4.1, 4.3, ease.back);
      pose(mutter, { x: 480, y: FEET - 214, s: pk, o: pk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 120], [0.9, 40], [1.8, -20], [3.0, -20], [3.3, -60], [4.3, -110]]);
      S.cam.z = 1.02 + es(t, 1.8, 2.2) * 0.08 - es(t, 2.9, 3.3) * 0.08;
      S.cam.y = 20;
    };
  },
};
