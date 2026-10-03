// Łk 19,9–10 — the same house as the day turns gold. Jesus, on the top step, turns to Zacchaeus: "Today salvation
// has come to this house" — the doorway fills with light, every window lights up, and his household come out to the
// door; "for he too is a son of Abraham" — a medallion drops on its string over him: old Abraham under the night of
// countless stars. "For the Son of Man came to seek and to save what was lost": a painted plate comes down above
// them — on a dark hillside a shepherd with a lamp finds a lamb caught in the thorns, frees it and brings it out
// into the light of his lamp.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { zacHouse, ZH, ZACC, ZS, TWELVE, still, lamb, handLamp, heart, sparkle, strip, headAt, hand, kf, tr, es, ease, bump, seg, PI, GOLDEN, mix, shade, sheet, STRING } from './lib.js';
import { medal, RIM, ABRAHAM } from '../matthew1/lib.js';
import { stars } from '../../assets/nature.js';
import { thornBush } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';

const GY = ZH.GY, DX = ZH.DX;
const ZY = GY - ZH.STEP * 2 + 2, JX = 836, ZX = 968;
const PLATE = [800, 250], PR = 150;

export default {
  id: 'lk19-saved',
  beats: [
    { v: 9 },
    { v: 10 },
  ],
  cam: { x: [-40, 120], y: [-80, 60], z: [1, 1.2] },
  build(S) {
    const H = zacHouse(S, { sky2: GOLDEN, sunAt: [1300, 170] });
    const c = S.c;
    const A = H.act;

    /* the windows light up (a whole sheet that fades in) */
    const winL = S.layer({ par: 0.4, sh: 0, flat: true });
    winL.add(`<g>${ZH.WIN.map((w) => `<path d="${c.poly(c.rect(DX + w - 24, GY - 338, 48, 66))}" fill="${mix(C.lampGlow, C.sun, 0.35)}" opacity=".85"/>`).join('')}</g>`);
    winL.fade(0);

    const jesus = S.puppet(A.add(person(c, CAST.jesus)));
    const dis = A.sprite(still(c, [{ x: -60, y: 0, s: 0.9, o: TWELVE[0].o, head: 4 }, { x: 0, y: 8, s: 0.9, o: TWELVE[2].o, head: 6 }]), 700, GY + 6);
    const zac = S.puppet(A.add(person(c, ZACC)));
    // his household at the door
    const wife = S.puppet(A.add(person(c, { robe: C.roseRobe, mantle: mix(C.ochre, C.sun, 0.3), hairStyle: 'veil', veil: C.linen, veil2: C.ochre, hair: C.hair3, skin: C.skin3, beard: 'none' })));
    const kid = S.puppet(A.add(person(c, { robe: C.wheatRobe, hair: C.hair3, hairStyle: 'curly', beard: 'none', skin: C.skin3, belt: C.terracotta })));

    /* Abraham's medallion, and the plate of the lost lamb (hung from the flies) */
    const hangL = S.layer({ par: 0.3, sh: 5 });
    const starsM = `<circle r="70" fill="${mix(C.night, C.indigo, 0.3)}"/>` + stars(makeCutter('lk19-abr'), { x0: -60, x1: 60, y0: -64, y1: 10, n: 22 });
    const abe = hangL.add(`<g><path d="M0 -2000V-70" stroke="${STRING}" stroke-width="1.3"/>${medal(S, ABRAHAM, { r: 62, ...RIM.night, name: tr('syn Abrahama', 'a son of Abraham'), behind: starsM, figS: 0.9 })}</g>`);
    const P = lostPlate(S, c);
    const plate = hangL.add(`<g>${P.frame}</g>`);
    const pL = S.layer({ par: 0.3, sh: 3 });
    const thorn = pL.add(`<g>${P.thorn}</g>`);
    const WOOL = mix(C.linen, C.wheat, 0.35);
    const lambEl = pL.add(`<g>${lamb(c).split(`fill="${C.linen}"`).join(`fill="${WOOL}"`)}</g>`);
    const shep = S.puppet(pL.add(person(c, { ...CAST.jesus, holdF: `<g transform="translate(0 6) rotate(90)">${handLamp(c, { glowR: 70 })}</g>` })));
    const joy = [0, 1, 2].map((i) => A.add(`<g>${sparkle(c, 9)}</g>`));
    const hrt = A.add(`<g>${heart(c, 14)}</g>`);

    return (t, time) => {
      const T = time;
      const lit = es(t, 0.1, 0.5);
      H.update(T, { lit, sunY: 170 + es(t, 0, 2) * 60 });
      H.sk2.fade(es(t, 0, 1.2));
      winL.fade(lit);
      dis.set({ x: 700, y: GY + 6 });

      /* v9 — today salvation has come to this house: he too is a son of Abraham */
      const toZ = es(t, 0.02, 0.2);
      jesus.set({ x: JX, y: ZY, s: 1.02, flip: false, armF: 20 + toZ * 50 * (1 - es(t, 1.05, 1.3)) + es(t, 1.05, 1.3) * 20, armB: 10 + es(t, 1.05, 1.3) * 120, head: toZ * 6 - es(t, 1.05, 1.3) * 10, blink: blinkAt(T) });
      zac.set({ x: ZX, y: ZY, s: ZS, flip: true, armF: 60 + bump(t, 0.2, 0.9) * 50, armB: 40 + es(t, 0.3, 0.6) * 60, head: -8, lean: -4, blink: blinkAt(T, 3) });
      const out = es(t, 0.25, 0.55);
      wife.set({ x: lerp(DX, DX + 170, out), y: lerp(ZY, GY - ZH.STEP + 2, out), s: 0.8, flip: true, o: seg(t, 0.25, 0.3), walk: out > 0 && out < 1 ? out * 20 : undefined, armF: 30 + es(t, 0.55, 0.7) * 50, armB: es(t, 0.55, 0.7) * 90, head: -6, blink: blinkAt(T, 7) });
      kid.set({ x: lerp(DX + 10, DX + (S.portrait ? 206 : 236), out), y: lerp(ZY, GY + 4, out), s: 0.5, flip: true, o: seg(t, 0.3, 0.35), walk: out > 0 && out < 1 ? out * 26 : undefined, armF: 40, armB: es(t, 0.55, 0.7) * 150, head: -10, blink: blinkAt(T, 9) });
      const ab = es(t, 0.45, 0.75, ease.back);
      joy.forEach((j, i) => { const k = bump(t, 0.2 + i * 0.1, 0.9 + i * 0.1); pose(j, { x: DX - 60 + i * 60, y: ZY - 250 + (i % 2) * 30, s: k, r: T * 30, o: k > 0.02 ? 1 : 0 }); });
      const hk = bump(t, 0.3, 1.0);
      pose(hrt, { x: (JX + ZX) / 2, y: ZY - 200 - hk * 30, s: hk, o: hk > 0.02 ? 1 : 0 });

      /* v10 — the Son of Man came to seek and to save the lost */
      const drop = es(t, 1.02, 1.3, ease.back);
      const py = lerp(-1300, PLATE[1], drop);
      const abY = lerp(-1200, 300, ab) - es(t, 1.0, 1.25) * 1500;
      pose(abe, { x: S.portrait ? 1040 : 1130, y: abY, r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: ab > 0.001 && abY > -1180 ? 1 : 0 });
      pose(plate, { x: PLATE[0], y: py, o: drop > 0.001 ? 1 : 0 });
      pose(thorn, { x: PLATE[0] + 56, y: py + 86, o: drop > 0.001 ? 1 : 0 });
      const find = es(t, 1.3, 1.55);
      const sx = lerp(PLATE[0] - 110, PLATE[0] - 12, find);
      const free = es(t, 1.6, 1.8);
      shep.set({ x: sx - free * 30, y: py + 112, s: 0.6, o: drop > 0.001 ? 1 : 0, walk: find > 0 && find < 1 ? sx * 0.2 : undefined, armF: 70 - free * 10, armB: 20 + find * 60 - free * 40, lean: find * 10 * (1 - free) + free * 14, head: find * 12 + free * 6, blink: blinkAt(T, 4) });
      pose(lambEl, { x: lerp(PLATE[0] + 50, PLATE[0] + 14, free), y: py + 108 + free * 10, s: 0.66 + free * 0.08, sx: -1, r: bump(t, 1.6, 1.8) * -8, o: drop > 0.001 ? 1 : 0 });

      S.cam.x = kf(t, [[-0.5, 40], [0.5, 60], [1.1, 20]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.5, 20], [1.1, -60]]);
      S.cam.z = kf(t, [[-0.5, 1.06], [0.5, 1.12], [1.1, 1.06]]);
      if (S.portrait) { S.cam.x = kf(t, [[-0.5, 60], [0.5, 120], [1.1, 80]]); S.cam.z = 1.0; }
      void hand; void shade; void sheet; void PR; void strip;
    };
  },
};
/** the plate of the lost lamb: a dark hillside with thorns under a small moon (frame at origin = its centre) */
function lostPlate(S, c) {
  const R = PR;
  const s = sheet();
  s.p(c.cut(c.circ(0, 0, R + 10, 48), 0.5, 6), C.haloRim).p(c.cut(c.circ(0, 0, R, 48), 0.5, 6), mix(C.night, C.indigo, 0.35));
  const hill = [];
  for (let i = 0; i <= 16; i++) { const a = PI * (1 - i / 16); hill.push([Math.cos(a) * R * 0.99, 40 + Math.sin(i / 16 * PI * 2) * 8]); }
  s.p(c.cut([...hill, ...c.arc(0, 0, R * 0.99, R * 0.99, 0.02, PI - 0.02, 18)], 0.5, 6), mix(C.moss2, C.night, 0.35));
  s.p(c.cut(c.circ(-70, -60, 16, 16), 0.3, 4), C.moon);
  const st = stars(c, { x0: -90, x1: 100, y0: -110, y1: -10, n: 14 });
  return {
    frame: `<path d="M-60 -2000V${-R + 12}M60 -2000V${-R + 12}" stroke="${STRING}" stroke-width="1.3" fill="none"/>${s.out()}${st}`,
    thorn: thornBush(c, 0, 0, 70, mix(C.thorn, C.night, 0.2)),
  };
}
