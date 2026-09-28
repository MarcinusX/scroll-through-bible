// Mt 2,19b–20 — night in Egypt. Joseph sleeps on his mat before the little house; Mary and the Child sleep inside
// behind the lit window. The angel of the Lord stands by him again, and the dream shows the green hills of Israel.
// "Those who sought the Child's life are dead": the dark crowned shape that hung over them falls away in pieces,
// and the sky begins to turn to dawn.
import { C, person, blinkAt, pose, lerp, hanging, sky, sheet, shade, mix } from '../kit.js';
import { olive, cypress } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import {
  LOOK, GY, DAWN, egyptSet, sleeper, angel, dreamCloud, silhouette, crown, addToHead, placeTag, glory, hangAt, vpose,
  sparkle, INK, tr, PI,
} from './lib.js';

const JX = 780;

export default {
  id: 'mt2-call',
  beats: [
    { v: 19, cont: true, text: 'oto Józefowi w Egipcie ukazał się anioł Pański we śnie,' },
    { v: 20, text: 'i rzekł: «Wstań, weź Dziecię i Jego Matkę i idź do ziemi Izraela,' },
    { v: 20, cont: true, text: 'bo już umarli ci, którzy czyhali na życie Dziecięcia».' },
  ],
  cam: { x: [-40, 60], y: [0, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const set = egyptSet(S, { night: true, houseX: 330 });
    const dawn = sky(S, DAWN, { name: 'dawn' });
    // keep the dawn sky just behind the stars
    set.sk.layer.el.after(dawn.layer.el);

    const glowL = S.layer({ par: 0.45, sh: 0, flat: true });
    const glow = glowL.add(`<g><circle r="320" fill="url(#halo-glow)"/></g>`);
    const P = S.layer({ par: 0.45, sh: 5 });
    const joseph = P.add(`<g>${sleeper(c, LOOK.joseph, { w: 220, s: 0.8 })}</g>`);
    const ang = S.puppet(P.add(angel(c, { hair: C.wheat2, skin: C.skin })));

    const X = S.layer({ par: 0.35, sh: 5 });
    const israel = `<path d="${c.ridge(c.wave(10, [10, 4], [120, 50]), -160, 160, 80, 8, 0.6)}" fill="${C.hillMid}"/><path d="${c.ridge(c.wave(40, [6, 2], [100, 40]), -160, 160, 80, 8, 0.6)}" fill="${C.hillNear}"/>${olive(c, -80, 44, 0.45)}${olive(c, 70, 40, 0.4)}${cypress(c, 110, 40, 60)}<path d="${c.ribbon([[-40, 80], [-10, 50], [30, 30]], (u) => 16 - u * 12)}" fill="${C.sand}"/>`;
    const dream = X.add(`<g>${dreamCloud(c, israel, { w: 360, h: 220, dx: 170, dy: -170 })}</g>`);
    const tagI = hanging(X, placeTag(c, tr('do ziemi Izraela', 'into the land of Israel'), 19), { x: 0, y: 0, len: 600 });
    const tagE = hanging(X, placeTag(c, tr('w Egipcie', 'in Egypt'), 18), { x: 0, y: 0, len: 600 });
    const sil = silhouette(LOOK.herod, INK);
    const shadowM = addToHead(person(c, sil), crown(c, INK)).split(`fill="${C.blush}"`).join(`fill="${INK}"`);
    const pieces = [0, 1, 2, 3].map((i) => {
      const id = S.id('cut' + i);
      const y0 = -230 + i * 60;
      return { i, el: X.add(`<g><clipPath id="${id}"><rect x="-80" y="${y0}" width="160" height="60"/></clipPath><g clip-path="url(#${id})" opacity=".8">${shadowM}</g></g>`) };
    });
    const sparks = [0, 1, 2, 3].map(() => X.add(`<g>${sparkle(c, 10)}</g>`));

    return (t, time) => {
      const T = time;
      pose(joseph, { x: JX, y: GY + 10 });
      /* v19b — the angel appears to Joseph in Egypt */
      const ak = es(t, 0.15, 0.6);
      vpose(glow, { x: 600, y: 480, s: 0.4 + ak * 0.6, o: ak * 0.9 });
      const point = es(t, 1.05, 1.3);
      ang.set({ x: 600, y: GY - 24 - ak * 16 + Math.sin(T * 1.3) * 3, s: 1.02, o: ak, armF: 30 + point * 90 - es(t, 2.0, 2.2) * 40, armB: 20 + es(t, 2.05, 2.3) * 120, head: 6 - point * 8, blink: blinkAt(T, 3) });
      const ek = es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.0, 1.15, ease.in));
      hangAt(tagE, 330, lerp(-500, 300, ek), T, ek > 0.001 ? 1 : 0, 1.2, 0.9, 1);
      sparks.forEach((sp, i) => {
        const k = es(t, 0.4 + i * 0.05, 0.7 + i * 0.05), a = T * 0.6 + i * 1.6;
        vpose(sp, { x: 600 + Math.cos(a) * 110, y: 470 + Math.sin(a) * 140, s: k * 0.8, r: T * 30, o: k });
      });

      /* v20a — go into the land of Israel */
      const dk = es(t, 1.05, 1.3, ease.back);
      vpose(dream, { x: JX - 40, y: GY - 70, s: dk, o: dk > 0.01 ? 1 : 0 });
      const ik = es(t, 1.25, 1.5, ease.out);
      hangAt(tagI, 880, lerp(-500, 230, ik), T, ik > 0.001 ? 1 : 0, 1.2, 0.9, 2);

      /* v20b — those who sought His life are dead: the dark shape breaks and falls; dawn */
      const inK = es(t, 1.6, 1.9, ease.out);
      const fall = es(t, 2.2, 2.7, ease.in);
      pieces.forEach((p) => {
        const d = fall * (1 + p.i * 0.35);
        vpose(p.el, { x: 1170 + (p.i % 2 ? 1 : -1) * d * 40, y: lerp(-300, 520, inK) + d * 420, r: (p.i % 2 ? 1 : -1) * d * 30, s: 0.9, o: inK * (1 - fall) });
      });
      const day = es(t, 2.3, 2.9);
      dawn.layer.fade(day);
      set.hangL.fade(1 - day * 0.8);

      S.cam.x = lerp(-10, 30, es(t, 1.0, 1.4));
      S.cam.y = 30;
      S.cam.z = 1.04;
    };
  },
};
