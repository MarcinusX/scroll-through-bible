// J 17,9–10 — "I pray for them": He kneels on the rock, and eleven little name tags rise from His lifted hands on
// threads of light, up towards the radiance. "Not for the world, but for those You have given Me, for they are
// Yours": the tags turn gold and gather in a ring around the light, while the paper globe of the world hangs quiet
// to one side. "All that is Mine is Yours, and all that is Yours is Mine": a figure-of-eight of light joins the
// radiance and Him, sparks running round it both ways. "And I am glorified in them": a soft glow wakes around each of
// the Eleven, and from each a ray returns to Him — His halo shines out.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, chestOf, lifeFlames, fatherLight, nameTag, globe, spark, lightPath, drawPath,
  lineD, curves, arcAt, lower, vis, kf, pose, fade, tr, C, JX, JY, NAME, NIGHT, HOLY, PI, lerp, mix,
} from './lib.js';

const RY = 150;
const E8 = (() => { const p = []; for (let i = 0; i <= 80; i++) { const th = (i / 80) * PI * 2; p.push([JX + Math.sin(th) * Math.cos(th) * 150, 318 + Math.sin(th) * 150]); } return p; })();

export default {
  id: 'j17-pray',
  beats: [
    { v: 9, text: 'Ja za nimi proszę,' },
    { v: 9, cont: true, text: 'nie proszę za światem, ale za tymi, których Mi dałeś, ponieważ są Twoimi.' },
    { v: 10, text: 'Wszystko bowiem moje jest Twoje, a Twoje jest moje,' },
    { v: 10, cont: true, text: 'i w nich zostałem otoczony chwałą.' },
  ],
  cam: { x: [-20, 20], y: [-70, 30], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: HOLY });
    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 54)}</g>`);
    const worldL = S.layer({ par: 0.12, sh: 4 });
    const world = worldL.add(`<g><path d="M0 -1600V-62" stroke="rgba(233,210,160,.4)" stroke-width="1.2" fill="none"/><g opacity=".75">${globe(c, 60)}</g></g>`);

    const thL = S.layer({ par: 0.3, sh: 0, flat: true });
    const strings = curves(thL, 11, { color: C.halo, w: 1.3 });
    const loop = thL.add(`<g>${lightPath(lineD(E8), { w: 5, col: C.halo })}</g>`);
    const loopP = loop.firstElementChild;
    const runners = [0, 1, 2, 3].map(() => thL.add(`<g>${spark(4.5)}</g>`));
    const back = curves(thL, 11, { color: '#fff3cf', w: 2 });

    const tagL = S.layer({ par: 0.3, sh: 4 });
    const TAGS = Array.from({ length: 11 }, (_, i) => { const a = PI * (0.08 + (i / 10) * 0.84); return [JX - Math.cos(a) * 170, RY + 8 + Math.sin(a) * 120]; });
    const glowL = S.layer({ par: 0.4, sh: 0, flat: true });
    const glows = Array.from({ length: 11 }, () => glowL.add(`<g opacity="0"><circle r="80" fill="url(#halo-glow)"/></g>`));
    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const J = jesusOn(S, peopleL, { o: { pose: 'kneel' } });
    J.P = 'kneel';
    const D = eleven(S, peopleL);
    const tags = D.map((m) => tagL.add(`<g>${nameTag(c, NAME[m.k](), { size: 12 })}</g>`));
    const gold = D.map((m) => tagL.add(`<g>${nameTag(c, NAME[m.k](), { size: 12 }).replace(new RegExp(C.cream, 'g'), mix(C.halo, C.cream, 0.3)).replace(new RegExp(C.parchment, 'g'), C.halo)}</g>`));
    const fx = S.layer({ par: 0.42, sh: 3 });
    const flames = lifeFlames(S, fx, D, 16);
    const jGlow = thL.add(`<g><circle r="120" fill="url(#halo-glow)"/></g>`);

    const JH = [JX + 2, JY - 124];
    const hands = [JX + 50, JY - 150];
    return (t, time) => {
      const T = time;
      P.update(T);
      vis(high, { x: JX, y: RY, r: T * 1.5, s: 1 + bump(t, 1.2, 2.0) * 0.1, o: 1 });

      /* v9a — the names rise from His hands; v9b — they turn gold and gather round the light */
      const gather = es(t, 1.1, 1.6);
      const away = es(t, 2.05, 2.4);
      D.forEach((m, i) => {
        const d = Math.abs(i - 5) / 5;
        const u = es(t, 0.1 + i * 0.04, 0.6 + i * 0.04, ease.out);
        const mid = [JX + (TAGS[i][0] - JX) * 1.9, TAGS[i][1] + 150 + (i % 2) * 26];
        const [x0, y0] = arcAt(hands, mid, -30, u);
        const x = lerp(x0, TAGS[i][0], gather), y = lerp(y0, TAGS[i][1], gather);
        const o = u > 0.01 ? 1 - away : 0;
        vis(tags[i], { x, y: y - 6, s: 0.9, r: (1 - gather) * (i % 2 ? 6 : -6), o: o * (1 - es(t, 1.35, 1.6)) });
        vis(gold[i], { x, y: y - 6, s: 0.9, o: o * es(t, 1.35, 1.6) });
        strings(i, [JX + (x - JX) * 0.3, RY + 30], [x, y - 6], -10, u, o * 0.8);
      });
      lower(world, es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.0, 2.3)), S.portrait ? 1040 : 1090, 330, { len: 600, r: T ? Math.sin(T * 0.6) * 1.2 : 0 });

      /* v10a — all Mine is Yours, all Yours is Mine: the figure of eight */
      const lk = es(t, 2.1, 2.6);
      drawPath(loopP, lk);
      fade(loop, lk > 0.001 ? 1 - es(t, 3.9, 4.0) * 0.5 : 0);
      runners.forEach((el, i) => {
        const u = ((T * 0.12 + i * 0.25) % 1);
        const dir = i % 2 ? u : 1 - u;
        const p = E8[Math.round(dir * 80)];
        vis(el, { x: p[0], y: p[1], o: lk > 0.98 ? 1 : 0 });
      });

      /* v10b — glorified in them: a glow round each of them, rays return to Him */
      D.forEach((m, i) => {
        const [cx, cy] = chestOf(m);
        const d = Math.abs(m.x - JX) / 400;
        const k = es(t, 3.05 + d * 0.2, 3.35 + d * 0.2);
        vis(glows[i], { x: cx, y: cy, s: m.s, o: k });
        back(i, [cx, cy - 20], [JX, JY - 110], -60, es(t, 3.3 + d * 0.15, 3.65 + d * 0.15), 0.8);
        put(m, T, { head: -10 - bump(t, 0.1, 1.9) * 8 - k * 4, armF: 14 + k * 20 });
        lampK(m, 0.85);
      });
      flames(1, T);
      vis(jGlow, { x: JX, y: JY - 100, s: 0.8 + es(t, 3.5, 3.9) * 0.8, o: 0.4 + es(t, 3.5, 3.9) * 0.6 });

      /* Jesus kneels, arms lifted */
      const raise = es(t, 0.0, 0.3);
      put(J, T, { head: -24 + bump(t, 1.2, 1.9) * 6, armF: 40 + raise * 34 - bump(t, 3.1, 3.9) * 14, armB: 60 + raise * 44 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -20], [1, -50], [2, -50], [3, -30], [4, 0]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.0], [2, 1.04], [3, 1.0], [4, 1.08]]);
    };
  },
};
