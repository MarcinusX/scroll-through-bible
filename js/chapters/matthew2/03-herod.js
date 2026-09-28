// Mt 2,3 — in the palace a courtier whispers the Magi's question to old King Herod: "a newborn King of the Jews?"
// Herod starts up from his throne in fear. The whisper runs from mouth to mouth, out through the arches, and the
// whole city trembles with him.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, attr } from '../../core/anim.js';
import { LOOK, HALL, HY, palaceSet, herodPuppet, noble, withBits, speech, wordSlip, infant, crown, GLYPH, headAt, vpose, hangAt, kf, jerusalem, placeTag, tr, PI } from './lib.js';
import { hanging } from '../kit.js';

const COURT = [[430, 0], [510, 1], [590, 2], [1010, 3], [1090, 4], [1170, 5]];

export default {
  id: 'mt2-herod',
  beats: [
    { v: 3, text: 'Skoro to usłyszał król Herod, przeraził się,' },
    { v: 3, cont: true, text: 'a z nim cała Jerozolima.' },
  ],
  cam: { x: [-40, 40], y: [0, 80], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = palaceSet(S, { skyCols: HALL });

    /* all Jerusalem: a painted flat of the city that comes down from the flies */
    const flyL = S.layer({ par: 0.35, sh: 6 });
    const cid = S.id('cityclip');
    const PW = 440, PH = 180;
    const plate = hanging(flyL, `${sheet().p(c.cut(c.rect(-PW / 2 - 12, -PH / 2 - 12, PW + 24, PH + 24), 0.6, 8), C.ochre).p(c.cut(c.rect(-PW / 2, -PH / 2, PW, PH), 0.5, 8), mix(C.dawn, C.peach, 0.4)).out()}<clipPath id="${cid}"><rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}"/></clipPath><g clip-path="url(#${cid})"><g transform="translate(-70 ${PH / 2 + 16})">${jerusalem(c, 0.46, { tglow: false })}</g></g><g transform="translate(0 ${PH / 2 + 30})">${placeTag(c, tr('cała Jerozolima', 'all Jerusalem'), 19)}</g>`, { x: 0, y: 0, len: 700 });

    /* the court */
    const act = S.layer({ par: 0.55, sh: 5 });
    const court = COURT.map(([x, i]) => {
      const el = act.add(withBits(person(c, noble(c, i)), c));
      return { x, i, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]'), seed: c.rr(0, 6) };
    });
    const msgr = S.puppet(act.add(person(c, { ...LOOK.messenger })));
    const hSit = S.puppet(act.add(herodPuppet(c, { pose: 'sit' })));
    const hUp = S.puppet(act.add(herodPuppet(c, {})));
    const fear = [hSit, hUp].map((p) => p.el.querySelector('[data-part="sad"]'));

    /* the whisper, the question, the trembling */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const q = fx.add(`<g>${speech(c, `<g transform="translate(-24 8) scale(.66)">${infant(c)}</g><g transform="translate(-8 -18) scale(.76)">${crown(c)}</g><g transform="translate(32 0)">${GLYPH.q(c)}</g>`, { w: 112, h: 74 })}</g>`);
    const slips = Array.from({ length: 10 }, (_, i) => ({ i, el: fx.add(wordSlip(c, c.rr(22, 32))), seed: c.rr(0, 6) }));
    const shock = [0, 1, 2].map((i) => fx.add(`<g><path d="${c.ribbon([[0, 0], [0, -20]], 3.4)}" fill="${C.ink}"/></g>`));

    return (t, time) => {
      const T = time;
      const tremble = es(t, 1.05, 1.35) * (1 - es(t, 1.9, 2.0) * 0.4);
      set.update(T, { wild: es(t, 0.45, 0.6) });

      /* v3a — the courtier whispers; Herod starts up in fear */
      const mx = kf(t, [[-0.3, 180], [0.25, 690]], ease.out);
      const lean = bump(t, 0.2, 0.6);
      msgr.set({ x: mx, y: HY + 24, s: 0.9, walk: t < 0.25 ? mx * 0.07 : undefined, lean: lean * 14, armF: lean * 70, head: lean * 8, blink: blinkAt(T, 3), o: 1 - es(t, 1.0, 1.3) });
      const qk = es(t, 0.2, 0.33, ease.back) * (1 - es(t, 0.55, 0.62));
      vpose(q, { x: 740, y: HY - 172, s: qk, o: qk > 0.01 ? 1 : 0 });
      const up = es(t, 0.42, 0.49);
      const startle = es(t, 0.45, 0.62);
      hSit.set({ x: 808, y: HY - 38, s: 1.08, o: 1 - up, armF: 20 + lean * 20, armB: 10, head: -lean * 10, lean: -lean * 6, blink: blinkAt(T, 1) });
      const shake = Math.sin(T * 30) * 1.4 * startle * (1 - es(t, 1.8, 2.0) * 0.6);
      hUp.set({ x: 816 + shake, y: HY - 32, s: 1.08, o: up, armF: 30 + startle * 70, armB: startle * 140, head: -startle * 12 + shake * 2, lean: -startle * 8, blink: 0 });
      fear.forEach((f) => attr(f, 'opacity', es(t, 0.45, 0.6).toFixed(2)));
      shock.forEach((s, i) => {
        const k = bump(t, 0.48, 0.95), a = -PI / 2 + (i - 1) * 0.6;
        const [hx, hy] = headAt(816, HY - 32, 1.08, false);
        vpose(s, { x: hx + Math.cos(a) * 48, y: hy - 18 + Math.sin(a) * 36, r: (i - 1) * 34, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* v3b — the whisper spreads, the whole city trembles */
      const spread = es(t, 1.0, 1.9, (u) => u);
      slips.forEach((w) => {
        const k = (spread * 1.6 + w.i / 10) % 1;
        const from = COURT[w.i % 6][0], to = w.i % 2 ? 520 : 1080;
        const on = es(t, 1.0, 1.15) * (1 - es(t, 1.95, 2.0));
        vpose(w.el, { x: lerp(from, to, k), y: lerp(HY - 150, 380, k) - Math.sin(k * PI) * 90, r: Math.sin(T * 2 + w.seed) * 16, s: 0.9, o: on * Math.sin(k * PI) });
      });
      court.forEach((m) => {
        const turn = es(t, 1.05 + m.i * 0.04, 1.3 + m.i * 0.04);
        const left = m.x < 800;
        const flip = left ? turn > 0.5 && m.i === 1 : !(turn > 0.5 && m.i === 4);
        m.p.set({ x: m.x + Math.sin(T * 24 + m.seed) * 1.2 * tremble, y: HY + 26 + (m.i % 2) * 8, s: 0.9, flip, armF: 10 + turn * 50, armB: turn * (m.i % 3 === 0 ? 150 : 40), head: -turn * 6, lean: turn * 4, blink: blinkAt(T, m.seed) });
        attr(m.sad, 'opacity', (turn * 0.9).toFixed(2));
      });
      set.view.shift(Math.sin(T * 26) * 3 * tremble, Math.cos(T * 31) * 2 * tremble);
      const pk = es(t, 1.0, 1.35, ease.out);
      if (pk <= 0.001) pose(plate, { x: 800, y: -600, o: 0 });
      else pose(plate, { x: 800 + Math.sin(T * 23) * 2.5 * tremble, y: lerp(-500, 262, pk), r: Math.sin(T * 19) * 1.3 * tremble, oy: 0, o: 1 });

      S.cam.z = 1.02 + es(t, 0.1, 0.5) * 0.14 - es(t, 1.0, 1.4) * 0.16;
      S.cam.y = 40 - es(t, 0.1, 0.5) * 10 - es(t, 1.0, 1.4) * 20;
      S.cam.x = 0;
    };
  },
};
