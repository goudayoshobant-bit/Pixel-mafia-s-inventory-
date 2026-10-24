import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_WALLPAPERS } from './data/wallpapers';
import { Wallpaper, Category, DeviceType, ColorFilter } from './types/wallpaper';
import { TopNav } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { WallpaperCard } from './components/WallpaperCard';
import { CategoriesView } from './components/CategoriesView';
import { FavoritesView } from './components/FavoritesView';
import { MockupStudioView } from './components/MockupStudioView';
import { DeviceMockupSimulator } from './components/DeviceMockupSimulator';
import { WallpaperDetailModal } from './components/WallpaperDetailModal';
import { StudioAdjusterModal } from './components/StudioAdjusterModal';
import { AIWallpaperStudio } from './components/AIWallpaperStudio';
import { CreatorInstagramHub } from './components/CreatorInstagramHub';
import { UploadMediaModal } from './components/UploadMediaModal';
import { ModeratorControlBar } from './components/ModeratorControlBar';
import { ModeratorLoginModal } from './components/ModeratorLoginModal';
import { Footer } from './components/Footer';
import { X, Sparkles, Sliders, Flame, Instagram, ArrowRight } from 'lucide-react';

export default function App() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_custom_wallpapers');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_WALLPAPERS];
      }
    } catch {
      // fallback
    }
    return INITIAL_WALLPAPERS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_favorites');
      return saved ? JSON.parse(saved) : ['pixelmafia-naruto-throne', 'pixelmafia-glowing-forest-rose'];
    } catch {
      return ['pixelmafia-naruto-throne'];
    }
  });

  // Moderator state (strictly for admin, hidden from regular visitors/customers)
  const [isModerator, setIsModerator] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lumina_mod_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isModLoginOpen, setIsModLoginOpen] = useState(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'curated' | 'pixelmafia' | 'categories' | 'mockup' | 'favorites'>('pixelmafia');

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('all');
  const [selectedColor, setSelectedColor] = useState<ColorFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'curated' | 'downloads' | 'likes' | 'resolution'>('curated');
  const [layoutMode, setLayoutMode] = useState<'bento' | 'uniform'>('bento');

  // Modals state
  const [detailWallpaper, setDetailWallpaper] = useState<Wallpaper | null>(null);
  const [mockupModalWallpaper, setMockupModalWallpaper] = useState<Wallpaper | null>(null);
  const [adjusterWallpaper, setAdjusterWallpaper] = useState<Wallpaper | null>(null);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lumina_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddNewWallpaper = (newWp: Wallpaper) => {
    setWallpapers((prev) => [newWp, ...prev]);
    try {
      const saved = localStorage.getItem('lumina_custom_wallpapers');
      const customList = saved ? JSON.parse(saved) : [];
      localStorage.setItem('lumina_custom_wallpapers', JSON.stringify([newWp, ...customList]));
    } catch {
      // fallback
    }
    setActiveTab('curated');
    setDetailWallpaper(newWp);
  };

  // Filtered and sorted wallpapers list
  const filteredWallpapers = useMemo(() => {
    return wallpapers
      .filter((wp) => {
        // Category filter
        if (selectedCategory !== 'All' && wp.category !== selectedCategory) {
          return false;
        }

        // Device filter
        if (selectedDevice !== 'all' && wp.device !== selectedDevice) {
          return false;
        }

        // Color filter
        if (selectedColor !== 'all' && wp.dominantColor !== selectedColor) {
          return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = wp.title.toLowerCase().includes(q);
          const matchDesc = wp.description.toLowerCase().includes(q);
          const matchTags = wp.tags.some((t) => t.toLowerCase().includes(q));
          const matchAuthor = wp.author.name.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTags && !matchAuthor) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') return b.downloads - a.downloads;
        if (sortBy === 'likes') return b.likes - a.likes;
        if (sortBy === 'resolution') return b.rawWidth * b.rawHeight - a.rawWidth * a.rawHeight;
        // Default: featured first, then id
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [wallpapers, selectedCategory, selectedDevice, selectedColor, searchQuery, sortBy]);

  const favoritedObjects = useMemo(() => {
    return wallpapers.filter((w) => favorites.includes(w.id));
  }, [wallpapers, favorites]);

  const handleModLoginSuccess = () => {
    setIsModerator(true);
    try {
      localStorage.setItem('lumina_mod_auth', 'true');
    } catch {
      // fallback
    }
  };

  const handleModLogout = () => {
    setIsModerator(false);
    try {
      localStorage.removeItem('lumina_mod_auth');
    } catch {
      // fallback
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-white">
      {/* Moderator Control Bar (Strictly visible only to authenticated moderators) */}
      {isModerator && (
        <ModeratorControlBar
          onOpenUpload={() => setIsUploadModalOpen(true)}
          onLogout={handleModLogout}
          totalWallpapers={wallpapers.length}
        />
      )}

      {/* Top Bar Contract Compliant Header */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAIStudio={() => setIsAIStudioOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenModeratorLogin={() => setIsModLoginOpen(true)}
        isModerator={isModerator}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Pixel Mafia Instagram Feed Tab */}
        {activeTab === 'pixelmafia' && (
          <CreatorInstagramHub
            wallpapers={wallpapers}
            onOpenDetail={(wp) => setDetailWallpaper(wp)}
            onOpenMockup={(wp) => setMockupModalWallpaper(wp)}
            onToggleFavorite={toggleFavorite}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            isModerator={isModerator}
            favorites={favorites}
          />
        )}

        {activeTab === 'curated' && (
          <>
            {/* Quick Instagram Creator Banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-zinc-900 to-rose-500/10 border-b border-zinc-800 py-2.5 px-6">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span className="text-amber-400 font-bold">🔥 Pixel Mafia 👑</span>
                  <span className="text-zinc-500">·</span>
                  <span>Official download portal for Instagram <strong>@aesthetic_walls_01</strong></span>
                </div>
                <button
                  onClick={() => setActiveTab('pixelmafia')}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  <span>View Instagram Reel Drops</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Split Screen Hero with 8K Feature */}
            <HeroSection
              featuredWallpaper={wallpapers[0]}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onExploreClick={() => {
                const galleryEl = document.getElementById('wallpaper-gallery');
                if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenMockup={(wp) => setMockupModalWallpaper(wp)}
              onOpenDetail={(wp) => setDetailWallpaper(wp)}
            />

            {/* Filter Bar */}
            <div id="wallpaper-gallery">
              <FilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedDevice={selectedDevice}
                onSelectDevice={setSelectedDevice}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                sortBy={sortBy}
                onSelectSortBy={setSortBy}
                layoutMode={layoutMode}
                onToggleLayoutMode={() =>
                  setLayoutMode((prev) => (prev === 'bento' ? 'uniform' : 'bento'))
                }
                totalCount={filteredWallpapers.length}
              />
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10">
              {filteredWallpapers.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-zinc-400 text-sm mb-4">
                    No wallpapers match your selected filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedDevice('all');
                      setSelectedColor('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : layoutMode === 'bento' ? (
                /* Dynamic Bento Box: 1st card large span, varied rhythmic grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWallpapers.map((wallpaper, idx) => {
                    const isFeaturedBento = idx === 0 && !searchQuery && selectedCategory === 'All';
                    return (
                      <div
                        key={wallpaper.id}
                        className={isFeaturedBento ? 'sm:col-span-2' : 'col-span-1'}
                      >
                        <WallpaperCard
                          wallpaper={wallpaper}
                          isFavorited={favorites.includes(wallpaper.id)}
                          onToggleFavorite={toggleFavorite}
                          onClick={(wp) => setDetailWallpaper(wp)}
                          onOpenMockup={(wp) => setMockupModalWallpaper(wp)}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Uniform Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWallpapers.map((wallpaper) => (
                    <WallpaperCard
                      key={wallpaper.id}
                      wallpaper={wallpaper}
                      isFavorited={favorites.includes(wallpaper.id)}
                      onToggleFavorite={toggleFavorite}
                      onClick={(wp) => setDetailWallpaper(wp)}
                      onOpenMockup={(wp) => setMockupModalWallpaper(wp)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <CategoriesView
            wallpapers={wallpapers}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveTab('curated');
            }}
          />
        )}

        {/* Stand-Alone Mockup Studio View */}
        {activeTab === 'mockup' && (
          <MockupStudioView
            wallpapers={wallpapers}
            initialWallpaper={wallpapers[0]}
            onOpenAdjuster={(wp) => setAdjusterWallpaper(wp)}
          />
        )}

        {/* Saved / Favorites View */}
        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favoritedObjects}
            onToggleFavorite={toggleFavorite}
            onClickWallpaper={(wp) => setDetailWallpaper(wp)}
            onOpenMockup={(wp) => setMockupModalWallpaper(wp)}
            onClearAll={() => setFavorites([])}
            onBrowseCurated={() => setActiveTab('curated')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('curated');
        }}
        onOpenAIStudio={() => setIsAIStudioOpen(true)}
        onOpenModeratorLogin={() => setIsModLoginOpen(true)}
        isModerator={isModerator}
      />

      {/* Fullscreen Detail Lightbox Modal */}
      {detailWallpaper && (
        <WallpaperDetailModal
          wallpaper={detailWallpaper}
          isFavorited={favorites.includes(detailWallpaper.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setDetailWallpaper(null)}
          onOpenMockup={(wp) => {
            setDetailWallpaper(null);
            setMockupModalWallpaper(wp);
          }}
          onOpenAdjuster={(wp) => {
            setDetailWallpaper(null);
            setAdjusterWallpaper(wp);
          }}
          onTagClick={(tag) => {
            setSearchQuery(tag);
            setActiveTab('curated');
          }}
        />
      )}

      {/* Pop-up Device Mockup Simulator Modal */}
      {mockupModalWallpaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-6xl h-[92vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <button
              onClick={() => setMockupModalWallpaper(null)}
              className="absolute top-4 right-4 z-50 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-xl border border-zinc-700 transition-colors"
              title="Close Mockup"
            >
              <X className="w-4 h-4" />
            </button>
            <DeviceMockupSimulator
              wallpaper={mockupModalWallpaper}
              onClose={() => setMockupModalWallpaper(null)}
              onOpenAdjuster={(wp) => {
                setMockupModalWallpaper(null);
                setAdjusterWallpaper(wp);
              }}
            />
          </div>
        </div>
      )}

      {/* Studio Adjuster Modal */}
      {adjusterWallpaper && (
        <StudioAdjusterModal
          wallpaper={adjusterWallpaper}
          onClose={() => setAdjusterWallpaper(null)}
          onOpenMockup={(wp) => {
            setAdjusterWallpaper(null);
            setMockupModalWallpaper(wp);
          }}
        />
      )}

      {/* AI Wallpaper Generator Studio */}
      {isAIStudioOpen && (
        <AIWallpaperStudio
          onClose={() => setIsAIStudioOpen(false)}
          onWallpaperCreated={handleAddNewWallpaper}
        />
      )}

      {/* Upload Photo or Live Video Wallpaper Modal (Moderator Only) */}
      {isUploadModalOpen && isModerator && (
        <UploadMediaModal
          onClose={() => setIsUploadModalOpen(false)}
          onWallpaperAdded={handleAddNewWallpaper}
        />
      )}

      {/* Moderator Login Passcode Modal */}
      <ModeratorLoginModal
        isOpen={isModLoginOpen}
        onClose={() => setIsModLoginOpen(false)}
        onLoginSuccess={handleModLoginSuccess}
      />
    </div>
  );
}
