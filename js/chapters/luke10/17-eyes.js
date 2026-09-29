// Łk 10,23–24 — later that night the disciples sit close round a small fire with Jesus; the others have gone to
// sleep. "Blessed are the eyes that see what you see": He turns to them, and in the firelight a glint of light comes
// into each one's eyes as they look at Him. "For many prophets and kings desired to see what you see, and did not see
// it": high in the dark, portraits come down on strings — Moses, Isaiah and Jeremiah, David and Solomon — in old sepia
// frames; they lean toward the fire, but a thin veil hangs between them and it, and their eyes stay in shadow. "And to
// hear what you hear, and did not hear it": His words go out in warm rings to the ears of those by the fire, and die
// away against the veil before they reach the portraits.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { countrySet, KN, glow, barefoot, cameo, voiceRings, sparkle, kf, headAt, tr, STRING, EVENING, NIGHT, SENT_A, SENT_B, ISAIAH, DAVID, SOLOMON, es, ease, bump, seg, PI } from './lib.js';
import { fireStones, fireFlames } from '../luke2/lib.js';
import { JEREMIAH } from '../luke6/lib.js';
import { MOSES } from '../john1/lib.js';

const JX = 700, JY = 706, FY = 716, FX = 836;
const SEATS = [
  { o: SENT_A, x: 470, flip: false, bare: true }, { o: CAST.peter, x: 575, flip: false }, { o: CAST.john, x: 990, flip: true }, { o: SENT_B, x: 1095, flip: true, bare: true },
];
const PORTRAITS = [
  { o: MOSES, name: ['Mojżesz', 'Moses'] }, { o: ISAIAH, name: ['Izajasz', 'Isaiah'] }, { o: DAVID, name: ['Dawid', 'David'] },
  { o: JEREMIAH, name: ['Jeremiasz', 'Jeremiah'] }, { o: SOLOMON, name: ['Salomon', 'Solomon'] },
];

export default {
  id: 'lk10-eyes',
  beats: [
    { v: 23 },
    { v: 24, text: 'Bo powiadam wam: Wielu proroków i królów pragnęło ujrzeć to, co wy widzicie, a nie ujrzeli,' },
    { v: 24, cont: true, text: 'i usłyszeć, co słyszycie, a nie usłyszeli».' },
  ],
  cam: { x: [-20, 20], y: [-160, 40], z: [1, 1.14] },
  build(S) {
    const K = countrySet(S, { skyCols: EVENING, sky2: NIGHT, sunAt: [1260, 900] });
    const c = S.c;
    K.sk2.layer.fade(1); K.starL.fade(1); K.dim.fade(1);
    K.lampsOn([0.6, 0.6, 0.6, 0.6, 0.6, 0.6]);

    /* the portraits of the prophets and kings, and the veil before them */
    const PL = S.layer({ par: 0.12, sh: 5, rise: 0 });
    const ports = PORTRAITS.map((p, i) => ({ i, x: 480 + i * 160, y: 250 + (i % 2) * 40, el: PL.add(`<g><path d="M0 -2000V-50" stroke="${STRING}" stroke-width="1.4"/>${cameo(makeCutter('lk10-cam' + i), S.id('cam' + i), p.o, tr(p.name[0], p.name[1]))}</g>`) }));
    const veilL = S.layer({ par: 0.14, sh: 2, rise: 0 });
    const veil = veilL.add(`<g><path d="${c.cut([[-460, 0], [460, -6], [450, 70], [300, 84], [150, 70], [0, 86], [-150, 72], [-300, 86], [-450, 72]], 1.2, 10)}" fill="${mix(C.lavender, C.stone2, 0.4)}" opacity=".55"/><path d="${[-380, -260, -140, -20, 100, 220, 340].map((x) => c.ribbon([[x, 4], [x + 6, 76]], 2)).join('')}" fill="${C.stone}" opacity=".45"/><path d="M-430 -2000V0M430 -2000V0" stroke="${STRING}" stroke-width="1.2"/></g>`);

    /* the fire, Jesus and the four */
    const P = S.layer({ par: 0.45, sh: 5 });
    const fireGlow = P.add(`<g>${glow(300, 0.8, 'warm-glow')}</g>`);
    const heads = SEATS.map(() => P.add(`<g>${glow(46, 0.9, 'warm-glow')}</g>`));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const dis = SEATS.map((d, i) => ({ ...d, i, p: S.puppet(P.add(d.bare ? barefoot(person(c, { ...d.o, pose: 'sit' }), d.o.skin) : person(c, { ...d.o, pose: 'sit' }))), seed: c.rr(0, 9) }));
    const FL = S.layer({ par: 0.5, sh: 4 });
    FL.add(`<g transform="translate(${FX} ${FY + 8})">${fireStones(c, 100)}</g>`);
    const fire = FL.add(`<g>${fireFlames(c, 54).replace(/^<circle[^>]*\/>/, '')}</g>`);
    const fx = S.layer({ par: 0.5, sh: 4 });
    const glints = SEATS.map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));
    const voice = voiceRings(fx, c, { n: 4, color: C.ochre, r: 40, w: 5 });

    return (t, time) => {
      const T = time;
      K.update(T, { sunO: 0 });
      pose(fire, { x: FX, y: FY + 2, sy: 1 + (T ? Math.sin(T * 7) * 0.06 : 0), s: 1 });
      pose(fireGlow, { x: FX, y: FY - 40, s: 1 + (T ? Math.sin(T * 5) * 0.03 : 0) });

      /* v23 — the light in their eyes */
      const turnTo = t < 0.5 ? -1 : 1;
      const speak = es(t, 0.05, 0.2);
      const hearK = es(t, 2.05, 2.2);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: turnTo < 0, armF: 30 + speak * 40, armB: 10 + speak * 20, head: -4, blink: blinkAt(T) });
      dis.forEach((d) => {
        const [hx, hy] = headAt(d.x, JY + 6, 0.94, d.flip, 'sit');
        const see = es(t, 0.15 + d.i * 0.08, 0.3 + d.i * 0.08);
        d.p.set({ x: d.x, y: JY + 6, s: 0.94, flip: d.flip, armF: 30 + see * 10 + hearK * 20, armB: 10, head: -6 - see * 4, blink: blinkAt(T, d.seed) });
        pose(heads[d.i], { x: hx, y: hy, o: 0.4 + see * 0.6 });
        const g = bump(t, 0.2 + d.i * 0.08, 0.95);
        pose(glints[d.i], { x: hx + (d.flip ? -8 : 8), y: hy - 4, s: 0.4 + g * 0.8, r: T * 60, o: see * (1 - es(t, 1.0, 1.1)) });
      });

      /* v24a — the portraits come down; they lean toward the fire; the veil hangs between */
      ports.forEach((p) => {
        const k = es(t, 1.0 + p.i * 0.06, 1.3 + p.i * 0.06, ease.out);
        const lean = es(t, 1.45, 1.8) * (p.x < 800 ? 8 : -8) * (Math.abs(p.x - 800) / 320);
        pose(p.el, { x: p.x, y: lerp(-500, p.y, k), r: lean + (T ? Math.sin(T * 0.8 + p.i) * 1.2 : 0), o: k > 0.005 ? 1 : 0 });
      });
      const vk = es(t, 1.2, 1.5, ease.out);
      pose(veil, { x: 800, y: lerp(-400, 380, vk), o: vk > 0.005 ? 1 : 0 });

      /* v24b — His words go out to them, and die against the veil */
      const [jhx, jhy] = headAt(JX, JY, 1.04, false, 'sit');
      voice(jhx, jhy - 10, speak * (1 - es(t, 0.9, 1.0)) + hearK, T, { dir: 1, spread: 3.1 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 30], [0.9, 30], [1.3, -100], [2.0, -100], [2.3, -60], [3, -60]]);
      S.cam.z = kf(t, [[0, 1.1], [0.9, 1.1], [1.3, 1.0], [2.0, 1.0], [2.3, 1.02], [3, 1.02]]);
    };
  },
};
