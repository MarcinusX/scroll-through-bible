// Łk 21,16–17 — a painted flat of a home: the lamp in its niche, the door, and the disciple among his own — his father,
// his mother, his brother and a friend round him. "You will be handed over even by parents, brothers, relatives and
// friends": one by one they turn their backs on him and point him out to a soldier who comes in at the door; "they will
// cause some of you to be put to death": the room goes dim, he kneels, his little lamp goes out — and a crown of light
// comes to rest above him. "You will be hated by all for my name's sake": the flat flies up and another comes down —
// a small band of His disciples on a hilltop holding up a light, and crowds on both sides, every hand pointed at them.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  templeTeach, TT, flat, flatSky, flatHills, WITNESS, WITNESS2, roman, lightCrown, crowdKnot, wordTag, headAt, handAt, warm,
  es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY, JX, JS } = TT;
const W = 580, H = 280, FX = 800, FY = 300;
const GL = 108, FS = 0.62;
const FATHER = { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wrap', veil: C.stone, beard: 'full', beardColor: C.greyHair, skin: C.skin3, belt: C.leather };
const MOTHER = { robe: C.mauve, mantle: C.plumRobe, hairStyle: 'veil', veil: C.linen2, veil2: C.stone2, hair: C.greyHair, skin: C.skin3, belt: null };
const BROTHER = { robe: C.tealRobe, hair: C.hair2, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.rope };
const FRIEND = { robe: C.ochreRobe, mantle: C.sageRobe, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin4, belt: C.leather };

function room(c) {
  const s = sheet();
  s.p(c.cut([[-W / 2 - 4, -H / 2 - 4], [W / 2 + 4, -H / 2 - 4], [W / 2 + 4, GL], [-W / 2 - 4, GL]], 0.5, 10), mix(C.plaster, C.sand2, 0.3));
  let patch = '';
  for (let i = 0; i < 8; i++) patch += c.cut(c.blob(c.rr(-260, 260), c.rr(-120, 60), c.rr(20, 40), c.rr(8, 16), 10, 0.2), 0.5, 6);
  s.x(patch, C.plaster2, 'opacity=".6"');
  s.p(c.cut([[180, GL], [180, -40], ...c.arc(222, -40, 42, 40, PI, 2 * PI, 10), [264, GL]], 0.4, 6), mix(C.soilDark, C.wood2, 0.4));
  s.p(c.cut([[-240, -30], [-240, -60], ...c.arc(-218, -60, 22, 20, PI, 2 * PI, 8), [-196, -30]], 0.4, 5), mix(C.soilDark, C.wood2, 0.3));
  s.p(c.cut([[-W / 2 - 4, GL], [W / 2 + 4, GL], [W / 2 + 4, H / 2 + 4], [-W / 2 - 4, H / 2 + 4]], 0.5, 10), mix(C.stone2, C.sand2, 0.5));
  return s.out() + `<g transform="translate(-218 -36)">${warm(40, 0.8)}<path d="M-10 4L10 4L6 -2L-6 -2Z" fill="${C.pot}"/><path d="M4 -2C1 -6 1 -11 4 -16C7 -11 7 -6 4 -2Z" fill="${C.lampFlame}"/></g>`;
}
function hill(S, c) {
  return flatSky(S, W, H, ['#d9c3a8', '#f2dcb8']) + flatHills(c, W, 40, mix(C.hillMid, C.sage, 0.3), 12) + sheet().p(c.cut([[-90, GL + 4], [-60, 50], [0, 34], [60, 50], [90, GL + 4]], 0.6, 6), mix(C.hillNear, C.sand, 0.2)).out();
}

export default {
  id: 'lk21-family',
  beats: [
    { v: 16 },
    { v: 17 },
  ],
  cam: { x: [-20, 20], y: [-50, 30], z: [1, 1.08] },
  build(S) {
    const T0 = templeTeach(S);
    const c = S.c;
    const B = T0.bits;
    const flatA = T0.FL.add(flat(S, room(c), { w: W, h: H }));
    const dimA = B.add(`<g><rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" fill="${mix(C.night2, C.indigo, 0.3)}" opacity=".5"/></g>`);
    const FAM = [[FATHER, -200], [MOTHER, -120], [BROTHER, 60], [FRIEND, 130]].map(([o, x], i) => ({ i, x, p: S.puppet(B.add(person(c, o))), seed: c.rr(0, 9) }));
    const wit = S.puppet(B.add(person(c, WITNESS)));
    const witK = S.puppet(B.add(person(c, { ...WITNESS, pose: 'kneel' })));
    const lamp = B.add(`<g>${warm(22, 0.9)}<path d="M-8 3L8 3L5 -2L-5 -2Z" fill="${C.pot}"/><path class="fl" d="M3 -2C0 -6 0 -11 3 -16C6 -11 6 -6 3 -2Z" fill="${C.lampFlame}"/></g>`);
    const guard = S.puppet(B.add(roman(c, 0)));
    const crownEl = B.add(`<g>${lightCrown(c, 22)}</g>`);

    /* the second flat: the hill, the little band, the crowds */
    const flatB = T0.FL.add(flat(S, hill(S, c), { w: W, h: H }));
    const band = B.add(`<g>${crowdKnot('lk21-band', 3, { s: FS * 0.9, spread: 30, rows: 1, arms: [40, 60], armB: [100, 130], head: [-10, -6], women: null }).m}</g>`);
    const bandLight = B.add(`<g>${warm(22, 0.9)}<path d="M-9 4L9 4L6 -2L-6 -2Z" fill="${C.pot}"/><path d="M3 -2C-1 -7 -1 -13 3 -19C7 -13 7 -7 3 -2Z" fill="${C.lampFlame}"/></g>`);
    const mobL = B.add(`<g>${crowdKnot('lk21-mobL', 8, { s: FS * 0.86, spread: 30, rows: 2, flip: false, arms: [85, 115], armB: [0, 30], head: [-6, 0] }).m}</g>`);
    const mobR = B.add(`<g>${crowdKnot('lk21-mobR', 8, { s: FS * 0.86, spread: 30, rows: 2, flip: true, arms: [85, 115], armB: [0, 30], head: [-6, 0] }).m}</g>`);
    const nameTag = B.add(`<g>${wordTag(c, tr('z powodu mojego imienia', 'for my name’s sake'), { size: 17 })}</g>`);

    return (t, time) => {
      const T = time;
      T0.update(t, T, { look: es(t, 0.1, 0.4) });
      const sad = es(t, 0.05, 0.3);
      T0.jesus.set({ x: JX, y: GY, s: JS, armF: 20 + sad * 40, armB: 10 + bump(t, 1.02, 1.8) * 40, head: sad * 8, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, JS, false);
      T0.voice(hx, hy, 0.6 * es(t, 0.02, 0.2), T, { spread: 1.6 });

      /* flat A — the home */
      const kA = es(t, 0.0, 0.2, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      const ay = lerp(-1300, FY, kA), onA = kA > 0.002 ? 1 : 0;
      pose(flatA, { x: FX, y: ay, o: onA });
      const PA = (lx, ly) => [FX + lx, ay + ly];
      const dim = es(t, 0.6, 0.72);
      pose(dimA, { x: FX, y: ay, o: onA * dim * 0.9 });
      FAM.forEach((f) => {
        const turn = es(t, 0.22 + f.i * 0.07, 0.26 + f.i * 0.07);
        const [x, y] = PA(f.x + (f.x < 0 ? -1 : 1) * turn * 18, GL);
        const faceW = f.x < 0 ? false : true;           // at first they face him
        const flip = turn > 0.5 ? !faceW : faceW;
        // they point back at him (or to the guard at the door)
        f.p.set({ x, y, s: FS, flip, o: onA, armF: 10 + es(t, 0.4, 0.5) * (f.x < 0 ? 0 : 90), armB: es(t, 0.4, 0.5) * (f.x < 0 ? 40 : 0), head: turn * 6, blink: blinkAt(T, f.seed) });
      });
      const kneel = es(t, 0.62, 0.66);
      const [wx, wy] = PA(-30, GL);
      wit.set({ x: wx, y: wy, s: FS, flip: false, o: onA * (1 - kneel), armF: 50, head: -4 + es(t, 0.25, 0.45) * 10, blink: blinkAt(T, 3) });
      witK.set({ x: wx + 4, y: wy, s: FS, flip: false, o: onA * kneel, armF: 60, armB: 120, head: -12, blink: blinkAt(T, 3) });
      const [lx, ly] = handAt(wx, wy, FS, false, 50);
      const out = es(t, 0.62, 0.7);
      pose(lamp, { x: lx, y: ly - 2, s: 0.9, o: onA * (1 - out) });
      const gk = es(t, 0.35, 0.6);
      const [gx, gy] = PA(lerp(300, 200, gk), GL);
      guard.set({ x: gx, y: gy, s: FS, flip: true, o: onA * (gk > 0.01 ? 1 : 0), walk: gk > 0 && gk < 1 ? gx * 0.08 : undefined, armF: 30, blink: blinkAt(T, 9) });
      const ck = es(t, 0.72, 0.9, ease.out);
      pose(crownEl, { x: wx + 6, y: lerp(ay - 60, wy - 128 * FS, ck), s: 0.8, o: onA * ck });

      /* flat B — hated by all, for my name */
      const kB = es(t, 1.1, 1.32, ease.out);
      const by = lerp(-1300, FY, kB), onB = kB > 0.002 ? 1 : 0;
      pose(flatB, { x: FX, y: by, o: onB });
      pose(band, { x: FX, y: by + 52, o: onB });
      pose(bandLight, { x: FX + 4, y: by - 92 + (T ? Math.sin(T * 5) * 1.5 : 0), s: 1 + es(t, 1.3, 1.5) * 0.3, o: onB });
      const mob = es(t, 1.3, 1.6, ease.out);
      pose(mobL, { x: lerp(FX - 215, FX - 185, mob), y: by + GL, o: onB * es(t, 1.3, 1.37) });
      pose(mobR, { x: lerp(FX + 215, FX + 185, mob), y: by + GL, o: onB * es(t, 1.3, 1.37) });
      const nt = es(t, 1.5, 1.65, ease.back);
      pose(nameTag, { x: FX, y: by - 98, s: nt, o: onB * (nt > 0.02 ? 1 : 0) });

      S.cam.y = -es(t, 0.0, 0.4) * 30;
      S.cam.z = 1 + es(t, 0.0, 0.4) * 0.04;
      void WITNESS2; void seg; void shade;
    };
  },
};
