// Mk 1,32–34 — sunset over Capernaum: the sun sinks on its string, lamps are lit, and the whole town brings
// its sick to Simon's door: a man on a mat, a man on a crutch, a blind man led by a child, two tormented by shadows.
// Jesus heals them — the crutch flies, the mat is empty, eyes open — the shadows are driven off, and when they try
// to speak He silences them.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, sun, moon, stars, house } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { houseFacade, crutch, mat, handLamp, shadowShards, bubble, headAt, sparkle } from './lib.js';

const PI = Math.PI;
const P = 0.45;
const DOOR = 800;
const SICK = { robe: C.stone, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin3 };

export default {
  id: 'm1-evening',
  beats: [
    { v: 32, text: 'Z nastaniem wieczora, gdy słońce zaszło,' },
    { v: 32, cont: true, text: 'przynosili do Niego wszystkich chorych i opętanych;' },
    { v: 33 },
    { v: 34, text: 'Uzdrowił wielu dotkniętych rozmaitymi chorobami' },
    { v: 34, cont: true, text: 'i wiele złych duchów wyrzucił,' },
    { v: 34, cont: true, text: 'lecz nie pozwalał złym duchom mówić, ponieważ wiedziały, kim On jest.' },
  ],
  cam: { x: [-20, 20], y: [0, 70], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the gathered town stands closer to the door, inside the screen
    sky(S, ['#8f86ad', '#e3a58e', '#f3c79e']);
    const night = sky(S, [C.night2, '#39407a', '#6a5f8e'], { name: 'night' }).layer;
    night.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 110 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 490, y: 260, len: 900 });
    const moonEl = hanging(hangL, `<circle r="100" fill="url(#halo-glow)" opacity=".4"/>${moon(c, 32)}`, { x: 1250, y: -200, len: 900 });

    /* ---------- the lake and the town ---------- */
    const far = S.layer({ par: 0.1, sh: 2 });
    far.add(band(c, { y: 470, amps: [12, 6, 2], lens: [1000, 330, 120], color: '#b9a7b4' }).markup + waterBand(c, { y: 505, color: '#9fb7bf', foamN: 10 }).markup);
    // the same houses twice — once in daylight, once with lit windows — crossfaded on the compositor
    const townPair = (seed, x, y, n, spread, sc) => {
      const r = makeCutter(seed);
      const spec = Array.from({ length: n }, (_, i) => ({ x: r.rr(x - spread / 2, x + spread / 2), w: r.rr(40, 70) * sc, h: r.rr(30, 50) * sc, dy: r.rr(0, 30) * sc, st: r.chance(0.5), lit: r.chance(0.65), i })).sort((a, b) => a.x - b.x);
      const draw = (lit) => spec.map((h, i) => house(makeCutter(seed + i), h.x, y - h.dy - (i % 2) * 8 * sc, h.w, h.h, { stairs: h.st, lit: lit && h.lit })).join('');
      return [draw(false), draw(true)];
    };
    const tl = townPair('m1-ev-l', 260, 560, 7, 380, 0.8), tr2 = townPair('m1-ev-r', 1350, 565, 6, 360, 0.8);
    S.layer({ par: 0.2, sh: 3 }).add(tl[0] + tr2[0]);
    const townLit = S.layer({ par: 0.2, sh: 3 });
    townLit.add(tl[1] + tr2[1]);
    townLit.fade(0);
    const H = S.layer({ par: 0.3, sh: 4 });
    H.add(`<g transform="translate(${DOOR - 950} 0)">${houseFacade(S, { withSky: false })}</g>`);
    const winLit = H.add(`<g opacity="0"><circle cx="${790 - 150}" cy="443" r="60" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(760 - 150, 420, 60, 46))}" fill="${C.lampFlame}"/></g>`);
    const doorLit = H.add(`<g opacity="0"><ellipse cx="${DOOR}" cy="600" rx="130" ry="150" fill="url(#warm-glow)"/><path d="${c.poly([[DOOR - 48, 660], [DOOR - 48, 500], ...c.arc(DOOR, 500, 48, 42, PI, 2 * PI, 10), [DOOR + 48, 660]])}" fill="#f7d58e"/></g>`);
    const dusk = S.layer({ par: 0.3, sh: 1, flat: true });
    dusk.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2c2a55"/>`);
    dusk.fade(0);

    /* ---------- the crowd, the sick, Jesus ---------- */
    const L = S.layer({ par: P, sh: 4 });
    const backRow = crowd(S, L, [{ y: 690, s: 0.7, n: 12, x0: 330, x1: 1270 }], {}).filter((m) => Math.abs(m.x - DOOR) > 110);
    if (PH) backRow.forEach((m) => { const d = Math.abs(m.x - DOOR); m.x = DOOR + Math.sign(m.x - DOOR) * (100 + (d - 110) * 0.45); });
    backRow.forEach((m, i) => { m.side = m.x < DOOR ? -1 : 1; m.d = c.rr(0, 0.5); m.lamp = i % 3 === 0; });
    const lamps = backRow.filter((m) => m.lamp).map((m) => ({ m, el: L.add(`<g opacity="0">${handLamp(c)}</g>`) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const hush = L.add(`<g opacity="0">${bubble(tr('Milczcie!', 'Be silent!'), { size: 22, fill: C.halo, ink: C.ink })}</g>`);

    // the sick
    const carriers = [{ robe: C.sageRobe, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin2 }, { robe: C.ochreRobe, hairStyle: 'short', hair: C.hair3, beard: 'short', skin: C.skin4, belt: C.leather }].map((o) => S.puppet(L.add(person(c, o))));
    const matEl = L.add(`<g>${mat(c, 190)}</g>`);
    const lying = S.puppet(L.add(person(c, { ...SICK, eyes: 'closed' })));
    const risen = S.puppet(L.add(person(c, { ...SICK })));
    const crutchMan = S.puppet(L.add(person(c, { robe: C.tealRobe, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair, skin: C.skin2, holdF: `<g data-k="crutchH" transform="translate(0 -4)">${crutch(c)}</g>` })));
    const crutchH = S.$('crutchH');
    const crutchFree = L.add(`<g opacity="0">${crutch(c)}</g>`);
    const BLIND = { robe: C.mauve, hairStyle: 'wrap', veil: C.stone, hair: C.hair, beard: 'short', skin: C.skin3 };
    const blind = S.puppet(L.add(person(c, { ...BLIND, eyes: 'closed' })));
    const seeing = S.puppet(L.add(person(c, BLIND)));
    const child = S.puppet(L.add(person(c, { robe: C.roseRobe, hairStyle: 'short', hair: C.hair2, skin: C.skin })));
    const poss = [{ x: 560, y: 730, flip: false, o: { robe: C.plumRobe, hairStyle: 'wild', hair: C.hair3, beard: 'short', skin: C.skin4 } }, { x: PH ? 1030 : 1060, y: 734, flip: true, o: { robe: C.clayMantle, hairStyle: 'wild', hair: C.hair, beard: 'none', skin: C.skin } }]
      .map((pp, i) => ({ ...pp, i, p: S.puppet(L.add(person(c, pp.o))), shards: shadowShards(c, { n: 7, r: 62 }).map((sh) => ({ ...sh, el: L.add(`<g opacity="0">${sh.m}</g>`), drift: c.rr(0.7, 1.2) })), talk: L.add(`<g opacity="0">${bubble('!?', { size: 22, w: 48, jag: true, c, fill: '#3a3048', ink: C.cream })}</g>`) }));
    const bursts = [0, 1, 2, 3, 4].map(() => L.add(`<g opacity="0"><circle r="80" fill="url(#halo-glow)"/>${rays(c, { n: 10, r0: 20, r1: 90, spread: 0.08, color: '#fff3cf' })}</g>`));
    const eyesSpark = L.add(`<g opacity="0">${sparkle(c, 14)}</g>`);
    const frontRow = crowd(S, L, [{ y: 812, s: 0.95, n: 3, x0: 280, x1: 560 }, { y: 814, s: 0.95, n: 3, x0: 1050, x1: 1330 }]);
    if (PH) frontRow.forEach((m) => { m.x = m.x < DOOR ? 478 + (m.x - 280) * 0.34 : 990 + (m.x - 1050) * 0.25; });
    frontRow.forEach((m) => { m.side = m.x < DOOR ? -1 : 1; m.d = c.rr(0, 0.4); });

    return (t, time) => {
      /* v32a: evening — the sun goes down, lamps are lit */
      const set = es(t, 0.05, 0.9);
      swing(sunEl, 490, lerp(260, 580, set), time, 0.8, 0.5);
      const nightK = es(t, 0.5, 1.6);
      night.fade(nightK);
      starL.fade(es(t, 1.0, 1.8));
      dusk.fade(nightK * 0.3);
      swing(moonEl, 1250, lerp(-300, 130, es(t, 1.3, 2.3)), time, 0.8, 0.5, 1);
      townLit.fade(es(t, 0.7, 1.2));
      fade(winLit, es(t, 0.8, 1.1));
      fade(doorLit, es(t, 1.7, 2.1));

      /* v32b/v33: they bring the sick, the whole town gathers at the door */
      backRow.forEach((m) => {
        const k = es(t, 1.9 + m.d, 2.5 + m.d);
        const x = m.x + (1 - k) * m.side * 700;
        const cheer = es(t, 3.2, 3.5) * (m.i % 2);
        m.p.set({ x, y: m.y, s: m.s, flip: m.side > 0, o: seg(t, 1.85 + m.d, 1.95 + m.d), walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: m.lamp ? 60 : 10 + cheer * 50, armB: cheer * 100, head: -es(t, 3.0, 3.3) * 4, blink: blinkAt(time, m.seed) });
      });
      lamps.forEach((l) => {
        const k = es(t, 1.9 + l.m.d, 2.5 + l.m.d);
        const x = l.m.x + (1 - k) * l.m.side * 700;
        const hx = x + (l.m.side > 0 ? -1 : 1) * 56 * l.m.s, hy = l.m.y - 148 * l.m.s;
        pose(l.el, { x: hx, y: hy, s: l.m.s * 1.2, o: seg(t, 1.9 + l.m.d, 2.0 + l.m.d) * (0.9 + Math.sin(time * 9 + l.m.i) * 0.08) });
      });
      frontRow.forEach((m) => {
        const k = es(t, 2.0 + m.d, 2.6 + m.d);
        const x = m.x + (1 - k) * m.side * 600;
        m.p.set({ x, y: m.y, s: m.s, flip: m.side > 0, o: seg(t, 1.95 + m.d, 2.05 + m.d), walk: k > 0 && k < 1 ? x * 0.06 : undefined, armF: es(t, 3.3, 3.6) * 40, armB: es(t, 4.3, 4.6) * (m.i % 2 ? 120 : 0), blink: blinkAt(time, m.seed) });
      });

      // the man on the mat, carried in from the left and laid before the door
      const carry = es(t, 1.05, 1.75), lay = es(t, 1.75, 1.95);
      const mx = lerp(-200, DOOR - 50, carry), my = lerp(640, 772, lay);
      const walkC = carry > 0 && carry < 1;
      carriers.forEach((cp, i) => {
        const cx = mx + (i ? 118 : -118) + lay * (i ? 60 : -60);
        cp.set({ x: cx, y: 800 + i * 4, s: 0.95, flip: i === 1 && lay > 0.5, o: 1 - es(t, 2.2, 2.5), walk: walkC ? cx * 0.06 : undefined, armF: 70 - lay * 40, armB: 60 - lay * 40, blink: blinkAt(time, i + 2) });
      });
      const rise = es(t, 3.15, 3.22);
      pose(matEl, { x: mx, y: my, o: 1 });
      lying.set({ x: mx + 95, y: my - 34, s: 0.84, r: -90, o: 1 - rise });
      const joy = es(t, 3.25, 3.5);
      risen.set({ x: mx - 70, y: 780, s: 0.95, o: rise, armF: 40 + joy * 50, armB: 20 + joy * 130, head: -joy * 8, blink: blinkAt(time, 6) });
      // the crutch and the blind man walk in from the right and left
      const cIn = es(t, 1.2, 1.85);
      const cmx = lerp(-120, 650, cIn);
      const drop = es(t, 3.4, 3.46);
      const hop = bump(t, 3.45, 3.75);
      crutchMan.set({ x: cmx, y: 770 - hop * 18, s: 0.95, flip: false, walk: cIn > 0 && cIn < 1 ? cmx * 0.04 : undefined, amt: 0.5, lean: 8 * (1 - drop), armF: 40 * (1 - drop) + drop * 60, armB: drop * 150, head: -drop * 8, blink: blinkAt(time, 8) });
      fade(crutchH, 1 - drop);
      const fl = seg(t, 3.42, 3.95);
      pose(crutchFree, { x: cmx + 60 + fl * 120, y: 640 - Math.sin(fl * PI) * 170 + fl * 120, r: fl * 400, o: drop > 0 ? 1 - es(t, 3.9, 4.0) * 0.2 : 0 });
      const bIn = es(t, 1.3, 1.95);
      const bx = lerp(1720, 975, bIn);
      const see = es(t, 3.62, 3.68);
      const bArm = es(t, 3.7, 3.95);
      blind.set({ x: bx, y: 772, s: 0.95, flip: true, o: 1 - see, walk: bIn > 0 && bIn < 1 ? bx * 0.05 : undefined, armF: 50, head: 6, blink: 0 });
      seeing.set({ x: bx, y: 772, s: 0.95, flip: true, o: see, armF: 40 + bArm * 50, armB: bArm * 120, head: -bArm * 10, blink: blinkAt(time, 9) });
      child.set({ x: bx + 70, y: 780, s: 0.6, flip: true, walk: bIn > 0 && bIn < 1 ? bx * 0.06 : undefined, armF: 70, armB: es(t, 3.7, 3.9) * 140, blink: blinkAt(time, 10) });
      const [ex, ey] = headAt(bx, 772, 0.95, true);
      const sp = bump(t, 3.62, 4.2);
      pose(eyesSpark, { x: ex - 14, y: ey - 12, s: sp * 1.4, r: time * 60, o: sp });

      /* Jesus steps out of the lit door and heals */
      const out = es(t, 2.0, 2.4);
      const heal = es(t, 3.0, 3.25) * (1 - es(t, 3.9, 4.1));
      const cast = es(t, 4.05, 4.3) * (1 - es(t, 4.85, 5.05));
      const silence = es(t, 5.1, 5.3);
      jesus.set({ x: DOOR, y: lerp(664, 712, out), s: lerp(0.9, 1.0, out), o: es(t, 1.8, 2.0), walk: out > 0 && out < 1 ? out * 20 : undefined, armF: 14 + heal * 70 + cast * 80 + silence * 20, armB: 10 + heal * 50 + cast * 120 + silence * 150, head: -heal * 4, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(DOOR, 712, 1.0);
      const hs = es(t, 5.2, 5.35, ease.back) * (1 - es(t, 5.85, 5.95));
      pose(hush, { x: jhx + 70, y: jhy - 80, s: hs, o: hs > 0 ? 1 : 0 });
      const BURST = [[mx - 70, 630, 3.2], [650, 600, 3.42], [975, 600, 3.64], [560, 590, 4.1], [PH ? 1030 : 1060, 594, 4.2]];
      bursts.forEach((b, i) => { const k = bump(t, BURST[i][2], BURST[i][2] + 0.5); pose(b, { x: BURST[i][0], y: BURST[i][1], s: 0.4 + k * 0.9, r: time * 20, o: k * 0.9 }); });

      /* v34b/c: the shadows are driven out; they try to speak and are silenced */
      poss.forEach((pp) => {
        const k = es(t, 1.4 + pp.i * 0.1, 2.0 + pp.i * 0.1);
        const px = pp.x + (1 - k) * (pp.flip ? 700 : -700);
        const free = es(t, 4.1 + pp.i * 0.1, 4.2 + pp.i * 0.1);
        const tremble = (1 - free) * Math.sin(time * 14 + pp.i) * 2;
        pp.p.set({ x: px + tremble, y: pp.y, s: 0.92, flip: pp.flip, o: seg(t, 1.35, 1.45), walk: k > 0 && k < 1 ? px * 0.05 : undefined, armF: 30 + free * 40, armB: 20 + free * 120, head: 10 - free * 18, blink: blinkAt(time, pp.i + 12) });
        const tear = es(t, 4.1 + pp.i * 0.1, 4.6 + pp.i * 0.1);
        const flee = es(t, 5.5, 5.9);
        const [hx0, hy0] = headAt(px, pp.y, 0.92, pp.flip);
        pp.shards.forEach((sh) => {
          const ex2 = Math.cos(sh.a) * tear * 120 * sh.drift + (pp.flip ? 1 : -1) * tear * 60, ey2 = Math.sin(sh.a) * tear * 80 - tear * 260 - flee * 500;
          pose(sh.el, { x: px + tremble + ex2, y: pp.y - 100 + ey2, s: (1 - tear * 0.4) * (1 + Math.sin(time * 6 + sh.i) * 0.05), r: tear * 120 * (sh.i % 2 ? 1 : -1), o: seg(t, 1.4, 1.6) * 0.9 * (1 - flee) });
        });
        const talk = es(t, 5.05 + pp.i * 0.08, 5.2 + pp.i * 0.08, ease.back) * (1 - es(t, 5.35, 5.5));
        pose(pp.talk, { x: px + (pp.flip ? 1 : -1) * 60, y: pp.y - 360, s: talk, r: Math.sin(time * 8) * 6, o: talk > 0 ? 1 : 0 });
      });

      S.cam.z = 1.03 + es(t, 2.0, 2.6) * 0.06 + es(t, 3.0, 3.4) * 0.03;
      S.cam.y = 30 + es(t, 2.0, 2.6) * 30;
    };
  },
};
