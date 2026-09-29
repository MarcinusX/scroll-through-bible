// Łk 5,4–5 — He stops speaking and turns to Simon: "Put out into the deep and let down your nets" (He points out over
// the water). The beach with the listening crowd slides away behind them and the water in
// front darkens to deep blue. Simon holds up the empty net, still dripping: "Master, we toiled all night and caught
// nothing" — a little night of his own floats over his head: the moon, the stars, the empty net. Then he turns to
// Jesus and nods: "but at your word" — and he and Andrew pay out the net over the side: its floats spread across
// the surface and the mesh sinks into the translucent deep.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { moon, stars, grass } from '../../assets/nature.js';
import {
  deepSet, DP, CREW_A, sunkNet, emptyNet, speech, thought, castNet, withFace, faceBits, group, folk, headAt, hand, kf,
  PETER_W, MORNING, es, ease, bump, seg, fade, tr, PI, FONT,
} from './lib.js';

const A0 = { x: DP.AX + 30, y: DP.AY + 40, s: 1.04 };      // near the beach (first), then out on the deep
const A1 = { x: DP.AX, y: DP.AY, s: 1 };
const NET_X = DP.NX;                                 // the net is paid out from here to the left

/** Simon's night in a thought cloud: the dark sky, the moon, stars and an empty net hanging */
function nightIcon(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 30, 28), 0.3, 4), C.night2);
  s.x(c.poly(c.star(-14, -14, 2.4, 1, 4, 0)) + c.poly(c.star(10, -20, 2, 0.8, 4, 0)) + c.poly(c.star(18, 6, 1.8, 0.8, 4, 0)), C.star);
  let net = '';
  for (let i = 0; i <= 4; i++) { const x = -14 + i * 7; net += c.ribbon([[x, -2], [x * 0.4, 20]], 1.1); }
  for (let k = 1; k <= 2; k++) net += c.ribbon([[-12 + k * 3, -2 + k * 8], [12 - k * 3, -2 + k * 8]], 1);
  s.x(net + c.ribbon([[-15, -2], [15, -2]], 1.6), C.rope);
  return s.out() + `<g transform="translate(-6 -12) scale(.3)">${moon(c, 30)}</g>`;
}

export default {
  id: 'lk5-deep',
  beats: [
    { v: 4 },
    { v: 5, text: 'A Szymon odpowiedział: «Mistrzu, całą noc pracowaliśmy i niceśmy nie ułowili.' },
    { v: 5, cont: true, text: 'Lecz na Twoje słowo zarzucę sieci».' },
  ],
  cam: { x: [-240, 80], y: [0, 200], z: [1, 1.26] },
  build(S) {
    const c = S.c;
    const D = deepSet(S, {
      skyCols: MORNING, deep: 0,
      crewA: [
        { k: 'andrew', o: CAST.andrew, x: CREW_A.andrew, dy: -8, s: 0.94 },
        { k: 'peter', markup: withFace(person(c, PETER_W), faceBits(c)), x: CREW_A.peter, dy: -8, s: 0.96 },
        { k: 'jesus', o: { ...CAST.jesus, pose: 'sit' }, x: CREW_A.jesus, dy: -34, s: 1.0 },
      ],
    });
    const { K, A, uwL, fx } = D;
    const pSad = A.crew.peter.p.el.querySelector('[data-part="sad"]');

    /* the net, paid out into the deep (origin at its right float, near the boat) */
    const net = uwL.add(`<g><g transform="translate(${-DP.NW} 0)">${sunkNet(c, { w: DP.NW, h: 150 })}</g></g>`);


    /* the beach they leave, with the crowd sitting on it (slides away) */
    const shoreL = S.layer({ par: 0.55, sh: 3, pad: 700 });
    const bfn = (x) => 700 + Math.max(0, x - 200) * 0.3;
    shoreL.add(sheet().p(c.ridge(bfn, -1400, 2000, 1800, 12, 1), mix(C.sand, C.stone, 0.22)).x(c.ribbon(Array.from({ length: 30 }, (_, i) => { const x = -1400 + i * 110; return [x, bfn(x) + 2]; }), 4), C.foam, 'opacity=".85"').out() + grass(c, { x0: -900, x1: 200, y: 0, fn: (x) => bfn(x) + 60, n: 12, h: 12, color: C.olive }));
    const mem = [];
    for (let i = 0; i < 16; i++) { const x = c.rr(-200, 420), y = bfn(x) + c.rr(20, 110); mem.push({ x, y, s: 0.8 + (y - 700) * 0.001, flip: false, o: { ...folk(c), pose: 'sit' } }); }
    shoreL.add(`<g>${group(c, mem)}</g>`);

    /* words */
    const cmd = fx.add(`<g>${speech(c, `<g transform="translate(-12 0) scale(.28)">${castNet(c, 70, C.rope)}</g><path d="${c.ribbon([[8, -12], [8, 10]], 3)}" fill="${C.teal2}"/><path d="${c.poly([[1, 8], [8, 18], [15, 8]])}" fill="${C.teal2}"/><path d="${c.ribbon([[14, -8], [30, -8]], 2.6)}" fill="${C.terracotta}"/>`, { w: 84, h: 54, flip: true })}</g>`);
    const night = fx.add(`<g>${thought(c, nightIcon(c), { w: 96, h: 80 })}</g>`);
    const word = fx.add(`<g>${speech(c, `<text x="0" y="7" text-anchor="middle" font-family="${FONT}" font-size="20" font-style="italic" fill="${C.ink}">${tr('na Twoje słowo', 'at your word')}</text>`, { w: 150, h: 46 })}</g>`);
    const empty = fx.add(`<g>${emptyNet(c, { w: 110, h: 92, col: mix(C.rope, C.linen, 0.35) })}</g>`);
    const drips = Array.from(empty.querySelectorAll('.drip'));
    const floatsIn = [0, 1, 2].map(() => fx.add(`<path d="${c.ribbon(c.arc(0, 0, 30, 7, 0, PI * 2, 20), 2)}" fill="${C.foam}"/>`));

    return (t, time) => {
      const T = time;
      K.idle(T, { sunY: lerp(150, 130, es(t, 0, 3)) });

      /* v4 — out onto the deep */
      const out = es(t, 0.3, 0.95, ease.sine);
      D.water(T, out, lerp(0.8, 0.6, out));
      shoreL.shift(-out * 300, out * 520);
      shoreL.fade(1 - es(t, 0.7, 0.95));
      const bob = Math.sin(T * 1.2) * 2;
      const heel = es(t, 2.3, 2.8) * -3;
      const B = { x: lerp(A0.x, A1.x, out), y: lerp(A0.y, A1.y, out) + bob, s: lerp(A0.s, A1.s, out), r: Math.sin(T * 0.8) * 0.8 + heel };
      A.set(B);

      const point = es(t, 0.08, 0.3) * (1 - es(t, 0.95, 1.1));
      const listen = es(t, 1.05, 1.2) * (1 - es(t, 2.9, 3));
      A.put('jesus', B, { flip: true, armF: 20 + point * 70 + listen * 10, armB: 10 + point * 30 + bump(t, 2.1, 2.5) * 30, head: -point * 4 + listen * 4, blink: blinkAt(T) });

      // Andrew pays out the net
      const pay = es(t, 2.2, 2.5) * (1 - es(t, 2.95, 3));
      A.put('andrew', B, { flip: true, armF: 30 + pay * 40, armB: 20 + pay * 40, lean: pay * 10, head: 6 + pay * 10, blink: blinkAt(T, 2) });

      /* v5a — Simon holds up the empty net: all night, nothing */
      const tired = es(t, 1.05, 1.3) * (1 - es(t, 2.1, 2.3));
      const nod = bump(t, 2.02, 2.3);
      const lift = es(t, 1.08, 1.3) * (1 - es(t, 2.1, 2.25));
      A.put('peter', B, {
        flip: t > 2.2,
        armF: 20 + lift * 110 + pay * 50, armB: 10 + lift * 90 + pay * 40 + point * 0, lean: pay * 12, head: tired * 10 + nod * 16 + pay * 12, blink: blinkAt(T, 3),
      });
      fade(pSad, tired);
      const [phx, phy] = A.at(B, CREW_A.peter + 30, -8 - 190 * 0.96);
      pose(empty, { x: phx, y: phy + 6, s: 0.9, r: Math.sin(T * 1.5) * 3, o: lift });
      drips.forEach((d, i) => { const k = ((T * 1.6 + i * 0.33) % 1); pose(d, { x: -14 + i * 14, y: 98 + k * 30, o: (1 - k) * lift }); });
      const nk = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.95, 2.05));
      const [px, py] = headAt(...A.at(B, CREW_A.peter, -8), 0.96, false);
      pose(night, { x: px - 30, y: py - 30, s: nk, o: nk > 0.01 ? 1 : 0 });

      /* v5b — "at your word": the net goes over the side and sinks */
      const wk = es(t, 2.05, 2.2, ease.back) * (1 - es(t, 2.5, 2.6));
      pose(word, { x: px + 20, y: py - 26, s: wk, o: wk > 0.01 ? 1 : 0 });
      const spread = es(t, 2.3, 2.85, ease.out);
      const sink = es(t, 2.45, 2.95);
      pose(net, { x: NET_X, y: DP.WL + 2, sx: 0.06 + spread * 0.94, sy: 0.05 + sink * 0.95, o: spread > 0.01 ? 1 : 0 });
      floatsIn.forEach((f, i) => { const k = seg(t, 2.35 + i * 0.12, 2.75 + i * 0.12); pose(f, { x: NET_X - 50 - i * 95, y: DP.WL + 4, s: 0.6 + k * 1.4, o: k > 0 && k < 1 ? 1 - k : 0 }); });

      /* Jesus' word: out to the deep */
      const [jhx, jhy] = headAt(...A.at(B, CREW_A.jesus, -34), 1.0, true, 62);
      const ck = es(t, 0.12, 0.3, ease.back) * (1 - es(t, 0.9, 1.0));
      pose(cmd, { x: jhx - 24, y: jhy - 22, s: ck, o: ck > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 40], [1.0, 0], [2.1, -40], [3, -200]]);
      S.cam.y = kf(t, [[0, 120], [1.0, 120], [2.1, 110], [3, 160]]);
      S.cam.z = kf(t, [[0, 1.16], [1.0, 1.22], [2.0, 1.24], [3, 1.18]]);
    };
  },
};
