// Łk 5,8–10 — the two boats lie low in the water, heaped with silver. Simon sees it and falls on his knees among the
// fish at Jesus' knees; the light round Jesus grows and Simon lifts his hand against it, head bowed, a dark knot at his
// heart: "Depart from me, Lord, for I am a sinful man." Astonishment runs through them all — Andrew throws up his
// arms, glints run over the heaps — and through James and John, the sons of Zebedee, in the second boat: their tag
// comes down, and a rope ties the two boats together (Simon's partners). Then Jesus leans down to Simon and lifts his
// face: "Do not be afraid; from now on you will be catching people" — the dark knot scatters into sparks and over
// the lake a great net of gold paper unfolds, full of little people.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  deepSet, DP, CREW_A, withFace, faceBits, headAt, hand, kf, nameTag, darkKnot, sparkle, goldNet, rayBurst, speech,
  PETER_W, JAMES_W, MORNING, es, ease, bump, seg, fade, tr, PI,
} from './lib.js';

const BA0 = { x: DP.AX, y: DP.AY + 44, s: 1 };
const BB0_L = { x: DP.BX, y: DP.AY + 44, s: 0.9 };
const KX = 18;                                   // where Simon kneels in the boat (local)

export default {
  id: 'lk5-sinful',
  beats: [
    { v: 8, text: 'Widząc to Szymon Piotr przypadł Jezusowi do kolan' },
    { v: 8, cont: true, text: 'i rzekł: «Odejdź ode mnie, Panie, bo jestem człowiek grzeszny».' },
    { v: 9 },
    { v: 10, text: 'jak również Jakuba i Jana, synów Zebedeusza, którzy byli wspólnikami Szymona.' },
    { v: 10, cont: true, text: 'Lecz Jezus rzekł do Szymona: «Nie bój się, odtąd ludzi będziesz łowił».' },
  ],
  cam: { x: [-640, 160], y: [0, 160], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    const BB0 = PH ? { ...BB0_L, x: 420 } : BB0_L;   // phone: the partners' boat alongside, on the screen
    const D = deepSet(S, {
      skyCols: MORNING, deep: 1, heaps: true,
      crewA: [
        { k: 'andrew', markup: withFace(person(c, CAST.andrew), faceBits(c)), x: CREW_A.andrew, dy: -8, s: 0.94 },
        { k: 'peter', markup: withFace(person(c, PETER_W), faceBits(c)), x: CREW_A.peter, dy: -8, s: 0.96 },
        { k: 'kneel', markup: withFace(person(c, { ...PETER_W, pose: 'kneel' }), faceBits(c)), x: KX, dy: -28, s: 0.96, front: true },
        { k: 'jesus', o: { ...CAST.jesus, pose: 'sit' }, x: CREW_A.jesus, dy: -34, s: 1.0 },
      ],
      crewB: [
        { k: 'john', o: CAST.john, x: -80, dy: -8, s: 0.94 },
        { k: 'james', o: JAMES_W, x: 40, dy: -8, s: 0.96 },
      ],
    });
    const { K, A, B, uwL, fx } = D;

    /* the light round Jesus (behind the boat, never over the figures) */
    const glow = uwL.add(`<g><circle r="230" fill="url(#halo-glow)"/>${rayBurst(c, { n: 20, r0: 50, r1: 250, spread: 0.035, o: 0.26 })}</g>`);

    /* Simon's dark knot, the sparks it scatters into */
    const knot = fx.add(`<g>${darkKnot(c, 18)}</g>`);
    const sparks = Array.from({ length: 7 }, (_, i) => ({ i, a: (i / 7) * PI * 2, el: fx.add(`<g>${sparkle(c, 9 + (i % 3) * 3)}</g>`) }));
    const glints = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(`<g>${sparkle(c, 10 + (i % 3) * 3)}</g>`), dx: c.rr(-110, 110), boat: i % 2 }));
    const kSad = A.crew.kneel.p.el.querySelector('[data-part="sad"]');
    const kTear = A.crew.kneel.p.el.querySelector('[data-part="tear"]');

    /* James and John's tag; the rope between the boats */
    const TL = S.layer({ par: 0.45, sh: 6 });
    const tag = TL.add(`<g>${nameTag(c, [tr('Jakub i Jan,', 'James and John,'), tr('synowie Zebedeusza,', 'sons of Zebedee,'), tr('wspólnicy Szymona', 'partners with Simon')], { size: 18 })}<path d="M0 -1600V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/></g>`);
    const rope = fx.add(`<path d="${c.ribbon([[0, 0], [0.5, 0.06], [1, 0]].map(([x, y]) => [x * 100, y * 100]), 3)}" fill="${C.rope}"/>`);

    /* "from now on you will be catching people": the golden net over the lake */
    const netL = S.layer({ par: 0.2, sh: 5, rise: 0 });
    const gnet = netL.add(`<g><ellipse cx="260" cy="60" rx="330" ry="150" fill="url(#halo-glow)" opacity=".7"/>${goldNet(c, { w: 520, h: 180, n: 11 })}<path d="M0 -1600V0M520 -1600V0" stroke="rgba(233,196,111,.6)" stroke-width="1.4"/></g>`);

    return (t, time) => {
      const T = time;
      K.idle(T, { sunY: 120 });
      D.water(T, 1, 0.52);
      const BA = { ...BA0, y: BA0.y + Math.sin(T * 1.2) * 1.6, r: Math.sin(T * 0.9) * 0.6 };
      const BB = { ...BB0, y: BB0.y + Math.sin(T * 1.3 + 1) * 1.6, r: Math.sin(T * 0.8 + 2) * 0.6 + 2 };
      A.set(BA); B.set(BB);
      A.fill(BA, 0.85, -80);
      B.fill(BB, 1);

      /* v8a — Simon falls at Jesus' knees */
      const fall = es(t, 0.2, 0.28);
      const bow = es(t, 0.28, 0.6);
      const ward = es(t, 1.1, 1.35) * (1 - es(t, 4.2, 4.5));
      const lookUp = es(t, 4.25, 4.55);
      const rise = es(t, 4.62, 4.7);
      A.put('peter', BA, { flip: false, o: 1 - fall + rise, lx: rise ? KX - 10 : CREW_A.peter, armF: 20 + bump(t, 0, 0.3) * 50 + rise * 20, armB: 10 + rise * 60, head: -bump(t, 0.05, 0.3) * 10 - rise * 4, blink: blinkAt(T, 3) });
      A.put('kneel', BA, { flip: false, o: fall * (1 - rise), armF: 40 + bow * 30 - ward * 20 + lookUp * 20, armB: 20 + ward * 130, lean: bow * 30 * (1 - lookUp) + ward * 6, head: bow * 22 * (1 - lookUp) - lookUp * 14, blink: blinkAt(T, 3) });
      fade(kSad, bow * (1 - lookUp));
      fade(kTear, es(t, 1.4, 1.6) * (1 - lookUp));
      const reach = es(t, 4.1, 4.4) * (1 - es(t, 4.75, 4.9) * 0.4);
      A.put('jesus', BA, { flip: true, armF: 20 + reach * 60 + es(t, 4.7, 4.9) * 30, armB: 12 + bump(t, 0.2, 0.9) * 20 + es(t, 4.72, 4.95) * 110, lean: -reach * 8, head: 6 + reach * 8 - es(t, 4.7, 4.9) * 10, blink: blinkAt(T) });
      const [jx, jy] = headAt(...A.at(BA, CREW_A.jesus, -34), 1.0, true, 62);
      const light = 0.35 + es(t, 1.05, 1.4) * 0.5 + es(t, 4.1, 4.5) * 0.2;
      pose(glow, { x: jx, y: jy + 10, s: 0.8 + light * 0.4 + (T ? Math.sin(T * 1.3) * 0.02 : 0), r: T * 2, o: light });

      /* v8b — the dark knot at Simon's heart; it scatters into sparks when Jesus speaks (v10b) */
      const [kx, ky] = A.at(BA, KX + 12, -28 - 100 * 0.96);
      const kk = es(t, 1.15, 1.4, ease.back) * (1 - es(t, 4.35, 4.5));
      pose(knot, { x: kx, y: ky, s: kk, r: T ? Math.sin(T * 2) * 8 : 0, o: kk > 0.01 ? 1 : 0 });
      sparks.forEach((sp) => {
        const k = es(t, 4.35, 4.85);
        pose(sp.el, { x: kx + Math.cos(sp.a) * k * 70, y: ky + Math.sin(sp.a) * k * 50 - k * 40, s: bump(t, 4.35, 4.95), r: T * 60, o: bump(t, 4.35, 4.95) });
      });

      /* v9 — astonishment: arms thrown up, glints running over the heaps */
      const awe = es(t, 2.05, 2.3) * (1 - es(t, 4.0, 4.3) * 0.7);
      A.put('andrew', BA, { flip: false, armF: 30 + awe * 90, armB: 20 + awe * 140, head: -awe * 8, lean: -awe * 4, blink: blinkAt(T, 2) });
      const aSad = A.crew.andrew.p.el.querySelector('[data-part="sad"]');
      fade(aSad, 0);
      const awe2 = es(t, 2.2, 2.45);
      B.put('james', BB, { flip: false, armF: 30 + awe2 * 80, armB: 20 + awe2 * 150, head: -awe2 * 8, blink: blinkAt(T, 4) });
      B.put('john', BB, { flip: false, armF: 30 + awe2 * 100, armB: 20 + awe2 * 120 + bump(t, 3.1, 3.6) * 20, head: -awe2 * 6, blink: blinkAt(T, 5) });
      glints.forEach((g) => {
        const k = ((T * 0.6 + g.i / 8) % 1);
        const [x, y] = (g.boat ? B : A).at(g.boat ? BB : BA, g.dx + (g.boat ? 0 : -60), -96);
        pose(g.el, { x, y: y - bump(k, 0, 1) * 10, s: bump(k, 0, 1) * 0.9, r: T * 40, o: es(t, 2.05, 2.3) * (1 - es(t, 4.1, 4.3)) });
      });

      /* v10a — James and John, the sons of Zebedee, Simon's partners: their tag, the rope between the boats */
      const tk = es(t, 3.1, 3.45, ease.out) * (1 - es(t, 3.95, 4.2, ease.in));
      pose(tag, { x: BB.x + 70, y: lerp(-500, 330, tk), r: T ? Math.sin(T * 0.8) * 1.4 : 0, o: tk > 0.01 ? 1 : 0 });
      const [r0x, r0y] = B.at(BB, 175, -64), [r1x, r1y] = A.at(BA, -185, -66);
      const rk = es(t, 3.25, 3.6);
      pose(rope, { x: r0x, y: r0y, sx: (Math.hypot(r1x - r0x, r1y - r0y) / 100) * rk, sy: 1, r: (Math.atan2(r1y - r0y, r1x - r0x) * 180) / PI, o: rk > 0.01 ? 1 : 0 });

      /* v10b — "from now on you will be catching people": the golden net unfolds over the lake */
      const nk = es(t, 4.4, 4.85, ease.out);
      pose(gnet, { x: 480, y: lerp(-500, 230, es(t, 4.3, 4.6, ease.out)), sx: 0.1 + nk * 0.9, sy: 1, r: T ? Math.sin(T * 0.7) * 1 : 0, o: es(t, 4.3, 4.35) });

      S.cam.x = kf(t, PH ? [[0, 60], [0.5, 80], [1.9, 90], [2.3, -60], [2.7, -290], [3.0, -320], [3.9, -310], [4.3, -100], [5, -80]] : [[0, 60], [0.5, 80], [1.9, 90], [2.3, -60], [3.0, -500], [3.9, -480], [4.3, -100], [5, -80]]);
      S.cam.y = kf(t, [[0, 90], [1.0, 70], [2.3, 80], [3.0, 70], [4.3, 40], [5, 20]]);
      S.cam.z = kf(t, [[0, 1.14], [0.6, 1.2], [1.9, 1.22], [2.3, 1.06], [3.0, 1.12], [3.9, 1.12], [4.3, 1.04], [5, 1.02]]);
    };
  },
};
