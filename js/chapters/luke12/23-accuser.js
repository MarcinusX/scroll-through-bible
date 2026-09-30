// Łk 12,58–59 — a painted flat: the road into a little town in the golden afternoon, with the judge's seat under its
// awning in the square and the prison at the end of the street. "When you are going with your adversary before the
// magistrate, try diligently on the way to be released from him": two men come down the road, one holding up a note of
// debt and gripping the other's sleeve; halfway the debtor turns and holds out his open purse — settle now, while there
// is still the road. "Lest he drag you to the judge, and the judge deliver you to the officer, and the officer throw
// you into prison": he is dragged on to the judge, who points; the officer with his great key takes him, and pushes him
// through the prison door, which slams. "You will by no means get out of there, until you have paid the very last
// penny": a painted close-up of the barred window comes down: through the bars his hand drops coin after coin into
// the officer's bowl — and at last one tiny copper coin, the smallest there is, falls in, lit.
import { C, person, blinkAt, pose, lerp, sky, hanging, swing, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, grass, house, sun, cloud } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { soldier } from '../mark15/lib.js';
import { lepton } from '../mark12/lib.js';
import { bigKey, LOOK as L5 } from '../matthew5/lib.js';
import { iou } from '../luke7/lib.js';
import { judgeSeat, prisonHouse, doorLeaf, coin, bowl, hand, headAt, alongPts, halo, warm, onString, iconTag, tr, PI } from './lib.js';

const G = 702;
const JUDGE = 830, PRX = 1070, PW = 220, PH = 210;
const ROAD = [[180, 700], [320, 704], [470, 706], [600, 708]];
const ACC = { robe: C.plumRobe, mantle: C.ochre, mantleArm: true, hair: C.hair3, hairStyle: 'wrap', veil: C.linen2, veil2: C.ochre, beard: 'full', skin: C.skin2, belt: C.sun };

export default {
  id: 'lk12-accuser',
  enter: 'fly',
  beats: [
    { v: 58, text: 'Gdy idziesz do urzędu ze swym przeciwnikiem, staraj się w drodze dojść z nim do zgody,' },
    { v: 58, cont: true, text: 'by cię nie pociągnął do sędziego; a sędzia przekazałby cię dozorcy, dozorca zaś wtrąciłby cię do więzienia.' },
    { v: 59 },
  ],
  cam: { x: [-80, 140], y: [0, 60], z: [1, 1.28] },
  build(S) {
    const c = S.c;
    sky(S, ['#d8cfb8', '#f2dcb4', '#f7e6c4']);
    const hangL = S.layer({ par: 0.04, sh: 4 });
    const sunEl = hanging(hangL, sun(c, 40, { rays: C.sunDeep }), { x: 300, y: 160, len: 800 });
    const cl = hanging(hangL, cloud(c, 150), { x: 620, y: 130, len: 800 });
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 470, amps: [16, 7, 3], lens: [1000, 330, 120], color: mix(C.hillFar, C.dune, 0.3) }).markup);
    const mid = S.layer({ par: 0.16, sh: 3 });
    mid.add(hillsWith(c, { y: 530, amps: [12, 5, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.dune, 0.2), trees: 14, treeColor: C.olive, treeH: 18 }).markup);
    const town = S.layer({ par: 0.3, sh: 3 });
    let hs = '';
    [[700, 130, 120], [1180, 150, 140], [1360, 130, 110]].forEach(([x, w, h]) => { hs += house(c, x, 620, w, h, { stairs: false }); });
    town.add(hs + olive(c, 420, 624, 0.7) + cypress(c, 600, 620, 110));
    const ground = S.layer({ par: 0.4, sh: 3 });
    ground.add(sheet().p(c.cut([[-1400, 618], [3000, 618], [3000, 1800], [-1400, 1800]], 0.8, 20), mix(C.sand, C.stone, 0.3)).p(c.ribbon([[-400, 712], ...ROAD, [900, 712], [1300, 712]], 40, 1), mix(C.sand, C.cream, 0.35)).out() + grass(c, { x0: -600, x1: 700, y: 640, n: 20, h: 12, color: C.olive }));
    const seatL = S.layer({ par: 0.42, sh: 4 });
    seatL.add(`<g transform="translate(${JUDGE} ${G})">${judgeSeat(c)}</g>`);
    seatL.add(`<g transform="translate(${PRX} ${G})">${prisonHouse(c, PW, PH)}</g>`);
    const P = S.layer({ par: 0.45, sh: 5 });
    const judge = S.puppet(P.add(person(c, { ...L5.elder, pose: 'sit', mantle: C.curtain2 })));
    const officer = S.puppet(P.add(soldier(c, 1, { spear: false, extra: { holdB: `<g transform="rotate(90) translate(-8 0)">${bigKey(c, 50)}</g>` } })));
    const acc = S.puppet(P.add(person(c, ACC)));
    const debtor = S.puppet(P.add(person(c, L5.poor)));
    const note = P.add(`<g>${iou(c, '100', { w: 44, h: 30, size: 15 })}</g>`);
    const purse = P.add(`<g opacity="0">${sheet().p(c.cut([[-8, -16], [8, -16], [12, -6], [18, 8], [12, 18], [-12, 18], [-18, 8], [-12, -6]], 0.5, 4), C.leather).p(c.ribbon([[-10, -9], [10, -9]], 3), C.rope).out()}</g>`);
    const doorL = S.layer({ par: 0.45, sh: 6 });
    const door = doorL.add(`<g>${doorLeaf(c, PW * 0.28, 100)}</g>`);
    /* at the window: the hand, the coins, the bowl, the last coin */
    const winX = PRX + PW * 0.26, winY = G - PH * 0.59;
    const fx = S.layer({ par: 0.46, sh: 6 });
    const face = fx.add(`<g opacity="0">${sheet().p(c.cut([[-26, -6], [0, -8], [2, 8], [-26, 8]], 0.3, 4), L5.poor.robe).p(c.cut(c.circ(6, 0, 7, 10), 0.2, 3), L5.poor.skin).out()}</g>`);
    const bowlEl = fx.add(`<g opacity="0">${bowl(c, { w: 36, food: null })}</g>`);
    const coins = [0, 1, 2, 3, 4].map((i) => fx.add(`<g opacity="0">${i === 4 ? lepton(c, 4) : coin(c, 6)}</g>`));
    /* the close-up plate of the barred window: coin after coin, and the last little one */
    const WL = S.layer({ par: 0.2, sh: 6 });
    const PWc = 190, PHc = 190;
    const wall = sheet();
    wall.p(c.cut(c.rect(-PWc / 2 - 8, -8, PWc + 16, PHc + 16), 0.5, 8), C.wood2);
    wall.p(c.cut(c.rect(-PWc / 2, 0, PWc, PHc), 0.5, 8), C.stone2);
    let bl = '';
    for (let y = 6, r = 0; y < PHc - 20; y += 34, r++) for (let x = -PWc / 2 + 4 + (r % 2) * 26; x < PWc / 2 - 40; x += 52) bl += c.cut(c.rect(x, y, 46, 28), 0.5, 5);
    wall.p(bl, C.stone);
    wall.p(c.cut(c.rect(-50, 30, 100, 80), 0.3, 5), C.soilDark);
    const barsM = sheet().p([0, 1, 2, 3].map((i) => c.cut(c.rect(-44 + i * 28, 30, 6, 80), 0.1, 4)).join('') + c.cut(c.rect(-50, 66, 100, 6), 0.1, 4), '#4c4452').out();
    const plateEl = WL.add(`<g transform="translate(0 -1500)"><path d="M-70 -2400V-8M70 -2400V-8" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${wall.out()}<path d="${c.cut([[-50, 110], [-20, 90], [16, 96], [50, 110]], 0.3, 4)}" fill="${L5.poor.robe}"/>${barsM}<g transform="translate(6 176)">${bowl(c, { w: 70, food: null })}</g></g>`);
    const hand2 = WL.add(`<g opacity="0">${sheet().p(c.cut([[-40, -8], [-6, -10], [-4, 8], [-40, 10]], 0.3, 4), L5.poor.robe).p(c.cut(c.circ(4, 0, 9, 12), 0.2, 3), L5.poor.skin).out()}</g>`);
    const drops = [0, 1, 2, 3, 4].map((i) => WL.add(`<g opacity="0">${i === 4 ? `${warm(40, 1)}${lepton(c, 6)}` : coin(c, 9)}</g>`));
    const pileC = [0, 1, 2, 3].map(() => WL.add(`<g opacity="0">${coin(c, 9)}</g>`));
    return (t, time) => {
      const T = time;
      swing(sunEl, 300, 160, T, 1, 0.6);
      swing(cl, 620 + Math.sin(T * 0.1) * 20, 130, T, 1.2, 0.6, 1);
      /* v58a — on the road: try to settle */
      const walk1 = es(t, 0.02, 0.45, (u) => u);
      const [dx0] = alongPts(ROAD, walk1);
      const tryK = es(t, 0.5, 0.65) * (1 - es(t, 0.95, 1.05));
      const drag = es(t, 1.05, 1.4, (u) => u);
      const toOfficer = es(t, 1.55, 1.7), push = es(t, 1.72, 1.9);
      let dx = lerp(dx0, JUDGE - 90, drag);
      dx = lerp(dx, PRX - 150, toOfficer);
      dx = lerp(dx, PRX - PW * 0.22, push);
      const inPrison = push > 0.95;
      debtor.set({ x: dx, y: G + 6, s: 0.94, flip: tryK > 0.5, walk: (walk1 > 0 && walk1 < 1) || (drag > 0 && drag < 1) || (toOfficer > 0 && toOfficer < 1) ? dx * 0.05 : undefined, o: 1 - es(t, 1.85, 1.92), armF: 20 + tryK * 60, armB: 10 + bump(t, 1.4, 1.6) * 40, head: tryK * -6 + drag * 8, lean: -drag * 4, blink: blinkAt(T, 2) });
      const ax = lerp(dx - 80, JUDGE - 170, drag);
      acc.set({ x: t < 1.0 ? dx + 80 : ax, y: G + 2, s: 0.96, flip: t < 1.0, walk: (walk1 > 0 && walk1 < 1) || (drag > 0 && drag < 1) ? ax * 0.05 : undefined, armF: 40 + bump(t, 0.5, 1.0) * 60 + drag * 30 * (1 - es(t, 1.5, 1.6)), armB: 10 + bump(t, 1.3, 1.6) * 60, head: bump(t, 0.6, 0.95) * 10, blink: blinkAt(T, 1) });
      const [nx, ny] = hand(t < 1.0 ? dx + 80 : ax, G + 2, 0.96, t < 1.0, 40 + bump(t, 0.5, 1.0) * 60);
      pose(note, { x: nx, y: ny - 16, r: Math.sin(t * 20) * 6 * bump(t, 0.55, 0.95), o: 1 - es(t, 1.9, 2.0) });
      const [px, py] = hand(dx, G + 6, 0.94, true, 20 + tryK * 60);
      pose(purse, { x: px, y: py - 6, o: tryK });
      /* v58b — the judge, the officer, the prison */
      const point = bump(t, 1.3, 1.75);
      judge.set({ x: JUDGE, y: G - 40, s: 0.9, flip: true, armF: 20 + point * 80, armB: 10, head: point * 6, blink: blinkAt(T, 4) });
      const ofx = lerp(PRX - 100, PRX - 130, toOfficer);
      const bowlK = es(t, 2.05, 2.2);
      officer.set({ x: lerp(ofx, winX - 70, bowlK), y: G + 4, s: 0.96, flip: bowlK < 0.5 && t < 1.9 ? true : false, walk: bowlK > 0 && bowlK < 1 ? ofx * 0.05 : undefined, armF: 30 + push * 50 * (1 - bowlK) + bowlK * 70, armB: 20, blink: blinkAt(T, 5) });
      const shut = es(t, 1.9, 2.0);
      const dxL = PRX - PW * 0.36;
      pose(door, { x: dxL, y: G, sx: Math.max(0.1, shut) });
      /* v59 — till the very last penny */
      const [bx, by] = hand(winX - 70, G + 4, 0.96, false, 100);
      pose(bowlEl, { x: bx + 4, y: by + 8, o: bowlK });
      pose(face, { x: winX - 2, y: winY + 22, o: es(t, 2.1, 2.18) });
      coins.forEach((co, i) => {
        const k = seg(t, 2.1 + i * 0.08, 2.18 + i * 0.08 + (i === 4 ? 0.08 : 0));
        pose(co, { x: lerp(winX - 6, bx + 4, k), y: lerp(winY + 20, by, k) - Math.sin(k * PI) * 20, o: k > 0 && k < 1 ? 1 : 0 });
      });
      const pk = es(t, 2.02, 2.25, ease.out);
      const PX0 = 1085, PY0 = lerp(-1500, 250, pk);
      pose(plateEl, { x: PX0, y: PY0, r: time ? Math.sin(T * 0.7) * 0.8 : 0, oy: 0 });
      pose(hand2, { x: PX0 + 10, y: PY0 + 96, o: es(t, 2.25, 2.3) });
      drops.forEach((d, i) => {
        const k = seg(t, 2.3 + i * 0.09, 2.38 + i * 0.09 + (i === 4 ? 0.06 : 0));
        const land = PY0 + 166 - (i === 4 ? 8 : 0);
        pose(d, { x: PX0 + 14 + (i - 2) * 3, y: lerp(PY0 + 100, land, k), s: i === 4 ? 1.3 : 1, o: k > 0 && (k < 1 || i === 4) ? 1 : 0 });
        if (i < 4) pose(pileC[i], { x: PX0 + (i - 1.5) * 12, y: PY0 + 168 - (i % 2) * 3, o: k >= 1 ? 1 : 0 });
      });

      S.cam.x = lerp(-80, -20, es(t, 0.3, 0.9)) + es(t, 1.0, 1.4) * 60 + es(t, 1.5, 1.9) * 60;
      S.cam.y = 60 - es(t, 2.4, 2.7) * 40;
      S.cam.z = 1.26 - es(t, 2.4, 2.7) * 0.08;
    };
  },
};
