export interface Named {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Category extends Named {}
export interface Brand extends Named {}
export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description?: string;
  quantity: number;
  sold?: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  category: Named;
  subcategory?: Subcategory[];
  brand?: Named;
  ratingsAverage: number;
  ratingsQuantity: number;
  createdAt?: string;
}

export interface Metadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface ListResponse<T> {
  results: number;
  metadata?: Metadata;
  data: T[];
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: string;
  keyword?: string;
  category?: string;
  brand?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Pick<Product, "_id" | "title" | "imageCover" | "quantity" | "ratingsAverage"> & {
    category?: Named;
    brand?: Named;
  };
}

export interface Cart {
  cartId: string | null;
  numOfCartItems: number;
  totalCartPrice: number;
  products: CartItem[];
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface SavedAddress extends ShippingAddress {
  _id: string;
  name: string;
}

export interface Order {
  _id: string;
  id?: number;
  shippingAddress?: ShippingAddress;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  createdAt: string;
  cartItems: {
    _id: string;
    count: number;
    price: number;
    product: Pick<Product, "_id" | "title" | "imageCover"> & { category?: Named; brand?: Named };
  }[];
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  user: { _id: string; name: string };
}
