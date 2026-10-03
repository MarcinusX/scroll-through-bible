// Łk 9,57–60 — further along the road to Jerusalem, a bank beside it with a fox's hole and a small tree. A man runs up
// to Jesus with his arms wide: "I want to follow you wherever you go, Lord!" "The foxes have holes": evening falls and a
// fox trots along the bank and slips into its hole, which glows warm; "and the birds of the sky have nests": two birds
// fly home to the nest in the tree; "but the Son of Man has no place to lay His head": Jesus sits down on the bare
// ground by the road under the first stars, His head on His hand — and the eager man backs away. Morning: "Follow me!"
// — He beckons to another at the roadside. "Lord, allow me first to go and bury my father": the man points back, where
// far off on the hill a small grey funeral goes to the tombs. "Leave the dead to bury their own dead, but you go and
// announce God's Kingdom": the grey procession fades away, a crown of light hangs over the road ahead, and the man
// sets off up the road with the good news flying from his hands.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { bird } from '../../assets/things.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { flap } from '../kit.js';
import { roadSet, ROAD9, TW9, EAGER, MOURNER, fox, bubble, lightCrown, labelTag, wordSlip, figure, halo, kf, headAt, tr, PI } from './lib.js';

const { JX, JY } = ROAD9;
const [DX, DY] = ROAD9.DEN, [NX, NY] = ROAD9.NEST;

export default {
  id: 'lk9-foxes',
  beats: [
    { v: 57 },
    { v: 58 },
    { v: 59, text: 'Do innego rzekł: «Pójdź za Mną!»' },
    { v: 59, cont: true, text: 'Ten zaś odpowiedział: «Panie, pozwól mi najpierw pójść i pogrzebać mojego ojca!»' },
    { v: 60 },
  ],
  cam: { x: [-150, 260], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const R = roadSet(S, { village: false, bank: true });
    const c = S.c;
    /* the funeral far off on the hill (v59b) */
    const funL = S.layer({ par: 0.2, sh: 3 });
    funL.el.parentNode.insertBefore(funL.el, R.mid.el.nextSibling);
    const grey = (o) => ({ ...o, robe: mix(o.robe, C.stone2, 0.5), mantle: o.mantle ? mix(o.mantle, C.storm, 0.4) : null });
    const bier = sheet().p(c.cut(c.rect(-60, -128, 120, 8), 0.3, 5), C.wood2).p(c.cut([[-54, -128], [-50, -146], [48, -148], [54, -128]], 0.5, 5), C.linen2).out();
    const mourners = [-45, -15, 15, 45].map((x, i) => figure(c, grey({ ...MOURNER, hair: [C.hair3, C.greyHair, C.hair, C.hair2][i] }), { x, y: 0, s: 0.72, armF: 150, armB: 150, head: 6 })).join('');
    const funeral = funL.add(`<g opacity="0"><g transform="scale(.5)">${bier}${mourners}${figure(c, grey({ robe: C.stone, hairStyle: 'veil', veil: C.storm2, beard: 'none', skin: C.skin2, hair: C.hair3 }), { x: 110, y: 4, s: 0.72, armF: 80, head: 10 })}</g></g>`);
    const tomb = funL.add(`<g opacity="0"><path d="${c.cut([[-40, 0], [-40, -30], [-20, -46], [20, -46], [40, -30], [40, 0]], 0.6, 6)}" fill="${C.rock2}"/><path d="${c.cut(c.ell(0, -18, 12, 16, 12), 0.3, 4)}" fill="${mix(C.soilDark, C.night, 0.3)}"/></g>`);

    /* the fox, the birds */
    const animals = S.layer({ par: 0.5, sh: 4 });
    animals.el.parentNode.insertBefore(animals.el, R.bankL.el);
    const foxEl = animals.add(`<g>${fox(c)}</g>`);
    const flyL = S.layer({ par: 0.5, sh: 4 });
    const BIRDS = [0, 1].map((i) => ({ i, el: flyL.add(bird(c, { color: i ? C.bird : shade(C.bird, 0.2) })) }));

    /* people */
    const act = S.layer({ par: 0.45, sh: 5 });
    const DIS = [{ k: 'peter', x: 610, y: 744 }, { k: 'john', x: 540, y: 764 }].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, TW9[d.k]))) }));
    const eager = S.puppet(act.add(person(c, EAGER)));
    const glowL = S.layer({ par: 0.45, sh: 1, flat: true });
    glowL.el.parentNode.insertBefore(glowL.el, act.el);
    const aura = glowL.add(`<g>${halo(140, 0.8)}</g>`);
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const other = S.puppet(act.add(person(c, MOURNER)));
    const fx = S.layer({ par: 0.45, sh: 4 });
    const eagerSays = fx.add(`<g opacity="0">${bubble(c, [tr('Pójdę za Tobą,', 'I will follow you'), tr('dokądkolwiek się udasz!', 'wherever you go!')], { size: 18, tail: -1 })}</g>`);
    const follow = fx.add(`<g opacity="0">${bubble(c, tr('Pójdź za Mną!', 'Follow me!'), { size: 21, tail: 1 })}</g>`);
    const first = fx.add(`<g opacity="0">${bubble(c, [tr('Panie, pozwól mi najpierw', 'Lord, allow me first'), tr('pogrzebać mojego ojca!', 'to bury my father.')], { size: 17, tail: -1 })}</g>`);
    const kingdom = hanging(fx, `<g>${lightCrown(c, 34)}</g><g transform="translate(0 64)">${labelTag(tr('królestwo Boże', 'God’s Kingdom'), 17)}</g>`, { x: 0, y: -1500, len: 1000 });
    const WORDS = Array.from({ length: 4 }, (_, i) => ({ i, el: fx.add(`<g opacity="0">${wordSlip(c, 20)}</g>`) }));

    return (t, time) => {
      const T = time;
      /* evening falls in v58, the night goes in v59 */
      const night = es(t, 1.05, 1.5) * (1 - es(t, 2.0, 2.4));
      R.update(T, { eveK: 0.3 + night * 0.5, nightK: night, sunK: es(t, 0.8, 1.3) * (1 - es(t, 2.0, 2.4)), moonK: night });
      pose(R.cityGlow, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 20, s: 1, o: 0.6 + es(t, 4.1, 4.4) * 0.4 });
      pose(R.rays, { x: ROAD9.CITY[0], y: ROAD9.CITY[1] - 30, o: 0.4 + es(t, 4.1, 4.4) * 0.4 });

      /* v57 — "wherever you go!" */
      const run = es(t, 0.02, 0.35, (u) => u);
      const back = es(t, 1.6, 2.0);
      const ex = lerp(1180, 900, run) + back * 280;
      eager.set({ x: ex, y: JY - 8, s: 0.98, flip: back === 0, walk: (run > 0 && run < 1) || (back > 0 && back < 1) ? t * 18 : undefined, amt: 1.2, armF: 20 + bump(t, 0.3, 1.0) * 90, armB: 20 + bump(t, 0.3, 1.0) * 110, head: -4 + bump(t, 1.3, 1.7) * 10, o: 1 - es(t, 1.9, 2.0), blink: blinkAt(T, 5) });
      const [ehx, ehy] = headAt(ex, JY - 8, 0.98, true);
      const ek = es(t, 0.3, 0.45, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(eagerSays, { x: ehx - 20, y: ehy - 30, s: ek, o: ek > 0.01 ? 1 : 0 });

      /* v58 — the fox to its hole, the birds to their nest, the Son of Man on the bare ground */
      const trot = seg(t, 1.05, 1.4);
      const inDen = es(t, 1.38, 1.5);
      const fx0 = lerp(1320, DX, trot);
      pose(foxEl, { x: fx0, y: lerp(660, DY + 20, inDen) - (trot > 0 && trot < 1 ? Math.abs(Math.sin(t * 60)) * 5 : 0), s: lerp(0.8, 0.46, inDen), sx: -1, o: 1 });
      pose(R.denGlow, { x: DX, y: DY, o: es(t, 1.5, 1.7) * (1 - es(t, 2.1, 2.4)) * 0.8 });
      BIRDS.forEach((b) => {
        const k = seg(t, 1.15 + b.i * 0.08, 1.55 + b.i * 0.08);
        pose(b.el, { x: lerp(1500 + b.i * 80, NX + (b.i ? 10 : -12), ease.out(k)), y: lerp(240 - b.i * 40, NY - 12, k) - Math.sin(k * PI) * 30, s: 0.6, sx: -1, o: k > 0 ? 1 : 0 });
        if (k > 0 && k < 1) flap(b.el, t * 60 + b.i); else { pose(b.el.querySelector('.wingF'), { x: -2, y: -5 }); pose(b.el.querySelector('.wingB'), { x: -2, y: -6 }); }
      });
      const sit = es(t, 1.55, 1.62) * (1 - es(t, 2.02, 2.08));
      jesus.set({ x: JX, y: JY, s: 1.04, o: 1 - sit, flip: t > 2.0 && t < 3.1, armF: 20 + bump(t, 2.05, 2.9) * 70 + bump(t, 4.05, 4.9) * 90, armB: 10 + bump(t, 2.05, 2.9) * 80, head: -2, blink: blinkAt(T, 1) });
      jSit.set({ x: JX, y: JY + 4, s: 1.04, o: sit, armF: 150, armB: 40, head: 16, lean: 10, blink: 0 });
      pose(aura, { x: JX, y: JY - 150, o: 0.7 });
      DIS.forEach((d) => d.p.set({ x: d.x, y: d.y, s: 0.98, armF: 20, head: -4 + night * 10, blink: blinkAt(T, d.seed) }));

      /* v59 — "Follow me!" — "let me first bury my father" */
      const came = es(t, 1.95, 2.2);
      const point = bump(t, 3.1, 3.95);
      const go = es(t, 4.1, 4.8, (u) => u);
      const ox = lerp(460, 480, came) + go * 540;
      const oy = JY + 36 - go * 60;
      other.set({ x: ox, y: oy, s: 1.0 - go * 0.2, flip: go > 0 ? false : point > 0.1 ? true : false, walk: go > 0 && go < 1 ? t * 16 : undefined, o: came, armF: 20 + point * 90 + go * 60, armB: 10 + point * 30, head: -4 + point * -6, blink: blinkAt(T, 7) });
      const [jhx, jhy] = headAt(JX, JY, 1.04, true);
      const fk = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(follow, { x: jhx - 30, y: jhy - 30, s: fk, o: fk > 0.01 ? 1 : 0 });
      const [ohx, ohy] = headAt(ox, oy, 1.0, true);
      const bk = es(t, 3.1, 3.25, ease.back) * (1 - es(t, 3.95, 4.05));
      pose(first, { x: ohx + 120, y: ohy - 50, s: bk, o: bk > 0.01 ? 1 : 0 });
      const fun = es(t, 3.15, 3.45) * (1 - es(t, 4.05, 4.5));
      const walkF = seg(t, 3.15, 4.4);
      pose(funeral, { x: lerp(420, 500, walkF), y: 552, o: fun });
      pose(tomb, { x: 590, y: 548, o: fun });

      /* v60 — let the dead bury their dead; go and proclaim the Kingdom */
      const kk = es(t, 4.1, 4.4, ease.back);
      pose(kingdom, { x: 930, y: lerp(-1500, 300, kk), r: Math.sin(T * 0.8) * 2, oy: 0, o: kk > 0.002 ? 1 : 0 });
      WORDS.forEach((w) => {
        const q = T ? (T * 0.6 + w.i / 4) % 1 : (w.i + 0.5) / 4;
        pose(w.el, { x: ox + 30 + q * 80, y: oy - 150 - q * 60, s: 0.7, r: Math.sin(T * 2 + w.i) * 10, o: es(t, 4.5, 4.7) * Math.sin(q * PI) });
      });

      // phone: the camera turns right to the fox's hole and the nest (v58), then left to the man who would first bury his father (v59b)
      S.cam.x = S.portrait ? kf(t, [[0, 10], [1.0, 260], [2.0, 260], [2.5, -150], [4.2, -150], [4.8, 10]]) : kf(t, [[0, 10], [1.0, 20], [2.0, 20], [2.5, -20], [4.2, -20], [4.8, 10]]);
      S.cam.z = kf(t, [[0, 1.06], [1.0, 1.06], [1.5, 1.1], [2.0, 1.1], [2.5, 1.06]]);
      S.cam.y = kf(t, [[0, 30], [2.5, 30]]);
    };
  },
};
