import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Heart, 
  Laptop, 
  Sliders, 
  Copy, 
  Check, 
  Eye, 
  Share2, 
  Maximize2,
  ChevronDown
} from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';
import { RESOLUTION_PRESETS } from '../data/wallpapers';
import { downloadWithCustomResolution } from '../utils/canvasExporter';

interface WallpaperDetailModalProps {
  wallpaper: Wallpaper;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onOpenMockup: (wallpaper: Wallpaper) => void;
  onOpenAdjuster: (wallpaper: Wallpaper) => void;
  onTagClick?: (tag: string) => void;
}

export const WallpaperDetailModal: React.FC<WallpaperDetailModalProps> = ({
  wallpaper,
  isFavorited,
  onToggleFavorite,
  onClose,
  onOpenMockup,
  onOpenAdjuster,
  onTagClick,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [downloadDropdown, setDownloadDropdown] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleDownload = async (preset: typeof RESOLUTION_PRESETS[0]) => {
    setIsDownloading(true);
    setDownloadDropdown(false);
    try {
      await downloadWithCustomResolution(
        wallpaper.url,
        preset.width,
        preset.height,
        `${wallpaper.id}-${preset.width}x${preset.height}.jpg`
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      // fallback in exporter
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Floating Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-white tracking-tight">
              {wallpaper.title}
            </h2>
            <span className="hidden sm:inline text-xs text-zinc-500">·</span>
            <span className="hidden sm:inline text-xs text-zinc-400">
              By {wallpaper.author.name} ({wallpaper.author.handle})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              title="Copy Link"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Favorite Button */}
            <button
              onClick={() => onToggleFavorite(wallpaper.id)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorited
                  ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors ml-1"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
          {/* Main Visual Display */}
          <div className="relative flex-1 bg-zinc-900/40 p-4 md:p-8 flex items-center justify-center min-h-[360px] lg:min-h-[500px]">
            <div className="relative max-w-full max-h-[70vh] rounded-xl overflow-hidden shadow-2xl border border-zinc-800/80">
              {wallpaper.mediaType === 'video' || wallpaper.videoUrl ? (
                <video
                  src={wallpaper.videoUrl || wallpaper.url}
                  poster={wallpaper.thumbnailUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              ) : (
                <img
                  src={wallpaper.url}
                  alt={wallpaper.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              )}
            </div>
          </div>

          {/* Right Sidebar Details */}
          <div className="w-full lg:w-96 p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-800 bg-zinc-950">
            <div>
              {/* Primary Action Buttons */}
              <div className="space-y-2.5 mb-6">
                {/* Download Dropdown */}
                <div className="relative">
                  <div className="flex rounded-xl overflow-hidden shadow-lg border border-zinc-700">
                    <button
                      onClick={() => handleDownload(RESOLUTION_PRESETS[1])} // 4K default
                      disabled={isDownloading}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                      {downloadSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Downloaded 4K!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{isDownloading ? 'Exporting...' : 'Download 4K Ultra HD'}</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setDownloadDropdown(!downloadDropdown)}
                      className="px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-l border-zinc-300 transition-colors"
                      title="Select Resolution"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Resolution Dropdown Popover */}
                  {downloadDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-1.5 z-30 space-y-1">
                      <div className="px-3 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                        Available Resolutions
                      </div>
                      {RESOLUTION_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => handleDownload(preset)}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors"
                        >
                          <div className="text-left">
                            <span className="font-medium">{preset.label}</span>
                            <span className="text-[11px] text-zinc-500 block">{preset.desc}</span>
                          </div>
                          <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
                            {preset.width} × {preset.height}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMockup(wallpaper);
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-xl text-xs font-medium transition-colors"
                  >
                    <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Mockup Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdjuster(wallpaper);
                    }}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-xl text-xs font-medium transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Fine-Tune</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {wallpaper.description}
              </p>

              {/* Technical EXIF Specifications (Zero Pill Discipline - clean text with separators) */}
              <div className="py-4 border-t border-zinc-800 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-300">Specifications</h4>
                
                <div className="flex justify-between text-xs py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Master Resolution</span>
                  <span className="font-mono text-zinc-300 tabular-nums">{wallpaper.resolution}</span>
                </div>

                <div className="flex justify-between text-xs py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Aspect Ratio</span>
                  <span className="font-mono text-zinc-300">{wallpaper.aspectRatio}</span>
                </div>

                <div className="flex justify-between text-xs py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Category</span>
                  <span className="text-zinc-300">{wallpaper.category}</span>
                </div>

                <div className="flex justify-between text-xs py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Target Display</span>
                  <span className="capitalize text-zinc-300">{wallpaper.device}</span>
                </div>

                <div className="flex justify-between text-xs py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Downloads</span>
                  <span className="font-mono text-zinc-300 tabular-nums">
                    {wallpaper.downloads.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-xs py-1">
                  <span className="text-zinc-500">License</span>
                  <span className="text-zinc-300">Free for Personal & Commercial</span>
                </div>
              </div>

              {/* Dominant Color Palette (Interactive Copy) */}
              <div className="py-4 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-300">Color Palette</span>
                  {copiedHex && (
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied {copiedHex}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {wallpaper.colorPalette.map((hex, idx) => (
                    <button
                      key={idx}
                      onClick={() => copyColor(hex)}
                      className="group relative w-8 h-8 rounded-lg border border-white/20 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                      style={{ backgroundColor: hex }}
                      title={`Copy ${hex}`}
                    >
                      <span className="sr-only">{hex}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="py-4 border-t border-zinc-800">
                <span className="text-xs font-semibold text-zinc-300 block mb-2">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {wallpaper.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (onTagClick) {
                          onTagClick(tag);
                          onClose();
                        }
                      }}
                      className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
