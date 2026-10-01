"use client";

import { useEffect, useState } from "react";

interface NasaImage {
  nasa_id: string;
  title: string;
  description?: string;
  date_created?: string;
  image_url?: string;
}

interface NasaSearchResponse {
  collection: {
    items: Array<{
      data: Array<{
        nasa_id: string;
        title: string;
        description?: string;
        date_created?: string;
      }>;
      links?: Array<{
        href: string;
        rel: string;
        render?: string;
      }>;
    }>;
  };
}

export default function CosmicDiscovery() {
  const [image, setImage] = useState<NasaImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCosmicDiscovery = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://images-api.nasa.gov/search?q=galaxy&media_type=image"
        );

        if (!response.ok) {
          throw new Error(`NASA API error: ${response.status}`);
        }

        const data: NasaSearchResponse = await response.json();

        const firstItem = data.collection.items[0];

        if (!firstItem) {
          throw new Error("No NASA images found.");
        }

        const itemData = firstItem.data[0];

        const imageLink = firstItem.links?.find(
          (link) => link.render === "image"
        );

        setImage({
          nasa_id: itemData.nasa_id,
          title: itemData.title,
          description: itemData.description,
          date_created: itemData.date_created,
          image_url: imageLink?.href,
        });
      } catch (err) {
        console.error("NASA API error:", err);
        setError("Cosmic data could not be loaded right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchCosmicDiscovery();
  }, []);

  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300/70">
          Cosmic Discovery
        </p>

        <h2 className="mt-3 font-display text-3xl font-light tracking-wide text-white sm:text-4xl">
          Beyond Your Universe
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Discover something new from the universe, updated with live NASA data.
        </p>
      </div>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-xl">
          <p className="animate-pulse text-sm text-violet-200/70">
            Traveling beyond the stars...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-400/10 bg-red-950/10 p-10 text-center">
          <p className="text-sm text-zinc-400">{error}</p>
        </div>
      )}

      {image && (
        <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_0_80px_rgba(139,92,246,0.08)] backdrop-blur-xl">
          {image.image_url && (
            <div className="overflow-hidden">
              <img
                src={image.image_url}
                alt={image.title}
                className="h-auto max-h-[600px] w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-violet-200/80">
                NASA
              </span>

              {image.date_created && (
                <span className="text-xs text-zinc-500">
                  {new Date(image.date_created).toLocaleDateString()}
                </span>
              )}
            </div>

            <h3 className="mt-5 text-2xl font-light text-white sm:text-3xl">
              {image.title}
            </h3>

            {image.description && (
              <p className="mt-5 text-sm leading-7 text-zinc-400">
                {image.description}
              </p>
            )}
          </div>
        </article>
      )}
    </section>
  );
}