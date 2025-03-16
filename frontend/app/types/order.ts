export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  customer: {
    id: number;
    name: string;
  };
  order_date: string;
  status: OrderStatus;
  items: Array<{
    id: number;
    item: {
      id: number;
      name: string;
      unit_price: number;
    };
    quantity: number;
    unit_price: number;
  }>;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
} 