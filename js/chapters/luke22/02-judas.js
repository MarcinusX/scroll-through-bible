// Łk 22,3–6 — night falling on the chief priests' chamber. Judas, one of the Twelve, stands in the dark doorway; above
// him hangs the gold ring of the Twelve. "Satan entered into Judas" — never a figure: thin curls of shadow slip out of
// the night and into him, his bead on the ring goes dark, his shadow on the wall grows long. He comes in to the chief
// priests and the captain of the guard and points at the little figure on their table; they are glad and hand him a
// purse; he nods — and from then on he watches (a round picture: the Master always among the crowd, and one night
// walking out alone with His friends).
import { es, ease, bump, seg } from '../../core/anim.js';
import { person as person_ } from '../kit.js';
import {
  chamberL, table, priest, priestOpts, highPriest, HP, captain, CAPTAIN, shadowPerson, hangingLamp, lampGlow, pawn, TW, twelveRing, shadowWisp,
  kf, moving, hand, headAt, withFace, faceBits, purse, coin, vignette, discPlate, miniJesus, miniMan, speech, say, hanging, swing, vis, pose, fade,
  lerp, mix, shade, sheet, blinkAt, tr, C, PI,
} from './lib.js';

export default {
  id: 'lk22-judas',
  beats: [
    { v: 3 },
    { v: 4 },
    { v: 5 },
    { v: 6 },
  ],
  cam: { x: [-180, 60], y: [-40, 120], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const P = S.portrait;
    const R = chamberL(S, P ? { ctop: 80 } : {});   // phone: the ceiling a beam across the wall
    const { FLOOR, DOOR } = R;
    const TOP = FLOOR - 100, TX = 880;

    // the wisps of shadow come from the night behind the door
    const wispL = S.layer({ par: 0.56, sh: 0, flat: true });
    const wisps = [0, 1, 2].map((i) => ({ i, el: wispL.add(`<g>${shadowWisp(c, 130 - i * 20)}</g>`) }));

    const SH = '#2a2034';
    const cast = [
      { k: 'pr1', o: priestOpts(1), m: () => withFace(priest(c, 1), faceBits(c)), x: 800, y: FLOOR - 26, s: 0.94 },
      { k: 'hp', o: HP, m: () => withFace(highPriest(c), faceBits(c)), x: 955, y: FLOOR - 26, s: 0.98 },
      { k: 'cap', o: CAPTAIN, m: () => withFace(captain(c), faceBits(c)), x: P ? 1030 : 1110, y: FLOOR + 8, s: 1.0, front: true },
    ];
    cast.forEach((m) => {
      m.seed = c.rr(0, 9);
      m.sh = S.puppet(R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".15">${shadowPerson(c, m.o, SH)}</g>`).firstElementChild);
    });
    const jShG = R.shadows.add(`<g clip-path="url(#${R.clipId})" opacity=".2">${shadowPerson(c, TW.judas, SH)}</g>`);
    const jSh = S.puppet(jShG.firstElementChild);

    const lampL = S.layer({ par: 0.44, sh: 3 });
    const lampGl = lampL.add(lampGlow(TX, 330));
    const lampEl = hanging(lampL, `<g transform="translate(-6 0)">${hangingLamp(c)}</g>`, { x: TX, y: 330, len: 100 });
    const lampFl = lampEl.querySelector('.flame');

    const back = S.layer({ par: 0.5, sh: 5 });
    cast.filter((m) => !m.front).forEach((m) => { m.el = back.add(m.m()); m.p = S.puppet(m.el); });
    const tabL = S.layer({ par: 0.52, sh: 6 });
    tabL.add(`<g transform="translate(${TX} ${FLOOR})">${table(c, 330, 100)}</g>`);
    tabL.add(`<g transform="translate(${TX - 30} ${TOP + 1})">${pawn(c)}</g>`);
    const front = S.layer({ par: 0.56, sh: 5 });
    cast.filter((m) => m.front).forEach((m) => { m.el = front.add(m.m()); m.p = S.puppet(m.el); });
    cast.forEach((m) => { m.angry = m.el.querySelector('[data-part="angry"]'); });
    const jEl = front.add(withFace(person_(c, TW.judas), faceBits(c)));
    const judas = S.puppet(jEl);
    const jBrow = jEl.querySelector('[data-part="angry"]'), jSad = jEl.querySelector('[data-part="sad"]');
    // a dark veil over Judas while the shadow enters (his own dark copy, faded in)
    const jDarkG = front.add(`<g opacity="0">${shadowPerson(c, TW.judas, '#2a2236')}</g>`);
    const jDark = S.puppet(jDarkG.firstElementChild);

    const fx = S.layer({ par: 0.56, sh: 4 });
    const RING = twelveRing(c, 56);
    const ring = hanging(fx, RING.markup, { x: 0, y: -1500, len: 700 });
    const jd = ring.querySelector('.jd');
    const nameT = fx.add(`<g>${say(c, tr('jeden z Dwunastu', 'one of the Twelve'), { size: 18, side: 1, fill: mix(C.cream, C.stone2, 0.3) })}</g>`);
    const howB = fx.add(`<g>${speech(c, `<g transform="translate(-14 14)">${miniJesus(c, 0.8)}</g><path d="${c.ribbon([[6, -4], [26, -4]], 3) + c.poly([[24, -12], [36, -4], [24, 4]])}" fill="${C.inkSoft}"/><g transform="translate(18 16) scale(.62)">${miniMan(c, mix(C.storm, C.stone2, 0.4), C.skin3)}</g>`, { w: 84, h: 56 })}</g>`);
    const purseEl = fx.add(`<g>${purse(c)}</g>`);
    const coins = Array.from({ length: 6 }, (_, i) => ({ i, el: fx.add(`<g>${coin(c, 7)}</g>`), dx: c.rr(-40, 40) }));
    const nod = fx.add(`<g>${speech(c, `<path d="${c.ribbon([[-14, 0], [-4, 10], [16, -12]], 4)}" fill="${C.moss}"/>`, { w: 56, h: 40, flip: true })}</g>`);
    // what he watches for: the Master always among the people … one night alone with His friends
    const scenePlate = (() => {
      const r = 74;
      const crowdM = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * PI * 2; return `<g transform="translate(${(Math.cos(a) * 44).toFixed(1)} ${(22 + Math.sin(a) * 12).toFixed(1)})">${miniMan(c, [C.dustyBlue, C.roseRobe, C.wheatRobe, C.sageRobe, C.mauve, C.ochreRobe][i % 6], [C.skin, C.skin2, C.skin3][i % 3], 0.7)}</g>`; }).join('');
      const few = [-40, -24, 22, 38].map((x, i) => `<g transform="translate(${x} 24)">${miniMan(c, [C.dustyBlue, C.wheatRobe, C.mauve, C.tealRobe][i], C.skin2, 0.66)}</g>`).join('');
      return discPlate(c, `<g class="day"><rect x="${-r}" y="${-r}" width="${2 * r}" height="${2 * r}" fill="${mix(C.skyBlue, C.cream, 0.4)}" opacity="0"/>${crowdM}</g><g class="night" opacity="0"><path d="${c.cut(c.circ(0, 0, r - 2, 30), 0.3, 4)}" fill="${mix(C.night, C.indigo, 0.4)}"/><circle cx="36" cy="-38" r="9" fill="${C.moon}"/>${few}</g><g transform="translate(0 22)">${miniJesus(c, 0.84)}</g>`, { r, rim: C.stone2, fill: C.parchment });
    })();
    const watch = hanging(fx, scenePlate, { x: 0, y: -1500, len: 700 });
    const wDay = watch.querySelector('.day'), wNight = watch.querySelector('.night');
    S.layer({ par: 0.6, sh: 0, flat: true }).add(vignette(S, { cx: 760, cy: 500, r: 760, o: 0.34 }));

    return (t, time) => {
      const T = time;
      const night = es(t, 0, 3.8);
      R.sky.blend(['#343a6e', '#6d5f8a', '#b88592'], ['#1c2148', '#2e3566', '#4d4f7c'], night);
      R.stars.fade(0.6 + night * 0.4);
      R.crowd.fade(0);
      swing(lampEl, TX, 330, T, 1, 0.8);
      pose(lampFl, { x: 32, y: 36, sx: 1 + (T ? Math.sin(T * 7) * 0.08 : 0), sy: 1 + (T ? Math.sin(T * 5.3) * 0.12 : 0) });
      fade(lampGl, 0.8 - night * 0.2);

      /* v3 — Judas in the doorway; the shadow enters him */
      const enter = es(t, 0.25, 0.75);
      const JD = 470;        // in the doorway (parallax-corrected)
      const jK = [[-0.3, [JD, FLOOR + 8]], [1.05, [JD, FLOOR + 8]], [1.5, [650, FLOOR + 8]]];
      const [jx, jy] = kf(t, jK, ease.sine);
      const jw = moving(t, jK, 1);
      const take = es(t, 2.35, 2.55);
      const pointK = es(t, 1.55, 1.75) * (1 - es(t, 2.05, 2.2));
      const nodK = bump(t, 3.1, 3.5);
      const jArm = 14 + pointK * 70 + take * 44 * (1 - es(t, 3.0, 3.2)) + es(t, 3.0, 3.2) * 16;
      const jHead = enter * 10 * (1 - es(t, 1.0, 1.2)) + nodK * 14 - es(t, 3.5, 3.8) * 6;
      judas.set({ x: jx, y: jy, s: 1.0, flip: false, walk: jw ? jx * 0.05 : undefined, armF: jArm, armB: 8 + bump(t, 1.55, 2.1) * 20, head: jHead, blink: blinkAt(T, 2) });
      fade(jBrow, es(t, 0.55, 0.8) * (1 - es(t, 2.3, 2.5) * 0.6) + es(t, 3.4, 3.7) * 0.6);
      fade(jSad, 0);
      jDark.set({ x: jx, y: jy, s: 1.0, flip: false, armF: jArm, armB: 8, head: jHead });
      fade(jDarkG, bump(t, 0.45, 1.1) * 0.55);
      jSh.set({ x: jx + 40 + (jx - TX) * 0.3, y: 700, s: 1.2 + enter * 0.3 + night * 0.1, flip: false, armF: jArm, head: jHead });
      fade(jShG, 0.12 + enter * 0.14);
      wisps.forEach((w) => {
        const k = es(t, 0.2 + w.i * 0.12, 0.8 + w.i * 0.12, ease.in);
        const x = lerp(JD - 40 + w.i * 30, jx + 4, k) + Math.sin(k * 5 + w.i) * 26 * (1 - k);
        const y = lerp(470 + w.i * 20, jy - 118, k) + Math.sin(k * 7 + w.i * 2) * 16 * (1 - k);
        vis(w.el, { x, y, s: 1 - k * 0.7, r: -20 + w.i * 20 + k * 30, o: k > 0.001 && k < 0.999 ? 1 : 0 });
      });
      const rIn = es(t, 0.05, 0.4, ease.out) * (1 - es(t, 0.95, 1.2, ease.in));
      vis(ring, { x: 660, y: 390 - (1 - rIn) * 700, r: T ? Math.sin(T * 0.8) * 2 : 0, o: rIn > 0.01 ? 1 : 0 });
      fade(jd, es(t, 0.5, 0.7));
      const nt = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      const [jhx, jhy] = headAt(jx, jy, 1.0, false);
      vis(nameT, { x: jhx + 20, y: jhy - 34, s: nt * 0.9, o: nt > 0.01 ? 1 : 0 });

      /* v4 — he goes in to the chief priests and the captains: how to hand Him over */
      const listen = es(t, 1.4, 1.7);
      const glad = es(t, 2.05, 2.3) * (1 - es(t, 3.1, 3.4));
      const hb = es(t, 1.62, 1.82, ease.back) * (1 - es(t, 2.0, 2.1));
      vis(howB, { x: jhx + 26, y: jhy - 22, s: hb, o: hb > 0.01 ? 1 : 0 });
      cast.forEach((m) => {
        let armF = 14 + listen * 10, armB = 6, head = listen * 6, lean = listen * 4;
        if (m.k === 'hp') { armF = 20 + take * 50 * (1 - es(t, 2.9, 3.1)) + glad * 20; armB = 10 + glad * 120; head = head - glad * 10; }
        else if (m.k === 'cap') { armF = 14 + glad * 40; armB = 20 + listen * 10; head = head - glad * 6; }
        else { armF += glad * 60; armB += glad * 110; head -= glad * 12; }
        const bob = T ? -glad * Math.abs(Math.sin(T * 6 + m.seed)) * 4 : 0;
        m.p.set({ x: m.x, y: m.y, s: m.s, flip: true, armF, armB, head, lean, bob, blink: blinkAt(T, m.seed) });
        fade(m.angry, listen * (1 - glad) * 0.5);
        m.sh.set({ x: m.x + (m.x - TX) * 0.5 + 30, y: 700, s: m.s * 1.2, flip: true, armF, armB, head });
      });

      /* v5 — glad; the purse passes from the high priest's hand into his */
      const [hpx, hpy] = hand(955, FLOOR - 26, 0.98, true, 20 + take * 50 * (1 - es(t, 2.9, 3.1)) + glad * 20);
      const [jhx2, jhy2] = hand(jx, jy, 1.0, false, jArm);
      const pin = es(t, 2.12, 2.3);
      const hold = es(t, 2.4, 2.58);
      vis(purseEl, { x: lerp(hpx, jhx2, hold), y: lerp(hpy, jhy2, hold) - 4, s: pin, r: T ? Math.sin(T * 2) * 4 : 0, o: pin > 0.01 ? 1 : 0 });
      coins.forEach((k) => {
        const u = seg(t, 2.2 + k.i * 0.06, 2.5 + k.i * 0.06);
        vis(k.el, { x: lerp(hpx, hpx + k.dx, u), y: hpy - Math.sin(u * PI) * 70, r: u * 400, o: u > 0 && u < 1 ? 1 : 0 });
      });

      /* v6 — he consents; and watches for his chance, away from the crowd */
      const nk = es(t, 3.08, 3.25, ease.back) * (1 - es(t, 3.4, 3.5));
      vis(nod, { x: jhx - 6, y: jhy - 26, s: nk, o: nk > 0.01 ? 1 : 0 });
      const wIn = es(t, 3.3, 3.6, ease.out);
      vis(watch, { x: 700, y: 340 - (1 - wIn) * 700, r: T ? Math.sin(T * 0.7) * 1.5 : 0, o: wIn > 0.01 ? 1 : 0 });
      const alone = es(t, 3.6, 3.85);
      fade(wDay, 1 - alone);
      fade(wNight, alone);

      S.cam.x = kf(t, [[-0.3, P ? -170 : -130], [1.0, P ? -160 : -120], [1.5, -10], [3.2, 10], [3.6, P ? -10 : -40]]);
      S.cam.z = kf(t, [[-0.3, 1.1], [0.6, 1.22], [1.0, 1.22], [1.5, 1.1], [2.2, 1.14], [3.2, 1.14], [3.6, 1.18]]);
      S.cam.y = kf(t, [[-0.3, 40], [0.6, 80], [1.0, 80], [1.5, 50], [3.6, 30]]);
    };
  },
};
