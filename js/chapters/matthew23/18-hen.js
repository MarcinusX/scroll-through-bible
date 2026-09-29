// Mt 23,37 — evening. From the terrace of the Temple Jesus looks out over the roofs of Jerusalem, golden in the last
// light. "Jerusalem, Jerusalem!": He stretches out both arms to the city, and a tear runs down His cheek. "You who kill
// the prophets and stone those sent to you": far off by the city gate a small figure, one of the sent, sinks to his knees
// under a scatter of stones (tiny, in the distance). "How often I would have gathered your children as a hen gathers her
// chicks under her wings": over the city a great warm paper hen comes down and opens her wings wide — the little chicks
// come running from the streets… then stop, turn and scatter away; the wings stay open, and empty. "And you would not."
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, sun, cloud } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { jerusalem, hen, chick, withFace, faceBits, face, pose3, folk, TWELVE, DUSK, PI } from './lib.js';

const GY = 700;
const JX = 620;
const CITY = [880, 590], CS = 0.62;
const HEN = [930, 300];
const GATE = [1060, 600];

export default {
  id: 'mt23-hen',
  beats: [
    { v: 37, text: 'Jeruzalem, Jeruzalem!' },
    { v: 37, cont: true, text: 'Ty zabijasz proroków i kamienujesz tych, którzy do ciebie są posłani!' },
    { v: 37, cont: true, text: 'Ile razy chciałem zgromadzić twoje dzieci, jak ptak swe pisklęta zbiera pod skrzydła, a nie chcieliście.' },
  ],
  cam: { x: [-10, 40], y: [-40, 10], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    sky(S, DUSK);
    const hangL = S.layer({ par: 0.03, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40), { x: 1260, y: 330, len: 900 });
    const cl = hanging(hangL, cloud(c, 170, mix(C.cream, C.dusk, 0.3), mix(C.dusk, C.duskViolet, 0.4)), { x: 420, y: 170, len: 900 });

    /* the hen, high over the city */
    const henL = S.layer({ par: 0.05, sh: 5 });
    const H = hen(c);
    const glow = henL.add(`<g><circle r="260" fill="url(#halo-glow)"/></g>`);
    const strings = henL.add(`<g><path d="M-40 -1600V-150M40 -1600V-150" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);
    const wingL = henL.add(`<g>${H.wing}</g>`);
    const wingR = henL.add(`<g>${H.wing}</g>`);
    const body = henL.add(`<g>${H.body}</g>`);

    /* the city across the valley */
    const cityL = S.layer({ par: 0.1, sh: 3 });
    cityL.add(`<g>${band(c, { y: 600, amps: [10, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.dune, 0.3) }).markup}<g transform="translate(${CITY[0]} ${CITY[1]})">${jerusalem(c, CS, { tglow: true })}</g></g>`);
    const far = S.layer({ par: 0.12, sh: 4 });
    const chicks = Array.from({ length: 8 }, (_, i) => ({ i, x0: 640 + i * 70 + c.rr(-20, 20), el: far.add(`<g>${chick(c)}</g>`) }));
    const sentOne = S.puppet(far.add(person(c, { robe: C.stone2, mantle: C.wood3, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', skin: C.skin3 })));
    const sentKneel = S.puppet(far.add(person(c, { robe: C.stone2, mantle: C.wood3, hair: C.greyHair, hairStyle: 'wild', beard: 'wild', skin: C.skin3, pose: 'kneel' })));
    const stones = Array.from({ length: 5 }, (_, i) => ({ i, el: far.add(`<g><path d="${c.cut(c.blob(0, 0, 5, 4, 7, 0.2), 0.3, 3)}" fill="${C.rock3}"/></g>`) }));

    /* the terrace of the Temple, its low parapet */
    const T = S.layer({ par: 0.4, sh: 3 });
    const tp = sheet();
    const st = mix(C.stone, C.dusk, 0.18);
    tp.p(c.cut([[-900, GY - 60], [2500, GY - 64], [2500, GY + 4], [-900, GY + 4]], 0.6, 16), shade(st, -0.06));
    let bal = '';
    for (let x = -880; x < 2500; x += 34) bal += c.cut(c.rect(x, GY - 56, 14, 44), 0.3, 4);
    tp.x(bal, shade(st, -0.2), 'opacity=".5"');
    tp.p(c.cut([[-900, GY - 70], [2500, GY - 74], [2500, GY - 58], [-900, GY - 56]], 0.4, 12), shade(st, 0.12));
    tp.p(c.cut([[-900, GY], [2500, GY - 4], [2500, 1700], [-900, 1700]], 0.6, 16), st);
    T.add(tp.out());
    const P = S.layer({ par: 0.45, sh: 5 });
    P.sprite(pose3(c, [TWELVE[2].o, TWELVE[0].o].map((o, i) => ({ x: -i * 70, y: 0, s: 0.95, flip: false, head: 10, o: { ...o, pose: 'sit' } }))), 380, GY + 10);
    const jesusEl = P.add(withFace(person(c, { ...CAST.jesus }), faceBits(c)));
    const jesus = S.puppet(jesusEl);

    return (t, time) => {
      const Tm = time;
      swing(sunEl, 1260, 330 + t * 25, Tm, 1, 0.5);
      swing(cl, 420 + (Tm ? Math.sin(Tm * 0.1) * 20 : 0), 170, Tm, 1.2, 0.6, 1);

      /* v37a — arms out to the city; a tear */
      const reach = es(t, 0.08, 0.4);
      const wide = es(t, 2.05, 2.35);
      const drop = es(t, 2.72, 2.95);
      jesus.set({ x: JX, y: GY + 4, s: 1.06, armF: 20 + reach * 70 - drop * 40 + wide * 10, armB: 10 + reach * 90 + wide * 30 - drop * 60, head: -reach * 4 + drop * 14, lean: -reach * 2 + drop * 4, blink: blinkAt(Tm) });
      face(jesusEl, 'sad', es(t, 0.2, 0.5));
      face(jesusEl, 'tear', es(t, 0.45, 0.7));

      /* v37b — far off at the gate, one of the sent sinks under stones */
      const walk = es(t, 1.0, 1.3);
      const hit = es(t, 1.35, 1.6);
      const down = es(t, 1.55, 1.62);
      const gx = lerp(GATE[0] + 120, GATE[0] + 40, walk);
      sentOne.set({ x: gx, y: GATE[1], s: 0.34, flip: true, walk: walk > 0.02 && walk < 0.98 ? t * 40 : undefined, armB: hit * 140, armF: hit * 60, head: hit * 12, o: t > 0.95 ? 1 - down : 0 });
      sentKneel.set({ x: gx, y: GATE[1], s: 0.34, flip: true, armF: 60, armB: 100, head: 20, lean: 12, o: down * (1 - es(t, 2.0, 2.1)) });
      stones.forEach((s) => {
        const k = seg(t, 1.3 + s.i * 0.06, 1.5 + s.i * 0.06);
        pose(s.el, { x: lerp(GATE[0] - 90 - s.i * 12, gx + 4, k), y: lerp(GATE[1] - 60, GATE[1] - 20, k) - Math.sin(k * PI) * 30, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v37c — the hen comes down and opens her wings; the chicks run to her… then away */
      const henIn = es(t, 1.95, 2.2, ease.out);
      const hy = lerp(-400, HEN[1], henIn);
      pose(strings, { x: HEN[0], y: hy, o: henIn > 0.01 ? 1 : 0 });
      pose(body, { x: HEN[0], y: hy, s: 0.8, o: henIn > 0.01 ? 1 : 0 });
      const spread = es(t, 2.12, 2.35);
      const wr = lerp(70, -18, spread);
      pose(wingR, { x: HEN[0] + 44, y: hy - 90 * 0.8, s: 0.8, r: wr, o: henIn > 0.01 ? 1 : 0 });
      pose(wingL, { x: HEN[0] - 44, y: hy - 90 * 0.8, sx: -0.8, sy: 0.8, r: -wr, o: henIn > 0.01 ? 1 : 0 });
      pose(glow, { x: HEN[0], y: hy - 60, o: spread * 0.9 });
      const come = es(t, 2.25, 2.5), away = es(t, 2.55, 2.85);
      chicks.forEach((ch) => {
        const tx = HEN[0] + (ch.i - 3.5) * 22;
        const flee = ch.x0 + (ch.x0 < HEN[0] ? -1 : 1) * 160 + (ch.i % 3) * 20;
        const x = lerp(lerp(ch.x0, tx, come * 0.75), flee, away);
        const running = (come > 0.02 && come < 0.98) || (away > 0.02 && away < 0.98);
        pose(ch.el, { x, y: 604 + (ch.i % 3) * 6 - (running ? Math.abs(Math.sin(t * 60 + ch.i)) * 4 : 0), sx: (away > 0.3 ? (x < HEN[0] ? -1 : 1) : (ch.x0 < HEN[0] ? 1 : -1)) * 0.8, sy: 0.8, o: es(t, 2.1, 2.25) });
      });

      S.cam.x = 10 + es(t, 0.9, 1.3) * 25 * (1 - es(t, 1.9, 2.2));
      S.cam.z = 1.02 + es(t, 0.9, 1.3) * 0.04 * (1 - es(t, 1.9, 2.2));
      S.cam.y = -20;
    };
  },
};
