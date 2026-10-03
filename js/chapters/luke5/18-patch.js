// Łk 5,36 — a parable flies down: a tailor's workroom. On the rod hang an old grey cloak with a hole worn through it
// and a new cloak, bright and crisp. The tailor looks from one to the other — then takes the shears to the NEW cloak,
// cuts a square out of its hem, carries it across and stitches it over the hole in the old one. And now both are
// spoilt: the new cloak hangs with a ragged hole cut out of it, the tear running on, and on the old grey cloak the
// bright square sits like a sore — it does not match; its stitches pucker and pull. The tailor throws up his hands.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  cloak, CLOAK_HOLE, newCloak, newPiece, CUT, shears, needle, hand, headAt, kf, moving, glyphTag, thought, GLYPH,
  es, ease, bump, seg, fade, PI,
} from './lib.js';

const FLOOR = 716, ROD = 380;
const OLD_L = { x: 540, y: ROD + 8 }, NEW_L = { x: 1060, y: ROD + 8 };
const TAILOR = { robe: C.sageRobe, mantle: null, hair: C.hair2, hairStyle: 'wrap', veil: C.linen2, beard: 'short', skin: C.skin3, belt: C.leather };

export default {
  id: 'lk5-patch',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 36, text: 'Opowiedział im też przypowieść:' },
    { v: 36, cont: true, text: '«Nikt nie przyszywa do starego ubrania jako łaty tego, co oderwie od nowego;' },
    { v: 36, cont: true, text: 'w przeciwnym razie i nowe podrze, i łata z nowego nie nada się do starego.' },
  ],
  cam: { x: [-80, 80], y: [-20, 60], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    // phone: both cloaks hang inside the screen (the new one was under the thread)
    const OLD = S.portrait ? { ...OLD_L, x: 580 } : OLD_L, NEW = S.portrait ? { ...NEW_L, x: 1000 } : NEW_L;
    const HOLE = [OLD.x + CLOAK_HOLE[0], OLD.y + CLOAK_HOLE[1]];
    const PIECE = [NEW.x + CUT[0], NEW.y + CUT[1]];
    /* the workroom: plastered walls, a window, shelves of cloth rolls, the rod with the cloaks, a work table */
    const wallL = S.layer({ par: 0.3, sh: 2 });
    const w = sheet();
    w.p(c.cut([[-1400, -1000], [3000, -1000], [3000, FLOOR], [-1400, FLOOR]], 0.8, 20), mix(C.plaster, C.sand, 0.25));
    let bl = '';
    for (let i = 0; i < 30; i++) bl += c.cut(c.blob(c.rr(-600, 2200), c.rr(-100, FLOOR - 60), c.rr(20, 50), c.rr(8, 18), 8, 0.2), 0.5, 5);
    w.x(bl, shade(C.plaster2, -0.02), 'opacity=".55"');
    w.p(c.cut([[760, 330], [760, 250], ...c.arc(800, 250, 40, 38, PI, 2 * PI, 10), [840, 330]], 0.4, 6), '#cfe0dc');
    w.p(c.ribbon([[752, 334], [848, 334]], 7) + c.ribbon([[800, 214], [800, 332]], 4), C.wood2);
    w.p(c.cut(c.rect(1260, 300, 200, 8), 0.3, 6) + c.cut(c.rect(1260, 400, 200, 8), 0.3, 6), C.wood2);
    const rolls = [C.terracotta, C.dustyBlue, C.wheatRobe, C.mauve, C.sageRobe, C.clayMantle];
    rolls.forEach((col, i) => { w.p(c.cut(c.ell(1280 + (i % 3) * 64, i < 3 ? 282 : 382, 30, 18, 14), 0.4, 4), col); w.x(c.ribbon(c.arc(1280 + (i % 3) * 64, i < 3 ? 282 : 382, 20, 11, 0, PI * 2.5, 14), 1.2), shade(col, -0.2), 'opacity=".6"'); });
    wallL.add(w.out());
    const floorL = S.layer({ par: 0.5, sh: 3 });
    const fl = sheet().p(c.cut([[-1400, FLOOR - 6], [3000, FLOOR - 10], [3000, 1700], [-1400, 1700]], 0.8, 20), mix(C.clay, C.sand2, 0.5));
    let bd = '';
    for (let x = -1400; x < 3000; x += 90) bd += c.ribbon([[x, FLOOR], [x - 40, 1400]], 1.3);
    fl.x(bd, shade(C.clay, -0.15), 'opacity=".45"');
    floorL.add(fl.out());
    const rodL = S.layer({ par: 0.5, sh: 4 });
    rodL.add(sheet().p(c.ribbon([[340, ROD], [1260, ROD]], 7), C.wood2).p(c.cut(c.rect(334, ROD - 12, 12, 24), 0.3, 4) + c.cut(c.rect(1254, ROD - 12, 12, 24), 0.3, 4), C.wood).out());
    const oldC = rodL.add(`<g>${cloak(c, { big: true, col: mix(C.rock2, C.dustyBlue, 0.35) })}</g>`);
    const newWhole = rodL.add(`<g>${newCloak(c)}</g>`);
    const newCut = rodL.add(`<g>${newCloak(c, { hole: true })}</g>`);
    const tearLines = [0, 1].map((i) => rodL.add(`<path d="${c.ribbon([[0, 0], [4, 14], [-2, 26], [6, 40]], 2)}" fill="${shade(C.terracotta, -0.4)}"/>`));
    // the work table with a basket of thread
    const tableL = S.layer({ par: 0.5, sh: 4 });
    tableL.add(`<g transform="translate(800 ${FLOOR})">${sheet().p(c.cut(c.rect(-120, -80, 240, 12), 0.4, 6), C.wood).p(c.cut(c.rect(-108, -68, 12, 68), 0.3, 5) + c.cut(c.rect(96, -68, 12, 68), 0.3, 5), C.wood2).p(c.cut([[-60, -80], [-64, -100], [-20, -100], [-24, -80]], 0.3, 4), C.basket).p(c.cut(c.circ(-50, -104, 7, 8), 0.2, 3) + c.cut(c.circ(-34, -104, 7, 8), 0.2, 3), C.terracotta).out()}</g>`);

    /* the tailor, the shears, the piece, the needle */
    const PL = S.layer({ par: 0.5, sh: 5 });
    const tailor = S.puppet(PL.add(person(c, TAILOR)));
    const shearsEl = PL.add(`<g>${shears(c, 0)}</g>`);
    const shearsOpen = PL.add(`<g>${shears(c, 34)}</g>`);
    const piece = PL.add(`<g>${newPiece(c)}</g>`);
    const pieceSewn = PL.add(`<g>${newPiece(c, { stitched: true })}</g>`);
    const needleEl = PL.add(`<g>${needle(c)}</g>`);
    const think = PL.add(`<g>${thought(c, GLYPH.q(c), { w: 56, h: 44 })}</g>`);
    const bad = [0, 1].map(() => PL.add(`<g>${glyphTag(c, '✗', { size: 26 })}</g>`));
    const pucker = [0, 1, 2, 3].map(() => PL.add(`<path d="${c.ribbon([[-6, 0], [0, -4], [6, 0]], 1.4)}" fill="${shade(C.terracotta, -0.3)}"/>`));

    const TK = [[0.05, 800], [0.4, 800], [1.0, NEW.x - 90], [1.4, NEW.x - 90], [1.8, OLD.x + 130], [2.9, OLD.x + 130], [3, OLD.x + 150]];

    return (t, time) => {
      const T = time;
      /* v36a — the tailor between the old cloak and the new */
      const tx = kf(t, TK, ease.sine);
      const walking = moving(t, TK);
      const lookOld = es(t, 0.1, 0.3) * (1 - es(t, 0.5, 0.6));
      const toNew = t > 0.4 && t < 1.45;
      const cut = seg(t, 1.05, 1.4);
      const snip = cut > 0 && cut < 1 ? (Math.sin(cut * PI * 6) > 0 ? 1 : 0) : 0;
      const sew = seg(t, 1.85, 2.4);
      const stitch = sew > 0 && sew < 1 ? Math.sin(sew * PI * 8) : 0;
      const dismay = es(t, 2.5, 2.7);
      const faceR = toNew || (t > 0.3 && t < 0.4) ? false : true;
      const armF = walking ? 30 : t > 0.95 && t < 1.45 ? 104 : t > 1.8 && t < 2.45 ? 96 + stitch * 8 : 20 + dismay * 40;
      tailor.set({ x: tx, y: FLOOR + 4, s: 1.04, flip: t < 0.4 ? lookOld > 0.5 : !toNew, walk: walking ? tx * 0.05 : undefined, armF, armB: 16 + dismay * 140, head: -lookOld * 4 - dismay * 8, lean: t > 1.8 && t < 2.45 ? 6 : 0, blink: blinkAt(T, 2) });
      void faceR;
      const [hx, hy] = hand(tx, FLOOR + 4, 1.04, t < 0.4 ? lookOld > 0.5 : !toNew, armF, t > 1.8 && t < 2.45 ? 6 : 0);
      const holdShears = t > 0.4 && t < 1.45;
      pose(shearsEl, { x: hx, y: hy, r: -10, o: holdShears && !snip ? 1 : 0 });
      pose(shearsOpen, { x: hx, y: hy, r: -10, o: holdShears && snip ? 1 : 0 });
      const tk = es(t, 0.2, 0.4, ease.back) * (1 - es(t, 0.8, 0.9));
      const [thx, thy] = headAt(tx, FLOOR + 4, 1.04, false);
      pose(think, { x: thx + 10, y: thy - 40, s: tk, o: tk > 0.01 ? 1 : 0 });

      /* v36b — the square is cut out of the NEW cloak and carried over, and stitched on the old */
      const cutDone = es(t, 1.38, 1.42);
      pose(oldC, { x: OLD.x, y: OLD.y, r: T ? Math.sin(T * 0.7) * 0.8 : 0 });
      pose(newWhole, { x: NEW.x, y: NEW.y, o: 1 - cutDone, r: T ? Math.sin(T * 0.7 + 1) * 0.8 : 0 });
      pose(newCut, { x: NEW.x, y: NEW.y, o: cutDone, r: T ? Math.sin(T * 0.7 + 1) * 0.8 + es(t, 2.4, 2.8) * 3 : 0, sy: 1 + es(t, 2.4, 2.8) * 0.03 });
      const carry = es(t, 1.42, 1.8);
      const onOld = es(t, 1.8, 1.85);
      const px = t < 1.42 ? PIECE[0] : lerp(hx, HOLE[0], onOld), py = t < 1.42 ? PIECE[1] : lerp(hy - 6, HOLE[1], onOld);
      pose(piece, { x: px, y: py, r: carry * 20 * (1 - onOld), o: cutDone * (1 - es(t, 2.38, 2.42)) });
      pose(pieceSewn, { x: HOLE[0], y: HOLE[1], o: es(t, 2.38, 2.42), s: 1 - es(t, 2.5, 2.8) * 0.08 });
      pose(needleEl, { x: hx - 6, y: hy - 6 + stitch * 8, r: -30 + stitch * 10, o: sew > 0 && sew < 1 ? 1 : 0 });

      /* v36c — both spoilt: the tear runs on in the new; the bright patch pulls on the old and does not match */
      tearLines.forEach((tl, i) => { const k = es(t, 2.45 + i * 0.1, 2.8 + i * 0.1); pose(tl, { x: PIECE[0] + (i ? 18 : -18), y: PIECE[1] + 18, sy: k, s: 1, r: i ? -10 : 12, o: k > 0.01 ? 1 : 0 }); });
      pucker.forEach((p, i) => { const k = es(t, 2.5 + i * 0.05, 2.7 + i * 0.05); const a = (i / 4) * PI * 2 + 0.4; pose(p, { x: HOLE[0] + Math.cos(a) * 30, y: HOLE[1] + Math.sin(a) * 28, r: (a * 180) / PI + 90, s: k * 1.3, o: k }); });
      bad.forEach((b, i) => { const k = es(t, 2.55 + i * 0.1, 2.75 + i * 0.1, ease.back); pose(b, { x: i ? NEW.x : OLD.x, y: ROD - 40, s: k, o: k > 0.01 ? 1 : 0 }); });

      S.cam.x = kf(t, [[0, 0], [0.5, 0], [1.0, 60], [1.45, 60], [1.85, -40], [2.45, -40], [2.6, 0], [3, 0]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 0], [2.45, 0], [3, 20]]);
      S.cam.z = kf(t, [[0, 1.02], [1.0, 1.12], [1.45, 1.12], [1.85, 1.12], [2.45, 1.12], [2.6, 1.02], [3, 1.02]]);
    };
  },
};
