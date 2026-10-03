// Łk 4,28–29a — at these words the whole synagogue is filled with fury: the room goes red, everyone jumps up from
// the benches with fists raised and storm-scribbles over their heads. They seize Him and drive Him out: the room
// gives way to the street of Nazareth, and the crowd shoves Him along between the houses towards the town gate.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, house, cypress, olive } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { nazSynagogue, headAt, speech, GLYPH, figure, manO, womanO, MORNING, tr, DY, PI } from './lib.js';

const JX = 800;

export default {
  id: 'lk4-wrath',
  beats: [
    { v: 28 },
    { v: 29, text: 'Porwali Go z miejsca, wyrzucili Go z miasta' },
  ],
  cam: { x: [-30, 30], y: [-20, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const IN = [], OUT = [];
    const mk = S.layer;
    S.layer = (o) => { const Ly = mk(o); IN.push(Ly); return Ly; };
    const N = nazSynagogue(S);
    const { FLOOR, FRONT, BACK } = N;
    const backL = S.layer({ par: 0.45, sh: 4 });
    const back = N.backRow(backL);
    const backUp = backL.add(`<g opacity="0">${back.map((m, i) => figure(c, { ...m.opts, pose: 'stand' }, { x: m.x, y: m.y + 20, s: m.s * 1.08, flip: m.x > JX, armF: 60 + (i % 3) * 20, armB: 150 - (i % 2) * 20, head: -8 })).join('')}</g>`);
    const act = S.layer({ par: 0.55, sh: 5 });
    N.lectern(act);
    act.add(sheet().p(c.cut([[JX - 44, FLOOR + 2], [JX - 40, 612], [JX + 40, 612], [JX + 44, FLOOR + 2]], 0.5, 6), C.stone2).p(c.cut([[JX - 48, 604], [JX + 48, 604], [JX + 48, 614], [JX - 48, 614]], 0.4, 6), shade(C.stone2, 0.2)).out());
    const jSit = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jUp = S.puppet(act.add(person(c, { ...CAST.jesus })));
    N.bench(act);
    const looks = N.frontLooks().filter((m) => m.i !== 4);
    const frontSit = looks.map((m) => ({ ...m, p: S.puppet(act.add(person(c, { ...m.o, pose: 'sit' }))) }));
    const frontUp = act.add(`<g opacity="0">${looks.map((m, i) => figure(c, m.o, { x: m.x + (m.left ? 60 : -60), y: FRONT + 30, s: 0.9, flip: !m.left, armF: 70 + (i % 2) * 20, armB: 140 + (i % 3) * 10, head: -6 })).join('')}</g>`);
    const fx = S.layer({ par: 0.56, sh: 4 });
    const storms = [back[1], back[4], back[6], back[8], ...looks.filter((_, i) => i % 2 === 0)].map((m, i) => ({ m, i, el: fx.add(`<g opacity="0">${speech(c, GLYPH.storm(c), { w: 50, h: 42, flip: m.x > JX, fill: '#f1d6c8' })}</g>`) }));
    const tint = S.layer({ par: 0, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.terracotta}"/>`);
    tint.fade(0);
    N.columns(S.portrait ? { ceilTop: -50 } : undefined);   // phone: the ceiling is a band, not a third of the screen of wood
    S.layer = mk;

    /* ---------- the street of Nazareth ---------- */
    const O = (o) => { const Ly = S.layer(o); OUT.push(Ly); return Ly; };
    OUT.push(sky(S, MORNING, { name: 'street' }).layer);
    O({ par: 0.08, sh: 2 }).add(band(c, { y: 420, amps: [18, 8, 3], lens: [1100, 400, 140], color: C.hillFar }).markup);
    const street = O({ par: 0.4, sh: 3, pad: 700 });
    const r = makeCutter('lk4-wrath-street');
    let hs = '';
    for (let x = 200; x < 2600; x += r.rr(120, 170)) { const w = r.pick([C.plaster, mix(C.plaster, C.sand2, 0.4), mix(C.plaster, C.clay, 0.2)]); hs += house(r, x, 600 - r.rr(0, 30), r.rr(110, 150), r.rr(110, 150), { stairs: r.chance(0.4), wall: w, shadow: shade(w, -0.1) }); }
    street.add(hs + cypress(c, 1500, 610, 140) + olive(c, 1900, 620, 0.9));
    // the town gate (they drive Him through it, to the left)
    const gate = sheet();
    gate.p(c.cut(c.rect(-160, 300, 330, 330), 0.6, 10), mix(C.stone, C.sand, 0.3));
    gate.p(c.cut([[-60, 632], [-60, 470], ...c.arc(5, 470, 65, 60, PI, 2 * PI, 10), [70, 632]], 0.4, 6), mix(C.hillNear, C.sand, 0.4));
    let crn = '';
    for (let x = -160; x < 170; x += 36) crn += c.cut(c.rect(x, 280, 22, 22), 0.2, 3);
    gate.p(crn, mix(C.stone, C.sand, 0.3));
    street.add(gate.out());
    const road = sheet().p(c.cut([[-1200, 600], [3200, 600], [3200, 1700], [-1200, 1700]], 0.8, 20), mix(C.sand, C.stone, 0.35));
    let cob = '';
    for (let i = 0; i < 120; i++) cob += c.cut(c.blob(c.rr(-900, 2900), c.rr(620, 1000), c.rr(10, 22), c.rr(5, 9), 8, 0.2), 0.3, 4);
    road.x(cob, C.stone2, 'opacity=".6"');
    street.add(road.out());
    const mobL = O({ par: 0.5, sh: 5 });
    const mob = [0, 1, 2, 3].map((g) => {
      const mem = [0, 1, 2].map((k) => ({ o: (g + k) % 3 === 1 ? womanO(r) : manO(r), dx: k * 44 + r.rr(-8, 8), dy: (k % 2) * 12 }));
      return { g, el: mobL.add(`<g>${mem.map((m, k) => figure(r, m.o, { x: m.dx, y: 720 + m.dy, s: 0.95, flip: true, armF: 80 + k * 10, armB: 150 - k * 15, head: -6 })).join('')}</g>`) };
    });
    const jOut = S.puppet(mobL.add(person(c, { ...CAST.jesus })));
    const grab = mobL.add(`<g>${figure(r, manO(r, { robe: C.clayMantle }), { x: 0, y: 724, s: 1.0, flip: true, armF: 92, armB: 70, head: -4 })}</g>`);
    OUT.forEach((Ly) => Ly.fade(0));

    return (t, time) => {
      N.flicker(time);
      const cut = es(t, 1.22, 1.34);
      IN.forEach((Ly) => Ly.fade(1 - cut));
      OUT.forEach((Ly) => Ly.fade(cut));

      /* v28: fury */
      const up = es(t, 0.25, 0.32);
      const rage = es(t, 0.2, 0.6);
      tint.fade(rage * 0.2);
      back.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, o: 1 - up, armF: 30, head: rage * 6, blink: blinkAt(time, m.seed) }));
      fade(backUp, up);
      frontSit.forEach((m) => m.p.set({ x: m.x, y: FRONT - 6, s: 0.8, flip: !m.left, o: 1 - up, armF: 24 + rage * 20, blink: blinkAt(time, m.seed) }));
      fade(frontUp, up);
      storms.forEach((s) => {
        const k = es(t, 0.35 + s.i * 0.05, 0.5 + s.i * 0.05, ease.back);
        const y0 = s.m.y ?? FRONT + 30, s0 = s.m.s ? s.m.s * 1.08 : 0.9;
        const x0 = s.m.y ? s.m.x : s.m.x + (s.m.left ? 60 : -60);
        const [x, y] = headAt(x0, s.m.y ? y0 + 20 : y0, s0, x0 > JX);
        pose(s.el, { x: x + (x0 > JX ? -18 : 18), y: y - 26, s: k * 0.9, r: Math.sin(time * 6 + s.i) * 5, o: k > 0.02 ? 1 : 0 });
      });
      const stand = es(t, 0.7, 0.77);
      jSit.set({ x: JX, y: 618, s: 1.0, o: 1 - stand, armF: 30, head: 6, blink: blinkAt(time) });
      jUp.set({ x: JX, y: FLOOR, s: 1.0, o: stand, armF: 20, head: 4, blink: blinkAt(time) });

      /* v29a: seized and driven out of the town */
      const push = es(t, 1.3, 1.95);
      street.shift(push * 520, 0);
      const jx = lerp(900, 820, push);
      jOut.set({ x: jx, y: 724, s: 1.0, flip: true, walk: push > 0 && push < 1 ? t * 40 : undefined, lean: -6, armF: 14, head: 6, blink: blinkAt(time) });
      pose(grab, { x: jx + 95 + Math.sin(t * 40) * 2, y: 0 });
      mob.forEach((m) => pose(m.el, { x: jx + 200 + m.g * 130 + Math.sin(t * 30 + m.g) * 4, y: (m.g % 2) * 14 - Math.abs(Math.sin(t * 40 + m.g)) * 4 }));

      S.cam.z = 1.04 + rage * 0.04 - cut * 0.04;
      S.cam.y = 20;
      S.cam.x = cut * 40;
    };
  },
};
