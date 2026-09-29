// Łk 11,14–16 — a village square in the hills of Judea at midday, the houses climbing the terraced hill behind, the
// crowd all round. A man who cannot speak stands before Jesus — his mouth taped over with paper, a dark shadow
// clinging behind him and a little dark spirit on his shoulder; his brother has led him in. Jesus lifts His hand
// against it: the spirit twists and tugs. It goes out — shoots off and fades, the shadow drops away, the tape falls —
// and the mute man speaks, golden sparks in his bubble; the whole crowd throws up its hands in wonder. But some put
// their heads together: "By Beelzebul, the prince of demons!" — a dark bubble with the horned shadow-prince and his
// flies. Others, to test Him, point up at the sky and demand a sign from heaven: an empty gilt frame comes down from
// the clouds with a question in it, waiting to be filled.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { villageSet, VQ, DUMB, DUMB_OK, manOf, withFace, tapeX, spirit, shadowCloak, speech, shout, darkPrince, flyBug, tagText, qMark, sparkle, glow, handAt, headAt, kf, moving, tr, PI } from './lib.js';

const F = VQ.FEET;
const MX = 676;       // where the man stands before Jesus

/** an empty gilt picture frame (the sign they want), origin centre */
function giltFrame(c, w = 170, h = 120) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28), 0.5, 8) + c.hole(c.rect(-w / 2, -h / 2, w, h), 0.4, 8), C.sun);
  let orn = '';
  for (let i = 0; i < 10; i++) { const x = -w / 2 - 7 + (i * (w + 14)) / 9; orn += c.poly(c.star(x, -h / 2 - 7, 4, 1.6, 4, 0)) + c.poly(c.star(x, h / 2 + 7, 4, 1.6, 4, 0)); }
  s.x(orn, C.star);
  return `<path d="M-60 -1600V${-h / 2 - 14}M60 -1600V${-h / 2 - 14}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="${mix(C.skyBlue, C.cream, 0.5)}" opacity=".55"/>${s.out()}`;
}

export default {
  id: 'lk11-mute',
  beats: [
    { v: 14, text: 'Raz wyrzucał złego ducha [u tego], który był niemy.' },
    { v: 14, cont: true, text: 'A gdy zły duch wyszedł, niemy zaczął mówić i tłumy były zdumione.' },
    { v: 15 },
    { v: 16 },
  ],
  cam: { x: [-40, 60], y: [-60, 50], z: [1, 1.14] },
  build(S) {
    const Q = villageSet(S, { dis: ['peter', 'john'] });
    const c = Q.c;
    const act = Q.act;
    const cloak = act.add(`<g>${shadowCloak(c, 150, 250)}</g>`);
    const brother = S.puppet(act.add(person(c, manOf(c, { robe: C.ochreRobe, mantle: null, hairStyle: 'wrap', veil: C.stone, beard: 'short', belt: C.leather }))));
    const mute = S.puppet(act.add(withFace(person(c, DUMB), `<g transform="translate(9 9)">${tapeX(c, 18)}</g>`)));
    const healed = S.puppet(act.add(person(c, DUMB_OK)));
    const imp = act.add(`<g>${spirit(c, 1.3, '#3d3346')}</g>`);
    const heal = Q.rayFx.add(`<g opacity="0">${glow(140, 1)}</g>`);
    const tapeFall = act.add(`<g opacity="0">${tapeX(c, 18)}</g>`);
    const talk = Q.W.add(`<g opacity="0">${speech(c, `${sparkle(c, 10, C.sun)}<g transform="translate(16 2)">${sparkle(c, 7, C.sun)}</g><g transform="translate(-16 4)">${sparkle(c, 6, C.sun)}</g>`, { w: 64, h: 46 })}</g>`);
    const whisper = Q.W.add(`<g opacity="0">${shout(c, `<g transform="scale(.9)">${darkPrince(c, 34)}</g>`, { w: 140, h: 116, fill: mix(C.stone2, C.storm, 0.35), flip: true })}<g transform="translate(-74 -26)">${tagText(c, tr('Belzebub!', 'Beelzebul!'), { size: 18, fill: mix(C.cream, C.rock2, 0.35) })}</g></g>`);
    const flies = [0, 1, 2, 3, 4].map(() => Q.W.add(`<g opacity="0">${flyBug(c)}</g>`));
    /* the sign from heaven they ask for */
    const frame = Q.flyL.add(`<g opacity="0">${giltFrame(c)}<g transform="translate(0 4)">${qMark(c, 70)}</g></g>`);
    const testers = [manOf(c, { robe: C.plumRobe, mantle: C.stone, hairStyle: 'wrap', veil: C.linen2, beard: 'full' }), manOf(c, { robe: C.tealRobe, hairStyle: 'short', beard: 'short' })]
      .map((o, i) => ({ i, p: S.puppet(act.add(person(c, o))) }));

    const mK = [[-0.8, 330], [0.3, MX]];

    return (t, time) => {
      const T = time;
      /* v14a — the mute man before Jesus; He commands the spirit */
      const mx = kf(t, mK, (u) => ease.sine(u));
      const walking = moving(t, mK);
      const well = es(t, 1.28, 1.34);
      const cmd = es(t, 0.35, 0.55) * (1 - es(t, 1.5, 1.8));
      const sign = es(t, 3.1, 3.3);
      Q.pose(t, T,
        { armF: 16 + cmd * 70 + es(t, 2.1, 2.3) * 10, armB: 8 + cmd * 20, head: -2 + es(t, 0.3, 0.6) * (1 - es(t, 2.0, 2.2)) * 6 - sign * 4, blink: blinkAt(T, 2) },
        (d) => ({ x: d.x - 80, y: F - 26, s: 0.9, armF: 10 + es(t, 1.35, 1.6) * 40, armB: 6 + es(t, 1.35, 1.6) * (d.i ? 110 : 20), head: -2 - es(t, 1.35, 1.6) * 6 }),
        (m) => {
          const plot = es(t, 2.05 + m.i * 0.05, 2.25 + m.i * 0.05) * (1 - es(t, 3.0, 3.2) * 0.5);
          return { x: m.x + (m.i === 0 ? plot * 30 : m.i === 2 ? -plot * 26 : 0), armF: 8 + plot * (m.i === 1 ? 60 : 20), armB: plot * 20, head: plot * (m.i === 0 ? -14 : 14), lean: plot * (m.i === 0 ? -8 : 8), flip: m.i === 0 ? plot < 0.5 : true, blink: Math.max(plot * 0.5, blinkAt(T, m.seed)) };
        });
      const my = F + 4;
      const tug = t > 0.45 && t < 1.2 ? Math.sin(t * 50) * 3 * es(t, 0.45, 0.6) : 0;
      mute.set({ x: mx + tug, y: my, s: 0.98, o: 1 - well, walk: walking ? mx * 0.05 : undefined, armF: 40 + es(t, 0.5, 0.7) * 20, armB: 10, head: 8 + tug, lean: 4, blink: 0 });
      healed.set({ x: mx, y: my, s: 0.98, o: well, armF: 30 + es(t, 1.45, 1.7) * 60, armB: es(t, 1.45, 1.7) * 130, head: -6 - es(t, 1.45, 1.7) * 6, blink: blinkAt(T, 5) });
      const bx = mx - 96;
      const glad = es(t, 1.45, 1.7);
      brother.set({ x: bx, y: my + 4, s: 0.95, walk: walking ? bx * 0.05 + 1 : undefined, armF: 60 + glad * 50, armB: glad * 140, head: -glad * 8, blink: blinkAt(T, 7) });
      pose(cloak, { x: mx - 6, y: my + 2, s: 1 + bump(t, 1.1, 1.3) * 0.2, o: 1 - es(t, 1.12, 1.35) });

      /* v14b — the spirit goes out; he speaks; the crowds wonder */
      const flee = es(t, 1.05, 1.5, ease.in);
      const [shx, shy] = headAt(mx, my, 0.98, false);
      const writhe = t > 0.45 && t < 1.05 ? Math.sin(t * 36) * 8 : 0;
      pose(imp, { x: lerp(shx - 24, shx - 380, flee) + writhe, y: lerp(shy + 30, shy - 280, flee), r: flee * -140 + (T ? Math.sin(T * 3) * 6 : 0) * (1 - flee) + writhe, s: 1 - flee * 0.4, o: 1 - es(t, 1.3, 1.52) });
      pose(heal, { x: shx, y: shy + 40, o: bump(t, 1.0, 1.8) });
      const tf = es(t, 1.25, 1.55, ease.in);
      pose(tapeFall, { x: shx + 9, y: shy + 9 + tf * 150, r: tf * 200, o: well * (1 - es(t, 1.5, 1.56)) });
      const tk = es(t, 1.36, 1.5, ease.back) * (1 - es(t, 2.3, 2.5));
      pose(talk, { x: shx + 16, y: shy - 14, s: tk, o: tk > 0.01 ? 1 : 0 });
      const wow = es(t, 1.45, 1.65) * (1 - es(t, 2.05, 2.3) * 0.7);
      Q.amaze(wow);

      /* v15 — "By Beelzebul!" */
      const wk = es(t, 2.25, 2.45, ease.back) * (1 - es(t, 3.0, 3.15) * 0.6);
      const [px, py] = headAt(VQ.PX[1], F, 0.96, true);
      pose(whisper, { x: px - 30, y: py - 30, s: wk, o: wk > 0.01 ? 1 : 0 });
      flies.forEach((f, i) => {
        const a = T * (1.4 + i * 0.2) + i * 1.3;
        pose(f, { x: px - 110 + Math.cos(a) * (70 + i * 6), y: py - 110 + Math.sin(a * 1.3) * 40, r: Math.sin(a) * 30, o: es(t, 2.35 + i * 0.03, 2.5 + i * 0.03) * (1 - es(t, 3.0, 3.15)) });
      });

      /* v16 — others demand a sign from heaven: the empty frame comes down */
      testers.forEach((m) => {
        const x = 1250 - m.i * 70;
        const up = es(t, 3.05 + m.i * 0.06, 3.25 + m.i * 0.06);
        m.p.set({ x: kf(t, [[2.8, x + 200], [3.1, x]]), y: F + 12 + m.i * 6, s: 0.94, flip: true, o: es(t, 2.8, 2.9), walk: moving(t, [[2.8, x + 200], [3.1, x]]) ? t * 60 + m.i : undefined, armF: 20 + up * 120, armB: 10 + up * 40, head: -up * 18, blink: blinkAt(T, 8 + m.i) });
      });
      const fk = es(t, 3.2, 3.55, ease.out);
      pose(frame, { x: 990, y: lerp(-500, 250, fk), r: T ? Math.sin(T * 0.8) * 1.4 : 0, o: fk > 0.004 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.6, -30], [0.6, -20], [1.0, -10], [2.0, -10], [2.2, 30], [3.0, 30], [3.3, 50]]);
      S.cam.z = kf(t, [[-0.6, 1.08], [0.6, 1.1], [1.0, 1.14], [2.0, 1.14], [2.2, 1.1], [3.0, 1.1], [3.4, 1.02]]);
      S.cam.y = kf(t, [[-0.6, 36], [1.0, 50], [2.0, 50], [2.2, 40], [3.0, 40], [3.4, -40]]);
    };
  },
};
