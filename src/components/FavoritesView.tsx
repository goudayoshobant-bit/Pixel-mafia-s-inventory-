import React from 'react';
import { Wallpaper } from '../types/wallpaper';
import { WallpaperCard } from './WallpaperCard';
import { Heart, Trash2, ArrowRight } from 'lucide-react';

interface FavoritesViewProps {
  favorites: Wallpaper[];
  onToggleFavorite: (id: string) => void;
  onClickWallpaper: (wallpaper: Wallpaper) => void;
  onOpenMockup: (wallpaper: Wallpaper) => void;
  onClearAll: () => void;
  onBrowseCurated: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onToggleFavorite,
  onClickWallpaper,
  onOpenMockup,
  onClearAll,
  onBrowseCurated,
}) => {
  if (favorites.length === 0) {
    return (
      <div className="py-20 max-w-xl mx-auto px-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <Heart className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white font-display">No saved wallpapers yet</h3>
        <p className="text-sm text-zinc-400 mt-2 mb-6">
          Bookmark wallpapers you love by clicking the heart icon on any card. They will stay stored in your local studio collection.
        </p>
        <button
          onClick={onBrowseCurated}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-colors shadow-sm"
        >
          <span>Explore Curated 8K Wallpapers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Your Personal Stash
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white font-display mt-1">
            Saved Wallpapers ({favorites.length})
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-900/50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            isFavorited={true}
            onToggleFavorite={onToggleFavorite}
            onClick={onClickWallpaper}
            onOpenMockup={onOpenMockup}
          />
        ))}
      </div>
    </div>
  );
};
