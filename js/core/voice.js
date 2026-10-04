// The narrator: reads the chapter aloud in step with the theatre, with optional music underneath.
//
// Listening, the voice leads: each sentence's clip plays and the theatre scrolls itself at the pace of
// the reading, the caption's words appearing (and the spoken one inked) as they are said.
// The reader can take the scroll back at any moment; scrolling is a scrubber, never a fight:
//   · while they scroll, the narrator steps aside: the sentence being read carries on as long as they
//     stay inside it, and fades out the moment they leave it (nothing is read during a fast fling);
//   · when they stop, it reads the sentence they stopped on from its first word, and carries on from there;
//   · scrolling back works the same way: the sentence they land on is read again from its start. Speech is
//     never played backwards, and the picture is never pulled back by the narrator. It holds still until
//     the reading catches up with it.
// ← / → and taps on the left / right thirds skip sentences in the reading (prev replays the current one
// if it is more than two seconds in). Muting the voice keeps the pace, like subtitles; music is separate.
import { makeMusic } from './music.js';

const SETTLE = 450;        // ms of stillness before the narrator picks up where the reader stopped
const LEAD = 0.12;         // s of quiet before a sentence
const TAIL = { stop: 0.7, comma: 0.3 }; // s after it, by how it ends
const SCENE_GAP = 1.7;     // s for the change of set between two scenes
const COVER_HOLD = 2.4;    // s for a picture-only beat
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (x) => x * x * (3 - 2 * x);

const T = {
  pl: { listen: 'Posłuchaj', resume: 'Słuchaj dalej', pause: 'Pauza', play: 'Czytaj na głos', prev: 'Poprzednie zdanie', next: 'Następne zdanie', voice: 'Lektor', music: 'Muzyka', label: 'Lektor i muzyka' },
  en: { listen: 'Listen', resume: 'Keep listening', pause: 'Pause', play: 'Read aloud', prev: 'Previous sentence', next: 'Next sentence', voice: 'Narrator', music: 'Music', label: 'Narrator and music' },
};
const ICON = {
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  pause: '<path d="M8 5.5v13M16 5.5v13" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  prev: '<path d="M6.5 6v12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M18 6.5v11L9.5 12z" fill="currentColor"/>',
  next: '<path d="M17.5 6v12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M6 6.5v11l8.5-5.5z" fill="currentColor"/>',
  voice: '<path d="M4.5 9.5h3l4.5-4v13l-4.5-4h-3z" fill="currentColor"/><path class="on" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path class="off" d="M15.5 9.5l5 5m0-5l-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  music: '<path d="M9.5 17.5V6.5l9-2v10.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><ellipse cx="7.5" cy="17.5" rx="2.6" ry="2.1" fill="currentColor"/><ellipse cx="16.5" cy="15" rx="2.6" ry="2.1" fill="currentColor"/><path class="off" d="M4 4l16 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
};
const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
const pref = (k, d) => { try { const v = localStorage.getItem('narrator.' + k); return v === null ? d : v === '1'; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem('narrator.' + k, v ? '1' : '0'); } catch (e) { /* storage blocked */ } };
const level = (k, d) => { try { const v = parseFloat(localStorage.getItem('narrator.' + k)); return Number.isFinite(v) ? clamp(v) : d; } catch (e) { return d; } };
const saveLevel = (k, v) => { try { localStorage.setItem('narrator.' + k, v.toFixed(2)); } catch (e) { /* storage blocked */ } };

export async function startNarrator(theatre, { book, ch, lang, title }) {
  const base = `audio/${book}/${ch}/`;
  let man;
  try { const r = await fetch(`${base}${lang}.json`); if (!r.ok) return null; man = await r.json(); } catch (e) { return null; }
  const beats = theatre.beats;
  if (man.beats.length !== beats.length) { console.warn('narration is out of date for this chapter; run tools/voice.mjs'); return null; }
  const idx = new Map(beats.map((b, i) => [b, i]));
  document.documentElement.classList.add('narrated'); // makes room for the mixer (style.css)
  const L = T[lang] || T.en;
  const last = beats[beats.length - 1];

  // how long each beat lasts when read: quiet + speech + a pause fitting its last punctuation
  const plan = man.beats.map((c, i) => {
    const b = beats[i];
    if (b.cover) return c.dur ? c.dur + LEAD + 2.2 : COVER_HOLD;
    const words = b.segs.flatMap((s) => s.text.trim().split(/\s+/));
    const dur = c.dur || words.length * 0.4;
    return LEAD + dur + (/[.?!»”’]$/.test(words[words.length - 1] || '') ? TAIL.stop : TAIL.comma);
  });

  /* ---------- state ---------- */
  let mode = 'idle';                   // idle (never started) · playing · paused · ended
  let voiceOn = pref('voice', true), musicOn = pref('music', true);
  let voiceVol = level('voiceVol', 1), musicVol = level('musicVol', 0.7); // the sliders
  let ctx = null, voiceBus = null, music = null;
  let cur = null;                      // { k, gap, t0, from, holdG, landedP, src, gain, silenced }
  let userAt = -1e9, lastP = 0, scrubbing = false;
  const setYs = [];                    // the narrator's own recent scroll positions (their scroll events arrive a frame late)
  const buffers = new Map();
  const clock = () => ctx.currentTime;

  function unlock() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* older Safari */ }
    voiceBus = ctx.createGain();
    voiceBus.gain.value = voiceOn ? voiceVol : 0;
    voiceBus.connect(ctx.destination);
    music = makeMusic(ctx, ctx.destination);
    music.volume(musicVol);
    if (musicOn) music.start();
  }
  function load(k) {
    const c = man.beats[k];
    if (!c || !c.file) return null;
    if (!buffers.has(k)) {
      const p = fetch(`${base}${lang}/${c.file}`).then((r) => r.arrayBuffer()).then((a) => ctx.decodeAudioData(a)).catch(() => null);
      buffers.set(k, p);
    }
    return buffers.get(k);
  }
  function preload(k) {
    for (let j = k; j <= k + 3 && j < beats.length; j++) load(j);
    for (const j of buffers.keys()) if (j < k - 3 || j > k + 8) buffers.delete(j);
  }

  /* ---------- voice ---------- */
  function stopVoice(fade = 0.1) {
    if (!cur || !cur.src) return;
    const { src, gain } = cur, t = clock();
    gain.gain.cancelScheduledValues(t);
    gain.gain.setTargetAtTime(0, t, fade / 3);
    try { src.stop(t + fade); } catch (e) { /* already stopped */ }
    cur.src = null;
    music?.duck(false);
  }
  function speak(c, offset) {
    const k = c.k;
    const p = load(k);
    if (!p) return;
    p.then((buf) => {
      if (!buf || cur !== c || mode !== 'playing' || c.src) return;
      const src = ctx.createBufferSource(), gain = ctx.createGain();
      src.buffer = buf; src.connect(gain); gain.connect(voiceBus);
      // play from where the schedule is now: late buffers skip nothing but the quiet lead
      const at = clock() - c.t0 - LEAD + offset;
      if (at > buf.duration - 0.05) return;
      if (at < 0) src.start(clock() - at); else src.start(clock(), at);
      src.onended = () => { if (cur === c && c.src === src) { c.src = null; music?.duck(false); } };
      c.src = src; c.gain = gain;
      if (voiceOn) music?.duck(true);
    });
  }
  // start reading beat k; `landed` = the reader put us here, so keep the picture where they left it
  function startBeat(k, { landed = false } = {}) {
    stopVoice(0.08);
    cur = { k, t0: clock(), holdG: landed ? theatre.g : -1, landedP: landed ? lastP : 0 };
    preload(k);
    speak(cur, 0);
    setMood(k);
    media();
  }
  function startGap(k) {
    stopVoice(0.2);
    cur = { k, gap: true, t0: clock(), from: theatre.g };
    preload(k);
  }
  function next() {
    const k = cur.k + 1;
    if (k >= beats.length) return end();
    if (beats[k].sid !== beats[cur.k].sid) startGap(k); else startBeat(k);
  }
  function end() {
    stopVoice(0.3);
    cur = { k: beats.length - 1, gap: true, t0: clock(), from: theatre.g, ending: true };
  }

  /* ---------- the drive: the reading moves the theatre ---------- */
  function driveTo(gv) {
    // rounded up, so the position never falls a pixel short into the previous sentence
    const y = Math.ceil(gv * theatre.unitPx());
    if (Math.abs(y - scrollY) >= 1) { setYs.push(y); if (setYs.length > 6) setYs.shift(); scrollTo(0, y); }
  }
  function tick() {
    requestAnimationFrame(tick);
    // the library or the closed curtain in front of the stage: the reading stops (it moves the theatre itself)
    const root = document.documentElement;
    if (mode === 'playing' && (root.classList.contains('lib-on') || root.classList.contains('drape-on'))) pause();
    theatre.setNarrator({ driving: mode === 'playing' && !scrubbing });
    ui.sync();
    if (mode !== 'playing' || !cur) return;
    const now = performance.now();
    // the reader has the scroll until they have been still a moment and the picture has caught up
    const active = now - userAt < SETTLE || (scrubbing && Math.abs(scrollY / theatre.unitPx() - theatre.g) > 0.01);
    if (active) {
      scrubbing = true;
      // leaving the sentence being read silences it; staying inside it lets it finish
      if (!cur.silenced && (cur.gap || theatre.beatAt(theatre.g) !== beats[cur.k])) { stopVoice(0.15); cur.silenced = true; }
      return;
    }
    if (scrubbing) {
      scrubbing = false;
      const g = theatre.g;
      if (g >= last.start + last.len - 0.02) { mode = 'ended'; return; }
      const b = theatre.beatAt(g), k = idx.get(b);
      if (k !== cur.k || cur.silenced || cur.gap) startBeat(k, { landed: true });
      else cur.holdG = g; // still in the sentence being read: carry on, from where the picture now is
    }
    const el = clock() - cur.t0;
    if (cur.gap) {
      const to = cur.ending ? theatre.total - 0.3 : beats[cur.k].start;
      const dur = cur.ending ? 2.4 : SCENE_GAP;
      driveTo(cur.from + (to - cur.from) * smooth(clamp(el / dur)));
      if (el >= dur) { if (cur.ending) { mode = 'ended'; cur = null; try { sessionStorage.setItem('narrator.listening', '1'); } catch (e) { /* ignore */ } } else startBeat(cur.k); }
      return;
    }
    const b = beats[cur.k], total = plan[cur.k];
    let u = el / total;
    // the title card is read with the curtain still down, then the set comes up
    if (b.cover && man.beats[cur.k].dur) u = (el - LEAD - man.beats[cur.k].dur) / (total - LEAD - man.beats[cur.k].dur);
    driveTo(Math.max(b.start + b.len * clamp(u) * 0.995, cur.holdG));
    if (el >= total) next();
  }

  /* ---------- the caption follows the voice ---------- */
  theatre.setNarrator({
    reveal(beat, p) {
      lastP = p;
      if (!cur || cur.gap || (mode !== 'playing' && mode !== 'paused') || beats[cur.k] !== beat) return null;
      if (scrubbing && cur.silenced) return null;
      const words = man.beats[cur.k].words;
      const n = words.length;
      if (!n) return null;
      const el = (mode === 'paused' ? cur.pausedEl ?? 0 : clock() - cur.t0) - LEAD;
      let shown = 0, word = -1;
      for (let i = 0; i < n; i++) {
        const [a, z] = words[i];
        if (el < a) break;
        shown = i + clamp((el - a) / Math.max(0.05, z - a));
        word = el < z + 0.08 ? i : -1;
      }
      if (el > words[n - 1][1]) shown = n;
      return { p: Math.max(shown / n, cur.landedP), word: voiceOn && mode === 'playing' ? word : -1 };
    },
    nav(dir) {
      if (mode !== 'playing') return false;
      skip(dir);
      return true;
    },
  });
  function skip(dir) {
    if (!cur) return;
    let k = cur.k;
    if (dir < 0 && !cur.gap && clock() - cur.t0 > 2) { /* replay the current sentence */ }
    else k = clamp(k + dir, 0, beats.length - 1);
    userAt = -1e9; scrubbing = false;
    startBeat(k);
  }

  /* ---------- controls ---------- */
  function play() {
    unlock();
    if (mode === 'playing') return;
    const g = theatre.g;
    if (mode === 'ended' || g >= last.start + last.len - 0.02) { scrollTo(0, 0); startBeat(0); }
    else if (mode === 'paused' && cur && !cur.gap && beats[cur.k] === theatre.beatAt(g)) {
      // resume mid-sentence, where the pause left it
      const el = cur.pausedEl ?? 0;
      cur = { ...cur, t0: clock() - el, src: null, silenced: false };
      mode = 'playing';
      speak(cur, 0);
      return;
    } else startBeat(idx.get(theatre.beatAt(g)), { landed: g > 0.05 });
    mode = 'playing';
    speak(cur, 0);
  }
  function pause() {
    if (mode !== 'playing') return;
    if (cur) cur.pausedEl = clock() - cur.t0;
    stopVoice(0.12);
    mode = 'paused';
  }
  function setVoice(on) {
    voiceOn = on; save('voice', on);
    if (!ctx) return;
    voiceBus.gain.setTargetAtTime(on ? voiceVol : 0, clock(), 0.05);
    music.duck(on && !!cur?.src);
  }
  function setMusic(on) {
    musicOn = on; save('music', on);
    unlock();
    if (on) { music.start(); setMood(cur ? cur.k : idx.get(theatre.beatAt(theatre.g))); } else music.stop();
  }
  // the sliders: moving one up from silence also switches its channel back on
  function setVoiceVol(v) {
    voiceVol = v; saveLevel('voiceVol', v);
    if (v > 0 && !voiceOn) setVoice(true);
    else if (ctx && voiceOn) voiceBus.gain.setTargetAtTime(v, clock(), 0.03);
  }
  function setMusicVol(v) {
    musicVol = v; saveLevel('musicVol', v);
    if (v > 0 && !musicOn) setMusic(true);
    music?.volume(v);
  }
  function setMood(k) { music?.mood(man.moods?.[beats[k]?.sid] || 'day'); }

  // the lock screen / headphone buttons
  function media() {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: theatre.refOf?.(beats[cur.k]) || title, artist: title, album: 'Palcem przez Biblię' });
    } catch (e) { /* not supported */ }
  }
  if ('mediaSession' in navigator) {
    const on = (a, f) => { try { navigator.mediaSession.setActionHandler(a, f); } catch (e) { /* unsupported action */ } };
    on('play', play); on('pause', pause);
    on('previoustrack', () => skip(-1)); on('nexttrack', () => skip(1));
  }

  // the reader's own hand on the scroll: wheel, touch, keys, the scrollbar or the thread's knots
  const user = () => { userAt = performance.now(); };
  addEventListener('wheel', user, { passive: true });
  addEventListener('touchstart', user, { passive: true });
  addEventListener('touchmove', user, { passive: true });
  addEventListener('keydown', (e) => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) user(); });
  addEventListener('scroll', () => { if (!setYs.some((y) => Math.abs(scrollY - y) <= 2)) user(); }, { passive: true });
  // a hidden tab stops the animation frames: stop the reading with it
  document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); music?.stop(); } else if (musicOn && ctx) music.start(); });

  const ui = buildUi({ L, play, pause, skip: (d) => (mode === 'playing' ? skip(d) : theatre.nextBeat(d)), setVoice, setMusic, setVoiceVol, setMusicVol,
    state: () => ({ mode, voiceOn, musicOn, voiceVol, musicVol, scrubbing, speaking: !!cur?.src && voiceOn, g: theatre.g }) });
  requestAnimationFrame(tick);
  return { play, pause, skip, get mode() { return mode; },
    // for tools and the console: what the narrator is doing
    get state() { return { mode, k: cur?.k, sid: cur && beats[cur.k].sid, gap: !!cur?.gap, speaking: !!cur?.src, silenced: !!cur?.silenced, scrubbing, voiceOn, musicOn }; } };
}

/* ---------- the little paper mixer (top right) and the invitation on the title page ---------- */
function buildUi({ L, play, pause, skip, setVoice, setMusic, setVoiceVol, setMusicVol, state }) {
  let resuming = false;
  try { resuming = sessionStorage.getItem('narrator.listening') === '1'; sessionStorage.removeItem('narrator.listening'); } catch (e) { /* ignore */ }
  const cta = document.createElement('button');
  cta.type = 'button';
  cta.className = 'listen-cta';
  cta.innerHTML = `${svg(ICON.play)}<span>${resuming ? L.resume : L.listen}</span>`;
  cta.addEventListener('click', (e) => { e.stopPropagation(); state().mode === 'playing' ? pause() : play(); });
  document.body.appendChild(cta);

  const bar = document.createElement('nav');
  bar.className = 'player';
  bar.setAttribute('aria-label', L.label);
  const btn = (cls, icon, label, fn, into = bar) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.innerHTML = svg(icon);
    b.setAttribute('aria-label', label); b.title = label;
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    into.appendChild(b);
    return b;
  };
  // A mute button with a vertical volume slider that drops down under it: on hover with a mouse, on keyboard
  // focus, and on a tap on touch screens (there the tap opens the slider instead of muting; slide to 0 to mute).
  // The slider is drawn by hand: vertical native range inputs differ too much between Safari versions.
  let touch = false;
  addEventListener('pointerdown', (e) => {
    touch = e.pointerType === 'touch';
    // a tap anywhere else closes an open slider
    bar.querySelectorAll('.pl-ch.open').forEach((w) => { if (!w.contains(e.target)) w.classList.remove('open'); });
  }, true);
  const channel = (cls, icon, label, toggle, setVol) => {
    const wrap = document.createElement('div');
    wrap.className = 'pl-ch';
    const b = btn(cls, icon, label, () => (touch ? wrap.classList.toggle('open') : toggle()), wrap);
    b.removeAttribute('title'); // the slider shows on hover; a tooltip would sit on top of it
    const pop = document.createElement('div');
    pop.className = 'pl-pop';
    const r = document.createElement('div');
    r.className = 'pl-slider';
    r.tabIndex = 0;
    Object.entries({ role: 'slider', 'aria-label': label, 'aria-orientation': 'vertical', 'aria-valuemin': 0, 'aria-valuemax': 100 }).forEach(([k, v]) => r.setAttribute(k, v));
    r.innerHTML = '<span class="pl-track"><span class="pl-fill"></span><span class="pl-thumb"></span></span>';
    const track = r.firstElementChild;
    const at = (e) => { const t = track.getBoundingClientRect(); setVol(clamp(1 - (e.clientY - t.top) / t.height)); };
    r.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation(); // no focus ring from a mouse, and no tap-to-turn on the stage
      r.setPointerCapture(e.pointerId);
      wrap.classList.add('drag'); // stays open while dragging, even if the pointer strays outside
      at(e);
    });
    r.addEventListener('pointermove', (e) => { if (wrap.classList.contains('drag')) at(e); });
    const drop = () => wrap.classList.remove('drag');
    r.addEventListener('pointerup', drop);
    r.addEventListener('pointercancel', drop);
    r.addEventListener('click', (e) => e.stopPropagation());
    r.addEventListener('keydown', (e) => {
      const v = +r.getAttribute('aria-valuenow') / 100;
      const to = { ArrowUp: v + 0.05, ArrowRight: v + 0.05, ArrowDown: v - 0.05, ArrowLeft: v - 0.05, PageUp: v + 0.2, PageDown: v - 0.2, Home: 0, End: 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault(); e.stopPropagation(); // ← / → here move the slider, not the reading
      setVol(clamp(to));
    });
    pop.appendChild(r);
    wrap.appendChild(pop);
    bar.appendChild(wrap);
    return { b, r };
  };
  btn('pl-prev', ICON.prev, L.prev, () => skip(-1));
  const pp = btn('pl-play', ICON.play, L.play, () => (state().mode === 'playing' ? pause() : play()));
  btn('pl-next', ICON.next, L.next, () => skip(1));
  bar.appendChild(Object.assign(document.createElement('span'), { className: 'pl-sep' }));
  const { b: vb, r: vr } = channel('pl-voice', ICON.voice, L.voice, () => setVoice(!state().voiceOn), setVoiceVol);
  const { b: mb, r: mr } = channel('pl-music', ICON.music, L.music, () => setMusic(!state().musicOn), setMusicVol);
  document.body.appendChild(bar);
  const cap = document.getElementById('caption');

  let key = '';
  return {
    sync() {
      const s = state();
      const playing = s.mode === 'playing';
      // the sliders show the level, or empty while their channel is muted
      const fill = (r, on, v) => { const x = Math.round((on ? v : 0) * 100); if (r._v !== x) { r._v = x; r.setAttribute('aria-valuenow', x); r.style.setProperty('--v', x + '%'); } };
      fill(vr, s.voiceOn, s.voiceVol); fill(mr, s.musicOn, s.musicVol);
      const k = [s.mode, s.voiceOn && s.voiceVol > 0, s.musicOn && s.musicVol > 0, s.scrubbing, s.speaking, s.g > 0.3].join();
      if (k === key) return;
      key = k;
      pp.innerHTML = svg(playing ? ICON.pause : ICON.play);
      pp.setAttribute('aria-label', playing ? L.pause : L.play); pp.title = pp.getAttribute('aria-label');
      pp.classList.toggle('on', playing);
      vb.setAttribute('aria-pressed', String(s.voiceOn && s.voiceVol > 0));
      mb.setAttribute('aria-pressed', String(s.musicOn && s.musicVol > 0));
      bar.classList.toggle('shown', s.g > 0.3);
      bar.classList.toggle('following', playing && s.scrubbing);
      // arriving from a chapter that was being listened to: the play button invites to go on
      bar.classList.toggle('invite', resuming && s.mode === 'idle');
      cta.classList.toggle('gone', s.g > 0.3);
      cta.classList.toggle('on', playing);
      cta.querySelector('span').textContent = playing ? L.pause : resuming ? L.resume : L.listen;
      cta.firstElementChild.outerHTML = svg(playing ? ICON.pause : ICON.play);
      cap.classList.toggle('speaking', s.speaking && playing && !s.scrubbing);
    },
  };
}
