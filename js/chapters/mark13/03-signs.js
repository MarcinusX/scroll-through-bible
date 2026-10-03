// Mk 13,5–8 — twilight on the Mount. Jesus begins: beware of being led astray. A hanging plate shows
// a road to the light; masked figures say "I am he" and lead many off into the thorns. Then a map:
// armies and rumours of armies (don't be troubled — an hourglass, not yet the end), nation against
// nation, the map cracks in an earthquake, empty bowls hang for the famines — and out of the crack
// a green shoot: the beginning of the birth pains.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { olivesSet, circle, SKIES, JX, JY, tint, plate, mapSheet, hourglass, emptyBowl, mask, banner, soldier, crownIcon, shoot, pointer, word, speech, addToHead, along, voiceRings, PI } from './lib.js';

/* ---------- panel A: the road (local coords, origin at the plate's top centre) ---------- */
const AW = 480, AH = 250;
const ROAD = [[-205, 232], [-130, 212], [-50, 196], [20, 176], [86, 156], [140, 126], [176, 92]];
const WRONG = [[20, 176], [-16, 156], [-84, 138], [-150, 122], [-214, 112]];
const FORK = 0.5; // u on ROAD where the wrong way branches off

function roadScene(c) {
  const s = sheet();
  // sky of the plate: a soft dusk strip, then hills
  s.p(c.cut([[-AW / 2 + 10, 10], [AW / 2 - 10, 10], [AW / 2 - 10, 120], [-AW / 2 + 10, 120]], 0.3, 10), mix(C.parchment, C.dawn, 0.5));
  s.p(c.cut([[-AW / 2 + 10, 150], [-150, 96], [-60, 118], [40, 88], [130, 104], [AW / 2 - 10, 76], [AW / 2 - 10, AH - 10], [-AW / 2 + 10, AH - 10]], 0.8, 8), mix(C.hillMid, C.sage, 0.3));
  s.p(c.cut([[-AW / 2 + 10, 190], [-100, 160], [0, 180], [110, 150], [AW / 2 - 10, 140], [AW / 2 - 10, AH - 10], [-AW / 2 + 10, AH - 10]], 0.8, 8), C.hillNear);
  // the true road to the light
  s.p(c.ribbon(ROAD, (u) => 16 - u * 10), mix(C.sand, C.cream, 0.3));
  // the wrong way into the thorns (dimmer)
  s.p(c.ribbon(WRONG, (u) => 12 - u * 6), mix(C.sand2, C.rock2, 0.4));
  // the thorns at its end
  let th = '';
  for (let i = 0; i < 9; i++) th += c.cut(c.star(-206 + c.rr(-8, 16), 104 + c.rr(-18, 12), c.rr(12, 18), c.rr(4, 7), 7, c.rr(0, 1)), 0.6, 3);
  s.p(th, mix(C.thorn2, C.night2, 0.3));
  // the gate of light at the end of the road
  s.p(c.cut([[160, 96], [160, 60], ...c.arc(176, 60, 16, 16, PI, 2 * PI, 8), [192, 96]], 0.4, 4), C.halo);
  return `<circle cx="176" cy="74" r="70" fill="url(#halo-glow)"/>${s.out()}`;
}

/* ---------- panel B: a map of the world ---------- */
const BW = 520, BH = 262;
const CRACK = [[-248, 150], [-190, 138], [-150, 156], [-96, 128], [-44, 148], [6, 122], [52, 144], [100, 118], [150, 136], [200, 112], [250, 126]];
function mapScene(c) {
  const s = sheet();
  // sea on the left, a coast
  const coast = [[-BW / 2 + 4, 8], [-150, 8], [-162, 40], [-140, 70], [-170, 110], [-150, 150], [-176, 196], [-160, BH - 4], [-BW / 2 + 4, BH - 4]];
  s.p(c.cut(coast, 0.8, 7), mix(C.lake, C.parchment, 0.4));
  let waves = '';
  for (let i = 0; i < 9; i++) { const x = -BW / 2 + 20 + (i % 3) * 30, y = 30 + i * 24; waves += c.ribbon(c.arc(x, y, 8, 3, PI, 2 * PI, 5), 1.2) + c.ribbon(c.arc(x + 16, y, 8, 3, PI, 2 * PI, 5), 1.2); }
  s.x(waves, shade(C.lake2, -0.1), 'opacity=".6"');
  // rivers
  s.x(c.ribbon(c.qbez([60, 8], [20, 120], [80, BH - 4], 14), 3) + c.ribbon(c.qbez([200, 30], [160, 100], [80, 120], 10), 2), mix(C.lake2, C.parchment, 0.2), 'opacity=".8"');
  // mountains
  let mt = '';
  [[-90, 60], [-60, 52], [-30, 66], [150, 200], [180, 190], [210, 206], [-60, 220], [200, 60]].forEach(([x, y]) => { mt += c.cut([[x - 14, y + 8], [x, y - 14], [x + 14, y + 8]], 0.3, 4); });
  s.p(mt, mix(C.rock2, C.parchment, 0.3));
  // towns: little squares with dots
  let tw = '';
  [[-110, 110], [-20, 200], [120, 70], [30, 40], [200, 160], [-40, 90]].forEach(([x, y]) => { tw += c.cut(c.rect(x - 5, y - 5, 10, 10), 0.2, 3); });
  s.p(tw, C.clay);
  // dotted roads
  let rd = '';
  const road = c.qbez([-110, 110], [0, 150], [120, 70], 18);
  road.forEach(([x, y], i) => { if (i % 2) rd += c.poly(c.circ(x, y, 1.8, 6)); });
  c.qbez([-20, 200], [80, 180], [200, 160], 16).forEach(([x, y], i) => { if (i % 2) rd += c.poly(c.circ(x, y, 1.8, 6)); });
  s.x(rd, C.inkSoft, 'opacity=".5"');
  // compass rose
  s.x(c.poly(c.star(214, 34, 16, 4, 4, 0)), C.terracotta, 'opacity=".6"');
  return s.out();
}

export default {
  id: 'm13-signs',
  beats: [
    { v: 5 },
    { v: 6, text: 'Wielu przyjdzie pod moim imieniem i będą mówić: Ja jestem.' },
    { v: 6, cont: true, text: 'I wielu w błąd wprowadzą.' },
    { v: 7, text: 'Kiedy więc usłyszycie o wojnach i pogłoskach wojennych, nie trwóżcie się!' },
    { v: 7, cont: true, text: 'To się musi stać, ale to jeszcze nie koniec.' },
    { v: 8, text: 'Powstanie bowiem naród przeciw narodowi i królestwo przeciw królestwu;' },
    { v: 8, cont: true, text: 'będą miejscami trzęsienia ziemi, będą klęski głodu.' },
    { v: 8, cont: true, text: 'To jest początek boleści.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const TK = 0.28;
    const PH = S.portrait;   // phone: both panels a little smaller and inside the screen, the hourglass above the map
    const SA = PH ? 1.06 : 1.18, SB = PH ? 1.0 : 1.1;
    const set = olivesSet(S, { skyCols: SKIES.twilight, tintK: TK, sunXY: [1150, 420], moonXY: [1210, 150] });

    /* the circle */
    const P = S.layer({ par: 0.55, sh: 5 });
    const circ = circle(S, P, { tintCol: C.duskViolet, tintK: TK * 0.45 });
    const J = circ.jesus;
    const voice = voiceRings(P, c, { n: 3, r: 24, w: 4, color: shade(C.ochre, 0.35) });

    /* ---------- panel A: the road ---------- */
    const pA = S.layer({ par: 0.3, sh: 6 });
    const A = { el: pA.add(`<g>${plate(c, AW, AH)}${roadScene(c)}</g>`), x: PH ? 790 : 800, y: 104 };
    const sign = pA.add(`<g>${pointer(c, '', { dir: -1, size: 1 }).replace('<text', '<text opacity="0"')}</g>`);
    const TRAV = Array.from({ length: 6 }, (_, i) => ({ i, u0: 0.02 + i * 0.07, follow: i !== 0 && i !== 3, seed: c.rr(0, 9), p: S.puppet(pA.add(person(c, crowdPerson(c)))) }));
    const MASK_COLS = [[C.plumRobe, C.sun], [C.terracotta, C.halo], [C.indigo, C.sun]];
    const MASKS = MASK_COLS.map(([robe, gold], i) => {
      const m = mask(c, { col: gold, r: 22, stick: false });
      const fig = addToHead(person(c, { robe, mantle: gold, hairStyle: 'wrap', veil: robe, veil2: gold, beard: 'none', skin: C.skin2, belt: gold }), `<g transform="translate(6 0)">${m}</g>`);
      return { i, p: S.puppet(pA.add(fig)), tag: pA.add(`<g>${word(c, tr('Ja jestem', 'I am he'), { size: 15, fill: mix(C.halo, C.cream, 0.4) })}</g>`), seed: c.rr(0, 9) };
    });

    /* ---------- panel B: the map ---------- */
    const pB = S.layer({ par: 0.3, sh: 6 });
    const B = { el: pB.add(`<g>${mapSheet(c, BW, BH)}<g transform="translate(0 0)">${mapScene(c)}</g></g>`), x: PH ? 785 : 800, y: 116 };
    const crackEl = pB.add(`<g><path d="${c.ribbon(CRACK, (u) => 3 + Math.sin(u * PI) * 5, 2)}" fill="${mix(C.soilDark, C.night2, 0.3)}"/></g>`);
    const dawnEl = pB.add(`<g><circle cy="130" r="120" fill="url(#warm-glow)"/><path d="${c.ribbon(CRACK.slice(3, 8), 3.4)}" fill="${C.lampGlow}"/></g>`);
    const shootEl = pB.add(`<g>${shoot(c, 44)}</g>`);
    const ARMY = [
      { col: C.terracotta, from: [-230, 190], to: [-80, 176], n: 4 },
      { col: C.teal2, from: [230, 176], to: [60, 170], n: 4 },
      { col: C.olive, from: [-40, 20], to: [-30, 90], n: 3, late: true },
      { col: C.plumRobe, from: [240, 60], to: [110, 84], n: 3, late: true },
    ].map((a, g) => ({
      ...a, g, dir: a.to[0] > a.from[0] ? 1 : -1,
      men: Array.from({ length: a.n }, (_, i) => ({ i, el: pB.add(`<g>${i === 0 ? banner(c, a.col, { h: 34, w: 18 }) : ''}<g transform="translate(${i === 0 ? 8 : 0} 0)">${soldier(c, a.col, { h: 22 })}</g></g>`) })),
      crown: pB.add(`<g>${crownIcon(c, 22, g % 2 ? mix(C.sun, C.stone, 0.3) : C.sun)}</g>`),
    }));
    const clashes = [[-10, 170], [80, 100], [-60, 110]].map(([x, y], i) => ({ x, y, i, el: pB.add(`<g><path d="${c.poly(c.star(0, 0, 16, 5, 8, 0.2))}" fill="${C.halo}"/><path d="${c.poly(c.star(0, 0, 8, 3, 8, 0))}" fill="${C.cream}"/></g>`) }));

    /* hourglass and bowls on their strings */
    const hangs = S.layer({ par: 0.32, sh: 6 });
    const hg = hangs.add(`<g><path d="M0 -1500V-48" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${hourglass(c, 96)}</g>`);
    const sandT = hg.querySelector('.sandT'), sandB = hg.querySelector('.sandB'), stream = hg.querySelector('.stream');
    const bowls = [0, 1, 2].map((i) => ({ i, el: hangs.add(`<g><path d="M0 -1500V-16" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/><path d="M-24 -16L0 -40L24 -16" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${emptyBowl(c, 48, [C.pot, C.clay, shade(C.pot, 0.1)][i])}</g>`) }));

    /* rumours of wars: whispers flying in at the disciples */
    const fx = S.layer({ par: 0.56, sh: 4 });
    const rumours = [0, 1, 2, 3].map((i) => ({ i, el: fx.add(`<g>${speech(c, `<g transform="scale(.9)">${banner(c, [C.terracotta, C.teal2, C.plumRobe, C.olive][i], { h: 30, w: 16 }).replace('<path', '<path transform="translate(-8 14)"')}</g><g transform="translate(14 14) scale(.55)">${soldier(c, C.rock3, { h: 30 })}</g>`, { w: 58, h: 46, flip: i % 2 === 1 })}</g>`) }));

    set.front();

    // where a figure is on panel A
    const onA = (lx, ly) => [A.x + lx * SA, A.yNow + ly * SA];

    return (t, time) => {
      const T = time;
      set.sk.blend(SKIES.twilight, SKIES.night, es(t, 0, 8) * 0.8);
      set.update(t, T, { sun: 520, sunO: 0, moon: 150 + (1 - es(t, 1, 6)) * 60, moonO: es(t, 0.5, 3), glow: 0.5 - es(t, 2, 8) * 0.3, starsO: 0.3 + es(t, 0, 8) * 0.6 });

      /* ---------- panel A (beats 0–2) ---------- */
      const aIn = es(t, -0.3, 0.3, ease.back) * (1 - es(t, 2.95, 3.3));
      A.yNow = lerp(-420, A.y, aIn) - es(t, 2.95, 3.3) * 200;
      const aOn = aIn > 0.001 ? 1 : 0;
      pose(A.el, { x: A.x, y: A.yNow, s: SA, o: aOn });
      // the false sign pops up at the fork (beat 0)
      const sg = es(t, 0.45, 0.7, ease.back);
      const [sx, sy] = onA(4, 178);
      pose(sign, { x: sx, y: sy, s: 0.5 * sg * SA, o: aOn * (sg > 0.01 ? 1 : 0) });
      // travellers walk the road; the front one hesitates at the sign; then most follow the masks
      TRAV.forEach((tv) => {
        const u = Math.min(FORK - 0.02 - tv.i * 0.03, tv.u0 + es(t, 0, 0.9) * 0.36) + (tv.follow ? 0 : es(t, 2.1, 2.9) * (1 - FORK));
        let pt = along(ROAD, u);
        let walking = (t > 0 && t < 0.9) || (!tv.follow && t > 2.1 && t < 2.9);
        if (tv.follow) {
          const w = es(t, 2.05 + tv.i * 0.05, 2.85);
          if (w > 0) { const q = along(WRONG, w * (0.8 - tv.i * 0.05)); pt = [lerp(pt[0], q[0], Math.min(1, w * 4)), lerp(pt[1], q[1], Math.min(1, w * 4)), -1]; walking = w < 1; }
        }
        const [x, y] = onA(pt[0], pt[1]);
        const hes = tv.i === 5 ? bump(t, 0.7, 1.4) : 0;
        tv.p.set({ x, y, s: 0.24 * SA, flip: pt[2] < 0, o: aOn, walk: walking ? x * 0.12 : undefined, head: -hes * 10, armF: hes * 60, blink: blinkAt(T, tv.seed) });
      });
      // masked figures rise at the fork, each saying "I am he", then lead off along the wrong way
      MASKS.forEach((m) => {
        const up = es(t, 1.05 + m.i * 0.12, 1.4 + m.i * 0.12, ease.out);
        const go = es(t, 2.0, 2.8);
        const q = along(WRONG, 0.12 + m.i * 0.1 + go * 0.62);
        const [x, y] = onA(q[0] - 30 + m.i * 46 * (1 - go), q[1] + (1 - up) * 40 + m.i * 6 * (1 - go));
        m.p.set({ x, y, s: 0.3 * SA, flip: go > 0.05 ? true : m.i % 2 === 1, o: aOn * Math.min(1, up * 3), walk: go > 0 && go < 1 ? x * 0.12 : undefined, armB: 120 * up * (1 - go), armF: 40 + go * 40, blink: blinkAt(T, m.seed) });
        const tg = es(t, 1.2 + m.i * 0.12, 1.4 + m.i * 0.12, ease.back) * (1 - es(t, 1.95, 2.15));
        pose(m.tag, { x: x + (m.i - 1) * 14, y: y - 96 - (m.i % 2) * 26, s: tg * 1.05, r: Math.sin(T * 1.4 + m.i) * 3, o: aOn * (tg > 0.01 ? 1 : 0) });
      });

      /* ---------- panel B: the map (beats 3–7) ---------- */
      const bIn = es(t, 2.95, 3.35, ease.back);
      const quake = bump(t, 6.0, 6.7);
      const shake = Math.sin(T * 38) * 5 * quake + Math.sin(t * 90) * 4 * quake;
      const bx = B.x + shake, by = lerp(-460, B.y, bIn);
      const bOn = bIn > 0.001 ? 1 : 0;
      pose(B.el, { x: bx, y: by, s: SB, r: shake * 0.1, o: bOn });
      const onB = (lx, ly) => [bx + lx * SB, by + ly * SB];
      // armies march in (beat 3), more nations and their crowns (beat 5)
      ARMY.forEach((a) => {
        const k = a.late ? es(t, 5.05 + (a.g - 2) * 0.12, 5.6 + (a.g - 2) * 0.12) : es(t, 3.1 + a.g * 0.1, 3.8 + a.g * 0.1);
        const close = a.late ? 0 : es(t, 5.1, 5.7) * 0.5;
        a.men.forEach((m) => {
          const lx = lerp(a.from[0], a.to[0], k * (1 - m.i * 0.04) + close) - a.dir * m.i * 17;
          const ly = lerp(a.from[1], a.to[1], k) + (m.i % 2) * 4;
          const [x, y] = onB(lx, ly);
          const bob = k > 0 && k < 1 ? Math.abs(Math.sin(lx * 0.3)) * 2 : 0;
          pose(m.el, { x, y: y - bob, s: SB * 1.15, sx: a.dir, o: bOn * Math.min(1, k * 4) });
        });
        const cr = a.late ? es(t, 5.3 + (a.g - 2) * 0.1, 5.55 + (a.g - 2) * 0.1, ease.back) : es(t, 5.1 + a.g * 0.1, 5.35 + a.g * 0.1, ease.back);
        const lead = a.men[0];
        const [cx, cy] = onB(lerp(a.from[0], a.to[0], k * 1 + close), lerp(a.from[1], a.to[1], k) - 44);
        pose(a.crown, { x: cx, y: cy + Math.sin(T * 2 + a.g) * 2, s: cr, o: bOn * (cr > 0.01 ? 1 : 0) });
      });
      clashes.forEach((cl) => {
        const k = t > 5.4 && t < 6.2 ? 0.6 + 0.4 * Math.sin(T * 7 + cl.i * 2) : 0;
        const [x, y] = onB(cl.x, cl.y);
        pose(cl.el, { x, y, s: k * es(t, 5.4 + cl.i * 0.1, 5.6 + cl.i * 0.1) * (1 - es(t, 6.0, 6.3)), r: T * 40, o: bOn });
      });
      // earthquake: the map cracks (beat 6); a warm light and a shoot come through (beat 7)
      const ck = es(t, 6.05, 6.45);
      const [c0x, c0y] = onB(0, 0);
      pose(crackEl, { x: c0x - 248 * SB, y: c0y, s: SB, sx: Math.max(0.001, ck), ox: -248, o: bOn * (ck > 0.01 ? 1 : 0) });
      const dawn = es(t, 7.05, 7.5);
      const [dx, dy] = onB(0, 128);
      pose(dawnEl, { x: c0x, y: c0y, s: SB, o: dawn * bOn });
      const sh = es(t, 7.15, 7.6, ease.back);
      pose(shootEl, { x: dx + 8, y: dy - 4, s: sh * 1.7, o: sh > 0.01 ? bOn : 0 });

      // hourglass (beat 4): not yet the end
      const hk = es(t, 4.0, 4.35, ease.back) * (1 - es(t, 7.6, 8) * 0.2);
      pose(hg, { x: PH ? 1010 : 1172, y: (PH ? lerp(-700, -60, hk) : lerp(-300, 250, hk)) + Math.sin(T * 0.9) * 2, r: Math.sin(T * 0.8) * 1.5 * hk, o: hk > 0.01 ? 1 : 0 });
      const sand = seg(t, 4.0, 8);
      pose(sandT, { x: 0, y: -3, sy: 1 - sand * 0.25 });
      pose(sandB, { x: 0, y: 48, sy: 0.3 + sand * 0.3 });
      fade(stream, hk > 0.5 ? 0.9 : 0);
      // empty bowls for the famines (beat 6)
      bowls.forEach((b) => {
        const k = es(t, 6.2 + b.i * 0.12, 6.5 + b.i * 0.12, ease.back);
        pose(b.el, { x: 640 + b.i * 160, y: lerp(-200, 432 + (b.i % 2) * 18, k) + Math.sin(T * 1.1 + b.i) * 2, r: Math.sin(T * 0.9 + b.i * 2) * 4 * k + (b.i - 1) * 6, o: k > 0.01 ? 1 : 0 });
      });

      /* rumours whisper at the four, then fade at "don't be troubled" */
      rumours.forEach((r) => {
        const m = circ.four[r.i];
        const k = es(t, 3.05 + r.i * 0.08, 3.3 + r.i * 0.08, ease.back);
        const calm = es(t, 3.45, 3.75);
        pose(r.el, { x: m.hx + m.dir * -30 + (r.i % 2 ? 10 : -10), y: m.hy - 46 - calm * 60, s: k * (1 - calm * 0.5), r: Math.sin(T * 5 + r.i) * 4 * (1 - calm), o: (1 - calm) * (k > 0.01 ? 1 : 0) });
      });

      /* Jesus: warns (0), shows (1–2), calms (3), points to the hourglass (4), grieves (5–6), gentle hope (7) */
      const warn = bump(t, 0.05, 0.95);
      const show = es(t, 1.0, 1.3) * (1 - es(t, 2.8, 3.05));
      const calm = es(t, 3.4, 3.6) * (1 - es(t, 3.95, 4.1));
      const hgp = es(t, 4.05, 4.3) * (1 - es(t, 4.9, 5.1));
      const grief = es(t, 5.05, 5.4) * (1 - es(t, 6.95, 7.1));
      const hope = es(t, 7.05, 7.4);
      J.set({
        x: JX, y: JY, s: circ.s, flip: false,
        armB: 10 + warn * 150 + show * 20, armF: 25 + show * 80 + calm * 55 + hgp * 75 + hope * 50 + grief * 10,
        head: -show * 8 + grief * 8 - hgp * 5 - hope * 6 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2),
      });
      voice(JX - 4, JY - 158, Math.max(warn, calm, hope * 0.6), T, { s0: 0.7 });

      /* the four: listen; startled by the rumours, settle; bowed at the famines; look up at the shoot */
      circ.four.forEach((m) => {
        const startle = es(t, 3.05, 3.2) * (1 - es(t, 3.5, 3.8));
        const bow = es(t, 6.2, 6.6) * (1 - es(t, 7.1, 7.4));
        m.p.set({
          x: m.x, y: m.y, s: m.s, flip: m.flip,
          lean: m.dir * (3 - startle * 9), armF: 20 + startle * 50, armB: startle * 40,
          head: -6 - es(t, 0.9, 1.2) * 6 * (1 - es(t, 5, 5.4)) + bow * 12 - es(t, 7.2, 7.5) * 8, blink: blinkAt(T, m.seed),
        });
      });

      set.groundL.shift(shake * 0.6, 0);
      set.hillL.shift(shake * 0.4, 0);
      S.cam.y = -es(t, 0.2, 1.0) * 30 + es(t, 5.8, 6.4) * 20;
      S.cam.z = 1 + es(t, 0.2, 1.0) * 0.04;
    };
  },
};
