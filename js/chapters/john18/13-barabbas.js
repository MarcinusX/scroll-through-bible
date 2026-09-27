// J 18,38b–40 — Pilate goes out again across the threshold to the leaders: "I find no basis for a charge against Him"
// — his hands open and empty, and an empty balance hangs level. "You have a custom that I release someone to you at
// the Passover": a plate — the Passover lamb and an opened fetter. "Do you want me to release to you the King of the
// Jews?" — he points back through the door to Jesus standing in the light (the paper crown hangs by Him). More people
// have gathered behind the leaders, and they shout again: "Not this man, but Barabbas!" — a jagged grey cry and rings
// of noise. "Now Barabbas was a robber": his portrait hangs behind bars in a dark frame. The lamp inside sinks low —
// only the small steady light on Jesus remains.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  praetorium, praetoriumCast, PR, say, taunt, nameTag, paperCrown, balanceRig, lamb, handChain, voiceRings, radiance, lampSet, hanging, vis, kf, moving, headAt,
  person, withFace, faceBits, pose, fade, lerp, mix, shade, sheet, tr, blinkAt, C, PI, DAWN, MORNING,
} from './lib.js';
import { LOOK as LOOK15 } from '../mark15/lib.js';
import { crowdPerson } from '../kit.js';
import { medallion } from '../john11/lib.js';

const { FLOOR, DOOR } = PR;
const JX = 930, PX_OUT = 560;

export default {
  id: 'j18-barabbas',
  beats: [
    { v: 38, text: 'To powiedziawszy wyszedł powtórnie do Żydów' },
    { v: 38, cont: true, text: 'i rzekł do nich: «Ja nie znajduję w Nim żadnej winy.' },
    { v: 39, text: 'Jest zaś u was zwyczaj, że na Paschę uwalniam wam jednego [więźnia].' },
    { v: 39, cont: true, text: 'Czy zatem chcecie, abym wam uwolnił Króla Żydowskiego?»' },
    { v: 40, text: 'Oni zaś powtórnie zawołali: «Nie tego, lecz Barabasza!»' },
    { v: 40, cont: true, text: 'A Barabasz był zbrodniarzem.' },
  ],
  cam: { x: [-420, 200], y: [-120, 60], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const R = praetorium(S, { skyCols: MORNING });
    const glowL = S.layer({ par: PR.P, sh: 0, flat: true });
    const aura = glowL.add(`<g><circle r="200" fill="url(#halo-glow)"/>${radiance(c, 70)}</g>`);
    // more people gather behind the leaders (drawn behind them)
    const moreL = S.layer({ par: PR.P, sh: 4 });
    const more = Array.from({ length: 8 }, (_, i) => {
      const o = crowdPerson(c);
      if (o.hairStyle === 'veil') o.hairStyle = 'wrap';
      o.beard = c.pick(['short', 'full']);
      const el = moreL.add(withFace(person(c, o), faceBits(c)));
      return { i, x: 40 + i * 50 + c.rr(-8, 8), y: -30 + (i % 2) * 8, s: 0.82 + (i % 3) * 0.03, seed: c.rr(0, 9), p: S.puppet(el), angry: el.querySelector('[data-part="angry"]') };
    });
    const K = praetoriumCast(S, R);

    const fx = S.layer({ par: PR.P, sh: 4 });
    const none = fx.add(`<g>${say(c, tr('Ja nie znajduję w Nim żadnej winy', 'I find no basis for a charge against Him'), { size: 16, side: -1 })}</g>`);
    const balL = S.layer({ par: PR.P, sh: 4 });
    const bal = balanceRig(S, balL, 110);
    const custom = hanging(fx, `${sheet().p(c.cut(c.ell(0, 0, 110, 66, 30), 0.5, 6), C.cream).p(c.cut(c.ell(0, 0, 100, 57, 30), 0.4, 6), C.parchment).out()}<g transform="translate(-30 26) scale(.72)">${lamb(c)}</g><g transform="translate(46 -6) rotate(-20) scale(1.6)">${handChain(c)}</g><path d="${c.ribbon([[36, 14], [60, 30]], 3)}" fill="${C.rock3}"/><g transform="translate(0 66)">${nameTag(c, tr('zwyczaj na Paschę', 'the Passover custom'), { size: 14 })}</g>`, { x: 0, y: 0, len: 800 });
    const release = fx.add(`<g>${say(c, [tr('Czy chcecie, abym uwolnił', 'Do you want me to release'), tr('Króla Żydowskiego?', 'the King of the Jews?')], { size: 16, side: -1 })}</g>`);
    const crown = hanging(fx, `<circle r="50" fill="url(#halo-glow)" opacity=".5"/><g transform="translate(0 20)">${paperCrown(c, 58)}</g>`, { x: 0, y: 0, len: 800 });
    const shout = fx.add(`<g>${taunt(c, [tr('Nie tego,', 'Not this man,'), tr('lecz Barabasza!', 'but Barabbas!')], { size: 19, side: 1 })}</g>`);
    const noise = voiceRings(fx, c, { n: 3, color: mix(C.stone2, C.storm, 0.3), r: 36, w: 5, both: false });
    const clip = S.id('bar');
    let bars = '';
    for (let x = -46; x <= 46; x += 18) bars += c.cut(c.rect(x - 3, -52, 6, 104), 0.2, 4);
    const barabbas = hanging(fx, `${sheet().p(c.cut(c.rect(-66, -66, 132, 132), 0.5, 6), mix(C.soil, C.stone2, 0.3)).out()}<defs><clipPath id="${clip}"><rect x="-56" y="-56" width="112" height="112"/></clipPath></defs><g clip-path="url(#${clip})"><rect x="-56" y="-56" width="112" height="112" fill="${mix(C.soilDark, C.storm, 0.3)}"/><g transform="translate(0 8)">${medallion(c, LOOK15.barabbas, { r: 36, rim: mix(C.rock3, C.soil, 0.4), back: mix(C.stone2, C.soil, 0.3) })}</g></g><path d="${bars}" fill="${C.rock3}"/><g transform="translate(0 70)">${nameTag(c, [tr('Barabasz', 'Barabbas'), tr('zbrodniarz', 'a robber')], { size: 14, dark: true })}</g>`, { x: 0, y: 0, len: 800 });

    return (t, time) => {
      const T = time;
      R.sky.set(...MORNING);
      vis(R.sun, { x: 330, y: 200, o: 1 });
      const low = es(t, 5.1, 5.7);
      lampSet(R.lamp, 0.8 - low * 0.65, T);
      R.beamL.fade(1 - low * 0.5);
      K.poseSols(T);

      /* Pilate goes out again */
      const pK = [[-0.5, [760, FLOOR + 2]], [0.05, [760, FLOOR + 2]], [0.7, [PX_OUT, FLOOR + 4]]];
      const [px, py] = kf(t, pK, ease.sine);
      const empty = es(t, 1.05, 1.25) * (1 - es(t, 1.9, 2.05));
      const point = es(t, 3.05, 3.25) * (1 - es(t, 3.9, 4.05));
      const turnBack = point > 0.5;
      K.pil.set({ x: px, y: py, s: 1.0, flip: !turnBack, walk: moving(t, pK, 1) ? px * 0.05 : undefined, armF: 22 + empty * 50 + point * 66, armB: 10 + empty * 60 + bump(t, 2.05, 2.9) * 40, head: point * -4 + es(t, 4.1, 4.4) * 8, blink: blinkAt(T, 13) });

      /* Jesus inside, in His small steady light */
      K.J.set({ x: JX, y: FLOOR, s: 1.02, flip: true, armF: 26, armB: 12, head: 6 + low * 4, blink: blinkAt(T) });
      fade(K.jEl.querySelector('[data-part="sad"]'), bump(t, 4.05, 6.0) * 0.4);
      vis(aura, { x: JX, y: FLOOR - 120, s: 0.45 + point * 0.2, r: T ? T * 2 : 0, o: 0.5 + point * 0.3 + low * 0.2 });

      /* the leaders and the crowd */
      const cry = es(t, 4.05, 4.25) * (1 - es(t, 4.9, 5.1) * 0.6);
      K.poseLead(T, (m) => ({ armF: 16 + cry * (m.i % 2 ? 70 : 40), armB: 6 + cry * (m.i % 2 ? 30 : 120), head: -cry * 6, lean: -cry * 2 }));
      more.forEach((m) => {
        const k = es(t, 3.1 + m.i * 0.05, 3.7 + m.i * 0.05, ease.sine);
        const x = lerp(m.x - 520, m.x, k);
        fade(m.angry, cry);
        m.p.set({ x, y: FLOOR + m.y, s: m.s, flip: false, o: k > 0.01 ? 1 : 0, walk: k > 0 && k < 1 ? x * 0.05 : undefined, armF: 16 + cry * (40 + (m.i % 3) * 30), armB: 6 + cry * (m.i % 2 ? 140 : 60), head: -cry * 5, blink: blinkAt(T, m.seed) });
      });

      /* words and plates */
      const [phx, phy] = headAt(PX_OUT, FLOOR + 4, 1.0, true);
      const nk = es(t, 1.1, 1.3, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(none, { x: phx - 14, y: phy - 20, s: nk, o: nk > 0.01 ? 1 : 0 });
      const bk = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.95, 2.1, ease.in));
      const by = 250 - (1 - bk) * 800;
      const [[lx, ly], [rx, ry]] = bal.set(780, by, T ? Math.sin(T * 0.9) * 1.2 : 0, bk > 0.01 ? 1 : 0);
      void lx; void ly; void rx; void ry;
      const ck = es(t, 2.1, 2.4, ease.out) * (1 - es(t, 2.95, 3.1, ease.in));
      vis(custom, { x: 400, y: 300 - (1 - ck) * 800, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: ck > 0.01 ? 1 : 0 });
      const [p2x, p2y] = headAt(PX_OUT, FLOOR + 4, 1.0, false);
      const rk = es(t, 3.12, 3.32, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(release, { x: phx - 14, y: phy - 20, s: rk, o: rk > 0.01 ? 1 : 0 });
      void p2x; void p2y;
      const crk = es(t, 3.2, 3.5, ease.out) * (1 - es(t, 4.1, 4.3, ease.in));
      vis(crown, { x: JX, y: 360 - (1 - crk) * 800, r: T ? Math.sin(T * 0.9) * 1.6 : 0, o: crk > 0.01 ? 1 : 0 });
      const [chx, chy] = headAt(470, FLOOR, 1.0, false);
      const sk = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.95, 5.1));
      vis(shout, { x: chx + 16, y: chy - 20, s: sk, o: sk > 0.01 ? 1 : 0, r: T ? Math.sin(T * 12) * 1.5 * sk : 0 });
      noise(300, FLOOR - 190, cry * (1 - es(t, 4.95, 5.1)), T, { spread: 3 });
      const bb = es(t, 5.1, 5.45, ease.out);
      vis(barabbas, { x: 360, y: 290 - (1 - bb) * 800, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: bb > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -60], [0.7, -300], [2, -320], [3, -200], [3.5, -140], [4, -360], [5, -380], [6, -300]]);
      S.cam.y = kf(t, [[0, 0], [1, -20], [2, -30], [4, 0], [5, -20], [6, -40]]);
      S.cam.z = kf(t, [[0, 1.1], [0.7, 1.12], [2, 1.12], [3, 1.06], [3.5, 1.02], [4, 1.06], [5, 1.08], [6, 1.0]]);
    };
  },
};
