// J 16,16–19 — "A little while, and you will not see Me": a golden light over the Mount of Olives sinks behind the
// ridge, the night deepens and the lanterns shrink. "Again a little while, and you will see Me": it rises again with
// a flush of dawn. Then the Eleven turn to one another in pairs and speech-bubbles pass between them — the light
// going down and coming up, a path going up to a light, an hourglass — each with a question mark. "We don't know what
// He is saying": question marks over every head. "Jesus perceived that they wanted to ask Him": He turns, and all
// their question marks drift over to Him and circle round Him; "Do you inquire among yourselves…": a little round
// plate is lowered above Him, where the light sinks behind a hill and rises again.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, speech, question, headAt, roundPlate, hillPiece, hourglassRig, hanging,
  sheet, shade, mix, kf, vis, pose, lerp, C, PI, JX, NIGHT, DEEP, PREDAWN, LINE,
} from './lib.js';

const SX = 1010;          // where the light sinks behind the ridge

// who talks to whom (left member faces right, right member faces left)
const PAIRS = [['andrew', 'james'], ['thomas', 'john'], ['matthew', 'philip'], ['bartholomew', 'jamesA'], ['thaddaeus', 'simonZ']];
const SAY = { andrew: 'a', thomas: 'a', matthew: 'a', james: 'b', john: 'b', bartholomew: 'b', philip: 'c', thaddaeus: 'c', jamesA: 'c', simonZ: 'b', peter: 'c' };

export default {
  id: 'j16-while',
  beats: [
    { v: 16, text: 'Jeszcze chwila, a nie będziecie Mnie widzieć,' },
    { v: 16, cont: true, text: 'i znowu chwila, a ujrzycie Mnie».' },
    { v: 17, text: 'Wówczas niektórzy z Jego uczniów mówili między sobą: «Co to znaczy, co nam mówi: "Chwila, a nie będziecie Mnie widzieć, i znowu chwila, a ujrzycie Mnie";' },
    { v: 17, cont: true, text: 'oraz: "Idę do Ojca?"»' },
    { v: 18, text: 'Powiedzieli więc: «Co znaczy ta chwila, o której mówi?' },
    { v: 18, cont: true, text: 'Nie rozumiemy tego, co mówi».' },
    { v: 19, text: 'Jezus poznał, że chcieli Go pytać, i rzekł do nich:' },
    { v: 19, cont: true, text: '«Pytacie się jeden drugiego o to, że powiedziałem: "Chwila, a nie będziecie Mnie widzieć, i znowu chwila, a ujrzycie Mnie?"' },
  ],
  cam: { x: [-30, 40], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    let disc = null, flush = null;
    const P = pathSet(S, {
      beyond(S2) {
        flush = S2.layer({ par: 0.12, sh: 0, flat: true });
        flush.add(`<ellipse cx="${SX}" cy="500" rx="760" ry="240" fill="url(#halo-glow)"/>`);
        const L = S2.layer({ par: 0.13, sh: 2 });
        const s = sheet().p(c.cut(c.circ(0, 0, 40, 36), 0.4, 4), C.halo).p(c.cut(c.circ(0, 0, 28, 30), 0.3, 4), C.star);
        disc = L.add(`<g><circle r="150" fill="url(#halo-glow)"/>${s.out()}</g>`);
        return L;
      },
    });
    const GY = P.GY;

    // small icons for the bubbles
    const ic = {
      a: () => `<g transform="translate(-6 -4)"><path d="${c.cut(c.circ(-8, 2, 7, 12), 0.2, 2)}" fill="${C.sun}"/><path d="${c.cut([[-20, 4], [-12, -1], [-2, 2], [4, 6], [4, 10], [-20, 10]], 0.3, 3)}" fill="${C.sage}"/><path d="${c.ribbon([[-8, -10], [-8, -4]], 2)}" fill="${C.ink}"/><path d="${c.cut(c.circ(10, -4, 6, 10), 0.2, 2)}" fill="${C.sun}"/><path d="${c.ribbon([[10, 8], [10, 3]], 2)}" fill="${C.ink}"/></g><g transform="translate(20 0) scale(.55)">${question(c)}</g>`,
      b: () => `<g transform="translate(-8 0)"><path d="${c.cut(c.circ(6, -10, 6, 10), 0.2, 2)}" fill="${C.halo}"/><circle cx="6" cy="-10" r="11" fill="url(#halo-glow)"/>${[0, 1, 2, 3].map((i) => `<path d="${c.cut(c.circ(-14 + i * 5, 10 - i * 5, 1.8, 6), 0.1, 2)}" fill="${C.haloRim}"/>`).join('')}</g><g transform="translate(20 0) scale(.55)">${question(c)}</g>`,
      c: () => `<g transform="translate(-10 0)"><path d="${c.cut([[-8, -12], [8, -12], [1, 0], [8, 12], [-8, 12], [-1, 0]], 0.2, 3)}" fill="${C.wheat}"/><path d="${c.ribbon([[-9, -13], [9, -13]], 2.5) + c.ribbon([[-9, 13], [9, 13]], 2.5)}" fill="${C.wood2}"/></g><g transform="translate(16 0) scale(.55)">${question(c)}</g>`,
    };

    const hgL = S.layer({ par: 0.2, sh: 4 });
    const hg = hourglassRig(hgL, c, 90);
    const hgStr = hgL.add(`<g><path d="M0 -1600V-45" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/></g>`);
    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY, pos: LINE });
    const byK = Object.fromEntries(D.map((m) => [m.k, m]));
    PAIRS.forEach(([a, b]) => { byK[a].face = false; byK[b].face = true; });
    byK.peter.face = false;

    const fx = S.layer({ par: 0.56, sh: 4 });
    const bubbles = D.map((m) => ({ m, el: fx.add(`<g>${speech(c, `<g transform="scale(1.25)">${ic[SAY[m.k]]()}</g>`, { w: 96, h: 54, flip: !!m.face })}</g>`) }));
    const qs = D.map((m, i) => ({ m, i, el: fx.add(`<g>${question(c)}</g>`) }));
    const hangL = S.layer({ par: 0.25, sh: 5 });
    const mini = sheet().p(c.cut(c.circ(0, 0, 18, 18), 0.3, 3), C.halo).out();
    const plate = hanging(hangL, `${roundPlate(c, `<g data-k="mdisc">${mini}</g><g transform="translate(0 44)">${hillPiece(c, 130, 26, mix(C.sage, C.indigo, 0.35))}</g>`, '', { r: 58, face: '#2e3262' })}`, { x: JX, y: 330, len: 700 });
    const mdisc = S.$('mdisc');

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v16 — the light sinks and rises again */
      const down = es(t, 0.2, 0.85), up = es(t, 1.05, 1.6), away = es(t, 2.1, 2.5);
      const h = down * (1 - up) + away;
      const RY = P.ridge(SX);
      vis(disc, { x: SX, y: RY - 70 + h * 120, s: 1, o: 1 - es(t, 2.4, 2.6) });
      const dark = down * (1 - up);
      const rose = up * (1 - away);
      P.sky.blend(dark > 0.001 ? NIGHT : NIGHT, dark > 0.001 ? DEEP : PREDAWN, dark > 0.001 ? dark : rose * 0.6);
      flush.fade(rose * 0.9 + (1 - down) * 0.5 + dark * 0.18);
      P.stars.fade(1 - rose * 0.5);

      const hin = es(t, -0.2, 0.15, ease.out) * (1 - es(t, 1.85, 2.1, ease.in));
      const flip1 = es(t, 0.1, 0.3), flip2 = es(t, 1.0, 1.2);
      vis(hgStr, { x: 560, y: 260 - (1 - hin) * 700, o: hin > 0.01 ? 1 : 0 });
      vis(hg.el, { x: 560, y: 260 - (1 - hin) * 700, r: (flip1 + flip2) * 180 + (T ? Math.sin(T * 0.9) * 1.2 : 0), o: hin > 0.01 ? 1 : 0 });
      const lv = t < 1 ? 1 - seg(t, 0.3, 0.9) * 0.9 : 1 - seg(t, 1.2, 1.8) * 0.9;
      hg.set(lv, (t > 0.3 && t < 0.9) || (t > 1.2 && t < 1.8) ? 1 : 0);
      /* the pairs talk */
      const talkA = bump(t, 2.05, 2.95), talkB = bump(t, 3.05, 3.95), talkC = bump(t, 4.05, 4.95);
      const turnIn = es(t, 1.95, 2.15) * (1 - es(t, 5.95, 6.2));
      bubbles.forEach(({ m, el }) => {
        const k = SAY[m.k] === 'a' ? talkA : SAY[m.k] === 'b' ? talkB : talkC;
        const fl = turnIn > 0.5 ? m.face : m.flip;
        const [hx, hy] = headAt(m.x, m.y, m.s, fl);
        vis(el, { x: hx + (fl ? -14 : 14), y: hy - 28, s: 0.4 + k * 0.6, o: Math.min(1, k * 2.2) });
      });
      /* v18b — question marks everywhere; v19a — they drift to Him and circle */
      const qIn = es(t, 5.05, 5.35);
      const toHim = es(t, 6.05, 6.5), gone = es(t, 6.85, 7.2);
      qs.forEach(({ m, el, i }) => {
        const fl = turnIn > 0.5 ? m.face : m.flip;
        const [hx, hy] = headAt(m.x, m.y, m.s, fl);
        const a = (i / D.length) * PI * 2 + t * 1.2;
        const cx = JX + Math.cos(a) * 110, cy = J.y - 200 + Math.sin(a) * 40;
        const x = lerp(hx, cx, toHim), y = lerp(hy - 50 - Math.sin(t * 3 + i) * 4 * (1 - toHim), cy, toHim);
        vis(el, { x: lerp(x, JX + 20, gone), y: lerp(y, J.y - 170, gone), s: (0.6 + qIn * 0.3) * (1 - gone * 0.7), r: (1 - toHim) * Math.sin(i * 2) * 14, o: qIn * (1 - gone) });
      });
      /* v19b — the little plate */
      const pl = es(t, 7.0, 7.3, ease.out);
      vis(plate, { x: JX, y: 330 - (1 - pl) * 700, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: pl > 0.01 ? 1 : 0 });
      if (pl > 0.01) {
        const d2 = es(t, 7.22, 7.42) * (1 - es(t, 7.48, 7.7));
        pose(mdisc, { x: 0, y: -8 + d2 * 44 });
      }

      /* people */
      const shrug = bump(t, 5.05, 5.95);
      D.forEach((m) => {
        const d = Math.abs(m.x - JX);
        lampK(m, 0.85 - dark * 0.45 + rose * 0.1, 0, T);
        const fl = turnIn > 0.5 ? m.face : m.flip;
        const look = es(t, 6.1 + d * 0.0005, 6.3 + d * 0.0005);
        const flipNow = look > 0.5 ? m.x > JX : fl;
        fade(m.sad, dark * 0.8 + shrug * 0.4);
        const talking = SAY[m.k] === 'a' ? talkA : SAY[m.k] === 'b' ? talkB : talkC;
        put(m, T, { flip: flipNow, head: dark * 10 - rose * 8 + shrug * (m.i % 2 ? 8 : -6) - look * 4, armB: 8 + talking * 70 + shrug * 60 * (m.i % 2), armF: m.arm + shrug * 20 });
      });
      put(J, T, { armF: 20 + bump(t, 0.1, 0.9) * 50 + bump(t, 1.1, 1.9) * 50 + bump(t, 6.3, 7.0) * 40, armB: 10 + bump(t, 7.05, 7.95) * 110, head: -bump(t, 1.2, 1.8) * 8 + es(t, 6.0, 6.2) * 4, flip: false });

      S.cam.x = kf(t, [[0, 20], [1.9, 20], [2.3, 0], [7, 0], [8, 0]]);
      S.cam.y = kf(t, [[0, -20], [1.9, -20], [2.3, 10], [5.8, 10], [6.5, -20], [7.2, -40], [8, -40]]);
      S.cam.z = kf(t, [[0, 1.02], [2, 1.02], [2.5, 1.1], [5.8, 1.1], [6.5, 1.04], [8, 1.02]]);
    };
  },
};
