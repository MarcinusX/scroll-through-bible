// Łk 1,78–80 — the end of the Benedictus, over the hill country at night. Through the tender mercy of our God — a warm
// glow gathers along the dark hills; the dawn from on high will visit us — the great sun comes down from above on its
// string and the sky turns to morning. To shine on those who sit in darkness and the shadow of death — a heavy shadow
// lies over a valley of people sitting with bowed heads; it draws back, and they look up in the light. To guide our feet
// into the way of peace — a golden road lights up over the hills and they rise and walk on it, doves going ahead.
// And the child grew and became strong in spirit: the small boy, the youth, the man, one after another in the wilderness,
// until the day of his showing to Israel.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, rock, grass, flowers, sun as sunCut, stars } from '../../assets/nature.js';
import {
  JOHN_B, JOHN_BOY, HILLNIGHT, glowDisc, rayBurst, dove, flapWings, folk, tr, es, ease, bump, seg, PI,
} from './lib.js';
import { acacia } from '../mark1/lib.js';

const GY = 712;
const DAWNC = ['#9fb2cf', '#f2c7a4', '#f8e2c0'];
const DAYC = ['#cfdfda', '#f3e2c2', '#f8ead0'];

export default {
  id: 'lk1-dawn',
  beats: [
    { v: 78, text: 'dzięki litości serdecznej Boga naszego.' },
    { v: 78, cont: true, text: 'Przez nią z wysoka Wschodzące Słońce nas nawiedzi,' },
    { v: 79, text: 'by zajaśnieć tym, co w mroku i cieniu śmierci mieszkają,' },
    { v: 79, cont: true, text: 'aby nasze kroki zwrócić na drogę pokoju».' },
    { v: 80 },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, HILLNIGHT);
    const sk2 = sky(S, DAWNC, { name: 'sky2', rise: 0 });
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 460, n: 180 }));
    const horizon = S.layer({ par: 0.03, sh: 1, flat: true });
    horizon.add(`<ellipse cx="800" cy="470" rx="1100" ry="160" fill="url(#warm-glow)"/>`);
    const glowL = S.layer({ par: 0.04, sh: 1, flat: true });
    const sunGlow = glowL.add(`<g>${glowDisc(420, 'halo-glow', 1)}${rayBurst(c, { n: 26, r0: 80, r1: 560, spread: 0.02, o: 0.25 })}</g>`);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sunCut(c, 70), { x: 800, y: -1500, len: 900 });

    /* the hills of Judah, and far off to the east the wilderness */
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 470, amps: [30, 12, 4], lens: [1100, 360, 120], color: mix(C.hillFar, C.duskViolet, 0.2) }).markup);
    const wild = S.layer({ par: 0.1, sh: 2 });
    wild.add(band(c, { y: 500, amps: [24, 10, 3], lens: [700, 240, 90], color: mix(C.dune, C.sand2, 0.5) }).markup + acacia(c, 1180, 520, 0.8) + acacia(c, 420, 530, 0.6));
    wild.fade(0);
    const mid = S.layer({ par: 0.16, sh: 3 });
    const mfn = (x) => 560 + Math.sin(x * 0.004) * 20 + Math.sin(x * 0.013) * 6;
    mid.add(sheet().p(c.ridge(mfn, -1200, 2800, 1900, 12, 1), mix(C.hillMid, C.sage, 0.3)).out() + olive(c, 300, 590, 0.7) + olive(c, 1330, 580, 0.8));
    // the golden road over the hills (dark first, then lit)
    const roadL = S.layer({ par: 0.2, sh: 2 });
    const roadPts = [[560, 740], [700, 690], [860, 650], [980, 610], [1100, 585], [1260, 560], [1500, 545]];
    roadL.add(`<path d="${c.ribbon(roadPts, (u) => 60 - u * 44)}" fill="${mix(C.sand2, C.storm, 0.3)}"/>`);
    const litRoad = roadL.add(`<g><path d="${c.ribbon(roadPts, (u) => 60 - u * 44)}" fill="${mix(C.halo, C.sun, 0.25)}"/><path d="${c.ribbon(roadPts, (u) => 20 - u * 14)}" fill="#fff3cf" opacity=".6"/></g>`);
    const valley = S.layer({ par: 0.3, sh: 3 });
    valley.add(sheet().p(c.ridge((x) => GY - 2 + Math.sin(x * 0.006) * 4, -1200, 2800, 1900, 12, 0.8), mix(C.sage, C.sand2, 0.4)).out() + grass(c, { x0: -600, x1: 2200, y: GY + 4, n: 40, h: 14, color: C.moss }));
    // the night over the set (behind the people), fading as the sun comes
    const dim = S.layer({ par: 0.3, sh: 1, flat: true });
    dim.add(`<rect x="-1400" y="-1600" width="4400" height="3600" fill="${HILLNIGHT[1]}" opacity=".5"/>`);

    /* the people sitting in darkness, then lit, then walking */
    const P = S.layer({ par: 0.34, sh: 5 });
    const mem = [];
    for (let i = 0; i < 6; i++) mem.push({ x: i * 62 + c.rr(-8, 8), y: (i % 2) * 18, s: 0.9 * c.rr(0.95, 1.04), o: folk(c) });
    const draw = (pose_, tint) => mem.slice().sort((a, b) => a.y - b.y).map((mm) => {
      let mk = person(c, { ...mm.o, pose: pose_, holdF: '', holdB: '' });
      if (pose_ === 'sit' && tint) mk = mk.replace('class="headr"', 'class="headr" transform="rotate(22)"');
      return `<g transform="translate(${mm.x.toFixed(1)} ${mm.y.toFixed(1)}) scale(${mm.s} ${mm.s})">${mk}</g>`;
    }).join('');
    const darkSit = P.sprite(draw('sit', true), 530, GY - 6);
    const litSit = P.sprite(draw('sit', false), 530, GY - 6);
    const walkers = P.sprite(draw('stand', false), 530, GY - 6);
    const shadowL = S.layer({ par: 0.34, sh: 1, flat: true });
    const shId = S.id('shade');
    S.defs(`<radialGradient id="${shId}"><stop offset="0" stop-color="#16182f" stop-opacity=".78"/><stop offset=".6" stop-color="#16182f" stop-opacity=".5"/><stop offset="1" stop-color="#16182f" stop-opacity="0"/></radialGradient>`);
    const shadow = shadowL.add(`<g><ellipse rx="440" ry="190" fill="url(#${shId})"/></g>`);
    const doves = [0, 1, 2].map((i) => ({ i, el: P.add(dove(c)) }));
    /* the child grows in the wilderness */
    const JG = S.layer({ par: 0.34, sh: 1, flat: true });
    const jGlow = JG.add(`<g>${glowDisc(160, 'halo-glow', 1)}</g>`);
    const J = S.layer({ par: 0.34, sh: 5 });
    const rockL = J.add(`<g>${rock(c, 0, 0, 200, 40, C.rock2)}</g>`);
    const kid = S.puppet(J.add(person(c, { ...JOHN_BOY })));
    const youth = S.puppet(J.add(person(c, { ...JOHN_BOY, hairStyle: 'wild', beard: 'short' })));
    const man = S.puppet(J.add(person(c, JOHN_B)));
    const fg = S.layer({ par: 0.8, sh: 6 });
    fg.add(flowers(c, { x0: -200, x1: 300, y: 930, n: 14 }) + flowers(c, { x0: 1300, x1: 1800, y: 930, n: 14 }));

    return (t, time) => {
      const T = time;
      /* v78a: the tender mercy of our God — a warmth gathers on the hills */
      const warm = es(t, 0.1, 0.8);
      horizon.fade(warm * (1 - es(t, 4.0, 4.5)));
      /* v78b: the dawn from on high visits us */
      const dawn = es(t, 1.05, 1.6);
      sk2.layer.fade(dawn);
      sk2.blend(DAWNC, DAYC, es(t, 3.0, 4.4));
      starL.fade(1 - dawn);
      const sd = es(t, 1.05, 1.55, ease.out);
      swing(sunEl, 800, lerp(-1500, lerp(260, 190, es(t, 3.0, 4.4)), sd), T, 0.8, 0.6);
      pose(sunGlow, { x: 800, y: lerp(260, 190, es(t, 3.0, 4.4)), s: 0.4 + sd * 0.7, r: t * 2, o: sd });
      dim.fade(1 - es(t, 1.2, 2.5));

      /* v79a: to shine on those in darkness and the shadow of death */
      const lift = es(t, 2.05, 2.5);
      pose(shadow, { x: 700, y: GY - 90 + lift * 160, s: 1 + lift * 0.2, o: 1 - lift });
      const risen = es(t, 3.1, 3.18);
      const out = es(t, 4.0, 4.2);
      darkSit.set({ x: 530, y: GY - 6, o: (1 - es(t, 2.3, 2.5)) });
      litSit.set({ x: 530, y: GY - 6, o: es(t, 2.3, 2.5) * (1 - risen) });
      /* v79b: our feet on the way of peace */
      pose(litRoad, { x: 0, y: 0, o: es(t, 3.0, 3.3) });
      const wk = es(t, 3.2, 3.95);
      walkers.set({ x: 530 + wk * 230, y: GY - 6 - wk * 80, s: 1 - wk * 0.25, o: risen * (1 - out) });
      doves.forEach((d) => { const k = seg(t, 3.15 + d.i * 0.08, 4.0 + d.i * 0.08); pose(d.el, { x: 800 + k * 500 + d.i * 40, y: 520 - k * 160 - d.i * 30, s: 0.8, o: k > 0 && k < 1 ? 1 : 0 }); if (k > 0 && k < 1) flapWings(d.el, T || t * 3, 34, 8, -4); });

      /* v80: the child grew, strong in spirit, in the wilderness */
      wild.fade(es(t, 4.0, 4.3));
      const a = es(t, 4.05, 4.15), b = es(t, 4.3, 4.4), m = es(t, 4.52, 4.62);
      kid.set({ x: 800, y: GY - 16, s: 0.62, flip: false, o: a * (1 - b), armF: 10, armB: 6, blink: blinkAt(T, 1) });
      youth.set({ x: 800, y: GY - 16, s: 0.84, flip: false, o: b * (1 - m), armF: 14, armB: 8, blink: blinkAt(T, 1) });
      man.set({ x: 800, y: GY - 16, s: 1.02, flip: false, o: m, armF: 20 + es(t, 4.7, 4.9) * 30, armB: 10, head: -es(t, 4.7, 4.9) * 8, blink: blinkAt(T, 1) });
      pose(rockL, { x: 800, y: GY + 2, o: a });
      pose(jGlow, { x: 800, y: GY - 150, s: 0.6 + m * 0.4, o: a * 0.8 });

      S.cam.z = 1.04;
      S.cam.y = 10 - es(t, 1.0, 1.6) * 30 + es(t, 3.9, 4.3) * 30;
    };
  },
};
