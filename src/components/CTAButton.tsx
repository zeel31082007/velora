"use client";

import type { ReactNode } from "react";

interface CTAButtonProps {
  targetId: string;
  children: ReactNode;
  className?: string;
}

export default function CTAButton({ targetId, children, className = "" }: CTAButtonProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cta-button group relative overflow-hidden rounded-full px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="cta-shimmer absolute inset-0 z-[1]" aria-hidden="true" />
    </button>
  );
}
