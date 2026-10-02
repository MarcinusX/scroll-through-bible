// Mt 21,42–46 — back in the Temple court. "Have you never read in the Scriptures…": a painted panel comes down;
// builders turn a stone over and throw it aside — and that very stone rises and becomes the head of the corner, the
// keystone of the arch, in a burst of light: "the Lord's doing, marvellous in our eyes". "The Kingdom of God will be
// taken from you and given to a people producing its fruits": the golden crown with its grapes travels on its string
// from over the leaders to people holding up baskets of fruit. "Whoever falls on this stone will be broken": a clay jar
// drops on it and shatters; "on whom it falls, it will scatter him": the stone drops on a sheaf and it flies up as
// chaff. The chief priests and the Pharisees see that He means them; they reach to seize Him — but the crowd closes
// round Him, holding Him for a prophet, and they draw back.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg, fade } from '../../core/anim.js';
import { templeCourt, courtFront, priest, pharisee, withFace, faceBits, servant, archStones, keystone, glory, sparkle, thought, towerParts, grapeBunch, kingCrown, potHalf, chaffPuff, cornerStone, basketCut, hungPlate, strip, voiceRings, headAt, pose3, folk4, TWELVE_O, scrollOpen, tr, DAY, PI } from './lib.js';

const FLOOR = 676;
const JX = 780;
const PX0 = 560, PX1 = 1040, PY0 = 150, PY1 = 428;      // the painted panel
const AX = 800, AY = 392;                               // arch springing line

export default {
  id: 'mt21-stone',
  beats: [
    { v: 42, text: 'Jezus im rzekł: «Czy nigdy nie czytaliście w Piśmie:' },
    { v: 42, cont: true, text: 'Właśnie ten kamień, który odrzucili budujący, stał się głowicą węgła.' },
    { v: 42, cont: true, text: 'Pan to sprawił, i jest cudem w naszych oczach.' },
    { v: 43 },
    { v: 44 },
    { v: 45 },
    { v: 46 },
  ],
  cam: { x: [-40, 290], y: [-50, 40], z: [0.94, 1.12] },
  build(S) {
    const c = S.c;
    const P = S.portrait;   // phone: the leaders closer together and in from the right edge; the camera follows them further
    const { sunEl, cl1 } = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 140] });

    /* ---------- the painted panel with the half-built arch ---------- */
    const panL = S.layer({ par: 0.3, sh: 6 });
    const ps = sheet();
    ps.p(c.cut([[PX0 - 10, PY0 - 10], [PX1 + 10, PY0 - 12], [PX1 + 12, PY1 + 10], [PX0 - 12, PY1 + 12]], 0.6, 10), C.wood3);
    ps.p(c.cut([[PX0, PY0], [PX1, PY0], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.skyBlue2, C.parchment, 0.35));
    ps.p(c.ridge(c.wave(372, [10, 4], [300, 90]), PX0, PX1 - 12, PY1, 10, 0.8), mix(C.hillMid, C.parchment, 0.3));
    ps.p(c.cut([[PX0, 414], [PX0, 330], [PX0 + 40, 330], [PX0 + 40, 350], [PX0 + 80, 350], [PX0 + 80, 380], [PX0 + 110, 380], [PX0 + 110, 414]], 0.5, 6) + c.cut([[PX1, 414], [PX1, 316], [PX1 - 36, 316], [PX1 - 36, 344], [PX1 - 76, 344], [PX1 - 76, 384], [PX1 - 100, 384], [PX1 - 100, 414]], 0.5, 6), mix(C.stone2, C.sand2, 0.3));
    ps.p(c.cut([[PX0, 414], [PX1, 410], [PX1, PY1], [PX0, PY1]], 0.5, 10), mix(C.sand, C.dune, 0.3));
    const panelBg = panL.add(`<g><path d="M${PX0 - 40} -1400V${PY0 - 10}M${PX1 + 40} -1400V${PY0 - 10}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><path d="M${PX0 - 40} ${PY0 - 10}L${PX0} ${PY0}M${PX1 + 40} ${PY0 - 10}L${PX1} ${PY0}" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${ps.out()}</g>`);
    const rays = panL.add(`<g opacity="0">${glory(c, 230, 18)}</g>`);
    const arch = archStones(c, AX, AY, 100, 46, 8, mix(C.stone2, C.sand2, 0.45));
    const pierC = mix(C.stone, C.plaster, 0.4);
    const piers = panL.add(`<g>${sheet().p(c.cut(c.rect(AX - 146, AY, 46, 22), 0.4, 5) + c.cut(c.rect(AX + 100, AY, 46, 22), 0.4, 5), pierC).out()}${arch.stones.join('')}</g>`);
    const bl = [0, 1].map((i) => ({ i, p: S.puppet(panL.add(person(c, { ...servant(i + 3), belt: C.leather }))) }));
    const stone = panL.add(`<g>${keystone(c, 44, 46, mix(C.stone, C.sand, 0.4))}</g>`);
    const glowK = panL.add(`<g opacity="0"><circle r="60" fill="url(#warm-glow)"/></g>`);
    const sparks = [0, 1, 2, 3].map(() => panL.add(`<g>${sparkle(c, 9)}</g>`));

    /* ---------- the crowd round Jesus (drawn once), the people who bear fruit ---------- */
    const crowdL = S.layer({ par: 0.46, sh: 4 });
    const groups = [[430, false], [560, false], [P ? 980 : 1010, true]].map(([x, flip], i) => {
      const mem = Array.from({ length: 3 }, (_, k) => ({ x: (k - 1) * 40 + c.rr(-6, 6), y: (k % 2) * 12, s: 1, flip, head: -6, armF: c.rr(10, 40), armB: k === 1 ? 120 : 0, o: folk4(c) }));
      return { i, x, flip, sp: crowdL.sprite(`<g transform="scale(.84)">${pose3(c, mem)}</g>`, x, FLOOR - 10) };
    });
    const bearL = S.layer({ par: 0.49, sh: 5 });
    const bearers = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(bearL.add(person(c, { ...folk4(c, i !== 1, { robe: [C.ochreRobe, C.tealRobe, C.roseRobe][i] }), holdF: `<g transform="translate(0 4)">${basketCut(c, { full: true })}</g>` }))) }));

    /* ---------- the leaders: chief priests and Pharisees ---------- */
    const LD = S.layer({ par: 0.48, sh: 4 });
    const LEADERS = [{ m: priest(c, 0), x: 1110 }, { m: person(c, pharisee(c, 0)), x: 1180 }, { m: priest(c, 1), x: 1250 }, { m: person(c, pharisee(c, 1)), x: 1320 }]
      .map((d, i) => ({ ...d, x: P ? 1040 + i * 50 : d.x, i, seed: c.rr(0, 9), y: FLOOR - (i % 2 ? 14 : 0), p: S.puppet(LD.add(withFace(d.m, faceBits(c)))) }));
    LEADERS.forEach((d) => { d.angry = d.p.el.querySelector('[data-part="angry"]'); d.sad = d.p.el.querySelector('[data-part="sad"]'); });

    /* ---------- Jesus and the disciples ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const DIS = [0, 2, 1].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, TWELVE_O[k]))) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus, holdF: `<g transform="translate(0 6) rotate(90) scale(.42)">${scrollOpen(c, 90, 60)}</g>` })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const voice = voiceRings(fx, c, { n: 3, r: 26, w: 4 });

    /* the kingdom: a golden crown with grapes on a round plate, taken away and given to others */
    const kingdom = fx.add(hungPlate(c, `<g transform="translate(0 -12) scale(.9)">${kingCrown(c, 30)}</g><g transform="translate(-16 14)">${grapeBunch(c, 4.6)}</g><g transform="translate(16 14)">${grapeBunch(c, 4.6, shade(C.plumRobe, 0.1))}</g>`, { r: 56, rim: C.sun }));
    /* the stone, the jar, the sheaf */
    const bigStone = fx.add(`<g>${cornerStone(c, 110, 92)}</g>`);
    const potL = fx.add(`<g>${potHalf(c, -1)}</g>`), potR = fx.add(`<g>${potHalf(c, 1)}</g>`);
    const shards = [0, 1, 2, 3, 4].map((i) => ({ i, el: fx.add(`<path d="${c.cut([[0, -6], [7, -2], [4, 6], [-5, 4]], 0.3, 3)}" fill="${C.pot}"/>`), a: PI + (i + 0.5) / 5 * PI, v: c.rr(50, 90) }));
    const sheaf = fx.add(`<g>${sheet().p(c.cut([[-40, 0], [-30, -30], [-10, -46], [10, -48], [30, -32], [40, 0]], 0.6, 5), C.wheat2).x(c.ribbon([[-20, -4], [-14, -36]], 1.6) + c.ribbon([[0, -4], [0, -44]], 1.6) + c.ribbon([[20, -4], [14, -36]], 1.6), shade(C.wheat2, -0.2), 'opacity=".7"').p(c.ribbon([[-34, -16], [34, -16]], 5), C.rope).out()}</g>`);
    const chaff = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: fx.add(`<g>${chaffPuff(c, 26)}</g>`), a: -PI * (0.1 + i * 0.16), v: c.rr(90, 170) }));
    const thinks = fx.add(`<g>${thought(c, `<g transform="translate(-12 28) scale(.26)">${towerParts(c, 90, 236).join('')}</g><g transform="translate(16 -8) scale(1.6)">${grapeBunch(c, 3.4)}</g>`, { w: 104, h: 84 })}</g>`);
    const prophet = fx.add(hungPlate(c, `<text x="0" y="8" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="22" font-style="italic" fill="${C.ink}">${tr('prorok', 'a prophet')}</text>`, { r: 50 }));

    courtFront(S);

    return (t, time) => {
      const T = time;
      swing(sunEl, 1230, 140, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v42a — "Have you never read…": the panel comes down */
      const down = es(t, 0.15, 0.6, ease.out) * (1 - es(t, 2.9, 3.2, ease.in));
      const dy = lerp(-900, 0, down);
      pose(panelBg, { y: dy }); pose(piers, { y: dy });
      const speak = es(t, 0.05, 0.3) * (1 - es(t, 2.8, 3.0)) + bump(t, 3.05, 4.9) * 0.6;
      voice(JX + 26, FLOOR - 176, es(t, 0.05, 0.3) * (1 - es(t, 0.9, 1.0)), T, { dir: 1 });

      /* v42b — the builders reject the stone; it rises into the keystone */
      const look = bump(t, 1.02, 1.3), toss = es(t, 1.28, 1.44, ease.in);
      bl.forEach((b) => {
        const x = b.i ? 940 : 660;
        b.p.set({ x, y: 416 + dy, s: 0.5, flip: b.i === 1, armF: b.i === 0 ? 70 + look * 30 - toss * 10 : 30 + look * 40, armB: b.i === 0 ? toss * 90 : 20, head: b.i === 1 ? look * 18 - toss * 10 + bump(t, 1.9, 2.6) * -16 : -look * 6 - bump(t, 1.9, 2.6) * 16, lean: b.i === 0 ? -toss * 10 : 0, blink: blinkAt(T, b.i) });
      });
      let sx, sy, sr = 0;
      const rise = es(t, 1.5, 1.8, ease.io);
      if (t < 1.28) { sx = 690 + look * 6; sy = 350 - look * 8; sr = look * 30; }
      else if (rise <= 0) { sx = lerp(690, 860, toss); sy = lerp(342, 398, toss) - Math.sin(toss * PI) * 36; sr = 30 + toss * 170; }
      else { sx = lerp(860, AX, rise); sy = lerp(398, arch.key[1], rise) - Math.sin(rise * PI) * 60; sr = lerp(200, 360, rise); }
      pose(stone, { x: sx, y: sy + dy, r: sr });
      pose(glowK, { x: sx, y: sy + dy, s: 0.6 + rise * 0.8, o: rise * (1 - es(t, 2.9, 3.1)) });
      sparks.forEach((el, i) => {
        const a = (i / 4) * PI * 2 + 0.6, k = seg(t, 1.8, 2.3);
        pose(el, { x: AX + Math.cos(a) * (20 + k * 50), y: arch.key[1] + dy + Math.sin(a) * (20 + k * 40), s: 1 - k * 0.5, o: bump(t, 1.8, 2.4) });
      });
      /* v42c — "the Lord's doing, marvellous in our eyes": light pours from the keystone */
      pose(rays, { x: AX, y: arch.key[1] + dy, s: 0.6 + es(t, 1.85, 2.5) * 0.5, r: T * 2, o: Math.max(es(t, 1.8, 2.0) * 0.5, es(t, 2.0, 2.3)) * (1 - es(t, 2.9, 3.1)) });

      /* v43 — the kingdom taken away from you and given to a people that bears its fruits */
      const kd = es(t, 3.05, 3.3, ease.out);
      const give = es(t, 3.35, 3.75, ease.io);
      const kx = lerp(1200, 600, give), ky = lerp(-700, 300, kd) - Math.sin(give * PI) * 50;
      pose(kingdom, { x: kx, y: ky - es(t, 3.95, 4.2, ease.in) * 900, r: T ? Math.sin(T * 0.9) * 2 : 0 });
      bearers.forEach((b) => {
        const inK = es(t, 3.3 + b.i * 0.05, 3.6 + b.i * 0.05, ease.out);
        const x = lerp(-120 - b.i * 80, 500 + b.i * 90, inK);
        const lift = es(t, 3.65, 3.85);
        b.p.set({ x, y: FLOOR + 8 - (b.i % 2) * 8, s: 0.96, walk: inK > 0 && inK < 1 ? x * 0.05 + b.i : undefined, armB: lift * 140, armF: 40 + lift * 30, head: -lift * 12, blink: blinkAt(T, b.seed), o: seg(t, 3.28, 3.32) * (1 - es(t, 4.9, 5.1)) });
      });

      /* v44 — the jar falls on the stone and breaks; the stone falls on the sheaf and scatters it */
      const sIn = es(t, 4.02, 4.2, ease.out);
      const sDrop = es(t, 4.48, 4.6, ease.in);
      const SXs = 720, SYs = 340;
      pose(bigStone, { x: lerp(SXs, 930, sDrop), y: lerp(-600, SYs, sIn) + sDrop * 60, r: sDrop * 20, o: 1 - es(t, 4.95, 5.05) });
      const jar = es(t, 4.12, 4.28, ease.in);
      const brk = es(t, 4.28, 4.5);
      [potL, potR].forEach((p, i) => pose(p, { x: SXs + (i ? 1 : -1) * brk * 60, y: lerp(-300, SYs - 46, jar) + brk * 60, r: (i ? 1 : -1) * brk * 70, o: jar > 0 ? 1 - es(t, 4.7, 4.9) : 0 }));
      shards.forEach((s) => { const k = seg(t, 4.28, 4.55); pose(s.el, { x: SXs + Math.cos(s.a) * s.v * k, y: SYs - 46 + Math.sin(s.a) * s.v * Math.sin(k * PI * 0.8) + k * 40, r: k * 400, o: k > 0 && k < 1 ? 1 : 0 }); });
      pose(sheaf, { x: 930, y: SYs + 106, o: es(t, 4.05, 4.15) * (1 - seg(t, 4.58, 4.6)) });
      chaff.forEach((ch) => {
        const k = es(t, 4.6, 5.0, ease.out);
        pose(ch.el, { x: 930 + Math.cos(ch.a) * ch.v * k * 1.5, y: SYs + 80 + Math.sin(ch.a) * ch.v * k, s: 0.6 + k * 0.8, r: k * 90 * (ch.i % 2 ? 1 : -1), o: k > 0 ? 1 - es(t, 4.85, 5.05) : 0 });
      });

      /* v45 — the chief priests and the Pharisees see that He speaks of them */
      const see = es(t, 5.05, 5.3);
      const reach = es(t, 6.05, 6.25) * (1 - es(t, 6.4, 6.6));
      const recoil = es(t, 6.4, 6.6);
      LEADERS.forEach((d) => {
        const x = d.x - reach * 60 + recoil * 30;
        d.p.set({ x, y: d.y, s: 0.9, flip: true, walk: reach > 0 && reach < 1 ? x * 0.05 + d.i : undefined, armF: 30 + reach * 60 - recoil * 20 + see * (d.i === 1 ? 30 : 0), armB: 20 + see * (d.i % 2 ? 0 : 40), head: bump(t, 5.1, 5.9) * [12, -12, 10, -10][d.i] + recoil * 6, lean: -reach * 8 + recoil * 4, blink: blinkAt(T, d.seed) });
        fade(d.angry, see * (1 - recoil * 0.5));
        fade(d.sad, recoil * 0.7);
      });
      const th = es(t, 5.1, 5.3, ease.back) * (1 - es(t, 5.85, 6.0));
      pose(thinks, { x: P ? 1100 : 1170, y: FLOOR - 230, s: th, o: th > 0.02 ? 1 : 0 });

      /* v46 — they would seize Him, but the crowds close round Him, holding Him for a prophet */
      const guard = es(t, 6.1, 6.4);
      groups.forEach((g) => g.sp.set({ x: g.x + (g.flip ? -1 : 1) * guard * (g.flip ? 80 : 60), y: FLOOR - 10, o: 1 }));
      const pp = es(t, 6.25, 6.5, ease.out);
      pose(prophet, { x: 800, y: lerp(-700, 205, pp), r: T ? Math.sin(T * 1.1) * 2 : 0 });

      jesus.set({ x: JX, y: FLOOR, s: 1.02, blink: blinkAt(T), armF: 40 + speak * 40 + bump(t, 1.45, 2.0) * 50, armB: 20 + speak * 30 + bump(t, 2.0, 2.8) * 60 + bump(t, 3.3, 3.8) * 50, head: -bump(t, 1.5, 2.9) * 12 });
      DIS.forEach((d) => d.p.set({ x: JX - 110 - d.i * 56, y: FLOOR - 12 + (d.i % 2) * 10, s: 0.88, head: -bump(t, 1.9, 2.8) * 14, armF: bump(t, 1.9, 2.8) * (d.i % 2 ? 60 : 20), blink: blinkAt(T, d.seed) }));

      S.cam.z = 1 + es(t, 0.8, 1.6) * 0.04 * (1 - es(t, 2.9, 3.4)) - es(t, 6.0, 6.4) * 0.05;
      S.cam.y = -es(t, 6.0, 6.4) * 40;
      S.cam.x = es(t, 5.0, 5.4) * (P ? 280 : 20) * (1 - es(t, 6.0, 6.4) * (P ? 0.25 : 1));
    };
  },
};
