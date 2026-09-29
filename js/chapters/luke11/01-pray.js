// Łk 11,1–2 — the curtains open on an olive grove on a hillside in the morning, the villages of the land below. Jesus
// kneels alone on the rocky knoll at prayer, a soft light round Him; the disciples sit among the olives
// and wait. He finishes and rises; Andrew — once a disciple of John — gets up and comes to Him: "Lord, teach us to
// pray" — and a round picture of John at the Jordan, praying with his disciples, comes down on its string. "When you
// pray, say: Father": the disciples kneel round Him, the banks of cloud part at the top of the stage and the light of
// heaven opens (never a figure — light), the word "Father" hanging under it. "Hallowed be your name": from every
// village of the land a small flame of praise rises towards the light. "Your kingdom come": a golden gate comes down
// out of the light onto the far hills and opens, its light spilling over the land, and the grove flowers.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix, curtains } from '../kit.js';
import { es, ease, bump, seg } from '../../core/anim.js';
import { makeCutter } from '../../core/paper.js';
import {
  hillSet, HL, JOHN_B, roundel, figure, say, goldWord, prayerFlame, kingdomGate, gateDoor, rayBurst, glow, headAt, kf, moving, tr, PI, FONT,
} from './lib.js';

const JX = HL.X, KY = HL.KNOLL;
const GX = 1030, GY = 470;          // where the gate of the kingdom comes to rest on the far hills

/** John at the Jordan with two disciples kneeling in prayer, for a round plate (plate coords, r ≈ 74) */
function johnPrays(c, id) {
  const inner = `<rect x="-90" y="-90" width="180" height="180" fill="${mix(C.skyBlue, C.cream, 0.35)}"/>`
    + sheet().p(c.cut([[-90, 20], [-40, 6], [20, 14], [90, 2], [90, 90], [-90, 90]], 0.6, 8), mix(C.dune, C.sand, 0.4)).p(c.cut([[-90, 44], [90, 38], [90, 58], [-90, 62]], 0.4, 8), C.lake).out()
    + figure(c, { ...JOHN_B }, { x: -24, y: 48, s: 0.42, armF: 60, armB: 150, head: -12 })
    + figure(c, { robe: C.stone2, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, pose: 'kneel' }, { x: 24, y: 58, s: 0.38, flip: true, armF: 70, armB: 110, head: -10 })
    + figure(c, { robe: C.sageRobe, hair: C.hair2, hairStyle: 'curly', beard: 'none', skin: C.skin2, pose: 'kneel' }, { x: 56, y: 62, s: 0.36, flip: true, armF: 60, armB: 100, head: -8 });
  return roundel(c, inner, { r: 74, id });
}

export default {
  id: 'lk11-pray',
  beats: [
    { cover: true },
    { v: 1 },
    { v: 2, text: 'A On rzekł do nich: «Kiedy się modlicie, mówcie: Ojcze,' },
    { v: 2, cont: true, text: 'niech się święci Twoje imię;' },
    { v: 2, cont: true, text: 'niech przyjdzie Twoje królestwo!' },
  ],
  cam: { x: [-40, 40], y: [-90, 40], z: [0.98, 1.12] },
  build(S) {
    const H = hillSet(S);
    const c = H.c;

    /* Andrew, who gets up and comes to Him */
    const andrewUp = S.puppet(H.act.add(person(c, { ...CAST.andrew })));
    const ask = H.sayL.add(`<g opacity="0">${say(c, [tr('Panie, naucz nas', 'Lord, teach us'), tr('się modlić!', 'to pray!')], { size: 19, side: -1 })}</g>`);

    /* John and his disciples at prayer, a round plate on its string */
    const hangL = S.layer({ par: 0.2, sh: 6 });
    const jp = makeCutter('lk11-john-plate');
    const jplate = hanging(hangL, `${johnPrays(jp, S.id('jb'))}<g transform="translate(0 96)">${sheet().p(jp.cut([[-84, -13], [84, -14], [85, 13], [-84, 14]], 0.4, 6), C.cream).out()}<text x="0" y="6" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${C.ink}">${tr('Jan i jego uczniowie', 'John and his disciples')}</text></g>`, { x: 0, y: -1500, len: 1200 });

    /* "Father" under the light */
    const word = hanging(H.hangL, goldWord(c, tr('Ojcze', 'Father'), { size: 30 }), { x: 0, y: -1500, len: 1200 });

    /* the villages' flames of praise */
    const flL = H.farFx;
    const FLAMES = [];
    H.VILL.forEach(([vx]) => { for (let k = 0; k < 4; k++) { const x = vx + (k - 1.5) * 40 + c.rr(-8, 8); FLAMES.push({ x, y: H.mh.fn(x) - c.rr(4, 16), i: FLAMES.length, el: flL.add(`<g opacity="0">${prayerFlame(c, 26)}</g>`) }); } });

    /* the gate of the kingdom */
    const gateL = H.farCut;
    const gk = kingdomGate(c, 96, 136);
    const gLight = gateL.add(`<g opacity="0"><circle cy="-60" r="170" fill="url(#halo-glow)"/>${gk.light}</g>`);
    const gFrame = gateL.add(`<g opacity="0">${gk.frame}</g>`);
    const doorL = gateL.add(`<g opacity="0">${gateDoor(c, 48, 86)}</g>`);
    const doorR = gateL.add(`<g opacity="0"><g transform="scale(-1 1)">${gateDoor(c, 48, 86)}</g></g>`);
    const spill = gateL.add(`<g opacity="0">${rayBurst(c, { n: 14, r0: 30, r1: 200, spread: 0.05, color: '#fff3cf', o: 0.4 })}</g>`);

    const cur = curtains(S);

    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* cover — He kneels alone at prayer */
      const done = es(t, 1.05, 1.25);
      const up = es(t, 1.22, 1.3);
      const pray = 1 - done;
      H.jKneel.set({ x: JX, y: KY + 2, s: 1.0, o: 1 - up, armF: 30 + pray * 40, armB: 30 + pray * 110, head: -pray * 16 + done * 6, blink: pray > 0.5 ? 0.6 : blinkAt(T) });

      /* v2a — He stands and teaches them; they kneel round Him */
      const lift = es(t, 2.1, 2.4);
      const bow = es(t, 3.05, 3.3) * (1 - es(t, 4.05, 4.3));
      const gaze = es(t, 4.3, 4.6);
      H.jesus.set({ x: JX, y: KY, s: 1.04, o: up, armF: 16 + bump(t, 1.5, 2.0) * 20 + lift * 44, armB: 8 + lift * 132, head: -lift * 14 + bow * 10 - gaze * 4, blink: blinkAt(T) });
      pose(H.jGlow, { x: JX, y: KY - 110, s: 0.7 + lift * 0.4, o: Math.max(pray * 0.4 * es(t, 0.2, 0.6), lift * 0.6) });

      /* the disciples: sitting and waiting, then kneeling round Him */
      const kneel = es(t, 2.05, 2.25);
      H.dis.forEach((d) => {
        const isA = d.k === 'andrew';
        const turn = es(t, 1.25 + d.i * 0.03, 1.4 + d.i * 0.03);
        const lk = es(t, 2.3 + d.i * 0.04, 2.55 + d.i * 0.04);
        const o = { armF: 16 + lk * 40 - bow * 20, armB: 8 + lk * 110 - bow * 60, head: -2 - turn * 4 - lk * 12 + bow * 26 - gaze * 6, blink: blinkAt(T, d.seed) };
        if (isA) {
          const aSw = seg(t, 1.3, 1.34) * (1 - seg(t, 2.02, 2.06));
          H.disc(d, kneel, o, 1 - aSw);
        } else H.disc(d, kneel, o);
      });
      const AK = [[1.32, HL.X - 250], [1.6, HL.X - 150], [1.95, HL.X - 150], [2.04, HL.X - 236]];
      const ax = kf(t, AK);
      const aOn = seg(t, 1.3, 1.34) * (1 - seg(t, 2.02, 2.06));
      const askUp = bump(t, 1.55, 2.0);
      andrewUp.set({ x: ax, y: H.kfn(ax) + 8, s: 0.92, flip: t > 1.97, o: aOn, walk: moving(t, AK) ? ax * 0.06 : undefined, armF: 20 + askUp * 50, armB: 10 + askUp * 30, head: -8 * askUp, blink: blinkAt(T, 4) });
      const ak = es(t, 1.55, 1.68, ease.back) * (1 - es(t, 2.0, 2.08));
      const [ahx, ahy] = headAt(HL.X - 150, H.kfn(HL.X - 150) + 8, 0.92);
      pose(ask, { x: ahx - 10, y: ahy - 18, s: ak, o: ak > 0.01 ? 1 : 0 });
      const jk = es(t, 1.6, 1.9, ease.out) * (1 - es(t, 2.0, 2.25, ease.in));
      pose(jplate, { x: 1030, y: lerp(-700, 330, jk), r: T ? Math.sin(T * 0.8) * 1.4 : 0, o: jk > 0.004 ? 1 : 0 });

      /* v2a — heaven opens; "Father" */
      const open = es(t, 2.08, 2.6);
      H.heaven(open, es(t, 2.2, 2.7), T);
      H.gold.fade(es(t, 2.3, 3.3) * 0.75);
      H.raysL.fade(es(t, 2.8, 3.4) * (1 - es(t, 4.3, 4.7) * 0.3));
      const wk = es(t, 2.4, 2.7, ease.out) * (1 - es(t, 4.05, 4.3, ease.in));
      pose(word, { x: HL.LX, y: lerp(-500, 300, wk), r: T ? Math.sin(T * 0.7) * 1.2 : 0, o: wk > 0.004 ? 1 : 0 });

      /* v2b — the flames of praise rise from the villages */
      FLAMES.forEach((f) => {
        const a = 3.05 + ((f.i * 5) % FLAMES.length) * 0.03;
        const k = es(t, a, a + 0.1, ease.back);
        const rise = es(t, a + 0.1, a + 0.7);
        const y = lerp(f.y, 250 + (f.i % 4) * 26, rise);
        const x = lerp(f.x, lerp(f.x, HL.LX, 0.55), rise);
        pose(f.el, { x, y: y + (T ? Math.sin(T * 2 + f.i) * 3 : 0), s: k * (1 - rise * 0.3) * (1 + (T ? Math.sin(T * 6 + f.i) * 0.06 : 0)), o: k > 0.01 ? 1 - es(t, a + 0.75, a + 0.95) * 0.6 : 0 });
      });

      /* v2c — the gate of the kingdom comes down and opens; the grove flowers */
      const gd = es(t, 4.05, 4.45, ease.out);
      const gy = lerp(HL.LY + 40, GY, gd);
      const gx = lerp(HL.LX, GX, gd);
      const gOn = es(t, 4.02, 4.1);
      const sc = lerp(0.4, 1, gd);
      pose(gFrame, { x: gx, y: gy, s: sc, o: gOn });
      const opn = es(t, 4.45, 4.62);
      pose(doorL, { x: gx - 48 * sc, y: gy, s: sc, sx: sc * (1 - opn * 0.85), o: gOn });
      pose(doorR, { x: gx + 48 * sc, y: gy, s: sc, sx: sc * (1 - opn * 0.85), o: gOn });
      pose(gLight, { x: gx, y: gy, s: sc, o: gOn });
      pose(spill, { x: gx, y: gy - 50, s: 0.5 + opn * 0.5, r: T * 3, o: opn * 0.9 });
      H.BLOOMS.forEach((b) => {
        const k = es(t, 4.55 + b.i * 0.04, 4.75 + b.i * 0.04, ease.back);
        pose(b.el, { x: b.x, y: b.y, s: k, o: k > 0.02 ? 1 : 0 });
      });

      /* camera: close on the knoll, then up to the light */
      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.1], [1.6, 1.06], [2.1, 1.06], [2.7, 1.0], [4.0, 1.0], [4.4, 1.02]]);
      S.cam.y = kf(t, [[0, 30], [1.0, 30], [2.1, 20], [2.7, -70], [3.9, -70], [4.4, -30]]);
      S.cam.x = kf(t, [[0, 0], [1.4, -10], [2.0, 10], [2.6, 0], [4.0, 0], [4.4, 20]]);
    };
  },
};
