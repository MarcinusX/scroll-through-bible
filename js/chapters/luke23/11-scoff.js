// Łk 23,35–38 — near the cross (John 19's near set) under a pale, clouded sky. The people stand on the slope and
// watch, still, their faces lifted. The rulers laugh among themselves and throw their grey paper taunts — "He saved
// others… let Him save Himself, if He is the Christ of God, the Chosen One!" — each runs out of strength and falls
// before it reaches Him. The soldiers come up too, one with a jar of sour wine and a sponge on a reed, and mock:
// "If You are the King of the Jews, save Yourself!" Then the inscription: a small board is fixed above His head,
// and a great one hangs in the sky with the words, THIS IS THE KING OF THE JEWS, written in Greek, Latin and Hebrew.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { kf, moving, hand, headAt, priest, elder, scribe, soldier, taunt, spongeReed, wineJar, titleBoard, miniTitle, board, strip, wordCard, crossNearSet, pose3, folkO, hanging, swing, NEAR, tr, PI } from './lib.js';

const GY = 706;
const PAL = ['#a7a9ba', '#ddd0bd', '#ecd9bb'];

export default {
  id: 'lk23-scoff',
  beats: [
    { v: 35, text: 'A lud stał i patrzył.' },
    { v: 35, cont: true, text: 'Lecz członkowie Wysokiej Rady drwiąco mówili: «Innych wybawiał, niechże teraz siebie wybawi, jeśli On jest Mesjaszem, Wybrańcem Bożym».' },
    { v: 36 },
    { v: 37 },
    { v: 38 },
  ],
  cam: { x: [-40, 90], y: [-60, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const N = crossNearSet(S, { pal: PAL });
    const [HX, HY] = N.head;
    const glow = N.glowL.add(`<g><circle r="110" fill="url(#halo-glow)"/></g>`);
    /* the people watching, as still sprites on the slope (faces lifted to the cross) */
    const watch = (n, flip, sc) => pose3(c, Array.from({ length: n }, (_, i) => ({ x: i * 44 * (flip ? -1 : 1) + c.rr(-5, 5), y: (i % 2) * 12, s: sc * c.rr(0.94, 1.05), flip, o: folkO(c), armF: c.rr(6, 26) + (i % 4 === 1 ? 60 : 0), armB: 8, head: -14 + c.rr(-3, 3) })));
    const P = N.P;
    const people = [[250, GY - 18, 5, false, 0.86], [180, GY + 18, 4, false, 0.98], [520, GY + 14, 3, false, 1.0], [1380, GY - 16, 3, true, 0.86]].map(([x, y, n, f, s], i) => ({ i, sp: P.sprite(watch(n, f, s), x, y), x, y }));
    /* the rulers, on the right */
    const lords = [
      { el: priest(c, 0), x: 1010, f: true }, { el: elder(c, 2), x: 1090, f: true }, { el: priest(c, 1), x: 1170, f: true }, { el: scribe(c, 2), x: 1250, f: true },
    ].map((l, i) => ({ ...l, i, p: S.puppet(P.add(l.el)), seed: c.rr(0, 9) }));
    /* the soldiers */
    const solA = S.puppet(P.add(soldier(c, 2, { spear: false })));
    const solB = S.puppet(P.add(soldier(c, 0)));
    const jar = P.add(`<g>${wineJar(c, 60)}</g>`);
    const fx = N.fx;
    const reed = fx.add(`<g>${spongeReed(c, 300)}</g>`);
    const T_ = (pl, en, side = 1, size = 19) => fx.add(`<g>${taunt(c, tr(pl, en), { size, side })}</g>`);
    const taunts = [
      { el: T_('Innych wybawiał…', 'He saved others…'), from: 0, k0: 1.1 },
      { el: T_('…niech siebie wybawi!', '…let him save himself!'), from: 2, k0: 1.3 },
      { el: T_('Jeśli On jest Mesjaszem…', 'If this is the Christ…'), from: 1, k0: 1.5 },
      { el: T_('…Wybrańcem Bożym!', '…God’s chosen one!'), from: 3, k0: 1.7 },
      { el: T_('Jeśli Ty jesteś królem żydowskim…', 'If you are the King of the Jews…', 1, 18), from: 'A', k0: 3.08 },
      { el: T_('…wybaw sam siebie!', '…save yourself!', 1, 18), from: 'B', k0: 3.32 },
    ];
    const laugh = lords.map(() => fx.add(`<g>${taunt(c, 'ha ha', { size: 12, w: 50, side: -1 })}</g>`));
    /* the inscription */
    const mini = N.glowL.add(`<g>${miniTitle(c, 40)}</g>`);
    const bigL = S.layer({ par: 0.12, sh: 5 });
    const big = hanging(bigL, `${wordCard(c, tr(['TO JEST', 'KRÓL ŻYDOWSKI'], ['THIS IS', 'THE KING OF THE JEWS']), { size: 28, italic: false, fill: '#fbf6ea', rim: C.wood2 })}`, { x: 0, y: -1500, len: 900 });
    const langs = [tr('po grecku', 'in Greek'), tr('po łacinie', 'in Latin'), tr('po hebrajsku', 'in Hebrew')].map((l) => bigL.add(`<g>${strip(c, l, { size: 15, fill: C.parchment })}</g>`));

    return (t, time) => {
      const T = time;
      N.sk.set(...PAL);
      pose(glow, { x: HX, y: HY + 10, s: 1, o: 0.55 });
      people.forEach((pp) => pp.sp.set({ x: pp.x, y: pp.y, o: 1 }));

      /* v35b — the rulers scoff */
      const mock = es(t, 1.05, 1.3);
      lords.forEach((l) => {
        const lean = mock * (T ? Math.sin(T * 3 + l.seed) * 4 + 6 : 6) * (1 - es(t, 2.9, 3.2) * 0.5);
        const throwK = bump(t, 1.05 + l.i * 0.2, 1.45 + l.i * 0.2);
        l.p.set({ x: l.x, y: GY + 2 + (l.i % 2) * 8, s: 0.96, flip: true, armF: 20 + mock * 30 + throwK * 80, armB: 10 + mock * 30, head: -lean * 0.5 - 6, lean: -lean * 0.5, blink: blinkAt(T, l.seed) });
      });
      laugh.forEach((lg, i) => {
        const l = lords[i];
        const k = es(t, 1.1 + i * 0.1, 1.3 + i * 0.1, ease.back) * (1 - es(t, 1.9, 2.05));
        const [hx, hy] = headAt(l.x, GY + 2, 0.96, true);
        pose(lg, { x: hx - 8, y: hy - 16, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      /* v36 — the soldiers come up and offer Him sour wine */
      const aK = [[1.9, [1340, GY + 14]], [2.4, [920, GY + 14]]];
      const bK = [[2.0, [1420, GY + 20]], [2.5, [1030, GY + 20]]];
      const [ax, ay] = kf(t, aK), [bx, by] = kf(t, bK);
      const reach = es(t, 2.4, 2.7) * (1 - es(t, 3.9, 4.2));
      const armA = 20 + reach * 125;
      solA.set({ x: ax, y: ay, s: 1, flip: true, walk: moving(t, aK) ? ax * 0.06 : undefined, armF: armA, armB: 10 + reach * 30, head: -reach * 14, o: es(t, 1.9, 2.0), blink: blinkAt(T, 3) });
      const jeer = es(t, 3.05, 3.3) * (1 - es(t, 3.9, 4.1));
      solB.set({ x: bx, y: by, s: 1, flip: true, walk: moving(t, bK) ? bx * 0.06 : undefined, armF: 34 + jeer * 30, armB: 10 + jeer * 90, head: -6 - jeer * 6, lean: -jeer * 4, o: es(t, 2.0, 2.1), blink: blinkAt(T, 5) });
      pose(jar, { x: 980, y: GY + 18, o: es(t, 2.35, 2.5) });
      const [hx, hy] = hand(ax, ay, 1, true, armA);
      const aim = (Math.atan2(HY + 40 - hy, HX + 30 - hx) * 180) / PI + 90;
      const len = Math.hypot(HX + 30 - hx, HY + 40 - hy) / 300;
      pose(reed, { x: hx, y: hy, r: lerp(-20, aim, reach), s: lerp(0.6, len, reach), o: es(t, 2.1, 2.25) * (1 - es(t, 4.0, 4.2)) });

      /* taunts fly up and fall away */
      taunts.forEach((tt, i) => {
        const src = tt.from === 'A' ? [ax, ay] : tt.from === 'B' ? [bx, by] : [lords[tt.from].x, GY + 2];
        const k = seg(t, tt.k0 - 0.02, tt.k0 + 0.95);
        const [sx, sy] = headAt(src[0], src[1], 1, true);
        const tx = HX + [120, 150, 110, 170, 120, 170][i], ty = HY + [60, 150, 10, 110, 30, 130][i];
        const fly = Math.min(1, k / 0.55), fall = Math.max(0, (k - 0.55) / 0.45);
        pose(tt.el, { x: lerp(sx, tx, ease.out(fly)), y: lerp(sy - 30, ty, ease.out(fly)) - Math.sin(fly * PI) * 30 + fall * fall * 260, s: 1 - fly * 0.1, r: fall * 40, o: k > 0 && k < 1 ? Math.min(1, k * 8) * (1 - fall) : 0 });
      });

      /* v38 — the inscription over Him */
      const ik = es(t, 4.05, 4.4);
      pose(mini, { x: HX, y: NEAR.top - NEAR.H + 14, s: 1, o: ik });
      const bk = es(t, 4.1, 4.45, ease.out);
      swing(big, S.portrait ? 800 : 1110, 130 - (1 - bk) * 900, T, 0.8, 0.6, 1);
      langs.forEach((l, i) => {
        const k = es(t, 4.35 + i * 0.1, 4.55 + i * 0.1, ease.back);
        pose(l, { x: (S.portrait ? 800 : 1110) + (i - 1) * 118, y: 262 + (i % 2) * 4, s: k, r: (i - 1) * 3, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = es(t, 0.9, 1.3) * 40 * (1 - es(t, 1.9, 2.3)) + es(t, 3.9, 4.3) * 30;
      S.cam.y = 20 - es(t, 3.9, 4.3) * 50;
      S.cam.z = 1.04 - es(t, 3.9, 4.3) * 0.03;
    };
  },
};
