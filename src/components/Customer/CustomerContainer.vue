<template>
  <div v-if="company?.id">
    <floating-menu
      :canAdd="canAddTable"
      :canRemove="canRemoveTable"
      @add="addTable"
      @remove="removeTable"
    />
    <b-row>
      <b-col cols="12">
        <customer-filter v-if="false" />
      </b-col>
      <b-col cols="12" class="table-wrapper d-flex">
        <customer
          v-for="(customer, index) in customers"
          :customer="customer"
          :key="index"
          @select="selectCustomer"
        />
      </b-col>
    </b-row>

    <!-- MODALS -->
    <order-modal
      :customer="getCustomer()"
      :order="order"
      :products="products"
      @submit="addItemToOrder"
    />
    <create-customer-modal
      :openOrderAfterInsert="openOrderAfterInsert"
      :index="selectedCustomer + 1"
      :companyId="+company.id"
    />
    <b-modal hide-footer id="close-order-modal" title="Encerrar comanda">
      <b-checkbox name="order-paid" v-model="orderIsPaid"
        >Esta comanda foi paga</b-checkbox
      >
      <b-button variant="success" class="mt-3" @click="endOrder"
        >Enviar</b-button
      >
    </b-modal>
    <!-- END MODALS -->
  </div>
  <div v-else>
    <h5>Selecione um bar para mostrar mesas</h5>
  </div>
</template>

<script>
import Customer from "./Customer.vue";
import CustomerFilter from "./CustomerFilter.vue";
import OrderModal from "./OrderModal.vue";
import customers from "../../mixins/customers";
import orders from "../../mixins/orders";
import CreateCustomerModal from "./CreateCustomerModal.vue";
import companies from "../../mixins/companies";
import FloatingMenu from "./FloatingMenu.vue";

export default {
  name: "CustomerContainer",
  components: {
    Customer,
    CustomerFilter,
    OrderModal,
    CreateCustomerModal,
    FloatingMenu,
  },
  mixins: [customers, orders, companies],
  data() {
    return {
      filteredCustomers: [],
      selectedCustomer: -1,
      search: "",
      availableTables: [],
      orderIsPaid: true,
      filter: {
        occupied: false,
        available: false,
      },
    };
  },
  props: {
    company: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    canAddTable() {
      return this.customers.length < (+this.selectedCompany?.size || 1e6);
    },
    canRemoveTable() {
      return !!(
        this.customers.length > 0 &&
        this.customers.reduce((acc, t) => (acc += t.name ? 0 : 1), 0)
      );
    },
    customerOrderTotal() {
      if (this.selectedTable?.order?.items) {
        return [this.selectedTable?.order?.items]
          .flat()
          .reduce((prev, curr) => (prev += +curr.total), 0);
      }
      return 0;
    },
  },
  watch: {
    search() {
      this.searchTable();
    },
    company(company) {
      this.customer.companyId = company.id;
      this.customers.splice(0);
      this.selectCompany(company);
      this.fetchCustomers(company.id);
      this.fetchProducts(company.id);
    },
    filter: {
      deep: true,
      handler() {
        this.filterTables();
      },
    },
    tables: {
      deep: true,
      handler() {
        this.filterTables();
        this.searchTable();
      },
    },
    selectedCustomer() {
      this.customer.tableNum = this.customers[this.selectedCustomer].tableNum;
    },
  },
  methods: {
    async endOrder() {
      await this.closeOrder(this.getCustomer());
      this.customers[this.selectedCustomer] = {
        tableNum: String(this.selectedCustomer + 1),
      };
      await this.fetchCustomers(this.company.id);
    },
    async addItemToOrder(orderId) {
      await this.addItem(orderId);
      await this.fetchCustomers(this.company.id);
    },
    getCustomer() {
      if (~this.selectedCustomer && this.customers[this.selectedCustomer].id) {
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
    sortTables() {
      this.customers = this.customers.sort((a, b) =>
        a.tableNum > b.tableNum ? 1 : -1
      );
    },
  },
};
</script>

<style>
.table-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
