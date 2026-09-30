// J 1,9–13 — The true Light comes down into a town at night and lights every face; the world was made through
// Him, but the world does not know Him: people turn away. He comes to His own — and the doors close one by one.
// Yet two doors open again: lights kindle in the hands of those who receive Him; they are born of God.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, moon, stars, olive, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { NIGHT, wordFlame, glowDisc, rayBurst, threads, doorHouse, soulLight, hungPlate, crossOut, dropIcon, ringIcon, heart, radiance, hungGold, hand, headAt, tint, woman as womanOpts, man as manOpts, PI } from './lib.js';

const GY = 690;                  // the street (house fronts stand on it)
const PY = 752;                  // people's feet
const NIGHTC = '#2b3262';

export default {
  id: 'j1-world',
  beats: [
    { v: 9 },
    { v: 10, text: 'Na świecie było [Słowo], a świat stał się przez Nie,' },
    { v: 10, cont: true, text: 'lecz świat Go nie poznał.' },
    { v: 11, text: 'Przyszło do swojej własności,' },
    { v: 11, cont: true, text: 'a swoi Go nie przyjęli.' },
    { v: 12, text: 'Wszystkim tym jednak, którzy Je przyjęli, dało moc, aby się stali dziećmi Bożymi,' },
    { v: 12, cont: true, text: 'tym, którzy wierzą w imię Jego -' },
    { v: 13 },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [0.78, 1.1] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;           // phone: the four houses stand closer and the camera steps back, so the whole street is in view
    const sk = sky(S, NIGHT);
    const st = S.layer({ par: 0.02, sh: 1, flat: true });
    st.add(stars(c, { x0: -900, x1: 2500, y0: -600, y1: 420, n: 120 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const moonEl = hanging(hangL, moon(c, 36), { x: 1230, y: 150, len: 700 });

    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 520, amps: [18, 8, 3], lens: [1000, 360, 130], color: tint(C.hillMid, NIGHTC, 0.55) }).markup);
    const back = S.layer({ par: 0.14, sh: 3 });
    back.add(tint(olive(c, 240, 600, 0.8) + cypress(c, 720, 590, 130) + olive(c, 1300, 600, 0.9) + cypress(c, 1010, 588, 110), NIGHTC, 0.5));
    back.add(sheet().p(c.ridge(c.wave(600, [8, 3], [600, 180]), -900, 2500, 1700, 12, 1), tint(C.hillNear, NIGHTC, 0.5)).out());

    /* ---------- the houses of the town ---------- */
    const H = S.layer({ par: 0.3, sh: 4 });
    const HS = [
      { x: PT ? 350 : 300, w: 160, h: 130, wall: C.plaster },
      { x: PT ? 550 : 530, w: 150, h: 116, wall: mix(C.plaster, C.sand, 0.4) },
      { x: PT ? 860 : 870, w: 156, h: 124, wall: C.stone },
      { x: PT ? 1040 : 1090, w: 160, h: 134, wall: mix(C.plaster, C.peach, 0.3) },
    ].map((h, i) => {
      const d = doorHouse(c, { w: h.w, h: h.h, wall: tint(h.wall, NIGHTC, 0.3), shadow: tint(C.plaster2, NIGHTC, 0.4), roof: tint(C.roof, NIGHTC, 0.3) });
      H.add(`<g transform="translate(${h.x} ${GY})">${d.wall}</g>`);
      h.inside = H.add(`<g transform="translate(${h.x} ${GY})">${d.inside}</g>`);
      h.leaf = H.add(`<g>${tint(d.leaf, NIGHTC, 0.2)}</g>`);
      h.shut = H.add(`<g>${tint(d.shutter, NIGHTC, 0.2)}</g>`);
      h.d = d; h.i = i;
      h.doorX = h.x + d.door[0] + d.door[1] / 2;
      return h;
    });
    const road = S.layer({ par: 0.3, sh: 3 });
    road.add(sheet().p(c.ridge(c.wave(GY - 2, [2, 1], [500, 140]), -900, 2500, 1700, 12, 0.8), tint(C.sand2, NIGHTC, 0.35)).out());

    /* ---------- people of the world ---------- */
    const P = S.layer({ par: 0.3, sh: 4 });
    const WORLD = [
      { o: { ...manOpts(c), robe: C.plumRobe, mantle: C.ochre }, x: PT ? 520 : 470, flip: false },
      { o: womanOpts(c, { robe: C.tealRobe, veil: C.skyVeil }), x: 690, flip: false },
      { o: manOpts(c, { robe: C.clayMantle }), x: 980, flip: true },
      { o: { ...manOpts(c), robe: C.dustyBlue, hairStyle: 'bald', beard: 'full' }, x: PT ? 1100 : 1200, flip: true },
    ].map((w, i) => ({ ...w, i, p: S.puppet(P.add(person(c, { ...w.o, skin: tint(w.o.skin || C.skin, NIGHTC, 0.15) }))), glow: null }));
    // those who receive Him: an old man from the first house, a mother and child from the last
    const OLD = { robe: C.wheatRobe, mantle: C.sageRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin3 };
    const MOTHER = { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair, skin: C.skin2 };
    const CHILD = { robe: C.skyVeil, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin };
    const BEL = [
      { o: OLD, h: 0, x: PT ? 490 : 420, s: 0.95, flip: false },
      { o: MOTHER, h: 3, x: PT ? 1050 : 1080, s: 0.93, flip: true },
      { o: CHILD, h: 3, x: PT ? 975 : 1000, s: 0.62, flip: true },
    ].map((b, i) => ({ ...b, i, p: S.puppet(P.add(person(c, b.o))) }));

    /* ---------- the light ---------- */
    const LG = S.layer({ par: 0.3, sh: 1, flat: true });
    const faceGlows = WORLD.map(() => LG.add(`<g>${glowDisc(70, 'warm-glow', 0.8)}</g>`));
    const thr = threads(LG, 8, { color: C.sun, w: 2 });
    const aura = LG.add(`<g>${glowDisc(260, 'warm-glow', 1)}</g>`);
    const auraR = LG.add(`<g>${rayBurst(c, { n: 14, r0: 30, r1: 260, spread: 0.04, color: '#ffe7a8', o: 0.4 })}</g>`);
    const ring = LG.add(`<g><path d="${c.ribbon(c.arc(0, 0, 80, 26, 0, PI * 2, 40), 5)}" fill="#fff1c4"/></g>`);
    const fromAbove = LG.add(`<path d="${c.poly([[720, -700], [880, -700], [1120, PY + 10], [340, PY + 10]])}" fill="#fff1c4" opacity="0"/>`);
    const FL = S.layer({ par: 0.3, sh: 4 });
    const flameEl = FL.add(`<g>${wordFlame(c, 64)}</g>`);
    const lights = BEL.map((b) => FL.add(`<g>${soulLight(c, b.i === 2 ? 9 : 11)}</g>`));
    const halos = BEL.map(() => FL.add(`<g><path d="${c.ribbon(c.arc(0, 0, 16, 5, 0, PI * 2, 20), 3)}" fill="${C.haloRim}"/></g>`));

    /* ---------- plates from the flies (v13) and the Name (v12b) ---------- */
    const T = S.layer({ par: 0.2, sh: 6 });
    const PLATES = [
      { el: T.add(hungPlate(c, dropIcon(c, 20), { r: 50, rim: C.stone2 })), x: 520, lbl: tr('krew', 'blood') },
      { el: T.add(hungPlate(c, `<g transform="translate(0 4)">${heart(c, 24, C.jesusMantle)}</g>`, { r: 50, rim: C.stone2 })), x: 700, lbl: tr('ciało', 'flesh') },
      { el: T.add(hungPlate(c, ringIcon(c, 20), { r: 50, rim: C.stone2 })), x: 880, lbl: tr('mąż', 'man') },
    ].map((p, i) => ({ ...p, i, x: [540, 710, 880][i], cross: T.add(`<g>${crossOut(c, 30)}</g>`) }));
    const godL = T.add(`<g>${glowDisc(240, 'halo-glow', 1)}${radiance(c, 70)}</g>`);
    const nameEl = T.add(hungGold(c, tr('Jezus', 'Jesus'), { size: 28 }));

    return (t, time) => {
      pose(moonEl, { x: 1230, y: 150, r: Math.sin(time * 0.5) * 1 });
      const flick = time ? Math.sin(time * 7.3) * 0.04 : 0;

      /* v9: the true Light comes down into the world and lights every face */
      const down = es(t, 0.05, 0.5, ease.out);
      const wave = seg(t, 0.4, 0.95);
      /* v10a: He moves through the world that was made through Him */
      const drift = es(t, 1.05, 1.9);
      /* v11a: He comes to His own — to their doors; v11b the doors close */
      const toDoors = seg(t, 3.02, 3.9);
      /* v12a: two doors open again */
      let lx = 800, ly = lerp(-120, 560, down);
      lx += Math.sin(drift * PI * 2) * 180 * (1 - seg(t, 1.9, 2.2));
      const doorsAt = [HS[0].doorX, HS[1].doorX, HS[2].doorX, HS[3].doorX];
      if (t > 3) {
        const u = toDoors * 3;
        const k = Math.min(2, Math.floor(u)), f = ease.io(u - k);
        const order = [1, 2, 3, 0];
        const a = k === 0 ? [800, 560] : [doorsAt[order[k - 1]], 610];
        const b = [doorsAt[order[k]], 610];
        lx = lerp(a[0], b[0], f); ly = lerp(a[1], b[1], f) - Math.sin(f * PI) * 30;
        const back = es(t, 4.4, 4.9);
        lx = lerp(lx, 800, back); ly = lerp(ly, 560, back);
      }
      const bob = time ? Math.sin(time * 1.3) * 5 : 0;
      pose(flameEl, { x: lx, y: ly + 30 + bob, s: 0.9 + es(t, 5.05, 5.5) * 0.2, sx: (0.9 + es(t, 5.05, 5.5) * 0.2) * (1 + flick), o: down > 0.01 ? 1 : 0 });
      pose(aura, { x: lx, y: ly, s: down * (0.8 + es(t, 5.05, 5.5) * 0.5), o: down });
      pose(auraR, { x: lx, y: ly, s: down * 0.9, r: t * 6, o: down * 0.8 });
      pose(ring, { x: lx, y: PY - 10, s: 0.3 + wave * 9, o: (1 - wave) * 0.7 * (wave > 0 ? 1 : 0) });

      // threads to the things of the world (v10a)
      const tr1 = bump(t, 1.05, 1.95);
      [[1230, 150], [370, 570], [720, 480], [1010, 490], [HS[0].x + 60, GY - 130], [HS[2].x + 70, GY - 124], [HS[3].x + 90, GY - 134], [240, 520]].forEach(([x, y], i) => thr(i, lx, ly - 30, x, y, tr1 * 0.75));

      /* the people of the world: lit (v9), then they turn away and go (v10b) */
      WORLD.forEach((w, i) => {
        const litK = seg(t, 0.4 + Math.abs(w.x - 800) / 1400, 0.55 + Math.abs(w.x - 800) / 1400);
        const turn = es(t, 2.05 + i * 0.06, 2.2 + i * 0.06);
        const go = es(t, 2.3, 2.95);
        const dir = w.x < 800 ? -1 : 1;
        const x = w.x + dir * go * 700;
        w.p.set({ x, y: PY, s: 0.9, flip: turn > 0.5 ? dir < 0 : w.flip, o: 1 - es(t, 2.85, 2.95), walk: go > 0 && go < 1 ? x * 0.05 : undefined, head: turn > 0.5 ? 10 : -litK * 8, armF: (i === 0 ? 40 : 10), blink: blinkAt(time, i) });
        const [hx, hy] = headAt(x, PY, 0.9, false);
        pose(faceGlows[i], { x: hx, y: hy, s: litK * (1 - es(t, 2.05, 2.3)), o: litK * (1 - es(t, 2.05, 2.3)) });
      });

      /* doors and shutters: open, lit — then they close (v11b) — two open again (v12a) */
      HS.forEach((h, i) => {
        const close = es(t, 4.05 + i * 0.12, 4.2 + i * 0.12, ease.in);
        const reopen = (i === 0 || i === 3) ? es(t, 5.05 + (i === 3 ? 0.1 : 0), 5.3 + (i === 3 ? 0.1 : 0)) : 0;
        const shut = close * (1 - reopen);
        pose(h.leaf, { x: h.x + h.d.door[0], y: GY, sx: 0.12 + shut * 0.88, o: 1 });
        pose(h.shut, { x: h.x + h.d.win[0], y: GY + h.d.win[1], sx: 0.1 + close * 0.9 * (1 - reopen), o: 1 });
        fade(h.inside, 1 - close * (1 - reopen));
      });

      /* those who receive Him step out; lights kindle in their hands (v12a); they lift them (v12b) */
      BEL.forEach((b) => {
        const out = es(t, 5.2 + b.i * 0.1, 5.6 + b.i * 0.1);
        const hx0 = HS[b.h].doorX;
        const x = lerp(hx0, b.x, out);
        const lift = es(t, 6.05, 6.4);
        const kneel = 0;
        const born = es(t, 7.5, 7.85);
        b.p.set({ x, y: PY - (1 - out) * 50, s: b.s * (0.7 + out * 0.3), flip: b.flip, o: seg(t, 5.18 + b.i * 0.1, 5.24 + b.i * 0.1), walk: out > 0 && out < 1 ? x * 0.06 : undefined, armF: out * 60 + lift * 50, armB: lift * 40, head: -10 - lift * 10, blink: blinkAt(time, 4 + b.i) });
        const [px, py] = hand(x, PY, b.s, b.flip, out * 60 + lift * 50);
        const kin = es(t, 5.5 + b.i * 0.1, 5.8 + b.i * 0.1, ease.back);
        pose(lights[b.i], { x: px + (b.flip ? -4 : 4), y: py - 12, s: kin * (1 + born * 0.2), o: kin });
        const [hx, hy] = headAt(x, PY, b.s, b.flip);
        pose(halos[b.i], { x: hx, y: hy - 26 * b.s, s: b.s * born, o: born });
      });

      /* v12b: the Name */
      const nm = es(t, 6.1, 6.45, ease.out) * (1 - es(t, 7.0, 7.3, ease.in));
      pose(nameEl, { x: 800, y: lerp(-600, 430, nm), r: Math.sin(t * 3.2) * 1.4, o: nm > 0.01 ? 1 : 0 });

      /* v13: not of blood, nor of flesh, nor of a man's will — each plate is crossed out; born of God */
      PLATES.forEach((p) => {
        const a = 7.02 + p.i * 0.16;
        const dn = es(t, a, a + 0.18, ease.out), cr = es(t, a + 0.16, a + 0.26, ease.back), up = es(t, 7.55, 7.8, ease.in);
        const y = lerp(-500, 250, dn) - up * 800;
        pose(p.el, { x: p.x, y, r: Math.sin(t * 3.6 + p.i) * 1.5, o: dn > 0.01 ? 1 : 0 });
        pose(p.cross, { x: p.x, y, s: cr, o: cr > 0.01 ? 1 : 0 });
      });
      const born = es(t, 7.5, 7.85);
      pose(godL, { x: 800, y: lerp(-300, 180, born), s: 1, o: born });
      pose(fromAbove, { o: born * 0.35 });

      S.cam.y = -30 * (1 - down) + es(t, 6.9, 7.3) * -40;
      S.cam.z = (1.02 + es(t, 3.0, 3.4) * 0.04 - es(t, 4.9, 5.3) * 0.04 - es(t, 6.9, 7.3) * 0.03) * (PT ? 0.8 : 1);
    };
  },
};
