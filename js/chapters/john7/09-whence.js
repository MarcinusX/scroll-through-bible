// J 7,25–29 — Jesus teaches from the steps of the Temple. Some people of Jerusalem whisper: "Isn't this the one
// they want to kill?" (a small shadow-plate of the plotting leaders). "He speaks openly, and they say nothing" —
// the leaders stand with empty speech bubbles. "Have the rulers really come to know that He is the Christ?" — a
// crown and an anointing horn hang with a question mark. "We know where He is from" — a plate of Nazareth, the
// carpenter's bench; "but when the Christ comes no one will know" — a plate of clouds with a hidden light.
// Jesus cries out: "You know me and where I am from" — the Nazareth plate again; "yet I have not come of myself:
// the One who sent me is true, whom you do not know" — light falls from above, and a veil hangs between the
// leaders and it. "I know Him, for I am from Him": a golden thread of light joins Jesus to the light above.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { house, cloud, cypress } from '../../assets/nature.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { oilHorn } from '../mark8/lib.js';
import { talkDots } from '../mark16/lib.js';
import {
  feastCourt, PH, townMan, townWoman, headAt, hand, voiceRings, say, strip, roundel, crown, bigQuestion, workbench, shadowPerson, pharisee,
  beamGrad, lightBeam, glory, hangAt, vpose, GREAT, tr, PI,
} from './lib.js';

const JX = 800, JY = 626;
const TX = [420, 500, 580];            // people of Jerusalem
const LX = [1010, 1094, 1176];         // the leaders

export default {
  id: 'j7-whence',
  beats: [
    { v: 25 },
    { v: 26, text: 'A oto jawnie przemawia i nic Mu nie mówią.' },
    { v: 26, cont: true, text: 'Czyżby zwierzchnicy naprawdę się przekonali, że On jest Mesjaszem?' },
    { v: 27, text: 'Przecież my wiemy, skąd On pochodzi,' },
    { v: 27, cont: true, text: 'natomiast gdy Mesjasz przyjdzie, nikt nie będzie wiedział, skąd jest».' },
    { v: 28, text: 'A Jezus, ucząc w świątyni, zawołał tymi słowami: «I Mnie znacie, i wiecie, skąd jestem.' },
    { v: 28, cont: true, text: 'Ja jednak nie przyszedłem sam od siebie; lecz prawdziwy jest Ten, który Mnie posłał, którego wy nie znacie.' },
    { v: 29 },
  ],
  cam: { x: [-40, 40], y: [-80, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = feastCourt(S, { skyCols: GREAT });
    const F = set.F + 24;

    /* light from above */
    const LL = S.layer({ par: 0.45, sh: 0, flat: true });
    const bid = beamGrad(S, 'sender', '#fff3cf');
    const beam = LL.add(`<g>${lightBeam(bid, 70, 260, 560)}</g>`);
    const glo = LL.add(`<g>${glory(c, 280, 20)}</g>`);
    const thread = LL.add(`<g><path d="M-2 0H2V560H-2Z" fill="${C.sun}"/><path d="M-6 0H6V560H-6Z" fill="#fff3cf" opacity=".5"/></g>`);

    /* people */
    const P = S.layer({ par: 0.5, sh: 5 });
    const towns = TX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, i === 1 ? townWoman(c, { robe: C.roseRobe, belt: C.sun }) : { ...townMan(c), robe: [C.indigo, C.mauve][i ? 1 : 0], mantle: C.ochre, belt: C.sun }))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 34, w: 5 });
    const leaders = LX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, PH(c, i + 1)))) }));
    const silent = LX.map(() => P.add(`<g>${say(c, ' ', { size: 18, side: -1, w: 56 })}<g transform="translate(-22 -36)">${talkDots(c, C.stone2)}</g></g>`));
    set.front();

    /* plates */
    const X = S.layer({ par: 0.5, sh: 6 });
    const whisper = X.add(`<g>${say(c, tr(['Czyż to nie Ten,', 'którego chcą zabić?'], ['Isn’t this he', 'whom they seek to kill?']), { size: 18, side: 1 })}</g>`);
    const plotIn = `<rect x="-100" y="-100" width="200" height="200" fill="${mix(C.dusk, C.storm, 0.55)}"/>` + [[-44, false], [4, false], [52, true]].map(([x, f], i) => `<g transform="translate(${x} 92) scale(.44) scale(${f ? -1 : 1} 1)">${shadowPerson(c, pharisee(c, i), '#1f1a2c').replace('class="armFr"', `class="armFr" transform="rotate(${i === 1 ? -80 : -40})"`)}</g>`).join('');
    const plot = hanging(X, roundel(c, plotIn, { r: 70, face: C.storm, rim: mix(C.storm2, C.wood2, 0.4), id: S.id('plot') }), { x: 560, y: 250, len: 600 });
    const messiah = hanging(X, `${roundel(c, `<rect x="-80" y="-80" width="160" height="160" fill="${mix(C.parchment, C.halo, 0.4)}"/><circle r="60" fill="url(#halo-glow)"/><g transform="translate(0 70) scale(2.2)">${crown(c)}</g><g transform="translate(-34 -6) scale(1.1)">${oilHorn(c)}</g>`, { r: 64, face: C.parchment, id: S.id('mess') })}<g transform="translate(62 -52)">${bigQuestion(c, 26, C.terracotta)}</g><g transform="translate(0 84)">${strip(c, tr('Mesjasz?', 'the Christ?'), { size: 18 })}</g>`, { x: 1080, y: 250, len: 600 });
    // Nazareth: a little house and the carpenter's bench
    const nazIn = (() => {
      const s = sheet();
      s.p(c.cut(c.rect(-110, -110, 220, 220), 0, 20), '#dfe9dc');
      s.p(c.ridge(c.wave(10, [10, 4], [140, 50]), -110, 110, 110, 8, 1), mix(C.hillMid, C.sage3, 0.4));
      s.p(c.cut(c.rect(-110, 50, 220, 60), 0.4, 10), mix(C.sand, C.sand2, 0.5));
      return s.out() + house(c, -70, 50, 80, 58, { stairs: false }) + cypress(c, 40, 50, 70) + `<g transform="translate(40 88) scale(.4)">${workbench(c, 200)}</g>`;
    })();
    const naz = hanging(X, roundel(c, nazIn, { r: 86, face: C.parchment, id: S.id('naz') }) + `<g transform="translate(0 104)">${strip(c, tr('Nazaret — wiemy, skąd jest', 'Nazareth — we know where he is from'), { size: 15 })}</g>`, { x: 520, y: 240, len: 600 });
    // no one will know: clouds hiding a light
    const mystIn = `<rect x="-110" y="-110" width="220" height="220" fill="${mix(C.skyBlue2, C.lavender, 0.4)}"/><circle r="70" fill="url(#halo-glow)"/>` +
      `<g transform="translate(-40 10)">${cloud(c, 150)}</g><g transform="translate(46 30)">${cloud(c, 130)}</g><g transform="translate(-6 58)">${cloud(c, 170)}</g><g transform="translate(0 -44)">${bigQuestion(c, 30, C.cream)}</g>`;
    const myst = hanging(X, roundel(c, mystIn, { r: 86, face: C.skyBlue2, id: S.id('myst') }) + `<g transform="translate(0 104)">${strip(c, tr('nikt nie będzie wiedział skąd', 'no one will know where from'), { size: 15 })}</g>`, { x: 1080, y: 240, len: 600 });
    // the veil between the leaders and the light
    const veil = X.add(`<g><path d="M-50 -1400V0M50 -1400V0" stroke="rgba(74,54,34,.5)" stroke-width="1.2" fill="none"/>${sheet().p(c.cut([[-66, 0], [66, 0], [64, 330], [30, 322], [0, 334], [-32, 322], [-64, 332]], 0.8, 8), mix(C.storm, C.stone2, 0.35)).x(c.ribbon([[-30, 6], [-34, 320]], 2) + c.ribbon([[0, 6], [3, 328]], 2) + c.ribbon([[30, 6], [27, 318]], 2), shade(C.storm, -0.2), 'opacity=".5"').out()}</g>`);
    const unknownT = X.add(`<g>${strip(c, tr('którego wy nie znacie', 'whom you don’t know'), { size: 16 })}</g>`);
    const knowT = X.add(`<g>${strip(c, tr('Ja Go znam — od Niego jestem', 'I know him — I am from him'), { size: 17 })}</g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T, { lit: 0.25 });

      /* Jesus teaching on the steps; cries out (v28) */
      const cry = bump(t, 5.05, 5.95);
      const upk = es(t, 7.05, 7.35);
      jesus.set({ x: JX, y: JY, s: 1.04, armF: 30 + bump(t, 1.1, 1.9) * 30 + cry * 60 + bump(t, 6.1, 6.9) * 30 + upk * 70, armB: 20 + cry * 60 + bump(t, 6.2, 6.9) * 40, head: -upk * 12 + bump(t, 6.3, 6.9) * -6, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(JX, JY, 1.04, false);
      voice(hx, hy + 4, 0.4 + bump(t, 1.05, 1.95) * 0.4 + cry * 0.8, T, { spread: 1.8 + cry * 1.2 });

      /* v25 — the people of Jerusalem */
      towns.forEach((m) => m.p.set({ x: m.x, y: F + (m.i % 2) * 8, s: 0.95, flip: m.i === 2 && t < 1, armF: 18 + bump(t, 0.1, 0.9) * (m.i === 0 ? 70 : 20) + bump(t, 3.1, 3.9) * (m.i === 1 ? 50 : 0), armB: 10 + bump(t, 2.1, 2.9) * 40 * (m.i === 2 ? 1 : 0), head: bump(t, 0.1, 0.9) * (m.i === 2 ? 8 : -4) + bump(t, 2.1, 2.9) * 6, lean: bump(t, 0.1, 0.9) * 4, blink: blinkAt(T, m.seed) }));
      const [tx, ty] = headAt(TX[1], F + 8, 0.95, false);
      vpose(whisper, { x: tx + 20, y: ty - 18, s: es(t, 0.1, 0.3, ease.back) * 0.95, o: seg(t, 0.1, 0.15) * (1 - es(t, 0.9, 1.0)) });
      const pk = es(t, 0.3, 0.6, ease.out), pu = es(t, 0.95, 1.1, ease.in);
      hangAt(plot, 560, lerp(-300, 330, pk) - pu * 700, T, pk > 0 && pu < 1 ? 1 : 0, 1.2, 0.9, 1);

      /* v26 — the leaders say nothing; the crown with a question */
      leaders.forEach((m, i) => {
        m.p.set({ x: m.x, y: F + (m.i % 2) * 6, s: 0.98, flip: true, armF: 20, armB: 10, head: 6 + bump(t, 1.1, 1.9) * 6 - bump(t, 2.1, 2.9) * 10, blink: blinkAt(T, m.seed) });
        const [lhx, lhy] = headAt(m.x, F + (m.i % 2) * 6, 0.98, true);
        vpose(silent[i], { x: lhx - 24, y: lhy - 16, s: es(t, 1.2 + i * 0.06, 1.4 + i * 0.06, ease.back) * 0.8, o: seg(t, 1.2 + i * 0.06, 1.25 + i * 0.06) * (1 - es(t, 1.95, 2.05)) });
      });
      const mk = es(t, 2.1, 2.4, ease.out), mu = es(t, 2.95, 3.1, ease.in);
      hangAt(messiah, 1090, lerp(-300, 330, mk) - mu * 700, T, mk > 0 && mu < 1 ? 1 : 0, 1.2, 0.9, 2);

      /* v27 — Nazareth; and the clouds */
      const nk = es(t, 3.05, 3.35, ease.out) * (1 - es(t, 4.9, 5.05, ease.in)) + es(t, 5.3, 5.6, ease.out) * (1 - es(t, 5.95, 6.1, ease.in));
      hangAt(naz, 520, lerp(-300, 320, nk), T, nk > 0.001 ? 1 : 0, 1.2, 0.9, 3);
      const yk = es(t, 4.05, 4.35, ease.out), yu = es(t, 4.9, 5.05, ease.in);
      hangAt(myst, 1080, lerp(-300, 320, yk) - yu * 700, T, yk > 0 && yu < 1 ? 1 : 0, 1.2, 0.9, 4);

      /* v28b — the light of the One who sent Him; a veil before the leaders */
      const bm = es(t, 6.1, 6.4);
      vpose(beam, { x: JX + 4, y: 60, sx: 0.5 + bm * 0.5, o: bm * 0.85 });
      vpose(glo, { x: JX, y: 80, s: 0.6 + bm * 0.5, r: T * 2, o: bm * 0.75 });
      const vk = es(t, 6.35, 6.65, ease.out);
      vpose(veil, { x: 930, y: lerp(-400, 300, vk), r: Math.sin(T * 0.7) * 0.6, o: vk > 0 ? 0.92 : 0 });
      vpose(unknownT, { x: 1094, y: 420, o: es(t, 6.55, 6.7) * (1 - es(t, 6.95, 7.05)) });

      /* v29 — I know Him: a golden thread joins Him to the light */
      const th = es(t, 7.1, 7.45);
      vpose(thread, { x: JX + 2, y: 80, sy: th * ((hy - 100) / 560), o: th > 0 ? 1 : 0 });
      vpose(knowT, { x: JX, y: 250, o: es(t, 7.35, 7.5) });

      S.cam.y = 20 - es(t, 5.9, 6.4) * 50;
      S.cam.z = 1.12 - es(t, 5.9, 6.4) * 0.05;
    };
  },
};
