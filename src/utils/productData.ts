import { ProductService } from '../services/productService';
import { Product as SupabaseProduct } from '../lib/supabase';

import brighteningSerumImg from "../assets/images/Serum/brightening-serum.PNG";
import brighteningSerum2Img from "../assets/images/Serum/brightening-serum2.PNG";
import brighteningSerum3Img from "../assets/images/Serum/brightening-serum3.JPG";
import brighteningSerum4Img from "../assets/images/Serum/brightening-serum4.PNG";
import sunscreenSprayImg from "../assets/images/Spray/sunscreen-spray.jpeg";
import sunscreenSpray2Img from "../assets/images/Spray/sunscreen-spray2.JPG";
import sunscreenSpray3Img from "../assets/images/Spray/sunscreen-spray3.JPG";
import sunscreenSpray4Img from "../assets/images/Spray/sunscreen-spray4.JPG";
import comboImg from "../assets/images/Combo/combo.PNG";
import combo2Img from "../assets/images/Combo/combo2.JPG";
import combo3Img from "../assets/images/Combo/combo3.JPG";
import serumComboImg from "../assets/images/SerumCombo/1.PNG";
import serumCombo2Img from "../assets/images/SerumCombo/2.JPG";
import serumCombo3Img from "../assets/images/SerumCombo/3.JPG";
import sprayComboImg from "../assets/images/SprayCombo/1.JPG";
import sprayCombo2Img from "../assets/images/SprayCombo/2.JPG";

// Category type and available product categories
export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: 'serum', name: 'Serum' },
  { id: 'sunscreen', name: 'Sunscreen' },
  { id: 'combo', name: 'Combo Pack' }
];

// Legacy Product interface for backward compatibility
export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  benefits: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  size?: string;
  ingredients?: string[];
  howToUse?: string[];
  created_at: string; // ISO date string
  isFeatured?: boolean; // Indicates if the product is featured
  storage?: string;
  caution?: string;
  manufacturer?: {
    marketedBy: {
      name: string;
      address: string;
      email: string;
    };
    manufacturedBy: {
      name: string;
      address: string;
      licenseNo: string;
    }
  };
  includes?: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "MAY SECRET Sunscreen Spray",
    isFeatured: true,
    price: 349,
    created_at: "2024-11-01T00:00:00.000Z",
    originalPrice: 999,
    image: sunscreenSprayImg,
    images: [
      sunscreenSprayImg,
      sunscreenSpray2Img,
      sunscreenSpray3Img,
      sunscreenSpray4Img
    ],
    description: "Introducing our new sunscreen spray, fortified with advanced sun protection technology. Formulated with Suncat DE, Uvinul A Plus, and other powerful sunscreen agents, it provides broad-spectrum protection against both UVA and UVB rays. With its lightweight and non-greasy formula, it is perfect for daily use, keeping your skin safe and healthy under the sun.",
    benefits: [
      "UVA UVB RAYS PROTECTION",
      "SPRAY SLAY GLOW BEYOND THE SUN",
      "QUICK APPLICATION",
      "NO WHITE CAST",
      "WATER RESISTANT",
      "SPF 50 PA+++",
      "Broad Spectrum UVA/UVB Protection",
      "Lightweight Non-Greasy Formula",
      "For All Skin Types",
      "Net Qty: 100 ml"
    ],
    category: "sunscreen",
    stock: 1,
    rating: 4.6,
    reviews: 89,
    size: "100 ml",
    ingredients: [
      "Purified Water",
      "Propanediol",
      "Ethylhexyl Methoxycinnamate",
      "Butyl Methoxydibenzoyl Methane",
      "Benzophenone-3",
      "Phospholipids",
      "1,3-Butylene Glycol",
      "Diethylamino Hydroxybenzoyl Hexyl Benzoate",
      "Octocrylene",
      "Ester of Ethyl Olivate",
      "Olive Oil Methyl Ester",
      "Cyclopentasiloxane",
      "Dimethicone Crosspolymer",
      "Dicaprylyl Carbonate",
      "Phenoxyethanol & Ethylhexyl Glycerin",
      "Dimethicone",
      "Perfume",
      "Tapioca Starch",
      "Polymethylsilsesquioxane",
      "Emulsifying Wax",
      "Glyceryl Stearate",
      "PEG-100 Stearate",
      "Tocopheryl Acetate"
    ],
    howToUse: [
      "Face: Spray a generous amount onto your hand and gently apply on face. Dab until fully absorbed.",
      "Body: Spray directly from a distance of 1-2 inches and spread evenly."
    ],
    storage: "Store upright with cap tightly closed in a cool dry place away from direct sunlight. Do not refrigerate. Keep away from children.",
    caution: "Avoid contact with eyes. If irritation or allergic reaction occurs discontinue use immediately.",
    manufacturer: {
      marketedBy: {
        name: "MAY SECRET Skin & Beauty",
        address: "Shop No.2 Park Plaza, Opp. Kamla Nehru Park, Prabhat Road Pune 411004",
        email: "maysecretskinandbeauty@gmail.com"
      },
      manufacturedBy: {
        name: "Maxnova Healthcare",
        address: "Plot No 5,6,7 Davni Industrial Area, PO Gurumajra Baddi, Distt Solan Himachal Pradesh 174101",
        licenseNo: "HIM/COS/L/24/370"
      }
    }
  },
  {
    id: 2,
    name: "Rice Brightening Serum",
    isFeatured: true,
    price: 549,
    created_at: "2024-11-15T00:00:00.000Z",
    originalPrice: 1499,
    image: brighteningSerumImg,
    images: [
      brighteningSerumImg,
      brighteningSerum2Img,
      brighteningSerum3Img,
      brighteningSerum4Img
    ],
    description: "A powerful brightening serum enriched with Rice Extract, Niacinamide and Sepiwhite designed to improve skin tone, reduce pigmentation and give a radiant glass glow skin effect.",
    benefits: [
      "RICE EXTRACT BRIGHTENING SERUM",
      "NATURAL BOOST GLOW",
      "IMPROVES SKIN TEXTURE",
      "DEEP HYDRATION",
      "LIGHTWEIGHT & NON GREASY",
      "Brightens Skin Tone",
      "Reduces Pigmentation",
      "Hydrates & Repairs Skin",
      "Enriched with Rice Extract",
      "Net Qty: 30 ml"
    ],
    category: "serum",
    stock: 1,
    rating: 4.8,
    reviews: 127,
    size: "30 ml",
    ingredients: [
      "Purified Water",
      "Niacinamide",
      "Potassium Azeloyl Glycinate",
      "3-O-Ethyl Ascorbic Acid",
      "Dimethyl Isosorbide",
      "Glycerin",
      "Caprylic/Capric Triglyceride",
      "Diacetyl Boldine",
      "Xylitylglucoside",
      "Anhydroxylitol",
      "Xylitol",
      "4-N-Butyl Resorcinol",
      "Cetyl Alcohol",
      "Propanediol",
      "Betaine",
      "Fermented Rice Extract",
      "Propylene Glycol",
      "Polymethylsilsesquioxane",
      "Succinic Acid",
      "Maltodextrin",
      "Steareth-2",
      "Caprylyl Methicone",
      "Phenoxyethanol",
      "Ethylhexyl Glycerin",
      "Acetyl Hexapeptide-8",
      "Caprylyl Glycol",
      "D-Panthenol",
      "Undecylenoyl Phenylalanine",
      "Dimethicone/Vinyl Dimethicone Crosspolymer",
      "Silica",
      "Sodium Polyacryloyldimethyl Taurate",
      "Alpha Arbutin",
      "Steareth-21",
      "Cetearyl Olivate",
      "Sorbitan Olivate",
      "Sodium Hyaluronate (Low Molecular Weight)",
      "Glutathione",
      "Coco-Caprylate/Caprate",
      "Sodium Carbomer",
      "Sodium Gluconate",
      "Allantoin"
    ],
    howToUse: [
      "Apply a few drops to clean skin and gently massage until absorbed.",
      "External Use Only."
    ],
    manufacturer: {
      marketedBy: {
        name: "MAY SECRET Skin & Beauty",
        address: "Shop No.2 Park Plaza, Opp. Kamla Nehru Park, Prabhat Road Pune 411004",
        email: "maysecretskinandbeauty@gmail.com"
      },
      manufacturedBy: {
        name: "Maxnova Healthcare",
        address: "Plot No 5,6,7 Davni Industrial Area, PO Gurumajra Baddi, Distt Solan Himachal Pradesh 174101",
        licenseNo: "HIM/COS/L/24/370"
      }
    }
  },
  {
    id: 3,
    name: "May Secret Glow Combo Pack",
    isFeatured: true,
    price: 879,
    created_at: "2024-11-20T00:00:00.000Z",
    originalPrice: 2498,
    image: comboImg,
    images: [
      comboImg,
      combo2Img,
      combo3Img
    ],
    description: "Complete daily skin protection and brightening routine in one pack! Get our premium Sunscreen Spray (100 ml) and Rice Brightening Serum (30 ml) at an incredible value.",
    benefits: [
      "Complete daily skin protection",
      "Brightens skin tone",
      "Hydrates and repairs skin",
      "Protects against UV rays",
      "Perfect K-Beauty glow routine"
    ],
    category: "combo",
    stock: 1,
    rating: 4.7,
    reviews: 45,
    size: "2 products",
    ingredients: [
      "See individual product pages for full ingredients"
    ],
    howToUse: [
      "Apply Brightening Serum to clean, dry skin",
      "Follow with Sunscreen Spray in the daytime",
      "Reapply sunscreen every 2 hours when outdoors"
    ],
    includes: [
      "Sunscreen Spray (100 ml)",
      "Rice Brightening Serum (30 ml)"
    ]
  },
  {
    id: 4,
    name: "Brightening Serum Combo Pack",
    isFeatured: true,
    price: 999,
    created_at: "2024-11-25T00:00:00.000Z",
    originalPrice: 2998,
    image: serumComboImg,
    images: [
      serumComboImg,
      serumCombo2Img,
      serumCombo3Img
    ],
    description: "Value combo pack with two Rice Brightening Serums for a longer glass-skin routine. Ideal for consistent brightening care or sharing your glow ritual.",
    benefits: [
      "2 Rice Brightening Serums",
      "Brightens skin tone",
      "Reduces pigmentation",
      "Hydrates and repairs skin",
      "Better value for daily serum users"
    ],
    category: "combo",
    stock: 1,
    rating: 4.8,
    reviews: 62,
    size: "2 x 30 ml",
    ingredients: [
      "See Rice Brightening Serum product page for full ingredients"
    ],
    howToUse: [
      "Apply a few drops to clean skin and gently massage until absorbed.",
      "Use daily for best brightening results.",
      "External Use Only."
    ],
    includes: [
      "Rice Brightening Serum (30 ml)",
      "Rice Brightening Serum (30 ml)"
    ]
  },
  {
    id: 5,
    name: "Sunscreen Spray Combo Pack",
    isFeatured: true,
    price: 649,
    created_at: "2024-11-30T00:00:00.000Z",
    originalPrice: 1998,
    image: sprayComboImg,
    images: [
      sprayComboImg,
      sprayCombo2Img
    ],
    description: "Value combo pack with two May Secret Sunscreen Sprays for easy daily SPF protection at home, in your bag, or on the go.",
    benefits: [
      "2 Sunscreen Sprays",
      "SPF 50 PA+++",
      "Broad Spectrum UVA/UVB Protection",
      "Quick application",
      "Better value for daily sun protection"
    ],
    category: "combo",
    stock: 1,
    rating: 4.7,
    reviews: 58,
    size: "2 x 100 ml",
    ingredients: [
      "See Sunscreen Spray product page for full ingredients"
    ],
    howToUse: [
      "Spray a generous amount onto your hand and gently apply on face.",
      "For body, spray directly from a distance of 1-2 inches and spread evenly.",
      "Reapply sunscreen every 2 hours when outdoors."
    ],
    includes: [
      "Sunscreen Spray (100 ml)",
      "Sunscreen Spray (100 ml)"
    ]
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.benefits.some(benefit => benefit.toLowerCase().includes(lowercaseQuery))
  );
};

// New Supabase-integrated functions
export const getProductsFromSupabase = async (): Promise<Product[]> => {
  try {
    const supabaseProducts = await ProductService.getAllProducts();
    
    // Convert Supabase products to legacy Product format
    return supabaseProducts.map(sp => ({
      id: parseInt(sp.id),
      name: sp.name,
      price: sp.price,
      image: sp.image,
      images: [sp.image], // For now, single image
      description: sp.description,
      benefits: [], // Will need to add benefits field to Supabase
      category: sp.category,
      stock: sp.stock,
      rating: sp.rating,
      reviews: sp.reviews,
      created_at: sp.created_at,
      isFeatured: sp.is_featured
    }));
  } catch (error) {
    console.error('Error fetching products from Supabase:', error);
    return products; // Fallback to legacy products
  }
};

export const getProductsByCategoryFromSupabase = async (category: string): Promise<Product[]> => {
  try {
    const supabaseProducts = await ProductService.getProductsByCategory(category);
    
    return supabaseProducts.map(sp => ({
      id: parseInt(sp.id),
      name: sp.name,
      price: sp.price,
      image: sp.image,
      images: [sp.image],
      description: sp.description,
      benefits: [],
      category: sp.category,
      stock: sp.stock,
      rating: sp.rating,
      reviews: sp.reviews,
      created_at: sp.created_at,
      isFeatured: sp.is_featured
    }));
  } catch (error) {
    console.error('Error fetching products by category from Supabase:', error);
    return getProductsByCategory(category); // Fallback to legacy
  }
};

export const searchProductsFromSupabase = async (query: string): Promise<Product[]> => {
  try {
    const supabaseProducts = await ProductService.searchProducts(query);
    
    return supabaseProducts.map(sp => ({
      id: parseInt(sp.id),
      name: sp.name,
      price: sp.price,
      image: sp.image,
      images: [sp.image],
      description: sp.description,
      benefits: [],
      category: sp.category,
      stock: sp.stock,
      rating: sp.rating,
      reviews: sp.reviews,
      created_at: sp.created_at,
      isFeatured: sp.is_featured
    }));
  } catch (error) {
    console.error('Error searching products from Supabase:', error);
    return searchProducts(query); // Fallback to legacy
  }
};

// Hybrid functions that try Supabase first, fallback to legacy
export const getProductsHybrid = async (): Promise<Product[]> => {
  try {
    return await getProductsFromSupabase();
  } catch (error) {
    console.warn('Supabase failed, using legacy products:', error);
    return products;
  }
};

export const getProductsByCategoryHybrid = async (category: string): Promise<Product[]> => {
  try {
    return await getProductsByCategoryFromSupabase(category);
  } catch (error) {
    console.warn('Supabase failed, using legacy products:', error);
    return getProductsByCategory(category);
  }
};

export const searchProductsHybrid = async (query: string): Promise<Product[]> => {
  try {
    return await searchProductsFromSupabase(query);
  } catch (error) {
    console.warn('Supabase failed, using legacy products:', error);
    return searchProducts(query);
  }
};
