// Łk 6,39–40 — a parable, a painted flat of a road at dusk, the ground cut away like a stage trap so that we see the
// pit dug in the road. "Can a blind man lead a blind man?": a blind man with a band over his eyes goes first, tapping
// with his stick, and another holds on to his shoulder. "Will they not both fall into a pit?": the leader steps over
// the edge and drops, and the other after him — a puff of dust, the stick spinning away, and the two sit in a heap at
// the bottom. "A disciple is not above his teacher": from the other side a teacher comes along the road with a lamp,
// his small pupil a step behind him; the lamp shows the edge of the pit and they stop. "But everyone fully trained will
// be like his teacher": the pupil grows to the teacher's height, takes the same mantle and lights his own lamp from the
// teacher's — and the two stand side by side with their lamps over the pit.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, moon, cloud, bush, rock, grass } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { addToHead } from '../mark2/lib.js';
import { blindBand, stick, BLIND, TRUE_P, heldLamp, dust, sparkle, kfl, DUSK6, storyFrame, halo, PI } from './lib.js';

const GY = 580;
const PIT = { x0: 660, x1: 860, bot: 716 };
const PX = (PIT.x0 + PIT.x1) / 2;
const GUIDE = { robe: C.ochreRobe, mantle: mix(C.clay, C.stone2, 0.3), hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin3, belt: C.leather };
const PUPIL = { robe: C.sageRobe, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin, belt: C.rope };
const PUPIL2 = { ...PUPIL, mantle: TRUE_P.mantle, beard: 'short', beardColor: C.hair2 };

export default {
  id: 'lk6-blind',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 39, text: 'Opowiedział im też przypowieść: «Czy może niewidomy prowadzić niewidomego?' },
    { v: 39, cont: true, text: 'Czy nie wpadną w dół obydwaj?' },
    { v: 40, text: 'Uczeń nie przewyższa nauczyciela.' },
    { v: 40, cont: true, text: 'Lecz każdy, dopiero w pełni wykształcony, będzie jak jego nauczyciel.' },
  ],
  cam: { x: [-40, 60], y: [-20, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, DUSK6);
    const eve = sky(S, ['#3c3f74', '#8a7aa0', '#d89f8c'], { name: 'eve', rise: 0 }).layer;
    eve.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 380, y: 300, len: 900 });
    const moonEl = hanging(hangL, `${halo(90, 0.4)}${moon(c, 24)}`, { x: 1180, y: -300, len: 900 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 380, amps: [24, 10, 3], lens: [1100, 380, 130], color: mix(C.hillFar, C.duskViolet, 0.35) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    const h2 = hillsWith(c, { y: 470, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.25), trees: 12, treeColor: mix(C.olive, C.duskViolet, 0.2), treeH: 20 });
    mid.add(h2.markup + rock(c, 1240, h2.fn(1240) + 10, 80, 30, C.rock2));

    /* the road, and the earth cut away beneath it with the pit */
    const G = S.layer({ par: 0.45, sh: 3 });
    const road = sheet();
    road.p(c.cut([[-900, GY - 22], [PIT.x0 + 4, GY - 22], [PIT.x0, GY + 14], [-900, GY + 14]], 0.8, 16) + c.cut([[PIT.x1 - 4, GY - 24], [2500, GY - 26], [2500, GY + 14], [PIT.x1, GY + 14]], 0.8, 16), mix(C.sand2, C.dune, 0.3));
    G.add(road.out() + grass(c, { x0: -700, x1: 2300, y: GY - 22, n: 40, h: 12, color: C.olive }));
    const earth = sheet();
    const EC = mix(C.soil, C.clay, 0.5);
    const pitPts = [[PIT.x0, GY - 20], [PIT.x0 + 8, PIT.bot - 30], [PIT.x0 + 30, PIT.bot], [PIT.x1 - 30, PIT.bot], [PIT.x1 - 8, PIT.bot - 30], [PIT.x1, GY - 20]];
    earth.p(c.cut([[-900, GY + 8], [2500, GY + 8], [2500, 1700], [-900, 1700]], 1, 20) + c.hole(pitPts.map(([x, y]) => [x, Math.max(y, GY + 10)]), 1.2, 8), EC);
    let strata = '', stones = '';
    for (let i = 0; i < 5; i++) strata += c.ribbon([[-900, GY + 40 + i * 44], [PIT.x0 - 4, GY + 40 + i * 44 + c.rr(-6, 6)]], 3) + c.ribbon([[PIT.x1 + 4, GY + 40 + i * 44 + c.rr(-6, 6)], [2500, GY + 40 + i * 44]], 3);
    for (let i = 0; i < 40; i++) { const x = c.rr(-700, 2300); if (x > PIT.x0 - 20 && x < PIT.x1 + 20) continue; stones += c.cut(c.blob(x, c.rr(GY + 30, 900), c.rr(6, 14), c.rr(4, 8), 8, 0.2), 0.3, 4); }
    earth.x(strata, shade(EC, -0.12), 'opacity=".6"');
    earth.p(stones, mix(C.rock2, EC, 0.4));
    G.add(earth.out());
    G.add(sheet().p(c.cut(pitPts, 1, 8), mix(C.soilDark, C.night2, 0.25)).out());
    const dusk = S.layer({ par: 0.45, sh: 1, flat: true });
    dusk.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2c2a55"/>`);
    dusk.fade(0);

    /* the lamps' light on the road (behind the people) */
    const lampGlow = S.layer({ par: 0.45, sh: 1, flat: true });
    const pool = lampGlow.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="170" ry="60" fill="url(#warm-glow)"/></g>`);

    /* the blind two */
    const L = S.layer({ par: 0.45, sh: 5 });
    const guide = S.puppet(L.add(addToHead(person(c, { ...GUIDE, eyes: 'closed', holdF: stick(c, 160) }), blindBand(c))));
    const b1 = S.puppet(L.add(addToHead(person(c, { ...BLIND, eyes: 'closed' }), blindBand(c))));
    const guideSit = S.puppet(L.add(addToHead(person(c, { ...GUIDE, eyes: 'closed', pose: 'sit' }), blindBand(c))));
    const b1Sit = S.puppet(L.add(addToHead(person(c, { ...BLIND, eyes: 'closed', pose: 'sit' }), blindBand(c))));
    /* the teacher and his pupil */
    const lamp = `<g transform="translate(-2 -2) scale(1.2)">${heldLamp(c)}</g>`;
    const teacher = S.puppet(L.add(person(c, { ...TRUE_P, holdF: lamp })));
    const pupil = S.puppet(L.add(person(c, PUPIL)));
    const pupil2 = S.puppet(L.add(person(c, { ...PUPIL2, holdF: lamp })));
    const fx = S.layer({ par: 0.45, sh: 5 });
    const puff = fx.add(`<g>${dust(c, 34, C.sand2)}</g>`);
    const puff2 = fx.add(`<g>${dust(c, 26, C.sand)}</g>`);
    const spin = fx.add(`<g>${stick(c, 130)}</g>`);
    const stars = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 9, i % 2 ? C.star : C.halo)}</g>`) }));
    const kindle = fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`);
    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 1420, 900, 220, C.sage, C.moss) + bush(c, 120, 900, 230, C.moss, C.sage));
    storyFrame(S);

    return (t, time) => {
      const T = time;
      const night = es(t, 1.6, 2.4);
      eve.fade(night);
      dusk.fade(night * 0.3);
      swing(sunEl, 380, lerp(300, 700, es(t, 0, 2.2)), T, 1, 0.6);
      swing(moonEl, 1180, lerp(-300, 150, es(t, 1.8, 2.8)), T, 0.8, 0.5, 1);

      /* v39a — the blind leading the blind */
      const tap = Math.max(0, Math.sin(t * 22));
      const GX = kfl(t, [[-0.4, 140], [0.95, 668]]);
      const f1 = seg(t, 1.05, 1.22);
      guide.set({ x: GX + f1 * 50, y: GY + ease.in(f1) * 150, s: 0.92, r: f1 * 35, walk: t < 1.05 ? GX * 0.05 : undefined, amt: 0.8, armF: 40 + tap * 10 + f1 * 90, armB: 20 + f1 * 140, head: -12 + f1 * 20, o: 1 - seg(t, 1.18, 1.22), blink: 0 });
      const X1 = kfl(t, [[-0.4, 50], [0.95, 578], [1.2, 650]]);
      const f2 = seg(t, 1.2, 1.36);
      b1.set({ x: X1 + f2 * 60, y: GY + 6 + ease.in(f2) * 140, s: 0.9, r: f2 * 40, walk: t < 1.2 ? X1 * 0.05 + 1 : undefined, amt: 0.7, armF: 70 + f2 * 60, armB: 10 + f2 * 150, head: 6 - f2 * 10, lean: 6, o: 1 - seg(t, 1.32, 1.36), blink: 0 });

      /* v39b — both in the pit */
      const g = es(t, 1.18, 1.22), b = es(t, 1.32, 1.36);
      const daze = Math.sin(t * 14);
      guideSit.set({ x: PX - 52, y: PIT.bot - 2, s: 0.86, r: -6, armF: 60 + daze * 10, armB: 130, head: 14 + daze * 6, lean: -6, o: g, blink: 0 });
      b1Sit.set({ x: PX + 56, y: PIT.bot + 2, s: 0.84, flip: true, r: 8, armF: 40, armB: 150 - daze * 10, head: 18 - daze * 6, lean: 10, o: b, blink: 0 });
      const pk = seg(t, 1.18, 1.6);
      pose(puff, { x: PX - 10, y: GY - 10 - pk * 40, s: 0.5 + pk * 1.1, o: Math.sin(pk * PI) * 0.95 });
      const pk2 = seg(t, 1.32, 1.75);
      pose(puff2, { x: PX + 50, y: GY - 6 - pk2 * 30, s: 0.5 + pk2, o: Math.sin(pk2 * PI) * 0.9 });
      const sk = seg(t, 1.16, 1.52);
      pose(spin, { x: PX + 60 + sk * 140, y: GY - 60 - Math.sin(sk * PI) * 160 + sk * 70, r: sk * 540, o: sk > 0 && sk < 1 ? 1 : 0 });
      stars.forEach((st) => {
        const who = st.i < 3 ? [PX - 50, PIT.bot - 116] : [PX + 52, PIT.bot - 114];
        const a = (T ? T * 2.2 : 0) + (st.i % 3) * (PI * 2 / 3);
        const on = es(t, st.i < 3 ? 1.3 : 1.42, st.i < 3 ? 1.4 : 1.52) * (1 - es(t, 2.9, 3.2) * 0.6);
        pose(st.el, { x: who[0] + Math.cos(a) * 26, y: who[1] + Math.sin(a) * 8, s: 0.8, o: on });
      });

      /* v40a — the teacher with his lamp, the pupil behind him; v40b — the pupil like his teacher */
      const TX = kfl(t, [[1.8, 1500], [2.45, 1010]]);
      const walkT = t > 1.8 && t < 2.45;
      teacher.set({ x: TX, y: GY, s: 0.98, flip: true, walk: walkT ? TX * 0.05 : undefined, armF: 70 + bump(t, 2.45, 2.9) * 20, armB: 10 + bump(t, 2.5, 2.95) * 50, head: 8, o: t > 1.75 ? 1 : 0, blink: blinkAt(T, 3) });
      const PXp = kfl(t, [[1.9, 1620], [2.55, 1110]]);
      const grow = es(t, 3.05, 3.4);
      const become = es(t, 3.3, 3.36);
      const side = es(t, 3.2, 3.6);
      const px = lerp(PXp, 1086, side);
      const ps = lerp(0.72, 0.98, grow);
      pupil.set({ x: px, y: GY, s: ps, flip: true, walk: (t > 1.9 && t < 2.55) || (side > 0 && side < 1) ? px * 0.06 : undefined, armF: 20 + bump(t, 2.55, 2.95) * 30, armB: 10, head: -6, o: (t > 1.85 ? 1 : 0) * (1 - become), blink: blinkAt(T, 6) });
      pupil2.set({ x: px, y: GY, s: ps, flip: true, armF: 70, armB: 10, head: 8, o: become, blink: blinkAt(T, 6) });
      pose(pool, { x: 1000, y: GY + 4, s: 1 + side * 0.3, o: es(t, 2.3, 2.6) * (0.5 + night * 0.5) });
      pose(kindle, { x: 1060, y: GY - 150, s: bump(t, 3.3, 3.7), r: T * 40, o: bump(t, 3.3, 3.7) });

      S.cam.x = kfl(t, [[-0.5, -30], [1.0, 0], [1.6, 0], [2.4, 50], [3.9, 50]]);
      S.cam.z = 1.03 + es(t, 0.9, 1.3) * 0.05 - es(t, 1.8, 2.3) * 0.02;
      S.cam.y = 10 + es(t, 0.9, 1.3) * 30;
    };
  },
};
