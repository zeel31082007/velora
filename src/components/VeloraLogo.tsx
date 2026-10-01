
export default function VeloraLogo() {
  return (
    <div className="animate-fade-in-up animation-delay-150 relative mb-5 flex h-32 w-32 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-2xl" />

      <img
        src="/velora/velora-logo.png"
        alt="Velora"
        className="relative h-32 w-32 object-contain drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]"
      />
    </div>
  );
}