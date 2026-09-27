// J 6,54–57 — lamplight at nightfall. On a small table covered with a white cloth before Jesus stand the bread of
// light and the cup of light. One who comes and kneels receives a small light: eternal life (a ring without end),
// and He will raise him up — the dawn plate, and the man stands in the morning glow. "My flesh is true food, My
// blood is true drink": two plates hang above. "He abides in Me and I in him": two hearts joined by one golden
// loop. As the living Father sent Him and He lives because of the Father, so the one who feeds on Him will live
// because of Him — a chain of light from the radiance to Jesus, and from Jesus to the man.
import { C, person, CAST, blinkAt, pose, attr, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, folk, radiance, breadOfLight, cupOfLight, chalice, hungPlate, eternityRing, drawRing, soulLight, dawnDisc, heart, glowDisc, headAt, kf, tr, PI, FONT } from './lib.js';
import { lowTable } from '../mark2/lib.js';

const JX = 800, FEET = 742, MX = 600;

export default {
  id: 'j6-abide',
  beats: [
    { v: 54, text: 'Kto spożywa moje Ciało i pije moją Krew, ma życie wieczne,' },
    { v: 54, cont: true, text: 'a Ja go wskrzeszę w dniu ostatecznym.' },
    { v: 55 },
    { v: 56 },
    { v: 57, text: 'Jak Mnie posłał żyjący Ojciec, a Ja żyję przez Ojca,' },
    { v: 57, cont: true, text: 'tak i ten, kto Mnie spożywa, będzie żył przeze Mnie.' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S, { sky: ['#1d2349', '#2b3262', '#4a4876'] });
    const night = S.layer({ par: 0, sh: 1, flat: true });
    night.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2a2038"/>`);
    const dawn = S.layer({ par: 0, sh: 1, flat: true });
    dawn.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#f2b98a"/>`);
    const hiL = S.layer({ par: 0.3, sh: 4 });
    const rad = hiL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 52)}</g>`);
    const chainL = S.layer({ par: I.P, sh: 1, flat: true });
    const chain1 = chainL.add(`<path d="${c.ribbon([[0, 0], [0, 1]], 10)}" fill="#fff1c4" opacity="0"/>`);
    const chain2 = chainL.add(`<path d="${c.ribbon([[0, 0], [1, 0]], 10)}" fill="#fff1c4" opacity="0"/>`);

    const L = S.layer({ par: I.P, sh: 4 });
    const cong = I.congregation(L);
    const o = folk(c, true);
    const kn = S.puppet(L.add(person(c, { ...o, pose: 'kneel' })));
    const st = S.puppet(L.add(person(c, o)));
    const mGlow = L.add(`<g>${glowDisc(110, 'warm-glow', 1)}</g>`);
    const jGlow = L.add(`<g>${glowDisc(160, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    L.add(`<g transform="translate(${JX + 10} ${FEET - 2})">${lowTable(c, 200, 52)}</g>`);
    const bread = L.add(`<g>${breadOfLight(c, 24)}</g>`);
    const cup = L.add(`<g><circle r="70" fill="url(#halo-glow)"/><g transform="translate(0 30)">${chalice(c, 50, { dark: false })}</g></g>`);
    I.addColumns();

    const fx = S.layer({ par: 0.6, sh: 5 });
    const gift = fx.add(`<g>${soulLight(c, 9)}</g>`);
    const ring = fx.add(`<g>${eternityRing(c, 40, 4, 20)}</g>`);
    const last = hanging(fx, dawnDisc(c, 46), { x: 0, y: 0, len: 900 });
    const cap = (w) => `<text x="0" y="96" text-anchor="middle" font-family="${FONT}" font-size="19" font-style="italic" fill="${C.ink}">${w}</text>`;
    const pFood = fx.add(`<g>${hungPlate(c, `<g transform="translate(0 -6)">${breadOfLight(c, 30, { rays: false })}</g>`, { r: 62, fill: mix(C.cream, C.halo, 0.3) })}<g>${cap('')}</g></g>`);
    const pDrink = fx.add(`<g>${hungPlate(c, `<g transform="translate(0 22)">${chalice(c, 52, { dark: false })}</g>`, { r: 62, fill: mix(C.cream, C.halo, 0.3) })}</g>`);
    const tFood = fx.add(`<g>${label(c, tr('prawdziwy pokarm', 'food indeed'))}</g>`);
    const tDrink = fx.add(`<g>${label(c, tr('prawdziwy napój', 'drink indeed'))}</g>`);
    const hJ = fx.add(`<g>${heart(c, 14)}</g>`);
    const hM = fx.add(`<g>${heart(c, 12)}</g>`);
    const loop = fx.add(`<path fill="none" stroke="${C.haloRim}" stroke-width="4" stroke-linecap="round" opacity="0"/>`);

    return (t, time) => {
      const T = time;
      I.flicker(T);
      night.fade(0.18);
      const morning = es(t, 1.1, 1.5) * (1 - es(t, 2.2, 2.6));
      dawn.fade(morning * 0.22);
      /* the bread and cup of light on the table */
      pose(bread, { x: JX - 30, y: FEET - 66, o: 1 });
      pose(cup, { x: JX + 50, y: FEET - 84, o: 1 });

      /* v54a — whoever eats… has eternal life */
      const come = es(t, 0.05, 0.3);
      const up = es(t, 1.2, 1.28);
      kn.set({ x: MX, y: FEET + 12, s: 0.98, flip: false, o: come * (1 - up), armF: 70, armB: 50, head: -10, blink: blinkAt(T, 3) });
      const later = es(t, 3.05, 3.2);
      st.set({ x: MX - later * 20, y: FEET + 12, s: 0.98, flip: false, o: up, armF: 30 + es(t, 1.2, 1.5) * 60 - later * 30, armB: 20 + es(t, 1.2, 1.5) * 100 - later * 80, head: -8, blink: blinkAt(T, 3) });
      const [mhx, mhy] = headAt(MX, FEET + 12, 0.98, false, up > 0.5 ? 0 : 46);
      const gk = es(t, 0.3, 0.6);
      pose(gift, { x: lerp(JX - 30, MX + 10, gk), y: lerp(FEET - 70, mhy + 60, gk) - Math.sin(gk * PI) * 50, o: seg(t, 0.3, 0.35) * (1 - es(t, 0.95, 1.05)) });
      drawRing(ring, es(t, 0.55, 0.95));
      pose(ring, { x: MX + 4, y: mhy + 20, r: t * 30, o: seg(t, 0.55, 0.6) * (1 - es(t, 1.0, 1.15)) });
      /* v54b — raised up on the last day */
      const lk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.95, 2.1));
      pose(last, { x: 1060, y: lerp(-500, 240, lk), r: Math.sin(T * 0.8) * 1.4, o: lk > 0.01 ? 1 : 0 });
      const mg = Math.max(es(t, 1.2, 1.5) * (1 - es(t, 2.0, 2.3)), es(t, 5.2, 5.6));
      pose(mGlow, { x: MX, y: FEET - 110, s: 0.8 + mg * 0.6, o: mg });

      /* v55 — true food, true drink */
      const pk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.1));
      pose(pFood, { x: 640, y: lerp(-500, 250, pk), r: Math.sin(T * 0.8) * 1.2, o: pk > 0.01 ? 1 : 0 });
      pose(pDrink, { x: 960, y: lerp(-500, 250, pk), r: Math.sin(T * 0.8 + 1) * 1.2, o: pk > 0.01 ? 1 : 0 });
      const tk = es(t, 2.3, 2.5, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(tFood, { x: 640, y: 350, s: tk, o: tk > 0.01 ? 1 : 0 });
      pose(tDrink, { x: 960, y: 350, s: tk, o: tk > 0.01 ? 1 : 0 });

      /* v56 — abides in Me, and I in him */
      const [jhx, jhy] = headAt(JX, FEET, 1.08, false);
      const hk = es(t, 3.1, 3.35, ease.back) * (1 - es(t, 3.95, 4.1));
      const [shx, shy] = headAt(MX - 20, FEET + 12, 0.98, false);
      pose(hJ, { x: JX + 6, y: jhy + 70, s: hk, o: hk > 0.01 ? 1 : 0 });
      pose(hM, { x: MX - 14, y: shy + 64, s: hk, o: hk > 0.01 ? 1 : 0 });
      const lp = es(t, 3.3, 3.6) * (1 - es(t, 3.95, 4.1));
      const ax = MX - 14, ay = shy + 64, bx = JX + 6, by = jhy + 70;
      attr(loop, 'd', `M${ax} ${ay}C${ax + 40} ${ay - 90} ${bx - 40} ${by - 90} ${bx} ${by}C${bx - 40} ${by + 70} ${ax + 40} ${ay + 70} ${ax} ${ay}`);
      attr(loop, 'opacity', lp * 0.9);

      /* v57 — the living Father → the Son → the one who feeds on Him */
      const rk = es(t, 4.05, 4.35);
      pose(rad, { x: JX, y: 160, s: 0.8, r: T * 3, o: rk });
      const c1 = es(t, 4.3, 4.8);
      pose(chain1, { x: JX, y: 190, sy: (jhy - 30 - 190) * c1, o: c1 * 0.7 });
      const c2 = es(t, 5.1, 5.5);
      pose(chain2, { x: JX - 10, y: FEET - 120, sx: -(JX - 10 - MX) * c2, o: c2 * 0.7 });
      pose(jGlow, { x: JX, y: FEET - 130, s: 0.8 + c1 * 0.6, o: 0.25 + c1 * 0.5 });

      cong.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 20 + es(t, 2.05, 2.3) * 20, armB: 0, head: -es(t, 4.05, 4.3) * 8, blink: blinkAt(T, m.seed) }));
      jesus.set({ x: JX, y: FEET, s: 1.08, flip: false, armF: 20 + bump(t, 0.1, 0.9) * 50 + bump(t, 2.05, 2.95) * 40 + bump(t, 3.1, 3.9) * 50 + es(t, 5.1, 5.4) * 40, armB: 10 + bump(t, 4.05, 4.95) * 140, head: -bump(t, 4.05, 4.9) * 12, blink: blinkAt(T, 1) });

      S.cam.z = kf(t, [[0, 1.06], [1.1, 1.04], [2.0, 1.02], [3.1, 1.08], [4.0, 1.02], [5.1, 1.06]]);
      S.cam.y = kf(t, [[0, 30], [1.1, 10], [2.0, 0], [3.1, 30], [4.0, 0], [5.1, 20]]);
    };
  },
};

function label(c, text) {
  const size = 18, ww = text.length * size * 0.5 + size * 1.3, hh = size * 1.45;
  const d = c.cut([[-ww / 2, -hh / 2], [ww / 2, -hh / 2 - 1.5], [ww / 2 + 1.5, hh / 2], [-ww / 2 - 1, hh / 2 + 1]], 0.5, 6);
  return `<path d="${d}" fill="${C.cream}"/><path class="grain" d="${d}"/><text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.ink}">${text}</text>`;
}
