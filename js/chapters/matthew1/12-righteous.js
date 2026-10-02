// Mt 1,19 — dusk over Nazareth. Joseph at his workbench, the scroll of the Law beside him: a righteous man. From the
// town the grey murmurs of gossip rise and drift towards Mary's house; he lifts his hand and they fade before they reach
// it — he will not put her to shame. He sits and writes, by his lamp, a small scroll: in his thoughts a moonlit road
// leads out of town, where she might go away quietly. He rolls it up and ties it.
import { C, person, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import {
  EVE, NIGHT, JOSEPH, MARY, nazarethSet, houseLight, GY, glowDisc, murmur, dreamCloud, ICON, kf,
  tr, es, ease, bump, seg, PI,
} from './lib.js';
import { moon, stars } from '../../assets/nature.js';

const JX = 660;

export default {
  id: 'mt1-righteous',
  beats: [
    { v: 19, text: 'Mąż Jej, Józef, który był człowiekiem sprawiedliwym i nie chciał narazić Jej na zniesławienie,' },
    { v: 19, cont: true, text: 'zamierzał oddalić Ją potajemnie.' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const DUSKY = ['#5d5b8c', '#b99aa6', '#e2b69a'];
    const N = nazarethSet(S, DUSKY, { k: 0.3 });
    const MOX = S.portrait ? 1040 : 1150;   // phone: the moon clear of the edge and the progress thread
    const moonEl = hanging(N.hangL, moon(c, 30), { x: MOX, y: 170, len: 800 });

    /* ---------- the lamp and the scroll of the Law on the bench ---------- */
    const lampGlow = N.G.add(`<g>${glowDisc(160, 'warm-glow', 1)}</g>`);
    const B = S.layer({ par: 0.3, sh: 5 });
    B.add(`<g transform="translate(790 ${GY - 70})">${handLampSafe(c)}</g><g transform="translate(700 ${GY - 80}) scale(.9)">${ICON.scroll(c)}</g>`);
    const stool = B.add(`<g>${sheet().p(c.cut(c.rect(-22, -40, 44, 42), 0.4, 5), N.T(C.wood2)).out()}</g>`);
    // the bill he writes: unrolls as he writes, rolls up and is tied
    const bill = B.add(`<g>${sheet().p(c.cut(c.rect(0, -12, 80, 24), 0.3, 4), C.parchment).x(c.ribbon([[8, -5], [66, -5]], 1.2) + c.ribbon([[8, 1], [60, 1]], 1.2) + c.ribbon([[8, 7], [50, 7]], 1.2), C.ink, 'opacity=".55"').out()}</g>`);
    const rolled = B.add(`<g>${sheet().p(c.cut(c.ell(0, 0, 7, 14, 10), 0.2, 3), C.parchment).x(c.ribbon([[-7, 0], [7, 0]], 2.2), C.terracotta).out()}</g>`);

    /* ---------- Joseph standing, Joseph sitting to write ---------- */
    const jSt = S.puppet(N.P.add(person(c, JOSEPH)));
    const pen = `<g transform="rotate(-150)"><path d="${c.ribbon([[0, 0], [0, 30]], 2)}" fill="${C.wood3}"/></g>`;
    const jSi = S.puppet(N.P.add(person(c, { ...JOSEPH, pose: 'sit', holdF: pen })));

    /* ---------- the murmurs of the town ---------- */
    const M = S.layer({ par: 0.3, sh: 5 });
    const MUR = [[470, 430], [560, 380], [680, 420], [600, 480], [760, 360]].map(([x, y], i) => ({ x, y, i, el: M.add(`<g>${murmur(c, { side: 1, w: 70, h: 42 })}</g>`) }));

    /* ---------- his thought: a moonlit road out of town, a small figure going away ---------- */
    const TH = S.layer({ par: 0.3, sh: 6 });
    const vid = S.id('thclip');
    const vs = sheet();
    vs.p(c.cut(c.rect(-150, -80, 300, 160), 0.3, 10), mix(C.indigo, C.night, 0.35));
    vs.p(c.ridge(c.wave(10, [8, 3], [180, 60]), -160, 160, 90, 10, 0.6), mix(C.hillMid, C.night, 0.55));
    vs.p(c.ribbon(c.qbez([-120, 80], [-10, 40], [110, 8], 14), (u) => 34 - u * 30), mix(C.dune, C.duskViolet, 0.45));
    const vign = `<clipPath id="${vid}"><ellipse rx="136" ry="72"/></clipPath><g clip-path="url(#${vid})">${vs.out()}${stars(c, { x0: -140, x1: 140, y0: -70, y1: -10, n: 18 })}<path d="${c.poly(c.circ(90, -40, 13, 14))}" fill="${C.moon}"/></g>`;
    const cloudEl = TH.add(`<g>${dreamCloud(c, 340, 200, { fill: mix(C.skyVeil, C.cream, 0.4), tx: -150, ty: 190 })}${vign}</g>`);
    const walker = TH.add(`<g transform="scale(.32)">${person(c, { ...MARY, holdF: '', holdB: '' })}</g>`);

    return (t, time) => {
      N.sk.blend(DUSKY, NIGHT, es(t, 0.6, 1.8));
      N.starL.fade(es(t, 0.8, 1.8));
      swing(moonEl, MOX, lerp(260, 170, es(t, 0, 1.6)), time, 1, 0.5);
      houseLight(N.J, { open: 0.25, lit: 0.9 });
      houseLight(N.M, { open: 0, lit: 0.6, shut: es(t, 0.55, 0.8) });
      const flick = time ? 1 + Math.sin(time * 6) * 0.04 : 1;
      pose(lampGlow, { x: 800, y: GY - 96, s: flick * (0.8 + es(t, 1.0, 1.3) * 0.3), o: 0.9 - es(t, 1.85, 2.0) * 0.4 });

      /* v19a: a righteous man — the gossip rises, he raises his hand, it fades before it reaches her */
      const sitK = es(t, 1.0, 1.08);
      const stop = es(t, 0.42, 0.6);
      jSt.set({ x: JX, y: GY, s: 1, flip: false, o: 1 - sitK, armF: 10 + stop * 80, armB: 8, head: 8 - stop * 14, blink: blinkAt(time, 1) });
      MUR.forEach((m) => {
        const k = seg(t, 0.05 + m.i * 0.05, 0.5 + m.i * 0.03);
        const die = es(t, 0.55 + m.i * 0.04, 0.95 + m.i * 0.02);
        pose(m.el, { x: lerp(m.x, m.x + 200, k) + die * 30, y: m.y - k * 20 - die * 30, s: (0.7 + k * 0.5) * (1 - die * 0.7), o: t > 0.05 ? (1 - die) * Math.min(1, k * 4) : 0 });
      });

      /* v19b: he sits to write a bill in secret; his thought: a road out of town by night */
      const write = seg(t, 1.1, 1.5), roll = es(t, 1.62, 1.78);
      const scrib = write > 0 && write < 1 ? Math.sin(t * 60) * 6 : 0;
      jSi.set({ x: JX - 2, y: GY - 34, s: 1, flip: false, o: sitK, armF: 70 + scrib * (1 - roll), armB: 30, head: 16 - bump(t, 1.4, 1.9) * 20, blink: blinkAt(time, 1) });
      pose(stool, { x: JX, y: GY, o: sitK > 0.02 ? 1 : 0 });
      pose(bill, { x: 716, y: GY - 76, sx: Math.max(0.05, 0.3 + write * 0.7) * (1 - roll * 0.95), o: t > 1.0 && roll < 0.98 ? 1 : 0 });
      pose(rolled, { x: 722, y: GY - 80, r: 90, s: 1, o: roll > 0.9 ? 1 : 0 });
      const th = es(t, 1.2, 1.45, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(cloudEl, { x: 830, y: 330, s: Math.max(0.001, th), o: th > 0.002 ? 1 : 0 });
      const wk = seg(t, 1.3, 1.95);
      pose(walker, { x: 830 + lerp(-96, 90, wk), y: 330 + lerp(66, 12, wk), s: 0.72 - wk * 0.4, o: th > 0.9 ? 1 - es(t, 1.85, 1.95) * 0.6 : 0 });

      S.cam.z = 1.12 + es(t, 1.0, 1.4) * 0.04;
      S.cam.y = 24 - es(t, 1.0, 1.4) * 30;
      S.cam.x = -20 + es(t, 1.0, 1.4) * 20;
    };
  },
};
function handLampSafe(c) {
  return `<g>${sheet().p(c.cut([[-18, 0], [-22, -6], [-12, -12], [8, -12], [18, -9], [26, -12], [29, -9], [20, -2], [10, 1], [-12, 1]], 0.3, 4), C.pot).out()}<path d="M27 -12C22 -18 23 -26 27 -34C31 -26 32 -18 27 -12Z" fill="${C.lampFlame}"/></g>`;
}
