import React, { useState } from 'react';
import { 
  Instagram, 
  ExternalLink, 
  Check, 
  Copy, 
  Download, 
  Heart, 
  Eye, 
  Laptop, 
  Flame, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';

interface CreatorInstagramHubProps {
  wallpapers: Wallpaper[];
  onOpenDetail: (wallpaper: Wallpaper) => void;
  onOpenMockup: (wallpaper: Wallpaper) => void;
  onToggleFavorite: (id: string) => void;
  onOpenUploadModal?: () => void;
  isModerator?: boolean;
  favorites: string[];
}

export const CreatorInstagramHub: React.FC<CreatorInstagramHubProps> = ({
  wallpapers,
  onOpenDetail,
  onOpenMockup,
  onToggleFavorite,
  onOpenUploadModal,
  isModerator,
  favorites,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPostCode, setSelectedPostCode] = useState<string>('all');

  // Filter for Pixel Mafia / Instagram wallpapers
  const pixelMafiaWalls = wallpapers.filter(
    (w) => w.creatorBrand === 'Pixel Mafia 👑' || w.author.handle === '@aesthetic_walls_01'
  );

  const displayedWalls = selectedPostCode === 'all'
    ? pixelMafiaWalls
    : pixelMafiaWalls.filter((w) => w.instagramPostCode === selectedPostCode);

  const handleCopyBioLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Creator Profile Card Banner (Instagram Bio Look & Feel) */}
      <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 md:p-8 mb-10 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
          {/* Creator Profile Info */}
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Avatar with glowing ring */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                  <img
                    src={pixelMafiaWalls[0]?.thumbnailUrl || '/assets/aistudio/Screenshot_2026-10-24-05-13-44-48_1c337646f29875672b5a61192b9010f9_20f76fb3.jpg'}
                    alt="Pixel Mafia Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-amber-500 text-zinc-950 font-bold text-[10px] rounded-full shadow">
                PRO
              </span>
            </div>

            {/* Profile Bio */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2">
                  <span>aesthetic_walls_01</span>
                </h1>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  Pixel Mafia 👑
                </span>
              </div>

              {/* Bio Lines */}
              <div className="text-xs sm:text-sm text-zinc-300 mt-2 space-y-1">
                <p className="text-zinc-400 font-medium">Wallpaper Store · AI Creator</p>
                <p className="flex items-center gap-1.5 text-zinc-200">
                  <span>🔥 Screen ka asli baap</span>
                  <span>·</span>
                  <span>🖤 Ultra HD & AMOLED Walls</span>
                </p>
                <p className="text-zinc-400">👇 Official High-Speed Download Portal</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-4 text-xs">
                <div>
                  <span className="font-bold text-white tabular-nums">20+</span>{' '}
                  <span className="text-zinc-500">Drops</span>
                </div>
                <div>
                  <span className="font-bold text-white tabular-nums">100%</span>{' '}
                  <span className="text-zinc-500">AMOLED True Black</span>
                </div>
                <div>
                  <span className="font-bold text-white tabular-nums">Free</span>{' '}
                  <span className="text-zinc-500">Instant Download</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons for Instagram Visitors & Creator */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isModerator && onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors shadow-md"
              >
                <span>+ Upload Photo / Video</span>
              </button>
            )}

            <button
              onClick={handleCopyBioLink}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-zinc-950 font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-colors shadow-sm"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link for Bio</span>
                </>
              )}
            </button>

            <a
              href="https://instagram.com/aesthetic_walls_01"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl border border-zinc-700 transition-colors"
            >
              <Instagram className="w-4 h-4 text-rose-400" />
              <span>Visit Instagram</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>

      {/* "Get By Reel / Post Code" Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
            Direct from Instagram Posts
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white font-display mt-0.5">
            Download As Seen On Feed & Reels
          </h2>
        </div>

        {/* Post Code Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setSelectedPostCode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedPostCode === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Drops
          </button>
          {['#01', '#02', '#03', '#04'].map((code) => (
            <button
              key={code}
              onClick={() => setSelectedPostCode(code)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedPostCode === code
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Reel {code}
            </button>
          ))}
        </div>
      </div>

      {/* Instagram 3-Column Mobile Feed Layout (Replicating user's screenshot layout!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedWalls.map((wall) => {
          const isFavorited = favorites.includes(wall.id);

          return (
            <div
              key={wall.id}
              onClick={() => onOpenDetail(wall)}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-all duration-300 flex flex-col hover:shadow-2xl"
            >
              {/* Image with 9:16 mobile aspect ratio */}
              <div className="relative w-full aspect-[9/16] overflow-hidden bg-black">
                <img
                  src={wall.thumbnailUrl}
                  alt={wall.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Post Code Badge */}
                {wall.instagramPostCode && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono font-bold text-amber-400 z-10">
                    Reel {wall.instagramPostCode}
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(wall.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
                    isFavorited
                      ? 'bg-rose-500/90 text-white'
                      : 'bg-black/50 text-white/90 hover:bg-black/70 hover:scale-110'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                {/* Bottom Overlay Info & Quick Actions */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenMockup(wall);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-lg text-xs font-medium border border-white/10 transition-colors"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Mockup</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetail(wall);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-semibold shadow-md transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Get Wallpaper</span>
                  </button>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-zinc-100 truncate group-hover:text-white">
                    {wall.title}
                  </h3>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">
                    AMOLED
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>Pixel Mafia 👑</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {(wall.downloads / 1000).toFixed(1)}k dl
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-rose-400">
                    {(wall.likes / 1000).toFixed(1)}k ❤️
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
