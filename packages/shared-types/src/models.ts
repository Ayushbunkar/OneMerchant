// ============================================================
// Domain Model Types — Mirrors Prisma schema for frontend use
// ============================================================

import {
  UserRole,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  StockStatus,
  CampaignStatus,
  CampaignChannel,
  NotificationType,
  SubscriptionPlan,
  SupplierStatus,
  PurchaseOrderStatus,
} from "./enums";

// ---- Tenant ----
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  logoUrl?: string;
  plan: SubscriptionPlan;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- User ----
export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Category ----
export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Product ----
export interface Product {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  category?: Category;
  basePrice: number;
  sellingPrice: number;
  costPrice: number;
  taxRate: number;
  unit: string;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  images: ProductImage[];
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  altText?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>;
  isActive: boolean;
}

// ---- Customer ----
export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Order ----
export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string;
  customerId?: string;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ---- Supplier ----
export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  status: SupplierStatus;
  rating: number;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  supplierId: string;
  supplier?: Supplier;
  orderNumber: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  expectedDeliveryAt?: string;
  receivedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity: number;
}

// ---- Payment ----
export interface Payment {
  id: string;
  tenantId: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ---- Campaign ----
export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  targetAudience?: Record<string, unknown>;
  content?: string;
  scheduledAt?: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Coupon ----
export interface Coupon {
  id: string;
  tenantId: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

// ---- Notification ----
export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// ---- Media ----
export interface Media {
  id: string;
  tenantId: string;
  publicId: string;
  secureUrl: string;
  resourceType: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  folder: string;
  context?: Record<string, unknown>;
  createdAt: string;
}

// ---- Analytics ----
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  averageOrderValue: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
}

// ---- AI ----
export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  type: "reorder" | "churn" | "promotion" | "forecast" | "general";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  action?: {
    label: string;
    endpoint: string;
    payload?: Record<string, unknown>;
  };
  createdAt: string;
}

export interface DemandForecast {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  daysUntilStockout: number;
  suggestedReorderQty: number;
  confidence: number;
}
