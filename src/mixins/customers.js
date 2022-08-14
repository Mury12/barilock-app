import customerApi from "@/common/CustomerService";

export default {
  data() {
    return {
      customers: [],
      availableTables: [],
      search: "",
      filter: {
        occupied: false,
        available: false,
      },
      filteredCustomers: [],
      selectedCustomer: -1,
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
    sortTables() {
      this.customers = this.customers.sort((a, b) =>
        a.tableNum > b.tableNum ? 1 : -1
      );
    },
    async createCustomer() {
      try {
        await customerApi.createCustomer(this.customer);

        this.customer.name = "";
        this.$bvToast.toast("Cliente adicionado com sucesso.", {
          variant: "success",
        });
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
      const customers = await customerApi.fetchCustomers(companyId);

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
    getCustomer() {
      if (~this.selectedCustomer && this.customers[this.selectedCustomer]?.id) {
        return this.customers[this.selectedCustomer];
      }
      return undefined;
    },
    removeTable() {
      const removeIdx = this.customers
        .map((t) => t.name)
        .lastIndexOf(undefined);
      if (~removeIdx) {
        this.availableTables.push(this.customers[removeIdx].tableNum);
        this.customers.splice(removeIdx, 1);
      }
      this.sortAvailableTables();
    },
    addTable() {
      this.customers.push({
        tableNum: this.availableTables[0],
      });
      this.availableTables.shift();
      this.sortAvailableTables();
    },
    selectCustomer(tableNum) {
      this.selectedCustomer = this.customers.findIndex(
        (t) => t.tableNum === tableNum
      );
      if (this.getCustomer()?.id) {
        this.$bvModal.show("table-modal");
      } else {
        this.$bvModal.show("new-customer-modal");
      }
    },
    searchTable() {
      const search = this.search;
      if (!search.length) {
        this.filterTables();
      } else {
        this.filteredTables = this.filteredTables.filter((table, index) => {
          return (
            String(index + 1).includes(search) ||
            table?.tableNum.includes(search) ||
            table?.name?.toLowerCase().includes(search.toLowerCase())
          );
        });
      }
    },

    filterTables() {
      const filter = this.filter;
      if (
        (!filter.occupied && !filter.available) ||
        (filter.occupied && filter.available)
      ) {
        this.filteredTables = this.customers;
      } else {
        this.filteredTables = this.filteredTables.filter(
          (t) =>
            (filter.occupied && t.orderId) || (filter.available && !t.orderId)
        );
      }
    },

    refreshFilters() {
      const aux = { ...this.filter, search: this.search };
      if (this.filter.occupied || this.filter.available) {
        this.filter = {
          occupied: aux.occupied,
          available: aux.available,
        };
      } else {
        this.searchTable();
      }
    },
  },
};
