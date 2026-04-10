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
  { id: "serious",    file: "a-serious-moment-has-come-or-slept.mp3",                                                          emoji: "😳", label: "Serious...",    color: "#4ecdc4" },
  { id: "bunch",      file: "bunch.mp3",                                                                                        emoji: "🤜", label: "Bunch!",        color: "#ffe66d" },
  { id: "toasty",     file: "cry-toasty-from-around-the-corner-of-the-screen-in-mk.mp3",                                       emoji: "🍞", label: "Toasty!",       color: "#e17055" },
  { id: "dramatic",   file: "dramatic-moment.mp3",                                                                             emoji: "🎭", label: "Dramatic",      color: "#a29bfe" },
  { id: "runcat",     file: "fast-music-with-a-running-cat-from-the-90s.mp3",                                                  emoji: "🐱", label: "Run Cat",       color: "#fdcb6e" },
  { id: "fatality",   file: "fatality.mp3",                                                                                    emoji: "💀", label: "Fatality",      color: "#eb4d4b" },
  { id: "funny",      file: "funny-melody-for-animation.mp3",                                                                  emoji: "😂", label: "Funny",         color: "#ff9ff3" },
  { id: "best",       file: "i-am-the-very-first-and-the-best-there-is-no-one-cooler-than-me.mp3",                             emoji: "😎", label: "I'm the Best",  color: "#f0932b" },
  { id: "intro",      file: "intro.mp3",                                                                                       emoji: "🎬", label: "Intro",         color: "#74b9ff" },
  { id: "letsgo",     file: "lets-go-on-the-walkie-talkie.mp3",                                                                emoji: "📻", label: "Let's Go!",     color: "#55efc4" },
  { id: "movie",      file: "movie-start.mp3",                                                                                 emoji: "🎥", label: "Movie Start",   color: "#6ab04c" },
  { id: "pikababy",   file: "pikachu-baby.mp3",                                                                                emoji: "⚡", label: "Pika Baby",     color: "#f9ca24" },
  { id: "pikashort",  file: "pikachu-short.mp3",                                                                               emoji: "⚡", label: "Pikachu!",      color: "#ffe66d" },
  { id: "pikachu",    file: "pikachu.mp3",                                                                                     emoji: "⚡", label: "Pikachuuu",     color: "#fdcb6e" },
  { id: "round1",     file: "round-one-fight.mp3",                                                                             emoji: "👊", label: "Round 1 Fight", color: "#ff6b6b" },
  { id: "round2",     file: "round-2-in-mortal-kombat.mp3",                                                                    emoji: "🥊", label: "Round 2!",      color: "#ff7675" },
  { id: "round3",     file: "round-3.mp3",                                                                                     emoji: "🥊", label: "Round 3!",      color: "#eb4d4b" },
  { id: "sadviolin",  file: "sad-melody-on-violin-for-a-sad-moment-used-in-close-up-sad-face-memes.mp3",                       emoji: "🎻", label: "Sad Violin",    color: "#4ecdc4" },
  { id: "shrek",      file: "shrek-meme-music.mp3",                                                                            emoji: "🧅", label: "Shrek!",        color: "#a8e063" },
  { id: "brue",       file: "sound-brue-brue.mp3",                                                                             emoji: "🎵", label: "Brue Brue",     color: "#fd79a8" },
  { id: "mkappear",   file: "the-appearance-of-mortal-kombat.mp3",                                                             emoji: "🎮", label: "MK Appears",   color: "#a29bfe" },
  { id: "fight",      file: "the-fight-began-quotfightquot-voice-of-the-announcer-quotfightquot-from-mortal-kombat.mp3",       emoji: "👊", label: "FIGHT!",        color: "#ff6b6b" },
  { id: "happypika",  file: "the-sound-of-a-joyful-pikachu-from-the-animated-series-quotpokemonquot.mp3",                      emoji: "😊", label: "Happy Pika",    color: "#f9ca24" },
  { id: "mklaugh",    file: "the-sound-of-laughter-from-mortal-kombat.mp3",                                                    emoji: "😈", label: "MK Laugh",      color: "#e17055" },
  { id: "tuturu",     file: "tuturu.mp3",                                                                                      emoji: "📱", label: "Tuturu~",       color: "#fd79a8" },
  { id: "incredible", file: "when-i-saw-something-incredible-some-kind-of-trick.mp3",                                          emoji: "😲", label: "No Way!",       color: "#74b9ff" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SillyBoard() {
  const [active, setActive] = useState<string | null>(null);
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

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
    audio.play().catch(() => {});
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

      {/* Title */}
      <div className="text-center mb-6 relative z-10">
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
          🎛️ SILLY BOARD
        </h1>
        <p className="text-[#555] text-xs tracking-[2px] uppercase mt-1 font-[var(--font-nunito)]">
          tap a button · make noise · repeat
        </p>
      </div>

      {/* Sound Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-xl relative z-10">
        {SOUNDS.map((sound) => {
          const isActive = active === sound.id;
          return (
            <button
              key={sound.id}
              onPointerDown={() => handlePlay(sound)}
              className="flex flex-col items-center gap-2 rounded-2xl py-5 px-2 cursor-pointer select-none outline-none"
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
                touchAction: "manipulation",
                minHeight: "88px",
              }}
            >
              <span
                className="text-4xl leading-none"
                style={{ filter: isActive ? "none" : "drop-shadow(0 0 6px currentColor)" }}
              >
                {sound.emoji}
              </span>
              <span className="font-[var(--font-nunito)] font-extrabold text-[0.8rem] text-center leading-tight tracking-wide">
                {sound.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[#333] text-[0.65rem] mt-8 tracking-widest uppercase relative z-10">
        parker&apos;s silly board
      </p>
    </div>
  );
}
