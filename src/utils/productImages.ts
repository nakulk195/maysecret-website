import brighteningSerumImg from '../assets/images/brightening-serum.PNG';
import comboImg from '../assets/images/combo.PNG';
import sunscreenSprayImg from '../assets/images/sunscreen-spray.PNG';

const productImages: Record<string, string> = {
  'brightening-serum.png': brighteningSerumImg,
  'combo.png': comboImg,
  'sunscreen-spray.png': sunscreenSprayImg,
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
