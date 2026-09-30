// Łk 15,25–28 — dusk falling over the farmstead; the courtyard is lit with lanterns and the feast goes on there.
// "Now his elder son was in the field": out in the wheat by the road the elder son, sweating, swings his sickle,
// sheaves standing round him. "As he came near the house, he heard music and dancing": he shoulders a sheaf and
// comes down towards the gateway — and stops: pipe and tambourine, notes floating over the wall, the dancers in the
// lantern light. "He called one of the servants and asked what this meant": a servant boy comes out of the gate
// with a jug and the elder beckons him: "What is this?" "He said to him: 'Your brother has come, and your father has
// killed the fattened calf, because he has received him back safe and sound'": the boy points back into the
// courtyard, and his bubble shows it: the brother home, the calf, the father's heart. "But he was angry and refused
// to go in": the elder's brows come down, he flings the sheaf to the ground and turns his back on the gate, a dark
// little cloud over his head. "His father came out and pleaded with him": the old father comes out of the gateway to
// him with his hands held out.
import { C, person, blinkAt, pose, lerp, sheet, shade, mix } from '../kit.js';
import { sheaf, wheatStalk } from '../../assets/things.js';
import { makeCutter } from '../../core/paper.js';
import {
  farmSet, partyBack, skyFade, FM, FATHER, ELDER_W, BOY, YOUNGER_RAGS, withFace, faceBits, speech, say, calf, heart, figure, jug, bundleStick, glow,
  headP, handP, kf, moving, es, ease, bump, seg, fade, tr, PI, DUSK, NIGHT,
} from './lib.js';
import { sickle } from '../../assets/things.js';

const GY = FM.GY;
const EX = 1120, STOP = 990;

export default {
  id: 'lk15-elder',
  parable: true,
  beats: [
    { v: 25, text: 'Tymczasem starszy jego syn przebywał na polu.' },
    { v: 25, cont: true, text: 'Gdy wracał i był blisko domu, usłyszał muzykę i tańce.' },
    { v: 26 },
    { v: 27 },
    { v: 28, text: 'Na to rozgniewał się i nie chciał wejść;' },
    { v: 28, cont: true, text: 'wtedy ojciec jego wyszedł i tłumaczył mu.' },
  ],
  cam: { x: [60, 320], y: [0, 50], z: [1, 1.12] },
  build(S) {
    const F = farmSet(S, { skyCols: DUSK, sunAt: [1400, 420], tint: 0.2, tintCol: C.duskViolet, lit: 1, lanterns: true });
    const c = F.c;
    const skN = skyFade(S, NIGHT, F.sk.layer, 'night');
    const P = partyBack(S, F);
    const L = F.people;

    /* the wheat field by the road, sheaves standing in it */
    const wheat = F.front;
    let st = '';
    const oc = makeCutter('lk15-wheat');
    for (let i = 0; i < 26; i++) { const x = 1010 + i * 22 + oc.rr(-8, 8); st += `<g transform="translate(${x.toFixed(1)} ${(GY + 18 + oc.rr(-4, 6)).toFixed(1)}) scale(.8)">${wheatStalk(oc, { h: oc.rr(90, 120), color: mix(C.wheat2, C.wheatGreen, 0.2), ear: C.wheat })}</g>`; }
    wheat.add(`<g>${st}</g>`);
    L.add(`<g transform="translate(1290 ${GY - 4}) scale(.9)">${sheaf(c)}</g><g transform="translate(1060 ${GY - 2}) scale(.8)">${sheaf(c)}</g>`);

    /* the elder son: reaping; carrying a sheaf; angry (sheaf flung) */
    const reap = S.puppet(L.add(withFace(person(c, { ...ELDER_W, holdF: `<g transform="rotate(-100) translate(4 -6) scale(.7)">${sickle(c)}</g>` }), faceBits(c))));
    const carry = S.puppet(L.add(withFace(person(c, { ...ELDER_W, holdF: `<g transform="rotate(-30) translate(2 0) scale(.7)">${sickle(c)}</g>` }), faceBits(c))));
    const angry = S.puppet(L.add(withFace(person(c, ELDER_W), faceBits(c))));
    const aBrows = [reap, carry, angry].map((p) => p.el.querySelector('[data-part="angry"]'));
    const flung = L.add(`<g opacity="0">${sheaf(c)}</g>`);
    const boy = S.puppet(L.add(person(c, { ...BOY, holdF: `<g transform="translate(0 4) scale(.8)">${jug(c)}</g>` })));
    const father = S.puppet(L.add(withFace(person(c, FATHER), faceBits(c))));
    const fSad = father.el.querySelector('[data-part="sad"]');
    const sweat = F.fx.add(`<g opacity="0"><path d="${c.cut([[0, 0], [3, 6], [0, 9], [-3, 6]], 0.1, 2)}" fill="#bfe0ee"/></g>`);

    /* words */
    const ask = F.fx.add(`<g opacity="0">${say(c, tr('Co to ma znaczyć?', 'What is going on?'), { size: 20, side: -1 })}</g>`);
    const bo = makeCutter('lk15-boy-news');
    const newsInner = `<text x="0" y="-30" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="19" font-style="italic" fill="${C.ink}">${tr('Twój brat powrócił!', 'Your brother has come!')}</text>`
      + figure(bo, { ...YOUNGER_RAGS }, { x: -58, y: 34, s: 0.26, flip: true })
      + `<g transform="translate(6 32) scale(.42)">${calf(bo)}</g>`
      + `<g transform="translate(66 12)">${heart(bo, 12)}</g>`;
    const news = F.fx.add(`<g opacity="0">${speech(c, newsInner, { w: 220, h: 116, flip: false })}</g>`);
    const cloudy = F.fx.add(`<g opacity="0"><path d="${c.cut(c.blob(0, 0, 34, 18, 12, 0.25), 1, 5)}" fill="${C.storm2}"/><path d="${c.cut(c.blob(-16, 4, 18, 10, 10, 0.25), 0.8, 4)}" fill="${shade(C.storm2, -0.2)}"/></g>`);
    const plead = F.fx.add(`<g opacity="0">${say(c, tr('Synu, wejdź…', 'My son, come in…'), { size: 19, side: 1 })}</g>`);

    return (t, time) => {
      const T = time;
      F.update(T, { glowO: 0.5, sway: false });
      skN.fade(es(t, 1.6, 2.6));
      P.update(t, T, 1, es(t, 1.2, 1.5));

      /* v25a — in the field, reaping */
      const swing_ = Math.sin(t * PI * 6);
      const inField = 1 - seg(t, 1.0, 1.04);
      reap.set({ x: EX, y: GY, s: 1.02, flip: true, o: inField, armF: 60 + swing_ * 30, armB: 20, lean: 10 + swing_ * 4, head: 10, blink: blinkAt(T, 2) });
      pose(sweat, { x: EX - 20, y: GY - 176 + ((t * 3) % 1) * 20, o: inField * bump((t * 3) % 1, 0, 1) });

      /* v25b — carrying a sheaf, near the house he hears the music and stops */
      const CK = [[1.04, EX], [1.5, STOP]];
      const cx = kf(t, CK);
      const hear = es(t, 1.55, 1.7);
      const beckon = bump(t, 2.1, 2.9);
      const carrying = seg(t, 1.0, 1.04) * (1 - seg(t, 4.08, 4.12));
      carry.set({ x: cx, y: GY, s: 1.02, flip: true, o: carrying, walk: moving(t, CK) ? cx * 0.06 : undefined, armF: 20, armB: 10 + beckon * 150, head: -hear * 10 + es(t, 3.2, 3.5) * 6, blink: blinkAt(T, 2) });
      fade(aBrows[1], es(t, 3.5, 3.9));

      /* v26 — he calls a servant boy and asks */
      const BK = [[2.02, FM.GATE], [2.3, 900]];
      const bx = kf(t, BK);
      boy.set({ x: bx, y: GY, s: 0.66, o: es(t, 2.0, 2.04), walk: moving(t, BK) ? bx * 0.09 : undefined, armF: 30 + bump(t, 3.05, 3.9) * 20, armB: 10 + bump(t, 3.05, 3.9) * 110, head: -8, blink: blinkAt(T, 6) });
      const [ehx, ehy] = headP(STOP, GY, 1.02, true);
      const ak = es(t, 2.2, 2.34, ease.back) * (1 - es(t, 2.9, 3.0));
      pose(ask, { x: ehx - 20, y: ehy - 30, s: Math.max(0.001, ak), o: ak > 0.01 ? 1 : 0 });
      /* v27 — the boy tells him */
      const [bhx, bhy] = headP(900, GY, 0.66);
      const nk = es(t, 3.06, 3.22, ease.back) * (1 - es(t, 3.92, 4.0));
      pose(news, { x: bhx + 14, y: bhy - 12, s: Math.max(0.001, nk), o: nk > 0.01 ? 1 : 0 });

      /* v28a — angry; the sheaf flung down; he turns his back */
      const fl = es(t, 4.08, 4.24);
      pose(flung, { x: lerp(STOP + 20, STOP + 70, fl), y: lerp(GY - 150, GY - 2, fl), r: fl * 80, s: 0.8, o: seg(t, 4.06, 4.1) });
      const turn = es(t, 4.24, 4.34);
      angry.set({ x: STOP + turn * 40, y: GY, s: 1.02, flip: turn < 0.5, o: seg(t, 4.08, 4.12), armF: 20 + (1 - turn) * 40, armB: 20, head: turn > 0.5 ? 12 : -6, lean: turn * 4, blink: blinkAt(T, 2) });
      fade(aBrows[2], 1);
      const [ahx, ahy] = headP(STOP + 40, GY, 1.02);
      pose(cloudy, { x: ahx + 6, y: ahy - 46 + (T ? Math.sin(T * 1.5) * 3 : 0), s: es(t, 4.2, 4.4, ease.back), o: es(t, 4.2, 4.3) });

      /* v28b — the father comes out and pleads with him */
      const FK = [[5.04, FM.GATE - 20], [5.4, 930]];
      const fx = kf(t, FK);
      const hands = es(t, 5.4, 5.6);
      father.set({ x: fx, y: GY, s: 1.02, o: es(t, 5.0, 5.06), walk: moving(t, FK) ? fx * 0.07 : undefined, armF: 30 + hands * 40, armB: 20 + hands * 60, lean: hands * 8, head: hands * 6, blink: blinkAt(T) });
      fade(fSad, hands * 0.7);
      const [fhx, fhy] = headP(930, GY, 1.02);
      const pk = es(t, 5.5, 5.64, ease.back);
      pose(plead, { x: fhx + 10, y: fhy - 40, s: Math.max(0.001, pk * 0.9), o: pk > 0.01 ? 1 : 0 });

      S.cam.x = kf(t, [[0, 300], [1.0, 300], [1.6, 160], [2.2, 180], [4.0, 180], [5.0, 170], [5.6, 150]]);
      S.cam.y = kf(t, [[0, 30], [6, 30]]);
      S.cam.z = kf(t, [[0, 1.1], [1.0, 1.1], [1.7, 1.02], [2.4, 1.08], [4.2, 1.1], [5.4, 1.06]]);
    };
  },
};
