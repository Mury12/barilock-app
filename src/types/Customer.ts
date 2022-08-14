import { Moment } from "moment";
import { Order } from "./Order";

export interface Customer {
  id: number;
  name: string;
  tableNum: number;
  order: Order;
  orderId: number;
  companyId: number;
  createdAt: Moment;
  updatedAt?: Moment;
}
