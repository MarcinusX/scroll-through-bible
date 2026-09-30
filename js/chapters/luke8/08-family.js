// Łk 8,19–21 — a courtyard packed with people round Jesus. Outside the low wall His mother and His brothers arrive
// and cannot get near for the crowd: Mary rises on her toes at the gateway, the brothers try to push through, the
// people in the gate do not move. A man by the gate turns and tells Him: "Your mother and your brothers are standing
// outside, wanting to see you." He stretches out His hand: "My mother and my brothers are those who hear the word of
// God and do it" — and as He says it, the hearers are doing it: a man breaks his bread for a beggar, a woman gives an
// old man water; warm light rests on them, and it reaches out over the wall to Mary, who heard the word and did it.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, olive, cypress, sun, cloud, grass } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { MARY, BROTHERS, knot, knotUp, still, bubble, headAt, hand, heart, sparkle, loaf, waterJar, manO, womanO, GOLDEN, PI, tr } from './lib.js';

const JX = 800, JY = 650, WALL = 600, GATE = [440, 540];

export default {
  id: 'lk8-family',
  beats: [
    { v: 19 },
    { v: 20 },
    { v: 21 },
  ],
  cam: { x: [-90, 30], y: [-30, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, ['#cfd9d3', '#f1e2c4', '#f6dfbd']);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1230, y: 170, len: 800 });
    const cl = hanging(hangL, cloud(c, 170, C.cream, C.peach), { x: 460, y: 150, len: 800 });
    S.layer({ par: 0.1, sh: 2 }).add(hillsWith(c, { y: 460, amps: [16, 7, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.12), trees: 14, treeColor: C.sage2, treeH: 18 }).markup);

    /* outside the wall: the lane, a house, the family */
    const outL = S.layer({ par: 0.26, sh: 3 });
    outL.add(sheet().p(c.cut([[-900, 540], [2500, 540], [2500, 1700], [-900, 1700]], 1, 20), mix(C.sand, C.sage2, 0.3)).out() + house(c, 60, 548, 150, 110) + olive(c, 1240, 552, 0.8) + cypress(c, 1440, 548, 140) + house(c, 1060, 552, 170, 120, { stairs: false }));
    const famGlow = outL.add(`<g opacity="0"><ellipse cx="410" cy="${WALL - 60}" rx="150" ry="120" fill="url(#halo-glow)"/></g>`);
    const FAM = [
      { o: MARY, x: 415, s: 0.88 },
      { o: BROTHERS[0], x: 350, s: 0.88 },
      { o: BROTHERS[1], x: 290, s: 0.86 },
      { o: BROTHERS[2], x: 380, s: 0.82, dy: -14 },
    ].map((f, i) => ({ ...f, i, seed: c.rr(0, 9), p: S.puppet(outL.add(person(c, f.o))) }));
    // the low courtyard wall with its gateway
    const wallL = S.layer({ par: 0.3, sh: 4 });
    const ws = sheet();
    const top = WALL - 64;
    ws.p(c.cut([[-900, WALL + 4], [-900, top], [GATE[0], top], [GATE[0], WALL + 4]], 0.6, 10) + c.cut([[GATE[1], WALL + 4], [GATE[1], top], [2500, top], [2500, WALL + 4]], 0.6, 10), mix(C.plaster, C.stone, 0.4));
    let bl = '';
    for (let y = top + 18; y < WALL; y += 22) for (let x = -880 + ((y / 22) % 2) * 20; x < 2500; x += 46) if (x < GATE[0] - 30 || x > GATE[1]) bl += c.ribbon([[x, y], [x + 38, y]], 1);
    ws.x(bl, shade(C.stone, -0.15), 'opacity=".5"');
    ws.p(c.cut(c.rect(-900, top - 10, GATE[0] + 912, 12), 0.4, 10) + c.cut(c.rect(GATE[1] - 12, top - 10, 3400, 12), 0.4, 10), C.stone2);
    ws.p(c.cut(c.rect(GATE[0] - 18, top - 34, 20, WALL - top + 38), 0.4, 6) + c.cut(c.rect(GATE[1] - 2, top - 34, 20, WALL - top + 38), 0.4, 6), C.stone2);
    wallL.add(ws.out());
    /* inside: the courtyard floor */
    const G = S.layer({ par: 0.34, sh: 3 });
    G.add(sheet().p(c.cut([[-900, WALL], [2500, WALL], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.sand, C.stone, 0.45)).out() + grass(c, { x0: -600, x1: 2200, y: WALL + 6, n: 30, h: 10, color: C.moss }));
    G.add(sheet().p(c.cut(c.blob(JX, JY + 6, 90, 14, 12, 0.1), 0.6, 6), C.stone2).out());

    /* the crowd: people in the gateway (standing) and sitting all round Him */
    const crowdL = S.layer({ par: 0.38, sh: 4 });
    const gateCrowd = crowdL.sprite(knot('lk8-fam-gate', 4, { s: 0.84, spread: 30, rows: 2, flip: false }), 505, WALL + 18);
    const SEAT = [[570, 668, 'a', false, 4], [680, 700, 'b', false, 3], [930, 700, 'c', true, 3], [1060, 668, 'd', true, 4], [630, 632, 'e', false, 4], [990, 632, 'f', true, 4]];
    const seated = SEAT.map(([x, y, k, flip, n], i) => ({
      i, x, y,
      a: crowdL.sprite(knot('lk8-fam-' + k, n, { s: 0.74, spread: 42, rows: 1, flip, pose: 'sit' }), x, y),
      b: crowdL.sprite(knot('lk8-fam-' + k, n, { s: 0.74, spread: 42, rows: 1, flip, pose: 'sit', arms: [60, 100], armB: [110, 150], head: [-12, -6] }), x, y),
    }));
    const glowL = S.layer({ par: 0.4, sh: 0, flat: true });
    const lights = [[470, 690], [1130, 690], [800, 560]].map(([x, y]) => glowL.add(`<g opacity="0"><ellipse cx="${x}" cy="${y - 90}" rx="150" ry="120" fill="url(#halo-glow)"/></g>`));

    /* the act: Jesus, the man at the gate, those who do the word */
    const act = S.layer({ par: 0.4, sh: 5 });
    const teller = S.puppet(act.add(person(c, manO(c, { robe: C.ochreRobe, mantle: null, hairStyle: 'short', beard: 'short' }))));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const giver = S.puppet(act.add(person(c, { robe: C.sageRobe, hairStyle: 'short', hair: C.hair2, beard: 'full', skin: C.skin3, belt: C.leather, holdF: `<g transform="translate(0 2)">${loaf(c, 11)}</g>` })));
    const beggar = S.puppet(act.add(person(c, { robe: mix(C.stone2, C.rock2, 0.4), hairStyle: 'wrap', veil: C.stone2, hair: C.greyHair, beard: 'full', beardColor: C.greyHair, skin: C.skin3, pose: 'sit' })));
    const pourer = S.puppet(act.add(person(c, { robe: C.roseRobe, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.14), hair: C.hair2, skin: C.skin2, holdF: `<g transform="translate(0 2)">${waterJar(c)}</g>` })));
    const oldman = S.puppet(act.add(person(c, { robe: C.dustyBlue, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair, skin: C.skin2, pose: 'sit' })));
    const fx = S.layer({ par: 0.4, sh: 6 });
    const say = fx.add(`<g opacity="0">${bubble(c, [tr('Twoja Matka i bracia stoją na dworze', 'Your mother and your brothers stand outside,'), tr('i chcą się widzieć z Tobą', 'desiring to see you')], { size: 18, dir: -1 })}</g>`);
    const answer = fx.add(`<g opacity="0">${bubble(c, [tr('Moją matką i moimi braćmi są ci,', 'My mother and my brothers are these'), tr('którzy słuchają słowa Bożego', 'who hear the word of God,'), tr('i wypełniają je', 'and do it')], { size: 18, dir: -1 })}</g>`);
    const hearts = [0, 1, 2].map(() => fx.add(`<g opacity="0">${heart(c, 12)}</g>`));
    const drops = [0, 1, 2].map(() => fx.add(`<g opacity="0"><path d="${c.cut([[0, -5], [3, 0], [0, 3], [-3, 0]], 0.1, 2)}" fill="${C.lake2}"/></g>`));
    const crumb = fx.add(`<g opacity="0">${loaf(c, 9)}</g>`);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 170, T, 1, 0.6);
      swing(cl, 460 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);

      /* v19 — His mother and brothers cannot get near for the crowd */
      FAM.forEach((f) => {
        const k = es(t, 0.05 + f.i * 0.05, 0.5 + f.i * 0.05);
        const x = lerp(f.x - 420, f.x, k);
        const tip = f.i === 0 ? bump(t, 0.55, 1.0) + bump(t, 1.1, 1.5) : f.i === 1 ? bump(t, 0.6, 0.95) : 0;
        f.p.set({ x: x + (f.i === 1 ? bump(t, 0.6, 0.95) * 30 : 0), y: WALL - 18 + (f.dy || 0) - (f.i === 0 ? tip * 8 : 0), s: f.s, flip: false, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 14 + (f.i === 1 ? bump(t, 0.6, 0.95) * 70 : 0) + (f.i === 0 ? es(t, 2.6, 2.9) * 30 : 0), armB: 6 + (f.i === 0 ? es(t, 2.6, 2.9) * 40 : 0), head: f.i === 0 ? -tip * 8 - es(t, 2.5, 2.8) * 6 : -2, blink: blinkAt(T, f.seed) });
      });
      const jostle = bump(t, 0.6, 0.95);
      gateCrowd.set({ x: 505 + jostle * 8, y: WALL + 18 });

      /* v20 — word is brought to Him */
      const turn = es(t, 1.05, 1.2);
      teller.set({ x: 600, y: WALL + 64, s: 0.92, flip: turn < 0.5, armF: 20 + es(t, 1.15, 1.35) * 60 * (1 - es(t, 1.95, 2.1)), armB: 10 + es(t, 1.15, 1.35) * 90 * (1 - es(t, 1.95, 2.1)), head: -4, blink: blinkAt(T, 7) });
      const sb = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 1.95, 2.05));
      const [thx, thy] = headAt(600, WALL + 64, 0.92, false);
      pose(say, { x: thx + 10, y: thy - 30, s: sb, o: sb > 0.02 ? 1 : 0 });

      /* v21 — those who hear the word of God and do it */
      const reachOut = es(t, 2.05, 2.3);
      jesus.set({ x: JX, y: JY, s: 1.05, flip: false, armF: 20 + bump(t, 0.1, 0.9) * 40 + reachOut * 70, armB: 10 + reachOut * 30, head: turn * 6 - reachOut * 4, blink: blinkAt(T) });
      const ab = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 2.95, 3.0) * 0);
      const [jhx, jhy] = headAt(JX, JY, 1.05, false);
      pose(answer, { x: jhx - 40, y: jhy - 44, s: ab, o: ab > 0.02 ? 1 : 0 });
      seated.forEach((g) => { const k = es(t, 2.35 + g.i * 0.04, 2.42 + g.i * 0.04); g.a.set({ x: g.x, y: g.y, o: 1 - k }); g.b.set({ x: g.x, y: g.y, o: k }); });
      // doing it: bread for the beggar, water for the old man
      const give = es(t, 2.3, 2.55);
      giver.set({ x: 1180, y: 736, s: 1.0, flip: true, armF: 20 + give * 60, armB: 10, head: 6 * give, blink: blinkAt(T, 2) });
      beggar.set({ x: 1100, y: 740, s: 0.96, flip: false, armF: 30 + give * 50, armB: 20, head: -give * 6, blink: blinkAt(T, 5) });
      const [gx, gy] = hand(1180, 736, 1.0, true, 20 + give * 60);
      pose(crumb, { x: lerp(gx, gx - 30, give), y: gy + give * 4, o: es(t, 2.5, 2.55) });
      const pour = es(t, 2.35, 2.6);
      pourer.set({ x: 420, y: 736, s: 1.0, flip: false, armF: 20 + pour * 70, armB: 10, head: 6 * pour, lean: pour * 6, blink: blinkAt(T, 6) });
      oldman.set({ x: 500, y: 740, s: 0.96, flip: true, armF: 30 + pour * 40, armB: 10, head: -pour * 8, blink: blinkAt(T, 8) });
      const [px2, py2] = hand(420, 736, 1.0, false, 20 + pour * 70);
      drops.forEach((d, i) => { const k = ((T ? T * 1.6 : 0) + i / 3) % 1; pose(d, { x: px2 + 10 + k * 14, y: py2 + 24 + k * 30, o: pour > 0.9 ? Math.sin(k * PI) : 0 }); });
      lights.forEach((l, i) => pose(l, { o: es(t, 2.3 + i * 0.1, 2.6 + i * 0.1) * 0.9 }));
      pose(famGlow, { o: es(t, 2.55, 2.85) * 0.9 });
      hearts.forEach((h, i) => { const k = es(t, 2.5 + i * 0.1, 2.7 + i * 0.1, ease.back); pose(h, { x: [470, 1140, 420][i], y: [560, 560, 400][i] - k * 10, s: k, o: k > 0.02 ? 1 : 0 }); });

      S.cam.x = -es(t, 0.0, 0.6) * 60 + es(t, 1.9, 2.3) * 60;
      S.cam.z = 1.08 + es(t, 0.0, 0.6) * 0.04 - es(t, 1.9, 2.3) * 0.06;
      S.cam.y = 10;
    };
  },
};
