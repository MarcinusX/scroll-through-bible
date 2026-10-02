// Mt 22,8–9 — back in the hall: everything is ready, the lanterns lit, the roasts steaming — and every chair is
// empty. The king opens his hand and lets the list of the invited fall to the floor: they were not worthy.
// Then he points out through the door: a little painted signpost of the crossroads comes down, and the
// servants hurry off with their invitations.
import { C, person, blinkAt, pose, lerp, hanging } from '../kit.js';
import { es, ease, bump } from '../../core/anim.js';
import { hallSet, HALL, kingPuppet, SERVANTS, heldInvite, tableSpread, guestList, signpost, vignette, wisp, kf, moving, mix } from './lib.js';

const F = HALL.FRONT;
const KX = 640;

export default {
  id: 'mt22-ready',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 8 },
    { v: 9 },
  ],
  cam: { x: [-20, 40], y: [-20, 30], z: [1, 1.08] },
  build(S) {
    const c = S.c;
    const set = hallSet(S);
    set.tableL.add(tableSpread(c, set.TOP));
    const steam = [540, 1060].map((x, i) => ({ x, i, el: set.tableL.add(`<g opacity=".7">${wisp(c)}</g>`) }));
    // an empty chair glows softly at every place
    const empty = set.seatL.add(`<g>${HALL.SEATS.map((x) => `<ellipse cx="${x}" cy="${HALL.CHAIR - 70}" rx="34" ry="46" fill="url(#halo-glow)"/>`).join('')}</g>`);

    /* the crossroads, painted small, on two strings */
    const picL = S.layer({ par: 0.4, sh: 6 });
    const vid = S.id('cross');
    const inner = `<rect x="-110" y="10" width="220" height="140" fill="${mix(C.skyBlue, C.cream, 0.5)}"/>`
      + `<path d="${c.ridge(c.wave(80, [6, 3], [200, 70]), -120, 120, 160, 10, 0.6)}" fill="${C.hillMid}"/>`
      + `<path d="${c.poly([[-120, 150], [-10, 104], [10, 104], [120, 150]])}" fill="${mix(C.sand, C.dune, 0.3)}"/>`
      + `<path d="${c.poly([[-12, 150], [-4, 96], [4, 96], [12, 150]])}" fill="${mix(C.sand, C.dune, 0.3)}"/>`
      + `<g transform="translate(40 140) scale(.55)">${signpost(c)}</g>`;
    const pic = picL.add(`<g><path d="M-80 -1400V0M80 -1400V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${vignette(c, vid, inner, { w: 220, h: 140, frame: C.sun })}</g>`);

    /* the king and his servants */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const serv = [0, 1, 2].map((i) => ({ i, p: S.puppet(pl.add(person(c, { ...SERVANTS[i], holdF: heldInvite(c) }))), x: (S.portrait ? [860, 940, 1020] : [930, 1030, 1130])[i] }));
    const king = S.puppet(pl.add(kingPuppet(c, { holdF: `<g transform="rotate(6)">${guestList(c, 110)}</g>` })));
    const listEl = pl.add(`<g>${guestList(c, 110)}</g>`);

    set.flies();

    return (t, time) => {
      const T = time;
      set.update(t, T);
      steam.forEach((s) => pose(s.el, { x: s.x + 4, y: set.TOP - 30 - ((T * 0.3 + s.i * 0.5) % 1) * 20, o: 0.7 }));
      pose(empty, { o: 0.5 + bump(t, 0.3, 1.0) * 0.5 });

      /* v8 — ready, but they were not worthy: the list falls */
      const sweep = bump(t, 0.15, 0.6);
      const drop = es(t, 0.6, 0.95, ease.in);
      const point = es(t, 1.08, 1.25);
      king.set({ x: KX, y: F, s: 1.1, blink: blinkAt(T, 1), head: -sweep * 6 + es(t, 0.6, 0.8) * 10 * (1 - point), armB: 10 + sweep * 70, armF: 30 + point * 70 + (1 - drop) * 20, holdF: 0 });
      // the held list is baked into the hand; swap to the loose one as it drops
      const handList = king.el.querySelector('.armFr .hold');
      if (handList) pose(handList, { x: 1.5, y: 57, o: drop > 0.02 ? 0 : 1 });
      const fx = KX + 60, fy = F + 10;
      pose(listEl, { x: lerp(KX + 40, fx + 40, drop), y: lerp(F - 96, fy - 10, drop), r: drop * 70, s: 1.1, sy: lerp(1.1, 0.55, drop), o: drop > 0.02 ? 1 : 0 });

      /* v9 — to the crossroads */
      const pd = es(t, 1.1, 1.45, ease.out);
      pose(pic, { x: S.portrait ? 900 : 1000, y: lerp(-900, 150, pd), s: 1.25, r: Math.sin(T * 0.8) * 1.2 * pd });
      serv.forEach((s) => {
        const go = es(t, 1.45 + s.i * 0.06, 1.95, ease.in);
        const x = lerp(s.x, 1500 + s.i * 60, go);
        s.p.set({ x, y: F + 6 + (s.i % 2) * 8, s: 0.96, flip: go < 0.05, walk: go > 0 && go < 1 ? x * 0.05 + s.i : undefined, armF: 20 + bump(t, 0.2, 0.9) * 20 + go * 30, head: bump(t, 0.3, 0.9) * 10, blink: blinkAt(T, s.i + 4), o: go < 0.99 ? 1 : 0 });
      });

      S.cam.x = es(t, 1.0, 1.4) * 30;
      S.cam.y = -10;
      S.cam.z = 1.02 + es(t, 0.1, 0.8) * 0.04;
    };
  },
};
