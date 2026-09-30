// J 9,30–34 — the man answers them. "How amazing! You don't know where He comes from — and He opened my eyes":
// the road-into-mist card beside a shining open eye, and a "!". "God does not listen to sinners, but to one who
// worships Him and does His will": a picture — someone kneeling, and gold rings of prayer rising to the light,
// while a dark scrap sinks. "Never since the world began has anyone opened the eyes of one born blind": a long
// scroll of the ages unrolls — the tablets, the crown, the prophets' scroll, each with a closed eye — and at its
// end an open eye in gold. "If He were not from God, He could do nothing": a beam falls from above onto a card
// of Jesus. "You were born entirely in sins — and you teach us?" — a cradle ringed with dark scraps. And they
// throw him out: he is walked to the door, it shuts behind him, and a dark bar drops across it.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  hallSet, H, SEER, manPuppet, officials, offSet, iconBubble, say, medallion, framed, whenceInner, eyeIcon, qmark, bang, darkScrap, soundRings,
  lawTablets, crownIcon, scrollOpen, cradle, baby, hungPlate, iconWord, spark, beamGrad, lightBeam, radiance, hanging, drop, kf, moving, headAt, vis,
  tr, pose, mix, sheet, PI, DY, FONT, INK,
} from './lib.js';

const MX = H.MANX + 20;

export default {
  id: 'j9-marvel',
  beats: [
    { v: 30, text: 'Na to odpowiedział im ów człowiek:' },
    { v: 30, cont: true, text: '«W tym wszystkim to jest dziwne, że wy nie wiecie, skąd pochodzi, a mnie oczy otworzył.' },
    { v: 31 },
    { v: 32 },
    { v: 33 },
    { v: 34, text: 'Na to dali mu taką odpowiedź: «Cały urodziłeś się w grzechach, a śmiesz nas pouczać?»' },
    { v: 34, cont: true, text: 'I precz go wyrzucili.' },
  ],
  cam: { x: [-60, 350], y: [-110, 40], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const hall = hallSet(S);
    const offL = S.layer({ par: 0.46, sh: 5 });
    const offs = officials(S, offL);
    const act = S.layer({ par: 0.5, sh: 5 });
    const man = manPuppet(S, act, SEER, {});

    const fx = S.layer({ par: 0.52, sh: 5 });
    const jMed = `<circle r="30" fill="${C.halo}" opacity=".7"/>${medallion(c, CAST.jesus, { r: 23 })}`;
    const amazing = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-44 0) scale(.8)">${jMed}</g><g transform="translate(-10 4) scale(1.1)">${qmark(c, C.inkSoft)}</g><g transform="translate(34 0)"><circle r="34" fill="url(#warm-glow)"/>${eyeIcon(c, { r: 18 })}</g><g transform="translate(64 0)">${bang(c, C.terracotta, 1)}</g>`, { w: 190, h: 86, side: 1 })}</g>`);
    const born = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(0 24) scale(.62)">${cradle(c, 80)}</g><g transform="translate(2 -10) scale(.7)">${baby(c)}</g><g transform="translate(-44 -14)">${darkScrap(c, 10)}</g><g transform="translate(44 -10)">${darkScrap(c, 11)}</g><g transform="translate(-40 18)">${darkScrap(c, 9)}</g><g transform="translate(42 20)">${darkScrap(c, 9)}</g>`, { w: 140, h: 100, side: -1 })}</g>`);

    /* plates */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    // v31 — prayer rising to the light, a dark scrap sinking
    const prayInner = (() => {
      const w = 300, h = 190;
      let m = `<rect x="0" y="0" width="${w}" height="${h}" fill="${mix(C.parchment, C.skyBlue, 0.3)}"/><circle cx="${w * 0.36}" cy="34" r="70" fill="url(#halo-glow)"/>`;
      m += `<g transform="translate(${w * 0.36} 34) scale(.18)">${radiance(c, 150)}</g>`;
      m += `<g transform="translate(${w * 0.3} ${h - 10}) scale(.42)">${person(c, { ...SEER, pose: 'kneel' })}</g>`;
      m += `<rect x="0" y="${h - 12}" width="${w}" height="12" fill="${mix(C.stone2, C.sand2, 0.4)}"/>`;
      return m;
    })();
    const pray = hanging(hangL, framed(S, prayInner, { w: 300, h: 190, k: 'pray' }), { x: 0, y: 0, len: 900 });
    const prayL = S.layer({ par: 0.3, sh: 0, flat: true });
    const rings = Array.from({ length: 4 }, (_, i) => ({ i, el: prayL.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 16, 7, PI, 2 * PI, 12), 2.6)}" fill="${C.haloRim}"/></g>`) }));
    const sink = prayL.add(`<g opacity="0">${darkScrap(c, 12)}</g>`);
    // v32 — the scroll of the ages
    const CELL = 96, N = 4, SW = CELL * N;
    const scrollInner = (() => {
      let m = sheet().p(c.cut(c.rect(0, 0, SW, 120), 0.5, 8), C.parchment).x(c.ribbon([[0, 6], [SW, 6]], 1.4) + c.ribbon([[0, 114], [SW, 114]], 1.4), C.wood3, 'opacity=".6"').out();
      for (let i = 1; i < N; i++) m += `<path d="${c.ribbon([[i * CELL, 12], [i * CELL, 108]], 1.2)}" fill="${C.wood3}" opacity=".5"/>`;
      const icons = [`<g transform="translate(0 30) scale(.5)">${lawTablets(c, { w: 50, h: 70 })}</g>`, `<g transform="translate(0 20)">${crownIcon(c, 40)}</g>`, `<g transform="translate(0 6)">${sheet().p(c.cut(c.rect(-22, -8, 44, 16), 0.3, 4), C.cream).p(c.cut(c.ell(-23, 0, 4, 10, 8), 0.2, 3) + c.cut(c.ell(23, 0, 4, 10, 8), 0.2, 3), C.wood2).out()}</g>`];
      icons.forEach((ic, i) => { m += `<g transform="translate(${i * CELL + CELL / 2} 36)">${ic}</g><g transform="translate(${i * CELL + CELL / 2} 86)">${eyeIcon(c, { r: 13, open: false })}</g>`; });
      m += `<g transform="translate(${3 * CELL + CELL / 2} 60)"><circle r="50" fill="url(#warm-glow)"/>${eyeIcon(c, { r: 22 })}</g>`;
      return m;
    })();
    const rollers = (x) => sheet().p(c.cut(c.rect(x - 8, -8, 16, 136), 0.3, 5), C.wood2).out();
    const ages = hangL.add(`<g><g class="sc">${scrollInner}</g>${''}</g>`);
    const sc = ages.querySelector('.sc');
    const rollL = hangL.add(`<g>${rollers(0)}</g>`);
    const rollR = hangL.add(`<g>${rollers(0)}</g>`);
    const agesStr = hangL.add(`<g opacity="0"><path d="M0 -1600V0M${SW} -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);
    // v33 — from God: a beam from above onto a card of Jesus
    const bId = beamGrad(S, 'fromgod');
    const fromGod = hanging(hangL, `<g transform="translate(0 -260)">${lightBeam(bId, 30, 150, 260)}</g>` + hungPlate(c, `<g transform="translate(0 -2)">${jMed}</g>`, { r: 60 }), { x: 0, y: 0, len: 900 });

    hall.front();
    const P = S.portrait;

    return (t, time) => {
      const T = time;
      /* v34b — thrown out: walked to the door, it shuts behind him, the bar drops */
      const open = es(t, 6.02, 6.12) * (1 - es(t, 6.46, 6.58));
      const bar = es(t, 6.56, 6.72, ease.in);
      hall.door(open, bar);
      const outK = es(t, 6.06, 6.44, ease.io);
      const mx = lerp(MX, H.DOORX + 54, outK), my = lerp(H.FLOOR + 8, H.BASE - 2, outK), ms = lerp(1.02, 0.8, outK);
      const step = bump(t, 0.05, 0.9), amaze = bump(t, 1.05, 1.95), teach = Math.max(bump(t, 2.05, 2.95), bump(t, 3.05, 3.95)), up = bump(t, 4.05, 4.95);
      const shrink = bump(t, 5.1, 5.9);
      man.p.set({ x: mx + step * 16, y: my, s: ms, flip: outK > 0.02, o: 1 - seg(outK, 0.9, 1), walk: outK > 0.02 && outK < 0.98 ? mx * 0.07 : undefined, armF: 18 + step * 40 + amaze * 60 + teach * 50 + up * 30, armB: 12 + amaze * 40 + up * 150 + shrink * 30, head: -up * 14 + shrink * 10 + outK * 6, lean: -shrink * 4, blink: blinkAt(T, 3) });
      fade(man.sad, shrink * 0.6 + outK * 0.6);

      offs.forEach((o) => {
        const listen = bump(t, 1.05, 4.95) * 0.5;
        const rise = bump(t, 5.05, 5.95);
        const push = o.i === 4 ? es(t, 6.04, 6.44) * (1 - es(t, 6.8, 7.2)) : 0;
        const point = o.i === 4 || o.i === 0 ? bump(t, 6.04, 6.6) : 0;
        const x = o.x - push * 230;
        offSet(o, T, {
          x, walk: push > 0.02 && push < 0.98 ? x * 0.07 : undefined, flip: true,
          armF: 18 + rise * 80 + point * 70, armB: 8 + rise * (o.i % 2 ? 130 : 40), head: -listen * 6 + rise * 4, lean: rise * 6 - listen * 3,
          angry: Math.max(0.5, rise, push), sad: 0,
        });
      });

      /* bubbles */
      const [hx, hy] = headAt(MX, H.FLOOR + 8, 1.02, false);
      const k1 = es(t, 1.12, 1.32, ease.back) * (1 - es(t, 1.92, 2.0));
      vis(amazing, { x: hx + 16, y: hy - 28, s: k1, o: k1 > 0.01 ? 1 : 0 });
      const [o1x, o1y] = headAt(952, H.SEAT + 12, 0.98, true, DY.sit);
      const k5 = es(t, 5.12, 5.32, ease.back) * (1 - es(t, 5.92, 6.0));
      vis(born, { x: o1x - 12, y: o1y - 26, s: k5, o: k5 > 0.01 ? 1 : 0 });

      /* v31 — the prayer picture */
      const pk = es(t, 2.08, 2.4, ease.out) * (1 - es(t, 2.92, 3.15, ease.in));
      const PX = 900, PY = 140;
      drop(pray, PX, PY, pk, T, { amp: 0.8 });
      rings.forEach((r) => {
        const k = ((T * 0.5 + r.i / 4) % 1);
        vis(r.el, { x: PX - 150 + 300 * 0.34, y: PY + 190 - 70 - k * 80, s: 0.8 + k * 0.5, o: pk > 0.95 ? Math.sin(k * PI) : 0 });
      });
      const sk = seg(t, 2.4, 2.95);
      vis(sink, { x: PX + 90, y: PY + 70 + sk * 90, r: sk * 90, o: pk > 0.95 ? 1 - sk : 0 });

      /* v32 — the scroll of the ages unrolls */
      const ak = es(t, 3.08, 3.3, ease.out) * (1 - es(t, 3.92, 4.12, ease.in));
      const un = es(t, 3.25, 3.75);
      const AX = 820 - SW / 2, AY = 150 - (1 - ak) * 700;
      pose(sc, { sx: Math.max(0.01, un) });
      vis(ages, { x: AX, y: AY, o: ak > 0.01 ? 1 : 0 });
      vis(rollL, { x: AX, y: AY, o: ak > 0.01 ? 1 : 0 });
      vis(rollR, { x: AX + SW * un, y: AY, o: ak > 0.01 ? 1 : 0 });
      vis(agesStr, { x: AX, y: AY, sx: Math.max(0.01, un), o: ak > 0.01 ? 1 : 0 });

      /* v33 — from God */
      drop(fromGod, 960, 330, es(t, 4.1, 4.45, ease.out) * (1 - es(t, 4.92, 5.15, ease.in)), T, { amp: 0.8 });

      // phone: further right and wider for the man and the whole bench; then left, to the whole barred door
      S.cam.x = P ? kf(t, [[0, 340], [6, 340], [6.45, -40], [7, -60]])
        : kf(t, [[0, 40], [1, 40], [2, 60], [2.2, 100], [3, 100], [3.2, 40], [4, 40], [4.2, 100], [5, 100], [5.2, 80], [6, 60], [6.3, 0], [7, -20]]);
      S.cam.y = kf(t, [[0, 0], [1, 0], [2, 0], [2.2, -100], [3, -100], [3.2, -90], [4, -90], [4.2, -70], [5, -70], [5.2, 0], [7, 0]]);
      S.cam.z = P ? kf(t, [[0, 1], [6, 1], [7, 1.02]]) : kf(t, [[0, 1.1], [1, 1.14], [2, 1.14], [2.2, 1.02], [4, 1.02], [5, 1.04], [5.2, 1.1], [6, 1.1], [7, 1.02]]);
    };
  },
};
