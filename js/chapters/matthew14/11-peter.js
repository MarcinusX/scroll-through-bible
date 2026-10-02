// Mt 14,28–31 — Peter leans out over the bow: "Lord, if it is you, bid me come to you on the water." — "Come!"
// He climbs over the side and walks on the waves towards Jesus. Then he looks at the wind: the gusts come back,
// the waves rise, he is afraid — he sinks to the waist and cries "Lord, save me!" At once Jesus reaches out His hand
// and takes hold of him: "O you of little faith, why did you doubt?"
import { C, person, CAST, blinkAt, pose, lerp, hanging } from '../kit.js';
import { boat, rays } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { kf, moving, headAt, hand, speech, GLYPH, oar, hungGold, cry, bubble, nightLake, waveCollar, waveIcon, TW, tr, PI } from './lib.js';

const BX0 = 520, BY = 704;
const JY = 716;
const JX0 = 1080;

export default {
  id: 'mt14-peter',
  beats: [
    { v: 28 },
    { v: 29, text: 'A On rzekł: «Przyjdź!»' },
    { v: 29, cont: true, text: 'Piotr wyszedł z łodzi, i krocząc po wodzie, przyszedł do Jezusa.' },
    { v: 30, text: 'Lecz na widok silnego wiatru uląkł się' },
    { v: 30, cont: true, text: 'i gdy zaczął tonąć, krzyknął: «Panie, ratuj mnie!»' },
    { v: 31, text: 'Jezus natychmiast wyciągnął rękę i chwycił go, mówiąc:' },
    { v: 31, cont: true, text: '«Czemu zwątpiłeś, małej wiary?»' },
  ],
  cam: { x: [-90, 280], y: [-20, 80], z: [1, 1.32] },
  build(S) {
    const c = S.c;
    const N = nightLake(S);
    const P = S.portrait;
    const JX = P ? 1030 : JX0;   // phone: Jesus clear of the thread; Peter's path shortened to match
    const BX = P ? 585 : BX0;     // phone: the boat a little nearer, its crew closer together, so nobody is sliced by the edge

    /* the boat with the others; Peter and Jesus on the water */
    const boatL = S.layer({ par: 0.6, sh: 5 });
    const B = boat(c, {});
    const DIS = [{ o: TW.andrew, x: P ? -75 : -120 }, { o: TW.john, x: P ? -38 : -60 }, { o: TW.james, x: 0 }, { o: TW.thomas, x: P ? 38 : 60 }];
    const glow = boatL.add(`<g>${rays(c, { n: 16, r0: 30, r1: 380, spread: 0.035, color: '#fff3cf' })}<circle r="150" fill="url(#halo-glow)"/></g>`);
    const boatG = boatL.add(`<g><g>${B.back}</g><g transform="translate(-40 -60) rotate(40)">${oar(c, 180)}</g>${DIS.map((d, i) => `<g data-k="w${i}">${person(c, d.o)}</g>`).join('')}<g data-k="pin">${person(c, TW.peter)}</g><g>${B.front}</g></g>`);
    const dis = DIS.map((d, i) => ({ ...d, i, p: S.puppet(S.$('w' + i).firstElementChild), seed: c.rr(0, 6) }));
    const pIn = S.puppet(S.$('pin').firstElementChild);
    const peter = S.puppet(boatL.add(person(c, TW.peter)));
    const collar = boatL.add(`<g>${waveCollar(c, 170)}</g>`);
    const jesus = S.puppet(boatL.add(person(c, { ...CAST.jesus })));
    const ripJ = [0, 1].map(() => boatL.add(`<path d="${c.ribbon(c.arc(0, 0, 30, 6, 0, PI * 2, 20), 2)}" fill="${C.foam}" opacity=".8"/>`));
    const ripP = [0, 1].map(() => boatL.add(`<path d="${c.ribbon(c.arc(0, 0, 30, 6, 0, PI * 2, 20), 2)}" fill="${C.foam}" opacity=".8"/>`));

    /* the words */
    const fx = S.layer({ par: 0.62, sh: 4 });
    const ask = fx.add(`<g>${speech(c, `<g transform="scale(1.2)">${waveIcon(c)}</g>`, { w: 62, h: 58 })}</g>`);
    const come = fx.add(hungGold(c, tr('Przyjdź!', 'Come!'), { size: 40 }));
    const afraid = fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 42 })}</g>`);
    const save = fx.add(`<g>${cry(c, tr('Panie, ratuj mnie!', 'Lord, save me!'), { size: 22, dir: -1 })}</g>`);
    const why = fx.add(`<g>${bubble(c, tr('Czemu zwątpiłeś?', 'Why did you doubt?'), { size: 21, dir: 1 })}</g>`);
    N.front();

    const PK = P ? [[2.05, BX + 150], [2.25, BX + 230], [2.95, 835], [3.05, 845], [5.2, 845], [5.45, 878]] : [[2.05, BX + 150], [2.25, BX + 230], [2.95, 880], [3.05, 890], [5.2, 890], [5.45, 925]];
    return (t, time) => {
      const T = time;
      const gust = es(t, 3.05, 3.4) * (1 - es(t, 6.8, 7.0) * 0);
      const { rock, heave } = N.update(t, T, { wind: 0.45 + gust * 0.55, moonX: 890, moonY: 240 });

      const drift = P ? es(t, 3.0, 3.6) * 140 : 0;   // phone: the gust pushes the empty-handed boat back, off the edge
      pose(boatG, { x: BX - drift, y: BY + heave * 0.8, s: 1.0, r: rock * 0.8 });
      dis.forEach((d) => d.p.set({ x: d.x, y: 4, s: 0.95, flip: false, armF: 40 + bump(t, 2.05, 2.9) * 40 + bump(t, 4.05, 4.9) * 60, armB: 20 + bump(t, 4.05, 4.9) * 100, head: -bump(t, 4.05, 4.9) * 6, blink: blinkAt(T, d.seed) }));

      /* v28 — Peter at the bow: "Lord, if it is you, bid me come" */
      const out = es(t, 2.05, 2.1);
      const lean = bump(t, 0.1, 0.98);
      pIn.set({ x: 130, y: 4, s: 0.95, flip: false, o: 1 - out, armF: 30 + lean * 70 + bump(t, 1.2, 1.9) * 20, armB: lean * 120, lean: lean * 12, head: -lean * 4, blink: blinkAt(T, 2) });
      const [ax, ay] = headAt(BX + 130, BY + 4, 0.95, false);
      const ak = es(t, 0.2, 0.38, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(ask, { x: ax + 22, y: ay - 20, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v29a — "Come!" */
      const beckon = bump(t, 1.05, 1.95);
      const reach = es(t, 5.05, 5.25);
      const jx = JX - es(t, 5.0, 5.3) * 70 + 10;
      jesus.set({ x: jx, y: JY, s: 1.0, flip: true, armF: 20 + beckon * 80 + reach * 90 - bump(t, 6.1, 6.9) * 20, armB: 10 + beckon * 100 + bump(t, 6.05, 6.95) * 60, head: -reach * 4 + reach * 10, blink: blinkAt(T) });
      const ck = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 1.95, 2.1));
      pose(come, { x: 880, y: lerp(-500, 240, ck), r: Math.sin(T * 0.8) * 1.2, o: ck > 0.01 ? 1 : 0 });
      const shine = Math.max(0.25, beckon, bump(t, 5.05, 6.0));
      pose(glow, { x: jx, y: JY - 130, s: 0.3 + shine * 0.8, r: T * 5, o: shine * 0.24 });
      ripJ.forEach((r, i) => { const k = (T * 0.6 + i / 2) % 1; pose(r, { x: jx, y: JY + 2, s: 0.4 + k * 1.2, sy: 0.9, o: (1 - k) * 0.9 }); });

      /* v29b — out of the boat, walking on the water towards Jesus */
      const px = kf(t, PK);
      const step = bump(t, 2.05, 2.25) * 40;
      const sink = es(t, 4.05, 4.5) * (1 - es(t, 5.3, 5.7));
      const fear = es(t, 3.1, 3.3);
      const shake = fear * (1 - es(t, 5.4, 5.7)) * Math.sin(T * 18) * 3;
      const held = es(t, 5.3, 5.5);
      const [hx, hy] = hand(jx, JY, 1.0, true, 20 + 90);
      peter.set({
        x: px, y: JY + 4 - step + sink * 92, s: 0.98, flip: false, o: out, walk: moving(t, PK) ? px * 0.05 : undefined,
        armF: 30 + fear * 50 * (1 - held) + sink * 70 + held * 40, armB: 20 + fear * 100 + sink * 50 - held * 60, lean: -fear * 8 + sink * 4 + held * 6 + shake, head: fear * 10 * (1 - sink) - sink * 12 + held * 10, blink: blinkAt(T, 2),
      });
      pose(collar, { x: px + 4, y: JY + 6 + bump(t, 2.05, 2.2) * 0, o: seg(t, 3.95, 4.05) * (1 - seg(t, 5.6, 5.7)) });
      ripP.forEach((r, i) => { const k = (T * 0.7 + i / 2) % 1; pose(r, { x: px, y: JY + 6, s: 0.4 + k * 1.1, sy: 0.9, o: (1 - k) * out * (1 - seg(t, 3.95, 4.05)) }); });

      /* v30 — the wind: afraid; sinking — "Lord, save me!" */
      const [pxh, pyh] = headAt(px, JY + 4 + sink * 92, 0.98, false);
      const fk = es(t, 3.2, 3.35, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(afraid, { x: pxh + 18, y: pyh - 22, s: fk, o: fk > 0.01 ? 1 : 0 });
      const sk = es(t, 4.35, 4.55, ease.back) * (1 - es(t, 4.97, 5.05));
      pose(save, { x: pxh - 16, y: pyh - 26, s: sk, r: sk > 0.02 ? Math.sin(T * 7) * 2 : 0, o: sk > 0.02 ? 1 : 0 });

      /* v31b — "O you of little faith, why did you doubt?" */
      const [jhx, jhy] = headAt(jx, JY, 1.0, true);
      const wk = es(t, 6.1, 6.3, ease.back);
      pose(why, { x: jhx + 16, y: jhy - 24, s: wk, o: wk > 0.01 ? 1 : 0 });

      S.cam.x = P ? kf(t, [[0, -20], [1.9, -20], [2.9, 10], [3.6, 265], [6.0, 265]])   // phone: the whole crew, Peter and Jesus in view; once he is out, only the bow
        : kf(t, [[0, -20], [1.0, 40], [1.9, 60], [3.0, 150], [3.9, 180], [4.5, 200], [6.0, 200]]);
      S.cam.z = kf(t, [[0, P ? 1.08 : 1.12], [1.0, 1.06], [2.0, 1.04], [3.0, 1.12], [4.3, 1.26], [5.2, 1.3], [6.2, 1.28]]);
      S.cam.y = kf(t, [[0, 40], [2.0, 30], [3.0, 40], [4.3, 70], [6.2, 60]]);
    };
  },
};
