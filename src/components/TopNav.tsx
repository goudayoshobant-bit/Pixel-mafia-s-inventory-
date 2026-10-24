import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface TopNavProps {
  activeTab: 'curated' | 'pixelmafia' | 'categories' | 'mockup' | 'favorites';
  onSelectTab: (tab: 'curated' | 'pixelmafia' | 'categories' | 'mockup' | 'favorites') => void;
  onOpenAIStudio: () => void;
  onOpenUploadModal: () => void;
  onOpenModeratorLogin: () => void;
  isModerator: boolean;
  favoritesCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAIStudio,
  onOpenUploadModal,
  onOpenModeratorLogin,
  isModerator,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('curated')}
          className="text-xl font-bold tracking-tight text-white font-display hover:text-zinc-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" />
          <span>Lumina</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-zinc-400">
          <button
            onClick={() => onSelectTab('pixelmafia')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'pixelmafia' ? 'text-amber-400 font-semibold' : 'hover:text-amber-300'
            }`}
          >
            <span className="text-xs">👑</span>
            <span>Pixel Mafia Feed</span>
          </button>

          <button
            onClick={() => onSelectTab('curated')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'curated' ? 'text-white' : ''
            }`}
          >
            Curated 8K
          </button>

          <button
            onClick={() => onSelectTab('categories')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'categories' ? 'text-white' : ''
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => onSelectTab('mockup')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'mockup' ? 'text-white' : ''
            }`}
          >
            Mockup Studio
          </button>

          <button
            onClick={() => onSelectTab('favorites')}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              activeTab === 'favorites' ? 'text-white' : ''
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-rose-500 fill-current' : ''}`} />
            <span>Saved ({favoritesCount})</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action & discreet mod access */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isModerator ? (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              <span>+ Add Photo / Video</span>
            </button>
          ) : null}

          <button
            onClick={onOpenAIStudio}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-zinc-950 bg-white rounded-xl hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Studio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
