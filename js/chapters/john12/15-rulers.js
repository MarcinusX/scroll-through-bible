// J 12,42–46 — night. Among the leaders, small lights kindle: many believed. But by the synagogue door two Pharisees
// stand with folded arms, and the leaders cover their lights with their mantles; the door swings shut on a man left
// outside. A balance comes down: a paper wreath of human praise on one pan, the radiance of God's glory on the other
// — and their pan of praise sinks. Then Jesus cries out, standing in a column of light: "Whoever believes in Me
// believes in Him who sent Me" — a thread of light runs from Him up to the radiance. "Whoever sees Me sees Him who
// sent Me" — an open eye, and the radiance stands right behind Him. "I have come into the world as light" — a dark
// globe comes down, a flame goes into it and it lights; and the hidden lights come out from under the mantles.
import { C, person, CAST, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade, attr } from '../../core/anim.js';
import { darkStage, leader, man, people, place, soulLight, radiance, laurel, globe, eyeIcon, wordFlame, headAt, voiceRings, nameTag, hanging, swing, kf, vis, glowDisc, tr, PI, FONT } from './lib.js';

export default {
  id: 'j12-rulers',
  beats: [
    { v: 42, text: 'Niemniej jednak i spośród przywódców wielu w Niego uwierzyło,' },
    { v: 42, cont: true, text: 'ale z obawy przed faryzeuszami nie przyznawali się, aby ich nie wyłączono z synagogi.' },
    { v: 43 },
    { v: 44, text: 'Jezus zaś tak wołał:' },
    { v: 44, cont: true, text: '«Ten, kto we Mnie wierzy, wierzy nie we Mnie, lecz w Tego, który Mnie posłał.' },
    { v: 45 },
    { v: 46 },
  ],
  cam: { x: [-60, 100], y: [-120, 40], z: [0.98, 1.14] },
  build(S) {
    const c = S.c;
    const st = darkStage(S, { skyCols: ['#1b1f42', '#282d58', '#3a3a68'] });
    const F = st.FLOOR;
    /* the synagogue portal on the right */
    const wallL = S.layer({ par: 0.36, sh: 4 });
    const DX = 1290, DW = 96, DT = F - 210;
    const w = sheet();
    const door = [[DX - DW / 2, F - 30], [DX - DW / 2, DT + DW / 2], ...c.arc(DX, DT + DW / 2, DW / 2, DW / 2, PI, 2 * PI, 10), [DX + DW / 2, F - 30]];
    w.p(c.cut([[1150, F - 30], [1150, F - 330], [1700, F - 330], [1700, F - 30]], 0.8, 12) + c.hole(door, 0.4, 6), mix(C.stone, C.indigo, 0.45));
    let bl = '';
    for (let y = F - 320; y < F - 40; y += 36) for (let x = 1150 + ((y / 36) % 2 ? 40 : 0); x < 1700; x += 90) { if (x + 86 > DX - DW / 2 - 8 && x < DX + DW / 2 + 8 && y + 32 > DT) continue; bl += c.cut(c.rect(x + 2, y + 2, 84, 30), 0.4, 8); }
    w.x(bl, mix(C.stone2, C.indigo, 0.5), 'opacity=".5"');
    w.p(c.ribbon(c.arc(DX, DT + DW / 2, DW / 2 + 6, DW / 2 + 6, PI, 2 * PI, 10), 10), mix(C.wood2, C.indigo, 0.3));
    wallL.add(`<path d="${c.poly(door)}" fill="${mix(C.lampFlame, C.clay, 0.3)}"/>` + w.out());
    const leaf = wallL.add(`<g>${sheet().p(c.cut(c.rect(0, DT + 10, DW, F - 30 - DT - 10), 0.4, 6), mix(C.wood2, C.indigo, 0.25)).x(c.ribbon([[8, DT + 60], [DW - 8, DT + 60]], 3) + c.ribbon([[8, F - 80], [DW - 8, F - 80]], 3), C.sun, 'opacity=".5"').out()}</g>`);
    st.back.el.before(wallL.el);
    const outcast = S.puppet(st.back.add(person(c, man(c, { robe: mix(C.stone2, C.indigo, 0.3), mantle: null }))));
    /* the leaders who believe, the Pharisees who watch */
    const rulers = people(S, st.act, [[440, 4, 0], [510, -8, 1], [580, 6, 2], [650, -4, 3]].map(([x, dy, i]) => ({ x, y: F + dy, s: 0.96, look: leader(i) })), 'r');
    const phar = people(S, st.act, [[1100, 4, 0], [1170, -6, 1]].map(([x, dy, i]) => ({ x, y: F + dy, s: 0.98, flip: true, look: leader(i + 2), face: true })), 'p');
    const col = st.glowL.add(`<g><path d="M-70 0L70 0L36 -1100L-36 -1100Z" fill="#fff3cf" opacity=".42"/>${glowDisc(200, 'halo-glow', 1)}</g>`);
    const jesus = S.puppet(st.act.add(person(c, CAST.jesus)));
    const fx = st.fx;
    const lights = rulers.map((m, i) => ({ i, m, el: fx.add(`<g>${soulLight(c, 10)}</g>`), on: i !== 2 }));
    // human praise vs. God's glory
    const bw = 180;
    const beam = sheet().p(c.ribbon([[-bw, 0], [bw, 0]], 5), C.ochre).p(c.cut(c.circ(0, 0, 9, 12), 0.3, 3), C.sun).out();
    const pan = (inner) => `<path d="M0 0L-34 70M0 0L34 70" stroke="${shade(C.ochre, -0.3)}" stroke-width="1.4" fill="none"/>${sheet().p(c.cut([[-44, 70], [44, 70], [34, 84], [-34, 84]], 0.3, 4), C.sun).out()}<g transform="translate(0 64)">${inner}</g>`;
    const hands = `<g transform="scale(.9)">${laurel(c, 20, C.leaf)}<path d="${c.cut([[-26, -4], [-18, -26], [-12, -24], [-16, -4]], 0.3, 3) + c.cut([[26, -4], [18, -26], [12, -24], [16, -4]], 0.3, 3)}" fill="${C.skin2}"/></g>`;
    const balL = S.layer({ par: 0.3, sh: 5 });
    const balPost = hanging(balL, `<path d="M0 0V-40" stroke="${C.ochre}" stroke-width="4"/>`, { x: 800, y: 220, len: 800 });
    const balBeam = balL.add(`<g>${beam}</g>`);
    const panL = balL.add(`<g>${pan(hands)}<g transform="translate(0 116)">${nameTag(c, tr('chwała ludzka', 'the praise of men'), { size: 14 })}</g></g>`);
    const panR = balL.add(`<g>${pan(`<g transform="translate(0 -18)">${radiance(c, 20)}</g>`)}<g transform="translate(0 116)">${nameTag(c, tr('chwała Boża', 'the glory of God'), { size: 14 })}</g></g>`);
    // the sender: the radiance above; the thread; the eye; the world and the flame
    const rad = st.heav.add(`<g><circle r="220" fill="url(#halo-glow)"/>${radiance(c, 70)}</g>`);
    const thread = fx.add(`<g><path d="M0 0V-10" stroke="${C.halo}" stroke-width="4" stroke-linecap="round"/></g>`);
    const threadP = thread.querySelector('path');
    const eye = fx.add(`<g>${glowDisc(60, 'halo-glow', 0.8)}${sheet().p(c.cut(c.circ(0, 0, 34, 24), 0.4, 4), C.haloRim).p(c.cut(c.circ(0, 0, 30, 24), 0.4, 4), C.parchment).out()}${eyeIcon(c, true, 20)}</g>`);
    const worldEl = hanging(fx, `<g class="dark"><circle r="72" fill="${C.night2}"/></g>${globe(c, 64)}<g class="shade"><circle r="65" fill="#141735" opacity=".82"/></g><circle class="lit" r="150" fill="url(#halo-glow)" opacity="0"/>`, { x: 1000, y: 260, len: 800 });
    const flame = fx.add(`<g>${glowDisc(60, 'halo-glow', 1)}${wordFlame(c, 50)}</g>`);
    const vL = S.layer({ par: 0.52, sh: 2 });
    const rings = voiceRings(vL, c, { n: 4, r: 40, w: 6, color: shade(C.halo, -0.05) });

    return (t, time) => {
      const T = time;
      /* v42a — lights kindle among the leaders */
      const hide = es(t, 1.3, 1.6) * (1 - es(t, 6.2, 6.6));
      rulers.forEach((m, i) => {
        const [hx, hy] = headAt(m.x, m.y, m.s, false);
        const l = lights[i];
        const k = l.on ? es(t, 0.15 + i * 0.1, 0.4 + i * 0.1, ease.back) : 0;
        const y = lerp(hy - 36, hy + 62, hide);
        vis(l.el, { x: hx + hide * 8, y: y + (T ? Math.sin(T * 2 + i) * 2 : 0), s: k * (1 - hide * 0.5), o: k > 0.01 ? 1 - hide * 0.8 : 0 });
        const look = bump(t, 1.1, 1.9) * (i % 2 ? 1 : 0);
        place(m, T, { armF: 18 + hide * 40 + es(t, 6.2, 6.5) * 50, armB: 10 + es(t, 6.3, 6.6) * 90, head: -look * 6 + hide * 8 - es(t, 3.1, 3.4) * 10 * (1 - hide * 0.5) - es(t, 6.2, 6.5) * 6, flip: look > 0.5 });
      });
      /* v42b — the Pharisees watch; the door shuts on a man */
      phar.forEach((m, i) => { place(m, T, { armF: 30 + es(t, 1.1, 1.4) * 20, armB: 30, head: 2 }); fade(m.angry, es(t, 1.05, 1.3)); });
      const shut = es(t, 1.4, 1.65);
      pose(leaf, { x: DX - DW / 2, y: 0, sx: Math.max(0.05, shut), o: shut > 0.02 ? 1 : 0 });
      const oo = es(t, 1.15, 1.45);
      outcast.set({ x: lerp(DX, DX + 110, oo), y: F - 30, s: 0.84, flip: false, o: oo > 0 ? 1 - es(t, 2.9, 3.1) : 0, walk: oo > 0 && oo < 1 ? t * 30 : undefined, head: 10, armF: 10, blink: blinkAt(T, 9) });
      /* v43 — human praise outweighs God's glory */
      const bk = es(t, 2.05, 2.35, ease.out) * (1 - es(t, 2.95, 3.15, ease.in));
      const by = 220 - (1 - bk) * 800;
      const tilt = es(t, 2.35, 2.7) * 16;
      const rr = (tilt * PI) / 180;
      swing(balPost, 800, by, 0);
      fade(balPost, bk > 0.001 ? 1 : 0);
      pose(balBeam, { x: 800, y: by, r: -tilt, o: bk > 0.001 ? 1 : 0 });
      pose(panL, { x: 800 - Math.cos(rr) * bw, y: by + Math.sin(rr) * bw, o: bk > 0.001 ? 1 : 0 });
      pose(panR, { x: 800 + Math.cos(rr) * bw, y: by - Math.sin(rr) * bw, o: bk > 0.001 ? 1 : 0 });
      /* v44a — Jesus cries out */
      const jIn = es(t, 3.05, 3.35);
      jesus.set({ x: 820, y: F + 10, s: 1.08, o: jIn, armF: 30 + jIn * 40 + bump(t, 4.1, 4.9) * 30 + es(t, 6.1, 6.4) * 30, armB: 10 + jIn * 80 * (1 - es(t, 5.0, 5.3)) + bump(t, 4.1, 4.9) * 60, head: -4 - bump(t, 4.1, 4.9) * 8, blink: blinkAt(T) });
      vis(col, { x: 820, y: F + 10, sx: 0.6 + jIn * 0.5, o: jIn * 0.9 });
      const [jhx, jhy] = headAt(820, F + 10, 1.08, false);
      rings(jhx, jhy + 10, bump(t, 3.1, 3.95), T, { spread: 3.4 });
      /* v44b — believes in Him who sent Me */
      const rk = es(t, 4.05, 4.4) * (1 - es(t, 6.0, 6.3) * 0.3);
      vis(rad, { x: 820, y: lerp(90, 250, es(t, 5.05, 5.45)), s: 1 + (T ? Math.sin(T * 1.1) * 0.02 : 0), o: rk });
      const tk = es(t, 4.2, 4.6) * (1 - es(t, 5.0, 5.2));
      vis(thread, { x: 820, y: jhy - 30, o: tk > 0.01 ? 1 : 0 });
      attr(threadP, 'd', `M0 0V${(-(jhy - 30 - 110) * tk).toFixed(1)}`);
      /* v45 — who sees Me sees Him */
      const ek = es(t, 5.1, 5.35, ease.back) * (1 - es(t, 5.95, 6.1));
      vis(eye, { x: 600, y: 420, s: ek, o: ek > 0.01 ? 1 : 0 });
      /* v46 — light into the world */
      const wk = es(t, 6.05, 6.35, ease.out);
      swing(worldEl, 1010, 270 - (1 - wk) * 700, wk > 0.001 ? T : 0, 1.1, 0.7, 1);
      fade(worldEl, wk > 0.001 ? 1 : 0);
      const fk = es(t, 6.3, 6.6);
      vis(flame, { x: lerp(jhx + 30, 1010, fk), y: lerp(jhy - 40, 270, fk) - Math.sin(fk * PI) * 80, s: 1 - fk * 0.4, o: fk > 0 && fk < 0.98 ? 1 : 0 });
      const lit = es(t, 6.55, 6.8);
      fade(worldEl.querySelector('.shade'), 1 - lit);
      fade(worldEl.querySelector('.lit'), lit);

      S.cam.x = kf(t, [[0, -60], [1.1, -40], [1.8, 60], [2.2, 0], [3.1, 0], [4.1, 0], [5.1, -20], [6.2, 40]]);
      S.cam.y = kf(t, [[0, 0], [1.1, 0], [2.1, -70], [3.1, -20], [4.1, -80], [5.1, -40], [6.2, -40]]);
      S.cam.z = kf(t, [[0, 1.08], [1.1, 1.06], [2.1, 1.0], [3.1, 1.04], [4.1, 1.0], [5.1, 1.06], [6.2, 1.04]]);
    };
  },
};
