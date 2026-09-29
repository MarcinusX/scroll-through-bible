// Mt 11,23–24 — a painted flat in two halves: on the left the green shore of the lake with Capernaum, on the right
// the grey salt shore of the Dead Sea with the smoking ruins of Sodom. "Will you be exalted to heaven?": Capernaum
// rises on a pillar of cloud high into the sky — "you will go down to Hades": it drops, the ground opens in a dark pit
// and the town sinks into it. "If the mighty works had been done in Sodom, it would have remained until today": golden
// sparks fall on the ruins, and a Sodom that might have been rises back out of the ash, whole, in a pale light.
// "More tolerable for the land of Sodom": the balance comes down again, and Capernaum's pan sinks.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, cloud, grass, rock } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { cityIcon, sparkle, nameTag, scalesParts, poseScales, strip, kf, KINGDOM, tr, PI } from './lib.js';

const CX = 540, CY = 664;             // Capernaum
const SX = 1130, SY = 664;            // Sodom
const BX = 800, BY = 170, ARM = 190;

/** ruins: broken walls and fallen stones (origin: ground centre) */
function ruins(c, w = 280) {
  const s = sheet();
  const col = mix(C.stone2, C.storm, 0.35);
  s.p(c.cut([[-w / 2, 0], [-w / 2, -60], [-w * 0.4, -80], [-w * 0.34, -40], [-w * 0.2, -46], [-w * 0.16, 0]], 1, 6) + c.cut([[w * 0.05, 0], [w * 0.05, -90], [w * 0.14, -70], [w * 0.2, -104], [w * 0.28, -60], [w * 0.3, 0]], 1, 6), col);
  let st = '';
  for (let i = 0; i < 8; i++) st += c.cut(c.blob(c.rr(-w / 2, w / 2), c.rr(-8, 4), c.rr(8, 16), c.rr(5, 9), 8, 0.25), 0.5, 4);
  s.p(st, shade(col, 0.15));
  return s.out();
}

export default {
  id: 'mt11-capernaum',
  enter: 'fly',
  beats: [
    { v: 23, text: 'A ty, Kafarnaum, czy aż do nieba masz być wyniesione? Aż do Otchłani zejdziesz.' },
    { v: 23, cont: true, text: 'Bo gdyby w Sodomie działy się cuda, które się w tobie dokonały, zostałaby aż do dnia dzisiejszego.' },
    { v: 24 },
  ],
  cam: { x: [-500, 700], y: [-200, 200], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    sky(S, ['#c7d6d8', '#eee4cf', '#f4e2c4']);
    const gold = sky(S, KINGDOM, { name: 'judg', rise: 0 }).layer;
    gold.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1300, y: 140, len: 900 });

    /* far: the lake on the left, the Dead Sea on the right */
    const far = S.layer({ par: 0.12, sh: 2 });
    far.add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.duskViolet, 0.18) }).markup);
    far.add(sheet().p(c.cut([[-1200, 520], [800, 516], [820, 900], [-1200, 900]], 0.6, 12), mix(C.lake, C.skyBlue, 0.2)).p(c.cut([[820, 516], [2800, 520], [2800, 900], [800, 900]], 0.6, 12), mix(C.lake3, C.stone2, 0.55)).out());
    far.add(sheet().p(c.cut([[700, 900], [730, 560], [800, 536], [880, 560], [920, 900]], 1, 8), C.hillMid).out());
    /* the back ground (behind the towns) and the pit */
    const back = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(616, [6, 2], [700, 180]);
    back.add(sheet().p(c.ridge(gfn, -1200, 800, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4)).p(c.ridge(gfn, 800, 2800, 1800, 12, 1), mix(C.sand, C.stone2, 0.4)).out());
    back.add(grass(c, { x0: -900, x1: 760, y: 616, fn: gfn, n: 30, h: 12, color: C.moss }));
    const pit = back.add(`<g><path d="${c.cut(c.ell(0, 0, 220, 26, 28), 1.2, 6)}" fill="${mix(C.night2, C.soilRich, 0.4)}"/><path d="${c.cut(c.ell(0, 4, 170, 16, 24), 0.8, 6)}" fill="${mix(C.night2, C.plumRobe, 0.3)}"/></g>`);
    /* the towns */
    const towns = S.layer({ par: 0.45, sh: 4 });
    const pillar = towns.add(`<g>${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${(i % 2 ? 1 : -1) * 30} ${i * 90 + 40})">${cloud(makeCutter('mt11-cp' + i), 240 - i * 10)}</g>`).join('')}</g>`);
    const cap = towns.add(`<g>${cityIcon(makeCutter('mt11-cap'), 300, { dome: true })}</g>`);
    const capTag = towns.add(`<g>${nameTag(c, tr('Kafarnaum', 'Capernaum'), { size: 20 })}</g>`);
    const sodomR = towns.add(`<g>${ruins(c, 300)}</g>`);
    const smokes = [0, 1, 2].map((i) => towns.add(`<g><path d="${c.cut(c.blob(0, 0, 30, 22, 10, 0.2), 0.6, 5)}" fill="${mix(C.stone2, C.storm, 0.2)}" opacity=".6"/></g>`));
    const sodomGlow = towns.add(`<circle r="220" fill="url(#halo-glow)" opacity="0"/>`);
    const sodom = towns.add(`<g opacity=".85">${cityIcon(makeCutter('mt11-sod'), 240, { wall: mix(C.plaster, C.halo, 0.3), wall2: mix(C.plaster2, C.halo, 0.2) })}</g>`);
    const sodTag = towns.add(`<g>${nameTag(c, tr('Sodoma', 'Sodom'), { size: 20 })}</g>`);
    const sparks = Array.from({ length: 8 }, (_, i) => ({ i, el: towns.add(`<g>${sparkle(c, 12, i % 2 ? C.halo : C.star)}</g>`) }));
    /* the front ground: hides whatever sinks below the surface */
    const front = S.layer({ par: 0.45, sh: 4 });
    const ffn = c.wave(680, [3, 1.5], [600, 170]);
    front.add(sheet().p(c.ridge(ffn, -1200, 800, 1800, 12, 1), mix(C.hillNear, C.moss, 0.2)).p(c.ridge(ffn, 800, 2800, 1800, 12, 1), mix(C.sand, C.stone2, 0.55)).out());
    front.add(grass(c, { x0: -900, x1: 760, y: 680, fn: ffn, n: 40, h: 16, color: C.moss2 }) + rock(c, 1450, 710, 100, 34, C.rock2) + rock(c, 960, 716, 70, 24, C.stone2));

    /* the balance */
    const balL = S.layer({ par: 0.12, sh: 6 });
    const B = scalesParts(c, { arm: ARM, drop: 90, col: mix(C.sun, C.ochre, 0.4) });
    const pan = (inner, label) => `<g>${B.pan}<g transform="translate(0 92) scale(.5)">${inner}</g><g transform="translate(0 132)">${strip(c, label, { size: 17 })}</g></g>`;
    const els = {
      frame: balL.add(`<g>${B.frame}</g>`), beam: balL.add(`<g>${B.beam}</g>`),
      panL: balL.add(pan(cityIcon(makeCutter('mt11-b5'), 110, { wall: mix(C.stone2, C.storm, 0.35), wall2: mix(C.stone2, C.storm, 0.5), dome: true }), tr('Kafarnaum', 'Capernaum'))),
      panR: balL.add(pan(cityIcon(makeCutter('mt11-b6'), 110), tr('ziemia sodomska', 'the land of Sodom'))),
    };

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1300, y: 140, r: T ? Math.sin(T * 0.6) : 0 });

      /* v23a — raised to heaven, brought down to Hades */
      const up = es(t, 0.05, 0.3, ease.out);
      const down = es(t, 0.34, 0.66);
      const cy = CY - up * 400 + down * 560;
      pose(cap, { x: CX, y: cy });
      pose(capTag, { x: CX, y: cy + 12, o: 1 - seg(down, 0.3, 0.5) });
      pose(pillar, { x: CX, y: CY - up * 400 + 4, sy: 1, o: up * (1 - es(t, 0.38, 0.5)) });
      const op = es(t, 0.3, 0.42) * (1 - es(t, 0.95, 1.1) * 0.6);
      pose(pit, { x: CX, y: CY - 2, sx: 0.05 + op * 0.95, o: op > 0.01 ? 1 : 0 });

      /* v23b — Sodom: ruins, the sparks, and the city that would have remained */
      smokes.forEach((sm, i) => {
        const k = T ? (T * 0.15 + i / 3) % 1 : i / 3;
        pose(sm, { x: SX - 60 + i * 60 + k * 30, y: SY - 60 - k * 140, s: 0.6 + k, o: (1 - es(t, 1.4, 1.6)) * Math.sin(k * PI) });
      });
      sparks.forEach((sp) => {
        const k = seg(t, 1.05 + sp.i * 0.03, 1.4 + sp.i * 0.03);
        pose(sp.el, { x: SX - 130 + sp.i * 36, y: lerp(260, SY - 40, k), r: T * 40, s: 1, o: k > 0 && k < 1 ? Math.sin(k * PI) : 0 });
      });
      const rise = es(t, 1.35, 1.7, ease.out);
      pose(sodomR, { x: SX, y: SY + rise * 140 });
      pose(sodom, { x: SX, y: SY + (1 - rise) * 200, o: rise > 0.01 ? 0.9 : 0 });
      pose(sodomGlow, { x: SX, y: SY - 80, s: 0.6 + rise * 0.6, o: rise * 0.8 });
      pose(sodTag, { x: SX, y: SY - 250, o: es(t, 1.0, 1.1) * (1 - es(t, 1.95, 2.05)) });

      /* v24 — the land of Sodom lighter than Capernaum */
      const jd = es(t, 2.02, 2.3);
      gold.fade(jd * 0.9);
      const bk = es(t, 2.05, 2.35, ease.out);
      const tilt = -es(t, 2.35, 2.6, ease.back) * 14;
      poseScales(els, BX, lerp(-600, BY, bk) + (T ? Math.sin(T * 0.8) * 2 : 0), tilt, bk > 0.01 ? 1 : 0, 1, ARM);

      S.cam.x = kf2(t);
      S.cam.y = kf(t, [[0, -60], [0.3, -180], [0.45, -150], [0.68, 200], [0.95, 200], [1.1, 60], [2.0, 60], [2.3, -120]]);
      S.cam.z = kf(t, [[0, 1.2], [0.5, 1.2], [0.7, 1.5], [0.95, 1.5], [1.1, 1.3], [2.0, 1.3], [2.3, 1.0]]);
    };
    function kf2(t) {
      return t < 1 ? -500 * (1 - es(t, 0.9, 1.0) * 0) : lerp(-500, 700, es(t, 0.95, 1.2)) * (1 - es(t, 2.0, 2.3));
    }
  },
};
