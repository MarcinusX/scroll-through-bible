// J 2,1–2 — the curtains open on the third day: a village wedding at Cana. Garlands and lanterns come
// down, the musicians play, the guests dance round the bride and bridegroom under the canopy.
// The mother of Jesus is there, helping at the feast; then Jesus and His disciples arrive, invited.
import { C, person, CAST, blinkAt, pose, lerp, curtains, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { canaSet, canaIdle, LOOK, DISC, groomPuppet, bridePuppet, guest, canopy, tambourine, dayDisc, nameTag, hungWord, bowl, jug, basketProp, kf, moving, tr, PI } from './lib.js';

const FLOOR = 680;

/** a little reed flute (hold coords) */
function flute(c) {
  return sheet().p(c.ribbon([[0, -4], [0, 44]], 4.4), C.wood3).x(c.poly(c.circ(0, 14, 1.3, 6)) + c.poly(c.circ(0, 22, 1.3, 6)) + c.poly(c.circ(0, 30, 1.3, 6)), C.soilDark).out();
}

export default {
  id: 'j2-cana',
  beats: [
    { cover: true },
    { v: 1, text: 'Trzeciego dnia odbywało się wesele w Kanie Galilejskiej' },
    { v: 1, cont: true, text: 'i była tam Matka Jezusa.' },
    { v: 2 },
  ],
  cam: { x: [-30, 150], y: [-40, 60], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = canaSet(S, { floorY: FLOOR });

    /* the third day: three day-discs and the name of the village on the flies */
    const tagL = S.layer({ par: 0.06, sh: 5 });
    const days = ['I', 'II', 'III'].map((n, i) => {
      const el = hanging(tagL, dayDisc(c, n, 22), { x: 700 + i * 100, y: 168, len: 700 });
      return { el, lit: el.querySelector('.lit'), off: el.querySelector('.off'), i, x: 700 + i * 100 };
    });
    const canaWord = tagL.add(hungWord(c, tr('Kana Galilejska', 'Cana of Galilee'), { size: 26, len: 700 }));

    /* the canopy with bride and bridegroom */
    const canL = S.layer({ par: 0.44, sh: 5 });
    const cp = sheet();
    cp.p(c.cut(c.rect(612, 396, 10, 640 - 396), 0.4, 8) + c.cut(c.rect(978, 396, 10, 640 - 396), 0.4, 8), C.wood3);
    canL.add(cp.out() + `<g transform="translate(800 388)">${canopy(c, 420, 44)}</g>`);
    canL.add(sheet().p(c.ribbon(c.qbez([618, 400], [596, 480], [610, 560], 10), 5) + c.ribbon(c.qbez([984, 400], [1006, 480], [992, 560], 10), 5), C.jesusMantle).out());
    // guests at the back, still
    const backs = [[1060, 622, true, false], [1170, 630, true, true], [380, 628, false, false]].map(([x, y, flip, man]) => ({ x, y, flip, seed: c.rr(0, 9), p: S.puppet(canL.add(person(c, guest(c, man)))) }));
    // a side table with food by the door
    canL.add(`<g transform="translate(1250 ${FLOOR - 40})">${sheet().p(c.cut(c.rect(-70, -40, 140, 10), 0.3, 6), C.wood).p(c.cut(c.rect(-62, -30, 8, 36), 0.3, 4) + c.cut(c.rect(54, -30, 8, 36), 0.3, 4), C.wood2).out()}<g transform="translate(-36 -40)">${bowl(c, { food: 'fruit' })}</g><g transform="translate(0 -40)">${bowl(c, { food: 'bread', color: C.skyVeil })}</g><g transform="translate(40 -40) scale(.6)">${jug(c)}</g></g>`);
    const bride = S.puppet(canL.add(bridePuppet(c)));
    const groom = S.puppet(canL.add(groomPuppet(c)));

    /* musicians and dancers */
    const midL = S.layer({ par: 0.52, sh: 5 });
    const mus = [
      { x: 450, hold: `<g transform="translate(0 2) rotate(-8)">${flute(c)}</g>`, o: guest(c, true, { robe: C.tealRobe }) },
      { x: 530, hold: `<g transform="translate(0 8)">${tambourine(c)}</g>`, o: guest(c, false, { robe: C.roseRobe }) },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(midL.add(person(c, { ...m.o, holdF: m.hold }))) }));
    const dancers = [1000, 1080, 1160].map((x, i) => ({ x, i, ph: i * 1.3, seed: c.rr(0, 9), flip: i % 2 === 1, p: S.puppet(midL.add(person(c, guest(c, i % 2 === 0)))) }));

    /* Mary comes out of the house */
    const frontL = S.layer({ par: 0.6, sh: 6 });
    const mary = S.puppet(frontL.add(person(c, { ...LOOK.mary })));
    const maryTag = frontL.add(`<g>${nameTag(c, tr(['Matka', 'Jezusa'], ['Jesus’', 'mother']), { size: 17 })}</g>`);
    const maryGlow = frontL.add(`<g><circle r="120" fill="url(#halo-glow)" opacity=".55"/></g>`);

    /* Jesus and His disciples arrive */
    const dis = DISC.map((o, i) => ({ i, seed: c.rr(0, 9), p: S.puppet(frontL.add(person(c, o))), x: [480, 555, 630, 400, 700][i], y: [706, 712, 704, 716, 712][i] }));
    const jesus = S.puppet(frontL.add(person(c, { ...CAST.jesus })));

    const cur = curtains(S);

    const JK = [[2.95, -260], [3.55, 800]];
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);
      const fest = es(t, 1.15, 1.6);             // the wedding springs to life
      canaIdle(set, T, { lit: 0.25 + fest * 0.5, drop: (1 - fest) * 320 });

      /* the day discs light I, II, III; then the village name drops */
      days.forEach((d) => {
        const on = es(t, 1.02 + d.i * 0.14, 1.14 + d.i * 0.14);
        fade(d.lit, d.i === 2 ? on : on * (1 - es(t, 1.5, 1.7) * 0.75));
        pose(d.el, { x: d.x, y: 168 - (1 - es(t, 0.7, 1.0)) * 260 - es(t, 2.2, 2.6) * 300, r: Math.sin(T * 0.8 + d.i) * 1.5, s: d.i === 2 ? 1 + bump(t, 1.3, 1.6) * 0.2 : 1 });
      });
      pose(canaWord, { x: 800, y: 318 - (1 - es(t, 1.4, 1.7, ease.out)) * 320 - es(t, 2.2, 2.6) * 320, r: Math.sin(T * 0.7) * 1 });

      /* music and dance (driven by scrolling while the wedding is on) */
      const beat = t * 10;
      mus.forEach((m) => m.p.set({ x: m.x, y: FLOOR - 36, s: 0.88, flip: false, armF: m.i ? 120 + Math.sin(beat + 1) * 16 * fest : 70, armB: m.i ? 30 : 64, head: m.i ? Math.sin(beat) * 5 * fest : -6, bob: -Math.abs(Math.sin(beat * 0.5)) * 4 * fest, blink: blinkAt(T, m.seed) }));
      const out = es(t, 2.9, 3.2);
      dancers.forEach((d) => {
        const st = Math.sin(beat * 0.8 + d.ph) * fest;
        d.p.set({ x: d.x + st * 12 + out * 40, y: FLOOR - 24 - Math.abs(st) * 6, s: 0.9, flip: d.flip, armF: 70 + fest * (60 + st * 30), armB: 40 + fest * (90 - st * 30), head: st * 6, lean: st * 4, blink: blinkAt(T, d.seed) });
      });
      backs.forEach((b) => b.p.set({ x: b.x, y: b.y, s: 0.8, flip: b.flip, armF: 20 + fest * 30, armB: 10, blink: blinkAt(T, b.seed) }));

      /* bride and bridegroom; he steps out to welcome the guests */
      const greet = es(t, 3.35, 3.7);
      bride.set({ x: 712, y: 640, s: 0.9, flip: false, armF: 40 + fest * 30 + Math.sin(beat * 0.5) * 8 * fest, armB: 20 + fest * 40, head: -fest * 4, blink: blinkAt(T, 2) });
      const gx = lerp(880, 905, greet), gy = lerp(640, 704, greet);
      groom.set({ x: gx, y: gy, s: lerp(0.9, 1, greet), flip: greet > 0.5, walk: greet > 0.02 && greet < 0.98 ? gx * 0.2 : undefined, armF: 40 + fest * 30 + greet * 60, armB: 30 + fest * 50 + greet * 60, head: greet * 6, blink: blinkAt(T, 4) });

      /* the mother of Jesus */
      const mIn = es(t, 2.0, 2.55, ease.out);
      const mx = lerp(1130, 1030, mIn), my = lerp(600, 712, mIn);
      mary.set({ x: mx, y: my, s: lerp(0.8, 1, mIn), flip: true, walk: mIn > 0.02 && mIn < 0.98 ? mx * 0.12 : undefined, armF: 60 - bump(t, 2.5, 3.2) * 20, armB: 20 + bump(t, 2.55, 3.1) * 50, head: -4 + greet * 10, blink: blinkAt(T, 7), o: seg(t, 1.95, 2.05) });
      const tagK = es(t, 2.35, 2.6, ease.back) * (1 - es(t, 3.2, 3.45));
      pose(maryTag, { x: mx, y: my - 250 - (1 - tagK) * 40, s: 0.4 + 0.6 * tagK, o: tagK });
      pose(maryGlow, { x: mx, y: my - 130, o: bump(t, 2.1, 3.1) });

      /* Jesus and the disciples walk in from the left */
      const jx = kf(t, JK, ease.out);
      const walking = moving(t, JK);
      jesus.set({ x: jx, y: 716, s: 1.05, walk: walking ? jx * 0.07 : undefined, armF: greet * 50, armB: greet * 20, head: greet * 3, blink: blinkAt(T, 1), o: seg(t, 2.9, 3.0) });
      dis.forEach((d) => {
        const k = es(t, 2.95 + d.i * 0.05, 3.5 + d.i * 0.05, ease.out);
        const x = lerp(-300 - d.i * 70, d.x - 60, k);
        d.p.set({ x, y: d.y, s: 0.94, flip: false, walk: k > 0.01 && k < 0.99 ? x * 0.07 : undefined, armF: 10 + greet * (d.i % 2 ? 40 : 10), head: greet * 4, blink: blinkAt(T, d.seed), o: seg(t, 2.9, 3.0) });
      });

      S.cam.z = 1 + es(t, 0.6, 1.6) * 0.06 + es(t, 2.9, 3.6) * 0.04;
      S.cam.y = es(t, 0.6, 1.6) * 20 + es(t, 2.9, 3.6) * 30;
      // phone: follow the mother of Jesus, who stands by the door on the right
      S.cam.x = S.portrait ? es(t, 1.9, 2.4) * (1 - es(t, 2.85, 3.2)) * 140 : bump(t, 1.9, 3.0) * 20;
    };
  },
};
