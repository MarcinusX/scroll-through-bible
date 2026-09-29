// Łk 8,16–18 — a painted house comes down, cut open at the front: dusk at the door, a bed on the right, a lampstand
// in the middle. A woman lights a little clay lamp — and a pot comes down over it (dark: a red cross); she slides it
// under the bed (dark again: a red cross). No: she sets it high on the lampstand, the whole room fills with warm light
// and the guests coming in at the door see it and lift their hands. Nothing hidden stays hidden: the cloth lifts off
// the basket, the chest opens, the curtain of the alcove draws aside. "Take care how you hear": a paper ear comes down.
// "To the one who has, more will be given": oil pours into one guest's lamp and its flame grows; "from the one who
// has not, even what he thinks he has": the other holds only a painted paper flame — it lifts off and floats away.
import { C, person, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { bed } from '../../assets/things.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { coverPot, crossX, handLamp, chest, earTag, sparkle, hand, headAt, hangAt, manO, womanO, FLAME, tr, PI } from './lib.js';

const FLOOR = 700, DOOR = 400, STAND = 800, BEDX = 1120;
const LOOK_W = { robe: C.ochreRobe, hairStyle: 'veil', veil: C.linen2, veil2: shade(C.linen2, -0.12), hair: C.hair2, skin: C.skin2, belt: C.clay };
const GUEST_A = { robe: C.sageRobe, mantle: C.stone, hairStyle: 'short', hair: C.hair2, beard: 'short', skin: C.skin3, belt: C.leather };
const GUEST_B = { robe: C.mauve, mantle: null, hairStyle: 'wrap', veil: C.stone2, hair: C.hair3, beard: 'full', skin: C.skin2, belt: C.leather };

/** a painted paper flame on a little stick — something that only looks like light (origin: the grip) */
function paperFlame(c) {
  const s = sheet();
  s.p(c.ribbon([[0, 0], [0, -34]], 2.4), C.wood2);
  s.p(c.cut([[0, -34], [-11, -46], [-9, -62], [0, -82], [9, -62], [11, -46]], 0.4, 4), mix(C.lampFlame, C.stone2, 0.35));
  s.x(c.ribbon([[-5, -48], [0, -70], [5, -48]], 1.2), shade(C.stone2, -0.2), 'opacity=".6"');
  return s.out();
}

export default {
  id: 'lk8-lamp',
  enter: 'fly',
  beats: [
    { v: 16, text: 'Nikt nie zapala lampy i nie przykrywa jej garncem ani nie stawia pod łóżkiem;' },
    { v: 16, cont: true, text: 'lecz stawia na świeczniku, aby widzieli światło ci, którzy wchodzą.' },
    { v: 17 },
    { v: 18, text: 'Uważajcie więc, jak słuchacie.' },
    { v: 18, cont: true, text: 'Bo kto ma, temu będzie dane; a kto nie ma, temu zabiorą i to, co mu się wydaje, że ma».' },
  ],
  cam: { x: [-40, 60], y: [-30, 50], z: [1, 1.18] },
  build(S) {
    const c = S.c;
    sky(S, ['#6f6c98', '#c79a9a', '#e8b996']);
    /* the room, cut open */
    const room = S.layer({ par: 0.5, sh: 2 });
    const R = sheet();
    const wall = mix(C.plaster, C.dune, 0.2);
    R.p(c.cut([[-1400, -900], [3000, -900], [3000, 1800], [-1400, 1800]], 1, 40) + c.hole([[DOOR - 62, FLOOR], [DOOR - 62, 480], ...c.arc(DOOR, 480, 62, 58, PI, 2 * PI, 12), [DOOR + 62, FLOOR]], 0.4, 6), wall);
    let sp = '';
    for (let i = 0; i < 24; i++) sp += c.cut(c.blob(c.rr(-400, 2000), c.rr(160, 640), c.rr(14, 34), c.rr(6, 12), 8, 0.2), 0.5, 4);
    R.x(sp, C.plaster2, 'opacity=".5"');
    R.p(c.ribbon([[DOOR - 70, FLOOR], [DOOR - 70, 478]], 10) + c.ribbon([[DOOR + 70, FLOOR], [DOOR + 70, 478]], 10) + c.ribbon(c.arc(DOOR, 480, 70, 66, PI, 2 * PI, 12), 10), C.wood2);
    R.p(c.cut(c.rect(-900, 150, 3400, 22), 0.4, 10), C.wood2);
    // the alcove on the back wall (its curtain is separate)
    R.p(c.cut([[980, 580], [980, 420], ...c.arc(1040, 420, 60, 50, PI, 2 * PI, 10), [1100, 580]], 0.4, 6), shade(C.plaster2, -0.25));
    R.p(c.cut(c.rect(970, 578, 140, 10), 0.3, 5), C.wood2);
    R.p(c.cut(c.rect(-1400, FLOOR - 4, 4400, 1200), 0.8, 20), mix(C.clay, C.sand2, 0.5));
    room.add(R.out());
    // what is in the alcove (seen when the curtain draws)
    room.add(`<g transform="translate(1040 574)">${sheet().p(c.cut([[-26, 0], [-30, -30], [-18, -58], [18, -58], [30, -30], [26, 0]], 0.4, 5), C.skyVeil).p(c.cut(c.rect(-10, -70, 20, 12), 0.3, 4), C.wood3).out()}</g>`);
    const glowL = S.layer({ par: 0.5, sh: 0, flat: true });
    const roomGlow = glowL.add(`<g opacity="0"><ellipse cx="${STAND}" cy="480" rx="620" ry="420" fill="url(#warm-glow)"/></g>`);
    const nicheGlow = glowL.add(`<g opacity="0"><circle cx="1040" cy="520" r="110" fill="url(#warm-glow)"/></g>`);

    /* furniture and things */
    const props = S.layer({ par: 0.5, sh: 4 });
    const standEl = props.add(`<g transform="translate(${STAND} ${FLOOR})">${sheet().p(c.cut([[-40, 0], [-26, -16], [-7, -22], [-6, -210], [-20, -218], [20, -218], [6, -210], [7, -22], [26, -16], [40, 0]], 0.5, 7), C.sun).x(c.ribbon([[-6, -110], [6, -110]], 5), shade(C.sun, -0.25)).out()}</g>`);
    const table = props.add(`<g transform="translate(640 ${FLOOR})">${sheet().p(c.cut(c.rect(-50, -70, 100, 10), 0.3, 5), C.wood).p(c.cut(c.rect(-44, -60, 8, 60), 0.2, 4) + c.cut(c.rect(36, -60, 8, 60), 0.2, 4), C.wood2).out()}</g>`);
    const chestEl = props.add(`<g transform="translate(1250 ${FLOOR + 6})">${chest(c, { w: 90, h: 50 })}</g>`);
    const chestLid = chestEl.querySelector('.lid'), chestGlow = chestEl.querySelector('.glow');
    const basketEl = props.add(`<g transform="translate(940 ${FLOOR + 14})">${sheet().p(c.cut([[-34, 0], [34, 0], [40, -34], [-40, -34]], 0.4, 5), C.basket).p(c.ribbon([[-38, -22], [38, -22]], 2), shade(C.basket, -0.3)).p(c.cut(c.ell(-12, -36, 14, 8, 10), 0.2, 3) + c.cut(c.ell(12, -38, 14, 8, 10), 0.2, 3) + c.cut(c.ell(0, -44, 12, 7, 10), 0.2, 3), C.wheat2).out()}</g>`);
    const basketCloth = props.add(`<g>${sheet().p(c.cut([[-46, 0], [-20, -16], [20, -18], [46, 0], [40, 10], [-40, 10]], 0.4, 5), C.blushVeil).out()}</g>`);
    const lamp = props.add(`<g opacity="0"><g class="flame">${handLamp(c)}</g></g>`);
    const lampFlame = lamp.querySelector('.flame');
    const pot = props.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-80" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${coverPot(c, 70, 80)}</g>`);
    const bedEl = props.add(`<g transform="translate(${BEDX} ${FLOOR}) scale(-1.1 1.1)">${bed(c, 220)}</g>`);
    const curtain = props.add(`<g>${sheet().p(c.cut([[0, 0], [70, 0], [72, 168], [0, 168]], 0.4, 6), C.dustyBlue).x([12, 26, 40, 54].map((x) => c.ribbon([[x, 4], [x + 2, 164]], 2.4)).join(''), shade(C.dustyBlue, -0.2), 'opacity=".6"').out()}</g>`);
    const curtainR = props.add(`<g>${sheet().p(c.cut([[0, 0], [70, 0], [72, 168], [0, 168]], 0.4, 6), C.dustyBlue).x([12, 26, 40, 54].map((x) => c.ribbon([[x, 4], [x + 2, 164]], 2.4)).join(''), shade(C.dustyBlue, -0.2), 'opacity=".6"').out()}</g>`);

    /* people */
    const pL = S.layer({ par: 0.5, sh: 5 });
    const woman = S.puppet(pL.add(person(c, LOOK_W)));
    const gA = S.puppet(pL.add(person(c, { ...GUEST_A, holdF: `<g class="lampA">${handLamp(c)}</g>` })));
    const gB = S.puppet(pL.add(person(c, { ...GUEST_B, holdF: `<g class="pflame">${paperFlame(c)}</g>` })));
    const lampA = gA.el.querySelector('.lampA'), pflame = gB.el.querySelector('.pflame');

    /* fx */
    const fx = S.layer({ par: 0.5, sh: 6 });
    const noPot = fx.add(`<g opacity="0">${crossX(c, 26)}</g>`);
    const noBed = fx.add(`<g opacity="0">${crossX(c, 26)}</g>`);
    const ear = fx.add(`<g transform="translate(0 -1500)"><path d="M0 -1600V-30" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${earTag(c, 34)}</g>`);
    const oil = [0, 1, 2].map(() => fx.add(`<g opacity="0"><path d="${c.cut([[0, -7], [4, 0], [2.4, 3.4], [-2.4, 3.4], [-4, 0]], 0.1, 2)}" fill="${C.sun}"/></g>`));
    const bigFlame = fx.add(`<g opacity="0"><circle cy="-20" r="60" fill="url(#warm-glow)"/>${FLAME(c)}</g>`);
    const flyFlame = fx.add(`<g opacity="0">${paperFlame(c)}</g>`);
    const sparks = [0, 1, 2, 3, 4, 5].map(() => fx.add(`<g opacity="0">${sparkle(c, 12)}</g>`));
    const plus = fx.add(`<g opacity="0">${sparkle(c, 18)}</g>`);
    const dark = S.layer({ par: 0, sh: 1, flat: true });
    dark.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#1c1a3a"/>`);

    const TOP = [STAND, FLOOR - 222];

    return (t, time) => {
      const T = time;
      /* v16a — lit, then covered by a pot, then put under the bed */
      const lit = es(t, 0.05, 0.15);
      const covered = es(t, 0.22, 0.36) * (1 - es(t, 0.45, 0.52));
      const toBed = es(t, 0.5, 0.64);
      const up = es(t, 1.05, 1.35);
      let lx = lerp(655, BEDX + 20, toBed), ly = FLOOR - 70 + toBed * 66;
      lx = lerp(lx, TOP[0], up); ly = lerp(ly, TOP[1], up) - Math.sin(up * PI) * 60;
      pose(lamp, { x: lx - 17 * 1.5, y: ly, s: 1.5, o: seg(t, 0.02, 0.06) });
      pose(lampFlame, { o: lit });
      hangAt(pot, 655, lerp(-1500, FLOOR - 70, es(t, 0.18, 0.34, ease.out)) - es(t, 0.44, 0.56, ease.in) * 1600, T, 0, 0);
      const np = es(t, 0.34, 0.44, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(noPot, { x: 655, y: FLOOR - 200, s: np, o: np > 0.02 ? 1 : 0 });
      const nb = es(t, 0.66, 0.76, ease.back) * (1 - es(t, 0.95, 1.05));
      pose(noBed, { x: BEDX + 10, y: FLOOR - 130, s: nb, o: nb > 0.02 ? 1 : 0 });
      const hidden = Math.max(covered, toBed * (1 - up));
      /* v16b — on the lampstand: those who come in see the light */
      const light = up * lit;
      dark.fade(Math.max(0, 0.42 - lit * 0.14 + hidden * 0.22 - light * 0.36));
      fade(roomGlow, light * 0.6);
      woman.set({ x: 560, y: FLOOR, s: 1.02, armF: 20 + lit * 30 + bump(t, 0.2, 0.7) * 40 + bump(t, 1.0, 1.4) * 90, armB: 10 + bump(t, 1.0, 1.4) * 40, head: -bump(t, 1.0, 1.4) * 14, blink: blinkAt(T, 1) });
      const come = es(t, 1.3, 1.75);
      const wonder = es(t, 1.7, 1.9) * (1 - es(t, 3.0, 3.2));
      const cup = es(t, 3.15, 3.35) * (1 - es(t, 3.9, 4.05));
      const xA = lerp(DOOR - 20, 690, come), xB = lerp(DOOR - 110, 470, come);
      gA.set({ x: xA, y: FLOOR + 10, s: 1.0, o: seg(t, 1.25, 1.32), walk: come > 0 && come < 1 ? xA * 0.05 : undefined, armF: 30 + wonder * 50 + es(t, 4.05, 4.3) * 30, armB: 10 + wonder * 120 + cup * 150, head: -wonder * 12 - es(t, 4.1, 4.4) * 6, blink: blinkAt(T, 3) });
      gB.set({ x: xB, y: FLOOR + 16, s: 1.0, o: seg(t, 1.25, 1.32), walk: come > 0 && come < 1 ? xB * 0.05 : undefined, armF: 36 + wonder * 20, armB: 10 + wonder * 130 + cup * 150, head: -wonder * 12 - es(t, 4.45, 4.7) * 16, blink: blinkAt(T, 4) });
      fade(lampA, es(t, 3.9, 4.05));
      fade(pflame, es(t, 3.9, 4.05) * (1 - seg(t, 4.4, 4.42)));

      /* v17 — nothing hidden that will not come to light */
      const reveal = es(t, 2.05, 2.4);
      pose(basketCloth, { x: 940 + reveal * 30, y: FLOOR - 26 - Math.sin(reveal * PI) * 60 + reveal * 20, r: reveal * 40, o: 1 - es(t, 2.35, 2.5) });
      pose(chestLid, { x: -46, y: -50, r: -es(t, 2.15, 2.45) * 62 });
      fade(chestGlow, es(t, 2.2, 2.45));
      pose(curtain, { x: 980 - es(t, 2.25, 2.55) * 60, y: 420, sx: 1 - es(t, 2.25, 2.55) * 0.6 });
      pose(curtainR, { x: 1030 + es(t, 2.25, 2.55) * 60, y: 420, sx: 1 - es(t, 2.25, 2.55) * 0.6 });
      fade(nicheGlow, es(t, 2.3, 2.6));
      sparks.forEach((s, i) => { const k = bump(t, 2.3 + i * 0.05, 2.95); pose(s, { x: [940, 1250, 1040, 980, 1180, 900][i], y: [620, 610, 450, 520, 480, 560][i], s: k, r: T * 40, o: k }); });

      /* v18a — take care how you hear */
      const ek = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 4.0, 4.25));
      hangAt(ear, STAND, lerp(-1500, 290, ek), T, 1.2, 0.7);

      /* v18b — the one who has receives more; from the one who has not, even what he seems to have */
      const [ax, ay] = hand(xA, FLOOR + 10, 1.0, false, 30 + wonder * 50 + es(t, 4.05, 4.3) * 30);
      oil.forEach((o, i) => { const k = seg(t, 4.1 + i * 0.06, 4.3 + i * 0.06); pose(o, { x: ax + 17, y: lerp(ay - 160, ay - 10, k), o: k > 0 && k < 1 ? 1 : 0 }); });
      const grow = es(t, 4.3, 4.5, ease.back);
      pose(bigFlame, { x: ax + 17, y: ay - 8, s: 0.6 + grow * 1.1, o: grow > 0.02 ? 1 : 0 });
      pose(plus, { x: ax + 40, y: ay - 90, s: bump(t, 4.35, 4.9), r: T * 50, o: bump(t, 4.35, 4.9) });
      const [bx, by] = hand(xB, FLOOR + 16, 1.0, false, 36 + wonder * 20);
      const fly = seg(t, 4.42, 4.95);
      pose(flyFlame, { x: bx + fly * 90, y: by - fly * 230, r: fly * 50, s: 1.5 - fly * 0.3, o: fly > 0 ? 1 - es(t, 4.85, 4.98) : 0 });

      S.cam.z = 1.06 + es(t, 0.05, 0.4) * 0.06 - es(t, 1.0, 1.4) * 0.08 + es(t, 3.9, 4.2) * 0.06;
      S.cam.x = -es(t, 0.05, 0.4) * 20 + es(t, 0.45, 0.65) * 60 - es(t, 1.0, 1.4) * 40 - es(t, 3.9, 4.2) * 30;
      S.cam.y = 20;
    };
  },
};
