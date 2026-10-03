// Mk 6,21–26 — Herod's birthday banquet, still on the old sepia paper: the guests, the dance, the rash oath
// ("up to half of my kingdom" — a map torn in two), the girl running to her mother and back, and a sad king.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { paperLabel, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import {
  kf, moving, headAt, hand, speech, thought, GLYPH, spark, heart, coin, lowTable, bowl, loaf, cup, lantern, garland, tambourine,
  crown, helmet, circlet, faceBits, withFace, labelTag, platter, mapHalf, portrait, noble, storyFrame, SEPIA, LOOK, DY,
} from './lib.js';

const PI = Math.PI;
const Y = 700;
const SEAT = 664;
const ROOM = 430;   // Herodias' side room (door centre)

export default {
  id: 'm6-feast',
  enter: 'fly',
  beats: [
    { v: 21, text: 'Otóż chwila sposobna nadeszła,' },
    { v: 21, cont: true, text: 'kiedy Herod w dzień swoich urodzin wyprawił ucztę swym dostojnikom, dowódcom wojskowym i osobom znakomitym w Galilei.' },
    { v: 22, text: 'Gdy córka tej Herodiady weszła i tańczyła, spodobała się Herodowi i współbiesiadnikom.' },
    { v: 22, cont: true, text: 'Król rzekł do dziewczęcia: «Proś mię, o co chcesz, a dam ci».' },
    { v: 23 },
    { v: 24, text: 'Ona wyszła i zapytała swą matkę: «O co mam prosić?»' },
    { v: 24, cont: true, text: 'Ta odpowiedziała: «O głowę Jana Chrzciciela».' },
    { v: 25 },
    { v: 26 },
  ],
  cam: { x: [-320, 60], y: [0, 140], z: [1, 1.5] },
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
    // the partition and doorway of Herodias' room (left)
    Wl.p(c.cut([[240, 660], [240, 300], [520, 300], [520, 660]], 0.8, 10), mix(C.plaster2, C.dune, 0.45));
    Wl.p(c.cut([[ROOM - 60, 660], [ROOM - 60, 420], ...c.arc(ROOM, 420, 60, 50, PI, 2 * PI, 10), [ROOM + 60, 660]], 0.5, 8), mix(C.soilDark, C.plumRobe, 0.3));
    wall.add(Wl.out());
    const floor = S.layer({ par: 0.4, sh: 3 });
    floor.add(sheet().p(c.cut([[-1200, 650], [2800, 650], [2800, 1700], [-1200, 1700]], 0.6, 30), mix(C.stone, C.dune, 0.35)).out());

    /* ---------- lamps, garlands, the tags in the flies ---------- */
    const flies = S.layer({ par: 0.3, sh: 5 });
    flies.add(`<g transform="translate(560 190)">${garland(c, 480, 50)}</g>`);
    const lamps = [600, 800, 1000].map((x, i) => ({ x, y: 250 + (i % 2) * 20, el: hanging(flies, lantern(c, { col: [C.apricot, C.sun, C.apricot][i] }), { x, y: 250, len: 500 }), i }));
    const glows = lamps.map((l) => l.el.querySelector('.glow'));
    const bday = hanging(flies, `<g transform="scale(1.2)">${labelTag(tr('urodziny króla', 'the king’s birthday'), 22)}</g>`, { x: 0, y: 0, len: 600 });
    const half = [-1, 1].map((sd) => flies.add(`<g>${mapHalf(c, sd)}</g>`));
    const halfTag = hanging(flies, labelTag(tr('połowa królestwa', 'half of my kingdom'), 18), { x: 0, y: 0, len: 600 });
    const oath = hanging(flies, `${sheet().p(c.cut(c.rect(-40, 0, 80, 100), 0.5, 6), C.parchment).x(c.ribbon([[-26, 22], [26, 22]], 1.4) + c.ribbon([[-26, 36], [22, 36]], 1.4) + c.ribbon([[-26, 50], [26, 50]], 1.4) + c.ribbon([[-26, 64], [16, 64]], 1.4), C.ink, 'opacity=".5"').out()}<path d="${c.cut(c.circ(18, 86, 13, 16), 0.3, 3)}" fill="${C.terracotta}"/><g transform="translate(0 124)">${labelTag(tr('przysięga', 'the oath'), 17)}</g>`, { x: 0, y: 0, len: 600 });

    /* ---------- the guests behind the table ---------- */
    const back = S.layer({ par: 0.5, sh: 4 });
    const GUESTS = [
      { x: 560, i: 0 }, { x: 626, i: 1, helm: true }, { x: 692, i: 2 }, { x: 908, i: 3, helm: true }, { x: 974, i: 4 }, { x: 1040, i: 5 }, { x: 1106, i: 6, helm: true },
    ].map((g) => (S.portrait && g.x > 800 ? { ...g, x: 890 + (g.i - 3) * 55 } : g)).map((g) => {
      let m = person(c, { ...noble(c, g.i), pose: 'sit' });
      if (g.helm) m = withFace(m, helmet(c));
      return { ...g, from: g.x < 800 ? -300 : 1900, p: S.puppet(back.add(m)), seed: c.rr(0, 6) };
    });
    const hMark = (o) => withFace(withFace(person(c, o), crown(c)), faceBits(c));
    const herod = S.puppet(back.add(hMark({ ...LOOK.herod, pose: 'sit' })));
    const hSad = herod.el.querySelector('[data-part="sad"]');
    const table = S.layer({ par: 0.52, sh: 5 });
    table.add(`<g transform="translate(830 ${Y - 20})">${lowTable(c, 700, 44)}</g>`);
    const food = [
      [560, bowl(c, { food: 'fruit' })], [640, cup(c)], [700, loaf(c, 16)], [760, cup(c, C.sun)], [900, bowl(c, { food: 'stew' })], [960, loaf(c, 16)], [1030, cup(c)], [1100, bowl(c, { food: 'bread' })],
    ].map(([x, m], i) => ({ x, i, el: table.add(`<g>${m}</g>`) }));

    /* ---------- the dancer, her mother ---------- */
    const act = S.layer({ par: 0.56, sh: 5 });
    const herodias = S.puppet(act.add(withFace(withFace(person(c, LOOK.herodias), circlet(c)), faceBits(c))));
    const hdBrows = herodias.el.querySelector('[data-part="angry"]');
    const girl = S.puppet(act.add(person(c, { ...LOOK.girl, holdB: `<g transform="translate(0 6)">${tambourine(c)}</g>` })));
    const girlP = S.puppet(act.add(person(c, { ...LOOK.girl, holdF: `<g transform="translate(4 4) rotate(90)">${platter(c, { w: 80 })}</g>` })));
    const tamb = girl.el.querySelector('.hold');

    /* ---------- effects ---------- */
    const fx = S.layer({ par: 0.6, sh: 4 });
    const cheers = [0, 1, 2, 3, 4].map(() => fx.add(`<g>${spark(c, 9)}</g>`));
    const offer = fx.add(`<g>${speech(c, `<g transform="translate(-12 4)">${coin(c, 9)}</g><g transform="translate(6 -4)">${coin(c, 11)}</g><g transform="translate(18 8)">${coin(c, 8)}</g>`, { w: 80, h: 56, flip: false })}</g>`);
    const ask = fx.add(`<g>${speech(c, GLYPH.q(c), { w: 44, h: 42, flip: true })}</g>`);
    const answer = fx.add(`<g>${speech(c, `<g transform="translate(0 -36) scale(.34)">${portrait(c, S.id('jp'), LOOK.john, { w: 110, h: 130 })}</g>`, { w: 72, h: 74 })}</g>`);
    const want = fx.add(`<g>${speech(c, `<g transform="translate(0 -26) scale(.26)">${portrait(c, S.id('jp2'), LOOK.john, { w: 110, h: 130 })}</g><g transform="translate(0 22) scale(.62)">${platter(c, { w: 80 })}</g>`, { w: 84, h: 84, flip: true })}</g>`);
    const scheme = fx.add(`<g>${thought(c, `<g transform="scale(1)">${GLYPH.storm(c)}</g>`, { w: 60, h: 50 })}</g>`);
    const eyes = [0, 1, 2].map(() => fx.add(`<g>${GLYPH.q(c, C.ochre)}</g>`));
    const dim = S.layer({ par: 0, sh: 1, flat: true });
    dim.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#3a2a30"/>`);

    storyFrame(S);

    return (t, time) => {
      const T = time;
      const sadK = es(t, 8.05, 8.4);
      lamps.forEach((l) => swing(l.el, l.x, l.y, T, 1.4, 0.8, l.i));
      glows.forEach((g) => fade(g, 0.4 + es(t, 1.05, 1.4) * 0.6 - sadK * 0.5));
      dim.fade(sadK * 0.18);

      /* v21a — the day comes: the king's birthday; Herodias watches from her door */
      const bd = es(t, -0.2, 0.3, ease.back) * (1 - es(t, 1.9, 2.1));
      pose(bday, { x: 800, y: lerp(-500, 110, bd), r: Math.sin(T * 1.1) * 2, o: bd > 0.01 ? 1 : 0 });
      const hdX = kf(t, [[0, ROOM + 10], [5.05, ROOM + 10], [5.3, ROOM + 20]]);
      herodias.set({ x: hdX, y: Y - 38, s: 0.94, flip: t < 5.2, armF: bump(t, 6.05, 6.95) * 70, armB: bump(t, 0.3, 0.9) * 50, head: bump(t, 6.1, 6.9) * 10, blink: blinkAt(T, 4) });
      attr(hdBrows, 'opacity', (bump(t, 0.2, 1.0) + bump(t, 6.0, 7.0)).toFixed(2));
      const sc = es(t, 0.3, 0.5, ease.back) * (1 - es(t, 0.95, 1.05));
      const [hhx, hhy] = headAt(ROOM + 10, Y - 38, 0.94, true);
      pose(scheme, { x: hhx - 6, y: hhy - 22, s: sc, o: sc > 0.01 ? 1 : 0 });

      /* v21b — nobles, officers, the leading men of Galilee come to the table */
      GUESTS.forEach((g) => {
        const k = es(t, 1.05 + g.i * 0.06, 1.4 + g.i * 0.06);
        const clap = bump(t, 2.3 + g.i * 0.03, 3.0);
        const stare = es(t, 8.05, 8.3);
        g.p.set({ x: lerp(g.from, g.x, k), y: SEAT + (g.i % 2) * 4, s: 0.84, flip: g.x > 800 ? stare < 0.5 : stare > 0.5, bob: k > 0 && k < 1 ? -Math.abs(Math.sin(k * 20)) * 4 : 0, armF: 30 + clap * (40 + Math.sin(T * 12 + g.i) * 30) + bump(t, 1.5, 2.0) * (g.i % 2 ? 60 : 0), armB: clap * 50, head: -stare * 6, blink: blinkAt(T, g.seed) });
      });
      food.forEach((f) => {
        const k = es(t, 1.3 + f.i * 0.05, 1.5 + f.i * 0.05, ease.back);
        pose(f.el, { x: f.x, y: Y - 64, s: k, o: k > 0.01 ? 1 : 0 });
      });

      /* Herod at the head of the table */
      const pleased = bump(t, 2.2, 3.1);
      const speak = bump(t, 3.05, 3.95);
      const swear = bump(t, 4.05, 4.95);
      herod.set({ x: 800, y: SEAT - 4, s: 1.0, armF: 30 + pleased * 50 + speak * 70 + bump(t, 7.2, 7.9) * 30, armB: pleased * 30 + swear * 150, head: -speak * 6 + sadK * 16, lean: sadK * 5, blink: blinkAt(T, 1) });
      attr(hSad, 'opacity', (sadK + bump(t, 6.9, 7.9) * 0.6).toFixed(2));
      const of = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.9, 4.05));
      pose(offer, { x: 830, y: 470, s: of, o: of > 0.01 ? 1 : 0 });

      /* v23 — "up to half of my kingdom": the map tears in two */
      const mp = es(t, 4.05, 4.3, ease.back) * (1 - es(t, 4.9, 5.1));
      const tear = es(t, 4.4, 4.7);
      half.forEach((h, i) => pose(h, { x: 800 + (i ? 1 : -1) * tear * 40, y: lerp(-300, 330, mp) + tear * 10, r: (i ? 1 : -1) * tear * 8, o: mp > 0.01 ? 1 : 0 }));
      const ht = es(t, 4.5, 4.75, ease.back) * (1 - es(t, 4.9, 5.1));
      pose(halfTag, { x: 800, y: lerp(-400, 420, ht), r: Math.sin(T) * 2, o: ht > 0.01 ? 1 : 0 });

      /* the girl: dance → the king's word → out to her mother → back, in haste, with a platter */
      const gKeys = [[1.9, 1500], [2.3, 800], [5.05, 800], [5.4, ROOM + 90], [6.95, ROOM + 90], [7.3, 760]];
      const gx = kf(t, gKeys);
      const walking = moving(t, gKeys);
      const dance = es(t, 2.3, 2.4) * (1 - es(t, 3.0, 3.1));
      const turn = dance ? Math.sin(T * 3.2) : 0;
      const withPlatter = es(t, 7.0, 7.05);
      const gFlip = t < 2.3 ? true : dance > 0.5 ? turn < 0 : t > 5.05 && t < 5.45 ? true : t >= 5.45 && t < 6.95 ? true : t > 6.95 && t < 7.3 ? false : true;
      girl.set({ x: gx + turn * 30, y: Y + 40 + Math.abs(Math.sin(T * 3.2)) * -10 * dance, s: 0.92, flip: gFlip, o: 1 - withPlatter, walk: walking ? gx * 0.06 : undefined, armF: 30 + dance * (100 + Math.sin(T * 6.4) * 30) + bump(t, 5.6, 6.1) * 40, armB: 30 + dance * (150 + Math.cos(T * 6.4) * 20), head: dance * Math.sin(T * 3.2) * 10 - bump(t, 3.1, 3.9) * 8, lean: dance * Math.sin(T * 3.2) * 8, blink: blinkAt(T, 6) });
      if (tamb) tamb.setAttribute('opacity', (1 - es(t, 3.0, 3.2)).toFixed(2));
      girlP.set({ x: gx, y: Y + 40, s: 0.92, flip: t > 7.3 ? true : false, o: withPlatter, walk: walking ? gx * 0.08 : undefined, amt: 1.3, lean: walking ? 8 : 0, armF: 70 + es(t, 7.3, 7.5) * 10, blink: blinkAt(T, 6) });
      cheers.forEach((ch, i) => {
        const k = bump(t, 2.35 + i * 0.08, 3.05);
        pose(ch, { x: 800 + Math.cos(T * 1.6 + i * 1.26) * 110, y: 520 + Math.sin(T * 1.6 + i * 1.26) * 50, s: k * 0.8, r: T * 40, o: k > 0.02 ? 1 : 0 });
      });

      /* v24 — "What shall I ask?" … "The head of John the Baptizer." (a portrait, nothing more) */
      const [gxh, gyh] = headAt(ROOM + 90, Y + 40, 0.92, true);
      const qk = es(t, 5.4, 5.55, ease.back) * (1 - es(t, 5.95, 6.05));
      pose(ask, { x: gxh - 20, y: gyh - 24, s: qk, o: qk > 0.01 ? 1 : 0 });
      const ak = es(t, 6.15, 6.35, ease.back) * (1 - es(t, 6.9, 7.0));
      pose(answer, { x: hhx + 20, y: hhy - 24, s: ak, o: ak > 0.01 ? 1 : 0 });

      /* v25 — back to the king at once: "on a platter" */
      const wk = es(t, 7.35, 7.55, ease.back) * (1 - es(t, 7.95, 8.05));
      const [gx2, gy2] = headAt(760, Y + 40, 0.92, true);
      pose(want, { x: gx2 - 20, y: gy2 - 26, s: wk, o: wk > 0.01 ? 1 : 0 });

      /* v26 — the king is grieved; the oath and the guests hold him */
      const ok = es(t, 8.1, 8.4, ease.back);
      pose(oath, { x: 1010, y: lerp(-500, 250, ok), r: Math.sin(T * 0.9) * 2, o: ok > 0.01 ? 1 : 0 });
      eyes.forEach((e, i) => {
        const k = bump(t, 8.2 + i * 0.08, 9.0);
        const g = GUESTS[[1, 3, 5][i]];
        const [ex, ey] = headAt(g.x, SEAT, 0.84, false, DY.sit);
        pose(e, { x: ex, y: ey - 34, s: k * 0.8, o: k > 0.02 ? 1 : 0 });
      });

      S.cam.x = kf(t, [[0, S.portrait ? -320 : -140], [0.9, S.portrait ? -320 : -140], [1.3, 0],   // phone: Herodias at her door in sight
         [5.0, 0], [5.4, -300], [7.0, -300], [7.4, 0]]);
      S.cam.z = kf(t, [[0, 1.38], [1.3, 1.32], [2.2, 1.36], [5.0, 1.36], [5.4, 1.44], [7.0, 1.44], [7.4, 1.38], [8.3, 1.46]]);
      S.cam.y = kf(t, [[0, 110], [1.3, 100], [5.4, 130], [7.0, 130], [7.4, 110], [8.3, 130]]);
    };
  },
};
