// Mk 9,9–13 — coming down the mountain. What they saw is sealed like a scroll "until the Son of Man
// rises" (a little tomb whose stone rolls back at sunrise); they puzzle over it; they ask about Elijah
// (a wheel of fire); Elijah comes first and mends everything (a broken jar comes together);
// the Son of Man must suffer (a shadow crosses the path); and Elijah has come already —
// a faint silhouette of John the Baptist, beside a candle that is snuffed.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, rock, grass, olive, sun, cloud, cypress, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { along, plate, sealedScroll, tombHill, fireWheel, thought, GLYPH, bubble, strip, scrollOpen, candle, shadowPerson, JOHN_B, LOOK, speech } from './lib.js';

const PI = Math.PI;
const P = 0.35;
const PATH = [[1230, 500], [1120, 540], [1010, 580], [900, 616], [800, 648], [700, 676], [560, 704]];
// where each walker is along the path at rest (0..1)
const SPOT = { jesus: 0.72, peter: 0.6, james: 0.5, john: 0.4 };

/** a clay jar broken in three; pieces are .pc (origin: jar base centre) */
function brokenJar(c) {
  const col = C.pot;
  const pieces = [
    [[-18, -60], [4, -60], [0, -46], [-6, -34], [-30, -30], [-28, -40], [-16, -52]],
    [[4, -60], [18, -60], [16, -52], [28, -40], [32, -20], [10, -26], [0, -46]],
    [[-30, -30], [-6, -34], [0, -46], [10, -26], [32, -20], [24, -4], [14, 0], [-14, 0], [-24, -4], [-32, -20]],
  ];
  return pieces.map((pts, i) => sheet().p(c.cut(pts, 0.4, 4), i === 2 ? col : shade(col, i ? 0.08 : -0.06)).out());
}

export default {
  id: 'm9-descent',
  beats: [
    { v: 9 },
    { v: 10 },
    { v: 11 },
    { v: 12, text: 'Rzekł im w odpowiedzi: «Istotnie, Eliasz przyjdzie najpierw i naprawi wszystko.' },
    { v: 12, cont: true, text: 'Ale jak jest napisane o Synu Człowieczym? Ma On wiele cierpieć i być wzgardzonym.' },
    { v: 13 },
  ],
  cam: { x: [-40, 40], y: [-30, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const DAY = ['#c6dad8', '#ece5cf', '#f5e4c8'];
    const DIM = ['#a9b3bd', '#d7d0c4', '#e6d6c0'];
    const sk = sky(S, DAY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    // phone: the sun, and the cloud that dims it (v12), inside the screen and above the plates
    const PH = S.portrait;
    const SUN = PH ? [965, 90] : [1210, 150], SHX = PH ? 960 : 1190, SHY = PH ? 110 : 180;
    const sunEl = hanging(hangL, sun(c, 42), { x: SUN[0], y: SUN[1], len: 800 });
    const shadowCloud = hanging(hangL, cloud(c, 260, mix(C.storm, C.stone2, 0.55), mix(C.storm2, C.stone2, 0.4)), { x: 1210, y: 170, len: 900 });

    // the valley far below, where a crowd is already waiting
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [22, 9, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.lavender, 0.3) }).markup);
    const vall = S.layer({ par: 0.16, sh: 3 });
    const vh = hillsWith(c, { y: 540, amps: [12, 5, 2], lens: [900, 300, 110], color: C.hillMid, trees: 16, treeColor: C.sage, treeH: 18 });
    vall.add(vh.markup);
    let dots = '';
    for (let i = 0; i < 26; i++) { const x = 220 + c.rr(0, 260), y = vh.fn(x) + 8 + c.rr(0, 10); dots += c.cut(c.rect(x, y - 9, 4, 9), 0.2, 3) + c.cut(c.circ(x + 2, y - 11, 2.2, 6), 0.1, 2); }
    vall.add(`<path d="${dots}" fill="${mix(C.plumRobe, C.hillMid, 0.3)}"/>`);

    /* ---------- the mountain slope and the path down ---------- */
    const slope = S.layer({ par: P, sh: 4 });
    const s = sheet();
    s.p(c.cut([[-900, 1700], [-900, 760], [300, 740], [600, 700], [900, 640], [1100, 560], [1300, 470], [1500, 400], [1700, 360], [2500, 340], [2500, 1700]], 1.4, 12), mix(C.hillNear, C.rock, 0.25));
    s.p(c.cut([[1100, 560], [1300, 470], [1500, 400], [1700, 360], [1700, 470], [1400, 540], [1200, 600]], 1.2, 10), shade(mix(C.hillNear, C.rock, 0.25), 0.1), 'opacity=".7"');
    s.p(c.ribbon(PATH.map(([x, y]) => [x, y + 6]).concat([[380, 730], [-200, 760]]), 18, 2), mix(C.sand, C.hillNear, 0.35));
    slope.add(s.out());
    slope.add(rock(c, 1260, 540, 80, 30, C.rock2) + rock(c, 480, 740, 70, 26) + cypress(c, 1380, 520, 120, C.moss2) + cypress(c, 1420, 510, 90, C.moss2) + bush(c, 340, 760, 90, C.sage, C.moss) + olive(c, 180, 790, 0.9));
    slope.add(grass(c, { x0: 200, x1: 1600, y: 700, n: 26, h: 12, color: C.olive, fn: (x) => 760 - (x - 200) * 0.28 }));

    /* ---------- the four walking down ---------- */
    const pL = S.layer({ par: P, sh: 5 });
    const W = [
      { k: 'john', o: CAST.john }, { k: 'james', o: CAST.james }, { k: 'peter', o: CAST.peter }, { k: 'jesus', o: CAST.jesus },
    ].map((w, i) => ({ ...w, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, w.o))) }));
    S.defs(`<radialGradient id="${S.id('shade')}"><stop offset="0" stop-color="#3a2c38" stop-opacity=".45"/><stop offset=".6" stop-color="#3a2c38" stop-opacity=".2"/><stop offset="1" stop-color="#3a2c38" stop-opacity="0"/></radialGradient>`);
    const shadowOver = pL.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="230" ry="60" fill="url(#${S.id('shade')})"/></g>`);
    // their questions
    const qs = ['peter', 'james', 'john'].map((k, i) => ({ k, i, el: pL.add(`<g opacity="0">${thought(c, i === 1 ? `<g transform="scale(.9)">${sun(c, 11)}</g>` : GLYPH.q(c), { w: 52, h: 42 })}</g>`) }));
    const askEl = pL.add(`<g opacity="0">${bubble(c, tr('A Eliasz?', 'And Elijah?'), { size: 20, tail: -1 })}</g>`);
    const hushEl = pL.add(`<g opacity="0">${speech(c, `<text x="0" y="7" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="22" font-style="italic" fill="${C.ink}">…</text>`, { w: 50, h: 34 })}</g>`);

    /* ---------- plates hung from the flies ---------- */
    const plL = S.layer({ par: 0.1, sh: 5 });
    const scrollEl = hanging(plL, `<g transform="scale(1.3)">${sealedScroll(c, 76)}</g>`, { x: 700, y: 250, len: 900 });
    const T0 = tombHill(c, 120);
    const tombPlate = hanging(plL, `${plate(c, `<g data-k="dawn" transform="translate(0 20)"><circle r="40" fill="url(#warm-glow)"/>${sun(c, 16)}</g><g transform="translate(0 36)">${T0.hill}</g><g data-k="tstone">${T0.stone}</g>`, { r: 70 })}`, { x: 960, y: 250, len: 900 });
    const dawn = S.$('dawn'), tstone = S.$('tstone');
    const elijahPlate = hanging(plL, plate(c, `<g transform="translate(14 -6)">${fireWheel(c, 26)}</g><g transform="translate(-10 52) scale(.44)">${shadowPerson(c, LOOK.elijah, '#4a3a33')}</g>`, { r: 70 }), { x: 640, y: 250, len: 900 });
    const jar = brokenJar(c);
    const jarPlate = hanging(plL, `${plate(c, '', { r: 70 })}${jar.map((m, i) => `<g data-k="shard${i}"><g transform="translate(0 32)">${m}</g></g>`).join('')}`, { x: 960, y: 250, len: 900 });
    const shards = jar.map((_, i) => S.$('shard' + i));
    const writPlate = hanging(plL, `<g transform="scale(1.4)">${scrollOpen(c, 96, 64)}</g>`, { x: 800, y: 240, len: 900 });
    const johnPlate = hanging(plL, `${plate(c, `<g transform="translate(-14 64) scale(.6)">${shadowPerson(c, JOHN_B, '#4a3a33')}</g>`, { r: 76, fill: C.parchment })}<g data-k="jcandle" transform="translate(44 50) scale(.6)">${candle(c, 34)}</g>`, { x: 800, y: 250, len: 900 });
    const jc = S.$('jcandle');
    const jFlame = jc.querySelector('.flame'), jGlow = jc.querySelector('.glow');
    const johnTag = plL.add(`<g opacity="0">${strip(c, tr('Jan Chrzciciel', 'John the Baptist'), { size: 16 })}</g>`);

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(rock(c, 150, 970, 260, 100, C.rock2) + rock(c, 1460, 975, 220, 80, C.rock) + bush(c, 1300, 990, 160, C.sage, C.moss));

    return (t, time) => {
      const T = time;
      const dim = bump(t, 4.05, 5.2) * 0.9 + es(t, 5.3, 5.9) * 0.4;
      sk.blend(DAY, DIM, dim);
      swing(sunEl, SUN[0], SUN[1], T, 1, 0.6);
      swing(shadowCloud, SHX, lerp(-1000, SHY, es(t, 4.05, 4.5)) - es(t, 5.5, 6) * 1200, T, 1, 0.6, 2);

      /* walking: beat 0 down the path, then slowly on while they talk */
      const lead = lerp(0, 0.72, es(t, 0, 0.8)) + es(t, 1, 6) * 0.1;
      const walking = (t > 0.02 && t < 0.8) || (t > 1 && t < 5.95);
      W.forEach((w) => {
        const u = Math.max(0, lead - (0.72 - SPOT[w.k]));
        const [x, y] = along(PATH, u);
        const isJ = w.k === 'jesus';
        const turnBack = isJ && (bump(t, 0.35, 0.95) > 0.2 || (t > 3.05 && t < 6));
        const stopped = isJ && ((t > 0.35 && t < 0.95) || t > 3.05);
        const talk = isJ ? (es(t, 3.1, 3.3) + bump(t, 0.4, 0.95)) * (Math.sin(T * 1.6) * 0.5 + 0.5) : 0;
        const hush = isJ ? bump(t, 0.3, 0.9) : 0;
        const ask = w.k === 'peter' ? bump(t, 2.05, 2.95) : 0;
        const huddle = !isJ ? bump(t, 1.05, 1.95) : 0;
        w.p.set({
          x, y, s: 0.82 + u * 0.12, flip: !turnBack,
          walk: walking && !stopped ? u * 60 + w.i : undefined, amt: 0.7,
          armF: 12 + hush * 80 + talk * 25 + ask * 60 + es(t, 5.1, 5.4) * (isJ ? 30 : 0), armB: 8 + ask * 20 + (isJ ? es(t, 3.1, 3.4) * 40 * (1 - es(t, 3.9, 4.1)) : 0),
          head: -4 + huddle * (w.i % 2 ? 12 : -8) - (isJ ? es(t, 4.1, 4.5) * 10 * (1 - es(t, 4.9, 5.1)) : 0), lean: huddle * (w.k === 'john' ? -6 : 4),
          blink: blinkAt(T, w.seed),
        });
        w.x = x; w.y = y; w.s = 0.82 + u * 0.12;
      });
      const J = W[3], Pt = W[2];
      pose(hushEl, { x: J.x - 8, y: J.y - 196 * J.s, s: es(t, 0.3, 0.45, ease.back), o: bump(t, 0.3, 0.95) > 0.05 ? 1 : 0 });
      qs.forEach((q) => {
        const w = W.find((x) => x.k === q.k);
        const on = es(t, 1.08 + q.i * 0.1, 1.3 + q.i * 0.1, ease.back) * (1 - es(t, 1.85, 1.98));
        pose(q.el, { x: w.x + 4, y: w.y - 190 * w.s, s: on, o: on > 0.01 ? 1 : 0 });
      });
      pose(askEl, { x: Pt.x + 40, y: Pt.y - 206 * Pt.s, s: es(t, 2.1, 2.3, ease.back), o: bump(t, 2.05, 2.95) > 0.05 ? 1 : 0 });
      pose(shadowOver, { x: J.x + 90, y: J.y - 2, sx: 1 + dim * 0.3, o: bump(t, 4.1, 5.2) * 0.9 });

      /* the plates, each on its beat */
      const sc = es(t, 0.15, 0.4, ease.back) * (1 - es(t, 1.1, 1.4));
      swing(scrollEl, 700, lerp(-1000, 250, sc), T, 1.2, 0.8, 1);
      const tp = es(t, 0.45, 0.7, ease.back) * (1 - es(t, 1.8, 2.05));
      swing(tombPlate, 960, lerp(-1000, 250, tp), T, 1.2, 0.8, 2);
      const rise = es(t, 0.65, 0.95);
      pose(dawn, { x: 0, y: 20 - rise * 44, o: rise });
      pose(tstone, { x: -rise * 34, y: 36 - 120 * 0.18 + 2, r: -rise * 120 });
      const ep = es(t, 2.1, 2.35, ease.back) * (1 - es(t, 3.85, 4.05));
      swing(elijahPlate, 640, lerp(-1000, 250, ep), T, 1.2, 0.8, 3);
      const jp = es(t, 3.15, 3.4, ease.back) * (1 - es(t, 3.9, 4.1));
      swing(jarPlate, 960, lerp(-1000, 250, jp), T, 1.2, 0.8, 4);
      const mend = es(t, 3.35, 3.8);
      [[-26, -14, -30], [24, -18, 34], [0, 18, 0]].forEach(([dx, dy, r], i) => pose(shards[i], { x: dx * (1 - mend), y: dy * (1 - mend), r: r * (1 - mend) }));
      const wp = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.9, 5.1));
      swing(writPlate, 800, lerp(-1000, 240, wp), T, 1, 0.8, 5);
      const jo = es(t, 5.05, 5.3, ease.back);
      swing(johnPlate, 800, lerp(-1000, 250, jo), T, 1, 0.8, 6);
      pose(johnTag, { x: 800, y: 364 + (1 - jo) * -500, o: jo });
      const snuff = es(t, 5.55, 5.75);
      pose(jFlame, { x: 0, y: -20 - 34, sy: 1 - snuff * 0.95, o: 1 - snuff });
      fade(jGlow, 1 - snuff);

      S.cam.x = -es(t, 0, 1) * 30;
      S.cam.z = 1 + es(t, 0.2, 1) * 0.05;
      S.cam.y = es(t, 0.2, 1) * 20;
    };
  },
};
