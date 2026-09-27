// J 8,9–11 — they heard, and one by one, beginning with the eldest, each lets his stone fall — a soft thud, a
// little puff of dust — turns and goes out; the people go too. Only Jesus is left, and the woman standing in the
// middle, among the dropped stones. He straightens: "Woman, where are they?" — the court is empty. "No one, Lord."
// "Neither do I condemn you" — light comes over her and her dark veil turns to morning colours. "Go, and from now
// on sin no more" — she lifts her head and walks out into the sunlight, free.
import { C, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { trialSet, CT, voiceRings, bubble, question, writeMarks, glory, kf, vis, tr, PI } from './lib.js';

export default {
  id: 'j8-alone',
  beats: [
    { v: 9, text: 'Kiedy to usłyszeli, wszyscy jeden po drugim zaczęli odchodzić, poczynając od starszych, aż do ostatnich.' },
    { v: 9, cont: true, text: 'Pozostał tylko Jezus i kobieta, stojąca na środku.' },
    { v: 10 },
    { v: 11, text: 'A ona odrzekła: «Nikt, Panie!»' },
    { v: 11, cont: true, text: 'Rzekł do niej Jezus: «I Ja ciebie nie potępiam.' },
    { v: 11, cont: true, text: '- Idź, a od tej chwili już nie grzesz!».' },
  ],
  cam: { x: [-40, 160], y: [-60, 150], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const set = trialSet(S);
    const K = set.cast;
    const pool = set.glowL.add(`<g><ellipse rx="260" ry="80" fill="url(#warm-glow)"/></g>`);
    const grace = set.glowL.add(`<g>${glory(c, 250, 18)}</g>`);
    const path = set.glowL.add(`<g><path d="M0 0C160 -6 320 -14 520 -30L520 -6C320 8 160 14 0 14Z" fill="#fff3cf" opacity=".6"/></g>`);
    const q = set.fx.add(`<g>${question(c)}</g>`);
    const saysW = set.fx.add(`<g>${bubble(c, tr('Nikt, Panie!', 'No one, Lord.'), { size: 22, tail: -1 })}</g>`);
    const rings = voiceRings(set.fx, c, { n: 3, r: 34, w: 5, both: false, color: shade(C.halo, -0.05) });
    const thuds = K.acc.map(() => set.fx.add(`<g><path d="${c.ribbon(c.arc(0, 0, 22, 8, PI * 1.1, PI * 1.9, 8), 2.2)}" fill="${C.inkSoft}" opacity=".5"/></g>`));
    const ORDER = [0, 1, 4, 2, 3, 5];          // eldest first … to the last

    return (t, time) => {
      const T = time;
      set.update(t, T);
      /* v9a — one by one, from the eldest: the stone falls, he turns and goes */
      K.acc.forEach((a) => {
        const n = ORDER.indexOf(a.i);
        const t0 = 0.06 + n * 0.14;
        const drop = seg(t, t0, t0 + 0.08);
        const go = es(t, t0 + 0.07, t0 + 0.42, ease.in);
        const x = a.x + go * 520;
        K.accuser(a, T, {
          x, flip: go < 0.02, walk: go > 0 && go < 1 ? x * 0.05 : undefined, o: 1 - seg(t, t0 + 0.36, t0 + 0.42),
          armF: drop > 0 ? 18 : 30, armB: 10, head: 16 * (1 - go) + (go > 0 ? -2 : 0), lean: 3 * (1 - go), angry: 0.15 * (1 - go), drop, grip: 1,
        });
        const land = bump(t, t0 + 0.07, t0 + 0.2);
        vis(K.puffs[a.i], { x: a.gx, y: a.gy + 4, s: 0.6 + seg(t, t0 + 0.07, t0 + 0.2) * 0.8, o: land * 0.9 });
        vis(thuds[a.i], { x: a.gx, y: a.gy - 2, s: 0.6 + seg(t, t0 + 0.07, t0 + 0.16) * 0.9, o: bump(t, t0 + 0.07, t0 + 0.16) });
      });
      /* the people go too */
      K.crowd.forEach((m) => {
        const k = es(t, 0.7 + m.i * 0.03, 1.1 + m.i * 0.03, ease.in);
        if (m.ri === 0) m.p.set({ x: m.x - k * 420, y: m.y, s: m.s, flip: k > 0.02, walk: k > 0 && k < 1 ? m.x * 0.05 + k * 30 : undefined, o: 1 - seg(t, 1.0 + m.i * 0.03, 1.1 + m.i * 0.03), blink: blinkAt(T, m.seed) });
        else m.p.set({ x: m.x, y: m.y + k * 40, s: m.s, o: 1 - k, head: 6, blink: blinkAt(T, m.seed) });
      });

      /* Jesus: still bent over the writing, then He straightens (v10) */
      const up = es(t, 2.08, 2.15);
      const around = bump(t, 2.3, 2.95);
      const bless = es(t, 5.05, 5.35);
      const scrib = t < 1.9 && T ? Math.sin(T * 9) * 5 : 0;
      K.jesus(T, {
        sit: 0, bend: 1 - up, stand: up, armF: up > 0.5 ? 20 + around * 30 + es(t, 4.05, 4.3) * 30 * (1 - bless) + bless * 40 : 28 + scrib,
        armB: up > 0.5 ? 10 + around * 70 + bless * 130 : 12, head: up > 0.5 ? -4 - around * 6 : 18, lean: up > 0.5 ? 0 : 20,
      });
      const [fx] = K.finger(28, 20);
      pose(K.marks, { x: fx - 16, y: CT.FLOOR + 16 });
      writeMarks(K.marks, 1, 1 - es(t, 2.0, 2.6) * 0.6);
      pose(K.marks2, { x: fx + 4, y: CT.FLOOR + 34 });
      writeMarks(K.marks2, 1, 1 - es(t, 2.0, 2.6) * 0.6);
      rings(CT.JX + 30, CT.FLOOR - 160, Math.max(bump(t, 2.2, 2.95), bump(t, 4.1, 4.95), bump(t, 5.1, 5.7)), T, { dir: 1, s0: 0.7, spread: 1.6 });
      const qk = es(t, 2.35, 2.6, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(q, { x: 1080, y: 500, s: qk * 1.5, r: Math.sin(T * 1.3) * 5, o: qk > 0.01 ? 1 : 0 });

      /* the woman: bowed; she looks up ("No one, Lord"); the light; she goes, free */
      const lift = es(t, 3.05, 3.3);
      const freeK = es(t, 4.42, 4.5);
      const goW = es(t, 5.45, 5.98, ease.in);
      const wx = CT.WX + goW * 560;
      const wo = {
        x: wx, y: CT.FLOOR + 4, s: 1, flip: goW < 0.02, walk: goW > 0 && goW < 1 ? wx * 0.05 : undefined,
        armF: 36 - lift * 10, armB: 40 - lift * 20, head: 18 - lift * 16 - freeK * 6, lean: 4 * (1 - lift), blink: blinkAt(T, 7),
      };
      K.woman.set({ ...wo, o: 1 - freeK });
      K.womanFree.set({ ...wo, o: freeK });
      fade(K.wSad, 1 - es(t, 4.1, 4.4)); fade(K.wTear, bump(t, 3.2, 4.4)); fade(K.wSmile, 0); fade(K.wDown, 1 - es(t, 4.2, 4.4));
      const sw = es(t, 3.08, 3.3, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(saysW, { x: CT.WX - 30, y: 470, s: sw, o: sw > 0.01 ? 1 : 0 });

      /* light */
      const alone = es(t, 1.1, 1.6);
      vis(pool, { x: (CT.JX + CT.WX) / 2 + 20, y: CT.FLOOR, s: 1, o: alone * 0.8 * (1 - goW * 0.5) });
      const gk = es(t, 4.1, 4.6) * (1 - es(t, 5.7, 6.0) * 0.5);
      vis(grace, { x: CT.WX, y: CT.FLOOR - 110, s: 0.5 + gk * 0.5, r: T * 4, o: gk * 0.5 });
      vis(path, { x: CT.WX + 20, y: CT.FLOOR + 12, s: 1, o: es(t, 5.1, 5.4) * 0.9 });

      S.cam.x = kf(t, [[0, 90], [1.0, 120], [1.3, 70], [2.2, 60], [2.6, 110], [3.0, 70], [4.0, 90], [5.3, 90], [6.0, 150]]);
      S.cam.y = kf(t, [[0, 60], [0.5, 20], [1.3, 40], [3.0, 20], [4.0, 10]]);
      S.cam.z = kf(t, [[0, 1.2], [0.8, 1.1], [1.3, 1.3], [2.2, 1.34], [2.6, 1.12], [3.0, 1.4], [4.5, 1.46], [5.2, 1.3], [6.0, 1.2]]);
    };
  },
};
