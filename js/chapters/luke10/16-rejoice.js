// Łk 10,21–22 — the knoll by night, under the stars. "In that same hour He rejoiced in the Holy Spirit": a white dove
// comes down out of the dark in a soft light and hovers over Him, and Jesus lifts both His arms for joy. "I thank you,
// Father, Lord of heaven and earth" — light opens above (only light: rays, never a figure) — "that you have hidden these
// things from the wise and understanding": on the left two learned men bend over their scrolls by their lamp, and a
// grey veil comes down in front of them; "and revealed them to little children": on the right the light falls on
// a little band of children, and small flames settle in their open hands. "Yes, Father, for such was your gracious
// will": He bows, His hand on His heart, and the children skip. "All things have been handed over to me by my Father":
// down the beam of light comes the whole world, a paper globe with its stars, into His hands. "No one knows who the Son
// is except the Father, or who the Father is except the Son": two small lights pass up and down the beam, like a word
// and its answer; "and anyone to whom the Son chooses to reveal Him": He turns, and a light goes from His hand to the
// youngest of the sent ones, and his face lifts in the glow.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { oilLamp } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import { countrySet, KN, glow, lightFall, whiteDove, barefoot, CHILDREN, flame, sparkle, kf, handAt, headAt, EVENING, NIGHT, SENT_B, STRING, es, ease, bump, seg, PI } from './lib.js';
import { flapWings } from '../mark1/lib.js';
import { kid } from '../luke2/lib.js';
import { scribe } from '../mark11/lib.js';
import { globe } from '../mark8/lib.js';

const JX = KN.X, JY = 688;
const KIDS = [[1000, 0.6], [1070, 0.56], [1140, 0.62], [1210, 0.58]];

export default {
  id: 'lk10-rejoice',
  beats: [
    { v: 21, text: 'W tej właśnie chwili Jezus rozradował się w Duchu Świętym i rzekł:' },
    { v: 21, cont: true, text: '«Wysławiam Cię, Ojcze, Panie nieba i ziemi, że zakryłeś te rzeczy przed mądrymi i roztropnymi, a objawiłeś je prostaczkom.' },
    { v: 21, cont: true, text: 'Tak, Ojcze, gdyż takie było Twoje upodobanie.' },
    { v: 22, text: 'Ojciec mój przekazał Mi wszystko.' },
    { v: 22, cont: true, text: 'Nikt też nie wie, kim jest Syn, tylko Ojciec; ani kim jest Ojciec, tylko Syn i ten, komu Syn zechce objawić».' },
  ],
  cam: { x: [-30, 30], y: [-140, 40], z: [1, 1.1] },
  build(S) {
    let rays;
    const K = countrySet(S, {
      skyCols: EVENING, sky2: NIGHT, sunAt: [1260, 900],
      behind: (S2) => { const L = S2.layer({ par: 0.03, sh: 1, flat: true, rise: 0 }); L.add(`<g transform="translate(800 -260)">${lightFall(S2.c, { n: 13, len: 720, spread: 0.5 })}</g>`); rays = L; L.fade(0); return L; },
    });
    const c = S.c;
    K.sk2.layer.fade(1); K.starL.fade(1); K.dim.fade(0.9);
    K.trails.forEach((el) => pose(el, { o: 0.5 }));

    /* the beam from above onto Him, and the light on the children (behind the people) */
    const beamL = S.layer({ par: 0.45, sh: 1, flat: true });
    const beam = beamL.add(`<g><path d="${c.poly([[-22, 0], [22, 0], [56, 560], [-56, 560]])}" fill="#fff3cf" opacity=".26"/></g>`);
    const kidLight = beamL.add(`<g><path d="${c.poly([[-20, 0], [20, 0], [110, 600], [-110, 600]])}" fill="#fff3cf" opacity=".2"/><g transform="translate(0 560)">${glow(170, 0.55)}</g></g>`);

    /* the wise with their scrolls and lamp, and the veil that comes down before them */
    const P = S.layer({ par: 0.45, sh: 5 });
    const lampEl = P.add(`<g transform="scale(.8)">${oilLamp(c)}</g>`);
    const wise = [0, 1].map((i) => S.puppet(P.add(scribe(c, i, { pose: i ? 'stand' : 'sit' }))));
    const aura = P.add(`<g>${glow(180, 0.7)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const young = S.puppet(P.add(barefoot(person(c, SENT_B), SENT_B.skin)));
    const kids = KIDS.map(([x, s], i) => ({ i, x, s, p: S.puppet(P.add(kid(c, CHILDREN[i], 1.3))) }));
    const veilL = S.layer({ par: 0.46, sh: 3 });
    const veil = veilL.add(`<g><path d="M-120 -2000V0M120 -2000V0" stroke="${STRING}" stroke-width="1.2"/><path d="${c.cut([[-140, 0], [140, -4], [134, 230], [70, 244], [0, 232], [-70, 246], [-134, 234]], 1, 8)}" fill="${mix(C.stone, C.storm, 0.35)}" opacity=".78"/><path d="${c.ribbon([[-100, 6], [-96, 250]], 2) + c.ribbon([[0, 4], [4, 246]], 2) + c.ribbon([[100, 2], [96, 252]], 2)}" fill="${C.stone2}" opacity=".6"/></g>`);

    /* the dove, the small flames, the globe, the lights on the beam */
    const fx = S.layer({ par: 0.47, sh: 5 });
    const doveGlow = beamL.add(`<g>${glow(90, 0.9)}</g>`);
    const worldGlow = beamL.add(`<g>${glow(90, 0.8)}</g>`);
    const dv = fx.add(`<g>${whiteDove(c)}</g>`);
    const flames = kids.map(() => fx.add(`<g>${glow(28, 0.9, 'warm-glow')}${flame(c, 22)}</g>`));
    const world = fx.add(`<g>${globe(c, 44)}<path d="${[0, 1, 2, 3, 4].map((i) => c.cut(c.star(Math.cos(i * 1.3) * 60, -50 + Math.sin(i * 1.7) * 14, 6, 2.4, 5), 0.2, 2)).join('')}" fill="${C.sun}"/></g>`);
    const dots = [0, 1].map(() => fx.add(`<g>${glow(26, 1)}<path d="${c.cut(c.star(0, 0, 8, 3.4, 6), 0.2, 2)}" fill="${C.star}"/></g>`));
    const gift = fx.add(`<g>${glow(30, 1)}<path d="${c.cut(c.star(0, 0, 9, 4, 6), 0.2, 2)}" fill="${C.sun}"/></g>`);
    const joy = kids.map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      K.update(T, { sunO: 0 });
      K.lampsOn([1, 1, 1, 1, 1, 1], T);

      /* v21a — the dove comes down; He rejoices */
      const dd = es(t, 0.05, 0.6, ease.out);
      const [dx, dy] = [JX + (1 - dd) * 60, lerp(-200, JY - 290, dd)];
      pose(dv, { x: dx, y: dy + (T ? Math.sin(T * 2) * 4 : 0), s: 0.9, o: seg(t, 0.03, 0.08) });
      if (time) flapWings(dv, T, 30, 7); else flapWings(dv, 0.6, 30, 7);
      pose(doveGlow, { x: dx, y: dy - 10, s: 1 + dd * 0.4, o: dd });
      const rejoice = es(t, 0.45, 0.7) * (1 - es(t, 1.0, 1.1));
      const lift = es(t, 1.0, 1.15) * (1 - es(t, 2.0, 2.1));
      const bow = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.0));
      const take = es(t, 3.05, 3.3) * (1 - es(t, 3.95, 4.05));
      const turn = t > 4.4;
      const give = es(t, 4.45, 4.6);
      jesus.set({ x: JX, y: JY, s: 1.04, flip: false, armF: 20 + rejoice * 120 + lift * 60 + bow * 60 + take * 70 + give * 70, armB: 10 + rejoice * 150 + lift * 140 + bow * 20 + take * 60, head: -rejoice * 16 - lift * 20 + bow * 18 - take * 8, blink: blinkAt(T) });
      pose(aura, { x: JX, y: JY - 120, s: 1 + rejoice * 0.3, o: 0.6 + rejoice * 0.3 });

      /* v21b — the rays above; the veil before the wise; the light on the little ones */
      const open = es(t, 1.05, 1.4);
      rays.fade(open * 0.6);
      pose(beam, { x: JX, y: -40, sy: 1.26, o: open * 0.9 });
      const hide = es(t, 1.35, 1.65, ease.out);
      pose(veil, { x: 470, y: lerp(-500, 470, hide), r: T ? Math.sin(T * 0.8) * hide : 0, o: hide > 0.005 ? 1 : 0 });
      pose(lampEl, { x: 480, y: 730, o: 1 });
      wise[0].set({ x: 420, y: 736, s: 0.92, flip: false, armF: 60, armB: 30, head: 14, blink: blinkAt(T, 7) });
      wise[1].set({ x: 540, y: 738, s: 0.94, flip: true, armF: 70 + hide * 10, armB: 20, head: 12 + hide * 6, blink: blinkAt(T, 8) });
      const shine = es(t, 1.5, 1.8);
      pose(kidLight, { x: 1105, y: 120, o: shine });
      kids.forEach((k) => {
        const got = es(t, 1.6 + k.i * 0.06, 1.7 + k.i * 0.06);
        const skip = bump(t, 2.3 + k.i * 0.05, 2.6 + k.i * 0.05);
        const hop = skip > 0 ? Math.abs(Math.sin((t - 2.3) * 30 + k.i)) * 16 * skip : 0;
        k.p.set({ x: k.x, y: 748 - hop, s: k.s, flip: true, armF: 30 + got * 60, armB: 10 + got * 20 + skip * 130, head: -10 - got * 6, blink: blinkAt(T, k.i + 3) });
        const [hx, hy] = handAt(k.x, 748 - hop, k.s, true, 30 + got * 60);
        pose(flames[k.i], { x: hx, y: hy - 4, s: 0.5 + got * 0.5, o: got });
        const jk = bump(t, 2.3 + k.i * 0.05, 2.7 + k.i * 0.05);
        pose(joy[k.i], { x: k.x, y: 748 - 160 * k.s * 1.2, s: jk, r: T * 40, o: jk });
      });
      young.set({ x: 930, y: 744, s: 0.95, flip: !turn, armF: 20 + give * 50, armB: 10 + give * 30, head: -8 - give * 10, blink: blinkAt(T, 3) });

      /* v22a — the whole world handed down into His hands */
      const down = es(t, 3.0, 3.45, ease.out);
      const [thx, thy] = handAt(JX, JY, 1.04, false, 20 + 70 + 30);
      pose(world, { x: lerp(JX, thx + 10, down), y: lerp(-200, thy - 50, down), s: 0.7 + down * 0.3, r: T ? Math.sin(T * 0.5) * 4 : 0, o: seg(t, 2.98, 3.02) * (1 - es(t, 4.0, 4.2)) });
      pose(worldGlow, { x: lerp(JX, thx + 10, down), y: lerp(-200, thy - 50, down), s: 0.7 + down * 0.3, o: seg(t, 2.98, 3.02) * (1 - es(t, 4.0, 4.2)) });

      /* v22b — the lights pass up and down the beam; then one is given */
      dots.forEach((d, i) => {
        const k = ((t - 4.02) * 1.6 + i * 0.5) % 1;
        const up = i === 0;
        const y = up ? lerp(JY - 180, 0, k) : lerp(0, JY - 180, k);
        pose(d.el ?? d, { x: JX + (i ? 12 : -12), y, s: 0.9, o: t > 4.02 && t < 4.45 ? Math.sin(k * PI) : 0 });
      });
      const [ghx, ghy] = handAt(JX, JY, 1.04, false, 20 + give * 70);
      const [yhx, yhy] = headAt(930, 744, 0.95, false);
      const g = es(t, 4.5, 4.72);
      pose(gift, { x: lerp(ghx, yhx + 4, g), y: lerp(ghy, yhy + 40, g) - Math.sin(g * PI) * 30, s: 1, o: seg(t, 4.46, 4.5) });

      S.cam.x = kf(t, [[0, 0], [1.2, 0], [1.6, 0], [3, 0], [4.4, 0], [4.6, 20], [5, 20]]);
      S.cam.y = kf(t, [[0, -60], [0.7, -60], [1.1, 10], [2.9, 10], [3.1, -60], [3.5, -30], [4.4, -30], [4.6, 10], [5, 10]]);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.02], [1.3, 1.0], [2.9, 1.0], [3.3, 1.04], [4.5, 1.06], [5, 1.06]]);
    };
  },
};
