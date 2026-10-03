// Łk 11,37–38 — the street of the village at noon, the fine house of a Pharisee with its painted cornice. Jesus is still
// speaking to the people as He comes along the street (rings of His voice go out); the Pharisee comes out of his gateway,
// bows and asks Him in to eat. The street flies up: the dining court inside, the long low table, the guests — two
// Pharisees and a teacher of the Law. Jesus comes in through the gateway and at once takes His place on the couch at
// the table. A servant stands ready by the couch with a basin and an ewer for the washing before the meal — but He does
// not wash; and the host sits back, astonished: "!" — the washing of hands in his thought — and the guests look at one
// another.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { dinnerSet, simonFacade, SH, HOST, HOUSEBOY, basin, ewer, say, thought, bang, voiceRings, headAt, hand, kf, moving, tr, PI, NOONHALL } from './lib.js';

const { FLOOR, JX } = SH;
const GX = (SH.GATE[0] + SH.GATE[1]) / 2;

export default {
  id: 'lk11-dinner',
  beats: [
    { v: 37, text: 'Gdy jeszcze mówił, zaprosił Go pewien faryzeusz do siebie na obiad.' },
    { v: 37, cont: true, text: 'Poszedł więc i zajął miejsce za stołem.' },
    { v: 38 },
  ],
  cam: { x: [-60, 220], y: [0, 160], z: [0.84, 1.2] },
  build(S) {
    const c = S.c;
    const roomLs = [];
    const mkLayer = S.layer;
    S.layer = (o) => { const Ly = mkLayer(o); roomLs.push(Ly); return Ly; };
    const D = dinnerSet(S, S.portrait ? { ceilTop: 0 } : {});   // phone: the ceiling is an eave band, not a third of the screen of planks
    const R = D.R;
    const jWalk = S.puppet(R.frontL.add(person(c, CAST.jesus)));
    const servant = S.puppet(R.frontL.add(person(c, { ...HOUSEBOY, holdF: `<g transform="rotate(-40) translate(-8 14)">${ewer(c)}</g>` })));
    const bas = R.frontL.add(`<g>${basin(c, { water: true })}</g>`);
    const wonder = R.fx.add(`<g opacity="0">${thought(c, `<g transform="translate(-10 12) scale(.55)">${basin(c, { water: true })}</g><g transform="translate(14 -2) scale(.6)">${ewer(c)}</g>`, { w: 80, h: 58 })}</g>`);
    const bangEl = R.fx.add(`<g opacity="0">${bang(c, 26)}</g>`);
    S.layer = mkLayer;

    /* the street in front: a drop that flies up */
    const drop = S.layer({ par: 0.3, sh: 8, pad: 1500 });
    drop.add(simonFacade(S, { skyCols: NOONHALL }));
    const crowdS = [0, 1, 2].map((i) => S.puppet(drop.add(person(c, [{ robe: C.dustyBlue, hairStyle: 'short', beard: 'full', hair: C.hair3, skin: C.skin2 }, { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, beard: 'none', skin: C.skin }, { robe: C.sageRobe, hairStyle: 'wrap', veil: C.stone, beard: 'short', hair: C.hair, skin: C.skin3 }][i]))));
    const jStreet = S.puppet(drop.add(person(c, CAST.jesus)));
    const hStreet = S.puppet(drop.add(person(c, HOST)));
    const invite = drop.add(`<g opacity="0">${say(c, [tr('Chodź, zjedz', 'Come and dine'), tr('u mnie!', 'with me!')], { size: 19, side: -1 })}</g>`);
    const talk = voiceRings(drop, c, { n: 3, color: C.sun, r: 30, w: 4 });

    return (t, time) => {
      const T = time;
      roomLs.forEach((Ly) => Ly.fade(seg(t, 0.9, 0.96)));
      /* v37a — still speaking, He comes along the street; the Pharisee invites Him */
      const PO = S.portrait ? 40 : 0;   // phone: the street group a little to the right, so its followers are not sliced at the left edge
      const JK = [[-0.5, 200], [0.4, 610 + PO]];
      const jx = kf(t, JK);
      jStreet.set({ x: jx, y: 742, s: 1.04, walk: moving(t, JK) ? jx * 0.045 : undefined, amt: 0.8, flip: t < 0.45 ? false : false, armF: 30 + bump(t, -0.4, 0.4) * 30 + bump(t, 0.55, 0.95) * 20, armB: 8, head: -4, blink: blinkAt(T) });
      const [jhx, jhy] = headAt(jx, 742, 1.04);
      talk(jhx, jhy, t < 0.4 ? 0.8 : 0, T, { dir: -1, spread: 1.6 });
      crowdS.forEach((p, i) => { const x = S.portrait ? jx - 100 - i * 58 : jx - 130 - i * 70; p.set({ x, y: 742 + (i % 2) * 8, s: 0.96, o: S.portrait && i === 2 ? 0 : 1, walk: moving(t, JK) ? x * 0.05 + i : undefined, armF: 14, head: -4, blink: blinkAt(T, i) }); });
      const SK = [[0.2, 790 + PO], [0.4, 740 + PO]];
      const sx = kf(t, SK);
      const bow = bump(t, 0.4, 0.6);
      const wave = es(t, 0.5, 0.65);
      hStreet.set({ x: sx, y: 742, s: 1.02, flip: true, o: seg(t, 0.16, 0.22), walk: moving(t, SK) ? sx * 0.05 : undefined, armF: 20 + wave * 40, armB: 10 + wave * 90, lean: bow * 14, head: bow * 16, blink: blinkAt(T, 3) });
      const [shx, shy] = headAt(740 + PO, 742, 1.02, true);
      const ib = es(t, 0.45, 0.58, ease.back) * (1 - es(t, 0.92, 0.98));
      pose(invite, { x: shx - 20, y: shy - 30, s: ib, o: ib > 0.02 ? 1 : 0 });
      drop.shift(0, -es(t, 0.96, 1.18, ease.in) * 1450);
      drop.fade(1 - seg(t, 1.14, 1.18));

      /* v37b — He goes in and at once takes His place */
      const WK = [[1.12, GX], [1.45, JX]];
      const wx = kf(t, WK);
      const sat = es(t, 1.47, 1.53);
      jWalk.set({ x: wx, y: FLOOR, s: 1.0, o: seg(t, 1.1, 1.16) * (1 - sat), walk: moving(t, WK) ? wx * 0.05 : undefined, amt: 0.8, armF: 14, blink: blinkAt(T) });
      /* v38 — the basin is ready; He does not wash; the host marvels */
      const SVK = [[1.55, 1400], [1.85, JX + 150]];
      const svx = kf(t, SVK);
      const offer = es(t, 1.9, 2.05) * (1 - es(t, 2.7, 2.85));
      servant.set({ x: svx, y: FLOOR + 6, s: 0.84, flip: true, o: seg(t, 1.5, 1.56), walk: moving(t, SVK) ? svx * 0.06 : undefined, armF: 30 + offer * 40, armB: 10, head: 6, blink: blinkAt(T, 5) });
      pose(bas, { x: JX + 90, y: FLOOR + 14, o: es(t, 1.85, 1.95) });
      const marvel = es(t, 2.15, 2.35);
      D.seat(t, T, {
        J: { o: sat, armF: 30 + es(t, 1.55, 1.8) * 30 + es(t, 2.05, 2.2) * 10, armB: 10, head: 4, blink: blinkAt(T) },
        H: { armF: 30 + bump(t, 1.3, 1.8) * 50 + marvel * 70, armB: 10 + marvel * 90, head: 4 - marvel * 10, lean: -marvel * 8 },
        g: (q) => ({ head: -4 + es(t, 2.3, 2.5) * (q.i === 1 ? -10 : 8), armF: 20 + bump(t, 1.4, 1.9) * 30 }),
      });
      const [hhx, hhy] = headAt(1172, FLOOR, 0.96, true);
      const wk = es(t, 2.25, 2.4, ease.back);
      pose(wonder, { x: hhx - 60, y: hhy - 88, s: wk, o: wk > 0.02 ? 1 : 0 });
      const bk = es(t, 2.18, 2.3, ease.back);
      pose(bangEl, { x: hhx + 8, y: hhy - 44 + 62 - 62, s: bk, o: bk > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1.0, 0], [1.2, 60], [1.9, 60], [2.2, 110]]);
      S.cam.z = kf(t, [[0, 1.04], [1.0, 1.06], [1.3, 1.14], [2.2, 1.16]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.3, 140]]);
      if (S.portrait && t > 1.1) { S.cam.x = kf(t, [[1.1, 20], [1.45, 170], [1.9, 170], [2.2, 210]]); S.cam.z = 0.84; }   // phone: the host at the far end inside the screen
    };
  },
};
