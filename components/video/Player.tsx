"use client";

import { useRef, useState, useEffect } from "react";

interface PlayerProps {
  src?: string;
  title?: string;
}

export default function Player({ src, title }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    return () => { v.removeEventListener("timeupdate", onTime); v.removeEventListener("loadedmetadata", onMeta); };
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) videoRef.current.currentTime = pct * duration;
  };

  const changeSpeed = () => {
    const speeds = [0.5, 1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  if (!src) {
    return (
      <div
        className="aspect-video flex flex-col items-center justify-center rounded-xl"
        style={{ background: "#12122A", border: "1px solid #1E1E3A" }}
      >
        <div className="text-4xl mb-3">🎬</div>
        <p className="text-sm font-medium" style={{ color: "#8888AA" }}>
          Video coming soon
        </p>
        <p className="text-xs mt-1" style={{ color: "#4A4A5A" }}>
          {title}
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative rounded-xl overflow-hidden group" style={{ background: "#000" }}>
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onClick={toggle}
        style={{ cursor: "pointer" }}
      />

      {/* Controls overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(transparent, #00000099)" }}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="h-1 rounded-full cursor-pointer"
          style={{ background: "#1E1E3A" }}
          onClick={seek}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              background: "#58C4DD",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 text-xs" style={{ color: "#E8E8F0" }}>
          <button onClick={toggle} style={{ color: "#58C4DD" }}>
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                <rect x="4" y="2" width="4" height="14" rx="1" />
                <rect x="10" y="2" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                <path d="M4 2l12 7-12 7z" />
              </svg>
            )}
          </button>

          <span className="font-mono" style={{ color: "#8888AA" }}>
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          <button onClick={changeSpeed} className="font-mono font-bold" style={{ color: "#FFFF00" }}>
            {speed}x
          </button>

          <div className="ml-auto">
            <button onClick={toggleFullscreen} style={{ color: "#8888AA" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                {fullscreen ? (
                  <path d="M6 6V2H4v2H2v2h4zm4-4h-2v4h4V4h-2V2zm2 8h-2v2h-2v2h4v-4zM4 10H2v4h4v-2H4v-2z" />
                ) : (
                  <path d="M2 2h4v2H4v2H2V2zm8 0h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm10 2h2v2h-4v-2h2v-2h2v2z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
