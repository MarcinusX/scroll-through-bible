// J 8,52–55 — "Now we know You have a demon!" — they point. "Abraham died, and the prophets" — four small sepia
// portraits come down (Abraham, Moses, Elijah, Isaiah) and a dark ribbon is tied across the corner of each. "Are You
// greater than our father Abraham? Who do You make Yourself?" — a pair of scales: Abraham's portrait on one pan, a "?"
// on the other. "If I glorify Myself, My glory is nothing" — a paper star of self-made glory crumples and falls. "It
// is My Father who glorifies Me" — the radiance comes and its glory opens behind Him. "You do not know Him; I know
// Him" — a golden thread from the light to Him, a mist over them. "I keep His word" — He holds a shining page to His heart.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { nightStage, DC, NIGHT, voiceRings, radiance, glory, framed, ABRAHAM, sepia, scalesParts, poseScales, question, hand, kf, vis, tr, PI } from './lib.js';

const FATHERS = [
  ABRAHAM,
  { robe: mix(C.dune, C.wood3, 0.35), mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', beardColor: '#e9e2d6', skin: C.skin3, belt: C.rope },
  { robe: '#b98f63', fur: true, belt: C.leather, hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: C.skin4 },
  { robe: C.dustyBlue, mantle: C.stone, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin2 },
];

export default {
  id: 'j8-prophets',
  beats: [
    { v: 52, text: 'Rzekli do Niego Żydzi: «Teraz wiemy, że jesteś opętany.' },
    { v: 52, cont: true, text: 'Abraham umarł i prorocy - a Ty mówisz: Jeśli kto zachowa moją naukę, ten śmierci nie zazna na wieki.' },
    { v: 53 },
    { v: 54, text: 'Odpowiedział Jezus: «Jeżeli Ja sam siebie otaczam chwałą, chwała moja jest niczym.' },
    { v: 54, cont: true, text: 'Ale jest Ojciec mój, który Mnie chwałą otacza, o którym wy mówicie: "Jest naszym Bogiem",' },
    { v: 55, text: 'ale wy Go nie znacie. Ja Go jednak znam.' },
    { v: 55, cont: true, text: 'Gdybym powiedział, że Go nie znam, byłbym podobnie jak wy - kłamcą. Ale Ja Go znam i słowa Jego zachowuję.' },
  ],
  cam: { x: [-40, 100], y: [-120, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    const fx = st.fx;
    const rings = voiceRings(fx, c, { n: 3, r: 36, w: 5, both: false, color: shade(C.halo, -0.05) });
    const SEP = mix(C.parchment, C.dune, 0.3);
    const portrait = (o, i) => framed(S, `<rect width="110" height="130" fill="${SEP}"/><g transform="translate(52 128) scale(.5)">${person(c, sepia({ ...o, halo: false }, 0.5))}</g>`, { w: 110, h: 130, rim: C.wood3, k: 'pf' + i });
    const band = `<path d="M22 -12L58 -12L-12 58L-12 22Z" fill="#2b2436" transform="translate(-55 0)"/>`;
    const pics = FATHERS.map((o, i) => ({ i, el: fx.add(`<g>${portrait(o, i)}</g>`), band: fx.add(`<g>${band}</g>`) }));
    const XS = [560, 700, 900, 1040];
    // the scales of greatness
    const SP = scalesParts(c, { arm: 110, drop: 60 });
    const sc = { frame: fx.add(`<g>${SP.frame}</g>`), beam: fx.add(`<g>${SP.beam}</g>`), panL: fx.add(`<g>${SP.pan}<g transform="translate(-27 -5) scale(.5)"><rect width="110" height="130" fill="${C.wood3}"/><rect x="6" y="6" width="98" height="118" fill="${SEP}"/><g transform="translate(55 124) scale(.48)">${person(c, sepia({ ...ABRAHAM, halo: false }, 0.5))}</g></g></g>`), panR: fx.add(`<g>${SP.pan}<g transform="translate(0 30)">${question(c)}</g></g>`) };
    // self-made glory: a flimsy grey paper star
    const star = fx.add(`<g>${sheet().p(c.cut(c.star(0, 0, 34, 14, 5), 0.8, 4), mix(C.stone2, C.cream, 0.3)).out()}</g>`);
    const lightL = S.layer({ par: 0.5, sh: 1 });
    const glo = lightL.add(`<g>${glory(c, 300, 20)}</g>`);
    const rad = lightL.add(`<g><circle r="190" fill="url(#halo-glow)"/>${radiance(c, 50)}</g>`);
    const thread = lightL.add(`<path d="M0 0L0 1" stroke="${C.halo}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0"/>`);
    const mist = fx.add(`<g>${[[-80, 0, 70, 16], [0, -4, 80, 18], [80, 2, 70, 16]].map(([x, y, a, b]) => `<path d="${c.cut(c.blob(x, y, a, b, 12, 0.18), 0.8, 6)}" fill="${mix(C.stone2, C.indigo, 0.4)}" opacity=".85"/>`).join('')}</g>`);
    const page = fx.add(`<g><circle r="56" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.rect(-26, -32, 52, 64), 0.4, 5), C.halo).x((() => { let d = ''; for (let i = 0; i < 5; i++) d += c.ribbon([[-17, -20 + i * 10], [17 - (i % 2) * 6, -20 + i * 10]], 1.6); return d; })(), C.haloRim).out()}</g>`);

    return (t, time) => {
      const T = time;
      st.set.update(t, T, { lit: 1, moonY: 150, glowO: 0.7, gate: 0.6 });
      /* v52b — the fathers and the prophets, who died */
      const galleryOff = es(t, 1.95, 2.15, ease.in);
      pics.forEach((p) => {
        const k = es(t, 1.05 + p.i * 0.08, 1.4 + p.i * 0.08, ease.out) * (1 - galleryOff);
        const y = 120 - (1 - k) * 700;
        vis(p.el, { x: XS[p.i], y, r: Math.sin(T * 0.7 + p.i) * 0.8 * k, o: k > 0.001 ? 1 : 0 });
        const bk = es(t, 1.46 + p.i * 0.06, 1.56 + p.i * 0.06);      // all four tied by the time the reader pauses
        vis(p.band, { x: XS[p.i], y, s: 0.6 + bk * 0.4, o: k > 0.001 ? bk : 0 });
      });
      /* v53 — greater than Abraham? */
      const sk = es(t, 2.1, 2.45, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      const tilt = -12 + bump(t, 2.4, 2.95) * 8;
      poseScales(sc, S.portrait ? 960 : 1000, 260 - (1 - sk) * 700, tilt, sk > 0.001 ? 1 : 0, 1, 110);
      /* v54a — self-made glory: nothing */
      const fall = es(t, 3.45, 3.95, ease.in);
      vis(star, { x: DC.JX + 70 + fall * 20, y: DC.FLOOR - 260 + fall * 250, sx: 1 - fall * 0.6, sy: 1 - fall * 0.8, r: fall * 120, o: t > 3.1 ? es(t, 3.1, 3.25) * (1 - es(t, 3.85, 3.98)) : 0 });
      /* v54b — the Father glorifies Him; v55 — the thread; the mist */
      const rk = es(t, 4.05, 4.4, ease.out);
      vis(rad, { x: DC.JX, y: 120 - (1 - rk) * 400, o: rk });
      const gk = es(t, 4.3, 4.8) * (1 - es(t, 5.0, 5.3) * 0.6);
      vis(glo, { x: DC.JX, y: DC.FLOOR - 170, s: 0.6 + gk * 0.4, o: gk * 0.55 });
      const th = es(t, 5.1, 5.45);
      const hy = DC.FLOOR + 8 - 180 * 1.06;
      attr(thread, 'd', `M${DC.JX} 170L${DC.JX} ${lerp(170, hy - 30, th).toFixed(1)}`);
      attr(thread, 'opacity', th > 0.01 ? 0.85 : 0);
      const mk = es(t, 5.2, 5.5) * (1 - es(t, 6.8, 7));
      vis(mist, { x: 1060, y: 520, o: mk * 0.9 });
      const pg = es(t, 6.3, 6.6);
      const [hx, hy2] = hand(DC.JX, DC.FLOOR + 8, 1.06, false, 80);
      vis(page, { x: hx - 6, y: hy2 - 20, s: 0.8, o: pg });

      const talk = Math.max(bump(t, 3.05, 4.95), bump(t, 5.05, 6.95));
      K.set(T, {
        j: { armF: 16 + talk * 22 + es(t, 6.2, 6.5) * 50, armB: 10 + bump(t, 4.1, 4.9) * 140 + es(t, 6.2, 6.5) * 20, head: -bump(t, 4.1, 4.9) * 12 + es(t, 6.3, 6.6) * 8 },
        lisF: () => ({ head: -4 }),
        leadF: (m) => {
          const accuse = m.i < 3 ? bump(t, 0.05, 0.95) : 0;
          const up = bump(t, 1.05, 1.95) * (m.i === 1 ? 1 : 0);
          const ask = m.i === 0 ? bump(t, 2.1, 2.95) : 0;
          return { armF: 20 + accuse * 70 + ask * 60, armB: 10 + up * 140, head: -up * 14 + accuse * -4, angry: 0.4 + accuse * 0.6 };
        },
      });
      rings(DC.JX + 6, DC.FLOOR - 172, talk, T, { dir: 1, s0: 0.7, spread: 1.8 });

      S.cam.x = kf(t, [[0, 60], [1.0, 40], [1.3, 0], [2.0, 0], [2.3, 60], [3.0, 60], [3.3, 20], [5, 20], [5.3, 40], [6.2, 10]]);
      S.cam.y = kf(t, [[0, -10], [1.0, -30], [1.3, -110], [2.0, -110], [2.3, -60], [3.0, -60], [3.3, -20], [4.1, -80], [5.3, -40], [6.2, -10]]);
      S.cam.z = kf(t, [[0, 1.1], [1.3, 1.02], [2.3, 1.08], [3.3, 1.14], [4.1, 1.04], [5.3, 1.06], [6.2, 1.14]]);
    };
  },
};
