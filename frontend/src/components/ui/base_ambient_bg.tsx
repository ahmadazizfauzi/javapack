import React from "react";

/**
 * Ambient radial glow & subtle grid background synced with FigCraft 04. Public Website.
 */
export function BaseAmbientBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top center indigo radial glow */}
      <div className="absolute -top-36 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[130px]" />

      {/* Upper-left subtle violet accent glow */}
      <div className="absolute top-1/4 -left-40 h-[360px] w-[360px] rounded-full bg-purple-600/15 blur-[120px]" />

      {/* Bottom right cyan radial glow */}
      <div className="absolute -bottom-32 right-[-8%] h-[460px] w-[620px] rounded-full bg-cyan-500/15 blur-[130px]" />
    </div>
  );
}
