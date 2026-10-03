// Łk 2,13–15 — suddenly the whole sky fills: row upon row of paper angels come down on the night, with trumpets and
// harps and lifted hands, and the dark turns to gold. "Glory to God in the highest" — a banner rises to the top of
// the sky, where light pours down (never a figure: only light). "And on earth peace to people of His good will" — the
// light comes down over the fields and the sleeping town, a second banner hangs low over the kneeling shepherds.
// Then the angels go back up into heaven, row by row, and it is night again; the shepherds get up, turn to one
// another — "Let us go to Bethlehem!" — and set off towards the town on the hill.
import { C, blinkAt, pose, lerp, hanging, sheet, mix } from '../kit.js';
import {
  fieldSet, FY, FIREX, flicker, shepherdCast, setShep, SH_AT, flockGroup, angel, glory, glowDisc, rayBurst, hostRow, banner, say,
  hangAt, vpose, kf, moving, sparkle, tr, es, ease, bump, seg, PI,
} from './lib.js';

const AX0 = 1070;
const ROWS = [{ y: 150, s: 0.5, n: 16 }, { y: 250, s: 0.62, n: 14 }, { y: 350, s: 0.76, n: 12 }, { y: 440, s: 0.9, n: 10 }];

export default {
  id: 'lk2-gloria',
  beats: [
    { v: 13 },
    { v: 14, text: '«Chwała Bogu na wysokościach,' },
    { v: 14, cont: true, text: 'a na ziemi pokój ludziom Jego upodobania».' },
    { v: 15, text: 'Gdy aniołowie odeszli od nich do nieba,' },
    { v: 15, cont: true, text: 'pasterze mówili nawzajem do siebie: «Pójdźmy do Betlejem i zobaczmy, co się tam zdarzyło i o czym nam Pan oznajmił».' },
  ],
  cam: { x: [-40, 80], y: [-60, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const AX = S.portrait ? 980 : AX0;   // phone: the angel clear of the thread
    const F = fieldSet(S, { heaven: true, host: true });
    const { P, gloryL } = F;

    /* the light from the top of the sky; the rows of the host */
    const top = F.skyGlow.add(`<g>${rayBurst(c, { n: 26, r0: 60, r1: 900, spread: 0.035, color: '#fff6dc', o: 0.55 })}<circle r="360" fill="url(#halo-glow)"/></g>`);
    const rows = ROWS.map((r, i) => ({ ...r, i, sp: F.hostL.sprite(hostRow(c, r.n, -600, 2200, { s: r.s, seed: i * 5 }), 800, r.y) }));

    const flock = P.add(flockGroup(c, 10, 300, 540, FY - 14, { s: 0.74 }));
    const gl = gloryL.add(`<g>${glory(c, 520, 22)}</g>`);
    const peace = gloryL.add(`<g>${glowDisc(700, 'warm-glow', 1)}</g>`);
    const townGlow = gloryL.add(`<g>${glowDisc(200, 'halo-glow', 1)}</g>`);
    const ang = S.puppet(P.add(angel(c, { robe: C.linen, mantle: C.halo, hair: C.wheat2, skin: C.skin })));
    const SH = shepherdCast(S, P);

    const X = S.layer({ par: 0.2, sh: 5 });
    const b1 = hanging(X, banner(c, tr('Chwała Bogu na wysokościach', 'Glory to God in the highest'), { size: 28 }), { x: 0, y: 0, len: 800 });
    const b2 = hanging(X, banner(c, tr('a na ziemi pokój', 'on earth peace'), { size: 26, fill: mix(C.cream, C.skyVeil, 0.35) }), { x: 0, y: 0, len: 900 });
    const Y = S.layer({ par: 0.34, sh: 5 });
    const bub = Y.add(`<g>${say(c, [tr('Pójdźmy do Betlejem', 'Let’s go to Bethlehem,'), tr('i zobaczmy!', 'and see!')], { size: 22, side: 1 })}</g>`);
    const sparks = [0, 1, 2, 3, 4, 5, 6, 7].map(() => X.add(`<g>${sparkle(c, 11)}</g>`));

    return (t, time) => {
      const T = time;
      hangAt(F.moonEl, 1250, 150, T, 1, 1, 0.5, 1);
      flicker(F.flames, T, FIREX, FY + 2, 0.65 + es(t, 3.2, 3.7) * 0.35);

      /* v13 — suddenly a multitude of the heavenly host */
      const hv = es(t, 0.1, 0.7) * (1 - es(t, 3.1, 3.7));
      const gold = 0.9 * (1 - es(t, 3.2, 3.8));
      F.gsk.layer.fade(gold);
      F.hsk.layer.fade(hv);
      F.starL.fade(0.25 + es(t, 3.3, 3.9) * 0.75);
      rows.forEach((r) => {
        const k = es(t, 0.05 + r.i * 0.1, 0.55 + r.i * 0.1, ease.out);
        const gone = es(t, 3.0 + (3 - r.i) * 0.08, 3.55 + (3 - r.i) * 0.08, ease.in);
        const lift = es(t, 1.05, 1.4) * 14 - es(t, 2.05, 2.4) * 6;
        r.sp.set({ x: 800 + Math.sin(r.i * 1.7) * 30, y: r.y - (1 - k) * 900 - gone * 1800 - lift, o: k > 0.001 && gone < 0.999 ? 1 : 0 });
      });
      pose(gl, { x: AX, y: FY - 170, r: T * 2, o: 0.42 * (1 - es(t, 0.1, 0.8)) });
      ang.set({ x: AX, y: FY - es(t, 3.0, 3.5, ease.in) * 700, s: 1.12, flip: true, o: 1 - es(t, 3.2, 3.5), armF: 60 + es(t, 1.0, 1.3) * 60, armB: 60 + es(t, 1.0, 1.3) * 90, head: -4 - es(t, 1.0, 1.3) * 12, blink: blinkAt(T, 2) });

      /* v14a — glory to God in the highest: light from the top of the sky */
      const gk = es(t, 1.05, 1.4) * (1 - es(t, 3.0, 3.4));
      pose(top, { x: 800, y: -120, s: 0.6 + gk * 0.4, r: T * 1.5, o: gk });
      const k1 = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 3.0, 3.3, ease.in));
      hangAt(b1, 800, lerp(-560, 175, k1), T, k1 > 0.001 ? 1 : 0, 0.8, 0.7, 1);
      sparks.forEach((sp, i) => {
        const a = (i / 8) * PI * 2 + T * 0.2, k = es(t, 1.2 + i * 0.03, 1.4 + i * 0.03) * (1 - es(t, 3.0, 3.2));
        vpose(sp, { x: 800 + Math.cos(a) * 420, y: 300 + Math.sin(a) * 150, s: k * (0.8 + Math.sin(T * 3 + i) * 0.15), r: T * 40, o: k });
      });

      /* v14b — and on earth peace: the light comes down over the land */
      const pk = es(t, 2.05, 2.5) * (1 - es(t, 3.2, 3.8));
      pose(peace, { x: 780, y: FY - 60, sx: 1.3, sy: 0.6, o: pk * 0.85 });
      pose(townGlow, { x: F.townX, y: F.townY - 20, s: 0.6 + pk * 0.6, o: pk });
      const k2 = es(t, 2.1, 2.4, ease.out) * (1 - es(t, 3.0, 3.3, ease.in));
      hangAt(b2, 800, lerp(-560, 470, k2), T, k2 > 0.001 ? 1 : 0, 0.8, 0.7, 2);
      pose(flock, { x: 420, y: 0, sy: 1 - pk * 0.05, oy: FY });

      /* the shepherds kneel through the song, then get up and set off */
      const up = es(t, 4.05, 4.15);
      const go = es(t, 4.55, 5.0, (u) => u);
      const walk = go > 0.01 && go < 0.99;
      const talk = bump(t, 4.1, 4.9);
      const raise = es(t, 1.05, 1.4) * (1 - es(t, 3.0, 3.4));
      const look = es(t, 3.0, 3.6);
      SH.forEach((sh, i) => {
        const x = SH_AT[i].x + go * (380 + i * 40) - (i === 3 ? 0 : 0);
        const face = i >= 2 ? (up > 0.5 ? (i === 2 ? true : false) : false) : false;
        const kneel = i === 1 ? 0 : 1 - up;
        const sit = i === 1 ? 1 - up : 0;
        setShep(sh, { kneel, sit, stand: up }, {
          x: i === 3 ? lerp(700, 980, go) : x, y: FY + (i === 3 ? 4 : 0), flip: walk ? false : face,
          walk: walk ? x * 0.06 + i : undefined,
          armF: 40 + raise * 90 + (i === 1 ? talk * 80 : talk * 20), armB: i === 0 || i === 2 ? 20 + raise * 110 : 20 + raise * 120, armBs: 20 + raise * 120,
          head: -10 - raise * 6 + look * 6, blink: blinkAt(T, 1 + i * 2),
        });
      });
      const bb = es(t, 4.15, 4.3, ease.back) * (1 - es(t, 4.85, 4.95));
      vpose(bub, { x: SH_AT[1].x + 10, y: FY - 210, s: Math.max(0.001, bb), o: bb > 0.01 ? 1 : 0 });

      S.cam.y = -30 + es(t, 0.0, 0.6) * -20 + es(t, 2.0, 2.4) * 40 + es(t, 3.5, 4.0) * 20;
      S.cam.x = es(t, 4.4, 5.0) * 70;
      S.cam.z = 1.0 + es(t, 3.6, 4.1) * 0.06;
    };
  },
};
