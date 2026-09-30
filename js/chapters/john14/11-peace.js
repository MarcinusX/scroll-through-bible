// J 14,27 — the heart of the chapter: peace. A lake at night, as on the evening of the storm: the water is still
// rough and grey clouds hang low; the disciples sit on the shore, afraid. "Peace I leave with you": the waves lie
// down, the water goes smooth and the moon draws its path of light across it. "My peace I give to you": a dove with an
// olive sprig flies from His open hands over each of them. "Not as the world gives do I give to you": on the left a
// gilded standard of the world's peace — an eagle, a red PAX banner — flutters proudly, then wilts and falls away.
// "Let not your hearts be troubled, neither let them be afraid": the last clouds melt, the stars come out, the
// disciples lift their faces — and the whole lake holds still.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { stars, moon, band, waterBand, waveStrip, rock, reeds } from '../../assets/nature.js';
import { stormCloud } from '../../assets/things.js';
import { TW, PEACE, paxStandard, peaceDove, flapWings, withFace, faceBits, glowDisc, oliveBranch, kf, vis, headAt, PI } from './lib.js';

const HZ = 470, SH = 690, JX = 800;
const STORMY = ['#2b2f52', '#454a6e', '#6b6a88'];

export default {
  id: 'j14-peace',
  beats: [
    { v: 27, text: 'Pokój zostawiam wam,' },
    { v: 27, cont: true, text: 'pokój mój daję wam.' },
    { v: 27, cont: true, text: 'Nie tak jak daje świat, Ja wam daję.' },
    { v: 27, cont: true, text: 'Niech się nie trwoży serce wasze ani się lęka!' },
  ],
  cam: { x: [-80, 40], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const sk = sky(S, STORMY);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -700, y1: HZ - 20, n: 150 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, `<circle r="150" fill="url(#halo-glow)" opacity=".6"/>${moon(c, 42)}`, { x: 1080, y: 170, len: 800 });
    const clouds = [[520, 150, 380], [1000, 110, 300], [760, 230, 260], [1250, 220, 320]].map(([x, y, w], i) => ({ x, y, i, el: hanging(hangL, stormCloud(c, w, mix(C.storm, C.indigo, 0.3), mix(C.storm2, C.night, 0.3)), { x, y, len: 900 }) }));
    // far hills
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: HZ - 16, amps: [22, 8, 3], lens: [1000, 360, 120], color: mix(C.hillFar, C.night, 0.62), x0: -1400, x1: 3200 }).markup);
    // calm water with the moon path
    const calmL = S.layer({ par: 0.2, sh: 2 });
    calmL.add(waterBand(c, { y: HZ, color: mix(C.lake3, C.night, 0.5), x0: -1400, x1: 3200, amp: 1.5, len: 200, foam: C.moon, foamN: 30 }).markup);
    const pathL = S.layer({ par: 0.2, sh: 0, flat: true });
    let glints = '';
    for (let i = 0; i < 22; i++) { const y = HZ + 8 + i * i * 0.55 + i * 6; const w = (16 + i * 5) * c.rr(0.6, 1.1), ox = c.rr(-10, 10); glints += c.cut([[1080 + ox - w, y], [1080 + ox + w, y - 1], [1080 + ox + w * 0.7, y + 2], [1080 + ox - w * 0.7, y + 2]], 0.3, 6); }
    pathL.add(`<path d="${glints}" fill="${C.moon}" opacity=".7"/><ellipse cx="1080" cy="${HZ + 110}" rx="120" ry="150" fill="url(#halo-glow)" opacity=".4"/>`);
    // rough water on top (slides away / fades as the waves lie down)
    const roughL = S.layer({ par: 0.22, sh: 3, pad: 120 });
    roughL.add(waveStrip(c, { y: HZ + 22, len: 110, amp: 14, color: mix(C.waveStorm, C.night, 0.35), crest: mix(C.foam, C.storm, 0.3), x0: -1400, x1: 3200 }));
    const rough2 = S.layer({ par: 0.26, sh: 3, pad: 120 });
    rough2.add(waveStrip(c, { y: HZ + 90, len: 150, amp: 18, color: mix(C.waveStorm2, C.night, 0.3), crest: mix(C.foam, C.storm, 0.35), x0: -1400, x1: 3200 }));
    // the world's peace (behind the shore on the left)
    const stdL = S.layer({ par: 0.35, sh: 5 });
    const std = stdL.add(`<g>${paxStandard(c, 250)}</g>`);
    const banner = std.querySelector('.banner');
    const coins = Array.from({ length: 5 }, () => stdL.add(`<g><path d="${c.poly(c.circ(0, 0, 6, 10))}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, 3, 8))}" fill="${shade(C.sun, -0.2)}"/></g>`));
    // the shore
    const shore = S.layer({ par: 0.4, sh: 4 });
    const ss = sheet();
    ss.p(c.cut([...Array.from({ length: 50 }, (_, i) => [-1400 + i * 94, SH - 30 + Math.sin(i * 0.9) * 8 + c.rr(-4, 4)]), [3200, 1800], [-1400, 1800]], 1, 16), mix(C.sand2, C.night, 0.5));
    shore.add(ss.out() + rock(c, 610, SH - 10, 90, 36, mix(C.rock2, C.night, 0.45)) + rock(c, 1010, SH - 6, 110, 40, mix(C.rock2, C.night, 0.45)) + reeds(c, 380, SH - 20, 9, 80, mix(C.olive, C.night, 0.5), mix(C.wood3, C.night, 0.4)) + reeds(c, 1210, SH - 18, 8, 70, mix(C.olive, C.night, 0.5), mix(C.wood3, C.night, 0.4)));
    // people
    const act = S.layer({ par: 0.5, sh: 6 });
    const J = S.puppet(act.add(person(c, CAST.jesus)));
    const G = 744;
    const D = [['peter', 450], ['andrew', 540], ['john', 630], ['james', 970], ['thomas', 1060], ['philip', 1150]].map(([k, x], i) => {
      const el = act.add(withFace(person(c, { ...TW[k], pose: 'sit' }), faceBits(c)));
      return { k, x, i, flip: x > 800, seed: c.rr(0, 9), p: S.puppet(el), sad: el.querySelector('[data-part="sad"]') };
    });
    const fx = S.layer({ par: 0.55, sh: 4 });
    const glowJ = fx.add(`<g>${glowDisc(160, 'halo-glow', 1)}</g>`);
    const sprigs = D.map(() => fx.add(`<g transform="scale(.45)">${oliveBranch(c, 60)}</g>`));
    const doveL = S.layer({ par: 0.6, sh: 4 });
    const dv = doveL.add(`<g>${peaceDove(c)}</g>`);
    const bird = dv.querySelector('.bird');

    return (t, time) => {
      const T = time;
      /* v27a — the waves lie down; the moon's path */
      const calm = es(t, 0.1, 0.8);
      const clear = es(t, 3.05, 3.5);
      sk.blend(STORMY, PEACE, calm * 0.6 + clear * 0.4);
      starL.fade(0.3 + calm * 0.3 + clear * 0.4);
      const wob = T ? Math.sin(T * 0.9) : 0;
      roughL.shift(((T ? T * 14 : 0) % 110) * (1 - calm) - 40 * calm, calm * 60 + wob * 3 * (1 - calm));
      roughL.fade(1 - calm);
      rough2.shift(-((T ? T * 10 : 0) % 150) * (1 - calm), calm * 90 + wob * 4 * (1 - calm));
      rough2.fade(1 - calm);
      pathL.fade(es(t, 0.4, 0.9) * (0.85 + (T ? Math.sin(T * 1.3) * 0.05 : 0)));
      swing(moonEl, 1080, 170, T, 0.6, 0.5);
      clouds.forEach((cl) => {
        const away = calm * 0.35 + clear * 0.65;
        swing(cl.el, cl.x + (cl.x < 800 ? -1 : 1) * away * 500, cl.y - away * 300, T, 0.8 * (1 - calm), 0.9, cl.i);
        fade(cl.el, 1 - clear);
      });
      /* v27b — the dove from His hands; a sprig to each */
      const fly = seg(t, 1.1, 1.85);
      const home = es(t, 1.85, 2.0);
      let dx = JX + 40, dy = 520, face = 1;
      // phone: the dove's flight and landing stay inside the narrow screen
      if (fly > 0) { const a = fly * PI * 2; dx = JX + Math.sin(a) * (S.portrait ? 280 : 330); dy = 440 - Math.sin(a * 0.5) * 60 + Math.cos(a) * 30; face = Math.cos(a) > 0 ? 1 : -1; }
      if (fly >= 1) { dx = lerp(JX, S.portrait ? 1000 : 1080, home); dy = lerp(440, 300, home); face = 1; }
      const dvo = es(t, 1.05, 1.15);
      vis(dv, { x: dx, y: dy + (T ? Math.sin(T * 2) * 3 : 0), s: 1, sx: face, o: dvo });
      if (dvo > 0.01) flapWings(bird, T || t * 3, 28, 7);
      D.forEach((m, i) => {
        const order = [2, 1, 0, 3, 4, 5][i];
        const k = es(t, 1.2 + order * 0.1, 1.35 + order * 0.1, ease.back);
        const [hx, hy] = headAt(m.x, G, 0.9, m.flip, 62);
        vis(sprigs[i], { x: hx + (m.flip ? -30 : 30), y: hy + 50, s: 0.45 * k, r: m.flip ? 30 : -30, o: k > 0.01 ? 1 : 0 });
      });
      /* v27c — the world's standard flutters, then wilts and falls */
      const up = es(t, 2.02, 2.25, ease.out);
      const wilt = es(t, 2.4, 2.85, ease.in);
      vis(std, { x: 590, y: SH - 16 + (1 - up) * 300 + wilt * 60, r: -wilt * 14, o: up * (1 - es(t, 2.7, 2.95)) });
      pose(banner, { x: 0, y: -250 + 15, sx: 1 - wilt * 0.2, sy: 1 - wilt * 0.55, r: (T ? Math.sin(T * 5) * 4 : Math.sin(t * 30) * 4) * (1 - wilt) + wilt * 18 });
      coins.forEach((el, i) => { const k = seg(t, 2.45 + i * 0.05, 2.9 + i * 0.05); vis(el, { x: 590 + (i - 2) * 20 + k * (i - 2) * 20, y: SH - 170 + k * k * 220, r: k * 200, o: k > 0 && k < 1 ? 1 - k * 0.5 : 0 }); });
      /* people */
      const give = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.2) * 0.5);
      J.set({ x: JX, y: SH + 6, s: 1.12, armF: 16 + give * 60 + clear * 30, armB: 10 + give * 110 + clear * 60, head: -2, blink: blinkAt(T) });
      vis(glowJ, { x: JX + 2, y: SH - 120, s: 0.7 + calm * 0.3 + clear * 0.3, o: 0.5 + calm * 0.3 + clear * 0.2 });
      D.forEach((m) => {
        const eased = Math.max(calm * 0.5, clear);
        fade(m.sad, 1 - eased);
        const huddle = 1 - calm;
        const see = es(t, 2.1, 2.3) * (1 - es(t, 2.9, 3.05));
        m.p.set({ x: m.x, y: G, s: 0.9, flip: see > 0.5 && m.x > 800 ? true : see > 0.5 ? true : m.flip, armF: 30 + huddle * 30 + es(t, 1.3, 1.6) * 20, armB: 12 + huddle * 40, head: huddle * 14 - clear * 10, lean: huddle * 6, blink: blinkAt(T, m.seed) });
      });

      S.cam.x = kf(t, [[0, 0], [2, 0], [2.3, -60], [2.9, -60], [3.2, 0], [4, 0]]);
      S.cam.y = kf(t, [[0, 30], [1, 0], [2, -20], [3, 0], [4, -30]]);
      S.cam.z = kf(t, [[0, 1.1], [1, 1.04], [2, 1.02], [2.3, 1.1], [2.9, 1.1], [3.2, 1.02], [4, 1.06]]);
    };
  },
};
