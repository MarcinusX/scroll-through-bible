// Mk 10,23–27 — Jesus looks round: how hard for the rich to enter the Kingdom (far off, the rich man's
// cart stops at a narrow gate of light — it will not fit). The disciples are amazed. Then the comic
// paper moment: a giant needle comes down from the flies and a camel loaded with treasure tries to
// squeeze through its eye — squash, bounce. "Then who can be saved?" — "With God all things are
// possible": light pours down, the camel shrinks, floats through the eye and lands on the other side.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, hanging, swing } from '../kit.js';
import { bush, rock, olive } from '../../assets/nature.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { roadSet, TWELVE, camel, walkCamel, bigNeedle, cart, sack, say, bang, qmark, headAt, sparkle, withFace, faceBits, face } from './lib.js';

const GY = 672;
const JX = 740;
const NX_W = 1010, NH = 340, NTIP = GY + 96;          // the needle: x, height, where its point is
const EYE_Y = NTIP - NH + 63;

/** a camel's load: two bulging sacks and a chest with gold; drawn in camel coords (facing right) */
function camelLoad(c) {
  const s = sheet();
  s.p(c.cut(c.blob(-44, -128, 30, 36, 12, 0.15), 0.8, 5) + c.cut(c.blob(22, -126, 28, 34, 12, 0.15), 0.8, 5), mix(C.basket, C.wood3, 0.4));
  s.p(c.cut(c.rect(-30, -196, 58, 40), 0.5, 5), C.wood2);
  s.p(c.cut(c.rect(-30, -196, 58, 8), 0.3, 4) + c.cut(c.rect(-6, -180, 10, 10), 0.2, 3), C.ochre);
  s.p(c.cut(c.circ(-14, -200, 6, 10), 0.2, 3) + c.cut(c.circ(-2, -203, 6, 10), 0.2, 3) + c.cut(c.circ(10, -200, 6, 10), 0.2, 3), C.sun);
  s.p(c.cut([[-8, -196], [0, -224], [8, -196]], 0.3, 4), C.plumRobe);
  return s.out();
}
/** the narrow gate of the Kingdom (a slit of light); origin: threshold */
function narrowGate(c, w = 26, h = 96) {
  const s = sheet();
  s.p(c.cut([[-w / 2 - 10, 2], [-w / 2 - 10, -h], ...c.arc(0, -h, w / 2 + 10, 20, Math.PI, 2 * Math.PI, 10), [w / 2 + 10, 2]], 0.5, 5), C.sun);
  s.x(c.cut([[-w / 2, 2], [-w / 2, -h + 4], ...c.arc(0, -h + 4, w / 2, 14, Math.PI, 2 * Math.PI, 10), [w / 2, 2]], 0.3, 4), '#fff6d6');
  return `<circle cy="${-h / 2}" r="${h}" fill="url(#halo-glow)"/>${s.out()}`;
}

export default {
  id: 'm10-camel',
  beats: [
    { v: 23, text: 'Wówczas Jezus spojrzał wokoło i rzekł do swoich uczniów:' },
    { v: 23, cont: true, text: '«Jak trudno jest bogatym wejść do królestwa Bożego».' },
    { v: 24, text: 'Uczniowie zdumieli się na Jego słowa,' },
    { v: 24, cont: true, text: 'lecz Jezus powtórnie rzekł im: «Dzieci, jakże trudno wejść do królestwa Bożego.' },
    { v: 25 },
    { v: 26, text: 'A oni tym bardziej się dziwili i mówili między sobą:' },
    { v: 26, cont: true, text: '«Któż więc może się zbawić?»' },
    { v: 27, text: 'Jezus spojrzał na nich i rzekł:' },
    { v: 27, cont: true, text: '«U ludzi to niemożliwe, ale nie u Boga; bo u Boga wszystko jest możliwe».' },
  ],
  cam: { x: [-40, 80], y: [-50, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    // phone: the needle stands nearer to Jesus and the camel is smaller, so both stay inside the screen;
    // the far gate comes in from under the thread; the needle waits higher, out of sight
    const NX = P ? 900 : NX_W, CS0 = P ? 0.66 : 0.86, NOSE = P ? 77 : 100, BOUNCE = P ? 40 : 60;
    const R = roadSet(S, { jer: 0.28, jerX: 1180, roadX: 860, trees: 18, clouds: [[480, 140, 170], [1020, 110, 120]] });
    const lightL = S.layer({ par: 0.04, sh: 1, flat: true });
    const heaven = lightL.add(`<g opacity="0">${rays(c, { n: 18, r0: 40, r1: 900, spread: 0.05, color: '#fff3cf' })}<circle r="260" fill="url(#halo-glow)"/></g>`);
    // far away on the road: the rich man and his cart, stopped at a narrow gate
    const farL = S.layer({ par: 0.3, sh: 2 });
    const gate = farL.add(`<g opacity="0">${narrowGate(c)}</g>`);
    const K = cart(c, 190);
    const tiny = farL.add(`<g>${K.body}<g transform="translate(-40 0)">${K.wheel}</g><g transform="translate(50 0)">${K.wheel}</g></g>`);
    const tinyMan = S.puppet(farL.add(person(c, { robe: mix(C.plumRobe, C.indigo, 0.18), mantle: C.ochre, hair: C.hair2, hairStyle: 'curly', beard: 'none' })));
    const side = S.layer({ par: 0.32, sh: 3 });
    side.add(olive(c, 290, 604, 1) + bush(c, 1380, 610, 70, C.sage, C.moss));

    /* the needle and the camel */
    const nL = S.layer({ par: 0.5, sh: 5 });
    const needle = hanging(nL, `<g transform="translate(0 ${NH})">${bigNeedle(c, NH)}</g><path d="${c.ribbon(c.cbez([0, 60], [30, 120], [-40, 200], [20, 300], 20), 2.4)}" fill="${C.terracotta}" opacity=".85"/>`, { x: NX, y: NTIP - NH, len: 900 });
    const eyeGlow = nL.add(`<g opacity="0"><circle r="60" fill="url(#halo-glow)"/></g>`);
    const cam_ = nL.add(`<g><g class="cm">${camel(c)}${camelLoad(c)}</g></g>`);
    const cm = cam_.querySelector('.cm');
    const sweat = [0, 1, 2].map(() => nL.add(`<g opacity="0"><path d="${c.cut([[0, -6], [3.2, 1], [0, 4], [-3.2, 1]], 0.1, 3)}" fill="${C.skyBlue2}"/></g>`));

    /* Jesus and the disciples */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const SPOT = [[430, GY - 40], [500, GY - 30], [570, GY - 42], [455, GY + 10], [530, GY + 20], [605, GY + 8], [650, GY - 36]];
    const DIS = [0, 3, 1, 2, 6, 7, 4].map((k, i) => {
      const el = pL.add(withFace(person(c, TWELVE[k].o), faceBits(c)));
      return { i, el, p: S.puppet(el), seed: c.rr(0, 9), x: SPOT[i][0], y: SPOT[i][1], s: 0.86 + (SPOT[i][1] - GY) / 400, flip: false };
    });
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const fxL = S.layer({ par: 0.5, sh: 6 });
    const bangs = DIS.map(() => fxL.add(`<g opacity="0">${bang(c)}</g>`));
    const who = fxL.add(`<g opacity="0">${say(c, tr(['Któż więc', 'może się zbawić?'], ['Then who', 'can be saved?']), { size: 19, side: 1 })}</g>`);
    const sparks = Array.from({ length: 6 }, () => fxL.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 200, 990, 220, C.sage, C.moss) + rock(c, 1420, 990, 200, 66, C.rock2));

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 9) * 30 });

      /* beat 0–1: he looks around; far off, the rich man's cart cannot pass the narrow gate */
      const lookK = seg(t, 0.05, 0.9);
      const looking = lookK > 0 && lookK < 1;
      const gx = P ? 1060 : 1150, gy = R.gy(gx) + 6;
      pose(gate, { x: gx, y: gy, s: 0.8, o: es(t, 1.0, 1.3) * (1 - es(t, 3.9, 4.2)) });
      const roll = es(t, -0.5, 1.5);
      const tx = lerp(P ? 840 : 900, gx - 70, roll);
      const jam = bump(t, 1.45, 1.75) * 5;
      pose(tiny, { x: tx + jam, y: gy - 10, s: 0.26, o: 1 - es(t, 3.9, 4.2) });
      tinyMan.set({ x: tx + 46 + jam, y: gy, s: 0.26, o: 1 - es(t, 3.9, 4.2), walk: roll > 0 && roll < 1 ? tx * 0.2 : undefined, lean: 10, armF: 70, armB: 60 });

      /* the disciples: amazed (2), more astonished (5), asking (6) */
      const amazed = es(t, 2.02, 2.3), more = es(t, 5.02, 5.3);
      DIS.forEach((d) => {
        const lookUp = es(t, 4.0, 4.3) * (1 - es(t, 5.0, 5.2));
        const hands = amazed * (1 - es(t, 2.9, 3.2)) + more;
        const talk = d.i % 2 ? bump(t, 5.2 + d.i * 0.05, 6.6) : 0;
        d.p.set({ x: d.x, y: d.y, s: d.s, flip: d.flip || (talk > 0.5 && d.i % 3 === 0), armF: 12 + hands * (d.i % 2 ? 70 : 40) + es(t, 8.1, 8.4) * 30, armB: hands * (d.i % 2 ? 120 : 150) * 0.8, head: -hands * 8 - lookUp * 6 + talk * 6, lean: -hands * 2, blink: blinkAt(T, d.seed) });
        face(d.el, 'sad', (amazed * (1 - es(t, 3, 3.3)) + more * (1 - es(t, 8.1, 8.4))) * 0.8);
        const [hx, hy] = headAt(d.x, d.y, d.s, d.flip);
        const bOn = bump(t, 2.05, 3.0) + bump(t, 5.05, 6.2);
        pose(bangs[d.i], { x: hx + (d.i % 2 ? 8 : -6), y: hy - 42 - bOn * 6, s: Math.min(1, bOn * 2), r: (d.i % 2 ? 10 : -10), o: bOn > 0.02 ? 1 : 0 });
      });
      pose(who, { x: 600, y: GY - 205, s: es(t, 6.02, 6.25, ease.back), o: t > 6.02 && t < 7.1 ? 1 - es(t, 6.9, 7.1) : 0 });

      /* Jesus */
      const lookFlip = looking ? Math.sin(lookK * Math.PI * 2) > 0 : false;
      const again = es(t, 3.02, 3.3) * (1 - es(t, 3.9, 4.1));
      const toNeedle = es(t, 4.0, 4.3) * (1 - es(t, 4.9, 5.1));
      const toThem = es(t, 7.02, 7.3);
      const up = es(t, 8.02, 8.3);
      jesus.set({ x: JX, y: GY, s: 1.02, flip: lookFlip || (toThem > 0.5 && up < 0.5), armF: 18 + bump(t, 1.05, 1.9) * 60 + again * 80 + toNeedle * 80 + up * 40, armB: again * 110 + up * 160, head: (looking ? Math.sin(lookK * Math.PI * 4) * 5 : 0) - again * 4 - up * 10 + Math.sin(T * 0.6), blink: blinkAt(T) });

      /* beat 4: the needle comes down; the loaded camel tries to squeeze through its eye */
      const nd = es(t, 3.95, 4.25, ease.back);
      swing(needle, NX, NTIP - NH - (1 - nd) * (P ? 1300 : 800), T, 0.6, 0.6);
      const walkIn = es(t, 4.05, 4.4);
      const push = bump(t, 4.35, 4.65);
      const bounce = es(t, 4.6, 4.8, ease.back) * (1 - es(t, 8.1, 8.2));
      // beat 8: lifted in light, shrinks, floats through the eye and lands on the other side
      const lift = es(t, 8.15, 8.45), through = es(t, 8.45, 8.65), land = es(t, 8.65, 8.9);
      const nose = NOSE;
      let cx = lerp(1500, NX + nose, walkIn) - push * 14 + bounce * BOUNCE, cy = GY;
      let cs = CS0;
      cx = lerp(cx, NX + 30, lift); cy = lerp(cy, EYE_Y + 10, lift); cs = lerp(cs, 0.1, lift);
      cx = lerp(cx, NX - 30, through);
      cx = lerp(cx, NX - 110, land); cy = lerp(cy, GY + 30, land); cs = lerp(cs, 0.62, land);
      pose(cam_, { x: cx, y: cy - Math.sin(through * Math.PI) * 6, s: cs });
      pose(cm, { sx: -1 - push * -0.18, sy: 1 + push * 0.06 });
      const walking = (walkIn > 0 && walkIn < 1) || (bounce > 0.02 && bounce < 0.98);
      walkCamel(cam_, walking ? T * 7 : 0, walking ? 1 : 0);
      sweat.forEach((sw, i) => pose(sw, { x: NX + nose + 40 + i * 14, y: GY - 200 - i * 10 - bump(t, 4.5, 4.95) * 16, o: bump(t, 4.45, 4.95) * (i === 1 ? 0.8 : 1), r: 20 * (i - 1) }));
      pose(eyeGlow, { x: NX, y: EYE_Y, s: 0.6 + lift * 0.8, o: bump(t, 8.1, 9.2) });
      pose(heaven, { x: NX - 60, y: -60, s: 0.7 + up * 0.3, r: t * 6, o: up * 0.55 });
      sparks.forEach((sp, i) => {
        const k = T ? (T * 0.5 + i / 6) % 1 : 0.4;
        pose(sp, { x: NX - 150 + i * 36, y: GY - 60 - k * 120 - (i % 2) * 30, s: 0.7, o: es(t, 8.65, 8.9) * Math.sin(k * Math.PI) });
      });

      S.cam.x = es(t, 3.9, 4.3) * 60 * (1 - es(t, 5, 5.4)) + es(t, 7.9, 8.3) * 50;
      S.cam.z = 1 + es(t, 3.9, 4.3) * 0.06 - es(t, 5, 5.4) * 0.06;
      S.cam.y = -es(t, 7.9, 8.3) * 30;
    };
  },
};
