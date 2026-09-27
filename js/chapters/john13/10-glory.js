// J 13,31–33 — the door is shut, Judas' place is empty, the room is dark. When he had gone out, Jesus lifts His
// head and speaks: "Now the Son of Man is glorified" — light floods back into the room, golden rays from Him, and
// above, the radiance of the Father (never a figure) answers with its own light: God glorified in Him. "God will
// glorify Him in Himself — at once": a crown of light comes swiftly down from the radiance and rests over Him.
// "Little children, a little while longer I am with you": He opens His arms to them, they lean in; a small
// hourglass on the table, little sand left. "You will seek Me … where I go you cannot come": a hanging picture —
// a path of light climbing to a bright doorway, and the disciples below, looking up, at the edge of a gap.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, NIGHTFALL, EVE, DEEP, JX, CAST, TW, C, tr, sheet, mix, shade, darkPool, glory, rayBurst, radiance, glowDisc, lightCrown, hourglassRig, framed, mini, stepPath,
  kf, headAt, vis, pose, fade, lerp, blinkAt, PI,
} from './lib.js';

/** the picture for "where I go you cannot come" (inner coords 0..w, 0..h) */
function wayPicture(c, w, h) {
  const s = sheet();
  s.p(c.cut([[0, h * 0.72], [w * 0.42, h * 0.7], [w * 0.46, h], [0, h]], 0.8, 8), mix(C.stone2, C.indigo, 0.35));
  s.p(c.cut([[w * 0.56, h * 0.74], [w, h * 0.66], [w, h], [w * 0.54, h]], 0.8, 8), mix(C.stone2, C.indigo, 0.35));
  s.p(c.cut([[w * 0.58, h * 0.72], [w * 0.7, h * 0.52], [w * 0.8, h * 0.34], [w * 0.86, h * 0.2], [w * 0.9, h * 0.2], [w * 0.84, h * 0.36], [w * 0.74, h * 0.55], [w * 0.64, h * 0.74]], 0.5, 6), mix(C.halo, C.cream, 0.4));
  const door = sheet().p(c.cut([[-18, 0], [-18, -34], [0, -46], [18, -34], [18, 0]], 0.3, 4), '#fff6dc').out();
  const people = [0, 1, 2].map((i) => `<g transform="translate(${w * 0.1 + i * 34} ${h * 0.72})">${mini(c, [CAST.peter, CAST.john, CAST.thomas][i], { sc: 0.26 })}</g>`).join('');
  return `<rect width="${w}" height="${h}" fill="${mix(C.night, C.indigo, 0.4)}"/><circle cx="${w * 0.88}" cy="${h * 0.16}" r="${h * 0.4}" fill="url(#halo-glow)"/>${s.out()}<g transform="translate(${w * 0.88} ${h * 0.2})">${door}</g><g transform="translate(${w * 0.62} ${h * 0.7})">${stepPath(c, 7, { dx: 11, dy: -11, col: C.sun })}</g>${people}`;
}

const tall = () => typeof innerWidth !== 'undefined' && innerHeight > innerWidth * 1.05;

export default {
  id: 'j13-glory',
  beats: [
    { v: 31, text: 'Po jego wyjściu rzekł Jezus:' },
    { v: 31, cont: true, text: '«Syn Człowieczy został teraz otoczony chwałą, a w Nim Bóg został chwałą otoczony.' },
    { v: 32 },
    { v: 33, text: 'Dzieci, jeszcze krótko jestem z wami.' },
    { v: 33, cont: true, text: 'Będziecie Mnie szukać, ale - jak to Żydom powiedziałem, tak i teraz wam mówię - dokąd Ja idę, wy pójść nie możecie.' },
  ],
  get cam() { return { x: [-20, tall() ? 1000 : 300], y: [-40, 200], z: [1, 1.7] }; },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: DEEP, wing: true });
    const { R, at, by, SEAT, TOP, W } = T0;
    const J = by.jesus, JU = by.judas;
    /* the night, lifting */
    const nightL = S.layer({ par: 0.56, sh: 0, flat: true });
    nightL.add(darkPool(S, { cx: JX, cy: SEAT - 90, r0: 70, r1: 520, col: '#07081a', name: 'night' }));
    const night2 = S.layer({ par: 0.56, sh: 0, flat: true });
    night2.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#0b0c22" opacity=".5"/>`);
    /* glory */
    const gl = T0.wallFx;
    const rays = gl.add(`<g>${glory(c, 460, 26)}</g>`);
    const rad = gl.add(`<g>${glowDisc(240, 'halo-glow', 0.9)}${rayBurst(c, { n: 18, r0: 30, r1: 200, spread: 0.035, o: 0.4 })}<g transform="scale(.4)">${radiance(c, 150)}</g></g>`);
    const beam = gl.add(`<g><path d="M-22 0L22 0L110 330L-110 330Z" fill="#fff3cf" opacity=".3"/></g>`);
    const fx = S.layer({ par: 0.52, sh: 3 });
    const crown = fx.add(`<g>${lightCrown(c, 40)}</g>`);
    const glass = hourglassRig(fx, c, 56);
    /* where I go */
    const hangL = S.layer({ par: 0.5, sh: 4 });
    const PW = 420, PH = 210;
    const pic = hangL.add(`<g>${framed(S, wayPicture(c, PW, PH), { w: PW, h: PH, rim: C.wood2, k: 'way' })}</g>`);
    const steps = Array.from(pic.querySelectorAll('[data-i]'));

    return (t, time) => {
      const T = time;
      const light = es(t, 1.08, 1.6);
      T0.idle(t, T, 0.8 * (1 - light));
      R.sky.blend(['#07081a', '#0d0f26', '#14163a'], ['#232957', '#3a3f70', '#5d5b86'], light);
      R.stars.fade(0.3 + light * 0.6);
      nightL.fade(1 - light);
      night2.fade(1 - light);
      W.set(0);

      /* b1 — glorified: rays from Him; the radiance above answers */
      const gk = es(t, 1.1, 1.5) * (1 - es(t, 2.9, 3.2) * 0.8);
      vis(rays, { x: JX, y: SEAT - 110, s: 0.5 + gk * 0.5, o: gk * 0.85 });
      const rk = es(t, 1.4, 1.8) * (1 - es(t, 3.0, 3.3));
      vis(rad, { x: JX, y: 230, s: 0.8 + rk * 0.2, o: rk });
      vis(beam, { x: JX, y: 250, o: bump(t, 1.5, 2.95) * 0.9 });
      /* b2 — at once: the crown of light comes swiftly down */
      const ck = es(t, 2.2, 2.4, ease.out) * (1 - es(t, 3.05, 3.3));
      const [hx, hy] = headAt(JX, SEAT, J.s, false, 62);
      vis(crown, { x: hx, y: lerp(240, hy - 44, ck), s: 0.8, o: ck > 0.01 ? Math.min(1, ck * 2) : 0 });

      /* the table (Judas' place is empty) */
      const lift = es(t, 0.1, 0.5);
      const open = es(t, 3.05, 3.4) * (1 - es(t, 4.8, 5) * 0.3);
      const search = es(t, 4.1, 4.3);
      at.forEach((m) => {
        if (m.k === 'judas') { m.p.set({ o: 0 }); return; }
        if (m.k === 'jesus') {
          T0.sit(m, T, { head: 8 * (1 - lift) - lift * 6 - gk * 4 + search * 4, armF: 30 + open * 40 + gk * 10, armB: 14 + open * 70 + gk * 30 });
          fade(m.sad, (1 - lift) * 0.8 + search * 0.6);
          return;
        }
        const near = 1 - Math.min(1, Math.abs(m.x - JX) / 420);
        const look = Math.sin(m.i * 2.3 + t * 2) * 10 * search;
        T0.sit(m, T, { head: -gk * 6 - search * 4 + look, lean: open * (4 + near * 6) * (m.flip ? 1 : 1), armF: 36 + gk * 14 });
        fade(m.sad, search * 0.8);
      });

      /* b3 — a little while: the hourglass on the table */
      const hk = es(t, 3.1, 3.4, ease.out);
      vis(glass.el, { x: 930, y: TOP - 28 - (1 - hk) * 30, o: hk });
      glass.set(0.3 - seg(t, 3.3, 5) * 0.25, hk > 0.5 ? 1 : 0);

      /* b4 — where I go you cannot come */
      const pk = es(t, 4.05, 4.4, ease.out);
      vis(pic, { x: JX, y: 250 - (1 - pk) * 700, r: T ? Math.sin(T * 0.6) * 0.6 : 0, o: pk > 0.01 ? 1 : 0 });
      steps.forEach((el, i) => fade(el, es(t, 4.4 + i * 0.06, 4.5 + i * 0.06)));

      S.cam.x = kf(t, [[0, S.portrait ? 1000 : 250], [0.9, S.portrait ? 900 : 200], [1.2, 0], [2, 0], [3, 0], [4, 0], [5, 0]]);
      S.cam.y = kf(t, [[0, 150], [0.9, 150], [1.2, 60], [2, 30], [3, 150], [4, 80], [5, 60]]);
      S.cam.z = kf(t, [[0, 1.3], [0.9, 1.35], [1.2, 1.15], [2, 1.2], [3, 1.5], [4, 1.2], [5, 1.2]]);
    };
  },
};
