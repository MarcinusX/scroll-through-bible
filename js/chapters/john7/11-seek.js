// J 7,33–36 — late afternoon in the Temple court; the officers who were sent stand at the edge, listening.
// "Yet a little while I am with you" — a small hourglass, its sand nearly run; "then I go to Him who sent me" —
// a stair of light rises beside Him to a golden door high above. "You will seek me and not find me; where I am you
// cannot come" — the leaders go about with lanterns, peering, and the golden door swings shut. They ask one
// another: "Where will he go?" — a map of the Great Sea comes down, the Dispersion lighting up in the Greek lands:
// "Will he go to teach the Greeks?" His words hang on a strip over their puzzled heads.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { lantern } from '../mark2/lib.js';
import {
  feastCourt, PH, officerOpts, spear, headAt, hand, voiceRings, say, strip, nameTag, question, hourglassRig, dispersionMap, WORLD,
  glory, hangAt, vpose, tr, PI,
} from './lib.js';

const JX = 800;
const LX = [420, 510, 600];
const OX = [1060, 1130, 1200];
const AFTER = ['#dccfb4', '#f1d9ae', '#f6dcb2'];
const STEPS = 9;
const stepAt = (i) => [850 + i * 22, 612 - i * 36];
const DOOR = stepAt(STEPS);

export default {
  id: 'j7-seek',
  beats: [
    { v: 33, text: 'Ale Jezus rzekł:' },
    { v: 33, cont: true, text: '«Jeszcze krótki czas jestem z wami, a potem pójdę do Tego, który Mnie posłał.' },
    { v: 34 },
    { v: 35, text: 'Rzekli Żydzi do siebie: «Dokąd to zamierza pójść, że Go nie będziemy mogli znaleźć?' },
    { v: 35, cont: true, text: 'Czyżby miał zamiar udać się do Żydów rozproszonych wśród Greków i uczyć Greków?' },
    { v: 36 },
  ],
  cam: { x: [-40, 60], y: [-60, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = feastCourt(S, { skyCols: AFTER, lit: 0.5 });
    const F = set.F + 20;

    /* the stair of light and the golden door (behind the people) */
    const SL = S.layer({ par: 0.47, sh: 3 });
    const glo = SL.add(`<g>${glory(c, 150, 16)}</g>`);
    const steps = Array.from({ length: STEPS }, (_, i) => {
      const [x, y] = stepAt(i);
      return SL.add(`<g transform="translate(${x} ${y})"><circle r="40" fill="url(#halo-glow)" opacity=".7"/>${sheet().p(c.cut(c.rect(-30, -6, 60, 12), 0.3, 5), C.sun).x(c.ribbon([[-28, -4], [28, -4]], 2.4), '#fff4d2').out()}</g>`);
    });
    const doorFrame = SL.add(`<g>${sheet().p(c.cut([[-36, 0], [-36, -86], ...c.arc(0, -86, 36, 30, PI, 2 * PI, 10), [36, -86], [36, 0]], 0.3, 5), '#fff3cf').out()}<circle cy="-60" r="70" fill="url(#halo-glow)"/></g>`);
    const leaf = (d) => SL.add(`<g>${sheet().p(c.cut(d < 0 ? [[0, 0], [0, -86], [30, -86], [30, 0]] : [[-30, 0], [-30, -86], [0, -86], [0, 0]], 0.3, 5), C.sun).x(c.ribbon(d < 0 ? [[6, -10], [6, -76]] : [[-6, -10], [-6, -76]], 1.6), shade(C.sun, -0.25), 'opacity=".7"').out()}</g>`);
    const leafL = leaf(-1), leafR = leaf(1);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const leaders = LX.map((x, i) => ({ x, i, seed: c.rr(0, 9), a: S.puppet(P.add(person(c, PH(c, i + 2)))), b: S.puppet(P.add(person(c, { ...PH(c, i + 2), holdF: `<g transform="translate(0 4)">${lantern(c, { col: C.apricot })}</g>` }))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 30, w: 4 });
    const offs = OX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, officerOpts(i + 1)))), sp: P.add(`<g>${spear(c, 240)}</g>`) }));
    set.front();

    /* words */
    const X = S.layer({ par: 0.5, sh: 6 });
    const hg = hourglassRig(X, c, 96);
    const shortT = X.add(`<g>${strip(c, tr('jeszcze krótki czas', 'a little while longer'), { size: 16 })}</g>`);
    const goT = X.add(`<g>${strip(c, tr('do Tego, który Mnie posłał', 'to Him who sent me'), { size: 16 })}</g>`);
    const notFound = hanging(X, nameTag(c, tr(['szukać będziecie', 'i nie znajdziecie'], ['you will seek me', 'and won’t find me']), { size: 17 }), { x: 520, y: 330, len: 600 });
    const whereB = X.add(`<g>${say(c, tr('Dokąd On pójdzie?', 'Where will he go?'), { size: 20, side: 1 })}</g>`);
    const mapEl = hanging(X, `<g transform="scale(.62)">${dispersionMap(c)}</g>`, { x: 800, y: 300, len: 700 });
    const dots = WORLD.spots.map(([x, y]) => X.add(`<g><circle r="16" fill="url(#warm-glow)"/><path d="${c.cut(c.circ(0, 0, 5, 10), 0.2, 2)}" fill="${C.terracotta}"/></g>`));
    const route = X.add(`<g><path d="${c.ribbon(c.qbez([WORLD.judea[0] * 0.62, WORLD.judea[1] * 0.62], [60, -60], [20 * 0.62, -60 * 0.62], 14), 3)}" fill="${C.terracotta}" opacity=".8"/></g>`);
    const greekT = X.add(`<g>${strip(c, tr('do rozproszonych wśród Greków?', 'to the Dispersion among the Greeks?'), { size: 16 })}</g>`);
    const wordsT = hanging(X, `${sheet().p(c.cut([[-230, 0], [230, -2], [232, 64], [-231, 66]], 0.6, 8), C.cream).out()}<text x="0" y="26" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="19" font-style="italic" fill="${C.ink}">${tr('„Będziecie Mnie szukać i nie znajdziecie,', '“You will seek me, and won’t find me;')}</text><text x="0" y="50" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="19" font-style="italic" fill="${C.ink}">${tr('a tam, gdzie Ja będę, wy pójść nie możecie”', 'and where I am, you can’t come”')}</text>`, { x: 800, y: 300, len: 700 });
    const qs = LX.map(() => X.add(`<g>${question(c)}</g>`));

    return (t, time) => {
      const T = time;
      set.update(t, T, { lit: 0.5 });

      /* Jesus */
      const talk = es(t, 0.05, 0.3) * (1 - es(t, 2.9, 3.1));
      const toStair = bump(t, 1.2, 1.95);
      jesus.set({ x: JX, y: F, s: 1.04, flip: t > 3.0 && t < 5.0, armF: 20 + talk * 26 + toStair * 70 + bump(t, 2.1, 2.9) * 30, armB: 10 + bump(t, 1.1, 1.6) * 40, head: -toStair * 10, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(JX, F, 1.04, false);
      voice(hx, hy + 4, talk * 0.8, T, { spread: 1.6 });

      /* v33b — a little while; the stair of light */
      const hk = es(t, 1.05, 1.35, ease.out), hu = es(t, 1.9, 2.05, ease.in);
      const hy2 = lerp(-300, 360, hk) - hu * 800;
      if (hk > 0 && hu < 1) pose(hg.el, { x: 640, y: hy2, r: Math.sin(T * 0.9) * 1.2, o: 1 }); else fade(hg.el, 0);
      hg.set(0.18 - seg(t, 1.3, 1.95) * 0.08, 1);
      vpose(shortT, { x: 640, y: hy2 + 74, o: hk > 0 && hu < 1 ? seg(t, 1.3, 1.4) : 0 });
      const up = seg(t, 1.25, 1.75);
      steps.forEach((el, i) => fade(el, es(up, i / STEPS, (i + 1) / STEPS) * (1 - es(t, 5.9, 6.1) * 0.6)));
      const dk = es(t, 1.7, 1.85);
      vpose(doorFrame, { x: DOOR[0], y: DOOR[1] + 6, o: dk });
      vpose(glo, { x: DOOR[0], y: DOOR[1] - 50, r: T * 2, s: 0.6 + dk * 0.3, o: dk * 0.8 });
      const shut = es(t, 2.45, 2.7);
      const open = 1 - shut;
      vpose(leafL, { x: DOOR[0] - 34, y: DOOR[1] + 6, sx: Math.max(0.12, 1 - open * 0.88), o: dk });
      vpose(leafR, { x: DOOR[0] + 34, y: DOOR[1] + 6, sx: Math.max(0.12, 1 - open * 0.88), o: dk });
      vpose(goT, { x: DOOR[0], y: DOOR[1] + 30, o: es(t, 1.8, 1.9) * (1 - es(t, 2.0, 2.1)) });

      /* v34 — seeking with lanterns; not finding */
      const seek = es(t, 2.05, 2.15) * (1 - es(t, 2.95, 3.05));
      leaders.forEach((m, i) => {
        const wander = Math.sin((t - 2) * PI * 2 + i * 1.7) * 30 * seek;
        const x = m.x + wander;
        const turn = es(t, 3.05, 3.2);
        const common = { x, y: F + (m.i % 2) * 6, s: 0.97, blink: blinkAt(T, m.seed) };
        const flip = seek > 0.5 ? Math.cos((t - 2) * PI * 2 + i * 1.7) < 0 : turn > 0.5 ? i === 2 : false;
        m.a.set({ ...common, flip, o: seek > 0.5 ? 0 : 1, armF: 20 + bump(t, 3.1, 3.9) * (i === 1 ? 60 : 20) + bump(t, 5.1, 5.9) * 20, armB: 10 + bump(t, 4.1, 4.9) * 40 * (i === 0 ? 1 : 0), head: bump(t, 3.1, 3.9) * 6 * (i === 2 ? -1 : 1) + bump(t, 5.1, 5.9) * 8 });
        m.b.set({ ...common, flip, o: seek > 0.5 ? 1 : 0, armF: 70, armB: 10, head: -8, lean: 5 });
        const [qx, qy] = headAt(x, F + (m.i % 2) * 6, 0.97, flip);
        vpose(qs[i], { x: qx + 8, y: qy - 52 + Math.sin(T * 2 + i) * 3, s: es(t, 5.1 + i * 0.07, 5.3 + i * 0.07, ease.back) * 0.8, o: seg(t, 5.1 + i * 0.07, 5.15 + i * 0.07) });
      });
      const nk = es(t, 2.2, 2.5, ease.out), nu = es(t, 2.95, 3.1, ease.in);
      hangAt(notFound, 520, lerp(-300, 330, nk) - nu * 700, T, nk > 0 && nu < 1 ? 1 : 0, 1.3, 0.9, 1);

      /* v35a — "where will he go?" */
      const [bx, by] = headAt(LX[1], F + 6, 0.97, false);
      vpose(whereB, { x: bx + 16, y: by - 20, s: es(t, 3.15, 3.35, ease.back), o: seg(t, 3.15, 3.2) * (1 - es(t, 3.95, 4.05)) });

      /* v35b — the Dispersion among the Greeks */
      const mk = es(t, 4.05, 4.4, ease.out), mu = es(t, 4.95, 5.1, ease.in);
      const my = lerp(-400, 300, mk) - mu * 800;
      const mOn = mk > 0 && mu < 1;
      hangAt(mapEl, 800, my, T, mOn ? 1 : 0, 0.6, 0.7, 2);
      WORLD.spots.forEach(([x, y], i) => vpose(dots[i], { x: 800 + x * 0.62, y: my + y * 0.62, s: es(t, 4.4 + i * 0.04, 4.55 + i * 0.04, ease.back), o: mOn ? seg(t, 4.4 + i * 0.04, 4.45 + i * 0.04) : 0 }));
      vpose(route, { x: 800, y: my, o: mOn ? es(t, 4.45, 4.6) : 0 });
      vpose(greekT, { x: 800, y: my + 160, o: mOn ? seg(t, 4.5, 4.6) : 0 });

      /* v36 — the saying hangs over their puzzled heads */
      const wk = es(t, 5.1, 5.4, ease.out);
      hangAt(wordsT, 800, lerp(-300, 330, wk), T, wk > 0 ? 1 : 0, 0.8, 0.8, 3);

      /* the officers listen at the edge */
      offs.forEach((m) => {
        m.p.set({ x: m.x, y: F + 8 + (m.i % 2) * 6, s: 0.96, flip: true, armF: 40, armB: 10, head: 4 + bump(t, 1.2, 2.8) * 4, blink: blinkAt(T, m.seed) });
        const [shx, shy] = hand(m.x, F + 8 + (m.i % 2) * 6, 0.96, true, 40);
        pose(m.sp, { x: shx, y: shy, s: 0.96, r: -4 });
      });

      S.cam.x = 20 + bump(t, 1.0, 3.0) * 30;
      S.cam.y = 30 - bump(t, 1.0, 3.0) * 40;
      S.cam.z = 1.12 - bump(t, 1.0, 3.0) * 0.04;
    };
  },
};
