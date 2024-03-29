import { Customer } from "@/types/Customer";
import { AxiosClient } from "./AxiosClient";
import { ws } from "./ws-routes";

class CustomerService extends AxiosClient {
  constructor() {
    super({
      baseURL: ws.URL,
    });
  }

  async createCustomer(customer: Customer) {
    await this.post(ws.CUSTOMER.BASE, customer);
  }

  async fetchCustomers(companyId: number) {
    const { data: customers } = await this.get<Customer[]>(
      ws.COMPANY.CUSTOMERS(companyId)
    );
    return customers;
  }
}

const customerApi = new CustomerService();
export default customerApi;
