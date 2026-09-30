// J 7,30–32 — the leaders reach out to seize Him, but their hands stop at a ring of light on the paving:
// an hourglass comes down, sand still above — His hour had not yet come. Many in the crowd believe: little hearts
// light up over their heads, and they count the signs He has done — five golden medallions on a string: "Will the
// Christ do more signs than these?" The Pharisees hear the crowd murmuring (hands cupped to their ears); the chief
// priests come, and together they send the Temple guard — officers with spears march in.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  feastCourt, PH, priest, officerOpts, spear, townMan, townWoman, pilgrim, headAt, hand, voiceRings, say, strip, nameTag, heart, signBadge,
  hourglassRig, hangAt, vpose, FEAST, tr, PI,
} from './lib.js';

const JX = 800;
const CXW = [400, 474, 548, 622];
const PXW = [990, 1072, 1154];
const OX = [920, 1000, 1080];

export default {
  id: 'j7-hour',
  beats: [
    { v: 30, text: 'Zamierzali więc Go pojmać,' },
    { v: 30, cont: true, text: 'jednakże nikt nie podniósł na Niego ręki, ponieważ godzina Jego jeszcze nie nadeszła.' },
    { v: 31, text: 'Natomiast wielu spośród tłumu uwierzyło w Niego' },
    { v: 31, cont: true, text: 'i mówili: «Czyż Mesjasz, kiedy przyjdzie, uczyni więcej znaków, niż On uczynił?»' },
    { v: 32, text: 'Faryzeusze usłyszeli, że tłum tak mówił o Nim w podnieceniu.' },
    { v: 32, cont: true, text: 'Kapłani więc wraz z faryzeuszami wysłali strażników celem pojmania Go.' },
  ],
  cam: { x: [-40, 60], y: [-60, 40], z: [0.85, 1.16] },
  build(S) {
    const c = S.c;
    const ph = (wide, phone) => (S.portrait ? phone : wide);   // phone: plates and people at the sides come inward
    const CX = ph(CXW, [466, 528, 590, 652]), PX = ph(PXW, [990, 1058, 1126]);
    const set = feastCourt(S, { skyCols: FEAST });
    const F = set.F + 20;

    /* the ring of light around Him (on the paving, behind the people) */
    const RL = S.layer({ par: 0.49, sh: 0, flat: true });
    const ring = RL.add(`<g><ellipse cx="0" cy="0" rx="120" ry="24" fill="none" stroke="${C.sun}" stroke-width="5" opacity=".9"/><ellipse cx="0" cy="0" rx="120" ry="24" fill="#fff3cf" opacity=".35"/><path d="M-120 0C-120 -260 120 -260 120 0" fill="url(#halo-glow)" opacity=".6"/></g>`);

    /* people */
    const P0 = S.layer({ par: 0.48, sh: 4 });   // the back row: priests arriving, Pharisees stepping back
    const priests = [0, 1].map((i) => ({ i, p: S.puppet(P0.add(priest(c, i))), seed: c.rr(0, 9) }));
    const P = S.layer({ par: 0.5, sh: 5 });
    const crowdL = CX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(i === 3 ? pilgrim(c, 5, { lulavA: 60 }) : person(c, i % 2 ? townWoman(c) : townMan(c)))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const phs = PX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, PH(c, i)))) }));
    const offs = OX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, officerOpts(i)))), sp: P.add(`<g>${spear(c, 240)}</g>`) }));
    set.front();

    /* words */
    const X = S.layer({ par: 0.5, sh: 6 });
    const hg = hourglassRig(X, c, 110);
    const hourT = X.add(`<g>${strip(c, tr('Jego godzina jeszcze nie nadeszła', 'His hour had not yet come'), { size: 16 })}</g>`);
    const hearts = CX.map(() => X.add(`<g>${heart(c, 13)}</g>`));
    const believeT = X.add(`<g>${strip(c, tr('wielu uwierzyło', 'many believed'), { size: 17 })}</g>`);
    const signs = [1, 2, 3, 4, 5].map((n, i) => ({ i, el: X.add(`<g><path d="M0 -1400V-40" stroke="rgba(74,54,34,.5)" stroke-width="1.1" fill="none"/><g transform="scale(.46)">${signBadge(c, n, { icon: '' })}</g></g>`) }));
    const more = X.add(`<g>${say(c, tr(['Czy Mesjasz uczyni', 'więcej znaków?'], ['Will the Christ do', 'more signs than these?']), { size: 18, side: 1 })}</g>`);
    const murmur = X.add(`<g>${strip(c, tr('szemranie tłumu', 'the crowd murmuring'), { size: 16 })}</g>`);
    const cup = voiceRings(X, c, { n: 4, r: 26, w: 4, color: shade(C.ochre, 0.1), both: false });
    const sentT = hanging(X, nameTag(c, tr(['wysłali', 'strażników'], ['they sent', 'officers']), { size: 18 }), { x: 1060, y: 330, len: 600 });

    return (t, time) => {
      const T = time;
      set.update(t, T, { lit: 0.25 });

      /* Jesus: calm at the centre */
      jesus.set({ x: JX, y: F, s: 1.04, flip: t > 4 ? true : false, armF: 20 + bump(t, 2.1, 3.9) * 40, armB: 10, head: -2 + bump(t, 1.05, 1.9) * 4, blink: blinkAt(T, 1) });

      /* v30 — they reach to seize Him; the ring stops their hands */
      const reach = es(t, 0.1, 0.55) * (1 - es(t, 1.8, 2.1));
      const stop = es(t, 1.05, 1.25);
      const back = es(t, 3.95, 4.3), rear = es(t, 5.0, 5.3);
      phs.forEach((m) => {
        const x = m.x - reach * (m.i === 0 ? 70 : 40) + stop * (m.i === 0 ? 18 : 10) + rear * 40;
        const ear = m.i < 2 ? es(t, 4.1, 4.3) * (1 - es(t, 4.95, 5.1)) : 0;
        m.p.set({ x, y: F + (m.i % 2) * 6 - rear * 26, s: 0.98 - rear * 0.06, flip: true, armF: 20 + reach * 70 * (m.i < 2 ? 1 : 0.5) - stop * 20 * reach, armB: 10 + ear * 150, head: stop * reach * 6 + ear * 10, lean: -reach * 6 + stop * 6 * reach, blink: blinkAt(T, m.seed) });
      });
      const rg = es(t, 1.0, 1.25) * (1 - es(t, 2.0, 2.2));
      vpose(ring, { x: JX, y: F + 4, s: 0.7 + rg * 0.3, o: rg });
      const hk = es(t, 1.2, 1.5, ease.out), hu = es(t, 1.95, 2.1, ease.in);
      const hy = lerp(-300, 330, hk) - hu * 800;
      if (hk > 0 && hu < 1) pose(hg.el, { x: 800, y: hy, r: Math.sin(T * 0.9) * 1.2, o: 1 }); else fade(hg.el, 0);
      hg.set(0.8, 1);
      vpose(hourT, { x: 800, y: hy + 82, o: hk > 0 && hu < 1 ? seg(t, 1.4, 1.5) : 0 });

      /* v31 — many believe; the signs */
      crowdL.forEach((m, i) => {
        const bel = es(t, 2.1 + i * 0.08, 2.3 + i * 0.08);
        m.p.set({ x: m.x, y: F + 6 + (m.i % 2) * 6, s: 0.95, armF: m.i === 3 ? 60 : 16 + bel * 30 + bump(t, 3.1, 3.9) * (m.i === 1 ? 60 : 0), armB: 10 + bel * 20, head: -bel * 6 - bump(t, 3.1, 3.9) * 6, blink: blinkAt(T, m.seed) });
        const [hx, hy2] = headAt(m.x, F + 6 + (m.i % 2) * 6, 0.95, false);
        vpose(hearts[i], { x: hx + 2, y: hy2 - 46 + Math.sin(T * 2 + i) * 2, s: es(t, 2.15 + i * 0.08, 2.35 + i * 0.08, ease.back), o: seg(t, 2.15 + i * 0.08, 2.2 + i * 0.08) * (1 - es(t, 4.9, 5.1)) });
      });
      vpose(believeT, { x: ph(510, 560), y: 420, o: es(t, 2.4, 2.55) * (1 - es(t, 2.95, 3.05)) });
      signs.forEach((sg) => {
        const k = es(t, 3.05 + sg.i * 0.07, 3.3 + sg.i * 0.07, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
        pose(sg.el, { x: 610 + sg.i * 95, y: lerp(-300, 330 + (sg.i % 2) * 24, k) + Math.sin(T * 0.9 + sg.i) * 2, o: k > 0 ? 1 : 0 });
      });
      const [bx, by] = headAt(CX[1], F + 12, 0.95, false);
      vpose(more, { x: bx + 16, y: by - 18, s: es(t, 3.2, 3.4, ease.back) * 0.95, o: seg(t, 3.2, 3.25) * (1 - es(t, 3.95, 4.05)) });

      /* v32a — the Pharisees hear the murmuring */
      const mr = es(t, 4.05, 4.2) * (1 - es(t, 4.95, 5.05));
      vpose(murmur, { x: ph(520, 560), y: 430, o: mr });
      const [ex, ey] = headAt(CX[3], F + 12, 0.95, false);
      cup(ex + 30, ey, mr, T, { dir: 1, spread: 2.6, speed: 0.6 });

      /* v32b — the chief priests come; together they send the officers */
      const pin = es(t, 5.0, 5.35, ease.sine);
      priests.forEach((m) => {
        const x = lerp(1500 + m.i * 60, ph(1110, 1086) + m.i * ph(76, 62), pin);
        m.p.set({ x, y: F - 30 + m.i * 4, s: 0.92, flip: true, walk: pin > 0 && pin < 1 ? x * 0.05 : undefined, armF: 20 + bump(t, 5.35, 5.9) * 70 * (m.i ? 0 : 1), armB: 10, head: 4, blink: blinkAt(T, m.seed), o: pin > 0 ? 1 : 0 });
      });
      const march = es(t, 5.25, 5.8, ease.sine);
      offs.forEach((m) => {
        const x = lerp(1560 + m.i * 90, m.x, march);
        const mv = march > 0 && march < 1;
        m.p.set({ x, y: F + 10 + (m.i % 2) * 6, s: 0.98, flip: true, walk: mv ? x * 0.05 + m.i : undefined, armF: 40, armB: 12, blink: blinkAt(T, m.seed), o: march > 0 ? 1 : 0 });
        const [shx, shy] = hand(x, F + 10 + (m.i % 2) * 6, 0.98, true, 40 + (mv ? -Math.sin(x * 0.05 + m.i) * 14 : 0));
        vpose(m.sp, { x: shx, y: shy, s: 0.98, r: -4, o: march > 0 ? 1 : 0 });
      });
      const sk = es(t, 5.5, 5.75, ease.out);
      hangAt(sentT, ph(1060, 1010), lerp(-300, 330, sk), T, sk > 0 ? 1 : 0, 1.3, 0.9, 3);

      S.cam.x = bump(t, 4.9, 6.4) * 40;
      S.cam.y = 30;
      S.cam.z = (1.12) * (S.portrait ? 0.85 : 1);   // phone: a wider view, so the plates and the people at the sides fit
    };
  },
};
