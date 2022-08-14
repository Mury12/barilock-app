import { Company } from "@/types/Company";
import { Menu } from "@/types/Menu";
import { AxiosClient } from "./AxiosClient";
import { ws } from "./ws-routes";

class CompanyService extends AxiosClient {
  constructor() {
    super({
      baseURL: ws.URL,
    });
  }
  async fetchCompanies() {
    const { data: companies } = await this.get<Company[]>(ws.COMPANY.BASE);
    return companies;
  }
  async fetchProducts(companyId: number) {
    const { data: products } = await this.get<Menu>(ws.COMPANY.MENU(companyId));
    return products || [];
  }
}

const companyApi = new CompanyService();
export default companyApi;
