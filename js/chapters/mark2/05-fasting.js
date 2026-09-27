// Mk 2,18–19a — John's disciples and the Pharisees are fasting (bowls turned over);
// they come and ask why His disciples eat. He answers with a wedding: a canopy, garlands, lanterns.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, town, sun, cloud, grass, flowers, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, hand, headAt, scribe, johnsOpts, bowl, loaf, cup, grapes, speech, canopy, garland, lantern, GLYPH } from './lib.js';

const PI = Math.PI;
const Y = 676;

/** a big fig tree: trunk and broad five-lobed leaves; origin at the foot of the trunk */
function figTree(c, x, y, sc = 1) {
  const s = sheet();
  const X = (v) => x + v * sc, Yy = (v) => y + v * sc;
  s.p(c.cut([[X(-22), Yy(0)], [X(-16), Yy(-80)], [X(-70), Yy(-170)], [X(-54), Yy(-176)], [X(-8), Yy(-120)], [X(0), Yy(-200)], [X(14), Yy(-198)], [X(12), Yy(-120)], [X(64), Yy(-180)], [X(78), Yy(-170)], [X(22), Yy(-80)], [X(26), Yy(0)]], 1, 8), C.stone2);
  s.x(c.ribbon([[X(-4), Yy(-10)], [X(0), Yy(-80)]], 3 * sc), shade(C.stone2, -0.2), 'opacity=".6"');
  const ds = ['', '', ''];
  for (let i = 0; i < 60; i++) {
    const a = c.rr(PI * 1.0, PI * 2.0), r = c.rr(0.2, 1);
    const cx = X(Math.cos(a) * 200 * r), cy = Yy(-200 + Math.sin(a) * 110 * r);
    ds[i % 3] += c.cut(c.star(cx, cy, c.rr(22, 30) * sc, c.rr(12, 17) * sc, 5, c.rr(0, 6)), 0.8, 5);
  }
  s.p(ds[0], C.moss2).p(ds[1], C.moss).p(ds[2], C.leaf);
  let figs = '';
  for (let i = 0; i < 12; i++) { const a = c.rr(PI * 1.1, PI * 1.9), r = c.rr(0.3, 0.9); figs += c.cut(c.ell(X(Math.cos(a) * 180 * r), Yy(-190 + Math.sin(a) * 90 * r), 7 * sc, 8 * sc, 10), 0.3, 3); }
  s.p(figs, C.plumRobe);
  return s.out();
}

export default {
  id: 'm2-fasting',
  beats: [
    { v: 18, text: 'Uczniowie Jana i faryzeusze mieli właśnie post.' },
    { v: 18, cont: true, text: 'Przyszli więc do Niego i pytali: «Dlaczego uczniowie Jana i uczniowie faryzeuszów poszczą, a Twoi uczniowie nie poszczą?»' },
    { v: 19, text: 'Jezus im odpowiedział: «Czy goście weselni mogą pościć, dopóki pan młody jest z nimi?' },
  ],
  cam: { x: [-170, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const SKY = ['#d5e4dc', '#f1e7cc', '#f8ecd3'];
    sky(S, SKY);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50), { x: 1150, y: 130, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 180), { x: 470, y: 170, len: 600 });

    const far = S.layer({ par: 0.12, sh: 2 });
    const h1 = hillsWith(c, { y: 440, amps: [18, 8, 3], lens: [1000, 380, 130], color: C.hillFar, trees: 14, treeColor: C.sage2, treeH: 20 });
    far.add(h1.markup + town(c, { x: 1350, y: h1.fn(1350) + 12, n: 6, spread: 300, sc: 0.5 }));
    const mid = S.layer({ par: 0.3, sh: 3 });
    const h2 = band(c, { y: 560, amps: [10, 5, 2], lens: [900, 300, 120], color: C.hillNear });
    mid.add(h2.markup);
    const ground = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(620, [4, 2], [700, 180]);
    ground.add(sheet().p(c.ridge(gfn, -1200, 2800, 1700, 12, 1), mix(C.sand, C.hillNear, 0.25)).out());
    ground.add(grass(c, { x0: -1100, x1: 2700, y: 620, fn: gfn, n: 50, h: 14, color: C.olive }) + flowers(c, { x0: 1100, x1: 1700, y: 620, fn: gfn, n: 12 }));
    // a path of stones for the fasting ones
    ground.add(bush(c, 90, 640, 110, C.sage, C.moss) + bush(c, 1500, 640, 120, C.sage, C.moss));

    /* the fig tree over Jesus and his friends */
    const treeL = S.layer({ par: 0.5, sh: 5 });
    treeL.add(figTree(c, 860, Y - 30, 1.35));

    /* the wedding things, still up in the flies */
    const fly = S.layer({ par: 0.55, sh: 5 });
    const canopyEl = fly.add(`<g><path d="M-230 -1600V0M230 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${canopy(c, 480, 40)}</g>`);
    const garlands = [[440, 300, 0], [1000, 300, 1]].map(([x, w, i]) => ({ x, w, i, el: fly.add(`<g><path d="M0 -1600V0M${w} -1600V0" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/>${garland(c, w, 40)}</g>`) }));
    const lanterns = [520, 640, 960, 1080].map((x, i) => ({ x, i, el: hanging(fly, lantern(c, { col: i % 2 ? C.apricot : C.roseRobe }), { x, y: 360, len: 800 }) }));
    lanterns.forEach((l) => fade(l.el.querySelector('.glow'), 0));

    /* the fasting ones: kneeling in prayer, then standing up to ask */
    const fastL = S.layer({ par: 0.55, sh: 5 });
    const F = [
      { x: 200, o: johnsOpts(c) },
      { x: 268, o: johnsOpts(c) },
      { x: 336, o: johnsOpts(c) },
      { x: 408, mk: (pose) => scribe(c, 0, { pose }) },
      { x: 478, mk: (pose) => scribe(c, 2, { pose }) },
    ].map((f, i) => {
      if (f.o) f.mk = (pose) => person(c, { ...f.o, pose });
      const cc = c;
      const kn = S.puppet(fastL.add(f.mk('kneel')));
      const st = S.puppet(fastL.add(f.mk('stand')));
      return { ...f, i, kn, st, seed: cc.rr(0, 9), to: 420 + i * 58, bowl: fastL.add(`<g>${bowl(c, { food: null, color: C.stone2, w: 30 })}</g>` ) };
    });

    /* Jesus and his disciples eating under the tree */
    const eatL = S.layer({ par: 0.6, sh: 5 });
    const DIS = [
      { k: 'peter', x: 660 }, { k: 'andrew', x: 718 }, { k: 'james', x: 930 }, { k: 'john', x: 990 }, { k: 'matthew', x: 1052 },
    ].map((d, i) => ({ ...d, i, flip: d.x > 800, seed: c.rr(0, 9), p: S.puppet(eatL.add(person(c, { ...CAST[d.k], pose: 'sit' }))) }));
    const jesus = S.puppet(eatL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const cloth = sheet();
    cloth.p(c.cut([[620, Y + 4], [1090, Y + 2], [1110, Y + 30], [600, Y + 32]], 0.8, 10), C.cream);
    let pat = '';
    for (let x = 630; x < 1090; x += 30) pat += c.cut(c.star(x, Y + 18, 5, 2.2, 4, 0), 0.2, 3);
    cloth.x(pat, C.terracotta, 'opacity=".6"');
    eatL.add(cloth.out());
    eatL.add([[650, loaf(c, 16)], [700, grapes(c)], [760, bowl(c, { food: 'fruit', color: C.pot })], [850, loaf(c, 18)], [905, cup(c)], [960, bowl(c, { food: 'bread', color: C.skyVeil })], [1030, grapes(c, 4.5)]].map(([x, m]) => `<g transform="translate(${x} ${Y + 16})">${m}</g>`).join(''));
    const eaters = DIS.filter((d) => d.k !== 'matthew').map((d) => ({ d, el: eatL.add(`<g>${d.i % 2 ? cup(c) : loaf(c, 11)}</g>`) }));

    /* the question */
    const fx = S.layer({ par: 0.62, sh: 5 });
    const qIcon = `<g transform="translate(-24 12)">${bowl(c, { food: null, color: C.stone2, w: 26 })}</g><g transform="translate(0 0) scale(.8)">${GLYPH.q(c)}</g><g transform="translate(24 12)">${bowl(c, { food: 'bread', color: C.pot, w: 26 })}</g>`;
    const ask = fx.add(`<g>${speech(c, qIcon, { w: 96, h: 50 })}</g>`);
    const answer = fx.add(`<g>${speech(c, `<g transform="translate(0 -4)">${GLYPH.q(c)}</g>`, { w: 46, h: 44, flip: true })}</g>`);

    /* foreground */
    const fg = S.layer({ par: 0.92, sh: 6 });
    fg.add(bush(c, 120, 900, 240, C.moss, C.sage) + bush(c, 1560, 910, 260, C.sage, C.moss) + grass(c, { x0: -300, x1: 400, y: 880, n: 16, h: 40, color: C.moss2 }));

    return (t, time) => {
      const T = time;
      swing(sunEl, 1150, 130, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 24, 170, T, 1.2, 0.7, 1);

      /* the fasting ones */
      const stand = es(t, 1.02, 1.08);
      const fKeys = (f) => [[1.08, f.x], [1.55, f.to - 60]];
      F.forEach((f) => {
        const pray = 1 - stand;
        f.kn.set({ x: f.x, y: Y - 4, s: 0.86, flip: false, o: 1 - stand, armF: pray * (62 + bump(t, 0.1, 0.9) * 8), armB: pray * 58, head: 6 + es(t, 0.2, 0.6) * 8 * pray, blink: blinkAt(T, f.seed) });
        const x = kf(t, fKeys(f));
        const point = f.i === 4 ? bump(t, 1.5, 2.2) : 0;
        f.st.set({ x, y: Y - 4, s: 0.86, flip: false, o: stand, walk: moving(t, fKeys(f)) ? x * 0.05 + f.i : undefined, armF: point * 90 + (f.i === 3 ? bump(t, 1.55, 2.3) * 60 : 0), armB: 10, head: -4 + es(t, 2.2, 2.6) * 6, blink: blinkAt(T, f.seed) });
        // bowls: turned over in beat 0
        const flip = es(t, 0.25 + f.i * 0.06, 0.45 + f.i * 0.06);
        pose(f.bowl, { x: f.x + 40, y: Y + 8 - (flip > 0 && flip < 1 ? Math.sin(flip * PI) * 20 : 0) - flip * 10.5, r: flip * 180, o: 1 });
      });
      const a = es(t, 1.55, 1.75, ease.back) * (1 - es(t, 2.05, 2.2));
      const [qhx, qhy] = headAt(F[4].to - 60, Y - 4, 0.86, false);
      pose(ask, { x: qhx + 26, y: qhy - 10, s: a, o: a > 0.01 ? 1 : 0 });

      /* Jesus and the disciples */
      const answerK = es(t, 2.05, 2.3);
      const wed = es(t, 2.2, 2.7, ease.out);
      jesus.set({ x: 820, y: Y + 2, s: 1.04, flip: answerK > 0.5, armF: 30 + bump(t, 0.2, 0.9) * 30 + answerK * 60, armB: 20 + answerK * 60 * (1 - wed) + wed * 130, head: -answerK * 4, blink: blinkAt(T) });
      DIS.forEach((d) => {
        const look = es(t, 1.5, 1.8) * (d.x < 800 ? 1 : 0.5);
        const cheer = es(t, 2.45 + d.i * 0.04, 2.7 + d.i * 0.04);
        d.p.set({ x: d.x, y: Y + 4, s: 0.92, flip: look > 0.5 && d.x < 800 ? true : d.flip, armF: 40 + bump(t, 0.2 + d.i * 0.1, 0.8 + d.i * 0.1) * 30 + cheer * 80, armB: 20 + cheer * (d.i % 2 ? 140 : 40), head: -look * 4 - cheer * 6, blink: blinkAt(T, d.seed) });
      });
      eaters.forEach((e, i) => {
        const [hx, hy] = hand(e.d.x, Y + 4, 0.92, e.d.flip, 40 + bump(t, 0.2 + e.d.i * 0.1, 0.8 + e.d.i * 0.1) * 30, 0, 62);
        const up = es(t, 2.45 + i * 0.04, 2.7 + i * 0.04);
        pose(e.el, { x: hx, y: hy - up * 60, o: 1 - es(t, 1.4, 1.5) * 0 });
      });
      const ans = es(t, 2.05, 2.2, ease.back) * (1 - es(t, 2.35, 2.5));
      pose(answer, { x: 790, y: Y - 140, s: ans, o: ans > 0.01 ? 1 : 0 });

      /* the wedding canopy, garlands and lanterns come down over them */
      pose(canopyEl, { x: 850, y: lerp(-300, 330, wed), r: Math.sin(T * 0.8) * 0.8, o: wed > 0.005 ? 1 : 0 });
      garlands.forEach((g) => { const k = es(t, 2.3 + g.i * 0.08, 2.75 + g.i * 0.08, ease.out); pose(g.el, { x: g.x, y: lerp(-300, 270, k), r: Math.sin(T * 0.7 + g.i) * 0.8, o: k > 0.005 ? 1 : 0 }); });
      lanterns.forEach((l) => {
        const k = es(t, 2.35 + l.i * 0.06, 2.8 + l.i * 0.06, ease.back);
        pose(l.el, { x: l.x, y: lerp(-200, 360, k), r: Math.sin(T * 1.1 + l.i) * 3, o: k > 0.005 ? 1 : 0 });
      });

      /* camera */
      S.cam.x = kf(t, [[-0.5, -120], [0.9, -120], [1.5, -60], [2.1, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.9, 1.08], [1.5, 1.04], [2.1, 1.02], [2.7, 1.0]]);
      S.cam.y = kf(t, [[-0.5, 20], [1.5, 20], [2.1, 0], [2.7, -20]]);
    };
  },
};
