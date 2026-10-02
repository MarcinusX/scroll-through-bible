// Mt 4,24 — by the lake at Capernaum. A map comes down: rings of news spread out from Capernaum and little
// slips of word fly off to Tyre and Sidon, Damascus and Antioch — "all Syria". Then the map goes up and the sick
// are brought from both sides: a lame man on his crutch with his wife, a blind man led by a boy, and more coming
// along the shore. "The possessed, epileptics and paralytics": a man in a torn dark shadow, a boy fallen and
// shaking with his father on his knees beside him, a paralysed man carried in on a mat. "And he healed them":
// light bursts over each — the shadow tears away, the boy jumps up, the man on the mat stands holding it
// over his head, the crutch goes up, the blind man sees.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock, reeds, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { lakeShore, syriaMap, SYR, hang2, POSSESSED, shadowShards, crutch, rolledMat, goldSlip, rayBurst, sparkle, voiceRings, headAt, pose3, folk4, tr, PI } from './lib.js';
import { sickOnMat } from '../mark6/lib.js';
import { blindBand } from '../john5/lib.js';

const JX = 800, JY = 724;
const MX = 800, MY = 290, MS = 0.82;

export default {
  id: 'mt4-sick',
  beats: [
    { v: 24, text: 'A wieść o Nim rozeszła się po całej Syrii.' },
    { v: 24, cont: true, text: 'Przynoszono więc do Niego wszystkich cierpiących, których dręczyły rozmaite choroby i dolegliwości,' },
    { v: 24, cont: true, text: 'opętanych, epileptyków i paralityków,' },
    { v: 24, cont: true, text: 'a On ich uzdrawiał.' },
  ],
  cam: { x: [-30, 30], y: [0, 60], z: [1, 1.1] },
  build(S) {
    // phone: everybody closes in towards Jesus so that the sick on both sides stay inside the screen
    const PH = S.portrait;
    const X = PH
      ? { g1: [525, 760], g2: [1088, 758], g3: [650, 812], backs: [390, 925], poss: 1045, boy: 925, boyUp: 890, dadK: 980, dadS: 965 }
      : { g1: [400, 770], g2: [1215, 770], g3: [590, 808], backs: [330, 1020], poss: 1060, boy: 950, boyUp: 905, dadK: 1010, dadS: 985 };
    const L = lakeShore(S, { beachY: 690 });
    const c = L.c;
    const pc = makeCutter('mt4-sick-people');

    /* ---------- the ones who come along the shore (small, behind) ---------- */
    const backL = S.layer({ par: 0.45, sh: 4 });
    const line = (n, flip) => pose3(pc, Array.from({ length: n }, (_, i) => ({ x: i * 58 + pc.rr(-8, 8), y: pc.rr(-4, 4), s: 0.72, flip, head: pc.rr(-4, 6), o: folk4(pc, null) })));
    const backs = [{ x0: -500, x1: X.backs[0], flip: false, m: line(5, false) }, { x0: 1900, x1: X.backs[1], flip: true, m: line(5, true) }].map((b) => ({ ...b, sp: backL.sprite(b.m, b.x1, 700) }));

    /* ---------- the sick, as still groups (sick → healed) ---------- */
    const GL = S.layer({ par: 0.5, sh: 4 });
    const LAME = folk4(pc, true, { robe: C.stone2, mantle: null, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair });
    const WIFE = folk4(pc, false, { robe: C.roseRobe, veil: C.linen2 });
    const g1 = (healed) => pose3(pc, [
      { x: 0, y: 0, s: 0.94, flip: false, lean: 0, head: healed ? -10 : 8, armF: healed ? 60 : 40, armB: healed ? 150 : 10, o: healed ? { ...LAME, holdB: `<g transform="translate(0 -4)">${crutch(c)}</g>` } : { ...LAME, holdF: `<g transform="translate(0 -4) rotate(-6)">${crutch(c)}</g>` } },
      { x: -70, y: -6, s: 0.9, flip: false, head: healed ? -8 : 4, armF: healed ? 80 : 70, armB: healed ? 120 : 20, o: WIFE },
    ]);
    const BLIND = folk4(pc, true, { robe: C.mauve, hairStyle: 'wrap', veil: C.stone, beard: 'short' });
    const BOY = { robe: C.skyVeil, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin2 };
    const g2 = (healed) => pose3(pc, [
      { x: 0, y: 0, s: 0.94, flip: true, head: healed ? -12 : 6, armF: healed ? 50 : 60, armB: healed ? 140 : 0, o: healed ? BLIND : { ...BLIND, eyes: 'closed' } },
      { x: -64, y: 8, s: 0.6, flip: true, head: -6, armF: healed ? 120 : 70, armB: healed ? 150 : 20, o: BOY },
    ]).replace(healed ? '@@' : '</g></g><g class="armF"', healed ? '@@' : `${blindBand(c)}</g></g><g class="armF"`);
    const CAR = [folk4(pc, true, { robe: C.ochreRobe }), folk4(pc, true, { robe: C.sageRobe })];
    const PARA = { robe: C.linen2, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin3 };
    const g3 = (healed) => (healed
      ? pose3(pc, [{ x: -110, y: 0, s: 0.9, flip: false, head: -6, armF: 60, armB: 100, o: CAR[0] }, { x: 110, y: 4, s: 0.9, flip: true, head: -6, armF: 60, armB: 110, o: CAR[1] }, { x: 0, y: 10, s: 0.94, flip: false, head: -12, armF: 150, armB: 160, o: { ...PARA, holdB: `<g transform="translate(0 -10) rotate(80)">${rolledMat(c, 110)}</g>` } }])
      : pose3(pc, [{ x: -110, y: 0, s: 0.9, flip: false, armF: 70, armB: 50, o: CAR[0] }, { x: 110, y: 4, s: 0.9, flip: true, armF: 70, armB: 50, o: CAR[1] }]) + `<g transform="translate(0 -84)">${sickOnMat(c, PARA, 200)}</g>`);
    const groups = [
      { k: 'g1', x: X.g1[0], y: X.g1[1], from: -300, a: 1.05, sick: GL.sprite(g1(false), ...X.g1), well: GL.sprite(g1(true), ...X.g1), h: 3.2 },
      { k: 'g2', x: X.g2[0], y: X.g2[1], from: 1900, a: 1.15, sick: GL.sprite(g2(false), ...X.g2), well: GL.sprite(g2(true), ...X.g2), h: 3.4 },
      { k: 'g3', x: X.g3[0], y: X.g3[1], from: -300, a: 2.05, sick: GL.sprite(g3(false), ...X.g3), well: GL.sprite(g3(true), ...X.g3), h: 3.1 },
    ];

    /* ---------- the possessed man, the boy who falls ---------- */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const shards = shadowShards(c, { n: 9, r: 70, color: '#2a2238' }).map((sh) => ({ ...sh, el: PL.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.7, 1.3) }));
    const poss = S.puppet(PL.add(person(c, { ...POSSESSED })));
    const DAD = folk4(pc, true, { robe: C.tealRobe, hairStyle: 'short', beard: 'full' });
    const dadK = S.puppet(PL.add(person(c, { ...DAD, pose: 'kneel' })));
    const dadS = S.puppet(PL.add(person(c, DAD)));
    const SON = { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin };
    const boyDown = S.puppet(PL.add(person(c, { ...SON, eyes: 'closed' })));
    const boyUp = S.puppet(PL.add(person(c, SON)));
    const jesus = S.puppet(PL.add(person(c, { ...CAST.jesus })));
    const bursts = [0, 1, 2, 3, 4].map(() => PL.add(`<g opacity="0"><circle r="90" fill="url(#halo-glow)"/>${rayBurst(c, { n: 12, r0: 20, r1: 110, spread: 0.08, o: 0.8 })}</g>`));

    /* ---------- the news goes out: a map of Syria ---------- */
    const fly = S.layer({ par: 0.2, sh: 7 });
    const mapEl = fly.add(hang2(`<g transform="scale(${MS})">${syriaMap(c).base}</g>`, 200, 900));
    const rings = [0, 1, 2].map(() => fly.add(`<g opacity="0"><circle r="60" fill="none" stroke="${C.sunDeep}" stroke-width="3"/></g>`));
    const slips = SYR.towns.map((tw, i) => ({ tw, i, el: fly.add(`<g opacity="0">${goldSlip(c, 34)}</g>`) }));
    const lights = SYR.towns.map((tw) => fly.add(`<g opacity="0">${sparkle(c, 10)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 7 });
    fg.add(reeds(c, -220, 980, 14, 230, C.moss) + rock(c, 1560, 990, 280, 100, C.rock2));

    return (t, time) => {
      L.update(time);

      /* v24a: the news spreads through all Syria */
      const md = es(t, 0.02, 0.28, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      const my = lerp(-700, MY, md);
      pose(mapEl, { x: MX, y: my, r: Math.sin(time * 0.6) * 0.5 });
      const kx = MX + SYR.kaf[0] * MS, ky = my + SYR.kaf[1] * MS;
      rings.forEach((r, i) => {
        const k = seg(t, 0.3 + i * 0.12, 0.95 + i * 0.05);
        pose(r, { x: kx, y: ky, s: 0.2 + k * 4, o: md > 0.01 && k > 0 ? (1 - k) * 0.9 : 0 });
      });
      slips.forEach((s) => {
        const k = es(t, 0.35 + s.i * 0.05, 0.75 + s.i * 0.04);
        const tx = MX + s.tw.x * MS, ty = my + s.tw.y * MS;
        pose(s.el, { x: lerp(kx, tx, k), y: lerp(ky, ty, k) - Math.sin(k * PI) * 30, r: Math.sin(time * 2 + s.i) * 10, s: 0.8, o: md > 0.01 && k > 0 && k < 1 ? 1 : 0 });
        const l = bump(t, 0.7 + s.i * 0.05, 1.05 + s.i * 0.03);
        pose(lights[s.i], { x: tx, y: ty - 6, s: l * 1.2, r: time * 40, o: md > 0.01 ? l : 0 });
      });

      /* Jesus in the middle, healing */
      const heal = es(t, 3.02, 3.25);
      jesus.set({ x: JX, y: JY, s: 1.05, armF: 20 + es(t, 1.2, 1.5) * 30 + heal * 50, armB: 10 + heal * 110, head: -heal * 4, blink: blinkAt(time) });

      /* v24b: the sick are brought */
      backs.forEach((b, i) => {
        const k = es(t, 1.1 + i * 0.08, 1.9 + i * 0.08, ease.out);
        const x = lerp(b.x0, b.x1, k);
        b.sp.set({ x, y: 700 - (k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.03)) * 3 : 0), o: k > 0 ? 1 : 0 });
      });
      groups.forEach((g) => {
        const k = es(t, g.a, g.a + 0.7, ease.out);
        const x = lerp(g.from, g.x, k);
        const bob = k > 0 && k < 1 ? Math.abs(Math.sin(x * 0.035)) * 4 : 0;
        const w = es(t, g.h, g.h + 0.06);
        g.sick.set({ x, y: g.y - bob, o: (k > 0 ? 1 : 0) * (1 - w) });
        g.well.set({ x, y: g.y, o: w });
      });

      /* v24c: the possessed, the epileptic */
      const pk = es(t, 2.1, 2.7, ease.out);
      const px = lerp(1900, X.poss, pk);
      const free = es(t, 3.3, 3.37);
      const trem = (1 - free) * (time ? Math.sin(time * 14) * 2 : 0);
      poss.set({ x: px + trem, y: 780, s: 0.95, flip: true, o: pk > 0 ? 1 : 0, walk: pk > 0 && pk < 1 ? px * 0.05 : undefined, armF: 30 + free * 50, armB: 20 + free * 130, head: 12 - free * 22, blink: blinkAt(time, 8) });
      const tear = es(t, 3.3, 3.8);
      shards.forEach((sh) => {
        pose(sh.el, { x: px + trem + Math.cos(sh.a) * tear * 130 * sh.drift + tear * 60, y: 680 + Math.sin(sh.a) * tear * 90 - tear * 240, s: (1 - tear * 0.4) * (1 + (time ? Math.sin(time * 6 + sh.i) * 0.05 : 0)), r: tear * 140 * (sh.i % 2 ? 1 : -1), o: (pk > 0 ? 0.9 : 0) * (1 - seg(t, 3.6, 3.9)) });
      });
      // the boy on the ground, shaking; his father kneeling
      const bIn = es(t, 2.2, 2.35);
      const rise = es(t, 3.45, 3.52);
      const shake = (1 - rise) * (time ? Math.sin(time * 22) * 3 : 0);
      boyDown.set({ x: X.boy + shake, y: 768, s: 0.66, r: -84 + shake, o: bIn * (1 - rise), armF: 40 + shake * 6, armB: 30 - shake * 6, head: shake * 3 });
      const hop = bump(t, 3.55, 3.8);
      boyUp.set({ x: X.boyUp, y: 774 - hop * 20, s: 0.66, o: rise, armF: 60 + hop * 60, armB: 80 + hop * 70, head: -8, blink: blinkAt(time, 6) });
      dadK.set({ x: X.dadK, y: 772, s: 0.92, flip: true, o: bIn * (1 - rise), armF: 50, armB: 40, head: 14 });
      dadS.set({ x: X.dadS, y: 776, s: 0.94, flip: true, o: rise, armF: 70, armB: 120, head: -6, blink: blinkAt(time, 7) });

      /* v24d: bursts of healing */
      [[X.g3[0], 620, 3.1], [X.g1[0], 580, 3.2], [X.poss, 600, 3.3], [X.g2[0], 580, 3.4], [X.boy - 20, 660, 3.45]].forEach(([x, y, a], i) => { const k = bump(t, a - 0.02, a + 0.45); pose(bursts[i], { x, y, s: 0.5 + k * 0.8, r: time * 20, o: k * 0.9 }); });

      S.cam.z = 1.02 + es(t, 1.0, 1.4) * 0.03 + es(t, 2.0, 2.4) * 0.03;
      S.cam.y = 40 + es(t, 2.0, 2.4) * 20;
    };
  },
};
