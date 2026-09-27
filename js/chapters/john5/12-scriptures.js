// J 5,39–44 — a scribes' hall, its walls full of scroll-niches. "You search the Scriptures, because you think
// that in them you have eternal life" — three scribes bend over an open scroll, a ring without end hanging above
// them; "and it is they that testify about me" — golden letters rise from the scroll and threads of light all
// run to Jesus. "Yet you will not come to me to have life" — the ring moves over to Him; they turn back to
// their reading. "I do not receive glory from men" — a bystander lifts a laurel to Him; He gently waves it
// away. "But I know that you do not have the love of God in you" — the windows of their hearts open on pale,
// empty hearts. "I have come in my Father's name, and you do not receive me" — He holds up the banner of His
// Father's name; they shake their heads. "If another comes in his own name, you will receive him" — a glittering
// masked figure sweeps in with a banner of his own name, and they open their arms. "How can you believe, who
// receive glory from one another?" — the little gold laurel passes from head to head among them, while the
// glory of God shines through the high window and no one looks up.
import { C, person, CAST, crowdPerson, blinkAt, lerp, mix, shade } from '../kit.js';
import { seg, es, ease, bump, attr, pose, fade } from '../../core/anim.js';
import { hangingLamp } from '../mark14/lib.js';
import {
  scrollHall, readingDesk, scribeOpts, withFace, faceBits, eternityRing, drawRing, hungWord, laurel, heartWindow, openWindow, clothBanner, mask, sparkle, spark,
  vis, kf, headAt, handAt, tr, PI,
} from './lib.js';

const F = 700;
const DX = 520;

export default {
  id: 'j5-scriptures',
  beats: [
    { v: 39, text: 'Badacie Pisma, ponieważ sądzicie, że w nich zawarte jest życie wieczne:' },
    { v: 39, cont: true, text: 'to one właśnie dają o Mnie świadectwo.' },
    { v: 40 },
    { v: 41 },
    { v: 42 },
    { v: 43, text: 'Przyszedłem w imieniu Ojca mego, a nie przyjęliście Mnie.' },
    { v: 43, cont: true, text: 'Gdyby jednak przybył kto inny we własnym imieniu, to byście go przyjęli.' },
    { v: 44 },
  ],
  cam: { x: [-100, 80], y: [-100, 60], z: [1, 1.24] },
  build(S) {
    const c = S.c;
    const H = scrollHall(S, { floor: F, winX: 790, winY: 230 });

    /* two lamps hang in the hall */
    const lampL = S.layer({ par: 0.3, sh: 4 });
    const lamps = [[600, 330], [1010, 350]].map(([x, y], i) => ({ x, y, i, el: lampL.add(`<g><circle cx="26" cy="36" r="120" fill="url(#warm-glow)" opacity=".7"/><path d="M0 -1600V0" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${hangingLamp(c)}</g>`) }));
    /* threads & letters of light */
    const thL = S.layer({ par: 0.4, sh: 0, flat: true });
    const TH = [0, 1, 2, 3, 4].map(() => thL.add(`<path d="" stroke="${C.halo}" stroke-width="3.4" stroke-linecap="round" fill="none" opacity="0"/>`));

    /* people */
    const L = S.layer({ par: 0.45, sh: 5 });
    const SC = [0, 1, 2].map((i) => {
      const el = L.add(withFace(person(c, { ...scribeOpts(c, i), holdF: '' }), faceBits(c)));
      return { i, el, p: S.puppet(el), angry: el.querySelector('[data-part="angry"]'), sad: el.querySelector('[data-part="sad"]'), x: [DX - 100, DX, DX + 100][i], seed: c.rr(0, 9) };
    });
    const D = S.layer({ par: 0.45, sh: 6 });
    D.add(`<g transform="translate(${DX} ${F})">${readingDesk(c, 300)}</g>`);
    SC.forEach((s) => { s.win = D.add(`<g>${heartWindow(c, 'faint', 14)}</g>`); });
    const P = S.layer({ par: 0.5, sh: 6 });
    const byO = crowdPerson(c);
    const by = S.puppet(P.add(person(c, { ...byO, hairStyle: 'short', beard: 'short' })));
    const wreath = P.add(`<g>${laurel(c, 20)}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const banner = P.add(`<g>${clothBanner(c, tr('w imieniu Ojca', 'in my Father’s name'), { size: 20, col: C.cream, ink: C.terracotta, trim: C.sun })}</g>`);
    const pole = P.add(`<g><path d="${c.ribbon([[0, 0], [0, 150]], 5)}" fill="${C.wood2}"/></g>`);
    const MO = { robe: C.plumRobe, mantle: C.sun, belt: C.sun, skin: C.skin, hair: C.hair3, hairStyle: 'wrap', veil: C.sun, veil2: C.terracotta, beard: 'none' };
    const masked = S.puppet(P.add(person(c, { ...MO, holdF: `<g transform="rotate(180) translate(0 -10)">${mask(c, { col: C.sun, r: 20 })}</g>` })));
    const ownB = P.add(`<g>${clothBanner(c, tr('moje imię', 'my own name'), { size: 20, col: C.plumRobe, ink: C.sun, trim: C.sun })}</g>`);
    const glit = [0, 1, 2, 3].map(() => P.add(`<g>${sparkle(c, 10)}</g>`));

    /* flies */
    const X = S.layer({ par: 0.36, sh: 5 });
    const ring = X.add(`<g>${eternityRing(c, 54, 5, 22)}</g>`);
    const lifeT = X.add(hungWord(c, tr('życie wieczne', 'eternal life'), { size: 18 }));
    const letters = [0, 1, 2, 3, 4, 5].map(() => X.add(`<g>${spark(c, 7)}</g>`));
    const little = X.add(`<g>${laurel(c, 14)}</g>`);

    const JX = 900, JY = F + 10, JS = 1.06;
    return (t, time) => {
      const T = time;
      const glory = es(t, 7.05, 7.5);
      lamps.forEach((l) => pose(l.el, { x: l.x, y: l.y, r: Math.sin(T * 0.9 + l.i) * 1.5 }));
      pose(H.winLight, { x: 790, y: 230, s: 1 + glory * 0.8 });
      fade(H.winLight, 0.5 + glory * 0.5);

      /* Jesus */
      const call = bump(t, 2.05, 2.95);
      const refuse = bump(t, 3.3, 3.95);
      const sorrow = es(t, 4.1, 4.3) * (1 - es(t, 4.9, 5.1));
      const hold = es(t, 5.05, 5.3) * (1 - es(t, 5.9, 6.1));
      jesus.set({ x: JX, y: JY, s: JS, flip: t < 3.1 || t > 4.0 ? true : false, armF: 20 + call * 70 + refuse * 60 + hold * 40 + bump(t, 7.1, 7.9) * 30, armB: 10 + call * 60 + hold * 150, head: sorrow * 14 - bump(t, 7.1, 7.9) * 16, blink: blinkAt(T, 1) });
      const [jhx, jhy] = headAt(JX, JY, JS, true);
      const [bhx, bhy] = handAt(JX, JY, JS, true, 10 + 150);
      vis(pole, { x: bhx, y: bhy - 110, o: hold > 0.02 ? 1 : 0 });
      vis(banner, { x: bhx + 2, y: bhy - 110 - (1 - hold) * 10, s: 0.5 + hold * 0.5, o: hold > 0.02 ? 1 : 0 });

      /* the scribes */
      const turnToMask = es(t, 6.2, 6.4) * (1 - es(t, 6.95, 7.1));
      SC.forEach((s) => {
        const read = t < 1.05 || (t > 2.3 && t < 3.0) || t > 7.05 ? 1 : 0.2;
        const look = bump(t, 1.2, 1.9);
        const shake = hold > 0.5 ? Math.sin(T * 6 + s.i) * 10 * hold : 0;
        const welcome = turnToMask;
        const passW = bump(t, 7.1 + s.i * 0.2, 7.5 + s.i * 0.2);
        s.p.set({ x: s.x, y: F - 8, s: 1, flip: welcome > 0.5 ? true : s.i === 2, armF: 30 + read * 40 + welcome * 60 + passW * 60, armB: 10 + welcome * 110 + passW * 80, head: read * 18 - look * 10 + shake, lean: read * (s.i === 2 ? -6 : 6), blink: blinkAt(T, s.seed) });
        attr(s.angry, 'opacity', (hold * 0.8).toFixed(2));
        attr(s.sad, 'opacity', '0');
        const [hx, hy] = headAt(s.x, F - 8, 1, s.i === 2);
        const wk = es(t, 4.05, 4.25, ease.back) * (1 - es(t, 4.95, 5.15));
        vis(s.win, { x: hx, y: hy + 70, s: wk, o: wk > 0.01 ? 1 : 0 });
        openWindow(s.win, es(t, 4.2 + s.i * 0.1, 4.4 + s.i * 0.1), 14);
      });

      /* v39a — eternal life, sought in the scroll; v40 — it rests over Jesus */
      const rk = es(t, 0.1, 0.4, ease.out);
      const move = es(t, 2.1, 2.5);
      const rx = lerp(DX + 40, jhx, move), ry = lerp(340, jhy - 80, move);
      drawRing(ring, rk);
      vis(ring, { x: rx, y: ry - (1 - rk) * 30, r: T * 8, o: t > 0.1 && t < 3.1 ? 1 - es(t, 2.9, 3.1) : 0 });
      vis(lifeT, { x: rx, y: ry - 90, r: Math.sin(T * 0.7) * 1.5, o: t > 0.2 && t < 3.0 ? es(t, 0.2, 0.4) * (1 - es(t, 2.9, 3.05)) : 0 });
      /* v39b — they testify of me: letters rise, threads run to Him */
      const tk = es(t, 1.1, 1.5) * (1 - es(t, 1.95, 2.15));
      TH.forEach((p, i) => {
        if (tk <= 0.01) { attr(p, 'opacity', 0); return; }
        const x0 = DX - 110 + i * 55, y0 = F - 94;
        const x1 = jhx + 10, y1 = jhy + 60;
        const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 120;
        const k = Math.min(1, tk * 1.2);
        attr(p, 'd', `M${x0} ${y0}Q${mx} ${my} ${lerp(x0, x1, k).toFixed(1)} ${lerp(y0, y1, k).toFixed(1)}`);
        attr(p, 'opacity', (0.8 * tk).toFixed(2));
      });
      letters.forEach((l, i) => {
        const k = seg(t, 1.05 + i * 0.07, 1.55 + i * 0.07);
        const x0 = DX - 120 + i * 48;
        vis(l, { x: lerp(x0, jhx + 10, k), y: lerp(F - 96, jhy + 50, k) - Math.sin(k * PI) * 110, s: 1 + Math.sin(T * 6 + i) * 0.1, o: k > 0 && k < 1 ? 1 : 0 });
      });

      /* v41 — glory from men: a laurel offered and waved away */
      const bin = es(t, 2.9, 3.2, ease.out) * (1 - es(t, 4.0, 4.3));
      const bx = lerp(1450, 1130, bin);
      const offer = bump(t, 3.05, 3.9);
      by.set({ x: bx, y: F + 12, s: 1, flip: true, walk: bin > 0 && bin < 1 ? bx * 0.08 : undefined, armF: 20 + offer * 110, armB: 10, head: -offer * 6, blink: blinkAt(T, 4), o: bin > 0.01 ? 1 : 0 });
      const [wx, wy] = handAt(bx, F + 12, 1, true, 20 + offer * 110);
      const lift = bump(t, 3.2, 3.8);
      vis(wreath, { x: lerp(wx, jhx + 40, lift * 0.5), y: wy - 10 - lift * 40, r: Math.sin(T * 2) * 6, o: bin > 0.01 ? 1 : 0 });

      /* v43b — another in his own name: glitter, a mask, a banner */
      const mk = es(t, 6.05, 6.5, ease.out);
      const mx = lerp(-220, 330, mk) + es(t, 7.05, 7.4) * 50;
      masked.set({ x: mx, y: F + 8, s: 1.02, flip: false, walk: mk > 0 && mk < 1 ? mx * 0.08 : undefined, armF: 100, armB: 150, head: -4, lean: -3, blink: 0, o: mk > 0.01 ? 1 : 0 });
      const [ox, oy] = handAt(mx, F + 8, 1.02, false, 150);
      vis(ownB, { x: ox - 90, y: oy - 60, r: Math.sin(T * 1.4) * 3, o: mk > 0.01 ? 1 : 0 });
      glit.forEach((g, i) => {
        const a = T * 1.3 + (i * PI) / 2;
        vis(g, { x: mx + Math.cos(a) * 60, y: F - 120 + Math.sin(a) * 90, s: 0.6 + Math.sin(T * 5 + i) * 0.3, o: mk > 0.01 ? 0.9 : 0 });
      });

      /* v44 — glory passed round among them; the glory of God unseen */
      const ring44 = seg(t, 7.1, 7.95);
      const heads = [...SC.map((s) => headAt(s.x, F - 8, 1, s.i === 2)), headAt(mx, F + 8, 1.02, false)];
      const u = ring44 * (heads.length - 1);
      const a = Math.min(heads.length - 2, Math.floor(u)), f = u - a;
      const h0 = heads[a], h1 = heads[a + 1];
      vis(little, { x: lerp(h0[0], h1[0], f), y: lerp(h0[1], h1[1], f) - 30 - Math.sin(f * PI) * 40, o: t > 7.05 ? es(t, 7.05, 7.15) : 0 });

      S.cam.x = kf(t, [[0, -80], [1.0, -60], [1.6, 0], [2.3, 20], [3.3, 80], [4.1, -60], [5.2, 0], [6.1, -80], [7.1, -40]]);
      S.cam.y = kf(t, [[0, 20], [1.0, 0], [2.0, 10], [3.0, 30], [4.1, 40], [5.2, 10], [6.1, 30], [7.1, -30]]);
      S.cam.z = kf(t, [[0, 1.2], [1.0, 1.14], [2.0, 1.16], [3.0, 1.18], [4.1, 1.22], [5.2, 1.14], [6.1, 1.16], [7.1, 1.06]]);
    };
  },
};
