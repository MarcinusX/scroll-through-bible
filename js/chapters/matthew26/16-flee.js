// Mt 26,55–56 — held between two dark figures, He turns to the crowd: "Have you come out as against a robber, with
// swords and clubs?" (a plate: a robber's shadow, struck through) — the clubs and blades go up. "Every day I sat in the
// Temple teaching, and you did not seize me" (a plate: the Temple courts, the listeners, Him among them). "But all this
// has happened that the writings of the prophets might be fulfilled" (an open scroll in a soft light). Then all the
// disciples left Him and fled — running off into the dark, and He stands alone in the torchlight, bound.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  nightSet, gardenTrees, eleven, makeBand, bandPose, hanging, vis, kf, hand, headAt, withFace, faceBits, person, pose, fade, lerp, mix, tr, blinkAt, C,
  TW, PI, sheet, shadowPerson, guardOpts, cord, discPlate, scrollOpen, templeMini, BAND_INK, MOB, ELEVEN,
} from './lib.js';

const GY = 700, JX = 800;

export default {
  id: 'mt26-flee',
  beats: [
    { v: 55, text: 'W owej chwili Jezus rzekł do tłumów: «Wyszliście z mieczami i kijami jak na zbójcę, żeby Mnie pojmać.' },
    { v: 55, cont: true, text: 'Codziennie zasiadałem w świątyni i nauczałem, a nie pochwyciliście Mnie.' },
    { v: 56, text: 'Lecz stało się to wszystko, żeby się wypełniły Pisma proroków».' },
    { v: 56, cont: true, text: 'Wtedy wszyscy uczniowie opuścili Go i uciekli.' },
  ],
  cam: { x: [-80, 80], y: [-40, 160], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { moonAt: [1250, 130] });
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    glowL.add(`<g transform="translate(520 ${GY})"><ellipse cx="0" cy="-110" rx="460" ry="280" fill="url(#warm-glow)" opacity=".55"/></g>`);
    const bandL = S.layer({ par: 0.5, sh: 5 });
    const flameL = S.layer({ par: 0.5, sh: 0, flat: true });
    const band = makeBand(S, bandL, flameL, MOB);
    const holdL = S.layer({ par: 0.5, sh: 5 });                  // the two who hold Him, behind Him
    const grab = [0, 1].map(() => S.puppet(holdL.add(shadowPerson(c, guardOpts(c), BAND_INK))));
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const judas = S.puppet(peopleL.add(withFace(person(c, TW.judas), faceBits(c))));
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: ELEVEN, lamps: false, arm: 16 });
    const cordEl = peopleL.add(`<g>${cord(c)}</g>`);
    const darkL = S.layer({ par: 0.54, sh: 0, flat: true });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0e0c20" opacity=".4"/>`);
    darkL.fade(0);

    const fx = S.layer({ par: 0.56, sh: 4 });
    const robber = hanging(fx, discPlate(c, `<g transform="translate(0 40) scale(.36)">${shadowPerson(c, { ...guardOpts(c), hairStyle: 'wrap' }, BAND_INK)}</g><path d="${c.ribbon([[-40, 36], [40, -36]], 6)}" fill="${C.terracotta}" opacity=".9"/>`, { r: 50, rim: C.stone2 }), { x: 0, y: -1500, len: 700 });
    const temple = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-90, -60, 180, 120), 0.5, 8), mix(C.parchment, C.sun, 0.25));
      const folk = [-60, -40, 40, 60].map((x) => `<path d="${c.cut([[x - 6, 44], [x - 5, 24], [x + 5, 24], [x + 6, 44]], 0.2, 3) + c.cut(c.circ(x, 18, 5, 10), 0.2, 3)}" fill="${mix(C.wood3, C.ink, 0.2)}"/>`).join('');
      return `${sheet().p(c.cut(c.rect(-100, -70, 200, 140), 0.6, 8), C.wood3).out()}${s.out()}<g transform="translate(0 46)">${templeMini(c, 0.7, { col: mix(C.cream, C.sun, 0.15) })}</g>${folk}<g transform="translate(0 44)"><circle cy="-22" r="16" fill="url(#halo-glow)"/><path d="${c.cut([[-6, 0], [-5, -18], [5, -18], [6, 0]], 0.2, 3) + c.cut(c.circ(0, -22, 5, 10), 0.2, 3)}" fill="${C.linen}"/></g>`;
    })();
    const templePlate = hanging(fx, temple, { x: 0, y: -1500, len: 700 });
    const scroll = hanging(fx, `<g transform="scale(1.4)"><circle r="70" fill="url(#halo-glow)"/>${scrollOpen(c, 110, 60)}</g>`, { x: 0, y: -1500, len: 700 });

    return (t, time) => {
      const T = time;
      N.update(T);
      const raise = bump(t, 0.2, 0.95);  // they bristle (a lean only)
      band.forEach((m) => bandPose(m, { x: m.x - 20 + (m.i < 4 ? 40 : 20), y: GY + m.y, s: m.s ?? 1, head: -raise * 6, lean: -raise * 3 }, T));
      judas.set({ x: 560, y: GY + 10, s: 1.0, flip: false, armF: 16, armB: 8, head: 14, blink: blinkAt(T, 2) });

      /* Jesus: to the crowds; then alone */
      const speak = es(t, 0.05, 0.3) * (1 - es(t, 2.9, 3.05));
      const alone = es(t, 3.3, 3.8);
      J.p.set({ x: JX, y: GY + 6, s: 1.04, flip: true, armF: 20 + speak * 16, armB: 14 + speak * 20, head: -speak * 4 + alone * 14, blink: blinkAt(T) });
      fade(J.sad, 0.4 + alone * 0.6);
      const [chx, chy] = hand(JX, GY + 6, 1.04, true, 20 + speak * 16);
      vis(cordEl, { x: chx, y: chy, s: 1.1, sx: -1, o: 1 });
      grab.forEach((g, i) => g.set({ x: i ? 740 : 770, y: GY + 2 + i * 4, s: 0.98, flip: false, armF: 70, armB: 40, lean: 4 }));

      /* the plates */
      const rIn = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 0.9, 1.1, ease.in));
      vis(robber, { x: 560, y: 300 - (1 - rIn) * 800, r: Math.sin(T) * 2, o: rIn > 0.01 ? 1 : 0 });
      const tIn = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(templePlate, { x: JX, y: 320 - (1 - tIn) * 800, r: Math.sin(T * 0.8) * 1.5, o: tIn > 0.01 ? 1 : 0 });
      const sIn = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      vis(scroll, { x: JX, y: 320 - (1 - sIn) * 800, r: Math.sin(T * 0.8) * 1.5, o: sIn > 0.01 ? 1 : 0 });

      /* v56b — they all flee */
      D.forEach((m) => {
        const run = es(t, 3.05 + m.i * 0.03, 3.5 + m.i * 0.03, ease.in);
        const x = m.x + 20 + run * (700 + m.i * 40);
        const fear = 0.7 + es(t, 2.9, 3.1) * 0.3;
        m.p.set({ x, y: m.y, s: m.s, flip: run < 0.05, o: 1 - es(t, 3.6 + m.i * 0.02, 3.8 + m.i * 0.02), walk: run > 0 && run < 1 ? x * 0.09 : undefined, amt: 1.6, armF: m.arm + run * 30, armB: 8 + fear * 30 * (1 - run) + run * 60, head: -fear * 4 - run * 6, lean: run * 12, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear * (1 - run));
      });
      darkL.fade(es(t, 3.3, 3.8) * 0.8);

      S.cam.x = kf(t, [[-0.5, 0], [0.4, -60], [1.0, -40], [1.4, 0], [3.0, 0], [3.4, 60], [3.8, 20]]);
      S.cam.y = kf(t, [[-0.5, 60], [0.4, 30], [1.4, 20], [3.0, 20], [3.4, 60], [3.8, 100]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.4, 1.06], [1.4, 1.06], [3.0, 1.06], [3.4, 1.0], [3.8, 1.2]]);
    };
  },
};
