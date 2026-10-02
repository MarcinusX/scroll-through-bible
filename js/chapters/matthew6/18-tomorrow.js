// Mt 6,34 — evening on the mountain; the sun is low over the lake. Two day-discs hang from the flies: today, lit, and
// tomorrow, still dark. A worry-cloud rises from the listeners towards tomorrow — Jesus lifts His hand, and the cloud
// is hooked onto tomorrow's disc instead: tomorrow will take care of itself. "Each day has enough trouble of its own":
// today's disc carries one small bundle of its own; the sun goes down behind the hills, and the day's disc glows and
// dims with it.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { mount, mountFront, worryCloud, dayDisc, GOLDEN, DUSK, tr, PI } from './lib.js';

const TX = 640, NX = 960;     // today's and tomorrow's discs

/** a small bundle tied in cloth (origin: its knot) */
function bundle(c, col = mix(C.wood3, C.stone2, 0.4)) {
  return sheet().p(c.cut([[-24, 8], [-20, 30], [0, 36], [20, 30], [24, 8], [10, 2], [-10, 2]], 0.6, 5), col).p(c.cut([[-8, 4], [0, -6], [8, 4]], 0.3, 3), shade(col, -0.2)).out();
}

export default {
  id: 'mt6-tomorrow',
  beats: [
    { v: 34, text: 'Nie troszczcie się więc zbytnio o jutro, bo jutrzejszy dzień sam o siebie troszczyć się będzie.' },
    { v: 34, cont: true, text: 'Dosyć ma dzień swojej biedy.' },
  ],
  cam: { x: [-30, 30], y: [-80, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // on a phone the closing card covers more of the sky: hang the discs higher there
    const TY = S.portrait ? -10 : 170, NY = S.portrait ? -30 : 150;
    const SUNX = S.portrait ? 1015 : 1150;   // phone: the setting sun inside the screen, not under the thread
    const M = mount(S, { skyCols: GOLDEN, sky2: DUSK, sunAt: [SUNX, 300] });
    const dusk = M.sky2;

    /* the discs */
    const dayL = S.layer({ par: 0.1, sh: 5 });
    const today = hanging(dayL, `${dayDisc(c, tr('dziś', 'today'), 34)}<g transform="translate(0 44)">${bundle(c)}</g>`, { x: 0, y: 0, len: 1100 });
    const tomorrow = hanging(dayL, dayDisc(c, tr('jutro', 'tomorrow'), 34), { x: 0, y: 0, len: 1100 });
    const tLit = today.querySelector('.lit'), tOff = today.querySelector('.off');
    const cloudEl = dayL.add(`<g>${worryCloud(c, 100)}</g>`);
    const hook = dayL.add(`<path d="M0 0V60" stroke="rgba(74,54,34,.6)" stroke-width="1.4" fill="none"/>`);

    mountFront(S);

    return (t, time) => {
      const T = time;
      /* the sun goes down (v34b) */
      const set = es(t, 1.05, 1.8);
      dusk.fade(set * 0.9);
      M.update(T, { sunY: lerp(300, 440, set), sunX: SUNX });
      const lift = es(t, 0.35, 0.6) * (1 - es(t, 1.6, 1.9));
      M.jesus.set({ x: M.JX, y: M.JY, s: 0.92, armF: 20 + lift * 60, armB: 10 + lift * 110, head: -lift * 10, blink: blinkAt(T) });
      M.listen(T, (d) => ({ head: (d.flip ? 3 : -3) - 10 + set * 8, armF: 16 + (d.i % 3) * 8, blink: blinkAt(T, d.seed) }));

      const dk = es(t, 0.0, 0.25, ease.out);
      pose(today, { x: TX, y: lerp(-400, TY, dk), r: T ? Math.sin(T * 0.7) * 1.4 : 0, o: dk > 0.01 ? 1 : 0 });
      pose(tomorrow, { x: NX, y: lerp(-400, NY, dk), r: T ? Math.sin(T * 0.7 + 1) * 1.4 : 0, o: dk > 0.01 ? 1 : 0 });
      fade(tLit, dk * (1 - set * 0.7)); fade(tOff, 1 - dk * (1 - set * 0.7));

      /* v34a — the worry rises from them, and is hung on tomorrow instead */
      const rise = es(t, 0.15, 0.45);
      const toTom = es(t, 0.5, 0.8, ease.io);
      const cx = lerp(lerp(700, 760, rise), NX, toTom), cy = lerp(lerp(560, 380, rise), NY + 110, toTom);
      pose(cloudEl, { x: cx, y: cy + (T ? Math.sin(T * 0.9) * 3 : 0), s: 0.8 + rise * 0.2, o: rise > 0.01 ? 1 : 0 });
      pose(hook, { x: NX, y: NY + 34, sy: toTom > 0.98 ? 1 : 0, o: toTom > 0.98 ? 1 : 0 });

      S.cam.z = 1.02 + es(t, 0.0, 0.6) * 0.02;
      S.cam.y = -40 - es(t, 1.0, 1.6) * 20;
    };
  },
};
