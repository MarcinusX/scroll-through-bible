// Łk 15,1–3 — the curtains open on a village courtyard in the afternoon, a great fig tree over a stone bench where
// Jesus sits, a low table with bread in front of Him. All the tax collectors and sinners come to hear Him: bright
// mantles and fat purses, a woman in rose, a rough man in grey — they come in from both sides of the stage, sit
// down round the table and lean in to listen, and more of them stand behind. Over the low wall on the right the
// Pharisees and scribes gather; they mutter, frown, and one of them points: "This man receives sinners and eats
// with them" — while Jesus breaks a loaf and hands it to the tax collector beside Him. Then He turns to them all,
// lifts His hand, and a round picture comes down on its string above the table: a shepherd with a sheep on his
// shoulders — the parable begins.
import { C, person, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import {
  courtSet, seatGuests, GUEST_SEATS, CT, JESUS, TAXMEN, SINNERS, PENITENT, SHEPHERD, pharisee, murmur, say, loaf, purse, roundel, onShoulders, shoulderLamb, ewe, pose3,
  headP, handP, kf, moving, flyAt, es, ease, bump, seg, fade, tr, PI, STRING,
} from './lib.js';

const JX = CT.JX, GY = CT.GY;
const PH_X = [1100, 1172, 1246];

/** the round picture of the shepherd carrying his sheep home (plate coords, r 74) */
function shepherdPlate(c, id) {
  const inner = `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.skyBlue, C.cream, 0.4)}"/>`
    + sheet().p(c.cut([[-90, 22], [-30, 8], [30, 16], [90, 4], [90, 90], [-90, 90]], 0.6, 8), mix(C.hillNear, C.sand2, 0.3)).out()
    + `<g transform="translate(-44 40) scale(.5)">${ewe(c, {})}</g><g transform="translate(-58 50) scale(-.46 .46)">${ewe(c, { wool: C.cream })}</g>`
    + `<g transform="translate(10 66) scale(.42)">${onShoulders(person(c, { ...SHEPHERD }), shoulderLamb(c, C.linen))}</g>`;
  return roundel(c, inner, { r: 74, id });
}

export default {
  id: 'lk15-near',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3 },
  ],
  cam: { x: [-20, 60], y: [0, 50], z: [1, 1.08] },
  build(S) {
    const H = courtSet(S);
    const c = H.c;

    /* the ones standing behind (still groups that come in from the sides) */
    const rowL = S.layer({ par: 0.38, sh: 4 });
    const oc = makeCutter('lk15-near-rows');
    const standers = (list, flip) => pose3(oc, list.map(([x, o, a], i) => ({ x, y: (i % 2) * 6, s: 0.84, flip, armF: a, armB: 8, head: flip ? 6 : -6, o })));
    const back1 = rowL.sprite(`<g>${standers([[-60, TAXMEN[2], 10], [0, SINNERS[3], 30], [60, SINNERS[2], 20]], false)}</g>`, 520, GY - 12);
    const back2 = rowL.sprite(`<g>${standers([[-40, SINNERS[1], 20], [30, TAXMEN[0], 40]], true)}</g>`, 944, GY - 12);

    /* the guests: walkers, then seated cut-outs */
    const seats = seatGuests(S, H.people);
    const walkers = GUEST_SEATS.map((g, i) => ({ ...g, i, from: g.flip ? 1300 : 300, t0: 1.0 + [0.08, 0.0, 0.14, 0.04, 0.18][i], p: S.puppet(H.people.add(person(c, { ...g.o, holdB: g.o === PENITENT || g.o === TAXMEN[1] ? `<g transform="translate(0 -4)">${purse(c, {})}</g>` : '' }))) }));
    const jesus = S.puppet(H.people.add(person(c, { ...JESUS, pose: 'sit' })));
    const bread = H.front.add(`<g opacity="0">${loaf(c, 14)}</g>`);

    /* the Pharisees and scribes behind the wall */
    const phL = H.street;
    const phs = PH_X.map((x, i) => {
      const p = S.puppet(phL.add(pharisee(c, i)));
      return { x, i, p, angry: p.el.querySelector('[data-part="angry"]') };
    });
    const mutters = phs.map(() => H.fx.add(`<g opacity="0">${murmur(c, { side: -1 })}</g>`));
    const grumble = H.fx.add(`<g opacity="0">${say(c, [tr('«Ten przyjmuje grzeszników', '“This man welcomes sinners,'), tr('i jada z nimi»', 'and eats with them.”')], { size: 20, side: -1 })}</g>`);

    /* the round picture of the parable */
    const plateL = S.layer({ par: 0.2, sh: 6 });
    const plate = plateL.add(`<g transform="translate(0 -1500)"><path d="M0 -1900V-80" stroke="${STRING}" stroke-width="1.2" fill="none"/>${shepherdPlate(c, S.id('plate'))}</g>`);

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      H.update(T);

      /* v1 — they all come near to hear Him */
      const listen = es(t, 1.55, 1.8);
      walkers.forEach((w) => {
        const K = [[w.t0, w.from], [w.t0 + 0.42, w.x]];
        const x = kf(t, K);
        const sat = seg(t, w.t0 + 0.42, w.t0 + 0.47);
        w.p.set({ x, y: GY, s: 0.94, flip: w.flip, walk: moving(t, K) ? x * 0.06 : undefined, armF: 10, armB: 10, o: seg(t, w.t0, w.t0 + 0.04) * (1 - sat), blink: blinkAt(T, w.i) });
        const lean = w.flip ? -1 : 1;
        pose(seats[w.i].el, { x: w.x + lean * listen * 3, y: GY, o: sat });
      });
      const bk = es(t, 1.2, 1.75, ease.out);
      back1.set({ x: lerp(160, 520, bk), y: GY - 12, o: seg(t, 1.2, 1.3) });
      back2.set({ x: lerp(1400, 944, bk), y: GY - 12, o: seg(t, 1.2, 1.3) });

      /* Jesus: welcomes them; v2 breaks the bread and hands it to the tax collector; v3 lifts His hand */
      const welcome = bump(t, 1.2, 1.9);
      const give = es(t, 2.1, 2.35) * (1 - es(t, 2.62, 2.8));
      const tell = es(t, 3.05, 3.3);
      jesus.set({ x: JX, y: GY, s: 1.0, armF: 20 + welcome * 40 + give * 44 + tell * 30, armB: 14 + welcome * 50 + tell * 110, head: -give * 6 - tell * 8, blink: blinkAt(T) });
      const [hx, hy] = handP(JX, GY, 1.0, false, 20 + give * 44, 'sit');
      const bk2 = es(t, 2.35, 2.6);
      pose(bread, { x: lerp(hx + 4, GUEST_SEATS[3].x - 50, bk2), y: lerp(hy - 4, GY - 64, bk2) - Math.sin(bk2 * PI) * 12, r: bk2 * 40, o: seg(t, 2.08, 2.14) * (1 - seg(t, 3.0, 3.1)) });

      /* v2 — the Pharisees and scribes mutter; the grumble */
      const inPh = es(t, 1.7, 2.05);
      phs.forEach((m) => {
        const point = m.i === 0 ? es(t, 2.3, 2.45) * (1 - es(t, 3.2, 3.4)) : 0;
        const lean = es(t, 3.1, 3.4) * 4;
        m.p.set({ x: m.x + (1 - inPh) * (120 + m.i * 40), y: GY - 6, s: 0.96, flip: true, armF: 10 + point * 80, armB: m.i === 1 ? 20 + bump(t, 2.1, 2.9) * 30 : 6, head: point * -4 + lean, lean: -lean * 0.5, o: seg(t, 1.7, 1.78), blink: blinkAt(T, m.i + 2) });
        fade(m.angry, es(t, 2.05, 2.2));
      });
      mutters.forEach((el, i) => {
        const k = es(t, 2.02 + i * 0.07, 2.14 + i * 0.07, ease.back) * (1 - es(t, 2.9, 3.0));
        const [x, y] = headP(PH_X[i], GY - 6, 0.96, true);
        pose(el, { x: x - 18, y: y - 28 - i * 6, s: Math.max(0.001, k) * 0.9, o: k > 0.01 ? 1 : 0 });
      });
      const gk = es(t, 2.22, 2.36, ease.back) * (1 - es(t, 2.92, 3.04));
      const [gx, gy] = headP(PH_X[0], GY - 6, 0.96, true);
      pose(grumble, { x: gx - 26, y: gy - 30, s: Math.max(0.001, gk), o: gk > 0.01 ? 1 : 0 });

      /* v3 — He tells them a parable: the picture comes down */
      const pk = es(t, 3.1, 3.5, ease.out);
      flyAt(plate, pk, JX, 236, T, 0);

      S.cam.x = kf(t, [[0.8, 0], [2.0, 30], [3.0, 30], [3.6, 0]]);
      S.cam.y = kf(t, [[0.8, 30], [2.0, 40], [3.2, 10]]);
      S.cam.z = kf(t, [[0.8, 1.0], [1.9, 1.05], [3.2, 1.02]]);
    };
  },
};
