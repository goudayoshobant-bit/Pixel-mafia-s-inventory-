import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Link, 
  Check, 
  Sparkles, 
  AlertCircle,
  Film
} from 'lucide-react';
import { Wallpaper, Category } from '../types/wallpaper';
import { CATEGORIES } from '../data/wallpapers';

interface UploadMediaModalProps {
  onClose: () => void;
  onWallpaperAdded: (wallpaper: Wallpaper) => void;
}

export const UploadMediaModal: React.FC<UploadMediaModalProps> = ({
  onClose,
  onWallpaperAdded,
}) => {
  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  // Media source state
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');

  // Form details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'All'>>('OLED Dark');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '21:9'>('9:16');
  const [instagramPostCode, setInstagramPostCode] = useState('#05');
  const [tagsInput, setTagsInput] = useState('pixelmafia, amoled, reels');
  const [description, setDescription] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFileDataUrl(result);

      if (isVideo) {
        // Extract a preview frame thumbnail from video using canvas
        const tempVideo = document.createElement('video');
        tempVideo.src = result;
        tempVideo.crossOrigin = 'anonymous';
        tempVideo.currentTime = 0.5;
        tempVideo.muted = true;
        tempVideo.playsInline = true;

        tempVideo.onloadeddata = () => {
          setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = tempVideo.videoWidth || 720;
            canvas.height = tempVideo.videoHeight || 1280;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
              setVideoThumbnailUrl(canvas.toDataURL('image/jpeg', 0.85));
            }
            setIsProcessing(false);
          }, 300);
        };

        tempVideo.onerror = () => {
          setIsProcessing(false);
        };
      } else {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);

    // Auto title suggestion from filename
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = mode === 'file' ? fileDataUrl : urlInput.trim();
    if (!finalUrl) return;

    const isVideo = mediaType === 'video';
    const thumbUrl = isVideo ? (videoThumbnailUrl || finalUrl) : finalUrl;

    const newWallpaper: Wallpaper = {
      id: `user-wp-${Date.now()}`,
      title: title.trim() || 'Untitled Wallpaper',
      category,
      device: aspectRatio === '9:16' ? 'mobile' : aspectRatio === '21:9' ? 'ultrawide' : 'desktop',
      aspectRatio,
      resolution: aspectRatio === '9:16' ? '1290 × 2796 (Retina OLED)' : '3840 × 2160 (4K UHD)',
      rawWidth: aspectRatio === '9:16' ? 1290 : 3840,
      rawHeight: aspectRatio === '9:16' ? 2796 : 2160,
      url: finalUrl,
      thumbnailUrl: thumbUrl,
      colorPalette: ['#09090b', '#27272a', '#eab308', '#f43f5e', '#3b82f6'],
      dominantColor: 'amber',
      author: {
        name: 'Pixel Mafia 👑',
        handle: '@aesthetic_walls_01',
      },
      downloads: 1,
      likes: 1,
      views: 1,
      tags: tagsInput.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean),
      description: description.trim() || `Featured on Instagram @aesthetic_walls_01.`,
      featured: true,
      instagramPostCode: instagramPostCode.trim() || undefined,
      creatorBrand: 'Pixel Mafia 👑',
      mediaType,
      videoUrl: isVideo ? finalUrl : undefined,
    };

    onWallpaperAdded(newWallpaper);
    onClose();
  };

  const hasMedia = mode === 'file' ? Boolean(fileDataUrl) : Boolean(urlInput.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm text-zinc-100">
              Add Photo or Video Wallpaper
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Source Toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setMode('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                mode === 'file'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Local File (Photo / Video)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                mode === 'url'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Paste Online URL</span>
            </button>
          </div>

          {/* Media Input Area */}
          {mode === 'file' ? (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-amber-400 bg-amber-500/5'
                    : fileDataUrl
                    ? 'border-zinc-700 bg-zinc-900/40'
                    : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />

                {fileDataUrl ? (
                  <div className="flex flex-col items-center">
                    {mediaType === 'video' ? (
                      <div className="relative w-36 aspect-[9/16] rounded-xl overflow-hidden border border-zinc-700 shadow-lg mb-2">
                        <video
                          src={fileDataUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur rounded text-[10px] text-amber-400 flex items-center gap-1">
                          <Film className="w-3 h-3" /> Live Video
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-36 aspect-[9/16] rounded-xl overflow-hidden border border-zinc-700 shadow-lg mb-2">
                        <img
                          src={fileDataUrl}
                          alt="Uploaded preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className="text-xs text-amber-400 font-medium">
                      File loaded! Click or drop another to replace
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-zinc-200">
                      Drag and drop your photo or live video wallpaper here
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Supports JPG, PNG, WEBP, and MP4 / WebM live video loops
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-400">
                Direct Image or MP4 Video URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (e.target.value.endsWith('.mp4') || e.target.value.endsWith('.webm')) {
                    setMediaType('video');
                  }
                }}
                placeholder="https://example.com/wallpaper.jpg or https://.../video.mp4"
                className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Wallpaper Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sage Mode Kurama Awakening"
                className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Instagram Reel / Post Code
              </label>
              <input
                type="text"
                value={instagramPostCode}
                onChange={(e) => setInstagramPostCode(e.target.value)}
                placeholder="e.g. #05 (shown in reel caption)"
                className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-amber-400 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-zinc-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Target Aspect Ratio
              </label>
              <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
                {(['9:16', '16:9', '21:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-zinc-800 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {ratio === '9:16' ? 'Mobile 9:16' : ratio === '16:9' ? 'Desktop 16:9' : 'Ultrawide'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="naruto, anime, amoled, 4k"
              className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Description / Caption
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Featured on Instagram @aesthetic_walls_01..."
              className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-600 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!hasMedia || isProcessing || !title.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-colors shadow-lg disabled:opacity-50 text-xs"
            >
              <Check className="w-4 h-4" />
              <span>Publish Wallpaper to Website</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
