"use client";

import { useEffect, useRef } from "react";
import { useFlyThrough } from "@/components/FlyThroughProvider";
import { waypoints } from "@/lib/campaign";

/**
 * Temporary stand-in for the real fly-through so the scroll scrubbing can be
 * tested before assets exist. It draws a receding "corridor" whose depth is
 * driven by the smoothed scroll progress — no React state, just a canvas
 * redraw per tick.
 */
export function PlaceholderRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { progress, subscribe } = useFlyThrough();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(progress.current);
    };

    const draw = (p: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const hue = 30 + p * 190;
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, `hsl(${hue} 35% 14%)`);
      bg.addColorStop(1, `hsl(${hue + 20} 30% 5%)`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Receding arches: each one scales up as progress advances, so
      // scrolling reads as "flying forward".
      const count = 14;
      const travel = p * count * 0.999;
      ctx.lineWidth = 1.5;
      for (let i = count; i >= 0; i--) {
        const z = i - (travel % 1);
        const depth = Math.max(z, 0.05);
        const scale = 1 / depth;
        const aw = w * 0.28 * scale;
        const ah = h * 0.5 * scale;
        const alpha = Math.min(1, 0.9 / depth) * Math.min(1, z);
        ctx.strokeStyle = `hsl(${hue + 10} 60% 72% / ${alpha * 0.6})`;
        ctx.beginPath();
        const cx = w / 2;
        const base = h / 2 + ah * 0.5;
        ctx.moveTo(cx - aw / 2, base);
        ctx.lineTo(cx - aw / 2, base - ah * 0.6);
        ctx.quadraticCurveTo(cx - aw / 2, base - ah, cx, base - ah * 1.05);
        ctx.quadraticCurveTo(cx + aw / 2, base - ah, cx + aw / 2, base - ah * 0.6);
        ctx.lineTo(cx + aw / 2, base);
        ctx.stroke();
      }

      // Waypoint label so you can see which "area" the camera is in.
      const nearest = waypoints.reduce((a, b) => (Math.abs(b.at - p) < Math.abs(a.at - p) ? b : a));
      ctx.fillStyle = "rgb(255 255 255 / 0.35)";
      ctx.font = "12px ui-monospace, monospace";
      ctx.textAlign = "right";
      ctx.fillText(`PLACEHOLDER · ${nearest.label} · ${(p * 100).toFixed(1)}%`, w - 20, h - 20);
    };

    resize();
    window.addEventListener("resize", resize);
    const unsubscribe = subscribe((p) => draw(p));
    return () => {
      window.removeEventListener("resize", resize);
      unsubscribe();
    };
  }, [progress, subscribe]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
