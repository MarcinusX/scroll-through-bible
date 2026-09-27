// J 18,15–18 — Annas' house by night, cut open: the street and the gate on the left, the courtyard with a cold fire
// pit, and up on the right the lamp-lit hall where old Annas sits. Jesus is led in, bound, and up into the hall; Simon
// Peter and another disciple follow. The other one is known to the high priest (a small tag) and goes in with Him;
// the gate shuts on Peter, left alone in the dark street. The other disciple comes back, speaks to the girl who keeps
// the door, and Peter is let in. She lifts her lamp to his face: "Aren't you also one of this man's disciples?" —
// "I am not": a grey tag over Peter, while up in the hall a small gold "I AM" still glows over his Master. It is cold:
// the servants and officers light a charcoal fire, stand round it with their hands out, and Peter stands with them.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  courtyard, courtIdle, CY, annas, guardOpts, ropeHands, noTag, iAm, say, speech, nameTag, medallion, oilLamp, hanging, vis, kf, moving, headAt,
  withFace, faceBits, person, pose, fade, lerp, mix, tr, blinkAt, C, JESUS, TW, MAID, PI, nt,
} from './lib.js';

const { YARD, HALL, GATE, FIRE, JXH, ANX } = CY;
const MX = 420, PIN = 530, DOORX = 640;                                    // the girl at the door
const RING = [{ x: FIRE - 130, y: 6, f: false }, { x: FIRE + 100, y: 2, f: true }, { x: FIRE + 44, y: -26, f: true, s: 0.82 }, { x: FIRE - 52, y: -24, f: false, s: 0.82 }];

export default {
  id: 'j18-courtyard',
  beats: [
    { v: 15, text: 'A szedł za Jezusem Szymon Piotr razem z innym uczniem.' },
    { v: 15, cont: true, text: 'Uczeń ten był znany arcykapłanowi' },
    { v: 15, cont: true, text: 'i dlatego wszedł za Jezusem na dziedziniec arcykapłana,' },
    { v: 16, text: 'podczas gdy Piotr zatrzymał się przed bramą na zewnątrz.' },
    { v: 16, cont: true, text: 'Wszedł więc ów drugi uczeń, znany arcykapłanowi, pomówił z odźwierną i wprowadził Piotra do środka.' },
    { v: 17, text: 'A służąca odźwierna rzekła do Piotra: «Czy może i ty jesteś jednym spośród uczniów tego człowieka?»' },
    { v: 17, cont: true, text: 'On odpowiedział: «Nie jestem».' },
    { v: 18, text: 'A ponieważ było zimno, strażnicy i słudzy rozpaliwszy ognisko stali przy nim i grzali się.' },
    { v: 18, cont: true, text: 'Wśród nich stał także Piotr i grzał się [przy ogniu].' },
  ],
  cam: { x: [-1060, 120], y: [-60, 160], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const R = courtyard(S);
    // the hall: Annas, a guard, Jesus
    const hallL = S.layer({ par: CY.P, sh: 5 });
    const an = S.puppet(hallL.add(annas(c, { pose: 'sit' })));
    const hg = S.puppet(hallL.add(person(c, guardOpts(c))));
    R.front();
    const Y = R.yard();
    // the yard: guards leading Him, Jesus, John, Peter, the girl, the servants at the fire
    const P = S.layer({ par: CY.P, sh: 5 });
    const lead = [0, 1].map((i) => S.puppet(P.add(person(c, guardOpts(c)))));
    const ring = RING.map((d, i) => ({ ...d, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, guardOpts(c)))) }));
    const jEl = P.add(withFace(person(c, { ...JESUS, holdF: ropeHands(c) }), faceBits(c)));
    const jesus = S.puppet(jEl);
    const johnP = S.puppet(P.add(withFace(person(c, TW.john), faceBits(c))));
    const pEl = P.add(withFace(person(c, TW.peter), faceBits(c)));
    const peter = S.puppet(pEl);
    const pSad = pEl.querySelector('[data-part="sad"]');
    const maidEl = P.add(person(c, { ...MAID, holdF: `<g transform="translate(-2 6) scale(.42)">${oilLamp(c, { r: 90 })}</g>` }));
    const maid = S.puppet(maidEl);
    const mFl = maidEl.querySelector('.flame');
    const G = R.gate();

    const fx = S.layer({ par: CY.P, sh: 4 });
    const known = hanging(fx, nameTag(c, tr('znany arcykapłanowi', 'known to the high priest'), { size: 15 }), { x: 0, y: 0, len: 700 });
    const talk = fx.add(`<g>${speech(c, `<g transform="scale(.8)">${medallion(c, TW.peter, { r: 16 })}</g>`, { w: 58, h: 46, flip: true })}</g>`);
    const ask = fx.add(`<g>${say(c, [tr('Czy i ty jesteś', 'Are you also one'), tr('jednym z Jego uczniów?', 'of His disciples?')], { size: 17, side: 1 })}</g>`);
    const no = hanging(fx, noTag(c, tr('Nie jestem', 'I am not'), { size: 21 }), { x: 0, y: 0, len: 700 });
    const am = hanging(fx, iAm(c, tr('JA JESTEM', 'I AM'), { size: 20 }), { x: 0, y: 0, len: 700 });
    const puffs = [0, 1, 2, 3].map((i) => ({ i, el: fx.add(`<g><path d="${c.cut(c.blob(0, 0, 9, 6, 8, 0.2), 0.3, 3)}" fill="${C.cream}" opacity=".5"/></g>`) }));

    return (t, time) => {
      const T = time;
      const fireK = es(t, 7.05, 7.5);
      courtIdle(R, Y, T, 1 - fireK);
      Y.tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i], y: -16, sy: fireK * (0.85 + (T ? Math.sin(T * (6 + i) + i) * 0.15 : 0)), sx: 1, o: fireK > 0.02 ? 1 : 0 }));
      Y.glowL.fade(fireK * (0.85 + (T ? Math.sin(T * 4) * 0.08 : 0)));
      R.dawn.fade(0);
      pose(G.lampFl, { x: 35, y: -16, sy: 1 + (T ? Math.sin(T * 7) * 0.1 : 0) });

      /* the hall */
      an.set({ x: ANX, y: HALL, s: 0.92, flip: true, armF: 30, armB: 20, head: 4, blink: blinkAt(T, 5) });
      hg.set({ x: JXH - 100, y: HALL, s: 0.9, flip: false, armF: 16, armB: 6, blink: blinkAt(T, 7) });

      /* v15 — Jesus led in and up into the hall; Peter and the other disciple follow */
      const jK = [[-0.5, [-120, YARD]], [1.0, [300, YARD]], [2.1, [770, YARD]], [2.5, [880, HALL]], [2.9, [JXH, HALL]]];
      const [jx, jy] = kf(t, jK, ease.sine);
      jesus.set({ x: jx, y: jy, s: jy < YARD - 10 ? 0.94 : 1.0, flip: false, walk: moving(t, jK, 1) ? jx * 0.05 : undefined, amt: 0.7, armF: 26, armB: 12, head: 6 - es(t, 6.1, 6.5) * 4 * (1 - es(t, 6.9, 7.1)), blink: blinkAt(T) });
      fade(jEl.querySelector('[data-part="sad"]'), 0.3);
      lead.forEach((g, i) => {
        const off = i === 0 ? 90 : -90;
        const gK = jK.map(([tt, [x, y]]) => [tt, [x + off, y]]);
        const [gx, gy] = kf(t, gK, ease.sine);
        const fin = i === 0 ? [JXH + 110, HALL] : [JXH - 190, HALL];
        const k2 = es(t, 2.9, 3.2);
        g.set({ x: lerp(gx, fin[0], k2), y: lerp(gy, fin[1], k2), s: gy < YARD - 10 ? 0.92 : 0.98, flip: i === 0 && k2 > 0.5, o: 1 - es(t, 3.0, 3.2), walk: moving(t, gK, 1) ? gx * 0.05 : undefined, armF: 30, armB: 8, blink: blinkAt(T, 4 + i) });
      });
      // John: follows, is known, goes in; comes back for Peter; stays near the steps
      const oK = [[-0.5, [-330, YARD]], [1.0, [110, YARD + 4]], [1.9, [110, YARD + 4]], [2.8, [520, YARD + 4]], [4.05, [520, YARD + 4]], [4.35, [MX + 50, YARD + 4]], [4.8, [MX + 50, YARD + 4]], [5.6, [830, YARD + 2]]];
      const [ox, oy] = kf(t, oK, ease.sine);
      const oBack = (t > 4.05 && t < 4.8);
      johnP.set({ x: ox, y: oy, s: 0.9, flip: oBack, o: 1, walk: moving(t, oK, 1) ? ox * 0.06 : undefined, armF: 18 + bump(t, 4.35, 4.75) * 50, armB: 8, head: bump(t, 1.2, 1.9) * -4, blink: blinkAt(T, 1) });
      // Peter: behind John; stops outside; is let in; at the fire
      const pK = [[-0.5, [-420, YARD]], [1.0, [-40, YARD + 6]], [2.3, [-40, YARD + 6]], [2.95, [200, YARD + 6]], [4.5, [200, YARD + 6]], [4.95, [PIN, YARD + 6]], [7.0, [PIN, YARD + 6]], [7.4, [470, YARD + 8]], [8.0, [470, YARD + 8]], [8.45, [FIRE - 64, YARD + 12]]];
      const [px, py] = kf(t, pK, ease.sine);
      const alone = es(t, 3.05, 3.4) * (1 - es(t, 4.5, 4.7));
      const deny = es(t, 6.05, 6.25) * (1 - es(t, 6.9, 7.05));
      const warm = es(t, 8.35, 8.6);
      peter.set({ x: px, y: py, s: 0.92, flip: t > 4.95 && t < 7.0, walk: moving(t, pK, 1) ? px * 0.06 : undefined, armF: 18 + deny * 60 + warm * 56, armB: 8 + deny * 70 + warm * 40, head: alone * 8 - deny * 8 * (T ? Math.sin(T * 8) : 1) + warm * 6, lean: warm * 4, blink: blinkAt(T, 3) });
      fade(pSad, alone + es(t, 6.9, 7.2) * 0.8);
      // the door: open for them, shut on Peter, open again
      const shut = es(t, 3.05, 3.35) * (1 - es(t, 4.4, 4.7));
      pose(G.door, { x: G.doorX, y: G.doorY, sx: 0.15 + shut * 0.85 });
      // the girl at the door
      const lift = es(t, 5.05, 5.3) * (1 - es(t, 6.9, 7.1));
      maid.set({ x: MX, y: YARD + 2, s: 0.86, flip: t < 4.9 || t > 7.2, armF: 50 + lift * 40, armB: 6, head: -lift * 5 + bump(t, 1.2, 1.9) * 6 + bump(t, 4.4, 4.8) * 8, lean: lift * 5, blink: blinkAt(T, 8) });
      pose(mFl, { x: 35, y: -16, sy: 1 + (T ? Math.sin(T * 7) * 0.1 : 0) });

      /* v18 — the servants light the fire and warm themselves */
      ring.forEach((d) => {
        const k = es(t, 7.05 + d.i * 0.08, 7.45 + d.i * 0.08);
        const come = es(t, 6.95 + d.i * 0.06, 7.4 + d.i * 0.06, ease.sine);
        const x = lerp(DOORX, d.x, come);
        d.p.set({ x, y: YARD + d.y, s: d.s ?? 0.94, o: es(t, 6.95 + d.i * 0.06, 7.05 + d.i * 0.06), flip: come > 0 && come < 1 ? x > d.x : d.f, walk: come > 0 && come < 1 ? x * 0.05 : undefined, armF: 16 + k * 58, armB: 6 + k * 34, head: k * 5, lean: k * 3, blink: blinkAt(T, d.seed) });
      });
      puffs.forEach((p) => {
        const d = RING[p.i];
        const [hx, hy] = headAt(d.x, YARD + d.y, d.s ?? 0.94, d.f);
        const u = T ? ((T * 0.5 + p.i * 0.27) % 1) : 0.4;
        vis(p.el, { x: hx + (d.f ? -22 : 22) + (d.f ? -u * 20 : u * 20), y: hy + 6 - u * 16, s: 0.6 + u * 0.9, o: fireK * (1 - u) * 0.8 });
      });

      /* words */
      const kn = es(t, 1.1, 1.4, ease.out) * (1 - es(t, 1.9, 2.1, ease.in));
      vis(known, { x: 110, y: 450 - (1 - kn) * 700, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: kn > 0.01 ? 1 : 0 });
      const [ohx, ohy] = headAt(ox, oy, 0.9, oBack);
      const tk = es(t, 4.4, 4.55, ease.back) * (1 - es(t, 4.75, 4.85));
      vis(talk, { x: ohx - 12, y: ohy - 20, s: tk, o: tk > 0.01 ? 1 : 0 });
      const [mhx, mhy] = headAt(MX, YARD + 2, 0.86, false);
      const ak = es(t, 5.12, 5.32, ease.back) * (1 - es(t, 5.9, 6.0));
      vis(ask, { x: mhx + 14, y: mhy - 18, s: ak, o: ak > 0.01 ? 1 : 0 });
      const nk = es(t, 6.1, 6.35, ease.out) * (1 - es(t, 6.95, 7.1, ease.in));
      vis(no, { x: PIN + 10, y: 440 - (1 - nk) * 700, r: T ? Math.sin(T * 1.1) * 2 : 0, o: nk > 0.01 ? 1 : 0 });
      const amk = es(t, 6.2, 6.45, ease.out) * (1 - es(t, 6.95, 7.1, ease.in));
      vis(am, { x: JXH, y: 300 - (1 - amk) * 700, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: amk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -1000], [1, -960], [1.9, -900], [2.9, -560], [3.05, -900], [4, -920], [4.9, -760], [6.05, -760], [6.2, -120], [6.95, -120], [7.1, -500], [8, -500], [9, -480]]);
      S.cam.y = kf(t, [[0, 120], [2, 110], [2.9, 40], [3.05, 120], [4.9, 130], [6.05, 130], [6.2, 40], [6.95, 40], [7.1, 120], [9, 120]]);
      S.cam.z = kf(t, [[0, 1.2], [2, 1.24], [2.9, 1.06], [3.05, 1.3], [4.9, 1.32], [5.1, 1.42], [6.05, 1.42], [6.2, 1.0], [6.95, 1.0], [7.1, 1.24], [9, 1.3]]);
    };
  },
};
