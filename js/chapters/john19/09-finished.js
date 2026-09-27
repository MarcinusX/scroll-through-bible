// J 19,28–30 — near the cross, under a golden sky. Knowing that all was now accomplished, Jesus — the ring of
// light round His head closes point by point. "I thirst": the word hangs down, and beside Him the outline of an
// empty drop — He who gave living water. A jar of sour wine stands there; a soldier's shadow dips a sponge on a
// stalk of hyssop and lifts it to His mouth. "It is finished!" — the glory opens wide behind the cross. Then He
// bows His head and gives up His spirit: the little lamp at the front of the stage goes out, a single breath of
// light rises, and everything is still.
import { C, blinkAt, pose, lerp, sheet } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { hand, soldierSil, crossNearSet, wordPlate, emptyDrop, lightRing, wineJar, hyssop, oilLamp, soulLight, glory, wisp, tr, NEAR, J19, PI } from './lib.js';

const GY = 704;

export default {
  id: 'j19-finished',
  beats: [
    { v: 28, text: 'Potem Jezus świadom, że już wszystko się dokonało,' },
    { v: 28, cont: true, text: 'aby się wypełniło Pismo, rzekł: «Pragnę».' },
    { v: 29, text: 'Stało tam naczynie pełne octu.' },
    { v: 29, cont: true, text: 'Nałożono więc na hizop gąbkę pełną octu i do ust Mu podano.' },
    { v: 30, text: 'A gdy Jezus skosztował octu, rzekł: «Wykonało się!»' },
    { v: 30, cont: true, text: 'I skłoniwszy głowę oddał ducha.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const N = crossNearSet(S, { pal: J19.gold });
    const [HX, HY] = N.head;
    const gl = N.glowL.add(`<g>${glory(c, 520, 24)}</g>`);
    const halo = N.glowL.add(`<g><circle r="130" fill="url(#halo-glow)"/></g>`);
    const ring = N.glowL.add(`<g>${lightRing(c, 64, 12)}</g>`);
    const pts = Array.from({ length: 12 }, (_, i) => ring.querySelector(`.p${i}`));
    const ringLine = ring.querySelector('.ring');
    const P = N.P;
    const jar = P.add(`<g>${wineJar(c, 66)}</g>`);
    const sol = S.puppet(P.add(soldierSil(c, 1, { spear: false, col: NEAR.col })));
    const fx = N.fx;
    const stalk = fx.add(`<g>${hyssop(c, 300).replace(/fill="[^"]+"/g, `fill="${NEAR.col}"`)}</g>`);
    const drop = fx.add(`<g>${emptyDrop(c, 18)}</g>`);
    const lamp = fx.add(`<g>${sheet().p(c.cut(c.blob(0, 8, 46, 14, 12, 0.2), 0.8, 6), C.rock2).out()}<g transform="translate(-6 -4)">${oilLamp(c)}</g></g>`);
    const flame = lamp.querySelector('.flame'), lglow = lamp.querySelector('.glow');
    const smoke = fx.add(`<g>${wisp(c, 1.2, '#8c8494')}</g>`);
    const soul = fx.add(`<g>${soulLight(c, 14)}</g>`);
    const plL = S.layer({ par: 0.3, sh: 6 });
    const thirst = plL.add(`<g>${wordPlate(c, tr('«Pragnę»', '“I am thirsty.”'), { size: 26 })}</g>`);
    const done = plL.add(`<g>${wordPlate(c, tr('«Wykonało się!»', '“It is finished.”'), { size: 30 })}</g>`);

    return (t, time) => {
      const still = es(t, 5.1, 5.6);
      const T = time;
      const A = 1 - still;
      N.sk.blend(J19.gold, J19.still, es(t, 5.05, 5.9) * 0.75);

      /* v28a — all is accomplished: the ring of light closes */
      pts.forEach((p, i) => { const k = es(t, 0.1 + i * 0.05, 0.2 + i * 0.05); pose(p, { x: Math.cos(-PI / 2 + (i / 12) * PI * 2) * 64, y: Math.sin(-PI / 2 + (i / 12) * PI * 2) * 64, s: 0.5 + k * 0.5, o: k * (1 - still * 0.8) }); });
      fade(ringLine, es(t, 0.7, 0.9) * (1 - still * 0.8));
      pose(ring, { x: HX, y: HY + 4, r: T * 3 * A });
      /* v28b — "I thirst" */
      const th = es(t, 1.1, 1.4) * (1 - es(t, 1.95, 2.15));
      pose(thirst, { x: 800, y: lerp(-300, 150, th), r: Math.sin(T * 0.7) * 0.6, o: th > 0.01 ? 1 : 0 });
      const dk = es(t, 1.2, 1.45, ease.back) * (1 - es(t, 3.6, 3.9));
      pose(drop, { x: HX + 56, y: HY + 10, s: dk, r: Math.sin(T * 1.1) * 4 * A, o: dk > 0.02 ? 1 : 0 });

      /* v29a — a jar of sour wine stands there */
      const jk = es(t, 2.05, 2.35);
      pose(jar, { x: 1010, y: GY - 4, s: 0.4 + jk * 0.6, o: jk > 0.01 ? 1 : 0 });
      /* v29b — a sponge on hyssop to His mouth */
      const sK = [[2.9, [1260, GY]], [3.35, [930, GY]]];
      const sx = lerp(1260, 930, es(t, 2.95, 3.35));
      const reach = es(t, 3.4, 3.75) * (1 - es(t, 4.35, 4.7));
      const dip = bump(t, 3.3, 3.5);
      const arm = 20 + dip * 30 + reach * 130;
      sol.set({ x: sx, y: GY - 12, s: 0.82, flip: true, walk: t > 2.95 && t < 3.35 ? sx * 0.05 : undefined, armF: arm, armB: 10 + reach * 40, head: -reach * 16, blink: 0, o: es(t, 2.9, 3.0) * (1 - es(t, 4.7, 4.95)) });
      const [hx, hy] = hand(sx, GY - 12, 0.82, true, arm);
      const aim = (Math.atan2(HY + 12 - hy, HX + 8 - hx) * 180) / PI + 90;
      const reachLen = Math.hypot(HX + 8 - hx, HY + 12 - hy) / 310;
      pose(stalk, { x: hx, y: hy, r: lerp(-30, aim, reach), s: lerp(0.7, reachLen, reach), o: es(t, 3.05, 3.2) * (1 - es(t, 4.6, 4.9)) });

      /* v30a — "It is finished!": the glory opens */
      const fin = es(t, 4.05, 4.4);
      pose(done, { x: 800, y: lerp(-300, 150, fin * (1 - es(t, 4.95, 5.2))), r: Math.sin(T * 0.7) * 0.6 * A, o: fin > 0.01 && t < 5.2 ? 1 : 0 });
      pose(gl, { x: HX, y: HY + 20, s: 0.4 + fin * 0.5, r: T * 1.5 * A, o: fin * 0.45 * (1 - still * 0.75) });
      pose(halo, { x: HX, y: HY, s: 1 + fin * 0.5 - still * 0.6, o: 0.55 + fin * 0.35 - still * 0.5 });

      /* v30b — He bows His head and gives up His spirit */
      const bow = es(t, 5.08, 5.45);
      pose(N.hd, { x: 0, y: N.HDY, r: bow * 28 });
      fade(N.hl, 0.85 - bow * 0.55);
      const out = es(t, 5.15, 5.4);
      pose(lamp, { x: 640, y: GY - 10 });
      pose(flame, { x: 35, y: -16, sy: (1 - out) * (1 + Math.sin(T * 9) * 0.07 * A), sx: 1 - out * 0.7, o: out < 0.99 ? 1 : 0 });
      fade(lglow, 0.8 * (1 - out));
      const sm = seg(t, 5.35, 5.95);
      pose(smoke, { x: 669, y: GY - 32 - sm * 60, s: 0.6 + sm * 0.6, o: sm > 0 ? bump(t, 5.35, 5.95) * 0.8 : 0 });
      const rise = seg(t, 5.12, 5.98);
      pose(soul, { x: HX + Math.sin(rise * 5) * 6, y: HY - rise * 150, s: 0.8 + rise * 0.4, o: rise > 0 ? Math.sin(Math.min(1, rise * 1.25) * PI * 0.5) * (1 - rise * rise * 0.6) : 0 });

      S.cam.x = 0;
      S.cam.y = -30 + es(t, 1.9, 2.4) * 40 * (1 - es(t, 3.9, 4.3)) - es(t, 5.0, 5.9) * 20;
      S.cam.z = 1.04 + es(t, 0, 0.9) * 0.05 * (1 - es(t, 1.9, 2.4)) + es(t, 4.0, 4.5) * 0.04 + es(t, 5.0, 5.9) * 0.06;
    };
  },
};
