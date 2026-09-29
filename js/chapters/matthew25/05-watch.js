// Mt 25,13 — the painted street flies away: it is night on the Mount of Olives, Jerusalem dark across the valley, and
// Jesus stands among Peter, Andrew, James and John. "Keep watch, then" — he lifts a small lamp, and the four look up
// wide awake. "For you know neither the day nor the hour": two round plates come down — a day, a sun with a question
// on it, and an hour, an hourglass with a question — and a thin line of dawn waits on the far hills.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { olivesSet, circle, SKIES, handLamp, voiceRings, roundel, hourglass, question, plateOn, tr } from './lib.js';
import { sun } from '../../assets/nature.js';

const JX = 800;

export default {
  id: 'mt25-watch',
  beats: [
    { v: 13, text: 'Czuwajcie więc,' },
    { v: 13, cont: true, text: 'bo nie znacie dnia ani godziny.' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const set = olivesSet(S, { skyCols: SKIES.night, tintCol: C.night, tintK: 0.35, moonXY: [1190, 150], templeGlow: 0.15 });
    const c = set.c;
    const L = S.layer({ par: 0.5, sh: 5 });
    const ring = circle(S, L, { tintCol: C.night, tintK: 0.08 });
    const J = S.puppet(L.add(person(c, { ...CAST.jesus, holdB: `<g class="jlamp">${handLamp(c, { glowR: 200 })}</g>` })));
    const lampEl = J.el.querySelector('.jlamp'), flameEl = J.el.querySelector('.flame');
    const voice = voiceRings(L, c, { n: 3, r: 26, w: 4, color: shadeLite() });
    set.front();
    const fx = S.layer({ par: 0.25, sh: 6 });
    const dayP = fx.add(`<g>${plateOn(c, `<g transform="translate(-8 4)">${sun(c, 24)}</g><g transform="translate(22 -8) scale(.7)">${question(c)}</g>`, { r: 52 })}</g>`);
    const hourP = fx.add(`<g>${plateOn(c, `<g transform="translate(-10 4)">${hourglass(c, 60)}</g><g transform="translate(22 -8) scale(.7)">${question(c)}</g>`, { r: 52 })}</g>`);
    const dawn = S.layer({ par: 0.12, sh: 0, flat: true });
    dawn.add(`<g><ellipse cx="800" cy="440" rx="900" ry="60" fill="url(#warm-glow)" opacity=".7"/></g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunO: 0, moonO: 1, moon: 150, glow: 0.15, starsO: 1 });
      ring.jesus.set({ o: 0 });
      /* v13a — keep watch: the lamp lifted, the four wide awake */
      const lift = es(t, 0.1, 0.45);
      const aB = 20 + lift * 140;
      J.set({ x: JX, y: 694, s: 1.05, armB: aB, armF: 30 + es(t, 1.05, 1.3) * 40, head: -lift * 6, blink: blinkAt(T, 1) });
      pose(lampEl, { r: aB });
      pose(flameEl, { x: 27, y: -12, sy: 1 + Math.sin(T * 7) * 0.1 + lift * 0.3, sx: 1 + Math.sin(T * 5) * 0.06 });
      voice(JX + 6, 694 - 176, es(t, 0.05, 0.25) * (1 - es(t, 0.8, 0.95)) + es(t, 1.05, 1.2) * (1 - es(t, 1.8, 1.95)), T, { s0: 0.8 });
      ring.four.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, head: -6 - lift * 10, armF: 20 + lift * 20, blink: lift > 0.5 ? 0 : blinkAt(T, m.seed) }));
      /* v13b — neither the day nor the hour */
      const dk = es(t, 1.05, 1.4, ease.back), hk = es(t, 1.15, 1.5, ease.back);
      pose(dayP, { x: 610, y: lerp(-1500, 250, dk), r: Math.sin(T * 0.8) * 2, o: dk > 0.01 ? 1 : 0 });
      pose(hourP, { x: 990, y: lerp(-1500, 250, hk), r: Math.sin(T * 0.8 + 1) * 2, o: hk > 0.01 ? 1 : 0 });
      dawn.fade(es(t, 1.2, 1.8) * 0.7);
      S.cam.z = 1 + es(t, 0, 0.5) * 0.04;
      S.cam.y = -es(t, 1.0, 1.5) * 30;
    };
  },
};
function shadeLite() { return '#f3dca0'; }
