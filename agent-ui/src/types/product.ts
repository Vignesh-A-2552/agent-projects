export interface Product {
  id: string;
  name: string;
  discount_price: number;
  price: number;
  main_category: string;
  sub_category: string;
  ratings: number;
  review_count: number;
  images: string[];
  stock_quantity: number;
  in_stock: boolean;
  shipping: string;
  return_policy?: string;
  warranty?: string;
  colors?: string[];
  storage?: string[];
  description?: string;
  features?: string[];
  badges?: string[];
  recent_purchases?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CheckoutInfo {
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: 'card' | 'paypal' | 'other';
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  checkoutInfo: CheckoutInfo;
}
