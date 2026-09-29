// Mt 16,22–23 — on the road to Jerusalem at evening (the city small on its far hill, a signpost by the way). Peter
// hurries up, takes Jesus by the arm and draws Him aside: "Far be it from you, Lord!" — then plants himself in the road
// between Him and the city with his arms spread wide: "This will never happen to you!" Jesus turns: "Get behind me,
// Satan!" — the tempter's dark shadow, risen behind Peter, shrinks away into the ground under His raised hand, and Peter
// steps back behind Him. "You are a stumbling block to me": where Peter stood, a stone rolls into the road; over Jesus
// hangs the plate of the things of God (the cross in the dawn light), over Peter the plate of the things of men (a crown
// and coins), and it greys.
import { C, person, CAST, blinkAt, pose, lerp, sky, sheet, shade, mix } from '../kit.js';
import { band, hillsWith, olive, cypress, bush, rock, grass, sun } from '../../assets/nature.js';
import { es, ease, bump } from '../../core/anim.js';
import { kf, moving, headAt, say, speech, GLYPH, walledCity, signpost, shadowPerson, tempterAura, TEMPTER, crown, coin, plateCard, hangAt, hanging, GOLDEN, tr } from './lib.js';

const GY = 684, JX = 790;
const REST = [{ o: CAST.john, x: 430 }, { o: CAST.andrew, x: 370 }, { o: CAST.james, x: 490 }, { o: CAST.matthew, x: 310 }, { o: CAST.thomas, x: 550 }];

export default {
  id: 'mt16-rebuke',
  beats: [
    { v: 22, text: 'A Piotr wziął Go na bok i począł robić Mu wyrzuty: «Panie, niech Cię Bóg broni!' },
    { v: 22, cont: true, text: 'Nie przyjdzie to nigdy na Ciebie».' },
    { v: 23, text: 'Lecz On odwrócił się i rzekł do Piotra: «Zejdź Mi z oczu, szatanie!' },
    { v: 23, cont: true, text: 'Jesteś Mi zawadą, bo myślisz nie na sposób Boży, lecz na ludzki».' },
  ],
  cam: { x: [-40, 40], y: [-80, 40], z: [1, 1.14] },
  build(S) {
    const c = S.c;
    const sk = sky(S, GOLDEN);
    const hangL = S.layer({ par: 0.04, sh: 5 });
    const sunEl = hanging(hangL, sun(c, 46, { rays: C.sunDeep, disc: '#f0a868', inner: '#f5c08a' }), { x: 1300, y: 330, len: 900 });

    /* ---------- the land, the far city, the road ---------- */
    S.layer({ par: 0.08, sh: 2 }).add(band(c, { y: 450, amps: [16, 7, 3], lens: [1100, 380, 140], color: mix(C.hillFar, C.dusk, 0.25) }).markup);
    const hills = S.layer({ par: 0.16, sh: 2 });
    const h2 = hillsWith(c, { y: 500, amps: [14, 6, 2], lens: [900, 300, 110], color: mix(C.hillMid, C.dune, 0.2), trees: 14, treeColor: C.olive, treeH: 20 });
    hills.add(h2.markup + walledCity(c, 1250, h2.fn(1250) + 4, 0.8));
    const groundL = S.layer({ par: 0.4, sh: 3 });
    const gfn = c.wave(GY - 60, [4, 2], [600, 160]);
    groundL.add(sheet().p(c.ridge(gfn, -900, 2500, 1700, 12, 1), mix(C.sand, C.dune, 0.2)).out());
    groundL.add(sheet().p(c.ribbon(c.cbez([200, 760], [700, 700], [1000, 640], [1260, 560], 24), (u) => 120 - u * 100), mix(C.sand, C.cream, 0.35)).out());
    groundL.add(grass(c, { x0: -600, x1: 2200, y: GY - 60, fn: gfn, n: 30, h: 12, color: C.olive }) + olive(c, 250, GY - 56, 1) + cypress(c, 1380, GY - 54, 170));
    groundL.add(`<g transform="translate(1070 ${GY - 20})">${signpost(c, tr('Jerozolima', 'Jerusalem'), { size: 19, dir: 1 })}</g>`);

    /* ---------- the plates of the things of God and of men ---------- */
    const plL = S.layer({ par: 0.12, sh: 7 });
    const godIcon = `<circle r="38" fill="url(#halo-glow)"/><path d="${c.poly(c.star(0, 6, 34, 20, 12, 0))}" fill="${C.sun}" opacity=".8"/><path d="${c.cut([[-4, -30], [4, -30], [4, 30], [-4, 30]], 0.2, 4) + c.cut([[-18, -14], [18, -14], [18, -7], [-18, -7]], 0.2, 4)}" fill="${C.wood2}"/>`;
    const manIcon = `<g transform="translate(0 4)">${crown(c, 44)}</g><g transform="translate(-30 22)">${coin(c, 9)}</g><g transform="translate(30 22)">${coin(c, 9)}</g><g transform="translate(18 30)">${coin(c, 8)}</g>`;
    const godP = plL.add(`<g><path d="M-50 0V-1500M50 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${plateCard(c, godIcon, tr('co Boże', 'the things of God'), { w: 170, h: 136, face: C.halo })}</g>`);
    const manP = plL.add(`<g><path d="M-50 0V-1500M50 0V-1500" stroke="rgba(74,54,34,.55)" stroke-width="1.2"/>${plateCard(c, manIcon, tr('co ludzkie', 'the things of men'), { w: 170, h: 136, face: C.stone })}</g>`);
    const greyP = plL.add(`<g><rect x="-85" y="0" width="170" height="136" fill="${C.storm2}" opacity=".4"/></g>`);

    /* ---------- people ---------- */
    const P = S.layer({ par: 0.5, sh: 5 });
    const shadowEl = P.add(`<g>${tempterAura(c, 150)}<g opacity=".82">${shadowPerson(c, TEMPTER, '#2b2640')}</g></g>`);
    const rest = REST.map((d, i) => ({ ...d, i, p: S.puppet(P.add(person(c, d.o))), seed: c.rr(0, 9) }));
    const stone = P.add(`<g>${sheet().p(c.cut(c.blob(0, -30, 38, 30, 12, 0.14), 0.8, 5), C.rock2).x(c.ribbon([[-14, -34], [6, -40]], 2), shade(C.rock2, 0.3), 'opacity=".6"').out()}</g>`);
    const jesus = S.puppet(P.add(person(c, { ...CAST.jesus })));
    const peter = S.puppet(P.add(person(c, CAST.peter)));
    const fx = S.layer({ par: 0.5, sh: 4 });
    const say1 = fx.add(`<g>${say(c, tr('Panie, niech Cię Bóg broni!', 'Far be it from you, Lord!'), { size: 20, side: 1 })}</g>`);
    const say2 = fx.add(`<g>${say(c, tr('Nigdy!', 'Never!'), { size: 26, side: 1, bold: true })}</g>`);
    const bang = fx.add(`<g>${speech(c, GLYPH.bang(c), { w: 40, h: 40, flip: true })}</g>`);
    const fg = S.layer({ par: 0.95, sh: 6 });
    fg.add(bush(c, 120, 900, 220, '#8fa58a', C.moss) + rock(c, 1480, 920, 240, 90, C.rock2));

    return (t, time) => {
      const T = time;
      sk.blend(GOLDEN, ['#b49cb4', '#ecb898', '#f6d7ae'], es(t, 0, 4));
      pose(sunEl, { x: 1300, y: 330 + es(t, 0, 4) * 60, r: T ? Math.sin(T * 0.6) : 0 });

      /* Jesus walks on toward the city; is drawn aside; turns */
      const JK = [[0, 700], [0.35, JX], [0.5, JX], [0.8, JX - 40]];
      const jx = kf(t, JK);
      const jw = moving(t, JK, 1);
      const turned = es(t, 2.02, 2.12);
      const command = es(t, 2.1, 2.3) * (1 - es(t, 2.92, 3.05));
      const firm = es(t, 3.05, 3.3);
      const toPeterSide = t < 1.05 ? t > 0.45 : t < 2.05;   // looking at Peter (left, then right)
      jesus.set({
        x: jx, y: GY, s: 1, flip: t < 0.45 ? false : t < 1.05 ? true : turned > 0.5 ? true : false, walk: jw ? jx * 0.05 : undefined,
        armF: 16 + (t > 0.4 && t < 1 ? 20 : 0) + command * 70 + firm * 20, armB: 8 + command * 60 + firm * 40, head: toPeterSide ? 4 : -command * 6, blink: blinkAt(T),
      });
      /* Peter: hurries up, takes His arm, pulls aside; blocks the road; steps behind Him */
      const PK = [[0.05, 560], [0.4, JX - 90], [0.5, JX - 90], [0.8, JX - 120], [1.05, JX - 120], [1.35, JX + 110], [2.3, JX + 110], [2.65, JX - 150]];
      const px = kf(t, PK);
      const pw = moving(t, PK, 1);
      const scold = es(t, 0.45, 0.6) * (1 - es(t, 0.95, 1.05));
      const block = es(t, 1.3, 1.45) * (1 - es(t, 2.12, 2.3));
      const ashamed = es(t, 2.4, 2.7);
      const pFlip = t < 1.35 ? false : t < 2.65 ? true : false;
      peter.set({
        x: px, y: GY + 8, s: 0.96, flip: pFlip, walk: pw ? px * 0.05 : undefined,
        armF: 20 + scold * (60 + (T ? Math.sin(T * 8) * 18 : 0)) + block * 70 - ashamed * 4, armB: 10 + scold * 30 + block * 80,
        head: -scold * 6 - block * 4 + ashamed * 20, lean: ashamed * 6, blink: ashamed > 0.5 ? 0.6 : blinkAt(T, 2),
      });
      const [phx, phy] = headAt(px, GY + 8, 0.96, pFlip);
      const s1 = es(t, 0.5, 0.65, ease.back) * (1 - es(t, 0.98, 1.03));
      pose(say1, { x: phx + 6, y: phy - 36, s: s1, o: s1 > 0.02 ? 1 : 0 });
      const s2 = es(t, 1.45, 1.6, ease.back) * (1 - es(t, 1.98, 2.03));
      pose(say2, { x: phx - 6, y: phy - 36, s: s2, o: s2 > 0.02 ? 1 : 0 });
      const bk = es(t, 0.52, 0.64, ease.back) * (1 - es(t, 0.98, 1.03));
      pose(bang, { x: phx + 30, y: phy - 110, s: bk * 0.9, o: bk > 0.02 ? 1 : 0 });

      /* v23a — the tempter's shadow behind Peter, driven down into the ground */
      const loom = es(t, 1.75, 2.05) * (1 - es(t, 2.82, 3.0));
      pose(shadowEl, { x: JX + 190, y: GY + 4 + (1 - loom) * 40, s: 1.05 * (0.6 + loom * 0.4), sy: 0.4 + loom * 0.6, o: loom * 0.95 });

      /* the others watch from behind */
      rest.forEach((d) => {
        const alarm = bump(t, 1.9, 2.8);
        d.p.set({ x: d.x + es(t, 0, 0.4) * 30, y: GY + 4 + (d.i % 2) * 8, s: 0.86, flip: false, armF: 16 + alarm * 40, armB: 8 + alarm * 30, head: -alarm * 6, lean: -alarm * 3, blink: blinkAt(T, d.seed) });
      });

      /* v23b — a stone rolls into the road where Peter stood; the two plates */
      const roll = es(t, 3.02, 3.3, ease.out);
      pose(stone, { x: lerp(1080, JX + 150, roll), y: GY - 16, r: -roll * 200, o: roll > 0.01 ? 1 : 0 });
      const pg = es(t, 3.2, 3.5, ease.back);
      const pm = es(t, 3.3, 3.6, ease.back);
      hangAt(godP, JX + 70, 200 - (1 - pg) * 800, T, 1, 0.8, 1);
      hangAt(manP, JX - 180, 215 - (1 - pm) * 800, T, 1, 0.8, 2);
      const gr = es(t, 3.55, 3.75);
      pose(greyP, { x: JX - 180, y: 215 - (1 - pm) * 800, r: T ? Math.sin(T * 0.7 + 2) * 1.2 : 0, o: gr });

      S.cam.x = -20 + es(t, 1.0, 1.4) * 30;
      S.cam.z = 1.06 + es(t, 0.3, 0.6) * 0.04 - es(t, 3.0, 3.4) * 0.06;
      S.cam.y = 10 + es(t, 0.3, 0.6) * 20 - es(t, 3.0, 3.4) * 20;
    };
  },
};
