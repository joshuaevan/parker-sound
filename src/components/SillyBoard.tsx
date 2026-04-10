"use client";

import { useState, useRef, useCallback } from "react";

// ─── Sound Synthesis ──────────────────────────────────────────────────────────

function playFart(ctx: AudioContext) {
  const dur = 0.65;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass";
  lp.frequency.setValueAtTime(280, ctx.currentTime);
  lp.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + dur);
  lp.Q.value = 10;
  const g = ctx.createGain();
  g.gain.setValueAtTime(1.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
  src.connect(lp); lp.connect(g); g.connect(ctx.destination);
  src.start(); src.stop(ctx.currentTime + dur);
}

function playAirHorn(ctx: AudioContext) {
  const t = ctx.currentTime;
  [220, 330, 440].forEach(freq => {
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.5);
  });
}

function playSadTrombone(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sawtooth";
  ([311, 277, 247, 185] as number[]).forEach((n, i) =>
    i === 3
      ? o.frequency.exponentialRampToValueAtTime(n, t + 0.6 + i * 0.3)
      : o.frequency.setValueAtTime(n, t + i * 0.3)
  );
  const wah = ctx.createBiquadFilter(); wah.type = "bandpass";
  wah.frequency.setValueAtTime(600, t); wah.frequency.exponentialRampToValueAtTime(200, t + 1.8);
  wah.Q.value = 4;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.01, t + 2.0);
  o.connect(wah); wah.connect(g); g.connect(ctx.destination);
  o.start(t); o.stop(t + 2.0);
}

function playRimshot(ctx: AudioContext) {
  const t = ctx.currentTime;
  const bd = ctx.createOscillator(); bd.type = "sine";
  bd.frequency.setValueAtTime(160, t); bd.frequency.exponentialRampToValueAtTime(40, t + 0.18);
  const bg = ctx.createGain(); bg.gain.setValueAtTime(1.2, t); bg.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
  bd.connect(bg); bg.connect(ctx.destination); bd.start(t); bd.stop(t + 0.22);
  const sn = ctx.createOscillator(); sn.type = "triangle";
  sn.frequency.setValueAtTime(190, t + 0.28); sn.frequency.exponentialRampToValueAtTime(50, t + 0.45);
  const sg = ctx.createGain(); sg.gain.setValueAtTime(0.8, t + 0.28); sg.gain.exponentialRampToValueAtTime(0.01, t + 0.45);
  sn.connect(sg); sg.connect(ctx.destination); sn.start(t + 0.28); sn.stop(t + 0.45);
  const nbuf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
  const nd = nbuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  const ns = ctx.createBufferSource(); ns.buffer = nbuf;
  const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7000;
  const ng = ctx.createGain(); ng.gain.setValueAtTime(0.6, t + 0.52); ng.gain.exponentialRampToValueAtTime(0.01, t + 0.9);
  ns.connect(hp); hp.connect(ng); ng.connect(ctx.destination); ns.start(t + 0.52); ns.stop(t + 0.9);
}

function playLaser(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sine";
  o.frequency.setValueAtTime(2200, t); o.frequency.exponentialRampToValueAtTime(80, t + 0.55);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.55);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.55);
}

function playBoing(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sine";
  o.frequency.setValueAtTime(80, t);
  o.frequency.exponentialRampToValueAtTime(900, t + 0.12);
  o.frequency.exponentialRampToValueAtTime(200, t + 0.5);
  o.frequency.exponentialRampToValueAtTime(700, t + 0.7);
  o.frequency.exponentialRampToValueAtTime(350, t + 1.0);
  o.frequency.exponentialRampToValueAtTime(500, t + 1.2);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.7, t); g.gain.exponentialRampToValueAtTime(0.01, t + 1.4);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.4);
}

function playExplosion(ctx: AudioContext) {
  const dur = 1.8;
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.5);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 350;
  const g = ctx.createGain(); g.gain.setValueAtTime(2.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur);
  src.connect(lp); lp.connect(g); g.connect(ctx.destination); src.start(); src.stop(ctx.currentTime + dur);
}

function playAlarm(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "square";
  for (let i = 0; i < 10; i++) o.frequency.setValueAtTime(i % 2 === 0 ? 900 : 700, t + i * 0.11);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.28, t); g.gain.setValueAtTime(0.01, t + 1.1);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.1);
}

function playMoo(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sawtooth";
  o.frequency.setValueAtTime(75, t); o.frequency.setValueAtTime(95, t + 0.35); o.frequency.setValueAtTime(75, t + 1.0);
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.01, t); g.gain.linearRampToValueAtTime(0.55, t + 0.15);
  g.gain.setValueAtTime(0.55, t + 0.9); g.gain.exponentialRampToValueAtTime(0.01, t + 1.4);
  o.connect(lp); lp.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.4);
}

function playFanfare(ctx: AudioContext) {
  const t = ctx.currentTime;
  [523, 659, 784, 1047].forEach((freq, i) => {
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t + i * 0.18); g.gain.linearRampToValueAtTime(0.4, t + i * 0.18 + 0.06);
    g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.18 + 0.35);
    o.connect(g); g.connect(ctx.destination); o.start(t + i * 0.18); o.stop(t + i * 0.18 + 0.35);
  });
}

function playRobot(ctx: AudioContext) {
  const t = ctx.currentTime;
  [300, 450, 350, 550, 250, 400].forEach((freq, i) => {
    const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t + i * 0.14); g.gain.setValueAtTime(0.01, t + i * 0.14 + 0.11);
    o.connect(g); g.connect(ctx.destination); o.start(t + i * 0.14); o.stop(t + i * 0.14 + 0.14);
  });
}

function playPartyHorn(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sawtooth";
  o.frequency.setValueAtTime(700, t); o.frequency.exponentialRampToValueAtTime(1400, t + 0.6);
  const vibr = ctx.createOscillator(); vibr.frequency.value = 8;
  const vibGain = ctx.createGain(); vibGain.gain.value = 30;
  vibr.connect(vibGain); vibGain.connect(o.frequency);
  const g = ctx.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.7);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.7); vibr.start(t); vibr.stop(t + 0.7);
}

function playScream(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sawtooth";
  o.frequency.setValueAtTime(400, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.3);
  o.frequency.exponentialRampToValueAtTime(600, t + 0.6); o.frequency.exponentialRampToValueAtTime(1100, t + 0.9);
  const dist = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const x = (i * 2) / 256 - 1; curve[i] = (Math.PI + 200) * x / (Math.PI + 200 * Math.abs(x)); }
  dist.curve = curve;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.01, t + 1.1);
  o.connect(dist); dist.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1.1);
}

function playWhoopee(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sine";
  o.frequency.setValueAtTime(500, t);
  o.frequency.exponentialRampToValueAtTime(100, t + 0.4);
  o.frequency.setValueAtTime(500, t + 0.42);
  o.frequency.exponentialRampToValueAtTime(100, t + 0.82);
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 800;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.8, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.9);
  o.connect(lp); lp.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.9);
}

function playWrong(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = 80;
  const g = ctx.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.8);
}

function playVictory(ctx: AudioContext) {
  const t = ctx.currentTime;
  [392, 523, 659, 784, 1047].forEach((freq, i) => {
    const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t + i * 0.1); g.gain.linearRampToValueAtTime(0.45, t + i * 0.1 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.4);
    o.connect(g); g.connect(ctx.destination); o.start(t + i * 0.1); o.stop(t + i * 0.1 + 0.4);
  });
}

// ─── Sound Definitions ────────────────────────────────────────────────────────

type Sound = {
  id: string;
  emoji: string;
  label: string;
  color: string;
  fn: (ctx: AudioContext) => void;
};

const SOUNDS: Sound[] = [
  { id: "fart",      emoji: "💨", label: "Fart",         color: "#a8e063", fn: playFart },
  { id: "airhorn",   emoji: "📯", label: "Air Horn",     color: "#ff6b6b", fn: playAirHorn },
  { id: "sadtrom",   emoji: "😢", label: "Sad Trombone", color: "#4ecdc4", fn: playSadTrombone },
  { id: "rimshot",   emoji: "🥁", label: "Ba Dum Tss",   color: "#ffe66d", fn: playRimshot },
  { id: "laser",     emoji: "🔫", label: "Laser",        color: "#a29bfe", fn: playLaser },
  { id: "boing",     emoji: "🌀", label: "Boing!",       color: "#fd79a8", fn: playBoing },
  { id: "explosion", emoji: "💥", label: "Explosion",    color: "#e17055", fn: playExplosion },
  { id: "alarm",     emoji: "🚨", label: "Alarm",        color: "#ff7675", fn: playAlarm },
  { id: "moo",       emoji: "🐄", label: "Moo",          color: "#55efc4", fn: playMoo },
  { id: "fanfare",   emoji: "🎺", label: "Fanfare",      color: "#fdcb6e", fn: playFanfare },
  { id: "robot",     emoji: "🤖", label: "Robot",        color: "#74b9ff", fn: playRobot },
  { id: "partyhorn", emoji: "🎉", label: "Party Horn",   color: "#ff9ff3", fn: playPartyHorn },
  { id: "scream",    emoji: "😱", label: "Scream",       color: "#f9ca24", fn: playScream },
  { id: "whoopee",   emoji: "🤣", label: "Whoopee",      color: "#6ab04c", fn: playWhoopee },
  { id: "wrong",     emoji: "❌", label: "WRONG",        color: "#eb4d4b", fn: playWrong },
  { id: "victory",   emoji: "🏆", label: "Victory!",     color: "#f0932b", fn: playVictory },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SillyBoard() {
  const [active, setActive] = useState<string | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const handlePlay = useCallback((sound: Sound) => {
    sound.fn(getCtx());
    setActive(sound.id);
    setTimeout(() => setActive(null), 700);
  }, [getCtx]);

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
        All sounds synthesized in your browser
      </p>
    </div>
  );
}
