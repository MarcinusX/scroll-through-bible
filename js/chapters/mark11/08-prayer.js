// Mk 11,17–19 — Jesus teaches in the cleared court: the scroll of the prophet unrolls, and people of
// every nation come to pray; "a den of robbers" — a dark cave drops over the wrecked market.
// The chief priests and scribes plot in the shadows, yet fear Him, for the crowd hangs on His words.
// Evening: they go out of the city.
import { C, person, CAST, blinkAt, pose, lerp, hanging, swing, sheet, shade, mix } from '../kit.js';
import { stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { templeCourt, courtFront, changerTable, coin, cage, townsfolk, TWELVE_O, priest, scribe, headAt, thought, GLYPH, spark, wordSlip, hang2, addToHead, withFace, faceBits, FONT, lantern } from './lib.js';
import { shadowPerson } from '../mark3/lib.js';

const PI = Math.PI;
const FLOOR = 676;
const JX = 800;

/** the prophet's scroll, open between its rods, with a line of writing */
function isaiah(c, text) {
  const w = 330, h = 104;
  const s = sheet();
  s.p(c.cut(c.rect(-w / 2, 0, w, h), 0.5, 8), C.parchment);
  let ln = '';
  for (let i = 0; i < 2; i++) { let x = -w / 2 + 24; const y = 74 + i * 12; while (x < w / 2 - 30) { const l = c.rr(14, 40); ln += c.ribbon([[x, y], [Math.min(x + l, w / 2 - 24), y]], 1.8); x += l + 8; } }
  s.x(ln, C.ink, 'opacity=".35"');
  s.p(c.cut(c.rect(-w / 2 - 12, -8, 12, h + 16), 0.3, 5) + c.cut(c.rect(w / 2, -8, 12, h + 16), 0.3, 5), C.wood2);
  s.p(c.cut(c.rect(-w / 2 - 9, -18, 6, 10), 0.2, 3) + c.cut(c.rect(w / 2 + 3, -18, 6, 10), 0.2, 3) + c.cut(c.rect(-w / 2 - 9, h + 8, 6, 10), 0.2, 3) + c.cut(c.rect(w / 2 + 3, h + 8, 6, 10), 0.2, 3), C.ochre);
  const lines = text.split('|');
  return s.out() + lines.map((l, i) => `<text x="0" y="${30 + i * 24}" text-anchor="middle" font-family="${FONT}" font-size="20" font-style="italic" fill="${C.ink}">${l}</text>`).join('');
}
/** a dark cave mouth hung as a painted flat, with the shadows of robbers inside */
function cave(c) {
  const s = sheet();
  const W = 460, H = 330;
  const outer = [[-W / 2, 0], [-W / 2 + 20, -H * 0.5], [-W / 2 + 70, -H * 0.86], [-W * 0.12, -H], [W * 0.18, -H * 0.97], [W / 2 - 60, -H * 0.8], [W / 2 - 16, -H * 0.46], [W / 2, 0]];
  const inner = [[-W / 2 + 70, 0], [-W / 2 + 90, -H * 0.46], [-W * 0.2, -H * 0.74], [W * 0.14, -H * 0.76], [W / 2 - 100, -H * 0.5], [W / 2 - 76, 0]];
  s.p(c.cut(outer, 3, 12) + c.hole(inner, 2, 10), mix(C.rock3, C.storm2, 0.45));
  let cr = '';
  for (let i = 0; i < 10; i++) { const x = c.rr(-W / 2 + 10, W / 2 - 10), y = c.rr(-H + 30, -20); cr += c.ribbon([[x, y], [x + c.rr(-20, 20), y + c.rr(10, 30)]], 2); }
  s.x(cr, shade(C.storm2, -0.2), 'opacity=".6"');
  const back = sheet().p(c.cut(inner, 2, 10), mix(C.night2, C.soilDark, 0.4)).out();
  return { back, rim: s.out() };
}

export default {
  id: 'm11-prayer',
  beats: [
    { v: 17, text: 'Potem uczył ich mówiąc: «Czyż nie jest napisane: Mój dom ma być domem modlitwy dla wszystkich narodów,' },
    { v: 17, cont: true, text: 'lecz wy uczyniliście z niego jaskinię zbójców».' },
    { v: 18, text: 'Doszło to do arcykapłanów i uczonych w Piśmie, i szukali sposobu, jak by Go zgładzić.' },
    { v: 18, cont: true, text: 'Czuli bowiem lęk przed Nim, gdyż cały tłum był zachwycony Jego nauką.' },
    { v: 19 },
  ],
  cam: { x: [-120, 200], y: [-60, 40], z: [0.95, 1.12] },
  build(S) {
    const c = S.c;
    // phone: the den comes down further in, and the plotting priests and scribes stand inside the screen
    const PH = S.portrait;
    const PRX = PH ? 90 : 0;
    const DAY = ['#d0e2dd', '#f1e6c9', '#f8ebd3'], DUSK = ['#6f6a9a', '#d99a86', '#f0b88e'];
    const { sk, sunEl, cl1, sanct } = templeCourt(S, { skyCols: DAY, floorY: FLOOR + 40, sanctX: 800, sunAt: [1230, 150] });
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -400, y1: 380, n: 110 }));
    const sGlow = S.layer({ par: 0.16, sh: 1, flat: true }).add(`<g><circle r="300" fill="url(#halo-glow)"/></g>`);

    /* ---------- the wrecked market on the right ---------- */
    const wreck = S.layer({ par: 0.44, sh: 4 });
    wreck.add(`<g transform="translate(1180 ${FLOOR - 6}) rotate(94) translate(-75 0)">${changerTable(c, 150)}</g><g transform="translate(1290 ${FLOOR - 24}) rotate(-70)">${cage(c, 60, 52)}</g>`);
    let cs = '';
    for (let i = 0; i < 9; i++) cs += `<g transform="translate(${1060 + i * 34 + c.rr(-10, 10)} ${FLOOR + c.rr(0, 30)}) scale(1 .5)">${coin(c, 7)}</g>`;
    wreck.add(cs);
    // the den of robbers: a cave that comes down over it
    const cv = cave(c);
    const caveL = S.layer({ par: 0.46, sh: 6 });
    const robbers = [0, 1, 2].map((i) => shadowPerson(c, townsfolk(c, { man: true, hairStyle: i === 1 ? 'wrap' : 'short', veil: C.stone }), '#2b2533'));
    const eyes = (x, y) => `<g class="eyes"><circle cx="${x}" cy="${y}" r="2.6" fill="${C.lampFlame}"/><circle cx="${x + 9}" cy="${y}" r="2.4" fill="${C.lampFlame}"/></g>`;
    const caveM = `${cv.back}${robbers.map((r, i) => `<g transform="translate(${-100 + i * 90} 4) scale(${0.62 + (i % 2) * 0.08})${i === 2 ? ' scale(-1 1)' : ''}">${r}</g>${eyes(-96 + i * 90, -100 - (i % 2) * 12)}`).join('')}<g transform="translate(20 -20)">${sheet().p(c.cut(c.blob(0, 0, 26, 20, 10, 0.2), 0.6, 4), C.wood3).p(c.ribbon([[-10, -18], [10, -18]], 5), C.rope).out()}${[0, 1, 2].map((k) => `<g transform="translate(${-20 + k * 16} 10)">${coin(c, 6)}</g>`).join('')}</g>${cv.rim}`;
    const caveEl = caveL.add(`<g>${hang2(caveM, 180, 900)}</g>`);

    /* ---------- the chief priests and scribes under the portico ---------- */
    const prL = S.layer({ par: 0.4, sh: 4 });
    const PR = [
      { m: priest(c, 0), x: 350 }, { m: scribe(c, 0), x: 420 }, { m: priest(c, 1), x: 490 }, { m: scribe(c, 1), x: 560 },
    ].map((d, i) => ({ ...d, x: d.x + PRX, i, seed: c.rr(0, 9), p: S.puppet(prL.add(withFace(d.m, faceBits(c)))) }));
    PR.forEach((d) => { d.sad = d.p.el.querySelector('[data-part="sad"]'); d.angry = d.p.el.querySelector('[data-part="angry"]'); });
    const messenger = { seed: c.rr(0, 9), p: S.puppet(prL.add(person(c, townsfolk(c, { man: true, robe: C.linen2, mantle: null, belt: C.dustyBlue })))) };
    const plots = PR.slice(0, 3).map(() => prL.add(`<g>${thought(c, GLYPH.storm(c), { w: 58, h: 46, fill: mix(C.storm, C.stone2, 0.35) })}</g>`));

    /* ---------- the people of all nations, the crowd, the disciples ---------- */
    const crowdL = S.layer({ par: 0.48, sh: 4 });
    const natL = S.layer({ par: 0.5, sh: 4 });
    const cap = (col) => sheet().p(c.cut([[-16, -12], [-12, -30], [10, -32], [16, -12]], 0.4, 4), col).out();
    const NATIONS = [
      { o: { robe: C.ochreRobe, mantle: C.terracotta, skin: C.skin4, hair: C.hair3, hairStyle: 'curly', beard: 'short' }, x: 560, pose: 'kneel' },
      { o: { robe: C.linen, mantle: C.dustyBlue, skin: C.skin, hair: C.hair2, hairStyle: 'short', beard: 'short' }, x: 670, pose: 'kneel' },
      { o: { robe: C.plumRobe, mantle: C.sun, skin: C.skin3, hair: C.hair3, hairStyle: 'short', beard: 'full' }, x: 935, pose: 'kneel', hat: cap(C.terracotta) },
      { o: { robe: C.roseRobe, skin: C.skin3, hairStyle: 'veil', veil: C.sun, veil2: C.terracotta }, x: 1045, pose: 'kneel' },
      { o: { robe: C.linen2, mantle: C.teal2, skin: C.skin2, hairStyle: 'wrap', veil: C.linen, veil2: C.teal2, beard: 'full', hair: C.hair }, x: 1150, pose: 'kneel' },
    ].map((n, i) => {
      let m = person(c, { ...n.o, pose: n.pose });
      if (n.hat) m = addToHead(m, n.hat);
      return { ...n, i, seed: c.rr(0, 9), p: S.puppet(natL.add(m)) };
    });
    const CROWD = [[600, -30], [690, -34], [930, -30], [1010, -36], [1110, -28], [560, -8], [1060, -6]].map(([x, dy], i) => ({ x, y: FLOOR + dy, i, seed: c.rr(0, 9), p: S.puppet(crowdL.add(person(c, townsfolk(c)))) }));
    const DIS = [0, 2, 1, 3, 7].map((k, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(crowdL.add(person(c, TWELVE_O[k]))) }));

    /* ---------- Jesus ---------- */
    const L = S.layer({ par: 0.5, sh: 5 });
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const scrollEl = fx.add(`<g>${hang2(isaiah(c, tr('Mój dom będzie domem modlitwy|dla wszystkich narodów', 'My house will be called a house of prayer|for all the nations')), 150, 800)}</g>`);
    const words = Array.from({ length: 8 }, (_, i) => ({ i, el: fx.add(wordSlip(c, c.rr(26, 36))), to: [lerp(460, 1180, i / 7) + c.rr(-20, 20), c.rr(380, 470)] }));
    const joys = CROWD.slice(0, 5).map(() => fx.add(`<g>${spark(c, 10)}</g>`));
    const lamps = [220, 380, 1230, 1400].map((x, i) => ({ x, i, el: fx.add(`<g>${lantern(c)}</g>`) }));
    lamps.forEach((l) => { l.glow = l.el.querySelector('.glow'); });
    const eyeEls = Array.from(caveL.el.querySelectorAll('.eyes'));
    courtFront(S);
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#2a2656"/>`);

    return (t, time) => {
      const T = time;
      const dusk = es(t, 4.0, 4.45);
      const den = es(t, 1.05, 1.4) * (1 - es(t, 1.85, 2.1));
      sk.blend(DAY, DUSK, dusk);
      tint.fade(dusk * 0.26 + den * 0.14);
      starL.fade(es(t, 4.3, 4.7) * 0.9);
      swing(sunEl, 1230, 150 + dusk * 520, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);

      /* v17a — the scroll; the house of prayer for all nations */
      const sd = es(t, 0.1, 0.45, ease.back) * (1 - es(t, 0.95, 1.15));
      swing(scrollEl, 800, 150 - (1 - sd) * 700, T, 0.8, 0.7);
      const prayK = es(t, 0.35, 0.8) * (1 - den * 0.8);
      pose(sGlow, { x: 800, y: 400, s: 0.8 + prayK * 0.3, o: prayK * 0.8 * (1 - dusk * 0.5) });
      NATIONS.forEach((n) => {
        const k = es(t, 0.3 + n.i * 0.08, 0.7 + n.i * 0.08, ease.out);
        const x = lerp(n.x < 800 ? n.x - 300 : n.x + 300, n.x, k);
        n.p.set({ x, y: FLOOR + 4 - (n.i % 2) * 8, s: 0.92, flip: n.x > 800, o: seg(t, 0.3 + n.i * 0.08, 0.4 + n.i * 0.08) * (1 - es(t, 1.0, 1.25)), armB: 140 * es(t, 0.6, 0.9), armF: 90 * es(t, 0.6, 0.9), head: -14 * es(t, 0.6, 0.9), blink: blinkAt(T, n.seed) });
      });
      /* v17b — the den of robbers comes down over the wrecked market */
      swing(caveEl, PH ? 1030 : 1150, FLOOR + 4 - (1 - es(t, 1.05, 1.35, ease.out)) * 900 - es(t, 1.9, 2.15, ease.in) * 900, T, 0.5, 0.7);
      const eyesOn = den * (0.6 + 0.4 * Math.abs(Math.sin(T * 1.3)));
      // the disciples are gone before the den comes down and back only once it has gone up (no ghosts in front of it)
      const inDen = seg(t, 0.98, 1.05) * (1 - seg(t, 2.12, 2.19));

      /* v18a — word reaches the chief priests and the scribes; they plot */
      const run = es(t, 2.0, 2.4);
      const mx = lerp(1500, PH ? 720 : 640, run);
      messenger.p.set({ x: mx, y: FLOOR - 30, s: 0.86, flip: true, walk: run > 0 && run < 1 ? mx * 0.08 : undefined, armF: bump(t, 2.35, 2.9) * 70, armB: run < 1 ? 50 : 0, blink: blinkAt(T, messenger.seed), o: seg(t, 1.98, 2.05) * (1 - es(t, 3.0, 3.2)) });
      const huddle = es(t, 2.4, 2.7) * (1 - es(t, 3.05, 3.3));
      const fear = es(t, 3.05, 3.35);
      PR.forEach((d) => {
        const away = es(t, 4.05, 4.5, ease.in);
        const x = d.x + huddle * (d.i < 2 ? 14 : -14) - fear * 50 - away * 500;
        d.p.set({ x, y: FLOOR - 40, s: 0.88, walk: away > 0 && away < 1 ? x * 0.06 : undefined, o: 1 - seg(t, 4.4, 4.5), flip: away > 0.02 ? true : huddle > 0.5 ? d.i >= 2 : false, head: huddle * 10 - fear * 6, lean: -fear * 6, armF: huddle * (d.i % 2 ? 40 : 20) + fear * 30, armB: fear * 40, blink: blinkAt(T, d.seed) });
        fade(d.angry, huddle);
        fade(d.sad, fear * (1 - es(t, 4.1, 4.4)));
      });
      plots.forEach((p, i) => {
        const d = PR[i];
        const [hx, hy] = headAt(d.x + huddle * (d.i < 2 ? 14 : -14), FLOOR - 40, 0.88, false);
        const k = es(t, 2.5 + i * 0.1, 2.7 + i * 0.1, ease.back) * (1 - es(t, 3.05, 3.25));
        pose(p, { x: hx + 4, y: hy - 10, s: k * 0.9, o: k > 0.02 ? 1 : 0 });
      });

      /* v18b — the whole crowd is astonished at His teaching */
      const gather = es(t, 3.0, 3.45, ease.out);
      const teach = Math.max(es(t, 0.05, 0.3) * (1 - es(t, 1.9, 2.1)), gather * (1 - es(t, 3.95, 4.1)));
      CROWD.forEach((m) => {
        const x = m.x + (m.x < 800 ? -1 : 1) * (1 - gather) * 520;
        const leave = es(t, 4.05, 4.5, ease.in);
        m.p.set({ x: x + (m.x < 800 ? -1 : 1) * leave * 600, y: m.y, s: 0.9, flip: leave > 0.05 ? m.x < 800 : m.x > 800, walk: (leave > 0 && leave < 1) || (gather > 0 && gather < 1) ? x * 0.06 : undefined, armB: gather * (m.i % 2 ? 130 : 30) * (1 - leave), armF: gather * 60 * (1 - leave), head: -gather * 6, blink: blinkAt(T, m.seed), o: seg(t, 2.95, 3.02) * (1 - seg(t, 4.35, 4.5)) });
      });
      joys.forEach((j, i) => {
        const m = CROWD[i];
        const [hx, hy] = headAt(m.x, m.y, 0.9, m.x > 800);
        const k = bump(t, 3.2 + i * 0.06, 3.95);
        pose(j, { x: hx, y: hy - 40 - k * 20, s: k * 1.2 + 0.001, r: t * 60, o: k });
      });
      words.forEach((w) => {
        const k = ((T * 0.22 + w.i / words.length) % 1);
        const x = lerp(JX + 10, w.to[0], k), y = lerp(470, w.to[1], k) - Math.sin(k * PI) * 60;
        pose(w.el, { x, y, r: Math.sin(T * 2 + w.i) * 12, s: 0.5 + k * 0.5, o: teach * Math.min(1, k * 5) * (1 - k * 0.6) });
      });

      /* v19 — evening; they go out of the city */
      const out = es(t, 4.4, 4.98, ease.in);
      const jx = JX - out * 760;
      jesus.set({ x: jx, y: FLOOR, s: 1.04, flip: out > 0.02, walk: out > 0 && out < 1 ? jx * 0.05 : undefined, armF: teach * (50 + Math.sin(T * 1.5) * 16) + bump(t, 1.1, 1.9) * 60, armB: teach * 30 + prayK * 20 * (1 - teach), head: -prayK * 6, blink: blinkAt(T) });
      DIS.forEach((d) => { const x = 900 + d.i * 50 + (d.i % 2) * 10 - out * 1000; d.p.set({ x, y: FLOOR - 26 + (d.i % 2) * 8, s: 0.84, flip: true, walk: out > 0 && out < 1 ? x * 0.05 + d.i : undefined, head: -prayK * 4, blink: blinkAt(T, d.seed), o: (1 - seg(t, 4.9, 5)) * (1 - inDen) }); });   // they step out of sight while the den hangs there (else they'd seem to stand in it)
      lamps.forEach((l) => { fade(l.glow, es(t, 4.1 + l.i * 0.05, 4.25 + l.i * 0.05)); swing(l.el, l.x, FLOOR - 290, T, 1.4, 0.9, l.i); });
      eyeEls.forEach((e) => fade(e, eyesOn));

      S.cam.x = es(t, 1.0, 1.3) * (PH ? 190 : 90) * (1 - es(t, 1.9, 2.2)) - es(t, 2.0, 2.4) * 110 * (1 - es(t, 3.2, 3.5)) - es(t, 4.4, 4.98) * 60;
      S.cam.z = 1.02 - sd * 0.04 + es(t, 2.2, 2.6) * 0.06 * (1 - es(t, 3.2, 3.5));
      S.cam.y = -sd * 40 + es(t, 2.2, 2.6) * 20 * (1 - es(t, 3.2, 3.5));
    };
  },
};
