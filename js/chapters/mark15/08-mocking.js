// Mk 15,29–32 — mocked on the cross. The three crosses stand far off on the hill, quiet. On the road below,
// passers-by stop, wag their heads and throw grey paper taunts up at Him — every one of them runs out of
// strength and falls away before it reaches the cross. The chief priests and scribes laugh among themselves
// and throw theirs; and from the two other crosses small grey scraps come too. The sun creeps on along the dial.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, headAt, man, woman, priest, scribe, taunt, golgothaSet, setCrosses, driftClouds, crossHead, GOL, SKIES, PI } from './lib.js';

const RY = 690;

export default {
  id: 'm15-mocking',
  beats: [
    { v: 29, text: 'Ci zaś, którzy przechodzili obok, przeklinali Go, potrząsali głowami, mówiąc:' },
    { v: 29, cont: true, text: '«Ej, Ty, który burzysz przybytek i w trzech dniach go odbudowujesz,' },
    { v: 30 },
    { v: 31, text: 'Podobnie arcykapłani wraz z uczonymi w Piśmie drwili między sobą i mówili:' },
    { v: 31, cont: true, text: '«Innych wybawiał, siebie nie może wybawić.' },
    { v: 32, text: 'Mesjasz, król Izraela, niechże teraz zejdzie z krzyża, żebyśmy widzieli i uwierzyli».' },
    { v: 32, cont: true, text: 'Lżyli Go także ci, którzy byli z Nim ukrzyżowani.' },
  ],
  cam: { x: [-40, 120], y: [-40, 80], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const G = golgothaSet(S, { dial: true });
    const P = G.P;
    // passers-by on the road
    const walkers = [
      { o: man(c, { robe: C.dustyBlue, belt: C.leather }), K: [[-0.4, [150, RY]], [0.5, [S.portrait ? 530 : 490, RY]]], seed: 1 },   // phone: he stops inside the frame, not sliced by it
      { o: woman(c, { robe: C.roseRobe }), K: [[-0.2, [1300, RY + 6]], [0.7, [650, RY + 6]]], seed: 2 },
      { o: man(c, { robe: C.ochreRobe, hairStyle: 'bald', beard: 'full' }), K: [[0, [20, RY + 10]], [0.8, [370, RY + 10]]], seed: 3 },
    ].map((w, i) => ({ ...w, i, p: S.puppet(P.add(person(c, w.o))) }));
    // the chief priests and scribes, on the right (closer together on a phone, clear of the thread)
    const lords = [
      { el: priest(c, 0), x: S.portrait ? 855 : 960, f: false },
      { el: scribe(c, 1), x: S.portrait ? 920 : 1036, f: true },
      { el: priest(c, 2), x: S.portrait ? 985 : 1112, f: true },
      { el: scribe(c, 2), x: S.portrait ? 1050 : 1184, f: true },
    ].map((l, i) => ({ ...l, i, p: S.puppet(P.add(l.el)), seed: c.rr(0, 9) }));
    const fx = G.fx;
    const T_ = (pl, en, side = 1) => fx.add(`<g>${taunt(c, tr(pl, en), { size: 20, side })}</g>`);
    const taunts = [
      { el: T_('Ej, Ty, burzysz przybytek…', 'Ha! You destroy the temple…'), from: () => walkers[0], k0: 1.05, side: 1 },
      { el: T_('…w trzech dniach!', '…in three days!', -1), from: () => walkers[1], k0: 1.35 },
      { el: T_('Zejdź z krzyża!', 'Come down from the cross!'), from: () => walkers[2], k0: 2.05 },
      { el: T_('Wybaw siebie!', 'Save yourself!', -1), from: () => walkers[1], k0: 2.3 },
      { el: T_('Innych wybawiał…', 'He saved others…', -1), from: () => lords[1], k0: 4.05 },
      { el: T_('…siebie nie może!', '…he can’t save himself!', -1), from: () => lords[2], k0: 4.3 },
      { el: T_('Mesjasz? Niech zejdzie!', 'The Christ? Let him come down!', -1), from: () => lords[0], k0: 5.05 },
      { el: T_('…a uwierzymy!', '…and we will believe!', -1), from: () => lords[3], k0: 5.3 },
    ];
    // small grey scraps from the other two crosses
    const scraps = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${taunt(c, '…!', { size: 12, side: i % 2 ? -1 : 1, w: 36 })}</g>`) }));
    const laugh = lords.map(() => fx.add(`<g>${taunt(c, 'ha ha', { size: 12, w: 50 })}</g>`));
    const light = G.onHill.add(`<g><circle r="170" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      G.sk.blend(SKIES.storm, SKIES.grey, 0.5 + es(t, 0, 7) * 0.3);
      driftClouds(G, T);
      setCrosses(G, 1, 1, 1);
      const [sxp, syp] = G.dial.at(lerp(3.2, 5.4, es(t, 0, 7)));
      pose(G.sunEl, { x: sxp, y: syp + 22 });
      pose(G.disc, { o: 0 });
      const [cx, cy] = crossHead(GOL.H);
      const HX = GOL.x + cx, HY = GOL.top + cy;
      pose(light, { x: HX, y: HY + 20, s: 1 + Math.sin(T * 0.8) * 0.04, o: 0.5 });

      /* passers-by: stop, look up, wag their heads */
      walkers.forEach((w) => {
        const [x, y] = kf(t, w.K);
        const wag = es(t, 0.3, 0.6) * (1 - es(t, 2.9, 3.3));
        const out = es(t, 2.9, 3.5);
        const xo = x + (w.i === 1 ? 1 : -1) * out * 700;
        w.p.set({
          x: xo, y, s: 1, flip: w.i === 1 ? t < 0.7 : out > 0.1, walk: moving(t, w.K) || (out > 0 && out < 1) ? xo * 0.05 : undefined,
          head: -10 + Math.sin(T * 5 + w.seed) * 12 * wag, armF: 20 + wag * 40 + bump(t, 1.0 + w.i * 0.3, 1.6 + w.i * 0.3) * 50, armB: 10 + wag * 30, blink: blinkAt(T, w.seed),
        });
      });
      /* the chief priests and scribes, laughing among themselves */
      const mock = es(t, 3.05, 3.3);
      lords.forEach((l) => {
        const lean = mock * (Math.sin(T * 3 + l.seed) * 4 + 6);
        const throwK = bump(t, 4.0 + (l.i % 2) * 0.25, 4.5 + (l.i % 2) * 0.25) + bump(t, 5.0 + (l.i % 2) * 0.25, 5.5 + (l.i % 2) * 0.25);
        const faceCross = es(t, 3.9, 4.1);
        l.p.set({ x: l.x, y: RY + 4, s: 0.98, flip: faceCross > 0.5 ? true : l.f, armF: 20 + mock * 40 + throwK * 70, armB: 10 + mock * 30, head: -lean * 0.5 - faceCross * 10, lean: -lean * 0.6, blink: blinkAt(T, l.seed) });
      });
      laugh.forEach((lg, i) => {
        const l = lords[i];
        const k = es(t, 3.15 + i * 0.1, 3.35 + i * 0.1, ease.back) * (1 - es(t, 3.85, 4.0));
        const [hx, hy] = headAt(l.x, RY + 4, 0.98, l.f);
        pose(lg, { x: hx + (l.f ? -6 : 6), y: hy - 18, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      /* the taunts fly up… and fall away */
      taunts.forEach((tt, i) => {
        const w = tt.from();
        const k = seg(t, tt.k0 - 0.02, tt.k0 + 1.1);
        const src = w.K ? kf(Math.min(t, tt.k0), w.K) : [w.x, RY + 4];
        const [hx, hy] = headAt(src[0], src[1], 1, false);
        const OFF = (S.portrait && i === 0 ? [-110, 150] : [[-150, 60], [150, 20], [-170, 20], [160, 90], [150, 10], [170, 100], [140, 20], [190, 110]][i]);   // phone: the first taunt lands below the sun, not over it
        const tx = lerp(hx, HX + OFF[0], 0.85), ty = HY + OFF[1];
        const fly = Math.min(1, k / 0.55), fall = Math.max(0, (k - 0.55) / 0.45);
        const x = lerp(hx, tx, ease.out(fly)), y = lerp(hy - 30, ty, ease.out(fly)) - Math.sin(fly * PI) * 40 + fall * fall * 260;
        pose(tt.el, { x, y, s: 1 - fly * 0.15, r: fall * (hx < HX ? -50 : 50), o: k > 0 && k < 1 ? Math.min(1, k * 8) * (1 - fall) : 0 });
      });
      scraps.forEach((sc) => {
        const k = seg(t, 6.05 + sc.i * 0.1, 6.75 + sc.i * 0.1);
        const side = sc.i % 2 ? GOL.sides[1] : GOL.sides[0];
        const [shx, shy] = crossHead(side[2]);
        const x0 = side[0] + shx, y0 = side[1] + shy;
        const fly = Math.min(1, k / 0.5), fall = Math.max(0, (k - 0.5) / 0.5);
        pose(sc.el, { x: lerp(x0, lerp(x0, HX, 0.6), fly), y: y0 - 20 - Math.sin(fly * PI) * 30 + fall * fall * 200, s: 0.8, r: fall * (sc.i % 2 ? 40 : -40), o: k > 0 && k < 1 ? 1 - fall : 0 });
      });

      S.cam.x = es(t, 2.9, 3.4) * 90 * (1 - es(t, 5.9, 6.3) * (S.portrait ? 0.5 : 1));   // phone: the camera stays a little right at the end, so the lords aren't under the thread
      S.cam.y = 20 + es(t, 2.9, 3.4) * 30 * (1 - es(t, 5.9, 6.3)) - es(t, 5.9, 6.3) * 30;
      S.cam.z = 1.02 + es(t, 2.9, 3.4) * 0.05 * (1 - es(t, 5.9, 6.3)) + es(t, 5.9, 6.4) * 0.06;
    };
  },
};
