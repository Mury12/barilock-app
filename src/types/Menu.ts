import { Moment } from "moment";
import { Product } from "./Product";

export interface MenuItem {
  companyId: number;
  createdAt: Moment;
  description?: string;
  id: number;
  price: number;
  product: Product;
  productId: number;
  status: number;
  updatedAt?: Moment;
}

export type Menu = MenuItem[];
