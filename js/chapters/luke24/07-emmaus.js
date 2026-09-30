// Łk 24,13–14 — That same day, afternoon: two of them go out from Jerusalem (on its hill at the left) along the
// road through the hills. A signpost at the roadside: Emmaus, sixty stadia. As they walk they talk over everything
// that has happened — their words in bubbles with little pictures: the cross on its hill, the open tomb, the women's
// story of the angels.
import { C, blinkAt, pose, lerp } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { AFTERNOON, emmausSet, RD, roadTrio, headAt, speech, crossHill, tombIcon, angelIcon, signpost24, strip, kf, moving, tr } from './lib.js';

const GY = RD.GY;
const GK = [[-0.2, 250], [1.0, 560], [1.95, 820]];   // the middle of the pair

export default {
  id: 'lk24-emmaus',
  beats: [
    { v: 13 },
    { v: 14 },
  ],
  cam: { x: [-600, 60], y: [0, 40], z: [0.96, 1.08] },
  build(S) {
    const c = S.c;
    const E = emmausSet(S, { skyCols: AFTERNOON, sunAt: [1250, 150] });
    const sign = E.act.add(`<g transform="translate(960 ${GY + 8})">${signpost24(c, tr('Emaus', 'Emmaus'))}</g>`);
    const dist = E.act.add(`<g>${strip(c, tr('60 stadiów', '60 stadia'), { size: 15 })}</g>`);
    const R = roadTrio(S, E.act, E.fx, { stranger: false });
    const talk = [
      { who: 1, inner: `<rect x="-30" y="-26" width="60" height="44" fill="${C.dusk}" opacity=".5"/><g transform="translate(0 18) scale(.5)">${crossHill(c)}</g>` },
      { who: 0, inner: `<g transform="translate(0 14) scale(.95)">${tombIcon(c, { open: true })}</g>` },
      { who: 1, inner: `<g transform="translate(0 12) scale(.85)">${angelIcon(c)}</g>` },
    ].map((b, i) => ({ ...b, i, el: E.fx.add(`<g>${speech(c, b.inner, { w: 78, h: 64, flip: b.who === 1 })}</g>`) }));
    void sign;

    return (t, T) => {
      E.update(T);
      pose(dist, { x: 1010, y: GY - 60, r: -3 });
      fade(dist, 1);
      const gx = kf(t, GK, ease.sine);
      const going = moving(t, GK, 0.2);
      const chat = es(t, 1.05, 1.3);
      const pos = [gx - 60, gx + 60];
      [R.fr, R.cl].forEach((m, i) => {
        const x = pos[i];
        const say = i === 1 ? bump(t, 1.05, 1.45) + bump(t, 1.65, 1.95) : bump(t, 1.35, 1.7);
        const turn = chat > 0.5 && i === 1 && say > 0.3;
        m.p.set({ x, y: GY + (i ? 4 : -2), s: 1.05, flip: turn, walk: going ? x * 0.05 + i * 2 : undefined, amt: 0.9, armF: 22 + say * 50, armB: 10 + say * 30 + (i === 0 ? bump(t, 0.2, 0.9) * 20 : 0), head: -chat * 4 + (i === 0 ? -say * 6 : 6 * say), blink: blinkAt(T, i * 3) });
        fade(m.sad, 0.6 + chat * 0.3);
      });
      talk.forEach((b) => {
        const k = es(t, 1.05 + b.i * 0.28, 1.2 + b.i * 0.28, ease.back) * (1 - es(t, 1.35 + b.i * 0.28, 1.45 + b.i * 0.28));
        const last = b.i === 2 ? es(t, 1.62, 1.75, ease.back) : 0;
        const kk = Math.max(k, last);
        const [hx, hy] = headAt(pos[b.who], GY, 1.05, b.who === 1);
        pose(b.el, { x: hx + (b.who ? -14 : 14), y: hy - 30, s: kk, o: kk > 0.01 ? 1 : 0 });
      });

      S.cam.x = Math.max(-600, Math.min(40, (gx - 800) * 2 * 0.9));
      S.cam.y = 24;
      S.cam.z = S.portrait ? 0.98 : 1.04;
      void lerp; void seg;
    };
  },
};
