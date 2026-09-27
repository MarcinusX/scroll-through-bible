// Mk 14,22–25 — the heart of the chapter. He takes the bread, blesses it (a soft light falls), breaks it —
// the halves glow — and gives it: "Take, this is my body". The golden cup: thanks, and it goes round to all.
// "My blood of the covenant, poured out for many": the light of the cup streams out through the windows.
// He sets the cup down; a vine grows; the new wine of the Kingdom shines on a hanging plate.
import { C, person, CAST, blinkAt, pose, attr, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  upperRoom, supperTable, seatAll, kf, hand, headAt, loaf, loafHalves, chalice, glory, discPlate, lowTable, spark, PI,
vis, } from './lib.js';
import { lightCrown as lc8 } from '../mark8/lib.js';

export default {
  id: 'm14-eucharist',
  beats: [
    { v: 22, text: 'A gdy jedli, wziął chleb, odmówił błogosławieństwo,' },
    { v: 22, cont: true, text: 'połamał i dał im mówiąc: «Bierzcie, to jest Ciało moje».' },
    { v: 23 },
    { v: 24 },
    { v: 25 },
  ],
  cam: { x: [-60, 60], y: [-40, 300], z: [1, 2.0] },
  build(S) {
    const c = S.c;
    const NIGHTSKY = ['#2a2f60', '#4d4a7c', '#7d6a8a'];
    const R = upperRoom(S, { skyCols: NIGHTSKY });
    const { SEAT, TOP, FLOOR } = R;
    R.stars.fade(1);

    // a beam of light from above onto Him
    const gid = S.id('beam');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dc" stop-opacity=".0"/><stop offset=".25" stop-color="#fff6dc" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></linearGradient>`);
    const beamL = S.layer({ par: 0.5, sh: 0, flat: true });
    beamL.add(`<path d="${c.poly([[740, 180], [860, 180], [960, TOP + 10], [640, TOP + 10]])}" fill="url(#${gid})"/>`);

    // the vine that grows along the wall (v25)
    const vineL = S.layer({ par: 0.32, sh: 3 });
    const vine = (() => {
      const pts = c.cbez([380, 700], [360, 420], [620, 240], [800, 250], 30);
      const pts2 = c.cbez([1220, 700], [1240, 420], [980, 240], [800, 250], 30);
      const s = sheet();
      s.p(c.ribbon(pts, 4) + c.ribbon(pts2, 4), C.wood2);
      let lv = '', lv2 = '', gr = '';
      [...pts, ...pts2].forEach(([x, y], i) => {
        if (i % 2) return;
        const leaf = c.cut(c.star(x + c.rr(-8, 8), y + c.rr(-6, 6), c.rr(11, 15), c.rr(6, 9), 5, c.rr(0, 6)), 0.4, 3);
        if (i % 4) lv += leaf; else lv2 += leaf;
        if (i % 8 === 4) for (let g = 0; g < 7; g++) gr += c.cut(c.circ(x + (g % 3 - 1) * 5.5, y + 14 + Math.floor(g / 3) * 6, 3.8, 8), 0.2, 2);
      });
      s.p(lv2, C.moss).p(lv, C.leaf).p(gr, C.plumRobe);
      return s.out();
    })();
    const vineClip = S.id('vclip');
    const vineEl = vineL.add(`<defs><clipPath id="${vineClip}"><circle data-k="vr" cx="800" cy="700" r="10"/></clipPath></defs><g clip-path="url(#${vineClip})">${vine}</g>`);
    const vr = S.$('vr');

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatAll(S, seatL);
    const J = at.find((m) => m.k === 'jesus');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${supperTable(c, 860)}</g>`);

    // bread, halves, pieces; the cup
    const fx = S.layer({ par: 0.57, sh: 4 });
    const H = loafHalves(c, 26);
    const breadGlow = fx.add(`<g><circle r="60" fill="url(#halo-glow)"/></g>`);
    const whole = fx.add(`<g>${loaf(c, 26)}</g>`);
    const halfL = fx.add(`<g>${H.left}</g>`), halfR = fx.add(`<g>${H.right}</g>`);
    const others = at.filter((m) => m.k !== 'jesus');
    const pieces = others.map((m, n) => ({ m, n, el: fx.add(`<g><circle r="22" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.blob(0, -4, 10, 6, 8, 0.25), 0.3, 3), C.wheat2).out()}</g>`) }));
    const cupGlow = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/><g opacity=".45">${glory(c, 120, 18).replace('<circle', '<circle opacity="0"')}</g></g>`);
    const cupEl = fx.add(`<g>${chalice(c, 46)}</g>`);
    const motes = Array.from({ length: 20 }, (_, i) => ({ i, el: fx.add(`<g><circle r="9" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, 0, 4.5, 1.6, 4, 0))}" fill="#fff4d6"/></g>`), side: i % 2 ? 1 : -1, off: c.rr(0, 1), dy: c.rr(-30, 30) }));
    // the Kingdom: a golden table with the new cup
    const kingdom = hanging(fx, discPlate(c, `<g transform="translate(0 30) scale(.5)">${lowTable(c, 150, 40)}</g><g transform="translate(0 6)">${chalice(c, 40, { dark: false })}</g><g transform="translate(0 -30) scale(.36)">${lc8(c, 46)}</g>`, { r: 64, rim: C.sun, fill: mix(C.cream, C.halo, 0.4) }), { x: 800, y: 300, len: 700 });

    return (t, time) => {
      const T = time;
      R.lamps.forEach((l, i) => {
        swing(l.el, l.x, l.y, T, 1, 0.7, i);
        pose(l.fl, { x: 26, y: 36, sx: 0.8 + Math.sin(T * 7 + i) * 0.06, sy: 0.8 + Math.sin(T * 5.3 + i) * 0.1 });
        fade(l.gl, 0.65);
      });
      const bless = es(t, 0.25, 0.6) * (1 - es(t, 1.9, 2.2));
      const thanks = es(t, 2.05, 2.3) * (1 - es(t, 2.45, 2.6));
      const covenant = es(t, 3.05, 3.4) * (1 - es(t, 4.1, 4.4));
      beamL.fade(bless * 0.9 + thanks * 0.6 + covenant * 0.8 + es(t, 4.4, 4.8) * 0.4);
      const grow = es(t, 4.2, 4.9);
      attr(vr, 'r', Math.round(10 + grow * 700));

      /* Jesus: takes the bread, lifts it, breaks it, gives; the cup */
      const lift = es(t, 0.05, 0.3) * (1 - es(t, 1.0, 1.15));
      const breakK = es(t, 1.05, 1.3);
      const give = es(t, 1.3, 1.5) * (1 - es(t, 1.95, 2.05));
      const cupUp = es(t, 2.02, 2.2) * (1 - es(t, 2.35, 2.45)) + es(t, 3.0, 3.3) * (1 - es(t, 4.05, 4.3));
      const setDown = es(t, 4.05, 4.3);
      const armF = 40 + lift * 55 + breakK * (1 - give) * 20 * (1 - es(t, 1.9, 2.0)) + give * 30 + cupUp * 34 + setDown * 10;
      const armB = 20 + lift * 60 + breakK * 50 * (1 - es(t, 1.9, 2.0)) + cupUp * 20 + es(t, 4.3, 4.7) * 60;
      J.p.set({ x: 800, y: SEAT, s: 1.04, flip: false, armF, armB, head: -bless * 14 - thanks * 12 - covenant * 4 + setDown * 6 - es(t, 4.5, 4.8) * 12, blink: blinkAt(T) });
      fade(J.sad, 0);
      const [hx, hy] = hand(800, SEAT, 1.04, false, armF, 0, 62);
      const [bx, by] = hand(800, SEAT, 1.04, true, armB, 0, 62);     // back hand, mirrored side
      // the whole loaf, then two halves
      const breadShow = es(t, -0.1, 0.1) * (1 - breakK);
      const midX = (hx + bx) / 2 + 40, midY = Math.min(hy, by) - 6;
      vis(whole, { x: hx - 6, y: hy + 10, o: breadShow > 0.01 ? 1 : 0 });
      const apart = breakK * 22;
      const halvesOn = breakK > 0 && t < 2.05 ? 1 : 0;
      vis(halfL, { x: hx - 8 - apart, y: hy + 10, r: -breakK * 12, o: halvesOn });
      vis(halfR, { x: hx - 4 + apart, y: hy + 10, r: breakK * 12, o: halvesOn });
      vis(breadGlow, { x: hx - 6, y: hy, s: 0.6 + bless * 0.4 + breakK * 0.6, o: Math.max(bless, breakK * (1 - es(t, 1.95, 2.1))) });
      pieces.forEach((p) => {
        const d = Math.abs(p.m.i - 6);
        const k = es(t, 1.35 + d * 0.05, 1.65 + d * 0.05);
        const [tx, ty] = hand(p.m.x, SEAT, p.m.s, p.m.flip, 60, 0, 62);
        vis(p.el, { x: lerp(hx, tx, k), y: lerp(hy, ty, k) - Math.sin(k * PI) * 50, s: 0.9, o: k > 0 && t < 2.05 ? 1 : 0 });
      });

      // the cup goes round: to the left side, then the right side, then back to Him
      const round = seg(t, 2.4, 3.0);
      const leftSide = others.filter((m) => m.x < 800).sort((a, b) => b.x - a.x), rightSide = others.filter((m) => m.x > 800).sort((a, b) => a.x - b.x);
      const path = [[hx, hy], ...leftSide.map((m) => hand(m.x, SEAT, m.s, m.flip, 60, 0, 62)), [800, TOP + 14], ...rightSide.map((m) => hand(m.x, SEAT, m.s, m.flip, 60, 0, 62)), [hx, hy]];
      const seg_ = round * (path.length - 1), si = Math.min(path.length - 2, Math.floor(seg_)), sf = seg_ - si;
      const inRound = round > 0 && round < 1;
      const [cx0, cy0] = inRound ? [lerp(path[si][0], path[si + 1][0], ease.io(sf)), lerp(path[si][1], path[si + 1][1], ease.io(sf)) - Math.sin(sf * PI) * 12] : [hx, hy];
      const cupShow = es(t, 1.95, 2.05);
      const [dx, dy] = setDown > 0 ? [lerp(hx, 800 + 56, setDown), lerp(hy, TOP, setDown)] : [cx0, cy0];
      vis(cupEl, { x: dx, y: dy + 6, o: cupShow > 0.01 ? 1 : 0 });
      vis(cupGlow, { x: dx, y: dy - 30, s: 0.5 + covenant * 0.7, o: Math.max(thanks, covenant, es(t, 4.4, 4.8) * 0.4) });

      others.forEach((m) => {
        let aF = 36, aB = 14, head = 0;
        // receive the bread
        const d = Math.abs(m.i - 6);
        aF += es(t, 1.4 + d * 0.05, 1.6 + d * 0.05) * 30 * (1 - es(t, 2.0, 2.2));
        head += bless * 6 - es(t, 1.5, 1.8) * 6 * (1 - es(t, 2.0, 2.2));
        // drink when the cup comes
        const near = inRound ? Math.max(0, 1 - Math.abs(cx0 - hand(m.x, SEAT, m.s, m.flip, 60, 0, 62)[0]) / 50) : 0;
        aF += near * 24;
        head -= near * 10;
        // for many: they look up to the light going out
        head -= covenant * 10 + es(t, 4.5, 4.8) * 8;
        m.p.set({ x: m.x, y: SEAT + (m.i % 2) * 3, s: m.s, flip: m.flip, armF: aF, armB: aB, head, blink: blinkAt(T, m.seed) });
      });

      // poured out for many: motes of light stream out through both windows
      motes.forEach((mo) => {
        const k = (T * 0.22 + mo.off) % 1;
        const on = covenant;
        const tx = mo.side < 0 ? 530 : 1070, ty = 420;
        const x = lerp(dx, tx, k) + Math.sin(k * 5 + mo.i) * 10, y = lerp(dy - 40, ty + mo.dy, k) - Math.sin(k * PI) * 90;
        vis(mo.el, { x: k < 0.75 ? x : lerp(tx, tx + mo.side * 200, (k - 0.75) * 4), y: k < 0.75 ? y : ty + mo.dy - (k - 0.75) * 120, s: 0.7 + k * 0.5, o: on * Math.min(1, k * 6) * (1 - Math.max(0, k - 0.8) * 5) });
      });

      // v25 — the new wine in the Kingdom
      const kin = es(t, 4.5, 4.85, ease.out);
      vis(kingdom, { x: 800, y: 300 - (1 - kin) * 700, r: Math.sin(T * 0.8) * 1.5, o: kin > 0.01 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.z = kf(t, [[-0.5, 1.5], [0.4, 1.9], [1.3, 1.8], [1.6, 1.4], [2.1, 1.8], [2.45, 1.3], [3.0, 1.34], [3.3, 1.7], [4.0, 1.6], [4.6, 1.2]]);
      S.cam.y = kf(t, [[-0.5, 180], [0.4, 270], [1.3, 260], [1.6, 200], [2.1, 260], [2.45, 190], [3.0, 190], [3.3, 230], [4.0, 200], [4.6, 40]]);
    };
  },
};
