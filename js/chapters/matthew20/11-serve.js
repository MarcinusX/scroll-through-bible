// Mt 20,26–28 — "It shall not be so among you": the rulers' board folds shut and flies away. The Twelve sit down in the
// shade to eat. "Whoever would be great among you must be your servant": John takes the jug and goes round pouring for
// the others. "Whoever would be first must be your slave": Peter kneels with a basin at Andrew's feet. "Even as the Son
// of Man came not to be served but to serve" — Jesus himself ties a towel on and kneels with the basin before Peter.
// "And to give his life as a ransom for many": he stands with open arms, light pours from him along the hills, where
// a great many people stand bound together by a chain — the chain breaks and falls, and they lift their hands.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { roadSet, shadeTree, TWELVE, rulerBoard, hangAt, basinBowl, towel, ewer, cup, chain, pose3, rays, crowdPerson, manOf, olive, bush, rock, makeCutter } from './lib.js';

const GY = 700, JX = 790;
const SEAT = {
  bartholomew: [450, 700], philip: [515, 694], andrew: [578, 712], matthew: [476, 736], thomas: [548, 742],
  peter: [666, 718],
  james: [936, 702], jamesA: [1000, 694], thaddaeus: [1062, 710], simonZ: [1124, 700], judas: [1010, 738],
};
const MANY_Y = 572, MS = 0.36;

export default {
  id: 'mt20-serve',
  beats: [
    { v: 26, text: 'Nie tak będzie u was.' },
    { v: 26, cont: true, text: 'Lecz kto by między wami chciał stać się wielkim, niech będzie waszym sługą.' },
    { v: 27 },
    { v: 28, text: 'na wzór Syna Człowieczego, który nie przyszedł, aby Mu służono, lecz aby służyć' },
    { v: 28, cont: true, text: 'i dać swoje życie na okup za wielu».' },
  ],
  cam: { x: [-30, 30], y: [-60, 30], z: [0.94, 1.1] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.74, jerX: 1220, farY: 420, roadX: 840, trees: 14, clouds: [[450, 150, 160], [1080, 120, 120]] });
    const glowL = S.layer({ par: 0.08, sh: 1, flat: true });
    const burst = glowL.add(`<g>${rays(c, { n: 24, r0: 60, r1: 1100, spread: 0.045, color: '#fff3cf' })}<circle r="300" fill="url(#halo-glow)"/></g>`);
    const back = S.layer({ par: 0.35, sh: 3 });
    back.add(shadeTree(c, 330, 640, 1.1) + olive(c, 1400, 610, 0.9));

    /* the many, bound together on the hills — then free */
    const manyL = S.layer({ par: 0.3, sh: 3 });
    const groups = [[360, 700, 'mt20-many-a'], [900, 1250, 'mt20-many-b']].map(([x0, x1, seed], gi) => {
      const cc = makeCutter(seed);
      const n = Math.round((x1 - x0) / 56);
      const mem = Array.from({ length: n }, (_, i) => ({ x: i * 56 + cc.rr(-6, 6), y: cc.rr(-3, 3), s: MS * cc.rr(0.94, 1.05), flip: gi === 0, o: manOf(cc) }));
      const bound = mem.map((m) => ({ ...m, armF: 40, head: 10 }));
      const free = mem.map((m) => ({ ...m, armF: 70, armB: 150, head: -10 }));
      const hy = (-138 + 57 * Math.cos((40 * Math.PI) / 180)) * MS;
      const links = [];
      for (let i = 0; i < n - 1; i++) links.push(manyL.add(`<g>${chain(c, 56)}</g>`));
      return { x0, n, hy, links, a: manyL.sprite(pose3(cc, bound), x0, MANY_Y), b: manyL.sprite(pose3(cc, free), x0, MANY_Y), seed: cc.rr(0, 1) };
    });

    const hangL = S.layer({ par: 0.3, sh: 5 });
    const B = rulerBoard(S, hangL, c);

    /* the Twelve sitting down; John serving; Peter; Jesus */
    const P = S.layer({ par: 0.5, sh: 5 });
    // phone: the circle of the Twelve drawn a little closer round Jesus, so the outermost stay whole
    const SQ = (x) => (S.portrait ? JX + (x - JX) * 0.85 : x);
    const byK = Object.fromEntries(TWELVE.map((d) => [d.k, d]));
    const sitters = Object.entries(SEAT).filter(([k]) => k !== 'peter').map(([k, [x0, y]], i) => ({ k, i, x: SQ(x0), y, p: S.puppet(P.add(person(c, { ...byK[k].o, pose: 'sit', holdF: k === 'james' || k === 'jamesA' ? `<g transform="translate(0 2) scale(1.5)">${cup(c)}</g>` : '' }))), seed: c.rr(0, 9) }));
    const peterSit = S.puppet(P.add(person(c, { ...CAST.peter, pose: 'sit' })));
    const peterKneel = S.puppet(P.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const john = S.puppet(P.add(person(c, { ...CAST.john, holdF: `<g transform="translate(0 8) rotate(-20) scale(1.25)">${ewer(c)}</g>` })));
    const jStand = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const jKneel = S.puppet(P.add(person(c, { ...CAST.jesus, pose: 'kneel', holdB: `<g transform="translate(-4 -30)">${towel(c, 60)}</g>` })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const basin1 = fx.add(`<g>${basinBowl(c, 76)}</g>`);
    const basin2 = fx.add(`<g>${basinBowl(c, 76)}</g>`);
    const serveGlow = fx.add(`<g><circle r="170" fill="url(#warm-glow)"/></g>`);

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 210, 990, 220, C.sage, C.moss) + rock(c, 1400, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 5) * 30 });
      R.sk.blend(['#cfe0da', '#efe6cd', '#f6e8cf'], ['#dcd6c8', '#f6dcb4', '#f8e0bf'], es(t, 3, 5));

      /* v26a — not so among you: the board folds and flies */
      const shut = es(t, 0.05, 0.3), fly = es(t, 0.3, 0.6, ease.in);
      hangAt(B.el, 800, 110 - fly * 1100, T, 0.8, 0.6);
      pose(B.fold, { sy: 1 - shut * 0.7, r: -shut * 6 });
      B.king.set({ x: 0, y: 0, s: 1, armF: 90, armB: 40, head: -6 });
      B.bowed.forEach((b) => b.set({ x: 0, y: 0, s: 1, lean: 24, head: 20, armF: 70 }));
      B.guards.forEach((g) => g.set({ x: 0, y: 0, s: 1, armF: 90, armB: 10 }));

      const listen = es(t, 0.1, 0.4);
      const open = es(t, 4.05, 4.35);
      sitters.forEach((m) => {
        const drink = (m.k === 'james' || m.k === 'jamesA') ? es(t, 1.5 + (m.k === 'jamesA' ? 0.2 : 0), 1.6 + (m.k === 'jamesA' ? 0.2 : 0)) : 0;
        m.p.set({ x: m.x, y: m.y, s: 0.9 + (m.y - GY) / 600, flip: m.x > JX, armF: 20 + (m.k === 'james' || m.k === 'jamesA' ? 40 : 0) + drink * 10 + open * (m.i % 2 ? 60 : 20), armB: open * (m.i % 3 === 0 ? 100 : 0), head: -listen * 6 + es(t, 3.05, 3.3) * (m.x < JX ? -4 : 4) - open * 10, blink: blinkAt(T, m.seed) });
      });

      /* v26b — John goes round pouring */
      const JK = [[1.05, 880], [1.4, 960], [1.55, 960], [1.75, 1040], [1.9, 1040], [2.2, 900]].map(([k, x]) => [k, SQ(x)]);
      let jx = JK[0][1];
      for (let i = 1; i < JK.length; i++) if (t >= JK[i - 1][0]) jx = lerp(JK[i - 1][1], JK[i][1], es(t, JK[i - 1][0], JK[i][0], (u) => u));
      const pour = Math.max(bump(t, 1.4, 1.58), bump(t, 1.75, 1.93));
      const jWalk = (t > 1.05 && t < 1.4) || (t > 1.55 && t < 1.75) || (t > 1.9 && t < 2.2);
      john.set({ x: jx, y: 762, s: 0.98, flip: t > 1.9, walk: jWalk ? jx * 0.06 : undefined, armF: 24 + pour * 50, head: pour * 10, blink: blinkAt(T, 2) });

      /* v27 — Peter kneels with a basin at Andrew's feet; v28a — Jesus kneels before Peter */
      const pk = es(t, 2.05, 2.12) * (1 - es(t, 3.05, 3.12));
      const wash = t > 2.1 && t < 3.05 ? Math.abs(Math.sin((t - 2.1) * 12)) : 0;
      peterSit.set({ x: 660, y: 718, s: 0.92, flip: t > 3, o: 1 - pk, armF: 20 + es(t, 3.2, 3.4) * 60 * (1 - open), armB: es(t, 3.2, 3.4) * 90 * (1 - open) + open * 60, head: -es(t, 3.2, 3.4) * 8, blink: blinkAt(T, 1) });
      peterKneel.set({ x: 646, y: 722, s: 0.92, flip: true, o: pk, armF: 60 + wash * 20, armB: 40, head: 14, lean: 6, blink: blinkAt(T, 1) });
      pose(basin1, { x: 606, y: 726, o: es(t, 2.08, 2.16) * (1 - es(t, 3.0, 3.1)) });
      const jk = es(t, 3.08, 3.14) * (1 - es(t, 3.98, 4.04));
      jStand.set({ x: JX, y: GY - 8, s: 1.02, o: 1 - jk, head: -open * 10 + Math.sin(t * 22) * 5 * bump(t, 0.35, 0.95), armF: 20 + bump(t, 0.05, 0.9) * 70 + bump(t, 1.05, 1.9) * 40 + open * 90, armB: bump(t, 0.05, 0.9) * 40 + open * 140, blink: blinkAt(T) });
      jKneel.set({ x: 734, y: 722, s: 0.98, flip: true, o: jk, armF: 60 + (t > 3.2 ? Math.abs(Math.sin((t - 3.2) * 12)) * 16 : 0), armB: 30, head: 12, blink: blinkAt(T, 1) });
      pose(basin2, { x: 694, y: 728, o: es(t, 3.1, 3.2) * (1 - es(t, 3.96, 4.04)) });
      pose(serveGlow, { x: 700, y: 640, s: 0.8 + es(t, 3.3, 3.8) * 0.3, o: Math.max(pk * 0.3, jk * 0.8) });

      /* v28b — a ransom for many: light pours out, the chains break */
      pose(burst, { x: JX, y: GY - 170, s: 0.3 + open * 0.8, r: t * 5, o: open * 0.55 });
      groups.forEach((g, gi) => {
        const show = es(t, 3.9, 4.15);
        const brk = es(t, 4.35 + gi * 0.06, 4.45 + gi * 0.06);
        g.a.set({ x: g.x0, y: MANY_Y, o: show * (1 - brk) });
        g.b.set({ x: g.x0, y: MANY_Y, o: show * brk });
        g.links.forEach((l, i) => {
          const fall = es(t, 4.4 + gi * 0.06 + (i % 3) * 0.02, 4.62 + gi * 0.06 + (i % 3) * 0.02, ease.in);
          pose(l, { x: g.x0 + i * 56 + (gi === 0 ? -16 : 16) + (i % 2 ? 6 : -6) * fall, y: MANY_Y + g.hy + fall * 60, r: fall * (i % 2 ? 40 : -40), o: show * (1 - fall) });
        });
      });

      S.cam.z = 1.04 - es(t, 3.9, 4.3) * 0.1;
      S.cam.y = -es(t, 3.9, 4.3) * 50;
      S.cam.x = -es(t, 1.9, 2.3) * 20 * (1 - es(t, 3.9, 4.3)) + es(t, 1.0, 1.4) * 20 * (1 - es(t, 1.9, 2.3));
    };
  },
};
