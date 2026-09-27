// J 18,12–14 — the tribune (in colour, crest across his helmet) signs, two of the shadow soldiers step up either side
// and take hold of Him; the Eleven melt away into the dark grove, their little lights going out one by one. "They bound
// Him": a rope loops round His wrists and a guard takes the end. "And led Him to Annas first": the whole torchlit
// column turns and climbs the zigzag back up to the city, Him in the middle — Peter and one other following far behind.
// "He was father-in-law to Caiaphas, high priest that year": two portraits hang in the night sky, joined by a cord.
// "It was Caiaphas who advised that it was expedient that one man should perish for the people": the balance from
// John 11 comes down again — the one small haloed portrait on one pan, the whole people on the other.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  nightSet, gardenTrees, BAND, DIS, ARREST, eleven, lamp, makeBand, bandPose, torchLine, centurion, ropeHands, leadRope, nameTag, medallion, peopleIcon,
  balanceRig, annas, highPriest, hanging, vis, kf, moving, hand, headAt, withFace, faceBits, person, pose, fade, lerp, mix, tr, blinkAt, C, JESUS, TW, ANNAS, HP, PI, nt,
} from './lib.js';

const { GY, JX } = ARREST;
const TX = 600;               // the tribune

export default {
  id: 'j18-bound',
  beats: [
    { v: 12, text: 'Wówczas kohorta oraz trybun razem ze strażnikami żydowskimi pojmali Jezusa,' },
    { v: 12, cont: true, text: 'związali Go' },
    { v: 13, text: 'i zaprowadzili najpierw do Annasza.' },
    { v: 13, cont: true, text: 'Był on bowiem teściem Kajfasza, który owego roku pełnił urząd arcykapłański.' },
    { v: 14 },
  ],
  cam: { x: [-160, 60], y: [-260, 60], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    const N = nightSet(S, { zigzag: true, cityX: 520, moonAt: [1250, 130] });
    const up = torchLine(S, N.torchL, [...N.zz].reverse(), 13, 0.045);
    const treesL = S.layer({ par: 0.5, sh: 3 });
    gardenTrees(S, treesL, GY);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const pool = glowL.add(`<g><ellipse cx="0" cy="-110" rx="420" ry="260" fill="url(#warm-glow)" opacity=".55"/></g>`);

    const bandL = S.layer({ par: 0.5, sh: 5 });
    const flameL = S.layer({ par: 0.5, sh: 0, flat: true });
    const band = makeBand(S, bandL, flameL, BAND);
    const peopleL = S.layer({ par: 0.5, sh: 5 });
    const trib = S.puppet(peopleL.add(centurion(c)));
    const judas = S.puppet(peopleL.add(withFace(person(c, TW.judas), faceBits(c))));
    const { J, D } = eleven(S, peopleL, { gy: GY, pos: DIS });
    const jBoundEl = peopleL.add(withFace(person(c, { ...JESUS, holdF: ropeHands(c) }), faceBits(c)));
    const jBound = S.puppet(jBoundEl);
    const rope = peopleL.add(`<g>${leadRope(c)}</g>`);

    // plates in the night sky
    const fx = S.layer({ par: 0.3, sh: 5 });
    const toAnnas = hanging(fx, nameTag(c, tr('najpierw do Annasza', 'to Annas first'), { size: 17 }), { x: 0, y: 0, len: 800 });
    const famL = S.layer({ par: 0.3, sh: 5 });
    const aMed = hanging(famL, `${medallion(c, ANNAS, { r: 40, rim: C.ochre, back: C.parchment })}<g transform="translate(0 52)">${nameTag(c, tr('Annasz', 'Annas'), { size: 16 })}</g>`, { x: 0, y: 0, len: 800 });
    const cMed = hanging(famL, `${medallion(c, HP, { r: 40, rim: C.ochre, back: C.parchment })}<g transform="translate(0 52)">${nameTag(c, [tr('Kajfasz', 'Caiaphas'), tr('arcykapłan owego roku', 'high priest that year')], { size: 15 })}</g>`, { x: 0, y: 0, len: 800 });
    const link = famL.add(`<g><path d="${c.ribbon(c.qbez([0, 0], [110, 40], [220, 0], 16), 3)}" fill="${C.haloRim}"/><g transform="translate(110 30)">${nameTag(c, tr('teść', 'father-in-law'), { size: 14 })}</g></g>`);
    const balL = S.layer({ par: 0.3, sh: 5 });
    const bal = balanceRig(S, balL, 150);
    const one = balL.add(`<g><circle r="46" fill="url(#halo-glow)"/>${medallion(c, JESUS, { r: 22, rim: C.haloRim, back: C.halo })}</g>`);
    const many = balL.add(`<g>${peopleIcon(c, 10, mix(C.plumRobe, C.ink, 0.3), 100)}</g>`);
    const oneTag = hanging(balL, nameTag(c, tr('jeden człowiek za naród', 'one man for the people'), { size: 17 }), { x: 0, y: 0, len: 800 });

    return (t, time) => {
      const T = time;
      N.update(T);

      /* v12 — seized and bound; the Eleven slip away */
      const seize = es(t, 0.2, 0.7, ease.out);
      const bind = es(t, 1.1, 1.4);
      const swap = es(t, 1.2, 1.26);
      const go = es(t, 2.05, 2.9, ease.sine);             // the column walks away to the left
      const walkX = go * -900;
      const gone = es(t, 2.6, 2.95);
      band.forEach((m) => {
        let x = m.x - 40, y = GY + m.y, flip = false;
        if (m.i === 0) { x = lerp(x, JX - 70, seize); y = lerp(y, GY + 12, seize); }
        if (m.i === 1) { x = lerp(x, JX + 80, seize); y = lerp(y, GY - 4, seize); flip = seize > 0.5; }
        const turn = go > 0.02;
        bandPose(m, { x: x + walkX, y, s: m.s ?? 1, flip: turn ? true : flip, o: 1 - gone, walk: go > 0 && go < 1 ? x * 0.05 + m.i : undefined, head: 0 }, T);
      });
      vis(pool, { x: 470 + seize * 120 + walkX, y: GY, o: 1 - gone });
      const tp = es(t, 0.05, 0.3);
      trib.set({ x: TX + walkX, y: GY + 12, s: 1.02, flip: go > 0.02, o: 1 - gone, walk: go > 0 && go < 1 ? TX * 0.05 + walkX * 0.05 : undefined, armF: 20 + tp * 60 * (1 - es(t, 0.8, 1.0)), armB: 8, head: -tp * 4, blink: blinkAt(T, 4) });
      judas.set({ x: 500 + walkX, y: GY + 4, s: 1.0, flip: go > 0.02, o: 1 - gone, walk: go > 0 && go < 1 ? walkX * 0.05 : undefined, armF: 16, armB: 8, head: 12, blink: blinkAt(T, 2) });

      J.p.set({ x: JX, y: GY + 6, s: 1.04, flip: true, o: 1 - swap, armF: 20 + bump(t, 0.6, 1.2) * 10, armB: 10, head: 6, blink: blinkAt(T) });
      const jxw = JX + walkX;
      jBound.set({ x: jxw, y: GY + 6, s: 1.04, flip: true, o: swap * (1 - gone), walk: go > 0 && go < 1 ? jxw * 0.05 : undefined, amt: 0.7, armF: 26, armB: 12, head: 6 + bind * 4, blink: blinkAt(T) });
      fade(J.sad, 0);
      // the lead rope: from His hands to the guard in front
      const [hx, hy] = hand(jxw, GY + 6, 1.04, true, 26);
      const g0 = band[0];
      const gx = lerp(g0.x - 40, JX - 70, seize) + walkX, [gHx, gHy] = hand(gx, GY + 12, 1, true, 40);
      const dx = gHx - hx, dy = gHy - hy, len = Math.hypot(dx, dy);
      vis(rope, { x: hx, y: hy, r: (Math.atan2(dy, dx) * 180) / PI, sx: (len / 100) * bind, sy: 1, o: bind > 0.01 ? 1 - gone : 0 });

      D.forEach((m) => {
        const keep = m.k === 'peter' || m.k === 'john';
        const k = keep ? 0 : es(t, 0.4 + m.i * 0.06, 1.1 + m.i * 0.06, ease.in);
        const follow = keep ? es(t, 2.4, 2.98, ease.sine) : 0;
        const x = m.x + k * 500 - follow * 700;
        m.p.set({ x, y: m.y, s: m.s, flip: !(follow > 0.02), o: (1 - k) * (1 - es(t, 2.8, 2.98) * (keep ? 1 : 0)), walk: (k > 0 && k < 1) || (follow > 0 && follow < 1) ? x * 0.06 : undefined, armF: m.arm, armB: 8 + seize * 30, head: -seize * 5, blink: blinkAt(T, m.seed) });
        fade(m.sad, seize * 0.9);
        lamp(m, 0.9 * (1 - k), 0, T);
      });

      /* v13 — up the zigzag to Annas */
      up(es(t, 2.3, 3.4, ease.sine) * 1.55, 1 - es(t, 4.6, 5.0) * 0.4, T);
      const ta = es(t, 2.4, 2.7, ease.out) * (1 - es(t, 2.95, 3.1, ease.in));
      vis(toAnnas, { x: 540, y: 250 - (1 - ta) * 800, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: ta > 0.01 ? 1 : 0 });
      const fk = es(t, 3.05, 3.4, ease.out) * (1 - es(t, 3.95, 4.1, ease.in));
      const fy = 220 - (1 - fk) * 800;
      vis(aMed, { x: 700, y: fy, r: T ? Math.sin(T * 0.8) * 1.2 : 0, o: fk > 0.01 ? 1 : 0 });
      vis(cMed, { x: 940, y: fy, r: T ? Math.sin(T * 0.8 + 1) * 1.2 : 0, o: fk > 0.01 ? 1 : 0 });
      const lk = es(t, 3.3, 3.5);
      vis(link, { x: 710, y: fy + 4, sx: lk, o: lk > 0.01 && fk > 0.01 ? 1 : 0 });

      /* v14 — the balance: one man for the people */
      const bk = es(t, 4.05, 4.4, ease.out);
      const tilt = es(t, 4.45, 4.8) * 14;
      const by = 150 - (1 - bk) * 800;
      const [[lx, ly], [rx, ry]] = bal.set(830, by, tilt, bk > 0.01 ? 1 : 0);
      vis(one, { x: lx, y: ly + 64, o: bk > 0.01 ? 1 : 0 });
      vis(many, { x: rx, y: ry + 66, s: 0.7, o: bk > 0.01 ? 1 : 0 });
      const ot = es(t, 4.5, 4.75, ease.out);
      vis(oneTag, { x: 830, y: 430 - (1 - ot) * 800, r: T ? Math.sin(T * 0.9) * 1.2 : 0, o: ot > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, -20], [1, 0], [2, -20], [2.9, -150], [3.3, -60], [4, -40], [5, -20]]);
      S.cam.y = kf(t, [[0, 30], [1, 40], [2, 20], [2.9, -180], [3.3, -240], [4, -240], [5, -250]]);
      S.cam.z = kf(t, [[0, 1.1], [1, 1.2], [2, 1.12], [2.9, 1.06], [3.3, 1.04], [5, 1.06]]);
    };
  },
};
