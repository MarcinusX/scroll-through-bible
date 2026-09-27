// J 18,25–27 — back down at the charcoal fire (the hall above now empty but for old Annas): Simon Peter stands warming
// his hands. The men round the fire turn to him: "You aren't also one of His disciples, are you?" — "I am not": a
// second grey tag hangs beside the first. One of the high priest's servants, a kinsman of Malchus (a tag), comes close:
// "Didn't I see you in the garden with Him?" — in his bubble the olive tree and the torchlight. Peter denies it again:
// a third grey tag. And immediately a rooster on the courtyard wall lifts its head and crows, rings going out into
// the first grey light of dawn; the fire sinks to embers and Peter bows his head.
import { seg, es, ease, bump } from '../../core/anim.js';
import {
  courtyard, courtIdle, CY, fireCircle, annas, priest, noTag, say, speech, nameTag, rooster, voiceRings, hanging, vis, kf, headAt, withFace, faceBits, person,
  pose, fade, lerp, mix, sheet, tr, blinkAt, C, TW, KINSMAN, PI, nt, DEEP, PREDAWN,
} from './lib.js';
import { olive } from '../../assets/nature.js';

const { YARD, HALL, FIRE, ANX } = CY;
const ROO = { x: 470, y: 428 };
const KX = FIRE + 150;

export default {
  id: 'j18-rooster',
  beats: [
    { v: 25, text: 'A Szymon Piotr stał i grzał się [przy ogniu].' },
    { v: 25, cont: true, text: 'Powiedzieli wówczas do niego: «Czy i ty nie jesteś jednym z Jego uczniów?»' },
    { v: 25, cont: true, text: 'On zaprzeczył mówiąc: «Nie jestem».' },
    { v: 26 },
    { v: 27, text: 'Piotr znowu zaprzeczył' },
    { v: 27, cont: true, text: 'i natychmiast kogut zapiał.' },
  ],
  cam: { x: [-560, -100], y: [-60, 140], z: [1, 1.5] },
  build(S) {
    const c = S.c;
    const R = courtyard(S);
    const hallL = S.layer({ par: CY.P, sh: 5 });
    const an = S.puppet(hallL.add(annas(c, { pose: 'sit' })));
    const pr = S.puppet(hallL.add(priest(c, 1)));
    R.front();
    const Y = R.yard();
    const rL = S.layer({ par: CY.P, sh: 4 });
    const roEl = rL.add(`<g>${rooster(c)}</g>`);
    const roHead = roEl.querySelector('.rhead'), beakL = roEl.querySelector('.beakL');
    const cry = voiceRings(rL, c, { n: 3, color: C.cream, r: 26, w: 4, both: false });
    const yardL = S.layer({ par: CY.P, sh: 5 });
    const F = fireCircle(S, yardL, { peterAt: -64 });
    const kinEl = yardL.add(withFace(person(c, KINSMAN), faceBits(c)));
    const kin = S.puppet(kinEl);
    fade(kinEl.querySelector('[data-part="angry"]'), 0.6);
    const pe = F.peter;

    const fx = S.layer({ par: CY.P, sh: 4 });
    const ask = fx.add(`<g>${say(c, [tr('Czy i ty nie jesteś', 'You aren’t also one'), tr('jednym z Jego uczniów?', 'of His disciples, are you?')], { size: 16, side: -1 })}</g>`);
    const tags = [0, 1, 2].map((i) => hanging(fx, noTag(c, tr('Nie jestem', 'I am not'), { size: 18 }), { x: 0, y: 0, len: 700 }));
    const kinTag = hanging(fx, nameTag(c, [tr('krewny Malchosa', 'a kinsman of Malchus')], { size: 14 }), { x: 0, y: 0, len: 700 });
    const clip = S.id('gd');
    const garden = `<defs><clipPath id="${clip}"><ellipse cx="0" cy="0" rx="46" ry="30"/></clipPath></defs><g clip-path="url(#${clip})"><rect x="-50" y="-34" width="100" height="68" fill="${nt(C.parchment, 0.4)}"/><g transform="translate(-6 30) scale(.34)">${olive(c, 0, 0, 1, { trunk: nt(C.wood2, 0.3), leaf: nt(C.olive, 0.3), leaf2: nt(C.sage, 0.3) })}</g><circle cx="28" cy="-6" r="10" fill="url(#warm-glow)"/><path d="M28 -2C24 -5 25 -11 28 -16C31 -11 32 -5 28 -2Z" fill="${C.lampFlame}"/></g>`;
    const saw = fx.add(`<g>${speech(c, garden, { w: 104, h: 70, flip: false })}</g>`);
    const sawTxt = fx.add(`<g>${say(c, tr('Czyż nie ciebie widziałem w ogrodzie?', 'Didn’t I see you in the garden?'), { size: 16, side: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      const dawn = es(t, 5.05, 5.9);
      const ember = es(t, 5.1, 5.9) * 0.7;
      courtIdle(R, Y, T, ember);
      R.sky.blend(DEEP, PREDAWN, dawn);
      R.stars.fade(1 - dawn * 0.7);
      R.dawn.fade(dawn * 0.8);
      an.set({ x: ANX, y: HALL, s: 0.92, flip: true, armF: 30, armB: 20, head: 8, blink: blinkAt(T, 5) });
      pr.set({ x: ANX - 70, y: HALL - 16, s: 0.83, flip: true, armF: 14, armB: 6, head: 4, blink: blinkAt(T, 9) });

      /* the men at the fire turn to Peter */
      const turn = es(t, 1.05, 1.3) * (1 - es(t, 4.9, 5.3));
      F.set(T, { warm: 1 - turn * 0.6, turn: 0 });
      F.ring.forEach((d) => { if (d.i === 1 || d.i === 2) d.p.set({ x: d.x, y: YARD + d.y, s: d.s ?? 0.94, flip: true, armF: 20 + (d.i === 1 ? bump(t, 1.1, 1.9) * 50 : 0) + (1 - turn) * 54, armB: 6 + (1 - turn) * 34, head: -turn * 4, blink: blinkAt(T, d.seed) }); });

      /* Peter */
      const d1 = es(t, 2.05, 2.25) * (1 - es(t, 2.9, 3.05));
      const d2 = es(t, 4.05, 4.25) * (1 - es(t, 4.9, 5.05));
      const back = es(t, 4.05, 4.5);
      const bow = es(t, 5.3, 5.8);
      const px = pe.x - back * 60;
      pe.p.set({ x: px, y: YARD + 12, s: 0.92, flip: back > 0.5 && bow < 0.5 ? true : false, armF: 74 * (1 - back) + d1 * 30 + d2 * 60 + 20 * back, armB: 48 * (1 - back) + d2 * 80 + bow * 20, head: 6 - d1 * 8 * (T ? Math.sin(T * 8) : 1) - d2 * 8 + bow * 26, lean: 4 * (1 - back) + bow * 8, blink: blinkAt(T, 3) });
      fade(pe.sad, es(t, 2.3, 2.6) * 0.6 + bow * 0.4);
      fade(pe.angry, d2 * 0.7);

      /* the kinsman of Malchus */
      const kk = es(t, 3.0, 3.4, ease.sine);
      const kx = lerp(KX + 260, KX - 40, kk) - back * 30;
      kin.set({ x: kx, y: YARD + 4, s: 0.96, flip: true, o: es(t, 2.95, 3.05), walk: kk > 0 && kk < 1 ? kx * 0.05 : undefined, armF: 20 + bump(t, 3.3, 4.0) * 60, armB: 8, head: -bump(t, 3.3, 4.0) * 5, blink: blinkAt(T, 11) });

      /* words */
      const [rhx, rhy] = headAt(F.ring[1].x, YARD + F.ring[1].y, 0.94, true);
      const ak = es(t, 1.12, 1.32, ease.back) * (1 - es(t, 1.9, 2.0));
      vis(ask, { x: rhx - 14, y: rhy - 18, s: ak, o: ak > 0.01 ? 1 : 0 });
      const tagIn = [es(t, 0.05, 0.35, ease.out), es(t, 2.1, 2.4, ease.out), es(t, 4.1, 4.4, ease.out)];
      const tagOut = 1 - es(t, 5.4, 5.8, ease.in);
      tags.forEach((el, i) => {
        const k = tagIn[i] * tagOut;
        vis(el, { x: pe.x - 150 + i * 116, y: 420 - i * 8 - (1 - k) * 700, r: T ? Math.sin(T * 1.1 + i) * 2 : 0, o: k > 0.01 ? (i === 0 ? 0.75 : 1) : 0 });
      });
      const kt = es(t, 3.1, 3.35, ease.out) * (1 - es(t, 3.9, 4.05, ease.in));
      vis(kinTag, { x: KX - 40, y: 360 - (1 - kt) * 700, r: T ? Math.sin(T * 0.9) * 1.4 : 0, o: kt > 0.01 ? 1 : 0 });
      const [khx, khy] = headAt(kx, YARD + 4, 0.96, true);
      const sk = es(t, 3.35, 3.55, ease.back) * (1 - es(t, 3.95, 4.05));
      vis(saw, { x: khx - 10, y: khy - 16, s: sk, o: sk > 0.01 ? 1 : 0 });
      vis(sawTxt, { x: khx + 6, y: khy - 100, s: sk, o: sk > 0.01 ? 1 : 0 });

      /* the rooster */
      const crow = bump(t, 5.08, 6.1);
      vis(roEl, { x: ROO.x, y: ROO.y, s: 0.9, o: 1 });
      pose(roHead, { x: 16, y: -58, r: -crow * 28, ox: 16, oy: -58 });
      pose(beakL, { x: 33, y: -79, r: crow * 22, ox: 33, oy: -79 });
      cry(ROO.x + 36, ROO.y - 76, crow, T, { spread: 2.8 });

      S.cam.x = kf(t, [[0, -380], [1, -360], [3, -300], [4, -340], [5, -380], [5.3, -460], [6, -460]]);
      S.cam.y = kf(t, [[0, 110], [1, 100], [2, 100], [4, 100], [5, 90], [5.3, 30], [6, 20]]);
      S.cam.z = kf(t, [[0, 1.42], [1, 1.3], [2, 1.36], [3, 1.26], [4, 1.34], [5, 1.3], [5.3, 1.2], [6, 1.16]]);
    };
  },
};
