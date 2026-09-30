// J 12,31–34 — dusk in the court. "Now is the judgment of this world": a paper globe comes down with a balance
// hung above it. "Now the ruler of this world will be cast out": a dark crowned shadow crouched on the globe is
// tipped off and tumbles away into the wings. "And I, when I am lifted up from the earth, will draw all people to
// Myself": far off, small and quiet, a hill with a cross in golden light — and fine threads of light run from it
// to every person in the court, who turn towards it. "He said this to show by what death He would die." The crowd
// answers from the Law — a scroll ringed with "for ever"; "How can the Son of Man be lifted up?"; and over Him a
// blank name-tag with a question mark: "Who is this Son of Man?"
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { courtStage, CT, DUSK, man, crowdPerson, leader, people, place, globe, shadowPerson, framed, skullHill, crossSil, threads, bubble, question, nameTag, scrollOpen, eternityRing, drawRing, glowDisc, headAt, hanging, swing, kf, vis, tr, PI, INK, FONT } from './lib.js';

export default {
  id: 'j12-lifted',
  beats: [
    { v: 31, text: 'Teraz odbywa się sąd nad tym światem.' },
    { v: 31, cont: true, text: 'Teraz władca tego świata zostanie precz wyrzucony.' },
    { v: 32 },
    { v: 33 },
    { v: 34, text: 'Na to tłum Mu odpowiedział: «Myśmy się dowiedzieli z Prawa, że Mesjasz ma trwać na wieki.' },
    { v: 34, cont: true, text: 'Jakżeż Ty możesz mówić, że potrzeba wywyższyć Syna Człowieczego?' },
    { v: 34, cont: true, text: 'Któż to jest ten Syn Człowieczy?»' },
  ],
  cam: { x: [-60, 80], y: [-100, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const st = courtStage(S, { skyCols: DUSK, sunAt: [1220, 330] });
    const F = CT.FLOOR;
    st.dim.fade(0.35);
    const L = [[430, 6, 0], [495, -8, 1], [560, 8, 0], [625, -4, 1]].map(([x, dy, w], i) => ({ x, y: F + dy, s: 0.96, look: w ? crowdPerson(c) : man(c) }));
    const R = [[985, -6], [1050, 6], [1115, -4], [1180, 8]].map(([x, dy], i) => ({ x, y: F + dy, s: 0.96, flip: true, look: i === 0 ? { ...leader(1), holdF: `<g transform="rotate(70)">${scrollOpen(c, 44, 30)}</g>` } : i % 2 ? man(c) : crowdPerson(c) }));
    const left = people(S, st.act, L, 'l');
    const right = people(S, st.act, R, 'r');
    const jesus = S.puppet(st.act.add(person(c, CAST.jesus)));
    const all = [...left, ...right];
    const fx = st.fx;
    /* the judgment: the globe and a balance */
    const bal = sheet();
    bal.p(c.ribbon([[0, -70], [0, -20]], 3), C.ochre).p(c.ribbon([[-60, -66], [60, -66]], 4), C.ochre);
    bal.x(c.ribbon([[-60, -66], [-74, -34]], 1) + c.ribbon([[-60, -66], [-46, -34]], 1) + c.ribbon([[60, -66], [46, -34]], 1) + c.ribbon([[60, -66], [74, -34]], 1), shade(C.ochre, -0.3));
    bal.p(c.cut([[-78, -34], [-42, -34], [-50, -26], [-70, -26]], 0.3, 4) + c.cut([[42, -34], [78, -34], [70, -26], [50, -26]], 0.3, 4), C.sun);
    const world = hanging(fx, `<circle r="130" fill="url(#halo-glow)" opacity=".6"/><g transform="translate(0 -84)">${bal.out()}</g>${globe(c, 64)}<g transform="translate(0 86)">${nameTag(c, tr('sąd nad światem', 'judgment of the world'), { size: 14 })}</g>`, { x: 800, y: 280, len: 700 });
    // the ruler of this world: a crowned shadow crouched on the globe
    const crownD = sheet().p(c.cut([[-16, -2], [-18, -16], [-10, -8], [-6, -20], [0, -8], [6, -20], [10, -8], [18, -16], [16, -2]], 0.3, 3), '#2a1d2c').out();
    const ruler = fx.add(`<g><g transform="scale(.42)">${shadowPerson(c, { hairStyle: 'short', beard: 'wild', pose: 'kneel' }, '#2a1d2c').replace('</g></g><g class="armF"', `<g transform="translate(2 -16)">${crownD}</g></g></g><g class="armF"`)}</g></g>`);
    /* the far plate: a hill with the cross, in golden light */
    const hill = `<rect width="300" height="190" fill="${mix(C.halo, C.dusk, 0.35)}"/><circle cx="150" cy="100" r="140" fill="url(#halo-glow)"/><g transform="translate(150 140)">${skullHill(c, { w: 260, h: 80, col: mix(C.rock2, C.dusk, 0.3) })}</g><g transform="translate(150 142) scale(.34)">${crossSil(c, { h: 240, figure: false, col: mix(INK, C.plumRobe, 0.3) })}</g>`;
    const plate = fx.add(`<g>${framed(S, hill, { w: 300, h: 190, rim: C.wood3, k: 'far' })}<g transform="translate(0 214)">${nameTag(c, tr('wywyższony', 'lifted up'), { size: 15 })}</g></g>`);
    const thr = threads(st.glowL, all.length, { color: C.halo, w: 1.6 });
    /* the answers */
    const law = fx.add(`<g>${glowDisc(90, 'halo-glow', 0.7)}${eternityRing(c, 56, 5, 24, C.haloRim)}<g transform="translate(0 0)">${scrollOpen(c, 80, 54)}</g><g transform="translate(0 78)">${nameTag(c, tr('na wieki', 'for ever'), { size: 15 })}</g></g>`);
    const how = fx.add(`<g>${bubble(c, [tr('potrzeba', 'must be'), tr('wywyższyć?', 'lifted up?')], { size: 18, tail: 1 })}</g>`);
    const who = hanging(fx, `${nameTag(c, '    ', { size: 20, w: 110 })}<g transform="translate(0 86) scale(.9)">${question(c)}</g><text x="0" y="31" text-anchor="middle" font-family="${FONT}" font-size="14" font-style="italic" fill="${INK}">${tr('Syn Człowieczy', 'Son of Man')}</text>`, { x: 800, y: 330, len: 700 });

    return (t, time) => {
      const T = time;
      swing(st.sunEl, 1220, 330, T, 1, 0.7);
      swing(st.cl1, 470, 140, T, 1.2, 0.6, 1);
      /* v31a — the globe and the balance */
      const gk = es(t, 0.05, 0.4, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      const tip = bump(t, 0.4, 1.0) * 8;
      swing(world, 800, 270 - (1 - gk) * 700, gk > 0.001 ? T : 0, 1 + tip, 0.8);
      fade(world, gk > 0.001 ? 1 : 0);
      /* v31b — the ruler cast out */
      const throwK = es(t, 1.3, 1.9, ease.in);
      const rx = 800 + 10 - throwK * 700, ry = 270 - 64 - 4 + throwK * throwK * 300 - Math.sin(throwK * PI) * 120;
      vis(ruler, { x: rx - (1 - gk) * 0, y: ry - (1 - gk) * 700, r: -throwK * 260, s: 1 - throwK * 0.5, o: gk > 0.01 && throwK < 0.98 ? 1 - throwK * 0.4 : 0 });
      /* v32 — lifted up, He draws all */
      const pk = es(t, 2.05, 2.4, ease.out) * (1 - es(t, 4.0, 4.2, ease.in));
      const PX = 800, PY = 170 - (1 - pk) * 700;
      vis(plate, { x: PX, y: PY, r: pk > 0.01 && T ? Math.sin(T * 0.6) * 0.5 : 0, o: pk > 0.001 ? 1 : 0 });
      const draw = es(t, 2.35, 2.8) * (1 - es(t, 3.95, 4.1));
      all.forEach((m, i) => {
        const [hx, hy] = headAt(m.x, m.y, m.s, m.flip);
        const k = es(t, 2.35 + i * 0.03, 2.6 + i * 0.03);
        thr(i, PX, PY + 150, lerp(PX, hx, k), lerp(PY + 150, hy, k), draw * 0.8);
      });
      const turn = es(t, 2.5, 2.8) * (1 - es(t, 3.95, 4.1));
      const bow = es(t, 3.1, 3.4) * (1 - es(t, 3.95, 4.1));
      left.forEach((m, i) => place(m, T, { head: -turn * 10 + bow * 10, armF: 20 + turn * 30 + bump(t, 5.1, 5.9) * (i === 1 ? 50 : 0), armB: turn * 20 }));
      right.forEach((m, i) => place(m, T, { head: -turn * 10 + bow * 10 + bump(t, 4.1, 4.9) * (i === 0 ? -4 : 0), armF: 20 + turn * 30 + (i === 0 ? bump(t, 4.1, 4.95) * 50 : 0) + (i === 1 ? bump(t, 5.1, 5.9) * 60 : 0) + (i === 2 ? bump(t, 6.1, 6.9) * 70 : 0), armB: turn * 20 + (i === 2 ? bump(t, 6.1, 6.9) * 60 : 0) }));
      jesus.set({ x: 800, y: F + 8, s: 1.06, flip: t > 4, armF: 16 + bump(t, 0.1, 1.9) * 40 + turn * 50, armB: 10 + bump(t, 2.1, 2.9) * 120 + bump(t, 1.2, 1.9) * 50, head: -turn * 10 + bow * 8, blink: bow > 0.5 ? 1 : blinkAt(T) });
      /* v34 — the crowd answers */
      const lk = es(t, 4.1, 4.35, ease.back) * (1 - es(t, 4.95, 5.1));
      vis(law, { x: S.portrait ? 970 : 1000, y: 430, s: lk, o: lk > 0.01 ? 1 : 0 });
      drawRing(law, es(t, 4.2, 4.6));
      const hk = es(t, 5.1, 5.3, ease.back) * (1 - es(t, 5.95, 6.05));
      vis(how, { x: S.portrait ? 580 : 520, y: 450, s: hk, o: hk > 0.01 ? 1 : 0 });
      const wk = es(t, 6.05, 6.35, ease.out);
      swing(who, 800, 330 - (1 - wk) * 700, wk > 0.001 ? T : 0, 1.3, 0.8);
      fade(who, wk > 0.001 ? 1 : 0);

      S.cam.x = kf(t, [[0, 0], [1.3, 0], [1.9, -40], [2.3, 0], [4.1, 40], [5.1, -40], [6, 0]]);
      S.cam.y = kf(t, [[0, -60], [1.2, -60], [2, -30], [2.4, -90], [3.4, -60], [4.1, 0], [6.1, -20]]);
      S.cam.z = kf(t, [[0, 1.06], [2, 1.02], [2.4, 1.0], [3.4, 1.06], [4.1, 1.06], [5, 1.08], [6.1, 1.06]]);
    };
  },
};
