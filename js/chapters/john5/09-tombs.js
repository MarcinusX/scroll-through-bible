// J 5,28–30 — night on a hillside of rock-cut tombs. "Do not marvel at this" — the leaders' astonishment fades
// as Jesus lifts a calming hand. The hour is coming when all in the tombs will hear His voice: great rings of
// sound roll over the hill and a small light wakes in every doorway. The stones roll back: those who did good
// come out in white and climb a path of light to the dawn; those who did evil come out grey and stand with
// bowed heads under a cloud (gently). Then all grows dim but Him: "I can do nothing of myself" — He looks up
// to the light with open hands; "as I hear, I judge" — the voice comes down to Him and the scales hang level,
// true; "I seek not my own will but the will of Him who sent me" — He turns onto the path of light.
import { C, person, CAST, crowdPerson, blinkAt, lerp, mix, shade, sky, sheet } from '../kit.js';
import { band, stars, moon, rock } from '../../assets/nature.js';
import { stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import {
  NIGHT, tomb, radiance, rayBurst, voiceRings, balanceRig, leaderOpts, withFace, faceBits, bang, silhouette, beamGrad, lightBeam, tick, hungWord, soulLight,
  vis, kf, headAt, hanging, swing, tr, PI,
} from './lib.js';

const F = 710;
const TW = 70, TH = 84;
const TOMBS = [[360, 470, 0.9, 1], [620, 455, 0.85, 0], [1000, 452, 0.85, 1], [1260, 470, 0.9, 1], [480, 575, 1.05, 0], [1140, 572, 1.05, 1]];
const DAWN = ['#3a3f72', '#8f7fa8', '#e7b596'];

export default {
  id: 'j5-tombs',
  beats: [
    { v: 28, text: 'Nie dziwcie się temu!' },
    { v: 28, cont: true, text: 'Nadchodzi bowiem godzina, w której wszyscy, którzy spoczywają w grobach, usłyszą głos Jego:' },
    { v: 29, text: 'a ci, którzy pełnili dobre czyny, pójdą na zmartwychwstanie życia;' },
    { v: 29, cont: true, text: 'ci, którzy pełnili złe czyny - na zmartwychwstanie potępienia.' },
    { v: 30, text: 'Ja sam z siebie nic czynić nie mogę.' },
    { v: 30, cont: true, text: 'Tak, jak słyszę, sądzę, a sąd mój jest sprawiedliwy;' },
    { v: 30, cont: true, text: 'nie szukam bowiem własnej woli, lecz woli Tego, który Mnie posłał.' },
  ],
  cam: { x: [-60, 80], y: [-100, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;
    const DAWNX = ph ? 1090 : 1330;   // phone: the dawn and the way up to it are inside the screen
    const sk = sky(S, NIGHT);
    const starL = S.layer({ par: 0.02, sh: 0, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 90 }));
    const hi = S.layer({ par: 0.05, sh: 3 });
    const moonEl = hanging(hi, moon(c, 34), { x: 420, y: 150, len: 700 });
    const dawn = hi.add(`<g>${rayBurst(c, { n: 18, r0: 50, r1: 380, spread: 0.05, o: 0.45 })}<circle r="200" fill="url(#halo-glow)"/>${radiance(c, 54)}</g>`);

    /* the hill of tombs */
    const hill = S.layer({ par: 0.2, sh: 3 });
    const hs = sheet();
    hs.p(c.ridge(c.wave(400, [30, 12, 4], [1000, 360, 120]), -1400, 3000, 1800, 14, 1.4), mix(C.rock2, C.storm, 0.35));
    hs.p(c.ridge(c.wave(520, [16, 6, 3], [900, 300, 100]), -1400, 3000, 1800, 14, 1.2), mix(C.rock, C.storm, 0.35));
    hill.add(hs.out());
    // the path of light up to the dawn (right)
    const pathL = S.layer({ par: 0.2, sh: 0, flat: true });
    const path = pathL.add(`<path d="${c.poly(ph ? [[960, 560], [1060, 560], [1110, 340], [1080, 330]] : [[1000, 560], [1100, 560], [1340, 340], [1310, 330]])}" fill="${C.halo}" opacity=".7"/>`);
    const TL = S.layer({ par: 0.2, sh: 4 });
    const T = TOMBS.map(([x, y, s, good], i) => {
      TL.add(`<g transform="translate(${x} ${y}) scale(${s})">${tomb(c, TW, TH, { stone: false, face: mix(C.rock2, C.storm, 0.25) })}</g>`);
      const glow = TL.add(`<g><ellipse rx="${TW * 0.46 * s}" ry="${TH * 0.4 * s}" fill="${C.lampGlow}"/><circle r="${50 * s}" fill="url(#warm-glow)"/></g>`);
      const o = good ? { robe: C.linen, mantle: null, skin: c.pick([C.skin, C.skin2, C.skin3]), hair: c.pick([C.hair, C.hair2, C.greyHair]), hairStyle: c.pick(['short', 'veil', 'curly']), veil: C.linen2, beard: 'none' } : silhouette(crowdPerson(c), mix(C.stone2, C.storm, 0.25));
      const fig = S.puppet(TL.add(person(c, o)));
      const stone = TL.add(`<g><path d="${c.cut(c.circ(0, 0, TH * 0.44, 22), 0.8, 5)}" fill="${mix(C.rock2, C.storm, 0.15)}"/><path d="${c.ribbon(c.arc(0, 0, TH * 0.3, TH * 0.3, PI * 1.1, PI * 1.6, 6), 2)}" fill="${shade(C.rock2, -0.25)}"/></g>`);
      const rim = TL.add(`<g><circle r="${56 * s}" fill="url(#warm-glow)"/></g>`);
      return { x, y, s, good, i, glow, fig, stone, rim, seed: c.rr(0, 9) };
    });
    const cloudBad = TL.add(`<g>${stormCloud(c, 200, mix(C.storm2, C.plumRobe, 0.2), C.storm2)}</g>`);

    /* the ground at the front */
    const gL = S.layer({ par: 0.4, sh: 3 });
    gL.add(band(c, { y: F - 26, amps: [6, 3, 1], lens: [800, 260, 90], color: mix(C.sand2, C.storm, 0.3) }).markup + rock(c, 250, F - 20, 120, 50, mix(C.rock2, C.storm, 0.3)) + rock(c, 1380, F - 18, 140, 56, mix(C.rock2, C.storm, 0.3)));

    /* the leaders (they will be dimmed with the hill) */
    const L1 = S.layer({ par: 0.5, sh: 5 });
    const LEAD = [0, 1].map((i) => {
      const el = L1.add(withFace(person(c, leaderOpts(i + 2)), faceBits(c)));
      return { i, p: S.puppet(el), bang: L1.add(`<g>${bang(c, C.terracotta, 1)}</g>`), seed: c.rr(0, 9) };
    });

    /* everything dims but Him */
    const dimL = S.layer({ par: 0, sh: 0, flat: true });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#15132a"/>`);

    const L2 = S.layer({ par: 0.5, sh: 6 });
    const spot = L2.add(`<g><ellipse rx="190" ry="250" fill="url(#halo-glow)"/></g>`);
    const bid = beamGrad(S, 'beam');
    const beam = L2.add(`<g>${lightBeam(bid, 40, 240, 620)}</g>`);
    const jesus = S.puppet(L2.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(L2, c, { n: 4, color: C.halo, r: 60, w: 7 });
    const down = voiceRings(L2, c, { n: 3, color: C.halo, r: 30, w: 5, both: false });
    const X = S.layer({ par: 0.36, sh: 5 });
    const bal = balanceRig(S, X, 110);
    const ok = X.add(`<g><circle r="26" fill="${C.cream}"/>${tick(c, 16, C.moss)}</g>`);
    const willT = X.add(hungWord(c, tr('moja wola', 'my own will'), { size: 18 }));
    const willX = X.add(`<g><path d="${c.ribbon([[-60, -10], [60, 10]], 4)}" fill="${C.terracotta}" opacity=".85"/></g>`);

    const JX = 800;
    return (t, time) => {
      const Tm = time;
      /* dawn begins on the right as the good rise; the rest dims at v30 */
      const dawnK = es(t, 1.9, 2.7);
      sk.blend(NIGHT, DAWN, dawnK * 0.8);
      starL.fade(1 - dawnK * 0.6);
      swing(moonEl, 420, 150 + dawnK * 80, Tm, 1, 0.6);
      pose(dawn, { x: DAWNX, y: lerp(560, 320, dawnK), r: Tm * 2, s: 0.6 + dawnK * 0.4 });
      fade(dawn, dawnK);
      const dim = es(t, 4.0, 4.4) * (1 - es(t, 6.6, 6.95) * 0.5);
      dimL.fade(dim * 0.6);
      fade(path, es(t, 2.05, 2.4) * 0.45);

      /* v28a — "Do not marvel at this" */
      const calm = bump(t, 0.1, 0.95);
      const speak = bump(t, 1.05, 1.95);
      LEAD.forEach((l) => {
        const x = ph ? 1010 + l.i * 70 : 1180 + l.i * 90;
        const shock = 1 - es(t, 0.55, 0.9);
        l.p.set({ x, y: F + 6 - l.i * 6, s: 1, flip: true, armF: 20 + shock * 60, armB: 10 + shock * 120, head: -shock * 8 + es(t, 1.2, 1.6) * -14, blink: blinkAt(Tm, l.seed) });
        const [hx, hy] = headAt(x, F + 6 - l.i * 6, 1, true);
        vis(l.bang, { x: hx - 4, y: hy - 50, s: shock, r: l.i ? 10 : -10, o: shock > 0.02 ? 1 : 0 });
      });
      const empty = es(t, 4.05, 4.4) * (1 - es(t, 5.0, 5.2));
      const listen = es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.1));
      const go = es(t, 6.2, 6.9, ease.sine);
      const jx = lerp(JX, 900, go);
      jesus.set({ x: jx, y: F + 12, s: 1.06, flip: false, walk: go > 0 && go < 1 ? jx * 0.07 : undefined, armF: 20 + calm * 60 + speak * 50 + empty * 50 + listen * 20, armB: 10 + calm * 100 + speak * 60 + empty * 60, head: -empty * 18 - listen * 14 - go * 10, blink: blinkAt(Tm, 1) });
      const [jhx, jhy] = headAt(jx, F + 12, 1.06, false);
      voice(jhx, jhy + 10, bump(t, 1.1, 2.1), Tm, { spread: 7, speed: 0.35 });
      vis(spot, { x: jx, y: F - 110, o: dim });
      vis(beam, { x: jx, y: F - 620, o: dim * 0.9 });
      down(jhx - 6, jhy - 150, listen, Tm, { spread: 1.4, s0: 0.6, dir: 1 });

      /* v28b — a light wakes in every tomb; v29 — they come out */
      T.forEach((tb) => {
        const wake = es(t, 1.35 + tb.i * 0.06, 1.6 + tb.i * 0.06);
        const open = tb.good ? es(t, 2.05 + tb.i * 0.04, 2.35 + tb.i * 0.04) : es(t, 3.05 + tb.i * 0.03, 3.35 + tb.i * 0.03);
        const dx = TW * 0.95 * tb.s * open;
        pose(tb.stone, { x: tb.x + dx, y: tb.y - TH * 0.4 * tb.s, s: tb.s, r: open * 120 });
        vis(tb.glow, { x: tb.x, y: tb.y - TH * 0.34 * tb.s, s: 1 + Math.sin(Tm * 2 + tb.i) * 0.03, o: wake * (1 - (tb.good ? es(t, 2.9, 3.2) : 0)) });
        vis(tb.rim, { x: tb.x, y: tb.y - TH * 0.4 * tb.s, s: 1 + Math.sin(Tm * 2 + tb.i) * 0.05, o: wake * (1 - open) });
        const out = tb.good ? es(t, 2.3 + tb.i * 0.04, 2.6 + tb.i * 0.04) : es(t, 3.3, 3.6);
        const climb = tb.good ? es(t, 2.55 + tb.i * 0.05, 3.2 + tb.i * 0.05, ease.sine) : 0;
        const fx = lerp(tb.x, DAWNX - 10, climb), fy = lerp(tb.y + 2, 350, climb);
        tb.fig.set({ x: fx, y: fy, s: tb.s * 0.45 * (1 - climb * 0.35), flip: tb.good ? false : tb.x > 800, walk: climb > 0 && climb < 1 ? fx * 0.2 : undefined, armB: tb.good ? 30 + out * 100 : 5, armF: tb.good ? 40 + out * 60 : 5, head: tb.good ? -out * 10 : 22 * out, blink: 0, o: seg(out, 0, 0.3) * (1 - seg(climb, 0.8, 1)) });
      });
      const cb = es(t, 3.3, 3.6);
      vis(cloudBad, { x: 550, y: 400 + Math.sin(Tm) * 3, s: 0.6 + cb * 0.4, o: cb * 0.85 });

      /* v30b — as I hear, I judge; the scales hang level */
      const bk = es(t, 5.1, 5.4, ease.out) * (1 - es(t, 6.05, 6.3));
      const sway = Math.sin(Math.max(0, t - 5.3) * 8) * 10 * Math.max(0, 1 - (t - 5.3) * 2) * (t > 5.3 ? 1 : 0);
      const [pl] = bal.set(ph ? 975 : 1040, 190 - (1 - bk) * 460, sway, bk > 0.01 ? 1 : 0);
      vis(ok, { x: ph ? 975 : 1040, y: 196 - (1 - bk) * 460, s: es(t, 5.55, 5.7, ease.back), o: bk > 0.01 && t > 5.55 ? 1 : 0 });
      /* v30c — not my own will */
      const wk = es(t, 6.03, 6.2, ease.back) * (1 - es(t, 6.7, 6.95, ease.in));
      vis(willT, { x: 620 - es(t, 6.7, 6.95) * 160, y: 300 - es(t, 6.7, 6.95) * 380, r: Math.sin(Tm * 0.8) * 2, o: wk > 0.01 ? 1 : 0 });
      vis(willX, { x: 620 - es(t, 6.7, 6.95) * 160, y: 316 - es(t, 6.7, 6.95) * 380, s: es(t, 6.25, 6.35), o: wk > 0.01 && t > 6.25 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 40], [1.0, 20], [2.0, 0], [3.0, 60], [3.5, -20], [4.2, 0], [5.3, 40], [6.9, 60]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 0], [2.0, -60], [3.0, -60], [4.2, 20], [5.3, -20], [6.9, -20]]);
      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.02], [2.0, 1.04], [3.5, 1.06], [4.2, 1.14], [5.3, 1.06], [6.9, 1.1]]);
    };
  },
};
