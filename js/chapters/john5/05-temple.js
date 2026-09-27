// J 5,14–18 — in the Temple court the healed man is giving thanks; Jesus finds him: "See, you are well" —
// a soft light round him — "Sin no more, that nothing worse befall you": a dark cloud that hung behind him
// shrinks away. The man goes and tells the leaders it was Jesus. They come at Jesus for doing this on the
// Sabbath; He answers them: "My Father is working until now, and I am working" — a great light over the
// sanctuary, the sun rolls on along its arc, a flower springs up from the paving, a golden thread runs down to
// His hand. So they seek all the more to kill Him (their side darkens, stones in their hands) — for He called
// God His own Father, making Himself equal to God: the balance hangs level, the light and His halo.
import { C, person, CAST, blinkAt, lerp, mix, shade } from '../kit.js';
import { stormCloud } from '../../assets/things.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import {
  templeCourt, courtFront, HEALED, leaderOpts, withFace, faceBits, sabbathTag, hang2, iconBubble, medallion, hungWord, radiance, rayBurst, glory,
  sprout, balanceRig, darkSheet, spark, tick, vis, kf, headAt, handAt, swing, tr, PI,
} from './lib.js';

const FLOOR = 690;
const SKY = ['#d3dfd6', '#f2e2c4', '#f6dcbc'];

/** a stone, held in a fist (hold coords) */
function stone(c) { return `<path d="${c.cut(c.blob(0, 6, 9, 7, 9, 0.2), 0.4, 3)}" fill="${mix(C.rock2, C.stone2, 0.4)}"/>`; }

export default {
  id: 'j5-temple',
  beats: [
    { v: 14, text: 'Potem Jezus znalazł go w świątyni i rzekł do niego:' },
    { v: 14, cont: true, text: '«Oto wyzdrowiałeś.' },
    { v: 14, cont: true, text: 'Nie grzesz już więcej, aby ci się coś gorszego nie przydarzyło».' },
    { v: 15 },
    { v: 16 },
    { v: 17, text: 'Lecz Jezus im odpowiedział:' },
    { v: 17, cont: true, text: '«Ojciec mój działa aż do tej chwili i Ja działam».' },
    { v: 18, text: 'Dlatego więc usiłowali Żydzi tym bardziej Go zabić,' },
    { v: 18, cont: true, text: 'bo nie tylko nie zachowywał szabatu, ale nadto Boga nazywał swoim Ojcem, czyniąc się równym Bogu.' },
  ],
  cam: { x: [-60, 80], y: [-80, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const TC = templeCourt(S, { skyCols: SKY, floorY: FLOOR + 40, sanctX: 800, sunAt: [420, 170] });
    const { sk, sunEl, cl1 } = TC;

    /* the light of the Father above the sanctuary (never a figure) */
    const holyL = S.layer({ par: 0.16, sh: 1, flat: true });
    const holy = holyL.add(`<g>${rayBurst(c, { n: 20, r0: 60, r1: 620, spread: 0.05, o: 0.7 })}<circle r="240" fill="url(#halo-glow)"/></g>`);
    const upL = S.layer({ par: 0.2, sh: 4 });
    const rad = upL.add(`<g>${radiance(c, 70)}</g>`);
    const thread = upL.add(`<g><path class="th" d="" stroke="${C.halo}" stroke-width="5" stroke-linecap="round" fill="none"/></g>`);
    const thP = thread.querySelector('.th');

    /* the darkness that gathers on the leaders' side */
    const darkL = S.layer({ par: 0.3, sh: 0, flat: true, pad: 500 });
    darkL.add(`<g transform="translate(1180 470)">${darkSheet(c, 1, { col: '#2a2440' })}</g>`);

    /* people */
    const L = S.layer({ par: 0.5, sh: 6 });
    const glowM = L.add(`<g><circle r="130" fill="url(#halo-glow)"/></g>`);
    const cloudEl = L.add(`<g>${stormCloud(c, 150, mix(C.storm2, C.plumRobe, 0.2), C.storm2)}</g>`);
    const flower = L.add(`<g>${sprout(c, 80)}</g>`);
    const LEAD = [0, 1, 2, 3].map((i) => {
      const el = L.add(withFace(person(c, { ...leaderOpts(i), holdF: `<g class="st">${stone(c)}</g>` }), faceBits(c)));
      return { i, el, p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), st: el.querySelector('.st'), x: [1060, 1150, 1240, 1320][i], seed: c.rr(0, 9) };
    });
    const manEl = L.add(withFace(person(c, HEALED), faceBits(c)));
    const man = S.puppet(manEl);
    const jesus = S.puppet(L.add(person(c, { ...CAST.jesus })));
    const shadowsEl = [0, 1, 2, 3].map(() => L.add(`<g><path d="${c.cut([[0, 0], [-240, 6], [-250, 22], [0, 14]], 0.6, 8)}" fill="#2a2440" opacity=".35"/></g>`));

    /* the flies */
    const X = S.layer({ par: 0.36, sh: 5 });
    const okPlate = X.add(`<g>${hang2(`<circle r="46" fill="${C.cream}"/><circle r="46" fill="none" stroke="${C.haloRim}" stroke-width="8"/><g transform="scale(1.6)">${tick(c, 16, C.moss)}</g>`, 0.01, 400)}</g>`);
    const tellB = X.add(`<g>${iconBubble(c, `<circle r="26" fill="${C.halo}"/>${medallion(c, CAST.jesus, { r: 22 })}`, { w: 96, h: 86, side: -1 })}</g>`);
    const nameT = X.add(hungWord(c, tr('Jezus', 'Jesus'), { size: 26 }));
    const sab = X.add(`<g>${hang2(`<g transform="scale(1.2)">${sabbathTag(c, tr('szabat', 'the Sabbath'))}</g>`, 56, 400)}</g>`);
    const bal = balanceRig(S, X, 150);
    const onL = X.add(`<g>${radiance(c, 30)}</g>`);
    const onR = X.add(`<g><circle r="40" fill="url(#halo-glow)"/><path d="${c.cut(c.star(0, 0, 30, 26, 18, 0), 0.3, 4)}" fill="${C.haloRim}"/><path d="${c.cut(c.circ(0, 0, 25, 24), 0.3, 4)}" fill="${C.halo}"/>${medallion(c, CAST.jesus, { r: 16 }).replace(/<path class="gsh[^>]*>/g, '')}</g>`);
    const eqT = X.add(hungWord(c, tr('równy Bogu', 'equal with God'), { size: 20 }));
    courtFront(S, { xs: [210, 1390] });

    return (t, time) => {
      const T = time;
      /* v17b — the sun keeps on its way: the Father is working */
      const work = es(t, 6.05, 6.9);
      swing(sunEl, lerp(420, 620, work), 170 - Math.sin(work * PI) * 30, T, 1, 0.6);
      swing(cl1, 470 + Math.sin(T * 0.1) * 26, 140, T, 1.3, 0.6, 1);
      const dark = es(t, 7.05, 7.5) * (1 - es(t, 8.7, 9.0) * 0.4);
      darkL.fade(dark * 0.32);
      darkL.shift((1 - dark) * 500, 0);
      sk.blend(SKY, ['#c9c6cf', '#e6d6c2', '#efd2b6'], dark * 0.5);

      /* v14a — Jesus finds him in the Temple */
      const JK = [[-0.2, 330], [0.6, 700]];
      const jx = kf(t, JK, ease.out);
      const walking = t > -0.2 && t < 0.6;
      const speak = bump(t, 1.05, 2.95);
      const warn = bump(t, 2.05, 2.95);
      const face = es(t, 4.1, 4.4);         // turns to the leaders
      const answer = bump(t, 5.05, 6.95);
      const up = es(t, 6.1, 6.4) * (1 - es(t, 6.9, 7.1));
      jesus.set({ x: jx, y: FLOOR + 14, s: 1.05, flip: false, walk: walking ? jx * 0.07 : undefined, armF: 20 + es(t, 0.55, 0.8) * 50 * (1 - es(t, 1.0, 1.2)) + speak * 50 + answer * 40, armB: 10 + warn * 60 + up * 130, head: -speak * 4 + face * 4, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(700, FLOOR + 14, 1.05, false);

      /* the man: praying → turns → is told → goes to the leaders */
      const turn = es(t, 0.55, 0.7);
      const GK = [[3.05, 860], [3.6, 1010]];
      const mx = kf(t, GK, ease.io);
      const mGo = t > 3.05 && t < 3.6;
      const point = bump(t, 3.5, 4.0);
      const bow = bump(t, 2.3, 2.95);
      const leave = es(t, 4.0, 4.5, ease.in);
      const mxx = lerp(mx, 1600, leave);
      man.set({ x: t < 3.05 ? 860 : mxx, y: FLOOR + 10, s: 1, flip: t < 0.62 ? false : t < 3.05 ? true : t < 3.5 ? false : t < 4.0, walk: mGo || (leave > 0 && leave < 1) ? mxx * 0.09 : undefined, armF: 110 * (1 - turn) + bump(t, 1.05, 1.95) * 50 + point * 80, armB: 140 * (1 - turn) + bump(t, 1.1, 1.9) * 90, head: -16 * (1 - turn) + bow * 16, lean: bow * -6, blink: blinkAt(T, 2), o: 1 - seg(t, 4.35, 4.5) });
      const [mhx, mhy] = headAt(860, FLOOR + 10, 1, true);
      /* v14b — "See, you are well" */
      const ok = es(t, 1.1, 1.35, ease.out) * (1 - es(t, 1.9, 2.1));
      vis(okPlate, { x: 860, y: 250 - (1 - ok) * 460, r: Math.sin(T * 0.8) * 2, o: ok > 0.01 ? 1 : 0 });
      vis(glowM, { x: 860, y: FLOOR - 110, s: 0.8 + bump(t, 1.05, 2.1) * 0.5, o: bump(t, 1.0, 2.2) });
      /* v14c — "Sin no more": a dark cloud behind him shrinks away */
      const cl = es(t, 1.95, 2.2) * (1 - es(t, 2.62, 2.97));
      vis(cloudEl, { x: 950 + (1 - cl) * 60, y: FLOOR - 250, s: 0.4 + cl * 0.7, o: cl > 0.01 ? Math.min(1, cl * 1.4) : 0 });

      /* v15 — he tells the leaders: it was Jesus */
      const tk = es(t, 3.55, 3.75, ease.back) * (1 - es(t, 3.98, 4.05));
      const [thx, thy] = headAt(1010, FLOOR + 10, 1, false);
      vis(tellB, { x: thx - 14, y: thy - 22, s: tk, o: tk > 0.01 ? 1 : 0 });
      const nk = es(t, 3.6, 3.9, ease.back) * (1 - es(t, 4.8, 5.1));
      vis(nameT, { x: 700, y: 250 - (1 - nk) * 460, r: Math.sin(T * 0.7) * 1.5, o: nk > 0.01 ? 1 : 0 });

      /* v16 — they come at Him for the Sabbath; v18 — stones, and all the more */
      const come = es(t, 4.05, 4.6, ease.out);
      const stones = es(t, 7.15, 7.4);
      const outrage = bump(t, 8.1, 9.0);
      LEAD.forEach((l) => {
        const x = lerp(l.x + 120, l.x - 130 + l.i * -6, come);
        const y = FLOOR + 10 - (l.i % 2) * 8;
        const pointAt = bump(t, 4.2, 5.0) * (l.i < 2 ? 1 : 0.4);
        l.p.set({ x, y, s: 1, flip: true, walk: come > 0 && come < 1 ? x * 0.08 : undefined, armF: 20 + pointAt * 70 + stones * 30, armB: 10 + (l.i === 1 ? bump(t, 4.3, 5.0) * 120 : 0) + outrage * (l.i % 2 ? 150 : 120), head: -outrage * 10 + bump(t, 6.2, 6.9) * -10, lean: -pointAt * 5 + outrage * 3, blink: blinkAt(T, l.seed) });
        attr(l.angry, 'opacity', Math.max(es(t, 3.7, 4.1), 0).toFixed(2));
        attr(l.st, 'opacity', stones.toFixed(2));
      });
      shadowsEl.forEach((sh, i) => {
        const l = LEAD[i];
        const x = lerp(l.x + 120, l.x - 130 + l.i * -6, come);
        vis(sh, { x: x - 20, y: FLOOR + 10 - (l.i % 2) * 8, sx: 0.3 + come * 0.6 + dark * 0.5, o: es(t, 4.1, 4.6) * 0.8 });
      });
      const sabK = es(t, 4.2, 4.5, ease.back) * (1 - es(t, 5.0, 5.3));
      vis(sab, { x: 1080, y: 200 - (1 - sabK) * 480, r: Math.sin(T * 0.8) * 1.5, o: sabK > 0.01 ? 1 : 0 });

      /* v17 — "My Father is working until now, and I am working" */
      const hk = es(t, 5.95, 6.3) * (1 - es(t, 7.05, 7.4) * 0.6);
      fade(holy, hk);
      pose(holy, { x: 800, y: 170, r: T * 2, s: 0.8 + hk * 0.2 });
      vis(rad, { x: 800, y: 140 - (1 - es(t, 5.95, 6.25, ease.out)) * 400, r: Math.sin(T * 0.4) * 3, o: hk > 0.01 ? 1 : 0 });
      const th = es(t, 6.2, 6.5) * (1 - es(t, 7.0, 7.2));
      const [hx, hy] = handAt(700, FLOOR + 14, 1.05, false, 10 + 130);
      if (th > 0.01) attr(thP, 'd', `M800 ${140 + 70}Q${(800 + hx) / 2 + 40} ${(210 + hy) / 2 - 40} ${lerp(800, hx - 16, th).toFixed(1)} ${lerp(210, hy - 60, th).toFixed(1)}`);
      fade(thread, th > 0.01 ? 1 : 0);
      const fl = es(t, 6.35, 6.8, ease.out);
      vis(flower, { x: 820, y: FLOOR + 10, sy: Math.max(0.02, fl), o: fl > 0.01 ? 1 - es(t, 8.8, 9.0) * 0 : 0 });

      /* v18b — equal with God: the balance hangs level */
      const bk = es(t, 8.1, 8.45, ease.out);
      const tilt = Math.sin(Math.max(0, t - 8.3) * 7) * 12 * Math.max(0, 1 - (t - 8.3) * 1.6) * (t > 8.3 ? 1 : 0);
      const [pl, pr] = bal.set(800, 170 - (1 - bk) * 520, tilt, bk > 0.01 ? 1 : 0);
      vis(onL, { x: pl[0], y: pl[1] + 70, o: bk > 0.01 ? 1 : 0 });
      vis(onR, { x: pr[0], y: pr[1] + 66, o: bk > 0.01 ? 1 : 0 });
      const ek = es(t, 8.5, 8.7, ease.back);
      vis(eqT, { x: 800, y: 350 - (1 - ek) * 500, r: Math.sin(T * 0.7) * 1, o: ek > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.3, -40], [0.6, 0], [1.5, 30], [3.0, 30], [3.6, 80], [4.5, 60], [5.5, 30], [6.2, 0], [7.2, 40], [8.2, 0]]);
      S.cam.y = kf(t, [[-0.3, 20], [1.0, 20], [3.0, 20], [5.0, 10], [6.2, -50], [7.0, 0], [8.1, -40]]);
      S.cam.z = kf(t, [[-0.3, 1.06], [1.0, 1.14], [3.0, 1.14], [4.5, 1.06], [6.2, 1.02], [7.2, 1.1], [8.1, 1.02]]);
    };
  },
};
