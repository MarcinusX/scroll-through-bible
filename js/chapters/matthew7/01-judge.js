// Mt 7,1–2 — the curtains open again on the mountainside over the lake: Jesus sits on the knoll and teaches, the
// crowd sits on the meadow. "Do not judge": in the front row a man jumps up and points at his neighbour — a big paper
// hand comes down and points with him, then turns round and points at him. "With the judgment you judge": he throws
// a dark stone into the scale over his neighbour, and the scale turns round, stone and all, to hang over him.
// "With the measure you measure": he doles out three grains from a tiny scoop, and the same tiny scoop comes down to
// him; a woman on the other side gives away a full basket, and a basket running over comes down to her.
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { mountSet, manOf, womanOf, pointHand, scalesParts, guiltStone, scoop, heapBasket, grain, openBowl, hand, headAt, hungWord, kf, tr, PI } from './lib.js';

const JX = 800;
const FY = 776;                    // the front row sits here

export default {
  id: 'mt7-judge',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'Bo takim sądem, jakim sądzicie, i was osądzą;' },
    { v: 2, cont: true, text: 'i taką miarą, jaką wy mierzycie, wam odmierzą.' },
  ],
  cam: { x: [-60, 30], y: [-20, 110], z: [1, 1.26] },
  build(S) {
    const c = S.c;
    const H = mountSet(S);
    const JY = H.JY;


    /* the front row */
    const front = S.layer({ par: 0.6, sh: 5 });
    const fr = front.add(`<g>${sheet().p(c.ridge(c.wave(FY - 14, [4, 2], [500, 160]), -900, 2500, 1700, 12, 1), mix(C.sage2, C.hillNear, 0.3)).out()}</g>`);
    // quiet listeners at the edges (one still cut-out each side)
    const still = (x, flip, o) => `<g transform="translate(${x} ${FY}) scale(${flip ? -0.98 : 0.98} .98)">${person(c, { ...o, pose: 'sit' })}</g>`;
    front.add(`<g>${still(330, false, womanOf(c)) + still(1290, true, manOf(c)) + still(1400, true, womanOf(c))}</g>`);
    const AO = manOf(c, { robe: C.ochreRobe, mantle: C.plumRobe, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin2, belt: C.leather });
    const A = { sit: S.puppet(front.add(person(c, { ...AO, pose: 'sit' }))), st: S.puppet(front.add(person(c, AO))) };
    const N = S.puppet(front.add(person(c, { ...manOf(c, { robe: C.stone2, mantle: null, hairStyle: 'short', beard: 'short', skin: C.skin3 }), pose: 'sit' })));
    const WO = womanOf(c, { robe: C.roseRobe, mantle: C.wheatRobe, veil: C.skyVeil });
    const W = { sit: S.puppet(front.add(person(c, { ...WO, pose: 'sit' }))), st: S.puppet(front.add(person(c, WO))) };
    const P = S.puppet(front.add(person(c, { ...manOf(c, { robe: mix(C.stone2, C.sand, 0.4), mantle: null, hairStyle: 'short', beard: 'full', beardColor: C.greyHair, hair: C.greyHair, skin: C.skin4, belt: C.rope }), pose: 'sit' })));

    /* props in the hands */
    const props = S.layer({ par: 0.6, sh: 4 });
    const stoneEl = props.add(`<g>${guiltStone(c, 16, true)}</g>`);
    const scoopA = props.add(`<g>${scoop(c, 28)}</g>`);
    const bowlN = props.add(`<g>${openBowl(c, 44)}</g>`);
    const basketW = props.add(`<g>${heapBasket(c, 70)}</g>`);

    /* from the flies: the pointing hand, the scale, the scoop and the basket that come back */
    const fly = S.layer({ par: 0.6, sh: 6 });
    const handEl = hanging(fly, `<g transform="translate(-10 0)">${pointHand(c, { cuff: C.plumRobe })}</g>`, { x: 0, y: 0, len: 900 });
    const handObj = handEl.querySelector('.obj');
    const SC = scalesParts(c, { arm: 88, drop: 70, col: mix(C.ochre, C.wood3, 0.3) });
    const sFrame = fly.add(`<g>${SC.frame}</g>`), sBeam = fly.add(`<g>${SC.beam}</g>`), panL = fly.add(`<g>${SC.pan}</g>`), panR = fly.add(`<g>${SC.pan}</g>`);
    const scoopBack = hanging(fly, `<g transform="translate(0 30) scale(1.5)">${scoop(c, 28)}</g>`, { x: 0, y: 0, len: 900 });
    const scoopObj = scoopBack.querySelector('.obj');
    const basketBack = hanging(fly, `<g transform="translate(0 60)">${heapBasket(c, 100)}</g>`, { x: 0, y: 0, len: 900 });
    const bObj = basketBack.querySelector('.obj');
    const word = fly.add(hungWord(c, tr('Nie sądźcie', 'Do not judge'), { size: 26 }));

    /* grains (no shadows) */
    const fx = S.layer({ par: 0.6, flat: true });
    const g3 = [0, 1, 2].map((i) => fx.add(`<g>${grain(c, 4.6)}</g>`));
    const g3b = [0, 1, 2].map((i) => fx.add(`<g>${grain(c, 5)}</g>`));
    const spill = Array.from({ length: 16 }, (_, i) => ({ i, dx: (i % 2 ? 1 : -1) * c.rr(20, 60), ph: c.rr(0, 1), el: fx.add(`<g>${grain(c, 4.6)}</g>`) }));

    const cur = curtains(S);

    const AX = 536, NX = 664, WX = 990, PX = 1112;
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* Jesus teaches */
      const talk = es(t, 0.9, 1.2);
      H.pose(t, T, { armF: 20 + talk * 16 + bump(t, 1.5, 1.95) * 20 + bump(t, 2.5, 2.95) * 20 + bump(t, 3.5, 3.95) * 20, armB: 10 + talk * 30 + bump(t, 1.0, 1.7) * 90, head: -talk * 4, blink: blinkAt(T, 1) });
      H.listen(T, (d) => ({ blink: blinkAt(T, d.seed), head: (d.flip ? 3 : -3) + (d.x < 700 ? es(t, 1.2, 1.4) * (1 - es(t, 3.9, 4)) * 6 : 0) }));

      /* v1 — he jumps up and points; the big hand points with him … and turns round to point at him */
      const up = seg(t, 1.05, 1.12);
      const point = es(t, 1.1, 1.3) * (1 - es(t, 1.92, 2.06));
      const recoil = es(t, 1.62, 1.8);
      // v2a: throws the stone; v2b: doles out grain, then holds out his hands
      const pick = es(t, 2.08, 2.2), thr = es(t, 2.22, 2.4);
      const dole = es(t, 3.05, 3.2) * (1 - es(t, 3.45, 3.55));
      const cup = es(t, 3.5, 3.62);
      const shame = es(t, 2.6, 2.85) * (1 - es(t, 3.0, 3.1)) + es(t, 3.72, 3.9);
      const aArmF = 90 * point + pick * (1 - thr) * 40 + thr * 100 * (1 - es(t, 2.45, 2.6)) + dole * 70 + cup * 55;
      const aHead = -point * 4 + recoil * 8 * (1 - es(t, 2.0, 2.1)) + shame * 10;
      A.sit.set({ x: AX, y: FY, s: 1, o: 1 - up, armF: 20, blink: blinkAt(T, 2) });
      A.st.set({ x: AX, y: FY, s: 1, o: up, armF: aArmF, armB: 10 + point * 20 + cup * 50, head: aHead, lean: -recoil * 4 * (1 - es(t, 2.0, 2.1)) - shame * 3, blink: blinkAt(T, 2) });
      const nHold = es(t, 3.0, 3.12);
      N.set({ x: NX, y: FY + 4, s: 0.98, flip: true, armF: 14 + nHold * 60, armB: 10, head: 10 - es(t, 1.6, 1.9) * 8 - nHold * 6, blink: blinkAt(T, 4) });

      const hk = es(t, 1.28, 1.48, ease.out) * (1 - es(t, 2.0, 2.15, ease.in));
      const turn = Math.cos(es(t, 1.55, 1.78) * PI);
      pose(handEl, { x: AX + 52, y: lerp(-420, 468, hk), r: Math.sin(T * 0.9) * 1.2, o: hk > 0.01 ? 1 : 0 });
      pose(handObj, { sx: turn, r: lerp(64, -70, es(t, 1.55, 1.78)) });
      const wk = es(t, 1.15, 1.4, ease.out) * (1 - es(t, 1.9, 2.05));
      pose(word, { x: JX, y: lerp(-500, 200, wk), r: Math.sin(T * 0.8) * 1.2, o: wk > 0.01 ? 1 : 0 });

      /* v2a — the scale: the stone goes into the pan over the neighbour, then the scale turns round */
      const bk = es(t, 2.05, 2.28, ease.out) * (1 - es(t, 3.0, 3.15, ease.in));
      const bx = AX + 60, by = lerp(-500, 440, bk);
      const heavy = es(t, 2.4, 2.52, ease.back);
      const flipK = es(t, 2.58, 2.86);
      const dir = Math.cos(flipK * PI);
      const a = heavy * 16, r = (a * PI) / 180;
      const bo = bk > 0.01 ? 1 : 0;
      pose(sFrame, { x: bx, y: by, o: bo });
      pose(sBeam, { x: bx, y: by, r: a, sx: dir === 0 ? 0.01 : dir, o: bo });
      const pl = [bx - Math.cos(r) * SC.arm * dir, by - Math.sin(r) * SC.arm], pr = [bx + Math.cos(r) * SC.arm * dir, by + Math.sin(r) * SC.arm];
      pose(panL, { x: pl[0], y: pl[1], sx: Math.abs(dir) < 0.05 ? 0.05 : Math.abs(dir), o: bo });
      pose(panR, { x: pr[0], y: pr[1], sx: Math.abs(dir) < 0.05 ? 0.05 : Math.abs(dir), o: bo });
      // the stone: in his hand, thrown in an arc, then riding in the pan
      const [hx, hy] = hand(AX, FY, 1, false, aArmF);
      const inPan = seg(t, 2.4, 2.41);
      const arcX = lerp(hx, pr[0], thr), arcY = lerp(hy, pr[1] + SC.drop - 2, thr) - Math.sin(thr * PI) * 80;
      pose(stoneEl, { x: inPan ? pr[0] : t < 2.22 ? hx : arcX, y: inPan ? pr[1] + SC.drop - 2 : t < 2.22 ? hy + 8 : arcY, sx: inPan ? Math.max(0.05, Math.abs(dir)) : 1, o: pick * bo });

      /* v2b — the tiny scoop and three grains; the same scoop comes back to him */
      const hasScoop = seg(t, 3.0, 3.05) * (1 - seg(t, 3.5, 3.55));
      const [sx, sy] = hand(AX, FY, 1, false, aArmF);
      pose(scoopA, { x: sx + 4, y: sy + 6, r: dole * 70, o: hasScoop });
      const [nx, ny] = hand(NX, FY + 4, 0.98, true, 14 + nHold * 60, 0, 62);
      pose(bowlN, { x: nx, y: ny + 12, o: nHold * (1 - es(t, 3.95, 4.0)) });
      g3.forEach((g, i) => {
        const k = seg(t, 3.18 + i * 0.05, 3.34 + i * 0.05);
        pose(g, { x: lerp(sx + 14, nx + (i - 1) * 7, k), y: lerp(sy - 4, ny + 2, k * k), r: k * 200, o: k > 0 ? 1 : 0 });
      });
      const sb = es(t, 3.35, 3.55, ease.out) * (1 - es(t, 3.95, 4.05));
      const tipB = es(t, 3.55, 3.68);
      pose(scoopBack, { x: AX + 34, y: lerp(-500, 500, sb), r: Math.sin(T * 0.9) * 1.5, o: sb > 0.01 ? 1 : 0 });
      pose(scoopObj, { r: tipB * 60 });
      const [cx2, cy2] = hand(AX, FY, 1, false, aArmF);
      g3b.forEach((g, i) => {
        const k = seg(t, 3.64 + i * 0.05, 3.8 + i * 0.05);
        pose(g, { x: lerp(AX + 60, cx2 + (i - 1) * 6, k), y: lerp(536, cy2 - 4, k * k), r: k * 200, o: k > 0 ? 1 - es(t, 3.95, 4.05) : 0 });
      });

      /* the woman gives a full basket away; a basket running over comes down to her */
      const wUp = seg(t, 3.02, 3.08);
      const give = es(t, 3.08, 3.32);
      const recv = es(t, 3.6, 3.72);
      W.sit.set({ x: WX, y: FY, s: 0.98, o: 1 - wUp, armF: 30, blink: blinkAt(T, 6) });
      W.st.set({ x: WX, y: FY, s: 0.98, o: wUp, armF: 40 + give * 40 * (1 - es(t, 3.4, 3.5)) + recv * 70, armB: 10 + recv * 110, head: -recv * 12, blink: blinkAt(T, 6) });
      P.set({ x: PX, y: FY + 2, s: 0.96, flip: true, armF: 20 + give * 50, armB: 10 + give * 20, head: -give * 6 + es(t, 3.35, 3.5) * 10, blink: blinkAt(T, 8) });
      const [wx, wy] = hand(WX, FY, 0.98, false, 80);
      const [px, py] = hand(PX, FY + 2, 0.96, true, 70, 0, 62);
      pose(basketW, { x: lerp(wx + 10, px - 4, give), y: lerp(wy + 26, py + 22, give) - Math.sin(give * PI) * 20, o: seg(t, 2.98, 3.04) * (1 - es(t, 3.95, 4.05)) });
      const bb = es(t, 3.38, 3.6, ease.out) * (1 - es(t, 3.95, 4.05));
      pose(basketBack, { x: WX + 34, y: lerp(-500, 470, bb), r: Math.sin(T * 0.9 + 1) * 1.5, o: bb > 0.01 ? 1 : 0 });
      pose(bObj, { r: -es(t, 3.58, 3.7) * 16 });
      spill.forEach((g) => {
        const k = time ? (T * 0.7 + g.ph) % 1 : g.ph;
        const on = es(t, 3.64, 3.72) * (1 - es(t, 3.95, 4.05));
        pose(g.el, { x: WX + 30 + g.dx * (0.4 + k), y: 520 + k * k * 220, r: k * 300, o: on * (k < 0.9 ? 1 : 0) });
      });

      S.cam.z = 1 + es(t, 0.8, 1.3) * 0.24;
      S.cam.y = es(t, 0.8, 1.3) * 100;
      S.cam.x = -es(t, 1.0, 1.4) * 50 * (1 - es(t, 2.9, 3.3));
    };
  },
};
