// Łk 4,40–41 — the sun goes down over Capernaum, lamps are lit, and from both ends of the street the whole town
// brings its sick to Simon's door. They are set down round Him — a blind man, a man with a crutch, a bent woman, a
// feverish boy on his mother's knee — and He lays His hands on every one of them in turn: one after another they
// light up and stand. Out of many people dark shadows tear loose, shrieking "You are the Son of God!" — but He
// rebukes them: the shouting bubbles crumple and fall, the shadows blow away into the night, and nobody hears them.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, moon, stars, house } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { EVENING, NIGHT2, houseFacade, crutch, handLamp, shadowShards, bubble, headAt, hand, sparkle, group, folk, figure, manO, womanO, voiceRings, tr, PI } from './lib.js';

const DOOR = 800, JY = 716;
// the sick round Him: [x, y, flip, look, pose]
const SICK = [
  { x: 610, y: 760, flip: false, o: { robe: C.mauve, hairStyle: 'wrap', veil: C.stone, hair: C.hair, beard: 'short', skin: C.skin3 }, blind: true },
  { x: 690, y: 770, flip: false, o: { robe: C.tealRobe, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair, skin: C.skin2 }, crutch: true },
  { x: 915, y: 770, flip: true, o: { robe: C.plumRobe, hairStyle: 'veil', veil: C.stone2, hair: C.greyHair, skin: C.skin2, beard: 'none' }, bent: true },
  { x: 1000, y: 760, flip: true, o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.cream, hair: C.hair2, skin: C.skin, beard: 'none' }, mother: true },
];

export default {
  id: 'lk4-sunset',
  beats: [
    { v: 40, text: 'O zachodzie słońca wszyscy, którzy mieli cierpiących na rozmaite choroby, przynosili ich do Niego.' },
    { v: 40, cont: true, text: 'On zaś na każdego z nich kładł ręce i uzdrawiał ich.' },
    { v: 41, text: 'Także złe duchy wychodziły z wielu, wołając: «Ty jesteś Syn Boży!»' },
    { v: 41, cont: true, text: 'Lecz On je gromił i nie pozwalał im mówić, ponieważ wiedziały, że On jest Mesjaszem.' },
  ],
  cam: { x: [-20, 20], y: [0, 70], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, EVENING);
    const night = sky(S, NIGHT2, { name: 'night' }).layer;
    night.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 110 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 470, y: 260, len: 900 });
    const moonEl = hanging(hangL, `<circle r="100" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 32)}`, { x: 1250, y: -200, len: 900 });

    /* the lake and the town, by day and with lit windows */
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 470, amps: [12, 6, 2], lens: [1000, 330, 120], color: '#b9a7b4' }).markup + waterBand(c, { y: 505, color: '#9fb7bf', foamN: 10 }).markup);
    const townPair = (seed, x, y, n, spread, sc) => {
      const r = makeCutter(seed);
      const spec = Array.from({ length: n }, (_, i) => ({ x: r.rr(x - spread / 2, x + spread / 2), w: r.rr(40, 70) * sc, h: r.rr(30, 50) * sc, dy: r.rr(0, 30) * sc, st: r.chance(0.5), lit: r.chance(0.65), i })).sort((a, b) => a.x - b.x);
      const draw = (lit) => spec.map((h, i) => house(makeCutter(seed + i), h.x, y - h.dy - (i % 2) * 8 * sc, h.w, h.h, { stairs: h.st, lit: lit && h.lit })).join('');
      return [draw(false), draw(true)];
    };
    const tl = townPair('lk4-ss-l', 250, 560, 7, 380, 0.8), tr2 = townPair('lk4-ss-r', 1360, 565, 6, 360, 0.8);
    S.layer({ par: 0.2, sh: 3 }).add(tl[0] + tr2[0]);
    const townLit = S.layer({ par: 0.2, sh: 3 });
    townLit.add(tl[1] + tr2[1]);
    townLit.fade(0);
    const H = S.layer({ par: 0.3, sh: 4 });
    H.add(`<g transform="translate(${DOOR - 950} 0)">${houseFacade(S, { withSky: false })}</g>`);
    const doorLit = H.add(`<g opacity="0"><ellipse cx="${DOOR}" cy="600" rx="130" ry="150" fill="url(#warm-glow)"/><path d="${c.poly([[DOOR - 48, 660], [DOOR - 48, 500], ...c.arc(DOOR, 500, 48, 42, PI, 2 * PI, 10), [DOOR + 48, 660]])}" fill="#f7d58e"/></g>`);
    const dusk = S.layer({ par: 0.3, sh: 1, flat: true });
    dusk.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2c2a55"/>`);
    dusk.fade(0);

    /* the town arrives from both ends of the street (whole groups, moved on the compositor) */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const GR = [[330, -1], [440, -1], [540, -1], [1060, 1], [1170, 1], [1270, 1]].map(([x, side], i) => {
      const mem = [0, 1, 2].map((k) => ({ x: (k - 1) * 30 + c.rr(-5, 5), y: c.rr(-6, 6), s: 1, flip: side > 0, o: folk(c) }));
      return { i, x, side, d: c.rr(0, 0.3), sp: crowdL.sprite(`<g transform="scale(.74)">${group(c, mem)}</g>`, x, 694) };
    });
    // the ones with evil spirits, standing among them
    const POS = [{ x: 470, o: manO(c, { robe: C.stone2, hairStyle: 'wild', hair: C.hair3 }) }, { x: 1120, o: womanO(c, { robe: C.clayMantle }) }, { x: 1230, o: manO(c, { robe: C.ochreRobe, hairStyle: 'wild', hair: C.hair }) }]
      .map((p, i) => ({ ...p, i, flip: p.x > DOOR, p: S.puppet(crowdL.add(person(c, p.o))), shards: shadowShards(c, { n: 7, r: 56 }).map((sh) => ({ ...sh, el: crowdL.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.7, 1.2) })) }));
    const lamps = [0, 1, 2, 3].map((i) => crowdL.add(`<g opacity="0">${handLamp(c)}</g>`));

    /* Jesus and the sick round Him */
    const L = S.layer({ par: 0.5, sh: 5 });
    const touchGlow = SICK.map(() => L.add(`<circle r="70" fill="url(#halo-glow)" opacity="0"/>`));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const sick = SICK.map((m, i) => {
      const P0 = m.crutch ? { pose: 'sit', holdF: `<g transform="translate(0 -4) scale(.8)">${crutch(c)}</g>` } : { pose: 'kneel', eyes: m.blind ? 'closed' : 'open' };
      return {
        ...m, i,
        a: S.puppet(L.add(person(c, { ...m.o, ...P0 }))),
        b: S.puppet(L.add(person(c, m.o))),
        kid: m.mother ? S.puppet(L.add(person(c, { robe: C.skyVeil, hair: C.hair2, hairStyle: 'short', skin: C.skin, beard: 'none' }))) : null,
      };
    });
    const heal = SICK.map(() => L.add(`<g opacity="0">${sparkle(c, 14)}</g>`));
    const voice = voiceRings(L, c, { n: 3, color: C.sun, r: 40, w: 5 });

    /* the shrieks and their silencing */
    const fx = S.layer({ par: 0.45, sh: 5 });
    const cries = POS.map((p) => fx.add(`<g opacity="0">${bubble(tr('Ty jesteś Syn Boży!', 'You are the Son of God!'), { size: 20, jag: true, c, fill: '#3a3048', ink: C.cream, flip: p.flip })}</g>`));
    const scraps = POS.map(() => fx.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 16, 11, 8, 0.4), 1.4, 4)}" fill="#6a6278"/></g>`));

    return (t, time) => {
      /* v40a: sunset — the sick are brought */
      const set = es(t, 0.02, 0.8);
      swing(sunEl, 470, lerp(260, 600, set), time, 0.8, 0.5);
      const nightK = es(t, 0.5, 1.6);
      night.fade(nightK);
      starL.fade(es(t, 1.0, 1.8));
      dusk.fade(nightK * 0.28);
      swing(moonEl, 1250, lerp(-300, 140, es(t, 1.4, 2.4)), time, 0.8, 0.5, 1);
      townLit.fade(es(t, 0.6, 1.1));
      fade(doorLit, es(t, 0.8, 1.2));
      GR.forEach((g) => {
        const k = es(t, 0.05 + g.d, 0.6 + g.d);
        g.sp.set({ x: g.x + (1 - k) * g.side * 700, y: 694 - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 26 + g.i)) * 3 : 0), s: 1, o: seg(t, 0.03 + g.d, 0.1 + g.d) });
      });
      lamps.forEach((l, i) => { const g = GR[[0, 2, 3, 5][i]]; const k = es(t, 0.05 + g.d, 0.6 + g.d); pose(l, { x: g.x + (1 - k) * g.side * 700 + (g.side > 0 ? -34 : 34), y: 580, s: 0.9, o: es(t, 0.7, 1.0) * seg(t, 0.05 + g.d, 0.12 + g.d) }); });

      /* v40b: He lays His hands on every one of them */
      const who = Math.max(0, Math.min(3, Math.floor((t - 1.05) / 0.2)));
      const touching = t > 1.05 && t < 1.9;
      const target = sick[touching ? who : 0];
      const reach = touching ? bump((t - 1.05) % 0.2 / 0.2, 0, 1) : 0;
      const faceRight = touching ? target.x > DOOR : t > 2.9 ? false : true;
      const rebuke = es(t, 3.05, 3.3);
      jesus.set({ x: DOOR + (touching ? (target.x - DOOR) * 0.25 : 0), y: JY, s: 1.0, flip: !faceRight, armF: 14 + (touching ? 40 + reach * 30 : 0) + rebuke * 50, armB: 10 + rebuke * 130, lean: touching ? reach * 10 : 0, head: touching ? 10 : -rebuke * 4, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(DOOR, JY, 1.0, !faceRight);
      voice(jhx, jhy, rebuke * (1 - es(t, 3.8, 4.0)), time, { spread: 3 });
      sick.forEach((m) => {
        const bring = es(t, 0.3 + m.i * 0.08, 0.85 + m.i * 0.06);
        const mx = m.x + (1 - bring) * (m.flip ? 600 : -600);
        const healed = es(t, 1.13 + m.i * 0.2, 1.2 + m.i * 0.2);
        const joy = es(t, 1.2 + m.i * 0.2, 1.4 + m.i * 0.2);
        const y0 = m.crutch ? m.y - 6 : m.y;
        m.a.set({ x: mx, y: y0, s: 0.95, flip: m.flip, o: seg(t, 0.28 + m.i * 0.08, 0.35 + m.i * 0.08) * (1 - healed), walk: bring > 0 && bring < 1 ? mx * 0.05 : undefined, lean: m.bent ? 16 : 0, armF: m.blind ? 60 : m.mother ? 70 : 40, head: m.bent ? 16 : m.blind ? -6 : 4, blink: m.blind ? 0 : blinkAt(time, m.i + 3) });
        m.b.set({ x: mx, y: m.y, s: 0.95, flip: m.flip, o: healed, armF: 50 + joy * 50, armB: 30 + joy * 110, head: -joy * 10, blink: blinkAt(time, m.i + 3) });
        if (m.kid) m.kid.set({ x: mx + (m.flip ? -34 : 34), y: m.y + 2, s: 0.55, flip: !m.flip, o: seg(t, 0.28 + m.i * 0.08, 0.35 + m.i * 0.08), armF: 20 + joy * 120, armB: joy * 140, head: -joy * 8, blink: blinkAt(time, 9) });
        const [hx, hy] = headAt(mx, m.y, 0.95, m.flip);
        pose(touchGlow[m.i], { x: hx, y: hy + 30, s: 1, o: es(t, 1.1 + m.i * 0.2, 1.2 + m.i * 0.2) * 0.8 * (1 - es(t, 2.9, 3.2) * 0.5) });
        const sp = bump(t, 1.12 + m.i * 0.2, 1.5 + m.i * 0.2);
        pose(heal[m.i], { x: hx, y: hy - 50, s: sp, r: time * 40, o: sp });
      });

      /* v41a: spirits come out of many, shrieking; v41b: He rebukes them and they are silenced */
      POS.forEach((p, i) => {
        const k = es(t, 0.2 + i * 0.1, 0.8 + i * 0.1);
        const px = p.x + (1 - k) * (p.flip ? 700 : -700);
        const free = es(t, 3.3 + i * 0.06, 3.4 + i * 0.06);
        const writhe = es(t, 2.05, 2.2) * (1 - free);
        p.p.set({ x: px + (time ? Math.sin(time * 14 + i) * 2 * writhe : 0), y: 700, s: 0.8, flip: p.flip, o: seg(t, 0.15, 0.25), walk: k > 0 && k < 1 ? px * 0.05 : undefined, armF: 30 + writhe * 60 + free * 40, armB: 20 + writhe * 120 + free * 100, head: 10 - writhe * 20 - free * 8, blink: blinkAt(time, i + 12) });
        const out = es(t, 2.05 + i * 0.08, 2.4 + i * 0.08);
        const gone = es(t, 3.25, 3.8);
        p.shards.forEach((sh) => {
          const ex = Math.cos(sh.a) * (out * 60 + gone * 160) * sh.drift, ey = Math.sin(sh.a) * out * 40 - out * 140 - gone * 420;
          pose(sh.el, { x: px + ex, y: 620 + ey, s: (0.7 + out * 0.4) * (1 - gone * 0.5), r: gone * 160 * (sh.i % 2 ? 1 : -1) + Math.sin(time * 5 + sh.i) * 4, o: out * 0.92 * (1 - gone) });
        });
        const cr = es(t, 2.12 + i * 0.1, 2.3 + i * 0.1, ease.back);
        const crumple = es(t, 3.1 + i * 0.05, 3.25 + i * 0.05);
        const bx = px + (p.flip ? -70 : 70), by = 420 - i * 30;
        pose(cries[i], { x: bx, y: by + Math.sin(time * 8 + i) * 2, s: cr * (1 - crumple), r: Math.sin(time * 6 + i) * 4 + crumple * 30, o: cr > 0.01 && crumple < 0.99 ? 1 : 0 });
        const fall = seg(t, 3.2 + i * 0.05, 3.8 + i * 0.05);
        pose(scraps[i], { x: bx + fall * 20, y: by + fall * fall * 280, r: fall * 300, o: fall > 0 && fall < 1 ? 1 - fall * 0.5 : 0 });
      });

      S.cam.z = 1.03 + es(t, 1.0, 1.5) * 0.06 - es(t, 2.0, 2.4) * 0.05;
      S.cam.y = 30 + es(t, 1.0, 1.5) * 30 - es(t, 2.0, 2.4) * 30;
    };
  },
};
