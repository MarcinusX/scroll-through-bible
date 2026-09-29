// Mt 22,11–13 — the hall is full: the people of the roads sit at the long table in white wedding garments, all
// but one man on a stool at the end, still in his dusty work tunic. The king comes in to see his guests and stops
// before him: "Friend, how did you get in here?" — no answer, only an empty bubble. The king turns to his servants;
// they bind the man's hands and feet with cords and lead him out. Night falls outside the lit windows, and out
// there, in the dark, he kneels and weeps.
import { C, person, blinkAt, pose, lerp } from '../kit.js';
import { es, ease, bump, fade } from '../../core/anim.js';
import { hallSet, HALL, kingPuppet, SERVANTS, DRAB, tableSpread, seatedGuests, ropeCoil, tearDrop, bubble, hand, popBubble, shadowPerson, tr, sheet, mix } from './lib.js';
import { makeCutter } from '../../core/paper.js';

const F = HALL.FRONT;
const MX = 1070, MY = F + 8;          // the man without a wedding garment
const KX = 880;                       // where the king stops
const OUT = [990, 548];               // outside, seen through the window

export default {
  id: 'mt22-garment',
  parable: true,
  beats: [
    { v: 11 },
    { v: 12, text: 'Rzekł do niego: "Przyjacielu, jakże tu wszedłeś nie mając stroju weselnego?"' },
    { v: 12, cont: true, text: 'Lecz on oniemiał.' },
    { v: 13, text: 'Wtedy król rzekł sługom: "Zwiążcie mu ręce i nogi i wyrzućcie go na zewnątrz, w ciemności!' },
    { v: 13, cont: true, text: 'Tam będzie płacz i zgrzytanie zębów".' },
  ],
  cam: { x: [-20, 60], y: [-30, 30], z: [1, 1.1] },
  build(S) {
    const c = S.c;
    const set = hallSet(S);
    set.tableL.add(tableSpread(c, set.TOP));
    const [gl, gr] = seatedGuests(makeCutter('mt22-guests'));
    set.seatL.sprite(gl, 360, HALL.SEAT);
    set.seatL.sprite(gr, 1060, HALL.SEAT);

    /* outside, in the dark: he kneels and weeps; two more shadows beside him */
    const shade1 = set.outL.add(`<g>${shadowPerson(makeCutter('mt22-sh1'), { hairStyle: 'short', pose: 'kneel' }, mix(C.night2, C.storm2, 0.5))}</g>`);
    const shade2 = set.outL.add(`<g>${shadowPerson(makeCutter('mt22-sh2'), { hairStyle: 'wrap', pose: 'kneel' }, mix(C.night2, C.storm2, 0.5))}</g>`);
    const outMan = S.puppet(set.outL.add(person(c, { ...DRAB, pose: 'kneel', eyes: 'closed' })));
    const tears = [0, 1, 2].map(() => set.outL.add(`<g>${tearDrop(c, 3)}</g>`));

    /* the people in front */
    const pl = S.layer({ par: 0.5, sh: 5 });
    const stool = pl.add(`<g>${sheet().p(c.cut([[-26, 0], [-22, -34], [22, -34], [26, 0], [18, 0], [16, -24], [-16, -24], [-18, 0]], 0.4, 4), C.wood).p(c.cut(c.rect(-28, -38, 56, 8), 0.3, 4), C.wood3).out()}</g>`);
    const sitMan = S.puppet(pl.add(person(c, { ...DRAB, pose: 'sit' })));
    const standMan = S.puppet(pl.add(person(c, { ...DRAB })));
    const serv = [0, 1].map((i) => ({ i, p: S.puppet(pl.add(person(c, { ...SERVANTS[i + 2] }))) }));
    const king = S.puppet(pl.add(kingPuppet(c)));
    const coilH = pl.add(`<g>${ropeCoil(c, 22)}</g>`);
    const coilF = pl.add(`<g>${ropeCoil(c, 30)}</g>`);
    const friend = pl.add(`<g>${bubble(c, tr(['Przyjacielu, jakże tu wszedłeś', 'bez stroju weselnego?'], ['Friend, how did you come in', 'without wedding clothing?']), { size: 17, tail: 1 })}</g>`);
    const dots = pl.add(`<g>${bubble(c, '…', { size: 26, tail: -1, w: 70 })}</g>`);
    const spot = pl.add(`<g opacity="0"><ellipse cx="0" cy="-110" rx="90" ry="150" fill="url(#halo-glow)"/></g>`);

    set.flies();

    return (t, time) => {
      const T = time;
      const night = es(t, 3.3, 3.9);
      set.update(t, T, { night });

      /* v11 — the king comes in and looks at his guests; he stops before the man */
      const kk = [[0.0, 240], [0.55, KX]];
      const kx = lerp(kk[0][1], kk[1][1], es(t, 0.02, 0.55));
      const kWalk = t > 0.02 && t < 0.55;
      const see = es(t, 0.5, 0.65);
      const turnS = es(t, 3.05, 3.2) * (1 - es(t, 4.1, 4.3));
      const speak = bump(t, 1.05, 1.95);
      king.set({ x: kx, y: F, s: 1.1, flip: false, walk: kWalk ? kx * 0.05 : undefined, blink: blinkAt(T, 1), head: -bump(t, 0.05, 0.5) * 8 + see * 4, armF: 20 + speak * 70 + turnS * 90, armB: 10 + see * 20 + turnS * 40, lean: see * 3 });
      pose(spot, { x: MX, y: MY, o: see * 0.9 * (1 - es(t, 3.6, 3.9)) });

      /* v12 — "Friend…?"; he stands up, and has nothing to say */
      const up = es(t, 1.2, 1.3);
      popBubble(friend, t, 1.1, 1.95, KX + 50, F - 214);
      popBubble(dots, t, 2.12, 2.9, MX - 20, MY - 200);
      pose(stool, { x: MX + 26, y: MY, o: 1 });
      sitMan.set({ x: MX, y: MY, s: 0.94, flip: true, head: -see * 6, armF: 30, blink: blinkAt(T, 4), o: up < 1 ? 1 - up : 0 });

      /* v13a — bound hand and foot and led out */
      const bind = es(t, 3.3, 3.5);
      const lead = es(t, 3.62, 4.0, ease.in);
      const mx = lerp(MX - 30, 1560, lead);
      const bowed = es(t, 2.1, 2.4);
      standMan.set({ x: mx, y: MY, s: 0.96, flip: lead < 0.02, blink: blinkAt(T, 4), head: bowed * 18, lean: bowed * 4 - lead * 4, armF: 16 + bind * 30 - bowed * 10, armB: bind * 30, walk: lead > 0 && lead < 1 ? mx * 0.03 : undefined, amt: 0.3, o: up > 0 ? up : 0 });
      const [hx, hy] = hand(mx, MY, 0.96, lead < 0.02, 16 + bind * 30 - bowed * 10);
      pose(coilH, { x: hx, y: hy - 4, s: bind, o: bind > 0.02 && lead < 0.99 ? 1 : 0 });
      pose(coilF, { x: mx, y: MY - 10, s: es(t, 3.4, 3.55), o: bind > 0.02 && lead < 0.99 ? 1 : 0 });
      serv.forEach((s) => {
        const come = es(t, 3.05 + s.i * 0.05, 3.3 + s.i * 0.05);
        const x = lerp(1520 + s.i * 90, s.i ? mx + 70 : mx - 64, come);
        s.p.set({ x: lead > 0 ? (s.i ? mx + 70 : mx - 64) : x, y: MY + 4 + s.i * 6, s: 0.96, flip: s.i === 1 && lead < 0.02, walk: (come > 0 && come < 1) || (lead > 0 && lead < 1) ? x * 0.05 + s.i : undefined, armF: 30 + bind * 40 + bump(t, 3.3, 3.55) * 30, armB: 10 + bind * 20, blink: blinkAt(T, s.i + 6), o: come > 0.01 && lead < 0.99 ? 1 : 0 });
      });

      /* v13b — outside in the darkness: weeping */
      const outK = es(t, 4.05, 4.3);
      outMan.set({ x: OUT[0], y: OUT[1], s: 0.72, flip: true, head: 26, lean: 14, armF: 150, armB: 120, o: outK });
      pose(shade1, { x: OUT[0] - 96, y: OUT[1] - 8, s: 0.62, o: outK * 0.8 });
      pose(shade2, { x: OUT[0] + 120, y: OUT[1] - 4, s: 0.6, sx: -0.6, o: outK * 0.8 });
      tears.forEach((el, i) => {
        const k = ((T * 0.7 + i / 3) % 1);
        pose(el, { x: OUT[0] - 18 + i * 6, y: OUT[1] - 96 + k * 34, o: outK * (1 - k) });
      });

      S.cam.x = es(t, 0.3, 0.9) * 30 + es(t, 4.0, 4.4) * 10;
      S.cam.y = -10 - es(t, 4.0, 4.4) * 16;
      S.cam.z = 1.02 + es(t, 0.3, 0.9) * 0.03 + es(t, 4.0, 4.4) * 0.04;
    };
  },
};
