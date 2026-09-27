// J 15,5 — "I am the vine, you are the branches": the second great I AM over the vineyard; Jesus opens His arms,
// and on every branch a little name-tag swings out — Peter, Andrew, John… each one a branch of the one vine.
// "Whoever abides in Me and I in him bears much fruit": the sap runs, and bunch after bunch of grapes comes out
// along every branch; the disciples lift their hands to them. "Apart from Me you can do nothing": the vine glows
// down its trunk into Him, and a plate hangs down — two open hands, empty.
import { es, ease, bump } from '../../core/anim.js';
import {
  tableau, placeM, lampsAll, nameTag, hungGold, hungPlate, iconWord, emptyHands, bunch, GRAPE, radiance,
  vis, kf, pose, lerp, blinkAt, tr, C, P, PI,
} from './lib.js';

export default {
  id: 'j15-branches',
  beats: [
    { v: 5, text: 'Ja jestem krzewem winnym, wy - latoroślami.' },
    { v: 5, cont: true, text: 'Kto trwa we Mnie, a Ja w nim, ten przynosi owoc obfity,' },
    { v: 5, cont: true, text: 'ponieważ beze Mnie nic nie możecie uczynić.' },
  ],
  cam: { x: [-40, 40], y: [-80, 60], z: [0.98, 1.2] },
  build(S) {
    const c = S.c;
    const tb = tableau(S, { beadsN: 1 });
    const { vine, ms, jesus, JX, JY } = tb;
    const fx = S.layer({ par: P, sh: 4 });
    // name tags hang from the branches (back row higher, front row lower)
    const tags = vine.branches.map((b, i) => {
      const m = ms[i], u = m.s < 0.85 ? 0.42 : 0.7;
      const p = b.pts[Math.round(u * (b.pts.length - 1))];
      const el = fx.add(`<g><path d="M0 -40V6" stroke="rgba(233,196,111,.7)" stroke-width="1.1"/>${nameTag(c, m.name, { size: 13 })}</g>`);
      return { el, x: p[0], y: p[1] + 18, i };
    });
    // more fruit along every branch
    const extra = [];
    vine.branches.forEach((b, i) => [0.38, 0.62].forEach((u, j) => {
      const p = b.pts[Math.round(u * (b.pts.length - 1))];
      extra.push({ el: fx.add(`<g><circle cy="16" r="24" fill="url(#halo-glow)" opacity=".45"/>${bunch(c, 4.2, GRAPE)}</g>`), x: p[0] + (j ? 5 : -5), y: p[1] + 4, i, j });
    }));
    const wordL = S.layer({ par: 0.12, sh: 5 });
    const word = wordL.add(`<g><ellipse rx="330" ry="46" fill="url(#halo-glow)" opacity=".75"/>${hungGold(c, tr('Ja jestem krzewem winnym, wy – latoroślami', 'I am the vine, you are the branches'), { size: 23 })}</g>`);
    const plate = wordL.add(`<g>${hungPlate(c, iconWord(`<g transform="translate(0 -4) scale(1.3)">${emptyHands(c)}</g>`, tr('nic', 'nothing'), { size: 24, y: 62 }), { r: 82 })}</g>`);
    tb.set.front();

    return (t, time) => {
      const T = time;
      tb.set.update(T);
      /* v5a — the I AM, arms open; tags swing out on the branches */
      const open = bump(t, 0.05, 1.0);
      jesus.set({ x: JX, y: JY, s: 1.05, armF: open * 95 + bump(t, 1.1, 1.9) * 50 + bump(t, 2.05, 2.9) * 30, armB: open * 130 + bump(t, 2.05, 2.9) * 40, head: -bump(t, 2.1, 2.9) * 6, blink: blinkAt(T, 1) });
      const wk = es(t, 0.1, 0.35, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      vis(word, { x: 800, y: 150 - (1 - wk) * 600 + (T ? Math.sin(T * 0.8) * 3 : 0), o: wk > 0.001 ? 1 : 0 });
      tags.forEach((g) => {
        const k = es(t, 0.3 + g.i * 0.035, 0.5 + g.i * 0.035, ease.back) * (1 - es(t, 2.0, 2.2) * 0.6);
        vis(g.el, { x: g.x, y: g.y, s: k, r: T ? Math.sin(T * 1.2 + g.i) * 4 * k : 0, o: k > 0.01 ? Math.min(1, k * 2) : 0 });
      });
      /* v5b — the sap runs, fruit comes out along every branch */
      const sap = 0.4 + es(t, 1.05, 1.4) * 0.6;
      vine.set({ grow: 1, sap, fruit: 1.05 + bump(t, 1.4, 2) * 0.1, ripe: 1, glow: 0.7 + bump(t, 1.1, 2.1) * 0.3 + es(t, 2.1, 2.4) * 0.3, T });
      tb.beads(T, es(t, 1.1, 1.3) * (1 - es(t, 2.0, 2.2) * 0.4));
      extra.forEach((e) => {
        const k = es(t, 1.25 + e.i * 0.03 + e.j * 0.1, 1.45 + e.i * 0.03 + e.j * 0.1, ease.back);
        vis(e.el, { x: e.x, y: e.y, s: k, o: k > 0.01 ? 1 : 0 });
      });
      ms.forEach((m, i) => {
        const reach = bump(t, 1.4 + (i % 4) * 0.05, 2.05);
        placeM(m, T, { head: -es(t, 0.2, 0.5) * 12 * (1 - es(t, 2.1, 2.3)) - reach * 6, armF: reach * (m.s < 0.85 ? 60 : 80) });
      });
      lampsAll(ms, 0.8 + bump(t, 1.2, 2.2) * 0.2);
      /* v5c — apart from Me: nothing */
      const pk = es(t, 2.1, 2.4, ease.out);
      vis(plate, { x: 800, y: 196 - (1 - pk) * 620 + (T ? Math.sin(T * 0.9) * 3 : 0), r: T ? Math.sin(T * 0.7) * 1.5 : 0, o: pk > 0.001 ? 1 : 0 });
      S.cam.y = kf(t, [[0, -40], [1, -20], [2, 10], [2.3, -30], [3, -30]]);
      S.cam.z = kf(t, [[0, 1.0], [1, 1.04], [1.6, 1.12], [2.1, 1.1], [2.4, 1.0], [3, 1.0]]);
    };
  },
};
