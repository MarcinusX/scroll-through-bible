// Mk 2,25b–26 — the story Jesus recalls, painted on parchment: hungry David and his companions
// come to the house of God; the high priest Abiathar gives them the holy bread.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, cloud, sun } from '../../assets/nature.js';
import { paperLabel, rays } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, hand, headAt, addToHead, addToBody, breastplate, turban, circlet, loaf, menorah, plateDisc, spark } from './lib.js';

const PI = Math.PI;
const Y = 690;
const TENT = { x0: 760, x1: 1260, top: 360, door0: 826, door1: 972 };
const TABLE = { x: 900, top: 612 };

export default {
  id: 'm2-david',
  enter: 'fly',
  beats: [
    { v: 25, cont: true, text: 'kiedy znalazł się w potrzebie, i był głodny on i jego towarzysze?' },
    { v: 26, text: 'Jak wszedł do domu Bożego za Abiatara, najwyższego kapłana,' },
    { v: 26, cont: true, text: 'i jadł chleby pokładne, które tylko kapłanom jeść wolno;' },
    { v: 26, cont: true, text: 'i dał również swoim towarzyszom».' },
  ],
  cam: { x: [-340, 20], y: [-30, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    // an old picture: parchment sky, sepia hills
    sky(S, [mix(C.parchment, C.dawn, 0.4), C.parchment, mix(C.cream, C.sand, 0.4)]);
    const hangL = S.layer({ par: 0.05, sh: 4 });
    const SUNX = S.portrait ? 560 : 470;   // phone: not cut by the left edge
    const sunEl = hanging(hangL, sun(c, 42, { rays: C.ochre, disc: mix(C.sun, C.parchment, 0.3), inner: mix(C.sun, C.cream, 0.5) }), { x: SUNX, y: 170, len: 700 });
    const cl = hanging(hangL, cloud(c, 170, C.cream, C.parchment), { x: 1150, y: 160, len: 700 });
    const far = S.layer({ par: 0.12, sh: 2 });
    far.add(band(c, { y: 450, amps: [26, 10, 3], lens: [900, 330, 120], color: mix(C.dune, C.parchment, 0.45) }).markup);
    const mid = S.layer({ par: 0.25, sh: 3 });
    mid.add(band(c, { y: 540, amps: [14, 6, 2], lens: [800, 300, 110], color: mix(C.sand2, C.dune, 0.4) }).markup);
    const ground = S.layer({ par: 0.4, sh: 3 });
    ground.add(sheet().p(c.ridge(c.wave(610, [4, 2], [700, 180]), -900, 2500, 1700, 12, 1), mix(C.sand, C.sand2, 0.4)).out());
    // a little heat shimmer over the road
    const heat = ground.add(`<g>${[0, 1, 2].map((i) => `<path d="${c.ribbon(c.cbez([0, 0], [12, -26], [-12, -52], [0, -80], 14), 3)}" fill="${C.apricot}" opacity=".45" transform="translate(${300 + i * 90} 640)"/>`).join('')}</g>`);

    /* the house of God: a tent of blue, purple and scarlet */
    const tentIn = S.layer({ par: 0.5, sh: 3 });
    tentIn.add(`<rect x="${TENT.door0}" y="440" width="${TENT.door1 - TENT.door0}" height="${Y - 440}" fill="${mix(C.soilDark, C.plumRobe, 0.3)}"/>`);
    const inGlow = tentIn.add(`<g opacity="0"><circle cx="${TABLE.x}" cy="560" r="180" fill="url(#warm-glow)"/></g>`);
    const tb = sheet();
    tb.p(c.cut(c.rect(TABLE.x - 44, TABLE.top, 88, 8), 0.3, 5), C.sun);
    tb.p(c.cut(c.rect(TABLE.x - 38, TABLE.top + 8, 6, Y - TABLE.top - 8), 0.2, 4) + c.cut(c.rect(TABLE.x + 32, TABLE.top + 8, 6, Y - TABLE.top - 8), 0.2, 4), shade(C.sun, -0.15));
    tentIn.add(tb.out());
    tentIn.add(`<g transform="translate(${TABLE.x + 50} ${Y})">${menorah(c, 110)}</g>`);
    // two stacks of six loaves (the top ones are handed out)
    const LOAVES = [];
    [-18, 18].forEach((dx, si) => { for (let k = 0; k < 6; k++) LOAVES.push({ si, k, el: tentIn.add(`<g transform="translate(${TABLE.x + dx} ${TABLE.top - k * 7})">${loaf(c, 14, mix(C.wheat2, C.sun, 0.2))}</g>`) }); });
    const tent = S.layer({ par: 0.5, sh: 5 });
    const ts = sheet();
    const door = [[TENT.door0, Y + 2], [TENT.door0, 470], ...c.arc((TENT.door0 + TENT.door1) / 2, 470, (TENT.door1 - TENT.door0) / 2, 36, PI, 2 * PI, 10), [TENT.door1, Y + 2]];
    ts.p(c.cut([[TENT.x0, Y + 2], [TENT.x0, 450], [TENT.x0 + 60, TENT.top], [TENT.x1 - 60, TENT.top], [TENT.x1, 450], [TENT.x1, Y + 2]], 1, 10) + c.hole(door, 0.5, 6), C.linen2);
    ts.x(c.ribbon([[TENT.x0 + 60, TENT.top + 6], [TENT.x1 - 60, TENT.top + 6]], 8), C.dustyBlue);
    ts.x(c.ribbon([[TENT.x0 + 30, 404], [TENT.x1 - 30, 404]], 7), C.plumRobe);
    ts.x(c.ribbon([[TENT.x0 + 4, 446], [TENT.door0, 446]], 7) + c.ribbon([[TENT.door1, 446], [TENT.x1 - 4, 446]], 7), C.terracotta);
    let folds = '';
    for (let x = TENT.x0 + 30; x < TENT.x1 - 20; x += 44) if (x < TENT.door0 - 10 || x > TENT.door1 + 10) folds += c.ribbon([[x, 460], [x + c.rr(-3, 3), Y]], 2);
    ts.x(folds, shade(C.linen2, -0.12), 'opacity=".7"');
    ts.p(c.cut(c.rect(TENT.x0 - 6, 440, 10, Y - 440), 0.3, 6) + c.cut(c.rect(TENT.x1 - 4, 440, 10, Y - 440), 0.3, 6), C.wood2);
    // guy ropes and pegs
    ts.x(c.ribbon([[TENT.x0 + 60, TENT.top], [TENT.x0 - 60, Y]], 1.4) + c.ribbon([[TENT.x1 - 60, TENT.top], [TENT.x1 + 60, Y]], 1.4), C.rope);
    tent.add(ts.out());
    const flapL = tent.add(`<g>${sheet().p(c.cut([[0, 0], [(TENT.door1 - TENT.door0) / 2 + 4, 0], [(TENT.door1 - TENT.door0) / 2 + 4, Y - 440], [0, Y - 440]], 0.6, 8), C.plumRobe).x(c.ribbon([[10, 10], [12, Y - 450]], 2) + c.ribbon([[36, 10], [38, Y - 450]], 2), shade(C.plumRobe, 0.2), 'opacity=".6"').out()}</g>`);
    const flapR = tent.add(`<g>${sheet().p(c.cut([[-(TENT.door1 - TENT.door0) / 2 - 4, 0], [0, 0], [0, Y - 440], [-(TENT.door1 - TENT.door0) / 2 - 4, Y - 440]], 0.6, 8), C.dustyBlue).x(c.ribbon([[-12, 10], [-14, Y - 450]], 2) + c.ribbon([[-38, 10], [-40, Y - 450]], 2), shade(C.dustyBlue, 0.2), 'opacity=".6"').out()}</g>`);

    /* people */
    const act = S.layer({ par: 0.55, sh: 5 });
    const priest = S.puppet(act.add(addToBody(addToHead(person(c, { robe: C.linen, mantle: C.dustyBlue, hair: C.greyHair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.terracotta }), turban(c)), breastplate(c))));
    const COMP = [
      { robe: C.clayMantle, hair: C.hair3, hairStyle: 'wrap', veil: C.stone, beard: 'short', skin: C.skin3, belt: C.leather },
      { robe: C.sageRobe, hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin2, belt: C.leather },
      { robe: C.ochreRobe, hair: C.hair2, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.leather },
    ].map((o, i) => ({ i, o, seed: c.rr(0, 9), p: S.puppet(act.add(person(c, o))) }));
    const david = S.puppet(act.add(addToHead(person(c, { robe: C.roseRobe, mantle: C.terracotta, hair: '#a4552f', hairStyle: 'curly', beard: 'short', beardColor: '#a4552f', skin: C.skin, belt: C.leather }), circlet(c))));
    const bread = [0, 1, 2, 3].map((i) => act.add(`<g>${loaf(c, 17, shade(C.wheat2, -0.08))}</g>`));
    const pouch = act.add(`<g>${sheet().p(c.cut([[-9, 0], [9, 0], [12, 18], [0, 24], [-12, 18]], 0.4, 4), C.leather).p(c.ribbon([[-8, 2], [8, 2]], 3), C.rope).out()}</g>`);

    /* labels and the sign of the priests' bread */
    const fx = S.layer({ par: 0.58, sh: 4 });
    const tagD = hanging(fx, paperLabel(tr('Dawid', 'David'), { size: 22 }), { x: 0, y: 0, len: 500 });
    const tagA = hanging(fx, paperLabel(tr('Abiatar', 'Abiathar'), { size: 22 }), { x: 0, y: 0, len: 500 });
    const sign = hanging(fx, `${plateDisc(c, 40, C.cream, C.sun)}<g transform="translate(0 6) scale(1.3)">${turban(c)}</g><g transform="translate(0 30) scale(.8)">${loaf(c, 14, C.wheat2)}</g><g transform="translate(0 56)">${paperLabel(tr('tylko dla kapłanów', 'only for the priests'), { size: 16 })}</g>`, { x: TABLE.x, y: 330, len: 700 });
    const burst = fx.add(`<g opacity="0">${rays(c, { n: 12, r0: 20, r1: 110, spread: 0.06, color: '#fff3cf' })}</g>`);
    const sparks = [0, 1, 2].map(() => fx.add(`<g>${spark(c, 9)}</g>`));

    // the travellers' road
    const dKeys = [[-0.6, 180], [0.9, 540], [1.05, 540], [1.45, 650]];
    const cX = (i) => (S.portrait ? [466, 404, 342] : [452, 372, 292])[i];   // phone: the companions closer together

    return (t, time) => {
      const T = time;
      swing(sunEl, SUNX, 170, T, 1, 0.6);
      swing(cl, 1150 + Math.sin(T * 0.1) * 20, 160, T, 1.1, 0.6, 1);
      pose(heat, { y: -((T * 16) % 16), o: 1 - es(t, 1.0, 1.4) });

      /* David and his companions arrive, hungry */
      const dx = kf(t, dKeys);
      const hungry = 1 - es(t, 2.4, 2.8);
      const walkingD = moving(t, dKeys);
      const eatD = bump(t, 2.3, 2.7) + bump(t, 2.75, 3.0) * 0.6;
      const giveK = [es(t, 3.05, 3.3), es(t, 3.2, 3.45), es(t, 3.35, 3.6)];
      const turnBack = es(t, 3.0, 3.08) * (1 - es(t, 3.7, 3.8));
      david.set({ x: dx, y: Y, s: 1.0, flip: turnBack > 0.5, walk: walkingD ? dx * 0.05 : undefined, armF: hungry * 50 * (1 - es(t, 1.9, 2.05)) + es(t, 1.9, 2.05) * 70 + eatD * 50 + turnBack * 40, armB: bump(t, 0.3, 0.9) * 90, head: hungry * 12 - eatD * 6 - es(t, 1.05, 1.3) * 10 * (1 - es(t, 1.9, 2.1)), lean: hungry * 6, blink: blinkAt(T, 2) });
      COMP.forEach((m) => {
        const x = kf(t, dKeys.map(([k, v]) => [k + 0.08 * (m.i + 1), v - (540 - cX(m.i))]));
        const got = giveK[m.i];
        const eat = bump(t, 3.35 + m.i * 0.15, 3.85 + m.i * 0.1);
        const glad = es(t, 3.5 + m.i * 0.12, 3.8 + m.i * 0.12);
        m.p.set({ x, y: Y + (m.i % 2 ? 6 : -4), s: 0.96, flip: false, walk: moving(t, dKeys.map(([k, v]) => [k + 0.08 * (m.i + 1), v])) ? x * 0.05 + m.i : undefined, armF: 40 * (1 - glad) + got * 40 + eat * 40, armB: glad * 60, head: 12 * (1 - glad) - eat * 6 - glad * 4, lean: 7 * (1 - glad), blink: blinkAt(T, m.seed) });
      });
      // the empty pouch turned upside down
      const [phx, phy] = hand(dx, Y, 1.0, false, bump(t, 0.3, 0.9) * 90);
      pose(pouch, { x: phx - 14, y: phy - 4, r: 180 * es(t, 0.4, 0.6), o: bump(t, 0.3, 0.95) > 0.02 ? 1 : 0 });

      /* the priest at the door of the tent */
      const greet = es(t, 1.1, 1.35);
      const give = bump(t, 1.95, 2.35);
      priest.set({ x: 790, y: Y + 4, s: 1.02, flip: true, armF: greet * 50 * (1 - give) + give * 80, armB: greet * 60, head: -2, blink: blinkAt(T, 7) });
      const open = es(t, 1.15, 1.5);
      pose(flapL, { x: TENT.door0, y: 440, sx: 1 - open * 0.78 });
      pose(flapR, { x: TENT.door1, y: 440, sx: 1 - open * 0.78 });
      fade(inGlow, open * 0.9);
      pose(burst, { x: TABLE.x, y: 560, s: 0.6 + open * 0.6, r: T * 5, o: bump(t, 1.2, 2.1) * 0.7 });

      /* loaves: the top four go to David and his friends */
      const takeT = [1.92, 2.8, 2.85, 2.9];
      LOAVES.forEach((L) => {
        const top = L.k >= 4;
        const idx = top ? (L.si * 2 + (L.k - 4)) : -1;
        fade(L.el, idx >= 0 ? 1 - seg(t, takeT[idx], takeT[idx] + 0.04) : 1);
      });
      bread.forEach((b, i) => {
        const t0 = takeT[i];
        let x, y, s = 1, o = 0;
        const src = [TABLE.x + (i < 2 ? -18 : 18), TABLE.top - (i % 2 ? 35 : 28)];
        const [ph, pv] = hand(790, Y + 4, 1.02, true, 80);
        if (i === 0) {
          // priest hands it to David, who eats it
          const toP = es(t, t0, t0 + 0.12), toD = es(t, 2.15, 2.35);
          const [dhx, dhy] = hand(dx, Y, 1.0, false, 70 + eatD * 50);
          x = lerp(lerp(src[0], ph, toP), dhx, toD); y = lerp(lerp(src[1], pv, toP), dhy, toD);
          s = 1 - es(t, 2.45, 2.9) * 0.7; o = seg(t, t0, t0 + 0.02) * (1 - es(t, 2.85, 2.95));
        } else {
          // David passes loaves on to his companions
          const m = COMP[i - 1];
          const mx = kf(t, dKeys.map(([k, v]) => [k + 0.08 * (m.i + 1), v - (540 - cX(m.i))]));
          const toD = es(t, t0, t0 + 0.15), toC = giveK[m.i];
          const [dhx, dhy] = hand(dx, Y, 1.0, true, 70);
          const [chx, chy] = hand(mx, Y + (m.i % 2 ? 6 : -4), 0.96, false, 40 + giveK[m.i] * 40);
          x = lerp(lerp(src[0], dhx, toD), chx, toC); y = lerp(lerp(src[1], dhy, toD), chy, toC) - Math.sin(toC * PI) * 30;
          s = 1 - es(t, 3.5 + m.i * 0.12, 3.9 + m.i * 0.1) * 0.6; o = seg(t, t0, t0 + 0.02);
        }
        pose(b, { x, y, s, o });
      });

      /* labels & the sign */
      const [dhx_, dhy_] = headAt(dx, Y, 1.0, false);
      const ld = es(t, 0.15, 0.5, ease.back) * (1 - es(t, 1.9, 2.1) * 0.0);
      pose(tagD, { x: dhx_, y: lerp(-200, dhy_ - 70, ld), r: Math.sin(T * 1.1) * 3, o: ld > 0.01 ? 1 : 0 });
      const la = es(t, 1.1, 1.4, ease.back);
      pose(tagA, { x: 792, y: lerp(-200, Y - 290, la), r: Math.sin(T * 1.1 + 2) * 3, o: la > 0.01 ? 1 : 0 });
      const sg = es(t, 2.05, 2.4, ease.back);
      pose(sign, { x: TABLE.x + (S.portrait ? 40 : 90), y: lerp(-200, 230, sg), r: Math.sin(T * 0.9) * 2, o: sg > 0.01 ? 1 : 0 });
      sparks.forEach((sp, i) => {
        const k = es(t, 3.55 + i * 0.1, 3.8 + i * 0.1, ease.back);
        const m = COMP[i];
        // over the companion where he ends up (not where he started walking)
        const mx = kf(t, dKeys.map(([k, v]) => [k + 0.08 * (m.i + 1), v - (540 - cX(m.i))]));
        const [hx, hy] = headAt(mx, Y + (m.i % 2 ? 6 : -4), 0.96, false);
        pose(sp, { x: hx + 4, y: hy - 58, s: k * 0.8,   // just over his own head (beside it, it read as a stray spark by a neighbour's face)
          r: T * 30, o: k > 0.01 ? 1 : 0 });
      });

      // phone: further left, so David's hungry companions are on screen with the priest
      const P = S.portrait;
      S.cam.x = kf(t, [[-0.6, P ? -320 : -40], [0.9, P ? -320 : -40], [1.3, P ? -80 : 0], [2.9, P ? -80 : 0], [3.2, P ? -100 : -40]]);
      S.cam.z = kf(t, [[-0.6, 1.02], [1.3, 1.04], [1.9, 1.1], [2.9, 1.1], [3.2, 1.04]]);
      S.cam.y = kf(t, [[-0.6, 20], [1.9, 30], [3.2, 20]]);
    };
  },
};
