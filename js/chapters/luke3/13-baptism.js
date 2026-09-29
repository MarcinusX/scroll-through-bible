// Łk 3,21–22 — all the people are being baptised: all along the Jordan they go down into the water and come up
// again. Jesus is among them; he goes under and rises. Then he stands in the river and prays, his hands lifted,
// his eyes closed — and the heaven opens: the heavy banks of cloud roll apart and gold light pours through. The
// Holy Spirit comes down on him in bodily form, like a dove, and settles over him. A voice from heaven: rings of
// light roll down, and the words come on a ribbon of light — "You are my beloved Son; with you I am well pleased."
import { C, person, CAST, blinkAt, sky, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import {
  headAt, riverSet, dove, flapWings, drops, folk, group, lightBanner, lightDisc, beam, rays, HEAVEN, tr,
  es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const JX = 800, WADE = 702, BANK = 776;

export default {
  id: 'lk3-baptism',
  beats: [
    { v: 21, text: 'Kiedy cały lud przystępował do chrztu, Jezus także przyjął chrzest.' },
    { v: 21, cont: true, text: 'A gdy się modlił, otworzyło się niebo' },
    { v: 22, text: 'i Duch Święty zstąpił na Niego, w postaci cielesnej niby gołębica,' },
    { v: 22, cont: true, text: 'a z nieba odezwał się głos:' },
    { v: 22, cont: true, text: '«Tyś jest mój Syn umiłowany, w Tobie mam upodobanie».' },
  ],
  cam: { x: [-30, 30], y: [-70, 60], z: [0.96, 1.16] },
  build(S) {
    const c = S.c;

    /* behind the clouds: gold and rays */
    sky(S, HEAVEN, { name: 'gold' });
    const burstL = S.layer({ par: 0, sh: 1, flat: true, rise: 0 });
    burstL.add(`<g transform="translate(800 60)">${rays(c, { n: 26, r0: 30, r1: 1300, spread: 0.035, color: '#fff6dc' })}</g><circle cx="800" cy="60" r="460" fill="url(#halo-glow)"/>`);
    /* the day sky, and the banks of cloud that roll apart */
    const gid = S.id('daysky');
    const y0 = Math.min(-200, S.view().y0);
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="${y0.toFixed(0)}" x2="0" y2="700"><stop offset="0" stop-color="#b9cdd2"/><stop offset=".55" stop-color="#dfe6dc"/><stop offset="1" stop-color="#f2ead4"/></linearGradient>`);
    const day = S.layer({ par: 0, sh: 1, flat: true, rise: 0 });
    day.add(`<rect x="-3000" y="-3000" width="8000" height="3760" fill="url(#${gid})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="3760"/>`);
    const bank = (dir) => {
      const L = S.layer({ par: 0, sh: 6, pad: 700, rise: 0 });
      let m = '';
      for (let i = 0; i < 9; i++) {
        const x = 800 + dir * (40 + i * 150) + c.rr(-30, 30), y = c.rr(-260, 330) * (i < 5 ? 1 : 0.7);
        m += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${cloud(c, c.rr(300, 460), mix(C.cream, C.stone, c.rr(0.1, 0.4)), '#dccfb8')}</g>`;
      }
      m += `<g transform="translate(${800 + dir * 60} 250)">${cloud(c, 380, mix(C.cream, C.stone, 0.2), '#dccfb8')}</g><g transform="translate(${800 + dir * 120} 60)">${cloud(c, 420, mix(C.cream, C.stone, 0.3), '#dccfb8')}</g><g transform="translate(${800 + dir * 20} -120)">${cloud(c, 440, mix(C.cream, C.stone, 0.25), '#dccfb8')}</g>`;
      L.add(`<g>${m}</g>`);
      return L;
    };
    const cloudL = bank(-1), cloudR = bank(1);

    /* the Jordan */
    const J = riverSet(S, { sunAt: [1300, 130] });
    const { far, fbFn } = J;
    [[300, 3], [480, 3], [1100, 3], [1300, 3]].forEach(([x, n]) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 30 + c.rr(-5, 5), y: c.rr(-4, 4), s: 1, flip: x > JX, o: folk(c) }));
      far.sprite(`<g transform="scale(.42)">${group(c, mem)}</g>`, x, fbFn(x) + 8);
    });

    /* light behind him */
    const lightL = S.layer({ par: 0.45, sh: 1, flat: true });
    const beamEl = lightL.add(`<g>${beam(c, 900, 70, 260)}</g>`);
    const glow = lightL.add(`<g>${lightDisc(c, 170)}</g>`);

    /* in the river: the people being baptised, and Jesus */
    const R = J.riverLayer();
    const BAP = [[470, 0.0], [590, 0.18], [1010, 0.1], [1130, 0.28]].map(([x, d], i) => ({ x, d, i, p: S.puppet(R.add(person(c, folk(c)))) }));
    const jesus = S.puppet(R.add(person(c, { ...CAST.jesus })));
    const jesusP = S.puppet(R.add(person(c, { ...CAST.jesus, eyes: 'closed' })));
    const dripEl = R.add(`<g>${drops(c, 7, C.lake)}</g>`);
    J.waterFront(R);
    const splashes = [...BAP.map((b) => b.x), JX].map((x) => ({ x, el: R.add(`<g opacity="0">${[-1, 1].map((sd) => `<path d="${c.ribbon(c.arc(0, 0, 36, 8, 0, PI * 2, 20), 2.6)}" fill="${C.foam}"/>`).join('')}</g>`) }));

    /* the near bank */
    const { N } = J.nearBank();
    const LIS = [[360, false, 0.86], [470, false, 0.82], [1130, true, 0.84], [1240, true, 0.86]].map(([x, flip, s], i) => ({ x, flip, s, i, p: S.puppet(N.add(person(c, folk(c)))), seed: c.rr(0, 9) }));
    J.foreground();

    /* the dove, the voice, the words */
    const V = S.layer({ par: 0.45, sh: 5 });
    const doveGlow = lightL.add(`<g>${lightDisc(c, 90)}</g>`);
    const doveEl = V.add(dove(c));
    const rings = [0, 1, 2, 3].map(() => V.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 90, 36, PI * 0.08, PI * 0.92, 18), 8)}" fill="#fffaf0"/></g>`));
    const words = V.add(`<g>${lightBanner(c, tr('«Tyś jest mój Syn umiłowany»', '“You are my beloved Son”'), { size: 30 })}</g>`);
    const words2 = V.add(`<g>${lightBanner(c, tr('«w Tobie mam upodobanie»', '“In you I am well pleased”'), { size: 24 })}</g>`);

    return (t, time) => {
      J.update(t, time);

      /* v21a — all the people are baptised; Jesus goes under and rises */
      BAP.forEach((b) => {
        const a = 0.08 + b.d;
        const under = es(t, a, a + 0.14) * (1 - es(t, a + 0.22, a + 0.36));
        const awe = es(t, 1.1, 1.4);
        b.p.set({ x: b.x, y: WADE + under * 140, s: 0.94, flip: b.x > JX, armF: 30 + bump(t, a + 0.3, a + 0.6) * 60 + awe * 40, armB: 10 + awe * 110, head: 10 - awe * 20, blink: blinkAt(time, b.i + 2) });
      });
      const under = es(t, 0.4, 0.55) * (1 - es(t, 0.62, 0.78));
      const pray = es(t, 1.04, 1.1);
      const jy = WADE + under * 142;
      const look = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: jy, s: 1.05, o: 1 - pray, armF: 14 + bump(t, 0.7, 1.0) * 20, armB: 10, head: 0, blink: blinkAt(time, 3) });
      jesusP.set({ x: JX, y: WADE, s: 1.05, o: pray, armF: 96 + look * 10, armB: 124 + look * 10, head: -14 - look * 6 });
      const [hx, hy] = headAt(JX, WADE, 1.05);
      splashes.forEach((s, i) => {
        const a = i < 4 ? 0.08 + BAP[i].d : 0.4;
        pose(s.el, { x: s.x, y: 654, s: 0.6 + seg(t, a, a + 0.4) * 1.2, o: bump(t, a, a + 0.4) * 0.85 + bump(t, a + 0.22, a + 0.5) * 0.6 });
      });
      pose(dripEl, { x: JX + 10, y: hy + 30 + ((time * 1.3) % 1) * 90, o: bump(t, 0.7, 1.4) * 0.9 });

      /* v21b — while he prays, the heaven opens */
      const open = es(t, 1.2, 1.75, ease.out);
      cloudL.shift(-open * 820, -open * 60);
      cloudR.shift(open * 820, -open * 60);
      day.fade(1 - es(t, 1.2, 1.6));
      burstL.fade(open);
      const dv = es(t, 2.05, 2.75);
      const voice = es(t, 3.05, 3.3);
      const w1 = es(t, 4.05, 4.3, ease.out), w2 = es(t, 4.3, 4.55, ease.out);
      pose(beamEl, { x: JX, y: WADE - 10, sy: Math.max(0.001, open), o: open * 0.5 + dv * 0.3 + voice * 0.2 });
      pose(glow, { x: hx, y: hy + 20, s: 0.7 + dv * 0.6 + voice * 0.4, o: Math.max(open * 0.5, dv, voice) * 0.9 });

      /* v22a — the Holy Spirit in bodily form, like a dove, comes down upon him */
      const dy = lerp(-40, hy - 80, ease.out(dv));
      const dx = JX + Math.sin(dv * PI * 2) * 60 * (1 - dv);
      pose(doveEl, { x: dx, y: dy + (time ? Math.sin(time * 2) * 4 * dv : 0), s: 1.35, o: seg(t, 2.0, 2.06) });
      pose(doveGlow, { x: dx, y: dy - 10, s: 1 + dv * 0.3, o: seg(t, 2.0, 2.1) * 0.9 });
      flapWings(doveEl, time, 30 + (1 - dv) * 10, 7 - dv * 3, -10);

      /* v22b — a voice from heaven: rings of light roll down; v22c — the words */
      rings.forEach((r, i) => {
        const k = time ? ((time * 0.35 + i / 4) % 1) : (i + 1) / 4.5;
        pose(r, { x: JX, y: 60 + k * 300, s: 0.8 + k * 2.6, sy: 0.8 + k * 1.8, o: voice * (1 - k) * 0.85 * (1 - w1 * 0.5) });
      });
      pose(words, { x: JX, y: 200, s: 0.6 + w1 * 0.4, o: w1 });
      pose(words2, { x: JX, y: 268, s: 0.6 + w2 * 0.4, o: w2 });

      LIS.forEach((l) => l.p.set({ x: l.x, y: BANK + (l.i % 2) * 6, s: l.s, flip: l.flip, armF: 20 + open * (l.i % 2 ? 90 : 40) + voice * 20, armB: open * (l.i % 2 ? 30 : 130), head: -open * 12, blink: blinkAt(time, l.seed) }));

      S.cam.y = 40 - es(t, 1.1, 1.6) * 80 + es(t, 2.2, 2.8) * 40 - es(t, 4.0, 4.4) * 20;
      S.cam.z = 1.1 - es(t, 1.1, 1.6) * 0.12 + es(t, 2.2, 2.8) * 0.06;
    };
  },
};
