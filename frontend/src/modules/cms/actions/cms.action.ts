import axiosInstance from "@/lib/axiosInstance";
import { formatDateWib } from "@/lib/dateUtils";
import {
  BackendContactStatus,
  BackendOrderStatus,
  CmsAboutContent,
  CmsCategoryItem,
  CmsContactInfo,
  CmsContactItem,
  CmsFaqItem,
  CmsHeroBannerItem,
  CmsHomeContent,
  CmsOrderItem,
  CmsPaginatedResult,
  CmsPagination,
  CmsPickupLocationItem,
  CmsProductItem,
  CmsUserItem,
} from "@/types/cms.type";

interface ApiEnvelope<T> {
  status: string;
  message: string;
  data: T;
}

interface RawPaginated<T> {
  items: T[];
  pagination: CmsPagination;
}

function safeDate(value?: string): string {
  if (!value) return "-";
  return formatDateWib(value);
}

// --- Categories ---
interface RawCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
}

export async function fetchCmsCategories(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPaginatedResult<CmsCategoryItem>> {
  const res = await axiosInstance.get<ApiEnvelope<RawPaginated<RawCategory>>>(
    "/categories",
    { params }
  );
  return {
    pagination: res.data.data.pagination,
    items: res.data.data.items.map((c) => ({
      id: String(c.id),
      createdAt: safeDate(c.created_at),
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      isActive: Boolean(c.is_active),
    })),
  };
}

export async function createCmsCategory(payload: {
  name: string;
  description?: string;
  is_active?: boolean;
}) {
  return axiosInstance.post("/categories", payload);
}

export async function updateCmsCategory(
  id: string,
  payload: { name?: string; description?: string; is_active?: boolean }
) {
  return axiosInstance.put(`/categories/${id}`, payload);
}

export async function deleteCmsCategory(id: string) {
  return axiosInstance.delete(`/categories/${id}`);
}

// --- Products ---
interface RawProduct {
  id: number;
  name: string;
  category_id: number;
  pickup_location_id: number;
  price_per_day: number | string;
  stock: number;
  image_url?: string | null;
  is_active: boolean;
  created_at?: string;
  category?: { id: number; name: string };
  pickupLocation?: { id: number; name: string };
}

export async function fetchCmsProducts(params?: {
  search?: string;
  category_id?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPaginatedResult<CmsProductItem>> {
  const res = await axiosInstance.get<ApiEnvelope<RawPaginated<RawProduct>>>(
    "/products",
    { params }
  );
  return {
    pagination: res.data.data.pagination,
    items: res.data.data.items.map((p) => {
      const stock = Number(p.stock);
      return {
        id: String(p.id),
        createdAt: safeDate(p.created_at),
        name: p.name,
        categoryId: String(p.category_id),
        category: p.category?.name || "-",
        pickupLocationId: String(p.pickup_location_id),
        pickupLocation: p.pickupLocation?.name || "-",
        pricePerDay: Number(p.price_per_day),
        durationLabel: "Per Day",
        stock,
        imageUrl: p.image_url || "/images/travel-luggage.jpg",
        isActive: Boolean(p.is_active),
        status: p.is_active ? "Active" : "Inactive",
      };
    }),
  };
}

export async function createCmsProduct(payload: {
  category_id: number;
  pickup_location_id: number;
  name: string;
  price_per_day: number;
  stock: number;
  image_url?: string;
  is_active?: boolean;
}) {
  return axiosInstance.post("/products", payload);
}

export async function updateCmsProduct(
  id: string,
  payload: {
    category_id?: number;
    pickup_location_id?: number;
    name?: string;
    price_per_day?: number;
    stock?: number;
    image_url?: string;
    is_active?: boolean;
  }
) {
  return axiosInstance.put(`/products/${id}`, payload);
}

export async function deleteCmsProduct(id: string) {
  return axiosInstance.delete(`/products/${id}`);
}

// --- Hero Banners ---
interface RawHeroBanner {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url: string;
  cta_link?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export async function fetchCmsHeroBanners(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPaginatedResult<CmsHeroBannerItem>> {
  const res = await axiosInstance.get<ApiEnvelope<RawPaginated<RawHeroBanner>>>(
    "/hero-banners",
    { params }
  );
  return {
    pagination: res.data.data.pagination,
    items: res.data.data.items.map((b) => ({
      id: String(b.id),
      createdAt: safeDate(b.created_at),
      imageUrl: b.image_url || "/images/travel-lounge.jpg",
      title: b.title,
      shortDescription: b.subtitle || "",
      ctaLink: b.cta_link || "/products",
      sortOrder: Number(b.sort_order),
      isActive: Boolean(b.is_active),
      status: b.is_active ? "Published" : "Draft",
    })),
  };
}

export async function createCmsHeroBanner(payload: {
  title: string;
  subtitle?: string;
  image_url: string;
  cta_link?: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  return axiosInstance.post("/hero-banners", payload);
}

export async function updateCmsHeroBanner(
  id: string,
  payload: {
    title?: string;
    subtitle?: string;
    image_url?: string;
    cta_link?: string;
    sort_order?: number;
    is_active?: boolean;
  }
) {
  return axiosInstance.put(`/hero-banners/${id}`, payload);
}

export async function deleteCmsHeroBanner(id: string) {
  return axiosInstance.delete(`/hero-banners/${id}`);
}

// --- FAQs ---
interface RawFaq {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  created_at?: string;
}

export async function fetchCmsFaqs(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPaginatedResult<CmsFaqItem>> {
  const res = await axiosInstance.get<ApiEnvelope<RawPaginated<RawFaq>>>(
    "/faqs",
    { params }
  );
  return {
    pagination: res.data.data.pagination,
    items: res.data.data.items.map((f) => ({
      id: String(f.id),
      createdAt: safeDate(f.created_at),
      question: f.question,
      answer: f.answer,
      isActive: Boolean(f.is_active),
      status: f.is_active ? "Published" : "Draft",
    })),
  };
}

export async function createCmsFaq(payload: {
  question: string;
  answer: string;
  is_active?: boolean;
}) {
  return axiosInstance.post("/faqs", payload);
}

export async function updateCmsFaq(
  id: string,
  payload: {
    question?: string;
    answer?: string;
    is_active?: boolean;
  }
) {
  return axiosInstance.put(`/faqs/${id}`, payload);
}

export async function deleteCmsFaq(id: string) {
  return axiosInstance.delete(`/faqs/${id}`);
}

// --- Pickup Locations ---
interface RawPickupLocation {
  id: number;
  name: string;
  city: string;
  address: string;
  is_active: boolean;
  created_at?: string;
}

export async function fetchCmsPickupLocations(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPaginatedResult<CmsPickupLocationItem>> {
  const res = await axiosInstance.get<
    ApiEnvelope<RawPaginated<RawPickupLocation>>
  >("/pickup-locations", { params });
  return {
    pagination: res.data.data.pagination,
    items: res.data.data.items.map((loc) => ({
      id: String(loc.id),
      createdAt: safeDate(loc.created_at),
      name: loc.name,
      city: loc.city,
      address: loc.address,
      isActive: Boolean(loc.is_active),
      status: loc.is_active ? "Active" : "Inactive",
    })),
  };
}

export async function createCmsPickupLocation(payload: {
  name: string;
  city: string;
  address: string;
  is_active?: boolean;
}) {
  return axiosInstance.post("/pickup-locations", payload);
}

export async function updateCmsPickupLocation(
  id: string,
  payload: { name?: string; city?: string; address?: string; is_active?: boolean }
) {
  return axiosInstance.put(`/pickup-locations/${id}`, payload);
}

export async function deleteCmsPickupLocation(id: string) {
  return axiosInstance.delete(`/pickup-locations/${id}`);
}

// --- Orders ---
interface RawOrder {
  id: number;
  order_code: string;
  duration_days: number;
  start_date: string;
  end_date: string;
  total_amount: number | string;
  status: BackendOrderStatus;
  user?: { name: string };
  product?: { name: string };
}

export async function fetchCmsOrders(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPaginatedResult<CmsOrderItem>> {
  const res = await axiosInstance.get<ApiEnvelope<RawPaginated<RawOrder>>>(
    "/cms/orders",
    { params }
  );
  return {
    pagination: res.data.data.pagination,
    items: res.data.data.items.map((o) => ({
      id: String(o.id),
      bookingCode: o.order_code,
      customerName: o.user?.name || "-",
      productName: o.product?.name || "-",
      durationDays: Number(o.duration_days),
      rentalRange: `${o.start_date} to ${o.end_date}`,
      totalAmount: Number(o.total_amount),
      status: o.status,
    })),
  };
}

export async function updateCmsOrderStatus(
  id: string,
  status: BackendOrderStatus
) {
  return axiosInstance.patch(`/cms/orders/${id}/status`, { status });
}

export async function deleteCmsOrder(id: string) {
  return axiosInstance.delete(`/cms/orders/${id}`);
}

// --- Users ---
interface RawUser {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: "admin" | "customer";
  is_active: boolean;
  created_at?: string;
}

export async function fetchCmsUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPaginatedResult<CmsUserItem>> {
  const res = await axiosInstance.get<ApiEnvelope<RawPaginated<RawUser>>>(
    "/cms/users",
    { params }
  );
  return {
    pagination: res.data.data.pagination,
    items: res.data.data.items.map((u) => ({
      id: String(u.id),
      createdAt: safeDate(u.created_at),
      name: u.name,
      email: u.email,
      phone: u.phone || "-",
      role: u.role,
      isActive: Boolean(u.is_active),
      status: u.is_active ? "Active" : "Inactive",
    })),
  };
}

export async function updateCmsUserStatus(id: string, is_active: boolean) {
  return axiosInstance.patch(`/cms/users/${id}/status`, { is_active });
}

// --- Contacts ---
interface RawContact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: BackendContactStatus;
  created_at?: string;
}

export async function fetchCmsContacts(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<CmsPaginatedResult<CmsContactItem>> {
  const res = await axiosInstance.get<ApiEnvelope<RawPaginated<RawContact>>>(
    "/cms/contacts",
    { params }
  );
  return {
    pagination: res.data.data.pagination,
    items: res.data.data.items.map((c) => ({
      id: String(c.id),
      createdAt: safeDate(c.created_at),
      name: c.name,
      email: c.email,
      subject: c.subject,
      message: c.message,
      status: c.status,
    })),
  };
}

export async function updateCmsContactStatus(
  id: string,
  status: BackendContactStatus
) {
  return axiosInstance.patch(`/cms/contacts/${id}/status`, { status });
}

export async function deleteCmsContact(id: string) {
  return axiosInstance.delete(`/cms/contacts/${id}`);
}

// --- About Us (Single Record) ---
interface RawAboutContent {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  banner_image_url?: string | null;
  side_image_url?: string | null;
}

export async function fetchCmsAboutUs(): Promise<CmsAboutContent> {
  const res = await axiosInstance.get<ApiEnvelope<RawAboutContent>>(
    "/cms/about-us"
  );
  const d = res.data.data;
  return {
    id: d.id ? String(d.id) : "",
    eyebrow: d.eyebrow || "",
    title: d.title || "",
    description: d.description || "",
    bannerImageUrl: d.banner_image_url || "",
    sideImageUrl: d.side_image_url || "",
  };
}

export async function updateCmsAboutUs(payload: {
  eyebrow: string;
  title: string;
  description: string;
  banner_image_url?: string;
  side_image_url?: string;
}): Promise<CmsAboutContent> {
  const res = await axiosInstance.put<ApiEnvelope<RawAboutContent>>(
    "/cms/about-us",
    payload
  );
  const d = res.data.data;
  return {
    id: String(d.id),
    eyebrow: d.eyebrow || "WHY CHOOSE JAVAPACK?",
    title: d.title || "",
    description: d.description || "",
    bannerImageUrl: d.banner_image_url || "/images/travel-lounge.jpg",
    sideImageUrl: d.side_image_url || "/images/travel-winter.jpg",
  };
}

export async function uploadCmsImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read selected image."));
    reader.readAsDataURL(file);
  });

  const res = await axiosInstance.post<ApiEnvelope<{ url: string }>>(
    "/cms/upload-image",
    { filename: file.name, dataUrl }
  );
  return res.data.data.url;
}

// --- Home Content (Single Record) ---
interface RawHomeContent {
  id: number;
  badge_text: string;
  headline: string;
  subheadline: string;
}

export async function fetchCmsHomeContent(): Promise<CmsHomeContent> {
  const res = await axiosInstance.get<ApiEnvelope<RawHomeContent>>(
    "/cms/home-content"
  );
  const d = res.data.data;
  return {
    id: String(d.id),
    badgeText: d.badge_text || "",
    headline: d.headline || "",
    subheadline: d.subheadline || "",
  };
}

export async function updateCmsHomeContent(payload: {
  badge_text: string;
  headline: string;
  subheadline: string;
}): Promise<CmsHomeContent> {
  const res = await axiosInstance.put<ApiEnvelope<RawHomeContent>>(
    "/cms/home-content",
    payload
  );
  const d = res.data.data;
  return {
    id: String(d.id),
    badgeText: d.badge_text || "",
    headline: d.headline || "",
    subheadline: d.subheadline || "",
  };
}

// --- Contact Info (Single Record) ---
interface RawContactInfo {
  id: number | null;
  location_title: string;
  location_subtitle: string;
  address: string;
  whatsapp: string;
  email: string;
  operating_hours: string;
  latitude: string;
  longitude: string;
}

export async function fetchCmsContactInfo(): Promise<CmsContactInfo> {
  const res = await axiosInstance.get<ApiEnvelope<RawContactInfo>>(
    "/cms/contact-info"
  );
  const d = res.data.data;
  return {
    id: d.id ? String(d.id) : "",
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

export async function updateCmsContactInfo(payload: {
  location_title: string;
  location_subtitle: string;
  address: string;
  whatsapp: string;
  email: string;
  operating_hours: string;
  latitude: string;
  longitude: string;
}): Promise<CmsContactInfo> {
  const res = await axiosInstance.put<ApiEnvelope<RawContactInfo>>(
    "/cms/contact-info",
    payload
  );
  const d = res.data.data;
  return {
    id: d.id ? String(d.id) : "",
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
