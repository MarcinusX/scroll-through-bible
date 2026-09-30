// Łk 1,18–20 — Zechariah gets up, palms open: "How shall I know this?" — a question over his head; "I am old, and my
// wife is advanced in years" — in his thought, old Elizabeth leaning on her staff. The angel grows tall in the light
// that pours from above: "I am Gabriel, who stand before God" (his name hangs in gold). "I was sent to speak to you and
// bring you this good news" — a letter comes down the light into his hand and opens to Zechariah like a small sun.
// "You will be silent" — the words he tries to say shrink and fall, and a cord knots itself at his mouth; nine moons
// hang in a row up to the day it happens; "my words will be fulfilled in their time" — golden words settle on that day.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  ZECHARIAH, ELIZABETH, holyPlace, HY, gabriel, lily, zechMute, knot, thought, GLYPH, fig, oldStaff, glowDisc, rayBurst, radiance,
  hungGold, moonDisc, wordSlip, sparkle, hand, headAt,
  tr, es, ease, bump, seg, PI,
} from './lib.js';

const ZX = 620, AX = 990;
const MOONS = 9, MY = 250;

export default {
  id: 'lk1-mute',
  beats: [
    { v: 18, text: 'Na to rzekł Zachariasz do anioła: «Po czym to poznam?' },
    { v: 18, cont: true, text: 'Bo ja jestem już stary i moja żona jest w podeszłym wieku».' },
    { v: 19, text: 'Odpowiedział mu anioł: «Ja jestem Gabriel, który stoję przed Bogiem.' },
    { v: 19, cont: true, text: 'A zostałem posłany, aby mówić z tobą i oznajmić ci tę wieść radosną.' },
    { v: 20, text: 'A oto będziesz niemy i nie będziesz mógł mówić aż do dnia, w którym się to stanie,' },
    { v: 20, cont: true, text: 'bo nie uwierzyłeś moim słowom, które się spełnią w swoim czasie».' },
  ],
  cam: { x: [-30, 30], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const Hs = holyPlace(S);
    const glory = Hs.G.add(`<g>${glowDisc(260, 'halo-glow', 1)}${rayBurst(c, { n: 20, r0: 60, r1: 250, spread: 0.02, o: 0.16 })}</g>`);
    const aGlow = Hs.G.add(`<g>${glowDisc(150, 'halo-glow', 0.85)}</g>`);
    const P = Hs.P;
    const zK = S.puppet(P.add(person(c, { ...ZECHARIAH, pose: 'kneel' })));
    const z = S.puppet(P.add(person(c, ZECHARIAH)));
    const zM = S.puppet(P.add(zechMute(c)));
    const ang = S.puppet(P.add(gabriel(c, { holdB: lily(c) })));

    const up = S.layer({ par: 0.3, sh: 6 });
    const q = up.add(`<g>${thought(c, GLYPH.q(c), { w: 70, h: 54 })}</g>`);
    const oldT = up.add(`<g>${thought(c, `<g transform="translate(0 34)">${fig(c, { ...ELIZABETH, holdF: oldStaff(c, 180, 24) }, 0, 0, 0.36, true)}</g>`, { w: 110, h: 96 })}</g>`);
    const name = up.add(hungGold(c, tr('Gabriel', 'Gabriel'), { size: 32 }));
    const letter = up.add(`<g>${glowDisc(40, 'halo-glow', 1)}${sheet().p(c.cut(c.rect(-18, -12, 36, 24), 0.3, 3), C.parchment).p(c.cut(c.circ(0, 0, 5, 8), 0.2, 2), C.terracotta).x(c.ribbon([[-18, -12], [0, 2], [18, -12]], 1.2), shade(C.parchment, -0.2)).out()}</g>`);
    const news = up.add(`<g>${glowDisc(70, 'halo-glow', 1)}${sheet().p(c.cut(c.rect(-30, -22, 60, 44), 0.3, 4), C.parchment).out()}<path d="${c.poly(c.star(0, 0, 14, 6, 8, 0))}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, 5, 10))}" fill="${C.star}"/></g>`);
    const said = up.add(`<g>${sheet().p(c.cut(c.blob(0, 0, 40, 26, 14, 0.06), 0.4, 4), C.cream).out()}<path d="${c.ribbon([[-24, -4], [-10, -8], [4, -2], [22, -6]], 2) + c.ribbon([[-20, 8], [0, 4], [18, 8]], 2)}" fill="${C.ink}" opacity=".5"/></g>`);
    const flyKnot = up.add(`<g>${glowDisc(24, 'warm-glow', 1)}<g transform="translate(-24 -8) scale(1.6)">${knot(c)}</g></g>`);
    const moons = Array.from({ length: MOONS }, (_, i) => ({ i, el: up.add(`<g><path d="M0 -1800V-16" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/>${i === MOONS - 1 ? `${glowDisc(46, 'halo-glow', 1)}<path d="${c.poly(c.star(0, 0, 18, 7, 8, 0))}" fill="${C.sun}"/><path d="${c.poly(c.circ(0, 0, 6, 10))}" fill="${C.star}"/>` : moonDisc(c, 17)}</g>`) }));
    const words = [0, 1, 2, 3].map((i) => ({ i, el: up.add(`<g>${glowDisc(20, 'warm-glow', 1)}${wordSlip(c, 32)}</g>`) }));
    const sparks = [0, 1, 2, 3, 4].map((i) => up.add(`<g>${sparkle(c, 10 + (i % 2) * 4)}</g>`));

    return (t, time) => {
      const T = time;
      Hs.smoke(t, T, 1, 0.3);
      const [mx, my] = headAt(ZX, HY, 1, false);

      /* v18: he stands up and asks — how shall I know? I am old */
      const stand = es(t, 0.08, 0.14);
      const mute = es(t, 4.52, 4.56);
      const back = es(t, 2.1, 2.35) * 20;
      zK.set({ x: ZX, y: HY, s: 1, flip: false, o: 1 - stand, armF: 50, armB: 30, head: -10, blink: blinkAt(T, 1) });
      const zo = { x: ZX - back, y: HY, s: 1, flip: false, blink: blinkAt(T, 1) };
      z.set({ ...zo, o: stand * (1 - mute), armF: 55 + bump(t, 0.2, 1.9) * 20 - es(t, 2.1, 2.3) * 20 + bump(t, 4.05, 4.45) * 20, armB: 40 + bump(t, 0.2, 1.9) * 30, head: -6 + es(t, 1.0, 1.3) * 12 * (1 - es(t, 2.0, 2.2)) - es(t, 2.1, 2.4) * 8, lean: es(t, 1.0, 1.3) * 5 * (1 - es(t, 2.0, 2.2)) - es(t, 2.1, 2.3) * 5 });
      zM.set({ ...zo, o: mute, armF: 30 + es(t, 5.1, 5.4) * 40, armB: 10, head: 6 + es(t, 5.1, 5.4) * 8, lean: 3 });
      const qk = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(q, { x: mx + 16, y: my - 40, s: Math.max(0.001, qk), o: qk > 0.01 ? 1 : 0 });
      const ok = es(t, 1.1, 1.35, ease.back) * (1 - es(t, 1.95, 2.1));
      pose(oldT, { x: mx + 16, y: my - 44, s: Math.max(0.001, ok), o: ok > 0.01 ? 1 : 0 });

      /* v19a: I am Gabriel, who stand before God — light from above, he grows tall */
      const gl = es(t, 2.05, 2.45);
      const as = 1.0 + gl * 0.12 - es(t, 4.0, 4.3) * 0.06;
      const aF = 30 + es(t, 3.05, 3.3) * 40 + es(t, 4.35, 4.5) * 20 - es(t, 5.0, 5.3) * 30;
      ang.set({ x: AX, y: HY + 4, s: as, flip: true, armF: aF, armB: 26 + gl * 30, head: -4 - gl * 4, blink: blinkAt(T, 2) });
      pose(aGlow, { x: AX, y: HY - 160, s: 0.9 + gl * 0.3, o: 1 });
      pose(glory, { x: AX - 40, y: 120, s: 0.5 + gl * 0.6, r: t * 3, o: gl * (1 - es(t, 4.0, 4.4) * 0.5) });
      const nk = es(t, 2.3, 2.6, ease.out) * (1 - es(t, 3.9, 4.15, ease.in));
      pose(name, { x: AX - 10, y: lerp(-1100, 330, nk), r: Math.sin(T * 0.9) * 1.4, o: nk > 0.002 ? 1 : 0 });

      /* v19b: sent to bring you good news — a letter down the light, then open to him */
      const [hx, hy] = hand(AX, HY + 4, as, true, aF);
      const l1 = es(t, 3.02, 3.3), l2 = es(t, 3.35, 3.6);
      pose(letter, { x: lerp(AX - 40, hx, l1), y: lerp(140, hy, l1), r: (1 - l1) * 30, o: t > 3.0 && l2 < 0.99 ? 1 : 0 });
      pose(news, { x: lerp(hx, 790, l2), y: lerp(hy, 440, l2), s: 0.5 + l2 * 0.6, r: Math.sin(T * 0.8) * 2, o: l2 > 0.01 ? 1 - es(t, 3.95, 4.1) : 0 });

      /* v20a: you will be silent — his words shrink and fall; the cord knots at his mouth; nine moons to the day */
      const sw = seg(t, 4.08, 4.4);
      pose(said, { x: mx + 60 + sw * 10, y: my - 40 + sw * sw * 200, s: Math.max(0.001, 1 - sw * 0.8), r: sw * 50, o: t > 4.05 && sw < 1 ? 1 - sw * 0.5 : 0 });
      const kf = es(t, 4.3, 4.54, ease.io);
      pose(flyKnot, { x: lerp(hx, mx + 24, kf), y: lerp(hy, my + 8, kf) - Math.sin(kf * PI) * 50, s: lerp(1.4, 1, kf), o: t > 4.3 && t < 4.56 ? 1 : 0 });
      moons.forEach((m) => {
        const k = es(t, 4.45 + m.i * 0.04, 4.65 + m.i * 0.04, ease.out);
        pose(m.el, { x: 600 + m.i * 50, y: lerp(-1100, MY + (m.i % 2) * 14, k), r: Math.sin(T * 0.8 + m.i) * 2, s: m.i === MOONS - 1 ? 1 + bump(t, 5.55, 5.85) * 0.3 : 1, o: k > 0.002 ? 1 : 0 });
      });
      /* v20b: my words will be fulfilled in their time */
      words.forEach((w) => {
        const k = es(t, 5.1 + w.i * 0.06, 5.5 + w.i * 0.06);
        const tx = 600 + (MOONS - 1) * 50, ty = MY;
        pose(w.el, { x: lerp(hx - 10 + w.i * 12, tx, k), y: lerp(hy - 30 - w.i * 16, ty, k) - Math.sin(k * PI) * 80, r: (1 - k) * 20, s: 1 - k * 0.5, o: t > 5.05 && k < 0.98 ? 1 : 0 });
      });
      sparks.forEach((sp, i) => { const kk = seg(t, 5.55 + i * 0.04, 5.95 + i * 0.04); const a = (i / 5) * PI * 2; pose(sp, { x: 1000 + Math.cos(a) * (30 + kk * 40), y: MY + Math.sin(a) * (30 + kk * 40), s: 1 - kk * 0.5, r: t * 90, o: bump(t, 5.55 + i * 0.04, 5.95 + i * 0.04) }); });

      S.cam.z = 1.04 + bump(t, 2.0, 3.0) * 0.03;
      S.cam.y = -10;
    };
  },
};
