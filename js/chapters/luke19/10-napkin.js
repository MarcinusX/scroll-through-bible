// Łk 19,20–21 — the third servant comes before the throne and kneels; from his sash he takes a little knotted
// handkerchief and unties it: there lies the one mina, dull, just as it was given. "I was afraid of you, because you
// are a severe man": as he says it, the king's shadow rises huge on the wall behind the throne, a dark crowned giant —
// the master as his fear painted him — and he cowers. "You take up what you did not lay down, and reap what you did not
// sow": two painted plates come down — in one a dark hand sweeps the silver off another man's table, in the other a
// dark sickle cuts the wheat that another man sowed.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { hallSet, storyFrame, KH, NOBLE, SERV, crown, addToHead, mina, kerchief, kingShadow, hungPlate, lowTable, minaPile, cityToken, say, fig, headAt, hand, kf, tr, es, ease, bump, seg, PI, mix, shade, sheet } from './lib.js';
import { grass } from '../../assets/nature.js';
import { wheatStalk, sickle } from '../../assets/things.js';

const FL = KH.FL, KX = KH.THX, KY = FL - KH.DAIS * 2 - 58;
const TX = 596, PX = 760;
const PA = [640, 290], PB = [960, 280], PR = 108;
const DARK = mix(C.soilDark, C.plumRobe, 0.3);

export default {
  id: 'lk19-napkin',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 20 },
    { v: 21, text: 'Lękałem się bowiem ciebie, bo jesteś człowiekiem surowym:' },
    { v: 21, cont: true, text: 'chcesz brać, czegoś nie położył, i żąć, czegoś nie posiał".' },
  ],
  cam: { x: [-300, 60], y: [-80, 70], z: [1, 1.3] },
  build(S) {
    const H = hallSet(S);
    const c = S.c;
    /* the king's shadow on the wall */
    const shadow = H.shadowL.add(`<g>${kingShadow(c, DARK, { armF: 50, armB: 30 })}</g>`);
    const A = H.act;
    const king = S.puppet(A.add(addToHead(person(c, { ...NOBLE, pose: 'sit' }), crown(c))));
    A.add(`<g transform="translate(${TX} ${FL + 4})">${lowTable(c, 130, 40)}</g><g transform="translate(${TX - 30} ${FL - 40})">${minaPile(c, 11, 10)}</g><g transform="translate(${TX + 36} ${FL - 40})">${minaPile(c, 6, 10)}</g>`);
    const others = A.sprite(`<g transform="translate(-50 0) scale(-.86 .86)">${person(c, SERV[0])}</g><g transform="translate(20 6) scale(-.86 .86)">${person(c, SERV[1])}</g>`, 1180, FL + 8);
    const s3 = S.puppet(A.add(person(c, SERV[2])));
    const s3k = S.puppet(A.add(person(c, { ...SERV[2], pose: 'kneel' })));
    const K = kerchief(c);
    const kShut = A.add(`<g>${K.shut}</g>`);
    const kOpen = A.add(`<g>${K.open}</g>`);
    const coin = A.add(`<g>${dullMina(c)}</g>`);
    const fx = H.fx;
    const said = fx.add(`<g>${say(c, tr(['Panie, tu jest twoja mina,', 'zawinięta w chustce.'], ['Lord, here is your mina,', 'laid away in a handkerchief.']), { size: 18, side: 1 })}</g>`);
    const fear = fx.add(`<g>${say(c, tr(['Lękałem się ciebie,', 'jesteś człowiekiem surowym!'], ['I feared you: you are', 'an exacting man!']), { size: 18, side: 1 })}</g>`);
    /* the two plates of his fear */
    const pl = S.layer({ par: 0.3, sh: 5 });
    const plateA = pl.add(`<g>${hungPlate(S, c, PR, plateAInner(c), { face: mix(C.parchment, C.sand, 0.3) })}</g>`);
    const PBX = S.portrait ? 930 : PB[0];   // phone: clear of the progress thread
    const plateB = pl.add(`<g>${hungPlate(S, c, PR, plateBInner(c), { face: mix(C.skyBlue, C.cream, 0.4) })}</g>`);
    const pp = S.layer({ par: 0.3, sh: 3 });
    const coinsA = [0, 1, 2].map(() => pp.add(`<g>${mina(c, 8)}</g>`));
    const handA = pp.add(`<g>${darkHand(c)}</g>`);
    const wheat = pp.add(`<g>${wheatRow(c, 7)}</g>`);
    const stub = pp.add(`<g>${stubble(c, 7)}</g>`);
    const scy = pp.add(`<g><g transform="scale(.9) rotate(-30)">${sickle(c).replace(/fill="[^"]+"/g, `fill="${DARK}"`)}</g></g>`);
    storyFrame(S);

    return (t, time) => {
      const T = time;
      king.set({ x: KX + 4, y: KY, s: 1.02, flip: false, armF: 30, armB: 20, head: 6 + es(t, 1.1, 1.4) * 4, blink: blinkAt(T) });
      others.set({ x: 1180, y: FL + 8 });
      /* v20 — here is your mina, kept in a handkerchief */
      const come = es(t, -0.4, 0.3);
      const kn = es(t, 0.3, 0.34);
      const x3 = lerp(1100, PX, come);
      const cow = es(t, 1.1, 1.3);
      const shake = t > 1.1 ? Math.sin(T * 30) * 1.2 * cow : 0;
      s3.set({ x: x3, y: FL + 12, s: 0.9, flip: true, o: 1 - kn, walk: come > 0 && come < 1 ? x3 * 0.06 : undefined, armF: 30, armB: 20, head: 8, blink: blinkAt(T, 8) });
      s3k.set({ x: PX + shake, y: FL + 12, s: 0.9, flip: true, o: kn, armF: 70 - cow * 20, armB: 20 + cow * 110, head: 10 + cow * 8, lean: cow * 12, blink: blinkAt(T, 8) });
      const [hx, hy] = hand(PX, FL + 12, 0.9, true, 70 - cow * 20, 0, 46);
      const open = es(t, 0.4, 0.6);
      pose(kShut, { x: hx - 6, y: hy + 4, s: 0.9, o: kn * (1 - open) });
      pose(kOpen, { x: hx - 16 + shake, y: hy + 8, s: 0.9, o: open });
      pose(coin, { x: hx - 16 + shake, y: hy - 2, s: 0.9 + bump(t, 0.55, 0.9) * 0.3, o: open });
      const [shx, shy] = headAt(PX, FL + 12, 0.9, true, 46);
      const sk = es(t, 0.45, 0.6, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(said, { x: shx + 16, y: shy - 24, s: sk, o: sk > 0.02 ? 1 : 0 });
      /* v21a — I was afraid of you: you are a severe man */
      const fk = es(t, 1.05, 1.2, ease.back) * (1 - es(t, 1.95, 2.05));
      pose(fear, { x: shx + 16, y: shy - 24, s: fk, o: fk > 0.02 ? 1 : 0 });
      const rise = es(t, 1.1, 1.5);
      pose(shadow, { x: KX + 60 + rise * 90, y: FL + 30, s: lerp(1.1, 2.7, rise), o: Math.min(1, rise * 3) });
      /* v21b — you take what you did not lay down, and reap what you did not sow */
      const da = es(t, 2.02, 2.25, ease.back), db = es(t, 2.1, 2.33, ease.back);
      const ay = lerp(-1300, PA[1], da), by = lerp(-1300, PB[1], db);
      pose(plateA, { x: PA[0], y: ay, o: da > 0.001 ? 1 : 0 });
      pose(plateB, { x: PBX, y: by, o: db > 0.001 ? 1 : 0 });
      const grab = es(t, 2.35, 2.65);
      const back = es(t, 2.65, 2.85);
      pose(handA, { x: PA[0] + lerp(-40, 4, grab) - back * 50, y: ay + 16, s: 0.7, o: da > 0.001 ? es(t, 2.3, 2.4) * (1 - es(t, 2.9, 3.0) * 0) : 0 });
      coinsA.forEach((el, i) => { const x0 = PA[0] + 2 + i * 16, y0 = ay + 18; pose(el, { x: x0 - back * (50 + i * 6) * (grab >= 1 ? 1 : 0), y: y0 - back * 4, o: da > 0.001 && (back < 0.9) ? 1 : 0 }); });
      const cut = es(t, 2.4, 2.75);
      pose(wheat, { x: PBX - 10, y: by + 48, o: db > 0.001 ? 1 - es(t, 2.6, 2.7) : 0 });
      pose(stub, { x: PBX - 10, y: by + 48, o: db > 0.001 ? es(t, 2.6, 2.7) : 0 });
      pose(scy, { x: PBX + lerp(60, -60, cut), y: by + 10 + Math.sin(cut * PI) * 10, r: lerp(-20, 40, cut), o: db > 0.001 ? es(t, 2.3, 2.4) : 0 });

      S.cam.x = kf(t, [[-0.5, -60], [0.4, -120], [1.1, -160], [1.5, -160], [2.1, -120]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.4, 60], [1.1, 20], [2.1, -40]]);
      S.cam.z = kf(t, [[-0.5, 1.12], [0.4, 1.3], [1.1, 1.12], [2.1, 1.06]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, -60], [0.4, -140], [1.1, -140], [2.1, -40]]); S.cam.z = 1.0; }
      void cityToken; void shade; void sheet;
    };
  },
};
/** the one mina, dull and untouched (origin centre) */
function dullMina(c) {
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, 11, 16), 0.3, 3), mix(C.stone2, C.rock2, 0.6));
  s.p(c.cut(c.circ(0, 0, 8, 14), 0.2, 3), mix(C.stone, C.rock2, 0.35));
  s.x(c.poly(c.star(0, 0, 4.5, 2, 6, 0)), C.rock3);
  return s.out();
}
/** plate A: another man's table with his silver (the coins are separate pieces) */
function plateAInner(c) {
  const s = sheet();
  s.p(c.cut([[-120, 40], [120, 40], [120, 120], [-120, 120]], 0.4, 10), mix(C.stone, C.sand, 0.35));
  s.p(c.cut(c.rect(-20, 26, 90, 10), 0.3, 6), C.wood).p(c.cut(c.rect(-14, 36, 8, 40), 0.3, 4) + c.cut(c.rect(56, 36, 8, 40), 0.3, 4), C.wood2);
  return s.out() + fig(c, { robe: C.sageRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.leather }, { x: 96, y: 76, s: 0.46, flip: true, armF: 50, head: 6 });
}
/** plate B: a field another man sowed (the wheat and the sickle are separate pieces) */
function plateBInner(c) {
  const s = sheet();
  s.p(c.cut([[-120, 30], [120, 24], [120, 120], [-120, 120]], 0.4, 10), mix(C.soil, C.clay, 0.4));
  let furrows = '';
  for (let i = 0; i < 4; i++) furrows += c.ribbon([[-120, 44 + i * 16], [120, 40 + i * 16]], 2);
  s.x(furrows, C.soilDark, 'opacity=".4"');
  return s.out() + fig(c, { robe: C.wheatRobe, hair: C.hair, hairStyle: 'wrap', veil: C.stone, beard: 'full', skin: C.skin3, belt: C.rope }, { x: -66, y: 60, s: 0.42, flip: false, armF: 110, armB: 20, head: 6 });
}
/** a small dark hand reaching in, palm down (origin: finger tips) */
function darkHand(c) {
  return sheet().p(c.ribbon([[-60, -12], [-20, -4]], 16), DARK).p(c.cut([[-26, -14], [4, -12], [8, -4], [4, 4], [-26, 6]], 0.3, 4), shade(DARK, 0.08)).out();
}
function wheatRow(c, n) {
  let out = '';
  for (let i = 0; i < n; i++) out += `<g transform="translate(${i * 18 - (n - 1) * 9} 0)">${wheatStalk(c, { h: 70, color: C.wheat2, ear: C.wheat })}</g>`;
  return out;
}
function stubble(c, n) {
  const s = sheet();
  let d = '';
  for (let i = 0; i < n; i++) d += c.cut(c.rect(i * 18 - (n - 1) * 9 - 2, -14, 4, 14), 0.2, 3);
  s.p(d, C.wheat2);
  return s.out();
}
