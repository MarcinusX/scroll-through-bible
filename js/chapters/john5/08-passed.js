// J 5,24–27 — the stage is torn in two: on the left a grey sheet (death: grey sky, grey ground, a bare tree),
// on the right a coloured one (life). Jesus stands at the seam. "Whoever hears my word and believes Him who sent
// me has eternal life" — golden word-slips reach a grey man, a light kindles at his heart, a ring without end
// draws itself round him. He does not come into judgment (the scales hang over the grey path; he walks past) but
// has passed from death to life: stepping over the seam, colour flows back into him. The hour is coming, and now
// is: a dial's hand swings to "now"; the Son's voice rolls over the grey ground and the dead who hear it sit up
// with little lights and live. As the Father has life in Himself — a flame in the great light — so He gave the
// Son to have life in Himself: the flame comes down and burns at Jesus' heart. And He gave Him authority to judge,
// because He is the Son of Man — a golden sceptre comes down into His hand.
import { C, person, CAST, crowdPerson, blinkAt, lerp, mix, shade, sky, sheet } from '../kit.js';
import { band, grass, flowers, cloud, olive, sun } from '../../assets/nature.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import {
  GREY, DAY, silhouette, lyingOn, radiance, wordFlame, eternityRing, drawRing, wordSlip, heart, soulLight, voiceRings, balanceRig, hungWord, hang2,
  vis, kf, headAt, handAt, hanging, swing, tr, PI,
} from './lib.js';

const F = 700;
const SEAM = 820;
const GREYC = mix(C.stone2, C.rock2, 0.4);

/** a ragged vertical tear from y0 to y1 at x (offsets) → points */
function tearPts(c, x, y0, y1) {
  const p = [];
  for (let y = y0; y <= y1; y += 40) p.push([x + c.rr(-14, 14), y]);
  return p;
}
/** a round hour dial (origin centre); the hand is a separate piece */
function dial(c, r = 60) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, r + 8, 36), 0.4, 5), C.wood3).p(c.cut(c.circ(0, 0, r, 36), 0.4, 5), C.parchment);
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * PI * 2; ticks += c.ribbon([[Math.cos(a) * (r - 12), Math.sin(a) * (r - 12)], [Math.cos(a) * (r - 4), Math.sin(a) * (r - 4)]], i % 3 ? 2 : 4); }
  s.x(ticks, C.inkSoft);
  return `<path d="M0 -1600V${-r - 8}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<text x="0" y="${-r * 0.36}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.terracotta}">${tr('teraz', 'now')}</text>`;
}
function sceptre(c) {
  return sheet().p(c.ribbon([[0, -6], [0, 110]], 6), C.sun).p(c.cut(c.star(0, -16, 16, 7, 6, 0), 0.3, 3), C.haloRim).x(c.poly(c.circ(0, -16, 5, 8)), '#fffaf0').out();
}

export default {
  id: 'j5-passed',
  beats: [
    { v: 24, text: 'Zaprawdę, zaprawdę, powiadam wam: Kto słucha słowa mego i wierzy w Tego, który Mnie posłał, ma życie wieczne' },
    { v: 24, cont: true, text: 'i nie idzie na sąd, lecz ze śmierci przeszedł do życia.' },
    { v: 25, text: 'Zaprawdę, zaprawdę, powiadam wam, że nadchodzi godzina, nawet już jest, kiedy to umarli usłyszą głos Syna Bożego,' },
    { v: 25, cont: true, text: 'i ci, którzy usłyszą, żyć będą.' },
    { v: 26 },
    { v: 27 },
  ],
  cam: { x: [-80, 80], y: [-100, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    /* life: the coloured sheet (whole width, behind) */
    sky(S, DAY);
    const hi = S.layer({ par: 0.05, sh: 3 });
    const sunEl = hanging(hi, sun(c, 40), { x: 1260, y: 160, len: 700 });
    const cl = hanging(hi, cloud(c, 180), { x: 1080, y: 130, len: 700 });
    const rad = hi.add(`<g><circle r="160" fill="url(#halo-glow)"/>${radiance(c, 60)}</g>`);
    const lifeL = S.layer({ par: 0.2, sh: 2 });
    const hb = band(c, { y: 480, amps: [22, 8, 3], lens: [1100, 380, 130], color: C.hillMid });
    lifeL.add(hb.markup + olive(c, 1120, 486, 0.8) + olive(c, 1400, 480, 0.7));
    const gL = S.layer({ par: 0.34, sh: 3 });
    const g = band(c, { y: F - 30, amps: [8, 3, 1], lens: [900, 300, 110], color: C.hillNear });
    gL.add(g.markup + grass(c, { x0: -900, x1: 2500, y: F - 30, n: 60, h: 14, color: C.moss, fn: g.fn }) + flowers(c, { x0: SEAM, x1: 2400, y: F - 20, n: 40, fn: (x) => g.fn(x) + 14, h: 12 }));
    /* death: a grey sheet over the left half, torn along the seam */
    const deadL = S.layer({ par: 0.34, sh: 8 });
    const ds = sheet();
    const edge = tearPts(c, SEAM, -900, 1800);
    ds.p(c.cut([[-2600, -900], ...edge, [-2600, 1800]], 0.6, 20), mix(C.stone2, '#b9b8b6', 0.5));
    ds.p(c.ridge(c.wave(490, [22, 8], [1100, 380]), -2600, SEAM - 20, 1800, 14, 1), mix(C.stone2, C.rock2, 0.3));
    ds.p(c.ridge(g.fn, -2600, SEAM - 30, 1800, 14, 1), mix(C.stone, C.rock2, 0.4));
    // a bare tree
    ds.p(c.ribbon([[380, 500], [384, 430], [370, 390]], 7) + c.ribbon([[383, 450], [410, 420], [424, 400]], 4) + c.ribbon([[378, 420], [350, 400]], 3), mix(C.rock3, C.stone2, 0.3));
    ds.x(c.ribbon(edge, 5), C.cream, 'opacity=".9"');
    deadL.add(ds.out());

    /* the dead on the grey ground, and the ones who rise */
    const L = S.layer({ par: 0.4, sh: 5 });
    const DEAD = [[430, 0], [610, 1]].map(([x, i]) => {
      const o = { ...crowdPerson(c), mantle: null };
      return { i, x, grey: L.add(lyingOn(c, { ...silhouette(o, GREYC) }, { s: 0.66, w: 140, mat: false, eyes: 'closed' })), live: S.puppet(L.add(person(c, { ...o, pose: 'sit' }))), light: L.add(`<g>${soulLight(c, 9)}</g>`), seed: c.rr(0, 9) };
    });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(L, c, { n: 4, color: C.halo, r: 40, w: 6 });
    const flameAt = L.add(`<g><circle r="46" fill="url(#warm-glow)"/><g transform="translate(0 16)">${wordFlame(c, 34)}</g></g>`);
    const sc = L.add(`<g>${sceptre(c)}</g>`);

    /* the listener: grey, then in colour */
    const P = S.layer({ par: 0.5, sh: 6 });
    const lo = { robe: C.tealRobe, mantle: C.ochreRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather };
    const greyMan = S.puppet(P.add(person(c, silhouette(lo, mix(C.rock3, C.stone2, 0.3)))));
    const man = S.puppet(P.add(person(c, lo)));
    const ring = P.add(`<g>${eternityRing(c, 120, 6, 26)}</g>`);
    const heartL = P.add(`<g><circle r="40" fill="url(#warm-glow)"/>${heart(c, 11)}</g>`);
    const slips = [0, 1, 2, 3].map((i) => ({ i, el: P.add(`<g><circle r="24" fill="url(#halo-glow)"/>${wordSlip(c, 44)}</g>`) }));

    /* the flies: judgment's scales over the grey path, the dial, the title */
    const X = S.layer({ par: 0.3, sh: 5 });
    const bal = balanceRig(S, X, 90);
    const sadT = X.add(hungWord(c, tr('sąd', 'judgment'), { size: 20 }));
    const dialEl = X.add(`<g>${dial(c, 58)}</g>`);
    const hand = X.add(`<g><path d="${c.ribbon([[0, 6], [0, -44]], 5)}" fill="${C.ink}"/><path d="${c.poly([[-7, -40], [0, -54], [7, -40]])}" fill="${C.ink}"/><circle r="6" fill="${C.terracotta}"/></g>`);
    const somT = X.add(hungWord(c, tr('Syn Człowieczy', 'Son of Man'), { size: 22 }));

    const JX = SEAM, JY = F - 26, JS = 1.02;
    return (t, time) => {
      const T = time;
      swing(sunEl, 1260, 160, T, 1, 0.6);
      swing(cl, 1080 + Math.sin(T * 0.1) * 20, 130, T, 1.2, 0.6, 1);
      const r26 = es(t, 4.05, 4.35) * (1 - es(t, 5.0, 5.3));
      pose(rad, { x: 1010, y: lerp(-220, 150, es(t, 3.9, 4.2, ease.out)) - es(t, 5.0, 5.4) * 400, r: T * 3 });

      /* Jesus at the seam */
      const speak = bump(t, 0.05, 0.95) + bump(t, 2.05, 2.95);
      const rod = es(t, 5.3, 5.55);
      jesus.set({ x: JX, y: JY, s: JS, flip: false, armF: 20 + speak * 50 + rod * 20, armB: 10 + bump(t, 2.1, 2.9) * 110 + es(t, 4.3, 4.6) * 40 * (1 - rod) + rod * 110, head: -speak * 4 - r26 * 10, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(JX, JY, JS, false);
      voice(jhx - 30, jhy + 10, bump(t, 2.15, 3.2), T, { dir: -1, spread: 5, speed: 0.4 });

      /* v24a — the grey man hears the word and believes */
      const walk = es(t, 1.1, 1.85, ease.sine);
      const mx = lerp(500, 1060, walk);
      const col = seg(mx, SEAM - 30, SEAM + 40);
      const listen = es(t, 0.3, 0.55) * (1 - walk);
      const common = { x: mx, y: F + 8, s: 1, flip: false, walk: walk > 0 && walk < 1 ? mx * 0.08 : undefined, armF: 20 + listen * 30, armB: 10 + listen * 120, head: -listen * 14 + es(t, 1.9, 2.1) * -6, blink: blinkAt(T, 3) };
      greyMan.set({ ...common, o: 1 - col });
      man.set({ ...common, o: col });
      slips.forEach((s) => {
        const k = seg(t, 0.15 + s.i * 0.14, 0.5 + s.i * 0.14);
        vis(s.el, { x: lerp(jhx - 20, 540, k), y: lerp(jhy, F - 170, k) - Math.sin(k * PI) * 70, r: Math.sin(T * 3 + s.i) * 8, s: 0.6 + (1 - k) * 0.3, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const [mhx, mhy] = headAt(mx, F + 8, 1, false);
      vis(heartL, { x: mx + 6, y: F - 108, s: es(t, 0.6, 0.8, ease.back), o: es(t, 0.6, 0.65) });
      drawRing(ring, es(t, 0.7, 1.0));
      vis(ring, { x: mx, y: F - 100, sy: 1, o: t > 0.7 ? 1 : 0 });

      /* v24b — no judgment: the scales hang over the grey path; he passes by */
      const bk = es(t, 0.95, 1.2, ease.out) * (1 - es(t, 2.0, 2.2));
      bal.set(600, 190 - (1 - bk) * 460, Math.sin(T * 0.8) * 2 * bk, bk > 0.01 ? 1 : 0);
      vis(sadT, { x: 600, y: 390 - (1 - bk) * 460, r: Math.sin(T * 0.8) * 2, o: bk > 0.01 ? 1 : 0 });

      /* v25a — the hour is coming, and now is */
      const dk = es(t, 2.05, 2.35, ease.back) * (1 - es(t, 3.0, 3.3));
      const DX = 650, DY = 240 - (1 - dk) * 440;
      vis(dialEl, { x: DX, y: DY, o: dk > 0.01 ? 1 : 0 });
      vis(hand, { x: DX, y: DY, r: lerp(-150, 0, es(t, 2.25, 2.7, ease.out)), o: dk > 0.01 ? 1 : 0 });
      /* v25b — those who hear shall live */
      DEAD.forEach((d) => {
        const k = es(t, 3.1 + d.i * 0.2, 3.45 + d.i * 0.2);
        pose(d.grey, { x: d.x, y: F + 8, o: 1 - seg(k, 0.1, 0.4) });
        d.live.set({ x: d.x - 30, y: F + 8 + (1 - k) * 30, s: 0.92, flip: false, armF: 30 + k * 60, armB: 20 + k * 100, head: -k * 16, blink: blinkAt(T, d.seed), o: seg(k, 0.1, 0.4) });
        const [hx, hy] = headAt(d.x - 30, F + 8, 0.92, false, 'sit');
        vis(d.light, { x: hx, y: hy - 44 + Math.sin(T * 2 + d.i) * 3, s: es(k, 0.4, 0.9, ease.back), o: k > 0.3 ? 1 : 0 });
      });

      /* v26 — life in Himself: the flame comes down to His heart */
      const fk = es(t, 4.3, 4.8, ease.io);
      vis(flameAt, { x: lerp(1010, JX + 4, fk), y: lerp(170, JY - 112, fk), s: lerp(1.4, 0.8, fk) + Math.sin(T * 5) * 0.03, o: es(t, 4.1, 4.3) });

      /* v27 — authority to judge, because He is the Son of Man */
      const [hx, hy] = handAt(JX, JY, JS, false, 10 + 110);
      vis(sc, { x: lerp(1010, hx - 18, rod), y: lerp(-60, hy - 60, rod), r: -10, o: t > 5.1 ? 1 : 0 });
      const sk = es(t, 5.5, 5.75, ease.back);
      vis(somT, { x: 1020, y: 230 - (1 - sk) * 420, r: Math.sin(T * 0.7) * 1.5, o: sk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -80], [1.0, -60], [1.9, 60], [2.2, -40], [3.0, -60], [3.9, -20], [4.5, 0], [5.4, 20]]);
      S.cam.y = kf(t, [[0, 10], [1.0, -20], [2.0, 10], [2.4, -30], [3.0, 20], [4.0, -60], [4.8, 0], [5.4, -20]]);
      S.cam.z = kf(t, [[0, 1.12], [1.0, 1.06], [2.0, 1.1], [3.0, 1.1], [4.0, 1.02], [4.8, 1.12], [5.4, 1.06]]);
    };
  },
};
