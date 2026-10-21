"use client";

import { PlaceholderRenderer } from "./PlaceholderRenderer";

/**
 * The fixed background layer. The renderer (3D model or frame sequence) sits
 * at the bottom; the vignette and gradient layers above it keep the overlay
 * typography readable no matter what frame is showing.
 */
export function FlyThroughStage() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      {/* TODO: replace with the chosen renderer (R3F scene or frame-sequence canvas). */}
      <PlaceholderRenderer />

      {/* Top/bottom gradient for nav + body copy legibility. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/80" />
      {/* Radial vignette to pull focus to the centre of the frame. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(5_6_10/0.85)_100%)]" />
      {/* Subtle film grain. */}
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}
