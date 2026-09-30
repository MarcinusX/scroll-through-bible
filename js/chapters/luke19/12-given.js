// Łk 19,24–27 — "Take the mina from him, and give it to him who has the ten": a steward crosses the hall, lifts the
// dull coin out of the kneeling servant's handkerchief and carries it over to the first servant, beside his heap.
// The bystanders throw up their hands: "Lord, he has ten minas!" "To everyone who has, more will be given; from him
// who has not, even what he has will be taken away": the coin drops onto the heap, which shines, while the empty
// handkerchief slips out of the third man's fingers and flutters to the floor. The end is told without a blow: the
// hall darkens; at the far door the enemies who would not have him for king are led in as dark shadows — and a dark
// curtain comes down over them. Only the throne stays in the light.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { hallSet, storyFrame, KH, NOBLE, SERV, GUARD, CITIZ, crown, addToHead, mina, kerchief, lowTable, minaPile, shadowPerson, say, label, sparkle, headAt, hand, kf, tr, es, ease, bump, seg, PI, mix, shade, sheet } from './lib.js';

const FL = KH.FL, KX = KH.THX, KY = FL - KH.DAIS * 2 - 58, KS = FL - KH.DAIS * 2;
const TX = 596, PX = 760, S1X = 960;
const SHADE = '#3a2d3a';

export default {
  id: 'lk19-given',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 24 },
    { v: 25 },
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-240, 160], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    let dark = null;
    const H = hallSet(S, {
      mid: (S2, c2) => {
        dark = S2.layer({ par: 0.3, sh: 0, flat: true, pad: 200 });
        dark.add(`<rect x="-2000" y="-2000" width="6000" height="5000" fill="${mix(C.night2, C.plumRobe, 0.25)}" opacity=".78"/><circle cx="${KX}" cy="${FL - 200}" r="300" fill="url(#warm-glow)"/>`);
        dark.fade(0);
        return dark;
      },
    });
    const c = S.c;
    const A = H.act;
    const kUp = S.puppet(A.add(addToHead(person(c, NOBLE), crown(c))));
    A.add(`<g transform="translate(${TX} ${FL + 4})">${lowTable(c, 130, 40)}</g><g transform="translate(${TX + 36} ${FL - 40})">${minaPile(c, 6, 10)}</g>`);
    const heap = A.add(`<g>${minaPile(c, 11, 10)}</g>`);
    const s1 = S.puppet(A.add(person(c, SERV[0])));
    const s2 = A.sprite(`<g transform="scale(-.86 .86)">${person(c, SERV[1])}</g>`, 1060, FL + 4);
    const s3k = S.puppet(A.add(person(c, { ...SERV[2], pose: 'kneel' })));
    const K = kerchief(c);
    const cloth = A.add(`<g>${K.open}</g>`);
    const coin = A.add(`<g>${mina(c, 11)}</g>`);
    const steward = S.puppet(A.add(person(c, GUARD)));
    const by = [0, 1].map((i) => S.puppet(A.add(person(c, { ...GUARD, robe: i ? C.linen2 : C.stone, mantle: i ? C.dustyBlue : C.sageRobe, hair: i ? C.greyHair : C.hair2, beard: 'full' }))));
    const enemies = CITIZ.map((o, i) => ({ i, el: A.add(`<g>${shadowPerson(c, o, SHADE)}</g>`) }));
    const fx = H.fx;
    const order = fx.add(`<g>${say(c, tr(['Odbierzcie mu minę', 'i dajcie temu, który ma dziesięć!'], ['Take the mina from him, and give it', 'to him who has the ten!']), { size: 18, side: 1 })}</g>`);
    const protest = fx.add(`<g>${say(c, tr(['Panie,', 'ma już dziesięć min!'], ['Lord,', 'he has ten minas!']), { size: 19, side: -1, jag: true })}</g>`);
    const more = fx.add(`<g>${label(c, tr('kto ma — będzie mu dodane', 'to him who has, more is given'), { size: 18, fill: C.halo })}</g>`);
    const less = fx.add(`<g>${label(c, tr('kto nie ma — zabiorą mu', 'from him who has not — taken'), { size: 18, fill: mix(C.stone, C.cream, 0.5) })}</g>`);
    const shine = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));
    const curtL = S.layer({ par: 0.5, sh: 7 });
    const curtain = curtL.add(`<g>${curtainM(c)}</g>`);
    storyFrame(S);

    const pop = (el, t, a, b, x, y, s = 1) => { const k = es(t, a, a + 0.14, ease.back) * (b === undefined ? 1 : 1 - es(t, b - 0.1, b)); pose(el, { x, y, s: k * s, o: k > 0.02 ? 1 : 0 }); };

    return (t, time) => {
      const T = time;
      /* v24 — take the mina from him; give it to the one who has ten */
      const doom = es(t, 3.05, 3.4);
      kUp.set({ x: KX + 16, y: KS, s: 1.04, flip: false, armF: 30 + es(t, 0.05, 0.25) * 60 * (1 - es(t, 0.9, 1.1)) + es(t, 2.05, 2.25) * 40 * (1 - es(t, 2.9, 3.0)) + doom * 70, armB: 10 + es(t, 2.05, 2.25) * 90 * (1 - es(t, 2.9, 3.0)), head: 2, blink: blinkAt(T) });
      const [khx, khy] = headAt(KX + 16, KS, 1.04, false);
      pop(order, t, 0.05, 0.95, khx + 20, khy - 20);
      const GK = [[0.1, 1250], [0.45, PX + 70], [0.55, PX + 70], [0.9, S1X + 60]];
      const gx = kf(t, GK, (x) => x);
      const gw = (t > 0.1 && t < 0.45) || (t > 0.55 && t < 0.9);
      const bend = bump(t, 0.43, 0.6);
      const give = bump(t, 0.85, 1.1);
      steward.set({ x: gx, y: FL + 14, s: 0.94, flip: t < 0.55, walk: gw ? gx * 0.06 : undefined, armF: 30 + bend * 50 + give * 60, lean: (t < 0.55 ? -1 : 1) * bend * 14, head: bend * 10, blink: blinkAt(T, 3), o: 1 - doom });
      const [ghx, ghy] = hand(gx, FL + 14, 0.94, t < 0.55, 30 + bend * 50 + give * 60);
      const [hx, hy] = hand(PX, FL + 12, 0.9, true, 50, 0, 46);
      // the coin: in the cloth → in the steward's hand → to the first servant → onto his heap
      const toHeap = es(t, 2.05, 2.35);
      let cx = hx - 16, cy = hy - 2;
      if (t > 0.5) { cx = ghx; cy = ghy - 8; }
      const [s1hx, s1hy] = hand(S1X, FL + 10, 0.9, true, 60);
      if (t > 1.0) { cx = s1hx - 4; cy = s1hy - 10; }
      cx = lerp(cx, TX - 30, toHeap); cy = lerp(cy, FL - 110, toHeap) - Math.sin(toHeap * PI) * 60;
      pose(coin, { x: cx, y: cy, o: toHeap < 1 ? 1 : 0 });
      pose(heap, { x: TX - 30, y: FL - 40, s: 1 + bump(t, 2.3, 2.6) * 0.08 });
      s1.set({ x: S1X, y: FL + 10, s: 0.9, flip: true, armF: 20 + es(t, 0.95, 1.05) * 40 * (1 - es(t, 2.0, 2.1)) + es(t, 2.0, 2.1) * 10, armB: 10, head: 4, blink: blinkAt(T, 4), o: 1 - doom });
      s2.set({ x: 1060, y: FL + 4, o: 1 - doom });
      /* v25 — "Lord, he has ten minas!" */
      by.forEach((p, i) => {
        const k = es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.05));
        p.set({ x: 1160 + i * 70, y: FL + 2 - i * 8, s: 0.9, flip: true, armF: 20 + k * 80, armB: 10 + k * (i ? 130 : 60), lean: k * -6, head: -k * 6, blink: blinkAt(T, 6 + i), o: 1 - doom });
      });
      pop(protest, t, 1.05, 1.98, 1170, FL - 190);
      /* v26 — to him who has, more; from him who has not, even that */
      const drop = es(t, 2.35, 2.8);
      s3k.set({ x: PX, y: FL + 12, s: 0.9, flip: true, armF: 50 - drop * 20, armB: 20, head: 16 + drop * 6, lean: 10, blink: blinkAt(T, 8), o: 1 - doom });
      pose(cloth, { x: hx - 16 + drop * 30, y: hy + 8 + drop * 70, r: drop * 40, s: 0.9, o: 1 - doom });
      pop(more, t, 2.3, 2.98, TX + 150, FL - 360);
      pop(less, t, 2.45, 2.98, PX + 170, FL - 300);
      shine.forEach((e, i) => { const k = bump(t, 2.3 + i * 0.08, 2.9 + i * 0.08); pose(e, { x: TX - 60 + i * 34, y: FL - 120 - (i % 2) * 20, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 }); });
      /* v27 — the enemies: the hall darkens, they are led in as shadows, and a curtain falls over them */
      if (dark) dark.fade(es(t, 3.0, 3.25) * 0.95);
      enemies.forEach((e) => {
        const k = es(t, 3.1 + e.i * 0.05, 3.45 + e.i * 0.05);
        pose(e.el, { x: lerp(1500, 1040 + e.i * 70, k), y: FL + 6 - (e.i % 2) * 8, s: 0.9, sx: -1, o: seg(t, 3.08, 3.2) });
      });
      const fall = es(t, 3.8, 3.98);
      pose(curtain, { x: 0, y: lerp(-1400, 0, fall), o: fall > 0.001 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, -120], [0.5, -60], [1.1, 40], [2.1, -140], [3.0, -80]]);
      S.cam.y = kf(t, [[-0.5, 20], [1.0, 30], [2.2, 10], [3.0, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [1.0, 1.12], [2.2, 1.18], [3.0, 1.06]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -160], [0.5, -80], [1.1, 140], [2.0, 140], [2.25, -140], [3.0, -60]]); S.cam.z = 1.0; }
      void shade; void sheet;
    };
  },
};
/** a dark curtain that falls over the right half of the stage (origin world) */
function curtainM(c) {
  const s = sheet();
  const x0 = 900, x1 = 2400, col = mix(C.curtain2, C.night2, 0.55);
  s.p(c.cut([[x0, -1600], [x1, -1600], [x1, 1800], [x0 + 20, 1800], [x0 - 10, 900], [x0 + 10, 300]], 1, 30), col);
  let folds = '';
  for (let x = x0 + 50; x < x1; x += 70) folds += c.ribbon([[x, -1600], [x + c.rr(-8, 8), 1800]], c.rr(10, 20));
  s.x(folds, shade(col, -0.2), 'opacity=".5"');
  s.p(c.cut([[x0 - 4, -1600], [x0 + 28, -1600], [x0 + 26, 1800], [x0 + 6, 1800]], 0.6, 30), shade(col, 0.15));
  return s.out();
}
