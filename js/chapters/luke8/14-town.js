// Łk 8,34–36 — the herdsmen run for the town on the hill and the farms round about, and "!" after "!" pops up over
// the rooftops as they tell it. The people come out of the town gate and down to the shore to see — and there is the
// man who had the demons, clothed now and in his right mind, sitting quietly at Jesus' feet. Fear takes hold of them:
// they shrink back. Those who saw it tell how he was healed: a speech bubble with three little pictures — the broken
// chains, the pigs rushing into the lake, the man sitting clothed.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { boat } from '../../assets/things.js';
import { cypress, house } from '../../assets/nature.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { gerasaShore, HEALED, L5, knot, walledTown, glyphTag, chain, link, pig, bubble, headAt, still, staff, figure, tr, PI } from './lib.js';

const JX = 660, FEET = 704, MX = 740;

/** the witness's story: three little pictures in one speech bubble (origin at the tail) */
function storyBubble(c) {
  const s = sheet();
  s.p(c.cut(c.blob(0, -80, 170, 58, 22, 0.04), 0.5, 6), C.cream);
  s.p(c.cut([[-30, -30], [-60, 0], [-10, -26]], 0.3, 4), C.cream);
  const arrow = (x) => `<path d="${c.cut([[x - 10, -84], [x + 4, -84], [x + 4, -90], [x + 12, -80], [x + 4, -70], [x + 4, -76], [x - 10, -76]], 0.2, 3)}" fill="${C.terracotta}"/>`;
  const chainI = `<g transform="translate(-118 -84) rotate(-10)">${chain(c, 3, 6)}</g><g transform="translate(-86 -76) rotate(30)">${link(c, 6)}</g><g transform="translate(-120 -58) rotate(-40)">${link(c, 6)}</g>`;
  const pigsI = `<g transform="translate(-14 -70) rotate(30)">${pig(c)}</g><g transform="translate(12 -60) rotate(38)">${pig(c)}</g><path d="${c.ribbon([[-26, -44], [36, -44]], 3)}" fill="${C.lake2}"/>`;
  const manI = `<g transform="translate(104 -44) scale(.36)">${person(c, { ...HEALED, pose: 'sit' })}</g>`;
  return s.out() + chainI + arrow(-62) + pigsI + arrow(52) + manI;
}

export default {
  id: 'lk8-town',
  beats: [
    { v: 34 },
    { v: 35, text: 'Ludzie wyszli zobaczyć, co się stało.' },
    { v: 35, cont: true, text: 'Przyszli do Jezusa i zastali człowieka, z którego wyszły złe duchy, ubranego i przy zdrowych zmysłach, siedzącego u nóg Jezusa.' },
    { v: 35, cont: true, text: 'Strach ich ogarnął.' },
    { v: 36 },
  ],
  cam: { x: [-40, 60], y: [-40, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = gerasaShore(S, { skyCols: ['#bccfd3', '#efe0c4', '#f6e0bc'], sunAt: [1320, 190], sunR: 40 });

    /* the town up on the hillside to the right, with farms */
    const hillL = S.layer({ par: 0.3, sh: 3 });
    const TX = 1130, TY = 520;
    hillL.add(walledTown(c, TX, TY, 0.62) + house(c, 960, 566, 50, 36, { stairs: false }) + house(c, 1330, 470, 56, 40, { stairs: false }) + cypress(c, 1010, 560, 80));
    const bangs = [[TX, TY - 70, 0], [TX - 70, TY - 44, 0.06], [TX + 70, TY - 50, 0.1], [960, 520, 0.16], [1330, 420, 0.22]].map(([x, y, d]) => ({ d, x, y, el: hillL.add(`<g opacity="0">${glyphTag(c, '!', { size: 20 })}</g>`) }));

    /* the boat pulled up on the left, the disciples */
    const back = S.layer({ par: 0.45, sh: 4 });
    const B = boat(c, {});
    back.add(`<g transform="translate(390 730) scale(.88)">${B.back}${still(c, [CAST.james, CAST.andrew, CAST.john, CAST.peter].map((o, i) => ({ x: -110 + i * 56, y: 2, s: 0.92, flip: false, armF: 14 + (i % 2) * 20, armB: 8, head: -2, o })))}${B.front}</g>`);

    /* the herdsmen running, the townspeople coming */
    const runL = S.layer({ par: 0.3, sh: 4 });
    const runners = [L5.herdsman, L5.herdsman2].map((o, i) => ({ i, p: S.puppet(runL.add(person(c, { ...o, holdF: `<g transform="rotate(-30)">${staff(c, 170)}</g>` }))) }));
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    const GROUPS = [[1010, 690, 'a', 4], [1120, 716, 'b', 4], [1200, 676, 'c', 3], [930, 716, 'd', 3]].map(([x, y, k, n], i) => ({
      i, x, y,
      calm: crowdL.sprite(knot('lk8-town-' + k, n, { s: 0.9, spread: 38, rows: 1, flip: true }), x, y),
      fear: crowdL.sprite(knot('lk8-town-' + k, n, { s: 0.9, spread: 38, rows: 1, flip: true, arms: [140, 158], armB: [20, 50], head: [8, 14] }), x, y),
    }));

    /* Jesus and the healed man at His feet */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const glow = pL.add(`<g opacity="0"><ellipse cx="${(JX + MX) / 2}" cy="${FEET - 110}" rx="170" ry="150" fill="url(#halo-glow)"/></g>`);
    const jesus = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const man = S.puppet(pL.add(person(c, { ...HEALED, pose: 'sit' })));
    const witness = S.puppet(pL.add(person(c, { ...L5.herdsman2 })));
    const fx = S.layer({ par: 0.5, sh: 6 });
    const shiver = [0, 1, 2, 3].map(() => fx.add(`<g opacity="0"><path d="${c.ribbon([[-8, 0], [-2, -8], [4, 0], [10, -8]], 2.4)}" fill="${C.storm}"/></g>`));
    const story = fx.add(`<g opacity="0">${storyBubble(c)}</g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* v34 — the herdsmen flee and tell it in the town and the country */
      runners.forEach((r) => {
        const k = es(t, 0.02 + r.i * 0.08, 0.7 + r.i * 0.08, (u) => u);
        const x = lerp(560 + r.i * 50, 1080 + r.i * 50, k);
        r.p.set({ x, y: lerp(600, 540, k), s: 0.5, flip: false, o: 1 - es(t, 0.8, 0.95), walk: k > 0 && k < 1 ? x * 0.1 : undefined, amt: 1.6, armF: 60, armB: 140, head: -8, lean: 10 });
      });
      bangs.forEach((b) => { const k = es(t, 0.55 + b.d, 0.7 + b.d, ease.back) * (1 - es(t, 1.6, 1.8)); pose(b.el, { x: b.x, y: b.y, s: k, o: k > 0.02 ? 1 : 0 }); });

      /* v35a — the people come out to see */
      GROUPS.forEach((g) => {
        const k = es(t, 1.05 + g.i * 0.08, 1.8 + g.i * 0.06);
        const recoil = es(t, 3.05 + g.i * 0.03, 3.3 + g.i * 0.03);
        const x = lerp(TX + 20, g.x, k) + recoil * 40, y = lerp(TY + 10, g.y, k);
        const fear = es(t, 3.08 + g.i * 0.03, 3.14 + g.i * 0.03) * (1 - es(t, 4.05, 4.2));
        g.calm.set({ x, y: y - (k > 0 && k < 1 ? Math.abs(Math.sin(k * 30 + g.i)) * 3 : 0), s: lerp(0.7, 1, k), o: seg(t, 1.02, 1.1) * (1 - fear) });
        g.fear.set({ x, y, s: 1, o: fear });
      });
      shiver.forEach((sh, i) => { const g = GROUPS[i]; const k = es(t, 3.1, 3.25) * (1 - es(t, 4.05, 4.2)); pose(sh, { x: g.x + 40 + (T ? Math.sin(T * 20 + i) * 3 : 0), y: g.y - 200, s: k, o: k }); });

      /* v35b — clothed and in his right mind, sitting at His feet */
      const calmK = es(t, 2.05, 2.4);
      jesus.set({ x: JX, y: FEET, s: 1.02, armF: 16 + calmK * 30 + bump(t, 3.1, 3.9) * 20, armB: 8 + bump(t, 3.1, 3.9) * 20, head: 6 * calmK, blink: blinkAt(T) });
      man.set({ x: MX, y: FEET + 6, s: 1.0, flip: true, armF: 24, armB: 14, head: -4, blink: blinkAt(T, 4) });
      pose(glow, { o: 0.4 + calmK * 0.5 });

      /* v36 — those who saw tell how he was healed */
      const tell = es(t, 4.05, 4.3);
      witness.set({ x: 860, y: FEET + 10, s: 0.96, o: seg(t, 3.95, 4.05), armF: 30 + tell * 70 + (T ? Math.sin(T * 3) * 8 * tell : 0), armB: 10 + tell * 40, head: -4, blink: blinkAt(T, 8) });
      const sb = es(t, 4.15, 4.35, ease.back);
      const [whx, why] = headAt(860, FEET + 10, 0.96, false);
      pose(story, { x: whx + 50, y: why - 24, s: sb, o: sb > 0.02 ? 1 : 0 });

      S.cam.x = 40 - es(t, 1.9, 2.4) * 60 + es(t, 3.9, 4.2) * 40;
      S.cam.y = -20 + es(t, 0.9, 1.5) * 20 + es(t, 1.9, 2.4) * 10;
      S.cam.z = 1.02 + es(t, 1.9, 2.4) * 0.08 - es(t, 2.9, 3.2) * 0.06;
    };
  },
};
