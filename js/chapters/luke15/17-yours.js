// Łk 15,31–32 — the same night at the gateway, the feast in the courtyard behind. "But he said to him: 'My child,
// you are always with me…'": the father comes close and lays his hand on his elder son's shoulder, a warm light
// round the two of them, and a round picture comes down: the two of them working the field side by side, year after
// year. "'…and all that is mine is yours'": the father sweeps his arm over the land — the fields on the hill, the
// flock, the house — and all of it takes on a golden glow. "'But it was fitting to make merry and be glad…'": the
// music swells and the younger brother, in the best robe, comes to the lit gateway. "'…for this your brother was
// dead and is alive; he was lost and is found'": the father stands between his two sons, one hand on the elder's
// shoulder and the other held out to the younger, the gateway open and full of light behind; the elder's frown
// softens — and the story leaves the door open.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import {
  farmSet, partyBack, FM, FATHER, ELDER_W, YOUNGER_ROBED, withFace, faceBits, hungPlate, figure, heart, glow, sparkle, flyAt,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, NIGHT, STRING,
} from './lib.js';

const GY = FM.GY;
const EX = 1036, FX = 900, YX = 806;

export default {
  id: 'lk15-yours',
  parable: true,
  beats: [
    { v: 31, text: 'Lecz on mu odpowiedział: "Moje dziecko, ty zawsze jesteś przy mnie' },
    { v: 31, cont: true, text: 'i wszystko moje do ciebie należy.' },
    { v: 32, text: 'A trzeba się weselić i cieszyć z tego,' },
    { v: 32, cont: true, text: 'że ten brat twój był umarły, a znów ożył, zaginął, a odnalazł się"».' },
  ],
  cam: { x: [60, 260], y: [-40, 50], z: [1, 1.14] },
  build(S) {
    const F = farmSet(S, { skyCols: NIGHT, moonAt: [1240, 150], starsN: 120, tint: 0.26, tintCol: mix(C.night, C.indigo, 0.5), lit: 1, lanterns: true });
    const c = F.c;
    const P = partyBack(S, F, { withSon: false });
    const L = F.people;

    /* the golden glow over all that is his (fields, flock, house), on the land's own layer */
    const gold = S.layer({ par: FM.P, sh: 0, flat: true });
    F.land.el.parentNode.insertBefore(gold.el, F.house.el);
    const shine = gold.add(`<g opacity="0">${[[1260, 530, 220], [1460, 500, 220], [1330, 600, 160]].map(([x, y, r]) => `<g transform="translate(${x} ${y})">${glow(r, 0.6)}</g>`).join('')}</g>`);

    const elder = S.puppet(L.add(withFace(person(c, ELDER_W), faceBits(c))));
    const eAngry = elder.el.querySelector('[data-part="angry"]');
    const father = S.puppet(L.add(withFace(person(c, FATHER), faceBits(c))));
    const younger = S.puppet(L.add(person(c, YOUNGER_ROBED)));
    const twinkles = Array.from({ length: 6 }, (_, i) => ({ i, el: F.fx.add(`<g opacity="0">${sparkle(c, 10)}</g>`) }));
    const hearts = [0, 1].map((i) => F.fx.add(`<g opacity="0">${heart(c, 10 + i * 2)}</g>`));

    /* father and elder son, side by side in the field */
    const plL = S.layer({ par: 0.24, sh: 6 });
    const oc = makeCutter('lk15-yours');
    const together = hungPlate(S, plL, oc, `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.skyBlue, C.cream, 0.4)}"/>`
      + sheet().p(oc.cut([[-90, 26], [90, 20], [90, 90], [-90, 90]], 0.5, 8), mix(C.wheat, C.sand2, 0.35)).out()
      + figure(oc, FATHER, { x: -24, y: 66, s: 0.44, armF: 80, armB: 20, head: 4 })
      + figure(oc, { ...ELDER_W }, { x: 26, y: 68, s: 0.44, flip: true, armF: 40, head: 6 })
      + `<g transform="translate(0 -30)">${heart(oc, 10)}</g>`, { name: 'together' });

    return (t, time) => {
      const T = time;
      F.update(T, { sway: false });
      P.update(t, T, 1, 0.5 + es(t, 2.0, 2.3) * 0.5);

      /* v31a — "my child, you are always with me": the hand on his shoulder */
      const close = es(t, 0.05, 0.35);
      const fx = lerp(FX, EX - 104, close);
      const sweep = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.05));
      const reach = es(t, 3.05, 3.3);
      father.set({ x: fx, y: GY, s: 1.02, armF: 30 + close * 70 * (1 - sweep) + sweep * 120, armB: 20 - reach * 70, head: 6 - sweep * 10, flip: false, blink: blinkAt(T) });
      fade(father.el.querySelector('[data-part="sad"]'), 0);
      const soften = es(t, 0.4, 1.0) * 0.5 + es(t, 3.4, 3.7) * 0.5;
      elder.set({ x: EX, y: GY, s: 1.04, flip: true, armF: 20, armB: 10 + es(t, 3.5, 3.8) * 20, head: 10 - soften * 8, blink: blinkAt(T, 2) });
      fade(eAngry, 1 - soften);
      flyAt(together, es(t, 0.2, 0.5, ease.out) * (1 - es(t, 1.9, 2.05, ease.in)), 980, 250, T, 0);

      /* v31b — "all that is mine is yours": everything takes on a golden glow */
      fade(shine, es(t, 1.2, 1.5) * (1 - es(t, 2.6, 3.0) * 0.6));
      twinkles.forEach((w) => {
        const x = [1180, 1300, 1420, 1080, 460, 560][w.i], y = [540, 500, 470, 620, 470, 430][w.i];
        const k = es(t, 1.25 + w.i * 0.05, 1.45 + w.i * 0.05) * (1 - es(t, 2.6, 2.9));
        pose(w.el, { x, y, s: k, r: T * 20 + w.i * 10, o: k });
      });

      /* v32a — the music swells; the younger comes to the lit gateway */
      const YK = [[2.1, 700], [2.5, YX]];
      const yx = kf(t, YK);
      younger.set({ x: yx, y: GY, s: 0.98, o: 1, walk: moving(t, YK) ? yx * 0.07 : undefined, armF: t < 2.1 ? 140 : 20 + reach * 50, armB: t < 2.1 ? 150 : 10, head: 4, bob: t < 2.1 ? -Math.abs(Math.sin((T || t) * 5)) * 6 : 0, blink: blinkAt(T, 1) });

      /* v32b — "this your brother": the father between his two sons */
      hearts.forEach((h, i) => {
        const k = seg(t, 3.35 + i * 0.12, 3.99);
        pose(h, { x: (i ? EX : YX) + 10, y: 470 - k * 60, s: Math.sin(Math.min(1, k * 1.5) * PI * 0.5), o: k > 0 && k < 1 ? 1 - Math.max(0, k - 0.75) / 0.25 : 0 });
      });

      S.cam.x = kf(t, [[0, 220], [1.0, 220], [1.4, 240], [2.0, 200], [3.0, 140], [3.6, 140]]);
      S.cam.y = kf(t, [[0, 20], [1.2, 0], [2.0, 20], [3.6, 40]]);
      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.12], [1.4, 1.0], [2.0, 1.04], [3.0, 1.08], [3.7, 1.12]]);
    };
  },
};
