import React from 'react';
import { Search, Laptop, Sparkles, Download, ArrowRight } from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';

interface HeroSectionProps {
  featuredWallpaper: Wallpaper;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExploreClick: () => void;
  onOpenMockup: (wallpaper: Wallpaper) => void;
  onOpenDetail: (wallpaper: Wallpaper) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredWallpaper,
  searchQuery,
  onSearchChange,
  onExploreClick,
  onOpenMockup,
  onOpenDetail,
}) => {
  return (
    <section className="relative pt-6 pb-12 border-b border-zinc-800/80 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Split Screen Hero: Left Typography / Right Visual Anchor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Quiet human editorial kicker (NO pill enclosures, NO comment headers) */}
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-3">
              Masterpiece Canvas Archive · Edition 2026
            </span>

            {/* Refined Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display text-balance leading-[1.08] mb-4">
              Ultra HD wallpapers for discerning workspaces.
            </h1>

            {/* Lead Prose */}
            <p className="text-base text-zinc-400 max-w-xl leading-relaxed mb-6">
              Curated 8K, 4K, and Retina canvases tailored for Apple Liquid Retina XDR, curved ultrawide monitors, and OLED smartphones. Simulated in real-time hardware mockups.
            </p>

            {/* Search Input Bar */}
            <div className="relative max-w-lg mb-6">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by keyword, mood, or tag (e.g. Nordic, OLED, Tokyo, Glass)..."
                  className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 text-xs text-zinc-500 hover:text-zinc-300 px-1.5 py-0.5"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-colors shadow-sm"
              >
                <span>Browse Curated Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onOpenMockup(featuredWallpaper)}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-medium transition-colors"
              >
                <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                <span>Simulate on MacBook Pro</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div
              onClick={() => onOpenDetail(featuredWallpaper)}
              className="group relative w-full aspect-[16/10] lg:h-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl cursor-pointer"
            >
              <img
                src={featuredWallpaper.url}
                alt={featuredWallpaper.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Overlay information */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">
                    FEATURED TODAY · 8K UHD
                  </span>
                  <h3 className="text-base font-semibold text-white drop-shadow">
                    {featuredWallpaper.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-300 mt-1">
                    <span>{featuredWallpaper.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>By {featuredWallpaper.author.name}</span>
                  </div>
                </div>

                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-xs font-medium text-white border border-white/20 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                  Inspect & Export
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Metrics Strip Below Split (per guidelines) */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
          <div>
            <span className="text-2xl font-bold text-white font-display tabular-nums">7,680 px</span>
            <p className="text-xs text-zinc-400 mt-0.5">True 8K Master Resolution</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-white font-display tabular-nums">0%</span>
            <p className="text-xs text-zinc-400 mt-0.5">Compression Loss / Pure JPG</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-white font-display tabular-nums">4 Presets</span>
            <p className="text-xs text-zinc-400 mt-0.5">MacBook, iPhone, iPad, Ultrawide</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-white font-display tabular-nums">100% Free</span>
            <p className="text-xs text-zinc-400 mt-0.5">Personal & Studio License</p>
          </div>
        </div>
      </div>
    </section>
  );
};
