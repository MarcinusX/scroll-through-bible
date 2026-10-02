// Mt 11,20–21a — a hillside high above the Sea of Galilee. Along the shore below lie the towns where He did most of
// His mighty works: Chorazin up on its hill, Capernaum on the water, Bethsaida by the river mouth. Golden sparks of
// the miracles glow over them — and go grey and fall, because the towns did not turn. Jesus stretches out His arm to
// them. "Woe to you, Chorazin! Woe to you, Bethsaida!": their names come down on strings, and a dark cloud slides
// over each town in turn and its light goes out.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, cloud, grass, olive, rock } from '../../assets/nature.js';
import { stormCloud } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { cityIcon, sparkle, nameTag, throng, headAt, voiceRings, GLOOM, tr, PI } from './lib.js';

const GY = 748, JX = 800;
const TOWNS = [
  { k: 'chorazin', x: 430, y: 470, w: 150, name: ['Korozain', 'Chorazin'], woe: 1.1 },
  { k: 'capernaum', x: 820, y: 540, w: 190, name: null, woe: null },
  { k: 'bethsaida', x: 1180, y: 526, w: 150, name: ['Betsaida', 'Bethsaida'], woe: 1.4 },
];

export default {
  id: 'mt11-woe',
  beats: [
    { v: 20 },
    { v: 21, text: '«Biada tobie, Korozain! Biada tobie, Betsaido!' },
  ],
  cam: { x: [-60, 60], y: [-60, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const PX = S.portrait ? { chorazin: 560, bethsaida: 1020, capernaum: 800 } : {};
    const TOWNS_ = TOWNS.map((tw) => ({ ...tw, x: PX[tw.k] ?? tw.x, w: S.portrait && tw.k !== 'capernaum' ? 130 : tw.w }));
    sky(S, ['#c4d8d6', '#ece8d4', '#f5e6c9']);
    const gloom = sky(S, GLOOM, { name: 'gloom', rise: 0 }).layer;
    gloom.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 150, len: 900 });
    const cl = hanging(hangL, cloud(c, 160), { x: 620, y: 170, len: 900 });

    /* the far shore, the lake and the towns along it */
    S.layer({ par: 0.06, sh: 2 }).add(band(c, { y: 380, amps: [14, 6, 3], lens: [1000, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
    const lake = S.layer({ par: 0.1, sh: 2 });
    lake.add(waterBand(c, { y: 410, color: mix(C.lake, C.skyBlue, 0.2), foamN: 20, bottom: 900 }).markup);
    const shore = S.layer({ par: 0.16, sh: 3 });
    const S2 = sheet();
    S2.p(c.cut([[-900, 1400], [-900, 500], [200, 480], [330, 440], [480, 430], [600, 470], [700, 540], [1000, 548], [1100, 530], [1300, 520], [2500, 520], [2500, 1400]], 1.2, 12), C.hillMid);
    S2.x(c.ribbon([[1230, 540], [1280, 600], [1300, 700]], 10), C.lake2, 'opacity=".8"');
    shore.add(S2.out());
    const towns = TOWNS_.map((tw) => ({
      ...tw,
      el: shore.add(`<g transform="translate(${tw.x} ${tw.y})">${cityIcon(makeCutter('mt11-wt-' + tw.k), tw.w, { dome: tw.k === 'capernaum' })}</g>`),
      dark: shore.add(`<g><path d="${c.poly(c.ell(0, -20, tw.w * 0.7, tw.w * 0.4, 20))}" fill="${mix(C.storm2, C.plumRobe, 0.3)}" opacity=".5"/></g>`),
      sp: Array.from({ length: 4 }, (_, i) => shore.add(`<g>${sparkle(c, 12, C.halo)}</g>`)),
    }));
    const clouds = S.layer({ par: 0.16, sh: 5 });
    const storms = TOWNS_.filter((tw) => tw.woe).map((tw, i) => ({ ...tw, el: clouds.add(`<g>${stormCloud(makeCutter('mt11-ws' + i), 260)}</g>`) }));
    const tagL = S.layer({ par: 0.16, sh: 4 });
    const tags = TOWNS_.filter((tw) => tw.name).map((tw) => ({ ...tw, el: hanging(tagL, nameTag(c, tr(tw.name[0], tw.name[1]), { size: 20 }), { x: tw.x, y: 0, len: 900 }) }));

    /* the near hillside */
    const G = S.layer({ par: 0.5, sh: 3 });
    const gfn = c.wave(GY - 40, [8, 3], [800, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1800, 12, 1), mix(C.hillNear, C.sage2, 0.4)).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: GY - 40, fn: gfn, n: 50, h: 14, color: C.moss }) + olive(c, 250, GY - 30, 1.1) + rock(c, 1300, GY - 20, 110, 36, C.rock2));
    const act = S.layer({ par: 0.5, sh: 5 });
    act.sprite(throng(makeCutter('mt11-wd'), 4, { s: 0.86, rows: 1, spread: 56, P: 'sit', men: true }), S.portrait ? 1010 : 1140, GY + 4);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1260, y: 150, r: T ? Math.sin(T * 0.6) : 0, o: 1 - es(t, 1.0, 1.5) * 0.5 });
      pose(cl, { x: 620 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 170, r: T ? Math.sin(T * 0.6 + 1) : 0 });

      /* v20 — the miracles glow over the towns, then grey and fall */
      towns.forEach((tw, j) => {
        tw.sp.forEach((sp, i) => {
          const a = 0.05 + j * 0.08 + i * 0.03;
          const on = es(t, a, a + 0.15);
          const grey = es(t, 0.5 + j * 0.05, 0.7 + j * 0.05);
          const fall = seg(t, 0.55 + j * 0.05 + i * 0.03, 0.9 + j * 0.05);
          const x = tw.x + (i - 1.5) * tw.w * 0.26, y = tw.y - tw.w * 0.6 - (i % 2) * 20 + fall * fall * tw.w * 0.5;
          pose(sp, { x, y, s: 0.6 + on * 0.5 - grey * 0.4, r: T * 30 + i * 20, o: on * (1 - fall) });
        });
        const woe = tw.woe ? es(t, tw.woe, tw.woe + 0.2) : 0;
        pose(tw.dark, { x: tw.x, y: tw.y, o: woe });
      });

      /* Jesus reproaches them */
      const reach = es(t, 0.2, 0.45);
      const toC = es(t, 1.0, 1.15) * (1 - es(t, 1.3, 1.4));
      const toB = es(t, 1.32, 1.45);
      const left = t < 1.32;
      jesus.set({ x: JX, y: GY, s: 1.04, flip: left, armF: 20 + reach * 60 + toC * 30 + toB * 30, armB: 10 + reach * 30 + (toC + toB) * 60, head: -reach * 6 + es(t, 1.6, 1.9) * 12, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.04, left);
      voice(hx, hy, reach * 0.6 + toC + toB, T, { dir: left ? -1 : 1, spread: 2.4 });

      /* v21a — woe: the names come down; a dark cloud over each */
      tags.forEach((tg) => {
        const k = es(t, tg.woe - 0.08, tg.woe + 0.14, ease.out);
        pose(tg.el, { x: tg.x, y: lerp(-500, tg.y - tg.w * 0.9, k), r: T ? Math.sin(T * 0.9 + tg.x) * 1.5 : 0, o: k > 0.01 ? 1 : 0 });
      });
      storms.forEach((st) => {
        const k = es(t, st.woe, st.woe + 0.25);
        pose(st.el, { x: lerp(st.x + (st.x < 800 ? -500 : 500), st.x, k), y: st.y - st.w * 0.55, s: 0.9, o: k > 0.01 ? 1 : 0 });
      });
      gloom.fade(es(t, 1.05, 1.5) * 0.7);

      S.cam.z = 1.04 + es(t, 0.9, 1.3) * 0.06;
      S.cam.y = -20;
      S.cam.x = 0;
    };
  },
};
