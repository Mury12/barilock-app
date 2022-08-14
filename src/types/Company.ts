import { Moment } from "moment";

export interface Company {
  createdAt: Moment;
  currency: "R$" | "USD";
  description?: string;
  id: string;
  name: string;
  size: string;
  taxId: string;
  updatedAt?: Moment;
}
