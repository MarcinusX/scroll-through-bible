// Mt 4,23 — inside a synagogue of Galilee (the same room as in Mark 1). Jesus teaches at the reading desk.
// Above Him a map of Galilee comes down: a golden path goes round the whole country, and at every town a little
// synagogue pops up — "in their synagogues". "Proclaiming the good news of the kingdom": the map goes up, a gold
// banner of the Good News of the Kingdom comes down and golden rings of His voice fill the room. "Healing every
// disease": among the listeners on the front bench, a lame man rises and lifts his crutch, a blind woman's
// bandage falls and she sees, a child's fever leaves him and he jumps up — light bursts over each.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { synagogueInterior, voiceRings, headAt, hand, hang2, crutch, goldWord, rayBurst, sparkle, folk4, tr, PI } from './lib.js';
import { galileeMap, heatWave } from '../mark1/lib.js';
import { addToHead } from '../mark2/lib.js';
import { blindBand } from '../john5/lib.js';

const JX = 800, FEET = 742;
const MS = 0.66;               // the map's scale
const MX = 800, MY = 318;
const ROUTE = ['kaf', 'kor', 'bet', 'mag', 'tyb', 'nai', 'naz', 'kan', 'kaf'];

export default {
  id: 'mt4-synagogue',
  beats: [
    { v: 23, text: 'I obchodził Jezus całą Galileę, nauczając w tamtejszych synagogach,' },
    { v: 23, cont: true, text: 'głosząc Ewangelię o królestwie' },
    { v: 23, cont: true, text: 'i lecząc wszystkie choroby i wszelkie słabości wśród ludu.' },
  ],
  cam: { x: [-30, 30], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S);
    const L = S.layer({ par: I.P, sh: 4 });
    const [BACK, FRONT] = I.benchY;
    const back = I.congregation(L);

    /* ---------- the sick on the front bench ---------- */
    const pc = makeCutter('mt4-syn-sick');
    const LAME = folk4(pc, true, { robe: C.stone2, mantle: null, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair });
    const lameSit = S.puppet(L.add(person(c, { ...LAME, pose: 'sit', holdF: `<g transform="translate(0 -4) rotate(-10)">${crutch(c)}</g>` })));
    const lameUp = S.puppet(L.add(person(c, { ...LAME, holdB: `<g transform="translate(0 -4)">${crutch(c)}</g>` })));
    const BLIND = folk4(pc, false, { robe: mix(C.mauve, C.stone, 0.4), veil: C.stone });
    const blindSit = S.puppet(L.add(addToHead(person(c, { ...BLIND, pose: 'sit', eyes: 'closed' }), blindBand(c))));
    const seeSit = S.puppet(L.add(person(c, { ...BLIND, pose: 'sit' })));
    const band = L.add(`<g opacity="0">${blindBand(c)}</g>`);
    const MUM = folk4(pc, false, { robe: C.tealRobe, veil: C.linen2 });
    const mum = S.puppet(L.add(person(c, { ...MUM, pose: 'sit' })));
    const KID = { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2 };
    const kidSick = S.puppet(L.add(person(c, { ...KID, pose: 'sit', eyes: 'closed' })));
    const kidUp = S.puppet(L.add(person(c, KID)));
    const fever = [0, 1, 2].map((i) => L.add(`<g opacity="0">${heatWave(c, 46)}</g>`));
    const bursts = [0, 1, 2].map(() => L.add(`<g opacity="0"><circle r="90" fill="url(#halo-glow)"/>${rayBurst(c, { n: 12, r0: 20, r1: 110, spread: 0.08, o: 0.8 })}</g>`));
    const eyeSpark = L.add(`<g opacity="0">${sparkle(c, 12)}</g>`);

    /* ---------- the reading desk, Jesus ---------- */
    const desk = sheet().p(c.cut([[-40, 0], [-30, -90], [30, -90], [40, 0]], 0.5, 6), C.wood).p(c.cut([[-54, -86], [54, -100], [50, -88], [-50, -76]], 0.4, 6), C.wood2)
      .p(c.cut([[-44, -96], [44, -106], [42, -96], [-42, -86]], 0.3, 6), C.parchment).x(c.ribbon([[-34, -94], [30, -101]], 1.4), C.ink, 'opacity=".4"').out();
    L.add(`<g transform="translate(${JX + 100} ${FEET})">${desk}</g>`);
    const glow = L.add(`<circle r="190" fill="url(#halo-glow)" opacity="0"/>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(L, c, { n: 3, color: C.sun, r: 44, w: 6 });
    I.addColumns();

    /* ---------- from the flies: the map of Galilee, the good news ---------- */
    const fly = S.layer({ par: 0.25, sh: 7 });
    const GM = galileeMap(c, { w: 760, h: 540 });
    const mapEl = fly.add(hang2(`<g transform="scale(${MS})">${GM.markup}</g>`, 220, 900));
    const T = Object.fromEntries(GM.towns.map((t) => [t.k, t]));
    const route = ROUTE.map((k) => [T[k].x, T[k].y]);
    const routeD = 'M' + route.map(([x, y]) => `${x} ${y}`).join('L');
    const pathEl = fly.add(`<g opacity="0"><path d="${routeD}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none" stroke="${C.sun}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" transform="scale(${MS})"/></g>`);
    const pathStroke = pathEl.querySelector('path');
    const synIcon = () => sheet().p(c.cut([[-15, 0], [-15, -18], [0, -28], [15, -18], [15, 0]], 0.3, 4), C.cream).p(c.cut([[-5, 0], [-5, -10], ...c.arc(0, -10, 5, 5, PI, 2 * PI, 5), [5, 0]], 0.2, 3), C.wood2).p(c.cut(c.star(0, -36, 6, 2.6, 6, 0), 0.2, 3), C.sun).out();
    const icons = ROUTE.slice(0, -1).map((k, i) => ({ k, i, el: fly.add(`<g opacity="0"><circle cy="-14" r="30" fill="url(#warm-glow)"/>${synIcon()}</g>`) }));
    const news = hanging(fly, goldWord(c, tr('Ewangelia o królestwie', 'the Good News of the Kingdom'), { size: 30 }), { x: 0, y: 0, len: 900 });

    return (t, time) => {
      I.flicker(time);

      /* v23a: He teaches; the map of all Galilee, with a synagogue in every town */
      const teach = es(t, 0.05, 0.3);
      const proclaim = es(t, 1.05, 1.3) * (1 - es(t, 2.0, 2.2));
      const heal = es(t, 2.05, 2.25);
      jesus.set({ x: JX, y: FEET, s: 1.05, armF: 30 + teach * (40 + Math.sin(time * 1.3) * 10) + proclaim * 30 - heal * 20, armB: 10 + teach * 20 + proclaim * 110 + heal * 50, head: -teach * 3 - proclaim * 4, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, FEET, 1.05);
      voice(hx, hy, teach * (0.5 + proclaim * 0.5) * (1 - heal * 0.6), time, { spread: 2 + proclaim * 3, speed: 0.4 });
      pose(glow, { x: hx, y: hy + 40, s: 0.8 + proclaim * 0.7, o: teach * 0.2 + proclaim * 0.5 });

      const md = es(t, 0.05, 0.3, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      const my = lerp(-700, MY, md);
      pose(mapEl, { x: MX, y: my, r: Math.sin(time * 0.6) * 0.5 });
      const draw = seg(t, 0.3, 0.9);
      fade(pathEl, md > 0.01 ? 1 : 0);
      pose(pathEl, { x: MX, y: my });
      attr(pathStroke, 'stroke-dashoffset', 1 - draw);
      icons.forEach((ic) => {
        const k = es(t, 0.3 + (ic.i / (ROUTE.length - 1)) * 0.6, 0.38 + (ic.i / (ROUTE.length - 1)) * 0.6, ease.back);
        const tw = T[ic.k];
        pose(ic.el, { x: MX + tw.x * MS, y: my + tw.y * MS - 4, s: k * 0.9, o: k > 0.01 && md > 0.01 ? 1 : 0 });
      });

      /* v23b: the good news of the kingdom */
      const nk = es(t, 1.08, 1.4, ease.out) * (1 - es(t, 2.0, 2.25, ease.in));
      pose(news, { x: 800, y: lerp(-420, 230, nk), r: Math.sin(time * 0.8) * 1.2, o: nk > 0.01 ? 1 : 0 });

      /* the congregation */
      const amaze = es(t, 1.2, 1.5);
      const joy = es(t, 2.6, 2.9);
      back.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 30 + amaze * 10, armB: joy * (m.i % 2 ? 120 : 40), head: -amaze * 6, blink: blinkAt(time, m.seed) }));

      /* v23c: healing */
      const H = [2.12, 2.3, 2.48];
      // the lame man
      const up = es(t, H[0], H[0] + 0.07);
      lameSit.set({ x: 400, y: FRONT, s: 0.9, o: 1 - up, armF: 40, armB: 10, head: 6, blink: blinkAt(time, 2) });
      const lift = es(t, H[0] + 0.1, H[0] + 0.35);
      lameUp.set({ x: 400, y: FRONT + 40, s: 0.92, o: up, armF: 30 + lift * 50, armB: 20 + lift * 140, head: -lift * 10, blink: blinkAt(time, 2) });
      // the blind woman
      const see = es(t, H[1], H[1] + 0.07);
      blindSit.set({ x: 540, y: FRONT, s: 0.88, o: 1 - see, armF: 30, head: 4 });
      seeSit.set({ x: 540, y: FRONT, s: 0.88, o: see, armF: 30 + es(t, H[1] + 0.1, H[1] + 0.3) * 60, armB: es(t, H[1] + 0.1, H[1] + 0.3) * 100, head: -10 * see, blink: blinkAt(time, 3) });
      const [bx, by] = headAt(540, FRONT, 0.88, false, 62);
      const bf = seg(t, H[1], H[1] + 0.5);
      pose(band, { x: bx - 4 - bf * 20, y: by + bf * 90, r: bf * 120, s: 0.88, o: bf > 0 && bf < 1 ? 1 : 0 });
      const es_ = bump(t, H[1] + 0.05, H[1] + 0.6);
      pose(eyeSpark, { x: bx + 10, y: by - 16, s: es_ * 1.3, r: time * 60, o: es_ });
      // the mother and her feverish child
      mum.set({ x: 1080, y: FRONT, s: 0.9, flip: true, armF: 40 + es(t, H[2], H[2] + 0.3) * 60, armB: 20 + es(t, H[2] + 0.1, H[2] + 0.35) * 110, head: 8 - es(t, H[2], H[2] + 0.3) * 16, blink: blinkAt(time, 4) });
      const well = es(t, H[2], H[2] + 0.07);
      kidSick.set({ x: 1170, y: FRONT + 4, s: 0.62, flip: true, o: 1 - well, head: 16, lean: 8 });
      const hop = bump(t, H[2] + 0.1, H[2] + 0.35) + bump(t, H[2] + 0.35, H[2] + 0.6);
      kidUp.set({ x: 1170, y: FRONT + 50 - hop * 18, s: 0.64, flip: true, o: well, armF: 60 + hop * 60, armB: 60 + hop * 80, head: -8, blink: blinkAt(time, 5) });
      const [kx, ky] = headAt(1170, FRONT + 4, 0.62, true, 62);
      fever.forEach((f, i) => { const k = time ? (time * 0.5 + i / 3) % 1 : (i + 1) / 3.5; pose(f, { x: kx - 12 + i * 12, y: ky - 16 - k * 30, s: 0.6 + k * 0.4, o: (1 - well) * (1 - k) * 0.8 }); });
      [[400, FRONT - 130], [540, FRONT - 120], [1150, FRONT - 100]].forEach(([x, y], i) => { const k = bump(t, H[i] - 0.02, H[i] + 0.45); pose(bursts[i], { x, y, s: 0.5 + k * 0.8, r: time * 20, o: k * 0.9 }); });

      S.cam.z = 1.02 + es(t, 1.9, 2.3) * 0.04;
      S.cam.y = 20 + es(t, 1.9, 2.3) * 20;
    };
  },
};
