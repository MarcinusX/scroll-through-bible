// Łk 11,23 — a saying told as a painted flat: a harvest field in the golden evening. Jesus stands in the middle of the
// stubble with a sheaf. "Whoever is not with me is against me": two harvesters come — one walks up and stands at His
// side, and a warm light joins them; the other stops, folds his arms and turns his back,.
// "And whoever does not gather with me scatters": the one beside Him gathers the cut ears with Him, and sheaf after
// sheaf stands up in a row; the other stalks off with an armful of his own — and the wind takes it, the ears fly out
// of his arms and are scattered over the field.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, cloud, sun } from '../../assets/nature.js';
import { sheaf, wheatStalk } from '../../assets/things.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { manOf, glow, handAt, headP, kf, moving, PI } from './lib.js';

const Y = 704;
const JX = 800;

export default {
  id: 'lk11-gather',
  enter: 'fly',
  beats: [
    { v: 23, text: 'Kto nie jest ze Mną, jest przeciwko Mnie;' },
    { v: 23, cont: true, text: 'a kto nie zbiera ze Mną, rozprasza.' },
  ],
  cam: { x: [-20, 60], y: [0, 60], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    sky(S, ['#e2c8a4', '#f2d6a6', '#f8e4c0']);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 46), { x: 0, y: -1500, len: 800 });
    const cl = hanging(hangL, cloud(c, 180, C.cream, mix(C.peach, C.cream, 0.4)), { x: 0, y: -1500, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(hillsWith(c, { y: 470, amps: [14, 6, 2], lens: [1000, 360, 130], color: mix(C.hillFar, C.dusk, 0.2), trees: 10, treeColor: mix(C.sage2, C.dusk, 0.2), treeH: 16 }).markup);
    /* the standing grain far off, the stubble field */
    const fieldL = S.layer({ par: 0.24, sh: 3 });
    const ffn = c.wave(560, [6, 3], [700, 200]);
    fieldL.add(sheet().p(c.ridge(ffn, -900, 2500, 1700, 12, 1), mix(C.wheat, C.sand, 0.3)).out());
    let far = '';
    for (let i = 0; i < 70; i++) { const x = c.rr(-700, 2300); far += `<g transform="translate(${x.toFixed(0)} ${(ffn(x) + 14).toFixed(0)}) scale(.45)">${wheatStalk(c, { h: 90, color: C.wheat2, ear: C.wheat })}</g>`; }
    fieldL.add(far);
    const G = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet().p(c.ridge(c.wave(Y - 30, [4, 2], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand2, C.wheat, 0.35));
    let stub = '';
    for (let i = 0; i < 160; i++) { const x = c.rr(-600, 2200), y = c.rr(Y - 20, 1000); stub += c.ribbon([[x, y], [x + c.rr(-2, 2), y - c.rr(6, 12)]], 1.6); }
    gs.x(stub, shade(C.wheat2, -0.2), 'opacity=".7"');
    G.add(gs.out());

    /* the light that joins, the shadow that parts */
    const fx = S.layer({ par: 0.44, sh: 0, flat: true });
    const warm = fx.add(`<g opacity="0">${glow(150, 1, 'halo-glow')}</g>`);
    const cold = fx.add(`<g opacity="0"><ellipse rx="90" ry="160" fill="${mix(C.storm2, C.plumRobe, 0.3)}" opacity=".22"/></g>`);
    const act = S.layer({ par: 0.45, sh: 5 });
    const SHEAVES = [0, 1, 2, 3].map((i) => ({ i, el: act.add(`<g opacity="0">${sheaf(c, 96)}</g>`) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus, holdF: `<g transform="rotate(-10) translate(0 30) scale(.6)">${sheaf(c, 96)}</g>` })));
    const WITH = { robe: C.sageRobe, mantle: C.wheatRobe, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, veil2: C.ochre, beard: 'short', skin: C.skin3, belt: C.rope };
    const AGAINST = { robe: mix(C.plumRobe, C.storm, 0.2), mantle: C.clayMantle, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather };
    const withM = S.puppet(act.add(person(c, WITH)));
    const against = S.puppet(act.add(person(c, { ...AGAINST, holdF: `<g data-k="armful" transform="rotate(-70) translate(0 20) scale(.7)">${sheaf(c, 90)}</g>` })));
    const armful = S.$('armful');
    const EARS = Array.from({ length: 10 }, (_, i) => ({ i, el: act.add(`<g opacity="0"><g transform="scale(.5) rotate(${(i * 37) % 90 - 45})">${wheatStalk(c, { h: 60, color: C.wheat2 })}</g></g>`) }));

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1210, y: 250, r: T ? Math.sin(T * 0.5) : 0 });
      pose(cl, { x: 520 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 200, r: T ? Math.sin(T * 0.6) : 0 });
      /* v23a — one comes to His side; one turns his back */
      const WK = [[-0.5, 380], [0.3, JX - 130]];
      const wx = kf(t, WK);
      const bend = bump(t, 1.2, 1.5) + bump(t, 1.45, 1.75) + bump(t, 1.7, 2.0);
      withM.set({ x: wx, y: Y + 6, s: 1.18, walk: moving(t, WK) ? wx * 0.06 : undefined, armF: 20 + bend * 60, armB: 10 + bend * 30, lean: bend * 16, head: 4 + bend * 10, blink: blinkAt(T, 2) });
      const AK = [[-0.5, 1180], [0.25, JX + 170], [0.5, JX + 170], [1.2, JX + 170], [1.7, 1120]];
      const ax = kf(t, AK);
      const turned = es(t, 0.45, 0.5);
      const fold = es(t, 0.5, 0.65) * (1 - es(t, 1.15, 1.25));
      against.set({ x: ax, y: Y + 4, s: 1.18, flip: turned < 0.5, walk: moving(t, AK) ? ax * 0.06 : undefined, armF: 70 - fold * 10, armB: 20 + fold * 60, head: turned > 0.5 ? 8 : 0, blink: blinkAt(T, 5) });
      pose(warm, { x: (wx + JX) / 2, y: Y - 110, s: 0.8 + es(t, 0.3, 0.6) * 0.4, o: es(t, 0.3, 0.6) });
      pose(cold, { x: JX + 80, y: Y - 110, o: 0 });
      jesus.set({ x: JX, y: Y + 4, s: 1.24, armF: 30 + bump(t, 1.2, 1.9) * 30, armB: 10 + es(t, 0.2, 0.4) * (1 - es(t, 0.9, 1.1)) * 70, head: -2, blink: blinkAt(T) });

      /* v23b — sheaves rise beside them; his armful scatters in the wind */
      SHEAVES.forEach((sh) => {
        const k = es(t, 1.3 + sh.i * 0.15, 1.45 + sh.i * 0.15, ease.back);
        pose(sh.el, { x: 450 + sh.i * 62, y: Y + 22 + (sh.i % 2) * 8, s: k * 1.15, o: k > 0.01 ? 1 : 0 });
      });
      const blow = es(t, 1.3, 1.45);
      pose(armful, { r: -70, x: 0, y: 20, s: 0.7 * (1 - blow * 0.8), o: 1 - blow });
      const [hx, hy] = handAt(ax, Y + 4, 1.18, false, 70);
      EARS.forEach((e) => {
        const a = 1.3 + e.i * 0.02;
        const k = es(t, a, a + 0.55, ease.out);
        pose(e.el, { x: hx + k * (40 + e.i * 26), y: hy - 20 + k * ((e.i % 3) - 1) * 40 + Math.sin(k * PI) * -90 + k * k * (Y - hy + 10 + (e.i % 4) * 10), r: k * (200 + e.i * 40), o: k > 0 ? 1 - es(t, a + 0.45, a + 0.6) * 0.3 : 0 });
      });

      S.cam.x = kf(t, [[-0.5, 0], [1.2, 0], [1.6, 30]]);
      S.cam.z = kf(t, [[-0.5, 1.14], [1.0, 1.16], [1.6, 1.12]]);
      S.cam.y = kf(t, [[-0.5, 50], [1.6, 50]]);
    };
  },
};
