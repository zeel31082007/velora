"use client";

import { useCallback, useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -9999, y: -9999 });
  const current = useRef({ x: -9999, y: -9999 });
  const visible = useRef(false);
  const rafId = useRef<number>(0);

  const tick = useCallback(() => {
    const el = glowRef.current;
    if (!el) return;

    const lerp = 0.12;
    current.current.x += (target.current.x - current.current.x) * lerp;
    current.current.y += (target.current.y - current.current.y) * lerp;

    el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%)`;
    el.style.opacity = visible.current ? "1" : "0";

    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      visible.current = true;
    };

    const onLeave = () => {
      visible.current = false;
    };

    rafId.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [tick]);

  return (
    <div
      ref={glowRef}
      className="cursor-glow pointer-events-none fixed left-0 top-0 z-[5] opacity-0 transition-opacity duration-300"
      aria-hidden="true"
    />
  );
}
