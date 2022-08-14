import { Moment } from "moment";

export interface Order {
  createdAt: Moment;
  id: number;
  items: OrderItem[];
  paid: boolean;
  status: "open" | "closed";
  totalPrice: number;
  updatedAt?: Moment;
}

export interface OrderItem {
  amount: number;
  createdAt: Moment;
  description: string;
  id: number;
  name: string;
  price: number;
  status: string;
  total: number;
  type: string;
}
