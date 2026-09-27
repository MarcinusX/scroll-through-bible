// J 4,39–42 — the people of Sychar at the well. The woman tells them; small lights kindle over those who believe
// her word — "He told me everything I ever did." They ask Him to stay; the sky turns night and day, night and day,
// as two day-cards drop — He stayed two days (the town's windows glow at night). Many more believe because of His own
// word: lights kindle over the second wave of people. They turn kindly to her — "we no longer believe because of
// what you said" — "we have heard for ourselves": and a globe of the world comes down over Him in light: truly
// the Saviour of the world.
import { C, person, blinkAt, lerp, sheet } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { ear } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { wellSet, wellCast, G, AFTER, samaritan, soulLight, say, speech, heart, globe, glory, strip, nameTag, hanging, swing, vis, kf, headAt } from './lib.js';

const NIGHT = ['#27305e', '#3a3f72', '#5d5a86'];

export default {
  id: 'j4-believe',
  beats: [
    { v: 39, text: 'Wielu Samarytan z owego miasta zaczęło w Niego wierzyć dzięki słowu kobiety świadczącej:' },
    { v: 39, cont: true, text: '«Powiedział mi wszystko, co uczyniłam».' },
    { v: 40, text: 'Kiedy więc Samarytanie przybyli do Niego, prosili Go, aby u nich pozostał.' },
    { v: 40, cont: true, text: 'Pozostał tam zatem dwa dni.' },
    { v: 41 },
    { v: 42, text: 'a do tej kobiety mówili: «Wierzymy już nie dzięki twemu opowiadaniu,' },
    { v: 42, cont: true, text: 'na własne bowiem uszy usłyszeliśmy i jesteśmy przekonani, że On prawdziwie jest Zbawicielem świata».' },
  ],
  cam: { x: [-80, 120], y: [-80, 80], z: [0.95, 1.3] },
  build(S) {
    const c = S.c;
    let nightL;
    const W = wellSet(S, { skyCols: AFTER, sunAt: [1000, 170], lit: true, behind: (S) => S.layer({ par: 0.55, sh: 0, flat: true }) });
    // a night sky sheet over the day sky (behind the hills) — faded in and out on the compositor
    nightL = S.layer({ par: 0.02, sh: 0, flat: true });
    nightL.el.parentNode.insertBefore(nightL.el, W.hangL.el);
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${NIGHT[1]}"/>${stars(c, { x0: -600, x1: 2200, y0: -400, y1: 420, n: 90 })}`);
    const moonEl = hanging(W.hangL, moon(c, 36), { x: 560, y: 170, len: 700 });
    const glowJ = W.behind.add(`<g>${glory(c, 380, 22)}</g>`);
    const K = wellCast(S, W);
    const L = W.actL;
    const SP = [[430, 0], [520, 8], [600, -4], [1080, 4], [1150, -6], [1215, 8], [1290, 0], [1360, 10], [1430, -2]];
    const town = SP.map(([x, dy], i) => ({ i, x, y: G.floor + dy, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, samaritan(c, i + 90)))), wave2: i === 2 || i >= 7 }));
    const tintL = S.layer({ par: 0, sh: 0, flat: true });
    tintL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${NIGHT[0]}"/>`);
    const fx = S.layer({ par: 0.55, sh: 5 });
    const lights = town.map(() => fx.add(`<g>${soulLight(c, 9)}</g>`));
    const told = fx.add(`<g>${speech(c, `<g transform="translate(-16 2) scale(.9)">${heart(c, 11)}</g><g transform="translate(14 0)">${sheet().p(c.cut(c.rect(-14, -10, 28, 20), 0.3, 4), C.parchment).x(c.ribbon([[-9, -4], [9, -4]], 1.4) + c.ribbon([[-9, 1], [9, 1]], 1.4) + c.ribbon([[-9, 6], [5, 6]], 1.4), C.inkSoft).out()}</g>`, { w: 76, h: 50, flip: true })}</g>`);
    const stay = fx.add(`<g>${say(c, tr('Zostań u nas!', 'Stay with us!'), { size: 21, side: -1 })}</g>`);
    const days = [1, 2].map((n, i) => hanging(fx, nameTag(c, tr(`dzień ${n}`, `day ${n}`), { size: 20 }), { x: 700 + i * 200, y: 250, len: 600 }));
    const kind = [0, 1].map(() => fx.add(`<g>${heart(c, 13)}</g>`));
    const ears = [0, 1, 2].map(() => fx.add(`<g transform="scale(.5)">${ear(c)}</g>`));
    const world = fx.add(`<g><circle r="140" fill="url(#halo-glow)"/>${globe(c, 66)}</g>`);
    const saviour = fx.add(`<g>${strip(c, tr('Zbawiciel świata', 'the Saviour of the world'), { size: 22 })}</g>`);

    return (t, time) => {
      const T = time;
      /* v40b — two days: night, day, night, day */
      const cyc = seg(t, 3.05, 3.95);
      const night = Math.max(bump(cyc, 0.02, 0.48), bump(cyc, 0.52, 0.98));
      const dusk0 = 0;
      nightL.fade(night * 0.85);
      nightL.shift(0, night > 0.001 ? 0 : 6000);
      tintL.shift(0, night > 0.001 || dusk0 > 0.001 ? 0 : 6000);
      tintL.fade(night * 0.4);
      W.update(t, T, { sunX: lerp(1000, 1500, night), sunY: 170 + night * 500, glow: 0.6 * (1 - night) });
      swing(moonEl, 560, 170 + (1 - night) * 500, night > 0.001 ? T : 0, 1, 0.6, 1);
      fade(moonEl, night > 0.001 ? 1 : 0);
      days.forEach((d, i) => {
        const k = es(t, 3.2 + i * 0.4, 3.35 + i * 0.4, ease.back) * (1 - es(t, 4.05, 4.3, ease.in));
        swing(d, 700 + i * 200, 250 - (1 - k) * 600, k > 0.001 ? T : 0, 1.4, 0.8, i);
        fade(d, k > 0.001 ? 1 : 0);
      });
      /* people */
      const spoke = es(t, 0.1, 0.3) * (1 - es(t, 1.9, 2.05));
      const ask = es(t, 2.05, 2.3) * (1 - es(t, 2.95, 3.1));
      const toHer = es(t, 5.05, 5.3) * (1 - es(t, 5.95, 6.1));
      const [whx, why] = K.wHead(G.wx + 30);
      town.forEach((f) => {
        const arrive = f.wave2 ? es(t, 4.0, 4.4) : 1;
        const x = f.wave2 ? lerp(f.x + (f.x > 800 ? 500 : -500), f.x, arrive) : f.x;
        const faceHer = toHer > 0.5 && f.x > G.wx;
        f.p.set({
          x, y: f.y, s: 0.96, flip: f.x > 800 && !(faceHer && false), o: f.wave2 ? (arrive > 0.01 ? 1 : 0) : 1, walk: arrive > 0 && arrive < 1 ? x * 0.05 : undefined,
          armF: 16 + ask * (f.x > 800 ? 80 : 60) + toHer * (f.i === 3 ? 70 : 20) + es(t, 6.1, 6.4) * 40, armB: 12 + es(t, 6.2, 6.5) * 110 * (f.i % 2),
          head: -ask * 6 + (f.x > G.wx ? toHer * -10 : 0) - es(t, 6.2, 6.5) * 8, lean: ask * 5, blink: blinkAt(T, f.seed),
        });
        const lk = f.wave2 ? es(t, 4.4 + (f.i % 3) * 0.1, 4.6 + (f.i % 3) * 0.1, ease.back) : es(t, 0.35 + f.i * 0.07, 0.55 + f.i * 0.07, ease.back);
        const [hx, hy] = headAt(x, f.y, 0.96, f.x > 800);
        vis(lights[f.i], { x: hx, y: hy - 44 + Math.sin(T * 2 + f.i) * 2, s: lk, o: lk > 0.01 ? 1 : 0 });
      });
      K.set({
        T, jF: 22 + es(t, 2.3, 2.6) * 40 * (1 - es(t, 3.9, 4.1)) + bump(t, 4.05, 4.95) * 50, jB: 12 + bump(t, 4.05, 4.95) * 30, jH: -2,
        wx: G.wx + 30, wF: 30 + spoke * (40 + Math.sin(T * 3) * 10) + toHer * 30, wB: 20 + spoke * 60, wH: -spoke * 4 - toHer * 6, wFlip: t > 5.05 && t < 6.1 ? false : true,
        jarAt: { x: K.RIM.x, y: K.RIM.y, s: 0.78, o: 1 },
      });
      const tk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(told, { x: whx - 16, y: why - 22, s: tk, o: tk > 0.01 ? 1 : 0 });
      const [shx, shy] = headAt(1080, G.floor, 0.96, true);
      const sk = es(t, 2.2, 2.4, ease.back) * (1 - es(t, 2.9, 3.0));
      vis(stay, { x: shx - 6, y: shy - 22, s: sk, o: sk > 0.01 ? 1 : 0 });
      kind.forEach((h, i) => {
        const k = es(t, 5.3 + i * 0.12, 5.5 + i * 0.12, ease.back) * (1 - es(t, 5.95, 6.05));
        vis(h, { x: whx + 10 + i * 34, y: why - 50 - i * 14 + Math.sin(T * 2 + i) * 3, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v42b — heard for ourselves: the Saviour of the world */
      ears.forEach((e, i) => {
        const f = town[[3, 5, 8][i]];
        const [hx, hy] = headAt(f.x, f.y, 0.96, true);
        const k = es(t, 6.1 + i * 0.06, 6.25 + i * 0.06, ease.back) * (1 - es(t, 6.5, 6.6));
        vis(e, { x: hx + 26, y: hy - 30, s: k * 0.5, o: k > 0.01 ? 1 : 0 });
      });
      const gk = es(t, 6.35, 6.7, ease.out);
      const [jhx, jhy] = K.head();
      vis(world, { x: jhx + 60, y: lerp(-200, 330, gk) + Math.sin(T) * 3, r: T * 4, s: 1, o: gk > 0.01 ? 1 : 0 });
      vis(saviour, { x: jhx + 60, y: 440, s: es(t, 6.6, 6.8, ease.back), o: es(t, 6.6, 6.7) });
      vis(glowJ, { x: jhx, y: jhy, s: 0.5 + gk * 0.6, r: T * 3, o: gk * 0.9 });

      S.cam.x = kf(t, [[-0.5, 120], [0.3, 110], [1.9, 90], [2.3, 60], [3.0, 40], [4.0, 20], [5.0, 60], [6.0, 40]]);
      S.cam.y = kf(t, [[-0.5, 30], [1.0, 40], [3.0, 0], [4.0, 0], [5.0, 40], [6.3, -20]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [1.0, 1.14], [2.0, 1.1], [3.0, 1.0], [4.0, 0.98], [5.0, 1.14], [6.3, 1.0]]);
    };
  },
};
