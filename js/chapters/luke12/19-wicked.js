// Łk 12,45–48 — the same house, at night, the keys of the steward on his belt. "But if that servant says in his heart,
// 'My lord delays his coming'": he looks down the empty road, a thought-cloud over him with the master far away; he
// shrugs — and lifts his stick over a manservant and a maidservant, who cower; then he sprawls at the table among the
// wine jars, cup up, head lolling. "The lord of that servant will come in a day when he isn't expecting him": the master
// is suddenly in the gate with his lamp, and the cup drops; "and will cut him in two, and place his portion with the
// unfaithful": the house goes dark, and the servant's paper figure parts in two halves that sink away into the shadow.
// "The servant who knew his lord's will, and didn't prepare": a servant stands idle with the master's written orders in
// his hand, and on a slate hung beside him stroke after stroke is cut — many; "but he who didn't know": another, whose
// slate gets only two. "To whomever much is given, of him much will be required": in the morning light the master lays a
// heavy chest in one servant's arms and a single coin in another's hand — and over them hang a great basket and a
// little bowl, what each will be asked to bring back.
import { C, person, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { moon, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { lowTable } from '../mark2/lib.js';
import { behindOf, houseSet, HOUSE, MASTER, SERVANTS, STEWARD, SKIES, thought, zzz, keyProp, cudgel, wineJar, cup, coinChest, coin, lampBody, lampFire, WICK, palm, hand, headAt, orders, halo, warm, emptyBowl, PI } from './lib.js';
import { basket } from '../mark8/lib.js';

const F = HOUSE.FLOOR;
const SX = 700;

function slate(c, n, id) {
  const w = 150, h = 70;
  const s = sheet().p(c.cut(c.rect(-w / 2 - 6, -6, w + 12, h + 12), 0.5, 6), C.wood2).p(c.cut(c.rect(-w / 2, 0, w, h), 0.4, 6), mix(C.stone2, C.cream, 0.3)).out();
  const strokes = Array.from({ length: n }, (_, i) => `<path class="st" data-i="${i}" opacity="0" d="${c.ribbon([[-w / 2 + 14 + i * 10.5, 14], [-w / 2 + 10 + i * 10.5, h - 12]], 3)}" fill="${C.ink}"/>`).join('');
  return `<path d="M${-w * 0.3} -2400V-6M${w * 0.3} -2400V-6" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s}${strokes}`;
}

export default {
  id: 'lk12-wicked',
  parable: true,
  beats: [
    { v: 45 },
    { v: 46 },
    { v: 47 },
    { v: 48, text: 'Ten zaś, który nie zna jego woli i uczynił coś godnego kary, otrzyma małą chłostę.' },
    { v: 48, cont: true, text: 'Komu wiele dano, od tego wiele wymagać się będzie; a komu wiele zlecono, tym więcej od niego żądać będą.' },
  ],
  cam: { x: [-30, 90], y: [-70, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the master who comes back stands a step inside the gate, and the left slate hangs further in
    const PO = S.portrait, MX = PO ? 968 : 1010, SL = PO ? 595 : 560;
    const NIGHTC = mix(C.night, C.duskViolet, 0.3);
    sky(S, SKIES.night);
    const morn = sky(S, SKIES.morning, { name: 'morn', rise: 0 });
    morn.layer.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -800, x1: 2400, y0: -600, y1: 440, n: 110 }));
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const moonEl = hanging(hangL, `${halo(100, 0.5)}${moon(c, 28)}`, { x: 300, y: 160, len: 800 });
    const H = houseSet(S, { tintCol: NIGHTC, tintK: 0.3 });
    const P = S.layer({ par: 0.42, sh: 5 });
    const glowL = behindOf(S.layer({ par: 0.42, sh: 0, flat: true }), P);
    const table = P.add(`<g><g transform="scale(.6)">${lowTable(c, 300, 60)}</g><g transform="translate(-50 -26)">${wineJar(c, 50)}</g><g transform="translate(46 -26)">${wineJar(c, 40, C.clay)}</g></g>`);
    const servA = S.puppet(P.add(person(c, SERVANTS[0])));
    const servB = S.puppet(P.add(person(c, SERVANTS[1])));
    const steward = S.puppet(P.add(person(c, { ...STEWARD, holdB: `<g transform="rotate(-20)">${cudgel(c, 110)}</g>` })));
    const drunk = S.puppet(P.add(person(c, { ...STEWARD, pose: 'sit', eyes: 'closed', holdF: `<g transform="translate(-2 -4)">${cup(c, C.sun)}</g>` })));
    const fallCup = P.add(`<g opacity="0">${cup(c, C.sun)}</g>`);
    const master = S.puppet(P.add(person(c, MASTER)));
    const mBody = P.add(`<g opacity="0">${lampBody(c)}</g>`);
    const mFire = P.add(`<g opacity="0">${lampFire(c, 0)}</g>`);
    const mGlow = glowL.add(`<g opacity="0">${warm(120, 1)}</g>`);
    /* the two halves */
    const idL = S.id('halfL'), idR = S.id('halfR');
    S.defs(`<clipPath id="${idL}"><rect x="-200" y="-400" width="200" height="500"/></clipPath><clipPath id="${idR}"><rect x="0" y="-400" width="200" height="500"/></clipPath>`);
    const halfM = person(c, { ...STEWARD, pose: 'sit' });
    const halves = [idL, idR].map((id, i) => ({ i, el: P.add(`<g opacity="0"><g clip-path="url(#${id})">${halfM}</g></g>`) }));
    const darkL = S.layer({ par: 0, sh: 0, flat: true });
    darkL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#15183a"/>`);
    darkL.fade(0);
    /* v47–48: the two idle servants, the slates; morning: the master's gifts and what is asked */
    const Q = S.layer({ par: 0.44, sh: 5 });
    const knew = S.puppet(Q.add(person(c, { ...SERVANTS[2], holdF: `<g transform="translate(0 -10) scale(.8)">${orders(c)}</g>` })));
    const didnt = S.puppet(Q.add(person(c, SERVANTS[3])));
    const slates = [12, 2].map((n, i) => ({ i, n, el: Q.add(`<g transform="translate(0 -1500)">${slate(c, n)}</g>`) }));
    slates.forEach((s) => { s.st = Array.from(s.el.querySelectorAll('.st')); });
    const master2 = S.puppet(Q.add(person(c, MASTER)));
    const bigChest = Q.add(`<g opacity="0">${coinChest(c, 60)}</g>`);
    const oneCoin = Q.add(`<g opacity="0">${coin(c, 7)}</g>`);
    const asks = [`<g transform="translate(0 30)">${basket(c, { w: 90, h: 60 })}</g>`, `<g transform="translate(0 30) scale(1.4)">${emptyBowl(c, 30)}</g>`].map((m, i) => ({ i, el: Q.add(`<g transform="translate(0 -1500)"><path d="M0 -2400V-40" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${m}</g>`) }));
    const tc = P.add(`<g opacity="0">${thought(c, `<g transform="translate(0 6) scale(.22)">${person(c, MASTER)}</g><g transform="translate(14 -6) scale(.5)">${zzz(c)}</g>`, { w: 90, h: 70 })}</g>`);

    return (t, time) => {
      const T = time;
      pose(H.ovenEl.querySelector('.glow'), { x: 0, y: 0, o: 0.3 });
      pose(moonEl, { x: 300, y: 160, r: time ? Math.sin(T * 0.5) : 0, oy: 0 });
      /* v45 — "my lord delays"; he beats the servants; he eats, drinks, gets drunk */
      const think = es(t, 0.05, 0.2) * (1 - es(t, 0.35, 0.45));
      const beat = bump(t, 0.35, 0.65);
      const sprawl = es(t, 0.68, 0.76);
      const [shx, shy] = headAt(SX, F + 2, 0.98, false);
      pose(tc, { x: shx + 10, y: shy - 10, s: think, o: think > 0.01 ? 1 : 0 });
      steward.set({ x: SX, y: F + 2, s: 0.98, flip: t > 0.3, o: 1 - sprawl, armF: 20 + bump(t, 0.2, 0.35) * 40, armB: 10 + beat * 140, head: t < 0.3 ? -6 : 4, lean: beat * 6, blink: blinkAt(T, 1) });
      const cower = bump(t, 0.38, 0.8);
      servA.set({ x: 540, y: F + 6, s: 0.94, o: 1 - es(t, 1.9, 2.0), armF: 20 + cower * 120, armB: 10 + cower * 130, head: 10 + cower * 14, lean: -cower * 14, blink: blinkAt(T, 3) });
      servB.set({ x: 610, y: F + 2, s: 0.92, o: 1 - es(t, 1.9, 2.0), armF: 20 + cower * 110, armB: 10 + cower * 120, head: 12 + cower * 10, lean: -cower * 10, blink: blinkAt(T, 4) });
      const surprise = es(t, 1.08, 1.18);
      const drop = es(t, 1.15, 1.3, ease.in);
      const split = es(t, 1.4, 1.6);
      drunk.set({ x: SX + 30, y: F + 6, s: 0.98, o: sprawl * (1 - seg(t, 1.38, 1.42)), armF: 60 + bump(t, 0.76, 1.0) * 70 - surprise * 40, armB: 20 + surprise * 60, head: -20 + surprise * 10, lean: -14 + surprise * 10, blink: surprise > 0.5 ? 0 : 1 });
      pose(table, { x: SX + 110, y: F + 14, o: 1 - es(t, 1.9, 2.0) });
      const [cx0, cy0] = palm(SX + 30, F + 6, 0.98, false, 60 + 70 - 40, 62);
      pose(fallCup, { x: cx0 + drop * 20, y: lerp(cy0, F + 4, drop), r: drop * 110, o: drop > 0 && t < 1.9 ? 1 : 0 });
      /* v46 — the master comes when he does not expect; his portion with the unfaithful */
      const comeIn = es(t, 1.02, 1.1);
      master.set({ x: MX, y: F + 4, s: 0.96, flip: true, o: comeIn * (1 - es(t, 1.85, 1.95)), armF: 70, armB: 20 + bump(t, 1.2, 1.6) * 60, head: 4, blink: blinkAt(T, 7) });
      const [mpx, mpy] = palm(MX, F + 4, 0.96, true, 70);
      pose(mBody, { x: mpx, y: mpy, sx: -1, o: comeIn * (1 - es(t, 1.85, 1.95)) });
      pose(mFire, { x: mpx - WICK[0], y: mpy + WICK[1], o: comeIn * (1 - es(t, 1.85, 1.95)) });
      pose(mGlow, { x: mpx - WICK[0], y: mpy - 10, o: comeIn * (1 - es(t, 1.85, 1.95)) });
      pose(H.gateDoor, { x: HOUSE.GATE - 36, y: F + 38, sx: 1 - comeIn * 0.8 });
      darkL.fade(split * 0.55 * (1 - es(t, 1.9, 2.05)));
      halves.forEach((h) => {
        const sink = es(t, 1.55, 1.95, ease.in);
        pose(h.el, { x: SX + 30 + (h.i ? 1 : -1) * split * 30, y: F + 6 + sink * 120, r: (h.i ? 1 : -1) * split * 14, s: 0.98, o: seg(t, 1.38, 1.42) * (1 - sink) });
      });

      /* v47 / v48a — many stripes, few stripes */
      const inQ = seg(t, 1.95, 2.05);
      didnt.set({ x: 900, y: F + 6, s: 0.96, flip: true, o: seg(t, 2.95, 3.05), armF: 16, armB: 6, head: 12, blink: blinkAt(T, 6) });
      slates.forEach((s) => {
        const a = 2.05 + s.i;
        const k = es(t, a, a + 0.22, ease.out) * (1 - es(t, 3.95, 4.15, ease.in));
        pose(s.el, { x: s.i ? 900 : SL, y: lerp(-1500, 400, k), r: time ? Math.sin(T * 0.8 + s.i) * 1 : 0, oy: 0 });
        s.st.forEach((st, j) => fade(st, es(t, a + 0.25 + j * (s.i ? 0.15 : 0.04), a + 0.3 + j * (s.i ? 0.15 : 0.04))));
      });
      /* v48b — much given, much required */
      const day = es(t, 3.95, 4.2);
      morn.layer.fade(day);
      starL.fade(1 - day);
      const give = es(t, 4.2, 4.4), give2 = es(t, 4.4, 4.55);
      master2.set({ x: 730, y: F + 4, s: 0.98, flip: give2 > 0.5, o: day, armF: 30 + bump(t, 4.15, 4.45) * 50 + bump(t, 4.38, 4.6) * 50 + es(t, 4.6, 4.8) * 20, armB: 10 + es(t, 4.6, 4.8) * 110, head: 0, blink: blinkAt(T, 7) });
      knew.set({ x: 560, y: F + 4, s: 0.96, o: inQ, armF: day > 0 ? 70 : 40, armB: day > 0 ? 70 : 6, head: day > 0 ? 4 : 10, blink: blinkAt(T, 5) });
      const [ka, kb] = palm(560, F + 4, 0.96, false, 70);
      pose(bigChest, { x: lerp(730, ka + 6, give), y: lerp(F - 70, kb + 30, give), s: 1, o: give > 0.02 ? 1 : 0 });
      const [da, db] = palm(900, F + 6, 0.96, true, 16);
      pose(oneCoin, { x: lerp(760, da, give2), y: lerp(F - 90, db - 4, give2), o: give2 > 0.02 ? 1 : 0 });
      asks.forEach((a) => {
        const k = es(t, 4.45 + a.i * 0.06, 4.66 + a.i * 0.06, ease.out);
        pose(a.el, { x: a.i ? 900 : 560, y: lerp(-1500, 400, k), r: time ? Math.sin(T * 0.8 + a.i) * 1.5 : 0, oy: 0 });
      });

      S.cam.x = lerp(0, 60, es(t, 1.0, 1.1)) - es(t, 1.3, 1.6) * 60 + es(t, 2.95, 3.2) * 40 - es(t, 3.95, 4.2) * 40;
      S.cam.y = -es(t, 1.95, 2.2) * 60;
      S.cam.z = 1.06 - es(t, 1.95, 2.2) * 0.04;
    };
  },
};
