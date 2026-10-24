import React, { useState } from 'react';
import { Wallpaper } from '../types/wallpaper';
import { DeviceMockupSimulator } from './DeviceMockupSimulator';

interface MockupStudioViewProps {
  wallpapers: Wallpaper[];
  initialWallpaper?: Wallpaper;
  onOpenAdjuster: (wallpaper: Wallpaper) => void;
}

export const MockupStudioView: React.FC<MockupStudioViewProps> = ({
  wallpapers,
  initialWallpaper,
  onOpenAdjuster,
}) => {
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper>(
    initialWallpaper || wallpapers[0]
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-65px)] bg-zinc-950">
      {/* Top Selector Ribbon of Available Wallpapers */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400 whitespace-nowrap mr-2">
            Select Canvas:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {wallpapers.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWallpaper(w)}
                className={`relative flex items-center gap-2 p-1.5 rounded-xl border transition-all shrink-0 ${
                  selectedWallpaper.id === w.id
                    ? 'border-white bg-zinc-800 text-white shadow-md'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400'
                }`}
              >
                <img
                  src={w.thumbnailUrl}
                  alt={w.title}
                  className="w-10 h-7 rounded-lg object-cover"
                />
                <span className="text-xs font-medium pr-2 max-w-[120px] truncate">
                  {w.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulator Component */}
      <div className="flex-1 flex flex-col">
        <DeviceMockupSimulator
          wallpaper={selectedWallpaper}
          onOpenAdjuster={onOpenAdjuster}
        />
      </div>
    </div>
  );
};
