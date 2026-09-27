// Mk 16,9 — Early on the first day of the week. Mary Magdalene weeps in the garden, her back to the
// empty tomb. Light gathers and the Risen One stands among the flowers. She turns, kneels, reaching out;
// He holds out his hand to her. Seven dark wisps — the seven demons He once drove out of her — are shown
// for a moment, then flee, and seven roses open where they were.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { sun, cloud, flowers } from '../../assets/nature.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, gardenSet, DOOR, STONE, headAt, withFace, faceBits, glory, wisp, sparkle, skyKeys, heart, PI } from './lib.js';

const ROSE = [mix(C.duskViolet, C.skyBlue2, 0.45), mix(C.dusk, C.peach, 0.4), C.dawn];
const GOLD = [C.skyBlue, mix(C.dawn, C.skyBlue, 0.3), '#f8e6bd'];
const GY = 716;
const JX = 900, MX = 690;

export default {
  id: 'm16-magdalene',
  beats: [
    { v: 9, text: 'Po swym zmartwychwstaniu, wczesnym rankiem w pierwszy dzień tygodnia,' },
    { v: 9, cont: true, text: 'Jezus ukazał się najpierw Marii Magdalenie,' },
    { v: 9, cont: true, text: 'z której wyrzucił siedem złych duchów.' },
  ],
  cam: { x: [120, 240], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ROSE);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 54, { rays: C.sunDeep }), { x: 700, y: 330, len: 900 });
    const cl = hanging(hangL, cloud(c, 170), { x: 1180, y: 170, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 210, speed: 45, scale: 0.5 });

    const G = gardenSet(S);
    const L = G.walkL;
    // the Risen One: light, then Jesus among the flowers
    const gl = L.add(`<g opacity="0">${glory(c, 190, 18)}</g>`);
    const bloomsAt = [-70, -40, -10, 25, 55, 80].map((dx, i) => ({ dx, el: L.add(`<g>${flowers(c, { x0: -8, x1: 8, y: 0, n: 3, h: 20 })}</g>`), i }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    // Mary Magdalene: standing and weeping, then kneeling
    const fb = faceBits(c);
    const mStand = S.puppet(L.add(withFace(person(c, { ...MAGD }), fb)));
    const mKneel = S.puppet(L.add(withFace(person(c, { ...MAGD, pose: 'kneel' }), faceBits(c))));
    const tears = [mStand, mKneel].map((p) => ({ sad: p.el.querySelector('[data-part="sad"]'), tear: p.el.querySelector('[data-part="tear"]') }));
    const love = L.add(`<g>${heart(c, 16, C.jesusMantle)}</g>`);
    // seven wisps and seven roses
    const fx = S.layer({ par: 0.56, sh: 4 });
    const SEVEN = Array.from({ length: 7 }, (_, i) => {
      const a = -PI * 0.95 + (i / 6) * PI * 0.9;
      return { i, a, w: fx.add(`<g>${wisp(c, 1.3, mix(C.storm2, C.plumRobe, 0.3))}</g>`), r: fx.add(`<g>${rose(c)}</g>`), rx: MX - 110 + i * 34 + c.rr(-8, 8), ry: GY + 10 + (i % 2) * 18 };
    });

    function rose(cc) {
      const s = sheet();
      s.p(cc.ribbon([[0, 0], [cc.rr(-3, 3), -26]], 2.2), C.moss);
      s.p(cc.cut(cc.ell(6, -14, 7, 3, 8, -0.5), 0.2, 2), C.leaf);
      s.p(cc.cut(cc.circ(0, -30, 9, 12), 0.4, 3), C.roseRobe);
      s.p(cc.cut(cc.circ(0, -30, 5, 10), 0.3, 2), shade(C.roseRobe, -0.15));
      return s.out();
    }

    return (t, time) => {
      skyKeys(sk, t, [[-0.5, ROSE], [1.2, GOLD]]);
      const rise = es(t, 0, 1.2, ease.out);
      swing(sunEl, 700, lerp(420, 230, rise), time, 0.8, 0.5);
      swing(cl, 1180 + Math.sin(time * 0.1) * 30, 170, time, 1.2, 0.6, 1);
      birds(time, es(t, 0.8, 1.2));
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: 0.7 });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y - 60, o: 0.3 });

      /* v9a: after his rising — light gathers, He stands in the garden */
      const come = es(t, 0.2, 0.75);
      pose(gl, { x: JX, y: GY - 110, s: 0.5 + come * 0.6, r: t * 6, o: come * 0.75 - es(t, 1.4, 2) * 0.3 });
      const bless = es(t, 1.2, 1.5);
      jesus.set({ x: JX, y: GY, s: 1.08, flip: true, o: es(t, 0.35, 0.7), armF: 20 + bless * 50 + bump(t, 2.3, 2.9) * 20, armB: 12 + es(t, 0.4, 0.8) * 30 * (1 - bless), head: -2 + bless * 6, blink: blinkAt(time) });
      bloomsAt.forEach((b) => {
        const k = es(t, 0.5 + b.i * 0.06, 0.75 + b.i * 0.06, ease.back);
        pose(b.el, { x: JX + b.dx, y: GY + 6 + (b.i % 2) * 8, s: k * 1.2, o: k > 0.01 ? 1 : 0 });
      });

      /* v9b: she turns, sees Him, kneels */
      const turn = es(t, 1.05, 1.15);
      const kneel = es(t, 1.35, 1.42);
      const joy = es(t, 1.3, 1.6);
      mStand.set({ x: MX + turn * 10, y: GY, s: 1.04, flip: turn < 0.5, o: 1 - kneel, armF: turn < 0.5 ? 150 - es(t, 0.8, 1.0) * 60 : 40 + joy * 50, armB: 20, head: turn < 0.5 ? 14 : -6, blink: blinkAt(time, 3) });
      mKneel.set({ x: MX + 40, y: GY, s: 1.04, flip: false, o: kneel, armF: 70 + Math.sin(time * 1.2) * 3, armB: 50, head: -10, blink: blinkAt(time, 3) });
      const sadK = 1 - joy;
      tears.forEach((f) => { fade(f.sad, sadK); fade(f.tear, sadK); });
      const [hx, hy] = headAt(MX + 40, GY, 1.04, false, 46);
      const hb = es(t, 1.55, 1.8, ease.back) * (1 - es(t, 2.0, 2.2));
      pose(love, { x: (hx + JX) / 2 + 10, y: hy - 50 - hb * 10, s: hb, o: hb > 0.01 ? 1 : 0 });

      /* v9c: seven dark wisps from long ago — they flee; seven roses open */
      SEVEN.forEach((s) => {
        const show = es(t, 2.02 + s.i * 0.03, 2.2 + s.i * 0.03);
        const flee = es(t, 2.35 + s.i * 0.03, 2.75 + s.i * 0.03, ease.in);
        const bx = hx + Math.cos(s.a) * 110, by = hy + 40 + Math.sin(s.a) * 90;
        pose(s.w, { x: bx + Math.cos(s.a) * flee * 500 + Math.sin(time * 3 + s.i) * 3 * (1 - flee), y: by - flee * 420, s: 0.9 * (1 - flee * 0.5), r: Math.cos(s.a) * flee * 60, o: show * (1 - flee) * 0.85 });
        const k = es(t, 2.5 + s.i * 0.05, 2.75 + s.i * 0.05, ease.back);
        pose(s.r, { x: s.rx, y: s.ry, s: k * 1.1, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = 180 - es(t, 1.8, 2.3) * 40;
      S.cam.y = 30;
      S.cam.z = 1.02 + es(t, 1.0, 1.6) * 0.06 + es(t, 2.0, 2.4) * 0.03;
    };
  },
};
