// J 3,8 — "The wind blows where it wants": a night gust crosses the roof — paper streamers on a cord
// stream out, the awning's chimes knock together, leaves and curling wind-strokes loop across the stage,
// the lamp flame bends; Nicodemus holds on to his cap. "You hear its sound": he cups his ear and the
// rustle rings. "You don't know where it comes from or where it goes": leaves come from beyond one edge
// and vanish beyond the other. "So is everyone born of the Spirit": the wind lifts little lights like
// dandelion seeds from Jesus' open hand and carries them away over Jerusalem.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  roofSet, ROOF, ROOFCAM, flicker, nicodemus, headAt, hand, voiceRings, streamer, blowStreamer, leaf, windStroke,
  lightSeed, word, question, tr, PI,
  vpose,
} from './lib.js';

const F = ROOF.FLOOR, JX = ROOF.JX, NX = ROOF.NX;
// the cord strung from the awning to a pole on the right
const CORD = [[527, F - 300], [1260, F - 336]];
const cordY = (x) => { const u = (x - CORD[0][0]) / (CORD[1][0] - CORD[0][0]); return lerp(CORD[0][1], CORD[1][1], u) + Math.sin(u * PI) * 46; };

export default {
  id: 'j3-wind',
  beats: [
    { v: 8, text: 'Wiatr wieje tam, gdzie chce,' },
    { v: 8, cont: true, text: 'i szum jego słyszysz,' },
    { v: 8, cont: true, text: 'lecz nie wiesz, skąd przychodzi i dokąd podąża.' },
    { v: 8, cont: true, text: 'Tak jest z każdym, który narodził się z Ducha».' },
  ],
  cam: { x: [-60, 60], y: [60, 180], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    const R = roofSet(S);

    /* ---------- the cord with streamers, a pole, chimes on the awning ---------- */
    const K = S.layer({ par: 0.5, sh: 3 });
    K.add(sheet().p(c.cut(c.rect(1256, F - 340, 9, 340), 0.3, 8), mix(C.wood2, C.indigo, 0.25)).out());
    const cordPts = [];
    for (let x = CORD[0][0]; x <= CORD[1][0]; x += 20) cordPts.push([x, cordY(x)]);
    K.add(`<path d="${c.ribbon(cordPts, 2)}" fill="${mix(C.rope, C.indigo, 0.2)}"/>`);
    const COLS = [C.terracotta, C.sun, C.dustyBlue, C.roseRobe, C.sageRobe, C.lavender, C.apricot, C.tealRobe, C.cream];
    const streams = [];
    for (let i = 0; i < 8; i++) {
      const x = lerp(580, 1215, i / 7);
      streams.push({ el: K.add(`<g>${streamer(c, mix(COLS[i % COLS.length], C.indigo, 0.18), c.rr(70, 100))}</g>`), x, y: cordY(x) + 2, i });
    }
    const chimes = [0, 1, 2, 3].map((i) => {
      const len = 40 + (i % 2) * 18;
      const el = K.add(`<g><path d="M0 0V${len}" stroke="rgba(230,220,200,.5)" stroke-width="1.2"/><g transform="translate(0 ${len})">${sheet().p(c.cut(c.ell(0, 8, 7, 10, 12), 0.3, 3), mix(C.pot, C.indigo, 0.2)).out()}</g></g>`);
      return { el, x: 350 + i * 40, i };
    });
    const chimeRings = voiceRings(K, c, { n: 2, color: C.halo, r: 16, w: 3 });

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const nico = S.puppet(P.add(nicodemus(c, { pose: 'sit' })));
    const earRings = voiceRings(P, c, { n: 3, color: '#e9e4f3', r: 20, w: 3.5, both: false });

    /* ---------- the wind itself ---------- */
    // a sheet of leaves and wind-strokes that slides across on the compositor (no repainting)…
    const PER = 600;
    const Wl = S.layer({ par: 0.55, sh: 3, pad: PER / 2 + 20 });
    const LEAFC = [C.leaf, C.olive, C.sage, C.wheatGreen, C.moss, C.ochre];
    const pat = [];
    for (let i = 0; i < 9; i++) pat.push({ kind: 'leaf', x: c.rr(0, PER), y: c.rr(220, 560), r: c.rr(0, 360), col: mix(LEAFC[i % LEAFC.length], C.indigo, 0.15), sz: c.rr(8, 13) });
    for (let i = 0; i < 3; i++) pat.push({ kind: 'stroke', x: c.rr(0, PER), y: 250 + i * 110 + c.rr(-20, 20), len: c.rr(150, 230) });
    let sheetW = '';
    for (let k = -3; k <= 4; k++) pat.forEach((p) => {
      const inner = p.kind === 'leaf' ? leaf(c, p.col, p.sz) : windStroke(c, p.len);
      sheetW += `<g transform="translate(${(p.x + k * PER).toFixed(0)} ${p.y.toFixed(0)}) rotate(${p.kind === 'leaf' ? p.r.toFixed(0) : 0})">${inner}</g>`;
    });
    Wl.add(sheetW);
    const X = S.layer({ par: 0.5, sh: 5 });
    const whence = X.add(`<g>${word(c, tr('← skąd?', '← where from?'), { size: 18 })}</g>`);
    const whither = X.add(`<g>${word(c, tr('dokąd? →', 'where to? →'), { size: 18 })}</g>`);
    const qL = X.add(`<g>${question(c)}</g>`), qR = X.add(`<g>${question(c)}</g>`);
    const hush = [0, 1, 2, 3].map((i) => ({ el: X.add(`<g>${word(c, tr('szszsz…', 'whoosh…'), { size: 17 - (i % 2) * 2, fill: '#ece8f4' })}</g>`), i }));
    const seeds = Array.from({ length: 9 }, (_, i) => ({ el: X.add(`<g>${lightSeed(c)}</g>`), i, dx: c.rr(-260, 420), dy: c.rr(200, 380), ph: c.rr(0, 6) }));

    return (t, time) => {
      const T = time;
      // wind strength: rises with the first words, keeps blowing, eases while the seeds fly
      const W = es(t, 0.02, 0.35) * (1 - es(t, 3.85, 4.2) * 0.6);
      const gust = W * (0.75 + 0.25 * Math.sin(T * 1.7) * Math.sin(T * 0.6 + 1));
      vpose(R.moon, { x: 1210, y: 150, r: Math.sin(T * 0.5) * (1 + gust) });
      flicker(R.lamp, T, 1, gust * 0.55);

      streams.forEach((s) => {
        vpose(s.el, { x: s.x, y: s.y });
        blowStreamer(s.el, -gust * (0.8 + 0.2 * Math.sin(T * 2.3 + s.i)), T, s.i);
      });
      const clink = bump(t, 1.05, 1.9);
      chimes.forEach((ch) => vpose(ch.el, { x: ch.x, y: F - 300, r: -gust * 22 + Math.sin(T * (4 + ch.i) + ch.i) * 8 * gust }));
      chimeRings(420, F - 240, clink, T, { spread: 1.8 });

      /* people: Jesus calm; Nicodemus holds his cap, then listens, then looks this way and that */
      const hear = es(t, 1.02, 1.2) * (1 - es(t, 1.85, 2.0));
      const lookL = es(t, 2.1, 2.2) * (1 - es(t, 2.4, 2.5)), lookR = es(t, 2.45, 2.55) * (1 - es(t, 2.85, 2.95));
      nico.set({ x: NX, y: F + 2, s: 1.02, flip: lookL > 0.5, armF: 30 + bump(t, 2.2, 2.9) * 40, armB: 10 + es(t, 0.15, 0.35) * 150 * (1 - hear) * (1 - es(t, 2.0, 2.15)) + hear * 165, head: -hear * 14 + lookR * -6 + bump(t, 3.2, 3.9) * -10, lean: -gust * 3, blink: blinkAt(T, 1) });
      const [nx, ny] = headAt(NX, F + 2, 1.02, false, 62);
      earRings(nx - 16, ny + 2, hear, T, { spread: 2.2, dir: -1, off: 2 });
      const open = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: F + 2, s: 1.05, flip: true, armF: 24 + bump(t, 0.1, 0.9) * 50 + open * 60, armB: 10 + open * 30, head: -3 - open * 6, blink: blinkAt(T, 4) });
      const [jhx, jhy] = hand(JX, F + 2, 1.05, true, 24 + open * 60, 0, 62);

      /* leaves and wind strokes loop across the stage, from beyond one edge to beyond the other */
      const flowT = t * 0.55 + T * 0.09;
      Wl.shift(((flowT * 900 * 1.1) % PER) - PER / 2, Math.sin(T * 1.1) * 10 * W);
      Wl.fade(W);

      /* its sound: the rustle drifts past as words */
      hush.forEach((h) => {
        const k = seg(t, 1.05 + h.i * 0.12, 1.95 + h.i * 0.08);
        const x = lerp(380 + h.i * 90, 980 + h.i * 60, ease.sine(k)), y = 300 + h.i * 55 + Math.sin(k * PI * 2 + h.i) * 16;
        vpose(h.el, { x, y, r: Math.sin(k * PI * 3 + h.i) * 8, o: Math.sin(k * PI) });
      });

      /* where from? where to? */
      const wk = es(t, 2.08, 2.3, ease.back), wk2 = es(t, 2.45, 2.65, ease.back), gone = es(t, 3.0, 3.2);
      vpose(whence, { x: 520, y: 330 + Math.sin(T * 1.3) * 5, s: wk, r: -5, o: seg(t, 2.08, 2.12) * (1 - gone) });
      vpose(qL, { x: 470, y: 270, s: wk * 0.9, r: Math.sin(T * 2) * 8, o: seg(t, 2.08, 2.12) * (1 - gone) });
      vpose(whither, { x: 1080, y: 330 + Math.sin(T * 1.3 + 1) * 5, s: wk2, r: 5, o: seg(t, 2.45, 2.5) * (1 - gone) });
      vpose(qR, { x: 1130, y: 270, s: wk2 * 0.9, r: Math.sin(T * 2 + 1) * 8, o: seg(t, 2.45, 2.5) * (1 - gone) });

      /* everyone born of the Spirit: little lights on the wind */
      seeds.forEach((sd) => {
        const k = seg(t, 3.1 + sd.i * 0.05, 3.95 + sd.i * 0.03);
        const e = ease.out(k);
        const x = jhx + e * sd.dx + Math.sin(T * 1.4 + sd.ph) * 10 * e, y = jhy - 10 - e * sd.dy + Math.sin(e * PI * 2 + sd.ph) * 26;
        const so = seg(t, 3.08 + sd.i * 0.05, 3.15 + sd.i * 0.05);
        if (so <= 0) { vpose(sd.el, { x: jhx, y: jhy, o: 0 }); return; }
        vpose(sd.el, { x, y, r: Math.sin(T * 2 + sd.ph) * 14, s: 0.7 + e * 0.35, o: so });
      });

      S.cam.x = 0;
      S.cam.y = ROOFCAM.y - es(t, 0, 0.6) * 60 + es(t, 3.0, 3.6) * 0 ;
      S.cam.z = ROOFCAM.z - es(t, 0, 0.6) * 0.2;
    };
  },
};
