// Łk 4,16c–19 — the synagogue of Nazareth on the Sabbath. Jesus rises from the front bench and steps up to the
// reading desk. The attendant brings the scroll of the prophet Isaiah from the ark and hands it to Him; He unrolls it
// and finds the place — and over the room the same scroll comes down on its strings and unrolls sideways between
// its two rollers. As He reads, each line is painted into its own column of the scroll: the Spirit coming down on
// Him; the horn of oil and a beggar's bowl receiving the good news; a prison door swinging open and the chain
// falling; a blind man's eye opening; a bent man's yoke breaking as he stands up; and the shofar under the golden
// round of the year of the Lord's favour.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { nazSynagogue, isaiahScroll, PICS, HAZZAN, scrollOpen, scrollRolled, headAt, voiceRings, labelTag, hangAt, sparkle, tr, DY, PI } from './lib.js';

const SX = 815, SY = 292;      // the big scroll's centre
const JX = 800;

export default {
  id: 'lk4-isaiah',
  beats: [
    { v: 16, cont: true, text: 'i powstał, aby czytać.' },
    { v: 17, text: 'Podano Mu księgę proroka Izajasza.' },
    { v: 17, cont: true, text: 'Rozwinąwszy księgę, natrafił na miejsce, gdzie było napisane:' },
    { v: 18, text: 'Duch Pański spoczywa na Mnie,' },
    { v: 18, cont: true, text: 'ponieważ Mnie namaścił i posłał Mnie, abym ubogim niósł dobrą nowinę,' },
    { v: 18, cont: true, text: 'więźniom głosił wolność,' },
    { v: 18, cont: true, text: 'a niewidomym przejrzenie;' },
    { v: 18, cont: true, text: 'abym uciśnionych odsyłał wolnymi,' },
    { v: 19 },
  ],
  cam: { x: [-30, 30], y: [-40, 50], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const N = nazSynagogue(S);
    const { FLOOR, FRONT } = N;

    /* ---------- the great scroll in the flies ---------- */
    const flies = S.layer({ par: 0.3, sh: 6 });
    const sc = isaiahScroll(c, { w: 700, h: 262 });
    const parch = flies.add(`<g transform="translate(0 -1500)">${sc.sheet}</g>`);
    const rollL = flies.add(`<g transform="translate(0 -1500)">${sc.rollerL}</g>`);
    const rollR = flies.add(`<g transform="translate(0 -1500)">${sc.rollerR}</g>`);
    const title = flies.add(`<g class="hang" transform="translate(0 -1500)"><path d="M0 -1600V-14" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/><g class="obj">${labelTag(tr('księga proroka Izajasza', 'the book of the prophet Isaiah'), 20)}</g></g>`);
    // the six pictures, each in a window of its column
    const pics = PICS.map((fn, k) => {
      const p = fn(c);
      const x = SX + sc.colX(k), y = SY + sc.winY;
      const win = sheet().p(c.cut(c.rect(-52, -94, 104, 188), 0.5, 6), shade(C.parchment, -0.09)).x(c.ribbon([[-52, -94], [52, -94], [52, 94], [-52, 94], [-52, -92]], 1.6), C.terracotta, 'opacity=".45"').out();
      const o = { k, x, y, win: flies.add(`<g opacity="0">${win}</g>`) };
      o.base = flies.add(`<g opacity="0">${p.base}</g>`);
      if (k === 0 || k === 5) o.act = flies.add(`<g opacity="0">${p.act}</g>`);
      if (k === 1) { o.act = flies.add(`<g opacity="0">${p.act}</g>`); o.drop = flies.add(`<g opacity="0">${p.drop}</g>`); }
      if (k === 2) { o.act = flies.add(`<g opacity="0">${p.act.replace('translate(-24 0)', 'translate(0 0)')}</g>`); o.chL = flies.add(`<g opacity="0">${p.chainL}</g>`); o.chR = flies.add(`<g opacity="0">${p.chainR}</g>`); }
      if (k === 3) { o.a = flies.add(`<g opacity="0">${p.blind}</g>`); o.b = flies.add(`<g opacity="0">${p.seeing}</g>`); o.eC = flies.add(`<g opacity="0">${p.eyeC}</g>`); o.eO = flies.add(`<g opacity="0">${p.eyeO}</g>`); }
      if (k === 4) { o.a = flies.add(`<g opacity="0">${p.bent}</g>`); o.b = flies.add(`<g opacity="0">${p.free}</g>`); o.yL = flies.add(`<g opacity="0">${p.yokeL}</g>`); o.yR = flies.add(`<g opacity="0">${p.yokeR}</g>`); }
      o.spark = flies.add(`<g opacity="0">${sparkle(c, 12)}</g>`);
      return o;
    });

    /* ---------- the congregation, the desk, the attendant, Jesus ---------- */
    const backL = S.layer({ par: 0.45, sh: 4 });
    const back = N.backRow(backL);
    const act = S.layer({ par: 0.55, sh: 5 });
    N.lectern(act);
    const heldOpen = `<g transform="translate(6 6) rotate(-60) scale(.5)">${scrollOpen(c, 70, 50)}</g>`;
    const heldRolled = `<g transform="translate(2 4) rotate(-30)">${scrollRolled(c, 46)}</g>`;
    const hz = S.puppet(act.add(person(c, { ...HAZZAN, holdF: heldRolled })));
    const hzFree = S.puppet(act.add(person(c, { ...HAZZAN })));
    const jSit = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jStand = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const jRolled = S.puppet(act.add(person(c, { ...CAST.jesus, holdF: heldRolled })));
    const jOpen = S.puppet(act.add(person(c, { ...CAST.jesus, holdF: heldOpen })));
    const voice = voiceRings(act, c, { n: 3, color: C.sun, r: 40, w: 5 });
    N.bench(act);
    const front = N.frontLooks().filter((m) => m.i !== 4).map((m) => ({ ...m, p: S.puppet(act.add(person(c, { ...m.o, pose: 'sit' }))) }));
    N.columns();

    return (t, time) => {
      N.flicker(time);

      /* v16c: He stands up to read */
      const up = es(t, 0.1, 0.17);
      const w = es(t, 0.2, 0.75);
      const jx = lerp(668, JX, w);
      jSit.set({ x: 668, y: FRONT - 6, s: 0.86, o: 1 - up, armF: 20, blink: blinkAt(time) });
      /* v17a: the scroll is handed to Him; v17b: He unrolls it */
      const given = es(t, 1.55, 1.62);
      const opened = es(t, 2.2, 2.27);
      const jArm = 14 + es(t, 1.35, 1.55) * 50 + opened * 10;
      jStand.set({ x: jx, y: FLOOR, s: 1.0, o: up * (1 - given), walk: w > 0 && w < 1 ? jx * 0.05 : undefined, armF: jArm, blink: blinkAt(time) });
      jRolled.set({ x: jx, y: FLOOR, s: 1.0, o: given * (1 - opened), armF: jArm - es(t, 1.62, 1.9) * 10, armB: es(t, 2.0, 2.2) * 40, head: 6, blink: blinkAt(time) });
      const reading = es(t, 3.0, 3.2);
      jOpen.set({ x: jx, y: FLOOR, s: 1.0, o: opened, armF: 52 + reading * 8, armB: 20 + reading * 10, head: 8 - reading * 6, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(jx, FLOOR, 1.0, false);
      voice(jhx, jhy, es(t, 3.0, 3.2) * 0.7, time, { spread: 2.2, dir: 1 });

      /* the attendant brings the scroll from the ark and steps back */
      const come = es(t, 0.7, 1.45);
      const back2 = es(t, 1.75, 2.2);
      const hx = lerp(1320, 900, come) + back2 * 150;
      const hMove = (come > 0 && come < 1) || (back2 > 0 && back2 < 1);
      const hArm = 20 + es(t, 1.3, 1.5) * 50 * (1 - given);
      hz.set({ x: hx, y: FLOOR, s: 0.98, flip: back2 < 0.05 || back2 > 0.97, o: 1 - given, walk: hMove ? hx * 0.05 : undefined, armF: hArm, head: 4, blink: blinkAt(time, 3) });
      hzFree.set({ x: hx, y: FLOOR, s: 0.98, flip: back2 < 0.05 || back2 > 0.97, o: given, walk: hMove ? hx * 0.05 : undefined, armF: 20 + (1 - back2) * 30, head: 4, blink: blinkAt(time, 3) });

      /* the big scroll comes down and unrolls */
      const down = es(t, 2.0, 2.3, ease.out);
      const open = es(t, 2.3, 2.75);
      const yy = lerp(-500, SY, down) + Math.sin(time * 0.8) * 2;
      const half = sc.w / 2;
      const vis = down > 0.01 ? 1 : 0;
      pose(parch, { x: SX, y: yy, sx: 0.02 + open * 0.98, o: vis && open > 0.01 ? 1 : 0 });
      pose(rollL, { x: SX - (8 + open * half), y: yy, o: vis });
      pose(rollR, { x: SX + (8 + open * half), y: yy, o: vis });
      hangAt(title, SX, lerp(-500, 140, es(t, 1.05, 1.35, ease.back)), time, 1.4, 0.8);

      /* the pictures, line by line */
      pics.forEach((p) => {
        const a = 3 + p.k;
        const inK = es(t, a + 0.02, a + 0.3, ease.out);
        const on = inK > 0.01 ? 1 : 0;
        const pop = (0.7 + inK * 0.3) * 1.12;
        pose(p.win, { x: p.x, y: yy + sc.winY, o: inK });
        pose(p.base, { x: p.x, y: yy + sc.winY, s: pop, o: inK });
        const doK = es(t, a + 0.25, a + 0.6);
        const sp = bump(t, a + 0.3, a + 0.85);
        pose(p.spark, { x: p.x + 30, y: yy - 50, s: sp, r: time * 60, o: sp });
        const Y = yy + sc.winY;
        if (p.k === 0) pose(p.act, { x: p.x, y: Y + (-78 + doK * 18) * 1.12, s: pop, o: on * inK });
        if (p.k === 1) {
          pose(p.drop, { x: p.x - 10, s: 1.12, y: Y + (-26 + seg(t, a + 0.25, a + 0.45) * 48) * 1.12, o: bump(t, a + 0.22, a + 0.5) });
          pose(p.act, { x: p.x + 26, y: Y + (-62 + doK * 72) * 1.12, r: (1 - doK) * 20, s: pop, o: on * inK });
        }
        if (p.k === 2) {
          pose(p.act, { x: p.x - 24 * pop, y: Y, s: pop, sx: pop * (1 - doK * 0.85), o: on * inK });
          pose(p.chL, { x: p.x + (-30 - doK * 10) * 1.12, y: Y + (10 + doK * 40) * 1.12, r: -doK * 60, s: 1, o: on * inK * (1 - seg(t, a + 0.6, a + 0.8)) });
          pose(p.chR, { x: p.x + (-4 + doK * 14) * 1.12, y: Y + (10 + doK * 44) * 1.12, r: doK * 70, s: 1, o: on * inK * (1 - seg(t, a + 0.6, a + 0.8)) });
        }
        if (p.k === 3 || p.k === 4) {
          const sw = es(t, a + 0.4, a + 0.47);
          pose(p.a, { x: p.x, y: Y, s: pop, o: inK * (1 - sw) });
          pose(p.b, { x: p.x, y: Y, s: pop, o: inK * sw });
        }
        if (p.k === 3) {
          const sw = es(t, a + 0.35, a + 0.45);
          pose(p.eC, { x: p.x + 24, y: Y - 11, s: 1.0, o: inK * (1 - sw) });
          pose(p.eO, { x: p.x + 24, y: Y - 11, s: 1.0 + sw * 0.1, o: inK * sw });
        }
        if (p.k === 4) {
          const br = es(t, a + 0.38, a + 0.7);
          pose(p.yL, { s: 1.12, x: p.x + (-6 - br * 26) * 1.12, y: Y + (-26 + br * 60) * 1.12, r: -br * 50, o: inK * (1 - seg(t, a + 0.6, a + 0.75)) });
          pose(p.yR, { s: 1.12, x: p.x + (6 + br * 26) * 1.12, y: Y + (-26 + br * 60) * 1.12, r: br * 50, o: inK * (1 - seg(t, a + 0.6, a + 0.75)) });
        }
        if (p.k === 5) pose(p.act, { x: p.x, y: Y + (-10 - doK * 24) * 1.12, r: t * 12, s: pop * (0.8 + doK * 0.2), o: on * inK });
      });

      /* the congregation: they turn to watch Him, then to the scroll */
      back.forEach((m) => m.p.set({ x: m.x, y: m.y, s: m.s, flip: m.x > JX, armF: 30, head: -es(t, 2.3, 2.6) * 8, blink: blinkAt(time, m.seed) }));
      front.forEach((m) => m.p.set({ x: m.x, y: FRONT - 6, s: 0.8, flip: !m.left, armF: 24, head: -es(t, 2.3, 2.6) * 10, blink: blinkAt(time, m.seed) }));

      S.cam.x = lerp(-20, 0, es(t, 0.1, 0.8)) + es(t, 0.8, 1.4) * 20 * (1 - es(t, 1.8, 2.2));
      S.cam.y = 30 - es(t, 2.0, 2.6) * 30;
      S.cam.z = 1.06 - es(t, 2.0, 2.6) * 0.03;
    };
  },
};
