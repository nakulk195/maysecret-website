import ektaBadveReview from '../assets/images/testimonials/ekta-badve-whatsapp-review.jpg';
import hetalUmraniyaReview from '../assets/images/testimonials/hetal-umraniya-whatsapp-review.jpg';
import ketanMusaleReview from '../assets/images/testimonials/ketan-musale-whatsapp-review.jpg';
import poojaBhosaleReview from '../assets/images/testimonials/pooja-bhosale-whatsapp-review.jpg';
import shraddhaPatilReview from '../assets/images/testimonials/shraddha-patil-whatsapp-review.jpg';
import sohamAsmarReview from '../assets/images/testimonials/soham-asmar-whatsapp-review.jpg';

export type TestimonialBadge = 'Customer Review';

export type Testimonial = {
  id: string;
  customerName: string;
  quote: string;
  product: string | null;
  rating: number | null;
  badge: TestimonialBadge;
  image: string;
  source: 'whatsapp-review' | 'customer-review';
};

export const testimonials: Testimonial[] = [
  {
    id: 'hetal-umraniya',
    customerName: 'khuhooooooo',
    quote: "Been using this sunscreen spray for the past week, and I'm obsessed! So lightweight, gives the prettiest dewy glow and feels amazing on the skin while keeping it protected. So proud of you, Prassana - you've truly nailed the formulation!",
    product: 'combo pack',
    rating: null,
    badge: 'Customer Review',
    image: hetalUmraniyaReview,
    source: 'whatsapp-review',
  },
  {
    id: 'ekta-badve',
    customerName: 'Ekta Badve',
    quote: "Best products Ive ever used for my skin. Do check out ya'll. And thank you so much Attu for this.",
    product: 'Sunscreen Spray',
    rating: null,
    badge: 'Customer Review',
    image: ektaBadveReview,
    source: 'whatsapp-review',
  },
  {
    id: 'pooja-bhosale',
    customerName: 'Pallavi',
    quote: 'A gift from adv and May Secret founder Prassana Musale. Excellent products of May Secret, please check out and try everyone.',
    product: 'combo pack',
    rating: null,
    badge: 'Customer Review',
    image: poojaBhosaleReview,
    source: 'whatsapp-review',
  },
  {
    id: 'shraddha-patil',
    customerName: 'pallavi',
    quote: 'Beautiful product.',
    product: 'combo pack',
    rating: null,
    badge: 'Customer Review',
    image: shraddhaPatilReview,
    source: 'whatsapp-review',
  },
  {
    id: 'ketan-musale',
    customerName: 'Ketan Musale',
    quote: "It's not just the product that made me smile, but the heartfelt words that came with it. Thank you, Team May Secret, for making me feel valued, special, and truly cared for. These little gestures mean so much and add a personal touch that makes the experience unforgettable.",
    product: 'Sunscreen Spray',
    rating: null,
    badge: 'Customer Review',
    image: ketanMusaleReview,
    source: 'whatsapp-review',
  },
  {
    id: 'soham-asmar',
    customerName: 'Hetal Umraniya',
    quote: 'Loving this sunscreen from MaySecret Skin and Beauty! Lightweight, non-greasy, and perfect for everyday use. It keeps my skin protected, fresh, and glowing all day long. A must-have for healthy, sun-protected skin!',
    product: 'Sunscreen Spray',
    rating: null,
    badge: 'Customer Review',
    image: sohamAsmarReview,
    source: 'whatsapp-review',
  },
];
