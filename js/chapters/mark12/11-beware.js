// Mk 12,38–40 — "Beware of the scribes." A warning tag drops by Jesus; then a painted panel plays little
// comic vignettes: a scribe parades his long trailing robe through the market where everyone bows;
// he climbs to the seat of honour, slides into the top place at the feast; a widow's little house vanishes
// into his purse while his long prayer unrolls to the floor… and a dark cloud of judgment gathers over him.
import { C, person, CAST, blinkAt, pose, lerp, crowd, hanging, mix, shade } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, scribe, townsfolk, voiceRings, bubble, warnTag, robeTrain, honourSeat, littleHouse, longScroll, purse, sheet, sparkle } from './lib.js';
import { lowTable, bowl, cup } from '../mark2/lib.js';
import { stormCloud, lightning } from '../../assets/things.js';

const JX = 720;
const PX0 = 560, PX1 = 1040, PY0 = 150, PY1 = 430;
const GROUND = 414;

export default {
  id: 'm12-beware',
  beats: [
    { v: 38, text: 'I nauczając dalej mówił: «Strzeżcie się uczonych w Piśmie.' },
    { v: 38, cont: true, text: 'Z upodobaniem chodzą oni w powłóczystych szatach, lubią pozdrowienia na rynku,' },
    { v: 39 },
    { v: 40, text: 'Objadają domy wdów i dla pozoru odprawiają długie modlitwy.' },
    { v: 40, cont: true, text: 'Ci tym surowszy dostaną wyrok».' },
  ],
  cam: { x: [-30, 30], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const P = S.portrait;   // phone: the right-hand listeners and sitters clear of the thread
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    const sitters = crowd(S, stepL, [{ y: 604, s: 0.66, n: 5, x0: 380, x1: 640, pose: 'sit' }, { y: 604, s: 0.66, n: 4, x0: 960, x1: P ? 1060 : 1220, pose: 'sit' }]);

    /* the panel of vignettes */
    const pan = S.layer({ par: 0.3, sh: 6 });
    const ps = sheet();
    ps.p(c.cut([[PX0 - 10, PY0 - 10], [PX1 + 10, PY0 - 12], [PX1 + 12, PY1 + 10], [PX0 - 12, PY1 + 12]], 0.6, 10), C.wood3);
    ps.p(c.cut([[PX0, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.skyBlue, C.parchment, 0.4));
    // a street of houses behind
    let hs = '';
    let wins = '';
    for (let x = PX0 + 140; x < PX1 - 20; x += 74) { const h = c.rr(110, 190); hs += c.cut(c.rect(x, GROUND - h, 68, h), 0.4, 6); wins += c.cut(c.rect(x + 24, GROUND - h + 24, 16, 20), 0.2, 3); }
    ps.p(hs, mix(C.plaster2, C.sand, 0.35)).x(wins, mix(C.soilDark, C.plaster2, 0.5));
    ps.p(c.cut([[PX0, GROUND], [PX1, GROUND - 2], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.sand, C.stone, 0.4));
    // a market stall with a striped awning on the left
    const aw = [[PX0 + 6, 300], [PX0 + 120, 294], [PX0 + 126, 318]];
    for (let x = PX0 + 126; x > PX0; x -= 21) aw.push(...c.arc(x - 10.5, 318, 10.5, 7, 0, Math.PI, 4));
    ps.p(c.cut([[PX0 + 14, GROUND], [PX0 + 14, 318], [PX0 + 22, 318], [PX0 + 22, GROUND]], 0.3, 5) + c.cut([[PX0 + 108, GROUND], [PX0 + 108, 318], [PX0 + 116, 318], [PX0 + 116, GROUND]], 0.3, 5), C.wood2);
    ps.p(c.cut(aw, 0.4, 6), C.cream).x(c.cut([[PX0 + 30, 318], [PX0 + 38, 296], [PX0 + 58, 296], [PX0 + 54, 318]], 0.3, 5) + c.cut([[PX0 + 74, 318], [PX0 + 80, 295], [PX0 + 100, 295], [PX0 + 98, 318]], 0.3, 5), C.terracotta, 'opacity=".8"');
    ps.p(c.cut(c.rect(PX0 + 10, GROUND - 40, 112, 40), 0.4, 5), C.wood);
    ps.p(c.cut(c.blob(PX0 + 40, GROUND - 44, 18, 8, 8, 0.2), 0.3, 4) + c.cut(c.blob(PX0 + 90, GROUND - 44, 18, 8, 8, 0.2), 0.3, 4), C.wheat2);
    const panelEl = pan.add(`<g><path d="M${PX0 + 20} -1400V${PY0 - 10}M${PX1 - 20} -1400V${PY0 - 10}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${ps.out()}</g>`);
    const greeters = [0, 1].map((i) => ({ i, p: S.puppet(pan.add(person(c, townsfolk(c, { man: !i })))) }));
    const hello = pan.add(`<g>${bubble(c, tr('Pokój, Rabbi!', 'Peace, Rabbi!'), { size: 15, tail: 1 })}</g>`);
    const seat = pan.add(`<g>${honourSeat(c)}</g>`);
    const table = pan.add(`<g>${lowTable(c, 200, 34)}<g transform="translate(-40 -34)">${bowl(c, { w: 26 })}</g><g transform="translate(20 -34)">${cup(c)}</g><g transform="translate(60 -34)">${bowl(c, { w: 22, food: 'fruit' })}</g></g>`);
    const guests = [0, 1].map((i) => ({ i, p: S.puppet(pan.add(person(c, { ...townsfolk(c, { man: true }), pose: 'sit' }))) }));
    const house = pan.add(`<g>${littleHouse(c, 60, 48)}</g>`);
    const scrollEl = pan.add(`<g>${longScroll(c, 210, 38)}</g>`);
    const sc = scribe(c, 0);
    const vain = S.puppet(pan.add(person(c, { ...sc, holdF: '', holdB: `<g transform="translate(0 -4)">${purse(c)}</g>` }).replace('<g class="body">', `<g class="body">${robeTrain(c, 130, sc.robe)}`)));
    const vainSit = S.puppet(pan.add(person(c, { ...sc, holdF: '', pose: 'sit' })));
    const cloud = pan.add(`<g>${stormCloud(c, 190)}<g data-part="bolt" opacity="0" transform="translate(-10 20) scale(.35)">${lightning(c, 300)}</g></g>`);
    const bolt = cloud.querySelector('[data-part="bolt"]');

    /* people in the court */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const crowdS = crowd(S, pl, [{ y: F + 8, s: 0.86, n: 3, x0: 300, x1: 470 }, { y: F + 12, s: 0.86, n: 3, x0: P ? 1010 : 1150, x1: P ? 1070 : 1320 }]);
    const scribes = [1, 2].map((i, k) => ({ k, p: S.puppet(pl.add(person(c, scribe(c, i)))), x: 980 + k * 70, seed: c.rr(0, 9) }));
    const dis = [CAST.peter, CAST.john, CAST.andrew].map((o, i) => ({ p: S.puppet(pl.add(person(c, o))), x: 600 - i * 56, i }));
    const jesus = S.puppet(pl.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(pl, c, { n: 3, r: 26, w: 4 });
    const tagEl = hanging(pl, warnTag(c), { x: JX - 90, y: -300, len: 500 });

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);

      /* v38a — the warning */
      const tk = es(t, 0.15, 0.5, ease.out) * (1 - es(t, 1.0, 1.25, ease.in));
      pose(tagEl, { x: JX - 96, y: lerp(-800, F - 300, tk), r: Math.sin(T * 1.3) * 3 });
      jesus.set({ x: JX, y: F, s: 1.02, blink: blinkAt(T), armF: 50 + Math.sin(T * 1.4) * 6, armB: 30 + bump(t, 0.1, 1.0) * 120, head: -bump(t, 1.1, 4.9) * 8 });
      voice(JX + 26, F - 176, 1, T, { dir: 1 });
      scribes.forEach((s) => {
        const turn = es(t, 0.3, 0.6);
        s.p.set({ x: s.x, y: F + 4 + s.k * 8, s: 0.92, flip: turn < 0.5, head: -turn * 10 - 4 + bump(t, 4.1, 4.9) * 14, armF: 30 + turn * 20, armB: 30, lean: -turn * 3, blink: blinkAt(T, s.seed) });
      });
      dis.forEach((d) => d.p.set({ x: d.x, y: F + 10 + (d.i % 2) * 8, s: 0.9, head: -bump(t, 1.1, 4.9) * 10, blink: blinkAt(T, d.i + 3) }));
      [...crowdS, ...sitters].forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > 800, head: -bump(t, 1.1, 4.9) * 14 - 4, armF: bump(t, 1.2, 1.9) * (m.i % 3 === 0 ? 50 : 0), blink: blinkAt(T, m.seed) }));

      /* the vignettes */
      const pd = es(t, 1.0, 1.35, ease.out);
      const dy = lerp(-900, 0, pd);
      pose(panelEl, { y: dy });
      // v38b: the long robe parades through the market; people bow and greet
      const walkK = es(t, 1.15, 1.7);
      let vx = lerp(PX0 + 150, 820, walkK);
      const sitSeat = es(t, 2.2, 2.3) * (1 - es(t, 2.52, 2.6));
      const sitFeast = es(t, 2.75, 2.85) * (1 - es(t, 3.02, 3.08));
      const toSeat = es(t, 2.02, 2.2), toFeast = es(t, 2.55, 2.75);
      if (t > 2.0) vx = lerp(lerp(820, 770, toSeat), 850, toFeast);
      const pray = es(t, 3.5, 3.7) * (1 - es(t, 4.35, 4.5));
      const cower = es(t, 4.3, 4.5);
      const sitting = sitSeat > 0.5 || sitFeast > 0.5;
      const seatY = GROUND - 68;
      const seatUp = es(t, 2.05, 2.2, ease.back) * (1 - es(t, 2.55, 2.7));
      pose(seat, { x: 770, y: GROUND + dy, s: seatUp * 0.9, o: seatUp > 0.01 ? 1 : 0 });
      const tb = es(t, 2.5, 2.65, ease.back) * (1 - es(t, 3.0, 3.1));
      pose(table, { x: 920, y: GROUND + dy, s: tb, o: tb > 0.01 ? 1 : 0 });
      guests.forEach((g) => g.p.set({ x: 930 + g.i * 70, y: GROUND - 4 + dy, s: 0.62, flip: true, o: tb, armF: 40, blink: blinkAt(T, g.i + 5), head: bump(t, 2.75, 3.0) * -10 }));
      vain.set({
        x: vx, y: GROUND + dy, s: 0.78, flip: t > 2.02 && t < 2.2,
        walk: (walkK > 0 && walkK < 1) || (toSeat > 0 && toSeat < 1) || (toFeast > 0 && toFeast < 1) ? vx * 0.06 : undefined,
        head: -bump(t, 1.2, 1.95) * 16 + pray * -14 + cower * 16, lean: -bump(t, 1.2, 1.95) * 6 + cower * 10,
        armF: 30 + bump(t, 1.2, 1.95) * 30 + pray * 120 - cower * 10, armB: 20 + pray * 130 + es(t, 3.1, 3.3) * (1 - pray) * 40 + cower * 40,
        o: (sitting ? 0 : 1) * (t > 1.1 ? 1 : 0),
      });
      vainSit.set({ x: sitSeat > 0.5 ? 770 : 846, y: (sitSeat > 0.5 ? seatY : GROUND - 4) + dy, s: 0.76, head: -12, armF: 40, lean: -4, o: sitting ? 1 : 0, blink: blinkAt(T, 8) });
      greeters.forEach((g) => {
        const bowK = bump(t, 1.35 + g.i * 0.08, 1.95);
        g.p.set({ x: 930 + g.i * 66, y: GROUND + dy, s: 0.7, flip: true, lean: -bowK * 22, head: bowK * 20, armF: bowK * 50, o: 1 - es(t, 1.95, 2.05), blink: blinkAt(T, g.i) });
      });
      const hk = es(t, 1.45, 1.6, ease.back) * (1 - es(t, 1.85, 1.95));
      pose(hello, { x: 910, y: GROUND - 150 + dy, s: hk, o: hk > 0.02 ? 1 : 0 });
      // v40a: a widow's house vanishes into his purse; his prayer unrolls to the floor
      const hIn = es(t, 3.05, 3.15, ease.back), eat = es(t, 3.2, 3.45, ease.in);
      pose(house, { x: lerp(720, vx - 22, eat), y: lerp(GROUND, GROUND - 76, eat) + dy, s: 1.3 * hIn * (1 - eat * 0.9), o: hIn > 0.01 && eat < 0.98 ? 1 : 0 });
      const unroll = es(t, 3.55, 3.95) * (1 - es(t, 4.3, 4.6));
      pose(scrollEl, { x: vx + 56, y: GROUND - 196 + dy, sy: Math.max(0.03, unroll), o: unroll > 0.02 ? 1 : 0 });
      // v40b: the cloud of judgment
      const ck = es(t, 4.1, 4.35, ease.out);
      pose(cloud, { x: vx, y: lerp(-200, GROUND - 216, ck) + dy, s: 0.9, o: ck > 0.01 ? 1 : 0 });
      fade(bolt, bump(t, 4.45, 4.6) + bump(t, 4.7, 4.8));

      S.cam.z = 1 + es(t, 1.0, 1.4) * 0.05;
      S.cam.y = -es(t, 1.0, 1.4) * 30;
    };
  },
};
