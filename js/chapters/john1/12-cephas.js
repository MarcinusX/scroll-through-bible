// J 1,40–42 — Evening at the camp by the river. One of the two was Andrew, brother of Simon Peter; he runs first
// to his brother, mending nets by the fire: "We have found the Messiah!" (the Christ). He brings him to Jesus.
// Jesus looks at him — "You are Simon, son of John" — and a great rock rises behind him: "you shall be Cephas" —
// the name tag turns over: Peter.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, sheet, shade, mix, attr } from '../kit.js';
import { band, olive, cypress, grass, rock, stars } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { doorHouse, nameTag, bubble, hungPlate, iconWord, crown, oilHorn, namedRock, glowDisc, headAt, hand, tent, PI } from './lib.js';
import { netDrape } from '../mark1/lib.js';
import { firePit, fireFlames } from '../mark14/lib.js';

const GY = 700, PY = 768, JX = 800;

export default {
  id: 'j1-cephas',
  beats: [
    { v: 40 },
    { v: 41, text: 'Ten spotkał najpierw swego brata i rzekł do niego:' },
    { v: 41, cont: true, text: '«Znaleźliśmy Mesjasza» - to znaczy: Chrystusa.' },
    { v: 42, text: 'I przyprowadził go do Jezusa.' },
    { v: 42, cont: true, text: 'A Jezus wejrzawszy na niego rzekł: «Ty jesteś Szymon, syn Jana,' },
    { v: 42, cont: true, text: 'ty będziesz nazywał się Kefas» - to znaczy: Piotr.' },
  ],
  cam: { x: [-40, 180], y: [-40, 30], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const DUSK = ['#9a8fb3', '#e3a88f', '#f2cfa6'];
    const sk = sky(S, DUSK);
    const st = S.layer({ par: 0.02, sh: 1, flat: true });
    st.add(stars(c, { x0: -900, x1: 2500, y0: -600, y1: 300, n: 60 }));
    st.fade(0);
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 500, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.duskViolet, C.dune, 0.45) }).markup);
    const back = S.layer({ par: 0.16, sh: 3 });
    back.add(sheet().p(c.ridge(c.wave(590, [6, 3], [600, 180]), -900, 2500, 1700, 12, 1), mix(C.lake2, C.duskViolet, 0.3)).out());
    back.add(olive(c, 250, 600, 0.9) + cypress(c, 1400, 600, 140) + `<g transform="translate(1250 612)">${tent(c, { w: 110, h: 90, col: C.clayMantle })}</g>`);

    /* ---------- the house where He stays ---------- */
    const G = S.layer({ par: 0.35, sh: 3 });
    G.add(sheet().p(c.ridge(c.wave(GY, [4, 2], [500, 150]), -900, 2500, 1700, 12, 1), mix(C.sand2, C.clay, 0.2)).out());
    const d = doorHouse(c, { w: 300, h: 230, wall: mix(C.plaster, C.peach, 0.3), shadow: C.plaster2, dw: 76, dh: 140 });
    G.add(`<g transform="translate(560 ${GY})">${d.wall}</g><g transform="translate(560 ${GY})">${d.inside}</g>`);
    G.add(grass(c, { x0: -900, x1: 2500, y: GY, n: 40, h: 14, color: C.olive }));
    const doorGlow = G.add(`<g>${glowDisc(160, 'warm-glow', 1)}</g>`);
    const leaf = G.add(`<g>${d.leaf}</g>`);

    /* ---------- the rock that rises behind Simon ---------- */
    const RK = S.layer({ par: 0.35, sh: 5 });
    const rockEl = RK.add(`<g>${namedRock(c, tr('Kefas', 'Cephas'), { w: 270, h: 250 })}</g>`);
    const G2 = S.layer({ par: 0.35, sh: 4 });
    G2.add(sheet().p(c.ridge(c.wave(742, [3, 2], [400, 120]), -900, 2500, 1700, 12, 1), mix(C.sand2, C.clay, 0.28)).out());
    G2.add(rock(c, 380, 760, 70, 26, C.rock2));

    /* ---------- the fire and the nets ---------- */
    const F = S.layer({ par: 0.35, sh: 4 });
    const FX = 1300;
    F.add(`<g transform="translate(${FX} ${PY - 4})">${firePit(c, 90)}</g>`);
    const fireGlow = F.add(`<g>${glowDisc(150, 'warm-glow', 1)}</g>`);
    const flames = F.add(`<g>${fireFlames(c, 90)}</g>`);
    const tongues = Array.from(flames.querySelectorAll('.tongue'));
    const netEl = F.add(`<g>${netDrape(c, 150, 46)}</g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.35, sh: 4 });
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const simonSit = S.puppet(P.add(person(c, { ...CAST.peter, pose: 'sit' })));
    const simon = S.puppet(P.add(person(c, { ...CAST.peter })));
    const andrew = S.puppet(P.add(person(c, { ...CAST.andrew })));
    const jn = S.puppet(P.add(person(c, { ...CAST.john })));
    const gaze = P.add(`<path d="M0 0L10 0" stroke="${C.haloRim}" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round" fill="none"/>`);

    /* ---------- tags and words ---------- */
    const T = S.layer({ par: 0.35, sh: 6 });
    const andTag = hanging(T, nameTag(c, tr('Andrzej', 'Andrew'), { size: 19 }), { x: 0, y: 0, len: 900 });
    const broTag = hanging(T, nameTag(c, [tr('Szymon Piotr', 'Simon Peter'), tr('— jego brat', '— his brother')], { size: 17 }), { x: 0, y: 0, len: 900 });
    const foundEl = T.add(`<g>${bubble(c, tr('Znaleźliśmy Mesjasza!', 'We have found the Messiah!'), { size: 21, tail: 1 })}</g>`);
    const christ = T.add(hungPlate(c, iconWord(`<g transform="translate(-8 4) scale(1.3)">${crown(c)}</g><g transform="translate(12 4) scale(.5) rotate(-10)">${oilHorn(c)}</g>`, tr('Mesjasz = Chrystus', 'Messiah = Christ'), { size: 14 }), { r: 62 }));
    const simTag = hanging(T, nameTag(c, [tr('Szymon,', 'Simon,'), tr('syn Jana', 'son of Jonah')], { size: 18 }), { x: 0, y: 0, len: 900 });
    const petTag = hanging(T, nameTag(c, tr('Piotr', 'Peter'), { size: 24 }), { x: 0, y: 0, len: 900 });

    return (t, time) => {
      const night = es(t, 0, 5.8);
      sk.blend(DUSK, ['#48456f', '#8c6d86', '#d49b7c'], night);
      st.fade(es(t, 2.5, 5.5) * 0.8);
      const flick = (i) => (time ? 0.85 + Math.sin(time * (7 + i) + i * 2) * 0.15 : 1);
      tongues.forEach((tg, i) => pose(tg, { x: [-30, 22, -8, 14, -22, 2][i], y: -16, sy: flick(i), o: 1 }));
      pose(flames, { x: FX, y: PY - 4, s: 0.7 });
      pose(fireGlow, { x: FX, y: PY - 40, s: 1, o: 0.9 });
      pose(doorGlow, { x: 560 + d.door[0] + d.door[1] / 2, y: GY - 60, s: 1, o: 0.8 });
      pose(leaf, { x: 560 + d.door[0], y: GY, sx: 0.14 });

      /* v40: Andrew — Simon Peter's brother */
      const at = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 1.0, 1.2, ease.in));
      /* v41a: he goes first to find his brother */
      const run = es(t, 1.05, 1.7);
      /* v42a: brings him to Jesus */
      const bring = es(t, 3.05, 3.8);
      const ax = lerp(lerp(700, FX - 190, run), 1060, bring);
      const sx = lerp(FX - 90, 950, bring);
      andrew.set({ x: ax, y: PY + 4, s: 1.0, flip: bring > 0 && bring < 1 ? true : false, walk: (run > 0 && run < 1) || (bring > 0 && bring < 1) ? ax * 0.07 : undefined, amt: 1.3, armF: 10 + bump(t, 2.05, 2.9) * 80 + bring * 30 * (1 - es(t, 3.8, 4)), armB: bump(t, 2.05, 2.9) * 120, head: -bump(t, 2.05, 2.9) * 6, blink: blinkAt(time, 3) });
      const up = es(t, 2.3, 2.45);
      simonSit.set({ x: FX - 90, y: PY + 4, s: 1.0, flip: false, o: 1 - up, armF: 60 + (time ? Math.sin(time * 2) * 6 : 0), armB: 40, head: 6 - bump(t, 1.6, 2.2) * 10, blink: blinkAt(time, 5) });
      pose(netEl, { x: FX - 40, y: PY - 60 + up * 60, r: up * 30, s: 0.9, o: 1 });
      const awe = es(t, 4.1, 4.4);
      simon.set({ x: sx, y: PY + 8, s: 1.03, flip: true, o: up, walk: bring > 0 && bring < 1 ? sx * 0.06 : undefined, armF: 14 + bump(t, 2.45, 2.9) * 60 + awe * 20, armB: bump(t, 2.45, 2.9) * 100 + es(t, 5.2, 5.5) * 40, head: -awe * 8, blink: blinkAt(time, 6) });
      jesus.set({ x: JX, y: PY, s: 1.05, flip: false, armF: 12 + es(t, 4.05, 4.3) * 60 + es(t, 5.1, 5.35) * 30, armB: es(t, 5.1, 5.35) * 90, head: -2, blink: blinkAt(time, 2) });
      jn.set({ x: 640, y: PY + 6, s: 0.97, flip: false, armF: 10, head: 2, blink: blinkAt(time, 4) });

      // tags
      const [ahx, ahy] = headAt(ax, PY + 4, 1, false);
      pose(andTag, { x: ahx, y: lerp(-600, ahy - 120, at), r: Math.sin(t * 4.4) * 2, o: at > 0.01 ? 1 : 0 });
      pose(broTag, { x: FX - 90, y: lerp(-600, PY - 220, es(t, 0.3, 0.6, ease.out) * (1 - es(t, 1.0, 1.2, ease.in))), r: Math.sin(t * 4.4 + 1) * 2, o: t < 1.25 && t > 0.25 ? 1 : 0 });
      pose(foundEl, { x: ahx + 50, y: ahy - 24, s: es(t, 2.05, 2.25, ease.back), o: seg(t, 2.03, 2.07) * (1 - seg(t, 2.95, 3.0)) });
      const ck = es(t, 2.2, 2.5, ease.out) * (1 - es(t, 3.0, 3.25, ease.in));
      pose(christ, { x: 990, y: lerp(-500, 300, ck), r: Math.sin(t * 3.6) * 1.5, o: ck > 0.01 ? 1 : 0 });

      /* v42b: Jesus looks at him — Simon, son of John */
      const look = es(t, 4.1, 4.4);
      const [jhx, jhy] = headAt(JX, PY, 1.05, false);
      const [shx, shy] = headAt(950, PY + 8, 1.03, true);
      pose(gaze, { x: jhx + 20, y: jhy, o: look * (1 - es(t, 5.6, 5.9)) > 0.01 ? 0.9 : 0 });
      attr(gaze, 'd', `M0 0L${((shx - jhx - 44) * look).toFixed(0)} ${((shy - jhy) * look).toFixed(0)}`);
      const nm = es(t, 4.2, 4.5, ease.out);
      const turnTag = es(t, 5.3, 5.5);
      pose(simTag, { x: 950, y: lerp(-600, 380, nm), sx: Math.max(0.001, 1 - turnTag * 2), r: Math.sin(t * 4.4) * 1.6, o: nm > 0.01 && turnTag < 0.5 ? 1 : 0 });
      pose(petTag, { x: 950, y: 380, sx: Math.max(0.001, turnTag * 2 - 1), r: Math.sin(t * 4.4) * 1.6, o: turnTag >= 0.5 ? 1 : 0 });
      /* v42c: Cephas — the rock */
      const rk = es(t, 5.05, 5.45, ease.back);
      pose(rockEl, { x: 1085, y: lerp(1000, 748, rk), o: rk > 0.001 ? 1 : 0 });

      S.cam.x = 170 * es(t, 1.0, 1.6) * (1 - es(t, 3.2, 3.8));
      S.cam.z = 1.02 + 0.06 * es(t, 4.0, 4.4);
    };
  },
};
