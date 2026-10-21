"use client";

import { useEffect, useRef } from "react";
import { useFlyThrough } from "@/components/FlyThroughProvider";
import { frameUrl, progressiveOrder, type FrameManifest } from "@/lib/flythrough";

const CONCURRENCY = 6;

/**
 * Draws a pre-rendered flight (numbered image frames) to a canvas, choosing
 * the frame from the smoothed scroll progress. Frames stream in
 * coarse-to-fine; until a frame is loaded the nearest loaded neighbour is
 * shown, so scrubbing never blanks.
 */
export function FrameSequenceRenderer({
  manifest,
  onReady,
}: {
  manifest: FrameManifest;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { progress, subscribe } = useFlyThrough();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const { count } = manifest;
    const frames: (HTMLImageElement | undefined)[] = new Array(count);
    let drawn = -1;
    let cancelled = false;
    let readyFired = false;

    const nearestLoaded = (target: number) => {
      if (frames[target]) return target;
      for (let d = 1; d < count; d++) {
        if (target - d >= 0 && frames[target - d]) return target - d;
        if (target + d < count && frames[target + d]) return target + d;
      }
      return -1;
    };

    const draw = (force = false) => {
      const index = nearestLoaded(Math.round(progress.current * (count - 1)));
      if (index < 0 || (index === drawn && !force)) return;
      const img = frames[index]!;
      const cw = canvas.width;
      const ch = canvas.height;
      // object-fit: cover
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      drawn = index;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.imageSmoothingQuality = "high";
      draw(true);
    };

    // Stream frames with bounded concurrency in progressive order.
    const queue = progressiveOrder(count);
    const loadNext = async (): Promise<void> => {
      const index = queue.shift();
      if (index === undefined || cancelled) return;
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(manifest, index);
      try {
        await img.decode();
        if (cancelled) return;
        frames[index] = img;
        if (!readyFired) {
          readyFired = true;
          onReady?.();
        }
        // Redraws only if this frame is now the closest to the playhead.
        draw();
      } catch {
        // Missing/corrupt frame: neighbours will cover for it.
      }
      return loadNext();
    };

    resize();
    for (let i = 0; i < CONCURRENCY; i++) void loadNext();

    window.addEventListener("resize", resize);
    const unsubscribe = subscribe(() => draw());
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
      unsubscribe();
    };
  }, [manifest, onReady, progress, subscribe]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
