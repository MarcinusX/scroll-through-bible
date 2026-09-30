// J 19,38b–39 — dusk on Golgotha. Far up on the hill two small shadows, Joseph and a helper, take Him down: a
// white linen shape is lowered gently from the middle cross, and the cross stands empty. Along the road below
// comes Nicodemus — a round picture recalls the night he first came to Jesus on the roof under the stars. He
// brings myrrh and aloes: jar after jar is set down, fragrance curls up from them, and a bronze weight hangs
// down: about a hundred pounds.
import { C, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, nicodemus, NICO, shadowPerson, shroud, golgothaSet, setCrosses, clearClouds, glory, spiceJar, scent, weightStone, strip, nameTag, miniHead, hanging, swing, LOOK, CAST, tr, GOL, INK, J19, PI } from './lib.js';

const RY = 706;

export default {
  id: 'j19-spices',
  beats: [
    { v: 38, cont: true, text: 'Poszedł więc i zabrał Jego ciało.' },
    { v: 39, text: 'Przybył również i Nikodem, ten, który po raz pierwszy przyszedł do Jezusa w nocy,' },
    { v: 39, cont: true, text: 'i przyniósł około stu funtów mieszaniny mirry i aloesu.' },
  ],
  cam: { x: [-40, 80], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const ph = S.portrait;   // phone: the hanging pictures inside the screen
    const G = golgothaSet(S, { pal: J19.eve });
    clearClouds(G);
    const gl = G.hangL.add(`<g>${glory(c, 340, 14)}</g>`);
    const u = GOL.H / 240;
    const HDY = -GOL.H + 52 * u - 2 * u;
    const fig = G.crossC.querySelector('.fig'), hd = G.crossC.querySelector('.hd');
    [G.crossL, G.crossR].forEach((el) => { fade(el.querySelector('.fig'), 0); fade(el.querySelector('.hd'), 0); });
    const H = G.onHill;
    const body = H.add(`<g>${shroud(c, 110)}</g>`);
    const sil = [0, 1].map((i) => S.puppet(H.add(shadowPerson(c, i ? LOOK.helper : LOOK.joseph, INK))));
    /* Nicodemus and his spices */
    const P = G.P;
    const jars = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: P.add(`<g>${spiceJar(c, [C.cream, mix(C.cream, C.sand, 0.4), C.linen2][i % 3], [C.clay, C.ochre, C.terracotta][i % 3])}</g>`) }));
    const curls = [0, 1, 2].map((i) => ({ i, el: P.add(`<g>${scent(c, 80)}</g>`) }));
    const nico = S.puppet(P.add(nicodemus(c)));
    const plL = S.layer({ par: 0.3, sh: 6 });
    const nTag = hanging(plL, nameTag(c, tr('Nikodem', 'Nicodemus'), { size: 18 }), { x: 0, y: 0, len: 900 });
    // the night he first came: a round picture of the roof under the stars
    const cid = S.id('night');
    let st = '';
    for (let i = 0; i < 14; i++) st += c.poly(c.star(c.rr(-60, 60), c.rr(-62, 0), c.rr(2, 3.6), 1.2, 4, 0));
    const night = hanging(plL, `${sheet().p(c.cut(c.circ(0, 0, 78, 40), 0.5, 5), C.haloRim).out()}<defs><clipPath id="${cid}"><circle r="72"/></clipPath></defs><g clip-path="url(#${cid})"><rect x="-80" y="-80" width="160" height="160" fill="${C.night}"/><path d="${st}" fill="${C.star}"/><path d="${c.poly(c.circ(40, -40, 12, 16))}" fill="${C.moon}"/><path d="${c.poly(c.rect(-80, 30, 160, 60))}" fill="${mix(C.plaster2, C.night, 0.45)}"/><g transform="translate(-24 12)">${miniHead(c, CAST.jesus, 15)}</g><g transform="translate(24 12)">${miniHead(c, NICO, 15)}</g><circle cx="-24" cy="12" r="26" fill="url(#halo-glow)" opacity=".6"/></g><g transform="translate(0 92)">${strip(c, tr('w nocy', 'by night'), { size: 15 })}</g>`, { x: 0, y: 0, len: 900 });
    const weight = hanging(plL, `${weightStone(c, '100', 70)}<g transform="translate(0 26)">${strip(c, tr('ok. sto funtów', 'about a hundred pounds'), { size: 15 })}</g><g transform="translate(0 56)">${strip(c, tr('mirra i aloes', 'myrrh and aloes'), { size: 15, fill: C.parchment })}</g>`, { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const T = time;
      G.sk.blend(J19.eve, J19.night, es(t, 0, 3) * 0.45);
      setCrosses(G, 1, 1, 1);
      pose(gl, { x: GOL.x, y: GOL.top - 150, s: 0.8, r: T * 0.3, o: 0.18 });

      /* v38c — He is taken down, wrapped in white */
      const down = es(t, 0.15, 0.7);
      fade(fig, 1 - es(t, 0.15, 0.3));
      fade(hd, 1 - es(t, 0.15, 0.3));
      pose(hd, { x: 0, y: HDY, r: 28 });
      fade(G.crossC.querySelector('.hl'), 0.3 + down * 0.3);
      const by = lerp(GOL.top - GOL.H + 60 * u + 52 * u, GOL.top + 6, down);
      pose(body, { x: GOL.x + (1 - down) * 2, y: by, r: lerp(90, 0, es(t, 0.45, 0.75)), s: lerp(1, 0.9, down), o: es(t, 0.1, 0.2) });
      sil.forEach((p, i) => p.set({ x: GOL.x + (i ? 44 : -44), y: GOL.top + 4, s: 0.3, flip: i === 1, armF: 90 + (1 - down) * 50, armB: 60 + (1 - down) * 60, head: -20 + down * 26, blink: 0, o: es(t, -0.2, 0.1) }));

      /* v39a — Nicodemus, who first came by night */
      const nK = [[0.9, [1480, RY]], [1.6, [1010, RY]]];
      const [nx, ny] = kf(t, nK);
      const set = es(t, 2.05, 2.5);
      nico.set({ x: nx, y: ny, s: 1.02, flip: true, walk: moving(t, nK) ? nx * 0.05 : undefined, armF: 30 + bump(t, 2.05, 2.7) * 50, armB: 10 + bump(t, 2.2, 2.8) * 40, head: -bump(t, 1.3, 1.9) * 10 + set * 6, lean: bump(t, 2.05, 2.7) * 8, blink: blinkAt(T, 2) });
      const tg = es(t, 1.05, 1.3) * (1 - es(t, 1.95, 2.1));
      swing(nTag, nx - 6, 330 - (1 - tg) * 700, T, 1.2, 0.9, 1);
      const nk = es(t, 1.2, 1.5) * (1 - es(t, 1.95, 2.15));
      swing(night, ph ? 1045 : 1080, (ph ? 150 : 205) - (1 - nk) * 700, T, 1, 0.7, 2);

      /* v39b — myrrh and aloes, about a hundred pounds */
      jars.forEach((j) => {
        const k = es(t, 2.1 + j.i * 0.07, 2.25 + j.i * 0.07, ease.back);
        pose(j.el, { x: 880 - (j.i % 3) * 30 - Math.floor(j.i / 3) * 16, y: RY + 4 + Math.floor(j.i / 3) * 12, s: k * 1.4, o: k > 0.02 ? 1 : 0 });
      });
      curls.forEach((cu) => {
        const k = ((T * 0.25 + cu.i / 3) % 1);
        const on = es(t, 2.4, 2.6);
        pose(cu.el, { x: 850 - cu.i * 30 + Math.sin(T + cu.i) * 4, y: RY - 44 - k * 30, s: 0.8 + k * 0.3, o: on * Math.sin(k * PI) * 0.9 });
      });
      const wk = es(t, 2.2, 2.55);
      swing(weight, ph ? 1030 : 1110, 235 - (1 - wk) * 700, T, 1, 0.8, 3);

      S.cam.x = es(t, 0.8, 1.6) * 60;
      S.cam.y = -10 - es(t, 0, 0.6) * 20 * (1 - es(t, 0.8, 1.4)) + es(t, 2.0, 2.5) * 20;
      S.cam.z = 1.02 + es(t, 0, 0.5) * 0.08 * (1 - es(t, 0.8, 1.4));
    };
  },
};
