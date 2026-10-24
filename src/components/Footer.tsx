interface FooterProps {
  onSelectCategory: (cat: any) => void;
  onOpenAIStudio: () => void;
  onOpenModeratorLogin?: () => void;
  isModerator?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectCategory, 
  onOpenAIStudio,
  onOpenModeratorLogin,
  isModerator,
}) => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-12 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base font-display">
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" />
              <span>Lumina</span>
            </div>
            <p className="text-zinc-500 leading-relaxed max-w-xs">
              Uncompressed 8K & 4K wallpapers curated for Apple Pro Display XDR, high-refresh ultrawides, and OLED mobile screens.
            </p>
          </div>

          {/* Resolutions */}
          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider mb-3 text-[11px]">
              Supported Formats
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>8K Ultra HD (7680 × 4320)</li>
              <li>6K Apple Retina XDR (6016 × 3384)</li>
              <li>4K UHD 16:9 (3840 × 2160)</li>
              <li>Ultrawide 21:9 (3440 × 1440)</li>
              <li>iPhone 16 Pro Max (1290 × 2796)</li>
            </ul>
          </div>

          {/* Curated Categories */}
          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider mb-3 text-[11px]">
              Aesthetics
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button
                  onClick={() => onSelectCategory('Nature')}
                  className="hover:text-white transition-colors"
                >
                  Nordic Fjords & Mountains
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Abstract')}
                  className="hover:text-white transition-colors"
                >
                  Fluted Glass & Caustics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Sci-Fi')}
                  className="hover:text-white transition-colors"
                >
                  Neo-Tokyo Midnight Rain
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('OLED Dark')}
                  className="hover:text-white transition-colors"
                >
                  Midnight OLED True Black
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Space')}
                  className="hover:text-white transition-colors"
                >
                  Deep Cosmic Nebulae
                </button>
              </li>
            </ul>
          </div>

          {/* Creative Studio */}
          <div>
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider mb-3 text-[11px]">
              Studio Tools
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>Hardware Mockup Simulator</li>
              <li>Live Shader Blur & Contrast Tuner</li>
              <li>Aspect Ratio Center Cropper</li>
              <li>
                <button
                  onClick={onOpenAIStudio}
                  className="text-white hover:underline transition-all"
                >
                  AI Prompt Wallpaper Studio
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Quiet Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>© 2026 Lumina Wallpaper Studio. Free for personal & creative commercial desktop usage.</p>
          <div className="flex items-center gap-6 text-zinc-500">
            <span>Color accuracy sRGB & DCI-P3</span>
            <span>·</span>
            {onOpenModeratorLogin && (
              <button
                onClick={onOpenModeratorLogin}
                className="hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {isModerator ? '👑 Moderator Active' : 'Moderator Portal'}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
