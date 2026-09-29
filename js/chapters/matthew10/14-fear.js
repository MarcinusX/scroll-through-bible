// Mt 10,28 — dusk on a hilltop. Behind Matthew, kneeling, a huge shadow of a soldier rises on the evening sky and
// lifts its sword — but out of Matthew rises a small bright flame, his soul, up and away where no shadow can reach.
// Then the shadow shrinks to nothing. High above, the great radiance of the Father's light opens (no figure,
// only light); and far below, on the right, the valley of Gehenna smoulders red with smoke. Jesus, at the centre,
// points up to the light; Matthew bows low before it.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, grass, rock, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { INK, shadowPerson, silhouette, addToHead, radiance, rayBurst, flame, headAt, PI } from './lib.js';

const JX = 800, JY = 716, MX = 600, MY = 722;

export default {
  id: 'mt10-fear',
  beats: [
    { v: 28, text: 'Nie bójcie się tych, którzy zabijają ciało, lecz duszy zabić nie mogą.' },
    { v: 28, cont: true, text: 'Bójcie się raczej Tego, który duszę i ciało może zatracić w piekle.' },
  ],
  cam: { x: [-20, 30], y: [-60, 20], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const DUSK = ['#6f6a9c', '#d9a08f', '#f2c49a'];
    const sk = sky(S, DUSK);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -500, y1: 300, n: 60 }));
    const lightL = S.layer({ par: 0.04, sh: 2, rise: 0 });
    const rays = lightL.add(`<g>${rayBurst(c, { n: 30, r0: 60, r1: 900, spread: 0.035, o: 0.6 })}<circle r="420" fill="url(#halo-glow)"/></g>`);
    const rad = lightL.add(`<g>${radiance(c, 110)}</g>`);

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.45) }).markup);
    const mid = S.layer({ par: 0.2, sh: 3 });
    mid.add(hillsWith(c, { y: 540, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.35), trees: 12, treeColor: mix(C.moss2, C.night2, 0.3), treeH: 20 }).markup);

    /* the soldier's shadow on the sky */
    const shL = S.layer({ par: 0.22, sh: 1, flat: true });
    const SC = mix(INK, C.plumRobe, 0.2);
    const swordM = `<path d="${c.cut([[-3, 0], [3, 0], [2.4, 86], [0, 98], [-2.4, 86]], 0.2, 5)}" fill="${SC}"/><path d="${c.poly(c.rect(-12, -2, 24, 5))}" fill="${SC}"/>`;
    const helm = `<path d="${c.cut([...c.arc(0, -2, 21, 21, PI * 0.98, PI * 2.02, 14), [21, -2], [-21, -2]], 0.4, 4) + c.cut([[-8, -22], [-2, -36], [10, -38], [4, -22]], 0.4, 3)}" fill="${SC}"/>`;
    const giant = S.puppet(shL.add(addToHead(person(c, { ...silhouette({ hairStyle: 'short', beard: 'short', belt: C.leather }, SC), holdB: `<g transform="rotate(180)">${swordM}</g>` }).split(`fill="${C.blush}"`).join(`fill="${SC}"`), helm)));

    /* Gehenna: a smouldering ravine far down on the right */
    const gh = S.layer({ par: 0.3, sh: 3 });
    const ravine = gh.add(`<g opacity="0">${sheet().p(c.cut([[900, 700], [960, 640], [1040, 628], [1130, 616], [1250, 622], [1380, 650], [1380, 700]], 1.4, 8), mix(C.soilDark, C.duskViolet, 0.25)).out()}</g>`);
    const ghGlow = gh.add(`<g opacity="0"><ellipse cx="1140" cy="646" rx="230" ry="46" fill="url(#warm-glow)"/><path d="${c.cut([[980, 650], [1060, 640], [1150, 634], [1250, 640], [1320, 652], [1250, 662], [1100, 664]], 0.8, 8)}" fill="${mix(C.terracotta, C.soilDark, 0.35)}"/><path d="${c.cut([[1040, 648], [1140, 642], [1240, 648], [1140, 654]], 0.6, 6)}" fill="${C.sunDeep}" opacity=".7"/></g>`);
    const smoke = [0, 1, 2, 3].map((i) => gh.add(`<g><path d="${c.ribbon(c.cbez([0, 0], [-20, -40], [20, -80], [-6, -140], 14), (u) => 16 - u * 10)}" fill="${mix(C.storm, C.rock3, 0.4)}" opacity=".55"/></g>`));

    /* the hilltop */
    const G = S.layer({ par: 0.45, sh: 3 });
    const gfn = c.wave(690, [6, 3], [700, 200]);
    G.add(sheet().p(c.ridge((x) => gfn(x) + Math.max(0, x - 880) * 0.12, -900, 2500, 1700, 12, 1), mix(C.sage2, C.duskViolet, 0.3)).out());
    G.add(rock(c, 470, 740, 140, 44, mix(C.rock2, C.duskViolet, 0.25)) + grass(c, { x0: -600, x1: 1000, y: 690, fn: gfn, n: 30, h: 12, color: mix(C.moss, C.duskViolet, 0.2) }));
    const P = S.layer({ par: 0.5, sh: 5 });
    const matthew = S.puppet(P.add(person(c, { ...CAST.matthew, pose: 'kneel' })));
    const jGlow = P.add(`<g><circle r="150" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const soul = P.add(`<g><circle r="46" fill="url(#halo-glow)"/><circle r="22" fill="url(#warm-glow)"/><g transform="translate(0 16)">${flame(c, 36, C.halo, '#fffdf4')}</g></g>`);

    return (t, time) => {
      const T = time;
      /* v28a — the shadow that can kill the body, and the soul it cannot touch */
      const rise = es(t, 0.08, 0.4);
      const shrink = es(t, 1.05, 1.4);
      giant.set({ x: 520 + shrink * 60, y: 900 - shrink * 120, s: lerp(0.4, 3.0, rise) * (1 - shrink * 0.9), o: (1 - es(t, 1.2, 1.45)) * 0.6, armF: 30 + es(t, 0.35, 0.6) * 40, armB: 10 + es(t, 0.35, 0.6) * 150 * (1 - shrink), head: 6 });
      const up = es(t, 0.45, 0.85);
      const [mhx, mhy] = headAt(MX, MY, 0.94, false, 46);
      pose(soul, { x: mhx + up * 60, y: lerp(mhy + 30, 300, up) + Math.sin(T * 2) * 4 * up, s: 0.8 + up * 0.7 + Math.sin(T * 5) * 0.03, o: es(t, 0.4, 0.5) * (1 - es(t, 1.4, 1.6) * 0.5) });
      matthew.set({ x: MX, y: MY, s: 0.94, armF: 60 + es(t, 1.4, 1.6) * 20, armB: 40, head: 10 + es(t, 1.4, 1.6) * 16, lean: es(t, 1.4, 1.6) * 12, blink: blinkAt(T, 2) });

      /* v28b — the light above, Gehenna below */
      const lk = es(t, 1.1, 1.5);
      sk.blend(DUSK, ['#c9b98f', '#f0d49c', '#f6e2b8'], lk * 0.6);
      starL.fade(1 - lk);
      pose(rays, { x: 800, y: 230, s: 0.5 + lk * 0.6, r: T * 2, o: lk });
      pose(rad, { x: 800, y: lerp(-300, 230, lk), s: 0.9, o: lk > 0.01 ? 1 : 0 });
      fade(ravine, es(t, 1.2, 1.4));
      fade(ghGlow, es(t, 1.35, 1.6) * (0.85 + Math.sin(T * 3) * 0.1));
      smoke.forEach((sm, i) => {
        const k = T ? (T * 0.2 + i / 4) % 1 : (i + 0.5) / 4;
        pose(sm, { x: 990 + i * 70, y: 640 - k * 60, s: 0.6 + k * 0.6, o: es(t, 1.35, 1.6) * Math.sin(k * PI) });
      });
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armB: 10 + bump(t, 0.05, 0.9) * 40 + es(t, 1.1, 1.4) * 140, armF: 20 + bump(t, 0.05, 0.9) * 60, head: -es(t, 1.1, 1.4) * 10, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: JY - 180, o: 0.5 });

      S.cam.y = -es(t, 1.0, 1.4) * 50;
      S.cam.z = 1 + es(t, 0.1, 0.6) * 0.04;
    };
  },
};
