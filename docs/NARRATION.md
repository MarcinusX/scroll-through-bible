# Narration (prototype)

The theatre can read a chapter aloud, sentence by sentence, with quiet music underneath.
The prototype runs on **Mark 4**, in both languages: `?book=mark&ch=4`, then **Listen** on the title page.
Chapters without recorded narration look exactly as before.

## How it behaves

**Listening, the voice leads.** Each beat has its own clip. While it plays, the theatre scrolls itself
at the pace of the reading. The caption's words appear as they are spoken, and the spoken word is inked
terracotta. The title card is read with the curtain still down. A change of scene is a 1.7 s set change
with only the music playing.

**Scrolling is a scrubber, never a fight.** The reader can take over at any time:

| The reader… | The narrator… |
|---|---|
| nudges the scroll but stays in the sentence being read | keeps reading; the picture moves where they put it |
| scrolls on, out of the sentence | fades out at once (150 ms) and stays silent while they scroll, however fast |
| stops (450 ms still, picture caught up) | reads the sentence they stopped on **from its first word** and carries on |
| scrolls back | the same: the sentence they land on is read again from its start |
| presses → / taps the right third | skips to the next sentence |
| presses ← / taps the left third | replays the current sentence (if >2 s in), else goes to the previous one |
| pauses, then plays | resumes mid-word if they haven't moved; otherwise starts the sentence they're on |

What it never does:
* **It never plays speech backwards** or "rewinds" audio to follow a backwards scroll.
* **It never pulls the picture back.** When it restarts a sentence the reader scrolled into, the picture
  holds still until the reading catches up, and words already on screen stay there.
* **It never queues sentences up.** It doesn't read every sentence it passed during a fling; it reads only
  where the reader stopped.

**Controls.** A small paper mixer takes the language flags' place, top right, once the play starts.
It holds ⏮ ▶/❚❚ ⏭ · narrator · music. On phones prev/next are the existing side taps, so the
mixer shows only ▶/❚❚, narrator and music. While the reader scrolls, the play button breathes, meaning
"I'll pick up where you stop". The lock screen and headphone buttons work too (Media Session).

* **Narrator off** keeps the pace, like subtitles: the theatre still plays itself at reading speed.
* **Music** is independent of the narrator and remembered. It ducks under the voice (to 40%) and changes
  with the scene's mood, e.g. the storm is darker with wind.
* **Volume.** Hovering the narrator or music button drops a vertical slider down under it. It closes as
  soon as the mouse leaves; a drag keeps it open until the button is released. Keyboard focus opens it
  too (↑/↓, Home/End). On touch screens a tap on the button opens the slider instead of muting, and
  sliding to the bottom mutes. Both levels are remembered. Raising a muted channel's slider switches it
  back on.

## Files

* `tools/voice.mjs <book> <ch>` builds `audio/<book>/<ch>/<lang>/NN.mp3` (one per beat) and
  `audio/<book>/<ch>/<lang>.json` (clip length plus the start and end of each caption word). It rebuilds
  only beats whose text changed. It rebuilds each beat's text the same way the engine does, so the words
  line up 1:1 with the caption.
  * With `ELEVENLABS_API_KEY` it calls `/v1/text-to-speech/{voice}/with-timestamps`
    (`eleven_multilingual_v2`, mp3 64 kb/s). It passes the neighbouring sentences as `previous_text`/`next_text`
    so the intonation flows across clips. Word timings come from ElevenLabs' character alignment and are exact.
  * Without a key it uses macOS `say` (Zosia / Daniel). That is only a stand-in: its word timings are
    estimated from word length and pinned to the pauses it leaves.
* `js/core/voice.js` is the narrator (state machine, the drive, controls). `js/core/music.js` is a
  generative stand-in for music: drone chords and plucks, zero bytes. To be replaced by looped tracks per
  mood (e.g. ElevenLabs Music), crossfaded.
* `engine.js` gains three small hooks: `narrator.reveal(beat, p)` (the voice drives the word reveal),
  `narrator.nav(dir)` (taps and arrows skip in the reading), and `narrator.driving` (the narrator's own
  steady scroll doesn't count as "the reader is scrolling", so scenes keep being prepared off-stage in Safari).

## Before release

* **Voices.** Choose an ElevenLabs narrator per language, perhaps one voice for both. Test Polish names
  and archaic forms (e.g. "Tyś jest", "rzekł"). Fix readings with an ElevenLabs pronunciation dictionary.
* **Cost.** The four Gospels are about 390k characters of Polish and 420k of English. With
  `eleven_multilingual_v2` at 1 credit per character, plus ~20% for retakes, that is about 1M credits, a
  one-off. Flash/Turbo models cost half. Check current plan prices.
* **Size.** At the demo's pace (about 16–18 characters a second) the four Gospels are about 7 h of speech
  per language: Matthew 1.9 h, Mark 1.2 h, Luke 2 h, John 1.6 h. That is ~200 MB per language at 64 kb/s mono. That is too much for
  the git repo and Pages. Host `audio/` on a CDN or bucket (e.g. Cloudflare R2), or drop to 48 kb/s.
  Clips are fetched only around the reader (current + 3 ahead).
* **iOS.** Audio unlocks on the Listen tap (Web Audio). `navigator.audioSession.type = 'playback'` lets it
  play with the ringer switch off. A hidden tab pauses the reading. Listening with the screen locked would
  need the drive to run from audio events instead of animation frames.
* **Across chapters.** At the end of a chapter the closing card offers the next one. The next page shows
  **Keep listening**, because a new page needs a new tap before it can make sound.
* **Performance.** The narrator only scrolls the page, so it costs what slow scrolling costs. Bench it in
  WebKit (`tools/bench-webkit.mjs`) before release.
