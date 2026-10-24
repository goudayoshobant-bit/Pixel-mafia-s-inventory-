import React, { useState } from 'react';
import { Sparkles, X, Download, Laptop, Check, RefreshCw, Wand2 } from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';

interface AIWallpaperStudioProps {
  onClose: () => void;
  onWallpaperCreated: (wallpaper: Wallpaper) => void;
}

const CURATED_PROMPT_PRESETS = [
  {
    title: 'Minimalist Obsidian Monolith',
    prompt: 'OLED pure black minimalist landscape with a sharp obsidian geometry, elongated razor shadow, subtle silver rim lighting on curved dunes',
    category: 'Minimal' as const,
    aspectRatio: '16:9' as const,
    colors: ['#09090b', '#18181b', '#3f3f46', '#a1a1aa'],
  },
  {
    title: 'Iridescent Fluted Glass Waves',
    prompt: 'Ultra-modern 3D frosted fluted glass ribbon curves in architectural space, dispersion rainbow prism caustics, soft pearl shadows',
    category: 'Abstract' as const,
    aspectRatio: '16:9' as const,
    colors: ['#f8fafc', '#d8b4e2', '#bae6fd', '#334155'],
  },
  {
    title: 'Neo-Tokyo Cyber Fog',
    prompt: 'Cinematic neo-tokyo alleyway in midnight drizzle, wet asphalt reflecting glowing cyan and golden neon signs, moody film grade',
    category: 'Sci-Fi' as const,
    aspectRatio: '16:9' as const,
    colors: ['#08171f', '#0ea5e9', '#eab308', '#18181b'],
  },
  {
    title: 'Midnight Oasis OLED',
    prompt: 'Vertical smartphone wallpaper of a silent starlit dune ridge with deep shadows, crescent moon, and crisp milky way core',
    category: 'OLED Dark' as const,
    aspectRatio: '9:16' as const,
    colors: ['#000000', '#0f172a', '#334155', '#94a3b8'],
  },
  {
    title: 'Deep Stellar Nebula',
    prompt: 'James Webb deep space telescope view of glowing emission nebula with crimson dust filaments, young blue stars, cosmic horizon',
    category: 'Space' as const,
    aspectRatio: '16:9' as const,
    colors: ['#0f051d', '#581c87', '#be185d', '#38bdf8'],
  },
];

export const AIWallpaperStudio: React.FC<AIWallpaperStudioProps> = ({
  onClose,
  onWallpaperCreated,
}) => {
  const [prompt, setPrompt] = useState(CURATED_PROMPT_PRESETS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '21:9'>('16:9');
  const [styleTheme, setStyleTheme] = useState<'Cinematic' | 'Minimalist' | '3D Render' | 'Moody Retro'>('Cinematic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [generationMeta, setGenerationMeta] = useState<any>(null);

  const generateCanvasWallpaper = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);

    // Simulate generative rendering with custom dynamic canvas
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const canvas = document.createElement('canvas');
    const width = aspectRatio === '9:16' ? 1290 : aspectRatio === '21:9' ? 3440 : 3840;
    const height = aspectRatio === '9:16' ? 2796 : aspectRatio === '21:9' ? 1440 : 2160;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Pick palette based on theme and prompt
      let color1 = '#09090b';
      let color2 = '#1e1b4b';
      let color3 = '#0284c7';
      let color4 = '#f43f5e';

      if (prompt.toLowerCase().includes('dark') || prompt.toLowerCase().includes('oled')) {
        color1 = '#000000';
        color2 = '#09090b';
        color3 = '#18181b';
        color4 = '#27272a';
      } else if (prompt.toLowerCase().includes('space') || prompt.toLowerCase().includes('nebula')) {
        color1 = '#090514';
        color2 = '#3b0764';
        color3 = '#be185d';
        color4 = '#38bdf8';
      } else if (prompt.toLowerCase().includes('glass') || prompt.toLowerCase().includes('abstract')) {
        color1 = '#0f172a';
        color2 = '#1e293b';
        color3 = '#818cf8';
        color4 = '#c084fc';
      }

      // Base gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, color1);
      bgGrad.addColorStop(0.5, color2);
      bgGrad.addColorStop(1, '#050505');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw generative organic or geometric light rays
      for (let i = 0; i < 7; i++) {
        ctx.save();
        ctx.beginPath();
        const startX = width * (0.2 + (i * 0.1));
        const startY = height * 1.1;
        ctx.moveTo(startX, startY);

        ctx.bezierCurveTo(
          startX + Math.sin(i) * (width * 0.3),
          height * 0.5,
          startX + Math.cos(i) * (width * 0.2),
          height * 0.2,
          width * (0.5 + Math.sin(i) * 0.4),
          0
        );

        ctx.lineWidth = width * (0.05 + i * 0.02);
        const strokeGrad = ctx.createLinearGradient(0, 0, width, height);
        strokeGrad.addColorStop(0, `${color3}${Math.floor((0.08 + i * 0.02) * 255).toString(16).padStart(2, '0')}`);
        strokeGrad.addColorStop(1, `${color4}00`);
        ctx.strokeStyle = strokeGrad;
        ctx.lineCap = 'round';
        ctx.filter = `blur(${Math.max(20, width * 0.03)}px)`;
        ctx.stroke();
        ctx.restore();
      }

      // Add starry or dust texture
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let s = 0; s < 120; s++) {
        const sx = Math.random() * width;
        const sy = Math.random() * height;
        const sRadius = Math.random() * 2 + 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setGeneratedResult(dataUrl);

      const newWallpaper: Wallpaper = {
        id: `ai-gen-${Date.now()}`,
        title: prompt.slice(0, 28) + (prompt.length > 28 ? '...' : ''),
        category: 'Abstract',
        device: aspectRatio === '9:16' ? 'mobile' : aspectRatio === '21:9' ? 'ultrawide' : 'desktop',
        aspectRatio,
        resolution: `${width} × ${height} (AI Studio Master)`,
        rawWidth: width,
        rawHeight: height,
        url: dataUrl,
        thumbnailUrl: dataUrl,
        colorPalette: [color1, color2, color3, color4],
        dominantColor: 'purple',
        author: {
          name: 'AI Studio Engine',
          handle: '@lumina_ai',
        },
        downloads: 1,
        likes: 1,
        views: 1,
        tags: ['ai-generated', styleTheme.toLowerCase(), 'custom'],
        description: prompt,
      };

      setGenerationMeta(newWallpaper);
    }

    setIsGenerating(false);
  };

  const handleApplyToGallery = () => {
    if (generationMeta) {
      onWallpaperCreated(generationMeta);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-white" />
            <h3 className="font-semibold text-sm text-zinc-100">AI Wallpaper Generator</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto">
          {/* Controls Column */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Curated Concept Blueprints
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CURATED_PROMPT_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPrompt(p.prompt);
                        setAspectRatio(p.aspectRatio);
                      }}
                      className="px-2.5 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors text-left"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Prompt Description
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none leading-relaxed"
                  placeholder="Describe lighting, mood, materials, and scenery..."
                />
              </div>

              {/* Aspect Ratio & Theme Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Aspect Ratio
                  </label>
                  <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
                    {(['16:9', '9:16', '21:9'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                          aspectRatio === ratio
                            ? 'bg-zinc-800 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Artistic Style
                  </label>
                  <select
                    value={styleTheme}
                    onChange={(e: any) => setStyleTheme(e.target.value)}
                    className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  >
                    <option value="Cinematic">Cinematic</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="3D Render">3D Parametric</option>
                    <option value="Moody Retro">Moody Film</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generate Trigger */}
            <div className="pt-6">
              <button
                onClick={generateCanvasWallpaper}
                disabled={isGenerating || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white text-zinc-950 font-semibold rounded-xl hover:bg-zinc-200 transition-colors shadow-lg disabled:opacity-50 text-xs"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing 4K Texture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Bespoke Wallpaper</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Column */}
          <div className="w-full md:w-1/2 p-6 flex flex-col items-center justify-center bg-zinc-900/40 min-h-[340px]">
            {generatedResult ? (
              <div className="w-full flex flex-col items-center gap-4">
                <div
                  className={`relative w-full max-h-[50vh] rounded-xl overflow-hidden shadow-2xl border border-zinc-800 ${
                    aspectRatio === '9:16' ? 'aspect-[9/16] max-w-[260px]' : 'aspect-video'
                  }`}
                >
                  <img
                    src={generatedResult}
                    alt="AI Generated wallpaper"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleApplyToGallery}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-zinc-950 font-medium rounded-xl text-xs hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Add to Active Gallery</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-8 text-zinc-500">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-medium text-zinc-300 mb-1">Canvas Ready</h4>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Pick a curated concept blueprint or write your custom description to render an Ultra HD wallpaper.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
