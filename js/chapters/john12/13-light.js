// J 12,35–36 — dusk on the road below the Temple. "Yet a little while the light is with you": the sun hangs low and
// sinks; round Jesus a warm pool of light. "Walk while you have the light": little lamps kindle one by one along the
// path and the people walk it — while a ragged sheet of darkness slides in from the left. "Whoever walks in the dark
// does not know where he is going": in the dark a man gropes with his arms out before a signpost that has lost its
// words. "Believe in the light, that you may become children of light": small flames kindle over the listeners.
// Then He goes away up the road and is hidden from them; the stars come out, the lamps stay burning.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, moon, stars, olive, cypress, bush, rock, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { man, crowdPerson, people, place, darkSheet, soulLight, question, nameTag, hanging, swing, kf, vis, headAt, glowDisc, walledCity, tr, PI, FONT } from './lib.js';

const G = 690;
const SKY0 = ['#8f7fa8', '#e2a88e', '#f3cfa8'];
const SKY1 = ['#3d3f70', '#7d6a8e', '#c68f86'];
const SKY2 = ['#1d2349', '#2b3262', '#4a4876'];

export default {
  id: 'j12-light',
  beats: [
    { v: 35, text: 'Odpowiedział im więc Jezus: «Jeszcze przez krótki czas przebywa wśród was światłość.' },
    { v: 35, cont: true, text: 'Chodźcie, dopóki macie światłość, aby was ciemność nie ogarnęła.' },
    { v: 35, cont: true, text: 'A kto chodzi w ciemności, nie wie, dokąd idzie.' },
    { v: 36, text: 'Dopóki światłość macie, wierzcie w światłość, abyście byli synami światłości».' },
    { v: 36, cont: true, text: 'To powiedział Jezus i odszedł, i ukrył się przed nimi.' },
  ],
  cam: { x: [-60, 80], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKY0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: 380, n: 90 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1140, y: 300, len: 800 });
    const moonEl = hanging(hangL, moon(c, 28), { x: 480, y: 160, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [14, 6, 2], lens: [1000, 360, 120], color: mix(C.hillFar, C.duskViolet, 0.45), x0: -1400, x1: 3200 }).markup + walledCity(c, 1180, 470, 0.7, { wall: mix(C.stone, C.duskViolet, 0.35), wall2: mix(C.stone2, C.duskViolet, 0.4), temple: mix(C.cream, C.dusk, 0.2) }));
    const hills = S.layer({ par: 0.2, sh: 3 });
    hills.add(hillsWith(c, { y: 560, amps: [20, 8, 3], lens: [1100, 360, 120], color: mix(C.hillMid, C.plumRobe, 0.35), trees: 30, treeColor: mix(C.olive, C.duskViolet, 0.4), treeH: 16, x0: -1400, x1: 3200 }).markup);
    // the ground and the winding path
    const ground = S.layer({ par: 0.42, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(G - 90, [10, 4], [800, 240]), -1400, 3200, 1800, 12, 1), mix(C.hillNear, C.plumRobe, 0.3));
    const path = c.cbez([600, 820], [700, 700], [960, 690], [1090, 606], 30);
    gs.p(c.ribbon(path, (u) => 170 - u * 140), mix(C.sand, C.dusk, 0.25));
    ground.add(gs.out() + olive(c, 1260, G - 40, 0.8, { leaf: mix(C.olive, C.duskViolet, 0.35) }) + cypress(c, 1180, G - 60, 140, mix(C.moss2, C.duskViolet, 0.3)) + olive(c, 260, G, 1, { leaf: mix(C.olive, C.duskViolet, 0.35) }));
    const veil = S.layer({ par: 0.43, sh: 0, flat: true });
    veil.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".45"/>`);
    // the lamps along the path
    const lampL = S.layer({ par: 0.44, sh: 3 });
    const lampAt = [5, 10, 15, 20, 25].map((j, i) => [path[j][0], path[j][1] - 4, 1 - i * 0.13]);
    const lamps = lampAt.map(([x, y, s], i) => {
      const post = sheet().p(c.cut(c.rect(-3, -60, 6, 60), 0.2, 4), C.wood2).p(c.cut([[-12, -60], [12, -60], [8, -52], [-8, -52]], 0.2, 3), C.pot).out();
      lampL.add(`<g transform="translate(${x + 60 * s} ${y}) scale(${s})">${post}</g>`);
      const fl = lampL.add(`<g><circle r="46" fill="url(#warm-glow)"/><path d="M0 0C-5 -4 -4 -12 0 -20C4 -12 5 -4 0 0Z" fill="${C.lampFlame}"/></g>`);
      return { i, x: x + 60 * s, y: y - 60 * s, s, fl };
    });
    const glowL = S.layer({ par: 0.46, sh: 0, flat: true });
    const pool = glowL.add(`<g>${glowDisc(260, 'halo-glow', 1)}</g>`);
    const act = S.layer({ par: 0.5, sh: 5 });
    const walkers = people(S, act, [
      { x: 610, y: G + 20, s: 0.98, look: crowdPerson(c) }, { x: 680, y: G + 30, s: 1.0, look: man(c) }, { x: 540, y: G + 10, s: 0.96, look: man(c) },
      { x: 1000, y: G + 26, s: 0.98, flip: true, look: crowdPerson(c) }, { x: 1150, y: G + 18, s: 0.96, flip: true, look: man(c) },
    ], 'w');
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));
    // the darkness from the left (a sheet slid on the compositor)
    const darkL = S.layer({ par: 0.55, sh: 0, flat: true, pad: 900 });
    const dg = S.id('dk');
    S.defs(`<linearGradient id="${dg}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#1c1f45" stop-opacity=".9"/><stop offset="1" stop-color="#1c1f45" stop-opacity="0"/></linearGradient>`);
    const edge = [];
    for (let y = -1400; y <= 2200; y += 60) edge.push([470 + Math.sin(y * 0.013) * 26 + c.rr(-8, 8), y]);
    darkL.add(`<path d="${c.poly([[-2600, -1400], ...edge, [-2600, 2200]])}" fill="#1c1f45" opacity=".9"/><rect x="470" y="-1400" width="260" height="3600" fill="url(#${dg})"/>`);
    const fx = S.layer({ par: 0.6, sh: 4 });
    const lost = S.puppet(fx.add(person(c, man(c, { robe: mix(C.stone2, C.indigo, 0.3), mantle: null }))));
    const sign = fx.add(`<g>${sheet().p(c.cut(c.rect(-3, -110, 6, 110), 0.2, 4), shade(C.wood2, -0.3)).p(c.cut([[0, -100], [70, -104], [84, -92], [70, -80], [0, -84]], 0.3, 4) + c.cut([[0, -70], [-64, -74], [-78, -62], [-64, -50], [0, -54]], 0.3, 4), mix(C.wood3, C.night, 0.5)).out()}</g>`);
    const qm = fx.add(`<g>${question(c, { fill: mix(C.stone2, C.night, 0.3), ink: C.cream })}</g>`);
    const souls = walkers.map(() => fx.add(`<g>${soulLight(c, 10)}</g>`));
    const tagL = hanging(fx, nameTag(c, tr('synowie światłości', 'children of light'), { size: 16 }), { x: 800, y: 330, len: 700 });

    return (t, time) => {
      const T = time;
      /* the light fades through the scene */
      const dusk = es(t, 0, 3), night = es(t, 4.2, 5);
      if (night <= 0) sk.blend(SKY0, SKY1, dusk); else sk.blend(SKY1, SKY2, night);
      starL.fade(es(t, 1.5, 3) * 0.5 + night * 0.5);
      veil.fade(dusk * 0.6 + night * 0.4);
      swing(sunEl, 1140, 300 + es(t, 0.2, 2.6) * 330, T, 0.8, 0.6);
      swing(moonEl, 480, 160, T, 0.8, 0.6, 2); fade(moonEl, es(t, 3.8, 4.6));
      /* v35a — the light among you */
      const leave = es(t, 4.1, 4.9);
      const jx = lerp(800, 1085, leave), jy = lerp(G + 16, G - 70, leave), js = lerp(1.06, 0.55, leave);
      jesus.set({ x: jx, y: jy, s: js, flip: false, o: 1 - es(t, 4.75, 4.95), walk: leave > 0 && leave < 1 ? t * 22 : undefined, armF: 16 + bump(t, 0.1, 0.9) * 40 + bump(t, 1.1, 1.9) * 60 + bump(t, 3.1, 3.9) * 50, armB: 10 + bump(t, 3.1, 3.9) * 100, head: -2, blink: blinkAt(T) });
      vis(pool, { x: jx, y: jy - 110 * js, s: (0.6 + es(t, 0.1, 0.5) * 0.5) * js, o: 1 - es(t, 4.4, 4.95) });
      /* v35b — walk while you have the light */
      lamps.forEach((l) => { const k = es(t, 1.1 + l.i * 0.1, 1.25 + l.i * 0.1); vis(l.fl, { x: l.x, y: l.y, s: l.s * (1 + (T ? Math.sin(T * 8 + l.i) * 0.05 : 0)), o: k }); });
      const creep = es(t, 1.2, 2.2, ease.out) * (1 - es(t, 3.05, 3.5) * 0.4) + night * 0.4;
      darkL.shift(-900 + creep * 820, 0);
      const go = es(t, 1.2, 1.9);
      walkers.forEach((m, i) => {
        const x = m.x + (i < 3 ? go * 90 : 0);
        place(m, T, { x, walk: i < 3 && go > 0 && go < 1 ? x * 0.06 + i : undefined, head: -es(t, 3.1, 3.4) * 6 + leave * (i < 3 ? 0 : -4), armF: 16 + es(t, 3.1, 3.4) * 20 + leave * 30 * (i >= 3 ? 1 : 0), blink: blinkAt(T, m.seed) });
        const [hx, hy] = headAt(x, m.y, m.s, m.flip);
        const k = es(t, 3.15 + i * 0.06, 3.35 + i * 0.06, ease.back);
        vis(souls[i], { x: hx, y: hy - 40 + (T ? Math.sin(T * 2 + i) * 2 : 0), s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v35c — walking in the dark */
      const lk = es(t, 2.05, 2.3);
      lost.set({ x: 330 + (T ? Math.sin(T * 0.8) * 10 : 0), y: G + 16, s: 0.98, o: lk * (1 - es(t, 3.2, 3.5)), armF: 90 + (T ? Math.sin(T * 1.3) * 10 : 0), armB: 70, head: -6 + (T ? Math.sin(T * 0.9) * 6 : 0), walk: T ? T * 1.2 : undefined, amt: 0.3, blink: 1 });
      vis(sign, { x: 430, y: G + 10, o: lk * (1 - es(t, 3.2, 3.5)) });
      vis(qm, { x: 350, y: 430, s: lk * 0.9, r: T ? Math.sin(T * 1.5) * 8 : 0, o: lk * (1 - es(t, 2.95, 3.1)) });
      /* v36a — children of light */
      const ck = es(t, 3.3, 3.55, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
      swing(tagL, 800, 360 - (1 - ck) * 700, ck > 0.001 ? T : 0, 1.2, 0.8); fade(tagL, ck > 0.001 ? 1 : 0);

      S.cam.x = kf(t, [[0, 0], [1, 0], [2, -40], [3, 0], [4, 20], [5, 60]]);
      S.cam.y = kf(t, [[0, -20], [1, 0], [3, 10], [4.2, 0], [5, -30]]);
      S.cam.z = kf(t, [[0, 1.06], [1, 1.04], [2, 1.06], [3.1, 1.08], [4.1, 1.04], [5, 1.08]]);
    };
  },
};
