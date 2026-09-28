// Mt 6,2–4 — a street of a Galilean town before the synagogue. A herald blows a trumpet and a hypocrite in fine
// robes parades down the steps to the beggar at the door opposite; he drops his coin with his arm held high and the
// street turns and claps. "They have received their reward": a paper wreath comes down on its string onto his head —
// and dries while they are still clapping. Then night on the same street: a plain man comes by, and while his left
// hand hides under his mantle his right slips a coin into the sleeping beggar's bowl (a close-up hangs above); he goes
// on into the dark and nobody sees. "Your Father, who sees in secret": a thin shaft of light finds him in the dark
// street, and a gold star comes down into his hands.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, sun, moon, stars, olive, palm } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  NOON, NIGHT, hypocrite, QUIET, BEGGAR, manOf, womanOf, synagogue, streetRow, street, trumpet, blast, clapMarks, wreath, dryLeaf,
  beggarBowl, coin, secretShaft, rewardStar, strip, handAt, kf, moving, tr, PI,
} from './lib.js';

const GY = 700;                  // where people stand
const BX = 1010;                 // the beggar at the door
const SX = 520;                  // the synagogue

/** a big paper hand (fingers along +x), with a sleeve; origin at the wrist */
function bigHand(c, { skin = C.skin3, sleeve = C.sageRobe, open = true } = {}) {
  const s = sheet();
  s.p(c.cut([[-90, -26], [4, -22], [6, 22], [-90, 26]], 0.6, 8), sleeve);
  s.x(c.ribbon([[-80, -14], [-4, -12]], 2), shade(sleeve, -0.2), 'opacity=".5"');
  const palm = open
    ? [[0, -20], [30, -24], [58, -20], [62, -12], [34, -10], [60, -4], [64, 4], [36, 4], [58, 10], [58, 18], [30, 16], [44, 24], [36, 30], [8, 22], [0, 18]]
    : [[0, -20], [34, -22], [46, -12], [46, 12], [34, 22], [0, 20]];
  s.p(c.cut(palm, 0.4, 5), skin);
  s.p(c.cut([[12, -18], [22, -34], [32, -34], [26, -16]], 0.3, 4), skin);
  return s.out();
}

export default {
  id: 'mt6-alms',
  enter: 'fly',
  beats: [
    { v: 2, text: 'Kiedy więc dajesz jałmużnę, nie trąb przed sobą, jak obłudnicy czynią w synagogach i na ulicach, aby ich ludzie chwalili.' },
    { v: 2, cont: true, text: 'Zaprawdę, powiadam wam: ci otrzymali już swoją nagrodę.' },
    { v: 3 },
    { v: 4, text: 'aby twoja jałmużna pozostała w ukryciu.' },
    { v: 4, cont: true, text: 'A Ojciec twój, który widzi w ukryciu, odda tobie.' },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    sky(S, NOON);
    const night = sky(S, NIGHT, { name: 'night' }).layer;
    night.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -700, x1: 2300, y0: -600, y1: 380, n: 90 }));
    starL.fade(0);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 42), { x: 1250, y: 150, len: 800 });
    const moonEl = hanging(hangL, moon(c, 34), { x: 1210, y: 150, len: 800 });

    /* the hills, the houses along the street, the synagogue, the door opposite */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 430, amps: [14, 6, 3], lens: [1000, 340, 120], color: C.hillFar }).markup);
    const hl = S.layer({ par: 0.16, sh: 3 });
    hl.add(hillsWith(c, { y: 470, amps: [10, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 14, treeColor: C.sage, treeH: 20 }).markup);
    const row = S.layer({ par: 0.3, sh: 4 });
    row.add(streetRow(c, { base: 600, skip: [[260, 780]] }) + palm(c, 860, 604, 160) + olive(c, 1400, 606, 0.7));
    const synL = S.layer({ par: 0.4, sh: 4 });
    synL.add(`<g transform="translate(${SX} 646)">${synagogue(c, { w: 400, h: 270 })}</g>`);
    const doorL = S.layer({ par: 0.45, sh: 4 });
    const ds = sheet();
    ds.p(c.cut(c.rect(BX - 20, 450, 240, 250), 0.5, 8), C.plaster);
    ds.p(c.cut(c.rect(BX - 30, 438, 260, 16), 0.4, 8), C.roof);
    ds.p(c.cut([[BX + 40, 700], [BX + 40, 560], ...c.arc(BX + 80, 560, 40, 36, PI, 2 * PI, 10), [BX + 120, 700]], 0.4, 6), C.wood2);
    doorL.add(ds.out());
    const winL = doorL.add(`<g><circle cx="${BX + 180}" cy="520" r="60" fill="url(#warm-glow)"/><path d="${c.poly(c.rect(BX + 166, 504, 28, 24))}" fill="${C.lampFlame}"/></g>`);
    const ground = S.layer({ par: 0.45, sh: 3 });
    ground.add(street(c, { y: 646 }));

    /* night falls over the street: a flat tint over the set (the people get a lighter one) */
    const tintL = S.layer({ par: 0, sh: 0, flat: true, rise: 0 });
    tintL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${mix(C.night, C.indigo, 0.4)}" opacity=".4"/>`);
    tintL.fade(0);

    /* the herald (upstage, ahead of him) */
    const backAct = S.layer({ par: 0.45, sh: 5 });
    const herald = S.puppet(backAct.add(person(c, { robe: C.terracotta, mantle: null, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin3, belt: C.ochre, holdF: `<g transform="rotate(62)">${trumpet(c, 130)}</g>` })));
    const blastEl = backAct.add(`<g>${blast(c)}</g>`);

    /* the street's people (they turn and clap) */
    const folkL = S.layer({ par: 0.45, sh: 5 });
    const FOLK = [
      { o: womanOf(c), x: 300, flip: false }, { o: manOf(c), x: 380, flip: false }, { o: manOf(c, { mantle: C.clayMantle }), x: 690, flip: true, y: -30, s: 0.84 },
      { o: womanOf(c, { robe: C.tealRobe }), x: 1210, flip: true }, { o: manOf(c), x: 1290, flip: true },
    ].map((f, i) => ({ y: 0, s: 0.92, ...f, i, p: S.puppet(folkL.add(person(c, f.o))), claps: folkL.add(`<g>${clapMarks(c, 12)}</g>`), seed: c.rr(0, 9) }));

    /* the beggar at the door, his bowl */
    const act = S.layer({ par: 0.45, sh: 5 });
    const beg = S.puppet(act.add(person(c, { ...BEGGAR, pose: 'sit' })));
    const begSleep = S.puppet(act.add(person(c, { ...BEGGAR, pose: 'sit', eyes: 'closed' })));
    const bowl = act.add(`<g>${beggarBowl(c)}</g>`);
    const glint = act.add(`<g><circle r="16" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 7, 1.6, 4, 0))}" fill="${C.star}"/></g>`);

    /* the Father who sees in secret: the shaft (behind the people) */
    const lightL = S.layer({ par: 0.45, sh: 0, flat: true });
    const shaft = lightL.add(`<g>${secretShaft(c, { w1: 190 })}</g>`);

    /* the hypocrite, the wreath */
    const front = S.layer({ par: 0.45, sh: 5 });
    const hyp = S.puppet(front.add(person(c, { ...hypocrite(0), holdF: `<g transform="translate(0 4)">${coin(c, 6)}</g>` })));
    const hypCoin = hyp.el.querySelector('.hold');
    const wr = hanging(front, `<g data-k="wrG">${wreath(c, { r: 25 })}</g><g data-k="wrD" opacity="0">${wreath(c, { r: 25, dry: true })}</g>`, { x: 0, y: 0, len: 900 });
    const wrG = S.$('wrG'), wrD = S.$('wrD');
    const reward = front.add(`<g>${strip(c, tr('nagroda', 'their reward'), { size: 17 })}</g>`);
    const leaves = [0, 1, 2, 3, 4, 5].map((i) => front.add(`<g>${dryLeaf(c)}</g>`));
    const fallCoin = front.add(`<g>${coin(c, 6)}</g>`);

    /* the quiet man at night */
    const quiet = S.puppet(front.add(person(c, { ...QUIET, holdF: `<g data-k="qcoin">${coin(c, 6)}</g>` })));
    const qcoin = S.$('qcoin');
    const starEl = front.add(`<g>${rewardStar(c, 15)}</g>`);
    const dimL = S.layer({ par: 0, sh: 0, flat: true, rise: 0 });
    dimL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night}" opacity=".14"/>`);
    dimL.fade(0);

    /* the close-up: a little curtain comes down between the hands; the right one gives */
    const closeL = S.layer({ par: 0.1, sh: 6 });
    const R = 124;
    S.defs(`<clipPath id="${S.id('clip')}"><circle r="${R}"/></clipPath>`);
    const frame = sheet().p(c.cut(c.circ(0, 0, R + 12, 48), 0.5, 6) + c.hole(c.circ(0, 0, R, 48), 0.3, 6), C.wood3).out();
    const drape = sheet().p(c.cut([[-26, -140], [26, -140], [30, 130], [-30, 130]], 0.8, 8), C.curtain);
    let folds = '';
    for (let x = -20; x <= 20; x += 13) folds += c.ribbon([[x, -140], [x + c.rr(-3, 3), 130]], 4);
    drape.x(folds, C.curtain2, 'opacity=".5"');
    const close = hanging(closeL, `<g clip-path="url(#${S.id('clip')})"><circle r="${R}" fill="${mix(C.night, C.plaster2, 0.6)}"/><g transform="translate(56 92) scale(2)">${beggarBowl(c)}</g><g data-k="cLeft">${bigHand(c)}</g><g data-k="cRight">${bigHand(c)}</g><g data-k="cCoin">${coin(c, 11)}</g><g data-k="cDrape">${drape.out()}</g></g>${frame}`, { x: 0, y: 0, len: 900 });
    const cRight = S.$('cRight'), cLeft = S.$('cLeft'), cDrape = S.$('cDrape'), cCoin = S.$('cCoin');

    return (t, time) => {
      const T = time;
      /* day → night */
      const nk = es(t, 1.85, 2.3);
      night.fade(nk); starL.fade(nk); tintL.fade(nk); dimL.fade(nk);
      pose(sunEl, { x: 1250, y: 150 - nk * 400, r: T ? Math.sin(T * 0.6) : 0, o: 1 - nk });
      pose(moonEl, { x: 1210, y: lerp(-300, 150, nk), r: T ? Math.sin(T * 0.6 + 1) : 0, o: nk });
      pose(winL, { o: nk });
      const gone = es(t, 1.9, 2.1);

      /* v2a — the herald ahead, the hypocrite behind him, down to the beggar */
      const walk = es(t, 0.04, 0.6, (u) => u);
      const hx = lerp(520, 880, walk);
      const hw = walk > 0 && walk < 1;
      const hdx = lerp(700, 1110, es(t, 0.02, 0.56, (u) => u));
      const hdw = t > 0.02 && t < 0.56;
      herald.set({ x: hdx, y: GY - 34, s: 0.84, walk: hdw ? hdx * 0.07 : undefined, armF: 70, armB: 20, head: -8, blink: blinkAt(T, 3), o: 1 - gone });
      const [bx, by] = handAt(hdx, GY - 34, 0.84, false, 70);
      const blow = t > 0.05 && t < 1.2 ? 1 : 0;
      pose(blastEl, { x: bx + 108, y: by - 44, s: 1.1 + (T ? Math.sin(T * 9) * 0.12 : 0), r: -20, o: blow * (1 - gone) });
      const lift = es(t, 0.5, 0.64) * (1 - es(t, 0.9, 1.05));
      hyp.set({ x: hx, y: GY + 10, s: 1.02, walk: hw ? hx * 0.06 : undefined, armF: 20 + lift * 110, armB: 10 + lift * 30, head: -lift * 6 + es(t, 1.1, 1.3) * 4, blink: blinkAt(T, 1), o: 1 - gone });
      const [cx, cy] = handAt(hx, GY + 10, 1.02, false, 20 + lift * 110);
      const fall = es(t, 0.8, 0.9);
      pose(fallCoin, { x: lerp(cx, BX - 50, fall), y: lerp(cy + 4, GY + 12, fall), o: fall > 0 && fall < 1 ? 1 : 0 });
      fade(hypCoin, fall > 0 ? 0 : 1);
      // the street turns and claps
      FOLK.forEach((f) => {
        const look = es(t, 0.15 + f.i * 0.04, 0.35 + f.i * 0.04);
        const clap = es(t, 0.7, 0.8) * (1 - es(t, 1.6, 1.8));
        const flip = look > 0.5 ? f.x > hx : f.flip;
        const beat = T ? Math.abs(Math.sin(T * 7 + f.i)) : 0.5;
        const y = GY + 12 + f.y + (f.i % 2) * 8;
        f.p.set({ x: f.x, y, s: f.s, flip, armF: 30 + clap * (50 + beat * 20), armB: 20 + clap * (50 + beat * 16), head: -look * 4, blink: blinkAt(T, f.seed), o: 1 - gone });
        const [kx, ky] = handAt(f.x, y, f.s, flip, 70);
        pose(f.claps, { x: kx, y: ky - 20, s: clap * (0.8 + beat * 0.3), o: clap * (1 - gone) });
      });

      /* v2b — the wreath comes down onto his head, and dries while they clap */
      const wk = es(t, 1.04, 1.32, ease.out);
      const hhx = hx + 2, hhy = GY + 10 - 167 * 1.02;
      pose(wr, { x: hhx, y: lerp(-500, hhy - 8, wk), r: T ? Math.sin(T * 0.9) * 1.5 * (1 - wk) : 0, o: wk > 0.01 ? 1 - gone : 0 });
      const dry = es(t, 1.42, 1.66);
      fade(wrG, 1 - dry); fade(wrD, dry);
      const rk = es(t, 1.2, 1.36, ease.back);
      pose(reward, { x: hhx + 4, y: hhy - 52, s: rk, r: -4, o: rk > 0.02 ? 1 - gone : 0 });
      leaves.forEach((l, i) => {
        const k = seg(t, 1.48 + i * 0.05, 1.98 + i * 0.02);
        pose(l, { x: hhx + (i - 2.5) * 12 + Math.sin(k * 6 + i) * 12, y: hhy + k * 190, r: k * 300 + i * 40, o: k > 0 && k < 1 ? 1 - gone : 0 });
      });

      /* the beggar: awake by day, asleep at night; wakes to the coin at the end */
      const asleep = seg(t, 2.0, 2.05) * (1 - es(t, 4.55, 4.62));
      const wake = es(t, 4.6, 4.9);
      beg.set({ x: BX, y: GY + 20, s: 0.9, flip: true, armF: 50 + bump(t, 0.7, 1.0) * 30 + wake * 40, armB: 10, head: 6 - wake * 10, blink: blinkAt(T, 5), o: 1 - asleep });
      begSleep.set({ x: BX, y: GY + 20, s: 0.9, flip: true, armF: 30, armB: 10, head: 18, lean: -4, o: asleep });
      pose(bowl, { x: BX - 52, y: GY + 22 });
      const gl = es(t, 3.05, 3.25);
      pose(glint, { x: BX - 52, y: GY, s: gl * (1 + (T ? Math.sin(T * 3) * 0.2 : 0)), r: T * 20, o: gl });

      /* v3 — the quiet man at night; he gives with his right hand */
      const QK = [[2.05, 200], [2.5, BX - 130], [3.15, BX - 130], [3.85, 660]];
      const qx = kf(t, QK);
      const qm = moving(t, QK);
      const give = es(t, 2.52, 2.7) * (1 - es(t, 2.95, 3.1));
      const lookUp = es(t, 4.1, 4.35);
      const recv = es(t, 4.3, 4.55);
      quiet.set({ x: qx, y: GY + 12, s: 0.98, flip: t > 3.1, walk: qm ? qx * 0.06 : undefined, armF: 12 + give * 58 + recv * 62, armB: 6 + recv * 56, head: give * 12 - lookUp * 12, lean: give * 6, blink: blinkAt(T, 2), o: seg(t, 2.02, 2.08) });
      fade(qcoin, t < 2.8 ? 1 : 0);
      // the close-up plate: the left hand, a curtain comes down, the right hand gives
      const ck = es(t, 2.1, 2.42, ease.out) * (1 - es(t, 3.25, 3.55, ease.in));
      pose(close, { x: 780, y: lerp(-500, 240, ck), r: T ? Math.sin(T * 0.8) * 1.4 : 0, o: ck > 0.01 ? 1 : 0 });
      const dr = es(t, 2.3, 2.5, ease.out);
      pose(cDrape, { x: -6, y: lerp(-280, 0, dr) });
      pose(cLeft, { x: -34, y: -24, r: 180, sy: -1 });
      const rg = es(t, 2.45, 2.7);
      pose(cRight, { x: 40, y: -40 + rg * 26, r: 16 + rg * 22 });
      const cf = es(t, 2.72, 2.92);
      pose(cCoin, { x: 84 + rg * 4 - cf * 20, y: -26 + rg * 40 + cf * 90, o: cf < 1 ? 1 : 0 });

      /* v4b — the shaft of light finds him; a gold star comes down into his hands */
      const sk = es(t, 4.02, 4.3);
      pose(shaft, { x: 660, y: GY + 16, sx: 0.3 + sk * 0.7, o: sk });
      const st = es(t, 4.2, 4.55, ease.out);
      const [rx, ry] = handAt(660, GY + 12, 0.98, true, 74);
      pose(starEl, { x: rx - 8, y: lerp(-100, ry - 10, st) + (T ? Math.sin(T * 2) * 3 : 0) * st, s: 0.8 + st * 0.3, r: T * 25, o: st > 0.01 ? 1 : 0 });

      /* camera: the street, then along with him */
      S.cam.z = 1 + es(t, 0.1, 0.8) * 0.06 - es(t, 1.9, 2.2) * 0.06 + es(t, 3.9, 4.4) * 0.08;
      S.cam.x = lerp(-20, 30, es(t, 0.0, 0.9)) + es(t, 2.0, 2.6) * 10 - es(t, 3.3, 4.1) * 50;
      S.cam.y = -es(t, 1.1, 1.4) * 30 + es(t, 1.9, 2.3) * 10 + es(t, 3.9, 4.4) * 20;
    };
  },
};
