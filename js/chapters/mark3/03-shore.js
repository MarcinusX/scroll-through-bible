// Mk 3,9–12 — by the lake: a little boat kept ready against the press of the crowd; the sick reach
// out to touch him and are healed; unclean spirits fall down crying out who he is — and are silenced.
import { C, person, crowdPerson, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, waterBand, waveStrip, palm, reeds, rock, town, sun, cloud, grass } from '../../assets/nature.js';
import { boat } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { man, woman, handAt, headAt, crutch, spark, sparkle, wisp, bubble, tapeCross } from './lib.js';

const PI = Math.PI;
const JX = 800, JY = 664;

export default {
  id: 'm3-shore',
  beats: [
    { v: 9 },
    { v: 10 },
    { v: 11 },
    { v: 12 },
  ],
  cam: { x: [-30, 30], y: [0, 70], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    sky(S, ['#cadfdb', '#eee5cc', '#f7ead3']);
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 48), { x: 1180, y: 160, len: 700 });
    const cl1 = hanging(hangL, cloud(c, 200), { x: 500, y: 150, len: 600 });
    const cl2 = hanging(hangL, cloud(c, 140), { x: 930, y: 215, len: 700 });

    S.layer({ par: 0.1, sh: 2 }).add(band(c, { y: 400, amps: [18, 8, 3], lens: [1100, 420, 150], color: C.hillFar }).markup);
    const hills = S.layer({ par: 0.16, sh: 3 });
    const h2 = hillsWith(c, { y: 432, amps: [20, 8, 3], lens: [900, 300, 110], color: C.hillMid, trees: 20, treeColor: C.sage, treeH: 22 });
    hills.add(h2.markup + town(c, { x: 1320, y: h2.fn(1320) + 10, n: 6, spread: 220, sc: 0.5 }));

    /* lake, then the beach curving round in front */
    const lake = S.layer({ par: 0.22, sh: 2 });
    lake.add(waterBand(c, { y: 452, color: C.lake, foamN: 26 }).markup);
    const wv = S.layer({ par: 0.26, sh: 2, pad: 160 });
    wv.add(waveStrip(c, { y: 560, len: 140, amp: 8, color: C.lake2, x0: -1000, x1: 2600, bottom: 600 }));

    const beach = S.layer({ par: 0.3, sh: 3 });
    const bfn = (x) => 578 + Math.max(0, (x - 700) / 600) * 40 - Math.max(0, (700 - x) / 500) * 44 + Math.sin(x / 90) * 3;
    beach.add(sheet().p(c.ridge(bfn, -900, 2500, 1700, 12, 1), C.sand).out());
    beach.add(palm(c, 250, bfn(250) + 4, 220) + palm(c, 1450, bfn(1450) + 4, 190) + reeds(c, 1210, bfn(1210) + 2, 8, 50));
    beach.add(grass(c, { x0: -500, x1: 2100, y: 580, fn: bfn, n: 40, h: 12, color: C.olive }));

    /* the little boat, kept ready at the water's edge */
    const boatL = S.layer({ par: 0.34, sh: 4 });
    const B = boat(c, { cushion: true });
    const PETER = { ...CAST.peter };
    const boatG = boatL.add(`<g><g>${B.back}</g><g data-k="bp">${person(c, { ...PETER, holdF: `<g transform="rotate(14)">${sheet().p(c.ribbon([[0, -70], [2, 90]], 5), C.wood2).p(c.cut([[-6, 80], [8, 80], [9, 118], [-5, 118]], 0.3, 4), C.wood3).out()}</g>` })}</g><g>${B.front}</g></g>`);
    const peter = S.puppet(S.$('bp').firstElementChild);

    /* the crowd, pressing in from both sides (two sheets, moved only by the story) */
    const backL = S.layer({ par: 0.4, sh: 3 });
    const midL = S.layer({ par: 0.5, sh: 4 });
    const CROWD = [];
    const addRow = (L, y, s, xs) => xs.forEach((x) => {
      const m = { x, y: y + c.rr(-4, 4), s: s * c.rr(0.93, 1.06), flip: x > JX, seed: c.rr(0, 9), delay: c.rr(0, 1) };
      m.p = S.puppet(L.add(person(c, crowdPerson(c))));
      CROWD.push(m);
    });
    addRow(backL, 596, 0.66, [330, 392, 452, 512, 566, 1122, 1180, 1240, 1300]);
    addRow(backL, 626, 0.74, [360, 430, 498, 1150, 1216, 1284]);
    addRow(midL, 660, 0.84, [340, 420, 1190, 1270]);
    CROWD.forEach((m) => { m.dir = m.x < JX ? 1 : -1; m.press = m.dir * (40 + m.delay * 40); });

    /* Jesus and those who come close: the sick (left), the possessed (right) */
    const main = S.layer({ par: 0.58, sh: 5 });
    const touchGlow = main.add(`<g opacity="0"><circle r="110" fill="url(#warm-glow)"/></g>`);
    const SICK = [
      { x: 560, y: 690, s: 0.92, o: man(c, { robe: C.stone2, beard: 'full', hair: C.greyHair, beardColor: C.greyHair }), crutch: true, lean: 10 },
      { x: 640, y: 704, s: 0.9, o: woman(c, { robe: C.roseRobe, veil: C.linen2 }), lean: 16 },
      { x: 700, y: 676, s: 0.86, o: man(c, { robe: C.wheatRobe }), blind: true, lean: 4 },
    ].map((m, i) => {
      m.i = i; m.seed = c.rr(0, 9);
      m.p = S.puppet(main.add(person(c, { ...m.o, eyes: m.blind ? 'closed' : 'open' })));
      if (m.blind) m.p2 = S.puppet(main.add(person(c, { ...m.o })));
      if (m.crutch) m.cr = main.add(`<g>${crutch(c, 92)}</g>`);
      m.sp = main.add(`<g opacity="0">${spark(c, 12)}</g>`);
      return m;
    });
    const jesus = S.puppet(main.add(person(c, { ...CAST.jesus })));
    const hushRays = main.add(`<g opacity="0">${[0, 1, 2].map((i) => `<path d="${c.ribbon(c.arc(0, 0, 30 + i * 16, 30 + i * 16, -0.7, 0.7, 10), 4)}" fill="${C.cream}"/>`).join('')}</g>`);
    const SPIRIT = { robe: mix(C.storm, C.lavender, 0.45), hair: C.hair3, hairStyle: 'wild', beard: 'wild', skin: mix(C.skin3, C.rock2, 0.35), belt: null };
    const POSS = [
      { x: 945, y: 700, s: 0.9, o: SPIRIT },
      { x: 1050, y: 690, s: 0.86, o: { ...SPIRIT, robe: mix(C.plumRobe, C.storm, 0.4), hairStyle: 'wild', beard: 'none', hair: C.hair } },
    ].map((m, i) => {
      m.i = i; m.seed = c.rr(0, 9);
      m.stand = S.puppet(main.add(person(c, { ...m.o })));
      m.kneel = S.puppet(main.add(person(c, { ...m.o, pose: 'kneel' })));
      m.w = [0, 1, 2].map((k) => main.add(`<g opacity="0">${wisp(c, 0.9 + k * 0.15)}</g>`));
      return m;
    });
    const cry = main.add(`<g opacity="0">${bubble(c, tr('Ty jesteś Syn Boży!', 'You are the Son of God!'), { size: 21, fill: mix(C.storm2, C.plumRobe, 0.3), ink: C.cream, tail: -1 })}<g data-part="seal" opacity="0">${tapeCross(c, 96, 30, 11)}</g></g>`);
    const cryTape = cry.querySelector('[data-part="seal"]');

    return (t, time) => {
      const T = time;
      swing(sunEl, 1180, 160, T, 1.2, 0.7);
      swing(cl1, 500 + Math.sin(T * 0.1) * 30, 150, T, 1.5, 0.6, 1);
      swing(cl2, 930 + Math.sin(T * 0.13 + 2) * 30, 215, T, 1.5, 0.8, 2);
      wv.shift((T * 14) % 140 - 70);

      /* beat 0: the crowd presses in; Peter brings the boat close and holds it ready */
      const press = es(t, 0.05, 0.7);
      const ease_ = es(t, 0.75, 0.95) * 0.5;      // once the boat is ready they give him a little room
      CROWD.forEach((m) => {
        const k = press - ease_ * 0.6;
        const reach = es(t, 1.0 + m.delay * 0.3, 1.4 + m.delay * 0.3) * (1 - es(t, 2.9, 3.3));
        const awe = es(t, 2.1 + m.delay * 0.3, 2.4 + m.delay * 0.3);
        m.p.set({
          x: m.x + m.press * k, y: m.y, s: m.s, flip: m.flip,
          walk: t > 0.05 && t < 0.7 ? (m.x + m.press * k) * 0.08 : undefined, amt: 0.5,
          armF: reach * (m.delay > 0.5 ? 70 : 30) + awe * (m.delay > 0.6 ? 50 : 0) + bump(t, 0.1, 0.7) * 25,
          armB: awe * (m.delay < 0.3 ? 120 : 0),
          lean: m.dir * (bump(t, 0.1, 0.8) * 5 + reach * 4), head: -awe * 6,
          blink: blinkAt(T, m.seed),
        });
      });
      const bIn = es(t, 0.3, 0.9);
      const bob = Math.sin(T * 1.4) * 2;
      const bx = lerp(1260, 1000, bIn), by = 596;
      pose(boatG, { x: bx, y: by + bob, s: 0.72, r: Math.sin(T * 1.1) * 0.8 });
      peter.set({ x: 70, y: -26, s: 0.95, flip: true, armF: 40 + bump(t, 0.3, 0.9) * 30, armB: 20 + es(t, 0.8, 1) * 30, head: -3, blink: blinkAt(T, 4) });

      /* Jesus: gestures to the boat, heals, then commands silence */
      const toBoat = bump(t, 0.2, 0.95);
      const heal = es(t, 1.05, 1.3) * (1 - es(t, 1.9, 2.1));
      const stern = es(t, 3.05, 3.3);
      jesus.set({
        x: JX, y: JY, s: 1.04, flip: t < 1 ? false : t < 2.05 ? true : false,
        armF: 12 + toBoat * 70 + heal * 55 + stern * 70 + Math.sin(T * 1.1) * 2,
        armB: 8 + heal * 30 + stern * 150 - stern * es(t, 3.6, 3.9) * 10,
        head: -2 + stern * 4 + Math.sin(T * 0.7) * 1.2, blink: blinkAt(T, 2),
      });

      /* beat 1: the sick press to touch him — and are healed */
      SICK.forEach((m) => {
        const come = es(t, 1.0 + m.i * 0.08, 1.35 + m.i * 0.08);
        const touch = es(t, 1.3 + m.i * 0.12, 1.45 + m.i * 0.12);
        const well = es(t, 1.45 + m.i * 0.12, 1.65 + m.i * 0.12);
        const x = m.x + come * (m.i === 2 ? 10 : 34), lean = m.lean * (1 - well) + come * 4 * (1 - well);
        const aF = 10 + touch * 72 * (1 - well * 0.4) + well * 40;
        const aB = well * (m.i === 1 ? 150 : 110);
        const set = { x, y: m.y, s: m.s, flip: false, lean, armF: aF, armB: aB, head: 6 * (1 - well) - well * 8, blink: blinkAt(T, m.seed) };
        if (m.blind) { m.p.set({ ...set, o: 1 - es(t, 1.45 + m.i * 0.12, 1.5 + m.i * 0.12) }); m.p2.set({ ...set, o: es(t, 1.45 + m.i * 0.12, 1.5 + m.i * 0.12) }); }
        else m.p.set(set);
        if (m.cr) {
          const [hx, hy] = handAt(x, m.y, m.s, false, 10);
          const fall = es(t, 1.55, 1.9, ease.in);
          pose(m.cr, { x: hx - 4 + fall * 40, y: m.y - fall * 4, r: 8 + fall * 76, ox: 0, oy: 0, o: 1 - es(t, 3.2, 3.6) });
        }
        const [px, py] = handAt(x, m.y, m.s, false, aF);
        pose(m.sp, { x: px + 6, y: py, s: 0.6 + bump(t, 1.4 + m.i * 0.12, 1.9 + m.i * 0.12) * 1.1, r: T * 20, o: bump(t, 1.38 + m.i * 0.12, 1.95 + m.i * 0.12) });
      });
      pose(touchGlow, { x: JX - 20, y: JY - 110, s: 1 + heal * 0.5, o: heal * 0.9 });

      /* beats 2–3: the unclean spirits fall down and cry out; he forbids them */
      POSS.forEach((m) => {
        const down = es(t, 2.12 + m.i * 0.1, 2.2 + m.i * 0.1);
        const shake = (1 - stern) * es(t, 1.9, 2.1);
        const bl = blinkAt(T, m.seed);
        const come = es(t, 1.82 + m.i * 0.06, 2.14 + m.i * 0.06, ease.out);
        const sx = lerp(m.x + 420, m.x, come);
        m.stand.set({ x: sx, y: m.y, s: m.s, flip: true, o: (1 - down) * (come > 0 ? 1 : 0), walk: come > 0 && come < 1 ? sx * 0.07 : undefined, armF: bump(t, 1.9, 2.2) * 60, head: Math.sin(T * 6 + m.seed) * 6 * shake, blink: bl });
        m.kneel.set({ x: m.x, y: m.y, s: m.s, flip: true, o: down, lean: -es(t, 2.2, 2.4) * 16 * (1 - stern * 0.6), armF: 40 + es(t, 2.2, 2.4) * 60 * (1 - stern) + Math.sin(T * 7 + m.seed) * 8 * shake, armB: es(t, 2.2, 2.4) * 110 * (1 - stern), head: -12 + Math.sin(T * 5 + m.seed) * 5 * shake + stern * 10, blink: bl });
        const [hx, hy] = headAt(down > 0.5 ? m.x : sx, m.y, m.s, true, down > 0.5 ? 'kneel' : 'stand');
        const flee = es(t, 3.2 + m.i * 0.05, 3.75 + m.i * 0.05, ease.in);
        m.w.forEach((w, k) => {
          const a = T * 1.3 + k * 2.1 + m.seed;
          pose(w, { x: hx + Math.cos(a) * 26 + flee * (160 + k * 60), y: hy - 38 + Math.sin(a) * 10 - flee * (240 + k * 40), s: m.s * (1 - flee * 0.6), r: Math.sin(a) * 15 + flee * 40, o: es(t, 1.95, 2.15) * (1 - flee) });
        });
      });
      // the cry is sealed shut, like the Pharisees' lips, and fades
      const cryOn = es(t, 2.3, 2.5, ease.back);
      const sealed = es(t, 3.18, 3.35, ease.back);
      pose(cry, { x: 1010, y: 470 + Math.sin(T * 5) * 2 * (1 - stern), sy: Math.max(0.02, cryOn * (1 - sealed * 0.12)), sx: Math.max(0.02, cryOn * (1 - sealed * 0.12)), r: Math.sin(T * 4) * 2 * (1 - stern) - sealed * 5, o: cryOn > 0.02 ? 1 - es(t, 3.5, 3.9) * 0.45 : 0 });
      pose(cryTape, { x: 0, y: -36, s: lerp(1.3, 1, sealed), o: sealed });
      const [jhx, jhy] = handAt(JX, JY, 1.04, false, 12 + stern * 70);
      pose(hushRays, { x: jhx + 14, y: jhy, s: 0.7 + seg(t, 3.1, 3.6) * 0.7, o: bump(t, 3.05, 3.9) });

      S.cam.z = 1 + es(t, 0.8, 1.4) * 0.05 + es(t, 1.9, 2.4) * 0.03;
      S.cam.y = es(t, 0.8, 1.4) * 30 + es(t, 1.9, 2.4) * 20;
      S.cam.x = -es(t, 0.8, 1.4) * 20 + es(t, 1.9, 2.4) * 40;
    };
  },
};
