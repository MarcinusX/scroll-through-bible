// J 11,4–6 — beyond the Jordan. The messenger runs in and kneels with the letter; the little heart with the sick
// friend inside it floats over him. "This illness is not unto death": a hanging board with a dark cave at one end and
// God's glory at the other — its needle swings from the cave to the glory; rays spread behind Jesus, the Son glorified.
// "Jesus loved Martha, her sister and Lazarus": three hearts come down, each with a small portrait. Yet He stays: He
// sits down on a stone and two day-discs light up in turn as the sun crosses the sky twice.
import { C, person, CAST, blinkAt } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  jordanSet, DAY, NIGHT, DUSK, MESSENGER, MARTHA, MARY, LAZARUS, DISC, letter, heart, bedIcon, caveIcon, medallion, dayDisc, glory, feverWaves,
  hang2, strip, iconBubble, vis, kf, moving, hand, pose, sheet, shade, mix, lerp, tr, PI, FONT,
} from './lib.js';

const F = 700;

/** the board: a dark cave at the left end, God's glory at the right; the needle is separate (origin: pivot) */
function wayBoard(c, w = 480) {
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, -44, w, 88), 0.6, 8), C.wood3);
  s.p(c.cut(c.rect(-w / 2 + 8, -36, w - 16, 72), 0.4, 8), C.cream);
  const cave = `<g class="death" transform="translate(${-w / 2 + 70} 26) scale(.72)">${caveIcon(c)}</g>`;
  const glo = `<g class="glo" transform="translate(${w / 2 - 70} -4)"><circle r="54" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.star(0, 0, 30, 22, 14, 0), 0.3, 3), C.sun).p(c.cut(c.circ(0, 0, 17, 16), 0.3, 3), C.halo).out()}</g>`;
  const txt = `<text x="${-w / 2 + 70}" y="62" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.inkSoft}">${tr('śmierć', 'death')}</text><text x="${w / 2 - 70}" y="62" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.terracotta}">${tr('chwała Boża', 'the glory of God')}</text>`;
  return `<path d="M${-w * 0.36} -1600V-44M${w * 0.36} -1600V-44" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}${cave}${glo}<rect x="${-w / 2 + 8}" y="44" width="${w - 16}" height="28" fill="${C.cream}"/>${txt}`;
}
function needle(c, len = 130) {
  return sheet().p(c.cut([[-12, 0], [0, -6], [len, 0], [0, 6]], 0.2, 4), C.terracotta).p(c.cut(c.circ(0, 0, 9, 12), 0.2, 3), C.wood2).out();
}

export default {
  id: 'j11-message',
  beats: [
    { v: 4, text: 'Jezus usłyszawszy to rzekł:' },
    { v: 4, cont: true, text: '«Choroba ta nie zmierza ku śmierci, ale ku chwale Bożej,' },
    { v: 4, cont: true, text: 'aby dzięki niej Syn Boży został otoczony chwałą».' },
    { v: 5 },
    { v: 6, text: 'Mimo jednak że słyszał o jego chorobie,' },
    { v: 6, cont: true, text: 'zatrzymał się przez dwa dni w miejscu pobytu.' },
  ],
  cam: { x: [-60, 40], y: [-80, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = jordanSet(S, { skyCols: DAY, sunAt: [1148, 272] });
    const lightL = S.layer({ par: 0.48, sh: 1 });
    const glo = lightL.add(`<g>${glory(c, 520, 24)}</g>`);

    const A = S.layer({ par: 0.52, sh: 5 });
    const POS = [[1000, 1], [520, 0], [1150, 1], [1075, 1], [440, 0], [590, 0]];   // peter, andrew, james, john, matthew, thomas
    const disc = DISC.map((o, i) => ({ i, x: POS[i][0], flip: !!POS[i][1], p: S.puppet(A.add(person(c, o))) }));
    const stoneSeat = A.add(`<g><path d="${c.cut(c.blob(0, -18, 40, 20, 12, 0.1), 0.8, 5)}" fill="${C.rock2}"/></g>`);
    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const jesusSit = S.puppet(A.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const runner = S.puppet(A.add(person(c, MESSENGER)));
    const kneeler = S.puppet(A.add(person(c, { ...MESSENGER, pose: 'kneel' })));
    const sitter = S.puppet(A.add(person(c, { ...MESSENGER, pose: 'sit' })));
    const note = A.add(`<g>${letter(c, 30)}</g>`);
    set.front();

    /* the flies */
    const X = S.layer({ par: 0.56, sh: 6 });
    const bub = X.add(`<g>${iconBubble(c, `<circle r="44" fill="url(#halo-glow)"/><g transform="translate(0 4)">${heart(c, 30)}</g><g transform="translate(-2 12) scale(.46)">${bedIcon(c, LAZARUS)}</g>`, { w: 130, h: 104, side: 1 })}</g>`);
    const fev = X.add(`<g>${feverWaves(c, 34)}</g>`);
    const board = X.add(`<g>${wayBoard(c, 480)}</g>`);
    const deathG = board.querySelector('.death'), gloG = board.querySelector('.glo');
    const ndl = X.add(`<g>${needle(c, 150)}</g>`);
    const HX = [[640, 290], [800, 250], [960, 290]];
    const hearts = [MARTHA, MARY, LAZARUS].map((o, i) => ({ i, el: X.add(`<g>${hang2(`${heart(c, 46, C.jesusMantle)}<g transform="translate(0 -4)">${medallion(c, o, { r: 22, rim: C.cream, back: C.blushVeil })}</g>`, 0.01, 300)}</g>`) }));
    const names = [tr('Marta', 'Martha'), tr('Maria', 'Mary'), tr('Łazarz', 'Lazarus')].map((w, i) => X.add(`<g>${strip(c, w, { size: 15 })}</g>`));
    const days = ['I', 'II'].map((n, i) => ({ i, el: X.add(`<g>${hang2(dayDisc(c, n, 30), 0.01, 300)}</g>`) }));
    days.forEach((d) => { d.lit = d.el.querySelector('.lit'); });

    const RK = [[0, 240], [0.45, 640]];
    return (t, time) => {
      const T = time;
      /* sky & sun: two days pass in v6b */
      const sa = -0.9 + es(t, 5.05, 5.9, ease.sine) * PI * 4;
      const sx = 800 + Math.cos(sa) * 560, sy = 640 + Math.sin(sa) * 470;
      const night = Math.min(1, Math.max(0, (Math.sin(sa) + 0.3) / 0.45));
      set.sk.blend(DAY, NIGHT, night * 0.9);
      pose(set.sunEl, { x: sx, y: sy, r: Math.sin(T * 0.6) * 1.5 });
      const dayPh = seg(t, 5.05, 5.9) * 2;
      pose(set.cl, { x: 560 + Math.sin(T * 0.1) * 20 + dayPh * 120, y: 150, r: Math.sin(T * 0.5) * 1 });

      /* v4a — the messenger arrives, kneels, gives the letter */
      const rx = kf(t, RK, ease.out);
      const kneel = seg(t, 0.45, 0.5);
      const sitDown = seg(t, 5.0, 5.05);
      runner.set({ x: rx, y: F + 12, s: 0.96, walk: moving(t, RK) ? rx * 0.12 : undefined, amt: 1.5, lean: 6, armF: 30, blink: blinkAt(T, 3), o: (1 - kneel) * (t > 0.0 ? 1 : 0) });
      const offer = es(t, 0.5, 0.75) * (1 - es(t, 1.1, 1.3));
      kneeler.set({ x: 640, y: F + 12, s: 0.96, armF: 20 + offer * 55 + es(t, 4.1, 4.4) * (1 - es(t, 4.9, 5.0)) * 40, armB: 10 + es(t, 4.1, 4.4) * (1 - es(t, 4.9, 5.0)) * 40, head: -offer * 6 - es(t, 4.1, 4.4) * 8, blink: blinkAt(T, 3), o: kneel * (1 - sitDown) });
      sitter.set({ x: 620, y: F + 12, s: 0.96, armF: 30, head: -6, blink: blinkAt(T, 3), o: sitDown });
      const [hx, hy] = hand(640, F + 12, 0.96, false, 20 + offer * 55, 0, 46);
      const inHand = es(t, 1.05, 1.25);
      const [jhx, jhy] = hand(800, F + 12, 1.04, true, 40);
      vis(note, { x: lerp(hx + 6, jhx - 4, inHand), y: lerp(hy - 8, jhy - 8, inHand), r: -8, o: seg(t, 0.4, 0.45) * (1 - seg(t, 1.3, 1.35)) });
      const bb = es(t, 0.45, 0.75, ease.back) * (1 - es(t, 1.05, 1.25)) + es(t, 4.05, 4.35, ease.back) * (1 - es(t, 4.85, 5.0));
      vis(bub, { x: 690, y: 470, s: bb, o: bb > 0.01 ? 1 : 0 });
      const fk = es(t, 4.1, 4.3) * (1 - es(t, 4.85, 5.0));
      vis(fev, { x: 710, y: 350 - ((T * 0.3) % 1) * 20, s: 0.9, o: fk * 0.8 });

      /* Jesus: listens, speaks, is glorified, loves, stays */
      const stand = 1 - seg(t, 5.05, 5.12);
      const speak = es(t, 1.1, 1.4) * (1 - es(t, 2.8, 3.0));
      const love = es(t, 3.05, 3.4) * (1 - es(t, 3.9, 4.1));
      jesus.set({ x: 800, y: F + 12, s: 1.04, flip: true, armF: 40 * (1 - speak) * (t < 1.35 ? 1 : 0) + speak * 70 + love * 40, armB: 10 + speak * 40 + es(t, 2.1, 2.4) * (1 - es(t, 2.8, 3.0)) * 60, head: -es(t, 0.2, 0.5) * 6 * (1 - speak) + es(t, 2.1, 2.4) * (1 - es(t, 2.8, 3.0)) * -6 + es(t, 4.1, 4.4) * 8, blink: blinkAt(T, 1), o: stand });
      pose(stoneSeat, { x: 820, y: F + 10, o: 1 });
      jesusSit.set({ x: 820, y: F - 8, s: 1.04, flip: true, armF: 30, armB: 10, head: 4, blink: blinkAt(T, 1), o: 1 - stand });

      /* the board: from the cave to the glory */
      const bk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.1, 2.35, ease.in));
      const by = 270 - (1 - bk) * 520;
      vis(board, { x: 800, y: by, r: Math.sin(T * 0.6) * 0.6, o: bk > 0.01 ? 1 : 0 });
      const sw = es(t, 1.35, 1.8, ease.io);
      vis(ndl, { x: 800, y: by + 2, r: 180 - sw * 180 + Math.sin(T * 2) * (1 - sw) * 3, o: bk > 0.01 ? 1 : 0 });
      if (deathG) deathG.setAttribute('opacity', (1 - sw * 0.55).toFixed(2));
      if (gloG) gloG.setAttribute('transform', `translate(170 -4) scale(${(0.8 + sw * 0.35).toFixed(2)})`);

      /* v4c — the Son glorified */
      const gk = es(t, 2.05, 2.5) * (1 - es(t, 2.9, 3.1));
      vis(glo, { x: 800, y: 540, s: 0.5 + gk * 0.4, r: T * 2, o: gk * 0.7 });

      /* v5 — three hearts */
      hearts.forEach((h) => {
        const k = es(t, 3.05 + h.i * 0.12, 3.4 + h.i * 0.12, ease.back) * (1 - es(t, 3.95, 4.15, ease.in));
        vis(h.el, { x: HX[h.i][0], y: HX[h.i][1] - (1 - k) * 480 + Math.sin(T * 1.2 + h.i) * 3, r: Math.sin(T * 0.8 + h.i) * 3, o: k > 0.01 ? 1 : 0 });
        const nk = es(t, 3.35 + h.i * 0.12, 3.5 + h.i * 0.12) * (1 - es(t, 3.9, 4.0));
        vis(names[h.i], { x: HX[h.i][0], y: HX[h.i][1] + 66 - (1 - k) * 480, o: nk });
      });

      /* v6b — two days */
      days.forEach((d) => {
        const k = es(t, 5.0, 5.2, ease.out) * (1 - es(t, 5.95, 6.0));
        vis(d.el, { x: 720 + d.i * 160, y: 240 - (1 - k) * 420, r: Math.sin(T * 0.7 + d.i) * 2, o: k > 0.01 ? 1 : 0 });
        if (d.lit) d.lit.setAttribute('opacity', es(t, 5.3 + d.i * 0.42, 5.4 + d.i * 0.42).toFixed(2));
      });

      /* the disciples */
      disc.forEach((d) => {
        const look = es(t, 4.1, 4.4) * (1 - es(t, 4.9, 5.1));
        const awe = es(t, 2.1, 2.4) * (1 - es(t, 2.8, 3.0));
        d.p.set({ x: d.x, y: F + 14 + (d.i % 2) * 6, s: 0.94, flip: d.flip, armF: 10 + awe * 40 + look * 30 * (d.i % 2), armB: 6 + awe * 30, head: -awe * 10 + look * (d.i % 2 ? 8 : -6), blink: blinkAt(T, d.i + 5) });
      });

      /* camera */
      S.cam.x = kf(t, [[0, -40], [1, 0], [2, 0], [3, 0], [4, -20], [5, 0], [6, 10]]);
      S.cam.y = kf(t, [[0, 0], [1, -60], [2, -40], [3, -60], [4, 10], [5, -40], [6, -40]]);
      S.cam.z = kf(t, [[0, 1.04], [1, 1.0], [2.5, 1.06], [3, 1.0], [4, 1.08], [5, 1.0], [6, 1.02]]);
    };
  },
};
