"use client";

import { useState, useRef, useCallback } from "react";

// ─── Sound Definitions ────────────────────────────────────────────────────────

type Sound = {
  id: string;
  file: string;
  emoji: string;
  label: string;
  color: string;
};

const SOUNDS: Sound[] = [
  { id: "movie", file: "movie-start.mp3", emoji: "🎥", label: "Movie Start", color: "#6ab04c" },
  { id: "serious", file: "a-serious-moment-has-come-or-slept.mp3", emoji: "😳", label: "Serious...", color: "#4ecdc4" },
  { id: "bunch", file: "bunch.mp3", emoji: "🤜", label: "Bunch!", color: "#ffe66d" },
  { id: "toasty", file: "cry-toasty-from-around-the-corner-of-the-screen-in-mk.mp3", emoji: "🍞", label: "Toasty!", color: "#e17055" },
  { id: "dramatic", file: "dramatic-moment.mp3", emoji: "🎭", label: "Dramatic", color: "#a29bfe" },
  { id: "runcat", file: "fast-music-with-a-running-cat-from-the-90s.mp3", emoji: "🐱", label: "Run Cat", color: "#fdcb6e" },
  { id: "funny", file: "funny-melody-for-animation.mp3", emoji: "😂", label: "Funny", color: "#ff9ff3" },
  { id: "best", file: "i-am-the-very-first-and-the-best-there-is-no-one-cooler-than-me.mp3", emoji: "😎", label: "I'm the Best", color: "#f0932b" },
  { id: "letsgo", file: "lets-go-on-the-walkie-talkie.mp3", emoji: "📻", label: "Let's Go!", color: "#55efc4" },
  { id: "pikababy", file: "pikachu-baby.mp3", emoji: "⚡", label: "Pika Baby", color: "#f9ca24" },
  { id: "pikashort", file: "pikachu-short.mp3", emoji: "⚡", label: "Pikachu!", color: "#ffe66d" },
  { id: "happypika", file: "the-sound-of-a-joyful-pikachu-from-the-animated-series-quotpokemonquot.mp3", emoji: "😊", label: "Happy Pika", color: "#f9ca24" },
  { id: "pikachu", file: "pikachu.mp3", emoji: "⚡", label: "Pikachuuu", color: "#fdcb6e" },
  { id: "sadviolin", file: "sad-melody-on-violin-for-a-sad-moment-used-in-close-up-sad-face-memes.mp3", emoji: "🎻", label: "Sad Violin", color: "#4ecdc4" },
  { id: "shrek", file: "shrek-meme-music.mp3", emoji: "🧅", label: "Shrek!", color: "#a8e063" },
  { id: "brue", file: "sound-brue-brue.mp3", emoji: "🎵", label: "Brue Brue", color: "#fd79a8" },
  { id: "tuturu", file: "tuturu.mp3", emoji: "📱", label: "Tuturu~", color: "#fd79a8" },
  { id: "incredible", file: "when-i-saw-something-incredible-some-kind-of-trick.mp3", emoji: "😲", label: "No Way!", color: "#74b9ff" },
  { id: "MK intro", file: "intro.mp3", emoji: "🎬", label: "Intro", color: "#74b9ff" },
  { id: "mkappear", file: "the-appearance-of-mortal-kombat.mp3", emoji: "🎮", label: "MK Appears", color: "#a29bfe" },
  { id: "fight", file: "the-fight-began-quotfightquot-voice-of-the-announcer-quotfightquot-from-mortal-kombat.mp3", emoji: "👊", label: "FIGHT!", color: "#ff6b6b" },
  { id: "mklaugh", file: "the-sound-of-laughter-from-mortal-kombat.mp3", emoji: "😈", label: "MK Laugh", color: "#e17055" },
  { id: "fatality", file: "fatality.mp3", emoji: "💀", label: "Fatality", color: "#eb4d4b" },
  { id: "round1", file: "round-one-fight.mp3", emoji: "👊", label: "Round 1 Fight", color: "#ff6b6b" },
  { id: "round2", file: "round-2-in-mortal-kombat.mp3", emoji: "🥊", label: "Round 2!", color: "#ff7675" },
  { id: "round3", file: "round-3.mp3", emoji: "🥊", label: "Round 3!", color: "#eb4d4b" },
  { id: "amongus", file: "among-us-role-reveal-sound.mp3", emoji: "🛸", label: "Among Us", color: "#ff6b6b" },
  { id: "animewow", file: "anime-wow-sound-effect-mp3cut.mp3", emoji: "😮", label: "Anime Wow", color: "#ffa502" },
  { id: "animeshine", file: "anime-shine.mp3", emoji: "✨", label: "Anime Shine", color: "#ffeaa7" },
  { id: "outofmind", file: "are-you-out-of-your-mind-greenscreen-change-quality-and-end-wont-cut-off_2.mp3", emoji: "🤯", label: "Out of Mind", color: "#e056fd" },
  { id: "babylaugh", file: "baby-laughing-meme.mp3", emoji: "👶", label: "Baby Laugh", color: "#ff9ff3" },
  { id: "dundundun", file: "dun-dun-dun-sound-effect-brass_8nFBccR.mp3", emoji: "🎺", label: "Dun Dun Dun", color: "#f9ca24" },
  { id: "emotional", file: "emotional-damage-meme.mp3", emoji: "💔", label: "Emotional Damage", color: "#686de0" },
  { id: "galaxy", file: "galaxy-meme.mp3", emoji: "🌌", label: "Galaxy Brain", color: "#a29bfe" },
  { id: "metalpipe", file: "metal-pipe.mp3", emoji: "🔧", label: "Metal Pipe", color: "#95afc0" },
  { id: "omg", file: "oh-my-god-meme.mp3", emoji: "😱", label: "Oh My God", color: "#ff7979" },
  { id: "ohnono", file: "oh-no-no-no-tik-tok-song-sound-effect.mp3", emoji: "🙅", label: "Oh No No No", color: "#badc58" },
  { id: "oioi", file: "oi-oi-oe-oi-a-eye-eye.mp3", emoji: "👀", label: "Oi Oi", color: "#7bed9f" },
  { id: "punch", file: "punch-gaming-sound-effect-hd_RzlG1GE.mp3", emoji: "👊", label: "Punch", color: "#ff6348" },
  { id: "runclip", file: "run-audio-mp3cut_TdXTLux.mp3", emoji: "🏃", label: "Run", color: "#1dd1a1" },
  { id: "sicko", file: "sicko-mode.mp3", emoji: "🔥", label: "Sicko Mode", color: "#f0932b" },
  { id: "y2clip", file: "y2mate-mp3cut_sRzY6rh.mp3", emoji: "🎬", label: "Clip", color: "#6c5ce7" },
];

// Ignore pointer-up as a "tap" if the finger moved this far (scroll vs tap).
const TAP_SLOP_PX = 14;
const TAP_SLOP2 = TAP_SLOP_PX * TAP_SLOP_PX;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SillyBoard() {
  const [active, setActive] = useState<string | null>(null);
  const [showIcons, setShowIcons] = useState(true);
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());
  const tapRef = useRef<{ id: string | null; x: number; y: number; dragged: boolean }>({
    id: null,
    x: 0,
    y: 0,
    dragged: false,
  });
  /** Mouse/touch fire `click` after pointerup; avoid playing twice. */
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePlay = useCallback((sound: Sound) => {
    let audio = audioCache.current.get(sound.id);
    if (!audio) {
      audio = new Audio(`/sounds/${sound.file}`);
      audioCache.current.set(sound.id, audio);
    }

    // If this sound is already playing, stop and reset it
    if (active === sound.id) {
      audio.pause();
      audio.currentTime = 0;
      setActive(null);
      return;
    }

    // Stop whatever was playing before
    if (active) {
      const prev = audioCache.current.get(active);
      if (prev) { prev.pause(); prev.currentTime = 0; }
    }

    audio.currentTime = 0;
    audio.onended = () => setActive(null);
    audio.play().catch(() => { });
    setActive(sound.id);
  }, [active]);

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center px-3 pt-8 pb-safe overflow-x-hidden relative">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff0a 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Icons toggle */}
      <div className="w-full max-w-2xl flex items-center justify-end gap-3 relative z-10 mb-3 px-0.5">
        <span className="text-[#666] text-[0.65rem] font-[var(--font-nunito)] font-bold uppercase tracking-[0.2em]">
          Icons
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={showIcons}
          aria-label={showIcons ? "Hide emoji icons" : "Show emoji icons"}
          onClick={() => setShowIcons((v) => !v)}
          className="relative h-7 w-12 shrink-0 rounded-full border-2 border-[#333] bg-[#1a1a2e] cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#a29bfe] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d1a]"
          style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
        >
          <span
            className="absolute top-0.5 h-5 w-5 rounded-full shadow-md transition-[left,background-color] duration-150 ease-out"
            style={{
              left: showIcons ? "2px" : "calc(100% - 22px)",
              background: showIcons
                ? "linear-gradient(145deg,#ffe66d,#f9ca24)"
                : "linear-gradient(145deg,#555,#333)",
            }}
          />
        </button>
      </div>

      {/* Title */}
      <div className={`text-center relative z-10 ${showIcons ? "mb-6" : "mb-3"}`}>
        <h1
          className="font-[var(--font-boogaloo)] text-[clamp(2.4rem,9vw,3.8rem)] m-0 tracking-widest"
          style={{
            background: "linear-gradient(90deg,#ff6b6b,#ffe66d,#a8e063,#4ecdc4,#a29bfe,#fd79a8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 18px rgba(255,255,255,0.15))",
          }}
        >
          HPD SOUNDS
        </h1>
        <p className="text-[#555] text-xs tracking-[2px] uppercase mt-1 font-[var(--font-nunito)]">
          tap a button · make noise · repeat
        </p>
      </div>

      {/* Sound Grid */}
      <div
        className={`grid w-full relative z-10 ${
          showIcons
            ? "max-w-xl grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            : "max-w-2xl grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
        }`}
      >
        {SOUNDS.map((sound) => {
          const isActive = active === sound.id;
          return (
            <button
              key={sound.id}
              type="button"
              onPointerDown={(e) => {
                if (suppressClickTimerRef.current) {
                  clearTimeout(suppressClickTimerRef.current);
                  suppressClickTimerRef.current = null;
                }
                suppressClickRef.current = false;
                tapRef.current = {
                  id: sound.id,
                  x: e.clientX,
                  y: e.clientY,
                  dragged: false,
                };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                const t = tapRef.current;
                if (t.id !== sound.id) return;
                const dx = e.clientX - t.x;
                const dy = e.clientY - t.y;
                if (dx * dx + dy * dy > TAP_SLOP2) t.dragged = true;
              }}
              onPointerUp={(e) => {
                const t = tapRef.current;
                if (t.id !== sound.id) return;
                const shouldPlay = !t.dragged;
                tapRef.current = { id: null, x: 0, y: 0, dragged: false };
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {
                  /* not captured */
                }
                suppressClickRef.current = true;
                if (shouldPlay) handlePlay(sound);
                if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
                suppressClickTimerRef.current = setTimeout(() => {
                  suppressClickRef.current = false;
                  suppressClickTimerRef.current = null;
                }, 400);
              }}
              onPointerCancel={(e) => {
                const t = tapRef.current;
                if (t.id !== sound.id) return;
                tapRef.current = { id: null, x: 0, y: 0, dragged: false };
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId);
                } catch {
                  /* not captured */
                }
              }}
              onClick={() => {
                if (suppressClickRef.current) {
                  suppressClickRef.current = false;
                  return;
                }
                handlePlay(sound);
              }}
              className={`flex flex-col items-center justify-center rounded-2xl cursor-pointer select-none outline-none ${
                showIcons ? "gap-2 py-5 px-2 min-h-[88px]" : "gap-0 py-2 px-1.5 min-h-0"
              }`}
              style={{
                background: isActive ? sound.color : `${sound.color}18`,
                border: `2.5px solid ${sound.color}`,
                color: isActive ? "#000" : sound.color,
                transform: isActive ? "scale(0.91) translateY(3px)" : "scale(1)",
                boxShadow: isActive
                  ? `0 0 22px ${sound.color}99, 0 0 50px ${sound.color}44, inset 0 -3px 0 rgba(0,0,0,0.25)`
                  : `0 5px 0 ${sound.color}55, 0 0 12px ${sound.color}22`,
                transition: "transform 0.07s ease, box-shadow 0.07s ease, background 0.07s ease",
                WebkitTapHighlightColor: "transparent",
                touchAction: "pan-y",
                minHeight: showIcons ? "88px" : undefined,
              }}
            >
              {showIcons ? (
                <span
                  className="text-4xl leading-none"
                  style={{ filter: isActive ? "none" : "drop-shadow(0 0 6px currentColor)" }}
                >
                  {sound.emoji}
                </span>
              ) : null}
              <span
                className={`font-[var(--font-nunito)] font-extrabold text-center leading-tight tracking-wide ${
                  showIcons ? "text-[0.8rem]" : "text-[0.68rem] sm:text-[0.72rem]"
                }`}
              >
                {sound.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[#333] text-[0.65rem] mt-8 tracking-widest uppercase relative z-10">
        HPD SOUNDS
      </p>
    </div>
  );
}
