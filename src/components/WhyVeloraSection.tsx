const features = [
  {
    title: "Preserve Forever",
    description:
      "Capture the moments that matter and keep them safe in your personal cosmos — untouched by time.",
  },
  {
    title: "Revisit Anytime",
    description:
      "Step back into any memory whenever you need to feel it again. Emotions, preserved exactly as you left them.",
  },
  {
    title: "Your Universe",
    description:
      "Every memory connects. Build a constellation of experiences that tells the story only you can tell.",
  },
];

export default function WhyVeloraSection() {
  return (
    <section
      id="why-velora"
      className="relative z-10 px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-300/80">
            Discover
          </p>
          <h2 className="mt-4 font-display text-4xl font-light tracking-[0.08em] text-white sm:text-5xl">
            Why Velora?
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-violet-400/10 bg-violet-950/20 p-8 backdrop-blur-sm transition-colors duration-500 hover:border-violet-400/25 hover:bg-violet-950/30"
            >
              <div className="mb-4 h-px w-8 bg-gradient-to-r from-violet-400/80 to-blue-400/40 transition-all duration-500 group-hover:w-12" />
              <h3 className="font-display text-xl tracking-wide text-violet-100">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
