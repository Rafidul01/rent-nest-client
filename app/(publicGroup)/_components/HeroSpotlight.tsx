"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  life: number;
  startR: number;
}

const LIFETIME = 0.5;
const CORE_R = 28;
const TRAIL_R = 9;
const SPAWN_GAP = 10;

export function HeroSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.parentElement;
    if (!canvas || !section) return;

    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rect = section.getBoundingClientRect();

    const resize = () => {
      rect = section.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(section);

    const pointer = { x: 0, y: 0, active: false };
    const lastSpawn = { x: 0, y: 0 };
    const particles: Particle[] = [];

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      if (!running) start();
    };

    const onEnter = (e: PointerEvent) => {
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      lastSpawn.x = pointer.x;
      lastSpawn.y = pointer.y;
      pointer.active = true;
      if (!running) start();
    };

    const onLeave = () => {
      pointer.active = false;
    };

    let running = false;
    let raf = 0;
    let lastTs = 0;

    const drawOrb = (x: number, y: number, r: number, alpha: number) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `oklch(0.92 0.16 80 / ${alpha})`);
      grad.addColorStop(1, "oklch(0.92 0.16 80 / 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (ts: number) => {
      const dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.1) : 0;
      lastTs = ts;

      ctx.clearRect(0, 0, rect.width, rect.height);

      if (pointer.active) {
        drawOrb(pointer.x, pointer.y, CORE_R, 0.55);

        const dx = pointer.x - lastSpawn.x;
        const dy = pointer.y - lastSpawn.y;
        if (Math.hypot(dx, dy) >= SPAWN_GAP) {
          particles.push({
            x: lastSpawn.x,
            y: lastSpawn.y,
            life: 0,
            startR: TRAIL_R,
          });
          lastSpawn.x = pointer.x;
          lastSpawn.y = pointer.y;
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt / LIFETIME;
        if (p.life >= 1) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.life;
        const r = Math.max(p.startR * (1 - t * t), 0.5);
        const alpha = 0.4 * (1 - t);
        drawOrb(p.x, p.y, r, alpha);
      }

      if (!pointer.active && particles.length === 0) {
        running = false;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      running = true;
      lastTs = 0;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
    };

    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      observer.disconnect();
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-screen"
    />
  );
}