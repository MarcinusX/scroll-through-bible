// Łk 11,31–32 — the village square turns into the judgment: the sky goes gold. "The queen of the South will rise at the
// judgment with the people of this generation and condemn them": on the left the queen rises in light, her maid beside
// her, and points at the Pharisees and the crowd on the right. "For she came from the ends of the earth to hear the
// wisdom of Solomon": a panel comes down — from the very edge of the world her camels plod across the desert to
// Solomon on his golden throne. "And behold, something greater than Solomon is here": Solomon himself rises beside her,
// takes off his crown and bows towards Jesus, and the light round Jesus grows. "The men of Nineveh will rise at the
// judgment with this generation and condemn it": the queen gives place to the people of Nineveh in sackcloth, their
// king among them, pointing. "For they repented at the preaching of Jonah": Jonah stands before them, calling out, and
// they go down on their knees. "And behold, something greater than Jonah is here": Jonah turns to Jesus and bows.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { villageSet, VQ, JUDGE, JONAH, SACK, SOLOMON, QUEEN, pose3, camel, throne, crown, addToHead, panel, panelSky, panelGround, figure, speech, bang, glow, rayBurst, sparkle, headAt, kf, PI } from './lib.js';

const F = VQ.FEET;
const LX = 560;       // where the witnesses rise
const PX = 800, PY = 280, PW = 400, PH = 200;

/** the people of Nineveh in sackcloth (their king among them), standing and pointing, or kneeling */
function ninevites(kneel) {
  const c = makeCutter('lk11-nineveh');
  const oc = makeCutter('lk11-nineveh-o');
  const mem = Array.from({ length: 8 }, (_, i) => {
    const o = { robe: mix(SACK, [C.sand2, C.rock2, C.wood3][i % 3], 0.25), skin: oc.pick([C.skin2, C.skin3, C.skin4]), hair: oc.pick([C.hair, C.hair3, C.greyHair]), hairStyle: i % 3 === 1 ? 'veil' : oc.pick(['curly', 'wrap', 'short']), veil: mix(SACK, C.stone, 0.3), beard: i % 3 === 1 ? 'none' : oc.pick(['full', 'short']), belt: C.rope, pose: kneel ? 'kneel' : 'stand' };
    const r = i < 4 ? 0 : 1;
    return { x: ((i % 4) - 1.5) * 50 + r * 25 + oc.rr(-6, 6), y: r * 20, s: 0.66 * oc.rr(0.95, 1.05) * (1 + r * 0.06), flip: false, head: kneel ? 14 : -4, armF: kneel ? 60 : (i % 2 ? 90 : 30), armB: kneel ? 70 : 10, o };
  });
  const k = mem[3];
  return pose3(c, mem) + `<g transform="translate(${k.x + 1.3} ${k.y + (-167 + (kneel ? 46 : 0)) * k.s - 16 * k.s}) scale(${k.s * 1.1})">${crown(c)}</g>`;
}

export default {
  id: 'lk11-judgment',
  beats: [
    { v: 31, text: 'Królowa z Południa powstanie na sądzie przeciw ludziom tego plemienia i potępi ich;' },
    { v: 31, cont: true, text: 'ponieważ ona przybyła z krańców ziemi słuchać mądrości Salomona,' },
    { v: 31, cont: true, text: 'a oto tu jest coś więcej niż Salomon.' },
    { v: 32, text: 'Ludzie z Niniwy powstaną na sądzie przeciw temu plemieniu i potępią je;' },
    { v: 32, cont: true, text: 'ponieważ oni dzięki nawoływaniu Jonasza się nawrócili,' },
    { v: 32, cont: true, text: 'a oto tu jest coś więcej niż Jonasz.' },
  ],
  cam: { x: [-120, 30], y: [-60, 50], z: [1, 1.14] },
  build(S) {
    const Q = villageSet(S, { sky2: JUDGE, dis: [], ph: 3 });
    const c = Q.c;
    const q = makeCutter('lk11-judgment-p');
    /* the panel: from the ends of the earth to Solomon's throne */
    const edge = sheet().p(q.cut([[-PW / 2 - 4, -PH / 2 - 4], [-150, -PH / 2 - 4], [-150, PH / 2 + 4], [-PW / 2 - 4, PH / 2 + 4]], 0.4, 6), mix(C.night, C.indigo, 0.4)).out()
      + `<path d="${q.poly(q.circ(-176, -40, 3, 6))}" fill="${C.star}"/><path d="${q.poly(q.circ(-184, 20, 2, 6))}" fill="${C.star}"/><path d="${q.poly(q.circ(-168, 60, 2.4, 6))}" fill="${C.star}"/>`;
    const land = sheet().p(q.cut([[-150, 30], [-120, 22], [0, 26], [PW / 2 + 4, 20], [PW / 2 + 4, PH / 2 + 4], [-150, PH / 2 + 4]], 0.6, 8), mix(C.dune, C.sand, 0.3)).p(q.cut([[-150, 30], [-150, PH / 2 + 4], [-160, PH / 2 + 4], [-160, 40]], 0.4, 4), shade(C.dune, -0.2)).out();
    const pan = Q.flyL.add(panel(S, panelSky(S, PW, PH, ['#e9c98c', '#f8e6c4']) + edge + land
      + `<g transform="translate(140 72) scale(.3)">${throne(q)}</g>` + figure(q, { ...SOLOMON, pose: 'sit' }, { x: 138, y: 64, s: 0.34, flip: true, armF: 50, armB: 20 }) + `<g transform="translate(137 -2) scale(.4)">${crown(q)}</g>`, { w: PW, h: PH }));
    const caravan = [0, 1, 2].map((i) => Q.flyL.add(`<g opacity="0"><g transform="scale(${0.3 - i * 0.02})">${camel(q)}</g></g>`));
    /* the witnesses */
    const riseGlow = Q.rayFx.add(`<g opacity="0">${glow(220, 1, 'halo-glow')}</g>`);
    const greaterRays = Q.rayFx.add(`<g opacity="0">${rayBurst(c, { n: 18, r0: 50, r1: 360, spread: 0.045, color: '#fff3cf', o: 0.5 })}</g>`);
    const wit = S.layer({ par: 0.44, sh: 4 });
    const ninS = wit.sprite(ninevites(false), LX, F - 6);
    const ninK = wit.sprite(ninevites(true), LX, F - 6);
    const queen = S.puppet(wit.add(person(c, QUEEN)));
    const maid = S.puppet(wit.add(person(c, { robe: C.ochreRobe, hairStyle: 'veil', veil: C.terracotta, skin: C.skin4, beard: 'none', belt: C.sun })));
    const solomon = S.puppet(wit.add(addToHead(person(c, SOLOMON), `<g data-k="scrown" transform="translate(0 -4)">${crown(c)}</g>`)));
    const sCrown = S.$('scrown');
    const heldCrown = wit.add(`<g opacity="0">${crown(c)}</g>`);
    const jonah = S.puppet(Q.act.add(person(c, JONAH)));
    const cry = Q.W.add(`<g opacity="0">${speech(c, bang(c, 22), { w: 48, h: 46, flip: true })}</g>`);
    const sp = [0, 1, 2].map(() => Q.W.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      Q.sk2.layer.fade(es(t, -0.3, 0.3));
      /* v31a — the queen rises and points */
      const qIn = es(t, 0.05, 0.4) * (1 - es(t, 2.95, 3.15));
      const qPoint = es(t, 0.3, 0.5) * (1 - es(t, 0.95, 1.1));
      queen.set({ x: LX - 30, y: F + 4 + (1 - qIn) * 60, s: 0.98, o: qIn, armF: 20 + qPoint * 70, armB: 10, head: -2, blink: blinkAt(T, 6) });
      maid.set({ x: LX - 110, y: F + 8 + (1 - qIn) * 60, s: 0.86, o: qIn, armF: 50, armB: 10, head: 4, blink: blinkAt(T, 7) });
      /* v31b — the panel: the caravan from the ends of the earth */
      const pk = es(t, 1.02, 1.3, ease.out) * (1 - es(t, 1.95, 2.15, ease.in));
      const Y = lerp(-1500, PY, pk);
      pose(pan, { x: PX, y: Y, o: pk > 0.002 ? 1 : 0 });
      caravan.forEach((cv, i) => {
        const k = es(t, 1.25 + i * 0.04, 1.9);
        pose(cv, { x: PX - 150 + k * 230 - i * 36, y: Y + 30 + i, o: pk > 0.9 ? 1 : 0 });
      });
      /* v31c — Solomon rises, takes off his crown and bows to Jesus */
      const sIn = es(t, 2.02, 2.2) * (1 - es(t, 2.95, 3.1));
      const off = es(t, 2.3, 2.42);
      const bowS = es(t, 2.4, 2.6);
      solomon.set({ x: LX + 90, y: F + 6 + (1 - sIn) * 60, s: 1.0, o: sIn, armF: 20 + off * 60, armB: 10, head: bowS * 16, lean: bowS * 12, blink: bowS * 0.7 });
      pose(sCrown, { x: 0, y: -4, o: off > 0.5 ? 0 : 1 });
      const [shx, shy] = headAt(LX + 90, F + 6, 1.0);
      pose(heldCrown, { x: shx + 40, y: shy + 40 + bowS * 10, o: off > 0.5 ? sIn : 0 });
      /* v32a — the men of Nineveh rise; v32b — Jonah preaches, they kneel */
      const nin = es(t, 3.05, 3.4);
      const kneel = es(t, 4.4, 4.5);
      ninS.set({ x: LX, y: F - 6 + (1 - nin) * 60, o: nin * (1 - kneel) });
      ninK.set({ x: LX, y: F - 6 + (1 - nin) * 60, o: nin * kneel });
      const jIn = es(t, 4.05, 4.2);
      const bowJ = es(t, 5.15, 5.4);
      jonah.set({ x: LX + 150, y: F + 16, s: 0.98, flip: bowJ < 0.5, o: jIn, armF: 40 + bump(t, 4.2, 4.9) * 60 - bowJ * 20, armB: 20 + bump(t, 4.2, 4.9) * 100, head: -bump(t, 4.2, 4.9) * 8 + bowJ * 16, lean: bowJ * 10, blink: blinkAt(T, 4) });
      const ck = es(t, 4.2, 4.35, ease.back) * (1 - es(t, 4.85, 4.95));
      const [jhx, jhy] = headAt(LX + 150, F + 16, 0.98, true);
      pose(cry, { x: jhx - 16, y: jhy - 14, s: ck, o: ck > 0.01 ? 1 : 0 });
      pose(riseGlow, { x: LX, y: F - 100, s: 0.9, o: Math.max(qIn, nin) * 0.8 });
      /* v31c / v32c — something greater is here */
      const greater = es(t, 2.2, 2.5) * (1 - es(t, 2.95, 3.1)) + es(t, 5.1, 5.4);
      pose(greaterRays, { x: VQ.JX, y: F - 150, s: 0.6 + greater * 0.5, r: T * 3, o: Math.min(1, greater) });
      sp.forEach((s_, i) => {
        const k = Math.max(es(t, 2.35 + i * 0.05, 2.5 + i * 0.05, ease.back) * (1 - es(t, 2.95, 3.0)), es(t, 5.3 + i * 0.05, 5.45 + i * 0.05, ease.back));
        pose(s_, { x: VQ.JX - 70 + i * 70, y: 440 - (i % 2) * 34, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });
      /* Jesus; "this generation" on the right */
      const condemn = es(t, 0.3, 0.5) * (1 - es(t, 0.95, 1.1)) + es(t, 3.3, 3.5) * (1 - es(t, 3.95, 4.1));
      Q.pose(t, T,
        { armF: 16 + greater * 30, armB: 8 + greater * 70, head: -2 - greater * 6, blink: blinkAt(T, 2) },
        () => ({}),
        (m) => ({ armF: 8 + condemn * 30, armB: condemn * 30, head: condemn * 10, lean: -condemn * 6, blink: Math.max(condemn * 0.5, blinkAt(T, m.seed)) }));
      Q.amaze(0);

      S.cam.x = kf(t, [[-0.5, -30], [0.9, -30], [1.1, 0], [1.95, 0], [2.2, -30], [3.0, -30], [4.0, -40], [5.1, -40], [5.3, -10]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.9, 30], [1.1, -40], [1.95, -40], [2.2, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.9, 1.1], [1.1, 1.02], [1.95, 1.02], [2.2, 1.08], [4.0, 1.1], [5.2, 1.06]]);
      if (S.portrait) S.cam.x -= 60;
    };
  },
};
