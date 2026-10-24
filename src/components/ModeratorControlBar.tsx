import React from 'react';
import { ShieldCheck, Plus, LogOut, Trash2 } from 'lucide-react';

interface ModeratorControlBarProps {
  onOpenUpload: () => void;
  onLogout: () => void;
  totalWallpapers: number;
}

export const ModeratorControlBar: React.FC<ModeratorControlBarProps> = ({
  onOpenUpload,
  onLogout,
  totalWallpapers,
}) => {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Moderator Mode Active</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-400">{totalWallpapers} total wallpapers published</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-colors shadow-sm text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Photo / Video Drop</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
            title="Log out of moderator mode"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Mod Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
