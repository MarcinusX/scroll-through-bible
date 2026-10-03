// Łk 18,6–8 — back on the wayside. "Listen to what the unrighteous judge says": a little round plate of the judge
// and the widow with her sealed verdict comes down, and Jesus points up to it. "Won't God avenge His chosen ones who
// cry out to Him day and night — will He be slow with them?": a painted flat comes down beside it — a knot of people
// on a hill, arms raised, crying out while the day goes and the night comes over them, their cries going up like
// sparks towards the light at the top of the sky (God, shown as light). The little plate of the judge fades grey.
// "I tell you, He will avenge them quickly": at once the dawn breaks in the flat and light pours down from above,
// warm around them. "Nevertheless, when the Son of Man comes, will He find faith on the earth?": the flats rise away
// and the whole round earth hangs there, with a few tiny lamps of faith burning on it, and a question beside it.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  waySet, WY, flatY, flat, flatSky, flatHills, plate, fig13, JUDGE, WIDOW, verdict, godLight, globe, question, sparkle, halo, warm, still, manO, womanO, rays,
  headAt, kf, es, ease, bump, seg, tr, PI,
} from './lib.js';

const { GY, JX, FX } = WY;
const FW = 380, FH = 240, K = 1.12, FYY = 270;
const PX = 800, PY = 260, PX2W = 1110, PY2 = 300;   // the judge's little plate (then set aside)

export default {
  id: 'lk18-elect',
  beats: [
    { v: 6 },
    { v: 7 },
    { v: 8, text: 'Powiadam wam, że prędko weźmie ich w obronę.' },
    { v: 8, cont: true, text: 'Czy jednak Syn Człowieczy znajdzie wiarę na ziemi, gdy przyjdzie?»' },
  ],
  cam: { x: [-20, 20], y: [-30, 30], z: [1, 1.08] },
  build(S) {
    const RG = S.portrait ? -70 : 0;   // phone: the listeners at the right clear of the edge and the thread
    const PX2 = S.portrait ? 1020 : PX2W;   // phone: the judge's plate set aside inside the screen
    const W = waySet(S, {
      dis: { keys: ['peter', 'andrew', 'james', 'john', 'philip', 'bartholomew'], x: 560, y: GY + 6, s: 0.86, flip: false },
      groups: [
        { k: 'r', x: 1060 + RG, y: GY + 6, n: 6, flip: true, s: 0.86, seed: 'lk18-pray-r' },
        { k: 'sit', x: 1090 + RG, y: GY + 52, n: 3, flip: true, pose: 'sit', s: 0.9, seed: 'lk18-pray-s' },
      ],
    });
    const c = S.c;
    const B = W.bits;

    /* the judge's plate */
    const pInner = `<g transform="translate(0 40)">${sheet().p(c.cut([[-56, -4], [56, -4], [50, 16], [-50, 16]], 0.3, 4), mix(C.stone, C.sand, 0.4)).out()}${fig13(c, { ...JUDGE, pose: 'sit' }, { s: 0.36, flip: true, armF: 70 })}<g transform="translate(-26 0)">${fig13(c, WIDOW, { s: 0.36, armF: 120, armB: 30, head: -8 })}</g><g transform="translate(-6 -58) scale(.4)">${verdict(c)}</g></g>`;
    const judgeP = B.add(`<g>${plate(c, `<g transform="translate(18 -18)">${pInner}</g>`, { r: 56 })}</g>`);
    const greyP = B.add(`<g opacity="0">${sheet().x(c.poly(c.circ(0, 0, 58, 30)), mix(C.stone2, C.storm, 0.3)).out()}</g>`);

    /* the flat of the chosen ones crying out day and night */
    const inner = flatSky(S, FW, FH, ['#c9dcd8', '#f4e2bf']) + flatHills(c, FW, 60, mix(C.hillFar, C.duskViolet, 0.25), 8);
    const flatEl = W.FL.add(flat(S, inner, { w: FW, h: FH }));
    const nid = S.id('el-night'), did = S.id('el-dawn');
    S.defs(`<linearGradient id="${nid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.night2}"/><stop offset="1" stop-color="${mix(C.indigo, C.duskViolet, 0.4)}"/></linearGradient><linearGradient id="${did}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d9a4"/><stop offset="1" stop-color="#fbeccd"/></linearGradient>`);
    let st = '';
    for (let i = 0; i < 16; i++) st += c.poly(c.star(c.rr(-FW / 2 + 14, FW / 2 - 14), c.rr(-FH / 2 + 12, 30), c.rr(2.4, 4), 1, 4, 0));
    const face = (fill, extra = '') => `<rect x="${-FW / 2}" y="${-FH / 2}" width="${FW}" height="${FH}" fill="${fill}"/>${extra}`;
    const night = B.add(`<g opacity="0">${face(`url(#${nid})`, `<path d="${st}" fill="${C.star}"/>`)}</g>`);
    const dawn = B.add(`<g opacity="0">${face(`url(#${did})`)}</g>`);
    const moonD = B.add(`<g opacity="0">${sheet().p(c.cut([...c.arc(0, 0, 12, 12, -PI * 0.6, PI * 0.6, 12), ...c.arc(5, 0, 9, 10, PI * 0.5, -PI * 0.5, 10)], 0.3, 3), C.moon).out()}</g>`);
    const rayEl = B.add(`<g opacity="0">${rays(c, { n: 13, r0: 24, r1: 58, spread: 0.08, color: '#fff3cf' })}</g>`);
    const god = B.add(`<g>${godLight(c, 24)}</g>`);
    const glowE = B.add(`<g opacity="0">${warm(110)}</g>`);
    // the chosen ones on their hill (two cut-outs: crying out, and lifted up in joy)
    const hill = sheet();
    const hfn = c.wave(84, [5, 2], [260, 90]);
    const hp = [];
    for (let x = -FW / 2; x <= FW / 2; x += 12) hp.push([x, hfn(x) - Math.max(0, 110 - Math.abs(x)) * 0.18]);
    hp.push([FW / 2, FH / 2 + 4], [-FW / 2, FH / 2 + 4]);
    hill.p(c.cut(hp, 0.6, 8), mix(C.hillNear, C.sage, 0.3));
    const folk = (armF, armB, head) => still(c, [
      { x: -70, y: 70, s: 0.4, o: womanO(c, { robe: C.roseRobe }), armF, armB, head },
      { x: -30, y: 64, s: 0.42, o: manO(c, { robe: C.dustyBlue }), armF: armF - 10, armB, head },
      { x: 10, y: 62, s: 0.42, o: womanO(c, { robe: C.sageRobe, veil: C.cream }), armF, armB: armB - 10, head },
      { x: 50, y: 66, s: 0.4, o: manO(c, { robe: C.ochreRobe }), armF: armF + 6, armB, head },
      { x: 86, y: 72, s: 0.38, o: womanO(c, { robe: C.lavender }), armF, armB, head },
    ]);
    const crying = B.add(`<g>${hill.out()}${folk(140, 150, -14)}</g>`);
    const joyful = B.add(`<g opacity="0">${folk(160, 170, -6)}</g>`);
    const cries = [0, 1, 2, 3, 4, 5].map((i) => ({ i, el: B.add(`<g opacity="0">${sparkle(c, 7, C.halo)}</g>`) }));

    /* the earth and the question */
    const earth = B.add(`<g><path d="M0 -1600V-70" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${globe(c, 70)}</g>`);
    const lampAt = [[-30, -24], [26, 8], [-26, 40], [34, -30], [4, 26]];
    const lamps = lampAt.map(([x, y], i) => ({ i, x, y, el: B.add(`<g opacity="0">${warm(16)}<path d="M0 0C-3 -3 -3 -7 0 -12C3 -7 3 -3 0 0Z" fill="${C.lampFlame}"/></g>`) }));
    const q = B.add(`<g>${question(c)}</g>`);

    return (t, time) => {
      const T = time;
      W.update(T);
      W.groups.forEach((g) => g.sp.set({ x: g.x, y: g.y }));
      if (W.disSp) W.disSp.set({ x: 560, y: GY + 6 });

      /* Jesus: points to the judge (v6), up to the flat (v7–8a), looks out over them all (v8b) */
      const toJ = es(t, 0.1, 0.3) * (1 - es(t, 1.0, 1.15));
      const up = es(t, 1.05, 1.25) * (1 - es(t, 2.95, 3.1));
      const look = es(t, 3.05, 3.25);
      W.jesus.set({ x: JX, y: GY, s: 1.06, flip: false, armF: 20 + toJ * 120 + up * 50 + look * 30, armB: 10 + up * 120 + look * 60, head: -toJ * 12 - up * 10 + look * 4, blink: blinkAt(T) });
      const [hx, hy] = headAt(JX, GY, 1.06, false);
      W.voice(hx, hy, bump(t, 0.05, 3.95) * 0.6, T, { dir: 1, spread: 1.8 });

      /* the judge's plate */
      const pk = es(t, 0.1, 0.36, ease.out) * (1 - es(t, 3.0, 3.3, ease.in));
      const aside = es(t, 1.0, 1.3);
      const px = lerp(PX, PX2, aside);
      const py = lerp(-1500, lerp(PY, PY2, aside), pk) + (T ? Math.sin(T * 0.8) * 2 : 0);
      pose(judgeP, { x: px, y: py, r: T ? Math.sin(T * 0.7) * 1.2 : 0, oy: 0 });
      pose(greyP, { x: px, y: py, o: es(t, 1.4, 1.7) * 0.55 * (pk > 0.01 ? 1 : 0) });

      /* the flat of the chosen ones */
      const kA = es(t, 1.02, 1.28, ease.out) * (1 - es(t, 3.0, 3.3, ease.in));
      const fy = lerp(-1500, FYY, kA), on = kA > 0.002 ? 1 : 0;
      const fx = S.portrait ? 735 : 760;   // phone: room for the judge's plate beside it
      pose(flatEl, { x: fx, y: fy, s: K, o: on });
      const at = (dx, dy) => [fx + dx * K, fy + dy * K];
      const nightK = es(t, 1.35, 1.6) * (1 - es(t, 2.05, 2.25));
      const dawnK = es(t, 2.05, 2.25);
      pose(night, { x: fx, y: fy, s: K, o: on * nightK * 0.94 });
      pose(dawn, { x: fx, y: fy, s: K, o: on * dawnK * 0.9 });
      const [mx, my] = at(lerp(-150, 120, seg(t, 1.35, 2.2)), -60 - Math.sin(seg(t, 1.35, 2.2) * PI) * 30);
      pose(moonD, { x: mx, y: my, s: K, o: on * nightK });
      const [gx, gy] = at(0, -FH / 2 + 30);
      pose(god, { x: gx, y: gy, s: K * (1 + dawnK * 0.2), o: on });
      pose(rayEl, { x: gx, y: gy, s: K * (0.7 + dawnK * 0.3), r: T ? Math.sin(T * 0.3) * 3 : 0, o: on * dawnK * 0.9 });
      const [ex, ey] = at(10, 20);
      pose(glowE, { x: ex, y: ey, s: K * (0.6 + dawnK * 0.5), o: on * dawnK * 0.7 });
      const joy = es(t, 2.12, 2.2);
      pose(crying, { x: fx, y: fy, s: K, o: on });
      pose(joyful, { x: fx, y: fy, s: K, o: on * joy });
      cries.forEach((p) => {
        const k = T ? (T * 0.4 + p.i / 6) % 1 : (p.i + 0.5) / 6;
        const [px, py2] = at(-70 + p.i * 30 + Math.sin(k * 5 + p.i) * 8, 0 - k * 70);
        pose(p.el, { x: px, y: py2, s: 0.8, o: on * es(t, 1.15, 1.3) * (1 - dawnK) * Math.sin(k * PI) });
      });

      /* v8b — the earth, a few lamps of faith, the question */
      const ek = es(t, 3.1, 3.4, ease.out);
      const eY = lerp(-1500, 300, ek);
      pose(earth, { x: 800, y: eY, s: 1.3, r: T ? Math.sin(T * 0.4) * 2 : 0, oy: 0 });
      lamps.forEach((l) => pose(l.el, { x: 800 + l.x * 1.3, y: eY + l.y * 1.3, s: 1 + (T ? Math.sin(T * 3 + l.i) * 0.08 : 0), o: es(t, 3.45 + l.i * 0.05, 3.6 + l.i * 0.05) * (l.i % 2 ? 0.8 : 1) }));
      const qk = es(t, 3.5, 3.68, ease.back);
      pose(q, { x: 950, y: eY - 50, s: qk * 1.4, o: qk > 0.02 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.y = -10;
      S.cam.z = 1.03;
      void lerp; void shade; void person; void halo; void kf; void flatY; void FX; void tr;
    };
  },
};
