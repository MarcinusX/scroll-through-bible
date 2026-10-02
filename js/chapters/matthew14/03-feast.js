// Mt 14,6–9 — Herod's birthday, still on sepia paper: the daughter of Herodias dances before the guests and the king
// is delighted; he swears an oath (a sealed sheet comes down) to give her whatever she asks. Prompted by her mother at
// the door, she asks for John's head on a platter. The king is grieved — the hall dims — but for the oath and for his
// guests, who all stare at him, he gives the order: a guard steps forward.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, fade, attr } from '../../core/anim.js';
import {
  kf, moving, headAt, speech, thought, GLYPH, spark, coin, lowTable, bowl, loaf, cup, lantern, garland, tambourine,
  crown, helmet, circlet, faceBits, withFace, labelTag, platter, portrait, noble, storyFrame, SEPIA, L6, DY, oathSheet, tr, PI,
} from './lib.js';

const Y = 700;
const SEAT = 664;
const ROOM = 470;   // Herodias' door

export default {
  id: 'mt14-feast',
  enter: 'fly',
  beats: [
    { v: 6 },
    { v: 7 },
    { v: 8 },
    { v: 9, text: 'Zasmucił się król.' },
    { v: 9, cont: true, text: 'Lecz przez wzgląd na przysięgę i na współbiesiadników kazał jej dać.' },
  ],
  cam: { x: [-230, 60], y: [0, 180], z: [1, 1.6] },
  build(S) {
    const c = S.c;
    sky(S, [mix(SEPIA.sky[0], C.duskViolet, 0.25), SEPIA.sky[1], SEPIA.sky[2]]);

    /* ---------- the hall ---------- */
    const wall = S.layer({ par: 0.2, sh: 3 });
    const Wl = sheet();
    Wl.p(c.cut([[-1200, -1200], [2800, -1200], [2800, 660], [-1200, 660]], 1, 30), mix(C.plaster, C.dune, 0.35));
    let panels = '';
    for (let x = 560; x < 1400; x += 150) panels += c.cut(c.rect(x, 220, 110, 300), 0.5, 8);
    Wl.x(panels, mix(C.dune, C.plumRobe, 0.12), 'opacity=".5"');
    Wl.p(c.cut([[-1200, 150], [2800, 150], [2800, 176], [-1200, 176]], 0.4, 20), mix(C.plumRobe, C.dune, 0.45));
    Wl.p(c.cut([[ROOM - 90, 660], [ROOM - 90, 330], [ROOM + 90, 330], [ROOM + 90, 660]], 0.8, 10), mix(C.plaster2, C.dune, 0.45));
    Wl.p(c.cut([[ROOM - 55, 660], [ROOM - 55, 450], ...c.arc(ROOM, 450, 55, 46, PI, 2 * PI, 10), [ROOM + 55, 660]], 0.5, 8), mix(C.soilDark, C.plumRobe, 0.3));
    wall.add(Wl.out());
    const floor = S.layer({ par: 0.4, sh: 3 });
    floor.add(sheet().p(c.cut([[-1200, 650], [2800, 650], [2800, 1700], [-1200, 1700]], 0.6, 30), mix(C.stone, C.dune, 0.35)).out());

    /* ---------- lamps, garland, the tags and the oath in the flies ---------- */
    const flies = S.layer({ par: 0.3, sh: 5 });
    flies.add(`<g transform="translate(600 190)">${garland(c, 480, 50)}</g>`);
    const lamps = [640, 820, 1000].map((x, i) => ({ x, y: 250 + (i % 2) * 20, el: hanging(flies, lantern(c, { col: [C.apricot, C.sun, C.apricot][i] }), { x, y: 250, len: 500 }), i }));
    const glows = lamps.map((l) => l.el.querySelector('.glow'));
    const bday = hanging(flies, `<g transform="scale(1.2)">${labelTag(tr('urodziny Heroda', 'Herod’s birthday'), 22)}</g>`, { x: 0, y: 0, len: 600 });
    const oath = hanging(flies, `${oathSheet(c)}<g transform="translate(0 132)">${labelTag(tr('przysięga', 'the oath'), 18)}</g>`, { x: 0, y: 0, len: 600 });

    /* ---------- the guests behind the table ---------- */
    const back = S.layer({ par: 0.5, sh: 4 });
    const GUESTS = [
      { x: 580, i: 0 }, { x: 646, i: 1, helm: true }, { x: 712, i: 2 }, { x: 900, i: 3, helm: true }, { x: 966, i: 4 }, { x: 1032, i: 5 }, { x: 1098, i: 6, helm: true },
    ].map((g) => {
      let m = person(c, { ...noble(c, g.i), pose: 'sit' });
      if (g.helm) m = withFace(m, helmet(c));
      return { ...g, p: S.puppet(back.add(m)), seed: c.rr(0, 6) };
    });
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herod = S.puppet(back.add(hMark({ ...L6.herod, pose: 'sit' })));
    const hSad = herod.el.querySelector('[data-part="sad"]');
    const table = S.layer({ par: 0.52, sh: 5 });
    table.add(`<g transform="translate(840 ${Y - 20})">${lowTable(c, 660, 44)}</g>`);
    [[580, bowl(c, { food: 'fruit' })], [650, cup(c)], [710, loaf(c, 16)], [770, cup(c, C.sun)], [900, bowl(c, { food: 'stew' })], [960, loaf(c, 16)], [1030, cup(c)], [1100, bowl(c, { food: 'bread' })]]
      .forEach(([x, m]) => table.add(`<g transform="translate(${x} ${Y - 64})">${m}</g>`));

    /* ---------- the dancer, her mother, the guard ---------- */
    const act = S.layer({ par: 0.56, sh: 5 });
    const herodias = S.puppet(act.add(withFace(withFace(person(c, L6.herodias), circlet(c)), faceBits(c))));
    const hdBrows = herodias.el.querySelector('[data-part="angry"]');
    const girl = S.puppet(act.add(person(c, { ...L6.girl, holdB: `<g transform="translate(0 6)">${tambourine(c)}</g>` })));
    const tamb = girl.el.querySelector('.hold');
    const guard = S.puppet(act.add(withFace(person(c, { ...L6.guard, robe: mix(C.storm2, C.clay, 0.2) }), helmet(c))));

    /* ---------- effects ---------- */
    const fx = S.layer({ par: 0.6, sh: 4 });
    const cheers = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${spark(c, 9)}</g>`));
    const offer = fx.add(`<g>${speech(c, `<g transform="translate(-18 4)">${coin(c, 9)}</g><g transform="translate(-2 -4)">${coin(c, 11)}</g><g transform="translate(20 -2) scale(.9)">${crown(c)}</g>`, { w: 84, h: 56, flip: true })}</g>`);
    const prompt = fx.add(`<g>${speech(c, `<g transform="translate(0 -30) scale(.3)">${portrait(c, S.id('jp1'), L6.john, { w: 110, h: 130 })}</g>`, { w: 60, h: 62, flip: false })}</g>`);
    const want = fx.add(`<g>${speech(c, `<g transform="translate(0 -30) scale(.28)">${portrait(c, S.id('jp2'), L6.john, { w: 110, h: 130 })}</g><g transform="translate(0 24) scale(.66)">${platter(c, { w: 80 })}</g>`, { w: 88, h: 88, flip: false })}</g>`);
    const eyes = [0, 1, 2, 3].map(() => fx.add(`<g>${GLYPH.q(c, C.ochre)}</g>`));
    const dim = S.layer({ par: 0, sh: 1, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#3a2a30"/>`);

    storyFrame(S);

    return (t, time) => {
      const T = time;
      const sadK = es(t, 3.05, 3.4);
      lamps.forEach((l) => swing(l.el, l.x, l.y, T, 1.4, 0.8, l.i));
      glows.forEach((g) => fade(g, 1 - sadK * 0.5));
      dim.fade(sadK * 0.18);

      /* v6 — the birthday; the daughter of Herodias dances; Herod is delighted */
      const bd = es(t, -0.2, 0.2, ease.back) * (1 - es(t, 0.9, 1.1));
      pose(bday, { x: 800, y: lerp(-500, 110, bd), r: Math.sin(T * 1.1) * 2, o: bd > 0.01 ? 1 : 0 });
      const GX = 690;
      const gKeys = [[-0.1, 1500], [0.25, GX]];
      const gx = kf(t, gKeys);
      const dance = es(t, 0.25, 0.32) * (1 - es(t, 0.95, 1.05));
      const turn = dance ? Math.sin(T * 3.2) : 0;
      const toMum = es(t, 2.05, 2.15) * (1 - es(t, 2.4, 2.5));
      const bow = bump(t, 1.4, 1.95);
      const ask = bump(t, 2.45, 2.98);
      girl.set({ x: gx + turn * 30, y: Y + 40 - Math.abs(Math.sin(T * 3.2)) * 10 * dance, s: 0.92, flip: dance > 0.5 ? turn < 0 : toMum > 0.5 || t < 0.25, walk: moving(t, gKeys) ? gx * 0.06 : undefined, armF: 30 + dance * (100 + Math.sin(T * 6.4) * 30) + ask * 60, armB: 30 + dance * (150 + Math.cos(T * 6.4) * 20) + ask * 30, head: dance * Math.sin(T * 3.2) * 10 + bow * 14 - ask * 6, lean: dance * Math.sin(T * 3.2) * 8 + bow * 10, blink: blinkAt(T, 6) });
      if (tamb) tamb.setAttribute('opacity', (1 - es(t, 0.95, 1.1)).toFixed(2));
      cheers.forEach((ch, i) => {
        const k = bump(t, 0.3 + i * 0.08, 1.0);
        pose(ch, { x: GX + Math.cos(T * 1.6 + i * 1.26) * 110, y: 520 + Math.sin(T * 1.6 + i * 1.26) * 50, s: k * 0.8, r: T * 40, o: k > 0.02 ? 1 : 0 });
      });

      /* the guests clap, then stare at the king */
      GUESTS.forEach((g) => {
        const clap = bump(t, 0.35 + g.i * 0.03, 1.0);
        const stare = es(t, 4.05, 4.3);
        g.p.set({ x: g.x, y: SEAT + (g.i % 2) * 4, s: 0.84, flip: g.x > 800, armF: 30 + clap * (40 + Math.sin(T * 12 + g.i) * 30), armB: clap * 50, head: -stare * 6, blink: blinkAt(T, g.seed) });
      });

      /* Herod: pleased → swears → grieved → orders */
      const pleased = bump(t, 0.3, 1.1);
      const swear = bump(t, 1.05, 1.95);
      const order = es(t, 4.4, 4.65);
      herod.set({ x: 820, y: SEAT - 4, s: 1.0, armF: 30 + pleased * 50 + swear * 40 + order * 60, armB: pleased * 30 + swear * 150, head: -swear * 4 + sadK * 16 * (1 - order * 0.6), lean: sadK * 5, blink: blinkAt(T, 1) });
      attr(hSad, 'opacity', (sadK + bump(t, 2.5, 3.0) * 0.6).toFixed(2));
      const of = es(t, 1.2, 1.4, ease.back) * (1 - es(t, 1.9, 2.05));
      pose(offer, { x: 790, y: 470, s: of, o: of > 0.01 ? 1 : 0 });
      const ok = es(t, 1.15, 1.45, ease.back) * (1 - es(t, 1.95, 2.15)) + es(t, 4.05, 4.35, ease.back);
      pose(oath, { x: 970, y: lerp(-500, 240, Math.min(1, ok)), r: Math.sin(T * 0.9) * 2, o: ok > 0.01 ? 1 : 0 });

      /* v8 — prompted by her mother: "Give me here on a platter the head of John the Baptist" */
      const hdK = es(t, 1.9, 2.1);
      herodias.set({ x: ROOM + 10, y: Y - 38, s: 0.94, o: hdK, armF: bump(t, 2.05, 2.5) * 80, armB: bump(t, 2.05, 2.5) * 30, head: bump(t, 2.05, 2.5) * 6, blink: blinkAt(T, 4) });
      attr(hdBrows, 'opacity', bump(t, 2.0, 2.6).toFixed(2));
      const [mx, my] = headAt(ROOM + 10, Y - 38, 0.94, false);
      const pk = es(t, 2.08, 2.2, ease.back) * (1 - es(t, 2.42, 2.5));
      pose(prompt, { x: mx + 18, y: my - 20, s: pk, o: pk > 0.01 ? 1 : 0 });
      const [gx2, gy2] = headAt(GX, Y + 40, 0.92, false);
      const wk = es(t, 2.5, 2.65, ease.back) * (1 - es(t, 2.95, 3.05));
      pose(want, { x: gx2 + 22, y: gy2 - 26, s: wk, o: wk > 0.01 ? 1 : 0 });

      /* v9b — for the oath and the guests: everyone's eyes on him; he orders it given */
      eyes.forEach((e, i) => {
        const k = bump(t, 4.1 + i * 0.06, 4.95);
        const g = GUESTS[[0, 2, 4, 6][i]];
        const [ex, ey] = headAt(g.x, SEAT, 0.84, g.x > 800, DY.sit);
        pose(e, { x: ex, y: ey - 36, s: k * 0.8, o: k > 0.02 ? 1 : 0 });
      });
      const gIn = es(t, 4.4, 4.75);
      const gxx = lerp(1500, 1000, gIn);
      guard.set({ x: gxx, y: Y + 46, s: 0.94, flip: true, o: gIn > 0 ? 1 : 0, walk: gIn > 0 && gIn < 1 ? gxx * 0.05 : undefined, head: es(t, 4.75, 4.9) * 12, lean: es(t, 4.75, 4.9) * 8, armF: 20, blink: blinkAt(T, 5) });

      // phone: further left, and held through v8, so her mother at the door stays in the picture while she asks
      S.cam.x = kf(t, S.portrait ? [[0, 0], [1.9, 0], [2.2, -220], [2.85, -220], [3.2, 0]] : [[0, 0], [1.9, 0], [2.2, -90], [2.45, -90], [2.7, 0]]);
      S.cam.z = kf(t, [[0, 1.42], [1.0, 1.44], [1.4, 1.46], [2.2, 1.5], [2.7, 1.48], [3.3, 1.56], [4.0, 1.56], [4.4, 1.44]]);
      S.cam.y = kf(t, [[0, 150], [1.4, 150], [2.2, 160], [3.3, 170], [4.4, 150]]);
    };
  },
};
