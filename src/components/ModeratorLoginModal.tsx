import React, { useState } from 'react';
import { Lock, X, KeyRound, AlertCircle, Check } from 'lucide-react';

interface ModeratorLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const ModeratorLoginModal: React.FC<ModeratorLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default moderator passcode for Pixel Mafia (@aesthetic_walls_01)
    if (passcode.trim() === 'pixelmafia' || passcode.trim() === 'admin123') {
      setError(false);
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-100">Moderator Portal</h3>
              <p className="text-[11px] text-zinc-500">Pixel Mafia Staff Only</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Only authorized moderators can publish, edit, or delete photos and video wallpapers.
          </p>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Moderator Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(false);
                }}
                placeholder="Enter passcode (default: pixelmafia)"
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <KeyRound className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
            </div>

            {error && (
              <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Invalid passcode. Try "pixelmafia".
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors shadow-lg"
          >
            Authenticate as Moderator
          </button>
        </form>
      </div>
    </div>
  );
};
