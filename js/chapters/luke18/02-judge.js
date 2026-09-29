// Łk 18,2–5 — the parable is let down as a painted set: a little hill town's square just inside its gate, and at the
// right the judge on his seat under its red awning. "A judge who did not fear God and did not respect man": a poor man
// kneels with his petition held up, and the judge turns his nose away from him and waves him off; two tags come down
// over the seat, the light of God and a little crowd of people, and each is crossed out. "A widow in that city kept
// coming to him: Defend me from my adversary!" — she comes in through the gate, past the comfortable man who has taken
// her little house, and cries out to the judge. "For a while he would not": night falls and day comes, again and
// again, the days hang up one after another, and every morning she is there, and he sits with his hands over his ears.
// "But afterward he said to himself, 'Though I neither fear God nor respect man'" — the two crossed tags again, in his
// thoughts — "'yet because this widow bothers me, I will defend her'": he signs and seals her verdict and holds it out,
// and the adversary sheepishly gives back her house; "'or else she will wear me out by her continual coming'": in his
// thoughts an endless line of widows stretches away to the horizon, and he holds his head, while she goes off home.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import {
  gateSet, GT, JUDGE, WIDOW, ADVERSARY, PETITIONER, godLight, peopleIcon, iconDisc, crossX, verdict, littleHouse, numDisc, words,
  onString, fig13, headAt, handAt, kf, moving, scrollRolled, es, ease, bump, seg, tr, PI,
} from './lib.js';

const GY = GT.GY, JX = GT.SEAT;
const lift0 = (t) => es(t, 5.12, 5.3);
const WX = 800;                 // where the widow stands before the judge
const AX = 596;                 // her adversary, near the gate

export default {
  id: 'lk18-judge',
  parable: true,
  enter: 'fly',
  beats: [
    { v: 2 },
    { v: 3 },
    { v: 4, text: 'Przez pewien czas nie chciał;' },
    { v: 4, cont: true, text: 'lecz potem rzekł do siebie: "Chociaż Boga się nie boję ani z ludźmi się nie liczę,' },
    { v: 5, text: 'to jednak, ponieważ naprzykrza mi się ta wdowa, wezmę ją w obronę,' },
    { v: 5, cont: true, text: 'żeby nie przychodziła bez końca i nie zadręczała mnie"».' },
  ],
  cam: { x: [-60, 60], y: [0, 40], z: [1, 1.12] },
  build(S) {
    const G = gateSet(S);
    const c = S.c;
    const P = G.P, FX = G.fx;

    /* people */
    const pet = S.puppet(P.add(person(c, { ...PETITIONER, pose: 'kneel', holdF: `<g transform="rotate(180) translate(0 -18)">${scrollRolled(c, 40)}</g>` })));
    const petUp = S.puppet(P.add(person(c, { ...PETITIONER })));
    const adv = S.puppet(P.add(person(c, ADVERSARY)));
    const widow = S.puppet(P.add(person(c, WIDOW)));
    const judge = S.puppet(P.add(person(c, { ...JUDGE, pose: 'sit' })));
    const house = P.add(`<g>${littleHouse(c, 46, 36)}</g>`);
    const scrollV = FX.add(`<g opacity="0">${verdict(c)}</g>`);

    /* the two crossed tags: God and men */
    const tagG = FX.add(`<g>${onString(`${iconDisc(c, `<g transform="scale(.75)">${godLight(c, 28)}</g>`, { r: 34 })}<g opacity=".9">${crossX(c, 24)}</g>`, 1600)}</g>`);
    const tagM = FX.add(`<g>${onString(`${iconDisc(c, `<g transform="translate(0 4) scale(.72)">${peopleIcon(c)}</g>`, { r: 34 })}<g opacity=".9">${crossX(c, 24)}</g>`, 1600)}</g>`);
    // the days she keeps coming
    const DAYS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const days = DAYS.map((d, i) => ({ i, el: FX.add(`<g>${onString(numDisc(c, d, { r: 20, size: 19 }), 1600)}</g>`) }));

    /* words and thoughts */
    const plea = FX.add(`<g opacity="0">${words(c, tr(['Obroń mnie przed', 'moim przeciwnikiem!'], ['Defend me from', 'my adversary!']), { size: 19, side: 1 })}</g>`);
    const again = [0, 1, 2].map(() => FX.add(`<g opacity="0">${words(c, tr('Obroń mnie!', 'Defend me!'), { size: 18, side: 1 })}</g>`));
    const bubble = (inner, w, h) => {
      const s = sheet();
      s.p(c.cut(c.blob(0, 0, w / 2, h / 2, 16, 0.12), 0.8, 6), C.cream);
      s.p(c.cut(c.circ(-w * 0.22, h / 2 + 16, 9, 12), 0.3, 3) + c.cut(c.circ(-w * 0.3, h / 2 + 36, 5.5, 10), 0.3, 3), C.cream);
      return s.out() + inner;
    };
    const think1 = FX.add(`<g opacity="0">${bubble(`<g transform="translate(-44 0)">${iconDisc(c, `<g transform="scale(.7)">${godLight(c, 28)}</g>`, { r: 30 })}${crossX(c, 20)}</g><g transform="translate(44 0)">${iconDisc(c, `<g transform="translate(0 4) scale(.66)">${peopleIcon(c)}</g>`, { r: 30 })}${crossX(c, 20)}</g>`, 210, 110)}</g>`);
    // an endless line of widows, far into the distance
    let line = '';
    for (let i = 9; i >= 0; i--) {
      const k = Math.pow(0.8, i);
      line += `<g transform="translate(${(-70 + (1 - k) * 140).toFixed(1)} ${(34 - (1 - k) * 40).toFixed(1)})">${fig13(c, WIDOW, { s: 0.3 * k, armF: 70, armB: 20 })}</g>`;
    }
    const road = sheet().p(c.cut([[-110, 44], [-40, 44], [80, -6], [74, -8]], 0.3, 4), mix(C.sand, C.stone, 0.4)).out();
    const think2 = FX.add(`<g opacity="0">${bubble(`<g transform="translate(0 0)">${road}${line}</g>`, 240, 124)}</g>`);

    return (t, time) => {
      const T = time;
      /* the days and nights of 4a */
      const night = Math.min(1, bump(t, 2.06, 2.34) * 1.4) + Math.min(1, bump(t, 2.4, 2.68) * 1.4);
      G.update(T, { night: Math.min(1, night) });

      /* v2 — the petitioner is waved away */
      const kn = t < 0.92 ? 1 : 0;
      const off = es(t, 0.92, 1.3);
      pet.set({ x: 870, y: GY + 6, s: 0.96, flip: false, armF: 110 + Math.sin(T * 2) * 3, armB: 40, head: -8, o: kn, blink: blinkAt(T, 2) });
      const px = lerp(840, 520, off);
      petUp.set({ x: px, y: GY + 6, s: 0.96, flip: true, walk: off > 0 && off < 1 ? px * 0.05 : undefined, head: 10, o: t >= 0.92 ? 1 - es(t, 1.2, 1.32) : 0, blink: blinkAt(T, 2) });

      /* the judge: turned away (v2–v4a), ears covered (v4a), thinking (v4b), sealing (v5a), head in hands (v5b) */
      const ears = es(t, 2.05, 2.2) * (1 - es(t, 2.9, 3.05));
      const chin = es(t, 3.05, 3.25) * (1 - es(t, 3.95, 4.05));
      const turn = t > 4.05;
      const give = es(t, 4.12, 4.3) * (1 - es(t, 4.5, 4.62));
      const holdHead = es(t, 5.05, 5.2);
      const wave = bump(t, 0.25, 0.85);
      judge.set({
        x: JX, y: GY - 40, s: 0.9, flip: turn,
        armF: 14 + wave * 60 + ears * 104 + chin * 100 + give * 80 + holdHead * 96,
        armB: 10 + wave * Math.max(0, Math.sin(t * 22)) * 40 + ears * 165 + holdHead * 168,
        head: (turn ? 4 : -14) * (1 - chin) * (1 - ears * 0.5) + chin * 14 + ears * 6 - holdHead * 4 + (holdHead ? Math.sin(t * 30) * 3 * bump(t, 5.2, 5.9) : 0),
        blink: blinkAt(T, 4),
      });
      const [jhx, jhy] = headAt(JX, GY - 40, 0.9, turn, 'sit');

      /* the tags over the seat: v2, again in his thoughts at v4b */
      const tk = es(t, 0.3, 0.55, ease.out) * (1 - es(t, 1.05, 1.3, ease.in));
      pose(tagG, { x: 860, y: lerp(-1500, 262, tk) + (T ? Math.sin(T * 0.8) * 2 : 0), r: T ? Math.sin(T * 0.7) * 1.4 : 0 });
      pose(tagM, { x: 1060, y: lerp(-1500, 280, es(t, 0.42, 0.67, ease.out) * (1 - es(t, 1.08, 1.33, ease.in))) + (T ? Math.sin(T * 0.8 + 1) * 2 : 0), r: T ? Math.sin(T * 0.7 + 2) * 1.4 : 0 });
      const t1 = es(t, 3.12, 3.3, ease.back) * (1 - es(t, 3.9, 4.02));
      pose(think1, { x: jhx + 30, y: jhy - 120, s: t1, o: t1 > 0.02 ? 1 : 0 });

      /* the widow: in through the gate, pleading every day, the verdict, home */
      const inK = es(t, 1.0, 1.42);
      const home = es(t, 5.3, 5.95);
      const gone = Math.min(1, night * 1.6);
      let wx = lerp(GT.GATE + 10, WX, inK);
      wx = lerp(wx, GT.GATE + 60, home);
      const walking = (inK > 0 && inK < 1) || (home > 0 && home < 1);
      const plead = t > 1.42 && t < 4.1 ? 1 : 0;
      const gotV = es(t, 4.45, 4.6);
      widow.set({
        x: wx, y: GY + 4, s: 0.94, flip: home > 0.02, walk: walking ? wx * 0.05 : undefined,
        armF: plead * (70 + bump(t, 1.45, 1.95) * 30 + Math.max(bump(t, 2.36, 2.44), bump(t, 2.7, 2.8)) * 30 + bump(t, 3.2, 3.6) * 20) + gotV * 110 * (1 - home) + home * 30,
        armB: 10 + bump(t, 1.55, 1.95) * 110 + plead * 30 + lift0(t) * 120,
        head: -plead * 8 - gotV * 10 * (1 - home),
        o: t > 1.0 ? 1 - gone : 0, blink: blinkAt(T, 1),
      });
      const [whx, why] = headAt(wx, GY + 4, 0.94, false);
      pose(plea, { x: whx + 20, y: why - 36, s: es(t, 1.45, 1.62, ease.back), o: t > 1.45 && t < 2.02 ? 1 - es(t, 1.95, 2.02) : 0 });
      [2.0, 2.36, 2.66].forEach((a, i) => {
        const k = i === 2 ? es(t, a, a + 0.08) * (1 - es(t, 3.0, 3.08)) : bump(t, a - 0.02, a + 0.1);
        pose(again[i], { x: whx + 18, y: why - 34, s: Math.min(1, k * 2) * 1.1, o: k > 0.02 && t > 2 ? 1 : 0 });
      });
      days.forEach((d) => {
        const at = [2.02, 2.36, 2.62, 3.2, 3.5, 3.8][d.i];
        const k = es(t, at, at + 0.14, ease.out) * (1 - es(t, 4.02, 4.2, ease.in));
        pose(d.el, { x: 620 + d.i * 66, y: lerp(-1500, 258 + (d.i % 2) * 22, k) + (T ? Math.sin(T * 0.9 + d.i) * 2 : 0), r: T ? Math.sin(T * 0.8 + d.i * 2) * 2 : 0 });
      });

      /* the adversary and her house */
      const back = es(t, 4.5, 4.75);
      const slink = es(t, 4.9, 5.3);
      const ax = lerp(lerp(AX, WX - 112, back), GT.GATE + 10, slink);
      adv.set({ x: ax, y: GY - 6, s: 0.94, flip: slink > 0.02, walk: (back > 0 && back < 1) || (slink > 0 && slink < 1) ? ax * 0.05 : undefined, armF: 30 + back * 50 * (1 - es(t, 4.75, 4.85)), armB: 10 + bump(t, 1.4, 2.0) * 30, head: 10 * bump(t, 1.4, 2.0) - back * 6, o: t > 0.9 ? es(t, 0.95, 1.1) * (1 - es(t, 5.2, 5.3)) : 0, blink: blinkAt(T, 3) });
      const [ahx, ahy] = handAt(ax, GY - 6, 0.94, false, 30 + back * 50 * (1 - es(t, 4.75, 4.85)));
      const toHer = es(t, 4.72, 4.86);
      const [bhx, bhy] = handAt(wx, GY + 4, 0.94, home > 0.02, gotV * 110 * (1 - home) + home * 30);
      const lift = es(t, 5.12, 5.3);
      let hx = lerp(ahx + 6, wx - 58, toHer), hy = lerp(ahy + 16, GY + 8, toHer);
      hx = lerp(hx, bhx, lift); hy = lerp(hy, bhy + 34, lift);
      pose(house, { x: hx, y: hy, s: 0.9, o: t > 0.9 ? es(t, 0.95, 1.1) : 0 });

      /* the verdict: signed and sealed, held out, taken */
      const [jfx, jfy] = handAt(JX, GY - 40, 0.9, true, 14 + give * 80, 'sit');
      const [wfx0, wfy0] = handAt(wx, GY + 4, 0.94, false, gotV * 110);
      const [wbx, wby] = handAt(wx + 15, GY + 4, 0.94, true, 10 + lift0(t) * 120);
      const wfx = lerp(wfx0, wbx, lift), wfy = lerp(wfy0, wby, lift);
      pose(scrollV, { x: lerp(jfx - 6, wfx, gotV), y: lerp(jfy - 20, wfy - 24, gotV), s: 0.9, r: lerp(-8, 6, gotV), o: es(t, 4.1, 4.2) });

      /* v5b — the endless line of widows, in his thoughts */
      const t2 = es(t, 5.05, 5.25, ease.back);
      pose(think2, { x: jhx + 10, y: jhy - 150, s: t2 * 1.3, o: t2 > 0.02 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 40], [0.9, 40], [1.4, 0], [4.0, 0], [4.4, 20], [5.2, 20], [6, 0]]);
      S.cam.y = 20;
      S.cam.z = kf(t, [[0, 1.08], [1.0, 1.02], [3.0, 1.02], [3.4, 1.06], [4.6, 1.06], [5.2, 1.02]]);
      void shade; void moving; void seg; void PI;
    };
  },
};
