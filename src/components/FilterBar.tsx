import React from 'react';
import { 
  Category, 
  DeviceType, 
  ColorFilter 
} from '../types/wallpaper';
import { CATEGORIES, COLOR_OPTIONS } from '../data/wallpapers';
import { LayoutGrid, Grid, ArrowUpDown, Smartphone, Laptop, Monitor } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedDevice: DeviceType;
  onSelectDevice: (dev: DeviceType) => void;
  selectedColor: ColorFilter;
  onSelectColor: (col: ColorFilter) => void;
  sortBy: 'curated' | 'downloads' | 'likes' | 'resolution';
  onSelectSortBy: (sort: 'curated' | 'downloads' | 'likes' | 'resolution') => void;
  layoutMode: 'bento' | 'uniform';
  onToggleLayoutMode: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDevice,
  onSelectDevice,
  selectedColor,
  onSelectColor,
  sortBy,
  onSelectSortBy,
  layoutMode,
  onToggleLayoutMode,
  totalCount,
}) => {
  return (
    <div className="py-6 border-b border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 space-y-4">
        {/* Row 1: Category Segmented Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Device Screen Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => onSelectDevice('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedDevice === 'all'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Displays
            </button>
            <button
              onClick={() => onSelectDevice('desktop')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedDevice === 'desktop'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Laptop className="w-3 h-3" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => onSelectDevice('mobile')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedDevice === 'mobile'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </button>
            <button
              onClick={() => onSelectDevice('ultrawide')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedDevice === 'ultrawide'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Ultrawide</span>
            </button>
          </div>
        </div>

        {/* Row 2: Dominant Color Swatches, Sort, and Layout Mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Color Filter Dots */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-400 font-medium mr-1">Color:</span>
            <button
              onClick={() => onSelectColor('all')}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                selectedColor === 'all'
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Tones
            </button>

            {COLOR_OPTIONS.map((col) => (
              <button
                key={col.id}
                onClick={() => onSelectColor(col.id)}
                className={`w-5 h-5 rounded-full transition-transform hover:scale-110 relative ${
                  selectedColor === col.id
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>

          {/* Right: Sort and Count */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-500 font-mono tabular-nums">
              Showing {totalCount} {totalCount === 1 ? 'wallpaper' : 'wallpapers'}
            </span>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e: any) => onSelectSortBy(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
              >
                <option value="curated">Curated Picks</option>
                <option value="downloads">Most Downloaded</option>
                <option value="likes">Most Liked</option>
                <option value="resolution">Highest Resolution</option>
              </select>
            </div>

            {/* Layout switch */}
            <button
              onClick={onToggleLayoutMode}
              className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900 transition-colors"
              title={layoutMode === 'bento' ? 'Switch to Uniform Grid' : 'Switch to Bento Layout'}
            >
              {layoutMode === 'bento' ? (
                <Grid className="w-3.5 h-3.5" />
              ) : (
                <LayoutGrid className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
