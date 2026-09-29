// Mt 27,59–61 — the burial at dusk (Mark 15's garden and tomb). Far off on the hill two small shadows take Jesus
// down and wrap Him in clean linen: a white shape is lowered from the cross, and it stands empty. Joseph and a
// helper carry Him on a litter to Joseph's own new tomb, cut in the rock, and lay Him inside, where a faint light
// stays. Joseph rolls the great round stone across the door and goes away. Mary Magdalene and the other Mary
// stay, sitting opposite the tomb; the first star comes out above it.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, rock, grass, stars } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tombStone } from '../mark6/lib.js';
import { kf, moving, headAt, nameTag, withFace, faceBits, face, shadowPerson, crossSil, crossHead, skullHill, shroud, litter, hanging, swing, LOOK, SKIES, INK, tr, PI } from './lib.js';

const GY = 694;
const HX = 430, HT = 430, HH = 190;              // the hill with its crosses, off to the left
const DX = 930, DB = 650, DW = 100, DH = 146;     // the tomb door
const SR = 76;                                    // the stone

export default {
  id: 'mt27-tomb',
  beats: [
    { v: 59 },
    { v: 60, text: 'i złożył w swoim nowym grobie, który kazał wykuć w skale.' },
    { v: 60, cont: true, text: 'Przed wejściem do grobu zatoczył duży kamień i odszedł.' },
    { v: 61 },
  ],
  cam: { x: [-240, 120], y: [-60, 60], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKIES.dusk);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 60 }));
    const theStar = S.layer({ par: 0.03, sh: 1, flat: true }).add(`<g><circle r="60" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 16, 4, 4, 0))}" fill="${C.star}"/><path d="${c.poly(c.star(0, 0, 8, 3, 4, PI / 4))}" fill="${C.star}"/></g>`);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 500, amps: [14, 7, 3], lens: [900, 320, 120], color: mix(C.duskViolet, C.stone2, 0.35) }).markup);
    const hillL = S.layer({ par: 0.16, sh: 3 });
    hillL.add(`<g transform="translate(${HX} ${HT})">${skullHill(c, { w: 700, h: 230, col: mix(C.rock2, C.duskViolet, 0.3) })}</g>`);
    hillL.add(`<g transform="translate(${HX - 120} ${HT + 20})">${crossSil(c, { h: 150, figure: false })}</g><g transform="translate(${HX + 120} ${HT + 20})">${crossSil(c, { h: 150, figure: false })}</g>`);
    const crossE = hillL.add(`<g transform="translate(${HX} ${HT})">${crossSil(c, { h: HH, figure: false })}</g>`);
    const crossF = hillL.add(`<g>${crossSil(c, { h: HH, halo: true })}</g>`);
    pose(crossF.querySelector('.hd'), { x: 0, y: -HH + 50 * (HH / 240), r: 28 });
    const smallS = hillL.add(`<g>${shroud(c, 150)}</g>`);
    const sil = [0, 1].map((i) => S.puppet(hillL.add(shadowPerson(c, i ? LOOK.helper : LOOK.joseph, INK))));
    const garden = S.layer({ par: 0.3, sh: 3 });
    const gfn = c.wave(600, [6, 3], [700, 200]);
    garden.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.hillNear, C.duskViolet, 0.25)).out());
    garden.add(cypress(c, 1330, 604, 200, mix(C.moss2, C.duskViolet, 0.2)) + cypress(c, 1380, 606, 150, mix(C.moss2, C.duskViolet, 0.2)) + olive(c, 640, 604, 0.9, { leaf: mix(C.olive, C.duskViolet, 0.2) }) + grass(c, { x0: -600, x1: 2300, y: 600, fn: gfn, n: 30, h: 12, color: C.moss }));
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
    const stone = S.layer({ par: 0.4, sh: 6 }).add(`<g>${tombStone(c, SR)}</g>`);
    const ground = S.layer({ par: 0.45, sh: 2 });
    ground.add(sheet().p(c.cut([[-900, 660], [2500, 654], [2500, 1700], [-900, 1700]], 1, 14), mix(C.sand2, C.duskViolet, 0.2)).out());
    ground.add(rock(c, 380, 700, 120, 34, mix(C.rock2, C.duskViolet, 0.2)) + rock(c, 520, 704, 90, 28, mix(C.rock3, C.duskViolet, 0.2)));
    const nightL = S.layer({ par: 0.5, sh: 1, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d2349"/>`);
    const P = S.layer({ par: 0.55, sh: 5 });
    const MS = [LOOK.magdalene, LOOK.maryJ].map((o, i) => {
      const st = P.add(withFace(person(c, o), faceBits(c)));
      const sit = P.add(withFace(person(c, { ...o, pose: 'sit' }), faceBits(c)));
      return { i, st, sit, p: S.puppet(st), ps: S.puppet(sit) };
    });
    const helper = S.puppet(P.add(person(c, LOOK.helper)));
    const jos = S.puppet(P.add(person(c, LOOK.joseph)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const lit = fx.add(`<g>${litter(c, 190)}</g>`);
    const body = fx.add(`<g>${shroud(c, 160)}</g>`);
    const tags = [tr(['Maria', 'Magdalena'], ['Mary', 'Magdalene']), tr(['druga', 'Maria'], ['the other', 'Mary'])].map((n) => hanging(fx, nameTag(c, n, { size: 16 }), { x: 0, y: -1500, len: 900 }));

    return (t, time) => {
      const T = time;
      const quiet = es(t, 2.6, 3.2);
      sk.blend(SKIES.dusk, SKIES.night, es(t, 0, 3.6));
      starL.fade(es(t, 2.9, 3.8) * 0.5);
      nightL.fade(es(t, 0.2, 3.6) * 0.34);

      /* v59 — far off, He is taken down and wrapped in clean linen */
      const down = es(t, 0.15, 0.6);
      pose(crossF, { x: HX, y: HT, o: 1 - es(t, 0.2, 0.3) });
      pose(crossE, { x: HX, y: HT, o: es(t, 0.2, 0.3) });
      const [, chy] = crossHead(HH);
      pose(smallS, { x: lerp(HX, HX + 40, down), y: lerp(HT + chy + 40, HT - 30, down), r: lerp(90, 0, down), s: 0.45, o: es(t, 0.2, 0.3) * (1 - es(t, 0.9, 1.02)) });
      sil.forEach((p, i) => p.set({ x: HX + [-10, 90][i], y: HT + 8, s: 0.3, flip: i === 1, armF: 90 + (1 - down) * 50, armB: 60, o: es(t, 0.02, 0.1) * (1 - es(t, 0.9, 1.02)) }));

      /* v60a — carried to his own new tomb and laid inside */
      const cK = [[0.95, [260, GY]], [1.5, [690, GY]]];
      const [cx] = kf(t, cK);
      const carrying = t > 0.95 && t < 1.62;
      const walkC = moving(t, cK) ? cx * 0.05 : undefined;
      const JK = [[1.62, [cx + 90, GY]], [2.0, [DX + 2 * SR + 110, GY]], [2.05, [DX + 2 * SR + 110, GY]], [2.5, [DX + SR + 50, GY]], [2.6, [DX + SR + 50, GY]], [2.95, [DX + SR + 420, GY]]];
      const jx = t < 1.62 ? cx + 90 : kf(t, JK)[0];
      const pushing = t > 2.0 && t < 2.55;
      const leaving = t > 2.6;
      jos.set({ x: jx, y: GY, s: 1.04, flip: pushing, walk: carrying || (t > 1.62 && moving(t, JK)) ? jx * 0.05 : undefined, amt: 0.7, armF: carrying ? 60 : pushing ? 85 : 20, armB: carrying ? 50 : pushing ? 75 : 10, lean: pushing ? 10 : 0, head: leaving ? 8 : 0, o: (t > 0.95 ? 1 : 0) * (1 - es(t, 2.85, 2.95)), blink: blinkAt(T, 2) });
      helper.set({ x: cx - 90, y: GY + 2, s: 1, flip: false, walk: walkC, amt: 0.7, armF: 60, armB: 50, o: t > 0.95 && t < 1.9 ? es(t, 0.95, 1.0) * (1 - es(t, 1.7, 1.9)) : 0, blink: blinkAt(T, 6) });
      const lay = es(t, 1.5, 1.75);
      pose(lit, { x: cx, y: GY - 88, o: carrying ? 1 : 0 });
      pose(body, { x: cx, y: GY - 96, o: t > 0.95 && t < 1.55 ? 1 : 0 });
      pose(laid, { x: DX, y: DB - 42, s: 0.6, o: lay * (1 - es(t, 2.3, 2.55) * 0.3) });
      pose(inGlow, { x: DX, y: DB - 40, o: lay * 0.8 * (1 - quiet * 0.5) });
      /* v60b — the great stone rolled to the door; he goes away */
      const sx = lerp(DX + SR + 60, DX, es(t, 2.05, 2.5, ease.io));
      pose(stone, { x: sx, y: DB - SR + 4, r: -((DX + SR + 60 - sx) / SR) * (180 / PI) });

      /* v61 — Mary Magdalene and the other Mary sit opposite the tomb */
      MS.forEach((m) => {
        const MX = S.portrait ? 640 : 440;
        const K = [[2.3, [-160 - m.i * 80, GY + 6]], [2.95, [MX - m.i * 110, GY + 6]]];
        const [x, y] = kf(t, K);
        const sat = es(t, 3.0, 3.1);
        m.p.set({ x, y, s: 1.06, flip: false, walk: moving(t, K) ? x * 0.05 : undefined, armF: 14, armB: 8, head: -4, o: es(t, 2.3, 2.4) * (1 - sat), blink: blinkAt(T, 3 + m.i) });
        m.ps.set({ x: MX - m.i * 110 + 10, y: GY + 4, s: 1.06, flip: false, armF: 40 + m.i * 20, armB: 20, head: 4, o: sat, blink: blinkAt(T, 3 + m.i) });
        face(m.st, 'sad', 1); face(m.sit, 'sad', 1);
        const tk = es(t, 3.1 + m.i * 0.1, 3.4 + m.i * 0.1);
        const [hx, hy] = headAt(MX - m.i * 110, GY + 4, 1.06, false, 62);
        swing(tags[m.i], hx + (m.i ? -20 : 20), hy - 170 - (1 - tk) * 700, T, 1.2, 0.8, m.i);
      });
      const st = es(t, 3.3, 3.8);
      pose(theStar, { x: DX + 20, y: 200, s: 0.4 + st * 0.6 + Math.sin(T * 2) * 0.04 * st, o: st });

      S.cam.x = -220 * (1 - es(t, 0.85, 1.35)) + es(t, 1.1, 1.9) * 110 - es(t, 2.7, 3.3) * 170;
      S.cam.y = -60 * (1 - es(t, 0.85, 1.35)) + es(t, 2.7, 3.3) * 20;
      S.cam.z = 1.08 + 0.14 * (1 - es(t, 0.85, 1.35)) - es(t, 2.7, 3.3) * 0.06;
    };
  },
};
