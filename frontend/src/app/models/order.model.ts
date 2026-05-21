export interface OrderItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

export interface Order {
  id?: number;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: string;
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  items?: OrderItem[];
  createdAt?: number;
  updatedAt?: number;
}
