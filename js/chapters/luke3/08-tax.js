// Łk 3,12–13 — tax collectors come to the river too, in good robes with purses at their belts; the people
// on the meadow draw aside. They bow before John: "Teacher, what shall we do?" His answer is played out at a
// little counting table: a farmer pours out his coins, a tablet with the appointed sum comes down — 10 — and
// the collector counts exactly ten into his chest and pushes the rest back into the farmer's hands.
import { C, person, blinkAt, sheet, shade, mix } from '../kit.js';
import {
  JOHN_B, headAt, hand, voiceRings, meadowSet, question, folk, group, standRock, hungWord, coin, taxTablet, pouch, ledger,
  addToBody, tr, es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const JX = 525;
const TAXA = { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3, belt: C.sun };
const TAXB = { robe: C.tealRobe, mantle: C.wheatRobe, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.sun };
const FARMER = { robe: C.sageRobe, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', beardColor: C.greyHair, skin: C.skin4, belt: C.rope };
const TX = 950, TY = 664;          // the counting table (top centre)

export default {
  id: 'lk3-tax',
  beats: [
    { v: 12, text: 'Przychodzili także celnicy, żeby przyjąć chrzest,' },
    { v: 12, cont: true, text: 'i pytali go: «Nauczycielu, co mamy czynić?»' },
    { v: 13 },
  ],
  cam: { x: [-20, 60], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const M = meadowSet(S, { sunAt: [1150, 120] });
    const { GY } = M;
    const mem = Array.from({ length: 8 }, (_, k) => ({ x: (k - 3.5) * 74 + c.rr(-10, 10), y: c.rr(-6, 6), s: 1, flip: k > 3, o: folk(c) }));
    const crowdSp = M.back.sprite(`<g transform="scale(.5)">${group(c, mem)}</g>`, 860, 630);

    const act = S.layer({ par: 0.35, sh: 5 });
    act.add(`<g transform="translate(${JX} ${GY + 6})">${standRock(c, 170, 60)}</g>`);
    const john = S.puppet(act.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5, both: false });
    const purseOn = (m) => addToBody(m, `<g transform="translate(18 -92)">${pouch(c)}</g>`);
    const ta = S.puppet(act.add(purseOn(person(c, TAXA))));
    const tb = S.puppet(act.add(purseOn(person(c, { ...TAXB, holdB: `<g transform="translate(-4 0) rotate(-80)">${ledger(c, 56)}</g>` }))));

    /* the counting table, the farmer, the coins, the chest */
    const tableL = S.layer({ par: 0.35, sh: 5 });
    const farmer = S.puppet(tableL.add(person(c, FARMER)));
    const tbl = sheet();
    tbl.p(c.cut([[-110, 0], [110, 0], [106, 12], [-106, 12]], 0.4, 6), C.wood);
    tbl.p(c.cut(c.rect(-96, 10, 12, 30), 0.3, 4) + c.cut(c.rect(84, 10, 12, 30), 0.3, 4), C.wood2);
    tbl.p(c.cut([[-96, 0], [-96, -30], [-44, -30], [-44, 0]], 0.3, 4), C.wood2);
    tbl.p(c.cut([[-100, -30], [-40, -30], [-44, -38], [-96, -38]], 0.3, 4), shade(C.wood2, 0.2));
    tbl.x(c.cut(c.rect(-74, -24, 8, 10), 0.2, 3), C.sun);
    const table = tableL.add(`<g>${tbl.out()}</g>`);
    const COINS = Array.from({ length: 13 }, (_, i) => ({ i, el: tableL.add(`<g>${coin(c, 9)}</g>`) }));

    /* from the flies: the name, the tablet with the appointed sum */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const tag = fly.add(hungWord(c, tr('celnicy', 'tax collectors'), { size: 22 }));
    const tablet = fly.add(`<g><path d="M-30 -1600V-30M30 -1600V-30" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${taxTablet(c, '10', { w: 100, h: 62 })}<g transform="translate(0 50)"><path d="${c.cut([[-58, -12], [58, -13], [59, 12], [-58, 13]], 0.4, 5)}" fill="${C.cream}"/><text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.ink}">${tr('wyznaczone', 'appointed')}</text></g></g>`);
    const qEl = fly.add(`<g>${question(c)}</g>`);

    return (t, time) => {
      M.update(time);

      /* v12a — the tax collectors come; the people draw aside */
      const come = es(t, 0.05, 0.7);
      const ax = lerp(1400, 690, come), bx = lerp(1500, 800, come);
      const aside = es(t, 0.2, 0.6);
      crowdSp.set({ x: 860 + aside * 70, y: 630, o: 1 });
      const bow = bump(t, 1.05, 1.5) * 0.7 + es(t, 1.05, 1.2) * (1 - es(t, 1.95, 2.1)) * 0.3;
      const ask = es(t, 1.15, 1.35) * (1 - es(t, 1.95, 2.1));
      const toTable = es(t, 2.05, 2.3);
      ta.set({ x: lerp(ax, 814, toTable), y: GY, s: 1.2, flip: toTable < 0.5, walk: (come > 0 && come < 1) || (toTable > 0 && toTable < 1) ? t * 30 : undefined, lean: bow * 10, head: bow * 12 + ask * -6, armF: 20 + ask * 70 + es(t, 2.3, 2.4) * 60, armB: 10 + ask * 40, blink: blinkAt(time, 1) });
      tb.set({ x: bx - toTable * 110, y: GY + 4, s: 1.18, flip: true, walk: come > 0 && come < 1 ? t * 30 + 1 : undefined, lean: bow * 8, head: bow * 12, armF: 20 + bow * 30, armB: 10, blink: blinkAt(time, 2) });
      const tk = es(t, 0.3, 0.55, ease.out), tUp = es(t, 0.95, 1.1, ease.in);
      pose(tag, { x: 900, y: lerp(-400, 300, tk) - tUp * 700, r: Math.sin(time * 0.8) * 1.2, o: tk > 0.01 && tUp < 1 ? 1 : 0 });

      /* v12b — "Teacher, what shall we do?" */
      const qk = es(t, 1.3, 1.45, ease.back) * (1 - es(t, 2.0, 2.1));
      pose(qEl, { x: 700, y: GY - 310, s: qk, r: Math.sin(time) * 5, o: qk > 0.01 ? 1 : 0 });
      const answer = es(t, 2.03, 2.2);
      john.set({ x: JX, y: GY, s: 1.22, armF: 20 + answer * 70, armB: 10 + answer * 20, head: -answer * 4 + bump(t, 1.2, 1.9) * 6, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, GY, 1.22);
      voice(hx + 14, hy, answer * (1 - es(t, 2.9, 3.0)), time, { spread: 2.4, dir: 1 });

      /* v13 — no more than appointed: the table, the tablet, ten coins counted, the rest given back */
      const tIn = es(t, 2.02, 2.25, ease.out);
      pose(table, { x: TX, y: TY + (1 - tIn) * 90, s: 1.2, o: tIn > 0.01 ? 1 : 0 });
      const fIn = es(t, 2.05, 2.3);
      const back = es(t, 2.72, 2.84);
      farmer.set({ x: lerp(1260, 1100, fIn), y: GY + 2, s: 1.16, flip: true, o: fIn > 0.01 ? 1 : 0, walk: fIn > 0 && fIn < 1 ? t * 30 : undefined, armF: 30 + bump(t, 2.22, 2.36) * 60 + back * 60, armB: 20 + back * 50, head: 8 - back * 12, blink: blinkAt(time, 4) });
      const lk = es(t, 2.12, 2.35, ease.out);
      pose(tablet, { x: TX, y: lerp(-500, 420, lk), r: Math.sin(time * 0.8) * 1, o: lk > 0.01 ? 1 : 0 });
      COINS.forEach((co) => {
        const pile = [TX + 50 + (co.i % 3) * 16, TY - 8 - Math.floor(co.i / 3) * 5];
        const pour = es(t, 2.24 + co.i * 0.006, 2.34 + co.i * 0.006);
        const from = [1060, GY - 110];
        let [x, y] = [lerp(from[0], pile[0], pour), lerp(from[1], pile[1], pour) - Math.sin(pour * PI) * 20];
        if (co.i < 10) {
          const k = es(t, 2.38 + co.i * 0.025, 2.44 + co.i * 0.025);
          x = lerp(x, TX - 84, k); y = lerp(y, TY - 50, k) - Math.sin(k * PI) * 18;
          pose(co.el, { x, y, s: 1 - k * 0.3, o: pour > 0 && k < 1 ? 1 : 0 });
        } else {
          const [fx, fy] = hand(1100, GY + 2, 1.16, true, 90);
          x = lerp(x, fx - 4 + (co.i - 10) * 6, back); y = lerp(y, fy - 2, back) - Math.sin(back * PI) * 24;
          pose(co.el, { x, y, o: pour > 0 ? 1 : 0 });
        }
      });

      S.cam.x = es(t, 0.3, 0.8) * 20 + es(t, 2.0, 2.3) * 30;
      S.cam.z = 1.02 + es(t, 1.0, 1.3) * 0.04 + es(t, 2.0, 2.3) * 0.02;
      S.cam.y = 30 + es(t, 2.0, 2.3) * 16;
    };
  },
};
