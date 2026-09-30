// Łk 13,25–27 — the same house as night comes on. "When once the master of the house has risen and shut the door":
// the door swings shut, the light in the doorway goes out, the sky darkens and the stars come. "You will begin to
// stand outside and knock at the door, saying, 'Lord, open to us!'": the people on the step knock and call. "He will
// answer, 'I do not know where you come from'": the words come from behind the door. "We ate and drank in your
// presence, and you taught in our streets": they hold up what they remember — a table with bread and a cup, a street
// where He once taught. "I tell you, I do not know where you come from": the pictures go grey. "Depart from me, all you
// workers of iniquity": they turn away and go down the path into the dark, and the lit house stays shut.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { CAST } from '../kit.js';
import { house } from '../../assets/nature.js';
import { doorSet, DH, knot, bubble, roundel, fig13, loaf, cup, headAt, kf, es, ease, bump, seg, tr, PI } from './lib.js';

const sAt = (y) => Math.min(1, lerp(0.62, 1.0, (y - 610) / (900 - 610)));
const KNOCK = [
  { robe: C.dustyBlue, mantle: C.clayMantle, hairStyle: 'short', hair: C.hair3, beard: 'full', skin: C.skin2, belt: C.leather },
  { robe: C.roseRobe, hairStyle: 'veil', veil: C.linen2, veil2: shade(C.linen2, -0.12), hair: C.hair, skin: C.skin },
];

export default {
  id: 'lk13-shut',
  beats: [
    { v: 25, text: 'Skoro Pan domu wstanie i drzwi zamknie,' },
    { v: 25, cont: true, text: 'wówczas stojąc na dworze, zaczniecie kołatać do drzwi i wołać: "Panie, otwórz nam!";' },
    { v: 25, cont: true, text: 'lecz On wam odpowie: "Nie wiem, skąd jesteście".' },
    { v: 26 },
    { v: 27, text: 'Lecz On rzecze: "Powiadam wam, nie wiem, skąd jesteście.' },
    { v: 27, cont: true, text: 'Odstąpcie ode Mnie wszyscy dopuszczający się niesprawiedliwości!"' },
  ],
  cam: { x: [-20, 20], y: [-40, 30], z: [1, 1.14] },
  build(S) {
    const D = doorSet(S);
    const c = D.c;

    /* the people outside */
    const G = [[640, 'a', 3, false, 646], [960, 'b', 3, true, 650], [560, 'e', 3, false, 720], [1050, 'f', 3, true, 724]].map(([x, k, n, flip, y], i) => ({
      i, x, y, flip,
      a: D.crowdL.sprite(knot('lk13-shut-' + k, n, { s: 1, spread: 44, rows: 1, flip, arms: [20, 60] }), x, y),
      b: D.crowdL.sprite(knot('lk13-shut-' + k, n, { s: 1, spread: 44, rows: 1, flip: !flip, arms: [10, 20], head: [14, 20] }), x, y),
    }));
    const kn = KNOCK.map((o, i) => ({ i, p: S.puppet(D.act.add(person(c, o))), x: [742, 870][i], y: 624 + i * 8 }));
    const fx = D.fx;
    const open = fx.add(`<g opacity="0">${bubble(c, tr('Panie, otwórz nam!', 'Lord, Lord, open to us!'), { size: 20, tail: 1 })}</g>`);
    const knocks = [0, 1, 2].map((i) => fx.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 14 + i * 8, 14 + i * 8, -0.6, 0.6, 8), 2.4)}" fill="${C.cream}"/></g>`));
    const grille = D.houseL.add(`<g opacity="0"><rect x="${DH.DX - 8}" y="${528 - 104}" width="16" height="14" fill="${C.lampGlow}"/><circle cx="${DH.DX}" cy="${528 - 97}" r="30" fill="url(#warm-glow)"/></g>`);
    const answer1 = fx.add(`<g opacity="0">${bubble(c, [tr('Nie wiem,', 'I don’t know you'), tr('skąd jesteście', 'or where you come from')], { size: 20, fill: C.halo, tail: -1 })}</g>`);
    const answer2 = fx.add(`<g opacity="0">${bubble(c, [tr('Nie wiem, skąd jesteście.', 'I don’t know where you come from.'), tr('Odstąpcie ode Mnie!', 'Depart from me!')], { size: 20, fill: C.halo, tail: -1 })}</g>`);
    // what they remember: a table with bread and a cup; a street where He taught
    const table = sheet().p(c.cut(c.rect(-40, 8, 80, 8), 0.3, 4), C.wood).p(c.cut(c.rect(-34, 16, 6, 16), 0.2, 3) + c.cut(c.rect(28, 16, 6, 16), 0.2, 3), C.wood2).out();
    const memA = `<g transform="translate(0 6)">${table}<g transform="translate(-12 8)">${loaf(c, 12)}</g><g transform="translate(16 8) scale(.6)">${cup(c)}</g></g>`;
    const memB = `<g transform="translate(0 30)">${house(c, -46, -8, 30, 30, { stairs: false })}${house(c, 20, -12, 26, 34, { stairs: false })}${fig13(c, CAST.jesus, { s: 0.2, armB: 110, armF: 50 })}<g transform="translate(-22 2)">${fig13(c, KNOCK[0], { s: 0.16 })}</g><g transform="translate(26 2)">${fig13(c, KNOCK[1], { s: 0.16, flip: true })}</g></g>`;
    const mems = [memA, memB].map((m, i) => ({ i, x: [640, 960][i], el: fx.add(`<g>${roundel(c, m, { r: 50 })}</g>`), grey: fx.add(`<g opacity="0">${roundel(c, `<rect x="-60" y="-60" width="120" height="120" fill="${C.storm}" opacity=".55"/>`, { r: 50, face: C.stone2, rim: C.rock2 })}</g>`) }));

    return (t, time) => {
      const T = time;
      D.update(T);

      /* v25a — the master rises and shuts the door; night */
      const shut = es(t, 0.2, 0.62, ease.in);
      pose(D.leaf, { x: DH.DX - DH.DW / 2, y: 528, sx: Math.max(0.001, shut), o: shut > 0.01 ? 1 : 0 });
      pose(D.doorLight, { o: 1 - shut * 0.9 });
      pose(D.spill, { o: 1 - shut });
      D.sk3.fade(es(t, 0.1, 0.9));
      D.starL.fade(es(t, 0.5, 1.0));

      /* the people: at the door, knocking; then turning away down the path */
      const away = es(t, 5.12, 5.7);
      G.forEach((g) => {
        const turn = es(t, 5.05 + g.i * 0.03, 5.1 + g.i * 0.03);
        const y = g.y + away * (240 + g.i * 20), x = g.x + (g.flip ? 1 : -1) * away * 120;
        const s = sAt(Math.min(y, 900));
        g.a.set({ x, y, s, o: (1 - turn) });
        g.b.set({ x, y, s, o: turn * (1 - es(t, 5.6, 5.95) * 0.7) });
      });
      kn.forEach((k) => {
        const knock = k.i === 0 ? Math.max(0, Math.sin((t - 1.1) * 30)) * es(t, 1.08, 1.15) * (1 - es(t, 1.9, 2.0)) : 0;
        const turn = es(t, 5.02, 5.08);
        const y = k.y + away * 260, s = sAt(y);
        k.p.set({ x: k.x + (k.i ? 1 : -1) * away * 60, y, s, flip: k.i === 1 ? turn < 0.5 : turn > 0.5, armF: 30 + knock * 40 + es(t, 1.1, 1.2) * 60 * (1 - es(t, 1.9, 2.05)) + bump(t, 3.05, 3.9) * 70, armB: 10 + bump(t, 1.2, 1.9) * 100 * k.i + bump(t, 3.05, 3.9) * 90, head: -8 + es(t, 4.1, 4.3) * 16 * (1 - away), blink: blinkAt(T, 3 + k.i) });
      });
      knocks.forEach((kk, i) => { const k = ((t - 1.1) * 3 + i / 3) % 1; pose(kk, { x: DH.DX + 10, y: 470, s: 0.6 + k * 1.2, o: t > 1.1 && t < 1.95 ? (1 - k) * 0.9 : 0 }); });
      const ob = es(t, 1.3, 1.45, ease.back) * (1 - es(t, 1.95, 2.05));
      const [kx, ky] = headAt(742, 624, sAt(624));
      pose(open, { x: kx - 30, y: ky - 30, s: ob, o: ob > 0.02 ? 1 : 0 });

      /* v25c / v27a — the voice from behind the shut door */
      pose(grille, { o: bump(t, 2.05, 3.0) + bump(t, 4.05, 6.0) });
      const a1 = es(t, 2.15, 2.3, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(answer1, { x: DH.DX + 26, y: 410, s: a1, o: a1 > 0.02 ? 1 : 0 });
      const a2 = es(t, 4.15, 4.3, ease.back) * (1 - es(t, 5.9, 6.0));
      pose(answer2, { x: DH.DX + 26, y: 410, s: a2, o: a2 > 0.02 ? 1 : 0 });

      /* v26 — what they remember, held up; v27a — grey */
      mems.forEach((m) => {
        const k = es(t, 3.05 + m.i * 0.1, 3.3 + m.i * 0.1, ease.out) * (1 - es(t, 5.1, 5.4, ease.in));
        const y = lerp(-800, 220, k) + (T ? Math.sin(T * 0.8 + m.i) * 2 : 0);
        pose(m.el, { x: m.x, y, r: T ? Math.sin(T * 0.6 + m.i) : 0 });
        pose(m.grey, { x: m.x, y, r: T ? Math.sin(T * 0.6 + m.i) : 0, o: es(t, 4.3 + m.i * 0.08, 4.5 + m.i * 0.08) * (k > 0.01 ? 0.9 : 0) });
      });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -10], [1.0, -20], [5.0, -20], [5.8, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.1], [5.0, 1.1], [5.8, 1.04]]);
      void seg; void PI; void mix;
    };
  },
};
