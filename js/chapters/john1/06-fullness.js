// J 1,15–18 — John cries out: the One who comes after him walks up behind him, steps before him — the ring
// without end shows He was before him. From His fullness a golden bowl pours, grace upon grace, wave after wave.
// The Law came through Moses (a stone-grey plate); grace and truth through Jesus Christ. No one has seen God:
// a bank of cloud comes down — and parts above the Son, who makes Him known: the light pours out through Him.
import { C, person, CAST, crowd, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { DAY, JOHN_B, MOSES, jordanSet, voiceRings, headAt, hand, eternityRing, drawRing, glowDisc, rayBurst, radiance, hungGold, hungPlate, hungWord, lawTablets, SEPIA, soulLight, PI } from './lib.js';

const JX = 800, PY = 750;

export default {
  id: 'j1-fullness',
  beats: [
    { v: 15, text: 'Jan daje o Nim świadectwo i głośno woła w słowach:' },
    { v: 15, cont: true, text: '«Ten był, o którym powiedziałem: Ten, który po mnie idzie, przewyższył mnie godnością, gdyż był wcześniej ode mnie».' },
    { v: 16, text: 'Z Jego pełności wszyscyśmy otrzymali -' },
    { v: 16, cont: true, text: 'łaskę po łasce.' },
    { v: 17, text: 'Podczas gdy Prawo zostało nadane przez Mojżesza,' },
    { v: 17, cont: true, text: 'łaska i prawda przyszły przez Jezusa Chrystusa.' },
    { v: 18, text: 'Boga nikt nigdy nie widział,' },
    { v: 18, cont: true, text: 'Ten Jednorodzony Bóg, który jest w łonie Ojca, [o Nim] pouczył.' },
  ],
  cam: { x: [-40, 40], y: [-80, 40], z: [0.96, 1.12] },
  build(S) {
    const c = S.c;
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1230, 150], sunR: 44 });

    /* ---------- the light behind the cloud (v18) ---------- */
    const hid = S.layer({ par: 0.05, sh: 1, flat: true });
    const hGlow = hid.add(`<g>${glowDisc(420, 'halo-glow', 1)}</g>`);
    const hRays = hid.add(`<g>${rayBurst(c, { n: 22, r0: 60, r1: 700, spread: 0.025, o: 0.3 })}</g>`);
    const hDisc = S.layer({ par: 0.05, sh: 5 }).add(`<g>${radiance(c, 90)}</g>`);
    const bank = (dir) => {
      const L = S.layer({ par: 0.06, sh: 7, pad: 500 });
      let m = `<path d="${c.poly(dir < 0 ? [[-1400, -1400], [806, -1400], [806, 230], [-1400, 230]] : [[794, -1400], [3000, -1400], [3000, 230], [794, 230]])}" fill="#e9e1d8"/>`;
      for (let i = 0; i < 8; i++) {
        const x = 800 + dir * (60 + i * 140) + c.rr(-20, 20), y = 250 + c.rr(-30, 50) + (i % 2) * 40;
        m += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${(1.4 + c.rr(0, 0.5)).toFixed(2)})">${cloud(c, 240, '#eee6dd', '#d9cfc6')}</g>`;
      }
      L.add(m);
      return L;
    };
    const bankL = bank(-1), bankR = bank(1);

    /* ---------- people on the near bank ---------- */
    const { N } = J.nearBank();
    const people = crowd(S, N, [{ y: 770, s: 0.86, n: 3, x0: 250, x1: 450 }, { y: 772, s: 0.86, n: 3, x0: 1080, x1: 1290 }]);
    const FLOW = S.layer({ par: 0.45, sh: 1, flat: true });
    const ringEl = FLOW.add(`<g>${eternityRing(c, 150, 7, 26)}</g>`);
    const jGlow = FLOW.add(`<g>${glowDisc(240, 'warm-glow', 1)}</g>`);
    const jRays = FLOW.add(`<g>${rayBurst(c, { n: 18, r0: 50, r1: 700, spread: 0.03, o: 0.32 })}</g>`);
    const beam = FLOW.add(`<path d="${c.poly([[JX - 40, -200], [JX + 40, -200], [JX + 120, PY], [JX - 120, PY]])}" fill="#fff1c4" opacity="0"/>`);
    // grace upon grace: golden ribbons that pour, one wave after another
    const waves = [0, 1, 2].map((i) => {
      const col = [C.halo, '#fbe4a4', C.star][i];
      const arm = (d) => c.ribbon(c.cbez([d * 70, 0], [d * 150, -30], [d * 330, 80], [d * (430 + i * 20), 360], 26), (u) => 22 - u * 12);
      return FLOW.add(`<g><path d="${arm(-1) + arm(1)}" fill="${col}" opacity=".9"/><path d="${c.ribbon(c.cbez([-66, 0], [-140, -24], [-320, 80], [-(420 + i * 20), 352], 26), 4) + c.ribbon(c.cbez([66, 0], [140, -24], [320, 80], [420 + i * 20, 352], 26), 4)}" fill="#fffaf0" opacity=".8"/></g>`);
    });
    const cupLights = people.map(() => FLOW.add(`<g>${soulLight(c, 9)}</g>`));

    const P = S.layer({ par: 0.45, sh: 4 });
    const john = S.puppet(P.add(person(c, { ...JOHN_B })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, color: C.clay, r: 40, w: 6, both: false });

    /* ---------- from the flies: the bowl of fullness, Moses' plate, the Name ---------- */
    const T = S.layer({ par: 0.3, sh: 6 });
    const bowlM = (() => {
      const s = sheet();
      s.p(c.cut([[-90, -10], [90, -10], [70, 40], [40, 58], [-40, 58], [-70, 40]], 0.5, 6), C.sun);
      s.p(c.cut(c.ell(0, -10, 90, 16, 24), 0.4, 6), shade(C.sun, -0.2));
      s.p(c.cut(c.ell(0, -12, 80, 11, 24), 0.4, 6), C.star);
      s.x(c.ribbon([[-78, 14], [78, 14]], 4), C.sunDeep, 'opacity=".5"');
      return `<g class="hang"><path d="M-60 -1600V-10M60 -1600V-10" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${s.out()}</g></g>`;
    })();
    const bowl = T.add(bowlM);
    const mosesIcon = `<g transform="translate(-8 96) scale(.82)">${person(c, { ...MOSES, holdF: `<g transform="translate(18 -44) scale(.5)">${lawTablets(c, { w: 56, h: 80 })}</g>` })}</g><path d="${c.cut([[-110, 88], [-40, 18], [0, 50], [60, -10], [110, 88]], 0.8, 6)}" fill="${mix(SEPIA.wall2, C.rock2, 0.4)}"/>`;
    const moses = T.add(hungPlate(c, `<g clip-path="url(#${S.id('mclip')})">${mosesIcon}</g>`, { r: 104, rim: C.stone2, fill: C.stone, face: SEPIA.sky[1] }));
    S.defs(`<clipPath id="${S.id('mclip')}"><circle r="97"/></clipPath>`);
    const lawTag = T.add(hungWord(c, tr('Prawo', 'the Law'), { size: 22 }));
    const nameEl = T.add(hungGold(c, tr('Jezus Chrystus', 'Jesus Christ'), { size: 26 }));
    const graceEl = T.add(hungWord(c, tr('łaska i prawda', 'grace and truth'), { size: 22, fill: C.halo }));

    J.foreground();

    return (t, time) => {
      J.update(t, time, { sunY: lerp(150, -400, es(t, 5.9, 6.4)) });

      /* v15a: John cries out */
      const cry = es(t, 0.1, 0.35) * (1 - es(t, 1.2, 1.4));
      /* v15b: the One who comes after him walks up behind him — and steps before him */
      const come = es(t, 1.03, 1.35);
      const aside = es(t, 1.3, 1.55);
      const ahead = es(t, 1.4, 1.65);
      const jx0 = lerp(-120, 520, come);
      const jxs = lerp(jx0, JX, ahead);
      const johnX = lerp(660, 470, aside);
      john.set({
        x: johnX, y: PY, s: 1.02, flip: aside > 0.3, walk: aside > 0 && aside < 1 ? johnX * 0.05 : undefined,
        armF: 20 + cry * 60 + bump(t, 1.3, 1.6) * 50 + es(t, 1.8, 2.0) * 60 - es(t, 2.9, 3.1) * 40, armB: cry * 140 + es(t, 1.8, 2.0) * 10,
        head: -cry * 14 + es(t, 1.8, 2.0) * 10 - es(t, 2.9, 3.1) * 10, lean: es(t, 1.8, 2.0) * 10 - es(t, 2.9, 3.1) * 10, blink: blinkAt(time),
      });
      const [hx, hy] = headAt(johnX, PY, 1.02, aside > 0.3);
      voice(hx + 24, hy + 4, cry, time, { spread: 3, s0: 0.6, dir: 1 });
      const walking = (come > 0 && come < 1) || (ahead > 0 && ahead < 1);

      /* v16a: from His fullness — the bowl comes down over Him and pours */
      const bowlK = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 3.9, 4.2, ease.in));
      const tip = es(t, 2.35, 2.7);
      pose(bowl, { x: JX, y: lerp(-500, 262, bowlK) - es(t, 3.9, 4.2) * 200, r: Math.sin(t * 3.2) * 1.2 * tip, o: bowlK > 0.01 ? 1 : 0 });
      /* v16b: grace upon grace — wave after wave */
      waves.forEach((w, i) => {
        const a = 2.4 + i * 0.42, k = es(t, a, a + 0.45, ease.out);
        pose(w, { x: JX, y: 270, s: 0.15 + k * 0.85, o: seg(t, a, a + 0.05) * (1 - es(t, a + 0.6, a + 0.9)) * 0.95 });
      });
      people.forEach((m, i) => {
        const recv = es(t, 2.5 + (i % 3) * 0.1, 2.8 + (i % 3) * 0.1);
        const more = es(t, 3.05 + (i % 3) * 0.1, 3.3 + (i % 3) * 0.1);
        const see = es(t, 7.1, 7.4);
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 20 + recv * 50 + see * 20, armB: recv * 30 + see * 100 * (i % 2), head: -recv * 6 - es(t, 6.05, 6.3) * 14 + es(t, 7.1, 7.4) * 10, blink: blinkAt(time, m.seed) });
        const [lx, ly] = hand(m.x, m.y, m.s, m.x > JX, 20 + recv * 50 + see * 20);
        pose(cupLights[i], { x: lx, y: ly - 10, s: recv * (0.8 + more * 0.5 + see * 0.3), o: recv });
      });

      /* v17a: the Law through Moses — a stone-grey plate */
      const mk = es(t, 4.05, 4.4, ease.out) * (1 - es(t, 5.95, 6.2, ease.in));
      pose(moses, { x: 540, y: lerp(-500, 320, mk), r: Math.sin(t * 2.8) * 1.2, o: mk > 0.01 ? 1 : 0 });
      pose(lawTag, { x: 540, y: lerp(-500, 462, mk), r: Math.sin(t * 3.6 + 1) * 1.6, o: mk > 0.01 ? 1 : 0 });
      /* v17b: grace and truth through Jesus Christ */
      const nk = es(t, 5.05, 5.4, ease.out) * (1 - es(t, 5.95, 6.2, ease.in));
      pose(nameEl, { x: JX, y: lerp(-500, 330, nk), r: Math.sin(t * 3.2) * 1.2, o: nk > 0.01 ? 1 : 0 });
      const gk = es(t, 5.2, 5.55, ease.out) * (1 - es(t, 5.95, 6.2, ease.in));
      pose(graceEl, { x: 1210, y: lerp(-500, 390, gk), r: Math.sin(t * 3.6 + 2) * 1.6, o: gk > 0.01 ? 1 : 0 });

      /* Jesus */
      const open = es(t, 5.1, 5.4) * (1 - es(t, 6.0, 6.3)) + es(t, 7.1, 7.45);
      jesus.set({
        x: jxs, y: PY, s: 1.05, flip: false, o: seg(t, 1.02, 1.08), walk: walking ? jxs * 0.05 : undefined,
        armF: 14 + es(t, 2.1, 2.4) * 40 + open * 50 - es(t, 3.9, 4.1) * 30, armB: 10 + es(t, 2.1, 2.4) * 40 + open * 90 - es(t, 3.9, 4.1) * 30,
        head: -es(t, 6.05, 6.3) * 10 + es(t, 7.1, 7.4) * 10, blink: blinkAt(time, 2),
      });
      const ring = seg(t, 1.55, 1.95);
      drawRing(ringEl, ease.io(ring));
      pose(ringEl, { x: JX, y: PY - 110, s: 1 + ring * 0.1, r: t * 12, o: (ring > 0 ? 1 : 0) * (1 - es(t, 2.05, 2.4) * 0.7) * (1 - es(t, 3.9, 4.2)) });
      const shine = Math.max(es(t, 2.1, 2.5) * (1 - es(t, 3.9, 4.2)) * 0.7, es(t, 5.05, 5.4) * (1 - es(t, 6.0, 6.3)) * 0.8, es(t, 7.1, 7.5));
      pose(jGlow, { x: JX, y: PY - 110, s: 0.6 + shine * 0.9, o: Math.max(seg(t, 1.6, 2.0) * 0.4, shine) });
      pose(jRays, { x: JX, y: PY - 110, s: 0.4 + shine * 0.8, r: t * 4, o: es(t, 7.2, 7.6) * 0.9 });

      /* v18a: no one has ever seen God — a cloud comes down; v18b: it parts over the Son */
      const down = es(t, 6.05, 6.5, ease.out);
      const part = es(t, 7.05, 7.5);
      bankL.shift(-part * 700, lerp(-700, 0, down));
      bankR.shift(part * 700, lerp(-700, 0, down));
      const hk = es(t, 6.3, 6.6);
      pose(hDisc, { x: 800, y: 160, s: 1, o: hk });
      pose(hGlow, { x: 800, y: 160, s: 1 + part * 0.5, o: hk });
      pose(hRays, { x: 800, y: 160, s: 0.6 + part * 0.6, r: -t * 3, o: part });
      pose(beam, { o: part * 0.5 });

      S.cam.y = -30 * es(t, 5.9, 6.4) + 30 * es(t, 7.0, 7.5) * 0;
      S.cam.z = 1.04 - es(t, 3.9, 4.3) * 0.06 + es(t, 7.0, 7.5) * 0.02;
    };
  },
};
