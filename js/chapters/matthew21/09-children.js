// Mt 21,15–17 — the chief priests and scribes see the wonders (the healed men leaping in the light) and the children
// running through the Temple with palm fronds, crying "Hosanna to the Son of David!" — their brows darken. "Do you
// hear what these are saying?" — "Yes." The psalm comes down on its rods: "Out of the mouth of babes and nursing
// babies you have perfected praise" — little notes of light rise from the children (and from a baby in its mother's
// arms) up to the sanctuary. Evening: He leaves them and goes out of the city to Bethany, where He spends the night.
import { C, person, CAST, blinkAt, pose, lerp, sky, swing, hanging, sheet, shade, mix } from '../kit.js';
import { stars, moon } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { templeCourt, courtFront, priest, scribe, withFace, faceBits, kid, kidHead, frond, bubble, headAt, hang2, psalmScroll, praiseNote, voiceRings, pennant, BLIND, LAME, TWELVE_O, signpost, lantern, sparkle, woman, hungPlate, tr, DAY, DUSK, PI } from './lib.js';

const FLOOR = 676;
const JX = 800;

/** a swaddled baby held in the arms (hold coords) */
function baby(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, 0, 26, 12, 14, -0.2), 0.4, 4), C.linen);
  s.x(c.ribbon([[-14, -4], [-8, 8]], 1.6) + c.ribbon([[-2, -8], [4, 8]], 1.6), shade(C.linen, -0.14), 'opacity=".8"');
  s.p(c.cut(c.circ(20, -6, 8.4, 12), 0.2, 3), C.skin);
  s.x(c.poly(c.circ(22, -7, 1.1, 6)) + c.poly(c.circ(25.5, -6, 1, 6)), C.ink);
  s.x(c.poly(c.ell(24, -2.4, 1.6, 1.3, 6)), shade(C.skin, -0.35));
  return s.out();
}
/** Bethany at night, for a round plate: a little house with a lit window under the moon */
function bethanyIcon(c) {
  const s = sheet();
  s.p(c.cut([[-50, 30], [-40, 4], [-10, -6], [24, -2], [50, 30]], 0.5, 6), mix(C.hillMid, C.night2, 0.45));
  s.p(c.cut(c.rect(-22, -18, 40, 28), 0.3, 5), mix(C.plaster, C.night2, 0.25));
  s.p(c.cut([[-26, -18], [-2, -34], [22, -18]], 0.3, 4), mix(C.roof, C.night2, 0.3));
  s.p(c.cut(c.rect(-8, -10, 9, 10), 0.2, 3), C.lampFlame);
  s.p(c.cut(c.blob(34, 6, 11, 16, 8, 0.2), 0.3, 3), mix(C.olive, C.night2, 0.4));
  s.p(c.cut(c.circ(-32, -30, 8, 12), 0.2, 3), C.moonLight || C.cream);
  return `<circle r="40" fill="url(#warm-glow)" opacity=".5"/>${s.out()}`;
}

export default {
  id: 'mt21-children',
  beats: [
    { v: 15, text: 'Lecz arcykapłani i uczeni w Piśmie - widząc cuda, które uczynił,' },
    { v: 15, cont: true, text: 'i dzieci wołające w świątyni: «Hosanna Synowi Dawida» - oburzyli się' },
    { v: 16, text: 'i rzekli do Niego: «Słyszysz, co one mówią?»' },
    { v: 16, cont: true, text: 'A Jezus im odpowiedział: «Tak jest.' },
    { v: 16, cont: true, text: 'Czy nigdy nie czytaliście: Z ust niemowląt i ssących zgotowałeś sobie chwałę?»' },
    { v: 17 },
  ],
  cam: { x: [-90, 60], y: [-60, 40], z: [0.95, 1.12] },
  build(S) {
    const c = S.c;
    const T0 = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 150] });
    const { sunEl, cl1 } = T0;
    const duskL = sky(S, DUSK, { name: 'dusk', rise: 0 }).layer;
    const starL = S.layer({ par: 0.02, sh: 1, flat: true, rise: 0 });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 110 }));
    const moonL = S.layer({ par: 0.04, sh: 4, rise: 0 });
    const moonEl = hanging(moonL, `<circle r="110" fill="url(#halo-glow)" opacity=".5"/>${moon(c, 34)}`, { x: 1010, y: 140, len: 800 });
    // the night skies go straight behind the hanging sun (templeCourt made its layers first)
    [duskL, starL, moonL].forEach((L) => T0.hangL.el.parentNode.insertBefore(L.el, T0.hangL.el));
    const sGlow = S.layer({ par: 0.16, sh: 1, flat: true }).add(`<g><circle r="300" fill="url(#halo-glow)"/></g>`);

    /* ---------- the chief priests and scribes under the portico ---------- */
    const prL = S.layer({ par: 0.44, sh: 4 });
    const PR = [{ m: priest(c, 0), x: 330 }, { m: scribe(c, 0), x: 400 }, { m: priest(c, 1), x: 470 }, { m: scribe(c, 1), x: 540 }]
      .map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(prL.add(withFace(d.m, faceBits(c)))) }));
    PR.forEach((d) => { d.angry = d.p.el.querySelector('[data-part="angry"]'); });
    const DIS = [0, 2, 1, 3].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(prL.add(person(c, TWELVE_O[k]))) }));

    /* ---------- the healed men, the children, a mother with her baby ---------- */
    const L = S.layer({ par: 0.48, sh: 5 });
    const healed = [{ o: BLIND[0] || BLIND, x: 960 }, { o: LAME, x: 1060 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(L.add(person(c, d.o))) }));
    const mother = { seed: c.rr(0, 9), p: S.puppet(L.add(person(c, woman(c, { robe: C.roseRobe, veil: C.skyVeil, holdF: `<g transform="translate(-6 -24) rotate(76)">${baby(c)}</g>` })))) };
    const KIDS = [[930, 0], [1010, 1], [1090, 2], [1170, 3], [1250, 4], [1320, 5]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), ph: c.rr(0, 6), p: S.puppet(L.add(kid(c, i, { holdB: `<g transform="rotate(-8)">${frond(c, 80)}</g>` }))) }));
    const jL = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(jL.add(person(c, { ...CAST.jesus })));

    /* ---------- words, light ---------- */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const voice = KIDS.slice(0, 3).map(() => voiceRings(fx, c, { n: 2, r: 20, w: 4, both: false, color: shade(C.terracotta, 0.3) }));
    const hos = fx.add(`<g>${[...'HOSANNA'].map((ch, i) => `<g transform="translate(${i * 34 - 102} ${Math.sin((i / 6) * PI) * -14}) scale(.66)">${pennant(c, ch, [C.terracotta, C.ochre, C.teal2, C.jesusMantle, C.dustyBlue, C.moss, C.plumRobe][i])}</g>`).join('')}</g>`);
    const wonders = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));
    const ask = fx.add(`<g>${bubble(c, [tr('Słyszysz,', 'Do you hear'), tr('co one mówią?', 'what these are saying?')], { size: 19, tail: 1 })}</g>`);
    const yes = fx.add(`<g>${bubble(c, [tr('Tak jest.', 'Yes.')], { size: 21, tail: -1 })}</g>`);
    const scrollEl = fx.add(`<g>${hang2(psalmScroll(c, tr('Z ust niemowląt i ssących|zgotowałeś sobie chwałę', 'Out of the mouth of babes|you have perfected praise'), { w: 360, size: 21 }), 170, 800)}</g>`);
    const notes = Array.from({ length: 9 }, (_, i) => ({ i, el: fx.add(`<g>${praiseNote(c, 8, [C.sun, C.halo, C.apricot][i % 3])}</g>`) }));
    const beth = fx.add(hungPlate(c, `${bethanyIcon(c)}<text x="0" y="50" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="16" font-style="italic" fill="${C.cream}">${tr('Betania', 'Bethany')}</text>`, { r: 70, fill: mix(C.night2, C.indigo, 0.3), rim: C.ochre }));
    const signL = S.layer({ par: 0.6, sh: 5 });
    const sign = signL.add(`<g>${signpost(c, tr('do Betanii', 'to Bethany'), { size: 18, dir: -1 })}</g>`);
    const lamps = [220, 380, 1230, 1400].map((x, i) => ({ x, i, el: signL.add(`<g>${lantern(c)}</g>`) }));
    lamps.forEach((l) => { l.glow = l.el.querySelector('.glow'); });
    courtFront(S);
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2a2656"/>`);

    return (t, time) => {
      const T = time;
      const dusk = es(t, 5.02, 5.4);
      duskL.fade(dusk);
      tint.fade(dusk * 0.26);
      starL.fade(es(t, 5.3, 5.6) * 0.9);
      swing(sunEl, 1230, 150 + dusk * 520, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);
      swing(moonEl, 1010, 140 - (1 - es(t, 5.3, 5.7)) * 700, T, 0.8, 0.5, 1);

      /* v15a — they see the wonders: the healed men leap in the light */
      const leave = es(t, 1.0, 1.5, ease.in);
      healed.forEach((h) => {
        const hop = Math.abs(Math.sin(t * 9 + h.i)) * 18 * (1 - es(t, 0.9, 1.2)) * es(t, 0.05, 0.15);
        const x = h.x + leave * 600;
        h.p.set({ x, y: FLOOR + 10 - hop, s: 0.94, flip: leave > 0.02 ? false : true, walk: leave > 0 && leave < 1 ? x * 0.05 + h.i : undefined, armF: 60 + bump(t, 0.1, 1.1) * 40, armB: 130 * (1 - leave * 0.6), head: -10, blink: blinkAt(T, h.seed), o: 1 - seg(t, 1.45, 1.5) });
      });
      wonders.forEach((w, i) => {
        const k = ((T * 0.35 + i / 4) % 1);
        const hx = healed[i % 2].x + leave * 600;
        pose(w, { x: hx + Math.cos(i * 2) * 50, y: FLOOR - 190 - k * 90, s: 0.9, r: T * 40, o: (1 - es(t, 1.0, 1.3)) * Math.sin(k * PI) });
      });
      const glare = es(t, 0.3, 0.6);
      const indig = es(t, 1.3, 1.6);
      const step = es(t, 2.05, 2.4);
      const out = es(t, 5.05, 5.9, ease.in);
      PR.forEach((d) => {
        const lead = d.i === 0;
        const x = d.x + (lead ? step * 250 : step * 40) - (lead ? es(t, 3.9, 4.3) * 120 : 0) - out * 30;
        d.p.set({ x, y: FLOOR - 30 + (d.i % 2) * 10, s: 0.9, walk: (lead && step > 0 && step < 1) ? x * 0.05 : undefined, armF: indig * (d.i % 2 ? 50 : 20) + (lead ? bump(t, 2.1, 3.0) * 70 : 0), armB: indig * (d.i === 2 ? 110 : 0), head: -glare * 6 + indig * 8 * (d.i % 2 ? 1 : -1), lean: -bump(t, 4.3, 5.0) * 6, blink: blinkAt(T, d.seed) });
        fade(d.angry, es(t, 1.3, 1.5));
      });
      const [phx, phy] = headAt(PR[0].x + step * 250, FLOOR - 30, 0.9, false);
      const ak = es(t, 2.12, 2.32, ease.back) * (1 - es(t, 2.9, 3.05));
      pose(ask, { x: phx + 30, y: phy - 40, s: ak, o: ak > 0.02 ? 1 : 0 });

      /* v15b — the children run in crying Hosanna, waving palm fronds */
      const run = es(t, 1.0, 1.45, ease.out);
      const cry = es(t, 1.2, 1.4) * (1 - es(t, 5.0, 5.2));
      KIDS.forEach((k) => {
        const x = k.x + (1 - run) * 560;
        const hop = Math.abs(Math.sin(t * 7 + k.ph)) * 10 * cry;
        k.p.set({ x, y: FLOOR + 14 - (k.i % 2) * 10 - hop, s: 0.5, flip: out > 0.02 || true, walk: run > 0 && run < 1 ? x * 0.09 + k.i : undefined, armB: 60 + run * 90 + Math.sin(t * 10 + k.ph) * 14 * cry, armF: 30 + cry * 30, head: -8, blink: blinkAt(T, k.seed), o: seg(t, 0.98, 1.02) });
      });
      voice.forEach((v, i) => { const k = KIDS[i]; const [hx, hy] = kidHead(k.x + (1 - run) * 560, FLOOR + 14 - (k.i % 2) * 10, 0.5, true); v(hx - 18, hy + 4, cry * (1 - es(t, 2.0, 2.3)), T, { dir: -1 }); });
      const hk = es(t, 1.2, 1.5, ease.back) * (1 - es(t, 2.0, 2.3));
      pose(hos, { x: 1130, y: 390 - (1 - hk) * 40, s: hk, r: Math.sin(T * 2) * 2, o: hk > 0.02 ? 1 : 0 });

      /* v16b — "Yes"; v16c — the psalm; praise rising from the children and the baby */
      const [jhx, jhy] = headAt(JX, FLOOR, 1.04, false);
      const yk = es(t, 3.1, 3.3, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(yes, { x: jhx - 30, y: jhy - 40, s: yk, o: yk > 0.02 ? 1 : 0 });
      const sd = es(t, 4.05, 4.4, ease.back) * (1 - es(t, 4.95, 5.15));
      swing(scrollEl, 800, 175 - (1 - sd) * 700, T, 0.8, 0.7);
      const praise = es(t, 4.2, 4.5) * (1 - es(t, 5.0, 5.2));
      pose(sGlow, { x: 800, y: 400, s: 0.8 + praise * 0.3, o: praise * 0.9 });
      const mIn = es(t, 3.95, 4.3, ease.out);
      const mx = lerp(1500, 1130, mIn);
      mother.p.set({ x: mx, y: FLOOR - 8, s: 0.94, flip: true, walk: mIn > 0 && mIn < 1 ? mx * 0.05 : undefined, armF: 70, armB: 60, head: 8, blink: blinkAt(T, mother.seed), o: seg(t, 3.93, 3.97) });
      notes.forEach((n) => {
        const src = n.i < 6 ? KIDS[n.i] : null;
        const [sx, sy] = src ? kidHead(src.x, FLOOR + 14, 0.5, true) : headAt(1130, FLOOR - 8, 0.94, true, 60);
        const k = ((T * 0.25 + n.i / 9) % 1);
        const kk = T ? k : (n.i / 9);
        pose(n.el, { x: lerp(sx - 10, 800 + (n.i - 4) * 30, kk), y: lerp(sy - 20, 360, kk) - Math.sin(kk * PI) * 40, s: 0.8 + kk * 0.3, r: Math.sin(T * 2 + n.i) * 12, o: praise * Math.min(1, (1 - kk) * 3) });
      });

      /* v17 — evening: He leaves them and goes out to Bethany */
      const jx = JX - out * 820;
      jesus.set({ x: jx, y: FLOOR, s: 1.04, flip: out > 0.02, walk: out > 0 && out < 1 ? jx * 0.05 : undefined, armF: bump(t, 0.1, 1.0) * 40 + yk * 60 + praise * 50, armB: praise * 110, head: -praise * 10 + yk * 4, blink: blinkAt(T) });
      DIS.forEach((d) => { const x = 240 - d.i * 50 - out * 600 + (1 - es(t, 4.9, 5.1)) * -400; d.p.set({ x, y: FLOOR - 20 + (d.i % 2) * 8, s: 0.86, flip: true, walk: out > 0 && out < 1 ? x * 0.05 + d.i : undefined, blink: blinkAt(T, d.seed), o: seg(t, 4.95, 5.0) }); });
      lamps.forEach((l) => { fade(l.glow, es(t, 5.15 + l.i * 0.05, 5.3 + l.i * 0.05)); swing(l.el, l.x, FLOOR - 290, T, 1.4, 0.9, l.i); });
      pose(sign, { x: 470, y: FLOOR + 30, o: es(t, 5.2, 5.4), s: 1 });
      const bk = es(t, 5.4, 5.75, ease.out);
      pose(beth, { x: 800, y: lerp(-800, 250, bk), r: T ? Math.sin(T * 0.9) * 1.5 : 0 });

      S.cam.x = -30 + es(t, 0.9, 1.4) * 60 - es(t, 2.0, 2.4) * 60 + es(t, 3.9, 4.3) * 30 - es(t, 5.0, 5.6) * 40;
      S.cam.y = -es(t, 4.0, 4.4) * 30 + es(t, 5.0, 5.6) * 10;
      S.cam.z = 1.02 - es(t, 4.0, 4.4) * 0.04;
    };
  },
};
