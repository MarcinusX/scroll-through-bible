// Background music: a quiet generative bed (drone chords + a few plucked notes in a warm room) that
// changes with the scene's mood and ducks under the narrator. A stand-in, costing no download, for
// looped tracks made per mood (e.g. with ElevenLabs Music): swap makeMusic for a crossfading player.
const MOODS = {
  // chords as MIDI notes; plucks drawn from the scale
  day: { chords: [[50, 57, 62, 64], [48, 55, 60, 64], [46, 53, 58, 62], [45, 52, 57, 60]], scale: [62, 64, 67, 69, 72, 74, 76], cutoff: 900, pluck: [2.8, 6], wind: 0 },
  night: { chords: [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 58], [40, 47, 52, 55]], scale: [57, 60, 62, 64, 67, 69], cutoff: 650, pluck: [4, 8], wind: 0 },
  storm: { chords: [[38, 45, 50, 53], [36, 43, 48, 51], [34, 41, 46, 50], [33, 40, 45, 48]], scale: [57, 60, 62, 65], cutoff: 420, pluck: [6, 11], wind: 0.07 },
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

export function makeMusic(ctx, out) {
  const bus = ctx.createGain(); bus.gain.value = 0;
  const duckG = ctx.createGain(); duckG.gain.value = 1;
  bus.connect(duckG); duckG.connect(out);
  // a warm room: a short decaying-noise impulse
  const room = ctx.createConvolver();
  const len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.6; }
  room.buffer = ir;
  const wet = ctx.createGain(); wet.gain.value = 0.55;
  room.connect(wet); wet.connect(bus);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 0.4;
  lp.connect(bus); lp.connect(room);

  // wind for the storm: filtered noise swelling on a slow wobble
  const nb = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  { const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const noise = ctx.createBufferSource(); noise.buffer = nb; noise.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 380; bp.Q.value = 0.7;
  const windG = ctx.createGain(); windG.gain.value = 0;
  const lfo = ctx.createOscillator(), lfoG = ctx.createGain(); lfo.frequency.value = 0.09; lfoG.gain.value = 220;
  lfo.connect(lfoG); lfoG.connect(bp.frequency);
  noise.connect(bp); bp.connect(windG); windG.connect(bus); windG.connect(room);
  noise.start(); lfo.start();

  let mood = MOODS.day, moodName = 'day', running = false, chordNo = 0, timer = 0, pluckTimer = 0;
  let level = 0.8; // the bed's gain at full slider is 1.15 (see volume())
  let voices = [];

  function chord() {
    const t = ctx.currentTime;
    // fade the old chord out while the new one swells in
    voices.forEach(({ o, g }) => { g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0, t, 1.2); o.forEach((x) => x.stop(t + 6)); });
    voices = mood.chords[chordNo++ % mood.chords.length].map((m, i) => {
      const g = ctx.createGain(); g.gain.value = 0;
      g.gain.setTargetAtTime(i === 0 ? 0.05 : 0.032, t, 1.6);
      const o = [-4, 4].map((det) => { const x = ctx.createOscillator(); x.type = i === 0 ? 'sine' : 'triangle'; x.frequency.value = hz(m); x.detune.value = det; x.connect(g); x.start(t); return x; });
      g.connect(lp);
      return { o, g };
    });
    timer = setTimeout(chord, 9000 + Math.random() * 3000);
  }
  function pluck() {
    const t = ctx.currentTime, m = mood.scale[Math.floor(Math.random() * mood.scale.length)];
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = hz(m);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0005, t + 2.6);
    o.connect(g); g.connect(room); g.connect(lp);
    o.start(t); o.stop(t + 2.8);
    const [a, b] = mood.pluck;
    pluckTimer = setTimeout(pluck, (a + Math.random() * (b - a)) * 1000);
  }

  return {
    start() {
      if (running) return;
      running = true;
      bus.gain.setTargetAtTime(level, ctx.currentTime, 1.5);
      chord(); pluckTimer = setTimeout(pluck, 1500);
    },
    stop() {
      if (!running) return;
      running = false;
      clearTimeout(timer); clearTimeout(pluckTimer);
      bus.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      const old = voices; voices = [];
      old.forEach(({ o }) => o.forEach((x) => x.stop(ctx.currentTime + 3)));
    },
    mood(name) {
      if (name === moodName || !MOODS[name]) return;
      moodName = name; mood = MOODS[name];
      const t = ctx.currentTime;
      lp.frequency.setTargetAtTime(mood.cutoff, t, 1.5);
      windG.gain.setTargetAtTime(mood.wind, t, 2);
      if (running) { clearTimeout(timer); chord(); }
    },
    // the listener's slider, 0…1
    volume(v) {
      level = 1.15 * v;
      if (running) bus.gain.setTargetAtTime(level, ctx.currentTime, 0.08);
    },
    // under the voice the music steps back
    duck(on) { duckG.gain.setTargetAtTime(on ? 0.4 : 1, ctx.currentTime, on ? 0.12 : 0.6); },
  };
}
