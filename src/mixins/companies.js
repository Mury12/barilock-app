import companyApi from "@/common/CompanyService";

export default {
  data() {
    return {
      products: [],
      companies: [],
      selectedCompany: undefined,
    };
  },
  methods: {
    async selectCompany(company) {
      this.selectedCompany = company;
      this.availableTables = new Array(+this.selectedCompany.size)
        .fill(0)
        .map((_, i) => i + 1);
    },
    async fetchCompanies() {
      const companies = await companyApi.fetchCompanies();
      this.companies = companies;
      if (!this.selectedCompany) this.selectCompany(companies[0]);
    },
    async fetchProducts(companyId) {
      this.products = await companyApi.fetchProducts(companyId);
    },
  },
};
