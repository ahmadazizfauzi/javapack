export interface CmsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CmsPaginatedResult<T> {
  items: T[];
  pagination: CmsPagination;
}

export interface CmsCategoryItem {
  id: string;
  createdAt: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface CmsProductItem {
  id: string;
  createdAt: string;
  name: string;
  categoryId: string;
  category: string;
  pickupLocationId: string;
  pickupLocation: string;
  pricePerDay: number;
  durationLabel: string;
  stock: number;
  isPhysical: boolean;
  imageUrl: string;
  isActive: boolean;
  status: "Active" | "Inactive";
}

export interface CmsHeroBannerItem {
  id: string;
  createdAt: string;
  imageUrl: string;
  title: string;
  shortDescription: string;
  ctaLink: string;
  sortOrder: number;
  isActive: boolean;
  status: "Published" | "Draft";
}

export interface CmsFaqItem {
  id: string;
  createdAt: string;
  question: string;
  answer: string;
  isActive: boolean;
  status: "Published" | "Draft";
}

export interface CmsPickupLocationItem {
  id: string;
  createdAt: string;
  name: string;
  city: string;
  address: string;
  isActive: boolean;
  status: "Active" | "Inactive";
}

export type BackendOrderStatus =
  | "pending_payment"
  | "paid"
  | "active_rent"
  | "completed";

export interface CmsOrderItem {
  id: string;
  createdAt: string;
  bookingCode: string;
  customerName: string;
  productName: string;
  durationDays: number;
  rentalRange: string;
  totalAmount: number;
  status: BackendOrderStatus;
}

export interface CmsUserItem {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  isActive: boolean;
  status: "Active" | "Inactive";
}

export type BackendContactStatus = "unread" | "read" | "replied";

export interface CmsContactItem {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: BackendContactStatus;
}

export interface CmsAboutContent {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  bannerImageUrl: string;
  sideImageUrl: string;
}

export interface CmsHomeStepItem {
  id: string;
  createdAt: string;
  stepLabel: string;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  status: "Published" | "Draft";
}

export interface CmsHomeStoryItem {
  id: string;
  createdAt: string;
  customerName: string;
  gearTag: string;
  testimonial: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  status: "Published" | "Draft";
}

export interface CmsContactInfo {
  id: string;
  locationTitle: string;
  locationSubtitle: string;
  address: string;
  whatsapp: string;
  email: string;
  operatingHours: string;
  latitude: string;
  longitude: string;
}
