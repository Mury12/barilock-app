import env from "../../ws-routes";

export default {
  data() {
    return {
      customers: [],
      customer: {
        name: "",
        companyId: undefined,
        tableNum: undefined,
      },
    };
  },
  methods: {
    addOrUpdateCustomer(customer, sort = false) {
      const customerIdx = this.customers.findIndex(
        (t) => +t.tableNum === +customer.tableNum
      );
      console.debug(customerIdx, customer.tableNum, this.customers);
      if (!~customerIdx) this.customers.push(customer);
      else {
        this.customers[customerIdx] = customer;
      }
      this.sortAvailableTables();
      if (sort) this.sortTables();
    },
    syncAvailableTables(tableNum) {
      const tableIdx = this.availableTables.findIndex(
        (num) => num === tableNum
      );
      if (~tableIdx) this.availableTables.splice(tableIdx, 1);
    },
    sortAvailableTables() {
      this.availableTables.sort((a, b) => (a > b ? 1 : -1));
    },

    async createCustomer() {
      try {
        await this.$http.post(env.WS.CUSTOMER.BASE, this.customer);

        this.customer.name = "";
        this.$bvToast.toast("Cliente adicionado com sucesso.", {
          variant: "success",
        });

        await this.fetchCustomers(this.selectedCompany.id);
        this.refreshFilters();
        this.$bvModal.hide("new-customer-modal");

        const currentTable = this.selectedTable;
        this.selectedTable = -1;
        this.selectedTable = currentTable;

        if (this.openOrderAfterInsert) {
          setTimeout(() => {
            this.$bvModal.show("table-modal");
          }, 200);
        }
      } catch (error) {
        console.error(error);
        this.$bvToast.toast("Erro ao criar cliente", {
          variant: "error",
        });
      }
    },
    async fetchCustomers(companyId) {
      const customers = await this.$http.get(
        env.WS.COMPANY.CUSTOMERS(companyId)
      );

      if (Array.isArray(customers)) {
        customers.forEach((customer) => {
          if (customer.tableNum) {
            this.addOrUpdateCustomer(customer);
            this.syncAvailableTables(+customer.tableNum);
          }
        });
      }
      this.sortTables();
      this.filterTables();
    },
  },
};
