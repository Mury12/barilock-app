import { Customer } from "@/types/Customer";
import { ws } from "@/common/ws-routes";
import { AxiosClient } from "./AxiosClient";
import ExceptionFactory from "./errors/ExceptionFactory";

interface AddItemArgs {
  menuItemId: number;
  amount: number;
}

class OrderService extends AxiosClient {
  constructor() {
    super({
      baseURL: ws.URL,
    });
  }

  async addItem(orderId: number, item: AddItemArgs) {
    if (item.menuItemId && item.amount >= 1) {
      await this.post(ws.ORDER.BYID(orderId), item);
      return true;
    } else {
      throw ExceptionFactory.itemNotSet();
    }
  }
  async closeOrder(customer: Customer, paid: boolean) {
    await this.put(ws.ORDER.BYID(customer.order.id), {
      status: "closed",
      paid: +paid,
    });
  }
}

const orderApi = new OrderService();
export default orderApi;
