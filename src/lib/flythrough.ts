// Fly-through asset configuration. Frames live in public/flythrough/frames and
// are described by manifest.json (written by scripts/extract-frames.sh), so
// swapping footage never requires a code change.

export const FRAMES_BASE = "/flythrough/frames";
export const MANIFEST_URL = `${FRAMES_BASE}/manifest.json`;

export interface FrameManifest {
  /** Total number of frames in the sequence. */
  count: number;
  /** File name pattern; `{n}` is replaced by the zero-padded frame number. */
  pattern: string;
  /** Zero-padding width for `{n}` (e.g. 4 → 0001). */
  pad: number;
  /** First frame number (ffmpeg starts at 1). */
  start?: number;
}

export function frameUrl(manifest: FrameManifest, index: number): string {
  const n = String((manifest.start ?? 1) + index).padStart(manifest.pad, "0");
  return `${FRAMES_BASE}/${manifest.pattern.replace("{n}", n)}`;
}

/**
 * Load order: coarse keyframes first, then progressively finer passes, so the
 * whole flight can be scrubbed almost immediately (at reduced temporal
 * resolution) while the gaps fill in.
 */
export function progressiveOrder(count: number): number[] {
  const order: number[] = [];
  const seen = new Uint8Array(count);
  for (let step = 2 ** Math.floor(Math.log2(Math.max(count, 1))); step >= 1; step = step / 2) {
    for (let i = 0; i < count; i += step) {
      if (!seen[i]) {
        seen[i] = 1;
        order.push(i);
      }
    }
  }
  if (!seen[count - 1]) order.push(count - 1);
  return order;
}
