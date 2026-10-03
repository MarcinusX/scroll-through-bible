// Łk 20,47 — "They devour widows' houses, and for a pretence make long prayers": on the market-street flat a widow in
// grey stands by her little house with its lamp in the window; the scribe beside her holds up his hands in prayer —
// and while his prayer unrolls down to the ground on a long, long scroll, her little house shrinks and slides into the
// fat purse at his belt, and she is left with empty hands. "These will receive the greater condemnation": the flat goes
// up; the scales of judgement come down over the court, the heavy purse and the long prayer on the one pan sinking it
// deep, a dark cloud gathering over the scribes, who bow their heads — and on the left the widow, small and grey, comes
// into the court (where, in the next chapter, she will give her two small coins).
import { C, person, blinkAt, pose, lerp, sheet, mix, shade } from '../kit.js';
import { courtSet, CQ, scribeOpts, WIDOW, panel, panelSky, panelGround, littleHouse, longScroll, purse, scalesParts, poseScales, stormCloud, popAt, dropIn, kf, tr, es, ease, bump, seg } from './lib.js';

const PW = 420, PH = 220, PX = 800, PY = 300, GY = 84;
const SC = scribeOpts(0);

function streetInner(S, c) {
  let m = panelSky(S, PW, PH, ['#d8dcd2', '#f2e2c2']);
  const s = sheet();
  let hs = '', wins = '';
  for (let x = -PW / 2 - 10; x < PW / 2; x += 90) { const h = 70 + ((x * 11) % 40 + 40) % 40; hs += c.cut(c.rect(x, 40 - h, 84, h + 50), 0.4, 6); wins += c.cut(c.rect(x + 32, 50 - h, 14, 18), 0.2, 3); }
  s.p(hs, mix(C.plaster2, C.sand, 0.35)).x(wins, mix(C.soilDark, C.plaster2, 0.5));
  m += s.out() + panelGround(c, PW, GY - 6, mix(C.sand, C.stone, 0.45), 2);
  return m;
}

export default {
  id: 'lk20-widows',
  beats: [
    { v: 47, text: 'Objadają oni domy wdów i dla pozoru długo się modlą.' },
    { v: 47, cont: true, text: 'Ci tym surowszy dostaną wyrok».' },
  ],
  cam: { x: [-60, 40], y: [-80, 30], z: [1, 1.1] },
  build(S) {
    const Q = courtSet(S, { opp: [scribeOpts(0), scribeOpts(1), scribeOpts(2)] });
    const c = Q.c;
    const pan = Q.flyL.add(panel(S, streetInner(S, c), { w: PW, h: PH, word: tr('domy wdów', 'widows’ houses') }));
    const house = Q.flyL.add(`<g>${littleHouse(c, 70, 56)}</g>`);
    const scroll = Q.flyL.add(`<g>${longScroll(c, 84, 26)}</g>`);
    const scribe = S.puppet(Q.flyL.add(person(c, { ...SC, holdF: '', holdB: `<g transform="translate(0 -4) scale(.9)">${purse(c)}</g>` })));
    const widow = S.puppet(Q.flyL.add(person(c, { ...WIDOW })));
    const sp = scalesParts(c, { arm: 110, drop: 70 });
    const sc = { frame: Q.flyL.add(`<g>${sp.frame}</g>`), beam: Q.flyL.add(`<g>${sp.beam}</g>`), panL: Q.flyL.add(`<g>${sp.pan}<g transform="translate(-10 ${sp.drop - 2}) scale(.9)">${purse(c)}</g><g transform="translate(18 ${sp.drop - 34}) scale(.3 .2)">${longScroll(c, 150, 30)}</g></g>`), panR: Q.flyL.add(`<g>${sp.pan}<g transform="translate(0 ${sp.drop}) scale(.5)">${littleHouse(c, 70, 56)}</g></g>`) };
    const cloud = Q.W.add(`<g>${stormCloud(c, 300)}</g>`);
    const widow2 = S.puppet(Q.act.add(person(c, { ...WIDOW })));

    return (t, time) => {
      const T = time;
      /* v47a — the house into his purse; the long prayer */
      const pk = dropIn(pan, t, 0.02, 1.3, PX, PY, { d: 0.2 });
      const py = lerp(-1500, PY, pk), on = pk > 0.002 ? 1 : 0;
      const pray = es(t, 0.2, 0.35);
      scribe.set({ x: PX - 60, y: py + GY + 4, s: 0.56, armF: 20 + pray * 70, armB: 20 + pray * 60, head: -pray * 16, lean: -pray * 4, blink: blinkAt(T, 3), o: on });
      const eat = es(t, 0.3, 0.6, ease.in);
      pose(house, { x: lerp(PX + 120, PX - 80, eat), y: py + GY + lerp(0, -40, eat), s: lerp(1, 0.08, eat), o: on * (eat < 0.98 ? 1 : 0) });
      const un = es(t, 0.4, 0.7);
      pose(scroll, { x: PX - 60 + 34, y: py + GY - 90, sy: Math.max(0.03, un), o: on * (un > 0.01 ? 1 : 0) });
      const lost = es(t, 0.55, 0.7);
      widow.set({ x: PX + 175, y: py + GY + 4, s: 0.54, flip: true, armF: 20 + lost * 60, armB: 10 + lost * 40, head: lost * 14, blink: blinkAt(T, 5), o: on });
      /* v47b — the scales of judgement; the cloud; the widow comes into the court */
      const sk = es(t, 1.1, 1.4, ease.out);
      const tilt = es(t, 1.4, 1.65, ease.back) * 16;
      poseScales(sc, CQ.JX, lerp(-1500, S.portrait ? 330 : 130, sk), -tilt, sk > 0.002 ? 1 : 0, 1, 110);
      const ck = es(t, 1.4, 1.7);
      pose(cloud, { x: (S.portrait ? 990 : 1090) + (T ? Math.sin(T * 0.4) * 6 : 0), y: lerp(-400, S.portrait ? 390 : 250, ck), s: 0.55, o: ck > 0.01 ? 1 : 0 });
      const wi = es(t, 1.35, 1.8);
      const wx = S.portrait ? lerp(300, 480, wi) : lerp(200, 390, wi);   // phone: the widow comes in on the screen
      widow2.set({ x: wx, y: CQ.FEET + 10, s: 0.9, walk: wi > 0 && wi < 1 ? wx * 0.05 : undefined, head: 8, armF: 10, blink: blinkAt(T, 7), o: wi > 0 ? 1 : 0 });
      const bowd = es(t, 1.6, 1.8);
      Q.pose(t, T,
        { armF: 16 + bump(t, 0.1, 0.9) * 40, armB: 8, head: -bump(t, 0.1, 1.1) * 8, blink: blinkAt(T, 2) },
        (d) => ({ head: -4 - bump(t, 0.1, 1.1) * 10, blink: blinkAt(T, d.seed) }),
        (m) => ({ head: -bump(t, 0.1, 1.1) * 8 + bowd * 18, lean: bowd * 6, blink: blinkAt(T, m.seed) }));
      Q.amaze(0);
      void seg; void shade; void popAt; void tr;

      S.cam.x = kf(t, [[0, 0], [1.2, 0], [1.6, -10]]);
      S.cam.y = kf(t, [[0, -50], [1.1, -50], [1.5, -40]]);
      S.cam.z = 1.02;
    };
  },
};
