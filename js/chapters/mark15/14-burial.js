// Mk 15,46–47 — the burial, at dusk. Joseph buys a roll of white linen at a stall. Far off on the hill, two
// small shadows take Jesus down and wrap Him: a white shape is lowered from the cross. They carry Him on a
// litter to the tomb cut in the rock and lay Him inside, where a faint light stays. Joseph rolls the great round
// stone across the door — and it is quiet. Mary Magdalene and Mary the mother of Joses watch where He is laid;
// the first star comes out above the tomb.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, olive, cypress, bush, rock, grass, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { awning, tombStone } from '../mark6/lib.js';
import { kf, moving, hand, headAt, coin, nameTag, withFace, faceBits, face, man, shadowPerson, crossSil, crossHead, skullHill, linenRoll, shroud, litter, hanging, swing, LOOK, SKIES, INK, PI } from './lib.js';

const GY = 694;
const HT = 430, HH = 190;                        // the hill with its crosses, off to the left (HX: see build)
const DX = 930, DB = 650, DW = 100, DH = 146;     // the tomb door
const SR = 76;                                    // the stone

export default {
  id: 'm15-burial',
  beats: [
    { v: 46, text: 'Ten kupił płótno,' },
    { v: 46, cont: true, text: 'zdjął Jezusa [z krzyża], owinął w płótno' },
    { v: 46, cont: true, text: 'i złożył w grobie, który wykuty był w skale.' },
    { v: 46, cont: true, text: 'Przed wejście do grobu zatoczył kamień.' },
    { v: 47 },
  ],
  cam: { x: [-700, 160], y: [-60, 60], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const HX = S.portrait ? 560 : 430;               // phone: the hill nearer the middle, so the taking-down is seen
    const MX = S.portrait ? 640 : 560;               // phone: the two Marys (and their tags) further in
    const sk = sky(S, SKIES.dusk);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 60 }));
    const theStar = S.layer({ par: 0.03, sh: 1, flat: true }).add(`<g><circle r="60" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 16, 4, 4, 0))}" fill="${C.star}"/><path d="${c.poly(c.star(0, 0, 8, 3, 4, PI / 4))}" fill="${C.star}"/></g>`);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 500, amps: [14, 7, 3], lens: [900, 320, 120], color: mix(C.duskViolet, C.stone2, 0.35) }).markup);
    /* the hill: the empty crosses; the taking-down in small shadows */
    const hillL = S.layer({ par: 0.16, sh: 3 });
    hillL.add(`<g transform="translate(${HX} ${HT})">${skullHill(c, { w: 700, h: 230, col: mix(C.rock2, C.duskViolet, 0.3) })}</g>`);
    hillL.add(`<g transform="translate(${HX - 120} ${HT + 20})">${crossSil(c, { h: 150, figure: false })}</g><g transform="translate(${HX + 120} ${HT + 20})">${crossSil(c, { h: 150, figure: false })}</g>`);
    const crossE = hillL.add(`<g transform="translate(${HX} ${HT})">${crossSil(c, { h: HH, figure: false })}</g>`);
    const crossF = hillL.add(`<g>${crossSil(c, { h: HH, halo: true })}</g>`);
    const fhd = crossF.querySelector('.hd');
    pose(fhd, { x: 0, y: -HH + 50 * (HH / 240), r: 28 });
    const smallS = hillL.add(`<g>${shroud(c, 150)}</g>`);
    const sil = [0, 1].map((i) => S.puppet(hillL.add(shadowPerson(c, i ? LOOK.helper : LOOK.joseph, INK))));
    /* the garden and the tomb in the rock */
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
    const stoneL = S.layer({ par: 0.4, sh: 6 });
    const stone = stoneL.add(`<g>${tombStone(c, SR)}</g>`);
    const ground = S.layer({ par: 0.45, sh: 2 });
    ground.add(sheet().p(c.cut([[-900, 660], [2500, 654], [2500, 1700], [-900, 1700]], 1, 14), mix(C.sand2, C.duskViolet, 0.2)).out());
    /* the linen stall */
    const stallL = S.layer({ par: 0.5, sh: 5 });
    stallL.add(`<g transform="translate(250 ${GY + 4})">${awning(c, 220, 170, C.dustyBlue)}</g>`);
    stallL.add(sheet().p(c.cut(c.rect(150, GY - 70, 200, 70), 0.4, 6), C.wood2).out());
    stallL.add(`<g transform="translate(200 ${GY - 80})">${linenRoll(c, 50)}</g><g transform="translate(262 ${GY - 80})">${linenRoll(c, 44)}</g>`);
    const nightL = S.layer({ par: 0.5, sh: 1, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1d2349"/>`);
    const P = S.layer({ par: 0.55, sh: 5 });
    const merchant = S.puppet(P.add(person(c, man(c, { robe: C.ochreRobe, hairStyle: 'wrap', veil: C.linen2 }))));
    const marys = [LOOK.magdalene, LOOK.maryJ].map((o, i) => ({ i, p: S.puppet(P.add(withFace(person(c, o), faceBits(c)))) }));
    const helper = S.puppet(P.add(person(c, LOOK.helper)));
    const jos = S.puppet(P.add(person(c, LOOK.joseph)));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const lit = fx.add(`<g>${litter(c, 190)}</g>`);
    const body = fx.add(`<g>${shroud(c, 160)}</g>`);
    const roll = fx.add(`<g>${linenRoll(c, 54)}</g>`);
    const coins = [0, 1, 2].map(() => fx.add(`<g>${coin(c, 6)}</g>`));
    const tags = [tr(['Maria', 'Magdalena'], ['Mary', 'Magdalene']), tr(['Maria,', 'matka Józefa'], ['Mary,', 'the mother of Joses'])].map((n) => hanging(fx, nameTag(c, n, { size: 16 }), { x: 0, y: 0, len: 900 }));

    return (t, time) => {
      const quiet = es(t, 3.6, 4.2);
      const T = time;
      sk.blend(SKIES.dusk, SKIES.night, es(t, 0, 4.4));
      starL.fade(es(t, 3.9, 4.8) * 0.5);
      nightL.fade(es(t, 0.5, 4.4) * 0.34);

      /* v46a — the linen is bought */
      const buy = es(t, 0.1, 0.45);
      const jK = [[-0.3, [560, GY]], [0.25, [380, GY]], [0.8, [380, GY]], [1.0, [240, GY]]];
      const [j0x, j0y] = kf(t, jK);
      merchant.set({ x: 200, y: GY, s: 0.98, flip: false, armF: 20 + bump(t, 0.2, 0.7) * 60, armB: 10 + bump(t, 0.35, 0.8) * 40, blink: blinkAt(T, 4), o: 1 });
      const [mhx, mhy] = hand(200, GY, 0.98, false, 20 + bump(t, 0.2, 0.7) * 60);
      const [jhx0, jhy0] = hand(j0x, j0y, 1.04, true, 20 + buy * 50);
      coins.forEach((cn, i) => { const k = seg(t, 0.3 + i * 0.06, 0.55 + i * 0.06); pose(cn, { x: lerp(jhx0, mhx + 30, k), y: lerp(jhy0, mhy - 40, k) - Math.sin(k * PI) * 30 + (k >= 1 ? 40 : 0), o: k > 0 && k < 1 ? 1 : 0 }); });
      const rk = es(t, 0.55, 0.8);

      /* v46b — far off, He is taken down and wrapped in the linen */
      const down = es(t, 1.15, 1.7);
      pose(crossF, { x: HX, y: HT, o: 1 - es(t, 1.2, 1.35) });
      fade(crossE, es(t, 1.2, 1.35));
      const [chx, chy] = crossHead(HH);
      const sS = 0.45;
      pose(smallS, { x: lerp(HX, HX + 40, down), y: lerp(HT + chy + 40, HT - 30, down), r: lerp(90, 0, down), s: sS, o: es(t, 1.2, 1.3) * (1 - es(t, 1.9, 2.05)) });
      sil.forEach((p, i) => p.set({ x: HX + [-10, 90][i], y: HT + 8, s: 0.3, flip: i === 1, armF: 90 + (1 - down) * 50, armB: 60, o: es(t, 1.0, 1.1) * (1 - es(t, 1.9, 2.05)) }));

      /* v46c — carried to the tomb and laid inside */
      const cK = [[1.95, [260, GY]], [2.5, [690, GY]]];
      const [cx, cy] = kf(t, cK);
      const carrying = t > 1.95 && t < 2.62;
      const walkC = moving(t, cK) ? cx * 0.05 : undefined;
      const JK = [[2.62, [cx + 90, GY]], [3.0, [DX + 2 * SR + 110, GY]], [3.05, [DX + 2 * SR + 110, GY]], [3.6, [DX + SR + 50, GY]], [3.9, [DX + SR + 50, GY]], [4.6, [DX + SR + 650, GY]]];
      const jx = t < 1.0 ? j0x : t < 2.62 ? cx + 90 : kf(t, JK)[0];
      const pushing = t > 3.0 && t < 3.7;
      const jWalk = (t < 1.0 && moving(t, jK)) || carrying || (t > 2.62 && moving(t, JK));
      jos.set({ x: jx, y: GY, s: 1.04, flip: t < 1.0 || pushing, walk: jWalk ? jx * 0.05 : undefined, amt: 0.7, armF: t < 1.0 ? 20 + buy * 50 : carrying ? 60 : pushing ? 85 : 20, armB: carrying ? 50 : pushing ? 75 : 10, lean: pushing ? 10 : 0, head: quiet * 8, o: t < 1.0 || t > 1.95 ? 1 : 0, blink: blinkAt(T, 2) });
      helper.set({ x: cx - 90, y: GY + 2, s: 1, flip: false, walk: walkC, amt: 0.7, armF: 60, armB: 50, o: t > 1.95 && t < 2.9 ? es(t, 1.95, 2.0) * (1 - es(t, 2.7, 2.9)) : 0, blink: blinkAt(T, 6) });
      const lay = es(t, 2.5, 2.75);
      pose(lit, { x: cx, y: GY - 88, o: carrying ? 1 : 0 });
      pose(body, { x: cx, y: GY - 96, o: t > 1.95 && t < 2.55 ? 1 : 0 });
      pose(laid, { x: DX, y: DB - 42, s: 0.6, o: lay * (1 - es(t, 3.3, 3.55) * 0.3) });
      pose(inGlow, { x: DX, y: DB - 40, o: lay * 0.8 * (1 - quiet * 0.5) });
      pose(roll, { x: j0x - 30, y: GY - 110, r: -10, o: rk * (1 - es(t, 0.95, 1.0)) });

      /* v46d — the stone rolled across the door */
      const sx = lerp(DX + SR + 60, DX, es(t, 3.05, 3.6, ease.io));
      pose(stone, { x: sx, y: DB - SR + 4, r: -((DX + SR + 60 - sx) / SR) * (180 / PI) });

      /* v47 — the two Marys watch where He is laid; the first star */
      marys.forEach((m) => {
        const K = [[3.9, [-120 - m.i * 80, GY + 6]], [4.45, [MX - m.i * 100, GY + 6]]];
        const [x, y] = kf(t, K);
        m.p.set({ x, y, s: 1.06, flip: false, walk: moving(t, K) ? x * 0.05 : undefined, armF: 14 + (m.i ? 30 : 0), armB: 8, head: -4, o: es(t, 3.9, 4.0), blink: blinkAt(T, 3 + m.i) });
        face(m.p.el, 'sad', 1);
        const tk = es(t, 4.4 + m.i * 0.1, 4.7 + m.i * 0.1);
        const [hx, hy] = headAt(MX - m.i * 100, GY + 6, 1.06, false);
        swing(tags[m.i], hx + (m.i ? -20 : 20), hy - 190 - (1 - tk) * 700, T, 1.2, 0.8, m.i);
      });
      const st = es(t, 4.4, 4.9);
      pose(theStar, { x: DX + 20, y: 200, s: 0.4 + st * 0.6 + Math.sin(T * 2) * 0.04 * st, o: st });

      S.cam.x = lerp(S.portrait ? -680 : -200, 0, es(t, 0.8, 1.3))   // phone: start far enough left to see the linen stall and its merchant
        - es(t, 0.9, 1.3) * 60 * (1 - es(t, 1.8, 2.3)) + es(t, 2.1, 2.9) * (S.portrait ? 150 : 110) - es(t, 3.8, 4.4) * (S.portrait ? 190 : 150);   // phone: the waiting stone clear of the thread
      S.cam.y = -es(t, 0.9, 1.3) * 40 * (1 - es(t, 1.8, 2.3)) + es(t, 3.8, 4.4) * 20;
      S.cam.z = 1.08 + es(t, 0.9, 1.3) * 0.1 * (1 - es(t, 1.8, 2.3)) - es(t, 3.8, 4.4) * 0.06;
    };
  },
};
