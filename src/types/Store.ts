import { Company } from "./Company";
import { Customer } from "./Customer";
import { Menu } from "./Menu";

export interface Store {
  customers: Customer[];
  products: Menu;
  companies: Company[];
  curCompany?: Company;
  count: number;
}
