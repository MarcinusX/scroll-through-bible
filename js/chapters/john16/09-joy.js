// J 16,22–24 — "So you now have sorrow": grey stone hearts on the Eleven again, heads bowed. "But I will see you
// again, and your heart will rejoice": dawn warms the ridge behind Him, He opens His arms, and the stone hearts fall
// away from warm red ones. "And no one will take your joy away from you": a dark paper hand creeps in to snatch one
// of the hearts — a ring of light flares and it pulls back empty. "In that day you will ask Me nothing": the little
// grey question marks over their heads turn into sparks. "Whatever you ask of the Father in My name, He will give it":
// folded prayers, each sealed with His gold seal, rise to the light above (never a figure), and light comes down into
// their open hands. "Until now you have asked nothing in My name": a great cup is lowered, empty. "Ask, and you will
// receive, that your joy may be full": more sealed prayers go up, light pours into the cup until it brims and spills
// over them in bright drops.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, stoneHeart, heart, shadowHand, question, fatherLight, chalice, spark, hand, headAt,
  hanging, sheet, shade, mix, kf, vis, pose, lerp, C, PI, JX, NIGHT, PREDAWN, LINE,
} from './lib.js';

const CUPY = 300;

function prayer(c) {
  const s = sheet();
  s.p(c.cut([[-14, -9], [14, -10], [15, 9], [-13, 10]], 0.3, 4), C.cream);
  s.x(c.ribbon([[-14, -9], [0, 1], [14, -10]], 1.1), shade(C.cream, -0.2));
  s.p(c.cut(c.circ(0, 2, 5.5, 10), 0.2, 2), C.ochre);
  s.x(c.poly(c.star(0, 2, 3.4, 1.4, 5)), C.halo);
  return `<circle r="22" fill="url(#warm-glow)" opacity=".6"/>${s.out()}`;
}

export default {
  id: 'j16-joy',
  beats: [
    { v: 22, text: 'Także i wy teraz doznajecie smutku.' },
    { v: 22, cont: true, text: 'Znowu jednak was zobaczę, i rozraduje się serce wasze,' },
    { v: 22, cont: true, text: 'a radości waszej nikt wam nie zdoła odebrać.' },
    { v: 23, text: 'W owym zaś dniu o nic Mnie nie będziecie pytać.' },
    { v: 23, cont: true, text: 'Zaprawdę, zaprawdę, powiadam wam: O cokolwiek byście prosili Ojca, da wam w imię moje.' },
    { v: 24, text: 'Do tej pory o nic nie prosiliście w imię moje:' },
    { v: 24, cont: true, text: 'Proście, a otrzymacie, aby radość wasza była pełna.' },
  ],
  cam: { x: [-30, 40], y: [-80, 40], z: [1, 1.15] },
  build(S) {
    const c = S.c;
    let glowL = null;
    const P = pathSet(S, {
      beyond(S2) {
        glowL = S2.layer({ par: 0.12, sh: 0, flat: true });
        glowL.add(`<ellipse cx="800" cy="500" rx="900" ry="280" fill="url(#halo-glow)"/><ellipse cx="800" cy="505" rx="420" ry="120" fill="url(#halo-glow)"/>`);
        return glowL;
      },
    });
    const GY = P.GY;

    const hiL = S.layer({ par: 0.12, sh: 2 });
    const high = hiL.add(`<g>${fatherLight(c, 60, { ray: [1.5, 2.2], glow: 2.6 })}</g>`);
    const streamL = S.layer({ par: 0.3, sh: 0, flat: true });
    const gid = S.id('pour');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3cf" stop-opacity=".95"/><stop offset="1" stop-color="#ffe3a1" stop-opacity=".6"/></linearGradient>`);
    const pour = streamL.add(`<g><path d="${c.ribbon([[0, 0], [2, 200]], (u) => 12 - u * 4)}" fill="url(#${gid})"/></g>`);

    // the cup
    const cupL = S.layer({ par: 0.22, sh: 5 });
    const cup = hanging(cupL, `<g transform="translate(0 70)">${chalice(c, 110, { dark: false })}</g>`, { x: JX, y: CUPY, len: 700 });
    const fx0 = S.layer({ par: 0.23, sh: 2 });
    const empty = fx0.add(`<g><path d="${c.cut(c.ell(0, 0, 40, 7.5, 16), 0.2, 3)}" fill="${shade(C.sun, -0.45)}"/></g>`);
    const dome = fx0.add(`<g><circle r="60" fill="url(#halo-glow)"/><path d="${c.cut([...c.arc(0, 0, 42, 18, PI, 2 * PI, 14), [42, 2], [-42, 2]], 0.3, 4)}" fill="${C.star}"/></g>`);
    const spill = Array.from({ length: 16 }, (_, i) => ({ i, side: i % 2 ? 1 : -1, el: fx0.add(`<g>${spark(c, 7)}</g>`), tx: 440 + (i / 15) * 720 + c.rr(-20, 20) }));

    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY, pos: LINE });
    const TH = D.find((m) => m.k === 'thaddaeus');

    const fx = S.layer({ par: 0.56, sh: 4 });
    const stones = D.map((m) => ({ m, el: fx.add(`<g>${stoneHeart(c, 13)}</g>`) }));
    const hearts = D.map((m) => ({ m, el: fx.add(`<g><circle r="30" fill="url(#warm-glow)"/>${heart(c, 13)}</g>`) }));
    const guard = fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 34, 34, 0, PI * 2, 30), 3)}" fill="${C.halo}"/><circle r="50" fill="url(#halo-glow)"/></g>`);
    const qs = D.map((m) => ({ m, el: fx.add(`<g>${question(c, { fill: mix(C.cream, C.storm, 0.35), ink: C.storm2 })}</g>`), sp: fx.add(`<g>${spark(c, 7)}</g>`) }));
    const prayers = D.map((m, i) => ({ m, i, a: fx.add(`<g>${prayer(c)}</g>`), b: fx.add(`<g>${prayer(c)}</g>`), gift: fx.add(`<g>${spark(c, 9)}</g>`) }));
    const handL = S.layer({ par: 0.58, sh: 6 });
    const grab = handL.add(`<g>${shadowHand(c, '#2a2640', 1.7)}</g>`);

    return (t, time) => {
      const T = time;
      P.update(T);
      const see = es(t, 1.05, 1.5);
      P.sky.blend(NIGHT, PREDAWN, see * 0.7);
      glowL.fade(see);
      P.stars.fade(1 - see * 0.5);
      fade(P.moon, 1 - see * 0.4);

      /* v22 — stone hearts, then warm ones; no one can take them */
      D.forEach((m, i) => {
        const hx = m.x + (m.flip ? -6 : 6), hy = m.y - 112 * m.s;
        const sIn = es(t, 0.1 + (i % 5) * 0.05, 0.4 + (i % 5) * 0.05);
        const d = Math.abs(m.x - JX);
        const w = es(t, 1.2 + d * 0.0006, 1.45 + d * 0.0006, ease.back);
        const fall = es(t, 1.2 + d * 0.0006, 1.55 + d * 0.0006);
        vis(stones[i].el, { x: hx + fall * 10, y: hy + fall * 90, r: fall * 40, s: 0.6 + sIn * 0.4, o: sIn * (1 - fall) });
        vis(hearts[i].el, { x: hx, y: hy + (T ? Math.sin(T * 2 + i) * 1 : 0), s: w * (1 + (m === TH ? bump(t, 2.35, 2.6) * 0.2 : 0)), o: w > 0.01 ? 1 : 0 });
      });
      const reach = es(t, 2.05, 2.35) * (1 - es(t, 2.6, 3.0) * 0.8);
      const thx = TH.x - 6, thy = TH.y - 112 * TH.s;
      vis(grab, { x: lerp(1420, thx + 60, reach), y: lerp(740, thy + 70, reach), r: -55, s: 1, o: es(t, 2.0, 2.1) * (1 - es(t, 2.9, 3.0)) });
      const gk = seg(t, 2.3, 2.85);
      vis(guard, { x: thx, y: thy, s: 0.6 + gk * 1.2, o: gk > 0 && gk < 1 ? (1 - gk) : 0 });

      /* v23a — no more questions: they turn to sparks */
      qs.forEach(({ m, el, sp }, i) => {
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        const qin = es(t, 3.0 + (i % 4) * 0.04, 3.2 + (i % 4) * 0.04);
        const turn = es(t, 3.35 + (i % 5) * 0.05, 3.55 + (i % 5) * 0.05);
        vis(el, { x: hx, y: hy - 52, s: 0.55, o: qin * (1 - turn) });
        vis(sp, { x: hx, y: hy - 56 - turn * 30, s: 0.6 + turn * 0.6, o: turn * (1 - es(t, 3.8, 4.0)) });
      });

      /* v23b & v24b — sealed prayers rise, light comes back */
      const hk = es(t, 3.9, 4.2) * (1 - es(t, 6.9, 7));
      vis(high, { x: JX, y: 110 - (1 - es(t, 3.9, 4.15)) * 250, s: 0.9, o: es(t, 3.9, 4.1) });
      prayers.forEach(({ m, i, a, b, gift }) => {
        const [ox, oy] = hand(m.x, m.y, m.s, m.flip, 150);
        const u = (i % 6) * 0.04;
        const up1 = es(t, 4.15 + u, 4.6 + u);
        const top = [JX + (m.x - JX) * 0.12, 150];
        vis(a, { x: lerp(ox, top[0], up1), y: lerp(oy - 10, top[1], up1) - Math.sin(up1 * PI) * 30, s: 0.9 - up1 * 0.4, o: up1 > 0.01 && up1 < 0.98 ? 1 : 0 });
        const down = es(t, 4.55 + u, 4.9 + u);
        vis(gift, { x: lerp(top[0], ox, down), y: lerp(top[1], oy - 10, down), s: 0.8 + (1 - down) * 0.4, o: down > 0.01 ? 1 - es(t, 5.2, 5.4) * 0.7 : 0 });
        const up2 = es(t, 6.1 + u, 6.45 + u);
        vis(b, { x: lerp(ox, JX, up2), y: lerp(oy - 10, CUPY - 60, up2) - Math.sin(up2 * PI) * 50, s: 0.9 - up2 * 0.4, o: up2 > 0.01 && up2 < 0.98 ? 1 : 0 });
      });

      /* v24 — the cup: empty, then brimming and spilling over */
      const cin = es(t, 4.95, 5.3, ease.out);
      const cy = CUPY - (1 - cin) * 700;
      vis(cup, { x: JX, y: cy, r: T ? Math.sin(T * 0.8) * 0.8 : 0, o: cin > 0.01 ? 1 : 0 });
      const fill = es(t, 6.3, 6.7);
      vis(empty, { x: JX, y: cy - 7.5, o: cin > 0.01 ? 1 - fill : 0 });
      vis(dome, { x: JX, y: cy - 8, s: 0.6 + fill * 0.4, sy: 0.2 + fill * 0.8, o: fill > 0.01 ? 1 : 0 });
      vis(pour, { x: JX, y: 130, sy: Math.max(0.02, es(t, 6.2, 6.4)), o: es(t, 6.2, 6.35) * (1 - es(t, 6.85, 6.98)) });
      spill.forEach((p) => {
        const k = seg(t, 6.55 + p.i * 0.02, 6.95 + p.i * 0.02);
        const x = lerp(JX + p.side * 36, p.tx, k), y = lerp(cy - 8, GY - 190, k) - Math.sin(k * PI) * 60;
        vis(p.el, { x, y, s: 0.8, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* people */
      D.forEach((m) => {
        const d = Math.abs(m.x - JX);
        const glad = es(t, 1.25 + d * 0.0006, 1.5 + d * 0.0006);
        const pray = es(t, 4.05, 4.3) * (1 - es(t, 5.1, 5.3)) + es(t, 6.0, 6.2);
        const scared = m === TH ? bump(t, 2.05, 2.7) : 0;
        lampK(m, 0.8 + glad * 0.2, 0, T);
        fade(m.sad, (1 - glad) * es(t, 0.1, 0.4) + scared);
        put(m, T, { head: (1 - glad) * 14 - glad * 4 - pray * 10 + scared * 6, armB: 8 + pray * 142, lean: scared * -4 });
      });
      const open = es(t, 1.05, 1.35) * (1 - es(t, 2.9, 3.2));
      fade(J.sad, es(t, 0.1, 0.4) * (1 - es(t, 1.0, 1.2)) * 0.6);
      put(J, T, { armF: 20 + open * 60 + bump(t, 4.1, 4.9) * 40 + bump(t, 5.05, 5.9) * 50, armB: 10 + open * 100 + bump(t, 6.0, 6.9) * 120, head: -bump(t, 4.1, 4.9) * 10 - bump(t, 6.0, 6.9) * 10 });

      S.cam.x = kf(t, [[0, 0], [2, 0], [2.4, 30], [2.9, 0], [7, 0]]);
      S.cam.y = kf(t, [[0, 10], [2, 10], [3, 10], [4.1, -40], [5, -60], [7, -50]]);
      S.cam.z = kf(t, [[0, 1.08], [1, 1.1], [2, 1.06], [2.4, 1.12], [3, 1.06], [4.2, 1.0], [7, 1.02]]);
    };
  },
};
