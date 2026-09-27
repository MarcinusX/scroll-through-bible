// J 1,29–31 — The next day: the sun comes up over the Jordan and Jesus walks towards John. "Behold, the Lamb
// of God": a white lamb walks at His side, and the dark scraps of the world's sin lift off a hanging globe and
// melt into light. "He was before me" — the ring without end. "I did not know Him": a shadow card in John's
// thought — and as the water is poured, the card turns to show His face, and all Israel turns to look.
import { C, person, CAST, crowd, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { JOHN_B, jordanSet, headAt, hand, drops, shell, lamb, globe, eternityRing, drawRing, glowDisc, thought, bust, shadowPerson, hungGold, voiceRings, sparkle, PI } from './lib.js';
import { scrap } from '../mark1/lib.js';

const BANK = 770, WADE = 702, JOX = 560, JX = 830;

export default {
  id: 'j1-lamb',
  beats: [
    { v: 29, text: 'Nazajutrz zobaczył Jezusa, nadchodzącego ku niemu, i rzekł:' },
    { v: 29, cont: true, text: '«Oto Baranek Boży, który gładzi grzech świata.' },
    { v: 30 },
    { v: 31, text: 'Ja Go przedtem nie znałem,' },
    { v: 31, cont: true, text: 'ale przyszedłem chrzcić wodą w tym celu, aby On się objawił Izraelowi».' },
  ],
  cam: { x: [-40, 60], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const DAWN = ['#c9c3d6', '#f2d6bd', '#f7e0c4'];
    const MORN = ['#cfe2dc', '#f1e7cc', '#f7ead0'];
    const J = jordanSet(S, { skyCols: DAWN, sunAt: [520, 400], sunR: 46 });
    const farPeople = crowd(S, J.far, [{ y: 584, s: 0.4, n: 10, x0: 120, x1: 1480 }]).filter((m) => Math.abs(m.x - JOX) > 110);

    const R = J.riverLayer();
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const pourEl = R.add(`<g>${drops(c, 6, C.lake2)}</g>`);
    J.waterFront(R);

    const { N } = J.nearBank();
    const ringEl = N.add(`<g>${eternityRing(c, 140, 7, 26)}</g>`);
    const jGlow = N.add(`<g>${glowDisc(200, 'warm-glow', 1)}</g>`);
    const nearPeople = crowd(S, N, [{ y: 790, s: 0.88, n: 2, x0: 240, x1: 420 }, { y: 790, s: 0.88, n: 2, x0: 1150, x1: 1320 }]);
    const lambGlow = N.add(`<g>${glowDisc(90, 'halo-glow', 1)}</g>`);
    const lambEl = N.add(`<g>${lamb(c)}</g>`);
    const jesus = S.puppet(N.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(N, c, { n: 3, color: C.clay, r: 38, w: 6, both: false });

    /* ---------- the world and its sin ---------- */
    const T = S.layer({ par: 0.3, sh: 6 });
    const GX = 1060, GY = 250;
    const globeEl = T.add(`<g class="hang"><path d="M0 -1600V-62" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${globe(c, 62)}</g></g>`);
    const sins = [[-24, -20], [18, -30], [30, 14], [-10, 22], [-34, 8], [6, -4]].map(([dx, dy], i) => ({ el: T.add(`<g>${scrap(c, 10 + (i % 3) * 2)}</g>`), dx, dy, i }));
    const flashes = sins.map(() => T.add(`<g>${sparkle(c, 12)}</g>`));
    const lambTag = T.add(hungGold(c, tr('Baranek Boży', 'the Lamb of God'), { size: 24 }));
    /* ---------- John's thought: a shadow card, then His face ---------- */
    const TH = S.layer({ par: 0.45, sh: 6 });
    const card = (inner) => `${sheet().p(c.cut(c.rect(-34, -42, 68, 84), 0.4, 5), C.cream).p(c.cut(c.rect(-28, -36, 56, 72), 0.3, 5), C.parchment).out()}<g clip-path="url(#${S.id('cc')})">${inner}</g>`;
    S.defs(`<clipPath id="${S.id('cc')}"><rect x="-28" y="-36" width="56" height="72"/></clipPath>`);
    const thoughtEl = TH.add(`<g>${thought(c, '', { w: 120, h: 118 })}</g>`);
    const shadowCard = TH.add(`<g>${card(`<g transform="translate(0 -6) scale(.42)">${shadowPerson(c, CAST.jesus, '#4a3f52').replace('<g class="fig"', '<g class="fig" transform="translate(-2 150)"')}</g>`)}<text x="0" y="8" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="30" fill="${C.cream}">?</text></g>`);
    const faceCard = TH.add(`<g>${card(`<g transform="translate(0 -6) scale(.42)">${bust(c, CAST.jesus)}</g>`)}</g>`);
    const israel = T.add(hungGold(c, tr('Izrael', 'Israel'), { size: 24 }));

    J.foreground();

    return (t, time) => {
      /* v29a: the next day — sunrise; He comes towards John */
      const rise = es(t, 0.02, 0.9);
      J.sk.blend(DAWN, MORN, rise);
      J.update(t, time, { sunX: lerp(540, 520, rise), sunY: lerp(430, 175, rise), glow: 1 - rise });
      const walk = es(t, 0.2, 1.0);
      const jx = lerp(1500, JX, walk);
      /* v29b: behold the Lamb */
      const point = es(t, 1.05, 1.3) * (1 - es(t, 2.9, 3.1));
      const lk = es(t, 1.1, 1.4, ease.out);
      jesus.set({ x: jx, y: BANK, s: 1.05, flip: true, walk: walk > 0 && walk < 1 ? jx * 0.05 : undefined, armF: 12 + es(t, 4.4, 4.7) * 60, armB: 8 + es(t, 4.4, 4.7) * 40, head: es(t, 1.2, 1.5) * 4, blink: blinkAt(time, 2) });
      const lx = JX + 110 - (1 - lk) * 80;
      pose(lambEl, { x: lx, y: BANK - 34, s: 1.4, sx: -1.4, o: lk > 0.01 ? 1 : 0 });
      pose(lambGlow, { x: lx, y: BANK - 70, s: lk * (1 + bump(t, 1.4, 2.0) * 0.4), o: lk });
      const lt = es(t, 1.25, 1.5, ease.out) * (1 - es(t, 2.0, 2.2, ease.in));
      pose(lambTag, { x: lx + 20, y: lerp(-500, 500, lt), r: Math.sin(t * 3.6) * 1.5, o: lt > 0.01 ? 1 : 0 });
      pose(globeEl, { x: GX, y: GY, r: Math.sin(time * 0.5) * 1.5, o: 1 });
      sins.forEach((sn, i) => {
        const a = 1.35 + i * 0.06, k = es(t, a, a + 0.45, ease.in);
        const sx = GX + sn.dx, sy = GY + sn.dy;
        const x = lerp(sx, lx, k) + Math.sin(k * PI) * 30, y = lerp(sy, BANK - 80, k) - Math.sin(k * PI) * 60;
        pose(sn.el, { x, y, r: k * 200 + i * 30, s: 1 - k * 0.6, o: k < 0.98 ? 1 : 0 });
        const fk = bump(t, a + 0.38, a + 0.6);
        pose(flashes[i], { x: lx + (i % 3 - 1) * 20, y: BANK - 90 - (i % 2) * 20, s: fk, r: t * 200, o: fk });
      });

      /* John */
      const pour = bump(t, 4.1, 4.9);
      const bow = bump(t, 2.1, 2.9);
      john.set({ x: JOX, y: WADE, s: 1.05, flip: false, armF: 20 + point * 85 + bump(t, 2.1, 2.9) * 40 + pour * 80 + bump(t, 3.1, 3.8) * 30, armB: bow * 40 + point * 20, head: -point * 4 + bow * 14 + bump(t, 3.1, 3.8) * 10 + pour * 6, lean: bow * 10, blink: blinkAt(time, 1) });
      const [hx, hy] = headAt(JOX, WADE, 1.05, false);
      voice(hx + 24, hy + 4, point * seg(t, 1.1, 1.3), time, { spread: 2.4, s0: 0.6, dir: 1 });
      const [px, py] = hand(JOX, WADE, 1.05, false, 20 + pour * 80);
      const fall = time ? (time * 1.6) % 1 : 0.5;
      pose(pourEl, { x: px + 12 + fall * 10, y: py + 6 + fall * 50, o: seg(t, 4.4, 4.5) * (1 - seg(t, 4.85, 4.9)) });

      /* v30: He was before me — the ring */
      const ring = seg(t, 2.1, 2.7);
      drawRing(ringEl, ease.io(ring));
      pose(ringEl, { x: JX, y: BANK - 110, s: 1, r: t * 12, o: (ring > 0 ? 1 : 0) * (1 - es(t, 3.0, 3.3)) });
      pose(jGlow, { x: JX, y: BANK - 110, s: 0.7 + es(t, 2.1, 2.5) * 0.4 * (1 - es(t, 3.0, 3.3)) + es(t, 4.3, 4.7) * 0.6, o: Math.max(0.35 * walk, es(t, 2.1, 2.5) * (1 - es(t, 3.0, 3.3) * 0.6), es(t, 4.3, 4.7)) });

      /* v31a: I did not know Him — a shadow card; v31b: revealed to Israel */
      const th = es(t, 3.05, 3.3, ease.back) * (1 - es(t, 4.8, 4.98));
      const flip = es(t, 4.35, 4.6);
      const tx = hx + 10, ty = hy - 30;
      pose(thoughtEl, { x: tx, y: ty, s: th, o: th > 0.01 ? 1 : 0 });
      pose(shadowCard, { x: tx + 16, y: ty - 58, s: th, sx: th * Math.max(0.001, 1 - flip * 2), o: th > 0.01 && flip < 0.5 ? 1 : 0 });
      pose(faceCard, { x: tx + 16, y: ty - 58, s: th, sx: th * Math.max(0.001, flip * 2 - 1), o: th > 0.01 && flip >= 0.5 ? 1 : 0 });
      const it = es(t, 4.45, 4.75, ease.out);
      pose(israel, { x: 800, y: lerp(-500, 330, it), r: Math.sin(t * 3.2 + 1) * 1.4, o: it > 0.01 ? 1 : 0 });

      /* the people — all of Israel turns to look at Him */
      const look = es(t, 4.4, 4.8);
      farPeople.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: look > 0.5 ? m.x > JX : m.x > JOX, armF: look * (m.i % 2 ? 60 : 10), head: -look * 4, blink: blinkAt(time, m.seed) }));
      nearPeople.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: look * (m.i % 2 ? 60 : 20), armB: look * (m.i % 2 ? 0 : 120), head: -look * 8, blink: blinkAt(time, m.seed) }));

      S.cam.x = 40 * (1 - walk) + es(t, 1.3, 1.6) * 30 * (1 - es(t, 2.0, 2.3));
      S.cam.z = 1.02 + es(t, 3.0, 3.3) * 0.06 - es(t, 4.3, 4.7) * 0.06;
      S.cam.y = 40 * es(t, 1.0, 1.3) * (1 - es(t, 2.0, 2.3));
    };
  },
};
