// Łk 11,49–51 — the afternoon at the Pharisee's table turns to evening, and the lamps are lit. "Therefore the Wisdom
// of God said, 'I will send them prophets and apostles, and some of them they will kill and persecute'": a panel comes
// down — out of a great light (Wisdom is never shown as a figure) messengers walk out along a road, prophets with scrolls
// and apostles with staffs; ahead of them a crowd raises its fists, and two of them sink down and become grey shadows.
// "So that the blood of all the prophets shed since the foundation of the world may be required of this generation":
// a long frieze unrolls over the table, a road of time from end to end with little lamps along it, one for each of the
// prophets — and one after another they go out, a small red petal falling where each one was. "From the blood of Abel
// to the blood of Zechariah, who perished between the altar and the sanctuary": at the first end Abel kneels by his
// altar with his lamb, at the last Zechariah the priest between the altar and the sanctuary, head bowed; their lamps go
// out too (no wound is shown). "Yes, I tell you, it will be required of this generation": the frieze rolls itself up
// into one heavy scroll, which comes down on its string and settles on the table in front of the guests.
import { C, person, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { dinnerSet, SH, ABEL, ZECH, panel, panelSky, panelGround, figure, lamb, altar, templeModel, radiance, glow, prayerFlame, kf, moving, PI } from './lib.js';

const PX = 900, PY = 300, PW = 420, PH_ = 230;
const FW = 720, FH = 220, FX = 880, FY = 300;     // the frieze
const LAMPS = 9;

export default {
  id: 'lk11-wisdom',
  beats: [
    { v: 49 },
    { v: 50 },
    { v: 51, text: 'od krwi Abla aż do krwi Zachariasza, który zginął między ołtarzem a przybytkiem.' },
    { v: 51, cont: true, text: 'Tak, mówię wam, na tym plemieniu będzie pomszczona.' },
  ],
  cam: { x: [0, 220], y: [60, 160], z: [0.84, 1.2] },
  build(S) {
    const c = S.c;
    const D = dinnerSet(S, S.portrait ? { ceilTop: 0 } : {});   // phone: the ceiling is an eave band, not a third of the screen of planks
    const FS = S.portrait ? 0.74 : 1;
    const PL = S.layer({ par: 0.3, sh: 6, rise: 0 });
    const B = S.layer({ par: 0.3, sh: 5, rise: 0 });

    /* 1 — the messengers sent out from the light */
    const road = panelSky(S, PW, PH_, ['#e9d9b6', '#f6ead0']) + panelGround(c, PW, 60, mix(C.sand, C.dune, 0.3), 3)
      + sheet().p(c.ribbon([[-PW / 2, 90], [-60, 80], [60, 76], [PW / 2, 72]], 26, 1), mix(C.sand, C.cream, 0.4)).out()
      + `<g transform="translate(-170 -10)"><circle r="120" fill="url(#halo-glow)"/>${radiance(c, 46)}</g>`;
    const p1 = PL.add(panel(S, road, { w: PW, h: PH_ }));
    const SENT = [{ robe: C.linen2, mantle: C.tealRobe, hairStyle: 'wrap', veil: C.stone, beard: 'full', hair: C.hair3, skin: C.skin3 }, { robe: C.sageRobe, hairStyle: 'short', beard: 'short', hair: C.hair2, skin: C.skin2 }, { robe: C.dustyBlue, mantle: C.ochre, hairStyle: 'curly', beard: 'full', hair: C.greyHair, skin: C.skin2 }]
      .map((o, i) => ({ i, p: S.puppet(B.add(person(c, { ...o, holdF: i === 1 ? `<path d="${c.ribbon([[0, 30], [0, -80]], 3)}" fill="${C.wood2}"/>` : `<g transform="translate(0 4)">${sheet().p(c.cut(c.rect(-8, -6, 16, 12), 0.2, 3), C.parchment).out()}</g>` }))) }));
    const mob = B.add(`<g opacity="0">${[0, 1, 2, 3].map((i) => figure(c, { robe: mix([C.plumRobe, C.clayMantle, C.storm2, C.wood3][i], C.rock3, 0.3), hairStyle: ['short', 'wrap', 'curly', 'wild'][i], veil: C.stone2, beard: 'full', hair: C.hair3, skin: C.skin3 }, { x: i * 26, y: (i % 2) * 6, s: 0.44, flip: true, armF: 120 + i * 8, armB: 40, head: -4 })).join('')}</g>`);
    const fallen = [0, 1].map(() => B.add(`<g opacity="0"><ellipse rx="26" ry="8" fill="${mix(C.rock3, C.plumRobe, 0.3)}" opacity=".7"/></g>`));

    /* 2 — the frieze of the prophets' lamps, from Abel to Zechariah */
    const fz = sheet();
    fz.p(c.cut(c.rect(-FW / 2 - 8, -FH / 2 - 8, FW + 16, FH + 16), 0.6, 10), mix(C.wood3, C.ochre, 0.4));
    fz.p(c.cut(c.rect(-FW / 2, -FH / 2, FW, FH), 0.5, 10), mix(C.parchment, C.dawn, 0.25));
    fz.p(c.ribbon([[-FW / 2 + 110, 40], [FW / 2 - 110, 40]], 5), C.haloRim);
    const abelSide = `<g transform="translate(${-FW / 2 + 56} 96)">${sheet().p(c.cut([[-26, 0], [-22, -30], [22, -30], [26, 0]], 0.4, 5), C.rock2).out()}<path d="${c.ribbon([[0, -32], [4, -80], [-4, -130]], (u) => 8 - u * 6)}" fill="${C.stone}" opacity=".7"/></g>`
      + figure(c, { ...ABEL, pose: 'kneel' }, { x: -FW / 2 + 116, y: 96, s: 0.66, flip: true, armF: 40, armB: 60, head: 16 }) + `<g transform="translate(${-FW / 2 + 164} 96) scale(.6)">${lamb(c)}</g>`;
    const zechSide = `<g transform="translate(${FW / 2 - 50} 100) scale(.42)">${templeModel(c, 1, { glow: false })}</g><g transform="translate(${FW / 2 - 176} 98) scale(.5)">${altar(c)}</g>`
      + figure(c, { ...ZECH, pose: 'kneel' }, { x: FW / 2 - 110, y: 98, s: 0.66, armF: 30, armB: 40, head: 22 });
    const frieze = PL.add(`<g transform="translate(800 -1600)"><path d="M${-FW * 0.4} ${-FH / 2 - 1800}V${-FH / 2 - 8}M${FW * 0.4} ${-FH / 2 - 1800}V${-FH / 2 - 8}" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${fz.out()}${abelSide}${zechSide}</g>`);
    const LX0 = -FW / 2 + 210, LX1 = FW / 2 - 230;
    const lamps = Array.from({ length: LAMPS }, (_, i) => ({ i, x: lerp(LX0, LX1, i / (LAMPS - 1)), flame: B.add(`<g opacity="0">${prayerFlame(c, 26)}</g>`), petal: B.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 5, 3, 8, 0.4), 0.2, 3)}" fill="${C.terracotta}"/></g>`) }));
    const lampBase = B.add(`<g opacity="0">${lamps.map((l) => `<path d="${c.cut([[l.x - 8, 40], [l.x - 10, 34], [l.x + 10, 34], [l.x + 8, 40]], 0.2, 3)}" fill="${C.pot}"/>`).join('')}</g>`);
    const endFlames = [0, 1].map(() => B.add(`<g opacity="0">${prayerFlame(c, 26)}</g>`));
    const endPetals = [0, 1].map(() => B.add(`<g opacity="0"><path d="${c.cut(c.ell(0, 0, 5, 3, 8, 0.4), 0.2, 3)}" fill="${C.terracotta}"/></g>`));
    /* 3 — the rolled-up account */
    const scroll = hanging(PL, `${sheet().p(c.cut(c.rect(-120, -16, 240, 32), 0.4, 6), mix(C.parchment, C.dawn, 0.25)).p(c.cut(c.ell(-122, 0, 10, 18, 12), 0.3, 4) + c.cut(c.ell(122, 0, 10, 18, 12), 0.3, 4), mix(C.wood3, C.ochre, 0.4)).p(c.cut(c.circ(0, 0, 12, 12), 0.3, 4), C.terracotta).out()}`, { x: 0, y: -1500, len: 1400 });

    return (t, time) => {
      const T = time;
      const lit = es(t, 0.0, 0.6);
      D.R.sk2.fade(es(t, 0.0, 1.0) * 0.8);
      const speak = es(t, 0.02, 0.2);
      const recoil = es(t, 3.5, 3.7);
      D.seat(t, T, {
        lit,
        J: { armF: 30 + speak * 40, armB: 10 + speak * 50, head: 2 - speak * 4 },
        H: { head: 8 - recoil * 10, lean: 4 - recoil * 10, armF: 20 + recoil * 50 },
        g: (q) => ({ head: -2 - recoil * 10, lean: -recoil * 8, armF: 20 + recoil * 40 }),
      });
      /* v49 — prophets and apostles sent; some killed and persecuted */
      const k1 = es(t, 0.02, 0.3, ease.out) * (1 - es(t, 0.9, 1.1, ease.in));
      const Y1 = lerp(-1500, PY, k1), on1 = k1 > 0.9 ? 1 : 0;
      pose(p1, { x: PX, y: Y1, o: k1 > 0.002 ? 1 : 0 });
      SENT.forEach((m) => {
        const K = [[0.2 + m.i * 0.08, PX - 150], [0.62 + m.i * 0.04, PX + 20 + m.i * 40]];
        const x = kf(t, K, (u) => u);
        const falls = m.i < 2 ? es(t, 0.62 + m.i * 0.06, 0.72 + m.i * 0.06) : 0;
        m.p.set({ x, y: Y1 + 86 + (m.i % 2) * 3, s: 0.42, o: on1 * (1 - falls), walk: moving(t, K) ? x * 0.2 : undefined, armF: 30, head: -4, blink: blinkAt(T, m.i) });
        if (m.i < 2) pose(fallen[m.i], { x: PX + 20 + m.i * 40, y: Y1 + 88, o: on1 * falls });
      });
      pose(mob, { x: PX + 110, y: Y1 + 90, o: on1 * es(t, 0.35, 0.5) });

      /* v50 — the frieze: the lamps of the prophets go out one by one */
      const kf2 = es(t, 1.0, 1.3, ease.out);
      const roll = es(t, 3.05, 3.3);
      const FYY = lerp(-1500, FY, kf2);
      pose(frieze, { x: FX, y: FYY, s: FS, sx: Math.max(0.02, 1 - roll), o: kf2 > 0.002 && roll < 0.99 ? 1 : 0 });
      const onF = kf2 > 0.9 && roll < 0.99 ? 1 - roll : 0;
      pose(lampBase, { x: FX, y: FYY, s: FS, sx: Math.max(0.02, 1 - roll), o: onF > 0 ? 1 : 0 });
      lamps.forEach((l) => {
        const out = es(t, 1.35 + l.i * 0.06, 1.42 + l.i * 0.06);
        pose(l.flame, { x: FX + l.x * FS * (1 - roll), y: FYY + 34 * FS, s: FS * (1 - out) * (1 + (T ? Math.sin(T * 7 + l.i) * 0.06 : 0)), o: onF * (1 - out) * es(t, 1.1, 1.2) });
        pose(l.petal, { x: FX + l.x * FS * (1 - roll), y: FYY + 46 * FS, o: onF * out });
      });
      /* v51a — Abel and Zechariah */
      [[-FW / 2 + 116, 0], [FW / 2 - 110, 1]].forEach(([x, i]) => {
        const out = es(t, 2.3 + i * 0.15, 2.4 + i * 0.15);
        pose(endFlames[i], { x: FX + x * FS * (1 - roll), y: FYY - 30 * FS, s: FS, o: onF * (1 - out) * es(t, 2.05, 2.15) });
        pose(endPetals[i], { x: FX + x * FS * (1 - roll), y: FYY + 102 * FS, o: onF * out });
      });
      /* v51b — rolled up, it comes down on the table before this generation */
      const sd = es(t, 3.25, 3.55, ease.in);
      pose(scroll, { x: 1000, y: lerp(FY, SH.TOP - 20, sd), o: roll > 0.9 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 110]]);
      S.cam.y = kf(t, [[0, 100], [0.9, 100], [1.2, 80], [3.2, 80], [3.5, 110]]);
      S.cam.z = kf(t, [[0, 1.06], [0.9, 1.06], [1.2, 1.02], [3.2, 1.02], [3.5, 1.08]]);
      if (S.portrait) { S.cam.x = 210; S.cam.z = 0.84; }   // phone: the host at the far end inside the screen
    };
  },
};
