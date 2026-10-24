import React, { useState } from 'react';
import { Heart, Download, Laptop, Eye, Check, Film } from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';
import { downloadWithCustomResolution } from '../utils/canvasExporter';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (wallpaper: Wallpaper) => void;
  onOpenMockup: (wallpaper: Wallpaper) => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  isFavorited,
  onToggleFavorite,
  onClick,
  onOpenMockup,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleQuickDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      await downloadWithCustomResolution(
        wallpaper.url,
        wallpaper.aspectRatio === '9:16' ? 1290 : 3840,
        wallpaper.aspectRatio === '9:16' ? 2796 : 2160,
        `${wallpaper.id}-quick.jpg`
      );
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 2000);
    } catch {
      // fallback handled in exporter
    } finally {
      setDownloading(false);
    }
  };

  const isPortrait = wallpaper.aspectRatio === '9:16';
  const isUltrawide = wallpaper.aspectRatio === '21:9';
  const isVideo = wallpaper.mediaType === 'video' || Boolean(wallpaper.videoUrl);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(wallpaper)}
      className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 cursor-pointer transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl flex flex-col"
    >
      {/* Visual Image/Video Container */}
      <div
        className={`relative w-full overflow-hidden bg-zinc-950 ${
          isPortrait ? 'aspect-[9/16]' : isUltrawide ? 'aspect-[21/9]' : 'aspect-[16/10]'
        }`}
      >
        {!imageError ? (
          isVideo ? (
            <video
              src={wallpaper.videoUrl || wallpaper.url}
              poster={wallpaper.thumbnailUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <img
              src={wallpaper.thumbnailUrl}
              alt={wallpaper.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-850 to-zinc-950 p-6 text-center">
            <span className="text-zinc-600 font-display text-lg font-semibold mb-1">
              {wallpaper.title}
            </span>
            <span className="text-xs text-zinc-500 font-mono">{wallpaper.resolution}</span>
          </div>
        )}

        {/* Live Video Indicator Badge */}
        {isVideo && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-[10px] font-medium text-amber-400 flex items-center gap-1 z-10">
            <Film className="w-3 h-3" />
            <span>Live Video</span>
          </div>
        )}

        {/* Ambient Gradient Scrim on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Floating Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          {/* Palette Dots */}
          <div className="flex items-center gap-1.5 p-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
            {wallpaper.colorPalette.slice(0, 3).map((hex, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(wallpaper.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-rose-500/90 text-white'
                : 'bg-black/50 text-white/90 hover:bg-black/70 hover:scale-110'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Favorite'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Hover Action Strip */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenMockup(wallpaper);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-lg text-xs font-medium border border-white/10 transition-colors"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Test Mockup</span>
          </button>

          <button
            onClick={handleQuickDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-semibold shadow-md transition-colors disabled:opacity-60"
            title="Quick Download 4K"
          >
            {downloadDone ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? '...' : 'Get 4K'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Info - ZERO PILL DISCIPLINE */}
      <div className="p-4 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm text-zinc-100 tracking-tight truncate group-hover:text-white">
            {wallpaper.title}
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono shrink-0">
            {wallpaper.aspectRatio}
          </span>
        </div>

        {/* Clean unboxed metadata with subtle typographic separators */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 truncate">
          <span className="text-zinc-400">{wallpaper.category}</span>
          <span aria-hidden="true">·</span>
          <span>By {wallpaper.author.name}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">
            {(wallpaper.downloads / 1000).toFixed(1)}k dl
          </span>
        </div>
      </div>
    </div>
  );
};
