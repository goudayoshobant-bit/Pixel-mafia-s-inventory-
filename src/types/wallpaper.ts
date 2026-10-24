export type Category = 
  | 'All'
  | 'Minimal'
  | 'Nature'
  | 'Sci-Fi'
  | 'Abstract'
  | 'Space'
  | 'Architecture'
  | 'OLED Dark';

export type DeviceType = 'all' | 'desktop' | 'mobile' | 'ultrawide';

export type ColorFilter = 
  | 'all'
  | 'monochrome'
  | 'blue'
  | 'purple'
  | 'amber'
  | 'emerald'
  | 'cyan'
  | 'rose';

export interface Wallpaper {
  id: string;
  title: string;
  category: Exclude<Category, 'All'>;
  device: 'desktop' | 'mobile' | 'ultrawide';
  aspectRatio: '16:9' | '9:16' | '21:9' | '4:3';
  resolution: string;
  rawWidth: number;
  rawHeight: number;
  url: string;
  thumbnailUrl: string;
  colorPalette: string[];
  dominantColor: Exclude<ColorFilter, 'all'>;
  author: {
    name: string;
    handle: string;
    avatar?: string;
  };
  downloads: number;
  likes: number;
  views: number;
  tags: string[];
  description: string;
  featured?: boolean;
  instagramPostCode?: string;
  creatorBrand?: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
}

export type MockupDevice = 'macbook' | 'iphone' | 'ipad' | 'ultrawide';

export interface WallpaperAdjustments {
  brightness: number; // 50 to 150
  contrast: number; // 50 to 150
  saturation: number; // 0 to 200
  blur: number; // 0 to 20
  sepia: number; // 0 to 100
  vignette: number; // 0 to 100
}
