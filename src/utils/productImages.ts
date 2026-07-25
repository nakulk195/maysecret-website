import brighteningSerumImg from '../assets/images/Serum/brightening-serum.PNG';
import comboImg from '../assets/images/Combo/combo.PNG';
import serumComboImg from '../assets/images/SerumCombo/1.PNG';
import sprayComboImg from '../assets/images/SprayCombo/1.JPG';
import sunscreenSprayImg from '../assets/images/Spray/sunscreen-spray.jpeg';

const productImages: Record<string, string> = {
  'brightening-serum.png': brighteningSerumImg,
  'combo.png': comboImg,
  'serum-combo.png': serumComboImg,
  'spray-combo.png': sprayComboImg,
  'sunscreen-spray.png': sunscreenSprayImg,
  'sunscreen-spray.jpeg': sunscreenSprayImg,
  'sunscreen-spray.jpg': sunscreenSprayImg,
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
