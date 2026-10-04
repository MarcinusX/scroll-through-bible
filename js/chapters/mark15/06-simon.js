// Mk 15,21–22 — outside the city gate. Jesus walks bowed under the cross; a man coming in from the fields
// with his hoe and his two boys is stopped by a soldier's spear: Simon of Cyrene. Name tags come down for
// him and for Alexander and Rufus. He lays down the hoe and takes the cross on his own shoulder, walking
// behind Jesus. The procession climbs on towards the bare, skull-shaped hill: Golgotha.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, grass } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { tr } from '../../core/i18n.js';
import { kf, moving, addToHead, soldier, thornWreath, carriedCross, hoe, child, nameTag, strip, cityWall, skullHill, hanging, swing, LOOK, SKIES, PI } from './lib.js';

const GY = 676;

export default {
  id: 'm15-simon',
  beats: [
    { v: 21, text: 'I przymusili niejakiego Szymona z Cyreny,' },
    { v: 21, cont: true, text: 'ojca Aleksandra i Rufusa,' },
    { v: 21, cont: true, text: 'który wracając z pola właśnie przechodził, żeby niósł krzyż Jego.' },
    { v: 22 },
  ],
  cam: { x: [-20, 440], y: [-40, 60], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const sk = sky(S, SKIES.storm);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const clouds = [[420, 170, 260], [900, 120, 200], [1320, 190, 240]].map(([x, y, w], i) => ({ x, y, el: hanging(hangL, sheet().p(c.cut(c.blob(0, 0, w / 2, w * 0.16, 14, 0.2), 1, 8), i === 1 ? C.storm : mix(C.storm, C.stone2, 0.4)).out(), { x, y, len: 700 }) }));

    /* ---------- the land: far hills, the bare hill, the city gate, the fields ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 440, amps: [16, 8, 3], lens: [900, 320, 120], color: mix(C.hillFar, C.stone2, 0.3) }).markup);
    const golL = S.layer({ par: 0.15, sh: 3 });
    golL.add(`<g transform="translate(1000 392)">${skullHill(c, { w: 460, h: 150 })}</g>`);
    const fields = S.layer({ par: 0.2, sh: 3 });
    const fh = hillsWith(c, { y: 500, amps: [10, 5, 2], lens: [800, 280, 100], color: C.hillMid, trees: 12, treeColor: C.sage, treeH: 20 });
    fields.add(fh.markup);
    let rows = '';
    for (let i = 0; i < 9; i++) { const x0 = 1060 + i * 70; rows += c.ribbon([[x0, fh.fn(x0) + 4], [x0 + 150, 560]], 14); }
    fields.add(sheet().x(rows, C.wheat, 'opacity=".75"').out());
    const wallL = S.layer({ par: 0.25, sh: 4 });
    wallL.add(cityWall(c, -700, 420, 340, 560, { towers: [{ x: -300 }, { x: 60 }, { x: 390, w: 60, h: 40 }], gate: { x: 240, w: 70, h: 110 } }));
    const groundL = S.layer({ par: 0.35, sh: 3 });
    const gfn = c.wave(GY - 60, [5, 2], [800, 200]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2600, 1700, 12, 1), mix(C.sand, C.stone2, 0.3)).out());
    groundL.add(sheet().p(c.ribbon([[-900, GY + 10], [2600, GY + 4]], 70), mix(C.sand2, C.stone2, 0.3)).out());
    groundL.add(olive(c, 1420, GY - 58, 0.9) + bush(c, 520, GY - 56, 80, C.sage) + rock(c, 1700, GY - 50, 70, 26, C.rock2) + grass(c, { x0: -600, x1: 2400, y: GY - 60, fn: gfn, n: 30, h: 12, color: C.olive }));

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.55, sh: 5 });
    const wr = thornWreath(c);
    const boys = [0, 2].map((i) => S.puppet(P.add(person(c, child(c, i)))));
    const simon = S.puppet(P.add(person(c, { ...LOOK.simon, holdF: hoe(c) })));
    const simon2 = S.puppet(P.add(person(c, LOOK.simon)));
    const solB = S.puppet(P.add(soldier(c, 1)));
    const jes = S.puppet(P.add(addToHead(person(c, CAST.jesus), wr)));
    const solA = S.puppet(P.add(soldier(c, 0)));
    const crossL = S.layer({ par: 0.55, sh: 6 });
    const cross = crossL.add(`<g>${carriedCross(c)}</g>`);
    const hoeDown = crossL.add(`<g>${hoe(c)}</g>`);
    const tagL = S.layer({ par: 0.58, sh: 5 });
    const simTag = hanging(tagL, nameTag(c, tr(['Szymon', 'z Cyreny'], ['Simon', 'of Cyrene']), { size: 18 }), { x: 0, y: 0, len: 800 });
    const boyTags = [tr('Aleksander', 'Alexander'), tr('Rufus', 'Rufus')].map((n) => hanging(tagL, nameTag(c, n, { size: 15 }), { x: 0, y: 0, len: 800 }));
    const golTag = hanging(tagL, `${nameTag(c, tr('Golgota', 'Golgotha'), { size: 22 })}<g transform="translate(0 70)">${strip(c, tr('miejsce Czaszki', 'the place of a skull'), { size: 16 })}</g>`, { x: 0, y: 0, len: 900 });
    const fg = S.layer({ par: 0.95, sh: 7 });
    fg.add(bush(c, 60, 960, 240, C.moss) + rock(c, 1520, 980, 260, 90, C.rock2) + bush(c, 2100, 960, 200, C.moss));

    return (t, time) => {
      const T = time;
      sk.blend(SKIES.storm, SKIES.grey, es(t, 2.5, 4) * 0.7);
      clouds.forEach((cl, i) => swing(cl.el, cl.x + Math.sin(T * 0.08 + i) * 30, cl.y + es(t, 2.5, 4) * 30, T, 1, 0.5, i));

      /* keyframes */
      const jK = [[-0.3, [560, GY]], [0.9, [770, GY]], [2.2, [790, GY]], [2.75, [800, GY]], [3.9, [1110, GY]]];
      const sK = [[-0.3, [1420, GY + 4]], [0.7, [1000, GY + 4]], [2.05, [1000, GY + 4]], [2.4, [S.portrait ? 730 : 700, GY - 4]], [2.75, [S.portrait ? 700 : 650, GY - 4]], [3.9, [960, GY - 4]]];   // phone: Simon takes the cross a little further in, so it isn't sliced by the frame
      const aK = [[-0.3, [700, GY + 8]], [0.55, [930, GY + 8]], [2.6, [930, GY + 8]], [3.9, [1250, GY + 8]]];
      const bK = [[-0.3, [380, GY + 6]], [0.9, [S.portrait ? 515 : 590, GY + 6]], [2.3, [S.portrait ? 515 : 590, GY + 6]],   // phone: the rear soldier waits just out of frame, not sliced by it
        [2.6, [500, GY + 6]], [3.9, [810, GY + 6]]];
      const [jx, jy] = kf(t, jK), [sx, sy] = kf(t, sK), [ax, ay] = kf(t, aK), [bx, by] = kf(t, bK);
      const taken = es(t, 2.3, 2.6);
      const halt = es(t, 0.45, 0.6) * (1 - es(t, 2.45, 2.6));
      jes.set({ x: jx, y: jy, s: 1.02, flip: false, walk: moving(t, jK, 0.2) ? jx * 0.04 : undefined, amt: 0.6, lean: lerp(12, 3, taken), head: lerp(14, 4, taken), armF: lerp(70, 14, taken), armB: lerp(40, 8, taken), blink: blinkAt(T) });
      solA.set({ x: ax, y: ay, s: 1, flip: halt > 0.5, walk: moving(t, aK) ? ax * 0.06 : undefined, armF: 34 + halt * 40, armB: 10 + halt * 60 + bump(t, 2.0, 2.4) * 40, blink: blinkAt(T, 3) });
      solB.set({ x: bx, y: by, s: 1, flip: false, walk: moving(t, bK) ? bx * 0.06 : undefined, armF: 34, armB: 10, blink: blinkAt(T, 4) });
      // Simon: from the fields with his hoe; stopped; then carrying the cross behind Jesus
      const hasHoe = 1 - es(t, 2.05, 2.12);
      const sw = moving(t, sK) ? sx * 0.05 : undefined;
      const flipS = t < 2.45;
      simon.set({ x: sx, y: sy, s: 1.04, flip: flipS, o: hasHoe, walk: sw, armF: 24, armB: 10 + bump(t, 0.6, 1.2) * 30, head: bump(t, 0.6, 1.4) * -8, blink: blinkAt(T, 2) });
      simon2.set({ x: sx, y: sy, s: 1.04, flip: flipS, o: 1 - hasHoe, walk: sw, amt: 0.7, armF: lerp(20, 70, taken), armB: lerp(10, 40, taken), lean: taken * 8, head: taken * 8, blink: blinkAt(T, 2) });
      // the hoe laid down
      const hd = es(t, 2.05, 2.3, ease.in);
      pose(hoeDown, { x: 1030 + hd * 30, y: GY - 58 + hd * 44, r: hd * 80, o: hasHoe < 1 ? 1 : 0 });
      // the boys
      boys.forEach((b, i) => {
        const bxk = [[-0.3, [1500 + i * 60, GY + 10]], [0.8, [1080 + i * 64, GY + 10]], [2.6, [1080 + i * 64, GY + 10]], [3.1, [1200 + i * 60, GY - 30]]];
        const [x, y] = kf(t, bxk);
        const worry = es(t, 0.6, 1.0);
        b.set({ x, y, s: 0.56 - es(t, 2.6, 3.1) * 0.05, flip: true, walk: moving(t, bxk) ? x * 0.1 : undefined, armF: 20 + bump(t, 1.1, 1.8) * 30 + worry * 30, armB: 10 + worry * 20, head: -worry * 10, blink: blinkAt(T, 5 + i) });
      });
      // the cross: on Jesus' shoulder → on Simon's
      const jsx = jx - 12, jsy = jy - 138 * 1.02 + 22;
      const ssx = sx + (flipS ? 12 : -12), ssy = sy - 140 * 1.04 + 22;
      const lift = bump(t, 2.3, 2.6) * 30;
      pose(cross, { x: lerp(jsx, ssx, taken), y: lerp(jsy, ssy, taken) - lift, r: 60 + (moving(t, jK, 0.2) ? Math.sin(jx * 0.04) * 1.2 : 0) });

      /* tags */
      const [hsx] = [sx];
      const st = es(t, 0.3, 0.7) * (1 - es(t, 2.1, 2.4));
      swing(simTag, hsx, 300 - (1 - st) * 700, T, 1.2, 0.9, 1);
      boyTags.forEach((bt, i) => {
        const k = es(t, 1.05 + i * 0.12, 1.4 + i * 0.12) * (1 - es(t, 2.1, 2.4));
        swing(bt, 1080 + i * 64 + (i ? (S.portrait ? 0 : 26) : -20), 420 + i * 22 - (1 - k) * 700, T, 1.4, 1, 2 + i);
      });
      const gt = es(t, 3.1, 3.5);
      swing(golTag, 1270, 170 - (1 - gt) * 700, T, 1.1, 0.8, 3);

      S.cam.x = es(t, 2.7, 3.9) * 420 + (S.portrait ? 190 * (1 - es(t, 2.7, 3.9)) : 0);   // phone: Simon's boys and their tags off the thread
      S.cam.y = 10 + es(t, 0.3, 1.0) * 20 - es(t, 2.9, 3.8) * 40;
      S.cam.z = 1.02 + es(t, 0.3, 1.0) * 0.04;
    };
  },
};
