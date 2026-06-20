// ============================================================
// API Request/Response Types
// ============================================================

// ---- Standard API Envelope ----
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ---- Query Params ----
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// ---- Auth ----
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    avatarUrl?: string;
  };
  tokens: AuthTokens;
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: string;
  };
}

// ---- Products ----
export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  basePrice: number;
  sellingPrice: number;
  costPrice: number;
  taxRate?: number;
  unit?: string;
  stockQuantity: number;
  lowStockThreshold?: number;
  images?: string[];
  variants?: CreateVariantRequest[];
}

export interface CreateVariantRequest {
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>;
}

export interface UpdateStockRequest {
  productId: string;
  quantity: number;
  type: "ADD" | "REMOVE" | "SET";
  reason?: string;
}

// ---- Orders ----
export interface CreateOrderRequest {
  customerId?: string;
  items: CreateOrderItemRequest[];
  paymentMethod?: string;
  discountAmount?: number;
  couponCode?: string;
  notes?: string;
  shippingAddress?: string;
}

export interface CreateOrderItemRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateOrderStatusRequest {
  status: string;
  notes?: string;
}

// ---- Customers ----
export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  tags?: string[];
}

// ---- Suppliers ----
export interface CreateSupplierRequest {
  name: string;
  email?: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
}

export interface CreatePurchaseOrderRequest {
  supplierId: string;
  items: { productId: string; quantity: number; unitCost: number }[];
  expectedDeliveryAt?: string;
  notes?: string;
}

// ---- Campaigns ----
export interface CreateCampaignRequest {
  name: string;
  description?: string;
  channel: string;
  content?: string;
  targetAudience?: Record<string, unknown>;
  scheduledAt?: string;
}

// ---- Coupons ----
export interface CreateCouponRequest {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom: string;
  validUntil: string;
}

// ---- AI ----
export interface AIChatRequest {
  message: string;
  conversationId?: string;
  context?: Record<string, unknown>;
}

export interface AIChatResponse {
  reply: string;
  conversationId: string;
  insights?: Array<{
    type: string;
    title: string;
    description: string;
  }>;
  suggestedActions?: Array<{
    label: string;
    action: string;
  }>;
}
