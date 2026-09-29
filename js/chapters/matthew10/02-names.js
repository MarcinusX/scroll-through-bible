// Mt 10,2–4 — the names of the Twelve, two by two. A banner comes down: "the names of the twelve apostles". Then
// each pair steps out of the ring into the light, their name tags drop on strings, and each lifts a small sign of
// who he is: Simon called Peter a rock, Andrew a fish; James Zebedee's boat, John a net; Philip loaves, Bartholomew
// a fig leaf; Thomas a builder's square, Matthew the tax collector coins that turn into a written scroll; James son of
// Alphaeus a lamp, Thaddaeus a question; Simon the Zealot a flame — and Judas Iscariot a dark purse, his tag cut
// from dark paper; he turns his face away and a long shadow falls behind him.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { hill, SPRING, MT12, RING, folk, group, nameTag, hungStrip, SIGNS, coinsIcon, coin, hand, headAt, sparkle, tr, PI } from './lib.js';

const JX = 800;
const TAGS = {
  peter: () => tr(['Szymon,', 'zwany Piotrem'], ['Simon,', 'called Peter']),
  andrew: () => tr('Andrzej', 'Andrew'),
  james: () => tr(['Jakub,', 'syn Zebedeusza'], ['James,', 'son of Zebedee']),
  john: () => tr('Jan', 'John'),
  philip: () => tr('Filip', 'Philip'),
  bartholomew: () => tr('Bartłomiej', 'Bartholomew'),
  thomas: () => tr('Tomasz', 'Thomas'),
  matthew: () => tr(['Mateusz,', 'celnik'], ['Matthew,', 'tax collector']),
  jamesA: () => tr(['Jakub,', 'syn Alfeusza'], ['James,', 'son of Alphaeus']),
  thaddaeus: () => tr('Tadeusz', 'Thaddaeus'),
  simonZ: () => tr(['Szymon', 'Gorliwy'], ['Simon', 'the Canaanite']),
  judas: () => tr(['Judasz', 'Iskariota'], ['Judas', 'Iscariot']),
};

export default {
  id: 'mt10-names',
  beats: [
    { v: 2, text: 'A oto imiona dwunastu apostołów:' },
    { v: 2, cont: true, text: 'pierwszy Szymon, zwany Piotrem, i brat jego Andrzej,' },
    { v: 2, cont: true, text: 'potem Jakub, syn Zebedeusza, i brat jego Jan,' },
    { v: 3, text: 'Filip i Bartłomiej,' },
    { v: 3, cont: true, text: 'Tomasz i celnik Mateusz,' },
    { v: 3, cont: true, text: 'Jakub, syn Alfeusza, i Tadeusz,' },
    { v: 4 },
  ],
  cam: { x: [-60, 60], y: [0, 40], z: [1, 1.1] },
  build(S) {
    const H = hill(S, { skyCols: SPRING });
    const c = S.c;
    const { gfn, sfn } = H;

    /* ---------- the crowd, sitting further back on the slope ---------- */
    const pc = makeCutter('mt10-names-crowd');
    const mem = [];
    for (let i = 0; i < 22; i++) {
      const x = 200 + ((i * 331) % 1200) + pc.rr(-20, 20);
      const y = sfn(x) + 6 + (i % 3) * 10;
      mem.push({ x, y, s: 0.36 + (i % 3) * 0.02, flip: x > 800, o: folk(pc, null, { pose: 'sit' }) });
    }
    H.slopeL.add(group(pc, mem));

    /* ---------- the banner ---------- */
    const flies = S.layer({ par: 0.2, sh: 5 });
    const banner = flies.add(`<g>${hungStrip(c, tr('Imiona Dwunastu Apostołów', 'The Names of the Twelve Apostles'), { size: 30 })}</g>`);

    /* ---------- Jesus and the Twelve ---------- */
    const spotL = S.layer({ par: 0.5, sh: 1, flat: true });
    const P = S.layer({ par: 0.5, sh: 5 });
    const TW = MT12.map((m) => {
      const R = RING[m.i];
      return { ...m, R, x: R.x, y: gfn(R.x) + R.dy, seed: c.rr(0, 9), b: m.pair + 1, second: m.i % 2 === 1 };
    });
    // Judas's long shadow (behind everyone)
    const JU = TW[11];
    const shadow = P.add(`<g opacity="0"><path d="${c.cut([[-30, 0], [30, 0], [260, -40], [300, -30], [290, -10], [60, 12], [-20, 12]], 1.2, 10)}" fill="${C.night2}" opacity=".35"/></g>`);
    TW.slice().sort((a, b) => a.y - b.y).forEach((m) => { m.p = S.puppet(P.add(person(c, m.o))); });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    // the pair being named walks out in front of the ring (a second cut-out of each, on a nearer sheet)
    const F = S.layer({ par: 0.52, sh: 5 });
    TW.forEach((m) => {
      const left = m.R.left, fx = 800 + (left ? -1 : 1) * (m.second ? 236 : 150);
      m.fx = fx; m.fy = gfn(fx) + 62;
      m.spot = F.add(`<g opacity="0"><ellipse cx="0" cy="-80" rx="90" ry="150" fill="url(#warm-glow)"/></g>`);
    });
    TW.forEach((m) => { m.f = S.puppet(F.add(person(c, m.o))); });
    const jGlow = spotL.add(`<g opacity=".45"><circle r="130" fill="url(#halo-glow)"/></g>`);

    /* ---------- tags, signs and the light on each pair ---------- */
    const tagL = S.layer({ par: 0.5, sh: 5 });
    const fx = S.layer({ par: 0.5, sh: 4 });
    TW.forEach((m) => {
      m.tag = tagL.add(`<g><path d="M0 0V-2000" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${nameTag(c, TAGS[m.k](), { size: 15, dark: m.k === 'judas' })}</g>`);
      m.sign = fx.add(`<g>${SIGNS[m.k](c)}</g>`);
    });
    const MA = TW[7];
    const coins = [0, 1, 2].map(() => fx.add(`<g>${coin(c, 9)}</g>`));
    const coinsEl = fx.add(`<g>${coinsIcon(c)}</g>`);
    const jCoins = [0, 1, 2].map(() => fx.add(`<g>${coin(c, 7)}</g>`));
    const stars = [0, 1].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      H.update(T);
      const k0 = es(t, 0.05, 0.4, ease.back) * (1 - es(t, 1.0, 1.3));
      pose(banner, { x: 800, y: lerp(-400, 200, k0), r: Math.sin(T * 0.8) * 1.2, o: k0 > 0.002 ? 1 : 0 });

      // the pair being named
      const cur = Math.max(0, Math.min(5, Math.floor(t) - 1));
      const curOn = t >= 1;
      const cx = (TW[cur * 2].x + TW[cur * 2 + 1].x) / 2;
      const JY = gfn(JX) + 10;
      const open = bump(t, 0.0, 1.0);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: curOn && cx < 800, armF: 20 + open * 50 + (curOn ? 30 + bump(t, cur + 1, cur + 1.6) * 30 : 0), armB: 10 + open * 60, head: -3, blink: blinkAt(T, 1) });
      pose(jGlow, { x: JX, y: JY - 170, o: 0.45 + Math.sin(T * 1.3) * 0.05 });

      TW.forEach((m) => {
        const b = m.b;
        const d = m.second ? 0.2 : 0;
        const out = es(t, b + 0.02 + d * 0.3, b + 0.34 + d * 0.3), back = es(t, b + 0.94, b + 1.22);
        const fw = out * (1 - back);
        const x = lerp(m.x, m.fx, fw), y = lerp(m.y, m.fy, fw), s = lerp(m.R.s, 0.98, fw);
        const walking = (out > 0.01 && out < 0.99) || (back > 0.01 && back < 0.99);
        const bow = bump(t, 0.1, 0.9);
        const has = es(t, b + 0.12 + d, b + 0.3 + d);
        const judas = m.k === 'judas';
        const away = judas ? es(t, 6.45, 6.7) : 0;
        const armF = 18 + has * 22 + fw * 30 - (judas ? away * 30 : 0);
        const flip = walking ? (back > 0.01 ? m.x < x === false : m.fx < m.x) : (judas && away > 0.5 ? !m.R.flip : m.R.flip);
        const front = out > 0.001 && back < 0.999;
        const pz = { x, y, s, flip, walk: walking ? x * 0.05 + m.i : undefined, armF, armB: bow * 20 + fw * 20, head: -fw * 4 + bow * 8 + away * 12, blink: blinkAt(T, m.seed) };
        m.p.set({ ...pz, o: front ? 0 : 1 });
        m.f.set({ ...pz, o: front ? 1 : 0 });
        pose(m.spot, { x, y, s: s * 1.1, o: fw * (judas ? 0.3 : 0.85) });
        // tag on its string
        const drop = es(t, b + 0.06 + d, b + 0.3 + d, ease.back) * (1 - es(t, b + 1.0, b + 1.3));
        const [hx, hy] = headAt(x, y, s, m.R.flip);
        const ty = hy - 70 - (m.second ? 0 : 66) - (m.R.slot < 2 ? 0 : 0);
        pose(m.tag, { x: hx, y: lerp(-300, ty - 30, drop), r: Math.sin(T * 0.9 + m.seed) * 2.2, o: drop > 0.002 ? 1 : 0 });
        // the sign in his hand
        const [px, py] = hand(x, y, s, flip, armF);
        const pop = es(t, b + 0.12 + d, b + 0.34 + d, ease.back);
        const big = 1 + fw * 0.5;
        pose(m.sign, { x: px + (flip ? -1 : 1) * 16 * big, y: py - 4 * big, s: pop * big * 0.8, o: pop > 0.01 && !(m.k === 'matthew' && t < b + 0.62) ? 1 : 0 });
        m.hx = px; m.hy = py; m.big = big;
      });

      /* Matthew: the tax collector's coins turn into the scroll he will write */
      const mb = MA.b;
      const cz = es(t, mb + 0.3, mb + 0.45, ease.back) * (1 - es(t, mb + 0.55, mb + 0.62));
      pose(coinsEl, { x: MA.hx + (MA.R.flip ? -1 : 1) * 16 * MA.big, y: MA.hy - 4 * MA.big, s: cz * MA.big * 0.8, o: cz > 0.01 ? 1 : 0 });
      coins.forEach((el, i) => {
        const k = seg(t, mb + 0.56, mb + 0.9);
        pose(el, { x: MA.hx + (i - 1) * 22 * k, y: MA.hy - 20 + k * 90 + (i - 1) * 4, r: k * 200 * (i - 1), o: k > 0 && k < 1 ? 1 - k * 0.6 : 0 });
      });
      stars.forEach((el, i) => {
        const k = bump(t, mb + 0.58 + i * 0.08, mb + 1.0);
        pose(el, { x: MA.hx + (i ? 26 : -24), y: MA.hy - 50 - i * 10, s: k, r: T * 40, o: k });
      });

      /* Judas: coins slip from his purse; a long shadow */
      const jb = JU.b;
      jCoins.forEach((el, i) => {
        const k = seg(t, jb + 0.5 + i * 0.08, jb + 0.85 + i * 0.08);
        pose(el, { x: JU.hx + (i - 1) * 8, y: JU.hy - 6 + k * k * 70, r: k * 300, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const sh = es(t, jb + 0.45, jb + 0.8);
      pose(shadow, { x: JU.x + 8, y: JU.y + 4, sx: 0.2 + sh * 0.8, o: sh });

      S.cam.x = curOn ? kfCam(t) : 0;
      S.cam.z = 1 + (curOn ? 0.04 : 0);
      S.cam.y = 20;
      function kfCam(tt) {
        const i = Math.max(0, Math.min(5, Math.floor(tt) - 1));
        const a = (TW[i * 2].x + TW[i * 2 + 1].x) / 2 - 800;
        const p = i > 0 ? (TW[i * 2 - 2].x + TW[i * 2 - 1].x) / 2 - 800 : 0;
        return lerp(p, a, es(tt, i + 1, i + 1.3)) * 0.14;
      }
    };
  },
};
