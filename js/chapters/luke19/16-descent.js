// Łk 19,37–38 — the road tips over the brow of the Mount of Olives and runs down towards the Kidron; across the
// valley the whole of Jerusalem lies spread out, the Temple shining. Jesus rides down on the colt over the cloaks, and
// the whole multitude of His disciples, before Him and behind, begins to rejoice and praise God with a loud voice
// for all the mighty works they had seen: medallions of them rise over their heads — the blind who see, the lame who
// walk, the lepers made clean, the deaf who hear, the dead raised. "Blessed is the King who comes in the name of the
// Lord!" — a long cloth banner comes down over the road. "Peace in heaven, and glory in the highest!" — the sky turns
// to gold high above, little stars come out in the daylight, and two golden words hang in the height.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { olivetSet, OV, TWELVE, still, folk, colt, coltRig, saddleCloaks, riderLeg, roadCloak, clothBanner, voiceRings, sparkle, headAt, hand, kf, tr, es, ease, bump, seg, PI, PRAISE, mix, shade, sheet, STRING, FONT } from './lib.js';
import { medal } from '../matthew1/lib.js';
import { BLIND, LAME, DEAF } from '../matthew11/lib.js';
import { LEPER_HEALED } from '../mark1/lib.js';
import { bakeArms } from '../matthew4/lib.js';

const RY = (x) => 648 + (x - 200) * 0.05;          // the road running down to the right
const JX = 800;
const GOLD = ['#e8cf9c', '#f6dfae', '#fbe9c6'];

export default {
  id: 'lk19-descent',
  beats: [
    { v: 37 },
    { v: 38, text: 'I wołali głośno: «Błogosławiony Król, który przychodzi w imię Pańskie.' },
    { v: 38, cont: true, text: 'Pokój w niebie i chwała na wysokościach».' },
  ],
  cam: { x: [-60, 120], y: [-80, 40], z: [1, 1.1] },
  build(S) {
    const O = olivetSet(S, { skyCols: PRAISE, sky2: GOLD, cityX: 1060, cityY: 500, cityS: 0.62, sunAt: [1300, 130], slopeY: 590, seed: 'lk19-olivet-c', grove2: false, road: [[-1400, RY(-1400)], [0, RY(0)], [800, RY(800)], [1600, RY(1600)], [3000, RY(3000)]] });
    const c = S.c;
    /* golden words and daylight stars in the height (behind everything but the sky) */
    const hi = S.layer({ par: 0.05, sh: 3, rise: 0 });
    const stars = Array.from({ length: 14 }, (_, i) => ({ i, x: 300 + i * 80 + c.rr(-30, 30), y: 120 + c.rr(0, 120), el: hi.add(`<g>${sparkle(c, c.rr(7, 11))}</g>`) }));
    const w1 = hi.add(`<g>${goldWord(c, tr('Pokój w niebie', 'Peace in heaven'), 30)}</g>`);
    const w2 = hi.add(`<g>${goldWord(c, tr('i chwała na wysokościach', 'and glory in the highest'), 30)}</g>`);
    /* the medallions of the mighty works */
    const medL = S.layer({ par: 0.25, sh: 4 });
    const MED = [
      [{ ...BLIND, eyes: 'open' }, tr('niewidomi widzą', 'the blind see')],
      [{ ...LAME, holdF: '' }, tr('chromi chodzą', 'the lame walk')],
      [LEPER_HEALED, tr('trędowaci oczyszczeni', 'lepers cleansed')],
      [DEAF, tr('głusi słyszą', 'the deaf hear')],
      [{ robe: C.linen, hair: C.hair2, hairStyle: 'short', beard: 'none', skin: C.skin }, tr('umarli wstają', 'the dead are raised')],
    ].map(([o, name], i) => ({ i, el: medL.add(`<g><path d="M0 -2000V-46" stroke="${STRING}" stroke-width="1.2"/>${medal(S, o, { r: 44, name, size: 15 })}</g>`) }));
    /* the multitude: behind (still sheets), the disciples who walk before and after Him */
    const A = O.act;
    const far = A.sprite(still(c, Array.from({ length: 14 }, (_, i) => ({ x: i * 62 - 400, y: RY(400 + i * 62) - RY(400) - 34 + (i % 2) * 6, s: 0.74, flip: i > 7, armB: 140 + (i % 3) * 10, armF: 40 + (i % 2) * 70, head: -6, o: folk(c) }))), 800, RY(400));
    const behind = A.sprite(still(c, [0, 2, 3, 6].map((k, i) => ({ x: -i * 58, y: -i * 3, s: 0.9, armB: 150, armF: 60, head: -6, o: TWELVE[k].o }))), 620, RY(620) + 8);
    A.add(`<g>${[0, 1, 2, 3, 4, 5].map((i) => `<g transform="translate(${660 + i * 90} ${RY(660 + i * 90) + 18}) rotate(3)">${roadCloak(c, [C.dustyBlue, C.roseRobe, C.wheatRobe, C.tealRobe, C.mauve, C.clayMantle][i], 104)}</g>`).join('')}</g>`);
    const rider = person(c, { ...CAST.jesus, pose: 'sit' });
    const coltEl = A.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]), rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${rider}</g>${riderLeg(c)}` }));
    const cR = coltRig(coltEl);
    const jRide = S.puppet(coltEl.querySelector('[data-k="rider"]').firstElementChild);
    const ahead = A.sprite(still(c, [1, 4, 7].map((k, i) => ({ x: i * 62, y: i * 3, s: 0.9, flip: true, armB: 150, armF: 80, head: -6, o: TWELVE[k].o }))), 1010, RY(1010) + 10);
    const fx = O.fx;
    const rings = voiceRings(fx, c, { n: 3, r: 34, w: 4, color: C.ochre });
    const banL = S.layer({ par: 0.4, sh: 5 });
    const banner = banL.add(`<g><path d="M-300 -2000V0M300 -2000V0" stroke="${STRING}" stroke-width="1.3" fill="none"/>${clothBanner(c, tr('Błogosławiony Król, który przychodzi w imię Pańskie!', 'Blessed is the King who comes in the name of the Lord!'), { size: 24, w: 720 })}</g>`);
    O.front();

    return (t, time) => {
      const T = time;
      O.update(T, { glow: 0.5 + es(t, 2.0, 2.4) * 0.4, sunY: 130 });
      O.sk2.fade(es(t, 2.02, 2.4));
      /* v37 — down the slope; the whole multitude of disciples praise God for the mighty works */
      const ride = es(t, -0.5, 3.0, (x) => x);
      const cx = lerp(700, 900, ride);
      cR.set({ x: cx, y: RY(cx) + 6, s: 1.0, walk: cx * 0.06, amt: 0.6, r: 3, nod: T ? Math.sin(T * 0.8) * 2 : 0, ear: T ? Math.sin(T * 1.3) * 6 : 0, tail: T ? Math.sin(T * 1.7) * 6 : 0 });
      jRide.set({ x: 0, y: 0, s: 1, armF: 30 + es(t, 1.05, 1.3) * 40, armB: 20 + es(t, 2.05, 2.3) * 110, head: -4 - es(t, 2.05, 2.3) * 6, blink: blinkAt(T) });
      far.set({ x: 800 + ride * 60, y: RY(400) });
      behind.set({ x: 620 + ride * 200, y: RY(620) + 8 });
      ahead.set({ x: 1010 + ride * 200, y: RY(1010) + 10 });
      const [hx, hy] = headAt(cx - 16 + 2, RY(cx) + 6 - 106 - 105 * 0.95, 1, false);
      rings(hx, hy, es(t, 0.1, 0.3) * 0.8, T, { spread: 2.2 });
      MED.forEach((m) => {
        const k = es(t, 0.2 + m.i * 0.1, 0.55 + m.i * 0.1, ease.back);
        const x = 500 + m.i * 170, y = 250 + (m.i % 2) * 44;
        pose(m.el, { x, y: lerp(-1300, y, k) + (T ? Math.sin(T * 0.8 + m.i) * 3 : 0), r: T ? Math.sin(T * 0.6 + m.i) * 2 : 0, o: k > 0.001 && t < 1.2 ? 1 - es(t, 1.02, 1.2) : 0 });
      });
      /* v38a — "Blessed is the King who comes in the name of the Lord!" */
      const bk = es(t, 1.05, 1.35, ease.back);
      pose(banner, { x: 820, y: lerp(-1300, 330, bk) - es(t, 2.0, 2.3) * 60, r: T ? Math.sin(T * 0.7) * 0.8 : 0, o: bk > 0.001 ? 1 : 0 });
      /* v38b — "Peace in heaven, and glory in the highest!" */
      const g1 = es(t, 2.1, 2.4, ease.back), g2 = es(t, 2.25, 2.55, ease.back);
      pose(w1, { x: S.portrait ? 700 : 780, y: lerp(-800, 196, g1), o: g1 > 0.001 ? 1 : 0 });
      pose(w2, { x: S.portrait ? 880 : 1120, y: lerp(-800, 250, g2), o: g2 > 0.001 ? 1 : 0 });
      stars.forEach((s) => { const k = es(t, 2.1 + s.i * 0.03, 2.3 + s.i * 0.03); pose(s.el, { x: s.x, y: s.y, s: k * (0.8 + (T ? Math.sin(T * 2 + s.i) * 0.2 : 0)), r: T * 20, o: k > 0.02 ? 1 : 0 }); });

      S.cam.x = kf(t, [[-0.5, 0], [1.0, 20], [2.0, 40]]);
      S.cam.y = kf(t, [[-0.5, 20], [0.4, -20], [1.1, -30], [2.0, -60]]);
      S.cam.z = kf(t, [[-0.5, 1.04], [1.0, 1.02], [2.0, 1.0]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 0], [2.0, 40]]); S.cam.z = 1.0; }
      void hand; void bakeArms; void mix; void shade; void sheet; void seg; void bump;
    };
  },
};
/** golden words on a gilt paper strip hung in the height (origin: centre) */
function goldWord(c, text, size = 28) {
  const w = text.length * size * 0.5 + size * 1.6, h = size * 1.6;
  const s = sheet().p(c.cut([[-w / 2, -h / 2], [w / 2, -h / 2 - 2], [w / 2 + 2, h / 2], [-w / 2 - 1, h / 2 + 1]], 0.5, 8), mix(C.halo, C.sun, 0.3)).x(c.ribbon([[-w / 2 + 8, -h / 2 + 5], [w / 2 - 8, -h / 2 + 4]], 1.6), C.sunDeep, 'opacity=".5"');
  return `<path d="M${-w / 2 + 24} -2000V${-h / 2}M${w / 2 - 24} -2000V${-h / 2}" stroke="${STRING}" stroke-width="1.2" fill="none"/>${s.out()}<text x="0" y="${(size * 0.34).toFixed(1)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-style="italic" fill="${C.sunRay}">${text}</text>`;
}
