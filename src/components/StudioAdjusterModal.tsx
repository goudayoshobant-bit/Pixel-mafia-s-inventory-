import React, { useState } from 'react';
import { X, RotateCcw, Download, Sparkles, Check, SlidersHorizontal } from 'lucide-react';
import { Wallpaper, WallpaperAdjustments } from '../types/wallpaper';
import { RESOLUTION_PRESETS } from '../data/wallpapers';
import { downloadWithCustomResolution } from '../utils/canvasExporter';

interface StudioAdjusterModalProps {
  wallpaper: Wallpaper;
  onClose: () => void;
  onOpenMockup?: (wallpaper: Wallpaper) => void;
}

const DEFAULT_ADJUSTMENTS: WallpaperAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
  vignette: 0,
};

export const StudioAdjusterModal: React.FC<StudioAdjusterModalProps> = ({
  wallpaper,
  onClose,
  onOpenMockup,
}) => {
  const [adjustments, setAdjustments] = useState<WallpaperAdjustments>(DEFAULT_ADJUSTMENTS);
  const [selectedResolution, setSelectedResolution] = useState(RESOLUTION_PRESETS[1]); // 4K default
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'noir':
        setAdjustments({
          brightness: 95,
          contrast: 130,
          saturation: 0,
          blur: 0,
          sepia: 0,
          vignette: 35,
        });
        break;
      case 'vivid':
        setAdjustments({
          brightness: 105,
          contrast: 115,
          saturation: 140,
          blur: 0,
          sepia: 0,
          vignette: 15,
        });
        break;
      case 'focus-blur':
        setAdjustments({
          brightness: 90,
          contrast: 105,
          saturation: 90,
          blur: 8,
          sepia: 0,
          vignette: 20,
        });
        break;
      case 'vintage-warm':
        setAdjustments({
          brightness: 102,
          contrast: 108,
          saturation: 85,
          blur: 0,
          sepia: 35,
          vignette: 25,
        });
        break;
      case 'midnight':
        setAdjustments({
          brightness: 75,
          contrast: 125,
          saturation: 80,
          blur: 0,
          sepia: 0,
          vignette: 50,
        });
        break;
      default:
        setAdjustments(DEFAULT_ADJUSTMENTS);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await downloadWithCustomResolution(
        wallpaper.url,
        selectedResolution.width,
        selectedResolution.height,
        `${wallpaper.id}-custom-${selectedResolution.width}x${selectedResolution.height}.jpg`,
        adjustments
      );
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
    } catch {
      // fallback in exporter
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Live Canvas Preview */}
        <div className="relative flex-1 bg-zinc-900/60 p-6 flex flex-col items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-zinc-800">
          {/* Header over preview */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-xs text-zinc-400 z-10">
            <span className="font-medium text-zinc-200">{wallpaper.title}</span>
            <span>Real-time Hardware Shader Preview</span>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="relative max-w-full max-h-[75vh] aspect-video rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
            <img
              src={wallpaper.url}
              alt={wallpaper.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all"
              style={{
                filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%) blur(${adjustments.blur}px) sepia(${adjustments.sepia}%)`,
              }}
            />

            {/* Vignette Layer */}
            {adjustments.vignette > 0 && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity"
                style={{
                  background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${
                    (adjustments.vignette / 100) * 0.85
                  }) 100%)`,
                }}
              />
            )}
          </div>

          {/* Bottom Quick Mockup Link */}
          {onOpenMockup && (
            <button
              onClick={() => onOpenMockup(wallpaper)}
              className="absolute bottom-4 flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900/80 rounded-lg border border-zinc-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview this variation in Mockup Simulator</span>
            </button>
          )}
        </div>

        {/* Right Side: Adjustment Controls & Export */}
        <div className="w-full md:w-96 flex flex-col justify-between p-6 overflow-y-auto bg-zinc-950">
          <div>
            {/* Modal Title & Close */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-zinc-300" />
                <h3 className="font-semibold text-sm text-zinc-100">Studio Customizer</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-400">Curated Presets</span>
                <button
                  onClick={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'default', label: 'Default' },
                  { id: 'noir', label: 'Noir' },
                  { id: 'vivid', label: 'Vivid' },
                  { id: 'focus-blur', label: 'App Focus' },
                  { id: 'vintage-warm', label: 'Vintage' },
                  { id: 'midnight', label: 'Midnight' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className="px-2.5 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors text-center"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="mt-6 space-y-4">
              {/* Blur Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Desktop Blur</span>
                  <span className="font-mono text-zinc-400 tabular-nums">{adjustments.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={adjustments.blur}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, blur: Number(e.target.value) }))
                  }
                  className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Brightness */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Brightness</span>
                  <span className="font-mono text-zinc-400 tabular-nums">{adjustments.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={adjustments.brightness}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, brightness: Number(e.target.value) }))
                  }
                  className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Contrast</span>
                  <span className="font-mono text-zinc-400 tabular-nums">{adjustments.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={adjustments.contrast}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, contrast: Number(e.target.value) }))
                  }
                  className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Saturation</span>
                  <span className="font-mono text-zinc-400 tabular-nums">{adjustments.saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={adjustments.saturation}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, saturation: Number(e.target.value) }))
                  }
                  className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Vignette */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Vignette</span>
                  <span className="font-mono text-zinc-400 tabular-nums">{adjustments.vignette}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={adjustments.vignette}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, vignette: Number(e.target.value) }))
                  }
                  className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sepia Warmth */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Warm Analog Tone</span>
                  <span className="font-mono text-zinc-400 tabular-nums">{adjustments.sepia}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={adjustments.sepia}
                  onChange={(e) =>
                    setAdjustments((prev) => ({ ...prev, sepia: Number(e.target.value) }))
                  }
                  className="w-full accent-white h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Export Resolution Picker and Trigger */}
          <div className="mt-8 pt-4 border-t border-zinc-800">
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Export Resolution
            </label>
            <select
              value={selectedResolution.label}
              onChange={(e) => {
                const found = RESOLUTION_PRESETS.find((p) => p.label === e.target.value);
                if (found) setSelectedResolution(found);
              }}
              className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600 mb-4"
            >
              {RESOLUTION_PRESETS.map((preset) => (
                <option key={preset.label} value={preset.label}>
                  {preset.label} ({preset.width} × {preset.height})
                </option>
              ))}
            </select>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white text-zinc-950 font-medium rounded-xl hover:bg-zinc-200 transition-colors shadow-lg disabled:opacity-50 text-xs"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Export Complete!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Rendering Image...' : `Export ${selectedResolution.label}`}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
