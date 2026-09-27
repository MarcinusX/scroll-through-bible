// Mk 10,13–16 — mothers and fathers bring their children for Jesus to touch; the disciples block
// the way. Jesus stands up, indignant: "Let the children come to me!" They run to him; tiny crowns of
// light settle on their heads. A little door of light: only those who become small go in — Peter has
// to kneel. Then he takes them in his arms, lays his hands on them and blesses them.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix, crowdPerson } from '../kit.js';
import { bush, rock, house } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { roadSet, shadeTree, TWELVE, child, withFace, faceBits, face, heart, spark, headAt, bang } from './lib.js';

const GY = 676;
const JX = 730;

/** a small arched door of light, child-sized; origin: threshold centre */
function smallDoor(c) {
  const s = sheet();
  const w = 70, h = 118;
  s.p(c.cut([[-w / 2 - 12, 4], [-w / 2 - 12, -h + 10], ...c.arc(0, -h + 10, w / 2 + 12, 44, Math.PI, 2 * Math.PI, 14), [w / 2 + 12, 4]], 0.5, 6), C.sun);
  s.x(c.cut([[-w / 2, 2], [-w / 2, -h + 14], ...c.arc(0, -h + 14, w / 2, 34, Math.PI, 2 * Math.PI, 14), [w / 2, 2]], 0.3, 5), '#fff6d6');
  return `<circle cx="0" cy="${-h * 0.5}" r="${h * 1.3}" fill="url(#halo-glow)"/>${s.out()}`;
}
/** a little crown of light (head coords of a child) */
function lightCrown(c, r = 13) {
  return `<circle r="${r * 2}" fill="url(#halo-glow)"/>${sheet().p(c.cut([[-r, 0], [-r, -r * 0.7], [-r * 0.5, -r * 0.2], [0, -r], [r * 0.5, -r * 0.2], [r, -r * 0.7], [r, 0]], 0.3, 3), C.halo).out()}`;
}

export default {
  id: 'm10-children',
  beats: [
    { v: 13, text: 'Przynosili Mu również dzieci, żeby ich dotknął;' },
    { v: 13, cont: true, text: 'lecz uczniowie szorstko zabraniali im tego.' },
    { v: 14, text: 'A Jezus, widząc to, oburzył się i rzekł do nich:' },
    { v: 14, cont: true, text: '«Pozwólcie dzieciom przychodzić do Mnie, nie przeszkadzajcie im;' },
    { v: 14, cont: true, text: 'do takich bowiem należy królestwo Boże.' },
    { v: 15 },
    { v: 16 },
  ],
  cam: { x: [-60, 60], y: [-30, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const R = roadSet(S, { jer: 0.16, jerX: 1210, roadX: 900, trees: 16, clouds: [[500, 120, 170], [1100, 180, 130]] });
    const vil = S.layer({ par: 0.28, sh: 3 });
    vil.add(house(c, 1180, 594, 80, 60) + house(c, 1270, 600, 60, 44) + house(c, 290, 596, 70, 50));
    const treeL = S.layer({ par: 0.4, sh: 4 });
    treeL.add(shadeTree(c, 560, 664, 1.25) + bush(c, 400, 668, 90, C.sage, C.moss));
    const glow = treeL.add(`<g opacity="0"><circle r="230" fill="url(#warm-glow)"/></g>`);
    const seatStone = treeL.add(`<g>${sheet().p(c.cut(c.blob(0, -14, 44, 20, 12, 0.15), 0.8, 6), C.rock).out()}</g>`);
    pose(seatStone, { x: JX + 6, y: GY + 2 });
    const doorL = S.layer({ par: 0.45, sh: 4 });
    const door = doorL.add(`<g opacity="0">${smallDoor(c)}</g>`);

    /* the families */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const PARENTS = [
      { o: { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', robe: C.lavender, veil: C.cream }, x: 1010, y: GY - 30, s: 0.9 },
      { o: { ...crowdPerson(c), hairStyle: 'short', beard: 'full', robe: C.ochreRobe, mantle: C.sageRobe }, x: 1110, y: GY - 34, s: 0.9 },
      { o: { ...crowdPerson(c), hairStyle: 'veil', beard: 'none', robe: C.skyVeil, veil: C.blushVeil }, x: 1200, y: GY - 26, s: 0.88 },
    ].map((m, i) => ({ ...m, i, seed: c.rr(0, 9), p: S.puppet(pL.add(person(c, m.o))) }));
    // the disciples who block the way (standing and, for Peter, kneeling at the little door)
    const DIS = [TWELVE[0], TWELVE[3], TWELVE[1], TWELVE[2]].map((d, i) => ({ ...d, i, seed: c.rr(0, 9), el: pL.add(withFace(person(c, d.o), faceBits(c))) }));
    DIS.forEach((d) => { d.p = S.puppet(d.el); });
    const peterKneel = S.puppet(pL.add(person(c, { ...TWELVE[0].o, pose: 'kneel' })));
    const KIDS = Array.from({ length: 5 }, (_, i) => {
      const el = pL.add(withFace(person(c, child(c, i)), faceBits(c)));
      return { i, el, p: S.puppet(el), seed: c.rr(0, 9), crown: null, x0: 960 + i * 58, y0: GY + (i % 2) * 10, s: 0.5 + (i % 3) * 0.03 };
    });
    const jSitEl = pL.add(person(c, { ...CAST.jesus, pose: 'sit' }));
    const jStandEl = pL.add(withFace(person(c, { ...CAST.jesus }), faceBits(c)));
    const jKneelEl = pL.add(person(c, { ...CAST.jesus, pose: 'kneel' }));
    const jSit = S.puppet(jSitEl), jStand = S.puppet(jStandEl), jKneel = S.puppet(jKneelEl);
    const fxL = S.layer({ par: 0.5, sh: 5 });
    KIDS.forEach((k) => { k.crown = fxL.add(`<g opacity="0">${lightCrown(c)}</g>`); });
    const bangs = [0, 1].map(() => fxL.add(`<g opacity="0">${bang(c, C.terracotta, 1.2)}</g>`));
    const hearts = Array.from({ length: 5 }, () => fxL.add(`<g opacity="0">${heart(c, 11)}</g>`));
    const sparks = Array.from({ length: 4 }, () => fxL.add(`<g opacity="0">${spark(c, 9)}</g>`));

    const fg = S.layer({ par: 0.9, sh: 6 });
    fg.add(bush(c, 200, 990, 230, C.sage, C.moss) + rock(c, 1420, 990, 210, 70, C.rock2));

    // where the children go when they reach him (around him)
    const AT = [[JX - 110, GY + 14], [JX - 58, GY + 30], [JX + 76, GY + 30], [JX + 128, GY + 14], [JX - 168, GY + 24]];

    return (t, time) => {
      const T = time;
      R.update(t, T, { sunY: es(t, 0, 7) * 30 });

      /* disciples: step in the way (1), turn at his voice (2), step aside (3), Peter kneels at the door (5) */
      const block = es(t, 1.0, 1.3) * (1 - es(t, 3.0, 3.35));
      const turnBack = es(t, 2.05, 2.25);
      const aside = es(t, 3.05, 3.5);
      const pk = es(t, 5.35, 5.42);
      DIS.forEach((d) => {
        const bx = lerp(760 + d.i * 70, 850 + d.i * 44, es(t, 0.9, 1.2));
        const x = lerp(bx, 470 + d.i * 64 - (d.i > 1 ? 0 : 0), aside);
        const y = lerp(GY - 34 + (d.i % 2) * 12, GY - 60 + (d.i % 2) * 8, aside);
        const scold = block * (1 - turnBack);
        const moving = (t > 0.9 && t < 1.2) || (aside > 0 && aside < 1);
        d.p.set({ x, y, s: lerp(0.9, 0.78, aside), flip: turnBack > 0.5 ? aside > 0.5 && aside < 1 : scold > 0.3 ? false : false, walk: moving ? x * 0.06 : undefined, o: d.i === 0 ? 1 - pk : 1, armF: scold * (70 + Math.sin(T * 5 + d.i) * 10) + 8, armB: scold * (d.i % 2 ? 110 : 40), head: turnBack * -4 + scold * 4, lean: scold * 3, blink: blinkAt(T, d.seed) });
        face(d.el, 'angry', scold);
        face(d.el, 'sad', es(t, 2.1, 2.3) * (1 - es(t, 3.2, 3.5)));
      });
      const doorX = 990;
      const pgo = es(t, 5.05, 5.35);
      const px = lerp(470, doorX - 70, pgo);
      if (pgo > 0 && pgo < 1) DIS[0].p.set({ x: px, y: lerp(GY - 60, GY - 10, pgo), s: lerp(0.78, 0.86, pgo), walk: px * 0.06, blink: 0, o: 1 - pk });
      else if (pgo >= 1) DIS[0].p.set({ x: px, y: GY - 10, s: 0.86, o: 1 - pk });
      peterKneel.set({ x: doorX - 60, y: GY - 8, s: 0.86, o: pk * (1 - es(t, 6.2, 6.5)), armF: 50, head: 8, blink: blinkAt(T, 7) });

      /* parents & children arrive (0), are stopped (1), children run to him (3) */
      const come = es(t, -0.2, 0.75);
      PARENTS.forEach((m) => {
        const stepBack = es(t, 3.6, 4.1);
        const x = lerp(m.x + 480, m.x, come) + stepBack * 90;
        const release = 1 - es(t, 3.3, 3.6);
        const push = es(t, 0.4, 0.8) * (1 - block) * release;
        m.p.set({ x, y: m.y - stepBack * 16, s: m.s * (1 - stepBack * 0.06), flip: true, walk: (come > 0 && come < 1) || (stepBack > 0 && stepBack < 1) ? x * 0.05 + m.i : undefined, armF: 14 + push * 40 + block * 60 * release + stepBack * 30, armB: block * 50 * release + stepBack * 20, head: block * 6 - stepBack * 4, blink: blinkAt(T, m.seed) });
      });
      const [dx, dy] = [doorX, GY];
      KIDS.forEach((k) => {
        const run = es(t, 3.25 + k.i * 0.07, 3.75 + k.i * 0.07);
        const back = block * 20;
        let x = lerp(k.x0 + 480, k.x0 + back, come);
        let y = k.y0;
        x = lerp(x, AT[k.i][0], run); y = lerp(y, AT[k.i][1], run);
        // the first child walks in through the little door (verse 15), then comes back to him for the blessing
        const inDoor = k.i === 0 ? es(t, 5.1, 5.45) : 0;
        const outDoor = k.i === 0 ? es(t, 6.0, 6.3) : 0;
        if (k.i === 0) { x = lerp(x, dx, inDoor); y = lerp(y, dy - 4, inDoor); x = lerp(x, AT[0][0], outDoor); y = lerp(y, AT[0][1], outDoor); }
        const hug = es(t, 6.05, 6.4);
        const running = (come > 0 && come < 1) || (run > 0 && run < 1) || (inDoor > 0 && inDoor < 1) || (outDoor > 0 && outDoor < 1);
        const vanish = k.i === 0 ? es(t, 5.4, 5.5) * (1 - es(t, 5.95, 6.05)) : 0;
        k.p.set({ x, y, s: k.s, flip: run < 0.5 ? true : (k.i === 0 && inDoor > 0 && outDoor < 0.5) ? false : x > JX, walk: running ? x * 0.1 + k.i : undefined, bob: running ? Math.abs(Math.sin(x * 0.1)) * -6 : 0, o: 1 - vanish, armF: run * 60 * (1 - hug) + hug * 40 + block * 10, armB: run * 100 * (1 - hug) + hug * 60, head: -run * 8 - hug * 6 + block * 10, blink: blinkAt(T, k.seed) });
        face(k.el, 'sad', block * (1 - run));
        const [hx, hy] = headAt(x, y, k.s, x > JX);
        pose(k.crown, { x: hx, y: hy - 24, s: es(t, 4.1 + k.i * 0.06, 4.35 + k.i * 0.06, ease.back) * 0.9, o: t > 4.1 ? 1 - vanish : 0 });
        pose(hearts[k.i], { x: hx + (k.i - 2) * 6, y: hy - 50 - es(t, 6.3, 7) * 30, s: es(t, 6.3 + k.i * 0.05, 6.55 + k.i * 0.05, ease.back) * 0.9, o: t > 6.3 ? 1 : 0 });
      });

      /* Jesus: seated → stands, indignant → arms open → kneels to embrace and bless */
      const up = es(t, 2.05, 2.12), kneel = es(t, 5.95, 6.02);
      const angry = es(t, 2.1, 2.3) * (1 - es(t, 3.0, 3.2));
      const open = es(t, 3.0, 3.3) * (1 - kneel);
      jSit.set({ x: JX, y: GY, s: 1, o: 1 - up, armF: 30 + bump(t, 0.4, 1) * 40, armB: bump(t, 0.5, 1) * 30, head: -2 + Math.sin(T * 0.6), blink: blinkAt(T) });
      jStand.set({ x: JX, y: GY, s: 1.02, o: up * (1 - kneel), armF: angry * 80 + open * 100 + bump(t, 4.1, 4.9) * 20 + bump(t, 5.05, 5.9) * 70, armB: open * 130 + angry * 20, head: -angry * 6 + Math.sin(T * 0.6) * 1.2, lean: angry * 3, blink: blinkAt(T) });
      face(jStandEl, 'angry', angry);
      jKneel.set({ x: JX + 8, y: GY + 8, s: 1.02, o: kneel, armF: 80 + Math.sin(T * 0.8) * 4, armB: 150, head: 6, blink: blinkAt(T, 1) });
      bangs.forEach((b, i) => pose(b, { x: JX + 60 + i * 36, y: GY - 250 - i * 14, s: es(t, 2.12 + i * 0.08, 2.3 + i * 0.08, ease.back), r: 10 - i * 20, o: t > 2.1 && t < 3 ? 1 - es(t, 2.8, 3) : 0 }));
      pose(door, { x: doorX, y: GY + 2, s: es(t, 5.0, 5.3, ease.back), o: es(t, 5.0, 5.15) * (1 - es(t, 6.3, 6.6)) });
      pose(glow, { x: JX + 10, y: GY - 90, s: 0.5 + es(t, 6.05, 6.6) * 0.6, o: es(t, 6.05, 6.5) * 0.75 });
      sparks.forEach((sp, i) => {
        const k = T ? (T * 0.4 + i / 4) % 1 : 0.5;
        pose(sp, { x: JX - 120 + i * 80, y: GY - 150 - k * 120, s: 0.8, o: es(t, 6.2, 6.5) * Math.sin(k * Math.PI) });
      });

      S.cam.x = -20 + es(t, 4.8, 5.2) * 60 * (1 - es(t, 5.9, 6.3)) - es(t, 5.9, 6.3) * 30;
      S.cam.z = 1 + es(t, 1.9, 2.3) * 0.05 + es(t, 5.9, 6.4) * 0.08;
      S.cam.y = -es(t, 1.9, 2.3) * 10 + es(t, 5.9, 6.4) * 30;
    };
  },
};
