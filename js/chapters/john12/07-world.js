// J 12,16–19 — the procession moves slowly towards the gate. Peter and John walk beside the colt with question
// marks over their heads — they did not understand. Then a golden "afterwards" plate: the empty tomb in a burst of
// glory and the prophet's scroll; the question marks turn into small lights and they remember. People from Bethany
// tell the others: a plate of Lazarus stepping out of his tomb; the sign-medallion swings down, and more people
// pour out of the gate. By the gate the Pharisees throw up their empty hands: "You gain nothing — look, the whole
// world has gone after Him!" — and a globe comes down, tiny people running across it towards Him.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  roadSet, RD, LAZ, man, crowdPerson, handFrond, colt, coltRig, saddleCloaks, riderLeg, leader, people, place, question, spark, glory, tombIcon, verseScroll,
  framed, signBadge, bubble, globe, headAt, nameTag, hanging, swing, kf, vis, sparkle, tr, PI, FONT,
} from './lib.js';

export default {
  id: 'j12-world',
  beats: [
    { v: 16, text: 'Z początku Jego uczniowie tego nie zrozumieli.' },
    { v: 16, cont: true, text: 'Ale gdy Jezus został uwielbiony, wówczas przypomnieli sobie, że to o Nim było napisane i że tak Mu uczynili.' },
    { v: 17 },
    { v: 18 },
    { v: 19, text: 'Faryzeusze zaś mówili jeden do drugiego: «Widzicie, że nic nie zyskujecie?' },
    { v: 19, cont: true, text: 'Patrz - świat poszedł za Nim».' },
  ],
  cam: { x: [-200, 120], y: [-80, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const PT = S.portrait;               // phone: scroll and bubbles move inward, the camera goes over to the Pharisees
    const set = roadSet(S, { skyCols: ['#d6e3da', '#f1e7cb', '#f8ecd2'], sunAt: [1180, 150] });
    const G = RD.GROUND, GATE = RD.GATE;
    // people streaming out of the gate, far off (flat silhouettes in the city layer's depth)
    const outL = S.layer({ par: 0.26, sh: 2, pad: 200 });
    const outs = Array.from({ length: 7 }, (_, i) => ({ i, el: outL.add(`<g transform="scale(.5)">${person(c, { ...(i % 2 ? crowdPerson(c) : man(c)), holdB: handFrond(c, 90) })}</g>`) }));
    const back = S.layer({ par: 0.48, sh: 4 });
    const act = S.layer({ par: 0.52, sh: 5 });
    // the Pharisees by the gate
    const ph = people(S, act, [0, 1, 2].map((i) => ({ x: [430, 490, 548][i], y: G + [-4, -14, -2][i], s: 0.92, flip: i === 1, look: leader(i), face: true })), 'ph');
    // the crowd around the procession
    const cr = [[700, G - 18, 0.86, true], [640, G - 22, 0.84, true], [1060, G - 14, 0.86, true], [1130, G + 8, 0.95, true], [1200, G - 14, 0.86, true], [1260, G + 10, 0.95, true]];
    const crowd = cr.map(([x, y, s, flip], i) => ({ i, x, y, s, flip, seed: c.rr(0, 9), ph: c.rr(0, 6), p: S.puppet((y < G ? back : act).add(person(c, { ...(i % 2 ? crowdPerson(c) : man(c)), holdB: handFrond(c, 96) }))) }));
    const coltB = coltRig(act.add(colt(c, { over: saddleCloaks(c, [CAST.peter.mantle, CAST.james.mantle]), rider: `<g data-k="rider" transform="translate(-16 -106) scale(.95)">${person(c, { ...CAST.jesus, pose: 'sit' })}</g>${riderLeg(c)}` })));
    const rider = S.puppet(S.$('rider').firstElementChild);
    const disc = [CAST.john, CAST.peter].map((o) => S.puppet(act.add(person(c, o))));
    const fx = S.layer({ par: 0.44, sh: 5 });
    const qs = [0, 1].map(() => fx.add(`<g>${question(c)}</g>`));
    const lights = [0, 1].map(() => fx.add(`<g>${spark(c, 11)}</g>`));
    // the "afterwards" plate: glory, the empty tomb, the scroll
    const later = fx.add(`<g>${glory(c, 260, 20)}<g transform="translate(0 0) scale(1.6)">${tombIcon(c, { open: true })}</g><g transform="translate(0 70)">${nameTag(c, tr('uwielbiony', 'glorified'), { size: 16 })}</g></g>`);
    const scr = verseScroll(c, [tr('Nie bój się, Córo Syjońska…', 'Don’t be afraid, daughter of Zion…')], { w: 300, size: 16 });
    const scrollEl = fx.add(`<g><circle r="120" cy="20" fill="url(#halo-glow)"/><g transform="translate(0 0)">${scr.sheet}</g><g>${scr.rodTop}</g><g transform="translate(0 ${scr.h})">${scr.rodBottom}</g></g>`);
    // the witness plate: Lazarus comes out of the tomb
    const lz = `<rect width="300" height="190" fill="${mix(C.parchment, C.dune, 0.45)}"/><circle cx="150" cy="120" r="90" fill="url(#halo-glow)"/>` +
      `<path d="${c.cut([[10, 190], [20, 90], [80, 40], [180, 30], [260, 70], [292, 190]], 1, 8)}" fill="${mix(C.rock, C.dune, 0.3)}"/>` +
      `<path d="${c.cut([[118, 190], [118, 120], ...c.arc(150, 120, 32, 30, PI, 2 * PI, 10), [182, 190]], 0.5, 5)}" fill="${mix(C.soilRich, C.dune, 0.2)}"/>` +
      `<g transform="translate(150 186) scale(.55)">${person(c, { ...LAZ, robe: C.linen, mantle: null, belt: null, hairStyle: 'wrap', veil: C.linen, veil2: C.linen2 })}</g>` +
      `<g transform="translate(40 190) scale(.42)">${person(c, crowdPerson(c))}</g><g transform="translate(250 190) scale(-.42 .42)">${person(c, man(c))}</g>`;
    const witness = fx.add(`<g>${framed(S, lz, { w: 300, h: 190, rim: C.wood3, k: 'wit' })}</g>`);
    const talk = [0, 1].map((i) => fx.add(`<g>${bubble(c, i ? tr('z grobu wywołał!', 'called out of the tomb!') : tr('Łazarza!', 'Lazarus!'), { size: 17, tail: i ? 1 : -1 })}</g>`));
    const badge = hanging(fx, signBadge(c, 7, { r: 44, icon: '' }), { x: 900, y: 300, len: 700 });
    const say = fx.add(`<g>${bubble(c, [tr('Widzicie,', 'See how'), tr('że nic nie zyskujecie?', 'you accomplish nothing!')], { size: 18, tail: 1 })}</g>`);
    // the world gone after Him
    const runners = Array.from({ length: 8 }, (_, i) => `<g class="run" data-i="${i}"><path d="${c.cut([[-3, 0], [-2.4, -10], [2.4, -10], [3, 0]], 0.2, 3)}" fill="${[C.terracotta, C.dustyBlue, C.ochre, C.plumRobe][i % 4]}"/><circle cy="-12.5" r="2.6" fill="${C.skin2}"/></g>`).join('');
    const world = hanging(fx, `<circle r="140" fill="url(#halo-glow)"/>${globe(c, 70)}<g class="runners">${runners}</g><g transform="translate(0 86)">${nameTag(c, tr('świat', 'the world'), { size: 16 })}</g>`, { x: 700, y: 240, len: 700 });
    const runEls = Array.from(world.querySelectorAll('.run'));
    set.fg();

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* the procession creeps towards the gate */
      const adv = es(t, 0, 6, ease.sine);
      const cx = lerp(900, 800, adv);
      const walk = t * 3.2;
      coltB.set({ x: cx, y: G + 12, s: 1, flip: true, walk, amt: 0.5, nod: 0, ear: bump(t, 2.1, 2.6) * 14, tail: T ? Math.sin(T * 1.3) * 8 : 0 });
      const glor = es(t, 1.1, 1.4) * (1 - es(t, 1.95, 2.15));
      rider.set({ x: 0, y: 0, s: 1, armF: 30 + bump(t, 3.1, 3.9) * 50, armB: 16, head: -2, blink: blinkAt(T) });
      const remember = es(t, 1.45, 1.7);
      disc.forEach((p, i) => {
        const x = cx + 100 + i * 70;
        p.set({ x, y: G + 2 - i * 4, s: 0.94, flip: true, walk: walk + i, amt: 0.5, armF: 12 + remember * 40 * bump(t, 1.5, 2.0), armB: remember * 30 * bump(t, 1.5, 2.0), head: 4 - bump(t, 0.1, 0.9) * 8 + remember * -4, blink: blinkAt(T, i + 3) });
        const [hx, hy] = headAt(x, G + 2 - i * 4, 0.94, true);
        const qk = es(t, 0.15 + i * 0.1, 0.35 + i * 0.1, ease.back) * (1 - es(t, 1.4, 1.55));
        vis(qs[i], { x: hx, y: hy - 56, s: qk * 0.8, r: T ? Math.sin(T * 2 + i) * 6 : 0, o: qk > 0.01 ? 1 : 0 });
        const lk = es(t, 1.45 + i * 0.05, 1.65 + i * 0.05, ease.back) * (1 - es(t, 2.2, 2.4));
        vis(lights[i], { x: hx, y: hy - 50, s: lk, o: lk > 0.01 ? 1 : 0 });
      });
      vis(later, { x: 1060, y: 300 - (1 - glor) * 40, s: 0.6 + glor * 0.4, o: glor });
      vis(scrollEl, { x: PT ? 730 : 640, y: 210 - (1 - glor) * 30, s: 0.9, o: glor });
      /* v17 — those who were at the tomb bear witness */
      const cheer = es(t, 2.05, 2.3);
      crowd.forEach((m, j) => {
        const x = m.x - adv * (m.x < 900 ? 60 : 100);
        const tell = j === 3 || j === 1 ? bump(t, 2.1, 2.95) : 0;
        place(m, T, { x, walk: walk + m.ph, amt: 0.5, armB: 60 + cheer * 40 + Math.sin(t * 8 + j) * 10 * cheer, armF: 10 + tell * 70 + bump(t, 5.1, 5.9) * 40, head: -4 + tell * 4 });
        m.cx = x;
      });
      const wk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      vis(witness, { x: 900, y: 120 - (1 - wk) * 700, r: wk > 0.01 && T ? Math.sin(T * 0.7) * 0.6 : 0, o: wk > 0.001 ? 1 : 0 });
      talk.forEach((el, i) => {
        const m = crowd[i ? 3 : 1];
        const k = es(t, 2.3 + i * 0.15, 2.45 + i * 0.15, ease.back) * (1 - es(t, 2.95, 3.1));
        const [hx, hy] = headAt(m.cx, m.y, m.s, true);
        vis(el, { x: hx + (PT ? (i ? -50 : 30) : (i ? 30 : -30)), y: hy - 40, s: k, o: k > 0.01 ? 1 : 0 });
      });
      /* v18 — the sign; more people pour out of the gate */
      const bk = es(t, 3.05, 3.4, ease.back) * (1 - es(t, 3.9, 4.1));
      swing(badge, 880, 250 - (1 - bk) * 700, bk > 0.001 ? T : 0, 1.4, 0.8, 2);
      fade(badge, bk > 0.001 ? 1 : 0);
      outs.forEach((o) => {
        const k = seg(t, 3.1 + o.i * 0.1, 4.2 + o.i * 0.1);
        const x = GATE + k * 260 + o.i * 4, y = RD.GY + 6 + k * 6;
        vis(o.el, { x, y, s: 0.5, o: k > 0 && k < 1 ? Math.min(1, k * 5, (1 - k) * 4) : 0 });
        if (k > 0 && k < 1) { const ph = (x * 0.1); pose(o.el.querySelector('.footF'), { x: Math.sin(ph) * 8 }); pose(o.el.querySelector('.footB'), { x: -Math.sin(ph) * 8 }); }
      });
      /* v19 — the Pharisees */
      const gest = bump(t, 4.1, 4.95);
      ph.forEach((m, i) => place(m, T, { armF: 20 + (i === 0 ? gest * 90 : 0) + (i === 2 ? bump(t, 5.1, 5.9) * 70 : 0), armB: (i === 0 ? gest * 130 : 0), head: i === 1 ? -2 : 4 - gest * (i === 0 ? 8 : 0), flip: i === 1 && t < 4.9 }));
      ph.forEach((m) => fade(m.angry, 0.4 + es(t, 4, 4.5) * 0.6));
      const sk = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.95, 5.1));
      vis(say, { x: 470, y: 400, s: sk, o: sk > 0.01 ? 1 : 0 });
      const gk = es(t, 5.05, 5.45, ease.out);
      swing(world, 690, 250 - (1 - gk) * 700, gk > 0.001 ? T : 0, 1.2, 0.7, 1);
      fade(world, gk > 0.001 ? 1 : 0);
      runEls.forEach((el, i) => {
        const a = PI * (0.95 + ((t * 0.35 + i / 8) % 1) * 0.9);
        pose(el, { x: Math.cos(a) * 74, y: Math.sin(a) * 74 + 12, r: (a * 180) / PI + 90, s: 1.1, o: gk });
      });

      S.cam.x = PT ? kf(t, [[0, 90], [1, 90], [1.5, 60], [2.2, 100], [3.2, 60], [4.1, -200], [6, -200]]) : kf(t, [[0, 90], [1, 90], [1.5, 60], [2.2, 100], [3.2, 60], [4.1, -40], [5.2, -60], [6, -50]]);
      S.cam.y = kf(t, [[0, 0], [1.2, -40], [2.2, -30], [3.2, -20], [4.1, 0], [5.2, -40]]);
      S.cam.z = kf(t, [[0, 1.1], [1, 1.12], [1.5, 1.02], [2.2, 1.04], [3.2, 1.02], [4.1, 1.08], [5.2, 1.02]]);
    };
  },
};
