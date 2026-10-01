export default function StarsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-space-gradient" />

      {/* Star layers */}
      <div className="stars stars-sm" />
      <div className="stars stars-md" />
      <div className="stars stars-lg" />

      {/* Subtle nebula glow */}
      <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-950/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-indigo-950/15 blur-[100px]" />
    </div>
  );
}
