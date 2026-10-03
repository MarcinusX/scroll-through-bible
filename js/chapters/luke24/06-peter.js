// Łk 24,12 — But Peter gets up and runs to the tomb, all the way along the garden path in the gold of the morning,
// out of breath. He stoops at the low doorway and looks in: a round peep-plate comes down and shows what he sees in
// the dark — only the linen cloths, lying by themselves in a thin beam of light. And he goes away home, slowly,
// a hand at his beard, wondering at what had happened: a little star and a question go with him.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, mix } from './lib.js';
import { sun, cloud } from '../../assets/nature.js';
import { es, ease, bump, seg, fade } from './lib.js';
import { PETER, gardenSet, GARDEN_PATH, gardenS, DOOR, STONE, GOLD, headAt, linenLying, vignette, withFace, faceBits, sparkle, thought, GLYPH, hangK, PI } from './lib.js';

const P = GARDEN_PATH;
function yAt(x) {
  if (x <= P[0][0]) return P[0][1];
  for (let i = 1; i < P.length; i++) if (x <= P[i][0]) { const u = (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return lerp(P[i - 1][1], P[i][1], u); }
  return P[P.length - 1][1];
}

export default {
  id: 'lk24-peter',
  beats: [
    { v: 12, text: 'Jednakże Piotr wybrał się i pobiegł do grobu;' },
    { v: 12, cont: true, text: 'schyliwszy się, ujrzał same tylko płótna.' },
    { v: 12, cont: true, text: 'I wrócił do siebie, dziwiąc się temu, co się stało.' },
  ],
  cam: { x: [60, 560], y: [0, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    sky(S, GOLD);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const SUNX = S.portrait ? 990 : 1120;   // phone: the sun hangs clear of the progress thread
    const sunEl = hanging(hangL, sun(c, 50, { rays: C.sunDeep }), { x: SUNX, y: 170, len: 900 });
    const cl = hanging(hangL, cloud(c, 150), { x: 700, y: 150, len: 700 });
    const G = gardenSet(S);
    const L = G.walkL;
    const peter = S.puppet(L.add(withFace(person(c, { ...PETER }), faceBits(c))));
    const drops = [0, 1].map(() => L.add(`<path d="${c.cut([[0, -8], [4, 0], [0, 4], [-4, 0]], 0.2, 2)}" fill="#bfe0ee"/>`));

    /* the peep-plate: only the linen cloths, lying by themselves */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const dark = mix(C.soilDark, C.storm2, 0.35);
    const inner = `<rect x="-160" y="-160" width="320" height="320" fill="${dark}"/>`
      + `<path d="${c.cut([[-160, 30], [160, 24], [160, 160], [-160, 160]], 0.6, 8)}" fill="${mix(C.rock, C.soilDark, 0.35)}"/>`
      + `<path d="${c.cut([[-160, 24], [160, 18], [160, 34], [-160, 38]], 0.4, 8)}" fill="${mix(C.rock, C.cream, 0.1)}"/>`
      + `<path d="${c.poly([[-150, -140], [-90, -150], [60, 60], [-40, 70]])}" fill="${C.lampGlow}" opacity=".32"/>`
      + `<ellipse cx="0" cy="16" rx="130" ry="36" fill="url(#halo-glow)" opacity=".8"/>`
      + `<g transform="translate(0 26) scale(.8)">${linenLying(c)}</g>`;
    const peep = hanging(fx, vignette(S, inner, { r: 118, k: 'lk24peep' }), { x: 0, y: -1500, len: 700 });
    const wonder = fx.add(`<g>${thought(c, `<g transform="scale(1.1)">${GLYPH.star(c)}</g>`, { w: 70, h: 52 })}</g>`);
    const spk = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, T) => {
      swing(sunEl, SUNX, 170, T, 0.8, 0.5);
      swing(cl, 700 + (T ? Math.sin(T * 0.1) * 30 : 0), 150, T, 1.2, 0.6, 1);
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y, o: 0 });

      /* v12a: he runs along the path to the tomb */
      const run = es(t, 0.05, 0.95, ease.io);
      const stoop = es(t, 1.02, 1.3) * (1 - es(t, 1.9, 2.15));
      const home = es(t, 2.1, 2.95, ease.sine);
      const x = lerp(lerp(220, 1080, run), 640, home);
      const y = yAt(x) + 4;
      const s = gardenS(y) * 1.05;
      const running = run > 0.01 && run < 0.99;
      const walking = home > 0.01 && home < 0.99;
      const chin = es(t, 2.2, 2.45);
      peter.set({ x, y, s, flip: t > 2.05, walk: running ? x * 0.09 : walking ? x * 0.05 : undefined, amt: running ? 1.3 : 0.7, lean: running ? 10 : stoop * 26, armF: running ? 40 : 24 + stoop * 26 + chin * 70, armB: running ? 30 : 10 + stoop * 20, head: stoop * 12 + chin * 8, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(x, y, s, t > 2.05);
      drops.forEach((d, i) => {
        const k = T ? (T * 1.3 + i * 0.5) % 1 : 0.4 + i * 0.3;
        pose(d, { x: hx - 16 - i * 10, y: hy - 16 + k * 20, o: es(t, 0.3, 0.5) * (1 - es(t, 1.0, 1.2)) * (1 - k) });
      });

      /* v12b: he stoops and sees only the linen */
      const pk = es(t, 1.15, 1.4, ease.back) * (1 - es(t, 1.95, 2.2, ease.in));
      hangK(peep, pk, 900, 300, T, 0);
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: 0.2 + stoop * 0.25 });

      /* v12c: home, wondering */
      const wk = es(t, 2.3, 2.5, ease.back);
      pose(wonder, { x: hx + (t > 2.05 ? -10 : 10), y: hy - 20, s: wk, o: wk > 0.01 ? 1 : 0 });
      spk.forEach((el, i) => {
        const b = bump(t, 2.4 + i * 0.12, 2.95 + i * 0.05);
        pose(el, { x: hx - 40 + i * 40, y: hy - 90 - (i % 2) * 20, s: b, r: T * 30, o: b });
      });

      S.cam.x = lerp(200, 480, es(t, 0.1, 1.0)) - es(t, 2.1, 2.9) * 260;
      S.cam.y = 30 - stoop * 10;
      S.cam.z = (1.08 + stoop * 0.04) * (S.portrait ? 0.96 : 1);
      void seg; void PI; void fade;
    };
  },
};
