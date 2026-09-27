// J 5,5–7 — by the steps lies a man who has been ill for thirty-eight years: a board of tally marks comes down
// and counts them, bundle by bundle. Jesus comes and sees him lying there; He knows how long he has waited (a
// sand-glass in His thought) and asks: "Do you want to be made well?" The man raises himself: "Sir, I have no
// one" — a dashed, empty outline stands where a helper should be — and as the water stirs he drags himself
// towards the steps; another gets up, hurries past and goes down into the pool before him.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, attr, pose } from '../../core/anim.js';
import {
  bethesdaSet, bethesdaIdle, backSick, BZ, DAY, LAME, HEALED, sickLook, blindBand, withFace, faceBits, lyingOn, matFlat, crutch, staff, ripple, tallyBoard,
  ghost, thought, iconBubble, sandGlass, GLYPH, vis, kf, moving, headAt, handAt, tr, PI,
} from './lib.js';

const F = BZ.floor;
const MX = 890;                 // the middle of the man's mat
const JX = 660;

export default {
  id: 'j5-thirtyeight',
  beats: [
    { v: 5 },
    { v: 6, text: 'Gdy Jezus ujrzał go leżącego i poznał, że czeka już długi czas,' },
    { v: 6, cont: true, text: 'rzekł do niego: «Czy chcesz stać się zdrowym?»' },
    { v: 7, text: 'Odpowiedział Mu chory: «Panie, nie mam człowieka, aby mnie wprowadził do sadzawki, gdy nastąpi poruszenie wody.' },
    { v: 7, cont: true, text: 'Gdy ja sam już dochodzę, inny wchodzi przede mną».' },
  ],
  cam: { x: [0, 110], y: [-40, 40], z: [1.04, 1.2] },
  build(S) {
    const c = S.c;
    const set = bethesdaSet(S, { skyCols: DAY });
    backSick(S, set);
    set.sickBackL.fade(1);
    const A = set.actL;

    /* the one who goes in first — in the water (behind the waterline) */
    const otherO = { ...sickLook(c, 4), hairStyle: 'short', beard: 'short' };
    const cr = `<g transform="rotate(180) translate(0 -12)">${crutch(c)}</g>`;
    const otherIn = S.puppet(A.add(person(c, { ...otherO, holdB: cr })));
    set.waterline();
    const otherSit = S.puppet(A.add(person(c, { ...otherO, pose: 'sit' })));
    const otherUp = S.puppet(A.add(person(c, { ...otherO, holdB: cr })));
    const otherCrutch = A.add(`<g>${crutch(c)}</g>`);

    /* other sick along the walk */
    const blind = S.puppet(A.add(withFace(person(c, { ...sickLook(c, 8), pose: 'sit', eyes: 'closed' }), blindBand(c))));
    const blindStaff = A.add(`<g>${staff(c, 150)}</g>`);
    const lier = A.add(lyingOn(c, sickLook(c, 9), { s: 0.7, w: 176, eyes: 'closed' }));
    const lierP = S.puppet(lier.querySelector('.fig'));

    /* the man: lying (head to the left, towards Jesus), then raised up, then dragging himself */
    const mat = A.add(`<g>${matFlat(c, 190)}</g>`);
    const lying = A.add(lyingOn(c, LAME, { s: 0.76, w: 190, mat: false }));
    const lyingP = S.puppet(lying.querySelector('.fig'));
    const sit = S.puppet(A.add(withFace(person(c, { ...LAME, pose: 'sit' }), faceBits(c))));
    const sitEl = sit.el;
    const sad = sitEl.querySelector('[data-part="sad"]');
    const help = A.add(`<g>${ghost(c)}</g>`);

    const jesus = S.puppet(A.add(person(c, { ...CAST.jesus })));

    /* water stirring by the steps */
    const RX = 1010, RY = 596;
    const rings = [0, 1, 2].map((i) => ({ i, el: set.rippleL.add(`<g>${ripple(c, 40, C.foam, 3.4)}</g>`) }));
    const splash = set.rippleL.add(`<g><ellipse rx="90" ry="22" fill="url(#halo-glow)"/></g>`);

    /* the flies: the board of thirty-eight years; bubbles */
    const X = set.flyL;
    const board = X.add(`<g>${tallyBoard(c, 38)}</g>`);
    const marks = Array.from(board.querySelectorAll('[data-i]'));
    const num = board.querySelector('.num');
    const knowB = X.add(`<g>${thought(c, `<g transform="scale(.46)">${sandGlass(c, 70)}</g>`, { w: 70, h: 60 })}</g>`);
    const askB = X.add(`<g>${iconBubble(c, `<g transform="translate(-16 34) scale(.3)">${person(c, HEALED)}</g><g transform="translate(22 0) scale(1.5)">${GLYPH.q(c)}</g>`, { w: 110, h: 90, side: 1 })}</g>`);
    const noneB = X.add(`<g>${iconBubble(c, `<g transform="translate(0 30) scale(.3)">${ghost(c)}</g><path d="${c.ribbon([[-22, -22], [22, 22]], 5) + c.ribbon([[22, -22], [-22, 22]], 5)}" fill="${C.terracotta}" opacity=".8"/>`, { w: 96, h: 90, side: -1 })}</g>`);

    return (t, time) => {
      const T = time;
      bethesdaIdle(set, T);

      /* v5 — thirty-eight years: the board counts them */
      const bk = es(t, 0.1, 0.4, ease.out) * (1 - es(t, 1.9, 2.2, ease.in));
      vis(board, { x: 940, y: 150 - (1 - bk) * 420, r: Math.sin(T * 0.6) * 0.7, o: bk > 0.01 ? 1 : 0 });
      const n = Math.floor(es(t, 0.3, 0.75, (x) => x) * 38.999);
      marks.forEach((m, i) => attr(m, 'opacity', i < n ? 1 : 0));
      const ns = n ? String(n) : '';
      if (num.textContent !== ns) num.textContent = ns;

      /* the man lies there; raises himself (v7a); drags himself (v7b) */
      const raise = es(t, 3.05, 3.15);
      const drag = es(t, 4.1, 4.75, ease.sine);
      const stop = es(t, 4.7, 4.85);
      pose(mat, { x: MX, y: F + 2 - 12 });
      pose(lying, { x: MX, y: F + 2, sx: -1, o: 1 - raise });
      lyingP.set({ armF: 10 + bump(t, 0.3, 0.9) * 20, armB: 8, head: -bump(t, 1.3, 2.9) * 26, blink: blinkAt(T, 2) });
      const sx = lerp(MX - 70, MX + 20, drag);
      sit.set({ x: sx, y: F + 2, s: 0.94, flip: false, armF: 60 + bump(t, 3.1, 3.9) * 40 + drag * 30 * (1 - stop), armB: 20 + bump(t, 3.3, 3.9) * 40 + Math.abs(Math.sin(drag * PI * 3)) * 30 * (1 - stop), lean: 8 + drag * 12 * (1 - stop) - stop * 2, head: -bump(t, 3.1, 3.8) * 12 + stop * 14, bob: -Math.abs(Math.sin(drag * PI * 3)) * 3, blink: blinkAt(T, 2), o: raise });
      attr(sad, 'opacity', stop.toFixed(2));
      const [shx, shy] = headAt(sx, F + 2, 0.94, false, 'sit');
      const gh = bump(t, 3.3, 4.1);
      pose(help, { x: MX + 150, y: F + 6, s: 0.94, o: gh });

      /* v6a — Jesus comes and sees him */
      const JK = [[0.9, 330], [1.5, JX]];
      const jx = kf(t, JK, ease.out);
      const ask = bump(t, 2.05, 3.0);
      jesus.set({ x: jx, y: F + 12, s: 1.04, flip: false, walk: moving(t, JK) ? jx * 0.07 : undefined, armF: 20 + ask * 60 + es(t, 4.8, 5.0) * 30, armB: 10 + ask * 20, head: 10 + bump(t, 1.4, 2.2) * 6 - ask * 8, lean: bump(t, 1.4, 3.0) * 4, blink: blinkAt(T, 1), o: seg(t, 0.9, 1.0) });
      const [jhx, jhy] = headAt(JX, F + 12, 1.04, false);
      const kk = es(t, 1.45, 1.65, ease.back) * (1 - es(t, 1.95, 2.05));
      vis(knowB, { x: jhx + 10, y: jhy - 24, s: kk, o: kk > 0.01 ? 1 : 0 });
      /* v6b — "Do you want to be made well?" */
      const ak = es(t, 2.12, 2.32, ease.back) * (1 - es(t, 2.95, 3.05));
      vis(askB, { x: jhx + 26, y: jhy - 20, s: ak, o: ak > 0.01 ? 1 : 0 });
      /* v7a — "I have no one" */
      const nk = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.95, 4.05));
      vis(noneB, { x: shx - 12, y: shy - 24, s: nk, o: nk > 0.01 ? 1 : 0 });

      /* the water stirs (v7) */
      const stir = es(t, 3.5, 3.7) * (1 - es(t, 4.85, 5.0));
      rings.forEach((r) => {
        const k = stir > 0 ? ((t - 3.5) * 0.9 + r.i / 3) % 1 : 0;
        vis(r.el, { x: RX, y: RY, s: 0.4 + k * 3.4, o: stir * (1 - k) });
      });
      /* v7b — another goes down before him */
      const up = es(t, 4.05, 4.12);
      const go = es(t, 4.12, 4.45, ease.in);
      const inW = seg(t, 4.44, 4.49);
      const wade = es(t, 4.47, 4.62, ease.out);
      const OX = 1180;
      otherSit.set({ x: OX, y: F + 6, s: 0.92, flip: true, armF: 20 + stir * 40, armB: 20, lean: -stir * 8, head: stir * 6, blink: blinkAt(T, 3), o: 1 - up });
      pose(otherCrutch, { x: OX - 50, y: F + 10, r: -80, o: up > 0.5 ? 0 : 1 });
      const ox = lerp(OX, BZ.stepX + 10, go);
      otherUp.set({ x: ox, y: F + 6, s: 0.92, flip: true, walk: go > 0 && go < 1 ? ox * 0.12 : undefined, lean: -6, armB: 24, armF: 40, blink: blinkAt(T, 3), o: up * (1 - inW) });
      otherIn.set({ x: lerp(BZ.stepX + 10, 1000, wade), y: lerp(F, 684, wade), s: 0.92, flip: true, armF: 30 + wade * 50, armB: 20, blink: blinkAt(T, 3), o: inW });
      vis(splash, { x: 1010, y: 640, s: 0.6 + wade * 0.6, o: bump(t, 4.46, 4.9) });

      /* the rest */
      blind.set({ x: 470, y: F + 6, s: 0.92, flip: false, armF: 50, armB: 10, head: 6, blink: 0 });
      const [bx, by] = handAt(470, F + 6, 0.92, false, 50, 'sit');
      pose(blindStaff, { x: bx, y: by + 60 });
      pose(lier, { x: 1330, y: F + 10, sx: -1 });
      lierP.set({ armF: 20 + stir * 50, head: -stir * 20, blink: blinkAt(T, 5) });

      S.cam.x = kf(t, [[0, 90], [0.9, 90], [1.6, 40], [3.0, 50], [4.0, 90], [5, 100]]);
      S.cam.y = kf(t, [[0, -30], [0.9, -20], [1.6, 20], [3.0, 20], [4.0, 20]]);
      S.cam.z = kf(t, [[0, 1.06], [0.9, 1.08], [1.6, 1.16], [3.0, 1.18], [4.0, 1.12]]);
    };
  },
};
