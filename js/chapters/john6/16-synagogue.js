// J 6,58–60 — the bread of light comes down again beside the old grey plate of the manna: not like the bread the
// fathers ate, who died — whoever eats this bread will live forever (rings without end on its plate). "He said
// these things in the synagogue, as He taught in Capernaum": the painted street drop comes down in front — the
// white synagogue, the signpost — and flies up again. Many of His disciples talk among themselves: "This is a
// hard saying! Who can listen to it?" — bubbles with heavy stones; some put their hands to their ears.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { synagogueInterior, synagogueFacade, folk, radiance, breadOfLight, eternityRing, drawRing, soulLight, SEPIA, mannaField, tent, hungWord, speech, GLYPH, murmur, glowDisc, headAt, kf, tr, PI } from './lib.js';

const JX = 800, FEET = 742;
const SEP = (a) => mix(a, '#c9ae86', 0.55);

export default {
  id: 'j6-synagogue',
  beats: [
    { v: 58, text: 'To jest chleb, który z nieba zstąpił - nie jest on taki jak ten, który jedli wasi przodkowie, a poumierali.' },
    { v: 58, cont: true, text: 'Kto spożywa ten chleb, będzie żył na wieki».' },
    { v: 59 },
    { v: 60, text: 'A spośród Jego uczniów, którzy to usłyszeli, wielu mówiło:' },
    { v: 60, cont: true, text: '«Trudna jest ta mowa. Któż jej może słuchać?»' },
  ],
  cam: { x: [-20, 20], y: [-40, 40], z: [0.98, 1.12] },
  build(S) {
    const c = S.c;
    const I = synagogueInterior(S);
    const hiL = S.layer({ par: 0.3, sh: 4 });
    const rad = hiL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 52)}</g>`);
    const L = S.layer({ par: I.P, sh: 4 });
    const cong = I.congregation(L);
    const lights = cong.map(() => L.add(`<g>${soulLight(c, 8)}</g>`));
    // the wider circle of disciples standing along the sides
    const DIS = [[330, 0], [410, 1], [490, 2], [1110, 3], [1190, 4], [1270, 5]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, i % 3 !== 1)))) }));
    const jGlow = L.add(`<g>${glowDisc(160, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    I.addColumns();

    const fx = S.layer({ par: 0.6, sh: 5 });
    const loaf = fx.add(`<g>${breadOfLight(c, 44)}</g>`);
    const ring = fx.add(`<g>${eternityRing(c, 92, 5, 26)}</g>`);
    const pid = S.id('mclip');
    const plate = fx.add(`<g><path d="M-80 -1600V-76M80 -1600V-76" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><path d="${c.cut(c.rect(-120, -80, 240, 160), 0.5, 6)}" fill="${C.wood3}"/><clipPath id="${pid}"><rect x="-110" y="-70" width="220" height="140"/></clipPath><g clip-path="url(#${pid})"><rect x="-110" y="-70" width="220" height="140" fill="${SEPIA.sky[1]}"/><path d="${c.cut([[-110, 20], [0, -4], [110, 12], [110, 70], [-110, 70]], 0.5, 6)}" fill="${SEP(C.sand2)}"/><g transform="translate(-50 26) scale(.36)">${tent(c, { col: SEP(C.wheatRobe), stripe: SEP(C.terracotta) })}</g>${mannaField(c, { x0: -110, x1: 110, y0: -70, y1: 70, n: 30, r: 2.2 })}<rect x="-110" y="-70" width="220" height="140" fill="#6d6a66" opacity=".5"/></g></g>`);
    const hard = DIS.map((d, i) => fx.add(`<g>${i % 2 ? speech(c, `<g transform="translate(-10 4) scale(.5)">${rock(c, 0, 20, 60, 34, C.rock2)}</g><g transform="translate(18 0) scale(.7)">${GLYPH.q(c)}</g>`, { w: 66, h: 46, flip: d.x > JX }) : murmur(c, { side: d.x > JX ? -1 : 1 })}</g>`));

    /* the street drop in front: Capernaum and the synagogue from outside */
    const drop = S.layer({ par: 0.3, sh: 8, pad: 1500 });
    drop.add(synagogueFacade(S, { signText: tr('Kafarnaum', 'Capernaum') }));
    const topL = S.layer({ par: 0.6, sh: 5 });
    const place = topL.add(hungWord(c, tr('w synagodze w Kafarnaum', 'in the synagogue in Capernaum'), { size: 22 }));

    return (t, time) => {
      const T = time;
      I.flicker(T);
      /* v58a — this bread, not like the manna of the fathers who died */
      const rk = es(t, 0.05, 0.3) * (1 - es(t, 1.9, 2.1));
      pose(rad, { x: JX, y: 160, s: 0.8, r: T * 3, o: rk });
      const dk = es(t, 0.1, 0.6, ease.out);
      pose(loaf, { x: 960, y: lerp(160, 330, dk), o: seg(t, 0.1, 0.2) * (1 - es(t, 1.9, 2.1)) });
      const pk = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 0.95, 1.1));
      pose(plate, { x: 600, y: lerp(-500, 300, pk), r: Math.sin(T * 0.8), o: pk > 0.01 ? 1 - es(t, 0.8, 1.1) : 0 });
      /* v58b — whoever eats this bread will live forever */
      drawRing(ring, es(t, 1.05, 1.5));
      pose(ring, { x: 960, y: 330, r: t * 20, o: seg(t, 1.05, 1.1) * (1 - es(t, 1.9, 2.1)) });
      cong.forEach((m, i) => {
        const lk = es(t, 1.2 + (i % 4) * 0.07, 1.4 + (i % 4) * 0.07) * (1 - es(t, 1.9, 2.1));
        const [hx, hy] = headAt(m.x, m.y, m.s, m.x > JX, 62);
        pose(lights[i], { x: hx, y: hy - 40, s: lk * 0.9, o: lk });
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 20 + lk * 30, armB: es(t, 3.1, 3.4) * (i % 2 ? 40 : 0), head: -lk * 6 + es(t, 3.1, 3.4) * (i % 2 ? 8 : -8), blink: blinkAt(T, m.seed) });
      });

      /* v59 — in the synagogue at Capernaum: the street drop comes down, then flies up */
      const down = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      drop.shift(0, -(1 - down) * 1450);
      drop.fade(seg(t, 2.02, 2.06) * (1 - seg(t, 3.17, 3.2)));
      const pl = es(t, 2.25, 2.5, ease.out) * (1 - es(t, 2.9, 3.05));
      pose(place, { x: 800, y: lerp(-500, 200, pl), r: Math.sin(T * 0.8), o: pl > 0.01 ? 1 : 0 });

      /* v60 — many of His disciples: "This is a hard saying! Who can listen to it?" */
      const talk = es(t, 3.1, 3.4);
      DIS.forEach((d, i) => {
        const turn = talk > 0.4 && i % 2 === 0;
        const ears = i === 1 || i === 4 ? es(t, 4.2, 4.4) : 0;
        d.p.set({ x: d.x, y: FEET - 2 + (i % 2) * 8, s: 0.94, flip: turn ? d.x < JX : d.x > JX, armF: 20 + talk * 30 * (1 - ears) + ears * 60, armB: 10 + talk * (i % 3 ? 60 : 0) * (1 - ears) + ears * 160, head: talk * (i % 2 ? 6 : -6) + ears * 10, lean: talk * 3, blink: blinkAt(T, d.seed) });
        const [hx, hy] = headAt(d.x, FEET - 2 + (i % 2) * 8, 0.94, turn ? d.x < JX : d.x > JX);
        const k = es(t, 3.2 + i * 0.06, 3.4 + i * 0.06, ease.back) * (i % 2 ? es(t, 4.05, 4.1) : 1);
        pose(hard[i], { x: hx + (d.x > JX ? -8 : 8), y: hy - 18, s: k, o: k > 0.01 ? 1 : 0 });
      });
      pose(jGlow, { x: JX, y: FEET - 130, s: 0.8, o: 0.3 + rk * 0.3 });
      jesus.set({ x: JX, y: FEET, s: 1.08, armF: 20 + bump(t, 0.1, 1.9) * 50, armB: 10 + bump(t, 0.1, 0.9) * 100, head: -bump(t, 0.1, 0.9) * 8 + es(t, 3.2, 3.5) * 4, blink: blinkAt(T, 1) });

      S.cam.z = kf(t, [[0, 1.04], [2.0, 1.04], [2.4, 0.98], [3.1, 1.0], [3.5, 1.04]]);
      S.cam.y = kf(t, [[0, 10], [2.0, 10], [2.4, 0], [3.5, 20]]);
    };
  },
};
