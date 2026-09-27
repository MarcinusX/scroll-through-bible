// J 14,12–14 — the upper room. "Whoever believes in Me will do the works that I do": He lifts a small clay lamp and
// its flame passes from hand to hand along the table until every disciple holds a light. "And greater works than
// these, because I go to the Father": a map of the whole world comes down over the wall and little lights kindle
// on it one after another, far beyond Jerusalem, while a beam of light rises from Him towards the Father. "Whatever
// you ask in My name, I will do": small paper lanterns rise from their hands and come to Him; "that the Father may
// be glorified in the Son": glory opens round Him. "If you ask Me anything in My name, I will do it": close on John
// — his one lantern rises, He takes it in His hands and gives it back blossomed into a star.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  nightRoom, seatEleven, sitAt, emptySeat, afterTable, EMPTY_X, seatX, handLamp, worldMap, MAP_SPOTS, prayerLantern, glory,
  lightCrown, glowDisc, sparkle, hanging, swing, kf, vis, hand, headAt, PI,
} from './lib.js';

const MX = 800, MY = 330;

export default {
  id: 'j14-greater',
  beats: [
    { v: 12, text: 'Zaprawdę, zaprawdę, powiadam wam: Kto we Mnie wierzy, będzie także dokonywał tych dzieł, których Ja dokonuję,' },
    { v: 12, cont: true, text: 'owszem, i większe od tych uczyni, bo Ja idę do Ojca.' },
    { v: 13, text: 'A o cokolwiek prosić będziecie w imię moje, to uczynię,' },
    { v: 13, cont: true, text: 'aby Ojciec był otoczony chwałą w Synu.' },
    { v: 14 },
  ],
  cam: { x: [-120, 40], y: [-60, 200], z: [1, 1.8] },
  build(S) {
    const c = S.c;
    const R = nightRoom(S);
    const { SEAT, TOP, FLOOR } = R;
    // the world map on the wall, its lights
    const mapL = S.layer({ par: 0.32, sh: 4 });
    const map = hanging(mapL, worldMap(c, 460, 250), { x: MX, y: MY, len: 800 });
    const dots = MAP_SPOTS.map(([x, y], i) => ({ i, x: MX + x, y: MY + y, d: Math.hypot(x, y), el: mapL.add(`<g><circle r="22" fill="url(#warm-glow)"/><path d="${c.poly(c.star(0, 0, 7, 2.6, 4, 0))}" fill="${C.halo}"/><path d="${c.poly(c.circ(0, 0, 2.6, 8))}" fill="#fff"/></g>`) }));
    // glory and the beam upward
    const glL = S.layer({ par: 0.5, sh: 0, flat: true });
    const gid = S.id('up');
    S.defs(`<linearGradient id="${gid}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff6dc" stop-opacity=".7"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></linearGradient>`);
    const beam = glL.add(`<g><path d="${c.poly([[-30, 0], [30, 0], [70, -600], [-70, -600]])}" fill="url(#${gid})"/></g>`);
    const gloryEl = glL.add(`<g opacity=".55">${glory(c, 300, 24)}</g>`);

    const seatL = S.layer({ par: 0.52, sh: 5 });
    const at = seatEleven(S, seatL);
    seatL.add(`<g transform="translate(${EMPTY_X} ${TOP + 16})">${emptySeat(c)}</g>`);
    const J = at.find((m) => m.k === 'jesus'), JN = at.find((m) => m.k === 'john');
    const tabL = S.layer({ par: 0.55, sh: 6 });
    tabL.add(`<g transform="translate(800 ${FLOOR - 4})">${afterTable(c, 860)}</g>`);
    // lamps in their hands, lanterns, the crown of light
    const fx = S.layer({ par: 0.56, sh: 4 });
    const others = at.filter((m) => m.k !== 'jesus');
    const lampOf = (m) => fx.add(`<g>${handLamp(c, { glowR: 60 })}</g>`);
    const lamps = at.map((m) => ({ m, el: lampOf(m), d: Math.abs(m.x - 800) }));
    lamps.forEach((l) => { l.fl = l.el.querySelector('.flame'); l.gl = l.el.querySelector('.glow'); });
    const lanterns = others.map((m) => ({ m, el: fx.add(`<g>${prayerLantern(c, 11)}</g>`), d: Math.abs(m.x - 800) }));
    const crown = fx.add(`<g>${lightCrown(c, 34)}</g>`);
    const star = fx.add(`<g><circle r="40" fill="url(#halo-glow)"/>${sparkle(c, 16)}</g>`);

    return (t, time) => {
      const T = time;
      R.update(T, 1);
      /* v12a — the flame passes from hand to hand */
      lamps.forEach((l) => {
        const m = l.m, isJ = m.k === 'jesus';
        const hold = es(t, 0.05, 0.25);
        const lit = isJ ? es(t, 0.15, 0.3) : es(t, 0.3 + l.d * 0.0011, 0.38 + l.d * 0.0011);
        const lift = isJ ? 70 : 40 + lit * 18;
        const [hx, hy] = hand(m.x, SEAT + (m.i % 2) * 3, m.s, m.flip, lift, 0, 62);
        l.lift = lift;
        pose(l.el, { x: hx + (m.flip ? 6 : -6), y: hy + 4, s: 0.62, sx: m.flip ? -1 : 1, o: hold * (1 - es(t, 2.05, 2.2)) });
        pose(l.fl, { x: 27, y: -12, s: lit * (1 + (T ? Math.sin(T * 8 + m.i) * 0.06 : 0)) });
        fade(l.gl, lit * 0.9);
      });
      /* v12b — the map of the world; lights spread; the beam up */
      const mk = es(t, 1.02, 1.3, ease.out) * (1 - es(t, 2.0, 2.3, ease.in));
      swing(map, MX, MY - (1 - mk) * 800, mk > 0.001 ? T : 0, 0.6, 0.6);
      fade(map, mk > 0.001 ? 1 : 0);
      dots.forEach((d) => { const k = es(t, 1.3 + d.d * 0.0028, 1.4 + d.d * 0.0028, ease.back) * mk; vis(d.el, { x: d.x, y: d.y - (1 - mk) * 800, s: k, o: k > 0.01 ? 1 : 0 }); });
      const up = es(t, 1.45, 1.8) * (1 - es(t, 2.05, 2.3)) + es(t, 3.05, 3.3) * 0.6 * (1 - es(t, 3.95, 4.2));
      vis(beam, { x: 800, y: 590, sx: 0.6 + up * 0.6, o: up });
      /* v13a — lanterns rise to Him; v13b glory */
      const heart = [800, 592];
      lanterns.forEach((ln, n) => {
        const m = ln.m;
        const [hx, hy] = hand(m.x, SEAT + (m.i % 2) * 3, m.s, m.flip, 58, 0, 62);
        const k = es(t, 2.1 + ln.d * 0.0008, 2.6 + ln.d * 0.0008, ease.inOut);
        const x = lerp(hx, heart[0] + (m.x < 800 ? -30 : 30), k), y = lerp(hy - 20, heart[1] - 60 - (n % 3) * 20, k) - Math.sin(k * PI) * 90;
        const o = es(t, 2.05, 2.15) * (1 - es(t, 3.0, 3.2));
        vis(ln.el, { x, y, s: 1 + es(t, 2.6, 2.9) * 0.2 * (T ? 1 + Math.sin(T * 3 + n) * 0.1 : 1), r: T ? Math.sin(T * 1.5 + n) * 5 : 0, o });
      });
      const gk = es(t, 3.05, 3.4);
      vis(gloryEl, { x: 800, y: 580, s: 0.4 + gk * 0.6 + (T ? Math.sin(T * 0.5) * 0.01 : 0), r: t * 4, o: gk * 0.6 * (1 - es(t, 3.95, 4.2)) });
      const [jhx, jhy] = headAt(800, SEAT, J.s, false, 62);
      vis(crown, { x: jhx, y: jhy - 44, s: gk, o: gk > 0.01 ? 1 - es(t, 4.0, 4.3) : 0 });
      /* v14 — John's lantern: asked, taken, given back as a star */
      const [johnHx, johnHy] = hand(JN.x, SEAT, JN.s, false, 40, 0, 62);
      const a1 = es(t, 4.08, 4.3, ease.inOut), a2 = es(t, 4.35, 4.6, ease.inOut);
      const sx = lerp(lerp(johnHx, 812, a1), johnHx - 6, a2), sy = lerp(lerp(johnHy - 16, 500, a1), johnHy - 26, a2) - Math.sin(a1 * PI) * 30 - Math.sin(a2 * PI) * 40;
      vis(star, { x: sx, y: sy, s: 0.4 + a2 * 0.8, r: T ? T * 20 : 0, o: es(t, 4.05, 4.1) * es(t, 4.3, 4.35) });
      const lant14 = es(t, 4.05, 4.1) * (1 - es(t, 4.3, 4.36));
      if (lant14 > 0) vis(lanterns.find((l) => l.m.k === 'john').el, { x: sx, y: sy, s: 1.1, o: lant14 });

      at.forEach((m) => {
        const L = lamps.find((l) => l.m === m);
        if (m.k === 'jesus') {
          sitAt(m, SEAT, T, { armF: L.lift * es(t, 0.05, 0.2) + (1 - es(t, 0.05, 0.2)) * 36, armB: 14 + up * 120 + gk * 40 * (1 - es(t, 4, 4.2)) + bump(t, 4.2, 4.55) * 120, head: -up * 10 });
          return;
        }
        const pray = es(t, 2.05, 2.25) * (1 - es(t, 3.0, 3.3));
        const look = es(t, 1.2, 1.4) * (1 - es(t, 2.0, 2.2));
        const isJohn = m.k === 'john';
        sitAt(m, SEAT, T, { armF: isJohn && t > 4 ? 40 + bump(t, 4.02, 4.35) * 60 : L.lift, armB: 14 + pray * 100 + (isJohn ? bump(t, 4.02, 4.35) * 90 : 0), head: -look * 10 - pray * 8 - gk * 4 * (1 - es(t, 4, 4.2)) });
      });

      S.cam.x = kf(t, [[0, 0], [1, 0], [1.5, 0], [3, 0], [3.9, 0], [4.2, -70], [5, -70]]);
      S.cam.y = kf(t, [[0, 80], [0.9, 60], [1.2, -40], [1.9, -40], [2.3, 20], [3, 0], [3.9, 0], [4.2, 170], [5, 170]]);
      S.cam.z = kf(t, [[0, 1.3], [0.9, 1.25], [1.2, 1.02], [1.9, 1.02], [2.3, 1.06], [3.9, 1.06], [4.2, 1.75], [5, 1.75]]);
    };
  },
};
