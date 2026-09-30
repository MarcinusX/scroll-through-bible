// Łk 18,1 — the curtains open on the wayside down in the Jordan valley: the Moab mountains across the river, palm
// groves, Jericho far off among its palms, a great terebinth giving shade. Jesus stands between His disciples,
// teaching them on the way. "He told them a parable, that they must always pray and not lose heart": a painted flat
// comes down over them — a small figure kneels on a hill with hands raised, and while he prays the sun goes down
// behind the hill, the night comes and the moon crosses over, and the sun rises again; he is still there, praying,
// his little prayers rising all the while like sparks.
import { C, person, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import { waySet, WY, flatY, flat, flatSky, flatHills, figure, sparkle, headAt, es, ease, bump, seg, PI } from './lib.js';

const { GY, JX, FX } = WY;
const FW = 440, FH = 250, K = 1.12;
const WHEEL = [60, 72], RAD = 140, MX = -70;   // the sky path of the sun and the moon (flat coords): centre, radius

export default {
  id: 'lk18-pray',
  beats: [
    { cover: true },
    { v: 1 },
  ],
  cam: { x: [-20, 20], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const W = waySet(S, {
      dis: { keys: ['peter', 'andrew', 'james', 'john', 'philip', 'bartholomew'], x: 560, y: GY + 6, s: 0.86, flip: false },
      groups: [
        { k: 'r', members: null, x: 1060, y: GY + 6, n: 6, flip: true, s: 0.86, markup: null, seed: 'lk18-pray-r' },
        { k: 'sit', x: 1090, y: GY + 52, n: 3, flip: true, pose: 'sit', s: 0.9, seed: 'lk18-pray-s' },
      ],
    });
    const c = S.c;

    /* the flat: a hill under an evening-gold sky; the one who prays kneels on it */
    const inner = flatSky(S, FW, FH, ['#cfe0da', '#f4e2bf']) + flatHills(c, FW, 48, mix(C.hillFar, C.duskViolet, 0.2), 8);
    const flatEl = W.FL.add(flat(S, inner, { w: FW, h: FH }));
    const B = W.bits;
    const nightId = S.id('fl-night');
    S.defs(`<linearGradient id="${nightId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.night2}"/><stop offset="1" stop-color="${mix(C.indigo, C.duskViolet, 0.4)}"/></linearGradient>`);
    let st = '';
    for (let i = 0; i < 16; i++) st += c.poly(c.star(c.rr(-FW / 2 + 14, FW / 2 - 14), c.rr(-FH / 2 + 12, 30), c.rr(2.4, 4), 1, 4, 0));
    const night = B.add(`<g opacity="0"><rect x="${-FW / 2}" y="${-FH / 2}" width="${FW}" height="${FH}" fill="url(#${nightId})"/><path d="${st}" fill="${C.star}"/></g>`);
    const sunD = B.add(`<g opacity="0"><circle r="34" fill="url(#warm-glow)"/>${sheet().p(c.cut(c.star(0, 0, 21, 16, 14, 0), 0.3, 3), C.sunDeep).p(c.cut(c.circ(0, 0, 14, 20), 0.3, 3), C.sun).out()}</g>`);
    const moonD = B.add(`<g opacity="0"><circle r="30" fill="url(#halo-glow)" opacity=".6"/>${sheet().p(c.cut([...c.arc(0, 0, 14, 14, -PI * 0.6, PI * 0.6, 12), ...c.arc(6, 0, 10, 12, PI * 0.5, -PI * 0.5, 10)], 0.3, 3), C.moon).out()}</g>`);
    // the front hill with the one who prays (so the sun and moon set behind it)
    const hs = sheet();
    const hfn = c.wave(76, [7, 3], [300, 110]);
    const hp = [];
    for (let x = -FW / 2; x <= FW / 2; x += 12) hp.push([x, hfn(x) - Math.max(0, 90 - Math.abs(x - MX)) * 0.3]);
    hp.push([FW / 2, FH / 2 + 4], [-FW / 2, FH / 2 + 4]);
    hs.p(c.cut(hp, 0.6, 8), mix(C.hillNear, C.sage, 0.3));
    const PRAYER = { robe: C.sageRobe, mantle: C.wheatRobe, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin2, belt: C.leather, pose: 'kneel' };
    const hill = B.add(`<g>${hs.out()}${figure(c, PRAYER, { x: MX, y: hfn(MX) - 25, s: 0.5, armF: 150, armB: 160, head: -14 })}</g>`);
    const sparks = [0, 1, 2, 3, 4].map((i) => ({ i, el: B.add(`<g opacity="0">${sparkle(c, 8, C.halo)}</g>`) }));

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      W.update(T);
      cur.set(es(t, 0.05, 0.85), T);
      W.groups.forEach((g) => g.sp.set({ x: g.x, y: g.y }));
      if (W.disSp) W.disSp.set({ x: 560, y: GY + 6 });

      /* Jesus teaches: to the left, then to the right; as the flat comes down He lifts His hand to it */
      const toR = es(t, 0.45, 0.6) * (1 - es(t, 1.05, 1.2));
      const lift = es(t, 1.2, 1.4);
      W.jesus.set({ x: JX, y: GY, s: 1.06, flip: toR < 0.5, armF: 20 + bump(t, 0.1, 0.9) * 40 + lift * 40, armB: 10 + bump(t, 0.1, 1.0) * 50 + lift * 90, head: -lift * 10, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, toR < 0.5);
      W.voice(hx, hy, bump(t, 0.2, 1.9) * 0.7, T, { dir: toR < 0.5 ? -1 : 1, spread: 1.8 });

      /* v1 — the flat: day, night, day again, and he prays on */
      const kA = es(t, 1.02, 1.28, ease.out);
      const fy = flatY(kA), on = kA > 0.002 ? 1 : 0;
      const sw = T ? Math.sin(T * 0.7) * 0.6 : 0;
      pose(flatEl, { x: FX, y: fy, s: K, r: sw * kA, o: on });
      const at = (dx, dy) => [FX + dx * K, fy + dy * K];
      // one full turn of the sky while he prays: the sun sets, the moon crosses, the sun rises again
      const turn = seg(t, 1.3, 1.95);
      const a = PI * 1.5 + turn * PI * 2;                 // the sun's angle on its path (1.5π = at the top)
      const [sx, sy] = at(WHEEL[0] + Math.cos(a) * RAD, WHEEL[1] + Math.sin(a) * RAD * 0.95);
      const [mx, my] = at(WHEEL[0] - Math.cos(a) * RAD, WHEEL[1] - Math.sin(a) * RAD * 0.95);
      const up = (v) => Math.min(1, Math.max(0, (0.5 - v) * 5));   // above the hill?
      pose(sunD, { x: sx, y: sy, s: K, o: on * up(Math.sin(a)) });
      pose(moonD, { x: mx, y: my, s: K, o: on * (turn > 0 && turn < 1 ? 1 : 0) * up(-Math.sin(a)) });
      const dark = Math.min(1, Math.max(0, (Math.sin(a) + 0.2) * 1.5));  // how far the sun is below the hill
      pose(night, { x: FX, y: fy, s: K, r: sw * kA, o: on * dark * 0.92 });
      pose(hill, { x: FX, y: fy, s: K, r: sw * kA, o: on });
      sparks.forEach((p) => {
        const k = T ? (T * 0.35 + p.i / 5) % 1 : (p.i + 0.5) / 5;
        const [px, py] = at(MX + 6 + Math.sin(k * 6 + p.i) * 10 + (p.i - 2) * 6, -30 - k * 90);
        pose(p.el, { x: px, y: py, s: 0.7 + k * 0.4, o: on * es(t, 1.3, 1.45) * Math.sin(k * PI) });
      });

      S.cam.x = 0;
      S.cam.y = -10 * es(t, 1, 1.3);
      S.cam.z = 1.02 + es(t, 0.0, 0.9) * 0.03;
      void lerp; void shade; void person;
    };
  },
};
