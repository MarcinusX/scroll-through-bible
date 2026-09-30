// Łk 8,1–3 — the curtains open on a road through Galilee. Jesus walks on while the hills roll past with their
// towns and villages, and slips of good news with little crowns fly out from Him to the houses on the hills: the
// kingdom of God hangs over the road. The Twelve come along the road and walk with Him. Then the women who had
// been freed and healed come after them — little dark spirits and grey clouds of sickness break up over them into
// sparkles. Mary Magdalene steps forward and seven small shadows fly off her and vanish; Joanna, and above her a
// cameo of Herod's court with Chuza the steward and his keys; Susanna; and many others — and they give from what
// they have: a purse of coins, a basket of bread, a jug of water, laid down on a cloth before Him.
import { C, person, CAST, blinkAt, pose, lerp, curtains, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  roadSet, TWELVE, MAGD, JOANNA, SUSANNA, OTHERS, still, kingdomDisc, newsSlip, stewardCameo, nameTag, spirit, sorrowCloud, sparkle,
  headAt, hand, coin, purse, breadBasketHeld, waterJar, hangAt, tr, PI,
} from './lib.js';

const JX = 800, FEET = 724;
const W_X = [640, 530, 420];          // Magdalene, Joanna, Susanna (left of Him, facing Him)

export default {
  id: 'lk8-women',
  beats: [
    { cover: true },
    { v: 1, text: 'Następnie wędrował przez miasta i wsie, nauczając i głosząc Ewangelię o królestwie Bożym.' },
    { v: 1, cont: true, text: 'A było z Nim Dwunastu' },
    { v: 2, text: 'oraz kilka kobiet, które uwolnił od złych duchów i od słabości:' },
    { v: 2, cont: true, text: 'Maria, zwana Magdaleną, którą opuściło siedem złych duchów;' },
    { v: 3, text: 'Joanna, żona Chuzy, zarządcy u Heroda;' },
    { v: 3, cont: true, text: 'Zuzanna i wiele innych, które im usługiwały ze swego mienia.' },
  ],
  cam: { x: [-60, 40], y: [-20, 60], z: [1, 1.12] },
  build(S) {
    const R = roadSet(S);
    const c = R.c;

    /* the kingdom over the road, and the news flying out to the hills */
    const hangL = R.hangL;
    const kingdom = hangL.add(`<g transform="translate(0 -1500)">${`<path d="M0 -1600V-46" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>`}${kingdomDisc(c, 40)}</g>`);
    const slipL = S.layer({ par: 0.3, sh: 4 });
    const SLIP = [[300, 470], [560, 430], [1030, 440], [1320, 470], [180, 520], [1450, 420]].map(([x, y], i) => ({ i, x, y, el: slipL.add(`<g opacity="0">${newsSlip(c, 38)}</g>`) }));
    const hillSparks = SLIP.map(() => slipL.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    /* the Twelve: four still groups of three that come along the road (back row, on His right) */
    const twL = S.layer({ par: 0.5, sh: 4 });
    const TW = [0, 1, 2, 3].map((g) => {
      const mem = [0, 1, 2].map((k) => ({ x: (k - 1) * 40 + (k % 2) * 6, y: (k % 2) * 8, s: 0.8, flip: false, armF: 14 + k * 6, armB: 8, head: -2, o: TWELVE[g * 3 + k].o }));
      return { g, x: 930 + g * 118, sp: twL.sprite(still(c, mem), 930 + g * 118, FEET - 34) };
    });

    /* the women: the named three are puppets, the many others a still group */
    const wL = S.layer({ par: 0.5, sh: 5 });
    const othersM = still(c, OTHERS.map((o, k) => ({ x: (k - 1) * 44, y: (k % 2) * 10, s: 0.9, flip: false, armF: 16, armB: 6, head: -4, o })));
    const others = wL.sprite(othersM, 300, FEET - 10);
    const offerM = still(c, OTHERS.map((o, k) => ({ x: (k - 1) * 44, y: (k % 2) * 10, s: 0.9, flip: false, armF: 70 + k * 8, armB: 30, head: -6, o })));
    const othersGive = wL.sprite(offerM, 300, FEET - 10);
    const clouds = [0, 1, 2].map((k) => ({ k, el: wL.add(`<g opacity="0">${sorrowCloud(c, 60)}</g>`) }));
    const wisps = [0, 1, 2, 3].map((k) => ({ k, el: wL.add(`<g opacity="0">${spirit(c, 0.7)}</g>`) }));
    const freeSparks = [0, 1, 2, 3, 4, 5].map(() => wL.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const WOM = [MAGD, JOANNA, SUSANNA].map((o, i) => ({
      i, x: W_X[i], seed: c.rr(0, 9),
      p: S.puppet(wL.add(person(c, { ...o, holdF: i === 0 ? `<g transform="translate(0 2)">${waterJar(c)}</g>` : i === 1 ? `<g transform="translate(0 4)">${purse(c, 1)}</g>` : `<g transform="translate(0 -2)">${breadBasketHeld(c)}</g>` }))),
    }));
    const seven = Array.from({ length: 7 }, (_, k) => ({ k, a: -PI / 2 + (k - 3) * 0.42, el: wL.add(`<g opacity="0">${spirit(c, 0.8)}</g>`) }));

    /* Jesus */
    const jL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(jL.add(person(c, { ...CAST.jesus })));
    const cloth = jL.add(`<g opacity="0">${sheet().p(c.cut([[-80, 0], [80, -4], [92, 16], [-90, 18]], 0.5, 6), C.linen2).x(c.ribbon([[-70, 8], [76, 6]], 2), C.terracotta, 'opacity=".5"').out()}</g>`);
    const gifts = [
      { el: jL.add(`<g opacity="0">${waterJar(c)}</g>`), to: [770, FEET + 8] },
      { el: jL.add(`<g opacity="0">${purse(c, 1)}</g>`), to: [822, FEET - 6] },
      { el: jL.add(`<g opacity="0">${breadBasketHeld(c)}</g>`), to: [870, FEET + 2] },
    ];
    const coins = [0, 1, 2, 3, 4].map((k) => jL.add(`<g opacity="0">${coin(c, 6)}</g>`));
    const giftSparks = [0, 1, 2].map(() => jL.add(`<g opacity="0">${sparkle(c, 14)}</g>`));

    /* names on tags, and Joanna's cameo of Herod's court */
    const tagL = S.layer({ par: 0.5, sh: 5 });
    const tags = [tr('Maria Magdalena', 'Mary Magdalene'), tr('Joanna', 'Joanna'), tr('Zuzanna', 'Susanna')].map((n, i) => ({ i, el: tagL.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, n, { size: 18 })}</g>`) }));
    const cameo = tagL.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-72" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${stewardCameo(c, S.id('cameo'), 62)}</g>`);
    const chuzaTag = tagL.add(`<g transform="translate(0 -1500)"><path d="M0 -40V6" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, tr(['Chuza, zarządca', 'u Heroda'], ['Chuza,', 'Herod’s steward']), { size: 15 })}</g>`);

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), time);

      /* how far the land has rolled past (they walk on) */
      const travel = es(t, 1.0, 1.95) * 1300 + es(t, 2.05, 2.9) * 900 + es(t, 3.05, 3.75) * 500;
      const rolling = Math.abs(es(t + 0.01, 1.0, 1.95) - es(t - 0.01, 1.0, 1.95)) + Math.abs(es(t + 0.01, 2.05, 2.9) - es(t - 0.01, 2.05, 2.9)) + Math.abs(es(t + 0.01, 3.05, 3.75) - es(t - 0.01, 3.05, 3.75)) > 0.001;
      R.update(T, travel);

      /* v1a — through towns and villages, proclaiming the kingdom */
      const turn = es(t, 3.55, 3.7);
      const teach = bump(t, 1.2, 1.9);
      const give = es(t, 6.35, 6.6);
      jesus.set({
        x: JX, y: FEET, s: 1.04, flip: turn > 0.5, walk: rolling ? travel * 0.03 : undefined,
        armF: 16 + teach * 60 + bump(t, 4.1, 5.0) * 30 + give * 50, armB: 8 + teach * 50 + give * 30, head: -teach * 6 + give * 8, blink: blinkAt(T),
      });
      const [jhx, jhy] = headAt(JX, FEET, 1.04, false);
      const kd = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.9, 3.2));
      hangAt(kingdom, JX, lerp(-1500, 330, kd), T, 1.2, 0.7);
      SLIP.forEach((s) => {
        const a = 1.25 + s.i * 0.09, k = seg(t, a, a + 0.42);
        const x = lerp(jhx, s.x, ease.out(k)), y = lerp(jhy - 20, s.y, k) - Math.sin(k * PI) * 90;
        pose(s.el, { x, y, r: Math.sin(k * 7 + s.i) * 18, s: 1.2 - k * 0.4, o: k > 0 && k < 1 ? 1 : 0 });
        const sp = bump(t, a + 0.38, a + 0.75);
        pose(hillSparks[s.i], { x: s.x, y: s.y, s: sp, r: T * 40, o: sp });
      });

      /* v1b — the Twelve with Him */
      TW.forEach((g) => {
        const k = es(t, 2.05 + g.g * 0.06, 2.75 + g.g * 0.05);
        const x = lerp(g.x - 1500, g.x, k);
        g.sp.set({ x, y: FEET - 34 - (rolling && t < 3 ? Math.abs(Math.sin(travel * 0.02 + g.g)) * 3 : 0), o: seg(t, 2.02, 2.1) });
      });

      /* v2a — the women who had been freed and healed come after them */
      const wIn = (i) => es(t, 3.05 + i * 0.05, 3.7 + i * 0.05);
      const step = [bump(t, 4.05, 4.95) * 0.6 + es(t, 4.05, 4.3) * 0.4, es(t, 5.05, 5.3), es(t, 6.05, 6.25)];
      WOM.forEach((w) => {
        const k = wIn(w.i);
        const fwd = w.i === 0 ? es(t, 4.05, 4.3) * (1 - es(t, 4.95, 5.1)) : w.i === 1 ? es(t, 5.05, 5.3) * (1 - es(t, 5.95, 6.1)) : es(t, 6.05, 6.25) * (1 - es(t, 6.8, 6.95));
        const x = lerp(w.x - 900, w.x, k) + fwd * 30;
        const offer = es(t, 6.3 + w.i * 0.06, 6.5 + w.i * 0.06);
        w.p.set({
          x, y: FEET + 6 - fwd * 4, s: 0.96, flip: k >= 1 ? false : false, walk: k > 0 && k < 1 ? x * 0.05 : undefined, o: seg(t, 3.02, 3.1),
          armF: 34 + fwd * 20 + offer * 50, armB: 10 + fwd * 16, head: -3 - fwd * 6, blink: blinkAt(T, w.seed),
        });
        // what she holds is set down on the cloth
        const held = w.p.el.querySelector('.hold');
        if (held) fade(held, 1 - es(t, 6.45 + w.i * 0.08, 6.5 + w.i * 0.08));
      });
      const ok = es(t, 3.0, 3.7);
      others.set({ x: lerp(-700, 300, ok), y: FEET - 10 - (ok > 0 && ok < 1 ? Math.abs(Math.sin(ok * 30)) * 3 : 0), o: seg(t, 3.0, 3.08) * (1 - es(t, 6.3, 6.4)) });
      othersGive.set({ x: 300, y: FEET - 10, o: es(t, 6.3, 6.4) });
      // their sickness and their spirits break up into sparkles
      const brk = seg(t, 3.55, 4.0);
      clouds.forEach((cl) => {
        const x = [300, 530, 420][cl.k] - (cl.k === 0 ? 0 : 0), on = seg(t, 3.25, 3.4) * (1 - brk);
        pose(cl.el, { x, y: 470 - brk * 60, s: 1.25 - brk * 0.5, o: on });
      });
      wisps.forEach((w) => {
        const x = [260, 350, 470, 580][w.k], on = seg(t, 3.25, 3.4) * (1 - brk);
        pose(w.el, { x: x + brk * 30, y: 520 - brk * 120 + (T ? Math.sin(T * 2 + w.k) * 6 : 0), s: 1.3, r: T ? Math.sin(T * 3 + w.k) * 8 : 0, o: on * 0.9 });
      });
      freeSparks.forEach((sp, i) => { const k = bump(t, 3.6 + i * 0.04, 4.0 + i * 0.04); pose(sp, { x: 240 + i * 70, y: 450 - i % 2 * 40, s: k * 1.3, r: T * 50, o: k }); });

      /* v2b — Mary Magdalene: seven spirits leave her */
      const mx = W_X[0] + 30, my = FEET - 150;
      seven.forEach((s) => {
        const on = es(t, 4.12, 4.25), fly = es(t, 4.28 + s.k * 0.03, 4.98);
        pose(s.el, { x: mx + Math.cos(s.a) * (46 + fly * 200), y: my + Math.sin(s.a) * (36 + fly * 150) - fly * 40, s: 1.4 - fly * 0.3, r: fly * (s.k % 2 ? 60 : -60), o: on * (1 - es(t, 4.82, 4.98)) });
      });

      /* names on tags come down over each woman */
      tags.forEach((g) => {
        const a = [4.1, 5.1, 6.05][g.i];
        const k = es(t, a, a + 0.3, ease.out) * (1 - es(t, 6.75, 6.95));
        hangAt(g.el, [W_X[0] + 40, W_X[1] + 40, W_X[2] + 70][g.i], lerp(-1500, [330, 395, 330][g.i], k), T, 1.2, 0.8, g.i);
      });
      /* v3a — Joanna, the wife of Chuza, Herod's steward */
      const ck = es(t, 5.2, 5.55, ease.out) * (1 - es(t, 5.95, 6.25));
      hangAt(cameo, 610, lerp(-1500, 200, ck), T, 1.2, 0.7, 3);
      hangAt(chuzaTag, 610, lerp(-1500, 200 + 70, ck), T, 1.2, 0.7, 3);

      /* v3b — Susanna and many others, who provided for them out of their means */
      pose(cloth, { x: 820, y: FEET + 16, o: es(t, 6.2, 6.3) });
      gifts.forEach((g, i) => {
        const from = hand(W_X[i] + 30, FEET + 6, 0.96, false, 84, 0);
        const k = seg(t, 6.45 + i * 0.08, 6.72 + i * 0.08);
        const x = lerp(from[0], g.to[0], ease.out(k)), y = lerp(from[1], g.to[1], k) - Math.sin(k * PI) * 70;
        pose(g.el, { x, y, o: k > 0 ? 1 : 0 });
        const sp = bump(t, 6.7 + i * 0.08, 6.98);
        pose(giftSparks[i], { x: g.to[0], y: g.to[1] - 30, s: sp, r: T * 40, o: sp });
      });
      coins.forEach((cn, k) => {
        const u = seg(t, 6.72 + k * 0.03, 6.86 + k * 0.03);
        pose(cn, { x: 828 + (k - 2) * 9, y: FEET - 14 - Math.sin(u * PI) * 26 + u * 12, r: u * 200, o: u > 0 ? 1 : 0 });
      });

      S.cam.x = -30 + es(t, 3.0, 3.8) * -20 + es(t, 5.0, 5.4) * -10 + es(t, 6.2, 6.6) * 40;
      S.cam.z = 1.04 + es(t, 3.0, 3.6) * 0.04 - es(t, 6.1, 6.5) * 0.04;
      S.cam.y = 20 + es(t, 4.0, 4.3) * 20 - es(t, 6.1, 6.5) * 20;
    };
  },
};
