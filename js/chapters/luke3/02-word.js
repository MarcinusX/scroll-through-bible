// Łk 3,2b — after the gallery of the powerful, an empty wilderness before dawn. One man kneels on a rock:
// John, the son of Zechariah. A single beam of light comes down on him alone, and in it a slip of golden paper
// — the word of God — sinks into his open hands. He lifts his head; the sky begins to pale.
import { C, person, blinkAt, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, stars, moon } from '../../assets/nature.js';
import {
  JOHN_B, headAt, hand, acacia, scrub, standRock, badlands, hungWord, lightDisc, beam, sparkle, PREDAWN, FIRSTLIGHT,
  tr, es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const RX = 800, RY = 688, JS = 1.3;

/** the word: a small slip of gold paper with a few lines of script (origin centre) */
function goldSlip(c, w = 64, h = 34) {
  const s = sheet().p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 2], [w / 2 + 2, h / 2], [-w / 2 - 1, h / 2 + 1]], 0.4, 5), C.halo);
  let ln = '';
  for (let i = 0; i < 3; i++) { let x = -w / 2 + 8; while (x < w / 2 - 10) { const l = c.rr(5, 12); ln += c.ribbon([[x, -h / 2 + 9 + i * 8], [Math.min(x + l, w / 2 - 8), -h / 2 + 9 + i * 8]], 1.6); x += l + 3; } }
  s.x(ln, C.sunRay, 'opacity=".7"');
  s.x(c.ribbon([[-w / 2 + 3, -h / 2 + 3], [w / 2 - 3, -h / 2 + 2]], 1.2), C.haloRim);
  return s.out();
}

export default {
  id: 'lk3-word',
  beats: [
    { v: 2, cont: true, text: 'skierowane zostało słowo Boże do Jana, syna Zachariasza, na pustyni.' },
  ],
  cam: { x: [-10, 10], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, PREDAWN);
    const dawn = sky(S, FIRSTLIGHT, { name: 'dawn' }).layer;
    dawn.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -1000, x1: 2600, y0: -900, y1: 420, n: 120 }));
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const moonEl = hanging(hangL, moon(c, 30), { x: 1190, y: 170, len: 700 });

    /* the wilderness: far mountains, badlands, the stony floor */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [18, 8, 3], lens: [1000, 340, 120], color: mix(C.duskViolet, C.indigo, 0.35) }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    mid.add(badlands(c, [[-900, 430], [-500, 400], [-150, 380], [150, 390], [330, 450], [470, 540]], mix(C.clay, C.duskViolet, 0.45)));
    mid.add(badlands(c, [[1120, 540], [1250, 460], [1400, 410], [1650, 390], [2500, 420]], mix(C.clay, C.duskViolet, 0.5)));
    const ground = S.layer({ par: 0.3, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(560, [5, 2], [600, 160]), -900, 2500, 1700, 14, 1), mix(C.sand2, C.duskViolet, 0.35)).out());
    ground.add(acacia(c, 330, 600, 1.0, { trunk: mix(C.wood2, C.indigo, 0.2), leaf: mix(C.olive, C.indigo, 0.25) }) + scrub(c, 1180, 600, 34, mix(C.olive, C.indigo, 0.25)));

    /* the single light, behind him */
    const lightL = S.layer({ par: 0.4, sh: 1, flat: true });
    const beamEl = lightL.add(`<g>${beam(c, 900, 50, 230)}</g>`);
    const glow = lightL.add(`<g>${lightDisc(c, 190)}</g>`);

    /* John on his rock */
    const act = S.layer({ par: 0.45, sh: 5 });
    act.add(`<g transform="translate(${RX} ${RY})">${standRock(c, 280, 130, mix(C.rock2, C.duskViolet, 0.25))}</g>`);
    const john = S.puppet(act.add(person(c, { ...JOHN_B, pose: 'kneel' })));
    const word = act.add(`<g>${goldSlip(c)}</g>`);
    const wordGlow = lightL.add(`<g>${lightDisc(c, 60)}</g>`);
    const sparks = [0, 1, 2, 3].map((i) => act.add(`<g>${sparkle(c, 10 + (i % 2) * 5, C.star)}</g>`));

    /* the name, from the flies */
    const fly = S.layer({ par: 0.2, sh: 5 });
    const name = fly.add(hungWord(c, tr('Jan, syn Zachariasza', 'John, the son of Zacharias'), { size: 22 }));

    const fg = S.layer({ par: 0.85, sh: 7 });
    fg.add(sheet().p(c.cut(c.blob(170, 980, 180, 90, 12, 0.15), 1.2, 10), mix(C.rock2, C.indigo, 0.3)).p(c.cut(c.blob(1450, 990, 200, 110, 12, 0.15), 1.2, 10), mix(C.rock3, C.indigo, 0.25)).out());

    return (t, time) => {
      swing(moonEl, 1190, 170, time, 0.8, 0.5);
      const lit = es(t, 0.18, 0.5);
      dawn.fade(es(t, 0.3, 0.9) * 0.75);
      starL.fade(1 - es(t, 0.35, 0.9) * 0.8);

      /* the beam comes down on him alone */
      pose(beamEl, { x: RX, y: RY - 20, sy: Math.max(0.001, es(t, 0.12, 0.42, ease.out)), o: lit });
      const hx = RX + 2 * JS, hy = RY + (-167 + 46) * JS;
      pose(glow, { x: hx, y: hy + 40, s: 0.6 + lit * 0.6, o: lit * 0.9 });

      /* the word sinks down the beam into his hands */
      const up = es(t, 0.5, 0.66);
      const [ax, ay] = hand(RX, RY, JS, false, 62 + up * 30, 0, 46);
      const wk = seg(t, 0.3, 0.6);
      const wx = lerp(RX + 10, ax + 6, ease.out(wk)), wy = lerp(80, ay - 10, ease.io(wk));
      pose(word, { x: wx, y: wy, r: Math.sin(wk * PI * 3) * 14 * (1 - wk), o: seg(t, 0.28, 0.33) });
      pose(wordGlow, { x: wx, y: wy, s: 1 + es(t, 0.58, 0.7) * 0.5, o: seg(t, 0.28, 0.35) });
      sparks.forEach((sp, i) => {
        const k = bump(t, 0.56 + i * 0.03, 0.9 + i * 0.02);
        const a = i * 1.6 + 0.4;
        pose(sp, { x: ax + Math.cos(a) * (30 + k * 30), y: ay - 20 + Math.sin(a) * (20 + k * 20), s: k, r: t * 120, o: k });
      });

      john.set({
        x: RX, y: RY, s: JS,
        head: 16 - es(t, 0.42, 0.6) * 30, armF: 62 + up * 30, armB: 50 + up * 50, lean: 6 - es(t, 0.42, 0.6) * 8,
        blink: blinkAt(time, 2),
      });

      const nk = es(t, 0.08, 0.34, ease.out);
      swing(name, S.portrait ? 935 : 1040, lerp(-400, 300, nk), time, 1, 0.8);
      fade(name, nk > 0.01 ? 1 : 0);

      S.cam.z = 1.02 + es(t, 0.1, 0.7) * 0.08;
      S.cam.y = 20 + es(t, 0.1, 0.7) * 30;
    };
  },
};
