// Łk 15,29–30 — night outside the gateway, the feast still going on in the lantern-lit courtyard behind. The elder
// son turns round to face his father and pours it out; each thing he says comes down as a picture over them.
// "Look, these many years I have served you and I never disobeyed your command": a long strip — the plough, the
// sickle, the sheaves, the flock — and a row of tally marks, year after year. "…yet you never gave me a young goat,
// to make merry with my friends": a round picture of his friends at an empty table and, where a young goat should
// be, only a dashed outline. "But when this son of yours came, who has devoured your property with prostitutes":
// he flings his arm towards the courtyard — "this son of yours", not "my brother" — and a dark picture comes down:
// the far-country feast, the coins flying. "…you killed the fattened calf for him!": and the last: the calf with
// its garland and the steaming platter.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { makeCutter } from '../../core/paper.js';
import { sickle, sheaf } from '../../assets/things.js';
import {
  farmSet, partyBack, FM, FATHER, ELDER_W, YOUNGER_RICH, REVELLERS, SERVANTS, withFace, faceBits, hungPlate, figure, goat, dashed, calf, platter, steam, lowTable, cup, goldCoin, yearMarks, ewe, pose3, glow, flyAt,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, NIGHT, STRING, FONT,
} from './lib.js';

const GY = FM.GY;
const EX = 1030, FX = 910;

export default {
  id: 'lk15-served',
  parable: true,
  beats: [
    { v: 29, text: 'Lecz on odpowiedział ojcu: "Oto tyle lat ci służę i nigdy nie przekroczyłem twojego rozkazu;' },
    { v: 29, cont: true, text: 'ale mnie nie dałeś nigdy koźlęcia, żebym się zabawił z przyjaciółmi.' },
    { v: 30, text: 'Skoro jednak wrócił ten syn twój, który roztrwonił twój majątek z nierządnicami,' },
    { v: 30, cont: true, text: 'kazałeś zabić dla niego utuczone cielę".' },
  ],
  cam: { x: [80, 260], y: [-40, 40], z: [1, 1.1] },
  build(S) {
    const F = farmSet(S, { skyCols: NIGHT, moonAt: [1240, 150], starsN: 110, tint: 0.26, tintCol: mix(C.night, C.indigo, 0.5), lit: 1, lanterns: true });
    const c = F.c;
    const P = partyBack(S, F);
    const L = F.people;
    const elder = S.puppet(L.add(withFace(person(c, ELDER_W), faceBits(c))));
    fade(elder.el.querySelector('[data-part="angry"]'), 1);
    const father = S.puppet(L.add(withFace(person(c, FATHER), faceBits(c))));
    fade(father.el.querySelector('[data-part="sad"]'), 0.7);

    /* the pictures */
    const plL = S.layer({ par: 0.24, sh: 6 });
    const oc = makeCutter('lk15-served');
    // the years of work: a long strip with pictures and tally marks
    const strip = sheet().p(oc.cut([[-250, -70], [250, -74], [252, 70], [-250, 72]], 0.5, 8), C.cream).p(oc.cut([[-240, -62], [240, -66], [242, 18], [-240, 20]], 0.4, 8), mix(C.skyBlue, C.cream, 0.45));
    strip.p(oc.cut([[-240, -2], [242, -6], [242, 18], [-240, 20]], 0.4, 8), mix(C.hillNear, C.sand2, 0.3));
    const icons = `<g transform="translate(-180 8)">${figure(oc, { ...ELDER_W, holdF: `<path d="${oc.ribbon([[0, 0], [40, 40]], 3)}" fill="${C.wood2}"/>` }, { x: 0, y: 0, s: 0.3, armF: 60, lean: 10 })}</g>`
      + `<g transform="translate(-80 8)">${figure(oc, { ...ELDER_W, holdF: `<g transform="rotate(-100) scale(.6)">${sickle(oc)}</g>` }, { x: 0, y: 0, s: 0.3, armF: 70, lean: 8 })}</g>`
      + `<g transform="translate(10 12) scale(.4)">${sheaf(oc)}</g><g transform="translate(40 12) scale(.36)">${sheaf(oc)}</g>`
      + `<g transform="translate(110 8)">${figure(oc, { ...ELDER_W }, { x: 0, y: 0, s: 0.3, armF: 30 })}</g><g transform="translate(150 12) scale(.34)">${ewe(oc, {})}</g><g transform="translate(186 14) scale(-.3 .3)">${ewe(oc, { wool: C.cream })}</g>`;
    const years = plL.add(`<g transform="translate(0 -1500)"><path d="M-200 -1900V-72M200 -1900V-72" stroke="${STRING}" stroke-width="1.2" fill="none"/>${strip.out()}${icons}<g transform="translate(-220 48)">${yearMarks(oc, 20, { step: 9, h: 22, col: C.ink })}</g><text x="200" y="56" text-anchor="end" font-family="${FONT}" font-size="18" font-style="italic" fill="${C.ink}">${tr('tyle lat…', 'so many years…')}</text></g>`);
    // never a young goat for his friends
    const bg = (col) => `<rect x="-90" y="-90" width="180" height="180" fill="${col}"/>`;
    const goatP = hungPlate(S, plL, oc, bg(mix(C.parchment, C.cream, 0.4)) + `<g transform="translate(0 40)">${lowTable(oc, 150, 26)}</g>`
      + pose3(oc, [{ x: -60, y: 50, s: 0.34, flip: false, armF: 60, o: { ...SERVANTS[3], pose: 'sit' } }, { x: 60, y: 50, s: 0.34, flip: true, armF: 50, o: { ...SERVANTS[1], pose: 'sit' } }])
      + `<g transform="translate(-4 -2) scale(.9)">${dashed(goat(oc, {}), C.terracotta)}</g>`, { name: 'goat' });
    // the far-country feast (dark)
    const riotP = hungPlate(S, plL, oc, bg(mix(C.night, C.plumRobe, 0.3)) + sheet().p(oc.cut([[-90, 40], [90, 40], [90, 90], [-90, 90]], 0.4, 8), mix(C.terracotta, C.night, 0.4)).out()
      + pose3(oc, [{ x: -40, y: 60, s: 0.36, flip: false, armF: 110, armB: 140, o: YOUNGER_RICH }, { x: 20, y: 60, s: 0.34, flip: true, armF: 140, armB: 160, o: REVELLERS[0] }, { x: 60, y: 60, s: 0.34, flip: true, armF: 120, armB: 150, o: REVELLERS[2] }])
      + [[-20, -40], [0, -54], [20, -30], [36, -50]].map(([x, y]) => `<g transform="translate(${x} ${y})">${goldCoin(oc, 5)}</g>`).join(''), { name: 'riot' });
    // the fattened calf
    const calfP = hungPlate(S, plL, oc, bg(mix(C.dawn, C.cream, 0.4)) + `<g transform="translate(-10 56) scale(.62)">${calf(oc)}</g><g transform="translate(40 72) scale(.6)">${platter(oc, 90)}</g><g transform="translate(40 50) scale(.6)">${steam(oc)}</g>`, { name: 'calf' });
    // phone: the last picture (the calf) clear of the thread
    const AT = S.portrait ? [[820, 290], [694, 260], [870, 260], [1032, 260]] : [[820, 290], [700, 260], [900, 260], [1080, 260]];

    return (t, time) => {
      const T = time;
      F.update(T, { sway: false });
      P.update(t, T, 1, 0.6);

      /* he faces his father and pours it out */
      const count = es(t, 0.2, 0.5) * (1 - es(t, 0.95, 1.05));
      const spread = bump(t, 1.15, 1.9);
      const point = es(t, 2.1, 2.25) * (1 - es(t, 3.85, 3.98));
      const fling = bump(t, 3.1, 3.8);
      elder.set({ x: EX, y: GY, s: 1.04, flip: true, armF: 20 + count * 60 + spread * 70 + point * 90, armB: 10 + count * 40 + spread * 60 + fling * 80, head: -point * 6, lean: -point * 4, blink: blinkAt(T, 2) });
      father.set({ x: FX, y: GY, s: 1.02, armF: 30 + es(t, 0.3, 0.6) * 30, armB: 20, head: 8, blink: blinkAt(T) });

      /* the pictures, one per sentence (each flies back up for the next) */
      flyAt(years, es(t, 0.1, 0.4, ease.out) * (1 - es(t, 1.0, 1.15, ease.in)), AT[0][0], AT[0][1], T, 0, 0.8);
      flyAt(goatP, es(t, 1.08, 1.36, ease.out) * (1 - es(t, 2.9, 3.05, ease.in)), AT[1][0], AT[1][1], T, 1);
      flyAt(riotP, es(t, 2.08, 2.36, ease.out) * (1 - es(t, 3.9, 4.0, ease.in)), AT[2][0], AT[2][1], T, 2);
      flyAt(calfP, es(t, 3.08, 3.36, ease.out), AT[3][0], AT[3][1], T, 3);

      S.cam.x = kf(t, [[0, 160], [1, 150], [2, 180], [3, 200]]);
      S.cam.y = kf(t, [[0, 0], [4, -10]]);
      S.cam.z = kf(t, [[0, 1.04], [2, 1.06], [4, 1.04]]);
    };
  },
};
