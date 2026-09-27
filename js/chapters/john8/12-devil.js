// J 8,42–45 — "If God were your Father, you would love Me" — a heart goes out from Him toward the leaders and stops
// half-way. "I came from God; He sent Me" — a path of light runs down from the radiance to Him. "Why do you not
// understand?" — His words fall at the feet of men who have turned aside. Then a lit shadow-screen comes down: a
// dark serpent's shadow coils round a tree, as it did "from the beginning", and does not stand in the light; when
// it lies, its forked tongue flicks and a crooked, knotted strip spills out. "Because I tell the truth" — a straight
// golden strip goes out from Him, the screen goes dark and is drawn up. (Only shadows and a serpent — never a face.)
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { nightStage, DC, NIGHT, voiceRings, radiance, heart, wordSlip, framed, shadowSerpent, lightPath, drawPath, strip, kf, vis, tr, PI, INK } from './lib.js';

const SCR = { x: 990, y: 110, w: 380, h: 240 };

export default {
  id: 'j8-devil',
  beats: [
    { v: 42, text: 'Rzekł do nich Jezus: «Gdyby Bóg był waszym Ojcem, to i Mnie byście miłowali.' },
    { v: 42, cont: true, text: 'Ja bowiem od Boga wyszedłem i przychodzę. Nie wyszedłem od siebie, lecz On Mnie posłał.' },
    { v: 43 },
    { v: 44, text: 'Wy macie diabła za ojca i chcecie spełniać pożądania waszego ojca.' },
    { v: 44, cont: true, text: 'Od początku był on zabójcą i w prawdzie nie wytrwał, bo prawdy w nim nie ma.' },
    { v: 44, cont: true, text: 'Kiedy mówi kłamstwo, od siebie mówi, bo jest kłamcą i ojcem kłamstwa.' },
    { v: 45 },
  ],
  cam: { x: [-40, 120], y: [-120, 40], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const st = nightStage(S, { skyCols: NIGHT });
    const K = st.cast;
    const fx = st.fx;
    const rings = voiceRings(fx, c, { n: 3, r: 36, w: 5, both: false, color: shade(C.halo, -0.05) });
    const lightL = S.layer({ par: 0.5, sh: 1 });
    const rad = lightL.add(`<g><circle r="190" fill="url(#halo-glow)"/>${radiance(c, 48)}</g>`);
    const sent = lightL.add(lightPath(c.line(c.cbez([DC.JX, 150], [DC.JX - 60, 260], [DC.JX + 40, 380], [DC.JX, 480], 24)), { w: 7 }));
    const hrt = fx.add(`<g><circle r="46" fill="url(#warm-glow)"/>${heart(c, 20)}</g>`);
    const slips = Array.from({ length: 4 }, () => fx.add(wordSlip(c, 32)));
    // the shadow screen: a tree, and the serpent
    const tree = (() => {
      const s = sheet();
      const tx = 140, ty = SCR.h - 26;
      s.p(c.cut([[tx - 10, ty], [tx - 8, ty - 90], [tx - 30, ty - 130], [tx - 20, ty - 134], [tx, ty - 104], [tx + 22, ty - 138], [tx + 30, ty - 132], [tx + 8, ty - 92], [tx + 10, ty]], 0.8, 6), INK);
      let lv = '';
      for (let i = 0; i < 7; i++) lv += c.cut(c.blob(tx + c.rr(-60, 60), ty - c.rr(130, 180), c.rr(26, 40), c.rr(18, 26), 10, 0.2), 0.8, 6);
      s.p(lv, INK);
      let fruit = '';
      for (let i = 0; i < 5; i++) fruit += c.poly(c.circ(tx + c.rr(-50, 50), ty - c.rr(120, 170), 5, 8));
      return s.out() + `<path d="${fruit}" fill="${mix(C.terracotta, '#f7e6c4', 0.3)}"/>`;
    })();
    const scrL = S.layer({ par: 0.58, sh: 6 });
    const screen = scrL.add(`<g>${framed(S, `<rect width="${SCR.w}" height="${SCR.h}" fill="#f7e6c4"/><circle cx="${SCR.w * 0.7}" cy="${SCR.h * 0.4}" r="${SCR.w * 0.5}" fill="url(#warm-glow)" opacity=".7"/><path d="M0 ${SCR.h - 26}H${SCR.w}V${SCR.h}H0Z" fill="${mix(INK, '#f7e6c4', 0.6)}"/>${tree}`, { w: SCR.w, h: SCR.h, rim: C.wood2, bg: '#f7e6c4', k: 'dev' })}</g>`);
    const dim = scrL.add(`<g><rect x="${-SCR.w / 2}" y="0" width="${SCR.w}" height="${SCR.h}" fill="#1a1530"/></g>`);
    const snake = scrL.add(`<g>${shadowSerpent(c, '#241d33', 230)}</g>`);
    const tongue = snake.querySelector('.tongue');
    const tongueT = tongue.getAttribute('transform');
    const knot = scrL.add(`<g><path d="${c.ribbon(c.cbez([0, 0], [40, -40], [10, 40], [70, 10], 20), 5) + c.ribbon(c.cbez([70, 10], [110, -20], [80, 50], [130, 20], 16), 5)}" fill="${mix(INK, C.stone2, 0.3)}"/></g>`);
    // the shadow over "the desires of your father"
    const shid = S.id('shade');
    S.defs(`<radialGradient id="${shid}"><stop offset="0" stop-color="#120f28" stop-opacity=".7"/><stop offset=".6" stop-color="#120f28" stop-opacity=".35"/><stop offset="1" stop-color="#120f28" stop-opacity="0"/></radialGradient>`);
    const shL = S.layer({ par: 0.56, sh: 0, flat: true });
    const shadow = shL.add(`<g><ellipse rx="300" ry="190" fill="url(#${shid})"/></g>`);
    const fx2 = S.layer({ par: 0.6, sh: 5 });
    const truth = fx2.add(`<g><ellipse rx="130" ry="30" fill="url(#halo-glow)"/>${strip(c, tr('prawda', 'the truth'), { size: 24, fill: C.halo, ink: C.ink, w: 170 })}</g>`);

    return (t, time) => {
      const T = time;
      st.set.update(t, T, { lit: 1, moonY: 150, glowO: 0.7, gate: 0.6 });
      /* v42a — the heart goes out and stops half-way */
      const hk = es(t, 0.25, 0.8);
      vis(hrt, { x: lerp(DC.JX + 20, 900, hk), y: DC.FLOOR - 230 - Math.sin(hk * PI) * 30, s: 0.6 + hk * 0.4, o: hk > 0 ? 1 - es(t, 1.9, 2.1) * 0.8 : 0 });
      /* v42b — sent from God */
      const rk = es(t, 1.05, 1.35, ease.out) * (1 - es(t, 2.1, 2.4));
      vis(rad, { x: DC.JX, y: 120 - (1 - es(t, 1.05, 1.35, ease.out)) * 400, o: rk });
      drawPath(sent, es(t, 1.2, 1.75));
      fade(sent, 1 - es(t, 2.1, 2.4));
      /* v43 — the words fall at their feet */
      slips.forEach((el, i) => {
        const k = seg(t, 2.1 + i * 0.1, 2.5 + i * 0.1);
        const x = k < 0.6 ? lerp(DC.JX + 30, 930, k / 0.6) : lerp(930, 900 - i * 22, (k - 0.6) / 0.4);
        const y = k < 0.6 ? lerp(DC.FLOOR - 180, DC.FLOOR - 170, k / 0.6) : lerp(DC.FLOOR - 170, DC.FLOOR - 8, (k - 0.6) / 0.4);
        vis(el, { x, y, r: k * 160, o: k > 0 && k < 1 ? 1 : 0 });
      });
      /* v44 — the shadow screen */
      const sc = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 6.55, 6.9, ease.in));
      const dy = -(1 - sc) * 700;
      vis(screen, { x: SCR.x, y: SCR.y + dy, o: sc > 0.001 ? 1 : 0 });
      const dark = es(t, 6.2, 6.5);
      vis(dim, { x: SCR.x, y: SCR.y + dy, o: sc > 0.001 ? dark * 0.9 : 0 });
      const coil = es(t, 4.05, 4.6);
      const GX = SCR.x - SCR.w / 2, GY = SCR.y + SCR.h - 26 + dy;
      const slide = es(t, 4.6, 4.95);
      vis(snake, { x: GX + lerp(210, 60, coil) + slide * 40, y: GY - 10 - coil * 60 + slide * 50, s: 0.8, r: -coil * 20 + slide * 25, o: sc > 0.001 ? es(t, 3.3, 3.6) * (1 - dark) : 0 });
      const flick = bump(t, 5.15, 5.35) + bump(t, 5.45, 5.65);
      attr(tongue, 'transform', `${tongueT} scale(${(1 + flick * 0.6).toFixed(2)} 1)`);
      const kn = es(t, 5.3, 5.8);
      vis(knot, { x: GX + 220 + kn * 40, y: GY - 120 + kn * 50, s: 0.5 + kn * 0.6, r: kn * 30, o: sc > 0.001 && kn > 0 ? 1 - dark : 0 });
      const sh = es(t, 3.1, 3.5) * (1 - es(t, 6.1, 6.5));
      vis(shadow, { x: 1110, y: 560, s: 0.85 + sh * 0.15, o: sh });
      /* v45 — the straight golden truth */
      const tk = es(t, 6.05, 6.4, ease.out);
      vis(truth, { x: lerp(DC.JX + 40, 930, tk), y: DC.FLOOR - 250, s: 0.5 + tk * 0.5, o: tk > 0.01 ? 1 : 0 });

      const talk = Math.max(bump(t, 0.05, 1.95), bump(t, 2.05, 2.95), bump(t, 3.05, 5.95), bump(t, 6.05, 6.95));
      K.set(T, {
        j: { armF: 16 + talk * 26 + bump(t, 0.2, 0.9) * 40 + tk * 30, armB: 10 + bump(t, 1.1, 1.9) * 140, head: -bump(t, 1.1, 1.9) * 10 },
        lisF: () => ({ head: -4 }),
        leadF: (m) => {
          const aside = bump(t, 2.1, 2.95) + es(t, 6.35, 6.7);
          return { flip: !(aside > 0.5 && m.i % 2 === 0), head: aside * 8, armF: 20 + (aside > 0.5 ? 30 : 0), armB: 10 + (aside > 0.5 ? 30 : 0), angry: 0.5 };
        },
      });
      rings(DC.JX + 6, DC.FLOOR - 172, talk, T, { dir: 1, s0: 0.7, spread: 1.8 });

      S.cam.x = kf(t, [[0, 30], [1.0, 40], [1.3, 0], [2.0, 0], [2.3, 50], [3.0, 50], [3.4, 80], [6.0, 80], [6.4, 40]]);
      S.cam.y = kf(t, [[0, -20], [1.1, -80], [2.0, -60], [2.3, -10], [3.0, -10], [3.4, -100], [6.0, -100], [6.4, -30]]);
      S.cam.z = kf(t, [[0, 1.08], [1.1, 1.02], [2.3, 1.08], [3.4, 1.12], [6.0, 1.12], [6.4, 1.06]]);
    };
  },
};
