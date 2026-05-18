export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock?: number;
  stockQuantity?: number;
  category?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: number;
  updatedAt?: number;
}