// Łk 9,12–13 — the same hillside, and the day wears away: the sun sinks behind the far hills and the sky goes gold and
// violet. The Twelve come to Him: "Send the crowd away to the villages and farms round about, to lodge and get food,
// for we are in a deserted place" — Peter's bubble holds a roof and a loaf, and out on the hills the villages and farms
// light their windows. "You give them something to eat": He turns and points them to the crowd; they start back.
// "We have no more than five loaves and two fish": Andrew lifts his basket and the five loaves and two fish rise out of it
// in a row; "unless we go and buy food for all these people" — Philip's purse, three coins, and a question over them.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { bethSet, BETH, bethCrowd, TW9, TW, speech, bubble, thought, GLYPH, basket, barleyLoaf, fishCut, purse, coin, halo, loaf, kf, hand, headAt, handAt, tr, PI } from './lib.js';
import { house } from '../../assets/nature.js';

const JX = 790;
const DIS = [
  { k: 'peter', o: TW9.peter, x: 905, dy: 0 }, { k: 'andrew', o: TW9.andrew, x: 975, dy: 10 }, { k: 'philip', o: TW9.philip, x: 1045, dy: 0 },
  { k: 'john', o: TW9.john, x: 1115, dy: 10 }, { k: 'james', o: TW9.james, x: 1185, dy: 0 },
];

export default {
  id: 'lk9-evening',
  beats: [
    { v: 12, text: 'Dzień począł się chylić ku wieczorowi.' },
    { v: 12, cont: true, text: 'Wtedy przystąpiło do Niego Dwunastu mówiąc: «Odpraw tłum; niech idą do okolicznych wsi i zagród, gdzie znajdą schronienie i żywność, bo jesteśmy tu na pustkowiu».' },
    { v: 13, text: 'Lecz On rzekł do nich: «Wy dajcie im jeść!»' },
    { v: 13, cont: true, text: 'Oni odpowiedzieli: «Mamy tylko pięć chlebów i dwie ryby; chyba że pójdziemy i nakupimy żywności dla wszystkich tych ludzi».' },
  ],
  cam: { x: [-30, 40], y: [20, 80], z: [1.04, 1.16] },
  build(S) {
    const B = bethSet(S, { eveCols: ['#7d78a6', '#e3a78b', '#f4cf9f'] });
    const c = S.c;
    const gy = (x) => B.gfn(x) + 18;
    const CR = bethCrowd(B);
    CR.forEach((m) => m.sp.set({ x: m.x, y: m.y }));

    /* lit windows in the villages and farms round about (on the far hills and in Bethsaida) */
    const litMid = S.layer({ par: 0.16, sh: 1, flat: true });
    const LIT = [[BETH.TX, B.mfn(BETH.TX) + 4, 1], [1460, B.mfn(1460) + 6, 0.7], [140, B.mfn(140) + 6, 0.7], [560, B.mfn(560) + 8, 0.6]].map(([x, y, s], i) => {
      let win = '';
      for (let k = 0; k < 5; k++) win += `<rect x="${(c.rr(-90, 90) * s).toFixed(0)}" y="${(-c.rr(8, 30) * s).toFixed(0)}" width="${(7 * s).toFixed(1)}" height="${(7 * s).toFixed(1)}" fill="${C.lampGlow}"/>`;
      return { i, x, y, el: litMid.add(`<g opacity="0"><circle r="${110 * s}" fill="url(#warm-glow)" opacity=".7"/>${win}</g>`) };
    });
    const farms = [140, 560, 1460].map((x) => B.mid.add(house(c, x, B.mfn(x) + 8, 34, 24, { stairs: false })));

    /* the Twelve (five in front) and Jesus */
    const act = S.layer({ par: 0.5, sh: 5 });
    const D = DIS.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, { ...d.o, ...(d.k === 'andrew' ? {} : {}) }))) }));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const basketEl = act.add(`<g>${basket(c, { w: 50, h: 30 })}</g>`);

    /* words and things */
    const fx = S.layer({ par: 0.55, sh: 4 });
    const askB = fx.add(`<g opacity="0">${speech(c, `<g transform="translate(-16 12) scale(.5)">${house(c, -30, 0, 60, 44, { stairs: false })}</g><g transform="translate(18 6)">${loaf(c, 13)}</g>`, { w: 84, h: 56, flip: true })}</g>`);
    const youB = fx.add(`<g opacity="0">${bubble(c, tr('Wy dajcie im jeść!', 'You give them something to eat!'), { size: 19, tail: 1 })}</g>`);
    const bangs = [0, 1, 2].map(() => fx.add(`<g opacity="0">${speech(c, GLYPH.bang(c), { w: 38, h: 38, flip: true })}</g>`));
    const LOAVES = Array.from({ length: 5 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${barleyLoaf(c, 15)}</g>`) }));
    const FISH = [0, 1].map((i) => fx.add(`<g opacity="0">${fishCut(c, { color: i ? C.teal2 : C.lake3, r: 0.8 })}</g>`));
    const buy = fx.add(`<g opacity="0">${thought(c, `<g transform="translate(-10 4)">${purse(c)}</g><g transform="translate(16 -2) scale(.9)">${GLYPH.q(c)}</g>`, { w: 76, h: 56 })}</g>`);
    const coins = [0, 1, 2].map(() => fx.add(`<g opacity="0">${coin(c, 7)}</g>`));

    return (t, time) => {
      const T = time;
      /* v12a — the day wears away */
      const eve = es(t, 0.05, 0.9);
      B.eve.fade(eve * 0.85);
      B.update(T, { sunX: 1180 - eve * 60, sunY: 150 + eve * 250 });
      const lit = es(t, 1.35, 1.65);
      LIT.forEach((l) => pose(l.el, { x: l.x, y: l.y, o: Math.max(eve * 0.3, lit) * (l.i === 0 ? 1 : 0.9) }));

      /* Jesus teaches (v12a), listens (v12b), answers (v13a) */
      const answer = es(t, 2.02, 2.2) * (1 - es(t, 2.9, 3.05));
      const toCrowd = bump(t, 2.1, 2.95);
      jesus.set({ x: JX, y: gy(JX), s: 1.02, flip: t < 1.05 || (t > 2.3 && t < 2.8), armF: 30 + bump(t, 0.05, 0.9) * 40 + answer * 60, armB: 10 + bump(t, 0.05, 0.9) * 40 + toCrowd * 60, head: -2, blink: blinkAt(T, 1) });

      /* the Twelve come to Him */
      D.forEach((d) => {
        const come = es(t, 1.02 + d.i * 0.03, 1.3 + d.i * 0.03);
        const x = lerp(d.x + 120, d.x, come);
        const startle = bump(t, 2.2, 2.95);
        const isP = d.k === 'peter', isA = d.k === 'andrew', isPh = d.k === 'philip';
        const talk = isP ? bump(t, 1.2, 1.95) : 0;
        const lift = isA ? es(t, 3.05, 3.25) : 0;
        d.p.set({ x, y: gy(x) + d.dy, s: 0.94, flip: true, walk: come > 0 && come < 1 ? x * 0.07 : undefined, armF: 20 + talk * 80 + lift * 90 + (isPh ? bump(t, 3.45, 3.98) * 70 : 0), armB: talk * 60 + startle * 100 * (d.i % 2) + lift * 60, head: -startle * 8 - lift * 6, lean: -startle * 6, o: come > 0 ? 1 : 0, blink: blinkAt(T, d.seed) });
        d.x_ = x;
      });
      const [phx, phy] = headAt(D[0].x_, gy(D[0].x_), 0.94, true);
      const ak = es(t, 1.2, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      pose(askB, { x: phx - 20, y: phy - 20, s: ak, o: ak > 0.01 ? 1 : 0 });
      const [jhx, jhy] = headAt(JX, gy(JX), 1.02, false);
      const yk = es(t, 2.08, 2.25, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(youB, { x: jhx - 40, y: jhy - 50, s: yk, o: yk > 0.01 ? 1 : 0 });
      bangs.forEach((b, i) => {
        const d = D[i * 2];
        const k = es(t, 2.3 + i * 0.06, 2.45 + i * 0.06, ease.back) * (1 - es(t, 2.92, 3.0));
        const [hx, hy] = headAt(d.x_, gy(d.x_) + d.dy, 0.94, true);
        pose(b, { x: hx - 12, y: hy - 22, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v13b — five loaves and two fish rise out of Andrew's basket; the purse and the question */
      const A = D[1];
      const [ax, ay] = handAt(A.x_, gy(A.x_) + A.dy, 0.94, true, 20 + es(t, 3.05, 3.25) * 90);
      pose(basketEl, { x: ax, y: ay + 22, s: 0.9, o: es(t, 2.95, 3.05) });
      LOAVES.forEach((l) => {
        const k = es(t, 3.15 + l.i * 0.06, 3.35 + l.i * 0.06, ease.back);
        pose(l.el, { x: lerp(ax, 800 + l.i * 42, k), y: lerp(ay, 440 - Math.abs(l.i - 2) * 6, k), s: 0.4 + k * 0.8, o: k > 0.01 ? 1 : 0 });
      });
      FISH.forEach((f, i) => {
        const k = es(t, 3.45 + i * 0.07, 3.62 + i * 0.07, ease.back);
        pose(f, { x: lerp(ax, 850 + i * 72, k), y: lerp(ay, 486, k), r: i ? 8 : -8, s: 0.5 + k * 0.6, o: k > 0.01 ? 1 : 0 });
      });
      const P = D[2];
      const [bx, by] = headAt(P.x_, gy(P.x_) + P.dy, 0.94, true);
      const bk = es(t, 3.5, 3.65, ease.back);
      pose(buy, { x: bx - 40, y: by - 12, s: bk, o: bk > 0.01 ? 1 : 0 });
      coins.forEach((cn, i) => {
        const k = bump(t, 3.55 + i * 0.05, 4.0);
        pose(cn, { x: bx - 50 + i * 16, y: by - 110 - Math.sin(k * PI) * 10, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, -20], [0.9, -10], [1.2, 20], [2.0, 20], [2.3, 0], [3.0, 10], [3.4, 20]]);
      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.12], [2.0, 1.12], [2.3, 1.1], [3.2, 1.14]]);
      S.cam.y = kf(t, [[0, 60], [1.0, 70], [3.0, 70], [3.4, 60]]);
    };
  },
};
