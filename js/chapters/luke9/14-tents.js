// Łk 9,33–36 — still night on the summit. As Moses and Elijah begin to go from Him (stepping back into their pillars),
// Peter jumps up: "Master, it is good that we are here!" — "Let us make three tents": three little tents pop up, one
// before each — "not knowing what he said": a question hangs over his head. While he is still speaking a bright cloud
// comes down and overshadows them; the three are afraid as the others go into the cloud: they fall on their knees and
// hide their heads, and the cloud swallows Moses and Elijah. "A voice came out of the cloud: This is my Son, my Chosen
// One; listen to Him!" — only words and rings of light, no figure. When the voice had spoken, the cloud lifts and Jesus
// is found alone, in His own colours again, the tents gone. And they kept silent: dawn comes, they stand looking at Him,
// and the bright little pictures of what they saw shrink down into their hearts, told to no one.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { cloud } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { summitSet, SUM, TW9, JESUS_WHITE, MOSES, ELIJAH, tablets, tent, arcRings, bubble, thought, GLYPH, sparkle, heart, halo, rayBurst, withFace, faceBits, kf, headAt, tr, PI } from './lib.js';

const THREE = [{ k: 'james', x: 470, y: SUM.LEDGE }, { k: 'peter', x: 580, y: SUM.LEDGE + 6 }, { k: 'john', x: 1070, y: SUM.LEDGE }];
const TENTS = [[642, 0.72], [800, 0.78], [958, 0.72]];

export default {
  id: 'lk9-tents',
  beats: [
    { v: 33, text: 'Gdy oni odchodzili od Niego, Piotr rzekł do Jezusa: «Mistrzu, dobrze, że tu jesteśmy.' },
    { v: 33, cont: true, text: 'Postawimy trzy namioty: jeden dla Ciebie, jeden dla Mojżesza i jeden dla Eliasza».' },
    { v: 33, cont: true, text: 'Nie wiedział bowiem, co mówi.' },
    { v: 34, text: 'Gdy jeszcze to mówił, zjawił się obłok i osłonił ich;' },
    { v: 34, cont: true, text: 'zlękli się, gdy [tamci] weszli w obłok.' },
    { v: 35 },
    { v: 36, text: 'W chwili, gdy odezwał się ten głos, Jezus znalazł się sam.' },
    { v: 36, cont: true, text: 'A oni zachowali milczenie i w owym czasie nikomu nic nie oznajmiali o tym, co widzieli.' },
  ],
  cam: { x: [-30, 30], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const M = summitSet(S);
    const c = S.c;
    const dawnL = sky(S, ['#8e92b8', '#e6b7a4', '#f5d4ae'], { name: 'dawn', rise: 0 }).layer;
    dawnL.fade(0);
    // (the dawn sky goes just above the other skies, under the stars)
    dawnL.el.parentNode.insertBefore(dawnL.el, M.starL.el);

    /* the glory, the pillars */
    const glowL = S.layer({ par: 0.4, sh: 1, flat: true });
    const glory = glowL.add(`<g>${rayBurst(c, { n: 26, r0: 40, r1: 210, spread: 0.026, color: '#ffeec2', o: 0.5 })}${halo(200, 1)}</g>`);
    const pillar = (x) => glowL.add(`<g><path d="${c.cut([[x - 60, SUM.SIDE + 6], [x - 30, -400], [x + 30, -400], [x + 60, SUM.SIDE + 6]], 0.5, 20)}" fill="#fff4d6" opacity=".45"/></g>`);
    const pilM = pillar(SUM.MX), pilE = pillar(SUM.EX);

    /* people */
    const act = S.layer({ par: 0.4, sh: 5 });
    const moses = S.puppet(act.add(person(c, { ...MOSES, holdF: `<g transform="translate(8 -4)">${tablets(c, { w: 18, h: 30 })}</g>` })));
    const elijah = S.puppet(act.add(person(c, ELIJAH)));
    const jWhite = S.puppet(act.add(person(c, JESUS_WHITE)));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const tentL = S.layer({ par: 0.42, sh: 4 });
    const TN = TENTS.map(([x, s], i) => ({ x, s, i, el: tentL.add(`<g>${tent(c, { col: [C.wheatRobe, C.linen2, C.sand2][i], stripe: [C.terracotta, C.dustyBlue, C.clay][i] })}</g>`) }));
    /* the cloud, the voice */
    const shadeL = S.layer({ par: 0, sh: 1, flat: true });
    shadeL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#5a5870"/>`);
    shadeL.fade(0);
    const cloudL = S.layer({ par: 0.42, sh: 7 });
    const halo2 = cloudL.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="620" ry="260" fill="url(#halo-glow)" opacity=".85"/></g>`);
    const BIG = [[540, 250, 380], [800, 200, 440], [1060, 256, 380], [660, 330, 300], [950, 336, 300]].map(([x, y, w], i) => ({ x, y, i, el: hanging(cloudL, cloud(c, w, '#faf6ec', '#e9e1d0'), { x: 0, y: -1500, len: 1800 }) }));
    const low = [[560, 650, 300], [1040, 656, 300], [800, 590, 320], [680, 610, 240], [920, 616, 240]].map(([x, y, w], i) => ({ x, y, i, el: hanging(cloudL, cloud(c, w, '#f8f3e7', '#e4dac8'), { x: 0, y: -1500, len: 1800 }) }));
    const dL = S.layer({ par: 0.44, sh: 5 });
    const D = THREE.map((d, i) => ({
      ...d, i, seed: c.rr(0, 9),
      sit: S.puppet(dL.add(withFace(person(c, { ...TW9[d.k], pose: 'sit' }), faceBits(c)))),
      st: S.puppet(dL.add(withFace(person(c, TW9[d.k]), faceBits(c)))),
      kn: S.puppet(dL.add(withFace(person(c, { ...TW9[d.k], pose: 'kneel' }), faceBits(c)))),
    }));
    D.forEach((d) => { d.sad = [d.sit, d.st, d.kn].map((p) => p.el.querySelector('[data-part="sad"]')); });
    M.front();

    const voiceL = S.layer({ par: 0.3, sh: 5 });
    const rings = arcRings(voiceL, c, { n: 4, r: 70, w: 8, color: C.haloRim, a: PI / 2, span: 0.75 });
    const words = hanging(voiceL, `<g>${bubble(c, [tr('To jest Syn mój, Wybrany,', 'This is my beloved Son.'), tr('Jego słuchajcie!', 'Listen to him!')], { size: 22, tail: 0 })}</g>`, { x: 0, y: -1500, len: 1000 });

    /* Peter's words and his question; the pictures kept in their hearts */
    const fx = S.layer({ par: 0.46, sh: 4 });
    const pSays = fx.add(`<g opacity="0">${bubble(c, [tr('Mistrzu, dobrze,', 'Master, it is good'), tr('że tu jesteśmy!', 'for us to be here!')], { size: 19, tail: 1 })}</g>`);
    const pQ = fx.add(`<g opacity="0">${thought(c, GLYPH.q(c), { w: 58, h: 46 })}</g>`);
    const KEEP = D.map((d) => ({ d, pic: fx.add(`<g opacity="0">${thought(c, `<g transform="scale(.9)">${sparkle(c, 12)}</g>`, { w: 54, h: 44 })}</g>`), hrt: fx.add(`<g opacity="0">${heart(c, 9)}</g>`) }));

    return (t, time) => {
      const T = time;
      const cloudIn = es(t, 3.02, 3.6) * (1 - es(t, 6.02, 6.5));
      const alone = es(t, 6.05, 6.12);
      const dawn = es(t, 7.0, 7.8);
      M.set(T, { k: 1 - dawn * 0.5, g: (0.55 - cloudIn * 0.3) * (1 - alone), moonK: 1 - dawn * 0.3 });
      dawnL.fade(dawn * 0.9);
      shadeL.fade(cloudIn * 0.2);
      pose(glory, { x: SUM.JX, y: SUM.TOP - 120, s: 0.9, r: T * 3, o: 0.8 * (1 - alone) });

      /* v33a — Moses and Elijah begin to go; Peter: good that we are here */
      const part = es(t, 0.05, 0.9);
      const gone = es(t, 4.2, 4.6);   // into the cloud (v34b)
      pose(pilM, { o: (0.7 - part * 0.3) * (1 - gone) });
      pose(pilE, { o: (0.7 - part * 0.3) * (1 - gone) });
      moses.set({ x: SUM.MX - part * 30, y: SUM.SIDE - part * 10, s: 1.0 - part * 0.05, o: 1 - gone, armF: 30, armB: 10, head: -3, blink: blinkAt(T, 3) });
      elijah.set({ x: SUM.EX + part * 30, y: SUM.SIDE - part * 10, s: 1.0 - part * 0.05, flip: true, o: 1 - gone, armF: 20, armB: 20, head: -3, blink: blinkAt(T, 5) });
      const jp = { x: SUM.JX, y: SUM.TOP, s: 1.06, armF: 20 + es(t, 6.3, 6.6) * 30, armB: 12, head: -2, blink: blinkAt(T, 1) };
      jWhite.set({ ...jp, o: 1 - alone });
      jesus.set({ ...jp, o: alone, flip: t > 7.2 && Math.sin(T * 0.4) > 0.5 });

      /* the three */
      const pUp = es(t, 0.05, 0.12);
      const fear = es(t, 4.02, 4.1) * (1 - es(t, 6.35, 6.42));
      const standAll = es(t, 7.02, 7.1);
      D.forEach((d) => {
        const isP = d.k === 'peter';
        const flip = d.x > SUM.JX;
        const speak = isP ? bump(t, 0.1, 0.95) + bump(t, 1.05, 1.95) : 0;
        const puzzle = isP ? bump(t, 2.05, 2.95) : 0;
        const shake = fear * Math.sin(T * 22 + d.seed) * 0.8;
        const lookUp = es(t, 6.42, 6.7);
        const stand = isP ? Math.max(pUp * (1 - fear), standAll) : standAll;
        d.sit.set({ x: d.x, y: d.y, s: 0.98, flip, o: (1 - stand) * (1 - fear), armF: 30 + bump(t, 1.2, 1.9) * 30, armB: 10, head: -6, blink: blinkAt(T, d.seed) });
        d.st.set({ x: d.x + (isP ? 80 * es(t, 0.05, 0.3) : 0), y: d.y, walk: isP && t > 0.05 && t < 0.3 ? t * 20 : undefined, s: 1.0, flip, o: stand * (1 - fear), armF: 20 + speak * 60 + puzzle * 110 + Math.sin(T * 3) * 6 * speak, armB: 10 + speak * 40 + bump(t, 1.1, 1.9) * 60, head: -4 - puzzle * 6, blink: blinkAt(T, d.seed) });
        d.kn.set({ x: d.x + (isP ? 80 : 0) + shake, y: d.y, s: 1.0, flip, o: fear, armF: 60 + (1 - lookUp) * 60, armB: 150 * (1 - lookUp) + 40, head: 14 * (1 - lookUp) - lookUp * 10, lean: 18 * (1 - lookUp), blink: blinkAt(T, d.seed) });
        d.sad.forEach((el) => pose(el, { o: fear * (1 - lookUp) }));
      });
      const P = D[1];
      const [phx, phy] = headAt(P.x + 80, P.y, 1.0, false);
      const sk = es(t, 0.15, 0.3, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(pSays, { x: phx + 40, y: phy - 40, s: sk, o: sk > 0.01 ? 1 : 0 });
      const qk = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(pQ, { x: phx + 6, y: phy - 20, s: qk, o: qk > 0.01 ? 1 : 0 });

      /* v33b — the three tents pop up; they fold away in the cloud */
      TN.forEach((tn) => {
        const up = es(t, 1.1 + tn.i * 0.15, 1.35 + tn.i * 0.15, ease.back) * (1 - es(t, 3.3 + tn.i * 0.05, 3.6 + tn.i * 0.05));
        pose(tn.el, { x: tn.x, y: 716, s: tn.s, sy: tn.s * Math.max(0.001, up), o: up > 0.01 ? 1 : 0 });
      });

      /* v34 — the cloud comes and overshadows them; the two go into it */
      pose(halo2, { x: 800, y: 300, o: cloudIn });
      BIG.forEach((b) => {
        const k = es(t, 3.02 + b.i * 0.05, 3.5 + b.i * 0.05) * (1 - es(t, 6.02, 6.5));
        swing(b.el, b.x, lerp(-1500, b.y, k), T, 0.6, 0.4, b.i);
      });
      low.forEach((l) => {
        const k = es(t, 4.02 + l.i * 0.05, 4.4 + l.i * 0.05) * (1 - es(t, 6.02, 6.4));
        swing(l.el, l.x + (l.x < 800 ? -1 : l.x > 800 ? 1 : 0) * (1 - k) * 200, lerp(-1500, l.y, k), T, 0.8, 0.5, l.i + 1);
      });

      /* v35 — the voice from the cloud */
      const voice = es(t, 5.05, 5.25) * (1 - es(t, 5.9, 6.05));
      rings(800, 250, voice, T, { spread: 1.8, speed: 0.4, s0: 0.8 });
      swing(words, 800, lerp(-1500, 214, es(t, 5.1, 5.45, ease.back)) - es(t, 5.95, 6.2) * 1500, T, 0.8, 0.7, 3);

      /* v36b — kept silent: what they saw goes down into their hearts */
      KEEP.forEach((kp, i) => {
        const d = kp.d;
        const [hx, hy] = headAt(d.x + (d.k === 'peter' ? 80 : 0), d.y, 1.0, d.x > SUM.JX);
        const k = es(t, 7.1 + i * 0.05, 7.3 + i * 0.05, ease.back);
        const sink = es(t, 7.45 + i * 0.05, 7.8 + i * 0.05);
        pose(kp.pic, { x: lerp(hx + 10, hx + 4, sink), y: lerp(hy - 20, hy + 70, sink), s: k * (1 - sink * 0.8), o: k > 0.01 && sink < 0.95 ? 1 : 0 });
        pose(kp.hrt, { x: hx + (d.x > SUM.JX ? -6 : 6), y: hy + 70, s: sink, o: sink > 0.05 ? 1 : 0 });
      });

      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.1], [2.9, 1.1], [3.4, 1.0], [6.0, 1.0], [6.4, 1.08], [7.0, 1.1]]);
      S.cam.y = kf(t, [[0, 40], [2.9, 40], [3.4, -20], [6.0, -20], [6.4, 30], [7.0, 40]]);
    };
  },
};
