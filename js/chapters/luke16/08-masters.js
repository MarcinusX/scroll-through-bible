// Łk 16,13 — a painted flat: a lane between two houses, each with its master in the doorway. "No servant can serve two
// masters": both masters ring their little bells and call at once; the servant in the lane with his tray runs to the
// one, runs to the other, and stops between them, torn, the cup sliding on his tray. "For either he will hate the one
// and love the other, or he will be devoted to the one and despise the other": he turns to the left-hand master — a
// heart — with his back and a grey scowl to the other; then the other way round. "You cannot serve God and money":
// the two masters fade, and in their doorways stand what they were: on the left the light of God (only light), on the
// right Mammon, a squat gilded idol of money-bags; the servant sets down his tray, turns his back on the gold and
// goes towards the light.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, house } from '../../assets/nature.js';
import { tray, handBell, heart, mammon, fatherLight, rayBurst, glow, handAt, headAt, kf, moving, tr, es, ease, bump, seg, PI } from './lib.js';

const GY = 712;
const LD0 = 540, RD0 = 1060;    // the two doorways
const SX = 800;
const SERVANT = { robe: C.linen2, mantle: null, hair: C.hair, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope };
const LORD_L = { robe: C.tealRobe, mantle: C.dustyBlue, skin: C.skin2, hair: C.greyHair, hairStyle: 'wrap', veil: C.linen, veil2: C.teal2, beard: 'full', beardColor: C.greyHair, belt: C.leather };
const LORD_R = { robe: C.wheatRobe, mantle: C.terracotta, skin: C.skin3, hair: C.hair3, hairStyle: 'short', beard: 'full', belt: C.sun };

/** a house front with a doorway (origin: the doorway's foot, centre) */
function doorFront(c, wall, w = 300, h = 300) {
  const s = sheet();
  s.p(c.cut([[-w / 2, 0], [-w / 2, -h], [w / 2, -h], [w / 2, 0]], 0.6, 12), wall);
  s.p(c.cut([[-w / 2 - 12, -h - 18], [w / 2 + 12, -h - 18], [w / 2 + 12, -h], [-w / 2 - 12, -h]], 0.5, 10), shade(wall, -0.12));
  s.p(c.cut([[-54, 2], [-54, -150], ...c.arc(0, -150, 54, 40, PI, 2 * PI, 10), [54, -150], [54, 2]], 0.4, 6), mix(C.soilRich, C.plumRobe, 0.2));
  s.p(c.ribbon([[-58, 0], [-58, -150], ...c.arc(0, -150, 58, 44, PI, 2 * PI, 10), [58, -150], [58, 0]], 6), C.wood2);
  return s.out();
}

export default {
  id: 'lk16-masters',
  enter: 'fly',
  beats: [
    { v: 13, text: 'Żaden sługa nie może dwom panom służyć.' },
    { v: 13, cont: true, text: 'Gdyż albo jednego będzie nienawidził, a drugiego miłował; albo z tamtym będzie trzymał, a tym wzgardzi.' },
    { v: 13, cont: true, text: 'Nie możecie służyć Bogu i Mamonie».' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const PO = S.portrait;   // phone: the two masters in their doorways and the servant's runs drawn in from the edges
    const LD = PO ? 600 : LD0, RD = PO ? 990 : RD0;
    const nx = (x) => (PO ? 800 + (x - 800) * 0.8 : x);
    sky(S, ['#cfd9d3', '#efe3c8', '#f6e7cc']);
    const far = S.layer({ par: 0.1, sh: 2 });
    let hs = '';
    for (let i = 0; i < 14; i++) hs += house(c, -400 + i * 170 + c.rr(-20, 20), 500 + c.rr(-8, 8), c.rr(70, 110), c.rr(50, 80), { stairs: false });
    far.add(band(c, { y: 450, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillFar, C.sand, 0.2) }).markup + hs);
    const G = S.layer({ par: 0.3, sh: 3 });
    G.add(sheet().p(c.cut([[-1100, GY - 10], [2700, GY - 10], [2700, 1900], [-1100, 1900]], 0.6, 16), mix(C.sand, C.stone, 0.4)).out());
    const houses = S.layer({ par: 0.34, sh: 4 });
    houses.add(`<g transform="translate(${LD - 60} ${GY})">${doorFront(c, mix(C.plaster, C.skyVeil, 0.25), 340, 320)}</g><g transform="translate(${RD + 60} ${GY})">${doorFront(c, mix(C.plaster, C.wheat, 0.25), 340, 320)}</g>`);
    /* what they are: the light (left door), Mammon (right door) */
    const trueL = S.layer({ par: 0.36, sh: 0, flat: true });
    const lightEl = trueL.add(`<g opacity="0"><g transform="scale(1.1)">${rayBurst(c, { n: 18, r0: 40, r1: 260, spread: 0.05, color: '#fff3cf', o: 0.55 })}</g>${fatherLight(c, 50)}</g>`);
    const idolL = S.layer({ par: 0.36, sh: 5 });
    const idol = idolL.add(`<g opacity="0">${mammon(c)}</g>`);
    const act = S.layer({ par: 0.38, sh: 5 });
    const mL = S.puppet(act.add(person(c, { ...LORD_L, holdF: `<g transform="rotate(-20)">${handBell(c)}</g>` })));
    const mR = S.puppet(act.add(person(c, { ...LORD_R, holdF: `<g transform="rotate(-20)">${handBell(c)}</g>` })));
    const sv = S.puppet(act.add(person(c, SERVANT)));
    const trayEl = act.add(`<g>${tray(c)}</g>`);
    const W = S.layer({ par: 0.4, sh: 3 });
    const ringL = [0, 1].map(() => W.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 16, 16, -0.6, 0.6, 8), 3)}" fill="${C.sun}"/></g>`));
    const ringR = [0, 1].map(() => W.add(`<g opacity="0"><path d="${c.ribbon(c.arc(0, 0, 16, 16, PI - 0.6, PI + 0.6, 8), 3)}" fill="${C.sun}"/></g>`));
    const love = W.add(`<g opacity="0">${heart(c, 15)}</g>`);
    const scorn = W.add(`<g opacity="0">${sheet().p(c.cut([[-18, 0], [-6, -10], [6, -4], [18, -12], [12, 6], [-10, 8]], 0.6, 4), mix(C.storm, C.stone2, 0.3)).out()}</g>`);

    return (t, time) => {
      const T = time;
      /* v13a — both call; he runs to and fro and stops, torn */
      const SK = [[0, SX], [0.14, 680], [0.22, 680], [0.4, 920], [0.48, 920], [0.62, SX], [1.0, SX], [1.12, 750], [1.5, 750], [1.62, 850], [2.0, 850], [2.1, SX], [2.5, SX], [2.9, 680]].map(([k, x]) => [k, nx(x)]);
      const sx = kf(t, SK);
      const torn = es(t, 0.6, 0.7) * (1 - es(t, 0.95, 1.05));
      const side = t < 1.0 ? 0 : t < 1.55 ? -1 : t < 2.05 ? 1 : 0;
      const flip = (t > 0.16 && t < 0.24) || (t > 0.62 && t < 0.8) || side === -1 || t > 2.5 || (t > 0.02 && t < 0.14);
      const down = es(t, 2.35, 2.5);
      const tilt = torn * Math.sin(t * 25) * 10;
      sv.set({ x: sx, y: GY, s: 1.0, flip, walk: moving(t, SK) ? sx * 0.07 : undefined, armF: 70 - down * 60 + torn * 20, armB: 60 - down * 50 + torn * 30, lean: tilt * 0.4 + side * 0, head: torn * Math.sin(t * 18) * 10 - es(t, 2.55, 2.7) * 6, blink: blinkAt(T, 2) });
      const [thx, thy] = handAt(sx, GY, 1.0, flip, 70 - down * 60 + torn * 20);
      pose(trayEl, { x: down > 0 ? lerp(thx + (flip ? -10 : 10), sx + 60, down) : thx + (flip ? -10 : 10), y: down > 0 ? lerp(thy - 4, GY - 4, down) : thy - 4, r: tilt, o: 1 });
      /* the masters call (v13a), love / scorn (v13b), fade (v13c) */
      const ring = bump(t, 0.05, 0.9) + bump(t, 1.05, 1.45) * 0.5 + bump(t, 1.6, 1.95) * 0.5;
      const bellL = Math.sin(t * 70) * 12, bellR = Math.sin(t * 70 + 1) * 12;
      const fadeM = 1 - es(t, 2.05, 2.3);
      mL.set({ x: LD, y: GY, s: 1.0, o: fadeM, armF: 70 + ring * bellL * 0.6, armB: 20 + bump(t, 0.1, 0.9) * 60, head: -4, blink: blinkAt(T, 1) });
      mR.set({ x: RD, y: GY, s: 1.0, flip: true, o: fadeM, armF: 70 + ring * bellR * 0.6, armB: 20 + bump(t, 0.1, 0.9) * 60, head: -4, blink: blinkAt(T, 3) });
      const [lhx, lhy] = headAt(LD, GY, 1.0), [rhx, rhy] = headAt(RD, GY, 1.0, true);
      ringL.forEach((el, i) => { const k = ring > 0.05 ? ((T * 1.4 + i * 0.5) % 1) : 0; pose(el, { x: lhx + 60 + k * 30, y: lhy + 10, s: 0.6 + k, o: Math.min(1, ring) * (1 - k) * fadeM }); });
      ringR.forEach((el, i) => { const k = ring > 0.05 ? ((T * 1.4 + i * 0.5) % 1) : 0; pose(el, { x: rhx - 60 - k * 30, y: rhy + 10, s: 0.6 + k, o: Math.min(1, ring) * (1 - k) * fadeM }); });
      const [hx, hy] = headAt(sx, GY, 1.0, flip);
      const lk = side ? bump(t, side < 0 ? 1.1 : 1.6, side < 0 ? 1.52 : 2.02) : 0;
      pose(love, { x: hx + (flip ? -44 : 44), y: hy - 30 - lk * 10, s: lk, o: lk > 0.02 ? 1 : 0 });
      pose(scorn, { x: hx + (flip ? 50 : -50), y: hy - 16, s: lk, o: lk > 0.02 ? 1 : 0 });
      /* v13c — God (light) and Mammon */
      const k = es(t, 2.1, 2.4);
      pose(lightEl, { x: LD - 30, y: 470, s: 0.6 + k * 0.4, o: k });
      pose(idol, { x: RD + 30, y: GY, s: 0.55 + k * 0.3, o: k });

      S.cam.x = kf(t, [[-0.5, 0], [1.0, 0], [1.1, -20], [1.55, -20], [1.65, 20], [2.05, 20], [2.3, 0]]);
      S.cam.y = kf(t, [[-0.5, 30], [2.0, 30], [2.4, 0]]);
      S.cam.z = kf(t, [[-0.5, 1.08], [2.0, 1.1], [2.4, 1.02]]);
    };
  },
};
