export interface LocalizedContent {
  name: string;
  description: string;
  benefits: string[];
}

export interface Product {
  id: string;
  price: number;
  currency: string;
  category: string;
  element: string;
  image: string;
  inStock: boolean;
  ar: LocalizedContent;
  en: LocalizedContent;
}

export type InventoryData = Record<string, boolean>;
export type PricesData = Record<string, number>;
export type ProductsData = Record<string, Product>;

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  image: string;
}

export interface Order {
  id: string;
  createdAt: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  userName: string;
  userPhone: string;
  userLocation: string;
}

export type OrdersData = Record<string, Order>;
