// J 16,2–4 — the warning, told with restraint above the heads of the Eleven. "They will put you out of the
// synagogues": on a hanging night panel a little lamp-lit synagogue shuts its doors on a few small figures with
// lanterns, and a bar drops across. "The hour comes…": an hourglass turns over, grey clouds roll across the moon,
// and the grey smoke of a small altar rises into them (they will think it a service to God). "Because they have not
// known the Father, nor Me": two plates — a light, and Jesus — are veiled by a dark gauze. "I have told you, so that
// you remember": sparks go from His hand into every lantern. "I did not tell you at the beginning, because I was
// with you": the clouds part and a sunny memory from Galilee is lowered — the lake, the boat, Him among them.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, panel, roundPlate, fatherLight, greyCloud, hourglassRig, spark, hand,
  hanging, swing, person, sheet, shade, mix, kf, vis, pose, lerp, tr, C, PI, nt, NIGHT, STORM, JESUS, TW, JX,
} from './lib.js';

const PW = 460, PH = 240;

export default {
  id: 'j16-hour',
  beats: [
    { v: 2, text: 'Wyłączą was z synagogi.' },
    { v: 2, cont: true, text: 'Owszem, nadchodzi godzina, w której każdy, kto was zabije, będzie sądził, że oddaje cześć Bogu.' },
    { v: 3 },
    { v: 4, text: 'Ale powiedziałem wam o tych rzeczach, abyście, gdy nadejdzie ich godzina, pamiętali o nich, że Ja wam to powiedziałem.' },
    { v: 4, cont: true, text: 'Tego jednak nie powiedziałem wam od początku, ponieważ byłem z wami.' },
  ],
  cam: { x: [-30, 30], y: [-60, 40], z: [1, 1.12] },
  build(S) {
    const c = S.c;
    const P = pathSet(S);
    const GY = P.GY;

    // the rolling clouds (in front of the moon)
    const cloudL = S.layer({ par: 0.07, sh: 3 });
    const clouds = [[-520, 240, 440, 360], [2100, 250, 480, 1170], [-700, 330, 380, 600], [2300, 330, 400, 1000], [2000, 400, 300, 1360]]
      .map(([x0, y, w, x1], i) => ({ x0, y, x1, i, el: cloudL.add(`<g>${greyCloud(c, w, mix(C.storm2, C.night2, 0.25 + (i % 2) * 0.15))}</g>`) }));

    /* ---- the synagogue panel ---- */
    const plL = S.layer({ par: 0.2, sh: 6 });
    const ink = nt(C.stone, 0.35);
    const fac = sheet();
    fac.p(c.cut([[-PW / 2 - 4, PH], [-PW / 2 - 4, 196], [-60, 192], [80, 198], [PW / 2 + 4, 194], [PW / 2 + 4, PH]], 0.8, 10), nt(C.sand2, 0.4));
    fac.p(c.cut(c.rect(-150, 70, 300, 128), 0.5, 8), ink);
    fac.p(c.cut([[-166, 74], [0, 16], [166, 74]], 0.5, 8), nt(C.plaster, 0.3));
    fac.p(c.cut(c.star(0, 50, 13, 6, 6, 0), 0.3, 3), nt(C.sun, 0.15));
    fac.p(c.cut(c.rect(-172, 196, 344, 10), 0.3, 6), nt(C.stone2, 0.4));
    const col = [-120, -80, 80, 120].map((x) => c.cut(c.rect(x - 8, 78, 16, 118), 0.3, 6)).join('');
    fac.p(col, nt(C.stone2, 0.35));
    const doorPts = [[-42, 196], [-42, 128], ...c.arc(0, 128, 42, 36, PI, 2 * PI, 10), [42, 196]];
    fac.p(c.cut(doorPts, 0.3, 5), '#f3cf87');
    const glowIn = `<ellipse cx="0" cy="170" rx="60" ry="40" fill="url(#warm-glow)"/>`;
    const leaf = (dir) => sheet().p(c.cut([[0, 0], [dir * 42, 0], [dir * 42, 70], [0, 70]].map(([x, y]) => [x, y]), 0.3, 5), nt(C.wood2, 0.2))
      .x(c.ribbon([[dir * 8, 6], [dir * 8, 64]], 1.5) + c.ribbon([[dir * 34, 6], [dir * 34, 64]], 1.5), nt(C.wood, 0.2)).out();
    const leafL = `<g data-k="leafL" transform="translate(-42 126)">${leaf(1)}</g>`;
    const leafR = `<g data-k="leafR" transform="translate(42 126)">${leaf(-1)}</g>`;
    const bar = `<g data-k="bar">${sheet().p(c.cut(c.rect(-52, -5, 104, 10), 0.3, 5), nt(C.wood, 0.1)).out()}</g>`;
    const tiny = ['peter', 'john', 'thomas'].map((k, i) => `<g data-k="tiny${i}">${person(c, { ...TW[k], holdF: `<circle cy="10" r="12" fill="url(#warm-glow)"/><path d="${c.cut(c.rect(-4, 4, 8, 10), 0.2, 2)}" fill="${C.lampFlame}"/>` })}</g>`).join('');
    const sky1 = `<rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="#343866"/><g transform="translate(170 44)"><circle r="30" fill="url(#halo-glow)" opacity=".6"/><path d="${c.cut(c.circ(0, 0, 12, 16), 0.2, 3)}" fill="${C.moon}"/></g>`;
    const syn = hanging(plL, panel(S, PW, PH, `${sky1}${fac.out()}${glowIn}${leafL}${leafR}${bar}${tiny}`, { frame: C.wood2 }), { x: JX, y: 145, len: 700 });
    const lL = S.$('leafL'), lR = S.$('leafR'), barEl = S.$('bar');
    const tinies = [0, 1, 2].map((i) => ({ i, el: S.$('tiny' + i) }));
    const tinyP = tinies.map((m) => S.puppet(m.el.firstElementChild));

    /* ---- the hour: hourglass and the altar smoke ---- */
    const hgL = S.layer({ par: 0.22, sh: 5 });
    const hg = hourglassRig(hgL, c, 120);
    hg.el.insertAdjacentHTML('afterbegin', `<path d="M0 -1600V-60" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>`);
    const AX = S.portrait ? 1005 : 1100;       // phone: the altar plate inside the screen
    const alt = sheet();
    alt.p(c.cut(c.rect(-34, -40, 68, 40), 0.4, 6), nt(C.stone, 0.3));
    alt.p(c.cut(c.rect(-42, -48, 84, 10), 0.3, 6) + c.cut(c.rect(-42, -4, 84, 8), 0.3, 6), nt(C.stone2, 0.35));
    alt.p(c.cut([[-40, -48], [-44, -60], [-32, -50]], 0.2, 3) + c.cut([[40, -48], [44, -60], [32, -50]], 0.2, 3), nt(C.stone2, 0.35));
    const altar = hanging(hgL, `${sheet().p(c.cut(c.circ(0, 0, 76, 40), 0.5, 5), C.ochre).p(c.cut(c.circ(0, 0, 69, 38), 0.5, 5), '#3a3d68').out()}<g transform="translate(0 40)">${alt.out()}</g>`, { x: AX, y: 290, len: 700 });
    const smoke = Array.from({ length: 5 }, (_, i) => ({ i, el: hgL.add(`<g><path d="${c.cut(c.blob(0, 0, 16, 11, 10, 0.25), 0.5, 4)}" fill="${mix(C.storm, C.greyHair, 0.3)}"/></g>`) }));

    /* ---- the Father and the Son, veiled ---- */
    const plates = [
      { x: 650, el: hanging(plL, roundPlate(c, `<g transform="scale(.5)">${fatherLight(c, 90, { ray: [0.9, 1.25], glow: 1.2 })}</g>`, tr('Ojciec', 'the Father'), { face: '#2e3262' }), { x: 650, y: 250, len: 700 }) },
      { x: 950, el: hanging(plL, roundPlate(c, `<circle r="50" fill="url(#halo-glow)" opacity=".7"/><g transform="translate(0 52) scale(.44)">${person(c, JESUS)}</g>`, tr('Ja', 'Me'), { face: '#2e3262' }), { x: 950, y: 250, len: 700 }) },
    ];
    const veilL = S.layer({ par: 0.21, sh: 2, flat: true });
    const vs = sheet();
    const top = [], bot = [];
    for (let i = 0; i <= 24; i++) { const x = i * 26; top.push([x, -96 + Math.sin(i * 1.1) * 6]); bot.push([x, 118 + Math.sin(i * 0.8 + 1) * 8]); }
    vs.p(c.cut([...top, [630, -90], [640, 120], ...bot.reverse()], 1, 10), '#20223f', 'opacity=".72"');
    let folds = '';
    for (let x = 14; x < 620; x += c.rr(22, 34)) folds += c.ribbon([[x, -92], [x + c.rr(-4, 4), 116]], c.rr(2, 5));
    vs.x(folds, '#393c66', 'opacity=".55"');
    vs.p(c.ribbon([[-6, -100], [646, -94]], 8), nt(C.wood2, 0.3));
    const veil = veilL.add(`<g>${vs.out()}</g>`);

    /* ---- the memory: a sunny day by the lake ---- */
    const mem = sheet();
    mem.raw(`<rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="#d9e6dc"/>`);
    mem.p(c.cut([[-PW / 2 - 4, 110], [-100, 96], [60, 104], [PW / 2 + 4, 92], [PW / 2 + 4, 140], [-PW / 2 - 4, 140]], 0.8, 10), C.hillFar);
    mem.p(c.cut([[-PW / 2 - 4, 128], [PW / 2 + 4, 126], [PW / 2 + 4, 190], [-PW / 2 - 4, 192]], 0.5, 10), C.lake);
    mem.x(c.ribbon([[-150, 150], [-100, 151]], 2) + c.ribbon([[60, 164], [130, 163]], 2) + c.ribbon([[-40, 176], [10, 177]], 2), C.foam, 'opacity=".8"');
    mem.p(c.cut([[-PW / 2 - 4, 186], [PW / 2 + 4, 180], [PW / 2 + 4, PH], [-PW / 2 - 4, PH]], 0.6, 10), C.sand);
    mem.p(c.cut([[108, 172], [196, 172], [186, 190], [118, 190]], 0.4, 5), C.wood);
    mem.x(c.ribbon([[150, 172], [150, 120]], 2.4), C.wood2);
    mem.p(c.cut([[152, 124], [184, 164], [152, 164]], 0.3, 4), C.sail);
    const sunM = `<g transform="translate(-160 46)"><circle r="44" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 20, 22), 0.3, 3)}" fill="${C.sun}"/></g>`;
    const folks = [['andrew', -110], ['peter', -60], ['jesus', 0], ['john', 52], ['james', 100]]
      .map(([k, x]) => `<g transform="translate(${x} 214) scale(.36)${x > 0 ? ' scale(-1 1)' : ''}">${person(c, k === 'jesus' ? JESUS : { ...TW[k] })}</g>`).join('');
    const memory = hanging(plL, panel(S, PW, PH, `${mem.out()}${sunM}${folks}`, { frame: C.ochre }), { x: JX, y: 140, len: 700 });

    /* ---- people ---- */
    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY });
    const fx = S.layer({ par: 0.56, sh: 3 });
    const sparks = D.map((m) => ({ m, el: fx.add(`<g>${spark(c, 8)}</g>`) }));

    return (t, time) => {
      const T = time;
      P.update(T);

      /* v2a — the doors close */
      const synIn = es(t, -0.2, 0.25, ease.out) * (1 - es(t, 0.9, 1.15, ease.in));
      vis(syn, { x: JX, y: 145 - (1 - synIn) * 700, r: 0, o: synIn > 0.01 ? 1 : 0 });
      if (synIn > 0.01) {
        const shut = es(t, 0.3, 0.6);
        pose(lL, { x: -42, y: 126, sx: 0.12 + shut * 0.88 });
        pose(lR, { x: 42, y: 126, sx: 0.12 + shut * 0.88 });
        const b = es(t, 0.6, 0.72, ease.out);
        vis(barEl, { x: 0, y: 130 + b * 30, o: b > 0.01 ? 1 : 0 });
        tinyP.forEach((p, i) => {
          const out = es(t, 0.15, 0.45);
          const x0 = [-12, 4, 18][i], x1 = [-110, -80, 100][i];
          p.set({ x: lerp(x0, x1, out), y: 200 + (i === 2 ? 0 : 2), s: 0.3, flip: i < 2, walk: out > 0.01 && out < 0.99 ? out * 12 : undefined, armF: 30, head: shut * 14, o: 1 });
        });
      }

      /* v2b — the hour; clouds roll in; the altar's grey smoke */
      const hour = es(t, 1.0, 1.35, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      const turn = es(t, 1.2, 1.45);
      vis(hg.el, { x: JX, y: 260 - (1 - hour) * 700, r: 180 - turn * 180 + (T ? Math.sin(T * 0.9) * 1.2 : 0), o: hour > 0.01 ? 1 : 0 });
      hg.set(1 - es(t, 1.4, 2.0) * 0.6, turn > 0.9 ? 1 : 0);
      const altIn = es(t, 1.2, 1.5, ease.out) * (1 - es(t, 1.95, 2.2, ease.in));
      vis(altar, { x: AX, y: 300 - (1 - altIn) * 700, r: T ? Math.sin(T * 0.7 + 1) * 1 : 0, o: altIn > 0.01 ? 1 : 0 });
      smoke.forEach((sm) => {
        const k = seg(t, 1.4 + sm.i * 0.1, 2.0 + sm.i * 0.1);
        vis(sm.el, { x: AX + Math.sin(k * 5 + sm.i) * 16 + k * 20, y: 300 - (1 - altIn) * 700 + 20 - k * 150, s: 0.7 + k * 1.3, o: altIn > 0.01 && k > 0 && k < 1 ? Math.min(1, (1 - k) * 2.5) * altIn : 0 });
      });
      const dark = es(t, 1.15, 1.8) * (1 - es(t, 4.05, 4.5));
      P.sky.blend(NIGHT, STORM, dark);
      clouds.forEach((cl) => {
        const k = es(t, 1.1 + cl.i * 0.07, 1.8 + cl.i * 0.07) * (1 - es(t, 4.05 + cl.i * 0.03, 4.5 + cl.i * 0.03));
        vis(cl.el, { x: lerp(cl.x0, cl.x1, k), y: cl.y, s: 1, o: 1 });
      });
      fade(P.moon, 1 - dark * 0.7);

      /* v3 — the plates, veiled */
      const pl = es(t, 2.0, 2.3, ease.out) * (1 - es(t, 2.95, 3.2, ease.in));
      plates.forEach((p, i) => vis(p.el, { x: p.x, y: 250 - (1 - pl) * 700, r: T ? Math.sin(T * 0.8 + i) * 1.2 : 0, o: pl > 0.01 ? 1 : 0 }));
      const vk = es(t, 2.35, 2.75);
      vis(veil, { x: lerp(-300, 480, vk), y: 262 - (1 - pl) * 700, o: pl > 0.01 && vk > 0.01 ? 1 : 0 });

      /* v4a — sparks into every lantern */
      const hk = bump(t, 3.0, 3.9);
      sparks.forEach(({ m, el }, i) => {
        const d = Math.abs(m.x - JX);
        const k = es(t, 3.2 + d * 0.0006, 3.55 + d * 0.0006);
        const [hx, hy] = hand(JX, J.y, J.s, false, 20 + hk * 60);
        const [lx, ly] = hand(m.x, m.y, m.s, m.flip, m.arm);
        vis(el, { x: lerp(hx, lx, k), y: lerp(hy, ly + 22, k) - Math.sin(k * PI) * 90, s: 1 - k * 0.3, o: k > 0.01 && k < 0.99 ? 1 : 0 });
      });

      /* v4b — the memory by the lake */
      const mk = es(t, 4.0, 4.35, ease.out);
      vis(memory, { x: JX, y: 140 - (1 - mk) * 700, r: 0, o: mk > 0.01 ? 1 : 0 });

      /* the Eleven and Jesus */
      const worry = es(t, 0.35, 0.6) * (1 - es(t, 3.3, 3.7));
      D.forEach((m, i) => {
        const d = Math.abs(m.x - JX);
        const flare = es(t, 3.5 + d * 0.0006, 3.65 + d * 0.0006);
        lampK(m, 0.85 - dark * 0.3 + flare * (0.45 - es(t, 3.9, 4.3) * 0.3) + es(t, 4.1, 4.5) * 0.3, 0, T);
        fade(m.sad, worry);
        const up = es(t, 4.1, 4.4);
        put(m, T, { head: worry * 8 - (1 - worry) * 4 - up * 10, armB: 8 + (i % 3 === 0 ? bump(t, 4.3, 5) * 50 : 0), lean: -dark * (m.flip ? -2 : 2) * (1 - flare) });
      });
      const look = es(t, 4.1, 4.4);
      put(J, T, { armF: 20 + hk * 60 + bump(t, 0.1, 0.9) * 30 + look * 30, armB: 10 + bump(t, 2.1, 2.9) * 70 + look * 90, head: -bump(t, 0.1, 0.9) * 8 - look * 6 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, -30], [1, -30], [2, -40], [3, -10], [3.9, 10], [4.3, -40], [5, -40]]);
      S.cam.z = kf(t, [[0, 1.02], [2, 1.0], [3.5, 1.08], [4.2, 1.0], [5, 1.02]]);
    };
  },
};
