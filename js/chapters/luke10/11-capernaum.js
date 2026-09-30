// Łk 10,15 — back on the hillside over the lake. "And you, Capernaum, will you be exalted to heaven?": Jesus turns to
// the town on the water, His own town, and it rises — a pillar of cloud swells under it and lifts it, domes and walls
// and all, high up into the sky, grander and grander. "You will be brought down to Hades!": the cloud melts away, the
// town drops, the shore splits open into a dark pit — and Capernaum sinks into it and is gone; the dust settles and
// the sky goes grey.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { lakeView, nameTag, glow, dust, throng, voiceRings, headAt, kf, tr, DAY, es, ease, bump, seg, PI } from './lib.js';

const GY = 816, JX = 800;

export default {
  id: 'lk10-capernaum',
  beats: [
    { v: 15, text: 'A ty, Kafarnaum, czy aż do nieba masz być wyniesione?' },
    { v: 15, cont: true, text: 'Aż do Otchłani zejdziesz!' },
  ],
  cam: { x: [-30, 30], y: [-160, 30], z: [1, 1.1] },
  build(S) {
    const V = lakeView(S, { skyCols: DAY, sky2: ['#4f4a64', '#827487', '#ab968d'], GY });
    const c = S.c;
    const town = V.towns.capernaum;
    const TX = town.x, TY = town.y;

    /* the pit that opens in the shore (its dark back behind the town, its front lip in front of it) */
    const pitBack = V.shore.add(`<g><path d="${c.cut([...c.arc(0, 0, 150, 26, PI, 2 * PI, 16), ...c.arc(0, 0, 150, 120, 0, PI, 16)], 1.2, 8)}" fill="#2a2238"/><path d="${c.cut(c.ell(0, 12, 110, 60, 20), 1, 6)}" fill="#1a1426"/></g>`);
    const lipL = S.layer({ par: 0.16, sh: 3 });
    const lip = lipL.add(`<g><path d="${c.cut([[-260, 0], [-150, 0], ...c.arc(0, 0, 150, 30, PI, 0, 16), [150, 0], [260, 0], [260, 110], [-260, 110]], 1, 8)}" fill="${C.hillMid}"/></g>`);
    const dusts = [0, 1, 2, 3].map((i) => lipL.add(`<g>${dust(c, 40, mix(C.sand2, C.rock2, 0.3))}</g>`));

    /* the pillar of cloud that lifts the town */
    const CL = S.layer({ par: 0.16, sh: 4 });
    const puffs = Array.from({ length: 6 }, (_, i) => ({ i, el: CL.add(`<g>${cloud(makeCutter('lk10-pil' + i), 180 - i * 8)}</g>`) }));
    const tag = CL.add(`<g><path d="M0 -2000V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, tr('Kafarnaum', 'Capernaum'), { size: 20 })}</g>`);
    const pride = CL.add(`<g>${glow(170, 0.9, 'warm-glow')}</g>`);

    /* Jesus and some of the seventy-two */
    const act = S.layer({ par: 0.5, sh: 5 });
    act.sprite(throng(makeCutter('lk10-cap-d'), 4, { s: 0.84, rows: 1, spread: 56, P: 'sit', men: true }), 1220, GY - 50);
    act.sprite(throng(makeCutter('lk10-cap-e'), 3, { s: 0.84, rows: 1, spread: 56, P: 'sit', men: true, flip: true }), 390, GY - 46);
    const aura = act.add(`<g>${glow(150, 0.45)}</g>`);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5 });

    return (t, time) => {
      const T = time;
      const grey = es(t, 1.1, 1.6);
      V.sk2.layer.fade(grey * 0.75);
      V.update(T, { sunO: 1 - grey * 0.6 });

      /* v15a — lifted up on a pillar of cloud */
      const up = es(t, 0.08, 0.7, ease.io);
      const drop = es(t, 1.02, 1.3, ease.in);
      const sink = es(t, 1.3, 1.62, ease.in);
      const ty = lerp(TY, 330, up * (1 - drop)) + sink * 190;
      const ts = lerp(1, 1.2, up) * (1 - drop * 0.26) * (1 - sink * 0.2);
      pose(town.el, { x: TX, y: ty, s: ts, ox: 0, oy: 0, o: 1 - seg(t, 1.56, 1.64) });
      pose(pride, { x: TX, y: ty - 60, s: ts, o: up * (1 - drop) * 0.8 });
      puffs.forEach((p) => {
        const k = es(t, 0.05 + p.i * 0.04, 0.6 + p.i * 0.03);
        const melt = es(t, 1.0 + p.i * 0.02, 1.2 + p.i * 0.02);
        pose(p.el, { x: TX + (p.i % 2 ? 26 : -26), y: lerp(TY + 20, ty + 10 + (p.i + 0.5) * ((TY + 20 - ty) / 6), k), s: (0.5 + k * 0.6) * (1 - melt * 0.6), o: k > 0.01 ? 1 - melt : 0 });
      });
      const tk = es(t, 0.3, 0.55, ease.out) * (1 - es(t, 1.4, 1.6));
      pose(tag, { x: TX + 190, y: lerp(-500, 250, tk), r: T ? Math.sin(T * 0.9) * 1.5 : 0, o: tk > 0.01 ? 1 : 0 });

      /* v15b — down into the pit */
      const open = es(t, 1.05, 1.3);
      pose(pitBack, { x: TX, y: TY + 20, sx: open, s: 1, o: open > 0.01 ? 1 : 0 });
      pose(lip, { x: TX, y: TY + 20, sx: Math.max(0.01, open), o: open > 0.01 ? 1 : 0 });
      dusts.forEach((d, i) => { const k = bump(t, 1.5 + i * 0.04, 1.95 + i * 0.03); pose(d, { x: TX + (i - 1.5) * 70, y: TY + 10 - k * 40, s: 0.6 + k, o: k }); });

      /* Jesus turns to His own town */
      const reach = es(t, 0.05, 0.25);
      jesus.set({ x: JX, y: GY, s: 1.04, flip: false, armF: 20 + reach * 60 + es(t, 1.0, 1.1) * 20, armB: 10 + reach * 40 + es(t, 1.0, 1.15) * 60 * (1 - es(t, 1.6, 1.9)), head: -up * 18 * (1 - drop) + drop * 10, blink: blinkAt(T) });
      pose(aura, { x: JX, y: GY - 120, o: 0.5 });
      const [hx, hy] = headAt(JX, GY, 1.04, false);
      voice(hx, hy, reach * 0.7 + bump(t, 1.0, 1.4), T, { dir: 1, spread: 2.2 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 0], [0.7, -110], [1.0, -110], [1.4, -70], [2, -70]]);
      S.cam.z = kf(t, [[0, 1.04], [0.7, 1.0], [1.0, 1.0], [1.4, 1.06], [2, 1.06]]);
    };
  },
};
