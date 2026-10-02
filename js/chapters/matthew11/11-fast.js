// Mt 11,18–19 — the stage is split in two: on the left the wilderness, where John sits on a rock and waves away the
// bread and the cup a disciple holds out to him; on the right a house cut open, where Jesus sits at a long table with
// Matthew, a tax collector, a woman of the town and Peter, breaking bread and lifting the cup. In the middle stand three
// critics. At John they point and shout "He has a demon!"; they turn round and at Jesus shout "a glutton and a drunkard,
// a friend of tax collectors and sinners!". "Yet wisdom is justified by her deeds": the tax collector gets up and
// empties his purse into a beggar's bowl, a man kneels to be baptised by John — light rises over both halves, and the
// critics' shouts crumple and fall.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, house, rock, palm } from '../../assets/nature.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { JOHN_B, JD, BEGGAR, pharisee, lowTable, loaf, cup, jug, bowl, coin, cry, emptyBowl, scrub, acacia, headAt, hand, kf, tr, PI } from './lib.js';

const P = 0.6, GY = 740;
const JNX = 380;                      // John's rock
const TX = 1250;                      // the table
const CR = [720, 800, 880];           // the critics

export default {
  id: 'mt11-fast',
  beats: [
    { v: 18, text: 'Przyszedł bowiem Jan: nie jadł ani nie pił,' },
    { v: 18, cont: true, text: 'a oni mówią: "Zły duch go opętał".' },
    { v: 19, text: 'Przyszedł Syn Człowieczy: je i pije.' },
    { v: 19, cont: true, text: 'a oni mówią: "Oto żarłok i pijak, przyjaciel celników i grzeszników".' },
    { v: 19, cont: true, text: 'A jednak mądrość usprawiedliwiona jest przez swe czyny».' },
  ],
  cam: { x: [-680, 780], y: [0, 90], z: [0.85, 1.55] },
  build(S) {
    const c = S.c;
    const PCX = [-680, -258, 750, 630, 630], PCZ = [1.55, 1.08, 1.1, 0.87, 0.87];   // phone camera per beat
    sky(S, ['#cadbd6', '#f0e4c9', '#f7e4c3']);
    const wis = S.layer({ par: 0.04, sh: 0, flat: true, rise: 0 });
    const wisGlow = wis.add(`<g><circle r="700" fill="url(#warm-glow)"/></g>`);
    /* far: dunes on the left, the town's hills on the right */
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [20, 8, 3], lens: [900, 330, 120], color: mix(C.duskViolet, C.dune, 0.45) }).markup);
    const mid = S.layer({ par: 0.3, sh: 3 });
    mid.add(sheet().p(c.cut([[-900, 1400], [-900, 560], [-300, 540], [200, 530], [600, 556], [760, 600], [760, 1400]], 1.2, 12), mix(C.dune, C.sand2, 0.4)).out() + acacia(c, 120, 560, 0.8) + scrub(c, 520, 560, 24));
    mid.add(sheet().p(c.cut([[840, 1400], [840, 590], [1100, 540], [1600, 530], [2600, 540], [2600, 1400]], 1.2, 12), C.hillMid).out());
    /* ground: sand (left) → street (right) */
    const G = S.layer({ par: P, sh: 3 });
    const gs = sheet();
    gs.p(c.ridge(c.wave(GY - 40, [5, 2], [600, 170]), -1200, 2800, 1800, 12, 1), mix(C.sand, C.sand2, 0.5));
    gs.p(c.cut([[900, GY - 44], [2800, GY - 44], [2800, 1800], [860, 1800]], 0.8, 12), mix(C.sand, C.stone, 0.35));
    G.add(gs.out());
    G.add(rock(c, JNX, GY + 2, 150, 60, C.rock2) + scrub(c, 150, GY - 20, 30) + rock(c, 560, GY - 16, 60, 22, C.rock));

    /* the house cut open on the right */
    const H = S.layer({ par: P, sh: 4 });
    const hs = sheet();
    const X0 = 980, X1 = 1540, TOP = 400;
    hs.p(c.cut([[X0 - 30, TOP - 30], [X1 + 30, TOP - 30], [X1 + 30, GY - 30], [X0 - 30, GY - 30]], 0.6, 10), C.plaster);
    hs.p(c.cut([[X0, TOP], [X1, TOP], [X1, GY - 34], [X0, GY - 34]], 0.5, 10), mix(C.plaster2, C.clay, 0.18));
    hs.p(c.cut([[X0 - 40, TOP - 44], [X1 + 40, TOP - 44], [X1 + 40, TOP - 24], [X0 - 40, TOP - 24]], 0.4, 10), C.roof);
    let beams = '';
    for (let x = X0 + 16; x < X1; x += 56) beams += c.cut(c.rect(x, TOP, 12, 12), 0.2, 4);
    hs.p(beams, C.wood2);
    hs.p(c.cut([[X1 - 150, GY - 34], [X1 - 150, TOP + 110], ...c.arc(X1 - 110, TOP + 110, 40, 36, PI, 2 * PI, 10), [X1 - 70, GY - 34]], 0.4, 6), mix(C.sand, C.cream, 0.3));
    H.add(hs.out());
    H.add(`<g transform="translate(${X1 + 160} ${GY - 40})">${house(c, 0, 0, 120, 110)}</g>` + palm(c, X1 + 90, GY - 36, 180));

    /* people: John and his disciple */
    const act = S.layer({ par: P, sh: 5 });
    const john = S.puppet(act.add(person(c, { ...JOHN_B, pose: 'sit' })));
    const offer = S.puppet(act.add(person(c, { ...JD[1], holdF: `<g data-k="fb" transform="translate(-14 -2)">${loaf(c, 14)}</g>` })));
    const bowlEl = act.add(`<g>${emptyBowl(c, 30)}</g>`);
    const cupJ = act.add(`<g>${cup(c)}</g>`);
    const penitent = S.puppet(act.add(person(c, { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, pose: 'kneel' })));
    const dropsEl = act.add(`<g>${sheet().x([0, 1, 2, 3].map((i) => c.cut([[0, -6], [3, 1], [0, 4], [-3, 1]].map(([x, y]) => [x + (i - 1.5) * 6, y + (i % 2) * 8]), 0.1, 3)).join(''), C.lake2).out()}</g>`);

    /* the table */
    const tableL = S.layer({ par: P, sh: 5 });
    const GUESTS = [
      { x: TX - 180, o: CAST.matthew },
      { x: TX - 90, o: { robe: C.ochreRobe, mantle: C.teal2, hair: C.hair3, hairStyle: 'wrap', veil: C.sun, beard: 'full', skin: C.skin3, belt: C.sun } },   // the tax collector
      { x: TX + 90, o: { robe: C.roseRobe, hairStyle: 'veil', veil: C.plumRobe, veil2: shade(C.plumRobe, -0.1), skin: C.skin, hair: C.hair3, beard: 'none' }, flip: true },
      { x: TX + 180, o: CAST.peter, flip: true },
    ].map((g, i) => ({ ...g, i, p: S.puppet(tableL.add(person(c, { ...g.o, pose: 'sit' }))) }));
    const taxUp = S.puppet(tableL.add(person(c, GUESTS[1].o)));
    const jesus = S.puppet(tableL.add(person(c, { ...CAST.jesus, pose: 'sit', holdF: `<g data-k="jcup" transform="translate(0 4) rotate(180)">${cup(c)}</g>` })));
    const jcup = S.$('jcup');
    tableL.add(`<g transform="translate(${TX} ${GY - 30})">${lowTable(c, 470, 50)}</g>`);
    tableL.add(`<g transform="translate(${TX} ${GY - 80})"><g transform="translate(-150 0)">${loaf(c, 18)}</g><g transform="translate(-60 0)">${bowl(c, { food: 'fruit' })}</g><g transform="translate(170 0)">${jug(c)}</g><g transform="translate(-200 0)">${loaf(c, 16)}</g><g transform="translate(120 0)">${cup(c)}</g></g>`);
    const halves = [0, 1].map((i) => tableL.add(`<g><g transform="translate(${i ? 4 : -4} 0)">${loaf(c, 11)}</g></g>`));
    const beggar = S.puppet(tableL.add(person(c, { ...BEGGAR, pose: 'sit' })));
    const begBowl = tableL.add(`<g>${bowl(c, { w: 30, food: null })}</g>`);
    const coins = Array.from({ length: 5 }, (_, i) => ({ i, el: tableL.add(`<g>${coin(c, 7)}</g>`) }));

    /* the critics in the middle */
    const crL = S.layer({ par: P, sh: 5 });
    const critics = CR.map((x, i) => ({ i, x, p: S.puppet(crL.add(person(c, pharisee(c, i)))) }));
    const fx = S.layer({ par: P, sh: 4 });
    const shoutJ = fx.add(`<g>${cry(c, tr('Zły duch go opętał!', 'He has a demon!'), { size: 21, dir: 1 })}</g>`);
    const shoutS = fx.add(`<g>${cry(c, [tr('Oto żarłok i pijak,', 'A glutton and a drunkard,'), tr('przyjaciel celników', 'a friend of tax collectors'), tr('i grzeszników!', 'and sinners!')], { size: 20, dir: -1 })}</g>`);
    const light = [JNX, TX].map((x) => fx.add(`<g><circle r="200" fill="url(#halo-glow)"/></g>`));

    return (t, time) => {
      const T = time;

      /* v18a — John neither eats nor drinks */
      const hold = es(t, 0.1, 0.35);
      const refuse = bump(t, 0.3, 0.8) + es(t, 0.8, 0.9) * 0;
      offer.set({ x: JNX + 150, y: GY + 6, s: 0.92, flip: true, armF: 20 + hold * 60 * (1 - es(t, 0.75, 0.9)), armB: 10, head: 6, blink: blinkAt(T, 3) });
      const bless = es(t, 4.1, 4.3);
      john.set({ x: JNX - 10, y: GY - 20, s: 0.94, flip: false, armF: 30 + refuse * 70 + bless * 50, armB: 20 + es(t, 0.45, 0.7) * 130 * (1 - bless) + bless * 110, head: -es(t, 0.45, 0.7) * 16 * (1 - bless) + bless * 10, blink: blinkAt(T, 1) });
      pose(bowlEl, { x: JNX + 60, y: GY + 10 });
      pose(cupJ, { x: JNX + 90, y: GY + 12, r: 0 });
      const pk = es(t, 4.0, 4.2);
      penitent.set({ x: JNX + 110, y: GY + 10, s: 0.9, flip: true, armF: 70, armB: 60, head: 14, o: pk, blink: blinkAt(T, 7) });
      pose(dropsEl, { x: JNX + 94, y: GY - 130 + seg(t, 4.3, 4.9) * 40, o: bump(t, 4.3, 4.95) });

      /* v18b / v19b — the critics point one way, then the other */
      const atJ = es(t, 1.05, 1.2) * (1 - es(t, 1.9, 2.0));
      const atS = es(t, 3.05, 3.2) * (1 - es(t, 3.95, 4.05));
      const face = t > 2.5 ? 1 : -1;       // −1: towards John (left)
      const shame = es(t, 4.2, 4.5);
      // phone: when they turn on Jesus the critics walk up to the table, so they and the meal fit on one screen
      const toT = S.portrait ? es(t, 2.96, 3.2) * 120 : 0, crWalk = S.portrait && t > 2.96 && t < 3.2;
      critics.forEach((cr) => {
        const pnt = face < 0 ? atJ : atS;
        cr.p.set({ x: cr.x + toT, y: GY + (cr.i % 2) * 8, s: 0.94, flip: face < 0, walk: crWalk ? (cr.x + toT) * 0.05 : undefined, armF: 20 + pnt * (60 + cr.i * 10), armB: 10 + pnt * (cr.i === 1 ? 140 : 30), head: -pnt * 6 + shame * 14, lean: pnt * 6, blink: blinkAt(T, cr.i + 2) });
      });
      const sj = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(shoutJ, { x: CR[0] - 20, y: GY - 200, s: sj, r: T ? Math.sin(T * 3) * 2 : 0, o: sj > 0.02 ? 1 : 0 });
      const ss = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(shoutS, { x: CR[2] + 20 + toT, y: GY - 200, s: ss, r: T ? Math.sin(T * 3) * 2 : 0, o: ss > 0.02 ? 1 : 0 });

      /* v19a — the Son of Man eats and drinks with them */
      const brk = es(t, 2.1, 2.3), raise = es(t, 2.35, 2.55);
      jesus.set({ x: TX, y: GY - 20, s: 0.96, armF: 40 + brk * 50 + raise * 30, armB: 30 + brk * 60 * (1 - raise) + bless * 80, head: -raise * 6, blink: blinkAt(T) });
      pose(jcup, { x: 0, y: 4, r: 180, o: raise > 0.5 ? 1 : 0 });
      halves.forEach((h, i) => {
        const [bx, by] = hand(TX, GY - 20, 0.96, false, 90, 0, 62);
        const k = brk * (1 - es(t, 2.6, 2.8));
        pose(h, { x: bx + (i ? 18 : -18) * brk - (i ? 0 : 60) * es(t, 2.6, 2.8), y: by - 4, r: (i ? 20 : -20) * brk, o: brk > 0.02 && t < 3.5 ? 1 : 0 });
      });
      const up = es(t, 4.05, 4.12);
      GUESTS.forEach((g) => {
        const laugh = T ? Math.max(0, Math.sin(T * 3 + g.i * 1.7)) * es(t, 2.2, 2.4) * (1 - es(t, 3.0, 3.1)) : 0;
        g.p.set({ x: g.x, y: GY - 16, s: 0.9, flip: !!g.flip, armF: 40 + laugh * 30 + es(t, 2.2, 2.4) * 20, armB: 20 + laugh * 40, head: -laugh * 8, blink: blinkAt(T, g.i + 4), o: g.i === 1 ? 1 - up : 1 });
      });

      /* v19c — wisdom justified by her deeds: the purse emptied into the beggar's bowl; light over both */
      const walk = es(t, 4.12, 4.35);
      const tx = lerp(TX - 90, 1350, walk);
      const give = es(t, 4.35, 4.5);
      taxUp.set({ x: tx, y: GY + 6, s: 0.9, walk: walk > 0 && walk < 1 ? tx * 0.05 : undefined, armF: 30 + give * 60, armB: 10, head: give * 10, o: up, blink: blinkAt(T, 6) });
      beggar.set({ x: 1450, y: GY + 16, s: 0.86, flip: true, armF: 50 + es(t, 4.5, 4.7) * 40, armB: 20 + es(t, 4.6, 4.8) * 100, head: -es(t, 4.6, 4.8) * 10, blink: blinkAt(T, 9) });
      pose(begBowl, { x: 1415, y: GY + 12 });
      coins.forEach((co) => {
        const k = seg(t, 4.42 + co.i * 0.04, 4.62 + co.i * 0.04);
        pose(co.el, { x: lerp(tx + 50, 1415, k), y: lerp(GY - 110, GY - 4, k) - Math.sin(k * PI) * 50, r: k * 360, o: k > 0 && k < 1 ? 1 : 0 });
      });
      light.forEach((l, i) => pose(l, { x: i ? TX : JNX, y: GY - 150, s: 1 + bless * 0.3, o: bless * 0.4 }));
      pose(wisGlow, { x: 800, y: 260, s: 0.6 + bless * 0.5, o: bless * 0.7 });

      /* camera: John — the critics — the table — all */
      if (S.portrait) {
        // phone: the stage is wider than the screen; each beat frames its own part whole (the table with its
        // beggar, the critics with the table), and the close-up on John keeps the critics out of the corner
        S.cam.x = kf(t, [[0, PCX[0]], [0.95, PCX[0]], [1.2, PCX[1]], [1.95, PCX[1]], [2.1, PCX[2]], [2.95, PCX[2]], [3.15, PCX[3]], [3.95, PCX[3]], [4.15, PCX[4]]]);
        S.cam.z = kf(t, [[0, 1.55], [0.95, 1.55], [1.2, PCZ[1]], [1.95, PCZ[1]], [2.1, PCZ[2]], [2.95, PCZ[2]], [3.15, PCZ[3]], [3.95, PCZ[3]], [4.15, PCZ[4]]]);
      } else {
        S.cam.x = kf(t, [[0, -520], [0.95, -520], [1.2, -250], [1.95, -250], [2.1, 520], [2.95, 520], [3.15, 250], [3.95, 250], [4.15, 250]]);
        S.cam.z = kf(t, [[0, 1.55], [0.95, 1.55], [1.2, 1.35], [1.95, 1.35], [2.1, 1.55], [2.95, 1.55], [3.15, 1.35], [3.95, 1.35], [4.15, 1.0]]);
      }
      S.cam.y = kf(t, [[0, 90], [3.95, 90], [4.15, 30]]);
    };
  },
};
