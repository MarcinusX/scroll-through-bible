// Mt 16,17 — "Blessed are you, Simon Bar-Jonah": Jesus lays His hand on the kneeling Peter's head, and his old name is
// let down on a tag over him. "Flesh and blood has not revealed this to you" — a painted plate of two grey figures
// whispering comes down and is crossed out; "but my Father who is in heaven": high above, the light of the Father opens
// (light, never a figure) and a shaft of it comes down on Peter, a little gold slip of the Word sliding down into him.
import { person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { headAt, hand, nameTag, plateCard, shadowPerson, crossX, radiance, lightShaft, goldSlip, glowDisc, spark, hangAt, caesareaSet, caesareaFront, CZ, DIS16, tr } from './lib.js';

const GY = CZ.GROUND, JX = 800, PK = 872;

export default {
  id: 'mt16-blessed',
  beats: [
    { v: 17, text: 'Na to Jezus mu rzekł: «Błogosławiony jesteś, Szymonie, synu Jony.' },
    { v: 17, cont: true, text: 'Albowiem nie objawiły ci tego ciało i krew, lecz Ojciec mój, który jest w niebie.' },
  ],
  cam: { x: [-20, 40], y: [-60, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const Z = caesareaSet(S);

    /* ---------- the light of the Father and its shaft ---------- */
    const lightL = S.layer({ par: 0.5, sh: 1, flat: true, rise: 0 });
    const rad = lightL.add(`<g><circle r="260" fill="url(#halo-glow)"/>${radiance(c, 70)}</g>`);
    const shaft = lightL.add(`<g>${lightShaft(c, { w0: 30, w1: 90, h: 640, o: 0.45 })}</g>`);

    /* ---------- the plate of "flesh and blood" ---------- */
    const plL = S.layer({ par: 0.1, sh: 7 });
    const two = `<g transform="translate(-26 44) scale(.36)">${shadowPerson(c, { ...CAST.andrew }, '#8c8584')}</g><g transform="translate(26 44) scale(-.36 .36)">${shadowPerson(c, { ...CAST.matthew }, '#9a9391')}</g><path d="M-8 -34Q0 -44 8 -34" stroke="#8c8584" stroke-width="3" fill="none"/><path d="M-4 -46Q0 -52 4 -46" stroke="#8c8584" stroke-width="3" fill="none"/>`;
    const plate = plL.add(`<g><path d="M-60 0V-1500M60 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${plateCard(c, two, tr('ciało i krew', 'flesh and blood'), { w: 170, h: 150 })}</g>`);
    const xOut = plL.add(`<g>${crossX(c, 46)}</g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const dis = DIS16.filter((d) => d.k !== 'peter').map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const glow = P.add(`<g>${glowDisc(120, 'warm-glow', 1)}</g>`);
    const peterK = S.puppet(P.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const tagEl = fx.add(`<g><path d="M0 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, [tr('Szymon,', 'Simon,'), tr('syn Jony', 'Bar Jonah')], { size: 20 })}</g>`);
    const sparks = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${spark(c, 9)}</g>`));
    const slip = fx.add(`<g>${goldSlip(c, 44)}</g>`);
    caesareaFront(S);

    return (t, time) => {
      const T = time;
      const father = es(t, 1.35, 1.7);
      Z.update(T, { gold: 0.55 - es(t, 0, 0.6) * 0.3 + father * 0.35 });

      /* v17a — Jesus steps to Peter and lays His hand on his head */
      const bless = es(t, 0.1, 0.4);
      jesus.set({ x: lerp(780, JX, bless), y: GY, s: 1, flip: false, armF: 16 + bless * 44 - father * 10, armB: 8 + bump(t, 1.05, 1.9) * 40 + father * 90, head: 6 * bless - father * 10, blink: blinkAt(T) });
      const [px, py] = headAt(PK, GY + 6, 0.9, true, 46);
      peterK.set({ x: PK, y: GY + 6, s: 0.9, flip: true, armF: 70 - bless * 10 + father * 20, armB: 30 + father * 90, head: 10 * bless - father * 22, blink: bless > 0.5 && t < 1.3 ? 0.85 : blinkAt(T, 1) });
      pose(glow, { x: px, y: py + 30, s: 0.8 + bless * 0.4, o: bless * 0.7 + father * 0.3 });
      const tk = es(t, 0.3, 0.6, ease.out);
      hangAt(tagEl, PK + 10, lerp(-700, 360, tk), T, 1.4, 0.9, 1);
      sparks.forEach((sp, i) => {
        const a = (i / 5) * PI2 + (T ? T * 0.7 : 0);
        const k = es(t, 0.45 + i * 0.05, 0.6 + i * 0.05, ease.back) * (1 - es(t, 1.2, 1.4));
        pose(sp, { x: px + Math.cos(a) * 60, y: py - 10 + Math.sin(a) * 30, s: k, o: k > 0.02 ? 1 : 0 });
      });
      dis.forEach((d) => {
        const up = father * (d.i % 2 ? 1 : 0.6);
        d.p.set({ x: d.x, y: GY + 4 + (d.i % 2) * 8, s: 0.88, flip: d.x > JX, armF: 18 + bless * 16 + up * 20, armB: 10 + up * 60, head: 4 * bless - up * 16, blink: blinkAt(T, d.seed) });
      });

      /* v17b — not flesh and blood (the plate is crossed out) … */
      const pd = es(t, 1.05, 1.35, ease.back) * (1 - es(t, 1.7, 1.95));
      const plx = S.portrait ? 570 : 550, ply = 225;
      hangAt(plate, plx, ply - (1 - pd) * 800, T, 1.2, 0.8, 2);
      const xk = es(t, 1.25, 1.38, ease.back) * (1 - es(t, 1.7, 1.95));
      pose(xOut, { x: plx, y: ply + 64 - (1 - pd) * 800, s: xk, o: xk > 0.02 ? 1 : 0 });
      /* … but the Father in heaven: the light and its shaft onto Peter, the slip of the Word sliding down it */
      pose(rad, { x: PK - 20, y: lerp(-500, 90, father), s: 0.8 + father * 0.2, r: T ? T * 2 : 0, o: father > 0.01 ? 1 : 0 });
      pose(shaft, { x: px, y: py - 10, sx: father, sy: 1, o: father });
      const sl = es(t, 1.5, 1.85);
      pose(slip, { x: lerp(PK - 20, px, sl), y: lerp(120, py - 20, sl), s: 1 - sl * 0.5, r: -10 + sl * 10, o: sl > 0.01 && sl < 0.98 ? 1 : 0 });

      S.cam.x = es(t, 0.05, 0.4) * 30;
      S.cam.z = 1.1 + es(t, 0.05, 0.4) * 0.04 - es(t, 1.0, 1.4) * 0.12;
      S.cam.y = 40 + es(t, 0.05, 0.4) * 10 - es(t, 1.0, 1.4) * 90;
    };
  },
};
const PI2 = Math.PI * 2;
