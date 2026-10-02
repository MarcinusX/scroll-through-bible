// Mt 23,16–19 — the third woe, in the court before the sanctuary. A man lifts his hand to swear by the sanctuary; the
// Pharisee waves it away — "That's nothing!" — but when the man swears by the gold of the Temple, a golden cord shoots
// from the gilt vessels and loops round his wrist: bound. "Blind fools!": a band falls over the Pharisee's eyes and he
// gropes about. A great balance comes down from the flies: the gold on one pan, the sanctuary on the other — the
// sanctuary sinks, heavier, and its light falls on the gold and makes it shine. The same again at the altar: by the
// altar, nothing; by the lamb laid on it, bound. "Blind!": he stumbles. The balance again: the gift against the altar
// — the altar outweighs it, and its fire lights the gift.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { templeCourt, pose3, folk, vain, PH, woeDrop, bubble, goldVessels, goldCord, templeModel, altar, lamb, balance, blindBand, addToHead, handAt, hang2, tr, SWEARER } from './lib.js';

const BX = 800;                       // the balance
const GOLD = [690, 0];
const FX = 560;                       // the Pharisee

export default {
  id: 'mt23-oaths',
  beats: [
    { v: 16 },
    { v: 17, text: 'Głupi i ślepi!' },
    { v: 17, cont: true, text: 'Cóż bowiem jest ważniejsze, złoto czy przybytek, który uświęca złoto?' },
    { v: 18 },
    { v: 19, text: 'Ślepi!' },
    { v: 19, cont: true, text: 'Cóż bowiem jest ważniejsze, ofiara czy ołtarz, który uświęca ofiarę?' },
  ],
  cam: { x: [0, 90], y: [-50, 10], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    // phone: the altar with its lamb comes in from under the progress thread, the man who swears with it
    const ALT = [S.portrait ? 1025 : 1150, 0];
    const MX = S.portrait ? 905 : 1000;   // the man who swears
    const set = templeCourt(S);
    const F = set.FLOOR;
    const stepL = S.layer({ par: 0.45, sh: 4 });
    stepL.sprite(pose3(c, Array.from({ length: 5 }, (_, i) => ({ x: i * 52 + c.rr(-6, 6), y: c.rr(-3, 3), s: 0.66, flip: false, head: c.rr(-6, 2), o: { ...folk(c), pose: 'sit' } }))), 330, 604);

    /* the gold, the altar with its lamb and fire */
    const P = S.layer({ par: 0.5, sh: 5 });
    P.add(`<g transform="translate(${GOLD[0]} ${F + 4})">${goldVessels(c)}</g>`);
    P.add(`<g transform="translate(${ALT[0]} ${F + 6})">${altar(c, 170, 96)}</g>`);
    const fire = P.add(`<g><circle cy="-30" r="90" fill="url(#warm-glow)"/><path d="M-30 0C-38 -20 -20 -40 -16 -64C-8 -40 0 -44 2 -80C10 -50 22 -46 20 -60C34 -40 36 -18 30 0Z" fill="${C.sunDeep}"/><path d="M-16 0C-20 -14 -8 -26 -4 -44C2 -26 12 -26 14 -36C22 -20 20 -8 16 0Z" fill="${C.lampFlame}"/></g>`);
    const lambEl = P.add(`<g>${lamb(c)}</g>`);

    /* the man who swears, the Pharisee who judges */
    const man = S.puppet(P.add(person(c, SWEARER)));
    const phar = S.puppet(P.add(vain(c, PH)));
    const pharB = S.puppet(P.add(addToHead(vain(c, PH, { eyes: 'closed' }), blindBand(c))));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const nada = fx.add(`<g>${bubble(c, tr('To nic!', 'It’s nothing!'), { size: 19, tail: -1 })}</g>`);
    const nada2 = fx.add(`<g>${bubble(c, tr('To nic!', 'It’s nothing!'), { size: 19, tail: -1 })}</g>`);
    // cords: from the gold, from the lamb, to the man's raised hand
    const HAND = [MX - 36, F - 196];
    const cord1 = fx.add(`<g>${goldCord(c, HAND[0] - GOLD[0], HAND[1] - (F - 70), 60)}</g>`);
    const cord2 = fx.add(`<g>${goldCord(c, HAND[0] - (ALT[0] - 30), HAND[1] - (F - 112), 30)}</g>`);

    /* the balance, from the flies */
    const B = balance(c, { arm: 170, h: 340, drop: 92 });
    const balL = S.layer({ par: 0.5, sh: 6 });
    const post = balL.add(`<g>${hang2(B.post, 30, 900)}</g>`);
    const beam = balL.add(`<g>${B.beam}</g>`);
    const panL = balL.add(`<g>${B.pan}</g>`);
    const panR = balL.add(`<g>${B.pan}</g>`);
    const onL = balL.add(`<g>${goldVessels(c)}</g>`);
    const onR = balL.add(`<g>${templeModel(c, 0.36, { glow: false })}</g>`);
    const onL2 = balL.add(`<g>${lamb(c)}</g>`);
    const onR2 = balL.add(`<g>${altar(c, 84, 50)}</g>`);
    const beamLight = balL.add(`<g><path d="M0 -8L1 -34L1 34L0 8Z" fill="#fff3cf" opacity=".55"/><path d="M0 -3L1 -12L1 12L0 3Z" fill="#fff8e2" opacity=".6"/></g>`);
    const woe = woeDrop(balL, c, 3, { x: S.portrait ? 1005 : 1240, y: 150 });   // phone: the woe-tag inside the screen

    set.front();

    return (t, time) => {
      const T = time;
      set.update(t, T);
      woe(es(t, 0.02, 0.25, ease.out) * (1 - es(t, 0.85, 1.0)), T);

      /* the man swears: v16 by the sanctuary, then by the gold; v18 by the altar, then by the lamb */
      const sw1 = bump(t, 0.08, 0.42), sw2 = es(t, 0.48, 0.6) * (1 - es(t, 1.9, 2.1));
      const sw3 = bump(t, 3.06, 3.42), sw4 = es(t, 3.48, 3.6) * (1 - es(t, 4.9, 5.1));
      const raised = Math.max(sw1, sw2, sw3, sw4);
      man.set({ x: MX, y: F + 8, s: 0.96, flip: t < 3 || t > 3.45, armB: raised * 150, armF: 20 + (sw2 + sw4) * 20, head: -raised * 10 + (sw2 + sw4) * 8, lean: (sw2 + sw4) * 4, blink: blinkAt(T, 2) });
      const k1 = es(t, 0.5, 0.64, ease.out) * (1 - es(t, 1.92, 2.05));
      pose(cord1, { x: GOLD[0], y: F - 70, s: k1, o: k1 > 0.02 ? 1 : 0 });
      const k2 = es(t, 3.5, 3.64, ease.out) * (1 - es(t, 4.92, 5.05));
      pose(cord2, { x: ALT[0] - 30, y: F - 112, s: k2, o: k2 > 0.02 ? 1 : 0 });

      /* the Pharisee: waves it away; then blind (v17a), stumbling (v19a) */
      const wave1 = bump(t, 0.15, 0.45), wave2 = bump(t, 3.12, 3.45);
      const blind = es(t, 1.04, 1.12);
      const grope = bump(t, 1.1, 1.95), stumble = bump(t, 4.05, 4.9);
      const fx_ = FX + stumble * 30 + grope * 14;
      const fp = { x: fx_, y: F, s: 0.98, armF: 20 + (wave1 + wave2) * 70 + (grope + stumble) * 70, armB: 10 + (wave1 + wave2) * 30 + (grope + stumble) * 50, head: -(wave1 + wave2) * 10 + stumble * 12, lean: stumble * 12 - grope * 4, walk: grope > 0.1 || stumble > 0.1 ? t * 30 : undefined, amt: 0.5, blink: blinkAt(T, 5) };
      phar.set({ ...fp, o: 1 - blind });
      pharB.set({ ...fp, o: blind });
      const n1 = es(t, 0.18, 0.28, ease.back) * (1 - es(t, 0.44, 0.5));
      pose(nada, { x: FX + 70, y: F - 210, s: n1, o: n1 > 0.02 ? 1 : 0 });
      const n2 = es(t, 3.18, 3.28, ease.back) * (1 - es(t, 3.44, 3.5));
      pose(nada2, { x: FX + 70, y: F - 210, s: n2, o: n2 > 0.02 ? 1 : 0 });

      /* the lamb on the altar, the fire */
      pose(lambEl, { x: ALT[0] - 20, y: F - 90, s: 0.9, o: 1 });
      pose(fire, { x: ALT[0] + 34, y: F - 92, s: 0.6 + (T ? Math.sin(T * 6) * 0.04 : 0), o: 0.9 });

      /* the balance: comes down for v17b (2.0) and v19b (5.0), rises between */
      const in1 = es(t, 1.95, 2.25, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      const in2 = es(t, 4.95, 5.25, ease.out);
      const inK = Math.max(in1, in2);
      const second = t > 4;
      const PY = F - 340 - (1 - inK) * 1000;
      const tilt = es(t, second ? 5.3 : 2.3, second ? 5.6 : 2.6) * -12;   // the right pan sinks (sanctuary / altar heavier)
      const rad = (tilt * Math.PI) / 180;
      pose(post, { x: BX, y: PY, o: inK > 0.01 ? 1 : 0 });
      pose(beam, { x: BX, y: PY, r: -tilt, o: inK > 0.01 ? 1 : 0 });
      const lx = BX - Math.cos(rad) * 170, ly = PY + Math.sin(rad) * 170;
      const rx = BX + Math.cos(rad) * 170, ry = PY - Math.sin(rad) * 170;
      pose(panL, { x: lx, y: ly, o: inK > 0.01 ? 1 : 0 });
      pose(panR, { x: rx, y: ry, o: inK > 0.01 ? 1 : 0 });
      pose(onL, { x: lx, y: ly + 90, s: 0.5, o: inK > 0.01 && !second ? 1 : 0 });
      pose(onR, { x: rx, y: ry + 90, s: 0.9, o: inK > 0.01 && !second ? 1 : 0 });
      pose(onL2, { x: lx - 4, y: ly + 90, s: 0.7, o: inK > 0.01 && second ? 1 : 0 });
      pose(onR2, { x: rx, y: ry + 90, s: 1, o: inK > 0.01 && second ? 1 : 0 });
      const shine = es(t, second ? 5.5 : 2.5, second ? 5.8 : 2.8) * inK;
      const sx0 = rx, sy0 = ry + 56, tx0 = lx, ty0 = ly + 66;
      pose(beamLight, { x: sx0, y: sy0, r: (Math.atan2(ty0 - sy0, tx0 - sx0) * 180) / Math.PI, sx: Math.hypot(tx0 - sx0, ty0 - sy0), sy: 1, o: shine });

      S.cam.x = es(t, 2.9, 3.2) * 70 * (1 - es(t, 4.9, 5.2));
      S.cam.y = -es(t, 1.9, 2.2) * 40 * (1 - es(t, 2.9, 3.2)) - es(t, 4.9, 5.2) * 40;
      S.cam.z = 1.02 + (es(t, 1.9, 2.2) * (1 - es(t, 2.9, 3.2)) + es(t, 4.9, 5.2)) * 0.03;
    };
  },
};
