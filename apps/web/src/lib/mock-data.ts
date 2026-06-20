// ── Types ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  image: string;
  description: string;
  unit: string;
  supplier: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; phone: string; email: string };
  items: { product: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  status: "active" | "inactive";
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrder: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "whatsapp";
  status: "draft" | "scheduled" | "running" | "completed" | "paused";
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  startDate: string;
  endDate: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  usageLimit: number;
  usedCount: number;
  status: "active" | "inactive" | "expired";
  expiresAt: string;
}

export interface Transaction {
  id: string;
  orderNumber: string;
  customer: string;
  amount: number;
  method: string;
  status: "paid" | "pending" | "failed" | "refunded";
  date: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Basmati Rice Premium",
    sku: "RICE-001",
    category: "Grains & Rice",
    price: 1450,
    costPrice: 1100,
    stock: 245,
    minStock: 50,
    status: "in_stock",
    image: "/products/rice.jpg",
    description: "Premium aged Basmati rice, 5kg pack. Sourced from Dehradun.",
    unit: "5kg pack",
    supplier: "Sharma Agro Supplies",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "p2",
    name: "Tata Gold Tea",
    sku: "TEA-002",
    category: "Beverages",
    price: 320,
    costPrice: 240,
    stock: 18,
    minStock: 30,
    status: "low_stock",
    image: "/products/tea.jpg",
    description: "Premium Assam tea, 500g pack.",
    unit: "500g pack",
    supplier: "Rajesh Distributors",
    createdAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "p3",
    name: "Amul Butter",
    sku: "DAIRY-003",
    category: "Dairy",
    price: 270,
    costPrice: 210,
    stock: 85,
    minStock: 20,
    status: "in_stock",
    image: "/products/butter.jpg",
    description: "Amul pasteurized butter, 500g.",
    unit: "500g",
    supplier: "Amul Distributors Pvt Ltd",
    createdAt: "2026-02-20T10:00:00Z",
  },
  {
    id: "p4",
    name: "Fortune Sunflower Oil",
    sku: "OIL-004",
    category: "Cooking Oil",
    price: 210,
    costPrice: 175,
    stock: 0,
    minStock: 25,
    status: "out_of_stock",
    image: "/products/oil.jpg",
    description: "Refined sunflower oil, 1L bottle.",
    unit: "1L",
    supplier: "Adani Wilmar Ltd",
    createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "p5",
    name: "Aashirvaad Atta",
    sku: "FLOUR-005",
    category: "Grains & Rice",
    price: 380,
    costPrice: 290,
    stock: 120,
    minStock: 40,
    status: "in_stock",
    image: "/products/atta.jpg",
    description: "Whole wheat atta, 5kg pack.",
    unit: "5kg pack",
    supplier: "ITC Foods",
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "p6",
    name: "Maggi Noodles (Pack of 12)",
    sku: "NOODLE-006",
    category: "Instant Food",
    price: 168,
    costPrice: 130,
    stock: 200,
    minStock: 50,
    status: "in_stock",
    image: "/products/maggi.jpg",
    description: "Maggi 2-minute noodles, family pack of 12.",
    unit: "12 pack",
    supplier: "Nestlé India Ltd",
    createdAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "p7",
    name: "Haldiram's Namkeen Assorted",
    sku: "SNACK-007",
    category: "Snacks",
    price: 250,
    costPrice: 180,
    stock: 8,
    minStock: 15,
    status: "low_stock",
    image: "/products/namkeen.jpg",
    description: "Assorted namkeen gift pack, 800g.",
    unit: "800g pack",
    supplier: "Haldiram's Distributors",
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "p8",
    name: "Surf Excel Detergent",
    sku: "CLEAN-008",
    category: "Household",
    price: 420,
    costPrice: 340,
    stock: 67,
    minStock: 20,
    status: "in_stock",
    image: "/products/surf.jpg",
    description: "Surf Excel Easy Wash detergent, 2kg.",
    unit: "2kg",
    supplier: "HUL Distributors",
    createdAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "p9",
    name: "Parle-G Biscuits (Pack of 24)",
    sku: "BISC-009",
    category: "Snacks",
    price: 120,
    costPrice: 92,
    stock: 350,
    minStock: 80,
    status: "in_stock",
    image: "/products/parleg.jpg",
    description: "Parle-G glucose biscuits, carton of 24.",
    unit: "24 pack",
    supplier: "Parle Products Pvt Ltd",
    createdAt: "2026-04-20T10:00:00Z",
  },
  {
    id: "p10",
    name: "Colgate MaxFresh Toothpaste",
    sku: "CARE-010",
    category: "Personal Care",
    price: 145,
    costPrice: 110,
    stock: 0,
    minStock: 30,
    status: "out_of_stock",
    image: "/products/colgate.jpg",
    description: "Colgate MaxFresh toothpaste, 300g.",
    unit: "300g",
    supplier: "Colgate-Palmolive India",
    createdAt: "2026-05-01T10:00:00Z",
  },
];

export const mockOrders: Order[] = [
  {
    id: "o1",
    orderNumber: "OM-2026-001",
    customer: { name: "Priya Sharma", phone: "+91 98765 43210", email: "priya@email.com" },
    items: [
      { product: "Basmati Rice Premium", quantity: 2, price: 1450 },
      { product: "Amul Butter", quantity: 3, price: 270 },
    ],
    total: 3710,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "UPI",
    shippingAddress: "42, MG Road, Koramangala, Bangalore 560034",
    createdAt: "2026-06-20T14:30:00Z",
    updatedAt: "2026-06-20T18:30:00Z",
  },
  {
    id: "o2",
    orderNumber: "OM-2026-002",
    customer: { name: "Rajesh Kumar", phone: "+91 87654 32109", email: "rajesh.k@email.com" },
    items: [
      { product: "Tata Gold Tea", quantity: 5, price: 320 },
      { product: "Maggi Noodles (Pack of 12)", quantity: 2, price: 168 },
    ],
    total: 1936,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "Credit Card",
    shippingAddress: "15, Lajpat Nagar, New Delhi 110024",
    createdAt: "2026-06-20T11:15:00Z",
    updatedAt: "2026-06-20T15:00:00Z",
  },
  {
    id: "o3",
    orderNumber: "OM-2026-003",
    customer: { name: "Anita Patel", phone: "+91 76543 21098", email: "anita.p@email.com" },
    items: [
      { product: "Aashirvaad Atta", quantity: 3, price: 380 },
      { product: "Fortune Sunflower Oil", quantity: 4, price: 210 },
    ],
    total: 1980,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "Net Banking",
    shippingAddress: "8, CG Road, Navrangpura, Ahmedabad 380009",
    createdAt: "2026-06-19T09:45:00Z",
    updatedAt: "2026-06-19T10:30:00Z",
  },
  {
    id: "o4",
    orderNumber: "OM-2026-004",
    customer: { name: "Mohammed Iqbal", phone: "+91 65432 10987", email: "iqbal.m@email.com" },
    items: [
      { product: "Surf Excel Detergent", quantity: 2, price: 420 },
      { product: "Colgate MaxFresh Toothpaste", quantity: 6, price: 145 },
    ],
    total: 1710,
    status: "confirmed",
    paymentStatus: "pending",
    paymentMethod: "Cash on Delivery",
    shippingAddress: "22, Anna Salai, T. Nagar, Chennai 600017",
    createdAt: "2026-06-19T16:20:00Z",
    updatedAt: "2026-06-19T16:25:00Z",
  },
  {
    id: "o5",
    orderNumber: "OM-2026-005",
    customer: { name: "Sneha Reddy", phone: "+91 54321 09876", email: "sneha.r@email.com" },
    items: [
      { product: "Haldiram's Namkeen Assorted", quantity: 4, price: 250 },
      { product: "Parle-G Biscuits (Pack of 24)", quantity: 2, price: 120 },
    ],
    total: 1240,
    status: "pending",
    paymentStatus: "pending",
    paymentMethod: "UPI",
    shippingAddress: "55, Jubilee Hills, Hyderabad 500033",
    createdAt: "2026-06-18T08:10:00Z",
    updatedAt: "2026-06-18T08:10:00Z",
  },
  {
    id: "o6",
    orderNumber: "OM-2026-006",
    customer: { name: "Vikram Singh", phone: "+91 43210 98765", email: "vikram.s@email.com" },
    items: [
      { product: "Basmati Rice Premium", quantity: 5, price: 1450 },
      { product: "Aashirvaad Atta", quantity: 5, price: 380 },
    ],
    total: 9150,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Debit Card",
    shippingAddress: "33, Civil Lines, Jaipur 302006",
    createdAt: "2026-06-17T12:00:00Z",
    updatedAt: "2026-06-18T20:00:00Z",
  },
  {
    id: "o7",
    orderNumber: "OM-2026-007",
    customer: { name: "Meera Nair", phone: "+91 32109 87654", email: "meera.n@email.com" },
    items: [
      { product: "Tata Gold Tea", quantity: 10, price: 320 },
    ],
    total: 3200,
    status: "cancelled",
    paymentStatus: "refunded",
    paymentMethod: "UPI",
    shippingAddress: "7, MG Road, Ernakulam, Kochi 682011",
    createdAt: "2026-06-16T10:30:00Z",
    updatedAt: "2026-06-17T09:00:00Z",
  },
  {
    id: "o8",
    orderNumber: "OM-2026-008",
    customer: { name: "Arjun Mehta", phone: "+91 21098 76543", email: "arjun.m@email.com" },
    items: [
      { product: "Maggi Noodles (Pack of 12)", quantity: 10, price: 168 },
      { product: "Parle-G Biscuits (Pack of 24)", quantity: 5, price: 120 },
    ],
    total: 2280,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Cash on Delivery",
    shippingAddress: "101, FC Road, Deccan, Pune 411004",
    createdAt: "2026-06-15T14:45:00Z",
    updatedAt: "2026-06-17T11:00:00Z",
  },
];

export const mockCustomers: Customer[] = [
  { id: "c1", name: "Priya Sharma", phone: "+91 98765 43210", email: "priya@email.com", city: "Bangalore", totalOrders: 23, totalSpent: 45680, lastOrder: "2026-06-20T14:30:00Z", status: "active", createdAt: "2025-08-15T10:00:00Z" },
  { id: "c2", name: "Rajesh Kumar", phone: "+91 87654 32109", email: "rajesh.k@email.com", city: "New Delhi", totalOrders: 45, totalSpent: 89200, lastOrder: "2026-06-20T11:15:00Z", status: "active", createdAt: "2025-06-20T10:00:00Z" },
  { id: "c3", name: "Anita Patel", phone: "+91 76543 21098", email: "anita.p@email.com", city: "Ahmedabad", totalOrders: 12, totalSpent: 23400, lastOrder: "2026-06-19T09:45:00Z", status: "active", createdAt: "2025-11-01T10:00:00Z" },
  { id: "c4", name: "Mohammed Iqbal", phone: "+91 65432 10987", email: "iqbal.m@email.com", city: "Chennai", totalOrders: 8, totalSpent: 15750, lastOrder: "2026-06-19T16:20:00Z", status: "active", createdAt: "2026-01-10T10:00:00Z" },
  { id: "c5", name: "Sneha Reddy", phone: "+91 54321 09876", email: "sneha.r@email.com", city: "Hyderabad", totalOrders: 34, totalSpent: 67800, lastOrder: "2026-06-18T08:10:00Z", status: "active", createdAt: "2025-07-15T10:00:00Z" },
  { id: "c6", name: "Vikram Singh", phone: "+91 43210 98765", email: "vikram.s@email.com", city: "Jaipur", totalOrders: 56, totalSpent: 112500, lastOrder: "2026-06-17T12:00:00Z", status: "active", createdAt: "2025-05-01T10:00:00Z" },
  { id: "c7", name: "Meera Nair", phone: "+91 32109 87654", email: "meera.n@email.com", city: "Kochi", totalOrders: 3, totalSpent: 5400, lastOrder: "2026-06-16T10:30:00Z", status: "inactive", createdAt: "2026-03-20T10:00:00Z" },
  { id: "c8", name: "Arjun Mehta", phone: "+91 21098 76543", email: "arjun.m@email.com", city: "Pune", totalOrders: 19, totalSpent: 38900, lastOrder: "2026-06-15T14:45:00Z", status: "active", createdAt: "2025-09-10T10:00:00Z" },
  { id: "c9", name: "Kavitha Iyer", phone: "+91 90876 54321", email: "kavitha.i@email.com", city: "Mumbai", totalOrders: 67, totalSpent: 156200, lastOrder: "2026-06-14T09:00:00Z", status: "active", createdAt: "2025-03-01T10:00:00Z" },
  { id: "c10", name: "Suresh Reddy", phone: "+91 80765 43210", email: "suresh.r@email.com", city: "Visakhapatnam", totalOrders: 5, totalSpent: 9800, lastOrder: "2026-06-10T15:30:00Z", status: "inactive", createdAt: "2026-02-15T10:00:00Z" },
];

export const mockSuppliers: Supplier[] = [
  { id: "s1", name: "Ramesh Sharma", company: "Sharma Agro Supplies", phone: "+91 98001 23456", email: "ramesh@sharmaagro.com", city: "Dehradun", status: "active", rating: 4.8, totalOrders: 156, totalValue: 2340000, lastOrder: "2026-06-18T10:00:00Z" },
  { id: "s2", name: "Sunil Verma", company: "Rajesh Distributors", phone: "+91 98002 34567", email: "sunil@rajeshdist.com", city: "Kolkata", status: "active", rating: 4.5, totalOrders: 98, totalValue: 1560000, lastOrder: "2026-06-15T10:00:00Z" },
  { id: "s3", name: "Deepak Joshi", company: "Amul Distributors Pvt Ltd", phone: "+91 98003 45678", email: "deepak@amuldist.com", city: "Anand", status: "active", rating: 4.9, totalOrders: 234, totalValue: 4560000, lastOrder: "2026-06-19T10:00:00Z" },
  { id: "s4", name: "Prakash Gupta", company: "HUL Distributors", phone: "+91 98004 56789", email: "prakash@huldist.com", city: "Mumbai", status: "active", rating: 4.3, totalOrders: 189, totalValue: 3780000, lastOrder: "2026-06-17T10:00:00Z" },
  { id: "s5", name: "Anil Kumar", company: "ITC Foods", phone: "+91 98005 67890", email: "anil@itcfoods.com", city: "Bangalore", status: "inactive", rating: 4.1, totalOrders: 45, totalValue: 890000, lastOrder: "2026-05-10T10:00:00Z" },
  { id: "s6", name: "Vinod Patel", company: "Nestlé India Ltd", phone: "+91 98006 78901", email: "vinod@nestle.com", city: "Gurgaon", status: "active", rating: 4.7, totalOrders: 312, totalValue: 6890000, lastOrder: "2026-06-20T10:00:00Z" },
];

export const mockCampaigns: Campaign[] = [
  { id: "cm1", name: "Summer Sale 2026", type: "whatsapp", status: "running", audience: 5000, sent: 4800, opened: 3200, clicked: 1800, startDate: "2026-06-15T00:00:00Z", endDate: "2026-06-30T23:59:59Z" },
  { id: "cm2", name: "New Customer Welcome", type: "email", status: "running", audience: 1200, sent: 1200, opened: 890, clicked: 456, startDate: "2026-06-01T00:00:00Z", endDate: "2026-06-30T23:59:59Z" },
  { id: "cm3", name: "Festive Season Preview", type: "sms", status: "scheduled", audience: 8000, sent: 0, opened: 0, clicked: 0, startDate: "2026-07-01T00:00:00Z", endDate: "2026-07-15T23:59:59Z" },
  { id: "cm4", name: "Loyalty Reward Points", type: "whatsapp", status: "completed", audience: 3500, sent: 3500, opened: 2800, clicked: 1400, startDate: "2026-05-01T00:00:00Z", endDate: "2026-05-31T23:59:59Z" },
  { id: "cm5", name: "Flash Sale Alert", type: "sms", status: "draft", audience: 10000, sent: 0, opened: 0, clicked: 0, startDate: "2026-07-10T00:00:00Z", endDate: "2026-07-10T23:59:59Z" },
];

export const mockCoupons: Coupon[] = [
  { id: "cp1", code: "SUMMER25", type: "percentage", value: 25, minOrder: 1000, usageLimit: 500, usedCount: 234, status: "active", expiresAt: "2026-06-30T23:59:59Z" },
  { id: "cp2", code: "WELCOME100", type: "fixed", value: 100, minOrder: 500, usageLimit: 1000, usedCount: 678, status: "active", expiresAt: "2026-12-31T23:59:59Z" },
  { id: "cp3", code: "FESTIVE500", type: "fixed", value: 500, minOrder: 3000, usageLimit: 200, usedCount: 200, status: "expired", expiresAt: "2026-05-31T23:59:59Z" },
  { id: "cp4", code: "FLAT10", type: "percentage", value: 10, minOrder: 0, usageLimit: 5000, usedCount: 1234, status: "active", expiresAt: "2026-08-31T23:59:59Z" },
];

export const mockTransactions: Transaction[] = [
  { id: "t1", orderNumber: "OM-2026-001", customer: "Priya Sharma", amount: 3710, method: "UPI", status: "paid", date: "2026-06-20T14:30:00Z" },
  { id: "t2", orderNumber: "OM-2026-002", customer: "Rajesh Kumar", amount: 1936, method: "Credit Card", status: "paid", date: "2026-06-20T11:15:00Z" },
  { id: "t3", orderNumber: "OM-2026-003", customer: "Anita Patel", amount: 1980, method: "Net Banking", status: "paid", date: "2026-06-19T09:45:00Z" },
  { id: "t4", orderNumber: "OM-2026-004", customer: "Mohammed Iqbal", amount: 1710, method: "Cash on Delivery", status: "pending", date: "2026-06-19T16:20:00Z" },
  { id: "t5", orderNumber: "OM-2026-005", customer: "Sneha Reddy", amount: 1240, method: "UPI", status: "pending", date: "2026-06-18T08:10:00Z" },
  { id: "t6", orderNumber: "OM-2026-006", customer: "Vikram Singh", amount: 9150, method: "Debit Card", status: "paid", date: "2026-06-17T12:00:00Z" },
  { id: "t7", orderNumber: "OM-2026-007", customer: "Meera Nair", amount: 3200, method: "UPI", status: "refunded", date: "2026-06-16T10:30:00Z" },
  { id: "t8", orderNumber: "OM-2026-008", customer: "Arjun Mehta", amount: 2280, method: "Cash on Delivery", status: "paid", date: "2026-06-15T14:45:00Z" },
];

export const mockRevenueData = [
  { month: "Jan", revenue: 285000, orders: 120 },
  { month: "Feb", revenue: 320000, orders: 145 },
  { month: "Mar", revenue: 410000, orders: 178 },
  { month: "Apr", revenue: 380000, orders: 165 },
  { month: "May", revenue: 456000, orders: 198 },
  { month: "Jun", revenue: 520000, orders: 234 },
];

export const mockDailyRevenue = [
  { date: "Jun 1", revenue: 18500 },
  { date: "Jun 2", revenue: 22300 },
  { date: "Jun 3", revenue: 15600 },
  { date: "Jun 4", revenue: 28900 },
  { date: "Jun 5", revenue: 24100 },
  { date: "Jun 6", revenue: 19800 },
  { date: "Jun 7", revenue: 31200 },
  { date: "Jun 8", revenue: 27500 },
  { date: "Jun 9", revenue: 20100 },
  { date: "Jun 10", revenue: 35600 },
  { date: "Jun 11", revenue: 29800 },
  { date: "Jun 12", revenue: 22400 },
  { date: "Jun 13", revenue: 38900 },
  { date: "Jun 14", revenue: 33200 },
  { date: "Jun 15", revenue: 25600 },
  { date: "Jun 16", revenue: 41200 },
  { date: "Jun 17", revenue: 36800 },
  { date: "Jun 18", revenue: 28500 },
  { date: "Jun 19", revenue: 44100 },
  { date: "Jun 20", revenue: 39500 },
];

export const mockCategoryData = [
  { name: "Grains & Rice", value: 185000, fill: "hsl(250, 90%, 65%)" },
  { name: "Beverages", value: 98000, fill: "hsl(280, 90%, 65%)" },
  { name: "Dairy", value: 76000, fill: "hsl(200, 90%, 65%)" },
  { name: "Snacks", value: 62000, fill: "hsl(150, 90%, 55%)" },
  { name: "Household", value: 54000, fill: "hsl(30, 90%, 60%)" },
  { name: "Personal Care", value: 45000, fill: "hsl(350, 90%, 60%)" },
];

export const mockTopProducts = [
  { name: "Basmati Rice", sales: 245, revenue: 355250 },
  { name: "Tata Gold Tea", sales: 198, revenue: 63360 },
  { name: "Aashirvaad Atta", sales: 176, revenue: 66880 },
  { name: "Amul Butter", sales: 154, revenue: 41580 },
  { name: "Maggi Noodles", sales: 143, revenue: 24024 },
];

export const mockAcquisitionData = [
  { month: "Jan", newCustomers: 45, returning: 75 },
  { month: "Feb", newCustomers: 52, returning: 93 },
  { month: "Mar", newCustomers: 68, returning: 110 },
  { month: "Apr", newCustomers: 55, returning: 110 },
  { month: "May", newCustomers: 72, returning: 126 },
  { month: "Jun", newCustomers: 89, returning: 145 },
];

export const mockAiMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    content: "Hello! I'm your AI commerce assistant. I can help you with inventory management, sales analysis, marketing strategies, and more. What would you like to know?",
    timestamp: "2026-06-20T10:00:00Z",
  },
];

export const suggestedQuestions = [
  "What are my top selling products this month?",
  "Which products are running low on stock?",
  "Show me revenue trends for Q2 2026",
  "Suggest a marketing campaign for the festive season",
  "How can I reduce order cancellations?",
  "Which customers haven't ordered in 30 days?",
];

export const mockAiInsights = [
  {
    id: "ai1",
    title: "Stock Alert",
    description: "Tata Gold Tea and Haldiram's Namkeen are running low. Consider reordering from Rajesh Distributors and Haldiram's Distributors.",
    type: "warning" as const,
    action: "Reorder Now",
  },
  {
    id: "ai2",
    title: "Revenue Opportunity",
    description: "Basmati Rice sales increased 32% this month. Consider bundling with Aashirvaad Atta for a combo offer.",
    type: "success" as const,
    action: "Create Bundle",
  },
  {
    id: "ai3",
    title: "Customer Re-engagement",
    description: "18 customers haven't placed an order in 30+ days. A targeted WhatsApp campaign could bring them back.",
    type: "info" as const,
    action: "Start Campaign",
  },
  {
    id: "ai4",
    title: "Pricing Insight",
    description: "Your margin on Cooking Oil is only 16.7%. Competitors are pricing 8% higher. Consider a price adjustment.",
    type: "info" as const,
    action: "Review Pricing",
  },
];

export const dashboardStats = {
  totalRevenue: { value: 2371000, change: 12.5, period: "vs last month" },
  totalOrders: { value: 1040, change: 8.3, period: "vs last month" },
  totalCustomers: { value: 856, change: 15.2, period: "vs last month" },
  totalProducts: { value: 248, change: -2.1, period: "vs last month" },
};
