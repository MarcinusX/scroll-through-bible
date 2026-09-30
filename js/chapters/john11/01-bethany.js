// J 11,1–3 — the curtains open on a room in Bethany: Lazarus lies sick on a low bed under the window, little
// fever-waves rising over him. His sisters come in — Martha with her apron and keys, carrying a bowl; Mary with her
// long dark hair — and their names are hung up beside his. A sepia plate recalls who Mary is: kneeling at the Lord's
// feet with the alabaster jar, wiping them with her hair while the scent rises. Back in the room she sits by her
// brother and holds his hand. The sisters send a messenger: Martha gives him the folded letter and he runs out of
// the door and away over the hills; the message hangs in the air — a heart with the sick friend inside it.
import { C, person, CAST, blinkAt, curtains, pose } from '../kit.js';
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  homeSet, HOME, WARM, MESSENGER, LAZARUS, MARY, martha, mary, lyingOn, blanket, feverWaves, nameTag, strip, framed, sepia, alabaster, nardMist,
  letter, heart, bedIcon, hungWord, hang2, withFace, faceBits, vis, kf, moving, hand, tr, sheet, shade, mix, PI,
} from './lib.js';
import { bowl } from '../mark2/lib.js';

const F = HOME.floor;
const BX = HOME.bedX;

export default {
  id: 'j11-bethany',
  beats: [
    { cover: true },
    { v: 1, text: 'Był pewien chory, Łazarz z Betanii,' },
    { v: 1, cont: true, text: 'z miejscowości Marii i jej siostry Marty.' },
    { v: 2, text: 'Maria zaś była tą, która namaściła Pana olejkiem i włosami swoimi otarła Jego nogi.' },
    { v: 2, cont: true, text: 'Jej to brat Łazarz chorował.' },
    { v: 3, text: 'Siostry zatem posłały do Niego wiadomość:' },
    { v: 3, cont: true, text: '«Panie, oto choruje ten, którego Ty kochasz».' },
  ],
  cam: { x: [-40, 60], y: [-60, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const set = homeSet(S, { skyCols: WARM });

    /* the messenger running away over the hills (seen through the window and the door) */
    const farRun = S.puppet(set.outL.add(person(c, MESSENGER)));

    /* the sick man on his bed */
    const sick = S.layer({ par: 0.3, sh: 4 });
    const lazEl = sick.add(`<g>${lyingOn(c, LAZARUS, { s: 0.78, w: 200, mat: false, eyes: 'closed' })}</g>`);
    const laz = S.puppet(lazEl.querySelector('.fig'));
    sick.add(`<g transform="translate(${BX} ${F + 6})">${blanket(c, 250)}</g>`);
    const fever = [0, 1].map((i) => sick.add(`<g>${feverWaves(c, 40)}</g>`));

    /* the sisters and the messenger */
    const A = S.layer({ par: 0.32, sh: 5 });
    const marthaP = S.puppet(A.add(martha(c, { holdF: `<g transform="translate(0 -4) scale(.9)">${bowl(c, { w: 34, color: C.pot, food: 'none' })}</g>` })));
    const marthaE = S.puppet(A.add(martha(c)));
    const maryWalk = S.puppet(A.add(mary(c)));
    const marySit = S.puppet(A.add(mary(c, { pose: 'sit' }, faceBits(c))));
    const tear = marySit.el.querySelector('[data-part="sad"]');
    const mess = S.puppet(A.add(person(c, MESSENGER)));
    const note = A.add(`<g>${letter(c, 30)}</g>`);
    set.front();

    /* the flies: names, the sepia plate, the message */
    const X = S.layer({ par: 0.36, sh: 6 });
    const tagL = X.add(`<g>${hang2(nameTag(c, tr('Łazarz', 'Lazarus'), { size: 20 }), 20, 300)}</g>`);
    const tagMa = X.add(`<g>${hang2(nameTag(c, tr('Maria', 'Mary'), { size: 18 }), 18, 300)}</g>`);
    const tagMt = X.add(`<g>${hang2(nameTag(c, tr('Marta', 'Martha'), { size: 18 }), 18, 300)}</g>`);
    const place = X.add(hungWord(c, tr('Betania', 'Bethany'), { size: 26 }));
    // the plate: Mary at the Lord's feet (sepia)
    const PW = 470, PH = 270;
    const aj = alabaster(c, 40);
    const inner = `<rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}" fill="${mix(C.parchment, C.dune, 0.35)}"/>` +
      `<path d="M${-PW / 2} ${PH / 2 - 44}H${PW / 2}V${PH / 2}H${-PW / 2}Z" fill="${mix(C.dune, C.wood3, 0.3)}"/>` +
      `<g transform="translate(-70 ${PH / 2 - 40}) scale(.82)">${person(c, { ...sepia(CAST.jesus, 0.45), pose: 'sit' })}</g>` +
      `<g transform="translate(48 ${PH / 2 - 40}) scale(-.82 .82) rotate(32)">${person(c, { ...sepia(MARY, 0.35), pose: 'kneel' })}</g>` +
      `<g transform="translate(150 ${PH / 2 - 44})"><g transform="rotate(8)">${aj.body}</g></g>`;
    const plate = X.add(`<g>${framed(S, inner, { w: PW, h: PH, rim: C.wood3, k: 'anoint' })}</g>`);
    const mist = X.add(`<g>${nardMist(c, 50)}</g>`);
    const msg = X.add(`<g>${hang2(`<circle r="92" fill="url(#halo-glow)"/>${sheet().p(c.cut(c.circ(0, 0, 70, 36), 0.5, 5), C.haloRim).p(c.cut(c.circ(0, 0, 63, 34), 0.4, 5), C.cream).out()}<g transform="translate(0 6)">${heart(c, 40, C.jesusMantle)}</g><g transform="translate(-2 16) scale(.62)">${bedIcon(c, LAZARUS, 1)}</g>`, 40, 300)}</g>`);

    const cur = curtains(S);
    const MK = [[5.0, 360], [5.35, 560], [5.8, 560], [6.1, 380]];
    const PY0 = S.portrait ? 300 : 380;      // phone: the plate hangs above Martha's head
    const BNX = S.portrait ? 1005 : 1047;    // phone: the village name clear of the edge
    return (t, time) => {
      const T = time;
      cur.set(es(t, 0.05, 0.85), T);

      /* Lazarus: fever, a restless head */
      const ill = 1;
      const hold = es(t, 4.1, 4.5);
      pose(lazEl, { x: BX, y: F - 34 });
      laz.set({ armF: 4, armB: 6, head: -8 + Math.sin(T * 0.6) * 3 + hold * 10 });
      pose2(fever[0], BX + 70, 590, 0.9, T, 0, es(t, 0.9, 1.3) * ill);
      pose2(fever[1], BX + 100, 580, 0.7, T, 1.7, es(t, 1.0, 1.4) * ill);

      /* v1a — the name of the sick man */
      const lt = es(t, 1.1, 1.45, ease.back) * (1 - es(t, 2.9, 3.1));
      vis(tagL, { x: BX + 20, y: 470 - (1 - lt) * 420, r: Math.sin(T * 0.8) * 1.5, o: lt > 0.01 ? 1 : 0 });

      /* v1b — the sisters come in through the door; their names; the village */
      const inK = es(t, 1.95, 2.45, ease.out);
      const mtx = kf(t, [[1.95, 470], [2.45, 610]]);
      const mrx = kf(t, [[2.05, 470], [2.55, 1050]]);
      const sitM = seg(t, 2.55, 2.62);
      marthaP.set({ x: mtx, y: F + 8, s: 0.98, walk: moving(t, [[1.95, 470], [2.45, 610]]) ? mtx * 0.1 : undefined, armF: 50, armB: 10, blink: blinkAt(T, 2), o: seg(t, 1.95, 2.0) * (1 - seg(t, 4.3, 4.35)) });
      maryWalk.set({ x: mrx, y: F + 10, s: 0.96, walk: moving(t, [[2.05, 470], [2.55, 1050]]) ? mrx * 0.1 : undefined, armF: 14, blink: blinkAt(T, 4), o: seg(t, 2.05, 2.1) * (1 - sitM) });
      const lookUp = es(t, 5.2, 5.5) * (1 - es(t, 6.2, 6.5));
      marySit.set({ x: 1060, y: F + 10, s: 0.96, flip: true, armF: 30 + hold * 40, armB: 10, head: 6 + hold * 8 - lookUp * 10, lean: hold * 6, blink: blinkAt(T, 4), o: sitM });
      if (tear) tear.setAttribute('opacity', (hold * (1 - es(t, 6.4, 6.8))).toFixed(2));
      const tk = es(t, 2.25, 2.6, ease.back) * (1 - es(t, 2.9, 3.1));
      vis(tagMt, { x: 600, y: 420 - (1 - tk) * 420, r: Math.sin(T * 0.9 + 1) * 1.5, o: tk > 0.01 ? 1 : 0 });
      vis(tagMa, { x: 1060, y: 470 - (1 - tk) * 420, r: Math.sin(T * 0.8 + 2) * 1.5, o: tk > 0.01 ? 1 : 0 });
      const pk = es(t, 2.1, 2.45, ease.out) * (1 - es(t, 2.9, 3.1));
      vis(place, { x: BNX, y: 300 - (1 - pk) * 420, r: Math.sin(T * 0.7) * 1, o: pk > 0.01 ? 1 : 0 });

      /* v2a — the plate: Mary who anointed the Lord */
      const pl = es(t, 3.0, 3.4, ease.out) * (1 - es(t, 3.9, 4.15, ease.in));
      vis(plate, { x: 800, y: PY0 - (1 - pl) * 640, r: Math.sin(T * 0.6) * 0.6, o: pl > 0.01 ? 1 : 0 });
      const mk = es(t, 3.3, 3.6) * pl;
      vis(mist, { x: 800 + 150, y: PY0 - (1 - pl) * 640 + PH / 2 - 84, s: 0.8 + Math.sin(T * 1.3) * 0.05, o: mk });

      /* v2b — Martha set down her bowl; Mary holds her brother's hand */
      const bowlDown = seg(t, 4.3, 4.35);
      marthaE.set({ x: 610, y: F + 8, s: 0.98, armF: 12 + bump(t, 5.2, 5.9) * 60, armB: 8, head: 4, flip: t > 5.1, blink: blinkAt(T, 2), o: bowlDown });

      /* v3a — the messenger comes in, takes the letter and runs */
      const mx = kf(t, MK);
      mess.set({ x: mx, y: F + 10, s: 0.96, flip: t > 5.75, walk: moving(t, MK) ? mx * 0.13 : undefined, amt: t > 5.75 ? 1.5 : 1, armF: 10 + bump(t, 5.35, 5.8) * 55, lean: t > 5.75 ? -6 : 0, head: bump(t, 5.35, 5.8) * 4, blink: blinkAt(T, 3), o: seg(t, 5.0, 5.05) * (1 - seg(t, 6.08, 6.12)) });
      const [hx, hy] = hand(610, F + 8, 0.98, true, 12 + bump(t, 5.2, 5.9) * 60);
      const [mhx, mhy] = hand(mx, F + 10, 0.96, t > 5.75, 10 + bump(t, 5.35, 5.8) * 55);
      const pass = es(t, 5.45, 5.65);
      vis(note, { x: t < 5.55 ? hx : mhx, y: (t < 5.55 ? hy : mhy) - 6, r: -10, o: seg(t, 5.2, 5.25) * (1 - seg(t, 5.9, 5.95)) });
      void pass;
      /* …and away over the hills */
      const run = es(t, 6.05, 7.0, ease.sine);
      const rx = 990 + run * 130;
      farRun.set({ x: rx, y: 446 - run * 16, s: 0.26, walk: run > 0 && run < 1 ? T * 14 : undefined, amt: 1.6, lean: -8, o: run > 0.01 && run < 0.99 ? 1 : 0 });

      /* v3b — the message */
      const mg = es(t, 6.15, 6.5, ease.back);
      vis(msg, { x: 800, y: 330 - (1 - mg) * 520, r: Math.sin(T * 0.8) * 1.4, o: mg > 0.01 ? 1 : 0 });

      /* camera */
      S.cam.x = kf(t, [[0, 0], [1, 20], [2, -10], [3, 0], [4, 10], [5, -30], [6, -20], [7, 0]]);
      S.cam.y = kf(t, [[0, -20], [1, 0], [3, -50], [4, 10], [6, -10], [7, -40]]);
      S.cam.z = kf(t, [[0, 1], [1, 1.06], [2, 1.02], [3, 1.0], [4, 1.1], [5, 1.06], [6, 1.02]]);
    };
  },
};

/** fever waves over the sick man, drifting up and fading (time-driven) */
function pose2(el, x, y, s, T, seed, on) {
  const k = T ? (T * 0.35 + seed * 0.3) % 1 : 0.5;
  vis(el, { x: x + Math.sin(T * 1.4 + seed) * 4, y: y - k * 30, s, o: on * (0.3 + 0.7 * Math.sin(k * PI)) });
}
