// Łk 10,8–9 — a town that receives them. The two come in through the arched gate into the square, and the people
// come out of their doors to meet them, hands raised in welcome. "Eat what is set before you": a woman brings a
// platter of bread and fish, a man pours from his jar, and the two take and eat. "Heal the sick who are there": a
// lame man with a crutch and a blind woman are brought; the elder lays his hand on the man — the crutch falls and he
// stands; the young one touches the woman's eyes — they open. "And tell them: the kingdom of God has come near to
// you": the two turn and point back through the gate — and out on the road beyond it, in a spreading light, He
// Himself is coming; the light pours in through the gate over the whole square.
import { C, person, CAST, blinkAt, pose, lerp, sheet, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { squareSet, GATE, ROADIN, along, barefoot, glow, lightFall, stillGroup, folk, loaf, jug, cup, crutch, sparkle, kf, moving, handAt, headAt, DAY, SENT_A, SENT_B, es, ease, bump, seg, PI } from './lib.js';

const GY = 724;
const AX = 700, BX = 890;         // where the two stand in the square
const LAME = { robe: C.tealRobe, hairStyle: 'bald', hair: C.greyHair, beard: 'full', beardColor: C.greyHair, skin: C.skin2, belt: C.rope };
const BLINDW = { robe: C.mauve, hairStyle: 'veil', veil: C.stone, veil2: C.stone2, hair: C.hair, skin: C.skin3, beard: 'none', belt: C.clay };
const PLATTER = { robe: C.roseRobe, hairStyle: 'veil', veil: C.cream, veil2: C.linen2, hair: C.hair2, skin: C.skin2, beard: 'none', belt: C.ochre };
const POURER = { robe: C.wheatRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin4, belt: C.leather };

export default {
  id: 'lk10-welcome',
  beats: [
    { v: 8 },
    { v: 9, text: 'uzdrawiajcie chorych, którzy tam są,' },
    { v: 9, cont: true, text: 'i mówcie im: Przybliżyło się do was królestwo Boże.' },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const V = squareSet(S, { skyCols: DAY, GY });
    const c = S.c;
    const pc = makeCutter('lk10-welcome-people');

    /* beyond the gate: the light and He Himself on the road */
    const beamL = V.beyond;
    const far = beamL.add(`<g>${glow(160, 1)}</g>`);
    const jesusFar = S.puppet(beamL.add(person(c, { ...CAST.jesus })));
    const inLight = S.layer({ par: 0.38, sh: 1, flat: true });
    const spill = inLight.add(`<g><path d="${c.poly([[GATE.X - 70, GATE.B - 40], [GATE.X + 70, GATE.B - 40], [GATE.X + 420, GATE.B + 260], [GATE.X - 420, GATE.B + 260]])}" fill="#fff3cf" opacity=".5"/>${glow(260, 0.8)}</g>`);

    /* the townsfolk: calm and welcoming twins (still sprites), on both sides of the square */
    const crowdL = S.layer({ par: 0.4, sh: 4 });
    const GROUPS = [[300, 706, false], [470, 714, false], [1130, 714, true], [1300, 706, true]].map(([x, y, flip], i) => {
      const mem = [0, 1, 2].map((k) => ({ x: (k - 1) * 46 + pc.rr(-6, 6), y: (k % 2) * 10, s: 0.9, flip, o: folk(pc) }));
      const calm = crowdL.sprite(stillGroup(pc, mem.map((m) => ({ ...m, armF: 14, armB: 6 }))), x, y);
      const warm = crowdL.sprite(stillGroup(pc, mem.map((m, k) => ({ ...m, armF: 60 + k * 20, armB: 120 + k * 10, head: -8 }))), x, y);
      return { i, x, y, flip, calm, warm };
    });

    /* the people who serve and the sick */
    const P = S.layer({ par: 0.42, sh: 5 });
    const server = S.puppet(P.add(person(c, { ...PLATTER, holdF: `<g transform="rotate(70)"><path d="${c.cut([[-32, 0], [32, 0], [26, 7], [-26, 7]], 0.3, 4)}" fill="${C.pot}"/><g transform="translate(-12 -2)">${loaf(c, 12)}</g><g transform="translate(14 -2)"><path d="${c.cut([[-14, 0], [-4, -7], [10, -6], [16, 0], [10, 6], [-4, 6]], 0.2, 3)}" fill="${C.lake3}"/></g></g>` })));
    const pourer = S.puppet(P.add(person(c, { ...POURER, holdF: `<g transform="rotate(100) translate(0 -10) scale(.6)">${jug(c, C.clay)}</g>` })));
    const lame = S.puppet(P.add(person(c, { ...LAME, pose: 'sit', holdF: `<g transform="translate(0 -4) scale(.8)">${crutch(c)}</g>` })));
    const lameUp = S.puppet(P.add(person(c, LAME)));
    const fallen = P.add(`<g>${crutch(c)}</g>`);
    const blind = S.puppet(P.add(person(c, { ...BLINDW, pose: 'kneel', eyes: 'closed' })));
    const seeing = S.puppet(P.add(person(c, BLINDW)));

    /* the two */
    const A = S.puppet(P.add(barefoot(person(c, SENT_A), SENT_A.skin)));
    const B = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));
    const bread = P.add(`<g>${loaf(c, 10)}</g>`);
    const cupB = P.add(`<g>${cup(c, C.pot)}</g>`);
    const fx = S.layer({ par: 0.44, sh: 4 });
    const heals = [0, 1].map(() => fx.add(`<g>${sparkle(c, 16)}</g>`));
    const pops = GROUPS.map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      V.update(T);

      /* v8 — in through the gate; the town comes to meet them; they eat what is set before them */
      const inK = [[0, 0], [0.34, 1]];
      const k = kf(t, inK, (x) => x);
      const walking = moving(t, inK, 0.01);
      const ax = lerp(GATE.X - 18, AX, k), bx = lerp(GATE.X + 18, BX, k), y = lerp(GATE.B + 4, GY, k), s = lerp(0.66, 0.98, k);
      const heal = es(t, 1.2, 1.35) * (1 - es(t, 1.6, 1.75));
      const point = es(t, 2.1, 2.3);
      const eatA = bump(t, 0.55, 0.9);
      A.set({ x: ax, y, s, flip: t < 2.05, walk: walking ? ax * 0.05 : undefined, armF: 14 + eatA * 70 + heal * 60 + point * 70, armB: 10 + point * 30, head: -eatA * 4 + heal * 10, blink: blinkAt(T, 2) });
      const drinkB = bump(t, 0.62, 0.95);
      B.set({ x: bx, y: y + 4, s: s * 0.97, flip: t >= 2.05, walk: walking ? bx * 0.05 + 1 : undefined, armF: 14 + drinkB * 90 + es(t, 1.35, 1.5) * (1 - es(t, 1.7, 1.85)) * 70 + point * 40, armB: 10, head: -drinkB * 10 + es(t, 1.35, 1.5) * 10 * (1 - es(t, 1.7, 1.85)), blink: blinkAt(T, 3) });
      GROUPS.forEach((g) => {
        const come = es(t, 0.12 + g.i * 0.04, 0.4 + g.i * 0.04);
        const x = g.x + (g.flip ? 1 : -1) * (1 - come) * 120;
        const joy = Math.max(es(t, 0.2, 0.3) * (1 - es(t, 0.9, 1.0)), es(t, 2.3, 2.45));
        g.calm.set({ x, y: g.y, s: 1, o: 1 - joy });
        g.warm.set({ x, y: g.y, s: 1, o: joy });
        const pk = bump(t, 2.4 + g.i * 0.06, 2.8 + g.i * 0.06);
        pose(pops[g.i], { x: g.x, y: g.y - 180, s: pk, r: T * 40, o: pk });
      });
      const sK = [[0.3, 560], [0.5, 610], [1.0, 610], [1.1, 470]];
      const sx = kf(t, sK);
      server.set({ x: sx, y: GY + 8, s: 0.92, flip: false, walk: moving(t, sK) ? sx * 0.05 : undefined, armF: 70 * (1 - es(t, 1.0, 1.05)) + 10, armB: 10, head: 6, o: seg(t, 0.28, 0.32) * (1 - seg(t, 1.08, 1.12)), blink: blinkAt(T, 5) });
      const pK = [[0.36, 1080], [0.56, 990], [1.0, 990], [1.12, 1140]];
      const px = kf(t, pK);
      pourer.set({ x: px, y: GY + 10, s: 0.94, flip: true, walk: moving(t, pK) ? px * 0.05 : undefined, armF: 10 + bump(t, 0.56, 0.9) * 90, armB: 10, head: 6, o: seg(t, 0.34, 0.38) * (1 - seg(t, 1.1, 1.14)), blink: blinkAt(T, 6) });
      const [ahx, ahy] = handAt(AX, GY, 0.98, true, 14 + eatA * 70);
      pose(bread, { x: ahx + 2, y: ahy + 2, s: 0.9, o: es(t, 0.5, 0.54) * (1 - es(t, 0.92, 0.96)) });
      const [bhx, bhy] = handAt(BX, GY + 4, 0.95, false, 14 + drinkB * 90);
      pose(cupB, { x: bhx, y: bhy + 10, s: 0.9, r: -drinkB * 40, o: es(t, 0.6, 0.64) * (1 - es(t, 0.96, 1.0)) });

      /* v9a — the sick are brought and healed */
      const bring = es(t, 1.0, 1.2);
      const up1 = es(t, 1.36, 1.42), up2 = es(t, 1.56, 1.62);
      lame.set({ x: 560 - (1 - bring) * 200, y: GY + 16, s: 0.94, flip: false, o: seg(t, 0.98, 1.02) * (1 - up1), armF: 40, armB: 10, head: 4, blink: blinkAt(T, 7) });
      lameUp.set({ x: 560, y: GY + 16, s: 0.94, flip: false, o: up1 * (1 - es(t, 2.9, 3)), armF: 60 + es(t, 1.42, 1.6) * 60, armB: 30 + es(t, 1.42, 1.6) * 120, head: -10, blink: blinkAt(T, 7) });
      const cf = es(t, 1.36, 1.55, ease.in);
      const [cx0, cy0] = handAt(560, GY + 16, 0.94, false, 40, 'sit');
      pose(fallen, { x: cx0 + cf * 60, y: lerp(cy0 - 4, GY + 6, cf), r: cf * 84, s: 0.8, o: es(t, 1.36, 1.37) * (1 - es(t, 2.0, 2.2)) });
      blind.set({ x: 1040 + (1 - bring) * 200, y: GY + 16, s: 0.94, flip: true, o: seg(t, 0.98, 1.02) * (1 - up2), armF: 70, armB: 20, head: -6, blink: 0 });
      seeing.set({ x: 1040, y: GY + 16, s: 0.94, flip: true, o: up2, armF: 80 + es(t, 1.62, 1.8) * 50, armB: 40 + es(t, 1.62, 1.8) * 100, head: -8, blink: blinkAt(T, 8) });
      heals.forEach((h, i) => { const kk = bump(t, 1.3 + i * 0.2, 1.7 + i * 0.2); const [hx, hy] = headAt(i ? 1040 : 560, GY + 16, 0.94, !!i, i ? 'kneel' : 'sit'); pose(h, { x: hx, y: hy - 30, s: kk, r: T * 40, o: kk }); });

      /* v9b — the kingdom has come near: He is coming up the road, the light pours in */
      const come = es(t, 2.1, 2.9, (x) => x);
      const [jx, jy] = along(ROADIN, 1 - come * 0.8);
      const js = lerp(0.26, 0.5, come);
      jesusFar.set({ x: jx, y: jy, s: js, flip: true, walk: come > 0 && come < 1 ? come * 30 : undefined, armF: 30, armB: 20, blink: blinkAt(T), o: seg(t, 2.08, 2.14) });
      pose(far, { x: jx, y: jy - 110 * js, s: js * 1.6, o: seg(t, 2.05, 2.2) });
      pose(spill, { o: es(t, 2.2, 2.6) * 0.9 });

      S.cam.x = kf(t, [[0, 0], [0.4, 0], [1.0, 0], [1.3, 0], [2, 0], [3, 0]]);
      S.cam.y = kf(t, [[0, 0], [0.4, 30], [1.0, 30], [2.0, 30], [2.3, -20], [3, -20]]);
      S.cam.z = kf(t, [[0, 1.0], [0.4, 1.06], [1.0, 1.06], [2.0, 1.06], [2.3, 1.02], [3, 1.02]]);
    };
  },
};
