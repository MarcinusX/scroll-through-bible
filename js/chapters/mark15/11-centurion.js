// Mk 15,39 — the centurion, standing opposite the cross. The darkness is lifting; a pale gold light, like
// dawn, rises behind the hill. The cross is closer now — still a quiet silhouette, the head bowed, the ring of
// light faint. He looks up, takes off his helmet, lays his hand on his heart, and the light falls on his face.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, rock, bush, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { headAt, centurion, romanHelmet, crossSil, skullHill, farCity, bubble, SKIES, INK, PI } from './lib.js';

const CX = 740, CT = 520, CH = 330;

export default {
  id: 'm15-centurion',
  beats: [
    { v: 39, text: 'Setnik zaś, który stał naprzeciw, widząc, że w ten sposób oddał ducha, rzekł:' },
    { v: 39, cont: true, text: '«Prawdziwie, ten człowiek był Synem Bożym».' },
  ],
  cam: { x: [-30, 60], y: [-40, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKIES.dark);
    const dawnL = S.layer({ par: 0.03, sh: 1, flat: true });
    dawnL.add(`<g transform="translate(${CX} 520)"><circle r="520" fill="url(#warm-glow)"/><circle r="260" fill="url(#halo-glow)"/></g>`);
    const far = S.layer({ par: 0.08, sh: 2 });
    far.add(band(c, { y: 520, amps: [14, 7, 3], lens: [900, 320, 120], color: mix(C.duskViolet, C.stone2, 0.4) }).markup);
    far.add(`<g transform="translate(1250 526)">${farCity(c, 0.7)}</g>`);
    const hillL = S.layer({ par: 0.18, sh: 3 });
    hillL.add(`<g transform="translate(${CX} ${CT})">${skullHill(c, { w: 1100, h: 300, col: mix(C.rock2, C.duskViolet, 0.3) })}</g>`);
    hillL.add(`<g transform="translate(${CX - (S.portrait ? 195 : 250)} ${CT + 36}) rotate(0)">${crossSil(c, { h: 270 })}</g><g transform="translate(${CX + 250} ${CT + 36})">${crossSil(c, { h: 270 })}</g>`);
    // phone: the left thief's cross stands 55 nearer, so it isn't sliced by the frame
    const cross = hillL.add(`<g transform="translate(${CX} ${CT})">${crossSil(c, { h: CH, halo: true })}</g>`);
    const hd = cross.querySelector('.hd'), hl = cross.querySelector('.hl');
    const u = CH / 240;
    pose(hd, { x: 0, y: -CH + 50 * u, r: 28 });
    const ground = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(650, [6, 3], [700, 200]);
    ground.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand2, C.rock2, 0.45)).out());
    ground.add(rock(c, 420, 660, 90, 30, C.rock2) + bush(c, 1300, 650, 90, mix(C.olive, C.rock3, 0.3)) + grass(c, { x0: -600, x1: 2300, y: 650, fn: gfn, n: 24, h: 12, color: mix(C.olive, C.rock3, 0.3) }));
    const P = S.layer({ par: 0.55, sh: 5 });
    const faceLight = P.add(`<g><circle r="120" fill="url(#warm-glow)"/></g>`);
    const cHelm = S.puppet(P.add(centurion(c, { holdF: `<path d="${c.ribbon([[0, -20], [0, 150]], 3.4)}" fill="${C.wood2}"/>` })));
    const cBare = S.puppet(P.add(centurion(c, { helmet: false, holdF: `<g transform="translate(4 6) rotate(90) scale(.9)">${romanHelmet(c, { transverse: true })}</g>` })));
    const fx = S.layer({ par: 0.58, sh: 5 });
    const say = fx.add(`<g>${bubble(c, tr(['Prawdziwie, ten człowiek', 'był Synem Bożym'], ['Truly this man', 'was the Son of God!']), { size: 23, dir: 1, fill: C.cream })}</g>`);
    const fg = S.layer({ par: 0.95, sh: 7 });
    fg.add(rock(c, 150, 980, 320, 110, C.rock3) + bush(c, 1600, 960, 240, mix(C.moss, C.rock3, 0.3)));

    return (t, time) => {
      const T = time;
      const light = es(t, -0.4, 1.8);
      sk.blend(SKIES.dark, SKIES.after, light);
      dawnL.fade(0.2 + light * 0.8);
      fade(hl, 0.35 + es(t, 1.05, 1.6) * 0.45);
      const bare = es(t, 1.05, 1.13);
      const heart = es(t, 1.1, 1.4);
      const x = S.portrait ? 985 : 1070, y = 704, s = 1.12;   // phone: off the thread
      cHelm.set({ x, y, s, flip: true, o: 1 - bare, armF: 24, armB: 10, head: -14 + Math.sin(T * 0.6) * 1.5, blink: blinkAt(T) });
      cBare.set({ x, y, s, flip: true, o: bare, armF: 16 + heart * 20, armB: 10 + heart * 62, head: -18, lean: -heart * 3, blink: blinkAt(T) });
      const [hx, hy] = headAt(x, y, s, true);
      pose(faceLight, { x: hx - 20, y: hy, s: 0.6 + heart * 0.7, o: 0.2 + heart * 0.7 });
      const k = es(t, 1.15, 1.45, ease.back);
      pose(say, { x: hx - 34, y: hy - 30, s: k, o: k > 0.02 ? 1 : 0 });
      S.cam.x = 30 + es(t, 0.2, 1.2) * 20;
      S.cam.z = 1.02 + es(t, 0.8, 1.6) * 0.05;
      S.cam.y = -10 + es(t, 0.8, 1.6) * 20;
    };
  },
};
