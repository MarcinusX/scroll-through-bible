// J 14,8–9 — back in the upper room, close on Philip. "Lord, show us the Father": he lifts his hands and looks up,
// and an empty gilt frame comes down from the flies — waiting to be filled. "Have I been with you so long, and you
// do not know Me, Philip?": a garland of small plates strings itself across the wall — the jars of Cana, the loaves
// (Philip's own question), the mat, the opened eyes, the healed boy — all the time they have had together.
// "Whoever has seen Me has seen the Father": the frame glides down round Jesus and light streams through Him as
// through a window. "How can you say, 'Show us the Father'?": Philip's little speech bubble folds and drops away,
// and he looks — at Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nightRoom, seatEleven, sitAt, emptySeat, afterTable, EMPTY_X, seatX, goldFrame, garlandString, workPlate, bubble, glowDisc,
  rayBurst, question, hanging, swing, kf, vis, headAt, tr, PI,
} from './lib.js';

const ICONS = ['jar', 'bread', 'mat', 'eye', 'boy'];

export default {
  id: 'j14-philip',
  beats: [
    { v: 8 },
    { v: 9, text: 'Odpowiedział mu Jezus: «Filipie, tak długo jestem z wami, a jeszcze Mnie nie poznałeś?' },
    { v: 9, cont: true, text: 'Kto Mnie zobaczył, zobaczył także i Ojca.' },
    { v: 9, cont: true, text: 'Dlaczego więc mówisz: "Pokaż nam Ojca?"' },
  ],
  cam: { x: [-280, 40], y: [-80, 200], z: [1, 1.8] },
  build(S) {
    const c = S.c;
    const R = nightRoom(S);
    const { SEAT, TOP, FLOOR } = R;
    const PX = seatX('philip');

    // the garland of days together
    const garL = S.layer({ par: 0.32, sh: 3 });
    const gy = 250;
    const gs = garL.add(`<g>${garlandString(c, 420, 1180, gy, 46)}</g>`);
    const plates = ICONS.map((ic, i) => {
      const x = 500 + i * 150, y = gy + Math.sin(((x - 420) / 760) * PI) * 46 + 36;
      return { i, x, y, el: garL.add(`<g><path d="M0 -36V-30" stroke="${C.rope}" stroke-width="1.4"/>${workPlate(c, ic, { r: 30 })}</g>`) };
    });
    // the light that shines through Him (behind the seated row)
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const light = lightL.add(`<g>${glowDisc(260, 'halo-glow', 1)}${rayBurst(c, { n: 24, r0: 60, r1: 330, spread: 0.045, o: 0.32 })}</g>`);

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatEleven(S, seatL);
    seatL.add(`<g transform="translate(${EMPTY_X} ${TOP + 16})">${emptySeat(c)}</g>`);
    const J = at.find((m) => m.k === 'jesus'), P = at.find((m) => m.k === 'philip');
    const frameL = S.layer({ par: 0.535, sh: 6 });
    const canvas = frameL.add(`<g><rect x="-98" y="-95" width="196" height="190" fill="${mix(C.parchment, C.lavender, 0.3)}"/><rect class="grain" x="-98" y="-95" width="196" height="190"/></g>`);
    const frame = frameL.add(`<g>${goldFrame(c, 196, 190)}</g>`);
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${afterTable(c, 860)}</g>`);
    const fx = S.layer({ par: 0.58, sh: 4 });
    const say = fx.add(`<g>${bubble(c, tr('Pokaż nam Ojca!', 'Show us the Father!'), { size: 19, tail: -1 })}</g>`);
    const q = fx.add(`<g>${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, 1);
      /* v8 — Philip asks; an empty frame comes down */
      const ask = es(t, 0.08, 0.35) * (1 - es(t, 3.2, 3.6));
      const fr = es(t, 0.3, 0.75, ease.out);
      const down = es(t, 2.05, 2.5, ease.inOut);
      const fx0 = 650, fy0 = 430, fx1 = 800, fy1 = 566;
      const fp = { x: lerp(fx0, fx1, down), y: lerp(fy0 - (1 - fr) * 700, fy1, down), s: lerp(0.8, 1, down), r: (T ? Math.sin(T * 0.8) * 0.8 : 0) * (1 - down) };
      vis(frame, { ...fp, o: fr > 0.001 ? 1 : 0 });
      vis(canvas, { ...fp, o: fr > 0.001 ? 1 - es(t, 2.0, 2.3) : 0 });
      /* v9a — the garland of their days together */
      fade(gs, es(t, 1.05, 1.25));
      plates.forEach((p) => { const k = es(t, 1.1 + p.i * 0.1, 1.3 + p.i * 0.1, ease.back); vis(p.el, { x: p.x, y: p.y, s: k * 0.95, r: T ? Math.sin(T * 0.9 + p.i) * 3 : 0, o: k > 0.01 ? 1 : 0 }); });
      /* v9b — seen through Him, as light through a window */
      const shine = es(t, 2.3, 2.7);
      vis(light, { x: 800, y: 590, s: 0.5 + shine * 0.6 + (T ? Math.sin(T * 1.2) * 0.02 : 0), o: shine });

      at.forEach((m) => {
        if (m.k === 'jesus') {
          const turn = es(t, 1.05, 1.3);
          sitAt(m, SEAT, T, { flip: turn > 0.5 ? true : false, armF: 30 + turn * 40 * (1 - shine) + shine * 70 - es(t, 3.1, 3.4) * 30, armB: 14 + shine * 100 * (1 - es(t, 3.1, 3.4)) + es(t, 3.1, 3.4) * 50, head: -turn * 4 });
          return;
        }
        if (m.k === 'philip') {
          const look = es(t, 3.2, 3.5);
          sitAt(m, SEAT, T, { armF: 36 + ask * 90, armB: 14 + ask * 120, head: -ask * 16 * (1 - look) + look * 2 });
          fade(m.sad, es(t, 1.2, 1.4) * (1 - es(t, 3.3, 3.6)));
          return;
        }
        const turn = es(t, 0.1, 0.4);
        const lit = shine * (1 - Math.min(1, Math.abs(m.x - 800) / 500) * 0.5);
        sitAt(m, SEAT, T, { flip: m.x < PX ? false : m.x > 800 ? true : turn > 0.5 && t < 2.2 ? true : false, head: -lit * 6 });
      });
      /* the speech bubble — asked, then folded away */
      const [hx, hy] = headAt(PX, SEAT, 0.88, false, 62);
      const b1 = es(t, 0.1, 0.3, ease.back) * (1 - es(t, 0.95, 1.1));
      const b2 = es(t, 3.05, 3.2, ease.back);
      const drop = es(t, 3.4, 3.8, ease.in);
      vis(say, { x: hx + 40, y: hy - 30 + drop * 120, s: (b1 + b2 * (1 - drop * 0.6)) * 0.9, r: drop * 40, sy: 1 - drop * 0.7, o: Math.max(b1, b2 * (1 - drop)) > 0.01 ? Math.max(b1, b2 * (1 - drop)) : 0 });
      const qk = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.92, 2.05));
      vis(q, { x: hx - 30, y: hy - 120, s: qk * 0.7, o: qk > 0.01 ? 1 : 0 });

      // phone: the whole garland of plates in view
      S.cam.x = kf(t, S.portrait ? [[0, -260], [0.9, -250], [1.4, 0], [2.5, 0], [3.1, -120], [4, -150]] : [[0, -260], [0.9, -250], [1.4, -120], [2.1, -40], [2.5, 0], [3.1, -120], [4, -150]]);
      S.cam.y = kf(t, [[0, 60], [0.5, 50], [1.1, -40], [1.9, -40], [2.4, 150], [3.1, 150], [4, 150]]);
      S.cam.z = kf(t, S.portrait ? [[0, 1.75], [0.9, 1.7], [1.2, 1.04], [1.9, 1.04], [2.5, 1.5], [3.1, 1.6], [4, 1.6]] : [[0, 1.75], [0.9, 1.7], [1.2, 1.1], [1.9, 1.12], [2.5, 1.5], [3.1, 1.6], [4, 1.6]]);
    };
  },
};
