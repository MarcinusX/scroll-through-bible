// Mt 24,6–8 — night falls on the Mount. A parchment map of the world comes down on its rods; little armies march
// across it, and rumours of war fly at the disciples like bubbles — they start up; "see that you are not
// troubled" — Jesus stills them with a hand, the bubbles fade. "This must happen, but it is not yet the end": an
// hourglass hangs beside the map, most of its sand still to run. Nation against nation: more armies, a crown over
// each, clashes flare. Famine and plague and earthquakes: empty bowls come down, a grey pall creeps over the towns,
// the map shakes and cracks. "All this is but the beginning of the birth pains" — a warm light shows through the
// crack, and a green shoot comes up out of it.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { olivesSet, circle, SKIES, JX, JY, mapSheet, hourglass, emptyBowl, banner, soldier, crownIcon, shoot, speech, voiceRings, PI } from './lib.js';

const BW = 540, BH = 262, SB = 1.06, BX = 800, BY = 138;
const CRACK = [[-258, 150], [-200, 136], [-160, 156], [-104, 128], [-50, 150], [4, 120], [52, 146], [102, 118], [152, 138], [204, 112], [258, 128]];
const TOWNS = [[-196, 88], [-120, 214], [-34, 60], [30, 200], [120, 70], [196, 214], [214, 120]];

/** the world on the map: a sea with three lands, mountains, rivers, towns */
function worldMap(c) {
  const s = sheet();
  s.p(c.cut(c.rect(-BW / 2 + 6, 8, BW - 12, BH - 16), 0.5, 10), mix(C.lake, C.parchment, 0.55));
  const lands = [
    [[-262, 20], [-150, 16], [-118, 60], [-140, 120], [-104, 180], [-126, 250], [-262, 252]],
    [[-78, 24], [60, 22], [74, 90], [50, 150], [80, 246], [-70, 250], [-90, 170], [-60, 110]],
    [[104, 30], [262, 24], [262, 250], [118, 248], [132, 170], [100, 110]],
  ];
  s.p(lands.map((l) => c.cut(l, 1.4, 8)).join(''), mix(C.parchment, C.sand, 0.35));
  let waves = '';
  [[-96, 60], [-96, 200], [86, 60], [88, 190]].forEach(([x, y]) => { waves += c.ribbon(c.arc(x, y, 7, 3, PI, 2 * PI, 5), 1.2) + c.ribbon(c.arc(x, y + 12, 7, 3, PI, 2 * PI, 5), 1.2); });
  s.x(waves, shade(C.lake2, -0.1), 'opacity=".6"');
  s.x(c.ribbon(c.qbez([-200, 30], [-170, 130], [-220, 240], 14), 2.6) + c.ribbon(c.qbez([0, 30], [20, 120], [-20, 240], 14), 2.6) + c.ribbon(c.qbez([200, 34], [160, 120], [210, 240], 14), 2.4), mix(C.lake2, C.parchment, 0.2), 'opacity=".8"');
  let mt = '';
  [[-230, 150], [-208, 142], [-40, 150], [-16, 140], [8, 150], [160, 150], [184, 160], [236, 60]].forEach(([x, y]) => { mt += c.cut([[x - 13, y + 8], [x, y - 13], [x + 13, y + 8]], 0.3, 4); });
  s.p(mt, mix(C.rock2, C.parchment, 0.3));
  let tw = '';
  TOWNS.forEach(([x, y]) => { tw += c.cut(c.rect(x - 6, y - 6, 12, 10), 0.2, 3) + c.cut([[x - 7, y - 6], [x, y - 12], [x + 7, y - 6]], 0.2, 3); });
  s.p(tw, C.clay);
  s.x(c.poly(c.star(236, 200, 15, 4, 4, 0)), C.terracotta, 'opacity=".6"');
  return s.out();
}

export default {
  id: 'mt24-wars',
  beats: [
    { v: 6, text: 'Będziecie słyszeć o wojnach i o pogłoskach wojennych; uważajcie, nie trwóżcie się tym.' },
    { v: 6, cont: true, text: 'To musi się stać, ale to jeszcze nie koniec!' },
    { v: 7, text: 'Powstanie bowiem naród przeciw narodowi i królestwo przeciw królestwu.' },
    { v: 7, cont: true, text: 'Będzie głód i zaraza, a miejscami trzęsienia ziemi.' },
    { v: 8 },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const TK = 0.32;
    const set = olivesSet(S, { skyCols: SKIES.twilight, tintK: TK, sunXY: [1150, 520], moonXY: [1210, 150] });

    set.sk.blend(SKIES.twilight, SKIES.night, 0.65);
    const P = S.layer({ par: 0.55, sh: 5 });
    const circ = circle(S, P, { tintCol: C.duskViolet, tintK: TK * 0.45 });
    const J = circ.jesus;
    const voice = voiceRings(P, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });

    /* the map */
    const pB = S.layer({ par: 0.3, sh: 6 });
    const mapEl = pB.add(`<g transform="translate(0 -1500)">${mapSheet(c, BW, BH)}${worldMap(c)}</g>`);
    const pall = TOWNS.slice(0, 5).map(([x, y], i) => ({ x, y, i, el: pB.add(`<g transform="translate(0 -1500)"><path d="${c.cut(c.blob(0, 0, 34, 16, 12, 0.25), 1.2, 4)}" fill="${mix(C.storm, C.olive, 0.3)}" opacity=".55"/><path d="${c.cut(c.blob(10, -6, 20, 10, 10, 0.25), 1, 4)}" fill="${mix(C.storm2, C.olive, 0.2)}" opacity=".5"/></g>`) }));
    const crackEl = pB.add(`<g transform="translate(0 -1500)"><path d="${c.ribbon(CRACK, (u) => 3 + Math.sin(u * PI) * 6, 2)}" fill="${mix(C.soilDark, C.night2, 0.3)}"/></g>`);
    const dawnEl = pB.add(`<g transform="translate(0 -1500)"><circle cy="130" r="130" fill="url(#warm-glow)"/><path d="${c.ribbon(CRACK.slice(3, 8), 3.6)}" fill="${C.lampGlow}"/></g>`);
    const shootEl = pB.add(`<g transform="translate(0 -1500)">${shoot(c, 44)}</g>`);
    const ARMY = [
      { col: C.terracotta, from: [-250, 200], to: [-100, 192], n: 4 },
      { col: C.teal2, from: [250, 196], to: [96, 188], n: 4 },
      { col: C.olive, from: [-40, 24], to: [-26, 96], n: 3, late: true },
      { col: C.plumRobe, from: [250, 70], to: [140, 90], n: 3, late: true },
    ].map((a, g) => ({
      ...a, g, dir: a.to[0] > a.from[0] ? 1 : -1,
      men: Array.from({ length: a.n }, (_, i) => ({ i, el: pB.add(`<g transform="translate(0 -1500)">${i === 0 ? banner(c, a.col, { h: 34, w: 18 }) : ''}<g transform="translate(${i === 0 ? 8 : 0} 0)">${soldier(c, a.col, { h: 22 })}</g></g>`) })),
      crown: pB.add(`<g transform="translate(0 -1500)">${crownIcon(c, 22, g % 2 ? mix(C.sun, C.stone, 0.3) : C.sun)}</g>`),
    }));
    const clashes = [[-2, 184], [90, 104], [-50, 110]].map(([x, y], i) => ({ x, y, i, el: pB.add(`<g transform="translate(0 -1500)"><path d="${c.poly(c.star(0, 0, 16, 5, 8, 0.2))}" fill="${C.halo}"/><path d="${c.poly(c.star(0, 0, 8, 3, 8, 0))}" fill="${C.cream}"/></g>`) }));

    /* hourglass and bowls on their strings */
    const hangs = S.layer({ par: 0.32, sh: 6 });
    const hg = hangs.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V-48" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${hourglass(c, 96)}</g>`);
    const sandT = hg.querySelector('.sandT'), sandB = hg.querySelector('.sandB'), stream = hg.querySelector('.stream');
    const bowls = [0, 1, 2].map((i) => ({ i, el: hangs.add(`<g transform="translate(0 -1500)"><path d="M0 -1500V-16" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><path d="M-24 -16L0 -40L24 -16" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${emptyBowl(c, 48, [C.pot, C.clay, shade(C.pot, 0.1)][i])}</g>`) }));

    /* rumours of wars: bubbles flying in at the disciples */
    const fx = S.layer({ par: 0.56, sh: 4 });
    const rumours = [0, 1, 2, 3].map((i) => ({ i, el: fx.add(`<g transform="translate(0 -1500)">${speech(c, `<g transform="scale(.9)">${banner(c, [C.terracotta, C.teal2, C.plumRobe, C.olive][i], { h: 30, w: 16 }).replace('<path', '<path transform="translate(-8 14)"')}</g><g transform="translate(14 14) scale(.55)">${soldier(c, C.rock3, { h: 30 })}</g>`, { w: 58, h: 46, flip: i % 2 === 1 })}</g>`) }));

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sun: 620, sunO: 0, moon: 150, moonO: 1, glow: 0.4 - es(t, 1, 5) * 0.25, starsO: 0.6 + es(t, 0, 5) * 0.35 });

      /* the map comes down; it shakes in the earthquake */
      const bIn = es(t, 0.02, 0.4, ease.back);
      const quake = bump(t, 3.45, 4.1);
      const shake = (Math.sin(T * 38) * 5 + Math.sin(t * 90) * 4) * quake;
      const bx = BX + shake, by = lerp(-460, BY, bIn);
      const on = bIn > 0.001 ? 1 : 0;
      pose(mapEl, { x: bx, y: by, s: SB, r: shake * 0.1, o: on });
      const at = (lx, ly) => [bx + lx * SB, by + ly * SB];

      /* armies (beat 0), more of them with their crowns (beat 2) */
      ARMY.forEach((a) => {
        const k = a.late ? es(t, 2.05 + (a.g - 2) * 0.12, 2.6 + (a.g - 2) * 0.12) : es(t, 0.2 + a.g * 0.1, 0.9 + a.g * 0.1);
        const close = a.late ? 0 : es(t, 2.1, 2.7) * 0.45;
        a.men.forEach((m) => {
          const lx = lerp(a.from[0], a.to[0], k * (1 - m.i * 0.04) + close) - a.dir * m.i * 17;
          const ly = lerp(a.from[1], a.to[1], k) + (m.i % 2) * 4;
          const [x, y] = at(lx, ly);
          const bob = k > 0 && k < 1 ? Math.abs(Math.sin(lx * 0.3)) * 2 : 0;
          pose(m.el, { x, y: y - bob, s: SB * 1.15, sx: a.dir, o: on * Math.min(1, k * 4) });
        });
        const cr = es(t, 2.2 + a.g * 0.1, 2.45 + a.g * 0.1, ease.back);
        const [cx, cy] = at(lerp(a.from[0], a.to[0], k + close) - a.dir * 8, lerp(a.from[1], a.to[1], k) - 46);
        pose(a.crown, { x: cx, y: cy + Math.sin(T * 2 + a.g) * 2, s: cr, o: on * (cr > 0.01 ? 1 : 0) });
      });
      clashes.forEach((cl) => {
        const k = t > 2.5 && t < 3.3 ? (T ? 0.6 + 0.4 * Math.sin(T * 7 + cl.i * 2) : 1) : 0;
        const [x, y] = at(cl.x, cl.y);
        pose(cl.el, { x, y, s: k * es(t, 2.5 + cl.i * 0.1, 2.7 + cl.i * 0.1) * (1 - es(t, 3.1, 3.3)), r: T * 40, o: on });
      });

      /* famine and plague (beat 3): the bowls come down, a grey pall creeps over the towns */
      bowls.forEach((b) => {
        const k = es(t, 3.05 + b.i * 0.1, 3.35 + b.i * 0.1, ease.back);
        pose(b.el, { x: (S.portrait ? 510 : 470) + b.i * 60, y: lerp(-200, 452 + (b.i % 2) * 22, k) + Math.sin(T * 1.1 + b.i) * 2, r: Math.sin(T * 0.9 + b.i * 2) * 4 * k + (b.i - 1) * 6, o: k > 0.01 ? 1 : 0 });
      });
      pall.forEach((p) => {
        const k = es(t, 3.15 + p.i * 0.06, 3.5 + p.i * 0.06);
        const [x, y] = at(p.x + (1 - k) * -30 + (T ? Math.sin(T * 0.6 + p.i) * 4 : 0), p.y - 4);
        pose(p.el, { x, y, s: SB * (0.4 + k * 0.7), o: on * k * (1 - es(t, 4.1, 4.5) * 0.5) });
      });
      /* …and the earth quakes: the map cracks; light and a shoot come through (beat 4) */
      const ck = es(t, 3.5, 3.9);
      const [c0x, c0y] = at(0, 0);
      pose(crackEl, { x: c0x - 258 * SB, y: c0y, s: SB, sx: Math.max(0.001, ck), ox: -258, o: on * (ck > 0.01 ? 1 : 0) });
      const dawn = es(t, 4.05, 4.5);
      pose(dawnEl, { x: c0x, y: c0y, s: SB, o: dawn * on });
      const sh = es(t, 4.15, 4.6, ease.back);
      const [dx, dy] = at(4, 124);
      pose(shootEl, { x: dx + 8, y: dy - 2, s: sh * 1.8, o: sh > 0.01 ? on : 0 });

      /* the hourglass (beat 1): not yet the end */
      const hk = es(t, 1.05, 1.4, ease.back);
      pose(hg, { x: 1180, y: lerp(-300, 262, hk) + Math.sin(T * 0.9) * 2, r: Math.sin(T * 0.8) * 1.5 * hk, o: hk > 0.01 ? 1 : 0 });
      const sand = seg(t, 1.05, 5.5);
      pose(sandT, { x: 0, y: -3, sy: 1 - sand * 0.25 });
      pose(sandB, { x: 0, y: 48, sy: 0.3 + sand * 0.3 });
      fade(stream, hk > 0.5 ? 0.9 : 0);

      /* rumours whisper at the four, then fade at "don't be troubled" */
      const calm = es(t, 0.62, 0.9);
      rumours.forEach((r) => {
        const m = circ.four[r.i];
        const k = es(t, 0.3 + r.i * 0.07, 0.5 + r.i * 0.07, ease.back);
        pose(r.el, { x: m.hx + m.dir * -30 + (r.i % 2 ? 10 : -10), y: m.hy - 46 - calm * 60, s: k * (1 - calm * 0.5), r: Math.sin(T * 5 + r.i) * 4 * (1 - calm), o: (1 - calm) * (k > 0.01 ? 1 : 0) });
      });

      /* Jesus: stills them (0), points to the hourglass (1), grieves (2–3), gentle hope (4) */
      const still = es(t, 0.6, 0.8) * (1 - es(t, 1.0, 1.1));
      const hgp = es(t, 1.1, 1.35) * (1 - es(t, 1.95, 2.1));
      const grief = es(t, 2.05, 2.4) * (1 - es(t, 3.95, 4.1));
      const hope = es(t, 4.05, 4.4);
      J.set({
        x: JX, y: JY, s: circ.s, flip: false,
        armB: 10 + still * 30, armF: 25 + still * 60 + hgp * 78 + hope * 55 + grief * 8,
        head: grief * 8 - hgp * 5 - hope * 8 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2),
      });
      voice(JX - 4, JY - 158, Math.max(es(t, 0.05, 0.2) * (1 - es(t, 0.6, 0.7)), still, hgp * 0.7, hope * 0.6), T, { s0: 0.7 });

      circ.four.forEach((m) => {
        const startle = es(t, 0.32, 0.45) * (1 - calm);
        const bow = es(t, 3.2, 3.6) * (1 - es(t, 4.1, 4.4));
        m.p.set({
          x: m.x, y: m.y, s: m.s, flip: m.flip,
          lean: m.dir * (3 - startle * 9), armF: 20 + startle * 50, armB: startle * 40,
          head: -6 - es(t, 0.1, 0.4) * 6 * (1 - es(t, 2, 2.4)) + bow * 12 - es(t, 4.2, 4.5) * 8, blink: blinkAt(T, m.seed),
        });
      });

      set.groundL.shift(shake * 0.6, 0);
      set.hillL.shift(shake * 0.4, 0);
      S.cam.y = -es(t, 0.1, 0.8) * 30 + es(t, 3.3, 3.8) * 20;
      S.cam.z = 1 + es(t, 0.1, 0.8) * 0.04;
    };
  },
};
