import { STORAGE_MEDIA } from '../config/storage';

const brightSkinGlowImg = STORAGE_MEDIA.skincareTips.brightSkinGlow.src;
const glassSkinKoreanImg = STORAGE_MEDIA.skincareTips.glassSkinKorean.src;
const lightweightSkincareImg = STORAGE_MEDIA.skincareTips.lightweightSkincare.src;
const morningSkincareRoutineImg = STORAGE_MEDIA.skincareTips.morningSkincareRoutine.src;
const niacinamideBenefitsImg = STORAGE_MEDIA.skincareTips.niacinamideBenefits.src;
const nightSkincareRoutineImg = STORAGE_MEDIA.skincareTips.nightSkincareRoutine.src;
const riceExtractSkincareImg = STORAGE_MEDIA.skincareTips.riceExtractSkincare.src;
const skinHydrationImg = STORAGE_MEDIA.skincareTips.skinHydration.src;
const sunDamageProtectionImg = STORAGE_MEDIA.skincareTips.sunDamageProtection.src;
const sunscreenProtectionImg = STORAGE_MEDIA.skincareTips.sunscreenProtection.src;

export interface SkincareTip {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  slug: string;
  featured: boolean;
  category: string;
}

export const skincareTips: SkincareTip[] = [
  {
    id: 1,
    title: "Why Sunscreen Is The Most Important Skincare Step",
    shortDescription: "Daily sunscreen protects your skin from harmful UVA and UVB rays that cause premature aging and pigmentation.",
    fullDescription: "Sun exposure is the number one cause of premature skin aging. UV rays can damage skin cells, cause wrinkles, dark spots, and uneven skin tone. Using a broad spectrum SPF 50 sunscreen every day protects your skin from these harmful effects. Apply sunscreen every morning and reapply if you are outdoors for long hours. Your May Secret Sunscreen Spray provides lightweight sun protection while keeping your skin comfortable and non-greasy.",
    image: sunscreenProtectionImg,
    slug: "why-sunscreen-most-important-skincare-step",
    featured: true,
    category: "Sun Care"
  },
  {
    id: 2,
    title: "How To Achieve Korean Glass Skin",
    shortDescription: "Glass skin is smooth, hydrated, and naturally radiant skin that looks clear and luminous.",
    fullDescription: "Korean skincare focuses on hydration and gentle brightening ingredients. Key ingredients for glass skin include: • Niacinamide • Rice Extract • Hyaluronic Acid • Vitamin C. Using a brightening serum daily helps improve skin texture and radiance. The May Secret Rice Brightening Serum helps promote healthy glowing skin with powerful brightening ingredients.",
    image: glassSkinKoreanImg,
    slug: "how-to-achieve-korean-glass-skin",
    featured: true,
    category: "Glow Tip"
  },
  {
    id: 3,
    title: "The Perfect Morning Skincare Routine",
    shortDescription: "A good morning routine protects your skin from pollution, sun damage, and dehydration.",
    fullDescription: "Step 1 — Cleanse your face to remove oil buildup. Step 2 — Apply serum to brighten and hydrate skin. Step 3 — Apply sunscreen to protect against UV rays. Consistency is the key to healthy glowing skin.",
    image: morningSkincareRoutineImg,
    slug: "perfect-morning-skincare-routine",
    featured: true,
    category: "Routine"
  },
  {
    id: 4,
    title: "Why Niacinamide Is A Skincare Superstar",
    shortDescription: "Niacinamide is one of the most effective ingredients for improving skin tone and texture.",
    fullDescription: "Niacinamide helps: • Reduce pigmentation • Improve skin barrier • Minimize pores • Brighten dull skin. Regular use of Niacinamide-based products like Rice Brightening Serum can significantly improve skin clarity.",
    image: niacinamideBenefitsImg,
    slug: "why-niacinamide-skincare-superstar",
    featured: false,
    category: "Ingredient"
  },
  {
    id: 5,
    title: "The Benefits Of Rice Extract For Skin",
    shortDescription: "Rice extract has been used in Korean skincare for centuries to brighten and smooth skin.",
    fullDescription: "Rice extract is rich in antioxidants and nutrients that help: • Brighten skin tone • Improve hydration • Reduce dullness • Smooth skin texture. It gives the famous Korean glow effect.",
    image: riceExtractSkincareImg,
    slug: "benefits-rice-extract-skin",
    featured: false,
    category: "Ingredient"
  },
  {
    id: 6,
    title: "How To Prevent Sun Damage Naturally",
    shortDescription: "Sun damage can lead to pigmentation, wrinkles, and dull skin.",
    fullDescription: "Protect your skin with these habits: • Use SPF 50 sunscreen daily • Wear hats or protective clothing • Avoid direct sunlight during peak hours • Reapply sunscreen every 2-3 hours. Sun protection is the foundation of healthy skin.",
    image: sunDamageProtectionImg,
    slug: "prevent-sun-damage-naturally",
    featured: false,
    category: "Sun Care"
  },
  {
    id: 7,
    title: "The Secret To Bright And Even Skin Tone",
    shortDescription: "Bright skin is the result of consistent care and the right ingredients.",
    fullDescription: "Ingredients that improve skin brightness include: • Niacinamide • Vitamin C • Rice Extract • Alpha Arbutin. These ingredients help reduce pigmentation and enhance skin glow.",
    image: brightSkinGlowImg,
    slug: "secret-bright-even-skin-tone",
    featured: false,
    category: "Glow Tip"
  },
  {
    id: 8,
    title: "Hydration Is The Key To Healthy Skin",
    shortDescription: "Hydrated skin looks smoother, brighter, and more youthful.",
    fullDescription: "To maintain hydration: • Drink enough water • Use hydrating skincare products • Avoid harsh cleansers • Apply serums that lock moisture into the skin. Healthy hydration improves skin elasticity and glow.",
    image: skinHydrationImg,
    slug: "hydration-key-healthy-skin",
    featured: false,
    category: "Hydration"
  },
  {
    id: 9,
    title: "Why Lightweight Skincare Is Better For Daily Use",
    shortDescription: "Heavy creams can clog pores and make skin feel greasy.",
    fullDescription: "Lightweight skincare products absorb quickly and allow the skin to breathe. Products like May Secret Sunscreen Spray provide sun protection without leaving a sticky or oily residue.",
    image: lightweightSkincareImg,
    slug: "why-lightweight-skincare-better-daily-use",
    featured: false,
    category: "Product Tip"
  },
  {
    id: 10,
    title: "A Simple Night Skincare Routine",
    shortDescription: "Nighttime is when your skin repairs and regenerates itself.",
    fullDescription: "Step 1 — Cleanse your skin thoroughly. Step 2 — Apply a brightening serum. Step 3 — Use a moisturizer if needed. Night skincare helps repair damage caused during the day.",
    image: nightSkincareRoutineImg,
    slug: "simple-night-skincare-routine",
    featured: false,
    category: "Routine"
  }
];

export const featuredTips = skincareTips.filter(tip => tip.featured);
