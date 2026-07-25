import { STORAGE_MEDIA } from '../config/storage';

const productImages: Record<string, string> = {
  'brightening-serum.png': STORAGE_MEDIA.serum.brighteningSerum.src,
  'combo.png': STORAGE_MEDIA.combo.combo.src,
  'serum-combo.png': STORAGE_MEDIA.serumCombo.serumCombo.src,
  'spray-combo.png': STORAGE_MEDIA.sprayCombo.sprayCombo.src,
  'sunscreen-spray.png': STORAGE_MEDIA.spray.sunscreenSpray.src,
  'sunscreen-spray.jpeg': STORAGE_MEDIA.spray.sunscreenSpray.src,
  'sunscreen-spray.jpg': STORAGE_MEDIA.spray.sunscreenSpray.src,
};

export const getProductImage = (image?: string | null): string => {
  if (!image) return '/placeholder-product.jpg';
  const key = image.trim().toLowerCase();
  return productImages[key] || image;
};

export const getProductImages = (images?: string[] | null): string[] => {
  if (!images || images.length === 0) return [];
  return images.map(getProductImage);
};
