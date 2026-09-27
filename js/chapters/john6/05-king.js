// J 6,14–15 — the people see the twelve full baskets: the fourth sign comes down on its strings. "Truly this is
// the Prophet who is to come into the world!" — the old scroll of Moses' promise unrolls above them. They rise and
// surge forward with a big paper crown on poles to seize Him and make Him king; but He knows it — and He walks
// away, alone, up the mountain in the evening light. The crown is left hanging in the air.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { olive } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { hillSet, meadowRows, GOLDEN, DUSK, LOOK, TW, folk, group, basket, signMedal, loafIcon, paperCrown, verseScroll, say, labelTag, headAt, hand, kf, moving, tr, PI } from './lib.js';

const JX = 800;
const PEAK = [1060, 300];

export default {
  id: 'j6-king',
  beats: [
    { v: 14, text: 'A kiedy ci ludzie spostrzegli, jaki cud uczynił Jezus, mówili:' },
    { v: 14, cont: true, text: '«Ten prawdziwie jest prorokiem, który miał przyjść na świat».' },
    { v: 15, text: 'Gdy więc Jezus poznał, że mieli przyjść i porwać Go, aby Go obwołać królem,' },
    { v: 15, cont: true, text: 'sam usunął się znów na górę.' },
  ],
  cam: { x: [-20, 60], y: [-40, 60], z: [0.98, 1.14] },
  build(S) {
    const c = S.c;
    const PATH = [[1300, 560], [1240, 500], [1180, 470], [1150, 430], [1110, 390], [1090, 350], [PEAK[0], PEAK[1] + 8]];
    const H = hillSet(S, {
      skyCols: GOLDEN, sunAt: [340, 250],
      behind: () => {
        /* the mountain behind, with a path, where He goes alone */
        const mtn = S.layer({ par: 0.2, sh: 3 });
        const mpts = [[640, 620], [760, 520], [880, 420], [980, 330], [PEAK[0] - 30, PEAK[1] + 6], [PEAK[0] + 30, PEAK[1] + 2], [1150, 360], [1280, 440], [1420, 520], [1600, 600], [1600, 900], [640, 900]];
        mtn.add(sheet().p(c.cut(mpts, 1.4, 10), mix(C.hillMid, C.duskViolet, 0.18)).p(c.cut([[PEAK[0] - 20, PEAK[1] + 10], [PEAK[0] + 26, PEAK[1] + 6], [PEAK[0] + 50, PEAK[1] + 40], [PEAK[0] - 44, PEAK[1] + 44]], 0.6, 6), C.rock2).out());
        mtn.add(`<path d="${c.ribbon(PATH, (u) => 7 - u * 5)}" fill="${mix(C.sand, C.cream, 0.3)}" opacity=".9"/>` + olive(c, 1400, 540, 0.4) + olive(c, 780, 560, 0.4));
        return {
          farJ: S.puppet(mtn.add(person(c, { ...CAST.jesus }))),
          farKneel: S.puppet(mtn.add(person(c, { ...CAST.jesus, pose: 'kneel' }))),
          peakGlow: mtn.add(`<g><circle r="90" fill="url(#halo-glow)"/></g>`),
        };
      },
    });
    const { sfn, gfn } = H;
    const { farJ, farKneel, peakGlow } = H.extra;
    const warm = S.layer({ par: 0, sh: 1, flat: true });
    warm.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#e79a5f"/>`);

    const M = meadowRows(S, sfn);
    // the whole crowd on its feet (replaces the seated rows)
    const standL = S.layer({ par: 0.31, sh: 3 });
    const standMem = [];
    for (let i = 0; i < 60; i++) { const x = c.rr(200, 1500), dy = c.rr(10, 80); standMem.push({ x, y: sfn(x) + dy, s: 0.3 + dy * 0.002, flip: x > JX, o: folk(c) }); }
    const standing = standL.add(`<g>${group(c, standMem)}</g>`);

    /* the near crowd, the crown bearers, Jesus */
    const L = S.layer({ par: 0.5, sh: 5 });
    const BASK = Array.from({ length: 12 }, (_, i) => { const side = i < 6 ? -1 : 1, k = i % 6, x = side < 0 ? 440 + k * 46 : 930 + k * 46; return L.add(`<g transform="translate(${x} ${gfn(x) + 40 + (k % 2) * 6})">${basket(c, { w: 42, h: 26, full: true })}</g>`); });
    const NEAR = [[470, true], [560, false], [1050, true], [1130, false], [1210, true]].map(([x, man], i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, man)))) }));
    const BEAR = [0, 1, 2].map((i) => ({ i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, folk(c, true)))) }));
    const poles = L.add(`<g>${sheet().p(c.ribbon([[-70, 0], [-70, -160]], 5) + c.ribbon([[70, 0], [70, -160]], 5), C.wood2).p(c.ribbon([[-80, -150], [80, -150]], 5), C.wood2).out()}</g>`);
    const crownEl = L.add(`<g><circle r="120" cy="-40" fill="url(#halo-glow)" opacity=".35"/>${paperCrown(c, 130)}</g>`);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));

    /* the sign, the scroll, the shouts */
    const fx = S.layer({ par: 0.56, sh: 5 });
    const medal = hanging(fx, signMedal(c, 4, loafIcon(c), 54), { x: 0, y: 0, len: 900 });
    const V = verseScroll(c, tr(['Proroka jak ja', 'wzbudzi ci Pan'], ['The Lord will raise up', 'a prophet like me']), { w: 330, size: 22, title: tr('PWT 18,15', 'DEUT 18:15') });
    const scrollG = fx.add(`<g>${V.sheet}</g>`);
    const rodT = hanging(fx, V.rodTop, { x: 0, y: 0, len: 900 });
    const rodB = fx.add(`<g>${V.rodBottom}</g>`);
    const shouts = [[0, tr('Prorok!', 'The prophet!')], [2, tr('Prawdziwie!', 'Truly!')], [4, tr('To On!', 'It is He!')]].map(([i, w]) => ({ i, el: fx.add(`<g>${say(c, w, { size: 18, side: NEAR[i].x > JX ? -1 : 1 })}</g>`) }));
    const bangs = [0, 1, 2, 3].map((i) => fx.add(`<g>${labelTag('!', 18)}</g>`));
    const kingWord = fx.add(`<g>${say(c, tr('Królem!', 'King!'), { size: 22, side: 1 })}</g>`);

    const JK = [[3.05, JX], [3.6, 1260]];
    const FK = [[3.55, 0], [3.95, 1]];
    return (t, time) => {
      const T = time;
      const eve = es(t, 0, 4);
      H.sk.blend(GOLDEN, DUSK, eve * 0.75);
      warm.fade(0.08 + eve * 0.1);
      H.update(T, { sunX: 340, sunY: 250 + eve * 200 });

      /* v14a — they see the sign */
      const mk = es(t, 0.1, 0.45, ease.out) * (1 - es(t, 1.9, 2.1));
      pose(medal, { x: JX, y: lerp(-500, 200, mk), r: Math.sin(T * 0.9) * 2, o: mk > 0.01 ? 1 : 0 });
      const see = es(t, 0.2, 0.45);
      bangs.forEach((b, i) => {
        const m = NEAR[[0, 1, 3, 4][i]];
        const k = es(t, 0.3 + i * 0.06, 0.45 + i * 0.06, ease.back) * (1 - es(t, 0.95, 1.1));
        const [hx, hy] = headAt(m.x, gfn(m.x) + 26, 0.92, m.x > JX);
        pose(b, { x: hx + (m.x > JX ? -16 : 16), y: hy - 40, s: k, r: Math.sin(T * 2 + i) * 8, o: k > 0.01 ? 1 : 0 });
      });

      /* v14b — "truly the Prophet who is to come into the world" */
      const sc = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 1.95, 2.15));
      const un = es(t, 1.3, 1.6);
      pose(rodT, { x: 1090, y: lerp(-500, 130, sc), o: sc > 0.01 ? 1 : 0 });
      pose(scrollG, { x: 1090, y: lerp(-500, 130, sc), sy: Math.max(0.02, un), oy: 0, o: sc > 0.01 ? 1 : 0 });
      pose(rodB, { x: 1090, y: lerp(-500, 130, sc) + V.h * un, o: sc > 0.01 ? 1 : 0 });
      shouts.forEach((s, j) => {
        const m = NEAR[s.i];
        const k = es(t, 1.15 + j * 0.1, 1.35 + j * 0.1, ease.back) * (1 - es(t, 1.95, 2.05));
        const [hx, hy] = headAt(m.x, gfn(m.x) + 26, 0.92, m.x > JX);
        pose(s.el, { x: hx, y: hy - 18, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v15a — they rise and come to seize Him and make Him king */
      const rise = es(t, 2.05, 2.3);
      const surge = es(t, 2.2, 2.8);
      M.L.fade(1 - rise);
      standL.fade(rise);
      pose(standing, { y: -surge * 6, o: 1 });
      NEAR.forEach((m) => {
        const x = m.x + (JX - m.x) * surge * 0.22 * (1 - es(t, 3.3, 3.7) * 0.5);
        const grab = surge * (1 - es(t, 3.2, 3.5));
        const cheer = bump(t, 1.1, 1.95);
        const lost = es(t, 3.5, 3.8);
        m.p.set({ x, y: gfn(x) + 26, s: 0.92, flip: m.x > JX, walk: surge > 0.02 && surge < 0.98 ? x * 0.06 : undefined, armF: 30 + see * 30 + cheer * 60 + grab * 70, armB: 10 + cheer * 100 + grab * 40 + lost * 20, head: -see * 6 - cheer * 6 + lost * (m.i % 2 ? 8 : -10), lean: grab * 6, blink: blinkAt(T, m.seed) });
      });
      const cx = lerp(520, 700, surge), cy = gfn(cx) + 24;
      BEAR.forEach((b) => {
        const x = cx - 60 + b.i * 60;
        b.p.set({ x, y: gfn(x) + 26 + (b.i % 2) * 4, s: 0.9, flip: false, walk: surge > 0.02 && surge < 0.98 ? x * 0.06 + b.i : undefined, armF: 150, armB: 150, head: -6, o: seg(t, 2.1, 2.2), blink: blinkAt(T, b.seed) });
      });
      const liftC = es(t, 3.55, 4.0, ease.out);
      pose(poles, { x: cx, y: cy - 150, o: seg(t, 2.1, 2.2) * (1 - es(t, 3.55, 3.7)) });
      pose(crownEl, { x: cx + liftC * (JX - cx) * 0.4, y: cy - 300 - liftC * 60 + Math.sin(T * 1.3) * 4 * liftC, r: Math.sin(T * 0.9) * 3 * liftC, s: 1, o: seg(t, 2.1, 2.2) });
      const kw = es(t, 2.35, 2.55, ease.back) * (1 - es(t, 3.0, 3.1));
      pose(kingWord, { x: cx + 70, y: cy - 330, s: kw, o: kw > 0.01 ? 1 : 0 });

      /* Jesus: sees it, and withdraws — alone, up the mountain */
      const jx = kf(t, JK);
      const know = es(t, 2.4, 2.7);
      jesus.set({ x: jx, y: gfn(jx) + 12, s: 1.06, flip: false, walk: moving(t, JK) ? jx * 0.06 : undefined, armF: 20 + bump(t, 0.2, 1.8) * 30 - know * 10, armB: 10, head: know * 6 * (1 - es(t, 3.05, 3.2)), o: 1 - es(t, 3.5, 3.62), blink: blinkAt(T, 1) });
      const fk = kf(t, FK, (u) => u);
      const [fx_, fy_] = (() => { const n = PATH.length - 1, u = fk * n, i = Math.min(n - 1, Math.floor(u)), k = u - i; return [lerp(PATH[i][0], PATH[i + 1][0], k), lerp(PATH[i][1], PATH[i + 1][1], k)]; })();
      const kneel = es(t, 3.95, 4.05);
      farJ.set({ x: fx_, y: fy_, s: lerp(0.3, 0.2, fk), flip: true, walk: fk > 0 && fk < 1 ? fx_ * 0.3 : undefined, o: seg(t, 3.5, 3.6) * (1 - kneel), blink: 0 });
      farKneel.set({ x: PEAK[0], y: PEAK[1] + 8, s: 0.2, flip: false, o: kneel, armF: 60, armB: 120, head: -10, blink: 0 });
      pose(peakGlow, { x: PEAK[0], y: PEAK[1] - 16, s: 0.5 + kneel * 0.5, o: kneel * 0.9 });

      S.cam.x = kf(t, [[0, 0], [3.0, 0], [3.9, 50]]);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.04], [2.0, 1.02], [2.6, 1.08], [3.2, 1.06], [3.9, 1.0]]);
      S.cam.y = kf(t, [[0, 30], [1.1, 0], [2.0, 10], [2.6, 30], [3.9, -30]]);
    };
  },
};
