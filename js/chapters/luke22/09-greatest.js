// Łk 22,24–26 — a dispute breaks out at the table: which of them is the greatest? Little paper crowns rise over the
// heads that argue, jostling higher. He answers with a painted flat: the kings of the nations enthroned under a
// canopy, their subjects bowed low, and a banner that calls them "Benefactor". "But not so with you" — the flat flies
// away and the crowns drop from their heads. "Let the greatest become as the youngest, and the leader as one who
// serves": two plates — a tall man bending down into a child's size, and a leader who puts down his staff for a jug
// and a towel.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  tableSet, NIGHTROOM, TW, kf, hand, headAt, paperCrown, kingThrone, KING, crownHead, sceptre, banner, mini, discPlate, ewer, towelHeld, addToHead,
  person, sheet, hanging, vis, pose, fade, lerp, mix, shade, blinkAt, tr, C, PI,
} from './lib.js';

export default {
  id: 'lk22-greatest',
  beats: [
    { v: 24 },
    { v: 25 },
    { v: 26, text: 'Wy zaś nie tak [macie postępować].' },
    { v: 26, cont: true, text: 'Lecz największy między wami niech będzie jak najmłodszy, a przełożony jak sługa!' },
  ],
  cam: { x: [-40, 40], y: [0, 200], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: NIGHTROOM });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus;
    const ARGUE = ['peter', 'james', 'john', 'thomas', 'matthew', 'andrew'];
    const fx = S.layer({ par: 0.57, sh: 4 });
    const crowns = ARGUE.map((k, i) => ({ k, i, m: by[k], el: fx.add(`<g>${paperCrown(c, 34)}</g>`) }));

    // the kings of the nations: a painted flat
    const FW = 460, FH = 290;
    const flatM = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-FW / 2 - 12, -12, FW + 24, FH + 24), 0.6, 8), C.wood2);
      s.p(c.cut(c.rect(-FW / 2, 0, FW, FH), 0.5, 8), mix(C.parchment, C.apricot, 0.25));
      s.p(c.cut([[-FW / 2, FH], [-FW / 2, FH - 40], [FW / 2, FH - 44], [FW / 2, FH]], 0.5, 8), mix(C.stone2, C.plumRobe, 0.15));
      const king = addToHead(person(c, { ...KING, pose: 'sit', holdF: sceptre(c) }), crownHead(c));
      const subjects = [-170, -120, 120, 170].map((x, i) => `<g transform="translate(${x} ${FH - 34}) scale(${x < 0 ? 0.42 : -0.42} .42)">${person(c, { robe: [C.sageRobe, C.dustyBlue, C.wheatRobe, C.roseRobe][i], hair: C.hair, hairStyle: i % 2 ? 'wrap' : 'short', veil: C.stone, beard: 'short', skin: [C.skin2, C.skin3, C.skin, C.skin4][i], pose: 'kneel' })}</g>`).join('');
      return `${s.out()}<g transform="translate(0 ${FH - 40}) scale(.62)">${kingThrone(c)}</g><g transform="translate(-6 ${FH - 81}) scale(.62)">${king}</g>${subjects}<g class="nx" opacity="0" transform="translate(0 ${FH / 2})"><path d="${c.ribbon([[-150, -90], [150, 90]], 16) + c.ribbon([[150, -90], [-150, 90]], 16)}" fill="${C.terracotta}" opacity=".85"/></g><g transform="translate(0 20)">${banner(c, tr('Dobroczyńca', 'Benefactor'), { w: 190, h: 54, size: 22 })}</g>`;
    })();
    const flat = hanging(fx, `<path d="M${-FW * 0.35} -1600V-12M${FW * 0.35} -1600V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${flatM}`, { x: 0, y: -1500, len: 0 });
    const nx = flat.querySelector('.nx');
    // the two plates
    const TALL = { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'full', skin: C.skin2 };
    const CHILD = { robe: C.wheatRobe, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin };
    const LEADER = { robe: C.tealRobe, mantle: C.clayMantle, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen2, beard: 'full', skin: C.skin3 };
    const arrow = `<path d="${c.cut([[-14, -3], [4, -3], [4, -9], [16, 0], [4, 9], [4, 3], [-14, 3]], 0.3, 3)}" fill="${C.terracotta}"/>`;
    const plA = hanging(fx, discPlate(c, `<g transform="translate(-34 36)">${mini(c, TALL, { sc: 0.34 })}<g transform="translate(-2 -58)">${paperCrown(c, 18)}</g></g><g transform="translate(0 -4)">${arrow}</g><g transform="translate(34 36)">${mini(c, CHILD, { sc: 0.22 })}</g>`, { r: 66, rim: C.ochre }), { x: 0, y: -1500, len: 700 });
    const plB = hanging(fx, discPlate(c, `<g transform="translate(-34 36)">${mini(c, LEADER, { sc: 0.34 })}<path d="${c.ribbon([[18, 2], [24, -80]], 3)}" fill="${C.wood2}"/></g><g transform="translate(0 -4)">${arrow}</g><g transform="translate(34 36)">${mini(c, { ...LEADER, mantle: null }, { pose: 'kneel', sc: 0.34 })}</g><g transform="translate(48 16) scale(.55)">${ewer(c)}</g>`, { r: 66, rim: C.ochre }), { x: 0, y: -1500, len: 700 });
    const labA = hanging(fx, `${sheet().p(c.cut(c.rect(-70, -14, 140, 28), 0.4, 5), C.cream).out()}<text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.ink}">${tr('jak najmłodszy', 'as the younger')}</text>`, { x: 0, y: -1500, len: 700 });
    const labB = hanging(fx, `${sheet().p(c.cut(c.rect(-70, -14, 140, 28), 0.4, 5), C.cream).out()}<text x="0" y="6" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="17" font-style="italic" fill="${C.ink}">${tr('jak sługa', 'as one who serves')}</text>`, { x: 0, y: -1500, len: 700 });

    return (t, time) => {
      const T = time;
      T0.idle(t, T, 0.1);
      R.stars.fade(1);

      /* v24 — the dispute; crowns over the heads that argue */
      const argue = es(t, 0.05, 0.3) * (1 - es(t, 2.05, 2.3));
      const drop = es(t, 2.2, 2.55, ease.in);
      at.forEach((m) => {
        if (m.k === 'jesus') {
          const speak = es(t, 1.05, 1.3);
          T0.sit(m, T, { armF: 36 + speak * 30 + es(t, 3.05, 3.3) * 20, armB: 14 + speak * 30 + bump(t, 2.05, 2.6) * 60, head: argue * 8 * (1 - speak) - speak * 4 });
          fade(m.sad, argue * (1 - speak) * 0.8);
          return;
        }
        const a = ARGUE.includes(m.k) ? argue : 0;
        const ph = T ? Math.sin(T * 5 + m.seed) : 0;
        T0.sit(m, T, { armF: 36 + a * (40 + ph * 14), armB: 14 + a * (60 + ph * 20), head: a * (m.flip ? 8 : -8) - es(t, 1.05, 1.3) * 6 + drop * 8, lean: -a * 4 });
        fade(m.angry, a * (1 - es(t, 1.1, 1.4) * 0.6));
        fade(m.sad, drop * 0.6);
      });
      crowns.forEach((cr) => {
        const m = cr.m;
        const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62);
        const up = es(t, 0.1 + cr.i * 0.06, 0.4 + cr.i * 0.06, ease.back);
        const rise = up * (26 + ((cr.i * 13) % 3) * 12 + (T ? Math.sin(T * 3 + cr.i) * 4 * argue : 0));
        const y0 = hy - 22 - rise;
        vis(cr.el, { x: hx + drop * (m.flip ? -30 : 30), y: lerp(y0, TOP - 2, drop), r: drop * (cr.i % 2 ? 8 : -8) + (T ? Math.sin(T * 4 + cr.i) * 4 * argue : 0), s: up * (1 - drop * 0.3), o: up > 0.01 ? 1 - es(t, 3.0, 3.2) : 0 });
      });

      /* v25 — the kings of the nations and their "benefactors" */
      const fin = es(t, 1.05, 1.45, ease.out) * (1 - es(t, 2.82, 3.1, ease.in));
      fade(nx, es(t, 2.05, 2.2));
      vis(flat, { x: 800, y: 150 - (1 - fin) * 800, r: T ? Math.sin(T * 0.6) * 0.8 : 0, o: fin > 0.01 ? 1 : 0 });

      /* v26b — as the youngest; as one who serves */
      const pa = es(t, 3.05, 3.35, ease.out), pb = es(t, 3.3, 3.6, ease.out);
      vis(plA, { x: 640, y: 330 - (1 - pa) * 700, r: T ? Math.sin(T * 0.8) * 2 : 0, o: pa > 0.01 ? 1 : 0 });
      vis(labA, { x: 640, y: 420 - (1 - pa) * 700, r: T ? Math.sin(T * 0.8 + 1) * 2 : 0, o: pa > 0.01 ? 1 : 0 });
      vis(plB, { x: 960, y: 330 - (1 - pb) * 700, r: T ? Math.sin(T * 0.8 + 2) * 2 : 0, o: pb > 0.01 ? 1 : 0 });
      vis(labB, { x: 960, y: 420 - (1 - pb) * 700, r: T ? Math.sin(T * 0.8 + 3) * 2 : 0, o: pb > 0.01 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.z = kf(t, [[-0.3, 1.26], [0.9, 1.3], [1.2, 1.02], [2.1, 1.02], [2.4, 1.3], [3.0, 1.26], [3.3, 1.08]]);
      S.cam.y = kf(t, [[-0.3, 130], [0.9, 140], [1.2, 0], [2.1, 0], [2.4, 130], [3.0, 120], [3.3, 40]]);
    };
  },
};
