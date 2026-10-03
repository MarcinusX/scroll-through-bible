// Łk 3,14 — late in the day two Roman soldiers come down to the river, spears on their shoulders, and ask as
// the others did: "And we — what shall we do?" John's answer is played out beside them: one soldier has a
// frightened merchant by his purse, club raised, and a pointing finger of false charge hangs over the man —
// the club comes down, the purse is handed back, the false charge is struck out. "Be content with your wages":
// a pay tag comes down, three coins drop into the soldier's palm, and he closes his hand and puts it on his heart.
import { C, person, blinkAt, sheet, shade, mix } from '../kit.js';
import {
  JOHN_B, headAt, hand, voiceRings, meadowSet, question, folk, group, standRock, hungWord, coin, pouch, soldier, club, accuse,
  crossX, addToBody, DUSKGOLD, tr, es, ease, bump, seg, fade, pose, lerp, PI,
} from './lib.js';

const JX0 = 525;
const MERCHANT = { robe: C.ochreRobe, mantle: C.dustyBlue, hair: C.hair2, hairStyle: 'wrap', veil: C.linen, beard: 'short', skin: C.skin2, belt: C.leather };

export default {
  id: 'lk3-soldiers',
  beats: [
    { v: 14, text: 'Pytali go też i żołnierze: «A my, co mamy czynić?»' },
    { v: 14, cont: true, text: 'On im odpowiadał: «Nad nikim się nie znęcajcie i nikogo nie uciskajcie,' },
    { v: 14, cont: true, text: 'lecz poprzestawajcie na swoim żołdzie».' },
  ],
  cam: { x: [-20, 60], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;
    // phone: John, the soldier, the merchant and the false charge come inward, clear of the frame and the thread
    const JX = PH ? 550 : JX0, SX = PH ? 872 : 900, MX = PH ? 1005 : 1060, AX = PH ? 975 : 1090, XX = PH ? 998 : 1116;
    const M = meadowSet(S, { skyCols: DUSKGOLD, sunAt: [1230, 260], ground: mix(C.sage2, C.wheat, 0.35) });
    const { GY } = M;
    const mem = Array.from({ length: 7 }, (_, k) => ({ x: (k - 3) * 76 + c.rr(-10, 10), y: c.rr(-6, 6), s: 1, flip: k > 3, o: folk(c) }));
    const crowdSp = M.back.sprite(`<g transform="scale(.5)">${group(c, mem)}</g>`, 700, 630);

    const act = S.layer({ par: 0.35, sh: 5 });
    act.add(`<g transform="translate(${JX} ${GY + 6})">${standRock(c, 170, 60)}</g>`);
    const john = S.puppet(act.add(person(c, { ...JOHN_B })));
    const voice = voiceRings(act, c, { n: 3, color: C.clay, r: 38, w: 5, both: false });

    const merchant = S.puppet(act.add(person(c, { ...MERCHANT, holdF: `<g data-k="s-purse" transform="translate(0 2)">${pouch(c, C.plumRobe)}</g>` })));
    const mPurse = S.$('s-purse');
    const s2 = S.puppet(act.add(soldier(c, 1, { spear: 34 })));
    const s1 = S.puppet(act.add(addToBody(soldier(c, 0, { spear: false, extra: { holdB: `<g data-k="s-club">${club(c, 64)}</g>`, holdF: `<g data-k="s-held" transform="translate(0 2)">${pouch(c, C.plumRobe)}</g>` } }), `<g transform="translate(-24 -92)">${pouch(c, C.leather)}</g>`)));
    const clubEl = S.$('s-club'), held = S.$('s-held');

    const fly = S.layer({ par: 0.3, sh: 6 });
    const tag = fly.add(hungWord(c, tr('żołnierze', 'soldiers'), { size: 22 }));
    const qEl = fly.add(`<g>${question(c)}</g>`);
    const acc = fly.add(`<g>${accuse(c)}</g>`);
    const xEl = fly.add(`<g>${crossX(c, 26)}</g>`);
    const wage = fly.add(`<g><path d="M0 -1600V-24" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><path d="${c.cut([[-60, -24], [60, -26], [62, 24], [-60, 26]], 0.5, 6)}" fill="${C.cream}"/><path class="grain" d="${c.cut([[-60, -24], [60, -26], [62, 24], [-60, 26]], 0.5, 6)}"/><text x="0" y="8" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="22" font-style="italic" fill="${C.ink}">${tr('żołd', 'wages')}</text></g>`);
    const COINS = [0, 1, 2].map(() => fly.add(`<g>${coin(c, 9)}</g>`));
    const heart = fly.add(`<g><circle r="46" fill="url(#warm-glow)"/></g>`);

    return (t, time) => {
      M.update(time);
      crowdSp.set({ x: 700, y: 630, o: 1 });

      /* v14a — the soldiers ask */
      const come = es(t, 0.02, 0.6);
      const ask = es(t, 0.55, 0.75) * (1 - es(t, 1.0, 1.1));
      const x1 = lerp(1420, 760, come), x2 = lerp(1520, 860, come);
      const qk = es(t, 0.6, 0.78, ease.back) * (1 - es(t, 1.0, 1.1));
      pose(qEl, { x: 790, y: GY - 320, s: qk, r: Math.sin(time) * 5, o: qk > 0.01 ? 1 : 0 });
      const tk = es(t, 0.15, 0.4, ease.out), tUp = es(t, 0.95, 1.1, ease.in);
      pose(tag, { x: 880, y: lerp(-400, 300, tk) - tUp * 700, r: Math.sin(time * 0.8) * 1.2, o: tk > 0.01 && tUp < 1 ? 1 : 0 });

      /* v14b — no violence, no false charge: the club comes down, the purse goes back, the charge is struck out */
      const turn = es(t, 1.02, 1.08);                 // soldier 1 turns to the merchant
      const content = es(t, 2.6, 2.75);
      const bully = es(t, 1.05, 1.2) * (1 - es(t, 1.4, 1.55));
      const giveBack = es(t, 1.5, 1.66);
      const mIn = es(t, 1.0, 1.15);
      const s1x = lerp(x1, SX, turn);
      s1.set({ x: s1x, y: GY, s: 1.2, flip: turn < 0.5, walk: come > 0 && come < 1 ? t * 30 : undefined, armF: 20 + ask * 80 + bully * 60 + giveBack * 70 * (1 - es(t, 2.1, 2.2)) + es(t, 2.2, 2.35) * 70 - content * 50, armB: 10 + bully * 150, head: -ask * 6 + bully * 4 - giveBack * 4 + content * 10, lean: bully * 4, blink: blinkAt(time, 3) });
      fade(clubEl, 1 - es(t, 1.45, 1.5));
      fade(held, bully > 0.2 || (t > 1.1 && t < 1.55) ? 1 : 0);
      const [mhx, mhy] = hand(MX, GY + 2, 1.15, true, 60);
      merchant.set({ x: MX, y: GY + 2, s: 1.15, flip: true, o: mIn, lean: -bully * 10 + giveBack * 0, head: bully * 10 - giveBack * 8, armF: 60 - bully * 20 + giveBack * 10, armB: 30 + bully * 110, blink: blinkAt(time, 5) });
      fade(mPurse, t > 1.55 ? 1 : 0);
      s2.set({ x: x2 - turn * 130, y: GY + 4, s: 1.18, flip: true, walk: (come > 0 && come < 1) ? t * 30 + 1 : undefined, armF: 34, armB: 10 + ask * 60, head: -ask * 4, blink: blinkAt(time, 4) });
      const ak = es(t, 1.12, 1.25, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(acc, { x: AX, y: GY - 300, s: ak, o: ak > 0.01 ? 1 : 0 });
      const xk = es(t, 1.45, 1.55, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(xEl, { x: XX, y: GY - 330, s: xk, o: xk > 0.01 ? 1 : 0 });

      /* v14c — content with his wages: three coins into his palm, his hand on his heart */
      const wk = es(t, 2.05, 2.3, ease.out);
      pose(wage, { x: 960, y: lerp(-500, 330, wk), r: Math.sin(time * 0.8) * 1.2, o: wk > 0.01 ? 1 : 0 });
      const [px, py] = hand(SX, GY, 1.2, false, 90);
      COINS.forEach((co, i) => {
        const k = seg(t, 2.25 + i * 0.07, 2.42 + i * 0.07);
        pose(co, { x: lerp(960 + (i - 1) * 20, px + (i - 1) * 5, k), y: lerp(360, py - 4 - i * 2, k * k), r: k * 200, o: k > 0 && t < 2.62 ? 1 : 0 });
      });
      pose(heart, { x: SX + 16, y: GY - 140, s: 0.8 + content * 0.4, o: content * 0.7 });

      john.set({ x: JX, y: GY, s: 1.22, armF: 20 + es(t, 1.03, 1.2) * 60 * (1 - es(t, 2.85, 3.0)), armB: 10 + es(t, 1.03, 1.2) * 20, head: -4 * es(t, 1.03, 1.2) + bump(t, 0.6, 1.0) * 6, blink: blinkAt(time) });
      const [hx, hy] = headAt(JX, GY, 1.22);
      voice(hx + 14, hy, es(t, 1.03, 1.2) * (1 - es(t, 2.85, 3.0)), time, { spread: 2.4, dir: 1 });

      S.cam.x = es(t, 0.3, 0.8) * 20 + es(t, 1.0, 1.3) * 30;
      S.cam.z = 1.02 + es(t, 1.0, 1.3) * 0.05;
      S.cam.y = 30 + es(t, 1.0, 1.3) * 10;
    };
  },
};
