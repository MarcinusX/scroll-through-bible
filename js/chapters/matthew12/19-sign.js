// Mt 12,38–39 — the square. Some scribes and Pharisees step forward: "Teacher, we want to see a sign from you" — and
// an empty gilt frame comes down from the sky, a question mark in it, waiting to be filled with a wonder. "An evil
// and adulterous generation seeks a sign": Jesus lifts His hand, and the frame stays empty, greying. "No sign will be
// given to it but the sign of the prophet Jonah": the frame fills with a painting — the stormy sea and the great fish.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { squareSet, SQ, headAt, kf, qMark, bubble, greatFish, JONAH, tagText, glow, sparkle, tr, PI } from './lib.js';
import { waveStrip } from '../../assets/nature.js';

const F = SQ.FEET;
const FW = 320, FH = 210;

export default {
  id: 'mt12-sign',
  beats: [
    { v: 38 },
    { v: 39, text: 'Lecz On im odpowiedział: «Plemię przewrotne i wiarołomne żąda znaku,' },
    { v: 39, cont: true, text: 'ale żaden znak nie będzie mu dany, prócz znaku proroka Jonasza.' },
  ],
  cam: { x: [-30, 40], y: [-40, 50], z: [1, 1.12] },
  build(S) {
    const Q = squareSet(S, { dis: ['peter', 'john'], ph: 3 });
    const c = Q.c;
    const fx = S.layer({ par: 0.2, sh: 6 });
    /* the frame and what appears in it */
    const fr = sheet();
    fr.p(c.cut(c.rect(-FW / 2, -FH / 2, FW, FH), 0.6, 10) + c.hole(c.rect(-FW / 2 + 18, -FH / 2 + 18, FW - 36, FH - 36), 0.5, 10), C.ochre);
    fr.p(c.cut(c.rect(-FW / 2 + 6, -FH / 2 + 6, FW - 12, 6), 0.3, 8), shade(C.ochre, 0.3));
    let orn = '';
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { orn += c.cut(c.circ(a * (FW / 2 - 9), b * (FH / 2 - 9), 10, 10), 0.3, 3); });
    fr.p(orn, C.sunDeep);
    const inner = (FW - 36) / 2, innerH = (FH - 36) / 2;
    const clip = S.id('sigclip');
    const sea = `<defs><clipPath id="${clip}"><rect x="${-inner}" y="${-innerH}" width="${inner * 2}" height="${innerH * 2}"/></clipPath></defs><g clip-path="url(#${clip})"><rect x="${-inner}" y="${-innerH}" width="${inner * 2}" height="${innerH * 2}" fill="${mix(C.storm, C.lavender, 0.3)}"/>${waveStrip(c, { y: -10, len: 60, amp: 8, x0: -inner - 60, x1: inner + 60, bottom: innerH + 10, color: C.waveStorm })}<g transform="translate(20 40) scale(.5)">${greatFish(c, { w: 300 })}</g>${waveStrip(c, { y: 54, len: 50, amp: 6, x0: -inner - 60, x1: inner + 60, bottom: innerH + 10, color: C.waveStorm2 })}<g transform="translate(-60 28) scale(.3) rotate(20)">${person(c, JONAH)}</g></g>`;
    const frame = hanging(fx, `<g data-part="bg"><path d="${c.cut(c.rect(-inner, -innerH, inner * 2, innerH * 2), 0.4, 8)}" fill="${C.parchment}"/></g><g data-part="grey" opacity="0"><path d="${c.poly(c.rect(-inner, -innerH, inner * 2, innerH * 2))}" fill="${C.rock2}"/></g><g data-part="q"><g transform="scale(1.2)">${qMark(c, 70)}</g></g><g data-part="jon" opacity="0">${sea}</g>${fr.out()}<g data-part="lbl" opacity="0" transform="translate(0 ${FH / 2 + 26})">${tagText(c, tr('znak Jonasza', 'the sign of Jonah'), { size: 20 })}</g>`, { x: SQ.JX, y: -400, len: 900 });
    const part = (k) => frame.querySelector(`[data-part="${k}"]`);
    const grey = part('grey'), q = part('q'), jon = part('jon'), lbl = part('lbl');
    const glowJ = fx.add(`<g opacity="0">${glow(260, 0.8)}</g>`);
    const ask = Q.act.add(`<g opacity="0">${bubble(c, [tr('Nauczycielu,', 'Teacher,'), tr('pokaż nam znak!', 'show us a sign!')], { size: 20, tail: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      const step = es(t, 0.05, 0.3);
      const point = es(t, 0.3, 0.45) * (1 - es(t, 1.2, 1.4));
      const refuse = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.1));
      const jonahK = es(t, 2.15, 2.45);
      Q.pose(t, T,
        { armF: 16 + refuse * 70 + jonahK * 40, armB: 8 + jonahK * 90, head: -2 - jonahK * 8, blink: blinkAt(T, 2) },
        (d) => ({ blink: blinkAt(T, d.seed) }),
        (m) => ({ x: m.x - step * 40, armF: 8 + (m.i === 0 ? point * 150 : m.i === 1 ? point * 70 : 10), armB: m.i === 2 ? point * 60 : 4, head: -point * 8 + refuse * 6, lean: refuse * -3, blink: blinkAt(T, m.seed) }));
      const ak = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 1.05, 1.2));
      const [hx, hy] = headAt(SQ.PX[1] - 40, F, 0.96, true);
      pose(ask, { x: hx - 40, y: hy - 30, s: ak, o: ak > 0.01 ? 1 : 0 });

      const fd = es(t, 0.35, 0.7, ease.back);
      pose(frame, { x: SQ.JX, y: lerp(-400, 290, fd) - bump(t, 1.2, 1.5) * 10, r: Math.sin(T * 0.8) * 0.8 + bump(t, 1.2, 1.6) * 3, oy: 0, o: fd > 0.01 ? 1 : 0 });
      fade(grey, es(t, 1.3, 1.6) * (1 - jonahK) * 0.6);
      fade(q, (1 - es(t, 1.35, 1.6)) * 1);
      fade(jon, jonahK);
      fade(lbl, es(t, 2.35, 2.5));
      pose(glowJ, { x: SQ.JX, y: 290, o: jonahK * 0.8 });

      S.cam.x = kf(t, [[-0.5, 30], [0.9, 30], [1.2, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [0.9, 1.1], [1.2, 1.04]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.9, 30], [1.2, 0]]);
    };
  },
};
