// Mt 27,62–65 — the next day, the Sabbath after the Preparation: Pilate's hall in a pale morning light, a little
// plate with two lit Sabbath candles on the fly-lines. The chief priests and Pharisees come in together to Pilate.
// "Sir, that deceiver said: After three days I will rise" — three small day-discs, the third one bright. "Order the
// tomb to be made secure until the third day, lest his disciples come and steal him away" — in their bubble the
// tomb in the rock with two small shadows creeping to it; "and the last deception be worse than the first" — two
// grey slips, the second much bigger. Pilate waves to two of his soldiers: "You have a guard; go, make it as secure
// as you can." They step forward.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { tombIcon } from '../mark16/lib.js';
import { kf, moving, hand, headAt, speech, GLYPH, candle, strip, priest, pharisee, soldier, pilate, taunt, romanHelmet, waxSeal, hallSet, lampSet, hanging, swing, shadowPerson, tr, INK, PI } from './lib.js';

const GY = 690;

/** a grey slip of paper with a scrawl (a lie); origin centre */
function slip(c, w) {
  const s = sheet().p(c.cut([[-w / 2, -w * 0.28], [w / 2, -w * 0.3], [w / 2 + 1, w * 0.28], [-w / 2 - 1, w * 0.3]], 0.5, 5), '#a9a6ae');
  let d = '';
  for (let i = 0; i < 3; i++) d += c.ribbon([[-w * 0.38, -w * 0.14 + i * w * 0.14], [w * (0.3 - (i === 2 ? 0.2 : 0)), -w * 0.14 + i * w * 0.14]], Math.max(1, w * 0.03));
  return s.x(d, '#34313a', 'opacity=".6"').out();
}

export default {
  id: 'mt27-request',
  beats: [
    { v: 62 },
    { v: 63 },
    { v: 64, text: 'Każ więc zabezpieczyć grób aż do trzeciego dnia, żeby przypadkiem nie przyszli jego uczniowie, nie wykradli Go i nie powiedzieli ludowi: "Powstał z martwych".' },
    { v: 64, cont: true, text: 'I będzie ostatnie oszustwo gorsze niż pierwsze».' },
    { v: 65 },
  ],
  cam: { x: [-40, 200], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const H = hallSet(S);
    const P = H.charL;
    const pil = S.puppet(P.add(pilate(c, { pose: 'sit' })));
    const lords = [
      { el: priest(c, 0), x: 820 }, { el: person(c, pharisee(c, 0)), x: 740 }, { el: priest(c, 1), x: 660 }, { el: person(c, pharisee(c, 1)), x: 580 },
    ].map((l, i) => ({ ...l, i, p: S.puppet(P.add(l.el)), seed: c.rr(0, 9) }));
    const sols = [0, 1].map((i) => ({ i, p: S.puppet(P.add(soldier(c, i + 2))) }));
    const fx = H.fxL;
    // the Sabbath plate: two lit candles
    const plateL = S.layer({ par: 0.2, sh: 5 });
    const plate = hanging(plateL, `${sheet().p(c.cut(c.rect(-100, 0, 200, 140), 0.5, 7), C.parchment).out()}<g transform="translate(-26 112)">${candle(c, 40)}</g><g transform="translate(26 112)">${candle(c, 40)}</g><g transform="translate(0 162)">${strip(c, tr('szabat', 'the Sabbath'), { size: 17 })}</g>`, { x: 0, y: -1500, len: 900 });
    // v63: "after three days I will rise"
    const day = (k, lit) => `<g transform="translate(${k * 34 - 34} 0)"><circle r="${lit ? 22 : 0}" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 12, 16), 0.3, 3)}" fill="${lit ? C.sun : C.stone2}"/><text x="0" y="5" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="13" fill="${C.ink}">${k + 1}</text></g>`;
    const three = fx.add(`<g>${taunt(c, tr('„Po trzech dniach powstanę”', '“After three days I will rise”'), { size: 18, side: 1 })}</g>`);
    const days = fx.add(`<g>${day(0, false)}${day(1, false)}${day(2, true)}</g>`);
    // v64a: the tomb, and shadows creeping to it
    const thief = (x) => `<g transform="translate(${x} 22) scale(.16)">${shadowPerson(c, { hairStyle: 'short' }, INK)}</g>`;
    const secure = fx.add(`<g>${speech(c, `<g transform="translate(-10 10) scale(1.2)">${tombIcon(c)}</g>${thief(34)}${thief(48)}<g transform="translate(-40 -16)">${GLYPH.bang(c)}</g>`, { w: 130, h: 90 })}</g>`);
    const risen = fx.add(`<g>${taunt(c, tr('„Powstał z martwych”', '“He is risen”'), { size: 16, side: -1 })}</g>`);
    // v64b: the last deception worse than the first
    const worse = fx.add(`<g>${speech(c, `<g transform="translate(-30 6)">${slip(c, 26)}</g><path d="${c.poly([[-12, 0], [-2, -5], [-2, 5]])}" fill="${C.inkSoft}" transform="translate(4 4) scale(-1 1)"/><g transform="translate(26 2)">${slip(c, 52)}</g>`, { w: 120, h: 70 })}</g>`);
    // v65: "you have a guard"
    const guardB = fx.add(`<g>${speech(c, `<g transform="translate(-18 14) scale(.9)">${romanHelmet(c)}</g><g transform="translate(22 0)">${waxSeal(c, 14, 'eagle')}</g>`, { w: 96, h: 64, flip: true })}</g>`);

    return (t, time) => {
      const T = time;
      H.lamps.forEach((l) => lampSet(l, 0, T));
      pose(H.orb, { x: 680, y: 400 - es(t, 0, 5) * 90 });
      pose(H.cl, { x: 610 + Math.sin(T * 0.1) * 20, y: 250 });
      H.sk.blend(H.pal, ['#b7cbd0', '#efdcc0', '#f6e0c0'], 0.6 + es(t, 0, 5) * 0.3);
      const pk = es(t, 0.05, 0.4) * (1 - es(t, 1.0, 1.3));
      swing(plate, 980, 150 - (1 - pk) * 700, T, 1, 0.7);

      /* v62 — they gather to Pilate */
      lords.forEach((l) => {
        const K = [[-0.2, [l.x - 520, GY + (l.i % 2) * 6]], [0.6 + l.i * 0.05, [l.x, GY + (l.i % 2) * 6]]];
        const [x, y] = kf(t, K);
        const speak = l.i === 0 ? bump(t, 1.05, 1.9) + bump(t, 2.05, 2.9) + bump(t, 3.05, 3.9) : l.i === 1 ? bump(t, 1.1, 1.9) + bump(t, 2.1, 2.9) : 0;
        l.p.set({ x, y, s: 0.98, flip: false, walk: moving(t, K) ? x * 0.05 : undefined, armF: 20 + speak * 60 + bump(t, 0.6, 1.0) * 20, armB: 10 + speak * 30, head: -4 - bump(t, 0.6, 1.0) * -10, lean: bump(t, 0.6, 1.0) * 10, blink: blinkAt(T, l.seed) });
      });
      const [h0x, h0y] = headAt(820, GY, 0.98, false);
      const [h1x, h1y] = headAt(740, GY + 6, 0.98, false);
      /* v63 — "after three days I will rise" */
      const k3 = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(three, { x: h0x + 20, y: h0y - 30, s: k3, o: k3 > 0.02 ? 1 : 0 });
      const kd = es(t, 1.35, 1.6, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(days, { x: h0x + 150, y: h0y - 190, s: kd * 1.7, o: kd > 0.02 ? 1 : 0 });
      /* v64a — secure the tomb */
      const ks = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(secure, { x: h0x + 20, y: h0y - 20, s: ks * 1.35, o: ks > 0.02 ? 1 : 0 });
      const kr = es(t, 2.45, 2.7, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(risen, { x: h1x - 20, y: h1y - 30, s: kr, o: kr > 0.02 ? 1 : 0 });
      /* v64b — worse than the first */
      const kw = es(t, 3.1, 3.35, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(worse, { x: h0x + 20, y: h0y - 20, s: kw * 1.35, o: kw > 0.02 ? 1 : 0 });

      /* v65 — "You have a guard" */
      const wave = es(t, 4.05, 4.3);
      pil.set({ x: 1116, y: 566, s: 1, flip: true, armF: 30 + wave * 60 + bump(t, 1.1, 3.9) * 10, armB: 10 + wave * 40, head: -4 - bump(t, 1.2, 3.9) * 4 + wave * 4, blink: blinkAt(T, 1) });
      const [phx, phy] = headAt(1116, 566, 1, true, 62);
      const kg = es(t, 4.1, 4.35, ease.back);
      pose(guardB, { x: phx - 24, y: phy - 20, s: kg, o: kg > 0.02 ? 1 : 0 });
      sols.forEach((s) => {
        const K = [[4.2 + s.i * 0.08, [1480 + s.i * 90, GY - 10 + s.i * 8]], [4.7 + s.i * 0.08, [980 + s.i * 90, GY - 10 + s.i * 8]]];
        const [x, y] = kf(t, K);
        s.p.set({ x, y, s: 0.98, flip: true, walk: moving(t, K) ? x * 0.06 : undefined, armF: 34, armB: 8 + bump(t, 4.6, 5.0) * 40, blink: blinkAt(T, 5 + s.i) });
      });

      S.cam.x = 40 + es(t, 0.8, 1.2) * 20 + es(t, 3.9, 4.3) * 60;
      S.cam.y = 10 + es(t, 0.8, 1.2) * 20;
      S.cam.z = 1.02 + es(t, 0.8, 1.2) * 0.05;
      if (S.portrait) S.cam.x += 60;
    };
  },
};
