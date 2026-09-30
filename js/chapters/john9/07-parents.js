// J 9,18–23 — Act three: the parents. The officials will not believe he was blind (a card: closed eye → open eye,
// crossed out), so one of them goes to the door and calls in the old couple, frightened, the mother holding her
// husband's arm. "Is this your son, who you say was born blind?" — a cradle-card: a baby with closed eyes. "How
// then does he now see?" — "We know he is our son, and that he was born blind" (the father's hand toward him, a
// heart). "How he now sees, we don't know; who opened his eyes, we don't know" — two question marks, eyes down.
// "Ask him; he is of age" — they step back, and he steps forward. They said so because they were afraid: tall
// shadows of the officials rise on the wall. For it had been agreed: whoever confessed Him as the Messiah would
// be put out of the synagogue — a picture comes down of a door with a dark bar across it and someone left outside.
import { C, person, CAST, blinkAt, lerp } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  hallSet, H, SEER, BLIND, FATHER, MOTHER, manPuppet, facePuppet, officials, offSet, OFFS, official, iconBubble, say, thought, storyTile, cradle, baby,
  eyeIcon, crossX, tick, qmark, heart, medallion, barredDoor, framed, shadowPerson, hanging, drop, kf, headAt, vis, tr, pose, mix, sheet, PI, DY, FONT, INK,
} from './lib.js';

const MX = H.MANX + 20;
const FX = 536, MOX = 612;      // where father and mother stand

export default {
  id: 'j9-parents',
  beats: [
    { v: 18 },
    { v: 19, text: 'i wypytywali się ich w słowach: «Czy waszym synem jest ten, o którym twierdzicie, że się niewidomym urodził?' },
    { v: 19, cont: true, text: 'W jaki to sposób teraz widzi?»' },
    { v: 20 },
    { v: 21, text: 'Nie wiemy, jak się to stało, że teraz widzi, nie wiemy także, kto mu otworzył oczy.' },
    { v: 21, cont: true, text: 'Zapytajcie jego samego, ma swoje lata, niech mówi za siebie».' },
    { v: 22, text: 'Tak powiedzieli jego rodzice, gdyż bali się Żydów.' },
    { v: 22, cont: true, text: 'Żydzi bowiem już postanowili, że gdy ktoś uzna Jezusa za Mesjasza, zostanie wyłączony z synagogi.' },
    { v: 23 },
  ],
  cam: { x: [-60, 200], y: [-80, 40], z: [1, 1.25] },
  build(S) {
    const c = S.c;
    const hall = hallSet(S);
    /* the officials' tall shadows on the wall (flat, faded on the compositor) */
    const shadowL = S.layer({ par: 0.3, sh: 0, flat: true });
    OFFS.forEach((o, i) => { if (i === 0 || i === 2 || i === 3) shadowL.add(`<g transform="translate(${o.x - 40} ${H.BASE + 10}) scale(-1.6 1.6)" opacity=".2">${shadowPerson(c, official(i), '#2a1f2a')}</g>`); });
    shadowL.fade(0);
    const offL = S.layer({ par: 0.46, sh: 5 });
    const offs = officials(S, offL);
    const act = S.layer({ par: 0.5, sh: 5 });
    const father = facePuppet(S, act, FATHER, {});
    const mother = facePuppet(S, act, MOTHER, {});
    const man = manPuppet(S, act, SEER, {});

    const fx = S.layer({ par: 0.52, sh: 5 });
    const X = crossX(c, 20);
    const doubt = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-30 0)">${eyeIcon(c, { r: 15, open: false })}</g><path d="M-10 0H8" stroke="${C.terracotta}" stroke-width="3"/><path d="M6 -5L12 0L6 5" fill="none" stroke="${C.terracotta}" stroke-width="3"/><g transform="translate(32 0)">${eyeIcon(c, { r: 15 })}</g><g transform="translate(0 0)">${X}</g>`, { w: 140, h: 74, side: -1 })}</g>`);
    const howNow = fx.add(`<g opacity="0">${iconBubble(c, `<g transform="translate(-16 0)">${eyeIcon(c, { r: 18 })}</g><g transform="translate(30 2)">${qmark(c, C.terracotta, 1.3)}</g>`, { w: 120, h: 76, side: -1 })}</g>`);
    const hrt = fx.add(`<g opacity="0">${heart(c, 14)}</g>`);
    const q1 = fx.add(`<g opacity="0">${thought(c, qmark(c, C.inkSoft, 1.2), { w: 56, h: 46 })}</g>`);
    const q2 = fx.add(`<g opacity="0">${thought(c, qmark(c, C.inkSoft, 1.2), { w: 56, h: 46 })}</g>`);
    const askHim = fx.add(`<g opacity="0">${say(c, tr(['Zapytajcie', 'jego samego!'], ['Ask him!', 'He is of age.']), { size: 18, side: 1 })}</g>`);
    const again = fx.add(`<g opacity="0">${say(c, tr(['Ma swoje lata,', 'jego samego zapytajcie!'], ['He is of age.', 'Ask him.']), { size: 18, side: 1 })}</g>`);

    const hangL = S.layer({ par: 0.3, sh: 5 });
    const born = hanging(hangL, storyTile(c, `<g transform="translate(0 30)">${cradle(c, 78)}</g><g transform="translate(4 -28)">${baby(c)}</g><g transform="translate(0 -40) scale(.5)"></g>`, { w: 130, label: tr('od urodzenia', 'from birth') }), { x: 0, y: 0, len: 900 });
    const bornTick = hangL.add(`<g opacity="0">${tick(c, 18)}</g>`);
    // the decision: a door with a dark bar, and someone who confessed Him left outside
    const decInner = (() => {
      const W = 330, Hh = 190;
      let m = `<rect x="0" y="${Hh - 40}" width="${W}" height="40" fill="${mix(C.stone2, C.sand2, 0.4)}"/>`;
      m += `<g transform="translate(120 ${Hh - 40})">${barredDoor(c, { w: 64, h: 100 })}</g>`;
      m += `<g transform="translate(240 ${Hh - 38}) scale(.42)">${person(c, { ...BLIND, eyes: 'open', mantle: C.stone2, robe: C.linen2 })}</g>`;
      m += `<g transform="translate(262 ${Hh - 128})">${iconBubble(c, `<g transform="scale(.8)"><circle r="22" fill="${C.halo}" opacity=".7"/>${medallion(c, CAST.jesus, { r: 18 })}</g>`, { w: 60, h: 52, side: 1 })}</g>`;
      m += `<text x="${W / 2}" y="26" text-anchor="middle" font-family="${FONT}" font-size="17" font-style="italic" fill="${INK}">${tr('wyłączony z synagogi', 'put out of the synagogue')}</text>`;
      return m;
    })();
    const decision = hanging(hangL, framed(S, decInner, { w: 330, h: 190, bg: mix(C.parchment, C.cream, 0.4), k: 'dec' }), { x: 0, y: 0, len: 900 });

    hall.front();
    const P = S.portrait;

    return (t, time) => {
      const T = time;
      /* v18 — unbelieving; one of them fetches the parents through the door */
      const open = es(t, 0.35, 0.55) * (1 - es(t, 1.05, 1.25));
      hall.door(open, 0);
      const inK = es(t, 0.45, 1.05, ease.out);
      const fear = es(t, 0.6, 1.0) * 0.5 + bump(t, 6.05, 6.95) * 0.5 + es(t, 7.1, 7.5) * 0.4;
      const shiver = (t > 6.05 && t < 6.95 ? Math.sin(T * 22) * 1.2 : 0);
      const stepBack = es(t, 5.2, 5.7) * 30 + es(t, 8.2, 8.6) * 20;
      const ours = bump(t, 3.05, 3.95), dunno = bump(t, 4.05, 4.95), ask = bump(t, 5.05, 5.95), rep = bump(t, 8.05, 8.95);
      const fx_ = lerp(H.DOORX + 40, FX, inK) - stepBack, fy = lerp(H.BASE - 2, H.FLOOR + 6, inK), fs = lerp(0.8, 0.96, inK);
      father.p.set({ x: fx_ + shiver, y: fy, s: fs, o: seg(t, 0.45, 0.52), walk: inK > 0.01 && inK < 0.99 ? fx_ * 0.06 : undefined, amt: 0.6, armF: 20 + ours * 60 + dunno * 40, armB: 10 + dunno * 50, head: 6 + dunno * 8 - ours * 4 + fear * 6, lean: 3 + fear * 3, blink: blinkAt(T, 1.3) });
      fade(father.sad, Math.max(fear, dunno));
      const mx_ = lerp(H.DOORX + 60, MOX, es(t, 0.55, 1.15, ease.out)) - stepBack, my = lerp(H.BASE - 2, H.FLOOR + 12, es(t, 0.55, 1.15, ease.out));
      mother.p.set({ x: mx_ - shiver, y: my, s: lerp(0.78, 0.92, es(t, 0.55, 1.15)), o: seg(t, 0.55, 0.62), walk: t > 0.55 && t < 1.15 ? mx_ * 0.06 : undefined, amt: 0.5, armF: 40 + ours * 30 + ask * 50 + rep * 50, armB: 20 + dunno * 40, head: 6 + fear * 8 - ask * 6, blink: blinkAt(T, 2.1) });
      fade(mother.sad, Math.max(fear, dunno) * 0.9);
      fade(mother.tear, bump(t, 6.2, 7.6) * 0.8);
      const forward = es(t, 5.3, 5.8) * 36;
      man.p.set({ x: MX + forward, y: H.FLOOR + 8, s: 1.02, flip: (t > 0.5 && t < 1.2) || (t > 3.0 && t < 3.9) || (t > 6.1 && t < 6.9), armF: 18 + ours * 20, armB: 10, head: -es(t, 5.3, 5.8) * 4, blink: blinkAt(T, 3) });
      fade(man.sad, bump(t, 6.1, 7.0) * 0.7);

      offs.forEach((o) => {
        const fetch = o.i === 4 ? bump(t, 0.2, 1.1) : 0;
        const point = o.i === 0 ? bump(t, 1.05, 1.95) : 0;
        const how = o.i === 2 ? bump(t, 2.05, 2.95) : 0;
        const shake = bump(t, 0.05, 0.6) * Math.sin(T * 7) * 5;
        const x = o.x - fetch * 180;
        offSet(o, T, { x, flip: true, walk: fetch > 0.05 && fetch < 0.95 ? x * 0.07 : undefined, armF: 18 + fetch * 60 + point * 80 + how * 50, armB: 8 + (o.i === 4 ? bump(t, 0.5, 0.95) * 120 : 0), head: shake + point * -6 + es(t, 7.1, 7.5) * -4, lean: point * 4, angry: Math.max(bump(t, 0.05, 0.9), es(t, 6.1, 6.6) * 0.8, point) });
      });

      /* bubbles */
      const B = (el, a, b, x, y) => { const k = es(t, a, a + 0.2, ease.back) * (1 - es(t, b - 0.08, b)); vis(el, { x, y, s: k, o: k > 0.01 ? 1 : 0 }); };
      const [o1x, o1y] = headAt(952, H.SEAT + 12, 0.98, true, DY.sit);
      const [o2x, o2y] = headAt(1052, H.SEAT + 12, 0.98, true, DY.sit);
      const [fhx, fhy] = headAt(FX, H.FLOOR + 6, 0.96, false);
      const [mhx, mhy] = headAt(MOX - stepBack, H.FLOOR + 12, 0.92, false);
      B(doubt, 0.08, 0.7, o1x - 12, o1y - 24);
      B(howNow, 2.12, 3.0, o2x - 12, o2y - 24);
      const hk = es(t, 3.2, 3.4, ease.back) * (1 - es(t, 3.9, 4.0));
      vis(hrt, { x: (FX + MX) / 2 + 10, y: H.FLOOR - 150, s: hk, o: hk > 0.01 ? 1 : 0 });
      B(q1, 4.12, 5.0, fhx - 4, fhy - 22);
      B(q2, 4.2, 5.0, mhx - 4, mhy - 20);
      B(askHim, 5.12, 6.0, mhx + 14, mhy - 26);
      B(again, 8.12, 9.0, mhx + 14, mhy - 26);

      /* v19 — the cradle card; v20 — ticked */
      const bk = es(t, 1.15, 1.5, ease.out) * (1 - es(t, 3.95, 4.25, ease.in));
      drop(born, 800, 200, bk, T, { amp: 1.1 });
      const tk = es(t, 3.3, 3.5, ease.back) * bk;
      vis(bornTick, { x: 850, y: 250 - (1 - bk) * 700, s: tk, o: tk > 0.01 ? 1 : 0 });

      /* v22 — fear: the officials' shadows rise on the wall; the decision */
      shadowL.fade(es(t, 6.1, 6.6) * (1 - es(t, 8.6, 9)));
      drop(decision, 800, 150, es(t, 7.12, 7.5, ease.out) * (1 - es(t, 8.05, 8.35, ease.in)), T, { amp: 0.9 });
      hall.door(open, 0);

      // phone: the camera keeps left and wider, so the parents stay in view when they shrink back
      S.cam.x = P ? kf(t, [[0, 120], [0.4, 40], [1.1, 20], [2, 20], [2.2, 60], [3, 20], [5, 20], [5.4, -30], [7, -30], [7.2, 0], [8, 0], [8.3, -60], [9, -60]])
        : kf(t, [[0, 120], [0.4, 40], [1.1, 20], [2, 20], [2.2, 60], [3, 20], [5, 20], [6, 60], [7, 60], [7.2, 40], [8, 40], [8.2, 20], [9, 20]]);
      S.cam.y = kf(t, [[0, 0], [1.1, -40], [2, -40], [2.2, 0], [7, 0], [7.2, -70], [8, -70], [8.2, 0], [9, 0]]);
      S.cam.z = kf(t, [[0, 1.08], [1.1, 1.02], [3, 1.1], [5, 1.14], [6, 1.06], [7.2, 1.0], [8.2, 1.12], [9, 1.12]]);
      if (P) S.cam.z = Math.min(S.cam.z, 1.04);
    };
  },
};
