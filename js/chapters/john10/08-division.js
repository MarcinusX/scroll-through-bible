// J 10,19–21 — back in the Temple court. His words hang in the air as a golden slip — and a crack runs across the
// pavement from His feet, splitting the listeners in two. On the right, many scowl: "He has a demon, He is mad!"
// (a dark bubble with a storm and a spiral) — "Why do you listen to Him?" — they wave the others away. On the left,
// others answer: "These are not the words of one possessed" (a bubble with a golden scroll and a tick) — "Can a demon
// open the eyes of the blind?" — the man born blind steps forward, and above him a great eye opens in the light.
import { C, blinkAt, pose, lerp, shade, mix, sheet } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import { dayCourt, DC, MORNING, DAY, voiceRings, bubble, speech, GLYPH, tick, eyeIcon, workPlate, word, kf, vis, tr, PI } from './lib.js';

export default {
  id: 'j10-division',
  beats: [
    { v: 19 },
    { v: 20, text: 'Wielu spośród nich mówiło: «On jest opętany przez złego ducha i odchodzi od zmysłów.' },
    { v: 20, cont: true, text: 'Czemu Go słuchacie?»' },
    { v: 21, text: 'Inni mówili: «To nie są słowa opętanego.' },
    { v: 21, cont: true, text: 'Czyż zły duch może otworzyć oczy niewidomym?»' },
  ],
  cam: { x: [-60, 60], y: [-100, 40], z: [1, 1.22] },
  build(S) {
    const c = S.c;
    const K = dayCourt(S, { skyCols: DAY });
    // the crack across the pavement (drawn by revealing a dashed stroke)
    const crackL = S.layer({ par: 0.5, sh: 1 });
    const pts = [[884, 566], [900, 596], [878, 628], [904, 660], [884, 694], [908, 730], [890, 770], [912, 820]];
    const crack = crackL.add(`<path d="M${pts.map((p) => p.join(' ')).join('L')}" pathLength="1" stroke="${shade(C.stone2, -0.35)}" stroke-width="5" stroke-linejoin="round" stroke-dasharray="1 1" stroke-dashoffset="1" fill="none"/>`);
    const fx = K.fx;
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 5, both: true, color: shade(C.halo, -0.05) });
    const slip = fx.add(`<g><circle r="90" fill="url(#halo-glow)"/>${word(c, tr('słowa Jezusa', 'His words'), { size: 20, fill: C.cream })}</g>`);
    const storm = `<g transform="translate(-26 0)">${GLYPH.storm(c)}</g><path d="${c.ribbon(c.arc(24, 0, 10, 10, 0, PI * 3.2, 24).map(([x, y], i) => [24 + (x - 24) * (1 - i / 30), y * (1 - i / 30)]), 2.4)}" fill="${C.storm2}"/>`;
    const bDemon = fx.add(`<g>${bubble(c, tr('opętany! szalony!', 'a demon! insane!'), { size: 20, tail: -1, fill: mix(C.stone2, C.storm, 0.25), ink: C.cream })}</g>`);
    const bStorm = fx.add(`<g>${speech(c, storm, { w: 86, h: 52, flip: true, fill: mix(C.stone2, C.storm, 0.25) })}</g>`);
    const bWhy = fx.add(`<g>${bubble(c, tr('czemu Go słuchacie?', 'why listen to Him?'), { size: 19, tail: -1, fill: mix(C.stone2, C.storm, 0.2), ink: C.cream })}</g>`);
    const scrollIc = `<g transform="translate(-14 0)"><path d="${c.cut(c.rect(-22, -12, 44, 24), 0.3, 5)}" fill="${C.parchment}"/><path d="${c.ribbon([[-14, -4], [14, -4]], 1.6) + c.ribbon([[-14, 3], [10, 3]], 1.6)}" fill="${C.haloRim}"/></g><g transform="translate(26 0) scale(.55)">${tick(c)}</g>`;
    const bGood = fx.add(`<g>${speech(c, scrollIc, { w: 96, h: 56, flip: false })}</g>`);
    const eye = fx.add(`<g>${workPlate(c, 'eye', { r: 58 })}</g>`);
    const eyeClosed = fx.add(`<g><path d="${c.cut(c.circ(0, 0, 58, 32), 0.4, 5)}" fill="${C.cream}"/><g transform="scale(2.4)">${eyeIcon(c, false, 16)}</g></g>`);
    K.front();
    const BX = S.portrait ? -50 : 0; // phone: the bubbles on the right stay inside the screen

    return (t, time) => {
      const T = time;
      K.court.sk.set(...DAY);
      pose(K.court.sunEl, { x: 1240, y: 140, r: Math.sin(T * 0.6) * 1 });
      pose(K.court.cl1, { x: 470 + Math.sin(T * 0.1) * 20, y: 140, r: Math.sin(T * 0.6) * 1.2 });
      /* v19 — His words; the division */
      const sk = es(t, 0.05, 0.3, ease.back) * (1 - es(t, 0.95, 1.15));
      vis(slip, { x: 800, y: 380, s: Math.min(1, sk), o: sk > 0.01 ? 1 : 0 });
      const cr = es(t, 0.3, 0.8);
      attr(crack, 'stroke-dashoffset', 1 - cr);
      const apart = es(t, 0.35, 0.85);
      /* v20 — the many: possessed, mad; why listen? */
      const b1 = es(t, 1.08, 1.25, ease.back) * (1 - es(t, 1.9, 2.05));
      vis(bDemon, { x: 1060 + BX, y: 440, s: b1, o: b1 > 0.01 ? 1 : 0 });
      const b1s = es(t, 1.35, 1.5, ease.back) * (1 - es(t, 1.9, 2.05));
      vis(bStorm, { x: 1140 + BX * 1.4, y: 360, s: b1s, o: b1s > 0.01 ? 1 : 0 });
      const b2 = es(t, 2.08, 2.25, ease.back) * (1 - es(t, 2.9, 3.05));
      vis(bWhy, { x: 1000 + BX, y: 440, s: b2, o: b2 > 0.01 ? 1 : 0 });
      /* v21 — the others: not the words of one possessed; can a demon open the eyes of the blind? */
      const b3 = es(t, 3.08, 3.25, ease.back) * (1 - es(t, 3.9, 4.05));
      vis(bGood, { x: 540, y: 420, s: b3, o: b3 > 0.01 ? 1 : 0 });
      const step = es(t, 4.05, 4.35);
      const ek = es(t, 4.15, 4.4, ease.back);
      const open = es(t, 4.4, 4.6);
      vis(eyeClosed, { x: 660, y: 330, s: ek, o: ek > 0.01 ? 1 - open : 0 });
      vis(eye, { x: 660, y: 330, s: ek, o: open });
      const talkR = Math.max(bump(t, 1.05, 1.95), bump(t, 2.05, 2.95));
      const talkL = Math.max(bump(t, 3.05, 3.95), bump(t, 4.05, 4.95));
      K.set(T, {
        j: { armF: 14 + bump(t, 0.05, 0.9) * 20, armB: 8 + bump(t, 0.05, 0.9) * 60, head: -bump(t, 1.1, 2.9) * 4 + bump(t, 3.1, 4.9) * 4 },
        seerO: { x: lerp(672, 650, apart) + step * 30, armF: 12 + step * 40 + bump(t, 4.3, 5) * 30, armB: 6 + step * 110, head: -step * 10 - bump(t, 4.4, 4.9) * 8 },
        lisF: (m) => ({ x: m.x - apart * 30, flip: false, armF: 12 + (m.i === 1 ? talkL * 50 : 0) + (m.i === 3 ? bump(t, 4.1, 4.9) * 60 : 0), armB: 8 + (m.i === 0 ? talkL * 90 : 0), head: -6 - bump(t, 4.3, 4.9) * 12 }),
        leadF: (m) => ({
          x: m.x + apart * 30, flip: true,
          armF: 18 + (m.i === 0 ? talkR * 70 : 0) + (m.i === 2 ? bump(t, 2.05, 2.9) * 80 : 0),
          armB: 10 + (m.i === 1 ? talkR * 120 : 0) + (m.i === 3 ? bump(t, 2.1, 2.9) * 100 : 0),
          head: (m.i % 2 ? -6 : 6) * bump(t, 1.0, 3) + bump(t, 4.3, 4.9) * -8,
          angry: 0.3 + es(t, 0.4, 0.8) * 0.5 * (1 - es(t, 4.4, 4.9) * 0.6),
        }),
      });
      rings(DC.JX + 6, DC.FLOOR - 170, bump(t, 0.02, 0.6) * 0.8, T, { s0: 0.8, spread: 2 });
      S.cam.x = kf(t, [[0, 0], [1, 0], [1.4, 50], [3, 50], [3.4, -50], [5, -40]]);
      S.cam.y = kf(t, [[0, 20], [1, 30], [3, 30], [4.2, -20]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.14], [1.4, 1.2], [3, 1.2], [3.4, 1.2], [5, 1.14]]);
    };
  },
};
