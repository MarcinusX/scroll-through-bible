// Łk 10,13a — high on the hillside over the Sea of Galilee. Below lie the towns where He did most of His mighty works.
// "Woe to you, Chorazin!": over the town on its black basalt hill hang the medallions of what was done there — eyes
// opened, a crutch thrown away, a withered hand made whole — glowing gold. But the town does not turn: one by one the
// medallions go grey and drop, a dark cloud slides over it, and its name comes down on a dark tag. "Woe to you,
// Bethsaida!": over the town at the mouth of the Jordan hang the baskets of the loaves and the blind man's eyes;
// they too go grey and fall, and the cloud comes. Jesus stands between them with His arm stretched out — a lament.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { stormCloud } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { lakeView, medallion, workIcon, nameTag, glow, throng, voiceRings, headAt, kf, tr, DAY, es, ease, bump, seg } from './lib.js';

const GY = 792, JX = 800;
const WORKS = {
  chorazin: { at: 0.05, kinds: ['eye', 'crutch', 'hand'] },
  bethsaida: { at: 1.05, kinds: ['loaves', 'eye', 'loaves'] },
};

export default {
  id: 'lk10-woe',
  beats: [
    { v: 13, text: 'Biada tobie, Korozain!' },
    { v: 13, cont: true, text: 'Biada tobie, Betsaido!' },
  ],
  cam: { x: [-80, 80], y: [-40, 30], z: [1, 1.12] },
  build(S) {
    const V = lakeView(S, { skyCols: DAY, sky2: ['#5a566f', '#8a7f8a', '#b09b90'], GY });
    const c = S.c;

    /* the medallions over each town (gold and grey), its storm cloud, its dark name */
    const HL = S.layer({ par: 0.16, sh: 4 });
    const CL = S.layer({ par: 0.16, sh: 5 });
    const TL = S.layer({ par: 0.16, sh: 4 });
    const W = ['chorazin', 'bethsaida'].map((k, j) => {
      const tw = V.towns[k];
      const meds = WORKS[k].kinds.map((kind, i) => ({
        i, gold: HL.add(`<g>${medallion(c, workIcon(c, kind))}</g>`), grey: HL.add(`<g>${medallion(c, workIcon(c, kind), { grey: true })}</g>`),
        x: tw.x + (i - 1) * 64, y: tw.y - tw.w * 0.62 - (i % 2) * 22,
      }));
      return {
        k, j, tw, at: WORKS[k].at, meds,
        cloud: CL.add(`<g>${stormCloud(makeCutter('lk10-wc' + j), 280)}</g>`),
        shade: CL.add(`<g><path d="${c.poly(c.ell(0, -20, tw.w * 0.8, tw.w * 0.42, 20))}" fill="${mix(C.storm2, C.plumRobe, 0.3)}" opacity=".45"/></g>`),
        tag: TL.add(`<g><path d="M0 -2000V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, tr(tw.name[0], tw.name[1]), { size: 20, dark: true })}</g>`),
      };
    });

    /* Jesus on the hillside, a few of the seventy-two sitting */
    const act = S.layer({ par: 0.5, sh: 5 });
    act.sprite(throng(makeCutter('lk10-woe-d'), 4, { s: 0.84, rows: 1, spread: 56, P: 'sit', men: true }), 1220, GY - 30);
    act.sprite(throng(makeCutter('lk10-woe-e'), 3, { s: 0.84, rows: 1, spread: 56, P: 'sit', men: true, flip: true }), 390, GY - 26);
    const aura = act.add(`<g>${glow(150, 0.45)}</g>`);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });

    return (t, time) => {
      const T = time;
      const gloom = es(t, 0.3, 0.9) * 0.45 + es(t, 1.3, 1.8) * 0.35;
      V.sk2.layer.fade(gloom);
      V.update(T, { sunO: 1 - gloom * 0.6 });

      W.forEach((w) => {
        w.meds.forEach((m) => {
          const on = es(t, w.at - 0.05 + m.i * 0.04, w.at + 0.1 + m.i * 0.04);
          const grey = es(t, w.at + 0.3 + m.i * 0.08, w.at + 0.34 + m.i * 0.08);
          const fall = es(t, w.at + 0.38 + m.i * 0.06, w.at + 0.62 + m.i * 0.06, ease.out);
          const x = m.x + fall * (m.i - 1) * 8, y = lerp(m.y, w.tw.y - w.tw.w * 0.28 - (m.i % 2) * 10, fall);
          const o = w.j === 0 ? 1 : seg(t, 0.9, 0.95);
          pose(m.gold, { x, y, s: 0.7 + on * 0.3 - fall * 0.25, r: fall * (m.i - 1) * 30, o: o * (1 - grey) });
          pose(m.grey, { x, y, s: 0.7 + on * 0.3 - fall * 0.25, r: fall * (m.i - 1) * 30, o: o * grey });
        });
        const cl = es(t, w.at + 0.45, w.at + 0.75);
        pose(w.cloud, { x: lerp(w.tw.x + (w.j ? 700 : -700), w.tw.x, cl), y: w.tw.y - w.tw.w * 0.72, s: 0.9, o: cl > 0.01 ? 1 : 0 });
        pose(w.shade, { x: w.tw.x, y: w.tw.y, o: es(t, w.at + 0.6, w.at + 0.8) });
        const tk = es(t, w.at + 0.2, w.at + 0.45, ease.out);
        pose(w.tag, { x: w.tw.x + (w.j ? 90 : -90), y: lerp(-500, w.tw.y - w.tw.w * 0.4, tk), r: T ? Math.sin(T * 0.9 + w.j) * 1.5 : 0, o: tk > 0.01 ? 1 : 0 });
      });

      /* He turns to each town in turn, His arm stretched out */
      const left = t < 1.0;
      const reach = es(t, 0.05, 0.25) * (1 - es(t, 0.9, 1.02)) + es(t, 1.05, 1.25);
      jesus.set({ x: JX, y: GY, s: 1.04, flip: left, armF: 20 + reach * 70, armB: 10 + reach * 50, head: -reach * 4 + es(t, 0.6, 0.9) * 8 * (1 - es(t, 1.0, 1.1)) + es(t, 1.6, 1.9) * 8, blink: blinkAt(T) });
      pose(aura, { x: JX, y: GY - 120, o: 0.5 });
      const [hx, hy] = headAt(JX, GY, 1.04, left);
      voice(hx, hy, reach * 0.8, T, { dir: left ? -1 : 1, spread: 2.2 });

      S.cam.x = kf(t, [[0, -60], [0.9, -60], [1.1, 60], [2, 60]], ease.sine);
      S.cam.y = kf(t, [[0, -10], [2, -10]]);
      S.cam.z = kf(t, [[0, 1.06], [1, 1.08], [2, 1.08]]);
    };
  },
};
