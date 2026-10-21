#!/usr/bin/env node
// Builds a scroll-scrubbable fly-through from still images (architectural
// renderings, site photos) by animating a virtual camera push on each shot
// and cross-fading between them. Output goes through extract-frames.sh, so
// the result is the same WebP sequence + manifest a drone video produces.
//
//   node scripts/stills-to-frames.mjs [config=assets/flythrough/stills.json]
//
// Shot images are resolved relative to the config file.

import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(process.argv[2] ?? join(root, "assets/flythrough/stills.json"));
const config = JSON.parse(readFileSync(configPath, "utf8"));
const { fps = 24, width = 1920, height = 1080, crossfade = 18, shots } = config;

if (!shots?.length) throw new Error("config has no shots");

const inputs = [];
const filters = [];
// Upscale before zoompan: it snaps the crop to whole pixels, so a large
// source keeps the push-in from visibly stepping.
const work = `${width * 4}:${height * 4}`;

shots.forEach((shot, i) => {
  const [fx, fy] = shot.focus ?? [0.5, 0.5];
  const [z0, z1] = shot.zoom ?? [1, 1.3];
  const d = shot.frames;
  // Exponential zoom so the push reads as constant speed; the focus point
  // stays put on screen while everything scales around it.
  const z = `${z0}*pow(${z1 / z0},on/${d - 1})`;
  inputs.push("-i", resolve(dirname(configPath), shot.image));
  filters.push(
    `[${i}:v]scale=${work}:force_original_aspect_ratio=increase,crop=${work},` +
      `zoompan=z='${z}':x='(iw-iw/zoom)*${fx}':y='(ih-ih/zoom)*${fy}':d=${d}:s=${width}x${height}:fps=${fps},` +
      `setsar=1,format=yuv420p[s${i}]`,
  );
});

let last = "s0";
let length = shots[0].frames;
for (let i = 1; i < shots.length; i++) {
  const out = i === shots.length - 1 ? "out" : `x${i}`;
  const offset = (length - crossfade) / fps;
  filters.push(`[${last}][s${i}]xfade=transition=fade:duration=${crossfade / fps}:offset=${offset}[${out}]`);
  length += shots[i].frames - crossfade;
  last = out;
}
if (shots.length === 1) filters.push("[s0]null[out]");

const tmp = mkdtempSync(join(tmpdir(), "flythrough-"));
const video = join(tmp, "flight.mp4");
try {
  console.log(`Rendering ${shots.length} shots → ~${length} frames…`);
  execFileSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", ...inputs, "-filter_complex", filters.join(";"),
      "-map", "[out]", "-c:v", "libx264", "-crf", "12", "-preset", "slow", video],
    { stdio: "inherit" },
  );
  execFileSync(join(root, "scripts/extract-frames.sh"), [video, String(fps), String(width)], { stdio: "inherit" });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
