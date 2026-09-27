// J 12,9–11 — daylight at Bethany. Word goes round (rings of voices) and a great crowd comes up the road; they look at
// Jesus — and at Lazarus beside Him, pointing, while across the hill his empty tomb glows. Far off, before the city, a
// dark plate comes down: the chief priests bent together over a scroll with his name, a dark seal pressed on it,
// and a long shadow creeps across the ground towards him. But one by one people leave the crowd and cross over to
// Jesus, and small lights kindle above them: many believed because of Lazarus.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { bethanySet, BE, MORNING, LAZ, man, crowdPerson, chiefPriest, people, place, nameTag, hanging, swing, kf, vis, voiceRings, headAt, soulLight, framed, sparkle, tr, PI, FONT, INK } from './lib.js';

export default {
  id: 'j12-lazarus',
  beats: [
    { v: 9, text: 'Wielki tłum Żydów dowiedział się, że tam jest;' },
    { v: 9, cont: true, text: 'a przybyli nie tylko ze względu na Jezusa, ale także by ujrzeć Łazarza, którego wskrzesił z martwych.' },
    { v: 10 },
    { v: 11 },
  ],
  cam: { x: [-60, 140], y: [-80, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = bethanySet(S, { skyCols: MORNING, starsN: 0 });
    const G = BE.GROUND;
    // the creeping shadow (flat, on the ground)
    const shL = S.layer({ par: 0.46, sh: 0, flat: true });
    const shadow = shL.add(`<g><path d="${c.cut([[0, -6], [-300, -14], [-520, -6], [-640, 6], [-500, 20], [-220, 22], [0, 14]], 3, 20)}" fill="#2a2140" opacity=".32"/></g>`);
    const back = S.layer({ par: 0.48, sh: 4 });
    const act = S.layer({ par: 0.52, sh: 5 });
    const list = [];
    const xs = [300, 400, 500, 600, 350, 450, 550];
    xs.forEach((x, i) => list.push({ x, y: i < 4 ? G + 8 : G - 16, s: i < 4 ? 0.95 : 0.86, look: i % 3 === 1 ? crowdPerson(c) : man(c) }));
    const crowdB = people(S, back, list.slice(4), 'b');
    const crowdF = people(S, act, list.slice(0, 4), 'f');
    const crowd = [...crowdF, ...crowdB];
    const jesus = S.puppet(act.add(person(c, CAST.jesus)));
    const laz = S.puppet(act.add(person(c, LAZ)));
    const fx = S.layer({ par: 0.56, sh: 4 });
    const voices = [0, 1, 2].map(() => voiceRings(fx, c, { n: 3, r: 26, w: 4, color: shade(C.terracotta, 0.3) }));
    const wonder = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 12, C.sun)}</g>`));
    const lights = crowd.map(() => fx.add(`<g>${soulLight(c, 10)}</g>`));
    const tagL = S.layer({ par: 0.3, sh: 4 });
    const tagLaz = hanging(tagL, nameTag(c, tr('Łazarz', 'Lazarus'), { size: 17 }), { x: 930, y: 420, len: 600 });
    // the chief priests' plate
    const pr = [0, 1, 2].map((i) => `<g transform="translate(${[70, 125, 260][i]} 196) scale(.52)">${person(c, { ...chiefPriest(i), flip: false })}</g>`);
    const scrollP = sheet().p(c.cut(c.rect(-50, -18, 100, 36), 0.4, 5), C.parchment).p(c.cut(c.rect(-58, -22, 10, 44), 0.3, 4) + c.cut(c.rect(48, -22, 10, 44), 0.3, 4), C.wood2).out();
    const inner = `<rect width="320" height="210" fill="${mix(C.night, C.plumRobe, 0.4)}"/><circle cx="170" cy="110" r="120" fill="url(#warm-glow)" opacity=".45"/>` +
      `<g transform="translate(160 214) scale(1)"><path d="${c.cut([[-150, 0], [-150, -40], [150, -40], [150, 0]], 0.5, 8)}" fill="${mix(C.wood2, C.night, 0.3)}"/></g>` +
      `${pr[0]}${pr[1]}<g transform="translate(520 0) scale(-1 1)">${pr[2]}</g>` +
      `<g transform="translate(196 120)">${scrollP}<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="15" font-style="italic" fill="${INK}">${tr('Łazarz', 'Lazarus')}</text></g>`;
    const plotEl = tagL.add(`<g>${framed(S, inner, { w: 320, h: 210, rim: mix(C.wood2, C.night, 0.3), bg: C.night, k: 'plot' })}<g transform="translate(0 236)">${nameTag(c, tr('arcykapłani', 'the chief priests'), { size: 15, dark: true })}</g></g>`);
    const seal = tagL.add(`<g><path d="${c.cut(c.blob(0, 0, 10, 9, 12, 0.15), 0.3, 3)}" fill="#3a1f2c"/><path d="${c.ribbon([[-40, 6], [40, 4]], 2.4)}" fill="#3a1f2c"/></g>`);
    set.fg();

    return (t, time) => {
      const T = time;
      set.update(t, T, { sunY: 150, sunO: 1, moonO: 0, starsO: 0, night: es(t, 2, 2.4) * 0.12 * (1 - es(t, 3.2, 3.8)), door: 0.3, tomb: es(t, 1.2, 1.5) * (1 - es(t, 2.1, 2.4)) });
      /* v9a — the crowd hears and comes */
      const arrive = (m, i) => es(t, 0.15 + (i % 5) * 0.08, 0.8 + (i % 5) * 0.06, ease.out);
      const pointAt = es(t, 1.15, 1.4) * (1 - es(t, 2.0, 2.2));
      crowd.forEach((m, i) => {
        const k = arrive(m, i);
        const believe = i === 3 || i === 2 || i === 6 || i === 5 ? es(t, 3.1 + i * 0.05, 3.5 + i * 0.05) : 0;
        const x = lerp(m.x - 420, m.x, k) + believe * (i < 4 ? 70 : 60);
        m.cx = x;
        const lookLaz = i % 2 ? pointAt : 0;
        place(m, T, { x, walk: (k > 0 && k < 1) || (believe > 0 && believe < 1) ? x * 0.06 + i : undefined, armF: 10 + lookLaz * 80 + bump(t, 1.1, 1.9) * (i % 2 ? 0 : 20), armB: bump(t, 0.2, 0.9) * (i === 2 ? 60 : 0), head: -4 - lookLaz * 4 + believe * -4 + es(t, 2.1, 2.5) * (1 - believe) * 6 });
        const lk = es(t, 3.3 + i * 0.05, 3.5 + i * 0.05, ease.back) * (believe > 0 ? 1 : 0);
        const [hx, hy] = headAt(x, m.y, m.s, false);
        vis(lights[i], { x: hx, y: hy - 38 * m.s + (T ? Math.sin(T * 2 + i) * 2 : 0), s: lk, o: lk > 0.01 ? 1 : 0 });
      });
      voices.forEach((v, i) => { const m = crowd[i * 2]; const [hx, hy] = headAt(m.cx, m.y, m.s, false); v(hx + 14, hy + 4, bump(t, 0.1, 0.95), T, { dir: 1 }); });
      wonder.forEach((el, i) => { const k = bump(t, 1.2 + i * 0.08, 1.9 + i * 0.05); vis(el, { x: 520 + i * 60, y: 450 - i * 10, s: k * 1.1 + 0.01, r: t * 80, o: k }); });
      /* Jesus and Lazarus at the door */
      jesus.set({ x: 800, y: G + 4, s: 1.0, flip: true, armF: 20 + bump(t, 0.9, 1.9) * 40 + es(t, 3.1, 3.5) * 50, armB: 10 + es(t, 3.1, 3.5) * 60, head: 2, blink: blinkAt(T) });
      const fear = es(t, 2.2, 2.5) * (1 - es(t, 3.2, 3.6));
      laz.set({ x: 925, y: G + 2, s: 0.98, flip: true, armF: 18 + bump(t, 1.2, 1.9) * 40 - fear * 10, armB: 10, head: 4 + fear * 10, blink: blinkAt(T, 5) });
      const lk = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 2.9, 3.1));
      swing(tagLaz, 930, 400 - (1 - lk) * 600, lk > 0.001 ? T : 0, 1.3, 0.8);
      fade(tagLaz, lk > 0.001 ? 1 : 0);
      /* v10 — the chief priests' plot */
      const pk = es(t, 2.05, 2.45, ease.out) * (1 - es(t, 3.0, 3.25, ease.in));
      vis(plotEl, { x: 1120, y: 150 - (1 - pk) * 700, r: pk > 0.01 && T ? Math.sin(T * 0.6) * 0.6 : 0, o: pk > 0.001 ? 1 : 0 });
      const sk = es(t, 2.45, 2.6, ease.back) * (1 - es(t, 3.0, 3.25));
      vis(seal, { x: 1120 - 160 + 196, y: 150 - (1 - pk) * 700 + 134, s: sk, o: sk > 0.01 ? 1 : 0 });
      const creep = es(t, 2.3, 2.9) * (1 - es(t, 3.2, 3.9) * 0.6);
      vis(shadow, { x: 1500, y: G + 30, sx: 0.2 + creep * 0.85, o: creep > 0.01 ? 1 : 0 });
      S.cam.x = kf(t, [[0, -30], [1, 10], [1.9, 40], [2.3, 120], [3.0, 100], [3.4, 20], [4, 30]]);
      S.cam.y = kf(t, [[0, 0], [2.0, 0], [2.4, -40], [3.2, 0]]);
      S.cam.z = kf(t, [[0, 1.02], [1, 1.06], [1.9, 1.1], [2.4, 1.04], [3.2, 1.08], [4, 1.08]]);
    };
  },
};
