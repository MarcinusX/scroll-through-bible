// Mt 22,3–6 — the town of the invited, a painted flat. Two servants in the king's livery come with sealed
// invitations; the invited open their doors, wave them away and shut them again. Other servants come, and the
// message comes down with them as a little painted picture: the table laid, the roasts, the wine — all is ready.
// "Come to the feast!" But one shoulders his hoe and goes off to his field, another goes to his stall and counts
// his money; and the rest seize the servants — told with restraint: a starburst for a blow, a white cloth
// lowered over each of the fallen, and the afternoon light turning.
import { C, person, blinkAt, pose, lerp, hanging } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  townSet, TOWN, SERVANTS, INVITED, heldInvite, hoeHeld, moneyBagHeld, moodPuppet, drapeCloth, burst, bubble, vignette, feastTable, roastPlatter,
  wineJar, loaf, garland, popBubble, kf, moving, tr, sheet, mix,
} from './lib.js';

const DX = TOWN.DOORS, STEP = TOWN.STEP, ROAD = TOWN.ROAD + 12;
const SX = [520, 730];            // the first servants, by the first two doors
const OX = [700, 920];            // the other servants

export default {
  id: 'mt22-invited',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 3 },
    { v: 4, text: 'Posłał jeszcze raz inne sługi z poleceniem:' },
    { v: 4, cont: true, text: '"Powiedzcie zaproszonym: Oto przygotowałem moją ucztę: woły i tuczne zwierzęta pobite i wszystko jest gotowe.' },
    { v: 4, cont: true, text: 'Przyjdźcie na ucztę!"' },
    { v: 5 },
    { v: 6 },
  ],
  cam: { x: [-40, 40], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = townSet(S);

    /* the message: a little painted picture of the feast, on two strings */
    const msgL = S.layer({ par: 0.3, sh: 6 });
    const vid = S.id('feast');
    const inner = `<rect x="-160" y="10" width="320" height="160" fill="${mix(C.peach, C.cream, 0.5)}"/>`
      + `<g transform="translate(-150 34)">${garland(c, 300, 16)}</g>`
      + `<g transform="translate(0 150)">${feastTable(c, 280, 26)}</g>`
      + `<g transform="translate(-80 124)">${roastPlatter(c, 64)}</g><g transform="translate(64 124)">${roastPlatter(c, 58)}</g>`
      + `<g transform="translate(-6 124) scale(.9)">${wineJar(c, 44)}</g><g transform="translate(116 124)">${loaf(c, 13)}</g><g transform="translate(-126 124)">${loaf(c, 12)}</g>`
      + `<g transform="translate(20 124) scale(.8)">${wineJar(c, 40, C.clay)}</g>`;
    const pic = msgL.add(`<g><path d="M-120 -1400V0M120 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${vignette(c, vid, inner, { w: 320, h: 160, frame: C.sun })}</g>`);

    /* people */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const farmer = S.puppet(pl.add(person(c, { ...INVITED.farmer, holdB: hoeHeld(c) })));
    const merchant = S.puppet(pl.add(person(c, { ...INVITED.merchant, holdF: moneyBagHeld(c) })));
    const rough = [INVITED.rough1, INVITED.rough2].map((o, i) => ({ i, p: moodPuppet(S, pl, c, o) }));
    const first = [0, 1].map((i) => ({ i, p: S.puppet(pl.add(person(c, { ...SERVANTS[i], holdF: heldInvite(c) }))) }));
    const other = [2, 3].map((k, i) => ({ i, p: S.puppet(pl.add(person(c, { ...SERVANTS[k], holdF: heldInvite(c) }))), kn: S.puppet(pl.add(person(c, { ...SERVANTS[k], pose: 'kneel' }))) }));
    const bursts = [0, 1, 2, 3].map(() => pl.add(`<g>${burst(c, 18)}</g>`));
    const cloths = [0, 1].map(() => pl.add(`<g>${drapeCloth(c, 110, 88)}</g>`));
    const come = pl.add(`<g>${bubble(c, tr(['Przyjdźcie', 'na ucztę!'], ['Come to', 'the feast!']), { size: 20, tail: -1 })}</g>`);

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);
      set.dusk.layer.fade(es(t, 5.2, 5.8) * 0.75);

      /* the doors: open while someone stands on the step */
      const open = [
        Math.max(es(t, 0.26, 0.32) * (1 - es(t, 0.62, 0.68)), es(t, 2.2, 2.3)),
        Math.max(es(t, 0.28, 0.34) * (1 - es(t, 0.63, 0.69)), es(t, 2.25, 2.35)),
        Math.max(es(t, 0.3, 0.36) * (1 - es(t, 0.64, 0.7)), es(t, 2.3, 2.4)),
      ];
      set.doors.forEach((d, i) => pose(d, { x: DX[i] - 30, y: TOWN.HOUSE_Y, sx: lerp(1, 0.12, open[i]) }));

      /* v3 — the first servants come with the invitations; the invited wave them off and go back in */
      const back = es(t, 1.0, 1.4, ease.in);
      first.forEach((s) => {
        const keys = [[0.02, -150 - s.i * 90], [0.35, SX[s.i]], [1.0, SX[s.i]], [1.4, -200 - s.i * 60]];
        const x = kf(t, keys);
        const offer = es(t, 0.36, 0.46) * (1 - es(t, 0.6, 0.7));
        s.p.set({ x, y: ROAD + s.i * 6, s: 0.96, flip: t > 1.0, walk: moving(t, keys) ? x * 0.05 + s.i : undefined, armF: 20 + offer * 60, armB: back * 10, head: es(t, 0.62, 0.72) * 14 - 2, blink: blinkAt(T, s.i + 4), o: t < 1.5 ? 1 : 0 });
      });
      // the invited on their doorsteps
      const onStep = (i, a) => es(t, a, a + 0.1);
      const inAgain = (a) => es(t, a, a + 0.12);
      const refuse = es(t, 0.44, 0.52);
      const listen = es(t, 2.3, 2.45);
      const goF = es(t, 4.05, 4.6), goM = es(t, 4.1, 4.6);
      // the farmer (door 0): out, refuses, in; out again to listen; then off to his field
      {
        const out1 = onStep(0, 0.28) * (1 - inAgain(0.54));
        const fx = lerp(DX[0], 440, goF);
        const o = Math.max(out1, listen);
        farmer.set({ x: fx, y: lerp(STEP, STEP + 4, goF), s: lerp(0.92, 0.84, goF), flip: t < 1.2 ? refuse < 0.5 : t > 4.05, walk: goF > 0 && goF < 1 ? fx * 0.05 : undefined, armF: 20 + (1 - refuse) * 10, armB: refuse * 80 * (1 - es(t, 0.56, 0.62)) + bump(t, 4.0, 4.4) * 60 + es(t, 4.6, 4.7) * (50 + Math.sin(t * 22) * 30), head: refuse * 6 - bump(t, 3.1, 3.8) * 6, blink: blinkAt(T, 1), o: o > 0.02 ? Math.min(1, o * 1.4) : 0 });
      }
      // the merchant (door 1): the same; then to his stall
      {
        const out1 = onStep(1, 0.3) * (1 - inAgain(0.55));
        const o = Math.max(out1, listen);
        const mx = lerp(DX[1], TOWN.STALL - 20, goM);
        const count = es(t, 4.6, 4.7);
        merchant.set({ x: mx, y: lerp(STEP, ROAD - 20, es(t, 4.1, 4.4)), s: 0.92, flip: t < 1.2 ? refuse < 0.5 : t < 4.1 || t > 4.62, walk: goM > 0 && goM < 1 ? mx * 0.05 : undefined, armF: 30 + count * (40 + Math.sin(T * 3) * 6), armB: refuse * 70 * (1 - es(t, 0.56, 0.62)) + bump(t, 4.0, 4.4) * 70, head: refuse * 6 + count * 14, blink: blinkAt(T, 2), o: o > 0.02 ? Math.min(1, o * 1.4) : 0 });
      }
      // the rough ones (door 2)
      const rush = es(t, 5.05, 5.3);
      const leave = es(t, 5.62, 5.95);
      rough.forEach((r) => {
        const out1 = onStep(2, 0.32 + r.i * 0.03) * (1 - inAgain(0.56));
        const o = Math.max(out1, listen);
        const target = OX[r.i] + 66;
        const x = lerp(lerp(DX[2] + (r.i ? 30 : -30), target, rush), DX[2] + (r.i ? 30 : -30), leave);
        const y = lerp(lerp(STEP + r.i * 6, ROAD - 4 + r.i * 8, rush), STEP + r.i * 6, leave);
        const grab = bump(t, 5.2, 5.6);
        r.p.set({ x, y, s: 0.94, flip: t < 1.2 ? refuse < 0.5 : leave < 0.5, walk: (rush > 0 && rush < 1) || (leave > 0 && leave < 1) ? x * 0.05 + r.i : undefined, armF: 20 + refuse * 20 * (1 - es(t, 0.56, 0.62)) + grab * 80, armB: grab * 50 + bump(t, 3.1, 3.8) * 40, head: -listen * 4 + refuse * 4, blink: blinkAt(T, 5 + r.i), o: o > 0.02 ? Math.min(1, o * 1.4) : 0 });
        r.p.mood({ angry: Math.max(refuse * (1 - es(t, 1.0, 1.1)), es(t, 4.0, 4.2)), sad: 0 });
      });

      /* v4 — other servants come; the picture of the feast; "Come!"; v6 — they are seized */
      const fall = es(t, 5.42, 5.5);
      other.forEach((s) => {
        const keys = [[1.15, -180 - s.i * 120], [1.75, OX[s.i]]];
        const x = kf(t, keys);
        const call = es(t, 3.05, 3.2) * (1 - es(t, 3.9, 4.0));
        const tell = bump(t, 2.05, 2.95);
        const look = es(t, 4.05, 4.3);
        s.p.set({ x, y: ROAD + 4 + s.i * 6, s: 0.96, flip: look > 0.5 && s.i === 0 && t < 5.0, walk: moving(t, keys) ? x * 0.05 + s.i : undefined, armF: 30 + tell * 40 + call * 90 + bump(t, 1.7, 1.95) * 50, armB: call * 110 + tell * 30, head: -call * 6, lean: -bump(t, 5.2, 5.45) * 12, blink: blinkAt(T, s.i + 7), o: t > 1.15 && fall < 1 ? 1 : 0 });
        s.kn.set({ x: x + 4, y: ROAD + 4 + s.i * 6, s: 0.96, head: 20, lean: 16, armF: 10, o: fall > 0 && fall < 1 ? fall : 0 });
        const ck = es(t, 5.5 + s.i * 0.06, 5.72 + s.i * 0.06, ease.out);
        pose(cloths[s.i], { x: x + 4, y: lerp(ROAD - 460, ROAD + 8, ck), o: ck > 0.001 ? 1 : 0 });
      });
      bursts.forEach((b, i) => {
        const s = other[i % 2], k = bump(t, 5.26 + i * 0.05, 5.46 + i * 0.05);
        const x = kf(t, [[1.15, -180 - s.i * 120], [1.75, OX[s.i]]]);
        pose(b, { x: x + (i < 2 ? 20 : -14), y: ROAD - 150 - (i % 2) * 34, s: k, r: i * 40, o: k > 0.02 ? 1 : 0 });
      });
      popBubble(come, t, 3.12, 3.95, OX[0] + 30, ROAD - 196);
      const pd = es(t, 2.05, 2.45, ease.out) * (1 - es(t, 4.0, 4.3, ease.in));
      pose(pic, { x: 800, y: lerp(-900, 96, pd), s: 1.25, r: Math.sin(T * 0.8) * 1.2 * pd });

      S.cam.x = es(t, 5.0, 5.4) * 20;
      S.cam.z = 1.05 + es(t, 5.0, 5.4) * 0.04;
      S.cam.y = 10 - es(t, 2.0, 2.5) * 30 * (1 - es(t, 4.0, 4.4));
    };
  },
};
