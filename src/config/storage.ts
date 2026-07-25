import logoFallback from '../assets/images/Logo/maysecret_logo.png';
import heroImg1Fallback from '../assets/images/Hero/heroimg1.PNG';
import heroVideo2Fallback from '../assets/images/Hero/heroimg2.MOV';
import heroVideo3Fallback from '../assets/images/Hero/heroimg3.MOV';
import heroImg4Fallback from '../assets/images/Hero/heroimg4.PNG';
import comboFallback from '../assets/images/Combo/combo.PNG';
import combo2Fallback from '../assets/images/Combo/combo2.JPG';
import combo3Fallback from '../assets/images/Combo/combo3.JPG';
import brighteningSerumFallback from '../assets/images/Serum/brightening-serum.PNG';
import brighteningSerum2Fallback from '../assets/images/Serum/brightening-serum2.PNG';
import brighteningSerum3Fallback from '../assets/images/Serum/brightening-serum3.JPG';
import brighteningSerum4Fallback from '../assets/images/Serum/brightening-serum4.PNG';
import sunscreenSprayFallback from '../assets/images/Spray/sunscreen-spray.jpeg';
import sunscreenSpray2Fallback from '../assets/images/Spray/sunscreen-spray2.JPG';
import sunscreenSpray3Fallback from '../assets/images/Spray/sunscreen-spray3.JPG';
import sunscreenSpray4Fallback from '../assets/images/Spray/sunscreen-spray4.JPG';
import brightSkinGlowFallback from '../assets/images/Skincare_Tips/bright-skin-glow.jpg';
import glassSkinKoreanFallback from '../assets/images/Skincare_Tips/glass-skin-korean.png';
import lightweightSkincareFallback from '../assets/images/Skincare_Tips/lightweight-skincare.png';
import morningSkincareRoutineFallback from '../assets/images/Skincare_Tips/morning-skincare-routine.png';
import niacinamideBenefitsFallback from '../assets/images/Skincare_Tips/niacinamide-benefits.png';
import nightSkincareRoutineFallback from '../assets/images/Skincare_Tips/night-skincare-routine.png';
import riceExtractSkincareFallback from '../assets/images/Skincare_Tips/rice-extract-skincare.png';
import skinHydrationFallback from '../assets/images/Skincare_Tips/skin-hydration.jpg';
import sunDamageProtectionFallback from '../assets/images/Skincare_Tips/sun-damage-protection.png';
import sunscreenProtectionFallback from '../assets/images/Skincare_Tips/sunscreen-protection.png';
import giftKitPackFallback from '../assets/images/Giftpack/giftkit_pack.png';
import serumComboFallback from '../assets/images/SerumCombo/1.PNG';
import serumCombo2Fallback from '../assets/images/SerumCombo/2.JPG';
import serumCombo3Fallback from '../assets/images/SerumCombo/3.JPG';
import sprayComboFallback from '../assets/images/SprayCombo/1.JPG';
import sprayCombo2Fallback from '../assets/images/SprayCombo/2.JPG';

export type StorageMediaAsset = {
  src: string;
  fallback: string;
  verified: boolean;
};

const SUPABASE_BASE_URL =
  'https://umyqlnurvuylnvtbrsiy.supabase.co/storage/v1/object/public/MaySecret';

const remoteAsset = (path: string, fallback: string): StorageMediaAsset => ({
  src: `${SUPABASE_BASE_URL}/${path}`,
  fallback,
  verified: true,
});

const localAsset = (fallback: string): StorageMediaAsset => ({
  src: fallback,
  fallback,
  verified: false,
});

export const STORAGE_MEDIA = {
  logo: remoteAsset('Logo/maysecret_logo.png', logoFallback),
  hero: {
    hero1: remoteAsset('Hero/heroimg1.PNG', heroImg1Fallback),
    hero2: remoteAsset('Hero/heroimg2.MOV', heroVideo2Fallback),
    hero3: remoteAsset('Hero/heroimg3.MOV', heroVideo3Fallback),
    hero4: remoteAsset('Hero/heroimg4.PNG', heroImg4Fallback),
  },
  combo: {
    combo: remoteAsset('Combo/combo.PNG', comboFallback),
    combo2: remoteAsset('Combo/combo2.JPG', combo2Fallback),
    combo3: remoteAsset('Combo/combo3.JPG', combo3Fallback),
  },
  serum: {
    brighteningSerum: remoteAsset('Serum/brightening-serum.PNG', brighteningSerumFallback),
    brighteningSerum2: remoteAsset('Serum/brightening-serum2.PNG', brighteningSerum2Fallback),
    brighteningSerum3: remoteAsset('Serum/brightening-serum3.JPG', brighteningSerum3Fallback),
    brighteningSerum4: remoteAsset('Serum/brightening-serum4.PNG', brighteningSerum4Fallback),
  },
  spray: {
    sunscreenSpray: remoteAsset('Spray/sunscreen-spray.jpeg', sunscreenSprayFallback),
    sunscreenSpray2: remoteAsset('Spray/sunscreen-spray2.JPG', sunscreenSpray2Fallback),
    sunscreenSpray3: remoteAsset('Spray/sunscreen-spray3.JPG', sunscreenSpray3Fallback),
    sunscreenSpray4: remoteAsset('Spray/sunscreen-spray4.JPG', sunscreenSpray4Fallback),
  },
  skincareTips: {
    brightSkinGlow: remoteAsset('Skincare_Tips/bright-skin-glow.jpg', brightSkinGlowFallback),
    glassSkinKorean: remoteAsset('Skincare_Tips/glass-skin-korean.png', glassSkinKoreanFallback),
    lightweightSkincare: remoteAsset('Skincare_Tips/lightweight-skincare.png', lightweightSkincareFallback),
    morningSkincareRoutine: remoteAsset('Skincare_Tips/morning-skincare-routine.png', morningSkincareRoutineFallback),
    niacinamideBenefits: remoteAsset('Skincare_Tips/niacinamide-benefits.png', niacinamideBenefitsFallback),
    nightSkincareRoutine: remoteAsset('Skincare_Tips/night-skincare-routine.png', nightSkincareRoutineFallback),
    riceExtractSkincare: remoteAsset('Skincare_Tips/rice-extract-skincare.png', riceExtractSkincareFallback),
    skinHydration: remoteAsset('Skincare_Tips/skin-hydration.jpg', skinHydrationFallback),
    sunDamageProtection: remoteAsset('Skincare_Tips/sun-damage-protection.png', sunDamageProtectionFallback),
    sunscreenProtection: remoteAsset('Skincare_Tips/sunscreen-protection.png', sunscreenProtectionFallback),
  },
  giftPack: {
    giftKitPack: remoteAsset('Giftpack/giftkit_pack.png', giftKitPackFallback),
  },
  serumCombo: {
    serumCombo: remoteAsset('SerumCombo/1.PNG', serumComboFallback),
    serumCombo2: remoteAsset('SerumCombo/2.JPG', serumCombo2Fallback),
    serumCombo3: remoteAsset('SerumCombo/3.JPG', serumCombo3Fallback),
  },
  sprayCombo: {
    sprayCombo: remoteAsset('SprayCombo/1.JPG', sprayComboFallback),
    sprayCombo2: remoteAsset('SprayCombo/2.JPG', sprayCombo2Fallback),
  },
} as const;

const collectAssets = (value: unknown): StorageMediaAsset[] => {
  if (!value || typeof value !== 'object') return [];
  if ('src' in value && 'fallback' in value) return [value as StorageMediaAsset];

  return Object.values(value as Record<string, unknown>).flatMap(collectAssets);
};

const mediaFallbacks = new Map(
  collectAssets(STORAGE_MEDIA).map((asset) => [asset.src, asset.fallback])
);

export const getMediaFallback = (src?: string | null): string | undefined => {
  if (!src) return undefined;
  return mediaFallbacks.get(src);
};

export const handleMediaFallback = (
  event: { currentTarget: HTMLImageElement | HTMLVideoElement },
  asset?: StorageMediaAsset
) => {
  const target = event.currentTarget;
  const fallback = asset?.fallback || getMediaFallback(target.currentSrc || target.getAttribute('src'));

  if (!fallback || target.getAttribute('src') === fallback) {
    console.warn(`Media failed to load and no fallback was available: ${target.currentSrc || target.getAttribute('src')}`);
    return;
  }

  console.warn(`Supabase media failed to load, using local fallback: ${target.currentSrc || target.getAttribute('src')}`);
  target.setAttribute('src', fallback);
};
