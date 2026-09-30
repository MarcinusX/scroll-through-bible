// The four living creatures of the evangelists (Ez 1, Ap 4), cut small for the book cards on the home page:
// a winged man for Matthew, a lion for Mark, an ox for Luke, an eagle for John. Each is drawn around (0, 0),
// about 120 wide and 110 tall, as one sheet (grain + paper shadow copies).
import { C } from './palette.js';
import { sheet } from '../core/paper.js';

const PI = Math.PI;

// a fan of feathers from (x, y): n tapering blades from angle a0 to a1, lengths l0 … l1
function fan(c, x, y, { n, a0, a1, l0, l1, w = 13 }) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = n > 1 ? i / (n - 1) : 0, a = a0 + (a1 - a0) * t, L = l0 + (l1 - l0) * t;
    const tip = [x + Math.cos(a) * L, y + Math.sin(a) * L];
    const mid = [x + Math.cos(a) * L * 0.55 + Math.cos(a + PI / 2) * 2, y + Math.sin(a) * L * 0.55 + Math.sin(a + PI / 2) * 2];
    d += c.ribbon(c.qbez([x, y], mid, tip, 8), (u) => w * (1 - u * 0.75), 0.6);
  }
  return d;
}

/** Matthew: a man with wings, the halo behind his head. */
export function angel(c) {
  const s = sheet();
  const wing = C.linen, wing2 = C.plaster2;
  // wings, raised behind the shoulders
  for (const k of [-1, 1]) {
    s.p(fan(c, 8 * k, 4, { n: 5, a0: k < 0 ? PI + 0.95 : -0.95, a1: k < 0 ? PI + 0.05 : -0.05, l0: 58, l1: 44, w: 15 }), wing2);
    s.p(fan(c, 8 * k, 6, { n: 4, a0: k < 0 ? PI + 0.8 : -0.8, a1: k < 0 ? PI + 0.15 : -0.15, l0: 40, l1: 30, w: 13 }), wing);
  }
  s.p(c.cut(c.circ(0, -24, 23, 30), 0.5, 5), C.halo);
  s.p(c.hole(c.circ(0, -24, 19, 28), 0.3, 5) + c.cut(c.circ(0, -24, 23, 30), 0, 5), C.haloRim, 'opacity=".55"');
  // robe: a bell from the shoulders, the mantle over one side
  s.p(c.cut([[-15, -6], [15, -6], [23, 18], [31, 56], [-31, 56], [-23, 18]], 0.7, 6), C.dustyBlue);
  s.p(c.cut([[2, -6], [15, -6], [23, 18], [31, 56], [8, 56], [12, 22]], 0.6, 6), C.jesusMantle);
  s.p(c.cut([[-6, -8], [6, -8], [4, -1], [-4, -1]], 0.3, 3), C.skin2);
  // head, hair, face
  s.p(c.cut(c.circ(0, -22, 12.5, 22), 0.4, 4), C.skin);
  s.p(c.cut([...c.arc(0, -22, 13.5, 14, PI * 1.05, PI * 1.95, 12), [11, -20], [6, -30], [-6, -30], [-11, -20]], 0.5, 4), C.hair2);
  s.x(c.poly(c.ell(-4.6, -19.5, 1.3, 1.5, 8)) + c.poly(c.ell(4.6, -19.5, 1.3, 1.5, 8)), C.ink);
  s.x(c.poly(c.ell(-7.5, -15.5, 2.4, 1.5, 8)) + c.poly(c.ell(7.5, -15.5, 2.4, 1.5, 8)), C.blush, 'opacity=".55"');
  // hands folded over a small book
  s.p(c.cut(c.rect(-9, 16, 18, 13), 0.4, 4), C.terracotta);
  s.p(c.cut(c.ell(-7, 20, 4.5, 3.5, 10), 0.3, 3) + c.cut(c.ell(7, 20, 4.5, 3.5, 10), 0.3, 3), C.skin);
  return s.out();
}

/** Mark: the lion, full-maned, looking out. */
export function lion(c) {
  const s = sheet();
  const mane = '#b3672f', mane2 = '#cf8a45', fur = '#e7b46a', muzzle = '#f4dcb0';
  s.p(c.cut(c.star(0, 2, 60, 44, 16, -PI / 2), 1, 6), mane);
  s.p(c.cut(c.star(0, 3, 49, 38, 14, -PI / 2 + 0.2), 0.8, 6), mane2);
  // ears
  s.p(c.cut(c.circ(-23, -25, 9.5, 14), 0.4, 4) + c.cut(c.circ(23, -25, 9.5, 14), 0.4, 4), fur);
  s.x(c.poly(c.circ(-23, -25, 5, 10)) + c.poly(c.circ(23, -25, 5, 10)), '#c9774a');
  // face: broad brow narrowing to the chin
  s.p(c.cut([[-26, -20], [-12, -30], [12, -30], [26, -20], [29, 2], [18, 26], [0, 34], [-18, 26], [-29, 2]], 0.6, 5), fur);
  s.p(c.cut(c.ell(-9, 16, 12, 10, 14), 0.4, 4) + c.cut(c.ell(9, 16, 12, 10, 14), 0.4, 4), muzzle);
  s.p(c.cut(c.ell(0, 27, 8, 5, 12), 0.3, 3), muzzle);
  // nose, mouth, eyes, brows
  s.x(c.poly([[-8, 5], [8, 5], [3, 12], [-3, 12]]), '#5b3a28');
  s.x(c.ribbon([[0, 12], [0, 17], [-6, 21]], 1.6) + c.ribbon([[0, 17], [6, 21]], 1.6), '#5b3a28', 'opacity=".75"');
  s.x(c.poly(c.ell(-11, -8, 3.6, 2.4, 10)) + c.poly(c.ell(11, -8, 3.6, 2.4, 10)), '#3b2b1d');
  s.x(c.ribbon([[-17, -14], [-11, -16], [-5, -14]], 2) + c.ribbon([[17, -14], [11, -16], [5, -14]], 2), '#9a5526', 'opacity=".8"');
  s.x(c.ribbon([[0, -26], [0, -8]], 5), '#d9a059', 'opacity=".6"');
  return s.out();
}

/** Luke: the ox, head on, with long pale horns. */
export function ox(c) {
  const s = sheet();
  const hide = '#a8764f', hide2 = '#8b5e3c', horn = '#efe3c9', nose = '#e3b39a';
  // horns sweep out and up
  for (const k of [-1, 1]) s.p(c.ribbon(c.qbez([18 * k, -24], [52 * k, -24], [56 * k, -52], 14), (u) => 11 * (1 - u * 0.85), 0.4), horn);
  // ears, set below the horns
  for (const k of [-1, 1]) {
    const e = c.ell(38 * k, -8, 17, 7.5, 14, 0.35 * k);
    s.p(c.cut(e, 0.5, 4), hide2);
    s.x(c.poly(c.ell(37 * k, -8, 10, 3.6, 12, 0.35 * k)), nose, 'opacity=".75"');
  }
  // the long face
  s.p(c.cut([[-26, -34], [26, -34], [32, -14], [24, 18], [20, 40], [-20, 40], [-24, 18], [-32, -14]], 0.7, 5), hide);
  s.p(c.cut(c.blob(0, -31, 18, 8, 10, 0.25), 0.6, 4), hide2);
  s.p(c.cut([[-5, -24], [5, -24], [8, 10], [0, 16], [-8, 10]], 0.4, 4), horn);
  s.p(c.cut(c.ell(0, 36, 22, 13, 18), 0.5, 4), nose);
  s.x(c.poly(c.ell(-8, 36, 3.2, 4.5, 10, 0.3)) + c.poly(c.ell(8, 36, 3.2, 4.5, 10, -0.3)), '#6b4630');
  s.x(c.poly(c.ell(-16, -8, 3.4, 3.8, 10)) + c.poly(c.ell(16, -8, 3.4, 3.8, 10)), '#2f231a');
  s.x(c.poly(c.ell(-15, -9.4, 1, 1.1, 6)) + c.poly(c.ell(17, -9.4, 1, 1.1, 6)), '#fff6e2');
  return s.out();
}

/** John: the eagle, wings spread, looking up toward the light. */
export function eagle(c) {
  const s = sheet();
  const dark = '#6b4630', mid = '#8a5a36', light = '#b98552', head = '#f4ecdb', beak = '#e2a53a';
  for (const k of [-1, 1]) {
    const A = (a) => (k < 0 ? PI - a : a);
    s.p(fan(c, 9 * k, -6, { n: 6, a0: A(-0.62), a1: A(0.34), l0: 64, l1: 44, w: 14 }), dark);
    s.p(fan(c, 9 * k, -6, { n: 5, a0: A(-0.5), a1: A(0.26), l0: 42, l1: 30, w: 14 }), mid);
    s.p(fan(c, 8 * k, -6, { n: 3, a0: A(-0.3), a1: A(0.2), l0: 24, l1: 18, w: 13 }), light);
  }
  // tail and body
  s.p(fan(c, 0, 20, { n: 5, a0: PI / 2 - 0.4, a1: PI / 2 + 0.4, l0: 32, l1: 32, w: 11 }), dark);
  s.p(c.cut([...c.arc(0, 2, 15, 26, -PI * 0.1, PI * 1.1, 16), [-12, -14], [12, -14]], 0.6, 5), mid);
  s.p(c.cut(c.ell(0, 8, 9, 15, 14), 0.4, 4), light);
  for (const k of [-1, 1]) s.p(c.cut([[6 * k, 30], [12 * k, 30], [10 * k, 38], [4 * k, 38]], 0.3, 3), beak);
  // white head turned up and to the right, the hooked beak
  s.p(c.cut(c.blob(1, -24, 12, 13, 12, 0.08), 0.4, 4), head);
  s.p(c.cut([[8, -30], [21, -29], [18, -21], [11, -22]], 0.3, 3), beak);
  s.x(c.poly(c.ell(5, -28, 1.9, 2, 8)), '#2f231a');
  return s.out();
}

export const EMBLEMS = { angel, lion, ox, eagle };
