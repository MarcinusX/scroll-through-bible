// Mk 7,31–35 — a paper map: from Tyre up to Sidon and round through the Decapolis to the Sea of
// Galilee. On the eastern shore they bring a deaf man with a knotted tongue. Jesus takes him aside,
// touches his ears and his tongue, looks up to heaven, sighs — "Ephphatha!" — and the grey plugs of
// silence pop away, the knot comes undone, and words blossom.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, flock, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, sun, cloud, palm, olive, bush, grass, rock, reeds } from '../../assets/nature.js';
import { bird, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { hand, headAt, townsfolk, LOOK, SEA, MUREX, earPlug, knotHalf, nameTag, speech, spark, soundRings, hang2, greekTown, flowerWord } from './lib.js';

const PI = Math.PI;
const FLOOR = 684;
const MAP = { x: 800, y: 400, w: 760, h: 500 };
const ROUTE = [[-236, 60], [-222, -40], [-206, -170], [-120, -196], [-20, -170], [70, -110], [150, -30], [196, 70], [170, 140], [118, 118]];

export default {
  id: 'm7-ephphatha',
  beats: [
    { v: 31 },
    { v: 32 },
    { v: 33, text: 'On wziął go na bok, osobno od tłumu,' },
    { v: 33, cont: true, text: 'włożył palce w jego uszy i śliną dotknął mu języka;' },
    { v: 34, text: 'a spojrzawszy w niebo, westchnął' },
    { v: 34, cont: true, text: 'i rzekł do niego: «Effatha», to znaczy: Otwórz się!' },
    { v: 35 },
  ],
  cam: { x: [-40, 360], y: [-80, 40], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const SKY = ['#cde1e2', '#eee7cf', '#f7ebd4'];
    const HEAV = ['#e9eed9', '#fbf1d4', '#fbf0da'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1250, y: 150, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 170), { x: 560, y: 150, len: 700 });
    const birds = flock(S, hangL, 4, (cc) => bird(cc, { color: C.bird }), { y: 210, speed: 40, scale: 0.45 });
    const heaven = hangL.add(`<g>${rays(c, { n: 16, r0: 40, r1: 700, color: '#fff3cf' })}</g>`);

    /* ---------- the Sea of Galilee from its eastern shore; the Decapolis towns on the hills ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 400, amps: [14, 6, 2], lens: [1000, 360, 120], color: C.hillFar }).markup);
    S.layer({ par: 0.12, sh: 1 }).add(waterBand(c, { y: 420, color: C.lake, foamN: 22, bottom: 900 }).markup);
    const east = S.layer({ par: 0.24, sh: 3 });
    const h2 = hillsWith(c, { y: 520, amps: [26, 10, 3], lens: [900, 300, 120], color: C.hillMid, trees: 10, treeColor: C.sage, treeH: 22 });
    east.add(h2.markup);
    [[1180, 0.8], [1420, 0.7], [1620, 0.6], [360, 0.7]].forEach(([x, sc]) => east.add(`<g transform="translate(${x} ${h2.fn(x) + 10})">${greekTown(c, sc)}</g>`));
    const shore = S.layer({ par: 0.4, sh: 3 });
    const sfn = c.wave(600, [5, 2], [700, 160]);
    shore.add(sheet().p(c.ridge(sfn, -900, 2500, 1700, 12, 1), C.sand).out());
    shore.add(reeds(c, 240, 604, 10, 70) + palm(c, 150, 606, 170) + olive(c, 1280, 606, 0.9) + rock(c, 1150, 612, 90, 40, C.rock2));
    shore.add(grass(c, { x0: -600, x1: 2200, y: 600, fn: sfn, n: 40, h: 12, color: C.olive }));

    /* ---------- the crowd, the deaf man and his friends, Jesus ---------- */
    const crowdL = S.layer({ par: 0.55, sh: 4 });
    const people = crowd(S, crowdL, [
      { y: 640, s: 0.66, n: 9, x0: 300, x1: 640 },
      { y: 664, s: 0.74, n: 6, x0: 280, x1: 620 },
    ]);
    const ppl = S.layer({ par: 0.6, sh: 5 });
    const friends = [townsfolk(c, { man: true, robe: C.clayMantle, mantle: null }), townsfolk(c, { man: true, robe: C.tealRobe, mantle: null, belt: C.leather })]
      .map((o, i) => ({ i, p: S.puppet(ppl.add(person(c, o))), seed: c.rr(0, 9) }));
    const deaf = S.puppet(ppl.add(person(c, LOOK.deaf)));
    const jesus = S.puppet(ppl.add(person(c, CAST.jesus)));

    /* ---------- silence and its undoing ---------- */
    const fx = S.layer({ par: 0.6, sh: 6 });
    const plugs = [0].map(() => fx.add(`<g>${earPlug(c, 6.5)}</g>`));
    const knotL = fx.add(`<g>${knotHalf(c, -1)}</g>`), knotR = fx.add(`<g>${knotHalf(c, 1)}</g>`);
    const touch = fx.add(`<g>${spark(c, 8)}</g>`);
    const sigh = fx.add(`<path d="${c.ribbon(c.cbez([0, 0], [-16, -30], [18, -60], [0, -100], 16), (u) => 7 - u * 5)}" fill="${C.cream}" opacity="0"/>`);
    const tag = hanging(fx, nameTag(c, tr('Effatha', 'Ephphatha'), { size: 30, sub: tr('Otwórz się!', 'Be opened!'), subSize: 19 }), { x: 1010, y: 250, len: 700 });
    const ring = soundRings(fx, c, { n: 3, r: 22, w: 4, color: shade(C.ochre, 0.2) });
    const words = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${speech(c, flowerWord(c, i), { w: 48, h: 38, flip: i % 2 === 1 })}</g>`), dx: [60, -30, 110, 10, 150][i], dy: [-40, -90, -100, -150, -60][i] }));

    /* ---------- the map (it hangs in front of everything, then flies up) ---------- */
    const mapL = S.layer({ par: 0.62, sh: 8 });
    const mapEl = mapL.add(`<g>${hang2(mapMarkup(c), MAP.w / 2 - 40, 500)}</g>`);
    const routeEl = mapL.add(routePath(c));
    const routeLen = ROUTE.reduce((L, p, i) => (i ? L + Math.hypot(p[0] - ROUTE[i - 1][0], p[1] - ROUTE[i - 1][1]) : 0), 0);
    const token = mapL.add(`<g><circle r="13" fill="${C.halo}" stroke="${C.haloRim}" stroke-width="3"/><circle r="5" fill="${C.jesusMantle}"/></g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1250, 150, T, 1, 0.6);
      swing(cl1, 560 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.7, 1);
      birds(T, 1 - bump(t, 3.9, 6.2) * 0.8);
      const lookUp = es(t, 4.05, 4.3) * (1 - es(t, 5.0, 5.3));
      sk.blend(SKY, HEAV, lookUp * 0.8 + es(t, 6.0, 6.4) * 0.4);
      pose(heaven, { x: 1000, y: -80, r: t * 3, o: lookUp * 0.55 + es(t, 6.0, 6.4) * 0.25 });

      /* v31 — the journey on the map */
      const up = es(t, 0.82, 1.08, ease.in);
      const my = MAP.y - up * 1300;
      pose(mapEl, { x: MAP.x, y: my });
      const k = es(t, 0.1, 0.8, (x) => x);
      attr(routeEl, 'stroke-dashoffset', (routeLen * (1 - k)).toFixed(1));
      pose(routeEl, { x: MAP.x, y: my });
      const [px, py] = along(ROUTE, k);
      pose(token, { x: MAP.x + px, y: my + py, s: 1 + Math.sin(T * 4) * 0.06, o: t < 1.05 ? 1 : 0 });

      /* v32 — they bring the deaf man and beg */
      const ears = es(t, 3.05, 3.25) * (1 - es(t, 3.45, 3.55));
      const tongue = es(t, 3.55, 3.7) * (1 - es(t, 3.9, 4.05));
      const bring = es(t, 1.0, 1.55);
      const dx0 = lerp(260, 660, bring);
      const aside = es(t, 2.05, 2.7);          // v33a — away from the crowd
      const DX = lerp(dx0, 962, aside);
      const JX = lerp(830, 1062, aside);
      const walkD = (t > 1.0 && t < 1.55) || (t > 2.05 && t < 2.7);
      const joy = es(t, 6.2, 6.5);
      deaf.set({ x: DX, y: FLOOR, s: 0.94, flip: false, walk: walkD ? DX * 0.05 : undefined, armF: aside > 0 && aside < 1 ? 60 : joy * (80 + Math.sin(T * 5) * 10), armB: joy * 155, head: -4 - joy * 8 + ears * 4, blink: blinkAt(T, 2) });
      friends.forEach((f) => {
        const fx_ = dx0 - 70 - f.i * 60;
        const beg = es(t, 1.55, 1.8) * (1 - es(t, 2.1, 2.4));
        f.p.set({ x: fx_ - aside * 60, y: FLOOR + 2 + f.i * 4, s: 0.9, walk: t > 1.0 && t < 1.55 ? fx_ * 0.05 + f.i : undefined, armF: bring < 1 ? 70 : 30 + beg * 70, armB: beg * 40, blink: blinkAt(T, f.seed) });
      });
      people.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: false, armF: joy * 80, head: -joy * 6, blink: blinkAt(T, m.seed) }));
      crowdL.fade(1 - aside * 0.45 * (1 - es(t, 6.2, 6.6)));

      /* Jesus: listens, leads him aside, touches ears and tongue, looks up, speaks */
      const speak = es(t, 5.05, 5.3) * (1 - es(t, 6.0, 6.3));
      const lead = aside > 0 && aside < 1 ? 1 : 0;
      jesus.set({
        x: JX, y: FLOOR + 4, s: 1.0, flip: !lead,
        walk: lead ? JX * 0.05 : undefined,
        armF: 14 + es(t, 1.6, 1.9) * 20 * (1 - aside) + lead * 50 + ears * 88 + tongue * 78 + speak * 70 + joy * 30,
        armB: 8 + lookUp * 30 + ears * 40,
        head: -lookUp * 26 + ears * 6 + tongue * 4, blink: blinkAt(T),
      });

      /* the man's silence: two grey plugs at his ears, a knotted cord at his lips */
      const [hx, hy] = headAt(DX, FLOOR, 0.94, false);
      const face = 1;
      const pop = es(t, 6.02, 6.3, ease.out);
      const showSilence = es(t, 1.4, 1.6);
      plugs.forEach((p, i) => {
        const bx = hx - 4, by = hy + 5;
        pose(p, { x: bx - face * pop * (60 + i * 40), y: by - pop * (80 + i * 30) + pop * pop * 60, r: pop * 200, s: 0.9 + bump(t, 3.05, 3.5) * 0.2, o: showSilence * (1 - es(t, 6.2, 6.4)) });
      });
      const mx = hx + face * 22, myy = hy + 12;
      const untie = es(t, 6.05, 6.35, ease.out);
      pose(knotL, { x: mx - untie * 30, y: myy + untie * 40, r: -untie * 50, s: 0.8, o: showSilence * (1 - es(t, 6.3, 6.5)) });
      pose(knotR, { x: mx + untie * 30, y: myy + untie * 50, r: untie * 60, s: 0.8, o: showSilence * (1 - es(t, 6.3, 6.5)) });
      pose(touch, { x: tongue > 0.2 ? mx : hx - face * 12, y: tongue > 0.2 ? myy : hy, s: bump(t, 3.1, 3.5) + bump(t, 3.55, 3.95), o: bump(t, 3.1, 3.5) + bump(t, 3.55, 3.95) });

      /* v34a — he looks up to heaven and sighs */
      const [jhx, jhy] = headAt(JX, FLOOR + 4, 1.0, true);
      const sk_ = seg(t, 4.3, 4.95);
      pose(sigh, { x: jhx - 20, y: jhy - 10 - sk_ * 60, s: 0.6 + sk_ * 0.8, o: bump(t, 4.3, 4.95) * 0.8 });

      /* v34b — "Ephphatha!" */
      const tK = es(t, 5.05, 5.4, ease.back) * (1 - es(t, 6.5, 6.9));
      swing(tag, 1010, 250 - (1 - tK) * 1150, T, 1.2, 0.8, 1);

      /* v35 — ears open, the tongue set free, words blossom */
      ring(hx - face * 14, hy, es(t, 6.1, 6.3), T, { spread: 2.4 });
      words.forEach((w) => {
        const k2 = es(t, 6.25 + w.i * 0.1, 6.5 + w.i * 0.1, ease.back);
        pose(w.el, { x: hx + face * 20 + w.dx * face * 0.8, y: hy + w.dy + Math.sin(T * 2 + w.i) * 3, s: k2 * 0.9, o: k2 > 0.02 ? 1 : 0 });
      });

      /* camera: close in on the two of them */
      const close = es(t, 2.6, 3.1) * (1 - es(t, 6.4, 6.9) * 0.5);
      S.cam.x = lerp(0, 350, aside);
      S.cam.y = -es(t, 1.0, 1.4) * 10 + close * 30 - lookUp * 60 - es(t, 5.0, 5.3) * 20 * (1 - es(t, 6, 6.4));
      S.cam.z = 1 + close * 0.22 - lookUp * 0.1;
    };
  },
};

/* ---------- local cut-outs ---------- */
function along(pts, u) {
  let total = 0;
  const segs = [];
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); total += l; }
  let d = Math.max(0, Math.min(1, u)) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) { const k = segs[i] ? Math.min(1, d / segs[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; }
    d -= segs[i];
  }
  return pts[pts.length - 1];
}
function routePath(c) {
  const d = 'M' + ROUTE.map(([x, y]) => `${x} ${y}`).join('L');
  const L = ROUTE.reduce((acc, p, i) => (i ? acc + Math.hypot(p[0] - ROUTE[i - 1][0], p[1] - ROUTE[i - 1][1]) : 0), 0);
  return `<path d="${d}" fill="none" stroke="${C.terracotta}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${L.toFixed(1)} ${L.toFixed(1)}" stroke-dashoffset="${L.toFixed(1)}"/>`;
}
function mapMarkup(c) {
  const { w, h } = MAP;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -h / 2, w, h), 2.2, 10), C.parchment);
  // the Great Sea on the left
  const coast = [[-w / 2 + 10, -h / 2 + 10], [-190, -h / 2 + 10], [-196, -200], [-214, -120], [-208, -40], [-228, 30], [-240, 110], [-230, 190], [-250, h / 2 - 10], [-w / 2 + 10, h / 2 - 10]];
  s.p(c.cut(coast, 1.4, 8), mix(SEA, C.parchment, 0.25));
  let waves = '';
  for (let i = 0; i < 8; i++) { const x = -330 + (i % 2) * 40, y = -200 + i * 55; waves += c.ribbon(c.arc(x, y, 14, 5, PI * 1.1, PI * 1.9, 6), 1.6) + c.ribbon(c.arc(x + 30, y, 14, 5, PI * 1.1, PI * 1.9, 6), 1.6); }
  s.x(waves, shade(SEA, -0.15), 'opacity=".6"');
  // mountains of Lebanon and Hermon
  let hills = '';
  [[-120, -150], [-70, -210], [-20, -140], [40, -200], [-150, -70], [260, -180], [300, 40], [250, 190], [-60, 160], [-130, 200]].forEach(([x, y]) => { hills += c.cut([[x - 24, y + 10], [x, y - 20], [x + 24, y + 10]], 0.6, 6); });
  s.x(hills, shade(C.parchment, -0.14));
  // Jordan and the lake
  s.p(c.ribbon([[70, -h / 2 + 20], [60, -150], [84, -80], [64, -30], [84, 50], [90, 80]], 4.4), C.lake2);
  s.p(c.ribbon([[96, 170], [110, 200], [92, 230], [104, h / 2 - 20]], 4.4), C.lake2);
  const lake = [[74, 70], [104, 66], [122, 90], [128, 130], [112, 164], [90, 172], [74, 150], [66, 110]];
  s.p(c.cut(lake, 0.8, 5), C.lake);
  s.x(c.poly(c.star(w / 2 - 60, -h / 2 + 60, 24, 6, 4, 0)), C.clay, 'opacity=".6"');
  const town = (x, y, col = C.clay) => c.cut(c.rect(x - 7, y - 6, 14, 10), 0.3, 4) + c.cut([[x - 9, y - 6], [x, y - 14], [x + 9, y - 6]], 0.3, 4);
  s.p(town(-236, 64) + town(-210, -166), MUREX);
  let deca = '';
  [[150, 40], [196, 20], [230, 80], [180, 110], [214, 150], [160, 186], [280, 180], [290, 120], [300, 60], [150, 214]].forEach(([x, y]) => { deca += c.cut(c.rect(x - 4, y - 8, 3, 10), 0.2, 2) + c.cut(c.rect(x + 2, y - 8, 3, 10), 0.2, 2) + c.cut([[x - 7, y - 8], [x + 8, y - 8], [x + 1, y - 13]], 0.2, 2); });
  s.p(deca, C.ochre);
  const F = 'EB Garamond, Georgia, serif';
  const lbl = (x, y, t, size = 18, col = C.inkSoft, anchor = 'start', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${F}" font-size="${size}" font-style="italic" fill="${col}"${extra}>${t}</text>`;
  let L = '';
  L += lbl(-220, 70, tr('Tyr', 'Tyre'), 19);
  L += lbl(-196, -160, tr('Sydon', 'Sidon'), 19);
  L += lbl(140, 124, tr('Jezioro', 'Sea of'), 14, shade(C.lakeDeep, -0.1), 'end') + lbl(140, 140, tr('Galilejskie', 'Galilee'), 14, shade(C.lakeDeep, -0.1), 'end');
  L += lbl(232, 222, tr('Dekapol', 'Decapolis'), 22, C.terracotta, 'middle');
  L += lbl(-330, 0, tr('Morze Wielkie', 'the Great Sea'), 15, shade(SEA, -0.35), 'middle', ' transform="rotate(-80 -330 0)"');
  L += lbl(-110, 20, tr('Fenicja', 'Phoenicia'), 22, MUREX, 'middle');
  s.x(c.ribbon([[-w / 2 + 18, -h / 2 + 18], [w / 2 - 18, -h / 2 + 18], [w / 2 - 18, h / 2 - 18], [-w / 2 + 18, h / 2 - 18], [-w / 2 + 18, -h / 2 + 20]], 2), C.clay, 'opacity=".5"');
  return s.out() + L;
}
