// Łk 15,18–19 — first light over the far country: the pig field's fence on the right, a long road running left over
// the dry hills and, far off on the last hill, the tiny white house of his father with the sun coming up behind it.
// "I will arise and go to my father, and I will say to him": he gets up from the trough, lets the swineherd's staff
// fall, turns his face to the far house and sets out along the road. "Father, I have sinned against heaven and
// before you": he stops and kneels in the road, practising the words, his hand on his heart — two round pictures
// come down over him: the open sky (light only) and his father's face. "I am no longer worthy to be called your
// son": a third picture — the father's arm round his son — and a red cross over it. "Treat me as one of your hired
// servants": a fourth — the hired men with their hoes in his father's field — and he gets up and walks on towards
// home, head bowed.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { band, sun, grass } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import {
  YOUNGER_RAGS, YOUNGER, FATHER, SERVANTS, staff, trough, herd, roundel, figure, crossX, fatherLight, deadTree, skyFade, hangOff, glow, rayBurst,
  along, headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, DAWN, MORNING, STRING,
  ragsMarkup,
} from './lib.js';

const GY = 700;
const ROAD2 = [[1090, 708], [980, 702], [860, 690], [740, 664], [640, 628], [566, 590], [516, 552], [488, 516]];
const PLATES_WIDE = [[556, 240], [716, 226], [876, 226], [1036, 240]];
const PLATES_PHONE = [[590, 244], [720, 222], [850, 222], [980, 244]];   // phone: the four pictures clear of the thread

export default {
  id: 'lk15-arise',
  parable: true,
  beats: [
    { v: 18, text: 'Zabiorę się i pójdę do mego ojca, i powiem mu:' },
    { v: 18, cont: true, text: 'Ojcze, zgrzeszyłem przeciw Bogu i względem ciebie;' },
    { v: 19, text: 'już nie jestem godzien nazywać się twoim synem:' },
    { v: 19, cont: true, text: 'uczyń mię choćby jednym z najemników.' },
  ],
  cam: { x: [-60, 80], y: [-20, 50], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const skA = S.layer({ par: 0, sky: true });
    const aid = S.id('dawn');
    S.defs(`<linearGradient id="${aid}" gradientUnits="userSpaceOnUse" x1="0" y1="${Math.min(0, S.view().y0).toFixed(0)}" x2="0" y2="760"><stop offset="0" stop-color="${DAWN[0]}"/><stop offset=".55" stop-color="${DAWN[1]}"/><stop offset="1" stop-color="${DAWN[2]}"/></linearGradient>`);
    skA.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="url(#${aid})"/><rect class="grain" x="-3000" y="-3000" width="8000" height="8000" opacity=".8"/>`);
    const skM = skyFade(S, MORNING, skA, 'morning');
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunG = hangL.add(`<g>${glow(260, 0.9)}${rayBurst(c, { n: 18, r0: 60, r1: 380, spread: 0.04, color: C.halo, o: 0.3 })}</g>`);
    const sn = hangOff(hangL, sun(c, 40));
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [20, 8, 3], lens: [1000, 340, 120], color: mix(C.hillFar, C.duskViolet, 0.25), x0: -1400, x1: 3000 }).markup);
    /* the far hill with the father's house on it */
    const farL = S.layer({ par: 0.16, sh: 3 });
    const fh = sheet().p(c.cut([[-1400, 1800], [-1400, 560], [200, 540], [380, 500], [470, 486], [560, 494], [700, 530], [900, 552], [3000, 566], [3000, 1800]], 1, 12), mix(C.hillMid, C.sand2, 0.3));
    fh.p(c.cut(c.rect(448, 454, 44, 34), 0.3, 4), C.plaster).p(c.cut(c.rect(454, 438, 20, 18), 0.3, 3), C.plaster).p(c.cut(c.rect(494, 464, 14, 26), 0.3, 3), C.stone2).p(c.cut(c.rect(466, 470, 9, 18), 0.2, 3), C.wood2);
    farL.add(fh.out());
    /* the near land with the road and the pig field's fence on the right */
    const land = S.layer({ par: 0.36, sh: 3 });
    const l = sheet();
    l.p(c.cut([[-1400, 1800], [-1400, 600], [300, 560], [470, 520], [560, 560], [700, 630], [900, 680], [3000, 690], [3000, 1800]], 1, 12), mix(C.sand2, C.hillNear, 0.3));
    l.p(c.ribbon(ROAD2.map(([x, y]) => [x, y + 4]), (u) => 40 - u * 30, 1.5), mix(C.sand, C.dune, 0.25));
    land.add(l.out());
    land.add(grass(c, { x0: -1200, x1: 2800, y: 690, n: 30, h: 11, color: C.olive }));
    let posts = '', rails = '';
    for (let x = 1130; x <= 1800; x += 86) posts += c.cut(c.rect(x - 5, GY - 96, 10, 96), 0.3, 4);
    rails += c.ribbon([[1120, GY - 80], [1810, GY - 84]], 7) + c.ribbon([[1120, GY - 46], [1810, GY - 48]], 7);
    land.add(sheet().p(posts, mix(C.wood, C.rock3, 0.3)).p(rails, mix(C.wood3, C.rock3, 0.3)).out());
    land.sprite(`<g>${herd(c, 6, 180, 20, { sc: 1.1 })}</g>`, 1330, GY - 10);
    land.add(`<g transform="translate(1170 ${GY + 4})">${trough(c, 120)}</g><g transform="translate(250 580)">${deadTree(c, 150, mix(C.wood2, C.rock3, 0.2))}</g>`);

    /* him */
    const act = S.layer({ par: 0.36, sh: 5 });
    const staffEl = act.add(`<g>${staff(c, 190, 0)}</g>`);
    const sitP = S.puppet(act.add(ragsMarkup(c, { pose: 'sit' })));
    const walker = S.puppet(act.add(ragsMarkup(c)));
    const kneel = S.puppet(act.add(ragsMarkup(c, { pose: 'kneel' })));

    /* the four pictures of what he will say */
    const plL = S.layer({ par: 0.22, sh: 6 });
    const oc = makeCutter('lk15-arise-plates');
    const bgSky = (col) => `<rect x="-90" y="-90" width="180" height="180" fill="${col}"/>`;
    const land2 = sheet().p(oc.cut([[-90, 30], [90, 24], [90, 90], [-90, 90]], 0.5, 8), mix(C.hillNear, C.sand2, 0.35)).out();
    const inners = [
      bgSky(mix(C.skyBlue, C.halo, 0.25)) + `<g transform="translate(0 -6) scale(.62)">${fatherLight(oc, 40)}</g>`,
      bgSky(mix(C.cream, C.peach, 0.3)) + figure(oc, FATHER, { x: -6, y: 176, s: 1.0, head: 4 }),
      bgSky(mix(C.cream, C.skyBlue, 0.3)) + land2 + figure(oc, FATHER, { x: -26, y: 70, s: 0.46, armF: 60, armB: 20 }) + figure(oc, YOUNGER, { x: 26, y: 72, s: 0.42, flip: true, armF: 40, head: 6 }),
      bgSky(mix(C.skyBlue, C.cream, 0.4)) + sheet().p(oc.cut([[-90, 20], [90, 14], [90, 90], [-90, 90]], 0.5, 8), mix(C.wheat, C.sand2, 0.35)).out()
        + [[-50, SERVANTS[0]], [0, YOUNGER_RAGS], [50, SERVANTS[3]]].map(([x, o], i) => figure(oc, { ...o, holdF: `<g transform="rotate(150)">${sheet().p(oc.ribbon([[0, -20], [0, 90]], 3.4), C.wood3).p(oc.cut([[-3, 86], [14, 86], [15, 96], [-3, 96]], 0.3, 3), C.rock3).out()}</g>` }, { x, y: 76, s: 0.4, armF: 60, lean: 10, head: 8 })).join(''),
    ];
    const plates = inners.map((inner, i) => plL.add(`<g transform="translate(0 -1500)"><path d="M0 -1900V-70" stroke="${STRING}" stroke-width="1.2" fill="none"/>${roundel(oc, inner, { r: 64, id: S.id('pl' + i) })}${i === 2 ? `<g class="x" opacity="0">${crossX(oc, 44)}</g>` : ''}</g>`));
    const cross = plates[2].querySelector('.x');

    const PLATES = S.portrait ? PLATES_PHONE : PLATES_WIDE;
    const SUNX = S.portrait ? 572 : 520;   // phone: the rising sun whole, not halved by the frame
    return (t, time) => {
      const T = time;
      skM.fade(es(t, 0.2, 1.6));
      const sunY = lerp(470, 400, es(t, 0.0, 2.0));
      pose(sn, { x: SUNX, y: sunY, r: T ? Math.sin(T * 0.5) : 0 });
      pose(sunG, { x: SUNX, y: sunY, r: T * 2, o: 0.9 });

      /* v18a — he gets up, drops the staff, turns to the far house and sets out */
      const up = seg(t, 0.2, 0.24);
      sitP.set({ x: 1070, y: GY, s: 1.0, o: 1 - up, armF: 30, armB: 20, head: -10, blink: blinkAt(T, 1) });
      const drop = es(t, 0.3, 0.45);
      pose(staffEl, { x: 1100 + drop * 20, y: GY - 60 + drop * 50, r: 20 + drop * 70, o: 1 });
      const u = kf(t, [[0.4, 0], [0.98, 0.22], [1.02, 0.22], [3.2, 0.22], [3.96, 0.5]], (x) => x);
      const [wx, wy] = along(ROAD2, u);
      const ws = lerp(1.0, 0.86, u / 0.5);
      const kneelO = seg(t, 1.04, 1.08) * (1 - seg(t, 3.16, 3.2));
      walker.set({ x: t < 0.4 ? 1070 : wx, y: t < 0.4 ? GY : wy, s: ws, flip: t > 0.3, o: up * (1 - kneelO), walk: (t > 0.4 && t < 0.98) || (t > 3.2 && t < 3.96) ? u * 120 : undefined, armF: 10 + es(t, 0.26, 0.36) * 30 * (1 - es(t, 0.4, 0.5)), armB: 10, head: t > 3.2 ? 12 : -6, blink: blinkAt(T, 1) });

      /* v18b — kneeling in the road, practising: heaven, and his father */
      const heart = es(t, 1.1, 1.3);
      const low = es(t, 2.05, 2.3);
      kneel.set({ x: wx, y: wy, s: ws, flip: true, o: kneelO, armF: 60 + heart * 50 - low * 40, armB: 20 + heart * 40, head: 6 + low * 18, lean: -low * 10, blink: blinkAt(T, 1) });
      const drops = [[1.12, 1.4], [1.22, 1.5], [2.06, 2.34], [3.06, 3.34]];
      plates.forEach((p, i) => {
        const k = es(t, drops[i][0], drops[i][1], ease.out);
        const [x, y] = PLATES[i];
        pose(p, { x, y: lerp(-1500, y, k), r: T ? Math.sin(T * 0.8 + i * 1.7) * 1.2 * k : 0, o: k > 0.002 ? 1 : 0 });
      });
      fade(cross, es(t, 2.36, 2.5));

      S.cam.x = kf(t, [[0, 40], [0.9, 20], [1.4, 0], [3.9, -20]]);
      S.cam.y = kf(t, [[0, 30], [1.4, 0], [3.9, 10]]);
      S.cam.z = kf(t, [[0, 1.06], [1.4, 1.02], [3.9, 1.02]]);
    };
  },
};
