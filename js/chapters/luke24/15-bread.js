// Łk 24,30–32 — Inside the house at Emmaus, the lamp lit, the last of the sunset in the window. The three recline at
// the low table, the Stranger between them. He takes the bread, lifts it and blesses it (His eyes raised); He breaks
// it, and gives it to them — a half into each pair of hands. Their eyes are opened: the hood falls — it is the Lord, His halo full — and they start back in joy. And He vanishes from their sight:
// light where He sat, an empty cushion, the broken bread glowing on the table. They turn to each other — "Did not our
// hearts burn within us while He talked to us on the road, while He opened the Scriptures to us?" — two hearts
// burning, and above them the road with the three walkers and the scroll.
import { C, CAST, person, blinkAt, pose, lerp, mix, sheet } from './lib.js';
import { es, ease, bump, seg, fade } from './lib.js';
import {
  SUNSET, EVENING, emmausRoom, emmausTable, EM, CLEOPAS, FRIEND, STRANGER, withFace, faceBits, headAt, handAt, bodyAt, loaf, loafHalves,
  burningHeart, sparkle, iconCard, still, hangK, crowdPerson,
} from './lib.js';

const { SEAT, TABLE, JX, LX, RX } = EM;
const S1 = 1.3;

export default {
  id: 'lk24-bread',
  beats: [
    { v: 30, text: 'Gdy zajął z nimi miejsce u stołu, wziął chleb, odmówił błogosławieństwo,' },
    { v: 30, cont: true, text: 'połamał go i dawał im.' },
    { v: 31, text: 'Wtedy oczy im się otworzyły i poznali Go,' },
    { v: 31, cont: true, text: 'lecz On zniknął im z oczu.' },
    { v: 32 },
  ],
  cam: { x: [-20, 20], y: [-10, 70], z: [1, 1.2] },
  build(S) {
    const c = S.c;
    const R = emmausRoom(S, { skyCols: SUNSET, eveCols: EVENING });

    /* the place where He sat: light, an empty cushion */
    const back = S.layer({ par: 0.5, sh: 0, flat: true });
    const place = back.add(`<g opacity="0"><ellipse cx="0" cy="-90" rx="150" ry="170" fill="url(#halo-glow)"/></g>`);
    const PL = S.layer({ par: 0.5, sh: 5 });
    PL.add(`<g transform="translate(${JX} ${SEAT + 2})">${sheet().p(c.cut(c.ell(0, -8, 64, 14, 16), 0.5, 5), mix(C.terracotta, C.ochre, 0.4)).out()}</g>`);
    const mk = (o, P = 'sit') => { const el = PL.add(withFace(person(c, { ...o, pose: P }), faceBits(c))); return { el, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]') }; };
    const cl = mk(CLEOPAS), fr = mk(FRIEND);
    const st = mk(STRANGER);
    const stHalo = Array.from(st.el.querySelectorAll('.halo, .halo-glow'));
    const lord = mk(CAST.jesus);
    const tab = S.layer({ par: 0.52, sh: 5 });
    tab.add(`<g transform="translate(${JX} ${TABLE})">${emmausTable(c, 600)}</g>`);

    /* the bread */
    const fx = S.layer({ par: 0.54, sh: 5 });
    const whole = fx.add(`<g>${loaf(c, 24)}</g>`);
    const halves = loafHalves(c, 24);
    const hL = fx.add(`<g>${halves.left}</g>`), hR = fx.add(`<g>${halves.right}</g>`);
    const glowB = back.add(`<g opacity="0"><ellipse rx="70" ry="34" fill="url(#halo-glow)"/></g>`);
    const crumbs = fx.add(`<g>${sheet().p(c.cut(c.circ(-6, -2, 3, 6), 0.2, 2) + c.cut(c.circ(5, -1, 2.4, 6), 0.2, 2), C.wheat2).out()}</g>`);
    const bless = [0, 1, 2].map(() => fx.add(`<g>${sparkle(c, 9)}</g>`));
    const burst = [0, 1, 2, 3, 4, 5].map(() => fx.add(`<g>${sparkle(c, 11)}</g>`));
    const rise = [0, 1, 2, 3].map(() => fx.add(`<g>${sparkle(c, 12)}</g>`));
    const hearts = [0, 1].map(() => fx.add(`<g>${burningHeart(c, 18)}</g>`));
    const heartFl = hearts.map((h) => h.querySelector('.fl'));
    /* the memory of the road */
    const road = `<rect x="-52" y="-44" width="104" height="80" fill="${mix(C.dawn, C.sun, 0.25)}"/><path d="${c.cut([[-54, 18], [-20, 10], [20, 14], [54, 8], [54, 40], [-54, 40]], 0.5, 5)}" fill="${C.sage}"/><path d="${c.ribbon([[-54, 30], [54, 26]], 6)}" fill="${C.sand}"/>`
      + still(c, [{ x: -24, y: 30, s: 0.2, o: FRIEND, armF: 20 }, { x: 0, y: 31, s: 0.21, o: STRANGER, armF: 30, armB: 120 }, { x: 24, y: 30, s: 0.2, o: CLEOPAS, armF: 20 }])
      + `<path d="${c.cut(c.rect(-30, -38, 60, 16), 0.3, 4)}" fill="${C.parchment}"/><path d="${c.cut(c.rect(-34, -40, 5, 20), 0.2, 3) + c.cut(c.rect(29, -40, 5, 20), 0.2, 3)}" fill="${C.wood3}"/>`;
    const memory = fx.add(`<g>${iconCard(c, road, '', { w: 124, h: 116 })}</g>`);
    void crowdPerson;

    return (t, T) => {
      R.update(T, { lit: 1, sunY: lerp(420, 520, es(t, 0, 3)), dusk: es(t, 0.2, 3.0) * 0.85 });
      /* v30a: He takes the bread and blesses it */
      const take = es(t, 0.15, 0.45);
      const lift = es(t, 0.45, 0.75) * (1 - es(t, 1.05, 1.2));
      const brk = es(t, 1.08, 1.3);
      const give = es(t, 1.35, 1.75);
      const know = es(t, 2.05, 2.2);
      const gone = es(t, 3.05, 3.4);
      const aF = 20 + take * 40 + lift * 30 + give * 20 - know * 10;
      const aB = 14 + take * 40 + lift * 30 + give * 26;
      const J = { x: JX, y: SEAT, s: S1 + 0.02, armF: aF, armB: aB, head: -lift * 16 + give * 4, blink: lift > 0.3 ? 1 : blinkAt(T, 6) };
      st.p.set({ ...J, o: 1 - know });
      stHalo.forEach((h) => fade(h, 0.3));
      lord.p.set({ ...J, armF: aF + know * 20 * (1 - gone), armB: aB + know * 40, head: -know * 4, blink: blinkAt(T, 6), o: know * (1 - gone) });
      const [hx, hy] = handAt(JX, SEAT, J.s, false, aF, 'sit');
      const [bx, by] = [lerp(JX + 10, hx + 6, take), lerp(TABLE - 50, hy + 4, take)];
      pose(whole, { x: bx, y: by, o: 1 - seg(t, 1.1, 1.14) });
      pose(glowB, { x: bx, y: by - 8, s: 0.6 + lift * 0.4, o: lift * 0.7 });
      bless.forEach((el, i) => {
        const b = bump(t, 0.5 + i * 0.1, 1.0 + i * 0.05);
        pose(el, { x: bx - 26 + i * 26, y: by - 34 - (i % 2) * 14, s: b, r: T * 30, o: b });
      });
      /* v30b: breaks it and gives it to them */
      const [clhx, clhy] = handAt(LX, SEAT, S1, false, 60, 'sit');
      const [frhx, frhy] = handAt(RX, SEAT, S1, true, 60, 'sit');
      const lx = lerp(bx - brk * 14, clhx + 4, give), ly = lerp(by, clhy + 2, give) - Math.sin(give * Math.PI) * 30;
      const rx = lerp(bx + brk * 14, frhx - 4, give), ry = lerp(by, frhy + 2, give) - Math.sin(give * Math.PI) * 30;
      const onH = seg(t, 1.1, 1.14);
      pose(hL, { x: lx, y: ly, r: -brk * 12, o: onH });
      pose(hR, { x: rx, y: ry, r: brk * 12, o: onH });
      pose(crumbs, { x: JX + 6, y: TABLE - 49, o: brk });

      /* the two: receive; recognise; start back in joy; turn to each other */
      const recv = es(t, 1.5, 1.75);
      const joy = es(t, 2.05, 2.3) * (1 - es(t, 3.95, 4.2) * 0.5);
      const turn = es(t, 4.05, 4.25);
      [[cl, LX, false], [fr, RX, true]].forEach(([m, x, fl], i) => {
        const tw = turn > 0.5 ? !fl : fl;
        m.p.set({ x, y: SEAT + (i ? 2 : 0), s: S1, flip: fl, lean: -joy * 10, armF: 30 + recv * 30 * (1 - joy) + joy * 60 + turn * 10, armB: 16 + joy * 120 * (1 - turn * 0.6), head: -joy * 10 + turn * 4, blink: blinkAt(T, i * 3 + 1) });
        fade(m.sad, 0.25 * (1 - joy));
        /* v32: burning hearts */
        const hk = es(t, 4.1 + i * 0.1, 4.3 + i * 0.1, ease.back);
        const [cx, cy] = bodyAt(x, SEAT, S1, fl, 6, -100 + 62);
        pose(hearts[i], { x: cx, y: cy, s: hk, o: hk > 0.01 ? 1 : 0 });
        pose(heartFl[i], { x: 0, y: -8, sx: 1 + (T ? Math.sin(T * 7 + i) * 0.08 : 0), sy: 1 + (T ? Math.sin(T * 5.3 + i) * 0.12 : 0) });
        void tw;
      });
      burst.forEach((el, i) => {
        const b = bump(t, 2.05 + (i % 3) * 0.05, 2.6 + (i % 3) * 0.05);
        const [mhx, mhy] = headAt(i < 3 ? LX : RX, SEAT, S1, i >= 3, 62);
        pose(el, { x: mhx + ((i % 3) - 1) * 28, y: mhy - 30 - (i % 2) * 18, s: b, r: T * 30, o: b });
      });
      /* v31b: He vanishes from their sight */
      pose(place, { x: JX, y: SEAT, s: 0.6 + gone * 0.5, o: gone * (1 - es(t, 4.3, 4.8) * 0.5) });
      rise.forEach((el, i) => {
        const b = bump(t, 3.1 + i * 0.1, 3.8 + i * 0.1);
        pose(el, { x: JX - 40 + i * 28, y: SEAT - 90 - es(t, 3.1 + i * 0.1, 3.8 + i * 0.1) * 120, s: b, r: T * 30, o: b });
      });
      /* v32: the road and the Scriptures, remembered */
      const mk2 = es(t, 4.15, 4.45, ease.back);
      pose(memory, { x: JX, y: lerp(-1500, 330, mk2), s: 1.35, r: T ? Math.sin(T * 0.8) * mk2 : 0, oy: 0, o: mk2 > 0.002 ? 1 : 0 });

      S.cam.x = 0;
      S.cam.y = 58 - es(t, 4.0, 4.4) * 16;
      S.cam.z = (S.portrait ? 1.0 : 1.14) + es(t, 0.3, 1.0) * 0.04 * (1 - es(t, 4.0, 4.4));
    };
  },
};
