'use client';

import type { SocialPlatform } from '@/app/types/social';

interface PlatformIconProps {
  platform: SocialPlatform;
  size?: number;
}

const platformColors: Record<SocialPlatform, string> = {
  facebook: 'text-blue-600',
  instagram: 'text-pink-500',
  tiktok: 'text-black',
  whatsapp: 'text-green-500',
  linkedin: 'text-blue-700',
};

const platformGradients: Record<SocialPlatform, string> = {
  facebook: 'from-blue-600/10 to-blue-400/5',
  instagram: 'from-pink-600/10 to-orange-400/5',
  tiktok: 'from-black/10 to-gray-700/5',
  whatsapp: 'from-green-600/10 to-green-400/5',
  linkedin: 'from-blue-700/10 to-blue-500/5',
};

export function PlatformIcon({ platform, size = 24 }: PlatformIconProps) {
  const iconMap: Record<SocialPlatform, string> = {
    facebook: '👨‍💼',
    instagram: '📸',
    tiktok: '🎬',
    whatsapp: '💬',
    linkedin: '💼',
  };

  return (
    <span style={{ fontSize: size }} className="inline-block">
      {iconMap[platform]}
    </span>
  );
}

export function getPlatformColor(platform: SocialPlatform): string {
  return platformColors[platform];
}

export function getPlatformGradient(platform: SocialPlatform): string {
  return platformGradients[platform];
}

export function getPlatformLabel(platform: SocialPlatform): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}
