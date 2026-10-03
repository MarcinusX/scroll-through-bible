// Łk 8,45–48 — Jesus stops and turns round: "Who touched me?" Everyone around shakes their head — "Not I!" — and
// Peter spreads his hands: "Master, the crowds surround you and press on you!" "Someone touched me; I felt power go
// out from me": a thread of light runs from the tassel of His cloak to the woman hidden behind Him. She sees she
// cannot hide; trembling she comes forward, falls down before Him and tells it in front of everyone — a speech bubble
// with her story in three pictures: the empty purse, the tassel, a heart made whole. "Daughter, your faith has made
// you well; go in peace." She stands up in warm colours and goes her way in the light.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { fringeStreet, ST, bubble, purse, heart, spark, sparkle, headAt, hand, tr, PI } from './lib.js';

const FEET = ST.FEET, JX = ST.JX;

function tellBubble(c) {
  const s = sheet();
  s.p(c.cut(c.blob(96, -62, 124, 44, 20, 0.04), 0.5, 6), C.cream);
  s.p(c.cut([[10, -34], [0, 0], [34, -30]], 0.3, 4), C.cream);
  const arrow = (x) => `<path d="${c.cut([[x - 9, -64], [x + 3, -64], [x + 3, -70], [x + 11, -61], [x + 3, -52], [x + 3, -58], [x - 9, -58]], 0.2, 3)}" fill="${C.terracotta}"/>`;
  const tassel = sheet().p(c.ribbon([[0, -18], [0, -4]], 3), C.dustyBlue).p(c.cut([[-6, -4], [6, -4], [8, 14], [-8, 14]], 0.3, 3), C.dustyBlue).out();
  const handI = sheet().p(c.cut(c.circ(-14, 2, 6.5, 10), 0.2, 3), C.skin2).out();
  return s.out() + `<g transform="translate(18 -76)">${purse(c, 0)}</g>` + arrow(52) + `<g transform="translate(96 -66)">${tassel}${handI}</g>` + arrow(132) + `<g transform="translate(176 -62)">${heart(c, 14)}</g>`;
}

export default {
  id: 'lk8-who',
  beats: [
    { v: 45, text: 'Lecz Jezus zapytał: «Kto się Mnie dotknął?»' },
    { v: 45, cont: true, text: 'Gdy wszyscy się wypierali, Piotr powiedział: «Mistrzu, to tłumy zewsząd Cię otaczają i ściskają».' },
    { v: 46 },
    { v: 47, text: 'Wtedy kobieta, widząc, że się nie ukryje, zbliżyła się drżąca' },
    { v: 47, cont: true, text: 'i upadłszy przed Nim opowiedziała wobec całego ludu, dlaczego się Go dotknęła i jak natychmiast została uleczona.' },
    { v: 48 },
  ],
  cam: { x: [-80, 40], y: [-20, 60], z: [1, 1.16] },
  build(S) {
    const St = fringeStreet(S);
    const c = St.c;
    const P = St.P;
    const peaceGlow = St.backL.add(`<g opacity="0"><circle r="130" fill="url(#halo-glow)"/></g>`);
    const fx = S.layer({ par: 0.5, sh: 6 });
    const who = fx.add(`<g opacity="0">${bubble(c, tr('Kto się Mnie dotknął?', 'Who touched me?'), { size: 22, dir: 1 })}</g>`);
    const nots = (S.portrait ? [[545, 565], [650, 495], [1010, 575]] : [[360, 540], [520, 500], [1250, 560]])   // phone: the denials inside the screen
     .map(([x, y], i) => ({ i, x, y, el: fx.add(`<g opacity="0">${bubble(c, tr('Nie ja!', 'Not I!'), { size: 17, dir: x > 800 ? -1 : 1 })}</g>`) }));
    const pet = fx.add(`<g opacity="0">${bubble(c, [tr('Mistrzu, to tłumy zewsząd', 'Master, the multitudes'), tr('Cię otaczają i ściskają!', 'press and jostle you!')], { size: 18, dir: -1 })}</g>`);
    const power = fx.add(`<g opacity="0">${bubble(c, [tr('Ktoś się Mnie dotknął,', 'Someone did touch me,'), tr('bo poznałem, że moc', 'for I perceived that power'), tr('wyszła ode Mnie', 'has gone out of me')], { size: 18, dir: 1, fill: C.halo })}</g>`);
    const thread = fx.add(`<g opacity="0"><path d="${c.ribbon(c.qbez([0, 0], [-40, -60], [-80, -40], 12), (u) => 3 - u * 1.4)}" fill="${C.sun}"/><circle cx="-80" cy="-40" r="30" fill="url(#warm-glow)"/></g>`);
    const tell = fx.add(`<g opacity="0">${tellBubble(c)}</g>`);
    const peace = fx.add(`<g opacity="0">${bubble(c, [tr('Córko, twoja wiara cię ocaliła,', 'Daughter, your faith'), tr('idź w pokoju!', 'has made you well. Go in peace.')], { size: 18, dir: 1, fill: C.halo })}</g>`);
    const sparks = [0, 1, 2, 3].map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));

    return (t, time) => {
      const T = time;
      St.set.update(t, T);
      const press = es(t, 1.1, 1.5);
      St.backs.forEach((b) => b.sp.set({ x: b.x + (b.x < JX ? 1 : -1) * press * 20, y: b.y }));
      St.fronts.forEach((b) => b.sp.set({ x: b.x + (b.x < JX ? 1 : -1) * press * 36 + (T ? Math.sin(T * 5 + b.i) * 2 * press : 0), y: b.y }));
      /* v45a — "Who touched me?" */
      const turn = es(t, 0.05, 0.15);
      const bless = es(t, 5.05, 5.3);
      P.jesus.set({ x: JX, y: FEET, s: 1.04, flip: turn > 0.5, armF: 14 + bump(t, 0.2, 0.9) * 40 + es(t, 2.1, 2.3) * 30 * (1 - es(t, 2.9, 3.1)) + bless * 60, armB: 8 + bless * 20, head: 6 * es(t, 3.1, 3.3), blink: blinkAt(T) });
      const [jhx, jhy] = headAt(JX, FEET, 1.04, true);
      const wb = es(t, 0.12, 0.28, ease.back) * (1 - es(t, 0.92, 1.0));
      pose(who, { x: jhx - 20, y: jhy - 36, s: wb, o: wb > 0.02 ? 1 : 0 });
      P.jair.set({ x: JX + 250, y: FEET - 8, s: 0.98, flip: true, armF: 20 + es(t, 4.1, 4.4) * 20, armB: 10, head: 4, blink: blinkAt(T, 4) });
      P.john.set({ x: JX + 60, y: FEET + 16, s: 1, flip: true, armF: 16 + bump(t, 1.05, 1.9) * 30, blink: blinkAt(T, 6) });
      /* v45b — all deny it; Peter: the crowds press on you */
      nots.forEach((n) => { const k = es(t, 1.05 + n.i * 0.06, 1.2 + n.i * 0.06, ease.back) * (1 - es(t, 1.92, 2.0)); pose(n.el, { x: n.x, y: n.y, s: k, o: k > 0.02 ? 1 : 0 }); });
      const pk = es(t, 1.35, 1.5);
      P.peter.set({ x: JX + 110, y: FEET - 14, s: 0.96, flip: true, armF: 14 + pk * 70, armB: 10 + pk * 80, head: -4, blink: blinkAt(T, 2) });
      const [phx, phy] = headAt(JX + 110, FEET - 14, 0.96, true);
      const pb = es(t, 1.55, 1.7, ease.back) * (1 - es(t, 1.95, 2.02));
      pose(pet, { x: phx + (S.portrait ? -90 : 10),   // phone: clear of the progress thread
        y: phy - 30, s: pb, o: pb > 0.02 ? 1 : 0 });
      /* v46 — power has gone out of me */
      const pwb = es(t, 2.1, 2.25, ease.back) * (1 - es(t, 2.92, 3.0));
      pose(power, { x: jhx - 30, y: jhy - 36, s: pwb, o: pwb > 0.02 ? 1 : 0 });
      const th = es(t, 2.2, 2.45) * (1 - es(t, 3.2, 3.4));
      pose(thread, { x: JX - 16, y: FEET - 50, sx: th, sy: th, o: th });

      /* v47a — seeing she could not hide, she comes trembling */
      const standUp = es(t, 3.05, 3.12);
      const kneelAgain = es(t, 4.05, 4.12);
      const go = es(t, 5.4, 5.95);
      const shake = T ? Math.sin(T * 26) * 2.5 * es(t, 3.1, 3.2) * (1 - kneelAgain) : 0;
      const wx = lerp(JX - 112, JX - 96, es(t, 3.1, 3.6));
      P.wWell.set({ x: wx + shake - go * 110, y: FEET + 12, s: 0.96, o: standUp * (1 - kneelAgain) + es(t, 5.2, 5.27), flip: go > 0.02, walk: go > 0 && go < 1 ? go * 30 : undefined, armF: 30 + (go > 0 ? 10 : 30), armB: 20 + (go > 0 ? 0 : 30), head: 8 - go * 12, blink: blinkAt(T, 5) });
      /* v47b — she falls down before Him and tells it before all the people */
      P.wKneel.set({ o: 0 });
      P.wWalk.set({ o: 0 });
      const k2 = kneelAgain * (1 - es(t, 5.2, 5.27));
      St.P.wKneelWell.set({ x: lerp(JX - 112, JX - 100, kneelAgain), y: FEET + 12, s: 0.96, o: Math.max(1 - standUp, k2), armF: 56 + k2 * 30, armB: 60 + k2 * 20, lean: 6 + k2 * 6, head: -6 - k2 * 4, blink: blinkAt(T, 5) });
      const [wkx, wky] = headAt(JX - 100, FEET + 12, 0.96, false, 46);
      const tb = es(t, 4.15, 4.35, ease.back) * (1 - es(t, 4.93, 5.0));
      pose(tell, { x: wkx - 150, y: wky - 30, s: tb, o: tb > 0.02 ? 1 : 0 });
      /* v48 — "Daughter, your faith has made you well; go in peace" */
      const pb2 = es(t, 5.08, 5.25, ease.back);
      pose(peace, { x: jhx - 10, y: jhy - 40, s: pb2, o: pb2 > 0.02 ? 1 : 0 });
      pose(peaceGlow, { x: wx - go * 110, y: FEET - 100, s: 0.8, o: es(t, 5.2, 5.5) * 0.8 });
      sparks.forEach((s, i) => { const k = bump(t, 5.3 + i * 0.05, 5.95); pose(s, { x: wx - go * 110 - 40 + i * 26, y: FEET - 230 - (i % 2) * 20, s: k, r: T * 40, o: k }); });

      S.cam.x = -30 + es(t, 0.9, 1.3) * 30 - es(t, 2.9, 3.3) * 40 - es(t, 5.3, 5.9) * 20;
      S.cam.z = 1.1 - es(t, 0.9, 1.3) * 0.06 + es(t, 2.9, 3.3) * 0.06;
      S.cam.y = 40 - es(t, 0.9, 1.3) * 20 + es(t, 2.9, 3.3) * 20;
    };
  },
};
