// J 9,8–12 — back at the gate. His cloak and bowl still lie where he sat. The neighbours gather: "Isn't this the
// one who sat and begged?" — one points from the empty cloak to him; a sepia picture of him begging hangs there.
// "Yes, it is he" (a tick) — "No, he only looks like him" (two faces and a wavy "≈"). "I am the one!" he says,
// hand on his heart. "How were your eyes opened?" He tells it, and picture cards come down one by one: a man
// called Jesus made clay, put it on my eyes, "Go to Siloam and wash" — I went, I washed, and I see.
// "Where is He?" — the neighbours look up and down the street. "I don't know" — he spreads his hands.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  gateSet, beggarPlace, G, DAY, SEER, BLIND, manPuppet, facePuppet, neighbour, framed, sepia, iconBubble, bubble, say, thought, tick, qmark,
  medallion, eyeIcon, clayEye, beggarBowl, clayLump, poolIcon, storyTile, heart, spark, hanging, drop, kf, moving, headAt, vis, tr, pose, mix, PI, DY, FONT,
} from './lib.js';

const MX = 790;
const NB = [
  { x: 560, y: G.FLOOR + 10, s: 0.98, side: 0, from: -260 },
  { x: 626, y: G.FLOOR + 2, s: 0.94, side: 0, from: -200 },
  { x: 968, y: G.FLOOR + 4, s: 0.96, side: 1, from: 1460 },
  { x: 1040, y: G.FLOOR + 12, s: 1.0, side: 1, from: 1520 },
  { x: 1108, y: G.FLOOR + 2, s: 0.94, side: 1, from: 1580 },
];

export default {
  id: 'j9-neighbours',
  beats: [
    { v: 8 },
    { v: 9, text: 'Jedni twierdzili: «Tak, to jest ten»,' },
    { v: 9, cont: true, text: 'a inni przeczyli: «Nie, jest tylko do tamtego podobny».' },
    { v: 9, cont: true, text: 'On zaś mówił: «To ja jestem».' },
    { v: 10 },
    { v: 11, text: 'On odpowiedział: «Człowiek zwany Jezusem uczynił błoto, pomazał moje oczy i rzekł do mnie: "Idź do sadzawki Siloam i obmyj się".' },
    { v: 11, cont: true, text: 'Poszedłem więc, obmyłem się i przejrzałem».' },
    { v: 12, text: 'Rzekli do niego: «Gdzież On jest?»' },
    { v: 12, cont: true, text: 'On odrzekł: «Nie wiem».' },
  ],
  cam: { x: [-40, 80], y: [-90, 30], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const set = gateSet(S, { skyCols: DAY });

    const act = S.layer({ par: 0.52, sh: 5 });
    const { mat, bowl } = beggarPlace(S, act);
    const ROBES = [[C.dustyBlue, C.stone], [C.lavender, C.blushVeil], [C.sageRobe, C.linen2], [C.roseRobe, C.skyVeil], [C.tealRobe, C.wheatRobe]];
    const nb = NB.map((o, i) => ({ ...o, i, seed: c.rr(0, 9), ...facePuppet(S, act, neighbour(c, i === 3 ? 1 : i === 1 ? 1 : 0, { robe: ROBES[i][0], mantle: i % 2 ? null : ROBES[i][1], veil: ROBES[i][1] }), { c }) }));
    const warm = act.add(`<g opacity="0"><circle r="120" fill="url(#warm-glow)"/></g>`);
    const man = manPuppet(S, act, SEER, {});

    /* bubbles */
    const fx = S.layer({ par: 0.54, sh: 5 });
    const memory = hanging(S.layer({ par: 0.2, sh: 5 }), framed(S, `<g transform="translate(124 150) scale(-.62 .62)">${person(c, { ...sepia(BLIND, 0.55), pose: 'sit' })}</g><g transform="translate(66 150) scale(.9)">${beggarBowl(c)}</g>`, { w: 200, h: 160, sepiaK: 0.2, bg: mix(C.parchment, C.dune, 0.3) }), { x: 0, y: 0, len: 900 });
    const yes = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-26 0)">${medallion(c, SEER, { r: 22 })}</g><g transform="translate(26 0)">${tick(c, 16)}</g>`, { w: 124, h: 76, side: 1 })}</g>`);
    const like = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-34 0)">${medallion(c, BLIND, { r: 20 })}</g><text x="0" y="10" text-anchor="middle" font-family="${FONT}" font-size="34" fill="${C.terracotta}">≈</text><g transform="translate(34 0)">${medallion(c, SEER, { r: 20 })}</g>`, { w: 150, h: 76, side: -1 })}</g>`);
    const me = fx.add(`<g opacity="0">${say(c, tr('To ja jestem!', 'I am he!'), { size: 22, side: 1 })}</g>`);
    const meHeart = fx.add(`<g opacity="0">${heart(c, 12)}</g>`);
    const how = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-16 0)">${eyeIcon(c, { r: 18 })}</g><g transform="translate(30 2)">${qmark(c, C.terracotta, 1.3)}</g>`, { w: 120, h: 76, side: -1 })}</g>`);
    const where = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-18 0)"><circle r="26" fill="${C.halo}" opacity=".7"/>${medallion(c, CAST.jesus, { r: 20 })}</g><g transform="translate(30 2)">${qmark(c, C.terracotta, 1.3)}</g>`, { w: 120, h: 76, side: -1 })}</g>`);
    const dunno = fx.add(`<g opacity="0">${thought(c, `<g transform="translate(0 2)">${qmark(c, C.inkSoft, 1.2)}</g>`, { w: 60, h: 48 })}</g>`);

    /* the story cards */
    const tileL = S.layer({ par: 0.22, sh: 5 });
    const tiles = [
      storyTile(c, `<g transform="translate(-22 -6)"><circle r="26" fill="${C.halo}" opacity=".7"/>${medallion(c, CAST.jesus, { r: 20 })}</g><g transform="translate(26 14)">${clayLump(c, 16)}</g>`, { label: tr('Jezus', 'Jesus') }),
      storyTile(c, `<g transform="translate(0 -4)">${clayEye(c, 24)}</g>`, { label: tr('błoto', 'mud') }),
      storyTile(c, `<g transform="translate(0 -6)">${poolIcon(c, 34)}</g>`, { label: 'Siloam' }),
      storyTile(c, `<circle r="44" fill="url(#warm-glow)"/>${eyeIcon(c, { r: 26 })}`, { label: tr('widzę!', 'I see!'), bg: mix(C.halo, C.parchment, 0.5) }),
    ].map((m) => hanging(tileL, m, { x: 0, y: 0, len: 900 }));

    set.front();

    return (t, time) => {
      const T = time;
      set.update(T);

      /* he walks back in, looking at everything */
      const MK = [[-0.4, 300], [0.25, MX]];
      const mx = kf(t, MK, ease.out);
      const mw = moving(t, MK, 1);
      const me_ = bump(t, 3.05, 3.95), tell = bump(t, 5.05, 6.95), shrug = bump(t, 8.05, 8.95);
      const lookAround = t < 0.4 ? Math.sin(T * 1.2) * 6 : 0;
      man.p.set({ x: mx, y: G.FLOOR + 8, s: 1.02, flip: t > 2.02 && t < 3.0 || t > 4.02 && t < 5.0 || t > 7.3 && t < 7.7, walk: mw ? mx * 0.07 : undefined, armF: 20 + me_ * 40 + tell * 50 + shrug * 60, armB: 14 + tell * 40 + shrug * 70 + bump(t, 6.1, 6.9) * 60, head: lookAround - me_ * 6 - tell * 6 + shrug * 6, blink: blinkAt(T, 3) });
      const [hx, hy] = headAt(mx, G.FLOOR + 8, 1.02, false);
      vis(warm, { x: hx, y: hy + 40, s: 0.8 + me_ * 0.4, o: Math.max(me_, bump(t, 6.1, 6.95)) * 0.8 });

      /* neighbours: gather (v8), take sides (v9), lean in (v10), look around (v12) */
      nb.forEach((n) => {
        const k = es(t, -0.2 + n.i * 0.06, 0.55 + n.i * 0.06, ease.out);
        const x = lerp(n.from, n.x, k);
        const walking = k > 0.02 && k < 0.98;
        const pointMat = n.i === 2 ? bump(t, 0.4, 0.98) : 0;
        const pointHim = n.i === 3 ? bump(t, 0.5, 0.98) : 0;
        const yesK = n.side === 0 ? bump(t, 1.05, 1.95) : 0;
        const noK = n.side === 1 ? bump(t, 2.05, 2.95) : 0;
        const startle = bump(t, 3.1, 3.7);
        const lean = bump(t, 4.05, 4.95);
        const around = bump(t, 7.05, 7.95);
        const facing = n.side === 0 ? false : true;
        const turn = around > 0.4 && (n.i % 2 === 0);
        n.p.set({
          x, y: n.y, s: n.s, flip: walking ? n.from > n.x : turn ? !facing : facing, walk: walking ? x * 0.07 : undefined,
          armF: 16 + pointMat * 40 + pointHim * 70 + yesK * 40 + noK * 30 + lean * 30, armB: 8 + noK * 50 + startle * 60,
          head: (noK ? Math.sin(T * 7) * 6 * noK : 0) + yesK * 6 * Math.sin(T * 6) - lean * 4 - around * 8, lean: lean * 5 - startle * 5,
          blink: blinkAt(T, n.seed),
        });
        fade(n.angry, noK * 0.5);
        fade(n.sad, around * 0.6);
      });

      /* v8 — the memory of him begging */
      const mk = es(t, 0.2, 0.55, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      drop(memory, 960, 250, mk, T, { amp: 1.2 });

      /* v9 — yes / only like him / it is I */
      const [lx, ly] = headAt(626, G.FLOOR + 2, 0.94, false);
      const yk = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.95, 2.05));
      vis(yes, { x: lx + 16, y: ly - 26, s: yk, o: yk > 0.01 ? 1 : 0 });
      const [rx, ry] = headAt(1040, G.FLOOR + 12, 1.0, true);
      const lk = es(t, 2.15, 2.35, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(like, { x: rx - 16, y: ry - 26, s: lk, o: lk > 0.01 ? 1 : 0 });
      const mek = es(t, 3.12, 3.32, ease.back) * (1 - es(t, 3.95, 4.05));
      vis(me, { x: hx + 16, y: hy - 30, s: mek, o: mek > 0.01 ? 1 : 0 });
      vis(meHeart, { x: hx + 8, y: hy + 54, s: mek * 0.9, o: mek > 0.01 ? 1 : 0 });

      /* v10 — how? */
      const hk = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.95, 5.05));
      vis(how, { x: rx - 16, y: ry - 26, s: hk, o: hk > 0.01 ? 1 : 0 });

      /* v11 — the story in four cards */
      const xs = [650, 790, 930, 1070];
      tiles.forEach((el, i) => {
        const a = i < 3 ? 5.1 + i * 0.25 : 6.12;
        const k = es(t, a, a + 0.3, ease.out) * (1 - es(t, 8.1 + i * 0.05, 8.5 + i * 0.05, ease.in));
        drop(el, xs[i], 190, k, T, { amp: 1, seed: i });
      });

      /* v12 — where is He? I don't know */
      const wk = es(t, 7.15, 7.35, ease.back) * (1 - es(t, 7.95, 8.05));
      vis(where, { x: rx - 16, y: ry - 26, s: wk, o: wk > 0.01 ? 1 : 0 });
      const dk = es(t, 8.15, 8.35, ease.back) * (1 - es(t, 8.95, 9.05));
      vis(dunno, { x: hx + 4, y: hy - 26, s: dk, o: dk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1, 40], [2, 0], [3, 60], [4.1, 30], [5, 30], [5.3, 20], [7, 20], [7.3, 20], [9, 0]]);
      S.cam.y = kf(t, [[0, -10], [0.5, -40], [1.1, 0], [4.9, 0], [5.3, -80], [7, -80], [7.4, 0], [9, 10]]);
      S.cam.z = kf(t, [[0, 1.04], [1.1, 1.1], [3, 1.14], [4.9, 1.1], [5.3, 1.02], [7, 1.02], [7.4, 1.1], [9, 1.12]]);
    };
  },
};
