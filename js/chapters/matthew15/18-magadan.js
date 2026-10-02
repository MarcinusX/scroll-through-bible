// Mt 15,39 — evening at the foot of the mountain, the sun going down over the lake. Jesus stands on the shore and
// lifts His hand over the crowds; they turn and go home over the hillside, group after group, small against the slope.
// The boat waits at the water's edge with the disciples in it; He steps in, and it sails away across the golden water
// towards the far shore, where the little town of Magadan stands with its tower.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, cloud, grass, bush, olive, cypress, rock, town } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { crewBoat } from '../mark8/lib.js';
import { crowdGroup, nameTag, voiceRings, headAt, kf, moving, SUNSET, tr, PI } from './lib.js';

const SHORE = 704;                       // Jesus on the beach
const BOAT0 = { x: 900, y: 648 }, BOAT1 = { x: 1090, y: 600 };

export default {
  id: 'mt15-magadan',
  beats: [
    { v: 39, text: 'Potem odprawił tłumy,' },
    { v: 39, cont: true, text: 'wsiadł do łodzi i przybył w granice Magedan.' },
  ],
  cam: { x: [-40, 90], y: [-20, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const B1 = P ? { x: 1010, y: 600 } : BOAT1;   // phone: the boat and Magadan stay on screen
    sky(S, ['#cdbfd2', '#f0d2b6', '#f6dfbf']);
    const eve = sky(S, SUNSET, { name: 'eve', rise: 0 }).layer;
    eve.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 48, { disc: C.apricot, inner: '#f6d3a3', rays: C.dusk }), { x: 550, y: 290, len: 900 });
    const cl = hanging(hangL, cloud(c, 170, C.blushVeil, '#e6c7c2'), { x: 1060, y: 170, len: 800 });

    /* ---------- the far shore with Magadan and its tower ---------- */
    const far = S.layer({ par: 0.08, sh: 2 });
    const fb = band(c, { y: 452, amps: [12, 5, 2], lens: [1000, 360, 120], color: mix(C.hillFar, C.duskViolet, 0.3) });
    far.add(fb.markup);
    const MGX = P ? 1010 : 1150;
    const MG = { x: MGX, y: fb.fn(MGX) + 10 };
    const tw = sheet().p(c.cut(c.rect(MG.x + 40, MG.y - 64, 26, 66), 0.4, 5), C.stone).p(c.cut([[MG.x + 36, MG.y - 64], [MG.x + 70, MG.y - 64], [MG.x + 53, MG.y - 84]], 0.3, 4), C.roof).out();
    far.add(town(c, { x: MG.x, y: MG.y, n: 6, spread: 170, sc: 0.46 }) + tw);
    const mTag = hanging(far, nameTag(c, tr('Magedan', 'Magdala'), { size: 18 }), { x: MG.x + 20, y: 300, len: 900 });
    const lake = S.layer({ par: 0.12, sh: 1, pad: 40 });
    lake.add(waterBand(c, { y: 476, color: mix(C.lake, C.apricot, 0.22), foamN: 26, bottom: 1700 }).markup);
    const glint = lake.add(`<g><ellipse rx="220" ry="16" fill="#fff1c4" opacity=".55"/></g>`);

    /* ---------- the near shore: the hillside going up on the left, the beach ---------- */
    const hillL = S.layer({ par: 0.35, sh: 3 });
    const hfn = (x) => 520 + Math.max(0, x - 200) * 0.3 + Math.sin(x / 90) * 6;
    hillL.add(sheet().p(c.cut([[-900, 440], [-400, 450], [0, 480], [200, 520], ...Array.from({ length: 20 }, (_, i) => { const x = 200 + i * 30; return [x, hfn(x)]; }), [790, 724], [860, 760], [640, 1300], [-900, 1700]], 1.2, 12), mix(C.hillNear, C.wheat, 0.25)).out());
    hillL.add(olive(c, 110, 500, 0.8) + cypress(c, 320, 560, 110) + grass(c, { x0: -600, x1: 760, y: 560, fn: (x) => (x < 200 ? 480 + x * 0.2 : hfn(x)) + 6, n: 30, h: 12, color: C.moss }));
    // phone: the crowds start further right on the slope (same height above it) and walk a shorter way, so they are seen going
    const hillY = (x) => (x < 200 ? 480 + x * 0.2 : hfn(x));
    const GPX = [300, 420, 520, 600, 470];
    const GR = [[40, 500, 5, 0.38], [230, 540, 5, 0.42], [400, 590, 4, 0.48], [560, 636, 4, 0.54], [330, 620, 3, 0.5]].map(([x, y, n, s], i) => (P ? [GPX[i], y - hillY(x) + hillY(GPX[i]), n, s] : [x, y, n, s])).map(([x, y, n, s], i) => ({ i, x, y, sp: hillL.sprite(crowdGroup('mt15-mg-' + i, n, { s, flip: true, spread: 34, rows: 1 }), x, y) }));
    const beach = S.layer({ par: 0.5, sh: 3 });
    beach.add(sheet().p(c.cut([[-900, SHORE - 20], [640, SHORE - 24], [770, SHORE - 8], [850, SHORE + 26], [820, SHORE + 120], [700, SHORE + 330], [520, 1300], [-900, 1700]], 1, 12), mix(C.sand, C.sand2, 0.4)).out() + sheet().x(c.ribbon([[640, SHORE - 20], [770, SHORE - 4], [846, SHORE + 30], [816, SHORE + 124], [696, SHORE + 334]], 5), C.foam, 'opacity=".7"').out() + rock(c, 260, SHORE + 40, 120, 40, C.rock2) + bush(c, 90, SHORE + 20, 90, C.sage, C.moss));

    /* ---------- Jesus, the boat ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(L, c, { n: 3, r: 30, color: shade(C.ochre, 0.3) });
    const boatL = S.layer({ par: 0.5, sh: 5 });
    const B = crewBoat(S, boatL);
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, -200, 900, 240, C.sage, C.moss) + rock(c, 120, 930, 220, 70, C.rock2));

    return (t, time) => {
      const T = time;
      eve.fade(es(t, 0, 2) * 0.85);
      swing(sunEl, 550, 290 + es(t, 0, 2) * 40, T, 1, 0.6);
      swing(cl, 1060 + (T ? Math.sin(T * 0.1) * 20 : 0), 170, T, 1.2, 0.7, 1);
      pose(glint, { x: 640, y: 520 + es(t, 0, 2) * 20, sx: 1 + (T ? Math.sin(T * 0.8) * 0.05 : 0), o: 0.7 });
      lake.shift(T ? Math.sin(T * 0.4) * 8 : 0, 0);

      /* v39a — He sends the crowds away; they go home over the hillside */
      const bless = es(t, 0.05, 0.25) * (1 - es(t, 0.9, 1.05));
      GR.forEach((g) => {
        const k = es(t, 0.12 + g.i * 0.06, 1.3 + g.i * 0.05, (u) => u);
        const x = g.x - k * (P ? 220 : 380);
        g.sp.set({ x, y: g.y - k * (g.i * 14 + 40), s: 1 - k * 0.3, o: 1 - seg(k, 0.8, 1) });
      });

      /* v39b — into the boat and across the lake */
      const JK = [[1.0, 700], [1.2, 800]];
      const jx = kf(t, JK);
      const inBoat = es(t, 1.2, 1.26);
      jesus.set({ x: jx, y: SHORE - (jx - 700) * 0.4, s: 0.96, walk: moving(t, JK) ? jx * 0.05 : undefined, armF: 16 + bless * 50, armB: 10 + bless * 115, head: bless * -4, o: 1 - inBoat, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(700, SHORE, 0.96, false);
      voice(jhx + 8, jhy + 4, bless, T, { dir: -1 });
      const sail = es(t, 1.25, 2.0, ease.io);
      const bx = lerp(BOAT0.x, B1.x, sail), by = lerp(BOAT0.y, B1.y, sail);
      const bob = T ? Math.sin(T * 1.4) * 2 : 0;
      pose(B.g, { x: bx, y: by + bob, s: lerp(0.66, 0.52, sail), r: T ? Math.sin(T * 1.1) * 1.2 : 0 });
      B.jesus.set({ x: -8, y: -2, s: 0.95, o: inBoat, armF: 20 + es(t, 1.4, 1.7) * 60, armB: 10, head: 0, blink: 0 });
      B.crew.forEach((d) => d.p.set({ x: d.x, y: -2, s: 0.9, flip: d.x > 0, armF: d.k === 'peter' ? es(t, 1.3, 1.5) * 50 : 10, head: 0, blink: 0 }));
      const mt = es(t, 1.35, 1.7, ease.back);
      swing(mTag, MG.x + 20, 300 - (1 - mt) * 900, T, 1.3, 0.8, 2);

      S.cam.x = lerp(-30, 80, es(t, 1.1, 1.9));
      S.cam.y = 20;
      S.cam.z = 1.04;
    };
  },
};
