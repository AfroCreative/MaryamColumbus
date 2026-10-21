"use client";

import { useCallback, useEffect, useState } from "react";
import { MANIFEST_URL, type FrameManifest } from "@/lib/flythrough";
import { FrameSequenceRenderer } from "./FrameSequenceRenderer";
import { PlaceholderRenderer } from "./PlaceholderRenderer";

/**
 * The fixed background layer. The frame-sequence renderer sits at the bottom
 * (falling back to a procedural placeholder until frames are dropped into
 * public/flythrough/frames); the vignette and gradient layers above it keep
 * the overlay typography readable no matter what frame is showing.
 */
export function FlyThroughStage() {
  const [manifest, setManifest] = useState<FrameManifest | null>(null);
  const [missing, setMissing] = useState(false);
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    let active = true;
    fetch(MANIFEST_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((m: FrameManifest) => {
        if (active && m.count > 0) setManifest(m);
        else if (active) setMissing(true);
      })
      .catch(() => {
        if (active) setMissing(true);
        if (process.env.NODE_ENV !== "production") {
          console.info(
            `[fly-through] No frames at ${MANIFEST_URL} — showing placeholder. Run scripts/extract-frames.sh to add footage.`,
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink">
      {missing && <PlaceholderRenderer />}
      {manifest && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <FrameSequenceRenderer manifest={manifest} onReady={handleReady} />
        </div>
      )}

      {/* Top/bottom gradient for nav + body copy legibility. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/80" />
      {/* Radial vignette to pull focus to the centre of the frame. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(5_6_10/0.85)_100%)]" />
      {/* Subtle film grain. */}
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
    </div>
  );
}
