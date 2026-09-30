// J 5,31–35 — in the Temple court at evening stands a stone bench for witnesses, with two seats, I and II (the
// Law asks for two). "If I testify about myself, my witness is not true": Jesus by the first seat, the second
// empty, a testimony that hangs unsealed with a question. "There is another who testifies of me" — the second seat
// fills with light; "and His testimony is true" — a golden seal is pressed on it. "You sent to John": a sepia
// picture comes down — the envoys at the Jordan, John pointing — "and he bore witness to the truth". Jesus sets
// the human testimony aside, and opens His hands to them: "I say this that you may be saved." John was a burning
// and shining lamp — a great lamp hangs and blazes — and you were glad for a while in its light: they gather in
// its glow, then the flame sinks and goes out, and they drift away.
import { C, person, CAST, crowdPerson, blinkAt, lerp, mix, shade } from '../kit.js';
import { band, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import {
  templeCourt, courtFront, leaderOpts, withFace, faceBits, witnessBench, bigLamp, radiance, ghost, panel, sepia, JOHN_B, LEVITE, verseScroll, medallion, question, tick,
  soulLight, hungWord, hang2, sandGlass, vis, kf, headAt, handAt, swing, tr, PI,
} from './lib.js';

const FLOOR = 690;
const EVE = ['#9d8fb2', '#e6b596', '#f3cfa8'];
const DARK = ['#3b3f6e', '#6b5f86', '#a98a8f'];

/** the Jordan with John and the envoys, for a sepia picture (inner coords: x ±w/2, y 0..h) */
function jordanPicture(S, w, h) {
  const c = S.c;
  let s = `<rect x="${-w / 2}" y="0" width="${w}" height="${h}" fill="${mix(C.parchment, C.dune, 0.2)}"/>`;
  s += `<path d="${c.ridge(c.wave(h * 0.5, [8, 3], [300, 100]), -w / 2, w / 2, h, 10, 1)}" fill="${mix(C.hillFar, C.parchment, 0.4)}"/>`;
  s += `<path d="${c.ridge(c.wave(h * 0.66, [3, 1], [200, 80]), -w / 2, w / 2, h, 10, 0.6)}" fill="${mix(C.lake, C.parchment, 0.45)}"/>`;
  s += `<path d="${c.ridge(c.wave(h * 0.8, [4, 2], [200, 80]), -w / 2, w / 2, h, 10, 0.8)}" fill="${mix(C.sand2, C.parchment, 0.4)}"/>`;
  s += `<g transform="translate(${-w * 0.22} ${h * 0.88}) scale(.62)">${person(c, { ...sepia(JOHN_B, 0.35), holdF: '' })}</g>`;
  s += `<g transform="translate(${w * 0.12} ${h * 0.9}) scale(-.6 .6)">${person(c, sepia(LEVITE(0), 0.35))}</g>`;
  s += `<g transform="translate(${w * 0.28} ${h * 0.92}) scale(-.62 .62)">${person(c, sepia(LEVITE(1), 0.35))}</g>`;
  s += `<path d="${c.ribbon([[-w * 0.16, h * 0.6], [w * 0.02, h * 0.52]], 3)}" fill="${C.terracotta}" opacity=".7"/><path d="${c.poly([[w * 0.02, h * 0.47], [w * 0.06, h * 0.52], [w * 0.02, h * 0.57]])}" fill="${C.terracotta}" opacity=".7"/>`;
  return s;
}

export default {
  id: 'j5-witness',
  beats: [
    { v: 31 },
    { v: 32, text: 'Jest przecież ktoś inny, kto wydaje sąd o Mnie;' },
    { v: 32, cont: true, text: 'a wiem, że sąd, który o Mnie wydaje, jest prawdziwy.' },
    { v: 33 },
    { v: 34, text: 'Ja nie zważam na świadectwo człowieka,' },
    { v: 34, cont: true, text: 'ale mówię to, abyście byli zbawieni.' },
    { v: 35, text: 'On był lampą, co płonie i świeci,' },
    { v: 35, cont: true, text: 'wy zaś chcieliście radować się krótki czas jego światłem.' },
  ],
  cam: { x: [-80, 80], y: [-80, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const TC = templeCourt(S, { skyCols: EVE, floorY: FLOOR + 40, sanctX: 1000, sunAt: [1300, 250] });
    const nightL = S.layer({ par: 0, sh: 0, flat: true });
    nightL.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${DARK[0]}"/>`);

    /* the witness bench and the light on the second seat */
    const B = S.layer({ par: 0.46, sh: 5 });
    const BX = 560;
    B.add(`<g transform="translate(${BX} ${FLOOR + 6})">${witnessBench(c, 300)}</g>`);
    const seatLight = B.add(`<g><circle r="120" fill="url(#halo-glow)"/>${radiance(c, 34)}</g>`);
    const emptyG = B.add(`<g transform="scale(.8)">${ghost(c)}</g>`);

    /* people */
    const L = S.layer({ par: 0.5, sh: 6 });
    const LEAD = [0, 1, 2].map((i) => {
      const el = L.add(withFace(person(c, leaderOpts(i)), faceBits(c)));
      return { i, el, p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), x: [1060, 1150, 1250][i], seed: c.rr(0, 9) };
    });
    const folk = [0, 1].map((i) => ({ i, p: S.puppet(L.add(person(c, crowdPerson(c)))), x: [960, 1340][i], seed: c.rr(0, 9) }));
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const lights = [0, 1, 2, 3, 4].map(() => L.add(`<g>${soulLight(c, 7)}</g>`));

    /* the flies */
    const X = S.layer({ par: 0.36, sh: 5 });
    const V = verseScroll(c, [tr('świadectwo', 'testimony')], { w: 200, size: 22 });
    const testimony = X.add(`<g>${hang2(`${V.rodTop}${V.sheet}<g transform="translate(0 ${V.h})">${V.rodBottom}</g><g transform="translate(0 ${V.h + 34})">${medallion(c, CAST.jesus, { r: 18 })}</g>`, 70, 400)}</g>`);
    const qm = X.add(`<g transform="scale(1.3)">${question(c)}</g>`);
    const sealEl = X.add(`<g><circle r="30" fill="${shade(C.terracotta, -0.2)}"/><path d="${c.cut(c.star(0, 0, 30, 25, 14, 0), 0.3, 3)}" fill="${shade(C.terracotta, -0.2)}"/><circle r="18" fill="none" stroke="${C.sun}" stroke-width="3"/>${tick(c, 10, C.sun)}</g>`);
    const pic = X.add(`<g>${panel(S, jordanPicture(S, 420, 250), { w: 420, h: 250, rim: C.wood3, k: 'jordan' })}</g>`);
    const janT = X.add(hungWord(c, tr('Jan', 'John'), { size: 22 }));
    const lamp = X.add(`<g>${bigLamp(c)}</g>`);
    const flameEl = lamp.querySelector('.flame'), glowEl = lamp.querySelector('.glow');
    const lampT = X.add(hungWord(c, tr('Jan — lampa', 'John — a lamp'), { size: 20 }));
    const glass = X.add(`<g>${hang2(`<g transform="translate(0 40)">${sandGlass(c, 60)}</g>`, 0.01, 300)}</g>`);
    courtFront(S, { xs: [200, 1400] });

    const JX = 780;
    return (t, time) => {
      const T = time;
      swing(TC.sunEl, 1300, 250 + es(t, 5.9, 7.5) * 300, T, 1, 0.6);
      swing(TC.cl1, 470, 140, T, 1.3, 0.6, 1);
      const night = es(t, 5.95, 6.4) * (1 - es(t, 7.5, 7.9) * 0.3);
      nightL.fade(night * 0.65);
      TC.sk.blend(EVE, DARK, night);

      /* v31 — witness about Himself alone: not true */
      const selfP = bump(t, 0.1, 0.95);
      const second = es(t, 1.1, 1.4);
      const setAside = bump(t, 4.05, 4.9);
      const open = es(t, 5.1, 5.4) * (1 - es(t, 5.95, 6.2));
      const up = es(t, 6.1, 6.4) * (1 - es(t, 7.0, 7.2));
      jesus.set({ x: JX, y: FLOOR + 12, s: 1.06, flip: false, armF: 20 + selfP * 50 + bump(t, 1.05, 1.9) * 40 + setAside * 80 + open * 60, armB: 10 + selfP * 20 + open * 70 + up * 100, head: -bump(t, 1.1, 2.0) * 8 - up * 12, blink: blinkAt(T, 1) });
      const tk = es(t, 0.15, 0.45, ease.out) * (1 - es(t, 2.85, 3.1, ease.in));
      vis(testimony, { x: 650, y: 220 - (1 - tk) * 480, r: Math.sin(T * 0.7) * 1.2, o: tk > 0.01 ? 1 : 0 });
      const qk = es(t, 0.45, 0.65, ease.back) * (1 - es(t, 1.1, 1.25));
      vis(qm, { x: 790, y: 270, s: qk * 1.3, r: 8, o: qk > 0.01 ? 1 : 0 });
      vis(emptyG, { x: BX + 75, y: FLOOR - 30, s: 0.7, o: (0.3 + bump(t, 0.3, 1.0) * 0.7) * (1 - second) });
      /* v32 — another testifies: the second seat fills with light; the seal */
      vis(seatLight, { x: BX + 75, y: FLOOR - 90, s: 0.5 + second * 0.6 + Math.sin(T * 1.2) * 0.02, r: T * 4, o: second * (1 - es(t, 3.9, 4.2) * 0.4) });
      const sk = es(t, 2.1, 2.3, ease.back);
      vis(sealEl, { x: 740, y: 220 + V.h * 0.5 - (1 - tk) * 480, s: lerp(2.2, 1, sk), o: sk > 0.01 ? tk : 0 });

      /* v33 — the envoys at the Jordan; John bears witness */
      const pk = es(t, 3.05, 3.4, ease.out);
      const away = es(t, 4.2, 4.95, ease.in);
      vis(pic, { x: 800 + away * 700, y: 150 - (1 - pk) * 520 - away * 200, r: Math.sin(T * 0.5) * 0.6 + away * 12, o: pk > 0.01 && away < 0.99 ? 1 : 0 });
      vis(janT, { x: 640 + away * 700, y: 170 - (1 - pk) * 520 - away * 200, r: Math.sin(T * 0.7) * 2, o: pk > 0.01 ? 1 : 0 });

      /* v34b — that you may be saved: small lights over them */
      LEAD.forEach((l, i) => {
        const [hx, hy] = headAt(l.x, FLOOR + 8 - (i % 2) * 6, 1, true);
        const k = es(t, 5.2 + i * 0.1, 5.45 + i * 0.1, ease.back) * (1 - es(t, 6.0, 6.3));
        vis(lights[i], { x: hx, y: hy - 48 + Math.sin(T * 2 + i) * 3, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* v35a — the burning and shining lamp; v35b — glad for a while, then it goes out */
      const lk = es(t, 6.05, 6.35, ease.out);
      const burn = 1 - es(t, 7.45, 7.85);
      pose(lamp, { x: 900, y: 240 - (1 - lk) * 520, r: Math.sin(T * 0.6) * 1.5, o: lk > 0.01 ? 1 : 0 });
      pose(flameEl, { x: 88, y: 82, sx: 1 + Math.sin(T * 9) * 0.05, sy: Math.max(0.02, burn * (1 + Math.sin(T * 7) * 0.06)), o: burn > 0.02 ? 1 : 0 });
      fade(glowEl, burn * (0.9 + Math.sin(T * 5) * 0.05));
      vis(lampT, { x: 960, y: 200 - (1 - lk) * 520, r: Math.sin(T * 0.7 + 1) * 1.5, o: lk > 0.01 ? 1 : 0 });
      const gk = es(t, 7.1, 7.3, ease.back) * (1 - es(t, 7.8, 7.95));
      vis(glass, { x: S.portrait ? 1105 : 1140, y: 150 - (1 - gk) * 420, o: gk > 0.01 ? 1 : 0 });
      const joy = es(t, 7.05, 7.25) * (1 - es(t, 7.55, 7.8));
      const drift = es(t, 7.6, 7.95);
      LEAD.forEach((l) => {
        const come = es(t, 4.9, 5.2) * 40;
        const x = l.x - come - joy * 40 + drift * 60;
        const y = FLOOR + 8 - (l.i % 2) * 6;
        const hop = joy * Math.abs(Math.sin(T * 5 + l.i)) * 8;
        l.p.set({ x, y: y - hop, s: 1, flip: drift < 0.5, armF: 20 + bump(t, 0.2, 0.9) * 30 + joy * 90, armB: 10 + joy * 150, head: -joy * 14, blink: blinkAt(T, l.seed) });
        attr(l.angry, 'opacity', (0.6 * (1 - joy)).toFixed(2));
      });
      folk.forEach((f) => {
        const x = f.x + (f.x < 1000 ? -1 : 1) * joy * -30 + drift * 50;
        f.p.set({ x, y: FLOOR + 14, s: 0.96, flip: f.x > 1000 ? drift < 0.5 : false, armF: 20 + joy * 110, armB: 10 + joy * 150, head: -joy * 12, bob: -joy * Math.abs(Math.sin(T * 5 + f.i * 2)) * 8, blink: blinkAt(T, f.seed) });
      });

      S.cam.x = kf(t, [[0, -60], [1.0, -60], [2.0, -60], [3.0, 0], [4.0, 0], [5.0, 60], [6.0, 60], [6.5, 60], [7.5, 60]]);
      S.cam.y = kf(t, [[0, -10], [1.0, -20], [2.0, -30], [3.0, -60], [4.2, 0], [5.0, 20], [6.0, -30], [7.0, -20]]);
      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.12], [2.0, 1.08], [3.0, 1.02], [4.2, 1.06], [5.0, 1.12], [6.0, 1.04], [7.0, 1.06]]);
    };
  },
};
