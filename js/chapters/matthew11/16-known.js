// Mt 11,27 — dusk falls over the meadow and the first stars come out. "All things have been delivered to me by my
// Father": out of the light above, the whole world — a paper globe with a crown of stars — comes slowly down along
// a beam and rests in Jesus' hands. "No one knows the Son except the Father, and no one knows the Father except the
// Son": the beam between the light and Him glows, and two small lights pass up and down it, like a word and its answer;
// "and he to whom the Son chooses to reveal him": He turns to John kneeling beside Him and a little light goes from His
// hand into John's heart — John's face lifts in the glow.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hillsSet, fatherLight, rayBurst, lightShaft, globe, soulLight, sparkle, throng, headAt, hand, DUSK, NIGHT, PI } from './lib.js';

const GY = 736, JX = 800, DX = 960;
const LX = 800, LY = 120;

export default {
  id: 'mt11-known',
  beats: [
    { v: 27, text: 'Wszystko przekazał Mi Ojciec mój.' },
    { v: 27, cont: true, text: 'Nikt też nie zna Syna, tylko Ojciec, ani Ojca nikt nie zna, tylko Syn, i ten, komu Syn zechce objawić.' },
  ],
  cam: { x: [-20, 40], y: [-120, 40], z: [1, 1.3] },
  build(S) {
    const H = hillsSet(S, { skyCols: DUSK, sky2: NIGHT, sunAt: [1320, 420], gy: GY - 30, midY: 540 });
    const c = H.c;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 120 }));
    starL.fade(0);
    const heaven = S.layer({ par: 0.06, sh: 0, flat: true, rise: 0 });
    const rays = heaven.add(`<g>${rayBurst(c, { n: 22, r0: 60, r1: 900, spread: 0.035, color: '#fff3cf', o: 0.5 })}</g>`);
    const lightL = S.layer({ par: 0.06, sh: 4, rise: 0 });
    const fl = lightL.add(`<g>${fatherLight(c, 54)}</g>`);

    /* the beam, the globe, the two lights */
    const beamL = S.layer({ par: 0.45, sh: 0, flat: true });
    const beam = beamL.add(`<g>${lightShaft(c, { w0: 30, w1: 90, h: 640, o: 0.5 })}</g>`);
    const act = S.layer({ par: 0.45, sh: 5 });
    act.sprite(throng(makeCutter('mt11-kn'), 5, { s: 0.8, rows: 1, spread: 64, P: 'sit', men: true }), 440, GY + 6);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const john = S.puppet(act.add(person(c, { ...CAST.john, pose: 'kneel' })));
    const jGlow = act.add(`<circle r="90" fill="url(#halo-glow)"/>`);
    const fx = S.layer({ par: 0.45, sh: 4 });
    const world = fx.add(`<g><circle r="120" fill="url(#halo-glow)"/>${globe(c, 44)}<g transform="translate(0 -58)">${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${(i - 2) * 16} ${Math.abs(i - 2) * 5})">${sparkle(c, 8, C.star)}</g>`).join('')}</g></g>`);
    const pair = [0, 1].map(() => fx.add(`<g>${soulLight(c, 10)}</g>`));
    const gift = fx.add(`<g>${soulLight(c, 10)}</g>`);

    return (t, time) => {
      const T = time;
      const night = es(t, 0.0, 1.2);
      H.update(T, { sunY: 420 + night * 200, o: 1 - night * 0.7 });
      H.sk2.fade(night * 0.85);
      starL.fade(night);
      pose(fl, { x: LX, y: LY, s: 0.9 + (T ? Math.sin(T * 0.8) * 0.02 : 0), r: T ? T * 2 : 0 });
      pose(rays, { x: LX, y: LY, r: T ? T * 1.5 : 0, o: 0.7 });

      /* v27a — the world comes down into His hands */
      const hold = es(t, 0.1, 0.35);
      const turn = es(t, 1.45, 1.55);
      jesus.set({ x: JX, y: GY, s: 1.06, flip: false, armF: 20 + hold * 60 * (1 - turn * 0.3) + turn * 10, armB: 10 + hold * 56 * (1 - turn) + bump(t, 1.2, 1.5) * 60, head: -hold * 10 + turn * 10, blink: blinkAt(T) });
      const [hx, hy] = hand(JX, GY, 1.06, false, 80);
      const dn = es(t, 0.15, 0.7, ease.out);
      pose(world, { x: lerp(LX, hx + 6, dn), y: lerp(LY + 30, hy - 44, dn), s: 0.5 + dn * 0.5, r: T ? Math.sin(T * 0.6) * 4 : 0, o: es(t, 0.05, 0.15) });
      const bk = es(t, 0.05, 0.3) * (1 - es(t, 1.9, 2.0) * 0.5);
      pose(beam, { x: JX, y: GY - 200, sx: 0.4 + bk * 0.6, o: bk * (0.6 + bump(t, 1.05, 1.5) * 0.4) });

      /* v27b — the Father and the Son know each other; the Son reveals Him */
      pair.forEach((p, i) => {
        const k = T ? (T * 0.35 + i * 0.5) % 1 : 0.3 + i * 0.4;
        const u = i ? k : 1 - k;
        pose(p, { x: JX + Math.sin(k * PI * 2) * 12 * (i ? 1 : -1), y: lerp(GY - 230, LY + 60, u), o: es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.0)) * Math.sin(k * PI) });
      });
      const give = seg(t, 1.5, 1.7);
      const [gx, gy] = hand(JX, GY, 1.06, false, 90);
      const [jhx, jhy] = headAt(DX, GY, 0.98, true, 46);
      pose(gift, { x: lerp(gx, jhx - 4, give), y: lerp(gy - 10, jhy + 60, give) - Math.sin(give * PI) * 40, s: 1 - give * 0.2, o: give > 0 ? 1 - seg(t, 1.7, 1.8) * 0.4 : 0 });
      const lit = es(t, 1.66, 1.8);
      john.set({ x: DX, y: GY, s: 0.98, flip: true, armF: 40 + lit * 30, armB: 30 + lit * 60, head: 12 - lit * 26, blink: blinkAt(T, 3) });
      pose(jGlow, { x: jhx, y: jhy + 40, s: 0.6 + lit * 0.8, o: lit });

      S.cam.y = lerp(-80, 20, es(t, 0.3, 0.8));
      S.cam.z = 1.08 + es(t, 1.2, 1.6) * 0.1;
      S.cam.x = es(t, 1.2, 1.6) * 30;
    };
  },
};
