// Łk 8,43–44 — in the street the crowd walks on with Jesus behind Jairus. Among them a woman in grey, a little rain
// cloud over her head: twelve years of bleeding. Three physicians come down on hanging discs, each with his jar;
// coin after coin flies out of her purse to them until the purse hangs empty — and a red cross falls on each: none
// could heal her. She creeps up behind Him, kneels, and touches the tassel of His cloak — a warm spark — and at once
// her bleeding stops: the rain cloud breaks into sparkles and her grey clothes turn to warm colours.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { fringeStreet, ST, L5, sorrowCloud, disc, crossX, jar, purse, coin, spark, sparkle, heart, hand, headAt, kf, tr, PI } from './lib.js';

const FEET = ST.FEET;
const DOCS = [
  { robe: C.parchment, mantle: C.teal2, jar: C.skyVeil },
  { robe: C.linen2, mantle: shade(C.plumRobe, -0.15), jar: C.sageRobe },
  { robe: C.stone, mantle: C.clayMantle, jar: C.blushVeil },
];

export default {
  id: 'lk8-fringe',
  beats: [
    { v: 43 },
    { v: 44, text: 'Podeszła z tyłu i dotknęła się frędzli Jego płaszcza,' },
    { v: 44, cont: true, text: 'a natychmiast ustał jej upływ krwi.' },
  ],
  cam: { x: [-80, 60], y: [-20, 60], z: [1, 1.16] },
  build(S) {
    const St = fringeStreet(S);
    const c = St.c;
    const P = St.P;

    /* her years, the physicians, her purse */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const cloudEl = fx.add(`<g>${sorrowCloud(c, 80)}</g>`);
    const drops = [...cloudEl.querySelectorAll('.drop')];
    const years = fx.add(`<g opacity="0"><path d="${c.cut([[-46, -16], [46, -18], [48, 16], [-48, 18]], 0.4, 5)}" fill="${C.cream}"/><text x="0" y="7" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="20" font-style="italic" fill="${C.ink}">${tr('12 lat', '12 years')}</text></g>`);
    const docs = DOCS.map((d, i) => {
      const bust = `<g transform="translate(0 44) scale(.42)">${person(c, { robe: d.robe, mantle: d.mantle, hairStyle: 'wrap', veil: C.stone, hair: C.greyHair, beard: i === 1 ? 'short' : 'full', beardColor: C.greyHair, skin: [C.skin2, C.skin3, C.skin][i], holdF: `<g transform="translate(0 6)">${jar(c, d.jar)}</g>` }).replace('class="armFr"', 'class="armFr" transform="rotate(-70)"')}</g>`;
      const id = S.id('doc' + i);
      return {
        i,
        el: fx.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-48" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${disc(c, `<clipPath id="${id}"><circle r="42"/></clipPath><g clip-path="url(#${id})">${bust}</g>`, { r: 44, fill: C.parchment })}</g>`),
        no: fx.add(`<g opacity="0">${crossX(c, 30)}</g>`),
        coin: fx.add(`<g opacity="0">${coin(c, 7)}</g>`),
      };
    });
    const purseFull = fx.add(`<g opacity="0">${purse(c, 1)}</g>`);
    const purseEmpty = fx.add(`<g opacity="0">${purse(c, 0)}</g>`);
    const sp = fx.add(`<g opacity="0">${spark(c, 14)}</g>`);
    const warmGlow = St.backL.add(`<g opacity="0"><circle r="120" fill="url(#halo-glow)"/></g>`);
    const breakSparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const hrt = fx.add(`<g opacity="0">${heart(c, 13)}</g>`);

    const WK = [[-0.3, -120], [2.4, 0]];
    const DX = [0, 330, 560];

    return (t, time) => {
      const T = time;
      St.set.update(t, T);
      const d = kf(t, WK, (u) => u);
      const walking = t < 2.4;
      St.backs.forEach((b) => b.sp.set({ x: b.x + d * 0.8, y: b.y - (walking ? Math.abs(Math.sin((b.x + d) * 0.05 + b.i)) * 2 : 0) }));
      St.fronts.forEach((b) => b.sp.set({ x: b.x + d, y: b.y - (walking ? Math.abs(Math.sin((b.x + d) * 0.05 + b.i + 1)) * 2 : 0) }));
      const JX = ST.JX + d;
      P.jair.set({ x: JX + 250, y: FEET - 8, s: 0.98, walk: walking ? (JX + 250) * 0.05 : undefined, armF: 20, armB: 10, head: 4, blink: blinkAt(T, 4) });
      P.peter.set({ x: JX + 110, y: FEET - 14, s: 0.96, walk: walking ? (JX + 110) * 0.05 + 1 : undefined, armF: 14, blink: blinkAt(T, 2) });
      P.jesus.set({ x: JX, y: FEET, s: 1.04, walk: walking ? JX * 0.05 : undefined, armF: 14, armB: 8, head: es(t, 2.3, 2.6) * 8, blink: blinkAt(T) });
      P.john.set({ x: JX + 60, y: FEET + 16, s: 1, walk: walking ? (JX + 60) * 0.05 + 2 : undefined, armF: 16, blink: blinkAt(T, 6) });

      /* v43 — twelve years; all her living spent on physicians; none could heal her */
      const WX = kf(t, [[0, 470], [1.05, 500], [1.45, JX - 112]]);
      const kneel = es(t, 1.45, 1.51);
      const healed = es(t, 2.12, 2.2);
      P.wWalk.set({ x: WX, y: FEET + 10, s: 0.96, walk: (t < 1.45 && walking) ? WX * 0.06 : undefined, armF: 30 + bump(t, 0.25, 0.7) * 40 + es(t, 1.1, 1.4) * 30, lean: 6 + es(t, 1.05, 1.4) * 8, head: 8, o: 1 - kneel, blink: blinkAt(T, 5) });
      const reach = es(t, 1.5, 1.72);
      const armW = 30 + reach * 56;
      P.wKneel.set({ x: JX - 112, y: FEET + 12, s: 0.96, o: kneel * (1 - healed), armF: armW, armB: 20, lean: reach * 22, head: 10, blink: blinkAt(T, 5) });
      P.wKneelWell.set({ x: JX - 112, y: FEET + 12, s: 0.96, o: healed, armF: armW - es(t, 2.4, 2.7) * 30, armB: 20 + es(t, 2.3, 2.6) * 40, lean: reach * 22 - es(t, 2.4, 2.7) * 16, head: 10 - es(t, 2.3, 2.6) * 16, blink: blinkAt(T, 5) });
      P.wWell.set({ o: 0 });
      const [whx, why] = t < 1.45 ? headAt(WX, FEET + 10, 0.96, false) : headAt(JX - 112, FEET + 12, 0.96, false, 46);
      const brk = es(t, 2.05, 2.3);
      pose(cloudEl, { x: whx - 6, y: why - 66 - brk * 30, s: 1 - brk * 0.5, o: 1 - brk });
      drops.forEach((dr, i) => { const k = T ? ((T * 1.4 + i / 5) % 1) : (i + 0.5) / 5; pose(dr, { x: -30 + i * 15, y: 10 + k * 26, o: (1 - brk) * (1 - k) }); });
      breakSparks.forEach((b, i) => { const k = bump(t, 2.08 + i * 0.03, 2.6 + i * 0.03); pose(b, { x: whx - 40 + i * 20, y: why - 80 - k * 20, s: k, r: T * 40, o: k }); });
      const yk = es(t, 0.05, 0.2, ease.back) * (1 - es(t, 0.9, 1.05));
      pose(years, { x: whx + 70, y: why - 50, s: yk, o: yk > 0.02 ? 1 : 0 });
      const [hx, hy] = hand(WX, FEET + 10, 0.96, false, 30 + bump(t, 0.25, 0.7) * 40);
      pose(purseFull, { x: hx, y: hy - 4, o: seg(t, 0.2, 0.25) * (1 - seg(t, 0.62, 0.66)) * (1 - kneel) });
      pose(purseEmpty, { x: hx, y: hy - 4, o: seg(t, 0.62, 0.66) * (1 - seg(t, 1.0, 1.1)) });
      docs.forEach((dc) => {
        const dx = WX + 120 + DX[dc.i] * 0.62 - 60, dy = 330 + (dc.i % 2) * 40;
        const dk = es(t, 0.08 + dc.i * 0.06, 0.32 + dc.i * 0.06, ease.out) * (1 - es(t, 1.0, 1.2));
        pose(dc.el, { x: dx, y: lerp(-1500, dy, dk), r: T ? Math.sin(T * 0.8 + dc.i) * 1.5 : 0, o: dk > 0.01 ? 1 : 0 });
        const ck = seg(t, 0.3 + dc.i * 0.06, 0.46 + dc.i * 0.06);
        pose(dc.coin, { x: lerp(hx, dx, ck), y: lerp(hy - 10, dy + 30, ck) - Math.sin(ck * PI) * 60, r: ck * 360, o: ck > 0 && ck < 1 ? 1 : 0 });
        const nk = es(t, 0.56 + dc.i * 0.04, 0.66 + dc.i * 0.04, ease.back) * (1 - es(t, 1.0, 1.1));
        pose(dc.no, { x: dx, y: dy, s: nk, o: nk > 0.02 ? 1 : 0 });
      });

      /* v44a — from behind, she touches the tassel of His cloak */
      const [tx, ty] = [JX - 34 * 1.04, FEET - 2];
      const touch = bump(t, 1.68, 2.3);
      pose(sp, { x: tx, y: ty, s: 0.6 + touch * 0.8, r: T * 30, o: es(t, 1.66, 1.74) * (1 - es(t, 2.6, 2.9)) });
      /* v44b — and at once the flow of her blood stopped */
      pose(warmGlow, { x: JX - 112, y: FEET - 90, s: 0.6 + es(t, 2.1, 2.5) * 0.5, o: es(t, 2.05, 2.4) * 0.8 });
      const hk = es(t, 2.25, 2.45, ease.back);
      pose(hrt, { x: JX - 112 + 14, y: FEET - 118, s: hk * 0.9, o: hk > 0.02 ? 1 : 0 });

      S.cam.x = -60 + es(t, 1.0, 1.5) * 50;
      S.cam.z = 1.02 + es(t, 1.2, 1.7) * 0.1;
      S.cam.y = 20 + es(t, 1.2, 1.7) * 30;
    };
  },
};
