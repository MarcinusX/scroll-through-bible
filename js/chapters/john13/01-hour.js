// J 13,1–3 — the curtains open on the upper room: the Twelve at the long table, the lamps lit, the full moon
// in the window. Before the Passover: a plate of the feast comes down. His hour has come — an hourglass above Him
// runs out, while a soft radiance (the Father — never a figure) glows above. Having loved His own, He loved them
// to the end: a heart of light over the table, and threads of light run from it to every one of them, to the very
// ends of the table. During supper: bread is passed. And already a small shadow has crept to Judas' heart (his
// thread dims). Knowing the Father had given all things into His hands, that He came from God and goes to God:
// a little world of light rests in His open hands, and a ring of light comes down from the radiance and returns.
import { curtains } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { lamb, matzahRound } from '../mark14/lib.js';
import {
  tableSet, EVE, JX, C, tr, pose, fade, attr, vis, kf, headAt, hand, hourglassRig, radiance, glowDisc, rayBurst, threads, lightHeart,
  hungPlate, iconWord, nameTag, heart, shadowPerson, TW, globe, strip, hanging, swing, lerp, PI,
} from './lib.js';

export default {
  id: 'j13-hour',
  beats: [
    { cover: true },
    { v: 1, text: 'Było to przed Świętem Paschy.' },
    { v: 1, cont: true, text: 'Jezus wiedząc, że nadeszła Jego godzina przejścia z tego świata do Ojca,' },
    { v: 1, cont: true, text: 'umiłowawszy swoich na świecie, do końca ich umiłował.' },
    { v: 2, text: 'W czasie wieczerzy,' },
    { v: 2, cont: true, text: 'gdy diabeł już nakłonił serce Judasza Iskarioty syna Szymona, aby Go wydać,' },
    { v: 3 },
  ],
  cam: { x: [-40, 120], y: [-160, 160], z: [1, 1.55] },
  build(S) {
    const c = S.c;
    const T0 = tableSet(S, { skyCols: EVE });
    const { R, at, by, SEAT, TOP } = T0;
    const J = by.jesus, JU = by.judas;

    /* a dark hush on the wall behind Judas */
    S.defs(`<radialGradient id="${S.id('hush')}"><stop offset="0" stop-color="#1d1628" stop-opacity=".55"/><stop offset="1" stop-color="#1d1628" stop-opacity="0"/></radialGradient>`);
    const hush = T0.wallFx.add(`<g><circle r="150" fill="url(#${S.id('hush')})"/></g>`);
    const jShadow = S.puppet(T0.wallFx.add(`<g opacity="0">${shadowPerson(c, { ...TW.judas, pose: 'sit' }, '#2a2034')}</g>`).firstElementChild);
    const jShadowG = jShadow.el.parentNode;

    /* the light above: the radiance, a beam, the ring from God to God */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const RY = 250;
    const rad = lightL.add(`<g>${glowDisc(260, 'halo-glow', 0.9)}${rayBurst(c, { n: 20, r0: 40, r1: 210, spread: 0.035, o: 0.4 })}<g transform="scale(.42)">${radiance(c, 150)}</g></g>`);
    const beam = lightL.add(`<g><path d="M-26 0L26 0L90 330L-90 330Z" fill="#fff3cf" opacity=".32"/></g>`);
    const loopD = (() => {
      const pts = [];
      for (let i = 0; i <= 40; i++) { const a = -PI / 2 + (i / 40) * PI * 2; pts.push([Math.cos(a) * 120, 170 + Math.sin(a) * 170]); }
      return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
    })();
    const LOOP_LEN = 940;
    const loop = lightL.add(`<g><path d="${loopD}" fill="none" stroke="#fff1c4" stroke-width="6" stroke-linecap="round" stroke-dasharray="${LOOP_LEN}" stroke-dashoffset="${LOOP_LEN}"/></g>`);
    const loopP = loop.firstElementChild;
    const spark = lightL.add(`<g>${glowDisc(40, 'halo-glow', 1)}<circle r="6" fill="#fffdf4"/></g>`);
    const handGlow = lightL.add(`<g>${glowDisc(90, 'warm-glow', 0.9)}</g>`);

    /* love to the end: the heart and the threads */
    const loveL = S.layer({ par: 0.5, sh: 2 });
    const thr = threads(loveL, 12, { color: C.haloRim, w: 2.2 });
    const heartEl = loveL.add(`<g>${lightHeart(c, 28)}</g>`);
    const world = loveL.add(`<g>${glowDisc(70, 'halo-glow', 0.9)}${globe(c, 26)}</g>`);
    const curl = loveL.add(`<g>${heart(c, 9, '#3a2f45')}</g>`);
    const breads = [0, 1, 2].map(() => loveL.add(`<g>${matzahRound(c, 12)}</g>`));

    /* hanging: the Passover plate, the hourglass, Judas' tag */
    const hangL = S.layer({ par: 0.5, sh: 4 });
    const pascha = hangL.add(`<g>${hungPlate(c, iconWord(`<g transform="translate(-22 16) scale(.7)">${lamb(c)}</g><g transform="translate(22 -6)">${matzahRound(c, 15)}</g>`, tr('Pascha', 'Passover'), { size: 18, y: 42 }), { r: 62 })}</g>`);
    const glass = hourglassRig(hangL, c, 110);
    const gString = hangL.add(`<g><path d="M0 -1600V-55" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);
    const hourTag = hangL.add(`<g>${strip(c, tr('Jego godzina', 'His hour'), { size: 17 })}</g>`);
    const jTag = hanging(hangL, nameTag(c, tr(['Judasz Iskariota,', 'syn Szymona'], ['Judas Iscariot,', 'son of Simon']), { size: 15, dark: true }), { x: 0, y: 0, len: 600 });
    const cur = curtains(S);

    const heartAt = [JX, 420];
    const chest = (m) => { const [hx, hy] = headAt(m.x, SEAT, m.s, m.flip, 62); return [hx + (m.flip ? -4 : 4), hy + 44 * m.s]; };
    const order = at.filter((m) => m.k !== 'jesus').map((m) => ({ m, d: Math.abs(m.x - JX) }));

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      T0.idle(t, T, 0);
      R.stars.fade(0.6);

      /* b1 — before the Passover: the plate of the feast comes down */
      const pk = es(t, 1.05, 1.5, ease.out) * (1 - es(t, 1.9, 2.2, ease.in));
      vis(pascha, { x: 640, y: 300 - (1 - pk) * 600, r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: pk > 0.01 ? 1 : 0 });

      /* b2 — His hour: the hourglass runs out; the radiance of the Father above */
      const gk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 3.1, 3.4, ease.in));
      const gy = 380 - (1 - gk) * 600;
      const gx = 640;
      vis(glass.el, { x: gx, y: gy, r: T ? Math.sin(T * 0.8) * 1 : 0, o: gk > 0.01 ? 1 : 0 });
      vis(gString, { x: gx, y: gy, o: gk > 0.01 ? 1 : 0 });
      vis(hourTag, { x: gx, y: gy + 82, o: gk > 0.01 ? es(t, 2.3, 2.5) : 0 });
      const level = 1 - es(t, 2.3, 2.95, (x) => x);
      glass.set(level, level > 0.02 ? 1 : 0);
      const radK = Math.max(es(t, 2.2, 2.6) * (1 - es(t, 3.0, 3.3) * 0.7) * (1 - es(t, 4.0, 4.3)), es(t, 6.05, 6.4));
      vis(rad, { x: JX, y: RY, s: 0.8 + radK * 0.25, o: radK });
      const bk = es(t, 2.35, 2.7) * (1 - es(t, 3.0, 3.2)) + bump(t, 6.2, 6.95) * 0.8;
      vis(beam, { x: JX, y: RY + 20, o: bk });

      /* b3 — loved them to the end: heart of light, threads to all */
      const hk = es(t, 3.05, 3.35, ease.back) * (1 - es(t, 4.1, 4.4));
      vis(heartEl, { x: heartAt[0], y: heartAt[1] + (T ? Math.sin(T * 1.4) * 3 : 0), s: 0.2 + hk * 0.8 + (T ? Math.sin(T * 2.2) * 0.03 * hk : 0), o: hk > 0.01 ? 1 : 0 });
      order.forEach(({ m, d }, i) => {
        const a = 3.2 + (d / 380) * 0.45;
        const k = es(t, a, a + 0.18) * (1 - es(t, 4.1, 4.35));
        const [cx, cy] = chest(m);
        const judas = m.k === 'judas';
        const o = k * (judas ? 1 - es(t, 5.3, 5.7) * 0.75 : 1);
        thr(i, heartAt[0], heartAt[1] + 10, lerp(heartAt[0], cx, k), lerp(heartAt[1] + 10, cy, k), o * 0.95);
      });

      /* b4 — during supper: bread is passed along; b5 — the shadow at Judas' heart */
      const eating = es(t, 4.05, 4.2) * (1 - es(t, 5.05, 5.2));
      const eye = es(t, 5.15, 5.4) * (1 - es(t, 6.0, 6.2));
      const give = es(t, 6.05, 6.35);
      at.forEach((m) => {
        let armF = 36, armB = 14, head = 0, lean = 0;
        armF += eating * (20 + Math.sin((t - 4) * PI * 4 + m.seed) * 22);
        head += eating * Math.sin((t - 4) * PI * 3 + m.seed) * 4;
        if (m.k === 'jesus') {
          armF = 36 + es(t, 2.3, 2.6) * 10 * (1 - es(t, 3.0, 3.2)) + give * 22;
          armB = 14 + give * 44;
          head = -es(t, 2.3, 2.6) * 10 * (1 - es(t, 3.0, 3.2)) + es(t, 3.1, 3.4) * 4 * (1 - es(t, 4, 4.2)) - give * 8 + eye * 6;
        } else {
          head += es(t, 3.3, 3.6) * (1 - es(t, 4, 4.2)) * -4;
          if (m.k === 'judas') { head += eye * 16; armF = armF * (1 - eye) + eye * 20; }
        }
        T0.sit(m, T, { armF, armB, head, lean });
      });
      breads.forEach((b, i) => {
        const u = seg(t, 4.1 + i * 0.12, 4.75 + i * 0.12);
        const x0 = [760, 700, 880][i], x1 = [560, 1000, 1140][i];
        vis(b, { x: lerp(x0, x1, ease.io(u)), y: TOP - 12 - Math.sin(u * PI) * 28, r: u * 200, o: u > 0 && u < 1 ? 1 : 0 });
      });
      pose(hush, { x: JU.x + 10, y: SEAT - 100, s: 0.4 + eye * 0.8, o: eye });
      fade(hush, eye);
      const ck = es(t, 5.3, 5.8);
      const [jcx, jcy] = chest(JU);
      vis(curl, { x: jcx - 2, y: jcy + 4, s: 0.3 + ck * 0.7, o: ck * 0.9 * (1 - es(t, 6.0, 6.2)) });
      jShadow.set({ x: JU.x + 26, y: SEAT - 6, s: JU.s * (1.2 + eye * 0.5), flip: true, head: eye * 16 });
      fade(jShadowG, eye * 0.24);
      const tk = es(t, 5.1, 5.4, ease.out) * (1 - es(t, 6.0, 6.2, ease.in));
      vis(jTag, { x: JU.x + 30, y: 420 - (1 - tk) * 600, r: T ? Math.sin(T * 0.8 + 1) * 1.2 : 0, o: tk > 0.01 ? 1 : 0 });

      /* b6 — all things in His hands; from God, to God: the ring of light */
      const wk = es(t, 6.15, 6.45, ease.back);
      vis(world, { x: JX + 34, y: TOP - 34 - (1 - wk) * 60, s: wk * 0.9, r: T ? T * 8 : 0, o: wk > 0.01 ? 1 : 0 });
      vis(handGlow, { x: JX + 34, y: TOP - 34, o: wk * 0.9 });
      const lk = seg(t, 6.3, 6.95);
      vis(loop, { x: JX, y: RY + 10, o: lk > 0 ? 1 - es(t, 7.0, 7.2) * 0.4 : 0 });
      attr(loopP, 'stroke-dashoffset', (LOOP_LEN * (1 - lk)).toFixed(1));
      const a = -PI / 2 + lk * PI * 2;
      vis(spark, { x: JX + Math.cos(a) * 120, y: RY + 10 + 170 + Math.sin(a) * 170, o: lk > 0 && lk < 1 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 0], [1.2, -30], [2.0, -20], [2.6, -20], [3.1, 0], [4.1, 0], [5.05, 20], [5.4, 70], [6.0, 70], [6.35, 0]]);
      S.cam.y = kf(t, [[0, 90], [1.2, 60], [2.0, 10], [2.6, 10], [3.1, 70], [4.1, 120], [5.05, 130], [5.4, 150], [6.0, 150], [6.35, 30], [7, 20]]);
      S.cam.z = kf(t, [[0, 1.1], [1.2, 1.15], [2.0, 1.15], [2.6, 1.2], [3.1, 1.12], [4.1, 1.2], [5.05, 1.25], [5.4, 1.5], [6.0, 1.5], [6.35, 1.2], [7, 1.25]]);
    };
  },
};
