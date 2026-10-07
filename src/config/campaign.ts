import desktopProductImage from '../assets/images/1.png';
import desktopBackgroundImage from '../assets/images/2.png';
import mobileBackgroundImage from '../assets/images/3.png';
import mobileProductImage from '../assets/images/4.png';
import { products } from '../utils/productData';
import { calculateDiscountPercentage, calculateSavingsAmount } from '../utils/pricing';

export const CAMPAIGN_TIME_ZONE = 'Asia/Kolkata';
export const NAVRATRI_CAMPAIGN_START = '2026-10-11T00:00:00+05:30';
export const NAVRATRI_CAMPAIGN_END = '2026-10-20T23:59:59+05:30';

export type CampaignState = 'upcoming' | 'active' | 'dussehra' | 'ended';
export type CampaignTheme = 'navratri';
export type CampaignMediaType = 'image';

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

export type NavratriDailyTheme = {
  day: number;
  name: string;
  accent: string;
  glow: string;
};

export const navratriDailyThemes: NavratriDailyTheme[] = [
  { day: 1, name: 'Yellow', accent: '#F6C453', glow: 'rgba(246, 196, 83, 0.34)' },
  { day: 2, name: 'Green', accent: '#65B87A', glow: 'rgba(101, 184, 122, 0.32)' },
  { day: 3, name: 'Grey', accent: '#B8BDC8', glow: 'rgba(184, 189, 200, 0.28)' },
  { day: 4, name: 'Orange', accent: '#E78B49', glow: 'rgba(231, 139, 73, 0.34)' },
  { day: 5, name: 'White', accent: '#F7F2EA', glow: 'rgba(247, 242, 234, 0.26)' },
  { day: 6, name: 'Red', accent: '#C94A5D', glow: 'rgba(201, 74, 93, 0.34)' },
  { day: 7, name: 'Royal Blue', accent: '#5E79C9', glow: 'rgba(94, 121, 201, 0.32)' },
  { day: 8, name: 'Pink', accent: '#D97CA6', glow: 'rgba(217, 124, 166, 0.34)' },
  { day: 9, name: 'Purple', accent: '#8E6BB8', glow: 'rgba(142, 107, 184, 0.34)' },
  { day: 10, name: 'Dussehra Gold', accent: '#D6A94D', glow: 'rgba(214, 169, 77, 0.38)' },
];

const indiaDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: CAMPAIGN_TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const campaignStartTime = new Date(NAVRATRI_CAMPAIGN_START).getTime();
const campaignEndTime = new Date(NAVRATRI_CAMPAIGN_END).getTime();
const campaignStartCalendarDay = Date.UTC(2026, 9, 11);

const getIndiaCalendarDay = (now: Date): number => {
  const dateParts = indiaDateFormatter.formatToParts(now).reduce<Record<string, string>>((result, part) => {
    if (part.type !== 'literal') result[part.type] = part.value;
    return result;
  }, {});

  return Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day));
};

export const getCampaignState = (now = new Date()): CampaignState => {
  const currentTime = now.getTime();
  if (currentTime < campaignStartTime) return 'upcoming';
  if (currentTime > campaignEndTime) return 'ended';

  const dayOffset = getIndiaCalendarDay(now) - campaignStartCalendarDay;
  return dayOffset >= 9 ? 'dussehra' : 'active';
};

export const getCampaignDay = (now = new Date()): number | null => {
  const campaignState = getCampaignState(now);
  if (campaignState === 'upcoming' || campaignState === 'ended') return null;

  const day = Math.floor((getIndiaCalendarDay(now) - campaignStartCalendarDay) / 86_400_000) + 1;
  return Math.min(Math.max(day, 1), navratriDailyThemes.length);
};

export const getDailyTheme = (day = getCampaignDay()): NavratriDailyTheme =>
  navratriDailyThemes.find((theme) => theme.day === day) ?? navratriDailyThemes[0];

export const getCampaignCountdownTarget = (now = new Date()): string | null => {
  const campaignState = getCampaignState(now);
  if (campaignState === 'upcoming') return NAVRATRI_CAMPAIGN_START;
  if (campaignState === 'active' || campaignState === 'dussehra') return NAVRATRI_CAMPAIGN_END;
  return null;
};

export const getCampaignCountdownTitle = (now = new Date()): string => {
  const campaignState = getCampaignState(now);
  if (campaignState === 'upcoming') return 'Navratri Glow Begins In';
  if (campaignState === 'dussehra') return 'Dussehra Glow Sale Ends In';
  return 'Navratri Glow Sale Ends In';
};

export const isCampaignVisible = (now = new Date()): boolean => getCampaignState(now) !== 'ended';

const glowCombo = products.find((product) => product.id === 3);
const maxDiscount = Math.max(
  ...products.map((product) => calculateDiscountPercentage(product.originalPrice, product.price) ?? 0)
);
const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
const glowComboPrice = glowCombo ? formatCurrency(glowCombo.price) : '';
const glowComboOriginalPrice = glowCombo?.originalPrice ? formatCurrency(glowCombo.originalPrice) : '';
const glowComboSavings = glowCombo ? calculateSavingsAmount(glowCombo.originalPrice, glowCombo.price) : null;
const glowComboDiscount = glowCombo ? calculateDiscountPercentage(glowCombo.originalPrice, glowCombo.price) : null;

export type CampaignConfig = {
  campaignName: string;
  campaignLabel: string;
  campaignTheme: CampaignTheme;
  heading: string;
  subHeading: string;
  description: string;
  accentColors: CampaignColors;
  gradientColors: { hero: string; announcement: string };
  heroDesktopImage: string;
  heroTabletImage: string;
  heroMobileImage: string;
  heroDesktopBackgroundImage: string;
  heroMobileBackgroundImage: string;
  featuredPromoMedia: string;
  heroImageFit: 'contain' | 'cover';
  heroImagePosition: string;
  heroMediaType: CampaignMediaType;
  heroMediaAlt: string;
  offerPercentage: number;
  announcementText: string;
  primaryCTA: CampaignCTA;
  secondaryCTA: CampaignCTA;
  featuredComboName: string;
  featuredComboPrice: string;
  featuredComboOriginalPrice: string;
  featuredComboSavings: string;
  featuredComboDiscount: number | null;
  featuredComboCtaText: string;
  featuredComboHref: string;
  offerChips: string[];
  trustPoints: string[];
  showAnnouncementBar: boolean;
  showCountdown: boolean;
  showOfferBadge: boolean;
  showFloatingComboCard: boolean;
  showTrustStrip: boolean;
  showSecondaryCTA: boolean;
  showRating: boolean;
  showSavings: boolean;
  showOriginalPrice: boolean;
  showPriceCard: boolean;
  backgroundEffects: { glow: boolean };
};

export const campaign: CampaignConfig = {
  campaignName: 'MaySecret Navratri Glow',
  campaignLabel: 'MaySecret • Navratri Glow',
  campaignTheme: 'navratri',
  heading: 'Navratri Glow',
  subHeading: '9 Nights. 1 Radiant You.',
  description: 'Celebrate every night with Korean-inspired skincare made for your festive glow.',
  accentColors: {
    primary: '#741B38',
    secondary: '#3A0B19',
    accent: '#D6A94D',
    deep: '#10070B',
    soft: '#F8E8C4',
  },
  gradientColors: {
    hero: 'radial-gradient(circle at 76% 44%, rgba(125, 27, 59, 0.82), transparent 33%), linear-gradient(122deg, #10070B 0%, #2B0A19 48%, #12070B 100%)',
    announcement: 'linear-gradient(90deg, #19080E 0%, #6D1738 50%, #19080E 100%)',
  },
  heroDesktopImage: desktopProductImage,
  heroTabletImage: desktopProductImage,
  heroMobileImage: mobileProductImage,
  heroDesktopBackgroundImage: desktopBackgroundImage,
  heroMobileBackgroundImage: mobileBackgroundImage,
  featuredPromoMedia: mobileProductImage,
  heroImageFit: 'contain',
  heroImagePosition: 'center',
  heroMediaType: 'image',
  heroMediaAlt: 'MaySecret Rice Brightening Serum and Sunscreen Spray in a premium festive skincare composition',
  offerPercentage: maxDiscount,
  announcementText: `9 Nights of Glow • Up to ${maxDiscount}% Off • Combo Packs from ₹899 • Free Shipping • Cash on Delivery`,
  primaryCTA: { label: 'Shop Navratri Glow', href: '/shop' },
  secondaryCTA: { label: 'Explore Glow Combos', href: '/shop?category=combo' },
  featuredComboName: 'Navratri Glow Combo',
  featuredComboPrice: glowComboPrice,
  featuredComboOriginalPrice: glowComboOriginalPrice,
  featuredComboSavings: glowComboSavings === null ? '' : `Save ${formatCurrency(glowComboSavings)}`,
  featuredComboDiscount: glowComboDiscount,
  featuredComboCtaText: 'Shop Glow Combo',
  featuredComboHref: '/product/3',
  offerChips: [`Up to ${maxDiscount}% Off`, 'Combo Packs from ₹899', 'Free Shipping', 'Cash on Delivery'],
  trustPoints: ['Korean Inspired', 'Premium Ingredients', 'Cruelty Free', 'Customer Favourite'],
  showAnnouncementBar: true,
  showCountdown: true,
  showOfferBadge: true,
  showFloatingComboCard: true,
  showTrustStrip: true,
  showSecondaryCTA: true,
  showRating: true,
  showSavings: true,
  showOriginalPrice: true,
  showPriceCard: true,
  backgroundEffects: { glow: true },
};
