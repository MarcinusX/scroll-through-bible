// J 17,20–21 — "Not for these only do I pray": the camera draws far back — the little slope where He stands among
// the Eleven turns out to be the top of the whole round world, hanging in the night. "But also for those who will
// believe in Me through their word": a ribbon of light — their word — runs down over the curve of the world both ways,
// and people of later ages appear along it one after another, each with a small light: a woman of Rome in the first
// century with her clay lamp, a monk with a book, a pilgrim with his staff, a mother with a candle — and someone of
// today, reading, in the light of a lamp. "That they may all be one": countless small lights wake all over the
// globe. "As You, Father, are in Me and I in You": the radiance comes down and He stands within it, a ring round
// them both. "That they also may be one in Us": from every light a thread runs up to Him, and all the threads
// gather into one great light. "That the world may believe that You sent Me": the whole globe grows warm and bright.
import { es, ease, bump } from '../../core/anim.js';
import {
  eleven, jesusOn, put, lampK, headOf, chestOf, fatherLight, nightGlobe, globeLights, believer, readerNook, AGES, strip,
  eternityRing, drawRing, rayBurst, lightPath, drawPath, lineD, curves, spark, sky, vis, kf, pose, fade, tr, C, JX, NIGHT,
  COSMOS, HOLY, PRAY, PI, lerp,
} from './lib.js';
import { stars } from '../../assets/nature.js';

const GC = [800, 1560], GR = 940;
const rimY = (x) => GC[1] - Math.sqrt(GR * GR - (x - GC[0]) * (x - GC[0]));
const angAt = (x) => (Math.asin((x - GC[0]) / GR) * 180) / PI;
const JY9 = rimY(800) + 6;
// the Eleven huddled close around Him on the top of the world
const HUD = [['andrew', 590, 18], ['james', 628, 4], ['thomas', 664, 24], ['john', 700, 8], ['peter', 736, 30],
  ['matthew', 866, 30], ['philip', 900, 8], ['bartholomew', 936, 24], ['jamesA', 972, 4], ['thaddaeus', 1008, 18], ['simonZ', 1040, 6]]
  .map(([k, x, dy]) => ({ k, x, y: rimY(x) + 12 + dy }));
// believers of later ages along the curve
const AGE_X = [530, 420, 312, 1082, 1200];
const RIBBON_L = Array.from({ length: 30 }, (_, i) => { const x = lerp(590, 250, i / 29); return [x, rimY(x) + 6]; });
const RIBBON_R = Array.from({ length: 30 }, (_, i) => { const x = lerp(1040, 1290, i / 29); return [x, rimY(x) + 6]; });

export default {
  id: 'j17-future',
  beats: [
    { v: 20, text: 'Nie tylko za nimi proszę,' },
    { v: 20, cont: true, text: 'ale i za tymi, którzy dzięki ich słowu będą wierzyć we Mnie;' },
    { v: 21, text: 'aby wszyscy stanowili jedno,' },
    { v: 21, cont: true, text: 'jak Ty, Ojcze, we Mnie, a Ja w Tobie,' },
    { v: 21, cont: true, text: 'aby i oni stanowili w Nas jedno,' },
    { v: 21, cont: true, text: 'aby świat uwierzył, żeś Ty Mnie posłał.' },
  ],
  cam: { x: [-10, 30], y: [-60, 200], z: [0.64, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, NIGHT, { bottom: 1200 });
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -900, x1: 2500, y0: -1200, y1: 1400, n: 260 }));

    const hiL = S.layer({ par: 0.9, sh: 3 });
    const great = hiL.add(`<g>${rayBurst(c, { n: 34, r0: 60, r1: 900, spread: 0.03, o: 0.22 })}<circle r="600" fill="url(#halo-glow)" opacity=".8"/></g>`);
    const high = hiL.add(`<g>${fatherLight(c, 70)}</g>`);
    const ring = hiL.add(`<g>${eternityRing(c, 150, 7, 36)}</g>`);

    // the globe (dark), its lit twin, the lights and threads
    const HUB = [0, (JY9 - 130) - GC[1]];
    const g1 = nightGlobe(c, GR, { n: 300, W: 7, dark: true, src: [0, -GR], hub: HUB, star: false });
    const globeL = S.layer({ par: 1, sh: 4 });
    globeL.add(`<g transform="translate(${GC[0]} ${GC[1]})">${g1.base}</g>`);
    const litL = S.layer({ par: 1, sh: 0, flat: true });
    const warm = S.id('warmG');
    S.defs(`<radialGradient id="${warm}" cx=".5" cy=".1" r=".9"><stop offset="0" stop-color="#ffe3a0" stop-opacity=".72"/><stop offset=".5" stop-color="#f5c07e" stop-opacity=".42"/><stop offset="1" stop-color="#e9a07a" stop-opacity=".22"/></radialGradient>`);
    litL.add(`<circle cx="${GC[0]}" cy="${GC[1]}" r="${GR}" fill="url(#${warm})"/>`);
    const lightsL = S.layer({ par: 1, sh: 0, flat: true });
    const lights = lightsL.add(`<g transform="translate(${GC[0]} ${GC[1]})">${g1.lights}</g>`);

    // the word running over the curve, the people of later ages
    const ribL = S.layer({ par: 1, sh: 0, flat: true });
    const ribs = [RIBBON_L, RIBBON_R].map((pts) => ribL.add(`<g>${lightPath(lineD(pts), { w: 4, col: C.halo })}</g>`).firstElementChild);
    const ageL = S.layer({ par: 1, sh: 4 });
    const ages = AGES.map((a, i) => {
      const x = AGE_X[i], y = rimY(x) + 4, r = angAt(x);
      const reader = a.k === 'reader';
      const inner0 = (reader ? `<g transform="translate(0 -4)">${readerNook(c)}</g>` : '') + believer(c, a, reader ? { pose: 'sit' } : {});
      const inner = x > 800 ? `<g transform="scale(-1 1)">${inner0}</g>` : inner0;
      const el = ageL.add(`<g><circle cy="-80" r="90" fill="url(#halo-glow)"/>${inner}</g>`);
      const lab = a.label;
      const tag = ageL.add(`<g>${strip(c, tr(lab[0] + (lab[1] ? ' · ' + lab[1] : ''), lab[2] + (lab[3] ? ' · ' + lab[3] : '')), { size: 17 })}</g>`);
      return { x, y, r, el, tag, s: reader ? 0.8 : 0.78, flip: x > 800 };
    });
    const ageThr = curves(ageL, 5, { color: C.halo, w: 2 });

    // the Eleven and Jesus on top
    const peopleL = S.layer({ par: 1, sh: 5 });
    const D = eleven(S, peopleL, { pos: HUD, s: 0.66 });
    const J = jesusOn(S, peopleL, { y: JY9, s: 0.95 });
    const fx = S.layer({ par: 1, sh: 0, flat: true });
    const jGlow = ribL.add(`<g><circle r="160" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      /* v20a — the camera draws back: the slope is the top of the world */
      const back = es(t, 0.1, 0.95);
      sk.blend(NIGHT, COSMOS, back);
      /* v20b — the word runs down both ways; later believers appear along it */
      const rw = es(t, 1.05, 1.75);
      ribs.forEach((p) => drawPath(p, rw));
      ages.forEach((a, i) => {
        const u = i < 3 ? (590 - a.x) / (590 - 250) : (a.x - 1040) / (1290 - 1040);
        const k = es(t, 1.05 + u * 0.7, 1.2 + u * 0.7, ease.back);
        vis(a.el, { x: a.x, y: a.y, r: a.r, s: a.s * Math.max(0.01, k), o: k > 0.01 ? 1 : 0 });
        vis(a.tag, { x: a.x + Math.sin((a.r * PI) / 180) * 70, y: a.y + 44, r: a.r * 0.6, s: 1, o: es(t, 1.15 + u * 0.7, 1.3 + u * 0.7) * (1 - es(t, 2.1, 2.4) * 0.6) });
        const [hx, hy] = [a.x - Math.sin((a.r * PI) / 180) * 70, a.y - Math.cos((a.r * PI) / 180) * 70];
        ageThr(i, [hx, hy], [JX, JY9 - 130], -40, es(t, 4.1 + i * 0.05, 4.5 + i * 0.05), 0.9);
      });
      /* v21a — countless lights; v21c — the threads join them into one */
      globeLights(lights, es(t, 2.05, 2.8), es(t, 4.05, 4.7));
      /* v21b — You in Me and I in You: the radiance comes down round Him */
      const dn = es(t, 3.05, 3.5);
      const one = es(t, 4.4, 4.9);
      vis(high, { x: JX, y: lerp(250, JY9 - 118, dn), s: (1 + dn * 0.6) * (1 + one * 0.5), r: T * 1.5, o: 1 - dn * 0.35 });
      vis(great, { x: JX, y: lerp(250, JY9 - 118, dn), s: 0.6 + one * 0.5 + es(t, 5.1, 5.6) * 0.3, r: t * 4, o: 0.4 + dn * 0.3 + one * 0.3 });
      const rk = es(t, 3.35, 3.8);
      vis(ring, { x: JX, y: JY9 - 118, sy: 1.1, r: -T * 2, o: rk > 0.01 ? 1 : 0 });
      drawRing(ring, rk);
      vis(jGlow, { x: JX, y: JY9 - 110, s: 0.8 + dn * 0.6 + one * 0.6, o: 0.5 + dn * 0.5 });
      /* v21d — the world believes: the globe grows warm */
      litL.fade(es(t, 5.05, 5.7));
      fade(lights, 1);

      D.forEach((m) => { put(m, T, { head: -12 - es(t, 3.1, 3.5) * 8 }); lampK(m, 0.9); });
      put(J, T, { head: PRAY.head - dn * 4, armF: PRAY.armF + es(t, 4.1, 4.5) * 10, armB: PRAY.armB + es(t, 4.1, 4.5) * 10 });

      S.cam.x = kf(t, [[0, 0], [1.2, 0], [1.9, 10], [2.2, 0]]);
      S.cam.y = kf(t, [[0, 60], [0.95, 170], [2, 170], [3, 130], [4, 150], [5, 160], [6, 170]]);
      S.cam.z = kf(t, [[0, 1.1], [0.95, 0.66], [2, 0.66], [3, 0.72], [4, 0.68], [5, 0.66], [6, 0.68]]);
    };
  },
};
