// Mt 18,10–11 — a street in Capernaum with children playing. A little beggar sits by the wall with his bowl; a
// grand man sweeps past and waves him off with a frown — Jesus lifts His hand: take care that you do not despise one
// of these little ones. For their angels in heaven: a floor of cloud comes down over the street with an angel above
// each child, a golden thread running up from each little head, and every angel turned to the light at the top of
// the sky — the Father's face, shown only as light. [For the Son of Man came to save the lost:] Jesus goes to the
// crying beggar, kneels, holds out His hand, and the child gets up and takes it, in a warm light from above.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { cloud } from '../../assets/nature.js';
import { townSet, kid, kidHead, angel, fatherLight, withFace, faceBits, bowl, noble, speech, GLYPH, kf, hand, PI } from './lib.js';

const P = 0.45, GY = 690;
const KIDS = [[520, 0, false], [640, 2, false], [900, 4, true], [1010, 5, true]];   // x, look, flip
const BEG = [1090, 694];
const FLOOR_Y = 330;                  // heaven's cloud floor (at rest)
const FL = [800, 150];                // the Father's light

export default {
  id: 'mt18-angels',
  beats: [
    { v: 10, text: 'Strzeżcie się, żebyście nie gardzili żadnym z tych małych;' },
    { v: 10, cont: true, text: 'albowiem powiadam wam: Aniołowie ich w niebie wpatrują się zawsze w oblicze Ojca mojego, który jest w niebie.' },
    { v: 11 },
  ],
  cam: { x: [-20, 90], y: [-60, 30], z: [1, 1.06] },
  build(S) {
    const V = townSet(S, { gy: GY - 30, par: P });
    const c = S.c;

    /* heaven: the light, and the cloud floor with the angels (one piece, lowered from the flies) */
    const hv = S.layer({ par: P, sh: 3, rise: 0 });
    const light = hv.add(`<g opacity="0">${fatherLight(c, 46)}</g>`);
    const ALL = [...KIDS.map(([x]) => x), BEG[0]];
    let angels = '';
    ALL.forEach((x, i) => {
      const y = FLOOR_Y - (i % 2) * 18;
      angels += `<g transform="translate(${x} ${y - 4}) scale(${x < 800 ? 0.52 : -0.52} .52)">${angel(c, { robe: C.linen, mantle: [C.halo, C.skyVeil, C.blushVeil, C.halo, C.skyVeil][i], hair: [C.wheat2, C.hair2, C.ochre, C.hair, C.wheat2][i] })}</g><g transform="translate(${x} ${y + 12})">${cloud(c, 130)}</g>`;
    });
    const heaven = hv.add(`<g>${angels}</g>`);
    // the angels' faces turned up to the light: tilt each head in the markup (static)
    heaven.querySelectorAll('.headr').forEach((h) => h.setAttribute('transform', 'rotate(-14)'));
    let th = '';
    ALL.forEach((x, i) => {
      const [hx, hy] = i < KIDS.length ? kidHead(x, GY, 0.5, KIDS[i][2]) : kidHead(BEG[0], BEG[1], 0.5, true, 62);
      th += c.ribbon([[hx, hy - 36], [x, FLOOR_Y - (i % 2) * 18 + 22]], 1.6);
    });
    const threads = hv.add(`<g opacity="0"><path d="${th}" fill="${C.haloRim}" opacity=".8"/></g>`);

    /* the street */
    const L = S.layer({ par: P, sh: 5 });
    const kids = KIDS.map(([x, look, flip], i) => ({ x, i, flip, seed: c.rr(0, 9), p: S.puppet(L.add(kid(c, look))) }));
    const begSit = S.puppet(L.add(withFace(kid(c, 7, { pose: 'sit', holdF: `<g transform="rotate(50) translate(0 4) scale(.8)">${bowl(c)}</g>` }), faceBits(c))));
    const begUp = S.puppet(L.add(kid(c, 7)));
    const tear = begSit.el.querySelector('[data-part="tear"]'), sad = begSit.el.querySelector('[data-part="sad"]');
    const rich = S.puppet(L.add(withFace(person(c, noble(c, 2)), faceBits(c))));
    const angry = rich.el.querySelector('[data-part="angry"]');
    const shoo = L.add(`<g opacity="0">${speech(c, GLYPH.frown(c), { w: 46, h: 40, flip: true })}</g>`);
    const peter = S.puppet(L.add(person(c, CAST.peter)));
    const john = S.puppet(L.add(person(c, CAST.john)));
    const jesus = S.puppet(L.add(person(c, CAST.jesus)));
    const jKneel = S.puppet(L.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const warm = L.add(`<g opacity="0"><path d="${c.poly([[-40, -560], [40, -560], [150, 0], [-150, 0]])}" fill="#fff3cc" opacity=".45"/><ellipse cx="0" cy="-60" rx="140" ry="110" fill="url(#halo-glow)"/></g>`);

    return (t, time) => {
      const T = time;
      V.update(T);

      /* the children at play (still cut-outs; they look up when heaven opens) */
      const look = es(t, 1.35, 1.6) * (1 - es(t, 2.1, 2.4));
      kids.forEach((k) => k.p.set({ x: k.x, y: GY + (k.i % 2) * 6, s: 0.5, flip: k.flip, armF: 40 + (k.i % 2 ? 30 : 0) + look * 40, armB: k.i % 2 ? 60 : 20, head: -look * 18 + (k.i === 1 ? 4 : 0), blink: blinkAt(T, k.seed) }));

      /* v10a — the grand man waves the beggar away; Jesus: take care! */
      const rw = kf(t, [[0, 1360], [0.35, 1200], [0.7, 1185], [1.0, 1170], [1.6, 1380]], (u) => u);
      const wave = bump(t, 0.3, 0.85);
      const stop = es(t, 0.55, 0.75);
      rich.set({ x: rw, y: GY + 16, s: 0.94, flip: t < 1.0, walk: (t < 0.35 || t > 1.0) && t < 1.6 ? rw * 0.06 : undefined, armF: 20 + wave * 70, armB: 10, head: 6 - stop * 10, lean: -stop * 6, o: 1 - es(t, 1.45, 1.6), blink: blinkAt(T, 5) });
      fade(angry, wave);
      pose(shoo, { x: rw - 30, y: GY - 196, s: es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.8, 0.9)), o: wave > 0.05 ? 1 : 0 });
      const up = es(t, 2.55, 2.62);
      const cry = es(t, 0.45, 0.7) * (1 - es(t, 2.4, 2.6));
      begSit.set({ x: BEG[0], y: BEG[1], s: 0.5, flip: true, o: 1 - up, armF: 50 - cry * 20, head: 10 * cry - es(t, 2.3, 2.5) * 16, blink: blinkAt(T, 8) });
      fade(tear, cry); fade(sad, cry);

      /* v10b — heaven comes down: angels, threads, the Father's light */
      const hk = es(t, 1.05, 1.45, ease.out);
      pose(heaven, { x: 0, y: lerp(-620, 0, hk) });
      pose(light, { x: FL[0], y: lerp(-400, FL[1], hk), r: T * 3, o: hk });
      fade(threads, es(t, 1.45, 1.7));

      /* v11 — Jesus goes to the lost little one and raises him */
      const go = es(t, 2.05, 2.35);
      const kn = es(t, 2.35, 2.42);
      const lift = es(t, 2.5, 2.8);
      const jx = lerp(790, 1040, go);
      jesus.set({ x: jx, y: GY - 6, s: 1.0, flip: false, o: 1 - kn, walk: go > 0 && go < 1 ? jx * 0.05 : undefined, armF: 20 + bump(t, 0.4, 0.95) * 70 + es(t, 1.2, 1.4) * 30 * (1 - go), armB: 10 + bump(t, 0.45, 0.95) * 100 + es(t, 1.2, 1.4) * 120 * (1 - go), head: -es(t, 1.2, 1.4) * 14 * (1 - go), blink: blinkAt(T, 1) });
      jKneel.set({ x: 1040, y: GY - 2, s: 1.0, flip: false, o: kn, armF: 50 + lift * 20, armB: 20, head: 8 - lift * 6, blink: blinkAt(T, 1) });
      const [hx, hy] = hand(1040, GY - 2, 1.0, false, 50 + lift * 20, 0, 46);
      begUp.set({ x: lerp(BEG[0], hx + 34, lift), y: BEG[1], s: 0.5, flip: true, o: up, armF: 60 + lift * 20, head: -10, blink: blinkAt(T, 8) });
      pose(warm, { x: 1070, y: GY, s: 0.7 + lift * 0.3, o: es(t, 2.4, 2.7) * 0.9 });

      /* Peter and John listen on the left */
      peter.set({ x: 410, y: GY + 4, s: 0.9, armF: 20, head: -es(t, 1.3, 1.6) * 14 + 4, blink: blinkAt(T, 2) });
      john.set({ x: 350, y: GY - 6, s: 0.86, armF: 10 + es(t, 1.3, 1.6) * 30, head: -es(t, 1.3, 1.6) * 16, blink: blinkAt(T, 3) });

      S.cam.x = kf(t, [[0, 40], [0.9, 60], [1.1, 20], [2.0, 20], [2.4, 70]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.4, -50], [2.0, -50], [2.4, 10]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.04], [1.4, 1.0], [2.0, 1.0], [2.4, 1.05]]);
    };
  },
};
