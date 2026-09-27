// J 4,9–10 — "How is it that you, a Jew, ask a drink of me, a Samaritan woman?" Two name-tags drop down over them.
// Jews and Samaritans keep apart: a torn paper wall rises out of the ground between them and their two cups slide
// away from each other. "If you knew the gift of God, and who it is…" — the wall sinks, a gift hangs down between
// them and the light round Him deepens; "…He would have given you living water": the lid lifts and a glowing
// stream of water pours from His open hand to hers.
import { C, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { wellSet, wellCast, G, NOON, nameTag, speech, GLYPH, cupJ, gift, glory, sparkle, vis, hanging, swing, kf } from './lib.js';

export default {
  id: 'j4-apart',
  beats: [
    { v: 9, text: 'Na to rzekła do Niego Samarytanka: «Jakżeż Ty będąc Żydem, prosisz mnie, Samarytankę, bym Ci dała się napić?»' },
    { v: 9, cont: true, text: 'Żydzi bowiem z Samarytanami unikają się nawzajem.' },
    { v: 10, text: 'Jezus odpowiedział jej na to: «O, gdybyś znała dar Boży i [wiedziała], kim jest Ten, kto ci mówi: "Daj Mi się napić" -' },
    { v: 10, cont: true, text: 'prosiłabyś Go wówczas, a dałby ci wody żywej».' },
  ],
  cam: { x: [-60, 80], y: [-40, 100], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const W = wellSet(S, { skyCols: NOON, sunAt: [830, 150], behind: (S) => S.layer({ par: 0.55, sh: 0, flat: true }) });
    const halo = W.behind.add(`<g>${glory(c, 230, 20)}</g>`);
    const K = wellCast(S, W);
    const fx = S.layer({ par: 0.55, sh: 5 });
    // name tags
    const tagJ = hanging(fx, nameTag(c, tr('Żyd', 'a Jew'), { size: 22 }), { x: G.jx, y: 330, len: 500 });
    const tagW = hanging(fx, nameTag(c, tr('Samarytanka', 'a Samaritan'), { size: 22 }), { x: G.wx, y: 300, len: 500 });
    const q = fx.add(`<g>${speech(c, `<g transform="translate(-14 4) scale(.8)">${cupJ(c)}</g><g transform="translate(14 0)">${GLYPH.q(c)}</g>`, { w: 70, h: 50, flip: true })}</g>`);
    // a wall of stones between them
    const ws = sheet();
    let blocks = '';
    for (let row = 0; row < 11; row++) {
      const y = -row * 28, n = 2, off = row % 2 ? -18 : 0;
      for (let k = 0; k < n + (row % 2); k++) { const x = -40 + off + k * 40; blocks += c.cut(c.rect(x + 1, y - 27, 38, 26), 0.8, 6); }
    }
    ws.p(c.cut([[-44, 0], [-44, -300], [-20, -312], [4, -300], [26, -314], [44, -304], [44, 0]], 1, 8), shade(C.stone2, -0.25));
    ws.p(blocks, mix(C.stone2, C.rock, 0.4));
    const wall = fx.add(`<g><defs><clipPath id="${S.id('wc')}"><path d="${c.poly([[-44, 0], [-44, -300], [-20, -312], [4, -300], [26, -314], [44, -304], [44, 0]])}"/></clipPath></defs><g clip-path="url(#${S.id('wc')})">${ws.out()}</g></g>`);
    const cupL = fx.add(`<g>${cupJ(c, C.clay)}</g>`);
    const cupR = fx.add(`<g>${cupJ(c, C.pot)}</g>`);
    // the gift and the living water
    const giftEl = hanging(fx, gift(c, 80), { x: 860, y: 380, len: 500 });
    const lid = giftEl.querySelector('.lid'), gglow = giftEl.querySelector('.glow');
    const P0 = [G.jx + 70, 520], P2 = [G.wx - 40, 560];
    const pts = c.qbez(P0, [860, 360], P2, 30).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
    const water = fx.add(`<g><path d="M${pts}" stroke="#fff2c8" stroke-width="60" stroke-linecap="round" fill="none" opacity=".25" class="wg"/><path d="M${pts}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" stroke="#bfe6ee" stroke-width="24" stroke-linecap="round" fill="none"/><path d="M${pts}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" stroke="#fffdf4" stroke-width="7" stroke-linecap="round" fill="none"/></g>`);
    const wPaths = water.querySelectorAll('path[pathLength]');
    const wGlow = water.querySelector('.wg');
    const pool = fx.add(`<g><circle r="60" fill="url(#halo-glow)"/><ellipse rx="26" ry="8" fill="#cdeef2"/></g>`);
    const spk = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: fx.add(`<g>${sparkle(c, 10)}</g>`), u: (i + 0.5) / 6 }));
    const qpts = c.qbez(P0, [860, 360], P2, 30);

    return (t, time) => {
      const T = time;
      W.update(t, T, { sunX: 830, sunY: 150, glow: 0.9 });
      const apart = es(t, 1.05, 1.4) * (1 - es(t, 2.05, 2.4));
      const speakJ = es(t, 2.05, 2.25);
      const give = es(t, 3.05, 3.4);
      const her = bump(t, 0.05, 0.95);
      K.set({
        T, jF: 20 + speakJ * 40 + give * 30, jB: 12 + speakJ * 20, jH: -4 * speakJ, jLean: 0,
        wx: G.wx + es(t, 0.1, 0.4) * 24 + apart * 16 - give * 20, wF: 30 + her * 60 + give * 50, wB: 20 + her * 20 + give * 30, wH: -8 * her + 6 * apart - give * 6, wLean: -her * 4 + give * 4,
      });
      K.w.face('sad', 0);
      // v9a — the tags and her question
      const tk = es(t, 0.15, 0.5, ease.out) * (1 - es(t, 2.05, 2.4, ease.in));
      swing(tagJ, G.jx, 330 - (1 - tk) * 600, tk > 0.001 ? T : 0, 1.4, 0.8, 1);
      fade(tagJ, tk > 0.001 ? 1 : 0);
      swing(tagW, G.wx + 20, 300 - (1 - tk) * 600, tk > 0.001 ? T : 0, 1.4, 0.8, 2);
      fade(tagW, tk > 0.001 ? 1 : 0);
      const [whx, why] = K.wHead(G.wx + 24);
      const qk = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      vis(q, { x: whx - 16, y: why - 24, s: qk, o: qk > 0.01 ? 1 : 0 });
      // v9b — the wall between them; the cups slide apart
      vis(wall, { x: 860, y: 660 + (1 - apart) * 360, s: 1, o: apart > 0.01 ? 1 : 0 });
      const cu = es(t, 1.2, 1.6) * (1 - es(t, 2.05, 2.3));
      vis(cupL, { x: lerp(830, 640, cu), y: 590, s: 1.3, o: t > 1.05 && t < 2.35 ? 1 : 0 });
      vis(cupR, { x: lerp(890, 1080, cu), y: 590, s: 1.3, o: t > 1.05 && t < 2.35 ? 1 : 0 });
      // v10a — the gift, and who it is
      const gk = es(t, 2.2, 2.55, ease.out);
      swing(giftEl, 860, 380 - (1 - gk) * 700, T * gk, 1.2, 0.7);
      fade(giftEl, gk > 0.001 ? 1 : 0);
      fade(gglow, es(t, 2.5, 2.8) * (0.6 + 0.4 * Math.sin(T * 2)));
      const hk = es(t, 2.45, 2.8);
      const [jhx, jhy] = K.head();
      vis(halo, { x: jhx, y: jhy, s: 0.5 + hk * 0.5, r: T * 3, o: hk * (0.8 - give * 0.3) });
      // v10b — the lid lifts, living water flows
      const lk = es(t, 3.05, 3.25);
      pose(lid, { y: -lk * 36, r: -lk * 24, ox: -30, oy: -30 });
      const flow = es(t, 3.2, 3.75);
      wPaths.forEach((p) => attr(p, 'stroke-dashoffset', 1 - flow));
      fade(water, flow > 0.001 ? 1 : 0);
      fade(wGlow, es(t, 3.6, 3.9) * 0.35);
      vis(pool, { x: P2[0], y: P2[1] + 6, s: es(t, 3.6, 3.85), o: es(t, 3.6, 3.85) });
      spk.forEach((s) => {
        const u = ((T * 0.25 + s.u) % 1) * flow;
        const p = qpts[Math.min(qpts.length - 1, Math.floor(u * (qpts.length - 1)))];
        vis(s.el, { x: p[0], y: p[1] - 6, s: 0.6 + 0.4 * Math.sin(T * 5 + s.i), r: T * 40, o: flow > 0.05 ? flow : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 10], [0.5, 20], [1.1, 20], [1.6, 30], [2.2, 20], [3.2, 30]]);
      S.cam.y = kf(t, [[-0.5, 40], [0.5, 50], [1.2, 10], [2.2, 0], [3.2, 20]]);
      S.cam.z = kf(t, [[-0.5, 1.14], [0.5, 1.2], [1.2, 1.06], [2.2, 1.04], [3.2, 1.1]]);
    };
  },
};
