export type StorageMediaAsset = {
  src: string;
  verified: boolean;
};

const SUPABASE_BASE_URL =
  'https://umyqlnurvuylnvtbrsiy.supabase.co/storage/v1/object/public/MaySecret';

const remoteAsset = (path: string): StorageMediaAsset => ({
  src: `${SUPABASE_BASE_URL}/${path}`,
  verified: true,
});

export const STORAGE_MEDIA = {
  logo: remoteAsset('Logo/maysecret_logo.png'),
  hero: {
    hero1: remoteAsset('Hero/heroimg1.PNG'),
    hero2: remoteAsset('Hero/heroimg2.MOV'),
    hero3: remoteAsset('Hero/heroimg3.MOV'),
    hero4: remoteAsset('Hero/heroimg4.PNG'),
  },
  combo: {
    combo: remoteAsset('Combo/combo.PNG'),
    combo2: remoteAsset('Combo/combo2.JPG'),
    combo3: remoteAsset('Combo/combo3.JPG'),
    combo4: remoteAsset('Combo/combo4.PNG'),
  },
  serum: {
    brighteningSerum: remoteAsset('Serum/brightening-serum.PNG'),
    brighteningSerum2: remoteAsset('Serum/brightening-serum2.PNG'),
    brighteningSerum3: remoteAsset('Serum/brightening-serum3.JPG'),
    brighteningSerum4: remoteAsset('Serum/brightening-serum4.PNG'),
  },
  spray: {
    sunscreenSpray: remoteAsset('Spray/sunscreen-spray.jpeg'),
    sunscreenSpray2: remoteAsset('Spray/sunscreen-spray2.JPG'),
    sunscreenSpray3: remoteAsset('Spray/sunscreen-spray3.JPG'),
    sunscreenSpray4: remoteAsset('Spray/sunscreen-spray4.JPG'),
  },
  skincareTips: {
    brightSkinGlow: remoteAsset('Skincare_Tips/bright-skin-glow.jpg'),
    glassSkinKorean: remoteAsset('Skincare_Tips/glass-skin-korean.png'),
    lightweightSkincare: remoteAsset('Skincare_Tips/lightweight-skincare.png'),
    morningSkincareRoutine: remoteAsset('Skincare_Tips/morning-skincare-routine.png'),
    niacinamideBenefits: remoteAsset('Skincare_Tips/niacinamide-benefits.png'),
    nightSkincareRoutine: remoteAsset('Skincare_Tips/night-skincare-routine.png'),
    riceExtractSkincare: remoteAsset('Skincare_Tips/rice-extract-skincare.png'),
    skinHydration: remoteAsset('Skincare_Tips/skin-hydration.jpg'),
    sunDamageProtection: remoteAsset('Skincare_Tips/sun-damage-protection.png'),
    sunscreenProtection: remoteAsset('Skincare_Tips/sunscreen-protection.png'),
  },
  giftPack: {
    giftKitPack: remoteAsset('Giftpack/giftkit_pack.png'),
  },
  serumCombo: {
    serumCombo: remoteAsset('SerumCombo/1.PNG'),
    serumCombo2: remoteAsset('SerumCombo/2.PNG'),
    serumCombo3: remoteAsset('SerumCombo/3.PNG'),
    serumCombo4: remoteAsset('SerumCombo/4.JPG'),
  },
  sprayCombo: {
    sprayCombo: remoteAsset('SprayCombo/1.JPG'),
    sprayCombo2: remoteAsset('SprayCombo/2.JPG'),
    sprayCombo3: remoteAsset('SprayCombo/3.JPG'),
  },
} as const;
