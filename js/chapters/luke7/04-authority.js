// Łk 7,8 — the centurion's own picture, a painted set that flies in: the courtyard of the garrison in Capernaum.
// "I too am a man under authority": above him Caesar's cameo comes down on its strings and he salutes it; "with
// soldiers under me": his men march in and stand in line before him. "I say to this one 'Go!' and he goes" — the
// first turns and marches out through the gate; "to another 'Come!' and he comes" — the second comes in at the
// door and halts before him; "and to my servant 'Do this!' and he does it" — the boy lifts the water jar onto his
// shoulder and carries it away.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud, cypress } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { centurion, soldier, HOUSEBOY, caesar, cameo, standard, bigJar, bubble, nameTag, headAt, hand, kf, moving, hangAt, tr, PI } from './lib.js';

const FEET = 742, CX = 740, GATE = 1110, DOOR = 470;

export default {
  id: 'lk7-authority',
  enter: 'fly',
  beats: [
    { v: 8, text: 'Bo i ja, choć podlegam władzy, mam pod sobą żołnierzy.' },
    { v: 8, cont: true, text: 'Mówię temu: "Idź!" - a idzie; drugiemu: "Chodź!" - a przychodzi; a mojemu słudze: "Zrób to!" - a robi».' },
  ],
  cam: { x: [-30, 30], y: [-40, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    sky(S, ['#c9dcd6', '#f0e6cc', '#f7e6c6']);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1250, y: 140, len: 900 });
    const cl = hanging(hangL, cloud(c, 150), { x: 380, y: 170, len: 900 });
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 470, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.duskViolet, 0.12) }).markup);

    /* the garrison wall: a door on the left, an arched gate on the right, crenellations */
    const wallL = S.layer({ par: 0.3, sh: 4 });
    const wcol = mix(C.stone2, C.sand2, 0.3);
    const w = sheet();
    const gate = [[GATE - 70, FEET - 70], [GATE - 70, FEET - 240], ...c.arc(GATE, FEET - 240, 70, 60, PI, 2 * PI, 12), [GATE + 70, FEET - 70]];
    const door = [[DOOR - 46, FEET - 70], [DOOR - 46, FEET - 200], ...c.arc(DOOR, FEET - 200, 46, 40, PI, 2 * PI, 10), [DOOR + 46, FEET - 70]];
    // what is seen through the gate: the lane outside
    wallL.add(sheet().p(c.cut(c.rect(GATE - 80, FEET - 320, 160, 260), 0.3, 6), mix(C.skyBlue, C.cream, 0.4)).p(c.cut([[GATE - 80, FEET - 130], [GATE + 80, FEET - 150], [GATE + 80, FEET - 60], [GATE - 80, FEET - 60]], 0.4, 6), mix(C.hillMid, C.sand, 0.4)).out());
    wallL.add(sheet().p(c.cut(c.rect(DOOR - 56, FEET - 260, 112, 200), 0.3, 6), mix(C.soilDark, C.plumRobe, 0.2)).out());
    w.p(c.cut([[-900, 330], [2500, 330], [2500, FEET - 60], [-900, FEET - 60]], 0.8, 20) + c.hole(gate, 0.4, 6) + c.hole(door, 0.4, 6), wcol);
    let crn = '';
    for (let x = -880; x < 2500; x += 60) crn += c.cut(c.rect(x, 296, 36, 40), 0.4, 5);
    w.p(crn, wcol);
    let blk = '';
    const inHole = (x, y) => (x + 56 > GATE - 84 && x < GATE + 84 && y + 30 > FEET - 320) || (x + 56 > DOOR - 58 && x < DOOR + 58 && y + 30 > FEET - 262);
    for (let y = 346; y < FEET - 70; y += 38) for (let x = -880 + (Math.round(y / 38) % 2) * 30; x < 2500; x += 64) if (!inHole(x, y)) blk += c.cut(c.rect(x, y, 56, 30), 0.4, 6);
    w.x(blk, shade(wcol, 0.12), 'opacity=".6"');
    w.p(c.ribbon(gate.slice(1, -1), 14) + c.ribbon(door.slice(1, -1), 10), shade(wcol, -0.12));
    // two red shields and a tablet over the gate
    w.p(c.cut(c.ell(GATE - 170, 470, 22, 32, 16), 0.3, 4) + c.cut(c.ell(DOOR + 150, 470, 22, 32, 16), 0.3, 4), C.curtain2);
    w.x(c.poly(c.star(GATE - 170, 470, 11, 4, 4, 0)) + c.poly(c.star(DOOR + 150, 470, 11, 4, 4, 0)), C.sun);
    wallL.add(w.out() + cypress(c, 260, FEET - 60, 140) + cypress(c, 1380, FEET - 60, 120));
    /* the parade ground */
    const G = S.layer({ par: 0.4, sh: 3 });
    const gs = sheet().p(c.cut([[-900, FEET - 64], [2500, FEET - 64], [2500, 1700], [-900, 1700]], 0.8, 20), mix(C.sand, C.stone, 0.35));
    let pv = '';
    for (let y = FEET - 40; y < 1100; y += 34) pv += c.ribbon([[-900, y], [2500, y + c.rr(-3, 3)]], 1.2);
    gs.x(pv, shade(C.sand2, -0.12), 'opacity=".5"');
    G.add(gs.out());
    G.add(`<g transform="translate(1260 ${FEET - 30})">${standard(c, 300)}</g>`);

    /* Caesar above: a cameo on strings */
    const hl = S.layer({ par: 0.2, sh: 6 });
    const bust = `<g transform="translate(-4 70) scale(.5)">${caesar(c)}</g>`;
    const cam = hanging(hl, `${cameo(c, `<clipPath id="${S.id('cz')}"><circle r="50"/></clipPath><g clip-path="url(#${S.id('cz')})">${bust}</g>`, { r: 52 })}<g transform="translate(0 78)">${nameTag(c, tr('Cezar', 'Caesar'), { size: 16 })}</g>`, { x: CX, y: -1500, len: 900 });

    /* the people */
    const P = S.layer({ par: 0.4, sh: 5 });
    const jar = P.add(`<g>${bigJar(c, 58)}</g>`);
    const boy = S.puppet(P.add(person(c, HOUSEBOY)));
    const men = [0, 1, 2].map((i) => ({ i, p: S.puppet(P.add(soldier(c, i, { spear: 30 }))), seed: c.rr(0, 9) }));
    const comer = S.puppet(P.add(soldier(c, 3, { spear: 30 })));
    const cen = S.puppet(P.add(centurion(c)));
    const W = S.layer({ par: 0.42, sh: 3 });
    const say = [[tr('Idź!', 'Go!'), -1], [tr('Chodź!', 'Come!'), 1], [tr('Zrób to!', 'Do this!'), -1]].map(([s, d]) => W.add(`<g opacity="0">${bubble(c, s, { size: 22, dir: d })}</g>`));

    return (t, time) => {
      const T = time;
      pose(sunEl, { x: 1250, y: 140, r: T ? Math.sin(T * 0.6) : 0 });
      pose(cl, { x: 380 + (T ? Math.sin(T * 0.1) * 20 : 0), y: 170, r: T ? Math.sin(T * 0.6 + 1) : 0 });

      /* v8a — under authority: Caesar above; soldiers under him */
      const ck = es(t, 0.05, 0.35, ease.out);
      hangAt(cam, CX, lerp(-500, 220, ck), T, 1, 0.6);
      const salute = es(t, 0.3, 0.45) * (1 - es(t, 0.95, 1.05));
      const turn = t > 1.28 && t < 1.5;          // turns to the door to call "Come!"
      const order = bump(t, 1.02, 1.28) + bump(t, 1.28, 1.5) + bump(t, 1.5, 1.8);
      cen.set({ x: CX, y: FEET, s: 1.06, flip: turn, armF: 16 + order * 70, armB: 10 + salute * 150, head: -salute * 22 + order * 2, blink: blinkAt(T, 1) });
      // three soldiers march in from the left and line up facing him
      const LINE = [900, 990, 1080];
      men.forEach((m) => {
        let K;
        if (m.i === 2) K = [[0.34, -200], [0.66, LINE[2]], [1.08, LINE[2]], [1.4, 1450]];           // "Go!" — out through the gate
        else if (m.i === 1) K = [[0.36, -300], [0.68, LINE[1]]];
        else K = [[0.38, -400], [0.7, LINE[0]]];
        const x = kf(t, K);
        const going = m.i === 2 && t > 1.08;
        const salK = bump(t, 0.7, 0.98);
        m.p.set({ x, y: FEET + (m.i % 2) * 6, s: 1.0, flip: !going && t > 0.66, walk: moving(t, K) ? x * 0.05 + m.i : undefined, amt: 1.1, armF: 30, armB: salK * 120, head: 0, blink: blinkAt(T, m.seed) });
      });
      // "Come!": a fourth man comes in at the door and halts before him
      const K4 = [[1.3, DOOR], [1.52, CX - 124]];
      const x4 = kf(t, K4);
      comer.set({ x: x4, y: FEET + 4, s: 1.0, o: seg(t, 1.28, 1.34), walk: moving(t, K4) ? x4 * 0.05 : undefined, amt: 1.1, armF: 30, armB: bump(t, 1.52, 1.7) * 120, blink: blinkAt(T, 8) });
      /* the servant: "Do this!" — he lifts the jar and carries it */
      const lift = es(t, 1.55, 1.64);
      const carry = [[1.64, 1250], [2.1, 1560]];
      const bx = t < 1.64 ? 1250 : kf(t, carry);
      boy.set({ x: bx, y: FEET + 6, s: 0.84, flip: t < 1.64, walk: moving(t, carry) ? bx * 0.07 : undefined, armF: 20 + lift * 140, armB: lift * 40, head: -lift * 6, blink: blinkAt(T, 5) });
      const [hx, hy] = hand(bx, FEET + 6, 0.84, t < 1.64, 20 + lift * 140);
      pose(jar, { x: lerp(1200, hx, lift), y: lerp(FEET + 6, hy + 30, lift), r: lift * 16 });
      const [chx, chy] = headAt(CX, FEET, 1.06, turn);
      say.forEach((b, i) => {
        const a = [1.02, 1.28, 1.5][i];
        const k = es(t, a, a + 0.08, ease.back) * (1 - es(t, a + (i === 2 ? 0.4 : 0.22), a + (i === 2 ? 0.44 : 0.26)));
        pose(b, { x: chx + (i === 1 ? -30 : 30), y: chy - 40, s: k, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.y = -es(t, 0.05, 0.4) * 30 + es(t, 0.6, 0.9) * 30;
      S.cam.z = 1.02 + es(t, 1.0, 1.3) * 0.04;
    };
  },
};
