// J 4,1–6a — by the Jordan in Judea: Jesus' disciples baptize a long line of people, John a shorter one further
// up the river; two Pharisees keep a tally and whisper, and the Lord hears of it. He Himself does not baptize —
// His disciples pour the water. He leaves Judea for Galilee (a signpost), and a map comes down from the flies:
// the road must go through Samaria; a little paper Jesus walks it to Sychar, where a roundel shows Jacob giving
// the field to Joseph — and there, on the map, Jacob's well begins to shine.
import { C, person, CAST, blinkAt, pose, lerp, sky, curtains, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, waterBand, reeds, rock, grass, sun, cloud, bush } from '../../assets/nature.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { DISC, JOHN_B, pharisee, samaritan, bowl, kf, speech, GLYPH, signpost, hang2, holyLandMap, well, vis, FONT } from './lib.js';

const MAP = { x: 800, y: 150, s: 1.05 };      // the hanging map: top centre, and its scale
const MW = 720, MH = 520;

export default {
  id: 'j4-jordan',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2 },
    { v: 3 },
    { v: 4 },
    { v: 5 },
    { v: 6, text: 'Było tam źródło Jakuba.' },
  ],
  cam: { x: [-120, 120], y: [-160, 120], z: [1, 2.2] },
  build(S) {
    const c = S.c;
    const SKY = ['#cfe0da', '#efe6cd', '#f6e8cf'];
    const sk = sky(S, SKY);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 44), { x: 1200, y: 170, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 190), { x: 470, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 130), { x: 960, y: 220, len: 600 });

    // the Judean hills and the far bank
    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 440, amps: [22, 9, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.dune, 0.35) }).markup);
    const farL = S.layer({ par: 0.25, sh: 3 });
    farL.add(band(c, { y: 560, amps: [6, 3, 2], lens: [800, 260, 90], color: mix(C.hillNear, C.sand2, 0.3) }).markup);
    farL.add(reeds(c, 300, 566, 12, 70) + reeds(c, 900, 568, 10, 60) + reeds(c, 1480, 566, 12, 70) + bush(c, 1100, 566, 70, C.sage, C.moss));
    // the river
    const riv = S.layer({ par: 0.34, sh: 2 });
    riv.add(waterBand(c, { y: 580, color: C.lake, foamN: 30 }).markup);

    // John further up the river, with a short line
    const jL = S.layer({ par: 0.36, sh: 3 });
    const JB = { x: 1270, y: 640, s: 0.55 };
    const baptist = S.puppet(jL.add(person(c, { ...JOHN_B, holdF: `<g transform="translate(0 4) scale(.8)">${bowl(c, { w: 26, color: C.clay, food: 'water' })}</g>` })));
    const jKneel = S.puppet(jL.add(person(c, { ...samaritan(c, 3), pose: 'kneel' })));
    const jLine = [0, 1, 2].map((i) => ({ i, p: S.puppet(jL.add(person(c, samaritan(c, i + 5)))) }));
    jL.add(waterBand(c, { y: 612, color: C.lake2, foamN: 10, x0: 1000, x1: 1700, glints: true }).markup);

    // the disciples baptize: a long queue in the water
    const bL = S.layer({ par: 0.45, sh: 4 });
    const KN = { x: 660, y: 700 };
    const andrew = S.puppet(bL.add(person(c, { ...DISC[1], holdF: `<g transform="translate(0 6) scale(1.1)">${bowl(c, { w: 28, color: C.clay, food: 'water' })}</g>` })));
    const johnD = S.puppet(bL.add(person(c, DISC[2])));
    const kneeler = S.puppet(bL.add(person(c, { ...samaritan(c, 2), pose: 'kneel' })));
    const queue = [0, 1, 2, 3, 4].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(bL.add(person(c, samaritan(c, i + 8)))), x: 560 - i * 58, from: 560 - i * 58 - 260 }));
    const drops = [0, 1, 2, 3, 4].map((i) => bL.add(`<path d="${c.cut([[0, -6], [3.4, 1], [0, 4], [-3.4, 1]], 0.1, 3)}" fill="#dff1f3"/>`));
    const front = S.layer({ par: 0.46, sh: 3 });
    front.add(waterBand(c, { y: 648, color: C.lake2, foamN: 18, amp: 3 }).markup);

    // the tallies hang over the two lines
    const tallyL = S.layer({ par: 0.3, sh: 4 });
    const tally = (name, n, x, y) => {
      const s = sheet();
      s.p(c.cut(c.rect(-86, 0, 172, 92), 0.6, 8), C.cream).p(c.cut(c.rect(-80, 6, 160, 80), 0.4, 8), C.parchment);
      const marks = [];
      for (let i = 0; i < n; i++) {
        const grp = Math.floor(i / 5), k = i % 5, gx = -60 + grp * 50;
        const d = k < 4 ? c.ribbon([[gx + k * 9, 48], [gx + k * 9 + 1, 76]], 3) : c.ribbon([[gx - 4, 70], [gx + 34, 52]], 3);
        marks.push(`<path class="mk" d="${d}" fill="${C.inkSoft}" opacity="0"/>`);
      }
      const el = hanging(tallyL, `${s.out()}<text x="0" y="34" text-anchor="middle" font-family="${FONT}" font-size="22" font-style="italic" fill="${C.terracotta}">${name}</text>${marks.join('')}`, { x, y, len: 600 });
      return { el, marks: Array.from(el.querySelectorAll('.mk')), x, y };
    };
    const tJ = tally(tr('uczniowie Jezusa', 'Jesus’ disciples'), 12, 660, 210);
    const tB = tally(tr('uczniowie Jana', 'John’s disciples'), 6, 1170, 240);

    // the near bank: Jesus, Peter, Philip, Nathanael; two Pharisees on the left
    const bank = S.layer({ par: 0.55, sh: 4 });
    const bfn = c.wave(730, [5, 2], [600, 150]);
    bank.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.sage2, 0.35)).out());
    bank.add(reeds(c, 250, 736, 12, 110, C.olive) + reeds(c, 1420, 738, 10, 100, C.olive) + rock(c, 1300, 745, 70, 26, C.rock2));
    bank.add(grass(c, { x0: -500, x1: 2100, y: 730, fn: bfn, n: 30, h: 16, color: C.olive }));
    const SIGN = { x: 1160, y: 742 };
    const post = bank.add(`<g>${signpost(c, tr('Galilea', 'Galilee'), { size: 20, dir: 1 })}</g>`);
    const ppl = S.layer({ par: 0.55, sh: 5 });
    const phar = [0, 1].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(ppl.add(person(c, pharisee(c, i + 1)))) }));
    const jesus = S.puppet(ppl.add(person(c, CAST.jesus)));
    const bankD = [0, 3, 4].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(ppl.add(person(c, DISC[k]))) }));
    const whisper = ppl.add(`<g>${speech(c, `<g transform="translate(-10 0)">${GLYPH.bang(c)}</g><g transform="translate(10 0)">${GLYPH.bang(c)}</g>`, { w: 62, h: 44 })}</g>`);
    const rings = [0, 1, 2].map((i) => ppl.add(`<path d="${c.ribbon(c.arc(0, 0, 16, 16, -0.6, 0.6, 8), 3.4)}" fill="${shade(C.ochre, 0.1)}"/>`));

    /* ---------- the map comes down from the flies ---------- */
    const mapL = S.layer({ par: 1, sh: 9 });
    const M = holyLandMap(c, { w: MW, h: MH });
    const mapEl = mapL.add(`<g>${hang2(`<g transform="translate(0 ${MH / 2})">${M.markup}</g>`, MW * 0.34, 400)}</g>`);
    const P = ([x, y]) => [MAP.x + x * MAP.s, MAP.y + (y + MH / 2) * MAP.s];
    const samHi = mapL.add(`<path d="${c.cut(M.regions.samaria.map(([x, y]) => P([x, y])), 1, 10)}" fill="${C.sun}" opacity="0"/>`);
    const rpts = M.spots.route.map(P);
    const route = mapL.add(`<path d="${c.line(c.cbez(rpts[0], rpts[2], rpts[3], rpts[4], 30))}" pathLength="1" stroke="${C.terracotta}" stroke-width="4" stroke-dasharray="1 1" stroke-dashoffset="1" stroke-linecap="round" fill="none"/>`);
    const routeN = mapL.add(`<path d="${c.line(c.cbez(rpts[4], rpts[5], rpts[6], rpts[7], 20))}" pathLength="1" stroke="${C.terracotta}" stroke-width="3" stroke-dasharray=".02 .03" stroke-dashoffset="0" stroke-linecap="round" fill="none" opacity="0"/>`);
    const leg = c.cbez(rpts[0], rpts[2], rpts[3], rpts[4], 30);
    const token = S.puppet(mapL.add(person(c, CAST.jesus)));
    const SY = P(M.spots.sychar);
    const syDot = mapL.add(`<g>${sheet().p(c.cut(c.rect(-8, -6, 16, 11), 0.3, 4) + c.cut([[-10, -6], [0, -14], [10, -6]], 0.3, 4), C.clay).out()}<text x="-14" y="4" text-anchor="end" font-family="${FONT}" font-size="15" font-style="italic" fill="${C.inkSoft}">Sychar</text></g>`);
    // Jacob gives the field to Joseph — a small sepia roundel pinned beside Sychar
    const RC = [SY[0] + 70, SY[1] - 36];
    const rid = S.id('jacob');
    S.defs(`<clipPath id="${rid}"><circle r="52"/></clipPath>`);
    const sep = (o) => ({ ...o, skin: mix(o.skin || C.skin, C.dune, 0.35) });
    const jacob = person(c, sep({ robe: mix(C.dune, C.wood3, 0.3), mantle: mix(C.clay, C.dune, 0.4), hair: '#e8e1d4', hairStyle: 'wrap', veil: C.linen2, beard: 'wild', beardColor: '#eee7da', skin: C.skin3, belt: C.leather, holdB: `<path d="${c.ribbon([[0, -10], [2, 70]], 4)}" fill="${C.wood2}"/>` }));
    const joseph = person(c, sep({ robe: mix(C.roseRobe, C.dune, 0.3), mantle: mix(C.skyVeil, C.dune, 0.3), hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin2, belt: mix(C.ochre, C.dune, 0.3) }));
    const inner = `<rect x="-60" y="-60" width="120" height="120" fill="${mix(C.parchment, C.dune, 0.4)}"/><path d="${c.ridge(c.wave(8, [3, 1], [60, 20]), -70, 70, 70, 6, 0.6)}" fill="${mix(C.wheatGreen, C.dune, 0.45)}"/>${(() => { let d = ''; for (let i = 0; i < 5; i++) d += c.ribbon([[-70, 16 + i * 8], [70, 16 + i * 8]], 1.2); return `<path d="${d}" fill="${mix(C.moss, C.dune, 0.4)}" opacity=".6"/>`; })()}<g data-k="jacobP" transform="translate(-24 30) scale(.3)">${jacob}</g><g data-k="josephP" transform="translate(20 30) scale(.3) scale(-1 1)">${joseph}</g>`;
    const rnd = mapL.add(`<g>${sheet().p(c.cut(c.circ(0, 0, 60, 36), 0.5, 5), C.wood3).out()}<g clip-path="url(#${rid})">${inner}</g><path d="M${-40} 20L${SY[0] - RC[0] + 4} ${SY[1] - RC[1]}" stroke="${C.inkSoft}" stroke-width="1.3" stroke-dasharray="3 3" opacity=".7"/></g>`);
    S.puppet(S.$('jacobP').firstElementChild).set({ armF: 70, armB: 10, head: 6 });
    S.puppet(S.$('josephP').firstElementChild).set({ armF: 50, head: -4 });
    const fieldTag = mapL.add(`<g><text x="0" y="0" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.inkSoft}">${tr('pole Józefa', 'Joseph’s field')}</text></g>`);
    // Jacob's well on the map
    const wellIcon = mapL.add(`<g><circle cy="-16" r="46" fill="url(#halo-glow)"/><g transform="scale(.32)">${well(c)}</g><text x="0" y="22" text-anchor="middle" font-family="${FONT}" font-size="13" font-style="italic" fill="${C.terracotta}">${tr('źródło Jakuba', 'Jacob’s well')}</text></g>`);

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      swing(sunEl, 1200, 170, T, 1.1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 150, T, 1.3, 0.6, 1);
      swing(cl2, 960 + Math.sin(T * 0.12 + 2) * 26, 220, T, 1.3, 0.7, 2);
      const mapK = es(t, 3.9, 4.3, ease.out);
      const onStage = mapK < 0.999;          // the stage is still seen (the map is not fully down)

      /* v1 — the lines, the tallies, the whisper */
      queue.forEach((q) => {
        const k = es(t, 0.7 + q.i * 0.1, 1.3 + q.i * 0.1, ease.out);
        const adv = es(t, 2.55, 2.85) * 58;          // the line moves up one place after each baptism
        const x = lerp(q.from, q.x, k) + adv * (q.i < 4 ? 1 : 1);
        const walking = (k > 0 && k < 1) || (t > 2.55 && t < 2.85);
        q.p.set({ x, y: 698, s: 0.78, walk: walking ? x * 0.06 : undefined, o: q.i === 0 ? 1 - es(t, 2.5, 2.6) * 0 : 1, head: -2, blink: blinkAt(T, q.seed) });
      });
      jLine.forEach((q) => q.p.set({ x: JB.x - 70 - q.i * 34 + es(t, 0.8, 1.2) * 6, y: 640, s: 0.5, blink: blinkAt(T, q.i + 3) }));
      const pour = bump(t, 2.15, 2.6);
      const pourB = bump(t, 1.3, 1.7) + bump(t, 2.3, 2.7);
      baptist.set({ x: JB.x, y: JB.y, s: JB.s, flip: true, armF: 40 + pourB * 60, armB: 10, blink: blinkAt(T, 2) });
      jKneel.set({ x: JB.x - 34, y: JB.y, s: JB.s, head: -10, blink: blinkAt(T, 5) });
      tJ.marks.forEach((m, i) => fade(m, es(t, 0.8 + i * 0.05, 0.86 + i * 0.05)));
      tB.marks.forEach((m, i) => fade(m, es(t, 0.8 + i * 0.1, 0.86 + i * 0.1)));
      swing(tJ.el, tJ.x, tJ.y + (1 - es(t, 0.55, 0.9, ease.out)) * -500, es(t, 0.55, 0.9, ease.out) > 0.001 ? T : 0, 1, 0.7, 1);
      fade(tJ.el, t > 0.55 ? 1 : 0);
      fade(tB.el, t > 0.6 ? 1 : 0);
      swing(tB.el, tB.x, tB.y + (1 - es(t, 0.6, 0.95, ease.out)) * -500, es(t, 0.6, 0.95, ease.out) > 0.001 ? T : 0, 1, 0.7, 2);

      // the Pharisees point, lean together, whisper; the whisper reaches Jesus
      const lean = es(t, 1.25, 1.45);
      phar.forEach((f) => f.p.set({
        x: 380 + f.i * 64, y: 752, s: 0.96, flip: f.i === 1 ? es(t, 1.2, 1.3) < 0.5 : false,
        armF: f.i === 0 ? bump(t, 0.95, 1.4) * 90 : 20, armB: 10, head: f.i === 1 ? -lean * 8 : lean * 6, lean: (f.i ? -1 : 1) * lean * 5, blink: blinkAt(T, f.seed),
      }));
      const wk = es(t, 1.3, 1.45, ease.back) * (1 - es(t, 1.7, 1.8));
      vis(whisper, { x: 470, y: 560, s: wk, o: wk > 0.01 ? 1 : 0 });
      rings.forEach((r, i) => {
        const k = seg(t, 1.5 + i * 0.07, 1.85 + i * 0.07);
        vis(r, { x: lerp(500, 850, k), y: lerp(590, 580, k), s: 0.8 + k * 0.4, o: k > 0 && k < 1 ? 1 - k * 0.4 : 0 });
      });

      /* v2 — He does not baptize: His disciples do */
      const hear = es(t, 1.8, 1.95);
      const leave = es(t, 3.05, 3.9, ease.in);
      const jx = lerp(860, 1320, leave);
      jesus.set({
        x: jx, y: 758, s: 1.0, flip: t < 3.02, walk: leave > 0 && leave < 1 ? jx * 0.05 : undefined,
        armF: 10 + es(t, 2.05, 2.3) * 55 * (1 - es(t, 2.85, 3.0)), armB: 8 + es(t, 2.05, 2.3) * 20 * (1 - es(t, 2.85, 3.0)),
        head: -hear * 6 * (1 - es(t, 2.05, 2.2)) + es(t, 2.05, 2.3) * 4 * (1 - es(t, 2.85, 3)), blink: blinkAt(T),
      });
      andrew.set({ x: 716, y: 700, s: 0.8, flip: true, armF: 30 + pour * 80 + bump(t, 1.2, 1.6) * 70, armB: 10, head: 6, blink: blinkAt(T, 4) });
      johnD.set({ x: 604, y: 700, s: 0.8, armF: 40 + pour * 20, armB: 20, head: 4, blink: blinkAt(T, 6) });
      kneeler.set({ x: KN.x, y: KN.y, s: 0.8, head: -12 + pour * -4, armF: 40, blink: pour > 0.2 ? 1 : blinkAt(T, 7) });
      drops.forEach((d, i) => {
        const k = ((T * 1.4 + i / 5) % 1);
        const on = Math.max(pour, bump(t, 1.2, 1.6));
        vis(d, { x: 686 + (i - 2) * 5, y: 560 + k * 50, s: 1, o: on > 0.05 ? on * (1 - k * 0.5) : 0 });
      });
      bankD.forEach((d) => {
        const go = es(t, 3.15 + d.i * 0.1, 3.95 + d.i * 0.1, ease.in);
        const x = lerp(960 + d.i * 62, 1440 + d.i * 60, go);
        d.p.set({ x, y: 760, s: 0.96, flip: t < 1.9 ? false : t < 3.1, walk: go > 0 && go < 1 ? x * 0.05 : undefined, head: -hear * 4, blink: blinkAt(T, d.seed) });
      });
      // v3 — the signpost to Galilee
      const sp = es(t, 3.0, 3.25, ease.back);
      vis(post, { x: SIGN.x, y: SIGN.y + (1 - sp) * 120, s: 1, o: sp > 0.01 ? 1 : 0 });

      /* v4 — the map: the route through Samaria */
      vis(mapEl, { x: MAP.x, y: MAP.y - (1 - mapK) * 1100, s: MAP.s, o: mapK > 0.005 ? 1 : 0 });
      const mapOn = es(t, 4.25, 4.35);
      const draw = es(t, 4.3, 5.4);
      attr(route, 'stroke-dashoffset', 1 - draw);
      fade(route, mapOn);
      fade(samHi, bump(t, 4.35, 5.2) * 0.35);
      const [tx, ty] = leg[Math.min(leg.length - 1, Math.floor(draw * (leg.length - 1)))];
      const toGal = es(t, 6.4, 6.9);
      token.set({ x: tx, y: ty + 6, s: 0.17, flip: false, o: mapOn, walk: draw > 0 && draw < 1 ? t * 40 : undefined, blink: 0 });
      fade(routeN, es(t, 6.4, 6.8) * 0.8);
      /* v5 — Sychar, Jacob's field and Joseph */
      const sy = es(t, 5.0, 5.2, ease.back);
      vis(syDot, { x: SY[0], y: SY[1], s: sy, o: sy > 0.01 ? 1 : 0 });
      const rk = es(t, 5.25, 5.5, ease.back);
      vis(rnd, { x: RC[0], y: RC[1], s: rk, o: rk > 0.01 ? 1 : 0 });
      vis(fieldTag, { x: RC[0], y: RC[1] + 76, s: 1, o: es(t, 5.45, 5.6) });
      /* v6a — Jacob's well */
      const wk2 = es(t, 6.05, 6.3, ease.back);
      vis(wellIcon, { x: SY[0] + 8, y: SY[1] + 44, s: wk2 * (1 + Math.sin(T * 2) * 0.03 * wk2), o: wk2 > 0.01 ? 1 : 0 });

      // camera: the river, the bank, then onto the map and into Sychar
      const zin = es(t, 4.9, 5.4);
      const cx = kf(t, [[0, 0], [1.2, -40], [2.0, -80], [2.9, -40], [3.4, 60], [4.2, 0]]);
      const cy = kf(t, [[0, 80], [1.2, 60], [2.0, 90], [3.2, 70], [4.2, 0]]);
      S.cam.x = lerp(cx, SY[0] + 30 - 800, zin);
      S.cam.y = lerp(cy, SY[1] + 10 - 470, zin);
      S.cam.z = kf(t, [[0, 1.08], [1.2, 1.14], [2.0, 1.24], [2.9, 1.12], [4.2, 1.0], [4.9, 1.0], [5.4, 2.0], [6.2, 2.1]]);
    };
  },
};
