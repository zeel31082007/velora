import CTAButton from "@/components/CTAButton";
import VeloraLogo from "@/components/VeloraLogo";

export default function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="animate-fade-in-up animation-delay-100 mb-6 text-sm font-medium uppercase tracking-[0.35em] text-violet-300/80">
        The Story Never Ends.
      </p>

      <VeloraLogo />

      <h1 className="animate-fade-in-up animation-delay-200 font-display text-[clamp(4rem,15vw,9rem)] font-light leading-none tracking-[0.12em] text-white">
        VELORA
      </h1>

      <div className="animate-fade-in-up animation-delay-300 mx-auto mt-8 h-px w-24 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

      <p className="animate-fade-in-up animation-delay-400 mt-8 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
        Preserve moments. Revisit emotions. Build your own universe of
        memories.
      </p>

      <CTAButton
        targetId="your-universe"
        className="animate-fade-in-up animation-delay-500 mt-12"
      >
        Begin Your Journey
      </CTAButton>
    </section>
  );
}
