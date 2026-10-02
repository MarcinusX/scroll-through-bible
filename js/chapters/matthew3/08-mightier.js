// Mt 3,11 — "I baptise you with water": John pours water over a man kneeling in the river, and a plate
// of water hangs above. "But he who comes after me is mightier": John turns and points upstream, where far
// away, in a warm light, someone is walking along the far bank. "I am not worthy to carry his sandals":
// a pair of sandals comes down before John; he reaches for them, draws back, and kneels in the water.
// "He will baptise you with the Holy Spirit and fire": the sky turns gold, a dove glides over and small
// tongues of fire settle over the heads of the listeners.
import { C, person, CAST, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { JOHN_B, hand, headAt, voiceRings, jordanSet, shell, drops, flame, plate, hang2, dove, flapWings, folk, group, DAY, KINGDOM } from './lib.js';
import { sandalBig } from '../mark1/lib.js';

const PI = Math.PI;
const JX = 830, WADE = 702, BANK = 776;

export default {
  id: 'mt3-mightier',
  beats: [
    { v: 11, text: 'Ja was chrzczę wodą dla nawrócenia;' },
    { v: 11, cont: true, text: 'lecz Ten, który idzie za mną, mocniejszy jest ode mnie;' },
    { v: 11, cont: true, text: 'ja nie jestem godzien nosić Mu sandałów.' },
    { v: 11, cont: true, text: 'On was chrzcić będzie Duchem Świętym i ogniem.' },
  ],
  cam: { x: [-80, 40], y: [0, 80], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const PH = S.portrait;   // phone: the one who comes walks further in, the listeners and the Spirit's plate move inward
    const SPX = PH ? 985 : 1060;
    const J = jordanSet(S, { skyCols: DAY, sunAt: [1240, 150], city: false, path: false });
    // the golden sky of the Spirit, over the day sky (behind the mountains' layer order is fine: it's a wash)
    const gid = S.id('gold');
    S.defs(`<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="0" y1="-600" x2="0" y2="620"><stop offset="0" stop-color="${KINGDOM[0]}" stop-opacity=".95"/><stop offset=".75" stop-color="${KINGDOM[1]}" stop-opacity=".6"/><stop offset="1" stop-color="${KINGDOM[2]}" stop-opacity="0"/></linearGradient>`);
    const gold = S.layer({ par: 0.02, sh: 1, flat: true });
    gold.add(`<rect x="-3000" y="-3000" width="8000" height="3620" fill="url(#${gid})"/><g transform="translate(800 -40)">${rays(c, { n: 16, r0: 40, r1: 1100, spread: 0.045, color: '#fff3cf' })}</g>`);
    gold.fade(0);

    /* far away on the far bank: the one who is coming, in a warm light */
    const farGlow = J.far.add(`<g><circle r="120" fill="url(#halo-glow)"/><path d="${c.poly([[-16, -300], [16, -300], [60, 0], [-60, 0]])}" fill="#fff3cf" opacity=".5"/></g>`);
    const comer = S.puppet(J.far.add(person(c, { ...CAST.jesus })));

    /* the river: John, a man kneeling in the water, John kneeling himself */
    const R = J.riverLayer();
    const john = S.puppet(R.add(person(c, { ...JOHN_B, holdF: `<g data-k="m-shell" transform="rotate(-20)">${shell(c, 15)}</g>` })));
    const shellEl = S.$('m-shell');
    const johnK = S.puppet(R.add(person(c, { ...JOHN_B, pose: 'kneel' })));
    const pourEl = R.add(`<g>${drops(c, 5, C.lake2)}</g>`);
    const man = S.puppet(R.add(person(c, { robe: C.ochreRobe, hairStyle: 'curly', hair: C.hair3, beard: 'short', skin: C.skin3, pose: 'kneel' })));
    const manUp = S.puppet(R.add(person(c, { robe: C.ochreRobe, hairStyle: 'curly', hair: C.hair3, beard: 'short', skin: C.skin3 })));
    J.waterFront(R);
    const voice = voiceRings(R, c, { n: 3, color: C.clay, r: 40, w: 6, both: false });
    const jFlame = R.add(`<g>${flame(c, 30)}</g>`);

    /* the near bank: listeners */
    const { N } = J.nearBank();
    [[-1, 250, 3], [1, 1370, 3]].forEach(([side, x, n]) => {
      const mem = Array.from({ length: n }, (_, k) => ({ x: (k - (n - 1) / 2) * 44 + c.rr(-6, 6), y: c.rr(-6, 6), s: 1, flip: side > 0, o: folk(c) }));
      N.add(`<g transform="translate(${x} ${BANK + 4}) scale(.8)">${group(c, mem)}</g>`);
    });
    const LIS = (PH ? [[495, false, 0.84], [590, false, 0.8], [1000, true, 0.82], [1062, true, 0.84]] : [[430, false, 0.84], [540, false, 0.8], [1110, true, 0.82], [1215, true, 0.84]]).map(([x, flip, s], i) => ({ x, flip, s, i, p: S.puppet(N.add(person(c, folk(c)))), seed: c.rr(0, 9) }));
    const flames = LIS.map((l) => ({ l, el: N.add(`<g>${flame(c, 28)}</g>`) }));

    /* from the flies: the sandals, the plates of water and of the Spirit */
    const fly = S.layer({ par: 0.3, sh: 6 });
    const sGlow = fly.add(`<ellipse rx="150" ry="170" fill="url(#halo-glow)" opacity="0"/>`);
    const sandals = fly.add(hang2(`<g transform="translate(-34 0) scale(.34) rotate(-6)">${sandalBig(c, 400)}</g><g transform="translate(36 6) scale(.34) rotate(7)">${sandalBig(c, 400)}</g>`, 70, 700));
    const waterIcon = `<path d="${c.cut([[0, -30], [16, -4], [14, 12], [0, 20], [-14, 12], [-16, -4]], 0.4, 4)}" fill="${C.lake2}"/><path d="${c.ribbon([[-32, 26], [-16, 22], [0, 26], [16, 22], [32, 26]], 4)}" fill="${C.lake}"/><path d="${c.cut(c.ell(-5, -2, 4, 7, 8), 0.2, 3)}" fill="${C.foam}"/>`;
    const waterPlate = hanging(fly, plate(c, waterIcon, { r: 50, fill: '#e7f0ec', rim: C.lake }), { x: 560, y: 230, len: 700 });
    const spiritIcon = `<g opacity=".9">${rays(c, { n: 12, r0: 34, r1: 54, spread: 0.08, color: C.sun })}</g><g transform="translate(0 30)">${flame(c, 64, C.sunRay, C.lampFlame)}</g>`;
    const spiritPlate = hanging(fly, `<circle r="130" fill="url(#halo-glow)"/>${plate(c, spiritIcon, { r: 58, fill: C.halo, rim: C.sun })}`, { x: SPX, y: 230, len: 700 });
    const doveEl = fly.add(dove(c));

    J.foreground();

    return (t, time) => {
      J.update(t, time);

      /* v11a — water */
      const pour = es(t, 0.15, 0.35) * (1 - es(t, 0.75, 0.9));
      const wIn = es(t, 0.05, 0.4, ease.out), wDim = es(t, 3.0, 3.3);
      swing(waterPlate, 560, lerp(-380, 230, wIn), time, 1.4, 0.8);
      fade(waterPlate, (wIn > 0 ? 1 : 0) * (1 - wDim * 0.5));
      const [px, py] = hand(JX, WADE, 1.05, false, 30 + pour * 80);
      const fall = time ? (time * 1.6) % 1 : 0.5;
      pose(pourEl, { x: px + 12 + fall * 10, y: py + 6 + fall * 50, o: seg(t, 0.3, 0.38) * (1 - seg(t, 0.72, 0.8)) });
      const rise = es(t, 1.02, 1.08);
      const off = es(t, 1.1, 1.6);
      man.set({ x: 935, y: WADE, s: 1, flip: true, o: 1 - rise, head: 12 + bump(t, 0.2, 0.8) * 6, armF: 60, armB: 40, blink: blinkAt(time, 4) });
      const mx = lerp(935, 1380, off);
      manUp.set({ x: mx, y: WADE, s: 1, flip: false, o: rise * (1 - seg(t, 1.5, 1.6)), walk: off > 0 && off < 1 ? mx * 0.05 : undefined, blink: blinkAt(time, 4) });

      /* v11b — the one who comes after, far away in a warm light */
      const come = seg(t, 1.1, 1.9);
      const cx = PH ? lerp(260, 640, ease.sine(come)) : lerp(160, 500, ease.sine(come));
      comer.set({ x: cx, y: 588, s: 0.3, o: seg(t, 1.05, 1.15), walk: come > 0 && come < 1 ? cx * 0.12 : undefined, blink: blinkAt(time, 3) });
      pose(farGlow, { x: cx, y: 590, s: 0.7 + es(t, 1.2, 1.7) * 0.5, o: es(t, 1.1, 1.4) });

      /* v11c — the sandals come down; John reaches, draws back, kneels */
      const sk = es(t, 2.02, 2.35, ease.out), sUp = es(t, 3.0, 3.3, ease.in);
      pose(sandals, { x: 690, y: lerp(-420, 500, sk) - sUp * 900, r: Math.sin(time * 0.8) * 0.8 });
      pose(sGlow, { x: 690, y: 450, o: sk * (1 - sUp) * 0.8 });
      const reach = es(t, 2.3, 2.45) * (1 - es(t, 2.5, 2.62));
      const kneel = es(t, 2.6, 2.66) * (1 - es(t, 3.4, 3.46));
      const turnL = t > 1.05;
      const point = es(t, 1.15, 1.35) * (1 - es(t, 2.0, 2.15));
      const spirit = es(t, 3.05, 3.35);
      john.set({
        x: JX, y: WADE, s: 1.05, flip: turnL, o: 1 - kneel,
        armF: 30 + pour * 80 + point * 70 + reach * 80 + spirit * 60, armB: 10 + point * 20 + spirit * 140,
        head: pour * 6 - point * 6 - reach * 6 - spirit * 16, blink: blinkAt(time),
      });
      fade(shellEl, 1 - es(t, 1.0, 1.08));
      johnK.set({ x: JX - 6, y: WADE + 8, s: 1.05, flip: true, o: kneel, armF: 40, armB: 20, head: 20, lean: 8, blink: blinkAt(time, 2) });
      const [hx, hy] = headAt(JX, WADE, 1.05, turnL);
      voice(hx + (turnL ? -14 : 14), hy, point, time, { spread: 3, dir: turnL ? -1 : 1 });

      /* v11d — the Holy Spirit and fire */
      gold.fade(spirit * 0.8);
      const pIn = es(t, 3.02, 3.35, ease.out);
      swing(spiritPlate, SPX, lerp(-380, 230, pIn), time, 1.2, 0.7, 1);
      fade(spiritPlate, pIn > 0 ? 1 : 0);
      const dv = seg(t, 3.1, 3.95);
      pose(doveEl, { x: lerp(260, 1320, dv), y: 330 - Math.sin(dv * PI) * 70, s: 0.9, o: dv > 0 && dv < 1 ? 1 : 0 });
      flapWings(doveEl, time, 30, 7);
      LIS.forEach((l) => {
        l.p.set({ x: l.x, y: BANK + (l.i % 2) * 6, s: l.s, flip: l.flip, armF: 20 + bump(t, 1.2, 1.9) * 20 + spirit * (l.i % 2 ? 90 : 40), armB: spirit * (l.i % 2 ? 30 : 130), head: -spirit * 12, blink: blinkAt(time, l.seed) });
      });
      flames.forEach((f, i) => {
        const k = es(t, 3.35 + i * 0.07, 3.5 + i * 0.07, ease.back);
        const [fx, fy] = headAt(f.l.x, BANK + (f.l.i % 2) * 6, f.l.s, f.l.flip);
        const fl = time ? 1 + Math.sin(time * 11 + i) * 0.08 : 1;
        pose(f.el, { x: fx, y: fy - 30, sx: k / fl, sy: k * fl, o: k > 0 ? 1 : 0 });
      });
      const kj = es(t, 3.5, 3.65, ease.back);
      pose(jFlame, { x: hx, y: hy - 30, sx: kj, sy: kj * (time ? 1 + Math.sin(time * 10) * 0.08 : 1), o: kj > 0 && kneel < 0.5 ? 1 : 0 });

      /* camera: towards the far bank for the one who comes; back for the sandals and the Spirit */
      const look = es(t, 1.05, 1.5) * (1 - es(t, 1.95, 2.3));
      S.cam.x = -look * 70;
      S.cam.z = 1.04 + look * 0.08 + es(t, 2.2, 2.6) * 0.04 * (1 - spirit);
      S.cam.y = 40 - look * 10 - spirit * 20;
    };
  },
};
