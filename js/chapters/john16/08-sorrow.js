// J 16,20–21 — "You will weep and lament, but the world will rejoice": a grey cloud hangs over the Eleven and rain
// falls on them, while over the far city bright pennants are strung and little lights go up as at a feast. "Your
// sorrow will be turned into joy": the cloud parts, the rain turns to falling petals, warm light. Then a picture is
// lowered, told gently: "A woman, when she gives birth, has sorrow, because her hour has come" — a lamp-lit room at
// night, the moon in the window, a young mother resting against cushions, eyes shut, an older woman holding her hand.
// "But when she has delivered the child, she no longer remembers the anguish, for joy that a human being is born
// into the world": dawn in the window, and she holds her newborn, wrapped in light, her face full of joy.
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import {
  pathSet, cast, put, lampK, panel, greyCloud, rainStreaks, flower, withFace, faceBits, person, hanging,
  sheet, shade, mix, kf, vis, pose, lerp, blinkAt, C, PI, JX, NIGHT, STORM, PREDAWN,
} from './lib.js';

const PW = 560, PH = 300;
const MOTHER = { robe: C.roseRobe, mantle: C.skyVeil, hairStyle: 'veil', veil: C.skyVeil, veil2: shade(C.skyVeil, -0.12), skin: C.skin, hair: C.hair2 };
const ELDER = { robe: C.ochreRobe, hairStyle: 'veil', veil: C.linen2, skin: C.skin3, hair: C.greyHair };

function newborn(c) {
  const s = sheet();
  s.p(c.cut(c.ell(0, 0, 21, 11, 16, -0.15), 0.3, 4), C.linen);
  s.x(c.ribbon([[-12, -2], [8, -6]], 1.4) + c.ribbon([[-10, 5], [10, 1]], 1.4), C.linen2);
  s.p(c.cut(c.circ(18, -7, 8.5, 12), 0.2, 3), C.skin);
  s.p(c.cut([...c.arc(18, -7, 10, 10, PI * 0.9, PI * 1.9, 8), [22, -12], [12, -4]], 0.2, 3), C.linen2);
  s.x(c.ribbon(c.arc(21, -6, 1.8, 1.2, 0.2, PI - 0.2, 5), 1), C.inkSoft);
  return `<circle r="40" fill="url(#halo-glow)"/>${s.out()}`;
}

export default {
  id: 'j16-sorrow',
  beats: [
    { v: 20, text: 'Zaprawdę, zaprawdę, powiadam wam: Wy będziecie płakać i zawodzić, a świat się będzie weselił.' },
    { v: 20, cont: true, text: 'Wy będziecie się smucić, ale smutek wasz zamieni się w radość.' },
    { v: 21, text: 'Kobieta, gdy rodzi, doznaje smutku, bo przyszła jej godzina.' },
    { v: 21, cont: true, text: 'Gdy jednak urodzi dziecię, już nie pamięta o bólu z powodu radości, że się człowiek narodził na świat.' },
  ],
  cam: { x: [-40, 40], y: [-90, 40], z: [1, 1.3] },
  build(S) {
    const c = S.c;
    const P = pathSet(S);
    const GY = P.GY;

    // the world's feast over the city: pennants and little lights
    const feastL = S.layer({ par: 0.1, sh: 1 });
    const cols = [C.terracotta, C.sun, C.skyVeil, C.roseRobe, C.sageRobe, C.lavender];
    let pen = '';
    const pens = [];
    for (let i = 0; i < 16; i++) { const x = 330 + i * 18, y = 318 + Math.sin((i / 15) * PI) * 16; pens.push([x, y]); }
    pen = pens.map(([x, y], i) => `<path d="${c.poly([[x - 6, y], [x + 6, y + 1], [x, y + 12]])}" fill="${cols[i % cols.length]}"/>`).join('');
    const bunting = feastL.add(`<g><path d="${c.ribbon(pens, 1)}" fill="${C.cream}" opacity=".7"/>${pen}</g>`);
    const pops = Array.from({ length: 9 }, (_, i) => ({ i, x: 360 + c.rr(0, 240), el: feastL.add(`<g><circle r="14" fill="url(#warm-glow)"/><path d="${c.cut(c.star(0, 0, 5, 2, 4, 0), 0.1, 2)}" fill="${cols[i % cols.length]}"/></g>`) }));

    // the rain cloud over the Eleven, and the petals it turns into
    const cloudL = S.layer({ par: 0.3, sh: 4 });
    const cl = [[560, 470, 300], [800, 455, 380], [1050, 475, 320]].map(([x, y, w], i) => ({ x, y, i, el: cloudL.add(`<g>${greyCloud(c, w, mix(C.storm, C.lavender, 0.2))}</g>`), rain: cloudL.add(`<g>${rainStreaks(c, w - 30, 120)}</g>`) }));
    const petals = Array.from({ length: 26 }, (_, i) => ({ i, x: 450 + c.rr(0, 720), y0: c.rr(420, 470), el: cloudL.add(`<g>${flower(c, c.rr(5, 8), cols[i % 4])}</g>`), sp: c.rr(0.8, 1.3) }));
    const warmL = S.layer({ par: 0.3, sh: 0, flat: true });
    warmL.add(`<ellipse cx="800" cy="520" rx="700" ry="300" fill="url(#halo-glow)"/>`);

    /* ---- the picture: a room at night, then dawn ---- */
    const bg = sheet();
    const wall = mix(C.plaster, C.apricot, 0.25);
    bg.raw(`<rect x="${-PW / 2}" y="0" width="${PW}" height="${PH}" fill="${shade(wall, -0.08)}"/>`);
    const win = [[-230, 150], [-230, 90], ...c.arc(-190, 90, 40, 40, PI, 2 * PI, 10), [-150, 150]];
    bg.p(c.cut([[-PW / 2 - 4, PH], [-PW / 2 - 4, 250], [PW / 2 + 4, 246], [PW / 2 + 4, PH]], 0.6, 10), mix(C.clay, C.sand2, 0.5));
    const night = `<path d="${c.poly(win)}" fill="#2e3262"/><g transform="translate(-178 80)"><circle r="20" fill="url(#halo-glow)" opacity=".6"/><path d="${c.cut(c.circ(0, 0, 9, 12), 0.2, 3)}" fill="${C.moon}"/></g>`;
    const dawnW = `<g data-k="wdawn" opacity="0"><path d="${c.poly(win)}" fill="#f4c7a4"/><path d="${c.poly([[-230, 150], [-230, 128], [-200, 120], [-170, 126], [-150, 122], [-150, 150]])}" fill="${C.hillNear}"/><g transform="translate(-186 128)"><circle r="30" fill="url(#halo-glow)"/><path d="${c.cut(c.circ(0, 0, 12, 14), 0.2, 3)}" fill="${C.sun}"/></g></g>`;
    const frame = sheet().p(c.ribbon(win.slice(0, -1).concat([[-150, 150], [-230, 150]]), 6), C.wood2).out();
    const glowRoom = `<g data-k="rglow"><ellipse cx="120" cy="170" rx="260" ry="170" fill="url(#warm-glow)"/></g>`;
    const mat = sheet().p(c.cut([[-96, 256], [220, 256], [216, 272], [-92, 272]], 0.5, 6), C.linen2)
      .p(c.cut(c.blob(-58, 222, 38, 30, 12, 0.1), 0.5, 5) + c.cut(c.blob(-30, 242, 34, 18, 12, 0.1), 0.5, 5), mix(C.terracotta, C.clay, 0.4))
      .p(c.cut([[10, 246], [190, 246], [196, 262], [4, 262]], 0.5, 6), C.dustyBlue).out();
    const lampS = sheet().p(c.cut(c.rect(222, 176, 10, 80), 0.3, 5), C.wood2).p(c.cut([[208, 176], [246, 176], [240, 168], [214, 168]], 0.3, 4), C.wood).out();
    const lamp = `${lampS}<g transform="translate(226 168)"><path d="${c.cut([[-14, 0], [-17, -6], [-8, -10], [8, -10], [14, -7], [20, -9], [21, -6], [12, -1]], 0.2, 3)}" fill="${C.pot}"/><g data-k="rflame" transform="translate(20 -8)"><path d="M0 0C-4 -3 -4 -10 0 -17C4 -10 4 -3 0 0Z" fill="${C.lampFlame}"/></g></g>`;
    const mom1 = `<g data-k="mom1">${withFace(person(c, { ...MOTHER, pose: 'sit', eyes: 'closed' }), faceBits(c))}</g>`;
    const mom2 = `<g data-k="mom2">${person(c, { ...MOTHER, pose: 'sit', holdF: `<g transform="rotate(-72) translate(-2 -10) scale(1.3)">${newborn(c)}</g>` })}</g>`;
    const elder = `<g data-k="elder">${person(c, { ...ELDER, pose: 'kneel' })}</g>`;
    const pic = hanging(S.layer({ par: 0.2, sh: 6 }), panel(S, PW, PH, `${bg.out()}${night}${dawnW}${frame}${glowRoom}${mat}${lamp}${elder}${mom1}${mom2}`, { frame: C.wood2 }), { x: JX, y: 165, len: 700 });
    const m1 = S.puppet(S.$('mom1').firstElementChild), m2 = S.puppet(S.$('mom2').firstElementChild), el = S.puppet(S.$('elder').firstElementChild);
    const m1sad = S.$('mom1').querySelector('[data-part="sad"]');
    const wdawn = S.$('wdawn'), rglow = S.$('rglow');

    const peopleL = S.layer({ par: 0.52, sh: 5 });
    const { J, D } = cast(S, peopleL, { gy: GY });

    return (t, time) => {
      const T = time;
      P.update(T);
      /* v20a — rain on them, a feast over the city */
      const rainK = es(t, 0.05, 0.35) * (1 - es(t, 1.2, 1.5));
      const turn = es(t, 1.15, 1.6);
      const cloudK = es(t, -0.1, 0.25);
      cl.forEach((k) => {
        vis(k.el, { x: k.x + (k.i - 1) * turn * 420, y: k.y - turn * 60 - (1 - cloudK) * 500, s: 1, o: (1 - turn) });
        vis(k.rain, { x: k.x + (k.i - 1) * turn * 420, y: k.y + (T ? (T * 60) % 12 : 0), s: 1, o: rainK });
      });
      P.sky.blend(NIGHT, STORM, rainK * 0.6);
      const feast = es(t, 0.3, 0.6) * (1 - es(t, 1.9, 2.2));
      vis(bunting, { x: 0, y: 0, o: feast });
      pops.forEach((p) => {
        const k = ((t * 0.9 + p.i / 9) % 1);
        vis(p.el, { x: p.x, y: 360 - k * 90, s: 0.6 + k * 0.6, o: feast * Math.sin(k * PI) });
      });
      /* v20b — rain turns to petals; warm light */
      petals.forEach((p) => {
        const k = seg(t, 1.2 + p.i * 0.01, 1.95 + p.i * 0.01);
        vis(p.el, { x: p.x + Math.sin(k * 6 + p.i) * 16, y: p.y0 + k * 260 * p.sp, r: k * 200, s: 1, o: k > 0 && k < 1 ? Math.min(1, (1 - k) * 4) * (1 - es(t, 2.0, 2.2)) : 0 });
      });
      warmL.fade(es(t, 1.2, 1.6) * (1 - es(t, 1.95, 2.3)) * 0.8);

      /* v21 — the picture */
      const pin = es(t, 1.95, 2.3, ease.out);
      vis(pic, { x: JX, y: 165 - (1 - pin) * 700, r: 0, o: pin > 0.01 ? 1 : 0 });
      if (pin > 0.01) {
        const born = es(t, 3.05, 3.25);
        const swap = es(t, 3.15, 3.22);
        fade(wdawn, es(t, 3.0, 3.4));
        fade(rglow, 1 - born * 0.4);
        m1.set({ x: 0, y: 264, s: 0.82, o: 1 - swap, armF: 20, armB: 60, head: 14, lean: -6 });
        fade(m1sad, 1);
        m2.set({ x: 0, y: 264, s: 0.82, o: swap, armF: 72, armB: 40, head: 10, lean: -4 });
        const cheer = es(t, 3.3, 3.5);
        el.set({ x: 150, y: 268, s: 0.8, flip: true, armF: 60 - cheer * 10, armB: 20 + cheer * 110, head: -cheer * 6 });
      }

      /* people */
      D.forEach((m) => {
        const d = Math.abs(m.x - JX);
        const joy = es(t, 1.3 + d * 0.0005, 1.5 + d * 0.0005);
        lampK(m, 0.85 - rainK * 0.3 + joy * 0.15, 0, T);
        fade(m.sad, rainK * (1 - joy));
        fade(m.tear, rainK * (m.i % 2) * (1 - joy));
        const look = es(t, 2.1, 2.4);
        put(m, T, { head: rainK * 16 * (1 - joy) - joy * 6 - look * 10, lean: rainK * (m.flip ? -3 : 3) * (1 - joy), armB: 8 + rainK * (m.i % 3 === 0 ? 90 : 0) * (1 - joy) + joy * (m.i % 2 ? 60 : 0) * (1 - look) });
      });
      fade(J.sad, rainK * 0.6);
      put(J, T, { armF: 20 + bump(t, 0.1, 0.9) * 30 + bump(t, 1.1, 1.9) * 50, armB: 10 + bump(t, 1.2, 1.9) * 110, head: -bump(t, 1.2, 1.9) * 6 - es(t, 2.1, 2.4) * 8 });

      S.cam.x = 0;
      S.cam.y = kf(t, [[0, 0], [1.9, 0], [2.4, -70], [4, -70]]);
      S.cam.z = kf(t, [[0, 1.04], [1.9, 1.04], [2.4, 1.14], [4, 1.18]]);
    };
  },
};
