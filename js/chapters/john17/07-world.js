// J 17,14–16 — "I have given them Your word": a little scroll of light in His hand breaks into sparks that fly to
// every lantern, and each flame leaps up. "The world hated them, because they are not of the world, as I am not of
// the world": the night turns cold, ragged sheets of darkness creep in from both sides, a cold wind blows streaks
// across the slope and every little flame bends. "I do not ask You to take them out of the world": high above, a
// door of light shows in the dark — but it stays shut; He lowers His hands over them where they are. "But to keep
// them from the evil one": a dome of gold light comes down over the whole group; the darkness strikes it and draws
// back, and the flames stand straight again. "They are not of the world, as I am not of the world": a small star
// wakes above every one of them, and a larger one above Him.
import { es, ease, bump } from '../../core/anim.js';
import {
  slopeSet, eleven, jesusOn, put, lampK, headOf, chestOf, fatherLight, darkSheet, windStroke, skyDoor17, spark, scrollRolled,
  arcAt, hand, vis, kf, pose, fade, C, JX, JY, NIGHT, COLD, HOLY, PRAY, PI, lerp, mix,
} from './lib.js';

const RY = 150;
const DOOR = [800, 300];

export default {
  id: 'j17-world',
  beats: [
    { v: 14, text: 'Ja im przekazałem Twoje słowo,' },
    { v: 14, cont: true, text: 'a świat ich znienawidził za to, że nie są ze świata, jak i Ja nie jestem ze świata.' },
    { v: 15, text: 'Nie proszę, abyś ich zabrał ze świata,' },
    { v: 15, cont: true, text: 'ale byś ich ustrzegł od złego.' },
    { v: 16 },
  ],
  cam: { x: [-20, 20], y: [-70, 30], z: [0.96, 1.14] },
  build(S) {
    const c = S.c;
    const P = slopeSet(S, { skyCols: NIGHT });
    const hiL = S.layer({ par: 0.08, sh: 3 });
    const high = hiL.add(`<g>${fatherLight(c, 54)}</g>`);
    const doorL = S.layer({ par: 0.12, sh: 4 });
    const dm = skyDoor17(c, 88, 140);
    const doorBack = doorL.add(`<g>${dm.back}</g>`);
    const leaf = doorL.add(`<g>${dm.leaf}</g>`);

    // the dome of light (behind them: the far half is drawn on the dome layer before the people)
    const domeG = S.id('dome');
    S.defs(`<linearGradient id="${domeG}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3cf" stop-opacity=".42"/><stop offset="1" stop-color="#ffe7a8" stop-opacity=".08"/></linearGradient>`);
    const domeL = S.layer({ par: 0.36, sh: 0, flat: true });
    const dome = domeL.add(`<g><path d="${c.poly([...c.arc(0, 0, 470, 330, PI, 2 * PI, 40), [470, 30], [-470, 30]])}" fill="url(#${domeG})"/><path d="${c.ribbon(c.arc(0, 0, 470, 330, PI, 2 * PI, 40), 5)}" fill="${C.halo}" opacity=".85"/></g>`);

    const windL = S.layer({ par: 0.38, sh: 0, flat: true });
    const winds = Array.from({ length: 9 }, (_, i) => ({ i, y: 250 + (i % 5) * 80 + c.rr(-20, 20), dir: i % 2 ? -1 : 1, off: c.rr(0, 1), el: windL.add(`<g>${windStroke(c, c.rr(120, 200), '#c9cde6')}</g>`) }));
    const peopleL = S.layer({ par: 0.4, sh: 5 });
    const J = jesusOn(S, peopleL);
    const D = eleven(S, peopleL);
    const fx = S.layer({ par: 0.42, sh: 3 });
    const word = fx.add(`<g><circle r="34" fill="url(#halo-glow)"/><g transform="rotate(90)">${scrollRolled(c, 34)}</g></g>`);
    const sparks = D.map(() => fx.add(`<g>${spark(4)}</g>`));
    const starsE = D.map(() => fx.add(`<g><circle r="22" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 10, 4, 5))}" fill="${C.star}"/></g>`));
    const starJ = fx.add(`<g><circle r="40" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 0, 17, 7, 5))}" fill="${C.star}"/></g>`);

    // darkness from both sides, cold wind
    const darkLL = S.layer({ par: 0.45, sh: 6, pad: 700 });
    darkLL.add(`<g transform="translate(0 470)">${darkSheet(c, -1, { col: '#171a3a' })}</g>`);
    const darkRL = S.layer({ par: 0.45, sh: 6, pad: 700 });
    darkRL.add(`<g transform="translate(1600 470)">${darkSheet(c, 1, { col: '#171a3a' })}</g>`);

    const JHand = hand(JX, JY, 1.05, false, 60);
    return (t, time) => {
      const T = time;
      P.update(T);
      vis(high, { x: JX, y: RY, r: T * 1.5, o: 1 - es(t, 1.05, 1.4) * 0.5 + es(t, 3.05, 3.4) * 0.5 });

      /* v14a — Your word to them: the scroll breaks into sparks that light every lantern */
      const wk = es(t, 0.05, 0.3, ease.back) * (1 - es(t, 0.45, 0.55));
      vis(word, { x: JHand[0] + 6, y: JHand[1] - 10, s: wk, o: wk > 0.01 ? 1 : 0 });
      /* v14b — hatred: cold, darkness from the sides, wind */
      const cold = es(t, 1.05, 1.5) * (1 - es(t, 3.1, 3.6));
      const shield = es(t, 3.05, 3.4);
      if (cold > 0.001) P.sky.blend(NIGHT, COLD, cold);
      else P.sky.blend(NIGHT, HOLY, es(t, 3.4, 4.5) * 0.5);
      const push = es(t, 1.05, 1.6) * (1 - shield * 0.45) - bump(t, 3.3, 3.7) * 0.12 - es(t, 4.05, 4.6) * 0.5;
      darkLL.shift(-320 + push * 560, 0);
      darkRL.shift(320 - push * 560, 0);
      darkLL.fade(push > 0.01 ? 0.95 : 0);
      darkRL.fade(push > 0.01 ? 0.95 : 0);
      const wind = cold * (1 - shield * 0.6);
      winds.forEach((w) => {
        const u = ((T ? T * 0.35 : 0) + w.off + t * 0.2) % 1;
        const x = w.dir > 0 ? lerp(180, 1400, u) : lerp(1420, 200, u);
        vis(w.el, { x, y: w.y + Math.sin(u * 6) * 8, sx: w.dir, s: 0.9, o: wind * Math.sin(u * PI) });
      });
      const bend = wind * 24 * (T ? 1 + Math.sin(T * 5) * 0.25 : 1);
      D.forEach((m, i) => {
        const d = Math.abs(m.x - JX) / 400;
        const u = es(t, 0.45 + d * 0.3, 0.8 + d * 0.3);
        const [x, y] = arcAt([JHand[0] + 6, JHand[1] - 10], [m.lx, m.ly - 20], -90, u);
        vis(sparks[i], { x, y, o: u > 0.01 && u < 0.98 ? 1 : 0 });
        const lit = 0.45 + es(t, 0.75 + d * 0.3, 0.9 + d * 0.3) * 0.55;
        const leap = bump(t, 0.75 + d * 0.3, 1.2 + d * 0.3);
        lampK(m, lit, leap * 0.8 - wind * 0.2, (m.x < JX ? 1 : -1) * bend);
        const [hx, hy] = headOf(m);
        const sk = es(t, 4.1 + d * 0.3, 4.4 + d * 0.3, ease.back);
        vis(starsE[i], { x: hx, y: hy - 34 * m.s + (T ? Math.sin(T * 1.5 + i) * 2 : 0), r: T * 10, s: sk, o: sk > 0.01 ? 1 : 0 });
        fade(m.sad, cold * 0.9);
        put(m, T, { head: -6 + cold * 16 - bump(t, 2.05, 3.0) * 20 - es(t, 4.1, 4.5) * 8, armF: 14 + cold * 26, armB: 6 + cold * 30 });
      });

      /* v15a — not taken out: the door above stays shut */
      const dk = es(t, 2.05, 2.4) * (1 - es(t, 3.0, 3.3));
      vis(doorBack, { x: DOOR[0], y: DOOR[1], s: 0.8 + dk * 0.2, o: dk * 0.9 });
      vis(leaf, { x: DOOR[0] - 44 * (0.8 + dk * 0.2), y: DOOR[1], s: 0.8 + dk * 0.2, sx: (0.8 + dk * 0.2) * (1 - bump(t, 2.3, 2.7) * 0.1), o: dk });

      /* v15b — kept from the evil one: the dome */
      vis(dome, { x: JX, y: 676 - (1 - es(t, 3.05, 3.4, ease.out)) * 500, sy: 0.4 + es(t, 3.05, 3.45) * 0.6, o: shield * (1 - es(t, 4.4, 4.9) * 0.4) });

      /* v16 — not of the world */
      const sj = es(t, 4.05, 4.35, ease.back);
      vis(starJ, { x: JX + 2, y: JY - 236 + (T ? Math.sin(T * 1.2) * 2 : 0), r: -T * 8, s: sj, o: sj > 0.01 ? 1 : 0 });

      const bless = bump(t, 2.1, 3.0);
      put(J, T, {
        head: PRAY.head + bless * 26 + bump(t, 0.05, 0.6) * 20,
        armF: 60 + bump(t, 0.05, 0.6) * 0 + bless * 10 + es(t, 3.05, 3.4) * 20,
        armB: PRAY.armB - bless * 40 + es(t, 3.05, 3.4) * 30,
      });
      fade(J.sad, bump(t, 1.2, 2.0) * 0.6);

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 10], [1, 0], [2, 0], [2.4, -40], [3, -30], [3.5, 0], [4, -10], [5, -10]]);
      S.cam.z = kf(t, [[0, 1.1], [1, 1.02], [2, 0.98], [3, 1.0], [4, 1.0], [5, 1.06]]);
    };
  },
};
