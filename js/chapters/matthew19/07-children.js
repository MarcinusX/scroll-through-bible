// Mt 19,13–15 — mothers and fathers bring their children for Him to lay His hands on them and pray; the disciples
// step into the way and scold them, and the children's faces fall. "Let the little children come to Me!" — the
// disciples step aside and the children run to Him; little crowns of light settle on their heads (the Kingdom
// belongs to such as these). He kneels and lays His hands on them — then gets up and goes on His way, the
// children waving after Him.
import { C, person, CAST, blinkAt, pose, lerp, crowdPerson } from '../kit.js';
import { bush, rock, house } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { roadSet, shadeTree, TWELVE, child, withFace, faceBits, face, heart, spark, headAt, sheet } from './lib.js';

const GY = 676;
const JX = 730;

/** a little crown of light (head coords of a child) */
function lightCrown(c, r = 13) {
  return `<circle r="${r * 2}" fill="url(#halo-glow)"/>${sheet().p(c.cut([[-r, 0], [-r, -r * 0.7], [-r * 0.5, -r * 0.2], [0, -r], [r * 0.5, -r * 0.2], [r, -r * 0.7], [r, 0]], 0.3, 3), C.halo).out()}`;
}

export default {
  id: 'mt19-children',
  beats: [
    { v: 13, text: 'Wtedy przyniesiono Mu dzieci, aby włożył na nie ręce i pomodlił się za nie;' },
    { v: 13, cont: true, text: 'a uczniowie szorstko zabraniali im tego.' },
    { v: 14, text: 'Lecz Jezus rzekł: «Dopuśćcie dzieci i nie przeszkadzajcie im przyjść do Mnie;' },
    { v: 14, cont: true, text: 'do takich bowiem należy królestwo niebieskie».' },
    { v: 15, text: 'Włożył na nie ręce' },
    { v: 15, cont: true, text: 'i poszedł stamtąd.' },
  ],
  cam: { x: [-60, 300], y: [-30, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.16, jerX: 1300, roadX: 900, trees: 18, clouds: [[500, 120, 170], [1150, 180, 130]] });
    const vil = S.layer({ par: 0.28, sh: 3 });
    vil.add(house(c, 1180, 594, 80, 60) + house(c, 1270, 600, 60, 44) + house(c, 290, 596, 70, 50));
    const treeL = S.layer({ par: 0.4, sh: 4 });
    treeL.add(shadeTree(c, 560, 664, 1.25) + bush(c, 400, 668, 90, C.sage, C.moss));
    const glow = treeL.add(`<g opacity="0"><circle r="230" fill="url(#warm-glow)"/></g>`);
    const seatStone = treeL.add(`<g>${sheet().p(c.cut(c.blob(0, -14, 44, 20, 12, 0.15), 0.8, 6), C.rock).out()}</g>`);
    pose(seatStone, { x: JX + 6, y: GY + 2 });

    /* the families */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const PARENTS = [
      { o: { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', robe: C.lavender, veil: C.cream }, x: 1010, y: GY - 30, s: 0.9 },
      { o: { ...crowdPerson(c), hairStyle: 'short', beard: 'full', robe: C.ochreRobe, mantle: C.sageRobe }, x: 1110, y: GY - 34, s: 0.9 },
      { o: { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', robe: C.skyVeil, veil: C.blushVeil }, x: 1200, y: GY - 26, s: 0.88 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, m.o))) }));
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[1], TWELVE[2]].map((d, i) => {
      const el = pL.add(withFace(person(c, d.o), faceBits(c)));
      return { ...d, i, el, p: S.puppet(el), seed: c.rr(0, 9) };
    });
    const KIDS = Array.from({ length: 5 }, (_, i) => {
      const el = pL.add(withFace(person(c, child(c, i)), faceBits(c)));
      return { i, el, p: S.puppet(el), seed: c.rr(0, 9), x0: 960 + i * 58, y0: GY + (i % 2) * 10, s: 0.5 + (i % 3) * 0.03 };
    });
    const jSit = S.puppet(pL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jStandEl = pL.add(person(c, { ...CAST.jesus }));
    const jStand = S.puppet(jStandEl);
    const jKneel = S.puppet(pL.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jGo = S.puppet(pL.add(person(c, { ...CAST.jesus })));
    const fxL = S.layer({ par: 0.5, sh: 5 });
    const crowns = KIDS.map(() => fxL.add(`<g opacity="0">${lightCrown(c)}</g>`));
    const hearts = KIDS.map(() => fxL.add(`<g opacity="0">${heart(c, 11)}</g>`));
    const sparks = Array.from({ length: 4 }, () => fxL.add(`<g opacity="0">${spark(c, 9)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 200, 990, 230, C.sage, C.moss) + rock(c, 1420, 990, 210, 70, C.rock2));

    // where the children stand round Him
    const AT = [[JX - 110, GY + 14], [JX - 56, GY + 30], [JX + 76, GY + 30], [JX + 130, GY + 14], [JX - 170, GY + 24]];

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 6) * 30 });

      /* the disciples: step in the way (1), turn at His word (2), step aside (2), follow Him away (5) */
      const block = es(t, 1.0, 1.3) * (1 - es(t, 2.0, 2.35));
      const turnBack = es(t, 2.05, 2.25);
      const aside = es(t, 2.1, 2.5);
      const go = es(t, 5.05, 5.7);
      DIS.forEach((d) => {
        const bx = lerp(760 + d.i * 70, 850 + d.i * 44, es(t, 0.9, 1.2));
        let x = lerp(bx, 470 + d.i * 64, aside);
        const y = lerp(GY - 34 + (d.i % 2) * 12, GY - 60 + (d.i % 2) * 8, aside);
        const gd = es(t, 5.12 + d.i * 0.05, 5.75 + d.i * 0.05);
        x += gd * 380;
        const scold = block * (1 - turnBack);
        const moving = (t > 0.9 && t < 1.2) || (aside > 0 && aside < 1) || (gd > 0 && gd < 1);
        d.p.set({ x, y, s: lerp(0.9, 0.78, aside), flip: turnBack > 0.5 && aside > 0.5 && aside < 1, walk: moving ? x * 0.06 : undefined, armF: scold * (70 + Math.sin(T * 5 + d.i) * 10) + 8, armB: scold * (d.i % 2 ? 110 : 40), head: turnBack * -4 + scold * 4, lean: scold * 3, blink: blinkAt(T, d.seed) });
        face(d.el, 'angry', scold);
        face(d.el, 'sad', es(t, 2.1, 2.3) * (1 - es(t, 2.6, 2.9)));
      });

      /* parents & children arrive (0), are stopped (1), children run to Him (2) */
      const come = es(t, -0.2, 0.75);
      PARENTS.forEach((m) => {
        const stepBack = es(t, 2.6, 3.0);
        const x = lerp(m.x + 480, m.x, come) + stepBack * 90;
        const release = 1 - es(t, 2.3, 2.6);
        const push = es(t, 0.4, 0.8) * (1 - block) * release;
        const wave = es(t, 5.2, 5.5);
        m.p.set({ x, y: m.y - stepBack * 16, s: m.s * (1 - stepBack * 0.06), flip: true, walk: (come > 0 && come < 1) || (stepBack > 0 && stepBack < 1) ? x * 0.05 + m.i : undefined, armF: 14 + push * 40 + block * 60 * release + stepBack * 30 * (1 - wave), armB: block * 50 * release + stepBack * 20 + wave * (m.i === 1 ? 0 : 120 + Math.sin(T * 5 + m.i) * 12), head: block * 6 - stepBack * 4, blink: blinkAt(T, m.seed) });
      });
      const hug = es(t, 4.05, 4.4);
      const wave = es(t, 5.15, 5.45);
      KIDS.forEach((k) => {
        const run = es(t, 2.25 + k.i * 0.07, 2.75 + k.i * 0.07);
        let x = lerp(k.x0 + 480, k.x0 + block * 20, come);
        let y = k.y0;
        x = lerp(x, AT[k.i][0], run); y = lerp(y, AT[k.i][1], run);
        const running = (come > 0 && come < 1) || (run > 0 && run < 1);
        const fl = run < 0.5 ? true : wave > 0.5 ? false : x > JX;
        k.p.set({ x, y, s: k.s, flip: fl, walk: running ? x * 0.1 + k.i : undefined, bob: running ? Math.abs(Math.sin(x * 0.1)) * -6 : 0, armF: run * 60 * (1 - hug) + hug * 40 * (1 - wave) + block * 10, armB: run * 100 * (1 - hug) + hug * 60 * (1 - wave) + wave * (140 + Math.sin(T * 6 + k.i) * 14), head: -run * 8 - hug * 6 + block * 10, blink: blinkAt(T, k.seed) });
        face(k.el, 'sad', block * (1 - run));
        const [hx, hy] = headAt(x, y, k.s, fl);
        pose(crowns[k.i], { x: hx, y: hy - 24, s: es(t, 3.1 + k.i * 0.06, 3.35 + k.i * 0.06, ease.back) * 0.9, o: t > 3.1 ? 1 : 0 });
        pose(hearts[k.i], { x: hx + (k.i - 2) * 6, y: hy - 50 - es(t, 4.3, 5) * 30, s: es(t, 4.3 + k.i * 0.05, 4.55 + k.i * 0.05, ease.back) * 0.9 * (1 - es(t, 5.1, 5.4)), o: t > 4.3 ? 1 : 0 });
      });

      /* Jesus: seated → stands, arms open → kneels and lays His hands on them → rises and goes on */
      const up = es(t, 2.03, 2.1), kneel = es(t, 4.0, 4.07), rise = es(t, 5.03, 5.1);
      const open = es(t, 2.1, 2.4) * (1 - kneel);
      const gx = lerp(JX + 8, JX + 330, es(t, 5.12, 5.8));
      jSit.set({ x: JX, y: GY, s: 1, o: 1 - up, armF: 30 + bump(t, 0.4, 1) * 40, armB: bump(t, 0.5, 1) * 30, head: -2 + bump(t, 1.1, 1.9) * 6, blink: blinkAt(T) });
      jStand.set({ x: JX, y: GY, s: 1.02, o: up * (1 - kneel), armF: open * 100 + bump(t, 3.1, 3.9) * 20, armB: open * 130, head: -open * 4 + Math.sin(T * 0.6) * 1.2, blink: blinkAt(T) });
      jKneel.set({ x: JX + 8, y: GY + 8, s: 1.02, o: kneel * (1 - rise), armF: 80 + Math.sin(T * 0.8) * 4, armB: 150, head: 6, blink: blinkAt(T, 1) });
      jGo.set({ x: gx, y: GY, s: 1.02, o: rise, flip: false, walk: t > 5.12 && t < 5.8 ? gx * 0.07 : undefined, armB: es(t, 5.6, 5.9) * 30, head: 0, blink: blinkAt(T, 2) });
      pose(glow, { x: JX + 10, y: GY - 90, s: 0.5 + es(t, 4.05, 4.6) * 0.6, o: es(t, 4.05, 4.5) * 0.75 * (1 - es(t, 5.1, 5.5)) });
      sparks.forEach((sp, i) => {
        const k = T ? (T * 0.4 + i / 4) % 1 : 0.5;
        pose(sp, { x: JX - 120 + i * 80, y: GY - 150 - k * 120, s: 0.8, o: es(t, 4.2, 4.5) * (1 - es(t, 5.1, 5.4)) * Math.sin(k * Math.PI) });
      });

      S.cam.x = -20 + es(t, 5.1, 5.8) * 300;
      S.cam.z = 1 + es(t, 1.9, 2.3) * 0.05 + es(t, 3.9, 4.4) * 0.08 - es(t, 5.0, 5.5) * 0.1;
      S.cam.y = -es(t, 1.9, 2.3) * 10 + es(t, 3.9, 4.4) * 30 - es(t, 5.0, 5.5) * 20;
    };
  },
};
