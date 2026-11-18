import axiosInstance from "@/lib/axiosInstance";
import { formatDateWib } from "@/lib/dateUtils";
import {
  AboutContent,
  ContactFormPayload,
  ContactInfo,
  HeroBannerItem,
  HomeStepItem,
  HomeStoryItem,
  OrderCheckoutPayload,
  OrderCheckoutResponse,
  PublicCategory,
  PublicFaqItem,
  PublicPickupLocation,
  PublicProduct,
  RentalHistoryLogItem,
} from "@/types/public.type";

interface ApiEnvelope<T> {
  status: string;
  message: string;
  data: T;
}

function extractItems<T>(payload: T[] | { items: T[] } | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload.items) ? payload.items : [];
}

interface RawBanner {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  cta_link?: string | null;
}

interface RawCategory {
  id: number;
  name: string;
  slug: string;
}

interface RawPickupLocation {
  id: number;
  name: string;
  city: string;
  address: string;
}

interface RawProduct {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  pickup_location_id?: number | null;
  price_per_day: number | string;
  stock: number;
  is_physical?: boolean;
  image_url?: string | null;
  category?: { id: number; name: string; slug: string };
  pickupLocation?: { id: number; name: string; city: string };
}

interface RawFaq {
  id: number;
  question: string;
  answer: string;
}

export const MOCK_ABOUT_CONTENT: AboutContent = {
  eyebrow: "WHY CHOOSE JAVAPACK?",
  headline: "Rent Premium Travel Gear, Save Up to 70% on Trip Costs",
  paragraphs: [
    "JavaPack helps travelers heading to four-season destinations avoid buying expensive thermal parkas, hardcase luggage, or action cameras that are only used once a year.",
    "Every item goes through hygienic laundry and UV sterilization before dispatch, and can be picked up and returned directly at our Soekarno-Hatta Terminal 3 counter.",
  ],
  bannerImageUrl: "/images/travel-lounge.jpg",
  sideImageUrl: "/images/travel-winter.jpg",
  highlights: [
    { id: "h-1", title: "100% Sterile", subtitle: "Laundry & UV Care" },
    { id: "h-2", title: "Terminal 3", subtitle: "Airport Pickup & Return" },
    { id: "h-3", title: "24/7 Support", subtitle: "WhatsApp Assistance" },
  ],
};

export const MOCK_CONTACT_INFO: ContactInfo = {
  locationTitle: "JavaPack Counter — Malang, East Java",
  locationSubtitle: "Malang City, East Java, Indonesia",
  address: "Jl. Soekarno Hatta No. 18, Lowokwaru, Malang, East Java 65141",
  whatsapp: "+62 812-3456-7890",
  email: "hello@javapack.id",
  operatingHours: "Open Daily 08:00 - 22:00 WIB",
  latitude: "-7.9467",
  longitude: "112.6157",
};

export const DEFAULT_HOME_STEPS: HomeStepItem[] = [
  {
    id: "step-1",
    stepLabel: "Step 01 - Book Online",
    title: "Choose Your Gear",
    description:
      "Select winter jackets, Pocket WiFi modems, or cabin luggage and set your travel dates.",
    sortOrder: 1,
  },
  {
    id: "step-2",
    stepLabel: "Step 02 - Instant Checkout",
    title: "Instant Payment",
    description:
      "Pay securely via Midtrans and receive instant order confirmation on WhatsApp.",
    sortOrder: 2,
  },
  {
    id: "step-3",
    stepLabel: "Step 03 - Departure",
    title: "Airport Pickup",
    description:
      "Show your order code at our airport counter and pick up your sanitized gear.",
    sortOrder: 3,
  },
  {
    id: "step-4",
    stepLabel: "Step 04 - Arrival",
    title: "Easy Return",
    description:
      "Drop off your gear at the airport counter when you land back home.",
    sortOrder: 4,
  },
];

export const DEFAULT_HOME_STORIES: HomeStoryItem[] = [
  {
    id: "story-1",
    customerName: "Raka Pratama",
    gearTag: "Unlimited 5G Pocket WiFi Modem",
    testimonial:
      "Traveling abroad with my family was effortless. Renting the JavaPack Pocket WiFi kept everyone connected with a stable signal and easy airport pickup.",
    imageUrl: "/images/stories/story-family-modem.jpg",
    sortOrder: 1,
  },
  {
    id: "story-2",
    customerName: "Dina Safitri",
    gearTag: "Raturu Winter Jacket",
    testimonial:
      "My solo winter trip stayed super cozy. The JavaPack winter jacket was warm, lightweight to carry, and quick to pick up right before boarding.",
    imageUrl: "/images/stories/story-solo-paris.jpg",
    sortOrder: 2,
  },
  {
    id: "story-3",
    customerName: "Bima & Nadia",
    gearTag: "20-Inch Hardcase Cabin Luggage",
    testimonial:
      "Exploring the city was so much smoother with JavaPack cabin luggage. Smooth wheels, spacious interior, and hassle-free drop-off at the airport counter.",
    imageUrl: "/images/stories/story-couple-china.jpg",
    sortOrder: 3,
  },
];

interface RawHomeStep {
  id: number;
  step_label: string;
  title: string;
  description: string;
  sort_order: number;
}

interface RawHomeStory {
  id: number;
  customer_name: string;
  gear_tag: string;
  testimonial: string;
  image_url: string;
  sort_order: number;
}

export async function fetchPublicHomeData(): Promise<{
  homeSteps: HomeStepItem[];
  homeStories: HomeStoryItem[];
  banners: HeroBannerItem[];
}> {
  const response = await axiosInstance.get<
    ApiEnvelope<{
      home_steps?: RawHomeStep[];
      home_stories?: RawHomeStory[];
      hero_banners: RawBanner[];
    }>
  >("/public/home");
  const rawSteps = response.data.data.home_steps || [];
  const rawStories = response.data.data.home_stories || [];
  return {
    homeSteps:
      rawSteps.length > 0
        ? rawSteps.map((s) => ({
            id: String(s.id),
            stepLabel: s.step_label,
            title: s.title,
            description: s.description,
            sortOrder: Number(s.sort_order) || 1,
          }))
        : DEFAULT_HOME_STEPS,
    homeStories:
      rawStories.length > 0
        ? rawStories.map((st) => ({
            id: String(st.id),
            customerName: st.customer_name,
            gearTag: st.gear_tag,
            testimonial: st.testimonial,
            imageUrl: st.image_url || "/images/stories/story-family-modem.jpg",
            sortOrder: Number(st.sort_order) || 1,
          }))
        : DEFAULT_HOME_STORIES,
    banners: response.data.data.hero_banners.map((b) => ({
      id: String(b.id),
      title: b.title,
      description: b.subtitle || "",
      imageUrl: b.image_url || "",
      ctaHref: b.cta_link || "/products",
    })),
  };
}

export async function fetchPublicBanners(): Promise<HeroBannerItem[]> {
  const data = await fetchPublicHomeData();
  return data.banners;
}

export async function fetchPublicCategories(): Promise<PublicCategory[]> {
  const response = await axiosInstance.get<
    ApiEnvelope<RawCategory[] | { items: RawCategory[] }>
  >("/public/categories", { params: { limit: 50 } });
  const list = extractItems(response.data.data);
  const mapped = list.map((c) => ({
    id: String(c.id),
    name: c.name,
    slug: c.slug,
  }));
  return [{ id: "all", name: "All", slug: "all" }, ...mapped];
}

export async function fetchPublicPickupLocations(): Promise<
  PublicPickupLocation[]
> {
  const response = await axiosInstance.get<
    ApiEnvelope<RawPickupLocation[] | { items: RawPickupLocation[] }>
  >("/public/pickup-locations", { params: { limit: 50 } });
  const list = extractItems(response.data.data);
  return list.map((loc) => ({
    id: String(loc.id),
    name: loc.name,
    city: loc.city,
    address: loc.address,
  }));
}

export interface PublicProductsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function fetchPublicProducts(params?: {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}): Promise<{
  items: PublicProduct[];
  pagination: PublicProductsPagination;
}> {
  const queryParams: Record<string, string | number> = {
    page: params?.page || 1,
    limit: params?.limit || 20,
  };
  if (params?.search?.trim()) {
    queryParams.search = params.search.trim();
  }
  if (params?.categoryId && params.categoryId !== "all") {
    queryParams.category_id = params.categoryId;
  }
  const response = await axiosInstance.get<
    ApiEnvelope<{
      items: RawProduct[];
      pagination?: PublicProductsPagination;
    }>
  >("/public/products", { params: queryParams });
  const list = extractItems(response.data.data);
  const pagination: PublicProductsPagination = response.data.data
    .pagination ?? {
    page: Number(queryParams.page),
    limit: Number(queryParams.limit),
    total: list.length,
    totalPages: 1,
  };

  return {
    pagination,
    items: list.map((p) => ({
      id: String(p.id),
      name: p.name,
      slug: p.slug,
      categoryId: String(p.category_id),
      categoryName: p.category?.name || "Travel Gear",
      pickupLocationId: p.pickup_location_id ? String(p.pickup_location_id) : "",
      pickupLocationName: p.pickupLocation?.name || (p.is_physical === false ? "Digital Delivery" : "Main Counter"),
      pricePerDay: Number(p.price_per_day),
      stock: Number(p.stock),
      isPhysical: p.is_physical !== false,
      imageUrl: p.image_url || "/images/travel-luggage.jpg",
    })),
  };
}

export async function fetchPublicFaqs(): Promise<PublicFaqItem[]> {
  const response = await axiosInstance.get<
    ApiEnvelope<RawFaq[] | { items: RawFaq[] }>
  >("/public/faqs", { params: { limit: 50 } });
  const list = extractItems(response.data.data);
  return list.map((f) => ({
    id: String(f.id),
    question: f.question,
    answer: f.answer,
  }));
}

interface RawAboutContent {
  id: number;
  eyebrow?: string;
  title: string;
  description: string;
  banner_image_url?: string | null;
  side_image_url?: string | null;
}

export async function fetchPublicAboutUs(): Promise<AboutContent | null> {
  const response = await axiosInstance.get<ApiEnvelope<RawAboutContent | null>>(
    "/public/about-us"
  );
  const d = response.data.data;
  if (!d || !d.id) {
    return null;
  }
  const rawDesc = d.description || "";
  const paragraphs = rawDesc
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    eyebrow: d.eyebrow || "",
    headline: d.title || "",
    paragraphs,
    bannerImageUrl: d.banner_image_url || "",
    sideImageUrl: d.side_image_url || "",
    highlights: [],
  };
}

export async function submitContactForm(
  payload: ContactFormPayload
): Promise<{ success: boolean }> {
  await axiosInstance.post("/public/contact", payload);
  return { success: true };
}

interface RawContactInfo {
  id?: number;
  location_title?: string;
  location_subtitle?: string;
  address?: string;
  whatsapp?: string;
  email?: string;
  operating_hours?: string;
  latitude?: string;
  longitude?: string;
}

export async function fetchPublicContactInfo(): Promise<ContactInfo | null> {
  const response = await axiosInstance.get<ApiEnvelope<RawContactInfo | null>>(
    "/public/contact-info"
  );
  const d = response.data.data;
  if (!d || !d.id) {
    return null;
  }
  return {
    locationTitle: d.location_title || "",
    locationSubtitle: d.location_subtitle || "",
    address: d.address || "",
    whatsapp: d.whatsapp || "",
    email: d.email || "",
    operatingHours: d.operating_hours || "",
    latitude: d.latitude || "",
    longitude: d.longitude || "",
  };
}

let hasRecordedVisitThisLoad = false;

export async function recordSiteVisit(page: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (page !== "home" || hasRecordedVisitThisLoad) return;
  hasRecordedVisitThisLoad = true;
  let token = localStorage.getItem("javapack_visitor_token");
  if (!token) {
    token = `vis_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("javapack_visitor_token", token);
  }
  try {
    await axiosInstance.post("/public/visits", {
      visitor_token: token,
      page,
    });
  } catch {
    // Non-blocking analytics call
  }
}

export async function createOrderCheckout(
  payload: OrderCheckoutPayload
): Promise<OrderCheckoutResponse> {
  const response = await axiosInstance.post<
    ApiEnvelope<
      | OrderCheckoutResponse
      | {
          id: number;
          order_code: string;
          total_amount: number | string;
          status: string;
          payment_url?: string;
          payment_reference?: string;
        }
    >
  >("/orders", payload);
  const raw = response.data.data;
  if ("order" in raw) {
    return raw;
  }
  return {
    order: {
      id: raw.id,
      order_code: raw.order_code,
      total_amount: Number(raw.total_amount),
      status: raw.status,
    },
    payment: {
      payment_url: raw.payment_url,
      snap_token: raw.payment_reference,
    },
  };
}

interface RawRentalLog {
  id: number;
  order_code: string;
  product_name: string;
  quantity: number;
  duration_days: number;
  start_date: string;
  end_date: string;
  total_amount: number | string;
  event_status: string;
  note?: string | null;
  created_at?: string;
  order?: {
    id: number;
    payment_url?: string | null;
    status: string;
  } | null;
}

export async function fetchMyRentalHistory(): Promise<RentalHistoryLogItem[]> {
  const response = await axiosInstance.get<
    ApiEnvelope<{ items: RawRentalLog[] }>
  >("/orders/history", { params: { limit: 50 } });

  return extractItems(response.data.data).map((log) => ({
    id: String(log.id),
    orderCode: log.order_code,
    productName: log.product_name,
    quantity: Number(log.quantity),
    durationDays: Number(log.duration_days),
    rentalRange: `${log.start_date} to ${log.end_date}`,
    totalAmount: Number(log.total_amount),
    eventStatus: log.event_status,
    note: log.note || "-",
    createdAt: log.created_at ? formatDateWib(log.created_at) : "-",
    paymentUrl: log.order?.payment_url || null,
  }));
}
