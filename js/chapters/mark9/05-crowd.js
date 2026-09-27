// Mk 9,14–19 — at the foot of the mountain: a crowd, the nine disciples arguing with scribes.
// The crowd runs to greet Jesus; he asks what the argument is about; a father steps out with his
// son, who has a mute spirit (a dark wisp curls about him); his fits are shown as a small, restrained
// memory-plate; the disciples could not help; Jesus sighs over an unbelieving generation — "Bring him to me."
import { C, person, CAST, blinkAt, pose, lerp, crowd, swing, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { plainSet, PLAIN_ROWS, TWELVE, LOOK, scribe, shout, bubble, speech, GLYPH, wisp, withFace, faceBits, seizurePlate, dust, kf } from './lib.js';

const PI = Math.PI;
const FEET = 724;

export default {
  id: 'm9-crowd',
  beats: [
    { v: 14 },
    { v: 15 },
    { v: 16 },
    { v: 17 },
    { v: 18, text: 'Ten, gdziekolwiek go chwyci, rzuca nim, a on wtedy się pieni, zgrzyta zębami i drętwieje.' },
    { v: 18, cont: true, text: 'Powiedziałem Twoim uczniom, żeby go wyrzucili, ale nie mogli».' },
    { v: 19, text: 'On zaś rzekł do nich: «O plemię niewierne, dopóki mam być z wami? Dopóki mam was cierpieć?' },
    { v: 19, cont: true, text: 'Przyprowadźcie go do Mnie!»' },
  ],
  cam: { x: [-20, 140], y: [0, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = plainSet(S);

    /* ---------- the crowd around them ---------- */
    const crowdL = S.layer({ par: 0.34, sh: 3 });
    const people = crowd(S, crowdL, PLAIN_ROWS);
    people.forEach((m) => { m.run = m.x > 500 && m.x < 1300 && m.i % 2 === 0; });

    /* ---------- the nine and the scribes arguing ---------- */
    const mainL = S.layer({ par: 0.5, sh: 5 });
    const NINE = TWELVE.filter((d) => !['peter', 'james', 'john'].includes(d.k)).slice(0, 6);
    const dis = NINE.map((d, i) => ({ ...d, i, x: 980 + i * 38 + (i % 2) * 6, y: FEET - 22 + (i % 2) * 12, s: 0.94, seed: c.rr(0, 9), p: S.puppet(mainL.add(withFace(person(c, d.o), faceBits(c)))) }));
    dis.forEach((d) => { d.sad = d.p.el.querySelector('[data-part="sad"]'); });
    const scribes = [0, 1, 2].map((i) => ({ i, x: 1220 + i * 52, y: FEET - 16 + (i % 2) * 10, s: 0.98, seed: c.rr(0, 9), p: S.puppet(mainL.add(scribe(c, i))) }));
    const words = [
      { el: mainL.add(`<g opacity="0">${shout('?!', { size: 26, jag: true, c })}</g>`), x: 1250, y: 440 },
      { el: mainL.add(`<g opacity="0">${shout('!', { size: 28, jag: true, c, flip: true })}</g>`), x: 1080, y: 450 },
      { el: mainL.add(`<g opacity="0">${shout('?', { size: 26, jag: true, c })}</g>`), x: 1190, y: 420 },
    ];

    /* ---------- the father and his son ---------- */
    const father = S.puppet(mainL.add(withFace(person(c, LOOK.father), faceBits(c))));
    const fSad = father.el.querySelector('[data-part="sad"]');
    const boy = S.puppet(mainL.add(person(c, LOOK.boy)));
    const boyWisp = mainL.add(`<g opacity="0">${wisp(c, 1.1, '#463a52')}</g>`);
    const fatherSays = mainL.add(`<g opacity="0">${bubble(c, tr('Nauczycielu!', 'Teacher!'), { size: 20, tail: 1 })}</g>`);

    /* ---------- Jesus and the three, arriving from the mountain ---------- */
    const jL = S.layer({ par: 0.5, sh: 5 });
    const THREE = [CAST.john, CAST.james, CAST.peter].map((o, i) => ({ i, o, seed: c.rr(0, 9), p: S.puppet(jL.add(person(c, o))) }));
    const jesus = S.puppet(jL.add(withFace(person(c, CAST.jesus), faceBits(c))));
    const jSad = jesus.el.querySelector('[data-part="sad"]');
    const ask = jL.add(`<g opacity="0">${speech(c, GLYPH.q(c), { w: 56, h: 44 })}</g>`);
    const sigh = jL.add(`<g opacity="0">${dust(c, 16, C.cream)}</g>`);

    /* ---------- the memory plate: how the spirit throws him down ---------- */
    const plL = S.layer({ par: 0.1, sh: 5 });
    const SP = seizurePlate(c, 82);
    const memo = hanging(plL, `<g transform="scale(1.35)">${SP.back}<g data-k="mboy"><g transform="scale(.36)">${person(c, { ...LOOK.boy, robe: mix(LOOK.boy.robe, C.stone2, 0.3) })}</g></g><g data-k="mshards">${SP.shards}</g></g>`, { x: 900, y: 240, len: 900 });
    const mboy = S.$('mboy'), mshards = S.$('mshards');

    const fg = S.layer({ par: 0.85, sh: 6 });
    fg.add(sheet().p(c.cut(c.blob(160, 970, 220, 90, 14, 0.15), 1.4, 8), C.rock2).p(c.cut(c.blob(1480, 980, 200, 80, 14, 0.15), 1.4, 8), C.rock).out());

    return (t, time) => {
      const T = time;
      set.clouds.forEach((cl) => swing(cl.el, cl.x + Math.sin(T * 0.1 + cl.i) * 20, cl.y, T, 1.3, 0.6, cl.i));

      /* Jesus comes in from the left (beat 0), the crowd runs to him (beat 1) */
      const jx = kf(t, [[0, 260], [0.9, 560], [1.4, 640], [2, 700]]);
      const jWalk = (t > 0.02 && t < 0.9) || (t > 1.05 && t < 1.95);
      const sighK = es(t, 6.05, 6.4) * (1 - es(t, 6.9, 7.1));
      const beckon = es(t, 7.05, 7.35);
      jesus.set({
        x: jx, y: FEET, s: 1.1, walk: jWalk ? jx * 0.05 : undefined, amt: 0.9,
        armF: 14 + bump(t, 1.2, 1.95) * 50 + es(t, 2.05, 2.3) * 40 * (1 - es(t, 2.85, 3.1)) + sighK * 40 + beckon * (60 + Math.sin(T * 3) * 10 * (1 - es(t, 7.5, 7.8))),
        armB: 10 + bump(t, 1.2, 1.95) * 70 + sighK * 50, head: -2 - sighK * 10 + es(t, 3.1, 3.4) * 4, blink: blinkAt(T, 1),
      });
      pose(jSad, { o: sighK });
      THREE.forEach((d) => {
        const x = kf(t, [[0, 140 - d.i * 70], [1, 470 - d.i * 70], [2, 580 - d.i * 62]]);
        d.p.set({ x, y: FEET - 14 - d.i * 6, s: 0.96, walk: (t > 0.02 && t < 1) || (t > 1.05 && t < 1.95) ? x * 0.05 + d.i : undefined, amt: 0.9, head: -4 + es(t, 5.1, 5.5) * 6, blink: blinkAt(T, d.seed) });
      });
      pose(ask, { x: jx + 18, y: FEET - 222, s: es(t, 2.1, 2.3, ease.back), o: bump(t, 2.05, 2.95) > 0.05 ? 1 : 0 });
      pose(sigh, { x: jx + 36 + es(t, 6.2, 6.8) * 30, y: FEET - 182 - es(t, 6.2, 6.8) * 20, s: 0.6 + es(t, 6.2, 6.8) * 0.8, o: bump(t, 6.15, 6.9) });

      /* the argument (beat 0) — it dies away when they see him */
      const argue = es(t, -0.2, 0.2) * (1 - es(t, 0.9, 1.2));
      words.forEach((w, i) => pose(w.el, { x: w.x, y: w.y + Math.sin(T * 2 + i) * 3, s: 0.9 + Math.sin(T * 5 + i * 2) * 0.05 * argue, o: argue * (Math.sin(T * 1.6 + i * 2.1) > -0.4 ? 1 : 0.2) }));
      const shrug = es(t, 5.1, 5.4) * (1 - es(t, 7.2, 7.6));
      dis.forEach((d) => {
        const turn = es(t, 0.7 + d.i * 0.04, 0.9 + d.i * 0.04);
        const gest = argue * (Math.sin(T * 3 + d.seed) * 0.5 + 0.5);
        d.p.set({ x: d.x - turn * 30, y: d.y, s: d.s, flip: turn > 0.5, armF: 20 + gest * 50 + shrug * 50, armB: 10 + gest * 30 * (d.i % 2) + shrug * 60, head: -4 + shrug * 12, lean: shrug * 4, blink: blinkAt(T, d.seed) });
        pose(d.sad, { o: shrug });
      });
      scribes.forEach((m) => {
        const gest = argue * (Math.sin(T * 2.6 + m.seed) * 0.5 + 0.5);
        const back = es(t, 3, 3.5);
        m.p.set({ x: m.x + back * 40, y: m.y, s: m.s, flip: true, armF: 20 + gest * 60 + es(t, 5.1, 5.4) * 20, armB: 10 + gest * 40, head: -4 - es(t, 5.1, 5.5) * 6, blink: blinkAt(T, m.seed) });
      });

      /* the crowd greets him */
      people.forEach((m) => {
        const r = m.run ? es(t, 1.02 + m.delay * 0.3, 1.5 + m.delay * 0.3) : 0;
        const x = m.x - r * (m.x - 620) * 0.4;
        const look = es(t, 0.8 + m.delay * 0.2, 1.1 + m.delay * 0.2);
        m.p.set({ x, y: m.y, s: m.s, flip: look > 0.5 ? true : m.x > 800, walk: r > 0 && r < 1 ? x * 0.06 : undefined, armF: bump(t, 1.1 + m.delay * 0.3, 2.2) * (m.i % 3 === 0 ? 110 : 40), armB: bump(t, 1.1 + m.delay * 0.3, 2.2) * (m.i % 3 === 1 ? 120 : 0), blink: blinkAt(T, m.seed) });
      });

      /* the father and his son step out of the crowd */
      const out = es(t, 3.02, 3.45);
      const toJ = es(t, 7.35, 7.95);
      const fx = lerp(lerp(1060, 880, out), 850, toJ), bx = lerp(lerp(1120, 950, out), 910, toJ);
      const plead = es(t, 3.3, 3.6) * (1 - es(t, 5.9, 6.1)) + es(t, 7.1, 7.3);
      father.set({ x: fx, y: FEET + 6, s: 1.04, flip: true, o: es(t, 2.9, 3.1), walk: (out > 0 && out < 1) || (toJ > 0 && toJ < 1) ? fx * 0.06 : undefined, armF: 20 + plead * 60 + es(t, 5.05, 5.3) * 40 * (1 - es(t, 5.8, 6)), armB: 10 + plead * 30 + bump(t, 4.1, 4.9) * 70, head: -6 + bump(t, 4.1, 4.9) * 8, blink: blinkAt(T, 3) });
      pose(fSad, { o: es(t, 3.3, 3.6) });
      boy.set({ x: bx, y: FEET + 10, s: 0.66, flip: true, o: es(t, 2.9, 3.1), walk: (out > 0 && out < 1) || (toJ > 0 && toJ < 1) ? bx * 0.07 : undefined, head: 8, armF: 6, blink: 0 });
      pose(boyWisp, { x: bx + 16 + Math.sin(T * 1.3) * 4, y: FEET - 108 + Math.sin(T * 1.7) * 3, s: 0.9 + Math.sin(T * 2) * 0.06, r: Math.sin(T * 1.1) * 10, o: es(t, 3.3, 3.7) * 0.85 });
      pose(fatherSays, { x: fx - 50, y: FEET - 226, s: es(t, 3.1, 3.3, ease.back), o: bump(t, 3.05, 3.95) > 0.05 ? 1 : 0 });

      /* the memory-plate (beat 4): he is thrown down, the dark wraps him, he goes stiff */
      const mp = es(t, 4.05, 4.3, ease.back) * (1 - es(t, 4.95, 5.2));
      swing(memo, 900, lerp(-1000, 240, mp), T, 1.1, 0.8, 1);
      const fall = es(t, 4.3, 4.55);
      const shake = seg(t, 4.3, 4.8) > 0 && t < 4.8 ? Math.sin(T * 30) * 3 : 0;
      pose(mboy, { x: lerp(0, -30, fall), y: lerp(40, 36, fall), r: -fall * 84 + shake });
      pose(mshards, { x: 0, y: 10, r: T * 25, s: 0.8 + Math.sin(T * 3) * 0.1, o: es(t, 4.25, 4.45) });

      S.cam.x = kf(t, [[0, 140], [0.6, 120], [1.3, 20], [2, 0], [3.3, 60], [6, 20], [7.5, 40]]);
      S.cam.z = 1.06 + es(t, 5.9, 6.4) * 0.05 - es(t, 7.1, 7.6) * 0.03;
      S.cam.y = 24 + es(t, 5.9, 6.4) * 16;
    };
  },
};
