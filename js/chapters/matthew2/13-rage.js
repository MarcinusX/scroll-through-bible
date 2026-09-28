// Mt 2,16 — a messenger brings word to the palace: the Magi have gone home by another road. Herod sees he has been
// tricked; in a terrible rage he tears their star chart in two, and the sky over the hall turns red. Then a shadow
// screen comes down: dark soldiers march to Bethlehem and its villages, the lit windows go out one by one, and
// where the soldiers have passed there are only empty cradles. Nothing more is shown.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, attr, fade } from '../../core/anim.js';
import {
  LOOK, ANGER, HY, palaceSet, herodPuppet, noble, speech, chartHalf, camelRider, crossX, soldierSil, shadowScreen, cradle,
  headAt, vpose, kf, INK, tr, PI,
} from './lib.js';

const SW = 760, SH = 330, SY = 110;       // the shadow screen (top at SY)

export default {
  id: 'mt2-rage',
  beats: [
    { v: 16, text: 'Wtedy Herod widząc, że go Mędrcy zawiedli, wpadł w straszny gniew.' },
    { v: 16, cont: true, text: 'Posłał [oprawców] do Betlejem i całej okolicy i kazał pozabijać wszystkich chłopców w wieku do lat dwóch, stosownie do czasu, o którym się dowiedział od Mędrców.' },
  ],
  cam: { x: [-40, 40], y: [0, 80], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    const set = palaceSet(S, { skyCols: ANGER });
    const red = S.layer({ par: 0.2, sh: 0, flat: true });
    red.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.curtain2}" opacity=".22"/>`);

    const act = S.layer({ par: 0.55, sh: 5 });
    const msgr = S.puppet(act.add(person(c, { ...LOOK.messenger })));
    const hEl = act.add(herodPuppet(c, {}));
    const herod = S.puppet(hEl);
    const angry = hEl.querySelector('[data-part="angry"]');
    const halves = [-1, 1].map((d) => ({ d, el: act.add(`<g>${chartHalf(c, d, 150, 104)}</g>`) }));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const news = fx.add(`<g>${speech(c, `<g transform="translate(-20 26) scale(.3) scale(-1 1)">${camelRider(c, 0)}</g><g transform="translate(34 -4)">${crossX(c, 18)}</g>`, { w: 120, h: 80 })}</g>`);
    const rage = [0, 1, 2, 3, 4].map(() => fx.add(`<g><path d="${c.cut(c.star(0, 0, 16, 5, 4, 0.3), 0.3, 3)}" fill="${C.terracotta}"/></g>`));

    /* the shadow screen */
    const scrL = S.layer({ par: 0.4, sh: 7 });
    const town = (() => {
      const s = sheet();
      const pts = [[SW / 2 - 330, SH], [SW / 2 - 320, SH - 40]];
      [[-320, 60, 50], [-270, 40, 76], [-220, 56, 60], [-170, 44, 90], [-120, 60, 56], [-70, 40, 70]].forEach(([x, w, h]) => pts.push([SW / 2 + x, SH - h], [SW / 2 + x + w, SH - h]));
      pts.push([SW / 2, SH - 40], [SW / 2, SH]);
      s.p(c.cut(pts, 0.5, 6), INK);
      return s.out(false);
    })();
    const screen = scrL.add(`<g>${shadowScreen(c, SW, SH)}<path d="${c.cut([[-SW / 2, SH], [-SW / 2, SH - 26], [SW / 2, SH - 34], [SW / 2, SH]], 0.5, 8)}" fill="${INK}"/><g>${town}</g></g>`);
    const wins = [[-290, 40], [-250, 60], [-196, 50], [-150, 70], [-104, 48], [-54, 50]].map(([x, h], i) => ({ i, el: scrL.add(`<g><path d="${c.poly(c.rect(0, 0, 10, 12))}" fill="${C.lampFlame}"/></g>`), x: SW / 2 + x, h }));
    const march = scrL.add(`<g>${[0, 1, 2, 3].map((i) => `<g transform="translate(${-i * 70} ${i % 2 ? 4 : 0}) scale(.62)">${soldierSil(c, i)}</g>`).join('')}</g>`);
    const cradles = [0, 1, 2].map((i) => scrL.add(`<g>${cradle(c, 70)}</g>`));

    return (t, time) => {
      const T = time;
      const fury = es(t, 0.45, 0.7);
      set.update(T, { wild: fury });
      red.fade(fury);

      /* v16a — word comes: the Magi have gone another way; Herod rages and tears the chart */
      const mx = kf(t, [[-0.2, 240], [0.2, 600]], ease.out);
      msgr.set({ x: mx, y: HY + 24, s: 0.9, walk: t < 0.2 ? mx * 0.07 : undefined, armF: bump(t, 0.15, 0.55) * 70, lean: bump(t, 0.5, 0.9) * -10, blink: blinkAt(T, 3), o: 1 - es(t, 1.0, 1.2) });
      const nk = es(t, 0.15, 0.28, ease.back) * (1 - es(t, 0.5, 0.58));
      vpose(news, { x: 650, y: HY - 190, s: nk, o: nk > 0.01 ? 1 : 0 });
      const tear = es(t, 0.45, 0.6);
      const stamp = Math.abs(Math.sin(T * 9)) * fury * (1 - es(t, 1.0, 1.2));
      herod.set({ x: 808, y: HY - 30 - stamp * 5, s: 1.08, flip: true, armF: 70 + tear * 60 - es(t, 1.0, 1.3) * 60, armB: 60 + tear * 70 - es(t, 1.0, 1.3) * 20, head: -tear * 12, lean: -fury * 6, blink: 0 });
      attr(angry, 'opacity', fury.toFixed(2));
      halves.forEach((h) => {
        const k = es(t, 0.48, 0.8, ease.out);
        vpose(h.el, { x: 760 + h.d * (4 + k * 110), y: HY - 150 + k * k * 50, r: h.d * k * 40, s: 0.9, o: t < 1.05 ? 1 : 1 - es(t, 1.05, 1.2) });
      });
      rage.forEach((r, i) => {
        const k = bump(t, 0.5 + i * 0.04, 1.0), a = -PI / 2 + (i - 2) * 0.5;
        const [hx, hy] = headAt(808, HY - 30, 1.08, true);
        vpose(r, { x: hx + Math.cos(a) * 60, y: hy + Math.sin(a) * 50, s: k, r: T * 60, o: k > 0.02 ? 1 : 0 });
      });

      /* v16b — the shadow play: soldiers sent to Bethlehem; the lights go out; empty cradles */
      const sk = es(t, 1.05, 1.35, ease.out);
      pose(screen, { x: 800, y: lerp(-600, SY, sk), o: sk > 0.001 ? 1 : 0 });
      const go = es(t, 1.3, 2.1, (u) => u);
      pose(march, { x: 800 - SW / 2 + 60 + go * 400, y: SY + SH - 26 - Math.abs(Math.sin(go * 40)) * 3, o: sk * (1 - es(t, 2.2, 2.5)) });
      wins.forEach((w) => {
        const out = es(t, 1.7 + w.i * 0.08, 1.8 + w.i * 0.08);
        vpose(w.el, { x: 800 + w.x - 8, y: SY + SH - w.h + 14, o: sk * (1 - out) });
      });
      cradles.forEach((cr, i) => {
        const k = es(t, 2.15 + i * 0.1, 2.4 + i * 0.1);
        vpose(cr, { x: 800 - 160 + i * 110, y: SY + SH - 30, s: 0.9, o: k });
      });

      S.cam.z = 1.02 + es(t, 0.3, 0.7) * 0.1 - es(t, 1.0, 1.4) * 0.1;
      S.cam.y = 40 - es(t, 1.0, 1.4) * 30;
      S.cam.x = 0;
    };
  },
};
