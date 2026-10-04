// Mk 1,40–42 — on the road outside a town a leper comes ringing his bell; the disciples shrink back; he falls on his
// knees: "If you want to, you can make me clean." Moved with compassion Jesus stretches out His hand and touches him:
// "I want to. Be made clean." — the grey blotches peel off like paper flakes and he rises, clean.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, grass, rock, sun, cloud, flowers } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { LEPER, LEPER_HEALED, hand, headAt, voiceRings, bell, leperSpots, bubble, walledCity, sparkle } from './lib.js';

const PI = Math.PI;
const P = 0.5;
const FEET = 742, JX = 770, KX = 905;

export default {
  id: 'm1-leper',
  beats: [
    { v: 40, text: 'Wtedy przyszedł do Niego trędowaty' },
    { v: 40, cont: true, text: 'i upadając na kolana, prosił Go: «Jeśli chcesz, możesz mnie oczyścić».' },
    { v: 41, text: 'Zdjęty litością, wyciągnął rękę, dotknął go' },
    { v: 41, cont: true, text: 'i rzekł do niego: «Chcę, bądź oczyszczony!».' },
    { v: 42 },
  ],
  cam: { x: [0, 60], y: [0, 90], z: [1, 1.28] },
  build(S) {
    const c = S.c;
    sky(S, ['#c7dcd7', '#ecebd6', '#f5ead0']);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const SUNX = S.portrait ? 1030 : 1180;   // phone: the sun not half under the progress thread
    const sunEl = hanging(hangL, sun(c, 46), { x: SUNX, y: 160, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 520, y: 140, len: 700 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 450, amps: [16, 7, 3], lens: [1000, 330, 120], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.22, sh: 3 });
    const h2 = hillsWith(c, { y: 520, amps: [20, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup + walledCity(c, 300, h2.fn(300) + 10, 0.8) + cypress(c, 1250, h2.fn(1250) + 6, 110));
    const G = S.layer({ par: P, sh: 3 });
    const gfn = c.wave(620, [8, 3], [800, 200]);
    G.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), C.hillNear).out());
    G.add(sheet().p(c.ribbon([[-900, 770], [300, 758], [800, 760], [1300, 752], [2500, 760]], 70, 2), mix(C.sand, C.cream, 0.3)).out());
    G.add(grass(c, { x0: -900, x1: 2500, y: 620, fn: gfn, n: 50, h: 16, color: C.moss }) + olive(c, 1260, 660, 1) + bush(c, 420, 650, 70, C.sage, C.moss) + rock(c, 1080, 690, 70, 26, C.rock2) + flowers(c, { x0: 300, x1: 1300, y: 640, n: 16 }));

    /* ---------- people ---------- */
    const L = S.layer({ par: P, sh: 5 });
    const DIS = [CAST.john, CAST.james, CAST.andrew, CAST.peter].map((cast, i) => ({ p: S.puppet(L.add(person(c, cast))), x: S.portrait ? 545 + i * 47 : 350 + i * 85, i }));   // phone: the four stand closer, on screen
    const heart = L.add(`<g opacity="0"><circle r="70" fill="url(#warm-glow)"/><path d="M0 8C-14 -2 -16 -12 -8 -16C-4 -18 -1 -15 0 -12C1 -15 4 -18 8 -16C16 -12 14 -2 0 8Z" fill="${C.jesusMantle}"/></g>`);
    const glow = L.add(`<circle r="170" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const jVoice = voiceRings(L, c, { n: 3, color: C.sun, r: 40, w: 6 });
    const leper = S.puppet(L.add(person(c, { ...LEPER, holdF: `<g data-k="bell">${bell(c)}</g>` })));
    const bellEl = S.$('bell');
    const leperK = S.puppet(L.add(person(c, { ...LEPER, pose: 'kneel' })));
    const cleanK = S.puppet(L.add(person(c, { ...LEPER_HEALED, pose: 'kneel' })));
    const clean = S.puppet(L.add(person(c, LEPER_HEALED)));
    const spotsS = leperSpots(c, false).map((sp) => ({ ...sp, el: L.add(`<g>${sp.m}</g>`) }));
    const spotsK = leperSpots(c, true).map((sp, i) => ({ ...sp, el: L.add(`<g opacity="0">${sp.m}</g>`), i, dx: c.rr(-1, 1), spin: c.rr(200, 500) }));
    const sparks = [0, 1, 2, 3, 4].map((i) => L.add(`<g opacity="0">${sparkle(c, 12 + (i % 3) * 5)}</g>`));
    const plea = L.add(`<g opacity="0">${bubble(tr('Jeśli chcesz, możesz mnie oczyścić', 'If you want to, you can make me clean'), { size: 19, fill: C.cream })}</g>`);
    const will = L.add(`<g opacity="0">${bubble(tr('Chcę, bądź oczyszczony!', 'I want to. Be made clean.'), { size: 21, fill: C.halo, flip: true })}</g>`);

    return (t, time) => {
      swing(sunEl, SUNX, 160, time, 1, 0.6);
      swing(cl1, 520 + Math.sin(time * 0.1) * 20, 140, time, 1.2, 0.6, 1);

      /* v40a: the leper comes, ringing his bell */
      const come = es(t, 0.05, 0.9);
      const lx = lerp(1450, KX, come);
      const kneel = es(t, 1.06, 1.12);
      const walking = come > 0 && come < 1;
      leper.set({ x: lx, y: FEET, s: 1.0, flip: true, o: 1 - kneel, walk: walking ? lx * 0.04 : undefined, amt: 0.7, armF: 50, armB: 10, head: 10, lean: 6, blink: blinkAt(time, 3) });
      pose(bellEl, { r: Math.sin(time * 11) * (walking ? 24 : 8) });
      spotsS.forEach((sp) => pose(sp.el, { x: lx - sp.x, y: FEET + sp.y, s: 1, o: 1 - kneel }));

      /* v40b: on his knees, pleading */
      const beg = es(t, 1.15, 1.35);
      const healed = es(t, 4.06, 4.12);
      const rise = es(t, 4.5, 4.56);
      leperK.set({ x: KX, y: FEET, s: 1.0, flip: true, o: kneel * (1 - healed), armF: 30 + beg * 70 - es(t, 2.4, 2.6) * 30, armB: 20 + beg * 100 - es(t, 2.4, 2.6) * 60, head: -beg * 12 + es(t, 2.4, 2.6) * 16, blink: blinkAt(time, 3) });
      const pb = es(t, 1.35, 1.55, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(plea, { x: KX + (S.portrait ? -10 : 80), y: 470, s: pb, o: pb > 0 ? 1 : 0 });   // phone: clear of the right edge

      /* v41: compassion — He stretches out His hand and touches him */
      const pity = bump(t, 2.0, 2.9);
      const reach = es(t, 2.3, 2.7) * (1 - es(t, 4.4, 4.7));
      const speak = es(t, 3.05, 3.25) * (1 - es(t, 4.0, 4.2));
      const jx = JX + reach * 45;
      jesus.set({ x: jx, y: FEET, s: 1.05, armF: 14 + reach * 58 + es(t, 4.6, 4.9) * 40, armB: 10 + speak * 40 + es(t, 4.6, 4.9) * 100, lean: reach * 8, head: reach * 8 - es(t, 4.6, 4.9) * 6, blink: blinkAt(time) });
      const [hx, hy] = headAt(jx, FEET, 1.05);
      pose(heart, { x: jx + 6, y: FEET - 120, s: 0.6 + pity * 0.6 + Math.sin(time * 5) * 0.04 * pity, o: pity });
      pose(glow, { x: hx, y: hy + 40, s: 0.8 + speak * 0.6 + healed * 0.4, o: 0.2 + speak * 0.5 + bump(t, 4.0, 4.9) * 0.4 });
      jVoice(hx, hy, speak, time, { dir: 1, spread: 2.2 });
      const wb = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(will, { x: hx - 20, y: hy - 120, s: wb, o: wb > 0 ? 1 : 0 });

      /* v42: the leprosy leaves him — flakes of grey paper peel off */
      spotsK.forEach((sp) => {
        const k = seg(t, 4.08 + sp.i * 0.02, 4.8 + sp.i * 0.02);
        const x = KX - sp.x + k * (60 + sp.dx * 90) + Math.sin(k * 9 + sp.i) * 14 * k, y = FEET + sp.y - Math.sin(k * PI) * 80 + k * k * 120;
        pose(sp.el, { x, y, sx: Math.cos(k * sp.spin / 30), r: k * sp.spin, s: 1 + k * 0.6, o: kneel * (1 - es(t, 4.6, 4.9 + sp.i * 0.02)) });
      });
      cleanK.set({ x: KX, y: FEET, s: 1.0, flip: true, o: healed * (1 - rise), armF: 40, armB: 30, head: -6, blink: blinkAt(time, 3) });
      const joy = es(t, 4.56, 4.85);
      clean.set({ x: KX, y: FEET, s: 1.0, flip: true, o: rise, armF: 30 + joy * 60, armB: 20 + joy * 130, head: -joy * 10, blink: blinkAt(time, 3) });
      sparks.forEach((sp, i) => { const k = bump(t, 4.1 + i * 0.06, 4.8 + i * 0.06); pose(sp, { x: KX - 40 + i * 22, y: FEET - 60 - (i % 3) * 50, s: k, r: time * 50 + i * 20, o: k }); });

      /* the disciples shrink back from the leper, then marvel */
      const recoil = es(t, 0.55, 0.9) * (1 - es(t, 4.2, 4.6));
      const marvel = es(t, 4.2, 4.6);
      DIS.forEach((d) => d.p.set({ x: d.x - recoil * 25, y: FEET + (d.i % 2) * 6, s: 0.98, armF: 14 + recoil * 40 + marvel * 30, armB: recoil * (d.i % 2 ? 80 : 20) + marvel * (d.i % 2 ? 120 : 40), lean: -recoil * 8, head: -marvel * 6, blink: blinkAt(time, d.i + 1) }));

      S.cam.z = (S.portrait ? 1.0 : 1.12) + es(t, 1.0, 1.5) * 0.08 + es(t, 2.2, 2.8) * 0.06 - es(t, 4.4, 4.9) * 0.06;
      S.cam.x = 20 + es(t, 0.8, 1.4) * (S.portrait ? 0 : 40);
      S.cam.y = 60 + es(t, 1.0, 1.5) * 20;
    };
  },
};
