// J 15,1–2 — Night, on the way down to the Kidron. The curtains open on a moonlit terraced vineyard outside the
// city; Jesus comes down the path with the eleven and their lanterns and stops among the vines. "I am the true vine":
// a luminous paper vine grows up behind Him and spreads its branches over every disciple. "My Father is the
// vinedresser": light opens above and a hand of light with a pruning hook of light comes to tend it. "Every branch
// that bears no fruit He takes away": one dry grey branch reaching into the dark is lifted off. "Every branch that
// bears fruit He prunes": the hook of light snips the stray shoots — and the grapes swell and ripen.
import { curtains } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  vineyardNight, eleven, placeM, lampsAll, greatVine, tipsFor, vineBranch, branchRig, sapBeads, threads, pruneHook, shoot, lightCone,
  radiance, hungGold, hanging, vis, kf, person, pose, lerp, blinkAt, fade, tr, C, JESUS, NIGHT, P, PI,
} from './lib.js';

export default {
  id: 'j15-vine',
  beats: [
    { cover: true },
    { v: 1, text: 'Ja jestem prawdziwym krzewem winnym,' },
    { v: 1, cont: true, text: 'a Ojciec mój jest tym, który [go] uprawia.' },
    { v: 2, text: 'Każdą latorośl, która we Mnie nie przynosi owocu, odcina,' },
    { v: 2, cont: true, text: 'a każdą, która przynosi owoc, oczyszcza, aby przynosiła owoc obfitszy.' },
  ],
  cam: { x: [-60, 60], y: [-80, 60], z: [0.98, 1.25] },
  build(S) {
    const c = S.c;
    const set = vineyardNight(S, { skyCols: NIGHT });
    // the Father's light above
    const upL = S.layer({ par: 0.1, sh: 0, flat: true });
    const cone = upL.add(`<g>${lightCone(c, { w0: 70, w1: 420, h: 760, o: 0.22 })}</g>`);
    const rad = upL.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 64)}</g>`);
    const wordL = S.layer({ par: 0.12, sh: 5 });
    const word = wordL.add(`<g><ellipse rx="330" ry="46" fill="url(#halo-glow)" opacity=".75"/>${hungGold(c, tr('Ja jestem prawdziwym krzewem winnym', 'I am the true vine'), { size: 25 })}</g>`);
    // the vine
    const glowL = S.layer({ par: P, sh: 0, flat: true });
    const vineL = S.layer({ par: P, sh: 4 });
    const chars = S.layer({ par: P, sh: 5 });
    const ms = eleven(S, chars);
    const vine = greatVine(S, vineL, { tips: tipsFor(ms, 66), glowL });
    // the dry branch that bears nothing, reaching up into the dark from the left arm
    const [dsx, dsy] = vine.armAt(-1, 730);
    const dryEl = vineL.add(vineBranch(c, -150, -70, { leaves: 4, w: 8 }));
    const dry = branchRig(dryEl);
    const beadL = S.layer({ par: P, sh: 0, flat: true });
    const beads = sapBeads(beadL, [vine.trunk, ...vine.arms], 3);
    const jesus = S.puppet(chars.add(person(c, { ...JESUS })));
    // shoots that the hook will snip (sitting on branches), and the hand of light
    const fx = S.layer({ par: P, sh: 4 });
    const SN = [8, 3, 9, 4, 10];
    const shoots = SN.map((bi, j) => {
      const b = vine.branches[bi], p = b.pts[Math.round(b.pts.length * 0.45)];
      return { el: fx.add(`<g><g transform="scale(2)">${shoot(c)}</g></g>`), x: p[0] + (j % 2 ? 8 : -8), y: p[1] - 4, r: j % 2 ? -30 : 20, j };
    });
    const handL = S.layer({ par: P, sh: 6 });
    const th = threads(handL, 1, { color: C.halo, w: 1.6 });
    const hook = handL.add(`<g>${pruneHook(c, 84)}</g>`);
    const fg = set.front();
    const cur = curtains(S);

    const JX = 800, JY = 706;
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      set.update(T);
      /* arrival: everyone walks in during the cover */
      const arr = es(t, 0.15, 1.0, ease.out);
      const walking = arr > 0 && arr < 1;
      jesus.set({ x: lerp(-160, JX, arr), y: JY, s: 1.05, walk: walking ? arr * 24 : undefined,
        armB: bump(t, 1.05, 1.95) * 150 + bump(t, 2.05, 2.9) * 110, armF: bump(t, 1.05, 1.95) * 40 + bump(t, 3.1, 3.9) * 60 + bump(t, 4.1, 4.9) * 50,
        head: -bump(t, 2.05, 2.9) * 12 - bump(t, 3.1, 3.9) * 10, blink: blinkAt(T, 1) });
      ms.forEach((m) => {
        const from = m.x < JX ? -260 - m.i * 40 : 1900 + m.i * 30;
        const a = es(t, 0.15 + m.i * 0.02, 0.95 + m.i * 0.004, ease.out);
        const look = es(t, 1.2, 1.5) * (1 - es(t, 4.7, 5));
        placeM(m, T, { x: lerp(from, m.x, a), walk: a > 0 && a < 1 ? a * 20 + m.i : undefined, head: -look * (m.s < 0.85 ? 10 : 14) + bump(t, 3.1, 3.9) * 6,
          armF: bump(t, 4.55 + m.i * 0.02, 5) * 40 });
      });
      lampsAll(ms, 0.75 + bump(t, 1.2, 2) * 0.25);
      /* v1a — the vine grows up behind Him */
      const grow = es(t, 1.08, 1.85);
      const ripe = es(t, 4.55, 4.9);
      const fruit = es(t, 3.05, 3.35) * 0.62 + es(t, 4.5, 4.85) * 0.5;
      vine.set({ o: grow > 0 ? 1 : 0, grow, sap: es(t, 1.6, 2.2), fruit, ripe, glow: es(t, 1.1, 1.5) * (0.9 - bump(t, 3, 4) * 0.3), T });
      beads(T, es(t, 2.0, 2.2) * (1 - es(t, 3.0, 3.2)));
      const wk = es(t, 1.25, 1.5, ease.out) * (1 - es(t, 2.05, 2.3, ease.in));
      vis(word, { x: 800, y: 160 - (1 - wk) * 600 + (T ? Math.sin(T * 0.8) * 3 : 0), o: wk > 0.001 ? 1 : 0 });
      /* v1b — the Father's light opens above */
      const fa = es(t, 2.05, 2.4) * (1 - es(t, 4.85, 5.2) * 0.5);
      vis(rad, { x: 800, y: lerp(-160, 110, es(t, 2.05, 2.4, ease.out)), s: 1 + (T ? Math.sin(T * 1.3) * 0.02 : 0), o: fa });
      vis(cone, { x: 800, y: 110, o: fa * (0.8 + bump(t, 2.3, 2.9) * 0.2) });
      /* v2a — the dry branch: shown bare, then the hook lifts it away */
      const l1 = es(t, 3.35, 3.72), l2 = es(t, 3.8, 4.0, ease.in);
      const dryO = es(t, 1.6, 1.8) * (1 - es(t, 3.9, 3.99));
      const lx = -l1 * 50 - l2 * 40, ly = -l1 * 56 - l2 * 300;
      dry.set({ x: dsx + lx, y: dsy + ly, r: l1 * -8 - l2 * 10, o: dryO, grow: 1, dry: 1, fruit: 0 });
      /* the vinedresser's hook of light, on a golden thread from the light above:
         v1b it comes down and tends the crown; v2a it catches the dry branch and lifts it away; v2b it prunes */
      const pr = seg(t, 4.12, 4.6);
      const stop = Math.min(shoots.length - 1, Math.floor(pr * shoots.length));
      const s0 = shoots[stop];
      const sw = T ? Math.sin(T * 1.3) * 5 : 0;
      let hx = kf(t, [[2.1, 800], [2.5, 860], [2.95, 900], [3.15, 740], [3.3, dsx - 110], [4.0, dsx - 110]]) + lx;
      let hy = kf(t, [[2.1, 120], [2.5, 236], [2.95, 226], [3.15, 200], [3.3, dsy - 64]]) + ly;
      if (t > 4.02) { hx = s0.x - 50; hy = s0.y - 6 - bump((pr * shoots.length) % 1, 0, 1) * 12; }
      const hookO = es(t, 2.12, 2.3) * (1 - es(t, 3.9, 4.0)) + es(t, 4.02, 4.12) * (1 - es(t, 4.66, 4.8));
      vis(hook, { x: hx + sw * (t < 4 ? 1 : 0), y: hy, r: t > 4.02 ? -14 + Math.sin(pr * PI * shoots.length * 2) * 14 : -6 + (T ? Math.sin(T * 1.1) * 4 : 0), o: hookO });
      th(0, 800, 110, hx + sw * (t < 4 ? 1 : 0), hy, hookO * 0.8);
      shoots.forEach((sh) => {
        const a0 = 4.12 + ((sh.j + 0.8) / shoots.length) * 0.48;
        const f = es(t, a0, a0 + 0.3, ease.in);
        vis(sh.el, { x: sh.x + f * 20, y: sh.y + f * 170, r: sh.r + f * 90, o: es(t, 1.8, 1.9) * (1 - f) });
      });
      S.cam.x = kf(t, [[0, 0], [3, 0], [3.4, -40], [3.95, -30], [4.15, 60], [4.6, 60], [5, 30]]);
      S.cam.y = kf(t, [[0, 20], [1, 20], [1.5, -40], [2.5, -60], [3.2, -60], [4, -40], [4.6, -20], [5, 0]]);
      S.cam.z = kf(t, [[0, 1.12], [1, 1.1], [1.6, 1.0], [2.5, 1.0], [3.4, 1.12], [4.15, 1.22], [4.6, 1.2], [5, 1.08]]);
    };
  },
};
