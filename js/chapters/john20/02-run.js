// J 20,2–4 — Dawn. A long garden set: the city house on the left, the path winding right to the tomb. Mary runs
// back to the house where Simon Peter and the disciple whom Jesus loved sit on the bench by the door. She tells them:
// the tomb open and empty, a dotted way leading off to nowhere — "we don't know where". The two get up and go; then
// they run, side by side, the sun climbing; the younger one pulls ahead, Peter puffing behind; John reaches the
// tomb first and stops at its doorway.
import { C, person, blinkAt, pose, lerp, hanging, swing, mix } from '../kit.js';
import { sun } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  MAGD, PETER, BELOVED, gardenSet, GARDEN_PATH, pathS, DOOR, STONE, ROSE, GOLD, cityHouse, cityGate, headAt, speech, tombIcon,
  GLYPH, question, nameTag, heart, withFace, faceBits, skyKeys, tr, sky, PI,
} from './lib.js';

const P = GARDEN_PATH;
/** y of the path at x */
function yAt(x) {
  if (x <= P[0][0]) return P[0][1];
  for (let i = 1; i < P.length; i++) if (x <= P[i][0]) { const u = (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return lerp(P[i - 1][1], P[i][1], u); }
  return P[P.length - 1][1];
}
const HOUSE = { x: 170, y: 676 };

export default {
  id: 'j20-run',
  beats: [
    { v: 2, text: 'Pobiegła więc i przybyła do Szymona Piotra i do drugiego ucznia, którego Jezus kochał,' },
    { v: 2, cont: true, text: 'i rzekła do nich: «Zabrano Pana z grobu' },
    { v: 2, cont: true, text: 'i nie wiemy, gdzie Go położono».' },
    { v: 3 },
    { v: 4, text: 'Biegli oni obydwaj razem,' },
    { v: 4, cont: true, text: 'lecz ów drugi uczeń wyprzedził Piotra' },
    { v: 4, cont: true, text: 'i przybył pierwszy do grobu.' },
  ],
  cam: { x: [-760, 460], y: [-10, 40], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const sk = sky(S, ROSE);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunGlow = hangL.add(`<g><circle r="420" fill="url(#warm-glow)" opacity=".7"/></g>`);
    const sunEl = hanging(hangL, sun(c, 54, { rays: C.sunDeep }), { x: 1100, y: 520, len: 900 });

    const G = gardenSet(S);
    G.ground.add(`<g transform="translate(${HOUSE.x} ${HOUSE.y})">${cityHouse(c, 0.6)}</g>`);
    G.ground.add(`<g transform="translate(-420 690) scale(.8)">${cityGate(c, 0.1)}</g>`);
    const L = G.walkL;
    const mk = (o, pose2) => { const el = L.add(withFace(person(c, { ...o, pose: pose2 }), faceBits(c))); return { el, p: S.puppet(el), sad: el.querySelector('[data-part="sad"]') }; };
    const pSit = mk(PETER, 'sit'), jSit = mk(BELOVED, 'sit');
    const pRun = mk(PETER, 'stand'), jRun = mk(BELOVED, 'stand');
    const mary = mk(MAGD, 'stand');
    const fx = S.layer({ par: 0.54, sh: 4 });
    const pTag = fx.add(`<g>${nameTag(c, tr('Szymon Piotr', 'Simon Peter'), { size: 15 })}</g>`);
    const jTag = fx.add(`<g>${nameTag(c, tr(['uczeń, którego', 'Jezus kochał'], ['the disciple', 'whom Jesus loved']), { size: 14 })}</g>`);
    const jHeart = fx.add(`<g>${heart(c, 9)}</g>`);
    const say1 = fx.add(`<g>${speech(c, `<g transform="translate(-26 16)">${tombIcon(c, { open: true })}</g><path d="${c.ribbon(c.qbez([4, -2], [30, -26], [52, -4], 10), 2.2)}" fill="${C.terracotta}" opacity=".85" stroke-dasharray="4 4"/><path d="${c.poly([[48, -10], [58, 0], [44, 2]])}" fill="${C.terracotta}"/>`, { w: 150, h: 92, flip: true })}</g>`);
    const say2 = fx.add(`<g>${speech(c, `<g transform="scale(1.3)">${question(c)}</g>`, { w: 96, h: 92, flip: true })}</g>`);
    const qs = [0, 1, 2].map(() => fx.add(`<g>${GLYPH.q(c)}</g>`));
    const dust = Array.from({ length: 6 }, () => fx.add(`<path d="${c.cut(c.blob(0, 0, 12, 7, 9, 0.2), 0.6, 4)}" fill="${mix(C.sand, C.cream, 0.4)}" opacity=".8"/>`));
    const drops = [0, 1].map(() => fx.add(`<path d="${c.cut([[0, -8], [4, 0], [0, 4], [-4, 0]], 0.2, 2)}" fill="#bfe0ee"/>`));
    const speed = fx.add(`<path d="${c.ribbon([[0, 0], [-60, 0]], 2.4) + c.ribbon([[-6, 16], [-54, 16]], 2) + c.ribbon([[0, 32], [-44, 32]], 2)}" fill="${C.cream}" opacity=".8"/>`);

    return (t, T) => {
      skyKeys(sk, t, [[0, ROSE], [5.5, GOLD]]);
      const rise = es(t, 0, 6.5, ease.out);
      swing(sunEl, 1100, lerp(520, 190, rise), T, 0.8, 0.5);
      pose(sunGlow, { x: 1100, y: lerp(520, 190, rise), s: 0.6 + rise * 0.6, o: 0.8 });
      pose(G.stone, { x: STONE.x, y: DOOR.y - STONE.r + 2 });
      pose(G.doorGlow, { x: DOOR.x, y: DOOR.y, o: 0 });
      pose(G.doorRays, { x: DOOR.x, y: DOOR.y, o: 0 });

      /* v2a: Mary runs to the house; the two look up */
      const mx = t < 3 ? lerp(760, 330, es(t, 0, 0.7, ease.out)) : lerp(330, 620, es(t, 3.2, 4.6));
      const mRun = (t > 0 && t < 0.7) || (t > 3.2 && t < 4.6);
      const my = yAt(mx) + 4;
      const ms = pathS(my);
      const talk = bump(t, 1.05, 1.9) + bump(t, 2.05, 2.9);
      mary.p.set({ x: mx, y: my, s: ms, flip: t < 3.1, walk: mRun ? mx * (t < 1 ? 0.09 : 0.06) : undefined, amt: t < 1 ? 1.3 : 0.9, lean: t < 0.7 ? 8 : 0, armF: 20 + talk * 40 + bump(t, 2.05, 2.9) * 30, armB: 12 + bump(t, 2.05, 2.9) * 70, head: -4, blink: blinkAt(T, 3), o: 1 - es(t, 4.3, 4.6) });
      fade(mary.sad, 0.9);

      const look = es(t, 0.35, 0.6);
      const up = es(t, 2.6, 2.67);
      const px0 = HOUSE.x - 100, jx0 = HOUSE.x - 36;
      pSit.p.set({ x: px0, y: HOUSE.y + 4, s: 0.94, o: 1 - up, armF: 30 + look * 20, armB: 10, head: look * -6, blink: blinkAt(T, 1) });
      jSit.p.set({ x: jx0, y: HOUSE.y + 6, s: 0.92, o: 1 - up, armF: 34 + look * 16, armB: 12, head: look * -8, blink: blinkAt(T, 4) });
      fade(pSit.sad, 0.7 - look * 0.2); fade(jSit.sad, 0.7 - look * 0.2);

      /* v3: they go out; v4: they run together — John outruns Peter and comes to the tomb first */
      const go = es(t, 3.0, 4.0, ease.sine);
      const runT = seg(t, 4.0, 6.7);
      const both = es(t, 4.0, 5.0, ease.sine);
      const jAhead = es(t, 5.0, 6.55, ease.out);
      const pBehind = es(t, 5.0, 7.0, ease.sine);
      const jx = t < 4 ? lerp(jx0 + 60, 450, go) : lerp(450, 730, both) + jAhead * (1085 - 730);
      const px = t < 4 ? lerp(px0 + 70, 380, go) : lerp(380, 650, both) + pBehind * (930 - 650);
      const running = t > 4 && t < 6.6;
      const pRunning = t > 4 && t < 7;
      const jy = yAt(jx) + 14, py = yAt(px) - 8;
      const jStop = es(t, 6.55, 6.8);
      jRun.p.set({ x: jx, y: jy, s: pathS(jy) * 1.02, o: up, walk: t > 3 && t < 6.6 ? jx * (running ? 0.085 : 0.05) : undefined, amt: running ? 1.4 : 0.9, lean: running ? 10 : 0, armF: running ? 40 : 20 + jStop * 20, armB: running ? 30 : 10, head: -jStop * 6, blink: blinkAt(T, 4) });
      pRun.p.set({ x: px, y: py, s: pathS(py) * 1.04, o: up, walk: t > 3 && pRunning ? px * (t > 4 ? 0.08 : 0.05) : t > 3 && t < 4 ? px * 0.05 : undefined, amt: t > 4 ? 1.3 : 0.9, lean: t > 4 ? 8 + bump(t, 5.2, 6.8) * 6 : 0, armF: t > 4 ? 36 : 18, armB: t > 4 ? 30 : 10, head: t > 5 ? 8 : 0, blink: blinkAt(T, 1) });
      fade(pRun.sad, 0.4 * (1 - es(t, 3.5, 4))); fade(jRun.sad, 0.4 * (1 - es(t, 3.5, 4)));

      /* tags and words */
      const tg = es(t, 0.45, 0.7, ease.back) * (1 - es(t, 1.0, 1.15));
      const [phx, phy] = headAt(px0, HOUSE.y + 4, 0.94, false, 62);
      const [jhx, jhy] = headAt(jx0, HOUSE.y + 6, 0.92, false, 62);
      pose(pTag, { x: phx - 40, y: phy - 110, s: tg, r: -3, o: tg > 0.01 ? 1 : 0 });
      pose(jTag, { x: jhx + 50, y: jhy - 150, s: tg, r: 2, o: tg > 0.01 ? 1 : 0 });
      pose(jHeart, { x: jhx + 4, y: jhy - 40, s: tg * (1 + (T ? Math.sin(T * 5) * 0.08 : 0)), o: tg > 0.01 ? 1 : 0 });
      const [mhx, mhy] = headAt(mx, my, ms, true);
      const s1 = es(t, 1.05, 1.25, ease.back) * (1 - es(t, 1.9, 2.02));
      pose(say1, { x: mhx - 20, y: mhy - 18, s: s1, o: s1 > 0.01 ? 1 : 0 });
      const s2 = es(t, 2.05, 2.25, ease.back) * (1 - es(t, 2.85, 2.97));
      pose(say2, { x: mhx - 20, y: mhy - 18, s: s2, o: s2 > 0.01 ? 1 : 0 });
      [[phx, phy], [jhx, jhy], [mhx, mhy]].forEach(([hx, hy], i) => {
        const q = es(t, 2.35 + i * 0.08, 2.55 + i * 0.08, ease.back) * (1 - es(t, 2.9, 3.0));
        pose(qs[i], { x: hx + (i === 2 ? 26 : -14), y: hy - (i === 2 ? 128 : 50), s: q * 1.2, r: (i - 1) * 10, o: q > 0.01 ? 1 : 0 });
      });

      /* running: dust, Peter's breath, John's speed */
      dust.forEach((d, i) => {
        const who = i < 3 ? [jx, jy] : [px, py];
        const on = i < 3 ? (running ? 1 : 0) : (pRunning && t > 4 ? 1 : 0);
        const k = T ? (T * 1.6 + i / 3) % 1 : (i % 3) / 3;
        pose(d, { x: who[0] - 20 - k * 60, y: who[1] - 6 - k * 16, s: 0.6 + k * 0.8, o: on * (1 - k) * 0.8 });
      });
      const [pbx, pby] = headAt(px, py, pathS(py) * 1.04, false);
      drops.forEach((d, i) => {
        const k = T ? (T * 1.3 + i * 0.5) % 1 : 0.4 + i * 0.3;
        pose(d, { x: pbx - 16 - i * 10, y: pby - 16 + k * 20, s: 1, o: es(t, 5.1, 5.4) * (1 - es(t, 6.9, 7)) * (1 - k) });
      });
      const [jbx, jby] = headAt(jx, jy, pathS(jy), false);
      pose(speed, { x: jx - 34, y: jby + 30, o: bump(t, 5.1, 6.6) * 0.9 });

      const lead = t < 3 ? 250 : Math.max(250, (jx + px) / 2 + (t > 5 ? 90 : 0));
      const camX = Math.max(-760, Math.min(460, (lead - 800) / 0.52 + (S.portrait ? 0 : 60)));
      S.cam.x = camX;
      S.cam.y = 20 - es(t, 3, 6) * 10;
      S.cam.z = 1.04 - es(t, 3.5, 4.5) * 0.04 + es(t, 6.2, 6.9) * 0.05;
    };
  },
};
