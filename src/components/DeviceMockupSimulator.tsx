import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Download, 
  Sliders, 
  Eye, 
  EyeOff, 
  Check, 
  Wifi, 
  Battery, 
  Search, 
  Sparkles,
  Camera,
  Flashlight,
  Volume2
} from 'lucide-react';
import { Wallpaper, MockupDevice } from '../types/wallpaper';
import { downloadWithCustomResolution } from '../utils/canvasExporter';

interface DeviceMockupSimulatorProps {
  wallpaper: Wallpaper;
  onClose?: () => void;
  onOpenAdjuster?: (wallpaper: Wallpaper) => void;
}

export const DeviceMockupSimulator: React.FC<DeviceMockupSimulatorProps> = ({
  wallpaper,
  onClose,
  onOpenAdjuster
}) => {
  const [device, setDevice] = useState<MockupDevice>('macbook');
  const [blurAmount, setBlurAmount] = useState<number>(0);
  const [showUiChrome, setShowUiChrome] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [mobileMode, setMobileMode] = useState<'lockscreen' | 'homescreen'>('lockscreen');

  const handleDeviceDownload = async () => {
    setIsDownloading(true);
    let targetW = 3840;
    let targetH = 2160;
    let filenameSuffix = 'desktop-4k';

    if (device === 'macbook') {
      targetW = 3456;
      targetH = 2234;
      filenameSuffix = 'macbook-pro-16';
    } else if (device === 'iphone') {
      targetW = 1290;
      targetH = 2796;
      filenameSuffix = 'iphone-16-pro';
    } else if (device === 'ipad') {
      targetW = 2048;
      targetH = 2732;
      filenameSuffix = 'ipad-pro';
    } else if (device === 'ultrawide') {
      targetW = 3440;
      targetH = 1440;
      filenameSuffix = 'ultrawide-21x9';
    }

    try {
      await downloadWithCustomResolution(
        wallpaper.url,
        targetW,
        targetH,
        `${wallpaper.id}-${filenameSuffix}.jpg`,
        blurAmount > 0
          ? {
              brightness: 100,
              contrast: 100,
              saturation: 100,
              blur: blurAmount,
              sepia: 0,
              vignette: 0,
            }
          : undefined
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      // fallback handled in exporter
    } finally {
      setIsDownloading(false);
    }
  };

  const isVideo = wallpaper.mediaType === 'video' || Boolean(wallpaper.videoUrl);

  const renderScreenMedia = (extraScale = '1.04') => {
    const styleObj = {
      filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
      transform: blurAmount > 0 ? `scale(${extraScale})` : 'none',
    };

    if (isVideo) {
      return (
        <video
          src={wallpaper.videoUrl || wallpaper.url}
          poster={wallpaper.thumbnailUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-all duration-300"
          style={styleObj}
        />
      );
    }

    return (
      <img
        src={wallpaper.url}
        alt={wallpaper.title}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-all duration-300"
        style={styleObj}
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:px-6 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        {/* Device Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
          <button
            onClick={() => setDevice('macbook')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              device === 'macbook'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>MacBook 16"</span>
          </button>

          <button
            onClick={() => setDevice('iphone')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              device === 'iphone'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 16 Pro</span>
          </button>

          <button
            onClick={() => setDevice('ipad')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              device === 'ipad'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>iPad Pro</span>
          </button>

          <button
            onClick={() => setDevice('ultrawide')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              device === 'ultrawide'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Ultrawide 21:9</span>
          </button>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-4 text-xs">
          {/* Blur Slider for testing icon legibility */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg">
            <span className="text-zinc-400">Desktop Blur:</span>
            <input
              type="range"
              min="0"
              max="16"
              value={blurAmount}
              onChange={(e) => setBlurAmount(Number(e.target.value))}
              className="w-20 accent-zinc-400 cursor-pointer"
            />
            <span className="text-zinc-300 font-mono w-6 text-right tabular-nums">
              {blurAmount}px
            </span>
          </div>

          {/* Toggle UI Chrome */}
          <button
            onClick={() => setShowUiChrome(!showUiChrome)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg transition-colors ${
              showUiChrome
                ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {showUiChrome ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showUiChrome ? 'OS Overlays On' : 'Clean Preview'}</span>
          </button>

          {device === 'iphone' && showUiChrome && (
            <div className="flex items-center gap-1 p-0.5 bg-zinc-950 rounded-lg border border-zinc-800">
              <button
                onClick={() => setMobileMode('lockscreen')}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  mobileMode === 'lockscreen'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Lock Screen
              </button>
              <button
                onClick={() => setMobileMode('homescreen')}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  mobileMode === 'homescreen'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Home Grid
              </button>
            </div>
          )}

          {/* Download for Current Device button */}
          <button
            onClick={handleDeviceDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 font-medium rounded-lg hover:bg-zinc-200 transition-colors shadow-sm disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download for {device === 'macbook' ? 'MacBook' : device === 'iphone' ? 'iPhone' : device === 'ipad' ? 'iPad' : 'Ultrawide'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Stage Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 min-h-[520px]">
        {/* MACBOOK PRO MOCKUP */}
        {device === 'macbook' && (
          <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Display Lid */}
            <div className="relative w-full aspect-[16/10] bg-zinc-900 rounded-[20px] p-3 shadow-2xl border border-zinc-700/60 ring-1 ring-white/10 flex flex-col">
              {/* Screen Bezel */}
              <div className="relative flex-1 w-full h-full bg-black rounded-[12px] overflow-hidden flex flex-col shadow-inner">
                {/* Notch */}
                {showUiChrome && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-zinc-950 rounded-b-xl z-30 flex items-center justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
                    <div className="w-1 h-1 rounded-full bg-emerald-500/80 animate-pulse" />
                  </div>
                )}

                {/* macOS Menu Bar */}
                {showUiChrome && (
                  <div className="relative z-20 h-6 px-4 bg-zinc-900/60 backdrop-blur-md text-[11px] font-medium text-white/90 flex items-center justify-between border-b border-white/10 select-none">
                    <div className="flex items-center gap-4">
                      {/* Apple Symbol */}
                      <span className="font-semibold text-xs"></span>
                      <span className="font-semibold">Finder</span>
                      <span className="hidden sm:inline text-white/70">File</span>
                      <span className="hidden sm:inline text-white/70">Edit</span>
                      <span className="hidden md:inline text-white/70">View</span>
                      <span className="hidden md:inline text-white/70">Go</span>
                      <span className="hidden lg:inline text-white/70">Window</span>
                      <span className="hidden lg:inline text-white/70">Help</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Search className="w-3 h-3 text-white/80" />
                      <Wifi className="w-3 h-3 text-white/80" />
                      <div className="flex items-center gap-1">
                        <Battery className="w-3.5 h-3.5 text-white/80" />
                        <span className="font-mono text-[10px] tabular-nums">98%</span>
                      </div>
                      <span className="font-medium tracking-tight">Fri Oct 24 &nbsp; 9:41 AM</span>
                    </div>
                  </div>
                )}

                {/* Wallpaper Surface */}
                <div className="relative flex-1 w-full h-full overflow-hidden">
                  {renderScreenMedia('1.04')}

                  {/* macOS Dock */}
                  {showUiChrome && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/25 shadow-2xl">
                      {/* Finder icon */}
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer hover:scale-110 transition-transform">
                        ⌘
                      </div>
                      {/* Safari */}
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer hover:scale-110 transition-transform">
                        🧭
                      </div>
                      {/* Messages */}
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-md cursor-pointer hover:scale-110 transition-transform">
                        💬
                      </div>
                      {/* Terminal */}
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400 text-xs font-mono shadow-md cursor-pointer hover:scale-110 transition-transform">
                        &gt;_
                      </div>
                      {/* Figma / Studio */}
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-xs shadow-md cursor-pointer hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      {/* Music */}
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs shadow-md cursor-pointer hover:scale-110 transition-transform">
                        ♫
                      </div>
                      <div className="w-px h-6 bg-white/30 mx-1" />
                      {/* Trash */}
                      <div className="w-8 h-8 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-300 text-xs shadow-md cursor-pointer hover:scale-110 transition-transform">
                        🗑
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Aluminum Base & Notch */}
            <div className="relative w-[108%] h-4 bg-zinc-800 rounded-b-xl border-t border-zinc-600/40 shadow-xl flex justify-center">
              <div className="w-24 h-1.5 bg-zinc-700 rounded-b-md" />
            </div>
          </div>
        )}

        {/* IPHONE 16 PRO MOCKUP */}
        {device === 'iphone' && (
          <div className="relative w-[340px] aspect-[9/19.5] bg-zinc-900 rounded-[52px] p-3 shadow-2xl border-[3px] border-zinc-700 ring-1 ring-white/10 flex flex-col">
            {/* Screen Bezel */}
            <div className="relative w-full h-full bg-black rounded-[42px] overflow-hidden flex flex-col">
              {/* Dynamic Island */}
              {showUiChrome && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-between px-3.5 border border-zinc-800/60 shadow-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-zinc-800" />
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="w-2.5 h-2.5 text-zinc-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              )}

              {/* Status Bar */}
              {showUiChrome && (
                <div className="relative z-20 h-10 px-7 pt-2 flex items-center justify-between text-[13px] font-semibold text-white select-none">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">5G</span>
                    <Battery className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Wallpaper Background */}
              <div className="relative flex-1 w-full h-full overflow-hidden">
                {renderScreenMedia('1.08')}

                {/* Lock Screen UI */}
                {showUiChrome && mobileMode === 'lockscreen' && (
                  <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 pt-12 select-none">
                    {/* Clock & Date */}
                    <div className="flex flex-col items-center text-center mt-6">
                      <span className="text-sm font-medium text-white/90 drop-shadow-md">
                        Friday, October 24
                      </span>
                      <h2 className="text-7xl font-bold tracking-tight text-white drop-shadow-lg font-display">
                        09:41
                      </h2>
                    </div>

                    {/* Bottom Quick Actions (Flashlight & Camera) */}
                    <div className="flex items-center justify-between px-2 pb-6">
                      <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
                        <Flashlight className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Home Screen App Grid */}
                {showUiChrome && mobileMode === 'homescreen' && (
                  <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 pt-10 select-none">
                    {/* App Grid */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {['Photos', 'Camera', 'Maps', 'Weather', 'Notes', 'Music', 'Safari', 'Mail'].map((app, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-md flex items-center justify-center text-lg">
                            {['🖼️', '📷', '🗺️', '☀️', '📝', '🎵', '🧭', '✉️'][i]}
                          </div>
                          <span className="text-[10px] text-white/90 drop-shadow">{app}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Dock */}
                    <div className="flex items-center justify-around p-3 bg-white/25 backdrop-blur-2xl rounded-3xl border border-white/30 mb-4">
                      {['📞', '💬', '🧭', '⚙️'].map((icon, i) => (
                        <div key={i} className="w-11 h-11 rounded-2xl bg-white/30 flex items-center justify-center text-xl shadow-sm">
                          {icon}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Home Bar Indicator */}
                {showUiChrome && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/80 rounded-full z-30" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* IPAD PRO MOCKUP */}
        {device === 'ipad' && (
          <div className="relative w-full max-w-2xl aspect-[4/3] bg-zinc-900 rounded-[32px] p-3 shadow-2xl border-2 border-zinc-700 ring-1 ring-white/10 flex flex-col">
            <div className="relative w-full h-full bg-black rounded-[24px] overflow-hidden flex flex-col">
              {showUiChrome && (
                <div className="relative z-20 h-8 px-6 bg-transparent text-xs font-semibold text-white flex items-center justify-between select-none">
                  <span>9:41 AM Fri Oct 24</span>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5" />
                    <Battery className="w-4 h-4" />
                  </div>
                </div>
              )}

              <div className="relative flex-1 w-full h-full overflow-hidden">
                {renderScreenMedia('1.05')}

                {showUiChrome && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-2xl">
                    {['🖼️', '🎨', '📝', '🧭', '⚙️'].map((emoji, idx) => (
                      <div key={idx} className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center text-xl shadow cursor-pointer hover:scale-105 transition-transform">
                        {emoji}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ULTRAWIDE 21:9 MOCKUP */}
        {device === 'ultrawide' && (
          <div className="relative w-full max-w-5xl aspect-[21/9] bg-zinc-900 rounded-2xl p-2.5 shadow-2xl border border-zinc-700/80 ring-1 ring-white/10 flex flex-col">
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex flex-col">
              {showUiChrome && (
                <div className="relative z-20 h-6 px-6 bg-zinc-900/70 backdrop-blur-md text-[11px] font-medium text-white/90 flex items-center justify-between border-b border-white/10">
                  <span className="font-semibold">34" Curved Studio Display · 3440 × 1440</span>
                  <span className="text-zinc-400">144Hz HDR10</span>
                </div>
              )}

              <div className="relative flex-1 w-full h-full overflow-hidden">
                {renderScreenMedia('1.04')}

                {showUiChrome && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1 bg-zinc-950/70 backdrop-blur-xl rounded-xl border border-white/15 text-xs text-white">
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">Terminal</span>
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">VS Code</span>
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">Figma</span>
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300">Chrome</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer bar info */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3 border-t border-zinc-800 text-xs text-zinc-400 bg-zinc-950">
        <div className="flex items-center gap-3">
          <span className="font-medium text-zinc-200">{wallpaper.title}</span>
          <span aria-hidden="true">·</span>
          <span>By {wallpaper.author.name}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{wallpaper.resolution}</span>
        </div>

        <div className="flex items-center gap-3">
          {onOpenAdjuster && (
            <button
              onClick={() => onOpenAdjuster(wallpaper)}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Fine-Tune in Customizer</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1 text-zinc-400 hover:text-white transition-colors"
            >
              Close Simulator
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
