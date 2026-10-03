// Łk 4,1–4 — the curtains open on the Jordan where it leaves the desert. Jesus, full of the Holy Spirit, comes up
// out of the river; the dove goes ahead of Him and He follows it into the wilderness. Forty days: He sits on a rock
// while sun and moon swing across the sky and the marks on a flat stone count up to forty — and all the while the
// tempter is there, a shadow whispering now from this side, now from that. He eats nothing: the bowl is empty,
// and at the end He is hungry. "Tell this stone to become bread": the tempter lifts one stone and in his hand it
// glints into a loaf. "It is written": the scroll comes down, the loaf is a stone again and drops to the sand.
import { C, person, CAST, blinkAt, pose, lerp, curtains, swing, sheet, shade, mix } from '../kit.js';
import { rock, reeds } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  desertSet, desertFront, TEMPTER, tempterAura, stoneLoaf, breadLoaf, dove, flapWings, tallyStone, paperLabel, thought, loaf,
  emptyBowl, headAt, hand, addScroll, setScroll, lightShaft, bubble, sparkle, tr, PI,
} from './lib.js';

const GY = 742;
const JX = 820;
const SEAT = 726;
const TX = 610;

export default {
  id: 'lk4-desert',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'czterdzieści dni, gdzie był kuszony przez diabła.' },
    { v: 2, cont: true, text: 'Nic w owe dni nie jadł, a po ich upływie odczuł głód.' },
    { v: 3 },
    { v: 4 },
  ],
  cam: { x: [-60, 40], y: [-20, 60], z: [1, 1.14] },
  build(S) {
    const D = desertSet(S);
    const c = D.c;
    const PH = S.portrait;
    const TALLY = PH ? [1025, 0.78] : [1110, 1];   // phone: the tally stone and its "40" stand clear of the progress thread
    const TXp = PH ? 650 : TX;                     // phone: the tempter and his shadow stand inside the left edge

    /* ---------- the Jordan, winding out of the desert on the left ---------- */
    const riverL = S.layer({ par: 0.5, sh: 2 });
    const rpts = c.cbez([200, 600], [420, 640], [520, 720], [300, 1000], 24);
    const rs = sheet();
    rs.p(c.ribbon(rpts, (u) => 18 + u * 150, 2), mix(C.lake, C.sand, 0.15));
    rs.x(c.ribbon(rpts.map(([x, y]) => [x - 8, y]), (u) => 4 + u * 30), C.lake2, 'opacity=".6"');
    let foam = '';
    for (let i = 3; i < rpts.length - 2; i += 3) { const [x, y] = rpts[i]; foam += c.ribbon([[x - 10 - i, y], [x + 8, y - 2]], 1.6); }
    rs.x(foam, C.foam, 'opacity=".7"');
    riverL.add(rs.out());
    riverL.add(reeds(c, 560, 712, 9, 70) + reeds(c, 300, 690, 7, 60) + reeds(c, 590, 790, 8, 84));

    /* ---------- the tally stone, the desert stones, the bowl ---------- */
    const G = D.G;
    const tally = G.add(`<g transform="translate(${TALLY[0]} 718)${PH ? ` scale(${TALLY[1]})` : ''}">${tallyStone(c, 170, 64)}</g>`);
    const marks = Array.from(tally.querySelectorAll('.tally'));
    const forty = G.add(`<g opacity="0">${paperLabel('40', { size: 30 })}</g>`);
    const stonesL = S.layer({ par: 0.5, sh: 3 });
    [[640, 744, 15], [676, 750, 12], [712, 742, 11]].forEach(([x, y, r]) => stonesL.add(`<g transform="translate(${x} ${y})">${stoneLoaf(c, r)}</g>`));

    /* ---------- the tempter: whispering through the forty days, then close ---------- */
    const TL = S.layer({ par: 0.5, sh: 4 });
    const aura = TL.add(`<g opacity="0">${tempterAura(c, 130)}</g>`);
    const tempter = S.puppet(TL.add(person(c, { ...TEMPTER })));
    const hiss = TL.add(`<g opacity="0">${bubble('…', { size: 26, w: 56, jag: true, c, fill: '#4a3f58', ink: C.cream })}</g>`);

    /* ---------- light behind Him ---------- */
    const lightL = S.layer({ par: 0.5, sh: 0, flat: true });
    const shaft = lightL.add(`<g opacity="0">${lightShaft(c, { w0: 50, w1: 150 })}</g>`);
    const glowJ = lightL.add(`<circle r="130" fill="url(#halo-glow)" opacity="0"/>`);
    const glowD = lightL.add(`<circle r="110" fill="url(#halo-glow)" opacity="0"/>`);

    /* ---------- Jesus, the dove ---------- */
    const JL = S.layer({ par: 0.5, sh: 5 });
    const seat = JL.add(rock(c, JX + 6, SEAT + 20, 124, 48, C.rock2));
    const jWalk = S.puppet(JL.add(person(c, { ...CAST.jesus })));
    const jSit = S.puppet(JL.add(person(c, { ...CAST.jesus, pose: 'sit' })));
    const jStand = S.puppet(JL.add(person(c, { ...CAST.jesus })));
    const bowlEl = JL.add(`<g>${emptyBowl(c, 30)}</g>`);
    const doveEl = JL.add(dove(c));
    const thinkEl = JL.add(`<g opacity="0">${thought(c, `<g transform="translate(0 10)">${loaf(c, 20)}</g>`, { w: 84, h: 62 })}</g>`);

    /* ---------- the one stone and its false bread ---------- */
    const SL = S.layer({ par: 0.5, sh: 5 });
    const stoneEl = SL.add(`<g>${stoneLoaf(c, 25)}</g>`);
    const breadEl = SL.add(`<g opacity="0"><ellipse cy="-12" rx="50" ry="30" fill="url(#warm-glow)"/>${breadLoaf(c, 28)}</g>`);
    const glints = [0, 1, 2].map(() => SL.add(`<g opacity="0">${sparkle(c, 10)}</g>`));

    /* ---------- "it is written" ---------- */
    const scL = S.layer({ par: 0.12, sh: 6 });
    const scroll = addScroll(scL, c, [tr('Napisane jest:', 'It is written:'), tr('«Nie samym chlebem', '“Man shall not live'), tr('żyje człowiek»', 'by bread alone”')], { w: 380, h: 170, size: 27 });

    desertFront(S);
    const cur = curtains(S);

    return (t, time) => {
      cur.set(es(t, 0.05, 0.85), time);

      /* ---------- forty days and nights: four swings of sun and moon, then dusk ---------- */
      const cyc = seg(t, 2.08, 2.7) * 4;
      const ph = cyc % 1;
      let night = 0;
      const arc = (f, y0) => [lerp(260, 1340, f), y0 - Math.sin(Math.max(0, Math.min(1, f)) * PI) * 300];
      let sunXY, moonXY = [260, 900];
      if (t < 2.08) sunXY = arc(0.3 + seg(t, 0, 2.08) * 0.2, 480);
      else if (t < 2.7) {
        night = es(ph, 0.4, 0.55) * (1 - es(ph, 0.88, 1.0));
        sunXY = ph < 0.5 ? arc(ph / 0.5, 480) : [1340, 900];
        if (ph >= 0.5) moonXY = arc((ph - 0.5) / 0.5, 470);
        if (cyc >= 3.999) { sunXY = arc(0.05, 480); night = 0; }
      } else sunXY = arc(lerp(0.25, 0.92, es(t, 2.7, 3.9)), 480 + es(t, 3.0, 4.2) * 110);
      if (t >= 2.7) night = 0;
      D.nightL.fade(night);
      D.starL.fade(night);
      D.duskL.fade(es(t, 3.0, 3.7) * 0.95);
      swing(D.sunEl, sunXY[0], sunXY[1], time, 1, 0.6);
      swing(D.moonEl, moonXY[0], moonXY[1], time, 0.8, 0.5, 1);
      const shown = Math.floor(seg(t, 2.08, 2.68) * 40 + 0.001);
      marks.forEach((m, i) => fade(m, i < shown ? 1 : 0));
      const f40 = es(t, 2.64, 2.78, ease.back);
      pose(forty, { x: TALLY[0], y: PH ? 648 : 630 + Math.sin(time * 1.5) * 3, s: f40, r: Math.sin(time) * 3, o: f40 > 0 ? 1 - es(t, 3.3, 3.6) * 0.5 : 0 });

      /* ---------- v1: full of the Spirit, up from the Jordan, led into the desert ---------- */
      const w = es(t, 1.12, 1.88);
      const jx = lerp(PH ? 545 : 470, JX, w);   // phone: He comes up from the river inside the left edge
      const sitK = es(t, 2.0, 2.07);
      const standK = es(t, 5.0, 5.07);
      jWalk.set({ x: jx, y: GY, s: 1.05, o: seg(t, 0.4, 0.6) * (1 - sitK), walk: w > 0 && w < 1 ? jx * 0.045 : undefined, armF: 14 + bump(t, 1.0, 1.3) * 30, head: -6 + es(t, 1.8, 1.95) * 2, blink: blinkAt(time) });
      const pray = es(t, 2.1, 2.3) * (1 - es(t, 2.95, 3.15));
      const hungry = es(t, 3.2, 3.5) * (1 - es(t, 4.3, 4.5));
      const lookUp = es(t, 4.3, 4.5);
      jSit.set({ x: JX + 10, y: SEAT, s: 1.05, flip: true, o: sitK * (1 - standK), armF: 30 + pray * 30 - hungry * 12, armB: 20 + pray * 40 - hungry * 12, head: pray * 10 + hungry * 16 - lookUp * 4, lean: hungry * 5, blink: hungry > 0.5 ? 0.5 : blinkAt(time, 2) });
      const answer = es(t, 5.05, 5.3);
      jStand.set({ x: JX, y: GY, s: 1.05, flip: true, o: standK, armF: 14 + answer * 30, armB: 10 + answer * 120, head: -answer * 4, blink: blinkAt(time) });
      const [jhx, jhy] = headAt(jx, GY, 1.05, false);
      const spirit = seg(t, 0.5, 0.9) * (1 - es(t, 2.9, 3.3));
      pose(glowJ, { x: t < 2.0 ? jhx : JX + 6, y: (t < 2.0 ? jhy : SEAT - 100) + 30, s: 1 + Math.sin(time * 1.2) * 0.04, o: spirit * 0.75 });
      // the dove flies ahead of Him, then rises into the light
      const df = es(t, 1.0, 1.95, ease.sine);
      const dx = lerp(520, 1060, df), dy = lerp(420, 330, df) - Math.sin(df * PI * 2.2) * 26 - es(t, 1.85, 2.15) * 520;
      const dOn = seg(t, 0.55, 0.75) * (t < 2.2 ? 1 : 0);
      pose(doveEl, { x: dx, y: dy, s: 1.1, o: dOn });
      flapWings(doveEl, time, 30, 7);
      pose(glowD, { x: dx, y: dy - 10, o: dOn * 0.85 });
      pose(seat, { o: 1 });

      /* ---------- v2a: tempted through the forty days — a shadow here, there, close ---------- */
      const spots = [[PH ? 1060 : 1150, 604, 0.55, true, 2.08, 2.3], [PH ? 540 : 480, 704, 0.8, false, 2.32, 2.55], [985, GY, 0.95, true, 2.58, 3.02]];
      let tx = -400, ty = GY, ts = 1, tflip = false, to = 0, whisper = 0;
      spots.forEach(([x, y, s, fl, a, b]) => { const k = bump(t, a, b); if (k > 0.001) { tx = x; ty = y; ts = s; tflip = fl; to = Math.min(1, k * 2.2); whisper = k; } });
      // v3: he comes out of the dunes on the left and holds up the stone
      const tin = es(t, 4.02, 4.42);
      const back = es(t, 5.25, 5.8);
      if (t > 3.9) { tx = lerp(250, TXp, tin) - back * (PH ? 40 : 70); ty = GY; ts = 1.04 - back * 0.1; tflip = back > 0 && back < 1; to = seg(t, 3.95, 4.08); }
      const lift = es(t, 4.35, 4.6) * (1 - es(t, 5.3, 5.45));
      const cower = es(t, 5.35, 5.7);
      const tArm = 16 + lift * 64 + bump(t, 4.62, 4.95) * 10;
      tempter.set({ x: tx, y: ty, s: ts, flip: tflip, o: to, walk: (tin > 0 && tin < 1) || (back > 0 && back < 1) ? tx * 0.05 : undefined, armF: t > 3.9 ? tArm : 20 + whisper * 30, armB: 10 + (t > 3.9 ? bump(t, 4.6, 5.0) * 60 : 0), head: t > 3.9 ? -lift * 4 + cower * 14 : 10, lean: t > 3.9 ? lift * 6 - cower * 6 : 8 * whisper, blink: blinkAt(time, 5) });
      pose(aura, { x: tx - 6, y: ty + 10, s: ts * (1 - cower * 0.35) * (1 + Math.sin(time * 2) * 0.03), r: Math.sin(time * 0.7) * 4, o: to * 0.9 * (1 - cower * 0.4) });
      const [thx, thy] = headAt(tx, ty, ts, tflip);
      pose(hiss, { x: thx + (tflip ? -50 : 50) * ts, y: thy - 70 * ts, s: whisper > 0.3 ? ts : 0, r: Math.sin(time * 6) * 4, o: whisper > 0.3 && t < 3.9 ? 1 : 0 });

      /* ---------- v2b: nothing eaten — the empty bowl; hunger ---------- */
      const bk = es(t, 3.15, 3.35);
      pose(bowlEl, { x: JX + 110, y: GY - 2, r: 20 * bk, o: sitK });
      const tk = es(t, 3.35, 3.55, ease.back) * (1 - es(t, 4.05, 4.25));
      const [shx, shy] = headAt(JX + 10, SEAT, 1.05, true, 62);
      pose(thinkEl, { x: shx - 70, y: shy - 36 + Math.sin(time * 1.2) * 3, s: tk * 1.2, o: tk > 0 ? 0.95 : 0 });

      /* ---------- v3: "tell this stone to become bread" ---------- */
      const [hx, hy] = hand(tx, GY, ts, false, tArm, lift * 6);
      const hold = es(t, 4.35, 4.6);
      const drop = seg(t, 5.3, 5.55);
      const sx = lerp(740, hx + 8, hold), sy = lerp(GY, hy + 8, hold);
      const fx = drop > 0 ? lerp(hx + 8, 700, drop) : sx, fy = drop > 0 ? lerp(hy + 8, GY + 2, drop * drop) : sy;
      const bread = es(t, 4.62, 4.72) * (1 - es(t, 5.22, 5.32));
      pose(stoneEl, { x: fx, y: fy, r: drop * 200, o: 1 - bread });
      pose(breadEl, { x: fx, y: fy, o: bread });
      glints.forEach((g, i) => { const k = bump(t, 4.58 + i * 0.07, 4.95 + i * 0.07); pose(g, { x: sx + (i - 1) * 26, y: sy - 30 - (i % 2) * 16, s: k * 1.2, r: time * 60, o: k }); });

      /* ---------- v4: "it is written: not by bread alone" ---------- */
      const down = es(t, 5.02, 5.3, ease.out);
      setScroll(scroll, 800, lerp(-440, 150, down) + Math.sin(time * 0.8) * 2, es(t, 5.2, 5.5), down, Math.sin(time * 0.6) * 0.6);
      const sh = es(t, 5.3, 5.7);
      pose(shaft, { x: JX, y: GY + 4, o: sh * (0.9 + Math.sin(time * 1.3) * 0.08) });

      S.cam.x = lerp(-50, 0, es(t, 1.0, 1.9)) - es(t, 3.9, 4.4) * 30 * (1 - es(t, 5.0, 5.4));
      S.cam.z = 1.02 + es(t, 1.0, 1.9) * 0.03 + es(t, 3.0, 3.5) * 0.05 - es(t, 5.0, 5.4) * 0.05;
      S.cam.y = 30 + es(t, 3.0, 3.5) * 20 - es(t, 5.0, 5.4) * 30;
    };
  },
};
