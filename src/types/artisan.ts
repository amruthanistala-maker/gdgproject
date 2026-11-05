export interface Village {
  id: string;
  name: string;
  district: string;
  state: 'Andhra Pradesh' | 'Telangana' | 'Karnataka';
  specialty: string;
  giTagNumber: string;
  historicalEra: string;
  primaryMaterials: string[];
  cooperativeName: string;
  hubName: string;
  artisanCount: number;
  description: string;
  imageUrl: string;
  coordinates: [number, number]; // [latitude, longitude]
}

export type CraftCategory = 'Wooden Crafts' | 'Cloth & Textiles' | 'Jute & Fiber' | 'Leather Art' | 'Metal & Brass' | 'Bamboo & Tribal';

export interface Product {
  id: string;
  name: string;
  teluguName?: string;
  village: string;
  district: string;
  state: string;
  price: number;
  originalPrice?: number;
  material: string;
  dyesAndFinish: string;
  coopStatus: 'Coop-Verified' | 'GI-Certified' | 'Master Craftsman';
  artisanName: string;
  hub: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Crafted to Order';
  category: CraftCategory;
  description: string;
  dimensions: string;
  weight: string;
  giCertified: boolean;
  imageUrl: string;
  craftProcess: string;
  careInstructions: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  village: string;
  hub: string;
  artisanName: string;
  material: string;
  price: number;
  quantity: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  orderType: 'Standard' | 'Custom Request' | 'Cooperative Direct';
  customNotes?: string;
  paymentMethod: 'UPI / QR' | 'Cash on Delivery' | 'Artisan Direct Advance';
  status: 'Booked' | 'Cooperative Assigned' | 'Handcrafting & QC' | 'Dispatched' | 'Delivered';
  createdAt: string;
  estimatedDelivery: string;
}

export interface CraftScanResult {
  detectedCraft: string;
  probableVillage: string;
  specialtyMatch: string;
  materialAnalysis: string;
  authenticityRating: string;
  giTagStatus: string;
  distinguishingFeatures: string[];
  recommendedActions: string;
  matchedCatalogId?: string;
}
