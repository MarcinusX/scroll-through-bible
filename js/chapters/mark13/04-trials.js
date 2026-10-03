// Mk 13,9–11 — a darker stage: what will happen to the disciples. They are led before a council, a
// shadow screen shows (restrained, a cloth comes down) the beating in the synagogue, they stand before
// a governor and a king — a small light of testimony in their hands. But first the Good News must go
// to all nations: a globe lights up, little people all round it. Led away, Peter worries what to say
// (a bubble of crossed-out slips pops); a glowing scroll is given him, the dove comes, and words of light
// go out from him: not you, but the Holy Spirit.
import { C, person, CAST, crowdPerson, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { elder, priest, helmet, crown, throne, wreath, addToHead, shadowPerson, silhouette, shadowScreen, globe, thought, wordSlip, scrollOpen, dove, flapWings, question, INK, PI } from './lib.js';

const GY = 690;
const DIS = [
  { k: 'peter', o: CAST.peter, x: 640 },
  { k: 'john', o: CAST.john, x: 566 },
  { k: 'james', o: CAST.james, x: 718 },
  { k: 'andrew', o: CAST.andrew, x: 492 },
];
const HALL = mix(C.night2, C.plumRobe, 0.35), HALL2 = mix(C.night2, C.plumRobe, 0.2);

/** the hall: a back wall with tall arches and pillars; origin world */
function hall(c) {
  const s = sheet();
  s.p(c.cut([[-1400, -1400], [3000, -1400], [3000, 640], [-1400, 640]], 0.4, 30), HALL);
  let arches = '', pil = '';
  for (let x = -1300; x < 3000; x += 260) {
    arches += c.cut([[x + 40, 620], [x + 40, 250], ...c.arc(x + 130, 250, 90, 90, PI, 2 * PI, 14), [x + 220, 620]], 0.5, 8);
    pil += c.cut(c.rect(x - 22, 120, 44, 520), 0.4, 10);
  }
  s.p(arches, HALL2);
  s.p(pil, mix(HALL, C.stone2, 0.18));
  s.p(c.cut([[-1400, 96], [3000, 96], [3000, 130], [-1400, 130]], 0.4, 20), mix(HALL, C.sun, 0.25));
  return s.out();
}
function floor(c) {
  const s = sheet();
  const col = mix(C.stone2, C.plumRobe, 0.35);
  s.p(c.cut([[-1400, 630], [3000, 630], [3000, 1800], [-1400, 1800]], 0.5, 20), col);
  let d = '';
  [650, 680, 724, 790, 890].forEach((y) => { d += c.ribbon([[-1400, y], [3000, y]], 1.4); });
  for (let k = -16; k <= 16; k++) d += c.ribbon([[800 + k * 60, 630], [800 + k * 170, 1300]], 1.2);
  s.x(d, shade(col, -0.2), 'opacity=".5"');
  return s.out();
}
/** the council: a long bench with five seated elders facing left, a table with a scroll; origin world */
function councilFlat(c) {
  let out = '';
  const s = sheet();
  s.p(c.cut([[930, 656], [930, 600], [1300, 600], [1300, 656]], 0.4, 8), C.wood2);
  s.p(c.cut(c.rect(924, 592, 382, 12), 0.3, 8), C.wood);
  out += s.out();
  const E = [elder(c, 0, { pose: 'sit' }), priest(c, 0, { pose: 'sit' }), elder(c, 1, { pose: 'sit' }), priest(c, 1, { pose: 'sit' }), elder(c, 2, { pose: 'sit' })];
  E.forEach((m, i) => { out += `<g transform="translate(${980 + i * 64} ${600 - (i % 2) * 4}) scale(${-0.78} ${0.78})">${m}</g>`; });
  const tb = sheet();
  tb.p(c.cut([[900, 700], [906, 646], [1250, 646], [1256, 700]], 0.4, 8), mix(C.wood, C.plumRobe, 0.2));
  tb.p(c.cut(c.rect(896, 638, 364, 12), 0.3, 8), C.wood3);
  tb.p(c.cut(c.rect(1050, 624, 60, 16), 0.3, 5), C.parchment);
  out += tb.out();
  return out;
}
/** a dais with steps; thrones are separate; origin world */
function dais(c) {
  const s = sheet();
  for (let i = 0; i < 3; i++) s.p(c.cut(c.rect(930 + i * 16, 690 - (i + 1) * 16, 400 - i * 16, 18), 0.4, 8), i % 2 ? C.stone : mix(C.stone2, C.plumRobe, 0.15));
  s.p(c.cut([[950, 642], [950, 380], [1320, 380], [1320, 642]], 0.5, 12), mix(C.plumRobe, C.terracotta, 0.3));
  let fr = '';
  for (let x = 960; x < 1320; x += 22) fr += c.cut([[x, 640], [x + 8, 640], [x + 4, 656]], 0.2, 3);
  s.p(fr, C.sun);
  s.p(c.cut(c.rect(940, 372, 390, 14), 0.3, 8), C.sun);
  return s.out();
}

export default {
  id: 'm13-trials',
  beats: [
    { v: 9, text: 'A wy miejcie się na baczności.' },
    { v: 9, cont: true, text: 'Wydawać was będą sądom i w synagogach będą was chłostać.' },
    { v: 9, cont: true, text: 'Nawet przed namiestnikami i królami stawać będziecie z mego powodu, na świadectwo dla nich.' },
    { v: 10 },
    { v: 11, text: 'A gdy was poprowadzą, żeby was wydać, nie martwcie się przedtem, co macie mówić;' },
    { v: 11, cont: true, text: 'ale mówcie to, co wam w owej chwili będzie dane.' },
    { v: 11, cont: true, text: 'Bo nie wy będziecie mówić, ale Duch Święty.' },
  ],
  cam: { x: [-40, 40], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the council, the thrones and the people closed up inside the screen
    const CFX = PH ? -170 : 0, TX = PH ? [880, 1020] : [1040, 1200], DDX = PH ? 30 : 0;
    const sk = sky(S, [HALL, HALL, HALL2]);
    const back = S.layer({ par: 0.12, sh: 3 });
    back.add(hall(c));
    const lampGl = [360, 1240].map((x) => back.add(`<g><circle cx="${x}" cy="200" r="120" fill="url(#warm-glow)" opacity=".7"/><path d="${c.cut(c.ell(x, 206, 22, 8, 12), 0.3, 3)}" fill="${C.ochre}"/><path d="M${x} -1400V200" stroke="rgba(240,220,190,.3)" stroke-width="1.2"/></g>`));

    /* flats that fly in: the council, the thrones */
    const flats = S.layer({ par: 0.3, sh: 6 });
    const council = flats.add(`<g>${councilFlat(c)}</g>`);
    const daisEl = flats.add(`<g>${dais(c)}</g>`);
    const thr = TX.map((x) => flats.add(`<g><g transform="scale(-1 1)">${throne(c)}</g></g>`));
    const GOV = { robe: C.linen, mantle: C.terracotta, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2, belt: C.sun };
    const KING = { robe: C.plumRobe, mantle: C.sun, hair: C.hair3, hairStyle: 'curly', beard: 'full', skin: C.skin3, belt: C.sun };
    const rulers = [
      { p: S.puppet(flats.add(addToHead(person(c, { ...GOV, pose: 'sit' }), `<g transform="translate(0 -4)">${wreath(c)}</g>`))), x: TX[0] },
      { p: S.puppet(flats.add(addToHead(person(c, { ...KING, pose: 'sit' }), `<g transform="translate(-1 2)">${crown(c)}</g>`))), x: TX[1] },
    ];

    /* the synagogue, as a shadow play (restrained: one raised rod, then a cloth comes down) */
    const scrL = S.layer({ par: 0.26, sh: 6 });
    const SW = 280, SH = 170;
    const scr = scrL.add(`<g>${shadowScreen(c, SW, SH)}<path d="${c.cut([[-SW / 2, SH], [-SW / 2, 120], [-60, 110], [SW / 2, 116], [SW / 2, SH]], 0.6, 8)}" fill="${INK}"/><path d="${c.cut([[40, SH - 50], [40, 30], [70, 30], [70, SH - 50]], 0.4, 6) + c.cut(c.rect(34, 22, 42, 10), 0.3, 4)}" fill="${INK}"/></g>`);
    const kneel = S.puppet(scrL.add(shadowPerson(c, { ...CAST.andrew, pose: 'kneel' })));
    const rodMan = S.puppet(scrL.add(person(c, { ...silhouette({ hairStyle: 'wrap', beard: 'full' }, INK), holdF: `<path d="M-2 0L2 0L3 -70L-1 -70Z" fill="${INK}"/>` }).split(`fill="${C.blush}"`).join(`fill="${INK}"`)));
    const cloth = scrL.add(`<g>${sheet().p(c.cut([[-SW / 2 - 8, 0], [SW / 2 + 8, 0], [SW / 2 + 8, SH + 4], [-SW / 2 - 8, SH + 4]], 0.6, 8), shade(C.plumRobe, -0.3)).x(Array.from({ length: 6 }, (_, i) => c.ribbon([[-SW / 2 + 20 + i * 48, 4], [-SW / 2 + 24 + i * 48, SH]], 7)).join(''), shade(C.plumRobe, -0.45), 'opacity=".5"').out()}</g>`);
    const SCR = { x: 800, y: 96 };

    /* all the nations: a globe with little people all round it */
    const gL = S.layer({ par: 0.3, sh: 6 });
    const R = 108;
    const gGlow = gL.add(`<g><circle r="${R * 2.4}" fill="url(#halo-glow)"/></g>`);
    const globeEl = gL.add(`<g><path d="M0 -1500V${-R}" stroke="rgba(240,220,190,.4)" stroke-width="1.2"/>${globe(c, R)}</g>`);
    const LANDS = [[-36, -34], [30, 10], [-40, 50], [44, -20], [10, 40], [-20, -10], [36, 40]];
    const lights = LANDS.map(([x, y], i) => ({ x, y, i, el: gL.add(`<g><circle r="16" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, 0, 6, 2.2, 4, 0))}" fill="${C.star}"/></g>`) }));
    const NATIONS = Array.from({ length: 11 }, (_, i) => {
      const a = PI * (1.02 + (i / 10) * 0.96) + 0;
      const o = crowdPerson(c, { skin: [C.skin, C.skin2, C.skin3, C.skin4][i % 4] });
      return { i, a, el: gL.add(`<g>${person(c, o)}</g>`), spark: gL.add(`<g><circle r="14" fill="url(#warm-glow)"/><path d="${c.poly(c.circ(0, 0, 3, 8))}" fill="${C.star}"/></g>`) };
    });

    /* the spotlight and the people */
    const flo = S.layer({ par: 0.42, sh: 3 });
    flo.add(floor(c));
    const spot = flo.add(`<g><ellipse rx="260" ry="70" fill="url(#warm-glow)"/></g>`);
    const cone = flo.add(`<g><path d="M-60 -700L60 -700L230 0L-230 0Z" fill="${C.lampGlow}" opacity=".12"/></g>`);

    const P = S.layer({ par: 0.5, sh: 5 });
    const GUARD = { robe: mix(C.terracotta, C.clay, 0.4), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.leather, holdF: `<path d="M-2 10L2 10L3 -150L-1 -150Z" fill="${C.wood2}"/><path d="M-4 -150L1 -170L6 -150Z" fill="${C.rock2}"/>` };
    const guards = [0, 1].map((i) => ({ i, p: S.puppet(P.add(addToHead(person(c, GUARD), helmet(c)))), seed: c.rr(0, 9) }));
    const dis = DIS.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, d.o))) }));
    const PETER = dis[0];

    /* little lights of testimony, worry, the given scroll, the dove, words of light */
    const fx = S.layer({ par: 0.52, sh: 4 });
    const testi = [2, 3].map((i) => ({ i, el: fx.add(`<g><circle r="30" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, 0, 9, 3.4, 4, 0))}" fill="${C.star}"/></g>`) }));
    const beam = fx.add(`<g><path d="${c.ribbon([[0, 0], [260, -40]], (u) => 10 - u * 6)}" fill="${C.lampGlow}" opacity=".35"/></g>`);
    const scribble = () => { let d = ''; for (let k = 0; k < 3; k++) d += c.ribbon([[-14, -6 + k * 6], [14, -8 + k * 6 + c.rr(-2, 2)]], 1.4); return `<path d="${d}" fill="${C.ink}" opacity=".5"/><path d="${c.ribbon([[-12, -10], [12, 8]], 2)}" fill="${C.terracotta}"/>`; };
    const worry = fx.add(`<g>${thought(c, `<g transform="translate(-12 -4) scale(.6)">${question(c)}</g><g transform="translate(14 2) scale(.9)">${scribble()}</g>`, { w: 90, h: 64 })}</g>`);
    const slips = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g>${wordSlip(c, 30)}</g>`), a: -PI * (0.2 + i * 0.15) }));
    const given = fx.add(`<g><circle r="70" fill="url(#halo-glow)"/>${scrollOpen(c, 56, 38)}</g>`);
    const dv = fx.add(`<g><circle r="80" fill="url(#halo-glow)"/>${dove(c)}</g>`);
    const rayOn = fx.add(`<g><path d="M-18 -900L18 -900L60 0L-60 0Z" fill="${C.halo}" opacity=".22"/></g>`);
    const wordsL = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g><circle r="22" fill="url(#warm-glow)"/>${sheet().p(c.cut([[-16, -6], [16, -7], [17, 6], [-16, 7]], 0.4, 5), C.halo).x(c.ribbon([[-10, 0], [10, 0]], 1.6), C.sunDeep, 'opacity=".6"').out()}</g>`) }));

    return (t, time) => {
      const T = time;
      /* flats in and out */
      const cIn = es(t, 1.0, 1.3, ease.out) * (1 - es(t, 2.0, 2.25));
      pose(council, { x: CFX, y: -(1 - cIn) * 700, o: cIn > 0.001 ? 1 : 0 });
      const dIn = es(t, 2.15, 2.45, ease.out) * (1 - es(t, 3.0, 3.25)) + es(t, 5.0, 5.3, ease.out);
      pose(daisEl, { x: TX[0] - 1040, y: -(1 - dIn) * 700, o: dIn > 0.001 ? 1 : 0 });
      thr.forEach((el, i) => pose(el, { x: TX[i] + 20, y: 642 - (1 - dIn) * 700, o: dIn > 0.001 ? 1 : 0 }));
      const listen = es(t, 2.5, 2.9) * (1 - es(t, 3, 3.1)) + es(t, 6.3, 6.7);
      rulers.forEach((r, i) => r.p.set({ x: r.x + 12, y: 594 - (1 - dIn) * 700, s: 0.92, flip: true, o: dIn > 0.001 ? 1 : 0, lean: -listen * (i ? 7 : 4), head: listen * 6, armF: 20 + (i === 0 ? bump(t, 5.3, 5.9) * 50 : 0), blink: blinkAt(T, i + 3) }));

      /* the shadow screen (beat 1) */
      const sIn = es(t, 1.35, 1.6, ease.back) * (1 - es(t, 2.0, 2.3));
      const sy = lerp(-400, SCR.y, sIn), sOn = sIn > 0.001 ? 1 : 0;
      pose(scr, { x: SCR.x, y: sy, o: sOn });
      kneel.set({ x: SCR.x - 30, y: sy + SH - 40, s: 0.4, flip: false, o: sOn, head: 12, lean: 8 });
      const lash = bump(t, 1.62, 1.9);
      rodMan.set({ x: SCR.x - 90, y: sy + SH - 44, s: 0.42, o: sOn, armF: 40 + lash * 120, armB: 10 });
      const cl = es(t, 1.8, 1.98);
      pose(cloth, { x: SCR.x, y: sy, sy: Math.max(0.001, cl), o: sOn * (cl > 0.001 ? 1 : 0) });

      /* the globe (beat 3) */
      const gIn = es(t, 3.05, 3.4, ease.back) * (1 - es(t, 4.0, 4.3));
      const gx = 800, gy = lerp(-400, 300, gIn), gOn = gIn > 0.001 ? 1 : 0;
      pose(globeEl, { x: gx, y: gy, r: -t * 8, o: gOn });
      const lit = es(t, 3.3, 3.85);
      pose(gGlow, { x: gx, y: gy, s: 0.4 + lit * 0.7, o: gOn * lit });
      lights.forEach((l) => {
        const k = es(t, 3.3 + l.i * 0.07, 3.5 + l.i * 0.07, ease.back);
        const a = (-t * 8 * PI) / 180, lx = l.x * Math.cos(a) - l.y * Math.sin(a), ly = l.x * Math.sin(a) + l.y * Math.cos(a);
        pose(l.el, { x: gx + lx, y: gy + ly, s: k * (0.9 + 0.1 * Math.sin(T * 3 + l.i)), o: gOn * (k > 0.01 ? 1 : 0) });
      });
      NATIONS.forEach((n) => {
        const k = es(t, 3.35 + n.i * 0.04, 3.6 + n.i * 0.04, ease.back);
        const x = gx + Math.cos(n.a) * (R + 2), y = gy + Math.sin(n.a) * (R + 2);
        pose(n.el, { x, y, s: 0.2 * k, r: (n.a * 180) / PI + 90, o: gOn * (k > 0.01 ? 1 : 0) });
        const sp = es(t, 3.55 + n.i * 0.04, 3.7 + n.i * 0.04);
        pose(n.spark, { x: gx + Math.cos(n.a) * (R + 48), y: gy + Math.sin(n.a) * (R + 48), s: sp, o: gOn * sp });
      });

      /* the spotlight follows the story */
      const spotX = lerp(lerp(620, 700, es(t, 1, 2.5)), 760, es(t, 4, 4.6));
      pose(spot, { x: spotX, y: GY + 6, s: 1 + bump(t, 3, 4) * 0.4, o: 0.8 });
      pose(cone, { x: spotX, y: GY, o: 1 - bump(t, 3.1, 4) * 0.6 });
      lampGl.forEach((el, i) => pose(el, { x: 0, y: 0, o: 0.7 + Math.sin(T * 2 + i) * 0.1 }));

      /* the four: arrive, look about; led, bowed; stand before rulers; go out; step back while Peter is led */
      dis.forEach((d) => {
        const enter = seg(t, -0.4 + d.i * 0.08, 0.4 + d.i * 0.08);
        let x = lerp(-200 - d.i * 70, d.x + DDX, ease.out(enter));
        let walking = enter > 0 && enter < 1, flip = false, armF = 0, armB = 0, head = 0, o = 1;
        // look about warily (beat 0)
        const wary = es(t, 0.45, 0.6) * (1 - es(t, 1.0, 1.15));
        head = Math.sin(T * 1.6 + d.seed) * 8 * wary;
        if (wary > 0.5 && Math.sin(T * 0.8 + d.seed) > 0.4) flip = true;
        // led forward before the council (beat 1): Peter and John
        if (d.k === 'peter' || d.k === 'john') { const f = es(t, 1.05, 1.5) * (1 - es(t, 3, 3.4)); x += f * (PH ? 60 : 120); walking = walking || (t > 1.05 && t < 1.5); head += es(t, 1.7, 1.9) * 12 * (1 - es(t, 2.1, 2.3)); }
        // before governors and kings (beat 2): James and Andrew step up, lights in their hands
        if (d.k === 'james' || d.k === 'andrew') { const f = es(t, 2.2, 2.6) * (1 - es(t, 3, 3.4)); x += f * (d.k === 'james' ? (PH ? 100 : 170) : (PH ? 250 : 300)); walking = walking || (t > 2.2 && t < 2.6) || (t > 3 && t < 3.4); armF += f * 70; }
        // to all nations (beat 3): they turn outwards, arms open towards the globe
        const out = es(t, 3.3, 3.6) * (1 - es(t, 4, 4.2));
        armB += out * 120; head -= out * 10;
        // beat 4–6: the others step back into the shadows; Peter is led to the ruler
        if (d.k === 'peter') {
          const led = es(t, 4.05, 4.6);
          x = lerp(x, PH ? 740 : 800, led); walking = walking || (t > 4.05 && t < 4.6);
          const calm = es(t, 4.82, 5.0);
          head += es(t, 4.2, 4.4) * 10 * (1 - calm) - calm * 4;
          armF += es(t, 5.4, 5.7) * 55;             // receives the scroll
          armB += es(t, 6.1, 6.4) * 60;             // speaks
        } else {
          const back = es(t, 4.05, 4.5);
          x = lerp(x, 330 + d.i * 70, back); walking = walking || (t > 4.05 && t < 4.5);
          o = 1 - back * 0.45;
        }
        d.p.set({ x, y: GY + (d.i % 2) * 6, s: 0.94, flip, o, walk: walking ? x * 0.05 : undefined, armF, armB, head, blink: blinkAt(T, d.seed) });
        d.xNow = x;
      });

      /* guards step out of the wings (beat 0), lead (beats 1 and 4) */
      guards.forEach((g) => {
        const inn = es(t, 0.5, 0.9) * (1 - es(t, 3.0, 3.3));
        const lead = es(t, 4.05, 4.6) * (1 - es(t, 6.8, 7));
        const x = g.i === 0 ? lerp(lerp(lerp(PH ? 1300 : 1500, PH ? 960 : 1000, inn), 1290, es(t, 1.0, 1.4)), PH ? 640 : 700, lead) : lerp(lerp(-300, 380, inn), -300, es(t, 1.9, 2.4));
        const walking = (t > 0.5 && t < 0.9) || (t > 4.05 && t < 4.6) || (g.i === 0 && t > 1 && t < 1.4) || (g.i === 1 && t > 1.9 && t < 2.4) || (t > 3 && t < 3.3);
        g.p.set({ x, y: GY + 4, s: 0.98, flip: g.i === 0 && lead < 0.5, walk: walking ? x * 0.05 : undefined, armF: 12, armB: g.i === 0 ? lead * 40 : 0, blink: blinkAt(T, g.seed) });
      });

      /* testimony lights and a beam to the rulers (beat 2) */
      testi.forEach((l) => {
        const d = dis[l.i];
        const k = es(t, 2.5, 2.7, ease.back) * (1 - es(t, 2.95, 3.1));
        pose(l.el, { x: d.xNow + 56, y: GY - 120, s: k * (0.9 + Math.sin(T * 3 + l.i) * 0.1), o: k > 0.01 ? 1 : 0 });
      });
      const bm = es(t, 2.6, 2.8) * (1 - es(t, 2.95, 3.1));
      pose(beam, { x: dis[2].xNow + 60, y: GY - 124, sx: bm, o: bm });

      /* Peter's worry pops; a scroll is given; the dove; words of light */
      const [px, py] = [PETER.xNow + 4, GY - 170 * 0.94];
      const wIn = es(t, 4.15, 4.4, ease.back), pop = es(t, 4.76, 4.92);
      pose(worry, { x: px + 6, y: py - 10, s: wIn * (1 + pop * 0.3), o: (1 - pop) * (wIn > 0.01 ? 1 : 0) });
      slips.forEach((sl) => {
        const k = es(t, 4.76, 5.2);
        pose(sl.el, { x: px + 30 + Math.cos(sl.a) * k * 140, y: py - 50 + Math.sin(sl.a) * k * 120 + k * k * 160, r: k * 200 * (sl.i % 2 ? 1 : -1), o: bump(t, 4.76, 5.25) });
      });
      const gv = es(t, 5.15, 5.6);
      pose(given, { x: px + 44, y: lerp(-100, GY - 128, gv), r: Math.sin(T * 1.3) * 3 * (1 - gv), o: gv > 0.01 ? 1 - es(t, 6.05, 6.3) * 0.5 : 0 });
      const dvIn = es(t, 6.0, 6.4, ease.out);
      pose(dv, { x: px + 6, y: lerp(-150, py - 70, dvIn) + Math.sin(T * 2) * 4 * dvIn, s: 0.9, o: dvIn > 0.01 ? 1 : 0 });
      if (dvIn > 0.01) flapWings(dv.querySelector('.bird') || dv, T * (0.6 + 0.4 * (1 - dvIn)), 30, 7);
      pose(rayOn, { x: px + 6, y: GY + 4, o: dvIn });
      wordsL.forEach((w) => {
        const on = es(t, 6.3, 6.5);
        const k = T ? ((T * 0.35 + w.i / 6) % 1) : (w.i + 0.5) / 6;
        const x = lerp(px + 30, TX[0], k), y = lerp(py + 10, 520, k) - Math.sin(k * PI) * 60;
        pose(w.el, { x, y, r: -10 + k * 20, s: 0.8 + 0.3 * Math.sin(k * PI), o: on * Math.sin(k * PI) });
      });

      S.cam.z = 1 + bump(t, 3, 4) * 0.02 + es(t, 5.9, 6.5) * 0.05;
      S.cam.y = -bump(t, 3, 4) * 30 + es(t, 5.9, 6.5) * 10;
      S.cam.x = es(t, 5.9, 6.5) * 20;
    };
  },
};
