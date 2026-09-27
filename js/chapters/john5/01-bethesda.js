// J 5,1–4 — the curtains open on a feast: bunting on the flies, pilgrims leading lambs through the Sheep
// Gate, and Jesus comes up to Jerusalem. The pool of Bethesda: its name drops over the turquoise water and a
// plan of the five porticoes lights up porch by porch. The sick rise into view — the blind, the lame, the
// paralysed — and all turn their faces to the water, waiting. An angel comes down on a golden string and
// gently stirs the pool; rings spread over it; the first one in (a lame man with a crutch) is healed.
import { C, person, CAST, blinkAt, lerp, curtains, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr, pose } from '../../core/anim.js';
import {
  bethesdaSet, bethesdaIdle, backSick, BZ, FEAST, sickLook, blindBand, withFace, lyingOn, crutch, bunting, ripple, planPlate, hang2,
  hungWord, card, smallAngel, sheep, sparkle, spark, vis, kf, moving, headAt, handAt, staff, sandGlass, crowdPerson, tr, PI,
} from './lib.js';

const F = BZ.floor;

export default {
  id: 'j5-bethesda',
  beats: [
    { cover: true },
    { v: 1, text: 'Potem nastąpiło święto żydowskie' },
    { v: 1, cont: true, text: 'i Jezus udał się do Jerozolimy.' },
    { v: 2, text: 'W Jerozolimie zaś znajduje się sadzawka Owcza, nazwana po hebrajsku Betesda,' },
    { v: 2, cont: true, text: 'zaopatrzona w pięć krużganków.' },
    { v: 3, text: 'Wśród nich leżało mnóstwo chorych: niewidomych, chromych, sparaliżowanych,' },
    { v: 3, cont: true, text: '<którzy czekali na poruszenie się wody.' },
    { v: 4, text: 'Anioł bowiem zstępował w stosownym czasie i poruszał wodę.' },
    { v: 4, cont: true, text: 'A kto pierwszy wchodził po poruszeniu się wody, doznawał uzdrowienia niezależnie od tego, na jaką cierpiał chorobę>.' },
  ],
  cam: { x: [-40, 120], y: [-70, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = bethesdaSet(S, { skyCols: FEAST });
    backSick(S, set);

    /* pilgrims with lambs pass along the far walk, through the Sheep Gate */
    const pilL = S.layer({ par: 0.24, sh: 3 });
    const pil = [0, 1, 2].map((i) => ({ i, p: S.puppet(pilL.add(person(c, { ...crowdPerson(c), mantle: null }))) }));
    const lambs = [0, 1, 2].map((i) => ({ i, el: pilL.add(`<g>${sheep(c)}</g>`) }));

    /* the one who goes down first: on the walk (front) and in the water (behind the waterline) */
    const A = set.actL;
    const bathO = sickLook(c, 1);
    const bather = S.puppet(A.add(person(c, { ...bathO, holdB: `<g transform="rotate(180) translate(0 -12)">${crutch(c)}</g>` })));
    set.waterline();
    const walker = S.puppet(A.add(person(c, { ...bathO, pose: 'sit' })));
    const walkerUp = S.puppet(A.add(person(c, { ...bathO, holdB: `<g transform="rotate(180) translate(0 -12)">${crutch(c)}</g>` })));
    const crutchDown = A.add(`<g>${crutch(c)}</g>`);

    /* the sick along the near walk: rise into view */
    const SICK = [
      { kind: 'blind', x: 470, flip: false, y: F + 6 },
      { kind: 'lie', x: 590, y: F + 8 },
      { kind: 'lame', x: 900, flip: true, y: F + 4 },
      { kind: 'lie', x: 1260, y: F + 10, flip: true },
      { kind: 'blind', x: 1390, flip: true, y: F + 8 },
    ].map((m, i) => {
      const o = sickLook(c, i + 5);
      let el;
      if (m.kind === 'lie') el = A.add(lyingOn(c, o, { s: 0.7, w: 176, eyes: i % 2 ? 'closed' : 'open' }));
      else if (m.kind === 'blind') el = A.add(withFace(person(c, { ...o, pose: 'sit', eyes: 'closed' }), blindBand(c)));
      else el = A.add(person(c, { ...o, pose: 'sit' }));
      const fig = m.kind === 'lie' ? el.querySelector('.fig') : el;
      const st = m.kind === 'blind' ? A.add(`<g>${staff(c, 150)}</g>`) : null;
      return { ...m, i, el, st, p: S.puppet(fig), seed: c.rr(0, 9) };
    });
    const lameCrutch = A.add(`<g>${crutch(c)}</g>`);

    const jesus = S.puppet(A.add(person(c, { ...CAST.jesus })));

    /* ripples and light where the angel touches the water */
    const RX = 990, RY = 598;
    const glowW = set.rippleL.add(`<g><ellipse rx="220" ry="54" fill="url(#halo-glow)"/></g>`);
    const rings = [0, 1, 2, 3].map((i) => ({ i, el: set.rippleL.add(`<g>${ripple(c, 40, C.foam, 3.4)}</g>`) }));
    const healGlow = set.rippleL.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);

    /* the flies: bunting, names, the plan, the tags, the angel */
    const X = set.flyL;
    const bunts = [[-200, 150, 1000, 60], [700, 190, 1000, 50]].map(([x, y, w, sag], i) => ({ x, y, i, el: X.add(`<g><path d="M0 -1600V0M${w} -1600V0" stroke="rgba(74,54,34,.45)" stroke-width="1.1" fill="none"/>${bunting(c, w, sag)}</g>`) }));
    const feastT = X.add(hungWord(c, tr('święto', 'a feast'), { size: 26 }));
    const jerT = X.add(hungWord(c, tr('Jerozolima', 'Jerusalem'), { size: 22 }));
    const nameT = X.add(hungWord(c, 'Betesda', { size: 34 }));
    const subT = X.add(hungWord(c, tr('sadzawka Owcza', 'by the Sheep Gate'), { size: 18 }));
    const P = planPlate(c);
    const plan = X.add(`<g>${hang2(`${P.base}${P.cols.map((m, i) => `<g data-i="${i}" opacity="0">${m}</g>`).join('')}`, 120, 300)}</g>`);
    const planCols = Array.from(plan.querySelectorAll('[data-i]'));
    const planT = X.add(hungWord(c, tr('pięć krużganków', 'five porches'), { size: 20 }));
    const cardsDef = [
      [tr('niewidomi', 'the blind'), `<g transform="scale(.9)"><path d="${c.cut(c.circ(0, -4, 22, 20), 0.3, 3)}" fill="${C.skin2}"/><g transform="translate(-2 -2)">${blindBand(c)}</g></g>`, 470],
      [tr('chromi', 'the lame'), `<g transform="translate(0 -40) scale(.5)">${crutch(c)}</g>`, 800],
      [tr('sparaliżowani', 'the paralysed'), `<g transform="translate(0 6) scale(.42)">${lyingOn(c, sickLook(c, 2), { s: 0.7, w: 176 })}</g>`, 1130],
    ];
    const cards = cardsDef.map(([w, icon, x], i) => ({ i, x, el: X.add(`<g>${hang2(card(c, icon, w, { w: 150, h: 120 }), 40, 300)}</g>`) }));
    const glass = X.add(`<g>${hang2(`<g transform="translate(0 50)">${sandGlass(c, 80)}</g>`, 0.01, 300)}</g>`);
    const angelGlow = X.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const angel = X.add(smallAngel(c));
    const sparks = [0, 1, 2, 3, 4].map(() => X.add(`<g>${spark(c, 10)}</g>`));

    const cur = curtains(S);
    const JK = [[1.9, -260], [2.85, 720]];
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      bethesdaIdle(set, T);

      /* v1a — the feast: bunting comes down, a tag, pilgrims lead lambs through the gate */
      bunts.forEach((b) => vis(b.el, { x: b.x, y: b.y - (1 - es(t, 0.9 + b.i * 0.12, 1.4 + b.i * 0.12, ease.out)) * 420 }));
      const ft = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 2.0, 2.3));
      vis(feastT, { x: 560, y: 270 - (1 - ft) * 420, r: Math.sin(T * 0.8) * 1.2, o: ft > 0.01 ? 1 : 0 });
      const pw = es(t, 0.9, 3.9, ease.sine);
      pil.forEach((m) => {
        const x = lerp(250 - m.i * 70, 1700 - m.i * 70, pw);
        m.p.set({ x, y: BZ.porticoY - 2, s: 0.46, walk: pw > 0 && pw < 1 ? x * 0.12 : undefined, armF: 30, blink: blinkAt(T, m.i), o: pw > 0 && pw < 1 ? 1 : 0 });
      });
      lambs.forEach((l) => {
        const x = lerp(290 - l.i * 70, 1740 - l.i * 70, pw);
        pose(l.el, { x, y: BZ.porticoY - 2 - Math.abs(Math.sin(x * 0.08)) * 2, s: 0.34, o: pw > 0 && pw < 1 ? 1 : 0 });
      });

      /* v1b — Jesus comes up to Jerusalem */
      const jx = kf(t, JK, ease.out);
      const jt = es(t, 2.2, 2.5, ease.out) * (1 - es(t, 2.9, 3.1));
      vis(jerT, { x: 880, y: 230 - (1 - jt) * 420, r: Math.sin(T * 0.7) * 1, o: jt > 0.01 ? 1 : 0 });
      const lookSick = es(t, 5.2, 5.6) * (1 - es(t, 6.8, 7.1));
      const watch = es(t, 7.0, 7.3);
      jesus.set({ x: jx, y: F + 14, s: 1.04, flip: false, walk: moving(t, JK) ? jx * 0.07 : undefined, armF: 14 + bump(t, 3.1, 4.0) * 40 + lookSick * 30, armB: 8 + lookSick * 20, head: -bump(t, 3.1, 4.0) * 4 + watch * 4 + lookSick * 6, blink: blinkAt(T, 1), o: seg(t, 1.9, 2.0) });

      /* v2a — the name over the water */
      const nt = es(t, 3.1, 3.45, ease.back) * (1 - es(t, 4.05, 4.3));
      vis(nameT, { x: 1000, y: 250 - (1 - nt) * 450, r: Math.sin(T * 0.7 + 1) * 1.2, o: nt > 0.01 ? 1 : 0 });
      vis(subT, { x: 1000, y: 312 - (1 - es(t, 3.3, 3.6, ease.out) * (1 - es(t, 4.05, 4.3))) * 450, r: Math.sin(T * 0.8 + 2) * 1.5, o: nt > 0.01 ? 1 : 0 });
      /* v2b — the plan of the five porches: one by one */
      const pk = es(t, 4.0, 4.3, ease.out) * (1 - es(t, 4.95, 5.2, ease.in));
      vis(plan, { x: 800, y: 330 - (1 - pk) * 560, s: 0.8, r: Math.sin(T * 0.6) * 0.6, o: pk > 0.01 ? 1 : 0 });
      planCols.forEach((g, i) => attr(g, 'opacity', es(t, 4.25 + i * 0.1, 4.33 + i * 0.1).toFixed(2)));
      vis(planT, { x: 800, y: 455 - (1 - pk) * 560, s: es(t, 4.7, 4.85, ease.back), o: es(t, 4.7, 4.75) * pk });

      /* v3a — the sick come into view: the blind, the lame, the paralysed */
      const rise = (i) => es(t, 5.0 + i * 0.08, 5.35 + i * 0.08, ease.out);
      const wait = es(t, 6.0, 6.4);
      const stir = es(t, 7.4, 7.7);
      set.sickBackL.fade(es(t, 5.0, 5.4));
      set.sickBackL.shift(0, (1 - es(t, 5.0, 5.4)) * 40);
      SICK.forEach((m) => {
        const k = rise(m.i);
        const y = m.y + (1 - k) * 160;
        const lean = -wait * 6 - stir * 8;
        if (m.kind === 'lie') {
          pose(m.el, { x: m.x, y, sx: m.flip ? -1 : 1, o: k > 0.01 ? 1 : 0 });
          m.p.set({ armF: 20 + stir * 60, armB: 10 + wait * 20, head: -wait * 20 - stir * 20, blink: blinkAt(T, m.seed) });
        } else m.p.set({ x: m.x, y, s: 0.92, flip: m.flip, armF: m.kind === 'blind' ? 50 : 20 + stir * 50, armB: 10 + stir * 30, head: wait * 8 + stir * 6, lean: m.flip ? lean : -lean, blink: blinkAt(T, m.seed), o: k > 0.01 ? 1 : 0 });
        if (m.st) { const [hx, hy] = handAt(m.x, y, 0.92, m.flip, 50, 'sit'); pose(m.st, { x: hx, y: hy + 60, o: k > 0.01 ? 1 : 0 }); }
      });
      pose(lameCrutch, { x: 900 - 46, y: F + 8 + (1 - rise(2)) * 160, r: -78, o: rise(2) > 0.01 ? 1 : 0 });
      cards.forEach((cd) => {
        const k = es(t, 5.15 + cd.i * 0.14, 5.45 + cd.i * 0.14, ease.back) * (1 - es(t, 6.05, 6.3));
        vis(cd.el, { x: cd.x, y: 170 - (1 - k) * 420, r: Math.sin(T * 0.8 + cd.i) * 1.5, o: k > 0.01 ? 1 : 0 });
      });
      /* v3b — waiting for the stirring of the water */
      const gk = es(t, 6.1, 6.4, ease.out) * (1 - es(t, 6.95, 7.15));
      vis(glass, { x: 800, y: 170 - (1 - gk) * 420, r: Math.sin(T * 0.7) * 2, o: gk > 0.01 ? 1 : 0 });

      /* v4a — the angel comes down and stirs the water */
      const ad = es(t, 7.0, 7.45, ease.out) * (1 - es(t, 8.55, 8.95, ease.in));
      const ay = lerp(-300, 468, ad) + Math.sin(T * 1.2) * 4 * ad;
      const ax = RX - 10 + Math.sin(T * 0.7) * 6;
      pose(angel, { x: ax, y: ay, s: 1.45, r: Math.sin(T * 0.9) * 3, o: ad > 0.01 ? 1 : 0 });
      vis(angelGlow, { x: ax, y: ay, s: 0.6 + ad * 0.5, o: ad });
      const touch = es(t, 7.45, 7.6);
      rings.forEach((r) => {
        const k = touch > 0 ? ((t - 7.45) * 0.9 + r.i / 4) % 1 : 0;
        const on = touch * (1 - es(t, 8.7, 9.0));
        vis(r.el, { x: RX, y: RY, s: 0.4 + k * 4.2, o: on * (1 - k) });
      });
      vis(glowW, { x: RX, y: RY, s: 0.6 + touch * 0.4, o: touch * (1 - es(t, 8.7, 9.0)) * 0.8 });

      /* v4b — the first one in is healed */
      const up = es(t, 7.95, 8.05);             // stands up on the walk
      const go = es(t, 8.02, 8.35, ease.in);    // hurries to the steps
      const inW = seg(t, 8.33, 8.38);           // swap: into the water
      const wade = es(t, 8.36, 8.5, ease.out);
      const healed = es(t, 8.52, 8.66, ease.out);
      walker.set({ x: 1150, y: F + 6, s: 0.92, flip: true, armF: 30 + stir * 40, armB: 20 + stir * 30, lean: -stir * 6, head: stir * 6, blink: blinkAt(T, 3), o: (1 - up) * rise(4) });
      pose(crutchDown, { x: 1150 - 50, y: F + 10 + (1 - rise(4)) * 160, r: -80, o: up > 0.5 ? 0 : rise(4) });
      const wx = lerp(1150, BZ.stepX, go);
      walkerUp.set({ x: wx, y: F + 6, s: 0.92, flip: true, walk: go > 0 && go < 1 ? wx * 0.12 : undefined, lean: -6, armB: 24, armF: 40, blink: blinkAt(T, 3), o: up * (1 - inW) });
      bather.set({ x: lerp(BZ.stepX, 1000, wade), y: lerp(F, 684, wade), s: 0.92, flip: true, armF: 30 + healed * 110, armB: 24 + healed * 140, head: -healed * 10, lean: -healed * 3, blink: blinkAt(T, 3), o: inW });
      vis(healGlow, { x: 1000, y: 560, s: 0.6 + healed * 0.8, o: healed * 0.9 });
      sparks.forEach((sp, i) => {
        const a = (i / 5) * PI * 2 + T * 0.4;
        const k = healed;
        vis(sp, { x: 1000 + Math.cos(a) * 70 * k, y: 510 + Math.sin(a) * 50 * k, s: 0.4 + k * 0.6, o: k * (0.6 + Math.sin(T * 3 + i) * 0.3) });
      });

      /* camera */
      S.cam.x = kf(t, [[0, 0], [1.0, 0], [2.0, -30], [2.9, 0], [4.0, 30], [5.0, 0], [6.0, 0], [7.0, 40], [8.2, 100]]);
      S.cam.y = kf(t, [[0, -40], [1.0, -60], [2.0, -20], [3.0, -10], [4.0, -40], [5.0, 20], [6.5, 20], [7.3, -20], [8.2, 10]]);
      S.cam.z = kf(t, [[0, 1], [1.0, 1.02], [3.0, 1.04], [4.0, 1.0], [5.0, 1.06], [7.0, 1.04], [8.2, 1.14]]);
    };
  },
};
