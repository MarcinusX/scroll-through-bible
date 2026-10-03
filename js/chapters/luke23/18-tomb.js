// Łk 23,53–55 — the burial at dusk (Mark 15's garden and tomb in the rock). Far off on the hill two small shadows
// take Him down: a white shape is lowered and the cross stands empty. In front, Joseph wraps the body in linen: the
// roll of white cloth unwinds and the still form on the litter is covered. They carry Him into the tomb cut in the
// rock — new, where no one had yet been laid — and a faint light stays inside. It is the Day of Preparation and the
// Sabbath is beginning: a little card with two Sabbath candles comes down and they are lit, lamps kindle in the
// city's windows, the first star comes out. The women who had come with Him from Galilee follow, and stand at the
// door and see the tomb, and how His body was laid.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, grass, stars, town } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tombStone } from '../mark6/lib.js';
import { kf, moving, headAt, withFace, faceBits, face, shadowPerson, crossSil, crossHead, skullHill, linenRoll, shroud, litter, candle, strip, hanging, swing, homeLight, MAGD, MARYJ, SALOME, LOOK, SKIES, INK, tr, PI } from './lib.js';

const GY = 694;
let HX = 430;                       // the far hill (set in build: a phone has it nearer the middle)
const HT = 430, HH = 190;
const DX = 960, DB = 650, DW = 100, DH = 146;
const SR = 76;

export default {
  id: 'lk23-tomb',
  beats: [
    { v: 53, text: 'Zdjął je z krzyża,' },
    { v: 53, cont: true, text: 'owinął w płótno' },
    { v: 53, cont: true, text: 'i złożył w grobie, wykutym w skale, w którym nikt jeszcze nie był pochowany.' },
    { v: 54 },
    { v: 55, text: 'Były przy tym niewiasty, które z Nim przyszły z Galilei.' },
    { v: 55, cont: true, text: 'Obejrzały grób i w jaki sposób zostało złożone ciało Jezusa.' },
  ],
  cam: { x: [-280, 120], y: [-60, 60], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    HX = S.portrait ? 620 : 430;   // phone: the taking-down on the far hill inside the frame
    const sk = sky(S, SKIES.dusk);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 60 }));
    const theStar = S.layer({ par: 0.03, sh: 1, flat: true }).add(`<g><circle r="60" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 16, 4, 4, 0))}" fill="${C.star}"/><path d="${c.poly(c.star(0, 0, 8, 3, 4, PI / 4))}" fill="${C.star}"/></g>`);
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 500, amps: [14, 7, 3], lens: [900, 320, 120], color: mix(C.duskViolet, C.stone2, 0.35) }).markup);
    const homes = [[1180, 505], [1260, 500], [1330, 508], [1110, 510]].map(([x, y], i) => { const el = far.add(`<g transform="translate(${x} ${y}) scale(.8)">${homeLight(c, { w: 60, h: 44, tint: 0.3 })}</g>`); return { i, win: el.querySelector('.win'), glow: el.querySelector('.wglow') }; });
    /* the hill: the cross is emptied */
    const hillL = S.layer({ par: 0.16, sh: 3 });
    hillL.add(`<g transform="translate(${HX} ${HT})">${skullHill(c, { w: 700, h: 230, col: mix(C.rock2, C.duskViolet, 0.3) })}</g>`);
    hillL.add(`<g transform="translate(${HX - 120} ${HT + 20})">${crossSil(c, { h: 150, figure: false })}</g><g transform="translate(${HX + 120} ${HT + 20})">${crossSil(c, { h: 150, figure: false })}</g>`);
    const crossE = hillL.add(`<g transform="translate(${HX} ${HT})">${crossSil(c, { h: HH, figure: false })}</g>`);
    const crossF = hillL.add(`<g>${crossSil(c, { h: HH })}</g>`);
    pose(crossF.querySelector('.hd'), { x: 0, y: -HH + 50 * (HH / 240), r: 28 });
    const smallS = hillL.add(`<g>${shroud(c, 150)}</g>`);
    const sil = [0, 1].map((i) => S.puppet(hillL.add(shadowPerson(c, i ? LOOK.helper : LOOK.joseph, INK))));
    /* the garden and the tomb */
    const garden = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(600, [6, 3], [700, 200]);
    garden.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.duskViolet, 0.25)).out());
    garden.add(cypress(c, 1330, 604, 200, mix(C.moss2, C.duskViolet, 0.2)) + cypress(c, 1380, 606, 150, mix(C.moss2, C.duskViolet, 0.2)) + olive(c, 660, 604, 0.9, { leaf: mix(C.olive, C.duskViolet, 0.2) }) + grass(c, { x0: -600, x1: 2300, y: 600, fn: gfn, n: 30, h: 12, color: C.moss }));
    const tombL = S.layer({ par: 0.4, sh: 5 });
    const R = sheet();
    const rockPts = [[DX - 280, DB + 40], [DX - 250, DB - 170], [DX - 160, DB - 280], [DX - 20, DB - 320], [DX + 140, DB - 300], [DX + 260, DB - 210], [DX + 300, DB - 60], [DX + 320, DB + 40]];
    const arch = [[DX - DW / 2, DB + 2], [DX - DW / 2, DB - DH + DW / 2], ...c.arc(DX, DB - DH + DW / 2, DW / 2, DW / 2, PI, 2 * PI, 12), [DX + DW / 2, DB + 2]];
    R.p(c.cut(rockPts, 3, 12) + c.hole(arch, 0.5, 6), mix(C.rock, C.duskViolet, 0.2));
    R.x(c.cut(c.blob(DX + 150, DB - 200, 70, 30, 9, 0.3), 1, 6) + c.cut(c.blob(DX - 170, DB - 140, 50, 24, 9, 0.3), 1, 6), shade(C.rock, 0.2), 'opacity=".5"');
    R.x(c.ribbon([[DX - 90, DB + 4], [DX + 260, DB + 4]], 8), C.rock3, 'opacity=".7"');
    const inside = S.layer({ par: 0.4, sh: 1 });
    inside.add(`<path d="${c.poly(arch)}" fill="${C.soilRich}"/>`);
    const inGlow = inside.add(`<g><circle r="70" fill="url(#halo-glow)"/></g>`);
    const laid = inside.add(`<g>${shroud(c, 120)}</g>`);
    tombL.add(R.out());
    tombL.add(`<g transform="translate(${DX + DW / 2 + SR + 14} ${DB - SR + 4})">${tombStone(c, SR)}</g>`);
    const ground = S.layer({ par: 0.45, sh: 2 });
    ground.add(sheet().p(c.cut([[-900, 660], [2500, 654], [2500, 1700], [-900, 1700]], 1, 14), mix(C.sand2, C.duskViolet, 0.2)).out());
    const nightL = S.layer({ par: 0.5, sh: 1, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d2349"/>`);
    const P = S.layer({ par: 0.55, sh: 5 });
    const women = [MAGD, MARYJ, SALOME].map((o, i) => ({ i, p: S.puppet(P.add(withFace(person(c, o), faceBits(c)))) }));
    const helper = S.puppet(P.add(person(c, LOOK.helper)));
    const jos = S.puppet(P.add(person(c, LOOK.joseph)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const lit = fx.add(`<g>${litter(c, 190)}</g>`);
    const body = fx.add(`<g>${shroud(c, 160)}</g>`);
    const roll = fx.add(`<g>${linenRoll(c, 60)}</g>`);
    const newTag = fx.add(`<g>${strip(c, tr('nikt jeszcze w nim nie leżał', 'where no one had ever been laid'), { size: 15 })}</g>`);
    const card = hanging(S.layer({ par: 0.2, sh: 5 }), `${sheet().p(c.cut(c.rect(-110, 0, 220, 150), 0.5, 7), C.parchment).out()}<g class="c0" transform="translate(-26 112)">${candle(c, 40)}</g><g class="c1" transform="translate(26 112)">${candle(c, 40)}</g><g transform="translate(0 132)">${strip(c, tr('dzień Przygotowania', 'the day of the Preparation'), { size: 16 })}</g><g transform="translate(0 164)">${strip(c, tr('zaczyna się szabat', 'the Sabbath drawing near'), { size: 14, fill: C.stone })}</g>`, { x: 0, y: -1500, len: 900 });
    const cf = [0, 1].map((i) => { const g = card.querySelector('.c' + i); return { flame: g.querySelector('.flame'), glow: g.querySelector('.glow') }; });

    return (t, time) => {
      const T = time;
      const night = es(t, 2.9, 4.2);
      sk.blend(SKIES.dusk, SKIES.night, 0.15 + night * 0.85);
      starL.fade(es(t, 3.4, 4.2) * 0.5);
      nightL.fade(0.08 + night * 0.26);

      /* v53a — far off, He is taken down */
      const down = es(t, 0.15, 0.7);
      pose(crossF, { x: HX, y: HT, o: 1 - es(t, 0.2, 0.35) });
      fade(crossE, es(t, 0.2, 0.35));
      const [chx, chy] = crossHead(HH);
      pose(smallS, { x: lerp(HX, HX + 40, down), y: lerp(HT + chy + 40, HT - 30, down), r: lerp(90, 0, down), s: 0.45, o: es(t, 0.2, 0.3) * (1 - es(t, 0.95, 1.1)) });
      sil.forEach((p, i) => p.set({ x: HX + [-10, 90][i], y: HT + 8, s: 0.3, flip: i === 1, armF: 90 + (1 - down) * 50, armB: 60, o: es(t, -0.1, 0.05) * (1 - es(t, 0.95, 1.1)) }));

      /* v53b — wrapped in linen */
      const wrap = es(t, 1.1, 1.7);
      const cK = [[2.0, [560, GY]], [2.45, [800, GY]]];
      const [cx] = kf(t, cK);
      const carrying = t > 2.0 && t < 2.5;
      const onLitter = t < 2.5;
      pose(lit, { x: cx, y: GY - 60, o: t > 0.95 && onLitter ? 1 : 0 });
      pose(body, { x: cx, y: GY - 68, sx: 0.3 + wrap * 0.7, o: t > 1.05 && onLitter ? Math.min(1, wrap * 3) : 0 });
      pose(roll, { x: cx + 40 - wrap * 80, y: GY - 84, s: 1 - wrap * 0.6, r: wrap * 300, o: t > 1.0 && wrap < 1 ? 1 : 0 });
      const JK = [[0.9, [300, GY]], [1.05, [470, GY]], [2.0, [470, GY]], [2.45, [710, GY]], [2.8, [780, GY]], S.portrait ? [3.45, [1420, GY + 6]] : [3.5, [1180, GY + 6]]];   // phone: Joseph is gone, not left under the thread
      const [jx] = kf(t, JK);
      const lay = es(t, 2.45, 2.7);
      const jArm = t < 1.0 ? 20 : t < 2.0 ? 40 + wrap * 30 * (1 - wrap) : carrying ? 60 : 20;
      jos.set({ x: t < 2.0 ? jx : carrying ? cx - 90 : jx, y: GY, s: 1.04, flip: false, walk: (t > 0.9 && t < 1.05) || carrying || (t > 2.5 && t < 3.5) ? jx * 0.05 : undefined, amt: 0.7, armF: jArm, armB: carrying ? 50 : 10 + bump(t, 1.1, 1.7) * 40, lean: bump(t, 1.1, 1.8) * 10, head: 8, o: t > 0.9 ? es(t, 0.9, 0.98) : 0, blink: blinkAt(T, 2) });
      helper.set({ x: t < 2.0 ? 690 : cx + 90, y: GY + 2, s: 1, flip: true, walk: carrying ? cx * 0.05 : undefined, amt: 0.7, armF: carrying ? 60 : 30, armB: carrying ? 50 : 10, o: es(t, 0.9, 0.98) * (1 - es(t, 2.6, 2.75)), blink: blinkAt(T, 6) });
      /* v53c — laid in the new tomb */
      pose(laid, { x: DX, y: DB - 42, s: 0.6, o: lay });
      pose(inGlow, { x: DX, y: DB - 40, o: lay * 0.85 });
      const nt = es(t, 2.5, 2.7, ease.back) * (1 - es(t, 3.0, 3.15));
      pose(newTag, { x: DX, y: DB - DH - 50, s: nt, o: nt > 0.02 ? 1 : 0 });

      /* v54 — the Preparation; the Sabbath begins: candles, lamps in the windows, the first star */
      const ck = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 3.9, 4.15));
      swing(card, 700, 150 - (1 - ck) * 900, T, 1, 0.7, 1);
      cf.forEach((f, i) => { const k = es(t, 3.35 + i * 0.12, 3.45 + i * 0.12); pose(f.flame, { x: 0, y: -60, s: k * (1 + (T ? Math.sin(T * 8 + i) * 0.06 : 0)), o: k > 0.02 ? 1 : 0 }); fade(f.glow, k * 0.8); });
      homes.forEach((h) => { const k = es(t, 3.3 + h.i * 0.1, 3.45 + h.i * 0.1); fade(h.win, k); fade(h.glow, k * 0.8); });
      const st = es(t, 3.4, 3.9);
      pose(theStar, { x: DX + 20, y: 190, s: 0.4 + st * 0.6 + (T ? Math.sin(T * 2) * 0.04 * st : 0), o: st });

      /* v55 — the women from Galilee follow and see how He was laid */
      women.forEach((w) => {
        const wx = S.portrait ? 690 - w.i * 80 : 620 - w.i * 90;   // phone: the three stand whole inside the frame
        const K = [[3.95 + w.i * 0.08, [-100 - w.i * 90, GY + 6]], [4.6 + w.i * 0.08, [wx, GY + 6]], [5.0, [wx, GY + 6]], [5.45 + w.i * 0.05, [830 - w.i * 80, GY + 6]]];
        const [x, y] = kf(t, K);
        const look = es(t, 5.3, 5.6);
        w.p.set({ x, y, s: 1.04, flip: false, walk: moving(t, K) ? x * 0.05 : undefined, armF: 14 + (w.i === 0 ? look * 60 : 0), armB: 8, head: -4 + look * 4, o: es(t, 3.95, 4.05), blink: blinkAt(T, 3 + w.i) });
        face(w.p.el, 'sad', 1);
      });

      S.cam.x = lerp(-180, 0, es(t, 0.7, 1.2)) + es(t, 2.1, 2.8) * 90 - es(t, 3.9, 4.5) * 120 + es(t, 5.0, 5.5) * 80;
      S.cam.y = -es(t, 0, 0.5) * 40 * (1 - es(t, 0.7, 1.2)) + es(t, 2.9, 3.4) * -30 * (1 - es(t, 3.9, 4.3));
      if (S.portrait) S.cam.x -= 80 * (1 - es(t, 0.7, 1.2)) + 90 * es(t, 0.7, 1.2) * (1 - es(t, 2.1, 2.6));   // phone: Joseph wrapping the body whole, by the left edge
      S.cam.z = 1.1 * (1 - es(t, 0.7, 1.2)) + 1.02 * es(t, 0.7, 1.2) + es(t, 5.0, 5.5) * 0.06;
    };
  },
};
