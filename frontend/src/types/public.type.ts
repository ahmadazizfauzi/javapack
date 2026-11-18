export interface HeroBannerItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaHref: string;
}

export interface HomeStepItem {
  id: string;
  stepLabel: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface HomeStoryItem {
  id: string;
  customerName: string;
  gearTag: string;
  testimonial: string;
  imageUrl: string;
  sortOrder: number;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicPickupLocation {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  pickupLocationId: string;
  pickupLocationName: string;
  pricePerDay: number;
  stock: number;
  imageUrl: string;
}

export interface PublicFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AboutHighlight {
  id: string;
  title: string;
  subtitle: string;
}

export interface AboutContent {
  eyebrow: string;
  headline: string;
  paragraphs: string[];
  bannerImageUrl: string;
  sideImageUrl: string;
  highlights: AboutHighlight[];
}

export interface ContactInfo {
  locationTitle: string;
  locationSubtitle: string;
  address: string;
  whatsapp: string;
  email: string;
  operatingHours: string;
  latitude: string;
  longitude: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface OrderCheckoutPayload {
  product_id: number;
  pickup_location_id: number;
  quantity: number;
  start_date: string;
  end_date: string;
}

export interface OrderCheckoutResponse {
  order: {
    id: number;
    order_code: string;
    total_amount: number;
    status: string;
  };
  payment?: {
    payment_url?: string;
    snap_token?: string;
  };
}

export interface RentalHistoryLogItem {
  id: string;
  orderCode: string;
  productName: string;
  quantity: number;
  durationDays: number;
  rentalRange: string;
  totalAmount: number;
  eventStatus: string;
  note: string;
  createdAt: string;
  paymentUrl?: string | null;
}
