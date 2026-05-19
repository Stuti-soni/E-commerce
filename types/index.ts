export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'phones' | 'laptops' | 'headphones';
  picture: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  products: object;
  name: string;
  email: string;
  address: string;
  city: string;
  paid: 0 | 1;
  createdAt: string;
}
