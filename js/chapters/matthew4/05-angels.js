// Mt 4,11 — dawn on the summit. The tempter, cowering in his shadow, tears apart into dark shards that the
// morning wind blows away, and the sky warms. "And behold": three angels come down on their strings with a
// basket of bread, a jug of water and a cup; a white cloth is spread on the rock, and they serve Him.
import { C, person, CAST, blinkAt, pose, lerp, swing, hanging, sheet, shade } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { peakSet, DAWN, HIGH, TEMPTER, tempterAura, shadowShards, angel, breadBasket, jug, cup, loaf, sparkle, PI } from './lib.js';

const TOP = 700;
const JX = 830;
const TX = 540;

export default {
  id: 'mt4-angels',
  beats: [
    { v: 11, text: 'Wtedy opuścił Go diabeł,' },
    { v: 11, cont: true, text: 'a oto aniołowie przystąpili i usługiwali Mu.' },
  ],
  cam: { x: [-20, 20], y: [0, 50], z: [1, 1.1] },
  build(S) {
    const P = peakSet(S, { skyCols: HIGH, sky2: DAWN, sunAt: [1220, 420], dawn: true });
    const c = P.c;
    const dawnSky = P.sk2;

    /* ---------- the tempter goes to pieces ---------- */
    const TL = S.layer({ par: 0.5, sh: 4 });
    const aura = TL.add(`<g>${tempterAura(c, 120)}</g>`);
    const tempter = S.puppet(TL.add(person(c, { ...TEMPTER })));
    const shards = shadowShards(c, { n: 11, r: 80, color: '#2a2238' }).map((sh) => ({ ...sh, el: TL.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.7, 1.3) }));

    /* ---------- the table on the rock, Jesus ---------- */
    const JL = S.layer({ par: 0.5, sh: 5 });
    const clothEl = JL.add(`<g opacity="0">${sheet().p(c.cut([[-70, -4], [70, -6], [80, 16], [-80, 18]], 0.5, 6), C.linen).x(c.ribbon([[-74, 12], [76, 10]], 2), C.stone2, 'opacity=".6"').out()}<g transform="translate(-30 -6)">${loaf(c, 16)}</g><g transform="translate(6 -4)">${loaf(c, 13)}</g><g transform="translate(40 -2)">${cup(c)}</g></g>`);
    const jKneel = S.puppet(JL.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jSit = S.puppet(JL.add(person(c, { ...CAST.jesus, pose: 'sit' })));

    /* ---------- angels on strings ---------- */
    const AL = S.layer({ par: 0.5, sh: 5 });
    const ANG = [
      { x: 640, y: TOP - 40, flip: false, hold: `<g transform="translate(0 6)">${breadBasket(c)}</g>`, extra: { mantle: C.skyVeil } },
      { x: 1040, y: TOP - 60, flip: true, hold: `<g transform="translate(2 12)">${jug(c)}</g>`, extra: { mantle: C.blushVeil, hair: C.hair2, hairStyle: 'short' } },
      { x: 900, y: TOP - 210, flip: true, hold: `<g transform="translate(0 4)">${cup(c)}</g>`, extra: { mantle: C.halo, hair: C.ochre } },
    ].map((a, i) => {
      const el = hanging(AL, `<g transform="translate(0 176)">${angel(c, { robe: C.linen, ...a.extra, holdF: a.hold })}</g>`, { x: a.x, y: a.y - 176, len: 900 });
      return { ...a, i, el, p: S.puppet(el.querySelector('.fig')) };
    });
    const sparks = [0, 1, 2, 3].map(() => AL.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      P.update(t, time);
      /* v11a: the devil leaves */
      const go = es(t, 0.2, 0.7);
      dawnSky.fade(es(t, 0.3, 1.2));
      swing(P.sunEl, 1220, lerp(420, 250, es(t, 0.3, 1.6)), time, 1, 0.6);
      tempter.set({ x: TX - go * 100, y: TOP, s: 0.86 * (1 - go * 0.2), flip: true, o: 1 - es(t, 0.4, 0.95) * 0.85 - es(t, 0.95, 1.05) * 0.15, armF: 20, armB: 10 + go * 30, head: 16, lean: 8, blink: blinkAt(time, 5) });
      pose(aura, { x: TX - 6, y: TOP + 10, s: 0.9 * (1 + Math.sin(time * 2) * 0.03), r: Math.sin(time * 0.7) * 4, o: 0.9 * (1 - es(t, 0.2, 0.5)) });
      shards.forEach((sh) => {
        const k = es(t, 0.28 + sh.i * 0.02, 1.15, ease.out);
        pose(sh.el, { x: TX - 10 + Math.cos(sh.a) * k * 110 * sh.drift - k * 170, y: TOP - 100 + Math.sin(sh.a) * k * 80 - k * 150 * sh.drift, s: (1 - k * 0.6), r: k * 200 * (sh.i % 2 ? 1 : -1), o: seg(t, 0.25, 0.35) * (1 - seg(k, 0.75, 1)) });
      });

      /* Jesus: kneeling in prayer, then seated on the rock to be served */
      const sitK = es(t, 1.08, 1.15);
      jKneel.set({ x: JX, y: TOP, s: 1.04, o: 1 - sitK, armF: 40 - go * 20, armB: 60 - go * 30, head: -10 + go * 6, blink: blinkAt(time) });
      const take = es(t, 1.55, 1.8);
      jSit.set({ x: JX - 10, y: TOP - 4, s: 1.04, o: sitK, armF: 20 + take * 50, armB: 10 + take * 16, head: -take * 4, blink: blinkAt(time) });
      pose(clothEl, { x: JX + 30, y: TOP + 12, o: es(t, 1.4, 1.55) });

      /* v11b: angels come down and serve Him */
      ANG.forEach((a) => {
        const k = es(t, 1.02 + a.i * 0.1, 1.45 + a.i * 0.1, ease.out);
        pose(a.el, { x: a.x, y: lerp(-700, a.y - 176, k) + Math.sin(time * 1.4 + a.i) * 4 * k, r: Math.sin(time * 0.8 + a.i) * 1.2, o: k > 0 ? 1 : 0 });
        const serve = es(t, 1.5 + a.i * 0.06, 1.75 + a.i * 0.06);
        a.p.set({ x: 0, y: 0, s: a.i === 2 ? 0.86 : 0.96, flip: a.flip, armF: 40 + serve * 40, armB: 30 + serve * 20, head: 6 + serve * 6, blink: blinkAt(time, a.i + 3) });
      });
      sparks.forEach((sp, i) => {
        const k = bump(t, 1.45 + i * 0.1, 1.95 + i * 0.1);
        pose(sp, { x: 700 + i * 110, y: 460 - (i % 2) * 60, s: k, r: time * 50, o: k });
      });

      S.cam.z = 1.03 + es(t, 1.0, 1.5) * 0.04;
      S.cam.y = 30;
      S.cam.x = lerp(-10, 10, es(t, 0.2, 1.2));
    };
  },
};
