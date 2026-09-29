// Mt 12,20–21 — the prophecy goes on, at dusk by a quiet stream. "A bruised reed He will not break": among the reeds
// one is cracked and hangs its head; Jesus kneels, lifts it gently and binds it to a little stick, and it stands.
// "A smouldering wick He will not quench": a poor woman comes with her clay lamp, only a thread of smoke left on the
// wick; He cups His hands round it and it flames up again — and golden scales with a victor's wreath rise over them:
// justice brought to victory. "In His name the nations will hope": night falls, and all over the dark hills the
// peoples of the earth light their little lamps from His, a field of small lights turned towards Him.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, sky } from '../kit.js';
import { band, hillsWith, waterBand, reeds, olive, rock, grass, stars, moon, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { laurel } from '../john5/lib.js';
import { DUSK, NIGHT, womanOf, handAt, headAt, kf, scalesParts, poseScales, nationsMarkup, glow, sparkle, tr, PI } from './lib.js';

const Y = 700;
const JX = 800;
const RX = 690;         // the bruised reed
const RY = 706;

/** a clay lamp; the flame (.fl) and the smoke (.sm) are separate parts; origin: base centre, spout to the right */
function clayLamp(c) {
  const s = sheet();
  s.p(c.cut([[-24, 0], [-28, -8], [-16, -15], [10, -15], [22, -11], [32, -15], [36, -11], [24, -2], [12, 2], [-16, 2]], 0.4, 5), C.pot);
  s.p(c.cut(c.circ(-4, -13, 6, 10), 0.2, 3), shade(C.pot, -0.3));
  s.p(c.ribbon([[31, -14], [34, -20]], 2.4), C.soilDark);
  const fl = `<g class="fl" transform="translate(34 -19)"><circle cy="-12" r="40" fill="url(#warm-glow)"/><path d="M0 0C-7 -6 -6 -16 0 -30C6 -16 7 -6 0 0Z" fill="${C.lampFlame}"/><path d="M0 -2C-3 -6 -3 -11 0 -17C3 -11 3 -6 0 -2Z" fill="#fff4d2"/></g>`;
  const sm = `<g class="sm" transform="translate(34 -20)"><path d="${c.ribbon(c.cbez([0, 0], [-8, -16], [10, -26], [0, -44], 12), (u) => 3 - u * 2)}" fill="${C.rock2}"/><circle r="3" fill="${C.terracotta}"/></g>`;
  return `${s.out()}${sm}${fl}`;
}

export default {
  id: 'mt12-reed',
  enter: 'fly',
  beats: [
    { v: 20, text: 'Trzciny zgniecionej nie złamie' },
    { v: 20, cont: true, text: 'ani knota tlejącego nie dogasi, aż zwycięsko sąd przeprowadzi.' },
    { v: 21 },
  ],
  cam: { x: [-30, 30], y: [-20, 50], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    sky(S, DUSK);
    const night = sky(S, NIGHT, { name: 'night' });
    night.layer.fade(0);
    const starL = S.layer({ par: 0.02, sh: 1, flat: true });
    starL.add(stars(c, { x0: -600, x1: 2200, y0: -500, y1: 420, n: 90 }));
    const hangL = S.layer({ par: 0.05, sh: 5 });
    const moonEl = hanging(hangL, moon(c, 36), { x: 1190, y: -300, len: 900 });
    const sunEl = hanging(hangL, sun(c, 46, { rays: C.sunDeep, disc: '#f0b060', inner: '#f5ca8a' }), { x: 1150, y: 380, len: 900 });
    const cls = [[520, 260, 190], [980, 220, 150]].map(([x, y, w], i) => ({ i, x, y, el: hanging(hangL, cloud(c, w, mix(C.cream, C.dusk, 0.35), mix(C.peach, C.duskViolet, 0.4)), { x, y, len: 900 }) }));
    const far = S.layer({ par: 0.1, sh: 2 });
    const fb = hillsWith(c, { y: 470, amps: [18, 8, 3], lens: [1000, 360, 130], color: mix(C.hillFar, C.duskViolet, 0.35), trees: 10, treeColor: mix(C.sage2, C.duskViolet, 0.35), treeH: 18 });
    far.add(fb.markup);
    /* the nations with their lamps on the hills (hidden until v21) */
    const natL = S.layer({ par: 0.14, sh: 3 });
    const NAT = [[330, 'mt12-hope-a', false], [560, 'mt12-hope-b', false], [1060, 'mt12-hope-c', true], [1290, 'mt12-hope-d', true]].map(([x, seed, flip], i) => ({ i, x, y: fb.fn(x) + 34, sp: natL.sprite(nationsMarkup(seed, 5, { s: 0.36, spread: 28, flip, armF: [70, 100] }), x, fb.fn(x) + 34) }));
    let lights = '';
    NAT.forEach((n) => { for (let k = 0; k < 5; k++) { const x = n.x + (k - 2) * 28 + (n.i > 1 ? -1 : 1) * 16, y = n.y - 58 + (k % 2) * 5; lights += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="16" fill="url(#warm-glow)"/><path d="M0 0C-3 -3 -3 -7 0 -12C3 -7 3 -3 0 0Z" fill="${C.lampFlame}"/></g>`; } });
    for (let k = 0; k < 26; k++) { const x = c.rr(-200, 1800), y = fb.fn(x) + c.rr(-6, 30); lights += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="10" fill="url(#warm-glow)"/><circle r="2.2" fill="${C.lampFlame}"/></g>`; }
    const mid = S.layer({ par: 0.2, sh: 3 });
    const mb = band(c, { y: 560, amps: [12, 5, 2], lens: [800, 300, 110], color: mix(C.hillMid, C.duskViolet, 0.25) });
    mid.add(mb.markup + olive(c, 1300, mb.fn(1300) + 8, 0.8) + olive(c, 330, mb.fn(330) + 8, 0.9));
    const water = S.layer({ par: 0.3, sh: 2 });
    water.add(waterBand(c, { y: 612, color: mix(C.lake, C.duskViolet, 0.3), foamN: 12, bottom: 900 }).markup);
    const bank = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(660, [5, 2], [600, 170]);
    bank.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sage2, C.duskViolet, 0.15)).out());
    bank.add(reeds(c, 560, 668, 11, 110, C.olive, C.wood3) + reeds(c, 760, 664, 7, 100, C.olive, C.wood3) + reeds(c, 1100, 670, 9, 96, C.olive, C.wood3) + rock(c, 960, 690, 60, 22, C.rock2) + grass(c, { x0: -600, x1: 2200, y: 666, fn: gfn, n: 30, h: 12, color: C.moss }));

    /* night over the land, and the little lights on top of it */
    const tint = S.layer({ par: 0.3, sh: 1, flat: true });
    tint.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".42"/>`);
    tint.fade(0);
    const lightsL = S.layer({ par: 0.14, sh: 1, flat: true });
    const lightsEl = lightsL.add(`<g opacity="0">${lights}</g>`);

    /* the bruised reed: a stalk, and its broken top on a hinge */
    const act = S.layer({ par: 0.45, sh: 5 });
    act.add(`<g transform="translate(${RX} ${RY})">${glow(60, 0.5)}${sheet().p(c.ribbon([[0, 0], [2, -100]], (u) => 5.4 - u * 1.6), C.olive).out()}</g>`);
    const top = act.add(`<g>${sheet().p(c.ribbon([[0, 0], [1, -84]], (u) => 3.8 - u * 1.8), C.olive).p(c.cut(c.ell(1, -98, 5.4, 17, 10), 0.2, 4), C.wood2).x(c.ribbon([[-3, 3], [4, -6]], 1.6), shade(C.olive, -0.4)).out()}</g>`);
    const splint = act.add(`<g opacity="0">${sheet().p(c.ribbon([[0, 6], [0, -136]], 4), C.wood3).x(c.ribbon([[-6, -86], [7, -91]], 3) + c.ribbon([[-6, -108], [7, -113]], 3), C.cream).out()}</g>`);
    const kneel = S.puppet(act.add(person(c, { ...CAST.jesus, pose: 'kneel' })));
    const jesus = S.puppet(act.add(person(c, { ...CAST.jesus })));
    const widowO = womanOf(c, { robe: mix(C.stone2, C.dustyBlue, 0.25), veil: C.stone, skin: C.skin3 });
    const widow = S.puppet(act.add(person(c, widowO)));
    const lampEl = act.add(`<g>${clayLamp(c)}</g>`);
    const fl = lampEl.querySelector('.fl'), sm = lampEl.querySelector('.sm');
    const cup = act.add(`<g opacity="0">${glow(80, 0.8)}</g>`);
    const sp = [0, 1, 2].map(() => act.add(`<g opacity="0">${sparkle(c, 10)}</g>`));

    /* justice to victory */
    const fx = S.layer({ par: 0.2, sh: 5 });
    const sc = scalesParts(c, { arm: 80, drop: 56, col: C.sun });
    const scl = { frame: fx.add(`<g>${sc.frame}</g>`), beam: fx.add(`<g>${sc.beam}</g>`), panL: fx.add(`<g>${sc.pan}</g>`), panR: fx.add(`<g>${sc.pan}</g>`) };
    const wreath = fx.add(`<g opacity="0">${glow(70, 0.8)}${laurel(c, 26, C.sun)}</g>`);

    const wK = [[0.85, 1180], [1.25, 940]];

    return (t, time) => {
      const T = time;
      const nightK = es(t, 2.0, 2.45);
      night.layer.fade(nightK);
      starL.fade(nightK);
      tint.fade(nightK);
      pose(sunEl, { x: 1150, y: 380 + nightK * 200, r: Math.sin(T * 0.6), oy: 0, o: 1 - nightK });
      cls.forEach((cl) => pose(cl.el, { x: cl.x + Math.sin(T * 0.1 + cl.i) * 20, y: cl.y, r: Math.sin(T * 0.6 + cl.i) * 1.1, oy: 0, o: 1 - nightK * 0.7 }));
      pose(moonEl, { x: 1190, y: lerp(-300, 160, es(t, 2.05, 2.45)), r: Math.sin(T * 0.6), oy: 0, o: nightK > 0.01 ? 1 : 0 });

      /* v20a — the bruised reed lifted and bound */
      const lift = es(t, 0.3, 0.6);
      const bound = es(t, 0.55, 0.7);
      pose(top, { x: RX + 3, y: RY - 100, r: lerp(118, 4, lift) + Math.sin(T * 1.2) * 1.2 * lift });
      pose(splint, { x: RX + 9, y: RY, o: bound });
      const standUp = es(t, 0.95, 1.02);
      kneel.set({ x: RX + 70, y: Y + 8, s: 1.02, flip: true, o: 1 - standUp, armF: 40 + lift * 50 - bound * 10, armB: 30 + lift * 40, head: 14, lean: -6, blink: blinkAt(T, 2) });

      /* v20b — the smouldering wick */
      const wx = kf(t, wK);
      const walking = t > 0.85 && t < 1.25;
      const cupK = es(t, 1.3, 1.45) * (1 - es(t, 1.7, 1.85));
      const lit = es(t, 1.45, 1.6);
      widow.set({ x: wx, y: Y + 4, s: 0.94, flip: true, o: es(t, 0.8, 0.9), walk: walking ? wx * 0.06 : undefined, armF: 70 + lit * 10, armB: 20 + lit * 60, head: 6 - lit * 8, blink: blinkAt(T, 5) });
      const [lhx, lhy] = handAt(wx, Y + 4, 0.94, true, 70 + lit * 10);
      pose(lampEl, { x: lhx - 8, y: lhy + 4, s: 1.5, sx: -1, o: es(t, 0.8, 0.9) });
      pose(sm, { x: 34, y: -20, sy: 0.8 + Math.sin(T * 2) * 0.1, o: 1 - lit });
      pose(fl, { x: 34, y: -19, s: lit * (1 + Math.sin(T * 8) * 0.06) + 0.001, o: lit });
      jesus.set({ x: JX + 40, y: Y, s: 1.06, flip: false, o: standUp, armF: 14 + cupK * 70 + es(t, 2.2, 2.5) * 30, armB: 8 + cupK * 70 + es(t, 2.2, 2.5) * 40, head: -2 + cupK * 10 - es(t, 2.2, 2.5) * 6, blink: blinkAt(T, 2) });
      pose(cup, { x: lhx - 58, y: lhy - 40, o: bump(t, 1.3, 1.9) });
      sp.forEach((s_, i) => {
        const k = es(t, 1.5 + i * 0.05, 1.7 + i * 0.05, ease.back) * (1 - es(t, 1.95, 2.1));
        pose(s_, { x: lhx - 60 + (i - 1) * 30, y: lhy - 80 - (i % 2) * 20, s: k, r: T * 30, o: k > 0.01 ? 1 : 0 });
      });
      const jd = es(t, 1.55, 1.85, ease.back) * (1 - es(t, 2.0, 2.3));
      poseScales(scl, JX + 40, lerp(-300, 320, jd), Math.sin(T * 0.8) * 1.2, jd > 0.01 ? 1 : 0, 1, 80);
      pose(wreath, { x: JX + 40, y: lerp(-300, 270, jd), s: 0.8 + es(t, 1.7, 1.85, ease.back) * 0.4, r: Math.sin(T * 0.6) * 4, o: es(t, 1.68, 1.78) * (1 - es(t, 2.0, 2.3)) });

      /* v21 — the nations light their lamps and hope */
      const hope = es(t, 2.15, 2.5);
      NAT.forEach((n) => n.sp.set({ x: n.x, y: n.y + (1 - hope) * 30, o: hope }));
      pose(lightsEl, { o: es(t, 2.3, 2.6) });

      S.cam.x = kf(t, [[-0.5, -20], [0.8, -20], [1.2, 20], [1.9, 20], [2.2, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.1], [0.3, 1.18], [0.8, 1.18], [1.2, 1.16], [1.9, 1.16], [2.3, 1.02]]);
      S.cam.y = kf(t, [[-0.5, 30], [0.3, 50], [0.8, 50], [1.2, 50], [1.9, 50], [2.3, 10]]);
    };
  },
};
