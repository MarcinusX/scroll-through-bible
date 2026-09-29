// Mt 12,41–42 — the square turns into the judgment: the sky goes gold. On the left the people of Nineveh rise in
// light, dressed in sackcloth, with their king, and point at the Pharisees on the right. Why: Jonah appears before
// them, calling out, and they go down on their knees. "And here is something greater than Jonah": Jonah turns to
// Jesus and bows, and the light round Jesus grows. Then the queen of the South rises in their place, with her camel and
// her servants; far off on the hills her caravan comes "from the ends of the earth", and Solomon sits on his golden
// throne while she listens to him. "And here is something greater than Solomon": Solomon rises, takes off his crown
// and bows towards Jesus.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { squareSet, SQ, JUDGE, JONAH, SACK, SOLOMON, QUEEN, pose3, camel, walkCamel, throne, crown, addToHead, headAt, handAt, kf, bubble, bang, speech, glow, rayBurst, sparkle, tr, PI } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const F = SQ.FEET;
const LX = 590;       // where the witnesses rise

/** the people of Nineveh in sackcloth (their king among them), standing and pointing, or kneeling */
function ninevites(kneel) {
  const c = makeCutter('mt12-nineveh');
  const oc = makeCutter('mt12-nineveh-o');
  const mem = Array.from({ length: 8 }, (_, i) => {
    const king = i === 3;
    const o = { robe: mix(SACK, [C.sand2, C.rock2, C.wood3][i % 3], 0.25), skin: oc.pick([C.skin2, C.skin3, C.skin4]), hair: oc.pick([C.hair, C.hair3, C.greyHair]), hairStyle: i % 3 === 1 ? 'veil' : oc.pick(['curly', 'wrap', 'short']), veil: mix(SACK, C.stone, 0.3), beard: i % 3 === 1 ? 'none' : oc.pick(['full', 'short']), belt: C.rope, pose: kneel ? 'kneel' : 'stand' };
    const r = i < 4 ? 0 : 1;
    return { x: ((i % 4) - 1.5) * 50 + r * 25 + oc.rr(-6, 6), y: r * 20, s: 0.62 * oc.rr(0.95, 1.05) * (1 + r * 0.06), flip: false, head: kneel ? 14 : -4, armF: kneel ? 60 : (i % 2 ? 90 : 30), armB: kneel ? 70 : 10, o, king };
  });
  const out = pose3(c, mem.map((m) => ({ ...m, o: m.o })));
  const k = mem[3];
  const cr = `<g transform="translate(${k.x + 1.2} ${k.y + (-167 + (kneel ? 46 : 0)) * k.s - 16 * k.s}) scale(${k.s * 1.1})">${crown(c)}</g>`;
  return out + cr;
}

export default {
  id: 'mt12-judgment',
  beats: [
    { v: 41, text: 'Ludzie z Niniwy powstaną na sądzie przeciw temu plemieniu i potępią je;' },
    { v: 41, cont: true, text: 'ponieważ oni wskutek nawoływania Jonasza się nawrócili,' },
    { v: 41, cont: true, text: 'a oto tu jest coś więcej niż Jonasz.' },
    { v: 42, text: 'Królowa z Południa powstanie na sądzie przeciw temu plemieniu i potępi je;' },
    { v: 42, cont: true, text: 'ponieważ ona z krańców ziemi przybyła słuchać mądrości Salomona,' },
    { v: 42, cont: true, text: 'a oto tu jest coś więcej niż Salomon.' },
  ],
  cam: { x: [-60, 30], y: [-20, 50], z: [1, 1.14] },
  build(S) {
    const Q = squareSet(S, { sky2: JUDGE, dis: [], ph: 3, crowd: false });
    const c = Q.c;
    /* the far caravan on the hills */
    const farL = S.layer({ par: 0.1, sh: 2 });
    const caravan = [0, 1, 2].map((i) => farL.add(`<g opacity="0"><g transform="scale(.26)">${camel(c)}</g></g>`));
    /* the witnesses rising */
    const wit = S.layer({ par: 0.36, sh: 4 });
    const riseGlow = wit.add(`<g opacity="0">${glow(220, 1, 'halo-glow')}</g>`);
    const ninS = wit.sprite(ninevites(false), LX, F - 10);
    const ninK = wit.sprite(ninevites(true), LX, F - 10);
    const throneEl = wit.add(`<g opacity="0">${glow(120, 0.8)}<g transform="scale(.62)">${throne(c)}</g></g>`);
    const solSit = S.puppet(wit.add(addToHead(person(c, { ...SOLOMON, pose: 'sit' }), `<g transform="translate(0 -4)">${crown(c)}</g>`)));
    const solBow = S.puppet(wit.add(person(c, { ...SOLOMON, holdF: `<g transform="translate(4 6)">${crown(c)}</g>` })));
    const camelEl = wit.add(`<g opacity="0"><g transform="scale(.7)">${camel(c)}</g></g>`);
    const queen = S.puppet(wit.add(person(c, QUEEN)));
    const maid = S.puppet(wit.add(person(c, { robe: C.ochreRobe, hairStyle: 'veil', veil: C.terracotta, skin: C.skin4, beard: 'none', belt: C.sun, holdF: `<g transform="translate(0 -6)">${sheet().p(c.cut(c.rect(-12, -10, 24, 18), 0.3, 4), C.sun).out()}</g>` })));
    /* Jonah */
    const act = Q.act;
    const jonah = S.puppet(act.add(person(c, JONAH)));
    const cry = act.add(`<g opacity="0">${speech(c, bang(c, 26), { w: 48, h: 46 })}</g>`);
    const rays = act.add(`<g opacity="0">${rayBurst(c, { n: 18, r0: 50, r1: 320, spread: 0.045, color: '#fff3cf', o: 0.5 })}</g>`);
    const sp = [0, 1, 2].map(() => act.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      Q.sk2.layer.fade(es(t, -0.3, 0.3));
      /* v41a — Nineveh rises and points */
      const nin = es(t, 0.05, 0.4) * (1 - es(t, 2.95, 3.15));
      const kneel = es(t, 1.4, 1.5) * (1 - es(t, 2.4, 2.5));
      ninS.set({ x: LX, y: F - 10 + (1 - nin) * 60, o: nin * (1 - kneel) });
      ninK.set({ x: LX, y: F - 10 + (1 - nin) * 60, o: nin * kneel });
      const queenIn = es(t, 3.05, 3.4);
      pose(riseGlow, { x: LX, y: F - 90, s: 0.8 + nin * 0.3 + queenIn * 0.3, o: Math.max(bump(t, 0.0, 0.9), bump(t, 3.0, 3.9)) * 0.9 + 0.25 * Math.max(nin, queenIn) });
      const condemn = es(t, 0.3, 0.5) * (1 - es(t, 0.95, 1.1)) + es(t, 3.3, 3.5) * (1 - es(t, 3.95, 4.1));
      /* v41b — Jonah calls; they kneel */
      const jIn = es(t, 1.02, 1.2) * (1 - es(t, 2.95, 3.1));
      const bowJ = es(t, 2.15, 2.4);
      jonah.set({ x: LX + 118, y: F + 16, s: 0.96, flip: bowJ < 0.5, o: jIn, armF: 40 + bump(t, 1.2, 1.9) * 60 - bowJ * 20, armB: 20 + bump(t, 1.2, 1.9) * 100, head: -bump(t, 1.2, 1.9) * 8 + bowJ * 16, lean: bowJ * 10, blink: blinkAt(T, 4) });
      const ck = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 1.85, 1.95));
      const [jhx, jhy] = headAt(LX + 118, F + 16, 0.96, true);
      pose(cry, { x: jhx - 60, y: jhy - 10, sx: -1, s: ck, o: ck > 0.01 ? 1 : 0 });
      /* v41c / v42c — something greater is here */
      const greater = es(t, 2.1, 2.45) * (1 - es(t, 2.9, 3.1)) + es(t, 5.1, 5.45);
      pose(rays, { x: SQ.JX, y: F - 190, s: 0.6 + greater * 0.5, r: T * 3, o: Math.min(1, greater) });
      sp.forEach((s_, i) => {
        const k = Math.max(es(t, 2.3 + i * 0.05, 2.45 + i * 0.05, ease.back) * (1 - es(t, 2.9, 3.0)), es(t, 5.3 + i * 0.05, 5.45 + i * 0.05, ease.back));
        pose(s_, { x: SQ.JX - 60 + i * 60, y: 430 - (i % 2) * 30, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });
      /* v42a — the queen of the South rises; v42b — her caravan, Solomon's wisdom */
      queen.set({ x: LX + 30, y: F - 10 + (1 - queenIn) * 60, s: 0.9, flip: es(t, 4.1, 4.2) > 0.5, o: queenIn, armF: 20 + condemn * 70 * es(t, 3.3, 3.5) + es(t, 4.2, 4.5) * 20, armB: 10, head: es(t, 4.2, 4.5) * 6, blink: blinkAt(T, 6) });
      maid.set({ x: LX + 96, y: F, s: 0.8, flip: false, o: queenIn, armF: 60, armB: 10, head: 4, blink: blinkAt(T, 7) });
      pose(camelEl, { x: LX + 150, y: F - 34 + (1 - queenIn) * 60, s: 0.85, o: queenIn });
      caravan.forEach((cv, i) => {
        const k = seg(t, 4.0 + i * 0.05, 4.8 + i * 0.05);
        pose(cv, { x: lerp(300, 760, k) - i * 50, y: 452 + i * 2, o: es(t, 4.0, 4.1) * (1 - es(t, 5.0, 5.2)) });
        walkCamel(cv.firstElementChild.firstElementChild || cv, k * 20);
      });
      const solIn = es(t, 4.1, 4.35);
      const solUp = es(t, 5.1, 5.18);
      const solBowK = es(t, 5.2, 5.45);
      pose(throneEl, { x: LX - 100, y: F - 12, o: solIn });
      solSit.set({ x: LX - 100, y: F - 40, s: 0.86, flip: false, o: solIn * (1 - solUp), armF: 30 + bump(t, 4.3, 4.9) * 50, armB: 10 + bump(t, 4.4, 4.95) * 60, head: -4, blink: blinkAt(T, 8) });
      solBow.set({ x: LX - 70, y: F - 12, s: 0.88, flip: false, o: solUp, armF: 70, armB: 20, head: 14 * solBowK, lean: solBowK * 12, blink: solBowK * 0.8 });

      /* Jesus and the Pharisees ("this generation") */
      Q.pose(t, T,
        { armF: 16 + greater * 30, armB: 8 + greater * 60, head: -2 - greater * 6, blink: blinkAt(T, 2) },
        () => ({}),
        (m) => ({ armF: 8 + condemn * 30, armB: condemn * 30, head: condemn * 8, lean: -condemn * 6, blink: Math.max(condemn * 0.5, blinkAt(T, m.seed)) }));

      S.cam.x = kf(t, [[-0.5, -30], [0.9, -30], [1.2, -50], [2.0, -50], [2.2, -10], [2.9, -10], [3.2, -40], [5.0, -40], [5.2, -10]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [1.2, 1.1], [2.0, 1.1], [2.2, 1.06], [3.2, 1.08], [5.0, 1.08], [5.2, 1.06]]);
      S.cam.y = kf(t, [[-0.5, 30], [1.2, 40], [5.0, 40], [5.2, 30]]);
    };
  },
};
