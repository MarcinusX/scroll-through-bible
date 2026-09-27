// J 18,19–21 — up in the lamp-lit hall: old Annas on his seat, Jesus standing before him, bound. The high priest asks
// about His disciples and His teaching (a bubble: a little band of followers, a scroll). "I spoke openly to the world":
// the world hangs in the hall, and His voice goes out to it in rings. "I always taught in synagogues and in the Temple,
// where all the Jews meet": two framed pictures come down — a synagogue full of listeners, the Temple full of people.
// "In secret I said nothing": a dark cloth over a little frame lifts away and there is only light behind it. "Why do
// you ask Me?" "Ask those who heard Me": a plate of many listeners. "Behold, they know what I said": He turns towards
// the courtyard below — and over the heads of the people at the fire little lights rise.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  courtyard, courtIdle, CY, fireCircle, annas, guardOpts, priest, ropeHands, speech, say, question, nameTag, globe, templeMini, synagogueIcon, peopleIcon, scrollRolled,
  voiceRings, panel, spark, hanging, vis, kf, headAt, hand, withFace, faceBits, person, pose, fade, lerp, mix, shade, sheet, tr, blinkAt, C, JESUS, PI, nt,
} from './lib.js';

const { YARD, HALL, JXH, ANX } = CY;
const MID = (JXH + ANX) / 2;

export default {
  id: 'j18-annas',
  beats: [
    { v: 19 },
    { v: 20, text: 'Jezus mu odpowiedział: «Ja przemawiałem jawnie przed światem.' },
    { v: 20, cont: true, text: 'Uczyłem zawsze w synagodze i w świątyni, gdzie się gromadzą wszyscy Żydzi.' },
    { v: 20, cont: true, text: 'Potajemnie zaś nie uczyłem niczego.' },
    { v: 21, text: 'Dlaczego Mnie pytasz?' },
    { v: 21, cont: true, text: 'Zapytaj tych, którzy słyszeli, co im mówiłem.' },
    { v: 21, cont: true, text: 'Oto oni wiedzą, co powiedziałem».' },
  ],
  cam: { x: [-360, 640], y: [-160, 120], z: [1, 1.4] },
  build(S) {
    const c = S.c;
    const R = courtyard(S);
    const hallL = S.layer({ par: CY.P, sh: 5 });
    const an = S.puppet(hallL.add(annas(c, { pose: 'sit' })));
    const pr = S.puppet(hallL.add(priest(c, 1)));
    const hg = S.puppet(hallL.add(person(c, guardOpts(c))));
    const jEl = hallL.add(withFace(person(c, { ...JESUS, holdF: ropeHands(c) }), faceBits(c)));
    const jesus = S.puppet(jEl);
    R.front();
    const Y = R.yard();
    const yardL = S.layer({ par: CY.P, sh: 5 });
    const F = fireCircle(S, yardL);

    const fx = S.layer({ par: CY.P, sh: 4 });
    const q = fx.add(`<g>${speech(c, `<g transform="translate(-16 4) scale(.34)">${peopleIcon(c, 12, mix(C.wood3, C.ink, 0.3), 120)}</g><g transform="translate(20 2) scale(.7)">${scrollRolled(c, 30)}</g>`, { w: 84, h: 56, flip: true })}</g>`);
    const world = hanging(fx, `<circle r="120" fill="url(#halo-glow)" opacity=".5"/>${globe(c, 56)}<g transform="translate(0 70)">${nameTag(c, tr('jawnie przed światem', 'openly to the world'), { size: 15 })}</g>`, { x: 0, y: 0, len: 800 });
    const rings = voiceRings(fx, c, { n: 3, color: C.haloRim, r: 30, w: 4, both: false });
    const synP = hanging(fx, panel(S, 170, 120, `<g transform="translate(0 112) scale(.95)">${synagogueIcon(c)}</g>`, { bg: mix(C.parchment, C.apricot, 0.2) }) + `<g transform="translate(0 132)">${nameTag(c, tr('synagoga', 'synagogue'), { size: 14 })}</g>`, { x: 0, y: 0, len: 800 });
    const temP = hanging(fx, panel(S, 170, 120, `<g transform="translate(0 100)">${templeMini(c, 1.0)}</g><g transform="translate(0 116)">${peopleIcon(c, 5, mix(C.wood3, C.ink, 0.2), 150).replace('<path', '<path transform="scale(.6)"')}</g>`, { bg: mix(C.skyBlue, C.cream, 0.4) }) + `<g transform="translate(0 132)">${nameTag(c, tr('świątynia', 'the Temple'), { size: 14 })}</g>`, { x: 0, y: 0, len: 800 });
    // "nothing in secret": a little frame with a dark cloth that lifts off — only light behind it
    const secret = hanging(fx, panel(S, 130, 110, `<circle cx="0" cy="55" r="70" fill="url(#halo-glow)"/><circle cx="0" cy="55" r="22" fill="${C.halo}"/>`, { bg: C.cream }), { x: 0, y: 0, len: 800 });
    const cloth = fx.add(`<g>${sheet().p(c.cut([[-70, 0], [70, 0], [66, 116], [30, 124], [-10, 116], [-50, 124], [-68, 116]], 0.6, 6), mix(C.night2, C.plumRobe, 0.3)).x(c.ribbon([[-40, 4], [-44, 110]], 4) + c.ribbon([[20, 4], [16, 112]], 4), mix(C.night, C.plumRobe, 0.4), 'opacity=".6"').out()}</g>`);
    const why = fx.add(`<g transform="scale(1.3)">${question(c)}</g>`);
    const heard = hanging(fx, `<circle r="90" fill="url(#halo-glow)" opacity=".4"/>${sheet().p(c.cut(c.rect(-110, -60, 220, 120), 0.5, 8), C.cream).p(c.cut(c.rect(-102, -52, 204, 104), 0.4, 8), C.parchment).out()}<g transform="translate(0 16) scale(1.2)">${peopleIcon(c, 10, mix(C.wood3, C.ink, 0.25), 150)}</g>${[-60, 0, 60].map((x) => `<path d="${c.ribbon(c.arc(x, -34, 12, 12, 0.3 * PI, 0.7 * PI, 8), 2.4)}" fill="${C.haloRim}"/>`).join('')}`, { x: 0, y: 0, len: 800 });
    const lights = F.ring.concat([{ x: F.peter.x, y: 12, s: 0.92, f: false }]).map((d, i) => ({ d, i, el: fx.add(`<g>${spark(c, 9)}</g>`) }));

    return (t, time) => {
      const T = time;
      courtIdle(R, Y, T, 0);
      R.dawn.fade(0);
      F.set(T, { warm: 1 });
      F.peter.p.set({ x: F.peter.x, y: YARD + 12, s: 0.92, flip: false, armF: 74, armB: 48, head: 6, lean: 4, blink: blinkAt(T, 3) });

      /* the hall */
      const ask = es(t, 0.05, 0.25) * (1 - es(t, 0.85, 1.0));
      an.set({ x: ANX, y: HALL, s: 0.92, flip: true, armF: 30 + ask * 40, armB: 20, head: -ask * 4 + es(t, 4.05, 4.3) * 6, blink: blinkAt(T, 5) });
      pr.set({ x: ANX + 120, y: HALL, s: 0.88, flip: true, armF: 14, armB: 6, head: 4, blink: blinkAt(T, 9) });
      hg.set({ x: JXH - 100, y: HALL, s: 0.9, flip: false, armF: 16, armB: 6, blink: blinkAt(T, 7) });
      const speak = es(t, 1.05, 1.25) * (1 - es(t, 6.9, 7.0));
      const toYard = es(t, 5.05, 5.35);
      jesus.set({ x: JXH, y: HALL, s: 1.0, flip: toYard > 0.5, armF: 26, armB: 12 + toYard * 60, head: -speak * 3 + toYard * 10, blink: blinkAt(T) });
      fade(jEl.querySelector('[data-part="sad"]'), 0);
      const [jhx, jhy] = headAt(JXH, HALL, 1.0, false);

      /* v19 — the question */
      const [ahx, ahy] = headAt(ANX, HALL, 0.92, true, 62);
      const qk = es(t, 0.15, 0.35, ease.back) * (1 - es(t, 0.9, 1.0));
      vis(q, { x: ahx - 16, y: ahy - 22, s: qk, o: qk > 0.01 ? 1 : 0 });

      /* v20 — openly to the world; synagogue and Temple; nothing in secret */
      const wk = es(t, 1.05, 1.4, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(world, { x: MID, y: 290 - (1 - wk) * 800, r: T ? Math.sin(T * 0.8) * 1.4 : 0, o: wk > 0.01 ? 1 : 0 });
      rings(jhx + 24, jhy - 4, wk > 0.5 ? 1 : 0, T, { spread: 2.2 });
      const sk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 2.9, 3.05, ease.in));
      vis(synP, { x: MID - 105, y: 230 - (1 - sk) * 800, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: sk > 0.01 ? 1 : 0 });
      const tk = es(t, 2.2, 2.55, ease.out) * (1 - es(t, 2.9, 3.05, ease.in));
      vis(temP, { x: MID + 105, y: 230 - (1 - tk) * 800, r: T ? Math.sin(T * 0.8 + 1) * 1.2 : 0, o: tk > 0.01 ? 1 : 0 });
      const ck = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 3.9, 4.05, ease.in));
      const cy = 250 - (1 - ck) * 800;
      vis(secret, { x: MID, y: cy, o: ck > 0.01 ? 1 : 0 });
      const lift = es(t, 3.4, 3.7, ease.in);
      vis(cloth, { x: MID, y: cy - 4 - lift * 260, r: lift * -8, o: ck > 0.01 ? 1 - es(t, 3.6, 3.75) : 0 });

      /* v21 — why ask Me? ask those who heard; they know */
      const wq = es(t, 4.1, 4.3, ease.back) * (1 - es(t, 4.9, 5.0));
      vis(why, { x: jhx + 30, y: jhy - 70, s: 1.3 * wq, o: wq > 0.01 ? 1 : 0 });
      const hk = es(t, 5.1, 5.4, ease.out) * (1 - es(t, 5.9, 6.05, ease.in));
      vis(heard, { x: MID - 40, y: 300 - (1 - hk) * 800, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: hk > 0.01 ? 1 : 0 });
      lights.forEach((l) => {
        const k = es(t, 6.1 + l.i * 0.06, 6.4 + l.i * 0.06, ease.out);
        const [hx, hy] = headAt(l.d.x, YARD + (l.d.y ?? 0), l.d.s ?? 0.94, l.d.f);
        vis(l.el, { x: hx, y: hy - 40 - k * 20 + (T ? Math.sin(T * 2 + l.i) * 3 : 0), s: k, o: k > 0.01 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, 560], [1, 540], [2, 520], [3, 540], [4, 540], [5, 480], [5.9, 400], [6.2, -60], [7, -80]]);
      S.cam.y = kf(t, [[0, -60], [1, -100], [2, -110], [4, -90], [5.9, -90], [6.2, 60], [7, 60]]);
      S.cam.z = kf(t, [[0, 1.28], [1, 1.2], [2, 1.16], [3, 1.24], [4, 1.3], [5, 1.18], [5.9, 1.14], [6.2, 1.0], [7, 1.0]]);
    };
  },
};
