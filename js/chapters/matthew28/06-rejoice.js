// Mt 28,9–10 — On the road, "behold": a burst of light, and Jesus stands before them. "Rejoice!" — and all along
// the road the buds open into flowers. They come to Him, sink down, take hold of His feet and bow to the ground.
// "Do not be afraid": He stoops, His hand over them, and they lift their faces. "Go and tell my brothers to go to
// Galilee; there they will see me": He points far away to the north, where a mountain by a lake catches the light;
// the faces of the brothers come down on their strings, and the women get up and hurry on towards the city.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, flock } from '../kit.js';
import { sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { MAGD, MARYJ, ELEVEN, GOLD, roadSet, roadY, medallion, bubble, strip, heart, sparkle, glory, headAt, buds, blooms, voiceRings, withFace, faceBits, bird, tr, sheet, mix } from './lib.js';

const JX = 760, JY = 712;          // where He stands on the road

export default {
  id: 'mt28-rejoice',
  beats: [
    { v: 9, text: 'A oto Jezus stanął przed nimi i rzekł: «Witajcie!»' },
    { v: 9, cont: true, text: 'One podeszły do Niego, objęły Go za nogi i oddały Mu pokłon.' },
    { v: 10, text: 'A Jezus rzekł do nich: «Nie bójcie się!' },
    { v: 10, cont: true, text: 'Idźcie i oznajmijcie moim braciom: niech idą do Galilei, tam Mnie zobaczą».' },
  ],
  cam: { x: [-60, 80], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 48, { rays: C.sunDeep }), { x: 1260, y: 150, len: 900 });
    const cl = hanging(hangL, cloud(c, 170), { x: 540, y: 160, len: 700 });
    const birds = flock(S, hangL, 5, (cc) => bird(cc, { color: C.bird }), { y: 220, speed: 55, scale: 0.45 });

    const R = roadSet(S, { cityX: -60, tombX: 1700, flowersOn: false });
    /* far to the north: a mountain by a lake, catching the light */
    const north = R.far;   // on the far horizon
    const ms = sheet();
    ms.p(c.cut([[1000, 470], [1120, 380], [1170, 360], [1210, 372], [1340, 470]], 1, 10), mix(C.hillFar, C.duskViolet, 0.18));
    ms.p(c.cut([[960, 478], [1380, 474], [1380, 490], [960, 494]], 0.6, 10), mix(C.lake, C.skyBlue, 0.4));
    const northM = north.add(`<g opacity="0">${ms.out()}</g>`);
    const northGlow = north.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/>${sparkle(c, 18)}</g>`);
    /* buds along the road that open */
    const spots = [[380, 730], [470, 760], [560, 745], [640, 770], [900, 780], [990, 760], [1080, 790], [1170, 770], [300, 790], [1260, 800], [720, 800], [840, 805]];
    const fl = spots.map(([x, y], i) => ({ x, y, i, b: R.ground.add(`<g transform="translate(${x} ${y})">${buds(c, 70, 5)}</g>`), f: R.ground.add(`<g>${blooms(c, 70, 5)}</g>`), d: Math.abs(x - JX) }));

    /* Jesus */
    const L = R.P;
    const gl = L.add(`<g>${glory(c, 260, 22)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const rings = voiceRings(L, c, { n: 3, color: C.halo, r: 34, w: 5, both: false });
    const [jhx, jhy] = headAt(JX, JY, 1.1, false);
    const hello = L.add(`<g>${bubble(c, tr('Witajcie!', 'Rejoice!'), { size: 26, tail: -1 })}</g>`);

    /* the two women: standing, kneeling at His feet */
    const W = [MAGD, MARYJ].map((o, i) => {
      const mk = (P) => S.puppet(R.front.add(withFace(person(c, { ...o, pose: P }), faceBits(c))));
      return { i, seed: c.rr(0, 9), st: mk('stand'), kn: mk('kneel') };
    });
    const joy = [0, 1, 2, 3].map((i) => R.front.add(`<g>${i % 2 ? sparkle(c, 12) : heart(c, 12, C.jesusMantle)}</g>`));

    /* my brothers */
    const fx = S.layer({ par: 0.3, sh: 5 });
    const MED = ELEVEN.map((m, i) => ({ i, el: hanging(fx, medallion(c, m.o, { r: 20 }), { x: 0, y: -1500, len: 900 }) }));
    const bros = fx.add(`<g>${strip(c, tr('moim braciom', 'my brothers'), { size: 18 })}</g>`);

    return (t, time) => {
      swing(sunEl, 1260, 150, time, 0.8, 0.5);
      swing(cl, 540 + (time ? Math.sin(time * 0.1) * 30 : 0), 160, time, 1.2, 0.6, 1);
      birds(time, 1);

      /* v9a: behold — Jesus stands before them: "Rejoice!" */
      const come = es(t, 0.05, 0.3);
      const shine = bump(t, 0.02, 0.6);
      pose(gl, { x: JX, y: JY - 110, s: 0.5 + come * 0.4 + shine * 0.4, r: t * 5, o: 0.25 + shine * 0.6 + come * 0.2 - es(t, 1.2, 1.6) * 0.15 });
      const stoop = es(t, 2.05, 2.3) * (1 - es(t, 3.0, 3.2));
      const point = es(t, 3.05, 3.35);
      jesus.set({ x: JX, y: JY, s: 1.1, o: come, flip: false, armF: 20 + es(t, 0.2, 0.4) * 50 * (1 - es(t, 1.0, 1.3)) + stoop * 40 + point * 80, armB: 16 + es(t, 0.2, 0.4) * 80 * (1 - es(t, 1.0, 1.3)) + stoop * 30, head: stoop * 16 - point * 10, lean: stoop * 8, blink: blinkAt(time) });
      rings(jhx + 22, jhy, bump(t, 0.2, 0.95) + bump(t, 2.02, 2.9) + bump(t, 3.02, 3.9) * 0.7, time, { dir: 1, spread: 1.8 });
      const hk = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(hello, { x: jhx + 70, y: jhy - 40, s: hk, o: hk > 0.01 ? 1 : 0 });
      const bl = es(t, 0.3, 1.0);
      fl.forEach((m) => {
        const k = Math.max(0, Math.min(1, bl * 1.8 - m.d / 700));
        fade(m.b, 1 - Math.min(1, k * 2));
        pose(m.f, { x: m.x, y: m.y, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v9b: they come, take hold of His feet and worship; v10a: "Do not be afraid" — they lift their faces;
         v10b: they get up and hurry on to the city */
      const near = es(t, 1.05, 1.35, ease.out);
      const down = seg(t, 1.35, 1.42);
      const up = seg(t, 3.28, 3.35);
      const off = es(t, 3.8, 4.0, ease.in);
      const heads = [];
      W.forEach((w) => {
        const x0 = [1010, 1120][w.i];
        const xk = [JX + 122, JX + 214][w.i];
        const x = lerp(x0, xk, near) + (up ? -off * (700 + w.i * 60) : 0);
        const y = JY + 4 + w.i * 6;
        const surprise = es(t, 0.15, 0.35) * (1 - near);
        const lifted = es(t, 2.2, 2.5);
        w.st.set({ x, y, s: 1.02, flip: true, o: (1 - down) + up, walk: (near > 0 && near < 1) || (off > 0 && off < 1) ? x * 0.06 + w.i : undefined, amt: 0.9, armF: 20 + surprise * 60 + off * 20, armB: 10 + surprise * 100, head: -surprise * 6, lean: off * 10, blink: blinkAt(time, w.seed) });
        w.kn.set({ x: x - 10, y, s: 1.02, flip: true, o: down * (1 - up), armF: 96 - lifted * 36, armB: 76 - lifted * 20, head: 24 - lifted * 26, lean: 34 - lifted * 24, blink: lifted > 0.5 ? blinkAt(time, w.seed) : 1 });
        heads.push(headAt(x - 10, y, 1.02, true, down && !up ? 46 : 0));
      });
      joy.forEach((el, i) => {
        const b = bump(t, 1.4 + i * 0.08, 2.0 + i * 0.08) + bump(t, 2.3 + i * 0.06, 2.9);
        const h = heads[i % 2];
        pose(el, { x: h[0] - 10 + (i - 1.5) * 26, y: h[1] - 40 - (i % 2) * 20, s: Math.min(1, b), r: time * 30, o: Math.min(1, b) });
      });

      /* v10b: go and tell my brothers — Galilee, far to the north */
      const nk = es(t, 3.1, 3.4);
      fade(northM, nk);
      pose(northGlow, { x: 1170, y: 350, s: 0.6 + nk * 0.5 + (time ? Math.sin(time * 1.3) * 0.03 : 0), r: time * 20, o: nk });
      MED.forEach((m) => {
        const k = es(t, 3.1 + m.i * 0.03, 3.45 + m.i * 0.03, ease.back);
        const row = m.i < 6 ? 0 : 1;
        swing(m.el, row ? 545 + (m.i - 6) * 50 : 520 + m.i * 50, lerp(-900, row ? 330 : 280, k), k > 0.001 ? time : 0, 1.2, 0.8, m.i);
      });
      const bk = es(t, 3.4, 3.6, ease.back);
      pose(bros, { x: 660, y: 386, s: bk, r: -2, o: bk > 0.01 ? 1 : 0 });

      S.cam.x = 20 + es(t, 3.05, 3.4) * 40;
      S.cam.y = 20 - es(t, 3.05, 3.4) * 30;
      S.cam.z = 1.02 + es(t, 1.1, 1.5) * 0.03 * (1 - es(t, 3.0, 3.4));
    };
  },
};
