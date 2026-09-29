// Mt 11,9–10 — a painted flat of the wilderness. "To see a prophet?": John on his rock, crying out to the crowds.
// "More than a prophet": the prophets of old appear on the ridge behind, pale as old paper, all pointing towards a
// light on the horizon — and John, nearest of all, points to it too; the light rises behind him. "Of whom it is
// written": Malachi's scroll comes down and opens. "I send my messenger before your face": a road winds down from
// that light; John steps down and goes ahead on it, rolling the stones off the way — and down the road behind him
// comes Jesus. John turns and points to Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { rock } from '../../assets/nature.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import { wildSet, JOHN_B, ISAIAH, L6, L9, throng, pose3, headAt, voiceRings, question, addScroll, setScroll, kf, moving, tr, PI } from './lib.js';

const GY = 752;
const RX = 660, RY = 684;            // John's rock (top)
const LIGHT = [1190, 520];           // the light on the horizon
const ROAD = [[1170, 548], [1080, 590], [1010, 640], [960, 700], [900, 760], [860, 820]];
const rs = (y) => lerp(0.42, 1.0, (y - 548) / (760 - 548));

export default {
  id: 'mt11-prophet',
  enter: 'fly',
  beats: [
    { v: 9, text: 'Po coście więc wyszli? Proroka zobaczyć?' },
    { v: 9, cont: true, text: 'Tak, powiadam wam, nawet więcej niż proroka.' },
    { v: 10, text: 'On jest tym, o którym napisano:' },
    { v: 10, cont: true, text: 'Oto Ja posyłam mego wysłańca przed Tobą, aby Ci przygotował drogę.' },
  ],
  cam: { x: [-60, 60], y: [-80, 40], z: [1, 1.3] },
  build(S) {
    const W = wildSet(S, { sunAt: [300, 160], gy: 710 });
    const c = W.c;

    /* the light on the horizon (behind the mid dunes) */
    const lightL = S.layer({ par: 0.12, sh: 0, flat: true });
    const dawn = lightL.add(`<g><circle r="260" fill="url(#warm-glow)"/><circle r="120" fill="url(#halo-glow)"/></g>`);

    /* the prophets of old on the ridge */
    const ridge = S.layer({ par: 0.2, sh: 3 });
    const PROPH = [{ ...ISAIAH }, { ...L6.prophet }, { ...L9.elijah }].map((o) => ({ ...o, robe: mix(o.robe, C.parchment, 0.45), mantle: o.mantle ? mix(o.mantle, C.parchment, 0.45) : null }));
    const old = ridge.sprite(pose3(c, PROPH.map((o, i) => ({ x: (i - 1) * 110, y: (i % 2) * 6, s: 0.6, armF: 86, armB: 20, head: -4, o }))), 440, 560);

    /* the road down from the light */
    const roadL = S.layer({ par: 0.45, sh: 2 });
    roadL.add(sheet().p(c.ribbon(ROAD, (u) => 8 + u * 90, 1.4), mix(C.sand, C.cream, 0.35)).out());
    const stones = [[1000, 652, 30], [930, 728, 40], [1060, 606, 22]].map(([x, y, w], i) => ({ i, x, y, el: roadL.add(`<g>${rock(c, 0, 0, w, w * 0.4, C.rock2)}</g>`) }));

    /* John's rock and the crowd */
    const act = S.layer({ par: 0.45, sh: 5 });
    act.add(`<g transform="translate(${RX} ${RY})">${sheet().p(c.cut([[-90, 80], [-80, 20], [-60, 0], [60, -4], [84, 16], [96, 80]], 1.2, 10), C.rock2).x(c.ribbon([[-50, 8], [50, 4]], 3), shade(C.rock2, 0.25), 'opacity=".6"').out()}</g>`);
    const crowdL = S.layer({ par: 0.45, sh: 4 });
    crowdL.sprite(throng(makeCutter('mt11-pr-a'), 6, { s: 0.84, rows: 2, spread: 46 }), 380, GY + 10);
    crowdL.sprite(throng(makeCutter('mt11-pr-b'), 5, { s: 0.84, rows: 2, spread: 46, flip: true }), 1300, GY + 10);
    const jL = S.layer({ par: 0.45, sh: 5 });
    const glow = jL.add(`<circle r="170" fill="url(#halo-glow)" opacity="0"/>`);
    const john = S.puppet(jL.add(person(c, JOHN_B)));
    const voice = voiceRings(jL, c, { n: 3, color: C.clay, r: 38, w: 5 });
    const jesus = S.puppet(jL.add(person(c, { ...CAST.jesus })));
    const q = jL.add(`<g>${question(c)}</g>`);

    /* the scroll of Malachi */
    const fly = S.layer({ par: 0.1, sh: 6 });
    const sc = addScroll(fly, c, [tr('Malachiasz 3,1', 'Malachi 3:1'), tr('Oto Ja posyłam', 'Behold, I send'), tr('mego wysłańca przed Tobą,', 'my messenger before your face,'), tr('aby Ci przygotował drogę', 'who will prepare your way')], { w: 380, h: 200, size: 24 });

    return (t, time) => {
      const T = time;
      W.update(T);

      /* v9a — the prophet in the wilderness */
      const cry = es(t, 0.1, 0.3) * (1 - es(t, 3.0, 3.1));
      const JK = [[3.05, RX], [3.3, RX - 40], [3.6, 600]];
      const JYK = [[3.05, RY], [3.3, GY], [3.6, GY + 6]];
      const jx = kf(t, JK), jy = kf(t, JYK);
      const onRock = t < 3.1;
      const point = es(t, 1.15, 1.35) * (1 - es(t, 3.0, 3.1));
      const turn = t > 3.62;
      const toJesus = es(t, 3.62, 3.75);
      john.set({
        x: jx, y: jy, s: 1.0, flip: turn, walk: t > 3.05 && t < 3.6 ? jx * 0.05 : undefined,
        armF: 30 + cry * 60 * (1 - point) + point * 70 + toJesus * 60 + bump(t, 3.35, 3.5) * 60, armB: 20 + cry * 120 * (1 - point) + point * 30,
        head: -cry * 8 - point * 4, lean: bump(t, 3.35, 3.5) * 16, blink: blinkAt(T, 1),
      });
      const [hx, hy] = headAt(jx, jy, 1.0, turn);
      voice(hx, hy, cry * (1 - point * 0.5), T, { dir: 1, spread: 2.4 });
      const qk = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(q, { x: 420, y: 520 + (T ? Math.sin(T * 2) * 3 : 0), s: qk, r: T ? Math.sin(T * 1.6) * 6 : 0, o: qk > 0.02 ? 1 : 0 });

      /* v9b — more than a prophet: the prophets of old appear; the light rises; John points to it */
      const pk = es(t, 1.05, 1.35);
      old.set({ x: 440, y: 560 + (1 - pk) * 30, o: pk * 0.85 * (1 - es(t, 2.9, 3.1)) });
      const rise = es(t, 1.2, 1.6);
      pose(dawn, { x: LIGHT[0], y: LIGHT[1] + (1 - rise) * 60, s: 0.6 + rise * 0.5 + es(t, 3.0, 3.4) * 0.3, o: rise });
      pose(glow, { x: hx, y: hy + 50, s: 0.8 + point * 0.4, o: point * 0.7 + toJesus * 0.3 });

      /* v10a — the scroll */
      const sk = es(t, 2.02, 2.3, ease.out), open = es(t, 2.25, 2.55), up = es(t, 2.95, 3.15, ease.in);
      setScroll(sc, 800, lerp(-400, 150, sk) - up * 700, open, sk > 0.01 && up < 1 ? 1 : 0, T ? Math.sin(T * 0.8) * 1.2 : 0);

      /* v10b — the messenger goes before Him and clears the way */
      stones.forEach((st) => {
        const k = es(t, 3.2 + st.i * 0.08, 3.4 + st.i * 0.08);
        pose(st.el, { x: st.x - k * 140 * (st.i === 1 ? 1 : -1) * -1, y: st.y + k * 10, r: k * 200, o: 1 - seg(k, 0.7, 1) });
      });
      const JPK = [[3.05, 0], [3.7, 0.84]];
      const u = kf(t, JPK, (x) => x);
      const idx = Math.min(ROAD.length - 2, Math.floor(u * (ROAD.length - 1)));
      const fu = u * (ROAD.length - 1) - idx;
      const px = lerp(ROAD[idx][0], ROAD[idx + 1][0], fu), py = lerp(ROAD[idx][1], ROAD[idx + 1][1], fu);
      jesus.set({ x: px, y: py, s: rs(py) * 1.02, flip: true, walk: t > 3.05 && t < 3.7 ? u * 60 : undefined, armF: 16 + es(t, 3.7, 3.85) * 30, armB: 10, blink: blinkAt(T), o: seg(t, 3.02, 3.1) });

      S.cam.x = kf(t, [[0, -40], [1.0, -40], [1.3, 20], [3.0, 20], [3.5, 40]]);
      S.cam.z = kf(t, [[0, 1.2], [1.0, 1.2], [1.3, 1.1], [3.0, 1.1], [3.5, 1.24]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 20], [1.3, -10], [3.0, -10], [3.5, 30]]);
    };
  },
};
