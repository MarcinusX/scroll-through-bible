// Matthew 22 — the last day of questions in the Temple courts (Mark 12's court, the same cut), and the parable
// of the king's wedding feast told as painted flats: the palace hall with its long table and empty chairs, the
// town of the invited (houses, a field, a stall), the palace terrace over the valley and the city far off,
// the crossroads with its signpost. The cast of the parable: the king, his son the bridegroom, the royal
// servants in their livery, the invited who would not come, the people of the roads, the man without a
// wedding garment. Everything returns SVG markup cut with the seeded scissors + sheet().
import { C, CAST, person, crowdPerson, sheet, shade, mix, pose, lerp, sky, hanging, swing } from '../kit.js';
import { band, hillsWith, town, cypress, olive, sun, cloud, grass, flowers, bush, stars, moon } from '../../assets/nature.js';
import { makeCutter } from '../../core/paper.js';
import { tr } from '../../core/i18n.js';
import { addToHead, addToBody, wreath, circlet, lantern, garland, canopy, loaf, cup, grapes, bowl, jug } from '../mark2/lib.js';
import { crown as headCrown, storyFrame } from '../mark6/lib.js';
import { soldier } from '../mark15/lib.js';
import { pharisee } from '../mark12/lib.js';
import { bakeArms, tiltHead, pose3 } from '../matthew4/lib.js';
import { folk } from '../john6/lib.js';

export {
  templeCourt, COURT, DAY, EVENING, LOOK, JESUS, sadducee, pharisee, herodian, scribe, man, woman, shadowPerson, davidPuppet, moodPuppet,
  denarius, maskOnStick, snare, purse, taxChest, glowHeart, flipPortrait, vignette, disc, loveIcon, lightArc, ring, burningBush, throne, footstool,
  shard, harp, altar, puff, drapeCloth, burst, kingdomGate, gateDoor, hoe,
  kf, moving, hand, headAt, speech, thought, GLYPH, spark, coin, coinStack, scrollOpen, wordSlip,
  bubble, nameTag, strip, sparkle, question, dove, wisp, scrollRoll, withFace, faceBits, along, angel, glory, bigQuestion, balance, crown, voiceRings, hang2,
} from '../mark12/lib.js';
export { storyFrame, addToHead, addToBody, wreath, circlet, lantern, garland, canopy, loaf, cup, grapes, bowl, jug, bakeArms, tiltHead, pose3, folk, tr, sheet, shade, mix, makeCutter };

export const PI = Math.PI;
export const FONT = 'EB Garamond, Georgia, serif';
const k_ = (k) => (k ? ` data-k="${k}"` : '');

/* ================================================================== skies */
export const GOLDEN = [mix(C.apricot, C.lavender, 0.4), mix(C.peach, C.cream, 0.35), mix(C.dawn, C.cream, 0.5)];
export const FEAST_EVE = [mix(C.duskViolet, C.dusk, 0.35), mix(C.dusk, C.peach, 0.55), mix(C.peach, C.dawn, 0.6)];
export const NIGHT = [C.night2, C.night, mix(C.indigo, C.duskViolet, 0.3)];
export const WRATH = [mix(C.storm2, C.plumRobe, 0.35), mix(C.curtain2, C.dusk, 0.5), mix(C.sunDeep, C.apricot, 0.45)];
export const SKY_DAY = [mix(C.skyBlue, C.skyBlue2, 0.3), mix(C.cream, C.skyBlue, 0.25), C.dawn];

/* ================================================================== the Temple questioners */
/** the places of the Pharisees' disciples and Herod's men, facing Jesus (as in Mark 12) */
export const QX = [944, 1012, 1080, 1148];
/** the Pharisees' disciples: younger men in their teachers' colours */
export const pupil = (c, i) => ({ ...pharisee(c, i + 2), hair: [C.hair3, C.hair2][i % 2], beard: 'short', beardColor: [C.hair3, C.hair2][i % 2] });

/* ================================================================== the cast of the parable */
export const KING = { robe: C.linen2, mantle: mix(C.plumRobe, C.indigo, 0.35), belt: C.sun, hair: C.greyHair, hairStyle: 'short', beard: 'full', beardColor: mix(C.greyHair, C.linen, 0.3), skin: C.skin2, mantleArm: true };
export const PRINCE = { robe: C.linen, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.terracotta };
/** the royal servants: one livery (teal tunic, ochre belt, cream head-cloth), different men */
const LIVERY = mix(C.tealRobe, C.teal2, 0.25);
export const SERVANTS = [
  { robe: LIVERY, hair: C.hair2, hairStyle: 'wrap', veil: C.cream, veil2: C.ochre, beard: 'short', skin: C.skin3, belt: C.ochre },
  { robe: LIVERY, hair: C.hair3, hairStyle: 'short', beard: 'none', skin: C.skin2, belt: C.ochre },
  { robe: LIVERY, hair: C.hair, hairStyle: 'curly', beard: 'short', skin: C.skin4, belt: C.ochre },
  { robe: LIVERY, hair: C.hair2, hairStyle: 'wrap', veil: C.cream, veil2: C.ochre, beard: 'none', skin: C.skin, belt: C.ochre },
];
/** the invited: the landowner, the merchant, and the rough ones who seize the servants */
export const INVITED = {
  farmer: { robe: C.wheatRobe, mantle: C.clayMantle, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, veil2: C.ochre, beard: 'full', skin: C.skin3, belt: C.leather },
  merchant: { robe: C.plumRobe, mantle: C.ochre, hair: C.hair3, hairStyle: 'wrap', veil: C.cream, veil2: C.terracotta, beard: 'full', skin: C.skin2, belt: C.sun, mantleArm: true },
  rough1: { robe: mix(C.clay, C.soil, 0.35), hair: C.hair3, hairStyle: 'curly', beard: 'wild', skin: C.skin4, belt: C.leather },
  rough2: { robe: mix(C.storm, C.olive, 0.4), hair: C.hair, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.rope },
};
/** the man who came without a wedding garment: his dusty work tunic */
export const DRAB = { robe: mix(C.soil, C.rock3, 0.45), hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin3, belt: C.rope };
/** a guest at the feast: the people of the roads in white wedding garments */
export function guestLook(c, i) {
  const o = folk(c, i % 3 !== 1 ? true : false);
  const mantles = [C.roseRobe, C.skyVeil, C.wheatRobe, C.sageRobe, C.blushVeil, C.mauve];
  return { ...o, robe: i % 2 ? C.linen : C.cream, mantle: i % 3 === 0 ? mantles[i % mantles.length] : null, belt: i % 2 ? C.sun : null, veil: o.hairStyle === 'veil' ? (i % 2 ? C.linen2 : C.blushVeil) : o.veil };
}
/** the people of the roads, as they were found: good and bad */
export const ROADFOLK = [
  { robe: mix(C.stone2, C.rock2, 0.4), hair: C.greyHair, hairStyle: 'short', beard: 'wild', beardColor: C.greyHair, skin: C.skin2, belt: C.rope }, // lame beggar
  { robe: C.dustyBlue, hair: C.hair2, hairStyle: 'short', beard: 'full', skin: C.skin3, belt: C.leather, eyes: 'closed' }, // blind man
  { robe: C.roseRobe, hairStyle: 'veil', veil: C.blushVeil, hair: C.hair, skin: C.skin, beard: 'none' }, // a mother
  { robe: mix(C.storm, C.soilDark, 0.35), mantle: mix(C.storm2, C.soil, 0.4), hair: C.hair3, hairStyle: 'wrap', veil: C.storm2, veil2: C.soilDark, beard: 'short', skin: C.skin4 }, // a hooded rough man ("bad")
  { robe: C.mauve, mantle: C.ochre, hair: C.hair3, hairStyle: 'short', beard: 'short', skin: C.skin2, belt: C.sun }, // a tax man
  { robe: C.sageRobe, hairStyle: 'veil', veil: C.stone, hair: C.greyHair, skin: C.skin3, beard: 'none' }, // an old woman
  { robe: C.ochreRobe, fur: true, hair: C.hair, hairStyle: 'wild', beard: 'none', skin: C.skin4, belt: C.leather }, // a shepherd lad
  { robe: mix(C.clay, C.plumRobe, 0.4), hair: C.hair2, hairStyle: 'curly', beard: 'wild', skin: C.skin3, belt: C.leather }, // a scowling one ("bad")
];

/** the king as a puppet: purple mantle and a gold crown */
export const kingPuppet = (c, extra = {}) => addToHead(person(c, { ...KING, ...extra }), headCrown(c));
/** the king's son, the bridegroom: a gold circlet and a wreath */
export const princePuppet = (c, extra = {}) => addToHead(person(c, { ...PRINCE, ...extra }), wreath(c) + circlet(c));

/* ================================================================== small helpers */
/** swing a hanging thing, hidden while it is pulled up into the flies */
export function hangAt(el, x, y, time, amp = 1.2, speed = 0.7, seed = 0) {
  pose(el, { x, y, r: Math.sin(time * speed + seed) * amp, oy: 0, o: y < -150 ? 0 : 1 });
}
/** a speech bubble that pops in at a and out at b */
export function popBubble(el, t, a, b, x, y) {
  const k = Math.min(1, Math.max(0, (t - a) / 0.15));
  const e = k * k * (3 - 2 * k) * (1 - Math.min(1, Math.max(0, (t - (b - 0.1)) / 0.1)));
  const bk = e < 1 && k < 1 ? 1 + Math.sin(k * PI) * 0.12 : 1;
  pose(el, { x, y, s: e * bk, o: e > 0.02 ? 1 : 0 });
}
/** a group of people baked into one piece of markup (for L.sprite); members {x, y, s, flip, o, head, armF, armB} */
export const baked = (c, members) => pose3(c, members);

/* ================================================================== props */
/** an invitation: a small rolled scroll tied with a red cord and a gold seal; origin centre (held horizontally) */
export function invitation(c, w = 34) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -6], [w / 2, -6], [w / 2, 6], [-w / 2, 6]], 0.3, 5), C.parchment);
  s.p(c.cut(c.ell(-w / 2, 0, 3.4, 6.4, 10), 0.2, 3) + c.cut(c.ell(w / 2, 0, 3.4, 6.4, 10), 0.2, 3), shade(C.parchment, -0.14));
  s.x(c.ribbon([[-3, -7], [-3, 7]], 2.6), C.terracotta);
  s.p(c.cut(c.circ(-3, 1, 4.4, 10), 0.2, 2), C.sun);
  return s.out();
}
/** an invitation held in the front hand (hand coords, pointing down the arm) */
export const heldInvite = (c) => `<g transform="translate(2 4) rotate(-80)">${invitation(c, 30)}</g>`;
/** a hoe over the shoulder (held in the back hand) */
export function hoeHeld(c) {
  return sheet().p(c.ribbon([[0, 30], [4, -110]], 4), C.wood3).p(c.cut([[4, -110], [26, -104], [24, -94], [2, -100]], 0.3, 4), mix(C.stone2, C.rock3, 0.4)).out();
}
/** a merchant's money bag (held in the front hand) */
export function moneyBagHeld(c) {
  const s = sheet();
  s.p(c.cut([[-5, 2], [5, 2], [9, 10], [18, 18], [20, 30], [13, 38], [-13, 38], [-20, 30], [-18, 18], [-9, 10]], 0.4, 4), C.leather);
  s.p(c.ribbon([[-7, 6], [7, 6]], 3), C.rope);
  s.x(c.poly(c.circ(0, 26, 4, 8)), C.sun);
  return s.out();
}
/** a crutch under the arm (held in the front hand, hanging down) */
export function crutchHeld(c) {
  return sheet().p(c.ribbon([[0, -8], [4, 88]], 4) + c.ribbon([[-12, -10], [12, -8]], 5), C.wood3).out();
}
/** a blind man's stick (front hand) */
export function stickHeld(c) {
  return sheet().p(c.ribbon([[0, -10], [26, 84]], 3.4), C.wood2).out();
}
/** a baby in swaddling, held in the front arm (hand coords) */
export function babyHeld(c) {
  const s = sheet();
  s.p(c.cut(c.ell(-6, -8, 16, 9, 14, -0.5), 0.3, 3), C.linen);
  s.p(c.cut(c.circ(8, -16, 6.5, 12), 0.2, 3), C.skin2);
  return s.out();
}
/** a roast on a platter (the fatlings are ready); origin: bottom centre */
export function roastPlatter(c, w = 70) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -4, w / 2, 7, 20), 0.3, 4), mix(C.stone, C.sun, 0.35));
  s.p(c.cut([[-w * 0.36, -8], [-w * 0.3, -20], [-w * 0.1, -28], [w * 0.14, -27], [w * 0.32, -18], [w * 0.36, -8]], 0.5, 4), mix(C.clay, C.wood2, 0.45));
  s.x(c.ribbon(c.arc(0, -10, w * 0.22, 9, PI * 1.15, PI * 1.85, 6), 2), shade(C.clay, 0.25), 'opacity=".7"');
  s.p(c.cut(c.circ(-w * 0.28, -10, 4, 8), 0.2, 2) + c.cut(c.circ(w * 0.3, -9, 3.4, 8), 0.2, 2), C.olive);
  s.p(c.ribbon([[w * 0.3, -18], [w * 0.44, -26]], 3.4), C.cream);
  return s.out();
}
/** a tall wine amphora on the table; origin bottom */
export function wineJar(c, h = 46, col = C.pot) {
  const s = sheet();
  s.p(c.cut([[-7, 0], [-13, -h * 0.4], [-10, -h * 0.75], [-5, -h * 0.85], [-5, -h], [5, -h], [5, -h * 0.85], [10, -h * 0.75], [13, -h * 0.4], [7, 0]], 0.3, 4), col);
  s.x(c.ribbon([[-11, -h * 0.5], [11, -h * 0.5]], 1.6), shade(col, -0.2), 'opacity=".6"');
  return s.out();
}
/** the tableware of one place: a plate with bread, a cup; origin: table top at the seat */
export function placeSetting(c, i = 0) {
  const s = sheet();
  s.p(c.cut(c.ell(0, -2, 15, 3.6, 12), 0.2, 3), mix(C.stone, C.cream, 0.4));
  s.p(c.cut([[-9, -3], ...c.arc(-2, -3, 7, 5, PI, 2 * PI, 6), [5, -3]], 0.3, 3), C.wheat2);
  return s.out() + `<g transform="translate(14 0) scale(.7)">${cup(c, i % 2 ? C.pot : C.sun)}</g>`;
}
/** a high-backed chair seen from the front, behind the table; origin: its foot */
export function chair(c, { col = C.wood, cushion = C.curtain } = {}) {
  const s = sheet();
  s.p(c.cut([[-22, 0], [-22, -86], [-26, -108], [-18, -122], [0, -128], [18, -122], [26, -108], [22, -86], [22, 0], [16, 0], [16, -84], [-16, -84], [-16, 0]], 0.4, 5), col);
  s.p(c.cut([[-15, -84], [-15, -112], [0, -118], [15, -112], [15, -84]], 0.3, 5), shade(col, 0.18));
  s.p(c.cut(c.rect(-24, -48, 48, 10), 0.3, 4), cushion);
  s.x(c.poly(c.star(0, -104, 6, 2.6, 4, 0)), C.sun);
  return s.out();
}
/** a long banquet table with a festive cloth; origin: floor centre */
export function feastTable(c, w = 900, h = 46) {
  const s = sheet();
  let legs = '';
  for (let x = -w / 2 + 30; x <= w / 2 - 30; x += (w - 60) / 4) legs += c.cut(c.rect(x - 6, -h + 8, 12, h - 8), 0.3, 5);
  s.p(legs, C.wood2);
  s.p(c.cut([[-w / 2, -h], [w / 2, -h], [w / 2, -h + 9], [-w / 2, -h + 9]], 0.4, 12), C.wood);
  const pts = [[-w / 2 + 4, -h + 2], [w / 2 - 4, -h + 2], [w / 2 - 8, -h + 26]];
  for (let x = w / 2 - 8; x > -w / 2 + 8; x -= 30) pts.push(...c.arc(x - 15, -h + 26, 15, 7, 0, PI, 4));
  s.p(c.cut(pts, 0.5, 8), C.cream);
  let pat = '';
  for (let x = -w / 2 + 22; x < w / 2 - 10; x += 30) pat += c.cut(c.star(x, -h + 15, 4.4, 2, 4, 0), 0.2, 3);
  s.x(pat, C.terracotta, 'opacity=".55"');
  s.x(c.ribbon([[-w / 2 + 6, -h + 5], [w / 2 - 6, -h + 5]], 2.4), C.ochre, 'opacity=".8"');
  return s.out();
}
/** bonds: a coil of rope around wrists or ankles; origin centre */
export function ropeCoil(c, w = 26) {
  let d = '';
  for (let i = 0; i < 3; i++) d += c.ribbon(c.arc(0, (i - 1) * 5, w / 2, 4.4, 0, PI * 2, 14), 2.6);
  return sheet().p(d, C.rope).p(c.ribbon([[w / 2 - 2, 4], [w / 2 + 10, 18]], 2.6), C.rope).out();
}
/** a single tear; origin at its top */
export const tearDrop = (c, r = 3.4) => `<path d="${c.poly([[0, 0], [r, r * 2], [r * 0.6, r * 3.1], [-r * 0.6, r * 3.1], [-r, r * 2]])}" fill="${mix(C.skyVeil, C.cream, 0.4)}"/>`;
/** a signpost at the crossroads with arms pointing four ways; origin: its foot */
export function signpost(c, h = 170) {
  const s = sheet();
  s.p(c.cut([[-5, 0], [-4, -h], [4, -h], [5, 0]], 0.4, 6), C.wood2);
  const arm = (y, dir, w, col) => c.cut(dir > 0 ? [[0, y - 10], [w, y - 10], [w + 14, y], [w, y + 10], [0, y + 10]] : [[0, y - 10], [-w, y - 10], [-w - 14, y], [-w, y + 10], [0, y + 10]], 0.3, 4);
  s.p(arm(-h + 20, 1, 70, 0) + arm(-h + 70, 1, 56, 0), C.wood3);
  s.p(arm(-h + 44, -1, 64, 0) + arm(-h + 96, -1, 50, 0), shade(C.wood3, -0.08));
  s.p(c.cut(c.rect(-8, -h - 8, 16, 10), 0.2, 3), C.wood2);
  let marks = '';
  [[-h + 20, 1, 70], [-h + 70, 1, 56], [-h + 44, -1, 64], [-h + 96, -1, 50]].forEach(([y, d, w]) => { marks += c.ribbon([[d * 10, y], [d * (w - 8), y]], 1.4); });
  s.x(marks, C.ink, 'opacity=".35"');
  s.p(c.cut(c.blob(0, 2, 26, 8, 10, 0.2), 0.5, 4), C.rock2);
  return s.out();
}
/** a stone tablet with round top; origin: top centre (hangs from a peg) */
export function tablet(c, w = 104, h = 136, face = mix(C.stone, C.cream, 0.4)) {
  const s = sheet();
  s.p(c.cut([[-w / 2, h], [-w / 2, 30], ...c.arc(0, 30, w / 2, 30, PI, 2 * PI, 14), [w / 2, h]], 0.5, 6), shade(face, -0.12));
  s.p(c.cut([[-w / 2 + 7, h - 7], [-w / 2 + 7, 32], ...c.arc(0, 32, w / 2 - 7, 24, PI, 2 * PI, 12), [w / 2 - 7, h - 7]], 0.4, 6), face);
  return s.out();
}
/** a small scroll hanging on a thread from above: the Law or a Prophet; origin: the knot on top */
export function hangScroll(c, len = 60, h = 44, col = C.parchment) {
  const s = sheet();
  s.p(c.cut(c.rect(-10, len, 20, h), 0.3, 4), col);
  s.p(c.cut(c.ell(0, len, 14, 4, 10), 0.2, 3) + c.cut(c.ell(0, len + h, 14, 4, 10), 0.2, 3), C.wood2);
  let ln = '';
  for (let y = len + 8; y < len + h - 4; y += 7) ln += c.ribbon([[-6, y], [6 - c.rr(0, 4), y]], 1.1);
  s.x(ln, C.ink, 'opacity=".45"');
  return `<path d="M0 0V${len - 4}" stroke="${C.rope}" stroke-width="1.6" fill="none"/>${s.out()}`;
}
/** a wooden peg-beam from which things hang; origin centre */
export function pegBeam(c, w = 420) {
  const s = sheet();
  s.p(c.cut([[-w / 2, -9], [w / 2, -9], [w / 2 + 4, 9], [-w / 2 - 4, 9]], 0.5, 10), C.wood);
  s.p(c.cut(c.circ(-w / 4, 0, 9, 12), 0.2, 3) + c.cut(c.circ(w / 4, 0, 9, 12), 0.2, 3), C.sun);
  return s.out();
}

/* ================================================================== the palace (far, on its hill) */
/** the king's palace, small: white walls, a golden dome, arched windows; origin: base centre. lit: warm windows */
export function palaceFar(c, sc = 1, { lit = false } = {}) {
  const s = sheet();
  const P = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  const wall = mix(C.plaster, C.cream, 0.4), wall2 = mix(C.plaster2, C.stone2, 0.4);
  s.p(c.cut(P([[-150, 0], [-150, -70], [150, -70], [150, 0]]), 0.4, 6), wall2);
  s.p(c.cut(P([[-90, 0], [-90, -110], [90, -110], [90, 0]]), 0.4, 6), wall);
  s.p(c.cut(P([[-60, -110], ...c.arc(0, -110, 60, 58, PI, 2 * PI, 14), [60, -110]]), 0.4, 5), C.sun);
  s.p(c.cut(P([[-4, -166], [0, -190], [4, -166]]), 0.2, 3), C.sun);
  s.p(c.cut(P(c.rect(-150, -76, 60, 8)), 0.2, 4) + c.cut(P(c.rect(90, -76, 60, 8)), 0.2, 4) + c.cut(P(c.rect(-96, -116, 192, 8)), 0.2, 4), shade(C.sun, -0.08));
  // towers with flags
  [-150, 150].forEach((x) => {
    s.p(c.cut(P([[x - 18, 0], [x - 18, -120], [x + 18, -120], [x + 18, 0]]), 0.3, 5), wall);
    s.p(c.cut(P([[x - 22, -120], [x, -150], [x + 22, -120]]), 0.3, 4), C.terracotta);
    s.p(c.ribbon(P([[x, -150], [x, -186]]), 2 * sc), C.wood2);
    s.p(c.cut(P([[x, -186], [x + 30, -178], [x, -168]]), 0.3, 3), C.curtain);
  });
  let win = '';
  [-60, -30, 0, 30, 60].forEach((x) => { win += c.cut(P([[x - 8, -24], [x - 8, -70], ...c.arc(x, -70, 8, 8, PI, 2 * PI, 6), [x + 8, -24]]), 0.2, 3); });
  [-126, -106, 106, 126].forEach((x) => { win += c.cut(P([[x - 6, -20], [x - 6, -46], ...c.arc(x, -46, 6, 6, PI, 2 * PI, 5), [x + 6, -20]]), 0.2, 3); });
  s.p(win, lit ? C.lampFlame : mix(C.soilDark, C.wood2, 0.4));
  s.p(c.cut(P([[-18, 0], [-18, -40], ...c.arc(0, -40, 18, 18, PI, 2 * PI, 8), [18, 0]]), 0.3, 4), lit ? C.lampFlame : mix(C.soilDark, C.wood2, 0.3));
  return s.out();
}
/** only the windows of palaceFar, lit (to fade in over it), with small silhouettes of guests in them */
export function palaceLights(c, sc = 1, { guests = true } = {}) {
  const P = (pts) => pts.map(([x, y]) => [x * sc, y * sc]);
  let win = '', door = '', sil = '';
  [-60, -30, 0, 30, 60].forEach((x) => { win += c.poly(P([[x - 8, -24], [x - 8, -70], ...c.arc(x, -70, 8, 8, PI, 2 * PI, 6), [x + 8, -24]])); });
  [-126, -106, 106, 126].forEach((x) => { win += c.poly(P([[x - 6, -20], [x - 6, -46], ...c.arc(x, -46, 6, 6, PI, 2 * PI, 5), [x + 6, -20]])); });
  door = c.poly(P([[-18, 0], [-18, -40], ...c.arc(0, -40, 18, 18, PI, 2 * PI, 8), [18, 0]]));
  if (guests) [-60, -30, 0, 30, 60].forEach((x, i) => { sil += c.poly(P(c.circ(x + (i % 2 ? 2 : -2), -40, 4.2, 8))) + c.poly(P([[x - 7, -24], [x - 6, -34], [x + 6, -34], [x + 7, -24]])); });
  return `<circle cx="0" cy="${-70 * sc}" r="${190 * sc}" fill="url(#warm-glow)" opacity=".85"/><path d="${win}${door}" fill="${C.lampFlame}"/><path d="${sil}" fill="${mix(C.wood2, C.soilDark, 0.4)}" opacity=".85"/>`;
}

/* ================================================================== the wedding hall */
export const HALL = { WALL: 600, CHAIR: 636, SEAT: 648, TABLE: 684, FRONT: 726, TW: 900, SEATS: [412, 492, 572, 652, 948, 1028, 1108, 1188], WINS: [470, 630, 970, 1130], DOOR: 800 };
/**
 * The king's banquet hall as a painted flat: the garden sky seen through four arched windows (and night that can
 * fall over it), the back wall with its golden frieze and the curtained doorway in the middle, the tiled floor,
 * the row of high-backed chairs, the long table. Layers for the scene's own pieces go between (chairL for the
 * seated guests, frontL for people standing in front); call .flies() after them for lanterns and garlands and
 * the frame. Returns handles and update(t, time, {night}).
 */
export function hallSet(S, { skyCols = GOLDEN, chairsOn = true, tableOn = true } = {}) {
  const c = makeCutter('mt22-hall-set');
  const { WALL, CHAIR, TABLE, TW, WINS, DOOR } = HALL;
  sky(S, skyCols);
  const nightSky = sky(S, NIGHT, { name: 'night' });
  nightSky.layer.add(stars(c, { x0: -900, x1: 2500, y0: -400, y1: 460, n: 90 }));
  nightSky.layer.fade(0);

  // the garden seen through the windows: hills, cypresses, olives
  const far = S.layer({ par: 0.1, sh: 2 });
  const h1 = hillsWith(c, { y: 470, amps: [16, 7, 3], lens: [900, 330, 120], color: C.hillMid, trees: 26, treeColor: C.sage, treeH: 22, x0: -900, x1: 2500 });
  far.add(h1.markup);
  far.add(town(c, { x: 1000, y: h1.fn(1000) + 14, n: 7, spread: 380, sc: 0.5 }));
  far.add(band(c, { y: 520, amps: [6, 3], lens: [600, 200], color: mix(C.hillNear, C.sage, 0.3) }).markup);
  let trees = '';
  for (let x = 330; x < 1300; x += 92) trees += cypress(c, x + c.rr(-14, 14), 540, c.rr(110, 170));
  far.add(trees + olive(c, 560, 548, 0.6) + olive(c, 1040, 548, 0.55));
  // night over the garden
  const farNight = S.layer({ par: 0.1, sh: 0 });
  farNight.add(`<rect x="-3000" y="-3000" width="8000" height="8000" fill="${C.night2}" opacity=".62"/>`);
  farNight.fade(0);
  // the outer darkness: a layer outside the windows for whoever is put out there
  const outL = S.layer({ par: 0.16, sh: 3 });

  // the back wall: plaster, four arched windows cut through, the doorway in the middle
  const wallL = S.layer({ par: 0.26, sh: 5 });
  const plaster = mix(C.plaster, C.peach, 0.18), plaster2 = mix(C.plaster2, C.clay, 0.12);
  const s = sheet();
  const archPts = (x, w, y0, ys) => [[x - w / 2, y0], [x - w / 2, ys], ...c.arc(x, ys, w / 2, w * 0.52, PI, 2 * PI, 12), [x + w / 2, ys], [x + w / 2, y0]];
  let holes = '';
  WINS.forEach((x) => { holes += c.hole(archPts(x, 110, 556, 360), 0.3, 6); });
  s.p(c.cut([[-900, -600], [2500, -600], [2500, WALL + 4], [-900, WALL + 4]], 0.6, 20) + holes, plaster);
  // the dado and the window sills
  s.p(c.cut([[-900, 556], [2500, 556], [2500, WALL + 4], [-900, WALL + 4]], 0.5, 16), plaster2);
  let sills = '';
  WINS.forEach((x) => { sills += c.cut(c.rect(x - 64, 552, 128, 10), 0.3, 5); });
  s.p(sills, mix(C.stone, C.cream, 0.3));
  // arch rims, pilasters with gold capitals
  let rims = '';
  WINS.forEach((x) => { rims += c.ribbon([[x - 55, 556], [x - 55, 360], ...c.arc(x, 360, 55, 57, PI, 2 * PI, 12), [x + 55, 360], [x + 55, 556]], 7); });
  rims += c.ribbon([[DOOR - 78, WALL], [DOOR - 78, 380], ...c.arc(DOOR, 380, 78, 76, PI, 2 * PI, 14), [DOOR + 78, 380], [DOOR + 78, WALL]], 10);
  s.p(rims, C.sun);
  let pil = '', caps = '';
  [390, 550, 710, 890, 1050, 1210].forEach((x) => { pil += c.cut(c.rect(x - 12, 250, 24, WALL - 250), 0.3, 8); caps += c.cut(c.rect(x - 17, 244, 34, 12), 0.2, 4); });
  s.p(pil, mix(plaster, C.stone, 0.4));
  s.p(caps, C.sun);
  // the frieze: a golden band with a running vine
  s.p(c.cut([[-900, 214], [2500, 214], [2500, 244], [-900, 244]], 0.4, 14), mix(C.curtain2, C.plumRobe, 0.3));
  s.x(c.ribbon([[-900, 217], [2500, 217]], 3) + c.ribbon([[-900, 241], [2500, 241]], 3), C.sun);
  let vine = '';
  for (let x = -880; x < 2500; x += 40) vine += c.cut(c.ell(x, 229 + (Math.floor(x / 40) % 2 ? -3 : 3), 8, 4, 8, 0.5), 0.2, 3);
  s.x(vine, C.sun, 'opacity=".85"');
  // ceiling beams
  s.p(c.cut([[-900, -600], [2500, -600], [2500, 150], [-900, 150]], 0.5, 20), mix(C.wood3, C.plaster2, 0.45));
  let coff = '';
  for (let y = 120; y > -600; y -= 90) for (let x = -880; x < 2500; x += 120) coff += c.cut(c.rect(x + 14, y - 62, 92, 62), 0.3, 6);
  s.p(coff, mix(C.wood3, C.plaster, 0.62));
  let ros = '';
  for (let y = 120; y > -600; y -= 90) for (let x = -880; x < 2500; x += 120) ros += c.poly(c.star(x + 60, y - 31, 9, 4, 6, 0));
  s.x(ros, C.sun, 'opacity=".8"');
  s.p(c.cut([[-900, 146], [2500, 146], [2500, 160], [-900, 160]], 0.3, 14), C.sun);
  // the doorway: dark with a draped curtain
  s.p(c.cut([[DOOR - 72, WALL], [DOOR - 72, 380], ...c.arc(DOOR, 380, 72, 70, PI, 2 * PI, 14), [DOOR + 72, 380], [DOOR + 72, WALL]], 0.4, 6), mix(C.soilDark, C.plumRobe, 0.35));
  s.p(c.cut([[DOOR - 72, 372], [DOOR - 30, 330], [DOOR - 46, 470], [DOOR - 58, WALL], [DOOR - 72, WALL]], 0.5, 6) + c.cut([[DOOR + 72, 372], [DOOR + 30, 330], [DOOR + 46, 470], [DOOR + 58, WALL], [DOOR + 72, WALL]], 0.5, 6), C.curtain);
  s.x(c.ribbon([[DOOR - 60, 380], [DOOR - 52, 590]], 2) + c.ribbon([[DOOR + 60, 380], [DOOR + 52, 590]], 2), C.curtain2, 'opacity=".7"');
  wallL.add(s.out());
  // the inside of the doorway, lit when the king comes (a warm glow over the dark)
  const doorGlow = wallL.add(`<g opacity="0"><ellipse cx="${DOOR}" cy="480" rx="60" ry="110" fill="url(#warm-glow)"/></g>`);

  // the tiled floor
  const floorL = S.layer({ par: 0.38, sh: 3 });
  const f = sheet();
  const fc = mix(C.stone, C.sand, 0.4);
  f.p(c.cut([[-900, WALL], [2500, WALL], [2500, 1700], [-900, 1700]], 0.6, 20), fc);
  let tiles = '';
  [614, 636, 666, 706, 760, 830, 920].forEach((y) => { tiles += c.ribbon([[-900, y], [2500, y + c.rr(-1, 1)]], 1.3); });
  for (let k = -20; k <= 20; k++) { const xb = 800 + k * 80; tiles += c.ribbon([[800 + (xb - 800) * 0.5, WALL], [800 + (xb - 800) * 2.4, 1300]], 1.1); }
  f.x(tiles, shade(fc, -0.14), 'opacity=".5"');
  // a long runner carpet from the doorway
  f.p(c.cut([[DOOR - 60, WALL + 2], [DOOR + 60, WALL + 2], [DOOR + 150, 1300], [DOOR - 150, 1300]], 0.5, 12), mix(C.curtain, C.roseRobe, 0.4));
  f.x(c.ribbon([[DOOR - 52, WALL + 6], [DOOR - 134, 1300]], 3) + c.ribbon([[DOOR + 52, WALL + 6], [DOOR + 134, 1300]], 3), C.sun, 'opacity=".7"');
  floorL.add(f.out());

  // the chairs
  const chairL = S.layer({ par: 0.42, sh: 4 });
  if (chairsOn) {
    let ch = '';
    HALL.SEATS.forEach((x, i) => { ch += `<g transform="translate(${x} ${CHAIR}) scale(.84)">${chair(c, { cushion: [C.curtain, C.teal2, C.ochre][i % 3] })}</g>`; });
    ch += `<g transform="translate(${DOOR} ${CHAIR - 6}) scale(1.08)">${chair(c, { col: C.sun, cushion: C.plumRobe })}</g>`;
    chairL.add(ch);
  }
  // the seated guests go here (scene's own layer)
  const seatL = S.layer({ par: 0.43, sh: 4 });
  // the table
  const tableL = S.layer({ par: 0.45, sh: 4 });
  const tableEl = tableOn ? tableL.add(`<g transform="translate(${DOOR} ${TABLE})">${feastTable(c, TW)}</g>`) : null;

  return {
    c, nightSky, farNight, outL, wallL, doorGlow, floorL, chairL, seatL, tableL, tableEl, TOP: TABLE - 46,
    /** lanterns and garlands on the flies, and the paper frame (call after the people layers) */
    flies({ lanterns = [470, 630, 970, 1130], lit = 1 } = {}) {
      const flyL = S.layer({ par: 0.5, sh: 5 });
      const garl = [[350, 240], [590, 220], [810, 220], [1030, 240]].map(([x, w], i) => ({ x, i, el: flyL.add(`<g><path d="M0 -1600V0M${w} -1600V0" stroke="rgba(74,54,34,.45)" stroke-width="1.1" fill="none"/>${garland(c, w, 30)}</g>`) }));
      const lamps = lanterns.map((x, i) => {
        const el = hanging(flyL, lantern(c, { col: [C.apricot, C.roseRobe, C.wheat][i % 3] }), { x, y: 250, len: 800 });
        return { x, i, el, glow: el.querySelector('.glow'), y: 272 + (i % 2) * 22 };
      });
      storyFrame(S);
      this.garl = garl; this.lamps = lamps;
      return flyL;
    },
    /** idle: lanterns swing, garlands; drop (0 up in the flies … 1 hung), lit 0..1, night 0..1 */
    update(t, T, { drop = 1, lit = 1, night = 0 } = {}) {
      nightSky.layer.fade(night);
      farNight.fade(night);
      (this.garl || []).forEach((g) => pose(g.el, { x: g.x, y: lerp(-500, 206, drop), r: Math.sin(T * 0.6 + g.i) * 0.5 }));
      (this.lamps || []).forEach((l) => {
        pose(l.el, { x: l.x, y: lerp(-500, l.y, drop), r: Math.sin(T * 1.1 + l.i) * 2.2 });
        pose(l.glow, { o: lit * (0.85 + Math.sin(T * 3 + l.i) * 0.08) });
      });
    },
  };
}
/** the seated guests at the long table, as two sprites (left and right of the king's chair); all in wedding white */
export function seatedGuests(c, { skip = -1, dim = false } = {}) {
  const sides = [[], []];
  HALL.SEATS.forEach((x, i) => {
    if (i === skip) return;
    const o = { ...guestLook(c, i), pose: 'sit' };
    sides[x < HALL.DOOR ? 0 : 1].push({ x: x - (x < HALL.DOOR ? 360 : 1060), y: 0, s: 0.74, flip: x > HALL.DOOR, head: c.rr(-4, 6), armF: c.rr(20, 60), armB: c.rr(0, 20), o });
  });
  return sides.map((m) => pose3(c, m));
}

/* ================================================================== the town of the invited */
export const TOWN = { ROAD: 700, STEP: 638, DOORS: [600, 810, 1020], HOUSE_Y: 612, STALL: 1196, FIELD: 440 };
/**
 * The town where the invited live, as a painted flat: day sky, the palace small on a far hill to the left,
 * a field and olives on the left, three houses facing the road with doors that can close, a market stall
 * on the right, the road in front. Returns handles; door leaves: doors[i] (pose sx 1 = shut, ~0.12 = open).
 */
export function townSet(S, { skyCols = SKY_DAY } = {}) {
  const c = makeCutter('mt22-town-set');
  const sk = sky(S, skyCols);
  const dusk = sky(S, FEAST_EVE, { name: 'dusk' });
  dusk.layer.fade(0);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1240, y: 160, len: 700 });
  const cl = hanging(hangL, cloud(c, 170), { x: 560, y: 160, len: 700 });

  const far = S.layer({ par: 0.1, sh: 2 });
  const h1 = hillsWith(c, { y: 420, amps: [24, 8, 3], lens: [1000, 360, 120], color: C.hillFar, trees: 20, treeColor: C.hillMid, treeH: 18 });
  far.add(h1.markup);
  far.add(`<g transform="translate(250 ${h1.fn(250) + 18})">${palaceFar(c, 0.55)}</g>`);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const m = band(c, { y: 520, amps: [18, 7, 3], lens: [800, 300, 110], color: C.hillMid });
  mid.add(m.markup);
  // the field on the left: furrows and young wheat
  const fs = sheet();
  fs.p(c.cut([[-500, 540], [120, 500], [440, 526], [500, 600], [-500, 622]], 0.8, 10), mix(C.soil, C.clay, 0.45));
  let fur = '';
  for (let i = 0; i < 7; i++) fur += c.ribbon([[-500, 550 + i * 10], [450 - i * 4, 532 + i * 9]], 2.4);
  fs.x(fur, shade(C.soil, -0.2), 'opacity=".55"');
  let shoots = '';
  for (let i = 0; i < 70; i++) { const x = c.rr(-400, 450), y = c.rr(536, 606); if (y < 528 + (x + 500) * 0.02) continue; shoots += c.ribbon([[x, y], [x + c.rr(-2, 2), y - c.rr(5, 10)]], 1.8); }
  fs.x(shoots, C.wheatGreen);
  mid.add(fs.out());
  mid.add(olive(c, 470, m.fn(470) + 30, 0.7) + olive(c, 1480, m.fn(1480) + 20, 0.8) + cypress(c, 1340, m.fn(1340) + 14, 130));

  // the three houses
  const houseL = S.layer({ par: 0.34, sh: 4 });
  const Y = TOWN.HOUSE_Y;
  const hs = sheet();
  const walls = [mix(C.plaster, C.peach, 0.2), mix(C.plaster, C.sand, 0.3), mix(C.plaster, C.skyVeil, 0.25)];
  TOWN.DOORS.forEach((x, i) => {
    const w = 172, h = 164 + (i % 2) * 18, wall = walls[i];
    hs.p(c.cut([[x - w / 2, Y], [x - w / 2, Y - h], [x + w / 2, Y - h], [x + w / 2, Y]], 0.5, 8), wall);
    hs.p(c.cut([[x + w / 2, Y - h], [x + w / 2 + 30, Y - h + 10], [x + w / 2 + 30, Y], [x + w / 2, Y]], 0.4, 6), shade(wall, -0.14));
    hs.p(c.cut(c.rect(x - w / 2 - 6, Y - h - 10, w + 12, 12), 0.3, 6), C.roof);
    // doorway (dark), lintel
    hs.p(c.cut([[x - 30, Y], [x - 30, Y - 96], ...c.arc(x, Y - 96, 30, 20, PI, 2 * PI, 8), [x + 30, Y]], 0.3, 5), mix(C.soilDark, C.wood2, 0.3));
    hs.p(c.cut(c.rect(x - 36, Y - 120, 72, 8), 0.2, 4), C.wood2);
    // a window with shutters, a pot on the roof, a step
    const wx = x + (i % 2 ? -62 : 62);
    hs.p(c.cut(c.rect(wx - 14, Y - h + 40, 28, 28), 0.2, 4), mix(C.soilDark, C.wood2, 0.3));
    hs.p(c.cut(c.rect(wx - 26, Y - h + 38, 10, 32), 0.2, 4) + c.cut(c.rect(wx + 16, Y - h + 38, 10, 32), 0.2, 4), [C.teal2, C.clay, C.dustyBlue][i]);
    hs.p(c.cut(c.ell(x + (i % 2 ? 60 : -60), Y - h - 16, 10, 7, 10), 0.2, 3), C.pot);
    hs.p(c.cut(c.rect(x - 40, Y - 2, 80, 10), 0.3, 5), C.stone2);
  });
  houseL.add(hs.out());
  const doors = TOWN.DOORS.map(() => houseL.add(`<g><path d="${c.cut([[0, 0], [0, -96], ...c.arc(30, -96, 30, 20, PI, 2 * PI, 8), [60, -96], [60, 0]], 0.3, 5)}" fill="${C.wood}"/><path d="${c.ribbon([[16, -8], [16, -100]], 2) + c.ribbon([[44, -8], [44, -100]], 2)}" fill="${C.wood2}" opacity=".6"/><path d="${c.poly(c.circ(50, -50, 3, 6))}" fill="${C.sun}"/></g>`));
  // the market stall
  const stallEl = houseL.add(stall(c));

  // the road
  const roadL = S.layer({ par: 0.4, sh: 3 });
  const r = sheet();
  r.p(c.cut([[-900, Y], [2500, Y], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.sand, C.stone, 0.3));
  r.p(c.cut([[-900, 664], [2500, 658], [2500, 734], [-900, 744]], 0.8, 16), mix(C.sand2, C.sand, 0.5));
  let peb = '';
  for (let i = 0; i < 40; i++) peb += c.cut(c.blob(c.rr(-600, 2200), c.rr(650, 900), c.rr(4, 8), c.rr(2, 4), 7, 0.2), 0.2, 3);
  r.x(peb, C.stone2, 'opacity=".7"');
  roadL.add(r.out());
  roadL.add(grass(c, { x0: -900, x1: 2500, y: Y + 4, n: 30, h: 12, color: C.olive }));
  return {
    c, sk, dusk, hangL, sunEl, cl, far, houseL, doors, stallEl, roadL,
    front() {
      const fg = S.layer({ par: 0.8, sh: 6 });
      fg.add(bush(c, 230, 890, 200, C.moss, C.sage) + bush(c, 1420, 900, 220, C.sage, C.moss));
      storyFrame(S);
      return fg;
    },
    update(t, T, { sunY = 160 } = {}) {
      swing(sunEl, 1240, sunY, T, 1, 0.6);
      swing(cl, 560 + Math.sin(T * 0.1) * 20, 160, T, 1.2, 0.6, 1);
    },
  };
}
/** a market stall with an awning, jars and cloth; origin world (right of the houses) */
function stall(c) {
  const s = sheet();
  const x = TOWN.STALL, y = TOWN.HOUSE_Y + 8;
  s.p(c.ribbon([[x - 90, y], [x - 90, y - 150]], 6) + c.ribbon([[x + 90, y], [x + 90, y - 150]], 6), C.wood2);
  const aw = [[x - 110, y - 150], [x + 110, y - 150], [x + 110, y - 124]];
  for (let xx = x + 110; xx > x - 110; xx -= 22) aw.push(...c.arc(xx - 11, y - 124, 11, 8, 0, PI, 4));
  s.p(c.cut(aw, 0.4, 6), C.curtain);
  let st = '';
  for (let xx = x - 100; xx < x + 110; xx += 44) st += c.cut([[xx, y - 150], [xx + 22, y - 150], [xx + 22, y - 124], [xx, y - 124]], 0.2, 4);
  s.p(st, C.cream);
  s.p(c.cut(c.rect(x - 90, y - 60, 180, 60), 0.4, 6), C.wood);
  s.p(c.cut(c.rect(x - 106, y - 66, 212, 10), 0.3, 5), C.wood3);
  s.p(c.cut(c.ell(x - 60, y - 80, 16, 16, 12), 0.3, 4) + c.cut(c.ell(x - 30, y - 76, 12, 12, 10), 0.3, 4), C.pot);
  s.p(c.cut(c.rect(x + 10, y - 90, 70, 26), 0.3, 4), C.plumRobe);
  s.p(c.cut(c.rect(x + 20, y - 104, 50, 16), 0.3, 4), C.ochre);
  return s.out();
}

/* ================================================================== the palace terrace over the valley */
export const TERRACE = { Y: 640, KX: 540, CITY: 1140, CITY_Y: 440 };
/**
 * The king's terrace (left, near) looking over the valley to the city of the murderers on its far hill (right).
 * A second sky of wrath can be faded in. Returns handles: city glow and smoke to drive, the road points.
 */
export function terraceSet(S) {
  const c = makeCutter('mt22-terrace-set');
  sky(S, GOLDEN);
  const wrath = sky(S, WRATH, { name: 'wrath' });
  wrath.layer.fade(0);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 42, { rays: C.sunDeep, disc: mix(C.sun, C.sunDeep, 0.35), inner: C.apricot }), { x: 820, y: 170, len: 700 });

  const far = S.layer({ par: 0.1, sh: 2 });
  const h1 = band(c, { y: 440, amps: [20, 8, 3], lens: [1000, 360, 120], color: C.hillFar });
  far.add(h1.markup);
  // the city of the murderers on its hill (right): a walled town with two towers
  const hill = sheet().p(c.cut([[860, 500], [960, 452], [1060, 426], [1200, 420], [1320, 436], [1420, 480], [1480, 520], [860, 520]], 0.8, 10), mix(C.hillMid, C.hillFar, 0.35)).out();
  far.add(hill);
  const cw = sheet();
  const wallC = mix(C.stone2, C.plaster2, 0.45);
  const wpts = [[990, 446], [990, 404]];
  for (let x = 990; x < 1290; x += 16) wpts.push([x, 404], [x, 396], [x + 9, 396], [x + 9, 404]);
  wpts.push([1290, 404], [1290, 444]);
  cw.p(c.cut(wpts, 0.3, 6), wallC);
  cw.p(c.cut(c.rect(976, 380, 30, 66), 0.3, 5) + c.cut(c.rect(1276, 378, 30, 68), 0.3, 5), shade(wallC, -0.06));
  cw.p(c.cut([[1124, 446], [1124, 420], ...c.arc(1140, 420, 16, 14, PI, 2 * PI, 6), [1156, 420], [1156, 446]], 0.3, 4), mix(C.soilDark, C.wood2, 0.3));
  far.add(`<g>${town(c, { x: 1140, y: 392, n: 9, spread: 250, sc: 0.62 })}${cw.out()}</g>`);
  // the glow of the fire over the city, flames on the roofs, smoke (driven by the scene)
  const fireL = S.layer({ par: 0.1, sh: 1 });
  const glow = fireL.add(`<g opacity="0"><ellipse cx="0" cy="0" rx="260" ry="150" fill="url(#warm-glow)"/></g>`);
  const flames = [990, 1040, 1100, 1160, 1220, 1270].map((x, i) => fireL.add(`<g opacity="0"><path d="${c.cut([[-9, 0], [-12, -12], [-5, -26], [-2, -16], [2, -32], [7, -18], [12, -10], [9, 0]], 0.4, 3)}" fill="${C.sunDeep}"/><path d="${c.cut([[-5, 0], [-6, -8], [-1, -16], [3, -8], [5, 0]], 0.3, 3)}" fill="${C.lampFlame}"/></g>`));
  const smoke = [0, 1, 2, 3, 4, 5, 6].map((i) => fireL.add(`<path d="${c.cut(c.blob(0, 0, 30, 22, 11, 0.25), 0.8, 5)}" fill="${mix(C.storm, C.stone2, 0.35)}" opacity="0"/>`));

  // the valley with its road winding from the palace gate to the city
  const mid = S.layer({ par: 0.2, sh: 3 });
  const m = band(c, { y: 510, amps: [10, 5, 2], lens: [800, 300, 110], color: C.hillMid });
  mid.add(m.markup);
  const ROAD = [[640, 620], [760, 598], [860, 574], [960, 548], [1040, 528], [1100, 508], [1140, 476]];
  const rd = [];
  ROAD.forEach(([x, y], i) => { const w = lerp(34, 8, i / (ROAD.length - 1)); rd.push([x, y - w / 2]); });
  const rd2 = ROAD.slice().reverse().map(([x, y], i) => { const w = lerp(8, 34, i / (ROAD.length - 1)); return [x, y + w / 2]; });
  mid.add(sheet().p(c.cut([...rd, ...rd2], 0.4, 8), mix(C.sand, C.dune, 0.3)).out());
  mid.add(olive(c, 900, 520, 0.4) + olive(c, 1260, 530, 0.45) + cypress(c, 1000, 510, 70) + cypress(c, 1330, 520, 80));
  const troopL = S.layer({ par: 0.22, sh: 2 });

  // the terrace: a balustrade, the palace wall and one column on the left, the architrave across the top
  const terL = S.layer({ par: 0.5, sh: 5 });
  const t = sheet();
  const st = mix(C.stone, C.cream, 0.4);
  t.p(c.cut([[-900, TERRACE.Y - 4], [2500, TERRACE.Y - 4], [2500, 1700], [-900, 1700]], 0.5, 14), mix(C.stone, C.sand, 0.35));
  t.p(c.cut([[-900, TERRACE.Y - 90], [2500, TERRACE.Y - 90], [2500, TERRACE.Y - 76], [-900, TERRACE.Y - 76]], 0.4, 12), st);
  let posts = '';
  for (let x = -880; x < 2500; x += 30) posts += c.cut([[x, TERRACE.Y - 76], [x + 14, TERRACE.Y - 76], [x + 11, TERRACE.Y - 40], [x + 16, TERRACE.Y - 8], [x - 2, TERRACE.Y - 8], [x + 3, TERRACE.Y - 40]], 0.3, 4);
  t.p(posts, shade(st, -0.06));
  t.p(c.cut([[-900, TERRACE.Y - 10], [2500, TERRACE.Y - 10], [2500, TERRACE.Y + 4], [-900, TERRACE.Y + 4]], 0.4, 12), shade(st, -0.1));
  t.p(c.cut([[-900, -600], [230, -600], [230, TERRACE.Y], [-900, TERRACE.Y]], 0.5, 14), mix(C.plaster, C.peach, 0.2));
  const col = (x) => c.cut([[x - 30, TERRACE.Y - 4], [x - 25, 120], [x + 25, 120], [x + 30, TERRACE.Y - 4]], 0.5, 10);
  t.p(col(300), mix(C.stone, C.cream, 0.25));
  t.x(c.ribbon([[288, 130], [288, TERRACE.Y - 8]], 3) + c.ribbon([[312, 130], [312, TERRACE.Y - 8]], 3), shade(C.stone, -0.1), 'opacity=".6"');
  t.p(c.cut(c.rect(262, 108, 76, 16), 0.3, 5), C.sun);
  t.p(c.cut([[-900, 60], [2500, 60], [2500, 96], [-900, 96]], 0.4, 14), mix(C.stone, C.cream, 0.3));
  t.p(c.cut([[-900, 96], [2500, 96], [2500, 108], [-900, 108]], 0.3, 14), C.sun);
  t.p(c.cut([[-900, -600], [2500, -600], [2500, 60], [-900, 60]], 0.5, 14), mix(C.plaster, C.peach, 0.2));
  let dent = '';
  for (let x = -880; x < 2500; x += 22) dent += c.poly(c.rect(x, 70, 10, 10));
  t.x(dent, shade(C.stone, -0.18), 'opacity=".7"');
  terL.add(t.out());
  return {
    c, wrath, sunEl, glow, flames, smoke, troopL, terL, ROAD,
    front() { storyFrame(S); },
    /** burn 0..1: the far city's fire; T time */
    update(t, T, { burn = 0, sunY = 170 } = {}) {
      swing(sunEl, 820, sunY, T, 0.8, 0.6);
      pose(glow, { x: TERRACE.CITY, y: 410, s: 0.7 + burn * 0.5, o: burn * (0.85 + Math.sin(T * 2.3) * 0.08) });
      flames.forEach((f, i) => { const k = 1 + Math.sin(T * 7 + i * 1.7) * 0.15; pose(f, { x: [990, 1040, 1100, 1160, 1220, 1270][i], y: 404 - (i % 3) * 8, sy: k * Math.min(1, burn * 1.6), o: burn > 0.02 ? 1 : 0 }); });
      smoke.forEach((sm, i) => {
        const k = ((T * 0.12 + i / smoke.length) % 1);
        pose(sm, { x: 1000 + i * 45 + k * 70, y: 390 - k * 300, s: 0.5 + k * 1.3, o: burn * (1 - k) * 0.7 });
      });
    },
  };
}
/** a company of soldiers on the march, baked as one piece (for a sprite): n in rows, spears, a standard */
export function troop(seed, n = 6, { s = 0.5, spread = 34, rows = 2 } = {}) {
  const c = makeCutter(seed);
  const per = Math.ceil(n / rows);
  let out = '';
  const mem = [];
  for (let i = 0; i < n; i++) { const r = Math.floor(i / per), k = i % per; mem.push({ x: (k - (per - 1) / 2) * spread + r * spread * 0.4, y: r * 12, s: s * (1 - r * 0.05), i }); }
  mem.sort((a, b) => a.y - b.y).forEach((m) => { out += `<g transform="translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) scale(${m.s})">${bakeArms(soldier(c, m.i, { spear: 20 }), 30, 10)}</g>`; });
  // the standard
  const std = sheet().p(c.ribbon([[0, 0], [0, -150]], 3), C.wood2).p(c.cut([[-16, -150], [16, -150], [16, -112], [0, -104], [-16, -112]], 0.3, 4), C.curtain2).p(c.cut(c.star(0, -132, 7, 3, 5), 0.2, 3), C.sun).out();
  out += `<g transform="translate(${((per - 1) / 2) * spread + 20} -6) scale(${s * 1.2})">${std}</g>`;
  return out;
}

/* ================================================================== the crossroads */
export const CROSS = { X: 800, Y: 640, PAL: [560, 424] };
/**
 * The crossroads as a painted flat: day sky, far hills with the palace on its hill (left) whose windows can light,
 * fields, two roads crossing in the middle under a signpost. Returns handles.
 */
export function crossSet(S) {
  const c = makeCutter('mt22-cross-set');
  sky(S, SKY_DAY);
  const eve = sky(S, FEAST_EVE, { name: 'eve' });
  eve.layer.fade(0);
  const hangL = S.layer({ par: 0.05, sh: 5 });
  const sunEl = hanging(hangL, sun(c, 40), { x: 1200, y: 170, len: 700 });
  const cl = hanging(hangL, cloud(c, 160), { x: 900, y: 150, len: 700 });
  const far = S.layer({ par: 0.1, sh: 2 });
  far.add(band(c, { y: 440, amps: [18, 8, 3], lens: [900, 330, 120], color: C.hillFar }).markup);
  // the palace hill (left)
  const hl = sheet().p(c.cut([[-300, 520], [260, 470], [420, 436], [700, 430], [820, 466], [940, 520]], 0.8, 10), mix(C.hillMid, C.hillFar, 0.3)).out();
  far.add(hl);
  far.add(`<g transform="translate(${CROSS.PAL[0]} ${CROSS.PAL[1] + 16})">${palaceFar(c, 0.8)}</g>`);
  const lights = far.add(`<g opacity="0" transform="translate(${CROSS.PAL[0]} ${CROSS.PAL[1] + 16})">${palaceLights(c, 0.8)}</g>`);
  const mid = S.layer({ par: 0.2, sh: 3 });
  const m = band(c, { y: 520, amps: [10, 5, 2], lens: [800, 300, 110], color: C.hillMid });
  mid.add(m.markup);
  // the road up to the palace
  mid.add(sheet().p(c.cut([[550, 464], [580, 464], [720, 560], [790, 640], [710, 640], [630, 560]], 0.5, 8), mix(C.sand, C.dune, 0.25)).out());
  mid.add(olive(c, 250, 560, 0.7) + olive(c, 1250, 540, 0.6) + cypress(c, 1080, 530, 110) + cypress(c, 1140, 536, 90));
  // the ground and the two roads crossing
  const gr = S.layer({ par: 0.35, sh: 3 });
  const g = sheet();
  g.p(c.cut([[-900, 560], [2500, 560], [2500, 1700], [-900, 1700]], 0.6, 20), mix(C.hillNear, C.sand, 0.3));
  const road = (pts, w0, w1) => {
    const L = [], R = [];
    pts.forEach(([x, y], i) => { const w = lerp(w0, w1, i / (pts.length - 1)) / 2; L.push([x - w, y]); R.push([x + w, y]); });
    return c.cut([...L, ...R.reverse()], 0.5, 10);
  };
  g.p(road([[780, 572], [800, 640], [860, 900], [920, 1300]], 60, 380), mix(C.sand, C.dune, 0.25));
  g.p(c.cut([[-900, 640], [800, 612], [2500, 640], [2500, 720], [800, 668], [-900, 730]], 0.6, 14), mix(C.sand, C.dune, 0.25));
  let ruts = '';
  ruts += c.ribbon([[-900, 686], [800, 640], [2500, 686]], 2) + c.ribbon([[790, 590], [820, 700], [880, 1000]], 2);
  g.x(ruts, shade(C.dune, -0.15), 'opacity=".45"');
  gr.add(g.out());
  gr.add(grass(c, { x0: -900, x1: 2500, y: 566, n: 40, h: 14, color: C.olive }) + flowers(c, { x0: -600, x1: 2200, y: 600, n: 20 }));
  const postL = S.layer({ par: 0.4, sh: 4 });
  postL.add(`<g transform="translate(${CROSS.X - 120} ${CROSS.Y + 10})">${signpost(c)}</g>`);
  return {
    c, eve, sunEl, cl, lights, postL,
    front() {
      const fg = S.layer({ par: 0.8, sh: 6 });
      fg.add(bush(c, 240, 900, 220, C.moss, C.sage) + bush(c, 1400, 910, 230, C.sage, C.moss));
      storyFrame(S);
      return fg;
    },
    update(t, T) {
      swing(sunEl, 1200, 170, T, 1, 0.6);
      swing(cl, 900 + Math.sin(T * 0.1) * 20, 150, T, 1.2, 0.6, 1);
    },
  };
}

/** everything laid on the long table (for a hall already prepared): returns markup in world coords */
export function tableSpread(c, top) {
  let m = '';
  HALL.SEATS.forEach((x, i) => { m += `<g transform="translate(${x} ${top})">${placeSetting(c, i)}</g>`; });
  const big = [[540, roastPlatter(c, 76)], [1060, roastPlatter(c, 70)], [700, wineJar(c, 50, C.pot)], [900, wineJar(c, 46, C.clay)], [450, grapes(c, 5)], [1150, bowl(c, { w: 40, food: 'fruit' })], [620, loaf(c, 17)], [980, loaf(c, 16)], [800, bowl(c, { w: 44, color: C.sun, food: 'bread' })]];
  big.forEach(([x, mk]) => { m += `<g transform="translate(${x} ${top + 1})">${mk}</g>`; });
  return m;
}
/** the list of the invited: a long scroll with names (held hanging from the hand); origin: its top rod */
export function guestList(c, len = 90) {
  const s = sheet();
  s.p(c.cut([[-15, 0], [15, 0], [16, len], [-16, len]], 0.4, 6), C.parchment);
  let ln = '';
  for (let y = 10; y < len - 6; y += 8) ln += c.ribbon([[-10, y], [10 - c.rr(0, 8), y + c.rr(-0.5, 0.5)]], 1.2);
  s.x(ln, C.ink, 'opacity=".5"');
  s.p(c.cut(c.rect(-19, -4, 38, 7), 0.2, 3) + c.cut(c.ell(0, len + 3, 18, 5, 10), 0.2, 3), C.wood2);
  return s.out();
}
