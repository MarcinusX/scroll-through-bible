// J 9,39–41 — dusk at the gate. "I came into this world for judgment": a lit globe comes down above Jesus and
// a thread of light drops through Him, dividing the stage — warm light on the left, where the healed man stands,
// cool shade on the right, where some Pharisees have come down the steps. "That those who do not see may see"
// — a gold plate with an open eye comes down over the man; "and those who see may become blind" — a pane of
// dark smoked glass comes down in front of the Pharisees. "Are we blind too?" — a closed eye and a question at
// the glass. "If you were blind, you would have no sin" — a plate: a closed eye beside a clean white heart.
// "But now you say, 'We see' — your sin remains": their own "We see!", and a dark scrap that stays on the glass.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  gateSet, G, EVE, DUSK, SEER, manPuppet, facePuppet, official, eyePlate, darkGlass, darkScrap, eyeIcon, heart, globe, iconBubble, say, qmark,
  hungPlate, soundRings, hanging, drop, kf, moving, headAt, vis, tr, pose, mix, sheet, PI, DY,
} from './lib.js';

const JX = 800, MANX = 650;
const PH = [[960, G.FLOOR + 6], [1030, G.FLOOR + 12], [1098, G.FLOOR + 4]];

export default {
  id: 'j9-judgment',
  beats: [
    { v: 39, text: 'Jezus rzekł: «Przyszedłem na ten świat, aby przeprowadzić sąd,' },
    { v: 39, cont: true, text: 'aby ci, którzy nie widzą, przejrzeli, a ci, którzy widzą stali się niewidomymi».' },
    { v: 40 },
    { v: 41, text: 'Jezus powiedział do nich: «Gdybyście byli niewidomi, nie mielibyście grzechu,' },
    { v: 41, cont: true, text: 'ale ponieważ mówicie: "Widzimy", grzech wasz trwa nadal.' },
  ],
  cam: { x: [-40, 120], y: [-80, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = gateSet(S, { skyCols: EVE, sunAt: [1290, 360], sunR: 50, starsN: 50 });
    /* the division: warm light on the left, cool shade on the right (flat sheets) */
    const warmL = S.layer({ par: 0.5, sh: 0, flat: true });
    S.defs(`<linearGradient id="${S.id('warm')}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe6a6" stop-opacity=".0"/><stop offset=".55" stop-color="#ffe6a6" stop-opacity=".22"/><stop offset="1" stop-color="#ffe6a6" stop-opacity=".32"/></linearGradient>`);
    warmL.add(`<rect x="-900" y="-1000" width="1700" height="2800" fill="url(#${S.id('warm')})"/>`);
    warmL.fade(0);
    const coolL = S.layer({ par: 0.5, sh: 0, flat: true });
    coolL.add(`<rect x="800" y="-1000" width="1800" height="2800" fill="#2a2d52" opacity=".32"/>`);
    coolL.fade(0);

    const act = S.layer({ par: 0.52, sh: 5 });
    const manGlow = act.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/></g>`);
    const man = manPuppet(S, act, SEER, {});
    const phs = PH.map(([x, y], i) => ({ i, x, y, seed: c.rr(0, 9), ...facePuppet(S, act, official([4, 2, 0][i]), {}) }));
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));
    const line = act.add(`<g opacity="0"><path d="M-2 -1400H2V0H-2Z" fill="${C.halo}"/><rect x="-14" y="-1400" width="28" height="1400" fill="${C.halo}" opacity=".25"/></g>`);

    const hangL = S.layer({ par: 0.54, sh: 6 });
    const world = hanging(hangL, `<circle r="130" fill="url(#halo-glow)"/>${globe(c, 50)}`, { x: 0, y: 0, len: 900 });
    const gold = hanging(hangL, eyePlate(c, 66).gold, { x: 0, y: 0, len: 900 });
    const glass = hanging(hangL, darkGlass(c, { w: 270, h: 280 }), { x: 0, y: 0, len: 900 });
    const stay = hangL.add(`<g opacity="0"><path d="M0 -1600V-10" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${darkScrap(c, 20, '#2a2238')}</g>`);
    const noSin = hanging(hangL, hungPlate(c, `<g transform="translate(-24 0)">${eyeIcon(c, { r: 18, open: false })}</g><g transform="translate(26 4)">${heart(c, 16, C.linen)}</g>`, { r: 60 }), { x: 0, y: 0, len: 900 });
    const fx = S.layer({ par: 0.56, sh: 5 });
    const rings = soundRings(fx, c, { n: 3, r: 16, w: 2.8, col: mix(C.halo, C.ochre, 0.3) });
    const areWe = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-16 0)">${eyeIcon(c, { r: 18, open: false })}</g><g transform="translate(30 2)">${qmark(c, C.terracotta, 1.3)}</g>`, { w: 120, h: 76, side: -1 })}</g>`);
    const weSee = fx.add(`<g opacity="0">${say(c, tr('Widzimy!', 'We see!'), { size: 22, side: -1 })}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.sk.blend(EVE, DUSK, es(t, 0, 4.5));
      set.starsL.fade(es(t, 3, 5) * 0.8);
      set.update(T, { sunY: 360 + es(t, 0, 4.5) * 200 });

      /* v39a — judgment: the globe, the dividing light */
      const div = es(t, 0.3, 0.8);
      warmL.fade(div); coolL.fade(div);
      vis(line, { x: JX + 2, y: G.FLOOR - 10, sy: Math.max(0.01, div), o: div * (1 - es(t, 1.9, 2.3) * 0.6) });
      drop(world, JX, 200, es(t, 0.1, 0.5, ease.out) * (1 - es(t, 1.9, 2.2, ease.in)), T, { amp: 1 });

      /* Jesus in the middle */
      const toThem = bump(t, 3.05, 3.95), last = es(t, 4.05, 4.4);
      jesus.set({ x: JX, y: G.FLOOR + 8, s: 1.04, flip: t > 1.05 && t < 1.5, armF: 16 + bump(t, 0.1, 0.9) * 40 + toThem * 60 + last * 40, armB: 10 + bump(t, 0.2, 0.9) * 120 + bump(t, 1.05, 1.45) * 60, head: -bump(t, 0.2, 0.9) * 8, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(JX, G.FLOOR + 8, 1.04, false);
      rings(jhx + 18, jhy + 6, Math.max(bump(t, 0.05, 0.95), bump(t, 1.05, 1.95), bump(t, 3.05, 4.95)), T, { speed: 0.7, spread: 2.4 });

      /* the healed man, in the light */
      const see = es(t, 1.1, 1.5);
      man.p.set({ x: MANX, y: G.FLOOR + 10, s: 1.0, armF: 20 + see * 30, armB: 14 + see * 40, head: -see * 8, blink: blinkAt(T, 3) });
      const [mhx, mhy] = headAt(MANX, G.FLOOR + 10, 1, false);
      vis(manGlow, { x: mhx, y: mhy + 40, s: 0.8 + see * 0.4, o: see * 0.8 });
      drop(gold, MANX, 250, es(t, 1.1, 1.45, ease.out), T, { amp: 0.8 });

      /* the Pharisees: come down the steps (v39a), behind the glass (v39b), step to it (v40), "we see" (v41b) */
      phs.forEach((p) => {
        const k = es(t, -0.2 + p.i * 0.12, 0.7 + p.i * 0.12, ease.out);
        const x = lerp(1180 + p.i * 20, p.x, k);
        const up = seg(x, 1000, 1150);
        const y = lerp(G.FLOOR - 88, p.y, k);
        const near = bump(t, 2.05, 2.95) * 14;
        const ask = bump(t, 2.05, 2.95), we = bump(t, 4.05, 4.95);
        p.p.set({ x: x - near, y, s: lerp(0.86, 0.98, k), flip: true, walk: k > 0.02 && k < 0.98 ? x * 0.07 : undefined, armF: 18 + ask * (p.i === 0 ? 60 : 20) + we * (p.i === 1 ? 70 : 30), armB: 8 + we * (p.i === 2 ? 110 : 0), head: -ask * 4 + we * -6, lean: ask * 4, blink: blinkAt(T, p.seed) });
        fade(p.angry, 0.3 + we * 0.5);
        fade(p.sad, ask * 0.5);
      });
      const gk = es(t, 1.35, 1.75, ease.out);
      drop(glass, 1030, 372, gk, T, { amp: 0.5 });
      const [p0x, p0y] = headAt(960 - 14, G.FLOOR + 6, 0.98, true);
      const k2 = es(t, 2.12, 2.32, ease.back) * (1 - es(t, 2.92, 3.0));
      vis(areWe, { x: p0x - 30, y: p0y - 30, s: k2, o: k2 > 0.01 ? 1 : 0 });
      drop(noSin, 900, 230, es(t, 3.1, 3.45, ease.out) * (1 - es(t, 3.95, 4.2, ease.in)), T, { amp: 1 });
      const [p1x, p1y] = headAt(1030, G.FLOOR + 12, 0.98, true);
      const k4 = es(t, 4.12, 4.32, ease.back) * (1 - es(t, 4.92, 5.0));
      vis(weSee, { x: p1x - 20, y: p1y - 36, s: k4, o: k4 > 0.01 ? 1 : 0 });
      const sk = es(t, 4.3, 4.55, ease.out);
      vis(stay, { x: 1030, y: 330 - (1 - sk) * 200 + Math.sin(T * 1.2) * 2, o: sk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 40], [1, 20], [1.3, 40], [2, 60], [2.2, 100], [3, 100], [3.2, 60], [4, 60], [4.2, 80], [5, 60]]);
      S.cam.y = kf(t, [[0, -60], [1, -60], [1.3, -30], [2, -30], [5, -20]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.02], [2, 1.04], [2.2, 1.1], [3, 1.1], [3.2, 1.04], [5, 1.04]]);
      if (S.portrait) S.cam.z = Math.min(S.cam.z, 1.03);   // phone: the whole pane of glass in view
    };
  },
};
