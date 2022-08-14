import { Company } from "@/types/Company";
import { Customer } from "@/types/Customer";
import { Menu } from "@/types/Menu";
import { Store } from "@/types/Store";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: (): Store => ({
    companies: [],
    products: [],
    customers: [],
    curCompany: undefined,
    count: 0,
  }),
  getters: {
    getProducts: (state) => state.products,
    getCompanies: (state) => state.companies,
    getCustomers: (state) => state.customers,
    getCurrentCompany: (state) => state.curCompany,
    getCurrency: (state) => state.curCompany?.currency || "R$",
  },
  actions: {
    setCustomers(payload: Customer[]) {
      this.customers = payload;
    },
    setCompanies(payload: Company[]) {
      this.companies = payload;
    },
    setCurrentCompany(payload: Company) {
      this.curCompany = payload;
    },
    setProducts(payload: Menu) {
      this.products = payload;
    },
  },
});
