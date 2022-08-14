import { Moment } from "moment";

export interface ProductType {
  createdAt: Moment;
  id: number;
  measurement: "mL" | "L" | "g" | "kg";
  name: string;
  updatedAt?: Moment;
}

export interface Product {
  companyId: number;
  createdAt: Moment;
  description: string;
  id: number;
  name: string;
  type: ProductType;
  typeId: number;
}
