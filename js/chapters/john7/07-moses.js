// J 7,19–20 — still in the Temple court. "Did not Moses give you the Law?" — a painted panel comes down: Moses on
// Sinai lifting the two tablets in a blaze of light. "Yet none of you keeps the Law": the tablets swing forward and
// one line glows — "You shall not kill" — while the leaders on the right hide stones behind their backs.
// "Why do you seek to kill me?" — the stones are seen. The crowd shouts back in a dark jagged bubble: "You have a
// demon! Who seeks to kill you?" — and the stones vanish behind their backs again.
import { C, person, CAST, blinkAt, pose, lerp, hanging, sheet, shade, mix } from '../kit.js';
import { seg, es, ease, bump, fade } from '../../core/anim.js';
import { bubble as bubble5 } from '../mark5/lib.js';
import { LOOK as L12 } from '../mark12/lib.js';
import {
  feastCourt, PH, pilgrim, townMan, townWoman, headAt, hand, voiceRings, strip, rayBurst, hangAt, vpose, FEAST, tr, PI,
} from './lib.js';

const JX = 800;
const LX = [1000, 1086, 1170];

/** a small stone held in the back hand (hold coords) */
function stoneHeld(c) { return `<g transform="translate(1 8)">${sheet().p(c.cut(c.blob(0, 0, 10, 8, 9, 0.2), 0.5, 3), C.rock2).x(c.poly(c.ell(-3, -3, 3, 2, 6)), C.stone, 'opacity=".7"').out()}</g>`; }
/** the two tablets with lettering: the commandments as numerals; the fifth (by Catholic count) is written out */
function tablets(c, w = 84, h = 118) {
  const col = mix(C.stone, C.rock, 0.45), ink = shade(col, -0.6);
  const s = sheet();
  const one = (x0) => c.cut([[x0, 0], [x0, -h + w / 2], ...c.arc(x0 + w / 2, -h + w / 2, w / 2, w / 2, PI, 2 * PI, 12), [x0 + w, 0]], 0.8, 6);
  s.p(one(-w - 4) + one(4), col);
  const T = (x, y, t, size = 13) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="${size}" fill="${ink}">${t}</text>`;
  let txt = '';
  ['I', 'II', 'III', 'IV'].forEach((n, i) => { txt += T(-w / 2 - 4, -h + 46 + i * 17, n); });
  ['VI', 'VII', 'VIII', 'IX', 'X'].forEach((n, i) => { txt += T(w / 2 + 4, -h + 60 + i * 12, n, 11); });
  const kill = `<g class="kill">${T(w / 2 + 4, -h + 44, tr('nie zabijaj', 'do not kill'), 12.5)}</g>`;
  const glow = `<g class="killGlow" opacity="0"><ellipse cx="${w / 2 + 4}" cy="${-h + 40}" rx="${w * 0.62}" ry="16" fill="#fff3cf"/><circle cx="${w / 2 + 4}" cy="${-h + 40}" r="${w}" fill="url(#halo-glow)"/></g>`;
  return s.out() + glow + txt + kill;
}

export default {
  id: 'j7-moses',
  beats: [
    { v: 19, text: 'Czyż Mojżesz nie dał wam Prawa?' },
    { v: 19, cont: true, text: 'A przecież nikt z was nie zachowuje Prawa,' },
    { v: 19, cont: true, text: '[bo] czemuż usiłujecie Mnie zabić?»' },
    { v: 20 },
  ],
  cam: { x: [-40, 40], y: [-60, 40], z: [1, 1.16] },
  build(S) {
    const c = S.c;
    const set = feastCourt(S, { skyCols: FEAST });
    const F = set.F + 20;

    /* people: the crowd on the left, Jesus, the leaders with hidden stones on the right */
    const P = S.layer({ par: 0.5, sh: 5 });
    const crowdL = [[400, 0], [470, 1], [540, 2], [600, 3]].map(([x, i]) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(i === 1 ? person(c, townWoman(c)) : i === 3 ? pilgrim(c, 7, { lulavA: 60 }) : person(c, townMan(c)))) }));
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const voice = voiceRings(P, c, { n: 3, r: 30, w: 4 });
    const leaders = LX.map((x, i) => ({ x, i, seed: c.rr(0, 9), p: S.puppet(P.add(person(c, { ...PH(c, i), holdB: stoneHeld(c) }))) }));
    set.front();

    /* the Sinai panel and the tablets */
    const X = S.layer({ par: 0.5, sh: 6 });
    const PW = 330, PH_ = 220;
    const panel = (() => {
      const s = sheet();
      s.p(c.cut([[-PW / 2 - 12, -12], [PW / 2 + 12, -14], [PW / 2 + 14, PH_ + 12], [-PW / 2 - 14, PH_ + 12]], 0.6, 10), C.wood3);
      s.p(c.cut([[-PW / 2, 0], [PW / 2, 0], [PW / 2, PH_], [-PW / 2, PH_]], 0.5, 10), mix(C.dawn, C.parchment, 0.4));
      s.p(c.cut([[-PW / 2, PH_], [-PW / 2, 180], [-100, 168], [-34, 130], [0, 118], [34, 132], [96, 164], [PW / 2, 174], [PW / 2, PH_]], 1, 8), mix(C.rock, C.dune, 0.4));
      s.p(c.cut([[-34, 130], [0, 118], [34, 132], [12, 146], [-14, 142]], 0.6, 5), shade(C.rock, 0.2));
      s.p(c.cut([[-PW / 2, PH_], [-PW / 2, 196], [PW / 2, 190], [PW / 2, PH_]], 0.8, 8), mix(C.sand, C.dune, 0.4));
      const moses = `<g transform="translate(0 122) scale(.46)">${person(c, { ...L12.moses }).replace('class="armFr"', 'class="armFr" transform="rotate(-128)"').replace('class="armBr"', 'class="armBr" transform="rotate(-165)"')}</g>`;
      const tabs = `<g transform="translate(24 40) scale(.24)">${tablets(c)}</g>`;
      return `<path d="M${-PW * 0.35} -1400V-12M${PW * 0.35} -1400V-12" stroke="rgba(74,54,34,.55)" stroke-width="1.2" fill="none"/>${s.out()}<g transform="translate(8 40)">${rayBurst(c, { n: 16, r0: 20, r1: 110, spread: 0.06, color: '#fff3cf', o: 0.8 })}</g>${moses}${tabs}`;
    })();
    const panelEl = X.add(`<g>${panel}</g>`);
    const panelT = X.add(`<g>${strip(c, tr('Mojżesz dał wam Prawo', 'Moses gave you the Law'), { size: 17 })}</g>`);
    const tabEl = hanging(X, `<g transform="scale(1.3)">${tablets(c)}</g>`, { x: 800, y: 300, len: 700 });
    const killGlow = tabEl.querySelector('.killGlow');
    const keepT = X.add(`<g>${strip(c, tr('nikt nie zachowuje Prawa', 'none of you keeps the Law'), { size: 17 })}</g>`);
    const why = X.add(`<g>${bubble5(c, tr(['Czemu chcecie', 'Mnie zabić?'], ['Why do you seek', 'to kill me?']), { size: 20, dir: -1 })}</g>`);
    const demon = X.add(`<g>${bubble5(c, tr(['Masz złego ducha!', 'Któż chce Cię zabić?'], ['You have a demon!', 'Who seeks to kill you?']), { size: 20, dir: 1, jag: true, fill: '#4a3f52', ink: C.cream })}</g>`);

    return (t, time) => {
      const T = time;
      set.update(t, T, { lit: 0.2 });

      /* Jesus */
      const speak = 1 - es(t, 2.95, 3.1);
      jesus.set({ x: JX, y: F, s: 1.04, flip: t > 1.9 && t < 3.0, armF: 22 + speak * 26 + bump(t, 0.1, 0.9) * 40 + bump(t, 1.1, 1.9) * 30 + bump(t, 2.1, 2.9) * 50, armB: 10 + bump(t, 0.2, 0.9) * 100, head: -bump(t, 0.1, 0.9) * 8 + bump(t, 3.2, 3.9) * 6, blink: blinkAt(T, 1) });
      const [hx, hy] = headAt(JX, F, 1.04, t > 1.9 && t < 3.0);
      voice(hx, hy + 4, speak * 0.8, T, { spread: 1.6 });

      /* v19a — the Sinai panel */
      const pk = es(t, 0.05, 0.4, ease.out), pu = es(t, 0.95, 1.15, ease.in);
      const py = lerp(-360, 170, pk) - pu * 700;
      vpose(panelEl, { x: 660, y: py, r: Math.sin(T * 0.7) * 0.6, o: pk > 0 && pu < 1 ? 1 : 0 });
      vpose(panelT, { x: 660, y: py + PH_ + 34, o: pk > 0 && pu < 1 ? seg(t, 0.35, 0.45) : 0 });

      /* v19b — the tablets swing forward; "do not kill" glows */
      const tk = es(t, 1.05, 1.4, ease.out), tu = es(t, 2.9, 3.1, ease.in);
      hangAt(tabEl, 800, lerp(-400, 410, tk) - tu * 800, T, tk > 0 && tu < 1 ? 1 : 0, 1, 0.8, 1);
      fade(killGlow, es(t, 1.45, 1.7) * (0.7 + Math.sin(T * 3) * 0.15));
      vpose(keepT, { x: 800, y: 440, o: es(t, 1.5, 1.6) * (1 - es(t, 1.95, 2.05)) });

      /* the crowd and the leaders */
      const shown = es(t, 2.15, 2.35) * (1 - es(t, 3.35, 3.5));
      leaders.forEach((m) => m.p.set({ x: m.x, y: F + (m.i % 2) * 6, s: 0.98, flip: true, armF: 24 + bump(t, 1.1, 1.8) * 20 * (m.i === 0 ? 1 : 0), armB: lerp(4, 72, shown), head: bump(t, 2.1, 2.9) * 8 - bump(t, 3.2, 3.9) * 4, lean: shown * -2, blink: blinkAt(T, m.seed) }));
      const [wx, wy] = headAt(JX, F, 1.04, true);
      vpose(why, { x: wx + 10, y: wy - 24, s: es(t, 2.1, 2.3, ease.back), o: seg(t, 2.1, 2.15) * (1 - es(t, 2.95, 3.05)) });
      const shout = es(t, 3.05, 3.25);
      crowdL.forEach((m) => m.p.set({ x: m.x, y: F + 6 + (m.i % 2) * 6, s: 0.95, armF: m.i === 3 ? 60 : 16 + shout * (m.i === 0 ? 80 : m.i === 2 ? 60 : 20), armB: 10 + shout * (m.i === 2 ? 60 : 0), head: -shout * 6, lean: shout * 4, blink: blinkAt(T, m.seed) }));
      const [cx, cy] = headAt(470, F + 12, 0.95, false);
      vpose(demon, { x: cx + 30, y: cy - 20, s: es(t, 3.1, 3.3, ease.back), o: seg(t, 3.1, 3.15) });

      S.cam.y = 30 - bump(t, 0, 1.2) * 40;
      S.cam.z = 1.12 - bump(t, 0, 1.2) * 0.05;
    };
  },
};
