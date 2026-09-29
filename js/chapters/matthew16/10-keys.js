// Mt 16,19–20 — "I will give you the keys of the Kingdom of Heaven": a band of golden cloud is let down with the gate of
// the Kingdom in it; two great keys, gold and silver, come down from the gate on a ribbon of light into Jesus' hands, and
// He gives them to Peter, kneeling. "Whatever you bind on earth…": Peter ties a knot in a cord between his hands — a
// thread of light runs up, and the same knot is tied in the golden cord under the gate of heaven. "…whatever you
// loose…": his knot comes undone, and up in heaven the golden cord falls open too. Then Jesus strictly charges them to
// tell no one that He is the Christ: heaven is drawn up, the banner "Messiah" is pulled back into the flies, and the
// disciples lay a finger on their lips. The Church on its rock stands behind them all the while.
import { C, person, CAST, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { headAt, hand, crossedKeys, kingdomGate, cloudBand, rockChurch, ropeHalf, knot, speech, wordSlip, tag, hangAt, caesareaSet, caesareaFront, CZ, DIS16, tr, PI } from './lib.js';

const GY = CZ.GROUND, JX = 760, PX = 930;
const GX = 760, GB = 292;                 // the gate of the Kingdom: bottom centre
const HC = 334;                           // the golden cord in heaven (y)

export default {
  id: 'mt16-keys',
  beats: [
    { v: 19, text: 'I tobie dam klucze królestwa niebieskiego;' },
    { v: 19, cont: true, text: 'cokolwiek zwiążesz na ziemi, będzie związane w niebie,' },
    { v: 19, cont: true, text: 'a co rozwiążesz na ziemi, będzie rozwiązane w niebie».' },
    { v: 20 },
  ],
  cam: { x: [-20, 40], y: [-60, 50], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const H = {};
    const Z = caesareaSet(S, {
      between(S2) {
        H.rockL = S2.layer({ par: 0.32, sh: 5 });
        H.rockL.add(`<g transform="translate(1110 646) scale(.78)">${rockChurch(c, { text: tr('Skała', 'Rock') })}</g>`);
      },
    });

    /* ---------- heaven let down: the cloud band, the gate, the golden cord ---------- */
    const hv = S.layer({ par: 0.5, sh: 6, pad: 560, rise: 0 });
    const G = kingdomGate(c, 120, 170);
    hv.add(cloudBand(c, { y: 176 }));
    hv.add(`<g transform="translate(${GX} ${GB})"><circle cy="-80" r="200" fill="url(#halo-glow)"/>${G.light}${G.frame}</g>`);
    const hfx = S.layer({ par: 0.5, sh: 4 });
    const hcL = hfx.add(`<g>${ropeHalf(c, 90, { col: C.sun, w: 6, sag: 4 })}</g>`);
    const hcR = hfx.add(`<g><g transform="scale(-1 1)">${ropeHalf(c, 90, { col: C.sun, w: 6, sag: 4 })}</g></g>`);
    const hKnot = hfx.add(`<g>${knot(c, { col: C.sun, r: 15 })}</g>`);
    const hTag = hfx.add(`<g>${tag(c, tr('w niebie', 'in heaven'), { size: 18, fill: C.halo })}</g>`);
    const ribbon = hfx.add(`<path d="M-3 0H3V-1H-3Z" fill="#fff3cf" opacity=".85"/>`);
    const beam = hfx.add(`<g><path d="M-9 0H9V-1H-9Z" fill="#fff3cf" opacity=".35"/><path d="M-3 0H3V-1H-3Z" fill="#fff8e2"/></g>`);
    /** stretch a thin upward strip from (x1, y1) towards (x2, y2), k of the way */
    const strip = (el, x1, y1, x2, y2, k, o) => pose(el, { x: x1, y: y1, r: (Math.atan2(x2 - x1, y1 - y2) * 180) / PI, sy: Math.max(0.01, Math.hypot(x2 - x1, y2 - y1) * k), o });

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const dis = DIS16.filter((d) => d.k !== 'peter').map((d, i) => ({ ...d, x: d.x < 800 ? d.x - 30 : d.x + 60, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const peter = S.puppet(P.add(person(c, { ...CAST.peter })));
    const peterK = S.puppet(P.add(person(c, { ...CAST.peter, pose: 'kneel' })));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const fx = S.layer({ par: 0.5, sh: 5 });
    const keys = fx.add(`<g>${crossedKeys(c, 110)}</g>`);
    const eL = fx.add(`<g>${ropeHalf(c, 60, { w: 6, sag: 3 })}</g>`);
    const eR = fx.add(`<g><g transform="scale(-1 1)">${ropeHalf(c, 60, { w: 6, sag: 3 })}</g></g>`);
    const eKnot = fx.add(`<g>${knot(c, { r: 15 })}</g>`);
    const eTag = fx.add(`<g>${tag(c, tr('na ziemi', 'on earth'), { size: 17 })}</g>`);
    const banner = fx.add(`<g><path d="M0 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${tag(c, tr('Mesjasz', 'the Christ'), { size: 28, w: 180, fill: C.halo })}</g>`);
    const hush = fx.add(`<g>${speech(c, `${wordSlip(c, 34)}<path d="M-16 -12L16 12M16 -12L-16 12" stroke="${C.terracotta}" stroke-width="4" stroke-linecap="round"/>`, { w: 58, h: 46 })}</g>`);
    caesareaFront(S);

    return (t, time) => {
      const T = time;
      Z.update(T, { gold: es(t, 0.02, 0.3) * (1 - es(t, 3.05, 3.4)) * 0.8 });

      /* heaven comes down (v19a) and is drawn up again (v20) */
      const hd = es(t, -0.1, 0.3, ease.out) * (1 - es(t, 3.05, 3.4, ease.in));
      hv.shift(0, -(1 - hd) * 540);
      hv.fade(Math.min(1, hd * 3));
      const hy = -(1 - hd) * 540;

      /* v19a — the keys come down from the gate into His hands; He gives them to Peter, who kneels */
      const kneel = es(t, 0.3, 0.36);
      const down = es(t, 0.15, 0.45);
      const give = es(t, 0.5, 0.72);
      const jArm = 16 + es(t, 0.3, 0.45) * 60 + give * 10 - es(t, 0.75, 0.9) * 40;
      jesus.set({ x: JX, y: GY, s: 1, flip: false, armF: jArm + bump(t, 3.05, 3.9) * 20, armB: 8 + es(t, 0.3, 0.45) * 50 * (1 - give) + es(t, 3.05, 3.3) * 150, head: 4 * give - es(t, 3.05, 3.3) * 4, blink: blinkAt(T) });
      const [jhx, jhy] = hand(JX, GY, 1, false, jArm);
      const holdUp = es(t, 0.72, 0.9);
      const pArm = 40 + give * 30 + holdUp * 60;
      const bindArms = es(t, 1.05, 1.2) * (1 - es(t, 2.95, 3.1));
      const pA = pArm * (1 - bindArms) + 58 * bindArms;
      peterK.set({ x: PX - 10, y: GY + 6, s: 0.92, flip: true, o: kneel * (1 - es(t, 3.05, 3.12)), armF: pA, armB: 20 + bindArms * 40, head: -10 - holdUp * 8 * (1 - bindArms) + bindArms * 10, blink: blinkAt(T, 1) });
      peter.set({ x: PX - 10, y: GY + 6, s: 0.92, flip: true, o: t < 1 ? 1 - kneel : es(t, 3.05, 3.12), armF: 20 + es(t, 3.5, 3.7) * 70, armB: 10, head: -8 + es(t, 3.5, 3.7) * 14, blink: blinkAt(T, 1) });
      const [phx, phy] = hand(PX - 10, GY + 6, 0.92, true, pA, 0, 46);
      // the keys: from the gate down the ribbon of light, into His hand, into Peter's
      const kx = give > 0 ? lerp(jhx, phx, give) : lerp(GX, jhx, down);
      const ky = give > 0 ? lerp(jhy, phy, give) - Math.sin(give * PI) * 40 - holdUp * 0 : lerp(GB + hy - 40, jhy, down);
      const kUp = holdUp * (1 - bindArms);
      pose(keys, { x: kx - 18 * give, y: ky + 4 - kUp * 16, s: 0.85 + kUp * 0.12, r: T ? Math.sin(T * 1.4) * 4 : 0, o: t > 0.12 && t < 1.08 ? 1 : 0 });
      strip(ribbon, kx, ky - 30, GX, GB + hy, 1, bump(t, 0.12, 0.55) * 0.9);

      /* v19b — bind: the knot on earth, the thread of light, the knot in heaven; v19c — loose them */
      const [bx, by] = [phx - 6, phy - 6];
      const tie = es(t, 1.2, 1.4);
      const loose = es(t, 2.1, 2.3);
      const eOn = es(t, 1.05, 1.15) * (1 - es(t, 2.95, 3.1));
      const gap = (1 - tie) * 18 + loose * 18;
      pose(eL, { x: bx - 60 - gap, y: by, r: loose * 70, o: eOn });
      pose(eR, { x: bx + 60 + gap, y: by, r: -loose * 70, o: eOn });
      const ek = es(t, 1.32, 1.42, ease.back) * (1 - es(t, 2.1, 2.2));
      pose(eKnot, { x: bx, y: by, s: ek * 1.1, o: ek > 0.02 ? 1 : 0 });
      pose(eTag, { x: bx, y: by + 40, s: eOn, o: eOn > 0.02 ? 1 : 0 });
      const up1 = es(t, 1.45, 1.62), up2 = es(t, 2.3, 2.47);
      const shoot = Math.max(bump(t, 1.42, 1.8) * (up1 > 0 ? 1 : 0), bump(t, 2.27, 2.65) * (up2 > 0 ? 1 : 0));
      const bUp = t < 2 ? up1 : up2;
      strip(beam, bx, by - 14, GX, HC + hy + 14, bUp, shoot);
      const hTie = es(t, 1.6, 1.72);
      const hLoose = es(t, 2.45, 2.62);
      const hOn = es(t, 1.05, 1.2) * (1 - es(t, 2.95, 3.1));
      const hg = (1 - hTie) * 26 + hLoose * 26;
      pose(hcL, { x: GX - 90 - hg, y: HC + hy, r: hLoose * 70, o: hOn });
      pose(hcR, { x: GX + 90 + hg, y: HC + hy, r: -hLoose * 70, o: hOn });
      const hk = es(t, 1.66, 1.76, ease.back) * (1 - es(t, 2.45, 2.55));
      pose(hKnot, { x: GX, y: HC + hy, s: hk * 1.2, o: hk > 0.02 ? 1 : 0 });
      pose(hTag, { x: GX + 170, y: HC + hy - 40, s: hOn, o: hOn > 0.02 ? 1 : 0 });

      /* v20 — tell no one: the banner is pulled up, fingers to lips */
      const bn = es(t, 3.0, 3.2, ease.out) * (1 - es(t, 3.45, 3.8, ease.in));
      hangAt(banner, JX, lerp(-700, 170, bn), T, 1, 0.8, 4);
      const hs = es(t, 3.3, 3.45, ease.back) * (1 - es(t, 3.95, 4));
      const [jx2, jy2] = headAt(JX, GY, 1, false);
      pose(hush, { x: jx2 + 18, y: jy2 - 32, s: hs, o: hs > 0.02 ? 1 : 0 });
      dis.forEach((d) => {
        const lookUp = es(t, 0.1, 0.4) * (1 - es(t, 2.95, 3.2));
        const lips = es(t, 3.5 + d.i * 0.04, 3.7 + d.i * 0.04);
        d.p.set({ x: d.x, y: GY + 4 + (d.i % 2) * 8, s: 0.86, flip: d.x > JX, armF: 18 + lookUp * 20 + lips * 70, armB: 10 + lookUp * 30, head: -lookUp * 14 + lips * 14, blink: blinkAt(T, d.seed) });
      });

      S.cam.x = 10;
      S.cam.z = 1.08 - es(t, 1.0, 1.3) * 0.06 + es(t, 3.0, 3.4) * 0.04;
      S.cam.y = 10 - es(t, 1.0, 1.3) * 60 + es(t, 3.0, 3.4) * 60;
    };
  },
};
