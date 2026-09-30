// Łk 22,63–65 — kept to shadow-play. A cloth is let down over the lit hall and we see only shadows on it, thrown by
// the lamp behind: the men who hold Him crowd round the seated shadow and strike; a cloth is drawn over His eyes and
// they ask, "Prophesy! Who is it that struck you?" — then many other taunts, jagged dark bubbles of scribble. His
// shadow does not move; at the end the lamp behind steadies, and a thin gold ring glints round His head.
import { es, ease, bump, seg } from '../../core/anim.js';
import { kf, courtyard, CY, courtIdle, shadowPerson, guardOpts, say, speech, hanging, vis, pose, fade, lerp, mix, sheet, blinkAt, tr, C, CAST, PI, DEEPNIGHT } from './lib.js';

const INK = '#2b2138';

export default {
  id: 'lk22-mocked',
  beats: [
    { v: 63 },
    { v: 64 },
    { v: 65 },
  ],
  cam: { x: [-60, 460], y: [-300, 100], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const R = courtyard(S, { skyCols: DEEPNIGHT });
    R.front();
    const Y = R.yard();
    const dimL = S.layer({ par: CY.P, sh: 0, flat: true });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0d0b1c" opacity=".45"/>`);
    const fx = S.layer({ par: CY.P, sh: 4 });
    // the cloth over the hall, shadows on it
    const SW = 700, SH = 360, CXc = CY.JXH + 60;
    const clip = S.id('scr');
    const pts = [[-SW / 2, 0], [SW / 2, 0], [SW / 2, SH]];
    for (let x = SW / 2; x > -SW / 2; x -= 38) pts.push(...c.arc(x - 19, SH, 19, 10, 0, PI, 4));
    const clothShape = c.cut(pts, 0.8, 10);
    const FY = SH - 40;
    const scr = hanging(fx, `<g clip-path="url(#${clip})"><defs><clipPath id="${clip}"><path d="${clothShape}"/></clipPath></defs><path d="${clothShape}" fill="#efd7ad"/><circle cx="0" cy="${SH * 0.5}" r="${SW * 0.55}" fill="url(#warm-glow)" opacity=".8"/><path d="${c.cut(c.rect(-SW / 2, SH - 30, SW, 44), 0.6, 10)}" fill="#3a2d46" opacity=".5"/></g><path d="${c.ribbon([[-SW / 2 - 8, 2], [SW / 2 + 8, 2]], 9)}" fill="${C.wood2}"/>`, { x: 0, y: -1500, len: 800 });
    // the shadows: separate small cut-outs on a flat sheet in front of the cloth (so the cloth never repaints)
    const shL = S.layer({ par: CY.P, sh: 0, flat: true });
    const smP = [0, 1, 2, 3, 4].map(() => S.puppet(shL.add(shadowPerson(c, guardOpts(c), INK))));
    const sjP = S.puppet(shL.add(shadowPerson(c, { ...CAST.jesus, pose: 'sit' }, INK)));
    const ringEl = shL.add(`<g><path d="${c.ribbon(c.arc(0, 0, 25, 25, 0, PI * 2, 30), 2.2)}" fill="${C.sun}"/></g>`);
    const drapeEl = shL.add(`<g><path d="${c.ribbon(c.qbez([-22, 0], [0, -4], [22, 1], 8), 10)}" fill="#9a8aa6"/><path d="${c.ribbon(c.qbez([-20, 2], [-30, 12], [-30, 26], 6), 5)}" fill="#9a8aa6"/></g>`);
    const prophesy = fx.add(`<g>${say(c, [tr('Prorokuj!', 'Prophesy!'), tr('Kto Cię uderzył?', 'Who struck you?')], { size: 20, side: -1, fill: mix(C.cream, C.storm, 0.2) })}</g>`);
    const scrib = (w) => { let d = ''; for (let i = 0; i < 3; i++) d += c.ribbon(Array.from({ length: 8 }, (_, j) => [-w / 2 + (j / 7) * w, -8 + i * 8 + (j % 2 ? -3 : 3)]), 2); return `<path d="${d}" fill="${C.cream}" opacity=".8"/>`; };
    const taunts = [0, 1, 2, 3].map((i) => fx.add(`<g>${speech(c, scrib(40), { w: 66, h: 44, fill: mix(C.storm2, C.ink, 0.3), flip: i % 2 === 1 })}</g>`));

    return (t, time) => {
      const T = time;
      courtIdle(R, Y, T, 0.6);
      R.dawn.fade(0);
      const down = es(t, -0.2, 0.35, ease.out);
      const topY = CY.HTOP - 20;
      vis(scr, { x: CXc, y: topY - (1 - down) * 800, o: down > 0.01 ? 1 : 0 });
      const OX = CXc, OY = topY - (1 - down) * 800;
      const shown = down > 0.01 ? 1 : 0;
      sjP.set({ x: OX, y: OY + FY, s: 0.95, flip: false, o: shown, head: 14 + es(t, 2.4, 2.8) * -6, armF: 24, armB: 14 });
      const cover = es(t, 1.05, 1.25);
      const hy = FY - (167 - 62) * 0.95;
      vis(drapeEl, { x: OX + 4, y: OY + hy - 4 - (1 - cover) * 60, s: 0.95, o: shown * cover * (1 - es(t, 2.9, 3.0)) });
      vis(ringEl, { x: OX + 2, y: OY + hy - 2, s: 0.95, o: shown * es(t, 2.5, 2.8) });
      smP.forEach((p, i) => {
        const side = i % 2 ? 1 : -1;
        const x0 = side * (100 + Math.floor(i / 2) * 90);
        const hit = i < 3 ? bump(t, 0.3 + i * 0.14, 0.7 + i * 0.14) + bump(t, 1.35 + i * 0.12, 1.7 + i * 0.12) : bump(t, 2.05 + (i - 3) * 0.15, 2.45 + (i - 3) * 0.15);
        const on = i < 3 ? es(t, 0.05, 0.1) : es(t, 1.9, 1.95);
        p.set({ x: OX + x0 * 1.1, y: OY + FY + 10, s: 0.9, flip: side > 0, o: on * shown, armF: 30 + hit * 90, armB: 20 + hit * 60 + (i === 4 ? es(t, 2.1, 2.3) * 100 : 0), lean: hit * 8, head: -hit * 6 });
      });
      const pk = es(t, 1.3, 1.5, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(prophesy, { x: CXc - 140, y: 230, s: pk, o: pk > 0.01 ? 1 : 0 });
      taunts.forEach((b, i) => {
        const k = es(t, 2.05 + i * 0.1, 2.2 + i * 0.1, ease.back) * (1 - es(t, 2.88, 2.98));
        vis(b, { x: CXc + [-260, 230, -170, 150][i], y: [230, 250, 180, 170][i], s: k, r: i % 2 ? 6 : -6, o: k > 0.01 ? 1 : 0 });
      });
      S.cam.x = 420;
      S.cam.y = kf(t, [[-0.3, -250], [3, -250]]);
      S.cam.z = kf(t, [[-0.3, 1.3], [1.0, 1.36], [2.0, 1.36], [2.6, 1.46]]);
    };
  },
};
