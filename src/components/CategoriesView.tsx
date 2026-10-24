import React from 'react';
import { Category, Wallpaper } from '../types/wallpaper';
import { CATEGORIES } from '../data/wallpapers';
import { ArrowRight } from 'lucide-react';

interface CategoriesViewProps {
  wallpapers: Wallpaper[];
  onSelectCategory: (cat: Category) => void;
}

const CATEGORY_META: Record<
  string,
  { headline: string; description: string; tag: string }
> = {
  Minimal: {
    headline: 'Zen & Monolithic Geometry',
    description: 'Clean lines, solitary obsidian structures, and high negative space engineered for distracted minds.',
    tag: 'Obsidian, Pure Form, Architectural',
  },
  Nature: {
    headline: 'Sublime Earth & Fjords',
    description: 'High-altitude alpenglow, Arctic fjords, deep cedar forests, and mirror-calm glacial lakes.',
    tag: 'Fjords, Alpenglow, Bamboo, Mist',
  },
  'Sci-Fi': {
    headline: 'Neo-Tokyo & Cyber Aesthetics',
    description: 'Rain-soaked asphalt, holographic signage, quantum circuitry, and cinematic cyberpunk streetscapes.',
    tag: 'Neon, Cyberpunk, Quantum, Matrix',
  },
  Abstract: {
    headline: '3D Prismatic & Caustic Refractions',
    description: 'Frosted fluted glass ribbons, chromatic dispersion curves, and architectural parametric renders.',
    tag: 'Glass, Caustics, Iridescence, Waves',
  },
  Space: {
    headline: 'Cosmic Stellar Nurseries',
    description: 'Infrared captures of ionized hydrogen gas, distant galaxies, and celestial deep-space vistas.',
    tag: 'Nebula, JWST, Starlight, Supernova',
  },
  Architecture: {
    headline: 'Brutalist & Modern Volumes',
    description: 'Cast concrete atriums, dramatic directional sunlight, and sharp geometric facades.',
    tag: 'Brutalism, Concrete, Shadow, Facades',
  },
  'OLED Dark': {
    headline: 'True 0% Black & Low-Power',
    description: 'Pixel-perfect OLED wallpapers maximizing battery life and contrast on Super Retina XDR displays.',
    tag: 'True Black, OLED, Starlight, Dunes',
  },
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  wallpapers,
  onSelectCategory,
}) => {
  const activeCategories = CATEGORIES.filter((c) => c !== 'All') as Exclude<Category, 'All'>[];

  return (
    <div className="py-10 max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
          Curated Portfolios
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white font-display mt-1">
          Explore by Aesthetic Philosophy
        </h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-xl">
          Each category represents a deliberate visual discipline—from OLED pure blacks to atmospheric alpine alpenglow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCategories.map((cat) => {
          const matching = wallpapers.filter((w) => w.category === cat);
          const cover = matching[0] || wallpapers[0];
          const meta = CATEGORY_META[cat] || {
            headline: cat,
            description: 'Ultra HD high-resolution collection.',
            tag: cat,
          };

          return (
            <div
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-all duration-300 flex flex-col hover:shadow-2xl"
            >
              {/* Cover Image */}
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-zinc-950">
                <img
                  src={cover?.thumbnailUrl || cover?.url}
                  alt={cat}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between z-10">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                      {matching.length} {matching.length === 1 ? 'Masterpiece' : 'Masterpieces'}
                    </span>
                    <h3 className="text-lg font-bold text-white font-display">
                      {cat}
                    </h3>
                  </div>

                  <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white border border-white/20 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Text Description */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200 mb-1">
                    {meta.headline}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {meta.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{meta.tag}</span>
                  <span className="text-zinc-400 group-hover:text-white transition-colors">
                    View collection →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
