import heroImage from '../assets/images/1.png';
import alternateHeroImage from '../assets/images/2.png';
import backgroundImage from '../assets/images/3.png';
import featuredPromoImage from '../assets/images/4.png';

const twentyFourHourCampaignEnd = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

export type FloatingCampaignCard = {
  id: string;
  label: string;
  title: string;
  detail: string;
};

export type CampaignTheme = 'monsoon' | 'diwali' | 'summer' | 'valentine' | 'black-friday' | 'new-year';
export type CampaignMediaType = 'image' | 'video' | 'three';

export type CampaignCTA = {
  label: string;
  href: string;
};

export type CampaignColors = {
  primary: string;
  secondary: string;
  accent: string;
  deep: string;
  soft: string;
};

export type CampaignConfig = {
  campaignName: string;
  campaignLabel: string;
  campaignTheme: CampaignTheme;
  heading: string;
  subHeading: string;
  description: string;
  accentColors: CampaignColors;
  gradientColors: {
    hero: string;
    announcement: string;
  };
  heroMedia: string;
  alternateHeroMedia: string;
  backgroundMedia: string;
  featuredPromoMedia: string;
  heroDesktopImage: string;
  heroTabletImage: string;
  heroMobileImage: string;
  backgroundImage: string;
  heroImageFit: 'contain' | 'cover';
  heroImagePosition: string;
  heroHeightDesktop: string;
  heroHeightMobile: string;
  heroCardStyle: 'glass-emerald';
  mobileHeroLayout: 'shopping-card';
  desktopHeroLayout: 'split-campaign';
  heroMediaType: CampaignMediaType;
  heroMediaAlt: string;
  offerPercentage: number;
  comboSavings: string;
  comboSavingsLabel: string;
  announcementText: string;
  countdownEndDate: string;
  countdownTitle: string;
  countdownEnabled: boolean;
  heroBadge: {
    eyebrow: string;
    suffix: string;
  };
  primaryCTA: CampaignCTA;
  secondaryCTA: CampaignCTA;
  seasonalTheme: CampaignTheme;
  featuredComboName: string;
  featuredComboPrice: string;
  featuredComboOriginalPrice: string;
  featuredComboSavings: string;
  featuredComboCtaText: string;
  featuredProducts: string[];
  offerChips: string[];
  trustPoints: string[];
  floatingCards: FloatingCampaignCard[];
  isCampaignActive: boolean;
  showAnnouncementBar: boolean;
  showCountdown: boolean;
  showOfferBadge: boolean;
  showFloatingComboCard: boolean;
  showShippingCard: boolean;
  showTrustStrip: boolean;
  showSecondaryCTA: boolean;
  showRating: boolean;
  showSavings: boolean;
  showOriginalPrice: boolean;
  showPriceCard: boolean;
  backgroundEffects: {
    rain: boolean;
    mist: boolean;
    glow: boolean;
  };
};

export const campaign: CampaignConfig = {
  campaignName: 'Monsoon Glow Sale',
  campaignLabel: 'Limited Time',
  campaignTheme: 'monsoon',
  heading: 'Monsoon Glow Sale',
  subHeading: 'Healthy Skin Starts Here',
  description:
    'Discover Korean-inspired skincare with exclusive Monsoon offers. Save more on bestselling combo packs and enjoy premium skincare at special seasonal prices.',
  accentColors: {
    primary: '#10b981',
    secondary: '#0ea5e9',
    accent: '#fbbf24',
    deep: '#020617',
    soft: '#d1fae5',
  },
  gradientColors: {
    hero: 'linear-gradient(135deg, #020617 0%, #062f2d 44%, #0f172a 100%)',
    announcement: 'linear-gradient(90deg, #020617 0%, #064e3b 50%, #0f172a 100%)',
  },
  heroMedia: heroImage,
  alternateHeroMedia: alternateHeroImage,
  backgroundMedia: backgroundImage,
  featuredPromoMedia: featuredPromoImage,
  heroDesktopImage: heroImage,
  heroTabletImage: alternateHeroImage,
  heroMobileImage: featuredPromoImage,
  backgroundImage,
  heroImageFit: 'contain',
  heroImagePosition: 'center',
  heroHeightDesktop: '680px',
  heroHeightMobile: 'auto',
  heroCardStyle: 'glass-emerald',
  mobileHeroLayout: 'shopping-card',
  desktopHeroLayout: 'split-campaign',
  heroMediaType: 'image',
  heroMediaAlt: 'May Secret Monsoon Glow Sale combo pack with rice brightening serum and sunscreen spray',
  offerPercentage: 65,
  comboSavings: 'Rs. 1619',
  comboSavingsLabel: 'Combo Savings',
  announcementText:
    'Monsoon Glow Sale - Up to 65% OFF - Combo Packs from Rs. 879 - Free Shipping - Limited Time Offer',
  countdownEndDate: twentyFourHourCampaignEnd,
  countdownTitle: 'Offer Ends In',
  countdownEnabled: true,
  heroBadge: {
    eyebrow: 'Up To',
    suffix: 'Off',
  },
  primaryCTA: {
    label: 'Shop Monsoon Sale',
    href: '/shop',
  },
  secondaryCTA: {
    label: 'Explore Combo Packs',
    href: '/shop?category=combo',
  },
  seasonalTheme: 'monsoon',
  featuredComboName: 'Glow Combo Pack',
  featuredComboPrice: 'Rs. 879',
  featuredComboOriginalPrice: 'Rs. 2498',
  featuredComboSavings: 'Save Rs. 1619',
  featuredComboCtaText: 'View Details',
  featuredProducts: ['Rice Brightening Serum', 'Sunscreen Spray'],
  offerChips: ['Limited Time', 'Free Shipping', 'Cash on Delivery', 'Korean Inspired'],
  trustPoints: ['Korean Inspired', 'Premium Ingredients', 'Cruelty Free', 'Customer Favourite'],
  floatingCards: [
    {
      id: 'best-value',
      label: 'Best Value',
      title: 'Glow Combo Pack',
      detail: 'Save Rs. 1619',
    },
  ],
  isCampaignActive: true,
  showAnnouncementBar: true,
  showCountdown: true,
  showOfferBadge: true,
  showFloatingComboCard: true,
  showShippingCard: false,
  showTrustStrip: true,
  showSecondaryCTA: true,
  showRating: true,
  showSavings: true,
  showOriginalPrice: true,
  showPriceCard: true,
  backgroundEffects: {
    rain: true,
    mist: true,
    glow: true,
  },
};
