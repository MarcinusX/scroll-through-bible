// J 18,7–9 — the fallen band picks itself up, torches lifted again. He asks a second time: "Whom are you looking
// for?" — a smaller, shakier "Jesus of Nazareth". "I told you that I AM" (the gold words once more, quieter). "If you
// seek Me, let these go their way": He stretches His arm back over the Eleven like a shelter and a pale golden way
// opens behind them, out into the dark olive grove. "That the word might be fulfilled which He spoke": a scroll hangs
// down, its lines glowing. "Of those whom You have given Me, I have lost none": one by one golden threads run from
// Him to each of the eleven little lanterns, and every flame stands up bright — not one missing.
import { seg, es, ease, bump } from '../../core/anim.js';
import { arcThreads } from '../john16/lib.js';
import {
  nightSet, gardenTrees, BAND, DIS, ARREST, eleven, lamp, makeBand, bandPose, iAm, say, nameTag, scrollOpen, radiance, hanging, vis, kf, headAt, hand,
  withFace, faceBits, person, pose, fade, lerp, tr, blinkAt, C, TW, PI, nt,
} from './lib.js';

const { GY, JX, JDX } = ARREST;

export default {
  id: 'j18-letgo',
  beats: [
    { v: 7, text: 'Powtórnie ich zapytał: «Kogo szukacie?»' },
    { v: 7, cont: true, text: 'Oni zaś powiedzieli: «Jezusa z Nazaretu».' },
    { v: 8, text: 'Jezus odrzekł: «Powiedziałem wam, że Ja jestem.' },
    { v: 8, cont: true, text: 'Jeżeli więc Mnie szukacie, pozwólcie tym odejść!»' },
    { v: 9, text: 'Stało się tak, aby się wypełniło słowo, które wypowiedział:' },
    { v: 9, cont: true, text: '«Nie utraciłem żadnego z tych, których Mi dałeś».' },
  ],
  cam: { x: [-80, 120], y: [-60, 60], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { zigzag: true, cityX: 520, moonAt: [1250, 130] });
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const aura = glowL.add(`<g><circle r="240" fill="url(#halo-glow)"/>${radiance(c, 110)}</g>`);
    const pool = glowL.add(`<g><ellipse cx="0" cy="-110" rx="380" ry="260" fill="url(#warm-glow)" opacity=".5"/></g>`);
    // the way out for the Eleven: a pale golden path into the grove
    const wayL = S.layer({ par: 0.5, sh: 0, flat: true });
    const dome = wayL.add(`<g><ellipse cx="0" cy="-60" rx="330" ry="200" fill="url(#halo-glow)" opacity=".55"/><path d="${c.ribbon(c.arc(0, 0, 340, 250, PI * 1.02, PI * 1.98, 30), (u) => 2 + Math.sin(u * PI) * 5)}" fill="${C.halo}" opacity=".85"/></g>`);

    const bandL = S.layer({ par: 0.5, sh: 5 });
    const flameL = S.layer({ par: 0.5, sh: 0, flat: true });
    const band = makeBand(S, bandL, flameL, BAND);
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const judas = S.puppet(peopleL.add(withFace(person(c, TW.judas), faceBits(c))));
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: DIS });
    const threadL = S.layer({ par: 0.5, sh: 0, flat: true });
    const threads = arcThreads(threadL, D.length, { color: C.haloRim, w: 2 });

    const fx = S.layer({ par: 0.56, sh: 4 });
    const who = fx.add(`<g>${say(c, tr('Kogo szukacie?', 'Who are you looking for?'), { size: 21, side: -1 })}</g>`);
    const ans = fx.add(`<g>${say(c, tr('Jezusa z Nazaretu…', 'Jesus of Nazareth…'), { size: 17, side: 1, fill: nt(C.stone2, 0.25) })}</g>`);
    const am = hanging(fx, iAm(c, tr('JA JESTEM', 'I AM'), { size: 28 }), { x: JX, y: 250, len: 700 });
    const go = fx.add(`<g>${say(c, tr('Pozwólcie im odejść!', 'Let these go their way!'), { size: 19, side: 1 })}</g>`);
    const scroll = hanging(fx, `<g transform="scale(1.3)"><circle r="80" fill="url(#halo-glow)"/>${scrollOpen(c, 120, 64)}</g>`, { x: JX, y: 250, len: 700 });
    const flames11 = Array.from({ length: 11 }, (_, i) => `<g transform="translate(${-100 + i * 20} 78)"><circle cy="-6" r="12" fill="url(#warm-glow)"/><path d="M0 0C-5 -3 -5 -9 0 -16C5 -9 5 -3 0 0Z" fill="${C.lampFlame}"/></g>`).join('');
    const none = hanging(fx, `${nameTag(c, tr('«Nie utraciłem żadnego»', '“I have lost none”'), { size: 19, w: 250 })}${flames11}`, { x: 0, y: 0, len: 700 });

    return (t, time) => {
      const T = time;
      N.update(T);

      /* v7 — they get up; again the question and the answer */
      const up = es(t, 0.0, 0.5, ease.out);
      const lower = es(t, 3.1, 3.5) * (1 - es(t, 5.2, 5.6) * 0.5);
      band.forEach((m) => {
        const r = -(62 + (m.i % 3) * 7) * (1 - es(t, 0.02 + m.i * 0.02, 0.45 + m.i * 0.02, ease.out));
        bandPose(m, { x: m.x - 40 - (1 - up) * 26, y: GY + m.y, s: m.s ?? 1, r, o: 1, head: lower * 10, lean: -bump(t, 1.1, 1.8) * 3 - lower * 2, flameK: 0.45 + up * 0.55 }, T);
      });
      vis(pool, { x: 470, y: GY, o: 0.6 + up * 0.4 });
      const jr = -70 * (1 - es(t, 0.1, 0.55, ease.out));
      judas.set({ x: JDX - 20 * (1 - up), y: GY + 10, s: 1.0, r: jr, flip: false, armF: 18, armB: 8, head: 12, blink: blinkAt(T, 2) });

      /* Jesus */
      const speak = es(t, 0.1, 0.3) * (1 - es(t, 0.9, 1.05)) + es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05));
      const shelter = es(t, 3.05, 3.4) * (1 - es(t, 5.9, 6.0) * 0);
      J.p.set({ x: JX + 10, y: GY + 6, s: 1.04, flip: true, armF: 20 + speak * 40 + bump(t, 2.1, 2.9) * 30, armB: 10 - shelter * 92, head: -speak * 3 - es(t, 4.05, 4.4) * 6 * (1 - es(t, 5.05, 5.3)), blink: blinkAt(T) });
      fade(J.sad, 0);
      const lit = 0.35 + es(t, 2.05, 2.3) * 0.4 * (1 - es(t, 2.9, 3.2)) + es(t, 5.1, 5.5) * 0.35;
      vis(aura, { x: JX + 10, y: GY - 120, s: 0.4 + lit * 0.6, r: T ? T * 2 : 0, o: lit });

      /* the Eleven: sheltered; the way opens; each lantern tied to Him */
      const fear = 1 - es(t, 3.1, 3.6) * 0.7;
      D.forEach((m) => {
        const k = es(t, 5.05 + m.i * 0.05, 5.2 + m.i * 0.05);
        m.p.set({ x: m.x + 16 + es(t, 3.3, 3.8) * 10, y: m.y, s: m.s, flip: true, armF: m.arm, armB: 8 + fear * 20, head: -fear * 5 + k * 2, blink: blinkAt(T, m.seed) });
        fade(m.sad, fear * 0.8);
        lamp(m, 0.85 + k * 0.15, 0, T);
        const [lx, ly] = hand(m.x + 16 + es(t, 3.3, 3.8) * 10, m.y, m.s, true, m.arm);
        threads(m.i, JX + 10 - 10, GY - 150, lx, ly + 30, 60 + m.i * 6, k * (1 - es(t, 5.9, 6.0) * 0) * 0.9);
      });
      const dk = es(t, 3.2, 3.6, ease.out) * (1 - es(t, 4.9, 5.2) * 0.7);
      vis(dome, { x: 1110, y: GY + 20, sx: 0.6 + dk * 0.4, sy: dk, o: dk });

      /* words */
      const [hx, hy] = headAt(JX + 10, GY + 6, 1.04, true);
      const w1 = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 0.9, 1.0));
      vis(who, { x: hx - 16, y: hy - 22, s: w1, o: w1 > 0.01 ? 1 : 0 });
      const [bx, by] = headAt(BAND[1].x - 40, GY + BAND[1].y, 1, false);
      const a1 = es(t, 1.15, 1.35, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(ans, { x: bx + 14, y: by - 20, s: a1, o: a1 > 0.01 ? 1 : 0, r: T ? Math.sin(T * 14) * 1.2 * a1 : 0 });
      const amK = es(t, 2.1, 2.4, ease.out) * (1 - es(t, 2.9, 3.1, ease.in));
      vis(am, { x: JX, y: 236 - (1 - amK) * 700, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: amK > 0.01 ? 1 : 0 });
      const g1 = es(t, 3.15, 3.35, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(go, { x: hx + 16, y: hy - 22, s: g1, o: g1 > 0.01 ? 1 : 0 });
      const sk = es(t, 4.1, 4.4, ease.out) * (1 - es(t, 4.95, 5.15, ease.in));
      vis(scroll, { x: JX, y: 250 - (1 - sk) * 700, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: sk > 0.01 ? 1 : 0 });
      const nk = es(t, 5.4, 5.7, ease.out);
      vis(none, { x: S.portrait ? 1000 : 1040, y: 290 - (1 - nk) * 700, r: T ? Math.sin(T * 0.8 + 1) * 1.2 : 0, o: nk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -40], [1, -40], [2, 0], [3, 0], [3.3, 60], [4, 40], [5, 40], [5.3, 90], [6, 100]]);
      S.cam.y = kf(t, [[0, 10], [2, 0], [4, -20], [5, -10], [6, 0]]);
      S.cam.z = kf(t, [[0, 1.06], [1, 1.1], [2, 1.04], [3, 1.08], [4, 1.1], [5, 1.08], [6, 1.14]]);
    };
  },
};
