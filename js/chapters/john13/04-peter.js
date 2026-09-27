// J 13,8–11 — Peter pulls his feet away and turns his face: "Never!" A little plate comes down: the Master and
// Peter joined by a golden thread — "If I do not wash you, you have no part with Me" — and the thread parts.
// Peter at once thrusts his feet into the basin, holds out his hands and bows his head: feet — and hands — and
// head! (the thread is joined again). He who has bathed is clean all over — sparkles run over Peter from head to
// feet; "you are clean" — they light over the others too, but not all: none over Judas. He knew who would betray
// Him: He turns to Judas, sorrowful; a dark little heart at Judas' breast, his shadow long on the wall.
import { es, ease, bump, seg } from '../../core/anim.js';
import {
  washSet, WASH, EVE, JESUS, CAST, TW, C, tr, speech, bubble, footIcon, handIcon, headIcon, heart, hungPlate, mini, sparkle, shadowPerson, kf, hand, headAt,
  vis, pose, fade, lerp, blinkAt, feetAt, PI, FONT,
} from './lib.js';

export default {
  id: 'j13-peter',
  beats: [
    { v: 8, text: 'Rzekł do Niego Piotr: «Nie, nigdy mi nie będziesz nóg umywał».' },
    { v: 8, cont: true, text: 'Odpowiedział mu Jezus: «Jeśli cię nie umyję, nie będziesz miał udziału ze Mną».' },
    { v: 9 },
    { v: 10, text: 'Powiedział do niego Jezus: «Wykąpany potrzebuje tylko nogi sobie umyć, bo cały jest czysty.' },
    { v: 10, cont: true, text: 'I wy jesteście czyści, ale nie wszyscy».' },
    { v: 11 },
  ],
  cam: { x: [-120, 380], y: [100, 240], z: [1, 1.7] },
  build(S) {
    const c = S.c;
    const W = washSet(S, { skyCols: EVE });
    const { row, by, back, jK, jS, basinB, basinF, F } = W;
    const P = by.peter, JU = by.judas;
    const xP = P.x + WASH.KNEEL;
    jS.set({ o: 0 });
    /* Judas' shadow on the wall */
    const jSh = S.puppet(W.wallFx.add(`<g opacity="0">${shadowPerson(c, { ...TW.judas, pose: 'sit' }, '#2a2034')}</g>`).firstElementChild);
    const jShG = jSh.el.parentNode;
    /* the plate: the Master and Peter, a golden thread between them (two halves) */
    const plL = S.layer({ par: 0.5, sh: 4 });
    const thread = (cls, x0, x1) => `<g class="${cls}"><path d="${c.ribbon([[x0, -8], [x1, -6]], 4.6)}" fill="${C.haloRim}"/></g>`;
    const plate = plL.add(`<g>${hungPlate(c, `<circle r="60" fill="url(#halo-glow)" class="pglow" opacity=".0"/><g transform="translate(-34 40)">${mini(c, { ...JESUS, halo: false }, { sc: 0.38 })}</g><g transform="translate(36 40) scale(-1 1)">${mini(c, CAST.peter, { sc: 0.38 })}</g>${thread('tl', -16, 1)}${thread('tr', 1, 18)}<text x="0" y="64" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${C.ink}">${tr('udział ze Mną', 'a part with Me')}</text>`, { r: 82 })}</g>`);
    const tl = plate.querySelector('.tl'), trr = plate.querySelector('.tr'), pglow = plate.querySelector('.pglow');
    /* bubbles */
    const fx = S.layer({ par: 0.56, sh: 4 });
    const never = fx.add(`<g>${bubble(c, [tr('Nigdy!', 'Never!')], { size: 24, tail: -1 })}</g>`);
    const plus = (x) => `<text x="${x}" y="7" text-anchor="middle" font-family="${FONT}" font-size="22" fill="${C.terracotta}">+</text>`;
    const more = fx.add(`<g>${speech(c, `<g transform="translate(-44 2)">${footIcon(c)}</g>${plus(-22)}<g transform="translate(0 0) scale(.9)">${handIcon(c)}</g>${plus(22)}<g transform="translate(44 0)">${headIcon(c)}</g>`, { w: 150, h: 62 })}</g>`);
    /* sparkles: over Peter from head to feet; over the others; a dark heart for Judas */
    const pSp = [[-4, -120], [18, -96], [-20, -70], [26, -40], [62, -12], [-10, -30]].map(([dx, dy]) => ({ dx, dy, el: fx.add(`<g>${sparkle(c, 9)}</g>`) }));
    const others = [...row.filter((m) => m.k !== 'peter' && m.k !== 'judas').map((m) => ({ m, x: m.x, y: m.y - 150 * m.s })), ...back.map((m) => ({ m, x: m.x, y: m.y - 130 * m.s }))]
      .map((o, i) => ({ ...o, i, el: fx.add(`<g>${sparkle(c, 8)}</g>`) }));
    const dHeart = fx.add(`<g>${heart(c, 8, '#3a2f45')}</g>`);

    return (t, time) => {
      const T = time;
      W.idle(t, T, 0);
      W.R.stars.fade(0.6);

      const pull = es(t, 0.08, 0.28) * (1 - es(t, 2.05, 2.2));     // Peter pulls his feet away
      const turn = es(t, 0.1, 0.3) * (1 - es(t, 1.2, 1.5));        // …and turns his face away
      const eager = es(t, 2.05, 2.3) * (1 - es(t, 3.2, 3.5) * 0.7);
      const bob = eager * Math.abs(Math.sin(t * PI * 4)) * 4;
      const toJudas = es(t, 5.05, 5.3);
      // Peter
      pose(P.feet, { x: -22 * pull, o: 1 - pull });
      fade(P.dust, 0.75 * (1 - es(t, 2.3, 2.9)));
      fade(P.wet, 0.8 * es(t, 2.4, 2.9));
      row.forEach((m) => {
        let armF = 30, armB = 12, head = -4, lean = 0, y = m.y;
        if (m.k === 'peter') {
          armF = 30 + turn * 50 + eager * 52; armB = 12 + turn * 70 + eager * 68;
          head = -turn * 22 + es(t, 1.2, 1.5) * 4 * (1 - eager) + eager * 20;
          lean = -pull * 10 + eager * 10; y = m.y - bob;
        }
        if (m.k === 'judas') { head = 6 + es(t, 4.2, 4.5) * 8 + toJudas * 6; armF = 20; }
        m.p.set({ x: m.x, y, s: m.s, flip: false, armF, armB, head, lean, blink: blinkAt(T, m.seed) });
      });
      back.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.flip, armF: 34, armB: 12, head: 6 + (m.i % 3) * 2, blink: blinkAt(T, m.seed) }));
      fade(JU.sad, es(t, 5.2, 5.5));

      // Jesus, kneeling at Peter's feet
      const speak1 = bump(t, 1.1, 1.9), speak3 = bump(t, 3.05, 3.9);
      const sorrow = es(t, 4.2, 4.5);
      jK.set({ x: xP, y: F, s: 1, flip: toJudas < 0.5, o: 1, armF: 50 + speak1 * 10, armB: 26 + speak1 * 60 + speak3 * 80, lean: 14 - speak1 * 8 - speak3 * 8 - toJudas * 10, head: -12 - speak3 * 4 + sorrow * 10, blink: blinkAt(T) });
      fade(jK.el.querySelector('[data-part="sad"]'), sorrow);
      vis(basinB, { x: P.x + 72, y: F + 2, o: 1 });
      vis(basinF, { x: P.x + 72, y: F + 2, o: 1 });

      /* b0 — "Never!" */
      const [px, py] = headAt(P.x, F, P.s, false, 62);
      const nk = es(t, 0.15, 0.35, ease.back) * (1 - es(t, 0.95, 1.1));
      vis(never, { x: px - 30, y: py - 30, s: nk, o: nk > 0.01 ? 1 : 0 });
      /* b1 — no part with Me: the thread parts; b2 — joined again */
      const pk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 2.85, 3.1, ease.in));
      vis(plate, { x: 770, y: 385 - (1 - pk) * 700, r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: pk > 0.01 ? 1 : 0 });
      const part = es(t, 1.45, 1.8) * (1 - es(t, 2.25, 2.5));
      pose(tl, { x: -16 - part * 8, y: -8 + part * 10, r: -part * 24, ox: -16, oy: -8, o: 1 - part * 0.45 });
      pose(trr, { x: 18 + part * 8, y: -6 + part * 10, r: part * 24, ox: 18, oy: -6, o: 1 - part * 0.45 });
      fade(pglow, es(t, 2.3, 2.6) * 0.9);
      /* b2 — feet, hands and head! */
      const mk = es(t, 2.1, 2.3, ease.back) * (1 - es(t, 2.9, 3.05));
      vis(more, { x: px + 20, y: py - 34, s: mk, o: mk > 0.01 ? 1 : 0 });

      /* b3 — clean all over: sparkles over Peter */
      pSp.forEach((sp, i) => {
        const k = bump(t, 3.2 + i * 0.07, 3.9 + i * 0.05) + bump(t, 4.1, 4.9) * 0.6;
        vis(sp.el, { x: P.x + sp.dx, y: F + sp.dy, s: 0.3 + k * 0.9, r: t * 90 + i * 20, o: Math.min(1, k) });
      });
      /* b4 — you are clean (the others sparkle) but not all */
      others.forEach((o) => {
        const k = bump(t, 4.1 + (o.i % 6) * 0.06, 4.85 + (o.i % 6) * 0.03);
        vis(o.el, { x: o.x + 6, y: o.y, s: 0.3 + k * 0.8, r: t * 90, o: k });
      });
      /* b5 — He knew: Judas */
      const dk = es(t, 4.45, 4.8);
      const [jx, jy] = headAt(JU.x, F, JU.s, false, 62);
      vis(dHeart, { x: jx + 6, y: jy + 50, s: 0.4 + dk * 0.6, o: dk * 0.9 });
      jSh.set({ x: JU.x + 60, y: F - 40, s: 1.3 + toJudas * 0.3, flip: false, head: 10 + toJudas * 8 });
      fade(jShG, es(t, 4.4, 4.9) * 0.2 + toJudas * 0.08);

      S.cam.x = kf(t, [[0, -30], [1.0, -30], [1.3, -40], [2.0, -40], [2.3, -40], [3.2, -40], [4.0, -30], [4.3, 80], [5.0, 120], [5.4, 250], [6, 250]]);
      S.cam.y = kf(t, [[0, 220], [1.0, 210], [1.3, 190], [2.0, 190], [2.3, 220], [3.2, 220], [4.0, 220], [4.3, 180], [5.0, 180], [5.4, 200]]);
      S.cam.z = kf(t, [[0, 1.6], [1.0, 1.55], [1.3, 1.4], [2.0, 1.4], [2.3, 1.6], [3.2, 1.6], [4.0, 1.6], [4.3, 1.2], [5.0, 1.2], [5.4, 1.5], [6, 1.5]]);
    };
  },
};
